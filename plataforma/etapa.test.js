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
assert.equal(base.modeFor({}), "neutral");
assert.equal(base.bandFor({ age: 7 }), "p12");
assert.equal(base.bandFor({ age: 9 }), "p34");
assert.equal(base.bandFor({ age: 11 }), "p56");
assert.equal(base.bandFor({ age: 12 }), "eso");
assert.equal(base.bandFor({ age_mode: "secondary" }), "eso");
assert.equal(base.bandFor({}), "neutral");
assert.equal(base.config("primary-young").exerciseLimit, 5);
assert.equal(base.config("primary-upper").exerciseLimit, 6);
assert.equal(base.config("secondary").exerciseLimit, 7);
assert.equal(base.exerciseConfig("p12").touchSize, 56);
assert.equal(base.exerciseConfig("p12").sessionSize, 4);
assert.equal(base.exerciseConfig("p34").instructionLanguage, "spanish");
assert.equal(base.exerciseConfig("p56").instructionLanguage, "spanish-contextual-english");
assert.equal(base.exerciseConfig("p56").guideIntensity, "low");
assert.equal(base.exerciseConfig("eso").visualSupport, "content-only");
assert.equal(base.exerciseConfig("unknown").band, "neutral");
assert.deepEqual(base.DEMO_STAGES.map(item => item.band), ["p12", "p34", "p56", "eso"]);
assert.equal(base.config("primary-upper").copy.startCta, "Empezar", "p56 conserva chrome en español");

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

// Enlace de preview (?demo=1) en un dominio real: el demo está FORZADO, así que
// el selector de etapa y el override SÍ se activan aunque el host no sea local.
const livePreviewBody = { dataset: {}, appendChild() {} };
const livePreview = createStageSystem({
  Date,
  location: { search: "?ageMode=secondary", hostname: "vocal-sable-9ad3e4.netlify.app" },
  ILAuth: { isDemo: () => true, isDemoForced: () => true },
  sessionStorage: storage(),
  document: { body: livePreviewBody, getElementById: () => null, createElement: () => ({ setAttribute() {}, appendChild() {}, append() {}, addEventListener() {}, querySelector() { return null; } }) }
});
assert.equal(livePreview.apply({ age: 8 }), "eso", "a forced-demo preview link enables the stage override on a live host");
assert.equal(livePreviewBody.dataset.ageMode, "secondary");

const demoBody = { dataset: {}, appendChild() {} };
const demo = createStageSystem({
  Date,
  location: { search: "?ageMode=secondary" },
  sessionStorage: storage(),
  document: { body: demoBody, getElementById: () => null, createElement: () => ({ setAttribute() {}, appendChild() {}, append() {}, addEventListener() {}, querySelector() { return null; } }) }
});
assert.equal(demo.apply({ age: 8 }, { demo: true }), "eso");
assert.equal(demoBody.dataset.ageMode, "secondary");

const fiveYearDemoBody = { dataset: {}, appendChild() {} };
const fiveYearDemo = createStageSystem({
  Date,
  location: { search: "?ageMode=p12" },
  sessionStorage: storage(),
  document: { body: fiveYearDemoBody, getElementById: () => null, createElement: () => ({ setAttribute() {}, appendChild() {}, append() {}, addEventListener() {}, querySelector() { return null; } }) }
});
assert.equal(fiveYearDemo.apply({ age: 9 }, { demo: true }), "p12");
assert.equal(fiveYearDemo.current().exercise.sessionSize, 4);

const reports = [];
const unresolvedBody = { dataset:{}, appendChild() {} };
const unresolved = createStageSystem({
  Date, location:{ search:"" }, ILObservability:{ report:(...args) => reports.push(args) },
  document:{ body:unresolvedBody, getElementById:() => null }, sessionStorage:storage(), localStorage:storage()
});
assert.equal(unresolved.apply({ id:"student-without-age" }, { demo:false }), "neutral");
assert.equal(unresolvedBody.dataset.ageMode, "neutral");
assert.equal(unresolvedBody.dataset.stage, "neutral");
assert.ok(reports.some(entry => entry[0] === "invalid_data" && entry[1] === "age_band_unresolved"));

console.log("etapa.test.js ok");
