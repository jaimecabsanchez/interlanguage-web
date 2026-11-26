/* Recorridos de orientación, plaza e inscripción (23-11-2026, aprobados por Jaime con el diseño «Foto al lado»).
   - Campamentos de verano en el extranjero: cuestionario por pasos (edad, fechas, programa de 14 a 17 años, lo que buscan los padres)
     que termina en «nuestro equipo estudia vuestro caso y os envía propuestas» y los datos. Formulario de Netlify «consulta».
   - Campamentos de verano en Madrid: una página por bloques (semanas, hijos, vuestros datos) con resumen. Formulario «campamento».
     data-estado="hoy" (sin convocatoria) o "abierta" (sede, semanas con fechas y precio al momento). OJO: los datos de «abierta»
     son los de la EDICIÓN ANTERIOR: actualízalos (WEEKS_OPEN, PACK, COMEDOR, SEDES) antes de poner data-estado="abierta".
   - Inglés extraescolar: curso exacto → club, colegio, días preferidos y datos para la plaza. Formulario «consulta».
   El cuestionario de «Estudiar en el extranjero» sigue en js/extranjero.js, con el mismo marco (css/recorridos.css).
   Envío: window.ilSendForm (main.js). Campo trampa y tiempo mínimo contra robots; sin envíos dobles; si falla, lo escrito se conserva.
   Textos ES/EN en línea con t('es', 'en'). */
