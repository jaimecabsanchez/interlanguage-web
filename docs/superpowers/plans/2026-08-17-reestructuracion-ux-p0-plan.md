# Plan de implementación — reestructuración UX/UI P0

> Especificación: `docs/superpowers/specs/2026-08-17-reestructuracion-ux-p0-design.md`

## Resultado esperado

Interlanguage HOME conserva su arquitectura HTML/CSS/JS y todos sus contratos funcionales,
pero `data-stage` produce cuatro experiencias diferenciadas. Home concentra la atención en
la misión diaria y el test de nivel usa bancos y recorridos adecuados a cada banda.

## Reglas de ejecución

- Preservar e integrar los cambios locales existentes; revisar `git diff` antes de editar.
- No tocar `material-fuente/`, `archivo/`, contratos de Supabase ni almacenamiento.
- No duplicar navegación ni iconos fuera de `layout.js`.
- Usar únicamente colores `--il-*` y actualizar `?v=` al cambiar CSS o JavaScript.
- Ejecutar la suite completa después de cada bloque funcional.
- Hacer commits pequeños de una sola intención sin incluir cambios ajenos.

## Tarea 1 — Auditoría P0/P1/P2 y línea base

**Archivos:**

- Leer: todos los archivos enumerados en el encargo y documentos de `docs/` relevantes.
- Crear: `docs/audits/2026-08-17-ux-reestructuracion-p0-p1-p2.md`.

**Trabajo:**

1. Registrar hallazgos P0, P1 y P2 con evidencia de archivo/selector/función.
2. Identificar CSS inline, overrides contradictorios, dependencias entre pantallas y
   diferencias actuales entre `p12`, `p34`, `p56` y `eso`.
3. Inventariar los cambios locales solapados para evitar sobrescrituras.
4. Ejecutar la suite completa como línea base y registrar resultados.
5. Comprobar Home y test actuales en modo demo, consola y viewports objetivo.

**Validación:** la auditoría distingue defectos actuales de mejoras propuestas, prioriza
riesgo de usuario y documenta la ausencia de `README-REVIEW.md`.

## Tarea 2 — Contrato de tokens de experiencia

**Archivos:**

- Modificar: `plataforma/design-system.css`.
- Modificar consumidores de caché: HTML que carga `design-system.css`.

**Trabajo:**

1. Añadir valores base para los ocho tokens `--stage-*`.
2. Definir los valores de p12, p34, p56 y ESO bajo `data-stage`.
3. Hacer que los aliases generales de radio/táctil/escala consuman el contrato cuando sea
   seguro, manteniendo compatibilidad.
4. No introducir colores nuevos ni trasladar aún estilos específicos de pantallas P1.
5. Subir la versión de caché en todos los consumidores.

**Validación:** inspección computada de tokens en las cuatro bandas y suite completa.

## Tarea 3 — Configuración conductual centralizada

**Archivos:**

- Modificar: `plataforma/etapa.js`.
- Modificar: `plataforma/etapa.test.js`.
- Modificar consumidores de caché de `etapa.js`.

**Trabajo:**

1. Extender `BAND_EXPERIENCE` con densidad de Home, copy/idioma, intensidad visual y
   configuración de placement.
2. Mantener las propiedades y métodos públicos usados actualmente.
3. Exponer una lectura defensiva de la configuración por banda.
4. Añadir pruebas de los cuatro contratos: táctil, opciones, idioma, longitudes y modo
   adaptativo.
5. Actualizar `?v=` de todos los consumidores.

**Validación:** `node plataforma/etapa.test.js` y suite completa.

## Tarea 4 — Extraer la presentación de Home

**Archivos:**

- Crear: `plataforma/home.css`.
- Modificar: `plataforma/inicio.html`.

**Trabajo:**

1. Mover el CSS específico de Home desde `<style>` a `home.css` por grupos funcionales.
2. Conservar temporalmente solo las reglas inline cuya extracción eleve el riesgo.
3. Sustituir medidas repetidas por tokens `--stage-*`.
4. Corregir contradicciones con `age-mode.css` mediante selectores de etapa acotados, no
   reglas globales más agresivas.
5. Añadir el enlace versionado a `home.css`.

**Validación:** comparación visual antes/después sin cambio funcional y suite completa.

## Tarea 5 — Composición de Home por banda

**Archivos:**

- Modificar: `plataforma/inicio.html`.
- Modificar: `plataforma/home.css`.
- Solo si es imprescindible: `plataforma/layout.js`, `plataforma/shell.css` y sus
  consumidores de caché.

