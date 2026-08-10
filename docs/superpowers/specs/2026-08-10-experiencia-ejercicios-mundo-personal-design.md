# Experiencia adaptativa de ejercicios y mundo personal

**Fecha:** 2026-08-10  
**Estado:** aprobado para planificación  
**Ámbito:** zona alumno, motor de ejercicios, cierre de misión, perfil y personalización

## 1. Objetivo

Convertir la práctica diaria en un hábito atractivo y saludable. El alumno debe querer volver porque entiende qué está aprendiendo, recibe feedback amable y ve cómo su constancia transforma un espacio propio.

La experiencia no utilizará patrones de adicción perjudiciales para menores: no habrá recompensas aleatorias, cajas sorpresa, rankings, presión social, pérdidas punitivas, cuentas atrás agresivas ni mensajes culpabilizadores. La motivación se apoyará en autonomía, progreso visible, dominio, colección y personalización.

## 2. Decisiones de producto

- Se mantiene una sola aplicación y un solo motor de actividades.
- La adecuación pedagógica seguirá usando las bandas existentes `p12`, `p34`, `p56` y `eso`.
- Los perfiles visuales globales seguirán siendo `primary-young`, `primary-upper` y `secondary`; dentro de `primary-young`, `data-stage` distinguirá claramente 5–7 de 8–9 años.
- Nemo es el guía de Primaria, no el avatar del alumno.
- El avión de papel sigue representando avance y recorrido.
- Primaria tendrá avatar, compañeros animales y jardín.
- ESO tendrá avatar, espacio personal y colecciones de tono maduro, sin jardín infantil ni mascota protagonista.
- La antigua tienda de gemas y emojis será sustituida por una experiencia `Mi mundo` o `Personalizar`.
- No se añade un framework ni una dependencia externa.

## 3. Adecuación por edad

### 3.1 Banda `p12` — aproximadamente 5–7 años

- Sesión de 4–5 actividades y una sola tarea visible cada vez.
- Instrucciones breves en español; el inglés aparece en palabras, frases y audio.
- Audio protagonista, con reproducción y repetición evidentes.
- Targets táctiles de al menos 56 px.
- Tipografía mayor y menor densidad.
- Máximo tres opciones cuando la plantilla lo permita.
- Selección por imagen, escucha, asociación visual y repetición guiada.
- Nemo visible en introducción, ayuda, segundo intento y celebración.
- Feedback frecuente, corto y concreto.
- Ilustraciones SVG propias; ningún emoji como icono o recompensa estructural.

### 3.2 Banda `p34` — aproximadamente 8–9 años

- Sesión de 5 actividades.
- Apoyo bilingüe progresivo, con más palabras de interfaz en inglés.
- Hasta cuatro opciones.
- Combinación de imagen, audio, matching, ordenación de palabras y lectura mínima.
- Nemo aparece como guía discreto, no en cada estado.
- Feedback que explica brevemente por qué una respuesta encaja.
- El jardín y los compañeros siguen siendo relevantes, pero con mayor capacidad de elección.

### 3.3 Banda `p56` — aproximadamente 10–11 años

- Sesión de 6 actividades.
- Instrucciones mixtas y mayor autonomía.
- Más lectura, writing, gramática aplicada y pequeños retos.
- Ilustración funcional, no decorativa.
- Nemo solo en momentos de ayuda o logro.
- Personalización presentada como base de exploración, no como juego para pequeños.

### 3.4 Banda `eso` — desde aproximadamente 12 años

- Sesión de 7 actividades y duración objetivo de 8–12 minutos.
- Interfaz e instrucciones principalmente en inglés.
- Conversaciones, mensajes, comprensión, writing y situaciones realistas.
- Mayor densidad útil y tipografía contenida.
- Sin Nemo en el flujo normal.
- Celebración sobria y breve.
- La personalización se centra en avatar, fondos, ropa, auriculares, objetos, insignias y colecciones relacionadas con viajes, música, tecnología y vida cotidiana.

## 4. Nueva experiencia de Practicar

### 4.1 Cabecera

La cabecera conservará cerrar, nombre de misión, posición y barra segmentada. La banda determinará la cantidad de información visible:

- `p12`: nombre corto, números grandes y avión destacado.
- `p34`: nombre, actividad actual y progreso.
- `p56`: nombre, habilidad y progreso.
- `eso`: sesión, habilidad, número y barra compacta.

### 4.2 Presentación de la pregunta

El motor recibirá un objeto de experiencia derivado de la banda. Ese objeto controlará tamaño, soporte lingüístico, ayuda, densidad, uso de ilustración y comportamiento del guía. Las plantillas seguirán resolviendo el tipo de interacción; no se duplicará una plantilla por edad.

