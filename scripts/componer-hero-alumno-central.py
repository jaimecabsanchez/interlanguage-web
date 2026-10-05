#!/usr/bin/env python3
# Compone la foto del hero de la home (05-10-2026): la foto base «alumnos más lejos» con la CABEZA del alumno central
# sustituida por una versión más natural (pelo con mechones y piel con textura), y escribe el origen que usa
# scripts/generar-hero-colegio.py (scripts/_cache/hero-arco-2-origen.png, ignorado por git).
#
#   pip install opencv-python-headless numpy pillow            (solo hace falta para este paso)
#   python3 scripts/componer-hero-alumno-central.py
#
# Por qué: en la foto base la cabeza del alumno central (≈110 px) salió con la piel lisa y el pelo «pintado», y a pantalla
# completa se veía artificial. El usuario regeneró en ChatGPT un recorte de 260×260 px de la base (cabeza y hombros) y este
# script pega SOLO la cabeza y el cuello sobre la foto base; los otros cuatro alumnos, la ropa, la corbata y el fondo son
# los píxeles de la base. Sin reescalado con IA, sin enfoque, sin grano y sin retoque de color (norma de las fotos del hero).
#
# Fuentes (scripts/fuentes/):
#   hero-arco-2-base.webp            2000×760, foto base (ChatGPT, ampliada desde hero-arco-origen.png)
#   hero-arco-2-cabeza-central.webp  1254×1254, recorte de la base regenerado en ChatGPT (cabeza y hombros del alumno central)
#   hero-arco-2-mascara-cabeza.png   1254×1254, cabeza + pelo + cuello de la versión nueva (GrabCut de OpenCV)
#   hero-arco-2-mascara-base.png     800×680 (= 200×170 px a ×4 desde el punto (1270,190) de la base), cabeza de la base
# Si se rehace la cabeza (otra versión de ChatGPT), hay que rehacer también las dos máscaras y la matriz M (ver abajo).
import os
import cv2
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
FUENTES = os.path.join(HERE, 'fuentes')
SALIDA = os.path.join(HERE, '_cache', 'hero-arco-2-origen.png')

# Semejanza (escala, giro y traslación) que lleva la cabeza nueva (1254×1254) a las coordenadas de la base (2000×760).
# Ajustada por mínimos cuadrados con 7 puntos (ojos, nariz, boca, comisura, barbilla y oreja): error ≤ 2,5 px, giro −0,6°.
M = np.array([[0.1674677960351328, 0.0016098076414965633, 1271.1224257047975],
              [-0.0016098076414965633, 0.1674677960351328, 199.9268596783315]])
# La máscara de la base cubre el recorte (x 1270..1470, y 190..360). La zona permitida corta por debajo del cuello,
# justo encima del nudo de la corbata, para no tocar ni la corbata ni la chaqueta de la base.
BASE_RECORTE = (1270, 190, 200, 170)   # x, y, ancho, alto
ZONA_PERMITIDA = [(1280, 185), (1470, 185), (1470, 333), (1430, 343), (1380, 344), (1345, 342), (1300, 336), (1280, 330)]
DIFUMINADO = 1.3   # σ en px de la base: borde suave entre la cabeza nueva y el fondo


def cargar(ruta):
    return cv2.cvtColor(np.array(Image.open(ruta).convert('RGB')), cv2.COLOR_RGB2BGR)


def reducir_y_mover(img, tam, interpolacion, borde=cv2.BORDER_REPLICATE):
    """Reduce al tamaño final con INTER_AREA (promedio real, sin aliasing en el pelo) y aplica solo el resto del movimiento."""
    s = float(np.hypot(M[0, 0], M[1, 0]))
    ns = (max(1, round(img.shape[1] * s)), max(1, round(img.shape[0] * s)))
    pequena = cv2.resize(img, ns, interpolation=cv2.INTER_AREA)
    sa = ns[0] / img.shape[1]
    A = np.hstack([M[:, :2] / sa, M[:, 2:3]]).astype(np.float32)
    return cv2.warpAffine(pequena, A, tam, flags=interpolacion, borderMode=borde, borderValue=0)


def componer():
    base = cargar(os.path.join(FUENTES, 'hero-arco-2-base.webp'))
    cabeza = cargar(os.path.join(FUENTES, 'hero-arco-2-cabeza-central.webp'))
    H, W = base.shape[:2]
    m_nueva = cv2.imread(os.path.join(FUENTES, 'hero-arco-2-mascara-cabeza.png'), 0) > 0
    m_base_c = cv2.imread(os.path.join(FUENTES, 'hero-arco-2-mascara-base.png'), 0) > 0

    nueva = reducir_y_mover(cabeza, (W, H), cv2.INTER_LANCZOS4)
    fm = reducir_y_mover(m_nueva.astype(np.float32), (W, H), cv2.INTER_LINEAR, cv2.BORDER_CONSTANT)
    x, y, w, h = BASE_RECORTE
    fb = np.zeros((H, W), np.float32)
    fb[y:y + h, x:x + w] = cv2.resize(m_base_c.astype(np.float32), (w, h), interpolation=cv2.INTER_AREA)

    # unión de las dos cabezas (para no dejar restos de la antigua), un píxel de margen y borde suave
    union = cv2.dilate(np.maximum(fm, fb), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)))
    permitida = np.zeros((H, W), np.float32)
    cv2.fillPoly(permitida, [np.array(ZONA_PERMITIDA, np.int32)], 1.0)
    a = np.clip(cv2.GaussianBlur(union * permitida, (0, 0), DIFUMINADO), 0, 1)[..., None]
    salida = base.astype(np.float32) * (1 - a) + nueva.astype(np.float32) * a
    return np.clip(salida, 0, 255).astype(np.uint8)


if __name__ == '__main__':
    os.makedirs(os.path.dirname(SALIDA), exist_ok=True)
    cv2.imwrite(SALIDA, componer())
    print('→', SALIDA)
