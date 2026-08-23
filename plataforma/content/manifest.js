/* Orden editorial estable de los packs publicados. */
(function (root) {
  "use strict";
  const entries = [
    "content/p12/school.js?v=20260821d",
    "content/shared/daily-routine.js?v=20260821d",
    "content/shared/food.js?v=20260821d",
    "content/shared/grammar.js?v=20260821d",
    "content/eso/future-plans.js?v=20260821d"
  ];
  root.IL_CONTENT_MANIFEST = entries;
  if (root.ILContent) root.ILContent.setManifest(entries);
  if (typeof module === "object" && module.exports) module.exports = entries;
})(typeof globalThis !== "undefined" ? globalThis : this);
