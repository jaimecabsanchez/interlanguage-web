# Auditoría de la web pública (interlanguage.es)

Fecha: 12-10-2026 · Versión publicada: styles.css v98 · main.js v39 · commit 728c6bd · 56 puntos.

Versión visual con capturas: `docs/auditoria-web-2026-10/auditoria-web.html` (no se sube a git). Este Markdown es la copia de trabajo para Codex y Claude: cada punto lleva un número para pedirlo por chat («haz el 14»).

## Estado por área

| Área | Estado | Resumen |
|---|---|---|
| Conversión | Crítico | Los formularios no llegan al equipo y no hay ninguna medición. |
| Experiencia de uso | Mejorable | Navegación clara, pero los programas son vistas de una sola página y algunas son muy largas en móvil. |
| Diseño visual | Bien | Identidad sobria y coherente. Un bloque roto en producción y una escala tipográfica sin sistema. |
| Velocidad | Mejorable | Escritorio rápido (≈1 s). En móvil, 3,2 s en la portada y 4,7 s en extranjero. |
| Imágenes | Mejorable | Técnica excelente. Origen de las fotos principales sin confirmar y dos fotos borrosas. |
| Contenido | Mejorable | Claro y prudente. Voz mezclada (tú/vosotros), datos caducados y preguntas sin responder. |
| SEO | Débil | Google ve una sola página para cuatro programas. |
| Accesibilidad | Bien | Cero fallos automáticos en 9 páginas y dos anchos. Falta una prueba con lector de pantalla. |
| Legal y seguridad | Crítico | Aviso legal con huecos y la guía interna se puede leer en la web. Cabeceras de seguridad excelentes. |
| Código | Mejorable | Simple y sin dependencias, pero duplicado (ES/EN) y sin pruebas en el repositorio. |

## Plan

### Esta semana

Arreglos urgentes o muy baratos: lo que hoy rompe algo, expone algo o confunde en producción.

| n.º | Punto | Área | Prioridad | Esfuerzo | Quién |
|---|---|---|---|---|---|
| 1 | Las consultas y las inscripciones no llegan | Conversión | Urgente | Medio | Decisión vuestra + código |
| 47 | La guía interna AGENTS.md se puede leer en la web | Legal y seguridad | Urgente | Pequeño | Código |
| 48 | Aviso legal con los huecos sin rellenar | Legal y seguridad | Urgente | Pequeño | Material vuestro |
| 3 | El aviso de cookies pide permiso para algo que no existe y tapa los botones en el móvil | Conversión | Alta | Pequeño | Decisión vuestra + código |
| 4 | El campamento enseña la edición de 2026, que ya terminó, y deja solicitar plaza | Conversión | Alta | Pequeño | Material vuestro (fechas, tarifas y sedes 2027) + código |
| 14 | El cierre de «Por qué nosotros» está roto en producción | Diseño visual | Alta | Pequeño | Código |
| 18 | El logo pesa 66 KB | Velocidad | Alta | Pequeño | Código (+ el logo en vector, si lo tenéis) |
| 31 | Restos de «Especialidades», un programa sin confirmar | Contenido | Media | Pequeño | Código |
| 32 | «¿Y más adelante?» promete un verano en el extranjero | Contenido | Media | Pequeño | Código |
| 49 | Política de privacidad y nuevo receptor de formularios | Legal y seguridad | Media | Pequeño | Código + asesoría |
| 22 | Netlify añade un script propio en producción | Velocidad | Baja | Pequeño | Vosotros (panel de Netlify) |

### Este mes

Lo que más mejora la confianza y la conversión con un esfuerzo razonable.

| n.º | Punto | Área | Prioridad | Esfuerzo | Quién |
|---|---|---|---|---|---|
| 2 | No hay ninguna medición de visitas ni de conversiones | Conversión | Alta | Medio | Decisión vuestra + código |
| 17 | En el móvil, la primera carga es lenta | Velocidad | Alta | — | Código |
| 24 | Fotos principales que parecen generadas con IA, con origen sin confirmar | Imágenes | Alta | Medio | Decisión + material vuestro |
| 29 | Mezcla de tú y vosotros, a veces en la misma frase | Contenido | Alta | Medio | Decisión vuestra + código |
| 5 | Sin teléfono, dirección ni WhatsApp | Conversión | Media | Pequeño | Decisión vuestra |
| 6 | Falta prueba social real, y «Por qué nosotros» no muestra a nadie | Conversión | Media | Medio | Material vuestro |
| 7 | Extraescolar: falta lo que necesita una familia para apuntarse | Conversión | Media | Pequeño | Material vuestro + código |
| 11 | Nombres distintos para lo mismo | Experiencia de uso | Media | Pequeño | Decisión vuestra + código |
| 12 | Inscripción al campamento: campos que se pueden simplificar | Experiencia de uso | Media | Pequeño | Decisión vuestra + código |
| 19 | Fuentes: 177 KB antes de pintar | Velocidad | Media | Medio | Código |
| 20 | El texto salta cuando llegan las fuentes | Velocidad | Media | Pequeño | Código |
| 25 | Fotos borrosas en la página del campamento (escritorio) | Imágenes | Media | Pequeño | Código (+ originales vuestros) |
| 30 | «30 años» dicho de tres maneras, y extendido al extranjero | Contenido | Media | Pequeño | Decisión vuestra + código |
| 33 | Franja de confianza: un servicio en lugar de un dato, y distinta en inglés | Contenido | Media | Pequeño | Código |
| 34 | Preguntas habituales que la web no responde | Contenido | Media | Medio | Material vuestro |
| 40 | Search Console y Perfil de Empresa de Google | SEO | Media | Pequeño | Vosotros |
| 44 | Falta una prueba con lector de pantalla y en móviles reales | Accesibilidad | Media | Medio | Vosotros + código |
| 50 | Datos de salud de menores en la inscripción | Legal y seguridad | Media | Pequeño | Decisión vuestra (asesoría) |
| 53 | Las pruebas automáticas no están en el repositorio | Código | Media | Medio | Código |
| 8 | Sin plazo de respuesta | Conversión | Baja | Pequeño | Decisión vuestra |
| 16 | Detalles visuales | Diseño visual | Baja | Pequeño | Código |
| 27 | 32,7 MB de imágenes publicadas sin usar | Imágenes | Baja | Pequeño | Código |
| 36 | Expresiones que se pueden malinterpretar | Contenido | Baja | Pequeño | Código |
| 42 | Título y descripción de la portada | SEO | Baja | Pequeño | Código |
| 45 | Selector de idioma con una etiqueta no válida | Accesibilidad | Baja | Pequeño | Código |
| 46 | Enlaces del pie pequeños en el móvil | Accesibilidad | Baja | Pequeño | Código |
| 55 | Código muerto | Código | Baja | Pequeño | Código |

### Próximo trimestre

Cambios de estructura y de material que conviene planificar.

