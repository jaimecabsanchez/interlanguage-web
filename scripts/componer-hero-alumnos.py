#!/usr/bin/env python3
# Compone la foto del hero de la home (05-10-2026, 3.ª versión): la foto «alumnos más lejos» con las CABEZAS de los cinco
# alumnos sustituidas por versiones más naturales (pelo con mechones y piel con textura). Escribe el origen que usa
# scripts/generar-hero-colegio.py (scripts/_cache/hero-arco-3-origen.png, ignorado por git).
#
#   pip install opencv-contrib-python-headless numpy pillow      (solo para este paso; hace falta «contrib» por el filtro guiado)
#   python3 scripts/componer-hero-alumnos.py
#
# Por qué: en la foto base las caras salen a ~50 px y el generador las dejó con la piel lisa y el pelo «pintado»
# («horriblemente artificial»). El usuario regeneró en ChatGPT un recorte de 260×260 px de la base (cabeza y hombros) de
# cada alumno y este script pega SOLO la cabeza, el pelo y el cuello sobre la foto; la ropa, la corbata, los cuellos de
# camisa, las manos y el fondo siguen siendo los píxeles de la base. Sin reescalado con IA y sin enfoque.
#
# Alumnos, de izquierda a derecha: 1 chico (pelo rubio), 2 chica morena, 3 chico central (lo hace
# componer-hero-alumno-central.py, que va primero), 4 chica rubia, 5 chico (pelo rizado).
#
# Fuentes (scripts/fuentes/):
#   hero-arco-3-cabeza-N.webp   1254×1254, recorte de la base regenerado en ChatGPT (N = 1, 2, 4, 5)
#   hero-arco-3-mascara-N.png   1254×1254, cabeza + pelo + cuello (GrabCut de OpenCV: el pelo contra el fondo; blanco y azul
#                               de la ropa se tratan como fondo, así la ropa nunca se sustituye)
# Alineado: semejanza (escala, giro y traslación) por mínimos cuadrados con 5 puntos de la cara (ojos, nariz, boca y
# barbilla; Apple Vision, VNDetectFaceLandmarksRequest) en la base y en el recorte; residuo ≤ 1 px. Si se rehace un recorte,
# hay que rehacer su máscara y su matriz (las 4 de abajo).
#
# Cómo se pega (por alumno): matte suavizado con filtro guiado en el borde del pelo → color del primer plano estimado con
# «blur-fusion» (sin el halo del fondo del recorte) → reducción a la escala final con INTER_AREA → compresión suave de luces
# (los recortes nuevos salen más «quemados» que la base: 8-12 % de píxeles con L>215 frente al 1 %) → mezcla con el matte.
# No se rellena el fondo detrás de la cabeza vieja: lo poco que queda de su flequillo borroso se funde con el pelo nuevo.
import os
import cv2
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
FUENTES = os.path.join(HERE, 'fuentes')
CACHE = os.path.join(HERE, '_cache')
ENTRADA = os.path.join(CACHE, 'hero-arco-2-origen.png')   # base + alumno central (componer-hero-alumno-central.py)
SALIDA = os.path.join(CACHE, 'hero-arco-3-origen.png')

# Matriz 2×3 que lleva el recorte de 1254 px a las coordenadas de la base (2000×760), y desvanecimiento hacia abajo
# (y inicial, y final) para las puntas del pelo de las chicas: el recorte acaba justo ahí y debajo queda la base.
ALUMNOS = {
    1: dict(M=[[0.1802035055919741, -0.001045698703443993, 792.7058276759705], [0.0010456987034439913, 0.18020350559197407, 215.0855687225723]], fade=None),
    2: dict(M=[[0.1779809469282282, -0.013309607103436248, 1040.4436746338029], [0.01330960710343622, 0.17798094692822822, 246.67152096699533]], fade=(440, 466)),
    4: dict(M=[[0.18039227328923643, 0.000492795388809078, 1477.9724194146736], [-0.0004927953888090922, 0.18039227328923643, 244.7022978070101]], fade=(440, 464)),
    5: dict(M=[[0.2119445373819298, 0.007784142091936417, 1660.2909874516336], [-0.00778414209193639, 0.2119445373819298, 137.4892199062046]], fade=None),
}
LUCES = dict(rodilla=160.0, razon=0.40)   # L (Lab, 8 bits) a partir del cual se comprimen las luces, y cuánto


def elipse(r):
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))


def cargar(ruta):
    return cv2.cvtColor(np.array(Image.open(ruta).convert('RGB')), cv2.COLOR_RGB2BGR)


