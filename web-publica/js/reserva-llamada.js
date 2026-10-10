// ============================================================
//  Reserva de llamadas · selector semanal de día y hora + cliente de la API
//
//  La API es la Edge Function «call-booking» de Supabase. Su dirección va en el HTML:
//     <meta name="il-llamadas-endpoint" content="https://<proyecto>.supabase.co/functions/v1/call-booking">
//  Vacía (como ahora) = la reserva no está activa y el formulario funciona como siempre.
//
//  Solo en el ordenador de desarrollo (localhost):
//     ?demo-llamadas        → modo demostración con horarios de ejemplo (no reserva nada, no envía correos)
//     ?llamadas-endpoint=…  → probar contra una API local
//  En la web publicada estos parámetros no hacen nada.
//
//  Expone window.ilCallBooking = { enabled, demo, api, mount(contenedor, opciones), longDate(fecha) }.
// ============================================================
(function(){
  'use strict';
  var LANG = (document.documentElement.lang || 'es').slice(0, 2) === 'en' ? 'en' : 'es';
  var LOCALE = LANG === 'en' ? 'en-GB' : 'es-ES';
  var TXT = {
    es: {
      prevWeek: 'Semana anterior', nextWeek: 'Semana siguiente', day: 'Día', hours: 'Horas disponibles', tz: 'Hora de Madrid',
      loading: 'Cargando horarios…', noHours: 'sin horas disponibles',
      freeHours: function(n){ return n === 1 ? '1 hora libre' : n + ' horas libres'; },
      hoursFor: function(n, day){ return (n === 1 ? '1 hora libre el ' : n + ' horas libres el ') + day + '.'; },
      weekEmpty: 'No quedan horas libres esta semana.', seeNext: 'Ver la semana siguiente',
      error: 'No podemos mostrar los horarios ahora mismo.', retry: 'Reintentar',
      off: 'La reserva de llamadas no está disponible en este momento.',
      gone: 'La hora que habías elegido ya no está libre. Elige otra.',
      demo: 'Modo demostración: horarios de ejemplo. No se reserva nada ni se envía ningún correo.'
    },
    en: {
      prevWeek: 'Previous week', nextWeek: 'Next week', day: 'Day', hours: 'Available times', tz: 'Madrid time',
      loading: 'Loading times…', noHours: 'no times available',
      freeHours: function(n){ return n === 1 ? '1 free time' : n + ' free times'; },
      hoursFor: function(n, day){ return (n === 1 ? '1 free time on ' : n + ' free times on ') + day + '.'; },
      weekEmpty: 'There are no free times left this week.', seeNext: 'See next week',
      error: "We can't show the available times right now.", retry: 'Try again',
      off: 'Call booking is not available at the moment.',
      gone: 'The time you had chosen is no longer free. Please choose another.',
      demo: 'Demo mode: sample times. Nothing is booked and no email is sent.'
    }
  }[LANG];

  // ---------- configuración ----------
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  function param(n){ try { return new URLSearchParams(location.search).get(n); } catch (e) { return null; } }
  var meta = document.querySelector('meta[name="il-llamadas-endpoint"]');
  var endpoint = meta ? (meta.getAttribute('content') || '').trim() : '';
  if (LOCAL && param('llamadas-endpoint')) endpoint = param('llamadas-endpoint');
  if (!/^https:\/\/[^\s]+$/.test(endpoint) && !(LOCAL && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/[^\s]*$/.test(endpoint))) endpoint = '';
  var demo = LOCAL && param('demo-llamadas') !== null;
  var enabled = !!endpoint || demo;

  // ---------- API ----------
  var demoReady = null;
  if (demo){
    demoReady = new Promise(function(resolve){
      var s = document.createElement('script');
      s.src = 'js/reserva-llamada-demo.js?v=1';
      s.onload = function(){ resolve(window.ilCallBookingDemo); };
      s.onerror = function(){ resolve(null); };
      document.head.appendChild(s);
    });
  }
  function request(method, params, body){
    if (demo){
      return demoReady.then(function(d){
        return d ? d.request(method, params, body) : { http: 0, body: { status: 'network' } };
      });
    }
    var url = endpoint + (params ? (endpoint.indexOf('?') === -1 ? '?' : '&') + new URLSearchParams(params).toString() : '');
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function(){ ctrl.abort(); }, 25000) : 0;
    var init = { method: method, credentials: 'omit', cache: 'no-store', signal: ctrl ? ctrl.signal : undefined };
    if (body){ init.headers = { 'Content-Type': 'application/json' }; init.body = JSON.stringify(body); }
    return fetch(url, init)
      .then(function(r){
        return r.json().catch(function(){ return {}; }).then(function(j){ return { http: r.status, body: j || {} }; });
      })
      .catch(function(){ return { http: 0, body: { status: 'network' } }; })
      .then(function(res){ if (timer) clearTimeout(timer); return res; });
  }
  var api = {
    availability: function(week){ var p = { action: 'availability' }; if (week) p.week = week; return request('GET', p); },
    book: function(payload){ var b = { action: 'book' }; for (var k in payload) b[k] = payload[k]; return request('POST', null, b); },
    booking: function(id, token){ return request('GET', { action: 'booking', id: id, t: token }); },
    cancel: function(id, token, by){ return request('POST', null, { action: 'cancel', id: id, token: token, by: by || 'familia' }); }
  };

  // ---------- fechas (las de la API vienen ya en hora de Madrid: AAAA-MM-DD) ----------
  function fmt(date, opts){
    var o = { timeZone: 'UTC' };
    for (var k in opts) o[k] = opts[k];
    return new Intl.DateTimeFormat(LOCALE, o).format(new Date(date + 'T12:00:00Z'));
  }
  function cap(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function longDay(date){ return fmt(date, { weekday: 'long', day: 'numeric', month: 'long' }); }
  function longDate(date){ return fmt(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }
  function monthLabel(a, b){
    var ma = fmt(a, { month: 'long', year: 'numeric' }), mb = fmt(b, { month: 'long', year: 'numeric' });
    if (ma === mb) return cap(ma);
    if (a.slice(0, 4) === b.slice(0, 4)) return cap(fmt(a, { month: 'long' })) + ' – ' + mb;
    return cap(ma) + ' – ' + mb;
  }
  function mondayOf(date){
    var d = new Date(date + 'T12:00:00Z');
    var wd = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() - wd + 1);
    return d.toISOString().slice(0, 10);
  }
  function el(tag, cls, text){
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  var ARROW_L = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ARROW_R = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var uid = 0;

  // ---------- selector ----------
  // opts.onChange(hueco | null) · opts.onState('loading' | 'ok' | 'empty' | 'error' | 'off')
  function mount(root, opts){
    opts = opts || {};
    var id = 'cb' + (++uid);
    var st = { status: 'idle', data: null, week: null, day: null, slot: null, seq: 0, jumped: false };
    root.classList.add('call-picker');
    root.innerHTML = '';
    if (demo) root.appendChild(el('p', 'call-demo', TXT.demo));
    var head = el('div', 'call-week');
    var prev = el('button', 'call-nav'); prev.type = 'button'; prev.setAttribute('aria-label', TXT.prevWeek); prev.innerHTML = ARROW_L;
    var next = el('button', 'call-nav'); next.type = 'button'; next.setAttribute('aria-label', TXT.nextWeek); next.innerHTML = ARROW_R;
    var month = el('p', 'call-month'); month.id = id + '-month'; month.setAttribute('aria-live', 'polite');
    head.appendChild(prev); head.appendChild(month); head.appendChild(next);
    var daysFs = el('fieldset', 'call-days');
    var daysLeg = el('legend', 'sr-only', TXT.day); daysFs.appendChild(daysLeg);
    var daysGrid = el('div', 'call-days-grid'); daysFs.appendChild(daysGrid);
    var timesFs = el('fieldset', 'call-times');
    var timesLeg = el('legend', 'call-times-title');
    timesLeg.appendChild(el('span', '', TXT.hours));
    timesLeg.appendChild(el('span', 'call-tz', TXT.tz));
    timesFs.appendChild(timesLeg);
    var timesGrid = el('div', 'call-times-grid'); timesFs.appendChild(timesGrid);
    var note = el('p', 'call-note'); note.setAttribute('role', 'status');
    var actions = el('div', 'call-actions');
    root.appendChild(head); root.appendChild(daysFs); root.appendChild(timesFs); root.appendChild(note); root.appendChild(actions);

    function setState(s){
      st.status = s;
      root.setAttribute('data-state', s);
      root.setAttribute('aria-busy', s === 'loading' ? 'true' : 'false');
      if (opts.onState) opts.onState(s);
    }
    function weekDays(){
      var d = st.data;
      if (!d) return [];
      var show = d.workdays && d.workdays.length ? d.workdays : [1, 2, 3, 4, 5, 6, 7];
      return d.days.filter(function(x){ return show.indexOf(x.weekday) !== -1; });
    }
    function dayData(date){
      var d = st.data;
      return d ? d.days.filter(function(x){ return x.date === date; })[0] : null;
    }
    function button(label, fn){
      var b = el('button', 'camp-link-btn', label); b.type = 'button';
      b.addEventListener('click', fn);
      actions.appendChild(b);
      return b;
    }
    function renderDays(){
      daysGrid.innerHTML = '';
      var days = weekDays();
      daysGrid.style.setProperty('--n', String(Math.max(days.length, 1)));
      days.forEach(function(d){
        var free = d.state === 'available' && d.slots.length > 0;
        var wrap = el('span', 'call-day' + (free ? '' : ' is-off'));
        var input = el('input'); input.type = 'radio'; input.name = id + '-day'; input.value = d.date; input.id = id + '-d-' + d.date;
        input.disabled = !free;
        input.checked = st.day === d.date;
        var label = el('label'); label.htmlFor = input.id;
        label.appendChild(el('span', 'call-dow', fmt(d.date, { weekday: 'short' }).replace('.', '')));
        label.appendChild(el('span', 'call-dnum', String(+d.date.slice(8))));
        label.appendChild(el('span', 'sr-only', ', ' + longDay(d.date) + ', ' + (free ? TXT.freeHours(d.slots.length) : TXT.noHours)));
        input.addEventListener('change', function(){
          if (!input.checked) return;
          st.day = d.date;
          renderTimes(true);
        });
        wrap.appendChild(input); wrap.appendChild(label);
        daysGrid.appendChild(wrap);
      });
    }
    function renderTimes(announce){
      timesGrid.innerHTML = '';
      var d = st.day ? dayData(st.day) : null;
      timesFs.hidden = !d || !d.slots.length;
      if (!d) return;
      d.slots.forEach(function(s){
        var wrap = el('span', 'call-time');
        var input = el('input'); input.type = 'radio'; input.name = id + '-time'; input.value = s.start; input.id = id + '-t-' + s.start.replace(/[^0-9]/g, '');
        input.checked = !!st.slot && st.slot.start === s.start;
        var label = el('label', '', s.time); label.htmlFor = input.id;
        input.addEventListener('change', function(){
          if (!input.checked) return;
          st.slot = { start: s.start, time: s.time, date: d.date };
          if (opts.onChange) opts.onChange(st.slot);
        });
        wrap.appendChild(input); wrap.appendChild(label);
        timesGrid.appendChild(wrap);
      });
      if (announce) note.textContent = TXT.hoursFor(d.slots.length, longDay(d.date));
    }
    function render(){
      actions.innerHTML = '';
      var s = st.status;
      var d = st.data;
      var showWeek = (s === 'ok' || s === 'empty' || s === 'loading') && !!d;
      head.hidden = !showWeek && s !== 'loading';
      daysFs.hidden = !d || s === 'error' || s === 'off';
      prev.disabled = s === 'loading' || !d || !d.week.prev;
      next.disabled = s === 'loading' || !d || !d.week.next;
      if (d){
        var days = d.days;
        month.textContent = monthLabel(days[0].date, days[days.length - 1].date);
      }
      if (s === 'loading'){
        note.textContent = TXT.loading;
        if (!d) timesFs.hidden = true;
        return;
      }
      if (s === 'error' || s === 'off'){
        timesFs.hidden = true;
        note.textContent = s === 'off' ? TXT.off : TXT.error;
        if (s === 'error') button(TXT.retry, function(){ load(st.week); });
        return;
      }
      renderDays();
      renderTimes(false);
      if (s === 'empty'){
        note.textContent = TXT.weekEmpty;
        if (d.week.next) button(TXT.seeNext, function(){ load(d.week.next); });
      } else {
        var dd = st.day ? dayData(st.day) : null;
        note.textContent = dd ? TXT.hoursFor(dd.slots.length, longDay(dd.date)) : '';
      }
    }
    function load(week){
      var seq = ++st.seq;
      var keepFocus = document.activeElement === prev || document.activeElement === next;
      setState('loading');
      render();
      return api.availability(week).then(function(res){
        if (seq !== st.seq) return st.status;
        var b = res.body || {};
        if (res.http === 200 && b.status === 'ok' && b.days && b.days.length){
          st.data = b; st.week = b.week.start;
          var avail = b.days.filter(function(x){ return x.state === 'available' && x.slots.length; });
          // la primera vez, si esta semana ya no tiene horas, salta a la primera semana con huecos
          if (!avail.length && !st.jumped && !week && b.firstAvailable && mondayOf(b.firstAvailable) !== b.week.start){
            st.jumped = true;
            return load(mondayOf(b.firstAvailable));
          }
          st.jumped = true;
          var keep = st.slot && st.slot.date >= b.days[0].date && st.slot.date <= b.days[b.days.length - 1].date ? st.slot.date : st.day;
          var keepDay = keep && avail.some(function(x){ return x.date === keep; }) ? keep : null;
          st.day = keepDay || (avail[0] ? avail[0].date : null);
          setState(avail.length ? 'ok' : 'empty');
        } else if (b.status === 'not_configured'){
          st.data = null; setState('off');
        } else {
          setState('error');
        }
        render();
        if (keepFocus && !prev.disabled && document.activeElement === document.body) prev.focus();
        return st.status;
      });
    }
    prev.addEventListener('click', function(){ if (st.data && st.data.week.prev) load(st.data.week.prev); });
    next.addEventListener('click', function(){ if (st.data && st.data.week.next) load(st.data.week.next); });

    return {
      load: load,
      // Vuelve a pedir la semana que se ve. Si la hora elegida ya no está libre, la quita y avisa.
      refresh: function(){
        var had = st.slot;
        var week = had ? mondayOf(had.date) : st.week;
        return load(week).then(function(status){
          if (!had) return true;
          var d = dayData(had.date);
          var still = !!d && d.slots.some(function(x){ return x.start === had.start; });
          if (!still){
            st.slot = null;
            render();
            note.textContent = TXT.gone;
            if (opts.onChange) opts.onChange(null);
          }
          return still && status === 'ok';
        });
      },
      selected: function(){ return st.slot; },
      clear: function(){ st.slot = null; render(); if (opts.onChange) opts.onChange(null); },
      status: function(){ return st.status; },
      focus: function(){
        var t = daysGrid.querySelector('input:checked') || daysGrid.querySelector('input:not(:disabled)') || prev;
        if (t) t.focus();
      },
      say: function(text){ note.textContent = text; }
    };
  }

  window.ilCallBooking = { enabled: enabled, demo: demo, api: api, mount: mount, longDate: longDate };
})();
