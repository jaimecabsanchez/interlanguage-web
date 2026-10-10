# Reserva de llamadas — puesta en marcha paso a paso

La función `call-booking` permite que la familia elija día y hora en el formulario de la web y que la cita
aparezca en Google Calendar. **El código está preparado y probado en local, pero todavía no funciona en la web**:
faltan los pasos de esta guía, que solo puede hacer el propietario de las cuentas.

Mientras no se completen, la web sigue exactamente igual que ahora: si la familia elige «Por teléfono», envía la
consulta sin elegir hora.

> **Nunca envíes contraseñas, claves ni el archivo JSON de Google por chat o correo.** Se pegan solo en los
> «Secrets» de Supabase, que es el único sitio donde viven.

---

## 0) Antes de empezar: qué hace falta

| Pieza | Para qué | Estado |
|---|---|---|
| Proyecto de Supabase (base de datos + función) | Guardar reservas sin solapes y ejecutar la función | Hay uno de **desarrollo** de la plataforma. Para producción conviene el proyecto de producción (o uno propio para la web) |
| Cuenta de servicio de Google | Que la función lea libre/ocupado y cree eventos sin que nadie inicie sesión | Pendiente |
| Calendario «Llamadas Interlanguage» | Donde se crean las citas | Pendiente |
| Resend (el correo previsto en el repositorio, `.env.example`) | Confirmación a la familia y aviso al equipo | Pendiente. Sin él, las reservas funcionan, pero los avisos quedan «pendientes de configuración» y **no se envían** |
| Horario de atención | Días, franjas, margen, antelación, semanas, máximo diario y festivos | **Sin confirmar**. La función no muestra ninguna hora hasta que se rellena y se activa |

**Recomendación:** haz primero todo con un **calendario de prueba** («Llamadas · prueba») y, cuando funcione,
cambia solo el identificador del calendario.

---

## 1) Base de datos

1. Supabase → **SQL Editor** → **New query**.
2. Pega todo `supabase/migrations/0008_reserva_llamadas.sql` → **Run**. Es una sola transacción: si algo falla no se aplica nada.
3. Se crean las tablas `call_settings` (desactivada y vacía), `call_exceptions`, `call_bookings`, `call_notifications` y
   `call_rate_events`. Nadie puede leerlas desde el navegador: solo la función con la clave de servidor.

---

## 2) Google: cuenta de servicio (sin inicio de sesión de la familia)

Se usa una **cuenta de servicio** porque es una sola agenda y no caduca. Solo podrá tocar los calendarios que
compartas con ella, y con el permiso que elijas.

1. Entra en <https://console.cloud.google.com> con la cuenta de Google de Interlanguage.
2. Crea un proyecto (por ejemplo «Interlanguage Web») o usa uno existente.
3. **APIs y servicios → Biblioteca →** «Google Calendar API» → **Habilitar**.
4. **IAM y administración → Cuentas de servicio → Crear cuenta de servicio**.
   - Nombre: `reservas-web`. **No le des ningún rol** del proyecto (no los necesita).
5. Abre la cuenta creada → pestaña **Claves → Agregar clave → Crear clave nueva → JSON**. Se descarga un archivo.
   - Si aparece «La creación de claves está inhabilitada» (cuentas de Google Workspace con organización), el
     administrador de Workspace debe permitir las claves de cuenta de servicio en ese proyecto
     (política `iam.disableServiceAccountKeyCreation`).
6. Apunta el **correo de la cuenta de servicio** (`reservas-web@…iam.gserviceaccount.com`). Guarda el JSON en un sitio seguro;
   lo pegarás en el paso 4 y después puedes borrarlo del ordenador.

Permisos que pide la función (los mínimos): `calendar.events` (crear, consultar y borrar sus eventos) y
`calendar.freebusy` (libre/ocupado). La función **nunca lee títulos ni detalles** de tus otros eventos.

---

## 3) Google Calendar: compartir solo lo necesario

