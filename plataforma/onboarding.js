/* Interlanguage HOME · bienvenida centrada en la identidad del alumno. */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  let profile = null, band = "neutral", page = 0, content = null;
  function node(tag, className, value) { const el = document.createElement(tag); if (className) el.className = className; if (value != null) el.textContent = value; return el; }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  function interpolate(value, name) { return String(value || "").replace(/\{name\}/g, name); }
  function firstName() { return String(profile.full_name || profile.first_name || profile.username || "").trim().split(/\s+/)[0] || (band === "eso" ? "there" : "explorador"); }
  function visual(id) {
    const holder = node("div", "welcome-visual"); holder.setAttribute("aria-hidden", "true");
    if (id === "avatar" && window.ILWorldVisual && window.ILProfileSettings) holder.innerHTML = ILWorldVisual.avatar(ILProfileSettings.getActive(), {}, { compact:true });
    else holder.innerHTML = ILIcon(id || "route");
    return holder;
  }
  function render() {
    const data = content.steps[page], main = $("main"); clear(main); main.setAttribute("aria-busy", "false");
    const card = node("div", "welcome-card"); card.append(visual(data.visual), node("h1", "welcome-title", interpolate(data.title, firstName())), node("p", "welcome-body", data.body));
    if (data.preview) {
      const preview = node("div", "welcome-preview"), icon = node("span", "welcome-preview-icon"); icon.setAttribute("aria-hidden", "true"); icon.innerHTML = ILIcon("books");
      const labels = node("span"); labels.append(node("strong", "", data.preview), node("small", "", data.meta)); preview.append(icon, labels, node("span", "welcome-preview-time", data.time)); card.append(preview);
    }
    main.append(card); document.querySelectorAll(".welcome-dot").forEach((dot, index) => { dot.classList.toggle("is-active", index === page); dot.classList.toggle("is-complete", index < page); });
    $("onboardingProgress").setAttribute("aria-valuenow", String(page + 1)); $("back").hidden = page === 0; $("next").textContent = page === content.steps.length - 1 ? content.finish : content.next; $("next").disabled = false;
    $("next").focus();
  }
  function finish() { ILEntryFlow.completeOnboarding(localStorage, profile.username); location.href = "test-nivel.html"; }
  $("next").addEventListener("click", () => { if (page < content.steps.length - 1) { page += 1; render(); } else finish(); });
  $("back").addEventListener("click", () => { if (page > 0) { page -= 1; render(); } });
  (async function init() {
    profile = await ILAuth.getProfile(); if (!profile) { location.href = "index.html"; return; }
    if (profile.is_admin) { location.href = "admin.html"; return; }
    if (profile.must_change_password) { location.href = "cambiar-clave.html"; return; }
    const placement = await ILAuth.getPlacement(); if (placement.placed) { location.href = "inicio.html"; return; }
    band = IL_ETAPA.apply(profile) || "neutral"; content = ILCopy.onboarding(band); document.documentElement.lang = band === "eso" ? "en" : "es";
    ILProfileSettings.setActive(profile.username, profile.sex); render(); if (window.ILLayout) ILLayout.mount();
  })().catch(error => { if (window.ILObservability) ILObservability.report("technical_failure", error, { area:"onboarding", operation:"initialise" }); location.href = "index.html"; });
})();
