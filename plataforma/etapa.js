/* ============================================================
   Interlanguage · Adaptación por etapa
   Una arquitectura, dos capas:
   - banda pedagógica: p12 / p34 / p56 / eso
   - perfil de experiencia: primary-young / primary-upper / secondary
   ============================================================ */
(function (root, factory) {
  "use strict";
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = factory;
  else root.IL_ETAPA = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createAgeExperience(environment) {
  "use strict";

  const env = environment || {};
  const MODES = ["primary-young", "primary-upper", "secondary"];
  const BANDS = ["p12", "p34", "p56", "eso"];
  const STORAGE_KEY = "il_demo_age_mode_v1";
  const MODE_FROM_BAND = { p12: "primary-young", p34: "primary-young", p56: "primary-upper", eso: "secondary" };
  const DEMO_BAND = { "primary-young": "p34", "primary-upper": "p56", secondary: "eso" };
  const DEMO_STAGES = [
    { band:"p12", label:"5–7 años" },
    { band:"p34", label:"8–9 años" },
    { band:"p56", label:"10–11 años" },
    { band:"eso", label:"ESO" }
  ];
  const MODE_ALIAS = {
    p12: "primary-young", p34: "primary-young", p56: "primary-upper", eso: "secondary",
    primaria_inicial: "primary-young", primaria_superior: "primary-upper", primaria: "primary-upper"
  };

  const BAND_EXPERIENCE = Object.freeze({
    p12: Object.freeze({
      band: "p12", ageLabel: "5–7", instructionLanguage: "spanish", visualSupport: "required",
      guideIntensity: "high", celebrationIntensity: "high", touchSize: 56, maxVisibleOptions: 3,
      sessionSize: 4, hintLabel: "Una pista", listenLabel: "Escuchar"
    }),
    p34: Object.freeze({
      band: "p34", ageLabel: "8–9", instructionLanguage: "bilingual", visualSupport: "preferred",
      guideIntensity: "medium", celebrationIntensity: "medium", touchSize: 52, maxVisibleOptions: 4,
      sessionSize: 5, hintLabel: "Pista", listenLabel: "Listen"
    }),
    p56: Object.freeze({
      band: "p56", ageLabel: "10–11", instructionLanguage: "mixed", visualSupport: "optional",
      guideIntensity: "low", celebrationIntensity: "balanced", touchSize: 48, maxVisibleOptions: 4,
      sessionSize: 6, hintLabel: "Ver pista", listenLabel: "Listen"
    }),
    eso: Object.freeze({
      band: "eso", ageLabel: "12+", instructionLanguage: "english", visualSupport: "content-only",
      guideIntensity: "none", celebrationIntensity: "minimal", touchSize: 44, maxVisibleOptions: 5,
      sessionSize: 7, hintLabel: "Show hint", listenLabel: "Listen"
    })
  });

  const PROFILES = {
    "primary-young": {
      id: "primary-young",
      label: "Primaria inicial",
      sessionLabel: "5–7 min",
      exerciseLimit: 5,
      guide: "visible",
      languageSupport: "spanish",
      celebration: "frequent",
      skillPriority: ["listening", "vocabulary", "speaking", "grammar", "reading"],
      unitIds: ["primer-vuelo", "la-comida", "gramatica-inicial"],
      themes: ["school life", "everyday situations", "grammar"],
      copy: {
        greeting: name => "¡Hola, " + name + "!",
        ready: "Tu misión de hoy está lista.",
        active: "Sigue desde donde lo dejaste.",
        complete: "¡Misión lista!",
        comeback: "¡Qué bien verte! Empezamos con algo sencillo.",
        missionEyebrow: "TU MISIÓN DE HOY",
        startCta: "Empezar",
        continueCta: "Seguir",
        reviewCta: "Repasar",
        completedCta: "¡Hecho!",
        exercise: "Actividad",
        countJoin: "de",
        pace: "Una actividad cada vez",
        summaryTitle: "¡Misión completada!",
        summaryLead: "¡Buen trabajo!"
      }
    },
    "primary-upper": {
      id: "primary-upper",
      label: "Primaria superior",
      sessionLabel: "7–10 min",
      exerciseLimit: 6,
      guide: "discreet",
      languageSupport: "mixed",
      celebration: "balanced",
      skillPriority: ["vocabulary", "listening", "grammar", "reading", "writing", "speaking"],
      unitIds: ["rutina-diaria", "la-comida", "gramatica-media"],
      themes: ["school life", "friends", "everyday situations", "grammar"],
      copy: {
        greeting: name => "¡Hola, " + name + "!",
        ready: "Tu misión de hoy está preparada.",
        active: "Tu misión está en marcha. Continúa donde la dejaste.",
        complete: "Misión completada. Hoy has avanzado.",
        comeback: "Qué bien verte. Retomamos con una misión breve.",
        missionEyebrow: "TU MISIÓN DE HOY",
        startCta: "Empezar",
        continueCta: "Continuar",
        reviewCta: "Repasar errores",
        completedCta: "Misión completada",
        exercise: "Ejercicio",
        countJoin: "de",
        pace: "Una actividad cada vez",
        summaryTitle: "¡Misión completada!",
        summaryLead: "Has avanzado un poco más en tu inglés."
      }
    },
    secondary: {
      id: "secondary",
      label: "ESO",
      sessionLabel: "8–12 min",
      exerciseLimit: 7,
      guide: "hidden",
      languageSupport: "english",
      celebration: "minimal",
      skillPriority: ["listening", "reading", "grammar", "writing", "vocabulary", "speaking"],
      unitIds: ["future-plans", "gramatica-eso"],
      themes: ["travel", "school life", "friends", "technology", "music", "everyday situations", "social situations", "future plans", "grammar"],
      copy: {
        greeting: name => "Hola, " + name,
        ready: "Tu sesión de hoy está preparada.",
        active: "Continúa tu sesión desde el último ejercicio.",
        complete: "Sesión completada. Objetivo de hoy conseguido.",
        comeback: "Bienvenido de nuevo. Retoma con una sesión breve.",
        missionEyebrow: "TODAY’S SESSION",
        startCta: "Start session",
        continueCta: "Continue",
        reviewCta: "Review mistakes",
        completedCta: "Session complete",
        exercise: "Exercise",
        countJoin: "of",
        pace: "One step at a time",
        summaryTitle: "Session complete",
        summaryLead: "You’ve completed today’s session and strengthened your English."
      }
    }
  };

  let active = { mode: "primary-upper", band: "p56", config: PROFILES["primary-upper"], exercise: BAND_EXPERIENCE.p56 };

  function year() { return (env.Date || Date).now ? new (env.Date || Date)().getFullYear() : new Date().getFullYear(); }
  function normalMode(value) {
    const candidate = MODE_ALIAS[value] || value;
    return MODES.indexOf(candidate) !== -1 ? candidate : null;
  }
  function normalBand(value) {
    if (BANDS.indexOf(value) !== -1) return value;
    const mode = normalMode(value);
    return mode ? DEMO_BAND[mode] : null;
  }
  function ageFor(profile) {
    if (profile && Number.isFinite(Number(profile.age))) return Number(profile.age);
    const birthYear = profile && Number(profile.birth_year);
    return birthYear ? year() - birthYear : null;
  }
  function bandFor(profile) {
    const explicitBand = profile && profile.stage;
    if (BANDS.indexOf(explicitBand) !== -1) return explicitBand;
    const explicitMode = normalMode(profile && (profile.age_mode || profile.ageMode));
    if (explicitMode) return DEMO_BAND[explicitMode];
    const age = ageFor(profile);
    if (age == null) return "p56";
    if (age <= 7) return "p12";
    if (age <= 9) return "p34";
    if (age <= 11) return "p56";
    return "eso";
  }
  function modeFor(profile) {
    const explicit = normalMode(profile && (profile.age_mode || profile.ageMode));
    return explicit || MODE_FROM_BAND[bandFor(profile)] || "primary-upper";
  }
  function config(mode) { return PROFILES[normalMode(mode) || active.mode] || PROFILES["primary-upper"]; }
  function safeStorage(storage, action, key, value) {
    try { return storage && typeof storage[action] === "function" ? storage[action](key, value) : null; }
    catch (error) { return null; }
  }
  function queryBand() {
    try {
      const params = new URLSearchParams((env.location && env.location.search) || "");
      return normalBand(params.get("ageMode") || params.get("etapa"));
    } catch (error) { return null; }
  }
  function demoMode() {
    const selectedBand = queryBand() || normalBand(safeStorage(env.sessionStorage, "getItem", STORAGE_KEY));
    return selectedBand ? MODE_FROM_BAND[selectedBand] : null;
  }
  function isDemo(options) {
    if (options && typeof options.demo === "boolean") return options.demo;
    return !!(env.ILAuth && typeof env.ILAuth.isDemo === "function" && env.ILAuth.isDemo());
  }
  function demoToolsEnabled(options) {
    if (!isDemo(options)) return false;
    if (options && typeof options.demo === "boolean") return options.demo;
    const host = String((env.location && env.location.hostname) || "");
    if (host === "localhost" || host === "127.0.0.1" || host === "" || host.endsWith(".local")) return true;
    // Enlaces de preview (?demo=1) en un dominio real: mostrar el selector de etapa
    // para poder enseñar cómo queda cada edad. En producción real (con claves) isDemo es false.
    return !!(env.ILAuth && typeof env.ILAuth.isDemoForced === "function" && env.ILAuth.isDemoForced());
  }

  function clearDemoMission(profile) {
    const username = String((profile && profile.username) || "");
    if (!username) return;
    safeStorage(env.localStorage, "removeItem", "il_session_" + username);
    safeStorage(env.localStorage, "removeItem", "il_mission_state_v1_" + encodeURIComponent(username.trim().toLowerCase()));
  }

  function mountDemoSelector(profile, demo) {
    const document = env.document;
    if (!document || !document.body) return null;
    const existing = document.getElementById("ilAgeModeSwitcher");
    if (!demo) { if (existing) existing.remove(); return null; }
    if (existing) {
      const select = existing.querySelector("select");
      if (select) select.value = active.band;
      return existing;
    }
    const wrapper = document.createElement("div");
    wrapper.id = "ilAgeModeSwitcher";
    wrapper.className = "age-mode-switcher";
    wrapper.setAttribute("role", "group");
    wrapper.setAttribute("aria-label", "Vista de etapa en modo demo");
    const label = document.createElement("label");
    label.htmlFor = "ilAgeModeSelect";
    label.textContent = "Vista demo";
    const select = document.createElement("select");
    select.id = "ilAgeModeSelect";
    select.setAttribute("aria-label", "Probar interfaz por etapa");
    DEMO_STAGES.forEach(stage => {
      const option = document.createElement("option");
      option.value = stage.band;
      option.textContent = stage.label;
      select.appendChild(option);
    });
    select.value = active.band;
    select.addEventListener("change", event => {
      const next = normalBand(event.target.value) || "p56";
      safeStorage(env.sessionStorage, "setItem", STORAGE_KEY, next);
      clearDemoMission(profile);
      if (env.location && env.location.href && typeof env.location.assign === "function") {
        const target = new URL(env.location.href);
        target.searchParams.set("ageMode", next);
        target.searchParams.delete("etapa");
        env.location.assign(target.toString());
      } else if (env.location && typeof env.location.reload === "function") env.location.reload();
    });
    wrapper.append(label, select);
    document.body.appendChild(wrapper);
    return wrapper;
  }

  function apply(profile, options) {
    const demo = demoToolsEnabled(options);
    const requested = demo ? queryBand() : null;
    const stored = demo ? normalBand(safeStorage(env.sessionStorage, "getItem", STORAGE_KEY)) : null;
    if (requested && requested !== stored) {
      safeStorage(env.sessionStorage, "setItem", STORAGE_KEY, requested);
      clearDemoMission(profile);
    }
    const overrideBand = demo ? (requested || stored || normalBand(demoMode())) : null;
    const band = overrideBand || bandFor(profile);
    const mode = overrideBand ? MODE_FROM_BAND[band] : modeFor(profile);
    active = { mode, band, config: PROFILES[mode], exercise: BAND_EXPERIENCE[band] || BAND_EXPERIENCE.p56 };
    if (env.document && env.document.body) {
      env.document.body.dataset.ageMode = mode;
      env.document.body.dataset.stage = band;
      env.document.body.dataset.guide = PROFILES[mode].guide;
    }
    mountDemoSelector(profile, demo);
    return band;
  }

  return {
    MODES,
    STAGES: BANDS,
    PROFILES,
    DEMO_STAGES,
    BAND_EXPERIENCE,
    apply,
    bandFor,
    modeFor,
    config,
    exerciseConfig(band) { return BAND_EXPERIENCE[band] || BAND_EXPERIENCE.p56; },
    current() { return active; },
    copy(value) { return config(value).copy; },
    mountDemoSelector,
    _storageKey: STORAGE_KEY
  };
});
