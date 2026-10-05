#!/usr/bin/env python3
# Genera la escalera de tamaños de la foto del hero de la home (AVIF + WebP + JPG de respaldo).
#
#   pip install pillow opencv-contrib-python-headless numpy       (Pillow 11.3 o más: trae AVIF propio, con mejor calidad)
#   python3 scripts/generar-hero-colegio.py
#
# Origen (05-10-2026, 3.ª versión): scripts/_cache/hero-arco-3-origen.png, 2000 x 760: la panorámica «alumnos más lejos» de
# ChatGPT (misma escena que hero-arco, con el campus a la vista y el texto a la izquierda) con las CABEZAS de los cinco
# alumnos sustituidas por versiones más naturales. Se compone con scripts/componer-hero-alumno-central.py y
# scripts/componer-hero-alumnos.py (este script los ejecuta solos si falta el origen). La versión anterior (hero-arco-*,
# 2033 x 773, alumnos más cerca) sigue en el repo por si hay que volver.
#  - SIN reescalado con IA y SIN enfoque: cambian las caras (pelo «pintado», halos) y el usuario quiere que no cambien.
#    Solo se reduce desde el origen con Lanczos; el ancho mayor es el nativo (2000), sin ampliar.
#  - GRADE = None: esta foto ya sale con colores naturales (las luces de las cabezas nuevas se comprimen al componerlas).
#    El hero anterior llevaba saturación −12 % y contraste −3 % porque su original salía demasiado saturado.
#  - AVIF 4:4:4 (conserva los bordes finos de corbatas y faldas) y WebP con calidad alta.
import os
import subprocess
import sys
from PIL import Image, ImageEnhance, features
if not features.check('avif'):
    import pillow_avif  # noqa: F401  (Pillow < 11.3 no trae AVIF; con 11.3 o más se usa el codificador nativo, que da más calidad)

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(HERE, '..', 'web-publica', 'images', 'internacional') + '/'
ORIGEN = HERE + '/_cache/hero-arco-3-origen.png'
# Nombre base de los archivos. Si cambias la foto o el retoque, cambia el nombre: _headers marca las imágenes como
# immutable y con el mismo nombre quien ya visitó la web seguiría viendo la anterior.
NOMBRE = 'hero-arco-3'
GRADE = None   # (saturación, contraste) o None
WIDTHS = (640, 960, 1280, 1600, 2000)

if not os.path.exists(ORIGEN):
    subprocess.check_call([sys.executable, HERE + '/componer-hero-alumno-central.py'])
    subprocess.check_call([sys.executable, HERE + '/componer-hero-alumnos.py'])

src = Image.open(ORIGEN).convert('RGB')
if GRADE:
    src = ImageEnhance.Contrast(ImageEnhance.Color(src).enhance(GRADE[0])).enhance(GRADE[1])

for w in WIDTHS:
    im = src if w >= src.width else src.resize((w, round(src.height * w / src.width)), Image.LANCZOS)
    im.save('%s%s-%d.avif' % (BASE, NOMBRE, w), quality=82, speed=4, subsampling='4:4:4')
    im.save('%s%s-%d.webp' % (BASE, NOMBRE, w), quality=90, method=6)
    print(w, 'ok')

src.resize((1600, round(src.height * 1600 / src.width)), Image.LANCZOS).save(BASE + NOMBRE + '.jpg', quality=90, progressive=True, optimize=True)
print(NOMBRE + '.jpg ok')
