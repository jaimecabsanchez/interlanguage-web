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
    speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 8a5 5 0 0 1 0 8"/></svg>',
    // Comodín / protección de racha (salvavidas)
    buoy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.4"/><path d="M12 3v5.6M12 15.4V21M3 12h5.6M15.4 12H21"/></svg>',
    // Tienda: categorías
    shirt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3 4 6l2 3 1-.6V21h10V8.4l1 .6 2-3-5-3-3 2Z"/></svg>',
    paw: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="6.5" cy="11" r="2"/><circle cx="10" cy="6.5" r="2"/><circle cx="14" cy="6.5" r="2"/><circle cx="17.5" cy="11" r="2"/><path d="M12 12c-2.4 0-4.5 1.6-4.5 3.7 0 1.6 1.4 2.3 3 2.3.7 0 1 .3 1.5.3s.8-.3 1.5-.3c1.6 0 3-.7 3-2.3C16.5 13.6 14.4 12 12 12Z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>',
    // Dashboard
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 9h16M8 3v4M16 3v4"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 20h6M10 20l.5-3h3l.5 3"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3Z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg>',
    trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 16 5-5 4 3 8-9"/><path d="M16 5h4v4"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h5v17H6a2 2 0 0 0-2 2V5Z"/><path d="M20 5a2 2 0 0 0-2-2h-5v17h5a2 2 0 0 1 2 2V5Z"/></svg>',
    ear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 6a2.5 2.5 0 0 1-5 .3"/><path d="M9 9a3 3 0 0 1 5 0"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m14 6 4 4"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 4V7a2 2 0 0 1 2-2Z"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>'
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
