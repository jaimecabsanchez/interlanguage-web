const assert = require("node:assert/strict");
const Session = require("./session-state.js");

let state = Session.create();
assert.equal(state.value, "loading");
state = Session.ready(state); assert.equal(state.value, "idle");
state = Session.select(state, true); assert.equal(state.value, "selected"); assert.equal(state.canCheck, true);
state = Session.check(state); assert.equal(state.value, "checking"); assert.equal(state.attempts, 1);
state = Session.resolve(state, false); assert.equal(state.value, "retry"); assert.equal(state.canContinue, false);
state = Session.select(state, true); state = Session.check(state); state = Session.resolve(state, false);
assert.equal(state.value, "incorrect", "el segundo fallo revela la solución y permite continuar");
assert.equal(state.attempts, 2); assert.equal(state.canContinue, true);
state = Session.complete(state); assert.equal(state.value, "complete");

state = Session.ready(Session.create()); state = Session.select(state, true); state = Session.check(state); state = Session.resolve(state, true);
assert.equal(state.value, "correct"); assert.equal(state.canContinue, true);

state = Session.technical(Session.ready(Session.create()));
assert.equal(state.value, "technical-error"); assert.equal(state.canContinue, true);
assert.deepEqual(Session.VALUES, ["loading", "idle", "selected", "checking", "correct", "incorrect", "retry", "technical-error", "complete"]);

console.log("session state: nueve estados, dos intentos y error técnico comprobados");