(function(){
  'use strict';
  var EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
  function t(es, en){ return EN ? en : es; }
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var IMG = '/images/', EUR = ' €';
  var money = function(n){ return EN ? '€' + n : String(n) + EUR; };

  /* ---------- piezas comunes (mismo marcado que el cuestionario de js/extranjero.js) ---------- */
  var COMPASS = '<svg class="qic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path class="a" d="M15.3 8.7l-2 4.6-4.6 2 2-4.6z"/></svg>';
  var TICK = '<span class="tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>';
  var ARROW = '<svg class="ic" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var BACK = '<svg class="ic" aria-hidden="true" viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
  var OKIC = '<span class="okic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>';
  var CAL = '<svg class="ic" aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>';

  function optHTML(def, o, sel){
    var on = sel.indexOf(o.v) >= 0, inner, cls = 'tile';
    if (o.img) { inner = '<span class="thumb"><img src="' + IMG + o.img + '" alt="" loading="lazy" width="480" height="300">' + (o.sup ? '<span class="rx-sup">' + o.sup + '</span>' : '') + '</span><b>' + o.v + '</b>'; cls += ' is-thumb'; }
    else if (o.thumbIc) { inner = '<span class="thumb thumb--ic">' + COMPASS + '</span><b>' + o.v + '</b>'; cls += ' is-thumb'; }
    else if (o.big) { inner = '<span class="big">' + o.big + '</span><span class="sub">' + t('años', 'years old') + '</span>'; cls += ' is-age'; }
    else if (o.seg !== undefined) { var bars = ''; for (var n = 1; n <= (def.segOf || 3); n++) bars += '<i class="' + (n <= o.seg ? 'on' : '') + '"></i>'; inner = '<span class="tl' + (o.seg ? '' : ' tl--open') + '" aria-hidden="true">' + bars + '</span><b>' + o.v + '</b>'; cls += ' is-time'; }
    else { inner = '<b>' + o.v + '</b>' + (o.cap ? '<small class="tnote">' + o.cap + '</small>' : ''); cls += ' is-card'; }
    return '<button type="button" class="' + cls + '"' + (def.multi ? ' data-multi' : '') + ' data-k="' + def.k + '" data-v="' + esc(o.v) + '" aria-pressed="' + on + '"' + (o.big ? ' aria-label="' + esc(o.v) + '"' : '') + '>' + TICK + inner + '</button>';
  }
  function tilesHTML(def, sel){ return '<div class="tiles tiles--' + (def.cols || 3) + '" role="group" aria-label="' + esc(def.t) + '">' + def.o.map(function(o){ return optHTML(def, o, sel); }).join('') + '</div>'; }
  function chipsHTML(def, sel){
    return '<div class="qz-chips" role="group" aria-label="' + esc(def.t) + '">' + def.o.map(function(o){ var v = o.v || o; return '<button type="button" class="chip" data-k="' + def.k + '" data-v="' + esc(v) + '" aria-pressed="' + (sel.indexOf(v) >= 0) + '">' + v + '</button>'; }).join('') + '</div>';
  }
  function fieldHTML(f, C, pre){
    var id = pre + f.id, v = C[f.k] || '';
    if (f.fold && !C['_open_' + f.k] && !v) return '<div class="full"><button type="button" class="rx-more" data-open="' + f.k + '">+ ' + f.fold + '</button></div>';
    var input = f.area
      ? '<textarea id="' + id + '" name="' + f.name + '" maxlength="1500"' + (f.ph ? ' placeholder="' + esc(f.ph) + '"' : '') + '>' + esc(v) + '</textarea>'
      : '<input id="' + id + '" name="' + f.name + '" type="' + (f.type || 'text') + '"' + (f.ac ? ' autocomplete="' + f.ac + '"' : ' autocomplete="off"') +
        (f.type === 'email' ? ' inputmode="email" autocapitalize="off" spellcheck="false"' : f.type === 'tel' ? ' inputmode="tel"' : ' autocapitalize="words"') +
        (f.req ? ' required' : '') + (f.err ? ' aria-describedby="' + id + '-err"' : '') + (f.ph ? ' placeholder="' + esc(f.ph) + '"' : '') + ' value="' + esc(v) + '">';
    return '<div class="field' + (f.full || f.area ? ' full' : '') + '" data-f="' + f.k + '"><label for="' + id + '">' + f.label + (f.opt ? ' <small>' + t('(opcional)', '(optional)') + '</small>' : '') + '</label>' + input + (f.err ? '<span class="err" id="' + id + '-err">' + f.err + '</span>' : '') + '</div>';
  }
  function privHTML(pre, what){
    return '<div class="full check-wrap" data-f="privacidad"><label class="check"><input type="checkbox" id="' + pre + 'P" required> <span>' + t('He leído la', 'I have read the') + ' <a href="legal.html#privacidad" target="_blank" rel="noopener">' + t('política de privacidad', 'privacy policy') + '</a> ' + what + '</span></label><span class="err">' + t('Para enviarlo, aceptad la política de privacidad.', 'To send it, please accept the privacy policy.') + '</span></div>';
  }
  function newsHTML(pre, C){ return '<div class="full"><label class="check"><input type="checkbox" id="' + pre + 'News"' + (C.news ? ' checked' : '') + '> <span>' + t('Quiero recibir información sobre programas y novedades de Interlanguage.', 'I would like to receive information about Interlanguage programmes and news.') + ' <small>' + t('Opcional; puedo darme de baja cuando quiera.', 'Optional; I can unsubscribe at any time.') + '</small></span></label></div>'; }
  function hpHTML(pre){ return '<div class="hp" aria-hidden="true"><label for="' + pre + 'W">Web</label><input id="' + pre + 'W" name="website" tabindex="-1" autocomplete="off"></div>'; }
  function keepFields(F, C, scope, pre){
    F.forEach(function(f){ var el = $('#' + pre + f.id, scope); if (el) C[f.k] = el.value.trim(); });
    var p = $('#' + pre + 'P', scope); if (p) C.privacidad = p.checked;
    var n = $('#' + pre + 'News', scope); if (n) C.news = n.checked;
  }
  function validateFields(F, C, scope, pre){
    keepFields(F, C, scope, pre);
    var bad = [];
    var mark = function(k, isBad){ var el = $('[data-f="' + k + '"]', scope); if (!el) return; el.classList.toggle('is-bad', isBad); var inp = $('input, textarea', el); if (inp && inp.type !== 'checkbox') inp.setAttribute('aria-invalid', isBad ? 'true' : 'false'); if (isBad) bad.push(el); };
    F.forEach(function(f){
      if (!$('#' + pre + f.id, scope)) return;
      var v = C[f.k] || '';
      mark(f.k, !!((f.req && v.length < (f.min || 1)) || (f.type === 'email' && v !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) || (f.type === 'tel' && v !== '' && v.replace(/\D/g, '').length < 9)));
    });
    mark('privacidad', !C.privacidad);
    return bad;
  }
  /* envío real (Netlify Forms, vía main.js). Robots: campo trampa o menos de 2,5 s → parece enviado y no se manda nada */
  function send(o){
    if (o.btn.disabled) return;
    if ((o.hp && o.hp.value) || Date.now() - o.shownAt < 2500) { o.onOk(); return; }
    var label = o.btn.textContent;
    o.btn.disabled = true; o.btn.setAttribute('aria-busy', 'true'); o.btn.innerHTML = '<span class="spin" aria-hidden="true"></span>' + t('Enviando…', 'Sending…');
    o.alert.hidden = true;
    var req = window.ilSendForm ? window.ilSendForm(o.form, new URLSearchParams(o.fields), o.subject) : Promise.reject(new Error('nosend'));
    req.then(function(){ if (window.ilTrack) { window.ilTrack('lead_generado', { servicio: o.fields.service || o.form, origen: o.fields.recorrido || '' }); window.ilTrack('formulario_enviado', { servicio: o.fields.service || o.form }); } o.onOk(); }).catch(function(){
      o.btn.disabled = false; o.btn.removeAttribute('aria-busy'); o.btn.textContent = label;
      o.alert.textContent = t('No hemos podido enviarlo. Revisad la conexión y volved a intentarlo: lo que habéis escrito se conserva. También podéis escribirnos a info@interlanguage.es.', 'We could not send it. Please check your connection and try again: everything you have written is kept. You can also email us at info@interlanguage.es.');
      o.alert.hidden = false; o.alert.focus();
    });
  }
  function okHTML(title, text, extra){ return '<div class="qz-step qz-ok"><div class="qz-ok-head">' + OKIC + '<div><h3 tabindex="-1">' + title + '</h3><p>' + text + '</p></div></div>' + (extra || '') + '</div>'; }
  function afterList(items){ return '<ol class="after rx-after">' + items.map(function(i){ return '<li><div><b>' + i[0] + '</b>' + i[1] + '</div></li>'; }).join('') + '</ol>'; }
  function toTop(mount){ if (!mount.offsetParent) return; var top = mount.getBoundingClientRect().top; if (top < 70 || top > innerHeight * .6) window.scrollTo({ top: scrollY + top - 110, behavior: reduce ? 'auto' : 'smooth' }); }
  function load(k){ try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function store(k, v){ try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function drop(k){ try { sessionStorage.removeItem(k); } catch (e) {} }
  function first(n){ return esc(String(n || '').split(' ')[0]); }
  /* resumen: a la izquierda bajo la foto (escritorio) y antes del botón (móvil) */
  function sumHTML(title, rows, tot){
    return '<h3 class="rx-sum-t">' + title + '</h3><dl class="rx-sum-dl">' + rows.map(function(r){ return '<div><dt>' + r[0] + '</dt><dd>' + (r[1] || '<span class="rx-sum-empty">' + t('Sin elegir', 'Not chosen') + '</span>') + '</dd></div>'; }).join('') + '</dl>' +
      (tot ? '<div class="rx-sum-tot"><span>' + tot.k + '</span><strong>' + tot.v + '</strong></div>' + (tot.n ? '<p class="rx-sum-n">' + tot.n + '</p>' : '') : '');
  }
  function painter(mount){
    var aside = mount.closest('.rx-shell') && mount.closest('.rx-shell').querySelector('.rx-sum--aside');
    return function(html){ if (aside) { aside.innerHTML = html; aside.hidden = !html; } $$('.rx-sum--inline', mount).forEach(function(el){ el.innerHTML = html; }); };
  }
  function blk(title, hint, body){ return '<section class="rx-blk"><div class="rx-blk-h"><h3 class="rx-blk-t">' + title + '</h3>' + (hint ? '<p class="rx-blk-hint">' + hint + '</p>' : '') + '</div><div class="rx-blk-b">' + body + '</div></section>'; }
  var F_NOMBRE = { id: 'N', k: 'nombre', name: 'fullName', label: t('Nombre del padre, madre o tutor', 'Parent or guardian’s name'), ac: 'name', req: true, min: 2, full: true, err: t('Escribid vuestro nombre.', 'Please write your name.') };
  var F_EMAIL = { id: 'E', k: 'email', name: 'email', type: 'email', label: t('Correo electrónico', 'Email'), ac: 'email', req: true, err: t('Revisad el correo: parece incompleto.', 'Please check the email: it looks incomplete.') };
  var F_TEL_REQ = { id: 'T', k: 'telefono', name: 'phone', type: 'tel', label: t('Teléfono', 'Phone'), ac: 'tel', req: true, err: t('Indicad un teléfono (mínimo 9 cifras).', 'Please give a phone number (at least 9 digits).') };
  var F_TEL_OPT = { id: 'T', k: 'telefono', name: 'phone', type: 'tel', label: t('Teléfono', 'Phone'), ac: 'tel', opt: true, err: t('Revisad el teléfono (mínimo 9 cifras).', 'Please check the phone number (at least 9 digits).') };

  /* =====================================================================
     CAMPAMENTOS DE VERANO EN EL EXTRANJERO · cuestionario por pasos
     Selección única en un paso de tarjetas: avanza sola. Varias preguntas o varias respuestas: «Siguiente». */
  var VERANO = {
    store: 'il-rx-verano-v1', service: 'verano-extranjero',
    steps: [
      { k: 'edad', label: t('Edad', 'Age'), t: t('¿Qué edad tendrá este verano?', 'How old will they be this summer?'), cols: 3, o: [
        { v: t('8–9 años', '8–9 years old'), big: '8–9' }, { v: t('10–13 años', '10–13 years old'), big: '10–13' }, { v: t('14–17 años', '14–17 years old'), big: '14–17' } ] },
      { label: t('Fechas', 'Dates'), t: t('¿Cuándo podría ir y cuánto tiempo?', 'When could they go, and for how long?'), hint: t('Fechas de 2027', '2027 dates'), parts: [
        { k: 'periodo', t: t('¿Qué parte del verano?', 'Which part of the summer?'), multi: true, cols: 4, o: [
          { v: t('Finales de junio', 'Late June'), cap: t('Desde el 27 de junio', 'From 27 June') }, { v: t('Julio', 'July'), cap: t('En los cuatro colegios', 'At all four schools') },
          { v: t('Agosto', 'August'), cap: t('Hasta el 15 de agosto', 'Until 15 August') }, { v: t('Somos flexibles', 'We are flexible'), cap: t('Cualquier fecha', 'Any dates'), solo: true } ] },
        { k: 'semanas', t: t('¿Cuántas semanas?', 'How many weeks?'), cols: 5, segOf: 4, o: [
          { v: t('1 semana', '1 week'), seg: 1 }, { v: t('2 semanas', '2 weeks'), seg: 2 }, { v: t('3 semanas', '3 weeks'), seg: 3 }, { v: t('4 semanas', '4 weeks'), seg: 4 }, { v: t('Aún no lo sabemos', 'Not sure yet'), seg: 0 } ] } ] },
      { k: 'programa', label: t('Programa', 'Programme'), t: t('¿Qué programa de inglés os interesa?', 'Which English programme interests you?'), cols: 3, when: function(A){ return (A.edad || [])[0] === t('14–17 años', '14–17 years old'); }, o: [
        { v: t('Inglés general', 'General English'), cap: t('Para todos · 15 h de inglés a la semana', 'For everyone · 15 hours of English a week') },
        { v: t('Inglés y liderazgo', 'English and leadership'), cap: t('Nivel B1 o superior · en Dollar Academy', 'B1 level or above · at Dollar Academy') },
        { v: t('No lo sabemos', 'We are not sure'), cap: t('Os lo explicamos', 'We will explain') } ] },
      /* pregunta a los padres: qué quieren para su hijo (las tardes son de actividades; algunas, con suplemento) */
      { k: 'buscan', label: t('Lo que buscáis', 'What you want'), t: t('Además del inglés, ¿qué os gustaría para vuestro hijo este verano?', 'Besides English, what would you like for your child this summer?'), hint: t('Las tardes son de actividades. Podéis elegir varias.', 'Afternoons are for activities. You can choose more than one.'), multi: true, cols: 3, o: [
        { v: t('Que haga deporte cada día', 'Sport every day'), img: 'internacional/ext-gal-tenis-520.webp' },
        { v: t('Que viva aventuras al aire libre', 'Outdoor adventures'), img: 'internacional/campamento-extranjero-kayak-470.webp' },
        { v: t('Que haga amigos de todo el mundo', 'Friends from all over the world'), img: 'internacional/extranjero-grupo-480.webp' },
        { v: t('Que gane autonomía y confianza', 'Independence and confidence'), img: 'internacional/extranjero-surf-480.webp' },
        { v: t('Que desarrolle su creatividad', 'Creativity'), img: 'internacional/ext-gal-arte-520.webp' },
        { v: t('Que descubra el país y su cultura', 'Discovering the country and its culture'), img: 'internacional/ext-hero-castillo-640.webp' },
        { v: t('Que refuerce aún más su inglés', 'Even more English'), img: 'internacional/ext-gal-teatro-520.webp', sup: t('Suplemento', 'Supplement') },
        { v: t('Que practique golf o hípica', 'Golf or horse riding'), img: 'internacional/ext-duo-golf-430.webp', sup: t('Suplemento', 'Supplement') },
        { v: t('Que lo decida él o ella allí', 'Let them decide there'), thumbIc: true, solo: true } ] },
      { type: 'final', label: t('Vuestros datos', 'Your details'),
        t: t('Nuestro equipo estudiará lo que buscáis', 'Our team will look at what you are looking for'),
        lead: t('Revisamos vuestras respuestas y os escribimos con varias propuestas de campamento, con fechas y precio. Solo nos falta saber cómo contactaros.', 'We review your answers and write to you with several camp options, with dates and prices. We just need to know how to reach you.'),
        send: t('Enviar y recibir propuestas', 'Send and receive options'),
        fields: [F_NOMBRE, F_EMAIL, F_TEL_OPT,
          { id: 'C', k: 'comentarios', name: 'message', area: true, label: t('Comentarios', 'Comments'), opt: true, fold: t('Añadir un comentario (nivel de inglés, si viaja con un hermano o un amigo…)', 'Add a comment (English level, travelling with a sibling or a friend…)'), ph: t('Nivel de inglés, si viaja con un hermano o un amigo, dudas…', 'English level, travelling with a sibling or a friend, questions…') } ] }
    ],
    payload: function(A, C){
      var L = function(k){ return (A[k] || []).join(' · '); };
      return { form: 'consulta', subject: 'Orientación · Campamentos de verano en el extranjero — ' + C.nombre, fields: {
        form_type: 'lead', service: 'verano-extranjero', recorrido: 'cuestionario-campamentos-extranjero',
        serviceExtra: 'Fechas: ' + L('periodo') + ' · Semanas: ' + L('semanas') + (A.programa && A.programa.length ? ' · Programa: ' + L('programa') : ''),
        studentAge: L('edad'),
        message: 'Lo que buscan: ' + L('buscan') + '\nComentarios: ' + (C.comentarios || '—'),
        fullName: C.nombre, email: C.email, phone: C.telefono || '', contactPreference: C.telefono ? 'Teléfono o correo' : 'Correo', rgpd: '1', comunicaciones: 'No' } };
    },
    thanks: function(A, C){
      return okHTML(t('Gracias, ', 'Thank you, ') + first(C.nombre) + t('. Estudiamos vuestro caso.', '. We are looking at your case.'),
        t('Una persona del equipo revisa vuestras respuestas y os escribe a ', 'A member of our team will review your answers and write to you at ') + '<b>' + esc(C.email) + '</b>' + t(' con varias propuestas de campamento, con fechas y precio.', ' with several camp options, with dates and prices.'),
        afterList([[t('Os enviamos propuestas', 'We send you options'), t('Colegios y fechas que encajan, con el precio y lo que incluye.', 'Schools and dates that fit, with the price and what is included.')],
          [t('Elegís y reserváis', 'You choose and book'), t('Os explicamos la señal y el calendario de pagos antes.', 'We explain the deposit and payment schedule first.')],
          [t('Preparamos la salida', 'We prepare the trip'), t('Documentación, maleta y vuelos.', 'Documents, packing and flights.')]]));
    }
  };

  /* =====================================================================
     «AYUDADME A ELEGIR» (portada) · orientación general sobre programas en el extranjero */
  var CURSO = t('Un curso escolar fuera', 'A school term or year abroad'), VERANOX = t('Un campamento de verano', 'A summer camp');
  var ORIENTA = {
    store: 'il-rx-orienta-v1', service: 'orientacion',
    steps: [
      { k: 'edad', label: t('Edad', 'Age'), t: t('¿Qué edad tiene vuestro hijo o hija?', 'How old is your child?'), cols: 3, o: [
        { v: t('8–9 años', '8–9 years old'), big: '8–9' }, { v: t('10–13 años', '10–13 years old'), big: '10–13' }, { v: t('14–18 años', '14–18 years old'), big: '14–18' } ] },
      { k: 'tipo', label: t('Experiencia', 'Experience'), t: t('¿Qué tipo de experiencia os planteáis?', 'What kind of experience are you considering?'), cols: 3, o: [
        { v: CURSO, cap: t('Un trimestre, dos o el curso completo en un colegio · 9 a 18 años', 'One term, two or the full year at a school · ages 9 to 18') },
        { v: VERANOX, cap: t('Semanas de julio y agosto en un colegio · 8 a 17 años, según colegio', 'Weeks in July and August at a school · ages 8 to 17, depending on the school') },
        { v: t('Aún no lo tenemos claro', 'We are not sure yet'), cap: t('Os explicamos las dos opciones', 'We will explain both options') } ] },
      { k: 'destino', label: t('Destino', 'Destination'), t: t('¿Algún destino en mente?', 'Any destination in mind?'), multi: true, cols: 5, when: function(A){ return (A.tipo || [])[0] !== VERANOX; }, o: [
        { v: t('Reino Unido', 'United Kingdom') }, { v: t('Irlanda', 'Ireland') }, { v: t('Estados Unidos', 'United States') }, { v: t('Canadá', 'Canada') },
        { v: t('Sin preferencia', 'No preference'), solo: true } ] },
      { k: 'cuando', label: t('Cuándo', 'When'), t: t('¿Cuándo os gustaría que fuera?', 'When would you like them to go?'), cols: 5, o: [
        { v: t('Durante este curso', 'During this school year'), cap: '2026–2027' }, { v: t('Verano de 2027', 'Summer 2027') }, { v: t('Curso 2027–2028', '2027–2028 school year') }, { v: t('Más adelante', 'Later on') },
        { v: t('Aún no lo sabemos', 'We do not know yet') } ] },
      { type: 'final', label: t('Vuestros datos', 'Your details'),
        t: t('Os orientamos sin compromiso', 'We will advise you, with no commitment'),
        lead: t('Una persona del equipo revisa vuestras respuestas y os escribe con las opciones que encajan. Solo nos falta saber cómo contactaros.', 'A member of our team reviews your answers and writes to you with the options that fit. We just need to know how to reach you.'),
        send: t('Enviar y recibir orientación', 'Send and get advice'),
        fields: [F_NOMBRE, F_EMAIL, F_TEL_OPT,
          { id: 'C', k: 'comentarios', name: 'message', area: true, label: t('Comentarios', 'Comments'), opt: true, fold: t('Añadir un comentario (curso actual, nivel de inglés, dudas…)', 'Add a comment (current school year, English level, questions…)'), ph: t('Curso actual, nivel de inglés, lo que os preocupa…', 'Current school year, English level, what worries you…') } ] }
    ],
    payload: function(A, C){
      var L = function(k){ return (A[k] || []).join(' · '); };
      return { form: 'consulta', subject: 'Orientación · Ayuda para elegir programa en el extranjero — ' + C.nombre, fields: {
        form_type: 'lead', service: 'orientacion', recorrido: 'ayuda-elegir-extranjero',
        serviceExtra: 'Experiencia: ' + L('tipo') + (A.destino && A.destino.length ? ' · Destino: ' + L('destino') : '') + ' · Cuándo: ' + L('cuando'),
        studentAge: L('edad'),
        message: 'Comentarios: ' + (C.comentarios || '—'),
        fullName: C.nombre, email: C.email, phone: C.telefono || '', contactPreference: C.telefono ? 'Teléfono o correo' : 'Correo', rgpd: '1', comunicaciones: 'No' } };
    },
    thanks: function(A, C){
      return okHTML(t('Gracias, ', 'Thank you, ') + first(C.nombre) + t('. Estudiamos vuestro caso.', '. We are looking at your case.'),
        t('Una persona del equipo revisa vuestras respuestas y os escribe a ', 'A member of our team will review your answers and write to you at ') + '<b>' + esc(C.email) + '</b>' + t(' con las opciones que encajan.', ' with the options that fit.'),
        afterList([[t('Os escribimos', 'We write to you'), t('Con los programas que encajan por edad, fechas y lo que buscáis.', 'With the programmes that fit their age, your dates and what you are looking for.')],
          [t('Hablamos', 'We talk'), t('Resolvemos vuestras dudas por correo o por teléfono, como prefiráis.', 'We answer your questions by email or phone, as you prefer.')],
          [t('Decidís sin prisa', 'You decide at your own pace'), t('Sin compromiso: la orientación no os obliga a nada.', 'No commitment: the advice does not bind you to anything.')]]));
    }
  };

  function Wizard(cfg, mount, pre){
    var saved = load(cfg.store) || {};
    var A = saved.A || {}, C = saved.C || {}, step = saved.step || 0, dir = 1, sent = false, finalAt = 0, still = false;
    var DEF = {};
    cfg.steps.forEach(function(s){ (s.parts || [s]).forEach(function(d){ if (d.k) DEF[d.k] = d; }); });
    function get(k){ return A[k] || []; }
    function vis(){ return cfg.steps.filter(function(s){ return !s.when || s.when(A); }); }
    function clean(){ cfg.steps.forEach(function(s){ if (s.when && !s.when(A)) (s.parts || [s]).forEach(function(d){ if (d.k) delete A[d.k]; }); }); }
    function answered(s){ return s.type === 'final' || (s.parts || [s]).every(function(d){ return get(d.k).length; }); }
    function save(){ store(cfg.store, { A: A, C: { nombre: C.nombre, email: C.email, telefono: C.telefono, comentarios: C.comentarios }, step: step }); }
    function bar(V){
      var segs = '';
      V.forEach(function(s, i){
        var lab = '<i></i><span>' + s.label + '</span>';
        segs += '<li class="' + (i < step ? 'done' : i === step ? 'now' : '') + '"' + (i === step ? ' aria-current="step"' : '') + '>' + (i < step ? '<button type="button" data-go="' + i + '" aria-label="' + t('Volver a: ', 'Back to: ') + s.label + '">' + lab + '</button>' : lab) + '</li>';
      });
      return '<div class="qz-top"><div class="qz-prog"><p class="qz-count">' + t('Paso ', 'Step ') + (step + 1) + t(' de ', ' of ') + V.length + '<span class="qz-count-l"> · ' + V[step].label + '</span></p>' +
        '<ol class="qz-steps" style="grid-template-columns:repeat(' + V.length + ',minmax(0,1fr))" aria-label="' + t('Pasos', 'Steps') + '">' + segs + '</ol></div></div>';
    }
    function partHTML(d){ return '<div class="rx-part"><p class="rx-part-t">' + d.t + ' <small>' + (d.multi ? t('Podéis elegir varias', 'You can choose more than one') : t('Elegid una', 'Choose one')) + '</small></p>' + tilesHTML(d, get(d.k)) + '</div>'; }
    function summaryHTML(V){
      return '<aside class="qz-sum" aria-labelledby="' + pre + 'SumT"><h4 id="' + pre + 'SumT">' + t('Vuestras respuestas', 'Your answers') + '</h4><ol>' + V.slice(0, -1).map(function(s, i){
        var vals = []; (s.parts || [s]).forEach(function(d){ vals = vals.concat(get(d.k)); });
        return '<li><span class="qz-sum-k">' + s.label + '</span><span class="qz-sum-v">' + vals.map(function(v){ return '<span>' + esc(v) + '</span>'; }).join('') + '</span><button type="button" class="qz-sum-edit" data-go="' + i + '" aria-label="' + t('Cambiar: ', 'Change: ') + s.label + '">' + t('Cambiar', 'Change') + '</button></li>';
      }).join('') + '</ol></aside>';
    }
    function final(){ var V = vis(); return V[V.length - 1]; }
    function draw(focus){
      if (sent) return;
      clean();
      var V = vis(); step = Math.max(0, Math.min(step, V.length - 1));
      var s = V[step], h = bar(V) + '<div class="qz-step' + (dir < 0 ? ' is-back' : '') + (still ? ' rx-still' : '') + '">';
      if (s.type !== 'final') {
        h += '<div class="qz-q"><h3 tabindex="-1">' + s.t + '</h3>' + (s.parts ? (s.hint ? '<small>' + s.hint + '</small>' : '') : '<small>' + (s.hint || (s.multi ? t('Podéis elegir varias', 'You can choose more than one') : t('Elegid una', 'Choose one'))) + '</small>') + '</div>';
        h += s.parts ? s.parts.map(partHTML).join('') : tilesHTML(s, get(s.k));
        h += '<div class="qz-nav"><button type="button" class="qz-back" data-act="back"' + (step ? '' : ' disabled') + '>' + BACK + t('Anterior', 'Back') + '</button>' +
          '<button type="button" class="btn-primary qz-next" data-act="next"' + (answered(s) ? '' : ' disabled') + '>' + t('Siguiente', 'Next') + ' ' + ARROW + '</button></div>';
      } else {
        finalAt = Date.now();
        h += '<div class="qz-q qz-q--final"><h3 tabindex="-1">' + s.t + '</h3><p>' + s.lead + '</p></div><div class="qz-final">' + summaryHTML(V) +
          '<form class="rx-form" novalidate><div class="fgrid">' + s.fields.map(function(f){ return fieldHTML(f, C, pre); }).join('') + hpHTML(pre) + privHTML(pre, t('y acepto que uséis mis datos para responder a esta consulta.', 'and agree that you may use my details to answer this enquiry.')) + '</div>' +
          '<div class="qz-send"><button type="button" class="qz-back" data-act="back">' + BACK + t('Anterior', 'Back') + '</button><button type="submit" class="btn-primary rx-send">' + s.send + '</button></div>' +
          '<div class="qz-alert rx-alert" role="alert" tabindex="-1" hidden></div></form></div>';
      }
      mount.innerHTML = h + '</div>'; still = false; save();
      if (focus) { var hh = $('h3', mount); if (hh) hh.focus({ preventScroll: true }); toTop(mount); }
    }
    function keep(){ if ($('.rx-form', mount)) { keepFields(final().fields, C, mount, pre); save(); } }
    function go(n){ keep(); dir = n > step ? 1 : -1; step = n; draw(true); }
    function toggle(k, v){
      var d = DEF[k], cur = get(k).slice(), o = d.o.filter(function(x){ return x.v === v; })[0] || {};
      if (!d.multi) cur = [v];
      else {
        var i = cur.indexOf(v);
        if (i >= 0) cur.splice(i, 1);
        else if (o.solo) cur = [v];
        else { cur = cur.filter(function(x){ return !d.o.some(function(y){ return y.solo && y.v === x; }); }); cur.push(v); }
      }
      A[k] = cur;
    }
    mount.addEventListener('click', function(e){
      var b = e.target.closest('button'); if (!b || !mount.contains(b) || sent) return;
      if (b.hasAttribute('data-k')) {
        var s = vis()[step], k = b.getAttribute('data-k'), v = b.getAttribute('data-v');
        toggle(k, v);
        if (!s.parts && s.k === k && !s.multi) {
          save();
          $$('[data-k="' + k + '"]', mount).forEach(function(x){ x.setAttribute('aria-pressed', x.getAttribute('data-v') === v ? 'true' : 'false'); });
          setTimeout(function(){ if (vis()[step] === s) go(step + 1); }, reduce ? 0 : 220);
          return;
        }
        still = true; draw(false);
        var back = $$('[data-k="' + k + '"]', mount).filter(function(x){ return x.getAttribute('data-v') === v; })[0]; if (back) back.focus({ preventScroll: true });
        return;
      }
      if (b.hasAttribute('data-open')) { keep(); C['_open_' + b.getAttribute('data-open')] = true; still = true; draw(false); var f = $('textarea', mount); if (f) f.focus(); return; }
      var act = b.getAttribute('data-act');
      if (act === 'next') { if (answered(vis()[step])) go(step + 1); return; }
      if (act === 'back') { go(step - 1); return; }
      if (b.hasAttribute('data-go')) { go(+b.getAttribute('data-go')); return; }
    });
    mount.addEventListener('input', function(e){ var f = e.target.closest('.field, .check-wrap'); if (f) f.classList.remove('is-bad'); keep(); });
    mount.addEventListener('change', function(e){ var f = e.target.closest('.check-wrap'); if (f) f.classList.remove('is-bad'); keep(); });
    mount.addEventListener('submit', function(e){
      e.preventDefault();
      var s = final(), bad = validateFields(s.fields, C, mount, pre);
      if (bad.length) { var i = $('input, textarea', bad[0]); if (i) i.focus(); return; }
      var p = cfg.payload(A, C);
      send({ form: p.form, fields: Object.assign(p.fields, { website: $('#' + pre + 'W', mount).value }), subject: p.subject, btn: $('.rx-send', mount), alert: $('.rx-alert', mount), hp: $('#' + pre + 'W', mount), shownAt: finalAt,
        onOk: function(){ sent = true; drop(cfg.store); mount.innerHTML = cfg.thanks(A, C); var hh = $('h3', mount); if (hh) hh.focus({ preventScroll: true }); toTop(mount); } });
    });
    draw(false);
  }

  /* =====================================================================
     CAMPAMENTOS DE VERANO EN MADRID · una página por bloques, como la inscripción de la edición anterior */
  var PACK = { 1: 160, 2: 240, 3: 340, 4: 430, 5: 530 }, COMEDOR = 52;                     /* EDICIÓN ANTERIOR: actualizar antes de abrir */
  var SEDES = ['Sagrado Corazón Rosales', 'Sagrado Corazón Chamartín'];                     /* EDICIÓN ANTERIOR */
  var WEEKS_OPEN = [{ v: t('Semana 1', 'Week 1'), cap: t('22–26 jun.', '22–26 Jun') }, { v: t('Semana 2', 'Week 2'), cap: t('29 jun.–3 jul.', '29 Jun–3 Jul') }, { v: t('Semana 3', 'Week 3'), cap: t('6–10 jul.', '6–10 Jul') }, { v: t('Semana 4', 'Week 4'), cap: t('13–17 jul.', '13–17 Jul') }, { v: t('Semana 5', 'Week 5'), cap: t('20–24 jul.', '20–24 Jul') }];   /* EDICIÓN ANTERIOR */
  var WEEKS_HOY = [{ v: t('Semana 1', 'Week 1'), cap: t('Finales de junio', 'Late June') }, { v: t('Semana 2', 'Week 2'), cap: t('1.ª de julio', '1st of July') }, { v: t('Semana 3', 'Week 3'), cap: t('2.ª de julio', '2nd of July') }, { v: t('Semana 4', 'Week 4'), cap: t('3.ª de julio', '3rd of July') }, { v: t('Semana 5', 'Week 5'), cap: t('4.ª de julio', '4th of July') }];
  var AGES = [3, 4, 5, 6, 7, 8, 9];
  function Madrid(mount, pre, abierta){
    var SK = 'il-rx-madrid-' + (abierta ? 'abierta' : 'hoy') + '-v1', W = abierta ? WEEKS_OPEN : WEEKS_HOY, paint = painter(mount);
    var NEWKID = function(){ return { n: '', ap: '', a: '', c: '', al: '' }; };
    var saved = load(SK) || {};
    var st = saved.st || { sede: '', weeks: [], unsure: false, comedor: false, kids: [NEWKID()] };
    var C = saved.C || {}, sent = false, openAl = {}, shownAt = Date.now();
    var FC = [F_NOMBRE, F_EMAIL, F_TEL_REQ];
    var SEND = abierta ? t('Enviar solicitud de inscripción', 'Send registration request') : t('Solicitar plaza', 'Request a place');
    function save(){ store(SK, { st: st, C: { nombre: C.nombre, email: C.email, telefono: C.telefono } }); }
    function tot(){
      var n = st.weeks.length; if (!abierta || !n) return null;
      var com = st.comedor ? COMEDOR * n : 0, per = PACK[n] + com;
      return { n: n, base: PACK[n], com: com, per: per, kids: st.kids.length, total: per * st.kids.length };
    }
    function weeksText(){
      if (!abierta && st.unsure) return t('Aún no lo sabemos', 'Not sure yet');
      return W.filter(function(w){ return st.weeks.indexOf(w.v) >= 0; }).map(function(w){ return abierta ? w.v + ' <small>' + w.cap + '</small>' : w.cap; }).join(abierta ? '<br>' : ', ');
    }
    function weekWord(n){ return n === 1 ? t('semana', 'week') : t('semanas', 'weeks'); }
    function summary(){
      var x = tot(), rows = [];
      if (abierta) rows.push([t('Sede', 'Venue'), esc(st.sede)]);
      rows.push([t('Semanas', 'Weeks'), weeksText()]);
      rows.push([t('Comedor', 'Lunch'), st.comedor ? (abierta ? t('Sí', 'Yes') : t('Nos interesaría', 'Interested')) : t('No', 'No')]);
      rows.push([st.kids.length > 1 ? t('Niños', 'Children') : t('Niño o niña', 'Child'), st.kids.filter(function(k){ return k.n || k.a; }).map(function(k){ return esc(k.n || '—') + (k.a ? ', ' + k.a : ''); }).join('<br>')]);
      if (!abierta) return sumHTML(t('Vuestra solicitud', 'Your request'), rows, { k: t('Precio', 'Price'), v: t('Por confirmar', 'To be confirmed'), n: t('Fechas, sede y tarifa se publican con la convocatoria.', 'Dates, venue and fees will be published when registration opens.') });
      return sumHTML(t('Vuestra inscripción', 'Your registration'), rows, { k: t('Importe total', 'Total'), v: x ? money(x.total) : '—',
        n: x ? x.n + ' ' + weekWord(x.n) + ': ' + money(x.base) + (x.com ? t(' + comedor ', ' + lunch ') + money(x.com) : '') + (x.kids > 1 ? ' · ' + money(x.per) + t(' por niño × ', ' per child × ') + x.kids : '') + (st.comedor ? t('. El comedor necesita un mínimo de 25 alumnos.', '. Lunch needs at least 25 children signed up.') : '') : t('Elegid las semanas para ver el importe.', 'Choose the weeks to see the total.') });
    }
    function weeksBlock(){
      var all = st.weeks.length === W.length, x = tot();
      var h = '<div class="rx-wkbar"><span class="rx-lab">' + (abierta ? t('Semanas', 'Weeks') : t('Semanas que os interesan', 'Weeks you are interested in')) + '</span><button type="button" class="rx-mini" data-wk="all">' + (all ? t('Quitar todas', 'Clear all') : t('Elegir las ', 'Choose all ') + W.length) + '</button></div>' +
        '<div class="rx-wks" role="group" aria-label="' + t('Semanas', 'Weeks') + '">' + W.map(function(w){ return '<button type="button" class="tile rx-wk" data-multi data-wkv="' + w.v + '" aria-pressed="' + (st.weeks.indexOf(w.v) >= 0) + '">' + TICK + '<b>' + w.v + '</b><span class="rx-wk-d">' + w.cap + '</span></button>'; }).join('') + '</div>';
      if (!abierta) h += '<div class="rx-row"><button type="button" class="chip" data-wk="unsure" aria-pressed="' + st.unsure + '">' + t('Aún no lo sabemos', 'Not sure yet') + '</button><span class="rx-note rx-note--in">' + t('Orientativas: las fechas exactas se confirman con la convocatoria.', 'Approximate: exact dates are confirmed when registration opens.') + '</span></div>';
      else h += '<dl class="rx-tarifas" aria-label="' + t('Tarifas por número de semanas', 'Fees by number of weeks') + '">' + [1, 2, 3, 4, 5].map(function(k){ return '<div' + (x && k === x.n ? ' class="is-on"' : '') + '><dt>' + k + ' ' + weekWord(k) + '</dt><dd>' + money(PACK[k]) + '</dd></div>'; }).join('') + '</dl><p class="rx-note rx-note--in">' + t('El precio depende del número de semanas, sean o no seguidas.', 'The price depends on the number of weeks, consecutive or not.') + '</p>';
      h += '<label class="cf-switch rx-switch"><input type="checkbox" class="rx-com"' + (st.comedor ? ' checked' : '') + '><span class="cf-switch-track" aria-hidden="true"></span><span class="cf-switch-tx"><strong>' + (abierta ? t('Servicio de comedor', 'Lunch service') : t('Nos interesaría el comedor', 'We would be interested in lunch')) + '</strong> <small>' + (abierta ? money(COMEDOR) + t(' por semana; mínimo de 25 alumnos apuntados', ' per week; at least 25 children signed up') : t('Os confirmaremos si hay comedor en esta edición', 'We will confirm whether lunch is available this year')) + '</small></span></label>';
      if (abierta) h += '<p class="rx-live" aria-live="polite"><span>' + t('Importe', 'Total') + '</span><strong>' + (x ? money(x.total) : '—') + '</strong><small>' + (x ? x.n + ' ' + weekWord(x.n) + (st.comedor ? t(' con comedor', ' with lunch') : t(' sin comedor', ' without lunch')) + (x.kids > 1 ? ' · ' + x.kids + t(' niños', ' children') : '') : t('Elegid semanas', 'Choose weeks')) + '</small></p>';
      return h;
    }
    function kidHTML(k, i){
      var many = st.kids.length > 1, id = pre + 'k' + i;
      var f = function(kf, label, err, o){ o = o || {}; return '<div class="field' + (o.full ? ' full' : '') + '" data-f="k' + i + kf + '"><label for="' + id + kf + '">' + label + (err ? '' : ' <small>' + t('(opcional)', '(optional)') + '</small>') + '</label>' +
        (o.area ? '<textarea id="' + id + kf + '" data-kid="' + i + '" data-kf="' + kf + '" maxlength="600">' + esc(k[kf]) + '</textarea>' : '<input id="' + id + kf + '" data-kid="' + i + '" data-kf="' + kf + '" type="text" autocomplete="off" autocapitalize="words"' + (o.list ? ' list="' + o.list + '"' : '') + (o.ph ? ' placeholder="' + o.ph + '"' : '') + ' value="' + esc(k[kf]) + '">') +
        (err ? '<span class="err">' + err + '</span>' : '') + '</div>'; };
      var age = '<div class="field full rx-agef" data-f="k' + i + 'a"><span class="rx-lab" id="' + id + 'aL">' + t('Edad', 'Age') + ' <small class="rx-lab-s">' + t('(años)', '(years)') + '</small></span><div class="rx-age" role="radiogroup" aria-labelledby="' + id + 'aL">' + AGES.map(function(a){
          var v = a + t(' años', ' years old'), on = k.a === v;
          return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!k.a && a === 3) ? 0 : -1) + '" data-age="' + i + '" data-v="' + v + '" aria-label="' + v + '"><b>' + a + '</b></button>';
        }).join('') + '</div><span class="err">' + t('Elegid su edad.', 'Please choose their age.') + '</span></div>';
      return '<div class="rx-kid">' + (many ? '<div class="rx-kid-h"><span class="rx-kid-t">' + t('Hijo o hija ', 'Child ') + (i + 1) + '</span><button type="button" class="rx-mini" data-del="' + i + '">' + t('Quitar', 'Remove') + '</button></div>' : '') +
        '<div class="fgrid">' + f('n', t('Nombre', 'First name'), t('Indicad su nombre.', 'Please give their name.'), { full: !abierta }) + (abierta ? f('ap', t('Apellidos', 'Surname'), t('Indicad sus apellidos.', 'Please give their surname.')) : '') + age +
        f('c', t('Colegio', 'School'), t('Indicad su colegio.', 'Please give their school.'), { full: true, list: 'rxSchools', ph: t('Escribid o elegid el colegio', 'Type or choose the school') }) +
        (abierta ? (openAl[i] || k.al ? f('al', t('Alergias o necesidades especiales', 'Allergies or special needs'), '', { full: true, area: true }) : '<div class="full"><button type="button" class="rx-more" data-al="' + i + '">+ ' + t('Alergias o necesidades especiales', 'Allergies or special needs') + '</button></div>') : '') + '</div></div>';
    }
    function draw(focusSel){
      if (sent) return;
      var h = '<form class="rx-form rx-still" novalidate>';
      if (!abierta) h += '<div class="rx-status">' + CAL + '<div><b>' + t('Próxima edición: finales de junio a finales de julio', 'Next camp: late June to late July') + '</b><span>' + t('Fechas, sede y tarifa por confirmar', 'Dates, venue and fees to be confirmed') + '</span></div></div>';
      h += blk(abierta ? t('Sede y semanas', 'Venue and weeks') : t('Semanas', 'Weeks'), abierta ? t('Elegid las semanas que queráis; no hace falta que sean seguidas.', 'Choose any weeks you like; they do not need to be consecutive.') : t('Marcad las que os interesen, sueltas o seguidas.', 'Tick the ones you are interested in, single or consecutive.'),
        (abierta ? '<div class="rx-sub" data-f="sede"><span class="rx-lab">' + t('Sede', 'Venue') + '</span>' + tilesHTML({ k: 'sede', t: t('Sede', 'Venue'), cols: 2, o: SEDES.map(function(s){ return { v: s, cap: 'Madrid' }; }) }, [st.sede]) + '<span class="rx-err">' + t('Elegid una sede.', 'Please choose a venue.') + '</span></div>' : '') +
        '<div class="rx-sub" data-f="weeks">' + weeksBlock() + '<span class="rx-err">' + (abierta ? t('Elegid al menos una semana.', 'Please choose at least one week.') : t('Elegid alguna semana o «Aún no lo sabemos».', 'Choose a week or “Not sure yet”.')) + '</span></div>');
      h += blk(st.kids.length > 1 ? t('Vuestros hijos', 'Your children') : t('Vuestro hijo o hija', 'Your child'), abierta ? t('Si vienen hermanos, añadidlos aquí: el importe se suma.', 'If siblings are coming, add them here: the total adds up.') : t('Si vienen hermanos, añadidlos aquí.', 'If siblings are coming, add them here.'),
        st.kids.map(kidHTML).join('') + (st.kids.length < 4 ? '<button type="button" class="rx-add" data-add>+ ' + t('Añadir otro hermano o hermana', 'Add a brother or sister') + '</button>' : ''));
      h += blk(t('Vuestros datos', 'Your details'), '', '<div class="fgrid">' + FC.map(function(f){ return fieldHTML(f, C, pre); }).join('') + '</div>');
      h += blk(abierta ? t('Revisad y enviad', 'Check and send') : t('Enviar la solicitud', 'Send the request'), '', '<div class="rx-sum rx-sum--inline"></div><div class="fgrid">' + hpHTML(pre) +
          privHTML(pre, abierta ? t('y acepto que uséis mis datos para gestionar esta inscripción.', 'and agree that you may use my details to manage this registration.') : t('y acepto que uséis mis datos para gestionar esta solicitud.', 'and agree that you may use my details to manage this request.')) + (abierta ? newsHTML(pre, C) : '') + '</div>' +
        '<div class="qz-send rx-send1"><button type="submit" class="btn-primary rx-send">' + SEND + '</button><p class="rx-sendnote">' + (abierta ? t('Enviar la solicitud todavía no confirma la plaza: os escribimos cuando hayamos revisado la disponibilidad.', 'Sending the request does not confirm the place yet: we will write to you once we have checked availability.') : t('Sin compromiso. Todavía no es una plaza confirmada: os escribimos en cuanto publiquemos fechas, sede y tarifa.', 'No commitment. This is not a confirmed place yet: we will write to you as soon as we publish dates, venue and fees.')) + '</p></div>' +
        '<div class="qz-alert rx-alert" role="alert" tabindex="-1" hidden></div>');
      mount.innerHTML = h + '</form>';
      paint(summary());
      if (focusSel) { var el = $(focusSel, mount); if (el) el.focus({ preventScroll: true }); }
    }
    function mark(list, f, isBad){ var el = $('[data-f="' + f + '"]', mount); if (!el) return; el.classList.toggle('is-bad', isBad); var i = $('input, textarea', el); if (i) i.setAttribute('aria-invalid', isBad ? 'true' : 'false'); if (isBad) list.push(el); }
    mount.addEventListener('click', function(e){
      var b = e.target.closest('button'); if (!b || !mount.contains(b) || sent) return;
      keepFields(FC, C, mount, pre);
      if (b.getAttribute('data-k') === 'sede') { st.sede = b.getAttribute('data-v'); save(); draw('[data-k="sede"][data-v="' + st.sede + '"]'); return; }
      if (b.hasAttribute('data-wkv')) { var v = b.getAttribute('data-wkv'), i = st.weeks.indexOf(v); if (i >= 0) st.weeks.splice(i, 1); else st.weeks.push(v); st.weeks.sort(); st.unsure = false; save(); draw('[data-wkv="' + v + '"]'); return; }
      if (b.getAttribute('data-wk') === 'all') { st.weeks = st.weeks.length === W.length ? [] : W.map(function(w){ return w.v; }); st.unsure = false; save(); draw('[data-wk="all"]'); return; }
      if (b.getAttribute('data-wk') === 'unsure') { st.unsure = !st.unsure; if (st.unsure) st.weeks = []; save(); draw('[data-wk="unsure"]'); return; }
      if (b.hasAttribute('data-age')) { var k = +b.getAttribute('data-age'); st.kids[k].a = b.getAttribute('data-v'); save(); draw('[data-age="' + k + '"][data-v="' + st.kids[k].a + '"]'); return; }
      if (b.hasAttribute('data-add')) { var last = st.kids[st.kids.length - 1], nk = NEWKID(); nk.c = last.c; nk.ap = abierta ? last.ap : ''; st.kids.push(nk); save(); draw('#' + pre + 'k' + (st.kids.length - 1) + 'n'); return; }
      if (b.hasAttribute('data-del')) { st.kids.splice(+b.getAttribute('data-del'), 1); save(); draw('[data-add]'); return; }
      if (b.hasAttribute('data-al')) { openAl[b.getAttribute('data-al')] = true; draw('#' + pre + 'k' + b.getAttribute('data-al') + 'al'); return; }
    });
    mount.addEventListener('keydown', function(e){                                            /* flechas en el selector de edad */
      var b = e.target; if (!b.hasAttribute || !b.hasAttribute('data-age')) return;
      var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0; if (!d) return;
      e.preventDefault(); var k = +b.getAttribute('data-age'), j = AGES.indexOf(parseInt(b.getAttribute('data-v'), 10)), n = AGES[(j + d + AGES.length) % AGES.length];
      st.kids[k].a = n + t(' años', ' years old'); save(); draw('[data-age="' + k + '"][data-v="' + st.kids[k].a + '"]');
    });
    mount.addEventListener('input', function(e){
      var x = e.target, f = x.closest('.field, .check-wrap'); if (f) f.classList.remove('is-bad');
      if (x.hasAttribute('data-kid')) { st.kids[+x.getAttribute('data-kid')][x.getAttribute('data-kf')] = x.value; save(); paint(summary()); return; }
      keepFields(FC, C, mount, pre); save();
    });
    mount.addEventListener('change', function(e){
      var x = e.target, f = x.closest('.check-wrap'); if (f) f.classList.remove('is-bad');
      if (x.classList.contains('rx-com')) { keepFields(FC, C, mount, pre); st.comedor = x.checked; save(); draw('.rx-com'); }
    });
    mount.addEventListener('submit', function(e){
      e.preventDefault();
      var list = [];
      if (abierta) mark(list, 'sede', !st.sede);
      mark(list, 'weeks', !st.weeks.length && !(st.unsure && !abierta));
      st.kids.forEach(function(k, i){
        mark(list, 'k' + i + 'n', k.n.trim().length < 2);
        if (abierta) mark(list, 'k' + i + 'ap', k.ap.trim().length < 2);
        mark(list, 'k' + i + 'a', !k.a);
        mark(list, 'k' + i + 'c', k.c.trim().length < 2);
      });
      var bad = list.concat(validateFields(FC, C, mount, pre));
      if (bad.length) { var target = $('input, textarea, [role="radio"], .rx-wk, .tile', bad[0]); if (target) target.focus(); return; }
      var x = tot(), kids = st.kids;
      var fields = {
        form_type: 'campamento', recorrido: abierta ? 'inscripcion-madrid' : 'solicitud-plaza-madrid',
        sede: st.sede || '', semanas: st.unsure ? 'Aún no lo sabemos' : W.filter(function(w){ return st.weeks.indexOf(w.v) >= 0; }).map(function(w){ return w.v + ' (' + w.cap + ')'; }).join(', '),
        comedor: st.comedor ? (abierta ? 'Sí' : 'Les interesaría') : 'No', total: x ? String(x.total) : '',
        alumnoNombre: kids.map(function(k){ return k.n.trim(); }).join(' · '), alumnoApellidos: abierta ? kids.map(function(k){ return k.ap.trim(); }).join(' · ') : '',
        alumnoEdad: kids.map(function(k){ return k.a; }).join(' · '), colegio: kids.map(function(k){ return k.c.trim(); }).join(' · '),
        alergias: kids.map(function(k){ return k.al ? k.n.trim() + ': ' + k.al.trim() : ''; }).filter(Boolean).join(' · '),
        fullName: C.nombre, email: C.email, phone: C.telefono, comentarios: '', rgpd: '1', comunicaciones: C.news ? 'Sí' : 'No', website: $('#' + pre + 'W', mount).value };
      send({ form: 'campamento', fields: fields, subject: (abierta ? 'Inscripción' : 'Solicitud de plaza') + ' · Campamento de Madrid — ' + C.nombre, btn: $('.rx-send', mount), alert: $('.rx-alert', mount), hp: $('#' + pre + 'W', mount), shownAt: shownAt,
        onOk: function(){
          sent = true; drop(SK);
          var names = kids.map(function(k){ return esc(k.n.trim()); }).join(t(' y ', ' and '));
          mount.innerHTML = abierta
            ? okHTML(t('Solicitud de inscripción recibida', 'Registration request received'), t('Revisamos la disponibilidad y os escribimos a ', 'We will check availability and write to you at ') + '<b>' + esc(C.email) + '</b>' + t(' para confirmar la plaza de ', ' to confirm the place for ') + names + t('. Hasta entonces, la plaza no está confirmada.', '. Until then, the place is not confirmed.'), '<div class="rx-sum rx-sum--ok">' + summary() + '</div>')
            : okHTML(t('Solicitud recibida, ', 'Request received, ') + first(C.nombre), t('Todavía no es una plaza confirmada: os escribiremos a ', 'This is not a confirmed place yet: we will write to you at ') + '<b>' + esc(C.email) + '</b>' + t(' en cuanto publiquemos fechas, sede y tarifa, para confirmar la plaza de ', ' as soon as we publish dates, venue and fees, to confirm the place for ') + names + '.',
              afterList([[t('Publicamos la convocatoria', 'We open registration'), t('Fechas, sede, horario y tarifa.', 'Dates, venue, timetable and fees.')], [t('Os escribimos', 'We write to you'), t('Con todo lo necesario para decidir.', 'With everything you need to decide.')], [t('Confirmáis la plaza', 'You confirm the place'), t('Y os explicamos cómo formalizarla.', 'And we explain how to complete it.')]]));
          paint(''); var hh = $('h3', mount); if (hh) hh.focus({ preventScroll: true }); toTop(mount);
        } });
    });
    draw();
  }

  /* =====================================================================
     INGLÉS EXTRAESCOLAR · curso exacto → club; colegio; días preferidos; datos para la plaza.
     Clubs, horario (16:30–17:25 h) y tarifa tal como están publicados (horario y tarifa: solo Colegio Sagrado Corazón).
     Los días de cada grupo NO están publicados: se piden como preferencia y se confirman con la familia. */
  var CLUBS = [
    { club: 'Club Fun TalenTalk', etapa: t('Educación Infantil', 'Early Years'), d: t('A través del juego, favoreciendo la comprensión oral y sus primeras conversaciones.', 'Through play, building listening skills and their first conversations.') },
    { club: 'Club TalenTalk Walkers', etapa: t('1.º y 2.º de Primaria', 'Primary Years 1 and 2'), d: t('Diálogos cortos, cuentos y canciones.', 'Short dialogues, stories and songs.') },
    { club: 'Club TalenTalk Prime', etapa: t('3.º a 6.º de Primaria', 'Primary Years 3 to 6'), d: t('Proyectos para practicar la expresión y la comprensión en inglés.', 'Projects to practise speaking and understanding English.') },
    { club: 'Club TalenTalk Senior Challenge', etapa: 'ESO', d: t('Práctica de inglés en situaciones cotidianas.', 'English practice in everyday situations.'), x: t('Preparación de los exámenes de Cambridge: KET, PET, FCE y CAE.', 'Preparation for the Cambridge exams: KET, PET, FCE and CAE.') }
  ];
  var ORD = EN ? ['1st', '2nd', '3rd', '4th', '5th', '6th'] : ['1.º', '2.º', '3.º', '4.º', '5.º', '6.º'];
  var STAGES = [
    { g: t('Educación Infantil', 'Early Years (Infantil)'), s: t('de Infantil', 'year of Infantil'), a: t('3 a 5 años', 'ages 3 to 5'), o: ORD.slice(0, 3), club: function(){ return 0; } },
    { g: t('Primaria', 'Primary'), s: t('de Primaria', 'year of Primary'), a: t('6 a 11 años', 'ages 6 to 11'), o: ORD.slice(0, 6), club: function(i){ return i < 2 ? 1 : 2; } },
    { g: 'ESO', s: t('de ESO', 'year of ESO'), a: t('12 a 15 años', 'ages 12 to 15'), o: ORD.slice(0, 4), club: function(){ return 3; } }
  ];
  var SC = 'Colegio Sagrado Corazón', OTRO = t('Otro colegio', 'Another school');
  var DIAS = [t('Lunes', 'Monday'), t('Martes', 'Tuesday'), t('Miércoles', 'Wednesday'), t('Jueves', 'Thursday'), t('Viernes', 'Friday')];
  function Extra(mount, pre){
    var SK = 'il-rx-extraescolar-v1', saved = load(SK) || {}, paint = painter(mount), shownAt = Date.now();
    var st = saved.st || { curso: '', club: -1, cole: '', colegio: '', dias: [], alumno: '' }, C = saved.C || {}, sent = false;
    var sc = function(){ return st.cole === SC; };
    function FC(){ return [F_NOMBRE, F_EMAIL, sc() ? F_TEL_REQ : F_TEL_OPT]; }
    function save(){ store(SK, { st: st, C: { nombre: C.nombre, email: C.email, telefono: C.telefono } }); }
    function summary(){
      if (st.club < 0) return '';
      return sumHTML(t('Vuestra solicitud', 'Your request'), [[t('Curso', 'Year'), esc(st.curso)], [t('Club', 'Club'), CLUBS[st.club].club],
        [t('Colegio', 'School'), st.cole === OTRO ? esc(st.colegio) || OTRO : esc(st.cole)],
        [t('Horario', 'Times'), sc() ? '16:30–17:25&nbsp;h' + (st.dias.length ? '<br><small>' + t('Preferencia: ', 'Preferred: ') + esc(st.dias.join(', ')) + '</small>' : '') : (st.cole ? t('Os lo confirmamos', 'We will confirm') : '')],
        [t('Alumno', 'Pupil'), esc(st.alumno)]],
        sc() ? { k: t('Precio', 'Price'), v: EN ? '€65/month' : '65' + EUR + '/mes', n: t('Más 35 € de material al año. De octubre a mayo.', 'Plus €35 a year for materials. October to May.') } : (st.cole ? { k: t('Precio', 'Price'), v: t('Por confirmar', 'To be confirmed'), n: t('Depende del colegio.', 'It depends on the school.') } : null));
    }
    function draw(focusSel){
      if (sent) return;
      var c = st.club >= 0 ? CLUBS[st.club] : null;
      var grid = '<div class="rx-crs">' + STAGES.map(function(s){
        return '<div class="rx-crs-row"><div class="rx-crs-g"><b>' + s.g + '</b><span>' + s.a + '</span></div><div class="rx-crs-o" role="group" aria-label="' + s.g + '">' + s.o.map(function(o, oi){
          var v = o + ' ' + s.s;
          return '<button type="button" class="tile rx-crs-b" data-curso="' + v + '" data-club="' + s.club(oi) + '" aria-pressed="' + (st.curso === v) + '" aria-label="' + v + '"><b>' + o + '</b></button>';
        }).join('') + '</div></div>';
      }).join('') + '</div>';
      var h = '<form class="rx-form rx-still" novalidate>' + blk(t('¿En qué curso está?', 'Which school year are they in?'), t('Elegid su curso de este año.', 'Choose their school year this year.'), grid +
        (c ? '<div class="rx-club" aria-live="polite"><span class="rx-club-k">' + t('Su club · ', 'Their club · ') + c.etapa + '</span><h4>' + c.club + '</h4><p>' + c.d + (c.x ? ' ' + c.x : '') + '</p></div>' : ''));
      if (c) h += blk(t('¿En qué colegio estudia?', 'Which school do they go to?'), '', tilesHTML({ k: 'cole', t: t('Colegio', 'School'), cols: 2, o: [{ v: SC, cap: t('Horario y precio publicados', 'Published times and price') }, { v: OTRO, cap: t('Os decimos si damos clase allí', 'We will tell you if we teach there') }] }, [st.cole]) +
        (st.cole === OTRO ? '<div class="fgrid rx-mt"><div class="field full" data-f="colegio"><label for="' + pre + 'Co">' + t('¿Qué colegio?', 'Which school?') + '</label><input id="' + pre + 'Co" data-st="colegio" type="text" list="rxSchools" autocomplete="off" autocapitalize="words" placeholder="' + t('Nombre del colegio y zona', 'School name and area') + '" value="' + esc(st.colegio) + '"><span class="err">' + t('Indicad el colegio.', 'Please give the school.') + '</span></div></div>' : ''));
      if (c && sc()) h += blk(t('Horario', 'Times'), t('Las clases son de 16:30 a 17:25, de octubre a mayo. ¿Qué días os vendrían mejor? Os confirmamos los del grupo de su curso.', 'Classes are from 16:30 to 17:25, October to May. Which days would suit you best? We will confirm the days for their year group.'),
        '<span class="rx-lab">' + t('Días preferidos', 'Preferred days') + ' <small class="rx-lab-s">' + t('(opcional, podéis elegir varios)', '(optional, you can choose several)') + '</small></span>' + chipsHTML({ k: 'dias', t: t('Días preferidos', 'Preferred days'), o: DIAS }, st.dias) +
        '<dl class="rx-facts"><div><dt>' + t('Precio', 'Price') + '</dt><dd>' + (EN ? '€65/month' : '65' + EUR + '/mes') + ' <small>' + t('+ 35 € de material al año', '+ €35 a year for materials') + '</small></dd></div><div><dt>' + t('Curso', 'Year') + '</dt><dd>' + t('De octubre a mayo', 'October to May') + '</dd></div><div><dt>' + t('Grupos', 'Groups') + '</dt><dd>' + t('Reducidos', 'Small') + ' <small>' + t('desde 8 alumnos', 'from 8 pupils') + '</small></dd></div><div><dt>' + t('Profesores', 'Teachers') + '</dt><dd>' + t('Nativos', 'Native speakers') + '</dd></div></dl>');
      if (c && st.cole) {
        h += blk(sc() ? t('Datos para la plaza', 'Details for the place') : t('Vuestros datos', 'Your details'), sc() ? t('¿El colegio os ha enviado el enlace de inscripción? Usadlo: es la vía directa. Si no, pedid la plaza aquí.', 'Has the school sent you the registration link? Use it: it is the direct way. If not, request the place here.') : '',
          '<div class="fgrid"><div class="field full" data-f="alumno"><label for="' + pre + 'Al">' + t('Nombre y apellidos del alumno o alumna', 'Pupil’s full name') + '</label><input id="' + pre + 'Al" data-st="alumno" type="text" autocomplete="off" autocapitalize="words" value="' + esc(st.alumno) + '"><span class="err">' + t('Indicad su nombre.', 'Please give their name.') + '</span></div>' +
          FC().map(function(f){ return fieldHTML(f, C, pre); }).join('') + '</div>');
        h += blk(t('Enviar', 'Send'), '', '<div class="rx-sum rx-sum--inline"></div><div class="fgrid">' + hpHTML(pre) + privHTML(pre, t('y acepto que uséis mis datos para responder a esta solicitud.', 'and agree that you may use my details to answer this request.')) + '</div>' +
          '<div class="qz-send rx-send1"><button type="submit" class="btn-primary rx-send">' + (sc() ? t('Solicitar plaza', 'Request a place') : t('Consultar mi colegio', 'Ask about my school')) + '</button><p class="rx-sendnote">' + (sc() ? t('Os confirmamos el grupo y cómo formalizar la inscripción. Esta solicitud todavía no reserva la plaza.', 'We will confirm the group and how to complete registration. This request does not reserve the place yet.') : t('Os decimos si damos clase en ese colegio y con qué horario y tarifa.', 'We will tell you whether we teach at that school, and the times and fees.')) + '</p></div>' +
          '<div class="qz-alert rx-alert" role="alert" tabindex="-1" hidden></div>');
      }
      mount.innerHTML = h + '</form>';
      paint(summary());
      if (focusSel) { var el = $(focusSel, mount); if (el) el.focus({ preventScroll: true }); }
    }
    mount.addEventListener('click', function(e){
      var b = e.target.closest('button'); if (!b || !mount.contains(b) || sent) return;
      if ($('.rx-form [name="fullName"]', mount)) keepFields(FC(), C, mount, pre);
      if (b.hasAttribute('data-curso')) { st.curso = b.getAttribute('data-curso'); st.club = +b.getAttribute('data-club'); save(); draw('[data-curso="' + st.curso + '"]'); return; }
      if (b.getAttribute('data-k') === 'cole') { st.cole = b.getAttribute('data-v'); if (!sc()) st.dias = []; save(); draw('[data-k="cole"][data-v="' + st.cole + '"]'); return; }
      if (b.getAttribute('data-k') === 'dias') { var v = b.getAttribute('data-v'), i = st.dias.indexOf(v); if (i >= 0) st.dias.splice(i, 1); else st.dias.push(v); st.dias.sort(function(x, y){ return DIAS.indexOf(x) - DIAS.indexOf(y); }); save(); draw('[data-k="dias"][data-v="' + v + '"]'); return; }
    });
    mount.addEventListener('input', function(e){
      var x = e.target, f = x.closest('.field, .check-wrap'); if (f) f.classList.remove('is-bad');
      if (x.hasAttribute('data-st')) { st[x.getAttribute('data-st')] = x.value; save(); paint(summary()); return; }
      keepFields(FC(), C, mount, pre); save();
    });
    mount.addEventListener('change', function(e){ var f = e.target.closest('.check-wrap'); if (f) f.classList.remove('is-bad'); });
    mount.addEventListener('submit', function(e){
      e.preventDefault();
      var list = [], mk = function(k, isBad){ var el = $('[data-f="' + k + '"]', mount); if (!el) return; el.classList.toggle('is-bad', isBad); if (isBad) list.push(el); };
      if (st.cole === OTRO) mk('colegio', st.colegio.trim().length < 2);
      mk('alumno', st.alumno.trim().length < 2);
      var bad = list.concat(validateFields(FC(), C, mount, pre));
      if (bad.length) { var i = $('input', bad[0]); if (i) i.focus(); return; }
      var c = CLUBS[st.club], isSc = sc();
      send({ form: 'consulta', subject: (isSc ? 'Solicitud de plaza' : 'Consulta de colegio') + ' · Inglés extraescolar — ' + C.nombre, btn: $('.rx-send', mount), alert: $('.rx-alert', mount), hp: $('#' + pre + 'W', mount), shownAt: shownAt,
        fields: { form_type: 'lead', service: 'extraescolar', recorrido: 'selector-extraescolar',
          serviceExtra: (isSc ? 'Solicitud de plaza' : 'Consulta de colegio') + ' · ' + st.curso + ' · ' + c.club + ' · Colegio: ' + (isSc ? SC : st.colegio.trim()) + (isSc ? ' · Horario: 16:30–17:25 h · Días preferidos: ' + (st.dias.join(', ') || '—') : ''),
          studentAge: st.curso, message: 'Alumno/a: ' + st.alumno.trim(),
          fullName: C.nombre, email: C.email, phone: C.telefono || '', contactPreference: C.telefono ? 'Teléfono o correo' : 'Correo', rgpd: '1', comunicaciones: 'No', website: $('#' + pre + 'W', mount).value },
        onOk: function(){
          sent = true; drop(SK);
          var sum = '<div class="rx-sum rx-sum--ok">' + summary() + '</div>';
          mount.innerHTML = isSc
            ? okHTML(t('Solicitud de plaza recibida', 'Place request received'), t('Os escribimos a ', 'We will write to you at ') + '<b>' + esc(C.email) + '</b>' + t(' para confirmar la plaza de ', ' to confirm the place for ') + esc(st.alumno.trim()) + t(' en ', ' in ') + c.club + t(' y cómo formalizar la inscripción. Todavía no es una plaza confirmada.', ' and how to complete registration. This is not a confirmed place yet.'), sum)
            : okHTML(t('Consulta recibida', 'Enquiry received'), t('Os escribimos a ', 'We will write to you at ') + '<b>' + esc(C.email) + '</b>' + t(' para contaros si damos clase en ', ' to let you know whether we teach at ') + esc(st.colegio.trim()) + t(', con qué horario y tarifa.', ', and the times and fees.'), sum);
          paint(''); var hh = $('h3', mount); if (hh) hh.focus({ preventScroll: true }); toTop(mount);
        } });
    });
    draw();
  }

  /* «Ayudadme a elegir» de la portada: abre el recorrido de orientación en lugar de la tarjeta de programas */
  (function(){
    var box = document.getElementById('orientEncaje'); if (!box) return;
    var sec = box.closest('section'), card = sec && $('.lf-card', sec), head = sec && $('.lf-head', sec);
    function show(open){
      box.hidden = !open; if (card) card.hidden = open; if (head) head.hidden = open;
      var target = open ? $('h2', box) : $('[data-orient-open]', sec);
      if (target) { if (open) target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
      var top = (open ? box : sec).getBoundingClientRect().top;
      window.scrollTo({ top: scrollY + top - 90, behavior: reduce ? 'auto' : 'smooth' });
      if (open && window.ilTrack) window.ilTrack('clic_cta', { cta_id: 'form-programa-orientacion' });
    }
    document.addEventListener('click', function(e){
      if (e.target.closest('[data-orient-open]')) { e.preventDefault(); show(true); }
      else if (e.target.closest('[data-orient-close]')) { e.preventDefault(); show(false); }
    });
  })();

  /* ---------- arranque ---------- */
  $$('[data-rx]').forEach(function(m){
    var k = m.getAttribute('data-rx');
    if (k === 'verano') Wizard(VERANO, m, 'vx');
    else if (k === 'orientacion') Wizard(ORIENTA, m, 'or');
    else if (k === 'madrid') Madrid(m, 'md', m.getAttribute('data-estado') === 'abierta');
    else if (k === 'extraescolar') Extra(m, 'ex');
  });
})();
