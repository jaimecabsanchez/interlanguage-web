/* ============================================================
   Interlanguage HOME · avatar no destructivo por deltas locales
   El máster nunca se sustituye. Cada capa altera una sola región.
   ============================================================ */
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ILAvatarRig = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const ASSET_ROOT = "assets/avatar/deltas/";
  const RANGE_KEYS = [
    "avatarFaceWidth", "avatarFaceLength", "avatarCheekVolume", "avatarJawWidth",
    "avatarHairLength", "avatarHairVolume", "avatarEyeSize", "avatarEyeSpacing",
    "avatarEyeHeight", "avatarBrowThickness", "avatarBrowArch", "avatarBrowSpacing",
    "avatarNoseWidth", "avatarNoseLength", "avatarNoseHeight", "avatarMouthWidth",
    "avatarMouthCurve", "avatarMouthHeight", "avatarAccessorySize", "avatarAccessoryHeight"
  ];

  const FILTERS = Object.freeze({
    skin: {
      "tone-1":"brightness(1.12) saturate(.82)", "tone-5":"brightness(1.04) saturate(.9)",
      "tone-2":"none", "tone-6":"brightness(.92) saturate(1.04)",
      "tone-3":"brightness(.79) saturate(1.07)", "tone-7":"brightness(.69) saturate(1.09)",
      "tone-4":"brightness(.59) saturate(1.11)", "tone-8":"brightness(.5) saturate(1.13)"
    },
    hair: {
      dark:"brightness(.5) saturate(.76)", brown:"none",
      red:"sepia(.42) saturate(1.42) hue-rotate(326deg) brightness(.86)",
      copper:"sepia(.4) saturate(1.5) hue-rotate(337deg) brightness(1.06)",
      gold:"sepia(.62) saturate(1.3) brightness(1.3)", ash:"saturate(.35) brightness(1.18)"
    },
    iris: {
      brown:"none", hazel:"sepia(.3) saturate(1.3) brightness(1.14)",
      green:"hue-rotate(72deg) saturate(.88) brightness(.96)",
      blue:"hue-rotate(158deg) saturate(1.05) brightness(1.08)",
      grey:"saturate(.12) brightness(1.22)"
    },
    outfit: {
      green:"none", aqua:"hue-rotate(34deg) saturate(.86) brightness(1.1)",
      coral:"hue-rotate(236deg) saturate(1.15) brightness(1.09)",
      navy:"hue-rotate(105deg) saturate(1.24) brightness(.72)"
    }
  });

  const ORIGINAL = Object.freeze({
    skin:"tone-2", hair:"brown", iris:"brown", outfit:"green"
  });

  function clamp(value, min, max) { return Math.max(min, Math.min(max, Number(value))); }
  function normal(settings, key) {
    const current = settings && settings[key] == null ? 2 : clamp(settings[key], 0, 4);
    return (current - 2) / 2;
  }
  function filter(group, value) {
    return FILTERS[group][value] || FILTERS[group][ORIGINAL[group]] || "none";
  }
  function classes(base, options) {
    return "il-student-avatar il-avatar-delta avatar-base--" + base
      + (options.compact ? " is-compact" : "")
      + (options.portrait ? " is-portrait" : "");
  }
  function delta(base, name, filterValue) {
    return '<img class="avatar-delta__layer avatar-delta__layer--'+name+'" src="'+ASSET_ROOT+base+'/'+name+'.png" alt="" draggable="false" decoding="async" style="filter:'+filterValue+'">';
  }
  function layersFor(settings) {
    if (settings.avatarCustomised === false) return [];
    const layers = [];
    if ((settings.avatarSkin || ORIGINAL.skin) !== ORIGINAL.skin) layers.push(["skin", filter("skin", settings.avatarSkin)]);
    if ((settings.avatarHairColor || ORIGINAL.hair) !== ORIGINAL.hair) layers.push(["hair", filter("hair", settings.avatarHairColor)]);
    if ((settings.avatarEyeColor || ORIGINAL.iris) !== ORIGINAL.iris) layers.push(["iris", filter("iris", settings.avatarEyeColor)]);
    if ((settings.avatarOutfitColor || ORIGINAL.outfit) !== ORIGINAL.outfit) layers.push(["outfit", filter("outfit", settings.avatarOutfitColor)]);
    return layers;
  }

  function render(settings, options) {
    settings = settings || {}; options = options || {};
    const base = settings.avatarBase === "feminine" ? "feminine" : "masculine";
    const master = base === "feminine" ? "look-05" : "look-01";
    const layers = layersFor(settings);
    let html = '<span class="'+classes(base, options)+'" role="img" aria-label="Avatar personalizado">';
    html += '<img class="avatar-delta__master" src="assets/avatar/'+master+'.png" alt="" draggable="false" decoding="async">';
    layers.forEach(layer => { html += delta(base, layer[0], layer[1]); });
    html += '</span>';
    return html;
  }

  function sanitizePatch(patch) {
    const clean = {};
    RANGE_KEYS.forEach(key => {
      if (patch && Object.prototype.hasOwnProperty.call(patch, key)) clean[key] = clamp(patch[key], 0, 4);
    });
    return clean;
  }

  return { RANGE_KEYS, FILTERS, ORIGINAL, render, layersFor, sanitizePatch, normal };
});
