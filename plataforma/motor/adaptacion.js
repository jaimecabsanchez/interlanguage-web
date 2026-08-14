/* ============================================================
   Interlanguage · adaptación ligera dentro de una sesión
   ------------------------------------------------------------
   Ayuda temporal después de una actividad costosa. No cambia el
   nivel del alumno ni persiste etiquetas: una respuesta limpia
   devuelve la sesión al modo normal.
   ============================================================ */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.IL_ADAPTACION = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const CHOICE_TYPES = new Set(["elegir_imagen", "elegir_texto", "completar"]);

  function create(options) {
    options = options || {};
    return {
      guided: !!options.guided,
      recoveries: Number(options.recoveries) || 0,
      supported: Number(options.supported) || 0
    };
  }

  function record(state, outcome) {
    state = create(state);
    outcome = outcome || {};
    const struggled = !outcome.correct || Number(outcome.attempt_no) > 1;
    if (struggled) return { guided: true, recoveries: state.recoveries, supported: state.supported + 1 };
    return { guided: false, recoveries: state.recoveries + (state.guided ? 1 : 0), supported: state.supported };
  }

  function keepThree(options) {
    if (!Array.isArray(options) || options.length <= 3) return options;
    const correctIndex = options.findIndex(option => option && option.correcta === true);
    if (correctIndex < 0) return options;
    const keep = new Set([correctIndex]);
    for (let i = 0; i < options.length && keep.size < 3; i += 1) {
      if (i !== correctIndex) keep.add(i);
    }
    return options.filter((option, index) => keep.has(index));
  }

  function simplify(exercise, guided) {
    if (!guided || !exercise || typeof exercise !== "object") return exercise;
    const copy = Object.assign({}, exercise);
    if (CHOICE_TYPES.has(copy.tipo) && Array.isArray(copy.opciones)) copy.opciones = keepThree(copy.opciones);
    if (copy.tipo === "comprension" && Array.isArray(copy.preguntas)) {
      copy.preguntas = copy.preguntas.map(question => Object.assign({}, question, {
        opciones: keepThree(question && question.opciones)
      }));
    }
    return copy;
  }

  function hint(exercise, band) {
    const feedback = exercise && exercise.feedback || {};
    if (feedback.incorrect) return feedback.incorrect;
    if (band === "eso") return "Focus on the key clue before you answer.";
    if (band === "p12") return "Mira y escucha con calma antes de elegir.";
    return "Fíjate en la pista principal antes de responder.";
  }

  return { create, record, simplify, hint };
});
