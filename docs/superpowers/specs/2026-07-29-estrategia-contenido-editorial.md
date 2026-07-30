# Estrategia de contenido y flujo editorial

**Fecha:** 2026-07-29 · **Estado:** borrador para aprobación.
Base: arquitectura pedagógica, catálogo de actividades y motor, banco de contenido (`plataforma/contenido.js`).

## Principio rector
El contenido **NO vive en el código**. Vive como **datos** (base de datos / CMS) que rellenan las
**plantillas** del motor (P1–P7). El código es fijo y pequeño; el contenido crece sin tocarlo.
Objetivo real: **suficiente contenido, sostenible en el tiempo y con calidad revisada por un profe** —
no "miles de ejercicios" de golpe (eso genera basura y repetición).

---

## 1. El sistema de contenido (las piezas que pides)

| Pieza | Qué es | MVP |
|---|---|---|
| **Base de datos** | Tabla de ejercicios + unidades + objetivos + media, con el esquema común (§1 del catálogo) | ✅ (Supabase, Bloque 6) |
| **Plantillas reutilizables** | Las P1–P7 del motor; el CMS crea rellenando una ficha | ✅ |
| **Panel de contenidos (CMS)** | Formulario para crear/editar/previsualizar/publicar ejercicios | ✅ (Bloque 3, sencillo) |
| **Biblioteca multimedia** | Audios e imágenes con **alt_text** y transcripción, reutilizables entre ejercicios | ✅ básica (subir + reutilizar) |
| **Etiquetas** | habilidad, nivel, unidad, objetivo, tema, dificultad, edad | ✅ |
| **Búsqueda / filtros** | Buscar por etiqueta, texto, estado, objetivo | ✅ básica |
| **Versionado** | `version` + historial de cambios de cada ejercicio | ✅ mínimo (nº de versión + fecha + autor); historial completo → Fase 2 |
| **Estados** | borrador → revisión → publicado → archivado | ✅ |
| **Duplicar actividad** | Clonar un ejercicio como plantilla de partida | ✅ (clave para producir rápido) |
| **Importación masiva** | Cargar muchos ejercicios de una hoja/CSV cuando compensa | ⏳ Fase 2 (útil solo cuando ya hay volumen) |

> **Crítica honesta:** la importación masiva **no** es MVP. Importar en bloque sin revisar es la vía
> rápida a publicar contenido malo para menores. Primero calidad y flujo; el volumen viene después.

---

## 2. Cuánto contenido mínimo necesita el MVP

El MVP no necesita "mucho", necesita **lo justo para sostener una racha diaria varias semanas sin repetir
demasiado**. Cálculo realista:

- Sesión diaria ≈ **5–8 ejercicios**.
- Para que 5 días/semana no se noten repetidos, cada objetivo necesita **3–5 ejercicios distintos** (misma
  meta, distinta forma/plantilla → así "Dominado" se gana con evidencia variada, no memorizando una pantalla).

**Meta MVP:**
- **1 nivel** (ver §4) · **6–8 unidades** · **~4 objetivos por unidad** · **~4 ejercicios por objetivo**
- ≈ **6–8 unidades × 4 × 4 = 100–130 ejercicios publicados**.

Con eso hay **material para las primeras semanas** y margen para que el motor no repita. Es una cantidad
que **un profe puede revisar** (con borradores generados por IA como ayuda interna, ver §10).

## 3. Cuántas semanas de práctica debe cubrir el MVP
- **Objetivo: 6–8 semanas** de práctica diaria sin agotar el contenido ni caer en repetición molesta.
- Motivo: es el tiempo suficiente para **validar el hábito** (¿las familias vuelven cada día?) y el piloto,
  antes de invertir en producir el catálogo grande. Si a las 6 semanas el hábito no se sostiene, el problema
  no es el contenido — es el producto, y mejor saberlo barato.

## 4. Qué nivel/curso lanzar primero
**Lanzar 1 solo nivel primero**, no todo Primaria+ESO a la vez.
- **Recomendado: 3.º–4.º de Primaria (A1).** Motivo: ya leen algo (menos dependencia de audio que 1.º–2.º),
  edad con mucha extraescolar, y las plantillas P1/P3/P5/P6/P7 encajan de lleno. Es el punto de **máxima
  cobertura con mínimo esfuerzo de producción**.
- 1.º–2.º (Pre-A1, casi todo audio) y ESO (A2–B1) → **fases siguientes**, cuando el flujo editorial ya rueda.

