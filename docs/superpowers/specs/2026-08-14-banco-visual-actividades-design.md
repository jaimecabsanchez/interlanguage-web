# Banco visual coherente para todas las actividades

Fecha: 2026-08-14

## Objetivo

Toda actividad que use apoyo gráfico debe mostrar una ilustración editorial coherente con la edad del alumno. Los emojis y los SVG esquemáticos dejan de ser la representación principal del contenido pedagógico. El sistema debe cubrir el banco actual y evitar regresiones cuando se añadan ejercicios nuevos.

## Alcance

La primera entrega cubre todas las representaciones visuales del banco actual:

- material escolar: `book`, `pencil`, `school-bag`, `chair`;
- rutinas: `breakfast`, `shower`, `bed`, `go-to-school`;
- alimentos: `apple`, `banana`, `milk`, `bread`, `cheese`, `egg`;
- saludos: `good-morning`, `good-night`, `goodbye`.

Se aplicará en las plantillas que muestran opciones o asociaciones visuales, especialmente `elegir_imagen`, las opciones con apoyo automático y `emparejar`. No se añadirán imágenes decorativas a ejercicios puramente textuales.

## Dirección visual por edad

### 5–7 años (`p12`)

- Escenas grandes, cálidas, fáciles de reconocer y con un único foco.
- Ilustración editorial infantil pintada, textura suave y viñeta orgánica.
- La imagen ocupa la mayor parte de la tarjeta; el texto confirma el significado.
- Tres opciones por fila cuando el espacio lo permite, manteniendo objetivos táctiles y lectura clara.

### 8–9 años (`p34`)

- Mismo universo ilustrado para conservar continuidad.
- Imagen más compacta y mayor protagonismo del texto.
- Menos ornamentación y mayor densidad de información.

### 10–11 años (`p56`)

- El apoyo visual aparece solo cuando forma parte real de la tarea.
- Imágenes pequeñas, encuadres limpios y tarjetas menos lúdicas.
- Sin elementos decorativos añadidos alrededor de la ilustración.

### ESO (`eso`)

- No se fuerzan ilustraciones en actividades de texto, gramática, lectura o conversación.
- Cuando un ejercicio necesite una imagen para responder, se usará una variante editorial más sobria: encuadre rectangular, color contenido y sin caras infantilizadas.
- La jerarquía principal sigue siendo la consigna y la decisión lingüística.

## Arquitectura

### 1. Manifiesto visual

El motor dispondrá de un registro único que relaciona una clave semántica con su archivo y texto alternativo. El contenido deja de depender de la apariencia del emoji. Las claves se normalizan en inglés y con guiones, por ejemplo `school-bag` o `have-breakfast`.

Cada entrada contiene:

- `src`: ruta del recurso;
- `label`: significado accesible;
- `ageTreatment`: reglas de presentación por tramo si fueran necesarias.

La resolución seguirá este orden:

1. clave visual explícita del contenido;
2. texto normalizado de la opción;
3. compatibilidad temporal con el emoji antiguo;
4. ausencia de imagen y aviso de validación en desarrollo.

### 2. Contrato editorial

Los ejercicios nuevos que necesiten imagen deberán declarar `visual`, no insertar un emoji como representación final. Los emojis existentes seguirán aceptándose durante la migración, pero el motor los traducirá a una clave del manifiesto y nunca los dibujará directamente.

Ejemplo:

```js
{ visual: "book", texto: "book", correcta: true }
```

Los emparejamientos usarán claves semánticas en el lado visual:

```js
{ a: "book", b: "book" }
```

### 3. Recursos

Los archivos viven en `plataforma/assets/ejercicios/` y siguen nombres estables en minúsculas y con guiones. Las ilustraciones del banco actual compartirán:

- estilo editorial pintado;
- textura suave;
- fondo/viñeta orgánica integrada;
- ausencia de texto, marcas de agua y marcos de interfaz;
- foco inequívoco en el concepto representado.

Los SVG actuales de `engine.js` se retirarán como salida pedagógica. Los iconos funcionales de interfaz —audio, cerrar, progreso, habilidad— continúan viniendo de `layout.js`, porque cumplen otra función.

## Renderizado y accesibilidad

- La imagen se marca como decorativa cuando el texto visible ya expresa la respuesta, evitando duplicación en lectores de pantalla.
- En emparejamientos donde la imagen sea la única pista visible, se añade un nombre accesible oculto.
- La selección, corrección y error no dependen solo del color.
- Se preservan navegación por teclado, foco visible y tamaños táctiles.
- Las imágenes se decodifican de forma asíncrona; las de la primera actividad pueden cargarse con prioridad y el resto de forma diferida.

## Validación automática

Se añadirá una prueba de cobertura que recorra `IL_CONTENIDO` y compruebe:

- todo `elegir_imagen` tiene recurso para cada opción;
- todo par visual de `emparejar` tiene recurso;
- no existe un emoji renderizado como representación final;
- todas las rutas del manifiesto corresponden a archivos presentes;
- ninguna actividad de ESO recibe ilustración infantil de forma automática.

La prueba fallará con el identificador del ejercicio y la clave ausente para que el contenido futuro no pueda introducir incoherencias silenciosas.

## Compatibilidad y errores

- Si un recurso no carga, la tarjeta mantiene su texto y la interacción sigue funcionando.
- En desarrollo se registra la clave faltante; en producción no se muestra un icono roto.
- El contenido creado por el mini-CMS se valida con la misma lógica antes de incorporarse a una sesión.
- La migración no cambia respuestas correctas, pedagogía, progreso ni almacenamiento.

## Criterios de aceptación

1. Todos los conceptos visuales actuales aparecen como ilustraciones coherentes, no como emojis ni SVG simplificados.
2. `elegir_imagen` y `emparejar` comparten el mismo banco y la misma dirección artística.
3. Las diferencias `p12`, `p34`, `p56` y `eso` son visibles y respetan la madurez del alumno.
4. No hay desbordamiento horizontal a 320, 390, 768, 1024 o 1440 píxeles.
5. Las pruebas existentes siguen pasando y la nueva prueba de cobertura detecta recursos ausentes.
6. Las páginas que carguen JS/CSS modificado actualizan su `?v=`.

## Fuera de alcance

- Generar ilustraciones automáticamente en tiempo de ejecución.
- Convertir iconos funcionales de navegación o controles en escenas ilustradas.
- Añadir imágenes decorativas a todas las actividades de ESO.
- Cambiar el modelo pedagógico, las respuestas o la estructura de Supabase.
