-- ============================================================
--  Interlanguage · Migración 0002 · Candado en public.users
--  Motivo (revisión B3): la política de "actualizar lo mío" permitía a un
--  alumno cambiar campos que NO debería (su username/código de acceso, su
--  estado). RLS controla la FILA, no la COLUMNA; este trigger controla la
--  columna: un no-admin no puede tocar username ni status ni sus roles.
--  (Sí puede cambiar cosméticos como display_name, y must_change_password.)
--
--  Aplicar igual que la 0001: SQL Editor → pegar → Run.
-- ============================================================

begin;

create or replace function public.protect_users()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- Contexto de servidor (Edge Functions / service_role) → auth.uid() es null: no se toca.
  -- Admin autenticado → puede cambiar todo.
  -- Cualquier otro usuario autenticado → se le conservan los campos sensibles.
  if auth.uid() is not null and not public.is_admin() then
    new.username := old.username;   -- no puede cambiar su código de acceso
    new.status   := old.status;     -- ni su estado (active/suspended/pending)
    new.id       := old.id;         -- ni su id
  end if;
  return new;
end $$;

drop trigger if exists protect_users_update on public.users;
create trigger protect_users_update
  before update on public.users
  for each row execute function public.protect_users();

commit;
