const assert = require("assert");
const W = require("./world-data.js");

assert.equal(W.catalogFor("p12").some(item => item.id === "pet-nube"), true);
assert.equal(W.catalogFor("p34").some(item => item.id === "garden-pond"), true);
assert.equal(W.catalogFor("eso").some(item => item.group === "pet"), false);
assert.equal(W.catalogFor("eso").some(item => item.id === "space-tech"), true);
assert.deepEqual(W.normalizeOwned(["hat", "cat", "hat"]), ["garden-tree", "avatar-cap", "pet-nube"]);
assert.equal(W.balance({ gems: 44.8 }), 44);
assert.equal(W.balance({}), 0);
assert.equal(W.owns({ owned: [] }, "garden-tree"), true);
assert.equal(W.status({ gems:20, owned:[] }, W.catalogFor("p12").find(i => i.id === "garden-flowers")), "locked");
assert.equal(W.status({ gems:40, owned:[] }, W.catalogFor("p12").find(i => i.id === "garden-flowers")), "available");
assert.equal(W.status({ gems:0, owned:["avatar-cap"], hat:"avatar-cap" }, W.catalogFor("p12").find(i => i.id === "avatar-cap")), "equipped");
assert.equal(W.nextUnlock({ gems:20, owned:[] }, "p12").remaining, 20);
assert.equal(W.nextUnlock({ gems:45, owned:["garden-flowers"] }, "p12").id, "avatar-cap");
assert.equal(W.groups("eso")[0].label, "Your space");
assert.equal(W.ownedCount({ owned:[] }, "p12"), 1);

console.log("world-data: 15 comprobaciones correctas");
