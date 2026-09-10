# Plan de implementación · experiencia de sesión

Base: `docs/superpowers/specs/2026-09-10-session-experience-redesign-design.md`.

## Bloque 1 · Estado y contrato común

- Crear `plataforma/motor/session-state.js` como máquina de estados pura.
- Cubrir loading, idle, selected, checking, retry, correct, incorrect, technical-error y complete.
- Integrarla en `engine.js` sin cambiar `IL_ENGINE.render` ni los eventos educativos.
- Añadir pruebas unitarias del flujo de dos intentos.

## Bloque 2 · Shell, feedback y teclado

- Simplificar la jerarquía renderizada por `engine.js`.
- Resolver instrucciones y feedback por banda.
- Implementar un CTA único, audio con estados explícitos y atajos 1–4/Enter.
- Mantener las plantillas actuales y su evaluación.
- Añadir pruebas de contrato para estados, copy, atajos, audio y persistencia.

## Bloque 3 · Diseño responsive por plantilla y edad

- Reestructurar `motor.css` con medidas simple, visual, manipulación y lectura.
- Eliminar alturas artificiales, elementos competidores y motion permanente.
- Adaptar targets, progreso y densidad para p12, p34, p56, ESO y neutral.
- Simplificar la cabecera de `leccion.html` y retirar racha, tema y reacciones durante la respuesta.
- Subir `?v=` en todos los consumidores.

## Bloque 4 · Verificación

- Ejecutar tests de motor después de cada bloque y la suite completa al final.
- Probar todas las plantillas actuales y los estados principales en navegador.
- Revisar teclado, foco, audio, consola y `prefers-reduced-motion`.
- Capturar 1440×900, 1280×800, 1024×768, 820×1180, 768×1024 y 390×844.
- Corregir cualquier solapamiento, scroll horizontal o estiramiento antes del commit final.
