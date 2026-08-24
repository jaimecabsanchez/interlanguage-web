(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  let band = "p56";

  function firstName(profile) { return String(profile.full_name || "Alumno").trim().split(/\s+/)[0] || "Alumno"; }
  function stageCopy() {
    if (band === "p12") {
      $("profileTitle").textContent = "Mi espacio"; $("identityLabel").textContent = "ESTE SOY YO";
      $("stampsEyebrow").textContent = "MIS LOGROS"; $("worldEntryTitle").textContent = "¡Mi mundo está creciendo!";
      $("worldEntryCopy").textContent = "Entra para cambiar tu avatar y tu jardín.";
    } else if (band === "p34") {
      $("profileTitle").textContent = "Mi espacio"; $("worldEntryTitle").textContent = "Descubre tu mundo";
    } else if (band === "eso") {
      document.documentElement.lang = "en"; document.title = "Profile · Interlanguage HOME";
      $("profileEyebrow").textContent = "PERSONAL SPACE"; $("profileTitle").textContent = "Profile"; $("identityLabel").textContent = "YOUR PROFILE";
      $("stampsEyebrow").textContent = "ACHIEVEMENTS"; $("stampsTitle").textContent = "Your stamps"; $("allStampsLink").textContent = "View all";
      $("worldEntryEyebrow").textContent = "YOUR SPACE"; $("worldEntryTitle").textContent = "Make it yours"; $("worldEntryCopy").textContent = "Your avatar is assigned. Grow and shape your study space."; $("worldEntryCta").textContent = "Open";
      $("settingsEntryTitle").textContent = "Settings"; $("settingsEntryCopy").textContent = "Audio, accessibility and account";
    }
  }
  function mergeStamps(learning, medals) {
    const result = []; const seen = new Set();
    (learning.stamps.items || []).filter(item => item.unlocked).concat((medals || []).filter(item => item.earned)).forEach(item => {
      if (!item || seen.has(item.id)) return; seen.add(item.id); result.push(item);
    });
    return result.slice(0, 5);
  }
  function renderStamps(items) {
    const host = $("profileStamps"); host.replaceChildren();
    if (!items.length) { const empty = document.createElement("p"); empty.className = "profile-stamps__empty"; empty.textContent = band === "eso" ? "Your first achievement is close." : "Tu primer sello está muy cerca."; host.appendChild(empty); return; }
    items.forEach(item => {
      const card = document.createElement("div"); card.className = "profile-stamp";
      const visual = document.createElement("div"); visual.className = "profile-stamp__visual"; visual.innerHTML = ILVisual.stamp(item.id, { locked:false });
      const stampNames = { streak_2:"2-day streak", streak_5:"5-day streak", streak_10:"10-day streak", streak_30:"30-day streak", aciertos_5:"5 correct in a row", aciertos_10:"10 correct in a row", pleno:"Perfect session", record_racha:"New streak record", primera:"First lesson", diez_lecciones:"10 lessons" };
      const name = document.createElement("b"); name.textContent = band === "eso" && stampNames[item.id] ? stampNames[item.id] : item.name; card.append(visual, name); host.appendChild(card);
    });
  }
  function activeItems(settings, progress, stamps) {
    const ctx = ILWorldData.context(progress, stamps, band); const requested = new Set(settings.activeWorldItems || []);
    return ILWorldData.catalogFor(band, "world").filter(item => item.toggle === "world" && requested.has(item.id) && ILWorldData.unlockStatus(item, ctx).unlocked).map(item => item.id);
  }

  (async function init() {
    try {
      const profile = await ILAuth.getProfile();
      if (!profile) { location.href = "index.html"; return; }
      if (profile.is_admin) { location.href = "admin.html"; return; }
      if (profile.must_change_password) { location.href = "cambiar-clave.html"; return; }
      const username = profile.username || ""; const settings = ILProfileSettings.setActive(username, profile.sex);
      IL_ETAPA.apply(profile); band = IL_ETAPA.current().band; stageCopy();
      const [learning, progress, medals] = await Promise.all([
        ILProgressData.load(ILAuth, window.ILMission, { ageMode:IL_ETAPA.current().mode, ageBand:IL_ETAPA.current().band }), ILAuth.getProgress(), ILAuth.listMedals()
      ]);
      if (!learning || !progress) throw new Error("No profile data");
      const stamps = mergeStamps(learning, medals); const stampIds = stamps.map(item => item.id); const summary = learning.profileSummary;
      $("profileName").textContent = firstName(profile); $("productLevel").textContent = summary.levelName;
      if ((band === "p56" || band === "eso") && summary.approximateLevel) { $("approxLevel").hidden = false; $("approxLevel").textContent = summary.approximateLevel; }
      const pct = summary.levelProgress == null ? 8 : summary.levelProgress; const next = summary.nextLevel || "Siguiente nivel";
      $("levelProgressText").textContent = summary.levelProgress == null ? (band === "eso" ? "Your next level starts here" : "Tu siguiente nivel empieza aquí") : pct + "% " + (band === "eso" ? "to " : "para ") + next;
      $("levelProgress").style.setProperty("--profile-progress", pct + "%"); $("levelProgress").setAttribute("aria-valuenow", String(pct)); $("levelProgress").setAttribute("aria-label", $("levelProgressText").textContent);
      $("profileAvatar").innerHTML = ILWorldVisual.avatar(settings, progress); $("profileWorldAvatar").innerHTML = ILWorldVisual.avatar(settings, progress);
      const level = ILWorldData.worldLevel(progress); const objects = activeItems(settings, progress, stampIds);
      $("profileWorldScene").innerHTML = ILWorldVisual.scene(settings, progress, band, { level, activeItems:objects });
      $("worldLevelPill").textContent = (band === "eso" ? "Space level " : (band === "p56" ? "Base nivel " : "Jardín nivel ")) + level;
      renderStamps(stamps); ILLayout.mount();
      $("loading").hidden = true; $("app").classList.remove("hidden");
    } catch (error) {
      console.error("No se pudo cargar Perfil", error); $("loading").hidden = true; $("errorState").hidden = false;
    }
  })();
})();
