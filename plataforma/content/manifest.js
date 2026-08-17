/* Orden editorial estable de los packs publicados. */
(function (root) {
  "use strict";
  const entries = [
    "content/p12/school.js",
    "content/shared/daily-routine.js",
    "content/shared/food.js",
    "content/eso/future-plans.js"
  ];
  root.IL_CONTENT_MANIFEST = entries;
  if (root.ILContent) root.ILContent.setManifest(entries);
  if (typeof module === "object" && module.exports) module.exports = entries;
})(typeof globalThis !== "undefined" ? globalThis : this);