Las preguntas podrán declarar contenido alternativo por banda cuando sea necesario:

```js
{
  instruction: "Listen and choose.",
  instructions: {
    p12: "Escucha y toca el dibujo.",
    p34: "Listen and choose the picture.",
    eso: "Listen. What are they planning to do?"
  },
  visualSupport: {
    p12: "required",
    p34: "preferred",
    p56: "optional",
    eso: "content-only"
  }
}
```

La ausencia de variante utilizará el texto base existente. El motor nunca inventará automáticamente una traducción.

### 4.3 Respuesta y feedback

- La selección será neutral hasta comprobar.
- El primer error ofrecerá una pista y un segundo intento.
- El segundo error mostrará respuesta correcta y explicación.
- Un error no restará puntos ni dañará el mundo personal.
- El feedback celebrará comprensión, esfuerzo y recuperación, no solo precisión.
- `p12` utilizará una frase y un apoyo visual.
- `p34` añadirá una explicación breve.
- `p56` mostrará explicación y ejemplo.
- `eso` mantendrá el feedback principalmente en inglés.
- Sonido y movimiento respetarán los ajustes del perfil y `prefers-reduced-motion`.

### 4.4 Cierre de misión

El resumen mostrará aprendizaje antes que recompensa:

1. Resultado y tiempo.
2. Expresiones o habilidad practicada.
3. Elementos a reforzar.
4. Puntos de ruta obtenidos.
5. Cambio producido en el mundo personal o progreso hacia el siguiente desbloqueo.

La recompensa solo se registrará una vez por misión. Los repasos podrán avanzar dominio, pero no permitirán repetir indefinidamente una sesión para acumular saldo.

## 5. Bucle motivacional

```text
Misión diaria
→ feedback y segundo intento
→ resumen de aprendizaje
→ recompensa determinista
→ evolución visible del mundo
→ elección de personalización
→ siguiente objetivo comprensible
```

### 5.1 Reglas de recompensa

- Una misión diaria completada mantiene la recompensa base existente de 20 unidades.
- Esa unidad se presentará como **Puntos de ruta**, nunca como gemas.
- El XP existente seguirá siendo progreso acumulado y no gastable; no será protagonista en Primaria.
- La precisión no reducirá la recompensa base.
- Los hitos semanales, sellos y dominio pueden desbloquear objetos concretos, no premios aleatorios.
- Los precios serán estables y siempre visibles.
- No habrá dinero real, compras dentro de la aplicación, azar ni ventajas pedagógicas de pago.

### 5.2 Siguiente objetivo

El alumno siempre verá un objetivo cercano y verificable, por ejemplo:

- “Completa 2 misiones para desbloquear el estanque.”
- “Te faltan 20 puntos de ruta para adoptar a Nube.”
- “Domina 3 expresiones de School Life para conseguir este póster.”

La interfaz no mostrará objetos imposibles de alcanzar sin explicar el requisito.

## 6. Avatar y mundos

### 6.1 Avatar

El avatar será humano, modular e inclusivo. La primera versión permitirá elegir:

- tono de piel;
- estilo y color de pelo;
- color de camiseta o sudadera;
- un accesorio equipado;
- fondo o escenario.

Las opciones no estarán divididas por género. Todas usarán SVG propio y tokens de marca. Nemo permanecerá separado como guía.

### 6.2 Jardín de Primaria

El jardín será una escena determinista que crece según objetos poseídos; la primera versión no permitirá arrastrar libremente elementos. Esto evita añadir un editor complejo y permite persistir con el modelo actual.

Catálogo inicial:

- árbol joven, incluido como punto de partida;
- flores, 40 Puntos de ruta;
- banco, 60 Puntos de ruta;
- faroles, 80 Puntos de ruta;
- estanque, 120 Puntos de ruta;
- pequeño invernadero, 180 Puntos de ruta.

Cada objeto tendrá estado bloqueado, disponible, conseguido y colocado. El crecimiento se comunicará con texto, no solo mediante animación.

### 6.3 Compañeros animales

La primera versión incluirá tres compañeros originales en SVG, con nombres y siluetas diferenciadas:

- **Nube**, gato curioso, 100 Puntos de ruta;
- **Brisa**, perro explorador, 140 Puntos de ruta;
- **Menta**, tortuga tranquila, 180 Puntos de ruta.

No serán emojis ni personajes de terceros. Se podrán conseguir y seleccionar, pero no necesitarán alimentación, cuidados obligatorios ni visitas diarias para evitar presión.

### 6.4 Espacio personal de ESO

