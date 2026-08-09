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
assert.equal(P.detectComeback(["2026-08-01", "2026-08-02"]), false);
assert.equal(P.countWeek(["2026-08-03", "2026-08-04"], 0, "2026-08-06T12:00:00Z"), 2);

console.log("progress-data: 22 comprobaciones correctas");
