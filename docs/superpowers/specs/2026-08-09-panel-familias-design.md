# Primera versión del panel para familias

## Objetivo

Crear una zona separada de la experiencia del alumno que permita a madres, padres y tutores comprender el valor educativo de la práctica digital. La página prioriza aprendizaje, constancia y conexión con la clase; XP, puntos, rachas y sellos no forman parte de la jerarquía principal.

## Ruta y acceso

La nueva ruta será `plataforma/familias.html`. Tendrá cabecera, navegación y estilo propios, sin reutilizar la navegación infantil. En esta primera versión usará la sesión existente del alumno como vista previa. Si no existe sesión, mostrará un estado de acceso preparado para conectarse posteriormente a autenticación familiar o enlaces seguros.

`informe.html` se mantiene intacto porque representa el futuro informe compartible. Desde Perfil se añadirá un acceso secundario a la vista familiar para que la primera versión sea completamente navegable.

## Datos

`progress-data.js` seguirá siendo la fuente central del snapshot educativo. Los datos demo familiares se añadirán dentro del mismo registro de Lucía para no duplicar precisión, minutos, expresiones o habilidades.

Un nuevo módulo puro `family-data.js` convertirá el snapshot en un modelo de presentación familiar. Este módulo:

- deriva nombre, actividad semanal y habilidades del snapshot compartido;
- incorpora solo en demo la evidencia adicional necesaria para ejercicios semanales, evolución y conexión con clase;
- calcula fortalezas y áreas de refuerzo únicamente cuando hay porcentajes disponibles;
- genera mensajes interpretativos con umbrales explícitos;
- devuelve un estado de evidencia insuficiente cuando faltan sesiones o series históricas.

En producción, ninguna métrica inexistente se sustituirá por una cifra ficticia. Los componentes mostrarán `—`, una explicación o se ocultarán según corresponda.

## Jerarquía de la página

1. Cabecera adulta de Interlanguage y navegación por anclas.
2. Resumen semanal de Lucía con días, ejercicios, expresiones, precisión y minutos.
3. Mensaje interpretativo principal.
4. Constancia y contenidos trabajados.
5. Fortalezas y área para reforzar.
6. Evolución mediante visualizaciones CSS sencillas.
7. Próxima recomendación.
8. Conexión con lo trabajado en clase.
9. Nota metodológica sobre cómo interpretar los datos.

## Visualizaciones

No se añadirá ninguna dependencia. Se utilizarán:

- barras verticales para sesiones de las últimas cuatro semanas;
- una serie de progreso para minutos y precisión;
- barras horizontales para skills;
- etiquetas de texto y valores visibles para que el significado no dependa del color.

Las gráficas se acompañarán siempre de interpretación pedagógica.

## Estados

- Cargando: skeletons basados en el sistema de diseño.
- Error: mensaje y reintento.
- Sin sesión: explicación y enlace a la entrada de la plataforma.
- Pocos datos: “Lucía acaba de empezar. Necesitamos algunas sesiones más para mostrar una evolución fiable.”
- Evidencia suficiente: métricas, tendencias y recomendaciones.

El modo local aceptará `?familyState=new` para verificar el estado de pocos datos. Este override no se aplicará fuera de un entorno demo local.

## Responsive y accesibilidad

La implementación será mobile-first. A 360–390 px las métricas se distribuirán en dos columnas, las gráficas conservarán etiquetas legibles y todas las áreas se apilarán sin scroll horizontal. En escritorio se utilizará una retícula editorial de dos columnas con jerarquía desigual.

La navegación será por enlaces nativos, los gráficos tendrán descripciones accesibles, los botones mantendrán targets mínimos de 44 px y se respetará `prefers-reduced-motion`.

## Validación

- tests unitarios del modelo familiar con datos completos y escasos;
- coherencia con `progress-data.js`;
- navegación desde Perfil y vuelta a la zona del alumno;
- revisión a 360, 390, 768, 1024 y 1366 px;
- validación del estado con pocos datos;
- comprobación de recursos y errores provocados por la implementación.

