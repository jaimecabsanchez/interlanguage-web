# Plan: nombres visibles por banda

1. Inventariar las unidades que pueden aparecer en Inicio y sus bandas.
2. Añadir en `inicio.html` mapas bilingües de unidad y habilidad con funciones
   de resolución por banda y respaldo editorial.
3. Pasar la banda activa a la resolución del título de misión, metadatos de
   sesión y chips de habilidad.
4. Corregir `SKILL_META.es` en `motor/engine.js` sin modificar preguntas,
   opciones, respuestas ni audio.
5. Subir `?v=` de `motor/engine.js` en todas sus páginas consumidoras.
6. Añadir comprobaciones automatizadas para la resolución por banda.
7. Ejecutar los tests completos y verificar Inicio/Lección en p12, p34, p56 y
   ESO mediante el navegador local.
8. Revisar el diff y guardar la implementación en un commit independiente.
