/* ============================================================
   Interlanguage · MOTIVACIÓN (Bloque 12)
   ------------------------------------------------------------
   Lógica PURA (sin red ni DOM): catálogo de medallas + evaluación
   + racha flexible con comodín. Contra uno mismo, sin competición.
   Base: docs/superpowers/specs/2026-07-29-sistema-motivacion-personaje.md
   Navegador (window.IL_MOTIVACION) y Node (module.exports).
   ============================================================ */
(function (root, factory) {
  const Achievements = typeof module !== "undefined" && module.exports ? require("./achievements.js") : root.IL_ACHIEVEMENTS;
  const api = factory(Achievements);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.IL_MOTIVACION = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (Achievements) {
  "use strict";

  if (!Achievements) throw new Error("IL_ACHIEVEMENTS debe cargarse antes de motivacion.js");
  const MEDALS = Achievements.CATALOG;
  const byId = Achievements.byId;
  const LEGACY_ID_BY_CANONICAL = Object.freeze({
    "first-flight":"primera", "ten-missions":"diez_lecciones", "streak-5":"streak_5", "streak-10":"streak_10",
    "streak-30":"streak_30", "sharp-5":"aciertos_5", "sharp-10":"aciertos_10", "perfect-round":"pleno", "record-streak":"record_racha"
  });
  function canonicalEarned(ids) { return Achievements.migrateEarned(ids).concat((ids || []).filter(id => Achievements.byId[id])); }
  function evaluate(ctx) { return Achievements.evaluate(Object.assign({}, ctx, { earned:canonicalEarned(ctx && ctx.earned) })); }
  function toLegacyIds(ids) { return (ids || []).map(id => LEGACY_ID_BY_CANONICAL[id]).filter(Boolean); }

  // Racha FLEXIBLE: un día perdido no la rompe si hay comodín disponible.
  // row = { current, last_practice_date, freezes_available }
  function nextStreak(row, today) {
    row = row || {};
    const current = row.current || 0;
    const freezes = (row.freezes_available == null) ? 1 : row.freezes_available;
    const last = row.last_practice_date || null;
    if (last === today) return { current: current || 1, freezes_available: freezes, last_practice_date: today, usedFreeze: false };
    if (!last) return { current: 1, freezes_available: freezes, last_practice_date: today, usedFreeze: false };
    const diff = Math.round((Date.parse(today + "T00:00:00Z") - Date.parse(last + "T00:00:00Z")) / 86400000);
    if (diff === 1) return { current: current + 1, freezes_available: freezes, last_practice_date: today, usedFreeze: false };
    if (diff === 2 && freezes > 0) return { current: current + 1, freezes_available: freezes - 1, last_practice_date: today, usedFreeze: true };
    return { current: 1, freezes_available: freezes, last_practice_date: today, usedFreeze: false };
  }

  return { MEDALS, byId, evaluate, nextStreak, canonicalEarned, toLegacyIds, LEGACY_ID_BY_CANONICAL };
});
