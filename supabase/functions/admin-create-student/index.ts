// ============================================================
//  Interlanguage · Edge Function "admin-create-student"
//  Crea alumnos y restablece contraseñas con permisos de servidor.
//  Solo un ADMIN autenticado puede llamarla. Modelo nuevo:
//  users + students + user_roles + enrollments + student_state + streaks.
//
//  Desplegar:  supabase functions deploy admin-create-student
//  (o panel de Supabase → Edge Functions → Deploy)
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

// Palabras del "mundo" de Nemo (sencillas, fáciles de teclear para un niño)
const ADJ = ["blue","red","green","happy","brave","sunny","tiny","cool","fast","kind","bright","calm",
             "lucky","clever","jolly","gold","silver","funny","smart","swift","proud","merry","royal","fluffy"];
const NOUN = ["fox","owl","bear","lion","frog","panda","tiger","koala","otter","robin","seal","whale",
              "puma","hawk","wolf","deer","mole","dove","crab","lynx","moth","yak","bee","cub"];

function pick<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)]; }
function generateUsername(): string {
  return `${pick(ADJ)}-${pick(NOUN)}-${Math.floor(100 + Math.random() * 900)}`;
}
function generatePassword(): string {
  const letters = "abcdefghijkmnpqrstuvwxyz"; // sin l/o
  const digits = "23456789";
  const p = (set: string, n: number) => Array.from({ length: n }, () => set[Math.floor(Math.random() * set.length)]).join("");
  return p(letters, 5) + p(digits, 3);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  // Clave SECRETA de servidor. En proyectos con el sistema de claves NUEVO usa la sb_secret_…
  // guardada como secreto de la función (IL_SERVICE_KEY); si no, la service_role clásica.
  const SERVICE_KEY = Deno.env.get("IL_SERVICE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Cliente con permisos de servidor (no depende de la clave anon)
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

  // 1) Identificar a quien llama (valida su token) y comprobar que es ADMIN (por user_roles)
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return json({ error: "No autenticado" }, 401);

  const { data: roleRow } = await admin.from("user_roles").select("role_id").eq("user_id", user.id).eq("role_id", "admin").maybeSingle();
  if (!roleRow) return json({ error: "Solo un administrador puede hacer esto" }, 403);

  let payload: any;
  try { payload = await req.json(); } catch { return json({ error: "Cuerpo inválido" }, 400); }
  const action = payload.action;

  const audit = (action: string, entity: string, entity_id: string, metadata: unknown = {}) =>
    admin.from("audit_log").insert({ actor_user_id: user.id, action, entity, entity_id, metadata });

  // -------- CREAR ALUMNO --------
  if (action === "create") {
    const first_name = String(payload.full_name || payload.first_name || "").trim();
    if (!first_name) return json({ error: "Falta el nombre del alumno" }, 400);

    // Genera un código único (reintenta si choca)
    let username = "";
    for (let i = 0; i < 8; i++) {
      const cand = generateUsername();
      const { data: exists } = await admin.from("users").select("id").eq("username", cand).maybeSingle();
      if (!exists) { username = cand; break; }
    }
    if (!username) return json({ error: "No se pudo generar un código único. Inténtalo otra vez." }, 500);

    const password = generatePassword();
    const { data: created, error: eCreate } = await admin.auth.admin.createUser({
      email: `${username}@${EMAIL_DOMAIN}`,
      password,
      email_confirm: true,
      user_metadata: { username, display_name: first_name, must_change_password: true },
    });
    if (eCreate || !created?.user) return json({ error: eCreate?.message || "No se pudo crear la cuenta" }, 400);
    const uid = created.user.id;

    // La fila public.users la crea el trigger handle_new_user. Ahora el resto:
    const { data: student, error: eStudent } = await admin.from("students")
      .insert({ user_id: uid, first_name, birth_year: payload.birth_year ?? null, level_id: payload.level_id ?? null })
      .select("id").single();
    if (eStudent || !student) return json({ error: "Cuenta creada pero falló la ficha de alumno: " + (eStudent?.message || "") }, 500);
    const sid = student.id;

    await admin.from("user_roles").insert({ user_id: uid, role_id: "student" });
    await admin.from("enrollments").insert({ student_id: sid, plan_id: "premium_home", status: "active", starts_on: new Date().toISOString().slice(0, 10) });
    await admin.from("student_state").insert({ student_id: sid });
    await admin.from("streaks").insert({ student_id: sid });

    // Familia (opcional): guarda contacto para informes. El CONSENTIMIENTO NO se auto-otorga.
    const parentEmail = String(payload.parent_email || "").trim();
    if (parentEmail) {
      const { data: fam } = await admin.from("families").insert({ contact_email: parentEmail }).select("id").single();
      if (fam) await admin.from("student_guardians").insert({ student_id: sid, family_id: fam.id, relation: "tutor" });
    }

    await audit("student.create", "students", sid, { username });
    return json({ username, password });
  }

  // -------- RESTABLECER CONTRASEÑA --------
  if (action === "reset") {
    const username = String(payload.username || "").trim().toLowerCase();
    const { data: urow } = await admin.from("users").select("id").eq("username", username).maybeSingle();
    if (!urow) return json({ error: "No existe ese alumno" }, 404);

    const password = generatePassword();
    const { error: e1 } = await admin.auth.admin.updateUserById(urow.id, { password });
    if (e1) return json({ error: e1.message }, 400);
    await admin.from("users").update({ must_change_password: true }).eq("id", urow.id);
    await audit("password.reset", "users", urow.id, { username });
    return json({ username, password });
  }

  return json({ error: "Acción desconocida" }, 400);
});
