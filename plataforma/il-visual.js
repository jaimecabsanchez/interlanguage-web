/* ============================================================
   il-visual.js · Lenguaje visual de Interlanguage
   ------------------------------------------------------------
   Fuente única del sistema visual con función (no decoración):
     · ILVisual.nemo(mood)      → personaje guía (zorro), por estados
     · ILVisual.stamp(id, opts) → sello de pasaporte con identidad propia
     · ILVisual.plane(kind, el) → el avión como hilo del progreso
     · ILVisual.reveal(el)      → revelado suave de un desbloqueo
   Reglas: colores solo con tokens --il-*; respeta prefers-reduced-motion;
   Nemo aparece SOLO en momentos concretos (no presencia permanente).
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

  /* ---------- SELLOS · pasaporte con identidad propia -----------------
     Marco común (anillo de pasaporte) + motivo único por id.
     No emojis, no medallas genéricas.                                    */
  const P = 'fill="none" stroke="var(--il-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const STAMP_MOTIF = {
    "first-flight":
      '<path d="M25.2 34.8 46.8 25.2 38.4 46.8 34.8 38.4Z" fill="var(--il-primary)"/>' +
      '<path d="M20 47q6-2.4 11 0" fill="none" stroke="var(--il-primary)" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="1 4" opacity=".55"/>',
    "weekly-explorer":
      '<rect x="23" y="28" width="26" height="20" rx="3" ' + P + '/>' +
      '<path d="M23 34H49M30 25v6M42 25v6M31 41l3.5 3.5L42 37" ' + P + '/>',
    "morning-explorer":
      '<path d="M18 45H54" ' + P + '/>' +
      '<path d="M27 45a9 9 0 0 1 18 0Z" fill="var(--il-primary)"/>' +
      '<path d="M36 27v-4M25.5 30.5l-2.6-2.6M46.5 30.5l2.6-2.6" ' + P + '/>',
    "weekend-planner":
      '<rect x="22" y="26" width="28" height="22" rx="4" ' + P + '/>' +
      '<path d="M22 33h28M29 23v6M43 23v6M28 39h8M28 43h13" ' + P + '/>' +
      '<path d="m43 37 5-2.2-2 5-1-2Z" fill="var(--il-primary)"/>',
    "word-collector":
      '<path d="M24 27h24a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H36l-6 5v-5h-6a3 3 0 0 1-3-3V30a3 3 0 0 1 3-3Z" ' + P + '/>' +
      '<path d="M30 34h13M30 38h9" ' + P + '/>',
    "listening-star":
      '<g transform="translate(15.6,21.6) scale(.78)"><path d="m21 6 3.4 6.9 7.6 1.1-5.5 5.4 1.3 7.6L21 30.4 14.2 27l1.3-7.6-5.5-5.4 7.6-1.1L21 6Z" fill="var(--il-primary)"/></g>' +
      '<path d="M43 29a10 10 0 0 1 0 14M47 25a15 15 0 0 1 0 22" ' + P + ' opacity=".7"/>',
    comeback:
      '<path d="M46 36a10 10 0 1 1-3-7.1" fill="none" stroke="var(--il-primary)" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M45 22v7h-7" ' + P + '/>' +
      '<path d="M31 36 41 32 37.5 42 35.5 37.5Z" fill="var(--il-primary)"/>',
    "streak-spark":
      '<path d="M37 20c2.5 5-1.5 7.5-1.5 11a4.5 4.5 0 0 0 9 0c0-.8-.3-1.7-.8-2.5A12 12 0 1 1 30 39c0-5.5 4.5-8.5 7-19Z" fill="var(--il-primary)"/>',
    "missions-10":
      '<path d="M28 21v30" ' + P + '/><path d="M28 24h17l-3.5 5 3.5 5H28" fill="var(--il-primary)"/>',
    "missions-50":
      '<path d="M29 23h14v6a7 7 0 0 1-14 0zM34 36h4M33 36l-1 7h8l-1-7M30 46h12" ' + P + '/>' +
      '<path d="M25 24a3 3 0 0 0 3 4M47 24a3 3 0 0 1-3 4" ' + P + '/>',
    "speaking-star":
      '<path d="M22 27h28a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H35l-6 5v-5h-7a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3Z" ' + P + '/>' +
      '<path d="m36 30 1.6 3.3 3.6.5-2.6 2.5.6 3.6L36 42l-3.2 1.4.6-3.6-2.6-2.5 3.6-.5L36 30Z" fill="var(--il-primary)"/>',
    "grammar-builder":
      '<rect x="24" y="35" width="11" height="11" rx="2" ' + P + '/><rect x="37" y="35" width="11" height="11" rx="2" ' + P + '/>' +
      '<rect x="30.5" y="23" width="11" height="11" rx="2" fill="var(--il-primary)"/>',
    "reading-explorer":
      '<path d="M36 29c-4-2.6-9-2.6-13-1.6v17c4-1 9-1 13 1.6 4-2.6 9-2.6 13-1.6v-17c-4-1-9-1-13 1.6Z" ' + P + '/><path d="M36 29v17" ' + P + '/>',
    "perfect-round":
      '<circle cx="36" cy="36" r="13" ' + P + '/><circle cx="36" cy="36" r="6.5" ' + P + '/>' +
      '<path d="m31.5 36 3 3 6-6.5" fill="none" stroke="var(--il-primary)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    sharp:
      '<path d="M39 20 26 39h8l-2 13 13-21h-8l2-11Z" fill="var(--il-primary)"/>',
    "record-streak":
      '<path d="M22 45l8-8 5 5 13-14" ' + P + '/><path d="M43 28h7v7" ' + P + '/>',
    _default:
      '<path d="m36 24 3.7 7.5 8.3 1.2-6 5.9 1.4 8.2L36 50.9 28.6 46.8l1.4-8.2-6-5.9 8.3-1.2L36 24Z" fill="var(--il-primary)"/>'
  };

  // Tono de la medalla por familia/tema (variedad legible; el motivo sigue navy).
  function stampTone(id) {
    id = String(id || "");
    if (/listen/.test(id)) return "blue";
    if (/speak/.test(id)) return "coral";
    if (/grammar|sharp/.test(id)) return "navy";
    if (/read/.test(id)) return "green";
    if (/word|vocab|collector/.test(id)) return "green";
    if (/perfect|round|pleno/.test(id)) return "coral";
    if (/streak|racha|record|comeback/.test(id)) return "gold";
    if (/mission|explorer|planner|morning|weekly|flight|ten|fifty|journey/.test(id)) return "blue";
    return "gold";
  }
  function stamp(id, opts) {
    opts = opts || {};
    const locked = !!opts.locked;
    const motif = STAMP_MOTIF[id] || STAMP_MOTIF._default;
    const cls = "il-stamp il-stamp--" + (opts.tone || stampTone(id)) + (locked ? " il-stamp--locked" : "");
    const lockBadge = locked
      ? '<g class="il-stamp__lock" transform="translate(48,48)">' +
        '<circle cx="9" cy="9" r="10" fill="var(--il-surface)"/>' +
        '<rect x="4.5" y="8.5" width="9" height="7" rx="1.6" fill="none" stroke="var(--il-text-secondary)" stroke-width="1.8"/>' +
        '<path d="M6.2 8.5V6.8a2.8 2.8 0 0 1 5.6 0v1.7" fill="none" stroke="var(--il-text-secondary)" stroke-width="1.8"/></g>'
      : "";
    let beads = "";
    for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; beads += '<circle cx="' + (36 + Math.cos(a) * 32.6).toFixed(1) + '" cy="' + (36 + Math.sin(a) * 32.6).toFixed(1) + '" r="1.5"/>'; }
    return (
      '<svg class="' + cls + '" viewBox="0 0 72 72" role="img" aria-hidden="true">' +
      '<circle cx="36" cy="36" r="33.5" class="il-stamp__rim"/>' +
      '<g class="il-stamp__beads">' + beads + '</g>' +
      '<circle cx="36" cy="36" r="27.5" class="il-stamp__disc"/>' +
      '<circle cx="36" cy="36" r="27.5" class="il-stamp__edge" fill="none" stroke-width="1.6"/>' +
      '<ellipse class="il-stamp__shine" cx="29" cy="24" rx="15" ry="7.5" transform="rotate(-26 29 24)"/>' +
      '<g class="il-stamp__motif">' + motif + "</g>" +
      lockBadge +
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

  window.ILVisual = { nemo, stamp, plane, reveal, reduceMotion: reduce };
})();
