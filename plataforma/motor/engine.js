/* ============================================================
   Interlanguage · MOTOR DE ACTIVIDADES (Bloque 7)
   ------------------------------------------------------------
   Un solo motor lee un EJERCICIO (datos) y lo pinta, valida y da
   feedback. "Una plantilla + datos", nunca una pantalla por actividad.

   Uso:
     IL_ENGINE.render(contenedor, ejercicio, {
       onResult: (ev) => { ... }   // ev: {id, correct, attempt_no, hint_used, type}
     });

   Plantillas soportadas (MVP): elegir_imagen, elegir_texto (P1),
   completar (P1/P6), ordenar (P5), hablar (P9 interino).
   Diseño: docs/superpowers/specs/2026-07-29-catalogo-actividades-motor.md
   ============================================================ */
(function () {
  "use strict";

  /* --- utilidades --- */
  const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
  const norm = (s) => String(s == null ? "" : s).toLowerCase().trim()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")       // quita tildes
    .replace(/[.,!?¡¿;:]/g, "").replace(/\s+/g, " ");        // signos y espacios
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* --- audio por voz (funciona sin archivos; ideal para quien aún no lee) --- */
  function speak(text) {
    try {
      if (!("speechSynthesis" in window) || !text) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US"; u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch (e) { /* silencioso */ }
  }

  /* ============================================================
     PLANTILLAS. Cada una: mount(host, ex) -> { read(), correct(), solution() }
     ============================================================ */
  const T = {};

  /* P1 · Selección única (texto y/o emoji). También cubre "completar" con opciones. */
  function seleccionUnica(host, ex, withEmoji) {
    const opts = ex.opciones || [];
    let selected = -1;
    const wrap = el("div", "eng-options" + (withEmoji ? " has-emoji" : ""));
    opts.forEach((o, i) => {
      const b = el("button", "eng-opt");
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      if (withEmoji && o.emoji) { const e = el("span", "eng-emoji", o.emoji); e.setAttribute("aria-hidden", "true"); b.appendChild(e); }
      b.appendChild(el("span", "eng-opt-txt", o.texto));
      b.addEventListener("click", () => {
        selected = i;
        wrap.querySelectorAll(".eng-opt").forEach((x, xi) => { x.classList.toggle("sel", xi === i); x.setAttribute("aria-pressed", xi === i ? "true" : "false"); });
      });
      wrap.appendChild(b);
    });
    host.appendChild(wrap);
    return {
      read: () => selected,
      correct: () => selected >= 0 && !!opts[selected] && opts[selected].correcta === true,
      answered: () => selected >= 0,
      solution: () => {
        wrap.querySelectorAll(".eng-opt").forEach((x, xi) => {
          if (opts[xi] && opts[xi].correcta) x.classList.add("good");
          else if (xi === selected) x.classList.add("bad");
        });
      }
    };
  }
  T.elegir_imagen = (host, ex) => seleccionUnica(host, ex, true);
  T.elegir_texto = (host, ex) => seleccionUnica(host, ex, false);
  T.completar = (host, ex) => {
    if (ex.opciones && ex.opciones.length) return seleccionUnica(host, ex, false);
    // variante con texto libre (validación tolerante)
    const input = el("input", "eng-input"); input.type = "text"; input.setAttribute("autocomplete", "off"); input.setAttribute("autocapitalize", "none");
    host.appendChild(input);
    const accepted = [ex.respuesta, ...(ex.respuestas_alternativas || [])].filter(Boolean).map(norm);
    return {
      read: () => input.value,
      correct: () => accepted.includes(norm(input.value)),
      answered: () => input.value.trim() !== "",
      solution: () => { input.classList.add("bad"); const s = el("div", "eng-sol", "Solución: " + ex.respuesta); host.appendChild(s); }
    };
  };

  /* P5 · Ordenar (colocar fichas en orden) */
  T.ordenar = (host, ex) => {
    const answer = [];             // índices colocados, en orden
    const pool = shuffle((ex.palabras || []).map((w, i) => ({ w, i })));
    const line = el("div", "eng-line"); line.setAttribute("aria-label", "Frase que estás formando");
    const bank = el("div", "eng-bank");
    host.appendChild(line); host.appendChild(bank);

    function redraw() {
      line.innerHTML = ""; bank.innerHTML = "";
      answer.forEach((pi, pos) => {
        const chip = el("button", "eng-chip in", pool[pi].w); chip.type = "button";
        chip.setAttribute("aria-label", "Quitar " + pool[pi].w);
        chip.addEventListener("click", () => { answer.splice(pos, 1); redraw(); });
        line.appendChild(chip);
      });
      if (!answer.length) line.appendChild(el("span", "eng-line-empty", "Toca las palabras en orden…"));
      pool.forEach((p, pi) => {
        if (answer.includes(pi)) return;
        const chip = el("button", "eng-chip", p.w); chip.type = "button";
        chip.addEventListener("click", () => { answer.push(pi); redraw(); });
        bank.appendChild(chip);
      });
    }
    redraw();
    const current = () => answer.map(pi => pool[pi].w);
    const valid = [ex.respuesta, ...(ex.respuestas_alternativas || [])].filter(Boolean).map(a => a.map(norm).join(" "));
    return {
      read: () => current(),
      correct: () => valid.includes(current().map(norm).join(" ")),
      answered: () => answer.length === (ex.palabras || []).length,
      solution: () => { const s = el("div", "eng-sol", "Solución: " + (ex.respuesta || []).join(" ")); host.appendChild(s); }
    };
  };

  /* P9 · Hablar (interino): escuchar y repetir, sin grabar ni evaluar */
  T.hablar = (host, ex) => {
    const card = el("div", "eng-speak");
    card.appendChild(el("div", "eng-speak-phrase", ex.frase || ""));
    const listen = el("button", "btn btn-ghost", "🔊 Escuchar");
    listen.type = "button";
    listen.addEventListener("click", () => speak(ex.frase));
    card.appendChild(listen);
    host.appendChild(card);
    return { read: () => "hablado", correct: () => true, answered: () => true, solution: () => {}, selfDone: true };
  };

  /* ============================================================
     RENDER (el ciclo: mostrar -> comprobar -> feedback -> continuar)
     ============================================================ */
  function render(container, ex, opts) {
    opts = opts || {};
    container.innerHTML = "";
    const root = el("div", "eng-card");
    root.setAttribute("role", "group");
    root.setAttribute("aria-label", ex.etiqueta || "Ejercicio");

    if (ex.etiqueta) root.appendChild(el("div", "eng-tag", ex.etiqueta));

    // Instrucción + botón de audio (si hay texto para leer)
    const head = el("div", "eng-head");
    const ins = el("h2", "eng-ins", ex.instruccion || "");
    head.appendChild(ins);
    const audioText = ex.audio || (ex.tipo === "hablar" ? ex.frase : null);
    if (audioText) {
      const a = el("button", "eng-audio", "🔊"); a.type = "button";
      a.setAttribute("aria-label", "Escuchar");
      a.addEventListener("click", () => speak(audioText));
      head.appendChild(a);
      // los que aún no leen: se lee la consigna al mostrarse
      if (ex.audio_auto) setTimeout(() => speak(audioText), 350);
    }
    root.appendChild(head);

    const body = el("div", "eng-body");
    root.appendChild(body);

    const feedback = el("div", "eng-feedback");
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    root.appendChild(feedback);

    const actions = el("div", "eng-actions");
    const checkBtn = el("button", "btn btn-primary", "Comprobar"); checkBtn.type = "button";
    actions.appendChild(checkBtn);
    root.appendChild(actions);
    container.appendChild(root);

    const impl = (T[ex.tipo] || T.elegir_texto)(body, ex);
    let attempt = 0, hintUsed = false, done = false;

    // Ejercicio de hablar: el botón es "¡Hecho!"
    if (impl.selfDone) checkBtn.textContent = "¡Hecho! 👏";

    function finish(correct) {
      done = true;
      if (typeof opts.onResult === "function") {
        opts.onResult({ id: ex.id, type: ex.tipo, correct: correct, attempt_no: attempt, hint_used: hintUsed });
      }
      checkBtn.textContent = opts.lastOne ? "Terminar" : "Siguiente →";
      checkBtn.disabled = false;
      checkBtn.onclick = () => { if (typeof opts.onNext === "function") opts.onNext(correct); };
    }

    checkBtn.addEventListener("click", function onCheck() {
      if (done) return;
      if (impl.selfDone) { feedback.className = "eng-feedback ok"; feedback.textContent = "¡Muy bien! 🎉"; finish(true); return; }
      if (!impl.answered()) { feedback.className = "eng-feedback warn show"; feedback.textContent = "Elige una respuesta 🙂"; return; }
      attempt++;
      if (impl.correct()) {
        feedback.className = "eng-feedback ok show";
        feedback.textContent = "✅ ¡Correcto!" + (attempt > 1 ? " ¡Lo conseguiste!" : "");
        impl.solution();
        body.querySelectorAll("button, input").forEach(b => b.disabled = true);
        finish(true);
      } else {
        // Fallo: marca suave + explicación + REINTENTAR (nunca "suspenso")
        feedback.className = "eng-feedback bad show";
        const tip = ex.explicacion ? " " + ex.explicacion : "";
        if (attempt >= (ex.max_intentos || 2)) {
          feedback.textContent = "Casi. Mira la solución." + tip;
          impl.solution();
          body.querySelectorAll("button, input").forEach(b => b.disabled = true);
          finish(false);
        } else {
          feedback.textContent = "Uy, no es esa. ¡Prueba otra vez!" + tip;
          hintUsed = hintUsed || !!tip;
        }
      }
    });

    return { focus: () => { const f = body.querySelector("button, input"); if (f) f.focus(); } };
  }

  window.IL_ENGINE = { render, speak, _templates: T, _norm: norm };
})();
