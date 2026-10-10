#!/usr/bin/env python3
# ============================================================
#  Banco de pruebas local de la reserva de llamadas: imita la parte de PostgREST (la API de Supabase)
#  que usa la Edge Function — POST /rest/v1/rpc/<función> — sobre un Postgres REAL de pruebas.
#
#  Al arrancar crea una base de datos de usar y tirar, imita los roles de Supabase (anon, authenticated,
#  service_role), aplica la migración 0008 y escribe «READY http://127.0.0.1:<puerto>». Al terminar la borra.
#  Cada llamada se ejecuta como service_role (como la clave de servidor), así que también prueba los permisos.
#
#  Solo para pruebas en local; nunca contra el proyecto real. Lo arranca integration.test.mjs.
#     python3 postgrest_shim.py --admin-url postgresql://postgres@127.0.0.1:55432/postgres --key sb_secret_test
# ============================================================
import argparse, json, os, signal, sys, threading, uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import psycopg

HERE = os.path.dirname(os.path.abspath(__file__))
MIGRATION = os.path.join(HERE, '..', '..', '..', 'migrations', '0008_reserva_llamadas.sql')

ap = argparse.ArgumentParser()
ap.add_argument('--admin-url', required=True)
ap.add_argument('--key', required=True)
ap.add_argument('--port', type=int, default=0)
args = ap.parse_args()

DB = 'il_calls_it_%s' % uuid.uuid4().hex[:8]
DB_URL = args.admin_url.rsplit('/', 1)[0] + '/' + DB

def setup():
    with psycopg.connect(args.admin_url, autocommit=True) as c:
        c.execute('create database %s' % DB)
    with psycopg.connect(DB_URL, autocommit=True) as c:
        for r, extra in (('anon', ''), ('authenticated', ''), ('service_role', ' bypassrls')):
            c.execute("do $$ begin if not exists (select 1 from pg_roles where rolname = '%s') then create role %s nologin%s; end if; end $$" % (r, r, extra))
        c.execute('grant usage on schema public to anon, authenticated, service_role')
        for what in ('tables', 'functions', 'sequences'):
            c.execute('alter default privileges in schema public grant all on %s to anon, authenticated, service_role' % what)
        c.execute(open(MIGRATION, encoding='utf-8').read())

def teardown():
    try:
        with psycopg.connect(args.admin_url, autocommit=True) as c:
            c.execute("select pg_terminate_backend(pid) from pg_stat_activity where datname = %s and pid <> pg_backend_pid()", (DB,))
            c.execute('drop database if exists %s' % DB)
    except Exception as e:
        print('no se pudo borrar la base de pruebas:', e, file=sys.stderr)

SIG = {}
SIG_LOCK = threading.Lock()
def signature(fn):
    with SIG_LOCK:
        if fn in SIG:
            return SIG[fn]
    with psycopg.connect(DB_URL) as c:
        row = c.execute("""select p.proargnames, array(select format_type(t, null) from unnest(p.proargtypes) t), format_type(p.prorettype, null)
                             from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                            where n.nspname = 'public' and p.proname = %s""", (fn,)).fetchall()
    if len(row) != 1:
        return None
    names, types, ret = row[0]
    sig = (list(names or []), list(types), ret)
    with SIG_LOCK:
        SIG[fn] = sig
    return sig

class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def send(self, status, body=None):
        data = b'' if body is None else json.dumps(body, default=str).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        if data:
            self.wfile.write(data)

    def do_POST(self):
        n = int(self.headers.get('Content-Length') or 0)
        raw = self.rfile.read(n) if n else b''
        if self.path == '/__exec':
            if self.headers.get('X-Exec-Key') != args.key:
                return self.send(401, {'message': 'exec key'})
            body = json.loads(raw or b'{}')
            with psycopg.connect(DB_URL, autocommit=True) as c:
                cur = c.execute(body['sql'], body.get('params'))
                rows = cur.fetchall() if cur.description else []
            return self.send(200, {'rows': [list(r) for r in rows]})
        if not self.path.startswith('/rest/v1/rpc/'):
            return self.send(404, {'message': 'no encontrado'})
        if self.headers.get('apikey') != args.key:
            return self.send(401, {'message': 'Invalid API key'})
        if self.headers.get('Authorization') and args.key.startswith('sb_'):
            # Supabase pide que las claves nuevas vayan solo en apikey: la función no debe mandarlas como Bearer
            return self.send(401, {'message': 'secret key sent as Bearer'})
        fn = self.path.rsplit('/', 1)[1]
        sig = signature(fn)
        if not sig:
            return self.send(404, {'code': 'PGRST202', 'message': 'función no encontrada: ' + fn})
        names, types, ret = sig
        body = json.loads(raw or b'{}')
        if set(body) != set(names):
            return self.send(400, {'code': 'PGRST202', 'message': 'argumentos %s, esperados %s' % (sorted(body), names)})
        parts, params = [], []
        for name, typ in zip(names, types):
            v = body[name]
            if typ in ('jsonb', 'json') and v is not None:
                v = json.dumps(v)
            parts.append('%s => %%s::%s' % (name, typ))
            params.append(v)
        call = 'public.%s(%s)' % (fn, ', '.join(parts))
        try:
            with psycopg.connect(DB_URL) as c:
                with c.transaction():
                    c.execute('set local role service_role')
                    if ret == 'void':
                        c.execute('select ' + call, params)
                        out = None
                    else:
                        out = c.execute('select to_jsonb(%s)' % call, params).fetchone()[0]
            if ret == 'void':
                return self.send(204)
            return self.send(200, out)
        except psycopg.Error as e:
            code = getattr(e, 'sqlstate', None) or ''
            status = 409 if code in ('23505', '23P01') else 403 if code == '42501' else 400
            return self.send(status, {'code': code, 'message': str(e).splitlines()[0] if str(e) else 'error'})

setup()
srv = ThreadingHTTPServer(('127.0.0.1', args.port), H)
srv.daemon_threads = True
def stop(*_):
    threading.Thread(target=srv.shutdown, daemon=True).start()
signal.signal(signal.SIGTERM, stop)
signal.signal(signal.SIGINT, stop)
print('READY http://127.0.0.1:%d' % srv.server_address[1], flush=True)
try:
    srv.serve_forever()
finally:
    teardown()