| n.º | Punto | Área | Prioridad | Esfuerzo | Quién |
|---|---|---|---|---|---|
| 9 | Los programas no son páginas: son vistas dentro de la portada | Experiencia de uso | Alta | Grande | Decisión vuestra + código |
| 39 | Google solo ve una página para cuatro programas | SEO | Alta | Grande | Código |
| 10 | Páginas muy largas en el móvil | Experiencia de uso | Media | Medio | Código |
| 15 | Tamaños y espacios sin una escala | Diseño visual | Media | Medio | Código |
| 21 | Se descargan imágenes que no se ven | Velocidad | Media | Incluido en n.º 9 | Código |
| 26 | Faltan fotos que expliquen la oferta | Imágenes | Media | Medio | Material vuestro |
| 41 | Datos estructurados mínimos | SEO | Media | Pequeño | Código |
| 51 | Modelo jurídico del servicio de extranjero | Legal y seguridad | Media | Medio | Decisión vuestra (asesoría) |
| 52 | Dos copias completas de la web | Código | Media | Grande | Código |
| 13 | «← Volver a servicios» encabeza cada programa en el móvil | Experiencia de uso | Baja | Pequeño | Código |
| 23 | Una sola página de 159 KB con todo dentro | Velocidad | Baja | Incluido en n.º 9 | Código |
| 28 | Portada y cabecera de extranjero, algo blandas en Retina | Imágenes | Baja | — | — |
| 35 | Títulos que no dicen qué es | Contenido | Baja | Pequeño | Decisión vuestra |
| 37 | La versión en inglés no la ha revisado un nativo | Contenido | Baja | Pequeño | Material vuestro |
| 38 | Qué programa va primero en la portada | Contenido | Baja | Pequeño | Decisión vuestra |
| 43 | Contenido que capte búsquedas | SEO | Baja | Grande | Código + material vuestro |
| 54 | CSS con reglas que no se usan | Código | Baja | Medio | Código |
| 56 | La guía AGENTS.md de la web crece sin parar | Código | Baja | Pequeño | Código |

### Lo que necesito de vosotros

**Decisiones**

- Receptor de los formularios (n.º 1)
- Herramienta de analítica y, con ella, el aviso de cookies (n.º 2)
- Voz: tú o vosotros (n.º 29)
- Teléfono o WhatsApp atendido, o quitar el botón (n.º 5)
- Pasar a páginas propias por programa (n.º 9)
- «Por qué nosotros» o «Conócenos» (n.º 11)
- Plazo de respuesta que podéis cumplir (n.º 8)
- Programa prioritario en cada época (n.º 38)
- Modelo jurídico del servicio de extranjero (n.º 51)

**Datos**

- Datos de la sociedad para el aviso legal (n.º 48)
- Fechas, tarifas y sedes del campamento 2027 (n.º 4)
- Colegios del extraescolar y si se admiten altas durante el curso (n.º 7)
- Respuestas a las preguntas frecuentes que faltan (n.º 34)
- Año de fundación (para «30 años») (n.º 30)

**Material**

- Testimonios reales con permiso y la foto del equipo (n.º 6)
- Fotos reales de colegios, internado, familia anfitriona y sedes (n.º 24)
- Originales del campamento con más resolución (n.º 25)
- Logo en vector (SVG, PDF o AI) (n.º 18)

**Accesos**

- Desactivar la barra de Netlify en el panel (n.º 22)
- Search Console y Perfil de Empresa de Google (n.º 40)
- Una prueba real de envío cuando esté el receptor (n.º 1)

## Conversión

Lo que hace que una familia acabe escribiéndoos y lo que hoy lo impide.

**Estado:** Crítico. Los formularios no llegan al equipo y no hay ninguna medición.

**Lo que está bien:**

- Formulario de consulta en dos pasos, con etiquetas visibles, resumen y errores concretos.
- Explicación humana de qué pasa con la consulta y casillas de privacidad y novedades separadas.
- Botones de acción claros y repetidos con sentido («Pedir orientación», «Solicitar plaza»).

### 1. Las consultas y las inscripciones no llegan

*Prioridad:* Urgente · *Esfuerzo:* Medio · *Quién:* Decisión vuestra + código · *Cuándo:* Esta semana · *Estado:* Comprobado

**Qué pasa.** En producción, `form-handler.php` responde 404 (comprobado hoy en interlanguage.es). Netlify no ejecuta PHP y `netlify.toml` lo bloquea a propósito desde el 28-09-2026. Los dos formularios, la consulta y la inscripción al campamento, envían ahí (`js/main.js:95`). He reproducido en local esa respuesta, sin enviar nada fuera: la familia completa los dos pasos, pulsa «Enviar consulta» y ve «No hemos podido enviar la solicitud…». `docs/extranjero-pendientes.md` ya lo marcaba como bloqueo.

**Por qué importa.** Es el final de todo el recorrido: cada familia que lo intenta se pierde o tiene que escribir aparte. No sabemos cuántas han sido, porque tampoco hay analítica (n.º 2).

**Qué hacer.**

- Elegir receptor. Lo más rápido es **Netlify Forms**: lo detecta en el HTML, avisa por correo y no necesita servidor. Alternativas: una Edge Function en el proyecto de Supabase que ya existe para las llamadas, con un proveedor de correo, o el PHP en un hosting que lo ejecute (Arsys), abriendo su dominio en la CSP de `_headers`.
- Adaptar el envío de la consulta y de la inscripción al receptor elegido, sin cambiar los nombres de campo.
- Hacer vosotros una prueba real de punta a punta (una consulta de prueba hasta la bandeja de entrada) y repetirla tras cada despliegue.
- Mientras tanto, que el mensaje de error ofrezca el correo como enlace y no diga «inténtalo de nuevo en unos segundos».

### 2. No hay ninguna medición de visitas ni de conversiones

*Prioridad:* Alta · *Esfuerzo:* Medio · *Quién:* Decisión vuestra + código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** `main.js` prepara eventos (`clic_cta`, `lead_generado`, `formulario_enviado`…) en `dataLayer`, pero no se carga ninguna herramienta que los recoja: la CSP solo permite el propio dominio. No he visto Search Console ni otra fuente de datos.

**Por qué importa.** Sin datos no se sabe qué página trae consultas, qué botón funciona ni si un cambio mejora o empeora. Las prioridades de este documento son de criterio, no de datos.

**Qué hacer.**

- Decidir la herramienta. Recomendación: una analítica sin cookies (por ejemplo Plausible, Umami o la analítica de servidor de Netlify): no exige aviso de cookies.
- Si preferís Google Analytics 4, hacen falta Google Tag Manager, el modo de consentimiento y abrir sus dominios en la CSP.
- Medir como conversiones el envío correcto de la consulta y de la inscripción y los clics en el correo.
- Dar de alta Google Search Console (gratis; se verifica por DNS) para ver qué búsquedas os traen.

### 3. El aviso de cookies pide permiso para algo que no existe y tapa los botones en el móvil

*Prioridad:* Alta · *Esfuerzo:* Pequeño · *Quién:* Decisión vuestra + código · *Cuándo:* Esta semana · *Estado:* Comprobado

**Qué pasa.** Dice «Usamos cookies propias y de terceros (analítica)», pero la web no carga analítica ni terceros; la decisión se guarda en el navegador (`localStorage`). En un móvil de 390 × 844 ocupa los últimos ~170 px de la primera pantalla, justo donde quedan «Solicitar plaza» (campamento) y «Pedir orientación» (extranjero). `legal.html#cookies` repite lo mismo.