**Trabajo:**

1. Mantener una misión compartida con saludo, ruta, CTA y estados nueva/en curso/completa.
2. Limitar p12 a misión, cuatro pasos, semana y próximo premio.
3. Configurar p34 con semana, premio y como máximo una recomendación.
4. Configurar p56 con semana, logro y una recomendación personalizada.
5. Configurar ESO con copy principalmente inglés y jerarquía sobria.
6. Renderizar solo los bloques secundarios pertinentes cuando resulte más limpio que
   ocultarlos.
7. Aplicar el copy de CTA exacto por etapa y estado.
8. Limitar la pantalla a una ilustración protagonista y mostrar Nemo solo en un momento
   útil.
9. Conservar las llamadas actuales a progreso, misión, mastery y recompensas.

**Validación:** cuatro bandas × cuatro viewports, navegación, teclado, carga, vacío, error y
estados de misión; suite completa.

## Tarea 6 — Extraer y modularizar el test de nivel

**Archivos:**

- Crear: `plataforma/placement.css`.
- Crear: `plataforma/placement.js`.
- Crear: `plataforma/placement.test.js`.
- Modificar: `plataforma/test-nivel.html`.

**Trabajo:**

1. Extraer el CSS inline a `placement.css` y aplicar tokens de etapa.
2. Separar bancos, selección, puntuación y parada adaptativa del DOM en funciones puras.
3. Conservar en `test-nivel.html` la autenticación, redirecciones y llamada a
   `ILAuth.savePlacement`.
4. Definir bancos p12, p34, p56 y ESO con metadatos de nivel, skill y modalidad.
5. Reutilizar activos pedagógicos existentes; no inventar ilustraciones decorativas.
6. Proporcionar audio prioritario con fallback accesible para p12.
7. Mantener el formato CEFR interno que espera autenticación.

**Validación:** tests unitarios de bancos, límites, puntuación y adaptación; suite completa.

## Tarea 7 — Experiencia del test por edad

**Archivos:**

- Modificar: `plataforma/test-nivel.html`.
- Modificar: `plataforma/placement.css`.
- Modificar: `plataforma/placement.js`.
- Modificar: `plataforma/placement.test.js`.

**Trabajo:**

1. p12: 4–6 actividades Pre-A1, audio/imagen, hasta tres opciones y copy mínimo.
2. p34: 6–8 actividades Pre-A1/A1, visuales y lectura sencilla, hasta cuatro opciones.
3. p56: 8–10 actividades A1/A2 de vocabulario, listening, grammar y reading.
4. ESO: recorrido A1–B1 con mínimo de evidencia y parada anticipada determinista.
5. No mostrar CEFR a p12/p34; usar etiquetas comprensibles sin alterar el valor guardado.
6. Localizar progreso, CTA y resultado para ESO en inglés principalmente.
7. Verificar que fallo o ausencia de audio no bloquee el recorrido.

**Validación:** recorridos de todo correcto, todo incorrecto, mixto, parada temprana y fallo
de audio; teclado y lector semántico; suite completa.

## Tarea 8 — Verificación integral y cierre de P0

**Archivos:**

- Modificar la auditoría con resultados finales.
- Modificar documentación solo si la implementación revela una decisión nueva.

**Trabajo:**

1. Ejecutar:

   ```bash
   node plataforma/*.test.js
   node plataforma/motor/*.test.js
   ```

2. Servir la raíz en `http://localhost:8752` y validar demo con recarga sin caché.
3. Comprobar Home y test en 390×844, 768×1024, 820×1180 y 1440×900.
4. Validar consola, foco, navegación, movimiento reducido y targets táctiles.
5. Revisar `git diff --check`, versiones `?v=`, colores literales nuevos y navegación
   duplicada.
6. Documentar archivos modificados, arquitectura final, defectos corregidos, decisiones y
   pruebas ejecutadas.

**Criterio de cierre:** se cumplen los siete criterios de aceptación de la especificación,
todos los tests pasan y no quedan defectos P0 conocidos.

## Orden de commits previsto

1. `Audita la reestructuración UX por prioridades`
2. `Centraliza tokens de experiencia por etapa`
3. `Expone configuración UX de las cuatro bandas`
4. `Extrae los estilos específicos de Inicio`
5. `Adapta Inicio a las cuatro experiencias`
6. `Separa el motor del test de nivel`
7. `Adapta el test de nivel por edad`
8. `Documenta la validación de P0`
