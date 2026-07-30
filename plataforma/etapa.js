/* ============================================================
   Interlanguage · Adaptación por ETAPA (un solo sistema visual)
   No son tres apps: es la misma con variaciones controladas por
   data-stage (tono, tamaño, textos). Etapas:
     primaria_inicial · primaria_superior · eso
   Para probar: añade ?etapa=eso (o primaria_inicial) a la URL.
   ============================================================ */
(function () {
  "use strict";
  const STAGES = ["primaria_inicial", "primaria_superior", "eso"];
  const q = new URLSearchParams(location.search);

  function stageFor(profile) {
    const override = q.get("etapa");
    if (STAGES.indexOf(override) !== -1) return override;
    const y = profile && profile.birth_year;
    if (y) { const age = new Date().getFullYear() - y; if (age <= 8) return "primaria_inicial"; if (age <= 11) return "primaria_superior"; return "eso"; }
    return "primaria_superior";
  }

  // Copys por etapa (mismo significado, distinto tono/intensidad)
  const COPY = {
    primaria_inicial: { greet: (n) => "¡Hola, " + n + "! 👋", today: "¡Tu misión de hoy! 🎒", cta: "EMPEZAR", done: "¡Ya has jugado hoy! 🌟", sub: "Un ratito de inglés" },
    primaria_superior: { greet: (n) => "¡Hola, " + n + "! 👋", today: "Tu misión de hoy", cta: "EMPEZAR MISIÓN", done: "¡Ya has practicado hoy! 🎉", sub: "Tu práctica de hoy · 10 min" },
    eso: { greet: (n) => "Hola, " + n, today: "Tu sesión de hoy", cta: "EMPEZAR", done: "Sesión de hoy completada ✓", sub: "Sesión de hoy · ~10 min" }
  };

  window.IL_ETAPA = {
    STAGES,
    apply(profile) { const s = stageFor(profile); document.body.dataset.stage = s; return s; },
    copy(stage) { return COPY[stage] || COPY.primaria_superior; }
  };
})();
