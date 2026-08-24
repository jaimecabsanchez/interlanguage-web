const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const design = fs.readFileSync(path.join(__dirname, "design-system.css"), "utf8");
const shell = fs.readFileSync(path.join(__dirname, "shell.css"), "utf8");

function luminance(hex) {
  const channels = hex.match(/../g).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : Math.pow((value + .055) / 1.055, 2.4));
  return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
}
function contrast(a, b) { const x=luminance(a), y=luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); }
const muted = design.match(/--il-muted:#([0-9a-f]{6})/i)[1];
assert(contrast(muted, "ffffff") >= 4.5, "texto muted cumple AA sobre superficie blanca");
assert.match(shell, /#nl-badge-frame\{display:none!important\}/, "el iframe Netlify inyectado no puede cubrir la navegación");
console.log("accessibility P0: contraste muted AA y badge móvil bloqueado");
