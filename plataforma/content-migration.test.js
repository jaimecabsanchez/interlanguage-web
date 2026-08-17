const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const loader = require("./content/loader.js");

const PLATFORM = __dirname;
const legacySandbox = { window: {}, localStorage: { getItem: () => null } };
vm.runInNewContext(fs.readFileSync(path.join(PLATFORM, "contenido.js"), "utf8"), legacySandbox, { filename: "contenido.js" });
const legacy = legacySandbox.window.IL_CONTENIDO.unidades;

loader.reset();
global.ILContent = loader;
[
  "./content/p12/school.js",
  "./content/shared/daily-routine.js",
  "./content/shared/food.js",
  "./content/eso/future-plans.js"
].forEach(file => { delete require.cache[require.resolve(file)]; require(file); });
delete global.ILContent;

const result = loader.assemble();
assert.equal(result.diagnostics.errors.length, 0, JSON.stringify(result.diagnostics.errors));
assert.equal(result.unidades.length, 4);
assert.equal(result.exercises.length, 25);

function snapshot(units) {
  return units.map(unit => ({
    id: unit.id,
    exercises: unit.ejercicios.map(exercise => ({
      id: exercise.id, tipo: exercise.tipo, instruccion: exercise.instruccion,
      opciones: exercise.opciones || null, respuesta: exercise.respuesta || null,
      pares: exercise.pares || null, preguntas: exercise.preguntas || null
    }))
  }));
}

assert.deepStrictEqual(JSON.parse(JSON.stringify(snapshot(result.unidades))), JSON.parse(JSON.stringify(snapshot(legacy))));
assert(result.exercises.every(exercise => exercise.objective_id));
assert.equal(new Set(result.exercises.map(exercise => exercise.id)).size, 25);
console.log("content migration: 4 unidades y 25 ejercicios conservados");
