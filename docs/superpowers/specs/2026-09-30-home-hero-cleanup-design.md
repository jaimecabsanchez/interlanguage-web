# Rediseño limpio de la primera impresión de la web pública

Fecha: 30 de septiembre de 2026

## Objetivo

Simplificar la cabecera y el hero de la página de inicio de Interlanguage para que la primera impresión sea más clara, serena y profesional. El visitante debe identificar rápidamente la propuesta de valor, los programas principales y la llamada a la acción sin que el logo, las negritas o las fotografías compitan entre sí.

## Alcance

El cambio afecta al hero de inicio y a la cabecera compartida de `web-publica/index.html` y `web-publica/index-en.html`, con sus estilos en `web-publica/css/styles.css`. No se modifican las subpáginas, los formularios, las imágenes originales ni la navegación funcional.

## Dirección visual aprobada

### Cabecera

- Reducir ligeramente el logo y el alto total de la cabecera.
- Mantener la navegación y el selector de idioma actuales.
- Conservar la legibilidad y un área táctil suficiente en móvil.

### Jerarquía del texto

- Reducir el tamaño y el peso visual del `h1`; se mantiene el coral como acento, no como un segundo bloque dominante.
- Convertir el texto introductorio en un párrafo de peso regular. No habrá fragmentos completos compitiendo en negrita.
- Simplificar la píldora superior para que funcione como contexto y no como una tercera llamada de atención.
- Compactar botones y datos de confianza sin eliminar información ni acciones.

### Fotografía

- Sustituir el mosaico de cuatro fotografías por dos imágenes ordenadas en escritorio: una principal y una secundaria.
- Mantener etiquetas discretas que enlacen a los programas correspondientes.
- Integrar el dato de más de 30 años como un detalle pequeño, sin una tarjeta flotante dominante.
- En móvil se mostrará una sola fotografía panorámica para reducir la longitud y la carga visual de la entrada.
- No habrá carrusel ni movimiento automático. Solo se permiten transiciones sutiles de entrada y estados de interacción, anulados por `prefers-reduced-motion`.

## Comportamiento responsive

- Escritorio: dos columnas equilibradas, con el texto a la izquierda y la composición de dos imágenes a la derecha.
- Tableta: una sola columna centrada, manteniendo ambas imágenes si el espacio lo permite sin recortes incómodos.
- Móvil: texto primero y una única imagen panorámica; la segunda imagen y los adornos no esenciales se ocultan.
- Se comprobarán los anchos de 320, 768, 1024 y 1440 px.

## Contenido y accesibilidad

- Se conserva el `h1`, la estructura semántica, los textos alternativos y los enlaces existentes.
- La versión inglesa recibirá exactamente la misma estructura visual.
- El contraste seguirá cumpliendo WCAG AA y todos los enlaces conservarán foco visible.
- La composición no dependerá del movimiento para comunicar información.

## Rendimiento y compatibilidad

- Se reutilizarán las variantes AVIF, WebP y JPEG existentes.
- Los atributos `sizes` se ajustarán al ancho pintado real de las imágenes elegidas para conservar nitidez en pantallas Retina.
- No se añadirá JavaScript ni nuevas dependencias.
- Al cambiar `styles.css`, se incrementará su parámetro `?v=` en todas las páginas que lo cargan.

## Verificación

- Revisar visualmente la portada en español e inglés a 320, 768, 1024 y 1440 px.
- Comprobar que no haya desplazamiento horizontal, texto cortado ni solapamientos.
- Verificar navegación por teclado y `prefers-reduced-motion`.
- Revisar la consola del navegador.
- Ejecutar la batería de tests indicada en el `AGENTS.md` raíz antes del commit de implementación.

## Fuera de alcance

- Reescritura general de los textos de marketing.
- Cambios en las secciones posteriores de la página.
- Nuevas fotografías, carruseles, vídeos o animaciones automáticas.
- Cambios en la identidad visual o la paleta de marca.
