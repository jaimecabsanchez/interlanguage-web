/* Tests del sistema de motivación (Node/CI).
   node plataforma/motor/motivacion.test.js  (sale 1 si falla) */
const M = require("./motivacion.js");

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log("✅ " + n); } else { fail++; console.error("❌ " + n); } };
const has = (arr, id) => arr.indexOf(id) !== -1;

// El adaptador evalúa siempre ids del catálogo canónico.
ok("racha 5 da 'streak-5'", has(M.evaluate({ streak: 5, session: {} }), "streak-5"));
ok("racha 1 NO da logro de racha", !has(M.evaluate({ streak: 1, session: {} }), "streak-5"));
ok("no se re-otorga si ya se tenía con id legacy", !has(M.evaluate({ streak: 5, earned: ["streak_5"], session: {} }), "streak-5"));

// Aciertos seguidos y sesión perfecta
ok("5 aciertos seguidos -> 'sharp-5'", has(M.evaluate({ session: { total: 5, allCorrect: true, maxCorrectStreak: 5 } }), "sharp-5"));
ok("sesión perfecta -> 'perfect-round'", has(M.evaluate({ session: { total: 5, allCorrect: true, maxCorrectStreak: 5 } }), "perfect-round"));
ok("no perfecta si falla alguno", !has(M.evaluate({ session: { total: 5, allCorrect: false, maxCorrectStreak: 3 } }), "perfect-round"));

// Mejora: récord de racha
ok("record si supera su mejor marca", has(M.evaluate({ streak: 6, prevBest: 5, session: {} }), "record-streak"));
ok("no record si no supera", !has(M.evaluate({ streak: 5, prevBest: 5, session: {} }), "record-streak"));

// Dominio por lecciones
ok("primera lección", has(M.evaluate({ lessons: 1, session: {} }), "first-flight"));
ok("10 lecciones", has(M.evaluate({ lessons: 10, session: {} }), "ten-missions"));
ok("convierte ids canónicos a persistencia legacy", JSON.stringify(M.toLegacyIds(["first-flight", "perfect-round"])) === JSON.stringify(["primera", "pleno"]));
ok("el catálogo adaptado no contiene emojis", M.MEDALS.every(item => !item.icon));

// Racha flexible con comodín
ok("practicar ayer -> +1", M.nextStreak({ current: 3, last_practice_date: "2026-07-29", freezes_available: 1 }, "2026-07-30").current === 4);
ok("mismo día no cambia", M.nextStreak({ current: 3, last_practice_date: "2026-07-30", freezes_available: 1 }, "2026-07-30").current === 3);
const gap = M.nextStreak({ current: 3, last_practice_date: "2026-07-28", freezes_available: 1 }, "2026-07-30");
ok("1 día perdido con comodín NO rompe la racha", gap.current === 4 && gap.usedFreeze === true && gap.freezes_available === 0);
const gapNoFreeze = M.nextStreak({ current: 3, last_practice_date: "2026-07-28", freezes_available: 0 }, "2026-07-30");
ok("1 día perdido sin comodín -> racha a 1", gapNoFreeze.current === 1);
ok("varios días perdidos -> racha a 1", M.nextStreak({ current: 8, last_practice_date: "2026-07-20", freezes_available: 1 }, "2026-07-30").current === 1);

console.log(`\n${pass} OK · ${fail} fallidas`);
process.exit(fail ? 1 : 0);
