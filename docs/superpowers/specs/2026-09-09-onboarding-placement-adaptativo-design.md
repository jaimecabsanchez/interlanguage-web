# Interlanguage HOME · Alta, onboarding y colocación adaptativa

**Fecha:** 2026-09-09  
**Estado:** diseño aprobado; pendiente de revisión del documento por el owner

## 1. Objetivo

Convertir el primer acceso del alumno en un recorrido breve, fiable y premium:

`alta → cambio de contraseña → bienvenida → calibración → punto de partida → primera misión`

La experiencia debe evitar tanto el aburrimiento como la frustración, producir un CEFR aproximado respaldado por evidencia y explicar que el resultado es un punto de partida revisable. La edad modifica presentación, modalidad, densidad, tono y autonomía; el CEFR modifica la dificultad lingüística. Ninguna banda de edad impone un techo CEFR.

## 2. Principios no negociables

- Todos los alumnos realizan una calibración breve.
- El nivel asignado por el centro, cuando exista y sea válido, es solo la semilla inicial.
- Sin nivel previo fiable, todas las bandas empiezan en A1; la edad no decide el nivel.
- `p12` y `p34` usan interfaz española; `p56` mantiene chrome español e inglés contextual; `eso` puede usar inglés con mayor presencia.
- Una banda desconocida usa modo neutral seguro, registra el problema y nunca hereda `p56` silenciosamente.
- No se muestra correcto/incorrecto durante la calibración.
- «No lo sé todavía» es una respuesta legítima y no culpabilizadora.
- Un fallo técnico no es una respuesta incorrecta: se excluye y se sustituye por otra actividad compatible.
- La calibración no completa misiones, no altera rachas y no concede rewards.
- El resultado se presenta como aproximado y puede revisarse con aprendizaje posterior.
- No se introduce micrófono, grabación de menores, monedas, cofres, rankings ni tipos nuevos de ejercicio.

## 3. Alcance

### Incluido

- Continuidad desde el alta administrativa y el cambio obligatorio de contraseña.
- Onboarding localizado por banda y centrado en la identidad del alumno.
- Banco de colocación separado del contenido diario, versionado y validable.
- Motor adaptativo puro y determinista.
- Reanudación segura en el mismo dispositivo.
- Persistencia versionada del resultado mediante `ILAuth.savePlacement` y `student_placements`.
- Resultado comprensible, evidencia prudente y transición a la primera misión.
- Estados loading, audio pendiente, fallo técnico, offline, contenido insuficiente y sincronización pendiente.
- Accesibilidad, responsive y pruebas de las cuatro bandas más neutral.

### Fuera de alcance

- Rediseño profundo de Inicio, Practicar, Progreso, Perfil o Mundo.
- Panel familiar completo; solo se deja trazabilidad para que lo consuma después.
- Recalibración automática periódica.
- Evaluación oral grabada o pronunciación automatizada.
- Nuevas plantillas de ejercicio.
- Recompensas por terminar el test.

## 4. Recorrido de primer acceso

1. El administrador crea la cuenta con año de nacimiento/curso y, opcionalmente, una estimación de nivel.
2. El alumno inicia sesión y cambia la contraseña temporal.
3. `onboarding.html` presenta tres ideas: identidad, práctica breve y crecimiento académico visible.
4. El CTA final explica «Vamos a encontrar un buen punto de partida» y abre la calibración.
5. `test-nivel.html` recupera una sesión incompleta compatible o crea una nueva.
6. El motor selecciona actividades según banda, CEFR estimado, modalidad reciente y cobertura disponible.
7. Cada envío muestra únicamente confirmación neutral y avanza automáticamente o mediante un CTA único.
8. Al alcanzar evidencia suficiente o el máximo de interacciones, se persiste el resultado.
9. El resultado muestra CEFR aproximado, explicación sencilla del comienzo y hasta dos ejemplos vistos durante la calibración.
10. El CTA principal abre Inicio, donde la primera misión ya usa la intersección edad × CEFR.

Si el alumno ya tiene un placement completo, vigente y compatible con la versión actual, se evita repetir el test. Una sesión incompleta nunca se interpreta como placement terminado.

## 5. Experiencia por banda

