-- ============================================================
--  Interlanguage · Migración 0008 · Reserva de llamadas (web pública)
--
--  La familia elige día y hora en el formulario de la web y la Edge Function «call-booking»
--  crea la cita en Google Calendar. Esta migración guarda la configuración, las reservas
--  y los avisos por correo, y hace en la base de datos lo que tiene que ser atómico:
--   · nunca dos llamadas solapadas (restricción de exclusión, aunque lleguen a la vez);
--   · máximo diario exacto (bloqueo por día);
--   · reintentos y dobles clics sin reservas duplicadas (clave de idempotencia única);
--   · límites de uso por IP y por teléfono (sin guardar la IP: solo un hash con secreto).
--
--  Cómo aplicarla:  Supabase → SQL Editor → New query → pega TODO → Run.
--  Es una sola transacción: si algo falla no se aplica nada.
--
--  No depende de otras migraciones (sirve para el proyecto de la plataforma o para uno propio de la web).
--  Solo usa funciones del núcleo de Postgres (gen_random_uuid, sha256, rangos con GiST).
--
--  La configuración nace DESACTIVADA y sin horarios: Interlanguage no ha confirmado todavía sus franjas.
--  Mientras call_settings.enabled = false, la web no muestra ningún horario (sigue el flujo de siempre).
--
--  Reversión (si hiciera falta):
--    drop table if exists public.call_notifications, public.call_bookings, public.call_exceptions,
--                         public.call_settings, public.call_rate_events cascade;
--    drop function if exists public.call_weekly_hours_valid(jsonb), public.call_get_config(),
--      public.call_active_bookings(timestamptz, timestamptz), public.call_stale_pending(int),
--      public.call_book(uuid, uuid, timestamptz, timestamptz, int, int, int, int, text, text, text, text, text, jsonb, text, text),
--      public.call_booking_by_key(uuid), public.call_claim_event(uuid, int), public.call_end_lease(uuid), public.call_mark_confirmed(uuid),
--      public.call_release(uuid, boolean), public.call_booking_by_token(uuid, text),
--      public.call_mark_cancelled(uuid, text, text), public.call_claim_notifications(int, uuid, boolean),
--      public.call_notification_done(uuid, text, text), public.call_notifications_retry(uuid[]),
--      public.call_rate_hit(text, int, int), public.call_booking_json(public.call_bookings);
-- ============================================================

begin;

-- ------------------------------------------------------------
-- 1) Horario semanal válido: {"mon":[["10:00","13:00"],["16:00","19:00"]], "tue":[…], …}
--    Claves mon…sun; cada franja ["HH:MM","HH:MM"] con inicio < fin. Un día sin clave no tiene atención.
-- ------------------------------------------------------------
create or replace function public.call_weekly_hours_valid(p jsonb)
returns boolean language plpgsql immutable as $$
declare
  k text; v jsonb; r jsonb;
begin
  if p is null or jsonb_typeof(p) <> 'object' then return false; end if;
  for k, v in select * from jsonb_each(p) loop
    if k not in ('mon','tue','wed','thu','fri','sat','sun') then return false; end if;
    if jsonb_typeof(v) <> 'array' then return false; end if;
    for r in select * from jsonb_array_elements(v) loop
      if jsonb_typeof(r) <> 'array' or jsonb_array_length(r) <> 2 then return false; end if;
      if jsonb_typeof(r->0) <> 'string' or jsonb_typeof(r->1) <> 'string' then return false; end if;
      if (r->>0) !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' or (r->>1) !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' then return false; end if;
      if (r->>0) >= (r->>1) then return false; end if;   -- HH:MM con ceros: el orden de texto es el horario
    end loop;
  end loop;
  return true;
end $$;

