/* Smoke test de arranque (Node) · Interlanguage
   Comprueba que la BASE TÉCNICA está bien montada, sin abrir el navegador.
   Ejecuta:  node plataforma/smoke.test.js   (sale con código 1 si algo falla) */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log("✅ " + name); } else { fail++; console.error("❌ " + name); } };
const read = (rel) => { try { return fs.readFileSync(path.join(ROOT, rel), "utf8"); } catch { return null; } };
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));

// 1) Estructura de carpetas clave
["plataforma", "plataforma/motor", "supabase/migrations", "supabase/functions", ".github/workflows"]
  .forEach(d => ok("Existe carpeta " + d, exists(d)));

// 2) Ejemplos de entorno y que .env real NO está en git-ignore-able en claro
ok(".env.example presente", exists(".env.example"));
ok(".env.staging.example presente", exists(".env.staging.example"));
ok(".gitignore ignora .env", (read(".gitignore") || "").split("\n").some(l => l.trim() === ".env"));

// 3) Conexión a base de datos configurada (estructura, no valores)
const cfg = read("plataforma/supabase-config.js") || "";
ok("supabase-config define IL_SUPABASE", /IL_SUPABASE\s*=/.test(cfg));
ok("supabase-config tiene url y clave", /url\s*:/.test(cfg) && /(publishableKey|anonKey)\s*:/.test(cfg));

// 4) Migraciones presentes y con las tablas núcleo
const m1 = read("supabase/migrations/0001_init.sql") || "";
ok("Migración 0001 presente", m1.length > 0);
["users", "students", "activities", "answer_keys", "mastery"].forEach(t =>
  ok("0001 crea tabla public." + t, m1.includes("create table public." + t)));
ok("0001 activa RLS", /enable row level security/i.test(m1));

// 5) Cabeceras de seguridad base
const headers = read("_headers") || "";
["Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options"].forEach(h =>
  ok("_headers incluye " + h, headers.includes(h)));

// 6) Banco de contenido cargable estructuralmente
const cont = read("plataforma/contenido.js") || "";
ok("contenido.js define IL_CONTENIDO", /IL_CONTENIDO\s*=/.test(cont));

// 7) Módulo pedagógico exporta en Node
let ped = null;
try { ped = require("./motor/pedagogia.js"); } catch (e) {}
ok("pedagogia.js carga en Node", ped && typeof ped.applyAttempt === "function");

console.log(`\n${pass} OK · ${fail} fallidas`);
process.exit(fail ? 1 : 0);
