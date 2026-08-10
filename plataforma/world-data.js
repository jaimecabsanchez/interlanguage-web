/* ============================================================
   Interlanguage HOME · catálogo del mundo personal
   Datos y reglas puras. La moneda técnica sigue siendo `gems`
   por compatibilidad; en interfaz se llama Puntos de ruta.
   ============================================================ */
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ILWorldData = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const PRIMARY = ["p12", "p34", "p56"];
  const CATALOG = Object.freeze([
    { id:"garden-tree", group:"garden", name:"Mi primer árbol", description:"El comienzo de tu jardín.", price:0, bands:PRIMARY, visual:"tree", starter:true },
    { id:"garden-flowers", group:"garden", name:"Flores del camino", description:"Un rincón de color para tus avances.", price:40, bands:PRIMARY, visual:"flowers" },
    { id:"avatar-cap", group:"avatar", name:"Gorra exploradora", description:"Para recorrer nuevas misiones.", price:60, bands:PRIMARY, visual:"cap", slot:"hat" },
    { id:"garden-bench", group:"garden", name:"Banco de lectura", description:"Un lugar tranquilo para las nuevas palabras.", price:60, bands:PRIMARY, visual:"bench" },
    { id:"avatar-backpack", group:"avatar", name:"Mochila de ruta", description:"Lista para cada nueva etapa.", price:80, bands:PRIMARY, visual:"backpack", slot:"acc" },
    { id:"garden-lanterns", group:"garden", name:"Luces de ruta", description:"Iluminan el camino que ya has recorrido.", price:80, bands:PRIMARY, visual:"lanterns" },
    { id:"pet-nube", group:"pet", name:"Nube", description:"Un gato curioso que visita tu jardín.", price:100, bands:PRIMARY, visual:"cat", slot:"acc" },
    { id:"garden-pond", group:"garden", name:"Estanque tranquilo", description:"Un espacio que crece con tu constancia.", price:120, bands:PRIMARY, visual:"pond" },
    { id:"pet-brisa", group:"pet", name:"Brisa", description:"Una perrita alegre para tus recorridos.", price:140, bands:PRIMARY, visual:"dog", slot:"acc" },
    { id:"garden-greenhouse", group:"garden", name:"Invernadero", description:"Para quienes cuidan su aprendizaje semana a semana.", price:180, bands:PRIMARY, visual:"greenhouse" },
    { id:"pet-menta", group:"pet", name:"Menta", description:"Una tortuga paciente que avanza contigo.", price:180, bands:PRIMARY, visual:"turtle", slot:"acc" },

    { id:"space-night", group:"space", name:"Tema nocturno", nameEn:"Night theme", description:"Un espacio sobrio para concentrarte.", descriptionEn:"A calmer space designed for focus.", price:40, bands:["eso"], visual:"night" },
    { id:"space-headphones", group:"space", name:"Zona de audio", nameEn:"Audio setup", description:"Personaliza tu zona de listening.", descriptionEn:"Personalise your listening setup.", price:60, bands:["eso"], visual:"headphones" },
    { id:"avatar-jacket", group:"avatar", name:"Chaqueta Explorer", nameEn:"Explorer jacket", description:"Un estilo más personal para tu avatar.", descriptionEn:"Give your avatar a more personal look.", price:80, bands:["eso"], visual:"jacket", slot:"hat" },
    { id:"space-travel", group:"space", name:"Mural de viajes", nameEn:"Travel wall", description:"Recuerdos visuales de tus temas de viaje.", descriptionEn:"Bring your travel topics into your space.", price:120, bands:["eso"], visual:"travel" },
    { id:"space-tech", group:"space", name:"Escritorio tecnológico", nameEn:"Tech desk", description:"Un escritorio preparado para nuevos retos.", descriptionEn:"A focused setup for your next challenge.", price:180, bands:["eso"], visual:"tech" }
  ]);

  const LEGACY = Object.freeze({ hat:"avatar-cap", glass:"space-headphones", cat:"pet-nube" });
  function band(value) { return ["p12","p34","p56","eso"].indexOf(value) >= 0 ? value : "p56"; }
  function catalogFor(value) { const key = band(value); return CATALOG.filter(item => item.bands.indexOf(key) >= 0); }
  function normalizeOwned(value) {
    const source = Array.isArray(value) ? value : [];
    const result = ["garden-tree"];
    source.forEach(id => { const next = LEGACY[id] || id; if (result.indexOf(next) < 0) result.push(next); });
    return result;
  }
  function balance(progress) { const value = Number(progress && progress.gems); return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0; }
  function owns(progress, id) { return normalizeOwned(progress && progress.owned).indexOf(id) >= 0; }
  function equipped(progress, item) {
    if (!item || !item.slot) return false;
    const raw = progress && progress[item.slot];
    return raw === item.id || LEGACY[raw] === item.id;
  }
  function status(progress, item) {
    if (item.starter || owns(progress, item.id)) return equipped(progress, item) ? "equipped" : "owned";
    return balance(progress) >= item.price ? "available" : "locked";
  }
  function nextUnlock(progress, value) {
    const unowned = catalogFor(value).filter(item => !item.starter && !owns(progress, item.id)).sort((a,b) => a.price - b.price);
    if (!unowned.length) return null;
    const item = unowned[0];
    return Object.assign({}, item, { remaining: Math.max(0, item.price - balance(progress)), progress: Math.min(100, Math.round(balance(progress) / item.price * 100)) });
  }
  function groups(value) {
    return band(value) === "eso"
      ? [{ id:"space", label:"Your space" }, { id:"avatar", label:"Your style" }]
      : [{ id:"garden", label:"Tu jardín" }, { id:"pet", label:"Compañeros" }, { id:"avatar", label:"Tu avatar" }];
  }
  function ownedCount(progress, value) { return catalogFor(value).filter(item => item.starter || owns(progress, item.id)).length; }

  return { CATALOG, LEGACY, band, catalogFor, normalizeOwned, balance, owns, equipped, status, nextUnlock, groups, ownedCount };
});
