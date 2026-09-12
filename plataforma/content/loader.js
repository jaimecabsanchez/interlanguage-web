/* Interlanguage HOME · registro, carga y ensamblado de packs */
(function (root, factory) {
  "use strict";
  const schema = root.ILContentSchema || (typeof require === "function" ? require("./schema.js") : null);
  const api = factory(root, schema);
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ILContent = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root, schema) {
  "use strict";
  if (!schema) throw new Error("ILContentSchema debe cargarse antes de ILContent.");

  let registry = new Map();
  let manifest = [];
  let loadPromise = null;
  const diagnostics = { errors: [], warnings: [], degraded: false };

  function reset() {
    registry = new Map(); manifest = []; loadPromise = null;
    diagnostics.errors.length = 0; diagnostics.warnings.length = 0; diagnostics.degraded = false;
  }

  function registerPack(input) {
    const result = schema.validatePack(input, { publish:true });
    const key = result.value.id;
    if (!result.valid) {
      diagnostics.errors.push.apply(diagnostics.errors, result.errors.map(error => Object.assign({ pack_id: key }, error)));
      diagnostics.warnings.push.apply(diagnostics.warnings, result.warnings.map(warning => Object.assign({ pack_id: key }, warning)));
      diagnostics.degraded = true;
      return { registered: false, result };
    }
    const existing = registry.get(key);
    if (existing) {
      if (existing.version === result.value.version) return { registered: false, duplicate: true, result };
      diagnostics.errors.push({ pack_id: key, code: "duplicate_pack", path: "id", message: "El pack ya está registrado con otra versión." });
      diagnostics.degraded = true;
      return { registered: false, result };
    }
    registry.set(key, result.value);
    diagnostics.warnings.push.apply(diagnostics.warnings, result.warnings.map(warning => Object.assign({ pack_id: key }, warning)));
    return { registered: true, result };
  }

  function projectUnit(unit, objectives, exercises) {
    const legacy = Object.assign({}, unit, {
      titulo: unit.title, nivel: unit.cefr, descripcion: unit.description, tema: unit.theme,
      objetivos: objectives, ejercicios: exercises
    });
    return legacy;
  }

  function assemble() {
    const units = [], objectives = [], exercises = [];
    const globalIds = new Map();
    const acceptedPacks = [];
    registry.forEach(pack => {
      const collisions = [];
      [pack.units, pack.objectives, pack.exercises].forEach(list => list.forEach(item => {
        if (globalIds.has(item.id)) collisions.push(item.id);
      }));
      if (collisions.length) {
        diagnostics.errors.push({ pack_id: pack.id, code: "duplicate_global_id", path: "id", message: "IDs globales duplicados: " + collisions.join(", ") + "." });
        diagnostics.degraded = true; return;
      }
      [pack.units, pack.objectives, pack.exercises].forEach(list => list.forEach(item => globalIds.set(item.id, pack.id)));
      acceptedPacks.push(pack.id); units.push.apply(units, pack.units); objectives.push.apply(objectives, pack.objectives); exercises.push.apply(exercises, pack.exercises);
    });
    const unitIds = new Set(units.map(unit => unit.id));
    const objectiveIds = new Set(objectives.map(objective => objective.id));
    const validObjectives = objectives.filter(objective => {
      if (unitIds.has(objective.unit_id)) return true;
      diagnostics.errors.push({ code: "unknown_unit", path: objective.id + ".unit_id", message: "Objetivo con unidad externa inexistente." }); diagnostics.degraded = true; return false;
    });
    const validExercises = exercises.filter(exercise => {
      if (unitIds.has(exercise.unit_id) && objectiveIds.has(exercise.objective_id)) return true;
      diagnostics.errors.push({ code: "broken_relation", path: exercise.id, message: "Ejercicio con relación externa inexistente." }); diagnostics.degraded = true; return false;
    });
    const legacyUnits = units.map(unit => projectUnit(unit,
      validObjectives.filter(objective => objective.unit_id === unit.id),
      validExercises.filter(exercise => exercise.unit_id === unit.id)));
    return { packs: acceptedPacks, units, objectives: validObjectives, exercises: validExercises, unidades: legacyUnits, diagnostics };
  }

  function setManifest(entries) { manifest = Array.isArray(entries) ? entries.slice() : []; return manifest.slice(); }

  function loadScript(url, documentRef) {
    const doc = documentRef || root.document;
    if (!doc || !doc.createElement) return Promise.reject(new Error("No hay DOM para cargar " + url));
    return new Promise((resolve, reject) => {
      const script = doc.createElement("script"); script.src = url; script.async = false;
      script.onload = () => resolve(url); script.onerror = () => reject(new Error("No se pudo cargar " + url));
      (doc.head || doc.documentElement).appendChild(script);
    });
  }

  function load(options) {
    if (loadPromise) return loadPromise;
    options = options || {};
    const entries = options.manifest || manifest || [];
    const scriptLoader = options.loadScript || (url => loadScript(url, options.document));
    loadPromise = entries.reduce((promise, entry) => promise.then(() => scriptLoader(typeof entry === "string" ? entry : entry.src)
      .catch(error => { diagnostics.errors.push({ code: "pack_load_failed", path: String(typeof entry === "string" ? entry : entry.src), message: error.message }); diagnostics.degraded = true; })), Promise.resolve())
      .then(assemble);
    return loadPromise;
  }

  const api = { registerPack, assemble, setManifest, load, loadScript, reset, diagnostics, get ready() { return loadPromise || Promise.resolve(assemble()); }, get packs() { return Array.from(registry.values()); } };
  return api;
});
