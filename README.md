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

## Desarrollo con Claude Code

Abre esta carpeta con `claude` desde la terminal para seguir editando el proyecto. No hay build ni `npm install`: es HTML/CSS/JS plano.
