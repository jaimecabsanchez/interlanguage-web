const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const engine = fs.readFileSync(path.join(__dirname, "motor/engine.js"), "utf8");
const schema = fs.readFileSync(path.join(__dirname, "content/schema.js"), "utf8");
assert.match(schema, /audio_src: source\.audio_src \|\| source\.audio_url/);
assert.match(engine, /function playAudio\(source, text, callbacks\)/);
assert(engine.indexOf("new Audio(source)") < engine.indexOf("return speak(text, callbacks)"), "audio editorial se intenta antes de TTS");
assert.match(engine, /registerTechnicalFailure\("audio_unavailable"\)/);
assert.match(engine, /Continuar sin penalización/);
assert.match(engine, /onTechnicalFailure/);
console.log("audio reliability: editorial → TTS → salida técnica no penalizadora");
