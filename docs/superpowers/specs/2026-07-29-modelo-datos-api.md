# Modelo de datos inicial y API del MVP

**Fecha:** 2026-07-29 · **Estado:** borrador para aprobación.
Base: arquitectura técnica (Stack A · Postgres/Supabase + RLS), RBAC, arquitectura pedagógica y catálogo/motor.
Amplía el `supabase/schema.sql` actual (profiles + progress), que queda subsumido aquí.

## Convenciones (para todas las tablas)
- **PK** `id uuid` (por defecto `gen_random_uuid()`), salvo tablas de enlace con clave compuesta.
- **Auditoría mínima** en casi todas: `created_at timestamptz default now()`, `updated_at timestamptz`,
  y donde aplique `created_by uuid` (→ `users.id`).
- **Borrado:** por defecto **soft-delete** (`deleted_at timestamptz null`) en datos con valor histórico o de
  menores; **hard-delete** solo en tablas de enlace o efímeras. Ver "política" por entidad.
- **Seguridad:** todo con **RLS activada**; el acceso real lo definen las políticas (§API/autorización). La
  escritura sensible (crear alumnos, resetear claves) va por **Edge Function** con `service_role`, no desde el navegador.
- **Región UE** (RGPD). Datos de menores minimizados: guardar **lo imprescindible**.
- **Naming:** `snake_case`, tablas en plural, FK como `<entidad>_id`.
- **Estados/roles como `text` + CHECK** (o enum Postgres) para legibilidad y validación.

---

## A. Identidad, acceso y organización

### 1. `users` (cuenta de acceso)
Extiende `auth.users` de Supabase (login/contraseña cifrada los gestiona Supabase Auth).
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | = `auth.users.id` |
| `username` | text unique | código de acceso (alumno) o email de adulto |
| `display_name` | text | nombre visible |
| `status` | text CHECK(active/suspended/pending) | |
| `must_change_password` | bool default true | fuerza cambio en primer acceso |
| `last_login_at` | timestamptz | |
| `deleted_at` | timestamptz null | soft-delete/anonimización |
- **Relaciones:** 1–N con `user_roles`, `sessions`, `consents`, `audit_log`. 1–1 opcional con `students`/`teachers`.
- **Restricciones:** `username` único; email real solo para adultos (el alumno usa código → pseudo-email interno).
- **Índices:** `username`, `status`.
- **Datos sensibles:** credenciales (las guarda Auth, cifradas; **no** las tocamos), `last_login_at`.
- **Eliminación/anonimización:** al dar de baja → **anonimizar** (`display_name`='Usuario', `username` rotado,
  `deleted_at`), conservando referencias para integridad de auditoría. Hard-delete solo tras retención legal.

### 2. `roles`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | text PK | `family` · `student` · `teacher` · `admin` |
| `description` | text | |
- **Datos:** catálogo fijo (semilla). Sin datos sensibles. Sin borrado.

### 3. `user_roles` (N–M usuario↔rol, con ámbito)
| Campo | Tipo | Notas |
|---|---|---|
| `user_id` | uuid FK→users | |
| `role_id` | text FK→roles | |
| `scope_school_id` | uuid FK→schools null | rol acotado a un colegio (p. ej. teacher) |
- **PK compuesta** (`user_id`,`role_id`,`scope_school_id`). **Índice:** `user_id`.
- **Eliminación:** hard-delete (revocar rol). Registrar en `audit_log`.

### 4. `schools` (colegios/centros)
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `name` | text | |
| `code` | text unique | |
| `status` | text CHECK(active/inactive) | |
- **Relaciones:** 1–N `groups`, `enrollments`, alcance de `teacher`.
- **Sensibles:** ninguno especial. **Eliminación:** soft-delete (histórico de matrículas).

### 5. `families` (tutor legal)
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK→users null | cuenta familiar (Fase 2; en MVP puede ir sin login) |
| `contact_email` | text | para informes / enlace seguro |
| `contact_phone` | text null | opcional |
- **Relaciones:** 1–N `students` (vía `student_guardians`), `consents`.
- **Sensibles:** **email/teléfono del tutor (PII)**. **Eliminación:** anonimizar contacto al baja; conservar
  vínculo de consentimientos por obligación legal el tiempo de retención, luego purgar.

