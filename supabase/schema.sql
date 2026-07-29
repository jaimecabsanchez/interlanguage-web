-- ============================================================
--  Interlanguage HOME · esquema de base de datos + seguridad
--  Pega TODO esto en:  Supabase → SQL Editor → New query → Run
-- ============================================================

-- 1) Tabla de perfiles (un perfil por cuenta de Supabase Auth)
create table if not exists public.profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  username              text unique not null,
  full_name             text,
  level                 text,
  stage                 text,
  parent_email          text,
  is_admin              boolean not null default false,
  must_change_password  boolean not null default true,
  created_at            timestamptz not null default now()
);

-- 2) Función auxiliar para saber si un usuario es admin
--    (SECURITY DEFINER evita la recursión de las políticas RLS)
create or replace function public.is_admin(uid uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = uid), false);
$$;

-- 3) Al crear una cuenta en Auth, se crea su perfil automáticamente
--    leyendo los datos que envía el panel de admin (user_metadata).
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, level, stage, parent_email, is_admin, must_change_password)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'level',
    new.raw_user_meta_data->>'stage',
    new.raw_user_meta_data->>'parent_email',
    coalesce((new.raw_user_meta_data->>'is_admin')::boolean, false),
    coalesce((new.raw_user_meta_data->>'must_change_password')::boolean, true)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4) Evita que un alumno se dé a sí mismo permisos de admin o cambie su usuario
create or replace function public.protect_profile()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is not null and not public.is_admin(auth.uid()) then
    new.is_admin := old.is_admin;
    new.username := old.username;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_update on public.profiles;
create trigger protect_profile_update
  before update on public.profiles
  for each row execute function public.protect_profile();

-- 5) Row Level Security (RLS): cada uno solo ve lo que le corresponde
alter table public.profiles enable row level security;

drop policy if exists "own read"    on public.profiles;
drop policy if exists "own update"  on public.profiles;
drop policy if exists "admin read"  on public.profiles;

-- cada alumno lee y actualiza SOLO su propio perfil
create policy "own read"   on public.profiles for select using (auth.uid() = id);
create policy "own update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
-- los administradores pueden ver todos los perfiles (para el panel)
create policy "admin read" on public.profiles for select using (public.is_admin(auth.uid()));

-- 6) Progreso del alumno (racha, gemas, XP, tienda) — se guarda aquí de verdad
create table if not exists public.progress (
  id       uuid primary key references auth.users(id) on delete cascade,
  gems     integer not null default 0,
  streak   integer not null default 0,
  best     integer not null default 0,
  xp       integer not null default 0,
  lessons  integer not null default 0,
  last     text,
  owned    jsonb not null default '[]'::jsonb,
  hat      text default '',
  acc      text default ''
);
alter table public.progress enable row level security;
drop policy if exists "own progress" on public.progress;
-- cada alumno solo puede ver y modificar su propio progreso
create policy "own progress" on public.progress for all
  using (auth.uid() = id) with check (auth.uid() = id);

-- ============================================================
--  DESPUÉS de crear tu primer usuario admin (ver SETUP.md paso 4),
--  ejecuta esta línea cambiando el email por el de tu admin:
--
--  update public.profiles
--     set is_admin = true, must_change_password = false
--   where id = (select id from auth.users
--               where email = 'admin@alumnos.interlanguage-home.es');
-- ============================================================
