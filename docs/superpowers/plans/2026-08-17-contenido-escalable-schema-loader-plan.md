# Plan de implementación — base de contenido escalable

> Especificación: `docs/superpowers/specs/2026-08-17-contenido-escalable-schema-loader-design.md`

## Resultado esperado

El banco actual deja de vivir dentro de `contenido.js`, se registra desde packs validados y
continúa llegando a Home y Lección mediante `window.IL_CONTENIDO`. No cambian textos, IDs,
respuestas ni comportamiento de los ejercicios actuales.

## Reglas de ejecución

- Preservar todos los cambios locales y revisar el diff antes de cada edición.
- Trabajar con JavaScript clásico compatible con navegador y Node; sin bundler ni paquetes.
- Escribir tests antes o junto a cada unidad pura de lógica.
- No modificar todavía matriz, mastery, sesión pedagógica, mecánicas o diseño del CMS.
- Actualizar `?v=` de cada JavaScript modificado en todos sus consumidores.
- Ejecutar todos los tests tras cada bloque funcional.

## Tarea 1 — Caracterizar el banco heredado

**Archivos:**

- Crear: `plataforma/content-migration.test.js`.
- Leer: `plataforma/contenido.js`, `plataforma/inicio.html`, `plataforma/leccion.html`,
  `plataforma/admin-contenido.html`, `plataforma/motor/demo-motor.html`.

**Trabajo:**

1. Capturar como invariantes el número de unidades y ejercicios, IDs, orden, tipos y
   respuestas actuales.
2. Inventariar todos los campos heredados usados realmente por motor, misión y Home.
3. Añadir una prueba que falle si la futura migración pierde o duplica un ID.
4. Registrar qué unidades son compartidas entre bandas para no duplicarlas.

**Validación:** la prueba caracteriza el banco actual sin cambiar producción.

## Tarea 2 — Implementar el schema y normalizador

**Archivos:**

- Crear: `plataforma/content/schema.js`.
- Crear: `plataforma/content/schema.test.js`.

**Trabajo:**

1. Implementar vocabularios controlados, helpers de IDs y resultado de validación.
2. Normalizar pack, unidad, objetivo y ejercicio sin mutar el input.
3. Mapear los campos heredados a los canónicos y proyectar aliases compatibles.
4. Validar respuestas de selección, ordenación, matching, comprensión y speaking actuales.
5. Separar errores bloqueantes de advertencias editoriales.
6. Exportar la misma API mediante `module.exports` y `window.ILContentSchema`.

**Pruebas:** formato válido, campos heredados, datos inmutables, ID inválido, rango de edad,
respuesta ausente, vocabularios y referencias locales.

## Tarea 3 — Implementar registro y ensamblado

**Archivos:**

- Crear: `plataforma/content/loader.js`.
- Crear: `plataforma/content/loader.test.js`.

**Trabajo:**

1. Implementar `registerPack`, `reset`, `assemble`, `load` y la promesa compartida `ready`.
2. Rechazar IDs globales duplicados y referencias rotas entre unidad, objetivo y ejercicio.
3. Garantizar registro idempotente del mismo pack/version.
4. Ensamblar un banco canónico y su fachada heredada con orden determinista.
5. Exponer errores/advertencias y estado degradado sin publicar registros inválidos.
6. Mantener la carga DOM separada del ensamblado puro para probar Node sin navegador.

**Pruebas:** múltiples packs, duplicados, idempotencia, orden, fallo parcial y fachada
compatible.

## Tarea 4 — Crear manifest y packs migrados

**Archivos:**

- Crear: `plataforma/content/manifest.js`.
- Crear packs bajo `plataforma/content/p12/`, `shared/` y `eso/`.
- Modificar: `plataforma/content-migration.test.js`.

**Trabajo:**

1. Extraer `primer-vuelo` a un pack p12.
2. Extraer `rutina-diaria` y `la-comida` a packs compartidos de Primaria.
3. Extraer `future-plans` a un pack ESO.
4. Crear objetivos explícitos y asignar cada ejercicio a uno sin alterar sus IDs.
5. Completar stage, dificultad, literacy y requisitos mediante decisiones editoriales
   explícitas.
