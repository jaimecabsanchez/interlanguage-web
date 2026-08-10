# Editor de avatar y mundo v3

Fecha: 2026-08-10  
Estado: diseño aprobado

## Objetivo

Reemplazar el catálogo visualmente ruidoso de `Mi mundo` por un editor de personalización progresivo, comprensible para alumnos de 5 años y suficientemente completo y maduro para Primaria superior y ESO. El alumno debe ver cada cambio en el avatar o en el paisaje en el mismo momento y sin desplazarse entre el control y la vista previa.

La referencia de interacción son los creadores de personajes de videojuegos actuales, sin reproducir su complejidad, identidad ni patrones propietarios.

## Principios de experiencia

- Una vista previa protagonista, persistente y siempre próxima a los controles.
- Una característica por apartado; no mostrar simultáneamente decenas de tarjetas.
- Controles graduales cuando exista una progresión natural y opciones discretas cuando la forma sea cualitativamente distinta.
- Actualización optimista inmediata y guardado automático con la persistencia local existente.
- Personalización inclusiva y neutral: sin etiquetas de género, sin juicios sobre rasgos y sin mecánicas que valoren una apariencia sobre otra.
- Desbloqueos vinculados a práctica y logros, nunca a gemas, pagos o comparaciones sociales.

## Enfoques considerados

### Solo controles deslizantes

Ofrece sensación de precisión, pero es poco comprensible para elegir cortes de pelo, formas de ojos o prendas. También produce resultados visuales difíciles de garantizar con el SVG actual.

### Catálogo de tarjetas actual ampliado

Es compatible con la arquitectura existente, pero multiplica el ruido visual y obliga a recorrer demasiadas opciones antes de comprender el resultado.

### Editor híbrido por rasgos — seleccionado

Combina líneas graduales para color y proporciones con selectores visuales compactos para formas. Mantiene mucha variedad sin convertir la pantalla en una herramienta profesional compleja.

## Arquitectura de la pantalla

La ruta existente `tienda.html` se conserva internamente para no romper enlaces, pero la interfaz seguirá llamándose `Mi mundo`.

En escritorio se utilizarán dos columnas:

1. Vista previa fija del avatar o del mundo.
2. Panel de edición con navegación por categorías y un único apartado abierto.

En móvil:

1. Vista previa compacta y pegajosa en la parte superior del contenido.
2. Navegación de categorías inmediatamente debajo.
3. Controles del apartado activo en una bandeja vertical.

No se bloqueará el scroll de la página y no habrá scroll horizontal global. Las pequeñas tiras de formas podrán desplazarse horizontalmente con indicadores claros cuando sea necesario.

## Navegación del editor

Las áreas principales serán:

- Avatar.
- Ropa.
- Accesorios.
- Mundo.

Dentro de `Avatar` se mostrará un índice compacto de rasgos:

- Rostro.
- Piel.
- Pelo.
- Ojos.
- Cejas.
- Nariz.
- Boca.

Solo se renderizarán los controles del rasgo activo. El cambio de rasgo actualizará el título, la ayuda breve y los valores disponibles, sin recargar la página.

## Modelo de controles

### Controles graduales

Se usarán para:

- Tono de piel.
- Color de pelo.
- Color de ojos.
- Anchura de rostro.
- Longitud de nariz.
- Tamaño visual de ojos dentro de límites seguros.

El control tendrá una línea, marcadores discretos y botones anterior/siguiente accesibles. Aunque visualmente parezca continuo, se guardará un valor normalizado y validado para garantizar resultados estables y migraciones seguras.

### Selectores de forma

Se usarán para:

- Forma del rostro.
- Corte y textura del pelo.
- Forma de ojos.
- Tipo de cejas.
- Forma de nariz.
- Forma o expresión de la boca.
- Prendas y accesorios.

Cada opción será un botón visual pequeño con nombre accesible, estado seleccionado, bloqueo y requisito cuando proceda. No se repetirá una tarjeta completa con título, estado y CTA para cada valor.

### Acciones auxiliares

- `Sorpréndeme`: crea una combinación únicamente con elementos desbloqueados y la guarda.
- `Restablecer`: vuelve a una configuración neutral tras confirmación ligera.
- Estado `Guardado` discreto y anunciado mediante `aria-live`.

## Avatar humano modular

El SVG se ampliará sin añadir una librería externa. Sus capas serán independientes:

1. Pelo posterior.
2. Cabeza y orejas.
3. Cejas.
4. Ojos, iris y pupilas.
5. Nariz.
6. Boca.
7. Pelo frontal.
8. Cuello, cuerpo, brazos y piernas.
9. Ropa.
10. Accesorios.

Nuevos valores persistidos:

- `avatarFaceShape`.
- `avatarFaceWidth`.
- `avatarEyeShape`.
- `avatarEyeColor`.
- `avatarEyeSize`.
- `avatarBrowShape`.
- `avatarNoseShape`.
- `avatarNoseLength`.
- `avatarMouthShape`.

Se conservarán y migrarán los valores existentes de piel, pelo, color de pelo, expresión, ropa y accesorios. Los valores inválidos se normalizarán mediante `profile-settings.js`.

La variedad inicial incluirá al menos:

- 8 tonos de piel ordenados de claro a oscuro.
- 6 colores de pelo.
- 8 cortes o texturas de pelo.
- 5 colores de ojos.
- 4 formas de rostro.
- 4 formas de ojos.
- 4 cejas.
- 4 narices.
- 4 bocas o expresiones.

