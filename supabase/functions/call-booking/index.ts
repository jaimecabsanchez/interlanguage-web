// ============================================================
//  Interlanguage · Edge Function "call-booking"
//  Reserva de llamadas de la web pública conectada a Google Calendar.
//
//  La familia elige día y hora en el formulario de contacto; esta función:
//   · calcula los huecos libres a partir del horario configurado (tabla call_settings), quitando
//     los periodos ocupados de Google Calendar (solo libre/ocupado: nunca títulos ni detalles),
//     las reservas existentes, los márgenes, la antelación mínima, los festivos y el máximo diario;
//   · al confirmar, vuelve a comprobar el hueco, lo retiene en la base de datos (sin solapes ni
//     duplicados aunque lleguen dos peticiones a la vez) y crea un evento de 30 minutos en Google;
//   · avisa por correo a la familia y al equipo (Resend) sin repetir la reserva si el correo falla;
//   · permite cancelar con un enlace secreto (libera el hueco y borra el evento).
//
//  Peticiones (la web usa las públicas; las de administración llevan la cabecera x-il-admin):
//    GET  ?action=availability[&week=AAAA-MM-DD]   huecos de una semana (lunes)
//    POST {action:"book", …}                        reservar
//    GET  ?action=booking&id=…&t=…                  datos de una reserva (página de cancelación)
//    POST {action:"cancel", id, token}              cancelar
//    GET  ?action=health                            (admin) comprobar la configuración
//    POST {action:"retry-notifications"[, ids]}     (admin) reintentar avisos fallidos o pendientes
//    POST {action:"calendar-write-test"}            (admin) crea y borra un evento de prueba
//
//  Despliegue y configuración paso a paso: supabase/functions/call-booking/DEPLOY.md
//  Sin dependencias externas (fetch + WebCrypto): el mismo archivo se prueba en Node 22+ (supabase/tests/llamadas).
// ============================================================

// ---------- Constantes ----------
export const TZ = "Europe/Madrid";
export const SLOT_MINUTES = 30;                 // duración fija de la llamada
const HOLD_SECONDS = 600;                       // un hueco queda retenido 10 min mientras se confirma
const LEASE_SECONDS = 45;                       // turno para crear el evento en Google
const MAX_ACTIVE_PER_PHONE = 2;                 // reservas futuras a la vez por teléfono
const GOOGLE_TIMEOUT_MS = 10000;
const DB_TIMEOUT_MS = 8000;
const MAIL_TIMEOUT_MS = 10000;
const MAX_BODY_BYTES = 20000;
const FREEBUSY_CHUNK_DAYS = 28;
const GOOGLE_SCOPES = "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.freebusy";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_API = "https://www.googleapis.com/calendar/v3";
const RESEND_URL = "https://api.resend.com/emails";
const RATE = {
  availability: { limit: 60, window: 600 },
  book: { limit: 8, window: 3600 },
  bookPhone: { limit: 5, window: 86400 },
  booking: { limit: 30, window: 3600 },
  cancel: { limit: 10, window: 3600 },
};
const SERVICES = ["campamentos", "extraescolar", "extranjero", "orientacion"];
const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

// ---------- Tipos ----------
export type WeeklyHours = Record<string, [string, string][]>;
export interface Settings {
  enabled: boolean;
  slotMinutes: number;
  weeklyHours: WeeklyHours;
  bufferMinutes: number | null;
  minNoticeMinutes: number | null;
  bookableWeeks: number | null;
  maxPerDay: number | null;
}
export interface ReadySettings extends Settings {
  bufferMinutes: number;
  minNoticeMinutes: number;
  bookableWeeks: number;
}
export interface CallException { startsOn: string; endsOn: string; fromTime: string | null; toTime: string | null; }
export interface Interval { start: number; end: number; }
export interface BookingBlock { start: number; end: number; localDate: string; stale: boolean; }
export interface Slot { start: number; end: number; time: string; }
export type DayState = "available" | "full" | "closed" | "past" | "outside";
export interface DayInfo { date: string; weekday: number; state: DayState; slots: Slot[]; }
export interface Booking {
  id: string;
  idempotency_key: string;
  status: "pending" | "confirmed" | "cancelled" | "expired";
  starts_at: string;
  ends_at: string;
  local_date: string;
  google_event_id: string;
  phone: string;
  phone_hash: string;
  email: string;
  family_name: string;
  lang: "es" | "en";
  consult: Consult;
  hold_until: string;
  lease_until: string | null;
}
// serviceExtra = detalle completo (aviso interno); callContext = el mismo sin datos que identifiquen al alumno (evento de Google)
export interface Consult { service: string; serviceLabel: string; studentAge: string; serviceExtra: string; callContext: string; message: string; }
export interface BookingInput {
  idempotencyKey: string;
  slotStart: number;
  lang: "es" | "en";
  fullName: string;
  email: string;
  phone: string;
  phoneNormalized: string;
  consult: Consult;
}
type Json = Record<string, unknown>;

// ============================================================
//  Hora de Madrid (cambios de horario incluidos) — sin librerías
// ============================================================
const MADRID_FMT = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit",
});
function pad(n: number): string { return String(n).padStart(2, "0"); }
export function madridParts(ms: number): { y: number; m: number; d: number; hh: number; mm: number; ss: number } {
  const o: Record<string, number> = {};
  for (const p of MADRID_FMT.formatToParts(new Date(ms))) if (p.type !== "literal") o[p.type] = Number(p.value);
  return { y: o.year, m: o.month, d: o.day, hh: o.hour % 24, mm: o.minute, ss: o.second };
}
export function madridDate(ms: number): string { const p = madridParts(ms); return `${p.y}-${pad(p.m)}-${pad(p.d)}`; }
export function madridTime(ms: number): string { const p = madridParts(ms); return `${pad(p.hh)}:${pad(p.mm)}`; }
function madridOffsetMs(ms: number): number {
  const p = madridParts(ms);
  return Date.UTC(p.y, p.m - 1, p.d, p.hh, p.mm, p.ss) - Math.floor(ms / 1000) * 1000;
}
// Hora local de Madrid → instante UTC (ms). null si esa hora no existe (adelanto de marzo).
// Si existe dos veces (retraso de octubre) devuelve la primera.
export function madridToUtc(date: string, time: string): number | null {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mi] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mi);
  let t = guess - madridOffsetMs(guess);
  t = guess - madridOffsetMs(t);
  if (madridDate(t) !== date || madridTime(t) !== time) return null;
  const earlier = t - 3600000;
  if (madridDate(earlier) === date && madridTime(earlier) === time) return earlier;
  return t;
}
export function addDays(date: string, n: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const x = new Date(Date.UTC(y, m - 1, d + n));
  return `${x.getUTCFullYear()}-${pad(x.getUTCMonth() + 1)}-${pad(x.getUTCDate())}`;
}
export function weekdayOf(date: string): number {   // 1 = lunes … 7 = domingo
  const [y, m, d] = date.split("-").map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return wd === 0 ? 7 : wd;
}
export function mondayOf(date: string): string { return addDays(date, 1 - weekdayOf(date)); }
function toMinutes(hhmm: string): number { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; }
function fromMinutes(n: number): string { return `${pad(Math.floor(n / 60))}:${pad(n % 60)}`; }
function dayStartUtc(date: string): number {
  return madridToUtc(date, "00:00") ?? (madridToUtc(date, "01:00") as number) - 3600000;
}
const RE_DATE = /^\d{4}-\d{2}-\d{2}$/;
function validDate(s: unknown): s is string {
  if (typeof s !== "string" || !RE_DATE.test(s)) return false;
  return addDays(s, 0) === s;
}

