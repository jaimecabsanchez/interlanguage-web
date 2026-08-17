/* Interlanguage HOME · entrada compatible del banco editorial. */
(function (root) {
  "use strict";
  const facade = root.IL_CONTENIDO = root.IL_CONTENIDO || { unidades: [] };
  const api = root.ILContent;
  if (!api) { facade.error = "ILContent no está disponible."; return; }

  const slug = value => String(value || "contenido").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "contenido";
  function cmsPack() {
    let units = [];
    try { units = JSON.parse(root.localStorage && root.localStorage.getItem("il_cms_content") || "[]"); }
    catch (error) { api.diagnostics.errors.push({ code: "cms_parse_failed", path: "il_cms_content", message: error.message }); }
    if (!Array.isArray(units) || !units.length) return null;
    const objectives = [], exercises = [];
    units.forEach(rawUnit => {
      const unit = Object.assign({}, rawUnit); const unitId = slug(unit.id); const objectiveId = "cms-" + unitId + "-objective";
      unit.id = unitId; unit.stage = ["p12", "p34", "p56", "eso"]; unit.objective_ids = [objectiveId];
      objectives.push({ id:objectiveId,unit_id:unitId,stage:unit.stage,cefr:unit.nivel||"A1",skill:"vocabulary",difficulty:2,description:"Contenido editorial local",literacy_load:"medium",prerequisites:[],tags:["cms"] });
      (unit.ejercicios || []).forEach(rawExercise => exercises.push(Object.assign({}, rawExercise, { id:slug(rawExercise.id),unit_id:unitId,objective_id:objectiveId,stage:unit.stage,variant_group:objectiveId,tags:["cms"] })));
      delete unit.ejercicios; units[units.indexOf(rawUnit)] = unit;
    });
    return { id:"cms-local-content",version:1,stages:["p12","p34","p56","eso"],topic:"cms",units,objectives,exercises };
  }

  const local = cmsPack(); if (local) api.registerPack(local);
  const script = root.document && root.document.currentScript;
  const base = script && script.src ? new URL(".", script.src) : null;
  const manifest = (root.IL_CONTENT_MANIFEST || []).map(entry => base ? new URL(entry, base).href : entry);
  api.setManifest(manifest);
  api.load().then(bank => {
    facade.unidades.splice(0, facade.unidades.length, ...bank.unidades);
    facade.objetivos = bank.objectives; facade.ejercicios = bank.exercises; facade.diagnostics = bank.diagnostics;
  }).catch(error => { facade.error = error && error.message || "No se pudo cargar el contenido."; });
})(typeof window !== "undefined" ? window : globalThis);
