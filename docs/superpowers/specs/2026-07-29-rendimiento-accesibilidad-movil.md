# Estrategia de rendimiento, accesibilidad y experiencia móvil

**Fecha:** 2026-07-29 · **Estado:** aprobado (visto bueno). DECISIONES: lanzar el MVP **sin PWA** (añadirla
justo después: manifest + SW app-shell); presupuesto de peso **~400 KB** primera carga; accesibilidad AA base en el MVP.
Base: Stack A (web ligera + Supabase + Netlify), experiencia del alumno, seguridad/privacidad.
Contexto: **niños en móviles modestos y redes irregulares** → ligereza y accesibilidad **desde el diseño**.

## Objetivos (Core Web Vitals, en campo/usuarios reales)
- **LCP < 2,5 s** (que lo principal aparezca rápido).
- **INP < 200 ms** (que responder al tocar sea inmediato).
- **CLS < 0,1** (que nada "salte" en pantalla).
- Extra propios: **peso inicial pequeño** y **primera interacción utilizable rápido** en 4G/gama media.

> Ventaja de partida: el Stack A es **web ligera** (poco JS). El mayor riesgo de rendimiento aquí **no** es el
> framework — es el **audio y las imágenes** del contenido. La estrategia se centra ahí.

---

## 1. RENDIMIENTO

| Área | Estrategia | MVP |
|---|---|---|
| **Renderizado** | HTML servido estático (rápido de pintar); JS solo para la interacción del motor. Evitar render bloqueante; CSS crítico primero | ✅ |
| **División de código (code splitting)** | El **motor** carga solo la(s) plantilla(s) que usa la actividad (P1, P5…), no las 9 de golpe. Panel admin/CMS en su propio bundle, separado de la app del alumno | ✅ |
| **Bundle inicial** | Mínimo para llegar al login y a la primera pantalla. **Presupuesto:** JS inicial **< 150 KB** comprimido (objetivo); CSS **< 50 KB** | ✅ |
| **Lazy loading** | Cargar bajo demanda: plantillas del motor, imágenes fuera de viewport (`loading="lazy"`), audio solo al necesitarlo, vistas secundarias (perfil/tienda) | ✅ |
| **Preload / prefetch** | `preconnect` a Supabase/CDN; **preload** de la fuente principal y del primer audio/imagen de la sesión; **prefetch** del siguiente ejercicio mientras responde el actual | ✅ (preconnect+preload); prefetch inteligente Fase 2 |
| **Imágenes responsive** | `srcset`/`sizes` + tamaños adecuados al móvil; nunca servir imágenes enormes escaladas por CSS; `width`/`height` siempre puestos (evita CLS) | ✅ |
| **WebP / AVIF** | Servir **AVIF con fallback WebP** (y PNG/JPG solo si hace falta); comprimir en el pipeline de contenido | ✅ (WebP mínimo; AVIF si el pipeline lo permite) |
| **Audio** | Formato comprimido eficiente (**Opus/AAC**, bitrate bajo apto para voz); clips **cortos**; `preload="none"` salvo el inmediato; reutilizar de la biblioteca; **no autoplay** sin interacción | ✅ |
| **Fuentes** | Máximo **2 familias**, subconjunto (latin), **`font-display: swap`**, self-host o Google Fonts con preconnect; evitar FOIT y saltos | ✅ |
| **Compresión** | **Brotli/gzip** en todo texto (lo da Netlify); assets ya comprimidos (imágenes/audio) no se recomprimen | ✅ |
| **Optimización de JavaScript** | Poco JS y **vanilla**/ligero; minificado; sin librerías pesadas; trabajo costoso fuera del hilo principal si aparece; evitar long tasks que rompen INP | ✅ |
| **Prevención de cambios de layout (CLS)** | Reservar espacio para imágenes/audio/botones (dimensiones fijas); fuentes con `swap` y métricas ajustadas; **skeletons** con el tamaño final; nada que empuje contenido al cargar | ✅ |
| **Presupuesto de rendimiento** | Presupuestos por página (JS/CSS/imagen/total) revisados en CI con **Lighthouse CI**; alerta si se supera | ✅ básico; automatizado Fase 2 |

**Presupuesto orientativo por vista (comprimido):** HTML < 20 KB · CSS < 50 KB · JS inicial < 150 KB ·
imagen principal < 100 KB · audio por ejercicio < 60 KB. Total primera carga **objetivo < 400 KB**.

---

## 2. CACHÉ Y CDN

Regla de oro: **cachear agresivo lo público e inmutable; nunca cachear lo privado.**

