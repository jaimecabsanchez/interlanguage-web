const assert = require("assert");
const schema = require("./schema.js");

const legacyPack = {
  id: "legacy-school", version: 1, stages: ["p12"], topic: "school",
  unidades: [{
    id: "school-unit", titulo: "School", nivel: "Pre-A1",
    objetivos: [{ id: "school-words", habilidad: "vocabulary", nivel: "Pre-A1", literacyLoad: "low" }],
    ejercicios: [{
      id: "school-book", objective_id: "school-words", tipo: "elegir_imagen", habilidad: "vocabulary",
      nivel: "Pre-A1", edad: [5, 7], instruccion: "Elige el libro", audio: "Book",
      opciones: [{ texto: "book", correcta: true }, { texto: "pencil" }]
    }]
  }]
};

const result = schema.validatePack(legacyPack);
assert.equal(result.valid, true, JSON.stringify(result.errors));
assert.equal(result.value.units[0].title, "School");
assert.equal(result.value.exercises[0].template, "P1");
assert.equal(result.value.exercises[0].instruction_audio, "Book");
assert.deepEqual(result.value.exercises[0].edad, [5, 7]);
assert.equal(result.value.exercises[0].opciones[0].correcta, true);
assert.equal(legacyPack.unidades[0].ejercicios[0].template, undefined, "normalizar no debe mutar el input");

const noAnswer = JSON.parse(JSON.stringify(legacyPack));
delete noAnswer.unidades[0].ejercicios[0].opciones[0].correcta;
assert(schema.validatePack(noAnswer).errors.some(error => error.code === "missing_answer"));

const duplicate = JSON.parse(JSON.stringify(legacyPack));
duplicate.unidades[0].ejercicios.push(Object.assign({}, duplicate.unidades[0].ejercicios[0]));
assert(schema.validatePack(duplicate).errors.some(error => error.code === "duplicate_id"));

const brokenReference = JSON.parse(JSON.stringify(legacyPack));
brokenReference.unidades[0].ejercicios[0].objective_id = "missing-objective";
assert(schema.validatePack(brokenReference).errors.some(error => error.code === "unknown_objective"));

const invalidAge = JSON.parse(JSON.stringify(legacyPack));
invalidAge.unidades[0].ejercicios[0].edad = [9, 5];
assert(schema.validatePack(invalidAge).errors.some(error => error.code === "invalid_age_range"));

console.log("content schema: normalización y validación comprobadas");
