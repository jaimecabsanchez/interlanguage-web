# Web pública de Interlanguage Studies — guía para agentes

La web de marketing. HTML/CSS/JS plano, sin build. Es lo que Netlify publica.

## Estructura

- **`index.html`** → la web. Es el **único** HTML aquí (no crees más HTML sueltos en la raíz de esta carpeta).
- `css/styles.css` → todos los estilos. `js/main.js` → interacciones.
- `images/` → fotos por sección, servidas con `<picture>` (AVIF → WebP → JPEG) y `srcset`. Cada foto tiene varios tamaños.
- `_headers` → caché y seguridad de Netlify (se lee desde la raíz publicada, que es esta carpeta).

## Reglas

- **Rutas relativas** (`css/…`, `js/…`, `images/…`). No uses rutas absolutas `/css` ni salgas de `web-publica/`.
- Al añadir imágenes, genera las variantes (AVIF/WebP/JPEG + tamaños) y enlázalas con `<picture>`/`srcset` como las existentes.
- **Nitidez en Retina**: el navegador reescala mal cuando el archivo elegido no guarda la proporción adecuada con lo que se pinta (medido en Chrome: nítido a ~1,5–2x el tamaño pintado en píxeles de pantalla, o exacto; borroso entre 1,05x y 1,4x y por encima de 2x). Por eso `sizes` debe reflejar el ancho **real** de la foto (ojo con `object-fit: cover`: cuenta el mayor entre el hueco y alto×proporción) y en "Crecemos con cada alumno" se declara ×1,55 a propósito, con una escalera de anchos cada ~1,2x (300, 380, 470, 580, 710, 860, 1030 y el nativo). No pongas `sizes="50vw"` genérico en fotos de tarjeta. `filter` y `transform` no causan borrosidad (medido). Variantes: `python3 scripts/generar-variantes-age-path.py`.
- Si versionas un asset (`styles.css?v=8`), **sube el número** al cambiarlo (evita caché vieja).
- Fotos: son reales salvo la del **Big Ben** (es IA); tenlo en cuenta si se habla de autenticidad.

## Ver / publicar

```bash
python3 -m http.server 8000    # desde la raíz del repo
# http://localhost:8000/web-publica/index.html
```

Publicación: Netlify usa `netlify.toml` (`publish = "web-publica"`). Si se sube a mano, se arrastra **esta carpeta**.
