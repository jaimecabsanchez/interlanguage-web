# Rediseño de Progreso para 5–7 y 8–9 años

Fecha: 2026-08-23  
Estado: aprobado visualmente; pendiente de implementación

## Objetivo

Reestructurar `plataforma/progreso.html` para que un alumno entienda en pocos segundos:

1. Cómo va esta semana.
2. Cuánto le falta para cumplir el objetivo.
3. Qué está consiguiendo.
4. Cuánto le falta para su próximo sello.
5. Qué acción tiene más sentido a continuación.

El resultado debe ser luminoso, tranquilo y premium. La mejora procede de la composición, las proporciones y la jerarquía, no de añadir ilustraciones o tarjetas.

## Alcance

El rediseño afecta únicamente a las bandas pedagógicas:

- `p12`: 5–7 años.
- `p34`: 8–9 años.

Ambas bandas comparten actualmente el modo de experiencia `primary-young`. La diferenciación se resolverá mediante `data-stage="p12"` y `data-stage="p34"`, no creando otro framework ni duplicando la pantalla.

No se rediseñan `p56` (10–11), ESO, Inicio, Perfil ni Lecciones. Los cambios compartidos se limitarán a lo imprescindible y se verificarán visualmente en las edades fuera de alcance.

## Dirección elegida

Se adopta el enfoque **Recorrido enfocado**:

1. Cabecera compacta.
2. Control segmentado de tres pestañas.
3. Tarjeta principal de la semana.
4. Tarjeta horizontal del próximo sello.
5. Franja compacta de racha con una única acción contextual.

Se descartan:

- El dashboard dividido con semana y sello en paralelo, porque debilita la prioridad del objetivo semanal.
- La superficie única que mezcla semana, sello y racha, porque aumenta la densidad y dificulta la lectura infantil.

## Arquitectura de interfaz

Se conserva el HTML/CSS/JS plano y la arquitectura de tabs existente. Los bloques conceptuales serán:

- `ProgressHeader`: título, subtítulo y dos pills de identidad.
- `ProgressTabs`: navegación entre semana, aprendizaje y logros.
- `WeeklyProgress`: objetivo, barra, días y mensaje de estado.
- `NextAchievement`: sello, nombre, requisito, contador y barra.
- `StreakSummary`: racha compacta y refuerzo amable.
- `ContextualProgressCTA`: una sola acción derivada del estado.
- `LearningSummary`: evidencia de aprendizaje adecuada a la banda.

No se duplicará todo el HTML entre edades. JavaScript aplicará copy y estado por `band`; CSS decidirá densidad, proporciones y color con selectores `body[data-stage]`.

## Cabecera y navegación

La cabecera tendrá aproximadamente 130–165 px en escritorio y altura automática en pantallas estrechas.

### `p12`

- Eyebrow: “MIS AVANCES”.
- Título: “¡Mira cuánto avanzas, Lucía!”.
- Subtítulo: “Cada día sabes un poquito más.”
- Fondo crema–menta cálido.
- El zorro puede permanecer como detalle pequeño y secundario.
- Pills compactas para nivel y misiones.

### `p34`

- Eyebrow: “TUS AVANCES”.
- Título: “Tu progreso, Lucía”.
- Subtítulo: “Esto es lo que has conseguido esta semana.”
- Fondo blanco o blue-gray, sin personaje fijo.
- Pills compactas para nivel y misiones.

Las tabs se percibirán como un único control segmentado, con targets grandes, sombra mínima y estado activo inequívoco.

- `p12`: “Mi semana”, “Lo que sé”, “Mis sellos”.
- `p34`: “Esta semana”, “Mi aprendizaje”, “Logros”.

## Pestaña Semana

### Tarjeta semanal

Será el bloque principal y ocupará todo el ancho útil. Su altura responderá al contenido, con una referencia de 240–285 px en escritorio.

Contenido común:

- Eyebrow “ESTA SEMANA”.
- Recuento dinámico de sesiones.
- Barra de progreso.
- Días de lunes a domingo.
- Texto dinámico de lo que falta o de objetivo completado.

En `p12`, el copy será explícitamente tranquilizador: “¡Vas genial! Ya has hecho 4. Solo te falta 1.” Los marcadores de día serán ligeramente mayores, y coral se reservará para señalar el siguiente objetivo.

En `p34`, el encabezado será “4 de 5 sesiones” y el cierre “Solo te falta una sesión”. Cuando existan datos reales, podrá mostrar únicamente dos métricas pequeñas: minutos de la semana y días activos de la semana. La decoración de montaña/meta será muy sutil y no competirá con los datos.

### Próximo sello

Se transforma en una tarjeta horizontal de altura automática, aproximadamente 210–260 px como máximo en escritorio.

Composición:

- Sello de 90–120 px en `p12` y algo menor en `p34`.
- Nombre del logro.
- Requisito real.
- Contador actual/objetivo.
- Texto de lo que falta.
- Barra de progreso.

El propio sello será la recompensa visual. No se añadirán objetos decorativos.

### Racha y CTA

La racha será una franja de aproximadamente 80–100 px, con un solo icono y un mensaje breve. Nunca penalizará ni culpabilizará.

Existirá como máximo una acción principal:

