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
    return '<img class="il-student-avatar il-avatar-master avatar-base--'+base+classes+'" src="assets/avatar/'+master+'.png" alt="" draggable="false" decoding="async">';
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
  function tree(level) {
    const scale = [.66,.78,.9,1,1.12][Math.max(1, Math.min(5, level)) - 1];
    return '<g class="world-tree" transform="translate(112 82) scale('+scale+')"><path d="M76 186V83" stroke="var(--il-avatar-hair-brown)" stroke-width="20" stroke-linecap="round"/><circle cx="43" cy="73" r="42" fill="var(--il-success)"/><circle cx="91" cy="53" r="48" fill="var(--il-success)"/><circle cx="119" cy="93" r="38" fill="var(--il-jade-deep)"/></g>';
  }
  function garden(settings, progress, options) {
    options = options || {}; const items = set(options.activeItems || settings.activeWorldItems); const level = options.level || 1;
    let posts = "";
    for (let x = 250; x <= 470; x += 26) posts += '<path d="M'+x+' 296v-30h12v30Z"/><path d="M'+x+' 266l6-8 6 8Z"/>';
    const fence = '<g fill="var(--il-surface)" stroke="var(--il-border-strong)" stroke-width="2">'+posts+'</g><g stroke="var(--il-border-strong)" stroke-width="4" fill="none"><path d="M244 275h236M244 287h236"/></g>';
    return '<svg class="il-world-scene" viewBox="0 0 760 360" role="img" aria-label="Tu mundo de aprendizaje">'+sky(settings.worldBackground, false)
      +'<g fill="var(--il-surface)" opacity=".9"><ellipse cx="150" cy="64" rx="42" ry="19"/><ellipse cx="114" cy="74" rx="27" ry="13"/><ellipse cx="188" cy="75" rx="26" ry="13"/><ellipse cx="474" cy="50" rx="35" ry="16"/><ellipse cx="512" cy="58" rx="23" ry="11"/></g>'
      +'<path d="M0 246c130-35 235 18 360-8 126-27 250-9 400 33v89H0Z" fill="var(--il-success-soft)"/>'
      +'<path d="M0 300c120-26 210 8 330-4 120-12 250-6 430 14v50H0Z" fill="color-mix(in srgb,var(--il-success) 24%,var(--il-surface))"/>'
      +fence
      +'<g fill="var(--il-success)"><circle cx="70" cy="300" r="30"/><circle cx="104" cy="293" r="23"/><circle cx="40" cy="305" r="19"/><circle cx="706" cy="300" r="28"/><circle cx="678" cy="296" r="21"/><circle cx="732" cy="307" r="17"/></g>'
      +'<g fill="var(--il-jade-deep)" opacity=".45"><circle cx="86" cy="307" r="12"/><circle cx="690" cy="307" r="11"/></g>'
      +'<g fill="var(--il-warning)"><circle cx="56" cy="291" r="5"/><circle cx="94" cy="284" r="5"/><circle cx="700" cy="290" r="5"/><circle cx="724" cy="300" r="5"/></g><g fill="var(--il-secondary)"><circle cx="74" cy="298" r="4"/><circle cx="714" cy="294" r="4"/></g>'
      +'<g stroke="var(--il-success)" stroke-width="3" stroke-linecap="round" opacity=".85"><path d="M182 322v-12M190 323v-15M198 322v-12"/><path d="M556 320v-12M564 321v-15M572 320v-12"/></g>'
      +'<path d="M80 283c125-50 211-17 307-5s180-23 291-2" fill="none" stroke="var(--il-border-strong)" stroke-width="12" stroke-linecap="round" opacity=".45"/>'+tree(level)
      +(items.has("world-flowers")?'<g fill="var(--il-secondary)"><circle cx="280" cy="286" r="9"/><circle cx="314" cy="300" r="8"/><circle cx="348" cy="282" r="9"/></g><g stroke="var(--il-success)" stroke-width="4"><path d="M280 295v20M314 308v14M348 291v22"/></g>':'')
      +(items.has("world-bench")?'<g transform="translate(425 225)" stroke="var(--il-primary)" stroke-width="8" stroke-linecap="round"><path d="M0 28h105M7 50h91M17 50l-8 38M87 50l8 38"/></g>':'')
      +(items.has("world-toy-plane")?'<path d="m345 240 43-19-15 36-9-15Z" fill="var(--il-secondary)"/>':'')
      +(items.has("world-ball")?'<circle cx="415" cy="310" r="17" fill="var(--il-warning)"/><path d="M402 306h26M415 293v34" stroke="var(--il-surface)" stroke-width="3"/>':'')
      +(items.has("world-pond")?'<ellipse cx="610" cy="310" rx="84" ry="24" fill="var(--il-primary-soft)" stroke="var(--il-focus)" stroke-width="4"/>':'')
      +(items.has("world-bicycle")?'<g transform="translate(535 220)" fill="none" stroke="var(--il-primary)" stroke-width="6"><circle cx="22" cy="62" r="20"/><circle cx="92" cy="62" r="20"/><path d="m22 62 27-42 21 42H22l20-30h40l10 30M45 19h17"/></g>':'')
      +(items.has("world-lanterns")?'<g stroke="var(--il-primary)" stroke-width="4"><path d="M395 174v105M683 174v104"/></g><g fill="var(--il-warning)"><circle cx="395" cy="180" r="12"/><circle cx="683" cy="180" r="12"/></g>':'')
      +(items.has("world-greenhouse")?'<g transform="translate(586 105)" fill="var(--il-surface)" fill-opacity=".72" stroke="var(--il-success)" stroke-width="5"><path d="m0 61 52-50 52 50v101H0Z"/><path d="M52 11v151M0 61h104"/></g>':'')+'</svg>';
  }
  function personalSpace(settings, progress, options) {
    options = options || {}; const items = set(options.activeItems || settings.activeWorldItems); const isEso = options.band === "eso";
    return '<svg class="il-world-scene is-secondary" viewBox="0 0 760 360" role="img" aria-label="'+(isEso?'Your personal space':'Tu base personal')+'">'+sky(settings.worldBackground, true)
      +'<path d="M0 278h760v82H0Z" fill="var(--il-border)"/><rect x="64" y="70" width="168" height="125" rx="10" fill="var(--il-surface)" stroke="var(--il-border-strong)" stroke-width="5"/><path d="M88 165c38-50 70-14 118-68" fill="none" stroke="var(--il-success)" stroke-width="8"/><circle cx="206" cy="97" r="8" fill="var(--il-secondary)"/>'
      +'<path d="M322 254h306M354 254v68M595 254v68" stroke="var(--il-primary)" stroke-width="15" stroke-linecap="round"/><rect x="338" y="213" width="270" height="48" rx="10" fill="var(--il-primary)"/>'
      +(items.has("world-plant")?'<g transform="translate(370 155)"><path d="M27 59V25M27 40C8 34 7 18 8 10c18 4 24 15 19 30Zm0 4c18-5 22-19 22-31-17 3-24 13-22 31Z" fill="var(--il-success)"/><path d="M8 59h39l-6 35H14Z" fill="var(--il-secondary)"/></g>':'')
      +(items.has("world-travel-board")?'<g transform="translate(270 65)"><rect width="126" height="94" rx="8" fill="var(--il-surface)" stroke="var(--il-border-strong)" stroke-width="5"/><path d="m16 74 29-31 20 18 18-22 25 35" fill="none" stroke="var(--il-focus)" stroke-width="7"/></g>':'')
      +(items.has("world-music-poster")?'<g transform="translate(430 66)"><rect width="100" height="112" rx="8" fill="var(--il-secondary-soft)"/><path d="M58 27v45c0 12-20 16-25 6-5-11 11-19 25-12M58 36l24-7v34" fill="none" stroke="var(--il-secondary)" stroke-width="7" stroke-linecap="round"/></g>':'')
      +(items.has("world-tech-desk")?'<g transform="translate(520 118)"><rect width="150" height="94" rx="8" fill="var(--il-primary-soft)" stroke="var(--il-primary)" stroke-width="6"/><path d="M75 94v24M42 118h66" stroke="var(--il-primary)" stroke-width="7" stroke-linecap="round"/></g>':'')+'</svg>';
  }
  function scene(settings, progress, band, options) { return band === "p12" || band === "p34" ? garden(settings, progress, options) : personalSpace(settings, progress, Object.assign({}, options, { band })); }

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
