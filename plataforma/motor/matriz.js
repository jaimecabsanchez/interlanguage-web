/* ============================================================
   Interlanguage · PUERTA DE LA MATRIZ (adecuación por banda)
   Lógica PURA: decide si un ejercicio es apto para una banda
   (p12/p34/p56/eso) según plantilla, CEFR y nº de opciones
   (carga cognitiva / autonomía digital). La usan el motor de
   sesión y (a futuro) el CMS al publicar.
   Base: docs/superpowers/specs/2026-07-31-ux-vision-visual-design.md §4
   Navegador (window.IL_MATRIZ) y Node (module.exports).
   ============================================================ */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.IL_MATRIZ = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // tipo del banco de contenido -> plantilla base
  const TIPO2PLANTILLA = {
    elegir_imagen: "P1", elegir_texto: "P1", completar: "P6", emparejar: "P3",
    clasificar: "P4", ordenar: "P5", comprension: "P7", hablar: "P9"
  };

  // Configuración por banda (P9 = pronunciación interina, desde 3.º)
  const BANDS = {
    p12: { cefr: ["Pre-A1"],                 plantillas: ["P1", "P3"],                         maxOpciones: 3 },
    p34: { cefr: ["Pre-A1", "A1"],           plantillas: ["P1", "P3", "P5", "P9"],             maxOpciones: 4 },
    p56: { cefr: ["Pre-A1", "A1", "A2"],     plantillas: ["P1", "P3", "P4", "P5", "P6", "P9"], maxOpciones: 4 },
    eso: { cefr: ["A1", "A2", "B1"],         plantillas: ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P9"], maxOpciones: 5 }
  };

  function plantillaDe(ej) { return TIPO2PLANTILLA[ej.tipo] || "P1"; }

  // ¿Es apto este ejercicio para esta banda? (todas las puertas)
  function esApta(ej, banda) {
    const cfg = BANDS[banda] || BANDS.p56;
    if (cfg.plantillas.indexOf(plantillaDe(ej)) === -1) return false;         // plantilla permitida
    const nivel = ej.nivel || "A1";
    if (cfg.cefr.indexOf(nivel) === -1) return false;                          // CEFR dentro del rango
    const nOpc = (ej.opciones && ej.opciones.length) || 0;
    if (nOpc && nOpc > cfg.maxOpciones) return false;                          // nº de opciones (carga cognitiva)
    return true;
  }

  function filtra(lista, banda) { return (lista || []).filter(e => esApta(e, banda)); }

  return { BANDS, TIPO2PLANTILLA, plantillaDe, esApta, filtra };
});
