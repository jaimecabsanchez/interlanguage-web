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
    plane: LOGO,
    user: ICON.perfil,
    play: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="m9 6 9 6-9 6V6Z"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6"/></svg>',
    flame: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M12 3c1.2 3-1 4.4-1 6.4A2.6 2.6 0 0 0 13.6 12c1.8 0 2.8-1.3 2.8-2.7A7.4 7.4 0 1 1 7.1 8c1.7-2.2 4.1-3.8 4.9-5Z"/></svg>',
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
    paw: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><circle cx="6.5" cy="11" r="1.6"/><circle cx="10" cy="6.5" r="1.6"/><circle cx="14" cy="6.5" r="1.6"/><circle cx="17.5" cy="11" r="1.6"/><path d="M12 12c-2.4 0-4.5 1.6-4.5 3.7 0 1.6 1.4 2.3 3 2.3.7 0 1 .3 1.5.3s.8-.3 1.5-.3c1.6 0 3-.7 3-2.3 0-2.1-2.1-3.7-4.5-3.7Z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>',
    // Dashboard
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 9h16M8 3v4M16 3v4"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 20h6M10 20l.5-3h3l.5 3"/></svg>',
    star: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3Z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg>',
    trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 16 5-5 4 3 8-9"/><path d="M16 5h4v4"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h5v17H6a2 2 0 0 0-2 2V5Z"/><path d="M20 5a2 2 0 0 0-2-2h-5v17h5a2 2 0 0 1 2 2V5Z"/></svg>',
    ear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 6a2.5 2.5 0 0 1-5 .3"/><path d="M9 9a3 3 0 0 1 5 0"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m14 6 4 4"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 4V7a2 2 0 0 1 2-2Z"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
    eye: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="m3 3 18 18"/><path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6 0 9.5 6 9.5 6a16 16 0 0 1-2.4 3.1M6.2 6.2C3.8 7.8 2.5 12 2.5 12s3.5 6 9.5 6a9.8 9.8 0 0 0 3-.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    wifiOff: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="m3 3 18 18M5.3 9.7A11 11 0 0 1 12 7.5c3.2 0 5.7 1.1 7.5 2.7M8.8 13.2A5 5 0 0 1 12 12c1 0 2 .3 2.8.8M12 18h.01"/></svg>',
    link: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1"/></svg>',
    search: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
    flask: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3"/><path d="M8 15h8"/></svg>',
    books: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M4 4h5v16H4zM9 6h5v14H9zM15 5l4-1 3 15-5 1z"/></svg>',
    info: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></svg>',
    warning: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5M12 17h.01"/></svg>',
    trash: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>',
    stamp: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><path d="M8 4a4 4 0 1 1 8 0c0 3 1 4 3 6H5c2-2 3-3 3-6ZM5 14h14v5H5zM7 22h10"/></svg>',
    route: '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true"><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3"/></svg>'
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

  /* ---------- PWA: manifest + tema + icono de app (sin tocar cada <head>) ---------- */
  function ensurePWA() {
    var head = document.head; if (!head) return;
    function add(sel, make) { if (!document.querySelector(sel)) head.appendChild(make()); }
    add('link[rel="manifest"]', function () { var l = document.createElement("link"); l.rel = "manifest"; l.href = "manifest.webmanifest"; return l; });
    add('meta[name="theme-color"]', function () { var m = document.createElement("meta"); m.name = "theme-color"; m.content = "#16294A"; return m; });
    add('link[rel="apple-touch-icon"]', function () { var l = document.createElement("link"); l.rel = "apple-touch-icon"; l.href = "assets/apple-touch-icon.png"; return l; });
    add('meta[name="apple-mobile-web-app-capable"]', function () { var m = document.createElement("meta"); m.name = "apple-mobile-web-app-capable"; m.content = "yes"; return m; });
    add('meta[name="apple-mobile-web-app-status-bar-style"]', function () { var m = document.createElement("meta"); m.name = "apple-mobile-web-app-status-bar-style"; m.content = "default"; return m; });
  }
  ensurePWA();

  /* ---------- Toasts (window.ILToast) ---------- */
  function toastLayer() {
    var l = document.querySelector(".il-toasts");
    if (!l) { l = document.createElement("div"); l.className = "il-toasts"; l.setAttribute("aria-live", "polite"); document.body.appendChild(l); }
    return l;
  }
  function ILToast(msg, opts) {
    opts = opts || {};
    var type = opts.type || "info";            // "ok" | "err" | "info"
    var ms = opts.duration || 2200;
    var t = document.createElement("div");
    t.className = "il-toast " + type;
    var ic = { ok: "check", err: "shield", info: "" }[type];
    t.innerHTML = (ic && ICONS[ic] ? '<span class="ic">' + ICONS[ic] + "</span>" : "") + "<span></span>";
    t.lastChild.textContent = msg;             // texto seguro (sin inyección)
    toastLayer().appendChild(t);
    requestAnimationFrame(function () { t.classList.add("show"); });
    setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 260); }, ms);
    return t;
  }

  /* ---------- Microcelebración sobria (window.ILConfetti) ---------- */
  function ILConfetti(opts) {
    opts = opts || {};
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var n = opts.count || 26;
    var colors = ["var(--il-secondary)", "var(--il-success)", "var(--il-primary)", "var(--il-warning)"];
    var wrap = document.createElement("div"); wrap.className = "il-confetti";
    for (var i = 0; i < n; i++) {
      var p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = (1.6 + Math.random() * 1.4) + "s";
      p.style.animationDelay = (Math.random() * 0.25) + "s";
      p.style.transform = "translateY(0) rotate(" + (Math.random() * 360) + "deg)";
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(function () { wrap.remove(); }, 3400);
  }

  window.ILLayout = { railHTML: railHTML, navHTML: navHTML, mount: mount, icon: icon };
  window.ILIcon = icon;
  window.ILToast = ILToast;
  window.ILConfetti = ILConfetti;
})();
