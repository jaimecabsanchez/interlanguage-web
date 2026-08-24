/* Interlanguage HOME · lecturas canónicas de actividad y mastery. */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ILLearningData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const MIN_SKILL_SAMPLE = 5;
  function ymd(value) { return new Date(value).toISOString().slice(0, 10); }
  function failure(error, source) { return { status:"error", source, error:error && (error.message || error.code) || "data_unavailable" }; }

  async function activityDays(client, studentId, cutoff) {
    const source = "practice_sessions";
    const response = await client.from(source).select("date, started_at, finished_at")
      .eq("student_id", studentId).eq("completed", true).gte("date", cutoff).order("date", { ascending:true });
    if (response.error) return failure(response.error, source);
    const days = Array.from(new Set((response.data || []).map(row => row.date || (row.started_at && ymd(row.started_at))).filter(Boolean))).sort();
    return { status:days.length ? "available" : "empty", source, period:{ from:cutoff, to:ymd(new Date()) }, sample:days.length, days };
  }

  function projectSkills(rows, source) {
    const groups = {};
    (rows || []).forEach(row => {
      const skill = String(row.skill || (row.objectives && row.objectives.skill_id) || "").toLowerCase();
      if (!skill) return;
      const sample = Math.max(1, Number(row.attempt_count) || 1);
      const mastered = row.mastery_state === "mastered" ? sample : 0;
      if (!groups[skill]) groups[skill] = { key:skill, sample:0, mastered:0 };
      groups[skill].sample += sample; groups[skill].mastered += mastered;
    });
    const skills = Object.values(groups).map(item => ({
      key:item.key, sample:item.sample, sufficient:item.sample >= MIN_SKILL_SAMPLE,
      pct:item.sample >= MIN_SKILL_SAMPLE ? Math.round(100 * item.mastered / item.sample) : null
    }));
    return { status:skills.length ? "available" : "empty", source, sample:skills.reduce((sum, item) => sum + item.sample, 0), skills };
  }

  async function skillBreakdown(client, studentId) {
    const current = await client.from("exercise_mastery").select("skill, mastery_state, evidence_score, attempt_count").eq("student_id", studentId);
    if (!current.error) return projectSkills(current.data, "exercise_mastery");
    const legacy = await client.from("mastery").select("mastery_state, objectives(skill_id)").eq("student_id", studentId);
    if (legacy.error) return failure(legacy.error, "mastery");
    return projectSkills(legacy.data, "mastery");
  }

  return { MIN_SKILL_SAMPLE, activityDays, skillBreakdown, projectSkills };
});
