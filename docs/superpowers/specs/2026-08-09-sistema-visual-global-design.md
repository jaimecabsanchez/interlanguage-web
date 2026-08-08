# Sistema visual global · Interlanguage HOME

**Fecha:** 2026-08-09  
**Estado:** aprobado para implementación  
**Alcance:** fundamentos visuales compartidos. No incluye un rediseño profundo de cada pantalla ni cambios en la lógica de producto.

## 1. Objetivo

Elevar la plataforma desde un prototipo consistente hasta una base EdTech profesional, clara y motivadora para Primaria, pero suficientemente sobria para ESO. Se conserva la estructura actual en HTML, CSS y JavaScript plano y se aplica una capa de compatibilidad incremental para reducir regresiones.

Principios:

- claridad de acción y de progreso;
- jerarquía visual estable en todas las pantallas;
- color con función semántica, no decorativa;
- componentes reutilizables y accesibles;
- identidad propia basada en el avión de papel;
- densidad y tono adaptables por etapa;
- ninguna dependencia o framework nuevo.

## 2. Estrategia de implementación

Se ampliará `design-system.css` como fuente canónica. `app.css`, `shell.css`, `etapa.css` y `motor/motor.css` consumirán sus tokens. Las clases existentes conservarán compatibilidad para no alterar la lógica ni exigir una reescritura del HTML.

La migración se realizará en este orden:

1. tokens globales;
2. tipografía y estados interactivos;
3. componentes compartidos;
4. navegación y shell;
5. iconografía SVG;
6. excepciones por pantalla;
7. responsive, accesibilidad y pruebas.

## 3. Tokens

### Color semántico

- `--il-color-primary`: azul marino; CTA principal y estructura de máxima prioridad.
- `--il-color-primary-hover`: variante más profunda del azul.
- `--il-color-secondary`: coral; acento, recompensa y llamadas secundarias seleccionadas.
- `--il-color-success`: verde agua oscuro; acierto y objetivo completado.
- `--il-color-error`: rojo cálido accesible; error y acción destructiva.
- `--il-color-warning`: ámbar; advertencia y atención sin error.
- `--il-color-background`: fondo cálido general.
- `--il-color-surface`: superficie principal.
- `--il-color-surface-secondary`: bloques suaves y agrupaciones.
- `--il-color-text-primary`: texto de mayor jerarquía.
- `--il-color-text-secondary`: texto explicativo.
- `--il-color-border`: separación y contorno.
- `--il-color-muted`: elementos desactivados o de baja prioridad.

Se mantendrán alias `--il-navy`, `--il-coral`, `--il-jade` y los alias históricos de `app.css` durante la transición.

Usos:

- CTA principal y navegación activa: azul marino.
- Elemento seleccionado: superficie azul suave + borde azul.
- Éxito: verde + icono + texto.
- Error: rojo cálido + icono + explicación.
- Progreso: verde agua; azul para la estructura de la escala.
- Recompensa: coral o ámbar, de forma puntual.
- Neutral: grises azulados y superficies secundarias.

### Escalas

- Espaciado: base de 4 px, desde 4 hasta 64 px.
- Radios: 8, 12, 16, 20 y 999 px; se asignan por jerarquía.
- Sombras: `xs`, `sm`, `md` y foco; contenidas y sin efecto flotante excesivo.
- Tipografía fluida con `clamp()` para títulos y preguntas.
- Transiciones: rápida, base y lenta; solo propiedades baratas.
- Breakpoints documentados: 360, 390, 768, 1024, 1366 y escritorio grande.
- Anchos máximos: lectura, contenido, shell y ancho completo.
- Z-index: base, sticky, navegación, dropdown, overlay, modal, toast y tooltip.

## 4. Jerarquía tipográfica

Clases reutilizables:

- `.page-title`
- `.page-subtitle`
- `.card-title`
- `.body-text`
- `.small-text`
- `.ui-label`
- `.question-text`
- `.stat-value`
- `.btn`

