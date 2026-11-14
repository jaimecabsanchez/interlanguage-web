/* «Estudiar en el extranjero» · diseño v2 (14-11-2026). Sin librerías.
   Tarjetas de destino con vídeo, comparador, cierre de las fichas, visor de fotos y apertura suave de las preguntas.
   El cuestionario va al final del archivo, en su propio bloque. Todo dentro de #view-service-extranjero. */
(function(){
  'use strict';
  var root = document.getElementById('view-service-extranjero');
  if (!root) return;
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esc = function(t){ return String(t).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var IMG = 'images/internacional/';
  /* las 19 fotos de «Así se vive la experiencia» (mismo orden que los data-i del HTML) */
  var P = [{"src": "images/internacional/ext-gal-remo-1000.webp", "alt": "Alumnas remando en un lago", "cap": "Remo", "cat": "Deporte"}, {"src": "images/internacional/ext-duo-rugby-1080.webp", "alt": "Alumno chutando un balón de rugby", "cap": "Rugby", "cat": "Deporte"}, {"src": "images/internacional/ext-gal-piano-1000.webp", "alt": "Alumna tocando el piano con su profesora", "cap": "Piano", "cat": "Música"}, {"src": "images/internacional/ext-gal-ciencias-1000.webp", "alt": "Alumnos en una clase de ciencias", "cap": "Ciencias", "cat": "Aula y ciencia"}, {"src": "images/internacional/ext-gal-equitacion-1000.webp", "alt": "Alumnas montando a caballo", "cap": "Equitación", "cat": "Deporte"}, {"src": "images/internacional/extranjero-alumnas-1122.webp", "alt": "Cuatro alumnas sonriendo juntas", "cap": "Amistades", "cat": "Convivencia"}, {"src": "images/internacional/ext-gal-tenis-1000.webp", "alt": "Alumnos jugando al tenis con su entrenador", "cap": "Tenis", "cat": "Deporte"}, {"src": "images/internacional/ext-gal-orquesta-1000.webp", "alt": "Alumnos tocando en una orquesta", "cap": "Orquesta", "cat": "Música"}, {"src": "images/internacional/ext-us-aula-1000.webp", "alt": "Alumnos atendiendo en clase", "cap": "Clases", "cat": "Aula y ciencia"}, {"src": "images/internacional/reino-unido-golf-1000.webp", "alt": "Alumno jugando al golf", "cap": "Golf", "cat": "Deporte"}, {"src": "images/internacional/extranjero-kayak-1200.webp", "alt": "Alumnos con kayaks en la orilla del mar", "cap": "Kayak", "cat": "Aire libre"}, {"src": "images/internacional/ext-gal-arte-572.webp", "alt": "Alumnos dibujando en clase de arte", "cap": "Arte", "cat": "Artes"}, {"src": "images/internacional/sala-comun-900.webp", "alt": "Sala común de un internado con sofás y una mesa de billar", "cap": "Sala común", "cat": "Convivencia"}, {"src": "images/internacional/ext-gal-teatro-1000.webp", "alt": "Alumnos en una obra de teatro", "cap": "Teatro", "cat": "Artes"}, {"src": "images/internacional/extranjero-surf-800.webp", "alt": "Alumnos preparando kayaks junto a una escuela de surf", "cap": "Aire libre", "cat": "Aire libre"}, {"src": "images/internacional/ext-gal-robotica-1000.webp", "alt": "Alumnos montando un robot", "cap": "Robótica", "cat": "Aula y ciencia"}, {"src": "images/internacional/ext-gal-cocina-1000.webp", "alt": "Alumnas cocinando", "cap": "Cocina", "cat": "Artes"}, {"src": "images/internacional/extranjero-lab-1200.webp", "alt": "Alumnos con bata en un laboratorio", "cap": "Laboratorio", "cat": "Aula y ciencia"}, {"src": "images/internacional/extranjero-grupo-1200.webp", "alt": "Grupo de alumnos en una excursión", "cap": "Excursiones", "cat": "Aire libre"}];
  /* ---------- tarjetas de destino: vídeo al pasar el ratón (solo escritorio con ratón y sin ahorro de datos) ---------- */
  var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)').matches;
  var saveData = navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType || ''));
  $$('.dcard[data-video]', root).forEach(function(card){
    if (!fine || saveData) return;
    var v;
    card.addEventListener('mouseenter', function(){
      if (!v) { v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto'; v.setAttribute('aria-hidden', 'true'); v.src = card.getAttribute('data-video'); card.insertBefore(v, card.querySelector('.scrim')); v.addEventListener('playing', function(){ card.classList.add('is-playing'); }); }
      var p = v.play(); if (p && p.catch) p.catch(function(){});
    });
    card.addEventListener('mouseleave', function(){ if (v) { v.pause(); card.classList.remove('is-playing'); } });
  });

  /* ---------- comparador de dos destinos (orientativo) ---------- */
  var D = {
    uk: { n: 'Reino Unido', c: 'var(--c-uk)', s: '', r: ['Inglés', 'Internado', 'Currículos distintos en Inglaterra y Escocia', 'Tres trimestres: septiembre a julio (Inglaterra) o agosto a junio (Escocia)', 'Europa · 1 h menos', 'Busca una vida de colegio organizada'] },
    ie: { n: 'Irlanda', c: 'var(--c-ie)', s: '', r: ['Inglés, según centro', 'Internado o familia anfitriona', 'Junior Cycle, Senior Cycle y posible Transition Year', 'De finales de agosto o septiembre a mayo o junio', 'Europa · 1 h menos', 'Valora la vida en familia o en internado cerca de España'] },
    us: { n: 'Estados Unidos', c: 'var(--c-us)', s: 'Bajo consulta', r: ['Inglés', 'Familia anfitriona o internado privado, según programa', 'Materias y créditos; requisitos por estado y distrito', 'De agosto o septiembre a mayo o junio', 'Transatlántico · Nueva York, 6 h menos*', 'Tiene autonomía y curiosidad por la vida escolar norteamericana'] },
    ca: { n: 'Canadá', c: 'var(--c-ca)', s: 'Bajo consulta', r: ['Inglés o francés, según centro', 'Familia anfitriona o colegio privado con alojamiento', 'Currículo y diploma por provincia', 'De septiembre a junio, a menudo en semestres', 'Transatlántico · Toronto, 6 h menos*', 'Quiere elegir bien provincia, idioma y entorno'] }
  };
  var K = ['Idioma', 'Alojamiento', 'Sistema', 'Calendario', 'Distancia', 'Puede encajar si…'];
  var sa = $('#cmpA', root), sb = $('#cmpB', root), tb = $('#cmpTable', root);
  if (sa && sb && tb) {
    Object.keys(D).forEach(function(k){ sa.add(new Option(D[k].n, k)); sb.add(new Option(D[k].n, k)); });
    sa.value = 'uk'; sb.value = 'ie';
    var render = function(){
      var a = D[sa.value], b = D[sb.value];
      var h = '<div class="k" aria-hidden="true"></div><div class="h" style="--c:' + a.c + '">' + a.n + (a.s ? '<small>' + a.s + '</small>' : '') + '</div><div class="h" style="--c:' + b.c + '">' + b.n + (b.s ? '<small>' + b.s + '</small>' : '') + '</div>';
      K.forEach(function(k, i){ h += '<div class="k">' + k + '</div><div>' + a.r[i] + '</div><div>' + b.r[i] + '</div>'; });
      tb.innerHTML = h;
    };
    var swap = function(){ if (reduce) return render(); tb.classList.add('is-swap'); setTimeout(function(){ render(); tb.classList.remove('is-swap'); }, 180); };
    sa.addEventListener('change', function(){ if (sa.value === sb.value) sb.value = Object.keys(D).filter(function(k){ return k !== sa.value; })[0]; swap(); });
    sb.addEventListener('change', function(){ if (sa.value === sb.value) sa.value = Object.keys(D).filter(function(k){ return k !== sb.value; })[0]; swap(); });
    render();
  }

  /* ---------- fichas de cada destino: se abren desde las tarjetas (main.js) y se cierran aquí ---------- */
  var fichas = $('#ext-fichas');
  $$('[data-fichas-close]', root).forEach(function(b){ b.addEventListener('click', function(){
    if (!fichas) return;
    fichas.hidden = true;
    var d = $('#ext-destinos'); if (d) d.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }); });

  /* ---------- fotos: visor a pantalla completa (flechas, teclado y deslizar) ---------- */
  var lb = $('#x2Lb'), cur = 0, opener = null;
  function show(i){ cur = (i + P.length) % P.length; var p = P[cur], im = $('#x2LbImg'); im.src = p.src; im.alt = p.alt; $('#x2LbCap').textContent = p.cap; $('#x2LbTag').textContent = p.cat; $('#x2LbN').textContent = (cur + 1) + ' / ' + P.length; im.style.animation = 'none'; void im.offsetWidth; im.style.animation = ''; }
  if (lb && lb.showModal) {
    root.addEventListener('click', function(e){
      var b = e.target.closest('.ph-open'); if (b) { opener = b; show(+b.getAttribute('data-i')); lb.showModal(); return; }
      var a = e.target.closest('[data-lb]'); if (a && lb.contains(a)) { var k = a.getAttribute('data-lb'); if (k === 'close') lb.close(); else show(cur + (k === 'next' ? 1 : -1)); return; }
      if (e.target === lb) lb.close();
    });
    lb.addEventListener('keydown', function(e){ if (e.key === 'ArrowRight') show(cur + 1); else if (e.key === 'ArrowLeft') show(cur - 1); });
    lb.addEventListener('close', function(){ if (opener) opener.focus({ preventScroll: true }); });
    var tx = 0; lb.addEventListener('touchstart', function(e){ tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function(e){ var d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); });
  }

  /* ---------- preguntas: apertura y cierre suaves (sigue siendo <details>, accesible sin JS) ---------- */
  $$('#ext-dudas .camp-faq-item', root).forEach(function(d){
    var s = $('summary', d), body = $('p', d), anim;
    if (!s || !body) return;
    s.addEventListener('click', function(e){
      if (reduce || !body.animate) return;
      e.preventDefault();
      if (anim) anim.cancel();
      if (!d.open) {
        d.open = true; var h = body.scrollHeight;
        anim = body.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 280, easing: 'cubic-bezier(.2,.7,.2,1)' });
        anim.onfinish = function(){ anim = null; };
      } else {
        var h2 = body.scrollHeight;
        anim = body.animate([{ height: h2 + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 220, easing: 'ease-in' });
        anim.onfinish = function(){ d.open = false; anim = null; };
      }
    });
  });
})();

