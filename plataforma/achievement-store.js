/* ============================================================
   Interlanguage HOME · Almacén de LOGROS conseguidos
   ------------------------------------------------------------
   Fase 3 · B. Persiste los ids de achievements ganados por
   alumno y MIGRA de forma compatible las medallas antiguas
   (il_medals_<username>) la primera vez, sin perder nada y sin
   tocar el contrato de backend (student_rewards sigue igual).

   Cliente-first (demo + caché), como mastery-store.js.
   Navegador: window.ILAchievements · Node: module.exports
   ============================================================ */
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory;
  else root.ILAchievements = factory(root.IL_ACHIEVEMENTS, root.localStorage);
})(typeof globalThis !== "undefined" ? globalThis : this, function (ACH, storage) {
  "use strict";

  const PREFIX = "il_achievements_v1_";
  const LEGACY_PREFIX = "il_medals_"; // medallas antiguas (mismo nombre de usuario que usaba auth.js)

  function enc(username) { return encodeURIComponent(String(username || "guest").trim().toLowerCase()); }
  function key(username) { return PREFIX + enc(username); }
  function read(username) {
    try { const v = JSON.parse(storage.getItem(key(username))); return Array.isArray(v) ? v : null; }
    catch (e) { return null; }
  }
  function write(username, arr) {
    try { storage.setItem(key(username), JSON.stringify(arr)); return true; } catch (e) { return false; }
  }
  function legacyMedals(username) {
    try { const v = JSON.parse(storage.getItem(LEGACY_PREFIX + username)); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }

  // Ids conseguidos. La primera vez (sin datos nuevos) migra las medallas antiguas.
  function earned(username) {
    let cur = read(username);
    if (cur == null) {
      cur = ACH && ACH.migrateEarned ? ACH.migrateEarned(legacyMedals(username)) : [];
      write(username, cur);
    }
    return cur.slice();
  }

  // Añade ids recién ganados (sin duplicar). Devuelve los que eran realmente nuevos.
  function add(username, ids) {
    const set = new Set(earned(username));
    const fresh = [];
    (ids || []).forEach(id => { if (id && !set.has(id)) { set.add(id); fresh.push(id); } });
    if (fresh.length) write(username, Array.from(set));
    return fresh;
  }

  function has(username, id) { return earned(username).indexOf(id) >= 0; }
  function clear(username) { try { storage.removeItem(key(username)); return true; } catch (e) { return false; } }

  return { earned, add, has, clear, _key: key };
});
