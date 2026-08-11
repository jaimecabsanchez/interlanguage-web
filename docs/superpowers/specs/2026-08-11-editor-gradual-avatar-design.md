# Editor gradual del avatar sin cambiar su estética

Fecha: 11 de agosto de 2026

## Objetivo

Permitir que cada alumno adapte gradualmente el avatar para que se parezca a él, con una experiencia inspirada en la creación de personajes de *Los Sims*, sin sustituir ni redibujar la estética de los avatares actuales.

La base masculina o femenina seguirá asignándose exclusivamente desde Administración mediante `students.sex`. El alumno no podrá cambiar esa base, pero sí podrá modificar rostro, piel, pelo, ojos, cejas, nariz, boca, ropa y accesorios.

## Restricción visual principal

El estado neutro del nuevo compositor debe coincidir visualmente con los másteres actuales:

- Masculino: `plataforma/assets/avatar/look-01.png` (`1024 × 1536`).
- Femenino: `plataforma/assets/avatar/look-05.png` (`1254 × 1254`).

No se reutilizarán como base las capas actuales de `assets/avatar/layers/`. Esas capas se produjeron en un lienzo de `1024 × 1536` y su anatomía no coincide con el máster femenino cuadrado; esa incompatibilidad fue la causa de la deformación observada.

No se cambiarán la pose, el acabado 2.5D, la expresión amable, la ropa inicial, el peinado inicial ni las proporciones neutras de los personajes aprobados.

## Enfoques descartados

### Catálogo de avatares completos

Generar una imagen completa por combinación conservaría el acabado, pero provocaría una explosión combinatoria y no permitiría ajustes continuos acumulables.

### Avatar 3D o WebGL

Ofrecería deformación geométrica avanzada, pero cambiaría el lenguaje visual actual, aumentaría mucho el peso y la complejidad, y sería innecesario para el producto.

### Escalado libre de capas antiguas

Escalar ojos, nariz, boca y pelo como imágenes independientes sin anclajes compartidos genera separaciones, solapamientos y proporciones irreales. No se volverá a usar este método.

## Solución aprobada: rig 2D derivado de los másteres

Se creará un rig 2D independiente para cada base. Las piezas que componen el estado neutro se extraerán del máster correspondiente y conservarán su lienzo nativo, iluminación, textura y posición. Los peinados, prendas y accesorios alternativos serán recursos adicionales construidos sobre esos mismos anclajes y deberán igualar el acabado del máster antes de incorporarse al catálogo.

Cada rig tendrá:

- una base corporal con las proporciones exactas del personaje;
- cabeza y zonas de piel con sombreado original;
- pelo delantero y trasero;
- ojos, iris y párpados;
- cejas;
- nariz;
- boca;
- conjunto de ropa inicial;
- puntos de anclaje para ropa y accesorios;
- una definición de límites seguros para cada transformación.

La extracción podrá reconstruir únicamente las zonas originalmente ocultas que sean necesarias para intercambiar piezas. No se redibujarán las partes visibles del estado neutro ni se generará un personaje visualmente distinto. Cada recurso alternativo se aprobará comparándolo junto al máster, con el personaje en la misma escala y pose.

Los dos lienzos pueden tener dimensiones diferentes. El renderizador normalizará su presentación mediante un contenedor común, sin reescalar piezas individuales con coordenadas de la otra base.

## Modelo de personalización

Los parámetros continuos se guardarán normalizados entre `-1` y `1`, con `0` como estado original. Los colores se guardarán mediante identificadores de una paleta aprobada. Los estilos discretos usarán identificadores estables.

Configuración propuesta:

```js
{
  avatarBase: "feminine",       // impuesta por students.sex
  avatarRigVersion: 1,
  faceWidth: 0,
  faceLength: 0,
  cheekVolume: 0,
  jawWidth: 0,
  skinTone: "original",
  hairStyle: "original",
  hairLength: 0,
  hairVolume: 0,
  hairColour: "original",
  eyeSize: 0,
  eyeSpacing: 0,
  eyeHeight: 0,
  eyeColour: "original",
  browThickness: 0,
  browArch: 0,
  browSpacing: 0,
  noseWidth: 0,
  noseLength: 0,
  noseHeight: 0,
  mouthWidth: 0,
  mouthCurve: 0,
  mouthHeight: 0,
  outfitStyle: "original",
  outfitColour: "original",
  accessoryStyle: "none",
  accessorySize: 0,
  accessoryHeight: 0
}
```

