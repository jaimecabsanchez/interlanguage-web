(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const DAYS = ["L", "M", "X", "J", "V", "S", "D"];
  const DAY_NAMES = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  let snapshot = null;
  let ageMode = "primary-upper";

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
    $("studentName").textContent = firstName(data.profile) + (ageMode === "primary-young" ? "!" : "");
    $("studentLevel").textContent = (data.placement && data.placement.placed ? data.placement.label : data.profile.level) || "Nivel por descubrir";
    $("studentSessions").textContent = data.lessons;
    if (ageMode === "primary-young") {
      $("progressEyebrow").textContent = "MIS AVANCES";
      $("progressTitleLead").textContent = "¡Mira cuánto avanzas,";
      $("progressSubtitle").textContent = "Aquí puedes ver todo lo que ya estás aprendiendo.";
    } else if (ageMode === "secondary") {
      $("progressEyebrow").textContent = "LEARNING OVERVIEW";
      $("progressTitleLead").textContent = "Tu progreso,";
      $("progressSubtitle").textContent = "Revisa tu práctica, tus habilidades y el próximo objetivo.";
    }
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
      const dot = document.createElement("span"); dot.className = "week-day__dot"; dot.innerHTML = completed ? icon("check") : String(index + 1);
      dot.setAttribute("aria-label", DAY_NAMES[index] + ": " + ({ completed: index === today ? "completado, hoy" : "completado", today: "hoy", pending: "pendiente", future: "futuro" })[state]);
      day.append(label, dot); container.appendChild(day);
    });
    $("weekMinutes").textContent = valueText(data.minutesWeek);
    const comparison = $("weekComparison"); comparison.classList.toggle("is-positive", data.weekComparison.tone === "positive"); comparison.lastElementChild.textContent = data.weekComparison.text;
    $("streakNow").textContent = data.streak; $("streakBest").textContent = data.bestStreak;
    // Pluralización correcta (1 día / 2 días) en todos los modos
    const nowStrong = $("streakNow").parentElement; if (nowStrong && nowStrong.lastChild) nowStrong.lastChild.textContent = data.streak === 1 ? " día" : " días";
    const bestSmall = $("streakBest").parentElement; if (bestSmall && bestSmall.lastChild) bestSmall.lastChild.textContent = data.bestStreak === 1 ? " día" : " días";
    renderNextStamp(data.stamps.next);
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
    if (!stampData) { $("nextStampTitle").textContent = "Pasaporte completo"; $("nextStampCopy").textContent = remainingCopy(null); return; }
    $("nextStampTitle").textContent = stampData.name; $("nextStampCopy").textContent = remainingCopy(stampData);
    const ps = document.querySelector(".passport-stamp"); if (ps && window.ILVisual) ps.innerHTML = ILVisual.stamp(stampData.id, { locked: false });
    const bar = $("nextStampProgress"); bar.style.setProperty("--il-stamp-progress", stampData.percent + "%"); bar.setAttribute("aria-valuemax", stampData.target); bar.setAttribute("aria-valuenow", stampData.current); bar.setAttribute("aria-label", "Progreso hacia " + stampData.name + ": " + stampData.current + " de " + stampData.target);
  }

  function renderLearning(data) {
    const metrics = $("learningMetrics"); metrics.replaceChildren(
      metricElement("sesiones completadas", data.lessons, "plane"),
      metricElement("minutos practicados", data.minutesTotal, "clock"),
      metricElement("palabras aprendidas", data.wordsLearned, "books"),
      metricElement("expresiones dominadas", data.expressionsMastered, "chat"),
      metricElement("de precisión", data.accuracy == null ? null : data.accuracy + "%", "target"),
      metricElement("temas completados", data.topicsCompleted, "flag")
    );
    const skills = $("skillsList"); skills.replaceChildren();
    data.skills.forEach(skill => {
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
    const phrases = $("phraseList"); phrases.replaceChildren();
    if (!data.phrases.length) { const empty = document.createElement("p"); empty.className = "phrase-empty"; empty.textContent = "Tus primeras expresiones están muy cerca. Sigue con tu próxima misión."; phrases.appendChild(empty); }
    else data.phrases.forEach(text => { const phrase = document.createElement("p"); phrase.className = "phrase"; phrase.textContent = text; phrases.appendChild(phrase); });
    $("reinforceTitle").textContent = data.reinforce.skill; $("reinforceCopy").textContent = data.reinforce.description; $("reinforceCta").href = data.reinforce.href; $("reinforceCta").textContent = "Practicar " + data.reinforce.skill.toLowerCase();
  }

  function progressCopy(stampData) {
    if (stampData.current == null) return "Disponible cuando haya datos suficientes.";
    if (stampData.unlocked) return "Conseguido";
    return stampData.current + " de " + stampData.target;
  }
  function renderStamps(data) {
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

  // Primaria inicial: simplifica Progreso (los datos completos siguen en superior/ESO y en el panel de familias).
  function applyYoung(data) {
    const rename = (id, label) => { const tab = $(id); const span = tab && tab.querySelector("span:last-child"); if (span) span.textContent = label; };
    rename("tab-week", "Mi semana"); rename("tab-learning", "Lo que sé"); rename("tab-stamps", "Mis sellos");

    // MI SEMANA: recuento simple + una sola línea motivadora
    const week = data.week; const count = Math.min(week.count, week.goal);
    const weekTitle = $("weekTitle"); if (weekTitle) weekTitle.textContent = "Mi semana";
    const strong = document.querySelector("#panel-week .section-heading--inverse strong");
    if (strong) strong.textContent = count + " / " + week.goal + (count >= week.goal ? " ✓" : "");
    const primary = document.querySelector(".week-primary");
    if (primary && !$("weekYoungNote")) {
      const note = document.createElement("p"); note.id = "weekYoungNote"; note.className = "week-young-note";
      const rem = Math.max(0, week.goal - count);
      note.textContent = rem === 0 ? "¡Semana completa!" : ("¡Solo " + (rem === 1 ? "falta 1" : "faltan " + rem) + "!");
      primary.appendChild(note);
    }

    // RACHA: simple y bien pluralizada
    const streakStrong = document.querySelector(".consistency-item strong");
    if (streakStrong) streakStrong.textContent = data.streak + (data.streak === 1 ? " día seguido" : " días seguidos");

    // PRÓXIMO SELLO: contador simple + tarjeta pulsable → detalle
    const nextStamp = data.stamps.next; const aside = document.querySelector(".next-stamp");
    if (aside && nextStamp && !$("nextStampCount")) {
      const c = document.createElement("p"); c.id = "nextStampCount"; c.className = "next-stamp__count";
      c.textContent = nextStamp.current + " / " + nextStamp.target;
      aside.insertBefore(c, $("nextStampProgress"));
    }
    if (aside) {
      aside.classList.add("is-tappable"); aside.setAttribute("role", "link"); aside.tabIndex = 0;
      const go = () => activateTab("stamps", true);
      aside.addEventListener("click", go);
      aside.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); go(); } });
    }

    // LO QUE SÉ: resumen muy visual (palabras + frases) y frases con estado vacío positivo
    const panelLearning = $("panel-learning");
    if (panelLearning && !$("learningYoung")) {
      const words = data.wordsLearned || 0; const phraseCount = (data.phrases || []).length;
      const box = document.createElement("div"); box.id = "learningYoung"; box.className = "learning-young";
      box.innerHTML =
        '<div class="learning-young__stat"><strong>' + words + '</strong><span>palabras nuevas</span></div>' +
        '<div class="learning-young__stat"><strong>' + phraseCount + '</strong><span>' + (phraseCount === 1 ? "frase" : "frases") + '</span></div>';
      const layout = panelLearning.querySelector(".learning-layout"); panelLearning.insertBefore(box, layout);
    }
    const phrasesTitle = $("phrasesTitle"); if (phrasesTitle) phrasesTitle.textContent = "Ya sé decir";
    if (!(data.phrases || []).length) { const empty = document.querySelector("#phraseList .phrase-empty"); if (empty) empty.textContent = "¡Tu primera frase está muy cerca!"; }
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
      IL_ETAPA.apply(profile); ageMode = IL_ETAPA.current().mode; snapshot = await ILProgressData.load(ILAuth, window.ILMission, { ageMode: ageMode }); if (!snapshot) throw new Error("No progress snapshot");
      renderHeader(snapshot); renderWeek(snapshot); renderLearning(snapshot); renderStamps(snapshot); setupTabs(); setupDialog();
      if (ageMode === "primary-young") applyYoung(snapshot);
      if (snapshot.isDemo && sessionStorage.getItem("il_demo_strip_off") !== "1") $("demoStrip").hidden = false;
      $("demoClose").addEventListener("click", () => { $("demoStrip").hidden = true; sessionStorage.setItem("il_demo_strip_off", "1"); });
      if (window.ILLayout) window.ILLayout.mount(); $("loading").hidden = true; $("app").classList.remove("hidden");
    } catch (error) {
      console.error("No se pudo cargar Progreso", error); $("loading").hidden = true; $("errorState").hidden = false;
    }
  })();
})();
