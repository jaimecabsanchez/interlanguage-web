/* ============================================================
   Interlanguage · capa de autenticación
   Funciona con Supabase real, o en MODO DEMO si no hay claves.
   API pública: window.ILAuth
   Modelo real: users + user_roles + students + student_state + streaks
   ============================================================ */
(function () {
  const CFG = window.IL_SUPABASE || {};
  const DOMAIN = CFG.emailDomain || "alumnos.interlanguage-home.es";
  const KEY = CFG.publishableKey || CFG.anonKey || "";
  const noKeys = !CFG.url || CFG.url.indexOf("TU-PROYECTO") !== -1
            || !KEY || KEY.indexOf("TU-ANON") !== -1 || KEY.indexOf("TU-PUBLISHABLE") !== -1;

  // En LOCAL (tu ordenador: localhost / 127.0.0.1 / file://), el modo demo está
  // activado POR DEFECTO — así "lucia / home1234" y "admin / admin1234" funcionan
  // sin tener que añadir nada a la dirección. Se puede desactivar con ?demo=0.
  // En un dominio real (Netlify) nunca se activa: producción usa siempre Supabase.
  let forceDemo = false;
  try {
    const host = location.hostname || "";
    const isLocal = host === "localhost" || host === "127.0.0.1" || host === "" || host.endsWith(".local");
    const qs = new URLSearchParams(location.search);
    // ?demo=1 / ?demo=0 fuerza o desactiva el modo demo en CUALQUIER dominio (enlaces de
    // preview para ver/enseñar la app con "lucia"). La marca de la URL MANDA al instante,
    // aunque el navegador bloquee el almacenamiento (Safari privado / iPad con privacidad
    // estricta): así un enlace compartido siempre entra en demo. Guardarlo es solo "por si acaso".
    // En LOCAL el demo está activado por defecto. Sin marca en un dominio real → producción (Supabase).
    const qDemo = qs.get("demo");
    let decided = null;
    if (qDemo === "1") { forceDemo = true; decided = "1"; }
    else if (qDemo === "0") { forceDemo = false; decided = "0"; }
    try {
      if (decided) localStorage.setItem("il_force_demo", decided);
      if (decided === null) {
        const stored = localStorage.getItem("il_force_demo");
        if (stored === "1") forceDemo = true;
        else if (stored === "0") forceDemo = false;
        else forceDemo = isLocal;
      }
    } catch (e) { if (decided === null) forceDemo = isLocal; }
  } catch (e) {}
  const DEMO = noKeys || forceDemo;

  let sb = null;
  if (!DEMO && window.supabase && window.supabase.createClient) {
    sb = window.supabase.createClient(CFG.url, KEY);
  }

  // Utilidades puras (módulo testeable) con fallback inline por seguridad.
  const U = window.IL_AUTH_UTILS || {};
  const looksLikeEmail = U.looksLikeEmail || ((s) => String(s).indexOf("@") !== -1);
  const usernameToEmail = U.usernameToEmail ? (u) => U.usernameToEmail(u, DOMAIN)
    : (u) => String(u).trim().toLowerCase() + "@" + DOMAIN;
  const toLoginEmail = U.toLoginEmail ? (id) => U.toLoginEmail(id, DOMAIN)
    : (id) => looksLikeEmail(id) ? String(id).trim().toLowerCase() : usernameToEmail(id);
  const validSex = value => value === "male" || value === "female";

  /* ---------------- MODO DEMO (localStorage) ---------------- */
  const DEMO_DB = "il_demo_db_v2", DEMO_SESSION = "il_demo_session_v2";
  function seed() {
    return [
      { username: "admin", password: "admin1234", full_name: "Equipo Interlanguage", level: "", stage: "", parent_email: "", is_admin: true, must_change_password: false, created_at: "2026-07-01" },
      { username: "lucia", password: "home1234", full_name: "Lucía G.", level: "Explorer · A1", stage: "Explorers", sex: "female", parent_email: "familia.g@email.com", is_admin: false, must_change_password: false, created_at: "2026-07-20" }
    ];
  }
  function demoLoad() {
    try {
      const db = JSON.parse(localStorage.getItem(DEMO_DB)) || seed();
      const lucia = db.find(account => account.username === "lucia");
      if (lucia && !validSex(lucia.sex)) { lucia.sex = "female"; localStorage.setItem(DEMO_DB, JSON.stringify(db)); }
      return db;
    } catch (e) { return seed(); }
  }
  function demoSave(db) { localStorage.setItem(DEMO_DB, JSON.stringify(db)); }
  function demoSession() { return localStorage.getItem(DEMO_SESSION); }
  function pub(acc) { if (!acc) return null; const { password, ...rest } = acc; return { ...rest, id: rest.username, is_student: !rest.is_admin }; }
  const randPass = U.generatePassword || function () {
    const a = "abcdefghijkmnpqrstuvwxyz", n = "23456789";
    let p = ""; for (let i = 0; i < 5; i++) p += a[Math.floor(Math.random() * a.length)];
    for (let i = 0; i < 3; i++) p += n[Math.floor(Math.random() * n.length)];
    return p;
  };
  const randUsername = U.generateUsername || (() => "student-" + Math.floor(100000 + Math.random() * 900000));

  /* ---------------- API ---------------- */
  const API = {
    DEMO,
    isDemo() { return DEMO; },
    // ¿El modo demo está FORZADO (localhost o enlace de preview ?demo=1)? Sirve para
    // mostrar herramientas de demo (p. ej. el selector de etapa) también en un dominio real.
    isDemoForced() { return forceDemo; },

    async signIn(identifier, password) {
      identifier = String(identifier || "").trim();
      if (!identifier || !password) return { ok: false, error: "Escribe tu usuario y tu contraseña." };
      if (DEMO) {
        const u = identifier.toLowerCase();
        const acc = demoLoad().find(a => a.username === u);
        if (!acc || acc.password !== password) return { ok: false, error: "Usuario o contraseña incorrectos." };
        localStorage.setItem(DEMO_SESSION, u);
        return { ok: true, profile: pub(acc) };
      }
      const { error } = await sb.auth.signInWithPassword({ email: toLoginEmail(identifier), password });
      if (error) return { ok: false, error: "Usuario o contraseña incorrectos." };
      // ¿Requiere segundo factor (2FA)? (obligatorio para admin con 2FA activado)
      try {
        const { data: aal } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aal && aal.nextLevel === "aal2" && aal.currentLevel === "aal1") {
          const { data: f } = await sb.auth.mfa.listFactors();
          const factor = ((f && f.totp) || []).find(x => x.status === "verified");
          return { ok: false, mfa: true, factorId: factor ? factor.id : null };
        }
      } catch (e) { /* si el proyecto no soporta MFA, se ignora */ }
      await this._afterLogin();
      return { ok: true, profile: await this.getProfile() };
    },

    // Entrada de un solo toque para ENSEÑAR la app (enlaces de revisión por WhatsApp):
    // en modo demo inicia sesión como una cuenta de ejemplo (p. ej. "lucia") SIN teclear
    // contraseña, así el revisor no puede equivocarse ni pelearse con el autocorrector.
    // Fuera de demo no hace nada (producción sigue exigiendo credenciales reales).
    demoLoginAs(username) {
      if (!DEMO) return { ok: false, error: "Solo disponible en modo demo." };
      const u = String(username || "").trim().toLowerCase();
      const acc = demoLoad().find(a => a.username === u);
      if (!acc) return { ok: false, error: "Cuenta de ejemplo no encontrada." };
      try { localStorage.setItem(DEMO_SESSION, u); } catch (e) {}
      return { ok: true, profile: pub(acc) };
    },

    // Completa el segundo paso (código de la app de autenticación)
    async completeMFA(factorId, code) {
      if (DEMO) return { ok: true, profile: await this.getProfile() };
      code = String(code || "").replace(/\s+/g, "");
      const ch = await sb.auth.mfa.challenge({ factorId });
      if (ch.error) return { ok: false, error: "No se pudo verificar. Inténtalo de nuevo." };
      const v = await sb.auth.mfa.verify({ factorId, challengeId: ch.data.id, code });
      if (v.error) return { ok: false, error: "Código incorrecto o caducado." };
      await this._afterLogin();
      return { ok: true, profile: await this.getProfile() };
    },

    async _afterLogin() {
      try { const { data: { user } } = await sb.auth.getUser();
            if (user) await sb.from("users").update({ last_login_at: new Date().toISOString() }).eq("id", user.id); } catch (e) {}
    },

    /* ------- 2FA (verificación en dos pasos, TOTP) ------- */
    async mfaStatus() {
      if (DEMO || !sb) return { enabled: false, supported: false };
      const { data, error } = await sb.auth.mfa.listFactors();
      if (error) return { enabled: false, supported: true, error: error.message };
      const totp = (data && data.totp) || [];
      const verified = totp.filter(f => f.status === "verified");
      const pending = totp.filter(f => f.status === "unverified");
      return { enabled: verified.length > 0, supported: true, verified, pending };
    },
    async mfaEnrollStart() {
      if (DEMO || !sb) return { ok: false, error: "No disponible en modo demo." };
      // Limpia inscripciones a medias para no acumular factores sin verificar
      try { const s = await this.mfaStatus(); for (const p of (s.pending || [])) await sb.auth.mfa.unenroll({ factorId: p.id }); } catch (e) {}
      const { data, error } = await sb.auth.mfa.enroll({ factorType: "totp", friendlyName: "Interlanguage " + Date.now() });
      if (error) return { ok: false, error: error.message };
      return { ok: true, factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret, uri: data.totp.uri };
    },
    async mfaEnrollConfirm(factorId, code) {
      if (DEMO || !sb) return { ok: false, error: "No disponible en modo demo." };
      code = String(code || "").replace(/\s+/g, "");
      const ch = await sb.auth.mfa.challenge({ factorId });
      if (ch.error) return { ok: false, error: ch.error.message };
      const v = await sb.auth.mfa.verify({ factorId, challengeId: ch.data.id, code });
      if (v.error) return { ok: false, error: "Código incorrecto o caducado. Prueba con el siguiente." };
      return { ok: true };
    },
    async mfaDisable() {
      if (DEMO || !sb) return { ok: false };
      const s = await this.mfaStatus();
      for (const f of [...(s.verified || []), ...(s.pending || [])]) await sb.auth.mfa.unenroll({ factorId: f.id });
      return { ok: true };
    },

    /* ------- Auditoría (solo admin la puede leer) ------- */
    async recentAudit(limit) {
      if (DEMO || !sb) return [];
      const { data, error } = await sb.from("audit_log")
        .select("action, entity, entity_id, created_at")
        .order("created_at", { ascending: false }).limit(limit || 20);
      if (error) return [];
      return data || [];
    },

    async getProfile() {
      if (DEMO) {
        const u = demoSession(); if (!u) return null;
        return pub(demoLoad().find(a => a.username === u));
      }
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return null;

      // Fila base en 'users'
      const { data: urow } = await sb.from("users").select("*").eq("id", user.id).single();
      // Roles del usuario
      const { data: roles } = await sb.from("user_roles").select("role_id").eq("user_id", user.id);
      const roleIds = (roles || []).map(r => r.role_id);
      const is_admin = roleIds.includes("admin");
      const is_teacher = roleIds.includes("teacher");
      const is_student = roleIds.includes("student");

      const profile = {
        id: user.id,
        username: (urow && urow.username) || (user.email || "").split("@")[0],
        display_name: (urow && urow.display_name) || "",
        full_name: (urow && urow.display_name) || "",
        must_change_password: urow ? !!urow.must_change_password : false,
        is_admin, is_teacher, is_student,
        student_id: null, level: "", sex: null
      };

      // Si es alumno, traemos su ficha para el nombre de pila y su id de alumno
      if (is_student || (!is_admin && !is_teacher)) {
        const { data: st } = await sb.from("students").select("id, first_name, birth_year, level_id, course_ref, sex").eq("user_id", user.id).maybeSingle();
        if (st) {
          profile.student_id = st.id;
          profile.first_name = st.first_name || "";
          profile.full_name = st.first_name || profile.full_name;
          profile.birth_year = st.birth_year || null;
          profile.course_ref = st.course_ref || "";
          profile.sex = validSex(st.sex) ? st.sex : null;
          profile.is_student = true;
        }
      }
      return profile;
    },

    async changePassword(newPass) {
      const v = U.validatePassword ? U.validatePassword(newPass)
        : (newPass && newPass.length >= 8 ? { ok: true } : { ok: false, error: "La contraseña debe tener al menos 8 caracteres." });
      if (!v.ok) return { ok: false, error: v.error };
      if (DEMO) {
        const u = demoSession(); if (!u) return { ok: false, error: "Sesión caducada." };
        const db = demoLoad(); const acc = db.find(a => a.username === u);
        if (!acc) return { ok: false, error: "Sesión caducada." };
        acc.password = newPass; acc.must_change_password = false; demoSave(db);
        return { ok: true };
      }
      const { error } = await sb.auth.updateUser({ password: newPass });
      if (error) return { ok: false, error: error.message || "No se pudo cambiar la contraseña." };
      const { data: { user } } = await sb.auth.getUser();
      if (user) await sb.from("users").update({ must_change_password: false }).eq("id", user.id);
      return { ok: true };
    },

    async signOut() {
      if (DEMO) { localStorage.removeItem(DEMO_SESSION); return; }
      await sb.auth.signOut();
    },

    /* ------- ADMIN (gestión de alumnos: se completa en el Bloque 5) ------- */
    async listStudents() {
      if (DEMO) return demoLoad().filter(a => !a.is_admin).map(pub);
      // Une la ficha de alumno con su cuenta para mostrar el código de acceso
      const { data, error } = await sb
        .from("students")
        .select("id, first_name, sex, level_id, created_at, users:users!students_user_id_fkey(username, status), enrollments(status)")
        .order("created_at", { ascending: false });
      if (error) return [];
      return (data || []).map(s => ({
        id: s.id,
        full_name: s.first_name || "",
        username: s.users ? s.users.username : "",
        sex: validSex(s.sex) ? s.sex : null,
        created_at: s.created_at,
        active: !((s.enrollments || []).length) || (s.enrollments || []).some(e => e.status === "active")
      }));
    },

    async createStudent(payload) {
      if (!validSex(payload.sex)) return { ok: false, error: "Selecciona masculino o femenino." };
      if (DEMO) {
        const db = demoLoad();
        let username = String(payload.username || "").trim().toLowerCase().replace(/\s+/g, "");
        if (!payload.full_name) return { ok: false, error: "Falta el nombre del alumno." };
        if (!username) { for (let i = 0; i < 8 && !username; i++) { const candidate = randUsername(); if (!db.find(a => a.username === candidate)) username = candidate; } }
        if (!username || db.find(a => a.username === username)) return { ok: false, error: "No se pudo generar un usuario único." };
        const password = randPass();
        db.push({ username, password, full_name: payload.full_name, level: payload.level || "", stage: payload.stage || "", sex:payload.sex, parent_email: payload.parent_email || "", is_admin: false, must_change_password: true, created_at: new Date().toISOString().slice(0, 10) });
        demoSave(db);
        return { ok: true, username, password };
      }
      // Real: lo hará una Edge Function con service_role (Bloque 5).
      const { data, error } = await sb.functions.invoke("admin-create-student", { body: { action: "create", ...payload } });
      if (error || (data && data.error)) return { ok: false, error: (data && data.error) || (error && error.message) || "No se pudo crear la cuenta." };
      return { ok: true, username: data.username, password: data.password };
    },

    async resetPassword(username) {
      if (DEMO) {
        const db = demoLoad(); const acc = db.find(a => a.username === username);
        if (!acc) return { ok: false, error: "No existe ese alumno." };
        const password = randPass(); acc.password = password; acc.must_change_password = true; demoSave(db);
        return { ok: true, username, password };
      }
      const { data, error } = await sb.functions.invoke("admin-create-student", { body: { action: "reset", username } });
      if (error || (data && data.error)) return { ok: false, error: (data && data.error) || "No se pudo restablecer." };
      return { ok: true, username, password: data.password };
    },

    /* Auditoría best-effort desde el cliente (requiere migración 0003; si no, se ignora) */
    async _audit(action, entity, entity_id) {
      if (DEMO || !sb) return;
      try { const { data: { user } } = await sb.auth.getUser();
            await sb.from("audit_log").insert({ actor_user_id: user && user.id, action, entity, entity_id }); } catch (e) {}
    },

    // Editar el nombre de un alumno
    async updateStudentName(studentId, name) {
      name = String(name || "").trim();
      if (!name) return { ok: false, error: "El nombre no puede estar vacío." };
      if (DEMO) return { ok: true };
      const { error } = await sb.from("students").update({ first_name: name }).eq("id", studentId);
      if (error) return { ok: false, error: error.message };
      await this._audit("student.update", "students", studentId);
      return { ok: true };
    },

    async updateStudentProfile(studentId, payload) {
      const name = String(payload && payload.full_name || "").trim();
      const sex = payload && payload.sex;
      if (!name) return { ok: false, error: "El nombre no puede estar vacío." };
      if (!validSex(sex)) return { ok: false, error: "Selecciona masculino o femenino." };
      if (DEMO) {
        const db = demoLoad(); const account = db.find(item => item.username === studentId);
        if (!account) return { ok: false, error: "No existe ese alumno." };
        account.full_name = name; account.sex = sex; demoSave(db); return { ok: true };
      }
      const { data, error } = await sb.functions.invoke("admin-create-student", { body:{ action:"update", student_id:studentId, first_name:name, sex } });
      if (error || (data && data.error)) return { ok:false, error:(data && data.error) || (error && error.message) || "No se pudo actualizar el alumno." };
      return { ok:true };
    },

    // Activar / desactivar el acceso del alumno (matrícula)
    async setStudentAccess(studentId, active) {
      if (DEMO) return { ok: true };
      const status = active ? "active" : "paused";
      const { data: rows } = await sb.from("enrollments").select("id").eq("student_id", studentId);
      let error;
      if (rows && rows.length) ({ error } = await sb.from("enrollments").update({ status }).eq("student_id", studentId));
      else ({ error } = await sb.from("enrollments").insert({ student_id: studentId, plan_id: "premium_home", status, starts_on: new Date().toISOString().slice(0, 10) }));
      if (error) return { ok: false, error: error.message };
      await this._audit(active ? "access.enable" : "access.disable", "students", studentId);
      return { ok: true };
    },

    /* ------- GRUPOS ------- */
    async listGroups() {
      if (DEMO || !sb) return [];
      const { data } = await sb.from("groups").select("id, name, status, group_members(student_id)").order("name");
      return (data || []).map(g => ({ id: g.id, name: g.name, status: g.status, count: (g.group_members || []).length }));
    },
    async createGroup(name) {
      name = String(name || "").trim();
      if (!name) return { ok: false, error: "Ponle un nombre al grupo." };
      if (DEMO) return { ok: true };
      const { data, error } = await sb.from("groups").insert({ name }).select("id").single();
      if (error) return { ok: false, error: error.message };
      await this._audit("group.create", "groups", data.id);
      return { ok: true, id: data.id };
    },
    async addStudentToGroup(groupId, studentId) {
      if (DEMO) return { ok: true };
      const { error } = await sb.from("group_members").insert({ group_id: groupId, student_id: studentId });
      if (error) return { ok: false, error: /duplicate|unique/i.test(error.message) ? "Ese alumno ya está en el grupo." : error.message };
      await this._audit("group.add_member", "groups", groupId);
      return { ok: true };
    }
  };

  /* ---------------- PROGRESO (racha, gemas, XP, tienda) ----------------
     Bridge hacia el modelo real (student_state + streaks). La lógica
     pedagógica completa llega en los Bloques 10–12. */
  const today = () => new Date().toISOString().slice(0, 10);
  const dayAdd = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const PKEY = (u) => "il_progress_" + u;
  // Registro de días con práctica (para el objetivo semanal, coherente con "completada hoy")
  const DKEY = (u) => "il_days_" + u;
  function loadDays(u) { try { return JSON.parse(localStorage.getItem(DKEY(u))) || []; } catch (e) { return []; } }
  function saveDays(u, arr) { try { localStorage.setItem(DKEY(u), JSON.stringify(arr)); } catch (e) {} }
  function markDay(u, d) { const a = loadDays(u); if (a.indexOf(d) === -1) { a.push(d); saveDays(u, a); } }
  // Solo DEMO: si una cuenta de muestra tiene racha pero aún no hay registro de días,
  // rellena un historial coherente con esa racha (datos de muestra en cuenta de muestra,
  // para que el panel de progreso se pueda enseñar). Nunca toca cuentas reales.
  function ensureDemoDays(username, p) {
    if (!p || !p.streak || loadDays(username).length) return;
    const set = {};
    // La racha actual: N días consecutivos que terminan en el último día de práctica.
    const endOffset = (p.last === today()) ? 0 : -1;
    for (let i = 0; i < p.streak; i++) set[dayAdd(endOffset - i)] = 1;
    // Actividad anterior dispersa (para que el mapa mensual respire), determinista.
    [15, 16, 18, 21, 22, 25, 28, 30, 33, 36, 40, 43].forEach(function (n) {
      if (n > (p.best || p.streak) + 20) return;
      set[dayAdd(-n)] = 1;
    });
    saveDays(username, Object.keys(set).sort());
  }
  // Solo DEMO: medallas coherentes con las cifras de muestra (las que el umbral justifica).
  // No otorga medallas de aciertos/sesión perfecta: dependen de la precisión real de una sesión.
  function ensureDemoMedals(username, p) {
    if (!p) return;
    const mkey = "il_medals_" + username;
    try { if ((JSON.parse(localStorage.getItem(mkey)) || []).length) return; } catch (e) { return; }
    const earned = [];
    const streak = p.streak || 0, best = p.best || 0, lessons = p.lessons || 0;
    if (streak >= 2) earned.push("streak_2");
    if (streak >= 5) earned.push("streak_5");
    if (streak >= 10) earned.push("streak_10");
    if (streak >= 30) earned.push("streak_30");
    if (best >= 2) earned.push("record_racha");
    if (lessons >= 1) earned.push("primera");
    if (lessons >= 10) earned.push("diez_lecciones");
    if (earned.length) { try { localStorage.setItem(mkey, JSON.stringify(earned)); } catch (e) {} }
  }
  function seedProgress(username) {
    if (username === "lucia")
      return { gems: 240, streak: 12, best: 18, xp: 1240, lessons: 24, last: dayAdd(-1), owned: [], hat: "", acc: "" };
    return { gems: 0, streak: 0, best: 0, xp: 0, lessons: 0, last: "", owned: [], hat: "", acc: "" };
  }
  function blankProgress() { return { gems: 0, streak: 0, best: 0, xp: 0, lessons: 0, last: "", owned: [], hat: "", acc: "" }; }

  API.getProgress = async function () {
    const prof = await this.getProfile();
    if (!prof) return null;
    if (DEMO) {
      let p;
      try { p = JSON.parse(localStorage.getItem(PKEY(prof.username))); } catch (e) {}
      if (!p) { p = seedProgress(prof.username); localStorage.setItem(PKEY(prof.username), JSON.stringify(p)); }
      ensureDemoDays(prof.username, p);
      ensureDemoMedals(prof.username, p);
      p.id = prof.id; p.username = prof.username; p.full_name = prof.full_name; p.level = prof.level;
      return p;
    }
    // Real: solo tiene sentido para alumnos
    if (!prof.student_id) { const p = blankProgress(); p.id = prof.id; p.username = prof.username; p.full_name = prof.full_name; return p; }
    const sid = prof.student_id;
    const [{ data: state }, { data: streak }] = await Promise.all([
      sb.from("student_state").select("*").eq("student_id", sid).maybeSingle(),
      sb.from("streaks").select("*").eq("student_id", sid).maybeSingle()
    ]);
    const p = blankProgress();
    if (state) { p.gems = state.gems; p.xp = state.xp; p.lessons = state.lessons; p.owned = Array.isArray(state.owned) ? state.owned : []; p.hat = state.hat || ""; p.acc = state.acc || ""; }
    if (streak) { p.streak = streak.current; p.best = streak.longest; p.last = streak.last_practice_date || ""; p.freezes = streak.freezes_available; }
    if (p.freezes == null) p.freezes = 1;
    p.id = prof.id; p.student_id = sid; p.username = prof.username; p.full_name = prof.full_name; p.level = prof.level;
    return p;
  };

  API._save = async function (p) {
    if (DEMO) { localStorage.setItem(PKEY(p.username), JSON.stringify(p)); return; }
    if (!p.student_id) return;
    await Promise.all([
      sb.from("student_state").upsert({ student_id: p.student_id, gems: p.gems, xp: p.xp, lessons: p.lessons, owned: p.owned, hat: p.hat, acc: p.acc }),
      sb.from("streaks").upsert({ student_id: p.student_id, current: p.streak, longest: p.best, last_practice_date: p.last || null, freezes_available: (p.freezes == null ? 1 : p.freezes) })
    ]);
  };

  // Medallas ganadas (ids). Best-effort.
  API._earnedMedals = async function (p) {
    if (DEMO) { try { return JSON.parse(localStorage.getItem("il_medals_" + p.username)) || []; } catch (e) { return []; } }
    if (!p.student_id) return [];
    const { data } = await sb.from("student_rewards").select("reward_id").eq("student_id", p.student_id);
    return (data || []).map(r => r.reward_id);
  };
  API._awardMedals = async function (p, ids) {
    if (!ids || !ids.length) return;
    if (DEMO) { const cur = await this._earnedMedals(p); localStorage.setItem("il_medals_" + p.username, JSON.stringify(cur.concat(ids))); return; }
    if (!p.student_id) return;
    // Best-effort: si el catálogo rewards aún no está sembrado (migración 0004), se ignora sin romper.
    try { await sb.from("student_rewards").insert(ids.map(id => ({ student_id: p.student_id, reward_id: id }))); } catch (e) {}
  };
  // Lista de medallas ganadas con su info de catálogo (para el perfil)
  API.listMedals = async function () {
    const Mot = (typeof window !== "undefined" && window.IL_MOTIVACION) || null;
    const p = await this.getProgress(); if (!p || !Mot) return [];
    const earned = new Set(await this._earnedMedals(p));
    return Mot.MEDALS.map(m => ({ ...m, earned: earned.has(m.id) }));
  };

  API.completeLesson = async function (summary) {
    summary = summary || { correct: 0, total: 0, allCorrect: false, maxCorrectStreak: 0 };
    const Mot = (typeof window !== "undefined" && window.IL_MOTIVACION) || null;
    const p = await this.getProgress(); if (!p) return null;
    const t = today();
    const prevBest = p.best || 0;

    // Racha FLEXIBLE (con comodín) si el módulo está cargado
    if (Mot) {
      const ns = Mot.nextStreak({ current: p.streak, last_practice_date: p.last, freezes_available: p.freezes }, t);
      p.streak = ns.current; p.freezes = ns.freezes_available;
    } else {
      if (p.last === t) { } else if (p.last === dayAdd(-1)) { p.streak += 1; } else { p.streak = 1; }
    }
    p.last = t; p.gems += 20; p.xp += 50; p.lessons += 1;
    p.best = Math.max(prevBest, p.streak);
    await this._save(p);
    markDay(p.username, t);   // cuenta para el objetivo semanal

    // Medallas recién ganadas
    let newMedals = [];
    if (Mot) {
      const earned = await this._earnedMedals(p);
      newMedals = Mot.evaluate({ streak: p.streak, prevBest: prevBest, lessons: p.lessons, session: summary, earned: earned });
      if (newMedals.length) await this._awardMedals(p, newMedals);
    }
    p.newMedals = newMedals.map(id => (Mot ? Mot.byId[id] : { id, name: id, icon: "🏅" }));
    return p;
  };

  API.buyItem = async function (id, price) {
    const p = await this.getProgress(); if (!p) return { ok: false, gems: 0 };
    if (p.owned.includes(id)) return { ok: true, gems: p.gems, owned: p.owned };
    if (p.gems < price) return { ok: false, gems: p.gems, short: price - p.gems };
    p.gems -= price; p.owned.push(id); await this._save(p);
    return { ok: true, gems: p.gems, owned: p.owned };
  };

  API.equipItem = async function (slot, ico) {
    const p = await this.getProgress(); if (!p) return;
    if (slot === "hat") p.hat = ico; if (slot === "acc") p.acc = ico;
    await this._save(p);
  };

  /* ---------------- CONTENIDO DE LA BD + VALIDACIÓN EN SERVIDOR (B6/B10) ----------------
     Para actividades que viven en la base de datos: el alumno recibe la actividad
     SIN la solución (la RLS oculta answer_keys) y valida en el servidor con submit_attempt. */

  // Actividades publicadas de un objetivo (sin answer_keys) + sus opciones
  API.getPublishedActivities = async function (objectiveId) {
    if (DEMO || !sb) return [];
    let q = sb.from("activities")
      .select("id, template, instruction, explanation, objective_id, options(id, label, media_id, \"order\")")
      .eq("status", "published");
    if (objectiveId) q = q.eq("objective_id", objectiveId);
    const { data, error } = await q;
    if (error) return [];
    return data || [];
  };

  // Crea la sesión de práctica del día (para agrupar los intentos)
  API.startPracticeSession = async function () {
    if (DEMO || !sb) return null;
    const prof = await this.getProfile();
    if (!prof || !prof.student_id) return null;
    const { data } = await sb.from("practice_sessions").insert({ student_id: prof.student_id }).select("id").single();
    return data ? data.id : null;
  };

  // Envía una respuesta de selección: valida EN SERVIDOR y registra el intento
  API.submitAttempt = async function (activityId, optionId, meta) {
    if (DEMO || !sb) return { correct: false };
    meta = meta || {};
    const { data, error } = await sb.rpc("submit_attempt", {
      p_activity: activityId, p_option: optionId,
      p_attempt_no: meta.attempt_no || 1, p_hint: !!meta.hint,
      p_duration: meta.duration || null, p_session: meta.session || null
    });
    if (error) return { correct: false, error: error.message };
    return data || { correct: false };
  };

  // "Lo que ya sé decir": objetivos DOMINADOS del alumno (can-do)
  API.getMasteredPhrases = async function () {
    if (DEMO || !sb) return [];
    const prof = await this.getProfile();
    if (!prof || !prof.student_id) return [];
    const { data } = await sb.from("mastery")
      .select("mastery_state, objectives(can_do)")
      .eq("student_id", prof.student_id).eq("mastery_state", "mastered");
    return (data || []).map(m => m.objectives && m.objectives.can_do).filter(Boolean);
  };

  // Días con práctica dentro de una ventana (por defecto, últimos ~112 días para el mapa mensual).
  // Fuente coherente con el objetivo semanal: registro local (+ último día) y, en real, sesiones de BD.
  // Devuelve un array ordenado de fechas "YYYY-MM-DD". Nunca inventa en cuentas reales.
  API.getActivityDays = async function (daysBack) {
    daysBack = daysBack || 112;
    const prof = await this.getProfile();
    if (!prof) return [];
    const cutoff = dayAdd(-daysBack);
    const set = new Set();
    loadDays(prof.username).forEach(d => { if (d >= cutoff) set.add(d); });
    try { const pr = await this.getProgress(); if (pr && pr.last && pr.last >= cutoff) set.add(pr.last); } catch (e) {}
    if (!DEMO && sb && prof.student_id) {
      try {
        const { data } = await sb.from("practice_sessions")
          .select("created_at").eq("student_id", prof.student_id).gte("created_at", cutoff + "T00:00:00Z");
        (data || []).forEach(s => set.add(new Date(s.created_at).toISOString().slice(0, 10)));
      } catch (e) {}
    }
    return [...set].sort();
  };

  // Equilibrio por habilidad. Producción: agrupa objetivos dominados por skill (real).
  // Demo: valores de muestra coherentes con la actividad (cuenta de muestra). Sin datos → hasData:false.
  const SKILL_DEFS = [
    { key: "vocabulary", label: "Vocabulario", icon: "books" },
    { key: "grammar", label: "Gramática", icon: "grammar" },
    { key: "listening", label: "Listening", icon: "ear" },
    { key: "reading", label: "Reading", icon: "book" }
  ];
  API.getSkillBreakdown = async function () {
    const prof = await this.getProfile();
    if (!prof) return { hasData: false, skills: SKILL_DEFS.map(s => ({ ...s, pct: 0 })) };
    if (DEMO) {
      const pr = await this.getProgress();
      const n = pr ? (pr.lessons || 0) : 0;
      if (!n) return { hasData: false, skills: SKILL_DEFS.map(s => ({ ...s, pct: 0 })) };
      // Perfil de muestra determinista; sube suavemente con las misiones hechas.
      const base = { vocabulary: 46, grammar: 34, listening: 22, reading: 40 };
      const skills = SKILL_DEFS.map(s => ({ ...s, pct: Math.max(6, Math.min(94, Math.round(base[s.key] + n * 1.1))) }));
      return { hasData: true, skills: skills };
    }
    if (!sb || !prof.student_id) return { hasData: false, skills: SKILL_DEFS.map(s => ({ ...s, pct: 0 })) };
    try {
      const { data } = await sb.from("mastery")
        .select("mastery_state, objectives(skill)")
        .eq("student_id", prof.student_id);
      if (!data || !data.length) return { hasData: false, skills: SKILL_DEFS.map(s => ({ ...s, pct: 0 })) };
      const tot = {}, mas = {};
      data.forEach(r => {
        const sk = (r.objectives && r.objectives.skill || "").toLowerCase();
        if (!sk) return;
        tot[sk] = (tot[sk] || 0) + 1;
        if (r.mastery_state === "mastered") mas[sk] = (mas[sk] || 0) + 1;
      });
      const skills = SKILL_DEFS.map(s => ({ ...s, pct: tot[s.key] ? Math.round(100 * (mas[s.key] || 0) / tot[s.key]) : 0 }));
      return { hasData: skills.some(s => s.pct > 0), skills: skills };
    } catch (e) {
      return { hasData: false, skills: SKILL_DEFS.map(s => ({ ...s, pct: 0 })) };
    }
  };

  // Objetivo semanal: días de ESTA semana (lunes→domingo) con práctica real.
  // Nunca inventa: en demo o sin alumno, devuelve la semana vacía.
  API.getWeekActivity = async function () {
    const GOAL = 5;
    const now = new Date();
    const dow = (now.getDay() + 6) % 7;               // 0 = lunes
    const monday = new Date(now); monday.setHours(0, 0, 0, 0); monday.setDate(now.getDate() - dow);
    const iso = (d) => d.toISOString().slice(0, 10);
    const mondayIso = iso(monday);
    const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
    const sundayIso = iso(sunday);
    const prof = await this.getProfile();
    if (!prof) return { goal: GOAL, monday: mondayIso, practiced: [], count: 0 };
    // Días con práctica esta semana. Fuente coherente con "completada hoy":
    // registro local + el último día de práctica; en real, además las sesiones de BD.
    const idx = new Set();
    const addYmd = (d) => { if (d && d >= mondayIso && d <= sundayIso) idx.add((new Date(d + "T00:00:00Z").getUTCDay() + 6) % 7); };
    loadDays(prof.username).forEach(addYmd);
    try { const pr = await this.getProgress(); if (pr && pr.last) addYmd(pr.last); } catch (e) {}
    if (!DEMO && sb && prof.student_id) {
      try {
        const { data } = await sb.from("practice_sessions")
          .select("created_at").eq("student_id", prof.student_id).gte("created_at", monday.toISOString());
        (data || []).forEach(s => addYmd(iso(new Date(s.created_at))));
      } catch (e) {}
    }
    const practiced = [...idx].sort((a, b) => a - b);
    return { goal: GOAL, monday: mondayIso, practiced: practiced, count: practiced.length };
  };

  /* ---------------- NIVEL DE INGLÉS (test de colocación) ----------------
     Escalera CEFR que usa el contenido del MVP. El test del primer acceso
     fija el punto de partida; la sesión se compone alrededor de ese nivel. */
  const CEFR_ORDER = ["Pre-A1", "A1", "A2", "B1"];
  function levelLabel(cefr) {
    return ({ "Pre-A1": "Principiante", "A1": "Explorer · A1", "A2": "Explorer · A2", "B1": "Adventurer · B1" })[cefr] || cefr;
  }
  const LKEY = (u) => "il_level_" + u;
  API.CEFR_ORDER = CEFR_ORDER;
  API.levelLabel = levelLabel;

  // Devuelve el nivel colocado del alumno (o null si aún no ha hecho el test)
  API.getPlacement = async function () {
    const prof = await this.getProfile();
    if (!prof) return { cefr: null, placed: false, label: "" };
    let cefr = null;
    try { cefr = localStorage.getItem(LKEY(prof.username)); } catch (e) {}
    if (!cefr && CEFR_ORDER.indexOf((prof.cefr || "")) !== -1) cefr = prof.cefr;
    return { cefr: cefr, placed: !!cefr, label: cefr ? levelLabel(cefr) : "" };
  };

  // Guarda el resultado del test. Fuente de verdad local para componer la sesión hoy;
  // la persistencia definitiva en BD (students.level_id) es una pequeña migración pendiente.
  API.savePlacement = async function (cefr) {
    if (CEFR_ORDER.indexOf(cefr) === -1) return { ok: false };
    const prof = await this.getProfile();
    if (!prof) return { ok: false };
    try { localStorage.setItem(LKEY(prof.username), cefr); } catch (e) {}
    if (DEMO) { const db = demoLoad(); const acc = db.find(a => a.username === prof.username); if (acc) { acc.level = levelLabel(cefr); demoSave(db); } }
    return { ok: true, cefr: cefr, label: levelLabel(cefr) };
  };

  // Resumen para el INFORME de la familia (solo lectura, sin notas ni comparaciones)
  API.getReport = async function () {
    const prof = await this.getProfile();
    if (!prof) return null;
    const pr = await this.getProgress();
    const medals = (typeof window !== "undefined" && window.IL_MOTIVACION) ? await this.listMedals() : [];
    let days = pr ? (pr.lessons || 0) : 0;
    if (!DEMO && sb && prof.student_id) {
      try {
        const { count } = await sb.from("practice_sessions").select("id", { count: "exact", head: true }).eq("student_id", prof.student_id);
        if (count != null) days = count;
      } catch (e) {}
    }
    return {
      first_name: prof.first_name || (prof.full_name || "").split(" ")[0] || "Alumno",
      level: prof.level || "",
      lessons: pr ? (pr.lessons || 0) : 0,
      streak: pr ? (pr.streak || 0) : 0,
      best: pr ? (pr.best || 0) : 0,
      days: days,
      medals: (medals || []).filter(m => m.earned)
    };
  };

  // Cierra la sesión con su resumen
  API.finishPracticeSession = async function (sessionId, correct, total) {
    if (DEMO || !sb || !sessionId) return;
    await sb.from("practice_sessions").update({
      completed: true, correct_count: correct, total_count: total, finished_at: new Date().toISOString()
    }).eq("id", sessionId);
  };

  window.ILAuth = API;
})();