6. Sustituir iconos/colores editoriales heredados solo cuando contradigan reglas existentes,
   sin rediseñar la presentación.
7. Declarar los packs en orden estable en el manifest.

**Validación:** la caracterización confirma igualdad de IDs, orden, textos, opciones y
respuestas; todos los packs pasan schema.

## Tarea 5 — Convertir `contenido.js` en entrada compatible

**Archivos:**

- Modificar: `plataforma/contenido.js`.
- Modificar: `plataforma/content/loader.js` y sus tests si la integración lo exige.

**Trabajo:**

1. Eliminar el banco editorial embebido.
2. Crear inmediatamente `window.IL_CONTENIDO = { unidades: [] }`.
3. Cargar manifest/packs una sola vez y reemplazar el contenido de la fachada al completar.
4. Convertir `localStorage.il_cms_content` en un pack local, normalizarlo y validarlo.
5. Mantener visibles los errores editoriales del pack CMS sin bloquear packs publicados.
6. Exponer `ILContent.ready` y estado diagnóstico estable.

**Validación:** carga repetida sin duplicados, CMS válido fusionado y CMS inválido aislado.

## Tarea 6 — Adaptar consumidores asíncronos

**Archivos:**

- Modificar: `plataforma/inicio.html`.
- Modificar: `plataforma/leccion.html`.
- Modificar: `plataforma/admin-contenido.html` solo para esperar/validar carga.
- Modificar: `plataforma/motor/demo-motor.html`.
- Modificar otros consumidores encontrados por `rg "IL_CONTENIDO|contenido.js"`.

**Trabajo:**

1. Incluir schema, loader, manifest y entrada con versiones coherentes.
2. Esperar `ILContent.ready` antes de crear índices o seleccionar unidades.
3. Mantener autenticación, estados de carga y mensajes de error actuales.
4. Mostrar contenido no disponible si la banda queda sin ejercicios; nunca usar datos
   inventados.
5. Evitar condiciones de carrera al abrir Home y Lección directamente.

**Validación:** acceso directo, recarga, vuelta desde sesión y modo demo sin errores de
consola.

## Tarea 7 — Integración mínima del CMS local

**Archivos:**

- Modificar: `plataforma/admin-contenido.html`.
- Añadir tests puros al schema/loader; no crear todavía el nuevo CMS.

**Trabajo:**

1. Validar la estructura que el formulario actual intenta guardar.
2. Mostrar un mensaje accionable si el registro local es inválido.
3. Conservar creación y persistencia actuales cuando el registro es válido.
4. No implementar todavía objetivos, preview, duplicación o publicación; pertenecen al
   subsistema CMS posterior.

**Validación:** unidad/ejercicio válido se conserva; respuesta ausente, visual ausente o ID
duplicado se rechazan sin corromper el banco.

## Tarea 8 — Verificación y cierre

**Trabajo:**

1. Ejecutar cada archivo de test de forma individual con Node.
2. Ejecutar `git diff --check` y buscar IDs duplicados, colores literales nuevos, emojis de
   interfaz y versiones de caché obsoletas.
3. Servir la raíz y comprobar Home, Lección, demo del motor y CMS.
4. Verificar los cuatro selectores de etapa con el mismo número de ejercicios aptos que
   antes de la migración.
5. Documentar archivos modificados, arquitectura, compatibilidad, tests y riesgos restantes.

**Criterio de cierre:** todos los criterios de aceptación de la especificación se cumplen y
no falla ningún test actual o nuevo.

## Orden de commits previsto

1. `Caracteriza el banco de contenido actual`
2. `Añade el esquema canónico de contenido`
3. `Implementa el registro y ensamblado de packs`
4. `Migra el banco actual a packs por etapa`
5. `Convierte contenido en un loader compatible`
6. `Espera la carga de contenido en sus consumidores`
7. `Valida el contenido local del CMS`
8. `Documenta la verificación del loader de contenido`
