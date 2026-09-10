const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const read = file => fs.readFileSync(path.join(__dirname, file), "utf8");
const onboardingHtml = read("onboarding.html"), onboardingJs = read("onboarding.js"), onboardingCss = read("onboarding.css");
const indexHtml = read("index.html"), testJs = read("test-nivel.js"), homeHtml = read("inicio.html");

assert.match(indexHtml, /entry-flow\.js\?v=20260909a/);
assert.match(indexHtml, /await routeFor\(res\.profile\)/);
assert.match(onboardingHtml, /onboarding\.css\?v=20260910a/);
assert.match(onboardingHtml, /onboarding\.js\?v=20260910a/);
assert.match(onboardingHtml, /avatar-rig\.js/);
assert.match(onboardingHtml, /world-visual\.js/);
assert.match(onboardingJs, /ILWorldVisual\.avatar/);
assert.doesNotMatch(onboardingJs, /ILVisual\.nemo/, "la identidad del alumno tiene prioridad");
assert.match(onboardingJs, /ILAuth\.getPlacement/);
assert.match(onboardingJs, /ILEntryFlow\.completeOnboarding/);
assert.match(onboardingJs, /location\.href = "test-nivel\.html"/);
assert.match(testJs, /placement\.placed[^\n]*inicio\.html/);
assert.match(homeHtml, /ILAuth\.getPlacement\(\)/);
assert.match(homeHtml, /cefr: placement\.cefr/);
assert.doesNotMatch(onboardingCss, /#[0-9a-f]{3,8}\b/i);
assert.match(onboardingCss, /data-stage="p12"[\s\S]*min-height:56px/);
assert.match(onboardingCss, /data-stage="eso"/);
assert.match(onboardingCss, /prefers-reduced-motion:reduce/);

console.log("onboarding flow: identidad, roles, placement e Inicio conectados");
