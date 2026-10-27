#!/usr/bin/env python3
"""Página «Campamentos en el extranjero» (#servicio-verano-extranjero) en index.html e index-en.html.

Contenido: programa de verano en internados de Escocia e Inglaterra (datos del folleto 2027 y de la guía previa al viaje
del proveedor). No se nombra al proveedor ni se usan sus fotos ni su marca.
Todo lo que va en <mark class="fill">…</mark> es propio de Interlanguage y está por confirmar (precios en €, condiciones
de reserva, quién acompaña en el viaje): sustitúyelo por el dato real y quita la etiqueta.

Si la página ya existe, este script la SUSTITUYE entera (y deja el menú, la tarjeta y el pie como estén).
Después de editar a mano el HTML, no vuelvas a ejecutarlo o perderás esos cambios."""
import pathlib, re

W = pathlib.Path(__file__).resolve().parent.parent / "web-publica"
ARROW = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
S = lambda d: f'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{d}</svg>'
IC = {
  'edad': S('<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4.5 4-7 7-7s6 2.5 7 7"/>'),
  'fecha': S('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>'),
  'lugar': S('<path d="M12 21s-7-6.4-7-11.5A7 7 0 0112 2a7 7 0 017 7.5C19 14.6 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  'precio': S('<path d="M12 2 20 10a2 2 0 010 2.8L13.8 19a2 2 0 01-2.8 0L3 11V3h8z"/><circle cx="7" cy="7" r="1.2" fill="currentColor" stroke="none"/>'),
  'habla': S('<path d="M20 15a2 2 0 0 1-2 2H8l-4 3V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z"/><path d="M8 9h8M8 12.5h5"/>'),
  'grupo': S('<circle cx="8.5" cy="8" r="3"/><path d="M2.5 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17.5" cy="9" r="2.4"/><path d="M16 12.2c2.2.4 3.7 2 4.3 3.7"/>'),
  'mundo': S('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9Z"/>'),
  'escudo': S('<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>'),
  'avion': S('<path d="M10.5 13.5 3 11l1.5-1.5 8 1 4-4.5a2 2 0 0 1 3 3L15 13.5l1 8L14.5 23l-2.5-7.5"/>'),
  'casa': S('<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>'),
  'estrella': S('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/>'),
  'birrete': S('<path d="M2 9l10-5 10 5-10 5Z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/><path d="M22 9v6"/>'),
  'bus': S('<rect x="4" y="4" width="16" height="13" rx="2"/><path d="M4 11h16M8 21v-4M16 21v-4"/>'),
}

def pic(base, widths, w, h, alt, sizes, jpg=True):
    ss = lambda ext: ", ".join(f"images/internacional/{base}-{a}.{ext} {a}w" for a in widths)
    src = f"images/internacional/{base}.jpg" if jpg else f"images/internacional/{base}-{widths[-1]}.webp"
    return (f'<picture><source type="image/avif" srcset="{ss("avif")}" sizes="{sizes}"><source type="image/webp" srcset="{ss("webp")}" sizes="{sizes}">'
            f'<img src="{src}" alt="{alt}" width="{w}" height="{h}" loading="lazy" decoding="async"></picture>')

def F(t): return f'<mark class="fill">{t}</mark>'

ELEC_IMG = {   # fotos propias de actividades (con consentimiento; no se asocian a un colegio concreto)
  'deporte': ('ext-gal-tenis', [360, 520, 720, 1000], 1000, 770, False),
  'multi': ('campamento-extranjero-kayak', [470, 710, 1030, 1447], 1447, 814, True),
  'golf': ('ext-duo-golf', [430, 580, 870, 1000], 1000, 1250, False),
  'aventura': ('extranjero-surf', [480, 800, 1122], 1122, 1402, True),
  'hipica': ('ext-gal-equitacion', [360, 520, 720, 1000], 1000, 667, False),
  'arte': ('ext-gal-arte', [360, 520, 572], 572, 573, False),
  'descubre': ('ext-hero-castillo', [640, 960, 1280], 1916, 821, False),
  'ingles': ('ext-gal-teatro', [360, 520, 720, 1000], 1000, 663, False),
}

T = {
 'es': dict(
  title="Campamentos de verano en el extranjero", back="← Volver a servicios", eyebrow="Campamento de verano · Escocia e Inglaterra",
  h1="Un verano para vivir el inglés fuera de casa",
  intro="De una a cuatro semanas en internados británicos, con clases de inglés cada mañana, tardes a elegir, excursiones y alumnos de más de 20 países.",
  qf=[('edad','8–17 años','Según el colegio'), ('lugar','Escocia e Inglaterra','4 internados'), ('fecha','27 jun. – 15 ago. 2027','De 1 a 4 semanas'), ('precio',F('Desde … €'),'Por semana')],
  note="Fechas de 2027. Las plazas de cada colegio son limitadas.",
  cta="Pedir información", cta2="Ver cómo es un día",
  alt="Niños con casco y chaleco salvavidas levantan los brazos, riendo, en una canoa roja sobre un lago",
  stats=[('15 h','de inglés a la semana'), ('2','excursiones de día completo cada semana'), ('+20','nacionalidades en el campus'), ('24 h','equipo de cuidado en la residencia')],
  stats_note="Programas acreditados por el British Council.",
  why_h="Por qué este campamento", why_p="El inglés deja de ser una asignatura y se convierte en la lengua de todo el día.",
  why=[('habla','Inglés con proyectos', 'Cada mañana, de 9:00 a 12:30, en grupos reducidos y con profesores cualificados. Aprenden presentando, creando y trabajando en equipo.'),
       ('mundo','Amigos de todo el mundo', 'Conviven con chicos y chicas de más de 20 países. El inglés es lo que tienen en común.'),
       ('estrella','Tardes que eligen ellos', 'Deporte, aventura al aire libre, golf, hípica, arte o descubrir el país: cada uno elige su plan.'),
       ('escudo','Cuidados las 24 horas', 'Un equipo vive en la residencia con los alumnos: conoce a cada uno y está pendiente de él día y noche.')],
  prog_h="Dos programas de inglés", prog_p="Todos los alumnos tienen 15 horas de inglés a la semana. Los mayores pueden elegir el programa de liderazgo.",
  progs=[('Inglés general', 'Para todos los alumnos', ['Inglés práctico y por proyectos', 'Presentaciones, comunicación y trabajo en grupo', 'Grupos reducidos por nivel']),
         ('Inglés y liderazgo', '14 a 17 años · nivel B1 o superior', ['Talleres y retos de liderazgo', 'Trabajo en equipo y resolución de problemas', 'Más soltura al hablar y presentar']) ],
  prog_note="El programa de liderazgo se imparte en Dollar Academy; en otros colegios, consultadlo.",
  camp_h="Cuatro internados para elegir", camp_p="Colegios británicos con residencia, instalaciones deportivas y campus seguros. Os ayudamos a elegir el que mejor encaja con su edad y lo que le gusta.",
  camps=[('Escocia','Dollar Academy','Dollar · a 45 min de Edimburgo','27 jun. – 25 jul. 2027','10–17 años','Aeropuerto de Edimburgo, a 40 min',['Piscina','Pistas de tenis','Pabellón deportivo'],'Único colegio con el programa de inglés y liderazgo.'),
         ('Escocia','Strathallan School','Perthshire · a 1 h de Edimburgo','4 jul. – 1 ago. 2027','8–17 años','Aeropuerto de Edimburgo, a 45 min',['Campus de 62 hectáreas','Piscina','Deporte cubierto'],'El único que admite desde los 8 años.'),
         ('Escocia','Loretto School','Musselburgh · a 8 min en tren de Edimburgo','4 jul. – 15 ago. 2027','10–17 años','Aeropuerto de Edimburgo, a 40 min',['Academia de golf','Playa a 5 min a pie','Jardines'],'Junto al mar y con la temporada más larga.'),
         ('Inglaterra','Prior’s Field','Godalming (Surrey) · a 45 min de Londres','7 jul. – 4 ago. 2027','10–17 años','Heathrow, a 45 min',['Piscina','Pistas de tenis','Hípica'],'Para quien quiere conocer Londres.')],
  camp_room="Habitaciones individuales o compartidas, con baños compartidos. Limpieza diaria.",
  elec_h="Por la tarde, cada uno elige", elec_p="Las tardes son para descubrir aficiones. Algunas opciones tienen un suplemento.",
  elec=[('deporte','Deportes de verano','Fútbol, tenis, baloncesto, natación… cada día, el que prefieran.', False),
        ('multi','Multiaventura','Retos en equipo, juegos al aire libre y actividades creativas.', False),
        ('aventura','Aventura al aire libre','Kayak, paddle surf, tiro con arco y circuitos de agua, con monitores especializados.', True),
        ('golf','Golf','Clases con un profesional en un campo cercano, para todos los niveles.', True),
        ('hipica','Hípica','Para quien empieza y para quien ya monta: cuidado del caballo, pista y paseos.', True),
        ('arte','Arte y creatividad','Escriben su propia historia, la ilustran y la representan.', False),
        ('descubre','Descubrir el país','Castillos, paisajes, ciudades y playas, con la cultura y la historia del lugar.', True),
        ('ingles','Más inglés','Debates, presentaciones y escritura, en grupos de 5 como máximo.', True)],
  sup="Suplemento",
  day_h="Un día en el campamento", day_p="El mismo horario en los cuatro colegios.",
  wk="Entre semana", we="Fin de semana",
  wkd=[('8:30','Desayuno'),('9:00 – 12:30','Clases de inglés'),('12:30','Comida'),('14:00 – 16:00','Actividad de la tarde'),('16:30','Piscina (opcional)'),('18:00','Cena'),('19:00','Asamblea y actividad de noche'),('22:30','A dormir')],
  wke=[('8:30','Desayuno'),('9:00','Salida de excursión'),('12:30','Comida de picnic'),('13:30 – 16:00','Visitas, museos y compras'),('17:30','Vuelta al colegio'),('18:00','Cena'),('19:00','Actividad de noche'),('22:30','A dormir')],
  day_note="Horarios aproximados. Los mayores se acuestan a las 23:00.",
  night_h="Las noches", night=['Noches culturales con música y baile tradicional','Cine','Concurso de talentos','Torneos deportivos','Paseos, búsquedas del tesoro y estrellas','Talleres de manualidades','Juegos de mesa y trivial','Discoteca'],
  trip_h="Dos excursiones de día completo cada semana", trip_p="Los fines de semana salen a conocer el país. Además, entre semana hay salidas de media tarde.",
  trips=[('Desde Escocia',['Edimburgo: la Royal Mile, Arthur’s Seat y el Museo Nacional','Glasgow y el Museo Kelvingrove','Stirling y el Monumento a Wallace','St Andrews y su playa','Loch Lomond','The Kelpies y la Falkirk Wheel']),
         ('Desde Inglaterra',['Londres: Big Ben, el London Eye y Tower Bridge','El castillo de Windsor','Oxford o Cambridge','Hampton Court','La playa de Brighton'])],
  trip_note="Son ejemplos: los destinos varían según el colegio, las fechas y el tiempo.",
  inc_h="Qué incluye", inc=['15 horas de inglés a la semana y materiales','Actividad de tarde y programa de noches','Dos excursiones de día completo a la semana','Alojamiento, pensión completa, ropa de cama y wifi','Lavandería semanal en estancias de 2 semanas o más','Pack de bienvenida','Certificado y ceremonia de graduación', F('Orientación y gestión de la reserva con Interlanguage')],
  noinc_h="Qué no incluye", noinc=['Vuelos', 'Traslado desde el aeropuerto ('+F('… € por trayecto')+')', 'Seguro médico y de viaje (obligatorio; se puede contratar con el campamento)', 'Actividades de tarde con suplemento', 'Dinero de bolsillo', 'Fianza de la tarjeta de la habitación ('+F('… €')+', se devuelve)'],
  grad_h="Graduación y camiseta de recuerdo", grad_p="El último día reciben su certificado en una ceremonia de graduación y diseñan su propia camiseta, firmada por los amigos que han hecho.",
  seg_h="Acompañamiento y seguridad", seg_p="Lo que más preocupa a una familia, explicado claramente.",
  seg=[('Llegada', 'Les esperan en la salida del aeropuerto y los llevan al colegio. En la residencia les reciben su equipo y su compañero de habitación.'),
       ('En la residencia', 'Un equipo vive con los alumnos las 24 horas. Guarda su pasaporte, su dinero y sus medicinas, y les da la medicación a su hora.'),
       ('Móviles', 'No se usan en clase, en las actividades, en las comidas ni por la noche. El equipo los guarda; la familia puede pedir otra cosa por escrito.'),
       ('Normas claras', 'Sin alcohol, tabaco ni vapeo. Chicos y chicas solo coinciden en las zonas comunes. Tolerancia cero con el acoso.'),
       ('El viaje', F('Cómo viajan: vuelo en grupo desde Madrid con un monitor de Interlanguage, o solos como menor no acompañado.')),
       ('Contacto con casa', F('Cómo y cuándo pueden hablar con vosotros durante el campamento.'))],
  money_h="Dinero de bolsillo recomendado", money=[('8 a 10 años','25 – 35 £'),('11 a 14 años','35 – 50 £'),('15 a 17 años','50 – 60 £')], money_u="por semana",
  money_note="Hay tienda en el campus y tiempo para compras en las excursiones. El equipo guarda el dinero.",
  bag_h="Qué llevar", bag=['Pasaporte en vigor y ETA (autorización para entrar en el Reino Unido)','Autorización de los padres para viajar','Toallas, también para la piscina','Ropa de deporte, chubasquero y un conjunto arreglado para las noches','Bañador y calzado que se pueda mojar','Adaptador de enchufe británico (tipo G)'],
  bag_note="Mejor sin objetos caros. Si toma medicinas o tiene alergias, avisadnos antes.",
  pre_h="Precios", pre_p="El precio depende de las semanas. Las estancias empiezan en domingo (en miércoles en Inglaterra).",
  pre=[('1 semana', F('… €')), ('2 semanas', F('… €')), ('3 semanas', F('… €')), ('4 semanas', F('… €'))],
  pre_note="Noche extra: "+F('… €')+", según disponibilidad. Suplementos de tarde: hípica, aventura, golf, descubrir el país y más inglés.",
  res_h="Cómo se reserva", res=[('Nos contáis qué buscáis', 'Edad, nivel de inglés, fechas y lo que le gusta.'), ('Os proponemos colegio y fechas', 'Con el precio cerrado y lo que incluye.'), ('Reserváis la plaza', 'Con una señal del '+F('10 %')+'; el resto, antes del '+F('15 de mayo de 2027')+'.'), ('Preparamos la salida', 'Documentación, maleta y vuelos, para que viaje tranquilo.')],
  cancel="Cancelación: hasta 30 días antes de la llegada se devuelve todo salvo la señal; después, no hay devolución.",
  faq_h="Preguntas frecuentes",
  faq=[('¿Desde qué edad pueden ir?', 'Desde los 8 años en Strathallan School y desde los 10 en los otros tres colegios, hasta los 17.'),
       ('¿Qué nivel de inglés necesitan?', 'No hace falta un nivel concreto: las clases son en grupos reducidos por nivel. Para el programa de liderazgo, un B1.'),
       ('¿Con quién comparten la habitación?', 'Pueden elegir habitación individual o compartida. Los baños son compartidos y se limpian a diario.'),
       ('¿Hay muchos españoles?', 'Los campamentos reciben alumnos de más de 20 países, así que el inglés es la lengua de todos.'),
       ('¿Pueden usar el móvil?', 'Sí, en su tiempo libre. No en clase, en las actividades, en las comidas ni por la noche.'),
       ('¿Qué pasa si se pone enfermo?', 'El equipo de la residencia le atiende y os avisa. Por eso el seguro médico es obligatorio.'),
       ('¿Cómo llegan desde el aeropuerto?', 'Hay traslados en minibús desde Edimburgo, Heathrow y Gatwick, con coste aparte. Les esperan en la salida con un cartel.'),
       ('¿Cuándo hay que reservar?', 'Cuanto antes: las plazas son limitadas y el pago completo es antes del '+F('15 de mayo de 2027')+'.')],
  fin_h="¿Le buscamos su campamento?", fin_p="Contadnos su edad, su nivel y qué fechas tenéis en mente, y os proponemos el colegio que mejor encaja. La orientación es gratuita.",
  cross_e="¿Y después del verano?", cross_p="Si el campamento le engancha, el siguiente paso puede ser un trimestre o un curso escolar en el extranjero.", cross_a="Estudiar en el extranjero",
  note_adv="Interés: campamento de verano en el extranjero"),
 'en': dict(
  title="Summer camps abroad", back="← Back to programmes", eyebrow="Summer camp · Scotland and England",
  h1="A summer living English away from home",
  intro="One to four weeks at British boarding schools, with English lessons every morning, afternoons of their choice, excursions and students from more than 20 countries.",
  qf=[('edad','Ages 8–17','Depending on the school'), ('lugar','Scotland and England','4 boarding schools'), ('fecha','27 Jun – 15 Aug 2027','1 to 4 weeks'), ('precio',F('From … €'),'Per week')],
  note="2027 dates. Places at each school are limited.",
  cta="Ask for information", cta2="See a typical day",
  alt="Children in helmets and life jackets raise their arms, laughing, in a red canoe on a lake",
  stats=[('15 h','of English a week'), ('2','full-day excursions every week'), ('20+','nationalities on campus'), ('24 h','residential care team')],
  stats_note="British Council accredited programmes.",
  why_h="Why this camp", why_p="English stops being a school subject and becomes the language of the whole day.",
  why=[('habla','Project-based English', 'Every morning from 9:00 to 12:30, in small groups with qualified teachers. They learn by presenting, creating and working in teams.'),
       ('mundo','Friends from around the world', 'They live alongside boys and girls from more than 20 countries. English is what they share.'),
       ('estrella','Afternoons they choose', 'Sport, outdoor adventure, golf, horse riding, art or discovering the country: each student picks their plan.'),
       ('escudo','Care around the clock', 'A team lives in the boarding house with the students: they know each one and look after them day and night.')],
  prog_h="Two English programmes", prog_p="Every student has 15 hours of English a week. Older students can choose the leadership programme.",
  progs=[('Core English', 'For all students', ['Practical, project-based English', 'Presentations, communication and teamwork', 'Small groups by level']),
         ('English and leadership', 'Ages 14 to 17 · B1 level or above', ['Leadership workshops and challenges', 'Teamwork and problem-solving', 'More confidence speaking and presenting']) ],
  prog_note="The leadership programme runs at Dollar Academy; for other schools, please ask.",
  camp_h="Four boarding schools to choose from", camp_p="British boarding schools with residences, sports facilities and safe campuses. We help you choose the one that best suits their age and interests.",
  camps=[('Scotland','Dollar Academy','Dollar · 45 min from Edinburgh','27 Jun – 25 Jul 2027','Ages 10–17','Edinburgh Airport, 40 min',['Swimming pool','Tennis courts','Games hall'],'The only school offering the leadership programme.'),
         ('Scotland','Strathallan School','Perthshire · 1 h from Edinburgh','4 Jul – 1 Aug 2027','Ages 8–17','Edinburgh Airport, 45 min',['153-acre campus','Swimming pool','Indoor sports'],'The only one that takes students from age 8.'),
         ('Scotland','Loretto School','Musselburgh · 8 min by train to Edinburgh','4 Jul – 15 Aug 2027','Ages 10–17','Edinburgh Airport, 40 min',['Golf academy','Beach a 5-min walk away','Gardens'],'By the sea, with the longest season.'),
         ('England','Prior’s Field','Godalming (Surrey) · 45 min from London','7 Jul – 4 Aug 2027','Ages 10–17','Heathrow, 45 min',['Swimming pool','Tennis courts','Horse riding'],'For those who want to discover London.')],
  camp_room="Single or shared rooms, with shared bathrooms. Cleaned daily.",
  elec_h="In the afternoon, everyone chooses", elec_p="Afternoons are for discovering new interests. Some options carry a supplement.",
  elec=[('deporte','Summer sports','Football, tennis, basketball, swimming… whichever they prefer each day.', False),
        ('multi','Multi-activities','Team challenges, outdoor games and creative activities.', False),
        ('aventura','Outdoor adventure','Kayaking, paddle boarding, archery and inflatable courses, with specialist instructors.', True),
        ('golf','Golf','Lessons with a golf professional at a nearby course, for all levels.', True),
        ('hipica','Horse riding','For beginners and experienced riders: horse care, arena work and rides.', True),
        ('arte','Creative arts','They write their own story, illustrate it and perform it.', False),
        ('descubre','Discover the country','Castles, landscapes, cities and beaches, with local culture and history.', True),
        ('ingles','Extra English','Debates, presentations and writing, in groups of up to 5.', True)],
  sup="Supplement",
  day_h="A day at camp", day_p="The same timetable at all four schools.",
  wk="Weekdays", we="Weekends",
  wkd=[('8:30','Breakfast'),('9:00 – 12:30','English lessons'),('12:30','Lunch'),('14:00 – 16:00','Afternoon activity'),('16:30','Swimming (optional)'),('18:00','Dinner'),('19:00','Assembly and evening activity'),('22:30','Lights out')],
  wke=[('8:30','Breakfast'),('9:00','Excursion departs'),('12:30','Picnic lunch'),('13:30 – 16:00','Visits, museums and shopping'),('17:30','Back to school'),('18:00','Dinner'),('19:00','Evening activity'),('22:30','Lights out')],
  day_note="Approximate times. Older students go to bed at 23:00.",
  night_h="Evenings", night=['Cultural nights with traditional music and dance','Movie nights','Talent show','Sports tournaments','Walks, scavenger hunts and stargazing','Arts and crafts workshops','Board games and quizzes','Disco'],
  trip_h="Two full-day excursions every week", trip_p="At weekends they go out to explore the country. During the week there are also half-day trips.",
  trips=[('From Scotland',['Edinburgh: the Royal Mile, Arthur’s Seat and the National Museum','Glasgow and Kelvingrove Museum','Stirling and the Wallace Monument','St Andrews and its beach','Loch Lomond','The Kelpies and the Falkirk Wheel']),
         ('From England',['London: Big Ben, the London Eye and Tower Bridge','Windsor Castle','Oxford or Cambridge','Hampton Court','Brighton beach'])],
  trip_note="These are examples: destinations vary by school, dates and weather.",
  inc_h="What is included", inc=['15 hours of English a week and materials','Afternoon activity and evening programme','Two full-day excursions a week','Accommodation, full board, bedding and Wi-Fi','Weekly laundry for stays of 2 weeks or more','Welcome pack','Certificate and graduation ceremony', F('Guidance and booking management with Interlanguage')],
  noinc_h="What is not included", noinc=['Flights', 'Airport transfer ('+F('… € each way')+')', 'Medical and travel insurance (compulsory; can be arranged with the camp)', 'Afternoon activities with a supplement', 'Pocket money', 'Room key card deposit ('+F('… €')+', refundable)'],
  grad_h="Graduation and a keepsake T-shirt", grad_p="On the last day they receive their certificate at a graduation ceremony and design their own T-shirt, signed by the friends they have made.",
  seg_h="Supervision and safety", seg_p="What matters most to families, explained clearly.",
  seg=[('Arrival', 'Staff meet them at airport arrivals and take them to school. At the boarding house their team and room-mate welcome them.'),
       ('In the boarding house', 'A team lives with the students 24 hours a day. They look after passports, money and medicines, and give medication on time.'),
       ('Phones', 'Not used in lessons, activities, meals or overnight. Staff keep them safe; families can request otherwise in writing.'),
       ('Clear rules', 'No alcohol, smoking or vaping. Boys and girls only mix in common areas. Zero tolerance of bullying.'),
       ('The journey', F('How they travel: group flight from Madrid with an Interlanguage leader, or alone as an unaccompanied minor.')),
       ('Keeping in touch', F('How and when they can talk to you during the camp.'))],
  money_h="Recommended pocket money", money=[('Ages 8 to 10','£25 – 35'),('Ages 11 to 14','£35 – 50'),('Ages 15 to 17','£50 – 60')], money_u="per week",
  money_note="There is a tuck shop on campus and time for shopping on excursions. Staff keep the money safe.",
  bag_h="What to pack", bag=['Valid passport and ETA (UK entry authorisation)','Parental consent to travel','Towels, including one for swimming','Sportswear, a rain jacket and a smart outfit for evenings','Swimwear and shoes that can get wet','UK plug adapter (type G)'],
  bag_note="Best to leave expensive items at home. If they take medicine or have allergies, let us know beforehand.",
  pre_h="Prices", pre_p="The price depends on the number of weeks. Stays start on Sunday (Wednesday in England).",
  pre=[('1 week', F('… €')), ('2 weeks', F('… €')), ('3 weeks', F('… €')), ('4 weeks', F('… €'))],
  pre_note="Extra night: "+F('… €')+", subject to availability. Afternoon supplements: horse riding, adventure, golf, discover the country and extra English.",
  res_h="How to book", res=[('Tell us what you are looking for', 'Age, English level, dates and interests.'), ('We suggest a school and dates', 'With a fixed price and what it includes.'), ('You book the place', 'With a '+F('10%')+' deposit; the rest by '+F('15 May 2027')+'.'), ('We prepare the departure', 'Paperwork, packing and flights, so they travel with peace of mind.')],
  cancel="Cancellation: up to 30 days before arrival, everything is refunded except the deposit; after that, there is no refund.",
  faq_h="Frequently asked questions",
  faq=[('From what age can they go?', 'From age 8 at Strathallan School and from 10 at the other three schools, up to 17.'),
       ('What level of English do they need?', 'No particular level: lessons are in small groups by level. The leadership programme requires B1.'),
       ('Who do they share a room with?', 'They can choose a single or shared room. Bathrooms are shared and cleaned daily.'),
       ('Are there many Spanish students?', 'The camps welcome students from more than 20 countries, so English is everyone’s language.'),
       ('Can they use their phone?', 'Yes, in their free time. Not in lessons, activities, meals or overnight.'),
       ('What if they fall ill?', 'The boarding team looks after them and lets you know. That is why medical insurance is compulsory.'),
       ('How do they get from the airport?', 'Minibus transfers run from Edinburgh, Heathrow and Gatwick, at extra cost. Staff wait at arrivals with a sign.'),
       ('When should we book?', 'As soon as possible: places are limited and full payment is due by '+F('15 May 2027')+'.')],
  fin_h="Shall we find their camp?", fin_p="Tell us their age, their level and the dates you have in mind, and we will suggest the school that fits best. Our guidance is free.",
  cross_e="And after the summer?", cross_p="If they love the camp, the next step could be a term or a school year abroad.", cross_a="Study abroad",
  note_adv="Interest: summer camp abroad"),
}

def vista(t):
    hero = pic('campamento-extranjero-canoa', [470, 710, 1030, 1536], 1536, 864, t['alt'], '(max-width:900px) 100vw, 50vw')
    adv = f'data-advise="extranjero" data-advise-note="{t["note_adv"]}"'
    qf = "".join(f'\n        <div class="camp-quickfact"><div class="camp-quickfact-ic">{IC[i]}</div><div><strong>{a}</strong><span>{b}</span></div></div>' for i, a, b in t['qf'])
    stats = "".join(f'<li><strong>{n}</strong><span>{l}</span></li>' for n, l in t['stats'])
    why = "".join(f'\n      <div class="pillar-card"><span class="pillar-ic">{IC[i]}</span><h3>{h}</h3><p>{p}</p></div>' for i, h, p in t['why'])
    progs = "".join(f'\n      <article class="vx-prog{" vx-prog--alt" if k else ""}"><span class="vx-prog-ic">{IC["birrete" if k else "habla"]}</span><h3>{n}</h3><p class="vx-prog-who">{w}</p><ul>' + "".join(f"<li>{x}</li>" for x in L) + '</ul></article>' for k, (n, w, L) in enumerate(t['progs']))
    camps = ""
    for reg, n, loc, fe, ed, air, fac, hi in t['camps']:
        camps += (f'\n      <article class="vx-camp vx-camp--{"en" if reg in ("Inglaterra","England") else "sc"}"><div class="vx-camp-top"><span class="vx-camp-reg">{reg}</span><h3>{n}</h3><p class="vx-camp-loc">{IC["lugar"]}{loc}</p></div>'
                  f'<dl class="vx-camp-facts"><div><dt>{IC["fecha"]}</dt><dd>{fe}</dd></div><div><dt>{IC["edad"]}</dt><dd>{ed}</dd></div><div><dt>{IC["avion"]}</dt><dd>{air}</dd></div></dl>'
                  f'<ul class="vx-tags">' + "".join(f"<li>{x}</li>" for x in fac) + f'</ul><p class="vx-camp-hi">{hi}</p></article>')
    elec = ""
    for key, h, p, sup in t['elec']:
        b, wd, w, hh, jpg = ELEC_IMG[key]
        elec += (f'\n      <article class="vx-elec"><div class="vx-elec-media">{pic(b, wd, w, hh, "", "(min-width:1100px) 290px, (min-width:641px) 45vw, 100vw", jpg)}'
                 + (f'<span class="vx-sup">{t["sup"]}</span>' if sup else '') + f'</div><div class="vx-elec-body"><h3>{h}</h3><p>{p}</p></div></article>')
    tl = lambda rows: "".join(f'<li><time>{a}</time><span>{b}</span></li>' for a, b in rows)
    night = "".join(f'<li>{x}</li>' for x in t['night'])
    trips = "".join(f'\n      <div class="vx-trip"><h3>{IC["bus"]}{h}</h3><ul>' + "".join(f"<li>{x}</li>" for x in L) + '</ul></div>' for h, L in t['trips'])
    inc = "".join(f'<li>{x}</li>' for x in t['inc']); noinc = "".join(f'<li>{x}</li>' for x in t['noinc'])
    seg = "".join(f'\n      <div class="club-card"><h3 class="club-stage">{h}</h3><p>{p}</p></div>' for h, p in t['seg'])
    money = "".join(f'<li><span>{a}</span><strong>{b}</strong></li>' for a, b in t['money'])
    bag = "".join(f'<li>{x}</li>' for x in t['bag'])
    pre = "".join(f'\n      <div class="camp-price-card"><span>{a}</span><strong>{b}</strong></div>' for a, b in t['pre'])
    res = "".join(f'\n      <li><span class="vext-step-n" aria-hidden="true">{k+1}</span><div><h3>{h}</h3><p>{p}</p></div></li>' for k, (h, p) in enumerate(t['res']))
    faq = "".join(f'\n      <details class="camp-faq-item"><summary>{q}</summary><p>{a}</p></details>' for q, a in t['faq'])
    return f'''<!-- ============ CAMPAMENTOS EN EL EXTRANJERO (#servicio-verano-extranjero) ============
     Lo que está dentro de <mark class="fill">…</mark> es provisional: sustitúyelo por el dato real y quita la etiqueta <mark>.
     Mientras quede alguno, se ve resaltado en la web. -->
<div id="view-service-verano-extranjero" class="view service-page" data-title="{t['title']}" hidden>

<section class="camp-hero">
  <div class="container camp-hero-grid">
    <div class="camp-hero-content">
      <a href="#" class="svc-back" data-back>{t['back']}</a>
      <span class="eyebrow">{t['eyebrow']}</span>
      <h1>{t['h1']}</h1>
      <p class="svc-page-intro">{t['intro']}</p>
      <div class="camp-quickfacts camp-quickfacts--hero">{qf}
      </div>
      <p class="camp-season-note">{t['note']}</p>
      <div class="svc-page-cta-row">
        <a href="#contacto" class="btn-primary svc-page-cta" {adv} data-cta="vext-hero">{t['cta']}</a>
        <a href="#vext-dia" class="btn-outline">{t['cta2']}</a>
      </div>
    </div>
    <div class="camp-hero-media">{hero}</div>
  </div>
</section>

<section class="vx-stats-band">
  <div class="container">
    <ul class="vx-stats reveal">{stats}</ul>
    <p class="vx-stats-note">{t['stats_note']}</p>
  </div>
</section>

<section class="camp-section bg-cream">
  <div class="container">
    <div class="camp-section-head reveal"><h2>{t['why_h']}</h2><p>{t['why_p']}</p></div>
    <div class="pillar-grid reveal">{why}
    </div>
  </div>
</section>

<section class="camp-section bg-white">
  <div class="container">
    <div class="camp-section-head reveal"><h2>{t['prog_h']}</h2><p>{t['prog_p']}</p></div>
    <div class="vx-progs reveal">{progs}
    </div>
    <p class="vext-note reveal">{t['prog_note']}</p>
  </div>
</section>

<section class="camp-section bg-cream" id="vext-destinos">
  <div class="container">
    <div class="camp-section-head reveal"><h2>{t['camp_h']}</h2><p>{t['camp_p']}</p></div>
    <div class="vx-camps reveal">{camps}
    </div>
    <p class="vext-note reveal">{IC['casa']} {t['camp_room']}</p>
  </div>
</section>

<section class="camp-section bg-white">
  <div class="container">
    <div class="camp-section-head reveal"><h2>{t['elec_h']}</h2><p>{t['elec_p']}</p></div>
    <div class="vx-elecs reveal">{elec}
    </div>
  </div>
</section>

<section class="camp-section bg-cream" id="vext-dia">
  <div class="container">
    <div class="camp-section-head reveal"><h2>{t['day_h']}</h2><p>{t['day_p']}</p></div>
    <div class="vx-days reveal">
      <div class="vx-day"><h3>{t['wk']}</h3><ol class="vx-tl">{tl(t['wkd'])}</ol></div>
      <div class="vx-day vx-day--we"><h3>{t['we']}</h3><ol class="vx-tl">{tl(t['wke'])}</ol></div>
    </div>
    <p class="vext-note reveal">{t['day_note']}</p>
    <div class="vx-nights reveal"><h3>{IC['estrella']}{t['night_h']}</h3><ul class="vx-tags vx-tags--lg">{night}</ul></div>
  </div>
</section>

<section class="camp-section bg-white">
  <div class="container">
    <div class="camp-section-head reveal"><h2>{t['trip_h']}</h2><p>{t['trip_p']}</p></div>
    <div class="vx-trips reveal">{trips}
    </div>
    <p class="vext-note reveal">{t['trip_note']}</p>
  </div>
</section>

<section class="camp-section bg-mint">
  <div class="container">
    <div class="ideal-layout">
      <div class="ideal-block reveal"><h2>{t['inc_h']}</h2><ul>{inc}</ul></div>
      <div class="ideal-block vext-noinc reveal"><h2>{t['noinc_h']}</h2><ul>{noinc}</ul></div>
    </div>
    <div class="vx-grad reveal"><span class="vx-grad-ic">{IC['birrete']}</span><div><h3>{t['grad_h']}</h3><p>{t['grad_p']}</p></div></div>
  </div>
</section>

<section class="camp-section bg-white">
  <div class="container">
    <div class="camp-section-head reveal"><h2>{t['seg_h']}</h2><p>{t['seg_p']}</p></div>
    <div class="club-grid vx-seg reveal">{seg}
    </div>
  </div>
</section>

<section class="camp-section bg-cream">
  <div class="container">
    <div class="vx-prep reveal">
      <div class="vx-money"><h2>{t['money_h']}</h2><ul>{money}</ul><p class="vx-money-u">{t['money_u']}</p><p class="vext-note">{t['money_note']}</p></div>
      <div class="ideal-block vx-bag"><h2>{t['bag_h']}</h2><ul>{bag}</ul><p class="vext-note">{t['bag_note']}</p></div>
    </div>
  </div>
</section>

<section class="camp-section bg-white" id="vext-precio">
  <div class="container">
    <div class="camp-section-head reveal"><h2>{t['pre_h']}</h2><p>{t['pre_p']}</p></div>
    <div class="camp-price-grid vext-price-grid reveal">{pre}
    </div>
    <p class="camp-price-extra reveal">{t['pre_note']}</p>
  </div>
</section>

<section class="camp-section bg-cream">
  <div class="container">
    <div class="camp-section-head reveal"><h2>{t['res_h']}</h2></div>
    <ol class="vext-steps reveal">{res}
    </ol>
    <p class="vext-note reveal">{t['cancel']}</p>
  </div>
</section>

<section class="camp-section bg-white">
  <div class="container svc-faq-wrap">
    <div class="camp-section-head reveal"><h2>{t['faq_h']}</h2></div>
    <div class="camp-faq faq-list reveal">{faq}
    </div>
    <div class="final-cta reveal">
      <h2>{t['fin_h']}</h2>
      <p>{t['fin_p']}</p>
      <a href="#contacto" class="btn-primary svc-page-cta" {adv} data-cta="vext-cierre">{t['cta']}</a>
    </div>
  </div>
</section>

<section class="camp-section cross-sell-band">
  <div class="container cross-sell">
    <div class="cross-sell-text">
      <span class="cross-sell-eyebrow">{t['cross_e']}</span>
      <p>{t['cross_p']}</p>
    </div>
    <a href="#servicio-extranjero" data-jump-service="extranjero" class="cross-sell-cta">{t['cross_a']} {ARROW}</a>
  </div>
</section>
</div>

'''

for fichero, lang in (('index.html', 'es'), ('index-en.html', 'en')):
    p = W / fichero
    h = p.read_text(encoding="utf-8")
    m = re.search(r'<!-- ============ CAMPAMENTOS EN EL EXTRANJERO.*?\n</div>\n\n', h, re.S)
    assert m, fichero + ': no encuentro la página; ejecuta antes la versión que añade menú, tarjeta y pie'
    h = h.replace(m.group(0), vista(T[lang]), 1)
    # la tarjeta de la portada y el menú ya conocen los datos reales
    h = h.replace('<small>8–17 años · Verano</small>', '<small>8–17 años · Escocia e Inglaterra</small>').replace('<small>Ages 8–17 · Summer</small>', '<small>Ages 8–17 · Scotland and England</small>')
    p.write_text(h, encoding="utf-8")
    print(fichero, ': página sustituida')