### 6. `students` (alumno, menor)
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK→users unique | su cuenta de acceso |
| `first_name` | text | **minimizar**: nombre de pila, sin apellidos si no es imprescindible |
| `birth_year` | int null | año (no fecha exacta) → edad aproximada sin exceso de PII |
| `level_id` | uuid FK→levels null | nivel real actual |
| `course_ref` | text null | curso escolar de referencia |
| `avatar_choice` | text null | cosmético (no foto real) |
| `notes` | text null | notas del profe (mínimas) |
| `deleted_at` | timestamptz null | |
- **Relaciones:** N–M con `families` (`student_guardians`), `groups` (`group_members`); 1–N `attempts`,
  `progress`, `streaks`, `assignments`, `student_rewards`.
- **Restricciones:** `user_id` único. **Índices:** `level_id`, `deleted_at`.
- **Sensibles:** **datos de menor (PII)** → máxima minimización, sin foto, sin dirección. `notes` sensible.
- **Eliminación:** **anonimización** al baja o a fin de contrato (nombre→alias, `birth_year`→null, `notes`
  borradas); progreso agregado puede conservarse **anonimizado** para estadística. Hard-delete a petición (RGPD).

### 7. `student_guardians` (N–M alumno↔familia)
| `student_id` uuid | `family_id` uuid | `relation` text (madre/padre/tutor) | **PK compuesta** |
- Hard-delete. Sensible: revela vínculo familiar del menor.

### 8. `teachers`
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK→users unique | |
| `full_name` | text | |
| `school_id` | uuid FK→schools null | |
- **Relaciones:** 1–N `groups` (imparte), autor en `activities`/`assignments`.
- **Sensibles:** PII de adulto (empleado). **Eliminación:** soft-delete; conservar autoría de contenidos.

### 9. `admins`
Se modela como **rol** (`user_roles` con `admin`), no como tabla aparte. Opcional `admins` si hace falta
metadata (departamento). MVP: solo rol.

### 10. `groups` (grupos/clases)
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `school_id` | uuid FK→schools null | |
| `teacher_id` | uuid FK→teachers null | |
| `name` | text | |
| `level_id` | uuid FK→levels null | nivel de referencia del grupo |
| `status` | text CHECK(active/archived) | |
- **Relaciones:** N–M `students` (`group_members`), 1–N `assignments`.
- **Índices:** `school_id`, `teacher_id`. **Eliminación:** soft-delete (archivar), conserva histórico.

### 11. `group_members` (N–M grupo↔alumno)
| `group_id` uuid | `student_id` uuid | `joined_at` timestamptz | `left_at` timestamptz null | **PK** (group_id,student_id) |
- Soft-leave (`left_at`). Sensible: pertenencia del menor a un grupo.

### 12. `plans` (planes de suscripción)
| Campo | Tipo | Notas |
|---|---|---|
| `id` | text PK | `premium_home` etc. |
| `name` · `description` | text | |
| `price_month` | numeric | |
| `features` | jsonb | qué incluye |
| `active` | bool | |
- Catálogo. Sin PII. Sin borrado (desactivar).

### 13. `enrollments` (matrícula / acceso al plan)  *(«Matrículas» + «Permisos de acceso»)*
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `student_id` | uuid FK→students | |
| `plan_id` | text FK→plans | |
| `school_id` | uuid FK→schools null | |
| `status` | text CHECK(active/paused/expired/cancelled) | controla el **acceso real** a la plataforma |
| `starts_on` · `ends_on` | date | **vigencia** del acceso (la familia ve la caducidad) |
- **Relaciones:** define si el alumno puede entrar hoy. **Índices:** `student_id`,`status`,`ends_on`.
- **Sensibles:** vinculado a facturación (la facturación en sí **fuera** del MVP). **Eliminación:** soft
  (histórico); no borrar (necesario para saber qué acceso hubo).

