# Adaptación de interfaz por etapa

## Objetivo

Mantener una sola plataforma Interlanguage y adaptar su experiencia a tres perfiles de alumno: `primary-young`, `primary-upper` y `secondary`. La adaptación afecta al tono, escala, densidad, guía, decoración y duración de misión sin duplicar páginas ni alterar el modelo de progreso.

## Decisión de arquitectura

La plataforma conservará las bandas pedagógicas existentes (`p12`, `p34`, `p56`, `eso`) como capa interna de compatibilidad para filtrar ejercicios y escoger instrucciones. Sobre ellas, `etapa.js` expondrá una configuración semántica única de experiencia:

- `primary-young`: bandas `p12` y `p34`, sesiones de 5–7 minutos, mayor apoyo en español y guía visible.
- `primary-upper`: banda `p56`, sesiones de 7–10 minutos, tono mixto y guía discreta.
- `secondary`: banda `eso`, sesiones de 8–12 minutos, tono sobrio, mayor densidad útil y sin mascota en el flujo principal.

`IL_ETAPA.apply(profile)` seguirá devolviendo la banda pedagógica para no romper los consumidores actuales, y añadirá `data-age-mode` al `body`. La configuración completa quedará accesible mediante `IL_ETAPA.current()` y `IL_ETAPA.config()`.

## Resolución del perfil

En uso real, el modo se resuelve con los datos del perfil:

- hasta 9 años: `primary-young`;
- de 10 a 11 años: `primary-upper`;
- desde 12 años: `secondary`;
- sin dato de edad: `primary-upper`, la opción neutral actual.

La banda interna seguirá distinguiendo `p12` y `p34` dentro de Primaria inicial. Esto evita rebajar o elevar contenidos al cambiar solamente la presentación.

## Selector de demostración

`etapa.js` montará un selector compartido únicamente cuando `ILAuth.isDemo()` sea verdadero. La selección se guardará en `sessionStorage`, recargará la pantalla para reconstruir la sesión de forma coherente y aceptará `?ageMode=` solo en demo. En producción no se insertará ningún nodo, no se leerá el override y el perfil será la única fuente.

## Adaptación visual

Un nuevo `age-mode.css`, cargado después de los estilos de cada pantalla, aplicará las diferencias con `body[data-age-mode="…"]`:

- escala tipográfica y de controles;
- radios, sombras y densidad;
- presencia de avión/guía y decoración;
- ancho y ritmo de lectura;
- densidad de tarjetas, métricas, ejercicios y resumen;
- frecuencia visual de celebraciones.

Se conservan colores, tipografía, iconos y avión de papel de Interlanguage. No se introducen assets infantiles genéricos ni dependencias.

## Adaptación funcional y de contenido

Cada modo declara en configuración:

- duración visible;
- límite de ejercicios (`5`, `6`, `7`);
- tono de saludo y etiquetas;
- prioridad de habilidades;
- visibilidad y tono de la guía;
- temas recomendados para futuras unidades.

Inicio y Lección usarán el mismo límite para que la tarjeta y la misión siempre coincidan. La selección diaria podrá priorizar habilidades por modo sin excluir contenido apto. El motor seguirá utilizando la banda pedagógica para las instrucciones específicas ya existentes.

Progreso abrirá `Mi aprendizaje` por defecto en ESO, salvo que exista un tab explícito en la URL, y Perfil ajustará el papel de Nemo según el modo. Los ajustes y el progreso continúan usando los sistemas actuales de persistencia.

## Accesibilidad y responsive

El selector demo será un control nativo con etiqueta accesible. Todos los modos mantendrán targets mínimos de 44 px; Primaria inicial los ampliará. Las variaciones respetarán `prefers-reduced-motion` y los tamaños 360, 390, 768, 1024 y escritorio.

## Validación

- pruebas unitarias de resolución, configuración y seguridad del selector demo;
- pruebas de selección de sesión por límite/prioridad;
- suite Node existente;
- revisión en navegador de Inicio, Lección, Progreso y Perfil en los tres modos;
- revisión móvil representativa y consola sin errores provocados por los cambios.

