/* ============================================================
   Interlanguage HOME · ilustración modular del mundo personal
   SVG original, basado únicamente en tokens de la plataforma.
   ============================================================ */
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ILWorldVisual = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function setOf(progress) {
    const raw = (progress && progress.owned) || [];
    const map = { hat:"avatar-cap", glass:"space-headphones", cat:"pet-nube" };
    return new Set(["garden-tree"].concat(raw.map(id => map[id] || id)));
  }
  function themeColor(theme) {
    return { coral:"var(--il-secondary)", aqua:"var(--il-success)", navy:"var(--il-primary)" }[theme] || "var(--il-primary)";
  }
  function skinColor(value) {
    return { "tone-1":"var(--il-avatar-skin-1)", "tone-2":"var(--il-avatar-skin-2)", "tone-3":"var(--il-avatar-skin-3)", "tone-4":"var(--il-avatar-skin-4)" }[value] || "var(--il-avatar-skin-2)";
  }
  function hairColor(value) {
    return { dark:"var(--il-avatar-hair-dark)", brown:"var(--il-avatar-hair-brown)", gold:"var(--il-avatar-hair-gold)", copper:"var(--il-avatar-hair-copper)" }[value] || "var(--il-avatar-hair-dark)";
  }
  function avatar(settings, progress, options) {
    settings = settings || {}; progress = progress || {}; options = options || {};
    const body = themeColor(settings.avatarTheme);
    const skin = skinColor(settings.avatarSkin);
    const hair = hairColor(settings.avatarHairColor);
    const hairStyle = settings.avatarHair || "short";
    const equippedHat = progress.hat === "avatar-cap" || progress.hat === "hat" || progress.hat === "🧢";
    const equippedBag = progress.acc === "avatar-backpack" || progress.acc === "backpack";
    const jacket = progress.hat === "avatar-jacket";
    const hairPath = hairStyle === "long"
      ? '<path d="M39 39c0-18 9-27 25-27s25 9 25 27v31H39Z" fill="'+hair+'"/>'
      : hairStyle === "waves"
        ? '<path d="M39 39c1-18 10-27 25-27 13 0 23 8 25 23-7 2-9-7-15-4-7 3-11-5-17-1-7 5-12 4-18 2Z" fill="'+hair+'"/>'
        : hairStyle === "curls"
          ? '<g fill="'+hair+'"><circle cx="45" cy="33" r="10"/><circle cx="56" cy="23" r="11"/><circle cx="69" cy="22" r="11"/><circle cx="82" cy="31" r="10"/><circle cx="77" cy="43" r="10"/><circle cx="49" cy="44" r="10"/></g>'
          : '<path d="M39 40c0-18 9-28 25-28 15 0 24 10 25 27-8-3-12-11-17-12-8 9-19 12-33 13Z" fill="'+hair+'"/>';
    const cap = equippedHat ? '<path d="M40 28c4-13 13-19 25-19 13 0 22 7 25 19H40Z" fill="var(--il-secondary)"/><path d="M64 28h34c-2 7-12 8-23 5Z" fill="var(--il-coral-ink)"/>' : "";
    const bag = equippedBag ? '<path d="M25 83c0-10 7-16 16-16h5v39H29a4 4 0 0 1-4-4Z" fill="var(--il-secondary)"/><path d="M28 82h17" stroke="var(--il-coral-ink)" stroke-width="4"/>' : "";
    return '<svg class="il-student-avatar'+(options.compact?' is-compact':'')+'" viewBox="0 0 128 128" aria-hidden="true">'
      +'<circle cx="64" cy="64" r="58" fill="var(--il-avatar-halo)"/>'+bag+hairPath
      +'<circle cx="64" cy="46" r="24" fill="'+skin+'"/>'
      +'<path d="M54 46h1M73 46h1" stroke="var(--il-text-primary)" stroke-width="4" stroke-linecap="round"/><path d="M58 57c4 3 8 3 12 0" fill="none" stroke="var(--il-text-primary)" stroke-width="2.5" stroke-linecap="round"/>'
      +'<path d="M35 118c2-31 15-47 29-47s27 16 29 47Z" fill="'+(jacket?'var(--il-navy-2)':body)+'"/><path d="M64 76v38" stroke="var(--il-surface)" stroke-opacity=".35" stroke-width="3"/>'
      +cap+'</svg>';
  }
  function companion(id) {
    if (id === "pet-brisa") return '<svg class="il-companion" viewBox="0 0 100 100" aria-hidden="true"><path d="M22 40 10 22c14-1 23 5 28 14M78 40l12-18c-14-1-23 5-28 14" fill="var(--il-avatar-hair-brown)"/><circle cx="50" cy="53" r="34" fill="var(--il-warning-soft)"/><path d="M38 50h1M61 50h1" stroke="var(--il-text-primary)" stroke-width="5" stroke-linecap="round"/><ellipse cx="50" cy="63" rx="7" ry="5" fill="var(--il-text-primary)"/><path d="M44 70c4 4 8 4 12 0" fill="none" stroke="var(--il-text-primary)" stroke-width="3" stroke-linecap="round"/></svg>';
    if (id === "pet-menta") return '<svg class="il-companion" viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="47" cy="58" rx="34" ry="25" fill="var(--il-success)"/><path d="M24 58c5-16 14-23 25-23 12 0 22 8 27 23Z" fill="var(--il-success-soft)" stroke="var(--il-success)" stroke-width="3"/><circle cx="81" cy="57" r="13" fill="var(--il-jade-tint)"/><path d="M83 53h1" stroke="var(--il-text-primary)" stroke-width="4" stroke-linecap="round"/><path d="M20 75h-5M45 82v6M64 78l4 7" stroke="var(--il-success)" stroke-width="7" stroke-linecap="round"/></svg>';
    return '<svg class="il-companion" viewBox="0 0 100 100" aria-hidden="true"><path d="m25 39 4-24 18 17M75 39l-4-24-18 17" fill="var(--il-primary)"/><circle cx="50" cy="55" r="34" fill="var(--il-primary-soft)"/><path d="M38 51h1M61 51h1" stroke="var(--il-text-primary)" stroke-width="5" stroke-linecap="round"/><path d="m50 58-5 5h10Z" fill="var(--il-secondary)"/><path d="M50 64c-4 5-8 5-11 2m11-2c4 5 8 5 11 2" fill="none" stroke="var(--il-text-primary)" stroke-width="2.5" stroke-linecap="round"/></svg>';
  }
  function activePet(progress) {
    const owned = setOf(progress);
    if (progress && ["pet-nube","pet-brisa","pet-menta"].indexOf(progress.acc) >= 0) return progress.acc;
    return ["pet-menta","pet-brisa","pet-nube"].find(id => owned.has(id)) || "";
  }
  function garden(progress) {
    const owned = setOf(progress); const pet = activePet(progress);
    return '<svg class="il-world-scene" viewBox="0 0 760 360" role="img" aria-label="Tu jardín de aprendizaje">'
      +'<path d="M0 0h760v360H0Z" fill="var(--il-primary-soft)"/><circle cx="645" cy="70" r="34" fill="var(--il-warning-soft)"/><path d="M0 250c130-35 235 18 360-8 126-27 250-9 400 33v85H0Z" fill="var(--il-success-soft)"/>'
      +'<path d="M92 260c55-52 97-54 145-18s93 27 142 1 103-23 166 10 114 30 172 4" fill="none" stroke="var(--il-border-strong)" stroke-width="16" stroke-linecap="round"/>'
      +'<g transform="translate(92 86)"><path d="M76 172V83" stroke="var(--il-avatar-hair-brown)" stroke-width="18" stroke-linecap="round"/><circle cx="43" cy="73" r="42" fill="var(--il-success)"/><circle cx="91" cy="53" r="48" fill="var(--il-success)"/><circle cx="119" cy="93" r="38" fill="var(--il-jade-deep)"/></g>'
      +(owned.has("garden-flowers")?'<g fill="var(--il-secondary)"><circle cx="286" cy="282" r="9"/><circle cx="315" cy="298" r="8"/><circle cx="345" cy="280" r="9"/></g><g stroke="var(--il-success)" stroke-width="4"><path d="M286 291v21M315 306v15M345 289v22"/></g>':'')
      +(owned.has("garden-bench")?'<g transform="translate(430 225)" stroke="var(--il-primary)" stroke-width="8" stroke-linecap="round"><path d="M0 28h105M7 50h91M17 50l-8 38M87 50l8 38"/></g>':'')
      +(owned.has("garden-lanterns")?'<g stroke="var(--il-primary)" stroke-width="4"><path d="M405 176v92M610 186v91"/></g><g fill="var(--il-warning)"><circle cx="405" cy="181" r="12"/><circle cx="610" cy="191" r="12"/></g>':'')
      +(owned.has("garden-pond")?'<ellipse cx="560" cy="307" rx="92" ry="27" fill="var(--il-primary-soft)" stroke="var(--il-focus)" stroke-width="4"/>':'')
      +(owned.has("garden-greenhouse")?'<g transform="translate(600 126)" fill="var(--il-surface)" fill-opacity=".72" stroke="var(--il-success)" stroke-width="5"><path d="m0 61 52-50 52 50v91H0Z"/><path d="M52 11v141M0 61h104"/></g>':'')
      +(pet?'<foreignObject x="300" y="190" width="110" height="110"><div xmlns="http://www.w3.org/1999/xhtml" class="il-scene-pet">'+companion(pet)+'</div></foreignObject>':'')
      +'</svg>';
  }
  function personalSpace(progress) {
    const owned = setOf(progress); const night = owned.has("space-night");
    return '<svg class="il-world-scene is-secondary" viewBox="0 0 760 360" role="img" aria-label="Your personal space">'
      +'<path d="M0 0h760v360H0Z" fill="'+(night?'var(--il-primary)':'var(--il-surface-secondary)')+'"/><path d="M0 278h760v82H0Z" fill="var(--il-border)"/>'
      +'<rect x="72" y="72" width="170" height="130" rx="10" fill="var(--il-surface)" stroke="var(--il-border-strong)" stroke-width="5"/><path d="M96 169c38-50 70-14 118-68" fill="none" stroke="var(--il-success)" stroke-width="8"/><circle cx="214" cy="101" r="8" fill="var(--il-secondary)"/>'
      +'<path d="M322 254h306M354 254v68M595 254v68" stroke="var(--il-primary)" stroke-width="15" stroke-linecap="round"/><rect x="338" y="213" width="270" height="48" rx="10" fill="var(--il-primary)"/>'
      +(owned.has("space-headphones")?'<path d="M465 208v-19a28 28 0 0 1 56 0v19" fill="none" stroke="var(--il-secondary)" stroke-width="8"/><rect x="455" y="195" width="16" height="27" rx="7" fill="var(--il-secondary)"/><rect x="515" y="195" width="16" height="27" rx="7" fill="var(--il-secondary)"/>':'')
      +(owned.has("space-travel")?'<g transform="translate(285 70)"><rect width="120" height="92" rx="8" fill="var(--il-surface)" stroke="var(--il-border-strong)" stroke-width="5"/><path d="m16 74 29-31 20 18 18-22 22 35" fill="none" stroke="var(--il-focus)" stroke-width="7"/></g>':'')
      +(owned.has("space-tech")?'<g transform="translate(535 121)"><rect width="142" height="92" rx="8" fill="var(--il-primary-soft)" stroke="var(--il-primary)" stroke-width="6"/><path d="M71 92v26M39 118h64" stroke="var(--il-primary)" stroke-width="7" stroke-linecap="round"/></g>':'')
      +'</svg>';
  }

  function item(item) {
    if (!item) return "";
    if (item.group === "pet") return companion(item.id);
    if (item.group === "avatar") {
      const settings = { avatarTheme:item.visual === "jacket" ? "navy" : "coral", avatarSkin:"tone-2", avatarHair:"short", avatarHairColor:"dark" };
      const progress = item.slot === "hat" ? { hat:item.id } : { acc:item.id };
      return avatar(settings, progress, { compact:true });
    }
    const pieces = {
      tree:'<path d="M48 85V46" stroke="var(--il-avatar-hair-brown)" stroke-width="10" stroke-linecap="round"/><circle cx="34" cy="39" r="22" fill="var(--il-success)"/><circle cx="58" cy="31" r="25" fill="var(--il-jade-deep)"/>',
      flowers:'<g stroke="var(--il-success)" stroke-width="4"><path d="M30 54v30M50 48v36M70 56v28"/></g><g fill="var(--il-secondary)"><circle cx="30" cy="45" r="10"/><circle cx="50" cy="39" r="10"/><circle cx="70" cy="47" r="10"/></g>',
      bench:'<g stroke="var(--il-primary)" stroke-width="8" stroke-linecap="round"><path d="M15 38h70M20 58h60M28 58l-7 27M72 58l7 27"/></g>',
      lanterns:'<path d="M50 18v66" stroke="var(--il-primary)" stroke-width="6"/><circle cx="50" cy="30" r="15" fill="var(--il-warning-soft)" stroke="var(--il-warning)" stroke-width="5"/>',
      pond:'<ellipse cx="50" cy="58" rx="39" ry="19" fill="var(--il-primary-soft)" stroke="var(--il-focus)" stroke-width="5"/><path d="M31 55c8-6 14 8 22 0s13 7 21 0" fill="none" stroke="var(--il-focus)" stroke-width="3"/>',
      greenhouse:'<path d="m14 45 36-32 36 32v42H14Z" fill="var(--il-success-soft)" stroke="var(--il-success)" stroke-width="5"/><path d="M50 13v74M14 45h72" stroke="var(--il-success)" stroke-width="4"/>',
      night:'<path d="M30 17a34 34 0 1 0 50 45 29 29 0 0 1-50-45Z" fill="var(--il-primary)"/><circle cx="75" cy="25" r="5" fill="var(--il-warning)"/>',
      headphones:'<path d="M22 56V45a28 28 0 0 1 56 0v11" fill="none" stroke="var(--il-primary)" stroke-width="8"/><rect x="14" y="52" width="18" height="30" rx="8" fill="var(--il-secondary)"/><rect x="68" y="52" width="18" height="30" rx="8" fill="var(--il-secondary)"/>',
      travel:'<rect x="12" y="16" width="76" height="68" rx="8" fill="var(--il-surface)" stroke="var(--il-primary)" stroke-width="5"/><path d="m23 70 20-24 13 13 13-18 18 29" fill="none" stroke="var(--il-success)" stroke-width="6"/>',
      tech:'<rect x="10" y="17" width="80" height="54" rx="7" fill="var(--il-primary-soft)" stroke="var(--il-primary)" stroke-width="6"/><path d="M50 72v13M29 86h42" stroke="var(--il-primary)" stroke-width="6" stroke-linecap="round"/>'
    };
    return '<svg viewBox="0 0 100 100" aria-hidden="true">'+(pieces[item.visual] || pieces.tree)+'</svg>';
  }

  return { avatar, companion, garden, personalSpace, activePet, item };
});
