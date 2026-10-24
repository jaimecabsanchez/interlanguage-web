# Auditoría de la web pública en móvil — 24-10-2026

Alcance: `web-publica/` en español e inglés, a 390 × 844 px (iPhone), con un navegador Chrome automatizado. Se revisaron la portada, Campamentos, Extraescolar, Estudiar en el extranjero, Por qué nosotros, Especialidades, el menú, los formularios, el aviso de cookies, el aviso legal y el pie de página.

Se midió:
- **Velocidad:** en producción, con 4G lenta simulada (1,6 Mbit/s, 150 ms) y el procesador 4 veces más lento.
- **Áreas táctiles:** elementos de menos de 40 px.
- **Texto:** tamaños por debajo de 13 px.
- **Campos de formulario:** los de menos de 16 px, porque iOS amplía la página al tocarlos.
- **Desbordes horizontales y errores de consola.**

## Resumen

La base es buena: la paleta es coherente, la tipografía cuidada y no hay desbordes ni errores. Las fotos están bien dimensionadas y el diseño no se mueve al cargar (CLS 0). Los fallos encontrados eran de acabado: un pie sin márgenes, un botón invisible, áreas táctiles pequeñas, un menú muy plano y algo de peso innecesario. Están corregidos (sección 1).

Lo que queda pendiente son decisiones de contenido o de estructura (sección 2).

## 1. Corregido (sin commit; v=121 de `styles.css`)

| # | Problema | Corrección |
|---|---|---|
| 1 | **El pie no tenía margen lateral en móvil**: el texto tocaba el borde de la pantalla (también entre 1232 y 1280 px). | Margen lateral de 24 px. En móvil, dos columnas (Navegación \| Servicios), enlaces con área táctil de 40 px y unos 300 px menos de alto. |
| 2 | **El cierre de «Por qué nosotros» («¿Hablamos de tu hijo o tu hija?») no tenía fondo**: el botón marfil quedaba sobre fondo marfil y no se veía (auditoría n.º 14, también en escritorio). | Banda marina como los demás cierres oscuros. En móvil, botón a todo el ancho. |
| 3 | **Menú móvil plano**: la página no se oscurecía detrás, se podía desplazar con el menú abierto, la barra inferior seguía visible y el icono «☰» era un carácter que cambia según el sistema. | Fondo marino atenuado detrás del menú, que se cierra al tocarlo. La página no se desplaza mientras está abierto y la barra inferior se esconde. Filas de 58 px con separadores y flecha. Icono dibujado que se convierte en una X. |
| 4 | **El selector «Destino que os interesa» estaba a 15 px**: en iPhone la página se ampliaba al tocarlo. | 16 px. |
| 5 | Áreas táctiles de menos de 40 px: «Volver a servicios» (22 px), «Pedir orientación» del hero (31 px), enlaces del pie (17 px). | Todas a 40–44 px. De 12–16 por página quedan 1–4, todas enlaces dentro de un texto o casillas con etiqueta pulsable (admitidas en WCAG 2.5.8). |
| 6 | Botones de la cabecera de Campamentos y Extraescolar a medio ancho, distintos de la portada. | A todo el ancho y 52 px de alto, como en la portada y en «Estudiar en el extranjero». |
| 7 | Rótulo del hero a 10,9 px. | 11,5 px, con la raya más corta para que siga en una línea. |
| 8 | Barra inferior «Pedir orientación» pegada al indicador de inicio del iPhone. | Respeta la zona segura y el botón mide 48 px. |
| 9 | **Logo de 66 KB** (se descarga en todas las páginas antes que el resto). | `logo-4.webp`, 13 KB, sin pérdida visible (128 colores). Nombre nuevo, porque las imágenes se guardan en caché como inmutables. |
| 10 | Las tarjetas de «Un programa para cada momento» pedían en móvil fotos para 530 px de ancho y la tarjeta mide 342. | `sizes` corregido: el móvil descarga las versiones de 1030 px en lugar de las de 1470–1536. |

**Peso inicial de la portada en móvil (logo + fotos de tarjetas):** de 420 KB a 251 KB, unos 170 KB menos (–40 % en esas imágenes).

