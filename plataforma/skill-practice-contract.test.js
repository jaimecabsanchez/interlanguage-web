const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const lesson = fs.readFileSync(path.join(__dirname, "leccion.html"), "utf8");
const modeStart = lesson.indexOf("if (skillMode) {", lesson.indexOf("completionProgress = progress"));
const dailyStart = lesson.indexOf("dailyItems = ILMission.getOrCreateSession");
const modeBlock = lesson.slice(modeStart, dailyStart);

assert.ok(modeStart > 0 && dailyStart > modeStart, "la práctica por skill se resuelve antes que la misión diaria");
assert.match(lesson, /const extraMode = \(\) =>[^;]*skillMode/, "mode=skill se considera práctica extra");
assert.doesNotMatch(modeBlock, /ILMission\.(ensure|begin|pause|complete|getOrCreateSession)/, "la rama libre no toca el estado diario");
assert.match(modeBlock, /ILAuth\.startPracticeSession\([\s\S]*?mode:"extra"/, "la práctica libre registra una sesión extra");
assert.match(lesson, /if \(skillMode\) \{[\s\S]*?ILAuth\.finishPracticeSession/, "la sesión libre se cierra y conserva su evidencia");
assert.match(modeBlock, /if \(hasPractice\) \{ location\.replace\("practicar\.html\?notice=unavailable"\); return; \}/, "una skill no disponible vuelve al centro con un aviso");
assert.match(modeBlock, /compatible\.some\(exercise => ILPracticeOptions\.SKILLS\.indexOf\(exercise\.habilidad\) !== -1\)/, "solo cuenta alternativas realmente válidas");
assert.match(modeBlock, /\{ href:"inicio\.html"/, "Inicio solo se ofrece cuando no queda práctica compatible");
assert.match(lesson, /renderExtraSummary\(sessionTruth\)/, "la práctica por habilidad tiene resumen basado en evidencia");
assert.match(lesson, /truth\.first_try_correct_count/);
assert.match(lesson, /Date\.now\(\) - skillStartedAt/);
assert.match(lesson, /location\.href = skillMode \? "practicar\.html" : "inicio\.html"/, "salir de una skill vuelve a Practicar");

console.log("skill practice: aislamiento diario, persistencia y retorno seguro comprobados");
