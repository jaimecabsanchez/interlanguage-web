# Rediseño de la experiencia Inicio

Fecha: 2026-08-09  
Estado: aprobado e implementado
Alcance: `plataforma/inicio.html` y persistencia mínima compartida con `plataforma/leccion.html`

## Objetivo

La pantalla Inicio debe comunicar en menos de cinco segundos qué misión toca hoy, qué se aprenderá, cuánto durará, cuánto se ha completado, cómo va la semana y cuál es el siguiente logro. El rediseño conserva la navegación, el motor de ejercicios, Supabase, el modo demo y el sistema visual global existente.

No se introduce un framework, una dependencia ni una fuente de datos paralela. Los datos pedagógicos seguirán procediendo de `contenido.js`; la actividad, racha y sesiones seguirán procediendo de `ILAuth`.

## Dirección visual aprobada

En escritorio se adopta una composición editorial de dos tercios más un tercio:

- Columna principal: saludo y tarjeta protagonista de la misión.
- Columna secundaria: objetivo semanal y próximo sello.
- La conexión con clase aparece al pie de la misión como contexto pedagógico, no como una tarjeta competidora.
- El ancho útil aumenta sin llenar la pantalla de métricas ni bloques decorativos.

La misión diaria es el foco visual. Usa superficie blanca, borde y sombra contenidos, color primario para el CTA y el avión de papel como indicador de avance. Coral queda reservado para acentos de marca y recompensa; verde agua comunica progreso y éxito; azul marino mantiene la jerarquía principal.

En móvil el orden será:

1. Saludo compacto.
2. Misión de hoy.
3. Objetivo semanal.
4. Próximo sello.
5. Contexto secundario si no cabe dentro de la misión.

La navegación inferior compartida se conserva sin cambios.

## Contenido y jerarquía

### Saludo

Título: `Hola, {nombre}`. Subtítulo según el estado, con esta prioridad:

1. Misión completada: `Misión completada. Hoy ya has avanzado.`
2. Misión iniciada: `Tu misión está en marcha. Continúa donde la dejaste.`
3. Regreso tras tres o más días: `Qué bien verte de nuevo. Retomamos con una misión breve.`
4. Sin empezar: `Tienes una misión breve preparada para hoy.`

En ESO se elimina la exclamación inicial y se mantiene un tono más sobrio, sin cambiar la estructura.

### Misión diaria

Contenido visible:

- Eyebrow: `TU MISIÓN DE HOY`.
- Título real de la unidad, con `My daily routine` como contenido actual.
- Resultado de aprendizaje: `Aprenderás a hablar sobre lo que haces cada mañana.` cuando la unidad actual sea la rutina diaria; para otras unidades se usará la descripción real del contenido.
- `6 actividades` y estimación `~8 min`, calculadas desde la sesión real.
- Skills reales de los ejercicios, presentadas como chips: Vocabulary, Listening y Grammar cuando correspondan.
- Mini-ruta de seis hitos. Los completados usan éxito; el actual usa primario; los pendientes son neutrales. El avión se desplaza hasta el hito actual.
- Contexto: `Basado en lo trabajado esta semana en clase.`
- Reserva de contenido opcional y oculta por defecto: `Repaso recomendado por tu teacher.`

### CTA dinámico

El botón tendrá un único estado visible:

- Sin empezar: `Empezar misión`.
- En progreso: `Continuar · {completadas} de {total}`.
- Completada con errores pendientes: `Repasar errores`.
- Completada sin errores: `Misión completada`, deshabilitado y con tratamiento de éxito.

Nunca se usará `Volver a practicar` para una misión que no se haya iniciado.

### Objetivo semanal

El bloque muestra siempre `L M X J V S D`, `Objetivo semanal` y `{n} de 5 sesiones`.

Cada día tendrá uno de cuatro estados semánticos:

- `completed`: fecha incluida en `ILAuth.getWeekActivity().practiced`.
- `today`: día actual no completado.
- `pending`: día pasado sin práctica.
- `future`: día posterior a hoy.

El progreso accesible conservará `role="progressbar"` y valores ARIA. El texto de apoyo será `Completa 5 sesiones para conseguir el sello Weekly Explorer.`; al alcanzar la meta cambiará a una confirmación de logro.

### Próximo sello

El bloque sustituye el mensaje decorativo actual y muestra:

- Eyebrow: `PRÓXIMO SELLO`.
- Nombre: `Morning Explorer`.
- Contador accionable de sesiones que faltan.
- Sello visual propio, sin gemas ni emoji.
- Barra de progreso y explicación breve del criterio.

`Morning Explorer` representa cinco misiones completadas de la unidad de rutinas. Como el sistema actual no guarda histórico por unidad, no se inventará progreso retroactivo: el nuevo registro comenzará a contar misiones de esa unidad desde su introducción. El componente aceptará nombre, objetivo, progreso y descripción para poder conectarlo a un catálogo de sellos real más adelante.

La racha puede mantenerse como dato secundario en cabecera. Las gemas dejan de aparecer en Inicio, aunque su lógica histórica se conserva para no afectar otras pantallas.

## Estado y persistencia

Se añadirá un recurso compartido sin dependencias, `plataforma/mission-state.js`, consumido por Inicio y Lección.

Clave local: `il_mission_state_v1_{username}`.

Estructura diaria:

