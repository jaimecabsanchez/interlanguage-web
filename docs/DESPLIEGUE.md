# Publicar la plataforma en internet (B19) — guía sencilla

Objetivo: que la plataforma deje de necesitar el Terminal y esté en **un enlace normal** que las
familias abren en el navegador. Usamos **Netlify** (gratis para empezar). Dos caminos: el fácil
(arrastrar) y el recomendado (conectar GitHub, se actualiza solo).

> ⚠️ Antes del lanzamiento público de verdad hay que cerrar el **track legal (B20)** y el **endurecimiento
> de seguridad (B15)**. Para un **piloto con pocas familias de confianza**, esto ya sirve.

---

## Opción A · La más fácil: arrastrar (2 minutos)
1. Entra en https://app.netlify.com y crea una cuenta (o inicia sesión).
2. En el panel, busca la zona que dice **"Add new site" → "Deploy manually"** (o directamente el recuadro
   grande que pone **"Drag and drop your site output folder here"**).
3. Abre el **Finder** en `Escritorio → interlanguage-web`.
4. **Arrastra la carpeta `interlanguage-web` entera** a ese recuadro de Netlify y suelta.
5. Espera unos segundos. Netlify te da un enlace tipo `https://algo-al-azar.netlify.app`.
6. La plataforma queda en: **`ese-enlace/plataforma/`**. La web pública en `ese-enlace/`.

Para actualizar (cuando cambiemos algo): repites el arrastre y sobreescribe.

## Opción B · Recomendada: conectar GitHub (se actualiza solo)
1. Sube el proyecto a un repositorio de **GitHub** (te guío cuando quieras).
2. En Netlify: **"Add new site" → "Import from Git" → GitHub** → elige el repositorio.
3. Deja el build vacío (no hay build) y "Publish directory" en la **raíz** (`.`).
4. Cada vez que hagamos un cambio y lo subamos, Netlify **republica solo**. Ideal.

---

## Después de publicar
- **Enlace del alumno:** `TU-ENLACE/plataforma/index.html` (entra con su código + contraseña).
- **Cabeceras de seguridad** (`_headers`) se aplican **solas** en Netlify (en local no se veían).
- **Dominio propio** (p. ej. `practica.interlanguage.es`): se puede añadir en Netlify → Domain settings
  (necesitarás tu proveedor del dominio). Opcional; el enlace `.netlify.app` ya funciona.

## Notas de seguridad para el piloto
- `plataforma/supabase-config.js` lleva la **clave pública** (segura, va en el navegador). ✔
- Las carpetas `docs/` y `supabase/` (diseño y SQL) se subirían también; **no contienen secretos ni claves
  privadas**, pero son internas. Para el lanzamiento público conviene excluirlas (lo hacemos en B15/B19
  final). Para el piloto, no pasa nada.
- La clave **secreta** (`sb_secret_…`) **nunca** está en estos archivos: vive solo en las Edge Functions.

## Entornos (recordatorio)
- Hoy todo apunta al proyecto Supabase de **desarrollo**. Antes del lanzamiento real crearemos **producción**
  (proyecto Supabase aparte + su enlace de Netlify) para no mezclar datos de prueba con datos reales.
