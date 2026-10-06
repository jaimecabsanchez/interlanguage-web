#!/usr/bin/env python3
# Genera las fotos de «Estudiar en el extranjero» (cabecera y tarjetas de destino): escalera de anchos AVIF + WebP.
#
#   pip install pillow          (Pillow 11.3 o más: trae AVIF propio; con una versión anterior, pip install pillow-avif-plugin)
#   python3 scripts/generar-ext-fotos.py
#
# Origen: los JPG originales de web-publica/images/internacional/ (los mismos que ya usa la home). SIN reescalado con IA, SIN
# enfoque y SIN filtros de color: solo recortes 4:3 en las tarjetas y reducción con Lanczos (ver «Nitidez en Retina» en
# web-publica/AGENTS.md). Los anchos de cada escalera caen en el tamaño pintado exacto (1x y 2x) de los dos casos más
# habituales, para que el navegador elija un archivo nítido:
#   - tarjetas (392 px de ancho en escritorio >= 1280 px): 400 (1x), 790 (2x), 710 (móvil 2x, 344 px) y el nativo (móvil 3x);
#   - cabecera (la mitad de la ventana): 720 (1440 px, 1x), 960 (1920 px, 1x), 800 (móvil 2x), 1200 (móvil 3x) y el nativo (1440 px, 2x).
# Si cambias una foto o un recorte, cambia el nombre: _headers marca las imágenes como immutable y con el mismo nombre quien
# ya visitó la web seguiría viendo la anterior.
import os
from PIL import Image, features
if not features.check('avif'):
    import pillow_avif  # noqa: F401

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(HERE, '..', 'web-publica', 'images', 'internacional') + '/'

CARD_W = (400, 710, 790)          # + el ancho nativo del recorte (máx. 1000)
HERO_W = (400, 720, 800, 960, 1200)   # + el nativo (1448)

# nombre de salida, JPG de origen, recorte 4:3 (fracción vertical del sobrante; None = sin recortar), escalera, ancho máximo, JPG de respaldo que se crea (None = ya existe)
FOTOS = [
    ('ext-hero-campus', 'hero-campus-2.jpg',      None, HERO_W, 1448, None),
    ('ext-uk-colegio',  'vivirlo-colegio.jpg',    None, CARD_W, 1000, None),
    ('ext-ie-alumnas',  'extranjero-alumnas.jpg', 0.22, CARD_W, 1000, 'ext-ie-alumnas.jpg'),
    ('ext-us-football', 'usa-football.jpg',       0.45, CARD_W, 1000, 'ext-us-football.jpg'),
    ('ext-alo-rugby',   'irlanda-rugby.jpg',      None, (420, 710, 860), 1080, None),   # bloque «Alojamiento y vida escolar» (420 px de ancho en escritorio)
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
