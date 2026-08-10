/* ============================================================
   Interlanguage HOME · catálogo data-driven de personalización
   Los desbloqueos dependen del progreso educativo, no de precios.
   ============================================================ */
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ILWorldData = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const ALL = ["p12", "p34", "p56", "eso"];
  const PRIMARY = ["p12", "p34", "p56"];
  const YOUNG = ["p12", "p34"];
  const OLDER = ["p56", "eso"];
  const always = Object.freeze({ type:"always", value:0 });
  const missions = value => ({ type:"missions", value });
  const streak = value => ({ type:"streak", value });
  const stamp = value => ({ type:"stamp", value });
  const worldLevelRule = value => ({ type:"worldLevel", value });

  const CATALOG = Object.freeze([
    { id:"skin-1", category:"avatar", section:"Apariencia", name:"Tono claro", nameEn:"Light tone", visual:"skin-1", settingKey:"avatarSkin", settingValue:"tone-1", bands:ALL, unlock:always },
    { id:"skin-5", category:"avatar", section:"Apariencia", name:"Tono claro cálido", nameEn:"Warm light tone", visual:"skin-5", settingKey:"avatarSkin", settingValue:"tone-5", bands:ALL, unlock:always },
    { id:"skin-2", category:"avatar", section:"Apariencia", name:"Tono medio claro", nameEn:"Medium light", visual:"skin-2", settingKey:"avatarSkin", settingValue:"tone-2", bands:ALL, unlock:always },
    { id:"skin-6", category:"avatar", section:"Apariencia", name:"Tono medio cálido", nameEn:"Warm medium tone", visual:"skin-6", settingKey:"avatarSkin", settingValue:"tone-6", bands:ALL, unlock:always },
    { id:"skin-3", category:"avatar", section:"Apariencia", name:"Tono medio oscuro", nameEn:"Medium dark", visual:"skin-3", settingKey:"avatarSkin", settingValue:"tone-3", bands:ALL, unlock:always },
    { id:"skin-7", category:"avatar", section:"Apariencia", name:"Tono oscuro cálido", nameEn:"Warm dark tone", visual:"skin-7", settingKey:"avatarSkin", settingValue:"tone-7", bands:ALL, unlock:always },
    { id:"skin-4", category:"avatar", section:"Apariencia", name:"Tono oscuro", nameEn:"Dark tone", visual:"skin-4", settingKey:"avatarSkin", settingValue:"tone-4", bands:ALL, unlock:always },
    { id:"skin-8", category:"avatar", section:"Apariencia", name:"Tono profundo", nameEn:"Deep tone", visual:"skin-8", settingKey:"avatarSkin", settingValue:"tone-8", bands:ALL, unlock:always },
    { id:"hair-short", category:"avatar", section:"Pelo", name:"Corto", nameEn:"Short", visual:"hair-short", settingKey:"avatarHair", settingValue:"short", bands:ALL, unlock:always },
    { id:"hair-waves", category:"avatar", section:"Pelo", name:"Ondulado", nameEn:"Wavy", visual:"hair-waves", settingKey:"avatarHair", settingValue:"waves", bands:ALL, unlock:always },
    { id:"hair-curls", category:"avatar", section:"Pelo", name:"Rizado", nameEn:"Curly", visual:"hair-curls", settingKey:"avatarHair", settingValue:"curls", bands:ALL, unlock:always },
    { id:"hair-long", category:"avatar", section:"Pelo", name:"Largo", nameEn:"Long", visual:"hair-long", settingKey:"avatarHair", settingValue:"long", bands:ALL, unlock:always },
    { id:"hair-bob", category:"avatar", section:"Pelo", name:"Bob", nameEn:"Bob", visual:"hair-bob", settingKey:"avatarHair", settingValue:"bob", bands:ALL, unlock:always },
    { id:"hair-coils", category:"avatar", section:"Pelo", name:"Bucles", nameEn:"Coils", visual:"hair-coils", settingKey:"avatarHair", settingValue:"coils", bands:ALL, unlock:always },
    { id:"hair-fade", category:"avatar", section:"Pelo", name:"Degradado", nameEn:"Fade", visual:"hair-fade", settingKey:"avatarHair", settingValue:"fade", bands:ALL, unlock:always },
    { id:"hair-braids", category:"avatar", section:"Pelo", name:"Trenzas", nameEn:"Braids", visual:"hair-braids", settingKey:"avatarHair", settingValue:"braids", bands:ALL, unlock:always },
    { id:"hair-dark", category:"avatar", section:"Color de pelo", name:"Negro", nameEn:"Black", visual:"hair-dark", settingKey:"avatarHairColor", settingValue:"dark", bands:ALL, unlock:always },
    { id:"hair-brown", category:"avatar", section:"Color de pelo", name:"Castaño", nameEn:"Brown", visual:"hair-brown", settingKey:"avatarHairColor", settingValue:"brown", bands:ALL, unlock:always },
    { id:"hair-gold", category:"avatar", section:"Color de pelo", name:"Rubio", nameEn:"Blonde", visual:"hair-gold", settingKey:"avatarHairColor", settingValue:"gold", bands:ALL, unlock:always },
    { id:"hair-copper", category:"avatar", section:"Color de pelo", name:"Cobrizo", nameEn:"Copper", visual:"hair-copper", settingKey:"avatarHairColor", settingValue:"copper", bands:ALL, unlock:always },
    { id:"hair-ash", category:"avatar", section:"Color de pelo", name:"Ceniza", nameEn:"Ash", visual:"hair-ash", settingKey:"avatarHairColor", settingValue:"ash", bands:ALL, unlock:always },
    { id:"hair-red", category:"avatar", section:"Color de pelo", name:"Caoba", nameEn:"Auburn", visual:"hair-red", settingKey:"avatarHairColor", settingValue:"red", bands:ALL, unlock:always },
    { id:"expression-smile", category:"avatar", section:"Expresión", name:"Sonrisa", nameEn:"Smile", visual:"expression-smile", settingKey:"avatarExpression", settingValue:"smile", bands:ALL, unlock:always },
    { id:"expression-calm", category:"avatar", section:"Expresión", name:"Tranquila", nameEn:"Calm", visual:"expression-calm", settingKey:"avatarExpression", settingValue:"calm", bands:ALL, unlock:always },
    { id:"expression-bright", category:"avatar", section:"Expresión", name:"Entusiasmada", nameEn:"Bright", visual:"expression-bright", settingKey:"avatarExpression", settingValue:"bright", bands:ALL, unlock:missions(3) },

    { id:"top-tee", category:"clothing", section:"Ropa", name:"Camiseta de ruta", nameEn:"Route T-shirt", visual:"top-tee", settingKey:"avatarTop", settingValue:"tee", bands:ALL, unlock:always },
    { id:"top-hoodie", category:"clothing", section:"Ropa", name:"Sudadera Explorer", nameEn:"Explorer hoodie", visual:"top-hoodie", settingKey:"avatarTop", settingValue:"hoodie", bands:ALL, unlock:missions(3) },
    { id:"top-sweater", category:"clothing", section:"Ropa", name:"Jersey de viaje", nameEn:"Travel sweater", visual:"top-sweater", settingKey:"avatarTop", settingValue:"sweater", bands:ALL, unlock:missions(5) },
    { id:"top-shirt", category:"clothing", section:"Ropa", name:"Camisa clara", nameEn:"Clean shirt", visual:"top-shirt", settingKey:"avatarTop", settingValue:"shirt", bands:OLDER, unlock:missions(8) },
    { id:"top-school", category:"clothing", section:"Ropa", name:"Estilo School", nameEn:"School style", visual:"top-school", settingKey:"avatarTop", settingValue:"school", bands:PRIMARY, unlock:stamp("first-flight") },
    { id:"top-sport", category:"clothing", section:"Ropa", name:"Ropa deportiva", nameEn:"Sports top", visual:"top-sport", settingKey:"avatarTop", settingValue:"sport", bands:ALL, unlock:streak(5) },
    { id:"top-jacket", category:"clothing", section:"Ropa", name:"Chaqueta Explorer", nameEn:"Explorer jacket", visual:"top-jacket", settingKey:"avatarTop", settingValue:"jacket", bands:ALL, unlock:missions(10) },

    { id:"acc-none", category:"accessory", section:"Accesorios", name:"Sin accesorio", nameEn:"No accessory", visual:"acc-none", settingKey:"avatarAccessory", settingValue:"none", bands:ALL, unlock:always },
    { id:"acc-cap", category:"accessory", section:"Accesorios", name:"Gorra exploradora", nameEn:"Explorer cap", visual:"acc-cap", settingKey:"avatarAccessory", settingValue:"cap", bands:ALL, unlock:missions(3) },
    { id:"acc-headphones", category:"accessory", section:"Accesorios", name:"Auriculares", nameEn:"Headphones", visual:"acc-headphones", settingKey:"avatarAccessory", settingValue:"headphones", bands:ALL, unlock:missions(5) },
    { id:"acc-glasses", category:"accessory", section:"Accesorios", name:"Gafas redondas", nameEn:"Round glasses", visual:"acc-glasses", settingKey:"avatarAccessory", settingValue:"glasses", bands:ALL, unlock:missions(8) },
    { id:"acc-backpack", category:"accessory", section:"Accesorios", name:"Mochila de ruta", nameEn:"Route backpack", visual:"acc-backpack", settingKey:"avatarAccessory", settingValue:"backpack", bands:PRIMARY, unlock:stamp("first-flight") },
    { id:"acc-scarf", category:"accessory", section:"Accesorios", name:"Bufanda coral", nameEn:"Coral scarf", visual:"acc-scarf", settingKey:"avatarAccessory", settingValue:"scarf", bands:ALL, unlock:missions(15) },
    { id:"acc-badge", category:"accessory", section:"Accesorios", name:"Insignia Word Collector", nameEn:"Word Collector pin", visual:"acc-badge", settingKey:"avatarAccessory", settingValue:"badge", bands:ALL, unlock:stamp("word-collector") },

    { id:"bg-day", category:"world", section:"Fondos", name:"Día tranquilo", nameEn:"Clear day", visual:"bg-day", settingKey:"worldBackground", settingValue:"day", bands:ALL, unlock:always },
    { id:"bg-sunset", category:"world", section:"Fondos", name:"Atardecer", nameEn:"Sunset", visual:"bg-sunset", settingKey:"worldBackground", settingValue:"sunset", bands:ALL, unlock:missions(5) },
    { id:"bg-city", category:"world", section:"Fondos", name:"Ciudad", nameEn:"City", visual:"bg-city", settingKey:"worldBackground", settingValue:"city", bands:OLDER, unlock:missions(10) },
    { id:"bg-night", category:"world", section:"Fondos", name:"Noche de ruta", nameEn:"Night mode", visual:"bg-night", settingKey:"worldBackground", settingValue:"night", bands:ALL, unlock:missions(20) },
    { id:"world-flowers", category:"world", section:"Objetos", name:"Flores del camino", nameEn:"Route flowers", visual:"flowers", toggle:"world", bands:YOUNG, unlock:missions(5) },
    { id:"world-toy-plane", category:"world", section:"Objetos", name:"Avión de juguete", nameEn:"Toy plane", visual:"toy-plane", toggle:"world", bands:["p12"], unlock:missions(3) },
    { id:"world-bench", category:"world", section:"Objetos", name:"Banco de lectura", nameEn:"Reading bench", visual:"bench", toggle:"world", bands:PRIMARY, unlock:missions(5) },
    { id:"world-ball", category:"world", section:"Objetos", name:"Pelota", nameEn:"Ball", visual:"ball", toggle:"world", bands:YOUNG, unlock:streak(5) },
    { id:"world-pond", category:"world", section:"Objetos", name:"Estanque", nameEn:"Pond", visual:"pond", toggle:"world", bands:YOUNG, unlock:missions(15) },
    { id:"world-bicycle", category:"world", section:"Objetos", name:"Bicicleta", nameEn:"Bicycle", visual:"bicycle", toggle:"world", bands:YOUNG, unlock:missions(20) },
    { id:"world-lanterns", category:"world", section:"Objetos", name:"Luces de ruta", nameEn:"Route lights", visual:"lanterns", toggle:"world", bands:PRIMARY, unlock:stamp("weekly-explorer") },
    { id:"world-greenhouse", category:"world", section:"Objetos", name:"Invernadero", nameEn:"Greenhouse", visual:"greenhouse", toggle:"world", bands:YOUNG, unlock:worldLevelRule(5) },
    { id:"world-plant", category:"world", section:"Objetos", name:"Planta de escritorio", nameEn:"Desk plant", visual:"plant", toggle:"world", bands:OLDER, unlock:missions(5) },
    { id:"world-travel-board", category:"world", section:"Objetos", name:"Mural de viajes", nameEn:"Travel board", visual:"travel", toggle:"world", bands:OLDER, unlock:missions(10) },
    { id:"world-music-poster", category:"world", section:"Objetos", name:"Póster de música", nameEn:"Music poster", visual:"music", toggle:"world", bands:OLDER, unlock:streak(5) },
    { id:"world-tech-desk", category:"world", section:"Objetos", name:"Escritorio tecnológico", nameEn:"Tech desk", visual:"tech", toggle:"world", bands:OLDER, unlock:missions(20) },
    { id:"pet-none", category:"world", section:"Compañero", name:"Sin compañero", nameEn:"No companion", visual:"pet-none", settingKey:"worldCompanion", settingValue:"none", bands:YOUNG, unlock:always },
    { id:"pet-nube", category:"world", section:"Compañero", name:"Nube", nameEn:"Nube", visual:"cat", settingKey:"worldCompanion", settingValue:"pet-nube", bands:YOUNG, unlock:missions(5) },
    { id:"pet-brisa", category:"world", section:"Compañero", name:"Brisa", nameEn:"Brisa", visual:"dog", settingKey:"worldCompanion", settingValue:"pet-brisa", bands:YOUNG, unlock:missions(15) },
    { id:"pet-menta", category:"world", section:"Compañero", name:"Menta", nameEn:"Menta", visual:"turtle", settingKey:"worldCompanion", settingValue:"pet-menta", bands:YOUNG, unlock:worldLevelRule(5) }
  ]);

  const STAMP_NAMES = { "first-flight":"First Flight", "weekly-explorer":"Weekly Explorer", "word-collector":"Word Collector" };
  function band(value) { return ALL.indexOf(value) >= 0 ? value : "p56"; }
  function worldLevel(progress) {
    const lessons = Math.max(0, Number(progress && progress.lessons) || 0);
    if (lessons >= 40) return 5;
    if (lessons >= 20) return 4;
    if (lessons >= 10) return 3;
    if (lessons >= 5) return 2;
    return 1;
  }
  function levelMeta(progress) {
    const lessons = Math.max(0, Number(progress && progress.lessons) || 0); const level = worldLevel(progress);
    const starts = [0, 0, 5, 10, 20, 40]; const targets = [0, 5, 10, 20, 40, 40];
    if (level >= 5) return { level, lessons, start:40, target:40, remaining:0, percent:100 };
    const start = starts[level]; const target = targets[level];
    return { level, lessons, start, target, remaining:Math.max(0, target - lessons), percent:Math.min(100, Math.round((lessons - start) / (target - start) * 100)) };
  }
  function worldType(value) { const key = band(value); return key === "eso" ? "space" : (key === "p56" ? "base" : "garden"); }
  function context(progress, stamps, value) {
    return {
      band:band(value), lessons:Math.max(0, Number(progress && progress.lessons) || 0),
      streak:Math.max(0, Number(progress && progress.streak) || 0), worldLevel:worldLevel(progress),
      stamps:new Set((stamps || []).map(item => typeof item === "string" ? item : item.id).filter(Boolean))
    };
  }
  function catalogFor(value, category) {
    const key = band(value);
    return CATALOG.filter(item => item.bands.indexOf(key) >= 0 && (!category || item.category === category));
  }
  function valueFor(rule, ctx) {
    if (rule.type === "missions") return ctx.lessons;
    if (rule.type === "streak") return ctx.streak;
    if (rule.type === "worldLevel") return ctx.worldLevel;
    if (rule.type === "stamp") return ctx.stamps.has(rule.value) ? 1 : 0;
    return 1;
  }
  function requirement(item, ctx, secondary) {
    const rule = item.unlock || always; const current = valueFor(rule, ctx); const remaining = Math.max(0, Number(rule.value) - current);
    if (rule.type === "always") return secondary ? "Available" : "Disponible";
    if (rule.type === "stamp") return (secondary ? "Earn " : "Consigue ") + (STAMP_NAMES[rule.value] || rule.value);
    if (rule.type === "streak") return remaining > 0
      ? (secondary ? remaining + " more days in your streak" : "Mantén tu racha " + remaining + (remaining === 1 ? " día más" : " días más"))
      : (secondary ? "Streak achieved" : "Racha conseguida");
    if (rule.type === "worldLevel") return remaining > 0
      ? (secondary ? "Reach space level " + rule.value : "Alcanza el nivel " + rule.value + " de tu mundo")
      : (secondary ? "Level achieved" : "Nivel conseguido");
    return remaining > 0
      ? (secondary ? "Complete " + remaining + (remaining === 1 ? " more session" : " more sessions") : "Completa " + remaining + (remaining === 1 ? " misión más" : " misiones más"))
      : (secondary ? "Progress achieved" : "Progreso conseguido");
  }
  function unlockStatus(item, ctx) {
    const rule = item.unlock || always; const current = valueFor(rule, ctx); const target = rule.type === "stamp" ? 1 : Number(rule.value) || 0;
    const unlocked = rule.type === "always" || current >= target;
    return { unlocked, current, target, remaining:Math.max(0, target - current), percent:target ? Math.min(100, Math.round(current / target * 100)) : 100, requirement:requirement(item, ctx, ctx.band === "eso") };
  }
  function isSelected(item, settings) {
    settings = settings || {};
    if (item.toggle === "world") return (settings.activeWorldItems || []).indexOf(item.id) >= 0;
    return item.settingKey ? settings[item.settingKey] === item.settingValue : false;
  }
  function unlockedItems(progress, stamps, value) {
    const ctx = context(progress, stamps, value);
    return catalogFor(value).filter(item => unlockStatus(item, ctx).unlocked);
  }
  function nextUnlock(progress, value, stamps) {
    const ctx = context(progress, stamps, value);
    const locked = catalogFor(value).map(item => ({ item, status:unlockStatus(item, ctx) })).filter(entry => !entry.status.unlocked);
    locked.sort((a,b) => b.status.percent - a.status.percent || a.status.remaining - b.status.remaining);
    return locked.length ? Object.assign({}, locked[0].item, locked[0].status) : null;
  }
  function sections(value, category) {
    const seen = [];
    catalogFor(value, category).forEach(item => { if (seen.indexOf(item.section) < 0) seen.push(item.section); });
    return seen;
  }
  function displayName(item, value) { return band(value) === "eso" && item.nameEn ? item.nameEn : item.name; }

  return { CATALOG, STAMP_NAMES, band, worldLevel, levelMeta, worldType, context, catalogFor, unlockStatus, isSelected, unlockedItems, nextUnlock, sections, displayName, requirement };
});
