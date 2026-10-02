# Web pública de Interlanguage Studies — guía para agentes

La web de marketing. HTML/CSS/JS plano, sin build. Es lo que Netlify publica.

## Estructura

- **`index.html`** (ES) e **`index-en.html`** (EN) → la web, con el mismo esqueleto. `legal.html` (avisos) y `404.html` (la sirve Netlify en cualquier ruta inexistente; **única excepción a las rutas relativas**: usa `/css/…`). No crees más HTML sueltos en la raíz.
- `robots.txt` y `sitemap.xml` → indexación. Si cambia una URL pública o se añade una página, actualiza el sitemap.
- `fonts/` → **Fraunces (titulares, redonda y cursiva) y Plus Jakarta Sans (texto e interfaz) autoalojadas** (WOFF2 variables, subconjuntos latin y latin-ext). Inter ya no se usa. No vuelvas a enlazar Google Fonts: ralentiza y transfiere la IP del visitante a Google (RGPD). Si **sustituyes el contenido** de una fuente, cámbiale el nombre (`_headers` las marca `immutable`: con el mismo nombre quien ya visitó la web seguiría viendo la antigua).
- `css/styles.css` → todos los estilos. `js/main.js` → interacciones.
- `images/` → fotos por sección, servidas con `<picture>` (AVIF → WebP → JPEG) y `srcset`. Cada foto tiene varios tamaños.
- `_headers` → caché y seguridad de Netlify (se lee desde la raíz publicada, que es esta carpeta). Incluye una **CSP estricta** (todo `'self'`): si se añade analítica, un vídeo incrustado o un envío de formularios a otro dominio, hay que abrir ese dominio ahí.

## Reglas