-- ------------------------------------------------------------
-- 2) Configuración (una sola fila). Se edita en Supabase → Table Editor → call_settings.
--    La duración es fija (30 min). El resto NO está confirmado: nace vacío y desactivado,
--    y no se puede activar sin rellenar horario, margen, antelación y semanas.
-- ------------------------------------------------------------
create table public.call_settings (
  id                 boolean primary key default true check (id),
  enabled            boolean not null default false,
  timezone           text    not null default 'Europe/Madrid' check (timezone = 'Europe/Madrid'),
  slot_minutes       int     not null default 30 check (slot_minutes = 30),
  weekly_hours       jsonb   not null default '{}'::jsonb,
  buffer_minutes     int     check (buffer_minutes between 0 and 240),          -- margen entre llamadas (y alrededor de otros eventos)
  min_notice_minutes int     check (min_notice_minutes between 0 and 43200),   -- antelación mínima
  bookable_weeks     int     check (bookable_weeks between 1 and 26),          -- semanas reservables desde hoy
  max_per_day        int     check (max_per_day between 1 and 48),             -- vacío = sin máximo diario
  notes              text,
  updated_at         timestamptz not null default now(),
  constraint call_settings_hours_ok check (public.call_weekly_hours_valid(weekly_hours)),
  constraint call_settings_ready check (
    not enabled
    or (weekly_hours <> '{}'::jsonb and buffer_minutes is not null and min_notice_minutes is not null and bookable_weeks is not null)
  )
);
insert into public.call_settings (id) values (true);

-- ------------------------------------------------------------
-- 3) Excepciones: festivos, ausencias o franjas cerradas (de starts_on a ends_on, ambos incluidos).
--    Sin horas = todo el día cerrado; con from_time/to_time = solo esa franja cada uno de esos días.
-- ------------------------------------------------------------
create table public.call_exceptions (
  id         uuid primary key default gen_random_uuid(),
  starts_on  date not null,
  ends_on    date not null,
  from_time  time,
  to_time    time,
  kind       text not null default 'ausencia' check (kind in ('festivo','ausencia','otro')),
  note       text,
  created_at timestamptz not null default now(),
  check (ends_on >= starts_on),
  check ((from_time is null and to_time is null) or (from_time is not null and to_time is not null and from_time < to_time))
);
create index call_exceptions_ends_on on public.call_exceptions (ends_on);

-- ------------------------------------------------------------
-- 4) Reservas.
--    pending   = hueco retenido mientras se crea el evento en Google (hold_until); lease_until evita que dos
--                peticiones creen el evento a la vez.
--    confirmed = evento creado en Google. cancelled = cancelada. expired = no llegó a confirmarse (hueco libre).
--    block_range = [inicio, fin + margen): dos reservas activas no pueden solaparse (restricción de exclusión),
--    así que el margen entre llamadas también lo garantiza la base de datos.
-- ------------------------------------------------------------
create table public.call_bookings (
  id                uuid primary key default gen_random_uuid(),
  idempotency_key   uuid not null unique,
  status            text not null default 'pending' check (status in ('pending','confirmed','cancelled','expired')),
  starts_at         timestamptz not null,
  ends_at           timestamptz not null,
  block_range       tstzrange not null,
  local_date        date generated always as ((starts_at at time zone 'Europe/Madrid')::date) stored,
  hold_until        timestamptz not null,
  lease_until       timestamptz,
  google_event_id   text generated always as ('il' || replace(id::text, '-', '')) stored,   -- id del evento: determinista (base32hex)
  phone             text not null,
  phone_hash        text not null,
  email             text not null,
  family_name       text not null,
  lang              text not null default 'es' check (lang in ('es','en')),
  consult           jsonb not null default '{}'::jsonb,
  cancel_token_hash text not null,
  source_ip_hash    text,
  created_at        timestamptz not null default now(),
  confirmed_at      timestamptz,
  cancelled_at      timestamptz,
  cancelled_by      text check (cancelled_by in ('familia','equipo','sistema')),
  updated_at        timestamptz not null default now(),
  check (ends_at > starts_at),
  check (lower(block_range) = starts_at and upper(block_range) >= ends_at),
  constraint call_bookings_no_overlap exclude using gist (block_range with &&) where (status in ('pending','confirmed'))
);
create index call_bookings_day_active   on public.call_bookings (local_date) where status in ('pending','confirmed');
create index call_bookings_pending      on public.call_bookings (hold_until) where status = 'pending';
create index call_bookings_phone_active on public.call_bookings (phone_hash) where status in ('pending','confirmed');