**Por qué importa.** Es la primera interacción de cada visitante nuevo, describe un tratamiento que no ocurre y tapa la acción principal.

**Qué hacer.**

- Si se elige analítica sin cookies (n.º 2): quitar el aviso y dejar en la política «solo cookies técnicas».
- Si se usan cookies de analítica: texto exacto (qué herramienta y para qué), los dos botones iguales como ahora y un enlace «Configurar cookies» en el pie para cambiar de opinión (hoy solo se puede borrando los datos del navegador).

### 4. El campamento enseña la edición de 2026, que ya terminó, y deja solicitar plaza

*Prioridad:* Alta · *Esfuerzo:* Pequeño · *Quién:* Material vuestro (fechas, tarifas y sedes 2027) + código · *Cuándo:* Esta semana · *Estado:* Comprobado

**Qué pasa.** Hoy la ficha dice «22 de junio – 24 de julio · Fechas publicadas», el formulario ofrece «Semana 1: 22–26 jun.» y las tarifas no indican año. La nota «Consulta las fechas… de la próxima edición antes de solicitar plaza» convive con el botón «Solicitar plaza». Por los días de la semana, esas fechas son de 2026.

**Por qué importa.** Una familia no sabe si se apunta para 2027 ni a qué precio, y quien quiera reservar pronto no tiene a dónde ir. Es buena época para recoger interés para el verano siguiente.

**Qué hacer.**

- Entre temporadas: estado «Verano 2027: fechas y tarifas en preparación» y un formulario corto «Avisadme cuando abra la inscripción» (nombre, correo, edad, sede preferida y la casilla de novedades).
- Ocultar el selector de semanas y el total hasta tener fechas y tarifas confirmadas.
- Cuando estén: fechas y tarifas con año («Verano 2027») y fuera la etiqueta «Fechas publicadas».

### 5. Sin teléfono, dirección ni WhatsApp

*Prioridad:* Media · *Esfuerzo:* Pequeño · *Quién:* Decisión vuestra · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** El único canal además del formulario es info@interlanguage.es. Hay un botón de WhatsApp en el código (`#whatsappFloat`), oculto y con `href="#"`. Los datos estructurados no llevan teléfono ni dirección.

**Por qué importa.** Muchas familias, sobre todo las del campamento, prefieren llamar o escribir por WhatsApp. Un teléfono y una dirección visibles dan confianza a un negocio local.

**Qué hacer.**

- Si tenéis un teléfono o un WhatsApp atendido: mostrarlo en el contacto, el pie y el JSON-LD, con el horario de atención.
- Si no: borrar el botón oculto del HTML, el CSS y el JS.

### 6. Falta prueba social real, y «Por qué nosotros» no muestra a nadie

*Prioridad:* Media · *Esfuerzo:* Medio · *Quién:* Material vuestro · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** No hay testimonios, valoraciones, nombres ni caras del equipo. «Más de 1000 familias acompañadas» no tiene nada que lo respalde a la vista. «Por qué nosotros» promete «una persona de referencia» sin una sola foto (la del equipo está pendiente; la plantilla ya está preparada).

**Por qué importa.** Para confiar un hijo (y más para un año fuera), las familias buscan personas reales y la opinión de otras familias.

**Qué hacer.**

- Reunir de 3 a 6 testimonios reales con permiso por escrito (nombre o iniciales, programa y año).
- Hacer la foto del equipo y publicarla con `scripts/generar-foto-equipo.py`.
- Enlazar vuestras reseñas de Google si existen.
- No inventar ni reescribir opiniones.

### 7. Extraescolar: falta lo que necesita una familia para apuntarse

*Prioridad:* Media · *Esfuerzo:* Pequeño · *Quién:* Material vuestro + código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** El botón dice «Consultar plazas para el curso», pero el curso empezó en octubre y no se dice si se puede entrar a mitad de curso. No hay lista de colegios donde dais clase. Horario y tarifa son «de este centro» (Sagrado Corazón), sin explicar qué cambia en los demás.

**Por qué importa.** La primera pregunta de una familia es «¿estáis en mi colegio?». Si no encuentra la respuesta, pregunta menos o no pregunta.

**Qué hacer.**

- Publicar la lista de colegios, o «consulta si estamos en tu colegio» con el formulario ya preparado.
- Decir si se admiten altas durante el curso y cómo.
- Separar las condiciones generales de las de cada colegio.

### 8. Sin plazo de respuesta

*Prioridad:* Baja · *Esfuerzo:* Pequeño · *Quién:* Decisión vuestra · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** Desde que se quitó «menos de 24 h», el texto es «Os responderemos personalmente», sin plazo.

**Por qué importa.** Un plazo reduce la incertidumbre y los mensajes repetidos.

**Qué hacer.**

- Si podéis cumplirlo, indicar un plazo realista (por ejemplo, «en dos días laborables»). Si no, dejarlo como está.

## Experiencia de uso

Cómo se mueve una familia por la web: páginas, navegación y formularios.

**Estado:** Mejorable. Navegación clara, pero los programas son vistas de una sola página y algunas son muy largas en móvil.

**Lo que está bien:**

- Menú corto; «Programas» se abre con el primer clic y, en móvil, los programas salen directamente.
- Buscador por edad en la portada y formulario que se adapta al programa elegido.
- Índice «En esta página» en extranjero y comparación con los dos países a la vista en móvil.
- El botón «Atrás» del navegador vuelve donde estabas.

### 9. Los programas no son páginas: son vistas dentro de la portada

*Prioridad:* Alta · *Esfuerzo:* Grande · *Quién:* Decisión vuestra + código · *Cuándo:* Próximo trimestre · *Estado:* Comprobado

**Qué pasa.** Campamento, extraescolar, extranjero y Por qué nosotros son direcciones `#servicio-…` dentro de `index.html`. Medido en producción con móvil simulado: (a) al abrir un enlace directo al campamento se ve primero la portada y, un instante después, el campamento; (b) se descargan la foto y las tarjetas de la portada aunque se pida otra página (extranjero: 911 KB al cargar); (c) al compartir el enlace por WhatsApp la vista previa es siempre la de la portada (mismo título, descripción y foto); (d) Google no las trata como páginas (n.º 39).

**Por qué importa.** Afecta a la vez a la velocidad, al SEO, a cómo se comparte la web y a la sensación de solidez. Es la mejora estructural más importante.

**Qué hacer.**

- Convertir cada programa en una página con dirección propia: `/campamento-verano-madrid/`, `/ingles-extraescolar/`, `/estudiar-en-el-extranjero/`, `/por-que-interlanguage/` y sus versiones en inglés.
- Reutilizar el CSS y el JS; las direcciones `#servicio-…` antiguas redirigen a la página nueva.
- Para no copiar a mano cabecera, pie y formulario en ocho archivos, generar las páginas con un script local en Python, como los de `scripts/`. Netlify seguiría publicando HTML estático, sin compilar nada en el servidor.
- Cambiar en `web-publica/AGENTS.md` la regla «No crees más HTML sueltos».

### 10. Páginas muy largas en el móvil

*Prioridad:* Media · *Esfuerzo:* Medio · *Quién:* Código · *Cuándo:* Próximo trimestre · *Estado:* Comprobado

