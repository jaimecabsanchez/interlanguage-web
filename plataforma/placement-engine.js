/* Interlanguage HOME · motor puro de colocación adaptativa. */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ILPlacementEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const LEVELS = Object.freeze(["Pre-A1", "A1", "A2", "B1"]);
  const LIMITS = Object.freeze({ p12:[5,7], p34:[6,8], p56:[7,9], eso:[7,9], neutral:[6,8] });

  function safeBand(value) { return Object.prototype.hasOwnProperty.call(LIMITS, value) ? value : "neutral"; }
  function normalizeSeed(value) { return LEVELS.indexOf(value) >= 0 ? value : "A1"; }
  function clone(state) { return JSON.parse(JSON.stringify(state)); }
  function create(input) {
    input = input || {}; const band = safeBand(input.band); const seed = normalizeSeed(input.seedCefr);
    return Object.freeze({ band, seedCefr:seed, candidate:seed, served:[], responses:[], evaluableCount:0, technicalCount:0,
      highestValidated:null, lowestRejected:null, status:"active", result:null, confidence:null, coverageLimited:false, stopReason:"" });
  }
  function available(state, items) {
    const served = new Set(state.served); const band = safeBand(state.band);
    return (items || []).filter(item => item && item.bands && item.bands.indexOf(band) >= 0 && LEVELS.indexOf(item.cefr_probe) >= 0 && !served.has(item.id));
  }
  function recentValue(state, key) {
    for (let index = state.responses.length - 1; index >= 0; index--) if (state.responses[index][key]) return state.responses[index][key];
    return "";
  }
  function select(state, items) {
    if (!state || state.status !== "active") return null;
    const pool = available(state, items); if (!pool.length) return null;
    const target = LEVELS.indexOf(state.candidate); const lastSkill = recentValue(state, "skill"); const lastType = recentValue(state, "interaction_type");
    return pool.slice().sort((a, b) => {
      const levelDistance = Math.abs(LEVELS.indexOf(a.cefr_probe) - target) - Math.abs(LEVELS.indexOf(b.cefr_probe) - target);
      if (levelDistance) return levelDistance;
      const aRepeat = Number(a.skill === lastSkill) + Number(a.interaction_type === lastType);
      const bRepeat = Number(b.skill === lastSkill) + Number(b.interaction_type === lastType);
      return aRepeat - bRepeat || String(a.id).localeCompare(String(b.id));
    })[0];
  }
  function boundary(state) {
    if (state.lowestRejected === "Pre-A1") return true;
    if (state.highestValidated === "B1") return true;
    if (!state.highestValidated || !state.lowestRejected) return false;
    return LEVELS.indexOf(state.lowestRejected) === LEVELS.indexOf(state.highestValidated) + 1;
  }
  function resultLevel(state) {
    if (state.highestValidated) return state.highestValidated;
    if (state.lowestRejected) return LEVELS[Math.max(0, LEVELS.indexOf(state.lowestRejected) - 1)];
    return normalizeSeed(state.candidate);
  }
  function finish(state, reason, limited) {
    state.status = "complete"; state.result = resultLevel(state); state.stopReason = reason;
    state.coverageLimited = !!limited;
    state.confidence = limited || state.technicalCount > 1 ? "low" : (boundary(state) && state.responses.some(value => value.tieBreak) ? "medium" : (boundary(state) ? "high" : "medium"));
    return Object.freeze(state);
  }
  function scoredFor(state, level) { return state.responses.filter(value => value.evaluable && value.cefr_probe === level); }
  function submit(current, item, response) {
    if (!current || current.status !== "active" || !item || current.served.indexOf(item.id) >= 0) return current;
    const state = clone(current); const answer = response || {}; state.served.push(item.id);
    if (answer.technicalFailure) {
      state.technicalCount += 1; state.responses.push({ item_id:item.id, cefr_probe:item.cefr_probe, skill:item.skill, interaction_type:item.interaction_type, evaluable:false, technicalFailure:true });
      return Object.freeze(state);
    }
    const correct = answer.kind === "unknown" ? false : Number(answer.choice) === Number(item.correct_index);
    state.evaluableCount += 1;
    const previousAtLevel = scoredFor(state, item.cefr_probe);
    state.responses.push({ item_id:item.id, cefr_probe:item.cefr_probe, skill:item.skill, interaction_type:item.interaction_type, evaluable:true, kind:answer.kind === "unknown" ? "unknown" : "answer", correct, tieBreak:previousAtLevel.length === 2 && previousAtLevel.filter(value => value.correct).length === 1 });
    const atLevel = scoredFor(state, item.cefr_probe); const lastThree = atLevel.slice(-3); let decision = null;
    if (lastThree.length >= 2 && lastThree.slice(0,2).every(value => value.correct)) decision = "up";
    else if (lastThree.length >= 2 && lastThree.slice(0,2).every(value => !value.correct)) decision = "down";
    else if (lastThree.length === 3) decision = lastThree.filter(value => value.correct).length >= 2 ? "up" : "down";
    if (decision === "up") {
      if (!state.highestValidated || LEVELS.indexOf(item.cefr_probe) > LEVELS.indexOf(state.highestValidated)) state.highestValidated = item.cefr_probe;
      state.candidate = LEVELS[Math.min(LEVELS.length - 1, LEVELS.indexOf(item.cefr_probe) + 1)];
    } else if (decision === "down") {
      if (!state.lowestRejected || LEVELS.indexOf(item.cefr_probe) < LEVELS.indexOf(state.lowestRejected)) state.lowestRejected = item.cefr_probe;
      state.candidate = LEVELS[Math.max(0, LEVELS.indexOf(item.cefr_probe) - 1)];
    }
    const limits = LIMITS[state.band];
    if (state.evaluableCount >= limits[1]) return finish(state, "max_questions", !boundary(state));
    if (state.evaluableCount >= limits[0] && boundary(state)) return finish(state, "boundary_validated", false);
    return Object.freeze(state);
  }
  function noContent(current) {
    if (!current || current.status !== "active") return current;
    return finish(clone(current), "coverage_exhausted", true);
  }
  function progress(state) { const limits = LIMITS[safeBand(state && state.band)]; return Object.freeze({ current:Math.min(state.evaluableCount, limits[1]), min:limits[0], max:limits[1] }); }

  return Object.freeze({ LEVELS, LIMITS, safeBand, normalizeSeed, create, select, submit, noContent, progress, boundary });
});