Se conservan Plus Jakarta Sans para títulos e Inter para cuerpo. Se normalizan pesos, interlineados y espaciado de letra. Solo habrá un `h1` por página y no se dependerá del tamaño visual para definir la semántica HTML.

## 5. Componentes compartidos

- App shell, sidebar y navegación inferior.
- Header y agrupación de acciones.
- Botones: primary, secondary, success, danger, ghost e icon-only.
- Cards: base, interactive, selected y subdued.
- Skill chips y badges semánticos.
- Progress bar accesible.
- Stats y agrupación de métricas.
- Modal con overlay y estructura para foco.
- Tooltip no esencial.
- Empty state.
- Feedback panel: success, error, warning y neutral.
- User level.
- Streak.
- Stamp/reward counter.

Cada control incluirá `default`, `hover`, `active`, `focus-visible`, `disabled` y, cuando proceda, `loading`. El área táctil mínima será 44×44 px.

## 6. Navegación e iconografía

`layout.js` seguirá siendo la fuente única de rail, navegación inferior e iconos. Se ampliará su familia SVG lineal para retirar emojis usados como estructura. Los iconos tendrán grosor, esquinas y caja visual consistentes.

El avión de papel se mantiene como símbolo de avance. La arquitectura reservará un componente de acompañante o guía para una futura mascota, pero esta fase no introduce ni consolida una mascota.

Los emojis solo podrán aparecer como contenido editorial o cosmético deliberado, nunca para representar navegación, acciones, estados o métricas.

## 7. Responsive y adaptación por etapa

El CSS será mobile-first y se validará en 360, 390, 768, 1024, 1366 y escritorio grande. En móvil se prioriza una columna y navegación inferior; desde escritorio se activa rail y se controla el ancho de lectura.

`data-stage="p12|p34|p56|eso"` ajustará densidad, radio, tamaño tipográfico y presencia de elementos lúdicos sin crear cuatro sistemas distintos. ESO utilizará menos decoración y radios más contenidos; Primaria conservará mayor tactilidad y calidez.

## 8. Accesibilidad y movimiento

- foco visible con contraste suficiente;
- navegación completa por teclado;
- etiquetas o `aria-label` en controles sin texto visible;
- `aria-current` en navegación activa;
- `aria-busy` y texto accesible en carga;
- estados nunca comunicados solo mediante color;
- contraste WCAG AA;
- objetivos táctiles mínimos;
- `prefers-reduced-motion` elimina animaciones y desplazamientos no esenciales;
- tooltips no contendrán información indispensable.

## 9. Compatibilidad y límites

No se modificará la autenticación, persistencia, contenido, cálculo de progreso ni motor pedagógico. Los cambios JavaScript se limitarán al montaje de iconos, atributos ARIA y estados puramente visuales. No se añadirán dependencias.

No forma parte de esta fase:

- rediseñar profundamente cada pantalla;
- sustituir la arquitectura de navegación;
- crear una mascota;
- cambiar recompensas o datos;
- reescribir páginas desde cero.

## 10. Verificación

Al finalizar se ejecutarán las pruebas existentes, comprobación de sintaxis y revisión visual de login, inicio, lección, progreso, perfil, tienda, test, onboarding, informe, administración y CMS. Se comprobarán consola, desbordamiento horizontal, targets táctiles, foco por teclado y reducción de movimiento.

## 11. Archivos previstos

Núcleo:

- `plataforma/design-system.css`
- `plataforma/app.css`
- `plataforma/shell.css`
- `plataforma/etapa.css`
- `plataforma/motor/motor.css`
- `plataforma/layout.js`

Ajustes de adopción y accesibilidad cuando sean necesarios:

- páginas HTML activas de `plataforma/`.

Cada asset CSS o JavaScript modificado actualizará su parámetro `?v=` en las páginas consumidoras.
