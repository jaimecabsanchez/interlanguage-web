-- ============================================================
--  Interlanguage · Migración 0003 · Auditoría de acciones del admin
--  Permite que un ADMIN registre SUS propias acciones (editar alumno,
--  activar/desactivar acceso, crear grupo…) en audit_log desde el panel.
--  Sigue siendo append-only y solo el admin lo lee (política de 0001).
--
--  Aplicar: SQL Editor → pegar → Run.
-- ============================================================

begin;

drop policy if exists audit_admin_insert on public.audit_log;
create policy audit_admin_insert on public.audit_log
  for insert to authenticated
  with check (public.is_admin() and actor_user_id = auth.uid());

commit;
