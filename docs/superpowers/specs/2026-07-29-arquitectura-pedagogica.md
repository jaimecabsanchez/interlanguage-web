# Arquitectura pedagógica · Plataforma Interlanguage

**Fecha:** 2026-07-29 · **Estado:** borrador para aprobación.
Base: diseño del MVP, roles y experiencia del alumno (mismos docs de 2026-07-29).

**Principio rector:** no una biblioteca desordenada de ejercicios, sino una **progresión coherente**.
Cada actividad tiene un sitio (nivel, unidad, habilidad, objetivo) y unos prerrequisitos, y el
sistema decide **qué toca a cada alumno** en función de su evidencia real de aprendizaje.

*Nota de alcance:* aquí se define el modelo **completo** (el objetivo). Se marca qué entra en el
**MVP** (versión simple) y qué llega en fases posteriores.

---

## 1. Taxonomía del contenido (la jerarquía)

| Nivel de la jerarquía | Qué es | Ejemplo |
|---|---|---|
| **Etapa** | Tramo educativo | Primaria |
| **Curso** | Curso escolar (referencia, no destino) | 4.º de Primaria |
| **Nivel real** | El nivel del alumno, **independiente del curso** (dos de 4.º pueden estar en niveles distintos) | "Explorer 2" |
| **CEFR** | Referencia interna del Marco Común Europeo | A1 |
| **Unidad** | Bloque temático | "Mi rutina diaria" |
| **Tema** | Subtema dentro de la unidad | "Las horas" |
| **Habilidad** | Destreza que trabaja | Grammar |
| **Objetivo pedagógico** | Lo que el alumno "sabe hacer" (can-do) | "Sé decir a qué hora hago las cosas" |
| **Dificultad** | 1–5 **dentro de su nivel** | 2 |
| **Prerrequisitos** | Objetivos/unidades que deben estar al menos "practicando" antes | Vocabulario de rutinas + las horas |
| **Estado de dominio** | Por **alumno × objetivo/ítem** (ver §4) | Practicando |

> Clave: el **objetivo pedagógico** (can-do) es la unidad real de aprendizaje. Un ejercicio es solo
> una forma de practicar y evidenciar un objetivo. Así medimos "sabe hacer X", no "hizo el ejercicio Y".

## 2. Habilidades

Vocabulary · Listening · Reading · Grammar · Writing · Pronunciation · Speaking · **Everyday English**
(inglés real de situaciones cotidianas) · **Study-abroad readiness** (para niveles mayores: aeropuerto,
alojamiento, pedir en un sitio, etc.).

**En el MVP (Primaria):** Vocabulary, Listening, Reading, Grammar y algo de Everyday English.
Writing (breve), Pronunciation y Speaking → fases posteriores (Speaking es Fase 3 por la voz de menores).
Study-abroad readiness → cuando se añada ESO.

## 3. Diferenciación de conceptos (importante)

No es lo mismo, y la plataforma los mide por separado:

| Concepto | Qué significa | Qué NO demuestra |
|---|---|---|
| **Actividad completada** | Llegó al final de la actividad | Que acertara ni que aprendiera |
| **Respuesta correcta** | Acertó un ítem **una vez** | Que lo recuerde mañana (pudo ser suerte/memoria corta) |
| **Constancia** | Con qué frecuencia practica (días/semana) | Que domine el contenido (es hábito) |
| **Mejora** | Su rendimiento sube con el tiempo (menos intentos, más aciertos, más rápido) | Dominio pleno, pero es buena señal |
| **Dominio real** | Acierta de forma **consistente, espaciada en el tiempo y produciendo** (no solo reconociendo) | — es lo que de verdad significa "lo aprendió" |

Los informes a familias/profes usan sobre todo **constancia**, **mejora** y **dominio real** —
nunca una "nota sobre 10".

## 4. Estados de dominio y cómo se pasa de uno a otro

Estados por **alumno × objetivo**: `Nuevo · Practicando · Casi dominado · Dominado · Necesita repaso`.

**No se decide por una nota ni por un único intento.** Se acumula **evidencia** a lo largo del tiempo:
- Cada **acierto** suma evidencia; cada **fallo** resta (pero **resta menos** de lo que suma un acierto →
  no se castiga en exceso).
- Cuenta el **espaciado**: aciertos en **días distintos** valen más que muchos aciertos en la misma
  sesión (evita el "me lo sé ahora mismo" que se olvida mañana).
- Cuenta la **recuperación activa**: acertar produciendo (rellenar, ordenar, decir) pesa más que solo
  reconocer entre opciones.

**Transiciones (umbrales de ejemplo, configurables):**

| De → A | Condición ejemplo |
|---|---|
| Nuevo → Practicando | Primer intento realizado |
| Practicando → Casi dominado | ≥ 2 aciertos recientes, los últimos correctos (aún en 1–2 sesiones) |
| Casi dominado → **Dominado** | ≥ 3 aciertos en **≥ 2 días distintos** y los 2 últimos correctos (evidencia **espaciada**) |
| Dominado → **Necesita repaso** | Pasa su tiempo de repaso sin practicar (olvido), **o** falla al reencontrarlo |
| Necesita repaso → Dominado | Vuelve a acertar de forma espaciada |
| Cualquiera → Practicando | Tras varios fallos, **baja** para reforzar (nunca "suspende") |

Así, "Dominado" siempre implica **acertar repetido, espaciado en el tiempo y recuperando** — no un
golpe de suerte.

## 5. Los 8 mecanismos

