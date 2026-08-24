/* ============================================================
   Interlanguage HOME · estado diario de misión
   ------------------------------------------------------------
   Una única fuente local para que Inicio y Lección compartan:
   sesión del día, punto de reanudación, errores y tiempo activo.
   No sustituye ILAuth: el progreso semanal sigue siendo autoritativo.
   ============================================================ */
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory;
  else root.ILMission = factory(root.localStorage);
})(typeof globalThis !== "undefined" ? globalThis : this, function createMissionStore(storage) {
  "use strict";

  const VERSION = 2;
  const STATE_PREFIX = "il_mission_state_v1_";
  const HISTORY_PREFIX = "il_mission_history_v1_";
  const SESSION_PREFIX = "il_session_";
  const SERVED_PREFIX = "il_served_v1_";   // ejercicios ya servidos (rotación sin repetición)
  const EXAM_PREFIX = "il_exam_v1_";       // contador para el examen periódico
  const EXAM_EVERY = 5;                    // examen cada N misiones normales completadas
  const SERVED_CAP = 300;                  // memoria de rotación (ids)
  const CEFR_IDX = { "Pre-A1": 0, A1: 1, A2: 2, B1: 3 };

  function isoDay(value) {
    const d = value instanceof Date ? value : (value ? new Date(value) : new Date());
    return d.toISOString().slice(0, 10);
  }
  function userKey(username) { return encodeURIComponent(String(username || "guest").trim().toLowerCase()); }
  function stateKey(username) { return STATE_PREFIX + userKey(username); }
  function historyKey(username) { return HISTORY_PREFIX + userKey(username); }
  function sessionKey(username) { return SESSION_PREFIX + String(username || ""); }
  function read(key, fallback) {
    try { const value = JSON.parse(storage.getItem(key)); return value == null ? fallback : value; }
    catch (e) { return fallback; }
  }
  function write(key, value) {
    try { storage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }
  function uniq(values) { return Array.from(new Set((values || []).filter(Boolean))); }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, Number(value) || 0)); }

  function blank(meta) {
    meta = meta || {};
    const ids = uniq(meta.itemIds);
    return {
      version: VERSION,
      date: meta.date || isoDay(),
      unitId: meta.unitId || "",
      unitTitle: meta.unitTitle || "",
      itemIds: ids,
      currentIndex: 0,
      completedCount: 0,
      correctCount: 0,
      eventualSuccessCount: 0,
      technicalFailureCount: 0,
      hintUsedCount: 0,
      evaluableCount: 0,
      perfect: false,
      incorrectIds: [],
      currentCorrectStreak: 0,
      maxCorrectStreak: 0,
      points: 0,
      learnedExpressions: [],
      startedAt: null,
      activeStartedAt: null,
      elapsedMs: 0,
      status: "not_started",
      completedAt: null,
      completionRecorded: false,
      total: ids.length
    };
  }

  function get(username, date) {
    const state = read(stateKey(username), null);
    const target = date || isoDay();
    if (!state || state.date !== target) return null;
    if (state.version !== VERSION && state.version !== 1) return null;
    if (state.version === 1) {
      state.version = VERSION;
      state.eventualSuccessCount = Number(state.correctCount) || 0;
      state.technicalFailureCount = 0;
      state.hintUsedCount = 0;
      state.evaluableCount = Number(state.completedCount) || 0;
      state.perfect = state.status === "completed" && state.total > 0 && state.correctCount === state.total;
      write(stateKey(username), state);
    }
    return state;
  }

  function save(username, state) {
    if (!state) return null;
    state.version = VERSION;
    state.itemIds = uniq(state.itemIds);
    state.incorrectIds = uniq(state.incorrectIds);
    state.learnedExpressions = uniq(state.learnedExpressions);
    state.total = state.itemIds.length || Number(state.total) || 0;
    state.currentIndex = clamp(state.currentIndex, 0, state.total);
    state.completedCount = clamp(state.completedCount, 0, state.total);
    state.correctCount = clamp(state.correctCount, 0, state.total);
    state.eventualSuccessCount = clamp(state.eventualSuccessCount, 0, state.total);
    state.technicalFailureCount = Math.max(0, Number(state.technicalFailureCount) || 0);
    state.hintUsedCount = Math.max(0, Number(state.hintUsedCount) || 0);
    state.evaluableCount = clamp(state.evaluableCount, 0, state.total);
    state.perfect = !!state.perfect;
    write(stateKey(username), state);
    return state;
  }

  function ensure(username, meta) {
    meta = meta || {};
    const date = meta.date || isoDay();
    let state = get(username, date);
    const ids = uniq(meta.itemIds);
    const sessionChanged = state && ids.length && state.itemIds.join("|") !== ids.join("|");
    if (!state || (sessionChanged && state.completedCount === 0)) {
      state = blank({ ...meta, date: date, itemIds: ids });
    } else {
      if (meta.unitId) state.unitId = meta.unitId;
      if (meta.unitTitle) state.unitTitle = meta.unitTitle;
      if (ids.length && !state.itemIds.length) state.itemIds = ids;
    }
    return save(username, state);
  }

  function begin(username, meta, now) {
    const stamp = Number(now) || Date.now();
    const state = ensure(username, meta);
    if (state.status === "completed") return state;
    if (!state.startedAt) state.startedAt = new Date(stamp).toISOString();
    state.activeStartedAt = stamp;
    state.status = "in_progress";
    return save(username, state);
  }

  function pause(username, now, date) {
    const state = get(username, date);
    if (!state) return null;
    const stamp = Number(now) || Date.now();
    if (state.activeStartedAt) state.elapsedMs += Math.max(0, stamp - state.activeStartedAt);
    state.activeStartedAt = null;
    return save(username, state);
  }

  function elapsed(username, now, date) {
    const state = get(username, date);
    if (!state) return 0;
    const stamp = Number(now) || Date.now();
    return Math.max(0, state.elapsedMs + (state.activeStartedAt ? stamp - state.activeStartedAt : 0));
  }

  function advance(username, result, date) {
    result = result || {};
    const state = get(username, date || result.date);
    if (!state || state.status === "completed") return state;
    const itemId = result.id || state.itemIds[state.currentIndex];
    const technical = !!result.technical_failure;
    const eventual = result.eventual_success != null ? !!result.eventual_success : !!result.correct;
    const firstTry = result.first_try_correct != null ? !!result.first_try_correct : (!!result.correct && !result.hint_used && !technical);
    state.completedCount = clamp(state.completedCount + 1, 0, state.total);
    state.currentIndex = state.completedCount;
    if (technical) {
      state.technicalFailureCount += 1;
      state.currentCorrectStreak = 0;
    } else {
      state.evaluableCount = clamp(state.evaluableCount + 1, 0, state.total);
      if (result.hint_used) state.hintUsedCount += 1;
    }
    if (firstTry && !technical) {
      state.correctCount += 1;
      state.currentCorrectStreak += 1;
      state.maxCorrectStreak = Math.max(state.maxCorrectStreak, state.currentCorrectStreak);
      state.incorrectIds = state.incorrectIds.filter(id => id !== itemId);
      state.points += Number(result.points) || 10;
    } else if (!technical) {
      state.currentCorrectStreak = 0;
      if (itemId && state.incorrectIds.indexOf(itemId) === -1) state.incorrectIds.push(itemId);
    }
    if (eventual && !technical) state.eventualSuccessCount = clamp(state.eventualSuccessCount + 1, 0, state.total);
    state.learnedExpressions = eventual && !technical
      ? uniq(state.learnedExpressions.concat(result.learnedExpressions || [])).slice(0, 12)
      : state.learnedExpressions;
    return save(username, state);
  }

  function addHistory(username, state) {
    if (!state || !state.unitId) return;
    const key = historyKey(username);
    const history = read(key, []);
    const id = state.date + "|" + state.unitId;
    if (!history.some(entry => entry && entry.id === id)) {
      history.push({ id: id, date: state.date, unitId: state.unitId, completedAt: state.completedAt });
      write(key, history.slice(-180));
      if (state.unitId !== "examen") bumpExam(username); // el propio examen no cuenta para el siguiente
    }
  }

  function complete(username, now, date) {
    let state = pause(username, now, date) || get(username, date);
    if (!state) return null;
    state.status = "completed";
    state.currentIndex = state.total;
    state.completedCount = state.total;
    state.completedAt = state.completedAt || new Date(Number(now) || Date.now()).toISOString();
    state.perfect = state.total > 0 && state.technicalFailureCount === 0 && state.hintUsedCount === 0
      && state.evaluableCount === state.total && state.correctCount === state.total;
    state = save(username, state);
    addHistory(username, state);
    return state;
  }

  function markCompletionRecorded(username, date) {
    const state = get(username, date);
    if (!state) return null;
    state.completionRecorded = true;
    return save(username, state);
  }

  function history(username) { return read(historyKey(username), []).filter(Boolean); }
  function unitCompletionCount(username, unitId) {
    return history(username).filter(entry => entry.unitId === unitId).length;
  }
  function resolveErrors(username, ids, date) {
    const state = get(username, date);
    if (!state) return null;
    const resolved = new Set(ids || []);
    state.incorrectIds = state.incorrectIds.filter(id => !resolved.has(id));
    return save(username, state);
  }

  // --- Rotación sin repetición: registro de ejercicios ya servidos --------------
  // Lista ordenada (antiguo → reciente), deduplicada a la ÚLTIMA aparición. Al elegir
  // la sesión se prioriza lo NO servido y, cuando el pool se agota, lo servido hace más
  // tiempo → así el alumno recorre todo el banco antes de repetir.
  function servedKey(username) { return SERVED_PREFIX + userKey(username); }
  function served(username) { const v = read(servedKey(username), []); return Array.isArray(v) ? v : []; }
  function markServed(username, ids) {
    ids = (ids || []).filter(Boolean);
    if (!ids.length) return;
    const merged = served(username).concat(ids);
    const seen = new Set(); const out = [];
    for (let i = merged.length - 1; i >= 0; i--) { if (!seen.has(merged[i])) { seen.add(merged[i]); out.unshift(merged[i]); } }
    write(servedKey(username), out.slice(-SERVED_CAP));
  }

  // --- Examen periódico: cuenta misiones normales completadas desde el último ----
  function examKey(username) { return EXAM_PREFIX + userKey(username); }
  function examState(username) { const v = read(examKey(username), null); return (v && typeof v === "object") ? v : { sinceExam: 0 }; }
  function bumpExam(username) { const s = examState(username); s.sinceExam = (Number(s.sinceExam) || 0) + 1; write(examKey(username), s); }
  function examDue(username) { return (Number(examState(username).sinceExam) || 0) >= EXAM_EVERY; }
  function examProgress(username) { return { since: Number(examState(username).sinceExam) || 0, every: EXAM_EVERY, due: examDue(username) }; }
  function resetExam(username) { write(examKey(username), { sinceExam: 0 }); }

  function hashStr(value) {
    let h = 0; const s = String(value || "");
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  }
  function seededRand(n) {
    n = (n ^ 0x9E3779B9) >>> 0;
    n = Math.imul(n ^ (n >>> 15), 1 | n);
    n ^= n + Math.imul(n ^ (n >>> 7), 61 | n);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  }

  function getOrCreateSession(options) {
    options = options || {};
    const units = options.units || [];
    const allContent = units.flatMap(unit => unit.ejercicios || []);
    const selectedUnits = Array.isArray(options.unitIds) && options.unitIds.length
      ? units.filter(unit => options.unitIds.indexOf(unit.id) !== -1)
      : units;
    // Misión temática del día: si el perfil tiene varias unidades, se elige UNA de forma
    // determinista por día y usuario. Así cada día es una misión coherente (p. ej. rutina un
    // día, comida otro) y tanto inicio.html como leccion.html construyen la misma sesión.
    // Con una sola unidad no cambia nada.
    const dayUnits = selectedUnits.length > 1
      ? [selectedUnits[hashStr(String(options.username || "") + "|" + (options.date || isoDay())) % selectedUnits.length]]
      : selectedUnits;
    const all = dayUnits.flatMap(unit => unit.ejercicios || []);
    const byId = {}; allContent.forEach(ex => { byId[ex.id] = ex; });
    const date = options.date || isoDay();
    const context = [options.banda || "", options.limit || 6, (options.unitIds || []).join(","), (options.skillPriority || []).join(",")].join("|");
    const cached = read(sessionKey(options.username), null);
    const legacyState = cached && !cached.context ? get(options.username, date) : null;
    const compatible = cached && (cached.context === context || (!cached.context && legacyState && legacyState.status === "in_progress"));
    if (cached && cached.date === date && Array.isArray(cached.ids) && compatible) {
      const current = cached.ids.map(id => byId[id]).filter(Boolean);
      if (current.length) return current;
    }
    let pool = options.matrix && typeof options.matrix.filtra === "function"
      ? options.matrix.filtra(all, options.banda)
      : all.slice();
    const target = CEFR_IDX[options.cefr] != null ? CEFR_IDX[options.cefr] : 1;
    const skillPriority = Array.isArray(options.skillPriority) ? options.skillPriority : [];
    const seed = hashStr(String(options.username || "") + "|" + date);
    // Cobertura: -1 = aún no servido (máxima prioridad); si ya se sirvió, el índice en el
    // registro (más antiguo = menor) hace que vuelva antes lo que hace más tiempo que no cae.
    const servedList = served(options.username);
    const coverageOf = id => { const i = servedList.indexOf(id); return i === -1 ? -1 : i; };
    const scored = pool.map(ex => {
      const level = CEFR_IDX[ex.nivel] != null ? CEFR_IDX[ex.nivel] : 0;
      return {
        ex: ex,
        coverage: coverageOf(ex.id),
        score: level > target ? 100 + level - target : target - level,
        priority: skillPriority.indexOf(ex.habilidad) === -1 ? skillPriority.length : skillPriority.indexOf(ex.habilidad),
        random: seededRand(seed + hashStr(ex.id))
      };
    }).sort((a, b) => (a.coverage - b.coverage) || (a.score - b.score) || (a.priority - b.priority) || (a.random - b.random));
    const picked = []; let lastSkill = null; const rest = scored.slice();
    while (rest.length && picked.length < (options.limit || 6)) {
      let index = rest.findIndex(entry => entry.ex.habilidad !== lastSkill);
      if (index === -1) index = 0;
      const entry = rest.splice(index, 1)[0];
      picked.push(entry.ex); lastSkill = entry.ex.habilidad;
    }
    // Victoria temprana: abrir con un ejercicio de alta probabilidad de acierto
    // (elección simple con imagen/texto). Solo reordena la sesión ya elegida;
    // no cambia qué ejercicios entran, ni el nivel, ni el número.
    const GENTLE_FIRST = ["elegir_imagen", "elegir_texto"];
    if (picked.length > 1 && GENTLE_FIRST.indexOf(picked[0].tipo) === -1) {
      const gentleIndex = picked.findIndex(ex => GENTLE_FIRST.indexOf(ex.tipo) !== -1);
      if (gentleIndex > 0) picked.unshift(picked.splice(gentleIndex, 1)[0]);
    }
    const pickedIds = picked.map(ex => ex.id);
    write(sessionKey(options.username), { date: date, context: context, ids: pickedIds });
    markServed(options.username, pickedIds); // avanza la rotación (una vez por sesión nueva del día)
    return picked;
  }

  return {
    VERSION,
    today: isoDay,
    blank,
    get,
    ensure,
    begin,
    pause,
    elapsed,
    advance,
    complete,
    markCompletionRecorded,
    history,
    unitCompletionCount,
    resolveErrors,
    getOrCreateSession,
    served,
    examDue,
    examProgress,
    resetExam,
    EXAM_EVERY,
    _keys: { stateKey, historyKey, sessionKey, servedKey, examKey }
  };
});
