// ============================================================
//  Reserva de llamadas · pruebas UNITARIAS de la Edge Function (sin red ni base de datos)
//  Uso (Node 22.6+ con --experimental-strip-types, o Node 23.6+ tal cual):
//     node --test supabase/tests/llamadas/unit.test.mjs
// ============================================================
import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync, verify as cryptoVerify } from "node:crypto";
import * as m from "../../functions/call-booking/index.ts";

const iso = (ms) => new Date(ms).toISOString();
const times = (day) => day.slots.map((s) => s.time);

test("hora de Madrid: verano, invierno y cambios de hora", () => {
  assert.equal(iso(m.madridToUtc("2026-10-23", "10:00")), "2026-10-23T08:00:00.000Z");   // UTC+2
  assert.equal(iso(m.madridToUtc("2026-10-26", "10:00")), "2026-10-26T09:00:00.000Z");   // UTC+1
  assert.equal(iso(m.madridToUtc("2027-03-29", "10:00")), "2027-03-29T08:00:00.000Z");   // vuelve UTC+2
  assert.equal(m.madridToUtc("2027-03-28", "02:30"), null, "las 02:30 del adelanto no existen");
  assert.equal(iso(m.madridToUtc("2026-10-25", "02:30")), "2026-10-25T00:30:00.000Z", "hora repetida: la primera");
  assert.equal(m.madridDate(Date.parse("2026-10-25T22:30:00Z")), "2026-10-25");
  assert.equal(m.madridDate(Date.parse("2026-10-24T22:30:00Z")), "2026-10-25", "00:30 en Madrid ya es el día siguiente");
  assert.equal(m.weekdayOf("2026-10-12"), 1);
  assert.equal(m.weekdayOf("2026-10-18"), 7);
  assert.equal(m.mondayOf("2026-10-18"), "2026-10-12");
  assert.equal(m.addDays("2026-12-30", 3), "2027-01-02");
});

const BASE = {
  enabled: true, slotMinutes: 30, bufferMinutes: 15, minNoticeMinutes: 120, bookableWeeks: 2, maxPerDay: null,
  weeklyHours: { mon: [["10:00", "13:00"]], tue: [["10:00", "13:00"]], wed: [["10:00", "13:00"]], thu: [["10:00", "13:00"]], fri: [["10:00", "13:00"], ["16:00", "17:00"]] },
};
const NOW = Date.parse("2026-10-12T08:30:00Z");   // lunes 12 de octubre, 10:30 en Madrid

test("huecos: horario, antelación, ocupado de Google con margen y reservas", () => {
  const busy = [{ start: Date.parse("2026-10-13T08:00:00Z"), end: Date.parse("2026-10-13T09:00:00Z") }];   // martes 10:00–11:00
  const bookings = [
    { start: Date.parse("2026-10-14T10:00:00Z"), end: Date.parse("2026-10-14T10:30:00Z"), localDate: "2026-10-14", stale: false },  // miércoles 12:00
    { start: Date.parse("2026-10-15T08:00:00Z"), end: Date.parse("2026-10-15T08:30:00Z"), localDate: "2026-10-15", stale: true },   // caducada: no cuenta
  ];
  const days = m.computeDays({ settings: BASE, exceptions: [], busy, bookings, now: NOW, fromDate: "2026-10-12", toDate: "2026-10-18" });
  assert.equal(days.length, 7);
  assert.deepEqual(times(days[0]), ["12:30"], "lunes: solo lo que cumple 2 h de antelación");
  assert.deepEqual(times(days[1]), ["11:30", "12:00", "12:30"], "martes: ocupado 10–11 + 15 min de margen");
  assert.deepEqual(times(days[2]), ["10:00", "10:30", "11:00"], "miércoles: reserva a las 12:00 con margen");
  assert.deepEqual(times(days[3]), ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30"], "jueves: la pendiente caducada no bloquea");
  assert.deepEqual(times(days[4]), ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "16:00", "16:30"], "viernes: dos franjas");
  assert.equal(days[5].state, "closed");
  assert.equal(days[6].state, "closed");
  assert.equal(days[1].state, "available");
});

