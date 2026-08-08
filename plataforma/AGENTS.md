# Plataforma "Interlanguage HOME" — guía para agentes

App de práctica de inglés (alumnos de Primaria + ESO). HTML/CSS/JS plano + Supabase. Sin build.

## Arquitectura rápida

- **Pantallas**: `inicio.html`, `leccion.html`, `progreso.html`, `perfil.html`, `tienda.html`, `test-nivel.html`, `index.html` (login), `admin*.html`, `onboarding.html`, `cambiar-clave.html`, `informe.html`.
- **`auth.js`** → `window.ILAuth`: login, perfil, progreso, racha, medallas, nivel (CEFR), actividad. Funciona con **Supabase real** o en **modo DEMO** (localStorage).
- **`layout.js`** → `window.ILLayout` / `window.ILIcon`: **única** fuente de la navegación (rail + nav inferior) y de los **iconos SVG**.
- **`contenido.js`** → `window.IL_CONTENIDO`: banco de unidades/ejercicios de ejemplo (en real vendrá de Supabase). El mini-CMS (`admin-contenido.html`) añade contenido en `localStorage.il_cms_content`.
- **`motor/`**: motor de actividades (plantillas P1–P7), pedagogía (repaso espaciado), motivación (medallas), matriz (edad↔ejercicio).
- **CSS**: `design-system.css` (tokens `--il-*`) → `app.css` (alias) → `shell.css` (layout con rail) → `etapa.css`.

## Convenciones (respétalas o romperás la coherencia)

- **Colores solo con tokens `--il-*`** (definidos en `design-system.css`). No pongas hex a mano.
- **Navegación e iconos vienen de `layout.js`.** En el HTML declara `<aside class="rail" data-il-rail="inicio">`, `<nav class="app-nav" data-il-nav="inicio">` y `<span data-il-icon="flame">`. Para añadir un icono, añádelo al objeto `ICONS` de `layout.js`.
- **Iconos por JS**: `ILIcon('nombre')` devuelve un `<svg>` **sin tamaño**. Al inyectarlo, dale tamaño con una regla directa `.contenedor svg{width:…}` (NO con `[data-il-icon] svg`, que no aplica a SVG crudos).
- Tras inyectar HTML nuevo que contenga `data-il-icon`, llama a **`window.ILLayout.mount()`** para que se pinten los iconos.
- **Cache-busting**: los `<script>`/`<link>` locales llevan `?v=YYYYMMDD`. **Si cambias un `.js` o `.css`, sube ese número** en las páginas que lo usan (si no, el navegador sirve la versión vieja).
- **No emojis como iconografía de interfaz** (usa SVG de `layout.js`). Excepciones que SÍ son contenido: el zorro **Nemo** 🦊, los cosméticos de la tienda y los iconos de cada medalla.

## Modo DEMO (para desarrollo local)

- En `localhost` el modo demo está **activo por defecto**. Usuarios: **`lucia` / `home1234`** (alumno), `admin` / `admin1234`.
- Datos demo en `localStorage`: `il_demo_db_v2` (cuentas), `il_demo_session_v2` (sesión), `il_progress_lucia`, `il_days_lucia`, `il_level_lucia`, `il_medals_lucia`.
- `auth.js` **siembra datos de muestra coherentes SOLO en demo** (`ensureDemoDays`, `ensureDemoMedals`). En cuentas reales nunca inventa: usa datos reales o estados vacíos honestos.
- APIs útiles: `getProgress`, `getWeekActivity`, `getActivityDays`, `getSkillBreakdown`, `getPlacement`, `listMedals`, `getMasteredPhrases`.

## Trucos que ahorran horas (gotchas ya vividos)

- El atributo `hidden` no gana a `display:flex/block` de una clase → hace falta `[hidden]{display:none!important}`.
- Para "primer hijo de una clase" usa `:nth-child`, **no** `:nth-of-type` (es por tipo de etiqueta, no por clase).
- Al verificar en el navegador, la **caché** puede servir archivos viejos; recarga fuerte (Cmd+Shift+R) o usa una URL con `?t=<algo>`.

## Antes de dar algo por hecho

Corre los tests (`node plataforma/*.test.js` y `node plataforma/motor/*.test.js`) y comprueba en el navegador con `?demo=1`. No cambies de framework ni de estructura sin pedirlo.
