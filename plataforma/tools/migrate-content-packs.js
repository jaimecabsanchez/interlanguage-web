/* Genera los packs iniciales desde el banco heredado sin cambiar contenido editorial. */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const PLATFORM = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(PLATFORM, "contenido.js"), "utf8");
const sandbox = { window: {}, localStorage: { getItem: () => null } };
vm.runInNewContext(source, sandbox, { filename: "contenido.js" });
const units = sandbox.window.IL_CONTENIDO.unidades;

const definitions = {
  "primer-vuelo": {
    file: "content/p12/school.js", pack: "p12-school-core", stages: ["p12", "p34"], topic: "school",
    objectives: [
      { id: "school-objects", skill: "vocabulary", literacy_load: "low", description: "Reconocer objetos básicos del aula." },
      { id: "school-greetings", skill: "speaking", literacy_load: "low", description: "Comprender y usar saludos básicos en clase." }
    ],
    exerciseObjective: { "pv-1": "school-objects", "pv-2": "school-objects", "pv-4": "school-objects", "pv-3": "school-greetings", "pv-5": "school-greetings" }
  },
  "rutina-diaria": {
    file: "content/shared/daily-routine.js", pack: "primary-daily-routine", stages: ["p34", "p56"], topic: "daily-routine",
    objectives: [
      { id: "routine-actions", skill: "vocabulary", literacy_load: "medium", description: "Comprender y producir acciones y horarios de la rutina diaria." }
    ], exerciseObjective: { "rd-1": "routine-actions", "rd-2": "routine-actions", "rd-3": "routine-actions", "rd-4": "routine-actions", "rd-5": "routine-actions", "rd-6": "routine-actions" }
  },
  "la-comida": {
    file: "content/shared/food.js", pack: "primary-food", stages: ["p12", "p34", "p56"], topic: "food",
    objectives: [
      { id: "food-words", skill: "vocabulary", literacy_load: "low", description: "Reconocer alimentos frecuentes." },
      { id: "food-likes", skill: "grammar", literacy_load: "medium", description: "Expresar gustos sencillos sobre comida." },
      { id: "food-reading", skill: "reading", literacy_load: "medium", description: "Comprender gustos en un texto breve." }
    ],
    exerciseObjective: { "lc-1": "food-words", "lc-2": "food-words", "lc-6": "food-words", "lc-3": "food-likes", "lc-4": "food-likes", "lc-5": "food-likes", "lc-7": "food-reading" }
  },
  "future-plans": {
    file: "content/eso/future-plans.js", pack: "eso-future-plans", stages: ["eso"], topic: "future-plans",
    objectives: [
      { id: "plans-suggestions", skill: "speaking", literacy_load: "medium", description: "Proponer, aceptar y negociar planes." },
      { id: "plans-arrangements", skill: "grammar", literacy_load: "high", description: "Expresar y escribir planes acordados." },
      { id: "plans-comprehension", skill: "reading", literacy_load: "high", description: "Comprender detalles de una conversación sobre planes." }
    ],
    exerciseObjective: { "fp-1": "plans-suggestions", "fp-2": "plans-suggestions", "fp-6": "plans-suggestions", "fp-3": "plans-arrangements", "fp-4": "plans-arrangements", "fp-7": "plans-arrangements", "fp-5": "plans-comprehension" }
  }
};

function difficulty(exercise) {
  return ({ elegir_imagen: 1, elegir_texto: 2, emparejar: 2, ordenar: 3, completar: 3, comprension: 4, hablar: 3 })[exercise.tipo] || 2;
}

units.forEach(unit => {
  const def = definitions[unit.id];
  if (!def) throw new Error("Falta definición para " + unit.id);
  const unitData = Object.assign({}, unit); delete unitData.ejercicios;
  unitData.stage = def.stages; unitData.topic = def.topic; unitData.objective_ids = def.objectives.map(objective => objective.id);
  const objectives = def.objectives.map(objective => Object.assign({}, objective, {
    unit_id: unit.id, stage: def.stages, cefr: unit.nivel || "A1", difficulty: 2,
    requires_audio: false, requires_visual: false, requires_writing: objective.skill === "writing", prerequisites: [], tags: [def.topic]
  }));
  const exercises = unit.ejercicios.map(exercise => Object.assign({}, exercise, {
    unit_id: unit.id, objective_id: def.exerciseObjective[exercise.id], stage: def.stages,
    difficulty: difficulty(exercise), variant_group: def.exerciseObjective[exercise.id], tags: [def.topic]
  }));
  if (exercises.some(exercise => !exercise.objective_id)) throw new Error("Ejercicio sin objetivo en " + unit.id);
  const pack = { id: def.pack, version: 1, stages: def.stages, topic: def.topic, units: [unitData], objectives, exercises };
  const target = path.join(PLATFORM, def.file); fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, "/* Pack editorial generado desde contenido.js; editar el dato, no el motor. */\nILContent.registerPack(" + JSON.stringify(pack, null, 2) + ");\n");
});

console.log("Packs generados: " + units.length + " unidades, " + units.reduce((sum, unit) => sum + unit.ejercicios.length, 0) + " ejercicios.");
