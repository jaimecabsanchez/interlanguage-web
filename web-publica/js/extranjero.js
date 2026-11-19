/* Traducción al inglés (index-en.html): IL_T('texto en español') devuelve el texto en inglés si <html lang="en">.
   Los textos que recibe el equipo en el formulario se quedan en español. */
var IL_EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
var IL_TR = IL_EN ? {
"Reino Unido": "United Kingdom",
"Irlanda": "Ireland",
"Estados Unidos": "United States",
"Canadá": "Canada",
"Inglés": "English",
"Internado": "Boarding school",
"Currículos distintos en Inglaterra y Escocia": "Different curricula in England and Scotland",
"Tres trimestres: septiembre a julio (Inglaterra) o agosto a junio (Escocia)": "Three terms: September to July (England) or August to June (Scotland)",
"Europa · 1 h menos": "Europe · 1 h behind",
"Busca una vida de colegio organizada": "They want structured school life",
"Inglés, según centro": "English, depending on the school",
"Internado o familia anfitriona": "Boarding or host family",
"Junior Cycle, Senior Cycle y posible Transition Year": "Junior Cycle, Senior Cycle and a possible Transition Year",
"De finales de agosto o septiembre a mayo o junio": "Late August or September to May or June",
"Valora la vida en familia o en internado cerca de España": "They value family or boarding life close to Spain",
"Familia anfitriona o internado privado, según programa": "Host family or private boarding school, depending on the programme",
"Materias y créditos; requisitos por estado y distrito": "Subjects and credits; requirements by state and district",
"De agosto o septiembre a mayo o junio": "August or September to May or June",
"Transatlántico · Nueva York, 6 h menos*": "Transatlantic · New York, 6 h behind*",
"Tiene autonomía y curiosidad por la vida escolar norteamericana": "They are independent and curious about North American school life",
"Inglés o francés, según centro": "English or French, depending on the school",
"Familia anfitriona o colegio privado con alojamiento": "Host family or private school with accommodation",
"Currículo y diploma por provincia": "Curriculum and diploma by province",
"De septiembre a junio, a menudo en semestres": "September to June, often in semesters",
"Transatlántico · Toronto, 6 h menos*": "Transatlantic · Toronto, 6 h behind*",
"Quiere elegir bien provincia, idioma y entorno": "They want to choose the province, language and setting carefully",
"Idioma": "Language",
"Alojamiento": "Accommodation",
"Sistema": "System",
"Calendario": "Calendar",
"Distancia": "Distance",
"Puede encajar si…": "May suit them if…",
"Igual en los dos": "Same in both",
"Enviar y solicitar orientación": "Send and request guidance",
"Desarrollar sus talentos e intereses": "Develop their talents and interests",
"Deporte": "Sport",
"Fútbol": "Football",
"Tenis": "Tennis",
"Baloncesto": "Basketball",
"Natación": "Swimming",
"Otros deportes": "Other sports",
"Artes, comunicación y tecnología": "Arts, communication and technology",
"Música": "Music",
"Teatro e interpretación": "Drama and acting",
"Arte y creatividad": "Art and creativity",
"Hablar en público y comunicación": "Public speaking and communication",
"Tecnología y programación": "Technology and coding",
"Otros intereses": "Other interests",
"Edad al empezar": "Age at start",
"¿Qué edad tendrá vuestro hijo o hija al comenzar la experiencia?": "How old will your child be when the experience begins?",
"9–11 años": "Ages 9–11",
"12–14 años": "Ages 12–14",
"15–16 años": "Ages 15–16",
"17–18 años": "Ages 17–18",
"años": "years",
"Lo que buscáis": "What you are looking for",
"¿Qué os gustaría que aportara esta experiencia a vuestro hijo o hija?": "What would you like this experience to give your child?",
"Mejorar su inglés": "Improve their English",
"Ganar autonomía y confianza": "Gain independence and confidence",
"Descubrir otra cultura": "Discover another culture",
"Impulsar su formación académica": "Boost their academic development",
"Todavía estamos explorando": "We are still exploring",
"Estancia": "Stay",
"¿Cómo imagináis su estancia en el extranjero?": "How do you picture their stay abroad?",
"En un internado": "At a boarding school",
"Con una familia anfitriona": "With a host family",
"Estamos abiertos a ambas opciones": "We are open to both options",
"Preferimos que nos orientéis": "We would like your advice",
"Destinos": "Destinations",
"¿Qué destinos os interesan más?": "Which destinations interest you most?",
"Estamos abiertos a diferentes destinos": "We are open to different destinations",
"Duración": "Length of stay",
"¿Cuánto tiempo os gustaría que estudiara en el extranjero?": "How long would you like them to study abroad?",
"Un trimestre": "One term",
"Dos trimestres": "Two terms",
"Un curso completo": "A full school year",
"Todavía no lo sabemos": "We do not know yet",
"1 de 3 trimestres": "1 of 3 terms",
"2 de 3 trimestres": "2 of 3 terms",
"Los 3 trimestres": "All 3 terms",
"Lo vemos juntos": "We will decide together",
"Lo antes posible": "As soon as possible",
"Curso 2027-2028": "2027–28 school year",
"Curso 2028-2029": "2028–29 school year",
"Más adelante": "Later on",
"Vuestros datos": "Your details",
"Volver a: ": "Back to: ",
"Pasos del cuestionario": "Questionnaire steps",
"¿Preferís hablar con nosotros? <b>Reservad una llamada</b>": "Prefer to talk to us? <b>Book a call</b>",
"¿Qué le interesa? <small>Podéis elegir varias · opcional</small>": "What are they interested in? <small>Choose as many as you like · optional</small>",
"Vuestras respuestas": "Your answers",
"Cambiar: ": "Change: ",
"Cambiar": "Change",
"Podéis elegir varias": "Choose as many as you like",
"Elegid una opción": "Choose an option",
"Elegid una": "Choose one",
"Anterior": "Back",
"Siguiente": "Next",
"Ya conocemos un poco mejor lo que estáis buscando": "Now we have a better idea of what you are looking for",
"Dejadnos vuestros datos y os preparamos una primera orientación.": "Leave us your details and we will prepare some initial guidance.",
"Nombre del padre, madre o tutor": "Name of parent or guardian",
"Escribid vuestro nombre.": "Please enter your name.",
"Correo electrónico": "Email",
"Revisad el correo: parece incompleto.": "Please check the email address: it looks incomplete.",
"Teléfono para la llamada": "Phone number for the call",
"Teléfono": "Phone",
"(opcional)": "(optional)",
"Revisad el teléfono (mínimo 9 cifras).": "Please check the phone number (at least 9 digits).",
"¿Cuándo os gustaría empezar?": "When would you like to start?",
"Comentarios": "Comments",
"Curso actual, nivel de inglés, dudas…": "Current school year, English level, questions…",
"He leído la": "I have read the",
"política de privacidad": "privacy policy",
"y acepto que uséis mis datos para responder a esta consulta.": "and agree to my details being used to reply to this enquiry.",
"Para enviarlo, aceptad la política de privacidad.": "To send it, please accept the privacy policy.",
"Para seguir, aceptad la política de privacidad.": "To continue, please accept the privacy policy.",
"Gracias, ": "Thank you, ",
"Ya tenemos vuestras respuestas.": "We have your answers.",
"Están guardadas: no hace falta volver a escribirlas. ¿Cómo preferís seguir?": "They are saved, so there is no need to type them again. How would you like to continue?",
"Cómo seguir": "How to continue",
"Reservar una llamada": "Book a call",
"Elegid día y hora para hablar con nosotros. 30 minutos, sin compromiso.": "Choose a day and time to talk to us. 30 minutes, no commitment.",
"Prefiero que me contactéis": "I would rather you contacted me",
"Una persona del equipo revisa vuestro caso y os escribe o llama personalmente.": "A member of our team reviews your case and emails or calls you personally.",
"Perfecto. Nos ponemos en contacto con vosotros.": "Perfect. We will be in touch.",
"Una persona del equipo revisará vuestras respuestas y os escribirá a ": "A member of our team will review your answers and email you at ",
" o os llamará al ": " or call you on ",
"Elegid el día y la hora en nuestro calendario de llamadas: se abre en una pestaña nueva. Si queréis, después podéis volver y terminar el cuestionario.": "Choose the day and time in our call calendar: it opens in a new tab. If you like, you can come back afterwards and finish the questionnaire.",
"Elegid día y hora y os llamamos. 30 minutos, sin compromiso. No hace falta terminar el cuestionario: lo que ya hayáis contestado nos llega con la reserva.": "Choose a day and time and we will call you. 30 minutes, no commitment. You do not need to finish the questionnaire: whatever you have already answered reaches us with the booking.",
"Elegid día y hora": "Choose a day and time",
"Se abre nuestro calendario de llamadas en una pestaña nueva. Vuestras respuestas ya nos han llegado.": "Our call calendar opens in a new tab. We have already received your answers.",
"Ver horas libres": "See available times",
"Prefiero que me llaméis vosotros": "I would rather you called me",
"Reserva de llamada": "Call booking",
"La reserva en línea todavía no está disponible. Vuestras respuestas ya nos han llegado: os escribimos para acordar el día y la hora de la llamada.": "Online booking is not available yet. We have already received your answers: we will email you to agree a day and time for the call.",
"De acuerdo, esperamos vuestro contacto": "Fine, we will wait to hear from you",
"¿Cuándo os viene bien que hablemos?": "When would be a good time to talk?",
"Elegid un día y una hora. Os llamaremos al número que indiquéis. 30 minutos, sin compromiso.": "Choose a day and a time. We will call you on the number you give us. 30 minutes, no commitment.",
"Elegid un día y una hora.": "Choose a day and a time.",
"Necesitamos un teléfono (mínimo 9 cifras).": "We need a phone number (at least 9 digits).",
"Día y hora de la llamada": "Day and time of the call",
"Confirmar llamada": "Confirm call",
"Ninguna hora me va bien: llamadme vosotros": "None of these times suits me: please call me",
"Confirmando…": "Confirming…",
"Llamada reservada": "Call booked",
"Demostración: no se ha reservado nada.": "Demo: nothing has been booked.",
"Esa hora ya no está libre. Elegid otra.": "That time is no longer available. Please choose another.",
"No hemos podido reservar la llamada. Vuestras respuestas ya nos han llegado: podéis intentarlo de nuevo o esperar a que os contactemos.": "We could not book the call. We have already received your answers: you can try again or wait for us to contact you.",
"Volver al cuestionario": "Back to the questionnaire",
"Reservad una llamada": "Book a call",
"Os llamamos nosotros": "We will call you",
"Todavía no podéis elegir la hora en línea. Dejadnos vuestro teléfono y el momento del día que mejor os venga, y os llamamos. No hace falta terminar el cuestionario: lo que ya hayáis contestado nos llega con vuestra petición.": "You cannot choose a time online yet. Leave us your phone number and the time of day that suits you best, and we will call you. You do not need to finish the questionnaire: whatever you have already answered reaches us with your request.",
"¿Cuándo os viene mejor?": "When suits you best?",
"Por la mañana": "In the morning",
"A mediodía": "Around midday",
"Por la tarde": "In the afternoon",
"Cualquier momento": "Any time",
"Pedir que nos llaméis": "Request a call",
"Recibido. Os llamamos nosotros.": "Received. We will call you.",
"Una persona del equipo os llamará al ": "A member of our team will call you on ",
"Enviando…": "Sending…",
"No hemos podido enviar vuestra petición. Revisad la conexión y volved a intentarlo, o escribidnos a info@interlanguage.es.": "We could not send your request. Please check your connection and try again, or email us at info@interlanguage.es.",
"No hemos podido enviar vuestras respuestas. Revisad la conexión y volved a intentarlo; lo que habéis escrito se conserva. También podéis escribirnos a info@interlanguage.es.": "We could not send your answers. Please check your connection and try again; what you have written is kept. You can also email us at info@interlanguage.es.",
"Paso": "Step",
"de": "of",
"Os llamaremos el": "We will call you on",
"a las": "at",
"(hora de Madrid) al": "(Madrid time) on",
"Alumnos con bata en un laboratorio": "Pupils in lab coats in a laboratory",
"Laboratorio": "Laboratory",
"Aprender": "Learn",
"Alumnos atendiendo en clase": "Pupils paying attention in class",
"Clases": "Lessons",
"Alumnos en una clase de ciencias": "Pupils in a science lesson",
"Ciencias": "Science",
"Alumnos montando un robot": "Pupils building a robot",
"Robótica": "Robotics",
"Cuatro alumnas sonriendo juntas": "Four girls smiling together",
"Amistades": "Friendships",
"Convivir": "Live together",
"Sala común de un internado con sofás y una mesa de billar": "A boarding-school common room with sofas and a pool table",
"Sala común": "Common room",
"Alumnas cocinando": "Girls cooking",
"Cocina": "Cooking",
"Grupo de alumnos en una excursión": "A group of pupils on an excursion",
"Excursiones": "Excursions",
"Descubrir": "Discover",
"Alumnas remando en un lago": "Girls rowing on a lake",
"Remo": "Rowing",
"Alumno jugando al golf": "A pupil playing golf",
"Alumno chutando un balón de rugby": "A pupil kicking a rugby ball",
"Crecer": "Grow",
"Alumna tocando el piano con su profesora": "A girl playing the piano with her teacher",
"Alumnos tocando en una orquesta": "Pupils playing in an orchestra",
"Orquesta": "Orchestra"
} : {};
function IL_T(s){ return IL_TR[s] || s; }
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
  var P = [{"src": "images/internacional/extranjero-lab-1200.webp", "alt": "Alumnos con bata en un laboratorio", "cap": "Laboratorio", "cat": "Aprender"}, {"src": "images/internacional/ext-us-aula-1000.webp", "alt": "Alumnos atendiendo en clase", "cap": "Clases", "cat": "Aprender"}, {"src": "images/internacional/ext-gal-ciencias-1000.webp", "alt": "Alumnos en una clase de ciencias", "cap": "Ciencias", "cat": "Aprender"}, {"src": "images/internacional/ext-gal-robotica-1000.webp", "alt": "Alumnos montando un robot", "cap": "Robótica", "cat": "Aprender"}, {"src": "images/internacional/extranjero-alumnas-1122.webp", "alt": "Cuatro alumnas sonriendo juntas", "cap": "Amistades", "cat": "Convivir"}, {"src": "images/internacional/sala-comun-900.webp", "alt": "Sala común de un internado con sofás y una mesa de billar", "cap": "Sala común", "cat": "Convivir"}, {"src": "images/internacional/ext-gal-cocina-1000.webp", "alt": "Alumnas cocinando", "cap": "Cocina", "cat": "Convivir"}, {"src": "images/internacional/extranjero-grupo-1448.webp", "alt": "Grupo de alumnos en una excursión", "cap": "Excursiones", "cat": "Descubrir"}, {"src": "images/internacional/ext-gal-remo-1000.webp", "alt": "Alumnas remando en un lago", "cap": "Remo", "cat": "Descubrir"}, {"src": "images/internacional/reino-unido-golf-1000.webp", "alt": "Alumno jugando al golf", "cap": "Golf", "cat": "Descubrir"}, {"src": "images/internacional/ext-duo-rugby-1080.webp", "alt": "Alumno chutando un balón de rugby", "cap": "Rugby", "cat": "Crecer"}, {"src": "images/internacional/ext-gal-piano-1000.webp", "alt": "Alumna tocando el piano con su profesora", "cap": "Piano", "cat": "Crecer"}, {"src": "images/internacional/ext-gal-orquesta-1000.webp", "alt": "Alumnos tocando en una orquesta", "cap": "Orquesta", "cat": "Crecer"}];
  P.forEach(function(p){ p.alt = IL_T(p.alt); p.cap = IL_T(p.cap); p.cat = IL_T(p.cat); });
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
    uk: { n: IL_T('Reino Unido'), c: 'var(--c-uk)', s: '', r: [IL_T('Inglés'), IL_T('Internado'), IL_T('Currículos distintos en Inglaterra y Escocia'), IL_T('Tres trimestres: septiembre a julio (Inglaterra) o agosto a junio (Escocia)'), IL_T('Europa · 1 h menos'), IL_T('Busca una vida de colegio organizada')] },
    ie: { n: IL_T('Irlanda'), c: 'var(--c-ie)', s: '', r: [IL_T('Inglés, según centro'), IL_T('Internado o familia anfitriona'), IL_T('Junior Cycle, Senior Cycle y posible Transition Year'), IL_T('De finales de agosto o septiembre a mayo o junio'), IL_T('Europa · 1 h menos'), IL_T('Valora la vida en familia o en internado cerca de España')] },
    us: { n: IL_T('Estados Unidos'), c: 'var(--c-us)', s: '', r: [IL_T('Inglés'), IL_T('Familia anfitriona o internado privado, según programa'), IL_T('Materias y créditos; requisitos por estado y distrito'), IL_T('De agosto o septiembre a mayo o junio'), IL_T('Transatlántico · Nueva York, 6 h menos*'), IL_T('Tiene autonomía y curiosidad por la vida escolar norteamericana')] },
    ca: { n: IL_T('Canadá'), c: 'var(--c-ca)', s: '', r: [IL_T('Inglés o francés, según centro'), IL_T('Familia anfitriona o colegio privado con alojamiento'), IL_T('Currículo y diploma por provincia'), IL_T('De septiembre a junio, a menudo en semestres'), IL_T('Transatlántico · Toronto, 6 h menos*'), IL_T('Quiere elegir bien provincia, idioma y entorno')] }
  };
  var K = [IL_T('Idioma'), IL_T('Alojamiento'), IL_T('Sistema'), IL_T('Calendario'), IL_T('Distancia'), IL_T('Puede encajar si…')];
  /* dos paneles, uno por país: foto y color propios; cada dato lleva su etiqueta dentro del panel y las filas quedan alineadas.
     Si los dos países coinciden en un dato, se marca «Igual en los dos» para que salten a la vista las diferencias. */
  var PHOTO = { uk: 'uk-campus', ie: 'ie-campus', us: 'us-campus', ca: 'ca-campus' };
  var KI = [
    '<path d="M4 5.5h12.5a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H10l-4 3.5v-3.5H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"/>',
    '<path d="M3.5 11.5L12 4.5l8.5 7"/><path d="M6 10v10.5h12V10"/>',
    '<path d="M2 9.5L12 5l10 4.5L12 14z"/><path d="M6 11.5v4.6c1.7 1.6 3.7 2.4 6 2.4s4.3-.8 6-2.4v-4.6"/>',
    '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    '<path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10z"/>'
  ];
  var ki = function(i){ return '<svg viewBox="0 0 24 24" aria-hidden="true">' + KI[i] + '</svg>'; };
  var sa = $('#cmpA', root), sb = $('#cmpB', root), tb = $('#cmpTable', root);
  if (sa && sb && tb) {
    Object.keys(D).forEach(function(k){ sa.add(new Option(D[k].n, k)); sb.add(new Option(D[k].n, k)); });
    sa.value = 'uk'; sb.value = 'ie';
    var render = function(){
      var ka = sa.value, kb = sb.value, a = D[ka], b = D[kb];
      sa.parentNode.style.setProperty('--c', a.c); sb.parentNode.style.setProperty('--c', b.c);
      tb.style.setProperty('--ca', a.c); tb.style.setProperty('--cb', b.c);
      var head = function(k, d, side){
        return '<div class="cx-h cx-' + side + '"><img src="images/internacional/' + PHOTO[k] + '-480.webp" srcset="images/internacional/' + PHOTO[k] + '-480.webp 480w, images/internacional/' + PHOTO[k] + '-960.webp 960w" sizes="(max-width:700px) 46vw, 560px" alt="" loading="lazy" decoding="async"><span class="cx-name">' + d.n + '</span></div>';
      };
      var h = head(ka, a, 'a') + head(kb, b, 'b');
      K.forEach(function(k, i){
        var same = a.r[i] === b.r[i], last = i === K.length - 1;
        ['a', 'b'].forEach(function(side){
          var d = side === 'a' ? a : b;
          h += '<div class="cx-c cx-' + side + (same ? ' is-same' : '') + (last ? ' is-fit' : '') + '"><span class="cx-l">' + ki(i) + k + (same ? '<em>' + IL_T('Igual en los dos') + '</em>' : '') + '</span><p>' + d.r[i] + '</p></div>';
        });
      });
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

  /* ---------- «Así se vive la experiencia»: carrusel centrado (vecinas a los lados, da la vuelta) ---------- */
  (function(){
    var xv = $('.xv', root);
    if (!xv) return;
    var its = $$('.xv-it', xv), n = its.length, cur = 0, tabs = $$('.xv-tab', root), num = $('#xvN');
    var cats = its.map(function(it){ var s = $('figcaption span', it); return s ? s.textContent : ''; });
    function draw(){
      its.forEach(function(it, i){
        var o = ((i - cur) % n + n) % n; if (o > n / 2) o -= n;
        it.style.setProperty('--o', o);
        it.classList.toggle('is-on', o === 0);
        it.classList.toggle('is-far', Math.abs(o) > 2);
        it.setAttribute('aria-hidden', o === 0 ? 'false' : 'true');
        var b = $('.ph-open', it); if (b) b.tabIndex = o === 0 ? 0 : -1;
      });
      if (num) num.textContent = cur + 1;
      tabs.forEach(function(t){ t.setAttribute('aria-current', t.textContent === cats[cur] ? 'true' : 'false'); });
    }
    function go(i){ cur = ((i % n) + n) % n; draw(); }
    $$('[data-xv]', xv).forEach(function(b){ b.addEventListener('click', function(){ go(cur + (b.getAttribute('data-xv') === 'next' ? 1 : -1)); }); });
    tabs.forEach(function(t){ t.addEventListener('click', function(){ go(+t.getAttribute('data-go')); }); });
    xv.addEventListener('keydown', function(e){ if (e.key === 'ArrowRight') { go(cur + 1); e.preventDefault(); } else if (e.key === 'ArrowLeft') { go(cur - 1); e.preventDefault(); } });
    /* arrastrar (ratón) o deslizar (dedo); si se ha movido, el toque no abre el visor */
    var down = false, moved = false, sx = 0, dx = 0;
    xv.addEventListener('pointerdown', function(e){
      if (e.button !== 0 || e.target.closest('.xv-btn')) return;
      down = true; moved = false; sx = e.clientX; dx = 0;
    });
    xv.addEventListener('pointermove', function(e){
      if (!down) return;
      dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 8) { moved = true; xv.classList.add('is-drag'); try { xv.setPointerCapture(e.pointerId); } catch (_) {} }
      if (moved) xv.style.setProperty('--dx', dx + 'px');
    });
    function end(){
      if (!down) return; down = false;
      if (!moved) return;
      xv.classList.remove('is-drag'); xv.style.setProperty('--dx', '0px');
      var on = $('.xv-it.is-on', xv), w = on ? on.getBoundingClientRect().width : 300;
      if (Math.abs(dx) > 40) go(cur - (dx < 0 ? -1 : 1) * Math.max(1, Math.round(Math.abs(dx) / w)));
      setTimeout(function(){ moved = false; }, 0);
    }
    xv.addEventListener('pointerup', end);
    xv.addEventListener('pointercancel', end);
    /* tocar una foto lateral la trae al centro; la del centro abre el visor */
    xv.addEventListener('click', function(e){
      if (moved) { e.preventDefault(); e.stopPropagation(); return; }
      var it = e.target.closest('.xv-it');
      if (it && !it.classList.contains('is-on')) { e.preventDefault(); e.stopPropagation(); go(+it.getAttribute('data-n')); }
    }, true);
    xv.addEventListener('dragstart', function(e){ e.preventDefault(); });
    draw();
  })();

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
   - Envío: mismo destino y campos que la consulta de la web (Netlify Forms, formulario «consulta»; ver sendForm en main.js). Después: reservar llamada
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
  var SEND = IL_T('Enviar y solicitar orientación');

  var TALENT = IL_T('Desarrollar sus talentos e intereses');
  var INTERESTS = [
    { g: IL_T('Deporte'), o: [IL_T('Fútbol'), IL_T('Tenis'), 'Rugby', IL_T('Baloncesto'), IL_T('Natación'), IL_T('Otros deportes')] },
    { g: IL_T('Artes, comunicación y tecnología'), o: [IL_T('Música'), IL_T('Teatro e interpretación'), IL_T('Arte y creatividad'), IL_T('Hablar en público y comunicación'), IL_T('Tecnología y programación'), IL_T('Otros intereses')] }
  ];
  var Q = [
    { k: 'edad', label: IL_T('Edad al empezar'), t: IL_T('¿Qué edad tendrá vuestro hijo o hija al comenzar la experiencia?'), multi: false, cols: 4, o: [
      { v: IL_T('9–11 años'), big: '9–11' }, { v: IL_T('12–14 años'), big: '12–14' }, { v: IL_T('15–16 años'), big: '15–16' }, { v: IL_T('17–18 años'), big: '17–18' } ] },
    { k: 'objetivos', label: IL_T('Lo que buscáis'), t: IL_T('¿Qué os gustaría que aportara esta experiencia a vuestro hijo o hija?'), multi: true, cols: 3, o: [
      { v: IL_T('Mejorar su inglés'), ic: 'talk' }, { v: IL_T('Ganar autonomía y confianza'), ic: 'pack' }, { v: IL_T('Descubrir otra cultura'), ic: 'globe' },
      { v: IL_T('Impulsar su formación académica'), ic: 'cap' }, { v: TALENT, ic: 'star', sub: true }, { v: IL_T('Todavía estamos explorando'), ic: 'compass', solo: true } ] },
    { k: 'estancia', label: IL_T('Estancia'), t: IL_T('¿Cómo imagináis su estancia en el extranjero?'), multi: false, cols: 4, o: [
      { v: IL_T('En un internado'), ic: 'school' }, { v: IL_T('Con una familia anfitriona'), ic: 'house' }, { v: IL_T('Estamos abiertos a ambas opciones'), ic: 'both' }, { v: IL_T('Preferimos que nos orientéis'), ic: 'chat' } ] },
    { k: 'destinos', label: IL_T('Destinos'), t: IL_T('¿Qué destinos os interesan más?'), multi: true, cols: 5, o: [
      { v: IL_T('Reino Unido'), img: 'uk-campus-480.webp' }, { v: IL_T('Irlanda'), img: 'ie-campus-480.webp' }, { v: IL_T('Estados Unidos'), img: 'us-campus-480.webp' },
      { v: IL_T('Canadá'), img: 'ca-campus-480.webp' }, { v: IL_T('Estamos abiertos a diferentes destinos'), ic: 'globe', thumbIc: true, solo: true } ] },
    { k: 'duracion', label: IL_T('Duración'), t: IL_T('¿Cuánto tiempo os gustaría que estudiara en el extranjero?'), multi: false, cols: 4, o: [
      { v: IL_T('Un trimestre'), seg: 1, cap: IL_T('1 de 3 trimestres') }, { v: IL_T('Dos trimestres'), seg: 2, cap: IL_T('2 de 3 trimestres') }, { v: IL_T('Un curso completo'), seg: 3, cap: IL_T('Los 3 trimestres') }, { v: IL_T('Todavía no lo sabemos'), seg: 0, cap: IL_T('Lo vemos juntos') } ] }
  ];
  var STARTS = [IL_T('Lo antes posible'), IL_T('Curso 2027-2028'), IL_T('Curso 2028-2029'), IL_T('Más adelante'), IL_T('Todavía no lo sabemos')];
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
  /* progreso con el nombre de cada paso; los pasos hechos se pueden pulsar para volver a ellos */
  var STEP_LABELS = Q.map(function(q){ return q.label; }).concat(IL_T('Vuestros datos'));
  var PHONE = '<svg class="ic" aria-hidden="true" viewBox="0 0 24 24"><path d="M6.6 3.5h2.6l1.5 4-2 1.3a11 11 0 0 0 5.5 5.5l1.3-2 4 1.5v2.6a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"/></svg>';
  function bar(){
    var n = Math.min(step, Q.length) + 1, segs = '';
    for (var i = 1; i <= TOTAL; i++) {
      var lab = '<i></i><span>' + STEP_LABELS[i - 1] + '</span>';
      segs += '<li class="' + (i < n ? 'done' : i === n ? 'now' : '') + '"' + (i === n ? ' aria-current="step"' : '') + '>' +
        (i < n ? '<button type="button" data-go="' + (i - 1) + '" aria-label="' + IL_T('Volver a: ') + STEP_LABELS[i - 1] + '">' + lab + '</button>' : lab) + '</li>';
    }
    return '<div class="qz-top"><div class="qz-prog"><p class="qz-count">' + IL_T('Paso') + ' ' + n + ' ' + IL_T('de') + ' ' + TOTAL + '<span class="qz-count-l"> · ' + STEP_LABELS[n - 1] + '</span></p>' +
      '<ol class="qz-steps" aria-label="' + IL_T('Pasos del cuestionario') + '">' + segs + '</ol></div>' +
      '<button type="button" class="qz-callcta" data-act="call">' + PHONE + '<span>' + IL_T('¿Preferís hablar con nosotros? <b>Reservad una llamada</b>') + '</span></button></div>';
  }
  function tile(q, o){
    var on = A[q.k].indexOf(o.v) >= 0, inner, cls = 'tile';
    if (o.img) { inner = '<span class="thumb"><img src="' + IMG + o.img + '" alt="" loading="lazy" width="480" height="300"></span><b>' + o.v + '</b>' + (o.note ? '<small class="tnote">' + o.note + '</small>' : ''); cls += ' is-thumb'; }
    else if (o.thumbIc) { inner = '<span class="thumb thumb--ic">' + svg(o.ic) + '</span><b>' + o.v + '</b>'; cls += ' is-thumb'; }
    else if (o.big) { inner = '<span class="big">' + o.big + '</span><span class="sub">' + IL_T('años') + '</span>'; cls += ' is-age'; }
    else if (o.seg !== undefined) { inner = '<span class="tl' + (o.seg ? '' : ' tl--open') + '" aria-hidden="true">' + [1, 2, 3].map(function(n){ return '<i class="' + (n <= o.seg ? 'on' : '') + '"></i>'; }).join('') + '</span><b>' + o.v + '</b><small class="tnote">' + o.cap + '</small>'; cls += ' is-time'; }
    else { inner = svg(o.ic) + '<b>' + o.v + '</b>'; cls += ' is-ic'; }
    return '<button type="button" class="' + cls + '"' + (q.multi ? ' data-multi' : '') + ' aria-pressed="' + on + '" data-v="' + esc(o.v) + '"' + (o.big ? ' aria-label="' + o.v + '"' : '') + (o.sub ? ' aria-controls="qzSub" aria-expanded="' + on + '"' : '') + '>' + TICK + inner + '</button>';
  }
  function chips(){
    var open = A.objetivos.indexOf(TALENT) >= 0;
    return '<div class="qz-sub' + (open ? ' is-open' : '') + '" id="qzSub"' + (open ? '' : ' inert') + '><div class="qz-sub-in"><div class="qz-sub-box">' +
      '<p class="qz-sub-t">' + IL_T('¿Qué le interesa? <small>Podéis elegir varias · opcional</small>') + '</p>' +
      INTERESTS.map(function(g){ return '<div class="qz-chips" role="group" aria-label="' + g.g + '"><span class="qz-chips-g">' + g.g + '</span>' +
        g.o.map(function(v){ return '<button type="button" class="chip" data-chip="' + esc(v) + '" aria-pressed="' + (I.indexOf(v) >= 0) + '">' + v + '</button>'; }).join('') + '</div>'; }).join('') +
      '</div></div></div>';
  }
  function summary(){
    return '<aside class="qz-sum" aria-labelledby="qzSumT"><h4 id="qzSumT">' + IL_T('Vuestras respuestas') + '</h4><ol>' + Q.map(function(q, i){
      var vals = A[q.k].slice(), extra = '';
      if (q.k === 'objetivos' && talents().length) extra = '<span class="qz-sum-sub">' + talents().map(function(t){ return '<em>' + esc(t) + '</em>'; }).join('') + '</span>';
      return '<li><span class="qz-sum-k">' + q.label + '</span><span class="qz-sum-v">' + vals.map(function(v){ return '<span>' + esc(v) + '</span>'; }).join('') + extra + '</span><button type="button" class="qz-sum-edit" data-go="' + i + '" aria-label="' + IL_T('Cambiar: ') + q.label + '">' + IL_T('Cambiar') + '</button></li>';
    }).join('') + '</ol></aside>';
  }
  function draw(focus){
    if (sent) return;
    var cls = 'qz-step' + (dir < 0 ? ' is-back' : '');
    if (step < Q.length) {
      var q = Q[step];
      var tcls = 'tiles' + (q.cols === 4 ? ' tiles--4' : q.cols === 5 ? ' tiles--5' : '');
      qz.innerHTML = bar() + '<div class="' + cls + '"><div class="qz-q"><h3 tabindex="-1">' + q.t + '</h3><small>' + (q.multi ? IL_T('Podéis elegir varias') : IL_T('Elegid una')) + '</small></div>' +
        '<div class="' + tcls + '" role="group" aria-label="' + esc(q.t) + '">' + q.o.map(function(o){ return tile(q, o); }).join('') + '</div>' +
        (q.k === 'objetivos' ? chips() : '') +
        '<div class="qz-nav"><button type="button" class="qz-back" data-act="back"' + (step ? '' : ' disabled') + '>' + BACK + IL_T('Anterior') + '</button>' +
        '<button type="button" class="btn-primary qz-next" data-act="next"' + (A[q.k].length ? '' : ' disabled') + '>' + IL_T('Siguiente') + ' ' + ARROW + '</button></div></div>';
    } else {
      finalShownAt = Date.now();
      qz.innerHTML = bar() + '<div class="' + cls + '"><div class="qz-q qz-q--final"><h3 tabindex="-1">' + IL_T('Ya conocemos un poco mejor lo que estáis buscando') + '</h3><p>' + IL_T('Dejadnos vuestros datos y os preparamos una primera orientación.') + '</p></div>' +
        '<div class="qz-final">' + summary() +
        '<form id="qzForm" novalidate><div class="fgrid">' +
          '<div class="field full" data-f="nombre"><label for="qN">' + IL_T('Nombre del padre, madre o tutor') + '</label><input id="qN" name="fullName" autocomplete="name" required aria-describedby="qNe" value="' + esc(C.nombre) + '"><span class="err" id="qNe">' + IL_T('Escribid vuestro nombre.') + '</span></div>' +
          '<div class="field" data-f="email"><label for="qE">' + IL_T('Correo electrónico') + '</label><input id="qE" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="qEe" value="' + esc(C.email) + '"><span class="err" id="qEe">' + IL_T('Revisad el correo: parece incompleto.') + '</span></div>' +
          '<div class="field" data-f="telefono"><label for="qT">' + IL_T('Teléfono') + ' <small>' + IL_T('(opcional)') + '</small></label><input id="qT" name="phone" type="tel" autocomplete="tel" inputmode="tel" aria-describedby="qTe" value="' + esc(C.telefono) + '"><span class="err" id="qTe">' + IL_T('Revisad el teléfono (mínimo 9 cifras).') + '</span></div>' +
          '<div class="field full"><label for="qI">' + IL_T('¿Cuándo os gustaría empezar?') + ' <small>' + IL_T('(opcional)') + '</small></label><select id="qI" name="inicio"><option value="">' + IL_T('Elegid una opción') + '</option>' + STARTS.map(function(s){ return '<option' + (C.inicio === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></div>' +
          '<div class="field full"><label for="qC">' + IL_T('Comentarios') + ' <small>' + IL_T('(opcional)') + '</small></label><textarea id="qC" name="message" maxlength="1500" placeholder="' + IL_T('Curso actual, nivel de inglés, dudas…') + '">' + esc(C.comentarios) + '</textarea></div>' +
          '<div class="hp" aria-hidden="true"><label for="qW">Web</label><input id="qW" name="website" tabindex="-1" autocomplete="off"></div>' +
          '<div class="full check-wrap" data-f="privacidad"><label class="check"><input type="checkbox" id="qP" required> <span>' + IL_T('He leído la') + ' <a href="legal.html#privacidad" target="_blank" rel="noopener">' + IL_T('política de privacidad') + '</a> ' + IL_T('y acepto que uséis mis datos para responder a esta consulta.') + '</span></label><span class="err">' + IL_T('Para enviarlo, aceptad la política de privacidad.') + '</span></div>' +
        '</div>' +
        '<div class="qz-send"><button type="button" class="qz-back" data-act="back">' + BACK + IL_T('Anterior') + '</button><button type="submit" class="btn-primary" id="qzSend">' + SEND + '</button></div>' +
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
      '<div><h3 tabindex="-1">' + IL_T('Gracias, ') + first + '. ' + IL_T('Ya tenemos vuestras respuestas.') + '</h3><p>' + IL_T('Están guardadas: no hace falta volver a escribirlas. ¿Cómo preferís seguir?') + '</p></div></div>' +
      '<div class="qz-paths" role="group" aria-label="' + IL_T('Cómo seguir') + '">' +
        '<button type="button" class="qz-path" data-path="call" aria-pressed="' + (after === 'call') + '"><b>' + IL_T('Reservar una llamada') + '</b><span>' + IL_T('Elegid día y hora para hablar con nosotros. 30 minutos, sin compromiso.') + '</span></button>' +
        '<button type="button" class="qz-path" data-path="contact" aria-pressed="' + (after === 'contact') + '"><b>' + IL_T('Prefiero que me contactéis') + '</b><span>' + IL_T('Una persona del equipo revisa vuestro caso y os escribe o llama personalmente.') + '</span></button>' +
      '</div><div class="qz-after" id="qzAfterBox" aria-live="polite"></div></div>';
    $('h3', qz).focus({ preventScroll: true });
  }
  function showContact(){
    $('#qzAfterBox').innerHTML = '<div class="qz-done"><h4>' + IL_T('Perfecto. Nos ponemos en contacto con vosotros.') + '</h4><p>' + IL_T('Una persona del equipo revisará vuestras respuestas y os escribirá a ') + '<b>' + esc(C.email) + '</b>' + (C.telefono ? IL_T(' o os llamará al ') + '<b>' + esc(C.telefono) + '</b>' : '') + '.</p></div>';
  }
  function showCall(){
    var box = $('#qzAfterBox');
    if ((!CB || !CB.enabled) && LINK) {
      /* calendario de reservas externo (enlace en <meta name="il-llamadas-enlace">) */
      box.innerHTML = '<div class="qz-cal"><h4>' + IL_T('Elegid día y hora') + '</h4><p>' + IL_T('Se abre nuestro calendario de llamadas en una pestaña nueva. Vuestras respuestas ya nos han llegado.') + '</p>' +
        '<div class="qz-cal-acts"><a class="btn-primary" href="' + esc(LINK) + '" target="_blank" rel="noopener">' + IL_T('Ver horas libres') + ' ' + ARROW + '</a><button type="button" class="qz-link" data-path="contact">' + IL_T('Prefiero que me llaméis vosotros') + '</button></div></div>';
      return;
    }
    if (!CB || !CB.enabled) {
      /* sin calendario configurado: hueco preparado, sin horarios inventados */
      box.innerHTML = '<div class="qz-cal qz-cal--off"><h4>' + IL_T('Reserva de llamada') + '</h4><p>' + IL_T('La reserva en línea todavía no está disponible. Vuestras respuestas ya nos han llegado: os escribimos para acordar el día y la hora de la llamada.') + '</p>' +
        '<button type="button" class="qz-link" data-path="contact">' + IL_T('De acuerdo, esperamos vuestro contacto') + '</button></div>';
      return;
    }
    box.innerHTML = '<div class="qz-cal"><h4>' + IL_T('¿Cuándo os viene bien que hablemos?') + '</h4><p>' + IL_T('Elegid un día y una hora. Os llamaremos al número que indiquéis. 30 minutos, sin compromiso.') + '</p>' +
      '<div class="field" data-f="telcall"><label for="qTc">' + IL_T('Teléfono para la llamada') + '</label><input id="qTc" type="tel" autocomplete="tel" inputmode="tel" value="' + esc(C.telefono) + '"><span class="err">' + IL_T('Necesitamos un teléfono (mínimo 9 cifras).') + '</span></div>' +
      '<div id="qzPicker" role="group" aria-label="' + IL_T('Día y hora de la llamada') + '"></div>' +
      '<div class="qz-alert" id="qzCallErr" role="alert" hidden></div>' +
      '<div class="qz-cal-acts"><button type="button" class="btn-primary" id="qzBook">' + IL_T('Confirmar llamada') + '</button><button type="button" class="qz-link" data-path="contact">' + IL_T('Ninguna hora me va bien: llamadme vosotros') + '</button></div></div>';
    picker = CB.mount($('#qzPicker'), { onState: function(st){ var b = $('#qzBook'); if (b) b.hidden = st === 'off' || st === 'error'; } });
    picker.load();
  }
  function bookCall(){
    if (booking) return;                                            /* doble clic */
    var err = $('#qzCallErr'), tel = $('#qTc'), slot = picker && picker.selected();
    err.hidden = true;
    var telOk = tel.value.replace(/\D/g, '').length >= 9;
    ($('[data-f="telcall"]', qz) || $('[data-f="qTc"]', qz)).classList.toggle('is-bad', !telOk);
    if (!telOk) { tel.focus(); return; }
    if (!slot) { err.textContent = IL_T('Elegid un día y una hora.'); err.hidden = false; if (picker) picker.focus(); return; }
    C.telefono = tel.value.trim();
    var fp = slot.start + '|' + C.telefono;
    if (!bookKey || bookKey.fp !== fp) bookKey = { fp: fp, key: newKey() };   /* misma clave en reintentos: el servidor no duplica */
    booking = true; var btn = $('#qzBook') || $('#qzEarlyBook'), label = btn.textContent; btn.disabled = true; btn.textContent = IL_T('Confirmando…');
    CB.api.book({
      idempotencyKey: bookKey.key, slotStart: slot.start, lang: IL_EN ? 'en' : 'es', website: '',
      contact: { fullName: C.nombre, email: C.email, phone: C.telefono, rgpd: true },
      consult: { service: 'extranjero', serviceLabel: 'Estudiar en el extranjero', studentAge: list('edad'), serviceExtra: extraLine(), callContext: 'Cuestionario «¿Qué colegio podría encajar?»', message: messageText() }
    }).then(function(res){
      booking = false; btn.disabled = false; btn.textContent = label;
      var b = res.body || {};
      if (res.http === 200 && b.status === 'confirmed' && b.booking) {
        $('#qzAfterBox').innerHTML = '<div class="qz-done"><h4>' + IL_T('Llamada reservada') + '</h4><p>' + IL_T('Os llamaremos el') + ' <b>' + esc(CB.longDate(b.booking.date)) + '</b> ' + IL_T('a las') + ' <b>' + esc(b.booking.time) + '</b> ' + IL_T('(hora de Madrid) al') + ' <b>' + esc(b.booking.phone) + '</b>.</p>' + (b.demo ? '<p class="qz-demo-note">' + IL_T('Demostración: no se ha reservado nada.') + '</p>' : '') + '</div>';
        $$('.qz-path', qz).forEach(function(x){ x.disabled = true; });
        forget();
        return;
      }
      if (b.status === 'slot_taken' || b.status === 'day_full') { err.textContent = IL_T('Esa hora ya no está libre. Elegid otra.'); picker.clear(); picker.refresh(); }
      else err.textContent = IL_T('No hemos podido reservar la llamada. Vuestras respuestas ya nos han llegado: podéis intentarlo de nuevo o esperar a que os contactemos.');
      err.hidden = false;
    });
  }

  /* ---------- «¿Preferís hablar con nosotros?»: llamada sin terminar el cuestionario ----------
     1) Reserva integrada (window.ilCallBooking configurada): día y hora reales.
     2) Enlace a un calendario de reservas externo (<meta name="il-llamadas-enlace" content="https://…">).
     3) Sin ninguno de los dos: petición de llamada (formulario «consulta» de Netlify), sin horas inventadas. */
  var LINK = (function(){ var m = document.querySelector('meta[name="il-llamadas-enlace"]'); var u = m ? m.getAttribute('content').trim() : ''; return /^https:\/\//.test(u) ? u : ''; })();
  var callShownAt = 0, callSending = false;
  function answeredText(){
    var out = [];
    Q.forEach(function(q){ if (A[q.k].length) out.push(q.label + ': ' + list(q.k)); });
    if (talents().length) out.push('Intereses: ' + talents().join(', '));
    return out.length ? 'Respuestas del cuestionario hasta ahora:\n' + out.join('\n') : 'Sin respuestas del cuestionario.';
  }
  function callField(id, label, type, ac, val, err, opt){
    return '<div class="field' + (opt === 'full' ? ' full' : '') + '" data-f="' + id + '"><label for="' + id + '">' + label + '</label><input id="' + id + '" type="' + type + '" autocomplete="' + ac + '"' + (type === 'tel' ? ' inputmode="tel"' : type === 'email' ? ' inputmode="email"' : '') + ' value="' + esc(val) + '"><span class="err">' + err + '</span></div>';
  }
  var PRIV = '<div class="full check-wrap" data-f="qcP"><label class="check"><input type="checkbox" id="qcP"> <span>' + IL_T('He leído la') + ' <a href="legal.html#privacidad" target="_blank" rel="noopener">' + IL_T('política de privacidad') + '</a> ' + IL_T('y acepto que uséis mis datos para responder a esta consulta.') + '</span></label><span class="err">' + IL_T('Para seguir, aceptad la política de privacidad.') + '</span></div>';
  function drawCall(){
    callShownAt = Date.now();
    var h = '<div class="qz-step qz-call"><button type="button" class="qz-back qz-call-back" data-act="quiz">' + BACK + IL_T('Volver al cuestionario') + '</button>';
    if (CB && CB.enabled) {
      h += '<div class="qz-q qz-q--final"><h3 tabindex="-1">' + IL_T('Reservad una llamada') + '</h3><p>' + IL_T('Elegid día y hora y os llamamos. 30 minutos, sin compromiso. No hace falta terminar el cuestionario: lo que ya hayáis contestado nos llega con la reserva.') + '</p></div>' +
        '<div id="qzAfterBox"><div class="fgrid">' + callField('qcN', IL_T('Nombre del padre, madre o tutor'), 'text', 'name', C.nombre, IL_T('Escribid vuestro nombre.'), 'full') +
        callField('qcE', IL_T('Correo electrónico'), 'email', 'email', C.email, IL_T('Revisad el correo: parece incompleto.')) +
        callField('qTc', IL_T('Teléfono para la llamada'), 'tel', 'tel', C.telefono, IL_T('Necesitamos un teléfono (mínimo 9 cifras).')) + '</div>' +
        '<div id="qzPicker" class="qz-picker" role="group" aria-label="' + IL_T('Día y hora de la llamada') + '"></div>' +
        '<div class="fgrid">' + PRIV + '</div><div class="qz-alert" id="qzCallErr" role="alert" hidden></div>' +
        '<div class="qz-cal-acts"><button type="button" class="btn-primary" id="qzEarlyBook">' + IL_T('Confirmar llamada') + '</button></div></div></div>';
      qz.innerHTML = h;
      picker = CB.mount($('#qzPicker'), { onState: function(st){ var b = $('#qzEarlyBook'); if (b) b.hidden = st === 'off' || st === 'error'; } });
      picker.load();
    } else if (LINK) {
      h += '<div class="qz-q qz-q--final"><h3 tabindex="-1">' + IL_T('Reservad una llamada') + '</h3><p>' + IL_T('Elegid el día y la hora en nuestro calendario de llamadas: se abre en una pestaña nueva. Si queréis, después podéis volver y terminar el cuestionario.') + '</p></div>' +
        '<div class="qz-cal-acts"><a class="btn-primary" href="' + esc(LINK) + '" target="_blank" rel="noopener">' + IL_T('Ver horas libres') + ' ' + ARROW + '</a></div></div>';
      qz.innerHTML = h;
    } else {
      h += '<div class="qz-q qz-q--final"><h3 tabindex="-1">' + IL_T('Os llamamos nosotros') + '</h3><p>' + IL_T('Todavía no podéis elegir la hora en línea. Dejadnos vuestro teléfono y el momento del día que mejor os venga, y os llamamos. No hace falta terminar el cuestionario: lo que ya hayáis contestado nos llega con vuestra petición.') + '</p></div>' +
        '<div id="qzAfterBox"><form id="qzCallForm" novalidate><div class="fgrid">' +
        callField('qcN', IL_T('Nombre del padre, madre o tutor'), 'text', 'name', C.nombre, IL_T('Escribid vuestro nombre.'), 'full') +
        callField('qTc', IL_T('Teléfono'), 'tel', 'tel', C.telefono, IL_T('Necesitamos un teléfono (mínimo 9 cifras).')) +
        '<div class="field" data-f="qcM"><label for="qcM">' + IL_T('¿Cuándo os viene mejor?') + '</label><select id="qcM"><option>' + IL_T('Por la mañana') + '</option><option>' + IL_T('A mediodía') + '</option><option>' + IL_T('Por la tarde') + '</option><option selected>' + IL_T('Cualquier momento') + '</option></select></div>' +
        callField('qcE', IL_T('Correo electrónico') + ' <small>' + IL_T('(opcional)') + '</small>', 'email', 'email', C.email, IL_T('Revisad el correo: parece incompleto.'), 'full') +
        '<div class="hp" aria-hidden="true"><label for="qcW">Web</label><input id="qcW" tabindex="-1" autocomplete="off"></div>' + PRIV +
        '</div><div class="qz-cal-acts"><button type="submit" class="btn-primary" id="qzCallSend">' + IL_T('Pedir que nos llaméis') + '</button></div>' +
        '<div class="qz-alert" id="qzCallErr" role="alert" hidden></div></form></div></div>';
      qz.innerHTML = h;
    }
    var t = $('h3', qz); if (t) t.focus({ preventScroll: true });
    var top = qz.getBoundingClientRect().top;
    if (top < 70 || top > innerHeight * .6) window.scrollTo({ top: scrollY + top - 150, behavior: reduce ? 'auto' : 'smooth' });
  }
  function callCheck(needEmail){
    var bad = [];
    var mark = function(f, isBad){ var el = $('[data-f="' + f + '"]', qz); if (!el) return; el.classList.toggle('is-bad', isBad); var inp = $('input', el); if (inp && inp.type !== 'checkbox') inp.setAttribute('aria-invalid', isBad ? 'true' : 'false'); if (isBad) bad.push(el); };
    var n = $('#qcN').value.trim(), e = $('#qcE').value.trim(), tel = $('#qTc').value.trim();
    mark('qcN', n.length < 2);
    mark('qTc', tel.replace(/\D/g, '').length < 9);
    mark('qcE', needEmail ? !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) : (e !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)));
    mark('qcP', !$('#qcP').checked);
    if (bad.length) { var inp = $('input', bad[0]); if (inp) inp.focus(); return false; }
    C.nombre = n; C.email = e; C.telefono = tel; save();
    return true;
  }
  function sendCallRequest(){
    if (callSending) return;
    var err = $('#qzCallErr'); err.hidden = true;
    if (!callCheck(false)) return;
    var moment = $('#qcM').value;
    var done = function(){
      $('#qzAfterBox').innerHTML = '<div class="qz-done"><h4>' + IL_T('Recibido. Os llamamos nosotros.') + '</h4><p>' + IL_T('Una persona del equipo os llamará al ') + '<b>' + esc(C.telefono) + '</b>' + (moment !== IL_T('Cualquier momento') ? ', ' + esc(moment.toLowerCase()) : '') + '.</p>' +
        '<button type="button" class="qz-link" data-act="quiz">' + IL_T('Volver al cuestionario') + '</button></div>';
    };
    if ($('#qcW').value || Date.now() - callShownAt < 2500) { done(); return; }   /* robots: parece enviado, no se manda nada */
    var btn = $('#qzCallSend'); callSending = true; btn.disabled = true; btn.setAttribute('aria-busy', 'true'); btn.innerHTML = '<span class="spin" aria-hidden="true"></span>' + IL_T('Enviando…');
    var payload = new URLSearchParams({
      form_type: 'lead', service: 'extranjero', serviceExtra: 'Petición de llamada desde el cuestionario «¿Qué colegio podría encajar?»', studentAge: list('edad'),
      message: 'Quiere que le llamemos. Mejor momento: ' + moment + '\n' + answeredText(),
      fullName: C.nombre, email: C.email, phone: C.telefono, contactPreference: 'Llamada (' + moment.toLowerCase() + ')',
      rgpd: '1', comunicaciones: 'No', website: $('#qcW').value
    });
    var req = window.ilSendForm ? window.ilSendForm('consulta', payload, 'Petición de llamada — ' + C.nombre) : Promise.reject(new Error('nosend'));
    req.then(function(){
      callSending = false;
      if (window.dataLayer) window.dataLayer.push({ event: 'lead_generado', servicio: 'extranjero', origen: 'peticion_llamada' });
      done();
    }).catch(function(){
      callSending = false; btn.disabled = false; btn.removeAttribute('aria-busy'); btn.textContent = IL_T('Pedir que nos llaméis');
      err.textContent = IL_T('No hemos podido enviar vuestra petición. Revisad la conexión y volved a intentarlo, o escribidnos a info@interlanguage.es.');
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
    if (t.id === 'qzEarlyBook') { if (callCheck(true)) bookCall(); return; }
    var act = t.getAttribute('data-act');
    if (act === 'call') { keep(); drawCall(); return; }
    if (act === 'quiz') { dir = 1; if (sent) { window.ilExtQuiz.reset(); } else draw(true); return; }
    if (act === 'next') { if (A[Q[step].k].length) go(step + 1); return; }
    if (act === 'back') { keep(); go(step - 1); return; }
    if (t.hasAttribute('data-go')) { keep(); go(+t.getAttribute('data-go')); return; }
  });
  qz.addEventListener('input', function(e){ var f = e.target.closest('.field, .check-wrap'); if (f && f.classList.contains('is-bad')) { keep(); f.classList.remove('is-bad'); } else if ($('#qzForm', qz)) keep(); });
  qz.addEventListener('change', function(e){ var f = e.target.closest('.check-wrap'); if (f) f.classList.remove('is-bad'); if ($('#qzForm', qz)) keep(); });
  qz.addEventListener('submit', function(e){
    e.preventDefault();
    if (e.target.id === 'qzCallForm') { sendCallRequest(); return; }
    if (sending || sent) return;                                        /* sin envíos dobles */
    var alertBox = $('#qzAlert'); alertBox.hidden = true;
    if (!validate()) return;
    if ($('#qW').value || Date.now() - finalShownAt < 2500) { sent = true; forget(); thanks(); return; }   /* robots: parece enviado, no se manda nada */
    var btn = $('#qzSend');
    sending = true; btn.setAttribute('aria-busy', 'true'); btn.disabled = true; btn.innerHTML = '<span class="spin" aria-hidden="true"></span>' + IL_T('Enviando…');
    var payload = new URLSearchParams({
      form_type: 'lead', service: 'extranjero', serviceExtra: extraLine(), studentAge: list('edad'), message: messageText(),
      fullName: C.nombre, email: C.email, phone: C.telefono, contactPreference: C.telefono ? 'Teléfono o correo' : 'Correo',
      rgpd: '1', comunicaciones: 'No', website: $('#qW').value
    });
    /* mismo envío que la consulta de la web: Netlify Forms, formulario «consulta» (window.ilSendForm está en main.js) */
    var req = window.ilSendForm ? window.ilSendForm('consulta', payload, 'Nueva solicitud web — ' + C.nombre.trim()) : Promise.reject(new Error('nosend'));
    req.then(function(){
      sending = false; sent = true; forget();
      if (window.dataLayer) { window.dataLayer.push({ event: 'lead_generado', servicio: 'extranjero', origen: 'cuestionario' }); window.dataLayer.push({ event: 'formulario_enviado', servicio: 'extranjero' }); }
      thanks();
    }).catch(function(){
      sending = false; btn.removeAttribute('aria-busy'); btn.disabled = false; btn.textContent = SEND;
      alertBox.textContent = IL_T('No hemos podido enviar vuestras respuestas. Revisad la conexión y volved a intentarlo; lo que habéis escrito se conserva. También podéis escribirnos a info@interlanguage.es.');
      alertBox.hidden = false;
    });
  });
  window.ilExtQuiz = { reset: function(){ forget(); A = { edad: [], objetivos: [], estancia: [], destinos: [], duracion: [] }; I = []; C = { nombre: '', email: '', telefono: '', inicio: '', comentarios: '', privacidad: false }; step = 0; sent = false; after = ''; draw(false); } };
  draw(false);
})();
