// ============================================================
//  Banco de pruebas local: Google Calendar y Resend SIMULADOS (en memoria).
//  Nunca tocan la agenda real ni envían correos. Permiten provocar fallos:
//   google.mode = { freebusy: "500" | "calendarError", insert: "500" | "500_after_create" | "timeout_after_create" | "403",
//                   delete: "500", token: "401" }
//   resend.mode = "fail" | null
// ============================================================
import { createPublicKey, verify as cryptoVerify } from "node:crypto";

const json = (o, status = 200) => new Response(o === null ? null : JSON.stringify(o), { status, headers: { "Content-Type": "application/json" } });

export function createFakeGoogle({ publicKey, clientEmail, bookingCalendarId, personalCalendarId }) {
  const pub = typeof publicKey === "string" ? createPublicKey(publicKey) : publicKey;
  const state = {
    events: new Map(),        // id -> evento (status confirmed | cancelled)
    personalBusy: [],         // [{start, end}] ISO en la agenda personal (solo libre/ocupado)
    mode: {},
    calls: [],
    tokens: 0,
  };
  function checkJwt(assertion) {
    const [h, c, s] = String(assertion || "").split(".");
    if (!h || !c || !s) return false;
    const ok = cryptoVerify("RSA-SHA256", Buffer.from(h + "." + c), pub, Buffer.from(s, "base64url"));
    const claims = JSON.parse(Buffer.from(c, "base64url").toString());
    return ok && claims.iss === clientEmail && claims.aud === "https://oauth2.googleapis.com/token"
      && claims.scope === "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.freebusy";
  }
  async function handle(url, init = {}) {
    const method = (init.method || "GET").toUpperCase();
    state.calls.push({ method, url });
    if (url === "https://oauth2.googleapis.com/token") {
      if (state.mode.token === "401") return json({ error: "invalid_grant" }, 401);
      const p = new URLSearchParams(String(init.body));
      if (p.get("grant_type") !== "urn:ietf:params:oauth:grant-type:jwt-bearer" || !checkJwt(p.get("assertion"))) return json({ error: "invalid_grant" }, 400);
      state.tokens++;
      return json({ access_token: "fake-token", expires_in: 3600, token_type: "Bearer" });
    }
    const auth = init.headers && (init.headers.Authorization || init.headers.authorization);
    if (auth !== "Bearer fake-token") return json({ error: { code: 401 } }, 401);
    if (url === "https://www.googleapis.com/calendar/v3/freeBusy") {
      if (state.mode.freebusy === "500") return json({ error: {} }, 500);
      const b = JSON.parse(String(init.body));
      const from = Date.parse(b.timeMin), to = Date.parse(b.timeMax);
      const inRange = (x) => Date.parse(x.end) > from && Date.parse(x.start) < to;
      const calendars = {};
      for (const { id } of b.items) {
        if (state.mode.freebusy === "calendarError" && id === personalCalendarId) { calendars[id] = { errors: [{ domain: "global", reason: "notFound" }] }; continue; }
        if (id === bookingCalendarId) {
          calendars[id] = { busy: [...state.events.values()].filter((e) => e.status !== "cancelled").map((e) => ({ start: e.start.dateTime, end: e.end.dateTime })).filter(inRange) };
        } else if (id === personalCalendarId) {
          calendars[id] = { busy: state.personalBusy.filter(inRange) };
        } else {
          calendars[id] = { errors: [{ domain: "global", reason: "notFound" }] };
        }
      }
      return json({ kind: "calendar#freeBusy", calendars });
    }
    const m = url.match(/^https:\/\/www\.googleapis\.com\/calendar\/v3\/calendars\/([^/]+)\/events(?:\/([^/?]+))?/);
    if (m) {
      if (decodeURIComponent(m[1]) !== bookingCalendarId) return json({ error: { code: 404 } }, 404);
      const id = m[2] ? decodeURIComponent(m[2]) : null;
      if (method === "GET" && id) {
        const e = state.events.get(id);
        return e ? json(e) : json({ error: { code: 404 } }, 404);
      }
      if (method === "POST" && !id) {
        const ev = JSON.parse(String(init.body));
        if (state.mode.insert === "403") return json({ error: { code: 403 } }, 403);
        if (state.mode.insert === "500") return json({ error: { code: 500 } }, 500);
        if (state.events.has(ev.id)) return json({ error: { code: 409, message: "The requested identifier already exists." } }, 409);
        state.events.set(ev.id, { ...ev, status: "confirmed" });
        if (state.mode.insert === "500_after_create") return json({ error: { code: 500 } }, 500);   // se crea, pero la respuesta se pierde
        if (state.mode.insert === "timeout_after_create") throw new DOMException("The operation timed out.", "TimeoutError");
        return json({ ...ev, status: "confirmed" });
      }
      if (method === "DELETE" && id) {
        if (state.mode.delete === "500") return json({ error: { code: 500 } }, 500);
        const e = state.events.get(id);
        if (!e) return json({ error: { code: 404 } }, 404);
        if (e.status === "cancelled") return json({ error: { code: 410 } }, 410);
        e.status = "cancelled";
        return new Response(null, { status: 204 });
      }
    }
    return json({ error: { code: 404, message: "ruta no simulada " + method + " " + url } }, 404);
  }
  return {
    state,
    handle,
    activeEvents: () => [...state.events.values()].filter((e) => e.status !== "cancelled"),
    reset() { state.events.clear(); state.personalBusy = []; state.mode = {}; state.calls = []; state.tokens = 0; },
  };
}

export function createFakeResend() {
  const state = { sent: [], mode: null, keys: new Set() };
  async function handle(url, init = {}) {
    if (init.headers?.Authorization !== "Bearer re_test") return json({ message: "API key" }, 401);
    if (state.mode === "fail") return json({ message: "fallo simulado" }, 500);
    const key = init.headers["Idempotency-Key"];
    const b = JSON.parse(String(init.body));
    if (key && state.keys.has(key)) return json({ id: "dup" });   // Resend no reenvía con la misma clave
    if (key) state.keys.add(key);
    state.sent.push({ ...b, idempotencyKey: key });
    return json({ id: "email_" + state.sent.length });
  }
  return { state, handle, reset() { state.sent = []; state.mode = null; state.keys.clear(); } };
}

// fetch que envía Google y Resend a los simulados y el resto (la base de datos local) a la red
export function routerFetch({ google, resend }) {
  return async (input, init) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.startsWith("https://oauth2.googleapis.com/") || url.startsWith("https://www.googleapis.com/")) return google.handle(url, init);
    if (url.startsWith("https://api.resend.com/")) return resend.handle(url, init);
    if (/^https?:\/\/127\.0\.0\.1:\d+\//.test(url)) return fetch(input, init);
    throw new Error("Petición no permitida en pruebas: " + url);
  };
}