**Escritorio:** solo cambian el pie (margen lateral, visualmente igual a 1440 px) y el cierre de «Por qué nosotros», que ya se ve. Comprobado a 1440 px.

## 1 bis. Segunda pasada, corregido (25-10-2026; v=122 de `styles.css`)

| # | Detalle | Corrección |
|---|---|---|
| 11 | La barra inferior «Pedir orientación» era una franja marina maciza de 69 px que tapaba la página todo el rato. | Barra translúcida color marfil, con desenfoque, que deja intuir lo que hay detrás. El botón es burdeos, el color de la acción principal en toda la web. Si el navegador no admite el desenfoque, la barra es marfil opaca. |
| 12 | Al tocar un botón o una tarjeta aparecía el recuadro gris del sistema y no había ninguna respuesta propia. | Sin recuadro gris. En pantallas táctiles, botones y tarjetas se hunden ligeramente al tocarlos y las opciones del menú se atenúan. |
| 13 | La barra del navegador del móvil se teñía de azul marino encima de una cabecera blanca. | `theme-color` blanco en las 5 páginas: la barra del navegador continúa la cabecera. |
| 14 | iOS podía agrandar el texto al girar el móvil. | `text-size-adjust:100%`. |
| 15 | En el pie de dos columnas, «Campamentos de verano» se partía en dos líneas. | Columnas proporcionadas (0,8 / 1,2): cada enlace en una línea. |
| 16 | En móviles de 320–360 px, el rótulo del hero ocupaba dos líneas. | Sin la raya decorativa por debajo de 400 px: cabe en una línea. |
| 17 | En las tarjetas de programas, la edad pesaba casi lo mismo que el nombre. | El nombre pasa de 19 a 23 px. |
| 18 | «Ver el horario completo» usaba ▾ y las preguntas frecuentes usaban +. | Mismo signo + en todos los desplegables. |
| 19 | Los botones de «¿Y más adelante?» usaban el carácter «→» y los demás un icono. | El mismo icono de flecha que el resto (ES y EN). |
| 20 | Al desplazarse rápido, las secciones tardaban en aparecer (desplazamiento de 24 px, 0,6 s). | En móvil, 12 px y 0,45 s. |

## 1 ter. Tercera pasada, corregido (25-10-2026; `styles.css` v=123, `main.js` v=43)

| # | Detalle | Corrección |
|---|---|---|
| 21 | El aviso de cookies hablaba de analítica que no existe y tapaba la primera pantalla. | No se muestra mientras `ANALYTICS_ENABLED = false` (`js/main.js`). Si algún día se activa, «Rechazar» y «Aceptar» tienen el mismo peso. |
| 22 | Cabecera del móvil con logo, ES/EN y menú: tres elementos que competían. | En móvil la cabecera lleva solo el logo y el menú. Dentro del menú, «Español · English» (conserva la página en la que estás) y el correo. En escritorio no cambia. |
| 23 | «Orientación personalizada para estudiar en el extranjero» ocupaba 4 líneas. | «Orientación para estudiar fuera» (EN: «Guidance for studying abroad»). |
| 24 | Tarjetas de destinos con dos enlaces burdeos seguidos. | «Ver opciones…» pasa a marino y solo «Pedir orientación» queda en burdeos. |
| 25 | Barras de 12 px en «Crecemos con cada alumno». | 5 px en móvil. |
| 26 | Campamentos: la foto de «Un día en TalenTalk» iba antes del título, y la de «Preguntas frecuentes» entre el título y las preguntas. | Título primero y foto después. |
| 27 | El formulario de campamentos estaba a 12 px del borde. | 16 px. |
| 28 | La tabla de cookies del aviso legal se salía de la pantalla a 320–360 px. | En móvil, una ficha por tipo de cookie. |
| 29 | Casillas de privacidad de 22 px. | 24 px. |

Comprobado en todas las páginas (ES y EN) a 320, 360, 390, 430, 820, 1024 y 1440 px: sin desbordes y sin errores. Elementos táctiles de menos de 40 px: 0 en portada, Extraescolar, Por qué nosotros y Especialidades; 1 en «Estudiar en el extranjero» y 3 en Campamentos. Son enlaces dentro de un texto y las casillas, admitidos.

