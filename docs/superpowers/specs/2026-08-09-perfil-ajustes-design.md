# Perfil del alumno y ajustes persistentes

Estado: aprobado por alcance explícito. El usuario pidió ejecutar sin preguntas adicionales.

## Decisión de producto

Se elige una página editorial de dos columnas en escritorio y una sola columna en móvil. Frente a tabs —que esconderían ajustes— o acordeones —que harían el escritorio más provisional— esta estructura mantiene visible la identidad del alumno y permite escanear Personalizar, Ajustes y Cuenta de arriba abajo.

## Identidad

- El avión de papel representa avance y aparece en el progreso de nivel.
- El avatar representa al alumno y no utiliza animales ni emojis.
- Nemo se implementa como un `guide-slot` preparado para recibir una ilustración propia. Mientras no exista ese asset, muestra una composición neutra con el avión de papel; no se inventa un personaje.
- En `p12` y `p34` el guía puede ocupar un bloque completo; en `p56` será compacto; en `eso` se oculta.

## Perfil principal

La cabecera muestra nombre, nivel de producto, referencia CEFR, descripción de aprendizaje, avatar, objetivo diario, sello destacado y progreso al siguiente nivel. El nombre de usuario se mueve a Cuenta y se presenta como dato secundario, nunca como credencial protagonista.

En la cuenta demo de Lucía se muestran datos demo centralizados: `Explorer 2`, `A1`, `65%` y la descripción de rutinas. En cuentas reales solo se muestran porcentajes cuando existe una fuente fiable; la ausencia de evidencia se explica sin convertirla en cero.

## Personalizar

- Selector accesible de estilo de avatar.
- Selector de sello destacado limitado a sellos desbloqueados.
- Resumen de elementos desbloqueados.
- Slots preparados para complementos y fondos, sin tienda, gemas ni compras.

La configuración visual persiste por nombre de usuario en almacenamiento local. Se conserva compatibilidad de lectura con `il_avatar_color` del onboarding.

## Ajustes

Persisten por alumno:

- sonido;
- reproducción automática de audio;
- velocidad de audio (`0.75`, `0.9`, `1`);
- objetivo diario (`5`, `8`, `10`, `15` minutos);
- reducción de animaciones;
- tamaño de texto (`normal`, `large`).

No se muestra Música porque el producto no tiene sistema musical. Recordatorios aparece desactivado y marcado como no disponible, sin simular notificaciones o backend. Ayuda abre el canal de correo existente.

El motor de ejercicios consulta sonido, autoplay y velocidad. El sistema visual aplica reducción de movimiento y tamaño de texto mediante atributos en el documento.

## Cuenta y privacidad

Cuenta queda al final con nombre de usuario, Cambiar contraseña, Privacidad y Cerrar sesión. Cerrar sesión utiliza una acción discreta. Privacidad abre un diálogo informativo; no pretende sustituir la política legal pendiente.

## Accesibilidad y responsive

- `label`, `fieldset`, `select` y botones nativos.
- Switches con checkbox real y texto de estado.
- Targets mínimos de 44 px, foco visible y estados no dependientes solo del color.
- Diálogo nativo con cierre por botón, fondo y Escape.
- 360–767 px: todo apilado; acciones a ancho completo cuando conviene.
- 768–1023 px: cabecera amplia y contenido en una columna.
- 1024 px en adelante: columnas asimétricas con Perfil/Personalizar a la izquierda y Ajustes/Cuenta a la derecha.

## Persistencia y errores

`profile-settings.js` usa JSON versionado en `localStorage`, sanea valores desconocidos, falla de forma segura y expone funciones puras testeables. No se añade backend. La pantalla conserva estado de carga y error; los guardados anuncian cambios con `aria-live`.

## Verificación

- Controles con ratón y teclado.
- Recarga para confirmar persistencia.
- Audio respeta sonido, autoplay y velocidad.
- Nemo visible en Primaria y ausente en ESO.
- Responsive en 360, 390, 768, 1024 y 1366 px.
- Consola sin errores provocados por la implementación.

## Autorrevisión

No hay placeholders `TBD`, no se inventa mascota, backend o música, y los datos demo están separados de las cuentas reales. La arquitectura mantiene HTML/CSS/JS plano, usa los tokens e iconos existentes y limita el cambio al perfil y a las preferencias que este controla.
