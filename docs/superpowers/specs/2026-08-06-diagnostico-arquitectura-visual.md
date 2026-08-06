# Diagnóstico y arquitectura visual · Interlanguage HOME
**Fase 1 — Solo diagnóstico y plan. No se modifica código de producto.**
Equipo: UX/UI (EdTech) · Product Designer (gamificación) · Frontend senior · Accesibilidad e infancia/adolescencia · Dirección de producto EdTech.
Fecha: 2026-08-06.

---

## 0. Alcance examinado
12 pantallas del alumno/admin + 3 sistemas de estilo + motor de actividades + capa de datos.
Archivos revisados (líneas): `inicio.html` (427), `auth.js` (580), `admin.html` (340), `motor/engine.js` (302), `admin-contenido.html` (228), `leccion.html` (244), `progreso.html` (212), `contenido.js` (176), `app.css` (169), `test-nivel.html` (164), `tienda.html` (162), `index.html` (147), `perfil.html` (123), `onboarding.html` (114), `cambiar-clave.html` (110), `informe.html` (103), `motor/motor.css` (104), `etapa.css` (62), `shell.css` (44), `design-system.css` (44), + módulos `motor/*` y tests.

---

## A. Diagnóstico del estado actual

### A.1 Lo que funciona y **debe preservarse** (no romper)
- **Autenticación** sólida: login pseudónimo (`blue-fox-317`), 2FA opcional, protección contra enumeración, guards por rol. (`auth.js`, `index.html`)
- **Adaptación pedagógica real**: test de nivel → CEFR (`test-nivel.html`, `savePlacement`), matriz por 4 bandas de edad (`motor/matriz.js`), composición de sesión por nivel + **variedad diaria** (`leccion.html`), motor pedagógico de repaso espaciado listo pero aún no cableado (`motor/pedagogia.js`).
- **Motor de actividades data-driven**: una plantilla + datos, 7 tipos, validación y feedback, `lang="en"` inyectado para lectores de pantalla (`motor/engine.js`).
- **Motivación sin competición**: medallas, racha flexible con comodín, sin rankings (`motor/motivacion.js`).
- **Mini-CMS** funcional + fusión de contenido (`admin-contenido.html`, `contenido.js`).
- **Estados de UI**: carga (skeleton), vacío, error, offline, `prefers-reduced-motion` respetado en casi todo.
- **Home** ya rediseñada a nivel editorial (rail + 2 columnas + estados) — es la referencia de calidad a la que deben subir las demás.

### A.2 Problemas detectados (con evidencia)

**P-1 · Tres sistemas de color en paralelo (deuda de diseño crítica).**
- `design-system.css` → 20 tokens `--il-*` (fuente "canónica").
- `app.css` → ~21 alias cortos `--navy/--coral/--jade…` (algunos ya derivan de `--il-*`, otros literales que **no coinciden**: `--ink`, `--faint`, `--line`).
- `motor/motor.css` → 12 tokens `--eng-*` **duplicando** los mismos colores.
- Consecuencia: cambiar un color de marca exige tocar 3 sitios; riesgo de deriva visual entre pantallas y motor.

**P-2 · `design-system.css` no se carga en todas las pantallas.**
`index.html`, `cambiar-clave.html`, `admin.html`, `informe.html` cargan solo `app.css`. Los tokens `--il-*` no existen ahí → dependen del fallback. Inconsistencia estructural.

**P-3 · Marcado duplicado que debería ser componente compartido.**
- **Rail lateral** (`<aside class="rail">…`) copiado a mano en 4 páginas (`inicio`, `progreso`, `perfil`, `tienda`). Cualquier cambio de navegación = editar 4 archivos.
- **Nav inferior** (`app-nav__item`) duplicada en las mismas 4 páginas.
- **Logo/ilustración** (avión de papel) repetido inline en cada rail; el símbolo reusable `#ilBrand` solo existe dentro de `inicio.html`.

**P-4 · CSS embebido por página (≈365 líneas repartidas).**
`inicio.html` arrastra **156 líneas** de `<style>`; `leccion` 50, `progreso` 43, `test-nivel` 40, `onboarding` 30, `perfil` 25, `tienda` 21. Muchos patrones se repiten (tarjetas, chips de estadística, badges, fondo cálido, animaciones de entrada, chips de habilidad).

**P-5 · Mezcla de emoji / icono / ilustración (iconografía incoherente).**
`inicio.html` ya está **libre de emojis** (SVG propios) — pero `progreso` usa 8 emojis, `tienda` 12, `leccion` 6, `perfil` 4. Conviven: iconos SVG (nav), emojis de sistema como UI (`🔥` racha, `💎` gemas, `📈`, `🎯`), avatar `🦊`, e íconos de tienda `🛡️ 🎩 🐾`. Los emojis **cambian de aspecto según el dispositivo** (Apple/Android/Windows) → no son marca, y chocan con el tono "profesional" que pide producto.

