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
| Duración Irlanda | Curso completo y trimestres, confirmado por Jaime el 08-10-2026. La disponibilidad se confirma con cada centro. El formulario mantiene la consulta de preferencias en el mensaje. |
| Duración Estados Unidos | Sin oferta acreditada: consulta y preferencias libres en el mensaje. Retirados 2–4 semanas y semestre del selector académico. |
| Antelación recomendada | Un curso escolar, confirmado por Jaime el 08-10-2026, porque las plazas pueden agotarse. Las consultas posteriores se valoran con las plazas disponibles, sin prometer una opción. |
| Alojamiento UK | Internado full/weekly/flexi según centro. Detalle conserva apertura y guardian exigido por algunos; no se atribuye este servicio a Interlanguage. |
| Alojamiento Irlanda | Internado de 5, 5½ o 7 días, o colegio de día con familia anfitriona. Algunos internados cierran fines de semana. |
| Regreso académico | Retirada la afirmación universal de que toda vuelta exige convalidación. Remisión a requisitos oficiales para el caso concreto, sin garantía ni promesa de gestionar el trámite. |

## Implementación

Cabecera con «Año escolar» y los tres países destacados → tarjetas de destinos (lema y descripción de cada uno; la tarjeta abre el formulario con ese destino) → comparación Reino Unido/Irlanda (dato en negrita y matiz debajo; cinco criterios más en el desplegable) y aviso de Estados Unidos → escenas de vida cotidiana con las fotos de actividades → cómo trabajamos (cuatro pasos) y qué nos diferencia → presupuesto → FAQ → formulario. Se retiran notas internas, repeticiones y «Sin esto no proponemos nada». Presupuesto concentrado con factores y posibles gastos a comprobar; no se promete cifra en la primera llamada. ES y EN equivalentes.

**Cambios del 07-10-2026 (petición de Jaime):** frase de la cabecera más corta; los países con año escolar (Reino Unido, Irlanda, Estados Unidos) con más énfasis; fuera «30 años enseñando inglés en España / Profesores 100 % nativos / Madrid» de la cabecera; fuera el índice «Destinos · Comparar · Vida cotidiana…» (no se entendía como botones y la página no es tan larga como para necesitarlo); nuevo texto de la sección Destinos y lemas de las tres tarjetas, escritos por Jaime; fuera la sección «Las condiciones de cada destino» (lo útil pasó a la comparación: guardian, apoyo de inglés, tradición religiosa, zona y continuidad; la duración y el alojamiento ya estaban); comparación más al grano; nuevos mensajes de las tres escenas (calidad educativa, madurez y autonomía, actividades); y «Una conversación antes de decidir» pasa a explicar el proceso y qué nos diferencia. Ese mismo día, a petición de Jaime («añádelo»), se añaden los pasos 5 y 6 (solicitud al colegio; preparativos de salida y contacto durante la estancia), con redacción prudente: «te orientamos», no «organizamos el viaje», y una nota de que el alcance de cada paso depende del programa. Las tarjetas dejaron de abrir un detalle: abren el formulario con el destino elegido, y las direcciones `#servicio-extranjero-<destino>` bajan a su tarjeta.

En accesos de la home se retiran coordinador local, 24/7, «sin perder el curso», plazo de 24 horas del bloque internacional y duraciones sin respaldo. El buscador 7–10 permite consultar UK desde 7 e Irlanda desde 10. No se añade equipo ni testimonios sin materiales autorizados.

**Cambios del 07-10-2026 (tarde):** las filas de fotos de actividades pasan de avanzar de foto en foto a una deriva lenta y continua en bucle (flechas sobre las fotos con ratón, botón «Pausar», pausa con ratón o teclado, sin movimiento si el visitante lo pide) porque no se entendía que se podía mover; las fotos de las tarjetas de Reino Unido e Irlanda se sustituyen por las dos que aportó Jaime (balcón gótico con uniforme azul; escaleras con uniforme verde) y las tres tarjetas pasan de 4:3 a 3:2. La cabecera de «Estudiar en el extranjero» pasa a la foto del castillo irlandés (versión A, a sangre con velo azul; descartó la variante con el castillo más lejos), también de aspecto generado, con la bandera de Irlanda como primer mensaje visual de una página sobre tres destinos. **Pendiente de confirmar por Jaime: si esas tres fotos son reales o generadas con IA** (tienen aspecto de generadas); la nota de autenticidad de la web solo recoge una foto de IA (la del Big Ben).

## Portada y formulario de consulta (07-10-2026)

A petición de Jaime: nuevo subtítulo de la cabecera de la portada («Desde estudiar en Reino Unido, Irlanda y Estados Unidos hasta nuestra especialización en campamentos y extraescolares de inglés»; él escribió «Inglaterra», se mantiene «Reino Unido»); camino por edades con Descubrir 3–9, Crecer 9–12 (él pidió «la edad correcta» y se encadena con el nuevo tramo anterior), Avanzar 12–17 y Vivirlo 10–18, con sus textos y tres líneas con tick (profesores nativos, seguimiento curso a curso y método TalenTalk®). Formulario: texto de la izquierda, cuatro tarjetas iguales sin separador «o», recogida en una línea al elegir «Estudiar en el extranjero», campos nuevos del paso 1 (curso en desplegable, inicio, destino y duración, datos opcionales del alumno/a) y paso 2 reordenado con preferencia de contacto (el teléfono solo es obligatorio si piden llamada). La opción neutra de destino y de duración (valor «Aún no lo sé») pasa a llamarse «Estamos abiertos a opciones» y «Necesitamos orientación» en lugar de añadir una segunda opción equivalente.

