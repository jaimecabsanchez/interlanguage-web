# Rediseño profundo de la experiencia de sesión

**Fecha:** 2026-09-10  
**Estado:** aprobado para planificación  
**Ámbito:** `plataforma/leccion.html`, `plataforma/motor/engine.js`, `plataforma/motor/motor.css` y pruebas asociadas.

## 1. Objetivo y límites

La sesión debe permitir entender la tarea en menos de dos segundos y alcanzar una calidad visual y de interacción comparable a las mejores aplicaciones educativas, sin copiar su identidad. Durante la respuesta, el ejercicio será el protagonista absoluto.

Este trabajo rediseña las plantillas ya implementadas: selección con texto o imagen, completar, ordenar, emparejar, comprensión y hablar. No añade tipos de ejercicio ni modifica masivamente el banco de contenido. Mantiene la API pública `IL_ENGINE.render`, la evaluación, los eventos educativos, mastery y la separación entre misión diaria y práctica libre.

## 2. Enfoque seleccionado

Se conservarán las plantillas actuales y se introducirá un shell de sesión dirigido por estados. Esta opción ofrece una mejora profunda sin convertir el trabajo en una migración del motor o del contenido.

El motor seguirá siendo responsable de pintar, validar y emitir resultados. `leccion.html` seguirá componiendo la sesión. La presentación común —instrucción, actividad, feedback y acción— será única para todas las plantillas.

Quedan descartados:

- un retoque exclusivamente CSS, porque no resolvería la jerarquía ni los estados;
- separar ahora todas las plantillas en módulos nuevos, porque ampliaría el alcance sin mejorar directamente la experiencia aprobada.

## 3. Estructura universal

Cada ejercicio mostrará, como máximo y en este orden:

1. progreso de sesión;
2. instrucción;
3. actividad;
4. feedback, solo cuando exista;
5. una única acción principal.

La cabecera contendrá únicamente salida, progreso y contador discreto. Se retirarán de la zona de respuesta las estadísticas, recompensas, etiquetas de habilidad redundantes, ayudas permanentes y elementos decorativos que compitan con la actividad. Nemo no aparecerá al entrar en cada ejercicio ni flotará sobre la tarea; su uso quedará limitado, si aporta valor, a un momento breve integrado en el feedback de Primaria inicial.

El CTA será un solo botón estable dentro de la composición:

- sin respuesta: `Comprobar` / `Check`, desactivado con aspecto disponible pero no accionable;
- con respuesta seleccionada: `Comprobar` / `Check`;
- primer fallo: vuelve a `Comprobar` después de permitir corregir;
- acierto o segundo fallo: `Continuar` / `Continue`;
- último ejercicio: conserva la misma transición y finaliza al continuar.

## 4. Ancho por tipo y composición responsive

El shell no impondrá un ancho grande a actividades pequeñas. El motor añadirá una clase de medida derivada del tipo:

| Familia | Tipos | Ancho máximo orientativo |
|---|---|---:|
| Simple | `elegir_texto`, `completar`, `hablar` | 720 px |
| Visual | `elegir_imagen` y selección con visuales | 880 px |
| Manipulación | `ordenar`, `emparejar` | 960 px |
| Lectura | `comprension` | 960 px, estímulo limitado a 68 caracteres por línea |

El contenido se centrará sin `min-height` artificial en escritorio. En móvil será una columna real: instrucción arriba, actividad desplazable y acción dentro del flujo; no será una versión encogida del escritorio. En tablet, especialmente para 5–9 años, las opciones aprovecharán el ancho táctil sin aumentar innecesariamente la distancia entre pregunta y respuesta.

Se comprobarán 1440×900, 1280×800, 1024×768, 820×1180, 768×1024 y 390×844. No habrá scroll horizontal, solapamientos ni CTA fuera de alcance.

## 5. Estados de interacción

El shell expondrá un estado explícito mediante `data-state` y una transición controlada:

- `loading`: prepara recursos y evita acciones prematuras;
- `idle`: actividad lista, todavía sin respuesta;
- `selected`: existe una respuesta comprobable;
- `checking`: evaluación en curso y controles bloqueados;
- `correct`: respuesta correcta, feedback y continuar;
- `incorrect`: primer fallo registrado;
- `retry`: controles reactivados con pista útil;
- `technical-error`: fallo no atribuible al alumno, sin penalización y con salida clara;
- `complete`: ejercicio resuelto o solución revelada, listo para continuar.

No se mezclarán estados visuales. El feedback no se mostrará antes de comprobar y el CTA de comprobar nunca convivirá con otro de continuar.

### Flujo de error pedagógico

