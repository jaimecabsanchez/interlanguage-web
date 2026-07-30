-- ============================================================
--  Interlanguage · Migración 0004 · Catálogo de medallas
--  Siembra la tabla rewards con las medallas del sistema de
--  motivación (mismos ids que plataforma/motor/motivacion.js).
--  Necesario para que se puedan OTORGAR (student_rewards -> rewards).
--
--  Aplicar: SQL Editor → pegar → Run.
-- ============================================================

begin;

insert into public.rewards (id, type, name, family, criteria) values
  ('streak_2',       'badge', '2 días seguidos',      'constancia', '{"streak":2}'),
  ('streak_5',       'badge', '5 días seguidos',      'constancia', '{"streak":5}'),
  ('streak_10',      'badge', '10 días seguidos',     'constancia', '{"streak":10}'),
  ('streak_30',      'badge', 'Un mes de racha',      'constancia', '{"streak":30}'),
  ('aciertos_5',     'badge', '5 aciertos seguidos',  'aciertos',   '{"correct_streak":5}'),
  ('aciertos_10',    'badge', '10 aciertos seguidos', 'aciertos',   '{"correct_streak":10}'),
  ('pleno',          'badge', 'Sesión perfecta',      'aciertos',   '{"all_correct":true}'),
  ('record_racha',   'badge', 'Nuevo récord de racha','mejora',     '{"beats_best":true}'),
  ('primera',        'badge', 'Primera lección',      'dominio',    '{"lessons":1}'),
  ('diez_lecciones', 'badge', '10 lecciones',         'dominio',    '{"lessons":10}')
on conflict (id) do nothing;

commit;
