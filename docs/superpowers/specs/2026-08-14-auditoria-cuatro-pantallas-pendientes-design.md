# Auditoría y rediseño focalizado de cuatro pantallas pendientes

- **Fecha:** 2026-08-14
- **Estado:** dirección aprobada; pendiente de revisión final del owner
- **Pantallas:** `onboarding.html`, `test-nivel.html`, `familias.html`, `informe.html`
- **Base:** `docs/UX_VISUAL_PLATFORM_BRIEF.md` y decisiones de producto del 12 de agosto

## Objetivo

Cerrar la auditoría visual y funcional de las cuatro pantallas que todavía no se habían
revisado, conservando su lógica y sus datos. La intervención debe mejorar jerarquía,
claridad, adaptación por edad, experiencia móvil, accesibilidad y coherencia con el resto
de Interlanguage HOME.

No se reconstruirá la arquitectura, no se añadirán dependencias y no se modificarán los
contratos de autenticación o datos. La experiencia seguirá funcionando en HTML, CSS y
JavaScript plano.

## Diagnóstico resumido

### Onboarding

La base es limpia y fácil de entender, pero los tres pasos son casi idénticos entre bandas.
La elección de un color aislado ya no representa bien el sistema actual de avatar y mundo
personal. La pantalla explica el producto, aunque todavía no genera suficiente deseo de
empezar ni muestra de forma concreta qué ocurrirá en la primera misión.

### Test de nivel

El flujo funciona y su puntuación es transparente, pero visualmente se percibe como un
examen convencional. En móvil queda demasiado espacio vacío, todas las preguntas usan el
mismo patrón textual y la experiencia apenas cambia entre Primaria inicial, Primaria
superior y ESO.

### Panel de familias

Contiene evidencia de aprendizaje valiosa, pero presenta demasiados bloques seguidos. En
móvil se repiten interpretaciones y la recomendación principal aparece demasiado tarde.
La pantalla informa bien, aunque obliga a la familia a trabajar demasiado para responder
tres preguntas: qué ha aprendido, si mantiene el hábito y qué conviene hacer después.

### Informe

Cumple como resumen compartible, pero mezcla estilos anteriores con el sistema actual,
duplica contenido del panel completo y muestra demasiadas medallas. El texto legal/pedagógico
final pierde legibilidad en móvil. Debe sentirse como una fotografía breve del progreso,
no como una versión reducida y desordenada del panel.

## Dirección aprobada

Se aplicará un **rediseño focalizado**: conservar datos y lógica, pero reorganizar la
presentación de cada pantalla alrededor de una decisión principal. No se realizará ni un
simple lavado cosmético ni una reconstrucción integral.

## Diseño por pantalla

### 1. Onboarding: «entiendo el hábito y quiero empezar»

El onboarding conservará tres pasos como máximo:

1. Bienvenida personal y metáfora del viaje.
2. Explicación tangible de la misión diaria: duración y tipo de actividad.
3. Mensaje anti-frustración y CTA para descubrir el punto de partida.

Cambios previstos:

- Sustituir la selección de color aislada por una bienvenida visual sin configuración
  prematura. La personalización completa seguirá viviendo en Perfil / Mi mundo.
- Mostrar una mini-previsualización de la misión, no tres iconos abstractos equivalentes.
- Adaptar copy, densidad y presencia visual mediante `data-stage`:
  - `p12`: frases muy breves, apoyos grandes y CTA táctil de al menos 56 px.
  - `p34`: tono cálido y mayor autonomía, sin estética de guardería.
  - `p56`: explicación compacta y orientada al progreso.
  - `eso`: composición sobria, sin guía infantil y con opción de saltar.
- Mantener el indicador de tres pasos, foco visible y reducción de movimiento.
- CTA final explícito: «Descubrir mi punto de partida»; en ESO, equivalente maduro.

### 2. Test de nivel: «un punto de partida, no un examen»

Se mantendrán las ocho preguntas y el cálculo CEFR existente. La capa visual y el tono
reducirán ansiedad sin falsear el propósito diagnóstico.

Cambios previstos:

- Introducir una cabecera compacta con progreso real (`1 de 8`) y texto tranquilizador.
- Reducir el vacío vertical; la pregunta y las opciones ocuparán el centro útil de la
  pantalla sin quedar artificialmente separadas del CTA.
- Adaptar tactilidad, tamaño y copy por banda.
- Para `p12` y `p34`, permitir apoyo visual solo cuando el contenido disponga de un asset
  real; nunca inventar imágenes ni usar emojis como sustituto.
- Mantener la ausencia de feedback correcto/incorrecto durante el diagnóstico.
- Añadir selección claramente perceptible por borde, fondo y marcador, no solo color.
- Dar al CTA una etiqueta contextual: «Siguiente pregunta» y, al final, «Ver mi punto de
  partida».
- Resultado final con lenguaje no evaluativo, explicación breve y CTA directo a la primera
  misión.

### 3. Panel de familias: «aprendizaje, hábito y siguiente paso»

La página se reorganizará en tres niveles de prioridad:

1. **Resumen ejecutivo:** evidencia aprendida, constancia semanal y una interpretación.
2. **Siguiente paso recomendado:** visible inmediatamente después del resumen.
3. **Detalle:** contenidos, evolución, fortalezas y vínculo con la clase.

