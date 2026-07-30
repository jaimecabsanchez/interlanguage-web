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
  const DEMO = !CFG.url || CFG.url.indexOf("TU-PROYECTO") !== -1
            || !KEY || KEY.indexOf("TU-ANON") !== -1 || KEY.indexOf("TU-PUBLISHABLE") !== -1;

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

  /* ---------------- MODO DEMO (localStorage) ---------------- */
  const DEMO_DB = "il_demo_db_v1", DEMO_SESSION = "il_demo_session_v1";
  function seed() {
    return [
      { username: "admin", password: "admin1234", full_name: "Equipo Interlanguage", level: "", stage: "", parent_email: "", is_admin: true, must_change_password: false, created_at: "2026-07-01" },
      { username: "lucia", password: "home1234", full_name: "Lucía G.", level: "Explorer · A1", stage: "Explorers", parent_email: "familia.g@email.com", is_admin: false, must_change_password: true, created_at: "2026-07-20" }
    ];
  }
  function demoLoad() { try { return JSON.parse(localStorage.getItem(DEMO_DB)) || seed(); } catch (e) { return seed(); } }
  function demoSave(db) { localStorage.setItem(DEMO_DB, JSON.stringify(db)); }
  function demoSession() { return localStorage.getItem(DEMO_SESSION); }
  function pub(acc) { if (!acc) return null; const { password, ...rest } = acc; return { ...rest, id: rest.username, is_student: !rest.is_admin }; }
  const randPass = U.generatePassword || function () {
    const a = "abcdefghijkmnpqrstuvwxyz", n = "23456789";
    let p = ""; for (let i = 0; i < 5; i++) p += a[Math.floor(Math.random() * a.length)];
    for (let i = 0; i < 3; i++) p += n[Math.floor(Math.random() * n.length)];
    return p;
  };

  /* ---------------- API ---------------- */
  const API = {
    DEMO,
    isDemo() { return DEMO; },

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
        student_id: null, level: ""
      };

      // Si es alumno, traemos su ficha para el nombre de pila y su id de alumno
      if (is_student || (!is_admin && !is_teacher)) {
        const { data: st } = await sb.from("students").select("id, first_name, level_id").eq("user_id", user.id).maybeSingle();
        if (st) {
          profile.student_id = st.id;
          profile.first_name = st.first_name || "";
          profile.full_name = st.first_name || profile.full_name;
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
        .select("id, first_name, level_id, created_at, users:users!students_user_id_fkey(username, status), enrollments(status)")
        .order("created_at", { ascending: false });
      if (error) return [];
      return (data || []).map(s => ({
        id: s.id,
        full_name: s.first_name || "",
        username: s.users ? s.users.username : "",
        created_at: s.created_at,
        active: !((s.enrollments || []).length) || (s.enrollments || []).some(e => e.status === "active")
      }));
    },

    async createStudent(payload) {
      if (DEMO) {
        const username = String(payload.username || "").trim().toLowerCase().replace(/\s+/g, "");
        if (!payload.full_name || !username) return { ok: false, error: "Faltan el nombre y el usuario." };
        const db = demoLoad();
        if (db.find(a => a.username === username)) return { ok: false, error: "Ese usuario ya existe." };
        const password = randPass();
        db.push({ username, password, full_name: payload.full_name, level: payload.level || "", stage: payload.stage || "", parent_email: payload.parent_email || "", is_admin: false, must_change_password: true, created_at: new Date().toISOString().slice(0, 10) });
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
    if (streak) { p.streak = streak.current; p.best = streak.longest; p.last = streak.last_practice_date || ""; }
    p.id = prof.id; p.student_id = sid; p.username = prof.username; p.full_name = prof.full_name; p.level = prof.level;
    return p;
  };

  API._save = async function (p) {
    if (DEMO) { localStorage.setItem(PKEY(p.username), JSON.stringify(p)); return; }
    if (!p.student_id) return;
    await Promise.all([
      sb.from("student_state").upsert({ student_id: p.student_id, gems: p.gems, xp: p.xp, lessons: p.lessons, owned: p.owned, hat: p.hat, acc: p.acc }),
      sb.from("streaks").upsert({ student_id: p.student_id, current: p.streak, longest: p.best, last_practice_date: p.last || null })
    ]);
  };

  API.completeLesson = async function () {
    const p = await this.getProgress(); if (!p) return null;
    const t = today();
    if (p.last === t) { /* ya practicó hoy: no sube la racha */ }
    else if (p.last === dayAdd(-1)) { p.streak += 1; }
    else { p.streak = 1; }
    p.last = t; p.gems += 20; p.xp += 50; p.lessons += 1;
    p.best = Math.max(p.best || 0, p.streak);
    await this._save(p); return p;
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

  window.ILAuth = API;
})();
