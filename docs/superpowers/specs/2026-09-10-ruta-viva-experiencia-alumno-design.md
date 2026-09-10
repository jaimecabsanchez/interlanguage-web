# Ruta viva: experiencia diaria, desafíos, logros y mundo personal

Fecha: 2026-09-10  
Estado: aprobado para planificación  
Ámbito: Inicio, Practicar/Lección, Progreso, Perfil, Mi mundo y navegación del alumno

## 1. Objetivo

Transformar Interlanguage HOME en una experiencia educativa clara, atractiva y fiable. El alumno debe entender qué tiene que hacer hoy, aprender de cada respuesta y ver una relación directa entre su constancia, lo que ya sabe y la evolución de su espacio personal. Las familias deben poder reconocer aprendizaje real detrás de la motivación visual.

La dirección aprobada se llama **Ruta viva**. Su ciclo principal es:

```text
Misión diaria
→ explicación tras cada respuesta
→ cierre con evidencia de aprendizaje
→ día completado
→ avance de desafíos y logros
→ evolución controlada de Mi mundo
```

No se incorporan rankings, ligas, recompensas aleatorias, pérdidas punitivas, mensajes de culpa ni presión por días ausentes.

## 2. Decisiones de producto

- La misión diaria es la única acción que puede completar el día en `Mi semana`.
- Entrar, responder un ejercicio aislado, practicar una habilidad, repasar o completar un desafío opcional no marca el día.
- Inicio muestra un desafío obligatorio y dos opcionales como máximo.
- Los desafíos describen acciones educativas concretas y nunca dependen únicamente de acumular XP.
- Los logros viven principalmente en Perfil/Progreso; Inicio solo anticipa el siguiente objetivo de forma comprensible.
- Los sellos ambiguos o puramente decorativos se eliminan. Un logro siempre incluye nombre, criterio, progreso y significado.
- Mi mundo no recibe un objeto permanente cada día. Durante la semana evoluciona una única pieza en etapas; la meta semanal consolida un cambio permanente.
- Nemo sigue siendo un guía ocasional, no un avatar fijo. En la vista 5–7 se elimina el avatar del saludo `Buen trabajo, Lucía`.
- La navegación usa SVG propios de `layout.js`, no emojis literales, aunque conserva el impacto visual de un símbolo grande a la izquierda de cada etiqueta.

## 3. Arquitectura de la experiencia

### 3.1 Inicio

La jerarquía será:

1. Saludo breve sin avatar fijo en `p12`.
2. Misión diaria como acción principal.
3. Caja `Desafíos de hoy`.
4. Resumen `Mi semana`.
5. Siguiente logro o cambio de mundo explicado en lenguaje natural.

La misión conserva título, aprendizaje esperado, duración, número de actividades, ruta y CTA dinámico. El CTA mantiene los estados actuales: empezar, continuar, repasar errores o misión completada.

#### Desafíos de hoy

La caja contiene como máximo tres filas. Cada fila tiene icono SVG expresivo, título específico, progreso visible, criterio accesible y consecuencia clara.

- Obligatorio: `Completa tu misión diaria`.
- Opcional adaptativo 1: escucha, vocabulario, lectura, escritura o habilidad débil según edad y contenido disponible.
- Opcional adaptativo 2: recuperar un error, repasar una expresión o completar una práctica breve disponible.

Los opcionales no generan culpa, no rompen continuidad y no sustituyen la misión. Pueden avanzar un logro concreto o una etapa temporal del mundo, pero no conceden objetos permanentes de forma diaria.

### 3.2 Mi semana

`Mi semana` utilizará una única definición compartida en Inicio y Progreso:

```text
completed(day) = existe una misión diaria normal con status="completed" para ese usuario y fecha
```

Se excluyen explícitamente:

- sesiones iniciadas o abandonadas;
- ejercicios individuales;
- repasos de errores;
- prácticas por habilidad;
- test de nivel;
- modos extra o examen;
- desafíos opcionales.

La fuente autoritativa será el registro real de finalización de misión. En demo podrá derivarse del histórico local deduplicado; en cuentas reales usará los eventos/datos persistidos disponibles. Si el dato no existe, se muestra un estado vacío honesto y el día no se completa por inferencia.

### 3.3 Siguiente objetivo

El bloque actual `Próximo sello` se sustituirá por `Tu siguiente logro` o un copy equivalente por banda. Mostrará:

- icono o distintivo único;
- nombre del logro;
- acción exacta que demuestra;
- progreso actual y objetivo;
- consecuencia concreta, si desbloquea una etapa del mundo.

