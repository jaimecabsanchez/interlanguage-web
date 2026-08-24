const assert = require("node:assert/strict");
const Family = require("./family-data.js");

const full = Family.build({
  profile: { full_name: "Lucía G." }, lessons: 24,
  week: { count: 4 }, expressionsMastered: 12, accuracy: 77, minutesWeek: 24,
  skills: [
    { id: "vocabulary", label: "Vocabulary", percent: 75 },
    { id: "listening", label: "Listening", percent: 50 },
    { id: "writing", label: "Writing", percent: null }
  ],
  reinforce: { skill: "Listening", description: "Conviene reforzar la comprensión oral.", href: "leccion.html" },
  familyEvidence: {
    exercisesWeek: 31, newExpressionsWeek: 12,
    weeklyHistory: [
      { label: "-3", sessions: 2, minutes: 13, accuracy: 68 },
      { label: "-2", sessions: 3, minutes: 17, accuracy: 71 },
      { label: "-1", sessions: 3, minutes: 21, accuracy: 74 },
      { label: "Ahora", sessions: null, minutes: 24, accuracy: 77 }
    ],
    contents: [{ title: "Daily routines", detail: "Rutinas", skills: ["Vocabulary"] }],
    recommendation: { title: "Listening", description: "Practicar", action: "Practicar", href: "leccion.html" },
    classConnection: { period: "Esta semana", topic: "Daily routines", skills: ["Vocabulary"], message: "Refuerzo" }
  }
});

assert.equal(full.sufficientEvidence, true);
assert.equal(full.metrics.find(item => item.id === "exercises").value, 31);
assert.equal(full.metrics.find(item => item.id === "accuracy").source, "demo");
assert.equal(full.consistency.history[3].sessions, 4, "la semana actual procede del snapshot compartido");
assert.equal(full.strengths[0].label, "Vocabulary");
assert.equal(full.reinforce.skill, "Listening");
assert.match(full.headline, /mayor constancia/);
assert.match(full.evolution.message, /precisión ha mejorado/);

const sparse = Family.build({ profile: { full_name: "Lucía" }, lessons: 1, week: { count: 1 }, skills: [] });
assert.equal(sparse.sufficientEvidence, false);
assert.equal(sparse.metrics.find(item => item.id === "accuracy").sufficient, false);
assert.match(sparse.lowDataMessage, /acaba de empezar/);
assert.equal(sparse.consistency.history.length, 0);

const forced = Family.build(Object.assign({}, full, { profile: { full_name: "Lucía" }, lessons: 24 }), { forceSparse: true });
assert.equal(forced.sufficientEvidence, false);
assert.deepEqual(forced.phrases, [], "la vista de alumno nuevo no hereda frases del demo");
assert.equal(forced.metrics.find(item => item.id === "days").value, 0, "la vista de alumno nuevo no hereda actividad del demo");

console.log("family-data: 13 comprobaciones correctas");