| Recurso | Estrategia de caché |
|---|---|
| **HTML** | `Cache-Control: no-cache` (revalida) o TTL corto → siempre la versión buena; barato porque es pequeño |
| **JS/CSS versionados** | Nombre con **hash** (`app.4f3a.js`) → `Cache-Control: public, max-age=31536000, immutable`. Al cambiar el código, cambia el hash |
| **Imágenes (contenido)** | CDN, `immutable` largo (ruta versionada por `id`/hash); `srcset` |
| **Audio (contenido)** | Igual que imágenes: CDN, cacheable largo, ruta estable por `id` |
| **API (Supabase)** | Datos dinámicos → **sin caché** compartida; en cliente, memoria de sesión donde tenga sentido |
| **Contenido educativo (datos)** | Ejercicios publicados son **poco cambiantes** → cacheables por versión; invalidar al publicar nueva versión |
| **Datos privados (progreso, perfil de menor)** | **`Cache-Control: private, no-store`**; **jamás** en CDN ni caché compartida |
| **Invalidación** | Por **versión/hash** en el nombre (assets) y por **número de versión** del ejercicio; publicar contenido nuevo no requiere purgar a mano |
| **Cache-Control (resumen)** | público-inmutable (assets con hash) · no-cache (HTML) · private/no-store (datos de menor) |
| **URLs firmadas** | La **media protegida** en Supabase Storage se sirve con **URL firmada caducable** (no enlaces públicos permanentes a assets ligados a un alumno); la media de contenido general puede ser pública cacheable |

Las cabeceras viven en `_headers` (Netlify) para el front y en la config de Storage para la media.
Ya existe una regla `no-cache` para `plataforma/*.js|css`; con el versionado por hash se pasará a `immutable`.

---

## 3. PWA (Progressive Web App)

Objetivo realista: que la web se **instale** como app y **arranque rápido**, con **offline limitado**. No una
app offline completa (eso es complejo y no es MVP).

| Elemento | Estrategia | MVP |
|---|---|---|
| **Instalación en pantalla de inicio** | **Web App Manifest** (nombre, iconos —Nemo—, color, `display: standalone`, orientación); prompt de instalación discreto | ⏳ **pronto tras el MVP** (no bloquea el lanzamiento) |
| **Service worker** | Cachear el **App Shell** (HTML/CSS/JS/fuentes/iconos) → segunda carga casi instantánea; estrategia *stale-while-revalidate* para assets, *network-first* para datos | ⏳ pronto (v1 sencilla) |
| **Offline limitado** | Con conexión caída: mostrar app shell + mensaje amable, y permitir **repasar lo ya descargado** (p. ej. la sesión del día precargada). Los intentos se **encolan** y se envían al recuperar red | Fase 2 (encolado); MVP: shell + aviso |
| **Actualización de versiones** | SW detecta versión nueva → aviso "hay una versión nueva, recargar"; nunca romper una sesión en curso; *skip waiting* controlado | ⏳ pronto |
| **Notificaciones (solo con consentimiento)** | Push **solo** si el usuario/tutor lo acepta explícitamente; recordatorio suave de práctica, **desactivable**; **nada** para menores sin consentimiento parental y base legal | Fase 2+ **[JUR]** |

> Decisión: **el MVP puede lanzarse SIN PWA** (web normal, rápida). La PWA entra **justo después**, empezando por
> manifest + SW de app-shell (barato y de alto impacto en cargas repetidas). El offline real y las notificaciones,
> más adelante.

---

## 4. ACCESIBILIDAD (WCAG 2.1 AA como referencia)

Especialmente importante: **niños**, algunos con **dislexia o TDAH**, en móviles. Accesible = mejor para todos.

