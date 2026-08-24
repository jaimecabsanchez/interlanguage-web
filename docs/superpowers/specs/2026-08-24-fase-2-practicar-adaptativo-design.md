# Fase 2 · Practicar adaptativo

**Fecha:** 2026-08-24  
**Estado:** aprobado para implementación con ajustes de revisión incorporados

## 1. Objetivo

Convertir `Practicar` en un punto de decisión claro y útil. El alumno debe entender qué puede practicar, por qué se le recomienda y qué ocurrirá al empezar, sin recorrer una biblioteca extensa ni alterar su misión diaria.

Esta es la primera iniciativa de Fase 2. Panel de profesores, PWA, notificaciones y analítica avanzada se tratarán como proyectos independientes posteriores.

## 2. Principios y restricciones

- Mantener web estática HTML/CSS/JS, Supabase y Netlify, sin build ni framework nuevo.
- Usar únicamente colores `--il-*`, iconos de `layout.js` y el sistema visual existente.
- `p12/p34` usan interfaz española; `p56` mantiene chrome español e inglés contextual; `eso` puede usar más inglés con claridad.
- Edad gobierna interacción y densidad; CEFR gobierna dificultad lingüística. Ningún eje sustituye al otro.
- La misión diaria y la práctica libre tienen estado y persistencia independientes.
- No inventar métricas en cuentas reales ni mostrar una recomendación que no tenga evidencia.
- Sin rankings, culpa, castigos, monedas, cofres ni rewards nuevos.
- Nemo solo puede aparecer en un momento puntual de ayuda o feedback, nunca como presencia fija.
- La primera entrega no rediseña Inicio, Progreso, Perfil ni el motor visual de ejercicios.

## 3. Enfoques considerados

### A. Centro guiado de práctica — elegido

Una pantalla propia con tres caminos: recomendación, errores y habilidad. Reduce carga de decisión, explica el propósito de cada sesión y admite más inteligencia futura sin exponer la arquitectura interna.

### B. Biblioteca de unidades

Ofrece autonomía, pero obliga a comprender unidades, niveles y habilidades. Es especialmente inadecuada para `p12/p34` y facilita elecciones poco útiles.

### C. Práctica automática directa

Minimiza pasos, pero oculta el motivo de la selección y no permite que el alumno elija. Se conserva como comportamiento interno de la tarjeta recomendada, no como pantalla completa.

## 4. Arquitectura

### 4.1 Nuevas piezas

- `plataforma/practicar.html`: estructura semántica, estados de carga/error/vacío y contenedor de opciones.
- `plataforma/practicar.css`: presentación responsive y densidad por `body[data-stage]`.
- `plataforma/practicar.js`: carga de perfil/datos, renderizado, interacción y navegación.
- `plataforma/practice-options.js`: módulo puro que convierte evidencia y contenido disponible en un modelo de opciones practicables.
- Tests unitarios y de contrato para selección, copy, accesibilidad y rutas.

### 4.2 Piezas modificadas

- `layout.js`: el destino de navegación `Practicar` pasa de `leccion.html` a `practicar.html`.
- `leccion.html`: incorpora `mode=skill&skill=<id>` como sesión extra, sin modificar la misión diaria.
- `copy-registry.js`: incorpora copy estructural de Practicar por banda.
- Páginas consumidoras: actualización de `?v=` de cualquier JS/CSS modificado.

### 4.3 Límites de responsabilidad

`practice-options.js` no toca DOM, almacenamiento ni red. Recibe un contexto normalizado y devuelve opciones con `id`, prioridad, disponibilidad, explicación, destino y razón de indisponibilidad.

`practicar.js` obtiene datos y presenta el modelo. No decide reglas pedagógicas dentro del renderizado.

`leccion.html` sigue siendo responsable de construir y ejecutar la sesión. La nueva pantalla nunca duplica selección de ejercicios.

## 5. Modelo de opciones

La pantalla presenta tres caminos estables. La misión diaria conserva prioridad de producto: la práctica libre nunca debe competir visualmente con una misión pendiente.

### 5.1 Recomendado para ti

Si la misión diaria está pendiente, la primera recomendación es completarla y se presenta con prioridad visual clara. Las rutas de práctica libre siguen accesibles, pero como opciones secundarias.

Cuando la misión diaria ya está completada, el orden de decisión es:

1. ejercicios cuyo dominio vence y son compatibles con edad/contenido;
2. habilidad con evidencia suficiente que conviene reforzar;
3. práctica extra compatible con la banda y CEFR;
4. práctica general compatible como fallback explícito.

La tarjeta explica la causa sin exponer puntuaciones internas. Ejemplos: «Tienes 3 cosas listas para repasar» o «Practicar escucha te ayudará a afianzar lo de esta semana».

### 5.2 Repasar errores

