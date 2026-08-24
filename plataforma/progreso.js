(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const DAYS = ["L", "M", "X", "J", "V", "S", "D"];
  const DAY_NAMES = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  let snapshot = null;
  let ageMode = "neutral";
  let ageBand = "neutral";
  let currentUser = "";

  function icon(name) { return window.ILIcon ? window.ILIcon(name) : ""; }
  function firstName(profile) { return String(profile.full_name || "").trim().split(/\s+/)[0] || "paso a paso"; }
  function valueText(value, suffix) { return value == null ? "—" : String(value) + (suffix || ""); }
  function metricElement(label, value, iconName, unavailableLabel) {
    const item = document.createElement("div"); item.className = "learning-metric" + (value == null ? " is-unavailable" : "");
    const visual = document.createElement("span"); visual.className = "learning-metric__icon"; visual.innerHTML = icon(iconName);
    const number = document.createElement("strong"); number.textContent = value == null ? "—" : value;
    const copy = document.createElement("span"); copy.textContent = value == null ? (unavailableLabel || "Sin datos suficientes") : label;
    item.append(visual, number, copy); return item;
  }

  function renderHeader(data) {
    $("studentName").textContent = firstName(data.profile) + (ageBand === "p12" ? "!" : "");
    $("studentLevel").textContent = (data.placement && data.placement.placed ? data.placement.label : data.profile.level) || "Nivel por descubrir";
    $("studentSessions").textContent = data.lessons;
    if (ageBand === "p12") {
      $("progressEyebrow").textContent = "MIS AVANCES";
      $("progressTitleLead").textContent = "¡Mira cuánto avanzas,";
      $("progressSubtitle").textContent = "Cada día sabes un poquito más.";
    } else if (ageBand === "p34") {
      $("progressEyebrow").textContent = "TUS AVANCES";
      $("progressTitleLead").textContent = "Tu progreso,";
      $("progressSubtitle").textContent = "Esto es lo que has conseguido esta semana.";
    } else if (ageMode === "secondary") {
      $("progressEyebrow").textContent = "LEARNING OVERVIEW";
      $("progressTitleLead").textContent = "Tu progreso,";
      $("progressSubtitle").textContent = "Revisa tu práctica, tus habilidades y el próximo objetivo.";
    }
    // La identidad del alumno tiene prioridad; el personaje genérico queda para apoyos puntuales.
    if (ageBand === "p12" && window.ILWorldVisual && window.ILProfileSettings) {
      const pm = $("progressMascot");
      if (pm) pm.innerHTML = ILWorldVisual.avatar(ILProfileSettings.getActive(), data || {}, { compact:true });
    }
  }

  // Escena decorativa por edad detrás del héroe de la semana (solo tokens --il-*).
  function weekScene(band) {
    if (band === "p12") return '<svg viewBox="0 0 600 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">'
      + '<path d="M0 260v-38c88-18 158 10 250-2s184-18 350 8v30Z" fill="color-mix(in srgb,var(--il-success) 24%,var(--il-surface))" opacity=".55"/>'
      + '<path d="M0 260v-18c110-12 210 8 320-2s180-8 280 4v16Z" fill="color-mix(in srgb,var(--il-success) 36%,var(--il-surface))" opacity=".42"/></svg>';
    if (band === "p34") return '<svg viewBox="0 0 600 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">'
      + '<path d="M390 260 500 150l42 48 34-30 92 92Z" fill="color-mix(in srgb,var(--il-success) 18%,var(--il-surface))" opacity=".38"/>'
      + '<path d="M500 150V126" stroke="var(--il-primary)" stroke-width="3" stroke-linecap="round" opacity=".5"/><path d="M500 126l20 6-20 8Z" fill="var(--il-secondary)" opacity=".65"/></svg>';
    // 10-11 / ESO: lineas concentricas sutiles en la esquina, sobre el navy (sobrio).
    const s = "color-mix(in srgb,var(--il-on-dark) 12%,transparent)";
    return '<svg viewBox="0 0 600 260" preserveAspectRatio="xMaxYMax slice" aria-hidden="true"><g fill="none" stroke="' + s + '" stroke-width="2"><circle cx="558" cy="262" r="66"/><circle cx="558" cy="262" r="116"/><circle cx="558" cy="262" r="166"/></g></svg>';
  }
  function renderWeek(data) {
    const week = data.week; const count = Math.min(week.count, week.goal); const today = (new Date().getDay() + 6) % 7; const done = new Set(week.practiced);
    $("weekCount").textContent = count; $("weekGoal").textContent = week.goal;
    const percent = week.goal ? Math.min(100, count / week.goal * 100) : 0;
    $("weekBar").style.setProperty("--il-week-progress", percent + "%");
    $("weekBar").setAttribute("aria-valuemax", week.goal); $("weekBar").setAttribute("aria-valuenow", count); $("weekBar").setAttribute("aria-label", count + " de " + week.goal + " sesiones esta semana");
    const container = $("weekDays"); container.replaceChildren();
    DAYS.forEach((letter, index) => {
      const completed = done.has(index); const state = completed ? "completed" : (index === today ? "today" : (index < today ? "pending" : "future"));
      const day = document.createElement("div"); day.className = "week-day is-" + state + (index === today ? " is-today" : "");
      const label = document.createElement("span"); label.className = "week-day__label"; label.textContent = letter;
      const dot = document.createElement("span"); dot.className = "week-day__dot"; dot.innerHTML = completed ? icon("check") : (ageBand === "p34" ? "○" : String(index + 1));
      dot.setAttribute("aria-label", DAY_NAMES[index] + ": " + ({ completed: index === today ? "completado, hoy" : "completado", today: "hoy", pending: "pendiente", future: "futuro" })[state]);
      day.append(label, dot); container.appendChild(day);
    });
    $("weekMinutes").textContent = valueText(data.minutesWeek);
    $("weekCompactMinutes").textContent = valueText(data.minutesWeek);
    $("weekActiveDays").textContent = Math.min(week.goal, (week.practiced || []).length);
    const comparison = $("weekComparison"); comparison.classList.toggle("is-positive", data.weekComparison.tone === "positive"); comparison.lastElementChild.textContent = data.weekComparison.text;
    $("streakNow").textContent = data.streak; $("streakBest").textContent = data.bestStreak;
    // Pluralización correcta (1 día / 2 días) en todos los modos
    const nowStrong = $("streakNow").parentElement; if (nowStrong && nowStrong.lastChild) nowStrong.lastChild.textContent = data.streak === 1 ? " día" : " días";
    const bestSmall = $("streakBest").parentElement; if (bestSmall && bestSmall.lastChild) bestSmall.lastChild.textContent = data.bestStreak === 1 ? " día" : " días";
    renderNextStamp(data.stamps.next);
    const scene = $("weekScene"); if (scene) scene.innerHTML = weekScene(ageBand);
  }

  function remainingCopy(stampData) {
    if (!stampData) return "Has completado todos los sellos disponibles.";
    const remaining = Math.max(0, stampData.target - stampData.current);
    if (stampData.id === "word-collector") return "Te faltan " + remaining + " palabras para conseguirlo.";
    if (stampData.id === "listening-star") return "Te faltan " + remaining + " aciertos de listening.";
    if (stampData.id === "comeback") return stampData.requirement;
    return "Te " + (remaining === 1 ? "falta 1 sesión" : "faltan " + remaining + " sesiones") + ".";
  }
  function renderNextStamp(stampData) {
    if (!stampData) {
      $("nextStampTitle").textContent = "Pasaporte completo";
      $("nextStampCopy").textContent = remainingCopy(null);
      $("nextStampCount").textContent = "Completo";
      $("nextStampRemaining").textContent = "Has conseguido todos los sellos disponibles.";
      return;
    }
    $("nextStampTitle").textContent = stampData.name;
    $("nextStampCopy").textContent = (ageBand === "p12" || ageBand === "p34") ? stampData.requirement : remainingCopy(stampData);
    $("nextStampCount").textContent = stampData.current + " / " + stampData.target;
    $("nextStampRemaining").textContent = remainingCopy(stampData);
    const ps = document.querySelector(".passport-stamp"); if (ps && window.ILVisual) ps.innerHTML = ILVisual.stamp(stampData.id, { locked: false });
    const bar = $("nextStampProgress"); bar.style.setProperty("--il-stamp-progress", stampData.percent + "%"); bar.setAttribute("aria-valuemax", stampData.target); bar.setAttribute("aria-valuenow", stampData.current); bar.setAttribute("aria-label", "Progreso hacia " + stampData.name + ": " + stampData.current + " de " + stampData.target);
  }

  function renderLearning(data) {
    const youngPrimary = ageBand === "p12" || ageBand === "p34";
    const metrics = $("learningMetrics"); metrics.replaceChildren();
    const skills = $("skillsList"); skills.replaceChildren();
    let skillsToShow = [];
    if (!youngPrimary) {
      metrics.replaceChildren(
        metricElement("sesiones completadas", data.lessons, "plane"),
        metricElement("minutos practicados", data.minutesTotal, "clock"),
        metricElement("palabras aprendidas", data.wordsLearned, "books"),
        metricElement("expresiones dominadas", data.expressionsMastered, "chat"),
        metricElement("de precisión", data.accuracy == null ? null : data.accuracy + "%", "target"),
        metricElement("temas completados", data.topicsCompleted, "flag")
      );
      skillsToShow = data.skills;
      skillsToShow.forEach(skill => {
        const row = document.createElement("div"); row.className = "skill-row" + (skill.percent == null ? " is-unavailable" : "");
        const visual = document.createElement("span"); visual.className = "skill-icon"; visual.innerHTML = icon(skill.icon);
        const body = document.createElement("div");
        const copy = document.createElement("div"); copy.className = "skill-copy"; const name = document.createElement("strong"); name.textContent = skill.label; const note = document.createElement("span"); note.textContent = skill.percent == null ? "Sigue practicando" : "Progreso observado"; copy.append(name, note);
        const track = document.createElement("div"); track.className = "skill-track"; track.setAttribute("role", "progressbar"); const fill = document.createElement("span"); track.appendChild(fill);
        if (skill.percent == null) { track.setAttribute("aria-label", skill.label + ": sin datos suficientes"); }
        else { track.style.setProperty("--il-skill-progress", skill.percent + "%"); track.setAttribute("aria-valuemin", "0"); track.setAttribute("aria-valuemax", "100"); track.setAttribute("aria-valuenow", skill.percent); track.setAttribute("aria-label", skill.label + ": " + skill.percent + "%"); }
        body.append(copy, track); const value = document.createElement("span"); value.className = "skill-value"; value.textContent = skill.percent == null ? "Sin datos" : skill.percent + "%";
        row.append(visual, body, value); skills.appendChild(row);
      });
    }
    const phrases = $("phraseList"); phrases.replaceChildren();
    if (!data.phrases.length) { const empty = document.createElement("p"); empty.className = "phrase-empty"; empty.textContent = "Tus primeras expresiones están muy cerca. Sigue con tu próxima misión."; phrases.appendChild(empty); }
    else data.phrases.forEach(text => { const phrase = document.createElement("p"); phrase.className = "phrase"; phrase.textContent = text; phrases.appendChild(phrase); });
    $("reinforceTitle").textContent = data.reinforce.skill; $("reinforceCopy").textContent = data.reinforce.description; $("reinforceCta").href = data.reinforce.href; $("reinforceCta").textContent = "Practicar " + data.reinforce.skill.toLowerCase();
    const reinforce = document.querySelector(".reinforce-panel");
    if (reinforce) reinforce.hidden = !youngPrimary && ageBand === "p34" && !data.isDemo && skillsToShow.length === 0;
  }

  function progressCopy(stampData) {
    if (stampData.current == null) return "Disponible cuando haya datos suficientes.";
    if (stampData.unlocked) return "Conseguido";
    return stampData.current + " de " + stampData.target;
  }
  // Contexto para el catálogo unificado de achievements, derivado del snapshot
  // (sin tocar almacenamiento): reutiliza las métricas ya calculadas de los sellos.
  function achievementCtx(data) {
    const items = (data.stamps && data.stamps.items) || [];
    const find = id => items.filter(x => x.id === id)[0];
    const focus = find("morning-explorer") || find("weekend-planner");
    const listening = find("listening-star");
    const comebackItem = find("comeback");
    return {
      lessons: data.lessons || 0, streak: data.streak || 0, prevBest: data.bestStreak || 0,
      weekCount: (data.week && data.week.count) || 0, weekGoal: (data.week && data.week.goal) || 5,
      wordsLearned: data.wordsLearned || 0,
      focusMissions: focus ? (focus.current || 0) : 0,
      skillCorrect: { listening: listening ? (listening.current || 0) : 0 },
      mastery: {},
      comeback: !!(comebackItem && comebackItem.unlocked),
      earned: (window.ILAchievements ? window.ILAchievements.earned(currentUser) : [])
    };
  }
  const ACH_FAMILY_LABEL = { constancia: "Constancia", learning: "Aprendizaje", skills: "Habilidades", mastery: "Dominio", special: "Especiales" };

  // Colección unificada de logros, agrupada por familia (§1-2). Solo lectura.
  function renderStamps(data) {
    const A = window.IL_ACHIEVEMENTS;
    const grid = $("stampGrid");
    if (!A) return renderStampsLegacy(data);
    grid.classList.add("is-achievements"); grid.replaceChildren();
    const band = (window.IL_ETAPA && IL_ETAPA.current() && IL_ETAPA.current().band) || "neutral";
    const ctx = achievementCtx(data);
    const list = A.availableFor(band);
    let unlocked = 0; const doneNow = [];
    A.FAMILIES.forEach(fam => {
      const inFam = list.filter(i => i.family === fam);
      if (!inFam.length) return;
      const prog = inFam.map(item => ({ item: item, p: A.progressOf(item.id, ctx) }));
      const doneInFam = prog.filter(x => x.p.done).length;

      const section = document.createElement("div"); section.className = "ach-family";
      const head = document.createElement("div"); head.className = "ach-family__head";
      const heading = document.createElement("p"); heading.className = "ach-family__title"; heading.textContent = ACH_FAMILY_LABEL[fam] || fam;
      const rule = document.createElement("span"); rule.className = "ach-family__rule"; rule.setAttribute("aria-hidden", "true");
      const tally = document.createElement("span"); tally.className = "ach-family__tally"; tally.textContent = doneInFam + "/" + inFam.length;
      head.append(heading, rule, tally); section.appendChild(head);

      const row = document.createElement("div"); row.className = "ach-family__grid";
      prog.forEach(({ item, p }) => {
        const done = p.done; if (done) { unlocked++; doneNow.push(item.id); }
        const state = done ? "earned" : ((p.current > 0 && !item.momentary) ? "progress" : "locked");
        const card = document.createElement("div"); card.className = "ach-card is-" + state;
        card.title = item.description;

        const visual = document.createElement("span"); visual.className = "ach-card__visual";
        visual.innerHTML = window.ILVisual ? ILVisual.stamp(item.visual, { state: state }) : icon("stamp");

        const status = document.createElement("span"); status.className = "ach-card__status";
        if (done) status.innerHTML = icon("check");
        status.appendChild(document.createTextNode(done ? " Conseguido" : state === "progress" ? "En progreso" : "Bloqueado"));

        const title = document.createElement("h3"); title.className = "ach-card__title"; title.textContent = A.displayName(item, band);

        const bar = document.createElement("span"); bar.className = "ach-card__bar"; bar.style.setProperty("--il-stamp-progress", (p.percent || 0) + "%"); bar.appendChild(document.createElement("span"));

        const value = document.createElement("span"); value.className = "ach-card__value";
        value.textContent = done ? "Conseguido" : (item.momentary ? "Sello especial" : (p.current + " / " + p.target));

        card.append(visual, status, title, bar, value); row.appendChild(card);
      });
      section.appendChild(row); grid.appendChild(section);
    });
    $("stampsUnlocked").textContent = unlocked;
    // Persiste como conseguidos todos los logros cuyo criterio REAL ya se cumple
    // (cierra el hueco: los de habilidad/vocabulario no se ganaban en el fin de misión).
    if (window.ILAchievements && currentUser && doneNow.length) window.ILAchievements.add(currentUser, doneNow);
  }

  function renderStampsLegacy(data) {
    $("stampsUnlocked").textContent = data.stamps.unlocked;
    const grid = $("stampGrid"); grid.replaceChildren();
    data.stamps.items.forEach(stampData => {
      const button = document.createElement("button"); button.type = "button"; button.className = "stamp-card" + (stampData.unlocked ? " is-unlocked" : " is-locked"); button.setAttribute("aria-label", stampData.name + ". " + progressCopy(stampData));
      const top = document.createElement("span"); top.className = "stamp-card__top";
      const visual = document.createElement("span"); visual.className = "stamp-card__visual"; visual.innerHTML = window.ILVisual ? ILVisual.stamp(stampData.id, { locked: !stampData.unlocked }) : icon(stampData.icon);
      const state = document.createElement("span"); state.className = "stamp-card__state"; state.innerHTML = icon(stampData.unlocked ? "check" : "lock"); state.appendChild(document.createTextNode(stampData.unlocked ? " Conseguido" : " En progreso")); top.append(visual, state);
      const title = document.createElement("h3"); title.textContent = stampData.name; const description = document.createElement("p"); description.textContent = stampData.description;
      const progress = document.createElement("span"); progress.className = "stamp-card__progress"; const fill = document.createElement("span"); progress.style.setProperty("--il-stamp-progress", (stampData.percent || 0) + "%"); progress.appendChild(fill);
      const count = document.createElement("span"); count.className = "stamp-card__count"; count.textContent = progressCopy(stampData);
      button.append(top, title, description, progress, count); button.addEventListener("click", () => openStamp(stampData)); grid.appendChild(button);
    });
  }

  function openStamp(stampData) {
    const dialog = $("stampDialog"); $("stampDialogState").textContent = stampData.unlocked ? "Sello conseguido" : "Sello en progreso"; $("stampDialogTitle").textContent = stampData.name; $("stampDialogDescription").textContent = stampData.description; $("stampDialogRequirement").textContent = stampData.requirement; $("stampDialogProgressCopy").textContent = progressCopy(stampData);
    const visual = $("stampDialogVisual"); visual.innerHTML = window.ILVisual ? ILVisual.stamp(stampData.id, { locked: !stampData.unlocked }) : icon(stampData.icon); visual.classList.toggle("is-unlocked", stampData.unlocked);
    const progress = $("stampDialogProgress"); progress.style.setProperty("--il-stamp-progress", (stampData.percent || 0) + "%"); progress.setAttribute("aria-valuemin", "0"); progress.setAttribute("aria-valuemax", stampData.target); if (stampData.current != null) progress.setAttribute("aria-valuenow", stampData.current); else progress.removeAttribute("aria-valuenow");
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
  }

  // p12 y p34 comparten primary-young, pero su jerarquía y tono dependen de la banda real.
  function applyPrimaryBand(data) {
    const rename = (id, label) => { const tab = $(id); const span = tab && tab.querySelector("span:last-child"); if (span) span.textContent = label; };
    if (ageBand === "p12") {
      rename("tab-week", "Mi semana"); rename("tab-learning", "Lo que sé"); rename("tab-stamps", "Mis sellos");
    } else {
      rename("tab-week", "Esta semana"); rename("tab-learning", "Mi aprendizaje"); rename("tab-stamps", "Logros");
    }

    const state = ILProgressData.weeklyPresentation(data.week, ageBand);
    const weekTitle = $("weekTitle"); if (weekTitle) weekTitle.textContent = ageBand === "p12" ? state.title : "Esta semana";
    const strong = document.querySelector("#panel-week .section-heading--inverse strong");
    if (strong) strong.textContent = state.countLabel + (state.complete && ageBand === "p12" ? " ✓" : "");
    $("weekPrimaryMessage").textContent = state.message;

    const streakItem = document.querySelector(".consistency-item");
    const streakLabel = streakItem && streakItem.querySelector("p");
    if (streakLabel) streakLabel.textContent = "Tu ritmo";
    const streakStrong = streakItem && streakItem.querySelector("strong");
    if (streakStrong) streakStrong.textContent = data.streak >= 5 ? "¡Qué buena constancia!" : data.streak >= 2 ? "¡Sigues avanzando!" : data.streak === 1 ? "¡Buen comienzo!" : "Tu camino empieza hoy";
    const streakSupport = $("streakSupport");
    if (streakSupport) streakSupport.textContent = "Cada misión hace crecer tu recorrido.";

    const action = ILProgressData.contextualAction(data, ageBand);
    const cta = $("contextualProgressCta");
    cta.textContent = action.label + " →";
    cta.href = action.href;
    if (action.tab) cta.dataset.openTab = action.tab;
    else delete cta.dataset.openTab;

    const learningIntro = document.querySelector(".learning-intro");
    if (learningIntro) learningIntro.dataset.band = ageBand;
    if (ageBand === "p12") {
      $("learningEyebrow").textContent = "LO QUE YA ES TUYO";
      $("learningTitle").textContent = "¡Mira todo lo que ya sabes!";
      $("learningSubtitle").textContent = "Estas palabras y frases ya forman parte de tu inglés.";
    } else {
      $("learningEyebrow").textContent = "MI APRENDIZAJE";
      $("learningTitle").textContent = "Lo que estoy aprendiendo";
      $("learningSubtitle").textContent = "Mis habilidades y el inglés que ya puedo utilizar.";
    }

    const phrasesTitle = $("phrasesTitle"); if (phrasesTitle) phrasesTitle.textContent = ageBand === "p12" ? "Mi inglés" : "Frases dominadas";
    const skillNames = { Listening: "Escucha", Vocabulary: "Vocabulario", Grammar: "Gramática", Reading: "Lectura", Writing: "Escritura", Speaking: "Habla" };
    $("reinforceTitle").textContent = skillNames[data.reinforce.skill] || data.reinforce.skill;
    $("reinforceCta").textContent = "Practicar ahora";
    if (!(data.phrases || []).length) { const empty = document.querySelector("#phraseList .phrase-empty"); if (empty) empty.textContent = "¡Tu primera frase está muy cerca!"; }
  }

  function loadWorldScript(src, globalName) {
    if (window[globalName]) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script"); script.src = src; script.async = false;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });
  }

  async function renderWorldPreview(data) {
    if (ageBand !== "p12" && ageBand !== "p34") return;
    const card = $("progressWorldCard");
    if (!card || !window.ILProfileSettings) return;
    try {
      await loadWorldScript("world-data.js?v=20260824b", "ILWorldData");
      await loadWorldScript("avatar-rig.js?v=20260814a", "ILAvatarRig");
      await loadWorldScript("world-visual.js?v=20260820c", "ILWorldVisual");
      const settings = ILProfileSettings.getActive();
      const progress = { lessons: data.lessons, streak: data.streak };
      const stampIds = ((data.stamps && data.stamps.items) || []).filter(item => item.unlocked).map(item => item.id);
      const context = ILWorldData.context(progress, stampIds, ageBand);
      const wanted = new Set(settings.activeWorldItems || []);
      const activeItems = ILWorldData.catalogFor(ageBand, "world")
        .filter(item => item.toggle === "world" && wanted.has(item.id) && ILWorldData.unlockStatus(item, context).unlocked)
        .map(item => item.id);
      const meta = ILWorldData.levelMeta(progress);
      $("progressWorldPreview").innerHTML = ILWorldVisual.scene(settings, progress, ageBand, { level: meta.level, activeItems: activeItems });
      card.hidden = false;
    } catch (error) {
      card.hidden = true;
    }
  }

  function activateTab(name, focus) {
    const tabs = Array.from(document.querySelectorAll("[role=tab]")); const target = tabs.find(tab => tab.dataset.tab === name) || tabs[0];
    tabs.forEach(tab => { const selected = tab === target; tab.setAttribute("aria-selected", String(selected)); tab.tabIndex = selected ? 0 : -1; $("panel-" + tab.dataset.tab).hidden = !selected; });
    history.replaceState(null, "", "#" + target.dataset.tab); if (focus) target.focus();
  }
  function setupTabs() {
    const tabs = Array.from(document.querySelectorAll("[role=tab]"));
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTab(tab.dataset.tab, false));
      tab.addEventListener("keydown", event => {
        let next = null; if (event.key === "ArrowRight") next = (index + 1) % tabs.length; if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length; if (event.key === "Home") next = 0; if (event.key === "End") next = tabs.length - 1;
        if (next != null) { event.preventDefault(); activateTab(tabs[next].dataset.tab, true); }
      });
    });
    document.querySelectorAll("[data-open-tab]").forEach(button => button.addEventListener("click", () => activateTab(button.dataset.openTab, true)));
    const initial = location.hash.slice(1);
    const defaultTab = ageMode === "secondary" ? "learning" : "week";
    activateTab(["week", "learning", "stamps"].includes(initial) ? initial : defaultTab, false);
  }

  function setupDialog() {
    const dialog = $("stampDialog"); $("stampDialogClose").addEventListener("click", () => dialog.close ? dialog.close() : dialog.removeAttribute("open"));
    dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  }

  (async function init() {
    try {
      const profile = await ILAuth.getProfile();
      if (!profile) { location.href = "index.html"; return; }
      if (profile.is_admin) { location.href = "admin.html"; return; }
      if (profile.must_change_password) { location.href = "cambiar-clave.html"; return; }
      ILProfileSettings.setActive(profile.username || "", profile.sex);
      currentUser = profile.username || "";
      IL_ETAPA.apply(profile); ageMode = IL_ETAPA.current().mode; ageBand = IL_ETAPA.current().band;
      snapshot = await ILProgressData.load(ILAuth, window.ILMission, { ageMode:ageMode, ageBand:ageBand }); if (!snapshot) throw new Error("No progress snapshot");
      renderHeader(snapshot); renderWeek(snapshot); renderLearning(snapshot); renderStamps(snapshot);
      if (ageBand === "p12" || ageBand === "p34") { applyPrimaryBand(snapshot); await renderWorldPreview(snapshot); }
      setupTabs(); setupDialog();
      if (snapshot.isDemo && sessionStorage.getItem("il_demo_strip_off") !== "1") $("demoStrip").hidden = false;
      $("demoClose").addEventListener("click", () => { $("demoStrip").hidden = true; sessionStorage.setItem("il_demo_strip_off", "1"); });
      if (window.ILLayout) window.ILLayout.mount();
      $("loading").hidden = true; $("app").classList.remove("hidden");
    } catch (error) {
      console.error("No se pudo cargar Progreso", error); $("loading").hidden = true; $("errorState").hidden = false;
    }
  })();
})();
