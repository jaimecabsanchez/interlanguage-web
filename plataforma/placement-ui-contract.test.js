const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "test-nivel.html"), "utf8");
const css = fs.readFileSync(path.join(root, "test-nivel.css"), "utf8");
const js = fs.readFileSync(path.join(root, "test-nivel.js"), "utf8");

["placement-content.js", "placement-engine.js", "placement-session.js", "test-nivel.js"].forEach(file => {
  assert.match(html, new RegExp(file.replace(".", "\\.") + (file === "test-nivel.js" ? "\\?v=20260910d" : "\\?v=20260909a")), file + " tiene cache-busting vigente");
});
assert.match(html, /test-nivel\.css\?v=20260910a/);
assert.match(js, /ILPlacementEngine\.select/);
assert.match(js, /ILCopy\.practiceSkill\(current\.skill, band\)/, "p12 recibe Palabras/Frases en vez de etiquetas académicas");
assert.match(js, /ILPlacementSession\.read/);
assert.match(js, /ILAuth\.savePlacement/);
assert.match(js, /technicalFailure:true/);
assert.match(js, /kind:"unknown"/);
assert.doesNotMatch(js, /completeLesson|ILMission|award|achievement|mastery/i, "la calibración no altera misión ni rewards");
assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i, "los colores usan únicamente tokens --il-*");
assert.match(css, /data-stage="p12"[\s\S]*min-height:56px/);
assert.match(css, /data-stage="p12"[^\n]*placement-progress-value[^\n]*display:none/, "p12 no muestra porcentaje");
assert.match(css, /data-stage="eso"[\s\S]*min-height:44px/);
assert.match(css, /prefers-reduced-motion:reduce/);
assert.match(html, /aria-live="polite"/);
assert.match(html, /aria-live="assertive"/);
assert.match(html, /role="progressbar"/);

console.log("placement UI: módulos, accesibilidad, targets por edad y aislamiento comprobados");
