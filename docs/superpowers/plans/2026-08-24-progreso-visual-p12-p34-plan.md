# Plan: Progreso visual para p12 y p34

1. Añadir a Progreso una tarjeta semántica y oculta por defecto para la
   miniatura real de Mi mundo.
2. Cargar las dependencias compartidas de mundo y subir las versiones de
   `progreso.css` y `progreso.js`.
3. Implementar en `progreso.js` el filtrado de objetos activos y desbloqueados
   y montar `ILWorldVisual.scene` solo para p12/p34.
4. Sustituir la racha numérica infantil por microcopy cualitativa derivada del
   dato real.
5. Añadir reglas CSS bajo `body[data-stage="p12"]` y
   `body[data-stage="p34"]` para ocultar estadísticas, porcentajes y barras,
   manteniendo el camino semanal, frases, recomendación y estados visuales.
6. Añadir comprobaciones automatizadas de aislamiento por banda y dependencias.
7. Ejecutar la suite completa y revisar p12/p34/p56/ESO en escritorio, tableta
   y móvil.
8. Revisar el diff y guardar la implementación en un commit independiente.
