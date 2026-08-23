const assert = require("assert");
const createProgressData = require("./progress-data.js");
const P = createProgressData();

const demo = P.buildSnapshot({
  isDemo: true,
  profile: { username: "lucia", full_name: "Lucía Martín" },
  progress: { lessons: 24, streak: 12, best: 18 },
  week: { goal: 5, count: 3, practiced: [0, 1, 3] },
  activityDays: ["2026-07-27", "2026-07-28", "2026-08-03", "2026-08-04", "2026-08-06"],
  routineMissions: 3,
  now: "2026-08-06T12:00:00Z"
});

assert.equal(demo.minutesWeek, 24);
assert.equal(demo.wordsLearned, 43);
assert.equal(demo.accuracy, 77);
assert.equal(demo.expressionsMastered, 12);
assert.equal(demo.familyEvidence.exercisesWeek, 31);
assert.equal(demo.week.count, 4, "la semana demo procede de la fuente central");
assert.equal(Math.max(...demo.week.practiced) <= 3, true, "la semana demo nunca completa días posteriores a hoy");
assert.equal(demo.skills.length, 6);
assert.equal(demo.skills.find(s => s.id === "writing").percent, null);
assert.equal(demo.phrases[0], "I get up at seven.");
assert.equal(demo.stamps.items.find(s => s.id === "first-flight").unlocked, true);
assert.equal(demo.stamps.items.find(s => s.id === "weekly-explorer").percent, 80);
assert.equal(demo.stamps.items.find(s => s.id === "morning-explorer").percent, 60);
assert.equal(demo.stamps.next.id, "word-collector");
assert.equal(demo.profileSummary.levelName, "Explorer 2");
assert.equal(demo.profileSummary.levelProgress, 65);

const real = P.buildSnapshot({
  isDemo: false,
  profile: { username: "ana" },
  progress: { lessons: 2, streak: 1 },
  week: { goal: 5, count: 1, practiced: [0] },
  activityDays: ["2026-07-01", "2026-07-07"],
  authSkills: { hasData: false, skills: [] },
  masteredPhrases: [],
  now: "2026-08-06T12:00:00Z"
});

assert.equal(real.minutesTotal, null, "no inventa minutos en cuentas reales");
assert.equal(real.wordsLearned, null, "no inventa palabras en cuentas reales");
assert.equal(real.skills.every(s => s.percent === null), true);
assert.equal(real.profileSummary.levelProgress, null, "no inventa progreso de nivel en cuentas reales");
assert.equal(real.comeback, true);
const secondary = P.buildSnapshot({
  isDemo: false,
  ageMode: "secondary",
  profile: { username: "leo" },
  progress: { lessons: 2 },
  week: { goal: 5, count: 1, practiced: [0] },
  focusMissions: 2,
  now: "2026-08-06T12:00:00Z"
});
assert.equal(secondary.stamps.items.some(s => s.id === "morning-explorer"), false, "ESO no recibe un logro infantil de rutinas matinales");
assert.equal(secondary.stamps.items.find(s => s.id === "weekend-planner").percent, 40);
assert.equal(P.detectComeback(["2026-08-01", "2026-08-02"]), false);
assert.equal(P.countWeek(["2026-08-03", "2026-08-04"], 0, "2026-08-06T12:00:00Z"), 2);
const mondayDemo = P.normalizeWeek({ username: "lucia" }, null, true, "2026-08-10T12:00:00Z");
assert.deepEqual(mondayDemo, { goal: 5, count: 1, practiced: [0] }, "el lunes no inventa actividad futura");

const p12Week = P.weeklyPresentation({ goal: 5, count: 4 }, "p12");
assert.equal(p12Week.message, "¡Vas genial! Ya has hecho 4. Solo te falta 1.");
assert.equal(p12Week.countLabel, "4 / 5");
const p34Week = P.weeklyPresentation({ goal: 5, count: 4 }, "p34");
assert.equal(p34Week.title, "4 de 5 sesiones");
assert.equal(p34Week.message, "Solo te falta una sesión");
assert.deepEqual(P.contextualAction({ week: { goal: 5, count: 4 } }, "p12"), {
  label: "Completa el último día", href: "leccion.html", tab: null
});
assert.deepEqual(P.contextualAction({ week: { goal: 5, count: 5 } }, "p34"), {
  label: "Ver logros", href: "#stamps", tab: "stamps"
});
assert.deepEqual(P.visibleSkills(demo.skills).map(skill => skill.id), ["vocabulary", "reading", "grammar", "listening"]);
assert.deepEqual(P.visibleSkills(real.skills), [], "una cuenta real sin evidencia no recibe porcentajes inventados");

console.log("progress-data: 34 comprobaciones correctas");
