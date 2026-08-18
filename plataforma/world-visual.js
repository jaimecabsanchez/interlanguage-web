/* ============================================================
   Interlanguage HOME · avatar humano y mundos SVG modulares
   Ilustración original, ligera y ampliable mediante datos.
   ============================================================ */
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory(require("./avatar-rig.js"));
  else root.ILWorldVisual = factory(root.ILAvatarRig);
})(typeof globalThis !== "undefined" ? globalThis : this, function (AvatarRig) {
  "use strict";

  const skin = value => ({ "tone-1":"var(--il-avatar-skin-1)", "tone-5":"var(--il-avatar-skin-5)", "tone-2":"var(--il-avatar-skin-2)", "tone-6":"var(--il-avatar-skin-6)", "tone-3":"var(--il-avatar-skin-3)", "tone-7":"var(--il-avatar-skin-7)", "tone-4":"var(--il-avatar-skin-4)", "tone-8":"var(--il-avatar-skin-8)" }[value] || "var(--il-avatar-skin-2)");
  const hair = value => ({ dark:"var(--il-avatar-hair-dark)", brown:"var(--il-avatar-hair-brown)", gold:"var(--il-avatar-hair-gold)", copper:"var(--il-avatar-hair-copper)", ash:"var(--il-avatar-hair-ash)", red:"var(--il-avatar-hair-red)" }[value] || "var(--il-avatar-hair-dark)");
  const eye = value => ({ brown:"var(--il-avatar-eye-brown)", hazel:"var(--il-avatar-eye-hazel)", green:"var(--il-avatar-eye-green)", blue:"var(--il-avatar-eye-blue)", grey:"var(--il-avatar-eye-grey)" }[value] || "var(--il-avatar-eye-brown)");
  const theme = value => ({ coral:"var(--il-secondary)", aqua:"var(--il-success)", navy:"var(--il-primary)" }[value] || "var(--il-primary)");
  const set = value => new Set(Array.isArray(value) ? value : []);

  function hairBack(style, colour) {
    if (style === "long") return '<path d="M49 63c0-34 17-51 42-51s42 18 42 51v73H49Z" fill="'+colour+'"/>';
    if (style === "waves") return '<path d="M50 63c0-33 17-51 41-51 25 0 42 18 42 53-11-4-15-18-25-16-12 3-17-9-28-3-12 7-20 9-30 7Z" fill="'+colour+'"/>';
    if (style === "curls") return '<g fill="'+colour+'"><circle cx="57" cy="45" r="17"/><circle cx="69" cy="27" r="18"/><circle cx="91" cy="22" r="19"/><circle cx="113" cy="29" r="18"/><circle cx="126" cy="49" r="17"/><circle cx="117" cy="68" r="17"/><circle cx="62" cy="68" r="17"/></g>';
    if (style === "bob") return '<path d="M49 62c0-34 17-51 42-51s42 18 42 51v48l-15-10-8 14-19-9-19 9-8-14-15 10Z" fill="'+colour+'"/>';
    if (style === "coils") return '<g fill="'+colour+'"><circle cx="52" cy="58" r="18"/><circle cx="55" cy="37" r="18"/><circle cx="70" cy="20" r="18"/><circle cx="91" cy="16" r="19"/><circle cx="112" cy="21" r="18"/><circle cx="127" cy="39" r="18"/><circle cx="130" cy="61" r="18"/><circle cx="117" cy="76" r="17"/><circle cx="65" cy="76" r="17"/></g>';
    if (style === "fade") return '<path d="M53 59c1-30 16-46 38-46 21 0 36 14 39 42-18-7-31-17-39-29-7 13-20 24-38 33Z" fill="'+colour+'"/>';
    if (style === "braids") return '<path d="M50 62c0-33 17-50 41-50s41 17 41 50c-13-4-22-13-28-25-12 13-29 21-54 25Z" fill="'+colour+'"/><g fill="none" stroke="'+colour+'" stroke-width="9" stroke-linecap="round"><path d="M58 58c-12 28-8 54-18 78"/><path d="M124 58c12 28 8 54 18 78"/></g><g fill="var(--il-secondary)"><circle cx="40" cy="137" r="5"/><circle cx="142" cy="137" r="5"/></g>';
    return '<path d="M49 63c0-34 17-51 42-51 24 0 41 17 42 49-13-4-20-18-29-18-13 12-31 18-55 20Z" fill="'+colour+'"/>';
  }
  function hairFront(style, colour) {
    if (style === "long" || style === "bob") return '<path d="M55 48c9-25 24-34 37-34 19 0 31 10 37 33-17-4-29-14-36-25-8 13-20 22-38 26Z" fill="'+colour+'"/>';
    if (style === "waves") return '<path d="M53 49c6-25 22-36 39-36 18 0 33 10 38 34-11-8-20 2-29-6-8-7-16 8-27 3-8-4-14 3-21 5Z" fill="'+colour+'"/>';
    if (style === "curls" || style === "coils") return '<g fill="'+colour+'"><circle cx="62" cy="34" r="14"/><circle cx="80" cy="23" r="15"/><circle cx="99" cy="22" r="15"/><circle cx="117" cy="34" r="14"/></g>';
    if (style === "fade") return '<path d="M56 47c7-22 20-32 35-32 17 0 29 10 35 29-14-5-25-13-34-24-8 12-20 21-36 27Z" fill="'+colour+'"/>';
    if (style === "braids") return '<path d="M53 49c6-25 21-36 38-36 19 0 33 11 39 35-16-4-28-14-37-27-8 13-22 23-40 28Z" fill="'+colour+'"/><g fill="none" stroke="var(--il-avatar-halo)" stroke-opacity=".45" stroke-width="2"><path d="M65 30h50M60 39h62M74 20l-12 26M91 15v31M108 20l12 25"/></g>';
    return '<path d="M54 48c7-25 22-36 38-36 18 0 32 10 38 34-16-4-28-14-36-27-8 14-22 24-40 29Z" fill="'+colour+'"/>';
  }
  function faceBase(shape, colour, width, avatarBase) {
    const baseScale = avatarBase === "feminine" ? .96 : 1.04;
    const scale = (.9 + Math.max(0, Math.min(4, Number(width) || 0)) * .05) * baseScale;
    const base = shape === "angular"
      ? '<path d="M91 25c25 0 37 15 37 38 0 22-11 36-37 45-26-9-37-23-37-45 0-23 12-38 37-38Z" fill="'+colour+'"/>'
      : '<ellipse cx="91" cy="65" rx="'+(shape === "round" ? 38 : 35)+'" ry="'+(shape === "round" ? 37 : shape === "soft" ? 39 : 41)+'" fill="'+colour+'"/>';
    // Volumen 2.5D: luz suave arriba-izquierda, sombra en el borde derecho y mejillas.
    const shade = '<ellipse cx="79" cy="54" rx="26" ry="24" fill="url(#ilFaceLight)"/>'
      +'<path d="M120 43c11 15 11 44 0 61" fill="var(--il-primary)" opacity=".05"/>'
      +'<ellipse cx="72" cy="77" rx="7.5" ry="5" fill="var(--il-secondary)" opacity=".24"/>'
      +'<ellipse cx="110" cy="77" rx="7.5" ry="5" fill="var(--il-secondary)" opacity=".24"/>';
    return '<g class="avatar-face avatar-face--'+(avatarBase === "feminine" ? "feminine" : "masculine")+'" transform="translate(91 0) scale('+scale+' 1) translate(-91 0)"><ellipse cx="54" cy="67" rx="8" ry="10" fill="'+colour+'"/><ellipse cx="128" cy="67" rx="8" ry="10" fill="'+colour+'"/>'+base+shade+'</g>';
  }
  function oneEye(x, shape, colour, size) {
    const scale = .82 + Math.max(0, Math.min(4, Number(size) || 0)) * .09;
    const white = shape === "round"
      ? '<ellipse cx="0" cy="0" rx="8" ry="8" fill="var(--il-surface)" stroke="var(--il-avatar-feature)" stroke-width="1.4"/>'
      : shape === "soft"
        ? '<path d="M-9 1c4-7 14-7 18 0-4 5-14 5-18 0Z" fill="var(--il-surface)" stroke="var(--il-avatar-feature)" stroke-width="1.3"/>'
        : shape === "bright"
          ? '<path d="M-9 2c4-9 14-9 18 0-5 6-13 6-18 0Z" fill="var(--il-surface)" stroke="var(--il-avatar-feature)" stroke-width="1.5"/>'
          : '<path d="M-10 1c5-6 15-6 20 0-5 5-15 5-20 0Z" fill="var(--il-surface)" stroke="var(--il-avatar-feature)" stroke-width="1.3"/>';
    return '<g class="avatar-eye" transform="translate('+x+' 64) scale('+scale+')">'+white+'<circle cx="0" cy="1" r="4.2" fill="'+colour+'"/><circle cx="0" cy="1" r="2.2" fill="var(--il-text-primary)"/><circle cx="-1.4" cy="-.8" r="1" fill="var(--il-surface)"/></g>';
  }
  function brows(shape) {
    if (shape === "straight") return '<path d="M70 51h18M96 51h18" fill="none" stroke="var(--il-avatar-feature)" stroke-width="3" stroke-linecap="round"/>';
    if (shape === "arched") return '<path d="M70 53c5-8 13-8 18-2M96 51c5-6 13-6 18 2" fill="none" stroke="var(--il-avatar-feature)" stroke-width="3" stroke-linecap="round"/>';
    if (shape === "bold") return '<path d="M69 53c6-5 13-6 20-2M95 51c7-4 14-3 20 2" fill="none" stroke="var(--il-avatar-feature)" stroke-width="5" stroke-linecap="round"/>';
    return '<path d="M70 53c6-5 12-5 18-2M96 51c6-3 12-3 18 2" fill="none" stroke="var(--il-avatar-feature)" stroke-width="2.5" stroke-linecap="round"/>';
  }
  function nose(shape, length) {
    const end = 71 + Math.max(0, Math.min(4, Number(length) || 0)) * 1.5;
    if (shape === "round") return '<path d="M91 67c-4 7-3 11 2 12 4 0 6-2 6-5" fill="none" stroke="var(--il-avatar-feature)" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>';
    if (shape === "button") return '<path d="M87 '+end+'c3 3 6 3 9 0" fill="none" stroke="var(--il-avatar-feature)" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>';
    if (shape === "defined") return '<path d="M92 65c-1 6-3 10-5 '+(end+1)+' 4 4 9 4 12 0" fill="none" stroke="var(--il-avatar-feature)" stroke-opacity=".58" stroke-width="2" stroke-linecap="round"/>';
    return '<path d="M92 66c-2 5-3 9-1 '+end+' 2 1 4 1 6 0" fill="none" stroke="var(--il-avatar-feature)" stroke-opacity=".5" stroke-width="1.8" stroke-linecap="round"/>';
  }
  function mouth(shape) {
    if (shape === "calm") return '<path d="M84 86h14" fill="none" stroke="var(--il-avatar-feature)" stroke-width="2.6" stroke-linecap="round"/>';
    if (shape === "soft") return '<path d="M85 85c4 3 9 3 13 0" fill="none" stroke="var(--il-avatar-feature)" stroke-width="2.4" stroke-linecap="round"/>';
    if (shape === "wide") return '<path d="M80 83c7 9 16 9 23 0Z" fill="var(--il-surface)" stroke="var(--il-avatar-feature)" stroke-width="2" stroke-linejoin="round"/>';
    return '<path d="M83 83c5 6 12 6 17 0" fill="none" stroke="var(--il-avatar-feature)" stroke-width="2.8" stroke-linecap="round"/>';
  }
  function face(settings, colour) {
    const mouthShape = settings.avatarMouthShape || (settings.avatarExpression === "calm" ? "calm" : settings.avatarExpression === "bright" ? "wide" : "smile");
    return faceBase(settings.avatarFaceShape || "oval", colour, settings.avatarFaceWidth == null ? 2 : settings.avatarFaceWidth, settings.avatarBase)
      +oneEye(79, settings.avatarEyeShape || "almond", eye(settings.avatarEyeColor), settings.avatarEyeSize == null ? 2 : settings.avatarEyeSize)
      +oneEye(103, settings.avatarEyeShape || "almond", eye(settings.avatarEyeColor), settings.avatarEyeSize == null ? 2 : settings.avatarEyeSize)
      +brows(settings.avatarBrowShape || "soft")+nose(settings.avatarNoseShape || "soft", settings.avatarNoseLength == null ? 2 : settings.avatarNoseLength)+mouth(mouthShape);
  }
  function clothing(top, colour) {
    const base = '<path d="M50 128c8-23 23-34 41-34s33 11 41 34l8 68H42Z" fill="'+colour+'"/>';
    if (top === "hoodie") return '<path d="M53 126c6-22 21-35 38-35s32 13 38 35l10 70H43Z" fill="'+colour+'"/><path d="M67 102c7 14 41 14 48 0-4 23-11 34-24 34s-20-11-24-34Z" fill="var(--il-primary-soft)"/><path d="M78 125v17M104 125v17" stroke="var(--il-surface)" stroke-width="3" stroke-linecap="round"/><path d="M70 169h42" stroke="var(--il-surface)" stroke-opacity=".45" stroke-width="4"/>';
    if (top === "sweater") return base+'<path d="M52 146h78M49 164h84" stroke="var(--il-surface)" stroke-opacity=".38" stroke-width="7"/>';
    if (top === "shirt") return '<path d="M50 128c8-23 23-34 41-34s33 11 41 34l8 68H42Z" fill="var(--il-surface)"/><path d="m72 101 19 25 19-25M91 126v70" fill="none" stroke="var(--il-primary)" stroke-width="4"/><circle cx="97" cy="147" r="2.5" fill="var(--il-secondary)"/><circle cx="97" cy="165" r="2.5" fill="var(--il-secondary)"/>';
    if (top === "school") return '<path d="M50 128c8-23 23-34 41-34s33 11 41 34l8 68H42Z" fill="var(--il-primary)"/><path d="m74 99 17 24 17-24M91 123l-7 33 7 10 7-10Z" fill="var(--il-surface)" stroke="var(--il-secondary)" stroke-width="3"/>';
    if (top === "sport") return '<path d="M50 128c8-23 23-34 41-34s33 11 41 34l8 68H42Z" fill="var(--il-success)"/><path d="m52 126 20 12v58M130 126l-20 12v58" fill="none" stroke="var(--il-surface)" stroke-opacity=".7" stroke-width="7"/>';
    if (top === "jacket") return '<path d="M50 128c8-23 23-34 41-34s33 11 41 34l8 68H42Z" fill="var(--il-navy-2)"/><path d="M91 100v96M62 111l19 24M120 111l-19 24" stroke="var(--il-surface)" stroke-opacity=".7" stroke-width="4"/><path d="M53 162h26M103 162h26" stroke="var(--il-secondary)" stroke-width="5"/>';
    return base+'<path d="M79 112h24" stroke="var(--il-surface)" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/>';
  }
  function accessory(value, colour) {
    if (value === "cap") return '<path d="M53 40c7-25 23-35 40-35 19 0 34 12 40 35H53Z" fill="var(--il-secondary)"/><path d="M93 40h49c-4 10-19 12-35 7Z" fill="var(--il-coral-ink)"/>';
    if (value === "headphones") return '<path d="M49 63v-7c0-26 18-43 42-43s42 17 42 43v7" fill="none" stroke="var(--il-primary)" stroke-width="8"/><rect x="43" y="57" width="15" height="31" rx="7" fill="var(--il-secondary)"/><rect x="124" y="57" width="15" height="31" rx="7" fill="var(--il-secondary)"/>';
    if (value === "glasses") return '<g fill="none" stroke="var(--il-primary)" stroke-width="4"><circle cx="78" cy="65" r="13"/><circle cx="104" cy="65" r="13"/><path d="M91 64h1M65 61l-13-4M117 61l13-4"/></g>';
    if (value === "scarf") return '<path d="M65 99c13 8 39 8 52 0l-4 20c-17 7-29 7-45 0Z" fill="var(--il-secondary)"/><path d="M106 114v51l14-9-4-44Z" fill="var(--il-coral-ink)"/>';
    if (value === "badge") return '<circle cx="112" cy="139" r="11" fill="var(--il-warning)"/><path d="m112 132 2 5 5 1-4 4 1 5-4-2-5 2 1-5-4-4 6-1Z" fill="var(--il-surface)"/>';
    return "";
  }
  function backpack(value) {
    return value === "backpack" ? '<path d="M25 133c0-25 12-40 32-40h9v86H35c-7 0-10-4-10-11Z" fill="var(--il-secondary)"/><path d="M29 132h32" stroke="var(--il-coral-ink)" stroke-width="7"/>' : "";
  }

  function layerClass(options) {
    return (options.compact ? " is-compact" : "") + (options.portrait ? " is-portrait" : "");
  }
  function illustratedAvatar(settings, options) {
    const base = settings.avatarBase === "feminine" ? "feminine" : "masculine";
    const master = base === "feminine" ? "look-05" : "look-01";
    if (AvatarRig && typeof AvatarRig.render === "function") return AvatarRig.render(settings, options);
    const classes = layerClass(options);
    return '<img class="il-student-avatar il-avatar-master avatar-base--'+base+classes+'" src="assets/avatar/'+master+'.webp" alt="" draggable="false" decoding="async">';
  }

  function avatar(settings, progress, options) {
    settings = settings || {}; options = options || {};
    if (!options.vectorFallback) return illustratedAvatar(settings, options);
    const skinTone = skin(settings.avatarSkin); const hairTone = hair(settings.avatarHairColor); const bodyTone = theme(settings.avatarTheme);
    const top = settings.avatarTop || "tee"; const acc = settings.avatarAccessory || "none"; const style = settings.avatarHair || "short";
    const avatarBase = settings.avatarBase === "feminine" ? "feminine" : "masculine"; const feminine = avatarBase === "feminine";
    const neck = feminine
      ? '<path d="M82 92v15c0 8 18 8 18 0V92" fill="'+skinTone+'"/><path d="M82 100c5 6 13 6 18 0v6c0 8-18 8-18 0Z" fill="var(--il-primary)" opacity=".08"/>'
      : '<path d="M79 92v15c0 8 24 8 24 0V92" fill="'+skinTone+'"/><path d="M79 100c7 6 17 6 24 0v6c0 8-24 8-24 0Z" fill="var(--il-primary)" opacity=".08"/>';
    const bodyScale = feminine ? .93 : 1.04;
    const defs = '<defs>'
      +'<radialGradient id="ilFaceLight" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="var(--il-surface)" stop-opacity=".42"/><stop offset="1" stop-color="var(--il-surface)" stop-opacity="0"/></radialGradient>'
      +'<linearGradient id="ilBodyShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--il-surface)" stop-opacity=".28"/><stop offset=".5" stop-color="var(--il-surface)" stop-opacity="0"/><stop offset="1" stop-color="var(--il-primary)" stop-opacity=".2"/></linearGradient>'
      +'<linearGradient id="ilLegShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="var(--il-surface)" stop-opacity=".16"/><stop offset="1" stop-color="var(--il-primary)" stop-opacity=".18"/></linearGradient>'
      +'</defs>';
    return '<svg class="il-student-avatar avatar-base--'+avatarBase+(options.compact ? ' is-compact' : '')+(options.portrait ? ' is-portrait' : '')+'" viewBox="'+(options.portrait ? '34 0 114 118' : '0 0 180 260')+'" aria-hidden="true">'+defs
      +'<g class="avatar-idle">'+backpack(acc)+hairBack(style, hairTone)+face(settings, skinTone)+hairFront(style, hairTone)
      +'<path d="M67 27c9-9 27-12 42-5" fill="none" stroke="var(--il-surface)" stroke-width="4" stroke-linecap="round" opacity=".16"/>'
      +'<g class="avatar-body avatar-body--'+avatarBase+'" transform="translate(91 0) scale('+bodyScale+' 1) translate(-91 0)">'+neck
      +clothing(top, bodyTone)
      +'<path d="M50 128c8-23 23-34 41-34s33 11 41 34l8 68H42Z" fill="url(#ilBodyShade)"/>'
      +'<path d="M51 128c-15 16-20 42-18 68M131 128c15 16 20 42 18 68" fill="none" stroke="'+skinTone+'" stroke-width="16" stroke-linecap="round"/>'
      +'<circle cx="33" cy="196" r="9" fill="'+skinTone+'"/><circle cx="149" cy="196" r="9" fill="'+skinTone+'"/></g>'
      +'<path d="M61 194v44M121 194v44" stroke="var(--il-primary)" stroke-width="21" stroke-linecap="round"/><path d="M61 196v40M121 196v40" stroke="url(#ilLegShade)" stroke-width="21" stroke-linecap="round"/>'
      +'<path d="M52 240h18c9 0 15 4 15 9 0 3-2 5-6 5H52ZM110 240h18c9 0 15 4 15 9 0 3-2 5-6 5h-27Z" fill="'+bodyTone+'"/>'
      +'<path d="M49 252h37M104 252h37" stroke="var(--il-surface)" stroke-width="5" stroke-linecap="round"/>'
      +accessory(acc, hairTone)+'</g></svg>';
  }

  function companion(id) {
    if (id === "pet-brisa") return '<svg class="il-companion" viewBox="0 0 100 100" aria-hidden="true"><path d="M22 40 10 22c14-1 23 5 28 14M78 40l12-18c-14-1-23 5-28 14" fill="var(--il-avatar-hair-brown)"/><circle cx="50" cy="53" r="34" fill="var(--il-warning-soft)"/><path d="M38 50h1M61 50h1" stroke="var(--il-text-primary)" stroke-width="5" stroke-linecap="round"/><ellipse cx="50" cy="63" rx="7" ry="5" fill="var(--il-text-primary)"/></svg>';
    if (id === "pet-menta") return '<svg class="il-companion" viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="47" cy="58" rx="34" ry="25" fill="var(--il-success)"/><path d="M24 58c5-16 14-23 25-23 12 0 22 8 27 23Z" fill="var(--il-success-soft)"/><circle cx="81" cy="57" r="13" fill="var(--il-jade-tint)"/><path d="M83 53h1" stroke="var(--il-text-primary)" stroke-width="4" stroke-linecap="round"/></svg>';
    return '<svg class="il-companion" viewBox="0 0 100 100" aria-hidden="true"><path d="m25 39 4-24 18 17M75 39l-4-24-18 17" fill="var(--il-primary)"/><circle cx="50" cy="55" r="34" fill="var(--il-primary-soft)"/><path d="M38 51h1M61 51h1" stroke="var(--il-text-primary)" stroke-width="5" stroke-linecap="round"/><path d="m50 58-5 5h10Z" fill="var(--il-secondary)"/></svg>';
  }

  function sky(background, secondary) {
    if (background === "night") return '<path d="M0 0h760v360H0Z" fill="var(--il-primary)"/><circle cx="650" cy="68" r="30" fill="var(--il-warning-soft)"/><g fill="var(--il-surface)" opacity=".75"><circle cx="100" cy="55" r="3"/><circle cx="220" cy="88" r="3"/><circle cx="545" cy="43" r="3"/></g>';
    if (background === "sunset") return '<path d="M0 0h760v360H0Z" fill="var(--il-secondary-soft)"/><circle cx="632" cy="100" r="50" fill="var(--il-warning-soft)"/>';
    if (background === "city") return '<path d="M0 0h760v360H0Z" fill="var(--il-surface-secondary)"/><g fill="var(--il-primary-soft)"><rect x="20" y="80" width="90" height="210"/><rect x="120" y="35" width="105" height="255"/><rect x="236" y="110" width="80" height="180"/></g>';
    return '<path d="M0 0h760v360H0Z" fill="'+(secondary ? 'var(--il-surface-secondary)' : 'var(--il-primary-soft)')+'"/><circle cx="645" cy="70" r="34" fill="var(--il-warning-soft)"/>';
  }
  // --- Piezas vectoriales reutilizables del jardín (formas limpias, paleta de tokens) ---
  const GREEN_HI = "color-mix(in srgb,var(--il-success) 45%,var(--il-surface))";
  const BROWN = "var(--il-avatar-hair-brown)";
  function groundShadow(cx, cy, rx, ry) { return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="var(--il-jade-deep)" opacity=".12"/>'; }
  function cloud(x, y, s) {
    return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')" fill="var(--il-surface)"><circle cx="-20" cy="4" r="15"/><circle cx="2" cy="-6" r="21"/><circle cx="26" cy="4" r="16"/><rect x="-22" y="1" width="52" height="16" rx="8"/></g>';
  }
  function bush(x, y, s) {
    return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')">'+groundShadow(2, 12, 44, 10)
      +'<circle cx="-22" cy="-2" r="22" fill="var(--il-success)"/><circle cx="26" cy="-2" r="19" fill="var(--il-jade-deep)"/><circle cx="4" cy="-14" r="25" fill="var(--il-success)"/>'
      +'<circle cx="-6" cy="-16" r="11" fill="'+GREEN_HI+'" opacity=".7"/></g>';
  }
  function tuft(x, y) { return '<g transform="translate('+x+' '+y+')" stroke="var(--il-success)" stroke-width="3" stroke-linecap="round"><path d="M0 0v-12M7 1v-15M14 0v-11"/></g>'; }
  function flower(x, y, colour, s) {
    return '<g transform="translate('+x+' '+y+') scale('+(s||1)+')">'
      +'<path d="M0 0v22" stroke="var(--il-success)" stroke-width="3.2" stroke-linecap="round"/>'
      +'<path d="M0 10c-8-3-12 2-12 2M0 14c8-3 12 2 12 2" fill="none" stroke="var(--il-success)" stroke-width="2.6" stroke-linecap="round"/>'
      +'<g fill="'+colour+'"><circle cx="0" cy="-8" r="5.4"/><circle cx="-5.6" cy="-1" r="5.4"/><circle cx="5.6" cy="-1" r="5.4"/><circle cx="0" cy="4" r="5.4"/></g>'
      +'<circle cx="0" cy="-2" r="3.4" fill="var(--il-warning-soft)"/></g>';
  }
  function butterfly(x, y, colour) {
    return '<g class="world-flit" transform="translate('+x+' '+y+')"><path d="M0 0c-11-9-21-5-18 4 2 6 12 4 18 1Z" fill="'+colour+'"/><path d="M0 0c11-9 21-5 18 4-2 6-12 4-18 1Z" fill="'+colour+'" opacity=".82"/><path d="M0-4v8" stroke="var(--il-primary)" stroke-width="2" stroke-linecap="round"/></g>';
  }
  function tree(level) {
    const scale = [.74,.86,.96,1.06,1.16][Math.max(1, Math.min(5, level)) - 1];
    return '<g class="world-tree" transform="translate(150 298) scale('+scale+')">'+groundShadow(2, 6, 66, 15)
      +'<path d="M-9 6V-92q0-7 9-7t9 7V6Z" fill="'+BROWN+'"/><path d="M0-88v78" stroke="var(--il-coral-ink)" stroke-width="3" stroke-linecap="round" opacity=".2"/>'
      +'<circle cx="-34" cy="-104" r="40" fill="var(--il-success)"/><circle cx="34" cy="-116" r="44" fill="var(--il-success)"/><circle cx="46" cy="-82" r="32" fill="var(--il-jade-deep)"/><circle cx="-40" cy="-78" r="29" fill="var(--il-jade-deep)"/><circle cx="0" cy="-124" r="40" fill="var(--il-success)"/>'
      +'<circle cx="-10" cy="-120" r="20" fill="'+GREEN_HI+'" opacity=".7"/>'
      +'<g fill="var(--il-secondary)"><circle cx="-28" cy="-88" r="4"/><circle cx="26" cy="-102" r="4"/><circle cx="6" cy="-70" r="4"/></g></g>';
  }
  function garden(settings, progress, options) {
    options = options || {}; const items = set(options.activeItems || settings.activeWorldItems); const level = options.level || 1;
    const bg = settings.worldBackground; const customSky = bg && bg !== "day";
    const daySky = '<rect width="760" height="360" fill="url(#ilSkyDay)"/>'
      +'<g transform="translate(650 66)"><g stroke="var(--il-warning)" stroke-width="4" stroke-linecap="round" opacity=".5"><path d="M0-52v-16M0 52v16M52 0h16M-52 0h-16M37 37l11 11M-37-37l-11-11M37-37l11-11M-37 37l-11 11"/></g><circle r="34" fill="var(--il-warning-soft)"/><circle r="24" fill="color-mix(in srgb,var(--il-warning) 22%,var(--il-surface))"/></g>';
    // Colinas con profundidad + camino con piedras (clearing central para el avatar).
    const ground = '<path d="M0 236c150-40 250 16 390-10 130-24 250-8 370 26v108H0Z" fill="color-mix(in srgb,var(--il-success) 16%,var(--il-surface))"/>'
      +'<path d="M0 274c140-30 240 12 360-6 130-18 260-6 400 20v72H0Z" fill="url(#ilGrass)"/>'
      +'<path d="M0 316c120-20 220 8 340-2 130-10 260-4 420 12v34H0Z" fill="color-mix(in srgb,var(--il-success) 30%,var(--il-surface))"/>';
    const path = '<path d="M360 360c-6-40 30-64 26-96-4-30-40-40-38-70" fill="none" stroke="color-mix(in srgb,var(--il-warning-soft) 78%,var(--il-surface))" stroke-width="46" stroke-linecap="round" opacity=".9"/>'
      +'<g fill="color-mix(in srgb,var(--il-warning) 16%,var(--il-surface))"><ellipse cx="360" cy="336" rx="20" ry="8"/><ellipse cx="372" cy="300" rx="18" ry="7"/><ellipse cx="356" cy="266" rx="16" ry="6"/></g>';
    const scenery = cloud(150, 62, 1.05) + cloud(500, 50, .9) + bush(64, 300, 1.05) + bush(704, 302, 1) + bush(250, 320, .7)
      + tree(level)
      + flower(300, 300, "var(--il-secondary)", 1) + flower(322, 314, "var(--il-warning)", .85) + flower(66, 250, "var(--il-focus)", .8)
      + tuft(196, 320) + tuft(548, 322) + tuft(690, 264)
      + butterfly(470, 150, "var(--il-secondary)") + butterfly(250, 120, "var(--il-warning)");
    // 8-9 "Explorer Garden": mismos componentes base + props de exploración/aprendizaje
    // (pizarra ABC, pila de libros, mochila) para diferenciarlo del jardín más sencillo de 5-7.
    const explorer = options.band === "p34" ? (
      '<g transform="translate(210 172)">'+groundShadow(30,116,42,9)
        +'<path d="M6 108 22 22M54 108 38 22M15 70h30" stroke="'+BROWN+'" stroke-width="5" stroke-linecap="round"/>'
        +'<rect x="-4" y="8" width="68" height="52" rx="4" fill="var(--il-jade-deep)"/>'
        +'<g stroke="var(--il-surface)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M6 46l7-24 7 24M8 38h10"/><path d="M30 22v24M30 22c9 0 9 10 0 10M30 32c10 0 10 12 0 12"/><path d="M58 27c-10-4-17 2-17 9s7 13 17 9"/></g>'
        +'<path d="M-6 54h14" stroke="var(--il-warning-soft)" stroke-width="3" stroke-linecap="round"/></g>'
      +'<g transform="translate(150 320)">'+groundShadow(18,10,28,6)
        +'<rect x="-2" y="-4" width="44" height="10" rx="2" fill="var(--il-focus)"/><rect x="0" y="-13" width="40" height="10" rx="2" fill="var(--il-secondary)"/><rect x="3" y="-22" width="34" height="10" rx="2" fill="var(--il-warning)"/></g>'
      +'<g transform="translate(452 300)">'+groundShadow(16,36,22,6)
        +'<path d="M2 4c0-9 6-14 15-14s15 5 15 14v20c0 4-2 6-6 6H8c-4 0-6-2-6-6Z" fill="var(--il-secondary)"/>'
        +'<path d="M6-8c3-6 20-6 22 0" fill="none" stroke="var(--il-coral-ink)" stroke-width="4" stroke-linecap="round"/>'
        +'<rect x="9" y="12" width="15" height="14" rx="3" fill="var(--il-surface)" opacity=".9"/><path d="M17 2v9" stroke="var(--il-coral-ink)" stroke-width="2.4"/>'
        +'<path d="M6 30l-3 8M28 30l3 8" stroke="var(--il-coral-ink)" stroke-width="3" stroke-linecap="round"/></g>'
    ) : "";
    return '<svg class="il-world-scene" viewBox="0 0 760 360" role="img" aria-label="Tu jardín de aprendizaje">'
      +'<defs><linearGradient id="ilSkyDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="color-mix(in srgb,var(--il-focus) 14%,var(--il-surface))"/><stop offset="1" stop-color="color-mix(in srgb,var(--il-focus) 4%,var(--il-surface))"/></linearGradient>'
      +'<linearGradient id="ilGrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--il-success-soft)"/><stop offset="1" stop-color="color-mix(in srgb,var(--il-success) 22%,var(--il-surface))"/></linearGradient></defs>'
      +(customSky ? sky(bg, false) : daySky) + ground + path + scenery + explorer
      +(items.has("world-flowers")?flower(250,296,"var(--il-secondary)",1)+flower(276,306,"var(--il-warning)",.9)+flower(228,308,"var(--il-focus)",.85)+flower(300,290,"var(--il-secondary)",.8):'')
      +(items.has("world-bench")?'<g transform="translate(556 244)">'+groundShadow(40,74,54,9)+'<path d="M8 30v40M72 30v40" stroke="var(--il-coral-ink)" stroke-width="7" stroke-linecap="round"/><rect x="-2" y="22" width="84" height="11" rx="5" fill="'+BROWN+'"/><rect x="-2" y="0" width="84" height="8" rx="4" fill="'+BROWN+'"/><path d="M6 6v18M74 6v18" stroke="'+BROWN+'" stroke-width="5" stroke-linecap="round"/></g>':'')
      +(items.has("world-toy-plane")?'<g class="world-flit" transform="translate(520 96)"><path d="m0 0 52-16-16 34-12-14Z" fill="var(--il-secondary)"/><path d="m52-16-28 20 8 14Z" fill="var(--il-coral-ink)"/><path d="M-40 8q20-10 40-8" fill="none" stroke="var(--il-surface)" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 8" opacity=".8"/></g>':'')
      +(items.has("world-ball")?'<g transform="translate(300 330)">'+groundShadow(0,16,18,6)+'<circle r="17" fill="var(--il-surface)" stroke="var(--il-border-strong)" stroke-width="2"/><path d="M-17 0a17 17 0 0 1 34 0Z" fill="var(--il-secondary)"/><path d="M0-17v34M-17 0h34" stroke="var(--il-surface)" stroke-width="2.4"/></g>':'')
      +(items.has("world-pond")?'<g transform="translate(612 322)"><ellipse rx="88" ry="27" fill="color-mix(in srgb,var(--il-focus) 18%,var(--il-surface))"/><ellipse cx="0" cy="-4" rx="72" ry="19" fill="color-mix(in srgb,var(--il-focus) 30%,var(--il-surface))"/><path d="M-42-6h30M-24 6h34" stroke="var(--il-surface)" stroke-width="3" stroke-linecap="round" opacity=".65"/><g transform="translate(26 -3)"><ellipse rx="15" ry="9" fill="var(--il-success)"/><circle cx="-3" cy="-2" r="3.4" fill="var(--il-secondary)"/></g></g>':'')
      +(items.has("world-bicycle")?'<g transform="translate(470 262)" fill="none" stroke="var(--il-primary)" stroke-width="6" stroke-linecap="round"><circle cx="22" cy="46" r="19"/><circle cx="92" cy="46" r="19"/><path d="m22 46 26-40 21 40M48 6h18M40 46h40l8-24"/></g>':'')
      +(items.has("world-lanterns")?'<path d="M118 150q260-58 526 6" fill="none" stroke="var(--il-primary)" stroke-width="2.5" opacity=".5"/><g fill="var(--il-warning)" stroke="var(--il-warning-ink)" stroke-width="1.5"><circle cx="230" cy="150" r="8"/><circle cx="360" cy="140" r="8"/><circle cx="500" cy="145" r="8"/><circle cx="620" cy="158" r="8"/></g>':'')
      +(items.has("world-greenhouse")?'<g transform="translate(628 150)">'+groundShadow(52,116,60,10)+'<path d="m0 66 52-52 52 52v52H0Z" fill="color-mix(in srgb,var(--il-focus) 8%,var(--il-surface))" stroke="var(--il-success)" stroke-width="5" stroke-linejoin="round"/><path d="M52 14v104M0 66h104M26 40l26 26M78 40 52 66" stroke="var(--il-success)" stroke-width="3" opacity=".55"/></g>':'')
      +'</svg>';
  }
  function personalSpace(settings, progress, options) {
    options = options || {}; const items = set(options.activeItems || settings.activeWorldItems);
    const isEso = options.band === "eso"; const level = options.level || 1;
    const NAVY = "var(--il-primary)"; const NAVY_DEEP = "color-mix(in srgb,var(--il-primary) 78%,var(--il-text-primary))";
    // 10-11 (base): pared cálida crema, suelo de madera, acento coral.
    // ESO (space): pared navy tenue, suelo neutro, acento jade — más sobrio.
    const wall = isEso ? "color-mix(in srgb,var(--il-primary-soft) 86%,var(--il-surface))" : "color-mix(in srgb,var(--il-warning-soft) 52%,var(--il-surface))";
    const floor = isEso ? "var(--il-surface-secondary)" : "color-mix(in srgb,var(--il-warning) 18%,var(--il-surface))";
    const rug = isEso ? "color-mix(in srgb,var(--il-focus) 12%,var(--il-surface))" : "color-mix(in srgb,var(--il-secondary) 15%,var(--il-surface))";
    const accent = isEso ? "var(--il-success)" : "var(--il-secondary)";
    const screen = "color-mix(in srgb,var(--il-focus) 24%,var(--il-surface))";
    const shelfWood = "var(--il-avatar-hair-brown)";
    const shadow = c => '<ellipse cx="'+c[0]+'" cy="'+c[1]+'" rx="'+c[2]+'" ry="'+c[3]+'" fill="var(--il-primary)" opacity=".08"/>';
    // Estructura base (siempre): pared, suelo, rodapié y alfombra bajo el avatar.
    const room = '<rect width="760" height="360" fill="'+wall+'"/><path d="M0 270h760v90H0Z" fill="'+floor+'"/><path d="M0 270h760" stroke="color-mix(in srgb,var(--il-primary) 12%,var(--il-surface))" stroke-width="3"/>'
      +'<ellipse cx="340" cy="332" rx="168" ry="26" fill="'+rug+'"/>';
    // Nivel 1 · Escritorio (con cajonera y patas).
    const desk = '<g transform="translate(430 250)">'+shadow([150,92,156,15])
      +'<rect x="208" y="16" width="84" height="94" rx="4" fill="'+NAVY_DEEP+'"/><path d="M222 44h56M222 74h56" stroke="'+NAVY+'" stroke-width="3"/><g fill="'+accent+'"><circle cx="250" cy="30" r="3.2"/><circle cx="250" cy="59" r="3.2"/><circle cx="250" cy="90" r="3.2"/></g>'
      +'<rect x="10" y="16" width="13" height="94" fill="'+NAVY_DEEP+'"/><rect x="0" y="0" width="298" height="17" rx="5" fill="'+NAVY+'"/><rect x="0" y="13" width="298" height="4" fill="'+NAVY_DEEP+'"/></g>';
    // Nivel 2 · Monitor sobre el escritorio.
    const monitor = level >= 2 ? '<g transform="translate(492 168)"><rect width="110" height="68" rx="7" fill="'+NAVY_DEEP+'"/><rect x="7" y="7" width="96" height="54" rx="3" fill="'+screen+'"/>'
      +(isEso?'<path d="M16 55l22-22 15 13 17-19 20 28Z" fill="color-mix(in srgb,var(--il-focus) 46%,var(--il-surface))"/><circle cx="90" cy="20" r="6" fill="var(--il-warning)"/>':'<path d="M12 55c14-10 22-2 30-10s16 4 26-4v14H12Z" fill="color-mix(in srgb,var(--il-success) 40%,var(--il-surface))"/><circle cx="86" cy="22" r="7" fill="var(--il-warning)"/>')
      +'<rect x="49" y="68" width="12" height="12" fill="'+NAVY_DEEP+'"/><rect x="34" y="80" width="42" height="6" rx="3" fill="'+NAVY_DEEP+'"/></g>' : '';
    // Nivel 3 · Estantería con libros.
    const shelf = level >= 3 ? '<g transform="translate(48 120)">'+shadow([56,152,64,11])
      +'<rect width="108" height="150" rx="7" fill="'+shelfWood+'"/><rect x="10" y="10" width="88" height="130" rx="3" fill="'+wall+'"/><path d="M10 58h88M10 104h88" stroke="'+shelfWood+'" stroke-width="6"/>'
      +'<g><rect x="18" y="20" width="10" height="32" fill="var(--il-secondary)"/><rect x="30" y="24" width="10" height="28" fill="var(--il-success)"/><rect x="42" y="18" width="10" height="34" fill="'+NAVY+'"/><rect x="58" y="22" width="24" height="30" rx="2" fill="var(--il-warning)"/></g>'
      +'<g><rect x="18" y="70" width="24" height="30" rx="2" fill="'+NAVY+'"/><rect x="50" y="66" width="10" height="34" fill="var(--il-secondary)"/><rect x="62" y="72" width="10" height="28" fill="var(--il-success)"/><rect x="74" y="70" width="10" height="30" fill="var(--il-warning)"/></g></g>' : '';
    // Nivel 4 · Tablón de misiones en la pared.
    const board = level >= 4 ? '<g transform="translate(474 52)"><rect width="164" height="86" rx="7" fill="color-mix(in srgb,var(--il-warning) 26%,var(--il-surface))" stroke="'+shelfWood+'" stroke-width="5"/>'
      +'<g transform="translate(16 14)"><rect width="46" height="34" rx="3" fill="var(--il-surface)"/><path d="M9 18l6 6 12-14" fill="none" stroke="'+accent+'" stroke-width="4" stroke-linecap="round"/></g>'
      +'<g transform="translate(72 12)"><rect width="44" height="30" rx="3" fill="var(--il-surface)"/><path d="m22 8 3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1Z" fill="var(--il-warning)"/></g>'
      +'<g transform="translate(120 16)"><rect width="30" height="52" rx="3" fill="var(--il-surface)"/><path d="M7 14h16M7 26h16M7 38h10" stroke="'+NAVY+'" stroke-width="3" stroke-linecap="round" opacity=".55"/></g>'
      +'<circle cx="30" cy="10" r="3" fill="'+accent+'"/><circle cx="130" cy="10" r="3" fill="'+accent+'"/></g>' : '';
    // Nivel 5 · Lámpara de escritorio + trofeo en la estantería.
    const lamp = level >= 5 ? '<g transform="translate(648 176)" fill="none" stroke="'+NAVY+'" stroke-width="5" stroke-linecap="round"><path d="M14 74V44l22-18"/><ellipse cx="18" cy="76" rx="14" ry="4" fill="'+NAVY_DEEP+'" stroke="none"/></g><path d="M666 152l20 10-12 16-20-10Z" fill="'+accent+'"/>' : '';
    const trophy = level >= 5 ? '<g transform="translate(78 96)"><path d="M4 2h20v9c0 8-5 12-10 12S4 19 4 11Z" fill="var(--il-warning)"/><path d="M4 4C-4 4-4 14 4 14M24 4c8 0 8 10 0 10" fill="none" stroke="var(--il-warning)" stroke-width="3"/><path d="M14 23v6M8 30h12" stroke="var(--il-warning-ink)" stroke-width="3" stroke-linecap="round"/></g>' : '';
    return '<svg class="il-world-scene is-secondary" viewBox="0 0 760 360" role="img" aria-label="'+(isEso?'Your study space':'Tu base de aprendizaje')+'">'
      +room+shelf+board+desk+monitor+lamp+trophy
      +(items.has("world-plant")?'<g transform="translate(392 206)">'+shadow([16,66,26,7])+'<path d="M16 64V24M16 40C-2 34-3 16-2 8c18 4 24 15 18 32Zm0 4c18-6 22-24 21-36-17 3-24 15-21 36Z" fill="var(--il-success)"/><path d="M2 64h30l-5 32H7Z" fill="'+accent+'"/></g>':'')
      +(items.has("world-travel-board")?'<g transform="translate(196 54)"><rect width="120" height="88" rx="8" fill="var(--il-surface)" stroke="'+shelfWood+'" stroke-width="5"/><path d="m14 70 28-30 19 17 17-21 24 33" fill="none" stroke="var(--il-focus)" stroke-width="6" stroke-linecap="round"/><circle cx="40" cy="34" r="6" fill="var(--il-secondary)"/></g>':'')
      +(items.has("world-music-poster")?'<g transform="translate(648 54)"><rect width="92" height="104" rx="8" fill="var(--il-secondary-soft)"/><path d="M54 26v42c0 11-19 15-24 5-4-10 11-17 24-11M54 34l22-6v31" fill="none" stroke="var(--il-secondary)" stroke-width="6" stroke-linecap="round"/></g>':'')
      +(items.has("world-tech-desk")?'<g transform="translate(320 214)"><rect width="70" height="44" rx="6" fill="'+NAVY_DEEP+'"/><rect x="6" y="6" width="58" height="28" rx="2" fill="'+screen+'"/><path d="M35 44v10M22 54h26" stroke="'+NAVY+'" stroke-width="5" stroke-linecap="round"/></g>':'')+'</svg>';
  }
  function scene(settings, progress, band, options) { return band === "p12" || band === "p34" ? garden(settings, progress, Object.assign({}, options, { band })) : personalSpace(settings, progress, Object.assign({}, options, { band })); }

  function objectThumb(visual) {
    const pieces = {
      flowers:'<g stroke="var(--il-success)" stroke-width="4"><path d="M28 58v25M50 50v33M72 58v25"/></g><g fill="var(--il-secondary)"><circle cx="28" cy="49" r="10"/><circle cx="50" cy="41" r="10"/><circle cx="72" cy="49" r="10"/></g>',
      bench:'<g stroke="var(--il-primary)" stroke-width="8" stroke-linecap="round"><path d="M14 39h72M19 59h62M28 59l-7 27M72 59l7 27"/></g>',
      'toy-plane':'<path d="m15 52 73-31-25 64-15-28Z" fill="var(--il-secondary)"/><path d="m88 21-40 36 15 28Z" fill="var(--il-coral-ink)"/>',
      ball:'<circle cx="50" cy="50" r="33" fill="var(--il-warning)"/><path d="M22 47h56M50 18v64" stroke="var(--il-surface)" stroke-width="5"/>',
      pond:'<ellipse cx="50" cy="57" rx="40" ry="21" fill="var(--il-primary-soft)" stroke="var(--il-focus)" stroke-width="5"/>',
      bicycle:'<g fill="none" stroke="var(--il-primary)" stroke-width="6"><circle cx="25" cy="67" r="18"/><circle cx="76" cy="67" r="18"/><path d="m25 67 21-35 15 35H25l17-25h27l7 25"/></g>',
      lanterns:'<path d="M50 13v74" stroke="var(--il-primary)" stroke-width="6"/><circle cx="50" cy="29" r="15" fill="var(--il-warning-soft)" stroke="var(--il-warning)" stroke-width="5"/>',
      greenhouse:'<path d="m13 45 37-33 37 33v43H13Z" fill="var(--il-success-soft)" stroke="var(--il-success)" stroke-width="5"/><path d="M50 12v76M13 45h74" stroke="var(--il-success)" stroke-width="4"/>',
      plant:'<path d="M50 70V30M50 50C23 44 21 22 23 13c23 4 32 18 27 37Zm0 5c25-6 31-25 30-40-23 4-33 17-30 40Z" fill="var(--il-success)"/><path d="M25 69h50l-8 24H33Z" fill="var(--il-secondary)"/>',
      travel:'<rect x="10" y="14" width="80" height="72" rx="8" fill="var(--il-surface)" stroke="var(--il-primary)" stroke-width="5"/><path d="m22 70 20-24 14 13 14-18 17 29" fill="none" stroke="var(--il-success)" stroke-width="6"/>',
      music:'<path d="M54 17v47c0 16-26 19-31 6-5-12 13-21 31-13M54 28l27-8v34" fill="none" stroke="var(--il-secondary)" stroke-width="8" stroke-linecap="round"/>',
      tech:'<rect x="9" y="16" width="82" height="56" rx="7" fill="var(--il-primary-soft)" stroke="var(--il-primary)" stroke-width="6"/><path d="M50 72v14M29 87h42" stroke="var(--il-primary)" stroke-width="6" stroke-linecap="round"/>',
      'bg-day':'<circle cx="50" cy="50" r="31" fill="var(--il-warning-soft)"/><g stroke="var(--il-warning)" stroke-width="4"><path d="M50 7v12M50 81v12M7 50h12M81 50h12"/></g>',
      'bg-sunset':'<circle cx="50" cy="47" r="29" fill="var(--il-secondary)"/><path d="M12 72h76" stroke="var(--il-primary)" stroke-width="7"/>',
      'bg-city':'<g fill="var(--il-primary)"><rect x="12" y="42" width="20" height="45"/><rect x="39" y="20" width="25" height="67"/><rect x="70" y="50" width="18" height="37"/></g>',
      'bg-night':'<path d="M31 14a36 36 0 1 0 53 48 31 31 0 0 1-53-48Z" fill="var(--il-primary)"/><circle cx="78" cy="22" r="5" fill="var(--il-warning)"/>'
    };
    return '<svg viewBox="0 0 100 100" aria-hidden="true">'+(pieces[visual] || pieces.plant)+'</svg>';
  }
  function item(item, currentSettings, progress) {
    if (!item) return "";
    if (/^pet-/.test(item.id)) return item.id === "pet-none" ? objectThumb("plant") : companion(item.id);
    if (item.category === "world") return objectThumb(item.visual);
    const settings = Object.assign({ avatarTheme:"navy", avatarBase:"masculine", avatarSkin:"tone-2", avatarHair:"short", avatarHairColor:"brown", avatarExpression:"smile", avatarTop:"tee", avatarAccessory:"none" }, currentSettings || {});
    settings.avatarCustomised = true;
    if (item.settingKey) settings[item.settingKey] = item.settingValue;
    return avatar(settings, progress, { compact:true });
  }

  return { avatar, companion, garden, personalSpace, scene, item };
});
