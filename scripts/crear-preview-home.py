#!/usr/bin/env python3
"""Genera web-publica/preview-home.html a partir de index.html (vista previa del rediseño, sin tocar la home).
Uso: python3 scripts/crear-preview-home.py   ·   Ver en http://localhost:8402/web-publica/preview-home.html
Ambos archivos (preview-home.html y css/preview-home.css) están en .git/info/exclude: no se suben ni se publican."""
import re, pathlib
w = pathlib.Path(__file__).resolve().parent.parent / "web-publica"
h = (w / "index.html").read_text(encoding="utf-8")
h = h.replace("<head>", '<head>\n<meta name="robots" content="noindex,nofollow">', 1)
h = re.sub(r'<link rel="canonical"[^>]*>\n?', '', h)
import time
VER = int(time.time())
h = h.replace('<link rel="stylesheet" href="css/styles.css?v=124">',
              '<link rel="stylesheet" href="css/styles.css?v=124">\n<link rel="stylesheet" href="css/preview-home.css?v=@VER@">', 1).replace('@VER@', str(VER))
# la foto del hero ocupa ~72 % del ancho
h = re.sub(r'(<div class="hero-media">.*?</div>)', lambda m: m.group(1).replace('sizes="100vw"', 'sizes="(min-width:1025px) 72vw, 100vw"'), h, count=1, flags=re.S)

# ---------- «Un programa para cada momento»: cuatro tarjetas fotográficas ----------
EDADES = ["Desde 9–11 años hasta 18", "8–17 años", "De 5 años a 4.º de Primaria", "Aprox. 3–8 años"]
FRASES = ["Un curso en un colegio de otro país", "Un verano para vivir el inglés fuera", "El inglés, durante el curso escolar", "Vacaciones en inglés, sin salir de Madrid"]
KICKERS = ["Curso escolar", "Verano", "Después del cole", "Vacaciones"]
SIZES = 'sizes="(min-width:1100px) 820px, (min-width:641px) 840px, 100vw"'
m = re.search(r'<section class="services" id="servicios">.*?</section>', h, flags=re.S)
cards = re.findall(r'<a href="([^"]*)" class="svc-card2"([^>]*)>\s*<span class="svc-photo">(<picture>.*?</picture>)</span>.*?<h3>(.*?)</h3>.*?<span class="svc-more">(.*?)<svg', m.group(0), flags=re.S)
assert len(cards) == 4, len(cards)
ARROW = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
items = ""
for i, (href, attrs, pic, titulo, enlace) in enumerate(cards):
    pic = re.sub(r'sizes="[^"]*"', SIZES, pic)
    items += (f'      <a href="{href}" class="svc-card2 pgm-card pgm-card--{i+1}"{attrs}>\n'
              f'        <span class="pgm-photo">{pic}</span>\n'
              f'        <span class="pgm-age">{EDADES[i]}</span>\n'
              f'        <span class="pgm-ring" aria-hidden="true">{ARROW}</span>\n'
              f'        <span class="pgm-body"><span class="pgm-kicker">{KICKERS[i]}</span><h3>{titulo}</h3><span class="pgm-line">{FRASES[i]}</span>'
              f'<span class="pgm-go">{enlace.strip()} {ARROW}</span></span>\n'
              f'      </a>\n')
nueva = f'''<section class="services pgm" id="servicios">
  <div class="container">
    <div class="pgm-head">
      <div>
        <span class="eyebrow">Qué ofrecemos</span>
        <h2>Cada etapa, una nueva forma de aprender inglés</h2>
      </div>
      <p>Durante el curso, en verano o viviendo una experiencia en el extranjero. Un programa para cada momento.</p>
    </div>
    <div class="pgm-grid">
{items}    </div>
    <p class="svc-note">Las edades son orientativas: cada programa confirma sus requisitos.</p>
  </div>
</section>'''
h = h.replace(m.group(0), nueva, 1).replace('@VER@', str(VER))

