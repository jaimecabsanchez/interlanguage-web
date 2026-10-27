#!/usr/bin/env python3
"""Añade la página «Campamentos en el extranjero» (#servicio-verano-extranjero) a index.html e index-en.html
y la enlaza desde el menú, la tarjeta de la portada y el pie. Se ejecuta UNA vez: después los textos se editan
directamente en el HTML (todo lo que está dentro de <mark class="fill">…</mark> es provisional y hay que confirmarlo)."""
import pathlib, re

W = pathlib.Path(__file__).resolve().parent.parent / "web-publica"
ARROW = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
IC = {
  'edad': '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4.5 4-7 7-7s6 2.5 7 7" stroke-linecap="round"/></svg>',
  'fecha': '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18" stroke-linecap="round"/></svg>',
  'lugar': '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.4-7-11.5A7 7 0 0112 2a7 7 0 017 7.5C19 14.6 12 21 12 21z" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  'precio': '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 20 10a2 2 0 010 2.8L13.8 19a2 2 0 01-2.8 0L3 11V3h8z" stroke-linejoin="round"/><circle cx="7" cy="7" r="1.2" fill="currentColor" stroke="none"/></svg>',
  'habla': '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 15a2 2 0 0 1-2 2H8l-4 3V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z" stroke-linejoin="round"/><path d="M8 9h8M8 12.5h5" stroke-linecap="round"/></svg>',
  'grupo': '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8.5" cy="8" r="3"/><path d="M2.5 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke-linecap="round"/><circle cx="17.5" cy="9" r="2.4"/><path d="M16 12.2c2.2.4 3.7 2 4.3 3.7" stroke-linecap="round"/></svg>',
  'mundo': '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9Z"/></svg>',
  'escudo': '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" stroke-linejoin="round"/><path d="m8.5 12 2.5 2.5 4.5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
}

def foto(base, carpeta, anchos, w, h, alt, sizes, eager=False):
    ss = lambda ext: ", ".join(f"images/{carpeta}/{base}-{a}.{ext} {a}w" for a in anchos)
    load = 'fetchpriority="high"' if eager else 'loading="lazy"'
    return (f'<picture><source type="image/avif" srcset="{ss("avif")}" sizes="{sizes}">'
            f'<source type="image/webp" srcset="{ss("webp")}" sizes="{sizes}">'
            f'<img src="images/{carpeta}/{base}.jpg" alt="{alt}" width="{w}" height="{h}" {load} decoding="async"></picture>')

def F(t): return f'<mark class="fill">{t}</mark>'

