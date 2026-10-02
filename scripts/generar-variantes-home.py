#!/usr/bin/env python3
# Genera la escalera de tamaños intermedios (AVIF + WebP) de las fotos sueltas de la home (tarjetas de destino y extranjero).
# Igual que generar-variantes-age-path.py: se remuestrea siempre desde el JPG original con Lanczos y las
# variantes nativas ya existentes se reutilizan. Los `sizes` de web-publica/index*.html declaran ~1,55x el
# ancho real de cada tarjeta (ver web-publica/AGENTS.md, "Nitidez en Retina").
from PIL import Image
import pillow_avif  # noqa: F401  (registra el codificador AVIF en Pillow < 11.3)

BASE = '/Users/jaimecabellosanchez/Desktop/interlanguage-web/web-publica/images/'
PHOTOS = {  # carpeta/base : anchura nativa
    # (la foto del hero ya no sale de aquí: ver generar-hero-colegio.py)
    'internacional/irlanda-rugby': 1080,
    'internacional/extranjero-lab': 1200,
}
STEPS = [300, 380, 470, 580, 710, 860, 1030]   # paso ~1,2x entre candidatas
for b, native in PHOTOS.items():
    jpg = Image.open(BASE + b + '.jpg').convert('RGB')
    for w in STEPS:
        if w >= native * 0.97:      # demasiado cerca de la nativa: no aporta
            continue
        im = jpg.resize((w, round(jpg.height * w / jpg.width)), Image.LANCZOS)
        im.save('%s%s-%d.webp' % (BASE, b, w), quality=84, method=6)
        im.save('%s%s-%d.avif' % (BASE, b, w), quality=62)
    print(b, 'ok')
