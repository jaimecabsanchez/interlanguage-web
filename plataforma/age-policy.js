/* Interlanguage · contrato canónico edad × interacción.
   CEFR sigue siendo un eje lingüístico independiente: estas reglas solo
   gobiernan densidad, apoyo, plantillas y carga de interacción. */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ILAgePolicy = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const BANDS = Object.freeze({
    p12: Object.freeze({
      band:"p12", ageLabel:"5–7", instructionLanguage:"spanish", visualSupport:"required",
      guideIntensity:"high", celebrationIntensity:"high", touchSize:56, maxVisibleOptions:3,
      sessionSize:4, hintLabel:"Una pista", listenLabel:"Escuchar",
      templates:Object.freeze(["P1", "P3"]), preferredCefr:Object.freeze(["Pre-A1"])
    }),
    p34: Object.freeze({
      band:"p34", ageLabel:"8–9", instructionLanguage:"spanish", visualSupport:"preferred",
      guideIntensity:"medium", celebrationIntensity:"medium", touchSize:52, maxVisibleOptions:4,
      sessionSize:5, hintLabel:"Pista", listenLabel:"Listen",
      templates:Object.freeze(["P1", "P3", "P5", "P9"]), preferredCefr:Object.freeze(["Pre-A1", "A1"])
    }),
    p56: Object.freeze({
      band:"p56", ageLabel:"10–11", instructionLanguage:"spanish-contextual-english", visualSupport:"optional",
      guideIntensity:"low", celebrationIntensity:"balanced", touchSize:48, maxVisibleOptions:4,
      sessionSize:6, hintLabel:"Ver pista", listenLabel:"Listen",
      templates:Object.freeze(["P1", "P3", "P4", "P5", "P6", "P9"]), preferredCefr:Object.freeze(["Pre-A1", "A1", "A2"])
    }),
    eso: Object.freeze({
      band:"eso", ageLabel:"12+", instructionLanguage:"english", visualSupport:"content-only",
      guideIntensity:"none", celebrationIntensity:"minimal", touchSize:44, maxVisibleOptions:5,
      sessionSize:7, hintLabel:"Show hint", listenLabel:"Listen",
      templates:Object.freeze(["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P9"]), preferredCefr:Object.freeze(["A1", "A2", "B1"])
    }),
    neutral: Object.freeze({
      band:"neutral", ageLabel:"", instructionLanguage:"spanish", visualSupport:"optional",
      guideIntensity:"low", celebrationIntensity:"minimal", touchSize:48, maxVisibleOptions:4,
      sessionSize:5, hintLabel:"Ver pista", listenLabel:"Escuchar",
      templates:Object.freeze(["P1", "P3", "P5"]), preferredCefr:Object.freeze(["Pre-A1", "A1", "A2", "B1"])
    })
  });

  function isKnown(band) { return Object.prototype.hasOwnProperty.call(BANDS, band); }
  function resolve(band) { return BANDS[isKnown(band) ? band : "neutral"]; }

  return Object.freeze({ BANDS, isKnown, resolve });
});