Cambios previstos:

- Mantener los datos existentes y sus estados honestos de baja evidencia.
- Reducir repeticiones entre titular, gráfica e interpretación.
- Colocar «Lo que ya sabe decir» dentro del primer tramo visible porque materializa el
  valor pedagógico para la familia.
- Adelantar la recomendación; no debe quedar detrás de todas las gráficas.
- Usar navegación interna solo cuando aporte orientación. En móvil será compacta y no
  competirá con el contenido.
- Permitir que el detalle secundario sea más compacto, sin ocultar información crítica.
- Mantener explícitamente la ausencia de notas, rankings y comparaciones entre alumnos.
- Conservar estados de carga, error, falta de acceso y pocos datos.

### 4. Informe: «resumen compartible de un vistazo»

El informe será deliberadamente más corto que el panel de familias:

- Cabecera con alumno y periodo.
- Dos o tres evidencias concretas de aprendizaje.
- Una fila compacta de métricas de hábito.
- Contenidos practicados resumidos.
- Un único cierre pedagógico legible.

Cambios previstos:

- Eliminar la nube extensa de medallas; mostrar como máximo dos hitos relevantes y un
  contador adicional cuando proceda.
- Evitar duplicar cuatro métricas de racha si no ayudan a interpretar el aprendizaje.
- Unificar colores, tipografía, bordes e iconos con los tokens `--il-*`.
- Corregir el pie roto en móvil y mantener una anchura de lectura cómoda.
- Preparar estilos de impresión básicos para que el informe siga siendo legible al guardar
  como PDF, sin convertir esta fase en un generador de documentos.
- Mantener la ocultación honesta de secciones sin evidencia real.

## Componentes y límites técnicos

- `layout.js` seguirá siendo la fuente única de iconos.
- `design-system.css` seguirá siendo la fuente de tokens; no se añadirán colores hexadecimales
  nuevos en las pantallas intervenidas.
- `etapa.js` seguirá gobernando `p12`, `p34`, `p56` y `eso`.
- La lógica de autenticación, `ILAuth.savePlacement`, `ILProgressData` y `family-data.js`
  conservará sus contratos.
- Los cambios de CSS o JavaScript actualizarán sus tokens `?v=` en todas las páginas que los
  cargan.
- Se evitarán componentes nuevos compartidos si solo sirven a una pantalla. La reutilización
  se limitará a patrones existentes y a pequeñas clases con una función clara.

## Estados y errores

- Ninguna pantalla debe quedar en blanco durante carga o error.
- Onboarding y test redirigirán como hasta ahora cuando no exista sesión válida.
- El test conservará la respuesta seleccionada durante cada paso y no permitirá avanzar sin
  respuesta.
- Panel e informe mostrarán datos reales, datos demo solo en demo y estados vacíos honestos.
- La recomendación del panel se ocultará cuando no haya evidencia suficiente, sustituyéndola
  por una explicación breve de cómo se generará.
- La pérdida de conexión mantendrá el aviso existente sin tapar acciones principales.

## Responsive y accesibilidad

La verificación cubrirá 320, 390, 768, 1024 y 1440 px.

- Sin scroll horizontal ni contenido cortado.
- Targets mínimos: 56 px en `p12`, 52 px en `p34`, 48 px en `p56` y 44 px en ESO/familias.
- Contraste WCAG AA para texto normal y estados de foco claramente visibles.
- Orden de encabezados coherente y una sola jerarquía principal por pantalla.
- Indicadores de progreso con nombre accesible y valores comprensibles.
- Selecciones y gráficas no dependerán exclusivamente del color.
- Flujo completo utilizable con teclado.
- Animaciones desactivables mediante `prefers-reduced-motion`.
- La vista de impresión del informe no mostrará controles o avisos de vista previa innecesarios.

## Verificación

1. Ejecutar todos los tests indicados en `AGENTS.md` y cualquier test adicional afectado.
2. Recorrer onboarding y test completos en demo para las cuatro bandas.
3. Revisar los estados con datos, pocos datos, error y falta de acceso del panel familiar.
4. Revisar informe con y sin frases, contenidos y medallas.
5. Probar teclado, foco, texto ampliado y `prefers-reduced-motion`.
6. Revisar consola sin errores en las cuatro pantallas.
7. Comparar móvil, tablet y escritorio en los cinco anchos definidos.
8. Confirmar que no se han introducido secretos, dependencias, datos inventados ni rutas rotas.

## Fuera de alcance

- Cambiar el algoritmo CEFR o el banco de preguntas.
- Crear cuentas familiares reales o el enlace seguro del informe.
- Construir la recomendación/repaso de la Home.
- Ampliar el banco editorial de ejercicios.
- Rediseñar Inicio, Lección, Progreso, Perfil o Mi mundo.
- Añadir librerías, build, framework o servicio externo.

## Criterios de aceptación

- Cada pantalla comunica una única finalidad principal en los primeros segundos.
- Onboarding y test se sienten apropiados para cada etapa sin mantener cuatro implementaciones.
- El panel familiar permite identificar aprendizaje, constancia y siguiente paso en el primer
  tramo de la página.
- El informe funciona como resumen breve y no duplica todo el panel.
- No quedan roturas visuales a 320–1440 px ni errores de consola.
- Los flujos y datos existentes siguen funcionando y los tests permanecen verdes.