**P-6 · Dato demo incoherente (bug real).**
`tienda.html:50` muestra la racha **`🔥 12` fija en el HTML**, sin `id` ni actualización JS (las gemas sí son dinámicas). Un alumno real con otra racha verá "12" incorrecto. (La incoherencia semanal "0 de 5" ya se corrigió en `getWeekActivity`.)

**P-7 · Breakpoints inconsistentes.**
Conviven `min-width:960px` (app, ×5), `880px` (login), `640px` (tablet). El rail aparece a 960 pero el login cambia a 880 → saltos de layout distintos entre pantallas.

**P-8 · Identidad aún de "placeholder".**
La marca se sostiene sobre el emoji `🦊` (Nemo) y un avión de papel abstracto. No hay todavía sistema de identidad coherente (recorrido, sellos, pasaporte, destinos) ni una política clara mascota-por-etapa. Para ESO, `🦊` resta madurez.

**P-9 · Persistencia solo en navegador (riesgo de producto, no bug).**
Nivel colocado, días de práctica y contenido del CMS viven en `localStorage`. Correcto para MVP/preview, pero **no es compartido ni multi-dispositivo** ni de producción.

**P-10 · Sin paso de build (contexto, no defecto).**
No hay bundler. Los "componentes" hoy solo pueden ser CSS + inclusión manual de HTML. Cualquier propuesta debe respetar esto (nada de framework).

---

## B. Lista priorizada de mejoras

**P0 — Fundamentos (habilitan todo lo demás, bajo riesgo)**
1. Unificar en **un único sistema de tokens** (`--il-*`) y que `app.css` y `motor.css` deriven de él. (P-1, P-2)
2. Extraer la **capa de componentes compartidos** (shell/rail/nav/tarjetas/chips) a CSS común + una inclusión única de marcado. (P-3, P-4)
3. Corregir el **dato demo de la tienda** y auditar otros literales. (P-6)

**P1 — Coherencia visual y de marca (alto impacto percibido)**
4. **Sistema de iconografía SVG propio** y retirada de emojis como UI; política de mascota por etapa. (P-5, P-8)
5. Normalizar **breakpoints** (un único juego). (P-7)
6. Definir e implementar la **identidad "recorrido"** (avión, etapas, sellos, pasaporte) como sistema, no como adornos sueltos. (P-8)

**P2 — Madurez de producto**
7. Variante **ESO** sobria (mascota discreta/ausente, más editorial). 
8. Preparar el camino a **Supabase** para nivel/días/CMS (persistencia real). (P-9)
9. Auditoría de **accesibilidad** completa (foco, contraste AA, teclado en todos los flujos, `lang`, tamaños táctiles).

---

## C. Arquitectura visual y de componentes propuesta

Sin framework. Dos piezas: **(1) tokens únicos** y **(2) una librería de componentes** = CSS compartido + un pequeño `layout.js` que **inyecta el marcado repetido** (rail, nav, franja demo) desde una sola fuente.

### C.1 Capa de tokens (única fuente de verdad)
`design-system.css` (`--il-*`) pasa a ser la **única** definición: color, tipografía, escala por etapa, espaciado (base 4px), radios, sombras, motion, touch. `app.css` y `motor.css` **solo referencian** `--il-*` (se retiran `--eng-*` y los literales divergentes). `design-system.css` se carga en **todas** las pantallas.

### C.2 Librería de componentes (nombres propuestos)
- **AppShell** — fondo cálido + rail (escritorio) + nav inferior (móvil) + franja demo. Una sola definición; las páginas solo declaran la pestaña activa.
- **StatChip** — racha / gemas (icono SVG + valor), siempre alimentado por datos reales.
- **Card / SoftBlock** — tarjeta principal y bloques ligeros diferenciados por color (no "tarjeta dentro de tarjeta").
- **SkillChip** — etiquetas Vocabulary/Grammar/Listening… con color por habilidad y variante ES simple para Primaria baja.
- **DayCard** — bloque protagonista del día (estados: pendiente / en curso / completada).
- **RouteProgress** — recorrido de la semana/unidad como etapas/sellos (accesible, con texto).
- **Buttons** — primario/fantasma con feedback táctil unificado.
- **BrandArt / IconLibrary** — símbolos SVG propios (avión, ruta, sello, pasaporte, destinos) en un único `sprite` reutilizable en todas las páginas.
- **StateViews** — carga/vacío/error/offline compartidos (ya existen; se consolidan).

### C.3 Sistema de identidad "Recorrido de aprendizaje"
- **Metáfora**: el alumno **avanza por un recorrido** (avión de papel) desbloqueando **destinos/unidades**, ganando **sellos** en un **pasaporte**. Sustituye a "corazones/gemas de otros" por una narrativa propia y educativa.
- **Gamificación sana** (heredamos principios, no la forma): claridad, ritmo, feedback inmediato, misión diaria, constancia — **sin** rankings, sin penalización emocional, sin exceso de moneda.
- **Mascota (Nemo, el zorro viajero)**: presente y visible en **Primaria** (guía, celebra), **discreta o ausente en ESO**, controlada por `data-stage`. La ilustración definitiva es una decisión de marca pendiente; el sistema deja el hueco preparado.

