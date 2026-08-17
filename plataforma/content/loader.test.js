const assert = require("assert");
const loader = require("./loader.js");

function pack(id, exerciseId) {
  return {
    id, version: 1, stages: ["p34"], topic: "school",
    units: [{ id: id + "-unit", title: "Unit", stage: "p34", cefr: "A1" }],
    objectives: [{ id: id + "-objective", unit_id: id + "-unit", stage: "p34", cefr: "A1", skill: "vocabulary", literacy_load: "low" }],
    exercises: [{ id: exerciseId, unit_id: id + "-unit", objective_id: id + "-objective", template: "P1", variant: "elegir_texto", stage: "p34", age_min: 8, age_max: 9, cefr: "A1", skill: "vocabulary", literacy_load: "low", instruction: "Choose", options: [{ texto: "a", correcta: true }, { texto: "b" }] }]
  };
}

loader.reset();
assert.equal(loader.registerPack(pack("first-pack", "first-exercise")).registered, true);
assert.equal(loader.registerPack(pack("first-pack", "first-exercise")).duplicate, true, "mismo pack/version debe ser idempotente");
assert.equal(loader.registerPack(pack("second-pack", "second-exercise")).registered, true);
let bank = loader.assemble();
assert.deepEqual(bank.packs, ["first-pack", "second-pack"]);
assert.equal(bank.unidades.length, 2);
assert.equal(bank.unidades[0].ejercicios[0].tipo, "elegir_texto");

loader.reset();
loader.registerPack(pack("first-pack", "shared-exercise"));
loader.registerPack(pack("second-pack", "shared-exercise"));
bank = loader.assemble();
assert.equal(bank.unidades.length, 1, "pack con colisión global no debe publicarse parcialmente");
assert(loader.diagnostics.errors.some(error => error.code === "duplicate_global_id"));

loader.reset();
loader.setManifest(["one.js", "broken.js", "two.js"]);
const loaded = [];
loader.load({ loadScript: url => {
  loaded.push(url);
  if (url === "one.js") loader.registerPack(pack("first-pack", "first-exercise"));
  if (url === "two.js") loader.registerPack(pack("second-pack", "second-exercise"));
  return url === "broken.js" ? Promise.reject(new Error("boom")) : Promise.resolve();
}}).then(result => {
  assert.deepEqual(loaded, ["one.js", "broken.js", "two.js"]);
  assert.equal(result.unidades.length, 2);
  assert.equal(result.diagnostics.degraded, true);
  console.log("content loader: registro y ensamblado comprobados");
}).catch(error => { console.error(error); process.exitCode = 1; });
