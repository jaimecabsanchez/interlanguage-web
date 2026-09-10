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
  const PRACTICE = Object.freeze({
    p12:Object.freeze({ title:"¿Qué practicamos hoy?", subtitle:"Elige una opción y avanzamos paso a paso.", recommended:"Lo mejor para hoy", dailyTitle:"Tu misión de hoy", dailyBody:"Primero completa tu misión. Después podrás practicar más.", dailyCta:"Ir a mi misión", dueBody:"Hay algunas cosas listas para practicar otra vez.", skillBody:"Hoy te ayudará practicar {skill}.", extraBody:"Una práctica corta para seguir avanzando.", start:"Empezar", reviewTitle:"Repasar", reviewBody:"Vamos a practicar otra vez algunas cosas.", reviewEmpty:"Todo listo por ahora", chooseTitle:"Elige qué practicar", noContentTitle:"Todavía no hay práctica preparada", noContentBody:"Puedes volver a Inicio. Tu progreso está guardado.", backHome:"Volver a Inicio" }),
    p34:Object.freeze({ title:"Practicar", subtitle:"Elige cómo quieres reforzar tu inglés.", recommended:"Recomendado para ti", dailyTitle:"Completa tu misión", dailyBody:"Tu misión de hoy sigue pendiente. Es el mejor siguiente paso.", dailyCta:"Continuar misión", dueBody:"Tienes contenido listo para repasar.", skillBody:"Practicar {skill} te ayudará a afianzar lo aprendido.", extraBody:"Una ronda corta para seguir avanzando.", start:"Practicar", reviewTitle:"Repasar", reviewBody:"Practica otra vez lo que más cuesta.", reviewEmpty:"No tienes nada pendiente", chooseTitle:"Elegir habilidad", noContentTitle:"Práctica no disponible", noContentBody:"Todavía no hay contenido compatible para practicar.", backHome:"Volver a Inicio" }),
    p56:Object.freeze({ title:"Practicar", subtitle:"Elige una práctica breve según lo que necesitas hoy.", recommended:"Recomendado para ti", dailyTitle:"Primero, tu misión", dailyBody:"Tu misión diaria sigue pendiente. Complétala antes de la práctica extra.", dailyCta:"Continuar misión", dueBody:"Tienes contenido listo para review.", skillBody:"Un poco de {skill} es la mejor opción ahora.", extraBody:"Práctica extra adaptada a tu nivel.", start:"Practicar ahora", reviewTitle:"Repasar puntos clave", reviewBody:"Vuelve a lo que necesita un poco más de práctica.", reviewEmpty:"Todo al día", chooseTitle:"Elegir habilidad", noContentTitle:"Práctica no disponible", noContentBody:"No hay contenido compatible disponible ahora mismo.", backHome:"Volver a Inicio" }),
    eso:Object.freeze({ title:"Practice", subtitle:"Choose a focused session for what you need today.", recommended:"Recommended", dailyTitle:"Complete today’s session", dailyBody:"Your daily session is still pending and remains the priority.", dailyCta:"Continue session", dueBody:"You have review items ready.", skillBody:"A focused {skill} session is the strongest next step.", extraBody:"A short extra session matched to your level.", start:"Start practice", reviewTitle:"Review mistakes", reviewBody:"Revisit the items that need another attempt.", reviewEmpty:"Everything is up to date", chooseTitle:"Choose a skill", noContentTitle:"Practice unavailable", noContentBody:"There is no compatible practice content available right now.", backHome:"Back to home" }),
    neutral:Object.freeze({ title:"Practicar", subtitle:"Elige una práctica disponible.", recommended:"Recomendado", dailyTitle:"Tu misión de hoy", dailyBody:"Tu misión sigue pendiente y es el siguiente paso recomendado.", dailyCta:"Ir a la misión", dueBody:"Hay contenido listo para repasar.", skillBody:"Puedes practicar {skill}.", extraBody:"Una práctica breve disponible.", start:"Practicar", reviewTitle:"Repasar", reviewBody:"Practica de nuevo algunos contenidos.", reviewEmpty:"Todo listo por ahora", chooseTitle:"Elegir práctica", noContentTitle:"Práctica no disponible", noContentBody:"No hay contenido compatible disponible ahora mismo.", backHome:"Volver a Inicio" })
  });
  const PLACEMENT = Object.freeze({
    p12:Object.freeze({ eyebrow:"VAMOS PASO A PASO", introTitle:"Vamos a encontrar un buen comienzo", introBody:"Mira, escucha y elige. Si aún no lo sabes, no pasa nada.", start:"Empezar", step:"Paso {current} de hasta {max}", choose:"Elige una respuesta", unknown:"Aún no lo sé", saved:"Respuesta guardada", next:"Siguiente", resume:"Seguimos donde lo dejaste", resultTitle:"¡Ya tenemos un buen comienzo!", resultLevel:"Empezaremos en {level}", resultBody:"Prepararemos palabras y frases que encajan contigo.", seenTitle:"Hoy has visto", continue:"Ir a mi primera misión", pending:"Guardado aquí. Lo sincronizaremos cuando vuelva la conexión.", loading:"Preparando tu comienzo", unavailable:"Ahora no podemos preparar las preguntas", retry:"Intentar de nuevo", listen:"Escuchar", audioError:"El sonido no está disponible. Probamos otra actividad."}),
    p34:Object.freeze({ eyebrow:"ENCONTRAMOS TU PUNTO DE PARTIDA", introTitle:"Vamos a encontrar tu punto de partida", introBody:"Responde lo que sepas. Puedes decir que todavía no lo sabes.", start:"Comenzar", step:"Pregunta {current} de hasta {max}", choose:"Elige una respuesta", unknown:"Todavía no lo sé", saved:"Respuesta guardada", next:"Siguiente pregunta", resume:"Continuamos desde tu última pregunta", resultTitle:"¡Punto de partida preparado!", resultLevel:"Empezaremos en {level}", resultBody:"Tus primeras misiones se adaptarán a este punto de partida.", seenTitle:"Hoy has visto", continue:"Empezar mi primera misión", pending:"Guardado en este dispositivo. Se sincronizará al recuperar conexión.", loading:"Preparando tu calibración", unavailable:"No podemos preparar la calibración ahora", retry:"Intentar de nuevo", listen:"Escuchar", audioError:"El audio no está disponible. Continuamos con otra actividad."}),
    p56:Object.freeze({ eyebrow:"TU PUNTO DE PARTIDA", introTitle:"Una calibración breve", introBody:"Las preguntas se ajustarán mientras avanzas. Responde sin preocuparte por una nota.", start:"Empezar calibración", step:"Pregunta {current} de hasta {max}", choose:"Choose one answer", unknown:"Todavía no lo sé", saved:"Respuesta guardada", next:"Siguiente", resume:"Continuamos desde donde lo dejaste", resultTitle:"Tu punto de partida está listo", resultLevel:"Empezaremos en {level}", resultBody:"Las misiones combinarán tu nivel de inglés con una experiencia adecuada a tu edad.", seenTitle:"Today you saw", continue:"Ir a mi primera misión", pending:"Guardado en este dispositivo. Se sincronizará al recuperar conexión.", loading:"Preparando tu calibración", unavailable:"No podemos preparar la calibración ahora", retry:"Intentar de nuevo", listen:"Listen", audioError:"Audio is unavailable. We’ll continue with another activity."}),
    eso:Object.freeze({ eyebrow:"STARTING POINT", introTitle:"A short adaptive check", introBody:"Questions adjust as you go. This is a starting point, not a grade.", start:"Start", step:"Question {current} of up to {max}", choose:"Choose one answer", unknown:"I don’t know yet", saved:"Answer saved", next:"Next question", resume:"Continuing where you left off", resultTitle:"Your starting point is ready", resultLevel:"You’ll start at {level}", resultBody:"Your sessions will match both your English level and your age.", seenTitle:"Today you saw", continue:"Start my first session", pending:"Saved on this device. It will sync when you’re back online.", loading:"Preparing your check", unavailable:"We can’t prepare the check right now", retry:"Try again", listen:"Listen", audioError:"Audio is unavailable. We’ll continue with another activity."}),
    neutral:Object.freeze({ eyebrow:"TU PUNTO DE PARTIDA", introTitle:"Vamos a encontrar un buen comienzo", introBody:"Responde lo que sepas. Esto no es una nota.", start:"Empezar", step:"Pregunta {current} de hasta {max}", choose:"Elige una respuesta", unknown:"Todavía no lo sé", saved:"Respuesta guardada", next:"Siguiente", resume:"Continuamos donde lo dejaste", resultTitle:"Tu punto de partida está listo", resultLevel:"Empezaremos en {level}", resultBody:"Prepararemos una primera misión adecuada para ti.", seenTitle:"Hoy has visto", continue:"Ir a mi primera misión", pending:"Guardado aquí. Se sincronizará cuando vuelva la conexión.", loading:"Preparando tu calibración", unavailable:"No podemos preparar la calibración ahora", retry:"Intentar de nuevo", listen:"Escuchar", audioError:"El audio no está disponible. Continuamos con otra actividad."})
  });
  const ONBOARDING = Object.freeze({
    p12:Object.freeze({ next:"Siguiente", finish:"Buscar mi mejor comienzo", steps:Object.freeze([
      Object.freeze({ visual:"avatar", title:"¡Hola, {name}!", body:"Este es tu rincón para aprender inglés a tu manera." }),
      Object.freeze({ visual:"target", title:"Una misión cortita cada día", body:"Escucharás, mirarás y jugarás con palabras y frases.", preview:"Tu primera misión", meta:"Pasos claros", time:"5 min" }),
      Object.freeze({ visual:"route", title:"Tu mundo crecerá contigo", body:"Primero veremos por dónde empezar. Después, cada misión mostrará todo lo que vas aprendiendo." })
    ])}),
    p34:Object.freeze({ next:"Siguiente", finish:"Encontrar mi punto de partida", steps:Object.freeze([
      Object.freeze({ visual:"avatar", title:"¡Hola, {name}!", body:"Esta será tu ruta personal para avanzar en inglés." }),
      Object.freeze({ visual:"target", title:"Una misión breve cada día", body:"Practicarás con actividades elegidas para tu edad y tu nivel.", preview:"Tu primera misión", meta:"Actividades adaptadas", time:"7 min" }),
      Object.freeze({ visual:"route", title:"Verás cómo crece tu inglés", body:"Una calibración corta encontrará un buen comienzo y tu mundo irá reflejando lo que consigues." })
    ])}),
    p56:Object.freeze({ next:"Siguiente", finish:"Encontrar mi punto de partida", steps:Object.freeze([
      Object.freeze({ visual:"avatar", title:"Hola, {name}", body:"Tu ruta combinará tu edad, tu nivel de inglés y lo que vayas aprendiendo." }),
      Object.freeze({ visual:"target", title:"Una misión enfocada cada día", body:"Práctica breve, feedback útil y contenido que evoluciona contigo.", preview:"Starting mission", meta:"Práctica adaptada", time:"8 min" }),
      Object.freeze({ visual:"route", title:"Primero, una calibración breve", body:"Ajustaremos el punto de partida para que las misiones no sean ni demasiado fáciles ni demasiado difíciles." })
    ])}),
    eso:Object.freeze({ next:"Next", finish:"Find my starting point", steps:Object.freeze([
      Object.freeze({ visual:"avatar", title:"Hi, {name}", body:"Your route will combine your age, English level and real learning evidence." }),
      Object.freeze({ visual:"target", title:"Short, focused practice", body:"Clear sessions and useful feedback, without wasting your time.", preview:"Starting session", meta:"Adaptive practice", time:"10 min" }),
      Object.freeze({ visual:"route", title:"First, a short adaptive check", body:"We’ll find a starting point that is challenging enough without becoming frustrating." })
    ])}),
    neutral:Object.freeze({ next:"Siguiente", finish:"Encontrar mi punto de partida", steps:Object.freeze([
      Object.freeze({ visual:"avatar", title:"Hola, {name}", body:"Vamos a preparar una ruta clara para ti." }),
      Object.freeze({ visual:"target", title:"Una misión breve cada día", body:"Practicarás paso a paso con contenido adaptado.", preview:"Tu primera misión", meta:"Práctica adaptada", time:"5–8 min" }),
      Object.freeze({ visual:"route", title:"Empezamos por conocerte", body:"Una calibración corta nos ayudará a elegir un buen punto de partida." })
    ])})
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
  function practice(key, band, params) {
    const safeBand = normalizeBand(band); const value = PRACTICE[safeBand][key];
    if (value == null) { reportMissing("practice", key, safeBand); return ""; }
    return interpolate(value, params);
  }
  function practiceSkill(id, band) {
    const safeBand = normalizeBand(band);
    const young = { listening:"Escuchar", vocabulary:"Palabras", speaking:"Hablar", reading:"Leer", grammar:"Frases", writing:"Escribir" };
    return safeBand === "p12" && young[id] ? young[id] : skill(id, safeBand);
  }
  function placement(key, band, params) {
    const safeBand = normalizeBand(band); const value = PLACEMENT[safeBand][key];
    if (value == null) { reportMissing("placement", key, safeBand); return ""; }
    return interpolate(value, params);
  }
  function onboarding(band) {
    const entry = ONBOARDING[normalizeBand(band)];
    return Object.freeze({ next:entry.next, finish:entry.finish, steps:entry.steps });
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

  return { BANDS, LANGUAGE, COPY, SKILLS, MISSIONS, SUPPORT, PRACTICE, PLACEMENT, ONBOARDING, normalizeBand, text, skill, missionTitle, support, practice, practiceSkill, placement, onboarding, reward, view, has:key => BANDS.some(band => COPY[band][key] != null) };
});
