# Auditoría UX/UI + Product Design — Interlanguage HOME

Fecha: 24 de agosto de 2026  
Alcance: plataforma publicada, código local, modo demo y cuatro bandas (`p12`, `p34`, `p56`, `eso`)  
Estado: auditoría; no contiene una implementación ni autoriza un rediseño masivo.

## 0. Resumen ejecutivo

Interlanguage HOME ya tiene una base de producto bastante mejor que la de una simple colección de ejercicios: una misión diaria clara, adaptación visual por edad, feedback amable, repaso, progreso semanal, sellos y un mundo personal que crece con la práctica. La experiencia de 5–7 y la de ESO se distinguen de verdad, y no hay rankings ni castigos visibles.

El principal riesgo no es estético: es la **credibilidad del progreso**. La interfaz demo comunica aprendizaje con mucha seguridad, pero varios datos reales no llegan todavía al mismo nivel de fiabilidad. Un ejercicio fallado y corregido puede terminar contado como correcto a la primera y activar una “ronda perfecta”; algunas consultas reales usan columnas o relaciones distintas de las del esquema; el resultado del test de nivel queda solo en `localStorage`; y el panel familiar detallado se alimenta principalmente de datos demo. Antes de añadir más capas de gamificación hay que asegurar que cada afirmación visible procede de evidencia real.

La segunda oportunidad está en convertir el motor existente en una progresión pedagógica realmente integrada. El repositorio contiene matriz por edad, CEFR, dominio y repaso espaciado, pero la misión diaria no une todavía todas esas piezas. Además, 110 de 153 ejercicios son P1 de elección única; hablar se confirma por el propio alumno y el listening depende de síntesis de voz del navegador.

La recomendación es introducir una **Fase 0 de verdad de datos, evaluación y accesibilidad bloqueante**, seguida del design system y los modos por edad. Solo después conviene rediseñar Inicio, Practicar, cierre de sesión, Progreso y Mundo. Así el diseño amplifica una experiencia fiable en vez de embellecer métricas frágiles.

### Lo mejor que conviene conservar

- Una misión diaria principal y un CTA dominante.
- Identidad visual por banda: jardín para pequeños, base para 10–11 y espacio de estudio para ESO.
- Feedback sin culpa y posibilidad de reintento.
- Avión como hilo de avance y sellos como colección, sin leaderboard.
- Progreso visual simplificado en `p12/p34`.
- Navegación e iconos centralizados en `layout.js`.
- Esquema de contenido con edad, CEFR, habilidad, dificultad y requisitos de interacción.
- Estados vacíos honestos previstos para cuentas reales, aunque aún deben conectarse mejor.

### P0 ejecutivos

1. Corregir la contabilización de intentos, precisión, dominio y “perfecto”.
2. Alinear las consultas de actividad/mastery con el esquema Supabase y eliminar fallos silenciosos.
3. Persistir nivel y dominio en servidor; hacer que familia/progreso real no dependan de datos demo.
4. Sustituir el test único por una evaluación adecuada a edad, nivel y modalidad.
5. Garantizar audio fiable y fallback accesible en ejercicios de listening.
6. Retirar o recolocar el badge público de Netlify que tapa la navegación móvil.
7. Recuperar una línea base de tests completamente verde.

## Método y límites

Se recorrieron Inicio, Practicar, cierre de sesión, Progreso y sus pestañas, Perfil, Mi mundo, Ajustes, onboarding, test de nivel y panel familiar en las cuatro bandas. Se comprobaron escritorio, móvil (390 × 844) y tableta (820 × 1180), además de estados de error/reintento visibles. Se contrastó la UI con HTML, CSS, JS, contenido y esquema Supabase.

Es una auditoría heurística y técnica, no una investigación con usuarios. Las decisiones sobre comprensión, motivación y autonomía deben validarse con niños de cada banda y con familias. No se midió transferencia de red real con un profiler externo; las observaciones de rendimiento se basan en carga visible, arquitectura y peso del repositorio.

## A. Inventario de páginas y rutas

### Alumno y acceso

| Ruta | Función | Estado observado |
|---|---|---|
| `plataforma/index.html` | Login | Demo y autenticación Supabase |
| `cambiar-clave.html` | Cambio obligatorio de contraseña | Flujo de cuenta |
| `onboarding.html` | Bienvenida de tres pasos | Adaptación de tono por etapa |
| `test-nivel.html` | Colocación inicial | Ocho preguntas fijas |
| `inicio.html` | Inicio/misión diaria | Cuatro bandas y estados pendiente/completado |
| `leccion.html` | Sesión, repaso de errores y extra | Motor de ejercicios y resumen |
| `progreso.html` | Semana, aprendizaje, sellos | Variación fuerte por edad |
| `perfil.html` | Identidad y resumen | Nivel, sellos y mundo |
| `tienda.html` | “Mi mundo” | Jardín/base/espacio de estudio |
| `ajustes.html` | Preferencias y cuenta | Sonido, voz, movimiento, texto, privacidad |
| `familias.html` | Panel familiar actual | Evidencia, actividad y recomendaciones |
| `informe.html` | Informe familiar legado | Resumen más simple |

