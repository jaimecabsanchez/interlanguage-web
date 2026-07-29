/* ============================================================
   Interlanguage HOME · capa de autenticación
   Funciona con Supabase real, o en MODO DEMO si no hay claves.
   API pública: window.ILAuth
   ============================================================ */
(function () {
  const CFG = window.IL_SUPABASE || {};
  const DOMAIN = CFG.emailDomain || "alumnos.interlanguage-home.es";
  const DEMO = !CFG.url || CFG.url.indexOf("TU-PROYECTO") !== -1 || !CFG.anonKey || CFG.anonKey.indexOf("TU-ANON") !== -1;

  let sb = null;
  if (!DEMO && window.supabase && window.supabase.createClient) {
    sb = window.supabase.createClient(CFG.url, CFG.anonKey);
  }

  const usernameToEmail = (u) => String(u).trim().toLowerCase() + "@" + DOMAIN;

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
  function pub(acc) { if (!acc) return null; const { password, ...rest } = acc; return { ...rest, id: rest.username }; }
  function randPass() {
    const a = "abcdefghijkmnpqrstuvwxyz", n = "23456789";
    let p = ""; for (let i = 0; i < 5; i++) p += a[Math.floor(Math.random() * a.length)];
    for (let i = 0; i < 3; i++) p += n[Math.floor(Math.random() * n.length)];
    return p;
  }

  /* ---------------- API ---------------- */
  const API = {
    DEMO,
    isDemo() { return DEMO; },

    async signIn(username, password) {
      username = String(username || "").trim().toLowerCase();
      if (!username || !password) return { ok: false, error: "Escribe tu usuario y tu contraseña." };
      if (DEMO) {
        const acc = demoLoad().find(a => a.username === username);
        if (!acc || acc.password !== password) return { ok: false, error: "Usuario o contraseña incorrectos." };
        localStorage.setItem(DEMO_SESSION, username);
        return { ok: true, profile: pub(acc) };
      }
      const { error } = await sb.auth.signInWithPassword({ email: usernameToEmail(username), password });
      if (error) return { ok: false, error: "Usuario o contraseña incorrectos." };
      const profile = await this.getProfile();
      return { ok: true, profile };
    },

    async getProfile() {
      if (DEMO) {
        const u = demoSession(); if (!u) return null;
        return pub(demoLoad().find(a => a.username === u));
      }
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return null;
      const { data, error } = await sb.from("profiles").select("*").eq("id", user.id).single();
      if (error || !data) return { id: user.id, username: (user.email || "").split("@")[0], full_name: "", must_change_password: false, is_admin: false };
      return data;
    },

    async changePassword(newPass) {
      if (!newPass || newPass.length < 8) return { ok: false, error: "La contraseña debe tener al menos 8 caracteres." };
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
      if (user) await sb.from("profiles").update({ must_change_password: false }).eq("id", user.id);
      return { ok: true };
    },

    async signOut() {
      if (DEMO) { localStorage.removeItem(DEMO_SESSION); return; }
      await sb.auth.signOut();
    },

    /* ------- ADMIN ------- */
    async listStudents() {
      if (DEMO) return demoLoad().filter(a => !a.is_admin).map(pub);
      const { data, error } = await sb.from("profiles").select("*").eq("is_admin", false).order("created_at", { ascending: false });
      if (error) return [];
      return data;
    },

    async createStudent({ full_name, username, level, stage, parent_email }) {
      username = String(username || "").trim().toLowerCase().replace(/\s+/g, "");
      if (!full_name || !username) return { ok: false, error: "Faltan el nombre y el usuario." };
      if (DEMO) {
        const db = demoLoad();
        if (db.find(a => a.username === username)) return { ok: false, error: "Ese usuario ya existe." };
        const password = randPass();
        db.push({ username, password, full_name, level: level || "", stage: stage || "", parent_email: parent_email || "", is_admin: false, must_change_password: true, created_at: new Date().toISOString().slice(0, 10) });
        demoSave(db);
        return { ok: true, username, password };
      }
      const { data, error } = await sb.functions.invoke("admin-create-student", {
        body: { action: "create", full_name, username, level, stage, parent_email }
      });
      if (error || (data && data.error)) return { ok: false, error: (data && data.error) || error.message || "No se pudo crear la cuenta." };
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
    }
  };

  window.ILAuth = API;
})();
