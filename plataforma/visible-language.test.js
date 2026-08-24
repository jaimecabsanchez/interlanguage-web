const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const home = fs.readFileSync(path.join(root, "inicio.html"), "utf8");
const engine = fs.readFileSync(path.join(root, "motor", "engine.js"), "utf8");
const lesson = fs.readFileSync(path.join(root, "leccion.html"), "utf8");

assert.match(home, /"gramatica-inicial": \{ es: "Palabras y frases", en: "Words & sentences" \}/);
assert.match(home, /grammar: \{ es: "Gramática", en: "Grammar" \}/);
assert.match(home, /band === "p12" \|\| band === "p34" \? entry\.es : entry\.en/);
assert.match(home, /titleFor\(unit, stage\)/);
assert.match(home, /skillLabelFor\(skill, stage\)/);

assert.match(engine, /grammar: \{ icon: "grammar", es: "Gramática", en: "Grammar" \}/);
assert.match(engine, /band === "p12" \|\| band === "p34" \? skill\.es : skill\.en/);
assert.doesNotMatch(engine, /exercise\.etiqueta \|\| \(band === "p12"/);
assert.match(lesson, /motor\/engine\.js\?v=20260824b/);

console.log("visible language: 9 comprobaciones correctas");
