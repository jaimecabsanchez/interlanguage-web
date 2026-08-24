# Nombres visibles por banda en Primaria

## Objetivo

Evitar que la interfaz dirigida a p12 y p34 muestre nombres de misión o
habilidad en inglés. El inglés continúa siendo el contenido que aprende el
alumno; no se traducen enunciados, opciones, respuestas, audios ni vocabulario
de los ejercicios.

## Comportamiento

- p12 y p34 muestran en español el título visible de la unidad o misión y la
  etiqueta de habilidad.
- p56 y ESO muestran esos mismos elementos de interfaz en inglés.
- La elección usa el patrón existente:
  `band === "p12" || band === "p34" ? es : en`.
- Si una unidad no está incluida en el mapa visible, se conserva su título
  editorial como respaldo. Si una habilidad es desconocida, se conserva su
  identificador como respaldo.

## Diseño técnico

### Inicio

`plataforma/inicio.html` tendrá dos mapas bilingües:

- nombres visibles de unidad, indexados por `unit.id`;
- nombres visibles de habilidad, indexados por el identificador de habilidad.

`titleFor(unit, band)` resolverá el título por banda. La función seguirá
separada de `missionVisualKey(unit)` y `illoFor(unit)`: el visual continúa
dependiendo de los datos editoriales de la unidad, no del idioma visible.

`skillLabelFor(skill, band)` resolverá el texto, el `title` y el
`aria-label` de cada chip con la misma decisión por banda.

### Ejercicio

`plataforma/motor/engine.js` conservará `SKILL_META.es/.en`, pero sus valores
`.es` serán nombres realmente españoles: Comprensión auditiva, Vocabulario,
Gramática, Lectura, Escritura y Expresión oral. Esto solo afecta a la etiqueta
de contexto de la interfaz; no modifica el contenido inglés del ejercicio.

## Caché

- Se subirá la versión del recurso inline de Inicio mediante los scripts locales
  que cambien o, si solo cambia el HTML inline, se verificará que la URL de
  prueba lleve un parámetro de recarga.
- Al modificar `motor/engine.js`, se subirá su `?v=` en todas las páginas que
  lo cargan.

## Verificación

- `?demo=1&ageMode=p12`: título y habilidades visibles en español.
- `?demo=1&ageMode=p34`: título y habilidades visibles en español.
- `?demo=1&ageMode=p56`: título y habilidades visibles en inglés.
- `?demo=1&ageMode=eso`: título y habilidades visibles en inglés.
- Abrir una actividad y confirmar que su inglés didáctico no cambia.
- Ejecutar todos los tests de `plataforma/*.test.js` y
  `plataforma/motor/*.test.js`.

## Fuera de alcance

- Traducir el banco de ejercicios.
- Cambiar navegación, iconos, estilos o estructura visual.
- Modificar el criterio de selección de misión o sus ilustraciones.
