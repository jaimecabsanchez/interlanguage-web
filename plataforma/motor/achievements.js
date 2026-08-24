/* ============================================================
   Interlanguage HOME · ACHIEVEMENTS (colección unificada)
   ------------------------------------------------------------
   Fase 3 · §1-2. UNA sola taxonomía de logros que sustituye la
   doble lista anterior (medallas emoji de motor/motivacion.js +
   sellos de progress-data.js).

   Lógica PURA (sin DOM ni red), 100% testeable.
   - Familias: constancia · learning · skills · mastery · special
   - Cada logro: id, family, name(+En), description(+En), criterion
     (declarativo), visual (motivo del sello), rarity (SOLO visual,
     nunca apuestas), reward (id de world-data.js o null), bands.
   - Se CONSERVAN los ids de sello que world-data.js usa como
     condición de desbloqueo (first-flight, weekly-explorer,
     word-collector) para no romper contratos.

   Navegador: window.IL_ACHIEVEMENTS · Node: module.exports
   ============================================================ */
(function (root, factory) {
  "use strict";
  const Copy = typeof module !== "undefined" && module.exports ? require("../copy-registry.js") : root.ILCopy;
  const api = factory(Copy);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.IL_ACHIEVEMENTS = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (Copy) {
  "use strict";

  const FAMILIES = ["constancia", "learning", "skills", "mastery", "special"];
  const ALL = ["p12", "p34", "p56", "eso"];
  const YOUNGER = ["p12", "p34", "p56"]; // "morning" tiene sentido en Primaria
  const ESO = ["eso"];

  // Criterios declarativos (evaluables sin efectos):
  //   count       → un contador acumulado del contexto (lessons, streak, weekCount, focusMissions, wordsLearned)
  //   skillCorrect→ aciertos acumulados de una habilidad (ctx.skillCorrect[skill])
  //   skillMastered→ objetivos dominados de una habilidad (ctx.mastery[skill]) — via mastery-store
  //   perfectRound→ evento: sesión perfecta de >= min ejercicios
  //   correctStreak→ evento: N aciertos seguidos en una sesión
  //   comeback    → evento: volver tras una pausa
  //   streakRecord→ evento: superar tu mejor racha
  const CATALOG = Object.freeze([
    // ---- CONSTANCIA ----
    a("first-flight", "constancia", "First Flight", "Primer vuelo",
      "Tu primer paso en la ruta.", "Completa tu primera misión.",
      { type: "count", source: "lessons", target: 1 }, "first-flight", "common", "acc-backpack"),
    a("weekly-explorer", "constancia", "Weekly Explorer", "Explorador de la semana",
      "Mantuviste un ritmo constante toda la semana.", "Cumple tu objetivo semanal.",
      { type: "count", source: "weekCount", target: 5 }, "weekly-explorer", "common", "world-lanterns"),
    a("streak-5", "constancia", "5-Day Streak", "Racha de 5 días",
      "Cinco días seguidos de práctica.", "Mantén una racha de 5 días.",
      { type: "count", source: "streak", target: 5 }, "streak-spark", "common", "top-sport"),
    a("streak-10", "constancia", "10-Day Streak", "Racha de 10 días",
      "Diez días seguidos. Ya es un hábito.", "Mantén una racha de 10 días.",
      { type: "count", source: "streak", target: 10 }, "streak-spark", "rare", null),
    a("streak-30", "constancia", "One-Month Streak", "Un mes de racha",
      "Un mes entero de constancia.", "Mantén una racha de 30 días.",
      { type: "count", source: "streak", target: 30 }, "streak-spark", "epic", null),

    // ---- LEARNING ----
    a("ten-missions", "learning", "10 Missions", "10 misiones",
      "Diez misiones completadas.", "Completa 10 misiones.",
      { type: "count", source: "lessons", target: 10 }, "missions-10", "common", "bg-city"),
    a("fifty-missions", "learning", "50 Missions", "50 misiones",
      "Cincuenta misiones. Todo un viaje.", "Completa 50 misiones.",
      { type: "count", source: "lessons", target: 50 }, "missions-50", "epic", null),
    a("morning-explorer", "learning", "Morning Explorer", "Explorador matinal",
      "Dominas cada vez más tu rutina en inglés.", "Completa 5 misiones sobre rutinas.",
      { type: "count", source: "focusMissions", target: 5 }, "morning-explorer", "common", null, YOUNGER),
    a("weekend-planner", "learning", "Weekend Planner", "Planes de finde",
      "Planificas situaciones cotidianas con inglés natural.", "Completa 5 misiones sobre planes.",
      { type: "count", source: "focusMissions", target: 5 }, "weekend-planner", "common", null, ESO),

    // ---- SKILLS ----
    a("word-collector", "skills", "Word Collector", "Coleccionista de palabras",
      "Tu vocabulario sigue creciendo.", "Aprende 50 palabras.",
      { type: "count", source: "wordsLearned", target: 50 }, "word-collector", "common", "acc-badge"),
    a("listening-star", "skills", "Listening Star", "Estrella del listening",
      "Reconoces el inglés con más seguridad.", "Acierta 20 ejercicios de listening.",
      { type: "skillCorrect", skill: "listening", target: 20 }, "listening-star", "common", null),
    a("speaking-star", "skills", "Speaking Star", "Estrella del speaking",
      "Te lanzas a hablar con confianza.", "Domina 8 objetivos de speaking.",
      { type: "skillMastered", skill: "speaking", target: 8 }, "speaking-star", "rare", null),
    a("grammar-builder", "skills", "Grammar Builder", "Constructor de gramática",
      "Construyes frases cada vez mejores.", "Domina 8 objetivos de gramática.",
      { type: "skillMastered", skill: "grammar", target: 8 }, "grammar-builder", "common", null),
    a("reading-explorer", "skills", "Reading Explorer", "Explorador lector",
      "Entiendes textos con más soltura.", "Domina 8 objetivos de lectura.",
      { type: "skillMastered", skill: "reading", target: 8 }, "reading-explorer", "common", null),

    // ---- MASTERY ----
    a("perfect-round", "mastery", "Perfect Round", "Ronda perfecta",
      "Una misión entera sin fallos.", "Completa una misión sin errores.",
      { type: "perfectRound", min: 4 }, "perfect-round", "rare", null),
    a("sharp-5", "mastery", "Sharp Five", "Cinco seguidos",
      "Cinco aciertos seguidos.", "Acierta 5 seguidos en una misión.",
      { type: "correctStreak", target: 5 }, "sharp", "common", null),
    a("sharp-10", "mastery", "Sharp Ten", "Diez seguidos",
      "Diez aciertos seguidos. Imparable.", "Acierta 10 seguidos en una misión.",
      { type: "correctStreak", target: 10 }, "sharp", "rare", null),

    // ---- SPECIAL ----
    a("comeback", "special", "Comeback", "Regreso",
      "Volviste a practicar tras una pausa.", "Retoma tu práctica tras varios días.",
      { type: "comeback" }, "comeback", "common", null),
    a("record-streak", "special", "New Record", "Nuevo récord",
      "Superaste tu mejor racha.", "Bate tu récord de racha.",
      { type: "streakRecord" }, "record-streak", "rare", null)
  ]);

  function a(id, family, name, nameEs, description, criterionText, criterion, visual, rarity, reward, bands) {
    return {
      id: id, family: family, name: name, nameEs: nameEs,
      description: description, requirement: criterionText,
      criterion: criterion, visual: visual, rarity: rarity || "common",
      reward: reward || null, bands: bands || ALL, momentary: isMomentary(criterion)
    };
  }
  function isMomentary(c) {
    return c.type === "perfectRound" || c.type === "correctStreak" || c.type === "comeback" || c.type === "streakRecord";
  }

  const BY_ID = {}; CATALOG.forEach(item => { BY_ID[item.id] = item; });

  // Mapa de ids ANTIGUOS (medallas + sellos previos) → ids nuevos, para migrar sin perder logros.
  const LEGACY_MAP = Object.freeze({
    primera: "first-flight", diez_lecciones: "ten-missions",
    streak_5: "streak-5", streak_10: "streak-10", streak_30: "streak-30",
    aciertos_5: "sharp-5", aciertos_10: "sharp-10",
    pleno: "perfect-round", record_racha: "record-streak",
    // sellos que ya usaban el id definitivo (identidad):
    "first-flight": "first-flight", "weekly-explorer": "weekly-explorer",
    "morning-explorer": "morning-explorer", "weekend-planner": "weekend-planner",
    "word-collector": "word-collector", "listening-star": "listening-star",
    comeback: "comeback"
    // streak_2 no tiene equivalente: se ignora (era un hito menor).
  });

  function num(v) { return Math.max(0, Number(v) || 0); }
  function currentValue(criterion, ctx) {
    ctx = ctx || {};
    const c = criterion || {};
    const session = ctx.session || {};
    switch (c.type) {
      case "count": return num(ctx[c.source]);
      case "skillCorrect": return num((ctx.skillCorrect || {})[c.skill]);
      case "skillMastered": return num((ctx.mastery || {})[c.skill]);
      case "correctStreak": return Math.max(num(session.maxCorrectStreak), num(ctx.bestCorrectStreak));
      case "perfectRound": return (session.allCorrect && num(session.total) >= (c.min || 1)) ? (c.min || 1) : 0;
      case "comeback": return ctx.comeback ? 1 : 0;
      case "streakRecord": return (num(ctx.streak) >= 2 && num(ctx.streak) > num(ctx.prevBest)) ? 1 : 0;
      default: return 0;
    }
  }
  function targetValue(criterion) {
    const c = criterion || {};
    if (c.type === "perfectRound") return c.min || 1;
    if (c.type === "comeback" || c.type === "streakRecord") return 1;
    return Number(c.target) || 0;
  }
  function meets(criterion, ctx) {
    const c = criterion || {};
    if (c.type === "perfectRound") {
      const s = ctx.session || {};
      return !!s.allCorrect && num(s.total) >= (c.min || 1);
    }
    if (c.type === "correctStreak") return num((ctx.session || {}).maxCorrectStreak) >= (c.target || 0);
    if (c.type === "comeback") return !!ctx.comeback;
    if (c.type === "streakRecord") return num(ctx.streak) >= 2 && num(ctx.streak) > num(ctx.prevBest);
    return currentValue(c, ctx) >= targetValue(c);
  }

  function availableFor(band) {
    if (!band) return CATALOG.slice();
    return CATALOG.filter(item => item.bands.indexOf(band) >= 0);
  }

  // Logros RECIÉN conseguidos: cumplen criterio, no se tenían ya, y aplican a la banda.
  function evaluate(ctx) {
    ctx = ctx || {};
    const earned = new Set(ctx.earned || []);
    const band = ctx.band || null;
    const out = [];
    for (const item of CATALOG) {
      if (earned.has(item.id)) continue;                       // nunca duplica
      if (band && item.bands.indexOf(band) < 0) continue;      // disponibilidad por edad
      if (meets(item.criterion, ctx)) out.push(item.id);
    }
    return out;
  }

  // Progreso hacia un logro: {current, target, percent, done, momentary}
  function progressOf(id, ctx) {
    const item = BY_ID[id]; if (!item) return null;
    const target = targetValue(item.criterion);
    const done = (ctx && ctx.earned && ctx.earned.indexOf(id) >= 0) || meets(item.criterion, ctx || {});
    if (item.momentary) return { current: done ? 1 : 0, target: 1, percent: done ? 100 : 0, done: done, momentary: true };
    const current = Math.min(target, currentValue(item.criterion, ctx || {}));
    return { current: current, target: target, percent: target ? Math.min(100, Math.round(current / target * 100)) : 100, done: current >= target, momentary: false };
  }

  function displayName(item, band) { return Copy && Copy.reward ? Copy.reward(item, band, "name") : (band && band !== "eso" && item.nameEs ? item.nameEs : item.name); }
  function displayCopy(item, band, field) { return Copy && Copy.reward ? Copy.reward(item, band, field) : (item && item[field]) || ""; }
  function migrateId(oldId) { return LEGACY_MAP[oldId] || null; }
  function migrateEarned(oldIds) {
    const set = new Set();
    (oldIds || []).forEach(id => { const n = LEGACY_MAP[id]; if (n && BY_ID[n]) set.add(n); });
    return Array.from(set);
  }
  function byFamily(family) { return CATALOG.filter(item => item.family === family); }

  return {
    FAMILIES, CATALOG, byId: BY_ID, LEGACY_MAP,
    evaluate, progressOf, meets, currentValue, targetValue,
    availableFor, byFamily, displayName, displayCopy, migrateId, migrateEarned, isMomentary
  };
});
