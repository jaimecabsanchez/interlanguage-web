#!/usr/bin/env python3
# Genera la escalera de tamaños de la foto del hero de la home (AVIF + WebP + JPG de respaldo).
# Origen: images/internacional/hero-campus-2.jpg (1448 x 1086), espejada para que los alumnos queden a la derecha
# y el texto del hero a la izquierda. Es la resolución máxima real de la foto.
#  - 640 a 1448: reducción con Lanczos (1448 = nativa, sin tocar).
#  - 1920 a 2880: ampliación con Lanczos + una máscara de enfoque muy suave (radio 1,2, 35 %, umbral 2).
#    No añade detalle: evita que el navegador amplíe la foto con su escalador (que la ablanda entre 1,05x y 1,4x)
#    y la sirve a 1:1 en pantallas grandes y Retina. Sin ruido, sin filtros de color: la foto no pierde naturalidad.
#  - AVIF 4:4:4 (conserva los bordes finos de corbatas y faldas) y WebP con calidad alta.
import os
from PIL import Image, ImageFilter, ImageOps
import pillow_avif  # noqa: F401  (registra el codificador AVIF en Pillow < 11.3)

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'web-publica', 'images', 'internacional') + '/'
src = ImageOps.mirror(Image.open(BASE + 'hero-campus-2.jpg').convert('RGB'))
NATIVE = src.width
for w in (640, 960, 1280, 1448, 1920, 2560, 2880):
    if w == NATIVE:
        im = src
    elif w < NATIVE:
        im = src.resize((w, round(src.height * w / src.width)), Image.LANCZOS)
    else:
        im = src.resize((w, round(src.height * w / src.width)), Image.LANCZOS)
        im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=35, threshold=2))
    qa, qw = (72, 87) if w <= NATIVE else (66, 82)
    im.save('%shero-colegio-%d.avif' % (BASE, w), quality=qa, speed=4, subsampling='4:4:4')
    im.save('%shero-colegio-%d.webp' % (BASE, w), quality=qw, method=6)
    print(w, 'ok')
src.save(BASE + 'hero-colegio.jpg', quality=86, progressive=True, optimize=True)
print('hero-colegio.jpg ok')
