# PROJECT_CONTEXT · Interlanguage

Contexto estable del repo para trabajar sin reanalizarlo entero en cada tarea.
Repo multiproyecto. **La web pública es el foco de estas tareas: `web-publica/`.**

## Stack y tecnologías
- Sitio **estático**: HTML + CSS + JavaScript vanilla. **Sin framework, sin bundler, sin build.**
- Formularios servidos por **PHP** (`form-handler.php`) en hosting Arsys (no en Netlify).
- Despliegue: **Netlify**, publica la carpeta `web-publica/` (ver `netlify.toml` raíz).
- La plataforma (`plataforma/`) es un proyecto APARTE (app "Interlanguage HOME", Supabase); no tocar salvo encargo explícito.

## Estructura relevante (raíz)
- `web-publica/` — web pública de marketing (ES + EN).
- `plataforma/` — app del alumno (proyecto separado).
- `supabase/` — backend de la plataforma.
- `docs/`, `material-fuente/`, `archivo/`, `scripts/` — documentación, fuentes y utilidades.
- `AGENTS.md` (+ `web-publica/AGENTS.md`, `plataforma/AGENTS.md`) — **reglas fuente de verdad**, alineadas con Codex.

## web-publica/ — archivos principales
- `index.html` — sitio ES completo (~1246 líneas). SPA por vistas (ver Rutas).
- `index-en.html` — sitio EN, traducción profesional (misma estructura).
- `legal.html` — aviso legal / privacidad / cookies (~101 líneas).
- `css/styles.css` — **única hoja de estilos** (~866 líneas).
- `js/main.js` — **único JS** (~689 líneas).
- `form-handler.php` — receptor de formularios (envía email; solo funciona en Arsys).
- `_headers` — seguridad + caché Netlify.

## Páginas y rutas
- Dos páginas reales: `index.html` (ES) e `index-en.html` (EN), con `hreflang` es/en/x-default y conmutador `.lang-switch`.
- Dentro de cada página, **navegación por "vistas"** (mostrar/ocultar, gestionada en `main.js`):
  `view-home`, `view-service-campamentos`, `view-service-extranjero`,
  `view-service-extraescolar`, `view-service-especialidades`, `view-service-metodologia`.
- Navegación interna por anclas `#...` (p. ej. `#servicio-campamentos`, `#contacto`, `#destinos`);
  hash tipo `servicio-*` cambia de vista, el resto hace scroll dentro de la vista visible.

## Componentes reutilizables (patrones ya existentes — reutilizar)
- Imágenes responsive: `<picture>` AVIF → WebP → JPG con `srcset` (480/800/1200/…w) + `object-fit:cover`.
- Carrusel de testimonios: `#testCarousel` / `#testTrack` / `#testDots` (respeta `prefers-reduced-motion`).
- Formulario adaptativo: `#serviceExtra`, `#serviceHelp`, `#studentAgeLabel` (cambian según el servicio).
- Marcos de foto (`.hero-photo-frame`, `.camp-hero-media`, etc.) con `aspect-ratio` + `object-fit:cover`.
- Botones `.btn-primary` / `.btn-outline`, `.eyebrow`, colecciones tipo collage (`.intl-collage-item`).

## Sistema de estilos
- Un solo `css/styles.css` con **tokens de color en `:root`** (`--navy`, `--coral`, `--coral-dark`, `--ink-soft`, `--line`, …).
- **Usar siempre los tokens; no colores hardcodeados nuevos.**
- Responsive por `@media` (breakpoints ~960/900/600/480px).
- **Cache-busting manual:** al cambiar `.css`/`.js` subir el `?v=N` en AMBAS páginas
  (actual: `styles.css?v=30`, `main.js?v=14`). Necesario porque `_headers` marca css/js/images como `immutable`.
- Reemplazar una imagen: **renombrar el archivo** (p. ej. `hero-campus-2`) porque `/images/*` es inmutable en caché.

## Fotografías / assets
- Raíz de assets: `web-publica/images/` por temas:
  `internacional/` (~113), `campamentos/` (~51), `extraescolar/` (~25), `programas/` (~16),
  `icons/` (6), `nuevas/` (7); `hero/`, `metodologia/`, `testimonios/` vacías.
- `web-publica/images/og-image.jpg` — imagen social (1200×630).
- Formatos por imagen: `.avif` + `.webp` + `.jpg` en varios anchos.

## Formularios existentes
- `#leadForm` — solicitud de información.
- `#campForm` — inscripción a campamento de verano.
- Ambos con `action="form-handler.php"` (POST). Validación en `main.js` + en el PHP.
- `form-handler.php`: honeypot `website`, valida email/nombre/rgpd, envía email a `info@interlanguage.es`
  (`FROM_ADDRESS = no-reply@interlanguage.es`). **Solo funciona desplegado en Arsys (PHP), no en Netlify.**