1. **Sesión diaria.** El sistema **compone** la sesión mezclando: (a) lo que "toca repasar" hoy,
   (b) errores pendientes, (c) práctica de lo "practicando/casi dominado" y (d) **1 concepto nuevo** si
   los prerrequisitos están cubiertos. Estructura: calentamiento → nuevo → práctica → mini-reto → cierre.
   Duración por edad (5–10 / 8–12 / 10–15 min).
2. **Repetición espaciada.** Cada objetivo tiene una **próxima fecha de repaso** que se **aleja** al
   acertar (p. ej. 1 → 3 → 7 → 16 días) y se **acerca** al fallar. Cada día se prioriza lo que "vence" hoy.
   *(MVP: intervalos simples; Fase 2: ajuste fino.)*
3. **Repaso de errores.** Cada fallo entra en una **cola de errores** y reaparece pronto (misma o
   siguiente sesión) **hasta acertarlo**, con la explicación delante.
4. **Dificultad adaptativa.** Si el alumno va sobrado (racha de aciertos rápidos), sube variantes/dificultad
   **dentro de su nivel**; si le cuesta, baja y refuerza. Ajuste **suave**, nunca brusco. *(MVP: básico;
   Fase 2: avanzado.)*
5. **Recuperación activa.** Se priorizan actividades que obligan a **recordar/producir** (rellenar, ordenar,
   decir) frente a solo reconocer, cuando el nivel lo permite → genera aprendizaje real, no reconocimiento pasivo.
6. **Intercalado de habilidades.** Una sesión **mezcla** habilidades (vocabulario + listening + gramática)
   en vez de bloques largos de lo mismo → mejor retención y menos aburrimiento.
7. **Detección de dominio.** El modelo de estados de §4 (evidencia acumulada, espaciada y de recuperación).
8. **Recomendación de la siguiente actividad.** Un motor de reglas **explicable** (no una IA opaca) que, en
   cada momento, elige por prioridad: 1) errores pendientes → 2) objetivos que "vencen" por espaciado →
   3) contenido nuevo cuyos **prerrequisitos** están cubiertos → 4) intercalar habilidad distinta de la
   anterior → 5) respetar la dificultad adaptativa del alumno.

## 6. Ejemplos concretos por etapa

### 1.º–2.º de Primaria (Pre-A1, mucho audio, casi sin texto)
- **Unidad:** "Colores y números" · **Tema:** números 1–10.
- **Habilidad:** Vocabulary + Listening · **Objetivo:** "Reconozco y digo los colores y los números del 1 al 10".
- **CEFR:** Pre-A1 · **Dificultad:** 1 · **Prerrequisitos:** ninguno.
- **Actividades:** escuchar y tocar el color correcto; relacionar número ↔ imagen; "¿cuál es red?".
- **Camino a Dominado:** acierta "red/blue/three…" en **3 sesiones de días distintos**, con audio, sin
  necesidad de leer.

### 3.º–6.º de Primaria (A1–A2)
- **Unidad:** "Mi rutina diaria" · **Tema:** present simple + las horas.
- **Habilidad:** Grammar + Vocabulary + Reading · **Objetivo:** "Sé decir a qué hora hago las cosas
  (I wake up at 8)".
- **CEFR:** A1 · **Dificultad:** 2–3 · **Prerrequisitos:** vocabulario de rutinas + las horas (al menos "practicando").
- **Actividades:** ordenar la frase; completar el hueco ("I ___ up at 8"); lectura breve + preguntas.
- **Camino a Dominado:** **produce** frases correctas de rutina en varias sesiones espaciadas (no solo
  elige entre opciones).

### ESO (A2–B1) *(fase posterior)*
- **Unidad:** "Planes de futuro" + módulo **Everyday English** ("en la cafetería") + **Study-abroad**
  ("en el aeropuerto").
- **Habilidad:** Grammar + Reading + Everyday English · **Objetivo:** "Hablo de planes con *going to* y me
  desenvuelvo en situaciones reales de viaje".
- **CEFR:** A2–B1 · **Dificultad:** 3–4 · **Prerrequisitos:** present simple/continuous dominados.
- **Actividades:** transformaciones gramaticales, cloze, diálogos, reading challenge, situaciones comunicativas.
- **Camino a Dominado:** resuelve transformaciones y situaciones **produciendo lenguaje**, espaciado en el tiempo.

## 7. Qué entra en el MVP y qué en fases

| Elemento | MVP | Fase posterior |
|---|---|---|
| Taxonomía de contenido (niveles, unidades, objetivos, prerrequisitos) | ✅ | — |
| Estados de dominio (los 5) | ✅ (versión simple) | ajuste fino |
| Repaso de errores (cola) | ✅ | — |
| Repetición espaciada | ✅ intervalos simples | ✅ ajuste avanzado |
| Recomendación de siguiente actividad (reglas) | ✅ | mejoras |
| Intercalado de habilidades | ✅ | — |
| Dificultad adaptativa | básica | avanzada |
| Recuperación activa (producir > reconocer) | parcial (según tipos disponibles) | plena (writing/speaking) |
| Writing / Pronunciation / Speaking | — | Fase 2–3 |
| Study-abroad readiness | — | con ESO |

---

### Próximo paso
Si apruebas esta arquitectura pedagógica, se convierte en la **columna vertebral** del contenido y guía
los Bloques 3 (CMS) y 4 (sesión diaria + progreso). Dime si te encaja o quieres ajustar algo (p. ej.
los umbrales de "Dominado" o el orden de habilidades).