| Área | Estrategia | MVP |
|---|---|---|
| **Teclado** | Todo operable con teclado (Tab/Enter/Espacio/flechas); orden lógico; sin trampas de foco; en drag (P4/P5) **alternativa** tocar-elemento-luego-destino | ✅ |
| **Foco** | **Foco siempre visible** (contorno claro, no solo color); mover el foco al abrir/cerrar diálogos; devolverlo al cerrar | ✅ |
| **Contraste** | Texto **≥ 4,5:1** (normal) / 3:1 (grande); controles e iconos con contraste suficiente; comprobado en la paleta de marca | ✅ |
| **Lectores de pantalla** | HTML **semántico**, roles/labels ARIA donde haga falta, `alt` en imágenes con contenido, botones con nombre accesible, anuncios de resultado con `aria-live` | ✅ |
| **Audio y transcripciones** | Todo audio con **transcripción**/texto equivalente; controles de audio visibles y grandes; nunca solo-audio sin alternativa | ✅ |
| **No depender del color** | Acierto/error también con **icono + texto + forma**, no solo verde/rojo (clave para daltonismo) | ✅ |
| **Tamaño de botones** | Objetivos táctiles **≥ 44×44 px**, con separación; pensados para dedos de niño | ✅ |
| **Reduced motion** | Respetar `prefers-reduced-motion`: celebraciones/animaciones **discretas** y reducibles/desactivables | ✅ |
| **Dislexia** | Tipografía legible, buen interlineado, líneas cortas, evitar texto en mayúsculas o justificado; **audio de apoyo** de la consigna; opción de fuente/tamaño más cómodos | ✅ (base); opción de fuente Fase 2 |
| **TDAH** | Interfaz **limpia**, una tarea por pantalla, sin distractores ni cuentas atrás agresivas, sesiones cortas, refuerzo positivo; opción de **menos animación** | ✅ |
| **Zoom** | Permitir zoom hasta **200%** sin romper el layout (nada de `user-scalable=no`); diseño **responsive** que reflowa | ✅ |
| **Mensajes de error** | Claros, en lenguaje de niño, junto al campo, con **cómo arreglarlo**; asociados por ARIA; nunca solo color; tono amable (coherente con "sin castigo") | ✅ |

Extra: **objetivo de idioma** (`lang`) correcto (contenido en inglés dentro de UI en español → marcar `lang="en"`
en los fragmentos para que el lector de pantalla los pronuncie bien). **Botón de audio** de la consigna en las
edades que aún no leen. Verificación con lector de pantalla real + teclado antes de lanzar.

---

## 5. Experiencia móvil (mobile-first)
- **Diseño para móvil primero** (la mayoría de familias usarán móvil/tablet): una tarea a pantalla completa,
  botones grandes, sin depender de *hover*, controles al alcance del pulgar, el teclado no tapa los controles.
- **Escala a tablet/desktop** con más aire (el marco tipo "app" ya explorado en la demo).
- **Orientación:** funciona en vertical; no forzar horizontal.
- **Rendimiento en gama media:** presupuestos de §1 pensados para móviles modestos, no para el móvil del que programa.

---

## 6. Verificación (cómo sabemos que se cumplen los objetivos)
- **Lighthouse / PageSpeed** en móvil simulado (laboratorio) + **CrUX/campo** cuando haya usuarios reales.
- **Presupuestos en CI** (Lighthouse CI) que fallan si se supera peso o bajan las métricas.
- **Auditoría de accesibilidad**: automática (axe) **+ manual** (teclado y lector de pantalla) — lo automático
  solo pilla ~parte; lo manual es imprescindible.
- Revisar con **datos reales** tras el piloto y ajustar.

---

## 7. Qué es imprescindible para el MVP y qué se pospone

| Elemento | MVP (imprescindible) | Posponible |
|---|---|---|
| Web ligera, CWV en objetivo, presupuestos básicos | ✅ | automatizar presupuestos en CI |
| Code splitting del motor + admin aparte | ✅ | prefetch predictivo avanzado |
| Imágenes responsive + WebP + `width/height` (CLS) | ✅ | AVIF en todo el catálogo |
| Audio comprimido, corto, sin autoplay | ✅ | streaming/adaptativo |
| Fuentes optimizadas (`swap`, subset) | ✅ | — |
| Caché por hash/versión + datos privados `no-store` + URLs firmadas | ✅ | purga/invalidación avanzada |
| **Accesibilidad AA base** (teclado, foco, contraste, alt, no-solo-color, botones grandes, zoom, reduced-motion, errores claros) | ✅ | opciones de fuente dislexia, temas |
| Transcripciones de audio | ✅ | — |
| **PWA** | — (lanzar sin ella) | ⏳ **pronto**: manifest + SW app-shell → luego offline y updates |
| Offline de práctica + encolado de intentos | — | Fase 2 |
| Notificaciones push | — | Fase 2+ **[JUR]** (consentimiento) |

---

### Próximo paso
Estas reglas se aplican **al construir** cada bloque (el motor del Bloque 2 ya nace con code-splitting,
accesibilidad y presupuestos; la caché entra con Netlify/Storage en el Bloque 6; la PWA va justo después del MVP).
Falta tu visto bueno, en especial a: **lanzar el MVP sin PWA** (y añadirla enseguida) y a los **presupuestos de peso**.
