const assert = require("node:assert/strict");
const Events = require("./learning-events.js");

const base = { client_session_key:"s1", exercise_id:"e1", objective_id:"o1", age_band:"p12", cefr:"Pre-A1", skill:"listening", mode:"daily" };
const ev = (attempt, correct, extra) => Events.create(Object.assign({}, base, { attempt_number:attempt, correct }, extra));

let rows = [ev(1, true)];
let summary = Events.summarize(rows, ["e1"]);
assert.equal(summary.first_try_correct_count, 1);
assert.equal(summary.eventual_success_count, 1);
assert.equal(summary.perfect, true, "correct first try concede perfecto");

rows = [ev(1, false), ev(2, true, { hint_used:true })];
summary = Events.summarize(rows, ["e1"]);
assert.equal(summary.first_try_correct_count, 0);
assert.equal(summary.eventual_success_count, 1);
assert.equal(summary.perfect, false, "wrong → correct nunca concede perfecto");
assert.deepEqual(summary.incorrect_ids, ["e1"]);

rows = [ev(1, false), ev(2, false, { hint_used:true }), ev(3, true, { hint_used:true })];
summary = Events.summarize(rows, ["e1"]);
assert.equal(summary.eventual_success_count, 1);
assert.equal(summary.perfect, false, "wrong → wrong → correct no es perfecto");

rows = [Events.create(Object.assign({}, base, { technical_failure:true, failure_type:"audio_unavailable" }))];
summary = Events.summarize(rows, ["e1"]);
assert.equal(summary.evaluable_count, 0);
assert.equal(summary.technical_failure_count, 1);
assert.equal(summary.perfect, false);

rows = [ev(1, true), Events.create(Object.assign({}, base, { exercise_id:"e2", attempt_number:1, correct:true }))];
assert.equal(Events.summarize(rows, ["e1", "e2"]).perfect, true);
console.log("learning-events: first try, eventual success, técnico y perfecto correctos");
