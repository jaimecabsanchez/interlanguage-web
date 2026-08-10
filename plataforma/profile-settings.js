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

  const VERSION = 1;
  const PREFIX = "il_profile_settings_v1_";
  const ACTIVE_KEY = "il_profile_settings_active_v1";
  const DEFAULTS = Object.freeze({
    sound: true,
    autoplayAudio: true,
    audioSpeed: 0.9,
    dailyGoal: 8,
    reduceMotion: false,
    textSize: "normal",
    avatarTheme: "navy",
    avatarSkin: "tone-2",
    avatarHair: "short",
    avatarHairColor: "dark",
    accessory: "hat",
    background: "school",
    featuredStamp: ""
  });
  const VALID = {
    audioSpeed: [0.75, 0.9, 1],
    dailyGoal: [5, 8, 10, 15],
    textSize: ["normal", "large"],
    avatarTheme: ["navy", "coral", "aqua"],
    avatarSkin: ["tone-1", "tone-2", "tone-3", "tone-4"],
    avatarHair: ["short", "waves", "curls", "long"],
    avatarHairColor: ["dark", "brown", "gold", "copper"],
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
  function sanitize(value) {
    value = value || {};
    return {
      version: VERSION,
      sound: typeof value.sound === "boolean" ? value.sound : DEFAULTS.sound,
      autoplayAudio: typeof value.autoplayAudio === "boolean" ? value.autoplayAudio : DEFAULTS.autoplayAudio,
      audioSpeed: allowed(Number(value.audioSpeed), VALID.audioSpeed, DEFAULTS.audioSpeed),
      dailyGoal: allowed(Number(value.dailyGoal), VALID.dailyGoal, DEFAULTS.dailyGoal),
      reduceMotion: typeof value.reduceMotion === "boolean" ? value.reduceMotion : DEFAULTS.reduceMotion,
      textSize: allowed(value.textSize, VALID.textSize, DEFAULTS.textSize),
      avatarTheme: allowed(value.avatarTheme, VALID.avatarTheme, DEFAULTS.avatarTheme),
      avatarSkin: allowed(value.avatarSkin, VALID.avatarSkin, DEFAULTS.avatarSkin),
      avatarHair: allowed(value.avatarHair, VALID.avatarHair, DEFAULTS.avatarHair),
      avatarHairColor: allowed(value.avatarHairColor, VALID.avatarHairColor, DEFAULTS.avatarHairColor),
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
    if (!stored) { const legacy = legacyTheme(); if (legacy) settings.avatarTheme = legacy; }
    return settings;
  }
  function setActive(username, settings) {
    const active = { username: String(username || ""), settings: sanitize(settings || load(username)) };
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

  return { VERSION, DEFAULTS, VALID, load, save, setActive, getActive, clearActive, apply, sanitize, _keys: { usernameKey, ACTIVE_KEY } };
});
