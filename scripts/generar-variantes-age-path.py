#!/usr/bin/env python3
# Genera variantes intermedias (AVIF + WebP) de las 4 fotos de "Crecemos con cada alumno".
# Se remuestrea siempre desde el JPG original con Lanczos; las variantes nativas ya existen y se reutilizan.
from PIL import Image
import os
BASE = '/Users/jaimecabellosanchez/Desktop/interlanguage-web/web-publica/images/'
PHOTOS = {  # carpeta/base : (nativas existentes)
  'campamentos/grupo-celebrando': 1020,
  'programas/profesor-ritmo':     1200,
  'programas/avanzar-clase':      1200,
  'internacional/vivirlo-colegio':1000,
}
STEPS = [300, 380, 470, 580, 710, 860, 1030]   # paso ~1.2 entre candidatas
for b, native in PHOTOS.items():
    jpg = Image.open(BASE + b + '.jpg').convert('RGB')
    for w in STEPS:
        if w >= native * 0.97:      # demasiado cerca de la nativa: no aporta
            continue
        im = jpg.resize((w, round(jpg.height * w / jpg.width)), Image.LANCZOS)
        im.save('%s%s-%d.webp' % (BASE, b, w), quality=84, method=6)
        im.save('%s%s-%d.avif' % (BASE, b, w), quality=62)
    print(b, 'ok')
