/* Interlanguage HOME · estado puro de una actividad.
   No toca DOM, almacenamiento ni red. */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ILSessionState = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const VALUES = Object.freeze(["loading", "idle", "selected", "checking", "correct", "incorrect", "retry", "technical-error", "complete"]);

  function create() { return Object.freeze({ value:"loading", attempts:0, canCheck:false, canContinue:false, final:false }); }
  function change(state, patch) { return Object.freeze(Object.assign({}, state, patch)); }
  function ready(state) { return state.value === "loading" ? change(state, { value:"idle" }) : state; }
  function select(state, answered) {
    if (["idle", "selected", "retry"].indexOf(state.value) < 0) return state;
    return change(state, { value:answered ? "selected" : "idle", canCheck:!!answered, canContinue:false });
  }
  function check(state) {
    return state.value === "selected" && state.canCheck
      ? change(state, { value:"checking", attempts:state.attempts + 1, canCheck:false, canContinue:false })
      : state;
  }
  function resolve(state, correct) {
    if (state.value !== "checking") return state;
    if (correct) return change(state, { value:"correct", canContinue:true, final:true });
    if (state.attempts >= 2) return change(state, { value:"incorrect", canContinue:true, final:true });
    return change(state, { value:"retry", canCheck:false, canContinue:false, final:false });
  }
  function technical(state) { return change(state, { value:"technical-error", canCheck:false, canContinue:true, final:true }); }
  function complete(state) {
    return state.canContinue ? change(state, { value:"complete", canCheck:false, canContinue:false }) : state;
  }

  return Object.freeze({ VALUES, create, ready, select, check, resolve, technical, complete });
});
