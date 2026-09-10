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

model = Options.build({ band:"p34", dailyStatus:"completed", dueCount:0, availableSkills:skills });
assert.notEqual(model.recommended.kind, "daily", "la misión terminada libera la recomendación adaptativa");

model = Options.build({ band:"p56", dailyStatus:"completed", reinforceSkill:"grammar", availableSkills:skills.map(item => Object.assign({}, item, { need:item.id === "grammar" ? 60 : 20 })) });
assert.equal(model.recommended.skill, "grammar", "una necesidad explícita no se desplaza por variedad");
assert.equal(model.recommended.reason, "reinforce");

const now = Date.parse("2026-08-24T18:00:00Z");
model = Options.build({
  band:"p56", dailyStatus:"completed", availableSkills:skills,
  now,
  recentEvents:[{ skill:"listening", submitted_at:"2026-08-24T12:00:00Z" }, { skill:"vocabulary", submitted_at:"2026-08-23T12:00:00Z" }]
});
assert.equal(model.recommended.skill, "grammar", "el cooldown desempata sin repetir la skill reciente");

const equivalent = Options.variedSkill(
  [{id:"listening",count:2,need:64},{id:"grammar",count:2,need:60}],
  [{skill:"listening",submitted_at:"2026-08-24T12:00:00Z"}],
  { now }
);
assert.equal(equivalent.id, "grammar", "una alternativa pedagógicamente equivalente evita repetir la skill en cooldown");
assert.equal(equivalent.recentlyPracticed, false);

const stronger = Options.variedSkill([{id:"listening",count:2,need:80},{id:"grammar",count:2,need:40}], [{skill:"listening",submitted_at:"2026-08-24T12:00:00Z"}], { now });
assert.equal(stronger.id, "listening", "la necesidad pedagógica superior gana al cooldown");
assert.equal(stronger.recentlyPracticed, true, "el modelo explicita cuándo la necesidad gana aunque exista cooldown");

model = Options.build({
  band:"p56", dailyStatus:"completed",
  availableSkills:[{id:"listening",count:2,need:90,evidence:1,sufficient:false},{id:"reading",count:2,need:55,evidence:8,sufficient:true}]
});
assert.equal(model.recommended.skill, "reading", "la recomendación prioriza habilidades con evidencia suficiente");

model = Options.build({ band:"p12", dailyStatus:"completed", errorCount:2, availableSkills:skills });
assert.equal(model.review.available, true);
assert.equal(model.skills.length, 3, "p12 muestra como máximo tres conceptos iniciales");
assert.deepEqual(model.skills.map(item => item.id), ["listening", "vocabulary", "speaking"]);

model = Options.build({ band:"p34", dailyStatus:"completed", availableSkills:Options.SKILLS.map(id => ({id,count:1})) });
assert.deepEqual(model.skills.map(item => item.id), ["listening", "vocabulary", "speaking", "reading"], "p34 introduce cuatro habilidades comprensibles");
assert.equal(Options.build({ band:"p56", dailyStatus:"completed", availableSkills:skills }).skills.length, 4, "p56 conserva todas las habilidades disponibles");
assert.equal(Options.build({ band:"eso", dailyStatus:"completed", availableSkills:skills }).skills.length, 4, "ESO conserva todas las habilidades disponibles");

model = Options.build({ band:"unknown", dailyStatus:"completed", availableSkills:[] , hasExtra:false });
assert.equal(model.band, "neutral");
assert.equal(model.hasAnyPractice, false);

model = Options.build({ band:"p34", dailyStatus:"completed", availableSkills:[{id:"not-a-skill",count:4}], hasExtra:false });
assert.equal(model.hasAnyPractice, false, "una skill inválida no crea una ruta engañosa");

const picked = Options.selectExercises({
  cefr:"A1", limit:2,
  exercises:[
    {id:"recent-a1",nivel:"A1"}, {id:"fresh-a1",nivel:"A1"}, {id:"fresh-a2",nivel:"A2"}
  ],
  recentEvents:[{exercise_id:"recent-a1",submitted_at:"2026-08-24T12:00:00Z"}]
});
assert.deepEqual(picked.map(item => item.id), ["fresh-a1", "recent-a1"], "el nivel manda y el cooldown solo desempata");

console.log("practice options: prioridad diaria, variedad, skills, selector y neutral comprobados");
