# Interlanguage HOME — base de contenido escalable

- **Fecha:** 2026-08-17
- **Estado:** diseño aprobado; pendiente de revisión del documento por el owner
- **Ámbito:** esquema, validación, loader, packs y migración compatible del banco actual
- **Fuera de alcance:** nuevas mecánicas, nueva composición de sesión, rediseño del CMS y
  generación masiva de contenido

## 1. Objetivo

Separar el contenido editorial del motor para que Interlanguage HOME pueda crecer desde el
banco actual hasta 1.500 ejercicios o más sin convertir `contenido.js` en un archivo
monolítico ni crear páginas por ejercicio.

Este bloque establece el contrato que consumirán posteriormente el motor, la matriz, la
sesión pedagógica y el CMS. La plataforma continúa siendo HTML, CSS y JavaScript plano, sin
bundler ni dependencias nuevas.

## 2. Decisión arquitectónica

Se adopta un registro de packs JavaScript con carga coordinada:

1. `content/schema.js` normaliza y valida unidades, objetivos y ejercicios.
2. `content/loader.js` mantiene el registro, carga los packs declarados y ensambla el banco.
3. `content/manifest.js` enumera los packs publicados en un orden estable.
4. Cada pack llama a `ILContent.registerPack(pack)` y no muta directamente
   `window.IL_CONTENIDO`.
5. `contenido.js` conserva el rol de entrada compatible: crea inmediatamente una fachada
   `{ unidades: [] }`, inicia la carga, fusiona el contenido local del CMS y publica una
   promesa `ILContent.ready`.
6. Los consumidores actuales esperan `ILContent.ready` antes de leer las unidades.

La fachada `window.IL_CONTENIDO` y la forma `unidades[].ejercicios[]` se mantienen para no
romper Home, lección ni las integraciones actuales. El banco canónico añade objetivos y
metadatos normalizados, pero el loader proyecta los aliases heredados que todavía necesite
el motor.

## 3. Estructura inicial

```text
plataforma/content/
  schema.js
  loader.js
  manifest.js
  p12/
    school.js
  p34/
    daily-routine.js
    food.js
  p56/
    daily-routine.js
    food.js
  shared/
    primary-core.js
  eso/
    future-plans.js
```

La organización final de temas podrá crecer sin cambiar el loader. `shared/` alberga
contenido que ya es apto para más de una banda; la matriz seguirá decidiendo su adecuación
final. No se duplicará contenido solo para llenar carpetas: cada ejercicio actual tendrá
una única fuente editorial y conservará su ID.

## 4. Modelo de pack

Un pack es una unidad publicable y versionable:

```js
{
  id: "p12-school-core",
  version: 1,
  stages: ["p12"],
  topic: "school",
  units: [],
  objectives: [],
  exercises: []
}
```

- `id` es globalmente único.
- `version` es un entero positivo para migraciones futuras.
- `stages` es un array no vacío de `p12`, `p34`, `p56` o `eso`.
- `topic` usa un slug editorial estable.
- Las relaciones se expresan por IDs, no por posición en arrays.

Un pack puede contener más de una unidad del mismo tema. Cada registro debe declarar una
banda incluida en `stages`; los packs compartidos permiten varias bandas sin copiar el
ejercicio ni mutarlo implícitamente.

## 5. Esquema canónico

### Unidad

- `id`, `title`, `stage`, `topic`, `cefr`, `description`;
- `objective_ids` en orden editorial;
- `theme` con claves de icono/visual y token de color, nunca emoji o hex nuevo de interfaz.

### Objetivo

- `id`, `unit_id`, `stage`, `cefr`, `skill`, `difficulty`;
- `description`, `prerequisites`, `tags`;
- `literacy_load`: `none`, `low`, `medium` o `high`;
- indicadores `requires_audio`, `requires_visual` y `requires_writing`.

### Ejercicio

Cada ejercicio admite:

- `id`, `unit_id`, `objective_id`;
- `template`, `variant`, `visual_style`;
- `stage`, `age_min`, `age_max`, `cefr`, `skill`, `difficulty`;
- `literacy_load`, `requires_audio`, `requires_visual`, `requires_writing`;
- `instruction`, `instruction_audio`, `stimulus`;
- `options`, `answer`, `accepted_answers`;
- `hint`, `explanation`, `learned_expressions`;
- `prerequisites`, `tags`, `variant_group`.

En unidades, objetivos y ejercicios, `stage` admite una banda o un array de bandas y se
normaliza internamente a un array. `difficulty` se normaliza a una escala entera 1–5.
`prerequisites`, `tags`, `learned_expressions` y `accepted_answers` son arrays, aunque
estén vacíos. `variant_group`
identifica ejercicios diferentes que practican el mismo objetivo con ejemplos o mecánicas
alternativas.

## 6. Compatibilidad con el formato actual

El normalizador reconoce durante la migración:

