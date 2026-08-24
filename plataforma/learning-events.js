/* ============================================================
   Interlanguage HOME · eventos de aprendizaje y proyecciones
   Cada envío es inmutable. Rewards/progreso consumen resúmenes.
   Navegador: IL_LearningEvents · Node: module.exports
   ============================================================ */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.IL_LearningEvents = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MODES = ["daily", "review", "extra", "placement"];
  function iso(value) { const d = value ? new Date(value) : new Date(); return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString(); }
  function uuid() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    const bytes = new Uint8Array(16);
    if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
    else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    bytes[6] = (bytes[6] & 15) | 64; bytes[8] = (bytes[8] & 63) | 128;
    const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
    return hex.slice(0,8) + "-" + hex.slice(8,12) + "-" + hex.slice(12,16) + "-" + hex.slice(16,20) + "-" + hex.slice(20);
  }
  function value(value, fallback) { return value === undefined || value === null ? fallback : value; }

  function create(input) {
    input = input || {};
    const technical = !!input.technical_failure;
    const submitted = iso(input.submitted_at);
    const started = iso(input.started_at || submitted);
    const duration = Number.isFinite(Number(input.response_time_ms))
      ? Math.max(0, Math.round(Number(input.response_time_ms)))
      : Math.max(0, new Date(submitted).getTime() - new Date(started).getTime());
    return Object.freeze({
      attempt_id: String(input.attempt_id || uuid()),
      student_id: input.student_id || null,
      session_id: input.session_id || null,
      client_session_key: String(input.client_session_key || ""),
      exercise_id: String(input.exercise_id || input.id || ""),
      objective_id: String(input.objective_id || ""),
      variant_id: String(input.variant_id || ""),
      age_band: String(input.age_band || "p56"),
      cefr: String(input.cefr || ""),
      skill: String(input.skill || ""),
      content_version: String(input.content_version || "1"),
      attempt_number: Math.max(0, Math.round(Number(input.attempt_number || input.attempt_no) || 0)),
      answer: value(input.answer, null),
      correct: technical ? null : !!input.correct,
      hint_used: technical ? false : !!input.hint_used,
      audio_replays: Math.max(0, Math.round(Number(input.audio_replays) || 0)),
      started_at: started,
      submitted_at: submitted,
      response_time_ms: duration,
      mode: MODES.indexOf(input.mode) === -1 ? "daily" : input.mode,
      technical_failure: technical,
      failure_type: technical ? String(input.failure_type || "unknown") : ""
    });
  }

  function forExercise(events, exerciseId) {
    const all = (events || []).filter(event => event && event.exercise_id === exerciseId);
    const attempts = all.filter(event => !event.technical_failure && event.attempt_number > 0)
      .slice().sort((a, b) => a.attempt_number - b.attempt_number || String(a.submitted_at).localeCompare(String(b.submitted_at)));
    const technicalFailures = all.filter(event => event.technical_failure);
    const first = attempts[0] || null;
    const eventual = attempts.some(event => event.correct === true);
    return {
      exercise_id: exerciseId,
      attempt_count: attempts.length,
      first_try_correct: !!(first && first.correct === true && !first.hint_used),
      eventual_success: eventual,
      hint_used: attempts.some(event => event.hint_used),
      technical_failure: technicalFailures.length > 0,
      technical_failure_count: technicalFailures.length
    };
  }

  function summarize(events, exerciseIds) {
    const ids = Array.from(new Set((exerciseIds || []).filter(Boolean)));
    const outcomes = ids.map(id => forExercise(events, id));
    const firstTryCorrectCount = outcomes.filter(item => item.first_try_correct).length;
    const eventualSuccessCount = outcomes.filter(item => item.eventual_success).length;
    const technicalFailureCount = outcomes.reduce((sum, item) => sum + item.technical_failure_count, 0);
    const hintUsedCount = outcomes.filter(item => item.hint_used).length;
    const evaluableCount = outcomes.filter(item => item.attempt_count > 0).length;
    const perfect = ids.length > 0 && technicalFailureCount === 0 && hintUsedCount === 0
      && evaluableCount === ids.length && firstTryCorrectCount === ids.length;
    return {
      planned_count: ids.length,
      evaluable_count: evaluableCount,
      first_try_correct_count: firstTryCorrectCount,
      eventual_success_count: eventualSuccessCount,
      technical_failure_count: technicalFailureCount,
      hint_used_count: hintUsedCount,
      perfect,
      outcomes,
      incorrect_ids: outcomes.filter(item => !item.first_try_correct && !item.technical_failure).map(item => item.exercise_id)
    };
  }

  function outcome(events, exerciseId) { return forExercise(events, exerciseId); }
  return { MODES, create, outcome, summarize };
});
