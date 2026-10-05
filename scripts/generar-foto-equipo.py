#!/usr/bin/env python3
# Genera la escalera de tamaños de la FOTO DEL EQUIPO («Por qué nosotros») y escribe el <figure> listo para pegar.
#
#   python3 scripts/generar-foto-equipo.py ruta/a/la-foto.jpg [--nombre equipo] [--salida web-publica/images/equipo]
#
# Reglas (las mismas que el hero de la home): SIN reescalado con IA, SIN enfoque, SIN grano y SIN retoque de color.
# Solo reducciones Lanczos desde el original; el ancho mayor es el nativo (nunca se amplía). La foto no se recorta:
# la maqueta la pinta entera (`height:auto`) y solo limita el alto si fuese muy vertical (variable CSS --foco).
# Si cambias la foto, cambia --nombre (equipo-2…): `_headers` marca las imágenes como immutable.
import argparse, os, sys
from PIL import Image, ImageOps
import pillow_avif  # noqa: F401  (registra el codificador AVIF en Pillow < 11.3)

HERE = os.path.dirname(os.path.abspath(__file__))
# Escalera de anchos cada ~1,2x (la que pide web-publica/AGENTS.md para que Retina no quede borrosa).
LADDER = (480, 580, 700, 850, 1030, 1240, 1500, 1800, 2200)

ap = argparse.ArgumentParser()
ap.add_argument('origen')
ap.add_argument('--nombre', default='equipo')
ap.add_argument('--salida', default=os.path.join(HERE, '..', 'web-publica', 'images', 'equipo'))
ap.add_argument('--alt', default='El equipo de Interlanguage Studies')
ap.add_argument('--alt-en', default='The Interlanguage Studies team')
args = ap.parse_args()

src = ImageOps.exif_transpose(Image.open(args.origen)).convert('RGB')
W, H = src.size
if W < 1600:
    print('AVISO: la foto mide %d px de ancho; se verá algo blanda en pantallas Retina. Mejor 2400 px o más.' % W, file=sys.stderr)
os.makedirs(args.salida, exist_ok=True)
widths = [w for w in LADDER if w < W] + [min(W, LADDER[-1])]
widths = sorted(set(widths))
base = os.path.join(args.salida, args.nombre)
for w in widths:
    im = src if w >= W else src.resize((w, round(H * w / W)), Image.LANCZOS)
    im.save('%s-%d.avif' % (base, w), quality=80, speed=4, subsampling='4:4:4')
    im.save('%s-%d.webp' % (base, w), quality=88, method=6)
    print(w, 'ok')
big = widths[-1]
fallback = src if W <= 1600 else src.resize((1600, round(H * 1600 / W)), Image.LANCZOS)
fallback.save(base + '.jpg', quality=88, progressive=True, optimize=True)
print(args.nombre + '.jpg ok')

# <figure> listo para pegar en scripts/_cache/ (rutas relativas a web-publica/). Hay dos sizes: el de la página y el de la home.
H_BIG = round(H * big / W)
def picture(sizes, alt):
    def srcset(ext):
        return ', '.join('images/equipo/%s-%d.%s %dw' % (args.nombre, w, ext, w) for w in widths)
    return ('<picture><source type="image/avif" srcset="%s" sizes="%s"><source type="image/webp" srcset="%s" sizes="%s">'
            '<img src="images/equipo/%s.jpg" alt="%s" width="%d" height="%d" loading="lazy" decoding="async"></picture>'
            % (srcset('avif'), sizes, srcset('webp'), sizes, args.nombre, alt, big, H_BIG))
SIZES_PAGINA = '(min-width:1328px) 686px, (min-width:900px) calc((100vw - 104px) * 0.5833), calc(100vw - 48px)'
SIZES_HOME = '(min-width:1328px) 613px, (min-width:900px) calc((100vw - 112px) * 0.525), calc(100vw - 48px)'
cache = os.path.join(HERE, '_cache')   # ignorado por git: los fragmentos no se publican
os.makedirs(cache, exist_ok=True)
for lang, alt, cap in (('es', args.alt, 'El equipo de Interlanguage'), ('en', args.alt_en, 'The Interlanguage team')):
    for donde, sizes, cls in (('pagina', SIZES_PAGINA, 'team-photo'), ('home', SIZES_HOME, 'team-photo reveal')):
        out = os.path.join(cache, 'figure-%s-%s.html' % (donde, lang))
        with open(out, 'w', encoding='utf-8') as f:
            f.write('<figure class="%s">%s<figcaption><strong>%s</strong></figcaption></figure>\n' % (cls, picture(sizes, alt), cap))
        print('→', out)
print('Pegar: figure-pagina-* después de .who-hero-copy (página «Por qué nosotros») y figure-home-* como primer hijo de .why-grid (home), en index.html (es) e index-en.html (en).')
