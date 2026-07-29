# Catálogo de actividades y motor reutilizable de ejercicios

**Fecha:** 2026-07-29 · **Estado:** borrador para aprobación.
Base: arquitectura pedagógica y banco de contenido (`plataforma/contenido.js`).

## Idea central (para no programar una pantalla por actividad)
Las ~24 actividades de la lista **no son 24 programas distintos**. Se reducen a un puñado de
**PLANTILLAS BASE** (formas de interacción). Cada "actividad" (relacionar, cloze, ordenar…) es una
**plantilla base + datos**. Un **único motor** lee los datos y la muestra. Crear una actividad nueva =
rellenar una ficha, **nunca programar**.

---

## 1. Esquema de contenido común (lo tiene CUALQUIER ejercicio)

| Campo | Qué es |
|---|---|
| `id` | Identificador único |
| `plantilla` | Cuál de las plantillas base usa (ver §3) |
| `habilidad` | vocabulary / listening / reading / grammar / writing / speaking / everyday |
| `nivel` · `cefr` | Nivel real + referencia CEFR (Pre-A1…B2) |
| `edad` | [min, max] recomendada |
| `unidad_id` · `objetivo_id` | Enlaza con la taxonomía (unidad y objetivo can-do) |
| `dificultad` | 1–5 dentro del nivel |
| `instruccion` | Consigna en pantalla |
| `instruccion_audio` | (opcional) la consigna leída en voz alta — clave para 6–8 años |
| `estimulo` | Texto / imagen / audio de apoyo, si la actividad lo necesita |
| `datos` | La carga específica de la plantilla (opciones, parejas, huecos…) |
| `respuesta_correcta` | La(s) solución(es) |
| `respuestas_alternativas` | Otras respuestas que también se aceptan (sinónimos, may/minúsculas…) |
| `explicacion` | Se muestra al fallar (y opcional al acertar) |
| `pistas` | Lista de pistas **progresivas** (de suave a clara) |
| `max_intentos` | Nº de intentos antes de mostrar la solución (o "ilimitado con reintento") |
| `feedback` | Config: mensaje de acierto/error, sonido opcional, animación discreta |
| `media` | audio_url · imagen_url · **alt_text** (texto alternativo) · transcripción |
| `accesibilidad` | Alt de imágenes, transcripción de audios, no depender solo del color, foco visible |
| `estado` | borrador → revisión → publicado → archivado |
| `etiquetas` · `version` | Para búsqueda/reutilización y control de cambios |

**Reglas comunes a todas las plantillas** (se definen una vez):
- **Feedback:** acierto → mensaje breve + color verde + sonido opcional; error → marca **suave** (no rojo
  agresivo) + explicación + **reintentar**. Nunca "suspenso".
- **Intentos:** por defecto **reintento hasta acertar**, pero el motor **registra en qué intento acertó**
  y **si usó pistas** (esto alimenta el dominio real).
- **Criterio de finalización:** *completada* = llegó al final; *correcta* = acertó dentro de los intentos;
  se guarda la diferencia (completar ≠ acertar).
- **Accesibilidad:** navegable por teclado, foco visible, objetivos táctiles grandes, textos alternativos,
  transcripción de audios, y **nunca** información transmitida solo por color.
- **Móvil (mobile-first):** todo a pantalla completa, botones grandes, sin depender de "hover", audio con
  botón visible; el teclado no tapa los controles.
- **Cómo registra el progreso:** cada intento emite un **evento** `{ejercicio_id, objetivo_id, resultado
  (correcto/incorrecto), intento_nº, pista_usada, tiempo, timestamp, tipo_recuperación}`. Ese evento
  alimenta el **modelo de dominio** (doc pedagógico): *producir* (rellenar/ordenar/hablar) pesa más que
  *reconocer* (elegir), y el acierto **espaciado** es lo que lleva a "Dominado".

---

## 2. Las PLANTILLAS BASE (el motor reutilizable)

