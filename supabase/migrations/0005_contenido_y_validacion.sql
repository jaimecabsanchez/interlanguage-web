-- ============================================================
--  Interlanguage · Migración 0005 · Contenido de muestra en la BD
--  + validación EN SERVIDOR y registro de intentos.
--
--  Qué hace:
--   1) Siembra una unidad real PUBLICADA con 1 actividad de selección (P1),
--      sus opciones y su answer_key (la solución vive SOLO en la BD).
--   2) Crea la función submit_attempt(): valida la respuesta en el servidor
--      (sin devolver nunca la solución) y REGISTRA el intento.
--
--  Aplicar: SQL Editor → pegar → Run.
-- ============================================================

begin;

-- Ids fijos para poder enlazar opciones/answer_key de forma determinista
-- unit  u:  a1111111-... · objective o:  a2222222-... · activity A: a3333333-...
-- opción correcta: aaaa0001-...
insert into public.units (id, level_id, title, theme, "order", status, created_by)
values ('a1111111-1111-1111-1111-111111111111',
        (select id from public.levels order by "order" limit 1),
        'Mi rutina (muestra)', 'Acciones del día', 1, 'published', null)
on conflict (id) do nothing;

insert into public.objectives (id, unit_id, skill_id, can_do, difficulty, "order", status)
values ('a2222222-2222-2222-2222-222222222222',
        'a1111111-1111-1111-1111-111111111111', 'vocabulary',
        'Reconozco acciones del día', 1, 1, 'published')
on conflict (id) do nothing;

insert into public.activities (id, objective_id, template, level_id, skill_id, title, instruction, explanation, status, created_by)
values ('a3333333-3333-3333-3333-333333333333',
        'a2222222-2222-2222-2222-222222222222', 'p1',
        (select id from public.levels order by "order" limit 1), 'vocabulary',
        'desayunar', '¿Cuál es "desayunar"?',
        'have breakfast = desayunar.', 'published', null)
on conflict (id) do nothing;

insert into public.options (id, activity_id, label, "order") values
  ('aaaa0001-0001-0001-0001-000000000001','a3333333-3333-3333-3333-333333333333','have breakfast',0),
  ('aaaa0002-0002-0002-0002-000000000002','a3333333-3333-3333-3333-333333333333','take a shower',1),
  ('aaaa0003-0003-0003-0003-000000000003','a3333333-3333-3333-3333-333333333333','go to bed',2),
  ('aaaa0004-0004-0004-0004-000000000004','a3333333-3333-3333-3333-333333333333','go to school',3)
on conflict (id) do nothing;

-- La SOLUCIÓN vive aparte (RLS: el alumno NO la puede leer)
insert into public.answer_keys (id, activity_id, correct, accepted, match_rule)
values ('a4444444-4444-4444-4444-444444444444',
        'a3333333-3333-3333-3333-333333333333',
        jsonb_build_object('option_id','aaaa0001-0001-0001-0001-000000000001'),
        '[]'::jsonb, 'exact')
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- Validación EN SERVIDOR + registro de intento (para plantillas de selección)
-- Nunca devuelve la solución; el alumno solo puede registrar SUS intentos.
-- ------------------------------------------------------------
create or replace function public.submit_attempt(
  p_activity uuid,
  p_option uuid,
  p_attempt_no int default 1,
  p_hint boolean default false,
  p_duration int default null,
  p_session uuid default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_student uuid;
  v_correct_option uuid;
  v_objective uuid;
  v_explanation text;
  v_is_correct boolean;
begin
  v_student := public.current_student_id();
  if v_student is null then
    return jsonb_build_object('error', 'No autorizado');
  end if;

  select (ak.correct->>'option_id')::uuid into v_correct_option
    from public.answer_keys ak where ak.activity_id = p_activity limit 1;
  select a.objective_id, a.explanation into v_objective, v_explanation
    from public.activities a where a.id = p_activity;

  v_is_correct := (p_option is not null and p_option = v_correct_option);

  insert into public.attempts
    (student_id, activity_id, objective_id, result, attempt_no, hint_used, response, recovery_type, duration_ms, practice_session_id)
  values
    (v_student, p_activity, v_objective,
     case when v_is_correct then 'correct' else 'incorrect' end,
     coalesce(p_attempt_no, 1), coalesce(p_hint, false),
     jsonb_build_object('option_id', p_option), 'recognition', p_duration, p_session);

  -- Devuelve SOLO si acertó + la explicación (nunca la opción correcta)
  return jsonb_build_object('correct', v_is_correct,
                            'explanation', case when v_is_correct then null else v_explanation end);
end $$;

grant execute on function public.submit_attempt(uuid, uuid, int, boolean, int, uuid) to authenticated;

commit;
