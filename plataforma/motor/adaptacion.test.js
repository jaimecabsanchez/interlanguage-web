const assert = require("node:assert/strict");
const Adapt = require("./adaptacion.js");

let state = Adapt.create();
assert.equal(state.guided, false, "una sesión nueva empieza sin ayuda extra");

state = Adapt.record(state, { correct: false, attempt_no: 2 });
assert.equal(state.guided, true, "un error final activa apoyo temporal");

state = Adapt.record(state, { correct: true, attempt_no: 1 });
assert.equal(state.guided, false, "un acierto limpio retira el apoyo");
assert.equal(state.recoveries, 1, "registra la recuperación sin puntuar ni comparar");

state = Adapt.record(state, { correct: true, attempt_no: 2 });
assert.equal(state.guided, true, "resolver con pista mantiene apoyo para la siguiente actividad");

const original = { tipo: "elegir_texto", opciones: [
  { texto: "A" }, { texto: "B", correcta: true }, { texto: "C" }, { texto: "D" }
] };
const simplified = Adapt.simplify(original, true);
assert.equal(simplified.opciones.length, 3, "el modo guiado retira un único distractor");
assert.equal(simplified.opciones.filter(option => option.correcta).length, 1, "conserva siempre la respuesta correcta");
assert.equal(original.opciones.length, 4, "no muta el contenido editorial");

const reading = Adapt.simplify({ tipo: "comprension", preguntas: [{ opciones: original.opciones }] }, true);
assert.equal(reading.preguntas[0].opciones.length, 3, "también reduce una pregunta de comprensión");

assert.equal(Adapt.simplify(original, false), original, "sin apoyo conserva el ejercicio original");
assert.match(Adapt.hint({ feedback: { incorrect: "Busca el verbo." } }, "eso"), /verbo/, "prioriza la pista editorial");
assert.match(Adapt.hint({}, "p12"), /Mira y escucha/, "ofrece una pista segura si falta contenido editorial");

console.log("adaptacion: 12 comprobaciones correctas");
