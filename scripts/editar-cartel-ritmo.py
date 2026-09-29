#!/usr/bin/env python3
"""Foto del profesor con los niños (programas/profesor-ritmo): el cartel «Tren rítmico» pasa a «Rhythm train».

Parte SIEMPRE del original con el cartel en español (`profesor-ritmo.jpg`, que se conserva):
  1. borra el texto dorado reconstruyendo la pared (interpolación vertical entre las filas limpias de arriba y de abajo)
     y vuelve a dibujar la costura inclinada del panel;
  2. escribe «Rhythm train» en el mismo dorado, con la misma altura de letra, la misma pendiente de perspectiva
     y el mismo hueco entre palabras, y le añade el grano de la foto;
  3. guarda `profesor-ritmo-en.jpg` y su escalera de tamaños (AVIF + WebP) para <picture>/srcset.

Necesita Pillow (+ pillow-avif-plugin si Pillow < 11.3) y la fuente Trebuchet MS de macOS (la más parecida al rótulo original).
Uso:  python3 scripts/editar-cartel-ritmo.py
"""
import math
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

try:
    import pillow_avif  # noqa: F401
except ImportError:
    pass

DIR = Path(__file__).resolve().parent.parent / "web-publica" / "images" / "programas"
SRC, OUT = DIR / "profesor-ritmo.jpg", DIR / "profesor-ritmo-en.jpg"
FONT = "/System/Library/Fonts/Supplemental/Trebuchet MS.ttf"
WIDTHS = [300, 380, 470, 480, 580, 710, 800, 860, 1030, 1200, 1207]


def borrar_cartel(im):
    px = im.load()
    w, h = im.size
    y0, y1 = 384, 449                 # banda del texto; muestras limpias justo encima (376-382) y debajo (450-453)
    xl, xr = 538, 704
    seam = (651, 668)                 # columnas de la costura inclinada del panel

    def avg(v):
        return sum(v) / len(v)

    top = {x: [avg([px[x, y][c] for y in range(y0 - 8, y0 - 1)]) for c in range(3)] for x in range(xl, xr)}
    bot = {x: [avg([px[x, y][c] for y in range(y1 + 1, y1 + 5)]) for c in range(3)] for x in range(xl, xr)}
    for d in (top, bot):              # la costura se sustituye por interpolación horizontal
        a, b = seam
        for x in range(a, b + 1):
            t = (x - (a - 1)) / ((b + 1) - (a - 1))
            d[x] = [d[a - 1][c] * (1 - t) + d[b + 1][c] * t for c in range(3)]

    def suavizar(d):
        return {x: [avg([d[xx][c] for xx in range(x - 2, x + 3)]) for c in range(3)] for x in range(xl + 2, xr - 2)}

    top, bot = suavizar(top), suavizar(bot)
    random.seed(11)
    fill = im.copy()
    fp = fill.load()
    for y in range(y0, y1 + 1):
        t = (y - y0) / (y1 - y0)
        sx = 660.5 - (y - 380) * 0.0571          # posición de la costura en esta fila
        for x in range(xl + 2, xr - 2):
            base = [top[x][c] * (1 - t) + bot[x][c] * t for c in range(3)]
            d = max(0, 1 - abs((x + 0.5) - sx) / 1.6) * 50
            n = random.gauss(0, 0.9)
            fp[x, y] = tuple(max(0, min(255, int(round(base[c] - d + n)))) for c in range(3))
    mask = Image.new("L", im.size, 0)
    dr = ImageDraw.Draw(mask)
    dr.rectangle((544, 388, 694, 428), fill=255)
    dr.rectangle((557, 428, 694, 447), fill=255)  # x >= 557 abajo: respeta la manga del profesor
    mask = mask.filter(ImageFilter.GaussianBlur(2.2))
    return Image.composite(fill, im, mask)


def escribir_cartel(base, textos=("Rhythm", "train"), cap=30, fill=(204, 156, 50), edge=(164, 116, 32),
                    gap=22, sx=0.5, slope=0.094, origin=(546, 424)):
    SS = 8
    f0 = ImageFont.truetype(FONT, 400)
    tb = f0.getbbox("T")
    k = (cap * SS) / (tb[3] - tb[1])
    f = ImageFont.truetype(FONT, round(400 * k))
    asc_t = f.getbbox("T")[3]
    ew = max(1, int(0.55 * SS / 2))

    def palabra(txt):
        pad = 6 * SS
        bb = f.getbbox(txt)
        im = Image.new("RGBA", (bb[2] + 2 * pad, bb[3] + 2 * pad), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        d.text((pad, pad), txt, font=f, fill=edge + (255,), stroke_width=ew, stroke_fill=edge + (255,))
        d.text((pad, pad), txt, font=f, fill=fill + (255,))
        im = im.resize((max(1, round(im.width * sx)), im.height), Image.LANCZOS)   # compresión de perspectiva
        return im, pad

    w1, pad1 = palabra(textos[0])
    w2, pad2 = palabra(textos[1])
    padx1 = round(pad1 * sx)
    cw, ch, base_y = w1.width + w2.width + gap * SS + 50 * SS, 200 * SS, 100 * SS
    layer = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    layer.alpha_composite(w1.crop((padx1, 0, w1.width, w1.height)), (0, base_y - pad1 - asc_t))
    x2 = (w1.width - padx1) + gap * SS - round(pad2 * sx)
    layer.alpha_composite(w2, (x2, base_y - pad2 - asc_t))
    layer = layer.rotate(-math.degrees(math.atan(slope)), resample=Image.BICUBIC, center=(0, base_y))
    small = layer.resize((cw // SS, ch // SS), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.55))
    out = base.copy()
    out.paste(small, (origin[0], origin[1] - base_y // SS), small)
    # grano de la foto solo donde hay texto nuevo
    random.seed(5)
    px, ref = out.load(), base.load()
    for y in range(388, 446):
        for x in range(540, 700):
            if px[x, y] != ref[x, y]:
                n = random.gauss(0, 1.1)
                px[x, y] = tuple(max(0, min(255, int(v + n))) for v in px[x, y])
    return out


def main():
    original = Image.open(SRC).convert("RGB")
    final = escribir_cartel(borrar_cartel(original))
    final.save(OUT, quality=92, subsampling=0, optimize=True, progressive=True)
    w, h = final.size
    for ancho in WIDTHS:
        im = final if ancho >= w else final.resize((ancho, round(h * ancho / w)), Image.LANCZOS)
        im.save(DIR / f"profesor-ritmo-en-{ancho}.webp", quality=86, method=6)
        im.save(DIR / f"profesor-ritmo-en-{ancho}.avif", quality=64)
    print("profesor-ritmo-en: ok", final.size)


if __name__ == "__main__":
    main()
