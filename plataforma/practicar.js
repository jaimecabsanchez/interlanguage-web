(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const SKILL_ICON = { listening:"ear", vocabulary:"books", grammar:"grammar", reading:"book", writing:"pencil", speaking:"chat" };
  let band = "neutral";

  function copy(key, params) { return ILCopy.practice(key, band, params); }
  function firstName(profile) { return String(profile.full_name || profile.username || "").trim().split(/\s+/)[0] || ""; }
  function assignedUnits(units, experience) {
    const ids = experience && experience.unitIds;
    return Array.isArray(ids) && ids.length ? units.filter(unit => ids.indexOf(unit.id) >= 0) : units.slice();
  }
  function contentContext(units, experience) {
    const exercises = assignedUnits(units, experience).flatMap(unit => unit.ejercicios || []);
    const compatible = window.IL_MATRIZ && IL_MATRIZ.filtra ? IL_MATRIZ.filtra(exercises, band) : exercises;
    const counts = {}; compatible.forEach(exercise => { const id = exercise.habilidad; if (ILPracticeOptions.SKILLS.indexOf(id) >= 0) counts[id] = (counts[id] || 0) + 1; });
    return { compatible, counts };
  }
  function reinforceFrom(breakdown, counts) {
    if (!breakdown || !breakdown.hasData) return null;
    const candidates = (breakdown.skills || []).filter(item => counts[item.key] > 0 && item.pct != null && item.sufficient !== false);
    candidates.sort((a, b) => Number(a.pct) - Number(b.pct)); return candidates[0] ? candidates[0].key : null;
  }
  function availableWithNeed(counts, breakdown) {
    const pct = {}; (breakdown && breakdown.skills || []).forEach(item => { if (item.pct != null) pct[item.key] = Number(item.pct); });
    return Object.keys(counts).map(id => ({ id, count:counts[id], need:Object.prototype.hasOwnProperty.call(pct, id) ? 100 - pct[id] : 0 }));
  }
  function localiseChrome(profile) {
    document.documentElement.lang = band === "eso" ? "en" : "es";
    document.title = copy("title") + " · Interlanguage HOME";
    $("practiceEyebrow").textContent = band === "eso" ? "FOCUSED PRACTICE" : (band === "p12" ? "VAMOS PASO A PASO" : "PRÁCTICA PERSONAL");
    $("practiceTitle").textContent = copy("title");
    $("practiceSubtitle").textContent = copy("subtitle").replace("hoy", firstName(profile) ? "hoy, " + firstName(profile) : "hoy");
    $("recommendedEyebrow").textContent = copy("recommended");
    $("reviewTitle").textContent = copy("reviewTitle");
    $("skillsTitle").textContent = copy("chooseTitle");
    $("skillsLead").textContent = band === "eso" ? "Focus on one area without changing today’s session." : (band === "p12" ? "Elige una de estas opciones." : "Practica un área sin cambiar tu misión de hoy.");
    $("emptyTitle").textContent = copy("noContentTitle"); $("emptyBody").textContent = copy("noContentBody"); $("emptyHome").textContent = copy("backHome");
  }
  function renderRecommended(item) {
    if (!item) { $("recommendedTitle").textContent = copy("noContentTitle"); $("recommendedBody").textContent = copy("noContentBody"); $("recommendedCta").hidden = true; return; }
    let title = copy("recommended"), body = copy("extraBody"), cta = copy("start");
    if (item.kind === "daily") { title = copy("dailyTitle"); body = copy("dailyBody"); cta = copy("dailyCta"); }
    else if (item.kind === "due") body = copy("dueBody");
    else if (item.kind === "skill") { const label = ILCopy.practiceSkill(item.skill, band); title = label; body = copy("skillBody", { skill:label }); }
    $("recommendedTitle").textContent = title; $("recommendedBody").textContent = body; $("recommendedCtaText").textContent = cta; $("recommendedCta").href = item.href; $("recommendedCta").hidden = false;
  }
  function renderReview(review) {
    $("reviewBody").textContent = review.available ? copy("reviewBody") : copy("reviewEmpty");
    $("reviewCta").textContent = copy("reviewTitle"); $("reviewCta").hidden = !review.available;
    $("reviewStatus").hidden = review.available; if (!review.available) $("reviewStatus").querySelector("span:last-child").textContent = copy("reviewEmpty");
    $("reviewCard").classList.toggle("is-complete", !review.available);
  }
  function renderSkills(skills) {
    const host = $("skillOptions"); host.replaceChildren();
    skills.forEach(skill => {
      const link = document.createElement("a"); link.className = "practice-skill"; link.href = "leccion.html?mode=skill&skill=" + encodeURIComponent(skill.id); link.setAttribute("role", "listitem");
      const icon = document.createElement("span"); icon.setAttribute("data-il-icon", SKILL_ICON[skill.id] || "target"); icon.setAttribute("aria-hidden", "true");
      const label = document.createElement("span"); label.textContent = ILCopy.practiceSkill(skill.id, band); link.append(icon, label); host.appendChild(link);
    });
    if (window.ILLayout) ILLayout.mount();
  }
  function showError(error) {
    console.error("No se pudo cargar Practicar", error); $("loading").hidden = true; $("app").classList.add("hidden"); $("errorState").hidden = false;
    if (window.ILObservability) ILObservability.report("data_unavailable", error, { area:"practice", operation:"load" });
  }

  async function init() {
    try {
      await ILContent.ready;
      const profile = await ILAuth.getProfile();
      if (!profile) { location.href = "index.html"; return; }
      if (profile.is_admin) { location.href = "admin.html"; return; }
      if (profile.must_change_password) { location.href = "cambiar-clave.html"; return; }
      band = IL_ETAPA.apply(profile); const experience = IL_ETAPA.current().config;
      const units = (window.IL_CONTENIDO && IL_CONTENIDO.unidades) || [];
      const content = contentContext(units, experience); const byId = {}; content.compatible.forEach(item => { byId[item.id] = item; });
      const [placement, breakdown, events] = await Promise.all([ILAuth.getPlacement(), ILAuth.getSkillBreakdown(), ILAuth.getCachedLearningEvents()]);
      const state = ILMission.get(profile.username || "", ILMission.today());
      const dueCount = window.ILMastery ? ILMastery.due(profile.username || "").filter(id => byId[id]).length : 0;
      const errorCount = (state && state.incorrectIds || []).filter(id => byId[id]).length;
      const skills = availableWithNeed(content.counts, breakdown);
      const model = ILPracticeOptions.build({ band, dailyStatus:state && state.status || "not_started", dailyAvailable:content.compatible.length > 0, dueCount, errorCount, reinforceSkill:reinforceFrom(breakdown, content.counts), availableSkills:skills, recentEvents:events, hasExtra:content.compatible.length > 0, cefr:placement && placement.cefr });
      localiseChrome(profile); renderRecommended(model.recommended); renderReview(model.review); renderSkills(model.skills);
      $("emptyPractice").hidden = model.hasAnyPractice; if (!model.hasAnyPractice) $("practice-grid").hidden = true;
      if (window.ILLayout) { ILLayout.setUser({ name:firstName(profile), level:profile.level || "" }); ILLayout.mount(); }
      $("loading").hidden = true; $("errorState").hidden = true; $("app").classList.remove("hidden");
    } catch (error) { showError(error); }
  }
  $("retryPractice").addEventListener("click", () => location.reload());
  init();
})();
