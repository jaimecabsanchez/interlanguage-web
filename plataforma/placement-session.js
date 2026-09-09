/* Interlanguage HOME · borrador reanudable de la calibración.
   El almacenamiento se inyecta para mantener el módulo testeable y aislado. */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ILPlacementSession = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const PREFIX = "il_placement_draft_v2_";
  function username(value) { return String(value || "").trim().toLowerCase(); }
  function key(value) { return PREFIX + encodeURIComponent(username(value)); }
  function context(input) { input = input || {}; return { username:username(input.username), band:String(input.band || "neutral"), instrumentId:String(input.instrumentId || ""), instrumentVersion:String(input.instrumentVersion || "") }; }
  function compatible(draft, expected) {
    const ctx = context(expected);
    return !!draft && draft.username === ctx.username && draft.band === ctx.band && draft.instrumentId === ctx.instrumentId && draft.instrumentVersion === ctx.instrumentVersion && draft.status !== "complete";
  }
  function read(storage, expected, report) {
    if (!storage || !expected || !username(expected.username)) return null;
    let draft = null;
    try { draft = JSON.parse(storage.getItem(key(expected.username)) || "null"); }
    catch (error) { if (report) report("invalid_draft", error); return null; }
    if (!draft) return null;
    if (!compatible(draft, expected)) {
      try { storage.removeItem(key(expected.username)); } catch (error) {}
      if (report) report("incompatible_draft", { stored:{ band:draft.band, instrumentVersion:draft.instrumentVersion }, expected:context(expected) });
      return null;
    }
    return draft;
  }
  function write(storage, expected, state, extra) {
    const ctx = context(expected); if (!storage || !ctx.username || !state) return { ok:false };
    const responses = (state.responses || []).map(value => ({
      item_id:String(value.item_id || ""), cefr_probe:String(value.cefr_probe || ""), kind:value.kind || "",
      correct:!!value.correct, evaluable:value.evaluable !== false, technicalFailure:!!value.technicalFailure
    }));
    const draft = Object.assign({}, ctx, {
      status:state.status || "active", seedCefr:state.seedCefr || "A1", engineState:state,
      responses, startedAt:(extra && extra.startedAt) || new Date().toISOString(), updatedAt:new Date().toISOString()
    });
    try { storage.setItem(key(ctx.username), JSON.stringify(draft)); return { ok:true, draft }; }
    catch (error) { return { ok:false, error }; }
  }
  function clear(storage, value) { try { if (storage) storage.removeItem(key(value)); return true; } catch (error) { return false; } }
  function meta(state, content) {
    const confidence = { high:0.9, medium:0.65, low:0.35 }[state && state.confidence] || 0.35;
    return {
      instrument_id:content.instrumentId, instrument_version:content.instrumentVersion, age_band:state.band,
      confidence, metadata:{ confidence_band:state.confidence || "low", coverage_limited:!!state.coverageLimited,
        stop_reason:state.stopReason || "", seed_cefr:state.seedCefr || "A1", evaluable_count:Number(state.evaluableCount) || 0,
        technical_failure_count:Number(state.technicalCount) || 0 }
    };
  }

  return Object.freeze({ PREFIX, username, key, context, compatible, read, write, clear, meta });
});
