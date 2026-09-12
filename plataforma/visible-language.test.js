const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const home = fs.readFileSync(path.join(root, "inicio.html"), "utf8");
const engine = fs.readFileSync(path.join(root, "motor", "engine.js"), "utf8");
const lesson = fs.readFileSync(path.join(root, "leccion.html"), "utf8");
const Copy = require("./copy-registry.js");

assert.equal(Copy.missionTitle({ id:"gramatica-inicial" }, "p12"), "Palabras y frases");
assert.equal(Copy.missionTitle({ id:"gramatica-inicial" }, "p34"), "Palabras y frases");
assert.equal(Copy.missionTitle({ id:"gramatica-inicial" }, "p56"), "Words & sentences");
assert.equal(Copy.skill("grammar", "p34"), "Gramática");
assert.equal(Copy.skill("grammar", "p56"), "Grammar");
assert.equal(Copy.text("startCta", "p56"), "Empezar");
assert.match(home, /ILCopy\.missionTitle\(unit, band\)/);
assert.match(home, /titleFor\(unit, stage\)/);
assert.match(home, /skillLabelFor\(skill, stage\)/);

assert.match(engine, /ILCopy\.skill\(skillId, band\)/);
assert.match(engine, /ILCopy\.support\(exercise\.tipo/);
assert.doesNotMatch(engine, /exercise\.etiqueta \|\| \(band === "p12"/);
assert.match(lesson, /copy-registry\.js\?v=20260910b/);
assert.match(lesson, /motor\/engine\.js\?v=20260912a/);

console.log("visible language: registro canónico y p56 híbrido comprobados");
