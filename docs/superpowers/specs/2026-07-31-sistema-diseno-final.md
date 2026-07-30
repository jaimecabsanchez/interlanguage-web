# Sistema de diseño final · Plataforma Interlanguage

**Fecha:** 2026-07-31 · **Estado:** aprobado. Consolida todas las decisiones visuales/UX aprobadas
(`ux-vision-visual-design`, `pantallas-alumno-mvp`, `experiencia-ejercicios`,
`experiencia-motivacion-progreso`, `sistema-motivacion-personaje`, `rendimiento-accesibilidad-movil`).
Preparado para implementación. Tokens canónicos en `plataforma/design-system.css` (namespace `--il-`).

## 1. Color y usos
| Token | Valor | Uso |
|---|---|---|
| `--il-navy` | `#16294A` | Texto principal, titulares, estructura |
| `--il-coral` | `#FF6B4A` | **Único color de acción** (CTA, activo, selección) |
| `--il-coral-ink` | `#E14F30` | Coral profundo (hover/borde), error suave |
| `--il-jade` | `#1E9C74` | Acierto / éxito |
| `--il-jade-bg` | `#E7F1EC` | Fondo de acierto |
| `--il-cream` | `#FBF8F1` | Fondo de página |
| `--il-ink` `--il-faint` `--il-line` | `#2B3646` `#8A97A6` `#E4E8EE` | Texto cuerpo / secundario / bordes |
Regla: **un solo color de acción** (coral). Error nunca rojo agresivo. Nada transmitido **solo por color**.

## 2. Tipografías
- **Titulares:** Plus Jakarta Sans (700/800). **Cuerpo:** Inter (400–700).
- `font-display: swap`; subconjunto latin; máximo 2 familias.

## 3. Escala de tamaños (type scale)
`--il-fs-xs .75 · sm .875 · base 1 · lg 1.125 · xl 1.3 · 2xl 1.6 · 3xl 2rem`. La base **escala por banda**
(1.º–2.º mayor, ESO contenido). Interlineado 1.3 (titulares) / 1.5 (cuerpo).

## 4. Espaciados
Escala base 4px: `--il-space-1..8 = 4/8/12/16/20/24/32/40`. Radios: `--il-r-sm 10 · md 14 · lg 18 · xl 22`
(22 en Primaria baja → 14 en ESO). Sombra suave única `--il-shadow`.

## 5–13. Componentes (specs)
- **Botones:** primario (coral, texto blanco, radio lg, ≥48px alto), fantasma (borde), enlace. Estados:
  normal/hover/activo/deshabilitado/cargando (spinner). Foco visible (outline coral).
- **Tarjetas:** fondo blanco, borde `--il-line`, radio por banda, sombra suave, padding space-5.
- **Inputs:** alto ≥48px, borde 1.5px, radio md, `label` visible o `aria-label`; foco visible; error con
  icono+texto bajo el campo.
- **Navegación:** barra inferior fija, 4 pestañas (icono+etiqueta), activo coral + `aria-current`.
- **Modales:** centrados, foco atrapado, cierre por botón/Esc, fondo oscurecido; se usan poco (una decisión por pantalla).
- **Barras de progreso:** pista `--il-line`, relleno coral; en sesión, "X de N".
- **Feedback:** banner acierto (jade, icono+texto) / error (coral suave, icono+texto+explicación). Nunca solo color.
- **Estados vacíos:** icono + título + frase + CTA ("Aún no hay mucho… ¡haz tu primera misión!").
- **Estados de error:** icono + "no hemos podido cargar… Reintentar".
- **Iconos:** línea sencilla, **siempre con texto/etiqueta**; emoji permitido en contenido (aria-hidden si es decorativo).

## 14–16. Fotografías, ilustraciones, personaje
- **Fotografías:** casi ninguna en el producto (es práctica, no marketing); si aparece, con `alt`, comprimida, responsive.
- **Ilustraciones:** planas, paleta de marca; emoji en el MVP; ilustración propia por hitos.
- **Personaje (Nemo):** guía/compañero de viaje. Aparece en login/onboarding/Inicio/transiciones/fin/mapa;
  **desaparece** en la resolución del ejercicio, en el error, en pantallas repetidas, con reduced-motion y en ESO
  (casi icono). Presencia por **momento**, no por acción.