No se mostrarán combinaciones crípticas como `Explorador matinal 1/5` sin explicar qué debe hacer el alumno. `Morning Explorer` solo puede conservarse si el texto visible aclara el criterio, por ejemplo: `Completa 5 misiones de Daily routines · llevas 1`.

## 4. Feedback pedagógico en actividades

Tras comprobar una respuesta, el feedback tendrá jerarquía visual propia y mayor contraste que las superficies pastel generales. Mostrará, según el tipo de ejercicio:

1. resultado breve;
2. significado o regla relevante;
3. por qué la respuesta encaja;
4. ejemplo útil cuando aporte comprensión;
5. CTA único para continuar o volver a intentar.

No se inventarán explicaciones. Se consumirán `feedback.correct`, `feedback.incorrect`, `feedback.context`, `explicacion` y variantes por banda del contenido. Los ejercicios sin explicación editorial mostrarán un fallback factual derivado únicamente de la respuesta y el estímulo; quedarán identificados para completar su contenido posteriormente.

### Adaptación por edad

- `p12` (5–7): una frase breve en español, término inglés destacado, traducción y apoyo visual/audio cuando exista. Targets mínimos de 56 px.
- `p34` (8–9): explicación breve, traducción solo cuando ayude y un ejemplo simple.
- `p56` (10–11): regla o contraste con el error, más un ejemplo contextual.
- `eso`: explicación principalmente en inglés, tono sobrio y precisión gramatical o comunicativa.

El primer error conserva el segundo intento. Tras el segundo error se muestra la solución y la explicación completa. Recuperar un error se reconoce como aprendizaje; nunca reduce la recompensa base ni daña el mundo.

## 5. Perfil, logros y Mi mundo

### 5.1 Perfil

El bloque `Este soy yo` aumenta la presencia del avatar principal y ordena la información alrededor de él. La jerarquía será:

1. avatar, nombre y nivel de mundo;
2. estadísticas educativas comprensibles;
3. logros recientes y siguiente logro;
4. entrada destacada a Mi mundo;
5. ajustes como acción secundaria.

Las estadísticas prioritarias serán misiones completas, expresiones aprendidas y habilidades en progreso. Para `p12` se reducirá la densidad y se usarán etiquetas concretas; `p56` y `eso` podrán mostrar más detalle. No habrá comparación con otros alumnos.

### 5.2 Logros

Los logros aparecen como filas escaneables con un distintivo original a la izquierda, nombre, descripción, progreso y fecha cuando estén conseguidos. Se agrupan por significado educativo:

- constancia: semanas completas;
- dominio: palabras, expresiones o estructuras que ya usa;
- comprensión: escucha o lectura demostrada;
- mejora: errores recuperados;
- exploración: unidades o contextos completados.

Cada logro puede tener niveles solo cuando estos representan requisitos crecientes y explícitos. No se usarán iconos genéricos repetidos ni recompensas basadas solo en abrir la aplicación.

### 5.3 Mi mundo sin saturación

La escena se organiza en zonas deterministas con límites de ocupación y capas fijas: fondo, vegetación/arquitectura, objetos de suelo, avatar y elementos de primer plano. Los objetos no usan posicionamiento libre ni se solapan de forma accidental.

Durante cada semana se muestra un único proyecto de crecimiento con hasta cinco estados visuales. Completar una misión diaria avanza un estado. Al completar la meta semanal, el proyecto se consolida como objeto, mejora o recuerdo permanente. Los elementos permanentes no se acumulan todos en la escena activa: el alumno elige un conjunto limitado de objetos visibles y el resto permanece en su colección.

El sistema siempre explica:

- qué está creciendo ahora;
- qué acción lo hace avanzar;
- qué se consolidará al completar la semana;
- qué puede personalizar el alumno.

## 6. Navegación por edad

Se mantienen cuatro destinos: Inicio, Practicar, Progreso y Perfil. `layout.js` sigue siendo la única fuente de navegación e iconos.

- Escritorio: rail con símbolo SVG destacado a la izquierda y etiqueta visible.
- Móvil: navegación inferior con símbolo arriba y etiqueta debajo.
- Estado activo: fondo, contraste y forma; nunca solo color.
- Targets mínimos: 56 px en `p12`, 48 px en `p34` y 44 px en `p56/eso`.

El significado de cada destino será estable:

- Inicio: qué hago hoy.
- Practicar: elegir una práctica adicional o habilidad.
- Progreso: qué estoy aprendiendo y cómo avanzo.
- Perfil: quién soy, mis logros y mi mundo.

