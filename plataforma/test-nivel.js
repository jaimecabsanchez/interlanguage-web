/* Interlanguage HOME · experiencia del punto de partida adaptativo. */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const stage = $("stage"), actions = $("actions"), next = $("nextButton"), unknown = $("unknownButton");
  let band = "neutral", profile = null, state = null, current = null, selected = null, startedAt = "", context = null, busy = false;

  function copy(key, params) { return ILCopy.placement(key, band, params); }
  function report(code, error) {
    if (window.ILObservability && ILObservability.report) ILObservability.report("technical_failure", error || code, { area:"placement", operation:code });
  }
  function node(tag, className, textValue) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (textValue != null) el.textContent = textValue;
    return el;
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  function levelFrom(value) {
    const match = String(value || "").match(/Pre-A1|A1|A2|B1/i);
    if (!match) return "A1";
    return match[0].toLowerCase() === "pre-a1" ? "Pre-A1" : match[0].toUpperCase();
  }
  function language() { return (band === "eso" || band === "p56") ? "en" : "es"; }
  function updateProgress() {
    const value = ILPlacementEngine.progress(state);
    const shown = Math.min(value.current + 1, value.max);
    $("progressWrap").hidden = false;
    $("progressLabel").textContent = copy("step", { current:shown, max:value.max });
    $("progressValue").textContent = Math.round(value.current / value.max * 100) + "%";
    $("progress").setAttribute("aria-valuemax", String(value.max));
    $("progress").setAttribute("aria-valuenow", String(value.current));
    $("progressFill").style.width = Math.round(value.current / value.max * 100) + "%";
  }
  function panel(modifier) { return node("div", "placement-panel" + (modifier ? " placement-panel--" + modifier : "")); }
  function intro() {
    clear(stage); stage.setAttribute("aria-busy", "false"); $("progressWrap").hidden = true; actions.hidden = true;
    const card = panel("intro");
    card.append(node("p", "placement-eyebrow", copy("eyebrow")), node("h1", "placement-title", copy("introTitle")), node("p", "placement-body", copy("introBody")));
    const start = node("button", "btn btn-primary placement-start", copy("start"));
    start.type = "button"; start.addEventListener("click", renderQuestion); card.append(start); stage.append(card); start.focus();
  }
  function markOption(index) {
    selected = index;
    stage.querySelectorAll(".placement-option").forEach(option => option.setAttribute("aria-pressed", String(Number(option.dataset.index) === index)));
    next.disabled = false;
  }
  function technicalSkip() {
    if (current && state.served.indexOf(current.id) < 0) submit({ technicalFailure:true });
  }
  function renderAudio(card) {
    if (!current.audio_text) return;
    const button = node("button", "placement-audio"); button.type = "button";
    const icon = node("span"); icon.innerHTML = ILIcon("speaker"); button.append(icon, node("span", "", copy("listen")));
    button.addEventListener("click", () => {
      if (busy) return;
      busy = true; button.dataset.playing = "true"; button.disabled = true;
      let settled = false;
      const done = () => { if (settled) return; settled = true; busy = false; button.disabled = false; button.dataset.playing = "false"; };
      const fail = error => { if (settled) return; done(); report("audio_unavailable", error); $("status").textContent = copy("audioError"); technicalSkip(); };
      const played = IL_ENGINE.playAudio("", current.audio_text, { onEnd:done, onError:fail, onDisabled:fail });
      if (!played) fail(new Error("audio_unavailable"));
    });
    card.append(button);
  }
  function renderQuestion() {
    if (!state || state.status !== "active") return finish();
    current = ILPlacementEngine.select(state, ILPlacementContent.ITEMS);
    if (!current) { state = ILPlacementEngine.noContent(state); return finish(); }
    selected = null; updateProgress(); clear(stage); stage.setAttribute("aria-busy", "false"); actions.hidden = false;
    unknown.textContent = copy("unknown"); next.textContent = copy("next"); next.disabled = true;
    const card = panel(), header = node("div", "placement-question-header");
    header.append(node("p", "placement-eyebrow", copy("eyebrow")), node("span", "placement-skill", ILCopy.skill(current.skill, band)));
    card.append(header, node("p", "placement-instruction", current.instruction[language()] || current.instruction.es));
    renderAudio(card); card.append(node("h1", "placement-prompt", current.prompt));
    const group = node("fieldset", "placement-options" + (current.interaction_type === "elegir_imagen" ? " placement-options--visual" : ""));
    group.setAttribute("aria-label", copy("choose"));
    current.options.forEach((option, index) => {
      const button = node("button", "placement-option");
      button.type = "button"; button.dataset.index = String(index); button.setAttribute("aria-pressed", "false");
      const choice = node("span", "placement-choice"); choice.setAttribute("aria-hidden", "true"); button.append(choice);
      if (option.visual) {
        const image = node("img", "placement-option-image"); image.src = option.visual; image.alt = ""; image.loading = "eager"; button.append(image);
      }
      button.append(node("span", "placement-option-text", option.text)); button.addEventListener("click", () => markOption(index)); group.append(button);
    });
    card.append(group); stage.append(card); stage.querySelector(".placement-option").focus();
  }
  function persist() { return ILPlacementSession.write(localStorage, context, state, { startedAt }); }
  function submit(response) {
    if (busy || !current) return;
    busy = true; state = ILPlacementEngine.submit(state, current, response); persist(); $("status").textContent = copy("saved");
    const delay = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220;
    window.setTimeout(() => { busy = false; renderQuestion(); }, delay);
  }
  function evidenceItems() {
    const ids = (state.responses || []).filter(row => row.evaluable).slice(-2).map(row => row.item_id);
    return ids.map(id => ILPlacementContent.ITEMS.find(item => item.id === id)).filter(Boolean);
  }
  async function finish() {
    if (!state || state.status !== "complete") return;
    clear(stage); actions.hidden = true; $("progressWrap").hidden = true; stage.setAttribute("aria-busy", "true");
    const loading = node("div", "placement-loading"); loading.append(node("span", "placement-loader"), node("p", "", copy("loading"))); stage.append(loading);
    const meta = ILPlacementSession.meta(state, { instrumentId:ILPlacementContent.INSTRUMENT_ID, instrumentVersion:ILPlacementContent.VERSION });
    let saved;
    try { saved = await ILAuth.savePlacement(state.result, meta); } catch (error) { report("save_result", error); saved = null; }
    if (!saved || !saved.ok) return fatal();
    ILPlacementSession.clear(localStorage, profile.username); clear(stage); stage.setAttribute("aria-busy", "false");
    const card = panel("result"), mark = node("div", "placement-result-mark"); mark.innerHTML = ILIcon("check"); card.append(mark);
    card.append(node("p", "placement-eyebrow", copy("eyebrow")), node("h1", "placement-title", copy("resultTitle")));
    card.append(node("div", "placement-level", copy("resultLevel", { level:saved.label || state.result })), node("p", "placement-body", copy("resultBody")));
    const evidence = evidenceItems();
    if (evidence.length) {
      const box = node("section", "placement-evidence"), list = node("ul"); box.append(node("h2", "", copy("seenTitle")));
      evidence.forEach(item => list.append(node("li", "", item.explanation[language()] || item.explanation.es))); box.append(list); card.append(box);
    }
    if (!saved.synced) card.append(node("p", "placement-sync", copy("pending")));
    const link = node("a", "btn btn-primary placement-result-action", copy("continue")); link.href = "inicio.html"; card.append(link); stage.append(card); link.focus();
  }
  function fatal() {
    clear(stage); stage.setAttribute("aria-busy", "false"); actions.hidden = true;
    const card = panel("intro"); card.append(node("h1", "placement-title", copy("unavailable")));
    const retry = node("button", "btn btn-primary placement-start", copy("retry")); retry.type = "button"; retry.addEventListener("click", () => location.reload()); card.append(retry); stage.append(card);
  }
  next.addEventListener("click", () => { if (selected != null) submit({ kind:"answer", choice:selected }); });
  unknown.addEventListener("click", () => submit({ kind:"unknown" }));

  (async function init() {
    try {
      profile = await ILAuth.getProfile(); if (!profile) { location.href = "index.html"; return; }
      if (profile.is_admin) { location.href = "admin.html"; return; }
      if (profile.must_change_password) { location.href = "cambiar-clave.html"; return; }
      band = IL_ETAPA.apply(profile) || "neutral";
      if (ILPlacementContent.BANDS.indexOf(band) < 0) { report("unknown_age_band", new Error(String(band))); band = "neutral"; document.body.dataset.stage = band; }
      document.documentElement.lang = band === "eso" ? "en" : "es"; $("loadingLabel").textContent = copy("loading");
      const query = new URLSearchParams(location.search);
      const demoRetest = ILAuth.isDemo && ILAuth.isDemo() && (query.get("placementDemo") === "1" || query.get("retest") === "1");
      const placement = await ILAuth.getPlacement(); if (placement.placed && !demoRetest) { location.href = "inicio.html"; return; }
      context = { username:profile.username, band, instrumentId:ILPlacementContent.INSTRUMENT_ID, instrumentVersion:ILPlacementContent.VERSION };
      const draft = ILPlacementSession.read(localStorage, context, (code, error) => report(code, error));
      startedAt = draft && draft.startedAt || new Date().toISOString();
      state = draft && draft.engineState || ILPlacementEngine.create({ band, seedCefr:levelFrom(profile.cefr || profile.level || profile.level_id) });
      if (draft) { $("status").textContent = copy("resume"); renderQuestion(); } else intro();
      if (window.ILLayout) ILLayout.mount();
    } catch (error) { report("initialise", error); fatal(); }
  })();
})();
