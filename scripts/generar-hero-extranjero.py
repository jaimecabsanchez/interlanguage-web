#!/usr/bin/env python3
# Cabecera de «Estudiar en el extranjero» (22-10-2026): colegio de piedra con alumnos paseando, foto aportada por Jaime (1672 x 941).
# - Se da la vuelta (espejo) para que los cuatro alumnos queden a la DERECHA, caminando hacia la cámara y fuera del panel de texto.
# - Un poco más de luz y color, pedido por Jaime: gamma 0,86 (sube sombras y medios), saturación x1,12 y contraste x1,03. Sin filtros ni retoque de caras.
# - Sin zoom ni reescalado (1672 px nativos) y con COMPRESIÓN ALTA (la primera versión, AVIF q62 con zoom, salía blanda).
# - Recorte 2:1 desde abajo (1672 x 836): en escritorio el CSS enseña la parte baja (alumnos y camino).
# Si cambias la foto o el ajuste, cambia `nombre` (`_headers` marca las imágenes como immutable).
from PIL import Image, ImageEnhance
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'web-publica', 'images', 'internacional') + '/'
src = Image.open(os.path.join(ROOT, 'scripts', 'fuentes', 'hero-extranjero-colegio.webp')).convert('RGB').transpose(Image.FLIP_LEFT_RIGHT)
lut = [round(255 * ((i / 255) ** 0.86)) for i in range(256)]
src = ImageEnhance.Contrast(ImageEnhance.Color(src.point(lut * 3)).enhance(1.12)).enhance(1.03)
W, H = src.size                                  # 1672 x 941
c = src.crop((0, H - round(W / 2.0), W, H))      # 1672 x 836
nombre = 'ext-hero-colegio-luz'
c.save(IMG + nombre + '.jpg', quality=93, optimize=True, progressive=True, subsampling=0)
anchos = [640, 960, 1280, 1672]
for a in anchos:
    im = c if a == c.width else c.resize((a, round(c.height * a / c.width)), Image.LANCZOS)
    im.save('%s%s-%d.webp' % (IMG, nombre, a), quality=92, method=6)
    im.save('%s%s-%d.avif' % (IMG, nombre, a), quality=82)
print(nombre, c.size, anchos)
