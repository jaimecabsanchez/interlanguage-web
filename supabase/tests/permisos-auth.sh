#!/usr/bin/env bash
# ============================================================
#  Test de INTEGRACIÓN / PERMISOS / ENUMERACIÓN (en vivo)
#  Contra el proyecto Supabase de DESARROLLO. Requiere red y un
#  alumno de prueba. NO va en CI (depende de red y credenciales).
#  Uso:  bash supabase/tests/permisos-auth.sh
# ============================================================
set -u
URL="${IL_URL:-https://nawfcxhswlxlciulfidd.supabase.co}"
PUB="${IL_PUB:-sb_publishable_E593ZNBA8aSzo3j7s9zEQA_cYXLZXRj}"
STU_EMAIL="${IL_STU_EMAIL:-blue-fox-317@alumnos.interlanguage-home.es}"
STU_PASS="${IL_STU_PASS:-practica2026}"

pass=0; fail=0
chk(){ if [ "$2" = "$3" ]; then echo "✅ $1"; pass=$((pass+1)); else echo "❌ $1 (esperado '$3', obtenido '$2')"; fail=$((fail+1)); fi; }

echo "== 1) Sin sesión (anónimo): tablas sensibles deben ir vacías =="
for t in users students attempts answer_keys mastery user_roles consents; do
  body=$(curl -s "$URL/rest/v1/$t?select=*&limit=3" -H "apikey: $PUB" -H "Authorization: Bearer $PUB" --max-time 20)
  chk "anon no ve $t" "$body" "[]"
done

echo; echo "== 2) Protección frente a ENUMERACIÓN de usuarios =="
# El mensaje debe ser IDÉNTICO para "usuario inexistente" y "contraseña errónea".
msg_noexist=$(curl -s "$URL/auth/v1/token?grant_type=password" -H "apikey: $PUB" -H "Content-Type: application/json" \
  -d '{"email":"noexiste-xyz@alumnos.interlanguage-home.es","password":"loquesea123"}' --max-time 20 \
  | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('msg') or d.get('error_description') or d.get('error') or '')" 2>/dev/null)
msg_wrongpw=$(curl -s "$URL/auth/v1/token?grant_type=password" -H "apikey: $PUB" -H "Content-Type: application/json" \
  -d "{\"email\":\"$STU_EMAIL\",\"password\":\"contrasena-mala-999\"}" --max-time 20 \
  | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('msg') or d.get('error_description') or d.get('error') or '')" 2>/dev/null)
echo "   usuario inexistente -> '$msg_noexist'"
echo "   contraseña errónea  -> '$msg_wrongpw'"
chk "mismo mensaje (no revela si el usuario existe)" "$msg_noexist" "$msg_wrongpw"

echo; echo "== 3) Con sesión de ALUMNO: solo ve lo suyo, nunca las soluciones =="
TOKEN=$(curl -s "$URL/auth/v1/token?grant_type=password" -H "apikey: $PUB" -H "Content-Type: application/json" \
  -d "{\"email\":\"$STU_EMAIL\",\"password\":\"$STU_PASS\"}" --max-time 20 \
  | python3 -c "import sys,json;print(json.load(sys.stdin).get('access_token',''))" 2>/dev/null)
if [ -z "$TOKEN" ]; then echo "❌ no se pudo iniciar sesión como alumno (¿cambió la contraseña?)"; fail=$((fail+1)); else
  echo "   sesión de alumno iniciada"
  n_students=$(curl -s "$URL/rest/v1/students?select=id" -H "apikey: $PUB" -H "Authorization: Bearer $TOKEN" --max-time 20 | python3 -c "import sys,json;print(len(json.load(sys.stdin)))" 2>/dev/null)
  ak=$(curl -s "$URL/rest/v1/answer_keys?select=id&limit=3" -H "apikey: $PUB" -H "Authorization: Bearer $TOKEN" --max-time 20)
  role=$(curl -s "$URL/rest/v1/user_roles?select=role_id" -H "apikey: $PUB" -H "Authorization: Bearer $TOKEN" --max-time 20 | python3 -c "import sys,json;d=json.load(sys.stdin);print(d[0]['role_id'] if d else '')" 2>/dev/null)
  chk "el alumno ve exactamente 1 alumno (el suyo)" "$n_students" "1"
  chk "el alumno NO ve answer_keys" "$ak" "[]"
  chk "el alumno tiene rol student" "$role" "student"
fi

echo; echo "== 4) Un ALUMNO NO puede hacer cosas de administrador =="
if [ -n "${TOKEN:-}" ]; then
  audit=$(curl -s "$URL/rest/v1/audit_log?select=id&limit=3" -H "apikey: $PUB" -H "Authorization: Bearer $TOKEN" --max-time 20)
  chk "el alumno NO lee la auditoría" "$audit" "[]"
  code_grp=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$URL/rest/v1/groups" \
    -H "apikey: $PUB" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d '{"name":"grupo-no-permitido"}' --max-time 20)
  case "$code_grp" in 401|403) echo "✅ el alumno NO puede crear grupos (HTTP $code_grp)"; pass=$((pass+1));; *) echo "❌ el alumno pudo tocar grupos (HTTP $code_grp)"; fail=$((fail+1));; esac
else
  echo "   (sin sesión de alumno; se omite)"
fi

echo; echo "-----"; echo "$pass OK · $fail fallidas"
[ "$fail" -eq 0 ] && exit 0 || exit 1
