"""Extrae del máster únicamente las regiones que admiten recoloreado local.

Los PNG resultantes conservan exactamente textura, luz, bordes y coordenadas
del avatar aprobado. No generan ni reconstruyen ninguna parte del personaje.
"""

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "avatar"
TARGET = SOURCE / "deltas"

CONFIG = {
    "feminine": {
        "source": "look-05.png",
        "hair_box": (285, 0, 820, 430),
        "eyes": ((559, 281, 47), (682, 281, 47)),
        "skin_regions": (
            (390, 110, 865, 470),
            (390, 500, 535, 850),
            (720, 500, 865, 850),
        ),
        "outfit_box": (430, 405, 815, 745),
    },
    "masculine": {
        "source": "look-01.png",
        "hair_box": (245, 15, 755, 300),
        "eyes": ((436, 338, 48), (578, 338, 48)),
        "skin_regions": (
            (275, 185, 755, 575),
            (225, 620, 405, 1045),
            (615, 620, 795, 1045),
        ),
        "outfit_box": (275, 500, 750, 920),
    },
}


def box_mask(height, width, box):
    mask = np.zeros((height, width), dtype=bool)
    left, top, right, bottom = box
    mask[top:bottom, left:right] = True
    return mask


def largest_component(mask):
    """Conserva el componente principal para no confundir pelo con cejas/iris."""
    height, width = mask.shape
    seen = np.zeros_like(mask, dtype=bool)
    best = []
    for y, x in np.argwhere(mask):
        if seen[y, x]:
            continue
        queue = deque(((int(y), int(x)),))
        seen[y, x] = True
        component = []
        while queue:
            cy, cx = queue.popleft()
            component.append((cy, cx))
            for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
                if 0 <= ny < height and 0 <= nx < width and mask[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True
                    queue.append((ny, nx))
        if len(component) > len(best):
            best = component
    result = np.zeros_like(mask, dtype=bool)
    if best:
        ys, xs = zip(*best)
        result[np.array(ys), np.array(xs)] = True
    return result


def expand(seed, broad, size=9):
    image = Image.fromarray(seed.astype(np.uint8) * 255, "L")
    grown = np.array(image.filter(ImageFilter.MaxFilter(size=size))) > 0
    return grown & broad


def hair_mask(rgb, alpha, box):
    r, g, b = (rgb[:, :, channel].astype(np.int16) for channel in range(3))
    region = box_mask(*alpha.shape, box)
    strict = region & (alpha > 90) & (r > 28) & (r < 165) & (g < 112) & (b < 92) & (r > g * 1.12)
    broad = region & (alpha > 35) & (r > 22) & (r < 195) & (g < 145) & (b < 125) & (r > g * 1.06) & (g > b * .82)
    return expand(largest_component(strict), broad, 13)


def iris_mask(rgb, alpha, eyes):
    height, width = alpha.shape
    yy, xx = np.ogrid[:height, :width]
    circles = np.zeros((height, width), dtype=bool)
    for cx, cy, radius in eyes:
        circles |= (xx - cx) ** 2 + (yy - cy) ** 2 <= radius ** 2
    r, g, b = (rgb[:, :, channel].astype(np.int16) for channel in range(3))
    return circles & (alpha > 120) & (r > 28) & (r < 175) & (g > 12) & (g < 115) & (b < 90) & (r > g * 1.15)


def skin_mask(rgb, alpha, regions, hair):
    region = np.zeros_like(alpha, dtype=bool)
    for box in regions:
        region |= box_mask(*alpha.shape, box)
    r, g, b = (rgb[:, :, channel].astype(np.int16) for channel in range(3))
    skin = region & (alpha > 130) & (r > 105) & (r > g * 1.16) & (g > b * 1.08) & (g > 45) & (b < 205)
    return skin & ~hair


def outfit_mask(rgb, alpha, box):
    region = box_mask(*alpha.shape, box)
    r, g, b = (rgb[:, :, channel].astype(np.int16) for channel in range(3))
    strict = region & (alpha > 120) & (g > 70) & (g > r * 1.18) & (g > b * 1.08)
    broad = region & (alpha > 45) & (g > 45) & (g > r * 1.08) & (g > b * 1.01)
    return expand(strict, broad, 7)


def save_delta(source, mask, destination):
    rgba = np.array(source, copy=True)
    rgba[~mask, :3] = 0
    rgba[:, :, 3] = np.where(mask, rgba[:, :, 3], 0)
    destination.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgba, "RGBA").save(destination, optimize=True)


def build(base, config):
    source = Image.open(SOURCE / config["source"]).convert("RGBA")
    rgba = np.array(source)
    rgb, alpha = rgba[:, :, :3], rgba[:, :, 3]
    hair = hair_mask(rgb, alpha, config["hair_box"])
    masks = {
        "hair": hair,
        "iris": iris_mask(rgb, alpha, config["eyes"]),
        "skin": skin_mask(rgb, alpha, config["skin_regions"], hair),
        "outfit": outfit_mask(rgb, alpha, config["outfit_box"]),
    }
    for name, mask in masks.items():
        save_delta(source, mask, TARGET / base / f"{name}.png")
        coverage = int(mask.sum())
        if coverage < 100:
            raise RuntimeError(f"Máscara {base}/{name} vacía o incompleta: {coverage} píxeles")


for avatar_base, avatar_config in CONFIG.items():
    build(avatar_base, avatar_config)