## Datos / configuración
- No hay base de datos ni backend propio en la web pública (los datos comerciales están escritos en el HTML).
- Configuración de despliegue: `netlify.toml` (raíz) → `publish = "web-publica"`; `web-publica/_headers`.
- Dominio del sitio: `interlanguage.es`.

## Scripts / comandos
- **No hay `package.json` ni scripts npm.** Sin dependencias instalables.
- **Desarrollo (previsualizar):** servidor estático simple, p. ej.:
  `python3 -m http.server 8096 --directory .` y abrir `/web-publica/index.html`.
- **Build:** ninguno (sitio estático; Netlify solo publica `web-publica/` tal cual).
- Pipeline de imágenes (manual, cuando haga falta): Python + Pillow + `pillow_avif`
  (AVIF q≈70, WebP q≈90 method=6, JPG q≈90 progressive/optimize, resize LANCZOS).

## Dependencias importantes
- Runtime web: **ninguna** (sin librerías JS externas de terceros).
- Hosting formularios: **PHP** en Arsys.
- Utilidad opcional (solo generar imágenes): **Pillow** + **pillow-avif-plugin**.

## Línea "Estudiar en el extranjero" (hub)
- Vive en `#view-service-extranjero` (ES) y su espejo en `index-en.html`. Secciones propias:
  `#ext-destinos`, `#ext-programas`, `#ext-proceso`, `#ext-nivel` (orden: intro, cifras, destinos, tipos, proceso, nivel, galería, dudas).
- Destinos reales: Irlanda, Reino Unido, Estados Unidos. Tipos: verano, curso escolar, año académico.
- **Escalabilidad de rutas:** el router de `main.js` ya resuelve `#servicio-<key>` → `#view-service-<key>`.
  Para abrir una URL propia de destino/programa basta con añadir `<div id="view-service-extranjero-irlanda">`
  y cambiar la tarjeta de `data-advise` a `data-jump-service` (`data-destino` / `data-programa` guardan el slug previsto). Sin código nuevo.
- Hoy las tarjetas (`data-advise="extranjero"`) llevan al formulario de contacto con servicio y destino ya elegidos (handler en `main.js`).
- **Passport / English Profile: NO existe en este repo.** (El `passport-stamp` de `plataforma/` es
  gamificación del alumno, otra cosa). `Student Fit Profile`: tampoco existe, no se ha construido.
  Punto de integración preparado: contenedor `#ext-nivel` con `data-level-entry="pending"`.
  Pendiente para integrarlo: definir dónde vive el producto (repo/URL), qué devuelve (nivel CEFR),
  y sustituir el CTA "Revisar el nivel con un asesor" por su punto de entrada real.

## Línea "Campamentos" (`#view-service-campamentos`, ES + espejo EN)
- Orden: hero+ficha (edad, fechas, sedes, precio, CTA) → `#camp-fechas` → `#camp-que` → `#camp-dia`
  → `#camp-precio` → `#camp-faq` → `#form-campamentos` (inscripción) → puente a internacional.
- **Precios: fuente única = tarjetas `#camp-precio` (`data-pack-weeks` = nº de semanas, importe en `<strong>`)
  y `[data-comedor-price]`.** `main.js` los lee de ahí; total = pack(n) + comedor × n. Si falta un importe
  NO calcula: muestra "A confirmar" y envía `total` vacío. Nunca duplicar importes en JS.
- Formulario `#campForm`, 3 pasos (sede+semanas → alumno/a → tutor/a+RGPD): validación con `.err` junto al campo
  (mensajes en el HTML), resumen `[data-camp-summary]`/`[data-sum]`, textos ES/EN en `data-l-*` del `<form>`.
- `form-handler.php` (`form_type=campamento`): añade `alumnoEdad`; 422 si falta sede/semanas/alumno.
- Pendiente de confirmar por negocio (no corregir sin dato): rango de edad (3-10 vs Talent Juniors 8-16),
  año de las fechas (22 jun–24 jul), horario/recogida sin comedor, "Desde 160€/semana" vs packs, qué incluye el precio.

---

## Reglas de trabajo
1. Reutilizar el código/patrones existentes antes de crear componentes nuevos.
2. No modificar zonas que no formen parte del encargo.
3. No inventar datos comerciales (precios, cifras, sedes, contacto).
4. No instalar dependencias salvo necesidad técnica real.
5. Leer únicamente los archivos necesarios para cada tarea.
6. No generar auditorías largas salvo que se soliciten.
7. Tras cambios importantes, comprobar que el proyecto "compila" (HTML válido/equilibrado y la web carga sin errores).
8. Mantener la identidad visual actual de Interlanguage (tokens `--*`, tipografías y estilo existentes).
