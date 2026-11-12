# Fichas de destinos — revisión del 12-11-2026

Guía general de países para la landing española. No es un catálogo de colegios o plazas. EEUU y Canadá siguen bajo consulta. Las ciudades son referencias geográficas expresamente identificadas como tales; no publicamos nombres de colegios ni nuevas tarifas.

## Fuentes primarias

### Reino Unido

- [Currículo de Inglaterra](https://www.gov.uk/national-curriculum)
- [Sistema de Escocia](https://www.gov.scot/policies/schools/school-curriculum/)
- [Calendario de Escocia](https://www.gov.scot/publications/welcome-scotland-guide-service-personnel-families-scotland-updated-2026/pages/4/)
- [OCDE · PISA 2022](https://www.oecd.org/en/publications/pisa-2022-results-volume-i-and-ii-country-notes_ed6fbcc5-en/united-kingdom_9c15db47-en.html)

### Irlanda

- [Junior Cycle](https://www.gov.ie/en/department-of-education/publications/junior-cycle/)
- [Senior Cycle y Transition Year](https://curriculumonline.ie/senior-cycle/)
- [Calendario escolar](https://www.gov.ie/en/department-of-education/services/school-holiday-dates/)
- [OCDE · PISA 2022](https://www.oecd.org/en/publications/pisa-2022-results-volume-i-and-ii-country-notes_ed6fbcc5-en/ireland_01173012-en.html)

### Estados Unidos

- [Estructura educativa · NCES](https://nces.ed.gov/programs/digest/mobile/The_Structure_of_American_Education.aspx)
- [Requisitos de graduación: ejemplo de California](https://www.cde.ca.gov/ci/gs/hs/hsgrmin.asp)
- [Cursos AP · College Board](https://apstudents.collegeboard.org/what-is-ap)
- [OCDE · PISA 2022](https://www.oecd.org/en/publications/pisa-2022-results-volume-i-and-ii-country-notes_ed6fbcc5-en/united-states_a78ba65a-en.html)

### Canadá

- [Secundaria y provincias · EduCanada](https://www.educanada.ca/study-plan-etudes/secondary-secondaire.aspx?lang=eng)
- [Educación pública y privada · Canadá](https://www.canada.ca/en/immigration-refugees-citizenship/services/settle-canada/education/school-types/elementary-secondary.html)
- [OCDE · PISA 2022](https://www.oecd.org/en/publications/pisa-2022-results-volume-i-and-ii-country-notes_ed6fbcc5-en/canada_901942bb-en.html)

## Criterios de redacción

- PISA 2022 se cita como referencia histórica fechada, sin presentarlo como la última edición ni usar un puesto en un ranking. Reino Unido, Irlanda y Canadá: por encima de la media OCDE en las tres áreas. EEUU: lectura y ciencias por encima; matemáticas próximas a la media, según su nota de país de la OCDE. Las cuatro notas piden cautela de muestreo. No se atribuyen esos resultados a los colegios propuestos.
- Interpretar el ajuste del alumno y valorar ventajas es orientación editorial, no una recomendación derivada de PISA. La comparación usa cinco criterios y no puntúa a los países.
- Tipos de escuela, calendario y titulaciones describen el sistema nacional/provincial; la oferta real se confirma para cada colegio. AP es un curso avanzado, no un diploma de secundaria ni garantía de acceso universitario.
- No equiparar Year/Grade por edad con ESO/Bachillerato. [Ministerio: homologación y convalidación](https://www.educacionfpydeportes.gob.es/servicios-al-ciudadano/catalogo/general/05/051270/ficha/051270.html). Primaria/ESO: incorporación sin convalidación; títulos de ESO/Bachiller y estudios de Bachillerato tienen requisitos propios. No se promete gestionar trámites.
- Distancia cualitativa, sin inventar tiempos de vuelo. Referencias horarias respecto a Madrid: Londres/Dublín −1 h, Nueva York/Toronto habitualmente −6 h; diferencias temporales por cambios de hora y otras zonas. Contrastar antes de viajar.
- Clima descriptivo y orientativo: no se publican temperaturas. [Met Office: diferencias regionales](https://www.metoffice.gov.uk/research/climate/maps-and-data/regional-climates).

## Lo que debe validar Interlanguage

1. Qué zonas y colegios forman parte de su selección vigente y tienen plazas, especialmente EEUU y Canadá. Las ciudades de la ficha no son disponibilidad prometida.
2. Tipos de alojamiento, aperturas de internados, guardian, apoyo lingüístico, materias y estancias cortas que puede proponer cada centro.
3. Tarifas reales y suplementos de actividades antes de añadir importes.
4. Si las cuatro fotos escogidas (remo, equitación, piano y robótica) representan actividades que se pueden proponer en los colegios seleccionados. Se presentan como ilustrativas y con salvedad de disponibilidad.

## Alcance técnico

Hero original conservado byte por byte. Destinos: cuatro pestañas con fichas HTML y detalles nativos, disponibles también sin JS. Comparativa sustituye la antigua de dos países. Vida fuera del aula sustituye las escenas y carruseles de actividades por cuatro fotos homogéneas, sin autorreproducción. Contacto compartido, selección de país y rutas existentes conservados. El contenido nuevo se limita a ES por petición expresa; EN conserva su contenido y su carrusel.

## Archivos de esta entrega

- `web-publica/index.html`: fichas ES, comparación de países, galería de cuatro actividades y carga del módulo.
- `web-publica/css/styles.css`: estilos del componente y ajustes móviles, sin selectores nuevos del hero.
- `web-publica/js/destinos.js`: navegación de pestañas, teclado y lectura sin el módulo.
- `web-publica/js/main.js`: compatibilidad del router con las nuevas fichas; se mantiene el carrusel EN.
- `web-publica/index-en.html`, `web-publica/legal.html`, `web-publica/404.html`, `web-publica/llamada.html`: únicamente versiones de los recursos compartidos.
- `web-publica/AGENTS.md`: decisión de producto, alcance y versiones.
- `docs/superpowers/specs/2026-11-12-destinos-ampliados-design.md`: especificación del cambio.
- Este documento: fuentes primarias, límites y datos comerciales para validar.

## Verificación realizada

- Hero idéntico por contenido HTML y por comparación píxel a píxel a 1440 y 390 px frente a HEAD anterior.
- Chrome y Safari/WebKit, escritorio e iPhone: cuatro países, desplegables, teclado, preselección del formulario, vuelta al origen y enlaces directos.
- Sin desbordamiento de página a 320, 390, 768, 1024 y 1440 px. La tabla tiene desplazamiento propio en pantallas estrechas.
- Fotografías disponibles, proporciones 3:2, cuatro fotos en la galería, cero carruseles de actividades en la vista ES.
- Si no carga `destinos.js`, siguen siendo legibles las cuatro fichas; EN conserva sus destinos y su router.
- Tests existentes: 100 comprobaciones de plataforma y 11 pruebas unitarias de llamadas, sin fallos. Envío real no ejercitado: los CTA se prueban sin enviar ninguna consulta.