T = {
 'es': dict(
  title="Campamentos de verano en el extranjero", back="← Volver a servicios", eyebrow="Campamento de verano en el extranjero",
  h1="Un verano para vivir el inglés fuera de casa",
  intro="Unas semanas en otro país, con clases de inglés, actividades y alumnos de todo el mundo. Para que vuelvan hablando más, con más confianza y con amigos nuevos.",
  qf=[('edad','8–17 años','Según programa'), ('lugar',F('Reino Unido e Irlanda'),'Destinos'), ('fecha',F('Julio · 2 o 3 semanas'),'Fechas y duración'), ('precio',F('Desde … €'),'Precio orientativo')],
  note="Los destinos, las fechas y el precio de cada campamento se confirman al pedir información.",
  cta="Pedir información", cta2="Ver cómo es un día",
  alt="Niños con casco y chaleco salvavidas levantan los brazos, riendo, en una canoa roja sobre un lago",
  why_h="Por qué un campamento fuera", why_p="El inglés deja de ser una asignatura y se convierte en la lengua del día a día.",
  why=[('habla','Inglés todos los días', F('Clases por la mañana, en grupos por nivel, con profesores nativos.')),
       ('grupo','Alumnos de otros países', F('Conviven con chicos y chicas de distintas nacionalidades: el inglés es lo que tienen en común.')),
       ('mundo','Actividades y excursiones', F('Deporte, talleres y visitas a ciudades y lugares de interés cada semana.')),
       ('escudo','Acompañados en todo momento', F('Monitores en el campus las 24 horas y un equipo de Interlanguage pendiente de cada alumno.'))],
  dest_h="Destinos", dest_p="Cada destino tiene su propio programa. Os ayudamos a elegir el que mejor encaja con su edad y su nivel.",
  dest=[(F('Nombre del campamento o del colegio'), F('Ciudad · Reino Unido'), F('Edades, tipo de alojamiento y lo más especial de este programa.'), 'uk'),
        (F('Nombre del campamento o del colegio'), F('Ciudad · Irlanda'), F('Edades, tipo de alojamiento y lo más especial de este programa.'), 'ie'),
        (F('Nombre del campamento o del colegio'), F('Ciudad · País'), F('Edades, tipo de alojamiento y lo más especial de este programa.'), 'us')],
  dest_alt=['Edificio de un colegio en el Reino Unido con alumnos en el césped', 'Edificio de piedra de un colegio en Irlanda', 'Campus de un colegio con edificio de ladrillo'],
  day_h="Un día en el campamento", day=['Desayuno', 'Clases de inglés', 'Comida', 'Actividades o excursión', 'Cena y actividad de noche'],
  day_note=F('Horario orientativo: cada campamento tiene el suyo.'),
  inc_h="Qué incluye", inc=[F('Clases de inglés con profesores nativos'), F('Alojamiento y pensión completa'), F('Actividades y excursiones del programa'), F('Seguro médico y de viaje'), F('Traslados desde y hasta el aeropuerto')],
  noinc_h="Qué no incluye", noinc=[F('Vuelos (os ayudamos a organizarlos)'), F('Dinero de bolsillo'), F('Actividades opcionales con coste aparte')],
  seg_h="Acompañamiento y seguridad", seg_p="Lo que más preocupa a una familia, explicado claramente.",
  seg=[('Antes de salir', F('Reunión con la familia, documentación y todo lo que hay que llevar.')),
       ('El viaje', F('Vuelo en grupo desde Madrid con un monitor de Interlanguage.')),
       ('Durante la estancia', F('Monitores en el campus las 24 horas y un teléfono de contacto para las familias.')),
       ('Contacto con casa', F('Cómo y cuándo pueden hablar con vosotros durante el campamento.'))],
  pre_h="Fechas y precios", pre_p="El precio depende del destino y de la duración. Os enviamos el presupuesto cerrado de cada opción.",
  pre=[(F('2 semanas'), F('Desde … €')), (F('3 semanas'), F('Desde … €')), (F('4 semanas'), F('Desde … €'))],
  pre_note=F('Fechas de la edición 2027: del … al … de julio.'),
  res_h="Cómo se reserva", res=[('Nos contáis qué buscáis', 'Edad, nivel de inglés, fechas y presupuesto.'), ('Os proponemos opciones', 'Los campamentos que encajan, con su precio y lo que incluyen.'), ('Reserváis la plaza', F('Con una señal de … €; el resto, antes de …')), ('Preparamos la salida', 'Documentación, maleta y reunión antes del viaje.')],
  faq_h="Preguntas frecuentes",
  faq=[('¿Desde qué edad pueden ir?', F('Desde los 8 años en algunos programas; la mayoría son para 10 a 17 años.')),
       ('¿Qué nivel de inglés necesitan?', F('No hace falta un nivel concreto: se hace una prueba al llegar y se colocan en un grupo de su nivel.')),
       ('¿Viajan solos?', F('Viajan en grupo desde Madrid, acompañados por un monitor de Interlanguage.')),
       ('¿Hay otros alumnos españoles?', F('Los campamentos tienen alumnos de muchos países; intentamos que haya pocos españoles en cada grupo.')),
       ('¿Qué pasa si se pone enfermo?', F('El campamento tiene servicio médico y el seguro cubre la atención; os avisamos enseguida.')),
       ('¿Cuándo hay que reservar?', F('Las plazas se llenan pronto: os recomendamos reservar antes de …'))],
  fin_h="¿Le buscamos su campamento?", fin_p="Contadnos su edad, su nivel y qué fechas tenéis en mente, y os proponemos las opciones que mejor encajan. La orientación es gratuita.",
  cross_e="¿Y después del verano?", cross_p="Si el campamento le engancha, el siguiente paso puede ser un trimestre o un curso escolar en el extranjero.", cross_a="Estudiar en el extranjero",
  menu_madrid="Campamentos en Madrid", menu_title="En el extranjero", menu_item="Campamentos en el extranjero", menu_small="8–17 años · Verano",
  card_more="Ver campamentos", footer="Campamentos en el extranjero",
  note_adv="Interés: campamento de verano en el extranjero"),
 'en': dict(
  title="Summer camps abroad", back="← Back to programmes", eyebrow="Summer camp abroad",
  h1="A summer living English away from home",
  intro="A few weeks in another country, with English lessons, activities and students from all over the world. So they come back speaking more, with more confidence and new friends.",
  qf=[('edad','Ages 8–17','Depending on programme'), ('lugar',F('United Kingdom and Ireland'),'Destinations'), ('fecha',F('July · 2 or 3 weeks'),'Dates and length'), ('precio',F('From … €'),'Guide price')],
  note="Destinations, dates and the price of each camp are confirmed when you ask for information.",
  cta="Ask for information", cta2="See a typical day",
  alt="Children in helmets and life jackets raise their arms, laughing, in a red canoe on a lake",
  why_h="Why a camp abroad", why_p="English stops being a school subject and becomes the language of everyday life.",
  why=[('habla','English every day', F('Morning lessons in groups by level, with native teachers.')),
       ('grupo','Students from other countries', F('They live alongside boys and girls of many nationalities: English is what they share.')),
       ('mundo','Activities and excursions', F('Sport, workshops and visits to cities and places of interest every week.')),
       ('escudo','Looked after at all times', F('Staff on campus 24 hours a day and an Interlanguage team keeping an eye on every student.'))],
  dest_h="Destinations", dest_p="Each destination has its own programme. We help you choose the one that best fits their age and level.",
  dest=[(F('Name of the camp or school'), F('City · United Kingdom'), F('Ages, type of accommodation and what makes this programme special.'), 'uk'),
        (F('Name of the camp or school'), F('City · Ireland'), F('Ages, type of accommodation and what makes this programme special.'), 'ie'),
        (F('Name of the camp or school'), F('City · Country'), F('Ages, type of accommodation and what makes this programme special.'), 'us')],
  dest_alt=['School building in the United Kingdom with students on the lawn', 'Stone school building in Ireland', 'School campus with a brick building'],
  day_h="A day at camp", day=['Breakfast', 'English lessons', 'Lunch', 'Activities or excursion', 'Dinner and evening activity'],
  day_note=F('Guide timetable: each camp has its own.'),
  inc_h="What is included", inc=[F('English lessons with native teachers'), F('Accommodation and full board'), F('Programme activities and excursions'), F('Medical and travel insurance'), F('Airport transfers')],
  noinc_h="What is not included", noinc=[F('Flights (we help you arrange them)'), F('Pocket money'), F('Optional activities at extra cost')],
  seg_h="Supervision and safety", seg_p="What matters most to families, explained clearly.",
  seg=[('Before departure', F('A meeting with the family, paperwork and everything they need to pack.')),
       ('The journey', F('Group flight from Madrid with an Interlanguage group leader.')),
       ('During the stay', F('Staff on campus 24 hours a day and a contact phone number for families.')),
       ('Keeping in touch', F('How and when they can talk to you during the camp.'))],
  pre_h="Dates and prices", pre_p="The price depends on the destination and the length of stay. We send you a fixed quote for each option.",
  pre=[(F('2 weeks'), F('From … €')), (F('3 weeks'), F('From … €')), (F('4 weeks'), F('From … €'))],
  pre_note=F('2027 dates: from … to … July.'),
  res_h="How to book", res=[('Tell us what you are looking for', 'Age, English level, dates and budget.'), ('We suggest options', 'The camps that fit, with their price and what they include.'), ('You book the place', F('With a deposit of … €; the rest before …')), ('We prepare the departure', 'Paperwork, packing list and a meeting before the trip.')],
  faq_h="Frequently asked questions",
  faq=[('From what age can they go?', F('From age 8 on some programmes; most are for ages 10 to 17.')),
       ('What level of English do they need?', F('No particular level: they take a test on arrival and join a group at their level.')),
       ('Do they travel alone?', F('They travel as a group from Madrid, with an Interlanguage group leader.')),
       ('Are there other Spanish students?', F('The camps have students from many countries; we aim for few Spanish students in each group.')),
       ('What if they fall ill?', F('The camp has medical care and the insurance covers treatment; we let you know straight away.')),
       ('When should we book?', F('Places fill up early: we recommend booking before …'))],
  fin_h="Shall we find their camp?", fin_p="Tell us their age, their level and the dates you have in mind, and we will suggest the options that fit best. Our guidance is free.",
  cross_e="And after the summer?", cross_p="If they love the camp, the next step could be a term or a school year abroad.", cross_a="Study abroad",
  menu_madrid="Summer camps in Madrid", menu_title="Abroad", menu_item="Summer camps abroad", menu_small="Ages 8–17 · Summer",
  card_more="See camps", footer="Summer camps abroad",
  note_adv="Interest: summer camp abroad"),
}

