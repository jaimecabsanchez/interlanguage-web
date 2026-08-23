(function () {
  "use strict";

  const $ = id => document.getElementById(id);
  const TABS = ["avatar", "world"];
  const FEATURES = [
    { id:"skin", label:"Piel", labelEn:"Skin" },
    { id:"hair", label:"Pelo", labelEn:"Hair" },
    { id:"eyes", label:"Ojos", labelEn:"Eyes" },
    { id:"clothing", label:"Ropa", labelEn:"Clothing" }
  ];
  const RANGES = {
    avatarSkin:{ label:"Tono de piel", labelEn:"Skin tone", values:["tone-1","tone-5","tone-2","tone-6","tone-3","tone-7","tone-4","tone-8"], names:["Claro 1","Claro 2","Medio 1","Medio 2","Oscuro 1","Oscuro 2","Profundo 1","Profundo 2"], namesEn:["Light 1","Light 2","Medium 1","Medium 2","Dark 1","Dark 2","Deep 1","Deep 2"], colours:["var(--il-avatar-skin-1)","var(--il-avatar-skin-5)","var(--il-avatar-skin-2)","var(--il-avatar-skin-6)","var(--il-avatar-skin-3)","var(--il-avatar-skin-7)","var(--il-avatar-skin-4)","var(--il-avatar-skin-8)"] },
    avatarHairColor:{ label:"Color de pelo", labelEn:"Hair colour", values:["dark","brown","red","copper","gold","ash"], names:["Negro","Castaño","Caoba","Cobrizo","Rubio","Ceniza"], namesEn:["Black","Brown","Auburn","Copper","Blonde","Ash"], colours:["var(--il-avatar-hair-dark)","var(--il-avatar-hair-brown)","var(--il-avatar-hair-red)","var(--il-avatar-hair-copper)","var(--il-avatar-hair-gold)","var(--il-avatar-hair-ash)"] },
    avatarEyeColor:{ label:"Color de ojos", labelEn:"Eye colour", values:["brown","hazel","green","blue","grey"], names:["Marrón","Avellana","Verde","Azul","Gris"], namesEn:["Brown","Hazel","Green","Blue","Grey"], colours:["var(--il-avatar-eye-brown)","var(--il-avatar-eye-hazel)","var(--il-avatar-eye-green)","var(--il-avatar-eye-blue)","var(--il-avatar-eye-grey)"] },
    avatarOutfitColor:{ label:"Color de la camiseta", labelEn:"T-shirt colour", values:["green","aqua","coral","navy"], names:["Verde","Aguamarina","Coral","Azul marino"], namesEn:["Green","Aqua","Coral","Navy"], colours:["#16936f","#2ca6a4","#f3684b","#17345f"] }
  };

  let username = "";
  let band = "p56";
  let progress = {};
  let settings = null;
  let stampIds = [];
  let activeTab = "avatar";
  let activeFeature = "skin";
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
    $("customiseEyebrow").textContent = "MAKE IT YOURS"; $("customiseTitle").textContent = "Customise"; $("customiseHint").textContent = "Change colours by area without altering the rest of the avatar."; $("previewLabel").textContent = "LIVE PREVIEW"; $("randomAvatar").lastElementChild.textContent = "Surprise me"; $("resetAvatar").textContent = "Reset";
    $("unlockEyebrow").textContent = "NEW UNLOCK"; $("unlockCopy").textContent = "Your progress has opened a new option."; $("unlockTry").textContent = "Try it now"; $("unlockContinue").textContent = "Continue";
    const labels = { avatar:"Avatar", world:"Space" }; document.querySelectorAll("[data-world-tab]").forEach(button => { button.lastElementChild.textContent = labels[button.dataset.worldTab]; });
  }

  function levelLabel(level) { return secondary() ? "Space level " + level : (band === "p56" ? "Base nivel " + level : "Jardín nivel " + level); }

  function renderScene(animate) {
    const meta = ILWorldData.levelMeta(progress);
    $("worldScene").innerHTML = ILWorldVisual.scene(settings, progress, band, { level:meta.level, activeItems:activeItems() });
    $("worldAvatar").innerHTML = ILWorldVisual.avatar(settings, progress);
    const worldMode = activeTab === "world"; $("worldStage").classList.toggle("is-avatar-editor", !worldMode); $("worldStage").classList.toggle("is-world-editor", worldMode);
    $("worldCompanion").hidden = true; // el compañero se dibuja dentro de la escena (evita duplicado)
    if (animate && !ILVisual.reduceMotion()) {
      const target = worldMode ? $("worldScene") : $("worldAvatar");
      target.animate([{ transform:"scale(.985)" }, { transform:"scale(1.012)" }, { transform:"scale(1)" }], { duration:240, easing:"cubic-bezier(.2,.7,.3,1)" });
    }
  }

  function renderOverview() {
    const meta = ILWorldData.levelMeta(progress); const context = ctx(); const next = ILWorldData.catalogFor(band, "world").map(item => ({ item, status:ILWorldData.unlockStatus(item, context) })).filter(entry => !entry.status.unlocked).sort((a,b) => b.status.percent - a.status.percent || a.status.remaining - b.status.remaining).map(entry => Object.assign({}, entry.item, entry.status))[0] || null; const label = levelLabel(meta.level);
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
    settings = ILProfileSettings.sanitize(Object.assign({}, settings, { avatarCustomised:true, avatarRigVersion:2, [key]:value })); renderScene(false); if (output) output.textContent = rangeName(RANGES[key], value);
    $("editorStatus").textContent = text("Guardando…", "Saving…"); clearTimeout(saveTimer); saveTimer = setTimeout(() => persist({ avatarCustomised:true, avatarRigVersion:2, [key]:value }, { animate:false }), 180);
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
    input.addEventListener("change", () => persist({ avatarCustomised:true, avatarRigVersion:2, [key]:config.values[Number(input.value)] }, { animate:false }));
    rail.append(input, marks); wrap.append(head, rail); return wrap;
  }

  function featureIntro(title, copy) {
    const head = document.createElement("header"); head.className = "feature-editor__head"; const eyebrow = document.createElement("p"); eyebrow.className = "ui-label"; eyebrow.textContent = text("EDITAR AVATAR", "EDIT AVATAR"); const h = document.createElement("h3"); h.textContent = title; const p = document.createElement("p"); p.textContent = copy; head.append(eyebrow, h, p); return head;
  }

  function renderAvatarFeature() {
    const host = $("catalogSections"); host.replaceChildren(); const panel = document.createElement("section"); panel.className = "feature-editor";
    if (activeFeature === "skin") { panel.append(featureIntro(text("Piel", "Skin"), text("Cambia únicamente el tono de la piel. El resto del avatar permanece intacto.", "Change only the skin tone. The rest of the avatar remains untouched.")), rangeControl("avatarSkin")); }
    if (activeFeature === "hair") { panel.append(featureIntro(text("Pelo", "Hair"), text("Cambia únicamente el color del pelo, conservando exactamente su forma y su estilo.", "Change only the hair colour while keeping its exact shape and style.")), rangeControl("avatarHairColor")); }
    if (activeFeature === "eyes") { panel.append(featureIntro(text("Ojos", "Eyes"), text("Cambia únicamente el color del iris, sin modificar el tamaño ni la expresión.", "Change only the iris colour without altering size or expression.")), rangeControl("avatarEyeColor")); }
    if (activeFeature === "clothing") { panel.append(featureIntro(text("Ropa", "Clothing"), text("Cambia únicamente el color de la camiseta. El cuerpo y la ropa conservan su forma original.", "Change only the T-shirt colour. The body and clothing keep their original shape.")), rangeControl("avatarOutfitColor")); }
    host.appendChild(panel);
  }

  function renderFeatureNav() {
    const host = $("featureNav"); host.replaceChildren(); FEATURES.forEach(feature => { const button = document.createElement("button"); button.type = "button"; button.role = "tab"; button.dataset.feature = feature.id; button.setAttribute("aria-selected", String(activeFeature === feature.id)); button.tabIndex = activeFeature === feature.id ? 0 : -1; button.textContent = secondary() ? feature.labelEn : feature.label; button.addEventListener("click", () => selectFeature(feature.id, false, true)); button.addEventListener("keydown", event => { if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return; event.preventDefault(); const index = FEATURES.findIndex(item => item.id === activeFeature); selectFeature(FEATURES[(index + (event.key === "ArrowRight" ? 1 : -1) + FEATURES.length) % FEATURES.length].id, true, true); }); host.appendChild(button); });
  }

  function revealEditorStart() { if (!matchMedia("(max-width:760px)").matches) return; requestAnimationFrame(() => $("catalogPanel").scrollIntoView({ behavior:ILVisual.reduceMotion() ? "auto" : "smooth", block:"start" })); }
  function selectFeature(feature, focus, move) { activeFeature = FEATURES.some(item => item.id === feature) ? feature : "skin"; renderFeatureNav(); renderAvatarFeature(); if (focus) $("featureNav").querySelector('[aria-selected="true"]').focus(); if (move) revealEditorStart(); }

  function applyCatalogItem(item) {
    const status = ILWorldData.unlockStatus(item, ctx()); if (!status.unlocked) { showSaved(status.requirement); return; }
    if (item.toggle === "world") { const values = new Set(settings.activeWorldItems || []); if (values.has(item.id)) values.delete(item.id); else { if (values.size >= 8) values.delete(Array.from(values)[0]); values.add(item.id); } persist({ activeWorldItems:Array.from(values) }, { message:values.has(item.id) ? text("Añadido al paisaje", "Added to your space") : text("Quitado del paisaje", "Removed from your space") }); }
    else if (item.settingKey) persist({ [item.settingKey]:item.settingValue });
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
    $("catalogPanel").setAttribute("aria-labelledby", "tab-" + activeTab); $("avatarTools").hidden = activeTab !== "avatar"; $("previewLabel").textContent = activeTab === "world" ? text("TU PAISAJE · CAMBIOS EN DIRECTO", "YOUR SPACE · LIVE CHANGES") : text("TU AVATAR · CAMBIOS EN DIRECTO", "YOUR AVATAR · LIVE CHANGES"); renderScene(false); renderEditor(); if (move) revealEditorStart();
  }

  function setupTabs() { document.querySelectorAll("[data-world-tab]").forEach(button => { button.addEventListener("click", () => selectTab(button.dataset.worldTab, false, true)); button.addEventListener("keydown", event => { if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return; event.preventDefault(); const index = TABS.indexOf(activeTab); selectTab(TABS[(index + (event.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length], true, true); }); }); }

  function randomiseAvatar() {
    const patch = { avatarCustomised:true, avatarRigVersion:2 };
    Object.keys(RANGES).forEach(key => { patch[key] = random(RANGES[key].values); });
    persist(patch, { message:text("¡Nueva combinación!", "New combination") }); renderEditor();
  }

  function resetAvatar() {
    const button = $("resetAvatar"); if (!resetArmed) { resetArmed = true; button.textContent = text("Confirmar restablecer", "Confirm reset"); button.classList.add("is-armed"); clearTimeout(resetTimer); resetTimer = setTimeout(() => { resetArmed = false; button.textContent = text("Restablecer", "Reset"); button.classList.remove("is-armed"); }, 3200); return; }
    resetArmed = false; clearTimeout(resetTimer); button.textContent = text("Restablecer", "Reset"); button.classList.remove("is-armed"); const defaults = ILProfileSettings.DEFAULTS; const patch = { avatarCustomised:false, avatarRigVersion:2, avatarSkin:defaults.avatarSkin, avatarHair:"original", avatarHairColor:defaults.avatarHairColor, avatarEyeColor:defaults.avatarEyeColor, avatarTop:defaults.avatarTop, avatarOutfitColor:defaults.avatarOutfitColor, avatarAccessory:defaults.avatarAccessory };
    ILAvatarRig.RANGE_KEYS.forEach(key => { patch[key] = defaults[key]; }); persist(patch, { message:text("Avatar original restaurado", "Original avatar restored") }); renderEditor();
  }

  function applyReveal() { if (!revealItem) return; applyCatalogItem(revealItem); $("unlockDialog").close(); }
  function revealNewUnlock() { const context = ctx(); const unlocked = ILWorldData.catalogFor(band, "world").filter(item => item.unlock.type !== "always" && ILWorldData.unlockStatus(item, context).unlocked); const seen = new Set(settings.seenUnlocks || []); const fresh = unlocked.filter(item => !seen.has(item.id)).sort((a,b) => (b.unlock.value || 0) - (a.unlock.value || 0)); if (!fresh.length) return; revealItem = fresh[0]; settings = ILProfileSettings.save(username, { seenUnlocks:Array.from(new Set((settings.seenUnlocks || []).concat(unlocked.map(item => item.id)))) }); $("unlockTitle").textContent = itemName(revealItem); $("unlockCopy").textContent = (function (it) { const r = (it.unlock || {}).type; const es = { streak:"Lo has desbloqueado con tu racha.", stamp:"Lo has desbloqueado con un logro.", worldLevel:"Tu mundo ha subido de nivel.", missions:"Lo has desbloqueado completando misiones." }; const en = { streak:"You unlocked it with your streak.", stamp:"You unlocked it with an achievement.", worldLevel:"Your space leveled up.", missions:"You unlocked it by completing missions." }; return (secondary() ? en : es)[r] || (secondary() ? "You've unlocked a new option." : "Has desbloqueado una nueva opción."); })(revealItem); $("unlockVisual").innerHTML = ILWorldVisual.item(revealItem, settings, progress); $("unlockDialog").showModal(); requestAnimationFrame(() => $("unlockTry").focus()); }
  function setupDialog() { $("unlockTry").addEventListener("click", applyReveal); $("unlockContinue").addEventListener("click", () => $("unlockDialog").close()); $("unlockDialog").addEventListener("cancel", event => { event.preventDefault(); $("unlockDialog").close(); }); }
  function stampList(learning, medals) { const stamps = learning && learning.stamps && learning.stamps.items || []; return Array.from(new Set(stamps.filter(item => item.unlocked).map(item => item.id).concat((medals || []).filter(item => item.earned).map(item => item.id)))); }

  (async function init() {
    try {
      const profile = await ILAuth.getProfile(); if (!profile) { location.href = "index.html"; return; } if (profile.is_admin) { location.href = "admin.html"; return; }
      username = profile.username || ""; IL_ETAPA.apply(profile); band = IL_ETAPA.current().band; settings = ILProfileSettings.setActive(username, profile.sex);
      const loaded = await Promise.all([ILAuth.getProgress(), ILProgressData.load(ILAuth, window.ILMission, { ageMode:IL_ETAPA.current().mode }), ILAuth.listMedals()]); progress = loaded[0] || {}; stampIds = stampList(loaded[1], loaded[2]);
      localise(); setupTabs(); setupDialog(); $("randomAvatar").addEventListener("click", randomiseAvatar); $("resetAvatar").addEventListener("click", resetAvatar); renderOverview(); selectTab("avatar"); ILLayout.mount(); $("loading").hidden = true; $("app").classList.remove("hidden"); setTimeout(revealNewUnlock, 280);
    } catch (error) { console.error("No se pudo cargar Mi Mundo", error); $("loading").hidden = true; $("errorState").hidden = false; }
  })();
})();
