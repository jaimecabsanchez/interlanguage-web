// ============================================================
//  Reserva de llamadas · pruebas de INTEGRACIÓN
//  La Edge Function de verdad + base de datos Postgres real (con la migración 0008) + Google Calendar y
//  Resend simulados. Nunca toca la agenda real ni envía correos.
//
//  Necesita un Postgres local de pruebas y Python con psycopg:
//     IL_TEST_PG="postgresql://postgres@127.0.0.1:55432/postgres" IL_TEST_PYTHON=python3 \
//       node --test supabase/tests/llamadas/integration.test.mjs
//  Sin IL_TEST_PG las pruebas se saltan.
// ============================================================
import test, { before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { generateKeyPairSync, randomBytes, randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as m from "../../functions/call-booking/index.ts";
import { createFakeGoogle, createFakeResend, routerFetch } from "./local/fakes.mjs";

const PG = process.env.IL_TEST_PG;
const PY = process.env.IL_TEST_PYTHON || "python3";
const here = path.dirname(fileURLToPath(import.meta.url));
const skip = !PG;
const KEY = "sb_secret_test";
const ORIGIN = "https://interlanguage.es";
const BOOKING_CAL = "reservas-prueba@group.calendar.google.com";
const PERSONAL_CAL = "agenda-prueba@example.com";
const CLIENT_EMAIL = "reservas@prueba.iam.gserviceaccount.com";
const ADMIN = randomBytes(24).toString("hex");

let shim, rest, google, resend, handler, env, nowOverride = null;
const logs = [];

async function exec(sql, params) {
  const r = await fetch(rest + "/__exec", { method: "POST", headers: { "X-Exec-Key": KEY, "Content-Type": "application/json" }, body: JSON.stringify({ sql, params }) });
  if (!r.ok) throw new Error("exec " + r.status + " " + (await r.text()));
  return (await r.json()).rows;
}
const ALL_DAY = { mon: [["08:00", "21:00"]], tue: [["08:00", "21:00"]], wed: [["08:00", "21:00"]], thu: [["08:00", "21:00"]], fri: [["08:00", "21:00"]], sat: [["08:00", "21:00"]], sun: [["08:00", "21:00"]] };
async function configure({ enabled = true, hours = ALL_DAY, buffer = 0, notice = 60, weeks = 3, maxPerDay = null } = {}) {
  await exec("update public.call_settings set enabled = false");
  await exec("update public.call_settings set weekly_hours = %s::jsonb, buffer_minutes = %s, min_notice_minutes = %s, bookable_weeks = %s, max_per_day = %s, enabled = %s",
    [JSON.stringify(hours), buffer, notice, weeks, maxPerDay, enabled]);
}

function call(method, { query = "", body, headers = {} } = {}) {
  const init = { method, headers: { Origin: ORIGIN, ...headers } };
  if (body !== undefined) { init.body = JSON.stringify(body); init.headers["Content-Type"] = "application/json"; }
  return handler(new Request("https://ref.supabase.co/functions/v1/call-booking" + query, init)).then(async (r) => ({ status: r.status, headers: r.headers, body: r.status === 204 ? null : await r.json() }));
}
const availability = (week) => call("GET", { query: "?action=availability" + (week ? "&week=" + week : "") });

// Primer hueco libre a partir de mañana (los datos dependen de la fecha real de la prueba)
async function slots(n = 1, { skip = 0, sameDay = false } = {}) {
  const tomorrow = m.addDays(m.madridDate(Date.now()), 1);
  const out = [];
  let week = null;
  for (let i = 0; i < 4 && out.length < n + skip; i++) {
    const r = await availability(week);
    assert.equal(r.status, 200, JSON.stringify(r.body));
    for (const d of r.body.days) {
      if (d.date < tomorrow) continue;
      if (sameDay && out.length && d.date !== out[0].date) continue;
      for (const s of d.slots) out.push({ ...s, date: d.date });
    }
    week = r.body.week.next;
    if (!week) break;
  }
  return out.slice(skip, skip + n);
}
function bookBody(slot, over = {}) {
  return {
    action: "book", idempotencyKey: randomUUID(), slotStart: slot.start, lang: "es", website: "",
    contact: { fullName: "Familia Prueba", email: "familia@example.com", phone: "+34 600 000 001", rgpd: true },
    consult: { service: "extranjero", serviceLabel: "Estudiar en el extranjero", studentAge: "14 años",
      serviceExtra: "Destino: Irlanda · Alumno/a: Lucía", callContext: "Destino: Irlanda", message: "Queremos saber plazos" },
    ...over,
  };
}
const dbBooking = async (id) => { const [status, google_event_id] = (await exec("select status, google_event_id from public.call_bookings where id = %s", [id]))[0]; return { status, google_event_id }; };

before(async () => {
  if (skip) return;
  shim = spawn(PY, [path.join(here, "local", "postgrest_shim.py"), "--admin-url", PG, "--key", KEY], { stdio: ["ignore", "pipe", "inherit"] });
  rest = await new Promise((resolve, reject) => {
    let buf = "";
    shim.stdout.on("data", (d) => { buf += d; const mm = buf.match(/READY (\S+)/); if (mm) resolve(mm[1]); });
    shim.on("exit", (c) => reject(new Error("el intermediario terminó: " + c)));
    setTimeout(() => reject(new Error("el intermediario no arrancó")), 30000);
  });
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  google = createFakeGoogle({ publicKey, clientEmail: CLIENT_EMAIL, bookingCalendarId: BOOKING_CAL, personalCalendarId: PERSONAL_CAL });
  resend = createFakeResend();
  env = {
    SUPABASE_URL: rest, IL_SERVICE_KEY: KEY,
    IL_CALLS_GOOGLE_SA: JSON.stringify({ client_email: CLIENT_EMAIL, private_key: privateKey.export({ type: "pkcs8", format: "pem" }) }),
    IL_CALLS_BOOKING_CALENDAR_ID: BOOKING_CAL, IL_CALLS_BUSY_CALENDAR_IDS: PERSONAL_CAL,
    IL_CALLS_SECRET: randomBytes(32).toString("hex"), IL_CALLS_ADMIN_TOKEN: ADMIN,
    RESEND_API_KEY: "re_test", MAIL_FROM: "Interlanguage <no-reply@example.com>", IL_CALLS_NOTIFY_TO: "equipo@example.com",
    IL_CALLS_ALLOWED_ORIGINS: ORIGIN,
  };
  handler = m.createHandler({ env: (k) => env[k], fetch: routerFetch({ google, resend }), now: () => nowOverride ?? Date.now(), log: (evt, data) => logs.push({ evt, ...data }) });
});
after(() => { if (shim) shim.kill("SIGTERM"); });
beforeEach(async () => {
  if (skip) return;
  nowOverride = null;
  google.reset(); resend.reset();
  await exec("truncate public.call_notifications, public.call_bookings, public.call_rate_events, public.call_exceptions");
  await configure();
});

test("sin configurar: no se muestran horarios", { skip }, async () => {
  await configure({ enabled: false });
  assert.deepEqual((await availability()).body, { status: "not_configured" });
  const saved = env.IL_CALLS_GOOGLE_SA; delete env.IL_CALLS_GOOGLE_SA;
  await configure();
  assert.deepEqual((await availability()).body, { status: "not_configured" }, "sin la cuenta de Google tampoco");
  env.IL_CALLS_GOOGLE_SA = saved;
});

test("disponibilidad: semana, días, huecos de 30 min y navegación", { skip }, async () => {
  const r = await availability();
  assert.equal(r.status, 200);
  assert.equal(r.body.status, "ok");
  assert.equal(r.body.timezone, "Europe/Madrid");
  assert.equal(r.body.days.length, 7);
  assert.equal(r.body.week.prev, null);
  assert.ok(r.body.week.next);
  assert.deepEqual(r.body.workdays, [1, 2, 3, 4, 5, 6, 7]);
  assert.ok(r.body.firstAvailable);
  const s = r.body.days.flatMap((d) => d.slots);
  assert.ok(s.length > 0 && s.every((x) => /^\d\d:\d\d$/.test(x.time) && (Date.parse(x.start) - Date.now()) >= 60 * 60000), "nada antes de la antelación mínima");
  assert.equal(r.headers.get("access-control-allow-origin"), ORIGIN);
  assert.equal(r.headers.get("cache-control"), "no-store");
  const far = await availability("2099-01-05");
  assert.equal(far.body.week.next, null, "no se pasa de las semanas reservables");
});

test("Google ocupado (con margen) y fallos de Google: sin horarios inventados", { skip }, async () => {
  await configure({ buffer: 15 });
  const [a] = await slots(1);
  const busyStart = Date.parse(a.start) + 60 * 60000;   // una hora después del primer hueco
  google.state.personalBusy = [{ start: new Date(busyStart).toISOString(), end: new Date(busyStart + 30 * 60000).toISOString() }];
  const free = (await slots(40, { sameDay: true })).map((x) => Date.parse(x.start));
  assert.ok(!free.includes(busyStart), "el hueco ocupado no aparece");
  assert.ok(!free.includes(busyStart - 30 * 60000) && !free.includes(busyStart + 30 * 60000), "ni los pegados (margen de 15 min)");
  assert.ok(free.includes(busyStart - 60 * 60000) || free.includes(busyStart + 60 * 60000));
  google.state.mode.freebusy = "500";
  let r = await availability();
  assert.equal(r.status, 503);
  assert.deepEqual(r.body, { status: "unavailable" });
  google.state.mode.freebusy = "calendarError";
  r = await availability();
  assert.equal(r.status, 503, "si una agenda no responde, no se devuelven huecos");
  google.state.mode = { token: "401" };
  const fresh = m.createHandler({ env: (k) => env[k], fetch: routerFetch({ google, resend }), log: () => {} });   // sin token en caché
  const r2 = await fresh(new Request("https://ref.supabase.co/functions/v1/call-booking?action=availability", { headers: { Origin: ORIGIN } }));
  assert.equal(r2.status, 503, "si Google rechaza la cuenta de servicio, tampoco hay huecos");
});

test("reserva correcta: evento de 30 min, avisos a familia y equipo, sin datos de más", { skip }, async () => {
  const [s] = await slots(1);
  const r = await call("POST", { body: bookBody(s) });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.equal(r.body.status, "confirmed");
  assert.equal(r.body.booking.time, s.time);
  assert.equal(r.body.booking.durationMinutes, 30);
  assert.equal(r.body.booking.phone, "+34 600 000 001");
  assert.match(r.body.cancelUrl, /^https:\/\/interlanguage\.es\/llamada\.html#id=[0-9a-f-]{36}&t=[\w-]{43}$/);
  assert.deepEqual(r.body.email, { family: "sent", staff: "sent" });
  const ev = google.activeEvents();
  assert.equal(ev.length, 1);
  assert.equal(Date.parse(ev[0].end.dateTime) - Date.parse(ev[0].start.dateTime), 30 * 60000);
  assert.equal(ev[0].start.dateTime, new Date(s.start).toISOString());
  assert.ok(ev[0].description.includes("+34 600 000 001") && !JSON.stringify(ev[0]).includes("familia@example.com") && !JSON.stringify(ev[0]).includes("Lucía"));
  assert.equal((await dbBooking(r.body.booking.id)).status, "confirmed");
  assert.equal(resend.state.sent.length, 2);
  const fam = resend.state.sent.find((x) => x.to[0] === "familia@example.com");
  const staff = resend.state.sent.find((x) => x.to[0] === "equipo@example.com");
  assert.ok(fam.text.includes("Tu llamada está reservada") && fam.text.includes(r.body.cancelUrl));
  assert.ok(staff.text.includes("Alumno/a: Lucía") && staff.text.includes("Queremos saber plazos"));
  const again = await availability();
  assert.ok(!again.body.days.flatMap((d) => d.slots).some((x) => x.start === s.start), "el hueco reservado desaparece");
});

test("doble clic y reintentos: la misma clave nunca crea dos reservas ni dos eventos", { skip }, async () => {
  const [s] = await slots(1);
  const body = bookBody(s);
  const rs = await Promise.all([call("POST", { body }), call("POST", { body }), call("POST", { body })]);
  assert.ok(rs.every((r) => r.status === 200 || r.status === 202), rs.map((r) => r.status).join(","));
  for (let i = 0; i < 5 && rs.some((r) => r.status === 202); i++) {
    await new Promise((r) => setTimeout(r, 300));
    for (const k of rs.keys()) if (rs[k].status === 202) rs[k] = await call("POST", { body });
  }
  const ids = new Set(rs.map((r) => r.body.booking.id));
  assert.equal(ids.size, 1);
  assert.equal(google.activeEvents().length, 1);
  const n = (await exec("select count(*)::int from public.call_bookings"))[0][0];
  assert.equal(n, 1);
  const replay = await call("POST", { body });
  assert.equal(replay.status, 200);
  assert.equal(replay.body.cancelUrl, rs[0].body.cancelUrl, "el reintento devuelve la misma reserva y el mismo enlace");
  assert.equal(resend.state.sent.length, 2, "y no repite los correos");
  const other = await call("POST", { body: { ...body, slotStart: (await slots(1, { skip: 2 }))[0].start } });
  assert.equal(other.status, 409);
  assert.equal(other.body.status, "expired_key", "la misma clave para otra hora se rechaza");
});

test("dos familias a la vez al mismo hueco: una reserva y la otra elige otra hora", { skip }, async () => {
  const [s] = await slots(1);
  const a = bookBody(s), b = bookBody(s, { contact: { ...bookBody(s).contact, phone: "+34 600 000 002", email: "otra@example.com" } });
  const [ra, rb] = await Promise.all([call("POST", { body: a }), call("POST", { body: b })]);
  const st = [ra.status, rb.status].sort();
  assert.deepEqual(st, [200, 409], JSON.stringify([ra.body, rb.body]));
  const loser = ra.status === 409 ? ra : rb;
  assert.equal(loser.body.status, "slot_taken");
  assert.equal(google.activeEvents().length, 1);
  const many = await Promise.all(Array.from({ length: 6 }, (_, i) => call("POST", { body: bookBody((s), { contact: { ...a.contact, phone: "+34 61100000" + i } }) })));
  assert.ok(many.every((r) => r.status === 409), "con el hueco ya reservado, nadie más entra");
});

test("Google crea el evento pero la respuesta se pierde: el reintento no lo duplica", { skip }, async () => {
  const [s] = await slots(1);
  const body = bookBody(s);
  google.state.mode.insert = "500_after_create";
  const r1 = await call("POST", { body });
  assert.equal(r1.status, 503);
  assert.deepEqual(r1.body, { status: "unavailable", retry: true });
  const row = (await exec("select status from public.call_bookings"))[0][0];
  assert.equal(row, "pending", "el hueco sigue retenido");
  assert.equal(resend.state.sent.length, 0, "sin correo hasta que se confirme");
  google.state.mode = {};
  const r2 = await call("POST", { body });
  assert.equal(r2.status, 200);
  assert.equal(google.activeEvents().length, 1);
  assert.equal(resend.state.sent.length, 2);
  google.reset(); resend.reset();
  const [t] = await slots(1);
  const body2 = bookBody(t);
  google.state.mode.insert = "timeout_after_create";
  assert.equal((await call("POST", { body: body2 })).status, 503);
  google.state.mode = {};
  assert.equal((await call("POST", { body: body2 })).status, 200);
  assert.equal(google.activeEvents().length, 1, "tampoco con un tiempo de espera agotado");
});

test("Google falla sin crear el evento: el reintento lo crea; si lo rechaza, el hueco se libera", { skip }, async () => {
  const [s] = await slots(1);
  const body = bookBody(s);
  google.state.mode.insert = "500";
  assert.equal((await call("POST", { body })).status, 503);
  google.state.mode = {};
  const ok = await call("POST", { body });
  assert.equal(ok.status, 200);
  assert.equal(google.activeEvents().length, 1);
  const [t] = await slots(1);
  google.state.mode.insert = "403";
  const r = await call("POST", { body: bookBody(t, { contact: { ...body.contact, phone: "+34 600 000 009" } }) });
  assert.equal(r.status, 503);
  assert.equal(r.body.retry, false);
  assert.ok((await exec("select count(*)::int from public.call_bookings where status = 'expired'"))[0][0] === 1, "la reserva rechazada queda liberada");
  google.state.mode = {};
  assert.ok((await availability()).body.days.flatMap((d) => d.slots).some((x) => x.start === t.start), "y el hueco vuelve a ofrecerse");
});

test("correo: si falla, la reserva sigue confirmada y el aviso se reintenta sin duplicar nada", { skip }, async () => {
  const [s] = await slots(1);
  resend.state.mode = "fail";
  const r = await call("POST", { body: bookBody(s) });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.email, { family: "failed", staff: "failed" });
  assert.equal(google.activeEvents().length, 1);
  const st = await exec("select kind, status, attempts from public.call_notifications order by kind");
  assert.deepEqual(st.map((x) => x[1]), ["failed", "failed"]);
  resend.state.mode = null;
  const noAuth = await call("POST", { body: { action: "retry-notifications" } });
  assert.equal(noAuth.status, 401, "el reintento manual requiere la clave de administración");
  const rr = await call("POST", { body: { action: "retry-notifications" }, headers: { "x-il-admin": ADMIN } });
  assert.equal(rr.status, 200);
  assert.deepEqual(rr.body.processed, { equipo_reserva: "sent", familia_reserva: "sent" });
  assert.equal(resend.state.sent.length, 2);
  assert.equal(google.activeEvents().length, 1, "reintentar el correo no repite la reserva");
  assert.equal((await exec("select count(*)::int from public.call_bookings"))[0][0], 1);
});

test("correo sin configurar: se reserva y el aviso queda pendiente de configuración (no se simula)", { skip }, async () => {
  const saved = env.RESEND_API_KEY; delete env.RESEND_API_KEY;
  const [s] = await slots(1);
  const r = await call("POST", { body: bookBody(s) });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.email, { family: "pending_config", staff: "pending_config" });
  assert.equal(resend.state.sent.length, 0);
  env.RESEND_API_KEY = saved;
  const rr = await call("POST", { body: { action: "retry-notifications" }, headers: { "x-il-admin": ADMIN } });
  assert.deepEqual(rr.body.processed, { equipo_reserva: "sent", familia_reserva: "sent" }, "al configurarlo, se envían");
});

test("cancelación: enlace secreto, evento borrado, avisos y hueco libre otra vez", { skip }, async () => {
  const [s] = await slots(1);
  const r = await call("POST", { body: bookBody(s) });
  const url = new URL(r.body.cancelUrl);
  const p = new URLSearchParams(url.hash.slice(1));
  const id = p.get("id"), t = p.get("t");
  const info = await call("GET", { query: `?action=booking&id=${id}&t=${t}` });
  assert.equal(info.status, 200);
  assert.equal(info.body.status, "confirmed");
  assert.equal(info.body.cancellable, true);
  assert.equal(info.body.booking.phoneEnd, "001");
  assert.equal((await call("GET", { query: `?action=booking&id=${id}&t=${t.slice(0, -1)}A` })).status, 404, "con otro enlace no se ve nada");
  assert.equal((await call("POST", { body: { action: "cancel", id, token: "x".repeat(43) } })).status, 404);
  resend.reset();
  google.state.mode.delete = "500";
  assert.equal((await call("POST", { body: { action: "cancel", id, token: t } })).status, 503, "si Google no borra el evento, no se da por cancelada");
  assert.equal((await dbBooking(id)).status, "confirmed");
  google.state.mode = {};
  const c = await call("POST", { body: { action: "cancel", id, token: t } });
  assert.equal(c.status, 200);
  assert.equal(c.body.status, "cancelled");
  assert.equal(google.activeEvents().length, 0);
  assert.equal((await dbBooking(id)).status, "cancelled");
  assert.deepEqual(resend.state.sent.map((x) => x.to[0]).sort(), ["equipo@example.com", "familia@example.com"]);
  assert.ok((await availability()).body.days.flatMap((d) => d.slots).some((x) => x.start === s.start), "el hueco vuelve a estar libre");
  const c2 = await call("POST", { body: { action: "cancel", id, token: t } });
  assert.equal(c2.body.already, true);
  const again = await call("POST", { body: bookBody(s, { contact: { ...bookBody(s).contact, phone: "+34 699 000 111" } }) });
  assert.equal(again.status, 200, "otra familia puede reservarlo");
});

test("pendientes caducadas: se confirman si el evento existe y se liberan si no", { skip }, async () => {
  const [a, b] = await slots(2, { skip: 3 });
  google.state.mode.insert = "500_after_create";
  await call("POST", { body: bookBody(a, { contact: { ...bookBody(a).contact, phone: "+34 600 000 101" } }) });
  google.state.mode.insert = "500";
  await call("POST", { body: bookBody(b, { contact: { ...bookBody(b).contact, phone: "+34 600 000 102" } }) });
  google.state.mode = {};
  await exec("update public.call_bookings set hold_until = now() - interval '1 minute', lease_until = null");
  await availability();
  const st = (await exec("select starts_at, status from public.call_bookings order by starts_at")).map((x) => x[1]);
  assert.deepEqual(st, ["confirmed", "expired"]);
  assert.equal(resend.state.sent.length, 0, "la confirmación tardía deja sus avisos en cola");
  const pend = (await exec("select count(*)::int from public.call_notifications where status = 'pending'"))[0][0];
  assert.equal(pend, 2);
});

test("antelación, horas pasadas, máximo diario y abuso", { skip }, async () => {
  const [s] = await slots(1);
  const past = await call("POST", { body: bookBody({ start: new Date(Date.now() - 3600000).toISOString() }) });
  assert.equal(past.status, 400);
  assert.ok(past.body.fields.includes("slotStart"));
  const soon = new Date(Math.ceil((Date.now() + 10 * 60000) / 1800000) * 1800000).toISOString();
  assert.equal((await call("POST", { body: bookBody({ start: soon }) })).body.status, "slot_taken", "sin la antelación mínima, no");
  const offGrid = new Date(Date.parse(s.start) + 10 * 60000).toISOString();
  assert.equal((await call("POST", { body: bookBody({ start: offGrid }) })).body.status, "slot_taken", "solo horas del horario");
  await configure({ maxPerDay: 1 });
  const [x, y] = await slots(2, { sameDay: true });
  assert.equal((await call("POST", { body: bookBody(x) })).status, 200);
  const r = await call("POST", { body: bookBody(y, { contact: { ...bookBody(y).contact, phone: "+34 600 000 222" } }) });
  assert.equal(r.status, 409);
  assert.equal(r.body.status, "day_full");
  const day = (await availability()).body.days.find((d) => d.date === x.date);
  if (day) assert.equal(day.state, "full");
  await configure();
  const phone = { ...bookBody(s).contact, phone: "+34 600 000 333" };
  const [p1, p2, p3] = await slots(3, { skip: 10 });
  assert.equal((await call("POST", { body: bookBody(p1, { contact: phone }) })).status, 200);
  assert.equal((await call("POST", { body: bookBody(p2, { contact: phone }) })).status, 200);
  const third = await call("POST", { body: bookBody(p3, { contact: phone }) });
  assert.equal(third.status, 429);
  assert.equal(third.body.status, "too_many", "un teléfono no acapara la agenda");
  const bot = await call("POST", { body: bookBody(p3, { website: "http://spam" }) });
  assert.equal(bot.status, 400, "el campo trampa delata a los robots");
  const inv = await call("POST", { body: { action: "book", idempotencyKey: "x" } });
  assert.equal(inv.status, 400);
  assert.ok(inv.body.fields.includes("phone") && inv.body.fields.includes("rgpd"));
});

test("origen, límites de uso y administración", { skip }, async () => {
  const pre = await handler(new Request("https://ref.supabase.co/functions/v1/call-booking", { method: "OPTIONS", headers: { Origin: ORIGIN, "Access-Control-Request-Method": "POST" } }));
  assert.equal(pre.status, 204);
  assert.equal(pre.headers.get("access-control-allow-methods"), "GET, POST, OPTIONS");
  const evil = await call("POST", { body: { action: "book" }, headers: { Origin: "https://otra-web.example" } });
  assert.equal(evil.status, 403);
  const noOrigin = await handler(new Request("https://ref.supabase.co/functions/v1/call-booking", { method: "POST", body: JSON.stringify(bookBody({ start: new Date().toISOString() })) }));
  assert.equal(noOrigin.status, 403, "reservar exige venir de la web");
  const big = await call("POST", { body: { action: "book", relleno: "x".repeat(25000) } });
  assert.equal(big.status, 413);
  const codes = [];
  for (let i = 0; i < 62; i++) codes.push((await availability()).status);
  assert.ok(codes.slice(0, 60).every((c) => c === 200) && codes[61] === 429, "61.º vistazo en 10 min: espera");
  assert.equal((await call("GET", { query: "?action=health" })).status, 401);
  const h = await call("GET", { query: "?action=health", headers: { "x-il-admin": ADMIN } });
  assert.deepEqual(h.body.config.missing, []);
  assert.equal(h.body.db, "ok");
  assert.deepEqual(h.body.settings, { enabled: true, ready: true });
  assert.equal(h.body.googleToken, "ok");
  assert.equal(h.body.calendars, "ok");
  const w = await call("POST", { body: { action: "calendar-write-test" }, headers: { "x-il-admin": ADMIN } });
  assert.equal(w.body.status, "ok");
  assert.equal(google.activeEvents().length, 0, "el evento de prueba se borra");
});
