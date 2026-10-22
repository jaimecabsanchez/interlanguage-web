#!/usr/bin/env python3
# Cabecera de «Estudiar en el extranjero» (22-10-2026): colegio de piedra con alumnos paseando, foto aportada por Jaime (1672 x 941).
# Se da la vuelta (espejo) para que los cuatro alumnos queden a la DERECHA, fuera del velo y del texto, y se recorta 2,5:1 (algo más cerca).
# Sin filtros ni retoque. Escalera AVIF/WebP. Si cambias la foto, cambia el nombre (`_headers` las marca immutable).
from PIL import Image
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'web-publica', 'images', 'internacional') + '/'
src = Image.open(os.path.join(ROOT, 'scripts', 'fuentes', 'hero-extranjero-colegio.webp')).convert('RGB').transpose(Image.FLIP_LEFT_RIGHT)
c = src.crop((182, 272, 182 + 1454, 272 + 582))      # 1454 x 582 (2,5:1)
nombre = 'ext-hero-colegio'
c.save(IMG + nombre + '.jpg', quality=88, optimize=True, progressive=True)
anchos = [640, 960, 1280, 1454]
for a in anchos:
    im = c if a == c.width else c.resize((a, round(c.height * a / c.width)), Image.LANCZOS)
    im.save('%s%s-%d.webp' % (IMG, nombre, a), quality=84, method=6)
    im.save('%s%s-%d.avif' % (IMG, nombre, a), quality=62)
print(nombre, c.size, anchos)
