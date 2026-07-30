# Puesta en marcha de la plataforma (desarrollo)

La app usa **Supabase** (base de datos + login) y funciona en **modo real** cuando
`supabase-config.js` tiene la URL y la clave pública del proyecto (ya está configurado con el
proyecto de desarrollo). Si esos valores fueran de ejemplo, caería en **modo demo** (cuentas de
prueba en el navegador, sin guardar nada de verdad).

## 1) Base de datos
El esquema se crea aplicando las migraciones de `supabase/migrations/` en el **SQL Editor** de
Supabase, en orden (empezando por `0001_init.sql`).

## 2) Crear el primer usuario administrador
1. En Supabase: **Authentication → Users → Add user → Create new user**.
   - Email y contraseña del responsable de Interlanguage.
   - Marca **"Auto Confirm User"** para que pueda entrar sin confirmar por correo.
2. En **SQL Editor**, ejecuta (cambiando el email por el que acabas de usar):
   ```sql
   insert into public.user_roles (user_id, role_id)
   select id, 'admin' from auth.users where email = 'TU-EMAIL' on conflict do nothing;

   update public.users set must_change_password = false,
          display_name = coalesce(display_name,'Administración')
   where id = (select id from auth.users where email = 'TU-EMAIL');
   ```
   Ese usuario ya es **admin** (entra con su email + contraseña).

## 3) Alumnos
Los alumnos NO se crean a mano: los da de alta el admin desde el panel (Bloque 5), que genera un
**código pseudónimo** (p. ej. `blue-fox-317`) + contraseña temporal, mediante una Edge Function
con `service_role`. En su primer acceso, el alumno cambia la contraseña por una suya.

## 4) Probar en local
```bash
cd ~/Desktop/interlanguage-web
python3 -m http.server 8000
```
Abre `http://localhost:8000/plataforma/index.html` y entra con el email/contraseña del admin.

## Recuperación de contraseña de un alumno
Los niños no tienen email: la recuperación la hace el **admin/profe** desde el panel
("Restablecer clave" → genera una nueva temporal). El alumno no puede hacerlo solo.

## Claves y seguridad
- `supabase-config.js` solo lleva la **clave pública** (`sb_publishable_…`): es segura en el
  navegador y las reglas de seguridad por fila (RLS) impiden ver datos de otros.
- La clave **secreta** (`sb_secret_…`, permisos totales) NUNCA va aquí: solo como secreto de las
  Edge Functions, en los servidores de Supabase.
- Cada alumno solo ve/cambia lo suyo; solo el admin ve la lista completa.
