/* ============================================================
   Interlanguage · motor de actividades
   ------------------------------------------------------------
   Controlador común + registro de plantillas. Mantiene la API:
     IL_ENGINE.render(container, exercise, options)
   ============================================================ */
(function () {
  "use strict";

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };
  const norm = value => String(value == null ? "" : value).toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,!?¡¿;:]/g, "").replace(/\s+/g, " ");
  const shuffle = values => {
    const copy = values.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const icon = name => window.ILIcon ? window.ILIcon(name) : "";
  const secondaryMode = () => document.body && document.body.dataset.ageMode === "secondary";
  const SKILL_META = {
    listening: { icon: "ear", es: "Listening", en: "Listening" },
    vocabulary: { icon: "book", es: "Vocabulary", en: "Vocabulary" },
    grammar: { icon: "pencil", es: "Grammar", en: "Grammar" },
    reading: { icon: "book", es: "Reading", en: "Reading" },
    writing: { icon: "pencil", es: "Writing", en: "Writing" },
    speaking: { icon: "chat", es: "Speaking", en: "Speaking" }
  };

  const visuals = () => window.ILExerciseVisuals;
  function illustrationFor(option) {
    const bank = visuals();
    return bank ? bank.imageHTML(option, "lazy") : "";
  }
  const disableAll = (host, disabled) => host.querySelectorAll("button,input,textarea,select")
    .forEach(control => { control.disabled = !!disabled; });
  const audioSettings = () => window.ILProfileSettings ? window.ILProfileSettings.getActive() : { sound: true, autoplayAudio: true, audioSpeed: 0.9 };

  function instructionFor(exercise, stage) {
    const variants = exercise.instructions || {};
    return variants[stage] || exercise.instruccion || "Completa la actividad.";
  }

  function supportFor(exercise, band) {
    const english = band !== "p12";
    const type = exercise.tipo || "";
    if (type === "emparejar") return english ? "LOOK · MATCH" : "MIRA · RELACIONA";
    if (type === "ordenar") return english ? "THINK · ORDER" : "PIENSA · ORDENA";
    if (type === "hablar") return english ? "LISTEN · SPEAK" : "ESCUCHA · HABLA";
    if (exercise.audio) return english ? "LISTEN · CHOOSE" : "ESCUCHA · ELIGE";
    return english ? "LOOK · CHOOSE" : "MIRA · ELIGE";
  }

  function exerciseContext(exercise, band) {
    const context = el("div", "eng-context");
    const skill = SKILL_META[exercise.habilidad] || SKILL_META.vocabulary;
    const task = el("span", "eng-task-mode");
    task.innerHTML = icon(skill.icon) + "<span></span>";
    task.lastChild.textContent = supportFor(exercise, band);
    const label = el("span", "eng-label");
    label.innerHTML = icon(skill.icon) + "<span></span>";
    label.lastChild.textContent = exercise.etiqueta || (band === "p12" ? skill.es : skill.en);
    context.append(task, label);
    return context;
  }

  function speak(text, callbacks) {
    callbacks = callbacks || {};
    try {
      const settings = audioSettings();
      if (!settings.sound) {
        if (callbacks.onDisabled) callbacks.onDisabled();
        return null;
      }
      if (!("speechSynthesis" in window) || !text) {
        if (callbacks.onError) callbacks.onError();
        return null;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = settings.audioSpeed || 0.9;
      utterance.onstart = () => callbacks.onStart && callbacks.onStart();
      utterance.onend = () => callbacks.onEnd && callbacks.onEnd();
      utterance.onerror = event => callbacks.onError && callbacks.onError(event);
      window.speechSynthesis.speak(utterance);
      return utterance;
    } catch (error) {
      if (callbacks.onError) callbacks.onError();
      return null;
    }
  }

  function baseResult(exercise, result) {
    const feedback = exercise.feedback || {};
    return {
      correct: !!result.correct,
      selectedLabel: result.selectedLabel || "",
      correctLabel: result.correctLabel || "",
      explanation: feedback.correctAnswer || exercise.explicacion || "",
      context: feedback.context || exercise.contexto || "",
      learnedExpressions: feedback.learnedExpressions || result.learnedExpressions || []
    };
  }

  const TEMPLATES = {};

  function singleChoice(host, exercise, withImage, onChange) {
    const options = exercise.opciones || [];
    const card = host.closest(".eng-card");
    const supportive = !!(card && (card.classList.contains("eng-card--p12") || card.classList.contains("eng-card--p34")));
    const autoVisuals = options.map(illustrationFor);
    const showVisuals = withImage || (supportive && autoVisuals.length > 0 && autoVisuals.every(Boolean));
    let selected = -1;
    let disabled = false;
    const wrap = el("div", "eng-options" + (showVisuals ? " has-image" : ""));

    function clearJudgement() {
      wrap.querySelectorAll(".eng-opt").forEach(option => {
        option.classList.remove("is-correct", "is-incorrect");
        option.querySelectorAll(".eng-state-icon").forEach(node => node.remove());
      });
    }
    options.forEach((option, index) => {
      const button = el("button", "eng-opt");
      button.type = "button";
      button.dataset.optionIndex = String(index + 1);
      button.setAttribute("aria-pressed", "false");
      if (showVisuals) {
        const visual = el("span", "eng-option-visual");
        visual.setAttribute("aria-hidden", "true");
        const art = autoVisuals[index];
        if (art) {
          visual.classList.add("has-illo");
          visual.classList.add("has-scene");
          visual.innerHTML = art;
        }
        button.appendChild(visual);
      }
      button.appendChild(el("span", "eng-opt-text", option.texto || ""));
      button.addEventListener("click", () => {
        if (disabled) return;
        clearJudgement();
        selected = index;
        wrap.querySelectorAll(".eng-opt").forEach((node, nodeIndex) => {
          const active = nodeIndex === index;
          node.classList.toggle("is-selected", active);
          node.setAttribute("aria-pressed", active ? "true" : "false");
        });
        onChange();
      });
      wrap.appendChild(button);
    });
    host.appendChild(wrap);

    function addState(node, type) {
      const state = el("span", "eng-state-icon");
      state.innerHTML = icon(type === "correct" ? "check" : "close");
      state.setAttribute("aria-label", secondaryMode()
        ? (type === "correct" ? "Correct answer" : "Incorrect answer")
        : (type === "correct" ? "Respuesta correcta" : "Respuesta incorrecta"));
      node.appendChild(state);
    }
    return {
      isAnswered: () => selected >= 0,
      getAnswer: () => selected,
      evaluate: () => {
        const correctIndex = options.findIndex(option => option.correcta === true);
        return baseResult(exercise, {
          correct: selected >= 0 && selected === correctIndex,
          selectedLabel: options[selected] ? options[selected].texto : "",
          correctLabel: options[correctIndex] ? options[correctIndex].texto : "",
          learnedExpressions: options[correctIndex] ? [options[correctIndex].texto] : []
        });
      },
      reveal: result => {
        clearJudgement();
        const buttons = wrap.querySelectorAll(".eng-opt");
        if (result.correct && buttons[selected]) {
          buttons[selected].classList.add("is-correct"); addState(buttons[selected], "correct");
        } else if (buttons[selected]) {
          buttons[selected].classList.add("is-incorrect"); addState(buttons[selected], "incorrect");
          if (result.final) {
            const correctIndex = options.findIndex(option => option.correcta === true);
            if (buttons[correctIndex]) { buttons[correctIndex].classList.add("is-correct"); addState(buttons[correctIndex], "correct"); }
          }
        }
      },
      setDisabled: value => { disabled = !!value; disableAll(wrap, disabled); },
      focus: () => {
        const buttons = wrap.querySelectorAll("button");
        const target = selected >= 0 ? buttons[selected] : buttons[0];
        if (target) target.focus();
      },
      destroy: () => {}
    };
  }

  TEMPLATES.elegir_imagen = (host, ex, onChange) => singleChoice(host, ex, true, onChange);
  TEMPLATES.elegir_texto = (host, ex, onChange) => singleChoice(host, ex, false, onChange);

  TEMPLATES.completar = (host, exercise, onChange) => {
    if (exercise.opciones && exercise.opciones.length) return singleChoice(host, exercise, false, onChange);
    const input = el("input", "eng-input");
    input.type = "text"; input.autocomplete = "off"; input.autocapitalize = "none";
    input.setAttribute("aria-label", secondaryMode() ? "Type your answer" : "Escribe tu respuesta");
    input.addEventListener("input", () => { input.classList.remove("is-correct", "is-incorrect"); onChange(); });
    input.addEventListener("focus", () => setTimeout(() => input.scrollIntoView({ block: "center", behavior: "smooth" }), 120));
    host.appendChild(input);
    const accepted = [exercise.respuesta, ...(exercise.respuestas_alternativas || [])].filter(Boolean);
    return {
      isAnswered: () => input.value.trim() !== "",
      getAnswer: () => input.value,
      evaluate: () => baseResult(exercise, {
        correct: accepted.map(norm).includes(norm(input.value)),
        selectedLabel: input.value,
        correctLabel: exercise.respuesta || accepted[0] || "",
        learnedExpressions: [exercise.respuesta || accepted[0]].filter(Boolean)
      }),
      reveal: result => {
        input.classList.remove("is-correct", "is-incorrect");
        input.classList.add(result.correct ? "is-correct" : "is-incorrect");
        if (!result.correct && result.final) {
          const solution = el("p", "eng-solution");
          solution.innerHTML = icon("check") + "<span></span>";
          solution.lastChild.textContent = (secondaryMode() ? "Correct answer: " : "Respuesta correcta: ") + result.correctLabel;
          host.appendChild(solution);
        }
      },
      setDisabled: value => { input.disabled = !!value; },
      focus: () => input.focus(),
      destroy: () => {}
    };
  };

  TEMPLATES.ordenar = (host, exercise, onChange) => {
    const answer = [];
    const pool = shuffle((exercise.palabras || []).map((word, index) => ({ word, index })));
    let disabled = false;
    const line = el("div", "eng-order-line");
    line.setAttribute("aria-label", secondaryMode() ? "Sentence you are building" : "Frase que estás formando");
    const bank = el("div", "eng-word-bank");
    host.appendChild(line); host.appendChild(bank);

    function redraw() {
      line.innerHTML = ""; bank.innerHTML = "";
      line.classList.remove("is-correct", "is-incorrect");
      answer.forEach((poolIndex, position) => {
        const chip = el("button", "eng-word is-placed", pool[poolIndex].word);
        chip.type = "button"; chip.disabled = disabled;
        chip.setAttribute("aria-label", (secondaryMode() ? "Remove " : "Quitar ") + pool[poolIndex].word);
        chip.addEventListener("click", () => { if (!disabled) { answer.splice(position, 1); redraw(); onChange(); } });
        line.appendChild(chip);
      });
      if (!answer.length) line.appendChild(el("span", "eng-order-empty", secondaryMode() ? "Choose the words in order" : "Selecciona las palabras en orden"));
      pool.forEach((entry, poolIndex) => {
        if (answer.includes(poolIndex)) return;
        const chip = el("button", "eng-word", entry.word); chip.type = "button"; chip.disabled = disabled;
        chip.addEventListener("click", () => { if (!disabled) { answer.push(poolIndex); redraw(); onChange(); } });
        bank.appendChild(chip);
      });
    }
    redraw();
    const current = () => answer.map(index => pool[index].word);
    const valid = [exercise.respuesta, ...(exercise.respuestas_alternativas || [])].filter(Boolean).map(value => value.map(norm).join(" "));
    return {
      isAnswered: () => answer.length === (exercise.palabras || []).length,
      getAnswer: current,
      evaluate: () => baseResult(exercise, {
        correct: valid.includes(current().map(norm).join(" ")),
        selectedLabel: current().join(" "),
        correctLabel: (exercise.respuesta || []).join(" "),
        learnedExpressions: [(exercise.respuesta || []).join(" ")].filter(Boolean)
      }),
      reveal: result => {
        line.classList.add(result.correct ? "is-correct" : "is-incorrect");
        if (!result.correct && result.final) host.appendChild(el("p", "eng-solution", (secondaryMode() ? "Correct answer: " : "Respuesta correcta: ") + result.correctLabel));
      },
      setDisabled: value => { disabled = !!value; disableAll(host, disabled); },
      focus: () => { const target = host.querySelector("button"); if (target) target.focus(); },
      destroy: () => {}
    };
  };

  TEMPLATES.emparejar = (host, exercise, onChange) => {
    const pairs = exercise.pares || [];
    const rights = shuffle(pairs.map((pair, index) => ({ label: pair.b, index })));
    const assignments = {};
    let selectedLeft = null;
    let disabled = false;
    const rows = el("div", "eng-match");
    const bank = el("div", "eng-word-bank");
    host.appendChild(rows); host.appendChild(bank);
    const rightUsed = index => Object.keys(assignments).some(key => assignments[key] === index);
    function visualLabel(parent, value) {
      const illustration = illustrationFor({ emoji: value, visual: value, texto: value });
      if (!illustration) { parent.textContent = value; return; }
      const art = el("span", "eng-option-visual has-illo");
      art.classList.add("has-scene");
      art.setAttribute("aria-hidden", "true"); art.innerHTML = illustration;
      const asset = visuals() && visuals().get({ texto: value, visual: value, emoji: value });
      const label = el("span", "sr-only", asset ? asset.label : String(value)); parent.append(art, label);
    }

    function redraw() {
      rows.innerHTML = ""; bank.innerHTML = "";
      rows.classList.remove("is-correct", "is-incorrect");
      pairs.forEach((pair, leftIndex) => {
        const row = el("button", "eng-match-row" + (selectedLeft === leftIndex ? " is-selected" : ""));
        row.type = "button"; row.disabled = disabled;
        row.setAttribute("aria-pressed", selectedLeft === leftIndex ? "true" : "false");
        row.appendChild(el("span", "eng-match-left", pair.a));
        const slot = el("span", "eng-match-slot" + (assignments[leftIndex] != null ? " is-filled" : ""));
        if (assignments[leftIndex] != null) visualLabel(slot, pairs[assignments[leftIndex]].b); else slot.textContent = secondaryMode() ? "Not matched" : "Sin pareja";
        row.appendChild(slot);
        row.addEventListener("click", () => {
          if (disabled) return;
          if (assignments[leftIndex] != null) { delete assignments[leftIndex]; selectedLeft = null; }
          else selectedLeft = selectedLeft === leftIndex ? null : leftIndex;
          redraw(); onChange();
        });
        rows.appendChild(row);
      });
      rights.forEach(right => {
        if (rightUsed(right.index)) return;
        const button = el("button", "eng-word"); button.type = "button"; button.disabled = disabled; visualLabel(button, right.label);
        const asset = visuals() && visuals().get({ texto: right.label, visual: right.label, emoji: right.label });
        button.setAttribute("aria-label", asset ? asset.label : right.label);
        button.addEventListener("click", () => {
          if (disabled || selectedLeft == null) return;
          assignments[selectedLeft] = right.index; selectedLeft = null; redraw(); onChange();
        });
        bank.appendChild(button);
      });
    }
    redraw();
    return {
      isAnswered: () => Object.keys(assignments).length === pairs.length,
      getAnswer: () => ({ ...assignments }),
      evaluate: () => baseResult(exercise, {
        correct: pairs.every((pair, index) => assignments[index] === index),
        correctLabel: pairs.map(pair => pair.a + " — " + (ILLO_LABEL[pair.b] || pair.b)).join(", "),
        learnedExpressions: pairs.map(pair => pair.a)
      }),
      reveal: result => {
        rows.classList.add(result.correct ? "is-correct" : "is-incorrect");
        if (!result.correct && result.final) host.appendChild(el("p", "eng-solution", "Parejas correctas: " + result.correctLabel));
      },
      setDisabled: value => { disabled = !!value; disableAll(host, disabled); },
      focus: () => { const target = host.querySelector("button"); if (target) target.focus(); },
      destroy: () => {}
    };
  };

  TEMPLATES.comprension = (host, exercise, onChange) => {
    const stimulus = exercise.estimulo || {};
    if (stimulus.texto) {
      const text = el("div", "eng-stimulus", stimulus.texto);
      text.lang = stimulus.lang || "en"; host.appendChild(text);
    }
    const questions = exercise.preguntas || [];
    const selected = new Array(questions.length).fill(-1);
    let disabled = false;
    const box = el("div", "eng-subquestions"); host.appendChild(box);
    questions.forEach((question, questionIndex) => {
      const group = el("fieldset", "eng-subquestion");
      group.appendChild(el("legend", "eng-subquestion-title", question.pregunta));
      const choices = el("div", "eng-suboptions");
      (question.opciones || []).forEach((option, optionIndex) => {
        const button = el("button", "eng-suboption", option.texto); button.type = "button";
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => {
          if (disabled) return;
          selected[questionIndex] = optionIndex;
          choices.querySelectorAll(".eng-suboption").forEach((node, index) => {
            node.classList.remove("is-correct", "is-incorrect");
            node.classList.toggle("is-selected", index === optionIndex);
            node.setAttribute("aria-pressed", index === optionIndex ? "true" : "false");
          });
          onChange();
        });
        choices.appendChild(button);
      });
      group.appendChild(choices); box.appendChild(group);
    });
    return {
      isAnswered: () => selected.every(index => index >= 0),
      getAnswer: () => selected.slice(),
      evaluate: () => baseResult(exercise, {
        correct: questions.every((question, index) => question.opciones[selected[index]] && question.opciones[selected[index]].correcta === true),
        correctLabel: questions.map(question => (question.opciones.find(option => option.correcta) || {}).texto).filter(Boolean).join(", "),
        learnedExpressions: stimulus.texto ? [stimulus.texto] : []
      }),
      reveal: result => {
        box.querySelectorAll(".eng-subquestion").forEach((group, questionIndex) => {
          group.querySelectorAll(".eng-suboption").forEach((node, optionIndex) => {
            node.classList.remove("is-correct", "is-incorrect");
            const option = questions[questionIndex].opciones[optionIndex];
            if (optionIndex === selected[questionIndex] && !option.correcta) node.classList.add("is-incorrect");
            if ((result.correct || result.final) && option.correcta) node.classList.add("is-correct");
          });
        });
      },
      setDisabled: value => { disabled = !!value; disableAll(box, disabled); },
      focus: () => { const target = box.querySelector("button"); if (target) target.focus(); },
      destroy: () => {}
    };
  };

  TEMPLATES.hablar = (host, exercise, onChange) => {
    const secondary = secondaryMode();
    const card = el("div", "eng-speaking");
    const phrase = el("p", "eng-speaking-phrase", exercise.frase || ""); phrase.lang = "en";
    const note = el("p", "eng-speaking-note", secondary ? "Listen and repeat at your own pace." : "Escucha y repite a tu ritmo.");
    const listen = el("button", "btn btn-ghost"); listen.type = "button";
    listen.innerHTML = icon("speaker") + "<span>" + (secondary ? "Listen" : "Escuchar") + "</span>";
    const speakingAudio = audioSettings();
    if (!speakingAudio.sound) { listen.disabled = true; listen.title = secondary ? "Enable sound in Profile to play this phrase." : "Activa el sonido en Perfil para escuchar esta frase."; listen.setAttribute("aria-label", secondary ? "Audio disabled. Enable it in Profile." : "Audio desactivado. Actívalo en Perfil."); }
    const setListenText = text => { const label = listen.querySelector("span"); if (label) label.textContent = text; };
    listen.addEventListener("click", () => speak(exercise.frase, {
      onStart: () => { setListenText(secondary ? "Playing…" : "Reproduciendo…"); listen.setAttribute("aria-pressed", "true"); },
      onEnd: () => { setListenText(secondary ? "Replay" : "Repetir"); listen.setAttribute("aria-pressed", "false"); onChange(); },
      onDisabled: () => { setListenText(secondary ? "Audio disabled" : "Audio desactivado"); },
      onError: () => { setListenText(secondary ? "Try audio again" : "Reintentar audio"); onChange(); }
    }));
    card.appendChild(phrase); card.appendChild(note); card.appendChild(listen); host.appendChild(card);
    return {
      isAnswered: () => true,
      getAnswer: () => "practised",
      evaluate: () => baseResult(exercise, { correct: true, correctLabel: exercise.frase || "", learnedExpressions: [exercise.frase].filter(Boolean) }),
      reveal: () => {},
      setDisabled: value => { listen.disabled = !!value; },
      focus: () => listen.focus(),
      destroy: () => window.speechSynthesis && window.speechSynthesis.cancel()
    };
  };

  function renderFeedback(panel, type, title, message, context) {
    panel.className = "eng-feedback is-visible is-" + type;
    panel.innerHTML = "";
    const heading = el("div", "eng-feedback-title");
    const stateIcon = el("span", "eng-feedback-icon");
    stateIcon.innerHTML = icon(type === "success" ? "check" : (type === "retry" ? "info" : "close"));
    stateIcon.setAttribute("aria-hidden", "true");
    heading.appendChild(stateIcon); heading.appendChild(el("strong", "", title));
    panel.appendChild(heading);
    if (message) panel.appendChild(el("p", "eng-feedback-message", message));
    if (context) { const example = el("p", "eng-feedback-context", context); example.lang = "en"; panel.appendChild(example); }
  }

  function interfaceCopy(band) {
    const copies = {
      p12: { check: "Comprobar", checkAgain: "Probar otra vez", next: "Siguiente", finish: "¡Terminar!", listen: "Escuchar", playing: "Escuchando…", replay: "Otra vez", retryAudio: "Reintentar", success: "¡Genial!", retry: "Casi. Prueba otra vez.", error: "Vamos a aprenderlo.", guide: "Vamos paso a paso", support: "Escucha · Mira · Elige" },
      p34: { check: "Check", checkAgain: "Try again", next: "Next", finish: "Finish", listen: "Listen", playing: "Playing…", replay: "Replay", retryAudio: "Try again", success: "Great!", retry: "Almost! Try once more.", error: "Let’s learn it.", guide: "Una pista para empezar", support: "Listen · Think · Choose" },
      p56: { check: "Comprobar", checkAgain: "Comprobar de nuevo", next: "Continuar", finish: "Finalizar misión", listen: "Listen", playing: "Reproduciendo…", replay: "Repetir", retryAudio: "Reintentar", success: "¡Muy bien!", retry: "Casi.", error: "Vamos a verlo.", guide: "Pista rápida", support: "Think · Answer · Learn" },
      eso: { check: "Check", checkAgain: "Check again", next: "Continue", finish: "Finish session", listen: "Listen", playing: "Playing…", replay: "Replay", retryAudio: "Try again", success: "Great work!", retry: "Almost.", error: "Let’s review it.", guide: "Quick tip", support: "Read · Respond · Improve" }
    };
    return copies[band] || copies.p56;
  }

  function render(container, exercise, options) {
    options = options || {};
    const band = options.stage || "p56";
    const secondary = band === "eso";
    const experience = options.experience || {};
    const ui = interfaceCopy(band);
    const guided = !!options.guided;
    if (guided && window.IL_ADAPTACION) exercise = window.IL_ADAPTACION.simplify(exercise, true);
    container.innerHTML = "";
    const visualCoverage = visuals() && visuals().validateExercise(exercise);
    if (visualCoverage && !visualCoverage.valid) {
      const unavailable = el("div", "il-state");
      unavailable.appendChild(el("h2", "", secondary ? "Illustration unavailable" : "Ilustración pendiente"));
      unavailable.appendChild(el("p", "", secondary
        ? "This visual activity is not ready yet. Choose another activity."
        : "Esta actividad visual todavía no tiene todas sus ilustraciones preparadas."));
      container.appendChild(unavailable);
      if (window.console && console.warn) console.warn("[Interlanguage] Cobertura visual incompleta", exercise.id, visualCoverage.missing);
      return { focus: () => unavailable.focus(), destroy: () => {} };
    }
    const templateFactory = TEMPLATES[exercise.tipo];
    if (!templateFactory) {
      const unavailable = el("div", "il-state");
      unavailable.appendChild(el("h2", "", "Actividad no disponible"));
      unavailable.appendChild(el("p", "", "Este tipo de ejercicio todavía no está preparado."));
      container.appendChild(unavailable);
      return { focus: () => unavailable.focus(), destroy: () => {} };
    }

    const root = el("article", "eng-card eng-card--" + band);
    root.dataset.exerciseBand = band;
    root.dataset.exerciseType = exercise.tipo || "unknown";
    root.dataset.exerciseSkill = exercise.habilidad || "vocabulary";
    root.dataset.hasAudio = exercise.audio ? "true" : "false";
    root.dataset.guided = guided ? "true" : "false";
    root.style.setProperty("--eng-touch-size", (experience.touchSize || 48) + "px");
    root.setAttribute("aria-labelledby", "exerciseInstruction");
    root.appendChild(exerciseContext(exercise, band));

    const header = el("div", "eng-question-header");
    const instruction = el("h1", "eng-instruction", instructionFor(exercise, options.stage));
    instruction.id = "exerciseInstruction"; header.appendChild(instruction);
    const audioText = exercise.tipo === "hablar" ? "" : (exercise.audio || "");
    if (audioText) {
      const audio = el("button", "eng-audio"); audio.type = "button";
      audio.innerHTML = '<span class="eng-audio-waves" aria-hidden="true"><i></i><i></i><i></i></span>' + icon("speaker") + '<span class="eng-audio-label">' + ui.listen + '</span>';
      audio.setAttribute("aria-label", secondary ? "Listen to the exercise audio" : ui.listen + " audio del ejercicio");
      audio.setAttribute("aria-pressed", "false");
      const exerciseAudio = audioSettings();
      if (!exerciseAudio.sound) {
        audio.disabled = true;
        audio.title = secondary ? "Enable sound in Profile to play this audio." : "Activa el sonido en Perfil para escuchar este audio.";
        audio.setAttribute("aria-label", secondary ? "Audio disabled. Enable it in Profile." : "Audio desactivado. Actívalo en Perfil.");
        audio.querySelector(".eng-audio-label").textContent = secondary ? "Audio disabled" : "Audio desactivado";
      }
      audio.addEventListener("click", () => speak(audioText, {
        onStart: () => {
          audio.classList.add("is-playing"); audio.setAttribute("aria-pressed", "true");
          audio.querySelector(".eng-audio-label").textContent = ui.playing;
        },
        onEnd: () => {
          audio.classList.remove("is-playing"); audio.setAttribute("aria-pressed", "false");
          audio.querySelector(".eng-audio-label").textContent = ui.replay;
        },
        onDisabled: () => {
          audio.classList.remove("is-playing"); audio.setAttribute("aria-pressed", "false");
          audio.querySelector(".eng-audio-label").textContent = "Audio desactivado";
        },
        onError: () => {
          audio.classList.remove("is-playing"); audio.setAttribute("aria-pressed", "false");
          audio.querySelector(".eng-audio-label").textContent = ui.retryAudio;
          if (root.isConnected && window.ILToast) window.ILToast("No hemos podido reproducir el audio.", { type: "err" });
        }
      }));
      header.appendChild(audio);
      if (exercise.audio_auto && exerciseAudio.sound && exerciseAudio.autoplayAudio) setTimeout(() => audio.click(), 350);
    }
    root.appendChild(header);

    if (guided) {
      const guidance = el("aside", "eng-guidance");
      guidance.setAttribute("aria-label", ui.guide);
      const guidanceIcon = el("span", "eng-guidance__icon");
      guidanceIcon.setAttribute("aria-hidden", "true"); guidanceIcon.innerHTML = icon("info");
      const guidanceCopy = el("span", "eng-guidance__copy");
      guidanceCopy.appendChild(el("strong", "", ui.guide));
      guidanceCopy.appendChild(el("span", "", window.IL_ADAPTACION
        ? window.IL_ADAPTACION.hint(exercise, band)
        : (secondary ? "Focus on the key clue before you answer." : "Fíjate en la pista principal antes de responder.")));
      guidance.append(guidanceIcon, guidanceCopy); root.appendChild(guidance);
    }

    const body = el("div", "eng-body"); root.appendChild(body);
    const footer = el("div", "eng-footer");
    const feedback = el("div", "eng-feedback");
    feedback.id = "exerciseFeedback";
    feedback.setAttribute("role", "status"); feedback.setAttribute("aria-live", "polite");
    const action = el("button", "btn btn-primary btn-block", ui.check); action.type = "button"; action.disabled = true;
    footer.appendChild(feedback); footer.appendChild(action); root.appendChild(footer); container.appendChild(root);

    let state = "ready";
    let attempts = 0;
    let lastAnswer = "";
    let result = null;
    const signature = value => { try { return JSON.stringify(value); } catch (error) { return String(value); } };
    const template = templateFactory(body, exercise, () => {
      if (state === "resolved") return;
      const answered = template.isAnswered();
      const changed = signature(template.getAnswer()) !== lastAnswer;
      state = answered ? "selected" : "ready";
      action.disabled = !answered || (attempts === 1 && !changed);
    });

    function resolve(correct) {
      state = "resolved";
      result.final = true;
      template.reveal(result);
      template.setDisabled(true);
      action.disabled = false;
      if (options.lastOne) action.textContent = ui.finish;
      else action.innerHTML = ui.next + ' <span aria-hidden="true">→</span>';
      action.onclick = () => {
        state = "continuing"; action.disabled = true;
        if (typeof options.onNext === "function") options.onNext(result);
      };
      if (typeof options.onResult === "function") {
        options.onResult({
          id: exercise.id,
          type: exercise.tipo,
          correct: correct,
          attempt_no: attempts,
          hint_used: attempts > 1,
          points: correct ? 10 : 0,
          selectedLabel: result.selectedLabel,
          correctLabel: result.correctLabel,
          learnedExpressions: result.learnedExpressions || [],
          guided: guided
        });
      }
    }

    action.addEventListener("click", () => {
      if (state === "resolved" || state === "continuing" || action.disabled) return;
      state = "checking"; action.disabled = true; attempts += 1;
      result = template.evaluate();
      if (result.correct) {
        const successCopy = (exercise.feedback && exercise.feedback.correct) ||
          (result.correctLabel
            ? (secondary ? "The correct answer is “" : "La respuesta correcta es “") + result.correctLabel + "”."
            : (secondary ? "You solved the activity correctly." : "Has resuelto la actividad correctamente."));
        renderFeedback(feedback, "success", ui.success, successCopy, result.context);
        if (typeof options.onFeedback === "function") options.onFeedback("success");
        resolve(true);
      } else if (attempts === 1) {
        state = "retry"; lastAnswer = signature(template.getAnswer());
        template.reveal({ ...result, final: false }); template.setDisabled(false);
        const hint = (exercise.feedback && exercise.feedback.incorrect) || (secondary ? "Check your answer and try once more." : "Revisa tu respuesta y prueba una vez más.");
        renderFeedback(feedback, "retry", ui.retry, hint, "");
        if (typeof options.onFeedback === "function") options.onFeedback("retry");
        action.textContent = ui.checkAgain; action.disabled = true;
        setTimeout(() => template.focus(), 0);
      } else {
        const solution = result.correctLabel
          ? (secondary ? "The correct answer is “" : "La respuesta correcta es “") + result.correctLabel + "”."
          : (secondary ? "Review the solution before you continue." : "Revisa la solución antes de continuar.");
        renderFeedback(feedback, "error", ui.error, solution + (result.explanation ? " " + result.explanation : ""), result.context);
        if (typeof options.onFeedback === "function") options.onFeedback("error");
        resolve(false);
      }
    });

    root.addEventListener("keydown", event => {
      if (event.key !== "Enter" || event.target.matches("button,input,textarea")) return;
      if (!action.disabled) { event.preventDefault(); action.click(); }
    });

    if (template.isAnswered()) { state = "selected"; action.disabled = false; }
    return {
      focus: () => {
        if (band === "p12") {
          instruction.tabIndex = -1;
          instruction.focus({ preventScroll: true });
        } else template.focus();
      },
      destroy: () => { template.destroy(); if (window.speechSynthesis) window.speechSynthesis.cancel(); },
      getState: () => state
    };
  }

  window.IL_ENGINE = { render, speak, instructionFor, visualFor: illustrationFor, _templates: TEMPLATES, _norm: norm };
})();
