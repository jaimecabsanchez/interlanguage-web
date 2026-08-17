# Interlanguage HOME — Brief maestro de UX y diseño visual

> Fuente única de visión de producto (UX, diseño visual, adaptación por edades,
> adecuación pedagógica, feedback, progreso, motivación, responsive, accesibilidad).
> Compartido con Codex. Para las decisiones ya tomadas sobre este brief, ver
> `docs/superpowers/specs/2026-08-12-ux-fase1-direccion-producto-design.md`.

## Roles con los que se debe pensar

Senior Product Designer (EdTech) · UX/UI de productos infantiles y adolescentes ·
Product Manager de plataformas educativas · Especialista en gamificación y behavioral
design · Especialista en aprendizaje de idiomas · Frontend UX auditor · Especialista en
conversión, engagement y retención.

## Qué es la plataforma

Herramienta propia de práctica **diaria** de inglés para alumnos desde los cursos más
pequeños de Primaria hasta ESO. Inspirada conceptualmente en Duolingo / Kumon en:
práctica frecuente, sesiones cortas, progresión, hábito, feedback inmediato, gamificación,
sensación de avance, recompensas y personalización.

**Pero NO se copia visualmente a Duolingo ni se convierte en videojuego.** Identidad
propia, educativa, premium y reconocible.

## Objetivo principal

Conseguir simultáneamente que el alumno: (1) entienda de inmediato qué hacer; (2) quiera
entrar cada día; (3) perciba las sesiones como fáciles de empezar; (4) sienta progreso al
completar; (5) quiera hacer "uno más"; (6) tenga motivación para volver mañana; (7) se
divierta sin que parezca infantil cuando crece; (8) tenga una UX extraordinariamente
sencilla; (9) que los padres perciban un producto educativo serio y de valor; (10) que
parezca un producto tecnológico profesional, no una web escolar casera.

Behavioral design **responsable**, sin dark patterns ni ansiedad: hábito, anticipación,
curiosidad, pequeñas recompensas, sensación de progreso, objetivos, continuidad,
autonomía, orgullo por mejorar.

Pregunta que guía TODO: **"¿Qué podemos hacer para que el alumno tenga ganas de volver
mañana?"**

---

## 1. Experiencia distinta por edad (no la misma para todos)

Arquitectura común, experiencia visual y motivacional progresiva.

- **Nivel A — 1.º-2.º Primaria:** extremadamente visual, poco texto, botones grandes,
  instrucciones muy sencillas, ilustraciones, movimiento moderado, feedback inmediato,
  sesiones cortísimas, sensación constante de éxito. Empezar casi sin leer. Priorizar
  imágenes, audio, drag & drop, seleccionar, unir, escuchar, repetir, speaking sencillo,
  juegos de vocabulario. Gamificación: estrellas, premios, coleccionables, personajes,
  evolución de avatar, desbloqueos. **Infantil premium, no guardería.**
- **Nivel B — 3.º-4.º Primaria:** más autonomía, retos, progresión, colecciones,
  achievements, objetivos semanales, personalización. Más información pero interfaces muy
  claras. Introducir XP, niveles, misiones, retos, rankings privados/por grupo si tiene
  sentido, progresión visual, mapas o caminos.
- **Nivel C — 5.º-6.º Primaria:** reducir estética infantil. Experiencia más cercana a
  app / gaming ligero / progreso personal / retos / estadísticas sencillas / dominio de
  habilidades. Los alumnos empiezan a sentirse "mayores". Evitar mascotas muy infantiles,
  estrellas gigantes, colores demasiado infantiles, lenguaje para niños pequeños.
- **Nivel D — ESO / adolescentes:** interfaz claramente distinta: limpia, sofisticada,
  moderna, sensación de app tecnológica; menos dibujos, más progreso, estadísticas,
  objetivos, retos, streak, skills, nivel, personalización. Inspiración: fitness apps,
  productivity apps, gaming progression, language apps modernas. Nunca debe parecer una
  app para niños.

## 2. Home

Pantalla más importante. Evitar entrar y ver demasiadas opciones. Debe responder de
inmediato: **¿QUÉ TENGO QUE HACER AHORA?**

