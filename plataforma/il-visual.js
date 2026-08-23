/* ============================================================
   il-visual.js · Lenguaje visual de Interlanguage
   ------------------------------------------------------------
   Fuente única del sistema visual con función (no decoración):
     · ILVisual.nemo(mood)      → personaje guía (zorro), por estados
     · ILVisual.stamp(id, opts) → sello/achievement de la colección
     · ILVisual.plane(kind, el) → el avión como hilo del progreso
     · ILVisual.reveal(el)      → revelado suave de un desbloqueo
   Reglas: colores solo con tokens --il-*; respeta prefers-reduced-motion;
   Nemo aparece SOLO en momentos concretos (no presencia permanente).

   SELLOS · una sola colección coherente ---------------------------------
   Todos comparten EXACTAMENTE el mismo marco (aro exterior + aro de puntos
   + disco + brillo + sombra) y el MISMO candado. Lo único que cambia entre
   sellos es (1) el símbolo central, (2) el color de familia al estar
   conseguido y (3) el estado. Tres estados:
     · earned   → color de familia, sin candado (recompensa)
     · progress → tono suave/desaturado, candado secundario, muestra avance
     · locked   → gris azulado, candado navy en la esquina inferior derecha
   ============================================================ */
(function () {
  "use strict";

  const reduce = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- NEMO · el zorro guía ------------------------------------
     Un personaje propio: formas redondeadas, plano, colores de marca.
     El "mood" solo cambia ojos + boca (+ cejas); el resto es estable.  */
  const NEMO_BASE =
    // orejas (detrás)
    '<path d="M12 10 25 21 19 25Z" fill="var(--il-secondary)"/>' +
    '<path d="M52 10 39 21 45 25Z" fill="var(--il-secondary)"/>' +
    '<path d="M15 13 23 20 19.5 22Z" fill="var(--il-secondary-soft)"/>' +
    '<path d="M49 13 41 20 44.5 22Z" fill="var(--il-secondary-soft)"/>' +
    // cabeza
    '<path d="M32 13C21 13 15 20 15 31 15 43 23 50 32 50 41 50 49 43 49 31 49 20 43 13 32 13Z" fill="var(--il-secondary)"/>' +
    // hocico claro
    '<path d="M32 30C25 30 21 35 22 41 23 47 28 50 32 50 36 50 41 47 42 41 43 35 39 30 32 30Z" fill="var(--il-surface)"/>' +
    // nariz
    '<path d="M32 34c-2.4 0-3.8 1.5-2.7 3.3.7 1.2 1.7 2.1 2.7 2.8 1-.7 2-1.6 2.7-2.8C35.8 35.5 34.4 34 32 34Z" fill="var(--il-primary)"/>';

  const NEMO_FACE = {
    hi:
      '<circle cx="25" cy="29" r="2.6" fill="var(--il-primary)"/>' +
      '<circle cx="39" cy="29" r="2.6" fill="var(--il-primary)"/>' +
      '<circle cx="25.9" cy="28.2" r=".8" fill="var(--il-surface)"/>' +
      '<circle cx="39.9" cy="28.2" r=".8" fill="var(--il-surface)"/>' +
      '<path d="M28.5 42q3.5 3 7 0" fill="none" stroke="var(--il-primary)" stroke-width="1.8" stroke-linecap="round"/>',
    success:
      '<path d="M22.6 29.6q2.4-2.8 4.8 0" fill="none" stroke="var(--il-primary)" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M36.6 29.6q2.4-2.8 4.8 0" fill="none" stroke="var(--il-primary)" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M27 41q5 5.5 10 0" fill="none" stroke="var(--il-primary)" stroke-width="2" stroke-linecap="round"/>',
    cheer:
      '<path d="M22.6 29.6q2.4-2.8 4.8 0" fill="none" stroke="var(--il-primary)" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M36.6 29.6q2.4-2.8 4.8 0" fill="none" stroke="var(--il-primary)" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M27 40q5 6.5 10 0Z" fill="var(--il-primary)"/>',
    think:
      '<circle cx="25" cy="28.4" r="2.6" fill="var(--il-primary)"/>' +
      '<circle cx="39" cy="28.4" r="2.6" fill="var(--il-primary)"/>' +
      '<circle cx="25.9" cy="27.6" r=".8" fill="var(--il-surface)"/>' +
      '<circle cx="39.9" cy="27.6" r=".8" fill="var(--il-surface)"/>' +
      '<path d="M22 24.5q3-2 6-.6" fill="none" stroke="var(--il-primary)" stroke-width="1.6" stroke-linecap="round"/>' +
      '<path d="M30 43q2-1.4 4 0" fill="none" stroke="var(--il-primary)" stroke-width="1.8" stroke-linecap="round"/>',
    oops:
      '<circle cx="25" cy="30" r="2.3" fill="var(--il-primary)"/>' +
      '<circle cx="39" cy="30" r="2.3" fill="var(--il-primary)"/>' +
      '<path d="M22 25.5 27 24" fill="none" stroke="var(--il-primary)" stroke-width="1.6" stroke-linecap="round"/>' +
      '<path d="M42 25.5 37 24" fill="none" stroke="var(--il-primary)" stroke-width="1.6" stroke-linecap="round"/>' +
      '<path d="M29 44q3-2.4 6 0" fill="none" stroke="var(--il-primary)" stroke-width="1.8" stroke-linecap="round"/>'
  };
  // Alias de estados usados por las pantallas
  const NEMO_ALIAS = { intro: "hi", welcome: "hi", retry: "oops", error: "oops", hint: "think", reward: "cheer" };

  function nemo(mood) {
    const key = NEMO_ALIAS[mood] || (NEMO_FACE[mood] ? mood : "hi");
    return (
      '<svg class="il-nemo il-nemo--' + key + '" viewBox="0 0 64 64" role="img" aria-hidden="true">' +
      NEMO_BASE + NEMO_FACE[key] + "</svg>"
    );
  }

  /* ---------- SELLOS · símbolos de la colección -----------------------
     Cada símbolo cabe dentro del disco (radio ~25, centro 36,36). Usan
     navy como base y acentos coral/ámbar/jade; el estado (locked/progress)
     los desatura por CSS, así un mismo símbolo sirve para los 3 estados.  */
  const P = 'fill="none" stroke="var(--il-primary)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"';
  const PERI = "color-mix(in srgb,var(--il-focus) 40%,var(--il-surface))"; // azul periwinkle suave

  const MOTIF = {
    // Primer vuelo · avión de papel navy + estela coral + destello
    "first-flight":
      '<path d="M22 35 50 21 42 50Z" fill="var(--il-primary)"/>' +
      '<path d="M22 35 42 50 36.5 37.5Z" fill="' + PERI + '"/>' +
      '<path d="M36.5 37.5 42 50 39 42.5Z" fill="var(--il-primary)"/>' +
      '<path d="M20.5 51q5-1 7.6-4.4" fill="none" stroke="var(--il-secondary)" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="0.2 3.3"/>' +
      '<path d="M27.4 22.2 28.6 24.8 31.2 26 28.6 27.2 27.4 29.8 26.2 27.2 23.6 26 26.2 24.8Z" fill="var(--il-secondary)"/>',
    // Explorador de la semana · calendario
    "weekly-explorer":
      '<rect x="22.5" y="27" width="27" height="21" rx="3.4" fill="var(--il-surface)" stroke="var(--il-primary)" stroke-width="2.1"/>' +
      '<path d="M22.5 34.6V30.4a3.4 3.4 0 0 1 3.4-3.4h20.2a3.4 3.4 0 0 1 3.4 3.4v4.2Z" fill="var(--il-primary)"/>' +
      '<path d="M29 25v5.4M43 25v5.4" stroke="var(--il-primary)" stroke-width="2.5" stroke-linecap="round"/>' +
      '<g fill="' + PERI + '"><rect x="26.6" y="38" width="4.4" height="4" rx="1"/><rect x="33.8" y="38" width="4.4" height="4" rx="1"/><rect x="41" y="38" width="4.4" height="4" rx="1"/><rect x="26.6" y="43.4" width="4.4" height="4" rx="1"/></g>' +
      '<rect x="33.8" y="43.4" width="4.4" height="4" rx="1" fill="var(--il-secondary)"/>',
    // Racha · llama (misma familia para 5/10/30 días)
    "streak-spark":
      '<path d="M36 19c1.5 5.4 6.6 6.9 6.6 12.6a6.6 6.6 0 0 1-13.2.2c0-2.3 1.2-3.9 1.2-3.9-.1 2.5 1.4 3.5 2.5 3.5 1.5 0 2.1-1.2 1.4-2.9-1.4-3.7.6-7.5 1.5-9.5Z" fill="var(--il-primary)"/>' +
      '<path d="M36 33.5c1 2.4 3.1 3 3.1 5.3a3.1 3.1 0 0 1-6.2 0c0-1.6 1.5-2.5 1.5-4Z" fill="var(--il-secondary)"/>',
    // 10 misiones · bandera premium
    "missions-10":
      '<path d="M30.5 20.5V51" stroke="var(--il-primary)" stroke-width="2.6" stroke-linecap="round"/>' +
      '<circle cx="30.5" cy="20.5" r="2.6" fill="var(--il-secondary)"/>' +
      '<path d="M33 23.4H48l-4.2 4.6 4.2 4.6H33Z" fill="var(--il-primary)"/>' +
      '<path d="M24 50.6a6.5 3 0 0 1 13 0Z" fill="' + PERI + '"/>' +
      '<path d="M41.6 40.4 42.5 42.6 44.7 43.5 42.5 44.4 41.6 46.6 40.7 44.4 38.5 43.5 40.7 42.6Z" fill="var(--il-secondary)"/>',
    // 50 misiones · trofeo
    "missions-50":
      '<path d="M29 23h14v5.6a7 7 0 0 1-14 0Z" fill="var(--il-primary)"/>' +
      '<path d="M29 25.6h-3.4a2.7 2.7 0 0 0 2.8 4.6M43 25.6h3.4a2.7 2.7 0 0 1-2.8 4.6" ' + P + '/>' +
      '<path d="M36 35.4v4.6M31.4 40h9.2" ' + P + '/>' +
      '<rect x="29.8" y="45.4" width="12.4" height="3.6" rx="1.3" fill="var(--il-primary)"/>' +
      '<path d="M36 24.6 37.1 26.8 39.5 27.1 37.7 28.7 38.2 31 36 29.9 33.8 31 34.3 28.7 32.5 27.1 34.9 26.8Z" fill="var(--il-warning)"/>',
    // Explorador matinal · sol sonriente + colinas (el más ilustrativo)
    "morning-explorer":
      '<g stroke="var(--il-secondary)" stroke-width="2.3" stroke-linecap="round"><path d="M36 18.5v-2.6"/><path d="M47.6 23l1.8-1.8"/><path d="M24.4 23l-1.8-1.8"/><path d="M53.6 33h2.6"/><path d="M15.8 33h2.6"/></g>' +
      '<circle cx="36" cy="33" r="9.2" fill="color-mix(in srgb,var(--il-warning) 52%,var(--il-secondary) 26%)"/>' +
      '<circle cx="32.6" cy="32.4" r="1.3" fill="var(--il-primary)"/><circle cx="39.4" cy="32.4" r="1.3" fill="var(--il-primary)"/>' +
      '<path d="M32.6 35.6a3.8 3.8 0 0 0 6.8 0" fill="none" stroke="var(--il-primary)" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M17.5 50.5c3.6-6.2 9.4-6.2 13 0Z" fill="color-mix(in srgb,var(--il-success) 58%,var(--il-surface))"/>' +
      '<path d="M27 50.5c4.2-7.2 12.4-7.2 16.6 0 2-3.4 6.2-3.4 10.4 0v.4H23.4Z" fill="var(--il-success)"/>',
    // Coleccionista de palabras · burbuja con texto
    "word-collector":
      '<path d="M23 27.5h26a3.2 3.2 0 0 1 3.2 3.2v9.6a3.2 3.2 0 0 1-3.2 3.2H33l-6 5.2v-5.2h-4a3.2 3.2 0 0 1-3.2-3.2V30.7a3.2 3.2 0 0 1 3.2-3.2Z" fill="var(--il-primary)"/>' +
      '<path d="M29 33.6h16M29 38.6h10" fill="none" stroke="var(--il-surface)" stroke-width="2.4" stroke-linecap="round"/>',
    // Estrella del listening · estrella + ondas de sonido
    "listening-star":
      '<path d="M30 24.5 32.9 30.4 39.4 31.35 34.7 35.95 35.8 42.45 30 39.4 24.2 42.45 25.3 35.95 20.6 31.35 27.1 30.4Z" fill="var(--il-primary)"/>' +
      '<path d="M42 30a9 9 0 0 1 0 12M46.5 26.5a14 14 0 0 1 0 19" fill="none" stroke="var(--il-secondary)" stroke-width="2.3" stroke-linecap="round"/>',
    // Estrella del speaking · dos burbujas (conversación)
    "speaking-star":
      '<path d="M33 25.5h15a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-2v3.6l-4.2-3.6H33a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3Z" fill="none" stroke="var(--il-primary)" stroke-width="2.1" stroke-linejoin="round"/>' +
      '<path d="M21 29h15a3 3 0 0 1 3 3v7.6a3 3 0 0 1-3 3h-8l-5 4.2v-4.2h-2a3 3 0 0 1-3-3V32a3 3 0 0 1 3-3Z" fill="var(--il-primary)"/>' +
      '<path d="M28.5 33 29.75 35.55 32.55 35.95 30.55 37.95 31.03 40.75 28.5 39.42 25.97 40.75 26.45 37.95 24.45 35.95 27.25 35.55Z" fill="var(--il-secondary)"/>',
    // Constructor de gramática · bloques (construir estructuras)
    "grammar-builder":
      '<rect x="23.5" y="36" width="11" height="11" rx="2.6" fill="color-mix(in srgb,var(--il-primary) 42%,var(--il-surface))"/>' +
      '<path d="M37 47V41.5a5.5 5.5 0 0 1 11 0V47Z" fill="color-mix(in srgb,var(--il-primary) 25%,var(--il-surface))"/>' +
      '<rect x="30.5" y="24" width="11" height="11" rx="2.6" fill="var(--il-primary)"/>',
    // Explorador lector · libro abierto (misma familia)
    "reading-explorer":
      '<path d="M36 30c-3.6-2.4-8.6-2.4-12.4-1V45c3.8-1.4 8.8-1.4 12.4 1 3.6-2.4 8.6-2.4 12.4-1V29c-3.8-1.4-8.8-1.4-12.4 1Z" fill="var(--il-surface)" stroke="var(--il-primary)" stroke-width="2.1" stroke-linejoin="round"/>' +
      '<path d="M36 30v16" fill="none" stroke="var(--il-primary)" stroke-width="2.1"/>' +
      '<path d="M27 34.5h5.6M27 38.5h5.6M39.4 34.5H45M39.4 38.5H45" fill="none" stroke="var(--il-secondary)" stroke-width="1.6" stroke-linecap="round"/>',
    // Planes de finde (ESO) · calendario con check
    "weekend-planner":
      '<rect x="22.5" y="27" width="27" height="21" rx="3.4" fill="var(--il-surface)" stroke="var(--il-primary)" stroke-width="2.1"/>' +
      '<path d="M22.5 34.6V30.4a3.4 3.4 0 0 1 3.4-3.4h20.2a3.4 3.4 0 0 1 3.4 3.4v4.2Z" fill="var(--il-primary)"/>' +
      '<path d="M29 25v5.4M43 25v5.4" stroke="var(--il-primary)" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="m30.5 41.5 3.4 3.4 7.2-7.6" fill="none" stroke="var(--il-secondary)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
    // Dominio / especiales (misma colección)
    "perfect-round":
      '<circle cx="36" cy="36" r="12.5" fill="none" stroke="var(--il-primary)" stroke-width="2.1"/>' +
      '<circle cx="36" cy="36" r="6" fill="none" stroke="var(--il-primary)" stroke-width="2.1"/>' +
      '<path d="m31.7 36 3 3 6-6.4" fill="none" stroke="var(--il-secondary)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    sharp:
      '<path d="M39 20 26 39h8l-2 13 13-21h-8l2-11Z" fill="var(--il-primary)"/>',
    comeback:
      '<path d="M47 36a11 11 0 1 1-3.2-7.7" fill="none" stroke="var(--il-primary)" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M45 21v7h-7" fill="none" stroke="var(--il-primary)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="36" cy="36" r="3.4" fill="var(--il-secondary)"/>',
    "record-streak":
      '<path d="M22 45l7.5-8 5 5 13.5-14.5" fill="none" stroke="var(--il-primary)" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M42 27.5h7v7" fill="none" stroke="var(--il-secondary)" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>',
    _default:
      '<path d="m36 23 3.9 7.9 8.7 1.2-6.3 6.1 1.5 8.6L36 50.7 28 45.9l1.5-8.6-6.3-6.1 8.7-1.2Z" fill="var(--il-primary)"/>'
  };

  // Familia de color (solo afecta al aro/puntos cuando el sello está conseguido;
  // el símbolo mantiene su propia paleta). Bloqueado/progreso convergen a gris.
  function stampTone(id) {
    id = String(id || "");
    if (/listen/.test(id)) return "blue";
    if (/speak/.test(id)) return "coral";
    if (/grammar|sharp|constructor/.test(id)) return "navy";
    if (/read|word|vocab|collector/.test(id)) return "green";
    if (/morning|streak|racha|record|comeback|month|fifty|missions-50|trophy/.test(id)) return "gold";
    if (/perfect|round|pleno/.test(id)) return "coral";
    if (/mission|flight|weekly|explorer|planner|ten|journey|flag/.test(id)) return "blue";
    return "gold";
  }

  // Candado ÚNICO para toda la colección (esquina inferior derecha).
  const LOCK =
    '<g class="il-stamp__lock" transform="translate(45.5,45.5)">' +
    '<circle cx="9.5" cy="9.5" r="10.6" fill="var(--il-surface)" stroke="var(--il-border)" stroke-width="1"/>' +
    '<rect x="5" y="9" width="9" height="7" rx="1.7" fill="var(--il-primary)"/>' +
    '<path d="M6.6 9V7.4a2.9 2.9 0 0 1 5.8 0V9" fill="none" stroke="var(--il-primary)" stroke-width="1.7"/>' +
    '<circle cx="9.5" cy="12.2" r="1" fill="var(--il-surface)"/>' +
    "</g>";

  // Se conserva por compatibilidad (Inicio consulta esta API). Ya no hay imágenes
  // raster: toda la colección es SVG para compartir marco, escalar y recolorear.
  const ACHIEVEMENT_IMG = {};

  function stamp(id, opts) {
    opts = opts || {};
    let state = opts.state;
    if (!state) state = opts.locked ? "locked" : "earned"; // compat: {locked:bool}
    const family = opts.tone || stampTone(id);
    const motif = MOTIF[id] || MOTIF._default;
    const showLock = state === "locked" || state === "progress";
    const cls = "il-stamp il-stamp--" + family + " is-" + state;
    let beads = "";
    const N = 18, R = 28.4;
    for (let i = 0; i < N; i++) {
      const ang = (i / N) * Math.PI * 2 - Math.PI / 2;
      beads += '<circle cx="' + (36 + Math.cos(ang) * R).toFixed(2) + '" cy="' + (36 + Math.sin(ang) * R).toFixed(2) + '" r="1.35"/>';
    }
    return (
      '<svg class="' + cls + '" viewBox="0 0 72 72" role="img" aria-hidden="true">' +
      '<circle cx="36" cy="36" r="31.5" class="il-stamp__rim"/>' +
      '<g class="il-stamp__beads">' + beads + "</g>" +
      '<circle cx="36" cy="36" r="25.2" class="il-stamp__disc"/>' +
      '<circle cx="36" cy="36" r="25.2" class="il-stamp__edge" fill="none"/>' +
      '<ellipse class="il-stamp__shine" cx="29" cy="24" rx="12" ry="5.5" transform="rotate(-24 29 24)"/>' +
      '<g class="il-stamp__motif">' + motif + "</g>" +
      (showLock ? LOCK : "") +
      "</svg>"
    );
  }

  /* ---------- AVIÓN · hilo del progreso -------------------------------
     Marca un momento de avance en un elemento. No es decoración fija:
     se activa por una acción (llegar, despegar, avanzar) y se apaga.    */
  function plane(kind, el) {
    if (!el || reduce()) return;
    const cls = "il-fly--" + (kind || "advance");
    el.classList.remove("il-fly--arrive", "il-fly--takeoff", "il-fly--advance");
    void el.offsetWidth; // reinicia la animación
    el.classList.add(cls);
    el.addEventListener(
      "animationend",
      function h() {
        el.classList.remove(cls);
        el.removeEventListener("animationend", h);
      },
      { once: true }
    );
  }

  /* ---------- Revelado suave de un desbloqueo -------------------------- */
  function reveal(el) {
    if (!el) return;
    if (reduce()) {
      el.classList.add("il-revealed");
      return;
    }
    el.classList.remove("il-reveal");
    void el.offsetWidth;
    el.classList.add("il-reveal");
  }

  window.ILVisual = { nemo, stamp, plane, reveal, reduceMotion: reduce, achievementImage: function (id) { return ACHIEVEMENT_IMG[id] || ""; } };
})();