def reducir_y_mover(img, M, tam, interpolacion=cv2.INTER_LANCZOS4, borde=cv2.BORDER_REPLICATE):
    """Reduce a la escala final con INTER_AREA (promedio real, sin aliasing en el pelo) y aplica solo el resto del movimiento."""
    M = np.asarray(M, np.float64)
    s = float(np.hypot(M[0, 0], M[1, 0]))
    ns = (max(1, round(img.shape[1] * s)), max(1, round(img.shape[0] * s)))
    pequena = cv2.resize(img, ns, interpolation=cv2.INTER_AREA)
    sa = ns[0] / img.shape[1]
    A = np.hstack([M[:, :2] / sa, M[:, 2:3]]).astype(np.float32)
    return cv2.warpAffine(pequena, A, tam, flags=interpolacion, borderMode=borde, borderValue=0)


def matte_suave(recorte, matte, r_in=7, r_out=16, radio=10, eps=2e-3):
    """Matte duro → alfa suave que sigue los bordes de la imagen (mechones sueltos) solo en una banda estrecha."""
    m = matte.astype(np.uint8)
    interior, exterior = cv2.erode(m, elipse(r_in)), cv2.dilate(m, elipse(r_out))
    guia = recorte.astype(np.float32) / 255.0
    af = cv2.ximgproc.guidedFilter(guia, m.astype(np.float32), radio, eps)
    return np.where(interior > 0, 1.0, np.where(exterior > 0, np.clip(af, 0, 1), 0.0)).astype(np.float32)


def primer_plano(img, alfa, radios=(45, 5)):
    """Blur-Fusion (Forte y Pitié): color del primer plano en el borde sin arrastrar el fondo del recorte."""
    I, a = img.astype(np.float32), alfa.astype(np.float32)[..., None]

    def blur(x, r):
        y = cv2.blur(x, (2 * r + 1, 2 * r + 1))
        return y[..., None] if y.ndim == 2 else y
    F, B = I.copy(), I.copy()
    for r in radios:
        Fh = blur(F * a, r) / np.maximum(blur(a, r), 1e-4)
        Bh = blur(B * (1 - a), r) / np.maximum(blur(1 - a, r), 1e-4)
        F = np.clip(Fh + a * (I - a * Fh - (1 - a) * Bh), 0, 255)
        B = Bh + (1 - a) * (I - a * Fh - (1 - a) * Bh)
        F = np.where(a > 0.99, I, F)
    return F


def comprimir_luces(bgr, rodilla, razon):
    lab = cv2.cvtColor(np.clip(bgr, 0, 255).astype(np.uint8), cv2.COLOR_BGR2LAB).astype(np.float32)
    L = lab[..., 0]
    lab[..., 0] = np.clip(np.where(L > rodilla, rodilla + (L - rodilla) * razon, L), 0, 255)
    return cv2.cvtColor(lab.astype(np.uint8), cv2.COLOR_LAB2BGR).astype(np.float32)


def pegar(base, n, cfg):
    H, W = base.shape[:2]
    recorte = cargar(os.path.join(FUENTES, 'hero-arco-3-cabeza-%d.webp' % n))
    matte = cv2.imread(os.path.join(FUENTES, 'hero-arco-3-mascara-%d.png' % n), 0) > 0
    M = cfg['M']
    alfa_n = matte_suave(recorte, matte)
    color = comprimir_luces(reducir_y_mover(primer_plano(recorte, alfa_n), M, (W, H)), **{'rodilla': LUCES['rodilla'], 'razon': LUCES['razon']})
    alfa = np.clip(reducir_y_mover(alfa_n, M, (W, H), cv2.INTER_LINEAR, cv2.BORDER_CONSTANT), 0, 1)
    alfa = cv2.GaussianBlur(alfa, (0, 0), 0.9)
    if cfg['fade']:
        y0, y1 = cfg['fade']
        s = np.clip((np.arange(H, dtype=np.float32)[:, None] - y0) / (y1 - y0), 0, 1)
        alfa = alfa * (1 - s * s * (3 - 2 * s))
    a3 = alfa[..., None]
    return np.clip(base.astype(np.float32) * (1 - a3) + color * a3, 0, 255).astype(np.uint8)


def componer():
    if not os.path.exists(ENTRADA):
        import subprocess, sys
        subprocess.check_call([sys.executable, os.path.join(HERE, 'componer-hero-alumno-central.py')])
    img = cargar(ENTRADA)
    for n, cfg in ALUMNOS.items():
        img = pegar(img, n, cfg)
    return img


if __name__ == '__main__':
    os.makedirs(CACHE, exist_ok=True)
    cv2.imwrite(SALIDA, componer())
    print('→', SALIDA)