La densidad, microcopy y presencia visual cambian por banda, pero no cambian los nombres ni la arquitectura básica. `p12` será más visual y guiado; `p34` algo más autónomo; `p56` más compacto; `eso` sobrio, con Nemo mínimo o ausente.

## 7. Datos y módulos

La implementación reutilizará la arquitectura existente:

- `mission-state.js`: estado y finalización de la misión diaria.
- `learning-events.js` / datos persistidos: evidencia de intentos y actividad.
- `progress-data.js`: presentación semanal compartida.
- `motor/engine.js`: render de feedback y eventos de resultado.
- `achievement-store.js` y `motor/achievements.js`: criterios y progreso de logros.
- `world-data.js`, `world-visual.js` y `world-page.js`: evolución, catálogo y composición del mundo.
- `layout.js`: navegación e iconografía.
- `etapa.js` y `age-mode.css`: adaptación por banda.

Se evitarán fuentes de verdad duplicadas. Si la normalización semanal actual cuenta cualquier actividad, se corregirá en la capa de datos compartida y se cubrirá con pruebas para las cuatro bandas.

## 8. Estados vacíos, errores y compatibilidad

- Sin contenido opcional compatible: se muestra solo la misión obligatoria y una explicación neutra; no se fabrica un desafío.
- Sin datos semanales: los días aparecen pendientes, no completados.
- Sin explicación editorial: feedback factual mínimo, sin reglas inventadas.
- Sin renderer del mundo: Perfil mantiene identidad y logros; la preview se oculta sin dejar un hueco roto.
- Fallo de persistencia: la sesión conserva su flujo pedagógico y comunica que el progreso no pudo guardarse, sin fingir éxito.
- Datos antiguos: se migran o normalizan de forma conservadora; no se atribuyen logros nuevos retroactivamente sin evidencia.

## 9. Accesibilidad, movimiento y tono

- Cumplimiento WCAG 2.1 AA, foco visible y navegación completa por teclado.
- Iconos decorativos ocultos a lectores; iconos funcionales con nombre accesible.
- Barras acompañadas de texto; el color nunca es la única señal.
- Feedback con `aria-live` y sin mover el foco de forma inesperada.
- `prefers-reduced-motion` y ajuste de reducción de movimiento respetados en todas las transiciones.
- Animaciones breves ligadas a acciones; sin confeti constante ni estímulos excesivos.
- Lenguaje positivo, concreto y no culpabilizador.

## 10. Fases de implementación

1. **Verdad diaria y desafíos:** corregir la definición de día completado, compartirla en Inicio/Progreso y añadir los tres desafíos.
2. **Feedback que enseña:** rediseñar el componente común y completar las variantes por banda sin duplicar plantillas.
3. **Perfil y logros:** ampliar avatar, estadísticas y lista comprensible de logros.
4. **Mi mundo:** ordenar capas, límites de ocupación y proyecto semanal de cinco estados.
5. **Navegación y pulido por edad:** auditar botones, targets, copy, estados y densidad en las cuatro bandas.

Cada fase será un conjunto pequeño de commits con cache-busting de todo JS/CSS modificado.

## 11. Validación y criterios de aceptación

1. Un día solo aparece completado después de terminar la misión diaria normal.
2. Inicio y Progreso muestran exactamente los mismos días completados.
3. Los desafíos opcionales nunca marcan el día ni rompen continuidad.
4. No se muestran más de tres desafíos y todos explican acción y progreso.
5. Cada ejercicio ofrece feedback adaptado a la banda sin inventar reglas.
6. En `p12` desaparece el avatar del saludo y el avatar de Perfil gana presencia.
7. Todo logro visible explica qué demuestra y cómo avanzar.
8. Mi mundo no presenta solapamientos en 320, 390, 768, 1024 y 1440 px.
9. La escena activa no se satura tras simular al menos 20 semanas completas.
10. Inicio, Practicar, Progreso y Perfil son distinguibles y navegables en cada banda.
11. No hay errores nuevos de consola ni regresiones en demo o cuentas reales.
12. Pasan todos los tests existentes y los nuevos contratos de actividad, desafíos, feedback, logros y mundo.

## 12. Fuera de alcance

- Rankings, ligas, funciones sociales y comparación entre alumnos.
- Compras con dinero real o recompensas aleatorias.
- Un editor libre de arrastrar objetos en Mi mundo.
- Sustituir Supabase, introducir un framework o añadir dependencias de build.
- Rediseñar el panel de familias en estas fases; consumirá los mismos datos fiables en un trabajo posterior.