# ---------- «Crecemos con cada alumno»: recorrido en tres etapas ----------
def foto(carpeta, base, anchos, w, h, alt, sizes, eager=False):
    def ss(ext): return ", ".join(f"images/{carpeta}/{base}-{a}.{ext} {a}w" for a in anchos)
    return (f'<picture><source type="image/avif" srcset="{ss("avif")}" sizes="{sizes}">'
            f'<source type="image/webp" srcset="{ss("webp")}" sizes="{sizes}">'
            f'<img src="images/{carpeta}/{base}.jpg" alt="{alt}" width="{w}" height="{h}" loading="lazy" decoding="async"></picture>')
F1 = foto("campamentos", "ninos-pintando", [480, 800, 1086], 1086, 1448, "Niños pequeños dibujando juntos en una mesa de clase", "(min-width:761px) 220px, 200px")
F2 = foto("extraescolar", "extraescolar-grupo", [480, 800, 1200, 1448], 1448, 1086, "Un grupo de niños levanta la mano en una clase", "(min-width:761px) 320px, 280px")
F3 = foto("internacional", "campus-paseo", [380, 580, 860, 1200], 1470, 827, "Cinco alumnos con uniforme caminan juntos junto a un edificio de piedra con torres", "(min-width:761px) 440px, 320px")
ARROW2 = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
crece = f"""<section class="growth" id="progresion">
  <div class="container">
    <div class="gr-head">
      <span class="eyebrow">De la infancia a la adolescencia</span>
      <h2>Crecemos con cada alumno</h2>
      <p class="gr-lead">Del primer <em>hello</em> a descubrir el mundo.</p>
    </div>
    <ol class="gr-track" aria-label="Etapas del aprendizaje">
      <li class="gr-step gr-step--1">
        <span class="gr-node" aria-hidden="true"></span>
        <span class="gr-age"><small>Desde los</small><b>3</b> años</span>
        <figure class="gr-photo">{F1}</figure>
        <span class="gr-stage">Etapa 1</span>
        <h3>Descubrir</h3>
        <p>Primer contacto con el inglés. Juegos, canciones y primeras conversaciones.</p>
        <span class="gr-prog">Campamentos en Madrid · Extraescolares</span>
      </li>
      <li class="gr-step gr-step--2">
        <span class="gr-node" aria-hidden="true"></span>
        <span class="gr-age"><small>Desde los</small><b>7</b> años</span>
        <figure class="gr-photo">{F2}</figure>
        <span class="gr-stage">Etapa 2</span>
        <h3>Ganar confianza</h3>
        <p>Aprender a expresarse y comunicarse, con más autonomía y seguridad con el idioma.</p>
        <span class="gr-prog">Extraescolares · Campamentos en Madrid y en el extranjero</span>
      </li>
      <li class="gr-step gr-step--3">
        <span class="gr-node" aria-hidden="true"></span>
        <span class="gr-age"><small>Desde los</small><b>12</b> años</span>
        <figure class="gr-photo">{F3}</figure>
        <span class="gr-stage">Etapa 3</span>
        <h3>Dar el salto</h3>
        <p>Campamentos internacionales y experiencias escolares en el extranjero: nuevos entornos y más independencia.</p>
        <a class="gr-link" href="#servicio-extranjero" data-jump-service="extranjero" data-cta="progresion-extranjero">Estudiar en el extranjero {ARROW2}</a>
      </li>
      <li class="gr-end" aria-hidden="true"><b>18</b> años</li>
    </ol>
    <p class="gr-close">Su mundo crece. <em>Nosotros seguimos a su lado.</em></p>
    <p class="svc-note">Las edades son orientativas y se solapan: cada programa fija las suyas.</p>
  </div>
</section>"""
m2 = re.search(r'<section class="age-path" id="progresion">.*?</section>', h, flags=re.S)
h = h.replace(m2.group(0), crece, 1)
# (la información de los destinos al pasar el cursor ya está en la home real: index.html + styles.css)

h = h.replace('</body>', '<script src="js/preview-home.js?v=@VER@" defer></script>\n</body>', 1)
h = h.replace("</body>", '<span class="preview-tag" aria-hidden="true">Vista previa</span>\n</body>', 1)
h = h.replace("@VER@", str(VER))
(w / "preview-home.html").write_text(h, encoding="utf-8")
print("ok → web-publica/preview-home.html")
