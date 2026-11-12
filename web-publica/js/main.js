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
      durationIreland: 'Curso completo o trimestres. Las fechas y las plazas se confirman con cada colegio.',
      termsIreland: 'Estancia por trimestres',
      durationOther: 'La duración se consulta con cada colegio. Puedes indicar tus fechas preferidas en el mensaje.',
      ageUK: 'De 9 a 18 años. El curso de entrada depende del colegio. Si eliges otra edad, indícala en el mensaje.',
      ageIreland: 'De 9 a 18 años. El curso de entrada depende del colegio. Si eliges otra edad, indícala en el mensaje.',
      ageOther: 'De 9 a 18 años. El curso de entrada depende del destino y del colegio. Si eliges otra edad, indícala en el mensaje.',
      leadError: 'No hemos podido enviar la solicitud. Tus datos siguen aquí: inténtalo de nuevo en unos segundos o escríbenos a info@interlanguage.es.',
      callTz: '(hora de Madrid)',
      callPick: 'Elige un día y una hora para la llamada.',
      callConfirming: 'Confirmando…',
      callTaken: 'Esa hora acaba de ocuparse. Elige otra: tus datos siguen aquí.',
      callDayFull: 'Ese día ya no admite más llamadas. Elige otro día: tus datos siguen aquí.',
      callTooMany: 'Ya tienes llamadas reservadas con este teléfono. Si necesitas otra hora, cancela una desde el enlace de tu correo.',
      callRate: 'Has hecho varios intentos seguidos. Espera unos minutos y vuelve a intentarlo.',
      callFailed: 'No hemos podido confirmar la llamada. Tu hora y tus datos siguen aquí: vuelve a intentarlo (no se duplicará la reserva).',
      callMailSent: 'Te hemos enviado un correo con estos datos y el enlace para cancelar.',
      callMailNo: 'Guarda estos datos: si necesitas cancelar, usa el enlace de abajo.',
      campAge: 'Con {n} años, el único colegio que le admite es Strathallan School (desde los 8).',
      campLeadAge: 'El programa de liderazgo es de 14 a 17 años. Con {n} años le corresponde Inglés general.',
      campLeadSchool: 'El programa de liderazgo se imparte en Dollar Academy; en otros colegios, consultadlo.',
      cmpMore: 'Ver matices',
      cmpLess: 'Ocultar'
    },
    en: {
      brand: 'Interlanguage Studies',
      sending: 'Sending…',
      otherAge: 'Another age',
      durationUK: 'One or two terms are available only at some schools, subject to places.',
      durationIreland: 'A full school year or terms. Dates and places are confirmed with each school.',
      termsIreland: 'Term-based stay',
      durationOther: 'The length is checked with each school. You can include your preferred dates in the message.',
      ageUK: 'Ages 9 to 18. The entry year depends on the school. If you select another age, include it in your message.',
      ageIreland: 'Ages 9 to 18. The entry year depends on the school. If you select another age, include it in your message.',
      ageOther: 'Ages 9 to 18. The entry year depends on the destination and school. If you select another age, include it in your message.',
      leadError: "We couldn't send your request. Your details are still here: please try again in a few seconds or email us at info@interlanguage.es.",
      callTz: '(Madrid time)',
      callPick: 'Choose a day and a time for the call.',
      callConfirming: 'Confirming…',
      callTaken: 'That time has just been taken. Please choose another: your details are still here.',
      callDayFull: 'That day is now full. Please choose another day: your details are still here.',
      callTooMany: 'You already have calls booked with this phone number. If you need another time, cancel one from the link in your email.',
      callRate: 'You have made several attempts in a row. Please wait a few minutes and try again.',
      callFailed: "We couldn't confirm the call. Your time and details are still here: please try again (it won't be booked twice).",
      callMailSent: 'We have emailed you these details and the link to cancel.',
      callMailNo: 'Keep these details: if you need to cancel, use the link below.',
      campAge: 'At {n}, the only school that accepts them is Strathallan School (from age 8).',
      campLeadAge: 'The leadership programme is for ages 14 to 17. At {n}, General English is the right choice.',
      campLeadSchool: 'The leadership programme runs at Dollar Academy; for other schools, please ask us.',
      cmpMore: 'Details',
      cmpLess: 'Hide'
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
  // Mientras la web no cargue ninguna herramienta de analítica, no hay nada que aceptar: el aviso no aparece.
  // Al instalar una (y abrirla en la CSP de _headers), pon ANALYTICS_ENABLED a true y revisa el texto del aviso y de legal.html.
  var ANALYTICS_ENABLED = false;
  (function(){
    var banner = document.getElementById('cookieBanner');
    if (!banner || !ANALYTICS_ENABLED) return;
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

  // Una sola invitación a contactar: se recoge si ya hay otra visible o se abre el menú.
  (function(){
    const bar = document.getElementById('stickyCta');
    if (!bar) return;
    const contacto = document.getElementById('contacto');
    function onScroll(){
      // solo en la home
      const home = document.getElementById('view-home');
      if (!home || home.hidden){ bar.classList.remove('show'); bar.inert = true; bar.setAttribute('aria-hidden', 'true'); return; }
      const hero = home && home.querySelector('.hero');
      const scrolled = hero && hero.getBoundingClientRect().bottom <= 0;
      let atContact = false;
      if (contacto){
        const rect = contacto.getBoundingClientRect();
        atContact = rect.top < window.innerHeight && rect.bottom > 0;
      }
      const menuOpen = document.getElementById('navLinks').classList.contains('open');
      const visibleAction = Array.from(home.querySelectorAll('.btn-primary[href="#contacto"], .btn-primary[data-advise], .btn-primary[data-cta-service]')).some(function(a){
        const r = a.getBoundingClientRect();
        return r.width > 0 && r.top >= 0 && r.bottom <= window.innerHeight;
      });
      const footer = document.querySelector('footer');
      const atFooter = footer && footer.getBoundingClientRect().top < window.innerHeight;
      const show = window.matchMedia('(max-width:1024px)').matches && !!scrolled && !atContact && !atFooter && !menuOpen && !visibleAction;
      bar.classList.toggle('show', show);
      bar.inert = !show;
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
    }
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', onScroll, { passive:true });
    document.addEventListener('il:navigation', onScroll);
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
    document.dispatchEvent(new Event('il:navigation'));
  }
  function closeNav(){ setNav(false); }
  navToggle.addEventListener('click', function(){ setNav(!navLinks.classList.contains('open')); });
  navLinks.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeNav); });
  document.addEventListener('click', function(e){
    if (navLinks.classList.contains('open') && !e.target.closest('header.site')) closeNav();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && navLinks.classList.contains('open')){ closeNav(); navToggle.focus(); }
  });

  // Un gesto, un estado: clic, toque y teclado abren el mismo desplegable.
  // El hover/focus previo no debe consumir el primer clic ni reabrirlo después de Escape.
  // En el menú compacto (≤1024 px) el botón no se muestra y los programas se ven directamente (lo hace la hoja de estilos);
  // cerrado, el panel queda con visibility:hidden, así que no se anuncia ni recibe el foco: no hace falta aria-hidden.
  (function(){
    const dropdown = document.querySelector('.nav-dropdown');
    if (!dropdown) return;
    const trigger = document.getElementById('servicesTrigger');
    const menu = document.getElementById('servicesMenu');
    function isOpen(){ return dropdown.classList.contains('open'); }
    function openMenu(){
      dropdown.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
    function closeMenu(){
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
    dropdown.addEventListener('focusout', function(e){
      if (!dropdown.contains(e.relatedTarget)) closeMenu();
    });
    trigger.addEventListener('click', function(){
      if (isOpen()) closeMenu(); else openMenu();
    });
    document.addEventListener('click', function(e){
      if (isOpen() && !dropdown.contains(e.target)) closeMenu();
    });
    dropdown.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && isOpen()){
        e.preventDefault(); e.stopPropagation(); closeMenu(); trigger.focus();
      }
      if (e.target === trigger && (e.key === 'ArrowDown' || e.key === 'ArrowUp')){
        e.preventDefault(); openMenu();
        const links = menu.querySelectorAll('a');
        const link = e.key === 'ArrowUp' ? links[links.length - 1] : links[0];
        if (link) link.focus();
      }
    });
    menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });
    new MutationObserver(function(){ if (!navLinks.classList.contains('open') && window.matchMedia('(max-width:1024px)').matches) closeMenu(); }).observe(navLinks, { attributes:true, attributeFilter:['class'] });
  })();

  // Cambiar de idioma conserva la página o el destino, sin trasladar datos personales.
  (function(){
    const links = document.querySelectorAll('.lang-switch a, .nav-lang a');   // el de la cabecera y el del menú del móvil
    if (!links.length) return;
    const base = links[0].getAttribute('href').split('#')[0];
    function sync(){ links.forEach(function(link){ link.setAttribute('href', base + window.location.hash); }); }
    links.forEach(function(link){ link.addEventListener('click', sync); });
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    document.addEventListener('il:url', sync);   // el router cambia la dirección con pushState, que no avisa: así el enlace (y «copiar enlace» o abrir en otra pestaña) ya apunta al programa que se ve
    sync();
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
  // Lo mismo en «Campamentos de verano en el extranjero»: cada página con hueco propio fija su programa en el formulario.
  const contactSection = document.getElementById('contacto');
  const CONTACT_SLOTS = {
    'view-service-extranjero': { slot: 'ext-contacto-slot', service: 'extranjero', cls: 'contact--ext' },
    'view-service-verano-extranjero': { slot: 'vext-contacto-slot', service: 'verano-extranjero', cls: 'contact--vext' }
  };
  const contactHome = contactSection ? document.createComment('contacto') : null;
  if (contactHome) contactSection.parentNode.insertBefore(contactHome, contactSection);
  // vista visible que lleva el contacto dentro (o null si es la home u otra página)
  function slotView(){
    for (const id in CONTACT_SLOTS){ const v = document.getElementById(id); if (v && !v.hidden && document.getElementById(CONTACT_SLOTS[id].slot)) return id; }
    return null;
  }
  function slotService(){ const v = slotView(); return v ? CONTACT_SLOTS[v].service : ''; }
  function isExtVisible(){ return !!slotView(); }   // «el formulario está en la propia página»
  function placeContact(viewId){
    if (!contactSection) return;
    const conf = CONTACT_SLOTS[viewId], slot = conf && document.getElementById(conf.slot);
    if (slot && contactSection.parentNode !== slot) slot.appendChild(contactSection);
    if (!slot && contactSection.parentNode !== contactHome.parentNode) contactHome.parentNode.insertBefore(contactSection, contactHome.nextSibling);
    Object.keys(CONTACT_SLOTS).forEach(function(id){ contactSection.classList.toggle(CONTACT_SLOTS[id].cls, !!slot && id === viewId); });
    if (window.ilLead) window.ilLead.lock(slot ? conf.service : '');   // en la carga directa el formulario aún no existe: se sincroniza al final de su bloque
  }
  // «Estudiar en el extranjero» tiene una dirección por destino (#servicio-extranjero-irlanda): abre la página y lleva a la tarjeta de ese destino.
  // Las direcciones antiguas (#servicio-extranjero) siguen funcionando.
  const EXT_SLUGS = ['reino-unido', 'irlanda', 'estados-unidos', 'canada'];
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
    if (window.ilDestinations) window.ilDestinations.select(slug);
    const card = document.querySelector('#ext-opciones .country-panel[data-destino="' + slug + '"], #ext-opciones .ext-option[data-destino="' + slug + '"]');
    if (!card) return;
    const target = card.closest('.country-guide') || card;
    requestAnimationFrame(function(){
      if (scroll === 'smooth' && !reduceMotion()) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      jumpScroll(function(){ target.scrollIntoView({ block: 'start' }); });
    });
  }

  // fila deslizable de destinos: las flechas avanzan una tarjeta y se desactivan en los extremos
  document.querySelectorAll('[data-ext-carousel]').forEach(function(box){
    const track = box.querySelector('.ext-options'), btns = box.querySelectorAll('.ext-carousel-btn');
    if (!track || !btns.length) return;
    function update(){
      const max = track.scrollWidth - track.clientWidth;
      btns.forEach(function(b){ b.disabled = b.getAttribute('data-dir') === '-1' ? track.scrollLeft <= 2 : track.scrollLeft >= max - 2; });
      box.classList.toggle('is-static', max <= 2);
      const card = track.firstElementChild, count = box.querySelector('.ext-carousel-count');
      if (card && count && card.offsetWidth) {
        const step = card.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0), total = track.children.length;
        const first = Math.min(total, Math.round(track.scrollLeft / step) + 1), last = Math.min(total, first + Math.max(1, Math.floor((track.clientWidth - 8) / step + 0.1 + (step - card.getBoundingClientRect().width) / step)) - 1);
        count.textContent = (first === last ? first : first + '–' + last) + ' ' + count.getAttribute('data-of') + ' ' + total;
      }
    }
    btns.forEach(function(b){
      b.addEventListener('click', function(){
        const card = track.firstElementChild, gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        track.scrollBy({ left: Number(b.getAttribute('data-dir')) * (card.getBoundingClientRect().width + gap), behavior: reduceMotion() ? 'auto' : 'smooth' });
      });
    });
    track.addEventListener('scroll', function(){ requestAnimationFrame(update); }, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(update).observe(track); else window.addEventListener('resize', update);   // también salta al mostrarse la vista, que arranca oculta
    update();
  });

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
      history.pushState({ view: (slotView() || 'view-service-extranjero').replace('view-', ''), extForm: true }, '', location.href);
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
    if (!opts.keepScroll){ jumpScroll(function(){ window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }); }   // al cambiar de página se llega arriba de golpe (con «auto» el desplazamiento suave de la hoja de estilos desde el pie de la home duraba más de un segundo)
    document.querySelectorAll('.svc-card2').forEach(function(c){
      c.classList.toggle('active', viewId === 'view-service-' + c.dataset.service);
    });
    announceView(viewId, opts);
    document.dispatchEvent(new Event('il:navigation'));
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

  // La pantalla, la dirección y el título van siempre juntos: toda navegación que cambia de vista deja su entrada en el historial
  // (pushState, para que «Atrás» vuelva a donde estaba la familia) y avisa con «il:url», porque pushState no dispara ningún evento.
  function setUrl(hash, state, replace){
    const url = location.pathname + location.search + (hash ? '#' + hash : '');
    if (location.pathname + location.search + location.hash === url) return;
    history[replace ? 'replaceState' : 'pushState'](state || null, '', url);
    document.dispatchEvent(new Event('il:url'));
  }

  function goToServicePage(key){
    const r = resolveService(key);
    if (!r) return;
    const same = location.hash === '#servicio-' + key && !isHomeVisible();
    showView('view-service-' + r.view);
    if (r.slug) showExtDestino(r.slug, 'smooth');
    pushEvent('clic_cta', { cta_id: 'servicio-subpagina-' + key });
    if (!same) setUrl('servicio-' + key, { view: 'service-' + r.view });
  }

  // Desde una subpágina a la portada o a una de sus secciones: cambia la pantalla, la dirección y el título, y baja a la sección.
  // 'inicio' es la portada sin ancla (dirección limpia). Si ya se está en la portada solo se desplaza.
  function goHome(anchor, opts){
    opts = opts || {};
    if (!isHomeVisible()) showView('view-home');
    setUrl(anchor === 'inicio' ? '' : anchor, { view: 'home' });
    requestAnimationFrame(function(){
      if (anchor === 'inicio'){ window.scrollTo({ top: 0, left: 0, behavior: opts.smooth && !reduceMotion() ? 'smooth' : 'auto' }); return; }
      const target = document.getElementById(anchor);
      if (target) target.scrollIntoView({ behavior: opts.smooth && !reduceMotion() ? 'smooth' : 'auto', block: 'start' });
    });
  }

  // un clic con Ctrl/Cmd/Mayús (abrir en otra pestaña o ventana) lo resuelve el navegador
  function plainClick(e){ return !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0); }

  // tarjetas de servicio en la home
  document.querySelectorAll('.svc-card2[data-service]').forEach(function(card){
    card.addEventListener('click', function(e){
      if (!plainClick(e)) return;
      e.preventDefault();
      goToServicePage(card.dataset.service);
    });
  });

  // enlaces del desplegable "Servicios" del menú
  document.querySelectorAll('[data-jump-service]').forEach(function(link){
    link.addEventListener('click', function(e){
      if (!plainClick(e)) return;
      e.preventDefault();
      goToServicePage(link.getAttribute('data-jump-service'));
      closeNav();
    });
  });

  // el logotipo vuelve a la portada, arriba y con la dirección limpia (antes cambiaba la pantalla pero dejaba #servicio-… en la barra)
  const logoLink = document.querySelector('header.site .nav > a[href="#inicio"]');
  if (logoLink) logoLink.addEventListener('click', function(e){
    if (!plainClick(e)) return;
    e.preventDefault();
    goHome('inicio', { smooth: isHomeVisible() });
    closeNav();
  });

  // botón "volver" dentro de cada subpágina
  document.querySelectorAll('[data-back]').forEach(function(link){
    link.addEventListener('click', function(e){
      e.preventDefault();
      goHome('servicios');
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
    function money(n){ return lang === 'en' ? '€' + n : n + '\u00a0€'; }   // «160 €» con espacio de no separación (en inglés, «€160»)
    // el importe del comedor que se ve en el formulario y en las FAQ sale del mismo dato
    if (comedorWeek > 0) document.querySelectorAll('[data-fill-comedor]').forEach(function(el){ el.textContent = money(comedorWeek); });

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
    function anyChange(){ render(); }
    rules.forEach(function(r){
      const targets = r.id === 'campWeeks' ? weekChecks : r.id === 'campSede' ? sedeInputs : [r.control];
      targets.forEach(function(t){
        ['input', 'change'].forEach(function(evt){
          t.addEventListener(evt, function(){ if (attempted || showing(r)) check(r); });
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
        comunicaciones: $('campNews') && $('campNews').checked ? 'Sí' : 'No',   // casilla aparte y opcional: gestionar la inscripción no implica recibir novedades
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

  // enlace "Ver los 3 destinos con fotos" dentro de la subpágina de extranjero
  document.querySelectorAll('[data-go-destinos]').forEach(function(link){
    link.addEventListener('click', function(e){
      e.preventDefault();
      goHome('destinos');
    });
  });

  // CTA "Solicitar información" dentro de cada subpágina -> vuelve a home y va al formulario, ya orientado al servicio
  document.querySelectorAll('[data-cta-service]').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      const key = btn.getAttribute('data-cta-service');
      if (key === 'campamentos' || key === 'extraescolar') goToServicePage(key);
      else {
        goHome('contacto', { smooth: true });
        if (window.ilLead) window.ilLead.select(key);
      }
      pushEvent('clic_cta', { cta_id: btn.getAttribute('data-cta') || 'solicitar-info-desde-' + key });
    });
  });

  // "Estudiar en el extranjero": tarjetas de destino / tipo de programa y CTAs de asesoramiento.
  // Llevan al formulario de contacto con el servicio (y el destino) ya elegidos; los destinos son los
  // mismos de #leadDest. Cuando exista una página propia de destino/programa, basta con cambiar la
  // tarjeta de data-advise a data-jump-service="extranjero-<destino>" (el router ya lo resuelve).
  (function(){
    const DESTINOS = { 'reino-unido': 'Reino Unido', 'irlanda': 'Irlanda', 'estados-unidos': 'Estados Unidos', 'canada': 'Canadá' };
    document.querySelectorAll('[data-advise]').forEach(function(el){
      el.addEventListener('click', function(e){
        e.preventDefault();
        const inExt = Object.keys(CONTACT_SLOTS).some(function(id){ return !!el.closest('#' + id); });
        // en «Estudiar en el extranjero» y «Campamentos de verano en el extranjero» el contacto está al final de la propia página; desde la home se baja al de la home
        if (!inExt) goHome('contacto', { smooth: true });
        if (window.ilLead){
          window.ilLead.select(el.getAttribute('data-advise'));
          const destino = DESTINOS[el.getAttribute('data-destino')];
          if (destino) window.ilLead.setDestination(destino);
          window.ilLead.setNote(el.getAttribute('data-advise-note'));
        }
        if (inExt) openExtContact(el);
        pushEvent('clic_cta', { cta_id: el.getAttribute('data-cta') || ('extranjero-' + (el.getAttribute('data-destino') || el.getAttribute('data-programa') || 'asesor')) });
      });
    });
  })();

  // cualquier enlace interno (#ancla) dentro de la home: si estamos en una subpágina, vuelve a home primero
  document.querySelectorAll('a[href^="#"]').forEach(function(link){
    if (link.hasAttribute('data-jump-service') || link.hasAttribute('data-back') || link.hasAttribute('data-cta-service') || link === logoLink) return;
    const targetId = link.getAttribute('href').slice(1);
    if (!homeAnchors.includes(targetId)) return;
    link.addEventListener('click', function(e){
      if (!isHomeVisible() && plainClick(e)){
        e.preventDefault();
        if (targetId === 'contacto' && isExtVisible()){   // en las páginas con hueco propio el contacto está en la propia página
          if (window.ilLead) window.ilLead.select(slotService());
          openExtContact(); closeNav();
          return;
        }
        goHome(targetId);
        closeNav();
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
      } else setUrl('', null, true);
    }
    document.documentElement.removeAttribute('data-boot');   // ya enrutado: la vista la controlan los atributos hidden (ver el script de arranque del <head>)
  })();

  // Sincroniza la vista con el historial: el botón atrás/adelante restaura la vista correcta. En «Estudiar en el extranjero»
  // devuelve además al punto de la página desde el que se abrió el formulario (y no a la home).
  function syncViewFromHash(e){
    const h = (window.location.hash || '').replace('#','');
    const st = (e && e.state) || {};
    if (h.indexOf('servicio-') === 0){
      const r = resolveService(h.replace('servicio-',''));
      if (r){
        const same = slotView() === 'view-service-' + r.view;
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
      setUrl('', null, true);   // dirección de un programa que no existe: se limpia y se muestra la portada, para que dirección y pantalla coincidan
    }
    // Ya en la portada: un enlace a una sección (#servicios, #contacto…) o atrás/adelante entre secciones lo resuelve el navegador.
    // Volver a mostrar la portada la subía arriba del todo; en Safari (iPhone) el evento llega después del desplazamiento
    // y los botones «Explorar programas» o «Pedir orientación» parecían no hacer nada.
    if (isHomeVisible()) return;
    showView('view-home');
    const target = h && document.getElementById(h);
    if (target && target.closest('#view-home')) requestAnimationFrame(function(){ jumpScroll(function(){ target.scrollIntoView({ block: 'start' }); }); });
  }
  window.addEventListener('popstate', syncViewFromHash);

  document.querySelectorAll('[data-cta]:not([data-cta-service]):not([data-advise])').forEach(function(el){   // los que llevan data-cta-service o data-advise ya lo miden arriba
    el.addEventListener('click', function(){ pushEvent('clic_cta', { cta_id: el.getAttribute('data-cta'), cta_text: el.textContent.trim() }); });
  });

  // ---- consulta: programa → formulario completo en una página ----
  // Solo extranjero y orientación sobre extranjero. Los programas locales abren su propia página.
  // Si la reserva está activa y se elige teléfono, la agenda aparece después de validar los datos.
  (function(){
    const form = document.getElementById('leadForm');
    if (!form) return;
    const $ = function(id){ return document.getElementById(id); };
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollOpts = function(block){ return { behavior: reduceMotion ? 'auto' : 'smooth', block: block }; };
    const radios = Array.from(form.querySelectorAll('input[name="service"]'));
    const optBtns = Array.from(form.querySelectorAll('.lf-opt[data-service]'));
    const ctx = $('leadCtx');
    const age = $('leadAge'), school = $('leadSchool'), dest = $('leadDest'), dur = $('leadDur');
    const course = $('leadCourse'), start = $('leadStart'), studentName = $('leadStudentName'), currentSchool = $('leadCurrentSchool'), english = $('leadEnglish');
    const serviceSet = $('leadServiceSet'), panel = $('leadPanel'), pickedChange = $('leadPickedChange'), mainStep = $('leadMain');
    const photoTitle = $('leadPhotoTitle');
    const contactRoot = form.closest('section.contact');
    const prefRadios = Array.from(form.querySelectorAll('input[name="contactPreference"]'));
    const phone = $('phone'), phoneReq = $('phoneReq'), phoneOpt = $('phoneOpt');
    const submitBtn = $('submitBtn');
    const msgEl = $('formMsg'), errEl = $('formErrorMsg');
    // Reserva de llamada (paso 3): solo si la reserva está activa (js/reserva-llamada.js con su dirección en el HTML)
    // y la familia prefiere que la llamemos. Si no, el formulario se envía directamente.
    const CB = window.ilCallBooking;
    const callStep = $('callStep');
    const callOn = !!(CB && CB.enabled && callStep);
    const callErr = $('callError'), callConfirm = $('callConfirmBtn'), callSummary = $('callSummary'), callDone = $('callDone');
    let picker = null, bookKey = null, booking = false;
    const DUNNO = 'Aún no lo sé';
    const attempted = {};   // a partir del primer intento de envío se valida en vivo
    let current = 1;
    let locked = '', prevService = '';
    if (photoTitle) photoTitle.setAttribute('tabindex', '-1');

    function service(){
      const c = radios.filter(function(r){ return r.checked; })[0];
      return c ? c.value : '';
    }
    function optFor(s){ return optBtns.filter(function(b){ return b.dataset.service === s; })[0]; }
    function serviceLabel(){
      const b = optFor(service());
      if (!b) return '';
      return b.dataset.title || ((b.querySelector('strong') || {}).textContent || '');
    }
    function radioOf(name){ return Array.from(form.querySelectorAll('input[name="' + name + '"]')).filter(function(r){ return r.checked; })[0] || null; }
    function radioVal(name){ const r = radioOf(name); return r ? r.value : ''; }
    function radioText(name){ const r = radioOf(name), b = r && r.closest('label').querySelector('b'); return b ? b.textContent : ''; }

    // El programa elegido encabeza el formulario; cambiarlo conserva los datos introducidos.
    // En las páginas de programa, el servicio está fijado.
    function syncPicker(){
      const s = service();
      serviceSet.hidden = !!s;
      panel.hidden = !s;
      pickedChange.hidden = !!locked;
      contactRoot.classList.toggle('has-program', !!s);
      if (!s) return;
      photoTitle.textContent = serviceLabel();
    }
    // muestra solo los bloques y campos del programa elegido (data-ctx admite varios, separados por espacios)
    function showCtx(){
      const s = service();
      ctx.hidden = !s;
      form.querySelectorAll('[data-ctx]').forEach(function(el){ el.hidden = el.getAttribute('data-ctx').split(' ').indexOf(s) === -1; });
      syncPicker();
      syncAbroadFields();
      syncCampHints();
      syncCall();
    }
    // Destination conditions apply to enquiries from this page and from the home.
    // Unknown durations are never presented as available programmes.
    const ageOptions = age.innerHTML;
    const durationOptions = dur.innerHTML;
    const durField = dur.closest('.field'), durLabel = durField.querySelector('label');
    let savedDuration = DUNNO;   // última duración que la familia eligió de verdad
    function syncAbroadFields(){
      const abroad = service() === 'extranjero';
      const general = service() === 'orientacion';
      const campAbroad = service() === 'verano-extranjero';   // campamentos de verano fuera: 8–17 años (data-camp-min / data-camp-max)
      const keepAge = age.value;
      age.innerHTML = ageOptions;
      if (abroad || campAbroad || general){
        const min = campAbroad || general ? +age.getAttribute('data-camp-min') : +age.getAttribute('data-ext-min');
        const max = campAbroad ? +age.getAttribute('data-camp-max') : +age.getAttribute('data-ext-max');
        Array.from(age.options).forEach(function(o){ if (o.value && (+o.value < min || +o.value > max)) o.remove(); });
        age.add(new Option(T.otherAge, 'Otra edad'));
      }
      age.value = Array.from(age.options).some(function(o){ return o.value === keepAge; }) ? keepAge : (keepAge && (abroad || campAbroad || general) ? 'Otra edad' : '');
      dur.innerHTML = durationOptions;
      if (dest.value === 'Irlanda'){
        Array.from(dur.options).forEach(function(o){ if (o.value === 'Un trimestre' || o.value === 'Dos trimestres') o.remove(); });
        dur.add(new Option(T.termsIreland, 'Trimestres'), 1);
      }
      if (dest.value !== 'Reino Unido' && dest.value !== 'Irlanda'){
        Array.from(dur.options).forEach(function(o){ if (o.value !== DUNNO) o.remove(); });
      }
      // Se recuerda la preferencia, pero solo se envían opciones del destino actual.
      dur.value = Array.from(dur.options).some(function(o){ return o.value === savedDuration; }) ? savedDuration : DUNNO;
      // con una sola opción («Necesitamos orientación») no hay nada que elegir: se muestra solo el título del campo y la ayuda
      const onlyOne = dur.options.length < 2;
      dur.hidden = onlyOne;
      durField.classList.toggle('is-note', onlyOne);
      if (onlyOne) durLabel.removeAttribute('for'); else durLabel.setAttribute('for', 'leadDur');
      const hint = $('hint-leadDur');
      if (hint) hint.textContent = dest.value === 'Reino Unido' ? T.durationUK : dest.value === 'Irlanda' ? T.durationIreland : T.durationOther;
      const ageHint = $('hint-leadAge');
      if (ageHint) ageHint.textContent = dest.value === 'Reino Unido' ? T.ageUK : dest.value === 'Irlanda' ? T.ageIreland : T.ageOther;
      if (isExtVisible()) showExtContext();
    }
    dest.addEventListener('change', syncAbroadFields);
    dur.addEventListener('change', function(){ savedDuration = dur.value; if (isExtVisible()) showExtContext(); });

    // Campamentos en el extranjero: avisos con los datos publicados (edad mínima por colegio y programa de liderazgo)
    function syncCampHints(){
      const hc = $('hint-campColegio'), hi = $('hint-campIngles');
      if (!hc || !hi) return;
      const on = service() === 'verano-extranjero';
      const a = parseInt(age.value, 10) || 0, c = radioVal('campColegio'), g = radioVal('campIngles'), help = c === 'Os ayudamos a elegir';
      let tc = '', ti = '';
      if (on && a && a < 10 && c && c !== 'Strathallan School' && !help) tc = T.campAge.replace('{n}', a);
      if (on && g === 'Inglés y liderazgo'){
        if (a && a < 14) ti = T.campLeadAge.replace('{n}', a);
        else if (c && c !== 'Dollar Academy' && !help) ti = T.campLeadSchool;
      }
      hc.textContent = tc; hc.hidden = !tc;
      hi.textContent = ti; hi.hidden = !ti;
    }
    form.addEventListener('change', function(e){ if (e.target === age || /^camp/.test(e.target.name || '')) syncCampHints(); });

    function optText(sel){ return sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : ''; }
    // forCall = para el evento de Google Calendar: sin el nombre ni el colegio actual del alumno
    function detail(forCall){
      const s = service();
      if (s === 'extraescolar') return school.value.trim() ? 'Colegio: ' + school.value.trim() : '';
      if (s === 'extranjero'){
        // los valores de las opciones van siempre en español: es lo que llega al equipo
        const bits = [];
        if (start.value) bits.push('Inicio: ' + start.value);
        bits.push('Destino: ' + dest.value, 'Duración: ' + dur.value);
        if (course.value) bits.push('Curso actual: ' + course.value);
        if (!forCall && studentName.value.trim()) bits.push('Alumno/a: ' + studentName.value.trim());
        if (!forCall && currentSchool.value.trim()) bits.push('Colegio actual: ' + currentSchool.value.trim());
        if (english.value) bits.push('Nivel de inglés: ' + english.value);
        return bits.join(' · ');
      }
      if (s === 'verano-extranjero'){
        const bits = [], c = radioVal('campColegio'), w = radioVal('campSemanas'), g = radioVal('campIngles');
        if (c) bits.push('Campamento: ' + c);
        if (w) bits.push('Semanas: ' + w);
        if (g) bits.push('Programa de inglés: ' + g);
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
      if (s === 'verano-extranjero') ['campColegio', 'campSemanas', 'campIngles'].forEach(function(n){ const t = radioText(n); if (t) parts.push(t); });
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
      phone.closest('.field').hidden = !need;
      phone.setAttribute('aria-required', need ? 'true' : 'false');
    }
    function advisory(){ return ['extranjero', 'verano-extranjero', 'orientacion'].indexOf(service()) !== -1; }
    function rule(step, id, ok, extra){ return Object.assign({ step: step, id: id, control: $(id), ok: ok }, extra || {}); }
    const rules = [
      rule(1, 'service', function(){ return !!service(); }, { control: serviceSet.querySelector('.lf-list'), group: true, focusEl: optBtns[0] }),
      rule(1, 'leadAge', function(){ return age.value !== ''; }, { applies: advisory }),
      rule(1, 'leadStart', function(){ return start.value !== ''; }, { applies: function(){ return service() === 'extranjero'; } }),
      rule(1, 'leadSchool', function(){ return school.value.trim() !== ''; }, { applies: function(){ return service() === 'extraescolar'; } }),
      rule(2, 'fullName', function(){ return $('fullName').value.trim() !== ''; }, { applies: advisory }),
      rule(2, 'email', function(){ return RE_EMAIL.test($('email').value.trim()); }, { applies: advisory }),
      rule(2, 'phone', function(){ return validTel(phone.value.trim()); },
        { applies: function(){ return advisory() && needPhone(); }, msg: function(){ return phone.getAttribute(needPhone() && !phone.value.trim() ? 'data-err-req' : 'data-err-fmt'); } }),
      rule(2, 'rgpd', function(){ return $('rgpd').checked; }, { applies: advisory })
    ];
    const byId = {};
    rules.forEach(function(r){ byId[r.id] = r; });
    function active(r){ return !r.applies || r.applies(); }
    function showing(r){ const e = $('err-' + r.id); return !!e && e.classList.contains('show'); }
    function paint(r, bad){
      const e = $('err-' + r.id);
      if (e){
        e.classList.toggle('show', bad);
        if (bad && r.msg) e.textContent = r.msg();
      }
      r.control.classList.toggle('invalid', bad);
      if (r.group) r.control.classList.toggle('invalid-group', bad);
      else r.control.setAttribute('aria-invalid', bad ? 'true' : 'false');
    }
    function check(r){ const bad = active(r) && !r.ok(); paint(r, bad); return !bad; }
    function validateAll(){
      attempted[1] = attempted[2] = true;
      return rules.filter(function(r){ return !check(r); });
    }
    rules.forEach(function(r){
      if (r.id === 'service') return;
      ['input', 'change'].forEach(function(evt){
        r.control.addEventListener(evt, function(){ if (attempted[r.step] || showing(r)) check(r); });
      });
    });
    ['email', 'phone'].forEach(function(id){   // formato: avisa al salir del campo (si no está vacío)
      const el = $(id);
      el.addEventListener('blur', function(){ if (el.value.trim()) check(byId[id]); });
    });
    prefRadios.forEach(function(r){
      r.addEventListener('change', function(){
        syncPhoneReq();
        syncCall();
        if (attempted[2] || showing(byId.phone)) check(byId.phone);
      });
    });

    // ---- elegir programa ----
    function choose(value, focus){
      if (value === 'campamentos' || value === 'extraescolar'){ goToServicePage(value); return; }
      const r = radios.filter(function(x){ return x.value === value; })[0];
      if (!r) return;
      r.checked = true;
      showCtx();
      [byId.leadAge, byId.leadSchool, byId.leadStart].forEach(function(x){ if (attempted[1]) check(x); else paint(x, false); });
      goTo(1, { silent: !focus });
    }
    optBtns.forEach(function(b){
      b.addEventListener('click', function(){
        choose(b.dataset.service, true);
        pushEvent('clic_cta', { cta_id: 'form-programa-' + b.dataset.service });
      });
    });
    pickedChange.addEventListener('click', function(){
      if (locked) return;
      const prev = service();
      radios.forEach(function(x){ x.checked = false; });
      goTo(1, { silent: true });
      showCtx();
      const b = optFor(prev) || optBtns[0];
      form.closest('.form-card').scrollIntoView(scrollOpts('start'));
      if (b) b.focus({ preventScroll: true });
    });

    // ---- pantallas: 1 = lista o panel del programa · 3 = elegir día y hora de la llamada ----
    function goTo(n, opts){
      current = n;
      mainStep.classList.toggle('active', n === 1);
      if (callStep) callStep.classList.toggle('active', n === 3);
      if (n === 3){
        renderSummary();
        // al volver al paso 3 se comprueba otra vez que la hora elegida sigue libre
        if (picker && picker.status() !== 'loading') picker.refresh().then(renderSummary);
        else ensurePicker();
      }
      if (opts && opts.silent) return;
      form.closest('.form-card').scrollIntoView(scrollOpts('start'));
      const first = n === 3 ? $('callTitle') : (service() ? photoTitle : optBtns[0]);
      if (first) first.focus({ preventScroll: true });
    }
    function focusFirstBad(bad){
      let el = bad[0].focusEl || bad[0].control;
      const where = el.closest('.field') || el;
      where.scrollIntoView(scrollOpts('center'));
      el.focus({ preventScroll: true });
    }

    // ---- reserva de llamada ----
    function wantsCall(){ return callOn && needPhone() && advisory(); }
    function syncCall(){
      const on = wantsCall();
      const label = submitBtn.getAttribute(on ? 'data-label-call' : service() === 'extraescolar' ? 'data-label-extra' : 'data-label-send');
      if (label && !submitBtn.disabled) submitBtn.textContent = label;
      if (on) ensurePicker();   // los horarios se piden ya, para que el paso 3 aparezca sin esperas
    }
    function ensurePicker(){
      if (picker || !callOn) return;
      picker = CB.mount($('callPicker'), {
        onChange: function(slot){ if (slot) setFormError(callErr, ''); renderSummary(); },   // el aviso de «hora ocupada» se queda hasta que eligen otra
        // sin horarios (reserva sin configurar o fallo de Google): no hay nada que confirmar; queda enviar la consulta sin hora
        onState: function(state){
          const off = state === 'off' || state === 'error';
          callConfirm.hidden = off;
          callStep.classList.toggle('call-unavailable', off);
          if (off) callSummary.hidden = true;
        }
      });
      picker.load();
    }
    function renderSummary(){
      const slot = picker && picker.selected();
      callSummary.hidden = !slot;
      if (!slot) return;
      $('callSumConsult').textContent = recap();
      $('callSumDate').textContent = CB.longDate(slot.date);
      $('callSumTime').textContent = slot.time + ' ' + T.callTz;
      $('callSumPhone').textContent = phone.value.trim();
    }
    function newKey(){
      if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
      const b = crypto.getRandomValues(new Uint8Array(16));
      b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
      const h = Array.prototype.map.call(b, function(x){ return (x + 256).toString(16).slice(1); }).join('');
      return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
    }
    // La misma clave para los reintentos y dobles clics de una misma reserva (el servidor no la duplica);
    // si cambian la hora o los datos de contacto, es otra reserva y lleva otra clave.
    function keyFor(slot){
      const fp = [slot.start, phone.value.trim(), $('email').value.trim(), $('fullName').value.trim()].join('|');
      if (!bookKey || bookKey.fp !== fp) bookKey = { fp: fp, key: newKey() };
      return bookKey.key;
    }
    function wantsNews(){ const n = $('leadNews'); return !!(n && n.checked); }
    function studentAgeText(){ return age.value === 'Otra edad' ? 'Otra edad (ver mensaje)' : age.value ? age.value + ' años' : ''; }
    function callPayload(slot){
      return {
        idempotencyKey: keyFor(slot), slotStart: slot.start, lang: LANG, website: ($('leadHp') || {}).value || '',
        contact: { fullName: $('fullName').value.trim(), email: $('email').value.trim(), phone: phone.value.trim(), rgpd: $('rgpd').checked },
        // la preferencia de recibir novedades llega al equipo con la consulta (no va al evento del calendario)
        consult: { service: service(), serviceLabel: serviceLabel(), studentAge: studentAgeText(), serviceExtra: [detail(false), wantsNews() ? 'Acepta recibir información: Sí' : ''].filter(Boolean).join(' · '), callContext: detail(true), message: $('message').value }
      };
    }
    // vuelve al formulario y señala lo que falta; devuelve true si todo está bien
    function readyOrShow(){
      const bad = validateAll();
      if (!bad.length) return true;
      goTo(1, { silent: true });
      focusFirstBad(bad);
      return false;
    }
    function confirmCall(){
      if (booking) return;   // doble clic: la primera petición sigue en marcha
      setFormError(callErr, '');
      const slot = picker && picker.selected();
      if (!slot){ setFormError(callErr, T.callPick); if (picker) picker.focus(); return; }
      if (!readyOrShow()) return;
      booking = true;
      const label = callConfirm.textContent;
      callConfirm.disabled = true; callConfirm.textContent = T.callConfirming;
      let tries = 0;
      function done(msg){
        booking = false; callConfirm.disabled = false; callConfirm.textContent = label;
        if (msg) setFormError(callErr, msg);
      }
      (function attempt(){
        CB.api.book(callPayload(slot)).then(function(res){
          const b = res.body || {};
          const st = b.status;
          if (res.http === 200 && st === 'confirmed' && b.booking){ booking = false; callConfirm.disabled = false; callConfirm.textContent = label; showBooked(b); return; }
          if (res.http === 202 && tries++ < 6){ setTimeout(attempt, 1500); return; }      // otra petición igual está terminando
          if (st === 'expired_key' && tries++ < 2){ bookKey = null; attempt(); return; }
          if (st === 'slot_taken' || st === 'day_full' || (st === 'invalid' && (b.fields || []).indexOf('slotStart') !== -1)){
            done(st === 'day_full' ? T.callDayFull : T.callTaken);
            picker.clear();
            picker.refresh();
            return;
          }
          if (st === 'invalid' && (b.fields || []).some(function(f){ return ['fullName', 'email', 'phone', 'rgpd'].indexOf(f) !== -1; })){
            done('');
            readyOrShow();
            return;
          }
          if (st === 'too_many'){ done(T.callTooMany); return; }
          if (st === 'rate_limited'){ done(T.callRate); return; }
          done(T.callFailed);   // nunca se da por reservada sin la confirmación del servidor
        });
      })();
    }
    function showBooked(r){
      const b = r.booking;
      form.classList.add('is-sent');
      $('callDoneDate').textContent = CB.longDate(b.date);
      $('callDoneTime').textContent = b.time + ' ' + T.callTz;
      $('callDonePhone').textContent = b.phone;
      const fam = r.email && r.email.family;
      const mail = $('callDoneMail');
      mail.hidden = !(fam === 'sent' || fam === 'failed' || fam === 'pending_config');
      mail.textContent = fam === 'sent' ? T.callMailSent : T.callMailNo;
      $('callCancelLink').href = r.cancelUrl || '#';
      callDone.hidden = false;
      callDone.scrollIntoView(scrollOpts('center'));
      callDone.focus({ preventScroll: true });
      pushEvent('llamada_reservada', { servicio: service() });
    }
    if (callOn){
      $('callBackBtn').addEventListener('click', function(){ goTo(1); });
      callConfirm.addEventListener('click', confirmCall);
      // sin hora fija: la consulta se envía como siempre, con la preferencia «por teléfono»
      $('callNoTimeBtn').addEventListener('click', function(){ if (readyOrShow()) sendLead($('callNoTimeBtn')); });
    }

    // ---- envío ----
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (current === 3){ confirmCall(); return; }   // Intro en el paso 3 confirma la llamada
      if (!advisory()) return;                        // sin programa elegido no hay nada que enviar
      const bad = validateAll();
      if (bad.length){ setFormError(errEl, ''); focusFirstBad(bad); return; }
      if (wantsCall()){ goTo(3); pushEvent('clic_cta', { cta_id: 'form-paso-llamada' }); return; }
      sendLead(submitBtn);
    });
    function sendLead(btn){
      const s = service();
      const payload = new URLSearchParams({
        form_type: 'lead',
        service: s,
        serviceExtra: detail(),
        studentAge: studentAgeText(),
        message: $('message').value,
        fullName: $('fullName').value,
        email: $('email').value,
        phone: needPhone() ? phone.value : '',
        contactPreference: pref(),
        rgpd: $('rgpd').checked ? '1' : '',
        comunicaciones: wantsNews() ? 'Sí' : 'No',   // casilla aparte y opcional: responder a la consulta no implica recibir novedades
        website: ($('leadHp') || {}).value || ''
      });

      const prevLabel = btn.textContent;
      const errBox = btn === submitBtn ? errEl : callErr;
      setFormError(errBox, '');
      btn.disabled = true; btn.textContent = T.sending;

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
          btn.disabled = false; btn.textContent = prevLabel;
          setFormError(errBox, T.leadError);
        });
    }

    // API para el resto de la página (CTA de las subpáginas, tarjetas de destino…): dejan el formulario ya orientado
    window.ilLead = {
      select: function(value){
        if (locked && value !== locked) return;   // en una página con hueco propio el programa es el de la página
        choose(value, false);
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
          if (opt){ dur.value = opt.value; savedDuration = opt.value; return; }
        }
        const m = $('message');
        if (m && !m.value.trim()) m.value = text;
      },
      // destino y duración que hay elegidos (texto visible en el idioma de la página), para el aviso «Consulta sobre…»
      getContext: function(){
        if (service() !== 'extranjero') return { destino: '', duracion: '' };
        return {
          destino: dest && dest.value !== DUNNO ? optText(dest) : '',
          duracion: dur && dur.value !== DUNNO ? optText(dur) : ''
        };
      },
      // Modo fijo (el contacto colocado al final de «Estudiar en el extranjero» o de «Campamentos de verano en el extranjero»): el programa
      // es el de la página y las edades son las del programa. Al salir se restaura lo que había elegido antes.
      lock: function(value){
        value = value || '';
        if (value === locked) return;
        const keep = age.value;
        if (value){
          if (!locked) prevService = service();
          const r = radios.filter(function(x){ return x.value === value; })[0];
          if (r) r.checked = true;
        } else {
          age.innerHTML = ageOptions;
          const back = radios.filter(function(x){ return x.value === prevService; })[0];
          if (back) back.checked = true; else radios.forEach(function(x){ x.checked = false; });
        }
        locked = value;
        form.classList.toggle('is-locked', !!value);
        if (Array.from(age.options).some(function(o){ return o.value === keep; })) age.value = keep;
        showCtx();
        goTo(1, { silent: true });
      }
    };

    syncPhoneReq();
    showCtx();
    goTo(1, { silent: true });
    window.ilLead.lock(slotService());   // carga directa de una de esas páginas: el formulario se crea después del router
  })();

  // ---- «Estudiar en el extranjero»: comparación con dos velocidades e índice de la página ----
  // En móvil (la hoja de estilos decide cuándo se ve el botón) cada criterio muestra primero el dato de los dos países, uno junto al otro;
  // «Ver matices» despliega la explicación de esa fila. En escritorio los matices se ven siempre y el botón no aparece.
  (function(){
    document.querySelectorAll('#ext-comparar tbody tr').forEach(function(tr){
      const th = tr.querySelector('th');
      if (!th || !tr.querySelector('.ext-cmp-s')) return;
      const name = th.textContent.replace(/\s+/g, ' ').trim();
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ext-cmp-tg';
      btn.setAttribute('aria-expanded', 'false');
      const label = document.createElement('span');
      const ctx = document.createElement('span');
      ctx.className = 'sr-only';
      ctx.textContent = ' — ' + name;
      label.textContent = T.cmpMore;
      btn.appendChild(label); btn.appendChild(ctx);
      btn.addEventListener('click', function(){
        const open = tr.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        label.textContent = open ? T.cmpLess : T.cmpMore;
      });
      th.appendChild(btn);
      tr.classList.add('has-tg');
    });
    // El índice «En esta página» lleva la sombra de barra fija solo cuando ya está pegado bajo el menú
    const toc = document.querySelector('.ext-toc');
    if (!toc) return;
    function stuck(){
      if (toc.offsetParent === null) return;   // la página no está a la vista
      const top = parseFloat(getComputedStyle(toc).top) || 0;
      toc.classList.toggle('is-stuck', toc.getBoundingClientRect().top <= top + 1 && window.scrollY > 0);
    }
    window.addEventListener('scroll', stuck, { passive: true });
    window.addEventListener('resize', stuck, { passive: true });
    document.addEventListener('il:navigation', stuck);
    stuck();
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

  // ---------- Tarjetas de destino con vídeo (portada, «El inglés se aprende viviéndolo») ----------
  // Estilo «Cine», elegido el 05-11-2026. Escritorio con ratón (≥901 px): los vídeos suenan a la vez, sin sonido y en bucle, mientras la fila
  // está a la vista. Móvil y tableta: solo la tarjeta más cercana al centro de la pantalla, una vez (el último fotograma enlaza con el póster).
  // A ≤900 px se usa la versión apaisada (data-src-wide). Arrancan solos también con «reducir movimiento» del sistema y no hay botón de
  // pausa (decisiones de Jaime, 05-11-2026). Solo con ahorro de datos o conexión 2G no se reproducen ni se descarga nada: queda el póster.
  (function(){
    var grid = document.querySelector('.intl-dest-grid');
    if (!grid || !window.matchMedia) return;
    var cards = Array.prototype.filter.call(grid.querySelectorAll('.intl-dest-card'), function(c){ return !!c.querySelector('.dst-video'); });
    if (!cards.length) return;
    var desk = window.matchMedia('(hover:hover) and (pointer:fine) and (min-width:901px)');
    var wide = window.matchMedia('(max-width:900px)');
    var conn = navigator.connection || {};
    try { localStorage.removeItem('il-videos-destinos'); } catch (e) {}   // la pausa que guardaba el antiguo botón ya no se usa: que nadie se quede sin vídeos
    var gridVisible = false, scrollRaf = 0, ratios = new Map();

    function blocked(){ return !!conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ''); }   // solo cuidar los datos del móvil
    function allowed(){ return !blocked() && !document.hidden; }
    function vid(c){ return c.querySelector('.dst-video'); }
    function load(c){
      var v = vid(c), want = (wide.matches && v.getAttribute('data-src-wide')) || v.getAttribute('data-src');
      if (v.getAttribute('src') !== want) { v.setAttribute('src', want); v.preload = 'auto'; v.load(); }
      return v;
    }
    function play(c){
      if (!allowed()) return;
      var v = load(c);
      v.muted = true;
      v.loop = desk.matches;
      v._want = true; v._tries = 0;
      clearTimeout(v._retry); clearTimeout(v._reset);
      function start(){
        if (!v._want || !allowed()) return;
        c.classList.add('is-playing');   // se muestra ya: el primer fotograma es el del póster, y WebKit no arranca un vídeo invisible
        var p = v.play();
        if (p && p.catch) p.catch(function(){
          if (!v._want) return;
          c.classList.remove('is-playing');
          // WebKit rechaza el arranque mientras la tarjeta aún entra con su fundido (.reveal): se reintenta unos instantes después
          if (++v._tries <= 8) v._retry = setTimeout(start, 450);
        });
      }
      if (v.readyState >= 2) start(); else v.addEventListener('canplay', start, { once: true });
    }
    function stop(c){
      var v = vid(c);
      v._want = false;
      clearTimeout(v._retry); clearTimeout(v._reset);
      c.classList.remove('is-playing');
      // tras el fundido (1,1 s) vuelve al principio, que es el póster
      v._reset = setTimeout(function(){
        if (c.classList.contains('is-playing')) return;
        v.pause();
        try { v.currentTime = 0; } catch (e) {}
      }, 1200);
    }
    function stopAll(){ cards.forEach(stop); }
    function pick(){   // móvil y tableta: de las tarjetas que se ven casi enteras, la más cercana al centro
      if (desk.matches || !allowed()) return;
      var best = null, bestD = Infinity, mid = window.innerHeight / 2;
      cards.forEach(function(c){
        if ((ratios.get(c) || 0) < 0.6) return;
        var r = c.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) { best = c; bestD = d; }
      });
      cards.forEach(function(c){ if (c !== best && c.classList.contains('is-playing')) stop(c); });
      if (best && !best.classList.contains('is-playing') && !best.hasAttribute('data-done')) { best.setAttribute('data-done', ''); play(best); }
    }
    function refresh(){
      if (!allowed()) { stopAll(); return; }
      if (desk.matches) { if (gridVisible) cards.forEach(play); else stopAll(); }
      else pick();
    }

    cards.forEach(function(c){
      var v = vid(c);
      v.addEventListener('ended', function(){ if (!desk.matches) { stop(c); c.setAttribute('data-done', ''); } });
      v.addEventListener('error', function(){ v._want = false; c.classList.remove('is-playing'); });
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function(es){
        es.forEach(function(e){ gridVisible = e.isIntersecting; });
        refresh();
      }, { rootMargin: '200px 0px', threshold: 0 }).observe(grid);
      var cardIO = new IntersectionObserver(function(es){
        es.forEach(function(e){
          ratios.set(e.target, e.intersectionRatio);
          if (e.intersectionRatio < 0.2) e.target.removeAttribute('data-done');   // al salir de la pantalla se puede volver a ver
        });
        pick();
      }, { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] });
      cards.forEach(function(c){ cardIO.observe(c); });
      window.addEventListener('scroll', function(){   // con dos tarjetas enteras a la vista, la del centro cambia sin cruzar ningún umbral
        if (desk.matches || !gridVisible || scrollRaf) return;
        scrollRaf = requestAnimationFrame(function(){ scrollRaf = 0; pick(); });
      }, { passive: true });
    }

    document.addEventListener('visibilitychange', function(){ if (document.hidden) stopAll(); else refresh(); });
    function onMQ(mq, fn){ if (mq.addEventListener) mq.addEventListener('change', fn); else if (mq.addListener) mq.addListener(fn); }
    onMQ(desk, function(){ stopAll(); refresh(); });
    onMQ(wide, function(){ stopAll(); refresh(); });   // cambia entre la versión vertical y la apaisada
  })();