En producción también se usan enlaces sin extensión (`/inicio`, `/leccion`, etc.) mediante redirecciones de Netlify.

### Administración y desarrollo

| Ruta | Función | Recomendación de alcance |
|---|---|---|
| `admin.html` | Gestión de alumnado/grupos | Auditar en una fase operativa separada |
| `admin-contenido.html` | Mini-CMS local | Consolidar con el modelo canónico antes de escalar contenido |
| `motor/demo-motor.html` | Demostrador del motor | Solo desarrollo |
| `motor/test-pedagogia.html` | Vista de prueba pedagógica | Solo desarrollo |

## B. Inventario de contenido y ejercicios

### Contenido actual

- 5 packs, 7 unidades, 25 objetivos y 153 ejercicios.
- Volumen disponible por banda, contando contenido compartido: `p12` 48, `p34` 77, `p56` 68, `eso` 43.
- CEFR: 44 Pre-A1, 60 A1, 45 A2 y 4 B1.
- Habilidades: 16 listening, 39 vocabulario, 14 speaking, 68 gramática, 12 reading y 4 writing.
- Requisitos: 45 ejercicios requieren audio, 20 apoyo visual y 4 producción escrita.

### Tipos editoriales encontrados

| Tipo | Cantidad | Plantilla | Interacción real |
|---|---:|---|---|
| `elegir_imagen` | 17 | P1 | Selección visual |
| `elegir_texto` | 93 | P1 | Selección de texto |
| `emparejar` | 5 | P3 | Emparejado por pulsaciones |
| `ordenar` | 16 | P5 | Ordenación |
| `hablar` | 6 | P9 | Escuchar/repetir y autoconfirmar |
| `completar` | 12 | P6 | Completar frase |
| `comprension` | 4 | P7 | Comprensión con elección |
| `clasificar` | 0 | P4 | Soportado por matriz, sin contenido |

P2, P4 y P8 aparecen en la arquitectura conceptual, pero no tienen cobertura editorial/render activa equivalente. La mayor dependencia es P1: 110 de 153 actividades (72%).

## C. Problemas UX por área

### Inicio

| ACTUAL | PROBLEMA | PROPUESTA | PRIORIDAD |
|---|---|---|---|
| Misión diaria, semana y recomendación crean una jerarquía clara. | Es un buen patrón y debe evitarse que futuros widgets lo diluyan. | Mantener un único CTA primario; mover información secundaria a revelado progresivo. | P0 de conservación |
| `p12/p34` muestran nombres españoles en la tarjeta principal, pero todavía aparecen “Morning Explorer” y “Explorer · A1”. | La UI visible mezcla español e inglés fuera del contenido a aprender. | Localizar toda etiqueta de producto/logro en `p12/p34`; mantener inglés solo en muestras lingüísticas. | P1 |
| La sesión usa el título crudo de unidad (`missionMeta.unitTitle`) y muestra “My first school day”, aunque Inicio dice “Mi primer día de cole” (`leccion.html:256–258, 610, 658`). | Se rompe continuidad y el niño puede creer que ha abierto otra misión. | Resolver el nombre visible con el mismo mapa por banda en Inicio, sesión, resumen e informe. | P1 |
| En escritorio queda bastante vacío bajo la misión mientras la columna secundaria continúa. | La composición pierde densidad útil y parece inacabada en pantallas altas. | Reequilibrar grid y colocar una sola pieza contextual: repaso, próxima recompensa o mundo; nunca las tres. | P2 |
| La recomendación móvil “Repasar” tiene aproximadamente 24 px de alto. | Objetivo táctil pequeño para infancia y accesibilidad motora. | Área interactiva mínima de 44 × 44 px aunque el texto visual sea compacto. | P1 |
| El estado completado cambia parte del copy de ESO a español. | La voz de producto deja de ser consistente justo en el momento de logro. | Tabla de copy completa por experiencia, incluida carga, completado, error y vacío. | P1 |

### Practicar y ejercicios