## 5. Qué habilidades priorizar
Orden ya fijado en la arquitectura pedagógica:
**Vocabulary → Listening → Reading → Grammar → algo de Everyday English.**
- Writing (breve) → Fase 2 (necesita revisión de profe, P8).
- Pronunciation / Speaking → Fase 3 (voz de menores, consentimiento, P9).

## 6. Cómo ampliar el catálogo cada mes (ritmo sostenible)
- **Cadencia:** publicar **1–2 unidades nuevas al mes** (≈ 30–60 ejercicios/mes revisados). Ritmo que un
  profe sostiene sin bajar la calidad.
- **Cómo:** IA genera **borradores** por objetivo → profe revisa/edita/aprueba → publicar. Reutilizar la
  **biblioteca multimedia** existente reduce mucho el trabajo.
- **Prioridad de qué producir:** lo guía el uso real — objetivos donde los alumnos **se atascan** o donde
  **se acaba el material** primero (el sistema lo señala, §8).

## 7. Cómo evitar la repetición
- **Varias plantillas por objetivo:** el mismo can-do se practica con P1, luego P5, luego P6… no la misma
  pantalla cuatro veces.
- **El motor no repite:** prioriza ejercicios **no vistos recientemente** para ese alumno; un ejercicio
  acertado y "dominado" reaparece **espaciado** (1·3·7·16 días), no al día siguiente.
- **Variantes de datos:** una plantilla + distintos datos (distinto vocabulario, distinta frase) = ejercicios
  que no "parecen iguales" (ver §9).
- **Aviso de duplicado en el CMS:** al crear, avisa si ya existe un ejercicio muy parecido (mismo objetivo +
  mismas respuestas). *(MVP: aviso simple por etiquetas; detección fina → Fase 2.)*

## 8. Cómo detectar contenido desactualizado o defectuoso
El propio uso genera señales; el CMS las muestra como **alertas de calidad**:
- **Tasa de acierto anómala:** ejercicio que **casi todos fallan** (¿mal diseñado / respuesta correcta mal
  marcada?) o que **todos aciertan a la primera** (demasiado fácil / pista evidente).
- **Muchos reintentos / abandono** en un ejercicio concreto → revisar consigna o dificultad.
- **Reportes:** botón discreto "algo va mal aquí" para profe (y opcional alumno) → cola de revisión.
- **Antigüedad:** ejercicios sin tocar hace mucho o con media/enlaces rotos → marcar para repasar.
- **Media huérfana o sin alt/transcripción:** la biblioteca marca lo incompleto.
→ Lo dudoso pasa a **revisión** o **archivado**, no se borra (el versionado conserva el historial).

## 9. Cómo reutilizar una plantilla sin que todo parezca igual
La plantilla es el **esqueleto**; la variedad está en los **datos** y en la **mezcla**:
- **Distintos datos:** vocabulario, frases, imágenes y audios distintos por ejercicio.
- **Rotar la plantilla dentro del objetivo:** reconocer (P1) → producir (P5/P6) → aplicar (P7).
- **Contextos variados:** el mismo punto gramatical en la escuela, en casa, de viaje (Everyday English).
- **Distintos formatos de estímulo:** a veces imagen, a veces audio, a veces texto breve.
- **Feedback y micro-narrativa** con variedad (mensajes, ilustración) → cuando llegue el personaje de
  Interlanguage, aporta el "hilo" que une sesiones sin cambiar las plantillas.

## 10. IA como ayuda interna, sin publicar automáticamente para menores
**Regla dura:** la IA **nunca publica**. Solo produce **borradores internos** que un humano revisa y aprueba.
- **Dónde ayuda la IA:** redactar borradores de ejercicios por objetivo, proponer distractores plausibles,
  generar variantes, sugerir alt_text y transcripciones, detectar posibles duplicados.
- **Dónde NO decide sola:** nada llega a un menor sin **revisión pedagógica humana**. El estado de un borrador
  generado por IA entra siempre como **borrador → revisión**, nunca directo a publicado.
- **Trazabilidad:** marcar qué se generó con ayuda de IA y quién lo aprobó.
- **Privacidad:** no meter datos personales de alumnos en prompts de IA.

---

## Flujo editorial (los 6 pasos que pides)

```
Creación → Revisión pedagógica → Revisión visual → Publicación → Seguimiento → Actualización
```

