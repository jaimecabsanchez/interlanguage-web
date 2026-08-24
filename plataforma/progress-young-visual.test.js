const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "progreso.html"), "utf8");
const css = fs.readFileSync(path.join(root, "progreso.css"), "utf8");
const js = fs.readFileSync(path.join(root, "progreso.js"), "utf8");

assert.match(html, /id="progressWorldCard"[^>]+href="tienda\.html"[^>]+hidden/);
assert.match(html, /progreso\.css\?v=20260824a/);
assert.match(html, /progreso\.js\?v=20260824a/);

assert.match(js, /if \(ageBand !== "p12" && ageBand !== "p34"\) return;/);
assert.match(js, /loadWorldScript\("world-data\.js\?v=20260810d"/);
assert.match(js, /loadWorldScript\("world-visual\.js\?v=20260820c"/);
assert.match(js, /ILWorldVisual\.scene\(settings, progress, ageBand/);
assert.match(js, /ILWorldData\.unlockStatus\(item, context\)\.unlocked/);
assert.doesNotMatch(js, /function renderRailProgress/);

assert.match(css, /body\[data-stage="p12"\] \.skills-section,[\s\S]*body\[data-stage="p34"\] \.skills-section/);
assert.match(css, /body\[data-stage="p12"\] \.progress-world-card,[\s\S]*body\[data-stage="p34"\] \.progress-world-card\{display:grid/);
assert.doesNotMatch(css, /body\[data-stage="p56"\][^{]*\.skills-section[^}]*display:none/);
assert.doesNotMatch(css, /body\[data-stage="eso"\][^{]*\.skills-section[^}]*display:none/);

console.log("progress young visual: 13 comprobaciones correctas");