`avatarBase` se recalculará desde el perfil en cada inicio de sesión. A diferencia del comportamiento anterior, esto no borrará las demás personalizaciones mientras el sexo asignado no cambie. Si Administración cambia el sexo, se iniciará el rig de la nueva base en estado neutro para evitar aplicar coordenadas incompatibles.

La persistencia seguirá el sistema versionado actual de `profile-settings.js`. Una migración local convertirá preferencias antiguas a los nuevos valores neutros. La sincronización entre dispositivos no forma parte de esta entrega.

## Comportamiento de los controles

### Parámetros graduales

Usarán líneas deslizantes con un punto central claramente marcado:

- Rostro: anchura, longitud, volumen de mejillas y mandíbula.
- Pelo: longitud, volumen y color.
- Ojos: tamaño, separación, altura y color.
- Cejas: grosor, arco y separación.
- Nariz: anchura, longitud y altura.
- Boca: anchura, curvatura y altura.
- Accesorios: tamaño y altura cuando el elemento lo admita.
- Colores de piel y ropa: recorrido gradual por una paleta acotada.

Cada deslizador mostrará una etiqueta comprensible, su valor verbal —por ejemplo, “Medio”, “Más ancho” o “Más oscuro”— y un botón individual para volver al centro.

### Opciones discretas

Como en *Los Sims*, los elementos que no pueden transformarse de manera continua usarán un catálogo de opciones:

- tipo de peinado;
- tipo de prenda;
- tipo de accesorio.

Después de elegir una opción se habilitarán sus ajustes graduales compatibles. No se simulará una transición falsa entre, por ejemplo, una camiseta y una sudadera.

## Interfaz del alumno

La pestaña `Avatar` volverá a mostrar un editor, pero nunca mostrará `Masculino` o `Femenino`.

La navegación interna tendrá estas categorías:

1. Rostro
2. Piel
3. Pelo
4. Ojos
5. Cejas
6. Nariz
7. Boca
8. Ropa
9. Accesorios

La vista previa permanecerá visible mientras se ajustan los controles. Los cambios se aplicarán durante el movimiento del deslizador y se guardarán al terminar la interacción. Existirán dos acciones diferenciadas:

- `Centrar este ajuste`, junto a cada control.
- `Restablecer avatar`, con confirmación, que devuelve todos los parámetros al máster asignado.

El botón `Sorpréndeme` solo podrá producir combinaciones que hayan superado los límites de seguridad visual.

La pestaña `Mundo` seguirá funcionando de forma independiente.

## Arquitectura del frontend

### `avatar-rig.js`

Nuevo módulo responsable de:

- validar y normalizar parámetros;
- seleccionar el rig masculino o femenino;
- convertir valores `-1…1` en transformaciones acotadas;
- calcular transformaciones ligadas entre piezas;
- generar el marcado del compositor;
- usar el máster como fallback seguro.

### `avatar-rig-data.js`

Definirá por cada base:

- dimensiones del lienzo;
- rutas de las capas;
- centros y anclajes;
- relaciones entre rasgos;
- límites mínimos y máximos;
- compatibilidad de peinados, ropa y accesorios.

Los datos geométricos no se mezclarán con la interfaz para poder corregir un anclaje sin modificar controles ni persistencia.

### `world-visual.js`

Delegará el avatar a `avatar-rig.js`. Si falta una capa o la configuración no es válida, mostrará inmediatamente `look-01.png` o `look-05.png` en lugar de dejar una figura incompleta.

### `world-page.js`

Renderizará categorías, deslizadores, catálogos y acciones. La base asignada será de solo lectura. La lógica del editor no contendrá coordenadas de la ilustración.

### `profile-settings.js`

Guardará la configuración versionada, aplicará valores neutros a claves desconocidas y preservará la personalización mientras la base administrativa no cambie.

