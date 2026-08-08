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

  function mount() {
    document.querySelectorAll("[data-il-rail]").forEach(function (el) {
      el.setAttribute("aria-label", "Navegación principal");
      el.innerHTML = railHTML(el.getAttribute("data-il-rail"));
    });
    document.querySelectorAll("[data-il-nav]").forEach(function (el) {
      el.setAttribute("aria-label", "Navegación principal");
      el.innerHTML = navHTML(el.getAttribute("data-il-nav"));
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
  window.ILLayout = { railHTML: railHTML, navHTML: navHTML, mount: mount };
})();