Utiliza los intentos pendientes de consolidar de la misión diaria mediante `leccion.html?mode=errors`. En `p12` el concepto visible es siempre «Repasar», con copy positivo como «Vamos a practicar otra vez algunas cosas». La palabra «errores» no aparece. `p34` puede explicar «Practica otra vez lo que más cuesta»; `p56/eso` pueden usar un lenguaje progresivamente más explícito.

Si no existen elementos pendientes, la opción permanece visible como estado positivo no interactivo: «Todo listo por ahora». No redirige silenciosamente a otro modo.

### 5.3 Elegir habilidad

Abre un selector contenido en la misma pantalla. Solo muestra habilidades que tengan al menos un ejercicio compatible con la banda y el contenido asignado al perfil.

En `p12`, la primera vista muestra como máximo tres conceptos infantiles —«Escuchar», «Palabras» y «Hablar»— en lugar de terminología académica. `p34` introduce gradualmente «Vocabulario», «Gramática» o «Lectura». `p56/eso` utilizan los nombres canónicos/contextuales de habilidades.

La navegación resultante es `leccion.html?mode=skill&skill=<id>`. El parámetro `skill` se valida contra los IDs canónicos; un valor inválido produce un estado seguro y observable, no un fallback engañoso.

Ante varias habilidades o modalidades pedagógicamente equivalentes, `practice-options.js` aplica variedad usando práctica reciente y un cooldown ligero. Esta regla solo desempata: nunca desplaza una necesidad pedagógica importante, un repaso vencido ni la misión diaria pendiente.

## 6. Adaptación por banda

### `p12`

- Español completo de interfaz.
- Una opción principal destacada y dos secundarias.
- Target mínimo 56 px, copy de una frase y máximo tres habilidades visibles inicialmente.
- Las habilidades usan icono y nombre español; no dependen únicamente del icono.

### `p34`

- Español completo de interfaz.
- Las tres opciones tienen título y explicación breve.
- Target mínimo 52 px; selector de habilidades simple y sin métricas abstractas.

### `p56`

- Títulos de navegación y explicación principalmente en español.
- Habilidades y objetivos de aprendizaje pueden aparecer en inglés de forma contextual.
- Target mínimo 48 px y algo más de información sobre el propósito de la práctica.

### `eso`

- Mayor presencia de inglés en títulos, acciones y explicaciones.
- Presentación más compacta, sin estética infantil ni personaje permanente.
- Target mínimo 44 px y claridad suficiente para entender disponibilidad y resultado.

### `neutral`

- Español claro, densidad intermedia y opciones conservadoras.
- No asume `p56`; solo muestra rutas cuya compatibilidad pueda demostrarse.
- La banda no resuelta continúa registrándose mediante observabilidad.

## 7. Flujo de datos

1. `practicar.js` obtiene el perfil autenticado y aplica `IL_ETAPA`.
2. Carga placement, progreso, eventos/mastery locales disponibles, estado de misión y contenido ya ensamblado.
3. Normaliza un contexto sin información personal innecesaria.
4. `practice-options.js` cruza disponibilidad con `ILAgePolicy`, `IL_MATRIZ`, unidades asignadas, necesidad pedagógica y práctica reciente.
5. Devuelve el modelo de opciones.
6. La UI renderiza únicamente opciones demostrables.
7. Al elegir una ruta, se navega a `leccion.html` con parámetros explícitos.
8. `leccion.html` vuelve a validar modo, habilidad y contenido antes de iniciar.

No se guarda una recomendación como dato permanente en esta entrega. Se recalcula al abrir la pantalla para evitar estados obsoletos.

## 8. Sesión por habilidad

`mode=skill` se considera práctica extra:

- no llama a `ILMission.begin`, `pause` ni `complete` para la misión diaria;
- no modifica sus índices, errores o estado de finalización;
- sí registra intentos, aprendizaje y mastery reales;
- usa el límite de sesión de la banda;
- filtra primero por unidades asignadas, después por matriz de interacción y finalmente por habilidad;
- mantiene CEFR como preferencia de dificultad, no como techo rígido;
- rota contenido para evitar repetición cuando haya alternativas;
- muestra un resumen de práctica, no la recompensa de misión diaria.

Si la habilidad deja de tener contenido compatible entre la pantalla y la sesión, se muestra «Esta práctica todavía no está disponible» con regreso a Practicar y preservando el resto de opciones. Solo se ofrece volver a Inicio cuando no exista ninguna práctica disponible.

## 9. Estados y errores

- **Carga:** skeletons con `aria-busy`, sin bloquear toda la pantalla con un spinner permanente.
- **Sin errores pendientes:** estado positivo, no botón deshabilitado sin explicación.
- **Sin mastery suficiente:** la recomendación usa práctica extra y lo explica de forma neutral.
- **Skill sin contenido compatible:** estado claro con vuelta a Practicar y acceso a las demás opciones.
- **Sin ninguna práctica compatible:** estado vacío con vuelta a Inicio; nunca inventa ejercicios.
- **Sin conexión:** conserva navegación y explica que no se pudo preparar la práctica.
- **Parámetro inválido:** `invalid_data` en observabilidad y estado seguro.
- **Fallo al registrar un intento:** se mantiene la outbox existente; no se penaliza al alumno.

