/* Tests unitarios de las utilidades de autenticación (Node/CI).
   Ejecuta:  node plataforma/auth-utils.test.js   (sale 1 si falla) */
const U = require("./auth-utils.js");

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log("✅ " + n); } else { fail++; console.error("❌ " + n); } };

// looksLikeEmail
ok("email de adulto se detecta", U.looksLikeEmail("jaime@correo.com") === true);
ok("código de alumno NO es email", U.looksLikeEmail("blue-fox-317") === false);

// usernameToEmail (mapea código -> email técnico, en minúsculas)
ok("código -> email técnico", U.usernameToEmail("Blue-Fox-317") === "blue-fox-317@" + U.DEFAULT_DOMAIN);
ok("usa dominio dado", U.usernameToEmail("x", "dom.test") === "x@dom.test");

// toLoginEmail (email directo, o código mapeado)
ok("email se respeta (minúsculas)", U.toLoginEmail("Admin@Correo.com") === "admin@correo.com");
ok("código se mapea a email", U.toLoginEmail("blue-fox-317") === "blue-fox-317@" + U.DEFAULT_DOMAIN);

// generatePassword: 8 chars, sin caracteres ambiguos (l, o, 0, 1)
const pw = U.generatePassword();
ok("contraseña de 8 caracteres", pw.length === 8);
ok("contraseña 5 letras + 3 dígitos", /^[a-z]{5}[0-9]{3}$/.test(pw));
ok("sin caracteres ambiguos (l/o/0/1)", !/[lo01]/.test(pw));
let allDistinct = true; for (let i = 0; i < 50; i++) { if (!/^[a-z]{5}[0-9]{3}$/.test(U.generatePassword())) allDistinct = false; }
ok("formato estable en 50 generaciones", allDistinct);

// generateUsername: adjetivo-animal-###
const un = U.generateUsername();
ok("código con forma palabra-palabra-###", /^[a-z]+-[a-z]+-[0-9]{3}$/.test(un));

// validatePassword
ok("rechaza contraseña corta", U.validatePassword("abc123").ok === false);
ok("acepta contraseña >= 8", U.validatePassword("practica2026").ok === true);
ok("mensaje de error presente", typeof U.validatePassword("x").error === "string");

console.log(`\n${pass} OK · ${fail} fallidas`);
process.exit(fail ? 1 : 0);
