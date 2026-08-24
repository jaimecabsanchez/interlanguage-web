const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const A = require("./motor/achievements.js");
const M = require("./motor/motivacion.js");
const W = require("./world-data.js");

assert.strictEqual(M.MEDALS, A.CATALOG, "motivación debe adaptar el catálogo canónico, no copiarlo");
assert.equal(new Set(A.CATALOG.map(item => item.id)).size, A.CATALOG.length);
assert.ok(A.CATALOG.every(item => item.criterion && item.visual && Array.isArray(item.bands)));
assert.ok(A.CATALOG.every(item => !item.icon), "el catálogo no usa emojis de interfaz");
assert.deepEqual(M.toLegacyIds(["first-flight", "ten-missions", "perfect-round"]), ["primera", "diez_lecciones", "pleno"]);
assert.ok(M.canonicalEarned(["primera", "pleno"]).includes("perfect-round"));
assert.equal(W.STAMP_NAMES["first-flight"], A.byId["first-flight"].name);

const progressSource = fs.readFileSync(path.join(__dirname, "progress-data.js"), "utf8");
assert.match(progressSource, /IL_ACHIEVEMENTS|require\("\.\/motor\/achievements\.js"\)/);
assert.doesNotMatch(progressSource, /stamp\("first-flight"/);
const engineSource = fs.readFileSync(path.join(__dirname, "motor/engine.js"), "utf8");
assert.doesNotMatch(engineSource, /textContent\s*=\s*"\+"\s*\+\s*points/);

console.log("reward catalog: fuente única, adaptación legacy y +10 retirado");