// ============================================================
//  Configuración y cálculo de huecos
// ============================================================
const RE_HHMM = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
export function validWeeklyHours(w: unknown): w is WeeklyHours {
  if (!w || typeof w !== "object" || Array.isArray(w)) return false;
  for (const [k, v] of Object.entries(w as Record<string, unknown>)) {
    if (!DAY_KEYS.includes(k) || !Array.isArray(v)) return false;
    for (const r of v) {
      if (!Array.isArray(r) || r.length !== 2) return false;
      if (typeof r[0] !== "string" || typeof r[1] !== "string" || !RE_HHMM.test(r[0]) || !RE_HHMM.test(r[1])) return false;
      if (r[0] >= r[1]) return false;
    }
  }
  return true;
}
export function parseSettings(row: unknown): Settings | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const num = (v: unknown) => (v === null || v === undefined ? null : Number(v));
  return {
    enabled: r.enabled === true,
    slotMinutes: Number(r.slot_minutes) || SLOT_MINUTES,
    weeklyHours: (r.weekly_hours || {}) as WeeklyHours,
    bufferMinutes: num(r.buffer_minutes),
    minNoticeMinutes: num(r.min_notice_minutes),
    bookableWeeks: num(r.bookable_weeks),
    maxPerDay: num(r.max_per_day),
  };
}
export function settingsReady(s: Settings | null): s is ReadySettings {
  return !!s && s.enabled && s.slotMinutes === SLOT_MINUTES && validWeeklyHours(s.weeklyHours)
    && Object.values(s.weeklyHours).some((v) => v.length > 0)
    && s.bufferMinutes !== null && s.minNoticeMinutes !== null && s.bookableWeeks !== null
    && s.bookableWeeks >= 1;
}
export function parseExceptions(rows: unknown): CallException[] {
  if (!Array.isArray(rows)) return [];
  const t = (v: unknown) => (typeof v === "string" && v.length >= 5 ? v.slice(0, 5) : null);
  return rows.filter((r) => r && typeof r === "object").map((r) => {
    const x = r as Record<string, unknown>;
    return { startsOn: String(x.starts_on), endsOn: String(x.ends_on), fromTime: t(x.from_time), toTime: t(x.to_time) };
  });
}

// Huecos de un día según el horario y las excepciones (sin mirar ocupación)
export function daySlots(date: string, s: Settings, exceptions: CallException[]): Slot[] {
  const ranges = s.weeklyHours[DAY_KEYS[weekdayOf(date) - 1]] || [];
  const closed: [number, number][] = [];
  for (const e of exceptions) {
    if (date < e.startsOn || date > e.endsOn) continue;
    if (!e.fromTime || !e.toTime) return [];
    closed.push([toMinutes(e.fromTime), toMinutes(e.toTime)]);
  }
  const step = s.slotMinutes;
  const out = new Map<number, Slot>();
  for (const [a, b] of ranges) {
    for (let m = toMinutes(a); m + step <= toMinutes(b); m += step) {
      if (closed.some(([c0, c1]) => m < c1 && m + step > c0)) continue;
      const time = fromMinutes(m);
      const start = madridToUtc(date, time);
      if (start === null) continue;                      // hora inexistente por el cambio de horario
      out.set(start, { start, end: start + step * 60000, time });
    }
  }
  return [...out.values()].sort((x, y) => x.start - y.start);
}

export function bookingWindow(s: ReadySettings, now: number): { today: string; lastDate: string; firstWeek: string; lastWeek: string } {
  const today = madridDate(now);
  const lastDate = addDays(today, s.bookableWeeks * 7 - 1);
  return { today, lastDate, firstWeek: mondayOf(today), lastWeek: mondayOf(lastDate) };
}

// Disponibilidad de un rango de fechas. busy = periodos ocupados de Google; bookings = reservas activas.
export function computeDays(o: {
  settings: ReadySettings; exceptions: CallException[]; busy: Interval[]; bookings: BookingBlock[];
  now: number; fromDate: string; toDate: string;
}): DayInfo[] {
  const s = o.settings;
  const { today, lastDate } = bookingWindow(s, o.now);
  const earliest = o.now + s.minNoticeMinutes * 60000;
  const buf = s.bufferMinutes * 60000;
  const live = o.bookings.filter((b) => !b.stale);
  const blocks: Interval[] = [...o.busy, ...live.map((b) => ({ start: b.start, end: b.end }))];
  const perDay = new Map<string, number>();
  for (const b of live) perDay.set(b.localDate, (perDay.get(b.localDate) || 0) + 1);
  const days: DayInfo[] = [];
  for (let date = o.fromDate; date <= o.toDate; date = addDays(date, 1)) {
    const weekday = weekdayOf(date);
    if (date < today) { days.push({ date, weekday, state: "past", slots: [] }); continue; }
    if (date > lastDate) { days.push({ date, weekday, state: "outside", slots: [] }); continue; }
    const gen = daySlots(date, s, o.exceptions);
    if (!gen.length) { days.push({ date, weekday, state: "closed", slots: [] }); continue; }
    if (s.maxPerDay !== null && (perDay.get(date) || 0) >= s.maxPerDay) { days.push({ date, weekday, state: "full", slots: [] }); continue; }
    const free = gen.filter((x) => x.start >= earliest && !blocks.some((b) => b.start < x.end + buf && x.start - buf < b.end));
    const state: DayState = free.length ? "available" : gen.every((x) => x.start < earliest) ? "past" : "full";
    days.push({ date, weekday, state, slots: free });
  }
  return days;
}

// ============================================================
//  Datos de la familia: validación en el servidor
// ============================================================
const RE_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function clean(v: unknown, max: number, multiline = false): string {
  if (typeof v !== "string") return "";
  let s = v.normalize("NFC").replace(multiline ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, " ");
  s = multiline ? s.replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n") : s.replace(/\s+/g, " ");
  s = s.trim();
  return s.length > max ? s.slice(0, max) : s;
}
export function normalizePhone(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let v = raw.replace(/[\s().\-\/]/g, "");
  if (v.startsWith("00")) v = "+" + v.slice(2);
  if (/^[6789]\d{8}$/.test(v)) v = "+34" + v;            // móvil o fijo español sin prefijo
  if (!/^\+?\d{8,15}$/.test(v)) return null;
  return v.startsWith("+") ? v : "+" + v;
}
export function validateBooking(body: Json, now: number): { ok: true; value: BookingInput } | { ok: false; fields: string[] } {
  const fields: string[] = [];
  const key = typeof body.idempotencyKey === "string" ? body.idempotencyKey.toLowerCase() : "";
  if (!RE_UUID.test(key)) fields.push("idempotencyKey");
  const slotStart = typeof body.slotStart === "string" ? Date.parse(body.slotStart) : NaN;
  if (!Number.isFinite(slotStart) || slotStart % 60000 !== 0 || slotStart < now) fields.push("slotStart");
  const lang = body.lang === "en" ? "en" : "es";
  const contact = (body.contact && typeof body.contact === "object" ? body.contact : {}) as Json;
  const consult = (body.consult && typeof body.consult === "object" ? body.consult : {}) as Json;
  const fullName = clean(contact.fullName, 120);
  if (fullName.length < 2) fields.push("fullName");
  const email = clean(contact.email, 254).toLowerCase();
  if (!RE_EMAIL.test(email)) fields.push("email");
  const phone = clean(contact.phone, 40);
  const phoneNormalized = normalizePhone(phone);
  if (!phoneNormalized) fields.push("phone");
  if (contact.rgpd !== true) fields.push("rgpd");
  const service = clean(consult.service, 30);
  if (!SERVICES.includes(service)) fields.push("service");
  if (fields.length) return { ok: false, fields };
  return {
    ok: true,
    value: {
      idempotencyKey: key, slotStart, lang, fullName, email, phone, phoneNormalized: phoneNormalized as string,
      consult: {
        service,
        serviceLabel: clean(consult.serviceLabel, 80),
        studentAge: clean(consult.studentAge, 60),
        serviceExtra: clean(consult.serviceExtra, 800),
        callContext: clean(consult.callContext, 600),
        message: clean(consult.message, 2000, true),
      },
    },
  };
}

