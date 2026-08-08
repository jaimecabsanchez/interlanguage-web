# Interlanguage — Repositorio

Este repositorio contiene **dos proyectos** de Interlanguage, cada uno en su carpeta:

| Carpeta | Qué es |
|---|---|
| **`web-publica/`** | La **web pública** de Interlanguage Studies (lo que ve todo el mundo). Es lo que se publica en Netlify. |
| **`plataforma/`** | La **plataforma "Interlanguage HOME"**: la app de práctica de inglés para los alumnos (en construcción). |
| `supabase/` | El **backend** de la plataforma (base de datos y funciones). Nombre obligado por la herramienta de Supabase. |
| `docs/` | Documentación: diseño, especificaciones, planes y propuestas. |
| `material-fuente/` | Material en bruto que **no se publica** (PDF del campamento, fotos originales). |
| `archivo/` | Prototipos antiguos y copias de seguridad. **No se usan**, solo se guardan por si acaso. |

Archivos sueltos de la raíz:
- **`Ver-plataforma.command`** → doble clic para ver la plataforma en tu ordenador (modo demo).
- `netlify.toml` → le dice a Netlify que publique la carpeta `web-publica/`.
- `README.md`, `.github/` (comprobaciones automáticas), `.env.example` (plantilla de secretos).

---

## 1) La web pública — `web-publica/`

```
web-publica/
├── index.html      ← la web (único HTML; no hay duda de cuál abrir)
├── css/styles.css
├── js/main.js
├── images/         ← fotos en WebP/AVIF/JPEG por sección
└── _headers        ← caché y seguridad para Netlify
```

**Ver en local:**
```bash
cd ~/Desktop/interlanguage-web
python3 -m http.server 8000
# abre http://localhost:8000/web-publica/index.html
```

**Publicar en Netlify:** ya está configurado en `netlify.toml` (`publish = "web-publica"`).
Si subes a mano, arrastra **la carpeta `web-publica/`** (no la raíz).

---

## 2) La plataforma "Interlanguage HOME" — `plataforma/`

App de práctica diaria (proyecto aparte, en construcción). Es autónoma: tiene su propio icono en `plataforma/assets/`.

```
plataforma/
├── index.html · inicio.html · leccion.html · progreso.html · perfil.html · admin.html …  ← pantallas
├── auth.js            ← login (modo demo con localStorage, o Supabase real)
├── contenido.js       ← banco de ejercicios de ejemplo (en real vendrá de Supabase)
├── layout.js          ← navegación e iconos compartidos
├── motor/             ← motor de actividades (plantillas P1–P7)
├── assets/            ← iconos propios de la plataforma
└── supabase-config.js ← claves PÚBLICAS (anon). NUNCA la service_role aquí.

supabase/
├── schema.sql         ← modelo de datos (estado actual)
├── migrations/        ← cambios de BD versionados (se aplican en orden)
└── functions/         ← Edge Functions (lógica de servidor: alta de alumnos, etc.)
```

**Ver en local:** doble clic en `Ver-plataforma.command` (arranca el servidor y abre el login en modo demo).
Prueba con **usuario `lucia` / contraseña `home1234`** (o `admin` / `admin1234`).

Diseño y hoja de ruta completos en `docs/superpowers/`.

Stack: **web ligera + Supabase (Postgres/Auth/Storage) + Netlify**. Datos de menores → privacidad desde el
diseño (RGPD). Los secretos van en variables de entorno (ver `.env.example`), **nunca** en el repo.

---

## Comprobaciones (las mismas que corren en CI en cada cambio)

```bash
node plataforma/smoke.test.js           # base técnica bien montada
node plataforma/auth-utils.test.js      # login
node plataforma/motor/pedagogia.test.js # modelo pedagógico
```
Node 20 (ver `.nvmrc`). No hay build ni `npm install`: es HTML/CSS/JS plano; las Edge Functions son TS de Deno.

## Desarrollo con Claude Code / Codex

Abre esta carpeta desde la terminal para editar. Cada proyecto está en su carpeta, con nombres claros,
para que sea fácil trabajar por partes. No hay build ni `npm install`.
