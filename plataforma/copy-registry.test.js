const assert = require("node:assert/strict");
const Copy = require("./copy-registry.js");

const required = ["greeting", "ready", "active", "complete", "missionEyebrow", "startCta", "continueCta", "reviewCta", "completedCta", "exercise", "countJoin", "summaryTitle", "summaryLead"];
for (const band of Copy.BANDS) for (const key of required) assert.ok(Copy.text(key, band, { name:"Lucía" }), band + " necesita " + key);

for (const band of ["p12", "p34"]) {
  assert.equal(Copy.skill("grammar", band), "Gramática");
  assert.equal(Copy.missionTitle({ id:"gramatica-inicial", titulo:"Words & sentences" }, band), "Palabras y frases");
  assert.equal(Copy.support("ordenar", false, band), "PIENSA · ORDENA");
}
assert.equal(Copy.text("startCta", "p56"), "Empezar", "p56 conserva chrome comprensible en español");
assert.equal(Copy.skill("grammar", "p56"), "Grammar", "p56 introduce inglés en aprendizaje");
assert.equal(Copy.missionTitle({ id:"rutina-diaria" }, "p56"), "My daily routine");
assert.equal(Copy.text("startCta", "eso"), "Start session");
assert.equal(Copy.reward({ name:"Perfect Round", nameEs:"Ronda perfecta" }, "p56", "name"), "Ronda perfecta");
assert.equal(Copy.practice("reviewTitle", "p12"), "Repasar");
assert.doesNotMatch(Copy.practice("reviewBody", "p12"), /error/i);
assert.equal(Copy.practiceSkill("vocabulary", "p12"), "Palabras");
assert.equal(Copy.practiceSkill("grammar", "p34"), "Gramática");
assert.equal(Copy.practice("title", "eso"), "Practice");
assert.equal(Copy.reward({ name:"Perfect Round", nameEs:"Ronda perfecta" }, "eso", "name"), "Perfect Round");
assert.equal(Copy.normalizeBand("desconocida"), "neutral");
assert.equal(Copy.text("startCta", "desconocida"), "Empezar", "fallback neutral y seguro");
assert.equal(Copy.missionTitle({ id:"custom", titulo:{ es:"Mi unidad", en:"My unit" } }, "p34"), "Mi unidad");
assert.equal(Copy.missionTitle({ id:"custom", titulo:{ es:"Mi unidad", en:"My unit" } }, "eso"), "My unit");

console.log("copy registry: cuatro bandas, p56 híbrido y fallback neutral correctos");
