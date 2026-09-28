window.dataLayer = window.dataLayer || [];
  // Textos que genera el JS. La web es ES/EN: el idioma se lee de <html lang>.
  var LANG = (document.documentElement.lang || 'es').slice(0, 2) === 'en' ? 'en' : 'es';
  var I18N = {
    es: {
      brand: 'Interlanguage Studies',
      steps: { 1: 'Paso 1 de 2 · ¿Qué os interesa?', 2: 'Paso 2 de 2 · ¿Cómo os contactamos?' },
      sending: 'Enviando…',
      leadError: 'No hemos podido enviar la solicitud. Tus datos siguen aquí: inténtalo de nuevo en unos segundos o escríbenos a info@interlanguage.es.',
      captions: {
        nativos:  { tag: 'Profesores nativos', text: 'Formados específicamente para enseñar a niños — no solo para hablar el idioma.' },
        haciendo: { tag: 'Aprender haciendo', text: 'El inglés como herramienta para crear, no como examen que aprobar.' },
        ritmo:    { tag: 'Cada alumno tiene su ritmo', text: 'Grupos pequeños para que nadie se quede atrás ni se aburra.' }
      },
      serviceMap: {
        extranjero:  { help:'Programas para jóvenes y adolescentes en Irlanda, Reino Unido y Estados Unidos, desde un verano hasta un curso escolar completo.', label:'Destino que os interesa', opts:[['Aún no lo sé','Aún no lo sé'],['Irlanda','Irlanda'],['Reino Unido','Reino Unido'],['Estados Unidos','Estados Unidos']], age:'Edad o curso del alumno/a', ph:'Ej. 15 años / 4º de ESO' },
        campamentos: { help:'Campamento de verano en inglés, en Madrid, para niños de 3 a 10 años.', label:'¿Qué semanas os interesan?', opts:[['Aún no lo sé','Aún no lo sé'],['Julio completo','Julio completo'],['Algunas semanas sueltas','Algunas semanas sueltas']], age:'Edad del niño/a', ph:'Ej. 7 años' },
        extraescolar:{ help:'Clases de inglés en el propio colegio durante el curso, de Infantil a la ESO.', label:'¿Qué días os encajan mejor?', opts:[['Cualquiera','Cualquiera'],['Martes y jueves','Martes y jueves'],['Lunes y miércoles','Lunes y miércoles']], age:'Curso del alumno/a', ph:'Ej. 2º de Primaria' },
        orientacion: { help:'Contadnos la edad y qué buscáis, y os orientamos sin compromiso.', label:'', opts:[], age:'Edad o curso del alumno/a (opcional)', ph:'Ej. 7 años / 2º de Primaria' }
      }
    },
    en: {
      brand: 'Interlanguage Studies',
      steps: { 1: 'Step 1 of 2 · What are you interested in?', 2: 'Step 2 of 2 · How can we reach you?' },
      sending: 'Sending…',
      leadError: "We couldn't send your request. Your details are still here: please try again in a few seconds or email us at info@interlanguage.es.",
      captions: {
        nativos:  { tag: 'Native teachers', text: 'Specifically trained to teach children, not just to speak the language.' },
        haciendo: { tag: 'Learning by doing', text: 'English as a tool to create with, not an exam to pass.' },
        ritmo:    { tag: 'Every pupil has their own pace', text: 'Small groups so nobody gets left behind or bored.' }
      },
      /* el valor (1.º) es el que llega al equipo y no cambia con el idioma; el texto (2.º) es lo que ve la familia */
      serviceMap: {
        extranjero:  { help:'Programmes for teenagers in Ireland, the United Kingdom and the United States, from one summer to a full school year.', label:'Which destination are you interested in?', opts:[['Aún no lo sé','Not sure yet'],['Irlanda','Ireland'],['Reino Unido','United Kingdom'],['Estados Unidos','United States']], age:"Pupil's age or year group", ph:'e.g. 15 years old' },
        campamentos: { help:'Summer camp in English, in Madrid, for children aged 3 to 10.', label:'Which weeks are you interested in?', opts:[['Aún no lo sé','Not sure yet'],['Julio completo','All of July'],['Algunas semanas sueltas','A few separate weeks']], age:"Child's age", ph:'e.g. 7 years old' },
        extraescolar:{ help:'English classes at school during the school year, from Early Years to Secondary.', label:'Which days suit you best?', opts:[['Cualquiera','Any'],['Martes y jueves','Tuesday and Thursday'],['Lunes y miércoles','Monday and Wednesday']], age:"Pupil's year group", ph:'e.g. Year 2 of Primary' },
        orientacion: { help:"Tell us their age and what you're looking for, and we'll guide you with no commitment.", label:'', opts:[], age:"Pupil's age or year group (optional)", ph:'e.g. 7 years old / Year 2 of Primary' }
      }
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

  // "Nuestro método": al pasar el ratón o el foco por un pilar, cambia la foto y el texto superpuesto
  (function(){
    const pillars = document.querySelectorAll('#methodPrinciples .method-principle');
    const frame = document.querySelector('.method-photo-frame');
    const caption = document.getElementById('methodCaption');
    if (!pillars.length || !frame) return;
    const captions = T.captions;
    function activate(id){
      pillars.forEach(function(p){ p.classList.toggle('is-active', p.dataset.target === id); });
      frame.querySelectorAll('img').forEach(function(img){ img.classList.toggle('is-shown', img.dataset.id === id); });
      const c = captions[id];
      if (c && caption){
        caption.querySelector('.tag').textContent = c.tag;
        caption.querySelector('p').textContent = c.text;
      }
    }
    pillars.forEach(function(p){
      p.addEventListener('mouseenter', function(){ activate(p.dataset.target); });
      p.addEventListener('focus', function(){ activate(p.dataset.target); });
      p.addEventListener('click', function(){ activate(p.dataset.target); });
    });
  })();

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

  function showView(viewId, opts){
    opts = opts || {};
    allViews.forEach(function(v){ v.hidden = (v.id !== viewId); });
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
    showView('view-service-' + key);
    pushEvent('clic_cta', { cta_id: 'servicio-subpagina-' + key });
    // pushState (no replaceState): así el botón "atrás" del navegador vuelve a la home.
    history.pushState({ view: 'service-' + key }, '', '#servicio-' + key);
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

  // ---- formulario de inscripción al campamento (3 pasos) ----
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
    const steps = Array.from(campForm.querySelectorAll('.form-step'));
    const weekChecks = Array.from(campForm.querySelectorAll('.camp-week'));
    const sede = $('campSede');
    const comedor = $('campComedor');
    const stepLabel = $('campFormStepLabel');
    const progressBar = $('campFormProgressBar');
    const msgEl = $('campFormMsg');
    const errEl = $('campFormErrorMsg');
    const submitBtn = $('campSubmitBtn');
    let current = 1;
    const attempted = {};   // pasos en los que ya se intentó avanzar (a partir de ahí se valida en vivo)

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
      setAll('sede', sede.value || L.lNone);
      setAll('weeks', weeksTxt);
      setAll('comedor', comedorTxt);
      setAll('total', totalTxt);
      setAll('breakdown', note);
      setAll('line', (sede.value || L.lNone) + '\n' + [s.n ? s.n + ' ' + weeksWord(s.n) : L.lNone, comedorTxt, totalTxt].join(' · '));
      campForm.querySelectorAll('[data-sum="comedor-note"]').forEach(function(el){ el.hidden = !comedor.checked; });
      campForm.querySelectorAll('[data-camp-summary]').forEach(function(el){ el.classList.toggle('is-empty', s.total === null); });
    }

    // ---- validación (mensaje junto al campo; los valores nunca se borran) ----
    const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    function validTel(v){ return /^\+?\d{8,15}$/.test(v.replace(/[\s().-]/g, '')); }
    function filled(id){ return $(id).value.trim() !== ''; }
    function rule(step, id, ok, extra){ return Object.assign({ step: step, id: id, control: $(id), ok: ok }, extra || {}); }
    const rules = [
      rule(1, 'campSede', function(){ return filled('campSede'); }),
      rule(1, 'campWeeks', function(){ return weekChecks.some(function(c){ return c.checked; }); },
           { control: campForm.querySelector('.camp-weeks'), focusEl: weekChecks[0] }),
      rule(2, 'campAlumnoNombre', function(){ return filled('campAlumnoNombre'); }),
      rule(2, 'campAlumnoApellidos', function(){ return filled('campAlumnoApellidos'); }),
      rule(2, 'campColegio', function(){ return filled('campColegio'); }),
      rule(3, 'campTutor', function(){ return filled('campTutor'); }),
      rule(3, 'campEmail', function(){ return RE_EMAIL.test($('campEmail').value.trim()); }),
      rule(3, 'campTelefono', function(){ return validTel($('campTelefono').value.trim()); }),
      rule(3, 'campRgpd', function(){ return $('campRgpd').checked; })
    ];
    function showing(r){ const e = $('err-' + r.id); return !!e && e.classList.contains('show'); }
    function paint(r, bad){
      const e = $('err-' + r.id);
      if (e) e.classList.toggle('show', bad);
      r.control.classList.toggle('invalid', bad);
      if (r.control.tagName !== 'DIV') r.control.setAttribute('aria-invalid', bad ? 'true' : 'false');
    }
    function check(r){ const bad = !r.ok(); paint(r, bad); return !bad; }
    function validateStep(n){
      attempted[n] = true;
      return rules.filter(function(r){ return r.step === n; }).filter(function(r){ return !check(r); });
    }
    rules.forEach(function(r){
      (r.id === 'campWeeks' ? weekChecks : [r.control]).forEach(function(t){
        ['input', 'change'].forEach(function(evt){
          t.addEventListener(evt, function(){ if (attempted[r.step] || showing(r)) check(r); });
        });
      });
    });
    ['campEmail', 'campTelefono'].forEach(function(id){   // formato: avisa al salir del campo (si no está vacío)
      const el = $(id);
      el.addEventListener('blur', function(){
        if (el.value.trim()) check(rules.filter(function(r){ return r.id === id; })[0]);
      });
    });

    // ---- pasos ----
    function goTo(n, opts){
      current = n;
      steps.forEach(function(s){ s.classList.toggle('active', +s.dataset.step === n); });
      progressBar.style.width = (n / steps.length * 100) + '%';
      stepLabel.textContent = stepLabel.getAttribute('data-label-' + n);
      if (opts && opts.silent) return;
      stepLabel.scrollIntoView(scrollOpts('start'));     // el paso nuevo empieza arriba, también en móvil
      stepLabel.focus({ preventScroll: true });
    }
    function focusFirstBad(bad){
      const el = bad[0].focusEl || bad[0].control;
      el.scrollIntoView(scrollOpts('center'));
      el.focus({ preventScroll: true });
    }
    function next(){
      const bad = validateStep(current);
      if (bad.length){ focusFirstBad(bad); return; }
      goTo(current + 1);
    }
    $('campStep1NextBtn').addEventListener('click', next);
    $('campStep2NextBtn').addEventListener('click', next);
    $('campStep2BackBtn').addEventListener('click', function(){ goTo(1); });
    $('campStep3BackBtn').addEventListener('click', function(){ goTo(2); });
    campForm.querySelectorAll('[data-goto-step]').forEach(function(b){
      b.addEventListener('click', function(){ goTo(parseInt(b.getAttribute('data-goto-step'), 10)); });
    });
    weekChecks.forEach(function(c){ c.addEventListener('change', render); });
    comedor.addEventListener('change', render);
    sede.addEventListener('change', render);

    // ---- envío ----
    function showSent(){
      const holder = campForm.querySelector('[data-sent-recap]');
      const src = steps[steps.length - 1].querySelector('[data-camp-summary]');
      if (holder && src){
        const clone = src.cloneNode(true);   // copia congelada del resumen enviado
        clone.querySelectorAll('button').forEach(function(b){ b.remove(); });
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
      if (current < steps.length){ next(); return; }   // Intro en los pasos 1 y 2 avanza; no envía
      for (let n = 1; n <= steps.length; n++){
        const bad = validateStep(n);
        if (bad.length){ if (n !== current) goTo(n, { silent: true }); focusFirstBad(bad); return; }
      }
      const s = state();
      const val = function(id){ const el = $(id); return el ? el.value : ''; };
      const payload = new URLSearchParams({
        form_type: 'campamento',
        sede: val('campSede'),
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
      setFormError(errEl, '');
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

    goTo(1, { silent: true });
    render();
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

  // CTA "Solicitar información" dentro de cada subpágina -> vuelve a home y va al formulario
  document.querySelectorAll('[data-cta-service]').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      const key = btn.getAttribute('data-cta-service');
      showView('view-home');
      const serviceSelect = document.getElementById('service');
      if (serviceSelect){ serviceSelect.value = key; }
      requestAnimationFrame(function(){
        const target = document.getElementById('contacto');
        if (target) target.scrollIntoView({ behavior:'smooth', block:'start' });
      });
      pushEvent('clic_cta', { cta_id: 'solicitar-info-desde-' + key });
    });
  });

  // "Estudiar en el extranjero": tarjetas de destino / tipo de programa y CTAs de asesoramiento.
  // Llevan al formulario de contacto con el servicio (y el destino) ya elegidos; los destinos son los
  // mismos de #serviceExtra. Cuando exista una página propia de destino/programa, basta con cambiar la
  // tarjeta de data-advise a data-jump-service="extranjero-<destino>" (el router ya lo resuelve).
  (function(){
    const DESTINOS = { 'irlanda': 'Irlanda', 'reino-unido': 'Reino Unido', 'estados-unidos': 'Estados Unidos' };
    document.querySelectorAll('[data-advise]').forEach(function(el){
      el.addEventListener('click', function(e){
        e.preventDefault();
        // si ya estamos en la home no saltamos arriba: solo bajamos al formulario
        showView('view-home', isHomeVisible() ? { keepScroll: true } : undefined);
        const sel = document.getElementById('service');
        if (sel){ sel.value = el.getAttribute('data-advise'); sel.dispatchEvent(new Event('change')); }   // 'change' adapta el formulario
        const extra = document.getElementById('serviceExtra');
        const destino = DESTINOS[el.getAttribute('data-destino')];
        if (extra && destino) extra.value = destino;
        const note = el.getAttribute('data-advise-note');
        const msg = document.getElementById('message');
        if (msg && note && !msg.value.trim()) msg.value = note;
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        requestAnimationFrame(function(){
          const target = document.getElementById('contacto');
          if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        });
        pushEvent('clic_cta', { cta_id: 'extranjero-' + (el.getAttribute('data-destino') || el.getAttribute('data-programa') || 'asesor') });
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

  // carga directa con hash tipo #servicio-campamentos
  (function(){
    const hash = window.location.hash.replace('#','');
    if (hash.indexOf('servicio-') === 0){
      const key = hash.replace('servicio-','');
      if (document.getElementById('view-service-' + key)){
        showView('view-service-' + key, { silent: true });
      }
    }
  })();

  // Sincroniza la vista con el historial: el botón atrás/adelante restaura la vista correcta.
  function syncViewFromHash(){
    const h = (window.location.hash || '').replace('#','');
    if (h.indexOf('servicio-') === 0){
      const key = h.replace('servicio-','');
      if (document.getElementById('view-service-' + key)){ showView('view-service-' + key); return; }
    }
    showView('view-home');
  }
  window.addEventListener('popstate', syncViewFromHash);

  document.querySelectorAll('[data-cta]').forEach(function(el){
    el.addEventListener('click', function(){ pushEvent('clic_cta', { cta_id: el.getAttribute('data-cta'), cta_text: el.textContent.trim() }); });
  });

  const form = document.getElementById('leadForm');
  const msg = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');
  const leadErrEl = document.getElementById('formErrorMsg');

  function validateField(field){
    let valid = true;
    const val = field.value.trim();
    if (field.hasAttribute('required') && !val){ valid = false; }
    if (field.type === 'email' && val){ valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val); }
    if (field.type === 'tel' && val){ valid = /^[+\d][\d\s]{7,}$/.test(val); }
    const errEl = document.getElementById('err-' + field.id);
    field.classList.remove('valid','invalid');
    if (val){ field.classList.add(valid ? 'valid' : 'invalid'); }
    if (errEl){ errEl.classList.toggle('show', val !== '' && !valid); }
    return valid;
  }

  ['fullName','email','phone','service'].forEach(function(id){
    const field = document.getElementById(id);
    field.addEventListener('input', function(){ validateField(field); });
    field.addEventListener('blur', function(){ validateField(field); });
  });

  // navegación multi-paso
  (function(){
    const steps = Array.from(form.querySelectorAll('.form-step'));
    const progressBar = document.getElementById('formProgressBar');
    const stepLabel = document.getElementById('formStepLabel');
    const nextBtn = document.getElementById('stepNextBtn');
    const backBtn = document.getElementById('stepBackBtn');
    if (!steps.length || !nextBtn) return;
    let current = 1;
    const labels = T.steps;

    function goToStep(n){
      steps.forEach(function(s){ s.classList.toggle('active', +s.dataset.step === n); });
      progressBar.style.width = (n === 1 ? 50 : 100) + '%';
      stepLabel.textContent = labels[n];
      current = n;
    }

    nextBtn.addEventListener('click', function(){
      const service = document.getElementById('service');
      if (!validateField(service)){ service.focus(); return; }
      goToStep(2);
      pushEvent('clic_cta', { cta_id: 'form-paso-2' });
    });
    backBtn.addEventListener('click', function(){ goToStep(1); });
  })();

  form.addEventListener('submit', function(e){
    e.preventDefault();
    let allValid = true;
    ['fullName','email','phone','service'].forEach(function(id){
      const field = document.getElementById(id);
      if (!validateField(field)) allValid = false;
    });
    const rgpd = document.getElementById('rgpd');
    if (!rgpd.checked) allValid = false;
    if (!allValid){ form.reportValidity(); return; }
    const service = document.getElementById('service').value;
    const studentAge = document.getElementById('studentAge').value;
    const payload = new URLSearchParams({
      form_type: 'lead',
      service: service,
      serviceExtra: (document.getElementById('serviceExtra') && !document.getElementById('serviceExtraWrap').hidden) ? document.getElementById('serviceExtra').value : '',
      studentAge: studentAge,
      message: document.getElementById('message').value,
      fullName: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      rgpd: rgpd.checked ? '1' : '',
      website: (document.getElementById('leadHp') || {}).value || ''
    });

    const prevLabel = submitBtn.textContent;
    setFormError(leadErrEl, '');
    submitBtn.disabled = true; submitBtn.textContent = T.sending;

    fetch(FORM_ENDPOINT, { method: 'POST', body: payload })
      .then(function(r){ if (!r.ok) throw new Error('http'); return r.json(); })
      .then(function(res){
        if (!res || !res.ok) throw new Error('resp');
        pushEvent('lead_generado', { servicio: service, edad_alumno: studentAge });
        pushEvent('formulario_enviado', { servicio: service });
        msg.classList.add('show');
        form.querySelectorAll('input, select, textarea, button').forEach(function(el){ el.disabled = true; });
        msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch(function(){
        submitBtn.disabled = false; submitBtn.textContent = prevLabel;
        setFormError(leadErrEl, T.leadError);
      });
  });

  // Formulario: adapta la ayuda y los campos al servicio elegido
  (function(){
    var sel = document.getElementById('service');
    if (!sel) return;
    var help = document.getElementById('serviceHelp');
    var wrap = document.getElementById('serviceExtraWrap');
    var extra = document.getElementById('serviceExtra');
    var extraLabel = document.getElementById('serviceExtraLabel');
    var ageLabel = document.getElementById('studentAgeLabel');
    var ageInput = document.getElementById('studentAge');
    var MAP = T.serviceMap;
    function apply(){
      var m = MAP[sel.value];
      if (!m){ if(help) help.hidden = true; if(wrap) wrap.hidden = true; return; }
      if (help){ help.textContent = m.help; help.hidden = false; }
      if (ageLabel) ageLabel.textContent = m.age;
      if (ageInput) ageInput.placeholder = m.ph;
      if (m.opts.length){
        if (extraLabel) extraLabel.textContent = m.label;
        if (extra) extra.innerHTML = m.opts.map(function(o){ return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('');
        if (wrap) wrap.hidden = false;
      } else { if (wrap) wrap.hidden = true; if (extra) extra.innerHTML = ''; }
    }
    sel.addEventListener('change', apply);
  })();