| Campo heredado | Campo canónico |
|---|---|
| `tipo` | `template` mediante mapa de plantillas |
| `habilidad` | `skill` |
| `nivel` | `cefr` |
| `edad: [min,max]` | `age_min`, `age_max` |
| `instruccion` | `instruction` |
| `audio` | `instruction_audio` |
| `estimulo` | `stimulus` |
| `opciones` | `options` |
| `respuesta` | `answer` |
| `explicacion` | `explanation` |
| `feedback.learnedExpressions` | `learned_expressions` |

El loader puede proyectar de nuevo los campos heredados cuando el motor actual los
necesite. Esa proyección queda centralizada; los packs nuevos solo escriben el formato
canónico.

La migración no cambia textos, respuestas, opciones ni comportamiento de los ejercicios
existentes. Los metadatos que no puedan inferirse con seguridad se completan de forma
explícita durante la migración, no mediante suposiciones en tiempo de ejecución.

## 7. Validación

La validación devuelve un resultado estructurado:

```js
{
  valid: false,
  errors: [{ code, path, message }],
  warnings: [{ code, path, message }]
}
```

### Errores bloqueantes

- ID ausente, inválido o duplicado;
- referencia a unidad u objetivo inexistente;
- banda, CEFR, skill, literacy o dificultad inválidos;
- plantilla desconocida;
- ausencia de respuesta evaluable;
- cero o más de una respuesta correcta cuando la plantilla exige una;
- rango de edad invertido;
- tipo de dato incompatible con el esquema;
- registro que declara una etapa fuera de las etapas publicadas por su pack.

### Advertencias editoriales

- `variant_group` ausente cuando hay varias variantes del objetivo;
- pista, explicación o expresiones aprendidas ausentes;
- metadatos de audio/visual que no concuerdan con los campos presentes;
- objetivo sin suficientes variantes;
- texto potencialmente largo para la banda, a falta de la puerta editorial completa.

Las reglas pedagógicas de máximo de opciones, literacy por edad y soporte obligatorio se
añadirán a `matriz.js` en el subsistema siguiente. El schema solo valida coherencia
estructural y vocabularios controlados, evitando duplicar políticas.

## 8. Carga y estados de error

`ILContent.load()` carga los scripts del manifest, espera sus registros, valida el conjunto
y ensambla el banco. Las cargas simultáneas comparten la misma promesa y no duplican packs.

`ILContent.ready` resuelve con el banco compatible. Si un pack falla:

- en desarrollo/demo, el error conserva código, URL y detalle para diagnóstico;
- un pack estructuralmente inválido no se publica parcialmente;
- los demás packs válidos pueden ensamblarse, pero `ready` informa el estado degradado;
- las pantallas muestran su estado de contenido no disponible si el conjunto aplicable
  queda vacío;
- nunca se inventan ejercicios de sustitución.

El contenido local del CMS se trata como un pack no publicado, se normaliza y valida con la
misma API. Los registros inválidos se excluyen y quedan disponibles para que el futuro CMS
muestre los errores editoriales.

## 9. Consumidores

Se ajustan únicamente los puntos que leen contenido:

- `inicio.html` espera el banco antes de seleccionar la unidad de misión;
- `leccion.html` espera el banco antes de construir índices y pedir la sesión;
- `admin-contenido.html` usa el normalizador/validador al importar su contenido local;
- pruebas y demos del motor esperan `ILContent.ready` cuando carguen el banco completo.

Autenticación, mastery, estado de misión y Supabase no cambian en este bloque.

## 10. Pruebas

Se añaden tests Node sin dependencias para:

1. normalización de todos los campos heredados usados actualmente;
2. validación de pack, unidad, objetivo y ejercicio válidos;
3. IDs duplicados y referencias rotas;
4. ejercicio sin respuesta válida;
5. vocabularios controlados y rangos de edad;
6. idempotencia del registro y la carga;
7. ensamblado estable de múltiples packs;
8. proyección compatible `IL_CONTENIDO.unidades[].ejercicios[]`;
9. fusión segura del pack local del CMS;
10. migración del banco actual sin pérdida de ejercicios ni cambios de IDs.

Después de cada bloque se ejecutan todos los tests de `plataforma/` y `plataforma/motor/`.

## 11. Criterios de aceptación

1. `contenido.js` deja de contener el banco editorial monolítico.
2. El contenido actual vive en packs por etapa/tema y conserva sus IDs y comportamiento.
3. Existe un único schema, normalizador y loader reutilizable por aplicación y CMS.
4. `window.IL_CONTENIDO` continúa disponible tras `ILContent.ready` con la forma esperada.
5. Un pack inválido produce errores precisos y no contamina el banco publicado.
6. Home y lección funcionan en demo con el banco migrado.
7. No se añaden framework, bundler, dependencias, secretos ni datos ficticios reales.
8. Pasan todos los tests actuales y los nuevos tests de contenido.

## 12. Secuencia posterior

Con este contrato estable, los siguientes subsistemas se diseñarán por separado:

1. matriz editorial, mastery por objetivo, exposición y composición diaria;
2. catálogo de mecánicas, skins, drag accesible y speaking honesto;
3. CMS con preview/validación/publicación y biblioteca ampliada de assets;
4. ampliación editorial de calidad, objetivo por objetivo.