| ACTUAL | PROBLEMA | PROPUESTA | PRIORIDAD |
|---|---|---|---|
| Las actividades pequeñas usan imagen, audio, instrucciones breves y feedback amable. | Es la dirección correcta y no debe sustituirse por una interfaz más “escolar”. | Conservar una acción principal por pantalla y feedback inmediato sin culpa. | P0 de conservación |
| Si el alumno falla y después acierta, solo se registra el resultado pendiente final; el comentario dice “cada intento” pero `recordByType` se llama en `onNext` (`leccion.html:340–357`). | Precisión, errores, dominio, informe y “ronda perfecta” quedan inflados. | Registrar cada envío como intento inmutable; separar `first_try_correct`, `eventual_success`, ayudas y tiempo. “Perfecto” solo si no hubo error ni ayuda. | P0 |
| Al probar este caso, la sesión terminó 4/4 y concedió “Ronda perfecta”. | La recompensa contradice lo ocurrido y erosiona confianza del alumno y familia. | Recalcular resumen y logros desde eventos, no desde el último estado por ejercicio. Añadir prueba de regresión. | P0 |
| 72% del banco es elección única. | Se mide sobre todo reconocimiento; la plataforma puede parecer repetitiva y sobreestimar aprendizaje productivo. | Objetivo editorial por banda: reducir P1 y aumentar ordenación, completar, comprensión, producción guiada y recuperación sin opciones. | P1 |
| P9 “hablar” se valida por autoconfirmación, sin grabación ni señal de pronunciación. | No puede afirmarse que se ha medido speaking o pronunciación. | Etiquetarlo como “práctica oral” no evaluada; después añadir grabación opcional, escucha propia y rúbrica simple. No usar IA de pronunciación hasta validar privacidad y precisión infantil. | P0 para honestidad; P2 para evaluación automática |
| El listening depende de SpeechSynthesis; en la publicación falló y mostró reintento. | Una habilidad central puede quedar bloqueada por navegador/voz instalada. | Servir audio editorial/CDN con precarga corta, TTS solo como fallback, control de repetición y alternativa textual accesible sin convertir el test de listening en reading. | P0 |
| La primera actividad de varias bandas es selección múltiple sencilla. | La primera impresión no enseña la amplitud real del producto. | Rotar una “actividad firma” adecuada a la banda tras un arranque fácil, sin sacrificar accesibilidad. | P2 |
| La sesión móvil tarda unos segundos mostrando estructura vacía mientras carga packs secuenciales. | Parece un fallo y empeora el inicio de una tarea corta. | Estado de carga con mensaje y progreso breve; cargar solo manifest/pack necesario y cachear contenido. | P1 |
| Los hints faltan en seis ejercicios según la validación de esquema. | El feedback no puede ser igualmente útil en todo el banco. | Bloquear publicación si falta pista o explicación donde la plantilla la requiere. | P1 |

### Cierre de sesión

| ACTUAL | PROBLEMA | PROPUESTA | PRIORIDAD |
|---|---|---|---|
| El resumen reúne puntuación, tiempo, expresiones, sello, racha, mundo y hasta tres acciones. | Para 5–7 concentra demasiada información y decisiones en un momento. | Secuencia progresiva de 2–3 momentos: celebración → “lo que ya puedes hacer” → siguiente acción. En ESO, resumen compacto único. | P1 |
| Aparece “13 días seguidos · vuelve mañana para llegar a 14”. | Aunque es positivo, introduce obligación futura y riesgo de culpa. | “Hoy has mantenido tu ritmo” y opción de ver la ruta; no prometer ni exigir mañana. | P1 |
| Un “+10” flotante no explica qué se gana; no hay economía funcional visible. | Genera una expectativa de puntos/moneda sin utilidad ni modelo mental. | Retirar el número o convertirlo en progreso explícito (“1 reto completado”). No crear moneda hasta definir finalidad, balance y protección frente a grind. | P1 |

### Progreso

| ACTUAL | PROBLEMA | PROPUESTA | PRIORIDAD |
|---|---|---|---|
| `p12/p34` priorizan semana/camino y mundo creciente; `p56/eso` conservan estadísticas. | La diferenciación reciente funciona y responde bien a la carga cognitiva. | Mantener este principio: pequeños ven evidencia concreta; cifras detalladas viven en mayores/familia. | P0 de conservación |
| `p12` aún muestra “Word Collector” y términos heredados en inglés. | Mezcla capa de producto con contenido lingüístico. | Localizar nombres visibles del sistema por banda, con un único diccionario. | P1 |
| “Mis sellos” muestra hasta 18 tarjetas con bastante texto en 5–7. | La colección se vuelve inventario y pierde descubrimiento. | Mostrar 3: recién ganado, siguiente alcanzable y favorito; resto en álbum progresivo visual. | P1 |
| ESO muestra 24 sesiones, 186 min, 77%, habilidades y temas en demo. | En real varias métricas son `null` o no están agregadas (`progress-data.js:224–238`). | Definir fuente, ventana temporal, fórmula y estado insuficiente para cada métrica antes de mostrarla. | P0 |
| Habilidad se expresa como porcentaje sin explicar evidencia o confianza. | Un 77% parece una nota objetiva aunque mezcle pocos intentos y reconocimiento. | Mostrar “evidencia reciente”, nº de actividades y tendencia; reservar porcentaje para muestras suficientes y fórmula documentada. | P0 |
| Perfil y Progreso muestran nombres y sistemas de logro diferentes. | Parece que existen dos programas de recompensas. | Unificar catálogo, estado y copy; Perfil muestra identidad/favoritos, Progreso el recorrido completo. | P1 |

### Perfil

