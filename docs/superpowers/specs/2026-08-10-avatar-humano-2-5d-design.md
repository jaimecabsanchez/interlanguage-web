# Avatar humano 2.5D

Fecha: 2026-08-10  
Estado: diseño aprobado

## Objetivo

Evolucionar el avatar modular actual hacia una representación 2.5D ligera, más humana y expresiva, sin introducir WebGL, modelos tridimensionales, dependencias externas ni pérdida de personalización. El personaje debe sentirse propio de Interlanguage y funcionar con fluidez en móviles de gama media.

## Dirección visual

El resultado será estilizado, juvenil y humano, no hiperrealista. Mantendrá una vista principalmente frontal con una ligera orientación de tres cuartos para ganar volumen. La profundidad se construirá mediante capas SVG, degradados discretos, luces, sombras y planos faciales.

- Proporciones anatómicas más naturales: cabeza, cuello, hombros y torso conectados.
- Orejas, mandíbula y pómulos integrados en la silueta.
- Ojos con blanco, iris, pupila, párpado superior, brillo y sombra suave.
- Cejas con volumen y posición coherente con cada forma de ojo.
- Nariz construida con puente, punta y sombra lateral, sin contorno caricaturesco duro.
- Boca con labios suaves, comisuras y expresión legible.
- Pelo dividido en masa posterior, volumen principal, mechones frontales y brillo.
- Ropa con cuello, costuras y sombra corporal para integrarse con el personaje.

La paleta seguirá utilizando los tokens existentes. Los degradados solo servirán para modelar volumen y no como decoración general.

## Enfoques evaluados

### 3D real con WebGL

Permitiría rotación completa, pero exige modelos, texturas, rigging, un motor de renderizado y una carga gráfica muy superior. También duplicaría la complejidad de cada opción cosmética y rompería el enfoque ligero del proyecto.

### Imágenes prerenderizadas

Podrían ofrecer mucho detalle, pero generarían una combinación de recursos difícil de mantener y descargar. No permiten mezclar de forma flexible todos los tonos, rasgos y prendas actuales.

### SVG modular 2.5D — seleccionado

Conserva la arquitectura y la personalización instantánea. Permite crear volumen mediante geometría, máscaras, degradados y filtros SVG limitados, manteniendo archivos pequeños, accesibilidad, adaptación por edad y compatibilidad móvil.

## Anatomía y composición

El render del avatar se organizará en capas estables:

1. Sombra ambiental.
2. Torso y hombros.
3. Cuello y sombra bajo la mandíbula.
4. Pelo posterior.
5. Orejas.
6. Cabeza y planos de luz facial.
7. Ojos, iris, pupilas y párpados.
8. Cejas.
9. Nariz y sombra nasal.
10. Boca.
11. Pelo frontal.
12. Ropa y accesorios.
13. Luz de contorno opcional.

Las capas compartirán una única fuente de geometría en `world-visual.js`. Las miniaturas del editor reutilizarán el mismo render con un nivel de detalle reducido; no se mantendrán dos implementaciones visuales diferentes.

## Adaptación por edad

### Primaria inicial

- Cabeza ligeramente mayor respecto al torso.
- Formas más redondeadas y expresiones más visibles.
- Ojos algo mayores dentro de límites naturales.
- Contraste visual claro y acabados cálidos.
- Encuadre cercano para facilitar el reconocimiento del propio avatar.

### Primaria superior

- Proporción equilibrada entre cabeza y hombros.
- Rasgos expresivos con menor exageración.
- Mayor protagonismo de peinado, ropa y accesorios.

### ESO

- Cabeza y torso con proporciones más maduras.
- Ojos y expresiones más sobrios.
- Menos brillo y decoración ambiental.
- Encuadre algo más amplio y estética cercana a un perfil juvenil.

La etapa cambiará parámetros de representación, no la identidad guardada. El mismo tono de piel, forma de rostro, pelo u ojos seguirá siendo reconocible al cambiar el modo demo.

## Personalización y datos

Se conservarán todas las claves actuales de `profile-settings.js`:

- tono de piel;
- forma y anchura de rostro;
- forma, tamaño y color de ojos;
- forma de cejas;
- forma y longitud de nariz;
- forma de boca;
- peinado y color de pelo;
- ropa y accesorios.

No se requiere migración destructiva. Si se añaden parámetros exclusivamente visuales, se derivarán de los valores existentes y de la etapa, sin persistir datos redundantes.

Los rasgos físicos básicos permanecerán disponibles desde el inicio. Ningún tono de piel, color de ojos, forma facial o nariz dependerá de puntos, rachas o rendimiento. Los desbloqueos se limitarán a cosméticos no identitarios.

## Interacción

- Cada ajuste continuará apareciendo en la vista previa en el mismo instante.
- La transición entre variantes será breve y localizada: luz, pelo o rasgo modificado.
- No habrá giro libre ni controles que sugieran un modelo 3D real.
- Una oscilación de perspectiva de pocos grados podrá utilizarse únicamente como respuesta al cambio, nunca de forma continua.
- `prefers-reduced-motion` y el ajuste interno desactivarán estas transiciones.
- El editor conservará foco, anuncios `aria-live` y uso completo con teclado.

## Rendimiento

- Un único SVG por avatar y sin recursos remotos.
- Degradados reutilizables mediante `defs` y referencias por identificador.
- Filtros SVG limitados a sombras suaves de bajo coste; se evitarán desenfoques grandes y filtros encadenados.
- Sin animaciones continuas ni cálculos en cada frame.
- La actualización seguirá siendo una sustitución localizada del SVG actual.
- Se verificará fluidez, ausencia de saltos de layout y tamaño razonable del DOM.

## Archivos previstos

- `plataforma/world-visual.js`: nueva composición 2.5D y parámetros por edad.
- `plataforma/world.css`: encuadre, profundidad del escenario y transiciones.
- `plataforma/world-page.js`: solo si hace falta transmitir la etapa o localizar la animación del rasgo.
- `plataforma/perfil.html`: actualización de versión de caché y verificación del avatar resumido.
- `plataforma/tienda.html`: actualización de versión de caché y ajustes semánticos si fueran necesarios.
- Pruebas existentes o nuevas para asegurar render, persistencia y ausencia de valores inválidos.

## Criterios de aceptación

- El avatar se percibe con volumen y rasgos humanos a primera vista.
- Cabeza, cuello, hombros, torso y ropa forman una silueta corporal coherente.
- Ojos, nariz, orejas, cejas y boca son identificables y cambian con los controles existentes.
- Todas las variantes de piel, pelo, ojos y rostro siguen funcionando.
- Los tres perfiles de edad presentan un acabado apropiado sin duplicar el avatar.
- La configuración guardada antes del cambio se conserva tras recargar.
- Perfil y Mi mundo muestran la misma identidad.
- No se añaden dependencias, peticiones de red ni archivos rasterizados pesados.
- El avatar funciona a 360, 390, 768, 1024 y 1366 px sin recortes inesperados.
- No aparecen errores de consola y pasan las pruebas existentes.
- Las animaciones respetan la reducción de movimiento.

## Fuera de alcance

- Rotación 360° y cámara manipulable.
- Modelos 3D, WebGL, canvas o motor de videojuegos.
- Rigging, animación corporal compleja o sincronización labial.
- Generación de rostros mediante IA.
- Hiperrealismo o representación corporal evaluable mediante recompensas.