ESO reutilizará catálogo, saldo, propiedad y equipamiento, pero mostrará otra composición:

- avatar más sobrio;
- fondo o tema;
- ropa y accesorios;
- pósteres y recuerdos de unidades;
- insignias y colecciones;
- objetos vinculados a viajes, música y tecnología.

Los elementos infantiles se filtrarán por banda y no aparecerán bloqueados en ESO.
Los objetos de ESO utilizarán los mismos escalones de precio —40, 60, 80, 120 y 180— para mantener una economía común sin mostrar el catálogo infantil.

## 7. Arquitectura

### 7.1 Configuración de experiencia

`etapa.js` seguirá siendo la fuente para edad y banda. Sus perfiles incorporarán una configuración de ejercicio y mundo, manteniendo `data-age-mode` y `data-stage` como acopladores visuales.

No se crearán páginas `leccion-5.html`, `leccion-8.html` o similares.

### 7.2 Motor de ejercicios

`motor/engine.js` conservará el registro de plantillas. Recibirá un contexto reutilizable:

```js
{
  band,
  ageMode,
  languageSupport,
  visualSupport,
  guideIntensity,
  celebrationIntensity
}
```

Las plantillas consultarán el contexto para copy, ayudas y presentación. La validación y la forma del evento de intento permanecerán comunes.

### 7.3 Módulo de mundo y catálogo

Se creará un módulo puro para:

- catálogo por banda;
- cálculo de disponibilidad;
- siguiente desbloqueo;
- propiedad y equipamiento;
- traducción entre datos heredados y la nueva terminología;
- resumen de recompensa al completar una misión.

La capa visual consumirá ese módulo desde Perfil, cierre de misión y `Mi mundo`.

### 7.4 Persistencia

La primera versión reutilizará `student_state`:

- `gems` como saldo técnico heredado, presentado como Puntos de ruta;
- `xp` como progreso acumulado;
- `owned` como lista de identificadores de objetos;
- `hat` y `acc` como slots equipados.

Los nombres técnicos heredados no se mostrarán en la interfaz. La demo seguirá usando `localStorage` mediante `ILAuth`; las cuentas reales seguirán usando Supabase. No se creará una segunda fuente de verdad.

La escena del jardín será determinista a partir de `owned`, por lo que no necesita coordenadas persistidas. Si una fase posterior incorpora colocación libre, requerirá una migración específica de personalización.

### 7.5 Compatibilidad

- Los objetos antiguos reconocibles se migrarán por identificador o se ocultarán si no encajan.
- El saldo existente se conservará.
- Los objetos no válidos no romperán el render.
- La antigua terminología de gemas desaparecerá de las pantallas del alumno.
- Inicio, Progreso, Perfil y cierre de misión seguirán leyendo progreso desde `ILAuth` y `ILProgressData`.

## 8. Componentes visuales

Se crearán estilos o funciones reutilizables para:

- `ExerciseExperienceHeader`;
- `AgeInstruction`;
- `IllustratedOption`;
- `HintPanel`;
- `MissionRewardSummary`;
- `RoutePointBalance`;
- `StudentAvatar`;
- `CompanionCard`;
- `GardenScene`;
- `PersonalSpaceScene`;
- `UnlockCard`;
- `CatalogItem`;
- `NextUnlock`.

En la arquitectura actual estos componentes serán funciones JavaScript y clases CSS compartidas, no componentes de un framework nuevo.

## 9. Navegación e integración

- `Practicar` seguirá abriendo `leccion.html`.
- Perfil incorporará un acceso claro a avatar y mundo.
- La antigua `tienda.html` se transformará en la experiencia de personalización; se mantendrá la ruta para no romper enlaces.
- El final de misión podrá abrir `Mi mundo` cuando exista un cambio, pero volver al Inicio seguirá siendo la acción principal.
- Inicio podrá mostrar una miniatura del mundo y el siguiente desbloqueo sin competir con la misión diaria.
- ESO verá la etiqueta `Personalizar`; Primaria podrá ver `Mi mundo`.

## 10. Estados y errores

- Cargando: skeleton de avatar, escena y catálogo.
- Sin saldo: se explica qué misión permite avanzar; no se presenta como fracaso.
- Sin objetos: se muestra el primer desbloqueo alcanzable.
- Error de guardado: se conserva la interfaz y se informa de que se reintentará; no se anuncia una compra inexistente.
- Objeto antiguo desconocido: se ignora de forma segura.
- Audio no disponible: la actividad sigue siendo realizable cuando pedagógicamente sea posible; si el audio es imprescindible, se muestra un estado explícito.
- Contenido sin variante de edad: se utiliza la variante base validada por la matriz.