def vista(t):
    hero = foto('campamento-extranjero-canoa', 'internacional', [470, 710, 1030, 1536], 1536, 864, t['alt'], '(max-width:900px) 100vw, 50vw', eager=True)
    adv = f'data-advise="extranjero" data-advise-note="{t["note_adv"]}"'
    qf = "".join(f'\n        <div class="camp-quickfact"><div class="camp-quickfact-ic">{IC[i]}</div><div><strong>{a}</strong><span>{b}</span></div></div>' for i, a, b in t['qf'])
    why = "".join(f'\n      <div class="pillar-card"><span class="pillar-ic">{IC[i]}</span><h3>{h}</h3><p>{p}</p></div>' for i, h, p in t['why'])
    imgs = {'uk': ('uk-campus', [480, 720, 960, 1122], 1122, 701), 'ie': ('ie-campus', [480, 720, 960, 1122], 1122, 701), 'us': ('us-campus', [480, 720, 960, 1122], 1122, 701)}
    dest = ""
    for k, (n, l, d, im) in enumerate(t['dest']):
        b, a, w, h = imgs[im]
        dest += (f'\n      <article class="vext-dest"><div class="vext-dest-media">{foto(b, "internacional", a, w, h, t["dest_alt"][k], "(min-width:901px) 33vw, 100vw")}</div>'
                 f'<div class="vext-dest-body"><span class="vext-dest-place">{l}</span><h3>{n}</h3><p>{d}</p></div></article>')
    day = "".join(f'\n      <div class="day-step"><span class="day-step-ic">{k+1}</span><span>{s}</span></div>' for k, s in enumerate(t['day']))
    inc = "".join(f'<li>{x}</li>' for x in t['inc']); noinc = "".join(f'<li>{x}</li>' for x in t['noinc'])
    seg = "".join(f'\n      <div class="club-card"><h3 class="club-stage">{h}</h3><p>{p}</p></div>' for h, p in t['seg'])
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

