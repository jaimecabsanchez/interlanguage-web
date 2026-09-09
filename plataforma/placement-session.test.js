const assert = require("node:assert/strict");
const Session = require("./placement-session.js");

function memory() {
  const values = new Map();
  return { getItem:key => values.has(key) ? values.get(key) : null, setItem:(key,value) => values.set(key,String(value)), removeItem:key => values.delete(key) };
}
const storage = memory();
const ctx = { username:" Lucía ", band:"p12", instrumentId:"adaptive-starting-point", instrumentVersion:"2" };
const state = { band:"p12", seedCefr:"A1", status:"active", responses:[{item_id:"q1",cefr_probe:"A1",kind:"answer",correct:true,evaluable:true}], evaluableCount:1 };
assert.equal(Session.write(storage, ctx, state).ok, true);
assert.equal(Session.read(storage, ctx).engineState.evaluableCount, 1, "reanuda el mismo usuario, banda y versión");

let reason = "";
assert.equal(Session.read(storage, Object.assign({},ctx,{band:"p34"}), value => { reason=value; }), null);
assert.equal(reason, "incompatible_draft");
assert.equal(Session.read(storage, ctx), null, "el borrador incompatible se retira");

Session.write(storage, ctx, state);
assert.equal(Session.read(storage, Object.assign({},ctx,{instrumentVersion:"3"})), null, "otra versión no se reutiliza");
Session.write(storage, ctx, state);
assert.equal(Session.read(storage, Object.assign({},ctx,{username:"otro"})), null, "otro alumno no accede al borrador");

const metadata = Session.meta({band:"eso",seedCefr:"A2",confidence:"medium",coverageLimited:true,stopReason:"coverage_exhausted",evaluableCount:7,technicalCount:1}, {instrumentId:"adaptive-starting-point",instrumentVersion:"2"});
assert.equal(metadata.confidence, 0.65);
assert.equal(metadata.metadata.confidence_band, "medium");
assert.equal(metadata.metadata.coverage_limited, true);
assert.equal(Session.clear(storage, "lucía"), true);

console.log("placement session: aislamiento, reanudación y metadatos comprobados");
