# Banco y mecánicas · entrega del 12 de septiembre de 2026

## Inventario antes / después

| Unidad | Antes | Después | Incorporaciones |
|---|---:|---:|---|
| Primer vuelo | 30 | 39 | Imagen→palabra, palabra→imagen, ordenación oral simple, spelling, letras, clasificación, lectura, diálogo, repetición |
| Rutina diaria | 30 | 38 | Recall, spelling, clasificación, hueco escrito, diálogo, dictado, escritura, lectura |
| La comida | 26 | 35 | Imagen→palabra, palabra→imagen, ordenación simple, clasificación, repetición, spelling, diálogo, dictado, escritura |
| Gramática inicial | 12 | 20 | Matching, ordenación oral, repetición, hueco escrito, recall, letras, clasificación, palabra→imagen |
| Gramática media | 12 | 19 | Hueco escrito, recall, clasificación, diálogo, dictado, lectura, escritura |
| Gramática ESO | 12 | 19 | Transformación mediante recall, hueco, clasificación, diálogo, dictado, escritura, repetición |
| Future plans | 31 | 39 | Recall, hueco, diálogo, letras, clasificación, dictado, escritura, repetición |
| **Total** | **153** | **209** | **56 actividades editadas; no generación combinatoria** |

Antes había siete tipos renderizados. Clasificación figuraba en el esquema, sin renderer.
110 de los 153 ejercicios eran `elegir_imagen`/`elegir_texto`; algunos `completar` también tenían opciones.
Ahora hay 16 mecánicas en un catálogo reutilizable. Se conserva el contenido histórico y sus IDs; la selección de las misiones deja de reproducir la proporción del banco.
La selección textual histórica conserva su renderer y se integra en la familia de completar/elegir. El compositor cuenta **cualquier ejercicio con opciones como reconocimiento**, aunque pertenezca a una familia que también admita respuesta escrita.

## Matriz de interacción permitida

La tabla expresa soporte del motor. Cada ejercicio necesita además una declaración editorial de edad y CEFR; una fila permitida no implica que cualquier contenido sea adecuado para esa edad.

| Mecánica | 5–7 | 8–9 | 10–11 | ESO | Base estimada |
|---|:---:|:---:|:---:|:---:|---:|
| Listen → image | Sí | Sí | Sí | Sí | 35 s |
| Listen → text | — | Sí | Sí | Sí | 40 s |
| Image → word | Sí | Sí | Sí | Sí | 40 s |
| Word → image | Sí | Sí | Sí | Sí | 35 s |
| Matching | Sí | Sí | Sí | Sí | 65 s |
| Sentence ordering | Con audio y ≤3 fichas | Sí | Sí | Sí | 60 s |
| Word ordering (letras) | — | Sí | Sí | Sí | 50 s |
| Gap fill | — | Sí | Sí | Sí | 55 s |
| Guided spelling | — | Sí | Sí | Sí | 55 s |
| Typing / recall | — | Sí | Sí | Sí | 50 s |
| Classification | Visual, ≤2 grupos | Sí | Sí | Sí | 75 s |
| Short reading | — | ≤60 palabras | Sí | Sí | 100 s |
| Dialogue completion | — | Sí | Sí | Sí | 80 s |
| Speaking / repeat | Sí | Sí | Sí | Sí | 60 s |
| Dictation | — | — | Sí | Sí | 70 s |
| Guided writing | — | — | Sí | Sí | 140 s |

Multiplicadores estimativos: 1,25 para 5–7 y 1,10 para 8–9. Los valores son previsiones editoriales, no duraciones observadas ni una promesa de tiempo exacto. Cada ejercicio puede declarar su propio `estimated_seconds`.
El modo neutral usa imagen/palabra, matching y ordenación conservadora; no deduce una edad que no conoce.

## Composición de la misión

`content/mechanics.js` define familias, tiempos y compatibilidad. `motor/session-composer.js` es puro y determinista por alumno/día. `mission-state.js` lo utiliza al crear una nueva misión temática; Inicio y Lección recuperan la misma selección persistida.

Prioridades: quick win → repaso vencido disponible/core → core → retrieval → production → stretch. Después alterna según el tiempo restante y busca un cierre accesible. No reserva siete casillas ni añade una actividad ficticia para terminar: el resumen cierra la sesión.

- Máximo **tres actividades de reconocimiento** por misión.
- Máximo **dos de la misma mecánica**, sin duplicar IDs.
- Penaliza repetir modalidad consecutivamente y variantes del mismo grupo.
- Prefiere ítems menos recientes entre alternativas; cambia la selección con la semilla del día.
- El repaso vencido dentro del contenido compatible recibe prioridad fuerte.
- Respeta la edad y el nivel objetivo; permite como máximo un escalón CEFR adicional como alternativa de reto.
- Preserva las sesiones ya creadas para que una actualización no cambie las respuestas ni el punto de reanudación de hoy.
- Si no hay material suficiente, devuelve `underTarget` y `missingModes`; no repite ejercicios ni inventa contenido para rellenar tiempo.

