# Rediseño de la experiencia de ejercicios

Fecha: 2026-08-09  
Estado: aprobado e implementado
Alcance: motor de actividades, pantalla de misión, feedback, persistencia y final de misión

## Objetivo

La misión debe sentirse como el núcleo de un producto EdTech profesional: una actividad por vista, instrucciones naturales, decisiones inequívocas, feedback pedagógico y progreso recuperable. El alumno debe entender siempre qué ejercicio está haciendo, qué falta, qué ocurrió con su respuesta y cuál es la siguiente acción.

La implementación conserva HTML, CSS y JavaScript planos, `IL_ENGINE.render()`, el banco de `contenido.js`, `ILAuth` y Supabase. No añade framework ni dependencias y se integra con la especificación de Inicio del mismo día.

## Enfoque aprobado

Se hará una evolución modular del motor actual:

- Se conserva la API pública `IL_ENGINE.render(container, exercise, options)` para no romper Lección ni la demo del motor.
- `engine.js` actúa como controlador de estados y registro de plantillas.
- Cada plantilla cumple un contrato común.
- Feedback, audio y adaptación de copy se resuelven mediante utilidades compartidas.
- La persistencia vive fuera del motor, en `mission-state.js`, para que Inicio y Lección lean la misma fuente.

No se reescribe el proyecto ni se convierte cada actividad en una página distinta.

## Arquitectura del motor

### Estados

```text
idle → ready → selected → checking → retry | resolved → continuing
```

- `ready`: plantilla montada, sin respuesta válida; CTA desactivado.
- `selected`: respuesta válida; CTA `Comprobar` activado.
- `checking`: evita dobles pulsaciones durante la validación.
- `retry`: primer error, muestra pista y permite corregir.
- `resolved`: acierto o segundo error; controles bloqueados, solución visible y CTA `Continuar`.
- `continuing`: transición al siguiente ejercicio.

El estado seleccionado nunca usa estilos de éxito ni error.

### Contrato de plantilla

Cada tipo registrado devuelve:

```js
{
  isAnswered(),
  getAnswer(),
  evaluate(),
  reveal(result),
  setDisabled(disabled),
  focus(),
  destroy()
}
```

La plantilla recibe `onChange` para que el controlador gestione el CTA sin inspeccionar el DOM. El resultado normalizado incluye `correct`, `selectedLabel`, `correctLabel`, `explanation`, `context` y `learnedExpressions`. Las plantillas no redactan feedback ni deciden intentos.

### Tipos

Se consolidan:

1. `elegir_texto` — multiple choice.
2. `elegir_imagen` — image choice.
3. Variante con `audio` — listening choice.
4. `emparejar` — matching.
5. `ordenar` — word ordering.
6. `completar` — opciones o texto breve.
7. `comprension` — reading comprehension.
8. `hablar` — práctica guiada sin afirmar que se evalúa pronunciación.

El registro queda preparado para `escritura_corta`, `respuesta_dialogo`, `corregir_error` y speaking con grabación futura. No se implementa una grabación ficticia.

## Copy por etapa

El motor recibe `stage` desde Lección y elige instrucciones en este orden:

1. `exercise.instructions[stage]`.
2. Copy adaptado por tipo y etapa.
3. `exercise.instruccion` como fallback.

- `p12`/`p34`: español breve y concreto.
- `p56`: instrucciones mixtas con más inglés.
- `eso`: principalmente inglés y tono maduro.

Para `rd-1`:

- Inicial: `¿Cómo se dice “desayunar” en inglés?`
- Superior: `Which expression means “desayunar”?`
- ESO: `Which expression means “to have breakfast”?`

Se añaden campos opcionales y retrocompatibles:

```js
instructions: { p12, p34, p56, eso },
feedback: { correct, incorrect, correctAnswer, context, learnedExpressions }
```

Si faltan, el motor genera feedback veraz desde la opción correcta y `explicacion`. Nunca inventa traducciones.

## Respuestas y CTA

Estados visuales: `default`, `hover`, `focus-visible`, `selected`, `correct`, `incorrect` y `disabled`.

- `selected` usa azul suave y un indicador neutral.
- `correct` usa verde, check y texto accesible.
- `incorrect` usa error, icono y texto accesible.
- Tras dos errores se identifica también la solución correcta.
- Tras resolver, todas las respuestas quedan bloqueadas.
- El CTA permanece desactivado mientras `isAnswered()` sea falso.
- Enter activa `Comprobar` cuando sea válido y `Continuar` tras resolver.

## Feedback pedagógico

### Acierto

- `¡Muy bien!`
- Explicación concreta: `“Have breakfast” significa “desayunar”.`
- Contexto opcional: `I have breakfast at seven o’clock.`
- `+10 puntos` locales de la misión, sin alterar XP, gemas ni el esquema global.

### Primer error

- `Casi.`
- Invitación breve a revisar la elección.
- Pista de `explicacion` si no revela toda la solución.
- Permite cambiar la respuesta y volver a comprobar.
- Aún no se registra como fallo definitivo.

### Segundo error

- `Vamos a verlo.`
- Significado de la elección solo cuando los datos lo aporten.
- Respuesta correcta explícita.
- Frase contextual si existe.
- `Continuar` y registro en `incorrectIds`.

No hay culpa, pérdida de vidas ni mensajes agresivos.

## Audio

El control mide al menos 44 × 44 px:

