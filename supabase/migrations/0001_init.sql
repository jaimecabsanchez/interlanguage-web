-- ============================================================
--  Interlanguage · Migración 0001 · Esquema inicial + RLS
--  Modelo: docs/superpowers/specs/2026-07-29-modelo-datos-api.md
--
--  Cómo aplicarla:  Supabase → SQL Editor → New query → pega TODO → Run.
--  Se ejecuta como una sola transacción: si algo falla, NO se aplica nada
--  (puedes corregir y volver a pegar sin miedo a dejar la base a medias).
-- ============================================================

begin;

-- ------------------------------------------------------------
-- 0) Utilidades
-- ------------------------------------------------------------
create extension if not exists pgcrypto;   -- gen_random_uuid()

-- Mantiene updated_at al día en las tablas que lo tengan
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ============================================================
--  A. CATÁLOGOS (datos fijos de referencia)
-- ============================================================

create table public.roles (
  id          text primary key,               -- family | student | teacher | admin
  description text
);

create table public.plans (
  id          text primary key,               -- p.ej. premium_home
  name        text not null,
  description text,
  price_month numeric(8,2),
  features    jsonb not null default '{}'::jsonb,
  active      boolean not null default true
);

create table public.schools (
  id     uuid primary key default gen_random_uuid(),
  name   text not null,
  code   text unique,
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now()
);

create table public.courses (
  id    uuid primary key default gen_random_uuid(),
  name  text not null,                          -- "4.º Primaria"
  stage text not null check (stage in ('primaria','eso')),
  "order" int not null default 0
);

create table public.levels (
  id    uuid primary key default gen_random_uuid(),
  name  text not null,                          -- "Explorer 2"
  cefr  text check (cefr in ('preA1','A1','A2','B1','B2')),
  "order" int not null default 0
);

create table public.skills (
  id         text primary key,                  -- vocabulary | listening | ...
  name       text not null,
  active_mvp boolean not null default false
);

-- ============================================================
--  B. IDENTIDAD Y ORGANIZACIÓN
-- ============================================================

-- Extiende auth.users (login/contraseña los gestiona Supabase Auth)
create table public.users (
  id                   uuid primary key references auth.users(id) on delete cascade,
  username             text unique not null,    -- código pseudónimo (blue-fox-317) o email de adulto
  display_name         text,
  status               text not null default 'active' check (status in ('active','suspended','pending')),
  must_change_password boolean not null default true,
  last_login_at        timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz,
  deleted_at           timestamptz
);
create trigger t_users_updated before update on public.users
  for each row execute function public.set_updated_at();

create table public.user_roles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  role_id         text not null references public.roles(id),
  scope_school_id uuid references public.schools(id),
  created_at      timestamptz not null default now()
);
create index ix_user_roles_user on public.user_roles(user_id);
-- Un rol (opcionalmente por colegio) no se repite para el mismo usuario
create unique index ux_user_roles on public.user_roles
  (user_id, role_id, coalesce(scope_school_id, '00000000-0000-0000-0000-000000000000'::uuid));

