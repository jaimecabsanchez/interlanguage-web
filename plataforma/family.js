(function () {
  "use strict";
  const $ = id => document.getElementById(id);

  function icon(name) { return window.ILIcon ? window.ILIcon(name) : ""; }
  function refreshOffline() { $("offline").hidden = navigator.onLine; }
  function localSparseOverride() {
    const host = location.hostname || "";
    const local = host === "localhost" || host === "127.0.0.1" || host === "" || host.endsWith(".local");
    return local && ILAuth.isDemo() && new URLSearchParams(location.search).get("familyState") === "new";
  }
  function emptyNode(message) {
    const node = document.createElement("div"); node.className = "family-empty"; node.textContent = message; return node;
  }
  function show(id) { $("loading").hidden = true; $(id).hidden = false; }

  function renderMetrics(model) {
    const grid = $("familyMetrics"); grid.replaceChildren();
    model.metrics.forEach(item => {
      const wrapper = document.createElement("div"); wrapper.className = "family-metric" + (item.value == null ? " is-unavailable" : "");
      const label = document.createElement("dt"); label.innerHTML = icon(item.icon); const labelText = document.createElement("span"); labelText.textContent = item.label; label.appendChild(labelText);
      const value = document.createElement("dd"); value.textContent = item.value == null ? "—" : String(item.value) + item.suffix;
      if (item.value == null) value.setAttribute("aria-label", item.label + ": todavía sin datos suficientes");
      wrapper.append(label, value); grid.appendChild(wrapper);
    });
  }

  function renderSessionChart(model) {
    const chart = $("sessionChart"); chart.replaceChildren();
    const history = model.consistency.history;
    if (!history.length) { chart.replaceWith(Object.assign(emptyNode("La evolución semanal aparecerá después de algunas sesiones más."), { id: "sessionChart" })); return; }
    const max = Math.max(5, ...history.map(item => item.sessions || 0));
    history.forEach((item, index) => {
      const column = document.createElement("div"); column.className = "session-column" + (index === history.length - 1 ? " is-current" : "");
      const track = document.createElement("div"); track.className = "session-bar-track";
      const bar = document.createElement("span"); bar.className = "session-bar"; bar.style.setProperty("--bar-height", Math.max(6, (item.sessions || 0) / max * 100) + "%");
      const value = document.createElement("strong"); value.textContent = item.sessions == null ? "—" : item.sessions; bar.appendChild(value); track.appendChild(bar);
      const label = document.createElement("small"); label.textContent = item.label; column.append(track, label); chart.appendChild(column);
    });
    chart.setAttribute("aria-label", history.map(item => item.label + ": " + item.sessions + " sesiones").join(". "));
    $("constancyMessage").textContent = model.consistency.message || "";
  }

  function renderContents(model) {
    const list = $("contentList"); list.replaceChildren();
    if (!model.contents.length) { list.appendChild(emptyNode("Los contenidos trabajados aparecerán cuando haya suficientes actividades registradas.")); return; }
    model.contents.forEach(item => {
      const article = document.createElement("article"); article.className = "content-item";
      const copy = document.createElement("div"); const title = document.createElement("h3"); title.textContent = item.title; const detail = document.createElement("p"); detail.textContent = item.detail; copy.append(title, detail);
      const tags = document.createElement("div"); tags.className = "content-tags"; tags.setAttribute("aria-label", "Habilidades: " + item.skills.join(", "));
      item.skills.forEach(skill => { const tag = document.createElement("span"); tag.className = "content-tag"; tag.textContent = skill; tags.appendChild(tag); });
      article.append(copy, tags); list.appendChild(article);
    });
  }

  function renderStrengths(model) {
    const list = $("strengthList"); list.replaceChildren();
    if (!model.strengths.length) { list.appendChild(emptyNode("Necesitamos más respuestas para identificar fortalezas con fiabilidad.")); $("strengthMessage").textContent = ""; return; }
    model.strengths.forEach(skill => {
      const item = document.createElement("div"); item.className = "family-skill";
      const copy = document.createElement("div"); copy.className = "family-skill__copy"; const name = document.createElement("strong"); name.textContent = skill.label; const value = document.createElement("span"); value.textContent = skill.percent + "%"; copy.append(name, value);
      const track = document.createElement("div"); track.className = "family-skill__track"; track.setAttribute("role", "progressbar"); track.setAttribute("aria-label", skill.label + ": " + skill.percent + "%"); track.setAttribute("aria-valuemin", "0"); track.setAttribute("aria-valuemax", "100"); track.setAttribute("aria-valuenow", skill.percent); const fill = document.createElement("span"); fill.style.setProperty("--skill-width", skill.percent + "%"); track.appendChild(fill);
      item.append(copy, track); list.appendChild(item);
    });
    $("strengthMessage").textContent = model.strengthMessage || "";
  }

  function renderReinforce(model) {
    if (!model.reinforce) {
      $("reinforceSkill").textContent = "Aún por descubrir"; $("reinforceCopy").textContent = "Algunas sesiones más nos permitirán recomendar un foco concreto."; $("reinforceLink").hidden = true; return;
    }
    $("reinforceSkill").textContent = model.reinforce.skill; $("reinforceCopy").textContent = model.reinforce.description; $("reinforceLink").href = model.reinforce.href; $("reinforceLink").hidden = false;
  }

  function renderEvolution(model) {
    const chart = $("evolutionChart"); chart.replaceChildren(); const history = model.evolution.history;
    if (!history.length) { chart.appendChild(emptyNode("Necesitamos al menos tres semanas con datos para mostrar una evolución fiable.")); $("evolutionMessage").textContent = ""; return; }
    const maxMinutes = Math.max(30, ...history.map(item => item.minutes || 0));
    history.forEach(item => {
      const row = document.createElement("div"); row.className = "evolution-row";
      const label = document.createElement("span"); label.className = "evolution-row__label"; label.textContent = item.label;
      row.append(label, evolutionValue(item.minutes, " min", item.minutes / maxMinutes * 100, "minutes"), evolutionValue(item.accuracy, "%", item.accuracy, "accuracy")); chart.appendChild(row);
    });
    $("evolutionMessage").textContent = model.evolution.message || "";
  }
  function evolutionValue(value, suffix, percent, kind) {
    const wrapper = document.createElement("div"); wrapper.className = "evolution-value" + (kind === "accuracy" ? " is-accuracy" : "");
    const text = document.createElement("b"); text.textContent = value == null ? "—" : value + suffix;
    const track = document.createElement("div"); track.className = "evolution-track"; const fill = document.createElement("span"); fill.style.setProperty("--trend-width", value == null ? "0%" : Math.max(0, Math.min(100, percent)) + "%"); track.appendChild(fill); wrapper.append(text, track); return wrapper;
  }

  function renderRecommendation(model) {
    const data = model.recommendation;
    if (!data) { $("recommendationName").textContent = "Seguir creando una base"; $("recommendationCopy").textContent = "Por ahora, la mejor recomendación es mantener sesiones breves y regulares."; $("recommendationAction").hidden = true; return; }
    $("recommendationName").textContent = data.title; $("recommendationCopy").textContent = data.description; $("recommendationAction").textContent = data.action; $("recommendationAction").href = data.href; $("recommendationAction").hidden = false;
  }

  function renderClassConnection(model) {
    const data = model.classConnection;
    if (!data) { $("classPeriod").textContent = "Conexión con clase"; $("classTitle").textContent = "Aún sin contenido vinculado"; $("classSkills").replaceChildren(); $("classMessage").textContent = "Cuando el contenido digital esté vinculado a la programación semanal, lo verás aquí."; return; }
    $("classPeriod").textContent = data.period; $("classTitle").textContent = data.topic; $("classSkills").replaceChildren();
    data.skills.forEach(skill => { const node = document.createElement("span"); node.className = "class-skill"; node.textContent = skill; $("classSkills").appendChild(node); });
    $("classMessage").textContent = data.message;
  }

  function render(model, isDemo) {
    $("familyTitle").textContent = model.title; $("previewPill").hidden = !isDemo; renderMetrics(model);
    $("headlineCopy").textContent = model.headline || model.lowDataMessage; $("familyHeadline").classList.toggle("is-low-data", !model.sufficientEvidence);
    $("lowData").hidden = model.sufficientEvidence; $("lowDataCopy").textContent = model.lowDataMessage || "";
    renderSessionChart(model); renderContents(model); renderStrengths(model); renderReinforce(model); renderEvolution(model); renderRecommendation(model); renderClassConnection(model);
  }

  addEventListener("online", refreshOffline); addEventListener("offline", refreshOffline); refreshOffline();
  $("familyRetry").addEventListener("click", () => location.reload());
  (async function init() {
    try {
      const profile = await ILAuth.getProfile();
      if (!profile) { show("accessState"); return; }
      if (profile.is_admin) { show("accessState"); return; }
      const snapshot = await ILProgressData.load(ILAuth, window.ILMission); if (!snapshot) { show("accessState"); return; }
      const model = ILFamilyData.build(snapshot, { forceSparse: localSparseOverride() });
      render(model, snapshot.isDemo); $("loading").hidden = true; $("dashboard").hidden = false;
    } catch (error) {
      console.error("No se pudo cargar el panel familiar", error); show("errorState");
    }
  })();
})();