test("huecos: festivos, ausencias por franja, máximo diario, semanas y días pasados", () => {
  const s = { ...BASE, maxPerDay: 1, minNoticeMinutes: 0 };
  const exceptions = m.parseExceptions([
    { starts_on: "2026-10-16", ends_on: "2026-10-16", from_time: null, to_time: null },
    { starts_on: "2026-10-19", ends_on: "2026-10-20", from_time: "10:00:00", to_time: "11:00:00" },
  ]);
  const bookings = [{ start: Date.parse("2026-10-13T08:00:00Z"), end: Date.parse("2026-10-13T08:30:00Z"), localDate: "2026-10-13", stale: false }];
  const days = m.computeDays({ settings: s, exceptions, busy: [], bookings, now: NOW, fromDate: "2026-10-12", toDate: "2026-10-26" });
  const byDate = Object.fromEntries(days.map((d) => [d.date, d]));
  assert.equal(byDate["2026-10-13"].state, "full", "máximo 1 al día ya alcanzado");
  assert.equal(byDate["2026-10-16"].state, "closed", "festivo");
  assert.deepEqual(times(byDate["2026-10-19"]), ["11:00", "11:30", "12:00", "12:30"], "ausencia de 10 a 11");
  assert.equal(byDate["2026-10-25"].state, "closed", "domingo");
  assert.equal(byDate["2026-10-26"].state, "outside", "fuera de las 2 semanas reservables");
  const past = m.computeDays({ settings: s, exceptions: [], busy: [], bookings: [], now: Date.parse("2026-10-12T12:00:00Z"), fromDate: "2026-10-12", toDate: "2026-10-12" });
  assert.equal(past[0].state, "past", "a las 14:00 ya no quedan horas ese día");
  const w = m.bookingWindow(s, NOW);
  assert.deepEqual(w, { today: "2026-10-12", lastDate: "2026-10-25", firstWeek: "2026-10-12", lastWeek: "2026-10-19" });
});

test("huecos: semana del cambio de hora (25–26 de octubre)", () => {
  const s = { ...BASE, minNoticeMinutes: 0, bookableWeeks: 3, weeklyHours: { mon: [["09:00", "10:00"]], fri: [["09:00", "10:00"]], sun: [["01:30", "03:30"]] } };
  const days = m.computeDays({ settings: s, exceptions: [], busy: [], bookings: [], now: NOW, fromDate: "2026-10-23", toDate: "2026-10-26" });
  const fri = days.find((d) => d.date === "2026-10-23"), sun = days.find((d) => d.date === "2026-10-25"), mon = days.find((d) => d.date === "2026-10-26");
  assert.equal(iso(fri.slots[0].start), "2026-10-23T07:00:00.000Z");
  assert.equal(iso(mon.slots[0].start), "2026-10-26T08:00:00.000Z");
  assert.deepEqual(times(sun), ["01:30", "02:00", "02:30", "03:00"]);
  assert.ok(sun.slots.every((x, i, a) => i === 0 || x.start > a[i - 1].start), "huecos en orden aunque se repita una hora");
  const spring = m.daySlots("2027-03-28", { ...s, weeklyHours: { sun: [["01:30", "03:30"]] } }, []);
  assert.deepEqual(spring.map((x) => x.time), ["01:30", "03:00"], "en el adelanto se saltan las horas que no existen");
});

test("configuración: lista solo cuando está completa", () => {
  assert.equal(m.settingsReady(m.parseSettings({ enabled: false, slot_minutes: 30, weekly_hours: BASE.weeklyHours, buffer_minutes: 0, min_notice_minutes: 0, bookable_weeks: 2 })), false);
  assert.equal(m.settingsReady(m.parseSettings({ enabled: true, slot_minutes: 30, weekly_hours: {}, buffer_minutes: 0, min_notice_minutes: 0, bookable_weeks: 2 })), false);
  assert.equal(m.settingsReady(m.parseSettings({ enabled: true, slot_minutes: 30, weekly_hours: BASE.weeklyHours, buffer_minutes: null, min_notice_minutes: 0, bookable_weeks: 2 })), false);
  assert.equal(m.settingsReady(m.parseSettings({ enabled: true, slot_minutes: 30, weekly_hours: BASE.weeklyHours, buffer_minutes: 0, min_notice_minutes: 0, bookable_weeks: 2 })), true);
  assert.equal(m.validWeeklyHours({ lunes: [["10:00", "11:00"]] }), false);
  assert.equal(m.validWeeklyHours({ mon: [["11:00", "10:00"]] }), false);
});

