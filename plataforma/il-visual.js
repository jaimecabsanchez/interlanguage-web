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
    _default:
      '<path d="m36 24 3.7 7.5 8.3 1.2-6 5.9 1.4 8.2L36 50.9 28.6 46.8l1.4-8.2-6-5.9 8.3-1.2L36 24Z" fill="var(--il-primary)"/>'
  };

  function stamp(id, opts) {
    opts = opts || {};
    const locked = !!opts.locked;
    const motif = STAMP_MOTIF[id] || STAMP_MOTIF._default;
    const cls = "il-stamp" + (locked ? " il-stamp--locked" : "");
    const lockBadge = locked
      ? '<g class="il-stamp__lock" transform="translate(48,48)">' +
        '<circle cx="9" cy="9" r="10" fill="var(--il-surface)"/>' +
        '<rect x="4.5" y="8.5" width="9" height="7" rx="1.6" fill="none" stroke="var(--il-text-secondary)" stroke-width="1.8"/>' +
        '<path d="M6.2 8.5V6.8a2.8 2.8 0 0 1 5.6 0v1.7" fill="none" stroke="var(--il-text-secondary)" stroke-width="1.8"/></g>'
      : "";
    return (
      '<svg class="' + cls + '" viewBox="0 0 72 72" role="img" aria-hidden="true">' +
      '<circle cx="36" cy="36" r="31" class="il-stamp__ring" fill="none" stroke-width="2" stroke-dasharray="3 4.5" opacity=".5"/>' +
      '<circle cx="36" cy="36" r="26.5" class="il-stamp__disc"/>' +
      '<circle cx="36" cy="36" r="27" class="il-stamp__edge" fill="none" stroke-width="1.4" opacity=".55"/>' +
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