| ACTUAL | PROBLEMA | PROPUESTA | PRIORIDAD |
|---|---|---|---|
| Perfil combina identidad, nivel, sellos y acceso al mundo. | Hay duplicación con Progreso y Mundo, especialmente para pequeños. | Perfil = “quién soy” y preferencias; Progreso = “qué sé”; Mundo = “lo que he hecho crecer”. | P1 |
| `p12/p34` ven “First Flight”, “Comeback” y “Explorer”. | Etiquetas de sistema en inglés rompen la regla lingüística de Primaria pequeña. | Catálogo único con `label.es/en` por banda y migración de nombres legacy. | P1 |
| El demo muestra “65% para Explorer 3”; en cuentas reales `levelProgress` es `null` (`progress-data.js:240–245`). | Puede sugerir una progresión calculada que no existe para usuarios reales. | Ocultar porcentaje sin evidencia o mostrar hitos concretos observables. | P0 |
| El nivel mezcla rango lúdico y CEFR. | “Explorer 2”, “Explorer 3” y A1 pueden confundirse como la misma escala. | Separar “etapa de viaje” de “nivel aproximado de inglés”, con explicación familiar. | P1 |

### Rewards y logros

| ACTUAL | PROBLEMA | PROPUESTA | PRIORIDAD |
|---|---|---|---|
| Hay 19 logros, sellos, racha, nivel de mundo y desbloqueos; 18 aplican por banda y 5 desbloquean mundo. | La base es rica, pero el valor se reparte entre varios modelos y nombres legacy. | Un único grafo: práctica → evidencia de aprendizaje → sello significativo → cambio visible en el mundo. | P1 |
| Los desbloqueos dependen de misiones, sellos, racha o nivel de mundo; no hay compra real. | Es más seguro que una economía, pero la racha puede dominar el comportamiento. | Dar más peso a dominio, variedad y recuperación; racha como reconocimiento secundario y flexible. | P1 |
| No hay leaderboard, comparación social ni castigo por perder racha. | Es una fortaleza de producto infantil. | Mantenerlo como requisito de aceptación. | P0 de conservación |
| Los logros “perfectos” se activan con datos de intento incorrectos. | Se premia un resultado falso. | Corregir eventos antes de ampliar catálogo o economía. | P0 |
| El producto insinúa puntos con “+10” pero no ofrece uso. | Ruido motivacional sin significado educativo. | No añadir monedas en la siguiente fase; primero validar si mundo/sellos ya cubren autonomía y reconocimiento. | P1 |

### Mi mundo

| ACTUAL | PROBLEMA | PROPUESTA | PRIORIDAD |
|---|---|---|---|
| Jardín (`p12/p34`), base (`p56`) y estudio espacial (ESO) cambian de verdad por edad. | Es una de las mejores expresiones de progreso emocional del producto. | Mantener la metáfora y vincular cada cambio a aprendizaje comprobado. | P0 de conservación |
| En móvil pequeño desaparece del árbol accesible la explicación “Tu mundo crece contigo” y el próximo desbloqueo; queda sobre todo el editor. | En el dispositivo más probable se pierde el porqué educativo y Mundo parece un creador de avatar. | Priorizar arriba “qué ha crecido” y “qué viene después”; editor en segundo nivel o modal. | P1 |
| `p12` ofrece alrededor de 53 ítems y controles detallados de piel, pelo, ojos, ropa y accesorios. | Exceso de opciones y apariencia de configurador adulto para 5–7. | Curar conjuntos grandes y visuales; 3–6 elecciones por paso; “sorpresa” opcional y deshacer claro. | P1 |
| Botones de 40 px y un slider de unos 28 px en móvil. | Objetivos táctiles insuficientes para pequeños. | Mínimo 44 px; para `p12`, preferir 48–56 px. | P1 |
| Los cambios del mundo se presentan como recompensa visual, pero pocos logros tienen una consecuencia visible. | Se debilita la promesa “crece contigo”. | Diseñar hitos frecuentes pero sobrios: nuevo elemento, evolución de uno existente y recuerdo de la evidencia que lo desbloqueó. | P1 |
| Colores de avatar se codifican con hex en `world-page.js`. | Rompe la fuente de verdad de tokens y complica temas/contraste. | Tokens semánticos para cosméticos permitidos y validados. | P1 |

### Ajustes, onboarding y familia

| ACTUAL | PROBLEMA | PROPUESTA | PRIORIDAD |
|---|---|---|---|
| Onboarding `p12` usa tres pasos, una misión corta y reintento amable. | Es una buena entrada. “Punto de partida” puede ser abstracto para 5–7. | Para pequeños: “Vamos a descubrir por dónde empezar” con audio/imagen. | P2 |
| Ajustes muestra a pequeños voces del sistema, acentos y parámetros técnicos. | Requiere comprensión adulta y puede producir configuraciones inconsistentes. | Vista infantil simple (sonido, texto, movimiento); voces/cuenta/privacidad bajo acceso familiar. | P1 |
| El panel familiar demo traduce actividad en frases, práctica, recomendación y conexión con clase. | Es una propuesta de valor fuerte, pero no está respaldada igual en real. | Convertirlo en contrato de datos: cada tarjeta declara fuente, período y suficiencia. | P0 |
| Existen `familias.html` e `informe.html` con alcances distintos. | Duplica producto, copy y lógica; familias pueden entrar a informes inconsistentes. | Elegir `familias.html` como superficie canónica y migrar/retirar el informe legacy. | P1 |

### Responsive y accesibilidad

