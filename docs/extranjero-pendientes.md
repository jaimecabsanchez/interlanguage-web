# Estudiar en el extranjero — revisión y confirmaciones

Estado: 06-10-2026. Primera fase en rama local `codex/revision-extranjero-familias`, sin push ni despliegue. Este documento es interno: Netlify publica únicamente `web-publica/`.

## Fuentes revisadas

- `Downloads/Colegios UK.pdf`, «Colegios y programas del Reino Unido», septiembre de 2026 (13 páginas).
- `Downloads/Colegios Irlanda.pdf`, septiembre de 2026 (16 páginas).
- `Downloads/Interlanguage_Checklist_Lanzamiento_Study_Abroad_2026.pdf` (19 páginas). Es un plan pendiente, no prueba de servicios operativos.
- Decisiones de Jaime registradas en este repositorio: Irlanda 10–18 y mantener Estados Unidos (05-10-2026), estructura de escenas (06-10-2026), trayectoria de enseñanza de inglés en España y profesores nativos.

Solo atributos descriptivos de centros ACTIVO. No se publican nombres, tarifas de terceros, comisiones, notas comerciales, información oral de reuniones ni centros en transición/reconfirmación/cerrados. Un producto existente en un país no demuestra que Interlanguage lo ofrezca.

## Coherencia resuelta

| Dato | Fuente y decisión |
|---|---|
| Reino Unido | Centros activos en Inglaterra y Escocia. Se conserva «Reino Unido». |
| Colegio frente a internado | UK p. 3: preparatorio 4–13, internado internacional 7–13. P. 5: internado desde Year 5. Pp. 7 y 11: desde Year 7. Resumen «desde 7 según colegio», comparador 7–18 según centro; detalle explica límites. No convertir Year en edades españolas. |
| Irlanda | 10–18 por decisión de Jaime. Curso concreto depende del colegio. La guía no acredita secundaria a los 10–11; sigue pendiente concretarlo. |
| Formulario | UK 7–18, Irlanda 10–18, «Otra edad» para consultas fuera del rango sin prometer admisión. Para Estados Unidos/destino sin elegir el selector recoge consultas, no elegibilidad. Curso actual opcional viaja en `serviceExtra`. |
| Duración UK | P. 5: short stays de 1–2 terms limitados; p. 10: normalmente curso completo. Selector y CTA distinguen 1 trimestre, 2 trimestres y curso completo solo para UK. |
| Duración Irlanda/Estados Unidos | Sin oferta acreditada: «Quiero que me aconsejen»; preferencias libres en el mensaje. Retirados 2–4 semanas y semestre del selector académico. |
| Alojamiento UK | Internado full/weekly/flexi según centro. Detalle conserva apertura y guardian exigido por algunos; no se atribuye este servicio a Interlanguage. |
| Alojamiento Irlanda | Internado de 5, 5½ o 7 días, o colegio de día con familia anfitriona. Algunos internados cierran fines de semana. |
| Regreso académico | Retirada la afirmación universal de que toda vuelta exige convalidación. Remisión a requisitos oficiales para el caso concreto, sin garantía ni promesa de gestionar el trámite. |

## Implementación

Cabecera breve → índice → tarjetas de reconocimiento → comparación → detalles → escenas de vida cotidiana → orientación → presupuesto → FAQ → formulario. Se retiran notas internas, repeticiones y «Sin esto no proponemos nada». Presupuesto concentrado con factores y posibles gastos a comprobar; no se promete cifra en la primera llamada. ES y EN equivalentes.

En accesos de la home se retiran coordinador local, 24/7, «sin perder el curso», plazo de 24 horas del bloque internacional y duraciones sin respaldo. El buscador 7–10 permite consultar UK desde 7 e Irlanda desde 10. No se añade equipo ni testimonios sin materiales autorizados.

## Confirmaciones agrupadas

1. **Oferta y admisión:** programa concreto de Estados Unidos; Irlanda: curso de entrada (especialmente 10–11), duración, incorporación y apoyo de inglés; UK: centros/plazas de uno y dos trimestres, calendario vigente y equivalencia del curso escocés. Reconfirmar atributos de guías antes de cada propuesta.
2. **Presupuesto y servicio:** tarifa de Interlanguage, inclusiones/exclusiones, pago/cancelación y alcance del acompañamiento antes/durante/después. Responsable en destino, guardian, seguro, emergencias y seguimiento siguen pendientes en el checklist; no se publican como incluidos.
3. **Material y respaldo:** autorizaciones de imagen de menores, procedencia y uso de fotos; fotografía de internado/familia anfitriona; equipo identificado y testimonios con consentimiento. Documentación corporativa y relación con colegios antes de ampliar respaldo.
4. **Entrega de consultas:** decidir/configurar backend compatible con Netlify y verificar recepción real. Bloquea publicar como formulario operativo.

## Fotografías

Reutilizadas variantes AVIF/WebP/JPEG aprobadas sin generar ni retocar. «Vivir» muestra campus, no alojamiento, y sigue provisional. Irlanda muestra un viaje y Estados Unidos un aula con bandera (foto aportada por Jaime el 06-10-2026, `usa-aula.jpg`; tiene aspecto de imagen generada, origen y derechos por confirmar); no se usan como prueba de colegios colaboradores o modalidades. La cabecera `hero-arco-3` tiene origen generado/composición de cabezas documentados en AGENTS.md; no presentarla como alumnos propios o experiencia real. Publicación previa no acredita derechos de imagen.

## Bloqueo de envío

`leadForm` y `main.js` envían a `form-handler.php`. Netlify sirve archivos estáticos y no ejecuta PHP; la ruta publicada devuelve 404. El servidor local tampoco ejecuta PHP. No se despliega ni se simula un éxito. Se hace clicable `mailto:info@interlanguage.es` para contacto directo. La migración del backend afectaría a otros formularios y requiere configurar la recepción real.

## Fuera del alcance

Pendiente revisar cifras generales de familias, trayectoria del pie/meta/JSON-LD, cruces antiguos de campamentos/extraescolar y plazos del formulario general. Su texto publicado no acredita servicios internacionales.

## Vista previa

`http://localhost:8752/web-publica/index.html#servicio-extranjero`

Servidor: `python3 -m http.server 8752` desde la raíz, sin build ni dependencias nuevas.
