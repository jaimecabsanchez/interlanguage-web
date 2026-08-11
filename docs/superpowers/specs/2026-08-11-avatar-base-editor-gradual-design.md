# Base masculina/femenina y editor gradual del avatar

## Objetivo

Recuperar el editor gradual del avatar en `Mi mundo` y añadir una elección inicial de base masculina o femenina. La base debe modificar la anatomía visual del personaje sin limitar peinados, colores, ropa, accesorios ni el resto de rasgos disponibles.

El resultado sustituye el selector actual de nueve láminas ilustradas. El alumno vuelve a construir un avatar propio paso a paso, viendo cada cambio al instante dentro de su paisaje.

## Decisión de producto

La elección se presenta como un rasgo más del avatar, no como dos catálogos separados. El editor empieza en `Base` y continúa por `Rostro`, `Piel`, `Pelo`, `Ojos`, `Cejas`, `Nariz` y `Boca`.

Las dos bases son:

- `masculine`: proporciones masculinas sutiles en mandíbula, cuello, hombros y torso.
- `feminine`: proporciones femeninas sutiles en mandíbula, cuello, hombros y torso.

La diferencia será reconocible sin caricaturas. Cambiar la base nunca modificará automáticamente otro ajuste. Todos los rasgos, prendas y accesorios permanecerán disponibles en ambas bases.

Se descartan dos alternativas:

- Preajustes completos que cambien también pelo, ropa o rostro, porque sobrescribirían elecciones existentes y reforzarían asociaciones innecesarias.
- Dos editores separados, porque duplicarían interfaz, datos y mantenimiento sin aportar libertad adicional.

## Experiencia del editor

Al entrar en la pestaña `Avatar`, la vista previa seguirá fija dentro del mundo y el panel abrirá en `Base`. Se mostrarán dos botones con miniaturas renderizadas por el mismo motor del avatar. El estado seleccionado será visible, tendrá `aria-pressed` y podrá manejarse con teclado.

Después de elegir la base, el alumno navegará por las categorías existentes. Los controles de forma y los deslizadores mantendrán el guardado inmediato y el estado textual `Guardando…` / `Guardado`.

`Sorpréndeme` generará una combinación válida de base y rasgos editables. No tocará preferencias de audio, accesibilidad ni elementos del mundo. `Restablecer` conservará su confirmación en dos pasos y restaurará todos los campos del avatar a sus valores predeterminados.

En Primaria se usarán las etiquetas `Masculino` y `Femenino`. En la experiencia de ESO se mostrarán `Masculine` y `Feminine`, respetando la localización actual de esa vista.

## Modelo de datos y compatibilidad

`ILProfileSettings` incorporará:

- `avatarBase` con valores válidos `masculine` y `feminine`.
- Valor predeterminado `masculine` para perfiles sin este campo.

La sanitización seguirá usando listas cerradas. Los perfiles que todavía tengan `avatarLook` conservarán el dato almacenado durante la migración, pero el render y el editor dejarán de utilizarlo. Así no se destruye información previa ni se requiere una migración de almacenamiento.

No se añade backend. La persistencia continúa siendo local y versionada por nombre de usuario mediante `profile-settings.js`.

## Render visual

`world-visual.js` seguirá produciendo un único SVG modular. `avatarBase` afectará solo a geometrías compartidas:

- Contorno inferior del rostro y mandíbula.
- Anchura visual del cuello.
- Línea de hombros.
- Proporción del torso y caída de la prenda.

La piel, ojos, cejas, nariz, boca y pelo seguirán procediendo de sus ajustes independientes. Ropa y accesorios usarán el catálogo común. Las miniaturas de selección reutilizarán `ILWorldVisual.avatar(..., { portrait: true })`, evitando una segunda implementación.

El avatar continuará funcionando en la página de perfil, inicio, progreso, lección y tienda porque todas consumen el mismo render y la misma configuración activa.

## Responsabilidades por archivo

- `plataforma/profile-settings.js`: valor predeterminado, lista válida y sanitización de `avatarBase`; mantener compatibilidad con `avatarLook`.
- `plataforma/world-visual.js`: aplicar las variantes geométricas de base al SVG modular y dejar de priorizar las láminas `avatarLook`.
- `plataforma/world-page.js`: recuperar el editor gradual, añadir la categoría `Base` y actualizar aleatorización y restablecimiento.
- `plataforma/world.css`: estilos de la categoría y limpieza de reglas exclusivas del selector de láminas, manteniendo responsive y estados de foco.
- Páginas consumidoras: subir `?v=` de cada JavaScript o CSS modificado.
- `plataforma/profile-settings.test.js`: cubrir valor predeterminado, guardado, sanitización y compatibilidad.

No se editarán `material-fuente/` ni `archivo/`, no se añadirá un framework y no se introducirán recursos remotos.

## Accesibilidad y adaptación por edad

- Los controles serán botones nativos con nombre visible y `aria-pressed`.
- La navegación de categorías conservará el patrón de pestañas y las flechas izquierda/derecha.
- El foco visible usará los estilos y tokens existentes.
- Ningún significado dependerá solo del color.
- Las opciones tendrán un objetivo táctil mínimo acorde al sistema actual.
- Las animaciones respetarán `prefers-reduced-motion` mediante `ILVisual.reduceMotion()`.
- El diseño se comprobará en 320, 768, 1024 y 1440 píxeles.
- Primaria conservará controles más grandes; ESO mantendrá el acabado compacto y editorial existente.

## Errores y recuperación

La sanitización sustituirá una base desconocida por el valor predeterminado. Si el almacenamiento local no está disponible, se conservará el comportamiento actual: el avatar se podrá previsualizar durante la sesión y la capa de ajustes devolverá una configuración válida sin bloquear la página.

El cambio de base no ejecutará operaciones parciales ni llamadas remotas. Cada guardado producirá una configuración completa y sanitizada, por lo que un perfil nunca quedará en un estado intermedio inválido.

## Verificación

Pruebas automatizadas:

- `node plataforma/profile-settings.test.js`.
- `node plataforma/smoke.test.js`.
- `node plataforma/auth-utils.test.js`.
- `node plataforma/motor/pedagogia.test.js`.
- `node plataforma/motor/motivacion.test.js`.
- `node plataforma/motor/matriz.test.js`.

Comprobación manual en modo demo:

- El editor abre en `Base` y muestra la selección actual.
- Ambas bases cambian la silueta sin alterar los demás campos.
- Cada categoría actualiza la vista previa y persiste tras recargar.
- `Sorpréndeme` cambia base y rasgos sin tocar el mundo.
- `Restablecer` exige confirmación y restaura todo el avatar.
- Perfil y demás páginas muestran el mismo avatar guardado.
- Teclado, foco, móvil, escritorio y reducción de movimiento funcionan sin errores de consola ni desbordamiento horizontal.

## Fuera de alcance

- Más de dos bases anatómicas en esta iteración.
- Restricciones de ropa o peinado por base.
- Sincronización mediante un backend nuevo.
- Sustituir el SVG modular por imágenes generadas, WebGL o modelos 3D.
- Rediseñar el paisaje, las recompensas o la navegación global.