### 14. `consents` (consentimientos RGPD)  *(crítico para menores)*
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `student_id` | uuid FK→students | |
| `family_id` | uuid FK→families | quién consiente (tutor) |
| `type` | text CHECK(data_processing/audio_recording/media/comms) | tipo de consentimiento |
| `granted` | bool | |
| `granted_at` | timestamptz | |
| `revoked_at` | timestamptz null | |
| `policy_version` | text | versión de la política aceptada |
| `evidence` | jsonb | traza (cómo/cuándo, sin exceso) |
- **Restricción:** speaking/audio (P9) **requiere** `audio_recording=granted` vigente.
- **Sensibles:** **muy sensible** (base legal del tratamiento del menor). **Eliminación:** **conservar** durante
  el periodo de retención legal aun tras baja; luego purga controlada. Nunca borrado silencioso.

### 15. `sessions` (sesiones de acceso / dispositivo)  *(«Sesiones»)*
La sesión de **autenticación** la gestiona Supabase Auth (tokens). Esta tabla es para **trazabilidad/seguridad**:
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK→users | |
| `started_at` · `last_seen_at` | timestamptz | |
| `ip_hash` | text | **IP hasheada**, no en claro (minimización) |
| `user_agent` | text | |
| `revoked_at` | timestamptz null | |
- **Índices:** `user_id`, `last_seen_at`. **Sensibles:** IP (por eso **hash**), UA. **Eliminación:** purga por
  antigüedad (p. ej. 90 días); no valor histórico largo.
- **Nota:** ojo, esto es distinto de la **sesión diaria de práctica** (ver `practice_sessions`, entidad 27).

### 16. `audit_log` (auditoría)  *(«Auditoría»)*
| Campo | Tipo | Notas |
|---|---|---|
| `id` | bigint identity PK | |
| `actor_user_id` | uuid FK→users null | quién |
| `action` | text | p. ej. `student.create`, `password.reset`, `content.publish` |
| `entity` · `entity_id` | text·uuid | sobre qué |
| `metadata` | jsonb | detalle mínimo (sin PII innecesaria) |
| `created_at` | timestamptz | |
- **Índices:** `actor_user_id`, `entity`, `created_at`. **Append-only** (no update/delete).
- **Sensibles:** puede referenciar acciones sobre menores → sin volcar PII en `metadata`.
- **Eliminación:** retención larga por seguridad; purga por política (p. ej. 1–2 años).

---

## B. Currículo y contenido

### 17. `courses` (cursos escolares de referencia)
| `id` uuid PK | `name` text ("4.º Primaria") | `stage` text (primaria/eso) | `order` int |
- Catálogo. Sin PII. Sin borrado (el curso es referencia, no destino — ver arquitectura pedagógica).

### 18. `levels` (niveles reales)
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `name` | text | "Explorer 2" |
| `cefr` | text CHECK(preA1/A1/A2/B1/B2) | referencia interna |
| `order` | int | secuencia |
- **Relaciones:** referido por `students`, `groups`, `units`, `activities`. Catálogo. Soft-delete.

### 19. `skills` (habilidades)
| `id` text PK (vocabulary/listening/reading/grammar/writing/pronunciation/speaking/everyday/study_abroad) | `name` text | `active_mvp` bool |
- Catálogo fijo (semilla). Sin borrado.

### 20. `units` (unidades)
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `level_id` | uuid FK→levels | |
| `title` | text | "Mi rutina diaria" |
| `theme` | text null | |
| `order` | int | |
| `status` | text CHECK(draft/review/published/archived) | flujo editorial |
| `created_by` | uuid FK→users | |
- **Índices:** `level_id`,`status`,`order`. Soft-delete (`archived`). Sin PII.

