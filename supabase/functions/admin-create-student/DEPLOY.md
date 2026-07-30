# Desplegar la función de alta de alumnos (B5) — paso guiado

Esta función (`admin-create-student`) crea alumnos con permisos de servidor. Hay que **desplegarla una
vez** y darle su **clave secreta**. Es un paso del usuario; se hace desde el panel de Supabase.

## 1) Crear/actualizar la función (panel de Supabase)
1. Supabase → menú izquierdo **Edge Functions** → **Deploy a new function** (o abre `admin-create-student`
   si ya existe → editar).
2. Nombre exacto: **`admin-create-student`**.
3. Pega el contenido de `supabase/functions/admin-create-student/index.ts` y pulsa **Deploy**.

> Alternativa con CLI (si se usa): `supabase functions deploy admin-create-student`.

## 2) Darle la clave secreta (importante en el sistema de claves NUEVO)
La función necesita una clave de servidor. Como este proyecto usa el sistema de claves nuevo:
1. Supabase → **Project Settings → API Keys** → copia la clave **`sb_secret_…`** (SECRETA).
2. Supabase → **Edge Functions → (esta función) → Secrets** (o **Project Settings → Edge Functions → Secrets**)
   → añade un secreto:
   - **Nombre:** `IL_SERVICE_KEY`
   - **Valor:** la clave `sb_secret_…`
3. Guarda. (La clave secreta vive SOLO aquí, en el servidor. Nunca en el navegador ni en git.)

> Si tu proyecto todavía tuviera activada la service_role clásica, la función también funcionaría sin este
> secreto (usa `SUPABASE_SERVICE_ROLE_KEY` por defecto). Poner `IL_SERVICE_KEY` es lo seguro con el sistema nuevo.

## 3) Probar
1. Entra al panel como admin → **Nuevo alumno** → escribe un nombre → **Crear alumno y generar acceso**.
2. Debe aparecer un **usuario** (tipo `blue-fox-317`) y una **contraseña**.
3. Sal, entra con ese alumno → te pedirá **crear su propia contraseña**. ✅

## Qué hace la función al crear un alumno
- Genera un **código único** (`adjetivo-animal-###`) y una contraseña temporal.
- Crea la cuenta (Auth) + la fila `users` (trigger) + `students` + rol `student` + `enrollments`
  (plan activo) + `student_state` + `streaks`.
- Si se indica email de familia: crea `families` + vínculo (el **consentimiento NO se auto-otorga**).
- Registra la acción en `audit_log`.
