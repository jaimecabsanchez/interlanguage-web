# Fase 1 — Design system y arquitectura por edad

Fecha: 2026-08-24  
Estado: aprobado con ajustes
Ámbito: `plataforma/` (Interlanguage HOME)

## 1. Objetivo

Consolidar las reglas visuales, lingüísticas y motivacionales de la plataforma sin rediseñar todavía sus pantallas. Al terminar, las cuatro bandas deben compartir una arquitectura coherente y accesible, manteniendo diferencias apropiadas de densidad, autonomía, idioma de interfaz y tono.

Esta fase preserva la apariencia general actual. Los rediseños de Inicio, Practicar, Progreso, Perfil y Mundo pertenecen a fases posteriores.

## 2. Principios

1. Una fuente canónica por concepto; los consumidores no duplican catálogos.
2. Edad y CEFR son dimensiones independientes.
3. El contenido que se aprende puede estar en inglés; la interfaz de `p12/p34` usa español.
4. Los rewards son proyecciones de eventos reales, nunca la verdad del aprendizaje.
5. La migración es incremental y compatible con datos legacy.
6. Ninguna regresión en ESO para corregir Primaria.
7. Cero colores nuevos fuera de tokens `--il-*`.
8. Navegación e iconos siguen procediendo exclusivamente de `layout.js`.
9. Sin build, framework, economía, nuevos rewards ni rediseño visual amplio.

## 3. Estrategia elegida

Se aplicará una fundación transversal por capas:

1. tokens y componentes compartidos;
2. registro de copy y políticas por banda;
3. catálogo canónico de rewards con adaptadores legacy;
4. contrato edad × CEFR, accesibilidad y retirada progresiva de duplicados.

No se migrará página por página de forma aislada ni se sustituirá todo el sistema de una vez. Cada capa tendrá tests antes de conectar la siguiente.

## 4. Arquitectura propuesta

### 4.1 Tokens semánticos

`design-system.css` continúa como fuente canónica. Se completarán familias de tokens para:

- texto, superficie, borde y estado interactivo;
- feedback informativo, éxito, aviso, error y estado técnico;
- tipografía y densidad por banda;
- tamaño táctil mínimo y altura de controles;
- espaciado, radios, elevación, foco y movimiento;
- overlays y estados disabled/loading.

Los valores literales de color solo podrán existir en la definición de tokens. Los CSS, HTML y JS consumidores usarán `var(--il-*)`. Los alias históricos de `app.css` se conservarán temporalmente, pero solo podrán apuntar a tokens canónicos.

Los colores editoriales de assets o ilustraciones no se convertirán en estilos de interfaz. SVG funcional generado por `layout.js` o `il-visual.js` usará tokens o `currentColor` siempre que sea viable.

### 4.2 Componentes compartidos

`app.css` contendrá los patrones globales ya existentes y los normalizará como componentes de presentación:

- botones y botones de icono;
- campos, selects y mensajes de validación;
- tarjetas y paneles;
- chips y etiquetas de estado;
- barras de progreso;
- estados loading, empty, unavailable y error;
- diálogos y avisos;
- regiones de feedback accesible.

No se introducirá un framework de componentes. Si una construcción DOM se repite y necesita comportamiento, se añadirá un módulo `ui-components.js` pequeño con API explícita (`state`, `announce`, `setBusy`). No absorberá navegación, iconos, contenido ni lógica pedagógica.

Los componentes conservarán HTML semántico, foco visible, teclado y anuncios ARIA. Una variante por banda cambiará copy, densidad o apoyo visual, pero no creará cuatro componentes incompatibles.

### 4.3 Registro canónico de copy

Se creará `copy-registry.js` como módulo puro y testeable. Su API mínima será:

- `text(key, band, params)` para copy de interfaz;
- `skill(skillId, band)` para etiquetas de habilidades;
- `missionTitle(content, band)` para títulos visibles de unidad/misión;
- `reward(rewardId, band)` para nombre, descripción y requisito;
- `has(key)` para auditoría y tests.

Reglas lingüísticas:

- `p12` y `p34`: interfaz, instrucciones, acciones, habilidades y nombres de misión visibles en español;
- `p56`: interfaz principalmente comprensible en español, introduciendo inglés de forma contextual en misión, aprendizaje y acciones cuando sea natural; el chrome no se traduce automáticamente;
- `eso`: inglés con mucha más presencia, manteniendo siempre claridad;
- el contenido lingüístico de ejercicios no se traduce;
- los títulos de contenido deben declarar variantes `es/en` o resolver mediante el mapa existente;
- una clave ausente usa un fallback explícito y genera una señal de observabilidad en desarrollo; no muestra `undefined` ni una etiqueta legacy accidental;
- la interpolación solo admite parámetros conocidos y escapa la salida cuando se inserta como texto.