## 17–18. Animaciones y sonido
- **Animaciones:** micro y discretas; celebración breve y **silenciable**; respetan `prefers-reduced-motion`
  (se desactivan). Nada de animación constante.
- **Sonido:** **opcional y desactivable**; acierto/celebración breves; audio de contenido (voz) con botón visible,
  nunca autoplay sin control (salvo consigna en 1.º–4.º, con control).

## 19. Responsive
Mobile-first; una actividad a pantalla; objetivos táctiles ≥44px; el teclado no tapa los controles; escala a
tablet/desktop con más aire. Presupuesto de peso <~400 KB primera carga.

## 20. Accesibilidad (AA base)
Teclado completo + foco visible; contraste ≥4,5:1; acierto/error con **icono+texto** (no solo color);
`lang="en"` en el contenido inglés; transcripción de audios; zoom 200%; reduced-motion; objetivos grandes;
mensajes de error claros con cómo arreglarlo.

## 21. Componentes reutilizables (biblioteca)
Botón · Tarjeta · Input · Chip de estado (🔥/💎) · Medalla (chip) · Barra de progreso · Banner de feedback ·
Skeleton · Banner sin conexión · Tarjeta de estado (vacío/error/hecho) · Barra de navegación · Tarjeta-misión ·
Tarjeta-ejercicio (plantillas P1–P7) · Poses de Nemo. Variación por banda vía tokens `data-stage`.

## Adaptación por banda (tokens data-stage: p12 · p34 · p56 · eso)
Escalan: tamaño de fuente/botón, radios, densidad de texto, audio (auto→bajo demanda), presencia de Nemo,
tono de copy y de celebración. Mismo sistema, distinta piel.

---

## Tres recorridos completos

### 1) 1.º de Primaria · nivel inicial (banda **p12**, Pre-A1)
Entra **con un adulto**: login con Nemo grande y campos enormes → primer acceso (crea su clave, con audio y
ayuda del adulto) → **onboarding** con Nemo que se presenta, elige avatar/color, "cada día una misión corta" →
**Inicio**: botón **GIGANTE** "¡Empezar!", casi nada de texto, Nemo saludando → **sesión** de **4 microactividades**
(imagen-palabra y emparejar), **audio automático**, **≤3 opciones**, solo **tocar** → acierto = jade + Nemo
celebra; error = marca suave + se repite → **fin**: trofeo **animado**, medalla "Primera lección", "¡vuelve
mañana! 🌟". **Nemo muy presente**; celebración visible y simple.

### 2) 5.º de Primaria · A1–A2 (banda **p56**)
Entra **solo**: login normal → **Inicio**: "¡Hola, [nombre]!" + **misión del día** + **progreso semanal** +
"Repasar" si hay pendientes → **sesión** de **4–6 actividades** (imagen-palabra, **ordenar frases**, **completar
con banco de palabras**, listening) → algún **error** entra en **repaso**; validación **tolerante** en huecos →
gana **"5 aciertos seguidos"** → **fin**: resumen (aciertos/racha/gemas) + medallas, celebración **breve**.
**Nemo presente pero discreto**; aparece meta semanal y "supera tu récord".

### 3) 2.º de ESO · A2–B1 (banda **eso**)
Entra: login **sobrio**, casi sin Nemo → **Inicio**: "Hola, [nombre] · **Sesión de hoy**" + **progreso hacia
A2→B1** y metas → **sesión** de **5–7 actividades** (**completar cloze**, **reading** con comprensión, algo de
**escribir libre**), texto normal, audio **bajo demanda**, validación tolerante → feedback **breve** + explicación
al fallar → **fin**: **sobrio**, foco en **nivel/meta**, celebración mínima. **Nemo casi solo icono**; lenguaje
"objetivo cumplido / nivel", nada de peluche.

---

### Preparado para implementación
Acciones que materializan este sistema (ver plan): tokens `design-system.css` · navegación de 4 pestañas
(quitar Liga, Tienda en Perfil) · `data-stage` de 4 bandas · consolidar componentes reutilizables.
