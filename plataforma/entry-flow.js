/* Interlanguage HOME · decisión pura del recorrido de primer acceso. */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ILEntryFlow = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const PREFIX = "il_onboarded_";
  function username(value) { return String(value || "").trim().toLowerCase(); }
  function key(value) { return PREFIX + encodeURIComponent(username(value)); }
  function hasOnboarded(storage, value) {
    try { return !!storage && storage.getItem(key(value)) === "1"; } catch (error) { return false; }
  }
  function completeOnboarding(storage, value) {
    try { if (!storage || !username(value)) return false; storage.setItem(key(value), "1"); return true; } catch (error) { return false; }
  }
  function route(profile, placement, onboarded) {
    if (!profile) return "index.html";
    if (profile.is_admin) return "admin.html";
    if (profile.must_change_password) return "cambiar-clave.html";
    if (placement && placement.placed) return "inicio.html";
    return onboarded ? "test-nivel.html" : "onboarding.html";
  }
  async function resolve(profile, auth, storage) {
    if (!profile || profile.is_admin || profile.must_change_password) return route(profile, null, false);
    let placement = null;
    try { placement = auth && typeof auth.getPlacement === "function" ? await auth.getPlacement() : null; } catch (error) {}
    return route(profile, placement, hasOnboarded(storage, profile.username));
  }
  return Object.freeze({ PREFIX, username, key, hasOnboarded, completeOnboarding, route, resolve });
});