- Inicial: `Escuchar`.
- Reproducción: `Reproduciendo…` y `aria-pressed="true"`.
- Finalizado: `Repetir`.
- Error: aviso no bloqueante.

`speechSynthesis` usa callbacks `onStart`, `onEnd` y `onError`; iniciar un audio cancela el anterior. Solo hay reproducción automática cuando el contenido la solicita expresamente.

## Pantalla de Lección

### Cabecera

- Cerrar.
- Nombre de misión.
- `Ejercicio {actual} de {total}`.
- Un segmento por ejercicio.
- Avión sobre el límite del progreso actual.

Completados usan éxito, actual usa primario y pendientes son neutrales. La barra conserva texto visible y `role="progressbar"`.

### Salir

El cierre abre un `<dialog>` accesible:

- `¿Quieres salir de la misión?`
- `Guardaremos tu progreso para que puedas continuar después.`
- `Seguir practicando`.
- `Salir y guardar`.

Escape conserva la actividad. El foco entra en la acción principal y vuelve al cerrar. Solo se guardan ejercicios ya resueltos, nunca una selección sin comprobar.

### Móvil

- Una pregunta por vista.
- Zona inferior sticky para feedback y CTA.
- `100dvh` con fallback.
- Inputs con margen de scroll y ajuste al foco para evitar que el teclado tape la acción.
- Sin scroll horizontal y con targets de 44 px.

## Persistencia

`mission-state.js`, compartido con Inicio, guarda por alumno y fecha:

```js
{
  version, date, unitId, itemIds,
  currentIndex, completedCount, correctCount, incorrectIds,
  currentCorrectStreak, maxCorrectStreak, points,
  startedAt, elapsedMs, status, completionRecorded
}
```

- Se persiste un ejercicio al pulsar `Continuar` o terminarlo.
- Al salir o refrescar se recuperan índice y contadores.
- Una selección no comprobada se responde de nuevo.
- Inicio y Lección comparten los mismos `itemIds` diarios.
- `ILAuth.completeLesson(summary)` se llama una sola vez en la misión normal.
- `completionRecorded` evita duplicar recompensas por recarga.
- `?mode=errors` usa solo `incorrectIds`, no llama a `completeLesson` y elimina errores resueltos.
- Sin `localStorage`, el ejercicio sigue funcionando en memoria.

`progress.last` sigue siendo la autoridad del objetivo semanal.

## Final de misión

- `¡Misión completada!`
- `{correctas} de {total} correctas`.
- Duración activa real redondeada.
- Número y lista de hasta cuatro expresiones aprendidas desde datos reales.
- `{n} ejercicio(s) para repasar` cuando existan.
- `Volver al inicio`.
- `Repasar errores` solo si procede.

La celebración usa avión, sello y un halo suave, sin confeti excesivo. En repaso: `¡Errores repasados!`, resumen de resueltos y ninguna recompensa duplicada.

## Archivos previstos

- `plataforma/leccion.html`: cabecera, modal, persistencia y resumen.
- `plataforma/motor/engine.js`: controlador, contrato, copy, audio y feedback.
- `plataforma/motor/motor.css`: estados, feedback, sticky y responsive.
- `plataforma/contenido.js`: copy artificial y feedback contextual de muestra.
- Nuevos `plataforma/mission-state.js` y `mission-state.test.js`.
- `plataforma/inicio.html` conforme a su especificación aprobada.
- Actualización de `?v=` en consumidores de JS/CSS tocados.

No se cambiarán `auth.js`, Supabase, la navegación general ni el framework.

## Accesibilidad y errores

- Headings ordenados, botones nativos, foco visible y orden lógico.
- `aria-live="polite"` para feedback y audio.
- `aria-current="step"` en el segmento actual.
- Iconos decorativos ocultos y labels en controles sin texto.
- Contraste AA y `prefers-reduced-motion` completo.
- Plantilla desconocida o contenido incompleto muestra estado honesto y no concede puntos.
- Fallo de audio o guardado local no bloquea la sesión.
- Fallo de sincronización conserva la finalización pedagógica y no reintenta varias veces en la misma vista.

## Pruebas y aceptación

1. Acierto: selección neutral, check, explicación, +10 y continuación.
2. Primer error: pista y segundo intento sin revelar la solución completa.
3. Segundo error: error, solución, contexto y continuación.
4. CTA desactivado sin respuesta en cada plantilla.
5. Audio: inicial, reproducción, repetición y error.
6. Modal: cancelar, Escape, salir/guardar y retorno de foco.
7. Reanudación tras salir y refrescar.
8. Final normal llama una vez a `completeLesson`.
9. Repaso no duplica sesión ni recompensa.
10. Resumen calcula aciertos, tiempo y expresiones desde datos reales.
11. Flujo completo por teclado.
12. Viewports 360, 390, 768, 1024, 1366 y 1600 sin overflow.
13. CTA visible con input enfocado en móvil.
14. Sin errores nuevos de consola.
15. Pasan smoke, auth-utils, pedagogía, motivación, matriz y nuevas pruebas.

## Riesgos mitigados

- El motor monolítico mejora mediante contratos internos sin fragmentación prematura.
- Los campos nuevos son opcionales para no romper contenido antiguo.
- `completionRecorded` y el modo repaso evitan dobles recompensas.
- El tiempo acumula tramos activos, no el periodo con la página cerrada.
- Solo se adaptan automáticamente patrones conocidos; el resto conserva copy editorial.