**Qué pasa.** Altura a 390 px: extranjero 14 160 px (unas 17 pantallas), campamento 10 190, portada 8030 y extraescolar 6150. En el campamento, el formulario de inscripción ocupa casi la mitad de la página.

**Por qué importa.** En el móvil, cada pantalla de más reduce cuánta gente llega al final, que es donde está el contacto.

**Qué hacer.**

- Campamento: recoger el horario hora a hora y las preguntas, y llevar el formulario a su propio paso (o página) tras «Solicitar plaza».
- Portada: valorar fusionar «Crecemos con cada alumno» (tres etapas sin datos concretos) con «Por qué nosotros».
- Extranjero: el índice ya ayuda; medir con analítica hasta dónde se lee antes de recortar más.

### 11. Nombres distintos para lo mismo

*Prioridad:* Media · *Esfuerzo:* Pequeño · *Quién:* Decisión vuestra + código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** El menú dice «Programas»; el pie, «Servicios» y «Destinos»; cada programa empieza con «← Volver a servicios» (no hay una página «Servicios»: lleva a una sección de la portada), y el pie habla de «Formulario de contacto». En la navegación acordada figuraba «Conócenos» y la web dice «Por qué nosotros».

**Por qué importa.** Un vocabulario estable ayuda a orientarse y transmite orden.

**Qué hacer.**

- Usar «Programas» en todas partes y «← Todos los programas».
- Elegir «Por qué nosotros» o «Conócenos» y aplicarlo en el menú, el pie y el título.

### 12. Inscripción al campamento: campos que se pueden simplificar

*Prioridad:* Media · *Esfuerzo:* Pequeño · *Quién:* Decisión vuestra + código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** Pide apellidos del alumno, teléfono obligatorio y «Colegio actual» obligatorio con una lista de nueve colegios con nombre propio (Base, Retamar, Montealto, Estudio, Runamore, British Council School, Brains…) y un «Otro» sin campo para escribir cuál.

**Por qué importa.** Cada campo obligatorio resta envíos, y una lista con nombres de otros colegios puede leerse como una relación con ellos.

**Qué hacer.**

- Colegio como texto libre, o vuestras dos sedes más «Otro, ¿cuál?».
- Valorar pedir apellidos y teléfono al confirmar la plaza, no en la solicitud.

### 13. «← Volver a servicios» encabeza cada programa en el móvil

*Prioridad:* Baja · *Esfuerzo:* Pequeño · *Quién:* Código · *Cuándo:* Próximo trimestre · *Estado:* Comprobado

**Qué pasa.** Ocupa la primera línea de cada programa; en extranjero aparece bajo la foto, dentro del bloque marino.

**Por qué importa.** Con un menú claro sobra, y empuja el título hacia abajo.

**Qué hacer.**

- Quitarlo o convertirlo en unas migas discretas (Inicio › Programas › Campamento), que con páginas propias (n.º 9) también ayudan a Google.

## Diseño visual

Coherencia del sistema visual y fallos que se ven.

**Estado:** Bien. Identidad sobria y coherente. Un bloque roto en producción y una escala tipográfica sin sistema.

**Lo que está bien:**

- Paleta (marino, burdeos, marfil) y tipografías (Fraunces y Plus Jakarta Sans) aplicadas con disciplina.
- Tres niveles de sombra, iconos de línea de una sola familia y botones sin adornos.
- Buen ritmo entre bloques claros y marinos; sin degradados llamativos ni estética infantil.

### 14. El cierre de «Por qué nosotros» está roto en producción

*Prioridad:* Alta · *Esfuerzo:* Pequeño · *Quién:* Código · *Cuándo:* Esta semana · *Estado:* Comprobado

**Qué pasa.** El bloque «¿Hablamos de tu hijo o tu hija?» usa la clase `.ext-cierre`, que perdió su fondo marino cuando se rehízo la página de extranjero. Queda sin fondo y el botón «Pedir orientación», marfil sobre marfil, parece texto suelto (`css/styles.css:1107` solo le da color).

**Por qué importa.** Es el último botón de la página que más tiene que convencer.

**Qué hacer.**

- Devolverle el fondo marino (o reutilizar el cierre de otra página) y comprobarlo a 390 y 1440 px.

### 15. Tamaños y espacios sin una escala

*Prioridad:* Media · *Esfuerzo:* Medio · *Quién:* Código · *Cuándo:* Próximo trimestre · *Estado:* Comprobado

**Qué pasa.** `styles.css` usa 100 tamaños de letra distintos (.86, .88, .9, .92, .94, .95, .96, .97, .98 rem…), 27 puntos de corte (de 360 a 1200 px) y unos 350 valores distintos de margen y espaciado.

**Por qué importa.** Diferencias de 1 o 2 px entre bloques parecidos restan precisión, y cada cambio inventa un valor nuevo.

**Qué hacer.**

- Definir 7 u 8 tamaños como tokens (`--fs-xs` … `--fs-display`), 4 o 5 puntos de corte y una escala de espaciado.
- Migrar por secciones al tocar cada una, no de golpe.

### 16. Detalles visuales

*Prioridad:* Baja · *Esfuerzo:* Pequeño · *Quién:* Código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** En el móvil, la nota «Os responderemos personalmente. Sin compromiso.» bajo «Enviar consulta» queda con el icono a la izquierda y el texto centrado en dos líneas. Las miniaturas circulares de 44 px de la comparación cargan fotos de 400 px.

**Qué hacer.**

- Alinear el icono y el texto de la nota.
- Usar miniaturas de 100–140 px.

## Velocidad

Cuánto tarda en verse cada página, sobre todo en el móvil.

**Estado:** Mejorable. Escritorio rápido (≈1 s). En móvil, 3,2 s en la portada y 4,7 s en extranjero.

**Lo que está bien:**

- Fotos en AVIF/WebP con varios tamaños y carga diferida.
- Caché larga para CSS, JS, fuentes e imágenes versionadas; el HTML se revalida siempre.
- Compresión Brotli, HTTP/2 y fuentes alojadas en el propio dominio, sin terceros.
- Sin saltos de diseño en casi todas las vistas (CLS 0).

| Página | Móvil · primer contenido | Móvil · elemento principal (LCP) | Móvil · bloqueo (TBT) | Móvil · saltos (CLS) | Móvil · descarga inicial | Escritorio · LCP |
|---|---|---|---|---|---|---|
| Portada | 2,0 s | 3,2 s | 450 ms | 0 | 659 KB | 0,9 s |
| Portada (inglés) | 1,8 s | 3,2 s | 215 ms | 0 | 658 KB | 1,1 s |
| Estudiar en el extranjero | 1,8 s | 4,7 s | 360 ms | 0,002 | 911 KB | 1,0 s |
| Campamento | 1,8 s | 2,4 s | 50 ms | 0 | 681 KB | 1,3 s |
| Extraescolar | 1,7 s | 2,7 s | 200 ms | 0 | 485 KB | 1,0 s |
| Por qué nosotros | 1,6 s | 1,9 s | 185 ms | 0,116 | 436 KB | 1,3 s |

Referencia de Google: LCP bueno ≤ 2,5 s; CLS bueno < 0,1; TBT bueno < 200 ms.

### 17. En el móvil, la primera carga es lenta

