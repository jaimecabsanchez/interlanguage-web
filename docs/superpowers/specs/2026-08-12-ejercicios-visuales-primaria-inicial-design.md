# Ejercicios visuales para Primaria inicial

Fecha: 2026-08-12  
Estado: diseño aprobado

## Objetivo

Evolucionar la experiencia de práctica para 5–7 años hacia una interfaz más visual, cálida e inmersiva, inspirada en la referencia facilitada pero con identidad propia de Interlanguage. Para 8–9 años se aplicará una versión más contenida. Desde los 10 años y en ESO se conservará una experiencia progresivamente más madura.

El cambio se construirá sobre el motor actual, sin duplicar páginas, alterar la estructura de progreso ni cambiar de framework.

## Decisión por edad

### 5–7 años (`p12`)

- Encuadre amplio y limpio, con una sola tarea protagonista.
- Instrucciones grandes y sencillas, principalmente en español.
- Audio como acción central cuando el ejercicio sea de listening.
- Máximo de tres respuestas visibles.
- Respuestas ilustradas grandes y con texto breve.
- CTA inferior grande y siempre accesible.
- Decoración ambiental suave y celebraciones breves.
- Guía visible únicamente en momentos útiles.

### 8–9 años (`p34`)

- Misma arquitectura y jerarquía, con menos decoración.
- Ilustraciones más pequeñas y mayor presencia del texto.
- Instrucciones bilingües de forma progresiva.
- Hasta cuatro opciones según la matriz pedagógica actual.
- Audio destacado, pero no siempre protagonista.

### 10–11 años y ESO (`p56`, `eso`)

- Mantienen la presentación actual más compacta y madura.
- No incorporan el escenario infantil ni ilustraciones decorativas.
- Continúan priorizando contenido, skills y autonomía.

## Jerarquía de la pantalla `p12`

1. Cabecera compacta: cerrar, icono de misión, título, ejercicio actual y racha secundaria.
2. Progreso segmentado mediante la ruta del avión de papel.
3. Etiqueta de skill y tema.
4. Instrucción principal.
5. Acción de audio protagonista cuando corresponda.
6. Respuestas ilustradas.
7. Feedback pedagógico.
8. Botón `Comprobar` o `Continuar` fijo dentro de la zona segura.

La racha no competirá con la misión. El selector de edad seguirá siendo exclusivo del modo demo.

## Identidad visual

La referencia se utilizará como dirección de claridad y ritmo, no como plantilla literal.

- Se mantienen azul marino, azul de acción, coral, verde agua y fondos suaves de Interlanguage.
- El avión de papel seguirá representando el progreso.
- Los iconos estructurales procederán de `layout.js`; no se usarán emojis.
- Las ilustraciones de respuesta compartirán grosor, formas, iluminación y paleta.
- El fondo podrá incluir formas muy tenues, sin competir con las respuestas.
- Las tarjetas tendrán profundidad ligera y no una acumulación de sombras.

Las ilustraciones serán SVG ligeros o recursos propios centralizados. No se añadirá una dependencia ni se generará una imagen rasterizada completa por combinación de ejercicio.

## Estados de respuesta

La selección nunca parecerá una corrección:

- `default`: borde neutral.
- `hover`: elevación mínima y borde de acción.
- `focus-visible`: anillo de foco claro.
- `selected`: borde azul y fondo azul muy suave, sin check.
- `correct`: borde y panel verde, check y texto de confirmación.
- `incorrect`: borde coral/rojo, icono de error y explicación.
- `disabled`: mantiene legibilidad y no admite interacción.

El check solo aparecerá después de comprobar. Antes de comprobar se utilizará un indicador neutral de selección, sin semántica de acierto.

## Audio

En listening para `p12`, el botón será circular, grande y centrado. Incluirá:

- icono de altavoz;
- `aria-label` descriptivo;
- ondas únicamente mientras reproduce;
- texto visible `Escuchar` o `Repetir` cuando el espacio lo permita;
- feedback de reproducción sin animación continua;
- soporte de teclado y objetivo táctil amplio.