Objetivos: **6–8 / 8–10 / 10–12 / 10–15 minutos**, respectivamente. Inicio muestra la suma estimada de los ejercicios realmente seleccionados. En las pruebas de 20 semillas por unidad y banda, todas las unidades alcanzan su intervalo objetivo, incluyen recuperación y producción y respetan ambos límites de repetición.

## Edición y publicación

`content/authoring.js` valida los datos originales **antes** de normalizarlos. El loader y el CMS bloquean el pack si falla la validación. No se puede ocultar un campo ausente con un valor por defecto.

Se exigen instrucción, respuesta evaluable (o modelo/rúbrica para práctica abierta), pista, explicación, skill, CEFR, edades compatibles, dificultad 1–5 y tiempo 10–600 segundos. Se comprueban opciones con una única respuesta correcta, fichas de ordenación, parejas, categorías, preguntas de lectura, audio requerido, pauta de spelling y turnos de diálogo. El esquema conserva validación de IDs, referencias, rangos de edad y plantillas.

El CMS tiene campos explícitos de dificultad, tiempo, edad, pista y audio. La importación JSON permite editar las mecánicas avanzadas sin crear 16 formularios separados. Una validación fallida no guarda el ejercicio en el banco.

## Evaluación honesta

Recall, huecos, dictados y diálogos de respuesta acotada admiten `accepted_answers`. Mayúsculas y puntuación no esencial se normalizan. No hay corrección semántica libre ni puntuación de pronunciación.

La práctica oral exige escuchar y confirmar la repetición. La escritura guiada exige un texto mínimo y revisar una rúbrica, con un modelo consultable. Se registran como `assessment: self_report`: conservan texto/intentos/tiempo y completan la actividad, pero no inventan aciertos, errores, expresiones dominadas ni mastery. El servidor guarda esta distinción en `response.assessment`; el resultado no evaluado se transporta como `skipped`, sin marcar fallo técnico. Los resúmenes usan solo actividades evaluables para el denominador de aciertos.

Las opciones, fichas y elementos para clasificar se presentan con orden variable; las preguntas de lectura también barajan sus opciones. Las variantes editoriales mantienen un objetivo común y ejemplos/contextos concretos; no se fabrican distractores aleatorios que puedan introducir respuestas ambiguas.

## Ejemplos reales incluidos

| Mecánica | ID | Ejemplo |
|---|---|---|
| Listen → image | `pv-1` | Escuchar “book” y elegir la ilustración |
| Listen → text | `pv-3` | Escuchar “Good morning” y reconocer su significado |
| Image → word | `school-name-chair` | Ver una silla y elegir “chair” |
| Word → image | `school-find-bag` | Leer “school bag” y buscar la imagen |
| Matching | `pv-4` | Relacionar book/pencil/school bag con dibujos |
| Sentence ordering | `school-build-greeting` | Construir “I am Sam.” con apoyo oral |
| Word ordering | `school-order-pencil` | Formar pencil con letras |
| Gap fill | `routine-gap-does` | “She ___ to school at eight. (go)” → goes |
| Spelling | `school-spell-book` | Imagen de libro y pauta b _ _ k |
| Recall | `routine-recall-breakfast` | Recuperar breakfast sin opciones |
| Classification | `food-sort-fruit` | Agrupar apple/banana/milk |
| Reading | `school-read-desk` | Encontrar dónde está la mochila de Tom |
| Dialogue | `routine-dialogue-time` | “I get up ___ seven.” → at |
| Speaking | `school-repeat-help` | Repetir “Help me, please.” |
| Dictation | `routine-dictation-evening` | Escribir “I do my homework after school.” |
| Guided writing | `plans-write-message` | Invitar a un amigo con lugar y hora |

## Verificación

- Suite Node completa: 46 archivos de tests.
- Tests nuevos: authoring, compositor y autoevaluación sin falsas métricas.
- Migración: 25 fingerprints editoriales históricos conservados.
- Navegador: `scripts/qa-mechanics.cjs` responde correctamente un ejemplo real de cada mecánica, registra intentos y comprueba ausencia de errores JS.
- Responsive: 1440×900, 1280×800, 1024×768, 820×1180, 768×1024, 390×844 y 320×740, con las cuatro bandas y las nuevas familias compatibles; sin desbordamiento horizontal.
- Controles nativos de botones, escritura, selects y checkboxes; etiquetas visibles, foco y targets por banda; escritura libre no secuestra Enter.
- El test de repetición simula los callbacks del sintetizador para ser determinista: no equivale a una escucha humana en dispositivos reales. Se conserva el mecanismo de audio editorial con TTS como fallback.
- Smoke de Inicio, Practicar y Lección: 209 ejercicios cargados y cero errores del loader.

Capturas locales de revisión: `/tmp/il-school-spell-book.png`, `/tmp/il-food-sort-fruit.png`, `/tmp/il-plans-write-message.png`, `/tmp/il-routine-dialogue-time.png`.

No se ha desplegado ni publicado una nueva versión remota durante este trabajo.