test("validación de los datos en el servidor", () => {
  const good = {
    idempotencyKey: "6f1c1f7e-2c7a-4d43-9a0e-3c9f6a2b1d10", slotStart: "2026-10-14T08:00:00.000Z", lang: "es",
    contact: { fullName: "  Ana   García  ", email: "Ana@Example.com", phone: "600 123 456", rgpd: true },
    consult: { service: "extranjero", serviceLabel: "Estudiar en el extranjero", studentAge: "14 años", serviceExtra: "Destino: Irlanda", callContext: "Destino: Irlanda", message: "Hola\r\n\r\n\r\n\r\nqué tal\u0007" },
  };
  const r = m.validateBooking(good, NOW);
  assert.ok(r.ok);
  assert.equal(r.value.fullName, "Ana García");
  assert.equal(r.value.email, "ana@example.com");
  assert.equal(r.value.phoneNormalized, "+34600123456");
  assert.equal(r.value.consult.message, "Hola\n\nqué tal");
  const bad = m.validateBooking({ ...good, idempotencyKey: "x", slotStart: "2026-10-12T08:00:30Z", contact: { fullName: "A", email: "no", phone: "12", rgpd: false }, consult: { service: "otro" } }, NOW);
  assert.deepEqual(bad.fields.sort(), ["email", "fullName", "idempotencyKey", "phone", "rgpd", "service", "slotStart"]);
  assert.ok(!m.validateBooking({ ...good, slotStart: "2026-10-12T08:00:00Z" }, NOW).ok, "una hora pasada no vale");
  assert.equal(m.normalizePhone("0044 20 7946 0958"), "+442079460958");
  assert.equal(m.normalizePhone("+34 (91) 123-45-67"), "+34911234567");
  assert.equal(m.normalizePhone("abc"), null);
});

test("firma de la cuenta de servicio (RS256) verificable con la clave pública", async () => {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const pem = privateKey.export({ type: "pkcs8", format: "pem" });
  const jwt = await m.signServiceJwt("reservas@proyecto.iam.gserviceaccount.com", pem, 1760000000);
  const [h, c, sig] = jwt.split(".");
  const header = JSON.parse(Buffer.from(h, "base64url").toString());
  const claims = JSON.parse(Buffer.from(c, "base64url").toString());
  assert.deepEqual(header, { alg: "RS256", typ: "JWT" });
  assert.equal(claims.iss, "reservas@proyecto.iam.gserviceaccount.com");
  assert.equal(claims.aud, "https://oauth2.googleapis.com/token");
  assert.equal(claims.exp - claims.iat, 3600);
  assert.equal(claims.scope, "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.freebusy", "solo eventos y libre/ocupado");
  assert.ok(cryptoVerify("RSA-SHA256", Buffer.from(h + "." + c), publicKey, Buffer.from(sig, "base64url")));
  const sa = m.parseServiceAccount(Buffer.from(JSON.stringify({ client_email: "a@b.iam.gserviceaccount.com", private_key: pem })).toString("base64"));
  assert.equal(sa.clientEmail, "a@b.iam.gserviceaccount.com", "la clave se acepta también en base64");
  assert.equal(m.parseServiceAccount("no es json"), null);
});

function fakeGoogle(handlers) {
  const calls = [];
  const fetch = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method || "GET", body: init.body });
    for (const [re, fn] of handlers) if (re.test(String(url))) return fn(String(url), init);
    throw new Error("sin ruta " + url);
  };
  return { fetch, calls };
}
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json" } });

test("cliente de Google: token en caché, libre/ocupado por tramos y errores", async () => {
  const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const pem = privateKey.export({ type: "pkcs8", format: "pem" });
  let fbErr = null;
  const g = fakeGoogle([
    [/oauth2\.googleapis\.com\/token/, () => json({ access_token: "tok", expires_in: 3600 })],
    [/freeBusy/, (u, init) => {
      const b = JSON.parse(init.body);
      const cal = Object.fromEntries(b.items.map((i) => [i.id, { busy: [{ start: b.timeMin, end: new Date(Date.parse(b.timeMin) + 3600000).toISOString() }] }]));
      if (fbErr) cal["personal@example.com"] = { errors: [{ domain: "global", reason: fbErr }] };
      return json({ calendars: cal });
    }],
    [/events\/il404$/, () => json({ error: {} }, 404)],
    [/events\/ilcancelled$/, () => json({ status: "cancelled" })],
    [/events\/ilok$/, () => json({ status: "confirmed" })],
    [/events$/, (u, init) => { const e = JSON.parse(init.body); return e.id === "ildup" ? json({}, 409) : e.id === "il500" ? json({}, 500) : e.id === "il403" ? json({}, 403) : json(e); }],
  ]);
  const client = m.createGoogleClient({ clientEmail: "x@y.iam.gserviceaccount.com", privateKey: pem, bookingCalendarId: "reservas@group.calendar.google.com", busyCalendarIds: ["personal@example.com"], fetch: g.fetch, now: () => NOW });
  const from = Date.parse("2026-10-12T00:00:00Z");
  const busy = await client.freeBusy(from, from + 60 * 86400000);
  assert.equal(g.calls.filter((c) => /freeBusy/.test(c.url)).length, 3, "60 días = 3 consultas de 28 días como máximo");
  assert.equal(busy.length, 6, "2 calendarios × 3 tramos");
  await client.freeBusy(from, from + 86400000);
  assert.equal(g.calls.filter((c) => /token/.test(c.url)).length, 1, "el token se reutiliza");
  fbErr = "notFound";
  await assert.rejects(client.freeBusy(from, from + 86400000), (e) => e instanceof m.GoogleError && !e.retryable, "un calendario sin permiso = sin huecos");
  fbErr = "internalError";
  await assert.rejects(client.freeBusy(from, from + 86400000), (e) => e.retryable);
  assert.deepEqual(await client.getEvent("il404"), { exists: false });
  assert.equal((await client.getEvent("ilcancelled")).exists, false);
  assert.equal((await client.getEvent("ilok")).exists, true);
  assert.deepEqual(await client.insertEvent({ id: "ildup" }), { conflict: true });
  await assert.rejects(client.insertEvent({ id: "il500" }), (e) => e.retryable === true);
  await assert.rejects(client.insertEvent({ id: "il403" }), (e) => e.retryable === false && e.kind === "auth");
  const down = m.createGoogleClient({ clientEmail: "x@y", privateKey: pem, bookingCalendarId: "c", busyCalendarIds: [], fetch: async () => { throw new DOMException("t", "TimeoutError"); }, now: () => NOW });
  await assert.rejects(down.getEvent("ilok"), (e) => e instanceof m.GoogleError && e.kind === "network" && e.retryable);
});

