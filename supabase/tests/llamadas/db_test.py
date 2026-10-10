#!/usr/bin/env python3
# ============================================================
#  Reserva de llamadas · pruebas de BASE DE DATOS (Postgres real, conexiones en paralelo)
#
#  Comprueba la migración 0008: permisos, configuración, reservas simultáneas al mismo hueco,
#  margen entre llamadas, máximo diario con peticiones a la vez, idempotencia, turnos para crear
#  el evento, cancelación, avisos y límites de uso.
#
#  NO usa el proyecto de Supabase: crea y borra una base de datos de usar y tirar en un Postgres local
#  (16 o superior) e imita los roles de Supabase (anon, authenticated, service_role).
#
#  Uso:
#     pip install "psycopg[binary]"
#     IL_TEST_PG="postgresql://postgres@127.0.0.1:55432/postgres" python3 supabase/tests/llamadas/db_test.py
#  Sin IL_TEST_PG se salta (código 77).
# ============================================================
import os, sys, uuid, threading, datetime as dt, json

PG = os.environ.get('IL_TEST_PG')
if not PG:
    print('SKIP: define IL_TEST_PG con un Postgres local de pruebas (nunca el de producción).')
    sys.exit(77)

import psycopg
from psycopg.types.json import Jsonb

HERE = os.path.dirname(os.path.abspath(__file__))
MIGRATION = os.path.join(HERE, '..', '..', 'migrations', '0008_reserva_llamadas.sql')
DB = 'il_calls_test_%s' % uuid.uuid4().hex[:8]

results = []
def ok(cond, msg, extra=''):
    results.append(bool(cond))
    print(('OK    ' if cond else 'FALLA ') + msg + ((' ' + str(extra)) if extra != '' else ''), flush=True)

def admin_url(dbname):
    base = PG.rsplit('/', 1)[0]
    return base + '/' + dbname

def setup():
    with psycopg.connect(PG, autocommit=True) as c:
        c.execute('create database %s' % DB)
    with psycopg.connect(admin_url(DB), autocommit=True) as c:
        # Roles y privilegios por defecto como en Supabase (para comprobar que la migración los recorta)
        for r, extra in (('anon', ''), ('authenticated', ''), ('service_role', ' bypassrls')):
            c.execute("do $$ begin if not exists (select 1 from pg_roles where rolname = '%s') then create role %s nologin%s; end if; end $$" % (r, r, extra))
        c.execute('grant usage on schema public to anon, authenticated, service_role')
        c.execute('alter default privileges in schema public grant all on tables to anon, authenticated, service_role')
        c.execute('alter default privileges in schema public grant all on functions to anon, authenticated, service_role')
        c.execute('alter default privileges in schema public grant all on sequences to anon, authenticated, service_role')
        sql = open(MIGRATION, encoding='utf-8').read()
        c.execute(sql)

def teardown():
    with psycopg.connect(PG, autocommit=True) as c:
        c.execute("select pg_terminate_backend(pid) from pg_stat_activity where datname = %s and pid <> pg_backend_pid()", (DB,))
        c.execute('drop database if exists %s' % DB)

def conn(role='service_role'):
    c = psycopg.connect(admin_url(DB), autocommit=True)
    if role:
        c.execute('set role %s' % role)
    return c

def book(c, key, start, minutes=30, buffer=0, max_day=None, max_phone=3, hold=600, phone='+34600000001'):
    end = start + dt.timedelta(minutes=minutes)
    return c.execute(
        'select public.call_book(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
        (uuid.uuid4(), key, start, end, buffer, max_day, max_phone, hold, phone, 'h:' + phone, 'familia@example.com', 'Familia Prueba', 'es',
         Jsonb({'service': 'extranjero'}), 'hash-' + str(key), 'iphash')).fetchone()[0]

