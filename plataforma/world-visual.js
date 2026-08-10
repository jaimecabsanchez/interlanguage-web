/* ============================================================
   Interlanguage HOME · avatar humano y mundos SVG modulares
   Ilustración original, ligera y ampliable mediante datos.
   ============================================================ */
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ILWorldVisual = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const skin = value => ({ "tone-1":"var(--il-avatar-skin-1)", "tone-2":"var(--il-avatar-skin-2)", "tone-3":"var(--il-avatar-skin-3)", "tone-4":"var(--il-avatar-skin-4)" }[value] || "var(--il-avatar-skin-2)");
  const hair = value => ({ dark:"var(--il-avatar-hair-dark)", brown:"var(--il-avatar-hair-brown)", gold:"var(--il-avatar-hair-gold)", copper:"var(--il-avatar-hair-copper)" }[value] || "var(--il-avatar-hair-dark)");
  const theme = value => ({ coral:"var(--il-secondary)", aqua:"var(--il-success)", navy:"var(--il-primary)" }[value] || "var(--il-primary)");
  const set = value => new Set(Array.isArray(value) ? value : []);

  function hairBack(style, colour) {
    if (style === "long") return '<path d="M49 63c0-34 17-51 42-51s42 18 42 51v73H49Z" fill="'+colour+'"/>';
    if (style === "waves") return '<path d="M50 63c0-33 17-51 41-51 25 0 42 18 42 53-11-4-15-18-25-16-12 3-17-9-28-3-12 7-20 9-30 7Z" fill="'+colour+'"/>';
    if (style === "curls") return '<g fill="'+colour+'"><circle cx="57" cy="45" r="17"/><circle cx="69" cy="27" r="18"/><circle cx="91" cy="22" r="19"/><circle cx="113" cy="29" r="18"/><circle cx="126" cy="49" r="17"/><circle cx="117" cy="68" r="17"/><circle cx="62" cy="68" r="17"/></g>';
    return '<path d="M49 63c0-34 17-51 42-51 24 0 41 17 42 49-13-4-20-18-29-18-13 12-31 18-55 20Z" fill="'+colour+'"/>';
  }
  function face(expression, colour) {
    const eyes = expression === "bright"
      ? '<path class="avatar-eye" d="M75 65c3-4 7-4 10 0M99 65c3-4 7-4 10 0" fill="none" stroke="var(--il-text-primary)" stroke-width="3" stroke-linecap="round"/>'
      : '<path class="avatar-eye" d="M79 64h1M103 64h1" stroke="var(--il-text-primary)" stroke-width="5" stroke-linecap="round"/>';
    const mouth = expression === "calm"
      ? '<path d="M85 80h12" stroke="var(--il-text-primary)" stroke-width="2.6" stroke-linecap="round"/>'
      : expression === "bright"
        ? '<path d="M82 78c6 9 14 9 20 0Z" fill="var(--il-surface)" stroke="var(--il-text-primary)" stroke-width="2" stroke-linejoin="round"/>'
        : '<path d="M84 78c5 5 11 5 16 0" fill="none" stroke="var(--il-text-primary)" stroke-width="2.8" stroke-linecap="round"/>';
    return '<circle cx="55" cy="67" r="8" fill="'+colour+'"/><circle cx="127" cy="67" r="8" fill="'+colour+'"/><circle cx="91" cy="64" r="38" fill="'+colour+'"/>'+eyes+mouth;
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

  function avatar(settings, progress, options) {
    settings = settings || {}; options = options || {};
    const skinTone = skin(settings.avatarSkin); const hairTone = hair(settings.avatarHairColor); const bodyTone = theme(settings.avatarTheme);
    const top = settings.avatarTop || "tee"; const acc = settings.avatarAccessory || "none"; const expression = settings.avatarExpression || "smile";
    return '<svg class="il-student-avatar'+(options.compact ? ' is-compact' : '')+'" viewBox="0 0 180 260" aria-hidden="true">'
      +'<g class="avatar-idle">'+backpack(acc)+hairBack(settings.avatarHair || "short", hairTone)+face(expression, skinTone)
      +'<path d="M80 92v15c0 8 22 8 22 0V92" fill="'+skinTone+'"/>'+clothing(top, bodyTone)
      +'<path d="M51 128c-15 16-20 42-18 68M131 128c15 16 20 42 18 68" fill="none" stroke="'+skinTone+'" stroke-width="16" stroke-linecap="round"/>'
      +'<path d="M61 194v44M121 194v44" stroke="var(--il-primary)" stroke-width="21" stroke-linecap="round"/><path d="M45 244h34M104 244h34" stroke="var(--il-text-primary)" stroke-width="17" stroke-linecap="round"/>'
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
    return '<svg class="il-world-scene" viewBox="0 0 760 360" role="img" aria-label="Tu mundo de aprendizaje">'+sky(settings.worldBackground, false)
      +'<path d="M0 246c130-35 235 18 360-8 126-27 250-9 400 33v89H0Z" fill="var(--il-success-soft)"/><path d="M80 283c125-50 211-17 307-5s180-23 291-2" fill="none" stroke="var(--il-border-strong)" stroke-width="14" stroke-linecap="round"/>'+tree(level)
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
    const settings = Object.assign({ avatarTheme:"navy", avatarSkin:"tone-2", avatarHair:"short", avatarHairColor:"dark", avatarExpression:"smile", avatarTop:"tee", avatarAccessory:"none" }, currentSettings || {});
    if (item.settingKey) settings[item.settingKey] = item.settingValue;
    return avatar(settings, progress, { compact:true });
  }

  return { avatar, companion, garden, personalSpace, scene, item };
});