### 21. `objectives` (objetivos can-do)  *(«Objetivos»)*
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `unit_id` | uuid FK→units | |
| `skill_id` | text FK→skills | |
| `can_do` | text | "Sé decir a qué hora hago las cosas" |
| `difficulty` | int CHECK(1..5) | |
| `prerequisites` | uuid[] | objetivos/unidades previos (o tabla `objective_prereqs`) |
| `order` | int | |
- **Es la unidad real de aprendizaje.** `progress`/`mastery` se miden **por objetivo**.
- **Índices:** `unit_id`,`skill_id`. Soft-delete. Sin PII.

### 22. `activities` (actividades = ejercicios)  *(«Actividades»)*
Un ejercicio = **plantilla (P1–P9) + datos** (esquema común del catálogo).
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `objective_id` | uuid FK→objectives | |
| `template` | text CHECK(p1..p9) | plantilla del motor |
| `level_id` | uuid FK→levels | |
| `skill_id` | text FK→skills | |
| `title` | text | interno/CMS |
| `instruction` | text | consigna |
| `instruction_audio_id` | uuid FK→media null | consigna en voz |
| `stimulus` | jsonb null | texto/imagen/audio de apoyo (refs a `media`) |
| `data` | jsonb | carga específica de la plantilla (para P-simples; P7 usa `questions`) |
| `hints` | jsonb | pistas progresivas |
| `explanation` | text null | se muestra al fallar |
| `max_attempts` | int null | null = ilimitado con reintento |
| `feedback` | jsonb | mensajes/animación |
| `difficulty` | int CHECK(1..5) | |
| `age_min` · `age_max` | int null | |
| `tags` | text[] | búsqueda/reutilización |
| `status` | text CHECK(draft/review/published/archived) | flujo editorial |
| `version` | int default 1 | versionado |
| `ai_assisted` | bool default false | trazabilidad IA |
| `created_by` · `reviewed_by` | uuid FK→users | autoría/revisión |
- **Relaciones:** 1–N `questions` (para P7 y multi-ítem), N `media` (vía refs en jsonb o `activity_media`).
- **Índices:** `objective_id`,`template`,`status`,`level_id`,`skill_id`, **GIN** en `tags` y en `data`.
- **Sensibles:** ninguno (contenido). **Eliminación:** **nunca hard-delete** de publicado → `archived` + nueva
  `version` (auditoría y no romper `attempts` históricos).

### 23. `questions` (preguntas / subpreguntas)  *(«Preguntas»)*
Para P7 (comprensión: estímulo + varias subpreguntas) y para actividades multi-ítem.
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `activity_id` | uuid FK→activities | |
| `prompt` | text | enunciado |
| `sub_template` | text CHECK(p1/p2/p6) | tipo de la subpregunta |
| `order` | int | |
| `explanation` | text null | |
- **Índices:** `activity_id`. Se archiva con su actividad. Sin PII.

### 24. `options` (opciones de respuesta)  *(«Opciones»)*
Para P1/P2/emparejar… (las opciones elegibles).
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `question_id` | uuid FK→questions null | o directo a `activity_id` en P-simples |
| `activity_id` | uuid FK→activities null | |
| `label` | text | texto de la opción |
| `media_id` | uuid FK→media null | imagen/emoji/audio |
| `order` | int | |
- **CHECK:** exactamente uno de (`question_id`,`activity_id`) no nulo.
- **La "correcta" NO se marca aquí en claro para el cliente** → ver `answer_keys` (24b) para no filtrar la solución.

### 24b. `answer_keys` (respuestas correctas + alternativas)  *(«Respuestas»)*
Separada para poder **no enviarla al navegador** hasta validar (evita hacer trampas leyendo el HTML).
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `activity_id` | uuid FK→activities null | |
| `question_id` | uuid FK→questions null | |
| `correct` | jsonb | opción(es) / texto / orden / parejas correctas |
| `accepted` | jsonb | respuestas alternativas aceptadas (sinónimos, may/min, tildes) |
| `match_rule` | text | exact / tolerant / set / order |
- **Seguridad:** **solo accesible por servidor/validación** (RLS: nadie con rol student la lee). La validación
  del intento se hace en Edge Function o con política que no expone `answer_keys` al cliente.
- **Eliminación:** con la actividad (archivado + versión).

