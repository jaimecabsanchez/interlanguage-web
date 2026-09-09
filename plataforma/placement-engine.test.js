const assert = require("node:assert/strict");
const Engine = require("./placement-engine.js");
const Content = require("./placement-content.js");

function answer(state, correct, technical) {
  const item = Engine.select(state, Content.ITEMS); assert.ok(item, "hay una sonda disponible");
  return Engine.submit(state, item, technical ? {technicalFailure:true} : {kind:"answer",choice:correct ? item.correct_index : (item.correct_index + 1) % item.options.length});
}

assert.equal(Engine.create({band:"p12",seedCefr:"invalid"}).seedCefr, "A1");
assert.equal(Engine.create({band:"unknown"}).band, "neutral");

let state = Engine.create({band:"p12",seedCefr:"A1"});
state = answer(state, true); state = answer(state, true);
assert.equal(state.highestValidated, "A1"); assert.equal(state.candidate, "A2", "solo sube un nivel");

let down = Engine.create({band:"p34",seedCefr:"A2"});
down = answer(down, false); down = answer(down, false);
assert.equal(down.lowestRejected, "A2"); assert.equal(down.candidate, "A1", "solo baja un nivel");

let split = Engine.create({band:"p12",seedCefr:"A1"});
split = answer(split, true); split = answer(split, false);
assert.equal(split.candidate, "A1", "una división mantiene el nivel");
split = answer(split, true);
assert.equal(split.highestValidated, "A1", "la tercera sonda desempata");
assert.equal(split.responses.at(-1).tieBreak, true);

let technical = Engine.create({band:"p12",seedCefr:"A1"});
technical = answer(technical, false, true);
assert.equal(technical.evaluableCount, 0); assert.equal(technical.candidate, "A1"); assert.equal(technical.technicalCount, 1);

let bounded = Engine.create({band:"p12",seedCefr:"A1"});
while (bounded.status === "active") bounded = answer(bounded, bounded.candidate === "A1");
assert.ok(bounded.evaluableCount >= 5 && bounded.evaluableCount <= 7);
assert.equal(bounded.result, "A1"); assert.equal(bounded.stopReason, "boundary_validated");

const limited = Engine.noContent(Engine.create({band:"eso",seedCefr:"B1"}));
assert.equal(limited.confidence, "low"); assert.equal(limited.coverageLimited, true);

const first = Engine.select(Engine.create({band:"p12",seedCefr:"Pre-A1"}), Content.ITEMS);
const nextState = Engine.submit(Engine.create({band:"p12",seedCefr:"Pre-A1"}), first, {kind:"answer",choice:first.correct_index});
const second = Engine.select(nextState, Content.ITEMS);
assert.notEqual(first.interaction_type, second.interaction_type, "la variedad desempata sin cambiar la necesidad de nivel");
assert.equal(first.cefr_probe, second.cefr_probe);

console.log("placement engine: branching, límites, fallos técnicos y variedad comprobados");