const BOOKING = {
  id: "6f1c1f7e-2c7a-4d43-9a0e-3c9f6a2b1d10", idempotency_key: "k", status: "confirmed",
  starts_at: "2026-10-14T08:00:00Z", ends_at: "2026-10-14T08:30:00Z", local_date: "2026-10-14",
  google_event_id: "il6f1c1f7e2c7a4d439a0e3c9f6a2b1d10", phone: "+34 600 123 456", phone_hash: "h", email: "ana@example.com",
  family_name: "Ana García", lang: "es", hold_until: "", lease_until: null,
  consult: { service: "extranjero", serviceLabel: "Estudiar en el extranjero", studentAge: "14 años",
    serviceExtra: "Destino: Irlanda · Alumno/a: Lucía · Colegio actual: IES Prueba", callContext: "Destino: Irlanda", message: "Queremos información" },
};

test("evento de Google: solo lo necesario para la llamada, 30 min, hora de Madrid, sin Meet", () => {
  const e = m.buildEvent(BOOKING, "https://interlanguage.es/llamada.html#id=x&t=y");
  const txt = JSON.stringify(e);
  assert.equal(e.id, BOOKING.google_event_id);
  assert.equal(e.start.timeZone, "Europe/Madrid");
  assert.equal(Date.parse(e.end.dateTime) - Date.parse(e.start.dateTime), 30 * 60000);
  assert.ok(e.description.includes("+34 600 123 456") && e.description.includes("Destino: Irlanda"));
  assert.ok(!txt.includes("ana@example.com"), "sin el correo de la familia");
  assert.ok(!txt.includes("Lucía") && !txt.includes("IES Prueba"), "sin el nombre ni el colegio del alumno");
  assert.ok(!("conferenceData" in e), "sin Google Meet");
  assert.equal(e.visibility, "private");
});

test("correos: textos, idioma, enlace de cancelación y escape del HTML", () => {
  const url = "https://interlanguage.es/llamada.html#id=x&t=y";
  const fam = m.buildEmail("familia_reserva", { ...BOOKING, family_name: "Ana <b>" }, url);
  assert.ok(fam.text.includes("Tu llamada está reservada. Te llamaremos al número indicado."));
  assert.ok(fam.text.includes("Hora: 10:00 (hora de Madrid)") && fam.text.includes("Duración: 30 minutos") && fam.text.includes(url));
  assert.ok(fam.html.includes("Ana &lt;b&gt;") && !fam.html.includes("Ana <b>"));
  const en = m.buildEmail("familia_reserva", { ...BOOKING, lang: "en" }, url);
  assert.ok(en.subject.startsWith("Your call with Interlanguage") && en.text.includes("Madrid time"));
  const staff = m.buildEmail("equipo_reserva", BOOKING, url);
  assert.ok(!staff.toFamily && staff.text.includes("ana@example.com") && staff.text.includes("Colegio actual: IES Prueba") && staff.text.includes("&by=equipo"));
});

test("enlace de cancelación: derivado del id, comparación en tiempo constante", async () => {
  const a = await m.cancelToken("s".repeat(40), BOOKING.id);
  const b = await m.cancelToken("s".repeat(40), BOOKING.id);
  const c = await m.cancelToken("t".repeat(40), BOOKING.id);
  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.equal(a.length, 43);
  assert.ok(m.safeEqual(a, b) && !m.safeEqual(a, c) && !m.safeEqual(a, a.slice(1)));
});
