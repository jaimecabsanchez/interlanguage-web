# Pruebas de la reserva de llamadas

Ninguna toca la agenda real de Google ni envía correos: Google Calendar y Resend van simulados
(`local/fakes.mjs`) y la base de datos es un Postgres local de usar y tirar.

Requisitos: Node 22.6+ (con `--experimental-strip-types`) o Node 23.6+ tal cual; para las de base de datos,
un Postgres 16+ local y Python con `psycopg` (`pip install "psycopg[binary]"`).

```bash
# 1) Unitarias (sin red ni base de datos)
node --test supabase/tests/llamadas/unit.test.mjs

# 2) Base de datos (concurrencia real, permisos)
IL_TEST_PG="postgresql://postgres@127.0.0.1:55432/postgres" python3 supabase/tests/llamadas/db_test.py

# 3) Integración: la función real + Postgres + Google y Resend simulados
IL_TEST_PG="postgresql://postgres@127.0.0.1:55432/postgres" IL_TEST_PYTHON=python3 \
  node --test --test-concurrency=1 supabase/tests/llamadas/integration.test.mjs

# 4) Probarlo en el navegador con la función real en local
IL_TEST_PG="postgresql://postgres@127.0.0.1:55432/postgres" IL_TEST_PYTHON=python3 node supabase/tests/llamadas/local/server.mjs
python3 -m http.server 8402
#   http://localhost:8402/web-publica/index.html?llamadas-endpoint=http://127.0.0.1:8790/functions/v1/call-booking#contacto
#   (el horario del banco de pruebas es de ejemplo; /__fake muestra eventos y correos simulados)

# 5) Solo la interfaz, sin servidor (horarios de ejemplo)
#   http://localhost:8402/web-publica/index.html?demo-llamadas#contacto
```

Sin `IL_TEST_PG`, las pruebas 2 y 3 se saltan. Nunca apuntes `IL_TEST_PG` al proyecto real: crean y borran
bases de datos.