*(Campos por plantilla: datos necesarios · instrucción · respuesta correcta · alternativas · explicación ·
pistas · intentos · feedback · criterio · accesibilidad · audio/imagen · móvil · progreso. Los que son
comunes se rigen por las "reglas comunes" de arriba; abajo se detalla lo específico.)*

### P1 · Selección única *(elegir 1)* — MVP ✅
- **Datos:** enunciado + **opciones** (texto y/o imagen/emoji), marcando la correcta.
- **Respuesta correcta / alternativas:** una opción correcta; alternativas = opciones equivalentes aceptadas.
- **Pistas:** descartar una opción errónea; resaltar palabra clave.
- **Específico:** el estímulo puede ser texto, **imagen** o **audio** (así cubre "escuchar y elegir").
- **Progreso:** *reconocimiento* (pesa medio).

### P2 · Selección múltiple *(elegir varias)* — MVP ✅ (uso ligero)
- **Datos:** opciones con **varias** correctas.
- **Criterio:** correcto si marca todas las correctas y ninguna incorrecta.
- **Pistas:** "hay N correctas".

### P3 · Emparejar *(unir parejas / memory)* — MVP ✅
- **Datos:** lista de **parejas** (imagen↔palabra, palabra↔palabra, pregunta↔respuesta).
- **Modo memory:** mismas parejas con cartas boca abajo.
- **Respuesta:** todas las parejas correctas. **Alternativas:** sinónimos aceptados por pareja.
- **Cubre:** relacionar imagen-palabra, leer y relacionar, memory.
- **Progreso:** reconocimiento (memory añade memoria de trabajo).

### P4 · Clasificar *(arrastrar a grupos)* — MVP ✅
- **Datos:** **elementos** + **grupos/categorías** con la asignación correcta.
- **Cubre:** clasificar vocabulario (p. ej. "comida" vs "animales").
- **Móvil:** arrastrar con dedo o **tocar-elemento-luego-grupo** (alternativa accesible al drag).

### P5 · Ordenar *(colocar en orden)* — MVP ✅
- **Datos:** **fichas** desordenadas + el **orden correcto**.
- **Cubre:** ordenar letras (letras→palabra), formar frases, ordenar palabras/frases.
- **Alternativas:** varios órdenes válidos si los hay.
- **Progreso:** **producción** (pesa alto).

### P6 · Rellenar huecos *(escribir)* — MVP ✅
- **Datos:** texto con **huecos** + solución por hueco.
- **Respuestas alternativas:** por hueco, con **validación tolerante** (ignora mayúsculas/tildes/espacios,
  acepta sinónimos). Opción de "banco de palabras" para los más pequeños.
- **Cubre:** completar palabras, cloze, transformaciones gramaticales, vocabulario en contexto,
  completar diálogos, corrección de errores (reescribir).
- **Progreso:** **producción** (pesa alto).

### P7 · Comprensión *(estímulo + subpreguntas)* — MVP ✅ (lectura/audio breve)
- **Datos:** un **estímulo** (texto, **audio** o historia breve) + un conjunto de **subpreguntas**
  que reutilizan P1/P2/P6.
- **Cubre:** reading/listening comprehension, historias breves, diálogos, situaciones reales,
  preparación para estudiar fuera (es **contenido**, no plantilla nueva).
- **Accesibilidad:** transcripción del audio; texto con buen contraste y tipografía legible.
- **Criterio:** % de subpreguntas correctas.

### P8 · Escritura libre breve — Fase 2
- **Datos:** consigna + criterios/rúbrica sencilla + (opcional) modelo de referencia.
- **Corrección:** **no automática con nota**; autoevaluación guiada o **revisión de profe**. Nunca
  "corregir" a un menor con IA sin supervisión.
- **Cubre:** escritura breve, escritura guiada.

