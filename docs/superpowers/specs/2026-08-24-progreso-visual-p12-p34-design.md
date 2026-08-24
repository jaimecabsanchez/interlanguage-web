# Progreso visual para p12 y p34

## Objetivo

Convertir Progreso en una experiencia comprensible para alumnos de 5 a 9 años.
En p12 y p34 el avance se explicará mediante el camino semanal, los estados
visuales de los sellos y una miniatura real del mundo del alumno. Los
porcentajes, las barras analíticas y las métricas detalladas quedan reservados
para p56, ESO y el informe familiar.

## Alcance por banda

Los cambios se activan exclusivamente con
`body[data-stage="p12"]` y `body[data-stage="p34"]`, junto con la banda
resuelta por `IL_ETAPA.current().band`.

- p12 y p34 reciben la experiencia visual simplificada.
- p56 conserva la experiencia analítica actual.
- ESO conserva íntegramente su experiencia actual.

## Semana como progreso principal

Para p12 y p34:

- Los siete días y sus estados de completado forman el camino principal.
- Se mantiene la meta concreta `N de 5`, porque es una instrucción semanal
  comprensible y no una estadística analítica.
- Se ocultan la barra horizontal, los minutos, la comparación semanal y el
  resumen de días activos.
- El encabezado deja de mostrar el total acumulado de misiones y el rail deja de
  mostrar porcentaje de nivel.
- La racha se expresa con mensajes cualitativos derivados del dato real, sin
  mostrar el número.

## Miniatura real de Mi mundo

Debajo del camino semanal aparece una tarjeta `Tu mundo crece contigo`:

- Reutiliza `ILWorldVisual.scene`; no se crea una ilustración paralela.
- Usa la configuración activa de `ILProfileSettings`, el nivel derivado por
  `ILWorldData.levelMeta` y los objetos activos que ya estén desbloqueados.
- El mundo refleja los datos reales de la cuenta. No se inventan objetos,
  niveles ni recompensas.
- La tarjeta completa enlaza a `tienda.html` mediante una acción visible
  `Entrar en mi mundo`.
- Si el renderer no estuviera disponible, la tarjeta se oculta y la semana
  continúa siendo una experiencia completa.

La página cargará `world-data.js`, `avatar-rig.js` y `world-visual.js`.
Los estilos de la miniatura vivirán en `progreso.css` para no importar el
layout completo del editor de mundo.

## Próximo sello y logros

Para p12 y p34:

- El próximo sello conserva su imagen, nombre y requisito en lenguaje natural.
- Se ocultan el contador `actual / objetivo` y su barra.
- En la colección se mantienen estados conseguido/bloqueado y requisitos
  comprensibles, pero se ocultan barras, porcentajes y contadores parciales.
- El diálogo de detalle tampoco muestra una barra cuantitativa.

## Lo que sé

Para p12 y p34:

- Se eliminan las tarjetas numéricas de palabras y frases.
- p34 deja de mostrar filas, porcentajes y barras por habilidad.
- Se conservan las frases dominadas porque son evidencia concreta del inglés que
  el alumno ya puede usar.
- Se conserva una única recomendación de práctica, presentada como siguiente
  paso y sin puntuaciones.
- Los estados vacíos siguen siendo honestos y positivos.

## Implementación

- `progreso.html`: contenedor semántico de la miniatura y dependencias del
  renderer compartido.
- `progreso.js`: filtrado de objetos activos/desbloqueados, montaje del mundo y
  microcopy cualitativa para racha; no se altera el render analítico de mayores.
- `progreso.css`: reglas exclusivamente bajo p12/p34 para ocultar analítica y
  jerarquizar camino, mundo, frases y sellos.
- Se subirán los `?v=` de todo JS/CSS modificado en sus páginas consumidoras.
- Solo se usarán colores mediante tokens `--il-*`.

## Accesibilidad y responsive

- La escena mantiene el texto alternativo del renderer.
- La tarjeta tiene un enlace real y foco visible.
- La información semanal conserva etiquetas accesibles por día.
- Se comprobarán 390, 768 y escritorio sin desbordamiento horizontal.
- No se añadirán animaciones nuevas; se respeta `prefers-reduced-motion`.

## Verificación

- p12 y p34: sin porcentajes, barras de habilidad ni métricas acumuladas; camino
  semanal y mundo real visibles.
- p56 y ESO: estructura, cifras y barras actuales sin cambios.
- Pruebas completas de `plataforma/*.test.js` y
  `plataforma/motor/*.test.js`.
- Verificación visual con `?demo=1&ageMode=p12/p34/p56/eso`.

## Fuera de alcance

- Cambiar la experiencia de p56 o ESO.
- Modificar el editor o el catálogo de Mi mundo.
- Cambiar cómo se calculan habilidades, progreso, sellos o desbloqueos.
- Alterar el informe para familias.
