/* Tests del modelo pedagógico para CI (Node).
   Ejecuta:  node plataforma/motor/pedagogia.test.js
   Sale con código 1 si algo falla. Misma batería que test-pedagogia.html. */
const P = require("./pedagogia.js");

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; console.log("✅ " + name); }
  else { fail++; console.error("❌ " + name); }
}

// 1) new -> practicing
let m = P.applyAttempt(P.blank("o1"), { correct: true }, "2026-07-30");
ok("Primer intento sale de 'new'", m.state !== "new");

// 2) Dominado: 3 aciertos en 2 días distintos
let a = P.blank("o2");
a = P.applyAttempt(a, { correct: true }, "2026-07-30");
a = P.applyAttempt(a, { correct: true }, "2026-07-30");
ok("2 aciertos el mismo día NO es Dominado", a.state !== "mastered");
a = P.applyAttempt(a, { correct: true }, "2026-07-31");
ok("3 aciertos en 2 días distintos -> Dominado", a.state === "mastered");

// 3) Fallo desde Dominado -> Necesita repaso; repaso a +1
let b = P.applyAttempt(a, { correct: false }, "2026-08-05");
ok("Fallar en 'mastered' -> 'needs_review'", b.state === "needs_review");
ok("Al fallar, repaso vuelve a +1 día", b.next_review_at === "2026-08-06");

// 4) Nunca suspende
let c = P.applyAttempt(P.blank("o4"), { correct: false }, "2026-07-30");
ok("Un fallo no suspende (queda 'practicing')", c.state === "practicing");

// 5) Espaciado 1·3·7·16
let s = P.blank("o5");
s = P.applyAttempt(s, { correct: true }, "2026-07-30"); ok("Repaso 1º = +1", s.next_review_at === "2026-07-31");
s = P.applyAttempt(s, { correct: true }, "2026-07-30"); ok("Repaso 2º = +3", s.next_review_at === "2026-08-02");
s = P.applyAttempt(s, { correct: true }, "2026-07-30"); ok("Repaso 3º = +7", s.next_review_at === "2026-08-06");
s = P.applyAttempt(s, { correct: true }, "2026-07-30"); ok("Repaso 4º = +16", s.next_review_at === "2026-08-15");
s = P.applyAttempt(s, { correct: true }, "2026-07-30"); ok("Repaso tope +16", s.next_review_at === "2026-08-15");

// 6) Producir pesa más
let r1 = P.applyAttempt(P.blank("a"), { correct: true, production: false }, "2026-07-30");
let r2 = P.applyAttempt(P.blank("b"), { correct: true, production: true }, "2026-07-30");
ok("Producir suma más evidencia", r2.evidence > r1.evidence);

// 7) Composición de sesión
const objectives = [
  { id: "voc1", skill_id: "vocabulary", prerequisites: [] },
  { id: "gra1", skill_id: "grammar", prerequisites: [] },
  { id: "lis1", skill_id: "listening", prerequisites: [] },
  { id: "new1", skill_id: "reading", prerequisites: [] },
];
const mById = {
  voc1: Object.assign(P.blank("voc1"), { state: "needs_review", last_result: "incorrect", next_review_at: "2026-07-30" }),
  gra1: Object.assign(P.blank("gra1"), { state: "mastered", next_review_at: "2026-07-30" }),
  lis1: Object.assign(P.blank("lis1"), { state: "practicing", next_review_at: "2026-07-30" }),
  new1: P.blank("new1"),
};
const sess = P.composeSession(objectives, mById, "2026-07-30", { size: 6 });
ok("Incluye el error pendiente", sess.indexOf("voc1") !== -1);
ok("El error va primero", sess[0] === "voc1");
ok("Incluye 1 concepto nuevo", sess.indexOf("new1") !== -1);
ok("'mastered' que no vence no entra", (function () {
  const m2 = { gra1: Object.assign(P.blank("gra1"), { state: "mastered", next_review_at: "2026-12-01" }) };
  return P.composeSession([{ id: "gra1", skill_id: "grammar", prerequisites: [] }], m2, "2026-07-30", { size: 6 }).indexOf("gra1") === -1;
})());
ok("Nuevo con prereq sin cubrir NO entra",
  P.composeSession([{ id: "adv", skill_id: "grammar", prerequisites: ["base"] }], {}, "2026-07-30", { size: 6 }).indexOf("adv") === -1);

console.log(`\n${pass} OK · ${fail} fallidas`);
process.exit(fail ? 1 : 0);
