#!/usr/bin/env python3
# Genera la escalera de tamaños de la foto del hero de la home (AVIF + WebP + JPG de respaldo).
# Origen: images/internacional/hero-campus-2.jpg (1448 x 1086, con bloques de compresión), espejada para que los
# alumnos queden a la derecha y el texto del hero a la izquierda.
#  1. Reescalado 4x con el modelo de super-resolución de Apple (scripts/superresolucion-macos.swift, macOS 26+):
#     devuelve un máster de 5792 px con detalle real y sin bloques. Se guarda en scripts/_cache/ (no se sube a git).
#     Si no hay macOS 26, se usa el respaldo clásico (Lanczos + máscara de enfoque suave) y la foto queda más blanda.
#  2. Cada ancho (640 a 3840) se reduce desde el máster con Lanczos y una máscara de enfoque muy suave. Así el
#     navegador casi nunca amplía la foto (la ampliación es lo que más la ablanda) y la recibe a 1:1 o reducida.
#  3. AVIF 4:4:4 (conserva los bordes finos de corbatas y faldas) y WebP con calidad alta. Sin filtros de color.
import os, subprocess, sys
from PIL import Image, ImageFilter, ImageOps
import pillow_avif  # noqa: F401  (registra el codificador AVIF en Pillow < 11.3)

Image.MAX_IMAGE_PIXELS = None
HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(HERE, '..', 'web-publica', 'images', 'internacional') + '/'
CACHE = os.path.join(HERE, '_cache') + '/'
ORIGEN = BASE + 'hero-campus-2.jpg'
MASTER = CACHE + 'hero-4x.png'
# Nombre base de los archivos. Si cambias la foto, cambia el nombre (hd, hd2…): _headers marca las imágenes como
# immutable y con el mismo nombre quien ya visitó la web seguiría viendo la anterior.
NOMBRE = 'hero-colegio-hd3'
WIDTHS = (640, 960, 1280, 1448, 1920, 2560, 2880, 3840)

def master_ia():
    """Devuelve el máster 4x o None si no se puede generar (sin macOS 26 / sin Swift)."""
    if os.path.exists(MASTER) and os.path.getmtime(MASTER) >= os.path.getmtime(ORIGEN):
        return Image.open(MASTER).convert('RGB')
    os.makedirs(CACHE, exist_ok=True)
    tool = CACHE + 'sr'
    try:
        subprocess.run(['swiftc', '-O', HERE + '/superresolucion-macos.swift', '-o', tool], check=True)
        subprocess.run([tool, ORIGEN, MASTER], check=True)
        return Image.open(MASTER).convert('RGB')
    except Exception as e:  # noqa: BLE001
        print('Sin super-resolución (%s): se usa el respaldo clásico' % e, file=sys.stderr)
        return None

ia = master_ia()
original = Image.open(ORIGEN).convert('RGB')
src = ImageOps.mirror(ia if ia is not None else original)
NATIVE = original.width  # 1448: resolución real del original

for w in WIDTHS:
    h = round(src.height * w / src.width)
    if ia is not None:
        im = src.resize((w, h), Image.LANCZOS, reducing_gap=3.0)
        im = im.filter(ImageFilter.UnsharpMask(radius=1.3, percent=45, threshold=2))
        qa, qw = (70, 86) if w <= 1920 else (64, 82)
    else:  # respaldo: el original solo da 1448 px reales
        im = src.resize((w, h), Image.LANCZOS)
        if w > NATIVE:
            im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=35, threshold=2))
        qa, qw = (72, 87) if w <= NATIVE else (66, 82)
    im.save('%s%s-%d.avif' % (BASE, NOMBRE, w), quality=qa, speed=4, subsampling='4:4:4')
    im.save('%s%s-%d.webp' % (BASE, NOMBRE, w), quality=qw, method=6)
    print(w, 'ok')

fallback = src.resize((1448, round(src.height * 1448 / src.width)), Image.LANCZOS, reducing_gap=3.0)
if ia is not None:
    fallback = fallback.filter(ImageFilter.UnsharpMask(radius=1.3, percent=45, threshold=2))
fallback.save(BASE + NOMBRE + '.jpg', quality=88, progressive=True, optimize=True)
print(NOMBRE + '.jpg ok')
