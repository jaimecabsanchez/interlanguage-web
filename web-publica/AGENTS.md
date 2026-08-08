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
- Si versionas un asset (`styles.css?v=8`), **sube el número** al cambiarlo (evita caché vieja).
- Fotos: son reales salvo la del **Big Ben** (es IA); tenlo en cuenta si se habla de autenticidad.

## Ver / publicar

```bash
python3 -m http.server 8000    # desde la raíz del repo
# http://localhost:8000/web-publica/index.html
```

Publicación: Netlify usa `netlify.toml` (`publish = "web-publica"`). Si se sube a mano, se arrastra **esta carpeta**.
