const assert = require("assert");
const PED = require("./motor/pedagogia.js");
const createMasteryStore = require("./mastery-store.js");

function memoryStorage() {
  const data = new Map();
  return {
    getItem: key => data.has(key) ? data.get(key) : null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: key => data.delete(key)
  };
}

const mastery = createMasteryStore(PED, memoryStorage());

let card = mastery.recordByType("lucia", "pv-1", "elegir_imagen", true, "2026-08-10");
assert.equal(card.correct_total, 1, "registra un acierto de reconocimiento");
assert.equal(card.evidence, 1, "una elección aporta una unidad de evidencia");

card = mastery.recordByType("lucia", "pv-1", "completar", true, "2026-08-11");
assert.equal(card.evidence, 3, "completar aporta evidencia reforzada de producción");
assert.deepEqual(mastery.due("lucia", "2026-08-11"), [], "no vence antes de la fecha prevista");
assert.deepEqual(mastery.due("lucia", card.next_review_at), ["pv-1"], "vence en la fecha de repaso");
assert.equal(mastery.dueCount("lucia", card.next_review_at), 1, "expone el total para la recomendación de Inicio");

assert.equal(mastery.clear("lucia"), true, "puede limpiar el estado del usuario");
assert.deepEqual(mastery.all("lucia"), {}, "la limpieza queda aislada por usuario");

console.log("mastery-store: 8 comprobaciones correctas");
