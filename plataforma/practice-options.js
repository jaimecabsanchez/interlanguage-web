/* Interlanguage HOME · modelo puro del centro Practicar.
   Decide prioridad y variedad; no toca DOM, red ni almacenamiento. */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ILPracticeOptions = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SKILLS = Object.freeze(["listening", "vocabulary", "grammar", "reading", "writing", "speaking"]);
  const P12_ORDER = Object.freeze(["listening", "vocabulary", "speaking", "reading", "grammar", "writing"]);
  const P34_ORDER = Object.freeze(["listening", "vocabulary", "speaking", "reading"]);
  const CEFR_ORDER = Object.freeze(["Pre-A1", "A1", "A2", "B1", "B2", "C1", "C2"]);
  const COOLDOWN_MS = 36 * 60 * 60 * 1000;
  const EQUIVALENT_NEED_RANGE = 8;

  function count(value) { return Math.max(0, Number(value) || 0); }
  function safeBand(value) { return ["p12", "p34", "p56", "eso", "neutral"].indexOf(value) >= 0 ? value : "neutral"; }
  function recentBySkill(events) {
    const result = {};
    (events || []).forEach(event => {
      const skill = event && event.skill;
      if (SKILLS.indexOf(skill) === -1 || event.technical_failure) return;
      const stamp = Date.parse(event.submitted_at || event.started_at || "") || 0;
      result[skill] = Math.max(result[skill] || 0, stamp);
    });
    return result;
  }
  function normalizeSkills(input) {
    const values = Array.isArray(input) ? input : Object.keys(input || {}).map(id => ({ id, count:input[id] }));
    return values.map(item => typeof item === "string" ? ({ id:item, count:1 }) : item).filter(item => item && SKILLS.indexOf(item.id) >= 0 && count(item.count) > 0).map(item => ({
      id:item.id,
      count:count(item.count),
      need:Number.isFinite(Number(item.need)) ? Number(item.need) : 0,
      evidence:count(item.evidence),
      sufficient:item.sufficient !== false
    }));
  }
  function visibleSkills(band, available) {
    const safe = safeBand(band); const list = normalizeSkills(available);
    if (safe === "p12") return P12_ORDER.map(id => list.find(item => item.id === id)).filter(Boolean).slice(0, 3);
    if (safe === "p34") return P34_ORDER.map(id => list.find(item => item.id === id)).filter(Boolean);
    return list;
  }
  function variedSkill(available, recentEvents, options) {
    const list = normalizeSkills(available); if (!list.length) return null;
    const recent = recentBySkill(recentEvents);
    const now = Number(options && options.now) || Date.now();
    const strongestNeed = Math.max.apply(null, list.map(item => item.need));
    const equivalent = list.filter(item => strongestNeed - item.need <= EQUIVALENT_NEED_RANGE);
    const cooled = equivalent.filter(item => !recent[item.id] || now - recent[item.id] >= COOLDOWN_MS);
    const pool = cooled.length ? cooled : equivalent;
    const selected = pool.slice().sort((a, b) => {
      if (b.need !== a.need) return b.need - a.need;
      return (recent[a.id] || 0) - (recent[b.id] || 0) || SKILLS.indexOf(a.id) - SKILLS.indexOf(b.id);
    })[0];
    return Object.freeze(Object.assign({}, selected, {
      recentlyPracticed:!!(recent[selected.id] && now - recent[selected.id] < COOLDOWN_MS),
      lastPracticedAt:recent[selected.id] || 0
    }));
  }
  function hasSkill(available, id) { return normalizeSkills(available).some(item => item.id === id); }

  function selectExercises(input) {
    input = input || {};
    const target = CEFR_ORDER.indexOf(input.cefr);
    const recent = {};
    (input.recentEvents || []).forEach(event => {
      if (!event || event.technical_failure || !event.exercise_id) return;
      const stamp = Date.parse(event.submitted_at || event.started_at || "") || 0;
      recent[event.exercise_id] = Math.max(recent[event.exercise_id] || 0, stamp);
    });
    return (input.exercises || []).filter(Boolean).slice().sort((a, b) => {
      const aLevel = CEFR_ORDER.indexOf(a.nivel);
      const bLevel = CEFR_ORDER.indexOf(b.nivel);
      const aDistance = target < 0 || aLevel < 0 ? 0 : Math.abs(aLevel - target);
      const bDistance = target < 0 || bLevel < 0 ? 0 : Math.abs(bLevel - target);
      if (aDistance !== bDistance) return aDistance - bDistance; // nivel antes que cooldown
      return (recent[a.id] || 0) - (recent[b.id] || 0) || String(a.id || "").localeCompare(String(b.id || ""));
    }).slice(0, Math.max(1, Number(input.limit) || 6));
  }

  function build(input) {
    input = input || {};
    const band = safeBand(input.band);
    const allSkills = normalizeSkills(input.availableSkills);
    const evidencedSkills = allSkills.filter(item => item.sufficient && item.evidence > 0);
    const recommendationSkills = evidencedSkills.length ? evidencedSkills : allSkills;
    const skills = visibleSkills(band, allSkills);
    const dailyStatus = String(input.dailyStatus || "not_started");
    const dailyAvailable = input.dailyAvailable !== false;
    const dailyPending = dailyAvailable && dailyStatus !== "completed";
    const dueCount = count(input.dueCount);
    const errorCount = count(input.errorCount);
    const hasExtra = input.hasExtra !== false && allSkills.length > 0;
    let recommended;

    if (dailyPending) {
      recommended = { kind:"daily", reason:"daily_pending", href:"leccion.html", skill:null, count:0 };
    } else if (dueCount > 0) {
      recommended = { kind:"due", reason:"review_due", href:"leccion.html?mode=review", skill:null, count:dueCount };
    } else {
      const choice = variedSkill(recommendationSkills, input.recentEvents, { now:input.now });
      recommended = choice
        ? { kind:"skill", reason:choice.id === input.reinforceSkill ? "reinforce" : "variety", href:"leccion.html?mode=skill&skill=" + encodeURIComponent(choice.id), skill:choice.id, count:0, recentlyPracticed:choice.recentlyPracticed }
        : (hasExtra ? { kind:"extra", reason:"practice_extra", href:"leccion.html?mode=bonus", skill:null, count:0 } : null);
    }

    const review = errorCount > 0
      ? { available:true, count:errorCount, href:"leccion.html?mode=errors" }
      : { available:false, count:0, href:"" };
    const hasAnyPractice = !!recommended || review.available || skills.length > 0 || hasExtra;
    return Object.freeze({ band, dailyPending, recommended, review:Object.freeze(review), skills:Object.freeze(skills), hasAnyPractice });
  }

  return Object.freeze({ SKILLS, P12_ORDER, P34_ORDER, CEFR_ORDER, COOLDOWN_MS, EQUIVALENT_NEED_RANGE, safeBand, recentBySkill, normalizeSkills, visibleSkills, variedSkill, selectExercises, build });
});
