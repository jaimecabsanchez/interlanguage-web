(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  let username = "";
  let settings = null;
  let learning = null;
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
      $("profilePageSubtitle").textContent = "Tu avatar, tus logros y la forma en la que más te gusta aprender.";
      $("nemoCopy").textContent = "Nemo te dará pistas sencillas y celebrará tus avances.";
    } else if (mode === "primary-upper") {
      $("nemoCopy").textContent = "Una ayuda discreta para orientarte cuando la necesites.";
    } else {
      $("profileEyebrow").textContent = "ACCOUNT & PREFERENCES";
      $("profilePageSubtitle").textContent = "Consulta tu nivel, personaliza la experiencia y gestiona tus preferencias.";
      $("nemoGuide").setAttribute("aria-hidden", "true");
    }
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
      learning = await ILProgressData.load(ILAuth, window.ILMission);
      if (!learning) throw new Error("No profile data");
      renderIdentity(profile); renderHighlights(); renderPersonalization(); renderSettings(); renderExperience(ageMode); setupControls(); setupPrivacy();
      $("logout").addEventListener("click", async () => { ILProfileSettings.clearActive(); await ILAuth.signOut(); location.href = "index.html"; });
      if (window.ILLayout) window.ILLayout.mount();
      $("loading").hidden = true; $("app").classList.remove("hidden");
    } catch (error) {
      console.error("No se pudo cargar Perfil", error); $("loading").hidden = true; $("errorState").hidden = false;
    }
  })();
})();
