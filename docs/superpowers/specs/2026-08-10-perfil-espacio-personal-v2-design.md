# Perfil y espacio personal v2

## Objetivo

Convertir Perfil en un resumen visual breve de la identidad del alumno y trasladar toda la personalización a una experiencia secundaria llamada **Mi Mundo**. La motivación se apoya en progreso educativo y logros, no en una tienda ni en una economía agresiva.

## Arquitectura de pantallas

### Perfil

Perfil debe caber aproximadamente en una pantalla de escritorio y contener solo:

1. Avatar humano grande, nombre, nivel de producto y progreso al siguiente nivel.
2. Entre tres y cinco sellos conseguidos, sin explicaciones extensas.
3. Una gran preview de Mi Mundo con CTA `Entrar`.
4. Una única fila `Ajustes`.

El nivel MCER será secundario en p56 y ESO y se ocultará en las bandas más pequeñas. Audio, contraseña, privacidad, panel de familias y cierre de sesión no aparecerán directamente.

### Ajustes

Se crea `ajustes.html` como página secundaria. Reutiliza `ILProfileSettings` y conserva los controles accesibles existentes de sonido, reproducción automática, velocidad, objetivo diario, movimiento y tamaño de texto. Cuenta, privacidad, panel de familias, contraseña y cierre de sesión quedan al final.

### Mi Mundo

Se conserva la ruta `tienda.html` para no romper enlaces, pero desaparece cualquier apariencia de tienda. La pantalla tendrá:

- Cabecera con regreso a Perfil y nivel del mundo.
- Preview grande y viva del jardín, base o espacio personal.
- Tabs accesibles: `Avatar`, `Ropa`, `Accesorios` y `Mundo`.
- Bandejas visuales data-driven con miniaturas, estado y requisito de desbloqueo.
- Momento breve de reveal para nuevos desbloqueos, sin Nemo permanente.

## Avatar modular

`world-visual.js` renderiza un personaje humano de cuerpo completo mediante SVG original y tokens de Interlanguage. El avatar combina tono de piel, pelo, color de pelo, expresión, prenda superior y accesorio. Las elecciones no se asocian a género.

Cada cambio actualiza inmediatamente la preview y se guarda en preferencias locales versionadas. El catálogo está definido como datos; añadir una opción no exige reescribir la interfaz.

## Desbloqueos por aprendizaje

`world-data.js` sustituye los precios por reglas explícitas:

- `missions`: número de sesiones completadas;
- `streak`: constancia actual;
- `stamp`: sello conseguido;
- `worldLevel`: nivel derivado de sesiones.

Cada elemento expone el requisito completo y el progreso que falta. Las opciones base siempre están disponibles. Los datos técnicos históricos `gems`, `owned`, `hat` y `acc` se conservan para compatibilidad, pero no se muestran como economía ni gobiernan esta primera versión.

El nivel del mundo se deriva de sesiones completadas: nivel 1 (0–4), nivel 2 (5–9), nivel 3 (10–19), nivel 4 (20–39) y nivel 5 (40 o más).

## Persistencia

`ILProfileSettings` se amplía con `avatarExpression`, `avatarTop`, `avatarAccessory`, `worldBackground`, `activeWorldItems` y `seenUnlocks`. La sanitización usa listas cerradas y mantiene compatibilidad con preferencias anteriores. En demo se conserva localStorage. No se crea backend nuevo.

## Adaptación por edad

- **p12 (5–7):** jardín, avatar grande, textos mínimos, juguetes y revelados más visibles.
- **p34 (8–9):** jardín más sofisticado, más ropa y fondos.
- **p56 (10–11):** base/club con escritorio, objetos y viajes; menos decoración infantil.
- **ESO:** espacio personal sobrio, copy principalmente en inglés, menor animación y mayor densidad.

La arquitectura, componentes y datos son compartidos. Solo cambian configuración, assets, copy y densidad.

## Accesibilidad y movimiento

- Tabs y tarjetas serán botones nativos navegables por teclado.
- Los bloqueos incluirán texto, no dependerán del color ni del candado.
- Targets mínimos de 44 px y mayores en p12.
- El foco se moverá al diálogo de desbloqueo y volverá al control adecuado al cerrarlo.
- Toda animación tendrá alternativa con `prefers-reduced-motion` y `data-il-reduce-motion`.

## Criterios de aceptación

- Perfil es corto y no muestra controles técnicos.
- Avatar, ropa y accesorios cambian visualmente y persisten.
- Mi Mundo muestra elementos desbloqueados y bloqueados con requisitos reales.
- El mundo cambia según el nivel y los elementos activos.
- Hay datos demo suficientes sin fingir precisión pedagógica.
- p12, p34, p56 y ESO tienen tratamientos reconociblemente distintos.
- No hay emojis estructurales, scroll horizontal global ni errores de consola.
