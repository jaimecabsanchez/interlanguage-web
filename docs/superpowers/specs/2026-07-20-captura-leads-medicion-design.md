# Captura de leads y medición — diseño

**Estado: aprobado, implementación diferida.** El usuario ha decidido abordar esto más adelante, cuando vaya a publicar la web en producción (hosting Arsys, dominio `interlanguage.es`). Este documento existe para que una sesión futura pueda retomarlo sin tener que redescubrir nada de lo de abajo.

## Contexto / por qué existe esto

Al explorar el estado técnico real de `interlanguage_web_pastel_7.html` (más allá del trabajo de diseño visual hecho hasta ahora) se encontraron 4 frentes de mejora independientes: captura de leads/medición, SEO/visibilidad, rendimiento técnico (archivo único de ~14MB), y contenido vivo/confianza. El usuario priorizó **captura de leads y medición** como el primero a diseñar. Este spec cubre solo ese frente.

### Hallazgo motivador

Ambos formularios del sitio son puramente cosméticos hoy:

- `#leadForm` (formulario de contacto, `interlanguage_web_pastel_7.html` ~línea 1080, handler de submit ~línea 2201) y `#campForm` (inscripción a campamentos, ~línea 1365, handler ~línea 2067) hacen `e.preventDefault()`, validan en cliente, llaman a `pushEvent(...)` y muestran un mensaje de "gracias" — **pero no envían los datos a ningún sitio**. Ni `fetch` a un backend, ni email, ni integración externa. Cada solicitud real de una familia se pierde.
- `pushEvent(name, params)` (línea ~1746) solo hace `window.dataLayer.push(...)`. No hay ningún contenedor de Google Tag Manager ni Google Analytics cargado en la página, así que ni siquiera esos eventos (incluye uno llamado literalmente `lead_generado`) llegan a ningún sitio medible.

### Hallazgo adjacente (fuera de alcance de este spec)

El checkbox RGPD de ambos formularios (`id="rgpd"` en leadForm, `id="campRgpd"` en campForm) enlaza su texto "política de privacidad" a `href="#"` — **no existe ninguna página de política de privacidad en el sitio**. Es un gap legal/de contenido real (se promete un documento que no existe), pero es un entregable distinto (contenido legal, no técnico) y no se aborda en este spec. Queda anotado para un futuro brainstorm separado.

### Otros frentes detectados, no elegidos todavía

- **SEO/visibilidad**: no hay Open Graph/Twitter Card, ni canonical, ni datos estructurados schema.org (LocalBusiness/EducationalOrganization), ni sitemap.xml/robots.txt. Solo existe una meta description.
- **Rendimiento técnico**: todo el sitio es un único HTML de ~14MB con fotos en base64 incrustadas; cada visita descarga el archivo entero antes de ver nada.
- **Contenido vivo/confianza**: hay 12 fotos nuevas generadas con IA sin usar en `fotos-nuevas-campamento/`; testimonios estáticos.

## Decisiones ya tomadas con el usuario

| Decisión | Elegido | Alternativas descartadas |
|---|---|---|
| Frente a atacar primero | Captura de leads y medición | SEO, rendimiento técnico, contenido vivo |
| Hosting de producción | Arsys, hosting tradicional con dominio propio (`interlanguage.es`), sin remoto git configurado | — |
| Mecanismo de entrega de leads | Script PHP propio en el hosting, sin terceros | Servicio de formularios de terceros (Formspree/Web3Forms); Google Sheets vía Apps Script |
| Email destino de los leads | `info@interlanguage.es` | — |
| Herramienta de medición | GA4 + Google Tag Manager (por defecto; el usuario no pidió la alternativa privacy-first) | Plausible/Fathom (de pago, sin banner de cookies necesario) |

**Razón de fondo para PHP propio en vez de un servicio de terceros:** los datos que piden ambos formularios incluyen datos de menores (nombre y edad del alumno/a, colegio, alergias) junto con datos de contacto de los padres. Mantenerlos dentro del propio servidor del cliente en vez de enviarlos a un SaaS de terceros (normalmente en EEUU) da una postura RGPD más limpia — coherente con que el formulario ya incluye una casilla de consentimiento RGPD.

## Diseño

### Arquitectura

Un único endpoint PHP nuevo, `enviar-formulario.php`, en la raíz del hosting Arsys (mismo directorio que el HTML). Ambos formularios apuntan al mismo endpoint, diferenciados por un campo `form_type`: `'contacto'` | `'campamento'`. Un solo archivo porque comparten toda la lógica de validación/antispam/envío — no se justifica duplicarla.

### Contrato del backend

- **Request**: POST con cuerpo JSON.
  - `form_type: 'contacto'` → `service, studentAge, message, fullName, email, phone, rgpd` (nombres de campo exactamente como en el HTML actual de `#leadForm`).
  - `form_type: 'campamento'` → `campSede, semanas (array), comedor (bool), campAlumnoNombre, campAlumnoApellidos, campColegio, campAlergias, campTutor, campEmail, campTelefono, campComentarios, campRgpd` (nombres exactamente como en `#campForm`).
  - Ambos incluyen un campo honeypot (ver Antispam).
