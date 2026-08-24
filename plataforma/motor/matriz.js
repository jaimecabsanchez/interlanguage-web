/* ============================================================
   Interlanguage · PUERTA DE LA MATRIZ (adecuación por banda)
   Lógica PURA: decide si un ejercicio es apto para una banda
   (p12/p34/p56/eso) según etapa, plantilla y nº de opciones.
   CEFR decide dificultad lingüística, no la edad.
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

  // Configuración de INTERACCIÓN por banda (P9 = práctica oral interina, desde 3.º).
  // `preferredCefr` orienta el contenido actual, pero nunca bloquea combinaciones futuras.
  const BANDS = {
    p12: { preferredCefr:["Pre-A1"], plantillas:["P1", "P3"], maxOpciones:3 },
    p34: { preferredCefr:["Pre-A1", "A1"], plantillas:["P1", "P3", "P5", "P9"], maxOpciones:4 },
    p56: { preferredCefr:["Pre-A1", "A1", "A2"], plantillas:["P1", "P3", "P4", "P5", "P6", "P9"], maxOpciones:4 },
    eso: { preferredCefr:["A1", "A2", "B1"], plantillas:["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P9"], maxOpciones:5 }
  };

  function plantillaDe(ej) { return TIPO2PLANTILLA[ej.tipo] || "P1"; }

  // ¿Es apto este ejercicio para esta banda? (todas las puertas)
  function esApta(ej, banda) {
    const cfg = BANDS[banda] || BANDS.p56;
    const stages = Array.isArray(ej.stage) ? ej.stage : (ej.stage ? [ej.stage] : []);
    if (stages.length && stages.indexOf(banda) === -1) return false;                // edad/contexto apropiados
    if (cfg.plantillas.indexOf(plantillaDe(ej)) === -1) return false;         // plantilla permitida
    const nOpc = (ej.opciones && ej.opciones.length) || 0;
    if (nOpc && nOpc > cfg.maxOpciones) return false;                          // nº de opciones (carga cognitiva)
    return true;
  }

  function filtra(lista, banda) { return (lista || []).filter(e => esApta(e, banda)); }

  return { BANDS, TIPO2PLANTILLA, plantillaDe, esApta, filtra };
});