- Si falta práctica semanal: completar la siguiente sesión.
- Si el objetivo semanal está cumplido: abrir Logros.
- Si existe un repaso prioritario real y accionable: ir a ese repaso.

Si no existe un destino honesto, no se inventará un CTA.

## Pestaña Aprendizaje

El propósito exclusivo es hacer tangible lo aprendido. No repetirá la semana, la racha ni el catálogo de logros.

### `p12`: “Lo que sé”

- Dos métricas sencillas cuando estén disponibles: palabras aprendidas y frases dominadas.
- Sección “Ya sé decir” con frases realmente dominadas.
- Copy celebratorio y concreto.
- Sin porcentajes de habilidades ni analítica avanzada.
- Si no hay frases, estado vacío positivo y honesto.

### `p34`: “Mi aprendizaje”

- Habilidades con evidencia suficiente, usando las métricas existentes.
- Las habilidades sin evidencia no se presentarán como 0%; se omitirán o mostrarán un estado explícito sin datos cuando sea necesario para comprender el conjunto.
- Sección “Ya sé decir” con frases realmente dominadas.
- Una recomendación de refuerzo solo si procede de datos reales.

Los valores demo de Lucía proceden exclusivamente de `DEMO_LEARNING` en `progress-data.js`.

## Pestaña Logros

Se conserva el catálogo unificado de achievements y la familia gráfica de sellos de `ILVisual.stamp`.

Estados:

- Conseguido.
- En progreso.
- Bloqueado.

La reorganización reducirá alturas mínimas innecesarias, mantendrá estados textuales además del color y evitará que cada tarjeta parezca pertenecer a un sistema gráfico distinto. `p12` usará sellos algo mayores y menos texto; `p34` será más denso y estructurado.

## Sidebar

El mini progreso de nivel aparecerá solo en la sidebar de Progreso. Esta decisión evita cambiar otras pantallas y permite usar el snapshot ya cargado.

Mostrará:

- Nombre de nivel actual.
- Barra de avance.
- Texto hacia el siguiente nivel.

Solo aparecerá si `profileSummary.levelProgress` y `nextLevel` contienen datos reales. En cuentas reales sin esa fuente se ocultará por completo; no se simulará un porcentaje.

## Datos y lógica

Fuentes existentes que se reutilizan:

- `ILAuth.getProgress()` para misiones, racha y mejor racha.
- `ILAuth.getWeekActivity()` para objetivo y actividad semanal.
- `ILAuth.getActivityDays()` para días activos y estados derivados.
- `ILAuth.getSkillBreakdown()` para habilidades.
- `ILAuth.getMasteredPhrases()` para frases dominadas.
- `ILAuth.getPlacement()` y `profileSummary` para nivel.
- `buildStamps()` y el catálogo `IL_ACHIEVEMENTS` para el próximo logro y la colección.

Se extraerán funciones puras cuando aporten cobertura a:

- Estado y copy del objetivo semanal.
- Selección de CTA contextual.
- Resumen de aprendizaje visible.
- Presentación del próximo logro.
- Diferencia entre demo y cuenta real.

Los valores `null` seguirán significando “sin evidencia suficiente”, nunca cero.

## Responsive

Se verificará en:

- 1440×900.
- 1280×800.
- 820×1180.
- 768×1024.
- 390×844.

En tablet y móvil:

- Las tarjetas se apilan en una columna.
- El sello conserva presencia sin comprimir el texto.
- Las tabs mantienen targets táctiles adecuados.
- La cabecera pasa a flujo vertical cuando sea necesario.
- No habrá scroll horizontal.
- La navegación inferior existente se conserva.

## Accesibilidad y movimiento

- Jerarquía semántica de headings sin saltos.
- Tabs con ARIA y navegación por teclado ya existente.
- Progressbars con valores y etiquetas accesibles.
- CTA y tarjetas interactivas como elementos nativos.
- Foco visible.
- El significado no dependerá solo del color.
- Las transiciones respetarán `prefers-reduced-motion`.

## Archivos previstos

Principales:

- `plataforma/progreso.html`.
- `plataforma/progreso.css`.
- `plataforma/progreso.js`.
- `plataforma/progress-data.js`.
- Tests de `progress-data` y lógica nueva.

Solo si resulta imprescindible:

- `plataforma/layout.js` para un contenedor de sidebar reutilizable sin cambiar otras pantallas.
- `plataforma/age-mode.css` para retirar reglas antiguas de Progreso que interfieran con la nueva diferenciación por banda.

Todo CSS y JS modificado actualizará su `?v=` en las páginas afectadas.

## Verificación

Antes de cerrar:

1. Comprobar `p12` y `p34` visualmente en todos los tamaños definidos.
2. Confirmar que las tarjetas ya no tienen grandes espacios muertos.
3. Confirmar que las dos edades son claramente diferentes sin añadir ruido.
4. Comprobar `p56` y ESO por regresiones.
5. Probar teclado, foco y ausencia de errores de consola.
6. Ejecutar `node plataforma/*.test.js` y `node plataforma/motor/*.test.js`.

## Criterio de éxito

Al abrir Semana, el alumno identifica inmediatamente cuánto ha hecho, cuánto falta, cuál es su próximo logro, cuál es su racha y qué puede hacer después. La pantalla se siente alegre, clara, premium y tranquila, con una evolución evidente entre 5–7 y 8–9 años.
