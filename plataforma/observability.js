/* Interlanguage HOME · observabilidad mínima, sin respuestas ni secretos. */
(function (root, factory) {
  "use strict";
  const create = factory();
  if (typeof module === "object" && module.exports) module.exports = create;
  else root.ILObservability = create(root.localStorage, root.console);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const KEY = "il_diagnostics_v1";
  const KINDS = ["data_unavailable", "network_failure", "technical_failure", "invalid_data"];
  function clean(context) {
    context = context || {};
    const allowed = ["area", "operation", "code", "table", "exercise_id", "failure_type", "status"];
    const out = {}; allowed.forEach(key => { if (context[key] != null) out[key] = String(context[key]).slice(0, 160); }); return out;
  }
  return function createObservability(storage, logger) {
    function list() {
      try { const rows = JSON.parse(storage && storage.getItem(KEY) || "[]"); return Array.isArray(rows) ? rows : []; }
      catch (error) { return []; }
    }
    function report(kind, error, context) {
      const category = KINDS.indexOf(kind) === -1 ? "invalid_data" : kind;
      const entry = { at:new Date().toISOString(), kind:category, message:String(error && error.message || error || category).slice(0, 240), context:clean(context) };
      try { if (storage) storage.setItem(KEY, JSON.stringify(list().concat(entry).slice(-80))); } catch (ignore) {}
      const method = category === "data_unavailable" ? "warn" : "error";
      if (logger && typeof logger[method] === "function") logger[method]("[Interlanguage]", category, entry.context, entry.message);
      return entry;
    }
    function clear() { try { if (storage) storage.removeItem(KEY); return true; } catch (error) { return false; } }
    return { report, list, clear, kinds:KINDS.slice() };
  };
});