### P9 · Hablar *(pronunciación / speaking prompt)* — Fase 3
- **Datos:** frase/consigna + (opcional) audio modelo.
- **MVP/interino:** "escucha y repite" **sin grabar ni evaluar** (motivador, auto-marca "hecho").
- **Fase 3:** grabación/evaluación con consentimiento específico; audio **temporal**, sin almacenar por defecto.
- **Cubre:** pronunciación guiada, speaking prompts.

---

## 3. Mapa: tus actividades → plantilla base

| Actividad (tu lista) | Plantilla base | Notas |
|---|---|---|
| Relacionar imagen y palabra | P3 Emparejar (o P1) | imagen↔palabra |
| Escuchar y elegir | P1 Selección única | estímulo = audio |
| Ordenar letras | P5 Ordenar | fichas = letras |
| Completar palabras | P6 Rellenar | 1 hueco + banco de palabras |
| Clasificar vocabulario | P4 Clasificar | grupos temáticos |
| Arrastrar y soltar | *(mecánica de entrada)* | es la forma de interactuar en P3/P4/P5, no una plantilla aparte |
| Memory | P3 Emparejar | modo cartas boca abajo |
| Formar frases | P5 Ordenar | fichas = palabras |
| Leer y relacionar | P3 Emparejar | texto↔texto/imagen |
| Historias breves | P7 Comprensión | estímulo = historia |
| Completar diálogos | P6 Rellenar / P7 | huecos dentro de un diálogo |
| Pronunciación guiada | P9 Hablar | Fase 3 (interino: escuchar y repetir) |
| Escritura breve | P8 Escritura libre | Fase 2 |
| Listening comprehension | P7 Comprensión | estímulo = audio |
| Reading comprehension | P7 Comprensión | estímulo = texto |
| Cloze | P6 Rellenar | varios huecos |
| Ordenar frases | P5 Ordenar | fichas = frases |
| Transformaciones gramaticales | P6 Rellenar | reescribir con validación |
| Corrección de errores | P1 / P6 | elegir el error o reescribirlo |
| Vocabulario en contexto | P1 / P6 | opción o hueco en frase |
| Escritura guiada | P8 Escritura libre | Fase 2 |
| Situaciones reales | P7 Comprensión | diálogo/escenario (Everyday English) |
| Speaking prompts | P9 Hablar | Fase 3 |
| Preparación estudiar fuera | P7 (contenido) | situaciones reales de viaje; sin plantilla nueva |

**Conclusión:** con **7 plantillas** (P1–P7) se cubre **todo el MVP de Primaria y casi todo ESO**.
P8 (escritura) y P9 (hablar) llegan en fases posteriores. Añadir una actividad nueva **nunca** requiere
programar una pantalla: es rellenar datos de una plantilla existente.

---

## 4. El motor (cómo funciona, sin código todavía)
- **Registro de plantillas:** el motor conoce P1…P9; cada una sabe **pintarse**, **validar** y **dar feedback**.
- **Renderizado por datos:** recibe un ejercicio (esquema común §1), mira su `plantilla` y lo muestra.
- **Ciclo:** mostrar → el alumno responde → **Comprobar** → validar (con alternativas/tolerancia) →
  feedback + explicación → (reintentar o continuar) → **emitir evento de progreso**.
- **Separación limpia:** el **contenido** (datos) vive en la base de datos / CMS; el **motor** (código) es
  fijo y pequeño. Cambiar contenido no toca el código, y añadir una plantilla nueva (rara vez) es aislado.

## 5. Qué entra en el MVP
- **Plantillas:** P1, P3, P5, P6 y P7 primero (cubren la mayoría de Primaria); P2 y P4 enseguida.
- **Fase 2:** P8 (escritura con revisión). **Fase 3:** P9 (hablar/pronunciación con consentimiento).
- Validación tolerante, pistas progresivas, accesibilidad y registro de progreso: **desde el MVP**.

---

### Próximo paso
Si apruebas el catálogo y el motor, esto define **cómo se construye el Bloque 2** (motor que lee del banco)
y **cómo el CMS** (Bloque 3) crea ejercicios rellenando plantillas.
