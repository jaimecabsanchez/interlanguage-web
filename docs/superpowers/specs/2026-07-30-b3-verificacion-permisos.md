# B3 · Verificación de roles y permisos (RBAC + RLS)

**Fecha:** 2026-07-30 · **Estado:** verificación en curso.
Objetivo: comprobar que **cada rol solo ve/hace lo suyo** y que **no hay fugas** de datos de menores.
Base: migración `0001_init.sql` (RLS) + modelo/API aprobados.

## 1. Verificado EN VIVO (contra el proyecto real)

### 1.1 Acceso sin sesión (rol anónimo) — ✅ correcto
Petición REST con la clave pública **sin iniciar sesión** a las tablas sensibles. Resultado:

| Tabla | Resultado esperado | Resultado real |
|---|---|---|
| users, students, attempts, answer_keys, mastery, user_roles, consents, skills | `[]` (nada) | **`[]` en todas** ✅ |

Conclusión: la RLS **deniega por defecto** a quien no ha iniciado sesión. Ningún dato se filtra al público.
(Prueba repetible: `GET {url}/rest/v1/<tabla>` con `apikey`+`Bearer` = clave pública, sin sesión → `[]`.)

## 2. Revisión estática de las políticas (por inspección)

| Recurso | Política | ¿Correcto? |
|---|---|---|
| **answer_keys** (soluciones) | Solo `is_staff()`; ni anónimo ni alumno | ✅ **crítico**: el alumno nunca lee la solución |
| **students** | Ver: `can_view_student` (él/su profe/su tutor/admin); escribir: staff | ✅ un alumno no ve a otros |
| **attempts** | Alumno inserta solo los suyos (`student_id = current_student_id()`); lee quien puede verlo | ✅ no puede escribir intentos de otro |
| **mastery / student_state / streaks** | Alumno lee/escribe **solo lo suyo**; staff también | ✅ aislado por alumno · ⚠️ ver §3.2 |
| **units/objectives/activities/questions/options/media** | Publicado: lo lee cualquiera autenticado; borradores: solo staff | ✅ contenido en revisión no visible a alumnos |
| **user_roles** | Escribe **solo admin**; el usuario ve sus roles | ✅ un alumno no puede **auto-asignarse** admin |
| **users** | Cada uno ve/actualiza lo suyo; admin todo | ✅ (con matiz corregido en §3.1) |
| **groups / enrollments / consents / audit_log** | staff/admin según corresponde; audit_log solo lectura admin | ✅ |

## 3. Hallazgos y correcciones

### 3.1 Un alumno podía cambiar su propio `username`/`status` — 🔧 CORREGIDO
La RLS controla la **fila**, no la **columna**: la política "actualizo lo mío" de `users` dejaba a un
usuario cambiar cualquier campo de su fila, incluido su **código de acceso** (`username`) o su `status`.
No permite tocar a otros ni escalar a admin (los roles viven en otra tabla, solo-admin), pero es una
puerta que hay que cerrar.
**Corrección:** migración **`0002_protect_users.sql`** añade un trigger `protect_users` que, para
cualquiera que no sea admin, **conserva** `username`, `status` e `id` (sí deja cambiar cosméticos y
`must_change_password`). El contexto de servidor (Edge Functions / service_role) no se ve afectado.
→ **Pendiente de aplicar en Supabase** (un pegar-y-Run de 30 segundos).

### 3.2 El alumno escribe su propio progreso directamente — ⏳ se endurece en B10–B12
Hoy (puente de B2) el navegador del alumno escribe `mastery/student_state/streaks` directamente. RLS
garantiza que **solo puede tocar lo suyo** (no hay fuga ni afecta a otros), pero un usuario avanzado
podría inflar **su propio** progreso. Riesgo bajo (solo se engaña a sí mismo, sin filtrar datos).
**Plan:** en B10–B12 el progreso pasará a calcularse **en el servidor** (RPC/Edge Function con
`security definer` que valida el intento contra `answer_keys`), y se retirará la escritura directa del
alumno sobre esas tablas. Anotado.

## 4. Pendiente de verificar (tests de rol autenticado)
Falta comprobar EN VIVO el comportamiento **con sesión iniciada** de cada rol:
- Alumno A ve su ficha pero **no** la de Alumno B; no ve intentos de B; no lee `answer_keys`.
- Profesor ve **solo** los alumnos de **su** grupo; no los de otros grupos.
- Admin ve todo.

Esto requiere **usuarios de prueba reales** (un alumno, un profe). En vez de insertar usuarios "a mano"
(frágil), se harán **cuando exista el alta de alumnos (B5)**: se crean 2–3 de prueba por el flujo real y
se prueban las lecturas vía API con cada sesión (se puede automatizar desde el navegador). 
**Por eso B3 se cierra del todo junto con B5.** Lo crítico (denegar por defecto + `answer_keys` oculta +
no auto-escalar a admin) ya está **verificado**.

## 5. Estado
- ✅ Anónimo denegado (en vivo).
- ✅ Revisión estática de todas las políticas.
- 🔧 Hallazgo 3.1 corregido (migración 0002, pendiente de aplicar).
- ⏳ Hallazgo 3.2 anotado para B10–B12.
- ⏳ Tests de rol autenticado → se ejecutan con B5 (usuarios de prueba reales).
