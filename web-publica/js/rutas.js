/* Rutas de «Estudiar en el extranjero» y modo vista previa (propuesta v2, 26-11-2026). Se carga en el <head>, sin defer,
   para actuar antes de pintar la página. Sin dependencias.

   1) Enlaces antiguos: los fragmentos (#…) no llegan al servidor, así que se resuelven aquí, en el navegador.
      Solo en las páginas que llevan <meta name="il-rutas" content="1"> (index.html e index-en.html).
        #servicio-extranjero               → /estudiar-en-el-extranjero/
        #servicio-extranjero-irlanda       → /estudiar-en-el-extranjero/irlanda/      (y el resto de destinos)
      En inglés, a /en/study-abroad/…

   2) Vista previa: con <meta name="il-preview" content="1"> ningún formulario envía nada. Se intercepta cualquier POST
      de fetch (es la vía de main.js, extranjero.js y recorridos.js hacia Netlify Forms) y se responde «OK» sin salir del navegador.
      Además se muestra una franja que lo avisa. NUNCA debe llegar a producción: build.py --publicar quita ese meta. */
(function(){
  'use strict';
  var d = document, meta = function(n){ var m = d.querySelector('meta[name="' + n + '"]'); return m ? m.getAttribute('content') : ''; };
  var en = (d.documentElement.lang || '').slice(0, 2) === 'en';

  if (meta('il-rutas') === '1') {
    var base = en ? '/en/study-abroad/' : '/estudiar-en-el-extranjero/';
    var SLUG = en ? { 'reino-unido': 'united-kingdom/', 'irlanda': 'ireland/', 'estados-unidos': 'united-states/', 'canada': 'canada/' }
                  : { 'reino-unido': 'reino-unido/', 'irlanda': 'irlanda/', 'estados-unidos': 'estados-unidos/', 'canada': 'canada/' };
    var m = /^#servicio-extranjero(?:-([a-z-]+))?$/.exec(location.hash);
    if (m && (!m[1] || SLUG[m[1]])) { location.replace(base + (m[1] ? SLUG[m[1]] : '')); return; }
  }

  if (meta('il-preview') === '1' && window.fetch) {
    var real = window.fetch;
    window.fetch = function(url, opts){
      if (opts && String(opts.method || 'GET').toUpperCase() === 'POST') {
        try { console.info('[vista previa] Envío simulado, no se ha enviado nada:', opts.body); } catch (e) {}
        return Promise.resolve(new Response('ok', { status: 200 }));
      }
      return real.apply(this, arguments);
    };
    d.addEventListener('DOMContentLoaded', function(){
      var b = d.createElement('p');
      b.className = 'il-preview-bar';
      b.setAttribute('role', 'note');
      b.textContent = en ? 'Preview · forms are simulated' : 'Vista previa · formularios simulados';
      d.body.appendChild(b);
    });
  }
})();
