const assert = require("assert");
const W = require("./world-data.js");

assert.equal(W.worldLevel({ lessons:0 }), 1);
assert.equal(W.worldLevel({ lessons:5 }), 2);
assert.equal(W.worldLevel({ lessons:10 }), 3);
assert.equal(W.worldLevel({ lessons:20 }), 4);
assert.equal(W.worldLevel({ lessons:40 }), 5);
assert.deepEqual(W.levelMeta({ lessons:7 }), { level:2, lessons:7, start:5, target:10, remaining:3, percent:40 });
assert.equal(W.worldType("p12"), "garden");
assert.equal(W.worldType("p56"), "base");
assert.equal(W.worldType("eso"), "space");
assert.equal(W.band("unknown"), "neutral");
assert.equal(W.worldType("unknown"), "neutral");
assert.deepEqual(W.catalogFor("unknown", "world"), [], "neutral no hereda recompensas de otra edad");
assert.equal(W.catalogFor("eso", "world").some(item => item.id === "world-flowers"), false);
assert.equal(W.catalogFor("p12", "world").some(item => item.id === "world-toy-plane"), true);

const beginner = W.context({ lessons:1, streak:1 }, ["first-flight"], "p12");
const hoodie = W.CATALOG.find(item => item.id === "top-hoodie");
const backpack = W.CATALOG.find(item => item.id === "acc-backpack");
assert.equal(W.unlockStatus(hoodie, beginner).unlocked, false);
assert.equal(W.unlockStatus(hoodie, beginner).remaining, 2);
assert.equal(W.unlockStatus(backpack, beginner).unlocked, true);
assert.equal(W.unlockStatus(hoodie, W.context({ lessons:3 }, [], "p12")).unlocked, true);
assert.equal(W.isSelected(hoodie, { avatarTop:"hoodie" }), true);
assert.equal(W.isSelected(W.CATALOG.find(item => item.id === "world-pond"), { activeWorldItems:["world-pond"] }), true);

const next = W.nextUnlock({ lessons:4, streak:1 }, "p12", []);
assert.equal(next.unlocked, false);
assert.equal(typeof next.requirement, "string");
assert.equal(W.sections("p12", "avatar").includes("Pelo"), true);
assert.equal(W.displayName(W.CATALOG.find(item => item.id === "top-jacket"), "eso"), "Explorer jacket");
assert.equal(W.unlockedItems({ lessons:24, streak:12 }, ["first-flight"], "p12").length > 10, true);

console.log("world-data: 22 comprobaciones correctas");
