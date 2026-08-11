(function () {
  "use strict";

  const $ = id => document.getElementById(id);
  const TABS = ["avatar", "clothing", "accessory", "world"];
  const FEATURES = [
    { id:"base", label:"Base", labelEn:"Base" },
    { id:"face", label:"Rostro", labelEn:"Face" },
    { id:"skin", label:"Piel", labelEn:"Skin" },
    { id:"hair", label:"Pelo", labelEn:"Hair" },
    { id:"eyes", label:"Ojos", labelEn:"Eyes" },
    { id:"brows", label:"Cejas", labelEn:"Brows" },
    { id:"nose", label:"Nariz", labelEn:"Nose" },
    { id:"mouth", label:"Boca", labelEn:"Mouth" }
  ];
  const OPTIONS = {
    avatarBase:[["masculine","Masculino","Masculine"],["feminine","Femenino","Feminine"]],
    avatarFaceShape:[["oval","Ovalado","Oval"],["round","Redondo","Round"],["soft","Suave","Soft"],["angular","Angular","Angular"]],
    avatarHair:[["short","Corto","Short"],["waves","Ondulado","Wavy"],["curls","Rizado","Curly"],["long","Largo","Long"],["bob","Bob","Bob"],["coils","Bucles","Coils"],["fade","Degradado","Fade"],["braids","Trenzas","Braids"]],
    avatarEyeShape:[["almond","Almendrados","Almond"],["round","Redondos","Round"],["soft","Suaves","Soft"],["bright","Abiertos","Bright"]],
    avatarBrowShape:[["soft","Suaves","Soft"],["straight","Rectas","Straight"],["arched","Arqueadas","Arched"],["bold","Marcadas","Bold"]],
    avatarNoseShape:[["soft","Suave","Soft"],["round","Redonda","Round"],["button","Pequeña","Button"],["defined","Definida","Defined"]],
    avatarMouthShape:[["smile","Sonrisa","Smile"],["soft","Suave","Soft"],["wide","Amplia","Wide"],["calm","Serena","Calm"]]
  };
  const RANGES = {
    avatarSkin:{ label:"Tono de piel", labelEn:"Skin tone", values:["tone-1","tone-5","tone-2","tone-6","tone-3","tone-7","tone-4","tone-8"], names:["Claro 1","Claro 2","Medio 1","Medio 2","Oscuro 1","Oscuro 2","Profundo 1","Profundo 2"], namesEn:["Light 1","Light 2","Medium 1","Medium 2","Dark 1","Dark 2","Deep 1","Deep 2"], colours:["var(--il-avatar-skin-1)","var(--il-avatar-skin-5)","var(--il-avatar-skin-2)","var(--il-avatar-skin-6)","var(--il-avatar-skin-3)","var(--il-avatar-skin-7)","var(--il-avatar-skin-4)","var(--il-avatar-skin-8)"] },
    avatarHairColor:{ label:"Color de pelo", labelEn:"Hair colour", values:["dark","brown","red","copper","gold","ash"], names:["Negro","Castaño","Caoba","Cobrizo","Rubio","Ceniza"], namesEn:["Black","Brown","Auburn","Copper","Blonde","Ash"], colours:["var(--il-avatar-hair-dark)","var(--il-avatar-hair-brown)","var(--il-avatar-hair-red)","var(--il-avatar-hair-copper)","var(--il-avatar-hair-gold)","var(--il-avatar-hair-ash)"] },
    avatarEyeColor:{ label:"Color de ojos", labelEn:"Eye colour", values:["brown","hazel","green","blue","grey"], names:["Marrón","Avellana","Verde","Azul","Gris"], namesEn:["Brown","Hazel","Green","Blue","Grey"], colours:["var(--il-avatar-eye-brown)","var(--il-avatar-eye-hazel)","var(--il-avatar-eye-green)","var(--il-avatar-eye-blue)","var(--il-avatar-eye-grey)"] },
    avatarFaceWidth:{ label:"Anchura del rostro", labelEn:"Face width", values:[0,1,2,3,4], names:["Estrecho","Fino","Equilibrado","Amplio","Muy amplio"], namesEn:["Narrow","Slim","Balanced","Wide","Very wide"] },
    avatarEyeSize:{ label:"Tamaño de ojos", labelEn:"Eye size", values:[0,1,2,3,4], names:["Muy pequeños","Pequeños","Medios","Grandes","Muy grandes"], namesEn:["Very small","Small","Medium","Large","Very large"] },
    avatarNoseLength:{ label:"Longitud de nariz", labelEn:"Nose length", values:[0,1,2,3,4], names:["Muy corta","Corta","Media","Larga","Muy larga"], namesEn:["Very short","Short","Medium","Long","Very long"] }
  };

  let username = "";
  let band = "p56";
  let progress = {};
  let settings = null;
  let stampIds = [];
  let activeTab = "avatar";
  let activeFeature = "base";
  let revealItem = null;
  let saveTimer = null;
  let resetTimer = null;
  let resetArmed = false;

  const secondary = () => band === "eso";
  const text = (es, en) => secondary() ? en : es;
  const itemName = item => ILWorldData.displayName(item, band);
  const ctx = () => ILWorldData.context(progress, stampIds, band);
  const random = values => values[Math.floor(Math.random() * values.length)];

  function activeItems() {
    const context = ctx(); const wanted = new Set(settings.activeWorldItems || []);
    return ILWorldData.catalogFor(band, "world").filter(item => item.toggle === "world" && wanted.has(item.id) && ILWorldData.unlockStatus(item, context).unlocked).map(item => item.id);
  }

  function localise() {
    if (!secondary()) return;
    document.documentElement.lang = "en"; document.title = "My space · Interlanguage HOME";
    $("backProfile").lastElementChild.textContent = "Profile"; $("worldEyebrow").textContent = "PERSONAL SPACE"; $("worldTitle").textContent = "My space"; $("worldSubtitle").textContent = "The more you practise, the more your space evolves.";
    $("growthLabel").textContent = "YOUR SPACE EVOLVES WITH YOU"; $("growthCopy").textContent = "Each completed session moves your personal space forward."; $("nextUnlockLabel").textContent = "NEXT UNLOCK";
    $("customiseEyebrow").textContent = "MAKE IT YOURS"; $("customiseTitle").textContent = "Personalise"; $("customiseHint").textContent = "Choose one feature and see every change instantly."; $("previewLabel").textContent = "LIVE PREVIEW";
    $("unlockEyebrow").textContent = "NEW UNLOCK"; $("unlockCopy").textContent = "Your progress has opened a new option."; $("unlockTry").textContent = "Try it now"; $("unlockContinue").textContent = "Continue";
    $("randomiseAvatar").lastElementChild.textContent = "Surprise me"; $("resetAvatar").textContent = "Reset";
    const labels = ["Avatar", "Clothing", "Accessories", "Space"]; document.querySelectorAll("[data-world-tab]").forEach((button,index) => button.lastElementChild.textContent = labels[index]);
  }

  function levelLabel(level) { return secondary() ? "Space level " + level : (band === "p56" ? "Base nivel " + level : "Jardín nivel " + level); }

  function renderScene(animate) {
    const meta = ILWorldData.levelMeta(progress);
    $("worldScene").innerHTML = ILWorldVisual.scene(settings, progress, band, { level:meta.level, activeItems:activeItems() });
    $("worldAvatar").innerHTML = ILWorldVisual.avatar(settings, progress);
    const worldMode = activeTab === "world"; $("worldStage").classList.toggle("is-avatar-editor", !worldMode); $("worldStage").classList.toggle("is-world-editor", worldMode);
    const companion = worldMode && settings.worldCompanion && settings.worldCompanion !== "none" ? settings.worldCompanion : ""; $("worldCompanion").hidden = !companion; if (companion) $("worldCompanion").innerHTML = ILWorldVisual.companion(companion);
    if (animate && !ILVisual.reduceMotion()) {
      const target = worldMode ? $("worldScene") : $("worldAvatar");
      target.animate([{ transform:"scale(.985)" }, { transform:"scale(1.012)" }, { transform:"scale(1)" }], { duration:240, easing:"cubic-bezier(.2,.7,.3,1)" });
    }
  }

  function renderOverview() {
    const meta = ILWorldData.levelMeta(progress); const next = ILWorldData.nextUnlock(progress, band, stampIds); const label = levelLabel(meta.level);
    $("worldLevelBadge").lastElementChild.textContent = label; $("worldOverviewTitle").textContent = label; $("levelProgress").style.setProperty("--world-progress", meta.percent + "%"); $("levelProgress").setAttribute("aria-valuenow", String(meta.percent));
    $("levelProgressCopy").textContent = meta.level >= 5 ? text("Tu mundo ha alcanzado su nivel máximo actual.", "Your space has reached its current maximum level.") : text("Completa " + meta.remaining + (meta.remaining === 1 ? " misión más" : " misiones más") + " para llegar al nivel " + (meta.level + 1) + ".", "Complete " + meta.remaining + (meta.remaining === 1 ? " more session" : " more sessions") + " to reach level " + (meta.level + 1) + ".");
    if (!next) { $("nextUnlockName").textContent = text("Colección completada", "Collection complete"); $("nextUnlockRule").textContent = text("Habrá nuevas opciones en próximas etapas.", "More options will arrive in future stages."); $("nextUnlockVisual").innerHTML = ILIcon("check"); return; }
    $("nextUnlockName").textContent = itemName(next); $("nextUnlockRule").textContent = next.requirement; $("nextUnlockVisual").innerHTML = ILWorldVisual.item(next, settings, progress);
  }

  function showSaved(message) {
    $("editorStatus").textContent = message || text("Guardado", "Saved");
    clearTimeout(saveTimer); saveTimer = setTimeout(() => { $("editorStatus").textContent = text("Guardado", "Saved"); }, 1300);
  }

  function persist(patch, options) {
    options = options || {}; settings = ILProfileSettings.save(username, patch); renderScene(options.animate !== false);
    showSaved(options.message || text("Cambio guardado", "Change saved"));
  }

  function previewRange(key, value, output) {
    settings = ILProfileSettings.sanitize(Object.assign({}, settings, { avatarCustomised:true, [key]:value })); renderScene(false); if (output) output.textContent = rangeName(RANGES[key], value);
    $("editorStatus").textContent = text("Guardando…", "Saving…"); clearTimeout(saveTimer); saveTimer = setTimeout(() => persist({ avatarCustomised:true, [key]:value }, { animate:false }), 180);
  }

  function rangeName(config, value) { const index = config.values.indexOf(value); return (secondary() ? config.namesEn : config.names)[Math.max(0, index)]; }

  function rangeControl(key) {
    const config = RANGES[key]; const current = settings[key]; const index = Math.max(0, config.values.indexOf(current));
    const wrap = document.createElement("div"); wrap.className = "trait-control";
    const head = document.createElement("div"); head.className = "trait-control__head"; const label = document.createElement("label"); const id = "range-" + key; label.htmlFor = id; label.textContent = secondary() ? config.labelEn : config.label; const output = document.createElement("output"); output.htmlFor = id; output.textContent = rangeName(config, current); head.append(label, output);
    const rail = document.createElement("div"); rail.className = "trait-range" + (config.colours ? " is-colour" : "");
    if (config.colours) rail.style.setProperty("--trait-gradient", "linear-gradient(90deg," + config.colours.join(",") + ")");
    const input = document.createElement("input"); input.id = id; input.type = "range"; input.min = "0"; input.max = String(config.values.length - 1); input.step = "1"; input.value = String(index); input.setAttribute("aria-valuetext", rangeName(config, current));
    const marks = document.createElement("div"); marks.className = "trait-marks"; config.values.forEach(() => marks.appendChild(document.createElement("i")));
    input.addEventListener("input", () => { const value = config.values[Number(input.value)]; input.setAttribute("aria-valuetext", rangeName(config, value)); previewRange(key, value, output); });
    input.addEventListener("change", () => persist({ [key]:config.values[Number(input.value)] }, { animate:false }));
    rail.append(input, marks); wrap.append(head, rail); return wrap;
  }

  function choiceGroup(key, heading) {
    const group = document.createElement("fieldset"); group.className = "trait-group"; const legend = document.createElement("legend"); legend.textContent = heading; const choices = document.createElement("div"); choices.className = "trait-choices";
    const baseChoice = key === "avatarBase"; if (baseChoice) { group.classList.add("is-base"); choices.classList.add("is-base"); }
    OPTIONS[key].forEach(option => {
      const value = option[0]; const selected = settings[key] === value; const button = document.createElement("button"); button.type = "button"; button.className = "trait-choice" + (selected ? " is-selected" : ""); button.setAttribute("aria-pressed", String(selected)); button.setAttribute("aria-label", secondary() ? option[2] : option[1]);
      const previewSettings = Object.assign({}, settings, { [key]:value, avatarCustomised:!baseChoice });
      const visual = document.createElement("span"); visual.className = "trait-choice__visual"; visual.innerHTML = ILWorldVisual.avatar(previewSettings, progress, baseChoice ? { compact:true } : { portrait:true }); const label = document.createElement("span"); label.textContent = secondary() ? option[2] : option[1]; button.append(visual, label);
      button.addEventListener("click", () => { persist(baseChoice ? { avatarBase:value, avatarCustomised:false } : { avatarCustomised:true, [key]:value }); renderEditor(); }); choices.appendChild(button);
    });
    group.append(legend, choices); return group;
  }

  function featureIntro(title, copy) {
    const head = document.createElement("header"); head.className = "feature-editor__head"; const eyebrow = document.createElement("p"); eyebrow.className = "ui-label"; eyebrow.textContent = text("EDITAR AVATAR", "EDIT AVATAR"); const h = document.createElement("h3"); h.textContent = title; const p = document.createElement("p"); p.textContent = copy; head.append(eyebrow, h, p); return head;
  }

  function renderAvatarFeature() {
    const host = $("catalogSections"); host.replaceChildren(); const panel = document.createElement("section"); panel.className = "feature-editor";
    if (activeFeature === "base") { panel.append(featureIntro(text("Elige tu base", "Choose your base"), text("Elige masculino o femenino. Después podrás combinar todos los rasgos, peinados y estilos.", "Choose masculine or feminine. You can then combine every feature, hairstyle and style.")), choiceGroup("avatarBase", text("Base del avatar", "Avatar base"))); }
    if (activeFeature === "face") { panel.append(featureIntro(text("Rostro", "Face"), text("Elige la forma y ajusta sus proporciones.", "Choose a shape and adjust its proportions.")), choiceGroup("avatarFaceShape", text("Forma", "Shape")), rangeControl("avatarFaceWidth")); }
    if (activeFeature === "skin") { panel.append(featureIntro(text("Piel", "Skin"), text("Desliza para encontrar tu tono.", "Move along the scale to choose your tone.")), rangeControl("avatarSkin")); }
    if (activeFeature === "hair") { panel.append(featureIntro(text("Pelo", "Hair"), text("Combina corte, textura y color.", "Combine hairstyle, texture and colour.")), choiceGroup("avatarHair", text("Corte y textura", "Style and texture")), rangeControl("avatarHairColor")); }
    if (activeFeature === "eyes") { panel.append(featureIntro(text("Ojos", "Eyes"), text("Cambia la forma, el color y el tamaño.", "Adjust shape, colour and size.")), choiceGroup("avatarEyeShape", text("Forma", "Shape")), rangeControl("avatarEyeColor"), rangeControl("avatarEyeSize")); }
    if (activeFeature === "brows") { panel.append(featureIntro(text("Cejas", "Brows"), text("Un pequeño cambio modifica mucho la expresión.", "A small change can shape the whole expression.")), choiceGroup("avatarBrowShape", text("Forma", "Shape"))); }
    if (activeFeature === "nose") { panel.append(featureIntro(text("Nariz", "Nose"), text("Elige una forma y ajusta su longitud.", "Choose a shape and adjust its length.")), choiceGroup("avatarNoseShape", text("Forma", "Shape")), rangeControl("avatarNoseLength")); }
    if (activeFeature === "mouth") { panel.append(featureIntro(text("Boca", "Mouth"), text("Elige la expresión que más se parece a ti.", "Choose the expression that feels like you.")), choiceGroup("avatarMouthShape", text("Expresión", "Expression"))); }
    host.appendChild(panel);
  }

  function renderFeatureNav() {
    const host = $("featureNav"); host.replaceChildren(); FEATURES.forEach(feature => { const button = document.createElement("button"); button.type = "button"; button.role = "tab"; button.dataset.feature = feature.id; button.setAttribute("aria-selected", String(activeFeature === feature.id)); button.tabIndex = activeFeature === feature.id ? 0 : -1; button.textContent = secondary() ? feature.labelEn : feature.label; button.addEventListener("click", () => selectFeature(feature.id, false, true)); button.addEventListener("keydown", event => { if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return; event.preventDefault(); const index = FEATURES.findIndex(item => item.id === activeFeature); selectFeature(FEATURES[(index + (event.key === "ArrowRight" ? 1 : -1) + FEATURES.length) % FEATURES.length].id, true, true); }); host.appendChild(button); });
  }

  function revealEditorStart() { if (!matchMedia("(max-width:760px)").matches) return; requestAnimationFrame(() => $("catalogPanel").scrollIntoView({ behavior:ILVisual.reduceMotion() ? "auto" : "smooth", block:"start" })); }
  function selectFeature(feature, focus, move) { activeFeature = FEATURES.some(item => item.id === feature) ? feature : "base"; renderFeatureNav(); renderAvatarFeature(); if (focus) $("featureNav").querySelector('[aria-selected="true"]').focus(); if (move) revealEditorStart(); }

  function applyCatalogItem(item) {
    const status = ILWorldData.unlockStatus(item, ctx()); if (!status.unlocked) { showSaved(status.requirement); return; }
    if (item.toggle === "world") { const values = new Set(settings.activeWorldItems || []); if (values.has(item.id)) values.delete(item.id); else { if (values.size >= 8) values.delete(Array.from(values)[0]); values.add(item.id); } persist({ activeWorldItems:Array.from(values) }, { message:values.has(item.id) ? text("Añadido al paisaje", "Added to your space") : text("Quitado del paisaje", "Removed from your space") }); }
    else if (item.settingKey) persist({ avatarCustomised:true, [item.settingKey]:item.settingValue });
    renderEditor();
  }

  function compactOption(item) {
    const status = ILWorldData.unlockStatus(item, ctx()); const selected = ILWorldData.isSelected(item, settings); const button = document.createElement("button"); button.type = "button"; button.className = "compact-option" + (selected ? " is-selected" : "") + (!status.unlocked ? " is-locked" : ""); button.setAttribute("aria-pressed", String(selected)); button.setAttribute("aria-disabled", String(!status.unlocked)); button.setAttribute("aria-label", itemName(item) + ". " + (status.unlocked ? (selected ? text("En uso", "Active") : text("Disponible", "Available")) : status.requirement));
    const visual = document.createElement("span"); visual.className = "compact-option__visual"; visual.innerHTML = ILWorldVisual.item(item, settings, progress); const name = document.createElement("b"); name.textContent = itemName(item); const state = document.createElement("small"); state.textContent = status.unlocked ? (selected ? text("En uso", "Active") : text("Elegir", "Choose")) : status.requirement; if (!status.unlocked) { const lock = document.createElement("i"); lock.innerHTML = ILIcon("lock"); lock.setAttribute("aria-hidden", "true"); visual.appendChild(lock); }
    button.append(visual, name, state); button.addEventListener("click", () => applyCatalogItem(item)); return button;
  }

  function sectionName(value) { return secondary() ? ({ Ropa:"Clothing", Accesorios:"Accessories", Fondos:"Backgrounds", Objetos:"Objects", Compañero:"Companion" }[value] || value) : value; }

  function renderDataCatalog() {
    const host = $("catalogSections"); host.replaceChildren(); ILWorldData.sections(band, activeTab).forEach(section => { const wrap = document.createElement("section"); wrap.className = "compact-section"; const heading = document.createElement("div"); heading.className = "compact-section__head"; const title = document.createElement("h3"); title.textContent = sectionName(section); const copy = document.createElement("p"); copy.textContent = activeTab === "world" ? text("Los cambios aparecen al momento en la vista previa.", "Changes appear instantly in the preview.") : text("Elige una opción para probarla.", "Choose an option to try it."); heading.append(title, copy); const grid = document.createElement("div"); grid.className = "compact-options"; ILWorldData.catalogFor(band, activeTab).filter(item => item.section === section).forEach(item => grid.appendChild(compactOption(item))); wrap.append(heading, grid); host.appendChild(wrap); });
  }

  function renderEditor() { if (activeTab === "avatar") { renderFeatureNav(); renderAvatarFeature(); } else renderDataCatalog(); }

  function selectTab(tab, focus, move) {
    activeTab = TABS.includes(tab) ? tab : "avatar"; document.querySelectorAll("[data-world-tab]").forEach(button => { const current = button.dataset.worldTab === activeTab; button.setAttribute("aria-selected", String(current)); button.tabIndex = current ? 0 : -1; if (current && focus) button.focus(); });
    $("avatarTools").hidden = activeTab !== "avatar"; $("catalogPanel").setAttribute("aria-labelledby", "tab-" + activeTab); $("previewLabel").textContent = activeTab === "world" ? text("TU PAISAJE · CAMBIOS EN DIRECTO", "YOUR SPACE · LIVE CHANGES") : text("TU AVATAR · CAMBIOS EN DIRECTO", "YOUR AVATAR · LIVE CHANGES"); renderScene(false); renderEditor(); if (move) revealEditorStart();
  }

  function setupTabs() { document.querySelectorAll("[data-world-tab]").forEach(button => { button.addEventListener("click", () => selectTab(button.dataset.worldTab, false, true)); button.addEventListener("keydown", event => { if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return; event.preventDefault(); const index = TABS.indexOf(activeTab); selectTab(TABS[(index + (event.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length], true, true); }); }); }

  function randomiseAvatar() {
    const patch = { avatarCustomised:true, avatarBase:random(OPTIONS.avatarBase)[0], avatarFaceShape:random(OPTIONS.avatarFaceShape)[0], avatarFaceWidth:random(RANGES.avatarFaceWidth.values), avatarSkin:random(RANGES.avatarSkin.values), avatarHair:random(OPTIONS.avatarHair)[0], avatarHairColor:random(RANGES.avatarHairColor.values), avatarEyeShape:random(OPTIONS.avatarEyeShape)[0], avatarEyeColor:random(RANGES.avatarEyeColor.values), avatarEyeSize:random(RANGES.avatarEyeSize.values), avatarBrowShape:random(OPTIONS.avatarBrowShape)[0], avatarNoseShape:random(OPTIONS.avatarNoseShape)[0], avatarNoseLength:random(RANGES.avatarNoseLength.values), avatarMouthShape:random(OPTIONS.avatarMouthShape)[0] };
    persist(patch, { message:text("¡Nueva combinación!", "New combination") }); renderEditor();
  }

  function resetAvatar() {
    const button = $("resetAvatar"); if (!resetArmed) { resetArmed = true; button.textContent = text("Confirmar restablecer", "Confirm reset"); button.classList.add("is-armed"); clearTimeout(resetTimer); resetTimer = setTimeout(() => { resetArmed = false; button.textContent = text("Restablecer", "Reset"); button.classList.remove("is-armed"); }, 3200); return; }
    resetArmed = false; clearTimeout(resetTimer); button.textContent = text("Restablecer", "Reset"); button.classList.remove("is-armed"); const defaults = ILProfileSettings.DEFAULTS; persist({ avatarCustomised:false, avatarBase:defaults.avatarBase, avatarTheme:defaults.avatarTheme, avatarSkin:defaults.avatarSkin, avatarHair:defaults.avatarHair, avatarHairColor:defaults.avatarHairColor, avatarExpression:defaults.avatarExpression, avatarFaceShape:defaults.avatarFaceShape, avatarFaceWidth:defaults.avatarFaceWidth, avatarEyeShape:defaults.avatarEyeShape, avatarEyeColor:defaults.avatarEyeColor, avatarEyeSize:defaults.avatarEyeSize, avatarBrowShape:defaults.avatarBrowShape, avatarNoseShape:defaults.avatarNoseShape, avatarNoseLength:defaults.avatarNoseLength, avatarMouthShape:defaults.avatarMouthShape, avatarTop:defaults.avatarTop, avatarAccessory:defaults.avatarAccessory }, { message:text("Avatar restablecido", "Avatar reset") }); renderEditor();
  }

  function applyReveal() { if (!revealItem) return; applyCatalogItem(revealItem); $("unlockDialog").close(); }
  function revealNewUnlock() { const unlocked = ILWorldData.unlockedItems(progress, stampIds, band).filter(item => item.unlock.type !== "always"); const seen = new Set(settings.seenUnlocks || []); const fresh = unlocked.filter(item => !seen.has(item.id)).sort((a,b) => (b.unlock.value || 0) - (a.unlock.value || 0)); if (!fresh.length) return; revealItem = fresh[0]; settings = ILProfileSettings.save(username, { seenUnlocks:Array.from(new Set((settings.seenUnlocks || []).concat(unlocked.map(item => item.id)))) }); $("unlockTitle").textContent = itemName(revealItem); $("unlockVisual").innerHTML = ILWorldVisual.item(revealItem, settings, progress); $("unlockDialog").showModal(); requestAnimationFrame(() => $("unlockTry").focus()); }
  function setupDialog() { $("unlockTry").addEventListener("click", applyReveal); $("unlockContinue").addEventListener("click", () => $("unlockDialog").close()); $("unlockDialog").addEventListener("cancel", event => { event.preventDefault(); $("unlockDialog").close(); }); }
  function stampList(learning, medals) { const stamps = learning && learning.stamps && learning.stamps.items || []; return Array.from(new Set(stamps.filter(item => item.unlocked).map(item => item.id).concat((medals || []).filter(item => item.earned).map(item => item.id)))); }

  (async function init() {
    try {
      const profile = await ILAuth.getProfile(); if (!profile) { location.href = "index.html"; return; } if (profile.is_admin) { location.href = "admin.html"; return; }
      username = profile.username || ""; IL_ETAPA.apply(profile); band = IL_ETAPA.current().band; settings = ILProfileSettings.setActive(username);
      const loaded = await Promise.all([ILAuth.getProgress(), ILProgressData.load(ILAuth, window.ILMission, { ageMode:IL_ETAPA.current().mode }), ILAuth.listMedals()]); progress = loaded[0] || {}; stampIds = stampList(loaded[1], loaded[2]);
      localise(); setupTabs(); setupDialog(); $("randomiseAvatar").addEventListener("click", randomiseAvatar); $("resetAvatar").addEventListener("click", resetAvatar); renderOverview(); selectTab("avatar"); ILLayout.mount(); $("loading").hidden = true; $("app").classList.remove("hidden"); setTimeout(revealNewUnlock, 280);
    } catch (error) { console.error("No se pudo cargar Mi Mundo", error); $("loading").hidden = true; $("errorState").hidden = false; }
  })();
})();
