#!/usr/bin/env python3
# Fotos de las tarjetas «Reino Unido» (sala común de un internado, foto real) e «Irlanda» (biblioteca; segunda versión, retocada por Jaime) de «El inglés se aprende viviéndolo» (18-10-2026), aportadas por Jaime.
# Dos recortes del mismo original, sin filtros ni retoque: vertical 4:5 (escritorio, tarjeta de 4:5) y apaisado 16:10 (≤900 px, tarjeta de 16:10).
# Escaleras AVIF/WebP cada ~1,2x (Lanczos). Si cambias la foto, cambia el nombre (`_headers` las marca immutable).
from PIL import Image
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'web-publica', 'images', 'internacional') + '/'
FUENTES = os.path.join(ROOT, 'scripts', 'fuentes') + '/'
sala = Image.open(FUENTES + 'sala-comun-internado.webp').convert('RGB')   # 1448 x 1086
biblio = Image.open(FUENTES + 'biblioteca-irlanda-2.webp').convert('RGB')    # 1122 x 1402 (4:5)
RECORTES = {
  'uk-sala-comun-vertical': (sala, (0, 0, 869, 1086),   [400, 520, 640, 760, 869]),          # los tres alumnos del primer plano, cortinas y araña; el billar asoma a la derecha
  'uk-sala-comun':          (sala, (0, 100, 1448, 1005), [480, 720, 960, 1200, 1448]),       # toda la sala, con el billar y el futbolín al fondo
  'ie-biblioteca-2-vertical': (biblio, (0, 0, 1122, 1402),   [400, 520, 640, 760, 920, 1122]),   # tal cual (ya es 4:5)
  'ie-biblioteca-2':          (biblio, (0, 380, 1122, 1081), [480, 720, 960, 1122]),             # 16:10: alumnos, estanterías y ventanales
}
for nombre, (src, box, anchos) in RECORTES.items():
    c = src.crop(box)
    c.save(IMG + nombre + '.jpg', quality=88, optimize=True, progressive=True)
    for a in anchos:
        im = c if a == c.width else c.resize((a, round(c.height * a / c.width)), Image.LANCZOS)
        im.save('%s%s-%d.webp' % (IMG, nombre, a), quality=84, method=6)
        im.save('%s%s-%d.avif' % (IMG, nombre, a), quality=62)
    print(nombre, c.size, anchos)
