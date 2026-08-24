-- Interlanguage HOME · Fase 0 — verdad de aprendizaje
-- Migración aditiva: conserva attempts/mastery/placement local existentes.
begin;

alter table public.practice_sessions
  add column if not exists client_session_key text,
  add column if not exists mode text not null default 'daily',
  add column if not exists age_band text,
  add column if not exists cefr text,
  add column if not exists content_version text,
  add column if not exists evaluable_count int not null default 0,
  add column if not exists first_try_correct_count int not null default 0,
  add column if not exists eventual_success_count int not null default 0,
  add column if not exists technical_failure_count int not null default 0,
  add column if not exists hint_used_count int not null default 0,
  add column if not exists perfect boolean not null default false;

create unique index if not exists ux_practice_sessions_client_key
  on public.practice_sessions(student_id, client_session_key);

alter table public.attempts
  add column if not exists exercise_key text,
  add column if not exists objective_key text,
  add column if not exists variant_key text,
  add column if not exists client_session_key text,
  add column if not exists age_band text,
  add column if not exists cefr text,
  add column if not exists skill text,
  add column if not exists content_version text,
  add column if not exists audio_replays int not null default 0,
  add column if not exists started_at timestamptz,
  add column if not exists submitted_at timestamptz not null default now(),
  add column if not exists mode text not null default 'daily',
  add column if not exists technical_failure boolean not null default false,
  add column if not exists failure_type text;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'attempts_mode_check') then
    alter table public.attempts add constraint attempts_mode_check
      check (mode in ('daily','review','extra','placement'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'attempts_technical_result_check') then
    alter table public.attempts add constraint attempts_technical_result_check
      check (not technical_failure or result = 'skipped');
  end if;
end $$;

create index if not exists ix_attempts_exercise_key on public.attempts(student_id, exercise_key, submitted_at);
create index if not exists ix_attempts_client_session on public.attempts(student_id, client_session_key);
create index if not exists ix_attempts_skill on public.attempts(student_id, skill, submitted_at);

create table if not exists public.student_placements (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  result_cefr text not null,
  instrument_id text not null,
  instrument_version text not null,
  age_band text not null,
  confidence numeric,
  completed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (result_cefr in ('Pre-A1','A1','A2','B1','B2','C1','C2')),
  check (confidence is null or (confidence >= 0 and confidence <= 1))
);
create index if not exists ix_student_placements_latest on public.student_placements(student_id, completed_at desc);

alter table public.student_placements enable row level security;
drop policy if exists placement_read on public.student_placements;
create policy placement_read on public.student_placements for select to authenticated
  using (public.can_view_student(student_id));
drop policy if exists placement_insert on public.student_placements;
create policy placement_insert on public.student_placements for insert to authenticated
  with check (student_id = public.current_student_id() or public.is_staff());
drop policy if exists placement_admin on public.student_placements;
create policy placement_admin on public.student_placements for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create table if not exists public.exercise_mastery (
  student_id uuid not null references public.students(id) on delete cascade,
  exercise_key text not null,
  objective_key text,
  skill text,
  mastery_state text not null default 'new'
    check (mastery_state in ('new','practicing','almost','mastered','needs_review')),
  evidence_score numeric not null default 0,
  attempt_count int not null default 0,
  first_result text,
  last_result text,
  next_review_at date,
  updated_at timestamptz not null default now(),
  primary key (student_id, exercise_key)
);
create index if not exists ix_exercise_mastery_review on public.exercise_mastery(student_id, next_review_at);
create index if not exists ix_exercise_mastery_skill on public.exercise_mastery(student_id, skill);

alter table public.exercise_mastery enable row level security;
drop policy if exists exercise_mastery_read on public.exercise_mastery;
create policy exercise_mastery_read on public.exercise_mastery for select to authenticated
  using (public.can_view_student(student_id));
drop policy if exists exercise_mastery_write on public.exercise_mastery;
create policy exercise_mastery_write on public.exercise_mastery for all to authenticated
  using (student_id = public.current_student_id() or public.is_staff())
  with check (student_id = public.current_student_id() or public.is_staff());

comment on table public.student_placements is 'Resultados versionados de colocación; localStorage es solo caché.';
comment on table public.exercise_mastery is 'Proyección servidor compatible con claves editoriales del banco estático.';
comment on column public.attempts.technical_failure is 'Fallo técnico no atribuible al alumno; excluido de accuracy/mastery/rewards.';

commit;
