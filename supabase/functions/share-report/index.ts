// ============================================================
//  Interlanguage · Edge Function "share-report"  (B14)
//  Enlace SEGURO y CADUCABLE para que la familia vea el informe
//  del alumno SIN cuenta. Token firmado (HMAC), sin tabla extra.
//
//  Acciones:
//   - POST {action:"create", student_id, days_valid}  (staff) -> {token, path}
//   - GET  ?token=...                                  (público) -> resumen del informe
//
//  Desplegar: panel Supabase → Edge Functions → deploy "share-report".
//  Secretos: IL_SERVICE_KEY (sb_secret_) y IL_SHARE_SECRET (una frase larga cualquiera).
// ============================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const b64url = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf as ArrayBuffer))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const enc = new TextEncoder();

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return b64url(sig);
}
function makePayload(sid: string, exp: number) { return b64url(enc.encode(JSON.stringify({ sid, exp }))); }
function readPayload(p: string): { sid: string; exp: number } | null {
  try { return JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/"))); } catch { return null; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const URL_ = Deno.env.get("SUPABASE_URL")!;
  const SERVICE = Deno.env.get("IL_SERVICE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const SHARE_SECRET = Deno.env.get("IL_SHARE_SECRET") || "cambia-esta-frase";
  const admin = createClient(URL_, SERVICE, { auth: { autoRefreshToken: false, persistSession: false } });

  // ---- Crear enlace (solo staff autenticado) ----
  if (req.method === "POST") {
    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const { data: { user } } = await admin.auth.getUser(token);
    if (!user) return json({ error: "No autenticado" }, 401);
    const { data: staff } = await admin.from("user_roles").select("role_id").eq("user_id", user.id).in("role_id", ["admin", "teacher"]).maybeSingle();
    if (!staff) return json({ error: "Solo el equipo puede crear enlaces" }, 403);

    const body = await req.json().catch(() => ({}));
    const sid = String(body.student_id || "");
    if (!sid) return json({ error: "Falta student_id" }, 400);
    const days = Math.min(Math.max(parseInt(body.days_valid) || 14, 1), 60);
    const exp = Math.floor(Date.now() / 1000) + days * 86400;
    const payload = makePayload(sid, exp);
    const tok = payload + "." + await sign(payload, SHARE_SECRET);
    return json({ token: tok, path: "/plataforma/informe.html?token=" + tok, expires_in_days: days });
  }

  // ---- Leer informe por token (público, caducable) ----
  const url = new URL(req.url);
  const tok = url.searchParams.get("token") || "";
  const [payload, sig] = tok.split(".");
  if (!payload || !sig) return json({ error: "Enlace inválido" }, 400);
  if (await sign(payload, SHARE_SECRET) !== sig) return json({ error: "Enlace inválido" }, 401);
  const data = readPayload(payload);
  if (!data || data.exp < Math.floor(Date.now() / 1000)) return json({ error: "Enlace caducado" }, 401);

  const sid = data.sid;
  const [{ data: st }, { data: state }, { data: streak }, { data: rewards }, { count: days }] = await Promise.all([
    admin.from("students").select("first_name").eq("id", sid).maybeSingle(),
    admin.from("student_state").select("lessons").eq("student_id", sid).maybeSingle(),
    admin.from("streaks").select("current,longest").eq("student_id", sid).maybeSingle(),
    admin.from("student_rewards").select("reward_id").eq("student_id", sid),
    admin.from("practice_sessions").select("id", { count: "exact", head: true }).eq("student_id", sid),
  ]);

  return json({
    first_name: st?.first_name || "Alumno",
    lessons: state?.lessons || 0,
    streak: streak?.current || 0,
    best: streak?.longest || 0,
    days: days || (state?.lessons || 0),
    medal_ids: (rewards || []).map((r: any) => r.reward_id),
  });
});
