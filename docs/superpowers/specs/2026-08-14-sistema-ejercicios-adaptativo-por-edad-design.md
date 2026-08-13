# Sistema de ejercicios adaptativo por edad

- **Fecha:** 2026-08-14
- **Estado:** arquitectura aprobada; pendiente de revisión final del owner
- **Referencia:** captura aportada por el owner y sistema visual actual de Interlanguage HOME

## Objetivo

Convertir la experiencia de práctica en un sistema visual coherente y reutilizable para
todos los ejercicios actuales y futuros. El contenido editorial debe definir la actividad;
el motor debe aplicar automáticamente estructura, jerarquía, estados, tactilidad y grado de
madurez visual según `p12`, `p34`, `p56` o `eso`.

La referencia marca claridad, ritmo, protagonismo de la tarea y calidad de presentación. No
se copiarán literalmente su identidad, colores o decoración.

## Arquitectura aprobada

Se mantendrá un único `leccion.html` y una única API pública `IL_ENGINE.render`. El motor
generará un shell común con:

1. contexto de actividad y skill;
2. instrucción principal;
3. estímulo protagonista (audio, texto, imagen o diálogo);
4. área de respuesta de la plantilla;
5. feedback pedagógico;
6. CTA de comprobar/continuar.

Cada plantilla aporta solo su interacción. Las bandas modifican la presentación mediante
clases y tokens; no existirán cuatro motores ni cuatro páginas.

## Progresión visual por edad

### `p12` · 5–7 años

- Una decisión principal por vista.
- Ilustraciones grandes y consistentes cuando el concepto sea visual.
- Audio circular protagonista en listening.
- Máximo tres opciones y targets mínimos de 56 px.
- Instrucción breve en español, con apoyo auditivo cuando exista.
- Progreso muy visible y decoración ambiental tenue.
- Feedback inmediato, concreto y positivo.

### `p34` · 8–9 años

- Misma arquitectura reconocible con menos decoración.
- Ilustraciones medianas, hasta cuatro opciones y targets de 52 px.
- Instrucciones bilingües progresivas.
- Mayor densidad y menor protagonismo del audio cuando no sea la skill central.

### `p56` · 10–11 años

- Apariencia de app educativa moderna, no infantil.
- Imágenes solo cuando aportan significado.
- Progreso y contexto más compactos; targets mínimos de 48 px.
- Más texto, producción guiada y autonomía.
- Feedback centrado en la explicación y el dominio.

### `eso` · Secundaria

- Interfaz sobria, limpia y tecnológica.
- Menos saturación, radios más contenidos y sin decoración infantil.
- Instrucciones principalmente en inglés y targets mínimos de 44 px.
- Audio integrado, no monumental salvo que la tarea lo requiera.
- Mayor anchura de lectura para comprensión, completar y diálogo.
- Métricas discretas y feedback preciso, sin tono infantil.

## Plantillas cubiertas

El shell se aplicará a todas las plantillas del motor:

- selección de texto o imagen;
- emparejar;
- clasificar;
- ordenar palabras;
- completar huecos;
- comprensión lectora;
- diálogo;
- speaking/pronunciación.

Las plantillas futuras deberán integrarse declarando metadatos semánticos y reutilizando el
shell, no creando estilos globales independientes.

## Contrato editorial y visual

Cada ejercicio podrá aportar:

- `skill`, `tema` y tipo de instrucción;
- estímulo textual o audio;
- opciones y respuesta;
- identificador visual semántico opcional;
- pista o explicación breve.

Las ilustraciones se resolverán desde un catálogo común. Si falta un asset, aparecerá un
fallback textual cuidado. Nunca se mostrará una imagen rota, un hueco o un emoji estructural.
El mismo concepto reutilizará siempre la misma ilustración.

## Estados de interacción

- **Default:** borde neutral y jerarquía clara.
- **Hover/focus:** respuesta visible sin sugerir corrección.
- **Seleccionado:** borde y fondo de acción con indicador neutral; nunca check prematuro.
- **Correcto:** icono, texto y color de éxito.
- **Casi/error:** explicación amable, pista y reintento cuando proceda.
- **Desactivado:** legible y claramente no interactivo.

Los estados no dependerán solo del color. El foco seguirá el orden visual y cada control
mantendrá un nombre accesible.

## Responsive

- Escritorio: aprovecha el ancho para 3–4 respuestas o contenido de lectura sin estirar el
  texto en exceso.
- Tablet: mantiene la jerarquía completa y targets táctiles.
- Móvil: una tarea por vista, CTA dentro del área segura y rejilla adaptada al contenido.
- No habrá scroll horizontal en 320, 390, 768, 1024 y 1440 px.
- Las plantillas con teclado evitarán que el CTA o el campo activo queden ocultos.

## Accesibilidad y rendimiento

- WCAG AA, navegación completa por teclado y progreso accesible.
- `prefers-reduced-motion` y el ajuste interno desactivarán movimientos no esenciales.
- SVG y recursos propios optimizados; sin librerías nuevas ni imágenes de fondo pesadas.
- Las imágenes editoriales tendrán dimensiones reservadas y carga eficiente.
- La lógica de audio respetará las preferencias guardadas del alumno.

## Límites técnicos

- `etapa.js` seguirá siendo la fuente de banda y experiencia.
- `layout.js` seguirá siendo la fuente de iconos de interfaz.
- `engine.js` conservará validación y controladores.
- `motor.css` definirá la base compartida y las variantes maduras.
- `lesson-young.css` concentrará las diferencias visuales de `p12` y `p34`.
- Los cambios de `.js` y `.css` actualizarán todos sus tokens `?v=`.

## Verificación

1. Recorrer una actividad de cada plantilla disponible.
2. Probar selección, corrección, error, reintento, audio y avance.
3. Revisar las cuatro bandas en los cinco anchos objetivo.
4. Validar teclado, foco, etiquetas, progreso y movimiento reducido.
5. Confirmar fallbacks sin ilustración y ausencia de imágenes rotas.
6. Ejecutar toda la batería de tests del repositorio y revisar consola.

## Fuera de alcance

- Cambiar el algoritmo pedagógico o el cálculo de dominio.
- Ampliar el banco editorial completo.
- Duplicar páginas o introducir un framework/build.
- Copiar literalmente la marca o los assets de la referencia.

## Criterios de aceptación

- Cualquier ejercicio nuevo hereda una presentación coherente sin CSS específico.
- Las cuatro bandas comparten estructura pero se distinguen claramente en madurez.
- ESO se percibe seria y apropiada para adolescentes.
- Los pequeños reciben apoyo visual sin que la respuesta quede revelada.
- Todos los estados y plantillas funcionan en móvil, tablet y escritorio.
- No se rompe persistencia, validación, feedback, audio ni progreso.