| ACTUAL | PROBLEMA | PROPUESTA | PRIORIDAD |
|---|---|---|---|
| Inicio, lección, progreso y mundo no generan scroll horizontal en 390 ni 820 px. | La base responsive es sólida. | Mantener pruebas visuales por banda y breakpoint en CI o checklist de release. | P0 de conservación |
| El badge “Powered by Netlify” publicado tapa parte de la barra inferior móvil, incluidos Progreso/Perfil. | Bloquea navegación real y afecta a todos los flujos móviles. | Eliminarlo de producción o situarlo fuera del viewport interactivo. | P0 |
| Algunos targets son de 24–40 px. | Dificultad motora, especialmente en 5–7. | Sistema de tamaños interactivos: 56 pequeño, 48 Primaria, 44 ESO; auditoría automatizada y manual. | P1 |
| El token muted `#8795a5` sobre blanco ronda 3.06:1; coral base ronda 3.01:1. | Fallan para texto normal y pueden afectar copy secundario pequeño. | Introducir tokens `text-muted-accessible` y `accent-text`; usar coral base solo en fondos/elementos grandes cuando corresponda. | P0 donde comunica información; P1 global |
| Hay landmarks, tabs, progressbars, estados `role=status`, foco en diálogos y reducción de movimiento. | Buena base, pero no sustituye prueba con teclado/lector. | Añadir matriz WCAG: teclado, VoiceOver/NVDA, zoom 200%, contraste y reduced motion por ruta. | P1 |
| El listening fallido deja visible un error y “Reintentar”. | El estado es honesto, pero el objetivo pedagógico queda inaccesible. | Audio alternativo y una vía no penalizadora de continuar; registrar fallo técnico, no fallo del alumno. | P0 |

## D. Problemas y estrategia por edad

### 5–7 (`p12`)

- **Actual:** UI cálida, visual, 4 retos, imágenes grandes, jardín y progreso semanal simple. **Problema:** test escrito común, catálogo/ajustes demasiado complejos, idiomas de sistema mezclados y resumen cargado. **Propuesta:** audio + imagen como modalidad primaria, español en chrome, 1 decisión por pantalla, recompensas reveladas en secuencia. **Prioridad:** P0 evaluación/audio; P1 resto.
- Lectura mínima, targets de 56 px, instrucciones de una frase, apoyo oral repetible y no depender del color.
- El progreso debe responder “qué hice / qué ya reconozco / qué creció”, no “qué porcentaje tengo”.

### 8–9 (`p34`)

- **Actual:** comparte experiencia visual joven, pero añade 5 retos, etiquetas de habilidades y ordenación/habla. **Problema:** está demasiado cerca de `p12` en algunas superficies y demasiado cerca de `p56` en terminología. **Propuesta:** transición: algo más de autonomía, lectura breve, mapa de habilidades solo cuando ayuda, español en la interfaz. **Prioridad:** P1.
- Mantener imagen/audio, introducir recuperación sin opciones de forma gradual y permitir revisar “por qué”.

### 10–11 (`p56`)

- **Actual:** base visual más madura, 6 retos, cifras moderadas y contenido en inglés. **Problema:** todavía predomina elección única y el nivel CEFR queda limitado por edad. **Propuesta:** más producción escrita/oral, objetivos semanales elegibles y progreso con evidencia, no solo porcentajes. **Prioridad:** P0 para desacoplar edad/nivel; P1 editorial.
- La UI puede mostrar métricas, siempre con período, muestra y explicación.

### ESO

- **Actual:** estilo maduro, inglés de producto, 7 ejercicios y métricas avanzadas. **Problema:** navegación/copy aún mezclan español; el test empieza igual que en 5–7; la matriz excluye Pre-A1 y el banco B1 solo tiene 4 ejercicios. **Propuesta:** experiencia completamente coherente, colocación adaptativa y permitir principiante real de ESO con temas/tono de ESO. **Prioridad:** P0 evaluación y cobertura; P1 localización.
- Añadir autonomía: elegir foco, ver objetivo, saltar explicación conocida y comprender la evidencia de dominio.

### Principio estructural

La edad debe cambiar **presentación, carga cognitiva, contexto, autonomía y modalidad**. El CEFR debe cambiar **dificultad lingüística**. Hoy la matriz mezcla ambos y fija `p12` en Pre-A1 y ESO en A1–B1 (`motor/matriz.js:23–28`). Esto impide atender a un pequeño avanzado o a un adolescente principiante. Debe existir una intersección edad × CEFR, no una sustitución del nivel por la edad. **Prioridad P0.**

## E. Gamificación

### Qué existe

- Misión diaria y ruta semanal.
- Racha y mejor racha.
- Sellos/logros, estados bloqueado/en progreso/conseguido.
- Avance de nivel/rango.
- Mundo y avatar con 59 elementos catalogados; desbloqueos por misiones, sellos, racha y nivel de mundo.
- Feedback, microcelebraciones y “una más” voluntaria.
- Sin clasificación social ni compras visibles.

### Qué funciona