// ============================================================
//  Utilidades criptográficas (WebCrypto)
// ============================================================
const enc = new TextEncoder();
function bytesToB64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlJson(o: unknown): string { return bytesToB64url(enc.encode(JSON.stringify(o))); }
function toHex(buf: ArrayBuffer): string { return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join(""); }
export async function sha256Hex(s: string): Promise<string> { return toHex(await crypto.subtle.digest("SHA-256", enc.encode(s))); }
export async function hmacB64url(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return bytesToB64url(await crypto.subtle.sign("HMAC", key, enc.encode(msg)));
}
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
// Enlace de cancelación: se deriva del id de la reserva con el secreto (se puede regenerar para cada correo,
// sin guardarlo). En la base de datos solo queda su hash.
export async function cancelToken(secret: string, bookingId: string): Promise<string> { return hmacB64url(secret, "cancel:" + bookingId); }

// ============================================================
//  Google Calendar (cuenta de servicio, sin librerías)
// ============================================================
export class GoogleError extends Error {
  kind: string;
  status: number;
  retryable: boolean;
  constructor(message: string, kind: string, status = 0) {
    super(message);
    this.kind = kind;
    this.status = status;
    this.retryable = kind === "server" || kind === "rate" || kind === "network";
  }
}
export function parseServiceAccount(raw: string | undefined): { clientEmail: string; privateKey: string } | null {
  if (!raw) return null;
  let txt = raw.trim();
  if (!txt.startsWith("{")) {
    try { txt = atob(txt); } catch { return null; }
  }
  try {
    const j = JSON.parse(txt);
    if (typeof j.client_email !== "string" || typeof j.private_key !== "string") return null;
    return { clientEmail: j.client_email, privateKey: j.private_key.replace(/\\n/g, "\n") };
  } catch { return null; }
}
function pemToPkcs8(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----/g, "").replace(/\s+/g, "");
  const bin = atob(b64);
  const buf = new ArrayBuffer(bin.length);
  const out = new Uint8Array(buf);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return buf;
}
export async function signServiceJwt(clientEmail: string, privateKey: string, nowSec: number): Promise<string> {
  const header = b64urlJson({ alg: "RS256", typ: "JWT" });
  const claims = b64urlJson({ iss: clientEmail, scope: GOOGLE_SCOPES, aud: GOOGLE_TOKEN_URL, iat: nowSec, exp: nowSec + 3600 });
  const key = await crypto.subtle.importKey("pkcs8", pemToPkcs8(privateKey), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, enc.encode(header + "." + claims));
  return header + "." + claims + "." + bytesToB64url(sig);
}

export interface GoogleClient {
  freeBusy(from: number, to: number): Promise<Interval[]>;
  calendarErrors(from: number, to: number): Promise<Record<string, string>>;
  getEvent(eventId: string): Promise<{ exists: boolean; status?: string }>;
  insertEvent(event: Json): Promise<{ conflict: boolean }>;
  deleteEvent(eventId: string): Promise<void>;
  tokenCheck(): Promise<void>;
}
export function createGoogleClient(o: {
  clientEmail: string; privateKey: string; bookingCalendarId: string; busyCalendarIds: string[];
  fetch: typeof fetch; now: () => number;
}): GoogleClient {
  let token: { value: string; exp: number } | null = null;
  let tokenInFlight: Promise<string> | null = null;   // peticiones simultáneas comparten un solo token
  const calendars = [...new Set([o.bookingCalendarId, ...o.busyCalendarIds])];
  async function call(url: string, init: RequestInit): Promise<Response> {
    try {
      return await o.fetch(url, { ...init, signal: AbortSignal.timeout(GOOGLE_TIMEOUT_MS) });
    } catch (e) {
      throw new GoogleError("Google sin respuesta: " + (e instanceof Error ? e.name : "error"), "network");
    }
  }
  function fail(r: Response, what: string): GoogleError {
    const kind = r.status === 429 ? "rate" : r.status >= 500 ? "server" : r.status === 401 || r.status === 403 ? "auth" : "bad";
    return new GoogleError(`${what}: HTTP ${r.status}`, kind, r.status);
  }
  async function accessToken(): Promise<string> {
    const nowSec = Math.floor(o.now() / 1000);
    if (token && token.exp - 60 > nowSec) return token.value;
    if (!tokenInFlight) tokenInFlight = fetchToken(nowSec).finally(() => { tokenInFlight = null; });
    return tokenInFlight;
  }
  async function fetchToken(nowSec: number): Promise<string> {
    const jwt = await signServiceJwt(o.clientEmail, o.privateKey, nowSec);
    const r = await call(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }).toString(),
    });
    if (!r.ok) throw r.status >= 500 ? fail(r, "token") : new GoogleError(`token: HTTP ${r.status}`, "auth", r.status);
    const j = await r.json();
    if (!j || typeof j.access_token !== "string") throw new GoogleError("token: respuesta sin access_token", "auth");
    token = { value: j.access_token, exp: nowSec + (Number(j.expires_in) || 3600) };
    return token.value;
  }
  async function authHeaders(): Promise<Record<string, string>> {
    return { Authorization: "Bearer " + (await accessToken()), "Content-Type": "application/json" };
  }
  async function freeBusyChunk(from: number, to: number): Promise<{ busy: Interval[]; errors: Record<string, string> }> {
    const r = await call(`${GOOGLE_API}/freeBusy`, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({ timeMin: new Date(from).toISOString(), timeMax: new Date(to).toISOString(), timeZone: "UTC", items: calendars.map((id) => ({ id })) }),
    });
    if (!r.ok) throw fail(r, "freeBusy");
    const j = await r.json();
    const busy: Interval[] = [];
    const errors: Record<string, string> = {};
    for (const id of calendars) {
      const c = j && j.calendars && j.calendars[id];
      if (!c) { errors[id] = "missing"; continue; }
      if (Array.isArray(c.errors) && c.errors.length) { errors[id] = String(c.errors[0].reason || "error"); continue; }
      for (const b of c.busy || []) {
        const s = Date.parse(b.start), e = Date.parse(b.end);
        if (Number.isFinite(s) && Number.isFinite(e) && e > s) busy.push({ start: s, end: e });
      }
    }
    return { busy, errors };
  }
  async function freeBusyAll(from: number, to: number) {
    const chunks: [number, number][] = [];
    for (let a = from; a < to; a += FREEBUSY_CHUNK_DAYS * 86400000) chunks.push([a, Math.min(to, a + FREEBUSY_CHUNK_DAYS * 86400000)]);
    const parts = await Promise.all(chunks.map(([a, b]) => freeBusyChunk(a, b)));
    return { busy: parts.flatMap((p) => p.busy), errors: Object.assign({}, ...parts.map((p) => p.errors)) as Record<string, string> };
  }
  const evUrl = (id?: string) => `${GOOGLE_API}/calendars/${encodeURIComponent(o.bookingCalendarId)}/events${id ? "/" + encodeURIComponent(id) : ""}`;
  return {
    // Nunca se devuelven huecos con información incompleta: si un calendario falla, falla todo
    async freeBusy(from, to) {
      const { busy, errors } = await freeBusyAll(from, to);
      const bad = Object.entries(errors);
      if (bad.length) throw new GoogleError("freeBusy: calendario no disponible (" + bad.map(([, v]) => v).join(", ") + ")", bad.some(([, v]) => v === "internalError") ? "server" : "calendar");
      return busy;
    },
    async calendarErrors(from, to) { return (await freeBusyAll(from, to)).errors; },
    async getEvent(eventId) {
      const r = await call(evUrl(eventId), { method: "GET", headers: await authHeaders() });
      if (r.status === 404 || r.status === 410) return { exists: false };
      if (!r.ok) throw fail(r, "events.get");
      const j = await r.json();
      return { exists: j.status !== "cancelled", status: j.status };
    },
    async insertEvent(event) {
      const r = await call(evUrl(), { method: "POST", headers: await authHeaders(), body: JSON.stringify(event) });
      if (r.status === 409) return { conflict: true };
      if (!r.ok) throw fail(r, "events.insert");
      return { conflict: false };
    },
    async deleteEvent(eventId) {
      const r = await call(evUrl(eventId), { method: "DELETE", headers: await authHeaders() });
      if (r.ok || r.status === 404 || r.status === 410) return;
      throw fail(r, "events.delete");
    },
    async tokenCheck() { await accessToken(); },
  };
}

