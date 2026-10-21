#!/usr/bin/env python3
# Fotos de las tres tarjetas de «El inglés se aprende viviéndolo» (22-10-2026), aportadas por Jaime: Reino Unido, Irlanda y Estados Unidos.
# Cada original es 4:5 (1122 x 1402): se usa tal cual en escritorio y se recorta a 16:10 para ≤900 px. Sin filtros ni retoque.
# Escaleras AVIF/WebP cada ~1,2x (Lanczos). Si cambias una foto, cambia el nombre (`_headers` las marca immutable).
from PIL import Image
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'web-publica', 'images', 'internacional') + '/'
FUENTES = os.path.join(ROOT, 'scripts', 'fuentes') + '/'
V = [400, 520, 640, 760, 920, 1122]
L = [480, 720, 960, 1122]
FOTOS = {   # nombre: (fuente, y del recorte apaisado de 701 px)
  'uk-campus': ('destino-reino-unido.webp', 380),        # edificio de ladrillo con el arco y los alumnos del césped
  'ie-campus': ('destino-irlanda.webp', 330),            # casa de piedra con la torre del reloj y las colinas
  'us-campus': ('destino-estados-unidos.webp', 440),     # edificio blanco con torre y alumnos caminando
}
for nombre, (fuente, y) in FOTOS.items():
    src = Image.open(FUENTES + fuente).convert('RGB')
    assert src.size == (1122, 1402), src.size
    for sufijo, c, anchos in (('-vertical', src, V), ('', src.crop((0, y, 1122, y + 701)), L)):
        n = nombre + sufijo
        c.save(IMG + n + '.jpg', quality=88, optimize=True, progressive=True)
        for a in anchos:
            im = c if a == c.width else c.resize((a, round(c.height * a / c.width)), Image.LANCZOS)
            im.save('%s%s-%d.webp' % (IMG, n, a), quality=84, method=6)
            im.save('%s%s-%d.avif' % (IMG, n, a), quality=62)
        print(n, c.size, anchos)
