/* ============================================================
   Interlanguage HOME · preferencias locales del alumno
   Persistencia versionada por username. No sustituye al backend.
   ============================================================ */
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory;
  else {
    root.ILProfileSettings = factory(root.localStorage);
    root.ILProfileSettings.apply(root.ILProfileSettings.getActive());
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createProfileSettings(storage) {
  "use strict";

  const VERSION = 6;
  const PREFIX = "il_profile_settings_v1_";
  const ACTIVE_KEY = "il_profile_settings_active_v1";
  const DEFAULTS = Object.freeze({
    sound: true,
    autoplayAudio: true,
    audioSpeed: 0.9,
    voiceName: "",
    dailyGoal: 8,
    reduceMotion: false,
    textSize: "normal",
    avatarTheme: "navy",
    avatarBase: "masculine",
    avatarCustomised: false,
    avatarRigVersion: 2,
    avatarSkin: "tone-2",
    avatarHair: "original",
    avatarHairColor: "brown",
    avatarExpression: "smile",
    avatarFaceShape: "oval",
    avatarFaceWidth: 2,
    avatarEyeShape: "almond",
    avatarEyeColor: "brown",
    avatarEyeSize: 2,
    avatarBrowShape: "soft",
    avatarNoseShape: "soft",
    avatarNoseLength: 2,
    avatarMouthShape: "smile",
    avatarTop: "tee",
    avatarAccessory: "none",
    avatarFaceLength: 2,
    avatarCheekVolume: 2,
    avatarJawWidth: 2,
    avatarHairLength: 2,
    avatarHairVolume: 2,
    avatarEyeSpacing: 2,
    avatarEyeHeight: 2,
    avatarBrowThickness: 2,
    avatarBrowArch: 2,
    avatarBrowSpacing: 2,
    avatarNoseWidth: 2,
    avatarNoseHeight: 2,
    avatarMouthWidth: 2,
    avatarMouthCurve: 2,
    avatarMouthHeight: 2,
    avatarOutfitColor: "green",
    avatarAccessorySize: 2,
    avatarAccessoryHeight: 2,
    avatarLook: "look-01",
    worldBackground: "day",
    worldCompanion: "none",
    activeWorldItems: ["world-flowers", "world-bench", "world-plant", "world-travel-board"],
    seenUnlocks: [],
    accessory: "hat",
    background: "school",
    featuredStamp: ""
  });
  const SLIDER = [0, 1, 2, 3, 4];
  const VALID = {
    audioSpeed: [0.75, 0.9, 1],
    dailyGoal: [5, 8, 10, 15],
    textSize: ["normal", "large"],
    avatarTheme: ["navy", "coral", "aqua"],
    avatarBase: ["masculine", "feminine"],
    avatarSkin: ["tone-1", "tone-5", "tone-2", "tone-6", "tone-3", "tone-7", "tone-4", "tone-8"],
    avatarHair: ["original", "short", "waves", "curls", "long", "bob", "coils", "fade", "braids"],
    avatarHairColor: ["dark", "brown", "gold", "copper", "ash", "red"],
    avatarExpression: ["smile", "calm", "bright"],
    avatarFaceShape: ["oval", "round", "soft", "angular"],
    avatarFaceWidth: [0, 1, 2, 3, 4],
    avatarEyeShape: ["almond", "round", "soft", "bright"],
    avatarEyeColor: ["brown", "hazel", "green", "blue", "grey"],
    avatarEyeSize: [0, 1, 2, 3, 4],
    avatarBrowShape: ["soft", "straight", "arched", "bold"],
    avatarNoseShape: ["soft", "round", "button", "defined"],
    avatarNoseLength: [0, 1, 2, 3, 4],
    avatarMouthShape: ["smile", "soft", "wide", "calm"],
    avatarTop: ["tee", "hoodie", "sweater", "shirt", "school", "sport", "jacket"],
    avatarAccessory: ["none", "cap", "headphones", "glasses", "backpack", "scarf", "badge"],
    avatarFaceLength: SLIDER,
    avatarCheekVolume: SLIDER,
    avatarJawWidth: SLIDER,
    avatarHairLength: SLIDER,
    avatarHairVolume: SLIDER,
    avatarEyeSpacing: SLIDER,
    avatarEyeHeight: SLIDER,
    avatarBrowThickness: SLIDER,
    avatarBrowArch: SLIDER,
    avatarBrowSpacing: SLIDER,
    avatarNoseWidth: SLIDER,
    avatarNoseHeight: SLIDER,
    avatarMouthWidth: SLIDER,
    avatarMouthCurve: SLIDER,
    avatarMouthHeight: SLIDER,
    avatarOutfitColor: ["green", "coral", "navy", "aqua"],
    avatarAccessorySize: SLIDER,
    avatarAccessoryHeight: SLIDER,
    worldBackground: ["day", "sunset", "city", "night"],
    worldCompanion: ["none", "pet-nube", "pet-brisa", "pet-menta"],
    activeWorldItems: ["world-flowers", "world-bench", "world-toy-plane", "world-ball", "world-pond", "world-bicycle", "world-lanterns", "world-greenhouse", "world-travel-board", "world-tech-desk", "world-music-poster", "world-plant"],
    accessory: ["hat", "headphones", "backpack"],
    background: ["school", "city", "space"]
  };

  function usernameKey(username) {
    return PREFIX + encodeURIComponent(String(username || "guest").trim().toLowerCase());
  }
  function read(key, fallback) {
    try { const value = JSON.parse(storage.getItem(key)); return value == null ? fallback : value; }
    catch (error) { return fallback; }
  }
  function write(key, value) {
    try { storage.setItem(key, JSON.stringify(value)); return true; }
    catch (error) { return false; }
  }
  function allowed(value, values, fallback) { return values.indexOf(value) !== -1 ? value : fallback; }
  function allowedList(value, values, fallback, limit) {
    if (!Array.isArray(value)) return fallback.slice();
    return Array.from(new Set(value.filter(item => values.indexOf(item) !== -1))).slice(0, limit || values.length);
  }
  function safeIds(value) {
    if (!Array.isArray(value)) return [];
    return Array.from(new Set(value.filter(item => typeof item === "string" && /^[a-z0-9_-]{1,64}$/i.test(item)))).slice(0, 160);
  }
  function sanitize(value) {
    value = value || {};
    return {
      version: VERSION,
      sound: typeof value.sound === "boolean" ? value.sound : DEFAULTS.sound,
      autoplayAudio: typeof value.autoplayAudio === "boolean" ? value.autoplayAudio : DEFAULTS.autoplayAudio,
      audioSpeed: allowed(Number(value.audioSpeed), VALID.audioSpeed, DEFAULTS.audioSpeed),
      voiceName: typeof value.voiceName === "string" ? value.voiceName.slice(0, 80) : DEFAULTS.voiceName,
      dailyGoal: allowed(Number(value.dailyGoal), VALID.dailyGoal, DEFAULTS.dailyGoal),
      reduceMotion: typeof value.reduceMotion === "boolean" ? value.reduceMotion : DEFAULTS.reduceMotion,
      textSize: allowed(value.textSize, VALID.textSize, DEFAULTS.textSize),
      avatarTheme: allowed(value.avatarTheme, VALID.avatarTheme, DEFAULTS.avatarTheme),
      avatarBase: allowed(value.avatarBase, VALID.avatarBase, DEFAULTS.avatarBase),
      avatarCustomised: typeof value.avatarCustomised === "boolean" ? value.avatarCustomised : DEFAULTS.avatarCustomised,
      avatarRigVersion: Number(value.avatarRigVersion) === 2 ? 2 : DEFAULTS.avatarRigVersion,
      avatarSkin: allowed(value.avatarSkin, VALID.avatarSkin, DEFAULTS.avatarSkin),
      avatarHair: allowed(value.avatarHair, VALID.avatarHair, DEFAULTS.avatarHair),
      avatarHairColor: allowed(value.avatarHairColor, VALID.avatarHairColor, DEFAULTS.avatarHairColor),
      avatarExpression: allowed(value.avatarExpression, VALID.avatarExpression, DEFAULTS.avatarExpression),
      avatarFaceShape: allowed(value.avatarFaceShape, VALID.avatarFaceShape, DEFAULTS.avatarFaceShape),
      avatarFaceWidth: allowed(Number(value.avatarFaceWidth), VALID.avatarFaceWidth, DEFAULTS.avatarFaceWidth),
      avatarEyeShape: allowed(value.avatarEyeShape, VALID.avatarEyeShape, DEFAULTS.avatarEyeShape),
      avatarEyeColor: allowed(value.avatarEyeColor, VALID.avatarEyeColor, DEFAULTS.avatarEyeColor),
      avatarEyeSize: allowed(Number(value.avatarEyeSize), VALID.avatarEyeSize, DEFAULTS.avatarEyeSize),
      avatarBrowShape: allowed(value.avatarBrowShape, VALID.avatarBrowShape, DEFAULTS.avatarBrowShape),
      avatarNoseShape: allowed(value.avatarNoseShape, VALID.avatarNoseShape, DEFAULTS.avatarNoseShape),
      avatarNoseLength: allowed(Number(value.avatarNoseLength), VALID.avatarNoseLength, DEFAULTS.avatarNoseLength),
      avatarMouthShape: allowed(value.avatarMouthShape, VALID.avatarMouthShape, value.avatarExpression === "calm" ? "calm" : value.avatarExpression === "bright" ? "wide" : DEFAULTS.avatarMouthShape),
      avatarTop: allowed(value.avatarTop, VALID.avatarTop, DEFAULTS.avatarTop),
      avatarAccessory: allowed(value.avatarAccessory, VALID.avatarAccessory, DEFAULTS.avatarAccessory),
      avatarFaceLength: allowed(Number(value.avatarFaceLength), VALID.avatarFaceLength, DEFAULTS.avatarFaceLength),
      avatarCheekVolume: allowed(Number(value.avatarCheekVolume), VALID.avatarCheekVolume, DEFAULTS.avatarCheekVolume),
      avatarJawWidth: allowed(Number(value.avatarJawWidth), VALID.avatarJawWidth, DEFAULTS.avatarJawWidth),
      avatarHairLength: allowed(Number(value.avatarHairLength), VALID.avatarHairLength, DEFAULTS.avatarHairLength),
      avatarHairVolume: allowed(Number(value.avatarHairVolume), VALID.avatarHairVolume, DEFAULTS.avatarHairVolume),
      avatarEyeSpacing: allowed(Number(value.avatarEyeSpacing), VALID.avatarEyeSpacing, DEFAULTS.avatarEyeSpacing),
      avatarEyeHeight: allowed(Number(value.avatarEyeHeight), VALID.avatarEyeHeight, DEFAULTS.avatarEyeHeight),
      avatarBrowThickness: allowed(Number(value.avatarBrowThickness), VALID.avatarBrowThickness, DEFAULTS.avatarBrowThickness),
      avatarBrowArch: allowed(Number(value.avatarBrowArch), VALID.avatarBrowArch, DEFAULTS.avatarBrowArch),
      avatarBrowSpacing: allowed(Number(value.avatarBrowSpacing), VALID.avatarBrowSpacing, DEFAULTS.avatarBrowSpacing),
      avatarNoseWidth: allowed(Number(value.avatarNoseWidth), VALID.avatarNoseWidth, DEFAULTS.avatarNoseWidth),
      avatarNoseHeight: allowed(Number(value.avatarNoseHeight), VALID.avatarNoseHeight, DEFAULTS.avatarNoseHeight),
      avatarMouthWidth: allowed(Number(value.avatarMouthWidth), VALID.avatarMouthWidth, DEFAULTS.avatarMouthWidth),
      avatarMouthCurve: allowed(Number(value.avatarMouthCurve), VALID.avatarMouthCurve, DEFAULTS.avatarMouthCurve),
      avatarMouthHeight: allowed(Number(value.avatarMouthHeight), VALID.avatarMouthHeight, DEFAULTS.avatarMouthHeight),
      avatarOutfitColor: allowed(value.avatarOutfitColor, VALID.avatarOutfitColor, DEFAULTS.avatarOutfitColor),
      avatarAccessorySize: allowed(Number(value.avatarAccessorySize), VALID.avatarAccessorySize, DEFAULTS.avatarAccessorySize),
      avatarAccessoryHeight: allowed(Number(value.avatarAccessoryHeight), VALID.avatarAccessoryHeight, DEFAULTS.avatarAccessoryHeight),
      avatarLook: /^look-0[1-9]$/.test(value.avatarLook) ? value.avatarLook : (value.avatarLook === "" ? "" : DEFAULTS.avatarLook),
      worldBackground: allowed(value.worldBackground, VALID.worldBackground, DEFAULTS.worldBackground),
      worldCompanion: allowed(value.worldCompanion, VALID.worldCompanion, DEFAULTS.worldCompanion),
      activeWorldItems: allowedList(value.activeWorldItems, VALID.activeWorldItems, DEFAULTS.activeWorldItems, 8),
      seenUnlocks: safeIds(value.seenUnlocks),
      accessory: allowed(value.accessory, VALID.accessory, DEFAULTS.accessory),
      background: allowed(value.background, VALID.background, DEFAULTS.background),
      featuredStamp: typeof value.featuredStamp === "string" ? value.featuredStamp.slice(0, 64) : ""
    };
  }
  function legacyTheme() {
    try {
      const value = storage.getItem("il_avatar_color");
      return VALID.avatarTheme.indexOf(value) !== -1 ? value : null;
    } catch (error) { return null; }
  }
  function load(username) {
    const stored = read(usernameKey(username), null);
    const settings = sanitize(stored || {});
    if (stored && Number(stored.version || 0) < VERSION) {
      settings.avatarCustomised = settings.avatarSkin !== DEFAULTS.avatarSkin
        || settings.avatarHairColor !== DEFAULTS.avatarHairColor
        || settings.avatarEyeColor !== DEFAULTS.avatarEyeColor
        || settings.avatarOutfitColor !== DEFAULTS.avatarOutfitColor;
      settings.avatarRigVersion = 2;
      settings.avatarHair = "original";
      settings.avatarTop = DEFAULTS.avatarTop;
      settings.avatarAccessory = DEFAULTS.avatarAccessory;
      [
        "avatarFaceWidth", "avatarFaceLength", "avatarCheekVolume", "avatarJawWidth",
        "avatarHairLength", "avatarHairVolume", "avatarEyeSize", "avatarEyeSpacing",
        "avatarEyeHeight", "avatarBrowThickness", "avatarBrowArch", "avatarBrowSpacing",
        "avatarNoseWidth", "avatarNoseLength", "avatarNoseHeight", "avatarMouthWidth",
        "avatarMouthCurve", "avatarMouthHeight", "avatarAccessorySize", "avatarAccessoryHeight"
      ].forEach(key => { settings[key] = DEFAULTS[key]; });
    }
    if (!stored) { const legacy = legacyTheme(); if (legacy) settings.avatarTheme = legacy; }
    return settings;
  }
  function avatarBaseForSex(sex, fallback) {
    if (sex === "female") return "feminine";
    if (sex === "male") return "masculine";
    return allowed(fallback, VALID.avatarBase, DEFAULTS.avatarBase);
  }
  function setActive(username, settings, sex) {
    if (typeof settings === "string") { sex = settings; settings = null; }
    let next = sanitize(settings || load(username));
    if (sex === "female" || sex === "male") {
      const assignedBase = avatarBaseForSex(sex, next.avatarBase);
      next = sanitize(Object.assign({}, next, { avatarBase:assignedBase, avatarCustomised:assignedBase === next.avatarBase ? next.avatarCustomised : false }));
      write(usernameKey(username), next);
    }
    const active = { username: String(username || ""), settings: next };
    write(ACTIVE_KEY, active); apply(active.settings); return active.settings;
  }
  function save(username, patch) {
    const next = sanitize(Object.assign({}, load(username), patch || {}));
    write(usernameKey(username), next); setActive(username, next); return next;
  }
  function getActive() {
    const active = read(ACTIVE_KEY, null);
    return active && active.settings ? sanitize(active.settings) : sanitize(DEFAULTS);
  }
  function clearActive() {
    try { storage.removeItem(ACTIVE_KEY); } catch (error) {}
  }
  function apply(settings, doc) {
    settings = sanitize(settings || DEFAULTS);
    doc = doc || (typeof document !== "undefined" ? document : null);
    if (!doc || !doc.documentElement) return settings;
    doc.documentElement.dataset.ilTextSize = settings.textSize;
    doc.documentElement.dataset.ilReduceMotion = settings.reduceMotion ? "true" : "false";
    return settings;
  }

  return { VERSION, DEFAULTS, VALID, load, save, setActive, getActive, clearActive, apply, sanitize, avatarBaseForSex, _keys: { usernameKey, ACTIVE_KEY } };
});