Con la cuenta de la persona que atiende las llamadas, en <https://calendar.google.com>:

**a) Calendario de las citas (nuevo):**
1. **Otros calendarios → + → Crear calendario** → «Llamadas Interlanguage» (o «Llamadas · prueba» para probar).
2. En su **Configuración y uso compartido → Compartir con determinadas personas o grupos → Añadir personas y grupos**:
   pega el correo de la cuenta de servicio con el permiso **«Hacer cambios en eventos»**.
3. En **Integrar el calendario**, copia el **ID del calendario** (`…@group.calendar.google.com`).

**b) Tu agenda habitual (para no ofrecer horas en las que ya estás ocupado):**
1. **Configuración y uso compartido** de tu agenda principal → **Compartir con determinadas personas o grupos** →
   añade la cuenta de servicio con el permiso **«Ver solo libre/ocupado (ocultar detalles)»**.
2. Su ID es tu dirección de correo de Google. Si tienes otras agendas con citas, haz lo mismo con cada una.

---

## 4) Supabase: crear la función y sus secretos

1. Supabase → **Edge Functions → Deploy a new function → Via Editor**. Nombre exacto: **`call-booking`**.
   Pega el contenido de `supabase/functions/call-booking/index.ts` → **Deploy**.
   (Con la herramienta de Supabase: `supabase functions deploy call-booking --no-verify-jwt`.)
2. En los ajustes de la función, **desactiva «Enforce JWT verification» / «Verify JWT»**: la llama la web sin sesión.
   La función se protege sola (origen permitido, límites de uso y enlaces firmados).
3. **Edge Functions → Secrets** (o Project Settings → Edge Functions), añade:

| Secreto | Qué poner |
|---|---|
| `IL_SERVICE_KEY` | La clave secreta `sb_secret_…` (Project Settings → API Keys). Ya existe si se desplegaron las otras funciones |
| `IL_CALLS_GOOGLE_SA` | El JSON de la cuenta de servicio. Mejor en base64, en una línea: en el Mac, `base64 -i archivo.json \| tr -d '\n'` |
| `IL_CALLS_BOOKING_CALENDAR_ID` | El ID del calendario de las citas (paso 3a) |
| `IL_CALLS_BUSY_CALENDAR_IDS` | Los ID de tus agendas para libre/ocupado, separados por comas (paso 3b) |
| `IL_CALLS_SECRET` | Una frase aleatoria larga: en el Mac, `openssl rand -hex 32`. Firma los enlaces de cancelación (si la cambias, los enlaces ya enviados dejan de valer) |
| `IL_CALLS_ADMIN_TOKEN` | Otra cadena aleatoria (`openssl rand -hex 24`) para las comprobaciones de administración |
| `IL_CALLS_NOTIFY_TO` | El correo que recibe el aviso de cada llamada (p. ej. el de la persona que llama) |
| `RESEND_API_KEY` y `MAIL_FROM` | Del paso 5. Sin ellos no se envía ningún correo (no se simula) |
| `IL_CALLS_REPLY_TO` | (Opcional) A dónde responde la familia si contesta al correo, p. ej. `info@interlanguage.es` |
| `IL_CALLS_ALLOWED_ORIGINS` | (Opcional) Por defecto `https://interlanguage.es,https://www.interlanguage.es` |
| `IL_CALLS_PUBLIC_SITE` | (Opcional) Por defecto `https://interlanguage.es` (para el enlace de cancelación) |

---

## 5) Correo (Resend)

1. En <https://resend.com>, añade y **verifica el dominio** `interlanguage.es` (te pedirá unos registros DNS en el
   proveedor del dominio).
2. Crea una **API key** con permiso de envío → secreto `RESEND_API_KEY`.
3. `MAIL_FROM`, por ejemplo `Interlanguage Studies <llamadas@interlanguage.es>`.

Si el correo falla o aún no está configurado, **la reserva sigue confirmada**: la familia ve la confirmación con su
enlace de cancelación y el equipo tiene la cita en Google Calendar. Los avisos quedan guardados para reintentarlos
(paso 8).