<section class="camp-section bg-cream">
  <div class="container">
    <div class="camp-section-head reveal"><h2>{t['why_h']}</h2><p>{t['why_p']}</p></div>
    <div class="pillar-grid reveal">{why}
    </div>
  </div>
</section>

<section class="camp-section bg-white" id="vext-destinos">
  <div class="container">
    <div class="camp-section-head reveal"><h2>{t['dest_h']}</h2><p>{t['dest_p']}</p></div>
    <div class="vext-dest-grid reveal">{dest}
    </div>
  </div>
</section>

<section class="camp-section bg-cream" id="vext-dia">
  <div class="container">
    <div class="camp-section-head reveal"><h2>{t['day_h']}</h2></div>
    <div class="day-timeline reveal">{day}
    </div>
    <p class="vext-note reveal">{t['day_note']}</p>
  </div>
</section>

<section class="camp-section bg-mint">
  <div class="container">
    <div class="ideal-layout">
      <div class="ideal-block reveal"><h2>{t['inc_h']}</h2><ul>{inc}</ul></div>
      <div class="ideal-block vext-noinc reveal"><h2>{t['noinc_h']}</h2><ul>{noinc}</ul></div>
    </div>
  </div>
</section>

<section class="camp-section bg-white">
  <div class="container">
    <div class="camp-section-head reveal"><h2>{t['seg_h']}</h2><p>{t['seg_p']}</p></div>
    <div class="club-grid reveal">{seg}
    </div>
  </div>
