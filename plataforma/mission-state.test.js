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

const gentleUnits = [{ ejercicios: [
  { id: "hard", habilidad: "grammar", nivel: "A1", tipo: "completar" },
  { id: "gentle", habilidad: "vocabulary", nivel: "A1", tipo: "elegir_imagen" }
] }];
const gentle = M.getOrCreateSession({ username: "leo", date: "2026-08-11", units: gentleUnits, banda: "p56", cefr: "A1", limit: 2, skillPriority: ["grammar", "vocabulary"] });
assert.equal(gentle[0].id, "gentle", "la sesión empieza con una victoria temprana cuando está disponible");

const truthMeta = { date:"2026-08-12", unitId:"truth", unitTitle:"Truth", itemIds:["w", "t"] };
M.begin("truth", truthMeta, 1000);
let truth = M.advance("truth", { id:"w", correct:true, first_try_correct:false, eventual_success:true, hint_used:true }, truthMeta.date);
assert.equal(truth.correctCount, 0, "un acierto tras reintento no cuenta como first try");
assert.equal(truth.eventualSuccessCount, 1, "sí cuenta como éxito eventual");
assert.deepEqual(truth.incorrectIds, ["w"], "el ejercicio queda disponible para repaso");
truth = M.advance("truth", { id:"t", technical_failure:true, eventual_success:false }, truthMeta.date);
truth = M.complete("truth", 2000, truthMeta.date);
assert.equal(truth.technicalFailureCount, 1);
assert.equal(truth.perfect, false, "reintento o fallo técnico impiden sesión perfecta");

const legacyStorage = memoryStorage();
const legacyMission = createMissionStore(legacyStorage);
legacyStorage.setItem(legacyMission._keys.stateKey("legacy"), JSON.stringify({ version:1, date:"2026-08-13", unitId:"old", itemIds:["a"], currentIndex:1, completedCount:1, correctCount:1, incorrectIds:[], learnedExpressions:[], total:1, status:"completed" }));
const migrated = legacyMission.get("legacy", "2026-08-13");
assert.equal(migrated.version, 2);
assert.equal(migrated.eventualSuccessCount, 1, "el estado v1 se conserva al migrar");
assert.equal(migrated.perfect, true, "una sesión v1 ya completada conserva su resultado");

console.log("mission-state: compatibilidad v1, first try, eventual y fallo técnico correctos");
