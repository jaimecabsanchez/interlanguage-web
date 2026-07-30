/* ============================================================
   Interlanguage · MODELO PEDAGÓGICO (Bloques 9–11)
   ------------------------------------------------------------
   Lógica PURA (sin DOM ni red), fácil de probar:
   - Estados de dominio: new · practicing · almost · mastered · needs_review
   - Evidencia acumulada y espaciada (producir pesa más que reconocer)
   - Repaso espaciado 1·3·7·16 días
   - Composición de la sesión diaria por reglas explicables
   Base: docs/superpowers/specs/2026-07-29-arquitectura-pedagogica.md

   Funciona en navegador (window.IL_PEDAGOGIA) y en Node (module.exports).
   ============================================================ */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.IL_PEDAGOGIA = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const INTERVALS = [1, 3, 7, 16];   // días; se alejan al acertar, vuelven a 1 al fallar
  const STATES = ["new", "practicing", "almost", "mastered", "needs_review"];

  /* --- fechas (yyyy-mm-dd) --- */
  const ymd = (d) => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);
  // Aritmética de fechas SIEMPRE en UTC (evita desfases de zona horaria)
  const addDays = (dateStr, n) => { const d = new Date(dateStr + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

  /* Ficha de dominio en blanco para un objetivo */
  function blank(objectiveId) {
    return {
      objective_id: objectiveId,
      state: "new",
      correct_total: 0,
      correct_days: [],       // fechas distintas con al menos un acierto
      last_two: [],           // últimos 2 resultados (true/false)
      interval_idx: -1,       // índice en INTERVALS (-1 = aún no programado)
      next_review_at: null,   // fecha del próximo repaso
      evidence: 0,            // señal numérica (para informes)
      last_result: null
    };
  }

  /* Aplica UN intento a la ficha de dominio y devuelve la ficha actualizada.
     ev = { correct:boolean, production:boolean }  (production = rellenar/ordenar/decir) */
  function applyAttempt(m, ev, today) {
    m = Object.assign(blank(m.objective_id), m);
    today = today || ymd(new Date());
    const correct = !!ev.correct;
    const production = !!ev.production;

    if (m.state === "new") m.state = "practicing";
    m.last_two = m.last_two.concat(correct).slice(-2);
    m.last_result = correct ? "correct" : "incorrect";

    if (correct) {
      m.correct_total += 1;
      if (m.correct_days.indexOf(today) === -1) m.correct_days.push(today);
      m.evidence += production ? 2 : 1;                 // producir pesa más que reconocer
      m.interval_idx = Math.min(m.interval_idx + 1, INTERVALS.length - 1);
      m.next_review_at = addDays(today, INTERVALS[m.interval_idx]);

      const lastTwoOk = m.last_two.length === 2 && m.last_two.every(Boolean);
      if (m.correct_total >= 3 && m.correct_days.length >= 2 && lastTwoOk) {
        m.state = "mastered";                            // acierto repetido, espaciado y reciente
      } else if (m.correct_total >= 2 && correct && m.state !== "mastered") {
        m.state = "almost";
      } else if (m.state !== "mastered") {
        m.state = "practicing";
      }
    } else {
      m.evidence = Math.max(0, m.evidence - 1);          // el fallo resta MENOS de lo que suma un acierto
      m.interval_idx = 0;
      m.next_review_at = addDays(today, INTERVALS[0]);   // vuelve a repasarse pronto
      m.state = (m.state === "mastered") ? "needs_review" : "practicing";  // nunca "suspende"
    }
    return m;
  }

  /* ¿Este objetivo "vence" hoy (toca repasarlo)? */
  function isDue(m, today) {
    today = today || ymd(new Date());
    return !!m.next_review_at && m.next_review_at <= today;
  }

  /* ¿Están cubiertos los prerrequisitos? (al menos "practicing") */
  function prereqsMet(objective, masteryById) {
    const pr = objective.prerequisites || [];
    return pr.every(id => { const m = masteryById[id]; return m && m.state !== "new"; });
  }

  /* Compone la sesión diaria por PRIORIDAD (reglas explicables):
     1) errores/repaso que vencen  2) casi dominado que vence  3) 1 concepto nuevo (prereqs ok)
     4) práctica de lo que está en curso · intercalando habilidades.
     objectives: [{id, skill_id, prerequisites, difficulty}]  · masteryById: {objId: ficha}
     Devuelve una lista ordenada de objectiveIds para practicar hoy. */
  function composeSession(objectives, masteryById, today, opts) {
    opts = opts || {};
    const size = opts.size || 6;
    today = today || ymd(new Date());
    const M = (id) => masteryById[id] || blank(id);

    const dueReview = [], errors = [], fresh = [], inProgress = [];
    for (const o of objectives) {
      const m = M(o.id);
      if (m.state === "needs_review" || (m.last_result === "incorrect" && isDue(m, today))) errors.push(o);
      else if (m.state === "mastered") { if (isDue(m, today)) dueReview.push(o); }
      else if (m.state === "new") { if (prereqsMet(o, masteryById)) fresh.push(o); }
      else { if (isDue(m, today) || m.state === "almost" || m.state === "practicing") inProgress.push(o); }
    }

    // Prioridad: errores -> repasos que vencen -> en curso -> 1 nuevo
    const ordered = [].concat(errors, dueReview, inProgress);
    const picked = [];
    const pushInterleaved = (list) => {
      let lastSkill = null;
      const pool = list.slice();
      while (pool.length && picked.length < size) {
        let idx = pool.findIndex(o => o.skill_id !== lastSkill);
        if (idx === -1) idx = 0;                 // si no hay otra habilidad, coge la que haya
        const o = pool.splice(idx, 1)[0];
        picked.push(o.id); lastSkill = o.skill_id;
      }
    };
    pushInterleaved(ordered);
    // 1 concepto nuevo si queda hueco y hay prerequisitos cubiertos
    if (picked.length < size && fresh.length) picked.push(fresh[0].id);
    // rellenar con lo que quede en curso
    if (picked.length < size) for (const o of inProgress) { if (picked.indexOf(o.id) === -1 && picked.length < size) picked.push(o.id); }

    return picked;
  }

  /* Etiqueta legible del estado (para el alumno / informes) */
  function stateLabel(state) {
    return ({ new: "Nuevo", practicing: "Practicando", almost: "Casi dominado",
              mastered: "Dominado", needs_review: "Necesita repaso" })[state] || state;
  }

  return { INTERVALS, STATES, blank, applyAttempt, isDue, prereqsMet, composeSession, stateLabel, ymd, addDays };
});