### 25. `media` (biblioteca multimedia)  *(«Contenido multimedia»)*
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `type` | text CHECK(audio/image) | |
| `storage_path` | text | ruta en Supabase Storage |
| `alt_text` | text | **obligatorio** (accesibilidad) |
| `transcript` | text null | obligatorio para audio |
| `duration_ms` · `bytes` | int null | |
| `license` | text null | origen/derechos |
| `tags` | text[] | reutilización |
| `status` | text CHECK(draft/review/published/archived) | |
| `created_by` | uuid FK→users | |
- **Índices:** `type`,`status`, **GIN** `tags`. **Reutilizable** entre actividades.
- **Sensibles:** en general no; **excepción**: audio de voz de menor (P9, Fase 3) → **muy sensible**, temporal,
  no se almacena por defecto y requiere `consents.audio_recording`.
- **Eliminación:** soft (archivar). Media de menor → borrado tras uso/retención mínima.

---

## C. Aprendizaje, progreso y recompensas

### 26. `attempts` (intentos)  *(«Intentos»)*
Cada respuesta del alumno a una actividad/pregunta = un evento (alimenta el modelo de dominio).
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `student_id` | uuid FK→students | |
| `activity_id` | uuid FK→activities | |
| `question_id` | uuid FK→questions null | |
| `objective_id` | uuid FK→objectives | desnormalizado para consultas rápidas |
| `result` | text CHECK(correct/incorrect/skipped) | |
| `attempt_no` | int | en qué intento acertó |
| `hint_used` | bool | |
| `response` | jsonb | lo que respondió (para análisis, sin PII) |
| `recovery_type` | text CHECK(recognition/production) | reconocer vs producir (pesa distinto) |
| `duration_ms` | int null | |
| `practice_session_id` | uuid FK→practice_sessions null | |
| `created_at` | timestamptz | timestamp del evento |
- **Índices:** `student_id`,`objective_id`,`activity_id`,`created_at`. Alto volumen → particionar por fecha (Fase 2).
- **Sensibles:** vinculado a menor (pseudonimizado por `student_id`). **Eliminación:** se **agrega/anonimiza** al
  dar de baja al alumno (conservar estadística sin identificar); purga fina por retención.

### 27. `practice_sessions` (sesión diaria de práctica)  *(«Sesión diaria»)*
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `student_id` | uuid FK→students | |
| `date` | date | día de práctica |
| `activities_planned` | jsonb | lo que el motor compuso (repaso+errores+nuevo) |
| `completed` | bool | |
| `correct_count` · `total_count` | int | |
| `started_at` · `finished_at` | timestamptz | |
- **Índices:** `student_id`,`date` (unique por día si se quiere 1 sesión/día). Alimenta racha y medallas.
- **Eliminación:** anonimizar con el alumno.

### 28. `progress` + `mastery` (progreso y dominio)  *(«Progreso» + «Dominio»)*
Estado por **alumno × objetivo** (arquitectura pedagógica). Amplía la `progress` actual (que hoy guarda
gems/streak/xp para la demo — se mantiene como vista/columnas del alumno).
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `student_id` | uuid FK→students | |
| `objective_id` | uuid FK→objectives | |
| `mastery_state` | text CHECK(new/practicing/almost/mastered/needs_review) | los 5 estados |
| `evidence_score` | numeric | evidencia acumulada (aciertos espaciados, producción pesa más) |
| `correct_days` | int | nº de días distintos con acierto (para umbral "Dominado") |
| `last_result` | text | |
| `next_review_at` | date | repetición espaciada (1·3·7·16) |
| `updated_at` | timestamptz | |
- **Restricción:** unique (`student_id`,`objective_id`). **Índices:** `student_id`,`next_review_at` (para "qué toca hoy").
- **Sensibles:** progreso de menor. **Eliminación:** anonimizar/agregar al baja.
- **Nota:** los contadores "de juego" del alumno (gems/xp/racha visible/tienda) pueden vivir en una tabla
  `student_state` 1–1 con `students` (deriva de aquí). La demo usa `progress` con esos campos.