1. El primer fallo registra el intento, muestra un mensaje amable y una pista, limpia el juicio visual y devuelve el foco a la actividad.
2. El segundo fallo registra el intento, revela la respuesta correcta, muestra una explicación adaptada y cambia el CTA a continuar.
3. No existe un tercer intento en esta fase.

Esta regla sustituye, para la experiencia actual, la antigua expectativa genérica de reintentar indefinidamente. La evidencia seguirá distinguiendo primer intento y éxito eventual.

## 6. Feedback por edad

El feedback siempre combina texto y estado visual; nunca depende solo del color.

| Banda | Acierto | Primer fallo | Segundo fallo |
|---|---|---|---|
| 5–7 | `¡Genial!` | `Casi. Prueba otra vez.` + pista muy breve | respuesta correcta con una frase sencilla |
| 8–9 | `¡Eso es!` | `Casi. Prueba otra vez.` + pista | respuesta y explicación breve |
| 10–11 | `Correcto` | `Casi.` + pista concreta | respuesta y regla corta cuando aporte valor |
| ESO | `Correct` | `Almost.` + pista contextual | respuesta y explicación útil, no infantil |

Las explicaciones editoriales existentes tienen prioridad. Si faltan, el motor construirá una explicación neutral a partir de la respuesta correcta y el tipo de actividad. No inventará reglas lingüísticas que no estén respaldadas por el ejercicio.

## 7. Adaptación por edad

### 5–7

- instrucción de una sola frase, preferentemente `Escucha y toca.`, `Mira y toca.`, `Toca en orden.` o `Escucha y repite.`;
- audio e imagen con prioridad visual;
- máximo tres opciones, garantizado por la matriz de compatibilidad; el renderer no ocultará respuestas silenciosamente;
- targets mínimos de 56 px, imágenes grandes y separación corta;
- sin lectura avanzada ni lenguaje académico;
- progreso mediante nodos visuales y contador pequeño.

### 8–9

- instrucciones breves como `Escucha y elige.`, `Ordena la frase.`, `Completa la palabra.` y `Lee y responde.`;
- hasta cuatro opciones, targets mínimos de 52 px;
- mayor autonomía y feedback breve;
- progreso híbrido: nodos o barra segmentada más contador.

### 10–11

- presentación más madura para grammar, reading, writing, listening y dialogue;
- targets mínimos de 48 px;
- explicaciones cortas como `Use does with he/she/it.` solo cuando el contenido lo sustente;
- barra continua y contador discreto.

### ESO

- instrucciones prioritariamente en inglés: `Choose the correct option.`, `Complete the sentence.`, `Listen and answer.`;
- targets mínimos de 44 px;
- menos ilustración, radios y motion más sobrios;
- feedback directo y útil;
- barra continua compacta y contador discreto.

El fallback neutral conservará textos comprensibles en español y targets de 48 px.

## 8. Comportamiento por plantilla

- **Selección de texto:** filas o botones compactos y legibles; selección inequívoca; atajos 1–4 cuando proceda.
- **Selección visual:** visual dominante, etiqueta secundaria y máximo de opciones según edad; no estira imágenes pequeñas.
- **Completar:** campo centrado en la tarea, etiqueta accesible, Enter comprueba; la solución final se muestra junto al feedback.
- **Ordenar:** zona de frase y banco próximos; fichas reversibles antes de comprobar; solución final legible.
- **Emparejar:** dos pasos claros —seleccionar origen y destino—, estados no basados solo en color y ancho suficiente en tablet.
- **Comprensión:** estímulo con medida de lectura, preguntas agrupadas semánticamente y feedback por respuesta sin convertir la pantalla en un formulario denso.
- **Hablar:** un solo control de audio con indicación explícita; no se introducirá evaluación automática de pronunciación en esta fase.

## 9. Audio

Habrá un único control de audio principal por actividad, salvo que la propia plantilla de hablar necesite reproducir su frase y no exista audio de cabecera duplicado.

Estados visibles y accesibles:

- `loading`: `Cargando…` / `Loading…`, desactivado temporalmente;
- `playing`: ondas breves, `Escuchando…` / `Playing…`, `aria-pressed=true`;
- `ready`: `Escuchar` / `Listen` inicialmente y `Otra vez` / `Replay` después;
- `error`: `Reintentar audio` / `Try audio again` y explicación no penalizadora.

Se conserva audio editorial primero y TTS como fallback. Replay incrementa su evidencia actual. El error técnico emite el evento técnico existente y nunca se registra como fallo pedagógico.

## 10. Motion

Las únicas animaciones serán consecuencia inmediata de una acción:

- confirmación breve de selección;
- transición del feedback;
- avance del progreso;
- énfasis corto de la respuesta correcta.

