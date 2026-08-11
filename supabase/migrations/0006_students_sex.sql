-- El administrador asigna el sexo del alumno; la app lo usa únicamente para
-- elegir la base ilustrada del avatar. Los registros antiguos pueden quedar
-- temporalmente sin asignar hasta que un administrador los revise.
alter table public.students add column if not exists sex text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'students_sex_check'
  ) then
    alter table public.students
      add constraint students_sex_check check (sex in ('male', 'female'));
  end if;
end $$;

comment on column public.students.sex is
  'Sexo asignado por administración para seleccionar la base del avatar: male | female';