</section>

<section class="camp-section bg-cream" id="vext-precio">
  <div class="container">
    <div class="camp-section-head reveal"><h2>{t['pre_h']}</h2><p>{t['pre_p']}</p></div>
    <div class="camp-price-grid vext-price-grid reveal">{pre}
    </div>
    <p class="camp-price-extra reveal">{t['pre_note']}</p>
  </div>
</section>

<section class="camp-section bg-white">
  <div class="container">
    <div class="camp-section-head reveal"><h2>{t['res_h']}</h2></div>
    <ol class="vext-steps reveal">{res}
    </ol>
  </div>
</section>

<section class="camp-section bg-cream">
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

def aplicar(fichero, t):
    p = W / fichero
    h = p.read_text(encoding="utf-8")
    if 'view-service-verano-extranjero' in h:
        print(fichero, ": ya tiene la página, no se toca"); return
    # 1) página nueva, antes de «Estudiar en el extranjero»
    ancla = '<div id="view-service-extranjero"'
    assert h.count(ancla) == 1
    h = h.replace(ancla, vista(t) + ancla, 1)
    # 2) menú: «En Madrid» con el nombre nuevo y columna «En el extranjero»
    m = re.search(r'(<div class="nav-dropdown-menu mega" id="servicesMenu">.*?)(\n        </div>\n      </div>)', h, re.S)
    menu = m.group(1)
    arrow = re.search(r'<svg class="mega-item-arrow".*?</svg>', menu, re.S).group(0)
    menu = re.sub(r'(data-jump-service="campamentos" class="mega-item">\s*<strong>)[^<]*', lambda x: x.group(1) + t['menu_madrid'], menu, count=1)
    col = (f'\n          <div class="mega-col">\n            <span class="mega-col-title">{t["menu_title"]}</span>\n'
           f'            <a href="#servicio-verano-extranjero" data-jump-service="verano-extranjero" class="mega-item">\n'
           f'              <strong>{t["menu_item"]}</strong>\n              <small>{t["menu_small"]}</small>\n              {arrow}\n            </a>\n          </div>')
    h = h.replace(m.group(0), menu + col + m.group(2), 1)
    # 3) tarjeta de la portada: abre la página en vez del formulario
    c = re.search(r'<a href="#contacto" class="svc-card2" data-advise="extranjero" data-advise-note="[^"]*" data-cta="svc-campamento-extranjero">', h)
    assert c, fichero
    h = h.replace(c.group(0), '<a href="#servicio-verano-extranjero" class="svc-card2" data-service="verano-extranjero" data-cta="svc-campamento-extranjero">', 1)
    i = h.index('data-service="verano-extranjero"')
    j = h.index('<span class="svc-more">', i); k = h.index('<svg', j)
    h = h[:j] + '<span class="svc-more">' + t['card_more'] + ' ' + h[k:]
    # 4) pie
    f = re.search(r'(<li><a href="#servicio-campamentos" data-jump-service="campamentos">[^<]*</a></li>)', h)
    h = h.replace(f.group(1), f.group(1) + f'\n        <li><a href="#servicio-verano-extranjero" data-jump-service="verano-extranjero">{t["footer"]}</a></li>', 1)
    p.write_text(h, encoding="utf-8")
    print(fichero, ": página, menú, tarjeta y pie añadidos")

aplicar('index.html', T['es'])
aplicar('index-en.html', T['en'])