- **Rutas relativas** (`css/…`, `js/…`, `images/…`). No uses rutas absolutas `/css` ni salgas de `web-publica/`.
- Al añadir imágenes, genera las variantes (AVIF/WebP/JPEG + tamaños) y enlázalas con `<picture>`/`srcset` como las existentes.
- **Nitidez en Retina**: el navegador reescala mal cuando el archivo elegido no guarda la proporción adecuada con lo que se pinta (medido en Chrome: nítido a ~1,5–2x el tamaño pintado en píxeles de pantalla, o exacto; borroso entre 1,05x y 1,4x y por encima de 2x). Por eso `sizes` debe reflejar el ancho **real** de la foto (ojo con `object-fit: cover`: cuenta el mayor entre el hueco y alto×proporción) y en "Crecemos con cada alumno" se declara ×1,55 a propósito, con una escalera de anchos cada ~1,2x (300, 380, 470, 580, 710, 860, 1030 y el nativo). No pongas `sizes="50vw"` genérico en fotos de tarjeta. `filter` y `transform` no causan borrosidad (medido). Variantes: `python3 scripts/generar-variantes-age-path.py`.
- Si versionas un asset (`styles.css?v=8`), **sube el número** al cambiarlo (evita caché vieja). Ahora: `styles.css?v=49`, `main.js?v=18` (en `index.html`, `index-en.html`, `legal.html` y `404.html`).
- **Una sola rejilla de contenido: 1232 px útiles** (`.container` de 1280 px con 24 px de margen). Cabecera, hero, secciones y pie deben empezar en el mismo borde izquierdo: no pongas `max-width` distintos (1160, 1180…) a wrappers de sección.
- **Los efectos `:hover` van dentro de `@media (hover:hover)`** para que no se queden "pegados" al tocar en móvil. El foco de teclado (`:focus-visible`) va fuera de esa media.
- **Preguntas frecuentes**: un solo componente, `<details class="camp-faq-item"><summary>…</summary><p>…</p></details>` (accesible por teclado sin JS). No vuelvas a montar acordeones con `<div>` y JS.
- **Textos que genera el JS** (ayudas del formulario, pasos, errores, pies de foto del método) viven en `I18N` al principio de `js/main.js`, en ES y EN. Si añades uno, tradúcelo ahí; el idioma sale de `<html lang>`.
- Cada vista (`#view-*`) lleva `data-title`: el router lo usa para el título de la pestaña y mueve el foco al `h1` al cambiar de vista.
- Botones (`.btn-primary`, `.btn-outline`, `.sticky-cta-btn`) **sin subrayado**; solo se subrayan los enlaces dentro de texto. Ya no son píldoras: radio `--r-btn` (5 px).
- **Paleta «Colegio» (dirección P del documento de paletas, 02-10-2026)**, solo con tokens de `:root`: `--navy` #16294A (titulares, bloques oscuros), `--forest` #2E5E4C (secundario: etiquetas, éxito, bloque de contacto), `--accent` #7A2334 (burdeos: botones, enlaces y números; texto blanco encima 11:1), `--accent-dark` (hover), `--accent-soft` #E9CDD2 (acento sobre marino), `--ivory` #FAF8F2 (fondo de página), `--stone` #F0ECE2 (bandas y superficies), `--ink`/`--ink-soft`, `--error` #B3261E **solo errores de formulario** (distinto del acento de marca). Ya no existen `--coral`, `--teal`, `--mint`, `--off`, `--peach`, `--sun`: no los recrees ni pongas hex sueltos. Formas: `--r-btn` 5 px, `--r-card` 8 px, `--r-sm` 6 px (nada de píldoras ni radios de 20 px+).
- **Tipografía**: titulares (`h1`–`h4`, `--font-display`) en **Fraunces 600** y la segunda línea del h1 en cursiva 500; texto e interfaz en **Plus Jakarta Sans 500**. Etiquetas en mayúsculas y botones siempre en `--font-body` (la serifa en mayúsculas pequeñas se ve mal). Los números grandes (01, 02, 30+) en Fraunces.
- Fotos: son reales salvo la del **Big Ben** (es IA); tenlo en cuenta si se habla de autenticidad.
- **Orden de destinos: siempre Reino Unido, luego Irlanda y luego Estados Unidos** (en ES y EN, en textos, listas, selectores y tarjetas). Nunca "Irlanda, Reino Unido…".
- **Tono de los mensajes de ayuda: en positivo.** Nada de "¿No tienes claro…?"; el buscador por edad de "Nuestros programas" (`#svcFinder`) y el "Quiero que me orienten" del formulario son el enfoque.
- **Logo**: `images/icons/logo-3.*` (recortado al contenido, 556×180, se pinta a 58 px en escritorio y 44 px en móvil). `logo-2` queda solo para el JSON-LD y como original. La cabecera fija mide `--header-h` (91 px / 69 px en móvil): el menú móvil cuelga de ese valor.
- **Foto del profesor con el cartel en inglés** (`programas/profesor-ritmo-en.*`, cartel «Rhythm train»): sustituye a `profesor-ritmo.*` (cartel «Tren rítmico», que se conserva sin usar). Se genera con `scripts/editar-cartel-ritmo.py`. Sale en el mosaico del hero, en «Crecemos con cada alumno», en el hero de extraescolar y en Por qué nosotros.
- **Hero de la home** (`.hero`, dirección P «Colegio · serifa»): foto **a sangre** (`internacional/hero-colegio-*`, ya **espejada**: los alumnos a la derecha y el texto a la izquierda; enlazada solo como imagen, sin enlaces dentro), velo marino translúcido **de izquierda a derecha** (`.hero-veil`, no uses filtros sobre la foto: se queda natural), titular con serifa y datos de confianza en una franja aparte (`.trust > .hero-facts`, texto sencillo sin iconos). Alto: `clamp(520px, min(50vw, 100svh − cabecera), 780px)`. En tableta y móvil (≤1024 px) la foto va arriba entera y el texto debajo sobre marino. No vuelvas a poner mosaico ni fotos de actividades. Nitidez: la escalera 640 / 960 / 1280 / 1448 (nativa) / 1920 / 2560 / 2880 con `sizes="100vw"` hace que el navegador elija el archivo cuyo ancho coincide con la pantalla (medido: escala 1,00x en 1280, 1440 y 1920 px, normal y Retina; solo un monitor 4K a 1920 px llega a 1,33x). La foto original mide 1448 px: por encima se amplía con Lanczos y una máscara de enfoque muy suave. Se genera con `python3 scripts/generar-hero-colegio.py`; `hero-campus-2-*` son los antiguos (el `.jpg` es el origen).
- **«Un programa para cada etapa»** (`#servicios`): índice editorial de 3 filas (`.svc-index > a.svc-card2`: número en serifa, título + etiquetas, descripción y enlace), **sin fotos**, como en la dirección P; el buscador por edad va debajo. Cada fila sigue siendo un enlace con `data-service` (el router de `main.js` lo usa).
- **«Crecemos con cada alumno»**: en escritorio las 4 fotos suben en escalera (alto 160/190/220/250 px). Si cambias esas alturas hay que recalcular los `sizes` de las tarjetas 2, 3 y 4 (las 3 y 4 se recortan a lo alto, así que su ancho pintado es fijo).
- **Formularios** (mismo sistema visual, definido en el bloque «FORMULARIOS» de `styles.css`): la consulta `#leadForm` (2 pasos; servicio en tarjetas y solo los campos que aplican: edad siempre, colegio en extraescolar, destino y duración en extranjero) y la inscripción `#campForm` (una sola página con 3 bloques numerados y resumen fijo con el total). Los textos van en el HTML (`<html lang>`), salvo los `data-l-*` del `<form id="campForm">` y `T.sending`/`T.leadError` de `main.js`. Los **nombres de campo que recibe `form-handler.php` no cambian**.
- Las tarjetas de CTA de otras subpáginas rellenan la consulta con `window.ilLead` (`select`, `setDestination`, `setNote`); no vuelvas a tocar `#service` a mano.

## Ver / publicar

```bash
python3 -m http.server 8000    # desde la raíz del repo
# http://localhost:8000/web-publica/index.html
```

Publicación: Netlify usa `netlify.toml` (`publish = "web-publica"`). Si se sube a mano, se arrastra **esta carpeta**.
