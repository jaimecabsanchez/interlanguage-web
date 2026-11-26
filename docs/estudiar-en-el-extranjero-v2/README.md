# «Estudiar en el extranjero» v2 · propuesta navegable (26-11-2026)

Rama `preview/extranjero-v2`, creada a partir de `main` (a7b75e5). La rama no sigue a `origin/main` ni se ha subido a GitHub. **Nada de esto está en producción.**

> **Decisión de Jaime (26-11-2026): la página general «Estudiar en el extranjero» se queda como está** (la vista `#servicio-extranjero` de `index.html`). Solo se añaden las cuatro páginas de país:
> - Sus tarjetas de destino, y los destinos de la cabecera y de la portada, llevan a cada página de país. «Ver destino» pasa a «Descubrir Reino Unido», etc.
> - Desde cada país se vuelve a la página de siempre: las migas, «Comparar destinos» (`/?ir=ext-cmp#servicio-extranjero`), «Ver cómo trabajamos» (`?ir=ext-ayuda`) y «Todas las preguntas frecuentes» (`?ir=ext-dudas`).
> - `/estudiar-en-el-extranjero/` y `/en/study-abroad/` solo redirigen a la página de siempre (meta refresh, noindex).
> - Los enlaces antiguos de país (`#servicio-extranjero-irlanda`) llevan a la página del país; `#servicio-extranjero` no cambia.
>
> La página general rediseñada (cabecera nueva, mosaico, metodología, equipo…) se descartó. Queda en el commit 70b04de por si se quiere recuperar.

## Cómo verla en local

```
python3 .claude/preview-server.py 8421 <ruta-de-esta-rama>/web-publica
```

Abre http://127.0.0.1:8421/estudiar-en-el-extranjero/ (en inglés, /en/study-abroad/).

## Rutas reales

| Español | Inglés |
|---|---|
| /estudiar-en-el-extranjero/ | /en/study-abroad/ |
| /estudiar-en-el-extranjero/reino-unido/ | /en/study-abroad/united-kingdom/ |
| /estudiar-en-el-extranjero/irlanda/ | /en/study-abroad/ireland/ |
| /estudiar-en-el-extranjero/canada/ | /en/study-abroad/canada/ |
| /estudiar-en-el-extranjero/estados-unidos/ | /en/study-abroad/united-states/ |

**Cómo están hechas**
- La web es HTML estático sin build.
- Cada ruta es una carpeta con su `index.html`, generada por `scripts/estudiar-en-el-extranjero/build.py`. Netlify las sirve tal cual: se pueden abrir directamente, recargar y compartir.
- No hay `_redirects` ni framework nuevo.
- Hay una única plantilla de país para los cuatro destinos. El contenido bilingüe está en `scripts/estudiar-en-el-extranjero/contenido.py`.
- El generador reutiliza de `index.html` e `index-en.html` estas piezas: cabecera, pie, iconos, tarjetas de destino, comparador, cuestionario y cierre. Si cambian allí, basta con volver a generar.

**Orden de generación (desde la raíz del repo)**

```
python3 scripts/traduccion-en/build_en.py
python3 scripts/estudiar-en-el-extranjero/build.py            # vista previa
python3 scripts/estudiar-en-el-extranjero/build.py --publicar # al aprobarla
```

**Enlaces antiguos**
- Los fragmentos `#…` no llegan al servidor, así que se resuelven en el navegador con `js/rutas.js`, que se carga en el `<head>` sin `defer`.
- `/#servicio-extranjero` lleva a `/estudiar-en-el-extranjero/`.
- `/#servicio-extranjero-irlanda` lleva a `/estudiar-en-el-extranjero/irlanda/`, y lo mismo para el resto de destinos.
- En inglés, `/index-en.html#servicio-extranjero-…` lleva a `/en/study-abroad/…`.
- En la portada, el menú, el pie, las tarjetas de destino y la tarjeta de «¿Qué programa os interesa?» apuntan ya a las rutas nuevas. Los retoca `build.py`.

**`main.js`**
- Si una página no contiene la portada (`#view-home`), no enruta por `#servicio-…` ni escucha `popstate`.
- Las fotos que pintan `extranjero.js` y `recorridos.js` usan rutas absolutas (`/images/…`), para que funcionen desde una subcarpeta.

## Vista previa: sin envíos y sin indexación

**Por defecto, `build.py` añade dos metas** a las diez páginas nuevas y a `index.html` / `index-en.html`:
- `<meta name="robots" content="noindex, nofollow">`.
- `<meta name="il-preview" content="1">`. Con él, `js/rutas.js` intercepta cualquier POST de `fetch` y responde «OK» sin enviar nada. Así funcionan los cuestionarios, el formulario de la portada, Madrid, extraescolar y campamentos fuera. También aparece la franja «Vista previa · formularios simulados».

**`build.py --publicar` quita ambos metas.** Antes de publicar, comprueba que no queda ninguno:

```
grep -rl 'il-preview\|noindex' web-publica --include=*.html
```

**Sitemap**
- `sitemap.xml` y `robots.txt` no se han tocado.
- Las entradas nuevas, con `hreflang`, están en `sitemap-propuesto.xml` (en esta carpeta). Se copian a `web-publica/sitemap.xml` solo al publicar.

## Netlify Deploy Preview, sin tocar producción

Solo con tu autorización, porque requiere subir la rama a GitHub:

1. `git push origin preview/extranjero-v2`. Usa siempre ese nombre de rama, **nunca** `main`.
2. En GitHub, abre un pull request de `preview/extranjero-v2` hacia `main` **sin fusionarlo**. Netlify crea un Deploy Preview con una dirección propia del tipo `deploy-preview-N--<sitio>.netlify.app`. Producción no cambia hasta que se fusione.
3. Alternativa sin pull request: con Netlify CLI, `netlify deploy --dir=web-publica`, **sin** `--prod`. Crea un despliegue de borrador con su propia URL.
4. Los formularios siguen simulados en el Deploy Preview, porque lleva `il-preview`. No llegan a Netlify Forms ni generan avisos.

## Pendiente de verificar o decidir

- **Fotos**
  - No hay foto de biblioteca: la galería usa «Espacios comunes» (sala común).
  - Varias fotos de país parecen recreaciones. Se publican con la nota «Fotos ilustrativas», sin atribuirlas a ningún colegio.
- **Equipo**
  - Montse, Ana y Jaime aparecen sin cargos, porque no están confirmados.
  - «Empresa familiar» lo indicó Jaime en el encargo.
  - No hay testimonios.
- **Oferta**
  - Que en Reino Unido solo se ofrece internado, y en Irlanda, Canadá y EE. UU. familia o internado.
  - La disponibilidad de trimestres en Canadá y EE. UU.
- **Fuentes**
  - travel.state.gov bloquea la lectura automática; por eso no se menciona el visado J-1 ni el ESTA.
  - Los calendarios escolares vienen de las fichas anteriores y no se han vuelto a comprobar.
  - Fuentes: `docs/fuentes-comparador-destinos.md` y `docs/extranjero-fichas-fuentes.md`.
- **La vista antigua `#view-service-extranjero`** sigue en `index.html`, aunque ya no se llega a ella. Al aprobar la migración conviene quitarla, para aligerar la portada.