### 29. `streaks` (rachas)  *(«Rachas»)*
| Campo | Tipo | Notas |
|---|---|---|
| `student_id` | uuid FK→students PK | 1–1 |
| `current` · `longest` | int | |
| `last_practice_date` | date | |
| `freezes_available` | int | comodines (racha flexible) |
| `frozen_until` | date null | congelado (vacaciones) |
- **Eliminación:** con el alumno.

### 30. `rewards` + `student_rewards` (recompensas/medallas)  *(«Recompensas»)*
`rewards` = catálogo; `student_rewards` = las que ha ganado el alumno.
| `rewards.id` text PK | `type` (badge/collection/unlock/cosmetic) | `name` | `criteria` jsonb | `family` (constancia/aciertos/mejora/dominio) |
| `student_rewards`: `student_id` uuid | `reward_id` text | `earned_at` timestamptz | **PK** (student_id,reward_id) |
- `rewards`: catálogo, sin PII, sin borrado. `student_rewards`: se conserva (colección); anonimizar con el alumno.

### 31. `assignments` (asignaciones)  *(«Asignaciones»)*
Profe asigna unidad/objetivo/actividad a alumno o grupo.
| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `assigned_by` | uuid FK→teachers | |
| `target_type` | text CHECK(student/group) | |
| `target_id` | uuid | student_id o group_id |
| `ref_type` | text CHECK(unit/objective/activity) | |
| `ref_id` | uuid | |
| `due_on` | date null | |
| `status` | text CHECK(active/done/cancelled) | |
- **Índices:** `target_type,target_id`,`assigned_by`. Soft-delete. Sin PII (referencia a menor por id).

---

## Diagrama de relaciones (resumen)
```
users ─1:N─ user_roles ─N:1─ roles
users ─1:1─ students / teachers / families
schools ─1:N─ groups ─N:M─ students (group_members)
families ─N:M─ students (student_guardians)
students ─1:N─ enrollments ─N:1─ plans
students ─1:N─ consents · attempts · progress · streaks · assignments · student_rewards · practice_sessions
levels ─1:N─ units ─1:N─ objectives ─1:N─ activities ─1:N─ questions ─1:N─ options
activities/questions ─1:1─ answer_keys        media ←refs─ activities/options/questions
attempts ─N:1─ activities/objectives          progress ─(student×objective)
audit_log (append-only)   sessions (auth trace)
```

---

## D. API / acciones principales (con autorización)

Regla base de autorización (RBAC + RLS): **student** solo ve/escribe **lo suyo**; **teacher** solo su
**colegio/grupos**; **family** solo **lectura** de sus alumnos (vía enlace seguro en MVP); **admin** todo.
Las acciones sensibles (crear alumno, reset, publicar) van por **Edge Function** con `service_role` + comprobación
de rol + registro en `audit_log`. Todo exige acceso vigente (`enrollments.status=active`) salvo login/admin.

### Autenticación
| Acción | Quién | Reglas |
|---|---|---|
| `POST /auth/login` | público | usuario+contraseña; bloqueo por intentos; devuelve token |
| `POST /auth/change-password` | usuario autenticado | obligatorio si `must_change_password`; valida fuerza |
| `POST /auth/logout` | autenticado | revoca sesión |
| `POST /auth/request-reset` (alumno) | family/teacher/admin | **no** self-service del menor; lo hace admin/profe → Edge Function |

### Perfil
| `GET /me` | autenticado | devuelve su perfil + rol; student ve su avatar/estado de juego |
| `PATCH /me` | autenticado | solo campos propios no sensibles (avatar, display); nunca rol/nivel |
| `GET /students/:id` | admin/teacher(su grupo)/family(su alumno) | RLS por pertenencia |

### Sesión diaria
| `GET /session/today` | student (propio) | el motor compone la sesión (repaso+errores+nuevo) según `progress`/`next_review_at` |
| `POST /session/:id/finish` | student (propio) | cierra sesión, actualiza racha/medallas |