- El mundo da una consecuencia visual individual a la práctica.
- El sello tiene más identidad que una medalla genérica.
- El progreso semanal es comprensible y no compara con otros.
- La posibilidad de recuperar errores y continuar reduce ansiedad.

### Qué no funciona todavía

- La verdad del intento no sostiene los logros de perfección.
- Racha, sellos, niveles, `+10` y mundo no forman un modelo mental único.
- El mundo móvil prioriza personalización sobre significado.
- Hay demasiados objetos para pequeños y muy pocos vínculos explícitos entre aprendizaje y desbloqueo.

### Qué añadiría, en este orden

1. **Evidencia de logro:** “Ahora puedes reconocer/usar…” vinculada a objetivos dominados.
2. **Recuperación como éxito:** sello por volver y consolidar, sin llamarlo perfecto.
3. **Elección significativa:** escoger entre dos focos o dos elementos del mundo, no comprar con moneda.
4. **Álbum progresivo:** reciente, próximo y favorito; colección completa bajo demanda.
5. Solo después de validar motivación, valorar una energía no comprable. No recomiendo una economía de monedas/tienda en el MVP.

## F. Valor educativo

### Qué se mide o registra hoy

- Sesiones, ejercicios completados, tiempo estimado, días activos y racha.
- Correcto/incorrecto final por ejercicio, expresiones practicadas y errores para repaso.
- Dominio local por ejercicio y vencimientos de repaso 1/3/7/16 días.
- Habilidad, CEFR, dificultad, modalidad y tags definidos en el contenido.
- En demo: palabras, expresiones, precisión, temas y desglose por habilidad.

### Qué falta medir con validez

- Primer intento frente a éxito tras reintento.
- Número/tipo de ayudas, repeticiones de audio y latencia.
- Retención tras días, no solo rendimiento en la sesión.
- Recuperación productiva frente a reconocimiento.
- Speaking observado; hoy es práctica autodeclarada.
- Transferencia entre variantes del mismo objetivo.
- Confianza de una métrica según tamaño de muestra.
- Errores técnicos separados de errores lingüísticos.

### Cómo mostrarlo al alumno

- 5–9: evidencia concreta y visual: “Hoy reconociste 3 palabras del cole”; “Tu árbol tiene una hoja nueva”.
- 10–11: objetivos e hitos: “Rutinas: 4 de 6 expresiones consolidadas”.
- ESO: habilidad, tendencia, última evidencia y siguiente acción; no una nota opaca.
- En todas: “practicado”, “en camino” y “consolidado” deben ser estados distintos.

### Cómo mostrarlo a la familia

- Período explícito, cantidad de evidencia y definición de cada indicador.
- Frases/competencias observables, no solo minutos y porcentaje.
- Recomendación accionable de baja fricción y conexión con clase.
- Estado “aún no hay datos suficientes” en vez de 0% o dato demo.
- Privacidad: no conservar audio infantil por defecto; consentimiento y retención claros si se incorpora grabación.

## G. Design system

### Diagnóstico

- Existen buenos tokens `--il-*`, iconos centralizados y lenguaje visual común.
- La implementación está fragmentada entre `design-system.css`, `app.css`, `shell.css`, `etapa.css`, `age-mode.css`, CSS específico y grandes bloques inline.
- Hay hex fuera de tokens en login, Inicio, layout, Mundo, contenido y motor legacy.
- Conviven logros/sellos nuevos con medallas emoji y nombres legacy.
- Cache busting manual con múltiples fechas aumenta riesgo de ver versiones mezcladas.

### Propuesta

1. **Tokens primitivos y semánticos:** superficie, texto, borde, acción, feedback, foco, mundo y cosméticos. Ningún hex fuera de `design-system.css`.
2. **Escalas por experiencia:** densidad, radio, tipografía, target y movimiento para `young`, `upper`, `secondary`; banda concreta solo altera copy/contenido.
3. **Componentes nativos estáticos:** botón, card, chip, tabs, progress, modal, state, metric, exercise-shell y reward-reveal como CSS + JS compartidos, sin framework.
4. **Copy tokens:** interfaz `es/en` por banda; contenido conserva `lang="en"`.
5. **Accesibilidad como token:** foco, contraste, tamaño táctil, reduced motion y estados no dependientes de color.
6. **Catálogo único de rewards:** ID estable, nombres localizados, criterio, evidencia, icono y efecto en mundo.
7. **Versionado:** un `APP_VERSION` o script de verificación que detecte referencias `?v=` desalineadas, manteniendo el despliegue sin build.

## H. Arquitectura técnica