El copy actualmente repartido entre `etapa.js`, `inicio.html`, `perfil.js`, `progreso.js`, `engine.js` y catálogos se migrará gradualmente. `etapa.js` dejará de ser un segundo diccionario y conservará políticas de experiencia.

### 4.4 Política de experiencia por banda

`etapa.js` seguirá resolviendo banda y modo, pero `BAND_EXPERIENCE` se convertirá en el contrato canónico de presentación:

- idioma de interfaz;
- tamaño táctil mínimo;
- número máximo de opciones visibles;
- densidad y longitud máxima orientativa;
- nivel de guía visual;
- autonomía;
- intensidad de celebración;
- duración/tamaño de sesión;
- modalidades de interacción apropiadas.

Política objetivo:

| Banda | Interfaz | Touch | Densidad | Guía | Autonomía |
|---|---|---:|---|---|---|
| `p12` | español | 56 px | mínima | alta, puntual | baja |
| `p34` | español | 52 px | baja | media | media-baja |
| `p56` | español + inglés contextual | 48 px | media | discreta | media-alta |
| `eso` | inglés/maduro | 44 px | alta controlada | mínima | alta |

`data-stage` seguirá siendo el selector CSS estable. No se duplicará la banda en clases manuales de cada página. Una banda desconocida no se convertirá silenciosamente en `p56`: primero se resolverá desde perfil, estado o contexto; si no es posible se aplicará una política neutral segura y se registrará `invalid_data`.

### 4.5 Matriz edad × CEFR

`motor/matriz.js` seguirá siendo la puerta de adecuación de interacción. Su decisión se dividirá conceptualmente en:

1. **Edad/banda:** modalidad, carga cognitiva, opciones, autonomía y contexto apropiado.
2. **CEFR:** dificultad lingüística y selección de contenido.

`preferredCefr` será solo orientación editorial, nunca un bloqueo. Un ejercicio podrá representar combinaciones como `p12 + A1` o `eso + Pre-A1` si su interacción y contexto son aptos.

Los packs actuales conservarán su comportamiento. No se añadirá contenido nuevo ni se cambiará el inglés de los ejercicios.

### 4.6 Catálogo único de rewards

`motor/achievements.js` será el catálogo canónico. Contendrá por cada reward:

- id estable;
- familia;
- copy visible por banda mediante el registro;
- criterio declarativo;
- evidencia necesaria;
- visual de sello;
- disponibilidad por banda;
- vínculo opcional con `world-data.js`.

`motor/motivacion.js` dejará de mantener un catálogo paralelo con emojis. Durante la migración será un adaptador compatible para rachas y llamadas antiguas. `achievement-store.js` conservará el mapa legacy y no eliminará logros obtenidos.

`progress-data.js`, `perfil.js`, `progreso.js`, `leccion.html`, `il-visual.js` y `world-data.js` consumirán los mismos ids. Los tests impedirán ids huérfanos, criterios duplicados, rewards sin visual y desbloqueos de Mundo sin catálogo.

No se añaden nuevos logros. Se retira el `+10` genérico de la experiencia porque no representa una unidad canónica ni explica la evidencia. El feedback seguirá mostrando corrección y avance real, sin moneda implícita.

## 5. Comportamiento UX por banda

### `p12`

- Una acción principal por estado.
- Copy breve, concreto y en español.
- Targets de 56 px y separación suficiente.
- Estados apoyados por forma, icono y texto; nunca solo color.
- Nemo solo en momentos de guía o resultado.
- Métricas abstractas y porcentajes no se introducirán en esta fase.

### `p34`

- Interfaz en español y contenido de aprendizaje en inglés.
- Algo más de detalle, manteniendo instrucciones directas.
- Targets de 52 px.
- Guía menos frecuente y autonomía progresiva.

### `p56`

- Chrome y explicaciones principalmente comprensibles en español.
- Inglés contextual en misión, aprendizaje y acciones donde resulte natural.
- Targets de 48 px y densidad media.
- Mayor visibilidad de contexto y progreso.
- Ayuda discreta, no infantil.

### `eso`

- Tono maduro y compacto.
- Targets nunca inferiores a 44 px.
- Inglés con mucha más presencia, sin comprometer la claridad.
- Cero infantilización y ninguna regresión al consolidar Primaria.

En todas las bandas, la identidad o avatar del propio alumno tiene prioridad. Nemo no se convierte en mascota persistente: se limita a apoyos puntuales de bienvenida, pista, resultado o desbloqueo cuando aporte comprensión.

## 6. Migración incremental

### Entrega 1 — Tokens y componentes

1. Inventariar colores literales y patrones duplicados.
2. Añadir tokens semánticos sin cambiar resultados visuales.
3. Sustituir literales de interfaz por tokens.
4. Normalizar estados y targets compartidos.
5. Añadir tests estáticos de tokens, foco y tamaño táctil.