### `p12` · 5–7 años

- Entre 5 y 7 interacciones evaluables.
- Audio e imagen como modalidades prioritarias; texto mínimo.
- Máximo tres opciones iniciales y targets mínimos de 56 px.
- Instrucciones en español, con inglés exclusivamente en el contenido que se evalúa.
- Avatar del alumno como identidad principal. Nemo puede aparecer una sola vez como apoyo puntual.
- Progreso visual por pasos, sin porcentajes ni nota.
- Copy de salida: «Empezaremos con palabras y frases que encajan contigo».

### `p34` · 8–9 años

- Entre 6 y 8 interacciones evaluables.
- Audio, imagen, vocabulario, frases breves y gramática contextual.
- Targets mínimos de 52 px y lectura corta.
- Interfaz española y autonomía gradual.

### `p56` · 10–11 años

- Entre 7 y 9 interacciones evaluables.
- Comprensión, vocabulario, listening y construcción de frases existentes.
- Targets mínimos de 48 px.
- Chrome español; inglés contextual en aprendizaje, ejemplos y acciones cuando sea natural.

### `eso`

- Entre 7 y 9 interacciones evaluables.
- Apariencia compacta y madura; mayor presencia de inglés sin sacrificar claridad.
- Targets mínimos de 44 px.
- Admite desde Pre-A1 hasta B1 con contextos adolescentes. Un principiante de ESO nunca recibe estética o situaciones infantiles.

### Neutral

- Interfaz sobria en español, targets de 44 px y modalidades conservadoras.
- Parte de A1 si no hay estimación válida.
- Solo utiliza preguntas declaradas explícitamente como compatibles con neutral.
- El problema de resolución de banda se registra mediante observabilidad.

## 6. Banco de colocación

El banco no vive incrustado en el HTML. Cada ítem declara como mínimo:

- `id` estable;
- `instrument_version`;
- `cefr_probe`: Pre-A1, A1, A2 o B1;
- `skill` y `interaction_type` existentes;
- `bands` compatibles;
- consigna localizada por banda;
- opciones y respuesta evaluable;
- recurso editorial de audio/imagen cuando corresponda;
- explicación breve que solo puede mostrarse al finalizar;
- contexto editorial (`child`, `upper_primary`, `teen`, `neutral`).

Un authoring gate bloquea ítems incompletos, respuestas ambiguas, recursos ausentes y contextos incompatibles. Para publicar una versión debe haber al menos dos ítems de modalidades distintas por cada combinación banda × CEFR que se pretenda calibrar. Si falta cobertura, el sistema reduce su confianza y no afirma un nivel que no pudo comprobar.

## 7. Motor adaptativo

El motor será un módulo puro, sin DOM, red ni almacenamiento. Recibe banda, estimación inicial, respuestas previas, ítems disponibles y práctica reciente de la propia calibración.

### Semilla

1. CEFR asignado por el centro si se puede normalizar a Pre-A1/A1/A2/B1.
2. En ausencia de una estimación válida: A1 para todas las edades.

### Exploración por pares

- Se seleccionan dos ítems variados del nivel candidato.
- Dos aciertos evaluables permiten probar un nivel superior, si existe cobertura.
- Cero aciertos o dos «No lo sé todavía» permiten probar un nivel inferior.
- Una evidencia favorable y otra desfavorable mantienen el nivel y solicitan un tercer ítem de desempate cuando queda presupuesto.
- Nunca se salta más de un nivel entre bloques.
- La modalidad reciente actúa solo como desempate; la necesidad de verificar el nivel tiene prioridad.
- Un fallo técnico no consume presupuesto, no altera el resultado y activa un reemplazo compatible.
- «No lo sé todavía» consume una interacción evaluable como evidencia de dificultad, pero nunca se presenta como error del alumno.

### Parada

La calibración termina cuando se cumple una de estas condiciones:

- se ha validado un límite entre dos niveles con evidencia concordante;
- no existe un nivel superior/inferior compatible que comprobar;
- se alcanza el máximo de interacciones de la banda;
- no queda contenido evaluable compatible.

Las tres primeras condiciones solo permiten terminar después del mínimo de interacciones de la banda. La ausencia total de contenido compatible puede cerrar antes y siempre produce confianza baja y `coverage_limited: true`.

