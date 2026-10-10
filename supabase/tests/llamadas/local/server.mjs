// ============================================================
//  Banco de pruebas local: sirve la Edge Function «call-booking» REAL en
//     http://127.0.0.1:8790/functions/v1/call-booking
//  con una base de datos Postgres local (postgrest_shim.py), y Google Calendar y Resend SIMULADOS.
//  Para probar la web en el navegador sin tocar la agenda real ni enviar correos:
//     IL_TEST_PG="postgresql://postgres@127.0.0.1:55432/postgres" IL_TEST_PYTHON=python3 node supabase/tests/llamadas/local/server.mjs
//     python3 -m http.server 8402   (en la raíz del repo)
//     http://localhost:8402/web-publica/index.html?llamadas-endpoint=http://127.0.0.1:8790/functions/v1/call-booking#contacto
//  El horario que configura es DE PRUEBA (lunes a viernes, 10:00–13:30 y 16:00–19:00), nunca el de Interlanguage.
//  /__fake (GET estado, POST cambios) permite ver los eventos y correos simulados y provocar fallos.
// ============================================================
import http from "node:http";
import { spawn } from "node:child_process";
import { generateKeyPairSync, randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as m from "../../../functions/call-booking/index.ts";
import { createFakeGoogle, createFakeResend, routerFetch } from "./fakes.mjs";

const PG = process.env.IL_TEST_PG;
if (!PG) { console.error("Falta IL_TEST_PG (Postgres local de pruebas)."); process.exit(2); }
const PY = process.env.IL_TEST_PYTHON || "python3";
const PORT = Number(process.env.PORT || 8790);
const SITE = process.env.IL_LOCAL_SITE || "http://localhost:8402/web-publica";
const ORIGINS = process.env.IL_LOCAL_ORIGINS || "http://localhost:8402,http://127.0.0.1:8402";
const KEY = "sb_secret_test";
const here = path.dirname(fileURLToPath(import.meta.url));

const shim = spawn(PY, [path.join(here, "postgrest_shim.py"), "--admin-url", PG, "--key", KEY], { stdio: ["ignore", "pipe", "inherit"] });
const rest = await new Promise((resolve, reject) => {
  let buf = "";
  shim.stdout.on("data", (d) => { buf += d; const mm = buf.match(/READY (\S+)/); if (mm) resolve(mm[1]); });
  shim.on("exit", (c) => reject(new Error("el intermediario terminó: " + c)));
});
const stop = () => { shim.kill("SIGTERM"); process.exit(0); };
process.on("SIGINT", stop);
process.on("SIGTERM", stop);

async function exec(sql, params) {
  const r = await fetch(rest + "/__exec", { method: "POST", headers: { "X-Exec-Key": KEY, "Content-Type": "application/json" }, body: JSON.stringify({ sql, params }) });
  if (!r.ok) throw new Error(await r.text());
  return (await r.json()).rows;
}
const TEST_HOURS = { mon: [["10:00", "13:30"], ["16:00", "19:00"]], tue: [["10:00", "13:30"], ["16:00", "19:00"]], wed: [["10:00", "13:30"], ["16:00", "19:00"]], thu: [["10:00", "13:30"], ["16:00", "19:00"]], fri: [["10:00", "13:30"], ["16:00", "19:00"]] };
await exec("update public.call_settings set weekly_hours = %s::jsonb, buffer_minutes = 15, min_notice_minutes = 120, bookable_weeks = 3, max_per_day = 8, enabled = true", [JSON.stringify(TEST_HOURS)]);

const CLIENT_EMAIL = "reservas@prueba-local.iam.gserviceaccount.com";
const BOOKING_CAL = "reservas-prueba@group.calendar.google.com";
const PERSONAL_CAL = "agenda-prueba@example.com";
const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const google = createFakeGoogle({ publicKey, clientEmail: CLIENT_EMAIL, bookingCalendarId: BOOKING_CAL, personalCalendarId: PERSONAL_CAL });
const resend = createFakeResend();
const ADMIN = randomBytes(24).toString("hex");
const env = {
  SUPABASE_URL: rest, IL_SERVICE_KEY: KEY,
  IL_CALLS_GOOGLE_SA: JSON.stringify({ client_email: CLIENT_EMAIL, private_key: privateKey.export({ type: "pkcs8", format: "pem" }) }),
  IL_CALLS_BOOKING_CALENDAR_ID: BOOKING_CAL, IL_CALLS_BUSY_CALENDAR_IDS: PERSONAL_CAL,
  IL_CALLS_SECRET: randomBytes(32).toString("hex"), IL_CALLS_ADMIN_TOKEN: ADMIN,
  RESEND_API_KEY: "re_test", MAIL_FROM: "Interlanguage <no-reply@example.com>", IL_CALLS_NOTIFY_TO: "equipo@example.com",
  IL_CALLS_ALLOWED_ORIGINS: ORIGINS, IL_CALLS_PUBLIC_SITE: SITE,
};
const handler = m.createHandler({ env: (k) => env[k], fetch: routerFetch({ google, resend }), log: (evt, data) => console.log("[función]", evt, JSON.stringify(data)) });

function readBody(req) {
  return new Promise((resolve) => { const chunks = []; req.on("data", (c) => chunks.push(c)); req.on("end", () => resolve(Buffer.concat(chunks))); });
}
const server = http.createServer(async (req, res) => {
  try {
    const body = await readBody(req);
    if (req.url.startsWith("/__fake")) {
      if (req.method === "POST") {
        const b = JSON.parse(body.toString() || "{}");
        if (b.reset) { google.reset(); resend.reset(); }
        if (b.resetDb) await exec("truncate public.call_notifications, public.call_bookings, public.call_rate_events");
        if (b.google) google.state.mode = b.google;
        if ("resend" in b) resend.state.mode = b.resend;
        if (b.personalBusy) google.state.personalBusy = b.personalBusy;
      }
      res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
      res.end(JSON.stringify({
        events: google.activeEvents().map((e) => ({ id: e.id, start: e.start.dateTime, end: e.end.dateTime, summary: e.summary })),
        emails: resend.state.sent.map((x) => ({ to: x.to, subject: x.subject })),
        mode: { google: google.state.mode, resend: resend.state.mode }, admin: ADMIN,
      }));
      return;
    }
    if (!req.url.startsWith("/functions/v1/call-booking")) { res.writeHead(404); res.end(); return; }
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) if (typeof v === "string") headers.set(k, v);
    headers.set("x-forwarded-for", req.socket.remoteAddress || "127.0.0.1");
    const r = await handler(new Request("http://127.0.0.1:" + PORT + req.url, { method: req.method, headers, body: ["GET", "HEAD", "OPTIONS"].includes(req.method) ? undefined : body }));
    const out = Buffer.from(await r.arrayBuffer());
    res.writeHead(r.status, Object.fromEntries(r.headers));
    res.end(out);
  } catch (e) {
    console.error(e);
    res.writeHead(500); res.end();
  }
});
server.listen(PORT, "127.0.0.1", () => console.log(`READY http://127.0.0.1:${PORT}/functions/v1/call-booking`));