// ============================================================
//  Base de datos (funciones SQL de la migración 0008 vía PostgREST)
// ============================================================
export class DbError extends Error {
  status: number;
  constructor(message: string, status = 0) { super(message); this.status = status; }
}
export function createDb(o: { url: string; key: string; fetch: typeof fetch }) {
  async function rpc<T>(fn: string, args: Json): Promise<T> {
    const headers: Record<string, string> = { "Content-Type": "application/json", apikey: o.key };
    if (!o.key.startsWith("sb_")) headers.Authorization = "Bearer " + o.key;   // claves clásicas (JWT); las nuevas solo en apikey
    let r: Response;
    try {
      r = await o.fetch(`${o.url.replace(/\/$/, "")}/rest/v1/rpc/${fn}`, {
        method: "POST", headers, body: JSON.stringify(args), signal: AbortSignal.timeout(DB_TIMEOUT_MS),
      });
    } catch (e) {
      throw new DbError(`${fn}: sin respuesta (${e instanceof Error ? e.name : "error"})`);
    }
    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      throw new DbError(`${fn}: HTTP ${r.status} ${detail.slice(0, 200)}`, r.status);
    }
    const txt = await r.text();
    return (txt ? JSON.parse(txt) : null) as T;
  }
  return {
    getConfig: () => rpc<{ settings: unknown; exceptions: unknown; now: string }>("call_get_config", {}),
    activeBookings: (from: number, to: number) =>
      rpc<{ id: string; status: string; starts_at: string; ends_at: string; local_date: string; stale: boolean }[]>(
        "call_active_bookings", { p_from: new Date(from).toISOString(), p_to: new Date(to).toISOString() }),
    stalePending: (limit: number) => rpc<Booking[]>("call_stale_pending", { p_limit: limit }),
    book: (a: Json) => rpc<{ ok: boolean; reason?: string; existing?: boolean; booking?: Booking }>("call_book", a),
    bookingByKey: (key: string) => rpc<Booking | null>("call_booking_by_key", { p_idempotency_key: key }),
    claimEvent: (id: string) => rpc<{ ok: boolean; booking: Booking | null }>("call_claim_event", { p_id: id, p_lease_seconds: LEASE_SECONDS }),
    endLease: (id: string) => rpc<null>("call_end_lease", { p_id: id }),
    markConfirmed: (id: string) => rpc<{ ok: boolean; reason?: string; booking?: Booking }>("call_mark_confirmed", { p_id: id }),
    release: (id: string, onlyStale: boolean) => rpc<boolean>("call_release", { p_id: id, p_only_stale: onlyStale }),
    bookingByToken: (id: string, hash: string) => rpc<Booking | null>("call_booking_by_token", { p_id: id, p_token_hash: hash }),
    markCancelled: (id: string, hash: string, by: string) =>
      rpc<{ ok: boolean; reason?: string; already?: boolean; booking?: Booking }>("call_mark_cancelled", { p_id: id, p_token_hash: hash, p_by: by }),
    claimNotifications: (limit: number, bookingId: string | null, withPendingConfig: boolean) =>
      rpc<{ id: string; kind: string; attempts: number; booking: Booking }[]>("call_claim_notifications",
        { p_limit: limit, p_booking: bookingId, p_with_pending_config: withPendingConfig }),
    notificationDone: (id: string, status: string, error: string | null) =>
      rpc<null>("call_notification_done", { p_id: id, p_status: status, p_error: error }),
    notificationsRetry: (ids: string[] | null) => rpc<number>("call_notifications_retry", { p_ids: ids }),
    rateHit: (bucket: string, limit: number, windowSeconds: number) =>
      rpc<boolean>("call_rate_hit", { p_bucket: bucket, p_limit: limit, p_window_seconds: windowSeconds }),
  };
}
export type Db = ReturnType<typeof createDb>;

// ============================================================
//  Correo (Resend, la infraestructura de correo prevista en el repo)
// ============================================================
export interface Mailer { configured: boolean; send(m: { to: string[]; subject: string; text: string; html: string; idempotencyKey: string; replyTo?: string }): Promise<{ ok: boolean; error?: string }>; }
export function createMailer(o: { apiKey?: string; from?: string; fetch: typeof fetch }): Mailer {
  const configured = !!(o.apiKey && o.from);
  return {
    configured,
    async send(m) {
      if (!configured) return { ok: false, error: "correo sin configurar" };
      try {
        const body: Json = { from: o.from, to: m.to, subject: m.subject, text: m.text, html: m.html };
        if (m.replyTo) body.reply_to = m.replyTo;
        const r = await o.fetch(RESEND_URL, {
          method: "POST",
          headers: { Authorization: "Bearer " + o.apiKey, "Content-Type": "application/json", "Idempotency-Key": m.idempotencyKey },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(MAIL_TIMEOUT_MS),
        });
        if (r.ok) return { ok: true };
        return { ok: false, error: `Resend HTTP ${r.status} ${(await r.text().catch(() => "")).slice(0, 200)}` };
      } catch (e) {
        return { ok: false, error: "Resend sin respuesta: " + (e instanceof Error ? e.name : "error") };
      }
    },
  };
}