```js
{
  version: 1,
  date: "YYYY-MM-DD",
  unitId: "...",
  itemIds: ["..."],
  currentIndex: 0,
  completedCount: 0,
  correctCount: 0,
  incorrectIds: [],
  total: 6,
  status: "not_started | in_progress | completed",
  completedAt: null
}
```

Reglas:

- La clave se separa por usuario y se ignora si su fecha no es hoy.
- Lección crea o sincroniza el estado al componer la sesión diaria.
- Tras cada `onNext`, guarda índice, completadas, aciertos e IDs incorrectos.
- Al recargar, una misión iniciada continúa en el siguiente ejercicio pendiente.
- Al terminar, primero conserva el flujo existente de `ILAuth.completeLesson(summary)` y después marca la misión como completada; Inicio también contrasta con `progress.last === hoy` como fuente autoritativa.
- Una sesión ya completada nunca vuelve a conceder XP, racha o recompensas por recarga.
- `leccion.html?mode=errors` usa únicamente `incorrectIds`, no vuelve a llamar a `completeLesson` y limpia cada error superado de la lista local.
- El histórico mínimo para sellos se guarda en `il_mission_history_v1_{username}` como una lista deduplicada por fecha y unidad. Solo se escribe al completar una misión normal, nunca un repaso.
- Si `localStorage` no está disponible, la plataforma degrada al comportamiento actual: misión desde el principio y finalización autoritativa mediante `ILAuth`.

Supabase, `auth.js`, el esquema de datos y la economía de gemas no se modifican en esta fase.

## Componentes de interfaz

Los estilos específicos permanecerán inicialmente dentro de Inicio, apoyados en los tokens y componentes globales ya creados. Se definen estas piezas locales con nombres de clase propios:

- `home-greeting`
- `daily-mission`
- `mission-route`
- `mission-context`
- `weekly-goal`
- `week-day`
- `next-stamp`

La navegación e iconografía se siguen generando desde `layout.js`. Los iconos estructurales se toman de `ILIcon`/`data-il-icon`; no se añaden emojis. El sello y el avión se dibujan como SVG propios y accesibles.

## Interacción, accesibilidad y movimiento

- Objetivos táctiles mínimos de 44 × 44 px.
- CTA, enlaces y controles con `hover`, `active`, `focus-visible` y `disabled`.
- Etiquetas ARIA para ruta, progreso, sello y estadísticas.
- Texto alternativo o `aria-hidden` correcto en SVG decorativos.
- Contraste conforme al sistema visual global.
- Entrada suave de tarjetas, avance de barra y desplazamiento del avión con duraciones cortas.
- El día completado puede hacer un único pulso discreto.
- `prefers-reduced-motion: reduce` elimina desplazamientos, pulsos y transiciones no esenciales.

## Responsive

- 360/390 px: una columna, sin desbordamiento, CTA completo y semana distribuida en siete columnas.
- 768 px: una columna amplia; misión y bloques secundarios mantienen lectura cómoda.
- 1024 px: rejilla de dos columnas, aproximadamente 2/3 y 1/3.
- 1366 px y superior: ancho limitado por `--il-max-width-shell`; no se crean vacíos mediante alturas fijas.

## Archivos previstos

- Modificar `plataforma/inicio.html`: estructura, estilos y renderizado de estados.
- Modificar `plataforma/leccion.html`: lectura/escritura del punto de misión y modo de repaso de errores.
- Añadir `plataforma/mission-state.js`: persistencia compartida y testeable.
- Añadir `plataforma/mission-state.test.js`: pruebas unitarias del ciclo diario, reanudación, errores e histórico.
- Actualizar los parámetros `?v=` de los recursos tocados donde corresponda.

No se prevén cambios en `layout.js`, `design-system.css`, `app.css`, `auth.js`, `contenido.js` ni en la navegación general.

## Validación y criterios de aceptación

1. Los cuatro estados del CTA se pueden reproducir con datos persistidos coherentes.
2. Reanudar una sesión continúa en el ejercicio correcto y no duplica recompensas.
3. La semana muestra siete días y estados reales.
4. El próximo sello no depende de gemas ni presenta progreso inventado.
5. Inicio no muestra el mensaje decorativo sustituido ni `Volver a practicar`.
6. No hay errores nuevos de consola.
7. No hay desbordamiento horizontal ni controles menores de 44 px en 360, 390, 768, 1024, 1366 y escritorio grande.
8. Navegación por teclado y foco visible funcionan.
9. El modo de movimiento reducido no anima el avión ni los estados de completado.
10. Pasan las pruebas de sintaxis, unitarias y smoke existentes, además de las nuevas pruebas de misión.

## Riesgos y mitigaciones

- **Dos fuentes de estado:** `progress.last` seguirá siendo la autoridad de finalización; el estado local solo añade granularidad de UI.
- **Datos antiguos sin unidad:** no se atribuyen a Morning Explorer para evitar sellos falsos.
- **Recarga al finalizar:** el guardado y la detección de sesión completada impedirán ejecutar dos veces `completeLesson`.
- **Repaso contado como sesión:** el modo errores se marca explícitamente como repaso y no modifica XP, racha ni objetivo semanal.
- **Cambio futuro a backend:** la API pequeña de `mission-state.js` permitirá sustituir almacenamiento local sin reescribir Inicio.
