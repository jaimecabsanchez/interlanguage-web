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
  let localHost = false;
  try {
    const host = location.hostname || "";
    const isLocal = host === "localhost" || host === "127.0.0.1" || host === "" || host.endsWith(".local");
    localHost = isLocal;
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
  const DEMO = forceDemo || (noKeys && localHost);

  let sb = null;
  if (!DEMO && !noKeys && window.supabase && window.supabase.createClient) {
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
  const LearningData = window.ILLearningData || null;
  const Obs = window.ILObservability || { report(kind, error, context) {
    if (window.console && console.error) console.error("[Interlanguage]", kind, context || {}, error || "");
  } };
  const OUTBOX_KEY = "il_learning_outbox_v1";
  const EVENT_PREFIX = "il_learning_events_v1_";
  function observe(kind, error, context) { return Obs.report(kind, error, context); }
  function readJson(key, fallback) { try { const value = JSON.parse(localStorage.getItem(key)); return value == null ? fallback : value; } catch (error) { return fallback; } }
  function writeJson(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (error) { observe("data_unavailable", error, { area:"storage", operation:"write" }); return false; } }
  function appendBounded(key, value, limit) { const rows = readJson(key, []); rows.push(value); writeJson(key, rows.slice(-(limit || 500))); }
  function queueLearning(kind, payload) {
    const queued=readJson(OUTBOX_KEY,[]);
    queued.push({kind,payload,queued_at:new Date().toISOString()});
    if(!writeJson(OUTBOX_KEY,queued))throw new Error('learning_queue_storage_unavailable');
  }
  function eventKey(username) { return EVENT_PREFIX + encodeURIComponent(String(username || "guest").toLowerCase()); }
  function eventUuid() { return window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : null; }

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
      if (!sb) return {ok:false,error:"No se ha podido cargar el acceso seguro. Revisa la conexión y recarga la página."};
      const { error } = await sb.auth.signInWithPassword({ email: toLoginEmail(identifier), password });
      if (error) return { ok: false, error: error.name === "AuthRetryableFetchError" || error.status === 0 ? "No hemos podido conectar. Revisa tu conexión y vuelve a intentarlo." : "Usuario o contraseña incorrectos." };
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
      try { await this.flushLearningOutbox(); } catch (error) { observe("network_failure", error, { area:"learning", operation:"flush_after_login" }); }
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
      if (!sb) throw new Error("secure_auth_unavailable");
      const { data: { user }, error: userError } = await sb.auth.getUser();
      if (userError && userError.name !== "AuthSessionMissingError") throw userError;
      if (!user) return null;

      // Fila base en 'users'
      const { data: urow, error: profileError } = await sb.from("users").select("*").eq("id", user.id).single();
      if (profileError) throw profileError;
      // Roles del usuario
      const { data: roles, error: rolesError } = await sb.from("user_roles").select("role_id").eq("user_id", user.id);
      if (rolesError) throw rolesError;
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
        const { data: st, error: studentError } = await sb.from("students").select("id, first_name, birth_year, level_id, course_ref, sex").eq("user_id", user.id).maybeSingle();
        if (studentError) throw studentError;
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
    const [{ data: state, error: stateError }, { data: streak, error: streakError }] = await Promise.all([
      sb.from("student_state").select("*").eq("student_id", sid).maybeSingle(),
      sb.from("streaks").select("*").eq("student_id", sid).maybeSingle()
    ]);
    if (stateError || streakError) throw stateError || streakError;
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
    const responses = await Promise.all([
      sb.from("student_state").upsert({ student_id: p.student_id, gems: p.gems, xp: p.xp, lessons: p.lessons, owned: p.owned, hat: p.hat, acc: p.acc }),
      sb.from("streaks").upsert({ student_id: p.student_id, current: p.streak, longest: p.best, last_practice_date: p.last || null, freezes_available: (p.freezes == null ? 1 : p.freezes) })
    ]);
    const failure = responses.find(response => response && response.error);
    if (failure) throw failure.error;
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
    const stored = await this._earnedMedals(p);
    const earned = new Set(Mot.canonicalEarned ? Mot.canonicalEarned(stored) : stored);
    return Mot.MEDALS.map(m => ({ ...m, earned: earned.has(m.id) }));
  };

  API.completeLesson = async function (summary) {
    summary = summary || { correct: 0, total: 0, allCorrect: false, maxCorrectStreak: 0 };
    const Mot = (typeof window !== "undefined" && window.IL_MOTIVACION) || null;
    const p = await this.getProgress(); if (!p) return null;
    const t = today();
    if (p.last === t) return p; // Skip a daily completion already persisted; concurrent writes still need a server transaction.
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
      const persistentIds = Mot.toLegacyIds ? Mot.toLegacyIds(newMedals) : newMedals;
      if (persistentIds.length) await this._awardMedals(p, persistentIds);
    }
    p.newMedals = newMedals.map(id => (Mot ? Mot.byId[id] : { id, name: id, visual: "stamp" }));
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
  API.startPracticeSession = async function (meta) {
    meta = meta || {};
    if (DEMO || !sb) return { id:null, client_session_key:meta.client_session_key || null, source:"demo" };
    const prof = await this.getProfile();
    if (!prof || !prof.student_id) return null;
    const row = {
      student_id:prof.student_id, client_session_key:meta.client_session_key || null,
      mode:meta.mode || "daily", age_band:meta.age_band || null, cefr:meta.cefr || null,
      content_version:meta.content_version || "1", activities_planned:meta.activities_planned || null
    };
    const { data, error } = await sb.from("practice_sessions").upsert(row, { onConflict:"student_id,client_session_key", ignoreDuplicates:false }).select("id,client_session_key").single();
    if (error) { observe("network_failure", error, { area:"learning", operation:"start_session", table:"practice_sessions" }); queueLearning("session_start", row); return { id:null, client_session_key:row.client_session_key, queued:true, source:"cache" }; }
    return { id:data && data.id || null, client_session_key:row.client_session_key, source:"server" };
  };

  // Guarda cada intento inmutable. La cola local es caché/outbox, nunca una reward.
  API.recordLearningEvent = async function (event) {
    if (!event || !event.attempt_id) return { ok:false, error:"invalid_event" };
    const prof = await this.getProfile();
    if (!prof) return { ok:false, error:"no_profile" };
    appendBounded(eventKey(prof.username), event, 1000);
    if (DEMO || !sb || !prof.student_id) return { ok:true, source:"demo" };
    const row = {
      id:event.attempt_id, student_id:prof.student_id, practice_session_id:event.session_id || null,
      exercise_key:event.exercise_id || null, objective_key:event.objective_id || null, variant_key:event.variant_id || null,
      client_session_key:event.client_session_key || null, age_band:event.age_band || null, cefr:event.cefr || null,
      skill:event.skill || null, content_version:event.content_version || null,
      result:event.technical_failure || event.assessment === 'self_report' ? "skipped" : (event.correct ? "correct" : "incorrect"),
      attempt_no:event.attempt_number || 0, hint_used:!!event.hint_used, response:event.answer == null ? null : { value:event.answer, assessment:event.assessment || 'objective' },
      duration_ms:event.response_time_ms || null, audio_replays:event.audio_replays || 0,
      started_at:event.started_at || null, submitted_at:event.submitted_at || new Date().toISOString(),
      mode:event.mode || "daily", technical_failure:!!event.technical_failure, failure_type:event.failure_type || null
    };
    const { error } = await sb.from("attempts").upsert(row, { onConflict:"id", ignoreDuplicates:true });
    if (error) { observe("network_failure", error, { area:"learning", operation:"record_attempt", table:"attempts", exercise_id:event.exercise_id }); queueLearning("attempt", row); return { ok:false, queued:true, source:"cache" }; }
    return { ok:true, source:"server" };
  };

  API.getCachedLearningEvents = async function () {
    const prof = await this.getProfile(); return prof ? readJson(eventKey(prof.username), []) : [];
  };

  API.saveExerciseMastery = async function (payload) {
    if (!payload || !payload.exercise_key) return { ok:false };
    if (DEMO || !sb) return { ok:true, source:"demo" };
    const prof = await this.getProfile(); if (!prof || !prof.student_id) return { ok:false };
    const card = payload.card || {};
    const row = { student_id:prof.student_id, exercise_key:payload.exercise_key, objective_key:payload.objective_key || null,
      skill:payload.skill || null, mastery_state:card.state || "practicing", evidence_score:Number(card.evidence) || 0,
      attempt_count:Number(card.attempt_count || card.attempts) || 1, first_result:card.first_result || null,
      last_result:card.last_result || null, next_review_at:card.next_review_at || null, updated_at:new Date().toISOString() };
    const { error } = await sb.from("exercise_mastery").upsert(row, { onConflict:"student_id,exercise_key" });
    if (error) { observe("network_failure", error, { area:"learning", operation:"save_mastery", table:"exercise_mastery", exercise_id:payload.exercise_key }); queueLearning("mastery", row); return { ok:false, queued:true }; }
    return { ok:true, source:"server" };
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
    const { data, error } = await sb.from("mastery")
      .select("mastery_state, objectives(can_do)")
      .eq("student_id", prof.student_id).eq("mastery_state", "mastered");
    if (error) { observe("data_unavailable", error, { area:"progress", operation:"mastered_phrases", table:"mastery" }); return []; }
    return (data || []).map(m => m.objectives && m.objectives.can_do).filter(Boolean);
  };

  // Métricas reales: solo evidencia evaluable; porcentajes con muestra mínima.
  API.getLearningMetrics = async function () {
    if (DEMO) return { status:"demo", source:"demo", sufficient:true };
    const prof = await this.getProfile();
    if (!sb || !prof || !prof.student_id) return { status:"empty", source:"server", sufficient:false, sample:0 };
    const from = dayAdd(-13);
    const [{ data:attempts, error:attemptError }, { data:sessions, error:sessionError }] = await Promise.all([
      sb.from("attempts").select("exercise_key,client_session_key,attempt_no,result,hint_used,technical_failure,duration_ms,skill,submitted_at").eq("student_id", prof.student_id).gte("submitted_at", from + "T00:00:00Z").order("submitted_at", { ascending:true }),
      sb.from("practice_sessions").select("date,started_at,finished_at,completed").eq("student_id", prof.student_id).eq("completed", true).gte("date", from)
    ]);
    if (attemptError || sessionError) {
      observe("data_unavailable", attemptError || sessionError, { area:"progress", operation:"learning_metrics", table:attemptError ? "attempts" : "practice_sessions" });
      return { status:"error", source:"server", sufficient:false, sample:0, period:{ days:14, from } };
    }
    const monday=new Date();monday.setDate(monday.getDate()-((monday.getDay()+6)%7));
    const weekFrom=[monday.getFullYear(),String(monday.getMonth()+1).padStart(2,'0'),String(monday.getDate()).padStart(2,'0')].join('-');
    return LearningData.projectMetrics(attempts,sessions,{from,weekFrom,to:today()});
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
    if (DEMO) {
      loadDays(prof.username).forEach(d => { if (d >= cutoff) set.add(d); });
      try { const pr = await this.getProgress(); if (pr && pr.last && pr.last >= cutoff) set.add(pr.last); }
      catch (e) { observe("data_unavailable", e, { area:"progress", operation:"demo_activity_cache" }); }
    }
    if (!DEMO && sb && prof.student_id) {
      if (LearningData) {
        const result = await LearningData.activityDays(sb, prof.student_id, cutoff);
        if (result.status === "error") observe("data_unavailable", result.error, { area:"progress", operation:"activity_days", table:result.source });
        else (result.days || []).forEach(day => set.add(day));
      } else observe("invalid_data", "ILLearningData no cargado", { area:"progress", operation:"activity_days" });
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
      return { hasData: true, status:"available", source:"demo", period:{ label:"Datos de demostración" }, sample:n, skills: skills.map(skill => Object.assign({}, skill, { sample:n, sufficient:true })) };
    }
    if (!sb || !prof.student_id) return { hasData: false, skills: SKILL_DEFS.map(s => ({ ...s, pct: 0 })) };
    if (!LearningData) return { hasData:false, status:"error", source:"none", skills:SKILL_DEFS.map(s => ({ ...s, pct:null, sample:0, sufficient:false })) };
    const result = await LearningData.skillBreakdown(sb, prof.student_id);
    if (result.status === "error") { observe("data_unavailable", result.error, { area:"progress", operation:"skill_breakdown", table:result.source }); return { hasData:false, status:"error", source:result.source, skills:SKILL_DEFS.map(s => ({ ...s, pct:null, sample:0, sufficient:false })) }; }
    const byKey = {}; (result.skills || []).forEach(item => { byKey[item.key] = item; });
    const skills = SKILL_DEFS.map(def => Object.assign({}, def, byKey[def.key] || { pct:null, sample:0, sufficient:false }));
    return { hasData:skills.some(item => item.pct != null), status:result.status, source:result.source, sample:result.sample || 0, skills };
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
    if (DEMO) {
      loadDays(prof.username).forEach(addYmd);
      try { const pr = await this.getProgress(); if (pr && pr.last) addYmd(pr.last); }
      catch (e) { observe("data_unavailable", e, { area:"progress", operation:"demo_week_cache" }); }
    }
    if (!DEMO && sb && prof.student_id) {
      if (LearningData) {
        const result = await LearningData.activityDays(sb, prof.student_id, mondayIso);
        if (result.status === "error") observe("data_unavailable", result.error, { area:"progress", operation:"week_activity", table:result.source });
        else (result.days || []).forEach(addYmd);
      } else observe("invalid_data", "ILLearningData no cargado", { area:"progress", operation:"week_activity" });
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
  const PMETAKEY = (u) => "il_placement_meta_" + u;
  API.CEFR_ORDER = CEFR_ORDER;
  API.levelLabel = levelLabel;

  // Devuelve el nivel colocado del alumno (o null si aún no ha hecho el test)
  API.getPlacement = async function () {
    const prof = await this.getProfile();
    if (!prof) return { cefr: null, placed: false, label: "" };
    let cefr = null;
    let cachedMeta = {};
    try { cefr = localStorage.getItem(LKEY(prof.username)); } catch (e) { observe("data_unavailable", e, { area:"placement", operation:"read_cache" }); }
    try { cachedMeta = JSON.parse(localStorage.getItem(PMETAKEY(prof.username)) || "{}"); } catch (e) { observe("invalid_data", e, { area:"placement", operation:"read_meta_cache" }); }
    if (DEMO || !sb || !prof.student_id) {
      if (!cefr && CEFR_ORDER.indexOf((prof.cefr || "")) !== -1) cefr = prof.cefr;
      return { cefr, placed:!!cefr, label:cefr ? levelLabel(cefr) : "", approximate:true, source:DEMO ? "demo" : "cache", synced:DEMO,
        instrument:cachedMeta.instrument_id || "", instrumentVersion:cachedMeta.instrument_version || "", confidence:cachedMeta.confidence == null ? null : cachedMeta.confidence,
        confidenceBand:cachedMeta.confidence_band || "", coverageLimited:!!cachedMeta.coverage_limited, completedAt:cachedMeta.completed_at || "" };
    }
    const { data, error } = await sb.from("student_placements").select("result_cefr,instrument_id,instrument_version,age_band,confidence,completed_at,metadata").eq("student_id", prof.student_id).order("completed_at", { ascending:false }).limit(1).maybeSingle();
    if (error) { observe("data_unavailable", error, { area:"placement", operation:"read", table:"student_placements" }); return { cefr, placed:!!cefr, label:cefr ? levelLabel(cefr) : "", approximate:true, source:"cache", synced:false, status:"error", confidence:cachedMeta.confidence, confidenceBand:cachedMeta.confidence_band || "", coverageLimited:!!cachedMeta.coverage_limited }; }
    if (data && CEFR_ORDER.indexOf(data.result_cefr) !== -1) {
      cefr = data.result_cefr; try { localStorage.setItem(LKEY(prof.username), cefr); } catch (e) {}
      const serverMeta = data.metadata || {};
      return { cefr, placed:true, label:levelLabel(cefr), approximate:true, source:"server", synced:true, instrument:data.instrument_id, instrumentVersion:data.instrument_version, confidence:data.confidence, confidenceBand:serverMeta.confidence_band || "", coverageLimited:!!serverMeta.coverage_limited, completedAt:data.completed_at };
    }
    if (cefr && CEFR_ORDER.indexOf(cefr) !== -1) {
      const legacy = { id:eventUuid() || undefined, student_id:prof.student_id, result_cefr:cefr, instrument_id:"legacy-cache-import", instrument_version:"1",
        age_band:(window.IL_ETAPA && IL_ETAPA.current && IL_ETAPA.current().band) || "neutral", confidence:null,
        completed_at:new Date().toISOString(), metadata:{ migrated_from:"localStorage" } };
      const migrated = await sb.from("student_placements").insert(legacy);
      if (!migrated.error) return { cefr, placed:true, label:levelLabel(cefr), approximate:true, source:"server_migrated", synced:true };
      observe("network_failure", migrated.error, { area:"placement", operation:"migrate_legacy", table:"student_placements" });
      queueLearning("placement", legacy);
    }
    return { cefr, placed:!!cefr, label:cefr ? levelLabel(cefr) : "", approximate:true, source:cefr ? "legacy_cache" : "server", synced:false, status:"empty" };
  };

  // Guarda el resultado del test. Fuente de verdad local para componer la sesión hoy;
  // la persistencia definitiva en BD (students.level_id) es una pequeña migración pendiente.
  API.savePlacement = async function (cefr, meta) {
    if (CEFR_ORDER.indexOf(cefr) === -1) return { ok: false };
    const prof = await this.getProfile();
    if (!prof) return { ok: false };
    meta = meta || {};
    const confidenceBand = ["high","medium","low"].indexOf(meta.confidence_band) >= 0 ? meta.confidence_band : (["high","medium","low"].indexOf(meta.confidence) >= 0 ? meta.confidence : "");
    const confidence = typeof meta.confidence === "number" ? Math.max(0, Math.min(1, meta.confidence)) : ({high:0.9,medium:0.65,low:0.35}[confidenceBand] || null);
    const completedAt = new Date().toISOString();
    const placementMeta = { instrument_id:meta.instrument_id || "legacy-eight-question", instrument_version:meta.instrument_version || "1", age_band:meta.age_band || "neutral",
      confidence, confidence_band:confidenceBand, coverage_limited:!!(meta.metadata && meta.metadata.coverage_limited), completed_at:completedAt };
    try { localStorage.setItem(LKEY(prof.username), cefr); } catch (e) { observe("data_unavailable", e, { area:"placement", operation:"write_cache" }); }
    try { localStorage.setItem(PMETAKEY(prof.username), JSON.stringify(placementMeta)); } catch (e) { observe("data_unavailable", e, { area:"placement", operation:"write_meta_cache" }); }
    if (DEMO) { const db = demoLoad(); const acc = db.find(a => a.username === prof.username); if (acc) { acc.level = levelLabel(cefr); demoSave(db); } return { ok:true, cefr, label:levelLabel(cefr), approximate:true, source:"demo", synced:true, confidence, confidenceBand, coverageLimited:placementMeta.coverage_limited, completedAt }; }
    if (!sb || !prof.student_id) return { ok:true, cefr, label:levelLabel(cefr), approximate:true, source:"cache", synced:false, confidence, confidenceBand, coverageLimited:placementMeta.coverage_limited, completedAt };
    const metadata = Object.assign({}, meta.metadata || {}, confidenceBand ? { confidence_band:confidenceBand } : {});
    const row = { id:eventUuid() || undefined, student_id:prof.student_id, result_cefr:cefr, instrument_id:placementMeta.instrument_id, instrument_version:placementMeta.instrument_version, age_band:placementMeta.age_band, confidence, completed_at:completedAt, metadata };
    const { error } = await sb.from("student_placements").insert(row);
    if (error) { observe("network_failure", error, { area:"placement", operation:"save", table:"student_placements" }); queueLearning("placement", row); return { ok:true, cefr, label:levelLabel(cefr), approximate:true, source:"cache", synced:false, queued:true, confidence, confidenceBand, coverageLimited:placementMeta.coverage_limited, completedAt }; }
    return { ok:true, cefr, label:levelLabel(cefr), approximate:true, source:"server", synced:true, confidence, confidenceBand, coverageLimited:placementMeta.coverage_limited, completedAt };
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
        const { count, error } = await sb.from("practice_sessions").select("id", { count: "exact", head: true }).eq("student_id", prof.student_id).eq("completed", true);
        if (error) observe("data_unavailable", error, { area:"report", operation:"session_count", table:"practice_sessions" });
        if (count != null) days = count;
      } catch (e) { observe("network_failure", e, { area:"report", operation:"session_count", table:"practice_sessions" }); }
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
  API.finishPracticeSession = async function (sessionRef, summary) {
    if (DEMO || !sb) return;
    const sessionId = sessionRef && typeof sessionRef === "object" ? sessionRef.id : sessionRef;
    const clientSessionKey = sessionRef && typeof sessionRef === "object" ? sessionRef.client_session_key : "";
    if (!sessionId && !clientSessionKey) return;
    summary = summary || {};
    const row = { completed:true, correct_count:Number(summary.first_try_correct_count || summary.correct) || 0,
      total_count:Number(summary.planned_count || summary.total) || 0, evaluable_count:Number(summary.evaluable_count) || 0,
      first_try_correct_count:Number(summary.first_try_correct_count) || 0, eventual_success_count:Number(summary.eventual_success_count) || 0,
      technical_failure_count:Number(summary.technical_failure_count) || 0, hint_used_count:Number(summary.hint_used_count) || 0,
      perfect:!!summary.perfect, finished_at:new Date().toISOString() };
    const prof = await this.getProfile();
    let request = sb.from("practice_sessions").update(row);
    request = sessionId ? request.eq("id", sessionId) : request.eq("student_id", prof && prof.student_id).eq("client_session_key", clientSessionKey);
    const { error } = await request;
    if (error) {
      observe("network_failure", error, { area:"learning", operation:"finish_session", table:"practice_sessions" });
      queueLearning("session_finish", { id:sessionId || null, student_id:prof && prof.student_id, client_session_key:clientSessionKey || "", row });
      return { ok:false, queued:true };
    }
    return { ok:true, source:"server" };
  };

  API.flushLearningOutbox = async function () {
    if (DEMO || !sb) return { ok:true, pending:0 };
    const queued = readJson(OUTBOX_KEY, []); if (!queued.length) return { ok:true, pending:0 };
    const succeeded = new Set();
    for (const item of queued) {
      let response = { error:new Error("unknown_outbox_item") };
      try {
        if (item.kind === "attempt") response = await sb.from("attempts").upsert(item.payload, { onConflict:"id", ignoreDuplicates:true });
        else if (item.kind === "mastery") response = await sb.from("exercise_mastery").upsert(item.payload, { onConflict:"student_id,exercise_key" });
        else if (item.kind === "placement") response = await sb.from("student_placements").upsert(item.payload, { onConflict:"id" });
        else if (item.kind === "session_start") response = await sb.from("practice_sessions").upsert(item.payload, { onConflict:"student_id,client_session_key" });
        else if (item.kind === "session_finish") {
          let finish = sb.from("practice_sessions").update(item.payload.row);
          response = item.payload.id
            ? await finish.eq("id", item.payload.id)
            : await finish.eq("student_id", item.payload.student_id).eq("client_session_key", item.payload.client_session_key);
        }
      } catch (error) { response = { error }; }
      if (response && !response.error) succeeded.add(JSON.stringify(item));
    }
    // Keep attempts added while requests were in flight; never overwrite them
    // with the stale snapshot taken at the beginning of this flush.
    const pending=readJson(OUTBOX_KEY,[]).filter(item=>!succeeded.has(JSON.stringify(item)));
    writeJson(OUTBOX_KEY, pending);
    if (pending.length) observe("network_failure", "Quedan eventos pendientes", { area:"learning", operation:"flush", status:String(pending.length) });
    return { ok:pending.length === 0, pending:pending.length };
  };

  addEventListener("online", () => { API.flushLearningOutbox().catch(error => observe("network_failure", error, { area:"learning", operation:"flush_online" })); });

  window.ILAuth = API;
})();
