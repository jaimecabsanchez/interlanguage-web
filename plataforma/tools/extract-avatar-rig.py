#!/usr/bin/env python3
"""Extrae las piezas aprobadas de los sprite sheets del avatar.

Los recortes se mantienen separados del código del navegador para poder
repetir la exportación sin tocar a mano los PNG finales.
"""

from colorsys import rgb_to_hsv
from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parents[1] / "assets" / "avatar" / "rig"


BOXES = {
    "feminine": {
        "head-base": (45, 20, 275, 220),
        "body-base": (45, 165, 280, 555),
        "hair-original": (330, 35, 725, 385),
        "eye-left": (770, 145, 910, 300),
        "eye-right": (910, 145, 1055, 300),
        "brow-left": (1100, 165, 1250, 275),
        "brow-right": (1240, 165, 1415, 275),
        "nose": (330, 515, 465, 645),
        "mouth": (520, 510, 720, 650),
        "outfit-tee": (750, 390, 1075, 730),
        "outfit-hoodie": (1060, 390, 1435, 740),
        "hair-curly": (15, 690, 390, 1070),
        "glasses": (410, 800, 730, 1025),
    },
    "masculine": {
        "head-base": (40, 40, 325, 305),
        "body-base": (45, 215, 325, 665),
        "hair-original": (335, 25, 735, 340),
        "eye-left": (770, 140, 910, 295),
        "eye-right": (910, 140, 1055, 295),
        "brow-left": (1100, 165, 1250, 275),
        "brow-right": (1240, 165, 1415, 275),
        "nose": (430, 465, 590, 620),
        "mouth": (560, 505, 790, 670),
        "outfit-tee": (750, 370, 1070, 710),
        "outfit-hoodie": (1060, 360, 1435, 735),
        "hair-curly": (20, 725, 385, 1050),
        "glasses": (410, 800, 730, 1020),
    },
}


def trim(image: Image.Image, padding: int = 4) -> Image.Image:
    bbox = image.getchannel("A").getbbox()
    if not bbox:
        return image
    left, top, right, bottom = bbox
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(image.width, right + padding)
    bottom = min(image.height, bottom + padding)
    return image.crop((left, top, right, bottom))


def skin_only(image: Image.Image) -> Image.Image:
    source = image.convert("RGBA")
    out = Image.new("RGBA", source.size)
    source_pixels = source.load()
    out_pixels = out.load()
    for y in range(source.height):
        for x in range(source.width):
            r, g, b, a = source_pixels[x, y]
            if a < 5:
                continue
            hue, saturation, value = rgb_to_hsv(r / 255, g / 255, b / 255)
            is_skin = (hue < 0.12 or hue > 0.97) and saturation > 0.20 and value > 0.35 and r > b * 1.15
            if is_skin:
                out_pixels[x, y] = (r, g, b, a)
    return out


def export(base: str) -> None:
    source = Image.open(ROOT / "sources" / f"{base}-sprite.png").convert("RGBA")
    target = ROOT / base
    target.mkdir(parents=True, exist_ok=True)
    exported = {}
    for name, box in BOXES[base].items():
        piece = trim(source.crop(box))
        piece.save(target / f"{name}.png", optimize=True)
        exported[name] = piece
    skin_only(exported["body-base"]).save(target / "body-skin.png", optimize=True)


for avatar_base in BOXES:
    export(avatar_base)
