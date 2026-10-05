# Estudiar en el extranjero: pendientes internos

Documento interno (no se publica: Netlify solo sirve `web-publica/`). Estado a 05-10-2026, versión de revisión sin publicar.

La página `#servicio-extranjero` solo pinta lo confirmado. Todo lo demás está aquí, sin rellenar y sin aparecer como hecho en la web.

## De dónde sale la información

| Fuente | Qué es | Uso |
|---|---|---|
| Encargo de Jaime | Interlanguage ofrece estudios en el extranjero para familias con hijos en edad escolar; 30 años enseñando inglés en España con profesores nativos | Cabecera y respaldo |
| `Downloads/Colegios Irlanda.pdf` y `Downloads/Colegios UK.pdf` (guías internas, sep 2026) | Fichas de colegios de la cartera con estado (ACTIVO, transición, reconfirmar, cerrado, no comercializar) y fuente base (web del colegio, GOV.UK, ISI) | **Comparación y detalle de Reino Unido e Irlanda** |
| `Interlanguage_Checklist_Lanzamiento_Study_Abroad_2026.pdf` | Plan previo al lanzamiento: países iniciales UK e Irlanda; las 18 prioridades y el «gate» de 10 puntos están en «Pendiente» | Contexto: por qué no se publican seguro, guardian, protocolo, precios |
| `Resumen_Reunion_Longridge…pdf`, Q&A de Longridge, Partner Pack | Reunión informal con un colegio, sin acuerdo cerrado («puntos que conviene confirmar por escrito»); presentación para partners | No se usa para nada público |
| `ASTEX`, `EF`, `AE IDIOMAS`, `Informe_Estrategico…` | Documentos de competidores y estudio de mercado confidencial | No se usan: no son nuestra oferta |

**Regla de publicación aplicada a las guías.** Solo centros en estado ACTIVO y solo atributos descriptivos (tipo de colegio, alojamiento, admisión, vida escolar, zona). Quedan fuera: nombres de colegios, precios, comisiones, cualquier nota comercial («punto clave», «lo que puede atraer a una familia», «operativa Interlanguage»), todo lo marcado «reconfirmar», «transición» o «actualización», y lo cerrado o no comercializable. La propia guía dice que cada punto hay que reconfirmarlo antes de proponer una plaza, por eso la comparación lo avisa.

## Alcance real: Reino Unido, Irlanda y Estados Unidos

| Destino | Qué consta | Decisión |
|---|---|---|
| **Reino Unido** | La guía UK tiene centros activos en **Inglaterra** (cuatro) y **Escocia** (dos). | **Se llama «Reino Unido»** y se dice «Inglaterra» o «Escocia» solo para un centro o zona concretos. **Corrijo la decisión anterior de usar «Inglaterra»**: se tomó sin haber visto las guías y se quedaba corta. |
| **Irlanda** | La guía de Irlanda tiene centros activos de secundaria, con internado y de día con familia anfitriona. | Se mantiene. |
| **Estados Unidos** | **No hay ningún documento de programas.** El checklist habla de «UK, Irlanda o ambos» y el informe lo menciona solo en general. | Se mantiene la tarjeta, el titular y un bloque breve que remite a la orientación, porque el encargo pide tres países. **Confirmar o retirar.** |

Para cambiar el nombre del Reino Unido o quitar Estados Unidos: textos de la vista en `index.html` e `index-en.html`, selector `#leadDest` y `DESTINOS` de `js/main.js`.

## Qué se publica en la comparación y de qué parte de las guías sale

Sin nombres de colegios; las referencias son páginas de cada guía.