-- ------------------------------------------------------------
-- 5) Avisos por correo (uno por reserva y tipo: no se duplican). Si el correo falla, la reserva sigue confirmada
--    y el aviso queda para reintentar. pending_config = el correo aún no está configurado (no se ha enviado).
-- ------------------------------------------------------------
create table public.call_notifications (
  id              uuid primary key default gen_random_uuid(),
  booking_id      uuid not null references public.call_bookings(id) on delete cascade,
  kind            text not null check (kind in ('familia_reserva','equipo_reserva','familia_cancelacion','equipo_cancelacion')),
  status          text not null default 'pending' check (status in ('pending','sending','sent','failed','pending_config')),
  attempts        int  not null default 0,
  last_error      text,
  next_attempt_at timestamptz not null default now(),
  lease_until     timestamptz,
  sent_at         timestamptz,
  created_at      timestamptz not null default now(),
  unique (booking_id, kind)
);
create index call_notifications_due on public.call_notifications (next_attempt_at) where status <> 'sent';

-- ------------------------------------------------------------
-- 6) Límites de uso (antiabuso). bucket = tipo + hash con secreto de la IP o del teléfono (nunca el dato en claro).
-- ------------------------------------------------------------
create table public.call_rate_events (
  bucket text not null,
  at     timestamptz not null default now()
);
create index call_rate_events_bucket_at on public.call_rate_events (bucket, at);

-- ============================================================
--  Funciones (las llama solo la Edge Function con la clave de servidor)
-- ============================================================

-- Reserva en JSON para la función (sin el hash del enlace de cancelación)
create or replace function public.call_booking_json(b public.call_bookings)
returns jsonb language sql immutable as $$
  select to_jsonb(b) - 'cancel_token_hash' - 'source_ip_hash'
$$;

-- Configuración + excepciones vigentes
create or replace function public.call_get_config()
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'settings', (select to_jsonb(s) from public.call_settings s where s.id),
    'exceptions', coalesce((
      select jsonb_agg(to_jsonb(e) order by e.starts_on)
      from public.call_exceptions e
      where e.ends_on >= (now() at time zone 'Europe/Madrid')::date - 1
    ), '[]'::jsonb),
    'now', now()
  )
$$;

-- Reservas activas que tocan un intervalo (para calcular huecos). stale = pendiente caducada aún sin revisar.
create or replace function public.call_active_bookings(p_from timestamptz, p_to timestamptz)
returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(jsonb_build_object(
      'id', b.id, 'status', b.status, 'starts_at', b.starts_at, 'ends_at', b.ends_at, 'local_date', b.local_date,
      'stale', (b.status = 'pending' and b.hold_until < now() and (b.lease_until is null or b.lease_until < now()))
    ) order by b.starts_at), '[]'::jsonb)
  from public.call_bookings b
  where b.status in ('pending','confirmed')
    and b.block_range && tstzrange(p_from, p_to, '[)')
$$;

-- Pendientes caducadas (la función comprueba en Google si su evento llegó a crearse antes de liberarlas)
create or replace function public.call_stale_pending(p_limit int)
returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(public.call_booking_json(b) order by b.starts_at), '[]'::jsonb)
  from (
    select * from public.call_bookings
    where status = 'pending' and hold_until < now() and (lease_until is null or lease_until < now())
    order by starts_at
    limit greatest(p_limit, 0)
  ) b
$$;

-- Reserva atómica. Devuelve {ok:true, existing, booking} o {ok:false, reason}.
--   reason: slot_taken (hueco ocupado) · day_full (máximo diario) · too_many (demasiadas reservas activas
--           para ese teléfono) · key_mismatch (la misma clave para otra hora u otro teléfono)
create or replace function public.call_book(
  p_id                     uuid,    -- lo genera la función (el enlace de cancelación se deriva de él)
  p_idempotency_key        uuid,
  p_starts_at              timestamptz,
  p_ends_at                timestamptz,
  p_buffer_minutes         int,
  p_max_per_day            int,     -- null = sin máximo
  p_max_active_per_phone   int,
  p_hold_seconds           int,
  p_phone                  text,
  p_phone_hash             text,
  p_email                  text,
  p_family_name            text,
  p_lang                   text,
  p_consult                jsonb,
  p_cancel_token_hash      text,
  p_source_ip_hash         text
) returns jsonb language plpgsql as $$
declare
  b public.call_bookings;
  v_day date := (p_starts_at at time zone 'Europe/Madrid')::date;
  n int;