Como Jaime sustituyó «Respuesta en menos de 24 h» por «Os responderemos personalmente», se retiró también la promesa de 24 horas del aviso bajo el botón y del mensaje de envío (decisión mía, reversible). Del alumno/a solo se pide el nombre, sin apellidos. **Sigue pendiente la entrega real de los envíos** (`form-handler.php` da 404 en Netlify): hasta resolverlo, el formulario no llega al equipo.

## Confirmaciones agrupadas

**Proceso revisado el 08-10-2026:** cuatro etapas: primera orientación, propuesta de servicio (alcance, honorarios y condiciones), selección y solicitud tras aceptar la propuesta, y preparación y acompañamiento acordados. Sustituye los seis pasos anteriores en ES y EN; la rejilla pasa a dos columnas en escritorio y una por debajo de 900 px. La web no fija importes ni declara gratuita la orientación inicial. Siguen pendientes las tarifas y el detalle operativo de los servicios indicados a continuación.

1. **Oferta y admisión:** programa concreto de Estados Unidos; Irlanda: curso de entrada (especialmente 10–11), incorporación y apoyo de inglés; UK: centros/plazas de uno y dos trimestres, calendario vigente y equivalencia del curso escocés. Reconfirmar atributos de guías antes de cada propuesta.
2. **Presupuesto y servicio:** tarifa de Interlanguage, inclusiones/exclusiones, pago/cancelación y alcance del acompañamiento antes/durante/después. Responsable en destino, guardian, seguro, emergencias y seguimiento siguen pendientes en el checklist; no se publican como incluidos.
3. **Material y respaldo:** autorizaciones de imagen de menores, procedencia y uso de fotos; fotografía de internado/familia anfitriona; equipo identificado y testimonios con consentimiento. Documentación corporativa y relación con colegios antes de ampliar respaldo.
4. **Entrega de consultas:** decidir/configurar backend compatible con Netlify y verificar recepción real. Bloquea publicar como formulario operativo.
5. **Textos de marketing del 07-10-2026 que hay que confirmar antes de publicar:** (a) «Año escolar» como oferta en los tres países, incluido Estados Unidos, del que no hay datos de programa; (b) lo que nos diferencia: «una selección de colegios», «te decimos lo que no encaja» (en la guía de lanzamiento aún es un objetivo, no una práctica verificada) y «30 años enseñando inglés en España con profesores 100 % nativos» (trayectoria en inglés, no en estancias en el extranjero); (c) los mensajes de las escenas («se aprende participando, con laboratorios, proyectos y debates», «ganan autonomía, responsabilidad y confianza», actividades fuera de clase) son afirmaciones generales de la propiedad, sin datos de ningún colegio; (d) **pasos 5 y 6 (añadidos el 07-10-2026):** solo dicen que se ayuda con la documentación y la solicitud al colegio, que se orienta en alojamiento, documentación y viaje, que se prepara al alumno y que se sigue en contacto con la familia. **No se publican** guardian, seguro, traslados, protocolo de emergencias 24/7, portal de familias, plataforma de inglés ni cadencia de seguimiento: la guía de lanzamiento los recoge como tareas pendientes, y falta definir el modelo jurídico (consultoría, agente, intermediario u organizador de viajes combinados) antes de prometer gestiones.

## Fotografías

Reutilizadas variantes AVIF/WebP/JPEG aprobadas sin generar ni retocar. «Vivir» muestra campus, no alojamiento, y sigue provisional. Irlanda muestra un viaje y Estados Unidos un aula con bandera (foto aportada por Jaime el 06-10-2026, `usa-aula.jpg`; Jaime confirma que está tomada y con consentimiento firmado, 06-10-2026); no se usan como prueba de colegios colaboradores o modalidades. La cabecera `hero-arco-3` tiene origen generado/composición de cabezas documentados en AGENTS.md; no presentarla como alumnos propios o experiencia real. Publicación previa no acredita derechos de imagen.

Galería «Más actividades» (06-10-2026): diez fotos aportadas por Jaime (remo, tenis, equitación, orquesta, piano, teatro, ciencias, robótica, arte, cocina). Jaime confirma que están tomadas y con consentimiento firmado. No se asocian a ningún destino ni colegio: la oferta depende de cada centro.

## Bloqueo de envío

`leadForm` y `main.js` envían a `form-handler.php`. Netlify sirve archivos estáticos y no ejecuta PHP; la ruta publicada devuelve 404. El servidor local tampoco ejecuta PHP. No se despliega ni se simula un éxito. Se hace clicable `mailto:info@interlanguage.es` para contacto directo. La migración del backend afectaría a otros formularios y requiere configurar la recepción real.

## Fuera del alcance

Pendiente revisar cifras generales de familias, trayectoria del pie/meta/JSON-LD, cruces antiguos de campamentos/extraescolar y plazos del formulario general. Su texto publicado no acredita servicios internacionales.

## Vista previa

`http://localhost:8752/web-publica/index.html#servicio-extranjero`

Servidor: `python3 -m http.server 8752` desde la raíz, sin build ni dependencias nuevas.