*Prioridad:* Alta · *Esfuerzo:* — · *Quién:* Código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** Tiempo hasta ver el elemento principal (LCP) en un móvil simulado (4G lenta, procesador ×4), mediana de tres cargas en producción: portada 3,2 s, extranjero 4,7 s, extraescolar 2,7 s, campamento 2,4 s y Por qué nosotros 1,9 s. Google considera «bueno» hasta 2,5 s. En escritorio, todas rondan 1 s. La tabla completa está al principio de esta pestaña.

**Por qué importa.** Muchas familias llegan desde el móvil (por ejemplo, desde un enlace en WhatsApp). Cada segundo de espera hace que algunas se vayan.

**Qué hacer.**

- Las causas y su arreglo, ordenados por ahorro, son los puntos n.º 18 a n.º 23.

### 18. El logo pesa 66 KB

*Prioridad:* Alta · *Esfuerzo:* Pequeño · *Quién:* Código (+ el logo en vector, si lo tenéis) · *Cuándo:* Esta semana · *Estado:* Comprobado

**Qué pasa.** `images/icons/logo-3.webp` (556 × 180 px) se pinta a unos 180 × 58 px y pesa 66 KB, más que la hoja de estilos y el JS juntos. Está en la cabecera de todas las páginas, y en la grabación de la carga aparece cortado unos instantes.

**Qué hacer.**

- Pasarlo a SVG (suele quedar en 3–8 KB) o a WebP de unos 360 px de ancho (6–10 KB), con un nombre de archivo nuevo.

### 19. Fuentes: 177 KB antes de pintar

*Prioridad:* Media · *Esfuerzo:* Medio · *Quién:* Código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** Se precargan Fraunces (66 KB), Fraunces cursiva (80 KB) y Plus Jakarta Sans (27 KB). Son fuentes variables con todos los pesos, y la cursiva solo aparece en unas pocas palabras (la segunda línea de algunos títulos).

**Qué hacer.**

- Generar versiones reducidas con solo los pesos usados (Fraunces 600 y cursiva 500; Jakarta 500–700). Suelen quedar en 20–30 KB por archivo.
- No precargar la cursiva.
- Darles un nombre nuevo, porque están marcadas como `immutable`.

### 20. El texto salta cuando llegan las fuentes

*Prioridad:* Media · *Esfuerzo:* Pequeño · *Quién:* Código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** En «Por qué nosotros», en el móvil, el párrafo de la cabecera se recoloca a los 2,1 s, cuando llegan las fuentes: CLS 0,116 (Google pide menos de 0,1). En la grabación del campamento, el título cambia de cortes de línea por lo mismo (n.º 9).

**Qué hacer.**

- Declarar fuentes de respaldo ajustadas (`size-adjust`, `ascent-override`) para Georgia y Arial, de modo que ocupen lo mismo que Fraunces y Jakarta.

### 21. Se descargan imágenes que no se ven

*Prioridad:* Media · *Esfuerzo:* Incluido en n.º 9 · *Quién:* Código · *Cuándo:* Próximo trimestre · *Estado:* Comprobado

**Qué pasa.** La foto de la portada está precargada en el `<head>` para todas las vistas: al abrir el campamento o extranjero en el móvil se descargan igualmente sus 105 KB, y también las fotos de las tarjetas de la portada (156 KB y 67 KB) antes de que el JS la oculte.

**Qué hacer.**

- Se resuelve con páginas propias (n.º 9): cada una precarga solo su foto.

### 22. Netlify añade un script propio en producción

*Prioridad:* Baja · *Esfuerzo:* Pequeño · *Quién:* Vosotros (panel de Netlify) · *Cuándo:* Esta semana · *Estado:* Comprobado el script; el ajuste exacto, por confirmar en el panel

**Qué pasa.** Cada visita carga `/.netlify/scripts/hud?variant=public` (10 KB), la barra de colaboración de Netlify, que no aporta nada a las familias.

**Qué hacer.**

- Desactivarla en el panel de Netlify (ajustes de la barra de colaboración o «Netlify Drawer»). No hace falta tocar el código.

### 23. Una sola página de 159 KB con todo dentro

*Prioridad:* Baja · *Esfuerzo:* Incluido en n.º 9 · *Quién:* Código · *Cuándo:* Próximo trimestre · *Estado:* Comprobado

**Qué pasa.** `index.html` contiene todas las vistas y los dos formularios (31 KB comprimido). En el móvil simulado, el procesado bloquea la página hasta 450 ms (TBT de la portada).

**Qué hacer.**

- Mejora con las páginas propias (n.º 9).

## Imágenes

Autenticidad, nitidez, peso y fotos que faltan.

**Estado:** Mejorable. Técnica excelente. Origen de las fotos principales sin confirmar y dos fotos borrosas.

**Lo que está bien:**

- Las 36 imágenes llevan `width`/`height` y 33 se cargan de forma diferida.
- Textos alternativos descriptivos; las decorativas, vacíos a propósito.
- En móvil, la nitidez es correcta (el archivo elegido mide, de mediana, 1,08 veces lo que se pinta).
- La foto del Big Ben (IA) ya no se usa en ninguna parte.

### 24. Fotos principales que parecen generadas con IA, con origen sin confirmar

*Prioridad:* Alta · *Esfuerzo:* Medio · *Quién:* Decisión + material vuestro · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** Según `web-publica/AGENTS.md`, la foto de la portada parte de una imagen de ChatGPT con las cabezas sustituidas; la cabecera de extranjero (castillo con bandera irlandesa) y las tarjetas de Reino Unido e Irlanda «parecen generadas o retocadas con IA». La imagen que sale al compartir la web (`og-image.jpg`) es del mismo estilo, y su texto alternativo dice «Estudiantes de Interlanguage en un campus internacional».

**Por qué importa.** Es la primera imagen de la web y de cada enlace compartido. Si una familia nota que esos alumnos no existen, puede dudar del resto (precios, fotos reales del campamento, testimonios futuros). Además contrasta con las fotos reales del campamento y del extraescolar.

**Qué hacer.**

- Confirmar el origen de cada una.
- Sustituirlas por fotos reales con permiso: de los colegios con los que trabajáis (pidiendo autorización de uso) o de alumnos vuestros con consentimiento.
- Mientras tanto, no atribuirlas a Interlanguage en textos alternativos ni pies (`og:image:alt`).

### 25. Fotos borrosas en la página del campamento (escritorio)

*Prioridad:* Media · *Esfuerzo:* Pequeño · *Quién:* Código (+ originales vuestros) · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** La foto de «Un día en TalenTalk» (`taller-cocina-grupo`, archivo de 1086 px) se pinta a 1232 px de ancho; en una pantalla Retina necesitaría unos 2460 px. La de la cabecera (`alumnos-cocinando-banner`, 1087 px) se pinta a 1150 px. Las dos se amplían y se ven blandas.

**Qué hacer.**

- Usar los originales con más resolución, si existen.
- Si no, pintarlas más pequeñas (no a todo el ancho) o con un recorte que no supere su tamaño real.

### 26. Faltan fotos que expliquen la oferta

*Prioridad:* Media · *Esfuerzo:* Medio · *Quién:* Material vuestro · *Cuándo:* Próximo trimestre · *Estado:* Comprobado