## 10. Accesibilidad e interacción

- Un único `h1`, jerarquía de encabezados consecutiva y regiones con nombre accesible.
- Tarjetas accionables implementadas como enlaces o botones reales.
- Estado seleccionado comunicado con texto/ARIA, nunca solo color.
- Foco visible y orden de tabulación equivalente al orden visual.
- Selector de habilidades operable con teclado y foco devuelto a su disparador al cerrarse.
- Targets mínimos procedentes de `--il-touch-target`.
- Compatibilidad con texto grande y `prefers-reduced-motion`.
- Iconos decorativos con `aria-hidden`; nombres de habilidad siempre disponibles como texto.

## 11. Responsive

- 390×844: una columna, recomendación primero y navegación inferior sin solapamientos.
- 768×1024: una columna amplia o dos zonas cuando el contenido lo permita.
- 1024×768: rail lateral y composición principal/secundaria.
- 1440 px: ancho limitado; no se estiran las tarjetas para llenar espacio sin propósito.

## 12. Copy

El registro canónico incorpora al menos:

- título/subtítulo de Practicar;
- nombres y descripciones de las tres rutas;
- CTA de cada ruta;
- estados sin errores, sin evidencia y sin contenido;
- título y acciones del selector de habilidades;
- mensajes de sesión por habilidad.

Los nombres de habilidades reutilizan `ILCopy.skill`. El inglés editorial dentro de ejercicios no se traduce ni se altera.

## 13. Pruebas

### Unitarias

- misión diaria pendiente siempre conserva prioridad visual y de recomendación;
- con misión completada: vencido → habilidad a reforzar → extra compatible;
- cooldown reciente solo desempata opciones pedagógicamente equivalentes;
- errores disponibles/no disponibles;
- habilidades sin contenido excluidas;
- `p12` expone inicialmente como máximo Escuchar / Palabras / Hablar y no muestra «errores»;
- banda y skill inválidas usan estado seguro;
- combinaciones edad × CEFR sin techo artificial;
- `mode=skill` no muta la misión diaria;
- copy requerido en `p12`, `p34`, `p56`, `eso` y `neutral`.

### Contratos

- navegación de `layout.js` apunta a `practicar.html`;
- colores solo mediante tokens;
- iconos desde `layout.js`;
- cache-busting actualizado;
- ningún reward nuevo ni `+10` genérico.

### Navegador

- `p12`, `p34`, `p56`, `eso` y neutral seguro;
- 390×844, 768×1024, 1024×768 y 1440 px;
- teclado, foco, estados vacíos y ausencia de desbordamiento horizontal;
- sin errores de consola;
- recorrido Practicar → habilidad → resumen → Practicar;
- skill que pierde disponibilidad vuelve a Practicar, no a Inicio;
- misión diaria conserva exactamente su estado antes y después de práctica extra.

### Regresión

Se ejecutan todos los tests de `plataforma/*.test.js`, `plataforma/content/*.test.js` y `plataforma/motor/*.test.js`, además de los cinco tests mínimos de CI indicados por `AGENTS.md`.

## 14. Entregas incrementales

1. Modelo puro de opciones, copy y tests.
2. Pantalla Practicar y cambio de navegación.
3. Sesión `mode=skill` y protección de la misión diaria.
4. Accesibilidad, responsive, navegador y limpieza final.

Cada entrega sube `?v=`, mantiene el árbol verde y se guarda en un commit de una sola intención.

## 15. Fuera de alcance

- Biblioteca completa de unidades.
- Panel de profesores.
- PWA y notificaciones.
- Nuevos tipos de ejercicio.
- Speaking con micrófono.
- Nuevos rewards, monedas o cofres.
- Rediseño profundo de otras pantallas.
- Recomendaciones de IA remota o modelos predictivos.

## 16. Criterios de aceptación

- `Practicar` abre un centro guiado y nunca inicia una sesión accidentalmente.
- Las tres rutas comunican propósito y disponibilidad real.
- Una misión diaria pendiente continúa siendo la acción prioritaria.
- `p12` usa conceptos infantiles y nunca presenta «Repasar errores».
- La variedad evita repetición sin desplazar una necesidad pedagógica superior.
- `p12/p34`, `p56` y `eso` cumplen su política lingüística.
- La práctica por habilidad registra aprendizaje sin modificar la misión diaria.
- Edad y CEFR permanecen independientes.
- Estados vacíos y fallos son honestos, accionables y accesibles.
- No aparecen rewards, monedas, rankings ni datos inventados.
- Toda la suite pasa y la comprobación visual cubre bandas y breakpoints definidos.