El resultado es el nivel más alto validado. Si no se valida A1, el resultado es Pre-A1. Si B1 parece probable pero falta cobertura, se devuelve el nivel validado inferior y se registra `coverage_limited: true`; nunca se infiere un nivel superior sin evidencia.

### Confianza

- `high`: límite validado con pares concordantes y sin limitación de cobertura.
- `medium`: nivel validado mediante desempate o con una única frontera comprobada.
- `low`: final por límite de preguntas, cobertura insuficiente o múltiples sustituciones técnicas.

La confianza se guarda para reporting adulto, pero no se presenta al niño como una puntuación.

## 8. Feedback y aprendizaje durante la calibración

Después de responder:

- se muestra «Respuesta guardada» o equivalente por banda;
- no se usa rojo/verde para revelar rendimiento;
- no se reproduce celebración de acierto ni corrección de error;
- se preserva el foco y se anuncia el avance mediante `aria-live`;
- «No lo sé todavía» aparece como acción secundaria, nunca como abandono.

Al finalizar se pueden mostrar hasta dos elementos realmente vistos:

- una palabra con traducción;
- una estructura con explicación breve;
- una pauta de listening respaldada por audio disponible.

El copy será «Hoy has visto…», no «Ya has aprendido…», porque una sola exposición no demuestra dominio.

## 9. Arquitectura propuesta

- `placement-content.js`: banco versionado y metadatos editoriales.
- `placement-engine.js`: selección, branching, parada, nivel y confianza; módulo UMD testeable en Node.
- `placement-session.js`: borrador local, compatibilidad de versión, reanudación y limpieza tras persistencia.
- `test-nivel.js`: orquestación, accesibilidad y render; no contiene reglas pedagógicas.
- `test-nivel.css`: presentación responsive por `body[data-stage]`.
- `copy-registry.js`: copy estable de onboarding, calibración y resultado por banda.
- `onboarding.html`: consumidor ligero del registro de copy y de la identidad existente.
- `auth.js`: continúa siendo la única puerta para leer/guardar placement remoto y su outbox.

No se introduce bundler ni framework. Los módulos siguen el patrón global/Node existente.

## 10. Persistencia y reanudación

El borrador local incluye:

- usuario normalizado;
- `instrument_id` y versión;
- banda resuelta;
- CEFR semilla;
- IDs de preguntas servidas;
- respuestas codificadas, sin texto libre;
- estado del motor;
- fecha de inicio y última actualización.

La clave está namespaced por usuario. Un borrador de otro usuario, banda o versión nunca se reutiliza. Al reabrir, el alumno continúa en el siguiente paso pendiente y recibe un mensaje breve de continuidad.

Al terminar, `ILAuth.savePlacement` guarda `result_cefr`, instrumento, versión, banda, confianza, fecha y metadatos de cobertura. Si no hay red, el resultado queda en caché/outbox con estado honesto «Guardado en este dispositivo; se sincronizará al recuperar conexión». La primera misión puede continuar con el resultado local, pero nunca se afirma que esté sincronizado.

## 11. Estados y recuperación

- **Loading:** skeleton estable, no spinner indefinido.
- **Audio cargando:** CTA de reproducción ocupado y opciones temporalmente protegidas.
- **Audio fallido:** mensaje no penalizador, reintento y sustitución por otro ítem; no convertir listening en reading medido como listening.
- **Offline:** permitir continuar si todos los recursos necesarios ya están disponibles; en caso contrario guardar y ofrecer reintento.
- **Cobertura insuficiente:** resultado prudente con confianza baja y registro observable.
- **Persistencia pendiente:** continuar con caché/outbox y comunicarlo sin alarma.
- **Borrador incompatible:** descartarlo de forma segura, registrar motivo e iniciar una sesión nueva.
- **Error irrecuperable:** mantener una acción principal «Intentar de nuevo» y una secundaria «Volver».

## 12. Jerarquía visual premium