// ---------- Textos de los correos y del evento ----------
function longDate(ms: number, lang: string): string {
  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "es-ES", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(ms));
}
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function htmlOf(lines: string[], link?: { url: string; label: string }): string {
  const body = lines.map((l) => (l ? `<p style="margin:0 0 10px">${esc(l)}</p>` : "")).join("");
  const a = link ? `<p style="margin:16px 0"><a href="${esc(link.url)}" style="color:#7a2334">${esc(link.label)}</a></p>` : "";
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#16294a">${body}${a}</div>`;
}
export function buildEmail(kind: string, b: Booking, cancelUrl: string): { subject: string; text: string; html: string; toFamily: boolean } {
  const start = Date.parse(b.starts_at);
  const en = b.lang === "en";
  const date = longDate(start, b.lang);
  const time = madridTime(start);
  const c = b.consult || ({} as Consult);
  if (kind === "familia_reserva") {
    const lines = en
      ? [`Hello ${b.family_name},`, "Your call is booked. We will call you on the number you gave us.", "",
        `Date: ${date}`, `Time: ${time} (Madrid time)`, `Length: ${SLOT_MINUTES} minutes`, `Phone: ${b.phone}`, "",
        "If you can no longer take the call, cancel it here and book another time on our website:"]
      : [`Hola, ${b.family_name}:`, "Tu llamada está reservada. Te llamaremos al número indicado.", "",
        `Fecha: ${date}`, `Hora: ${time} (hora de Madrid)`, `Duración: ${SLOT_MINUTES} minutos`, `Teléfono: ${b.phone}`, "",
        "Si no puedes atendernos, cancela la llamada en este enlace y reserva otra hora desde la web:"];
    const sign = ["", "Interlanguage Studies · interlanguage.es"];
    return {
      subject: en ? `Your call with Interlanguage: ${date}, ${time}` : `Tu llamada con Interlanguage: ${date}, ${time}`,
      text: [...lines, cancelUrl, ...sign].join("\n"),
      html: htmlOf(lines, { url: cancelUrl, label: en ? "Cancel the call" : "Cancelar la llamada" }) + htmlOf(sign),
      toFamily: true,
    };
  }
  if (kind === "familia_cancelacion") {
    const lines = en
      ? [`Hello ${b.family_name},`, `Your call on ${date} at ${time} (Madrid time) has been cancelled.`,
        "If you wish, you can book another time on interlanguage.es.", "", "Interlanguage Studies"]
      : [`Hola, ${b.family_name}:`, `Hemos cancelado tu llamada del ${date} a las ${time} (hora de Madrid).`,
        "Si quieres, puedes reservar otra hora en interlanguage.es.", "", "Interlanguage Studies"];
    return { subject: en ? "Your call has been cancelled" : "Tu llamada se ha cancelado", text: lines.join("\n"), html: htmlOf(lines), toFamily: true };
  }
  const details = [
    `Familia: ${b.family_name}`, `Teléfono: ${b.phone}`, `Correo: ${b.email}`,
    `Consulta: ${c.serviceLabel || c.service || "—"}`,
    c.studentAge ? `Edad del alumno/a: ${c.studentAge}` : "",
    c.serviceExtra ? `Detalle: ${c.serviceExtra}` : "",
    c.message ? `Mensaje: ${c.message}` : "",
    `Idioma de la web: ${en ? "inglés" : "español"}`,
  ].filter(Boolean);
  if (kind === "equipo_reserva") {
    const lines = ["Nueva llamada reservada desde la web.", "", `Fecha: ${date}`, `Hora: ${time} (hora de Madrid) · ${SLOT_MINUTES} min`, "", ...details, "",
      "Ya está en Google Calendar. Para cancelarla y avisar a la familia, usa este enlace (no borres el evento a mano):"];
    return { subject: `Nueva llamada: ${date}, ${time} · ${b.family_name}`, text: [...lines, cancelUrl + "&by=equipo"].join("\n"), html: htmlOf(lines, { url: cancelUrl + "&by=equipo", label: "Cancelar la llamada" }), toFamily: false };
  }
  const lines = ["Se ha cancelado una llamada reservada desde la web (el evento ya se ha borrado de Google Calendar).", "",
    `Fecha: ${date}`, `Hora: ${time} (hora de Madrid)`, "", ...details];
  return { subject: `Llamada cancelada: ${date}, ${time} · ${b.family_name}`, text: lines.join("\n"), html: htmlOf(lines), toFamily: false };
}
export function buildEvent(b: Booking, cancelUrl: string): Json {
  const c = b.consult || ({} as Consult);
  const description = [
    `Llamar a ${b.family_name}: ${b.phone}`,
    `Consulta: ${c.serviceLabel || c.service || "—"}`,
    c.studentAge ? `Edad del alumno/a: ${c.studentAge}` : "",
    c.callContext ? `Detalle: ${c.callContext}` : "",
    c.message ? `Mensaje de la familia: ${c.message}` : "",
    "",
    "Reservada desde la web. Para cancelarla y avisar a la familia (no borres el evento a mano):",
    cancelUrl + "&by=equipo",
  ].filter((l, i, a) => l !== "" || (i > 0 && a[i - 1] !== "")).join("\n");
  return {
    id: b.google_event_id,
    summary: `Llamada · ${b.family_name} · ${c.serviceLabel || c.service || "consulta"}`,
    description,
    start: { dateTime: new Date(Date.parse(b.starts_at)).toISOString(), timeZone: TZ },
    end: { dateTime: new Date(Date.parse(b.ends_at)).toISOString(), timeZone: TZ },
    transparency: "opaque",
    visibility: "private",
    reminders: { useDefault: true },
    extendedProperties: { private: { ilBookingId: b.id } },
  };
}

// ============================================================
//  Petición HTTP
// ============================================================
export interface HandlerDeps {
  env: (name: string) => string | undefined;
  fetch?: typeof fetch;
  now?: () => number;
  uuid?: () => string;
  log?: (evt: string, data: Json) => void;
}
interface Ctx {
  missing: string[];
  db: Db | null;
  google: GoogleClient | null;
  mailer: Mailer;
  secret: string;
  site: string;
  staffTo: string[];
  replyTo?: string;
  origins: string[];
  adminToken: string;
}