---

## D. Archivos que se modificarán (por fase, cuando toque)
- **Tokens**: `design-system.css` (canónico), `app.css`, `motor/motor.css`, `etapa.css`.
- **Componentes compartidos**: `shell.css` → evoluciona a `components.css`; **nuevo** `layout.js` (inyección de rail/nav/franja demo/sprite SVG).
- **Aplicación por pantalla** (retirar CSS/markup duplicado, usar componentes): `inicio.html`, `progreso.html`, `perfil.html`, `tienda.html`, `leccion.html`, `test-nivel.html`, `onboarding.html`, `cambiar-clave.html`, `index.html`, `informe.html`, `admin.html`, `admin-contenido.html`.
- **Iconografía**: **nuevo** `icons.svg`/sprite; retirada progresiva de emojis-UI en las páginas anteriores.
- **Datos**: `tienda.html` (racha dinámica), revisión de literales demo.
- **No se tocan** (lógica a preservar): `auth.js`, `motor/engine.js`, `motor/pedagogia.js`, `motor/matriz.js`, `motor/motivacion.js`, `contenido.js` (salvo tokens), migraciones/Edge Functions.

---

## E. Riesgos técnicos detectados
1. **Regresión visual al unificar tokens**: los literales divergentes (`--ink/--faint/--line`) cambiarían tonos. Mitigar migrando con verificación pantalla a pantalla y fijando el valor "vivo" actual como canónico.
2. **Caché del navegador en desarrollo**: sin cabeceras no-cache, los cambios en CSS/JS no se reflejan hasta forzar recarga (ya observado). Riesgo de "parece que no cambia". Mitigar con versionado de assets (`?v=`) o cabeceras.
3. **Duplicación de marcado sin build**: si no se centraliza rail/nav con `layout.js`, seguirá el mantenimiento ×4. Riesgo de que las pantallas vuelvan a divergir.
4. **Dependencia de emojis para UI**: aspecto no controlado entre sistemas operativos; su retirada debe ser completa para no dejar mezcla.
5. **Persistencia localStorage**: nivel/días/CMS no viajan entre dispositivos; si una familia usa móvil y tablet verá estados distintos hasta migrar a Supabase.
6. **Cálculo de semana (lunes) local vs UTC**: desfase de 1 día en el límite de medianoche (menor; ya anotado).
7. **`data-stage` como acoplador visual**: toda variante por edad depende de que se aplique bien; conviene un único punto (`etapa.js`) y tests visuales por banda.
8. **Divergencia demo/real**: estilos verificados en demo deben re-verificarse con Supabase real (datos y RLS).

---

## F. Plan de implementación por fases
Cada fase es **verificable en navegador**, **no elimina funcionalidad** y se puede parar/entregar sola.

- **F0 · Tokens únicos.** `--il-*` canónico; `app.css`/`motor.css`/`etapa.css` derivan; `design-system.css` en todas las páginas. *Objetivo: cero cambio visual, una sola fuente de color.*
- **F1 · Capa de componentes.** `components.css` + `layout.js` que inyecta AppShell (rail+nav+fondo+franja demo) y el sprite SVG. Migrar las 4 pantallas con rail para que dejen de duplicar marcado. *Objetivo: un solo sitio para navegación e identidad.*
- **F2 · Iconografía propia.** Set SVG (racha, gema, habilidades, tienda, medallas, nav) y retirada de emojis-UI. Política de mascota por etapa. *Objetivo: aspecto consistente y de marca en todo dispositivo.*
- **F3 · Identidad "Recorrido".** RouteProgress (etapas/sellos), pasaporte, destinos desbloqueables, variante ESO sobria. *Objetivo: personalidad propia y reconocible.*
- **F4 · Aplicación pantalla a pantalla + responsive.** Subir progreso/perfil/tienda/lección al nivel de la home; un único juego de breakpoints; corrección de datos demo (racha de tienda). *Objetivo: coherencia total.*
- **F5 · Accesibilidad y datos reales.** Auditoría AA (contraste, foco, teclado, `lang`, táctil), y preparación de persistencia Supabase (nivel/días/CMS). *Objetivo: producción.*

---

## G. Qué debe ser **compartido** entre todas las pantallas
1. **Tokens** (`--il-*`): color, tipografía, escala por etapa, espaciado, radios, sombras, motion, touch.
2. **AppShell**: fondo cálido, rail (escritorio), nav inferior (móvil), franja demo — una sola definición, pestaña activa por parámetro.
3. **StatChips** (racha/gemas) — siempre datos reales, nunca literal.
4. **Card / SoftBlock / SkillChip / DayCard / RouteProgress / Buttons** — patrones únicos.
5. **Librería de iconos e ilustración de marca** (sprite SVG) — incluida la mascota controlada por etapa.
6. **StateViews** (carga/vacío/error/offline) y **motion** con `prefers-reduced-motion`.
7. **Adaptación por etapa** (`data-stage`) desde un único punto.

> Regla: *cada dato aparece una vez, cada componente se define una vez, cada color se declara una vez.*