- Una acción principal por pantalla.
- El contenido evaluado ocupa el centro; progreso, ayuda y salida son secundarios.
- Se usan exclusivamente tokens `--il-*`, componentes, iconos de `layout.js` y visuales funcionales de `il-visual.js`.
- `p12` usa superficies cálidas, mayor escala, imagen dominante y más aire; no añade decoración sin función.
- `p34` conserva calidez con mayor densidad.
- `p56` reduce redondeo y aumenta estructura.
- `eso` elimina recursos infantiles, compacta la composición y prioriza tipografía/contenido.
- El avatar aparece en bienvenida/resultado; Nemo no es omnipresente.
- El avión solo representa el avance entre etapas del recorrido.
- Todas las animaciones respetan `prefers-reduced-motion`.

## 13. Integración futura con familia y crecimiento académico

El placement expone un contrato trazable para el futuro panel familiar:

- nivel inicial aproximado;
- fecha e instrumento;
- confianza y limitación de cobertura;
- origen de la semilla (centro o neutral);
- evolución posterior separada del resultado inicial.

El mundo no crece por completar el test. Empieza a evolucionar cuando existe práctica/aprendizaje real. Así se mantiene la cadena:

`evidencia de aprendizaje → progreso comprensible → hito significativo → cambio visible en el mundo`

## 14. Accesibilidad y responsive

- Teclado completo, foco visible y orden lógico.
- Etiquetas accesibles para audio, progreso y respuestas.
- Estados no dependientes solo de color.
- Contraste WCAG AA.
- Áreas táctiles: 56/52/48/44 px según banda.
- Sin scroll horizontal ni CTA tapado por el selector demo.
- Verificación a 320, 390, 768, 1024 y 1440 px.
- Test con zoom al 200 % y `prefers-reduced-motion`.

## 15. Entregas incrementales

1. Contrato del banco, motor adaptativo puro y tests.
2. Sesión reanudable, persistencia y estados técnicos.
3. Nueva experiencia de calibración y copy por banda.
4. Onboarding conectado, resultado, primera misión y trazabilidad familiar.
5. Accesibilidad, responsive, navegador, suite completa y limpieza de legacy.

Cada entrega actualiza `?v=` de cualquier JS/CSS modificado, mantiene el árbol verde y se guarda en un commit de una sola intención.

## 16. Criterios de aceptación

- Todos los alumnos nuevos pasan por una calibración breve adaptada a su banda.
- La edad cambia modalidad y UI, nunca el techo CEFR.
- La estimación administrativa solo determina la primera sonda.
- En ausencia de estimación válida, todas las bandas parten de A1.
- La dificultad solo se mueve un nivel cada vez.
- Con cobertura suficiente, `p12` completa entre 5 y 7 actividades evaluables; `p34`, entre 6 y 8; `p56/eso`, entre 7 y 9. Una interrupción por falta de contenido se declara limitada y no aparenta precisión.
- «No lo sé todavía» funciona y no usa lenguaje culpabilizador.
- No se revela corrección durante el test.
- Un fallo técnico no cambia nivel ni consume presupuesto evaluable.
- El borrador se reanuda únicamente para el mismo usuario, banda y versión.
- El resultado remoto está versionado; el modo offline declara sincronización pendiente.
- Una calibración nunca altera misión, racha, mastery ni rewards.
- El resultado evita promesas de dominio y enlaza una primera misión compatible.
- Neutral es seguro y observable; no hereda `p56`.
- Las cuatro bandas mantienen su política lingüística y densidad.
- No hay nuevos hex fuera de tokens, emojis de chrome, monedas, cofres ni speaking grabado.
- Toda la suite pasa y la comprobación visual cubre bandas, estados y breakpoints.

## 17. Riesgos controlados

- **Cobertura editorial:** el motor no compensa un banco pobre; el gate y `coverage_limited` impiden aparentar precisión.
- **Sesgo de la semilla:** la exploración puede bajar o subir y el resultado se presenta como revisable.
- **Test demasiado largo:** límites por banda y parada temprana protegen la experiencia.
- **Audio irregular:** los fallos se sustituyen y se registran como técnicos.
- **Doble fuente local/remota:** `auth.js` sigue siendo la puerta canónica; local solo es borrador/caché/outbox.
- **Sobreinfantilización:** contexto y chrome se validan separadamente de la dificultad lingüística.
