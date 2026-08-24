/* Tests de la colección unificada de achievements (Node/CI).
   node plataforma/motor/achievements.test.js  (sale 1 si falla) */
const A = require("./achievements.js");
const WORLD = require("../world-data.js");
const M = require("./motivacion.js");
const LearningEvents = require("../learning-events.js");

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log("✅ " + n); } else { fail++; console.error("❌ " + n); } };
const has = (arr, id) => arr.indexOf(id) !== -1;

// ---- Integridad del catálogo ----
ok("familias válidas", A.CATALOG.every(i => A.FAMILIES.indexOf(i.family) >= 0));
(function () { const seen = {}; let dup = false; A.CATALOG.forEach(i => { if (seen[i.id]) dup = true; seen[i.id] = 1; }); ok("ids únicos (sin duplicados)", !dup); })();
ok("cada logro tiene criterio y visual", A.CATALOG.every(i => i.criterion && i.visual));
ok("rarezas válidas", A.CATALOG.every(i => ["common", "rare", "epic"].indexOf(i.rarity) >= 0));
ok("momentary bien marcado", A.byId["perfect-round"].momentary === true && A.byId["first-flight"].momentary === false);

// ---- world item availability: cada reward referenciado existe en world-data ----
const worldIds = new Set(WORLD.CATALOG.map(i => i.id));
ok("todos los rewards existen en world-data", A.CATALOG.every(i => !i.reward || worldIds.has(i.reward)));

// ---- unlock conditions / mission rewards: evaluate otorga lo correcto ----
ok("first-flight con 1 misión", has(A.evaluate({ lessons: 1, session: {} }), "first-flight"));
ok("ten-missions con 10", has(A.evaluate({ lessons: 10, session: {} }), "ten-missions"));
ok("streak-5 con racha 5", has(A.evaluate({ streak: 5, session: {} }), "streak-5"));
ok("weekly-explorer con weekCount 5", has(A.evaluate({ weekCount: 5, session: {} }), "weekly-explorer"));
ok("word-collector con 50 palabras", has(A.evaluate({ wordsLearned: 50, session: {} }), "word-collector"));
ok("listening-star con 20 aciertos", has(A.evaluate({ skillCorrect: { listening: 20 }, session: {} }), "listening-star"));
ok("grammar-builder con 8 dominados", has(A.evaluate({ mastery: { grammar: 8 }, session: {} }), "grammar-builder"));
ok("perfect-round con sesión perfecta", has(A.evaluate({ session: { total: 4, allCorrect: true, maxCorrectStreak: 4 } }), "perfect-round"));
ok("sharp-5 con 5 seguidos", has(A.evaluate({ session: { maxCorrectStreak: 5 } }), "sharp-5"));
ok("comeback con vuelta", has(A.evaluate({ comeback: true, session: {} }), "comeback"));
ok("record-streak si supera récord", has(A.evaluate({ streak: 6, prevBest: 5, session: {} }), "record-streak"));

// negativos
ok("contexto vacío no otorga nada", A.evaluate({ session: {} }).length === 0);
ok("no perfect si falla alguno", !has(A.evaluate({ session: { total: 4, allCorrect: false, maxCorrectStreak: 2 } }), "perfect-round"));
const retryEvents = [
  LearningEvents.create({exercise_id:"e1",attempt_number:1,correct:false}),
  LearningEvents.create({exercise_id:"e1",attempt_number:2,correct:true,hint_used:true}),
  ...["e2","e3","e4"].map(id => LearningEvents.create({exercise_id:id,attempt_number:1,correct:true}))
];
const retrySummary = LearningEvents.summarize(retryEvents, ["e1","e2","e3","e4"]);
ok("wrong → retry → correct NO concede perfect-round", !has(A.evaluate({ session:{ total:4, allCorrect:retrySummary.perfect } }), "perfect-round"));
ok("no record si no supera", !has(A.evaluate({ streak: 5, prevBest: 5, session: {} }), "record-streak"));

// ---- duplicate achievements / reward granted once ----
ok("no re-otorga si ya se tenía", !has(A.evaluate({ lessons: 10, earned: ["first-flight", "ten-missions"], session: {} }), "ten-missions"));
(function () { const r = A.evaluate({ lessons: 50, session: {} }); ok("cada id aparece una sola vez", r.filter(x => x === "ten-missions").length === 1); })();

// ---- age availability ----
ok("weekend-planner solo en ESO", has(A.evaluate({ focusMissions: 5, band: "eso", session: {} }), "weekend-planner"));
ok("morning-explorer NO en ESO", !has(A.evaluate({ focusMissions: 5, band: "eso", session: {} }), "morning-explorer"));
ok("morning-explorer sí en p12", has(A.evaluate({ focusMissions: 5, band: "p12", session: {} }), "morning-explorer"));
ok("availableFor(eso) excluye morning", A.availableFor("eso").every(i => i.id !== "morning-explorer"));

// ---- progressOf ----
(function () { const p = A.progressOf("ten-missions", { lessons: 4 }); ok("progreso 4/10 = 40%", p.current === 4 && p.target === 10 && p.percent === 40 && p.done === false); })();
(function () { const p = A.progressOf("ten-missions", { lessons: 12 }); ok("progreso capado a 10 y done", p.current === 10 && p.done === true && p.percent === 100); })();
(function () { const p = A.progressOf("perfect-round", { earned: ["perfect-round"] }); ok("momentary conseguido = 100%", p.momentary === true && p.percent === 100); })();

// ---- migración (no perder logros existentes) ----
(function () {
  const m = A.migrateEarned(["primera", "diez_lecciones", "pleno", "streak_5", "word-collector", "streak_2"]);
  ok("migra medallas antiguas a nuevos ids", has(m, "first-flight") && has(m, "ten-missions") && has(m, "perfect-round") && has(m, "streak-5") && has(m, "word-collector"));
  ok("streak_2 sin equivalente se ignora", m.length === 5);
})();

// ---- next reward (world-data) tras conseguir un sello ----
ok("next reward existe con sello conseguido", !!WORLD.nextUnlock({ lessons: 1, streak: 0 }, "p12", ["first-flight"]));

// ---- streak protection (racha flexible con comodín) ----
const prot = M.nextStreak({ current: 4, last_practice_date: "2026-08-14", freezes_available: 1 }, "2026-08-16");
ok("comodín protege 1 día perdido", prot.current === 5 && prot.usedFreeze === true);

console.log(`\n${pass} OK · ${fail} fallidas`);
process.exit(fail ? 1 : 0);
