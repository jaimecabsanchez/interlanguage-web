(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  let username = "";
  let settings = null;
  let learning = null;
  let gameProgress = { owned:[], hat:"", acc:"" };
  let saveTimer = null;

  function unlockedStamps() { return learning.stamps.items.filter(stamp => stamp.unlocked); }
  function stampById(id) { return learning.stamps.items.find(stamp => stamp.id === id) || null; }
  function preferredStamp() {
    const unlocked = unlockedStamps();
    return stampById(settings.featuredStamp) || unlocked.find(stamp => stamp.id === "weekly-explorer") || unlocked[0] || learning.stamps.next;
  }
  function announceSaved() {
    clearTimeout(saveTimer); $("saveStatus").textContent = "Cambios guardados";
    saveTimer = setTimeout(() => { $("saveStatus").textContent = ""; }, 1800);
  }
  function persist(patch) {
    settings = ILProfileSettings.save(username, patch);
    renderSettings(); renderHighlights(); announceSaved();
  }

  function renderIdentity(profile) {
    const summary = learning.profileSummary;
    $("profileName").textContent = profile.full_name || "Alumno";
    $("avatarVisual").setAttribute("aria-label", "Avatar de " + (profile.full_name || "alumno"));
    $("productLevel").textContent = summary.levelName;
    $("approxLevel").textContent = summary.approximateLevel ? "Nivel aproximado: " + summary.approximateLevel : "Nivel aproximado por descubrir";
    $("learningDescription").textContent = summary.description;
    const progress = summary.levelProgress;
    const progressNode = $("levelProgress");
    if (progress == null) {
      progressNode.style.setProperty("--il-level-progress", "8%");
      progressNode.removeAttribute("aria-valuenow");
      progressNode.setAttribute("aria-label", "El progreso al siguiente nivel aparecerá cuando haya evidencia suficiente");
      $("levelProgressCopy").textContent = "Tu siguiente nivel se irá acercando con cada misión";
    } else {
      progressNode.style.setProperty("--il-level-progress", progress + "%");
      progressNode.setAttribute("aria-valuenow", progress);
      progressNode.setAttribute("aria-label", progress + "% hasta " + summary.nextLevel);
      $("levelProgressCopy").textContent = progress + "% hasta " + summary.nextLevel;
    }
    $("username").textContent = profile.username || "—";
  }

  function renderHighlights() {
    $("dailyGoalDisplay").textContent = settings.dailyGoal;
    const featured = preferredStamp();
    $("featuredStampName").textContent = featured ? featured.name : "Tu primer sello está cerca";
  }

  function renderPersonalization() {
    $("avatarVisual").dataset.avatarTheme = settings.avatarTheme;
    if (window.ILWorldVisual) {
      $("avatarVisual").innerHTML = ILWorldVisual.avatar(settings, gameProgress) + '<span class="avatar-plane" aria-hidden="true">' + (window.ILIcon ? ILIcon("plane") : "") + '</span>';
    }
    document.querySelectorAll("[data-avatar-theme]").forEach(button => {
      if (button.id === "avatarVisual") return;
      button.setAttribute("aria-pressed", String(button.dataset.avatarTheme === settings.avatarTheme));
    });
    const stamps = unlockedStamps(); const select = $("featuredStamp"); select.replaceChildren();
    if (!stamps.length) {
      const option = document.createElement("option"); option.value = ""; option.textContent = "Tu primer sello está cerca"; select.appendChild(option); select.disabled = true;
    } else {
      select.disabled = false;
      stamps.forEach(stamp => { const option = document.createElement("option"); option.value = stamp.id; option.textContent = stamp.name; select.appendChild(option); });
      const preferred = preferredStamp(); select.value = preferred && preferred.unlocked ? preferred.id : stamps[0].id;
    }
    const total = 3 + stamps.length;
    $("unlockedCount").textContent = total + " desbloqueados";
    $("badgeLibraryCount").textContent = stamps.length + (stamps.length === 1 ? " sello conseguido" : " sellos conseguidos");
  }

  function updateSwitch(input) {
    const state = input.closest(".switch-control").querySelector(".switch-state");
    state.textContent = input.checked ? "Activado" : "Desactivado";
  }
  function renderSettings() {
    document.querySelectorAll("[data-setting]").forEach(control => {
      const value = settings[control.dataset.setting];
      if (control.type === "checkbox") { control.checked = !!value; updateSwitch(control); }
      else control.value = String(value);
    });
    $("settingAutoplay").disabled = !settings.sound;
    $("settingSpeed").disabled = !settings.sound;
    ILProfileSettings.apply(settings);
    $("avatarVisual").dataset.avatarTheme = settings.avatarTheme;
  }

  function setupControls() {
    document.querySelectorAll("[data-avatar-theme]").forEach(button => {
      if (button.id === "avatarVisual") return;
      button.addEventListener("click", () => { persist({ avatarTheme: button.dataset.avatarTheme }); renderPersonalization(); });
    });
    $("featuredStamp").addEventListener("change", event => { persist({ featuredStamp: event.target.value }); });
    document.querySelectorAll("[data-setting]").forEach(control => {
      control.addEventListener("change", () => {
        let value = control.type === "checkbox" ? control.checked : control.value;
        if (control.dataset.setting === "audioSpeed" || control.dataset.setting === "dailyGoal") value = Number(value);
        persist({ [control.dataset.setting]: value });
      });
    });
  }

  function setupPrivacy() {
    const dialog = $("privacyDialog");
    $("privacyButton").addEventListener("click", () => { dialog.showModal(); requestAnimationFrame(() => $("privacyClose").focus()); });
    $("privacyClose").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  }

  function renderExperience(mode) {
    if (mode === "primary-young") {
      $("profileEyebrow").textContent = "MI ESPACIO";
      $("profilePageSubtitle").textContent = "Tu avatar y tus cosas.";
    } else if (mode !== "primary-upper") {
      $("profileEyebrow").textContent = "ACCOUNT & PREFERENCES";
      $("profilePageSubtitle").textContent = "Consulta tu nivel, personaliza la experiencia y gestiona tus preferencias.";
      if (learning && learning.isDemo) {
        $("learningDescription").textContent = "Estás aprendiendo a desenvolverte en planes, conversaciones y situaciones cotidianas.";
      }
      $("profileWorldTitle").textContent = "Personalise";
      $("profileWorldCopy").textContent = "Use your progress to unlock themes and shape your personal space.";
    }
  }

  // ---- PRIMARIA INICIAL · Perfil en dos niveles ("mi personaje y mis cosas") ----
  const YP_ILLO = {
    hat: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M11 30c0-9 6-15 13-15s13 6 13 15z" fill="var(--il-primary)"/><rect x="8" y="30" width="32" height="5" rx="2.5" fill="var(--il-secondary)"/></svg>',
    backpack: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 21c0-7 5-11 11-11s11 4 11 11v15a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4z" fill="var(--il-secondary)"/><path d="M13 27h22v6H13z" fill="var(--il-coral-ink)"/><rect x="20" y="29" width="8" height="8" rx="2" fill="#fff"/></svg>',
    headphones: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 27v-3a11 11 0 0 1 22 0v3" fill="none" stroke="var(--il-primary)" stroke-width="3.4" stroke-linecap="round"/><rect x="10" y="26" width="7" height="12" rx="3" fill="var(--il-secondary)"/><rect x="31" y="26" width="7" height="12" rx="3" fill="var(--il-secondary)"/></svg>',
    school: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="11" y="23" width="26" height="15" rx="2" fill="var(--il-primary)"/><path d="M24 11l15 12H9z" fill="var(--il-secondary)"/><rect x="21" y="29" width="6" height="9" fill="#fff"/></svg>',
    city: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="21" width="8" height="17" fill="var(--il-primary)"/><rect x="20" y="15" width="8" height="23" fill="var(--il-secondary)"/><rect x="30" y="25" width="8" height="13" fill="var(--il-primary)"/></svg>',
    space: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="21" cy="27" r="10" fill="var(--il-primary)"/><ellipse cx="21" cy="27" rx="15" ry="4.5" fill="none" stroke="var(--il-secondary)" stroke-width="2.4" transform="rotate(-20 21 27)"/><path d="M35 12l1.4-3 1.4 3 3 1.4-3 1.4-1.4 3-1.4-3-3-1.4z" fill="#F6B93B"/></svg>'
  };

  function ypTile(row, def, selected, onPick, onLocked) {
    const btn = document.createElement("button"); btn.type = "button";
    btn.className = "yp-tile" + (def.locked ? " is-locked" : "") + (selected ? " is-selected" : "");
    btn.setAttribute("aria-pressed", String(!!selected));
    btn.setAttribute("aria-label", def.name + (def.locked ? " (bloqueado)" : ""));
    const art = document.createElement("span"); art.className = "yp-tile__art";
    if (def.color) { art.classList.add("yp-tile__art--color"); art.style.background = def.color; }
    else art.innerHTML = YP_ILLO[def.illo] || "";
    if (def.locked) { const lk = document.createElement("span"); lk.className = "yp-tile__lock"; lk.innerHTML = (window.ILIcon ? window.ILIcon("lock") : ""); art.appendChild(lk); }
    const name = document.createElement("span"); name.className = "yp-tile__name"; name.textContent = def.name;
    btn.append(art, name);
    btn.addEventListener("click", () => { if (def.locked) onLocked(def); else onPick(def, btn); });
    row.appendChild(btn);
  }

  function applyYoungProfile() {
    const lessons = (learning && learning.lessons) || 0;
    const stamps = unlockedStamps();
    const has = id => stamps.some(s => s.id === id);

    // HERO: avatar grande + nivel + progreso + "N sellos" (fuera texto analítico)
    const section = document.querySelector(".personalize-section");
    document.querySelector(".profile-page-header").setAttribute("hidden", "");
    const sealsHi = document.querySelector(".highlight-icon--stamp");
    if (sealsHi) { const box = sealsHi.parentElement; box.querySelector("small").textContent = "Mis sellos"; box.querySelector("strong").textContent = stamps.length + (stamps.length === 1 ? " sello" : " sellos"); }

    // PERSONALIZA TU AVATAR (categorías visuales)
    const heading = section.querySelector(".section-heading");
    heading.querySelector(".ui-label").textContent = "Tus cosas";
    heading.querySelector("h2").textContent = "Personaliza tu avatar";
    const uc = document.getElementById("unlockedCount"); if (uc && uc.closest(".unlock-count")) uc.closest(".unlock-count").setAttribute("hidden", "");

    const yp = document.createElement("div"); yp.className = "yp";
    yp.innerHTML = '<div class="yp-cat"><p class="yp-cat__label">Color</p><div class="yp-row" id="ypColor"></div></div>'
      + '<div class="yp-cat"><p class="yp-cat__label">Accesorio</p><div class="yp-row" id="ypAcc"></div></div>'
      + '<div class="yp-cat"><p class="yp-cat__label">Fondo</p><div class="yp-row" id="ypBg"></div></div>'
      + '<div class="yp-cat"><p class="yp-cat__label">Sello favorito</p><div class="yp-row" id="ypSeal"></div></div>'
      + '<p class="yp-hint" id="ypHint" aria-live="polite" hidden></p>';
    section.appendChild(yp);
    const hint = document.getElementById("ypHint");
    const showHint = def => { hint.textContent = def.hintText; hint.hidden = false; };
    const clearHint = () => { hint.hidden = true; };

    // Color (funcional: cambia el tema del avatar)
    const colors = [
      { id: "navy", name: "Azul", color: "var(--il-primary)" },
      { id: "coral", name: "Coral", color: "var(--il-secondary)" },
      { id: "aqua", name: "Verde", color: "var(--il-success)" }
    ];
    const colorRow = document.getElementById("ypColor");
    function drawColors() {
      colorRow.replaceChildren();
      colors.forEach(c => ypTile(colorRow, c, settings.avatarTheme === c.id, () => { persist({ avatarTheme: c.id }); clearHint(); drawColors(); }, () => {}));
    }
    drawColors();

    // Accesorio y Fondo (colección desbloqueable con la práctica; sin monedas)
    const accessories = [
      { id: "hat", name: "Gorro", illo: "hat", locked: false },
      { id: "headphones", name: "Auriculares", illo: "headphones", locked: lessons < 3, hintText: "Completa 3 misiones para desbloquear los auriculares." },
      { id: "backpack", name: "Mochila", illo: "backpack", locked: !(has("first-flight") || lessons >= 6), hintText: "Consigue el sello First Flight (o completa 6 misiones) para la mochila." }
    ];
    const backgrounds = [
      { id: "school", name: "Cole", illo: "school", locked: false },
      { id: "city", name: "Ciudad", illo: "city", locked: lessons < 5, hintText: "Completa 5 misiones para desbloquear la ciudad." },
      { id: "space", name: "Espacio", illo: "space", locked: lessons < 30, hintText: "Completa 30 misiones para desbloquear el espacio." }
    ];
    const accRow = document.getElementById("ypAcc");
    function drawAcc() { accRow.replaceChildren(); accessories.forEach(a => ypTile(accRow, a, settings.accessory === a.id, def => { persist({ accessory: def.id }); clearHint(); drawAcc(); }, showHint)); }
    drawAcc();
    const bgRow = document.getElementById("ypBg");
    function drawBg() { bgRow.replaceChildren(); backgrounds.forEach(b => ypTile(bgRow, b, settings.background === b.id, def => { persist({ background: def.id }); clearHint(); drawBg(); }, showHint)); }
    drawBg();

    // Sello favorito (funcional): sellos conseguidos como fichas visuales
    const sealRow = document.getElementById("ypSeal");
    function drawSeals() {
      sealRow.replaceChildren();
      if (!stamps.length) { const p = document.createElement("p"); p.className = "yp-empty"; p.textContent = "¡Tu primer sello está muy cerca!"; sealRow.appendChild(p); return; }
      stamps.forEach(s => {
        const btn = document.createElement("button"); btn.type = "button";
        btn.className = "yp-seal" + (settings.featuredStamp === s.id ? " is-selected" : "");
        btn.setAttribute("aria-pressed", String(settings.featuredStamp === s.id));
        btn.innerHTML = '<span class="yp-seal__mark">' + (window.ILVisual ? window.ILVisual.stamp(s.id, { locked: false }) : (window.ILIcon ? window.ILIcon(s.icon) : "")) + '</span><span class="yp-seal__name">' + s.name + '</span>';
        btn.addEventListener("click", () => { persist({ featuredStamp: s.id }); clearHint(); drawSeals(); });
        sealRow.appendChild(btn);
      });
    }
    drawSeals();

    // NIVEL 2 · Ajustes y Cuenta en una pantalla secundaria (se mueven aquí sus secciones reales)
    const settingsSection = document.querySelector(".settings-section");
    const accountSection = document.querySelector(".account-section");
    const dialog = document.createElement("dialog"); dialog.className = "kid-settings-dialog"; dialog.id = "kidSettings";
    const head = document.createElement("div"); head.className = "kid-settings__head";
    head.innerHTML = '<h2>Ajustes y cuenta</h2><button type="button" class="dialog-close" id="kidSettingsClose" aria-label="Cerrar"><span data-il-icon="close"></span></button>';
    dialog.appendChild(head);
    if (settingsSection) dialog.appendChild(settingsSection);
    if (accountSection) dialog.appendChild(accountSection);
    document.body.appendChild(dialog);

    const entry = document.createElement("div"); entry.className = "yp-nivel2";
    entry.innerHTML = '<button type="button" class="yp-entry" id="openSettings"><span class="yp-entry__ic"><span data-il-icon="target" aria-hidden="true"></span></span><span>Ajustes</span><span class="yp-entry__go" aria-hidden="true">›</span></button>'
      + '<a class="yp-entry" href="familias.html"><span class="yp-entry__ic"><span data-il-icon="shield" aria-hidden="true"></span></span><span>Zona familias</span><span class="yp-entry__go" aria-hidden="true">›</span></a>';
    section.appendChild(entry);
    if (window.ILLayout) window.ILLayout.mount();
    document.getElementById("openSettings").addEventListener("click", () => { if (dialog.showModal) dialog.showModal(); else dialog.setAttribute("open", ""); requestAnimationFrame(() => document.getElementById("kidSettingsClose").focus()); });
    document.getElementById("kidSettingsClose").addEventListener("click", () => dialog.close ? dialog.close() : dialog.removeAttribute("open"));
    dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  }

  (async function init() {
    try {
      const profile = await ILAuth.getProfile();
      if (!profile) { location.href = "index.html"; return; }
      if (profile.is_admin) { location.href = "admin.html"; return; }
      if (profile.must_change_password) { location.href = "cambiar-clave.html"; return; }
      username = profile.username || "";
      settings = ILProfileSettings.setActive(username);
      IL_ETAPA.apply(profile);
      const ageMode = IL_ETAPA.current().mode;
      const loaded = await Promise.all([ILProgressData.load(ILAuth, window.ILMission, { ageMode: ageMode }), ILAuth.getProgress()]);
      learning = loaded[0]; gameProgress = loaded[1] || gameProgress;
      if (!learning) throw new Error("No profile data");
      renderIdentity(profile); renderHighlights(); renderPersonalization(); renderSettings(); renderExperience(ageMode); setupControls(); setupPrivacy();
      $("logout").addEventListener("click", async () => { ILProfileSettings.clearActive(); await ILAuth.signOut(); location.href = "index.html"; });
      if (ageMode === "primary-young") applyYoungProfile();
      if (window.ILLayout) window.ILLayout.mount();
      $("loading").hidden = true; $("app").classList.remove("hidden");
    } catch (error) {
      console.error("No se pudo cargar Perfil", error); $("loading").hidden = true; $("errorState").hidden = false;
    }
  })();
})();