export function createHandler(deps: HandlerDeps): (req: Request) => Promise<Response> {
  const fx: typeof fetch = deps.fetch || ((input, init) => fetch(input, init));
  const now = deps.now || (() => Date.now());
  const uuid = deps.uuid || (() => crypto.randomUUID());
  const log = deps.log || ((evt: string, data: Json) => console.log(JSON.stringify({ evt, ...data })));
  let googleCache: { key: string; client: GoogleClient } | null = null;

  function context(): Ctx {
    const env = deps.env;
    const missing: string[] = [];
    const dbUrl = env("SUPABASE_URL");
    const dbKey = env("IL_SERVICE_KEY") || env("SUPABASE_SERVICE_ROLE_KEY");
    if (!dbUrl) missing.push("SUPABASE_URL");
    if (!dbKey) missing.push("IL_SERVICE_KEY");
    const saRaw = env("IL_CALLS_GOOGLE_SA");
    const sa = parseServiceAccount(saRaw);
    if (!sa) missing.push("IL_CALLS_GOOGLE_SA");
    const bookingCal = (env("IL_CALLS_BOOKING_CALENDAR_ID") || "").trim();
    if (!bookingCal) missing.push("IL_CALLS_BOOKING_CALENDAR_ID");
    const secret = env("IL_CALLS_SECRET") || "";
    if (secret.length < 32) missing.push("IL_CALLS_SECRET");
    const busyCals = (env("IL_CALLS_BUSY_CALENDAR_IDS") || "").split(",").map((x) => x.trim()).filter(Boolean);
    let google: GoogleClient | null = null;
    if (sa && bookingCal) {
      const key = [sa.clientEmail, bookingCal, ...busyCals].join("|") + "|" + (saRaw || "").length;
      if (!googleCache || googleCache.key !== key) {
        googleCache = { key, client: createGoogleClient({ clientEmail: sa.clientEmail, privateKey: sa.privateKey, bookingCalendarId: bookingCal, busyCalendarIds: busyCals, fetch: fx, now }) };
      }
      google = googleCache.client;
    }
    return {
      missing,
      db: dbUrl && dbKey ? createDb({ url: dbUrl, key: dbKey, fetch: fx }) : null,
      google,
      mailer: createMailer({ apiKey: env("RESEND_API_KEY"), from: env("MAIL_FROM"), fetch: fx }),
      secret,
      site: (env("IL_CALLS_PUBLIC_SITE") || "https://interlanguage.es").replace(/\/$/, ""),
      staffTo: (env("IL_CALLS_NOTIFY_TO") || "").split(",").map((x) => x.trim()).filter((x) => RE_EMAIL.test(x)),
      replyTo: env("IL_CALLS_REPLY_TO") || undefined,
      origins: (env("IL_CALLS_ALLOWED_ORIGINS") || "https://interlanguage.es,https://www.interlanguage.es").split(",").map((x) => x.trim()).filter(Boolean),
      adminToken: env("IL_CALLS_ADMIN_TOKEN") || "",
    };
  }

  function respond(status: number, body: Json, cors: Record<string, string>): Response {
    return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
  }
  async function cancelUrlFor(ctx: Ctx, b: Booking): Promise<string> {
    const t = await cancelToken(ctx.secret, b.id);
    return `${ctx.site}/llamada.html#id=${b.id}&t=${t}${b.lang === "en" ? "&lang=en" : ""}`;
  }
  function publicBooking(b: Booking): Json {
    const start = Date.parse(b.starts_at);
    return { id: b.id, status: b.status, start: new Date(start).toISOString(), end: new Date(Date.parse(b.ends_at)).toISOString(),
      date: madridDate(start), time: madridTime(start), durationMinutes: SLOT_MINUTES, phone: b.phone, lang: b.lang };
  }
  function clientIp(req: Request): string {
    const xf = req.headers.get("x-forwarded-for") || "";
    return (xf.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
  }
  async function bucket(ctx: Ctx, kind: string, value: string): Promise<string> {
    return kind + ":" + (await hmacB64url(ctx.secret, kind + ":" + value)).slice(0, 32);
  }
  async function limited(ctx: Ctx, kind: string, value: string, rule: { limit: number; window: number }): Promise<boolean> {
    return !(await (ctx.db as Db).rateHit(await bucket(ctx, kind, value), rule.limit, rule.window));
  }

  // ---- avisos por correo (nunca bloquean ni repiten una reserva) ----
  async function processNotifications(ctx: Ctx, bookingId: string | null, limit: number): Promise<Record<string, string>> {
    const db = ctx.db as Db;
    const out: Record<string, string> = {};
    const items = await db.claimNotifications(limit, bookingId, ctx.mailer.configured);
    for (const n of items) {
      const email = buildEmail(n.kind, n.booking, await cancelUrlFor(ctx, n.booking));
      const to = email.toFamily ? [n.booking.email] : ctx.staffTo;
      let status = "pending_config";
      let error: string | null = !ctx.mailer.configured ? "Falta RESEND_API_KEY o MAIL_FROM" : "Falta IL_CALLS_NOTIFY_TO";
      if (ctx.mailer.configured && to.length) {
        const r = await ctx.mailer.send({ to, subject: email.subject, text: email.text, html: email.html,
          idempotencyKey: `il-call-${n.id}-${n.attempts}`, replyTo: email.toFamily ? ctx.replyTo : undefined });
        status = r.ok ? "sent" : "failed";
        error = r.ok ? null : r.error || "error";
      }
      try { await db.notificationDone(n.id, status, error); } catch (e) { log("aviso_sin_registrar", { id: n.id, error: String(e) }); }
      out[n.kind] = status;
      if (status !== "sent") log("aviso_" + status, { id: n.id, kind: n.kind, booking: n.booking.id, error });
    }
    return out;
  }

  // ---- revisa reservas pendientes caducadas: si su evento llegó a crearse, se confirman; si no, se liberan ----
  async function reconcileStale(ctx: Ctx, limit: number): Promise<void> {
    const db = ctx.db as Db, google = ctx.google as GoogleClient;
    const stale = await db.stalePending(limit);
    for (const b of stale) {
      try {
        const ev = await google.getEvent(b.google_event_id);
        if (ev.exists) { await db.markConfirmed(b.id); log("pendiente_confirmada", { id: b.id }); }
        else { await db.release(b.id, true); log("pendiente_liberada", { id: b.id }); }
      } catch (e) {
        log("pendiente_sin_revisar", { id: b.id, error: String(e) });
      }
    }
  }

  async function availabilityFor(ctx: Ctx, s: ReadySettings, exceptions: CallException[], fromDate: string, toDate: string): Promise<DayInfo[]> {
    const db = ctx.db as Db, google = ctx.google as GoogleClient;
    const buf = s.bufferMinutes * 60000;
    const from = dayStartUtc(fromDate) - buf, to = dayStartUtc(addDays(toDate, 1)) + buf;
    const [busy, rows] = await Promise.all([google.freeBusy(from, to), db.activeBookings(from, to)]);
    const bookings: BookingBlock[] = rows.map((r) => ({ start: Date.parse(r.starts_at), end: Date.parse(r.ends_at), localDate: r.local_date, stale: r.stale }));
    return computeDays({ settings: s, exceptions, busy, bookings, now: now(), fromDate, toDate });
  }

  async function loadSettings(ctx: Ctx): Promise<{ s: ReadySettings; exceptions: CallException[] } | null> {
    const cfg = await (ctx.db as Db).getConfig();
    const s = parseSettings(cfg && cfg.settings);
    if (!settingsReady(s)) return null;
    return { s, exceptions: parseExceptions(cfg.exceptions) };
  }

  // ---------- GET availability ----------
  async function availability(ctx: Ctx, req: Request, url: URL, cors: Record<string, string>): Promise<Response> {
    if (ctx.missing.length) return respond(200, { status: "not_configured" }, cors);
    if (await limited(ctx, "av", clientIp(req), RATE.availability)) return respond(429, { status: "rate_limited" }, cors);
    const conf = await loadSettings(ctx);
    if (!conf) return respond(200, { status: "not_configured" }, cors);
    const { s, exceptions } = conf;
    const win = bookingWindow(s, now());
    await reconcileStale(ctx, 3).catch((e) => log("revision_fallida", { error: String(e) }));
    const all = await availabilityFor(ctx, s, exceptions, win.firstWeek, addDays(win.lastWeek, 6));
    const asked = url.searchParams.get("week");
    let week = validDate(asked) ? mondayOf(asked) : win.firstWeek;
    if (week < win.firstWeek) week = win.firstWeek;
    if (week > win.lastWeek) week = win.lastWeek;
    const days = all.filter((d) => d.date >= week && d.date <= addDays(week, 6));
    const first = all.find((d) => d.state === "available");
    const workdays = DAY_KEYS.map((k, i) => ((s.weeklyHours[k] || []).length ? i + 1 : 0)).filter(Boolean);
    return respond(200, {
      status: "ok", timezone: TZ, slotMinutes: SLOT_MINUTES, workdays,
      week: { start: week, prev: week > win.firstWeek ? addDays(week, -7) : null, next: week < win.lastWeek ? addDays(week, 7) : null },
      days: days.map((d) => ({ date: d.date, weekday: d.weekday, state: d.state, slots: d.slots.map((x) => ({ start: new Date(x.start).toISOString(), time: x.time })) })),
      firstAvailable: first ? first.date : null,
    }, cors);
  }

  // ---------- crear (o terminar de crear) el evento y confirmar ----------
  async function confirmed(ctx: Ctx, b: Booking, cors: Record<string, string>): Promise<Response> {
    let email: Record<string, string> = {};
    try { email = await processNotifications(ctx, b.id, 4); } catch (e) { log("avisos_fallidos", { id: b.id, error: String(e) }); }
    return respond(200, {
      status: "confirmed", booking: publicBooking({ ...b, status: "confirmed" }), cancelUrl: await cancelUrlFor(ctx, b),
      email: { family: email.familia_reserva || "unknown", staff: email.equipo_reserva || "unknown" },
    }, cors);
  }
  async function ensureEvent(ctx: Ctx, b: Booking, cors: Record<string, string>): Promise<Response> {
    const db = ctx.db as Db, google = ctx.google as GoogleClient;
    const claim = await db.claimEvent(b.id);
    if (!claim.ok) {
      const cur = claim.booking;
      if (cur && cur.status === "confirmed") return confirmed(ctx, cur, cors);
      if (cur && cur.status === "pending") return respond(202, { status: "processing" }, cors);
      return respond(409, { status: "expired_key" }, cors);
    }
    const cur = claim.booking as Booking;
    try {
      const ev = await google.getEvent(cur.google_event_id);
      if (!ev.exists) {
        const ins = await google.insertEvent(buildEvent(cur, await cancelUrlFor(ctx, cur)));
        if (ins.conflict) {
          const again = await google.getEvent(cur.google_event_id);
          if (!again.exists) throw new GoogleError("id de evento en uso sin evento activo", "bad", 409);
        }
      }
    } catch (e) {
      const g = e instanceof GoogleError ? e : new GoogleError(String(e), "network");
      if (g.retryable) {
        await db.endLease(cur.id).catch(() => undefined);   // sigue retenida: el reintento de la familia continúa
        log("evento_pendiente", { id: cur.id, error: g.message });
        return respond(503, { status: "unavailable", retry: true }, cors);
      }
      await db.release(cur.id, false).catch(() => undefined);   // Google lo ha rechazado: el evento no existe, se libera el hueco
      log("evento_rechazado", { id: cur.id, error: g.message });
      return respond(503, { status: "unavailable", retry: false }, cors);
    }
    const conf = await db.markConfirmed(cur.id);
    if (!conf.ok || !conf.booking) {
      log("confirmacion_fallida", { id: cur.id, reason: conf.reason || "" });
      return respond(503, { status: "unavailable", retry: true }, cors);
    }
    log("reserva_confirmada", { id: cur.id });
    return confirmed(ctx, conf.booking, cors);
  }

  // ---------- POST book ----------
  async function book(ctx: Ctx, req: Request, body: Json, cors: Record<string, string>): Promise<Response> {
    if (typeof body.website === "string" && body.website.trim()) return respond(400, { status: "invalid", fields: ["website"] }, cors);
    const v = validateBooking(body, now());
    if (!v.ok) return respond(400, { status: "invalid", fields: v.fields }, cors);
    if (ctx.missing.length) return respond(503, { status: "not_configured" }, cors);
    const db = ctx.db as Db;
    const input = v.value;
    const phoneHash = await hmacB64url(ctx.secret, "phone:" + input.phoneNormalized);
    const existing = await db.bookingByKey(input.idempotencyKey);
    if (existing) {
      if (Date.parse(existing.starts_at) !== input.slotStart || existing.phone_hash !== phoneHash) return respond(409, { status: "expired_key" }, cors);
      if (existing.status === "confirmed") return confirmed(ctx, existing, cors);
      if (existing.status === "pending") return ensureEvent(ctx, existing, cors);
      return respond(409, { status: "expired_key" }, cors);
    }
    if (await limited(ctx, "bk", clientIp(req), RATE.book) || await limited(ctx, "ph", input.phoneNormalized, RATE.bookPhone)) {
      return respond(429, { status: "rate_limited" }, cors);
    }
    const conf = await loadSettings(ctx);
    if (!conf) return respond(503, { status: "not_configured" }, cors);
    const { s, exceptions } = conf;
    await reconcileStale(ctx, 5).catch((e) => log("revision_fallida", { error: String(e) }));
    // Se vuelve a comprobar el hueco con Google y con las reservas en este momento
    const date = madridDate(input.slotStart);
    const [day] = await availabilityFor(ctx, s, exceptions, date, date);
    if (!day || !day.slots.some((x) => x.start === input.slotStart)) {
      return respond(409, { status: day && day.state === "full" && s.maxPerDay !== null ? "day_full" : "slot_taken" }, cors);
    }
    const id = uuid();
    const token = await cancelToken(ctx.secret, id);
    const r = await db.book({
      p_id: id,
      p_idempotency_key: input.idempotencyKey,
      p_starts_at: new Date(input.slotStart).toISOString(),
      p_ends_at: new Date(input.slotStart + SLOT_MINUTES * 60000).toISOString(),
      p_buffer_minutes: s.bufferMinutes,
      p_max_per_day: s.maxPerDay,
      p_max_active_per_phone: MAX_ACTIVE_PER_PHONE,
      p_hold_seconds: HOLD_SECONDS,
      p_phone: input.phone,
      p_phone_hash: phoneHash,
      p_email: input.email,
      p_family_name: input.fullName,
      p_lang: input.lang,
      p_consult: input.consult as unknown as Json,
      p_cancel_token_hash: await sha256Hex(token),
      p_source_ip_hash: (await bucket(ctx, "ip", clientIp(req))).slice(3),
    });
    if (!r.ok || !r.booking) {
      const reason = r.reason || "slot_taken";
      if (reason === "too_many") return respond(429, { status: "too_many" }, cors);
      if (reason === "key_mismatch") return respond(409, { status: "expired_key" }, cors);
      return respond(409, { status: reason === "day_full" ? "day_full" : "slot_taken" }, cors);
    }
    if (r.booking.status === "confirmed") return confirmed(ctx, r.booking, cors);
    if (r.booking.status !== "pending") return respond(409, { status: "expired_key" }, cors);
    return ensureEvent(ctx, r.booking, cors);
  }

  // ---------- reserva por enlace (página de cancelación) ----------
  async function byLink(ctx: Ctx, id: unknown, token: unknown): Promise<Booking | null> {
    if (typeof id !== "string" || !RE_UUID.test(id) || typeof token !== "string" || token.length < 20 || token.length > 100) return null;
    const expected = await cancelToken(ctx.secret, id.toLowerCase());
    if (!safeEqual(expected, token)) return null;
    return (ctx.db as Db).bookingByToken(id.toLowerCase(), await sha256Hex(token));
  }
  async function bookingInfo(ctx: Ctx, req: Request, url: URL, cors: Record<string, string>): Promise<Response> {
    if (ctx.missing.length) return respond(503, { status: "not_configured" }, cors);
    if (await limited(ctx, "bi", clientIp(req), RATE.booking)) return respond(429, { status: "rate_limited" }, cors);
    const b = await byLink(ctx, url.searchParams.get("id"), url.searchParams.get("t"));
    if (!b) return respond(404, { status: "not_found" }, cors);
    const start = Date.parse(b.starts_at);
    const digits = b.phone.replace(/\D/g, "");
    return respond(200, {
      status: b.status,
      booking: { date: madridDate(start), time: madridTime(start), start: new Date(start).toISOString(), durationMinutes: SLOT_MINUTES,
        phoneEnd: digits.slice(-3), lang: b.lang },
      cancellable: b.status === "confirmed" && start > now(),
    }, cors);
  }
  async function cancel(ctx: Ctx, req: Request, body: Json, cors: Record<string, string>): Promise<Response> {
    if (ctx.missing.length) return respond(503, { status: "not_configured" }, cors);
    if (await limited(ctx, "cx", clientIp(req), RATE.cancel)) return respond(429, { status: "rate_limited" }, cors);
    const b = await byLink(ctx, body.id, body.token);
    if (!b) return respond(404, { status: "not_found" }, cors);
    if (b.status === "cancelled") return respond(200, { status: "cancelled", already: true }, cors);
    if (b.status !== "confirmed") return respond(409, { status: "not_cancellable" }, cors);
    if (Date.parse(b.starts_at) <= now()) return respond(409, { status: "too_late" }, cors);
    try {
      await (ctx.google as GoogleClient).deleteEvent(b.google_event_id);
    } catch (e) {
      log("cancelacion_pendiente", { id: b.id, error: String(e) });
      return respond(503, { status: "unavailable" }, cors);
    }
    const by = body.by === "equipo" ? "equipo" : "familia";
    const r = await (ctx.db as Db).markCancelled(b.id, await sha256Hex(String(body.token)), by);
    if (!r.ok) return respond(409, { status: "not_cancellable" }, cors);
    log("reserva_cancelada", { id: b.id, by });
    let email: Record<string, string> = {};
    try { email = await processNotifications(ctx, b.id, 4); } catch (e) { log("avisos_fallidos", { id: b.id, error: String(e) }); }
    return respond(200, { status: "cancelled", already: !!r.already, email: { family: email.familia_cancelacion || "unknown" } }, cors);
  }

  // ---------- administración ----------
  function isAdmin(ctx: Ctx, req: Request): boolean {
    const t = req.headers.get("x-il-admin") || "";
    return ctx.adminToken.length >= 24 && safeEqual(t, ctx.adminToken);
  }
  async function health(ctx: Ctx): Promise<Response> {
    const out: Json = { config: { missing: ctx.missing }, mail: { configured: ctx.mailer.configured, staffTo: ctx.staffTo.length > 0 } };
    if (ctx.db) {
      try {
        const cfg = await ctx.db.getConfig();
        const s = parseSettings(cfg.settings);
        out.db = "ok";
        out.settings = { enabled: !!(s && s.enabled), ready: settingsReady(s) };
      } catch (e) { out.db = "error: " + String(e).slice(0, 200); }
    }
    if (ctx.google) {
      try {
        await ctx.google.tokenCheck();
        out.googleToken = "ok";
        const t = now();
        const errors = await ctx.google.calendarErrors(t, t + 86400000);
        out.calendars = Object.keys(errors).length ? errors : "ok";
      } catch (e) { out.googleToken = "error: " + String(e).slice(0, 200); }
    }
    return respond(200, out, {});
  }
  async function calendarWriteTest(ctx: Ctx): Promise<Response> {
    if (!ctx.google) return respond(503, { status: "not_configured", missing: ctx.missing }, {});
    const id = "iltest" + uuid().replace(/-/g, "");
    const start = Date.now() + 30 * 86400000;
    try {
      await ctx.google.insertEvent({ id, summary: "Prueba de Interlanguage (se borra sola)", start: { dateTime: new Date(start).toISOString() }, end: { dateTime: new Date(start + 600000).toISOString() } });
      await ctx.google.deleteEvent(id);
      return respond(200, { status: "ok", detail: "Evento de prueba creado y borrado en el calendario de reservas." }, {});
    } catch (e) {
      return respond(200, { status: "error", detail: String(e).slice(0, 300) }, {});
    }
  }

  return async function handler(req: Request): Promise<Response> {
    const ctx = context();
    const origin = req.headers.get("origin");
    const allowed = !!origin && ctx.origins.includes(origin);
    const cors: Record<string, string> = allowed
      ? { "Access-Control-Allow-Origin": origin as string, Vary: "Origin", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "content-type", "Access-Control-Max-Age": "600" }
      : { Vary: "Origin" };
    if (req.method === "OPTIONS") return new Response(null, { status: allowed ? 204 : 403, headers: cors });
    if (origin && !allowed) return respond(403, { status: "forbidden_origin" }, cors);
    const url = new URL(req.url);
    try {
      if (req.method === "GET") {
        const action = url.searchParams.get("action");
        if (action === "availability") return await availability(ctx, req, url, cors);
        if (action === "booking") return await bookingInfo(ctx, req, url, cors);
        if (action === "health") return isAdmin(ctx, req) ? await health(ctx) : respond(401, { status: "unauthorized" }, cors);
        return respond(400, { status: "unknown_action" }, cors);
      }
      if (req.method !== "POST") return respond(405, { status: "method_not_allowed" }, cors);
      const raw = await req.text();
      if (raw.length > MAX_BODY_BYTES) return respond(413, { status: "too_large" }, cors);
      let body: Json;
      try { body = JSON.parse(raw || "{}"); } catch { return respond(400, { status: "invalid_json" }, cors); }
      if (!body || typeof body !== "object" || Array.isArray(body)) return respond(400, { status: "invalid_json" }, cors);
      const action = body.action;
      if (action === "book") {
        if (!allowed) return respond(403, { status: "forbidden_origin" }, cors);   // solo desde la web
        return await book(ctx, req, body, cors);
      }
      if (action === "cancel") {
        if (!allowed) return respond(403, { status: "forbidden_origin" }, cors);
        return await cancel(ctx, req, body, cors);
      }
      if (action === "retry-notifications" || action === "calendar-write-test") {
        if (!isAdmin(ctx, req)) return respond(401, { status: "unauthorized" }, cors);
        if (action === "calendar-write-test") return await calendarWriteTest(ctx);
        if (!ctx.db) return respond(503, { status: "not_configured", missing: ctx.missing }, cors);
        const ids = Array.isArray(body.ids) ? body.ids.filter((x) => typeof x === "string" && RE_UUID.test(x)) as string[] : null;
        const queued = await ctx.db.notificationsRetry(ids && ids.length ? ids : null);
        const result = await processNotifications(ctx, null, 20);
        return respond(200, { status: "ok", queued, processed: result }, cors);
      }
      return respond(400, { status: "unknown_action" }, cors);
    } catch (e) {
      const isGoogle = e instanceof GoogleError, isDb = e instanceof DbError;
      log("error", { kind: isGoogle ? "google" : isDb ? "db" : "interno", error: String(e).slice(0, 300) });
      // Si Google o la base de datos fallan no se muestran horarios ni se da nada por reservado
      return respond(503, { status: "unavailable" }, cors);
    }
  };
}

// ---------- Arranque en Supabase (Deno). En Node (pruebas) no se ejecuta. ----------
const DenoRef = (globalThis as unknown as { Deno?: { serve: (h: (r: Request) => Promise<Response>) => unknown; env: { get(k: string): string | undefined } } }).Deno;
if (DenoRef && typeof DenoRef.serve === "function") {
  DenoRef.serve(createHandler({ env: (k) => DenoRef.env.get(k) }));
}
