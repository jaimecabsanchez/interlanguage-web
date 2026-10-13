#!/usr/bin/env python3
# Fotos de las tarjetas «Inglés extraescolar» y «Estudiar en el extranjero» de «Qué ofrecemos» (13-10-2026).
# Parte de los originales de scripts/fuentes/, los recorta a 16:9 (la caja de .svc-photo) sin filtros, sin IA y sin enfoque,
# y genera el JPG + la escalera AVIF/WebP cada ~1,2x (Lanczos). Si cambias la foto, cambia el nombre (`_headers` las marca immutable).
# uso: python3 scripts/generar-fotos-tarjetas-home.py     (Pillow >= 11.3: AVIF nativo)
from PIL import Image
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'web-publica', 'images') + '/'
FUENTES = os.path.join(ROOT, 'scripts', 'fuentes') + '/'
# fuente: (destino, x, y del recorte)  -> el recorte mide 16:9 con el mayor ancho posible
FOTOS = {
  'tarjeta-extraescolar-aula.webp': ('programas/extraescolar-aula', None, 130),    # 1536 x 864; deja arriba la profesora y la alumna de pie
  'tarjeta-extranjero-campus.webp': ('internacional/campus-paseo', 420, 0),        # 1470 x 827; castillo a la izquierda y los cinco alumnos a la derecha
}
STEPS = [300, 380, 470, 580, 710, 860, 1030, 1200]
for fuente, (dest, x, y) in FOTOS.items():
    src = Image.open(FUENTES + fuente).convert('RGB')
    w = src.width if x is None else min(src.width - x, round((src.height - y) * 16 / 9))
    h = round(w * 9 / 16)
    x = 0 if x is None else x
    crop = src.crop((x, y, x + w, y + h))
    crop.save(IMG + dest + '.jpg', quality=88, optimize=True, progressive=True)
    anchos = [s for s in STEPS if s < w * 0.97] + [w]
    for a in anchos:
        im = crop if a == w else crop.resize((a, round(h * a / w)), Image.LANCZOS)
        im.save('%s%s-%d.webp' % (IMG, dest, a), quality=84, method=6)
        im.save('%s%s-%d.avif' % (IMG, dest, a), quality=62)
    print(dest, 'recorte', w, 'x', h, 'anchos', anchos)