| Criterio | Reino Unido (guía UK) | Irlanda (guía Irlanda) |
|---|---|---|
| Edad y curso | Rangos de edad y «boarding desde Year 5 / Year 7»: pp. 3, 5, 6, 7, 11 | **Sin dato**: la guía no da edades. Solo «secundaria» |
| Duración | Curso completo habitual; trimestres limitados en uno, ninguna estancia corta en otro: pp. 5, 10 | **Sin dato** |
| Tipo de colegio | Independientes mixtos, Inglaterra y Escocia: pp. 3 a 11 | Secundaria; tradición religiosa; mixtos, uno solo de chicos y uno solo de chicas: pp. 4, 5, 7 a 15 |
| Alojamiento | Full, weekly, flexi; actividades de fin de semana; guardian exigido en dos: pp. 5, 6, 7, 10, 11 | 5, 5½ y 7 días; día con familia anfitriona; fines de semana cerrados: pp. 5 a 8, 11, 13, 14 |
| Nivel de inglés y acceso | Sin examen, informes, entrevista, jornada de prueba, valoración de inglés, EAL: pp. 3, 5, 6, 10, 11 | **Sin dato**: «revisar nivel de inglés con cada colegio» |
| Vida escolar | Actividades de tardes y fines de semana; golf e hípica: pp. 5, 6, 7, 11 | Deporte de equipo, música y cultura: pp. 4, 5, 10 |
| Zona (ampliación) | Suroeste y norte de Inglaterra, este de Escocia | Dublín y condados del sur, oeste y noroeste |
| Continuidad (ampliación) | IB en Sixth Form (p. 11) y «equivalencia del curso escocés» a revisar (p. 7) | **Sin dato** |
| Presupuesto (ampliación) | **Sin datos comparables** | **Sin datos comparables** |

El único dato de sistema educativo general es que Inglaterra y Escocia tienen sistemas distintos, con su propio currículo y exámenes (verificado en fuentes públicas). Va en una línea aparte y rotulada «información general», fuera de «nuestra oferta». El trámite de homologación o convalidación en España se remite al Ministerio de Educación con su enlace oficial, sin afirmar quién lo hace.

## Qué se ha dejado fuera a propósito

- **Transition Year**: la guía lo cita en tres colegios irlandeses como «gancho comercial según la edad». No consta que se ofrezca a alumnos internacionales ni a qué edades.
- **Programas J-1 e internados «de prestigio»**: solo aparecen en el estudio de mercado.
- **Estancias cortas y programas de verano** (el programa de inglés de Londres, la colocación en colegios de Brighton, los campamentos): la guía los marca como producto distinto del colegio, en reconfirmación o reestructurados. Por eso se retiró el bloque «Modalidades» con «2 a 4 semanas» y «semestre»: no había dato que lo respaldara.
- **Datos de la reunión con un colegio** (tarifas semanales, comisión del 10 al 15 %, actividades concretas, política de móviles): son orales y confidenciales.
- **Acompañamiento propio** (guardian, coordinador, seguimiento, seguro): el checklist los marca como pendientes.

## Estado de la página

| # | Bloque | Estado |
|---|---|---|
| 1 | Cabecera | Hecho |
| 2 | Respaldo verificable | Hecho, mínimo (trayectoria en inglés en España, profesorado, contacto) |
| 3 | Destinos | Hecho; ficha de edades, duración y alojamiento solo con lo confirmado (Reino Unido tres filas, Irlanda una, Estados Unidos ninguna) |
| 4 | Comparación | **Hecho para Reino Unido e Irlanda** (6 criterios y ampliación). Falta Estados Unidos |
| 5 | Modalidades y duración | **Retirado**: la duración vive en la comparación y en «Programas» del detalle |
| 6 | Alojamiento y vida escolar | Dentro de la comparación y del detalle por destino |
| 7 | Acompañamiento | Parcial: «Cómo te orientamos». Falta el acompañamiento durante y después |
| 8 | Experiencias reales | Pendiente |
| 9 | Presupuesto | Hecho, sin precios |
| 10 | Preguntas frecuentes | Hecho (5) |
| 11 | Contacto específico | Hecho: formulario en la misma página, con país y programa conservados y vuelta al punto de origen |

Detalle por destino: Reino Unido completo (menos «acompañamiento»), Irlanda con tres apartados que remiten al colegio, Estados Unidos solo un bloque breve. No se han creado páginas nuevas: cada destino tiene su dirección `#servicio-extranjero-<destino>` y las antiguas siguen funcionando.

## Datos que faltan

