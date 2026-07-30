/* ============================================================
   Interlanguage · Adaptación por ETAPA (un solo sistema visual)
   No son varias apps: es la misma con variaciones controladas por
   data-stage. 4 bandas:
     p12 (1.º–2.º) · p34 (3.º–4.º) · p56 (5.º–6.º) · eso
   Para probar: añade ?etapa=p12 (o p34/p56/eso) a la URL.
   ============================================================ */
(function () {
  "use strict";
  const STAGES = ["p12", "p34", "p56", "eso"];
  // Alias por compatibilidad con enlaces antiguos
  const ALIAS = { primaria_inicial: "p12", primaria_superior: "p56", primaria: "p34" };
  const q = new URLSearchParams(location.search);

  function stageFor(profile) {
    let override = q.get("etapa");
    if (override && ALIAS[override]) override = ALIAS[override];
    if (STAGES.indexOf(override) !== -1) return override;
    const y = profile && profile.birth_year;
    if (y) {
      const age = new Date().getFullYear() - y;
      if (age <= 7) return "p12";
      if (age <= 9) return "p34";
      if (age <= 11) return "p56";
      return "eso";
    }
    return "p56"; // por defecto, Primaria superior
  }

  // Copys por banda (mismo significado, distinto tono/intensidad)
  const COPY = {
    p12: { greet: (n) => "¡Hola, " + n + "! 👋", today: "¡Tu misión de hoy! 🎒", cta: "EMPEZAR", done: "¡Ya has jugado hoy! 🌟", sub: "Un ratito de inglés" },
    p34: { greet: (n) => "¡Hola, " + n + "! 👋", today: "Tu misión de hoy", cta: "EMPEZAR MISIÓN", done: "¡Ya has practicado hoy! 🎉", sub: "Tu misión de hoy" },
    p56: { greet: (n) => "¡Hola, " + n + "! 👋", today: "Tu misión de hoy", cta: "EMPEZAR MISIÓN", done: "¡Ya has practicado hoy! 🎉", sub: "Tu misión de hoy · 10 min" },
    eso: { greet: (n) => "Hola, " + n, today: "Tu sesión de hoy", cta: "EMPEZAR", done: "Sesión de hoy completada ✓", sub: "Sesión de hoy · ~10 min" }
  };

  window.IL_ETAPA = {
    STAGES,
    apply(profile) { const s = stageFor(profile); document.body.dataset.stage = s; return s; },
    copy(stage) { return COPY[stage] || COPY.p56; }
  };
})();
