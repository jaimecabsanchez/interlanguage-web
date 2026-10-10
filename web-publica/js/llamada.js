// ============================================================
//  Página del enlace de cancelación (llamada.html#id=…&t=…[&lang=en][&by=equipo])
//  Muestra la llamada y permite cancelarla (libera la hora, borra el evento y avisa).
//  El enlace secreto va tras «#» (no llega a ningún servidor ni a otras webs) y se quita de la barra de direcciones.
// ============================================================
(function(){
  'use strict';
  var KEY = 'il_llamada_enlace';
  var h = new URLSearchParams(location.hash.slice(1));
  var link = { id: h.get('id'), t: h.get('t'), lang: h.get('lang'), by: h.get('by') };
  if (link.id && link.t){
    try { sessionStorage.setItem(KEY, JSON.stringify(link)); } catch (e) {}
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  } else {
    try { link = JSON.parse(sessionStorage.getItem(KEY) || '{}') || {}; } catch (e) { link = {}; }
  }
  var en = link.lang === 'en';
  var by = link.by === 'equipo' ? 'equipo' : 'familia';
  var TXT = en ? {
    title: 'Your call', loading: 'Loading…', date: 'Date', time: 'Time', dur: 'Length', phone: 'Phone',
    minutes: function(n){ return n + ' minutes'; }, tz: '(Madrid time)', ends: function(d){ return 'ending in ' + d; },
    confirmed: 'Your call is booked. We will call you on the number you gave us.',
    cancelQ: "If you can't take the call, you can cancel it here and book another time.",
    cancelBtn: 'Cancel the call', cancelling: 'Cancelling…',
    sure: 'Are you sure you want to cancel this call? The time will become available to other families.', yes: 'Yes, cancel the call', keep: 'No, keep it',
    cancelled: 'The call has been cancelled. You can book another time whenever you like.',
    cancelledTeam: 'The call has been cancelled and the family will be notified.',
    already: 'This call has already been cancelled.', past: 'This call has already taken place.',
    notConfirmed: 'This booking was not confirmed.', invalid: 'This link is not valid or has expired.',
    tooLate: "It can no longer be cancelled: the call time has passed.",
    error: "We can't access your booking right now. Please try again in a few minutes or email us at info@interlanguage.es.",
    book: 'Book another time', back: 'Back to the website'
  } : {
    title: 'Tu llamada', loading: 'Cargando…', date: 'Fecha', time: 'Hora', dur: 'Duración', phone: 'Teléfono',
    minutes: function(n){ return n + ' minutos'; }, tz: '(hora de Madrid)', ends: function(d){ return 'acabado en ' + d; },
    confirmed: 'Tu llamada está reservada. Te llamaremos al número indicado.',
    cancelQ: 'Si no puedes atendernos, cancélala aquí y reserva otra hora.',
    cancelBtn: 'Cancelar la llamada', cancelling: 'Cancelando…',
    sure: '¿Seguro que quieres cancelar la llamada? La hora quedará libre para otras familias.', yes: 'Sí, cancelar la llamada', keep: 'No, mantenerla',
    cancelled: 'Se ha cancelado la llamada. Puedes reservar otra hora cuando quieras.',
    cancelledTeam: 'Se ha cancelado la llamada y la familia recibirá un aviso.',
    already: 'Esta llamada ya estaba cancelada.', past: 'Esta llamada ya ha pasado.',
    notConfirmed: 'Esta reserva no llegó a confirmarse.', invalid: 'Este enlace no es válido o ha caducado.',
    tooLate: 'Ya no se puede cancelar: la hora de la llamada ha pasado.',
    error: 'No podemos consultar la reserva ahora mismo. Inténtalo de nuevo en unos minutos o escríbenos a info@interlanguage.es.',
    book: 'Reservar otra hora', back: 'Volver a la web'
  };
  var $ = function(id){ return document.getElementById(id); };
  var text = $('cpText'), list = $('cpList'), err = $('cpError'), btn = $('cpCancel');
  if (en){
    document.documentElement.lang = 'en';
    document.title = 'Your call · Interlanguage Studies';
    $('cpTitle').textContent = TXT.title; $('cpDateL').textContent = TXT.date; $('cpTimeL').textContent = TXT.time;
    $('cpDurL').textContent = TXT.dur; $('cpPhoneL').textContent = TXT.phone; btn.textContent = TXT.cancelBtn;
    $('cpBook').textContent = TXT.book; $('cpBook').href = 'index-en.html#contacto';
    $('cpBack').textContent = TXT.back; $('cpBack').href = 'index-en.html'; $('cpHome').href = 'index-en.html';
  }
  function say(t, okStyle){ text.textContent = t; text.classList.toggle('is-ok', !!okStyle); }
  var CB = window.ilCallBooking;
  if (!CB || !CB.enabled || !link.id || !link.t){ say(TXT.invalid); return; }

  var locale = en ? 'en-GB' : 'es-ES';
  function show(b){
    var d = new Date(b.start);
    $('cpDate').textContent = new Intl.DateTimeFormat(locale, { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    $('cpTime').textContent = new Intl.DateTimeFormat(locale, { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d) + ' ' + TXT.tz;
    $('cpDur').textContent = TXT.minutes(b.durationMinutes || 30);
    $('cpPhone').textContent = TXT.ends(b.phoneEnd || '');
    list.hidden = false;
  }
  say(TXT.loading);
  CB.api.booking(link.id, link.t).then(function(res){
    var b = res.body || {};
    if (res.http === 404){ say(TXT.invalid); return; }
    if (res.http !== 200 || !b.booking){ say(TXT.error); return; }
    show(b.booking);
    if (b.status === 'cancelled'){ say(TXT.already); return; }
    if (b.status !== 'confirmed'){ say(TXT.notConfirmed); return; }
    if (!b.cancellable){ say(TXT.past); return; }
    say(TXT.confirmed + ' ' + TXT.cancelQ);
    btn.hidden = false;
  });
  // Dos pasos: un toque sin querer no cancela la llamada
  var armed = false;
  var keep = document.createElement('button');
  keep.type = 'button'; keep.className = 'camp-link-btn'; keep.textContent = TXT.keep; keep.hidden = true;
  btn.insertAdjacentElement('afterend', keep);
  var before = '';
  keep.addEventListener('click', function(){
    armed = false; keep.hidden = true; btn.textContent = TXT.cancelBtn; say(before); btn.focus();
  });
  btn.addEventListener('click', function(){
    if (btn.disabled) return;
    if (!armed){
      armed = true; before = text.textContent;
      say(TXT.sure); btn.textContent = TXT.yes; keep.hidden = false;
      return;
    }
    keep.hidden = true;
    btn.disabled = true; btn.textContent = TXT.cancelling;
    err.hidden = true;
    CB.api.cancel(link.id, link.t, by).then(function(res){
      var b = res.body || {};
      if (res.http === 200 && b.status === 'cancelled'){
        btn.hidden = true;
        say(b.already ? TXT.already : by === 'equipo' ? TXT.cancelledTeam : TXT.cancelled, true);
        try { sessionStorage.removeItem(KEY); } catch (e) {}
        $('cpTitle').focus();
        return;
      }
      btn.disabled = false; btn.textContent = TXT.yes; keep.hidden = false;
      err.textContent = b.status === 'too_late' ? TXT.tooLate : res.http === 404 ? TXT.invalid : TXT.error;
      err.hidden = false;
    });
  });
})();
