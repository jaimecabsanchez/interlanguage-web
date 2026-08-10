(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  let username = "";
  let band = "p56";
  let progress = { gems:0, owned:[], hat:"", acc:"" };
  let settings = null;
  let busy = false;

  function isSecondary() { return band === "eso"; }
  function itemName(item) { return isSecondary() && item.nameEn ? item.nameEn : item.name; }
  function itemDescription(item) { return isSecondary() && item.descriptionEn ? item.descriptionEn : item.description; }
  function copy() {
    if (isSecondary()) {
      document.documentElement.lang = "en";
      $("worldEyebrow").textContent = "PERSONAL SPACE";
      $("worldTitle").textContent = "Personalise";
      $("worldSubtitle").textContent = "Use your progress to shape a space that feels like yours.";
      $("nextLabel").textContent = "NEXT UNLOCK";
      $("catalogEyebrow").textContent = "YOUR COLLECTION";
      $("catalogTitle").textContent = "Choose your next unlock";
      $("avatarEditorTitle").textContent = "Make the avatar yours";
      $("avatarEyebrow").textContent = "YOUR AVATAR";
      $("backProfile").textContent = "Back to profile";
      $("routePointsLabel").textContent = "Route points";
      $("routeBalance").setAttribute("aria-label", "Route points available");
      $("skinLabel").textContent = "Skin tone"; $("hairLabel").textContent = "Hair"; $("hairColorLabel").textContent = "Hair colour"; $("themeLabel").textContent = "Main colour";
      const optionCopy = {
        avatarSkin:["Light","Medium light","Medium dark","Dark"], avatarHair:["Short","Wavy","Curly","Long"],
        avatarHairColor:["Black","Brown","Blonde","Copper"], avatarTheme:["Route blue","Coral","Aqua"]
      };
      Object.keys(optionCopy).forEach(id => Array.from($(id).options).forEach((option,index) => { option.textContent = optionCopy[id][index]; }));
      document.title = "Personalise · Interlanguage HOME";
    }
  }
  function renderScene() {
    $("worldScene").innerHTML = isSecondary() ? ILWorldVisual.personalSpace(progress) : ILWorldVisual.garden(progress);
    $("worldAvatar").innerHTML = ILWorldVisual.avatar(settings, progress);
    $("worldStage").classList.toggle("is-secondary", isSecondary());
    $("avatarEditorPreview").innerHTML = ILWorldVisual.avatar(settings, progress);
  }
  function renderOverview() {
    const points = ILWorldData.balance(progress);
    const next = ILWorldData.nextUnlock(progress, band);
    $("routePoints").textContent = points;
    const ownedCount = ILWorldData.ownedCount(progress, band);
    $("worldOwned").textContent = isSecondary()
      ? ownedCount + (ownedCount === 1 ? " item unlocked" : " items unlocked")
      : ownedCount + (ownedCount === 1 ? " elemento en tu colección" : " elementos en tu colección");
    if (!next) {
      $("worldOverviewTitle").textContent = isSecondary() ? "Collection complete" : "Tu mundo está completo";
      $("nextDescription").textContent = isSecondary() ? "New rewards will be added in future stages." : "Has desbloqueado todo lo disponible en esta etapa.";
      $("nextProgress").style.setProperty("--world-progress", "100%");
      $("nextProgress").setAttribute("aria-valuenow", "100");
      $("nextBalance").textContent = points + (isSecondary() ? " Route points" : " Puntos de ruta");
      $("nextRemaining").textContent = isSecondary() ? "All unlocked" : "Todo desbloqueado";
      return;
    }
    $("worldOverviewTitle").textContent = itemName(next);
    $("nextDescription").textContent = itemDescription(next);
    $("nextProgress").style.setProperty("--world-progress", next.progress + "%");
    $("nextProgress").setAttribute("aria-valuenow", String(next.progress));
    $("nextProgress").setAttribute("aria-label", next.progress + "% " + (isSecondary() ? "towards " : "para desbloquear ") + itemName(next));
    $("nextBalance").textContent = isSecondary()
      ? Math.min(points, next.price) + " of " + next.price + " points"
      : Math.min(points, next.price) + " de " + next.price + " puntos";
    $("nextRemaining").textContent = next.remaining ? (isSecondary() ? next.remaining + " to go" : "Te faltan " + next.remaining) : (isSecondary() ? "Ready to unlock" : "Listo para desbloquear");
  }
  function statusCopy(item, status) {
    if (status === "equipped") return isSecondary() ? "Equipped" : "En uso";
    if (status === "owned") return item.slot ? (isSecondary() ? "Equip" : "Usar") : (isSecondary() ? "Unlocked" : "En tu mundo");
    if (status === "available") return isSecondary() ? "Unlock" : "Desbloquear";
    const short = Math.max(0, item.price - ILWorldData.balance(progress));
    return isSecondary() ? short + " points to go" : "Te faltan " + short;
  }
  function itemCard(item) {
    const status = ILWorldData.status(progress, item);
    const card = document.createElement("article");
    card.className = "world-item" + (status === "owned" || status === "equipped" ? " is-owned" : "");
    const visual = document.createElement("div"); visual.className = "world-item__visual"; visual.innerHTML = ILWorldVisual.item(item);
    const title = document.createElement("h3"); title.textContent = itemName(item);
    const description = document.createElement("p"); description.textContent = itemDescription(item);
    const footer = document.createElement("div"); footer.className = "world-item__footer";
    const price = document.createElement("span"); price.className = "world-price" + (status === "owned" || status === "equipped" ? " is-owned" : "");
    price.innerHTML = ILIcon(status === "owned" || status === "equipped" ? "check" : "route") + "<span></span>";
    price.lastElementChild.textContent = status === "owned" || status === "equipped" ? (isSecondary() ? "Yours" : "Conseguido") : item.price;
    const action = document.createElement("button"); action.type = "button"; action.className = "world-action";
    if (status === "owned" && item.slot) action.classList.add("is-secondary");
    if (status === "equipped") action.classList.add("is-equipped");
    action.textContent = statusCopy(item, status);
    action.disabled = busy || status === "locked" || status === "equipped" || (status === "owned" && !item.slot);
    action.setAttribute("aria-label", action.textContent + ": " + itemName(item));
    if (!action.disabled) action.addEventListener("click", () => act(item, status));
    footer.append(price, action); card.append(visual, title, description, footer); return card;
  }
  function renderCatalog() {
    const host = $("catalogGroups"); host.replaceChildren();
    ILWorldData.groups(band).forEach(group => {
      const items = ILWorldData.catalogFor(band).filter(item => item.group === group.id);
      if (!items.length) return;
      const section = document.createElement("section"); section.setAttribute("aria-labelledby", "group-" + group.id);
      const title = document.createElement("h3"); title.className = "catalog-title"; title.id = "group-" + group.id; title.textContent = group.label;
      const grid = document.createElement("div"); grid.className = "world-grid"; items.forEach(item => grid.appendChild(itemCard(item)));
      section.append(title, grid); host.appendChild(section);
    });
  }
  function renderEditor() {
    document.querySelectorAll("[data-avatar-setting]").forEach(control => { control.value = settings[control.dataset.avatarSetting]; });
  }
  function render() { renderScene(); renderOverview(); renderCatalog(); renderEditor(); if (window.ILLayout) ILLayout.mount(); }

  async function act(item, status) {
    if (busy) return; busy = true; renderCatalog();
    try {
      if (status === "available") {
        const result = await ILAuth.buyItem(item.id, item.price);
        if (!result.ok) { ILToast(isSecondary() ? "You need " + result.short + " more points." : "Te faltan " + result.short + " Puntos de ruta.", { type:"info" }); return; }
        progress.gems = result.gems; progress.owned = result.owned || [];
        if (item.slot) { await ILAuth.equipItem(item.slot, item.id); progress[item.slot] = item.id; }
        ILToast(isSecondary() ? itemName(item) + " unlocked" : "Has desbloqueado " + itemName(item), { type:"ok" });
      } else if (status === "owned" && item.slot) {
        await ILAuth.equipItem(item.slot, item.id); progress[item.slot] = item.id;
        ILToast(isSecondary() ? itemName(item) + " equipped" : itemName(item) + " está en uso", { type:"ok" });
      }
    } catch (error) {
      ILToast(isSecondary() ? "We couldn't save the change." : "No hemos podido guardar el cambio.", { type:"err" });
    } finally { busy = false; render(); }
  }
  function setupEditor() {
    document.querySelectorAll("[data-avatar-setting]").forEach(control => control.addEventListener("change", () => {
      settings = ILProfileSettings.save(username, { [control.dataset.avatarSetting]:control.value });
      renderScene();
      ILToast(isSecondary() ? "Avatar updated" : "Avatar actualizado", { type:"ok", duration:1200 });
    }));
  }

  (async function init() {
    try {
      const profile = await ILAuth.getProfile();
      if (!profile) { location.href = "index.html"; return; }
      if (profile.is_admin) { location.href = "admin.html"; return; }
      username = profile.username || "";
      IL_ETAPA.apply(profile); band = IL_ETAPA.current().band;
      settings = ILProfileSettings.setActive(username);
      progress = await ILAuth.getProgress() || progress;
      copy(); setupEditor(); render();
      $("loading").hidden = true; $("app").classList.remove("hidden");
    } catch (error) {
      console.error("No se pudo cargar Mi mundo", error); $("loading").hidden = true; $("errorState").hidden = false;
    }
  })();
})();