Los rasgos básicos estarán disponibles desde el inicio. Los desbloqueos se reservarán principalmente para peinados especiales, ropa, accesorios y elementos del mundo para evitar que la apariencia física básica dependa del rendimiento educativo.

## Edición del paisaje

Al entrar en `Mundo`, la vista previa cambiará del encuadre del avatar al escenario completo, pero permanecerá en la misma posición fija.

El panel se dividirá en:

- Ambiente: día, atardecer, ciudad o noche según etapa y desbloqueos.
- Objetos colocados.
- Objetos disponibles.
- Compañero, solo cuando sea adecuado para la edad.

Pulsar `Añadir` o `Quitar` actualizará el SVG del escenario inmediatamente y mantendrá el foco en el control activado. El botón cambiará de estado y texto sin reconstruir toda la pantalla. La vista previa hará una microanimación localizada en el elemento modificado, respetando `prefers-reduced-motion` y el ajuste interno de reducción de movimiento.

En escritorio el escenario será `position: sticky`. En móvil la vista previa será más baja y `sticky` dentro del flujo, evitando ocultar los controles o la navegación inferior.

## Adaptación por edad

### 5–7 años (`p12`)

- Categorías con icono y texto grande.
- Máximo de cinco opciones visibles por rasgo antes de usar `Ver más`.
- Ayudas breves en español.
- Más separación y objetivos táctiles de al menos 48 px.
- `Sorpréndeme` visible.
- Sin controles numéricos ni terminología técnica.

### 8–9 años (`p34`)

- Misma arquitectura con algo más de densidad.
- Más peinados y accesorios visibles.
- Etiquetas sencillas y apoyo visual prioritario.

### 10–11 años (`p56`)

- Panel más compacto.
- Más opciones simultáneas.
- Base personal en lugar de jardín infantil.
- Controles de detalle visibles sin `Ver más`.

### ESO (`eso`)

- Copia principalmente en inglés.
- Menos decoración y animación.
- Espacio personal sobrio.
- Navegación compacta y mayor densidad útil.
- Compañeros infantiles ocultos.

## Datos, desbloqueos y persistencia

`profile-settings.js` seguirá siendo la fuente local versionada. Se ampliará de forma retrocompatible: un alumno con configuración previa conservará avatar, ropa, accesorios, fondo y objetos.

`world-data.js` seguirá definiendo las opciones desbloqueables y sus requisitos. Los rasgos físicos básicos no estarán bloqueados. El editor consultará el catálogo para ropa, accesorios, peinados especiales y mundo.

Cada cambio se guardará inmediatamente. Si el almacenamiento falla, la vista conservará el cambio durante la sesión y mostrará un aviso no agresivo. No se inventará un backend nuevo.

## Componentes y responsabilidades

- `world-page.js`: estado del editor, navegación, eventos, guardado y actualización localizada.
- `world-visual.js`: composición del avatar y del escenario, sin acceder a almacenamiento ni DOM externo.
- `world-data.js`: metadatos de opciones, bandas de edad y desbloqueos.
- `profile-settings.js`: validación, migración y persistencia.
- `world.css`: layout, paneles, controles, estados y responsive.
- `tienda.html`: estructura semántica base y regiones accesibles.

La generación de controles se dividirá en funciones pequeñas: navegación de rasgos, control gradual, selector de formas, selector de color, objeto de mundo y estado bloqueado.

## Accesibilidad

- Todos los controles serán botones, radios o rangos nativos según corresponda.
- Cada control tendrá nombre accesible y anunciará su valor actual.
- Las opciones seleccionadas tendrán texto, icono y atributo ARIA; no dependerán solo del color.
- Navegación por flechas dentro de grupos y recorrido completo por teclado.
- Foco visible y devolución del foco al cambiar o cerrar paneles.
- Regiones de estado con `aria-live="polite"` para guardado y cambios aplicados.
- Contraste AA y objetivos táctiles mínimos de 44 px; 48 px en `p12`.
- Movimiento reducido tanto por sistema como por ajuste de usuario.

## Pruebas de aceptación

- Cambiar cada rasgo actualiza el avatar sin recargar.
- El cambio permanece tras recargar la página y al volver a Perfil.
- Los valores antiguos migran sin perder personalización.
- Añadir o quitar un objeto actualiza el paisaje visible en el mismo momento.
- Los elementos bloqueados no pueden aplicarse y explican el requisito exacto.
- `Sorpréndeme` nunca selecciona elementos bloqueados ni incompatibles con la etapa.
- Avatar, ropa, accesorios y mundo funcionan con teclado.
- No existe scroll horizontal global a 360, 390, 768, 1024, 1366 ni escritorio grande.
- La vista previa sticky no cubre controles, navegación ni diálogos.
- Perfil refleja el avatar guardado.
- La consola permanece sin errores en las cuatro bandas.
- Las pruebas existentes de progreso, misiones y ajustes continúan pasando.

## Fuera de alcance

- Editor tridimensional.
- Arrastrar libremente objetos por el escenario.
- Sincronización del avatar mediante un backend nuevo.
- Compras, moneda virtual o marketplace.
- Rasgos corporales que puedan fomentar comparaciones físicas o juicios de valor.
