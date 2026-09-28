# Web pública de Interlanguage Studies — guía para agentes

La web de marketing. HTML/CSS/JS plano, sin build. Es lo que Netlify publica.

## Estructura

- **`index.html`** (ES) e **`index-en.html`** (EN) → la web, con el mismo esqueleto. `legal.html` (avisos) y `404.html` (la sirve Netlify en cualquier ruta inexistente; **única excepción a las rutas relativas**: usa `/css/…`). No crees más HTML sueltos en la raíz.
- `robots.txt` y `sitemap.xml` → indexación. Si cambia una URL pública o se añade una página, actualiza el sitemap.
- `fonts/` → **Plus Jakarta Sans e Inter autoalojadas** (WOFF2 variables, subconjuntos latin y latin-ext). No vuelvas a enlazar Google Fonts: ralentiza y transfiere la IP del visitante a Google (RGPD).
- `css/styles.css` → todos los estilos. `js/main.js` → interacciones.
- `images/` → fotos por sección, servidas con `<picture>` (AVIF → WebP → JPEG) y `srcset`. Cada foto tiene varios tamaños.
- `_headers` → caché y seguridad de Netlify (se lee desde la raíz publicada, que es esta carpeta). Incluye una **CSP estricta** (todo `'self'`): si se añade analítica, un vídeo incrustado o un envío de formularios a otro dominio, hay que abrir ese dominio ahí.

## Reglas

- **Rutas relativas** (`css/…`, `js/…`, `images/…`). No uses rutas absolutas `/css` ni salgas de `web-publica/`.
- Al añadir imágenes, genera las variantes (AVIF/WebP/JPEG + tamaños) y enlázalas con `<picture>`/`srcset` como las existentes.
- **Nitidez en Retina**: el navegador reescala mal cuando el archivo elegido no guarda la proporción adecuada con lo que se pinta (medido en Chrome: nítido a ~1,5–2x el tamaño pintado en píxeles de pantalla, o exacto; borroso entre 1,05x y 1,4x y por encima de 2x). Por eso `sizes` debe reflejar el ancho **real** de la foto (ojo con `object-fit: cover`: cuenta el mayor entre el hueco y alto×proporción) y en "Crecemos con cada alumno" se declara ×1,55 a propósito, con una escalera de anchos cada ~1,2x (300, 380, 470, 580, 710, 860, 1030 y el nativo). No pongas `sizes="50vw"` genérico en fotos de tarjeta. `filter` y `transform` no causan borrosidad (medido). Variantes: `python3 scripts/generar-variantes-age-path.py`.
- Si versionas un asset (`styles.css?v=8`), **sube el número** al cambiarlo (evita caché vieja). Ahora: `styles.css?v=45`, `main.js?v=17` (en `index.html`, `index-en.html`, `legal.html` y `404.html`).
- **Una sola rejilla de contenido: 1152 px útiles** (`.container` de 1200 px con 24 px de margen). Cabecera, hero, secciones y pie deben empezar en el mismo borde izquierdo: no pongas `max-width` distintos (1160, 1180…) a wrappers de sección.
- **Los efectos `:hover` van dentro de `@media (hover:hover)`** para que no se queden "pegados" al tocar en móvil. El foco de teclado (`:focus-visible`) va fuera de esa media.
- **Preguntas frecuentes**: un solo componente, `<details class="camp-faq-item"><summary>…</summary><p>…</p></details>` (accesible por teclado sin JS). No vuelvas a montar acordeones con `<div>` y JS.
- **Textos que genera el JS** (ayudas del formulario, pasos, errores, pies de foto del método) viven en `I18N` al principio de `js/main.js`, en ES y EN. Si añades uno, tradúcelo ahí; el idioma sale de `<html lang>`.
- Cada vista (`#view-*`) lleva `data-title`: el router lo usa para el título de la pestaña y mueve el foco al `h1` al cambiar de vista.
- Botones-pastilla (`.btn-primary`, `.btn-outline`, `.sticky-cta-btn`) **sin subrayado**; solo se subrayan los enlaces dentro de texto.
- Fotos: son reales salvo la del **Big Ben** (es IA); tenlo en cuenta si se habla de autenticidad.

## Ver / publicar

```bash
python3 -m http.server 8000    # desde la raíz del repo
# http://localhost:8000/web-publica/index.html
```

Publicación: Netlify usa `netlify.toml` (`publish = "web-publica"`). Si se sube a mano, se arrastra **esta carpeta**.
