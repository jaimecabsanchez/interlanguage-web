// ============================================================
//  Interlanguage HOME · Edge Function "admin-create-student"
//  Crea cuentas de alumno y restablece contraseñas con permisos
//  de servidor. Solo un usuario ADMIN autenticado puede llamarla.
//
//  Desplegar con:  supabase functions deploy admin-create-student
//  (o desde el panel de Supabase → Edge Functions → New function)
// ============================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Debe coincidir con emailDomain de plataforma/supabase-config.js
const EMAIL_DOMAIN = "alumnos.interlanguage-home.es";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

function generatePassword(): string {
  const letters = "abcdefghijkmnpqrstuvwxyz"; // sin l/o para evitar confusiones
  const digits = "23456789";
  const pick = (set: string, n: number) =>
    Array.from({ length: n }, () => set[Math.floor(Math.random() * set.length)]).join("");
  return pick(letters, 5) + pick(digits, 3);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // 1) Identificar a quien llama y comprobar que es ADMIN
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const asCaller = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user } } = await asCaller.auth.getUser(token);
  if (!user) return json({ error: "No autenticado" }, 401);

  const { data: me } = await asCaller.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!me?.is_admin) return json({ error: "Solo un administrador puede hacer esto" }, 403);

  // 2) Cliente con permisos de servidor (service_role) para las operaciones
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

  let payload: any;
  try { payload = await req.json(); } catch { return json({ error: "Cuerpo inválido" }, 400); }
  const action = payload.action;

  // -------- CREAR ALUMNO --------
  if (action === "create") {
    const username = String(payload.username || "").trim().toLowerCase().replace(/\s+/g, "");
    const full_name = String(payload.full_name || "").trim();
    if (!username || !full_name) return json({ error: "Faltan el nombre y el usuario" }, 400);

    const password = generatePassword();
    const { error } = await admin.auth.admin.createUser({
      email: `${username}@${EMAIL_DOMAIN}`,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        full_name,
        level: payload.level || "",
        stage: payload.stage || "",
        parent_email: payload.parent_email || "",
        is_admin: false,
        must_change_password: true,
      },
    });
    if (error) {
      const msg = /already been registered|duplicate/i.test(error.message) ? "Ese usuario ya existe" : error.message;
      return json({ error: msg }, 400);
    }
    return json({ username, password });
  }

  // -------- RESTABLECER CONTRASEÑA --------
  if (action === "reset") {
    const username = String(payload.username || "").trim().toLowerCase();
    const { data: prof } = await admin.from("profiles").select("id").eq("username", username).single();
    if (!prof) return json({ error: "No existe ese alumno" }, 404);

    const password = generatePassword();
    const { error: e1 } = await admin.auth.admin.updateUserById(prof.id, { password });
    if (e1) return json({ error: e1.message }, 400);
    await admin.from("profiles").update({ must_change_password: true }).eq("id", prof.id);
    return json({ username, password });
  }

  return json({ error: "Acción desconocida" }, 400);
});