### Entrega 2 — Copy y políticas por banda

1. Crear registro y tests de cobertura.
2. Migrar habilidades, misiones y acciones visibles.
3. Extraer copy duplicado de `etapa.js` y consumidores.
4. Verificar que ejercicios conservan su idioma original.
5. Validar las cuatro bandas en navegador.

### Entrega 3 — Rewards

1. Declarar `motor/achievements.js` fuente única.
2. Convertir `motor/motivacion.js` en adaptador legacy.
3. Unificar consumidores y aliases visuales.
4. Retirar `+10` y emojis de interfaz.
5. Verificar migración de ids y que no se pierde progreso.

### Entrega 4 — Edad × CEFR y retirada legacy

1. Consolidar políticas en `etapa.js`.
2. Hacer que `motor/matriz.js` consuma el contrato de interacción.
3. Añadir matriz de combinaciones edad × CEFR.
4. Eliminar duplicados solo cuando todos los consumidores estén migrados.
5. Ejecutar auditoría final de colores, copy, targets, contraste y compatibilidad.

## 7. Manejo de errores y compatibilidad

- Copy ausente: fallback seguro, señal de observabilidad y test fallido en catálogos requeridos.
- Banda desconocida: resolver desde perfil/estado/contexto; si no es posible, política neutral segura, `data-stage="neutral"` y evento observable `invalid_data`. Nunca fallback silencioso a `p56`.
- Reward legacy: migración idempotente al id canónico; ids sin equivalencia se conservan como dato histórico o se ignoran solo para presentación, nunca se borran.
- Componente no montado: la página conserva su HTML existente; las mejoras JS son progresivas.
- CSS legacy: los alias continúan durante esta fase y se eliminan únicamente si no tienen consumidores.
- Reduced motion, teclado y lectores de pantalla son requisitos de aceptación, no mejoras opcionales.

## 8. Pruebas

Se añadirán tests para:

1. cero colores literales nuevos fuera de `design-system.css` y excepciones editoriales documentadas;
2. contraste AA de combinaciones funcionales;
3. targets mínimos por banda;
4. cobertura de copy requerida en las cuatro bandas;
5. interfaz española en `p12/p34`, español con inglés contextual en `p56` e inglés claro con mayor presencia en `eso`;
6. contenido de ejercicios intacto;
7. catálogo único y sin ids duplicados;
8. migración de todos los ids legacy conocidos;
9. ningún reward sin criterio/evidencia/visual/bandas;
10. contratos entre achievements, Mundo y sellos;
11. combinaciones edad × CEFR sin techos artificiales;
12. no regresión de ESO;
13. teclado, foco, reduced motion y estados ARIA;
14. toda la suite existente.

Verificación manual mínima:

- `p12`, `p34`, `p56`, `eso` en Inicio, sesión y Progreso;
- 390×844, 768×1024, 1024×768 y escritorio;
- navegación por teclado;
- zoom/texto grande;
- `prefers-reduced-motion`;
- sesión completada y reward legacy migrado.

## 9. Criterios de aceptación

La Fase 1 estará terminada cuando:

- las cuatro bandas resuelvan políticas y copy desde fuentes canónicas;
- `p12/p34` no muestren inglés accidental en interfaz;
- `p56` mantenga chrome comprensible en español y use inglés solo de forma contextual;
- el inglés editorial de ejercicios no haya cambiado;
- edad no imponga un techo CEFR;
- una banda desconocida active un modo neutral observable y nunca `p56` silencioso;
- el avatar del alumno tenga prioridad y Nemo permanezca puntual;
- exista un único catálogo funcional de rewards;
- no queden emojis de interfaz en el catálogo legacy;
- el `+10` genérico no se muestre;
- ningún progreso o reward existente se pierda;
- no haya hex nuevo fuera de tokens y se reduzca el legacy inventariado;
- targets y contraste cumplan la matriz acordada;
- ESO conserve tono, densidad y comportamiento;
- la suite completa esté verde y las cuatro bandas pasen comprobación visual.

## 10. Fuera de alcance

- Rediseño de pantallas.
- Nuevas rutas, economía, monedas o cofres.
- Nuevos rewards, Mundo o avatar.
- Nuevos ejercicios o contenido.
- Test de nivel adaptativo definitivo.
- Reestructuración del panel familiar.
- Cambios en las reglas de verdad y persistencia ya cerradas en Fase 0, salvo adaptación necesaria de consumidores.

## 11. Rollback

La fase no necesita migración destructiva de base de datos. Cada entrega conserva adaptadores y aliases hasta verificar consumidores. El rollback consiste en volver a los consumidores legacy manteniendo intactos ids y datos persistidos. No se elimina almacenamiento local ni progreso del servidor.