## Reglas geométricas para evitar deformaciones

- La cabeza, orejas, pelo y rasgos compartirán un sistema de coordenadas por base.
- Al cambiar la anchura del rostro, los ojos, cejas, nariz y boca se desplazarán mediante anclajes relativos; no se escalará cada pieza desde su propio centro.
- Los dos ojos mantendrán simetría y se transformarán como pareja.
- La nariz y la boca conservarán su eje central.
- El pelo seguirá el contorno de la cabeza y tendrá límites específicos por peinado.
- Ropa y accesorios usarán anclajes del cuerpo o la cabeza, nunca coordenadas absolutas reutilizadas entre sexos.
- Los extremos de cada deslizador se definirán mediante pruebas visuales; no se permitirán valores fuera de esos límites.

## Color y conservación del acabado

Los cambios de color conservarán luces, sombras y textura. Se aplicarán máscaras de color sobre las capas correspondientes, no filtros globales sobre el avatar completo.

Las paletas usarán valores controlados para evitar pieles irreales, pérdida de contraste o ropa que se confunda con el fondo. La interfaz utilizará únicamente tokens `--il-*`; los colores internos de la ilustración vivirán en los datos del rig.

## Accesibilidad y rendimiento

- Todos los controles usarán `<input type="range">` con `<label>` y `aria-valuetext`.
- El teclado permitirá mover cada control y regresar a su punto neutro.
- El valor actual no dependerá únicamente del color.
- La navegación de categorías será operable con flechas.
- Se respetará `prefers-reduced-motion` y la preferencia local de reducción de movimiento.
- Las transformaciones durante el arrastre usarán `transform` y variables CSS para mantener una respuesta fluida.
- Las capas se precargarán por categoría, no todas a la vez, para reducir memoria y tiempo inicial.
- La interfaz se verificará a 320, 768, 1024 y 1440 píxeles.

## Gestión de errores

- Parámetros desconocidos o corruptos vuelven al valor neutro correspondiente.
- Una capa que no carga desactiva únicamente los controles afectados y mantiene visible el máster.
- Si el rig completo no puede inicializarse, se usa el avatar original y se informa de que la personalización no está disponible temporalmente.
- Nunca se muestra una mezcla parcial de dos bases.
- `Restablecer avatar` siempre queda disponible aunque una categoría falle.

## Pruebas y criterios de aceptación

### Fidelidad visual

- Con todos los parámetros a `0` y estilos originales, el rig coincide con el máster asignado sin saltos perceptibles.
- Activar el editor no cambia por sí solo el tamaño, pose, rostro, peinado ni ropa del avatar.
- Ninguna combinación admitida produce ojos fuera del rostro, pelo flotante, boca o nariz descentradas, ropa separada o cuerpo estirado.

### Asignación administrativa

- `male` carga exclusivamente el rig masculino.
- `female` carga exclusivamente el rig femenino.
- El alumno no puede cambiar `avatarBase` desde ninguna pantalla.
- Un cambio administrativo de sexo reinicia de forma segura el rig de la nueva base.

### Personalización

- Todas las categorías aprobadas tienen efecto visible y acumulable.
- Los controles graduales actualizan la vista en directo.
- Peinado, ropa y accesorios se eligen mediante catálogo y exponen solo ajustes compatibles.
- Los cambios se conservan al navegar por Inicio, Perfil, Progreso, Lección y Mundo.
- Restablecer devuelve exactamente el avatar original asignado.

### Calidad técnica

- No hay errores de consola ni recursos 404.
- Todos los tests existentes continúan pasando.
- Se añaden pruebas para validación, migración, límites, asignación por sexo y fallback del rig.
- Se realizan capturas de los estados neutros y extremos de ambos avatares para revisión visual.

## Fuera de alcance

- Cambiar la base masculina o femenina desde la cuenta del alumno.
- Sustituir los avatares actuales por un estilo nuevo.
- Crear un motor 3D.
- Fotografías, reconocimiento facial o generación automática desde una foto del menor.
- Sincronización de la configuración del avatar entre dispositivos.
