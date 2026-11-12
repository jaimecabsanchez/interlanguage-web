# Ampliación de Destinos y Vida fuera del aula

Petición aprobada por Jaime el 12-11-2026: implementar en la landing actual, todo el contenido nuevo en español, sin cambiar el hero ni otras secciones.

- Mantener la fotografía, el HTML y los estilos del hero inicial exactamente como están.
- Cuatro pestañas de país con estructura común: frase de encaje, foto pequeña, cuatro datos rápidos y cinco desplegables nativos que cubren sistema, calidad comparada, zonas, convivencia y ventajas/consideraciones. Sin JS se leen las cuatro fichas completas.
- Sustituir la comparación de dos países por una tabla de cuatro destinos y cinco criterios, con CTA al asesoramiento existente. En móvil empieza plegada y la tabla tiene desplazamiento propio; se mantiene el encabezado de criterios a la vista.
- Conservar los enlaces directos a cada destino y la preselección de país en el formulario. Las pestañas funcionan con clic, flechas, Inicio/Fin y teclado.
- Reemplazar las escenas/carruseles de actividades de esta página por cuatro fotografías: remo, equitación, piano y robótica. Retículas uniformes, recorte 3:2, bordes de marca, AVIF/WebP/JPEG existentes y carga diferida. No añadir fotos dispersas ni retocar las caras.
- Fuentes y comprobaciones en `docs/extranjero-fichas-fuentes.md`. Las ciudades son referencias generales, nunca promesas de oferta; EEUU y Canadá siguen bajo consulta. PISA 2022 es una referencia fechada, sin ranking ni garantías.
- Alcance ES: la página inglesa conserva su contenido; el cambio compartido de router admite ambas estructuras. Paleta y tipografía del proyecto, sin dependencias nuevas.

Verificación: igualdad exacta del hero, recursos y anclas válidos, ausencia de duplicados, navegación y CTA de todos los países, lectura sin JS, teclado y móvil en Chrome/WebKit. Tests existentes del repositorio antes del commit.
