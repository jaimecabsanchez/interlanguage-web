/* Interlanguage HOME · esquema canónico y compatibilidad editorial */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ILContentSchema = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const STAGES = ["p12", "p34", "p56", "eso"];
  const CEFR = ["Pre-A1", "A1", "A2", "B1"];
  const SKILLS = ["listening", "vocabulary", "grammar", "reading", "writing", "speaking"];
  const LITERACY = ["none", "low", "medium", "high"];
  const TEMPLATE_BY_TYPE = Object.freeze({
    elegir_imagen: "P1", elegir_texto: "P1", emparejar: "P3", clasificar: "P4",
    ordenar: "P5", completar: "P6", comprension: "P7", hablar: "P9"
  });
  const TYPE_BY_TEMPLATE = Object.freeze({ P1: "elegir_texto", P3: "emparejar", P4: "clasificar", P5: "ordenar", P6: "completar", P7: "comprension", P9: "hablar" });
  const TEMPLATES = Object.keys(TYPE_BY_TEMPLATE);
  const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  const copy = value => {
    if (Array.isArray(value)) return value.map(copy);
    if (value && typeof value === "object") return Object.keys(value).reduce((out, key) => { out[key] = copy(value[key]); return out; }, {});
    return value;
  };
  const array = value => Array.isArray(value) ? value.slice() : (value == null || value === "" ? [] : [value]);
  const unique = values => Array.from(new Set(values));
  const stages = value => unique(array(value).filter(stage => STAGES.indexOf(stage) !== -1));
  const slug = value => String(value || "").trim();
  const clampDifficulty = value => Math.max(1, Math.min(5, Number(value) || 1));
  const inferredStages = (min, max) => STAGES.filter(stage => {
    const range = { p12: [5, 7], p34: [8, 9], p56: [10, 11], eso: [12, 18] }[stage];
    return Number(max) >= range[0] && Number(min) <= range[1];
  });
  const defaultLiteracy = (type, skill) => type === "hablar" || skill === "listening" ? "none" :
    (type === "elegir_imagen" ? "low" : (type === "comprension" ? "high" : "medium"));
  const hasCorrectOption = options => array(options).some(option => option && option.correcta === true);

  function normaliseExercise(input, context) {
    const source = copy(input || {});
    const age = array(source.edad);
    const type = source.tipo || TYPE_BY_TEMPLATE[source.template] || "elegir_texto";
    const template = source.template || TEMPLATE_BY_TYPE[type] || "";
    const min = Number(source.age_min != null ? source.age_min : age[0]);
    const max = Number(source.age_max != null ? source.age_max : age[1]);
    const skill = source.skill || source.habilidad || "vocabulary";
    const feedback = source.feedback || {};
    const stageList = stages(source.stage || source.stages || (Number.isFinite(min) && Number.isFinite(max) ? inferredStages(min, max) : context.stages));
    const answer = source.answer != null ? copy(source.answer) : (source.respuesta != null ? copy(source.respuesta) : null);
    const out = Object.assign({}, source, {
      id: slug(source.id), unit_id: slug(source.unit_id || context.unit_id), objective_id: slug(source.objective_id || context.objective_id),
      template, variant: source.variant || type, visual_style: source.visual_style || source.presentacion || (type === "elegir_imagen" ? "cards" : "default"),
      stage: stageList, age_min: Number.isFinite(min) ? min : null, age_max: Number.isFinite(max) ? max : null,
      cefr: source.cefr || source.nivel || "A1", skill, difficulty: clampDifficulty(source.difficulty),
      literacy_load: source.literacy_load || source.literacyLoad || defaultLiteracy(type, skill),
      requires_audio: source.requires_audio != null ? !!source.requires_audio : !!(source.instruction_audio || source.audio),
      requires_visual: source.requires_visual != null ? !!source.requires_visual : type === "elegir_imagen" || source.presentacion === "visual",
      requires_writing: source.requires_writing != null ? !!source.requires_writing : skill === "writing",
      instruction: source.instruction || source.instruccion || "", instruction_audio: source.instruction_audio || source.audio || "",
      stimulus: copy(source.stimulus != null ? source.stimulus : source.estimulo), options: copy(source.options || source.opciones || []), answer,
      accepted_answers: array(source.accepted_answers), hint: source.hint || feedback.incorrect || "",
      explanation: source.explanation || source.explicacion || "", learned_expressions: array(source.learned_expressions || feedback.learnedExpressions),
      prerequisites: array(source.prerequisites), tags: array(source.tags), variant_group: source.variant_group || source.variantGroup || source.objective_id || context.objective_id || ""
    });
    // Aliases consumidos por el motor actual.
    out.tipo = type; out.habilidad = out.skill; out.nivel = out.cefr; out.edad = [out.age_min, out.age_max];
    out.instruccion = out.instruction; if (out.instruction_audio) out.audio = out.instruction_audio;
    if (out.options.length) out.opciones = copy(out.options); if (out.answer != null) out.respuesta = copy(out.answer);
    if (out.explanation) out.explicacion = out.explanation; if (out.stimulus != null) out.estimulo = copy(out.stimulus);
    return out;
  }

  function normaliseObjective(input, context) {
    const source = copy(input || {});
    return Object.assign({}, source, {
      id: slug(source.id), unit_id: slug(source.unit_id || context.unit_id), stage: stages(source.stage || source.stages || context.stages),
      cefr: source.cefr || source.nivel || context.cefr || "A1", skill: source.skill || source.habilidad || "vocabulary",
      difficulty: clampDifficulty(source.difficulty), description: source.description || source.descripcion || "",
      literacy_load: source.literacy_load || source.literacyLoad || "medium", requires_audio: !!source.requires_audio,
      requires_visual: !!source.requires_visual, requires_writing: !!source.requires_writing,
      prerequisites: array(source.prerequisites), tags: array(source.tags)
    });
  }

  function normaliseUnit(input, context) {
    const source = copy(input || {});
    return Object.assign({}, source, {
      id: slug(source.id), title: source.title || source.titulo || "", stage: stages(source.stage || source.stages || context.stages),
      topic: source.topic || source.tema_id || context.topic || source.id || "", cefr: source.cefr || source.nivel || "A1",
      description: source.description || source.descripcion || "", objective_ids: array(source.objective_ids), theme: copy(source.theme || source.tema || {})
    });
  }

  function normalisePack(input) {
    const source = copy(input || {});
    const packStages = stages(source.stages || source.stage);
    const pack = { id: slug(source.id), version: Number(source.version) || 1, stages: packStages, topic: source.topic || "", units: [], objectives: [], exercises: [] };
    pack.units = array(source.units || source.unidades).map(unit => normaliseUnit(unit, { stages: packStages, topic: pack.topic }));
    const embeddedObjectives = [];
    const embeddedExercises = [];
    array(source.units || source.unidades).forEach(unit => {
      array(unit.objectives || unit.objetivos).forEach(objective => embeddedObjectives.push(Object.assign({}, objective, { unit_id: objective.unit_id || unit.id })));
      array(unit.exercises || unit.ejercicios).forEach(exercise => embeddedExercises.push(Object.assign({}, exercise, { unit_id: exercise.unit_id || unit.id })));
    });
    pack.objectives = array(source.objectives || source.objetivos).concat(embeddedObjectives).map(objective => normaliseObjective(objective, { stages: packStages }));
    const objectiveByUnit = {};
    pack.objectives.forEach(objective => { if (!objectiveByUnit[objective.unit_id]) objectiveByUnit[objective.unit_id] = objective.id; });
    pack.exercises = array(source.exercises || source.ejercicios).concat(embeddedExercises).map(exercise => normaliseExercise(exercise, {
      stages: packStages, unit_id: exercise.unit_id || "", objective_id: exercise.objective_id || objectiveByUnit[exercise.unit_id] || ""
    }));
    return pack;
  }

  function validatePack(input) {
    const pack = normalisePack(input);
    const errors = [], warnings = [];
    const add = (list, code, path, message) => list.push({ code, path, message });
    if (!ID_RE.test(pack.id)) add(errors, "invalid_id", "id", "El pack necesita un ID slug único.");
    if (!pack.stages.length) add(errors, "invalid_stage", "stages", "El pack necesita al menos una etapa válida.");
    if (!pack.topic) add(errors, "missing_topic", "topic", "El pack necesita un tema.");
    const ids = new Set();
    const checkId = (value, path) => {
      if (!ID_RE.test(value)) add(errors, "invalid_id", path, "ID ausente o inválido.");
      else if (ids.has(value)) add(errors, "duplicate_id", path, "ID duplicado: " + value + ".");
      else ids.add(value);
    };
    pack.units.forEach((unit, index) => { checkId(unit.id, "units[" + index + "].id"); if (!unit.title) add(errors, "missing_title", "units[" + index + "].title", "Falta el título."); });
    const unitIds = new Set(pack.units.map(unit => unit.id));
    pack.objectives.forEach((objective, index) => {
      const path = "objectives[" + index + "]"; checkId(objective.id, path + ".id");
      if (!unitIds.has(objective.unit_id)) add(errors, "unknown_unit", path + ".unit_id", "El objetivo referencia una unidad inexistente.");
      if (CEFR.indexOf(objective.cefr) < 0) add(errors, "invalid_cefr", path + ".cefr", "CEFR no válido.");
      if (SKILLS.indexOf(objective.skill) < 0) add(errors, "invalid_skill", path + ".skill", "Skill no válida.");
      if (LITERACY.indexOf(objective.literacy_load) < 0) add(errors, "invalid_literacy", path + ".literacy_load", "Carga lectora no válida.");
    });
    const objectiveIds = new Set(pack.objectives.map(objective => objective.id));
    pack.exercises.forEach((exercise, index) => {
      const path = "exercises[" + index + "]"; checkId(exercise.id, path + ".id");
      if (!unitIds.has(exercise.unit_id)) add(errors, "unknown_unit", path + ".unit_id", "El ejercicio referencia una unidad inexistente.");
      if (!objectiveIds.has(exercise.objective_id)) add(errors, "unknown_objective", path + ".objective_id", "El ejercicio referencia un objetivo inexistente.");
      if (TEMPLATES.indexOf(exercise.template) < 0) add(errors, "unknown_template", path + ".template", "Plantilla desconocida.");
      if (CEFR.indexOf(exercise.cefr) < 0) add(errors, "invalid_cefr", path + ".cefr", "CEFR no válido.");
      if (SKILLS.indexOf(exercise.skill) < 0) add(errors, "invalid_skill", path + ".skill", "Skill no válida.");
      if (LITERACY.indexOf(exercise.literacy_load) < 0) add(errors, "invalid_literacy", path + ".literacy_load", "Carga lectora no válida.");
      if (exercise.age_min == null || exercise.age_max == null || exercise.age_min > exercise.age_max) add(errors, "invalid_age_range", path + ".age", "Rango de edad inválido.");
      if (exercise.stage.some(stage => pack.stages.indexOf(stage) < 0)) add(errors, "stage_outside_pack", path + ".stage", "La etapa no está publicada por el pack.");
      const needsChoice = ["P1", "P6"].indexOf(exercise.template) >= 0;
      if (needsChoice && (!exercise.options.length || !hasCorrectOption(exercise.options))) add(errors, "missing_answer", path + ".options", "No hay una respuesta válida.");
      if (exercise.template === "P5" && !array(exercise.answer).length) add(errors, "missing_answer", path + ".answer", "Falta el orden correcto.");
      if (exercise.template === "P3" && !array(exercise.pares).length) add(errors, "missing_answer", path + ".pares", "Faltan parejas válidas.");
      if (exercise.template === "P7" && !array(exercise.preguntas).length) add(errors, "missing_answer", path + ".preguntas", "Faltan preguntas evaluables.");
      if (!exercise.variant_group) add(warnings, "missing_variant_group", path + ".variant_group", "Conviene agrupar variantes del mismo objetivo.");
      if (!exercise.hint) add(warnings, "missing_hint", path + ".hint", "Falta una pista editorial.");
    });
    return { valid: errors.length === 0, value: pack, errors, warnings };
  }

  return { STAGES, CEFR, SKILLS, LITERACY, TEMPLATES, TEMPLATE_BY_TYPE, TYPE_BY_TEMPLATE, normaliseExercise, normaliseObjective, normaliseUnit, normalisePack, validatePack };
});
