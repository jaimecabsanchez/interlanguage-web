const assert = require("node:assert/strict");
const Options = require("./practice-options.js");

const skills = [
  { id:"listening", count:4, need:1 }, { id:"vocabulary", count:5, need:1 },
  { id:"grammar", count:3, need:1 }, { id:"speaking", count:2, need:1 }
];

let model = Options.build({ band:"p12", dailyStatus:"in_progress", dueCount:5, availableSkills:skills });
assert.equal(model.recommended.kind, "daily", "la misión pendiente conserva prioridad");
assert.equal(model.dailyPending, true);

model = Options.build({ band:"p34", dailyStatus:"completed", dueCount:3, reinforceSkill:"grammar", availableSkills:skills });
assert.equal(model.recommended.kind, "due", "el repaso vencido precede al refuerzo tras completar la misión");

model = Options.build({ band:"p56", dailyStatus:"completed", reinforceSkill:"grammar", availableSkills:skills });
assert.equal(model.recommended.skill, "grammar", "una necesidad explícita no se desplaza por variedad");
assert.equal(model.recommended.reason, "reinforce");

model = Options.build({
  band:"p56", dailyStatus:"completed", availableSkills:skills,
  recentEvents:[{ skill:"listening", submitted_at:"2026-08-24T12:00:00Z" }, { skill:"vocabulary", submitted_at:"2026-08-23T12:00:00Z" }]
});
assert.equal(model.recommended.skill, "grammar", "el cooldown desempata sin repetir la skill reciente");

const stronger = Options.variedSkill([{id:"listening",count:2,need:5},{id:"grammar",count:2,need:1}], [{skill:"listening",submitted_at:"2026-08-24T12:00:00Z"}]);
assert.equal(stronger.id, "listening", "la necesidad pedagógica superior gana al cooldown");

model = Options.build({ band:"p12", dailyStatus:"completed", errorCount:2, availableSkills:skills });
assert.equal(model.review.available, true);
assert.equal(model.skills.length, 3, "p12 muestra como máximo tres conceptos iniciales");
assert.deepEqual(model.skills.map(item => item.id), ["listening", "vocabulary", "speaking"]);

model = Options.build({ band:"unknown", dailyStatus:"completed", availableSkills:[] , hasExtra:false });
assert.equal(model.band, "neutral");
assert.equal(model.hasAnyPractice, false);

console.log("practice options: prioridad diaria, variedad, skills y neutral comprobados");
