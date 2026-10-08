window.dataLayer = window.dataLayer || [];
  // Textos que genera el JS. La web es ES/EN: el idioma se lee de <html lang>.
  // Los textos de los formularios (etiquetas, errores, ayudas) viven en el propio HTML; aquí solo quedan los que se calculan al vuelo.
  var LANG = (document.documentElement.lang || 'es').slice(0, 2) === 'en' ? 'en' : 'es';
  var I18N = {
    es: {
      brand: 'Interlanguage Studies',
      sending: 'Enviando…',
      otherAge: 'Otra edad',
      durationUK: 'Un trimestre o dos, solo en algunos colegios y según las plazas disponibles.',
      durationOther: 'La duración se consulta con cada colegio. Puedes indicar tus fechas preferidas en el mensaje.',
      ageUK: 'Internado desde 7 años en un centro preparatorio; otros colegios empiezan más adelante. Si eliges otra edad, indícala en el mensaje.',
      ageIreland: 'De 10 a 18 años. El curso de entrada depende del colegio. Si eliges otra edad, indícala en el mensaje.',
      ageOther: 'La edad de admisión depende del destino y del colegio. Si eliges otra edad, indícala en el mensaje.',
      leadError: 'No hemos podido enviar la solicitud. Tus datos siguen aquí: inténtalo de nuevo en unos segundos o escríbenos a info@interlanguage.es.'
    },
    en: {
      brand: 'Interlanguage Studies',
      sending: 'Sending…',
      otherAge: 'Another age',
      durationUK: 'One or two terms are available only at some schools, subject to places.',
      durationOther: 'The length is checked with each school. You can include your preferred dates in the message.',
      ageUK: 'Boarding from age 7 at one preparatory school; other schools start later. If you select another age, include it in your message.',
      ageIreland: 'Ages 10 to 18. The entry year depends on the school. If you select another age, include it in your message.',
      ageOther: 'Admission age depends on the destination and school. If you select another age, include it in your message.',
      leadError: "We couldn't send your request. Your details are still here: please try again in a few seconds or email us at info@interlanguage.es."
    }
  };
  var T = I18N[LANG];
  // Consentimiento de cookies: sin 'accepted' NO se envía analítica (consent-first).
  var IL_CONSENT = null;
  try { IL_CONSENT = localStorage.getItem('il_cookie_consent'); } catch (e) {}
  function pushEvent(name, params){
    if (IL_CONSENT !== 'accepted') return;
    window.dataLayer.push(Object.assign({event: name}, params || {}));
  }
  window.addEventListener('DOMContentLoaded', function(){ pushEvent('pagina_cargada', { page_path: window.location.pathname }); });

  // Aviso de cookies: se muestra si aún no hay decisión; al aceptar, activa la analítica.
  (function(){
    var banner = document.getElementById('cookieBanner');
    if (!banner) return;
    function persist(v){ try { localStorage.setItem('il_cookie_consent', v); } catch (e) {} IL_CONSENT = v; }
    if (IL_CONSENT !== 'accepted' && IL_CONSENT !== 'rejected'){ banner.hidden = false; }
    var accept = document.getElementById('cookieAccept');
    var reject = document.getElementById('cookieReject');
    if (accept) accept.addEventListener('click', function(){
      persist('accepted'); banner.hidden = true;
      pushEvent('consentimiento_cookies', { estado: 'aceptado' });
      pushEvent('pagina_cargada', { page_path: window.location.pathname });
    });
    if (reject) reject.addEventListener('click', function(){ persist('rejected'); banner.hidden = true; });
  })();

  // Botón flotante de WhatsApp — rellena WHATSAPP_NUMBER para activarlo (país+número, sin + ni espacios).
  var WHATSAPP_NUMBER = '';
  (function(){
    var el = document.getElementById('whatsappFloat');
    if (!el || !WHATSAPP_NUMBER) return;
    var text = encodeURIComponent('Hola, me gustaría recibir información sobre los programas de Interlanguage.');
    el.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text;
    el.hidden = false;
  })();

  // Muestra/oculta el mensaje de error de envío de un formulario.
  function setFormError(el, text){ if (!el) return; el.textContent = text || ''; el.hidden = !text; }
  var FORM_ENDPOINT = 'form-handler.php';

  // barra sticky de conversión: aparece tras el hero, se oculta en el formulario de contacto
  (function(){
    const bar = document.getElementById('stickyCta');
    if (!bar) return;
    const contacto = document.getElementById('contacto');
    function onScroll(){
      // solo en la home
      const home = document.getElementById('view-home');
      if (home && home.hidden){ bar.classList.remove('show'); return; }
      const scrolled = window.scrollY > 700;
      let atContact = false;
      if (contacto){
        const rect = contacto.getBoundingClientRect();
        atContact = rect.top < window.innerHeight && rect.bottom > 0;
      }
      bar.classList.toggle('show', scrolled && !atContact);
    }
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  })();

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  // El menú fijo gana una sombra suave en cuanto se hace scroll (separa la barra del contenido).
  (function(){
    var bar = document.querySelector('header.site');
    if (!bar) return;
    function onScroll(){ bar.classList.toggle('is-scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  })();

  // Menú móvil: el botón anuncia si está abierto (aria-expanded) y Escape lo cierra.
  function setNav(open){
    navLinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeNav(){ setNav(false); }
  navToggle.addEventListener('click', function(){ setNav(!navLinks.classList.contains('open')); });
  navLinks.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeNav); });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && navLinks.classList.contains('open')){ closeNav(); navToggle.focus(); }
  });

  // desplegable "Servicios": hover con margen de tiempo + click + teclado
  (function(){
    const dropdown = document.querySelector('.nav-dropdown');
    if (!dropdown) return;
    const trigger = document.getElementById('servicesTrigger');
    const menu = document.getElementById('servicesMenu');
    let closeTimer = null;

    function isOpen(){ return dropdown.classList.contains('open'); }
    function openMenu(){
      clearTimeout(closeTimer);
      dropdown.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
    }
    function closeMenu(){
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    }
    function scheduleClose(){ closeTimer = setTimeout(closeMenu, 200); }

    dropdown.addEventListener('mouseenter', openMenu);
    dropdown.addEventListener('mouseleave', scheduleClose);
    dropdown.addEventListener('focusin', openMenu);
    dropdown.addEventListener('focusout', function(e){
      if (!dropdown.contains(e.relatedTarget)) scheduleClose();
    });
    trigger.addEventListener('click', function(){
      if (isOpen()) closeMenu(); else openMenu();
    });
    document.addEventListener('click', function(e){
      if (isOpen() && !dropdown.contains(e.target)) closeMenu();
    });
    dropdown.addEventListener('keydown', function(e){
      if (e.key === 'Escape'){ closeMenu(); trigger.focus(); }
    });
  })();

  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){ entry.target.classList.add('in'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function(el){ revealObserver.observe(el); });

  // ---- navegación SPA: home <-> subpáginas de servicio ----
  const allViews = Array.from(document.querySelectorAll('.view'));
  const homeAnchors = ['inicio','servicios','progresion','destinos','por-que','contacto'];   // ids reales de las secciones de view-home

  const HOME_TITLE = document.title;

  // El contacto (#contacto) es una sola sección y vive en la home. En «Estudiar en el extranjero» se coloca al final de esa página, ya
  // orientado a ese programa: pedir orientación no saca a la familia de ella y la vista, el título y la URL siguen coincidiendo.
  // Al salir de la página vuelve a su sitio en la home.
  const contactSection = document.getElementById('contacto');
  const contactSlot = document.getElementById('ext-contacto-slot');
  const contactHome = contactSection ? document.createComment('contacto') : null;
  if (contactHome) contactSection.parentNode.insertBefore(contactHome, contactSection);
  function isExtVisible(){
    const v = document.getElementById('view-service-extranjero');
    return !!v && !v.hidden;
  }
  function placeContact(viewId){
    if (!contactSection || !contactSlot) return;
    const inExt = viewId === 'view-service-extranjero';
    if (inExt && contactSection.parentNode !== contactSlot) contactSlot.appendChild(contactSection);
    if (!inExt && contactSection.parentNode === contactSlot) contactHome.parentNode.insertBefore(contactSection, contactHome.nextSibling);
    contactSection.classList.toggle('contact--ext', inExt);
    if (window.ilLead) window.ilLead.lock(inExt);   // en la carga directa el formulario aún no existe: se sincroniza al final de su bloque
  }
  // «Estudiar en el extranjero» tiene una dirección por destino (#servicio-extranjero-irlanda): abre la página y lleva a la tarjeta de ese destino.
  // Las direcciones antiguas (#servicio-extranjero) siguen funcionando.
  const EXT_SLUGS = ['reino-unido', 'irlanda', 'estados-unidos'];
  function resolveService(key){
    const m = /^extranjero-(.+)$/.exec(key);
    if (m) return EXT_SLUGS.indexOf(m[1]) !== -1 ? { view: 'extranjero', slug: m[1] } : null;
    return document.getElementById('view-service-' + key) ? { view: key, slug: null } : null;
  }
  function reduceMotion(){ return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  // «auto» obedece a html{scroll-behavior:smooth} y anima: en saltos que deben ser inmediatos (restaurar la posición, ir a un destino al cargar)
  // se desactiva un instante, porque en una página larga la animación tarda más que la propia navegación
  function jumpScroll(fn){
    const root = document.documentElement, prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    fn();
    root.style.scrollBehavior = prev;
  }
  // baja hasta la tarjeta de un destino (sección «Destinos»); «scroll» es 'smooth' o 'auto' (inmediato)
  function showExtDestino(slug, scroll){
    const card = document.querySelector('#ext-opciones .ext-option[data-destino="' + slug + '"]');
    if (!card) return;
    requestAnimationFrame(function(){
      if (scroll === 'smooth' && !reduceMotion()) { card.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      jumpScroll(function(){ card.scrollIntoView({ block: 'start' }); });
    });
  }

  // contexto de la consulta: destino y duración elegidos, y vuelta al punto de la página desde el que se pidió
  let extOrigin = null;
  function showExtContext(){
    const bar = document.getElementById('extContext');
    if (!bar || !window.ilLead) return;
    const c = window.ilLead.getContext();
    const parts = [c.destino, c.duracion].filter(Boolean);
    bar.hidden = !parts.length;
    document.getElementById('extContextText').textContent = parts.join(' · ');
    document.getElementById('extContextBack').textContent = c.destino ? bar.getAttribute('data-label-backto') + ' ' + c.destino : bar.getAttribute('data-label-back');
  }
  // lleva a la familia al formulario de esta página (en pantallas estrechas, a la tarjeta, para no pasar antes por el texto de contacto)
  function scrollToExtContact(){
    if (!contactSection) return;
    const card = contactSection.querySelector('.lead-card');
    const target = window.innerWidth >= 900 || !card ? contactSection : card;
    target.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
    const first = document.getElementById('leadAge');
    if (first && first.offsetParent !== null) first.focus({ preventScroll: true });
  }
  function openExtContact(origin){
    if (!contactSection) return;
    extOrigin = origin || null;
    showExtContext();
    // el formulario tiene su propia entrada de historial: «Atrás» devuelve al punto de la página desde el que se pidió, no a la home
    if (!(history.state && history.state.extForm)){
      history.replaceState(Object.assign({}, history.state, { y: window.scrollY }), '');
      history.pushState({ view: 'service-extranjero', extForm: true }, '', location.href);
    }
    scrollToExtContact();
  }
  (function(){
    const back = document.getElementById('extContextBack');
    if (!back) return;
    back.addEventListener('click', function(e){
      e.preventDefault();
      if (history.state && history.state.extForm) history.back();
      else if (extOrigin) jumpScroll(function(){ extOrigin.scrollIntoView({ block: 'center' }); });
    });
  })();

  function showView(viewId, opts){
    opts = opts || {};
    allViews.forEach(function(v){ v.hidden = (v.id !== viewId); });
    placeContact(viewId);
    if (!opts.keepScroll){ window.scrollTo({ top: 0, behavior: 'auto' }); }
    document.querySelectorAll('.svc-card2').forEach(function(c){
      c.classList.toggle('active', viewId === 'view-service-' + c.dataset.service);
    });
    announceView(viewId, opts);
  }

  // Cada vista es una "página" para la persona que navega: cambia el título de la pestaña (y del historial)
  // y, en las subpáginas, el foco pasa al h1 para que el lector de pantalla anuncie el cambio.
  // { silent:true } (carga inicial) no mueve el foco.
  function announceView(viewId, opts){
    const view = document.getElementById(viewId);
    const h1 = view && view.querySelector('h1');
    const name = view && (view.getAttribute('data-title') || (h1 && h1.textContent.replace(/\s+/g, ' ').trim()));
    document.title = (viewId === 'view-home' || !name) ? HOME_TITLE : name + ' · ' + T.brand;
    if (viewId !== 'view-home' && h1 && !opts.silent){
      h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true });
    }
  }

  function isHomeVisible(){
    const home = document.getElementById('view-home');
    return home && !home.hidden;
  }

  function goToServicePage(key){
    const r = resolveService(key);
    if (!r) return;
    showView('view-service-' + r.view);
    if (r.slug) showExtDestino(r.slug, 'smooth');
    pushEvent('clic_cta', { cta_id: 'servicio-subpagina-' + key });
    // pushState (no replaceState): así el botón "atrás" del navegador vuelve a la home.
    history.pushState({ view: 'service-' + r.view }, '', '#servicio-' + key);
  }

  // tarjetas de servicio en la home
  document.querySelectorAll('.svc-card2[data-service]').forEach(function(card){
    card.addEventListener('click', function(e){
      e.preventDefault();
      goToServicePage(card.dataset.service);
    });
  });

  // enlaces del desplegable "Servicios" del menú
  document.querySelectorAll('[data-jump-service]').forEach(function(link){
    link.addEventListener('click', function(e){
      e.preventDefault();
      goToServicePage(link.getAttribute('data-jump-service'));
      closeNav();
    });
  });

  // botón "volver" dentro de cada subpágina
  document.querySelectorAll('[data-back]').forEach(function(link){
    link.addEventListener('click', function(e){
      e.preventDefault();
      showView('view-home');
      history.replaceState(null, '', '#servicios');
      requestAnimationFrame(function(){
        const target = document.getElementById('servicios');
        if (target) target.scrollIntoView({ behavior:'auto', block:'start' });
      });
    });
  });

  // ---- inscripción al campamento (una sola página: 3 bloques numerados + resumen fijo con el total) ----
  // Precios: se leen de la sección "Precio" del HTML (.camp-price-card[data-pack-weeks] y [data-comedor-price]),
  // que es la única fuente. Si falta un importe fiable NO se calcula el total (se muestra "a confirmar").
  // Textos localizados (ES/EN): atributos data-l-* del propio <form id="campForm">.
  (function(){
    const campForm = document.getElementById('campForm');
    if (!campForm) return;
    const $ = function(id){ return document.getElementById(id); };
    const L = campForm.dataset;
    const lang = (document.documentElement.lang || 'es').slice(0, 2);
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollOpts = function(block){ return { behavior: reduceMotion ? 'auto' : 'smooth', block: block }; };
    const sedeInputs = Array.from(campForm.querySelectorAll('input[name="sede"]'));
    const weekChecks = Array.from(campForm.querySelectorAll('.camp-week'));
    const comedor = $('campComedor');
    const msgEl = $('campFormMsg');
    const errEl = $('campFormErrorMsg');
    const submitBtn = $('campSubmitBtn');
    const blocks = Array.from(campForm.querySelectorAll('.cf-block'));
    const progress = Array.from(campForm.querySelectorAll('.cf-progress li'));
    let attempted = false;   // tras el primer intento de envío se valida en vivo

    // ---- precios ----
    function euros(txt){ const d = String(txt).replace(/[^\d]/g, ''); return d ? parseInt(d, 10) : NaN; }   // importes en euros enteros
    const packPrice = {};
    document.querySelectorAll('[data-pack-weeks]').forEach(function(el){
      const strong = el.querySelector('strong');
      const p = strong ? euros(strong.textContent) : NaN;
      if (p > 0) packPrice[parseInt(el.getAttribute('data-pack-weeks'), 10)] = p;
    });
    const comedorEl = document.querySelector('[data-comedor-price]');
    const comedorWeek = comedorEl ? euros(comedorEl.textContent) : NaN;
    function money(n){ return lang === 'en' ? '€' + n : n + '€'; }
    // el importe del comedor que se ve en el formulario y en las FAQ sale del mismo dato
    if (comedorWeek > 0) document.querySelectorAll('[data-fill-comedor]').forEach(function(el){ el.textContent = '+' + money(comedorWeek); });

    function sedeValue(){
      const c = sedeInputs.filter(function(i){ return i.checked; })[0];
      return c ? c.value : '';
    }
    function state(){
      const picked = weekChecks.filter(function(c){ return c.checked; });
      const n = picked.length;
      let base = null, extra = 0, total = null;
      if (n > 0 && packPrice[n]){
        base = packPrice[n];
        if (comedor.checked){
          if (comedorWeek > 0) extra = comedorWeek * n; else base = null;   // sin precio de comedor fiable: no inventamos el total
        }
        if (base !== null) total = base + extra;
      }
      return { picked: picked, n: n, base: base, extra: extra, total: total };
    }
    function weeksWord(n){ return n === 1 ? L.lWeekOne : L.lWeekMany; }
    function setAll(key, text){
      campForm.querySelectorAll('[data-sum="' + key + '"]').forEach(function(el){ el.textContent = text; });
    }
    // resumen de la inscripción (se actualiza solo al elegir sede, semanas o comedor)
    function render(){
      const s = state();
      const comedorTxt = comedor.checked ? L.lWithComedor : L.lWithoutComedor;
      const weeksTxt = s.n ? s.picked.map(function(c){
        const small = c.parentNode.querySelector('small');
        return L.lWeek + ' ' + c.value + (small ? ' · ' + small.textContent : '');
      }).join('\n') : L.lNone;   // una semana por línea (dd con white-space:pre-line)
      let totalTxt, note;
      if (s.n === 0){ totalTxt = L.lPickTotal; note = L.lHint; }
      else if (s.total === null){ totalTxt = L.lTbc; note = L.lTbcNote; }
      else {
        totalTxt = money(s.total);
        note = s.n + ' ' + weeksWord(s.n) + ': ' + money(s.base) +
          (comedor.checked ? ' + ' + L.lComedor + ' ' + s.n + ' × ' + money(comedorWeek) + ' = ' + money(s.extra) : '');
      }
      setAll('sede', sedeValue() || L.lNone);
      setAll('weeks', weeksTxt);
      setAll('comedor', comedorTxt);
      setAll('total', totalTxt);
      setAll('breakdown', note);
      campForm.querySelectorAll('[data-sum="comedor-note"]').forEach(function(el){ el.hidden = !comedor.checked; });
      campForm.querySelectorAll('[data-camp-summary]').forEach(function(el){ el.classList.toggle('is-empty', s.total === null); });
    }

    // ---- validación (mensaje junto al campo; los valores nunca se borran) ----
    const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    function validTel(v){ return /^\+?\d{8,15}$/.test(v.replace(/[\s().-]/g, '')); }
    function filled(id){ return $(id).value.trim() !== ''; }
    function rule(id, ok, extra){ return Object.assign({ id: id, control: $(id), ok: ok }, extra || {}); }
    const rules = [
      rule('campSede', function(){ return !!sedeValue(); }, { control: $('campSedeField'), group: true, focusEl: sedeInputs[0] }),
      rule('campWeeks', function(){ return weekChecks.some(function(c){ return c.checked; }); },
           { control: campForm.querySelector('.camp-weeks'), group: true, focusEl: weekChecks[0] }),
      rule('campAlumnoNombre', function(){ return filled('campAlumnoNombre'); }),
      rule('campAlumnoApellidos', function(){ return filled('campAlumnoApellidos'); }),
      rule('campColegio', function(){ return filled('campColegio'); }),
      rule('campTutor', function(){ return filled('campTutor'); }),
      rule('campEmail', function(){ return RE_EMAIL.test($('campEmail').value.trim()); }),
      rule('campTelefono', function(){ return validTel($('campTelefono').value.trim()); }),
      rule('campRgpd', function(){ return $('campRgpd').checked; })
    ];
    const byId = {};
    rules.forEach(function(r){ byId[r.id] = r; });
    function showing(r){ const e = $('err-' + r.id); return !!e && e.classList.contains('show'); }
    function paint(r, bad){
      const e = $('err-' + r.id);
      if (e && bad && r.msg) e.textContent = r.msg();
      if (e) e.classList.toggle('show', bad);
      r.control.classList.toggle('invalid', bad);
      if (r.group) r.control.classList.toggle('invalid-group', bad);
      else r.control.setAttribute('aria-invalid', bad ? 'true' : 'false');
    }
    function check(r){ const bad = !r.ok(); paint(r, bad); return !bad; }
    // marca cada bloque (y su paso en la barra de progreso) como hecho cuando todos sus campos obligatorios son válidos
    function updateBlocks(){
      blocks.forEach(function(b, i){
        const done = b.getAttribute('data-rules').split(' ').every(function(id){ return byId[id].ok(); });
        b.classList.toggle('is-done', done);
        if (progress[i]) progress[i].classList.toggle('is-done', done);
      });
    }
    function anyChange(){ render(); updateBlocks(); }
    rules.forEach(function(r){
      const targets = r.id === 'campWeeks' ? weekChecks : r.id === 'campSede' ? sedeInputs : [r.control];
      targets.forEach(function(t){
        ['input', 'change'].forEach(function(evt){
          t.addEventListener(evt, function(){ if (attempted || showing(r)) check(r); updateBlocks(); });
        });
      });
    });
    ['campEmail', 'campTelefono'].forEach(function(id){   // formato: avisa al salir del campo (si no está vacío)
      const el = $(id);
      el.addEventListener('blur', function(){ if (el.value.trim()) check(byId[id]); });
    });
    weekChecks.forEach(function(c){ c.addEventListener('change', anyChange); });
    sedeInputs.forEach(function(c){ c.addEventListener('change', anyChange); });
    comedor.addEventListener('change', anyChange);
    // la barra de progreso lleva a cada bloque sin cambiar el hash ni la vista
    campForm.querySelectorAll('.cf-progress a').forEach(function(a){
      a.addEventListener('click', function(e){
        e.preventDefault();
        const t = document.getElementById(a.getAttribute('href').slice(1));
        if (t) t.scrollIntoView(scrollOpts('start'));
      });
    });

    function focusFirstBad(bad){
      const el = bad[0].focusEl || bad[0].control;
      el.scrollIntoView(scrollOpts('center'));
      el.focus({ preventScroll: true });
    }

    // ---- envío ----
    function showSent(){
      const holder = campForm.querySelector('[data-sent-recap]');
      const src = campForm.querySelector('[data-camp-summary]');
      if (holder && src){
        const clone = src.cloneNode(true);   // copia congelada del resumen enviado
        clone.querySelectorAll('[data-sum]').forEach(function(el){ el.removeAttribute('data-sum'); });
        clone.querySelectorAll('[aria-live]').forEach(function(el){ el.removeAttribute('aria-live'); });
        holder.textContent = '';
        holder.appendChild(clone);
      }
      campForm.classList.add('is-sent');
      msgEl.classList.add('show');
      msgEl.scrollIntoView(scrollOpts('center'));
      msgEl.focus({ preventScroll: true });
    }
    campForm.addEventListener('submit', function(e){
      e.preventDefault();
      attempted = true;
      const bad = rules.filter(function(r){ return !check(r); });
      if (bad.length){ setFormError(errEl, L.lReview); focusFirstBad(bad); return; }
      setFormError(errEl, '');
      const s = state();
      const val = function(id){ const el = $(id); return el ? el.value : ''; };
      const payload = new URLSearchParams({
        form_type: 'campamento',
        sede: sedeValue(),
        semanas: s.picked.map(function(c){ return c.value; }).join(', '),
        comedor: comedor.checked ? 'Sí' : 'No',
        total: s.total !== null ? String(s.total) : '',
        alumnoNombre: val('campAlumnoNombre'),
        alumnoApellidos: val('campAlumnoApellidos'),
        alumnoEdad: val('campAlumnoEdad'),
        colegio: val('campColegio'),
        alergias: val('campAlergias'),
        fullName: val('campTutor'),
        email: val('campEmail'),
        phone: val('campTelefono'),
        comentarios: val('campComentarios'),
        rgpd: $('campRgpd').checked ? '1' : '',
        website: val('campHp')
      });

      const prevLabel = submitBtn.textContent;
      submitBtn.disabled = true; submitBtn.textContent = L.lSending;
      fetch(FORM_ENDPOINT, { method: 'POST', body: payload })
        .then(function(r){ if (!r.ok) throw new Error('http'); return r.json(); })
        .then(function(res){
          if (!res || !res.ok) throw new Error('resp');
          pushEvent('lead_generado', {
            servicio: 'campamentos',
            semanas: s.picked.map(function(c){ return c.value; }).join(','),
            comedor: comedor.checked,
            total: s.total
          });
          pushEvent('formulario_enviado', { servicio: 'campamentos-inscripcion' });
          showSent();
        })
        .catch(function(){   // los valores siguen en el formulario: solo se reactiva el botón
          submitBtn.disabled = false; submitBtn.textContent = prevLabel;
          setFormError(errEl, L.lSendError);
          errEl.scrollIntoView(scrollOpts('center'));
        });
    });

    anyChange();
  })();

  // enlace "Reservad plaza en la inscripción" del formulario de consulta: abre el campamento y baja a su inscripción
  document.querySelectorAll('[data-goto-camp-form]').forEach(function(link){
    link.addEventListener('click', function(e){
      e.preventDefault();
      goToServicePage('campamentos');
      requestAnimationFrame(function(){
        const target = document.getElementById('form-campamentos');
        if (target) target.scrollIntoView({ behavior:'auto', block:'start' });
      });
    });
  });

  // buscador por edad de "Nuestros programas": muestra los programas que encajan y enlaza a cada uno
  (function(){
    const root = document.getElementById('svcFinder');
    if (!root) return;
    const btns = Array.from(root.querySelectorAll('.age-btn'));
    const panels = Array.from(root.querySelectorAll('.finder-panel'));
    const hint = document.getElementById('finderHint');
    const talk = document.getElementById('finderTalk');
    btns.forEach(function(b){
      b.addEventListener('click', function(){
        const key = b.getAttribute('data-age');
        const wasOn = b.getAttribute('aria-pressed') === 'true';   // un segundo clic la desmarca
        btns.forEach(function(x){ x.setAttribute('aria-pressed', (x === b && !wasOn) ? 'true' : 'false'); });
        panels.forEach(function(p){ p.hidden = wasOn || p.id !== 'finder-' + key; });
        hint.hidden = !wasOn;
        talk.hidden = wasOn;
        if (!wasOn) pushEvent('clic_cta', { cta_id: 'buscador-edad-' + key });
      });
    });
  })();

  // enlace "Ver los 3 destinos con fotos" dentro de la subpágina de extranjero
  document.querySelectorAll('[data-go-destinos]').forEach(function(link){
    link.addEventListener('click', function(e){
      e.preventDefault();
      showView('view-home');
      history.replaceState(null, '', '#destinos');
      requestAnimationFrame(function(){
        const target = document.getElementById('destinos');
        if (target) target.scrollIntoView({ behavior:'auto', block:'start' });
      });
    });
  });

  // CTA "Solicitar información" dentro de cada subpágina -> vuelve a home y va al formulario, ya orientado al servicio
  document.querySelectorAll('[data-cta-service]').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      const key = btn.getAttribute('data-cta-service');
      showView('view-home');
      if (window.ilLead) window.ilLead.select(key);
      requestAnimationFrame(function(){
        const target = document.getElementById('contacto');
        if (target) target.scrollIntoView({ behavior:'smooth', block:'start' });
      });
      pushEvent('clic_cta', { cta_id: btn.getAttribute('data-cta') || 'solicitar-info-desde-' + key });
    });
  });

  // "Estudiar en el extranjero": tarjetas de destino / tipo de programa y CTAs de asesoramiento.
  // Llevan al formulario de contacto con el servicio (y el destino) ya elegidos; los destinos son los
  // mismos de #leadDest. Cuando exista una página propia de destino/programa, basta con cambiar la
  // tarjeta de data-advise a data-jump-service="extranjero-<destino>" (el router ya lo resuelve).
  (function(){
    const DESTINOS = { 'reino-unido': 'Reino Unido', 'irlanda': 'Irlanda', 'estados-unidos': 'Estados Unidos' };
    document.querySelectorAll('[data-advise]').forEach(function(el){
      el.addEventListener('click', function(e){
        e.preventDefault();
        const inExt = !!el.closest('#view-service-extranjero');
        // en la página de extranjero el contacto está al final de la propia página; desde la home se baja al de la home
        if (!inExt) showView('view-home', isHomeVisible() ? { keepScroll: true } : undefined);
        if (window.ilLead){
          window.ilLead.select(el.getAttribute('data-advise'));
          const destino = DESTINOS[el.getAttribute('data-destino')];
          if (destino) window.ilLead.setDestination(destino);
          window.ilLead.setNote(el.getAttribute('data-advise-note'));
        }
        if (inExt) openExtContact(el);
        else {
          const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          requestAnimationFrame(function(){
            const target = document.getElementById('contacto');
            if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
          });
        }
        pushEvent('clic_cta', { cta_id: el.getAttribute('data-cta') || ('extranjero-' + (el.getAttribute('data-destino') || el.getAttribute('data-programa') || 'asesor')) });
      });
    });
  })();

  // cualquier enlace interno (#ancla) dentro de la home: si estamos en una subpágina, vuelve a home primero
  document.querySelectorAll('a[href^="#"]').forEach(function(link){
    if (link.hasAttribute('data-jump-service') || link.hasAttribute('data-back') || link.hasAttribute('data-cta-service')) return;
    const targetId = link.getAttribute('href').slice(1);
    if (!homeAnchors.includes(targetId)) return;
    link.addEventListener('click', function(e){
      if (!isHomeVisible()){
        e.preventDefault();
        if (targetId === 'contacto' && isExtVisible()){   // en «Estudiar en el extranjero» el contacto está en la propia página
          if (window.ilLead) window.ilLead.select('extranjero');
          openExtContact(); closeNav();
          return;
        }
        showView('view-home');
        closeNav();
        requestAnimationFrame(function(){
          const target = document.getElementById(targetId);
          if (target) target.scrollIntoView({ behavior:'auto', block:'start' });
        });
      }
    });
  });

  // Anclas internas dentro de una subpágina (p.ej. "Ver grupos y horarios" -> #extraescolar-clubs,
  // "Ver cómo es un día" -> #camp-dia): desplázate a la sección SIN cambiar de vista ni tocar el
  // historial (evita que el popstate/hash devuelva a la home).
  document.querySelectorAll('.view.service-page a[href^="#"]').forEach(function(link){
    if (link.hasAttribute('data-jump-service') || link.hasAttribute('data-back') ||
        link.hasAttribute('data-cta-service') || link.hasAttribute('data-go-destinos')) return;
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target || !target.closest('.view.service-page')) return;
    link.addEventListener('click', function(e){
      e.preventDefault();
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  });

  // carga directa con hash tipo #servicio-campamentos o #servicio-extranjero-irlanda
  (function(){
    const hash = window.location.hash.replace('#','');
    if (hash.indexOf('servicio-') === 0){
      const r = resolveService(hash.replace('servicio-',''));
      if (r){
        showView('view-service-' + r.view, { silent: true });
        if (r.slug) showExtDestino(r.slug, 'auto');
      }
    }
  })();

  // Sincroniza la vista con el historial: el botón atrás/adelante restaura la vista correcta. En «Estudiar en el extranjero»
  // devuelve además al punto de la página desde el que se abrió el formulario (y no a la home).
  function syncViewFromHash(e){
    const h = (window.location.hash || '').replace('#','');
    const st = (e && e.state) || {};
    if (h.indexOf('servicio-') === 0){
      const r = resolveService(h.replace('servicio-',''));
      if (r){
        const same = r.view === 'extranjero' && isExtVisible();
        showView('view-service-' + r.view, same ? { keepScroll: true, silent: true } : undefined);
        if (same && typeof st.y === 'number'){
          // si el formulario se acaba de abrir, su desplazamiento suave puede seguir en marcha: «instant» lo cancela y se repite un fotograma después
          const back = function(){ jumpScroll(function(){ window.scrollTo({ top: st.y, left: 0, behavior: 'instant' }); }); };
          back();
          requestAnimationFrame(back);
          if (extOrigin) extOrigin.focus({ preventScroll: true });
        } else if (same && st.extForm) scrollToExtContact();
        return;
      }
    }
    showView('view-home');
  }
  window.addEventListener('popstate', syncViewFromHash);

  document.querySelectorAll('[data-cta]:not([data-cta-service]):not([data-advise])').forEach(function(el){   // los que llevan data-cta-service o data-advise ya lo miden arriba
    el.addEventListener('click', function(){ pushEvent('clic_cta', { cta_id: el.getAttribute('data-cta'), cta_text: el.textContent.trim() }); });
  });

  // ---- formulario de consulta (#leadForm): servicio en tarjetas + solo los campos que hacen falta + 2 pasos ----
  // Textos (etiquetas, errores, ayudas) en el HTML; el valor de las opciones va siempre en español (es lo que llega al equipo).
  (function(){
    const form = document.getElementById('leadForm');
    if (!form) return;
    const $ = function(id){ return document.getElementById(id); };
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollOpts = function(block){ return { behavior: reduceMotion ? 'auto' : 'smooth', block: block }; };
    const radios = Array.from(form.querySelectorAll('input[name="service"]'));
    const ctx = $('leadCtx');
    const age = $('leadAge'), school = $('leadSchool'), dest = $('leadDest'), dur = $('leadDur');
    const course = $('leadCourse'), start = $('leadStart'), studentName = $('leadStudentName'), currentSchool = $('leadCurrentSchool'), english = $('leadEnglish');
    const serviceSet = $('leadServiceSet'), picked = $('leadPicked'), pickedText = $('leadPickedText'), pickedChange = $('leadPickedChange');
    const prefRadios = Array.from(form.querySelectorAll('input[name="contactPreference"]'));
    const phone = $('phone'), phoneReq = $('phoneReq'), phoneOpt = $('phoneOpt');
    const steps = Array.from(form.querySelectorAll('.form-step'));
    const inds = Array.from(form.querySelectorAll('.lead-steps-item'));
    const nextBtn = $('stepNextBtn'), backBtn = $('stepBackBtn'), submitBtn = $('submitBtn');
    const msgEl = $('formMsg'), errEl = $('formErrorMsg'), recapEl = $('leadRecap');
    const DUNNO = 'Aún no lo sé';
    const attempted = {};   // pasos en los que ya se intentó avanzar (a partir de ahí se valida en vivo)
    let current = 1;

    function service(){
      const c = radios.filter(function(r){ return r.checked; })[0];
      return c ? c.value : '';
    }
    function serviceLabel(){
      const c = radios.filter(function(r){ return r.checked; })[0];
      const s = c && c.closest('label') && c.closest('label').querySelector('strong');
      return s ? s.textContent : '';
    }
    // «Estudiar en el extranjero» es la consulta con más campos: al elegirla, las cuatro tarjetas se recogen en una línea («Estudiar en el extranjero · Cambiar»)
    // para que el formulario no se haga largo. «Cambiar» las vuelve a abrir; en la página de extranjero (modo fijo) no se muestran ni se recogen.
    let pickerOpen = false;
    function syncPicker(){
      const collapsed = service() === 'extranjero' && !locked && !pickerOpen;
      serviceSet.hidden = collapsed;
      picked.hidden = !collapsed;
      if (collapsed) pickedText.textContent = serviceLabel();
    }
    // muestra solo los campos del servicio elegido
    function showCtx(){
      const s = service();
      ctx.hidden = !s;
      form.querySelectorAll('[data-ctx]').forEach(function(el){ el.hidden = el.getAttribute('data-ctx') !== s; });
      syncPicker();
      syncAbroadFields();
    }
    // Destination conditions apply to enquiries from this page and from the home.
    // Unknown durations are never presented as available programmes.
    const ageOptions = age.innerHTML;
    const durationOptions = dur.innerHTML;
    function syncAbroadFields(){
      const abroad = service() === 'extranjero';
      const keepAge = age.value, keepDuration = dur.value;
      age.innerHTML = ageOptions;
      if (abroad){
        const min = dest.value === 'Irlanda' ? 10 : +age.getAttribute('data-ext-min');
        const max = +age.getAttribute('data-ext-max');
        Array.from(age.options).forEach(function(o){ if (o.value && (+o.value < min || +o.value > max)) o.remove(); });
        age.add(new Option(T.otherAge, 'Otra edad'));
      }
      age.value = Array.from(age.options).some(function(o){ return o.value === keepAge; }) ? keepAge : (keepAge && abroad ? 'Otra edad' : '');
      dur.innerHTML = durationOptions;
      if (dest.value !== 'Reino Unido'){
        Array.from(dur.options).forEach(function(o){ if (o.value !== DUNNO) o.remove(); });
      }
      dur.value = Array.from(dur.options).some(function(o){ return o.value === keepDuration; }) ? keepDuration : DUNNO;
      const hint = $('hint-leadDur');
      if (hint) hint.textContent = dest.value === 'Reino Unido' ? T.durationUK : T.durationOther;
      const ageHint = $('hint-leadAge');
      if (ageHint) ageHint.textContent = dest.value === 'Reino Unido' ? T.ageUK : dest.value === 'Irlanda' ? T.ageIreland : T.ageOther;
      if (isExtVisible()) showExtContext();
    }
    dest.addEventListener('change', syncAbroadFields);
    dur.addEventListener('change', function(){ if (isExtVisible()) showExtContext(); });
    function optText(sel){ return sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : ''; }
    function detail(){
      const s = service();
      if (s === 'extraescolar') return school.value.trim() ? 'Colegio: ' + school.value.trim() : '';
      if (s === 'extranjero'){
        // los valores de las opciones van siempre en español: es lo que llega al equipo
        const bits = [];
        if (start.value) bits.push('Inicio: ' + start.value);
        bits.push('Destino: ' + dest.value, 'Duración: ' + dur.value);
        if (course.value) bits.push('Curso actual: ' + course.value);
        if (studentName.value.trim()) bits.push('Alumno/a: ' + studentName.value.trim());
        if (currentSchool.value.trim()) bits.push('Colegio actual: ' + currentSchool.value.trim());
        if (english.value) bits.push('Nivel de inglés: ' + english.value);
        return bits.join(' · ');
      }
      return '';
    }
    function recap(){
      const s = service();
      const parts = [serviceLabel()];
      if (age.value) parts.push(optText(age));
      if (s === 'extraescolar' && school.value.trim()) parts.push(school.value.trim());
      if (s === 'extranjero'){
        if (dest.value !== DUNNO) parts.push(optText(dest));
        if (dur.value !== DUNNO) parts.push(optText(dur));
        if (course.value) parts.push(optText(course));
        if (start.value && start.value !== 'Aún no lo sabemos') parts.push(optText(start));
      }
      return parts.filter(Boolean).join(' · ');
    }

    // ---- validación (mensaje junto al campo; los valores nunca se borran) ----
    const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    function validTel(v){ return /^\+?\d{8,15}$/.test(v.replace(/[\s().-]/g, '')); }
    function pref(){
      const c = prefRadios.filter(function(r){ return r.checked; })[0];
      return c ? c.value : '';
    }
    function needPhone(){ return pref() === 'Por teléfono'; }
    // el asterisco y «(opcional)» del teléfono siguen a la preferencia de contacto
    function syncPhoneReq(){
      const need = needPhone();
      phoneReq.hidden = !need;
      phoneOpt.hidden = need;
      phone.required = need;
      phone.setAttribute('aria-required', need ? 'true' : 'false');
    }
    function rule(step, id, ok, extra){ return Object.assign({ step: step, id: id, control: $(id), ok: ok }, extra || {}); }
    const rules = [
      rule(1, 'service', function(){ return !!service(); }, { control: form.querySelector('.choice-grid'), group: true, focusEl: radios[0] }),
      rule(1, 'leadAge', function(){ return age.value !== ''; }, { applies: function(){ return !!service(); } }),
      rule(1, 'leadCourse', function(){ return course.value !== ''; }, { applies: function(){ return service() === 'extranjero'; } }),
      rule(1, 'leadStart', function(){ return start.value !== ''; }, { applies: function(){ return service() === 'extranjero'; } }),
      rule(1, 'leadSchool', function(){ return school.value.trim() !== ''; }, { applies: function(){ return service() === 'extraescolar'; } }),
      rule(2, 'fullName', function(){ return $('fullName').value.trim() !== ''; }),
      rule(2, 'email', function(){ return RE_EMAIL.test($('email').value.trim()); }),
      rule(2, 'phone', function(){ const v = phone.value.trim(); return needPhone() ? validTel(v) : (v === '' || validTel(v)); },
        { msg: function(){ return phone.getAttribute(needPhone() && !phone.value.trim() ? 'data-err-req' : 'data-err-fmt'); } }),
      rule(2, 'rgpd', function(){ return $('rgpd').checked; })
    ];
    const byId = {};
    rules.forEach(function(r){ byId[r.id] = r; });
    function active(r){ return !r.applies || r.applies(); }
    function showing(r){ const e = $('err-' + r.id); return !!e && e.classList.contains('show'); }
    function paint(r, bad){
      const e = $('err-' + r.id);
      if (e) e.classList.toggle('show', bad);
      r.control.classList.toggle('invalid', bad);
      if (r.group) r.control.classList.toggle('invalid-group', bad);
      else r.control.setAttribute('aria-invalid', bad ? 'true' : 'false');
    }
    function check(r){ const bad = active(r) && !r.ok(); paint(r, bad); return !bad; }
    function validateStep(n){
      attempted[n] = true;
      return rules.filter(function(r){ return r.step === n; }).filter(function(r){ return !check(r); });
    }
    rules.forEach(function(r){
      const targets = r.id === 'service' ? radios : [r.control];
      targets.forEach(function(t){
        ['input', 'change'].forEach(function(evt){
          t.addEventListener(evt, function(){ if (attempted[r.step] || showing(r)) check(r); });
        });
      });
    });
    ['email', 'phone'].forEach(function(id){   // formato: avisa al salir del campo (si no está vacío)
      const el = $(id);
      el.addEventListener('blur', function(){ if (el.value.trim()) check(byId[id]); });
    });
    // al cambiar de servicio se ajustan los campos; los errores solo se muestran si ya se intentó avanzar
    radios.forEach(function(r){
      r.addEventListener('change', function(){
        showCtx();
        [byId.leadAge, byId.leadSchool, byId.leadCourse, byId.leadStart].forEach(function(x){ if (attempted[1]) check(x); else paint(x, false); });
      });
      // un clic en una tarjeta (aunque ya estuviera elegida) vuelve a recoger o abrir la lista según el servicio
      r.addEventListener('click', function(){ pickerOpen = false; showCtx(); });
    });
    pickedChange.addEventListener('click', function(){
      pickerOpen = true;
      showCtx();
      const r = radios.filter(function(x){ return x.checked; })[0];
      if (r){ serviceSet.scrollIntoView(scrollOpts('nearest')); r.focus({ preventScroll: true }); }
    });
    prefRadios.forEach(function(r){
      r.addEventListener('change', function(){
        syncPhoneReq();
        if (attempted[2] || showing(byId.phone)) check(byId.phone);
      });
    });

    // ---- pasos ----
    function goTo(n, opts){
      current = n;
      steps.forEach(function(s){ s.classList.toggle('active', +s.dataset.step === n); });
      inds.forEach(function(li, i){
        li.classList.toggle('is-current', i + 1 === n); li.classList.toggle('is-done', i + 1 < n);
        if (i + 1 === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
      if (n === 2) recapEl.textContent = recap();
      if (opts && opts.silent) return;
      form.closest('.form-card').scrollIntoView(scrollOpts('start'));
      const cardsHidden = serviceSet.hidden || form.classList.contains('is-locked');
      const first = n === 2 ? $('fullName') : (cardsHidden ? age : (radios.filter(function(r){ return r.checked; })[0] || radios[0]));
      if (first) first.focus({ preventScroll: true });
    }
    function focusFirstBad(bad){
      const el = bad[0].focusEl || bad[0].control;
      el.scrollIntoView(scrollOpts('center'));
      el.focus({ preventScroll: true });
    }
    nextBtn.addEventListener('click', function(){
      const bad = validateStep(1);
      if (bad.length){ setFormError(errEl, ''); focusFirstBad(bad); return; }
      goTo(2);
      pushEvent('clic_cta', { cta_id: 'form-paso-2' });
    });
    backBtn.addEventListener('click', function(){ goTo(1); });

    // ---- envío ----
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (current === 1){ nextBtn.click(); return; }   // Intro en el paso 1 avanza; no envía
      const bad1 = validateStep(1);
      if (bad1.length){ goTo(1, { silent: true }); focusFirstBad(bad1); return; }
      const bad2 = validateStep(2);
      if (bad2.length){ focusFirstBad(bad2); return; }
      const s = service();
      const payload = new URLSearchParams({
        form_type: 'lead',
        service: s,
        serviceExtra: detail(),
        studentAge: age.value === 'Otra edad' ? 'Otra edad (ver mensaje)' : age.value ? age.value + ' años' : '',
        message: $('message').value,
        fullName: $('fullName').value,
        email: $('email').value,
        phone: $('phone').value,
        contactPreference: pref(),
        rgpd: $('rgpd').checked ? '1' : '',
        website: ($('leadHp') || {}).value || ''
      });

      const prevLabel = submitBtn.textContent;
      setFormError(errEl, '');
      submitBtn.disabled = true; submitBtn.textContent = T.sending;

      fetch(FORM_ENDPOINT, { method: 'POST', body: payload })
        .then(function(r){ if (!r.ok) throw new Error('http'); return r.json(); })
        .then(function(res){
          if (!res || !res.ok) throw new Error('resp');
          pushEvent('lead_generado', { servicio: s, edad_alumno: age.value });
          pushEvent('formulario_enviado', { servicio: s });
          form.classList.add('is-sent');
          msgEl.classList.add('show');
          msgEl.scrollIntoView(scrollOpts('center'));
          msgEl.focus({ preventScroll: true });
        })
        .catch(function(){
          submitBtn.disabled = false; submitBtn.textContent = prevLabel;
          setFormError(errEl, T.leadError);
        });
    });

    // API para el resto de la página (CTA de las subpáginas, tarjetas de destino…): dejan el formulario ya orientado
    window.ilLead = {
      select: function(value){
        const r = radios.filter(function(x){ return x.value === value; })[0];
        if (!r) return;
        r.checked = true;
        pickerOpen = false;
        showCtx();
        goTo(1, { silent: true });
      },
      setDestination: function(name){
        if (dest && name){ dest.value = name; syncAbroadFields(); }
      },
      // A confirmed duration preselects the field; other notes go in the message.
      setNote: function(text){
        if (!text) return;
        const d = /^Duración:\s*(.+)$/.exec(text);
        if (d && dur){
          const opt = Array.from(dur.options).filter(function(o){ return o.value === d[1]; })[0];
          if (opt){ dur.value = opt.value; return; }
        }
        const m = $('message');
        if (m && !m.value.trim()) m.value = text;
      },
      // destino y duración que hay elegidos (texto visible en el idioma de la página), para el aviso «Consulta sobre…»
      getContext: function(){
        return {
          destino: dest && dest.value !== DUNNO ? optText(dest) : '',
          duracion: dur && dur.value !== DUNNO ? optText(dur) : ''
        };
      },
      // Modo «Estudiar en el extranjero» (el contacto colocado al final de esa página): el servicio queda fijo y las edades son las del programa
      // (data-ext-min / data-ext-max del selector). Al salir se restaura lo que había elegido antes.
      lock: function(on){
        on = !!on;
        if (on === locked) return;
        locked = on;
        pickerOpen = false;
        form.classList.toggle('is-locked', on);
        const keep = age.value;
        if (on){
          prevService = service();
          const ext = radios.filter(function(x){ return x.value === 'extranjero'; })[0];
          if (ext) ext.checked = true;
        } else {
          age.innerHTML = ageOptions;
          const back = radios.filter(function(x){ return x.value === prevService; })[0];
          if (back) back.checked = true; else radios.forEach(function(x){ x.checked = false; });
        }
        if (Array.from(age.options).some(function(o){ return o.value === keep; })) age.value = keep;
        showCtx();
        goTo(1, { silent: true });
      }
    };
    let locked = false, prevService = '';

    syncPhoneReq();
    showCtx();
    goTo(1, { silent: true });
    window.ilLead.lock(isExtVisible());   // carga directa de #servicio-extranjero: el formulario se crea después del router
  })();

  // ---- fotos de actividades: una tira manual, sin bucle ni reproducción automática ----
  (function(){
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('[data-carr]').forEach(function(root){
      var track = root.querySelector('.ext-carr-track');
      var prev = root.querySelector('[data-dir="-1"]'), next = root.querySelector('[data-dir="1"]');
      if (!track) return;
      root.classList.add('is-js');
      function update(){
        var max = Math.max(0, track.scrollWidth - track.clientWidth);
        var hasPrev = track.scrollLeft > 1, hasNext = track.scrollLeft < max - 1;
        root.setAttribute('data-prev', hasPrev ? 'true' : 'false');
        root.setAttribute('data-next', hasNext ? 'true' : 'false');
        if (prev) prev.disabled = !hasPrev;
        if (next) next.disabled = !hasNext;
      }
      function go(dir){
        track.scrollBy({ left: dir * track.clientWidth * 0.85, behavior: reduce ? 'auto' : 'smooth' });
      }
      if (prev) prev.addEventListener('click', function(){ go(-1); });
      if (next) next.addEventListener('click', function(){ go(1); });
      track.addEventListener('scroll', update, { passive: true });
      track.querySelectorAll('img').forEach(function(img){ img.addEventListener('load', update); });
      if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
      else window.addEventListener('resize', update);
      update();
    });
  })();