### Actividades (jugar)
| `GET /activities/:id` | student (con acceso) / teacher-admin (preview) | **sin** `answer_keys` para student |
| `GET /objectives/:id/activities` | teacher/admin | listado (CMS/preview) |

### Intentos
| `POST /attempts` | student (propio) | valida contra `answer_keys` **en servidor**, emite evento, actualiza `progress`/`mastery`; escribe `attempts` |
| (nunca) leer answer_keys | — | ningún rol student puede leer la solución directamente |

### Progreso
| `GET /me/progress` | student (propio) | su dominio, racha, medallas, mapa |
| `GET /students/:id/progress` | teacher(su grupo)/admin/family(su alumno, lectura) | resumen sano (constancia/mejora/dominio, **sin nota**) |

### Administración (Edge Functions, admin/teacher acotado)
| `POST /admin/students` | admin (o teacher con permiso) | crea alumno (código + clave temporal); `service_role`; audita |
| `PATCH /admin/students/:id` | admin/teacher(su grupo) | editar datos mínimos; audita |
| `POST /admin/students/:id/reset-password` | admin/teacher | genera clave temporal; audita |
| `POST /admin/enrollments` | admin | alta/cambio de plan/vigencia (acceso) |
| `POST /admin/groups` · `group-members` | admin/teacher(su colegio) | gestión de grupos |
| `GET /admin/audit` | admin | lectura del `audit_log` |

### Contenidos (CMS · teacher-editor/admin)
| `POST /content/activities` | teacher-editor/admin | crear (estado `draft`); `ai_assisted` marcado |
| `PATCH /content/activities/:id` | autor/revisor/admin | editar; cambio a `review`/`published` según rol |
| `POST /content/activities/:id/publish` | revisor/admin | `draft→review→published`; sube `version`; audita |
| `POST /content/activities/:id/duplicate` | teacher-editor/admin | clona como `draft` |
| `POST /content/media` | teacher-editor/admin | subir audio/imagen (exige `alt_text`/transcript) |
| `GET /content/search` | teacher/admin | filtros por etiqueta/estado/objetivo |
- **Regla:** nada llega a `published` sin pasar por revisión humana; la IA solo crea `draft`.

### Asignaciones
| `POST /assignments` | teacher (su grupo/alumno)/admin | asigna unidad/objetivo/actividad |
| `GET /students/:id/assignments` | student(propio)/teacher/admin | |
| `PATCH /assignments/:id` | autor/admin | cancelar/cerrar |

### Informes (familias/profes)
| `GET /reports/student/:id` | teacher/admin/family(su alumno) | resumen de solo lectura (constancia, "lo que ya sabe decir", racha, vigencia); **sin** comparaciones |
| `POST /reports/student/:id/share-link` | admin/teacher | genera **enlace seguro caducable** para la familia (MVP: sin cuenta) |
| `GET /reports/share/:token` | público con token | valida token no caducado; solo lectura del resumen |
| `POST /reports/weekly/send` | sistema/admin | envía informe semanal por email (Resend); requiere `consents.comms` |

---

## E. Notas transversales de privacidad y borrado
- **Minimización:** del menor se guarda lo imprescindible (nombre de pila, año, nivel, progreso). Sin dirección,
  sin foto, sin apellidos salvo necesidad.
- **Pseudonimización:** todo el aprendizaje se referencia por `student_id` (uuid), no por nombre.
- **Derecho de supresión (RGPD):** flujo de **anonimización** (nombre→alias, contacto→null, notas borradas) +
  **hard-delete** a petición, conservando solo lo exigido por ley (consentimientos, facturación) durante su retención.
- **answer_keys** nunca viajan al cliente del alumno. **Auditoría** append-only. **Sesiones/IP** hasheadas y purgadas.
- **Voz de menores (P9)**: solo Fase 3, con consentimiento específico, audio temporal, sin almacenar por defecto.

---

### Próximo paso
Este modelo es la base del **`supabase/schema.sql`** (Bloque 6) y de las **Edge Functions/CMS** (Bloque 3).
Al construir, se traduce a tablas + RLS + migraciones versionadas. Falta tu visto bueno para fijarlo.
