#!/usr/bin/env python3
# Fotos de las tarjetas de «El inglés se aprende viviéndolo» (22-10-2026), aportadas por Jaime: Reino Unido, Irlanda y Estados Unidos
# (4:5, 1122 x 1402) y Canadá (29-10-2026, 3:4 de 1086 x 1448: se recorta a 4:5 antes de nada).
# Cada original 4:5 se usa tal cual en escritorio y se recorta a 16:10 para ≤900 px. Sin filtros ni retoque.
# Escaleras AVIF/WebP cada ~1,2x (Lanczos). Si cambias una foto, cambia el nombre (`_headers` las marca immutable).
#   python3 scripts/generar-fotos-destinos-home.py [nombre ...]      (sin nombres, las genera todas)
from PIL import Image
import os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'web-publica', 'images', 'internacional') + '/'
FUENTES = os.path.join(ROOT, 'scripts', 'fuentes') + '/'
V = [400, 520, 640, 760, 920, 1122]
L = [480, 720, 960, 1122]
FOTOS = {   # nombre: (fuente, y del recorte apaisado de 5/8 del ancho, y del recorte 4:5 previo o None si el original ya es 4:5)
  'uk-campus': ('destino-reino-unido.webp', 380, None),   # edificio de ladrillo con el arco y los alumnos del césped
  'ie-campus': ('destino-irlanda.webp', 330, None),       # casa de piedra con la torre del reloj y las colinas
  'us-campus': ('destino-estados-unidos.webp', 440, None),  # edificio blanco con torre y alumnos caminando
  'ca-campus': ('destino-canada.webp', 225, 0),           # colegio de madera y piedra con la bandera de Canadá y alumnos entrando; el apaisado incluye bandera, entrada y alumnos
}
for nombre, (fuente, y, y45) in FOTOS.items():
    if len(sys.argv) > 1 and nombre not in sys.argv[1:]: continue
    src = Image.open(FUENTES + fuente).convert('RGB')
    if y45 is not None: src = src.crop((0, y45, src.width, y45 + round(src.width * 5 / 4)))
    else: assert src.size == (1122, 1402), src.size
    ancho, alto = src.size
    ch = round(ancho * 5 / 8)   # 701 px en los originales de 1122
    for sufijo, c, escalera in (('-vertical', src, V), ('', src.crop((0, y, ancho, y + ch)), L)):
        anchos = sorted(set([a for a in escalera if a < ancho * 0.97] + [ancho]))
        n = nombre + sufijo
        c.save(IMG + n + '.jpg', quality=88, optimize=True, progressive=True)
        for a in anchos:
            im = c if a == c.width else c.resize((a, round(c.height * a / c.width)), Image.LANCZOS)
            im.save('%s%s-%d.webp' % (IMG, n, a), quality=84, method=6)
            im.save('%s%s-%d.avif' % (IMG, n, a), quality=62)
        print(n, c.size, anchos)