**Qué pasa.** No hay foto de internado ni de familia anfitriona (la de «Vivir» es provisional), ni de un colegio irlandés real, ni de las sedes del campamento, ni del equipo (ver `docs/extranjero-pendientes.md`).

**Qué hacer.**

- Pedirlas a los colegios con los que trabajáis o hacerlas vosotros, con autorización de imagen de los menores.

### 27. 32,7 MB de imágenes publicadas sin usar

*Prioridad:* Baja · *Esfuerzo:* Pequeño · *Quién:* Código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** 234 de los 520 archivos de `web-publica/images/` no se usan en ninguna página. Incluyen 14,6 MB de PNG de borrador en `images/nuevas/` que se pueden abrir por su dirección (por ejemplo, `/images/nuevas/extraescolares.png`).

**Qué hacer.**

- Mover lo que no se usa a `material-fuente/`, fuera de lo publicado. Tengo la lista exacta.

### 28. Portada y cabecera de extranjero, algo blandas en Retina

*Prioridad:* Baja · *Esfuerzo:* — · *Quién:* — · *Cuándo:* Próximo trimestre · *Estado:* Comprobado

**Qué pasa.** Archivos de 2000 y 1916 px pintados a 1440 px en pantallas de doble densidad (proporción 0,69 y 0,67). Ya está asumido: no se reescalan con IA para no cambiar las caras.

**Qué hacer.**

- Nada mientras sean estas fotos. Al sustituirlas (n.º 24), pedir originales de al menos 2900 px de ancho.

## Contenido

Qué se dice, cómo se dice y qué falta por decir.

**Estado:** Mejorable. Claro y prudente. Voz mezclada (tú/vosotros), datos caducados y preguntas sin responder.

**Lo que está bien:**

- Tono prudente: no promete plazos, plazas ni servicios sin confirmar.
- Precios, porcentajes, ordinales y fechas bien escritos.
- La página de extranjero explica el proceso y un ejemplo de cómo se razona una elección.

### 29. Mezcla de tú y vosotros, a veces en la misma frase

*Prioridad:* Alta · *Esfuerzo:* Medio · *Quién:* Decisión vuestra + código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** En los textos en español hay unas 100 formas de «tú» y unas 45 de «vosotros». Ejemplos: «Cuéntanos su edad, su nivel y qué buscáis. Una persona del equipo se pone en contacto contigo» (cierre de Por qué nosotros); «Cuéntanos su curso y qué buscáis, y te orientamos» (extraescolar); la barra fija dice «Pedid orientación» y la portada «Descubre nuestras propuestas»; el contacto usa «vosotros» en la portada y «tú» en extranjero.

**Por qué importa.** Es de lo primero que nota un lector atento: suena a textos de autores distintos.

**Qué hacer.**

- Elegir una voz. Recomendación: **tú**, que ya es el 70 % del texto y es más directo; «las familias», en tercera persona, cuando haga falta el plural.
- Revisar todo el español (incluidos los textos de `I18N` en `main.js` y los pares `ct-def`/`ct-ext`) y actualizar la regla en `AGENTS.md`.

### 30. «30 años» dicho de tres maneras, y extendido al extranjero

*Prioridad:* Media · *Esfuerzo:* Pequeño · *Quién:* Decisión vuestra + código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** Aparecen «30 años», «Más de 30 años» y, en el pie, «30 años formando el inglés de generaciones de familias españolas, desde los campamentos de verano hasta los estudios en el extranjero», que da a entender 30 años también en estancias fuera. Vuestra regla interna pide no afirmarlo.

**Qué hacer.**

- Una sola fórmula. Si tenéis el año de fundación, «Desde 19XX» resulta más creíble que una cifra redonda.
- En el pie, limitarlo a la enseñanza de inglés.

### 31. Restos de «Especialidades», un programa sin confirmar

*Prioridad:* Media · *Esfuerzo:* Pequeño · *Quién:* Código · *Cuándo:* Esta semana · *Estado:* Comprobado

**Qué pasa.** La descripción para Google y la de redes (`og:description`) dicen «…estudios en el extranjero y especialidades en inglés» (también en inglés). La vista `#view-service-especialidades` sigue en el HTML con datos sin confirmar (3 disciplinas, B1+, 100 % en inglés); nada la enlaza, pero Google puede leerla.

**Qué hacer.**

- Quitar «especialidades» de las descripciones y borrar la vista, salvo que se vaya a ofrecer.

### 32. «¿Y más adelante?» promete un verano en el extranjero

*Prioridad:* Media · *Esfuerzo:* Pequeño · *Quién:* Código · *Cuándo:* Esta semana · *Estado:* Comprobado

**Qué pasa.** Campamento y extraescolar invitan a «vivir un verano, o un curso entero, en el extranjero», pero la página de extranjero solo ofrece año escolar (curso completo o trimestres).

**Qué hacer.**

- Cambiarlo por «un trimestre o un curso escolar», o confirmar si hay programas de verano.

### 33. Franja de confianza: un servicio en lugar de un dato, y distinta en inglés

*Prioridad:* Media · *Esfuerzo:* Pequeño · *Quién:* Código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** La cuarta pieza es «Orientación para estudiar en el extranjero», que es un servicio, no una prueba. En inglés dice «Programmes in the United Kingdom, Ireland and the United States», aunque Estados Unidos es solo consulta.

**Qué hacer.**

- Igualar ES y EN y usar un hecho comprobable (por ejemplo, «Método TalenTalk® desde 2002»), o dejar tres piezas.

### 34. Preguntas habituales que la web no responde

*Prioridad:* Media · *Esfuerzo:* Medio · *Quién:* Material vuestro · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** No invento las respuestas: son datos vuestros. **Campamento:** horario de entrada y salida, acogida temprana, número de alumnos por monitor, qué llevar, seguro, forma de pago, cancelación y devoluciones, descuento por hermanos, menú y alergias en el comedor, cómo se informa a las familias. **Extraescolar:** colegios, inscripción, altas durante el curso, informes de progreso, qué incluye el material, festivos. **Extranjero:** honorarios del servicio (aunque sea «desde»), calendario de solicitudes, qué pasa si surge un problema durante la estancia. **General:** quiénes sois, dirección y horario de atención.

**Por qué importa.** Cada respuesta que falta es una consulta más, o una familia que no pregunta y se va.

**Qué hacer.**

- Contestarlas por escrito; las incorporo a las preguntas frecuentes de cada programa.

### 35. Títulos que no dicen qué es

*Prioridad:* Baja · *Esfuerzo:* Pequeño · *Quién:* Decisión vuestra · *Cuándo:* Próximo trimestre · *Estado:* Comprobado

**Qué pasa.** El del campamento («Donde cada verano descubren un talento nuevo») no dice «campamento» ni «inglés»; lo dicen el antetítulo y el párrafo. El de la portada lo elegisteis vosotros y se mantiene.

**Qué hacer.**

- Con páginas propias (n.º 9), que el `<title>` y el antetítulo de cada una nombren el programa y Madrid. Si queréis, el título del campamento puede llevar la palabra «campamento» sin perder el tono.

### 36. Expresiones que se pueden malinterpretar