---

## 6) Horario de atención (cuando esté decidido)

Supabase → **Table Editor → call_settings** (una sola fila):

| Campo | Ejemplo de formato (no son vuestros horarios) |
|---|---|
| `weekly_hours` | `{"mon":[["10:00","13:00"],["16:00","19:00"]],"wed":[["10:00","13:00"]]}` — claves `mon`…`sun`; un día sin clave no tiene atención |
| `buffer_minutes` | Margen entre llamadas y alrededor de otros eventos, en minutos (0 = sin margen) |
| `min_notice_minutes` | Antelación mínima (p. ej. 120 = no se puede reservar con menos de 2 horas) |
| `bookable_weeks` | Cuántas semanas se pueden reservar desde hoy |
| `max_per_day` | Máximo de llamadas al día (vacío = sin máximo) |
| `enabled` | `true` para empezar a ofrecer horas (no deja activarlo si falta algo) |

Las llamadas duran 30 minutos y empiezan cada media hora desde el inicio de cada franja. Todo en hora de Madrid
(los cambios de horario se gestionan solos).

**Festivos y ausencias:** tabla `call_exceptions` → una fila por periodo (`starts_on`, `ends_on`, ambos incluidos).
Sin horas = todo el día cerrado; con `from_time` y `to_time` = solo esa franja.

---

## 7) Comprobar que funciona (antes de tocar la web)

```bash
curl -H "x-il-admin: TU_IL_CALLS_ADMIN_TOKEN" "https://TU-PROYECTO.supabase.co/functions/v1/call-booking?action=health"
```

Debe responder `"missing":[]`, `"db":"ok"`, `"settings":{"enabled":true,"ready":true}`, `"googleToken":"ok"` y
`"calendars":"ok"`. Si un calendario sale como `notFound`, no está compartido con la cuenta de servicio.

Para comprobar que puede **escribir** en el calendario (crea y borra al momento un evento de prueba):

```bash
curl -X POST -H "x-il-admin: TU_IL_CALLS_ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{"action":"calendar-write-test"}' "https://TU-PROYECTO.supabase.co/functions/v1/call-booking"
```

---

## 8) Activarlo en la web

1. Pon la dirección de la función en las **tres** páginas (misma línea en cada una):
   `web-publica/index.html`, `web-publica/index-en.html` y `web-publica/llamada.html`:
   ```html
   <meta name="il-llamadas-endpoint" content="https://TU-PROYECTO.supabase.co/functions/v1/call-booking">
   ```
2. En `web-publica/_headers`, añade el dominio a `connect-src` (si no, el navegador bloquea la llamada):
   `connect-src 'self' https://TU-PROYECTO.supabase.co;`
3. Publica (commit + push). Prueba una reserva real en el calendario de prueba, ábrela desde el correo y cancélala.

**Reintentar avisos que fallaron** (por ejemplo, después de configurar Resend):

```bash
curl -X POST -H "x-il-admin: TU_IL_CALLS_ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{"action":"retry-notifications"}' "https://TU-PROYECTO.supabase.co/functions/v1/call-booking"
```

---

## Uso diario

- **Para cancelar una llamada, usa el enlace del aviso o del evento** («Para cancelarla y avisar a la familia…»).
  Si borras el evento a mano en Google Calendar, la familia no recibe aviso y la hora sigue bloqueada en la base de datos.
- Si la familia cancela, el evento desaparece del calendario y recibes un aviso.
- Para cambiar de hora: cancelar y reservar otra.

## Privacidad (pendiente de texto legal)

La reserva trata nombre, correo y teléfono de la familia y los datos de la consulta. Antes de activarla conviene
actualizar la política de privacidad (`legal.html`) con los encargados del tratamiento (Supabase, Google y Resend),
la finalidad y el plazo de conservación. Ejemplo para borrar reservas antiguas (más de un año):

```sql
delete from public.call_bookings where ends_at < now() - interval '12 months';
```
