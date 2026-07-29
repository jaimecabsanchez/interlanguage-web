# Interlanguage HOME — Puesta en marcha del acceso de familias

Esta plataforma funciona en **dos modos**:

- **Modo demo** (ahora mismo): mientras no pegues tus claves de Supabase, todo
  funciona con cuentas de prueba guardadas en el navegador. Ideal para verlo y
  enseñarlo. Prueba en `/plataforma/` con `lucia` / `home1234` (alumno) o
  `admin` / `admin1234` (panel).
- **Modo real**: cuando conectes tu proyecto de Supabase, las cuentas son de
  verdad (contraseñas cifradas, se pueden cambiar y restablecer).

Pasar a real son **≈ 20 minutos**. Sigue estos pasos.

---

## Paso 1 · Crear el proyecto en Supabase (gratis)

1. Entra en https://supabase.com y crea una cuenta.
2. **New project** → ponle un nombre (ej. `interlanguage-home`), una contraseña
   de base de datos (guárdala) y una región cercana (Europe West).
3. Espera 1–2 min a que se cree.

## Paso 2 · Pegar tus claves en la web

1. En Supabase: **Project Settings → API**.
2. Copia estos dos valores:
   - **Project URL**
   - **anon public** (la clave pública; es segura para el navegador)
3. Ábrelos en el archivo **`plataforma/supabase-config.js`** y sustituye:
   ```js
   url:     "https://TU-PROYECTO.supabase.co",   // ← tu Project URL
   anonKey: "TU-ANON-KEY-PUBLICA",               // ← tu anon public key
   ```
   > ⚠️ Pega SOLO la clave **anon public**. La `service_role` NUNCA se pone aquí.

## Paso 3 · Crear la base de datos

1. En Supabase: **SQL Editor → New query**.
2. Abre el archivo **`supabase/schema.sql`**, copia todo su contenido, pégalo y
   pulsa **Run**. Debe decir "Success".

## Paso 4 · Crear tu usuario administrador

1. En Supabase: **Authentication → Users → Add user → Create new user**.
   - Email: `admin@alumnos.interlanguage-home.es`
   - Password: la que quieras para entrar al panel
   - Marca **Auto Confirm User** (para que no pida confirmación por email).
2. Vuelve a **SQL Editor** y ejecuta (para convertirlo en admin):
   ```sql
   update public.profiles
      set is_admin = true, must_change_password = false
    where id = (select id from auth.users
                where email = 'admin@alumnos.interlanguage-home.es');
   ```
   > Tu usuario de admin será `admin` (la parte antes de la @).

## Paso 5 · Desplegar la función de crear cuentas

Esta función es la que genera usuario+contraseña de forma segura.

**Opción A · desde el panel (sin instalar nada):**
1. Supabase → **Edge Functions → Create a new function**.
2. Nombre exacto: `admin-create-student`.
3. Pega el contenido de **`supabase/functions/admin-create-student/index.ts`** y
   pulsa **Deploy**.

**Opción B · con la CLI (si la usas):**
```bash
supabase functions deploy admin-create-student
```

> No hace falta configurar claves secretas: Supabase ya pasa a la función
> `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` por defecto.

## Paso 6 · Probar

1. Entra en `tusitio.com/plataforma/` → usuario `admin` + tu contraseña.
2. Crea un alumno de prueba → te dará **usuario + contraseña generados**.
3. Sal, entra con ese alumno → te pedirá **crear su propia contraseña**.
4. Al guardarla, verás su dashboard. 🎉

---

## Cómo se entregan las credenciales a la familia

Cuando una familia contrata el plan, en el panel pulsas **"Crear cuenta"** y el
sistema genera usuario + contraseña. Con el botón **"Copiar mensaje para
WhatsApp"** tienes el texto listo para enviárselo (o imprimirlo en el kit de
bienvenida). En su primer acceso, el alumno cambia la contraseña por una suya.

## ¿Y si un niño olvida su contraseña?

Los niños no tienen email, así que la recuperación la haces **tú** desde el
panel: botón **"Restablecer clave"** junto al alumno → genera una nueva y se la
das. En el siguiente acceso volverá a elegir la suya.

## Seguridad — lo importante

- La clave **anon public** en `supabase-config.js` es **pública por diseño**, no
  pasa nada porque esté en la web. Las reglas de seguridad (RLS) impiden que
  nadie vea datos de otros.
- La clave **service_role** (permisos totales) vive **solo** dentro de la Edge
  Function en los servidores de Supabase. **Nunca** la pongas en el navegador ni
  en `supabase-config.js`.
- Cada alumno solo puede ver y cambiar **su propio** perfil; solo el admin ve la
  lista completa.

## Despliegue

La carpeta `plataforma/` es parte de tu web estática: al publicar el sitio
(Cloudflare Pages / Netlify), el acceso queda disponible en `/plataforma/`.
No requiere servidor propio.