*Prioridad:* Baja · *Esfuerzo:* Pequeño · *Quién:* Código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** «Grupos reducidos · Desde 8 alumnos» (extraescolar) se lee como «8 o más», lo contrario de reducido. «Fechas publicadas» (campamento) no dice de qué año. El error del formulario de consulta habla de «la solicitud».

**Qué hacer.**

- «El grupo se abre con 8 alumnos» (y el máximo, si lo hay).
- Fechas con año (n.º 4).
- «No hemos podido enviar la consulta».

### 37. La versión en inglés no la ha revisado un nativo

*Prioridad:* Baja · *Esfuerzo:* Pequeño · *Quién:* Material vuestro · *Cuándo:* Próximo trimestre · *Estado:* Comprobado

**Qué pasa.** La estructura es equivalente (93 títulos en cada idioma) y no he visto restos en español, salvo nombres propios.

**Qué hacer.**

- Pedir a uno de vuestros profesores nativos que la lea entera.

### 38. Qué programa va primero en la portada

*Prioridad:* Baja · *Esfuerzo:* Pequeño · *Quién:* Decisión vuestra · *Cuándo:* Próximo trimestre · *Estado:* Decisión

**Qué pasa.** La foto principal y la primera tarjeta de programas son de estudiar fuera, mientras que el campamento y el extraescolar son la oferta local de todo el año.

**Qué hacer.**

- Decidir qué programa es prioritario en cada época y ordenar la portada en consecuencia (por ejemplo, campamento primero de febrero a junio). Sin datos (n.º 2), es una decisión de negocio.

## SEO

Cómo os encuentra Google y cómo se ve la web al compartirla.

**Estado:** Débil. Google ve una sola página para cuatro programas.

**Lo que está bien:**

- `canonical` y `hreflang` ES/EN coherentes; `www` y `http` redirigen con 301.
- `robots.txt`, `sitemap.xml` y Open Graph completos; una sola `h1` por vista.

### 39. Google solo ve una página para cuatro programas

*Prioridad:* Alta · *Esfuerzo:* Grande · *Quién:* Código · *Cuándo:* Próximo trimestre · *Estado:* Comprobado

**Qué pasa.** Google ignora lo que va detrás de `#`, así que búsquedas como «campamento de inglés en Madrid», «inglés extraescolar» o «estudiar en Irlanda» solo pueden llevar a la portada, con un único título y descripción. El título de cada programa solo aparece después de ejecutar el JS. El sitemap tiene tres direcciones: portada ES, portada EN y aviso legal.

**Qué hacer.**

- Páginas propias (n.º 9), cada una con su `<title>`, descripción, `canonical`, `hreflang` y Open Graph, e incluidas en el sitemap.

### 40. Search Console y Perfil de Empresa de Google

*Prioridad:* Media · *Esfuerzo:* Pequeño · *Quién:* Vosotros · *Cuándo:* Este mes · *Estado:* Por confirmar

**Qué pasa.** No he podido comprobar si están dados de alta. Para búsquedas locales («campamento de inglés Chamartín», «extraescolar inglés Madrid»), el Perfil de Empresa pesa mucho.

**Qué hacer.**

- Darlos de alta o revisarlos, y pedir reseñas reales en el perfil (n.º 6).

### 41. Datos estructurados mínimos

*Prioridad:* Media · *Esfuerzo:* Pequeño · *Quién:* Código · *Cuándo:* Próximo trimestre · *Estado:* Comprobado

**Qué pasa.** Solo hay un `EducationalOrganization` con el correo y «Madrid»; sin teléfono, dirección ni redes (`sameAs`).

**Qué hacer.**

- Añadir dirección, teléfono y redes, si son públicos.
- Con páginas propias, un `Event` o `Course` para el campamento con fechas y precio confirmados. El marcado de preguntas frecuentes no compensa: Google ya casi no lo muestra.

### 42. Título y descripción de la portada

*Prioridad:* Baja · *Esfuerzo:* Pequeño · *Quién:* Código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** El título («30 años formando el inglés de vuestros hijos») no menciona Madrid ni los programas, y la descripción incluye «especialidades» (n.º 31).

**Qué hacer.**

- Por ejemplo: «Inglés para niños y jóvenes en Madrid: campamentos, extraescolares y estudios en el extranjero · Interlanguage».

### 43. Contenido que capte búsquedas

*Prioridad:* Baja · *Esfuerzo:* Grande · *Quién:* Código + material vuestro · *Cuándo:* Próximo trimestre · *Estado:* Comprobado

**Qué pasa.** No hay guías ni artículos, y muchas familias buscan respuestas concretas antes de pedir información.

**Qué hacer.**

- Más adelante, de 4 a 6 guías útiles y comprobables: «Internado en Reino Unido o colegio en Irlanda: cómo elegir», «Qué preguntar antes de elegir un campamento de inglés», «Convalidar un curso hecho fuera». Sin cifras inventadas.

## Accesibilidad

Uso con teclado, lector de pantalla y dedo.

**Estado:** Bien. Cero fallos automáticos en 9 páginas y dos anchos. Falta una prueba con lector de pantalla.

**Lo que está bien:**

- axe-core 4.10 (WCAG 2.2 A y AA y buenas prácticas): 0 fallos en 9 páginas a 390 y 1440 px.
- Enlace «Saltar al contenido», foco en el título al cambiar de vista y menús con teclado y Escape.
- Formularios con etiquetas visibles, errores asociados y casillas grandes; respeta «reducir movimiento».
- Sin identificadores duplicados ni enlaces internos rotos.

### 44. Falta una prueba con lector de pantalla y en móviles reales

*Prioridad:* Media · *Esfuerzo:* Medio · *Quién:* Vosotros + código · *Cuándo:* Este mes · *Estado:* No hecho

**Qué pasa.** La revisión automática no sustituye a VoiceOver, a TalkBack ni a los teléfonos físicos. axe deja 181 elementos de contraste para revisar a mano (texto sobre fotos y degradados); a simple vista se leen bien.

**Qué hacer.**

- Recorrer con VoiceOver en un iPhone el menú, el formulario de dos pasos, la comparación y los carruseles.
- Probar el menú y los formularios en un Android y un iPhone reales.

### 45. Selector de idioma con una etiqueta no válida

*Prioridad:* Baja · *Esfuerzo:* Pequeño · *Quién:* Código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** `div.lang-switch` lleva `aria-label` sin rol; axe lo deja para revisión.

**Qué hacer.**

- Usar `<nav aria-label="Idioma">` o `role="group"`.

### 46. Enlaces del pie pequeños en el móvil

*Prioridad:* Baja · *Esfuerzo:* Pequeño · *Quién:* Código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** Miden 17 px de alto. Cumplen el mínimo de WCAG 2.2 gracias al espacio entre ellos, pero cuesta acertar con el dedo.

**Qué hacer.**

- Darles un área táctil de 44 px con relleno vertical.

## Legal y seguridad

Aviso legal, privacidad, cookies y archivos expuestos.

**Estado:** Crítico. Aviso legal con huecos y la guía interna se puede leer en la web. Cabeceras de seguridad excelentes.

**Lo que está bien:**

- HTTPS con HSTS, CSP estricta (todo del propio dominio), X-Frame-Options, nosniff y Permissions-Policy.
- Sin Google Fonts ni scripts de terceros (salvo el de Netlify, n.º 22).
- Privacidad y novedades en casillas separadas; campo trampa contra spam; `form-handler.php` no expone su código.

