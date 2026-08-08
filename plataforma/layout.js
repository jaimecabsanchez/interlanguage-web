/* ============================================================
   layout.js · Navegación compartida (rail + nav inferior)
   ------------------------------------------------------------
   Una sola definición de la navegación del alumno. Las páginas
   solo declaran un contenedor y la pestaña activa:
     <aside class="rail" data-il-rail="inicio"></aside>
     <nav class="app-nav" data-il-nav="inicio"></nav>
   y cargan <script src="layout.js"></script>.
   Así cambiar un icono/etiqueta se hace en UN sitio, no en cuatro.
   ============================================================ */
(function () {
  "use strict";
  const S = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const ICON = {
    inicio: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M4 11 12 4l8 7"/><path d="M6 10v9h4v-5h4v5h4v-9"/></svg>',
    practicar: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.4"/></svg>',
    progreso: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M4 19V5"/><path d="M4 19h16"/><path d="m7 15 3.5-4 3 2.5L20 7"/></svg>',
    perfil: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></svg>'
  };
  const LOGO = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 11 21 3l-7 18-3-7-8-3Z"/></svg>';
  const TABS = [
    { k: "inicio", label: "Inicio", href: "inicio.html" },
    { k: "practicar", label: "Practicar", href: "leccion.html" },
    { k: "progreso", label: "Progreso", href: "progreso.html" },
    { k: "perfil", label: "Perfil", href: "perfil.html" }
  ];

  function railHTML(active) {
    return '<div class="brand"><span class="logo">' + LOGO + '</span><span>Inter<b>language</b></span></div>' +
      '<nav>' + TABS.map(function (t) {
        return '<a class="' + (t.k === active ? "is-active" : "") + '" href="' + t.href + '"' +
          (t.k === active ? ' aria-current="page"' : "") + ">" + ICON[t.k] + "<span>" + t.label + "</span></a>";
      }).join("") + "</nav>";
  }
  function navHTML(active) {
    return TABS.map(function (t) {
      return '<a class="app-nav__item' + (t.k === active ? " is-active" : "") + '" href="' + t.href + '"' +
        (t.k === active ? ' aria-current="page"' : "") + ">" + ICON[t.k] +
        '<span class="app-nav__label">' + t.label + "</span></a>";
    }).join("");
  }

  // --- Set de iconos propio (SVG), para retirar los emojis de la interfaz ---
  const ICONS = {
    flame: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c1 3-1 4.5-1 6.5A2.5 2.5 0 0 0 13.5 11c1.7 0 2.6-1.2 2.7-2.4C18 10 19 12.4 19 15a7 7 0 1 1-14 0c0-3.3 2-5.6 3.4-7.5C10.2 5.3 11.6 4 12 2Z"/></svg>',
    gem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="m6 3 12 0 3 5-9 13L3 8Z"/><path d="M3 8h18M9 3 6 8l6 13 6-13-3-5"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 4.4-2.9 8-7 10-4.1-2-7-5.6-7-10V6l7-3Z"/></svg>',
    chart: ICON.progreso,
    medal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="14" r="6"/><path d="M12 14v0"/><path d="M8.5 8.5 6 3h4l2 3 2-3h4l-2.5 5.5"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 8a5 5 0 0 1 0 8"/></svg>'
  };
  function icon(name) { return ICONS[name] || ""; }

  function mount() {
    document.querySelectorAll("[data-il-rail]").forEach(function (el) {
      el.setAttribute("aria-label", "Navegación principal");
      el.innerHTML = railHTML(el.getAttribute("data-il-rail"));
    });
    document.querySelectorAll("[data-il-nav]").forEach(function (el) {
      el.setAttribute("aria-label", "Navegación principal");
      el.innerHTML = navHTML(el.getAttribute("data-il-nav"));
    });
    document.querySelectorAll("[data-il-icon]").forEach(function (el) {
      el.innerHTML = icon(el.getAttribute("data-il-icon"));
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
  window.ILLayout = { railHTML: railHTML, navHTML: navHTML, mount: mount, icon: icon };
  window.ILIcon = icon;
})();