/* Cuestionario «¿Qué colegio podría encajar con vuestro hijo?» · versión 2 (14-11-2026).
   Aprobado por Jaime el 14-11-2026. Sin librerías.
   - 5 preguntas + paso final. Selección única: avanza sola; múltiple: nunca.
   - Pregunta 2: «Desarrollar sus talentos e intereses» despliega etiquetas de intereses (varias).
   - Respuestas guardadas en sessionStorage (no se pierden al recargar) y conservadas al retroceder.
   - Envío: mismo destino y campos que la consulta de la web (form-handler.php). Después: reservar llamada
     (window.ilCallBooking, si está configurada) o «Prefiero que me contactéis». Sin envíos dobles. */
(function(){
  'use strict';
  var root = document.getElementById('view-service-extranjero');
  var qz = root && root.querySelector('#qz');
  if (!qz) return;
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esc = function(t){ return String(t).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var IMG = 'images/internacional/';
  var STORE = 'il-ext-cuestionario-v2';
  var SEND = 'Enviar y solicitar orientación';

  var TALENT = 'Desarrollar sus talentos e intereses';
  var INTERESTS = [
    { g: 'Deporte', o: ['Fútbol', 'Tenis', 'Rugby', 'Baloncesto', 'Natación', 'Otros deportes'] },
    { g: 'Artes, comunicación y tecnología', o: ['Música', 'Teatro e interpretación', 'Arte y creatividad', 'Hablar en público y comunicación', 'Tecnología y programación', 'Otros intereses'] }
  ];
  var Q = [
    { k: 'edad', label: 'Edad al empezar', t: '¿Qué edad tendrá vuestro hijo o hija al comenzar la experiencia?', multi: false, cols: 4, o: [
      { v: '9–11 años', big: '9–11' }, { v: '12–14 años', big: '12–14' }, { v: '15–16 años', big: '15–16' }, { v: '17–18 años', big: '17–18' } ] },
    { k: 'objetivos', label: 'Lo que buscáis', t: '¿Qué os gustaría que aportara esta experiencia a vuestro hijo o hija?', multi: true, cols: 3, o: [
      { v: 'Mejorar su inglés', ic: 'talk' }, { v: 'Ganar autonomía y confianza', ic: 'pack' }, { v: 'Descubrir otra cultura', ic: 'globe' },
      { v: 'Impulsar su formación académica', ic: 'cap' }, { v: TALENT, ic: 'star', sub: true }, { v: 'Todavía estamos explorando', ic: 'compass', solo: true } ] },
    { k: 'estancia', label: 'Estancia', t: '¿Cómo imagináis su estancia en el extranjero?', multi: false, cols: 4, o: [
      { v: 'En un internado', ic: 'school' }, { v: 'Con una familia anfitriona', ic: 'house' }, { v: 'Estamos abiertos a ambas opciones', ic: 'both' }, { v: 'Preferimos que nos orientéis', ic: 'chat' } ] },
    { k: 'destinos', label: 'Destinos', t: '¿Qué destinos os interesan más?', multi: true, cols: 5, o: [
      { v: 'Reino Unido', img: 'uk-campus-480.webp' }, { v: 'Irlanda', img: 'ie-campus-480.webp' }, { v: 'Estados Unidos', img: 'us-campus-480.webp', note: 'Bajo consulta' },
      { v: 'Canadá', img: 'ca-campus-480.webp', note: 'Bajo consulta' }, { v: 'Estamos abiertos a diferentes destinos', ic: 'globe', thumbIc: true, solo: true } ] },
    { k: 'duracion', label: 'Duración', t: '¿Cuánto tiempo os gustaría que estudiara en el extranjero?', multi: false, cols: 4, o: [
      { v: 'Un trimestre', seg: 1, cap: '1 de 3 trimestres' }, { v: 'Dos trimestres', seg: 2, cap: '2 de 3 trimestres' }, { v: 'Un curso completo', seg: 3, cap: 'Los 3 trimestres' }, { v: 'Todavía no lo sabemos', seg: 0, cap: 'Lo vemos juntos' } ] }
  ];
  var STARTS = ['Lo antes posible', 'Curso 2027-2028', 'Curso 2028-2029', 'Más adelante', 'Todavía no lo sabemos'];
  var TOTAL = Q.length + 1;

  /* iconos de línea, mismo trazo para todos, sin fondo (norma de la web: nada de círculos detrás) */
  var ICN = {
    talk: '<path d="M4 5.5h12.5a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H10l-4 3.5v-3.5H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"/><path class="a" d="M6.5 9.5h7M6.5 12h4.5"/>',
    pack: '<path d="M7 9.5a5 5 0 0 1 10 0V19a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"/><path d="M9.5 6V4.5a2.5 2.5 0 0 1 5 0V6"/><path class="a" d="M9.5 13.5h5v4h-5z"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.1 3.6 8.5s-1.2 6.2-3.6 8.5M12 3.5C9.6 5.8 8.4 8.6 8.4 12s1.2 6.2 3.6 8.5"/>',
    cap: '<path d="M2 9.5L12 5l10 4.5L12 14z"/><path d="M6 11.5v4.6c1.7 1.6 3.7 2.4 6 2.4s4.3-.8 6-2.4v-4.6"/><path class="a" d="M20.5 10.4v5"/>',
    star: '<path d="M12 4l2.3 4.8 5.2.7-3.8 3.7.9 5.2-4.6-2.5-4.6 2.5.9-5.2-3.8-3.7 5.2-.7z"/>',
    compass: '<circle cx="12" cy="12" r="8.5"/><path class="a" d="M15.3 8.7l-2 4.6-4.6 2 2-4.6z"/>',
    school: '<path d="M3 20.5h18"/><path d="M5 20.5v-9L12 7l7 4.5v9"/><path d="M12 7V3.5h3"/><path d="M10 20.5v-4a2 2 0 0 1 4 0v4"/>',
    house: '<path d="M3.5 11.5L12 4.5l8.5 7"/><path d="M6 10v10.5h12V10"/><path class="a" d="M12 17.5l-2.4-2.3a1.5 1.5 0 0 1 2.4-1.8 1.5 1.5 0 0 1 2.4 1.8z"/>',
    both: '<path d="M2.5 13L7 9l4.5 4"/><path d="M4 12v7h6v-7"/><path d="M13 19h8.5"/><path d="M14 19v-7l3.5-2.6L21 12v7"/><path d="M17.5 9.4V6.5h2"/>',
    chat: '<path d="M3 5h11a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 14 14H8l-3.5 3v-3H3a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 3 5z"/><path d="M15.5 9.5H21a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-1V20l-3-2.5h-4.5A1.5 1.5 0 0 1 11 16v-2"/>'
  };
  var svg = function(k){ return '<svg class="qic" viewBox="0 0 24 24" aria-hidden="true">' + ICN[k] + '</svg>'; };
  var TICK = '<span class="tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>';
  var ARROW = '<svg class="ic" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var BACK = '<svg class="ic" aria-hidden="true" viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';

  /* estado */
  var A = { edad: [], objetivos: [], estancia: [], destinos: [], duracion: [] };
  var I = [];                                   /* intereses concretos (solo cuentan si está marcado TALENT) */
  var C = { nombre: '', email: '', telefono: '', inicio: '', comentarios: '', privacidad: false };
  var step = 0, dir = 1, finalShownAt = 0, sending = false, sent = false, after = '';
  try {
    var saved = JSON.parse(sessionStorage.getItem(STORE) || 'null');
    if (saved && saved.A) { A = saved.A; I = saved.I || []; C = saved.C || C; step = Math.min(saved.step || 0, Q.length); C.privacidad = false; }
  } catch (e) {}
  function save(){ try { sessionStorage.setItem(STORE, JSON.stringify({ A: A, I: I, C: { nombre: C.nombre, email: C.email, telefono: C.telefono, inicio: C.inicio, comentarios: C.comentarios }, step: step })); } catch (e) {} }
  function forget(){ try { sessionStorage.removeItem(STORE); } catch (e) {} }
  function talents(){ return A.objetivos.indexOf(TALENT) >= 0 ? I.slice() : []; }
  function list(k){ return A[k].join(' · '); }

  /* ---------- pintar ---------- */
  function bar(){
    var n = Math.min(step, Q.length) + 1;
    var segs = ''; for (var i = 1; i <= TOTAL; i++) segs += '<i class="' + (i < n ? 'done' : i === n ? 'now' : '') + '"></i>';
    return '<div class="qz-top"><span class="qz-count">Paso ' + n + ' de ' + TOTAL + '</span><div class="qz-steps" role="progressbar" aria-valuemin="1" aria-valuemax="' + TOTAL + '" aria-valuenow="' + n + '" aria-label="Paso ' + n + ' de ' + TOTAL + '">' + segs + '</div></div>';
  }
  function tile(q, o){
    var on = A[q.k].indexOf(o.v) >= 0, inner, cls = 'tile';
    if (o.img) { inner = '<span class="thumb"><img src="' + IMG + o.img + '" alt="" loading="lazy" width="480" height="300"></span><b>' + o.v + '</b>' + (o.note ? '<small class="tnote">' + o.note + '</small>' : ''); cls += ' is-thumb'; }
    else if (o.thumbIc) { inner = '<span class="thumb thumb--ic">' + svg(o.ic) + '</span><b>' + o.v + '</b>'; cls += ' is-thumb'; }
    else if (o.big) { inner = '<span class="big">' + o.big + '</span><span class="sub">años</span>'; cls += ' is-age'; }
    else if (o.seg !== undefined) { inner = '<span class="tl' + (o.seg ? '' : ' tl--open') + '" aria-hidden="true">' + [1, 2, 3].map(function(n){ return '<i class="' + (n <= o.seg ? 'on' : '') + '"></i>'; }).join('') + '</span><b>' + o.v + '</b><small class="tnote">' + o.cap + '</small>'; cls += ' is-time'; }
    else { inner = svg(o.ic) + '<b>' + o.v + '</b>'; cls += ' is-ic'; }
    return '<button type="button" class="' + cls + '"' + (q.multi ? ' data-multi' : '') + ' aria-pressed="' + on + '" data-v="' + esc(o.v) + '"' + (o.big ? ' aria-label="' + o.v + '"' : '') + (o.sub ? ' aria-controls="qzSub" aria-expanded="' + on + '"' : '') + '>' + TICK + inner + '</button>';
  }
  function chips(){
    var open = A.objetivos.indexOf(TALENT) >= 0;
    return '<div class="qz-sub' + (open ? ' is-open' : '') + '" id="qzSub"' + (open ? '' : ' inert') + '><div class="qz-sub-in"><div class="qz-sub-box">' +
      '<p class="qz-sub-t">¿Qué le interesa? <small>Podéis elegir varias · opcional</small></p>' +
      INTERESTS.map(function(g){ return '<div class="qz-chips" role="group" aria-label="' + g.g + '"><span class="qz-chips-g">' + g.g + '</span>' +
        g.o.map(function(v){ return '<button type="button" class="chip" data-chip="' + esc(v) + '" aria-pressed="' + (I.indexOf(v) >= 0) + '">' + v + '</button>'; }).join('') + '</div>'; }).join('') +
      '</div></div></div>';
  }
  function summary(){
    return '<aside class="qz-sum" aria-labelledby="qzSumT"><h4 id="qzSumT">Vuestras respuestas</h4><ol>' + Q.map(function(q, i){
      var vals = A[q.k].slice(), extra = '';
      if (q.k === 'objetivos' && talents().length) extra = '<span class="qz-sum-sub">' + talents().map(function(t){ return '<em>' + esc(t) + '</em>'; }).join('') + '</span>';
      return '<li><span class="qz-sum-k">' + q.label + '</span><span class="qz-sum-v">' + vals.map(function(v){ return '<span>' + esc(v) + '</span>'; }).join('') + extra + '</span><button type="button" class="qz-sum-edit" data-go="' + i + '" aria-label="Cambiar: ' + q.label + '">Cambiar</button></li>';
    }).join('') + '</ol></aside>';
  }
  function draw(focus){
    if (sent) return;
    var cls = 'qz-step' + (dir < 0 ? ' is-back' : '');
    if (step < Q.length) {
      var q = Q[step];
      var tcls = 'tiles' + (q.cols === 4 ? ' tiles--4' : q.cols === 5 ? ' tiles--5' : '');
      qz.innerHTML = bar() + '<div class="' + cls + '"><div class="qz-q"><h3 tabindex="-1">' + q.t + '</h3><small>' + (q.multi ? 'Podéis elegir varias' : 'Elegid una') + '</small></div>' +
        '<div class="' + tcls + '" role="group" aria-label="' + esc(q.t) + '">' + q.o.map(function(o){ return tile(q, o); }).join('') + '</div>' +
        (q.k === 'objetivos' ? chips() : '') +
        '<div class="qz-nav"><button type="button" class="qz-back" data-act="back"' + (step ? '' : ' disabled') + '>' + BACK + 'Anterior</button>' +
        '<button type="button" class="btn-primary qz-next" data-act="next"' + (A[q.k].length ? '' : ' disabled') + '>Siguiente ' + ARROW + '</button></div></div>';
    } else {
      finalShownAt = Date.now();
      qz.innerHTML = bar() + '<div class="' + cls + '"><div class="qz-q qz-q--final"><h3 tabindex="-1">Ya conocemos un poco mejor lo que estáis buscando</h3><p>Dejadnos vuestros datos y os preparamos una primera orientación.</p></div>' +
        '<div class="qz-final">' + summary() +
        '<form id="qzForm" novalidate><div class="fgrid">' +
          '<div class="field full" data-f="nombre"><label for="qN">Nombre del padre, madre o tutor</label><input id="qN" name="fullName" autocomplete="name" required aria-describedby="qNe" value="' + esc(C.nombre) + '"><span class="err" id="qNe">Escribid vuestro nombre.</span></div>' +
          '<div class="field" data-f="email"><label for="qE">Correo electrónico</label><input id="qE" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="qEe" value="' + esc(C.email) + '"><span class="err" id="qEe">Revisad el correo: parece incompleto.</span></div>' +
          '<div class="field" data-f="telefono"><label for="qT">Teléfono <small>(opcional)</small></label><input id="qT" name="phone" type="tel" autocomplete="tel" inputmode="tel" aria-describedby="qTe" value="' + esc(C.telefono) + '"><span class="err" id="qTe">Revisad el teléfono (mínimo 9 cifras).</span></div>' +
          '<div class="field full"><label for="qI">¿Cuándo os gustaría empezar? <small>(opcional)</small></label><select id="qI" name="inicio"><option value="">Elegid una opción</option>' + STARTS.map(function(s){ return '<option' + (C.inicio === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></div>' +
          '<div class="field full"><label for="qC">Comentarios <small>(opcional)</small></label><textarea id="qC" name="message" maxlength="1500" placeholder="Curso actual, nivel de inglés, dudas…">' + esc(C.comentarios) + '</textarea></div>' +
          '<div class="hp" aria-hidden="true"><label for="qW">Web</label><input id="qW" name="website" tabindex="-1" autocomplete="off"></div>' +
          '<div class="full check-wrap" data-f="privacidad"><label class="check"><input type="checkbox" id="qP" required> <span>He leído la <a href="legal.html#privacidad" target="_blank" rel="noopener">política de privacidad</a> y acepto que uséis mis datos para responder a esta consulta.</span></label><span class="err">Para enviarlo, aceptad la política de privacidad.</span></div>' +
        '</div>' +
        '<div class="qz-send"><button type="button" class="qz-back" data-act="back">' + BACK + 'Anterior</button><button type="submit" class="btn-primary" id="qzSend">' + SEND + '</button></div>' +
        '<div id="qzAlert" class="qz-alert" role="alert" hidden></div>' +
        '</form></div></div>';
    }
    save();
    if (focus) {
      var h = $('h3', qz); if (h) h.focus({ preventScroll: true });
      var top = qz.getBoundingClientRect().top;
      if (top < 70 || top > innerHeight * .6) window.scrollTo({ top: scrollY + top - 150, behavior: reduce ? 'auto' : 'smooth' });
    }
  }
  function go(n){ dir = n > step ? 1 : -1; step = Math.max(0, Math.min(Q.length, n)); draw(true); }
  function keep(){
    if (!$('#qzForm', qz)) return;
    C.nombre = $('#qN').value.trim(); C.email = $('#qE').value.trim(); C.telefono = $('#qT').value.trim();
    C.inicio = $('#qI').value; C.comentarios = $('#qC').value.trim(); C.privacidad = $('#qP').checked;
    save();
  }
  function validate(){
    keep(); var bad = [];
    var mark = function(f, isBad){ var el = $('[data-f="' + f + '"]', qz); if (!el) return; el.classList.toggle('is-bad', isBad); var inp = $('input', el); if (inp) inp.setAttribute('aria-invalid', isBad ? 'true' : 'false'); if (isBad) bad.push(el); };
    mark('nombre', C.nombre.length < 2);
    mark('email', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(C.email));
    mark('telefono', C.telefono !== '' && C.telefono.replace(/\D/g, '').length < 9);
    mark('privacidad', !C.privacidad);
    if (bad.length) { var inp = $('input, textarea', bad[0]); if (inp) inp.focus(); }
    return !bad.length;
  }

  /* ---------- después de enviar: llamada o contacto personal ---------- */
  var CB = window.ilCallBooking, picker = null, booking = false, bookKey = null;
  function newKey(){ return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'k' + Date.now() + Math.random().toString(16).slice(2); }
  function thanks(){
    var first = esc(C.nombre.split(' ')[0]);
    qz.innerHTML = '<div class="qz-step qz-ok"><div class="qz-ok-head"><span class="okic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>' +
      '<div><h3 tabindex="-1">Gracias, ' + first + '. Ya tenemos vuestras respuestas.</h3><p>Están guardadas: no hace falta volver a escribirlas. ¿Cómo preferís seguir?</p></div></div>' +
      '<div class="qz-paths" role="group" aria-label="Cómo seguir">' +
        '<button type="button" class="qz-path" data-path="call" aria-pressed="' + (after === 'call') + '"><b>Reservar una llamada</b><span>Elegid día y hora para hablar con nosotros. 30 minutos, sin compromiso.</span></button>' +
        '<button type="button" class="qz-path" data-path="contact" aria-pressed="' + (after === 'contact') + '"><b>Prefiero que me contactéis</b><span>Una persona del equipo revisa vuestro caso y os escribe o llama personalmente.</span></button>' +
      '</div><div class="qz-after" id="qzAfterBox" aria-live="polite"></div></div>';
    $('h3', qz).focus({ preventScroll: true });
  }
  function showContact(){
    $('#qzAfterBox').innerHTML = '<div class="qz-done"><h4>Perfecto. Nos ponemos en contacto con vosotros.</h4><p>Una persona del equipo revisará vuestras respuestas y os escribirá a <b>' + esc(C.email) + '</b>' + (C.telefono ? ' o os llamará al <b>' + esc(C.telefono) + '</b>' : '') + '.</p></div>';
  }
  function showCall(){
    var box = $('#qzAfterBox');
    if (!CB || !CB.enabled) {
      /* sin calendario configurado: hueco preparado, sin horarios inventados */
      box.innerHTML = '<div class="qz-cal qz-cal--off"><h4>Reserva de llamada</h4><p>La reserva en línea todavía no está disponible. Vuestras respuestas ya nos han llegado: os escribimos para acordar el día y la hora de la llamada.</p>' +
        '<button type="button" class="qz-link" data-path="contact">De acuerdo, esperamos vuestro contacto</button></div>';
      return;
    }
    box.innerHTML = '<div class="qz-cal"><h4>¿Cuándo os viene bien que hablemos?</h4><p>Elegid un día y una hora. Os llamaremos al número que indiquéis. 30 minutos, sin compromiso.</p>' +
      '<div class="field" data-f="telcall"><label for="qTc">Teléfono para la llamada</label><input id="qTc" type="tel" autocomplete="tel" inputmode="tel" value="' + esc(C.telefono) + '"><span class="err">Necesitamos un teléfono (mínimo 9 cifras).</span></div>' +
      '<div id="qzPicker" role="group" aria-label="Día y hora de la llamada"></div>' +
      '<div class="qz-alert" id="qzCallErr" role="alert" hidden></div>' +
      '<div class="qz-cal-acts"><button type="button" class="btn-primary" id="qzBook">Confirmar llamada</button><button type="button" class="qz-link" data-path="contact">Ninguna hora me va bien: llamadme vosotros</button></div></div>';
    picker = CB.mount($('#qzPicker'), { onState: function(st){ var b = $('#qzBook'); if (b) b.hidden = st === 'off' || st === 'error'; } });
    picker.load();
  }
  function bookCall(){
    if (booking) return;                                            /* doble clic */
    var err = $('#qzCallErr'), tel = $('#qTc'), slot = picker && picker.selected();
    err.hidden = true;
    var telOk = tel.value.replace(/\D/g, '').length >= 9;
    $('[data-f="telcall"]', qz).classList.toggle('is-bad', !telOk);
    if (!telOk) { tel.focus(); return; }
    if (!slot) { err.textContent = 'Elegid un día y una hora.'; err.hidden = false; if (picker) picker.focus(); return; }
    C.telefono = tel.value.trim();
    var fp = slot.start + '|' + C.telefono;
    if (!bookKey || bookKey.fp !== fp) bookKey = { fp: fp, key: newKey() };   /* misma clave en reintentos: el servidor no duplica */
    booking = true; var btn = $('#qzBook'), label = btn.textContent; btn.disabled = true; btn.textContent = 'Confirmando…';
    CB.api.book({
      idempotencyKey: bookKey.key, slotStart: slot.start, lang: 'es', website: '',
      contact: { fullName: C.nombre, email: C.email, phone: C.telefono, rgpd: true },
      consult: { service: 'extranjero', serviceLabel: 'Estudiar en el extranjero', studentAge: list('edad'), serviceExtra: extraLine(), callContext: 'Cuestionario «¿Qué colegio podría encajar?»', message: messageText() }
    }).then(function(res){
      booking = false; btn.disabled = false; btn.textContent = label;
      var b = res.body || {};
      if (res.http === 200 && b.status === 'confirmed' && b.booking) {
        $('#qzAfterBox').innerHTML = '<div class="qz-done"><h4>Llamada reservada</h4><p>Os llamaremos el <b>' + esc(CB.longDate(b.booking.date)) + '</b> a las <b>' + esc(b.booking.time) + '</b> (hora de Madrid) al <b>' + esc(b.booking.phone) + '</b>.</p>' + (b.demo ? '<p class="qz-demo-note">Demostración: no se ha reservado nada.</p>' : '') + '</div>';
        $$('.qz-path', qz).forEach(function(x){ x.disabled = true; });
        forget();
        return;
      }
      if (b.status === 'slot_taken' || b.status === 'day_full') { err.textContent = 'Esa hora ya no está libre. Elegid otra.'; picker.clear(); picker.refresh(); }
      else err.textContent = 'No hemos podido reservar la llamada. Vuestras respuestas ya nos han llegado: podéis intentarlo de nuevo o esperar a que os contactemos.';
      err.hidden = false;
    });
  }

  /* ---------- texto que recibe Interlanguage ---------- */
  function extraLine(){ return 'Cuestionario «¿Qué colegio podría encajar?» · Estancia: ' + list('estancia') + ' · Destinos: ' + list('destinos') + ' · Duración: ' + list('duracion'); }
  function messageText(){
    return 'Objetivos: ' + list('objetivos') +
      (talents().length ? '\nIntereses: ' + talents().join(', ') : '') +
      '\nEstancia: ' + list('estancia') + '\nDestinos: ' + list('destinos') + '\nDuración: ' + list('duracion') +
      '\nInicio aproximado: ' + (C.inicio || '—') + '\nComentarios: ' + (C.comentarios || '—');
  }

  /* ---------- eventos ---------- */
  qz.addEventListener('click', function(e){
    var t = e.target.closest('button'); if (!t || !qz.contains(t)) return;
    if (t.classList.contains('tile')) {
      var q = Q[step], v = t.getAttribute('data-v'), o = q.o.filter(function(x){ return x.v === v; })[0];
      if (!q.multi) A[q.k] = [v];
      else {
        var i = A[q.k].indexOf(v);
        if (i >= 0) A[q.k].splice(i, 1);
        else if (o.solo) A[q.k] = [v];                                    /* excluyente */
        else { A[q.k] = A[q.k].filter(function(x){ return !q.o.some(function(y){ return y.solo && y.v === x; }); }); A[q.k].push(v); }
      }
      $$('.tile', qz).forEach(function(b){ var on = A[q.k].indexOf(b.getAttribute('data-v')) >= 0; b.setAttribute('aria-pressed', on ? 'true' : 'false'); if (b.hasAttribute('aria-expanded')) b.setAttribute('aria-expanded', on ? 'true' : 'false'); });
      var sub = $('#qzSub', qz);
      if (sub) { var open = A.objetivos.indexOf(TALENT) >= 0; sub.classList.toggle('is-open', open); if (open) sub.removeAttribute('inert'); else sub.setAttribute('inert', ''); }
      var nx = $('.qz-next', qz); if (nx) nx.disabled = !A[q.k].length;
      save();
      if (!q.multi) setTimeout(function(){ if (Q[step] === q) go(step + 1); }, reduce ? 0 : 220);
      return;
    }
    if (t.hasAttribute('data-chip')) {
      var c = t.getAttribute('data-chip'), j = I.indexOf(c);
      if (j >= 0) I.splice(j, 1); else I.push(c);
      t.setAttribute('aria-pressed', j >= 0 ? 'false' : 'true');
      save(); return;
    }
    if (t.hasAttribute('data-path')) {
      after = t.getAttribute('data-path');
      $$('.qz-path', qz).forEach(function(x){ x.setAttribute('aria-pressed', x.getAttribute('data-path') === after ? 'true' : 'false'); });
      if (after === 'call') showCall(); else showContact();
      return;
    }
    if (t.id === 'qzBook') { bookCall(); return; }
    var act = t.getAttribute('data-act');
    if (act === 'next') { if (A[Q[step].k].length) go(step + 1); return; }
    if (act === 'back') { keep(); go(step - 1); return; }
    if (t.hasAttribute('data-go')) { keep(); go(+t.getAttribute('data-go')); return; }
  });
  qz.addEventListener('input', function(e){ var f = e.target.closest('.field, .check-wrap'); if (f && f.classList.contains('is-bad')) { keep(); f.classList.remove('is-bad'); } else if ($('#qzForm', qz)) keep(); });
  qz.addEventListener('change', function(e){ var f = e.target.closest('.check-wrap'); if (f) f.classList.remove('is-bad'); if ($('#qzForm', qz)) keep(); });
  qz.addEventListener('submit', function(e){
    e.preventDefault();
    if (sending || sent) return;                                        /* sin envíos dobles */
    var alertBox = $('#qzAlert'); alertBox.hidden = true;
    if (!validate()) return;
    if ($('#qW').value || Date.now() - finalShownAt < 2500) { sent = true; forget(); thanks(); return; }   /* robots: parece enviado, no se manda nada */
    var btn = $('#qzSend');
    sending = true; btn.setAttribute('aria-busy', 'true'); btn.disabled = true; btn.innerHTML = '<span class="spin" aria-hidden="true"></span>Enviando…';
    var payload = new URLSearchParams({
      form_type: 'lead', service: 'extranjero', serviceExtra: extraLine(), studentAge: list('edad'), message: messageText(),
      fullName: C.nombre, email: C.email, phone: C.telefono, contactPreference: C.telefono ? 'Teléfono o correo' : 'Correo',
      rgpd: '1', comunicaciones: 'No', website: $('#qW').value
    });
    var req = fetch('form-handler.php', { method: 'POST', body: payload }).then(function(r){ if (!r.ok) throw new Error('http'); return r.json(); });
    req.then(function(res){
      if (!res || !res.ok) throw new Error('resp');
      sending = false; sent = true; forget();
      if (window.dataLayer) { window.dataLayer.push({ event: 'lead_generado', servicio: 'extranjero', origen: 'cuestionario' }); window.dataLayer.push({ event: 'formulario_enviado', servicio: 'extranjero' }); }
      thanks();
    }).catch(function(){
      sending = false; btn.removeAttribute('aria-busy'); btn.disabled = false; btn.textContent = SEND;
      alertBox.textContent = 'No hemos podido enviar vuestras respuestas. Revisad la conexión y volved a intentarlo; lo que habéis escrito se conserva. También podéis escribirnos a info@interlanguage.es.';
      alertBox.hidden = false;
    });
  });
  window.ilExtQuiz = { reset: function(){ forget(); A = { edad: [], objetivos: [], estancia: [], destinos: [], duracion: [] }; I = []; C = { nombre: '', email: '', telefono: '', inicio: '', comentarios: '', privacidad: false }; step = 0; sent = false; after = ''; draw(false); } };
  draw(false);
})();
