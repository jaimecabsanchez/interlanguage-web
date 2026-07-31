/* Tests de la puerta de la matriz (Node/CI).
   node plataforma/motor/matriz.test.js */
const M = require("./matriz.js");
let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log("✅ " + n); } else { fail++; console.error("❌ " + n); } };

const img_preA1_3 = { tipo: "elegir_imagen", nivel: "Pre-A1", opciones: [{}, {}, {}] };
const img_A1_4 = { tipo: "elegir_imagen", nivel: "A1", opciones: [{}, {}, {}, {}] };
const completar_A1 = { tipo: "completar", nivel: "A1", opciones: [{}, {}, {}] };
const comprension_A2 = { tipo: "comprension", nivel: "A2" };
const ordenar_A1 = { tipo: "ordenar", nivel: "A1" };

// p12: solo P1/P3, Pre-A1, ≤3 opciones
ok("p12 acepta imagen Pre-A1 (3 opc)", M.esApta(img_preA1_3, "p12"));
ok("p12 RECHAZA imagen A1 (4 opc: nivel y opciones)", !M.esApta(img_A1_4, "p12"));
ok("p12 RECHAZA completar (plantilla P6 no permitida)", !M.esApta(completar_A1, "p12"));
ok("p12 RECHAZA comprensión (P7)", !M.esApta(comprension_A2, "p12"));

// p34: añade P5; A1 permitido; máx 4
ok("p34 acepta ordenar A1 (P5)", M.esApta(ordenar_A1, "p34"));
ok("p34 acepta imagen A1 (4 opc)", M.esApta(img_A1_4, "p34"));
ok("p34 RECHAZA completar (P6 aún no)", !M.esApta(completar_A1, "p34"));

// p56: añade P6; A2 permitido
ok("p56 acepta completar A1 (P6)", M.esApta(completar_A1, "p56"));
ok("p56 RECHAZA comprensión (P7 solo ESO)", !M.esApta(comprension_A2, "p56"));

// eso: añade P7 y B1
ok("eso acepta comprensión A2 (P7)", M.esApta(comprension_A2, "eso"));
ok("eso RECHAZA Pre-A1 (fuera de rango)", !M.esApta(img_preA1_3, "eso"));

// filtra
const lista = [img_preA1_3, img_A1_4, completar_A1, comprension_A2, ordenar_A1];
ok("filtra p12 deja solo lo apto", M.filtra(lista, "p12").length === 1);
ok("filtra eso deja los de su rango", M.filtra(lista, "eso").length === 4);

console.log(`\n${pass} OK · ${fail} fallidas`);
process.exit(fail ? 1 : 0);