- **Response**: JSON `{ok: true}` (200) o `{ok: false, error: '...'}` (400 validación, 403 origen no reconocido, 500 fallo de envío de email).
- **Validación servidor**: revalidar los campos obligatorios de cada tipo de formulario (un bot puede saltarse la validación JS y postear directo al endpoint).
- **Precio de campamento**: recalcular el total en servidor usando la misma tabla de precios que ya usa el JS del front-end (`weekPrices`, a localizar en el archivo al implementar) en vez de confiar en el total que mande el navegador.
- **Email enviado**: `To: info@interlanguage.es`, `Reply-To:` el email que mande la familia (para poder responder directamente), `From:` una dirección del propio dominio (a confirmar en implementación: `info@interlanguage.es` mismo, o una `no-reply@interlanguage.es` si existe esa cuenta en Arsys — usar el email del visitante como `From:` es una mala práctica clásica de deliverability). Asunto reflejando tipo de formulario + servicio/sede. Cuerpo en texto plano listando todos los campos recibidos.

### Antispam (sin CAPTCHA, sin fricción para la familia)

- Campo honeypot oculto (fuera de pantalla vía CSS, no `display:none`) en ambos formularios. Si llega relleno, el backend responde `{ok:true}` (para no enseñarle nada al bot) pero no envía el email.
- Comprobación de `Origin`/`Referer` contra el dominio real; si no coincide, 403. Evita que el endpoint quede abierto como relay de correo para terceros.

### Cambios en el frontend (el HTML/JS real del sitio)

- Añadir el input honeypot a ambos `<form>`.
- Sustituir la lógica actual de ambos submit handlers (que hoy siempre "tienen éxito") por: validar → `fetch('/enviar-formulario.php', ...)` → si `ok:true`, mensaje de éxito (como ahora); si falla (red caída, `mail()` falla en Arsys, error de validación) → mensaje de error con contacto alternativo directo (email/teléfono), sin deshabilitar el formulario, permitiendo reintentar. Esto corrige de raíz el bug actual de que el formulario dice "gracias" pase lo que pase.
- Añadir un estado "Enviando…" en el botón de envío mientras el `fetch` está en curso.
- Los `pushEvent(...)` existentes no cambian.

### Medición (GA4 + GTM) — proceso en dos fases

El código ya llama a `pushEvent()` con eventos y parámetros ya fijados: `lead_generado` (params `servicio, edad_alumno` en contacto; `servicio, semanas, comedor, total` en campamento), `formulario_enviado` (`servicio`), `clic_cta` (`cta_id`). Ya tienen forma de GTM, solo falta el contenedor real.

1. El usuario crea (gratis) una cuenta de Google Tag Manager + una propiedad GA4 vinculada — acción de cuenta que solo puede hacer él.
2. Da el ID del contenedor (`GTM-XXXXXXX`).
3. Se inserta el snippet estándar de dos partes (uno en `<head>`, otro justo tras `<body>`) en el HTML real.
4. En la interfaz web de GTM, configurar una tag de Configuración de GA4 más tags/triggers de evento que casen con los nombres ya existentes en el código (arriba). No requiere más cambios de código.

### Manejo de errores

- Validación cliente (ya existe, sin cambios) → validación servidor (nueva, defensa en profundidad) → honeypot relleno (falso éxito silencioso) → origen no reconocido (403) → fallo de `mail()` (500, mensaje de fallback al usuario en vez de falso éxito) → fallo de red en el `fetch` (mismo mensaje de fallback).

### Pruebas

No hay PHP instalado en la máquina de desarrollo actual (`php -v` → comando no encontrado), así que el endpoint no se puede ejecutar de principio a fin sin uno de estos dos caminos:

- **Opción A (preferida)**: instalar PHP local (`brew install php`, reversible, ~2 min) y servir la carpeta con `php -S localhost:PUERTO` para poder probar el ciclo completo request/response en el navegador antes de subir nada a Arsys.
- **Opción B**: escribir el script con cuidado y probarlo ya subido a Arsys, usando el formulario real o una petición manual tipo curl.

En cualquiera de los dos casos, probar explícitamente tanto el camino de éxito como el de fallo (por ejemplo, rompiendo temporalmente la URL del endpoint para confirmar que el mensaje de error de fallback aparece de verdad, en vez del falso "gracias" de hoy).

### Pasos manuales que le corresponden al usuario (no ejecutables por Claude)

- Subir `enviar-formulario.php` a Arsys (FTP o gestor de archivos) — no hay acceso al servidor desde aquí.
- Crear la cuenta gratuita de GTM + GA4.
- Confirmar si Arsys permite `mail()` de PHP directamente o si requiere SMTP autenticado (PHPMailer) — a verificar la primera vez que se despliegue; documentar el fallback SMTP si `mail()` no es fiable.

## Próximos pasos (cuando se retome)

1. Reabrir este documento, confirmar que nada ha cambiado (nombres de campos, hosting, email destino).
2. Invocar la skill `writing-plans` para generar el plan de implementación paso a paso.
3. Implementar, con las pruebas descritas arriba antes de dar el trabajo por terminado.
