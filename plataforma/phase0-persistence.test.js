const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const migration = fs.readFileSync(path.join(__dirname, "../supabase/migrations/0007_learning_truth_phase0.sql"), "utf8");
const auth = fs.readFileSync(path.join(__dirname, "auth.js"), "utf8");

assert.match(migration, /alter table public\.attempts[\s\S]*technical_failure/);
assert.match(migration, /create table if not exists public\.student_placements/);
assert.match(migration, /instrument_version text not null/);
assert.match(migration, /create table if not exists public\.exercise_mastery/);
assert.match(migration, /primary key \(student_id, exercise_key\)/);
assert.doesNotMatch(migration, /drop\s+(table|column)/i, "la migración no borra tablas ni columnas");
assert.match(auth, /from\("student_placements"\)\.insert\(row\)/, "placement se persiste en servidor");
assert.match(auth, /migrated_from:"localStorage"/, "placement legacy tiene migración compatible");
assert.match(auth, /from\("exercise_mastery"\)\.upsert/, "mastery se proyecta al servidor");
assert.match(auth, /il_learning_outbox_v1/, "los fallos de red conservan una outbox local");
assert.match(auth, /flushLearningOutbox/, "la outbox se reintenta al recuperar conexión");
assert.match(auth, /client_session_key/, "las sesiones se pueden reconciliar por una clave cliente estable");
assert.match(auth, /session_finish[\s\S]*client_session_key/, "una sesión iniciada sin conexión conserva su cierre pendiente");
console.log("phase0 persistence: migración aditiva, placement, mastery y outbox comprobados");
