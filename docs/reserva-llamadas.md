# Reserva de llamadas (web pública) — diseño y funcionamiento

**Estado (09-10-2026): código preparado y probado en local; integración con Google Calendar sin configurar.**
La web publicada no cambia hasta que se complete `supabase/functions/call-booking/DEPLOY.md`.

## Qué ve la familia

1. Paso 1 «Consulta» y paso 2 «Contacto», como siempre.
2. Si elige **«Por teléfono»** (y la reserva está activa), el teléfono es obligatorio, el botón pasa a «Elegir día y
   hora» y aparece el **paso 3 «Llamada»**: «¿Cuándo te viene bien que hablemos?», selector semanal (flechas entre
   semanas, días con nombre y fecha, horas de 24 h en botones claros, «Hora de Madrid», «30 minutos · Sin compromiso»).
3. Al elegir la hora, **resumen** (consulta, fecha, hora y teléfono) y botón **«Confirmar llamada»**.
4. Confirmada de verdad en el servidor: «Tu llamada está reservada. Te llamaremos al número indicado.» con fecha, hora,
   duración, teléfono y enlace para cancelar. Antes de eso nunca se muestra «reservada».
5. Si elige **«Por correo»**, el flujo es el de siempre (sin reserva).

Si la hora se ocupa mientras tanto, se avisa, se conservan todos los datos y se ofrece elegir otra. Si Google no
responde, no se muestran horas: queda «Reintentar» y «Envía la consulta sin elegir hora».

## Piezas

| Pieza | Archivo |
|---|---|
| Selector y cliente de la API | `web-publica/js/reserva-llamada.js` (v1) |
| Integración en el formulario (paso 3, resumen, confirmación) | `web-publica/js/main.js` (bloque «reserva de llamada») |
| Marcado del paso 3 y de la confirmación | `web-publica/index.html`, `index-en.html` |
| Página del enlace de cancelación | `web-publica/llamada.html` + `js/llamada.js` |
| Modo demostración (solo `localhost` con `?demo-llamadas`) | `web-publica/js/reserva-llamada-demo.js` |
| Servidor | `supabase/functions/call-booking/index.ts` (Edge Function, Deno, sin dependencias) |
| Base de datos | `supabase/migrations/0008_reserva_llamadas.sql` |
| Puesta en marcha | `supabase/functions/call-booking/DEPLOY.md` |
| Pruebas | `supabase/tests/llamadas/` |

La dirección de la API va en `<meta name="il-llamadas-endpoint">` de `index.html`, `index-en.html` y `llamada.html`.
**Vacía = reserva desactivada** (estado actual): el formulario funciona como antes.

## Por qué así

- **Infraestructura existente:** Supabase (Postgres + Edge Functions) ya es el servidor del repositorio y Resend el correo
  previsto (`.env.example`). Netlify solo sirve archivos estáticos y no ejecuta el PHP de `form-handler.php`.
- **Google con cuenta de servicio:** una sola agenda, sin que nadie inicie sesión y sin tokens que caduquen. Permisos
  mínimos: `calendar.events` + `calendar.freebusy`. Las citas se crean en un calendario dedicado («Hacer cambios en
  eventos») y la agenda personal se comparte solo como **libre/ocupado**: la función nunca ve títulos ni detalles.
- **Control de concurrencia en la base de datos** (consultar Google y crear el evento no basta):
  - restricción de exclusión sobre `[inicio, fin + margen)`: dos reservas activas no pueden solaparse aunque lleguen a la vez;
  - bloqueo por día (`pg_advisory_xact_lock`): el máximo diario es exacto;
  - clave de idempotencia única: dobles clics y reintentos devuelven la misma reserva;
  - turno (`lease`) para crear el evento: solo una petición lo crea; el id del evento es determinista (`il` + id de la reserva).
- **Fallos parciales:**

| Situación | Qué pasa |
|---|---|
| Google falla al consultar horarios | 503, ninguna hora (nunca huecos con información incompleta) |
| Google crea el evento pero se pierde la respuesta | La reserva queda pendiente y retenida; el reintento (misma clave) encuentra el evento y confirma, sin duplicar |
| Google rechaza el evento (permisos) | Se libera el hueco y se avisa de que no se ha podido confirmar |
| La familia abandona tras un error | Pasados 10 min, la siguiente consulta revisa la pendiente: si el evento existe se confirma (y se avisa); si no, se libera |
| Falla el correo | La reserva sigue confirmada; el aviso queda `failed` y se reintenta (5 min, 30 min, 2 h, 12 h) o a mano |
| Correo sin configurar | Avisos `pending_config` (no se simulan); se envían al configurarlo y reintentar |
| Google no borra el evento al cancelar | No se da por cancelada; se puede repetir |

- **Abuso:** solo se reserva desde los orígenes permitidos; límites por IP y por teléfono (guardados como hash con
  secreto, nunca en claro); campo trampa; máximo 2 reservas futuras por teléfono; cuerpo de 20 KB como máximo.
- **Cancelación segura:** el enlace lleva un token HMAC derivado del id (la base de datos solo guarda su hash), va tras
  `#` (no llega a servidores ni a otras webs) y se borra de la barra de direcciones. Pide confirmación antes de cancelar.
- **Datos mínimos en Google Calendar:** nombre, teléfono, servicio, edad y contexto de la consulta, mensaje y enlace de
  cancelación. Sin el correo de la familia ni el nombre o el colegio del alumno (esos van solo en el aviso al equipo).
- **Hora de Madrid:** huecos calculados con `Intl` (Europe/Madrid); las horas que no existen al adelantar el reloj se
  saltan y las repetidas al atrasarlo se cuentan una vez.

## Configuración (sin confirmar)

En `call_settings` (una fila): días y franjas, margen, antelación mínima, semanas reservables y máximo diario; en
`call_exceptions`, festivos y ausencias. Nace **desactivada y vacía**: no se publica ningún horario inventado. La
duración es fija (30 min). El horario de ejemplo solo existe en el modo demostración y en los bancos de pruebas.

## Pruebas (09-10-2026, sin agenda real ni correos reales)

- `supabase/tests/llamadas/db_test.py` — Postgres 16 real, conexiones en paralelo: 56 comprobaciones (12 peticiones
  simultáneas al mismo hueco → 1; máximo diario con 8 a la vez → exacto; idempotencia; turnos; permisos de `anon`).
- `unit.test.mjs` — 11 pruebas: hora de Madrid y cambios de hora, huecos, validación, firma RS256, cliente de Google.
- `integration.test.mjs` — 14 pruebas: función real + Postgres + Google y Resend simulados (doble clic, dos familias a
  la vez, respuestas perdidas, fallos de Google y de correo, cancelación, pendientes caducadas, abuso, administración).
- Navegador (Chrome, 1440 y 390 px, ES y EN): modo demostración y recorridos contra la función real en local.
- TypeScript estricto (`tsc --strict`) sin errores.

**Limitaciones:** no se ha probado contra Google Calendar real ni contra Supabase real (requiere la configuración del
propietario); tampoco en Safari ni Firefox. `form-handler.php` sigue sin funcionar en Netlify: «Envía la consulta sin
elegir hora» y el flujo por correo dependen de él.