begin
  -- Reintento o doble clic con la misma clave: devuelve la reserva que ya existe
  select * into b from public.call_bookings where idempotency_key = p_idempotency_key;
  if found then
    if b.starts_at <> p_starts_at or b.phone_hash <> p_phone_hash then
      return jsonb_build_object('ok', false, 'reason', 'key_mismatch');
    end if;
    return jsonb_build_object('ok', true, 'existing', true, 'booking', public.call_booking_json(b));
  end if;

  -- Las reservas del mismo día se atienden de una en una: el máximo diario es exacto aunque lleguen a la vez
  perform pg_advisory_xact_lock(hashtextextended('il_calls_day:' || v_day::text, 0));

  -- Pudo entrar otra petición con la misma clave mientras esperábamos el bloqueo
  select * into b from public.call_bookings where idempotency_key = p_idempotency_key;
  if found then
    if b.starts_at <> p_starts_at or b.phone_hash <> p_phone_hash then
      return jsonb_build_object('ok', false, 'reason', 'key_mismatch');
    end if;
    return jsonb_build_object('ok', true, 'existing', true, 'booking', public.call_booking_json(b));
  end if;

  if p_max_per_day is not null then
    select count(*) into n from public.call_bookings where local_date = v_day and status in ('pending','confirmed');
    if n >= p_max_per_day then
      return jsonb_build_object('ok', false, 'reason', 'day_full');
    end if;
  end if;

  select count(*) into n from public.call_bookings
   where phone_hash = p_phone_hash and status in ('pending','confirmed') and ends_at > now();
  if n >= p_max_active_per_phone then
    return jsonb_build_object('ok', false, 'reason', 'too_many');
  end if;

  begin
    insert into public.call_bookings (
      id, idempotency_key, status, starts_at, ends_at, block_range, hold_until,
      phone, phone_hash, email, family_name, lang, consult, cancel_token_hash, source_ip_hash
    ) values (
      p_id, p_idempotency_key, 'pending', p_starts_at, p_ends_at,
      tstzrange(p_starts_at, p_ends_at + make_interval(mins => greatest(p_buffer_minutes, 0)), '[)'),
      now() + make_interval(secs => p_hold_seconds),
      p_phone, p_phone_hash, p_email, p_family_name, p_lang, coalesce(p_consult, '{}'::jsonb),
      p_cancel_token_hash, p_source_ip_hash
    ) returning * into b;
  exception
    when exclusion_violation then
      return jsonb_build_object('ok', false, 'reason', 'slot_taken');
    when unique_violation then
      select * into b from public.call_bookings where idempotency_key = p_idempotency_key;
      if found then
        return jsonb_build_object('ok', true, 'existing', true, 'booking', public.call_booking_json(b));
      end if;
      raise;
  end;

  return jsonb_build_object('ok', true, 'existing', false, 'booking', public.call_booking_json(b));
end $$;

create or replace function public.call_booking_by_key(p_idempotency_key uuid)
returns jsonb language sql stable as $$
  select public.call_booking_json(b) from public.call_bookings b where b.idempotency_key = p_idempotency_key
$$;

-- Turno para crear el evento en Google: solo una petición a la vez por reserva.
-- {ok:true, booking} si lo ha conseguido; {ok:false, booking} si otra lo tiene o la reserva ya no está pendiente.
create or replace function public.call_claim_event(p_id uuid, p_lease_seconds int)
returns jsonb language plpgsql as $$
declare b public.call_bookings;
begin
  update public.call_bookings
     set lease_until = now() + make_interval(secs => p_lease_seconds), updated_at = now()
   where id = p_id and status = 'pending' and (lease_until is null or lease_until < now())
  returning * into b;
  if found then
    return jsonb_build_object('ok', true, 'booking', public.call_booking_json(b));
  end if;
  select * into b from public.call_bookings where id = p_id;
  return jsonb_build_object('ok', false, 'booking', case when found then public.call_booking_json(b) end);
end $$;

-- Suelta el turno tras un error pasajero de Google: el reintento de la familia puede seguir enseguida
-- (la reserva sigue pendiente y retenida hasta hold_until).
create or replace function public.call_end_lease(p_id uuid)
returns void language sql as $$
  update public.call_bookings set lease_until = null, updated_at = now() where id = p_id and status = 'pending'
$$;

