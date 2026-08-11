(function () {
  "use strict";
  const $ = id => document.getElementById(id); let username = ""; let settings = null; let saveTimer = null; let band = "p56";
  function updateSwitch(input) { input.closest(".switch-control").querySelector(".switch-state").textContent = input.checked ? (band === "eso" ? "On" : "Activado") : (band === "eso" ? "Off" : "Desactivado"); }
  function render() {
    document.querySelectorAll("[data-setting]").forEach(control => { const value = settings[control.dataset.setting]; if (control.type === "checkbox") { control.checked = !!value; updateSwitch(control); } else control.value = String(value); });
    $("settingAutoplay").disabled = !settings.sound; $("settingSpeed").disabled = !settings.sound; ILProfileSettings.apply(settings);
  }
  function save(patch) { settings = ILProfileSettings.save(username, patch); render(); clearTimeout(saveTimer); $("saveStatus").textContent = band === "eso" ? "Saved" : "Guardado"; saveTimer = setTimeout(() => $("saveStatus").textContent = "", 1600); }
  function localise() {
    if (band !== "eso") return; document.documentElement.lang = "en"; document.title = "Settings · Interlanguage HOME"; $("backLabel").textContent = "Profile"; $("settingsEyebrow").textContent = "PREFERENCES"; $("settingsTitle").textContent = "Settings"; $("settingsSubtitle").textContent = "Choose how you listen, read and use the platform."; $("practiceSettingsTitle").textContent = "Your learning experience"; $("accountTitle").textContent = "Access and support"; $("privacyClose").setAttribute("aria-label", "Close"); document.querySelectorAll("[data-en]").forEach(element => element.textContent = element.dataset.en);
  }
  function setup() {
    document.querySelectorAll("[data-setting]").forEach(control => control.addEventListener("change", () => { let value = control.type === "checkbox" ? control.checked : control.value; if (control.dataset.setting === "audioSpeed" || control.dataset.setting === "dailyGoal") value = Number(value); save({ [control.dataset.setting]:value }); }));
    const dialog = $("privacyDialog"); $("privacyButton").addEventListener("click", () => { dialog.showModal(); requestAnimationFrame(() => $("privacyClose").focus()); }); $("privacyClose").addEventListener("click", () => dialog.close()); dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
    $("logout").addEventListener("click", async () => { ILProfileSettings.clearActive(); await ILAuth.signOut(); location.href = "index.html"; });
  }
  (async function init() {
    try { const profile = await ILAuth.getProfile(); if (!profile) { location.href = "index.html"; return; } if (profile.is_admin) { location.href = "admin.html"; return; } username = profile.username || ""; IL_ETAPA.apply(profile); band = IL_ETAPA.current().band; settings = ILProfileSettings.setActive(username, profile.sex); $("username").textContent = username || "—"; localise(); render(); setup(); ILLayout.mount(); $("loading").hidden = true; $("app").classList.remove("hidden"); }
    catch (error) { console.error("No se pudieron cargar Ajustes", error); $("loading").hidden = true; $("errorState").hidden = false; }
  })();
})();
