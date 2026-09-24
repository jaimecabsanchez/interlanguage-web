# Tarjetas editoriales para “Nuestros programas”

**Fecha:** 2026-09-24  
**Estado:** diseño visual aprobado; pendiente de revisión final antes de implementar

## Objetivo

Mejorar la legibilidad y la calidad percibida de las tres tarjetas de “Nuestros programas” en `web-publica/index.html`, conservando el pequeño zoom de las fotografías que ya funciona bien.

La solución no debe depender del color o luminosidad de cada fotografía. Todo el texto debe leerse con claridad estable y la sección debe transmitir una identidad educativa premium, sobria y deliberada.

## Dirección aprobada: composición editorial

Cada tarjeta se divide visualmente en dos áreas:

1. **Área fotográfica superior.** Mantiene la fotografía real, el recorte actual y el zoom suave dentro de un marco con `overflow: hidden`.
2. **Área de contenido inferior.** Superficie azul marino sólida que contiene título, metadatos, descripción breve y acción.

Esta separación elimina la dependencia del degradado sobre la imagen y garantiza contraste constante. No se añaden efectos de cristal, desenfoques ni recursos decorativos que compitan con el contenido.

## Jerarquía de contenido

El orden visual será:

- distintivo opcional sobre la fotografía (“Programas internacionales” o “Inscripción abierta”);
- título del programa;
- edad, etapa, periodo o destino;
- explicación breve;
- acción con flecha.

Las tres tarjetas tendrán la misma altura y reservarán espacio suficiente para títulos de una o dos líneas. La acción quedará alineada de forma consistente aunque varíe la longitud del texto.

No se cambia el copy ni las fotografías en este trabajo.

## Interacción

En dispositivos con puntero:

- la tarjeta se eleva ligeramente;
- la sombra gana profundidad sin crear un halo excesivo;
- la fotografía aumenta aproximadamente un 4–5 % dentro de su marco;
- la flecha de la acción se desplaza unos píxeles;
- el panel de contenido puede aclararse de forma casi imperceptible, manteniendo el contraste.

La transformación se aplica a la fotografía, no al texto. Esto evita el desenfoque tipográfico que puede producir un escalado de la tarjeta completa.

En teclado, `:focus-visible` ofrecerá el mismo estado informativo sin ocultar contenido. En pantallas táctiles toda la información será visible sin interacción previa.

Con `prefers-reduced-motion: reduce`, las transiciones quedarán anuladas mediante el patrón global existente.

## Responsive

- **Desde 1024 px:** tres columnas iguales, con proporción de fotografía y panel editorial consistente.
- **De 700 a 1023 px:** dos columnas; la tercera tarjeta se centra en una segunda fila con el mismo ancho, evitando una columna demasiado estrecha.
- **Por debajo de 700 px:** una columna, fotografía algo más baja y panel con padding ajustado. El CTA y la descripción permanecen visibles.

No se introducirá scroll horizontal ni se truncará contenido relevante.

## Accesibilidad

- Contraste mínimo WCAG AA para todo el texto.
- El enlace completo seguirá siendo el objetivo interactivo, con su `aria-label` actual.
- Foco visible y no dependiente únicamente del color.
- El zoom no cambiará la posición del contenido ni provocará saltos de layout.
- Las imágenes conservarán sus textos alternativos actuales.
- La jerarquía de encabezados no cambia.

## Implementación prevista

El cambio se concentrará en:

- `web-publica/css/styles.css`: composición, estados de interacción y breakpoints;
- `web-publica/index.html`: únicamente subir la versión `?v=` de la hoja de estilos, salvo que la verificación demuestre que se necesita un ajuste semántico mínimo.

No se modificará `web-publica/js/main.js`, no se añadirán dependencias y no se tocarán las imágenes.

## Verificación

- revisión visual a 320, 768, 1024 y 1440 px;
- estado normal, hover, foco de teclado y movimiento reducido;
- comprobación de los tres textos reales, incluidos títulos de dos líneas;
- ausencia de solapamientos, recortes y saltos de layout;
- comprobación de contraste y legibilidad sobre todas las fotografías;
- revisión de consola del navegador;
- ejecución de la suite existente del repositorio antes de dar el trabajo por terminado.

## Límites y riesgos

- Las eliminaciones locales existentes en `web-publica/images/internacional/` pertenecen a otro trabajo y no se restaurarán ni se incluirán en el commit.
- El objetivo es mejorar exclusivamente la sección “Nuestros programas”; no se extenderá automáticamente este patrón a otras galerías o tarjetas.
- Si alguna fotografía no está disponible durante la prueba por los cambios locales existentes, se verificará con los recursos intactos de esta sección y se informará del riesgo restante.

## Criterios de aceptación

El cambio queda aceptado cuando las tres tarjetas conservan el zoom apreciado, todo el texto se lee perfectamente con independencia de la fotografía, la composición mantiene alturas y alineaciones consistentes, responde correctamente en los cuatro breakpoints y ofrece un acabado editorial claramente superior sin alterar contenido ni navegación.
