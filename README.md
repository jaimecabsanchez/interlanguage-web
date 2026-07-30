# Interlanguage Studies — Web

Página web de Interlanguage Studies.

## Estructura

```
/
├── index.html   ← página real, lista para publicar (Netlify u otro hosting estático)
├── css/styles.css
├── js/main.js
├── images/      ← fotos en WebP/AVIF/JPEG, organizadas por sección
└── _headers     ← caché para Netlify
```

Las imágenes ya no van incrustadas en Base64: son archivos reales bajo `images/`, servidos con `<picture>` (AVIF → WebP → JPEG de respaldo) y `srcset` responsive.

**`index.html` es la web.** Es el único archivo HTML de la raíz, para que no haya confusión sobre cuál abrir.

La versión antigua (el archivo único de ~14 MB con todo incrustado) se conserva únicamente en `backup/`, con fecha, por si alguna vez hiciera falta consultarla. No se publica ni se edita.

## Cómo verla en local

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000/index.html
```

(Abrir `index.html` con doble clic también funciona, pero servirlo evita restricciones del navegador con rutas relativas.)

## Publicar en Netlify

Basta con desplegar esta carpeta tal cual: Netlify sirve `index.html` en la raíz automáticamente y aplica el caché de `_headers`.

## La plataforma de práctica (`plataforma/`)

Además de la web pública, este repo contiene la **plataforma de práctica de inglés** (proyecto aparte, en
construcción). Su diseño completo está en `docs/superpowers/` (specs y planes, todo aprobado) y su hoja de
ruta operativa en `docs/superpowers/plans/2026-07-29-plan-implementacion-definitivo.md`.

```
plataforma/
├── index.html · inicio.html · leccion.html · perfil.html · admin.html …  ← pantallas
├── auth.js            ← login (modo demo con localStorage, o Supabase real)
├── contenido.js       ← banco de ejercicios de ejemplo (en real vendrá de Supabase)
├── motor/             ← motor de actividades (plantillas P1–P7) · Bloque 7
└── supabase-config.js ← claves PÚBLICAS (anon). NUNCA la service_role aquí.

supabase/
├── schema.sql         ← modelo de datos (estado actual)
├── migrations/        ← cambios de BD versionados (se aplican en orden)
└── functions/         ← Edge Functions (lógica de servidor: alta de alumnos, etc.)
```

Stack: **web ligera + Supabase (Postgres/Auth/Storage) + Netlify**. Datos de menores → privacidad desde el
diseño (RGPD). Los secretos van en variables de entorno (ver `.env.example`), **nunca** en el repo.

## Entornos y ejecución

**Local** (desarrollo):
```bash
cd ~/Desktop/interlanguage-web
python3 -m http.server 8000
# abre http://localhost:8000/plataforma/index.html
```
Usa el proyecto Supabase de **desarrollo** (claves públicas en `plataforma/supabase-config.js`).

**Staging** (ensayo antes de producción): proyecto Supabase **separado** + Deploy Preview de Netlify.
Config de ejemplo en `.env.staging.example`. Regla: datos de prueba y datos reales **siempre separados**.

**Comprobaciones** (las mismas que corren en CI en cada cambio):
```bash
node plataforma/smoke.test.js          # base técnica bien montada
node plataforma/motor/pedagogia.test.js # modelo pedagógico (17 pruebas)
```
Node 20 (ver `.nvmrc`). No hay build ni `npm install`: es HTML/CSS/JS plano; las Edge Functions son TS de Deno.

## Desarrollo con Claude Code

Abre esta carpeta con `claude` desde la terminal para seguir editando el proyecto. No hay build ni `npm install`: es HTML/CSS/JS plano.