-- El evento ya existe en Google: la reserva queda confirmada y se preparan los dos avisos (familia y equipo).
create or replace function public.call_mark_confirmed(p_id uuid)
returns jsonb language plpgsql as $$
declare b public.call_bookings;
begin
  update public.call_bookings
     set status = 'confirmed', confirmed_at = now(), lease_until = null, updated_at = now()
   where id = p_id and status = 'pending'
  returning * into b;
  if not found then
    select * into b from public.call_bookings where id = p_id;
    if not found then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;
    if b.status <> 'confirmed' then
      return jsonb_build_object('ok', false, 'reason', 'status_' || b.status, 'booking', public.call_booking_json(b));
    end if;
  end if;
  insert into public.call_notifications (booking_id, kind)
  values (b.id, 'familia_reserva'), (b.id, 'equipo_reserva')
  on conflict (booking_id, kind) do nothing;
  return jsonb_build_object('ok', true, 'booking', public.call_booking_json(b));
end $$;

-- Libera una pendiente cuyo evento NO existe en Google (comprobado por la función).
-- p_only_stale = true: solo si ya caducó (revisión de pendientes antiguas); false: la petición que tenía el turno.
create or replace function public.call_release(p_id uuid, p_only_stale boolean)
returns boolean language plpgsql as $$
begin
  update public.call_bookings
     set status = 'expired', lease_until = null, updated_at = now()
   where id = p_id and status = 'pending'
     and (not p_only_stale or (hold_until < now() and (lease_until is null or lease_until < now())));
  return found;
end $$;

-- Datos de una reserva para la página de cancelación (solo con su enlace secreto)
create or replace function public.call_booking_by_token(p_id uuid, p_token_hash text)
returns jsonb language sql stable as $$
  select public.call_booking_json(b) from public.call_bookings b
   where b.id = p_id and b.cancel_token_hash = p_token_hash
$$;

-- Cancelación (la función ya ha borrado el evento de Google). Libera el hueco y prepara los avisos.
create or replace function public.call_mark_cancelled(p_id uuid, p_token_hash text, p_by text)
returns jsonb language plpgsql as $$
declare b public.call_bookings;
begin
  update public.call_bookings
     set status = 'cancelled', cancelled_at = now(), cancelled_by = p_by, lease_until = null, updated_at = now()
   where id = p_id and cancel_token_hash = p_token_hash and status = 'confirmed'
  returning * into b;
  if not found then
    select * into b from public.call_bookings where id = p_id and cancel_token_hash = p_token_hash;
    if not found then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;
    if b.status <> 'cancelled' then
      return jsonb_build_object('ok', false, 'reason', 'status_' || b.status, 'booking', public.call_booking_json(b));
    end if;
    return jsonb_build_object('ok', true, 'already', true, 'booking', public.call_booking_json(b));
  end if;
  insert into public.call_notifications (booking_id, kind)
  values (b.id, 'familia_cancelacion'), (b.id, 'equipo_cancelacion')
  on conflict (booking_id, kind) do nothing;
  return jsonb_build_object('ok', true, 'already', false, 'booking', public.call_booking_json(b));
end $$;

-- Avisos pendientes: los reserva para enviarlos (nadie más los envía mientras tanto) y devuelve los datos.
-- p_with_pending_config = true solo cuando el correo ya está configurado.
create or replace function public.call_claim_notifications(p_limit int, p_booking uuid, p_with_pending_config boolean)
returns jsonb language plpgsql as $$
declare res jsonb;
begin
  with c as (
    select n.id from public.call_notifications n
     where (p_booking is null or n.booking_id = p_booking)
       and (
         (n.status in ('pending','failed') and n.next_attempt_at <= now())
         or (p_with_pending_config and n.status = 'pending_config')
         or (n.status = 'sending' and n.lease_until < now())
       )
     order by n.created_at
     limit greatest(p_limit, 0)
     for update skip locked
  ), u as (
    update public.call_notifications n
       set status = 'sending', lease_until = now() + interval '90 seconds', attempts = n.attempts + 1
      from c where n.id = c.id
    returning n.*
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', u.id, 'kind', u.kind, 'attempts', u.attempts,
           'booking', public.call_booking_json(b)) order by u.created_at), '[]'::jsonb)
    into res
    from u join public.call_bookings b on b.id = u.booking_id;
  return res;
end $$;

