/* Microinteracciones (propuesta del 10-11-2026). Solo pone y quita clases; todo el movimiento está en css/motion.css, que respeta
   «prefers-reduced-motion». Si este archivo falla, la web se ve igual que sin él: ninguna regla oculta nada hasta que el script la marca. */
(function(){
  'use strict';
  var root = document.getElementById('view-service-extranjero');
  if (!root || !('IntersectionObserver' in window)) return;
  var html = document.documentElement;
  html.classList.add('mo-ready');

  /* 4 · Fotos: las que no han llegado todavía se marcan y aparecen con un fundido al cargar. Las que ya están (la portada) no se tocan. */
  [].forEach.call(root.querySelectorAll('img[loading="lazy"]'), function(img){
    if (img.complete && img.naturalWidth) return;
    img.setAttribute('data-mo-ld', '');
    var done = function(){ img.removeAttribute('data-mo-ld'); };
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
    setTimeout(done, 5000);   // red de seguridad: nunca se queda una foto invisible
  });

  /* 5 · Cambio de página: la vista que se abre entra con un fundido (no en la carga inicial, para no retrasar la primera pintura) */
  var started = false;
  function onLoad(){ setTimeout(function(){ started = true; }, 400); }
  if (document.readyState === 'complete') onLoad(); else window.addEventListener('load', onLoad, { once: true });
  [].forEach.call(document.querySelectorAll('.view'), function(view){
    new MutationObserver(function(){
      if (!started || view.hasAttribute('hidden')) return;
      view.classList.remove('mo-enter'); void view.offsetWidth; view.classList.add('mo-enter');
      view.addEventListener('animationend', function h(e){ if (e.target !== view) return; view.classList.remove('mo-enter'); view.removeEventListener('animationend', h); });
      if (view === root) requestAnimationFrame(prime);
    }).observe(view, { attributes: true, attributeFilter: ['hidden'] });
  });

  /* 7 · Secciones: solo lo que está por debajo de la primera pantalla espera para entrar; lo que ya se ve nunca se oculta */
  var primed = false;
  function prime(){
    if (primed || root.hasAttribute('hidden')) return;
    primed = true;
    var vh = window.innerHeight;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        el.classList.add('mo-in');
        var cleaned = false;
        var clean = function(){
          if (cleaned) return; cleaned = true;
          el.classList.remove('mo-pre', 'mo-in'); el.style.removeProperty('--mo-d');   // al terminar, el elemento vuelve a ser normal (el hover no lleva retraso)
          el.removeEventListener('transitionend', onEnd);
        };
        var onEnd = function(ev){ if (ev.target === el && ev.propertyName === 'opacity') clean(); };
        el.addEventListener('transitionend', onEnd);
        setTimeout(clean, 700);   // seguro: si el navegador no emite el final de la transición (scroll muy rápido, pestaña en segundo plano)
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    [['.ext-option', 60], ['.ext-esc', 0], ['.ext-tl-step', 70]].forEach(function(g){
      [].forEach.call(root.querySelectorAll(g[0]), function(el, i){
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92) return;                                    // ya se ve: no se oculta
        var p = el.parentElement;
        if (p && p.scrollWidth > p.clientWidth + 2) return;               // carrusel horizontal (móvil y tableta): las tarjetas se ven al deslizar, no hace falta que esperen
        if (r.left >= window.innerWidth - 1 || r.right <= 1) return;
        el.classList.add('mo-pre');
        el.style.setProperty('--mo-d', (g[1] * (i % 3)) + 'ms');
        io.observe(el);
      });
    });
  }
  if (!root.hasAttribute('hidden')) requestAnimationFrame(prime);
})();
