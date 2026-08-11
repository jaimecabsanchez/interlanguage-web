/* ============================================================
   Interlanguage HOME · rig 2D paramétrico del avatar ilustrado
   Las bases se asignan desde el perfil; este módulo solo ajusta rasgos.
   ============================================================ */
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ILAvatarRig = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const ASSET_ROOT = "assets/avatar/rig/";
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
      "tone-3":"brightness(.78) saturate(1.08)", "tone-7":"brightness(.68) saturate(1.1)",
      "tone-4":"brightness(.58) saturate(1.12)", "tone-8":"brightness(.48) saturate(1.14)"
    },
    hair: {
      dark:"brightness(.52) saturate(.8)", brown:"none", gold:"sepia(.55) saturate(1.28) brightness(1.25)",
      copper:"sepia(.35) saturate(1.45) hue-rotate(325deg) brightness(1.04)",
      ash:"saturate(.38) brightness(1.15)", red:"sepia(.4) saturate(1.35) hue-rotate(330deg) brightness(.82)"
    },
    eye: {
      brown:"none", hazel:"sepia(.28) saturate(1.25) brightness(1.14)",
      green:"hue-rotate(72deg) saturate(.8) brightness(.92)", blue:"hue-rotate(155deg) saturate(.95) brightness(1.02)",
      grey:"saturate(.18) brightness(1.12)"
    },
    outfit: {
      green:"none", coral:"hue-rotate(235deg) saturate(1.15) brightness(1.08)",
      navy:"hue-rotate(105deg) saturate(1.22) brightness(.72)", aqua:"hue-rotate(35deg) saturate(.84) brightness(1.12)"
    }
  });

  const RIGS = Object.freeze({
    feminine: {
      viewBox:"0 0 1000 1000", portraitViewBox:"300 0 400 390", faceAnchor:[500,180],
      body:[300,245,400,720], head:[330,20,340,340], hair:[295,-5,410,360],
      eyes:[[417,141,60,60],[523,141,60,60]], brows:[[410,103,82,46],[508,103,82,46]],
      nose:[478,196,44,42], mouth:[449,238,102,40],
      outfit:{ tee:[350,274,300,300], hoodie:[330,258,340,315] },
      glasses:[386,122,228,92]
    },
    masculine: {
      viewBox:"0 0 1000 1500", portraitViewBox:"300 20 400 440", faceAnchor:[500,205],
      body:[260,325,480,1125], head:[320,35,360,390], hair:[285,15,430,340],
      eyes:[[413,186,64,64],[523,186,64,64]], brows:[[405,137,84,48],[511,137,84,48]],
      nose:[477,253,46,44], mouth:[442,307,116,42],
      outfit:{ tee:[342,360,316,330], hoodie:[325,340,350,355] },
      glasses:[383,167,234,96]
    }
  });

  function clamp(value, min, max) { return Math.max(min, Math.min(max, Number(value))); }
  function value(settings, key) { return clamp(settings && settings[key] == null ? 2 : settings[key], 0, 4); }
  function normal(settings, key) { return (value(settings, key) - 2) / 2; }
  function filter(group, key, fallback) { return (FILTERS[group] && FILTERS[group][key]) || (FILTERS[group] && FILTERS[group][fallback]) || "none"; }
  function styleFilter(value) { return value && value !== "none" ? ' style="filter:'+value+'"' : ""; }
  function image(base, name, box, className, filterValue) {
    return '<image class="avatar-rig__'+className+'" href="'+ASSET_ROOT+base+'/'+name+'.png" x="'+box[0]+'" y="'+box[1]+'" width="'+box[2]+'" height="'+box[3]+'" preserveAspectRatio="xMidYMid meet"'+styleFilter(filterValue)+'></image>';
  }
  function around(anchor, sx, sy, tx, ty, rotate) {
    return "translate("+(tx || 0)+" "+(ty || 0)+") translate("+anchor[0]+" "+anchor[1]+") rotate("+(rotate || 0)+") scale("+sx+" "+sy+") translate("+(-anchor[0])+" "+(-anchor[1])+")";
  }
  function isCurly(settings) { return ["curls", "coils", "curly"].indexOf(settings.avatarHair) >= 0; }
  function isHoodie(settings) { return settings.avatarTop === "hoodie"; }
  function hasGlasses(settings) { return settings.avatarAccessory === "glasses"; }

  function render(settings, options) {
    settings = settings || {}; options = options || {};
    const base = settings.avatarBase === "feminine" ? "feminine" : "masculine";
    const rig = RIGS[base];
    const skinFilter = filter("skin", settings.avatarSkin, "tone-2");
    const hairFilter = filter("hair", settings.avatarHairColor, "brown");
    const eyeFilter = filter("eye", settings.avatarEyeColor, "brown");
    const outfitFilter = filter("outfit", settings.avatarOutfitColor, "green");
    const faceX = 1 + normal(settings, "avatarFaceWidth") * .075 + normal(settings, "avatarCheekVolume") * .025 + normal(settings, "avatarJawWidth") * .02;
    const faceY = 1 + normal(settings, "avatarFaceLength") * .065;
    const hairX = 1 + normal(settings, "avatarHairVolume") * .09;
    const hairY = 1 + normal(settings, "avatarHairLength") * .085;
    const eyeScale = 1 + normal(settings, "avatarEyeSize") * .16;
    const eyeGap = normal(settings, "avatarEyeSpacing") * 13;
    const eyeY = normal(settings, "avatarEyeHeight") * 10;
    const browScaleY = 1 + normal(settings, "avatarBrowThickness") * .24;
    const browGap = normal(settings, "avatarBrowSpacing") * 11;
    const browArch = normal(settings, "avatarBrowArch") * 8;
    const noseX = 1 + normal(settings, "avatarNoseWidth") * .18;
    const noseY = 1 + normal(settings, "avatarNoseLength") * .18;
    const noseShift = normal(settings, "avatarNoseHeight") * 10;
    const mouthX = 1 + normal(settings, "avatarMouthWidth") * .2;
    const mouthY = 1 + normal(settings, "avatarMouthCurve") * .18;
    const mouthShift = normal(settings, "avatarMouthHeight") * 11;
    const accessoryScale = 1 + normal(settings, "avatarAccessorySize") * .14;
    const accessoryShift = normal(settings, "avatarAccessoryHeight") * 13;
    const hairName = isCurly(settings) ? "hair-curly" : "hair-original";
    const top = isHoodie(settings) ? "hoodie" : "tee";
    const classes = "il-student-avatar il-avatar-rig avatar-base--"+base+(options.compact ? " is-compact" : "")+(options.portrait ? " is-portrait" : "");
    const viewBox = options.portrait ? rig.portraitViewBox : rig.viewBox;

    let svg = '<svg class="'+classes+'" viewBox="'+viewBox+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Avatar personalizado">';
    svg += '<g class="avatar-rig__body">';
    svg += image(base, "body-base", rig.body, "body-base", "none");
    svg += image(base, "body-skin", rig.body, "body-skin", skinFilter);
    svg += image(base, "outfit-"+top, rig.outfit[top], "outfit", outfitFilter);
    svg += '</g>';
    svg += '<g class="avatar-rig__head-group" transform="'+around(rig.faceAnchor, faceX, faceY, 0, 0, 0)+'">';
    svg += image(base, "head-base", rig.head, "head-base", skinFilter);
    svg += '<g class="avatar-rig__hair-group" transform="'+around(rig.faceAnchor, hairX, hairY, 0, 0, 0)+'">'+image(base, hairName, rig.hair, "hair", hairFilter)+'</g>';
    rig.brows.forEach((box, index) => { const anchor = [box[0] + box[2] / 2, box[1] + box[3] / 2]; const shift = index ? browGap : -browGap; const rotation = index ? browArch : -browArch; svg += '<g transform="'+around(anchor, 1, browScaleY, shift, 0, rotation)+'">'+image(base, index ? "brow-right" : "brow-left", box, "brow", hairFilter)+'</g>'; });
    rig.eyes.forEach((box, index) => { const anchor = [box[0] + box[2] / 2, box[1] + box[3] / 2]; const shift = index ? eyeGap : -eyeGap; svg += '<g transform="'+around(anchor, eyeScale, eyeScale, shift, eyeY, 0)+'">'+image(base, index ? "eye-right" : "eye-left", box, "eye", eyeFilter)+'</g>'; });
    const noseAnchor = [rig.nose[0] + rig.nose[2] / 2, rig.nose[1] + rig.nose[3] / 2];
    svg += '<g transform="'+around(noseAnchor, noseX, noseY, 0, noseShift, 0)+'">'+image(base, "nose", rig.nose, "nose", skinFilter)+'</g>';
    const mouthAnchor = [rig.mouth[0] + rig.mouth[2] / 2, rig.mouth[1] + rig.mouth[3] / 2];
    svg += '<g transform="'+around(mouthAnchor, mouthX, mouthY, 0, mouthShift, 0)+'">'+image(base, "mouth", rig.mouth, "mouth", "none")+'</g>';
    if (hasGlasses(settings)) { const glassesAnchor = [rig.glasses[0] + rig.glasses[2] / 2, rig.glasses[1] + rig.glasses[3] / 2]; svg += '<g transform="'+around(glassesAnchor, accessoryScale, accessoryScale, 0, accessoryShift, 0)+'">'+image(base, "glasses", rig.glasses, "accessory", "none")+'</g>'; }
    svg += '</g></svg>';
    return svg;
  }

  function sanitizePatch(patch) {
    const clean = {};
    RANGE_KEYS.forEach(key => { if (patch && Object.prototype.hasOwnProperty.call(patch, key)) clean[key] = clamp(patch[key], 0, 4); });
    return clean;
  }

  return { RIGS, RANGE_KEYS, FILTERS, render, sanitizePatch, normal };
});
