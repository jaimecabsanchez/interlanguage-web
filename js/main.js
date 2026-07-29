window.dataLayer = window.dataLayer || [];
  function pushEvent(name, params){ window.dataLayer.push(Object.assign({event: name}, params || {})); }
  window.addEventListener('DOMContentLoaded', function(){ pushEvent('pagina_cargada', { page_path: window.location.pathname }); });

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

  // carrusel automático de fotos del hero — con progreso, pausa al hover y swipe táctil
  (function(){
    const frame = document.getElementById('heroCarousel');
    if (!frame) return;
    const slides = Array.from(frame.querySelectorAll('.hero-slide'));
    const dotsWrap = document.getElementById('heroDots');
    let current = 0;
    let timer = null;
    let paused = false;
    const DURATION = 3200;

    slides.forEach(function(_, i){
      const dot = document.createElement('div');
      dot.className = 'hero-slide-dot' + (i === 0 ? ' active' : '');
      const fill = document.createElement('span');
      fill.className = 'fill';
      dot.appendChild(fill);
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(i){
      slides[current].classList.remove('active');
      slides[i].classList.add('active');
      current = i;
      dots.forEach(function(d, idx){
        d.classList.remove('active','done');
        if (idx < current) d.classList.add('done');
      });
      void dots[current].offsetWidth; // fuerza reflow para reiniciar la animación
      dots[current].classList.add('active');
    }

    function start(){
      stop();
      timer = setInterval(function(){ if (!paused) goTo((current + 1) % slides.length); }, DURATION);
    }
    function stop(){ if (timer) clearInterval(timer); }

    dots[0].classList.add('active');
    start();

    // pausa al pasar el ratón, reanuda al salir
    frame.addEventListener('mouseenter', function(){ paused = true; });
    frame.addEventListener('mouseleave', function(){ paused = false; });

    dots.forEach(function(dot, i){
      dot.addEventListener('click', function(){ goTo(i); start(); });
    });

    // flechas de anterior / siguiente
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    if (prevBtn) prevBtn.addEventListener('click', function(){ goTo((current - 1 + slides.length) % slides.length); start(); });
    if (nextBtn) nextBtn.addEventListener('click', function(){ goTo((current + 1) % slides.length); start(); });

    // deslizar con el dedo en móvil
    let touchStartX = null;
    frame.addEventListener('touchstart', function(e){ touchStartX = e.touches[0].clientX; }, { passive:true });
    frame.addEventListener('touchend', function(e){
      if (touchStartX === null) return;
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diff) > 40){
        if (diff < 0) goTo((current + 1) % slides.length);
        else goTo((current - 1 + slides.length) % slides.length);
        start();
      }
      touchStartX = null;
    }, { passive:true });
  })();


  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', function(){ navLinks.classList.toggle('open'); });
  navLinks.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ navLinks.classList.remove('open'); }); });

  // "Nuestro método": al pasar el ratón o el foco por un pilar, cambia la foto y el texto superpuesto
  (function(){
    const pillars = document.querySelectorAll('#methodPrinciples .method-principle');
    const frame = document.querySelector('.method-photo-frame');
    const caption = document.getElementById('methodCaption');
    if (!pillars.length || !frame) return;
    const captions = {
      nativos:  { tag: 'Profesores nativos', text: 'Formados específicamente para enseñar a niños — no solo para hablar el idioma.' },
      haciendo: { tag: 'Aprender haciendo', text: 'El inglés como herramienta para crear, no como examen que aprobar.' },
      ritmo:    { tag: 'Cada alumno tiene su ritmo', text: 'Grupos pequeños para que nadie se quede atrás ni se aburra.' }
    };
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

  // FAQ acordeón
  document.querySelectorAll('.faq-item').forEach(function(item){
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', function(){
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(openItem){
        if (openItem !== item){ openItem.classList.remove('open'); openItem.querySelector('.faq-a').style.maxHeight = null; }
      });
      if (isOpen){ item.classList.remove('open'); a.style.maxHeight = null; }
      else{ item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });


  // ---- navegación SPA: home <-> subpáginas de servicio ----
  const allViews = Array.from(document.querySelectorAll('.view'));
  const homeAnchors = ['inicio','servicios','destinos','testimonios','faq','contacto'];

  function showView(viewId, opts){
    opts = opts || {};
    allViews.forEach(function(v){ v.hidden = (v.id !== viewId); });
    if (!opts.keepScroll){ window.scrollTo({ top: 0, behavior: 'auto' }); }
    document.querySelectorAll('.svc-card2').forEach(function(c){
      c.classList.toggle('active', viewId === 'view-service-' + c.dataset.service);
    });
  }

  function isHomeVisible(){
    const home = document.getElementById('view-home');
    return home && !home.hidden;
  }

  function goToServicePage(key){
    showView('view-service-' + key);
    pushEvent('clic_cta', { cta_id: 'servicio-subpagina-' + key });
    history.replaceState(null, '', '#servicio-' + key);
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
      navLinks.classList.remove('open');
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

  // ---- formulario de inscripción al campamento ----
  (function(){
    const weekPrices = { 1:160, 2:240, 3:340, 4:430, 5:530 };
    const weekCheckboxes = document.querySelectorAll('.camp-week');
    const comedorCheckbox = document.getElementById('campComedor');
    const totalWeeksEl = document.getElementById('campTotalWeeks');
    const totalDetailEl = document.getElementById('campTotalDetail');
    const totalAmountEl = document.getElementById('campTotalAmount');
    if (!weekCheckboxes.length) return;

    function updateTotal(){
      const checked = Array.from(weekCheckboxes).filter(function(c){ return c.checked; });
      const n = checked.length;
      const basePrice = weekPrices[n] || 0;
      const comedorPrice = comedorCheckbox.checked ? 52 * n : 0;
      const total = basePrice + comedorPrice;

      totalWeeksEl.textContent = n + (n === 1 ? ' semana seleccionada' : ' semanas seleccionadas');
      if (n === 0){
        totalDetailEl.textContent = 'Selecciona al menos una semana';
      } else {
        const weekNums = checked.map(function(c){ return c.value; }).sort().join(', ');
        totalDetailEl.textContent = 'Semana(s) ' + weekNums + (comedorCheckbox.checked ? ' · con comedor' : ' · sin comedor');
      }
      totalAmountEl.textContent = total + '€';
    }

    weekCheckboxes.forEach(function(c){ c.addEventListener('change', updateTotal); });
    comedorCheckbox.addEventListener('change', updateTotal);
    updateTotal();

    const campForm = document.getElementById('campForm');
    const campFormMsg = document.getElementById('campFormMsg');

    // navegación de pasos del formulario de inscripción
    (function(){
      const steps = Array.from(campForm.querySelectorAll('.form-step'));
      const progressBar = document.getElementById('campFormProgressBar');
      const stepLabel = document.getElementById('campFormStepLabel');
      const labels = {
        1: 'Paso 1 de 3 · Elegid sede y semanas',
        2: 'Paso 2 de 3 · Datos del alumno/a',
        3: 'Paso 3 de 3 · Vuestros datos de contacto'
      };
      function goToStep(n){
        steps.forEach(function(s){ s.classList.toggle('active', +s.dataset.step === n); });
        progressBar.style.width = (n / steps.length * 100) + '%';
        stepLabel.textContent = labels[n];
      }

      const sedeSelect = document.getElementById('campSede');
      const step1NextBtn = document.getElementById('campStep1NextBtn');
      function updateStep1NextState(){
        const anyWeek = Array.from(weekCheckboxes).some(function(c){ return c.checked; });
        step1NextBtn.disabled = !(sedeSelect.value && anyWeek);
      }
      sedeSelect.addEventListener('change', updateStep1NextState);
      weekCheckboxes.forEach(function(c){ c.addEventListener('change', updateStep1NextState); });
      updateStep1NextState();
      step1NextBtn.addEventListener('click', function(){ goToStep(2); });

      const nombreInput = document.getElementById('campAlumnoNombre');
      const apellidosInput = document.getElementById('campAlumnoApellidos');
      const colegioSelect = document.getElementById('campColegio');
      const step2NextBtn = document.getElementById('campStep2NextBtn');
      function updateStep2NextState(){
        step2NextBtn.disabled = !(nombreInput.value.trim() && apellidosInput.value.trim() && colegioSelect.value);
      }
      [nombreInput, apellidosInput].forEach(function(el){ el.addEventListener('input', updateStep2NextState); });
      colegioSelect.addEventListener('change', updateStep2NextState);
      updateStep2NextState();
      step2NextBtn.addEventListener('click', function(){ goToStep(3); });

      document.getElementById('campStep2BackBtn').addEventListener('click', function(){ goToStep(1); });
      document.getElementById('campStep3BackBtn').addEventListener('click', function(){ goToStep(2); });
    })();

    campForm.addEventListener('submit', function(e){
      e.preventDefault();
      const checked = Array.from(weekCheckboxes).filter(function(c){ return c.checked; });
      if (checked.length === 0 || !campForm.checkValidity()){
        campForm.reportValidity();
        return;
      }
      const n = checked.length;
      const total = (weekPrices[n] || 0) + (comedorCheckbox.checked ? 52 * n : 0);
      pushEvent('lead_generado', {
        servicio: 'campamentos',
        semanas: checked.map(function(c){ return c.value; }).join(','),
        comedor: comedorCheckbox.checked,
        total: total
      });
      pushEvent('formulario_enviado', { servicio: 'campamentos-inscripcion' });
      campFormMsg.classList.add('show');
      campForm.querySelectorAll('input, select, textarea, button').forEach(function(el){ el.disabled = true; });
      campFormMsg.scrollIntoView({ behavior:'smooth', block:'center' });
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

  // cualquier enlace interno (#ancla) dentro de la home: si estamos en una subpágina, vuelve a home primero
  document.querySelectorAll('a[href^="#"]').forEach(function(link){
    if (link.hasAttribute('data-jump-service') || link.hasAttribute('data-back') || link.hasAttribute('data-cta-service')) return;
    const targetId = link.getAttribute('href').slice(1);
    if (!homeAnchors.includes(targetId)) return;
    link.addEventListener('click', function(e){
      if (!isHomeVisible()){
        e.preventDefault();
        showView('view-home');
        navLinks.classList.remove('open');
        requestAnimationFrame(function(){
          const target = document.getElementById(targetId);
          if (target) target.scrollIntoView({ behavior:'auto', block:'start' });
        });
      }
    });
  });

  // carga directa con hash tipo #servicio-campamentos
  (function(){
    const hash = window.location.hash.replace('#','');
    if (hash.indexOf('servicio-') === 0){
      const key = hash.replace('servicio-','');
      if (document.getElementById('view-service-' + key)){
        showView('view-service-' + key);
      }
    }
  })();

  document.querySelectorAll('[data-cta]').forEach(function(el){
    el.addEventListener('click', function(){ pushEvent('clic_cta', { cta_id: el.getAttribute('data-cta'), cta_text: el.textContent.trim() }); });
  });

  const form = document.getElementById('leadForm');
  const msg = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');

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
    const labels = { 1:'Paso 1 de 2 · ¿Qué os interesa?', 2:'Paso 2 de 2 · ¿Cómo os contactamos?' };

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
    pushEvent('lead_generado', { servicio: service, edad_alumno: studentAge });
    pushEvent('formulario_enviado', { servicio: service });
    msg.classList.add('show');
    submitBtn.disabled = true;
    form.querySelectorAll('input, select, textarea').forEach(function(el){ el.disabled = true; });
    msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
