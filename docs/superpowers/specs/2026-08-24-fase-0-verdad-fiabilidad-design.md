# Interlanguage HOME — Fase 0: verdad, fiabilidad y seguridad

Fecha: 2026-08-24

## Alcance

Esta fase corrige fuentes de verdad, persistencia, evaluación, audio, observabilidad y bloqueos de accesibilidad. Mantiene la UI actual y excluye rediseños, economía, achievements nuevos, contenido nuevo, speaking con IA y PWA compleja.

## Decisiones

### 1. Evento de intento canónico

Cada envío del alumno genera un evento inmutable. El `id` del evento es estable y sirve para deduplicar sincronizaciones. Se reutilizan `attempts.response`, `attempt_no`, `hint_used`, `duration_ms`, `created_at` y las FK existentes; una migración añade claves editoriales de texto y metadatos que el banco estático necesita.

Campos canónicos de cliente:

- `attempt_id`, `student_id`, `session_id` y `client_session_key`;
- `exercise_id`, `objective_id`, `variant_id`;
- `age_band`, `cefr`, `skill`, `content_version`;
- `attempt_number`, `answer`, `correct`, `hint_used`, `audio_replays`;
- `started_at`, `submitted_at`, `response_time_ms`, `mode`;
- `technical_failure` y `failure_type`.

Un fallo técnico es un evento `skipped`, no un intento lingüístico. No entra en precisión, mastery ni perfect.

### 2. Proyección de sesión

Por ejercicio:

- `first_try_correct = true` solo si el primer intento evaluable fue correcto, sin hint y sin fallo técnico;
- `eventual_success = true` si algún intento evaluable terminó correcto;
- una secuencia `wrong → correct` produce `false/true`;
- una secuencia `wrong → wrong → correct` produce `false/true`.

La sesión es perfecta únicamente si todos los ejercicios planificados son evaluables, todos tienen `first_try_correct = true`, no se usó ninguna ayuda invalidante y no hubo fallo técnico. La proyección de rewards consume este resumen; nunca se persiste “+10” como evento de aprendizaje.

### 3. Compatibilidad y sincronización

El cliente conserva una cola local acotada como caché/outbox. En producción, el servidor es la fuente canónica después de sincronizar. Los eventos usan IDs idempotentes para que reintentar no duplique datos.

El estado diario local se migra de v1 a v2 al leerlo. Se conservan claves antiguas y datos previos; no hay borrados.

### 4. Placement

`student_placements` guarda resultados versionados con alumno, CEFR aproximado, instrumento, versión, banda, confianza, fecha y metadatos. `localStorage` queda como caché. Un placement antiguo local se conserva y se intenta sincronizar de forma segura cuando existe sesión real.

El test actual se identifica como `legacy-eight-question` v1 y comunica nivel aproximado. La UX adaptativa definitiva queda fuera de esta fase.

### 5. Mastery

Los eventos son la evidencia primaria. `exercise_mastery` es una proyección servidor por alumno × clave editorial de ejercicio, con objetivo, skill, estado, evidencia, recuento, primer/último resultado y próxima revisión. La tabla `mastery` actual permanece intacta para contenido UUID.

El `mastery-store.js` local sigue funcionando como caché y migra sin pérdida. Cada intento evaluable actualiza local y solicita upsert servidor. Los fallos técnicos se ignoran.

### 6. Actividad, habilidades y familia

- Actividad semanal usa sesiones `completed=true` y la columna canónica `date`.
- El desglose de habilidades usa primero `exercise_mastery.skill`; puede leer `mastery → objectives(skill_id)` como compatibilidad.
- Toda lectura devuelve estado `available`, `empty` o `error`, además de `source`, `period`, `sample` y `sufficient` cuando aplica.
- Demo puede usar fixtures marcados `source=demo`.
- Real sin evidencia devuelve valores nulos y copy de información insuficiente.

No se mostrará un porcentaje por habilidad con menos de cinco evidencias evaluables para esa habilidad. El umbral es explícito y ajustable.

### 7. Audio

Orden de reproducción:

1. `audio_src` editorial mediante `HTMLAudioElement`;
2. SpeechSynthesis como fallback;
3. estado técnico no penalizador.

El control conserva play/replay/loading/error/reintentar. Si listening no dispone de audio, se ofrece “continuar sin penalización”; no se revela el texto como sustituto medido ni se registra error lingüístico.

### 8. Observabilidad

Un módulo pequeño registra categorías estructuradas: `data_unavailable`, `network_failure`, `technical_failure` e `invalid_data`. En demo/desarrollo escribe en consola y mantiene un buffer local acotado sin respuestas del alumno ni secretos. En producción permite inspección local y deja un punto de extensión para un colector futuro.

### 9. Contenido canónico

La fuente editorial es `content/manifest.js` + packs validados por `content/schema.js` y ensamblados por `content/loader.js`. `contenido.js` es una fachada de compatibilidad y registra opcionalmente el overlay `il_cms_content`; no es un segundo banco canónico.

El test de migración conservará fingerprints de los 25 ejercicios históricos y, por separado, validará el inventario canónico completo. Así protege migración sin congelar el banco en 25.

### 10. Accesibilidad P0

Se corrigen únicamente:

- badge externo que tapa la barra móvil;
- texto pequeño con contraste inferior a AA;
- targets que bloquean una acción crítica;
- estados de audio accesibles y salida no penalizadora.

## Migración aditiva

La migración nueva:

1. amplía `attempts` y `practice_sessions` con columnas nullable/default seguras;
2. crea `student_placements` y `exercise_mastery`;
3. añade índices, restricciones y RLS equivalentes a las tablas actuales;
4. crea una vista de resumen de intentos/sesión si resulta estable;
5. no borra columnas, tablas ni filas.

Rollback razonable: dejar de usar las columnas/tablas nuevas. La migración no incluye secretos ni `service_role`.

## Manejo de errores

- Error de red al escribir: evento queda en outbox y la UI continúa; se informa a observabilidad.
- Error de datos: no se inventa una métrica; se devuelve `error/unavailable`.
- Ausencia de actividad: se devuelve `empty`, no `error`.
- Audio: se reintenta; si no funciona, evento técnico y salida sin penalización.
- Persistencia de placement: la caché se conserva, pero el resultado declara si está sincronizado.

## Pruebas de aceptación

Se cubrirán explícitamente: correct first try; wrong→correct; wrong→wrong→correct; fallo técnico de audio; sesión perfecta; eventual success no perfecto; demo vs real insuficiente; placement remoto/caché; mastery local/remoto compatible; consulta semanal; skill breakdown; migración de contenido. La suite completa debe quedar verde.

## No incluido

No se modifican jerarquía de Inicio, presentación de Progreso, Perfil, Mundo, catálogo de rewards, contenido editorial, animaciones ni economía. Tampoco se aplica la migración a un proyecto remoto desde este repositorio: se entrega SQL listo y probado estáticamente para aplicarlo mediante el flujo habitual de Supabase.