**Confirmar antes de publicar**
- Que los atributos de las guías se pueden publicar tal cual y que se mantienen para el próximo curso (la guía pide reconfirmarlos).
- Si se pueden nombrar colegios y qué relación hay con cada uno (la reunión con Longridge no cerró acuerdo y el checklist lista el contrato B2B como pendiente).
- Estados Unidos: si existe programa y con qué colegios o proveedores.
- Si el Reino Unido incluye Gales o Irlanda del Norte (hoy solo Inglaterra y Escocia).

**Irlanda:** edades por colegio, duraciones disponibles, fechas de inicio, apoyo de inglés, si el Transition Year se ofrece a internacionales.

**Reino Unido:** qué colegios admiten trimestres y cuántas plazas, fechas 2027/28, equivalencia del curso escocés.

**Presupuesto (ambos):** precio o «desde» por modalidad, qué incluye y qué no, pago y cancelación. Hay tarifas de colegios en las guías y en la reunión, pero son de terceros y no se publican.

**Acompañamiento (ambos):** guardian (quién lo hace: la reunión sugiere que Interlanguage podría), coordinador, seguro, protocolo de emergencias, seguimiento a la familia, cambio de familia.

**Experiencias reales:** testimonios con consentimiento por escrito; autorización de imagen de las fotos con menores; qué fotos son de alumnos propios.

**Respaldo:** razón social, CIF, domicilio, régimen aplicable a la venta de estos programas (a confirmar con la asesoría).

**Contacto:** persona asesora, teléfono o WhatsApp, plazo real de respuesta, edades del selector (10 a 18, tomado de lo ya publicado).

## Decisiones tomadas por mí, reversibles

1. «Reino Unido» y no «Inglaterra» (arriba).
2. Estados Unidos se mantiene con un bloque breve; sin comparación ni detalle.
3. Se retira «Modalidades y duración».
4. Edades 10 a 18 en el formulario de esta página.
5. Trato de «tú» en los textos nuevos.
6. Los tres últimos criterios de la comparación van en una ampliación desplegable.
7. «Presupuesto» aparece como fila porque lo pide el encargo, con el texto «no hay precios comparables publicados».

## Lo que sigue publicado fuera de esta página (no se ha tocado)

| Dónde | Texto | Problema |
|---|---|---|
| Home, bloque Experiencias internacionales (`#destinos`) | «Colegios de nuestra cartera», «Un coordinador en destino», «Sin perder el curso», «acompañamiento 24/7», «Respuesta en menos de 24 h», edades 10 a 18 | La cartera ya está documentada, pero coordinador, 24/7, convalidación y plazo no constan |
| Home, hero y «Un programa para cada etapa» | «Más de 1.000 familias acompañadas»; «Desde dos semanas hasta un curso completo… acompañamiento antes, durante y después» | Cifra sin fuente; duración y acompañamiento sin confirmar |
| Home, buscador por edad | El tramo 7–10 no ofrece extranjero; el 15–18 omite las dos semanas | Contradice «desde 10 años» y la duración documentada |
| Pie, meta y JSON-LD | «30 años formando el inglés… hasta los estudios en el extranjero» | Presenta la trayectoria en inglés como trayectoria en estancias |
| Home, cruces con campamentos y Conócenos | «Muchas de estas familias siguen con nosotros cuando sus hijos dan el salto a estudiar en el extranjero» | No consta ninguna familia que ya haya ido |
| Formulario compartido | «Respuesta en menos de 24 h», «vuestra solicitud» | Plazo sin confirmar; voz «vosotros» |
| Banner de cookies | Botones de 40 px de alto | Zona táctil por debajo de 44 px |

## Bloqueante que sigue abierto

**El formulario no entrega los envíos.** `form-handler.php` es PHP y en Netlify da 404. Todo el flujo termina en un mensaje de error hasta decidir cómo entregar (por ejemplo Netlify Forms).

## Cuando lleguen los datos

1. Actualizar esta tabla con lo confirmado.
2. Añadir la fila en `dl.ext-ficha` de cada tarjeta (siempre la misma fila en los tres destinos) y la celda en la comparación y en el detalle.
3. Para un tercer destino en la comparación: una columna más (`th` y `td[data-label]`); en móvil se apila sola.
4. Subir `?v=` de `styles.css` y `main.js` en `index.html`, `index-en.html`, `legal.html` y `404.html`.