| ACTUAL | PROBLEMA | PROPUESTA | PRIORIDAD |
|---|---|---|---|
| HTML/CSS/JS estático, sin build. | Es simple y desplegable; no es necesario introducir React/Vite para resolver estos problemas. | Mantener arquitectura estática y modularizar con archivos compartidos. | P0 de conservación |
| Conviven `contenido.js`, packs canónicos y contenido de CMS local. | Fuentes duplicadas y riesgo de IDs/versiones divergentes; el test de migración espera 25 y obtiene 117. | Declarar packs + manifest como fuente única, migrar CMS y retirar fallback legacy con pruebas. | P0 |
| La batería tiene un fallo en `content-migration.test.js`; el resto de suites ejecutadas pasa. | No existe línea base completamente verde y una migración puede romper contenido silenciosamente. | Corregir expectativa o duplicación tras identificar fuente correcta; CI bloqueante. | P0 |
| `getActivityDays/getWeekActivity` consulta `practice_sessions.created_at` (`auth.js:593–595, 662–664`), pero el esquema usa fecha/inicio/fin. | La actividad real puede quedar vacía; el `catch` silencioso oculta el defecto. | Consultar columna canónica, tipar mapeo y registrar/mostrar errores observables. | P0 |
| `getSkillBreakdown` selecciona `objectives(skill)` (`auth.js:623–635`), mientras el modelo usa `skill_id`. | El desglose real puede quedar sin datos y parecer “honestamente vacío” aunque exista evidencia. | Corregir relación/campo y cubrir con test de integración Supabase. | P0 |
| `savePlacement` guarda nivel solo en localStorage y reconoce migración pendiente (`auth.js:692–700`). | Se pierde entre dispositivos, navegador o limpieza de datos. | Persistir placement versionado con fecha, instrumento y confianza; local como caché. | P0 |
| Dominio/repaso vive principalmente en `localStorage` (`motor/mastery-store.js`). | Personalización no portátil y panel familiar incompleto. | Eventos de intento en servidor + proyección de mastery; cola offline idempotente. | P0 |
| Métricas detalladas y evidencia familiar son demo-only (`progress-data.js:224–238`). | La propuesta comercial que ve la familia no coincide con producción real. | Pipeline de agregación real y estados de suficiencia; demo claramente marcado. | P0 |
| La matriz edad limita CEFR (`motor/matriz.js:25–28`). | Confunde desarrollo con nivel lingüístico. | Matriz bidimensional edad × CEFR × modalidad, con temas apropiados a edad. | P0 |
| Test de nivel: 8 preguntas fijas, mismas para todas las edades y corte por aciertos (`test-nivel.html:85–132`). | Baja validez, fatiga en pequeños y techo/fondo imprecisos. | Instrumentos por banda, arranque estimado, branching adaptativo, audio/visual y revisión periódica. | P0 |
| El motor de repaso 1/3/7/16 existe, pero la misión diaria no integra plenamente dominio/80–20. | La personalización aparece como módulo lateral y no como núcleo. | Compositor único con consolidación, stretch, variedad, prerrequisitos y explicabilidad. | P1 |
| Speaking se autovalida. | No produce evidencia objetiva. | Guardar como práctica; crear rúbrica/recording opcional en fase posterior. | P0/P2 |
| CSS inline grande y cascadas por pantalla. | Conflictos, duplicación y diferencias entre estados/bandas. | Extraer por componente y usar capas/orden documentado; test visual por pantalla. | P1 |
| Navegación/iconos están centralizados, pero quedan emoji/hex legacy. | Dos lenguajes visuales y violación de reglas del repo. | Migrar consumidores legacy al catálogo único. | P1 |
| `assets/` ronda 21 MB, con unos 20 MB en avatar y PNG fuente de ~1.3–1.4 MB. | Aumenta despliegue, riesgo de carga accidental y mantenimiento; en móvil se observó carga perceptible. | Separar fuentes de producción, WebP/AVIF, tamaños responsivos, lazy load y presupuesto por ruta. | P1 |
| Packs se cargan secuencialmente en Inicio/Lección. | Se paga contenido no necesario antes de una misión. | Manifest ligero, carga del pack seleccionado y caché; precarga solo de siguiente actividad/audio. | P1 |
| No hay service worker/offline pedagógico completo. | Una caída de red interrumpe sesiones cortas; hay riesgo de perder intentos. | Cola offline de eventos y reanudación segura antes de añadir PWA compleja. | P1 |

### Modelo de datos recomendado

El evento mínimo de intento debería incluir: `attempt_id`, alumno, sesión, ejercicio/objetivo/variante, banda, CEFR, skill, timestamps, ordinal del intento, respuesta, correcto, ayuda, repeticiones de audio, modo (daily/review/extra), fallo técnico y versión de contenido. De esos eventos se proyectan sesión, dominio, repaso, rewards e informe. Nunca se debe reconstruir la verdad desde el último estado del DOM.

## I. Backlog completo por prioridad

### P0 — imprescindible

1. Intentos inmutables y separación first-try/eventual; recalcular precisión, mastery y rewards.
2. Reparar consultas reales de sesiones/mastery y hacer visibles los errores operativos.
3. Persistencia servidor de placement, mastery y eventos; sincronización multi-dispositivo.
4. Panel familiar/progreso real con fuentes y estados de suficiencia.
5. Evaluación de nivel adaptada por banda y desacoplar edad de CEFR.
6. Audio fiable con fallback y error técnico no penalizador.
7. Eliminar badge que tapa navegación móvil.
8. Corregir contraste donde el texto queda por debajo de WCAG AA.
9. Resolver el test de migración de contenido y recuperar CI verde.
10. Mantener sin rankings/castigos y conservar diferenciación de Progreso por edad.

