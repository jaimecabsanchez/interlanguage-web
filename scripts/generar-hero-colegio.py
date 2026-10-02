#!/usr/bin/env python3
# Genera la escalera de tamaños de la foto del hero de la home (AVIF + WebP + JPG de respaldo).
# Origen: scripts/fuentes/hero-arco-origen.png (2033 x 773, panorámica de ChatGPT: alumnos a la derecha y espacio
# libre a la izquierda para el texto del hero). Elegida por el usuario el 02-10-2026.
#  - SIN reescalado con IA y SIN enfoque: cambian las caras (pelo «pintado», halos) y el usuario quiere que no cambien.
#    Solo se reduce desde el original con Lanczos; el ancho mayor es el nativo (2033), sin ampliar.
#  - Único retoque: saturación −12 % y contraste −3 %, porque el original sale demasiado saturado (piel anaranjada,
#    verdes chillones). No afecta a la forma de las caras. Si se quiere la foto tal cual, poner GRADE = None.
#  - AVIF 4:4:4 (conserva los bordes finos de corbatas y faldas) y WebP con calidad alta.
import os
from PIL import Image, ImageEnhance
import pillow_avif  # noqa: F401  (registra el codificador AVIF en Pillow < 11.3)

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(HERE, '..', 'web-publica', 'images', 'internacional') + '/'
ORIGEN = HERE + '/fuentes/hero-arco-origen.png'
# Nombre base de los archivos. Si cambias la foto o el retoque, cambia el nombre: _headers marca las imágenes como
# immutable y con el mismo nombre quien ya visitó la web seguiría viendo la anterior.
NOMBRE = 'hero-arco'
GRADE = (0.88, 0.97)   # (saturación, contraste)
WIDTHS = (640, 960, 1280, 1600, 2033)

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
