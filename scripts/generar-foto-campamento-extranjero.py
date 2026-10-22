#!/usr/bin/env python3
# Foto de la tarjeta «Campamentos en el extranjero» de «Un programa para cada momento» (23-10-2026), aportada por Jaime:
# niños con casco y chaleco en una canoa roja sobre un lago (1536 x 1024, parece fotografía profesional).
# Recorte 16:9 (la caja de .svc-photo) desde y=20, que deja entera la pala amarilla y las caras; sin filtros ni retoque.
# Escalera AVIF/WebP cada ~1,2x (Lanczos). Si cambias la foto, cambia el nombre (`_headers` las marca immutable).
# uso: python3 scripts/generar-foto-campamento-extranjero.py     (Pillow >= 11.3: AVIF nativo)
from PIL import Image
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'web-publica', 'images', 'internacional') + '/'
src = Image.open(os.path.join(ROOT, 'scripts', 'fuentes', 'campamento-extranjero-canoa.webp')).convert('RGB')   # 1536 x 1024
c = src.crop((0, 20, 1536, 20 + 864))                                                                         # 1536 x 864
nombre = 'campamento-extranjero-canoa'
c.save(IMG + nombre + '.jpg', quality=88, optimize=True, progressive=True)
anchos = [300, 380, 470, 580, 710, 860, 1030, 1200, 1536]
for a in anchos:
    im = c if a == c.width else c.resize((a, round(c.height * a / c.width)), Image.LANCZOS)
    im.save('%s%s-%d.webp' % (IMG, nombre, a), quality=84, method=6)
    im.save('%s%s-%d.avif' % (IMG, nombre, a), quality=62)
print(nombre, c.size, anchos)