-- Resultado de un envío: sent · failed (se reintenta: 5 min, 30 min, 2 h, 12 h; luego espera a un reintento manual)
-- · pending_config (no se ha intentado: falta configurar el correo).
create or replace function public.call_notification_done(p_id uuid, p_status text, p_error text)
returns void language plpgsql as $$
begin
  if p_status not in ('sent','failed','pending_config') then
    raise exception 'estado de aviso no válido: %', p_status;
  end if;
  update public.call_notifications n
     set status = p_status,
         lease_until = null,
         last_error = case when p_status = 'sent' then null else left(p_error, 500) end,
         sent_at = case when p_status = 'sent' then now() else n.sent_at end,
         attempts = case when p_status = 'pending_config' then greatest(n.attempts - 1, 0) else n.attempts end,
         next_attempt_at = case
           when p_status = 'failed' then now() + case n.attempts
             when 1 then interval '5 minutes' when 2 then interval '30 minutes'
             when 3 then interval '2 hours' when 4 then interval '12 hours'
             else interval '100 years' end
           else now() end
   where n.id = p_id;
end $$;

-- Reintento manual (petición de administración): vuelve a poner en cola los avisos fallidos o sin configurar.
create or replace function public.call_notifications_retry(p_ids uuid[])
returns int language plpgsql as $$
declare n int;
begin
  update public.call_notifications
     set next_attempt_at = now(), status = case when status = 'pending_config' then 'pending_config' else 'failed' end
   where status in ('failed','pending_config')
     and (p_ids is null or id = any(p_ids));
  get diagnostics n = row_count;
  return n;
end $$;

-- Límite de uso: true = permitido (y se anota); false = se ha superado el límite en esa ventana.
create or replace function public.call_rate_hit(p_bucket text, p_limit int, p_window_seconds int)
returns boolean language plpgsql as $$
declare n int;
begin
  perform pg_advisory_xact_lock(hashtextextended('il_calls_rate:' || p_bucket, 0));
  select count(*) into n from public.call_rate_events
   where bucket = p_bucket and at > now() - make_interval(secs => p_window_seconds);
  if n >= p_limit then return false; end if;
  insert into public.call_rate_events (bucket) values (p_bucket);
  if random() < 0.02 then
    delete from public.call_rate_events where at < now() - interval '2 days';
  end if;
  return true;
end $$;

-- ============================================================
--  Permisos: nadie desde el navegador. Solo la clave de servidor (service_role) de la Edge Function.
-- ============================================================
alter table public.call_settings      enable row level security;
alter table public.call_exceptions    enable row level security;
alter table public.call_bookings      enable row level security;
alter table public.call_notifications enable row level security;
alter table public.call_rate_events   enable row level security;
-- (sin políticas: anon y authenticated no ven ni tocan nada)

revoke all on table public.call_settings, public.call_exceptions, public.call_bookings,
                    public.call_notifications, public.call_rate_events from public, anon, authenticated;
grant select, insert, update, delete on table public.call_settings, public.call_exceptions, public.call_bookings,
                    public.call_notifications, public.call_rate_events to service_role;

revoke all on function
  public.call_weekly_hours_valid(jsonb), public.call_booking_json(public.call_bookings), public.call_get_config(),
  public.call_active_bookings(timestamptz, timestamptz), public.call_stale_pending(int),
  public.call_book(uuid, uuid, timestamptz, timestamptz, int, int, int, int, text, text, text, text, text, jsonb, text, text),
  public.call_booking_by_key(uuid), public.call_claim_event(uuid, int), public.call_end_lease(uuid), public.call_mark_confirmed(uuid),
  public.call_release(uuid, boolean), public.call_booking_by_token(uuid, text), public.call_mark_cancelled(uuid, text, text),
  public.call_claim_notifications(int, uuid, boolean), public.call_notification_done(uuid, text, text),
  public.call_notifications_retry(uuid[]), public.call_rate_hit(text, int, int)
  from public, anon, authenticated;

grant execute on function
  public.call_weekly_hours_valid(jsonb), public.call_booking_json(public.call_bookings), public.call_get_config(),
  public.call_active_bookings(timestamptz, timestamptz), public.call_stale_pending(int),
  public.call_book(uuid, uuid, timestamptz, timestamptz, int, int, int, int, text, text, text, text, text, jsonb, text, text),
  public.call_booking_by_key(uuid), public.call_claim_event(uuid, int), public.call_end_lease(uuid), public.call_mark_confirmed(uuid),
  public.call_release(uuid, boolean), public.call_booking_by_token(uuid, text), public.call_mark_cancelled(uuid, text, text),
  public.call_claim_notifications(int, uuid, boolean), public.call_notification_done(uuid, text, text),
  public.call_notifications_retry(uuid[]), public.call_rate_hit(text, int, int)
  to service_role;

commit;
