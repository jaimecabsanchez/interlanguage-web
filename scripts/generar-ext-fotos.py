#!/usr/bin/env python3
# Genera las fotos de «Estudiar en el extranjero» (escenas y filas de destino): escalera de anchos AVIF + WebP.
#
#   pip install pillow          (Pillow 11.3 o más: trae AVIF propio; con una versión anterior, pip install pillow-avif-plugin)
#   python3 scripts/generar-ext-fotos.py
#
# Origen: los JPG originales de web-publica/images/internacional/ (los mismos que ya usa la home). SIN reescalado con IA, SIN
# enfoque y SIN filtros de color: solo recortes (3:2 en las tarjetas de destino) y reducción con Lanczos (ver «Nitidez en Retina» en
# web-publica/AGENTS.md). Los anchos de cada escalera caen en el tamaño pintado exacto (1x y 2x) de los dos casos más
# habituales, para que el navegador elija un archivo nítido:
#   - filas de destino (230 px en escritorio; a todo el ancho en móvil): 400 (1x), 710 (2x y móvil 2x), 790 y el nativo (móvil 3x);
#   - escena con una foto (584 px en escritorio >= 1328 px): 590 (1x) y 1180 (2x), más peldaños para anchos intermedios;
#   - escena con dos fotos 4:5 (285 px cada una): 290 (1x), 580 (2x) y 430/870 para anchos intermedios.
# El héroe a sangre usa la panorámica de la portada (hero-arco-3-*, ver generar-hero-colegio.py): no se genera aquí.
# Si cambias una foto o un recorte, cambia el nombre: _headers marca las imágenes como immutable y con el mismo nombre quien
# ya visitó la web seguiría viendo la anterior.
import os
from PIL import Image, features
if not features.check('avif'):
    import pillow_avif  # noqa: F401

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(HERE, '..', 'web-publica', 'images', 'internacional') + '/'

CARD_W = (400, 710, 790)              # + el nativo del recorte (máx. 1000): filas de destino (230 px de ancho en escritorio, a todo el ancho en móvil)
ESC_W = (480, 590, 780, 960, 1180)    # + el nativo: foto de una escena (584 px de ancho en escritorio >= 1328 px)
GAL_W = (360, 520, 720)                # + el nativo (máx. 1000): galería «Más actividades» (de 163 px en móvil a unos 450 px en escritorio)
DUO_W = (290, 430, 580, 870)          # + el nativo: dúo de fotos verticales 4:5 de una escena (285 px de ancho cada una en escritorio)

# nombre de salida, JPG de origen, recorte 4:3 (fracción vertical del sobrante; None = sin recortar), escalera, ancho máximo, JPG de respaldo que se crea (None = ya existe)
FOTOS = [
    ('ext-esc-lab',    'extranjero-lab.jpg',    None, ESC_W,  1200, None),   # escena «Estudiar»
    ('ext-esc-campus', 'hero-campus-2.jpg',      None, ESC_W,  1448, None),   # escena «Vivir»
    ('ext-uk-balcon', 'uk-balcon.jpg',          None, CARD_W, 1000, None),   # tarjeta del Reino Unido (foto aportada por Jaime el 07-10-2026, recorte 3:2 a 1200 px en uk-balcon.jpg)
    ('ext-ie-escalera', 'ie-escalera.jpg',      None, CARD_W, 1000, None),   # tarjeta de Irlanda (foto aportada por Jaime el 07-10-2026, recorte 3:2 a 1200 px en ie-escalera.jpg)
    ('ext-us-aula',   'usa-aula.jpg',         None, CARD_W, 1000, None),   # tarjeta y fila de Estados Unidos (foto de aula 4:3 aportada por Jaime, reducida a 1000 px en usa-aula.jpg)
    ('usa-aula-v',    'usa-aula-vertical.jpg', None, (480, 800), 1000, None),   # tarjeta de Estados Unidos de la portada (4:5, recorte de la foto de aula; en móvil usa ext-us-aula 16:10)
    ('ext-duo-rugby', 'irlanda-rugby.jpg',       None, DUO_W,  1080, None),   # escena «Practicar» (izquierda)
    ('ext-duo-golf', 'uk-golf.jpg',              None, DUO_W,  1000, None),   # escena «Practicar» (derecha)
    # galería «Más actividades que pueden formar parte de su día» (10 fotos aportadas por Jaime el 06-10-2026; el JPG de origen ya está reducido a 1000 px)
    ('ext-gal-cocina', 'gal-cocina.jpg', None, GAL_W, 1000, None),
    ('ext-gal-robotica', 'gal-robotica.jpg', None, GAL_W, 1000, None),
    ('ext-gal-equitacion', 'gal-equitacion.jpg', None, GAL_W, 1000, None),
    ('ext-gal-orquesta', 'gal-orquesta.jpg', None, GAL_W, 1000, None),
    ('ext-gal-piano', 'gal-piano.jpg', None, GAL_W, 1000, None),
    ('ext-gal-arte', 'gal-arte.jpg', None, GAL_W, 1000, None),
    ('ext-gal-ciencias', 'gal-ciencias.jpg', None, GAL_W, 1000, None),
    ('ext-gal-teatro', 'gal-teatro.jpg', None, GAL_W, 1000, None),
    ('ext-gal-remo', 'gal-remo.jpg', None, GAL_W, 1000, None),
    ('ext-gal-tenis', 'gal-tenis.jpg', None, GAL_W, 1000, None),
]

for nombre, origen, cy, anchos, tope, respaldo in FOTOS:
    src = Image.open(BASE + origen).convert('RGB')
    if cy is not None:   # recorte 4:3 a partir de una foto vertical
        ch = round(src.width * 3 / 4)
        y0 = round((src.height - ch) * cy)
        src = src.crop((0, y0, src.width, y0 + ch))
    if respaldo:
        src.save(BASE + respaldo, quality=88, progressive=True, optimize=True)
    maximo = min(src.width, tope)
    escalera = sorted(set([w for w in anchos if w < maximo * 0.97] + [maximo]))
    for w in escalera:
        im = src if w == src.width else src.resize((w, round(src.height * w / src.width)), Image.LANCZOS)
        im.save('%s%s-%d.avif' % (BASE, nombre, w), quality=68, speed=4)
        im.save('%s%s-%d.webp' % (BASE, nombre, w), quality=86, method=6)
    print(nombre, escalera, '%dx%d' % src.size)
