# Avatar con cambios locales y base permanente

Fecha: 12 de agosto de 2026

## Problema confirmado

La implementación actual cambia del avatar maestro a una reconstrucción completa cuando el alumno modifica el primer control. Aunque el control corresponda a un solo rasgo, se sustituyen simultáneamente cuerpo, cabeza, ojos, pelo y ropa. Ese cambio global produce el salto visual y las deformaciones observadas.

## Resultado aprobado

El avatar maestro asignado por Administración permanecerá siempre como base visible:

- masculino: `plataforma/assets/avatar/look-01.png`;
- femenino: `plataforma/assets/avatar/look-05.png`.

Cada ajuste modificará exclusivamente su región:

- color de pelo: solo el pelo;
- color de ojos: solo los iris;
- tono de piel: solo la piel;
- color de ropa: solo la prenda;
- accesorio: solo el accesorio;
- peinado o rasgo geométrico: únicamente la pieza correspondiente, cuando exista un recurso que encaje con el máster.

El resto del avatar debe permanecer visualmente idéntico antes y después de cada operación.

## Enfoques considerados

### Elegido: máster permanente con capas diferenciales

El máster completo se renderiza en todo momento. Encima se aplican máscaras transparentes que contienen únicamente la región modificable. Los colores se aplican a esas máscaras conservando luces, sombras y textura. Los elementos alternativos usan los mismos anclajes y dimensiones que el máster.

### Descartado: reconstrucción completa por capas

Es el comportamiento actual. Obliga a cambiar todo el personaje al activar cualquier ajuste y no puede garantizar continuidad visual con el máster.

### Descartado: imágenes completas por combinación

Evitaría algunas deformaciones, pero un cambio de pelo podría modificar también cara, cuerpo o pose. Además, el número de combinaciones crecería de forma impracticable.

## Arquitectura

### Render base

`avatar-rig.js` generará un contenedor por capas cuyo primer elemento será siempre el máster. No existirá una bifurcación entre “avatar original” y “avatar personalizado”. Personalizar añadirá deltas encima del mismo máster.

### Capas de color

Cada base tendrá máscaras alineadas al lienzo nativo:

- `hair-mask.png`;
- `iris-mask.png`;
- `skin-mask.png`;
- `outfit-mask.png`.

Las máscaras tendrán transparencia fuera de su región. El color se aplicará con una técnica que preserve luminosidad y textura. El valor `original` no renderizará ninguna capa, por lo que será idéntico al archivo maestro.

### Cambios discretos

Peinados, prendas y accesorios alternativos se renderizarán como deltas transparentes. Un delta solo se incorporará al catálogo si:

1. comparte el lienzo y los anclajes del máster correspondiente;
2. no contiene cambios fuera de la región declarada;
3. no deja visible la pieza original debajo;
4. supera una comparación visual en tamaño real y en la vista de perfil.

Si una opción no cumple esos criterios, quedará oculta hasta disponer del recurso correcto. Nunca se usará como sustitución automática una reconstrucción completa.

### Controles geométricos

Los controles de tamaño, posición o forma operarán únicamente sobre un delta local. Los controles que todavía dependan de reconstruir toda la cabeza se deshabilitarán temporalmente. La prioridad es conservar el avatar antes que simular una personalización incorrecta.

## Persistencia y migración

Las preferencias actuales se conservarán, pero la versión del render se incrementará. Al migrar:

- el máster asignado seguirá dependiendo exclusivamente del sexo administrado;
- los colores válidos se mantendrán;
- cualquier configuración geométrica incompatible volverá a su valor neutro;
- el avatar nunca se mostrará incompleto si falta un recurso.

## Comportamiento de la interfaz

La navegación seguirá mostrando las categorías aprobadas, pero solo presentará controles funcionales y visualmente seguros. Al mover un control:

1. se actualiza únicamente su capa;
2. se conserva el resto del DOM visual del avatar;
3. se guarda la preferencia al terminar la interacción;
4. `Restablecer` elimina los deltas y recupera el máster exacto.

El selector masculino/femenino no aparecerá para el alumno.

## Validación obligatoria

La entrega no se considerará terminada solo con pruebas de código. Para cada base se comprobará en navegador:

- estado original frente a estado restablecido;
- cada color de pelo;
- cada color de iris;
- cada tono de piel;
- cada color de ropa;
- cada peinado, prenda o accesorio que permanezca habilitado;
- cambios consecutivos para confirmar que no alteran categorías anteriores;
- vistas de 320, 768, 1024 y 1440 píxeles.

Las pruebas automatizadas verificarán que el máster siempre forma parte del render, que cada preferencia añade solo su delta declarado y que ninguna modificación vuelve a activar el compositor completo anterior.

## Fuera de alcance

- Crear un modelo 3D.
- Generar todas las combinaciones como imágenes completas.
- Mantener visibles controles que no puedan ofrecer un resultado limpio.
- Cambiar la estética, pose o proporciones originales del avatar maestro.
