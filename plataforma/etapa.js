/* ============================================================
   Interlanguage · Adaptación por etapa
   Una arquitectura, dos capas:
   - banda pedagógica: p12 / p34 / p56 / eso / neutral
   - perfil de experiencia: primary-young / primary-upper / secondary / neutral
   ============================================================ */
(function (root, factory) {
  "use strict";
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = factory;
  else root.IL_ETAPA = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createAgeExperience(environment) {
  "use strict";

  const env = environment || {};
  const Copy = env.ILCopy || (typeof require === "function" ? require("./copy-registry.js") : null);
  const AgePolicy = env.ILAgePolicy || (typeof require === "function" ? require("./age-policy.js") : null);
  const MODES = ["primary-young", "primary-upper", "secondary", "neutral"];
  const BANDS = ["p12", "p34", "p56", "eso", "neutral"];
  const STORAGE_KEY = "il_demo_age_mode_v1";
  const MODE_FROM_BAND = { p12: "primary-young", p34: "primary-young", p56: "primary-upper", eso: "secondary", neutral:"neutral" };
  const DEMO_BAND = { "primary-young": "p34", "primary-upper": "p56", secondary: "eso", neutral:"neutral" };
  const DEMO_STAGES = [
    { band:"p12", label:"5–7 años" },
    { band:"p34", label:"8–9 años" },
    { band:"p56", label:"10–11 años" },
    { band:"eso", label:"ESO" }
  ];
  const MODE_ALIAS = {
    p12: "primary-young", p34: "primary-young", p56: "primary-upper", eso: "secondary", neutral:"neutral",
    primaria_inicial: "primary-young", primaria_superior: "primary-upper", primaria: "primary-upper"
  };

  const BAND_EXPERIENCE = AgePolicy.BANDS;

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
      themes: ["school life", "everyday situations", "grammar"]
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
      themes: ["school life", "friends", "everyday situations", "grammar"]
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
      themes: ["travel", "school life", "friends", "technology", "music", "everyday situations", "social situations", "future plans", "grammar"]
    },
    neutral: {
      id:"neutral", label:"Experiencia neutral", sessionLabel:"5–8 min", exerciseLimit:5,
      guide:"discreet", languageSupport:"spanish", celebration:"minimal",
      skillPriority:["listening", "vocabulary", "grammar", "reading", "writing", "speaking"],
      unitIds:[], themes:[]
    }
  };

  function withCopy(profile, band) { return Object.assign({}, profile, { copy:Copy ? Copy.view(band) : {} }); }
  let active = { mode:"neutral", band:"neutral", config:withCopy(PROFILES.neutral, "neutral"), exercise:BAND_EXPERIENCE.neutral };

  function reportInvalidBand(profile, reason) {
    const observer = env.ILObservability;
    if (observer && typeof observer.report === "function") observer.report("invalid_data", "age_band_unresolved", {
      area:"stage", operation:"resolve_band", status:reason || "missing_profile_age", profile_id:profile && profile.id
    });
  }

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
    if (explicitBand) reportInvalidBand(profile, "invalid_explicit_band");
    const explicitMode = normalMode(profile && (profile.age_mode || profile.ageMode));
    if (explicitMode) return DEMO_BAND[explicitMode];
    const age = ageFor(profile);
    if (age == null) { reportInvalidBand(profile, "missing_profile_age"); return "neutral"; }
    if (age <= 7) return "p12";
    if (age <= 9) return "p34";
    if (age <= 11) return "p56";
    return "eso";
  }
  function modeFor(profile) {
    const explicit = normalMode(profile && (profile.age_mode || profile.ageMode));
    return explicit || MODE_FROM_BAND[bandFor(profile)] || "neutral";
  }
  function config(mode) {
    const selectedMode = normalMode(mode) || active.mode;
    const profile = PROFILES[selectedMode] || PROFILES.neutral;
    const selectedBand = selectedMode === active.mode ? active.band : DEMO_BAND[selectedMode];
    return withCopy(profile, selectedBand);
  }
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
      const next = normalBand(event.target.value) || "neutral";
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
    const mode = overrideBand ? MODE_FROM_BAND[band] : (MODE_FROM_BAND[band] || "neutral");
    active = { mode, band, config:withCopy(PROFILES[mode] || PROFILES.neutral, band), exercise:BAND_EXPERIENCE[band] || BAND_EXPERIENCE.neutral };
    if (env.document && env.document.body) {
      env.document.body.dataset.ageMode = mode;
      env.document.body.dataset.stage = band;
      env.document.body.dataset.guide = (PROFILES[mode] || PROFILES.neutral).guide;
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
    exerciseConfig(band) { return BAND_EXPERIENCE[band] || BAND_EXPERIENCE.neutral; },
    current() { return active; },
    copy(value) { return config(value).copy; },
    mountDemoSelector,
    _storageKey: STORAGE_KEY
  };
});