## 2 bis. Más mejoras propuestas (piden decisión o cambiar textos)

- **Datos de confianza de la portada:** «Orientación personalizada para estudiar en el extranjero» ocupa 4 líneas y las otras dos o tres. Propuesta: «Orientación para estudiar fuera».
- **Destinos en «Estudiar en el extranjero»:** cada tarjeta tiene «Ver opciones…» y «Pedir orientación», dos enlaces burdeos seguidos. Mejor dejar uno por tarjeta.
- **Menú:** llevar ES/EN y el correo dentro del menú despejaría la cabecera (logo + menú) y daría una salida directa al contacto.
- **«Crecemos con cada alumno»:** las barras de 12 px de color pesan mucho en móvil. La línea de tiempo vertical que diseñamos en la vista previa lo resolvería.
- **Campamentos:** en «Un día en TalenTalk» y en «Preguntas frecuentes» la foto aparece antes del título o entre el título y la lista. Conviene que el título vaya primero.
- **Formulario de campamentos:** la tarjeta queda a 12 px del borde y el resto de la página a 24 px. Igualarlo a 16 px.

## 2. Pendiente: decisiones de contenido o estructura

Ordenado por impacto.

1. **Aviso de cookies.** Dice «cookies propias y de terceros (analítica)», pero la web no carga analítica (n.º 3). Además, «Rechazar» va en gris y «Aceptar» en burdeos, y la AEPD pide que rechazar sea igual de fácil y visible que aceptar.
   - **Recomendación:** si no vais a usar analítica, quitar el aviso. Es lo que más ensucia la primera pantalla en móvil.
   - **Si se mantiene:** botones con el mismo peso visual.
2. **«Estudiar en el extranjero» mide 13.400 px en móvil**, unas 16 pantallas.
   - Medido: el LCP con entrada directa es 7,3 s en 4G lenta, porque descarga también la foto de la portada.
   - Mi lectura de las causas: la foto de cabecera se carga en diferido y las fotos de la portada compiten con ella. Es la consecuencia de que los programas sean vistas dentro de `index.html` y no páginas propias (n.º 9 y n.º 39).
   - **Solución de fondo:** páginas separadas. Es lo que más mejoraría velocidad y SEO.
3. **Portada: LCP 4,4 s en 4G lenta** (FCP 2,3 s). El objetivo «bueno» es 2,5 s. Además de los 170 KB ahorrados, quedan:
   - **Fuentes:** se precargan tres (161 KB) que compiten con la foto del hero. Se podría recortar más Newsreader (89 KB) o no precargar la cursiva.
   - **Script de Netlify:** producción carga `/.netlify/scripts/hud?variant=public` (11 KB), que no es vuestro. Conviene desactivar en Netlify la barra de colaboración para la web publicada.
4. **Tarjetas de programas en móvil:** cuatro tarjetas de unos 470 px, casi 1.900 px. Si se adopta el diseño de la vista previa (tarjetas verticales), en móvil conviene una fila deslizable o tarjetas horizontales compactas.
5. **Formularios:** las casillas de privacidad miden 22 px. Funcionan porque toda la etiqueta es pulsable, pero se pueden agrandar a 24 px para que se vean mejor.
6. **Coherencia de edades:** las tarjetas, el camino 3–18 y el menú dan cifras distintas para el mismo programa (n.º de la auditoría del 12-10).
7. **Tablas del aviso legal:** en móvil la tabla de cookies queda apretada. Mejor en filas apiladas.

## 3. Lo que ya está bien y conviene mantener

- Hero de la portada en móvil: la foto arriba, el texto sobre marino y la acción principal visible sin desplazarse.
- Sin desbordes horizontales en ninguna página ni errores de consola.
- Imágenes AVIF/WebP con `srcset`.
- Diseño estable al cargar (CLS 0 en la portada).
- Barra de secciones de «Estudiar en el extranjero» fija bajo la cabecera, con fundido a la derecha.
- Formularios con campos de 50 px y etiquetas visibles.
- Errores accesibles.
