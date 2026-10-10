// ============================================================
//  SOLO DESARROLLO · Modo demostración de la reserva de llamadas
//  Lo carga js/reserva-llamada.js únicamente en localhost con ?demo-llamadas.
//  Los horarios son DE EJEMPLO (no son los de Interlanguage), no se reserva nada y no se envía ningún correo.
//     ?demo-llamadas=ocupado  → la primera confirmación responde «esa hora ya no está libre»
//     ?demo-llamadas=error    → la consulta de horarios falla
// ============================================================
(function(){
  'use strict';
  var TZ = 'Europe/Madrid';
  var HOURS = [['10:00', '13:30'], ['16:00', '19:00']];   // ejemplo para la demostración
  var WEEKS = 3, NOTICE_MIN = 120;
  var mode = (new URLSearchParams(location.search).get('demo-llamadas') || '').toLowerCase();
  var takenOnce = mode === 'ocupado';
  var booked = {};
  var fmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  function parts(ms){ var o = {}; fmt.formatToParts(new Date(ms)).forEach(function(p){ o[p.type] = p.value; }); return o; }
  function mDate(ms){ var p = parts(ms); return p.year + '-' + p.month + '-' + p.day; }
  function mTime(ms){ var p = parts(ms); return (p.hour === '24' ? '00' : p.hour) + ':' + p.minute; }
  function toUtc(date, time){
    var g = Date.parse(date + 'T' + time + ':00Z'), t = g;
    for (var i = 0; i < 2; i++){ var p = parts(t); t = g - (Date.parse(p.year + '-' + p.month + '-' + p.day + 'T' + (p.hour === '24' ? '00' : p.hour) + ':' + p.minute + ':00Z') - t); }
    return mDate(t) === date && mTime(t) === time ? t : null;
  }
  function addDays(d, n){ var x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); }
  function weekday(d){ return new Date(d + 'T12:00:00Z').getUTCDay() || 7; }
  function monday(d){ return addDays(d, 1 - weekday(d)); }
  function busy(date, time){   // ocupación de ejemplo, siempre la misma para cada fecha y hora
    var h = 0, s = date + time;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h % 5 === 0;
  }
  function availability(week){
    var now = Date.now(), today = mDate(now), last = addDays(today, WEEKS * 7 - 1);
    var first = monday(today), lastWeek = monday(last);
    var w = week && /^\d{4}-\d{2}-\d{2}$/.test(week) ? monday(week) : first;
    if (w < first) w = first;
    if (w > lastWeek) w = lastWeek;
    var days = [], firstAvailable = null;
    for (var d = first; d <= addDays(lastWeek, 6); d = addDays(d, 1)){
      var wd = weekday(d), slots = [], state;
      if (d < today) state = 'past';
      else if (d > last) state = 'outside';
      else if (wd > 5) state = 'closed';
      else {
        HOURS.forEach(function(r){
          for (var m = +r[0].slice(0, 2) * 60 + +r[0].slice(3); m + 30 <= +r[1].slice(0, 2) * 60 + +r[1].slice(3); m += 30){
            var t = String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
            var start = toUtc(d, t);
            if (start === null || start < now + NOTICE_MIN * 60000 || busy(d, t) || booked[start]) continue;
            slots.push({ start: new Date(start).toISOString(), time: t });
          }
        });
        state = slots.length ? 'available' : 'full';
      }
      if (state === 'available' && !firstAvailable) firstAvailable = d;
      if (d >= w && d <= addDays(w, 6)) days.push({ date: d, weekday: wd, state: state, slots: slots });
    }
    return { status: 'ok', timezone: TZ, slotMinutes: 30, workdays: [1, 2, 3, 4, 5],
      week: { start: w, prev: w > first ? addDays(w, -7) : null, next: w < lastWeek ? addDays(w, 7) : null },
      days: days, firstAvailable: firstAvailable, demo: true };
  }
  function later(v, ms){ return new Promise(function(r){ setTimeout(function(){ r(v); }, ms); }); }
  window.ilCallBookingDemo = {
    request: function(method, params, body){
      if (method === 'GET' && params && params.action === 'availability'){
        if (mode === 'error') return later({ http: 503, body: { status: 'unavailable' } }, 500);
        return later({ http: 200, body: availability(params.week) }, 350);
      }
      if (method === 'POST' && body && body.action === 'book'){
        if (takenOnce){ takenOnce = false; booked[Date.parse(body.slotStart)] = true; return later({ http: 409, body: { status: 'slot_taken' } }, 600); }
        var start = Date.parse(body.slotStart);
        booked[start] = true;
        return later({ http: 200, body: { status: 'confirmed', demo: true,
          booking: { id: 'demo', start: body.slotStart, date: mDate(start), time: mTime(start), durationMinutes: 30, phone: body.contact.phone },
          cancelUrl: '#demo', email: { family: 'pending_config', staff: 'pending_config' } } }, 700);
      }
      return later({ http: 400, body: { status: 'unknown_action' } }, 100);
    }
  };
})();
