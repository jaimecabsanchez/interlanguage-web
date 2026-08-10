const assert = require("node:assert/strict");
const createStageSystem = require("./etapa.js");

function storage(seed) {
  const values = new Map(Object.entries(seed || {}));
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}

const base = createStageSystem({ Date, location: { search: "" }, sessionStorage: storage(), localStorage: storage() });
assert.equal(base.modeFor({ age: 7 }), "primary-young");
assert.equal(base.modeFor({ age: 9 }), "primary-young");
assert.equal(base.modeFor({ age: 10 }), "primary-upper");
assert.equal(base.modeFor({ age: 13 }), "secondary");
assert.equal(base.modeFor({}), "primary-upper");
assert.equal(base.bandFor({ age: 7 }), "p12");
assert.equal(base.bandFor({ age: 9 }), "p34");
assert.equal(base.bandFor({ age: 11 }), "p56");
assert.equal(base.bandFor({ age: 12 }), "eso");
assert.equal(base.bandFor({ age_mode: "secondary" }), "eso");
assert.equal(base.config("primary-young").exerciseLimit, 5);
assert.equal(base.config("primary-upper").exerciseLimit, 6);
assert.equal(base.config("secondary").exerciseLimit, 7);
assert.equal(base.exerciseConfig("p12").touchSize, 56);
assert.equal(base.exerciseConfig("p12").sessionSize, 4);
assert.equal(base.exerciseConfig("p34").instructionLanguage, "bilingual");
assert.equal(base.exerciseConfig("p56").guideIntensity, "low");
assert.equal(base.exerciseConfig("eso").visualSupport, "content-only");

const body = { dataset: {}, appendChild() {} };
const production = createStageSystem({
  Date,
  location: { search: "?ageMode=secondary" },
  sessionStorage: storage({ il_demo_age_mode_v1: "secondary" }),
  document: { body, getElementById: () => null }
});
assert.equal(production.apply({ age: 8 }, { demo: false }), "p34", "production ignores demo overrides");
assert.equal(body.dataset.ageMode, "primary-young");

const liveBody = { dataset: {}, appendChild() {} };
const liveWithoutKeys = createStageSystem({
  Date,
  location: { search: "?ageMode=secondary", hostname: "home.interlanguage.es" },
  ILAuth: { isDemo: () => true },
  sessionStorage: storage({ il_demo_age_mode_v1: "secondary" }),
  document: { body: liveBody, getElementById: () => null }
});
assert.equal(liveWithoutKeys.apply({ age: 8 }), "p34", "a live host never enables the demo selector or override");
assert.equal(liveBody.dataset.ageMode, "primary-young");

const demoBody = { dataset: {}, appendChild() {} };
const demo = createStageSystem({
  Date,
  location: { search: "?ageMode=secondary" },
  sessionStorage: storage(),
  document: { body: demoBody, getElementById: () => null, createElement: () => ({ setAttribute() {}, appendChild() {}, append() {}, addEventListener() {}, querySelector() { return null; } }) }
});
assert.equal(demo.apply({ age: 8 }, { demo: true }), "eso");
assert.equal(demoBody.dataset.ageMode, "secondary");

console.log("etapa.test.js ok");