def parallel(n, fn):
    barrier = threading.Barrier(n)
    out = [None] * n
    def run(i):
        c = conn()
        try:
            barrier.wait()
            out[i] = fn(c, i)
        except Exception as e:
            out[i] = {'error': repr(e)}
        finally:
            c.close()
    ts = [threading.Thread(target=run, args=(i,)) for i in range(n)]
    [t.start() for t in ts]
    [t.join() for t in ts]
    return out

UTC = dt.timezone.utc
D0 = dt.datetime(2030, 3, 4, 9, 0, tzinfo=UTC)   # lunes lejano: las pruebas no dependen de la fecha de hoy

try:
    setup()
    print('== Base de datos de pruebas:', DB)

    # ---------- permisos ----------
    a = conn('anon')
    for q in ('select * from public.call_bookings', 'select * from public.call_settings', 'select public.call_get_config()',
              "select public.call_rate_hit('x', 1, 60)"):
        try:
            a.execute(q); ok(False, 'anon NO puede: ' + q)
        except psycopg.errors.InsufficientPrivilege:
            ok(True, 'anon no puede: ' + q)
    a.close()
    u = conn('authenticated')
    try:
        u.execute('select * from public.call_bookings'); ok(False, 'authenticated NO puede leer reservas')
    except psycopg.errors.InsufficientPrivilege:
        ok(True, 'authenticated no puede leer reservas')
    u.close()

    s = conn()
    cfg = s.execute('select public.call_get_config()').fetchone()[0]
    ok(cfg['settings']['enabled'] is False and cfg['settings']['weekly_hours'] == {} and cfg['settings']['slot_minutes'] == 30,
       'la configuración nace desactivada, sin horario y con 30 minutos', cfg['settings'])

    # ---------- configuración ----------
    p = conn(None)   # como el panel de Supabase (postgres)
    try:
        p.execute('update public.call_settings set enabled = true'); ok(False, 'no se puede activar sin horario ni márgenes')
    except psycopg.errors.CheckViolation:
        ok(True, 'no se puede activar sin horario, margen, antelación y semanas')
    for bad in ({'lunes': [['10:00', '12:00']]}, {'mon': [['12:00', '10:00']]}, {'mon': [['9:00', '10:00']]}, {'mon': ['10:00']}):
        try:
            p.execute('update public.call_settings set weekly_hours = %s', (Jsonb(bad),)); ok(False, 'horario no válido rechazado ' + json.dumps(bad))
        except psycopg.errors.CheckViolation:
            ok(True, 'horario no válido rechazado ' + json.dumps(bad))
    p.execute("update public.call_settings set weekly_hours = %s, buffer_minutes = 10, min_notice_minutes = 120, bookable_weeks = 3, enabled = true",
              (Jsonb({'mon': [['10:00', '13:00'], ['16:00', '19:00']], 'thu': [['10:00', '12:00']]}),))
    ok(p.execute('select enabled from public.call_settings').fetchone()[0] is True, 'con todos los valores sí se activa')
    p.execute("update public.call_settings set enabled = false")
    p.close()

    # ---------- misma hora a la vez ----------
    slot = D0
    res = parallel(12, lambda c, i: book(c, uuid.uuid4(), slot, phone='+3460000%04d' % i))
    oks = [r for r in res if r.get('ok')]
    taken = [r for r in res if r.get('reason') == 'slot_taken']
    ok(len(oks) == 1 and len(taken) == 11, '12 peticiones simultáneas al mismo hueco: 1 reserva y 11 «ocupado»', (len(oks), len(taken), [r for r in res if 'error' in r][:1]))

    # ---------- margen entre llamadas ----------
    b2 = D0 + dt.timedelta(hours=3)     # 12:00Z
    r = book(s, uuid.uuid4(), b2, buffer=15, phone='+34611111111')
    ok(r['ok'], 'reserva con margen de 15 min')
    ok(book(s, uuid.uuid4(), b2 + dt.timedelta(minutes=30), buffer=15, phone='+34611111112')['reason'] == 'slot_taken', 'la siguiente media hora queda bloqueada por el margen')
    ok(book(s, uuid.uuid4(), b2 - dt.timedelta(minutes=30), buffer=15, phone='+34611111113')['reason'] == 'slot_taken', 'la media hora anterior tampoco cabe (su margen pisaría esta llamada)')
    ok(book(s, uuid.uuid4(), b2 + dt.timedelta(minutes=45), buffer=15, phone='+34611111114')['ok'], 'a los 45 minutos (30 + margen) sí cabe')

    # ---------- máximo diario con peticiones a la vez ----------
    day = D0 + dt.timedelta(days=1)
    res = parallel(8, lambda c, i: book(c, uuid.uuid4(), day + dt.timedelta(hours=i), max_day=3, phone='+3462000%04d' % i))
    oks = [r for r in res if r.get('ok')]
    full = [r for r in res if r.get('reason') == 'day_full']
    ok(len(oks) == 3 and len(full) == 5, '8 reservas simultáneas en huecos distintos con máximo diario 3: 3 sí y 5 «día completo»', (len(oks), len(full)))

    # ---------- idempotencia (doble clic / reintento) ----------
    key = uuid.uuid4(); slot3 = D0 + dt.timedelta(days=2)
    res = parallel(6, lambda c, i: book(c, key, slot3, phone='+34630000000'))
    ids = {r['booking']['id'] for r in res if r.get('ok')}
    existing = sorted(r.get('existing') for r in res if r.get('ok'))
    ok(len(ids) == 1 and existing.count(False) == 1 and len(existing) == 6, '6 envíos simultáneos con la misma clave: una sola reserva', (len(ids), existing))
    n = s.execute('select count(*) from public.call_bookings where idempotency_key = %s', (key,)).fetchone()[0]
    ok(n == 1, 'en la tabla hay una sola fila para esa clave', n)
    ok(book(s, key, slot3 + dt.timedelta(hours=1), phone='+34630000000')['reason'] == 'key_mismatch', 'la misma clave para otra hora se rechaza')
    bk = res[0]['booking']
    ok(bk['google_event_id'] == 'il' + bk['id'].replace('-', '') and len(bk['google_event_id']) == 34, 'id del evento determinista y válido para Google', bk['google_event_id'])

    # ---------- límite por teléfono ----------
    ph = '+34640000000'
    r1 = book(s, uuid.uuid4(), D0 + dt.timedelta(days=3), phone=ph, max_phone=2)
    r2 = book(s, uuid.uuid4(), D0 + dt.timedelta(days=3, hours=1), phone=ph, max_phone=2)
    r3 = book(s, uuid.uuid4(), D0 + dt.timedelta(days=3, hours=2), phone=ph, max_phone=2)
    ok(r1['ok'] and r2['ok'] and r3.get('reason') == 'too_many', 'un mismo teléfono no acapara huecos (máximo 2 activas)', r3)

    # ---------- turno para crear el evento ----------
    bid = bk['id']
    res = parallel(5, lambda c, i: c.execute('select public.call_claim_event(%s, 45)', (bid,)).fetchone()[0])
    ok(sum(1 for r in res if r.get('ok')) == 1, '5 intentos simultáneos de crear el evento: solo uno tiene el turno')
    conf = s.execute('select public.call_mark_confirmed(%s)', (bid,)).fetchone()[0]
    ok(conf['ok'] and conf['booking']['status'] == 'confirmed' and conf['booking']['lease_until'] is None, 'confirmada y turno liberado')
    ok(s.execute('select public.call_mark_confirmed(%s)', (bid,)).fetchone()[0]['ok'], 'confirmar dos veces no falla (idempotente)')
    kinds = sorted(x[0] for x in s.execute('select kind from public.call_notifications where booking_id = %s', (bid,)).fetchall())
    ok(kinds == ['equipo_reserva', 'familia_reserva'], 'una confirmación = dos avisos, sin duplicados', kinds)
    ok(s.execute('select public.call_claim_event(%s, 45)', (bid,)).fetchone()[0]['ok'] is False, 'una confirmada ya no da turno')
    k9 = uuid.uuid4(); p9 = book(s, k9, D0 + dt.timedelta(days=7), phone='+34690000000')['booking']
    ok(s.execute('select public.call_claim_event(%s, 45)', (p9['id'],)).fetchone()[0]['ok'], 'turno para una pendiente')
    ok(s.execute('select public.call_claim_event(%s, 45)', (p9['id'],)).fetchone()[0]['ok'] is False, 'con el turno cogido, otra petición espera')
    s.execute('select public.call_end_lease(%s)', (p9['id'],))
    ok(s.execute('select public.call_claim_event(%s, 45)', (p9['id'],)).fetchone()[0]['ok'], 'tras un error pasajero se suelta el turno y el reintento puede seguir')

    # ---------- avisos ----------
    claimed = s.execute('select public.call_claim_notifications(10, %s, false)', (bid,)).fetchone()[0]
    ok(len(claimed) == 2 and claimed[0]['booking']['id'] == bid, 'los dos avisos se reservan para enviarlos, con los datos de la reserva')
    again = s.execute('select public.call_claim_notifications(10, %s, false)', (bid,)).fetchone()[0]
    ok(again == [], 'mientras se envían, nadie más los coge')
    fam = [x for x in claimed if x['kind'] == 'familia_reserva'][0]['id']
    staff = [x for x in claimed if x['kind'] == 'equipo_reserva'][0]['id']
    s.execute("select public.call_notification_done(%s, 'failed', 'smtp 500')", (fam,))
    s.execute("select public.call_notification_done(%s, 'sent', null)", (staff,))
    st = dict(s.execute('select kind, status from public.call_notifications where booking_id = %s', (bid,)).fetchall())
    nxt = s.execute("select extract(epoch from next_attempt_at - now()) from public.call_notifications where id = %s", (fam,)).fetchone()[0]
    ok(st == {'familia_reserva': 'failed', 'equipo_reserva': 'sent'} and 240 < float(nxt) < 360, 'fallo registrado, el otro enviado, reintento en ~5 min', (st, round(float(nxt))))
    ok(s.execute('select public.call_claim_notifications(10, %s, false)', (bid,)).fetchone()[0] == [], 'el fallido espera a su hora de reintento')
    ok(s.execute('select public.call_notifications_retry(null)').fetchone()[0] >= 1, 'reintento manual: vuelve a la cola')
    again = s.execute('select public.call_claim_notifications(10, %s, false)', (bid,)).fetchone()[0]
    ok([x['kind'] for x in again] == ['familia_reserva'], 'y solo se reenvía el que falló (no el ya enviado)', [x['kind'] for x in again])
    s.execute("select public.call_notification_done(%s, 'pending_config', 'sin RESEND_API_KEY')", (fam,))
    ok(s.execute('select public.call_claim_notifications(10, %s, false)', (bid,)).fetchone()[0] == [], 'sin correo configurado no se reintenta solo')
    ok(len(s.execute('select public.call_claim_notifications(10, %s, true)', (bid,)).fetchone()[0]) == 1, 'cuando se configura el correo, sí')

    # ---------- cancelación ----------
    tok = 'hash-' + str(key)
    ok(s.execute("select public.call_booking_by_token(%s, 'malo')", (bid,)).fetchone()[0] is None, 'sin el enlace correcto no se ven los datos')
    ok(s.execute("select public.call_mark_cancelled(%s, 'malo', 'familia')", (bid,)).fetchone()[0]['reason'] == 'not_found', 'sin el enlace correcto no se cancela')
    cx = s.execute("select public.call_mark_cancelled(%s, %s, 'familia')", (bid, tok)).fetchone()[0]
    ok(cx['ok'] and cx['booking']['status'] == 'cancelled', 'con el enlace correcto se cancela')
    ok(s.execute("select public.call_mark_cancelled(%s, %s, 'familia')", (bid, tok)).fetchone()[0].get('already') is True, 'cancelar dos veces no falla')
    ok(book(s, uuid.uuid4(), slot3, phone='+34650000000')['ok'], 'el hueco cancelado vuelve a estar libre')
    kinds = sorted(x[0] for x in s.execute('select kind from public.call_notifications where booking_id = %s', (bid,)).fetchall())
    ok('familia_cancelacion' in kinds and 'equipo_cancelacion' in kinds, 'la cancelación prepara sus dos avisos')

    # ---------- pendientes caducadas ----------
    k5 = uuid.uuid4(); t5 = D0 + dt.timedelta(days=5)
    p5 = book(s, k5, t5, phone='+34660000000', hold=600)['booking']
    ok(s.execute('select public.call_release(%s, true)', (p5['id'],)).fetchone()[0] is False, 'una pendiente reciente no se libera como caducada')
    ok(book(s, uuid.uuid4(), t5, phone='+34660000001')['reason'] == 'slot_taken', 'mientras está pendiente, el hueco está ocupado')
    p = conn(None); p.execute("update public.call_bookings set hold_until = now() - interval '1 minute' where id = %s", (p5['id'],)); p.close()
    stale = s.execute('select public.call_stale_pending(10)').fetchone()[0]
    ok(any(x['id'] == p5['id'] for x in stale), 'aparece entre las pendientes caducadas')
    act = s.execute('select public.call_active_bookings(%s, %s)', (t5, t5 + dt.timedelta(hours=1))).fetchone()[0]
    ok(act and act[0]['stale'] is True, 'las reservas activas la marcan como caducada')
    ok(s.execute('select public.call_release(%s, true)', (p5['id'],)).fetchone()[0] is True, 'tras comprobar que no hay evento, se libera')
    ok(book(s, uuid.uuid4(), t5, phone='+34660000001')['ok'], 'y el hueco vuelve a estar libre')
    k6 = uuid.uuid4(); p6 = book(s, k6, D0 + dt.timedelta(days=6), phone='+34670000000')['booking']
    ok(s.execute('select public.call_release(%s, false)', (p6['id'],)).fetchone()[0] is True, 'la petición con turno puede liberar al instante si Google rechazó el evento')

    # ---------- límites de uso ----------
    r = [s.execute("select public.call_rate_hit('t:ip1', 3, 600)").fetchone()[0] for _ in range(4)]
    ok(r == [True, True, True, False], 'límite de uso: 3 permitidos y el 4.º no', r)
    res = parallel(10, lambda c, i: c.execute("select public.call_rate_hit('t:ip2', 5, 600)").fetchone()[0])
    ok(sum(1 for x in res if x is True) == 5, '10 peticiones a la vez con límite 5: exactamente 5', res)

    # ---------- fecha local y cambio de hora ----------
    k7 = uuid.uuid4()
    b7 = book(s, k7, dt.datetime(2030, 10, 27, 0, 30, tzinfo=UTC), phone='+34680000000')['booking']   # 02:30 en Madrid (último domingo de octubre)
    ok(b7['local_date'] == '2030-10-27', 'la fecha local se calcula en hora de Madrid', b7['local_date'])
    b8 = book(s, uuid.uuid4(), dt.datetime(2030, 10, 26, 22, 30, tzinfo=UTC), phone='+34680000001')['booking']  # 00:30 del 27 en Madrid
    ok(b8['local_date'] == '2030-10-27', 'medianoche: 22:30 UTC del sábado es ya domingo en Madrid', b8['local_date'])

    s.close()
finally:
    teardown()

print('\n%d comprobaciones, %d con fallo' % (len(results), results.count(False)))
sys.exit(0 if results and all(results) else 1)