La acción utilizará la lógica de audio existente. No se reproducirá automáticamente si el alumno lo ha desactivado en Perfil.

## Ilustraciones y contenido

- Las imágenes deben reforzar el significado, no revelar sistemáticamente la solución.
- En vocabulario concreto pueden representar objetos o acciones.
- En contrastes como `good morning / good night / goodbye`, se diferenciará el contexto sin introducir pistas ambiguas.
- Cada opción conservará una etiqueta textual accesible.
- Si falta ilustración, el motor mostrará una opción textual cuidada, no un hueco ni un emoji.
- El catálogo visual se centralizará para que el mismo concepto conserve la misma ilustración.

## Feedback y motivación

- Acierto: confirmación breve, significado y ejemplo contextual cuando aporte aprendizaje.
- Error: tono amable, respuesta correcta y oportunidad de continuar sin castigo.
- Primera equivocación: pista cuando la plantilla y el contenido lo permitan.
- Celebración: microanimación del avión o guía, no confeti persistente.
- El progreso de misión avanzará solo después de resolver el ejercicio.

## Arquitectura

- `etapa.js` continuará decidiendo la banda de experiencia.
- `leccion.html` mantendrá una única estructura y recibirá clases/atributos por banda.
- `motor/engine.js` conservará los controladores y expondrá metadatos de tipo/skill para el layout visual.
- `motor/motor.css` contendrá las variantes `p12` y `p34` sin afectar a `p56` y `eso`.
- Las ilustraciones se moverán a un recurso visual compartido si el mapa actual crece, evitando que `engine.js` acumule responsabilidades.
- `contenido.js` conservará la fuente demo, sustituyendo gradualmente la dependencia de emojis por identificadores visuales semánticos.

No se reescribirá el motor ni se alterará su API pública `IL_ENGINE.render`.

## Responsive

### Escritorio y tablet

- Contenido centrado con anchura suficiente para tres respuestas.
- Uso del ancho sin estirar excesivamente tarjetas o texto.
- Cabecera y progreso visualmente separados del ejercicio.

### Móvil

- Una pregunta por vista.
- Tres opciones en fila solo cuando sigan siendo legibles; en caso contrario, disposición de una o dos columnas según contenido.
- CTA sticky por encima del safe area.
- Audio y opciones dentro del primer recorrido visual.
- Sin scroll horizontal.
- El teclado no ocultará inputs en plantillas futuras.

Se verificará a 360, 390, 768, 1024 y 1366 px.

## Accesibilidad y movimiento

- Contraste WCAG AA en texto, controles y estados.
- Objetivos táctiles mínimos de 56 px en `p12` y 52 px en `p34`.
- Orden de foco equivalente al orden visual.
- Progreso y audio anunciados correctamente.
- Ningún significado depende únicamente del color o de la ilustración.
- `prefers-reduced-motion` y el ajuste interno eliminan ondas, saltos y entradas animadas.

## Pruebas de aceptación

- `p12` presenta una experiencia claramente más visual que `p34`, `p56` y `eso`.
- Seleccionar una respuesta no muestra un check ni parece un acierto.
- Comprobar respuesta correcta e incorrecta muestra estados inequívocos y accesibles.
- El audio reproduce, cambia de estado y puede repetirse.
- El CTA se activa solo cuando la respuesta está completa.
- Progreso, salida y persistencia de misión siguen funcionando.
- Las opciones sin ilustración tienen fallback textual correcto.
- No hay emojis estructurales nuevos.
- No existe scroll horizontal en los breakpoints objetivo.
- La consola queda sin errores y pasan las pruebas del motor, matriz, progreso y persistencia.

## Fuera de alcance

- Rediseñar las pantallas de 10–11 años o ESO.
- Crear una segunda aplicación o duplicar `leccion.html`.
- Introducir una librería de animación o un motor gráfico.
- Generar automáticamente ilustraciones durante la sesión.
- Cambiar contenidos pedagógicos no relacionados con la presentación de esta iteración.
