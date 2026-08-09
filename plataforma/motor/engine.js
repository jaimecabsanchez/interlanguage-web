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
  const disableAll = (host, disabled) => host.querySelectorAll("button,input,textarea,select")
    .forEach(control => { control.disabled = !!disabled; });

  function instructionFor(exercise, stage) {
    const variants = exercise.instructions || {};
    return variants[stage] || exercise.instruccion || "Completa la actividad.";
  }

  function speak(text, callbacks) {
    callbacks = callbacks || {};
    try {
      if (!("speechSynthesis" in window) || !text) {
        if (callbacks.onError) callbacks.onError();
        return null;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
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
    let selected = -1;
    let disabled = false;
    const wrap = el("div", "eng-options" + (withImage ? " has-image" : ""));

    function clearJudgement() {
      wrap.querySelectorAll(".eng-opt").forEach(option => {
        option.classList.remove("is-correct", "is-incorrect");
        option.querySelectorAll(".eng-state-icon").forEach(node => node.remove());
      });
    }
    options.forEach((option, index) => {
      const button = el("button", "eng-opt");
      button.type = "button";
      button.setAttribute("aria-pressed", "false");
      if (withImage && option.emoji) {
        const visual = el("span", "eng-option-visual", option.emoji);
        visual.setAttribute("aria-hidden", "true");
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
      state.setAttribute("aria-label", type === "correct" ? "Respuesta correcta" : "Respuesta incorrecta");
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
      focus: () => { const target = wrap.querySelector("button"); if (target) target.focus(); },
      destroy: () => {}
    };
  }

  TEMPLATES.elegir_imagen = (host, ex, onChange) => singleChoice(host, ex, true, onChange);
  TEMPLATES.elegir_texto = (host, ex, onChange) => singleChoice(host, ex, false, onChange);

  TEMPLATES.completar = (host, exercise, onChange) => {
    if (exercise.opciones && exercise.opciones.length) return singleChoice(host, exercise, false, onChange);
    const input = el("input", "eng-input");
    input.type = "text"; input.autocomplete = "off"; input.autocapitalize = "none";
    input.setAttribute("aria-label", "Escribe tu respuesta");
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
          solution.lastChild.textContent = "Respuesta correcta: " + result.correctLabel;
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
    line.setAttribute("aria-label", "Frase que estás formando");
    const bank = el("div", "eng-word-bank");
    host.appendChild(line); host.appendChild(bank);

    function redraw() {
      line.innerHTML = ""; bank.innerHTML = "";
      line.classList.remove("is-correct", "is-incorrect");
      answer.forEach((poolIndex, position) => {
        const chip = el("button", "eng-word is-placed", pool[poolIndex].word);
        chip.type = "button"; chip.disabled = disabled;
        chip.setAttribute("aria-label", "Quitar " + pool[poolIndex].word);
        chip.addEventListener("click", () => { if (!disabled) { answer.splice(position, 1); redraw(); onChange(); } });
        line.appendChild(chip);
      });
      if (!answer.length) line.appendChild(el("span", "eng-order-empty", "Selecciona las palabras en orden"));
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
        if (!result.correct && result.final) host.appendChild(el("p", "eng-solution", "Respuesta correcta: " + result.correctLabel));
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

    function redraw() {
      rows.innerHTML = ""; bank.innerHTML = "";
      rows.classList.remove("is-correct", "is-incorrect");
      pairs.forEach((pair, leftIndex) => {
        const row = el("button", "eng-match-row" + (selectedLeft === leftIndex ? " is-selected" : ""));
        row.type = "button"; row.disabled = disabled;
        row.setAttribute("aria-pressed", selectedLeft === leftIndex ? "true" : "false");
        row.appendChild(el("span", "eng-match-left", pair.a));
        const slot = el("span", "eng-match-slot" + (assignments[leftIndex] != null ? " is-filled" : ""), assignments[leftIndex] != null ? pairs[assignments[leftIndex]].b : "Sin pareja");
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
        const button = el("button", "eng-word", right.label); button.type = "button"; button.disabled = disabled;
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
        correctLabel: pairs.map(pair => pair.a + " — " + pair.b).join(", "),
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
    const card = el("div", "eng-speaking");
    const phrase = el("p", "eng-speaking-phrase", exercise.frase || ""); phrase.lang = "en";
    const note = el("p", "eng-speaking-note", "Escucha y repite a tu ritmo. En esta fase no evaluamos tu pronunciación.");
    const listen = el("button", "btn btn-ghost"); listen.type = "button";
    listen.innerHTML = icon("speaker") + "<span>Escuchar</span>";
    const setListenText = text => { const label = listen.querySelector("span"); if (label) label.textContent = text; };
    listen.addEventListener("click", () => speak(exercise.frase, {
      onStart: () => { setListenText("Reproduciendo…"); listen.setAttribute("aria-pressed", "true"); },
      onEnd: () => { setListenText("Repetir"); listen.setAttribute("aria-pressed", "false"); onChange(); },
      onError: () => { setListenText("Reintentar audio"); onChange(); }
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

  function renderFeedback(panel, type, title, message, context, points) {
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
    if (points) panel.appendChild(el("span", "eng-feedback-points", "+" + points + " puntos"));
  }

  function render(container, exercise, options) {
    options = options || {};
    container.innerHTML = "";
    const templateFactory = TEMPLATES[exercise.tipo];
    if (!templateFactory) {
      const unavailable = el("div", "il-state");
      unavailable.appendChild(el("h2", "", "Actividad no disponible"));
      unavailable.appendChild(el("p", "", "Este tipo de ejercicio todavía no está preparado."));
      container.appendChild(unavailable);
      return { focus: () => unavailable.focus(), destroy: () => {} };
    }

    const root = el("article", "eng-card");
    root.setAttribute("aria-labelledby", "exerciseInstruction");
    if (exercise.etiqueta) root.appendChild(el("div", "eng-label", exercise.etiqueta));

    const header = el("div", "eng-question-header");
    const instruction = el("h1", "eng-instruction", instructionFor(exercise, options.stage));
    instruction.id = "exerciseInstruction"; header.appendChild(instruction);
    const audioText = exercise.tipo === "hablar" ? "" : (exercise.audio || "");
    if (audioText) {
      const audio = el("button", "eng-audio"); audio.type = "button";
      audio.innerHTML = icon("speaker") + '<span class="eng-audio-label">Escuchar</span>';
      audio.setAttribute("aria-label", "Escuchar audio del ejercicio");
      audio.setAttribute("aria-pressed", "false");
      audio.addEventListener("click", () => speak(audioText, {
        onStart: () => {
          audio.classList.add("is-playing"); audio.setAttribute("aria-pressed", "true");
          audio.querySelector(".eng-audio-label").textContent = "Reproduciendo…";
        },
        onEnd: () => {
          audio.classList.remove("is-playing"); audio.setAttribute("aria-pressed", "false");
          audio.querySelector(".eng-audio-label").textContent = "Repetir";
        },
        onError: () => {
          audio.classList.remove("is-playing"); audio.setAttribute("aria-pressed", "false");
          audio.querySelector(".eng-audio-label").textContent = "Reintentar";
          if (root.isConnected && window.ILToast) window.ILToast("No hemos podido reproducir el audio.", { type: "err" });
        }
      }));
      header.appendChild(audio);
      if (exercise.audio_auto) setTimeout(() => audio.click(), 350);
    }
    root.appendChild(header);

    const body = el("div", "eng-body"); root.appendChild(body);
    const footer = el("div", "eng-footer");
    const feedback = el("div", "eng-feedback");
    feedback.setAttribute("role", "status"); feedback.setAttribute("aria-live", "polite");
    const action = el("button", "btn btn-primary btn-block", "Comprobar"); action.type = "button"; action.disabled = true;
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
      action.textContent = options.lastOne ? "Finalizar misión" : "Continuar";
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
          learnedExpressions: result.learnedExpressions || []
        });
      }
    }

    action.addEventListener("click", () => {
      if (state === "resolved" || state === "continuing" || action.disabled) return;
      state = "checking"; action.disabled = true; attempts += 1;
      result = template.evaluate();
      if (result.correct) {
        const successCopy = (exercise.feedback && exercise.feedback.correct) ||
          (result.correctLabel ? "La respuesta correcta es “" + result.correctLabel + "”." : "Has resuelto la actividad correctamente.");
        renderFeedback(feedback, "success", "¡Muy bien!", successCopy, result.context, 10);
        resolve(true);
      } else if (attempts === 1) {
        state = "retry"; lastAnswer = signature(template.getAnswer());
        template.reveal({ ...result, final: false }); template.setDisabled(false);
        const hint = (exercise.feedback && exercise.feedback.incorrect) || "Revisa tu respuesta y prueba una vez más.";
        renderFeedback(feedback, "retry", "Casi.", hint, "", 0);
        action.textContent = "Comprobar de nuevo"; action.disabled = true;
        setTimeout(() => template.focus(), 0);
      } else {
        const solution = result.correctLabel ? "La respuesta correcta es “" + result.correctLabel + "”." : "Revisa la solución antes de continuar.";
        renderFeedback(feedback, "error", "Vamos a verlo.", solution + (result.explanation ? " " + result.explanation : ""), result.context, 0);
        resolve(false);
      }
    });

    root.addEventListener("keydown", event => {
      if (event.key !== "Enter" || event.target.matches("button,input,textarea")) return;
      if (!action.disabled) { event.preventDefault(); action.click(); }
    });

    if (template.isAnswered()) { state = "selected"; action.disabled = false; }
    return {
      focus: () => template.focus(),
      destroy: () => { template.destroy(); if (window.speechSynthesis) window.speechSynthesis.cancel(); },
      getState: () => state
    };
  }

  window.IL_ENGINE = { render, speak, instructionFor, _templates: TEMPLATES, _norm: norm };
})();
