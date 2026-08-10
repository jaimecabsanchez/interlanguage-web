(function () {
  "use strict";
  const $ = id => document.getElementById(id); const TABS = ["avatar", "clothing", "accessory", "world"];
  let username = ""; let band = "p56"; let progress = {}; let settings = null; let stampIds = []; let activeTab = "avatar"; let revealItem = null;
  const secondary = () => band === "eso";
  const itemName = item => ILWorldData.displayName(item, band);
  function sectionName(value) { if (!secondary()) return value; return { Apariencia:"Appearance", Pelo:"Hair", "Color de pelo":"Hair colour", "Expresión":"Expression", Ropa:"Clothing", Accesorios:"Accessories", Fondos:"Backgrounds", Objetos:"Objects", Compañero:"Companion" }[value] || value; }
  function ctx() { return ILWorldData.context(progress, stampIds, band); }
  function activeItems() { const c = ctx(); const wanted = new Set(settings.activeWorldItems || []); return ILWorldData.catalogFor(band, "world").filter(item => item.toggle === "world" && wanted.has(item.id) && ILWorldData.unlockStatus(item, c).unlocked).map(item => item.id); }
  function localise() {
    if (!secondary()) return; document.documentElement.lang = "en"; document.title = "My space · Interlanguage HOME"; $("backProfile").lastElementChild.textContent = "Profile"; $("worldEyebrow").textContent = "PERSONAL SPACE"; $("worldTitle").textContent = "My space"; $("worldSubtitle").textContent = "The more you practise, the more your space evolves."; $("growthLabel").textContent = "YOUR SPACE EVOLVES WITH YOU"; $("growthCopy").textContent = "Each completed session moves your personal space forward."; $("nextUnlockLabel").textContent = "NEXT UNLOCK"; $("customiseEyebrow").textContent = "MAKE IT YOURS"; $("customiseTitle").textContent = "Personalise"; $("customiseHint").textContent = "Choose an option to see the change immediately."; $("unlockEyebrow").textContent = "NEW UNLOCK"; $("unlockCopy").textContent = "Your progress has opened a new option."; $("unlockTry").textContent = "Try it now"; $("unlockContinue").textContent = "Continue";
    const labels = ["Avatar", "Clothing", "Accessories", "Space"]; document.querySelectorAll("[data-world-tab]").forEach((button,index) => button.lastElementChild.textContent = labels[index]);
  }
  function levelLabel(level) { return secondary() ? "Space level " + level : (band === "p56" ? "Base nivel " + level : "Jardín nivel " + level); }
  function renderScene(pop) {
    const meta = ILWorldData.levelMeta(progress); $("worldScene").innerHTML = ILWorldVisual.scene(settings, progress, band, { level:meta.level, activeItems:activeItems() }); $("worldAvatar").innerHTML = ILWorldVisual.avatar(settings, progress);
    const companion = settings.worldCompanion && settings.worldCompanion !== "none" ? settings.worldCompanion : ""; $("worldCompanion").hidden = !companion; if (companion) $("worldCompanion").innerHTML = ILWorldVisual.companion(companion);
    if (pop && !ILVisual.reduceMotion()) { $("worldAvatar").animate([{ transform:"scale(.96)" }, { transform:"scale(1.035)" }, { transform:"scale(1)" }], { duration:280, easing:"cubic-bezier(.2,.7,.3,1)" }); }
  }
  function renderOverview() {
    const meta = ILWorldData.levelMeta(progress); const next = ILWorldData.nextUnlock(progress, band, stampIds); const label = levelLabel(meta.level);
    $("worldLevelBadge").lastElementChild.textContent = label; $("worldOverviewTitle").textContent = label; $("levelProgress").style.setProperty("--world-progress", meta.percent + "%"); $("levelProgress").setAttribute("aria-valuenow", String(meta.percent));
    $("levelProgressCopy").textContent = meta.level >= 5 ? (secondary() ? "Your space has reached its current maximum level." : "Tu mundo ha alcanzado su nivel máximo actual.") : (secondary() ? "Complete " + meta.remaining + (meta.remaining === 1 ? " more session" : " more sessions") + " to reach level " + (meta.level + 1) + "." : "Completa " + meta.remaining + (meta.remaining === 1 ? " misión más" : " misiones más") + " para llegar al nivel " + (meta.level + 1) + ".");
    if (!next) { $("nextUnlockName").textContent = secondary() ? "Collection complete" : "Colección completada"; $("nextUnlockRule").textContent = secondary() ? "More options will arrive in future stages." : "Habrá nuevas opciones en próximas etapas."; $("nextUnlockVisual").innerHTML = ILIcon("check"); return; }
    $("nextUnlockName").textContent = itemName(next); $("nextUnlockRule").textContent = next.requirement; $("nextUnlockVisual").innerHTML = ILWorldVisual.item(next, settings, progress);
  }
  function actionCopy(item, status, selected) { if (!status.unlocked) return secondary() ? "Locked" : "Bloqueado"; if (selected) return item.toggle === "world" ? (secondary() ? "Remove" : "Quitar") : (secondary() ? "Selected" : "En uso"); return item.toggle === "world" ? (secondary() ? "Add" : "Añadir") : (secondary() ? "Use" : "Usar"); }
  function applyItem(item) {
    const status = ILWorldData.unlockStatus(item, ctx()); if (!status.unlocked) return;
    if (item.toggle === "world") { const values = new Set(settings.activeWorldItems || []); if (values.has(item.id)) values.delete(item.id); else { if (values.size >= 8) values.delete(Array.from(values)[0]); values.add(item.id); } settings = ILProfileSettings.save(username, { activeWorldItems:Array.from(values) }); }
    else if (item.settingKey) settings = ILProfileSettings.save(username, { [item.settingKey]:item.settingValue });
    renderScene(true); renderCatalog(); ILToast(secondary() ? itemName(item) + " updated" : itemName(item) + " actualizado", { type:"ok", duration:1200 });
  }
  function cardFor(item) {
    const status = ILWorldData.unlockStatus(item, ctx()); const selected = ILWorldData.isSelected(item, settings); const card = document.createElement("article"); card.className = "world-item" + (selected ? " is-selected" : "") + (!status.unlocked ? " is-locked" : "");
    const visual = document.createElement("div"); visual.className = "world-item__visual"; visual.innerHTML = ILWorldVisual.item(item, settings, progress); if (!status.unlocked) { const lock = document.createElement("span"); lock.className = "world-item__lock"; lock.innerHTML = ILIcon("lock"); lock.setAttribute("aria-hidden", "true"); visual.appendChild(lock); }
    const title = document.createElement("h3"); title.textContent = itemName(item); const detail = document.createElement("p"); detail.className = "world-item__status" + (status.unlocked ? " is-available" : ""); detail.textContent = status.unlocked ? (selected ? (secondary() ? "Currently active" : "Ahora mismo") : (secondary() ? "Available" : "Disponible")) : status.requirement;
    const action = document.createElement("button"); action.type = "button"; action.className = "world-item__action" + (selected ? " is-selected" : ""); action.textContent = actionCopy(item, status, selected); action.disabled = !status.unlocked || (selected && !item.toggle); action.setAttribute("aria-label", action.textContent + ": " + itemName(item)); if (!action.disabled) action.addEventListener("click", () => applyItem(item));
    card.append(visual, title, detail, action); return card;
  }
  function renderCatalog() {
    const host = $("catalogSections"); host.replaceChildren(); ILWorldData.sections(band, activeTab).forEach(section => { const wrap = document.createElement("section"); wrap.className = "catalog-section"; const title = document.createElement("h3"); title.className = "catalog-section__title"; title.textContent = sectionName(section); const tray = document.createElement("div"); tray.className = "world-tray"; ILWorldData.catalogFor(band, activeTab).filter(item => item.section === section).forEach(item => tray.appendChild(cardFor(item))); wrap.append(title, tray); host.appendChild(wrap); });
    $("catalogPanel").setAttribute("aria-labelledby", "tab-" + activeTab);
  }
  function selectTab(tab, focus) { activeTab = TABS.indexOf(tab) >= 0 ? tab : "avatar"; document.querySelectorAll("[data-world-tab]").forEach(button => { const current = button.dataset.worldTab === activeTab; button.setAttribute("aria-selected", String(current)); button.tabIndex = current ? 0 : -1; if (current && focus) button.focus(); }); renderCatalog(); }
  function setupTabs() { document.querySelectorAll("[data-world-tab]").forEach(button => { button.addEventListener("click", () => selectTab(button.dataset.worldTab)); button.addEventListener("keydown", event => { if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return; event.preventDefault(); const current = TABS.indexOf(activeTab); selectTab(TABS[(current + (event.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length], true); }); }); }
  function applyReveal() { if (!revealItem) return; applyItem(revealItem); $("unlockDialog").close(); }
  function revealNewUnlock() {
    const unlocked = ILWorldData.unlockedItems(progress, stampIds, band).filter(item => item.unlock.type !== "always"); const seen = new Set(settings.seenUnlocks || []); const fresh = unlocked.filter(item => !seen.has(item.id)).sort((a,b) => (b.unlock.value || 0) - (a.unlock.value || 0)); if (!fresh.length) return;
    revealItem = fresh[0]; settings = ILProfileSettings.save(username, { seenUnlocks:Array.from(new Set((settings.seenUnlocks || []).concat(unlocked.map(item => item.id)))) }); $("unlockTitle").textContent = itemName(revealItem); $("unlockVisual").innerHTML = ILWorldVisual.item(revealItem, settings, progress); const dialog = $("unlockDialog"); dialog.showModal(); requestAnimationFrame(() => $("unlockTry").focus());
  }
  function setupDialog() { $("unlockTry").addEventListener("click", applyReveal); $("unlockContinue").addEventListener("click", () => $("unlockDialog").close()); $("unlockDialog").addEventListener("cancel", event => { event.preventDefault(); $("unlockDialog").close(); }); }
  function stampList(learning, medals) { return Array.from(new Set((learning.stamps.items || []).filter(item => item.unlocked).map(item => item.id).concat((medals || []).filter(item => item.earned).map(item => item.id)))); }
  (async function init() {
    try { const profile = await ILAuth.getProfile(); if (!profile) { location.href = "index.html"; return; } if (profile.is_admin) { location.href = "admin.html"; return; } username = profile.username || ""; IL_ETAPA.apply(profile); band = IL_ETAPA.current().band; settings = ILProfileSettings.setActive(username); const loaded = await Promise.all([ILAuth.getProgress(), ILProgressData.load(ILAuth, window.ILMission, { ageMode:IL_ETAPA.current().mode }), ILAuth.listMedals()]); progress = loaded[0] || {}; stampIds = stampList(loaded[1], loaded[2]); localise(); setupTabs(); setupDialog(); renderScene(); renderOverview(); selectTab("avatar"); ILLayout.mount(); $("loading").hidden = true; $("app").classList.remove("hidden"); setTimeout(revealNewUnlock, 280); }
    catch (error) { console.error("No se pudo cargar Mi Mundo", error); $("loading").hidden = true; $("errorState").hidden = false; }
  })();
})();
