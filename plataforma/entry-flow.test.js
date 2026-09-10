const assert = require("node:assert/strict");
const Flow = require("./entry-flow.js");

function memory() { const data = new Map(); return { getItem:key => data.has(key) ? data.get(key) : null, setItem:(key,value) => data.set(key, String(value)) }; }
const storage = memory(), student = { username:"Lucia", is_admin:false, must_change_password:false };
assert.equal(Flow.route(null, null, false), "index.html");
assert.equal(Flow.route({is_admin:true}, null, false), "admin.html");
assert.equal(Flow.route({must_change_password:true}, null, false), "cambiar-clave.html");
assert.equal(Flow.route(student, {placed:true}, false), "inicio.html");
assert.equal(Flow.route(student, {placed:false}, false), "onboarding.html");
assert.equal(Flow.completeOnboarding(storage, "Lucia"), true);
assert.equal(Flow.hasOnboarded(storage, "lucia"), true, "el marcador se normaliza por alumno");
assert.equal(Flow.route(student, {placed:false}, true), "test-nivel.html");
(async () => {
  assert.equal(await Flow.resolve(student, {getPlacement:async () => ({placed:true})}, storage), "inicio.html");
  assert.equal(await Flow.resolve({...student, username:"new"}, {getPlacement:async () => ({placed:false})}, storage), "onboarding.html");
  console.log("entry flow: roles, onboarding, placement completo y continuidad comprobados");
})().catch(error => { console.error(error); process.exitCode = 1; });