| Paso | Quién | Qué se comprueba | Estado |
|---|---|---|---|
| **1. Creación** | Profe (con borrador IA opcional) | Objetivo claro, plantilla adecuada, datos completos | `borrador` |
| **2. Revisión pedagógica** | Profe revisor | Correcto para la edad/nivel, respuesta bien marcada, explicación útil, pistas progresivas, prerrequisitos | `revisión` |
| **3. Revisión visual/UX** | Profe/responsable | Imagen y audio correctos, **alt_text + transcripción**, legible, accesible, se ve bien en móvil | `revisión` |
| **4. Publicación** | Responsable | Etiquetas y objetivo asignados, se asigna versión | `publicado` |
| **5. Seguimiento** | Sistema + profe | Alertas de calidad (§8): acierto anómalo, reportes, abandono | (queda publicado / a revisar) |
| **6. Actualización** | Profe | Corrige/mejora → **nueva versión**; lo obsoleto → `archivado` (no se borra) | `publicado` v+1 / `archivado` |

**En el MVP** los roles pueden recaer en **la misma persona** (un profe hace creación + ambas revisiones);
lo importante es que los **pasos** existan como checklist, aunque los haga una sola persona. Separar roles →
cuando crezca el equipo.

---

## Estructura inicial de unidades (MVP · 3.º–4.º Primaria, A1)

Propuesta de **8 unidades** temáticas, con ~4 objetivos can-do cada una (ejemplo de la unidad 1 desarrollado):

| # | Unidad | Habilidades foco | Objetivos (can-do) de ejemplo |
|---|---|---|---|
| 1 | **Sobre mí** (nombre, edad, país) | Vocab · Listening | "Sé presentarme y decir mi edad" |
| 2 | **Mi rutina diaria** | Grammar · Vocab · Reading | "Sé decir a qué hora hago las cosas" |
| 3 | **La comida** | Vocab · Everyday | "Sé pedir y decir lo que me gusta comer" |
| 4 | **Mi familia y mi casa** | Vocab · Reading | "Sé describir a mi familia y mi casa" |
| 5 | **El colegio** | Vocab · Listening | "Sé hablar de asignaturas y objetos de clase" |
| 6 | **Los animales** | Vocab · Reading | "Sé describir animales (have got / can)" |
| 7 | **El tiempo y la ropa** | Vocab · Grammar | "Sé decir qué tiempo hace y qué ropa llevo" |
| 8 | **Mis planes y aficiones** | Grammar · Everyday | "Sé decir lo que me gusta hacer y mis planes" |

Unidad 1 desglosada (patrón para las demás):
- **Obj 1.1** "Digo mi nombre y edad" — P1 (escuchar y elegir), P5 (formar frase), P3 (emparejar), P7 (mini-diálogo).
- **Obj 1.2** "Digo de dónde soy" — P1, P6 (hueco: *I'm from ___*), P3 (país↔bandera).
- **Obj 1.3** "Saludos y despedidas" — P3, P1 (audio), P7 (diálogo breve).
- **Obj 1.4** "Los números 1–20" — P1 (audio), P5 (ordenar), P6 (hueco).

(Las unidades 2 y 3 ya tienen semilla en `plataforma/contenido.js`.)

---

## Qué entra en el MVP y qué se pospone

| Elemento | MVP | Fase posterior |
|---|---|---|
| BD + plantillas + CMS con estados | ✅ | — |
| Duplicar, etiquetas, búsqueda/filtros básicos | ✅ | — |
| Biblioteca multimedia (subir + reutilizar + alt/transcripción) | ✅ básica | gestión avanzada, licencias |
| Versionado | ✅ mínimo | historial completo / diff |
| Alertas de calidad por uso | ✅ básicas | analítica fina, detección de duplicados |
| Importación masiva (CSV) | — | ✅ cuando haya volumen |
| Flujo editorial con roles separados | checklist, 1 persona | roles separados al crecer |
| IA como ayuda interna (borradores) | ✅ (nunca autopublica) | plantillas de prompts, más asistencia |

---

### Próximo paso
Con esto quedan definidos el **contenido mínimo del MVP** (~6–8 unidades / 100–130 ejercicios, 1 nivel,
6–8 semanas) y el **flujo editorial**. Alimenta directamente el **Bloque 3 (CMS)** y el **Bloque 7
(contenido inicial + piloto)**. Falta tu visto bueno para fijarlo.
