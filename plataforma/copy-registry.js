/* ============================================================
   Interlanguage HOME · registro canónico de copy por banda
   La interfaz se adapta por edad; el contenido a aprender no se traduce.
   Navegador: window.ILCopy · Node: require("./copy-registry.js")
   ============================================================ */
(function (root, factory) {
  "use strict";
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ILCopy = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createCopyRegistry(environment) {
  "use strict";

  const env = environment || {};
  const BANDS = ["p12", "p34", "p56", "eso", "neutral"];
  const LANGUAGE = Object.freeze({ p12:"es", p34:"es", p56:"hybrid", eso:"en", neutral:"es" });
  const COMMON_ES = Object.freeze({
    ready:"Tu misión de hoy está preparada.", active:"Sigue desde donde lo dejaste.", complete:"Misión completada. Hoy has avanzado.",
    comeback:"Qué bien verte. Retomamos con una misión breve.", missionEyebrow:"TU MISIÓN DE HOY", startCta:"Empezar",
    continueCta:"Continuar", reviewCta:"Repasar errores", completedCta:"Misión completada", exercise:"Ejercicio",
    countJoin:"de", pace:"Una actividad cada vez", summaryTitle:"¡Misión completada!", summaryLead:"Has avanzado un poco más en tu inglés.",
    backHome:"Volver al inicio", unavailableTitle:"Contenido no disponible", unavailableBody:"No hemos podido preparar esta actividad. Puedes volver al inicio sin perder tu progreso."
  });
  const COPY = Object.freeze({
    p12: Object.freeze(Object.assign({}, COMMON_ES, {
      greeting:"¡Hola, {name}!", ready:"Tu misión de hoy está lista.", complete:"¡Misión lista!", comeback:"¡Qué bien verte! Empezamos con algo sencillo.",
      startCta:"¡Empezar!", continueCta:"Seguir", reviewCta:"Repasar", completedCta:"¡Hecho!", exercise:"Actividad",
      summaryLead:"¡Buen trabajo!"
    })),
    p34: Object.freeze(Object.assign({}, COMMON_ES, { greeting:"¡Hola, {name}!" })),
    p56: Object.freeze(Object.assign({}, COMMON_ES, { greeting:"¡Hola, {name}!" })),
    eso: Object.freeze({
      greeting:"Hello, {name}", ready:"Today’s session is ready.", active:"Continue your session from the last exercise.",
      complete:"Session complete. Today’s objective achieved.", comeback:"Welcome back. Start with a short session.", missionEyebrow:"TODAY’S SESSION",
      startCta:"Start session", continueCta:"Continue", reviewCta:"Review mistakes", completedCta:"Session complete", exercise:"Exercise",
      countJoin:"of", pace:"One step at a time", summaryTitle:"Session complete", summaryLead:"You’ve completed today’s session and strengthened your English.",
      backHome:"Back to home", unavailableTitle:"Content unavailable", unavailableBody:"We couldn’t prepare this activity. You can return home without losing your progress."
    }),
    neutral: Object.freeze(Object.assign({}, COMMON_ES, { greeting:"Hola, {name}" }))
  });

  const SKILLS = Object.freeze({
    listening:{ es:"Escucha", en:"Listening" }, vocabulary:{ es:"Vocabulario", en:"Vocabulary" },
    grammar:{ es:"Gramática", en:"Grammar" }, reading:{ es:"Lectura", en:"Reading" },
    writing:{ es:"Escritura", en:"Writing" }, speaking:{ es:"Habla", en:"Speaking" }
  });
  const MISSIONS = Object.freeze({
    "primer-vuelo":{ es:"Mi primer día de cole", en:"My first school day" },
    "rutina-diaria":{ es:"Mi rutina diaria", en:"My daily routine" },
    "la-comida":{ es:"La comida que me gusta", en:"Food I like" },
    "gramatica-inicial":{ es:"Palabras y frases", en:"Words & sentences" },
    "gramatica-media":{ es:"Laboratorio de gramática", en:"Grammar lab" },
    "gramatica-eso":{ es:"Gramática en uso", en:"Grammar in use" },
    "future-plans":{ es:"Planes para el fin de semana", en:"Plans for the weekend" }
  });
  const SUPPORT = Object.freeze({
    elegir:{ es:"MIRA · ELIGE", en:"LOOK · CHOOSE" }, audio:{ es:"ESCUCHA · ELIGE", en:"LISTEN · CHOOSE" },
    emparejar:{ es:"MIRA · RELACIONA", en:"LOOK · MATCH" }, ordenar:{ es:"PIENSA · ORDENA", en:"THINK · ORDER" },
    hablar:{ es:"ESCUCHA · HABLA", en:"LISTEN · SPEAK" }
  });

  function normalizeBand(band) { return BANDS.indexOf(band) >= 0 ? band : "neutral"; }
  function reportMissing(kind, key, band) {
    const observer = env.ILObservability;
    if (observer && typeof observer.report === "function") observer.report("invalid_data", "copy_missing", { area:"copy", operation:kind, status:String(key), band:normalizeBand(band) });
  }
  function interpolate(value, params) {
    return String(value == null ? "" : value).replace(/\{([a-z_]+)\}/gi, (_, key) => Object.prototype.hasOwnProperty.call(params || {}, key) ? String(params[key]) : "");
  }
  function text(key, band, params) {
    const safeBand = normalizeBand(band); const entry = COPY[safeBand][key];
    if (entry == null) { reportMissing("text", key, safeBand); return ""; }
    return interpolate(entry, params);
  }
  function englishLearningLabel(band) { return band === "p56" || band === "eso"; }
  function skill(id, band) {
    const entry = SKILLS[id]; if (!entry) { reportMissing("skill", id, band); return String(id || ""); }
    return englishLearningLabel(normalizeBand(band)) ? entry.en : entry.es;
  }
  function missionTitle(unit, band) {
    const safeBand = normalizeBand(band); const id = unit && unit.id; const entry = MISSIONS[id];
    if (entry) return englishLearningLabel(safeBand) ? entry.en : entry.es;
    const fallback = unit && (unit.titulo_visible || unit.titulo);
    if (fallback) return typeof fallback === "object" ? (englishLearningLabel(safeBand) ? fallback.en : fallback.es) || fallback.es || fallback.en || "" : String(fallback);
    reportMissing("mission", id || "unknown", safeBand);
    return safeBand === "eso" ? "Today’s session" : "Tu misión de hoy";
  }
  function support(type, hasAudio, band) {
    const key = type === "emparejar" || type === "ordenar" || type === "hablar" ? type : (hasAudio ? "audio" : "elegir");
    const entry = SUPPORT[key]; return englishLearningLabel(normalizeBand(band)) ? entry.en : entry.es;
  }
  function reward(item, band, field) {
    if (!item) return "";
    const safeBand = normalizeBand(band); const english = safeBand === "eso";
    if (!field || field === "name") return english ? (item.name || item.nameEs || "") : (item.nameEs || item.name || "");
    const englishField = field + "En"; const spanishField = field + "Es";
    return english ? (item[englishField] || item[field] || item[spanishField] || "") : (item[spanishField] || item[field] || item[englishField] || "");
  }
  function view(band) {
    const safeBand = normalizeBand(band); const out = {};
    Object.keys(COPY[safeBand]).forEach(key => { out[key] = key === "greeting" ? name => text(key, safeBand, { name }) : text(key, safeBand); });
    return Object.freeze(out);
  }

  return { BANDS, LANGUAGE, COPY, SKILLS, MISSIONS, SUPPORT, normalizeBand, text, skill, missionTitle, support, reward, view, has:key => BANDS.some(band => COPY[band][key] != null) };
});