## 11. Accesibilidad y rendimiento

- Todos los objetos interactivos serán botones o controles nativos.
- Estados seleccionado, conseguido y bloqueado incluirán texto o icono además de color.
- Targets de 56 px en `p12` y al menos 44 px en el resto.
- El avatar tendrá descripción accesible; los detalles decorativos permanecerán ocultos al lector de pantalla.
- El jardín dispondrá de un resumen textual de sus elementos.
- Foco visible y orden lógico en ejercicios, diálogos y catálogo.
- Las celebraciones respetarán `prefers-reduced-motion` y el ajuste del perfil.
- SVG reutilizable y sin dependencias pesadas.
- Sin scroll horizontal a 360, 390, 768, 1024, 1366 y escritorio grande.

## 12. Analítica mínima de producto

Cuando exista una capa de analítica aprobada, los eventos útiles serán:

- misión iniciada, continuada y completada;
- segundo intento utilizado;
- ayuda o audio utilizado;
- mundo visitado después de completar;
- personalización seleccionada;
- objeto desbloqueado.

No se registrará texto libre de menores ni se usarán estos eventos para presión personalizada.

## 13. Pruebas y criterios de aceptación

### Motor

- Cada banda recibe solo plantillas, nivel y número de opciones permitidos.
- `p12` y `p34` muestran diferencias visibles aunque compartan `primary-young`.
- Seleccionar no implica acertar.
- Primer error permite reintento; segundo error muestra solución.
- El audio funciona con reproducción, repetición, desactivado y error.
- Teclado, foco y CTA móvil funcionan en todas las plantillas.

### Recompensas

- Una misión completada suma una sola recompensa.
- Refrescar el resumen no vuelve a sumar saldo.
- Un repaso no permite acumular saldo de forma infinita.
- Comprar descuenta el precio exacto y persiste propiedad.
- Equipar no vuelve a cobrar.
- Un fallo de guardado no muestra el objeto como adquirido.

### Adaptación visual

- `p12`, `p34`, `p56` y `eso` se prueban en 360, 390, 768, 1024 y 1366 px.
- No hay emojis estructurales ni desbordamiento horizontal.
- Nemo está visible, discreto u oculto según la banda.
- ESO no muestra jardín ni compañeros infantiles.
- Reduced motion elimina animaciones no esenciales.

### Integración

- Inicio, Perfil, Progreso, cierre de misión y `Mi mundo` muestran saldo y objetos coherentes.
- Demo y cuenta real usan la misma interfaz pública de datos.
- La consola queda sin errores.
- Las pruebas existentes siguen pasando.

## 14. Orden de implementación

1. Ampliar configuración y tests por banda.
2. Extraer copy y contexto adaptativo del motor.
3. Rediseñar plantillas y estilos de ejercicios por banda.
4. Crear catálogo, módulo de mundo y pruebas puras.
5. Crear avatar y escenas SVG compartidas.
6. Sustituir `tienda.html` por `Mi mundo`.
7. Integrar Perfil y cierre de misión.
8. Añadir miniatura y siguiente desbloqueo en Inicio.
9. Probar persistencia, economía y prevención de recompensas duplicadas.
10. Ejecutar pruebas técnicas, accesibilidad y matriz visual completa.

## 15. Fuera de alcance de esta iteración

- Editor libre para colocar objetos en coordenadas.
- Alimentación o cuidados obligatorios de compañeros.
- Multijugador, rankings, perfiles públicos o visitas a mundos ajenos.
- Compras con dinero real.
- Recompensas aleatorias o cajas sorpresa.
- Aplicación separada por edad.
- Nueva mascota adicional a Nemo.
- Generación automática de ejercicios o traducciones.

## 16. Riesgos y mitigación

- **Que la recompensa sustituya al aprendizaje:** el cierre presenta primero lo aprendido y después el mundo.
- **Que Primaria parezca genérica:** avatar, animales y jardín usarán SVG y lenguaje visual propio de Interlanguage.
- **Que ESO parezca infantil:** catálogo filtrado, densidad sobria, ausencia de jardín y Nemo fuera del flujo normal.
- **Inflación del saldo heredado:** precios iniciales se calibrarán con el saldo demo y el ritmo real de 20 puntos por misión.
- **Confusión entre XP, puntos y sellos:** XP será nivel, Puntos de ruta serán saldo y Sellos serán logros permanentes.
- **Duplicación de recompensa:** se conserva `completionRecorded` como guardia y se añaden pruebas de idempotencia.
- **Contenido insuficiente para cada edad:** la matriz impedirá mostrar plantillas no aptas y la implementación no inventará variantes editoriales ausentes.
