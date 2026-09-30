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
- Si versionas un asset (`styles.css?v=8`), **sube el número** al cambiarlo (evita caché vieja). Ahora: `styles.css?v=48`, `main.js?v=18` (en `index.html`, `index-en.html`, `legal.html` y `404.html`).
- **Una sola rejilla de contenido: 1232 px útiles** (`.container` de 1280 px con 24 px de margen). Cabecera, hero, secciones y pie deben empezar en el mismo borde izquierdo: no pongas `max-width` distintos (1160, 1180…) a wrappers de sección.
- **Los efectos `:hover` van dentro de `@media (hover:hover)`** para que no se queden "pegados" al tocar en móvil. El foco de teclado (`:focus-visible`) va fuera de esa media.
- **Preguntas frecuentes**: un solo componente, `<details class="camp-faq-item"><summary>…</summary><p>…</p></details>` (accesible por teclado sin JS). No vuelvas a montar acordeones con `<div>` y JS.
- **Textos que genera el JS** (ayudas del formulario, pasos, errores, pies de foto del método) viven en `I18N` al principio de `js/main.js`, en ES y EN. Si añades uno, tradúcelo ahí; el idioma sale de `<html lang>`.
- Cada vista (`#view-*`) lleva `data-title`: el router lo usa para el título de la pestaña y mueve el foco al `h1` al cambiar de vista.
- Botones-pastilla (`.btn-primary`, `.btn-outline`, `.sticky-cta-btn`) **sin subrayado**; solo se subrayan los enlaces dentro de texto.
- Fotos: son reales salvo la del **Big Ben** (es IA); tenlo en cuenta si se habla de autenticidad.
- **Orden de destinos: siempre Reino Unido, luego Irlanda y luego Estados Unidos** (en ES y EN, en textos, listas, selectores y tarjetas). Nunca "Irlanda, Reino Unido…".
- **Tono de los mensajes de ayuda: en positivo.** Nada de "¿No tienes claro…?"; el buscador por edad de "Nuestros programas" (`#svcFinder`) y el "Quiero que me orienten" del formulario son el enfoque.
- **Logo**: `images/icons/logo-3.*` (recortado al contenido, 556×180, se pinta a 58 px en escritorio y 44 px en móvil). `logo-2` queda solo para el JSON-LD y como original. La cabecera fija mide `--header-h` (91 px / 69 px en móvil): el menú móvil cuelga de ese valor.
- **Foto del profesor con el cartel en inglés** (`programas/profesor-ritmo-en.*`, cartel «Rhythm train»): sustituye a `profesor-ritmo.*` (cartel «Tren rítmico», que se conserva sin usar). Se genera con `scripts/editar-cartel-ritmo.py`. Sale en el mosaico del hero, en «Crecemos con cada alumno», en el hero de extraescolar y en Por qué nosotros.
- **Hero de la home** (`.hero`): titular en peso 600, frase sin negritas, una sola foto (`internacional/hero-campus-2`, enlaza a «Estudiar en el extranjero») y una fila de datos de confianza en texto sencillo (`.hero-facts`, sin iconos ni negritas). No vuelvas a poner fotos de actividades ni el mosaico. Foto sin recorte (4:3). En escritorio usa un `<source media="(min-width:961px)">` con solo 1030/1200/1448 y `sizes="600px"`: con Retina sale la de 1200 y con pantalla normal la de 1030, ambas nítidas (un solo `sizes` con toda la escalera no lo consigue). En móvil y tableta, escalera completa con el ancho pintado.
- **«Crecemos con cada alumno»**: en escritorio las 4 fotos suben en escalera (alto 160/190/220/250 px). Si cambias esas alturas hay que recalcular los `sizes` de las tarjetas 2, 3 y 4 (las 3 y 4 se recortan a lo alto, así que su ancho pintado es fijo).
- **Formularios** (mismo sistema visual, definido en el bloque «FORMULARIOS» de `styles.css`): la consulta `#leadForm` (2 pasos; servicio en tarjetas y solo los campos que aplican: edad siempre, colegio en extraescolar, destino y duración en extranjero) y la inscripción `#campForm` (una sola página con 3 bloques numerados y resumen fijo con el total). Los textos van en el HTML (`<html lang>`), salvo los `data-l-*` del `<form id="campForm">` y `T.sending`/`T.leadError` de `main.js`. Los **nombres de campo que recibe `form-handler.php` no cambian**.
- Las tarjetas de CTA de otras subpáginas rellenan la consulta con `window.ilLead` (`select`, `setDestination`, `setNote`); no vuelvas a tocar `#service` a mano.

## Ver / publicar

```bash
python3 -m http.server 8000    # desde la raíz del repo
# http://localhost:8000/web-publica/index.html
```

Publicación: Netlify usa `netlify.toml` (`publish = "web-publica"`). Si se sube a mano, se arrastra **esta carpeta**.
