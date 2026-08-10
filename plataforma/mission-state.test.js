const assert = require("assert");
const createMissionStore = require("./mission-state.js");

function memoryStorage() {
  const data = new Map();
  return {
    getItem: key => data.has(key) ? data.get(key) : null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: key => data.delete(key)
  };
}

const storage = memoryStorage();
const M = createMissionStore(storage);
const meta = { date: "2026-08-09", unitId: "rutina", unitTitle: "My daily routine", itemIds: ["a", "b", "c"] };

let state = M.ensure("lucia", meta);
assert.equal(state.status, "not_started");
assert.equal(state.total, 3);

const alternate = { date: meta.date, unitId: "planes", unitTitle: "Plans", itemIds: ["p1", "p2"] };
state = M.ensure("lucia", alternate);
assert.equal(state.unitId, "planes", "una sesión vacía cambia con el selector de etapa demo");
state = M.ensure("lucia", meta);

state = M.begin("lucia", meta, 1000);
assert.equal(state.status, "in_progress");
state = M.advance("lucia", { id: "a", correct: true, learnedExpressions: ["Have breakfast"] }, meta.date);
assert.equal(state.currentIndex, 1);
assert.equal(state.correctCount, 1);
assert.equal(state.points, 10);

state = M.advance("lucia", { id: "b", correct: false }, meta.date);
assert.deepEqual(state.incorrectIds, ["b"]);
assert.equal(state.currentCorrectStreak, 0);

state = M.pause("lucia", 6000, meta.date);
assert.equal(state.elapsedMs, 5000);
state = M.begin("lucia", meta, 9000);
assert.equal(state.currentIndex, 2, "reanuda en el siguiente ejercicio");

state = M.advance("lucia", { id: "c", correct: true, learnedExpressions: ["Go to school"] }, meta.date);
state = M.complete("lucia", 11000, meta.date);
assert.equal(state.status, "completed");
assert.equal(M.unitCompletionCount("lucia", "rutina"), 1);
M.complete("lucia", 12000, meta.date);
assert.equal(M.unitCompletionCount("lucia", "rutina"), 1, "histórico deduplicado");

state = M.resolveErrors("lucia", ["b"], meta.date);
assert.deepEqual(state.incorrectIds, []);
M.markCompletionRecorded("lucia", meta.date);
assert.equal(M.get("lucia", "2026-08-09").completionRecorded, true);

const units = [{ ejercicios: [
  { id: "x", habilidad: "vocabulary", nivel: "A1" },
  { id: "y", habilidad: "grammar", nivel: "A1" },
  { id: "z", habilidad: "vocabulary", nivel: "A1" }
] }];
const first = M.getOrCreateSession({ username: "ana", date: "2026-08-09", units, banda: "p56", cefr: "A1", limit: 2 });
const second = M.getOrCreateSession({ username: "ana", date: "2026-08-09", units, banda: "p56", cefr: "A1", limit: 2 });
assert.deepEqual(first.map(x => x.id), second.map(x => x.id), "sesión diaria estable");
assert.equal(new Set(first.map(x => x.habilidad)).size, 2, "intercala habilidades");

const scopedUnits = [
  { id: "young", ejercicios: [{ id: "y1", habilidad: "vocabulary", nivel: "A1" }, { id: "y2", habilidad: "listening", nivel: "A1" }] },
  { id: "teen", ejercicios: [{ id: "t1", habilidad: "reading", nivel: "A1" }, { id: "t2", habilidad: "grammar", nivel: "A1" }] }
];
const scoped = M.getOrCreateSession({ username: "marta", date: "2026-08-10", units: scopedUnits, banda: "p56", cefr: "A1", limit: 2, unitIds: ["teen"], skillPriority: ["grammar", "reading"] });
assert.deepEqual(new Set(scoped.map(item => item.id)), new Set(["t1", "t2"]), "la sesión respeta la unidad del perfil");
assert.equal(scoped[0].habilidad, "grammar", "la prioridad resuelve candidatos equivalentes");

console.log("mission-state: 18 comprobaciones correctas");