### P1 — muy recomendable

1. Diccionario único de copy/nombres por banda y migración de etiquetas legacy.
2. Compositor pedagógico único que integre dominio, repaso y dificultad.
3. Diversificar banco y bloquear contenido incompleto al publicar.
4. Cierre de sesión progresivo para pequeños y compacto para ESO.
5. Unificar sellos/logros/mundo; retirar `+10` sin significado.
6. Reordenar Mundo móvil y simplificar editor `p12`.
7. Separar responsabilidades de Perfil/Progreso/Mundo.
8. Simplificar Ajustes infantiles y proteger opciones familiares.
9. Consolidar `familias.html` frente a informe legacy.
10. Tokens completos, componentes compartidos y eliminación de hex/emoji legacy.
11. Targets táctiles y matriz de pruebas de accesibilidad.
12. Carga selectiva de packs, optimización de assets y estados de carga.
13. Cola offline/reanudación idempotente.

### P2 — mejora posterior

1. Reequilibrio visual de Inicio en escritorios altos.
2. Rotación de una actividad firma en la primera impresión.
3. Grabación oral opcional y, solo tras validación, feedback automático.
4. Microcopy más concreto en onboarding pequeño.
5. Personalización avanzada del avatar para mayores.
6. Preferencias de objetivo/foco para `p56/eso`.
7. Automatización de regresión visual por banda/breakpoint.

## J. Roadmap recomendado

### Fase 0 — Verdad, fiabilidad y seguridad de uso

Corregir intentos, precisión, Supabase, placement/mastery, audio, badge móvil, contraste bloqueante y test de migración. Instrumentar eventos y estados de insuficiencia.

**Salida:** CI verde; un fallo seguido de acierto no concede perfecto; actividad real aparece en dos dispositivos; ninguna navegación queda tapada; listening siempre tiene salida válida.

### Fase 1 — Design system y arquitectura por edad

Tokens semánticos, componentes compartidos, copy registry, catálogo único de rewards y matriz edad × CEFR. Retirar legacy progresivamente.

**Salida:** cuatro bandas coherentes, cero hex nuevo fuera de tokens, targets y contraste validados.

### Fase 2 — Onboarding y colocación

Instrumentos por banda, adaptación de preguntas, audio/visual para pequeños y persistencia versionada.

**Salida:** edad cambia modalidad, no techo CEFR; familias entienden que es un punto de partida aproximado.

### Fase 3 — Inicio

Una misión, continuidad exacta de títulos, estados loading/empty/error/completed, recomendación explicable y jerarquía responsive.

**Salida:** el alumno entiende qué hacer en menos de cinco segundos en cada banda.

### Fase 4 — Practicar y motor pedagógico

Compositor integrado, eventos por intento, audio, mayor diversidad de plantillas y authoring gate.

**Salida:** ninguna habilidad se infiere sin evidencia; P1 deja de dominar el banco; sesión reanudable.

### Fase 5 — Cierre de sesión y rewards

Resumen por edad, evidencia concreta, recuperación como logro y vínculo directo con mundo. No introducir moneda todavía.

**Salida:** cada recompensa explica qué conducta/aprendizaje la produjo y nunca contradice los intentos.

### Fase 6 — Progreso, Perfil y Mundo

Separar funciones, álbum progresivo, métricas con confianza, Mundo móvil orientado a crecimiento y editor simplificado.

**Salida:** pequeños entienden progreso sin porcentajes; mayores interpretan métricas; Mundo conserva valor educativo en móvil.

### Fase 7 — Familia, reporting y operación

Panel canónico, evidencia real, conexión con clase, privacidad y herramientas de soporte/editorial. Migrar informe legacy y CMS local.

**Salida:** el panel real ofrece el mismo valor que el demo y cada dato es trazable.

### Fase 8 — Validación y optimización

Pruebas con 5–7, 8–9, 10–11, ESO y familias; accesibilidad asistida; rendimiento por ruta; experimentos de motivación sin presión.

**Métricas de producto recomendadas:** misión iniciada/completada, abandono por paso, error técnico de audio, éxito al primer intento, recuperación diferida, variedad de modalidad, retorno voluntario, comprensión del progreso y utilidad percibida por familia. No optimizar racha o tiempo bruto como objetivo principal.

## Decisiones que deben preceder a la implementación

1. Confirmar que `familias.html` será el informe canónico.
2. Definir qué significa exactamente “dominado” y la muestra mínima para mostrar un porcentaje.
3. Acordar si la práctica oral será autodeclarada o grabada; no llamarla evaluación mientras no lo sea.
4. Decidir si el mundo es principalmente relato de crecimiento o editor de avatar; para `p12` recomiendo lo primero.
5. Aceptar que no habrá economía de moneda en las primeras fases.

La auditoría termina aquí. El siguiente paso debe ser aprobar el orden y convertir únicamente la Fase 0 en especificación técnica y criterios de aceptación, antes de editar la interfaz.
