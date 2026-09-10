# Responsive de cabecera y hero de la web pública

## Objetivo

Corregir la presentación de la portada en pantallas estrechas sin alterar el diseño de escritorio, el contenido comercial ni el comportamiento del carrusel.

## Alcance

- Ajustar exclusivamente la cabecera y el hero de `web-publica/index.html` mediante reglas en `web-publica/css/styles.css`.
- Mantener el HTML y JavaScript actuales salvo que la validación revele que una corrección mínima es imprescindible.
- Incrementar la versión de `styles.css` en `web-publica/index.html` para invalidar la caché.
- No cambiar teléfonos, enlaces, textos, imágenes ni otras secciones en este trabajo.

## Diseño responsive

- Escritorio (`> 960px`): conservar el diseño actual de dos columnas.
- Tableta (`601–960px`): colocar texto y fotografía en una sola columna, centrados y contenidos por el ancho disponible.
- Móvil (`<= 600px`): reducir espaciado y escala tipográfica; apilar las llamadas a la acción a ancho completo; presentar los argumentos en una cuadrícula legible; limitar fotografía e insignia al viewport.
- Móvil estrecho (`<= 360px`): permitir que los argumentos pasen a una sola columna si dos columnas reducen la legibilidad.

Ningún elemento del hero debe quedar recortado horizontalmente ni provocar desplazamiento lateral. Los controles del carrusel conservarán áreas táctiles utilizables y el orden visual seguirá siendo texto, acciones, argumentos y fotografía.

## Accesibilidad y comportamiento

- Conservar elementos semánticos, textos alternativos, etiquetas de los controles y navegación por teclado.
- Mantener `prefers-reduced-motion` y el funcionamiento actual del carrusel.
- No ocultar contenido esencial para resolver el problema de espacio.

## Validación

- Revisar visualmente a 320, 390, 768, 1024 y 1440 px.
- Confirmar que `scrollWidth` no supera el ancho del viewport.
- Comprobar cabecera, botones, argumentos, fotografía, insignia y controles del carrusel.
- Revisar que no haya errores nuevos en consola.
- Ejecutar los tests existentes indicados en `AGENTS.md` antes del commit de implementación.

## Fuera de alcance

La unificación del tratamiento verbal, los enlaces provisionales, el teléfono y una posible simplificación comercial del hero quedan para trabajos separados.
