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

  const VERSION = 1;
  const STATE_PREFIX = "il_mission_state_v1_";
  const HISTORY_PREFIX = "il_mission_history_v1_";
  const SESSION_PREFIX = "il_session_";
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
    if (!state || state.version !== VERSION || state.date !== target) return null;
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
    const correct = !!result.correct;
    state.completedCount = clamp(state.completedCount + 1, 0, state.total);
    state.currentIndex = state.completedCount;
    if (correct) {
      state.correctCount += 1;
      state.currentCorrectStreak += 1;
      state.maxCorrectStreak = Math.max(state.maxCorrectStreak, state.currentCorrectStreak);
      state.incorrectIds = state.incorrectIds.filter(id => id !== itemId);
      state.points += Number(result.points) || 10;
    } else {
      state.currentCorrectStreak = 0;
      if (itemId && state.incorrectIds.indexOf(itemId) === -1) state.incorrectIds.push(itemId);
    }
    state.learnedExpressions = uniq(state.learnedExpressions.concat(result.learnedExpressions || [])).slice(0, 12);
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
    }
  }

  function complete(username, now, date) {
    let state = pause(username, now, date) || get(username, date);
    if (!state) return null;
    state.status = "completed";
    state.currentIndex = state.total;
    state.completedCount = state.total;
    state.completedAt = state.completedAt || new Date(Number(now) || Date.now()).toISOString();
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
    const all = selectedUnits.flatMap(unit => unit.ejercicios || []);
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
    const previous = cached && Array.isArray(cached.ids) ? cached.ids : [];
    const target = CEFR_IDX[options.cefr] != null ? CEFR_IDX[options.cefr] : 1;
    const skillPriority = Array.isArray(options.skillPriority) ? options.skillPriority : [];
    const seed = hashStr(String(options.username || "") + "|" + date);
    const scored = pool.map(ex => {
      const level = CEFR_IDX[ex.nivel] != null ? CEFR_IDX[ex.nivel] : 0;
      return {
        ex: ex,
        score: level > target ? 100 + level - target : target - level,
        recent: previous.indexOf(ex.id) !== -1 ? 1 : 0,
        priority: skillPriority.indexOf(ex.habilidad) === -1 ? skillPriority.length : skillPriority.indexOf(ex.habilidad),
        random: seededRand(seed + hashStr(ex.id))
      };
    }).sort((a, b) => (a.score - b.score) || (a.recent - b.recent) || (a.priority - b.priority) || (a.random - b.random));
    const picked = []; let lastSkill = null; const rest = scored.slice();
    while (rest.length && picked.length < (options.limit || 6)) {
      let index = rest.findIndex(entry => entry.ex.habilidad !== lastSkill);
      if (index === -1) index = 0;
      const entry = rest.splice(index, 1)[0];
      picked.push(entry.ex); lastSkill = entry.ex.habilidad;
    }
    write(sessionKey(options.username), { date: date, context: context, ids: picked.map(ex => ex.id) });
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
    _keys: { stateKey, historyKey, sessionKey }
  };
});
