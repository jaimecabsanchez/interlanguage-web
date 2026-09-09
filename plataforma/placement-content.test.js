const assert = require("node:assert/strict");
const Content = require("./placement-content.js");

const result = Content.validate();
assert.equal(result.valid, true, JSON.stringify(result.errors));
assert.equal(new Set(Content.ITEMS.map(item => item.id)).size, Content.ITEMS.length);
Content.BANDS.forEach(band => Content.CEFR.forEach(level => {
  const group = Content.ITEMS.filter(item => item.bands.includes(band) && item.cefr_probe === level);
  assert.ok(group.length >= 2, band + " " + level + " tiene cobertura");
  assert.ok(new Set(group.map(item => item.interaction_type)).size >= 2, band + " " + level + " tiene variedad de modalidad");
}));
assert.ok(Content.forBand("eso").every(item => item.context === "teen"), "ESO no recibe contextos infantiles");
assert.ok(Content.forBand("unknown").every(item => item.bands.includes("neutral")), "una banda desconocida usa neutral explícito");
const broken = Content.ITEMS.slice(); broken[0] = Object.assign({}, broken[0], { correct_index:99 });
assert.ok(Content.validate(broken).errors.some(error => error.code === "invalid_answer"));
console.log("placement content: contrato, cobertura, contexto y neutral comprobados");
