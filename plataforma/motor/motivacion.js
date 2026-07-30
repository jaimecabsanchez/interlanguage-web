/* ============================================================
   Interlanguage · MOTIVACIÓN (Bloque 12)
   ------------------------------------------------------------
   Lógica PURA (sin red ni DOM): catálogo de medallas + evaluación
   + racha flexible con comodín. Contra uno mismo, sin competición.
   Base: docs/superpowers/specs/2026-07-29-sistema-motivacion-personaje.md
   Navegador (window.IL_MOTIVACION) y Node (module.exports).
   ============================================================ */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.IL_MOTIVACION = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Catálogo de medallas (mismos ids que la tabla rewards de la BD).
  // family: constancia · aciertos · mejora · dominio
  const MEDALS = [
    { id: "streak_2",      family: "constancia", name: "2 días seguidos",     icon: "🔥" },
    { id: "streak_5",      family: "constancia", name: "5 días seguidos",     icon: "🔥" },
    { id: "streak_10",     family: "constancia", name: "10 días seguidos",    icon: "🔥" },
    { id: "streak_30",     family: "constancia", name: "Un mes de racha",     icon: "🏆" },
    { id: "aciertos_5",    family: "aciertos",   name: "5 aciertos seguidos", icon: "🎯" },
    { id: "aciertos_10",   family: "aciertos",   name: "10 aciertos seguidos",icon: "🎯" },
    { id: "pleno",         family: "aciertos",   name: "Sesión perfecta",     icon: "⭐" },
    { id: "record_racha",  family: "mejora",     name: "Nuevo récord de racha",icon: "📈" },
    { id: "primera",       family: "dominio",    name: "Primera lección",     icon: "🏅" },
    { id: "diez_lecciones",family: "dominio",    name: "10 lecciones",        icon: "🎓" }
  ];
  const byId = {}; MEDALS.forEach(m => byId[m.id] = m);

  // Criterios (puros). ctx = { streak, prevBest, lessons, session:{total, allCorrect, maxCorrectStreak} }
  const CRITERIA = {
    streak_2:       (c) => c.streak >= 2,
    streak_5:       (c) => c.streak >= 5,
    streak_10:      (c) => c.streak >= 10,
    streak_30:      (c) => c.streak >= 30,
    aciertos_5:     (c) => c.session.maxCorrectStreak >= 5,
    aciertos_10:    (c) => c.session.maxCorrectStreak >= 10,
    pleno:          (c) => c.session.total >= 3 && c.session.allCorrect,
    record_racha:   (c) => c.streak >= 2 && c.streak > (c.prevBest || 0),
    primera:        (c) => c.lessons >= 1,
    diez_lecciones: (c) => c.lessons >= 10
  };

  // Devuelve las medallas RECIÉN ganadas (cumplen criterio y no se tenían ya).
  function evaluate(ctx) {
    const earned = new Set(ctx.earned || []);
    const session = ctx.session || { total: 0, allCorrect: false, maxCorrectStreak: 0 };
    const c = { streak: ctx.streak || 0, prevBest: ctx.prevBest || 0, lessons: ctx.lessons || 0, session: session };
    const out = [];
    for (const m of MEDALS) {
      if (earned.has(m.id)) continue;
      if (CRITERIA[m.id] && CRITERIA[m.id](c)) out.push(m.id);
    }
    return out;
  }

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

  return { MEDALS, byId, CRITERIA, evaluate, nextStreak };
});