- **Prioridad 1 — acción principal dominante** (Today's mission / misión de hoy):
  visualmente imposible no saber dónde empezar. Ej.: `Today's mission · 8 minutes · 3
  activities · [START]`. Al reanudar: `You're 2 minutes away from completing today's
  goal · [CONTINUE]`. Nunca 6 botones con igual jerarquía.
- **Prioridad 2 — progreso del día** (`Daily goal ████████░░ 8/10 min` o `3/4 activities`).
- **Prioridad 3 — motivación secundaria** (`🔥 6 day streak` / `Weekly goal 4/5`).
- **Prioridad 4 — una única recomendación personalizada** (`These 5 words need another
  round · [PRACTISE THEM]`). No mostrar muchas a la vez.

## 3. Eliminar ruido visual

Auditar y quitar: textos innecesarios, explicaciones largas, tarjetas redundantes, botones
duplicados, info repetida, iconos sin función, badges decorativos, espacios mal usados,
demasiados colores/bordes/componentes simultáneos. Regla: **UNA PANTALLA = UNA DECISIÓN
PRINCIPAL.**

## 4. Botones (CTA)

Nada de `Continue / Next / Accept / Go / OK` salvo cuando sea lo más natural. Los botones
explican qué ocurre después: `START TODAY'S LESSON`, `CHECK MY ANSWER`, `TRY AGAIN`, `HEAR
IT AGAIN`, `SHOW ME A HINT`, `KEEP MY STREAK`, `DO ONE MORE`, `FINISH FOR TODAY`, `REVIEW
MY MISTAKES`… Cada pantalla: CTA primario evidente, secundario solo si hace falta, terciarios
discretos. **Nunca tres botones visualmente iguales.**

## 5. Experiencia de sesión

No debe sentirse como "deberes" sino como "mi misión de hoy". Estructura sugerida:
`START → actividad rápida fácil → actividad principal → challenge → mini review → resultado
→ reward → opcional: one more?`. El **primer ejercicio con alta probabilidad de acierto**
(reduce fricción, genera momentum).

## 6. Progreso visible siempre

El alumno sabe: dónde está, cuánto ha hecho, cuánto falta, qué ha conseguido. Recursos:
barra, nº de ejercicio, hitos, mapa, nivel, skills, mastery. Sin llenar cada pantalla de
métricas. Dentro del ejercicio basta `3/7 ██████░░░░`.

## 7. Micro-recompensas

No solo al terminar. Momentos positivos durante el recorrido: `3 correct in a row!`,
`Perfect pronunciation!`, `New word mastered!`, `Fast answer!`, `Great comeback!`. **No**
celebración gigante tras cada respuesta. Debe haber variación.

## 8. Recompensa variable moderada

Ocasional: mystery reward, bonus XP, avatar item, new background, badge, extra challenge,
secret exercise. Dentro de límites razonables. **Nunca** loot boxes de pago, probabilidades
engañosas ni mecánicas de apuestas.

## 9. Racha diaria

Motivadora, no ansiosa. `🔥 7 day streak` + `Come back tomorrow to make it 8`. Evitar
mensajes culpabilizadores (`You failed`, `You lost everything`). Si se recupera racha,
`Streak Save` sencillo.

## 10. Weekly goal

Sistema semanal además de la racha: `Mon ✓ Tue ✓ Wed ✓ Thu ○ Fri ○ · Goal: 4 sessions · 3/4
completed`. No obliga a los 7 días.

## 11. Efecto "uno más"

Tras terminar (`TODAY'S GOAL COMPLETE ✓`), opción atractiva pero **voluntaria**: `Feeling
strong? Beat your score · [ONE MORE]`, `Only 3 words left to master this unit · [FINISH
THEM]`, `You are 20 XP away from Level 8 · [GET 20 XP]`. Herramienta principal de engagement.

## 12. Efecto Zeigarnik

Progreso incompleto moderado: `Unit 4 █████████░ 92% · One lesson left`. Nunca falsificar
porcentajes.

## 13. Personalización real

Usar el rendimiento para generar `Recommended for you`: "You've mastered animals", "Let's
strengthen past tense", "These 4 words still need practice", "Your listening improved this
week", "Ready for a harder challenge?". Debe parecer que la plataforma entiende al alumno.

## 14. Sistema de dificultad

Adaptación ligera: si falla varias veces → simplificar temporalmente, mostrar imágenes,
pista, repetir; si domina → menos repetición, harder challenge, más complejidad. Nunca
atrapar al alumno repitiendo lo fácil.

## 15. Error UX

No solo `❌ WRONG`. Mejor: `Almost! Look at the verb. She ___ to school every day. (go /
goes / going)` y permitir reintentar. Cuando toque: `SHOW HINT` → `SHOW EXPLANATION`.
Explicaciones apropiadas a la edad.

## 16. Celebraciones (niveles)

Micro (respuesta correcta, muy breve) · Milestone (5 aciertos, moderada) · Achievement
(lección completada, más visible) · Major achievement (nivel completado, memorable). Sin
confeti constante.

## 17. Sonido

Para correct answer, level complete, XP, streak, rewards. Corto, agradable, reconocible.
Siempre `Sound ON/OFF`.

## 18. Animaciones

Microanimaciones con propósito: barra llenándose, XP sumándose, badge apareciendo, streak
encendiéndose, avatar reaccionando, tarjeta desplazándose. Evitar animación constante,
movimiento sin razón, fondos pesados. Priorizar rendimiento.

## 19. Avatar

Personalizable, agradable, ligero, moderno. No un personaje extremadamente cartoon.
Desbloqueos: ropa, accesorios, fondos, objetos. Sofisticación adaptada a la edad; los
adolescentes pueden usar avatar minimalista / iniciales / icono / imagen abstracta, sin
muñeco infantil obligatorio.

## 20. Rewards hub

Sección `MY REWARDS` (badges, avatar items, milestones, collections) **sin** convertirla en
protagonista de la navegación.

## 21. Learning path

Camino visual de aprendizaje (estaciones / islas / niveles / checkpoints / skills), más
propio y premium que Duolingo. Estilo adaptado a la edad.

## 22. Skill mastery

Progreso educativo real además de XP: `Vocabulary 82% · Listening 65% · Grammar 54% ·
Speaking 74%`. Simplificado para pequeños; con detalle para mayores.

## 23. Pantalla de resultados

Rediseñar el final de sesión. Máx.: `TODAY COMPLETE ✓ · 8 minutes · +120 XP · Accuracy 87%
· 5 words mastered · 🔥 Streak 6 days` → `[FINISH]` + opcional `[DO ONE MORE]`. Sin exceso
de estadísticas.

## 24. Home del día siguiente

Generar anticipación: `Tomorrow: Listening challenge 🎧` / `Next mission unlocked
tomorrow`. Nunca bloquear artificialmente todo el contenido para obligar a esperar.

## 25. Onboarding

Extremadamente breve, sin formularios largos. Idealmente: nombre → curso → mini assessment
o nivel asignado por profesor → elegir avatar → primera misión. Empezar a aprender cuanto
antes.

## 26. Perfil

No una página aburrida de configuración. Dividir: `MY PROGRESS · MY AVATAR · MY ACHIEVEMENTS
· SETTINGS`. Para pequeños, minimizar opciones técnicas.

## 27. Navegación

Máximo 4-5 opciones principales (p. ej. `HOME · LEARN · PROGRESS · REWARDS · PROFILE`);
analizar si simplificar aún más. Nada de navegación compleja.

## 28. Mobile first

Diseñar pensando en tablet y móvil: tamaño de botones, targets táctiles, scroll, teclado,
audio, drag, responsive, orientación.

## 29. Accesibilidad

Buen contraste, textos legibles, botones grandes, no depender solo del color, navegación
coherente, feedback visual + textual, soporte de audio cuando aplique.

## 30. Performance

Debe sentirse extremadamente rápida. Evitar imágenes enormes, vídeos innecesarios,
animaciones pesadas, librerías enormes, fondos complejos. Priorizar SVG, CSS, iconografía
ligera, lazy loading, componentes reutilizables. Transiciones inmediatas.

## 31. Design system

Coherente: typography, spacing, buttons, cards, colors, icons, inputs, modals, feedback,
progress, badges, navigation. Todo parte del mismo producto.

## 32. Color

Pocos colores simultáneos: primary brand, secondary, success, warning, error, escala
neutra. Más variedad para pequeños; a más edad, menos saturación y decoración.

## 33. Tipografía

Muy legible, moderna, amable, no infantil. Jerarquías claras. No seis tamaños por pantalla.

## 34. Padres

Percibir mucho valor. Zona separada (no mezclar con interfaz infantil): `This week: 4
sessions · 36 minutes · Vocabulary +12 words · Listening ↑ · Grammar improving · Teacher
focus: Past simple`. Comprensible sin conocimientos pedagógicos.

## 35. Profesores

La arquitectura debe permitir a futuro: asignar contenido, ver progreso, detectar
dificultades, recomendar práctica, observar engagement. No hace falta un dashboard enorme
ahora, pero no cerrar la puerta a construirlo.

## 36. Principio fundamental

No premiar solo "estar conectado". Premiar completar, aprender, mejorar, superar
dificultades, mantener constancia. XP = actividad, pero existe aprendizaje real.

## 37. Copy

Revisar TODOS los textos. Eliminar lenguaje corporativo/escolar aburrido. En vez de
"Complete the following activity" → "Ready?", "Listen and choose", "Can you beat this?",
"Say it!", "Your turn". Tono por edad; para adolescentes, mucho menos infantil.

## 38. No sobrecargar

No convertir cada idea de este brief en un componente visible. La sofisticación va detrás.
La interfaz debe sentirse **SIMPLE** aunque el sistema sea complejo.

## 39. Auditoría del producto actual

Analizar todas las páginas, componentes, navegación, botones, modales, tarjetas, ejercicios,
resultados, perfil, home, progreso, onboarding, responsive, estados vacíos/error/loading,
gamificación. Identificar qué eliminar, simplificar, mover, rediseñar y qué crear nuevo. No
mantener algo solo porque ya existe.

## 40. Ejercicios (UX interna)

Cada tipo (multiple choice, drag & drop, matching, listening, speaking, fill the gap,
sentence ordering, image vocabulary, reading comprehension, grammar, pronunciation) con
interacción apropiada y **sistema visual común**: `HEADER · Progress · Instruction ·
Exercise · Primary CTA · Feedback`. No reinventar el layout cada vez.

## 41. Transición entre ejercicios

Evitar sensación de formulario → formulario. Producir sensación de sesión: `Nice! 2/7 →
NEXT` o transición automática breve cuando aplique.

## 42. Sesiones de 5-10 min

Barrera mental mínima. En Home mostrar `Today's mission · 7 min` en vez de `12 exercises`
(7 minutos parece más accesible).

## 43. Momentum

Pequeña victoria en los primeros 30-60 s.

## 44. Objetivos personales

Para mayores: `My goal · 10 min/day · 3 days/week · 5 days/week`. No objetivos complejos.

## 45. Challenges

Retos especiales (Friday Challenge, Listening Sprint, Perfect Round, Vocabulary Boss,
Grammar Challenge). Máximo un reto destacado a la vez.

## 46. Identidad propia (muy importante)

No "Duolingo con otros colores". Composición, iconografía, personaje, lenguaje, sistema
visual y navegación **propios**.

## 47. Product loop

`OPEN APP → SEE TODAY'S GOAL → START QUICKLY → GET EARLY WIN → MAKE PROGRESS → RECEIVE
FEEDBACK → COMPLETE MISSION → GET REWARD → SEE TOMORROW'S OPPORTUNITY → RETURN`. Optimizar
cada decisión UX alrededor de este loop.

## 48. Métrica real de éxito

No maximizar tiempo de pantalla. Maximizar frecuencia, sesiones terminadas, progreso,
constancia, satisfacción, aprendizaje. Una sesión de 8 min terminada > 25 min de navegación
inútil.

## 49-52. Cómo trabajar

Actuar sobre el proyecto (no solo recomendar): inspeccionar estructura, identificar
componentes/páginas, encontrar inconsistencias, definir qué cambiar, establecer arquitectura
UX coherente, e implementar progresivamente. No destruir funcionalidades; entender la lógica
antes de eliminarla; reutilizar backend/datos/lógica. Priorizar frontend/UX/arquitectura
visual. Auditar en **P0 (grave) / P1 (importante) / P2 (pulido)** y empezar por P0. No
preguntar por cada cambio pequeño. **No** hacer un rediseño cosmético (colores, sombras,
bordes, iconos): mejorar el **producto** — prioridad arquitectura → flujo → jerarquía →
interacción → engagement → claridad → gamificación → diseño visual.

### Criterio de calidad (por pantalla)

¿Un niño entiende qué hacer en <3 s? ¿Hay una acción principal evidente? ¿Sobra texto? ¿Hay
ruido visual? ¿Algo compite por atención sin razón? ¿Sabe cuánto le falta? ¿Hay feedback
inmediato? ¿La siguiente acción está clara? ¿Apetece volver mañana? ¿La estética corresponde
a la edad? ¿Parece profesional? Si alguna respuesta es NO, seguir mejorando.

### Resultado buscado

Alumno al abrir: "Voy a hacer lo de hoy" → a los pocos segundos ya está en el primer
ejercicio. Al terminar: "Ya está… ¿puedo hacer otro?". Al día siguiente: "Quiero ver qué me
toca hoy". Padre: "Esto no son simplemente ejercicios online; hay un sistema detrás y mi
hijo está progresando".
