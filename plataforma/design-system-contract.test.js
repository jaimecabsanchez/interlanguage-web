const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const read = file => fs.readFileSync(path.join(__dirname, file), "utf8");
const tokens = read("design-system.css");
const app = read("app.css");

for (const token of [
  "--il-touch-target", "--il-control-height", "--il-density-gap", "--il-copy-measure",
  "--il-info", "--il-info-soft", "--il-neutral-soft", "--il-surface-glass",
  "--il-success-border", "--il-error-border", "--il-warning-border"
]) assert.match(tokens, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ":"), token + " debe existir");

const expectedTouch = { p12:56, p34:52, p56:48, eso:44, neutral:48 };
for (const [band, size] of Object.entries(expectedTouch)) {
  const block = tokens.match(new RegExp(`(?:root|body)\\[data-stage="${band}"\\][\\s\\S]*?\\{([\\s\\S]*?)\\}`));
  assert.ok(block, "falta política CSS para " + band);
  assert.match(block[1], new RegExp(`--il-touch-target:${size}px`), "target incorrecto para " + band);
}

for (const component of [".il-card", ".il-chip", ".il-progress", ".il-feedback", ".il-state", ".icon-button"])
  assert.ok(app.includes(component), "falta componente compartido " + component);

for (const file of ["app.css", "etapa.css", "il-visual.css"]) {
  const css = read(file).replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(css, /#[0-9a-fA-F]{3,8}|rgba?\(/, file + " debe consumir colores desde tokens");
}

console.log("design system contract: tokens semánticos, targets y componentes compartidos correctos");
