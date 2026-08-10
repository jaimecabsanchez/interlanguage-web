# Plan de implementación · ejercicios adaptativos y mundo personal

Especificación: `docs/superpowers/specs/2026-08-10-experiencia-ejercicios-mundo-personal-design.md`

## Bloque 1 · configuración por banda

- Ampliar `etapa.js` con experiencia de ejercicio para `p12`, `p34`, `p56` y `eso` sin crear nuevas páginas.
- Pasar el contexto de banda al motor desde `leccion.html`.
- Añadir tests de límites, copy, guía, densidad y recompensa.

## Bloque 2 · motor adaptativo

- Actualizar `motor/engine.js` para consumir el contexto en instrucciones, ayudas, audio y feedback.
- Rediseñar `motor/motor.css` y `age-mode.css` para diferenciar claramente 5–7, 8–9, 10–11 y ESO.
- Mantener selección neutral, segundo intento y CTA accesible.

## Bloque 3 · dominio de personalización

- Crear `world-data.js` como módulo puro con catálogo, filtros por banda, saldo, propiedad, equipamiento y siguiente objetivo.
- Crear `world-data.test.js` para compras, compatibilidad y catálogo por edad.
- Crear `world-visual.js/css` con avatar SVG, jardín, compañeros y espacio ESO.

## Bloque 4 · Mi mundo

- Sustituir el contenido de `tienda.html` manteniendo su URL.
- Eliminar emojis y la terminología visible de gemas.
- Integrar compra/equipamiento mediante `ILAuth` sin crear una segunda persistencia.
- Añadir carga, error, saldo insuficiente y estados bloqueado/conseguido/equipado.

## Bloque 5 · integración de recompensa

- Añadir Puntos de ruta y siguiente desbloqueo al resumen de misión.
- Añadir acceso a `Mi mundo`/`Personalizar` desde Perfil.
- Mantener aprendizaje como información principal y recompensa como consecuencia.

## Bloque 6 · verificación

- Ejecutar todos los tests Node.
- Probar Practicar y Mi mundo en cuatro bandas y 360, 390, 768, 1024 y 1366 px.
- Probar selección, error, segundo intento, acierto, salida, final, compra y equipamiento.
- Revisar consola, foco, reduced motion y scroll horizontal.
- Subir cache-busting de cada recurso modificado y crear commits pequeños.