### 47. La guía interna AGENTS.md se puede leer en la web

*Prioridad:* Urgente · *Esfuerzo:* Pequeño · *Quién:* Código · *Cuándo:* Esta semana · *Estado:* Comprobado

**Qué pasa.** https://interlanguage.es/AGENTS.md responde con 41 KB de notas internas: dudas sobre el origen de las fotos («parece generada con IA»), fuentes internas de colegios, temas comerciales pendientes y decisiones. También se pueden abrir `images/nuevas/LEEME.txt` y los PNG de borrador.

**Por qué importa.** Cualquiera puede leerla (una familia, otra empresa, un colegio), y algunas notas contradicen lo que dice la web.

**Qué hacer.**

- Añadir a `netlify.toml` una regla 404 para `/AGENTS.md` y `/images/nuevas/*`, como la de `form-handler.php` (o sacar la guía de `web-publica/` y actualizar `CLAUDE.md`).
- Comprobar después que esas direcciones devuelven 404.

### 48. Aviso legal con los huecos sin rellenar

*Prioridad:* Urgente · *Esfuerzo:* Pequeño · *Quién:* Material vuestro · *Cuándo:* Esta semana · *Estado:* Comprobado

**Qué pasa.** `legal.html` publica tal cual [RAZÓN SOCIAL], [CIF], [DOMICILIO SOCIAL], [CORREO DE CONTACTO] y [si procede: Registro Mercantil…] (líneas 60–64, 80 y 90), resaltados en burdeos.

**Por qué importa.** La LSSI obliga a identificar al titular de la web, y un hueco visible en el aviso legal resta credibilidad a todo lo demás.

**Qué hacer.**

- Rellenarlos con los datos de la sociedad y pedir la revisión profesional del texto, que sigue pendiente.

### 49. Política de privacidad y nuevo receptor de formularios

*Prioridad:* Media · *Esfuerzo:* Pequeño · *Quién:* Código + asesoría · *Cuándo:* Esta semana · *Estado:* Comprobado

**Qué pasa.** Al cambiar el receptor (n.º 1) habrá un nuevo encargado del tratamiento (Netlify, Supabase o el proveedor de correo) y quizá transferencias fuera de la UE. Tampoco consta el plazo de conservación de las consultas.

**Qué hacer.**

- Actualizar «Destinatarios» y «Conservación» en `legal.html` cuando se elija el receptor.

### 50. Datos de salud de menores en la inscripción

*Prioridad:* Media · *Esfuerzo:* Pequeño · *Quién:* Decisión vuestra (asesoría) · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** La inscripción pide «Alergias o necesidades especiales»: son datos de salud de menores, una categoría especial del RGPD.

**Qué hacer.**

- Que quien revise el texto legal confirme la base jurídica, el consentimiento explícito, quién los ve y cuánto se conservan.
- Valorar pedirlos al confirmar la plaza y no en la solicitud.

### 51. Modelo jurídico del servicio de extranjero

*Prioridad:* Media · *Esfuerzo:* Medio · *Quién:* Decisión vuestra (asesoría) · *Cuándo:* Próximo trimestre · *Estado:* Decisión

**Qué pasa.** Vuestra documentación (`docs/extranjero-pendientes.md`) indica que falta decidir si actuáis como consultoría, agente, intermediario u organizador de viajes combinados. Eso condiciona qué gestiones se pueden prometer (viaje, alojamiento, seguro) y las condiciones de la propuesta.

**Qué hacer.**

- Resolverlo con asesoría antes de ampliar lo que la web dice que hacéis.

## Código

Lo que hace más lento o arriesgado cada cambio.

**Estado:** Mejorable. Simple y sin dependencias, pero duplicado (ES/EN) y sin pruebas en el repositorio.

**Lo que está bien:**

- Sin compilación ni dependencias: cualquiera puede abrir y editar los archivos.
- Versiones `?v=` para la caché y textos del JS centralizados en `I18N`.
- Reglas compartidas con Codex en `AGENTS.md`.

### 52. Dos copias completas de la web

*Prioridad:* Media · *Esfuerzo:* Grande · *Quién:* Código · *Cuándo:* Próximo trimestre · *Estado:* Comprobado

**Qué pasa.** `index.html` (159 KB) e `index-en.html` (157 KB) repiten toda la estructura. Cada cambio se hace dos veces y ya hay diferencias (n.º 33).

**Qué hacer.**

- Con las páginas propias (n.º 9), generar ES y EN desde una sola plantilla con los textos de cada idioma.

### 53. Las pruebas automáticas no están en el repositorio

*Prioridad:* Media · *Esfuerzo:* Medio · *Quién:* Código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** Las comprobaciones con Playwright de navegación, formularios, comparación y reserva de llamadas viven en carpetas temporales de mis sesiones: Codex no las ve y se pierden.

**Qué hacer.**

- Llevarlas a `tests/web/` en la raíz (fuera de lo publicado), con un README y un solo comando.
- Actualizar las que esperan comportamientos antiguos (8 comprobaciones de la duración de Irlanda).

### 54. CSS con reglas que no se usan

*Prioridad:* Baja · *Esfuerzo:* Medio · *Quién:* Código · *Cuándo:* Próximo trimestre · *Estado:* Comprobado

**Qué pasa.** 141 KB. Al recorrer las seis vistas a 390 y 1440 px, Chrome solo usa el 65 % (parte del resto son estados como los errores o el paso 3 del formulario). Hay 90 `#fff` y 81 `rgba()` escritos a mano fuera de los tokens.

**Qué hacer.**

- Limpiar por secciones al tocarlas y añadir `--white` y tokens para las transparencias.

### 55. Código muerto

*Prioridad:* Baja · *Esfuerzo:* Pequeño · *Quién:* Código · *Cuándo:* Este mes · *Estado:* Comprobado

**Qué pasa.** La vista de Especialidades (n.º 31), el botón de WhatsApp oculto (n.º 5) y reglas de bloques retirados. El cierre roto de Por qué nosotros (n.º 14) nació al borrar CSS que otra página seguía usando.

**Qué hacer.**

- Antes de borrar una clase, buscar todos sus usos en los dos HTML.

### 56. La guía AGENTS.md de la web crece sin parar

*Prioridad:* Baja · *Esfuerzo:* Pequeño · *Quién:* Código · *Cuándo:* Próximo trimestre · *Estado:* Comprobado

**Qué pasa.** 41 KB que mezclan reglas vigentes e historial de decisiones.

**Qué hacer.**

- Separar unas «reglas vigentes» cortas del «historial», y sacar este de `web-publica/` (ver n.º 47).

## Cómo se ha medido

Ver la pestaña «Cómo se ha medido» del HTML. Resumen: Playwright + Chrome contra producción con perfil móvil de Lighthouse (red 150 ms / 1,6 Mbit/s, CPU ×4, mediana de tres cargas; ordenador muy cargado, cifras orientativas); axe-core 4.10.2 (WCAG 2.2 A/AA); nitidez de cada foto frente a lo pintado; cobertura de CSS; lectura completa de los textos. Ningún formulario real enviado. Sin teléfonos físicos, lector de pantalla, analítica ni Search Console.