No habrá animaciones permanentes. Se retirará el pop flotante de puntos durante la actividad. `prefers-reduced-motion` eliminará desplazamientos, escalas y ondas animadas sin ocultar información.

## 11. Teclado, foco y accesibilidad

- Tab y Shift+Tab recorrerán controles en orden lógico.
- En selección única, 1/2/3/4 elegirán opciones si el foco no está en un campo editable.
- Enter activará comprobar o continuar cuando el CTA esté habilitado.
- En completar, Enter comprobará la respuesta y no disparará dos acciones.
- Los atajos se ignorarán en `input`, `textarea`, `select` y elementos editables cuando no correspondan.
- Tras el primer fallo, el foco volverá a la actividad; tras acierto o solución revelada, pasará al CTA continuar.
- El feedback usará `role=status` y `aria-live=polite`; los errores técnicos usarán un anuncio adecuado sin duplicar lectura.
- Opciones y resultados conservarán nombre accesible, `aria-pressed` cuando proceda e icono más texto.
- Se validará contraste WCAG AA, zoom, foco visible y uso sin color.

## 12. Componentes y responsabilidades

### `leccion.html`

- shell de sesión, salida, progreso y resumen;
- progreso adaptado por edad;
- composición de la secuencia y persistencia existente;
- sin lógica interna específica de cada plantilla.

### `motor/engine.js`

- estado común y transiciones;
- resolución de instrucciones breves por tipo y edad;
- medida por familia de ejercicio;
- audio y atajos;
- feedback y CTA únicos;
- plantillas actuales para respuesta, evaluación y revelado.

### `motor/motor.css`

- layout del shell de actividad y medidas;
- variantes p12, p34, p56, ESO y neutral;
- estados visuales, targets, feedback, audio, motion y responsive;
- solo tokens `--il-*`.

No se añadirá framework ni dependencia.

## 13. Persistencia y eventos

El rediseño no cambia el contrato de datos:

- cada comprobación emite un intento;
- primer intento, pistas, replays, errores técnicos, tiempo y éxito eventual se siguen registrando;
- el segundo fallo revela solución y cierra el ejercicio, pero no se convierte en acierto;
- daily mission, review y skill practice conservan sus reglas actuales;
- la práctica por habilidad sigue sin modificar el estado de la misión diaria.

## 14. Errores y recuperación

- Plantilla desconocida o datos insuficientes: estado técnico claro y continuar sin penalización cuando sea seguro.
- Audio no disponible: reintentar audio y continuar sin penalización en tareas dependientes de audio.
- Excepción de render: registrar observabilidad, evitar pantalla vacía y ofrecer una salida controlada.
- Pérdida de conexión: conservar el aviso global y el registro local existente; no bloquear una interacción ya cargada.
- Carga: skeleton o estado contenido dentro de la medida del ejercicio, sin spinner dominante.

## 15. Pruebas y validación visual

### Tests automatizados

- transiciones de los nueve estados;
- un único CTA y cambios comprobar/continuar;
- primer fallo reintenta y segundo fallo revela solución;
- copy correcto de feedback para las cuatro edades y neutral;
- instrucciones cortas por tipo y edad;
- límites de opciones que ya exige la matriz;
- medida asignada a cada familia;
- audio loading/playing/ready/error, replay y fallo no penalizador;
- atajos 1–4 y Enter sin interferir con campos editables;
- foco después de retry, correct y technical error;
- eventos educativos y daily mission sin regresiones;
- todas las plantillas actuales;
- `prefers-reduced-motion` y ausencia de colores literales en CSS;
- suite completa de `plataforma/` y `plataforma/motor/`.

### Checklist en navegador

Para cada banda se comprobará al menos una actividad simple y una compleja, incluyendo selección visual, ordenar o emparejar, comprensión y audio cuando sean compatibles. Se capturarán estados idle, selected, retry, correct, segundo fallo y technical error en las resoluciones acordadas.

El checklist verificará:

- tarea comprensible en menos de dos segundos;
- ninguna superficie artificialmente estirada;
- un solo CTA dominante;
- instrucción, actividad y feedback sin competencia visual;
- targets mínimos por edad;
- cero scroll horizontal o solapamientos;
- teclado completo y foco visible;
- copy y tono adecuados;
- consola sin errores;
- reducción de movimiento efectiva.

Las capturas de QA se generarán localmente y se resumirán en la entrega; no se añadirán binarios temporales al repositorio.

## 16. Criterios de aceptación

El trabajo se considera terminado cuando todas las plantillas actuales comparten la estructura universal, los estados están explícitos, el segundo fallo revela la respuesta correcta, el ancho responde al tipo, la experiencia cambia de manera verificable por edad, audio y teclado cumplen el contrato, todas las resoluciones pasan el checklist y la suite completa queda verde.
