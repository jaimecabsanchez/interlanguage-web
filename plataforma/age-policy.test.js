const assert = require("assert");
const Policy = require("./age-policy.js");

assert.deepEqual(Object.keys(Policy.BANDS), ["p12", "p34", "p56", "eso", "neutral"]);
assert.equal(Policy.resolve("p12").touchSize, 56);
assert.equal(Policy.resolve("eso").touchSize, 44);
assert.equal(Policy.resolve("unknown").band, "neutral", "una banda desconocida debe resolver al modo seguro");
assert.equal(Policy.resolve(null).band, "neutral");
assert.ok(Policy.BANDS.p56.preferredCefr.includes("Pre-A1"), "edad y CEFR no forman una jerarquía rígida");
assert.ok(Policy.BANDS.eso.preferredCefr.includes("A1"));
assert.equal(Policy.BANDS.p12.instructionLanguage, "spanish");
assert.equal(Policy.BANDS.p56.instructionLanguage, "spanish-contextual-english");
console.log("age policy: contrato único, neutral seguro y edad × CEFR comprobados");