create table public.teachers (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid unique references public.users(id) on delete set null,
  full_name  text,
  school_id  uuid references public.schools(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);
create trigger t_teachers_updated before update on public.teachers
  for each row execute function public.set_updated_at();

create table public.families (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.users(id) on delete set null,   -- login familiar: Fase 2
  contact_email text,
  contact_phone text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz,
  deleted_at    timestamptz
);
create trigger t_families_updated before update on public.families
  for each row execute function public.set_updated_at();

create table public.students (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid unique references public.users(id) on delete set null,
  first_name   text,                            -- nombre de pila (minimización: sin apellidos)
  birth_year   int,                             -- año, no fecha exacta
  level_id     uuid references public.levels(id),
  course_ref   text,
  avatar_choice text,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz,
  deleted_at   timestamptz
);
create index ix_students_level on public.students(level_id);
create trigger t_students_updated before update on public.students
  for each row execute function public.set_updated_at();

create table public.student_guardians (
  student_id uuid not null references public.students(id) on delete cascade,
  family_id  uuid not null references public.families(id) on delete cascade,
  relation   text,                              -- madre | padre | tutor
  primary key (student_id, family_id)
);

create table public.groups (
  id         uuid primary key default gen_random_uuid(),
  school_id  uuid references public.schools(id),
  teacher_id uuid references public.teachers(id),
  name       text not null,
  level_id   uuid references public.levels(id),
  status     text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
create index ix_groups_school on public.groups(school_id);
create index ix_groups_teacher on public.groups(teacher_id);
create trigger t_groups_updated before update on public.groups
  for each row execute function public.set_updated_at();

create table public.group_members (
  group_id   uuid not null references public.groups(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  joined_at  timestamptz not null default now(),
  left_at    timestamptz,
  primary key (group_id, student_id)
);
create index ix_group_members_student on public.group_members(student_id);

create table public.enrollments (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  plan_id    text references public.plans(id),
  school_id  uuid references public.schools(id),
  status     text not null default 'active' check (status in ('active','paused','expired','cancelled')),
  starts_on  date,
  ends_on    date,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
create index ix_enrollments_student on public.enrollments(student_id);
create index ix_enrollments_status on public.enrollments(status);
create trigger t_enrollments_updated before update on public.enrollments
  for each row execute function public.set_updated_at();

create table public.consents (
  id             uuid primary key default gen_random_uuid(),
  student_id     uuid not null references public.students(id) on delete cascade,
  family_id      uuid references public.families(id),
  type           text not null check (type in ('data_processing','audio_recording','media','comms')),
  granted        boolean not null default false,
  granted_at     timestamptz,
  revoked_at     timestamptz,
  policy_version text,
  evidence       jsonb,
  created_at     timestamptz not null default now()
);
create index ix_consents_student on public.consents(student_id);

create table public.sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  started_at   timestamptz not null default now(),
  last_seen_at timestamptz,
  ip_hash      text,                            -- IP hasheada (minimización)
  user_agent   text,
  revoked_at   timestamptz
);
create index ix_sessions_user on public.sessions(user_id);

create table public.audit_log (
  id            bigint generated always as identity primary key,
  actor_user_id uuid references public.users(id),
  action        text not null,                  -- student.create | password.reset | content.publish ...
  entity        text,
  entity_id     text,
  metadata      jsonb,
  created_at    timestamptz not null default now()
);
create index ix_audit_actor on public.audit_log(actor_user_id);
create index ix_audit_entity on public.audit_log(entity, entity_id);
create index ix_audit_created on public.audit_log(created_at);

-- ============================================================
--  C. CURRÍCULO Y CONTENIDO
-- ============================================================

create table public.units (
  id         uuid primary key default gen_random_uuid(),
  level_id   uuid references public.levels(id),
  title      text not null,
  theme      text,
  "order"    int not null default 0,
  status     text not null default 'draft' check (status in ('draft','review','published','archived')),
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
create index ix_units_level on public.units(level_id);
create index ix_units_status on public.units(status);
create trigger t_units_updated before update on public.units
  for each row execute function public.set_updated_at();

create table public.objectives (
  id         uuid primary key default gen_random_uuid(),
  unit_id    uuid not null references public.units(id) on delete cascade,
  skill_id   text references public.skills(id),
  can_do     text not null,                     -- "Sé decir a qué hora hago las cosas"
  difficulty int check (difficulty between 1 and 5),
  prerequisites uuid[] not null default '{}',
  "order"    int not null default 0,
  status     text not null default 'draft' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
create index ix_objectives_unit on public.objectives(unit_id);
create index ix_objectives_skill on public.objectives(skill_id);
create trigger t_objectives_updated before update on public.objectives
  for each row execute function public.set_updated_at();

create table public.media (
  id           uuid primary key default gen_random_uuid(),
  type         text not null check (type in ('audio','image')),
  storage_path text not null,
  alt_text     text not null,                   -- accesibilidad: obligatorio
  transcript   text,
  duration_ms  int,
  bytes        int,
  license      text,
  tags         text[] not null default '{}',
  status       text not null default 'draft' check (status in ('draft','review','published','archived')),
  created_by   uuid references public.users(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz
);
create index ix_media_type on public.media(type);
create index ix_media_status on public.media(status);
create index ix_media_tags on public.media using gin(tags);
create trigger t_media_updated before update on public.media
  for each row execute function public.set_updated_at();

create table public.activities (
  id                   uuid primary key default gen_random_uuid(),
  objective_id         uuid references public.objectives(id) on delete cascade,
  template             text not null check (template in ('p1','p2','p3','p4','p5','p6','p7','p8','p9')),
  level_id             uuid references public.levels(id),
  skill_id             text references public.skills(id),
  title                text,
  instruction          text,
  instruction_audio_id uuid references public.media(id),
  stimulus             jsonb,
  data                 jsonb not null default '{}'::jsonb,
  hints                jsonb not null default '[]'::jsonb,
  explanation          text,
  max_attempts         int,
  feedback             jsonb not null default '{}'::jsonb,
  difficulty           int check (difficulty between 1 and 5),
  age_min              int,
  age_max              int,
  tags                 text[] not null default '{}',
  status               text not null default 'draft' check (status in ('draft','review','published','archived')),
  version              int not null default 1,
  ai_assisted          boolean not null default false,
  created_by           uuid references public.users(id),
  reviewed_by          uuid references public.users(id),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz
);
create index ix_activities_objective on public.activities(objective_id);
create index ix_activities_template on public.activities(template);
create index ix_activities_status on public.activities(status);
create index ix_activities_level on public.activities(level_id);
create index ix_activities_tags on public.activities using gin(tags);
create trigger t_activities_updated before update on public.activities
  for each row execute function public.set_updated_at();

create table public.questions (
  id           uuid primary key default gen_random_uuid(),
  activity_id  uuid not null references public.activities(id) on delete cascade,
  prompt       text not null,
  sub_template text check (sub_template in ('p1','p2','p6')),
  "order"      int not null default 0,
  explanation  text
);
create index ix_questions_activity on public.questions(activity_id);

create table public.options (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid references public.questions(id) on delete cascade,
  activity_id uuid references public.activities(id) on delete cascade,
  label       text,
  media_id    uuid references public.media(id),
  "order"     int not null default 0,
  check (question_id is not null or activity_id is not null)
);
create index ix_options_question on public.options(question_id);
create index ix_options_activity on public.options(activity_id);

-- Respuestas correctas: TABLA APARTE. NUNCA se envía al navegador del alumno
-- (RLS: solo staff puede leerla; la validación real va en el servidor).
create table public.answer_keys (
  id          uuid primary key default gen_random_uuid(),
  activity_id uuid references public.activities(id) on delete cascade,
  question_id uuid references public.questions(id) on delete cascade,
  correct     jsonb not null,
  accepted    jsonb not null default '[]'::jsonb,
  match_rule  text not null default 'exact' check (match_rule in ('exact','tolerant','set','order')),
  check (activity_id is not null or question_id is not null)
);
create index ix_answer_keys_activity on public.answer_keys(activity_id);
create index ix_answer_keys_question on public.answer_keys(question_id);

-- ============================================================
--  D. APRENDIZAJE, PROGRESO Y RECOMPENSAS
-- ============================================================

create table public.practice_sessions (
  id                uuid primary key default gen_random_uuid(),
  student_id        uuid not null references public.students(id) on delete cascade,
  date              date not null default current_date,
  activities_planned jsonb,
  completed         boolean not null default false,
  correct_count     int not null default 0,
  total_count       int not null default 0,
  started_at        timestamptz not null default now(),
  finished_at       timestamptz
);
create index ix_practice_sessions_student on public.practice_sessions(student_id, date);

create table public.attempts (
  id                  uuid primary key default gen_random_uuid(),
  student_id          uuid not null references public.students(id) on delete cascade,
  activity_id         uuid references public.activities(id),
  question_id         uuid references public.questions(id),
  objective_id        uuid references public.objectives(id),
  result              text not null check (result in ('correct','incorrect','skipped')),
  attempt_no          int not null default 1,
  hint_used           boolean not null default false,
  response            jsonb,
  recovery_type       text check (recovery_type in ('recognition','production')),
  duration_ms         int,
  practice_session_id uuid references public.practice_sessions(id),
  created_at          timestamptz not null default now()
);
create index ix_attempts_student on public.attempts(student_id);
create index ix_attempts_objective on public.attempts(objective_id);
create index ix_attempts_activity on public.attempts(activity_id);
create index ix_attempts_created on public.attempts(created_at);

-- Dominio por alumno × objetivo (los 5 estados + repaso espaciado)
create table public.mastery (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.students(id) on delete cascade,
  objective_id  uuid not null references public.objectives(id) on delete cascade,
  mastery_state text not null default 'new'
                check (mastery_state in ('new','practicing','almost','mastered','needs_review')),
  evidence_score numeric not null default 0,
  correct_days  int not null default 0,
  last_result   text,
  next_review_at date,
  updated_at    timestamptz,
  unique (student_id, objective_id)
);
create index ix_mastery_student on public.mastery(student_id);
create index ix_mastery_review on public.mastery(next_review_at);
create trigger t_mastery_updated before update on public.mastery
  for each row execute function public.set_updated_at();

-- Contadores "de juego" del alumno (gemas, xp, cosméticos) — 1 por alumno
create table public.student_state (
  student_id uuid primary key references public.students(id) on delete cascade,
  gems       int not null default 0,
  xp         int not null default 0,
  lessons    int not null default 0,
  owned      jsonb not null default '[]'::jsonb,
  hat        text default '',
  acc        text default '',
  updated_at timestamptz
);
create trigger t_student_state_updated before update on public.student_state
  for each row execute function public.set_updated_at();

create table public.streaks (
  student_id         uuid primary key references public.students(id) on delete cascade,
  current            int not null default 0,
  longest            int not null default 0,
  last_practice_date date,
  freezes_available  int not null default 1,
  frozen_until       date
);

create table public.rewards (
  id       text primary key,                    -- badge_5_dias, aciertos_5, ...
  type     text not null check (type in ('badge','collection','unlock','cosmetic')),
  name     text not null,
  family   text check (family in ('constancia','aciertos','mejora','dominio')),
  criteria jsonb not null default '{}'::jsonb
);

create table public.student_rewards (
  student_id uuid not null references public.students(id) on delete cascade,
  reward_id  text not null references public.rewards(id),
  earned_at  timestamptz not null default now(),
  primary key (student_id, reward_id)
);

create table public.assignments (
  id          uuid primary key default gen_random_uuid(),
  assigned_by uuid references public.teachers(id),
  target_type text not null check (target_type in ('student','group')),
  target_id   uuid not null,
  ref_type    text not null check (ref_type in ('unit','objective','activity')),
  ref_id      uuid not null,
  due_on      date,
  status      text not null default 'active' check (status in ('active','done','cancelled')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz
);
create index ix_assignments_target on public.assignments(target_type, target_id);
create trigger t_assignments_updated before update on public.assignments
  for each row execute function public.set_updated_at();

-- ============================================================
--  E. FUNCIONES DE AUTORIZACIÓN (SECURITY DEFINER evita recursión de RLS)
-- ============================================================

create or replace function public.has_role(p_role text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles ur
                 where ur.user_id = auth.uid() and ur.role_id = p_role);
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role('admin');
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role('admin') or public.has_role('teacher');
$$;

create or replace function public.current_student_id()
returns uuid language sql stable security definer set search_path = public as $$
  select s.id from public.students s
  where s.user_id = auth.uid() and s.deleted_at is null;
$$;

create or replace function public.is_teacher_of_student(p_student uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.teachers t
    join public.groups g       on g.teacher_id = t.id
    join public.group_members gm on gm.group_id = g.id
    where t.user_id = auth.uid()
      and gm.student_id = p_student
      and gm.left_at is null
  );
$$;

create or replace function public.is_guardian_of_student(p_student uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.families f
    join public.student_guardians sg on sg.family_id = f.id
    where f.user_id = auth.uid() and sg.student_id = p_student
  );
$$;

-- ¿Puede el usuario actual VER a este alumno? (él mismo, su profe, su tutor o admin)
create or replace function public.can_view_student(p_student uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin()
      or p_student = public.current_student_id()
      or public.is_teacher_of_student(p_student)
      or public.is_guardian_of_student(p_student);
$$;

-- ============================================================
--  F. TRIGGER: crear la fila users al registrarse en Auth
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, username, display_name, must_change_password)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'display_name',
    coalesce((new.raw_user_meta_data->>'must_change_password')::boolean, true)
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
--  G. ROW LEVEL SECURITY
--     Regla: activar RLS en TODO. Denegar por defecto; abrir con políticas.
-- ============================================================

-- Activar RLS en todas las tablas del esquema public
do $$
declare r record;
begin
  for r in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security;', r.tablename);
  end loop;
end $$;

-- --- Catálogos: lectura para usuarios autenticados; escritura solo admin ---
create policy cat_read_roles   on public.roles   for select to authenticated using (true);
create policy cat_read_plans   on public.plans   for select to authenticated using (true);
create policy cat_read_schools on public.schools for select to authenticated using (true);
create policy cat_read_courses on public.courses for select to authenticated using (true);
create policy cat_read_levels  on public.levels  for select to authenticated using (true);
create policy cat_read_skills  on public.skills  for select to authenticated using (true);
create policy cat_admin_roles   on public.roles   for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy cat_admin_plans   on public.plans   for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy cat_admin_schools on public.schools for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy cat_admin_courses on public.courses for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy cat_admin_levels  on public.levels  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy cat_admin_skills  on public.skills  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- users: cada uno ve/actualiza lo suyo; admin todo ---
create policy users_self_read   on public.users for select to authenticated using (id = auth.uid() or public.is_admin());
create policy users_self_update on public.users for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy users_admin_all   on public.users for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- user_roles: el usuario ve sus roles; solo admin escribe ---
create policy uroles_self_read on public.user_roles for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy uroles_admin_all on public.user_roles for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- teachers / families: el propio y admin ---
create policy teachers_self on public.teachers for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy teachers_admin on public.teachers for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy families_self on public.families for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy families_admin on public.families for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- students: quien puede verlo (él, su profe, su tutor, admin); escribe staff ---
create policy students_view  on public.students for select to authenticated using (public.can_view_student(id));
create policy students_write on public.students for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- --- vínculos de alumno: verlos si puedes ver al alumno; escribe staff ---
create policy sg_view  on public.student_guardians for select to authenticated using (public.can_view_student(student_id));
create policy sg_write on public.student_guardians for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy gm_view  on public.group_members for select to authenticated using (public.can_view_student(student_id) or public.is_staff());
create policy gm_write on public.group_members for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy enr_view  on public.enrollments for select to authenticated using (public.can_view_student(student_id));
create policy enr_write on public.enrollments for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy cons_view  on public.consents for select to authenticated using (public.can_view_student(student_id));
create policy cons_write on public.consents for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- --- groups: staff (profe/admin) ---
create policy groups_read  on public.groups for select to authenticated using (public.is_staff());
create policy groups_write on public.groups for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- --- sessions: cada usuario las suyas; admin todo ---
create policy sessions_self on public.sessions for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy sessions_admin on public.sessions for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- audit_log: solo admin lee (nadie edita/borra desde el cliente) ---
create policy audit_admin_read on public.audit_log for select to authenticated using (public.is_admin());

-- --- Contenido (units/objectives/activities/questions/options/media):
--     publicado lo lee cualquier autenticado; borradores solo staff; escribe staff ---
create policy units_read  on public.units for select to authenticated using (status = 'published' or public.is_staff());
create policy units_write on public.units for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy obj_read  on public.objectives for select to authenticated using (status = 'published' or public.is_staff());
create policy obj_write on public.objectives for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy act_read  on public.activities for select to authenticated using (status = 'published' or public.is_staff());
create policy act_write on public.activities for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy q_read  on public.questions for select to authenticated using (
  public.is_staff() or exists (select 1 from public.activities a where a.id = activity_id and a.status = 'published'));
create policy q_write on public.questions for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy opt_read  on public.options for select to authenticated using (
  public.is_staff()
  or exists (select 1 from public.activities a where a.id = options.activity_id and a.status = 'published')
  or exists (select 1 from public.questions qq join public.activities a on a.id = qq.activity_id
             where qq.id = options.question_id and a.status = 'published'));
create policy opt_write on public.options for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy media_read  on public.media for select to authenticated using (status = 'published' or public.is_staff());
create policy media_write on public.media for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- --- answer_keys: SOLO staff. Los alumnos NUNCA leen la solución ---
create policy ak_staff_only on public.answer_keys for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- --- Datos de aprendizaje del alumno ---
-- attempts: el alumno inserta/ve los suyos; quien puede verlo también lee
create policy att_read   on public.attempts for select to authenticated using (public.can_view_student(student_id));
create policy att_insert on public.attempts for insert to authenticated with check (student_id = public.current_student_id());
create policy att_admin  on public.attempts for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy ps_read   on public.practice_sessions for select to authenticated using (public.can_view_student(student_id));
create policy ps_write  on public.practice_sessions for all to authenticated
  using (student_id = public.current_student_id() or public.is_staff())
  with check (student_id = public.current_student_id() or public.is_staff());

create policy mas_read  on public.mastery for select to authenticated using (public.can_view_student(student_id));
create policy mas_write on public.mastery for all to authenticated
  using (student_id = public.current_student_id() or public.is_staff())
  with check (student_id = public.current_student_id() or public.is_staff());

create policy st_read  on public.student_state for select to authenticated using (public.can_view_student(student_id));
create policy st_write on public.student_state for all to authenticated
  using (student_id = public.current_student_id() or public.is_staff())
  with check (student_id = public.current_student_id() or public.is_staff());

create policy stk_read  on public.streaks for select to authenticated using (public.can_view_student(student_id));
create policy stk_write on public.streaks for all to authenticated
  using (student_id = public.current_student_id() or public.is_staff())
  with check (student_id = public.current_student_id() or public.is_staff());

-- rewards: catálogo legible; escribe admin. student_rewards: verlas si puedes ver al alumno
create policy rew_read  on public.rewards for select to authenticated using (true);
create policy rew_admin on public.rewards for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy srew_read  on public.student_rewards for select to authenticated using (public.can_view_student(student_id));
create policy srew_write on public.student_rewards for all to authenticated
  using (student_id = public.current_student_id() or public.is_staff())
  with check (student_id = public.current_student_id() or public.is_staff());

-- assignments: staff gestiona; el alumno ve las suyas
create policy asg_read  on public.assignments for select to authenticated using (
  public.is_staff()
  or (target_type = 'student' and target_id = public.current_student_id()));
create policy asg_write on public.assignments for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- ============================================================
--  H. SEMILLA de catálogos (datos fijos mínimos)
-- ============================================================
insert into public.roles (id, description) values
  ('family','Tutor legal — solo lectura del alumno'),
  ('student','Alumno — practica'),
  ('teacher','Profesor — su grupo y contenidos'),
  ('admin','Administración — todo')
on conflict do nothing;

insert into public.skills (id, name, active_mvp) values
  ('vocabulary','Vocabulary',true),
  ('listening','Listening',true),
  ('reading','Reading',true),
  ('grammar','Grammar',true),
  ('everyday','Everyday English',true),
  ('writing','Writing',false),
  ('pronunciation','Pronunciation',false),
  ('speaking','Speaking',false),
  ('study_abroad','Study-abroad readiness',false)
on conflict do nothing;

insert into public.plans (id, name, description, price_month, active) values
  ('premium_home','Premium (incluye práctica en casa)','Plan superior con acceso a la plataforma', 10.00, true)
on conflict do nothing;

-- Nivel de arranque del MVP (3.º–4.º Primaria, A1)
insert into public.levels (id, name, cefr, "order") values
  (gen_random_uuid(), 'Explorer 1 (3.º–4.º Primaria)', 'A1', 1)
on conflict do nothing;

commit;

-- ============================================================
--  ✅ Listo. Para comprobar que se crearon las tablas:
--     select table_name from information_schema.tables
--     where table_schema = 'public' order by table_name;
-- ============================================================
