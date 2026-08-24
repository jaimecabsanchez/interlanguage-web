(function () {
  "use strict";
  const $ = id => document.getElementById(id); let username = ""; let settings = null; let saveTimer = null; let band = "neutral";
  function updateSwitch(input) { input.closest(".switch-control").querySelector(".switch-state").textContent = input.checked ? (band === "eso" ? "On" : "Activado") : (band === "eso" ? "Off" : "Desactivado"); }
  function render() {
    document.querySelectorAll("[data-setting]").forEach(control => { const value = settings[control.dataset.setting]; if (control.type === "checkbox") { control.checked = !!value; updateSwitch(control); } else control.value = String(value); });
    $("settingAutoplay").disabled = !settings.sound; $("settingSpeed").disabled = !settings.sound; if ($("settingVoice")) $("settingVoice").disabled = !settings.sound; ILProfileSettings.apply(settings);
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
  // --- Selector de voz: muestra voces inglesas naturales, oculta las "novelty" ---
  const VOICE_PREF = ["ava", "zoe", "evan", "noelle", "nathan", "joelle", "jamie", "serena", "kate", "google us english", "google uk english female", "microsoft aria", "microsoft jenny", "samantha", "allison", "susan", "karen", "moira", "tessa", "daniel", "arthur", "google uk english male", "microsoft guy", "alex"];
  function voiceQuality(v) { const n = (v.name || "").toLowerCase(); if (/premium/.test(n)) return 5; if (/siri/.test(n)) return 4; if (/enhanced/.test(n)) return 3; if (/neural|natural/.test(n)) return 2; if (v.localService === false) return 1; return 0; }
  const VOICE_BLOCK = ["albert", "bahh", "boing", "bubbles", "cellos", "deranged", "jester", "organ", "superstar", "trinoids", "whisper", "wobble", "zarvox", "fred", "ralph", "junior", "kathy", "flo", "grandma", "grandpa", "rocko", "shelley", "sandy", "eddy", "reed", "rishi", "bruce", "agnes", "victoria", "bells", "good news", "bad news"];
  function accentCode(lang) { lang = (lang || "").toLowerCase(); if (/en[-_]us/.test(lang)) return "US"; if (/en[-_]gb/.test(lang)) return "UK"; if (/en[-_]au/.test(lang)) return "AU"; if (/en[-_]ie/.test(lang)) return "IE"; if (/en[-_]za/.test(lang)) return "ZA"; if (/en[-_]in/.test(lang)) return "IN"; if (/en[-_]ca/.test(lang)) return "CA"; return "EN"; }
  function goodVoices() {
    let vs = []; try { vs = window.speechSynthesis.getVoices() || []; } catch (e) { return []; }
    return vs.filter(v => {
      if (!/^en[-_]?/i.test(v.lang || "")) return false;
      const n = (v.name || "").toLowerCase();
      if (VOICE_BLOCK.some(b => n === b || n.indexOf(" " + b) !== -1)) return false;
      return VOICE_PREF.some(p => n.indexOf(p) !== -1) || /natural|neural|enhanced|premium|siri/i.test(n) || v.localService === false;
    }).sort((a, b) => {
      const q = voiceQuality(b) - voiceQuality(a); if (q) return q; // premium/natural primero
      const ia = VOICE_PREF.findIndex(p => a.name.toLowerCase().indexOf(p) !== -1);
      const ib = VOICE_PREF.findIndex(p => b.name.toLowerCase().indexOf(p) !== -1);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.name.localeCompare(b.name);
    });
  }
  function populateVoices() {
    const sel = $("settingVoice"); if (!sel) return;
    Array.prototype.slice.call(sel.querySelectorAll("option")).forEach(o => { if (o.value !== "") o.remove(); });
    goodVoices().forEach(v => { const o = document.createElement("option"); o.value = v.name; o.textContent = v.name.replace(/\s*\(.*\)$/, "") + " · " + accentCode(v.lang); sel.appendChild(o); });
    const want = (settings && settings.voiceName) || "";
    sel.value = Array.prototype.some.call(sel.options, o => o.value === want) ? want : "";
  }
  (async function init() {
    try { const profile = await ILAuth.getProfile(); if (!profile) { location.href = "index.html"; return; } if (profile.is_admin) { location.href = "admin.html"; return; } username = profile.username || ""; IL_ETAPA.apply(profile); band = IL_ETAPA.current().band; settings = ILProfileSettings.setActive(username, profile.sex); $("username").textContent = username || "—"; localise(); render(); setup(); populateVoices(); try { window.speechSynthesis.addEventListener("voiceschanged", populateVoices); } catch (e) {} ILLayout.mount(); $("loading").hidden = true; $("app").classList.remove("hidden"); }
    catch (error) { console.error("No se pudieron cargar Ajustes", error); $("loading").hidden = true; $("errorState").hidden = false; }
  })();
})();
