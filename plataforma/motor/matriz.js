/* ============================================================
   Interlanguage · PUERTA DE LA MATRIZ (adecuación por banda)
   Lógica PURA: decide si un ejercicio es apto para una banda
   (p12/p34/p56/eso/neutral) según etapa, plantilla y nº de opciones.
   CEFR decide dificultad lingüística, no la edad.
   (carga cognitiva / autonomía digital). La usan el motor de
   sesión y (a futuro) el CMS al publicar.
   Base: docs/superpowers/specs/2026-07-31-ux-vision-visual-design.md §4
   Navegador (window.IL_MATRIZ) y Node (module.exports).
   ============================================================ */
(function (root, factory) {
  const policy = root.ILAgePolicy || (typeof require === "function" ? require("../age-policy.js") : null);
  const api = factory(policy);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.IL_MATRIZ = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (AgePolicy) {
  "use strict";

  // tipo del banco de contenido -> plantilla base
  const TIPO2PLANTILLA = {
    elegir_imagen: "P1", elegir_texto: "P1", completar: "P6", emparejar: "P3",
    clasificar: "P4", ordenar: "P5", comprension: "P7", hablar: "P9"
  };

  // Adaptador compatible con la API histórica. Los valores proceden del contrato único.
  const BANDS = Object.freeze(Object.fromEntries(Object.entries(AgePolicy.BANDS).map(([band, cfg]) => [band, Object.freeze({
    preferredCefr:cfg.preferredCefr, plantillas:cfg.templates, maxOpciones:cfg.maxVisibleOptions
  })])));

  function plantillaDe(ej) { return TIPO2PLANTILLA[ej.tipo] || "P1"; }

  // ¿Es apto este ejercicio para esta banda? (todas las puertas)
  function esApta(ej, banda) {
    const safeBand = BANDS[banda] ? banda : "neutral";
    const cfg = BANDS[safeBand];
    const stages = Array.isArray(ej.stage) ? ej.stage : (ej.stage ? [ej.stage] : []);
    if (stages.length && safeBand !== "neutral" && stages.indexOf(safeBand) === -1) return false; // edad/contexto apropiados
    if (cfg.plantillas.indexOf(plantillaDe(ej)) === -1) return false;         // plantilla permitida
    const nOpc = (ej.opciones && ej.opciones.length) || 0;
    if (nOpc && nOpc > cfg.maxOpciones) return false;                          // nº de opciones (carga cognitiva)
    return true;
  }

  function filtra(lista, banda) { return (lista || []).filter(e => esApta(e, banda)); }

  return { BANDS, TIPO2PLANTILLA, plantillaDe, esApta, filtra };
});
