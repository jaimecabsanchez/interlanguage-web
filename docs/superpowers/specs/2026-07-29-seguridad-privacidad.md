# Revisión de seguridad y privacidad (previa a programar)

**Fecha:** 2026-07-29 · **Estado:** aprobado (visto bueno). DECISIÓN: **usuario pseudónimo `blue-fox-317`**
(NO nombre+apellido); MFA obligatorio para admin; track legal **[JUR]** obligatorio antes del piloto.
Base: Stack A (Supabase + Netlify), modelo de datos y API, RBAC. Enfoque: **privacidad desde el diseño**,
**RGPD** (y LOPDGDD española), **buenas prácticas OWASP**. Usuarios: **menores en España**.

## Principios rectores
- **Privacy by design & by default:** el ajuste más protector es el de fábrica; se recoge el **mínimo** dato.
- **Menores:** en España el consentimiento digital autónomo es a los **14 años**; **por debajo, consiente el
  titular de la patria potestad/tutor**. Como el MVP es Primaria (6–11), **siempre** consiente el tutor.
- **Defensa en profundidad:** varias capas (RLS + validación en servidor + cabeceras + auditoría), no una sola.
- **Lo sensible, en el servidor:** el navegador nunca decide seguridad ni ve soluciones/claves.

> ⚠️ Este documento es una **base técnica y organizativa**, NO asesoría jurídica. Los puntos marcados con
> **[JUR]** requieren **revisión de un profesional legal** (privacidad/RGPD) antes de lanzar (ver §final).

---

## 1. AUTENTICACIÓN

### Formato de usuario — análisis del "nombre + apellido"
**Recomendación: NO usar nombre y apellido juntos como usuario. Es inapropiado aquí.** Motivos:
- **Privacidad de un menor:** el usuario suele viajar en claro (pantallas, soporte, logs, URL de recuperación,
  el propio alumno lo dice en voz alta en clase) → expondría la **identidad real del niño**. Contradice la minimización.
- **Duplicados:** hay muchos "García" y homónimos → colisiones y usuarios feos tipo `juan.garcia7`.
- **Cambios:** apellidos compuestos, tildes, guiones → problemas de tecleo para un niño de 7 años.
- **Enumeración:** un usuario predecible facilita adivinar cuentas de otros alumnos.

**Alternativa propuesta (segura, memorable, sin colisiones):** **código de alumno no identificativo**,
legible y fácil de teclear, del tipo **`palabra-palabra-###`** (dos palabras sencillas en inglés del propio
temario + número), p. ej. **`blue-fox-317`**.
- **No identifica** al menor (pseudónimo) → cumple minimización.
- **Fácil de recordar y teclear** para un niño (palabras + 3 dígitos), sin tildes ni mayúsculas.
- **Resuelve duplicados** por diseño: se genera y se comprueba unicidad en BD; si choca, se regenera el número.
- **Refuerza marca/pedagogía:** las palabras salen del vocabulario/animales del mundo de Nemo.
- Alternativa más neutra si se prefiere: `IL-2AB7CD` (prefijo + base32 sin caracteres confusos O/0/I/1).
- El **nombre de pila** (para saludar "¡Hola, Lucía!") se guarda en `students.first_name`, **separado** del
  usuario de login; nunca forma el identificador de acceso.

### Contraseña temporal + cambio obligatorio
- El admin/profe da de alta → se genera **contraseña temporal aleatoria** (longitud decente, sin caracteres
  ambiguos), entregada por canal a la familia. `must_change_password=true`.
- **Primer inicio de sesión → cambio obligatorio** (ya previsto). La temporal **caduca** (p. ej. 7 días) y es
  de **un solo uso** práctico (forzar cambio). Nunca se guarda ni se reenvía en claro; si se pierde, se **regenera**.

### Hash seguro
- Lo gestiona **Supabase Auth** (bcrypt/derivado robusto, salteado). **Nosotros nunca** almacenamos ni
  "vemos" contraseñas. Política de fuerza mínima razonable (longitud, evitar las más comunes) **adaptada a
  niños** (memorables > complejísimas): mejor **frase/pass sencilla larga** que exigir símbolos raros.

### Recuperación
- **El menor NO tiene auto-recuperación por email** (muchos no tienen email, y no queremos email de menores).
- **Reset lo hace admin/profe** vía Edge Function → nueva temporal + `must_change_password`. Todo **auditado**.
- Cuentas **adultas** (admin/profe, y familia en Fase 2): recuperación por email con **token de un solo uso y
  caducidad corta**, sin revelar si el email existe (evitar enumeración).

### Rate limiting y bloqueos
- **Límite de intentos de login** por usuario y por IP (p. ej. escalado: pausa creciente; bloqueo temporal tras
  N fallos). Aprovechar límites de Supabase Auth + regla propia en la Edge Function/gateway.
- **Bloqueo de cuenta** temporal ante fuerza bruta, con desbloqueo por tiempo o por admin. Registrar en `audit_log`.
- Rate limit también en endpoints sensibles (crear alumno, reset, envío de informes, share-link).

### Sesiones
- Tokens de Supabase (JWT de acceso corto + refresh). **Expiración** razonable; **refresh rotativo**.
- **Logout** revoca sesión; admin puede **revocar sesiones** de un usuario. Tabla `sessions` para traza
  (IP **hasheada**, UA), purgada por antigüedad.
- **Idle timeout** para paneles de admin/profe (más estricto que para el alumno).

### Cookies
- Si se usan cookies para el token: **`Secure`**, **`HttpOnly`** (no accesible por JS → mitiga XSS/robo de
  token), **`SameSite=Lax`** (o `Strict` en admin) → mitiga CSRF. Sin cookies de terceros. Sin cookies de
  tracking (analítica sin cookies, §privacidad).

### MFA para administradores
- **MFA obligatorio para `admin`** (y recomendable para `teacher` con permisos de gestión): TOTP (app de
  autenticación) vía Supabase MFA. Los paneles de administración son el mayor riesgo (acceso a datos de
  muchos menores) → segundo factor **no negociable**. Alumnos: sin MFA (fricción excesiva; su riesgo es menor
  y su cuenta es pseudónima con poco dato).

---

## 2. SEGURIDAD (OWASP)

| Amenaza | Estrategia |
|---|---|
| **XSS** | Escapado por defecto en el render; **nunca** `innerHTML` con datos de usuario/contenido sin sanear; contenido del CMS tratado como texto (o sanitizado con lista blanca si permite formato); **CSP** estricta como red de seguridad |
| **CSRF** | API con **token Bearer** (no solo cookie) → inmune al CSRF clásico; si hay cookie de sesión, `SameSite` + token anti-CSRF en formularios que muten estado |
| **Inyección SQL** | **Siempre** consultas parametrizadas / cliente Supabase (nunca concatenar SQL); RLS como segunda barrera; en funciones SQL, `security definer` con `search_path` fijado |
| **Control de acceso** (OWASP #1) | **RLS por fila** en todas las tablas + verificación de rol en cada Edge Function + comprobación de **pertenencia** (alumno→suyo, profe→su grupo). Denegar por defecto. Probar cada regla |
| **Validación en servidor** | **Toda** validación crítica en servidor (la del cliente es solo UX). Validar tipos/tamaños/《whitelist》; la **corrección de respuestas** se valida en servidor contra `answer_keys` |
| **CSP** | `default-src 'self'`; orígenes explícitos para Supabase/CDN/media; **sin `unsafe-inline`** en scripts (usar nonce/hash); `frame-ancestors 'none'` |
| **HSTS** | `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (HTTPS forzado; Netlify da TLS) |
| **X-Content-Type-Options** | `nosniff` |
| **Referrer-Policy** | `strict-origin-when-cross-origin` (o `no-referrer` en zonas sensibles) → no filtrar rutas |
| **Permissions-Policy** | denegar por defecto: `camera=(), geolocation=(), microphone=()`; el micro solo se habilitará (Fase 3, speaking) con consentimiento explícito |
| **Clickjacking** | `X-Frame-Options: DENY` + `frame-ancestors 'none'` (no embeber la app en iframes) |
| **Gestión de secretos** | En variables de entorno (Netlify/Supabase/GitHub Actions); **nunca** en el repo ni en el cliente; `service_role` solo en Edge Functions; `.env` en `.gitignore`; rotación si se filtra |
| **Logs** | Registrar seguridad (logins, fallos, cambios de rol, publicaciones) **sin PII innecesaria** ni contraseñas/tokens; niveles; acceso restringido a los logs |
| **Auditoría** | `audit_log` **append-only** de acciones sensibles (crear/editar alumno, reset, publicar, exportar, borrar); retención definida |
| **Backups** | Automáticos (BD) + export lógico propio + copia de Storage; **cifrados**; **probar restauración**; acceso restringido (ver §privacidad para datos de menores en backups) |
| **Dependencias** | Minimizar librerías (el stack es ligero a propósito); **auditoría de dependencias** (Dependabot/`npm audit` cuando haya build); fijar versiones; revisar antes de añadir nada de terceros |
| **Archivos subidos** | Solo staff (CMS) sube media; **validar tipo real** (magic bytes, no solo extensión), tamaño máximo, renombrar, servir desde Storage con `Content-Type` correcto y `Content-Disposition`; **nunca ejecutar** lo subido; escaneo si se amplía a subidas por más gente |

Extra OWASP a tener presentes: **SSRF** (las Edge Functions no deben pedir URLs arbitrarias del usuario),
**dependencia de componentes vulnerables**, **fallos de registro/monitorización** (por eso Sentry + audit_log),
**diseño inseguro** (esta misma revisión), **configuración incorrecta** (revisar cabeceras y RLS antes de lanzar).

---

## 3. PRIVACIDAD (RGPD / LOPDGDD)

| Aspecto | Estrategia |
|---|---|
| **Consentimiento de padres/tutores** **[JUR]** | Base legal del tratamiento del **menor**: **consentimiento del tutor** (Primaria), granular por finalidad (`consents`: tratamiento, comunicaciones, media, audio). Registrado con versión de política y fecha. Verificación **razonable** de que quien consiente es el tutor **[JUR]** |
| **Minimización** | Del menor: **nombre de pila, año de nacimiento, nivel, progreso**. Sin apellidos (si se puede), sin dirección, sin foto, sin email del menor. El **usuario de login es pseudónimo** (§1) |
| **Retención** **[JUR]** | Política de plazos: datos de aprendizaje mientras dure el servicio + X; consentimientos y facturación, el plazo legal; logs/sesiones, plazos cortos. Purga automática al vencer **[JUR fija los plazos]** |
| **Exportación** (portabilidad) | Acción para **exportar los datos del alumno** (perfil + progreso) en formato legible (JSON/CSV), a petición del tutor |
| **Rectificación** | El tutor/admin puede **corregir** datos del menor; cambios auditados |
| **Eliminación** (supresión) | Flujo de **anonimización** (nombre→alias, contacto→null, notas borradas; progreso conservable **anonimizado**) + **hard-delete** a petición, salvo lo que la ley obligue a conservar. Incluye **borrado en backups** según política **[JUR]** |
| **Cookies** | Solo **técnicas/esenciales** (sesión) → en principio **sin banner de consentimiento** de cookies; **cero** cookies de marketing/terceros. Si se añadiera algo no esencial → banner conforme **[JUR]** |
| **Analítica** | **Sin cookies y sin PII** (Plausible/Umami, datos agregados). **Nunca** Google Analytics u otros que perfilen menores |
| **Encargados de tratamiento** **[JUR]** | Supabase, Netlify, Resend, Sentry, proveedor de analítica = **encargados**; hay que firmar **DPA/contrato de encargo** con cada uno y listarlos en el **registro de actividades** y en la política de privacidad **[JUR]** |
| **Datos de voz** **[JUR]** | **Fuera del MVP** (speaking = Fase 3). Cuando llegue: consentimiento **específico** para grabación, audio **temporal**, **no almacenar por defecto**, sin usar para entrenar modelos. Micrófono deshabilitado por `Permissions-Policy` hasta entonces |
| **Transferencias internacionales** **[JUR]** | Alojar en **región UE** (Supabase EU, Netlify/CDN con presencia UE). Evitar proveedores que saquen datos fuera del EEE; si alguno lo hace, exigir garantías (SCC/adecuación) **[JUR]** |
| **Respuesta ante incidentes** **[JUR]** | Plan de brechas: detección (Sentry/logs) → contención → evaluación → **notificación a la AEPD en 72 h** si procede y a los afectados si hay alto riesgo → registro. Responsable y contacto definidos **[JUR valida el procedimiento]** |

Documentos RGPD que harán falta (los redacta/valida jurídico): **Política de privacidad**, **registro de
actividades de tratamiento**, **cláusulas de consentimiento**, **DPA con cada encargado**, evaluación de si
se requiere **EIPD/DPIA** (tratamiento de menores a escala puede exigirla) y **aviso legal/cookies**.

---

## 4. Qué entra en el MVP y qué se pospone

| Elemento | MVP | Fase posterior |
|---|---|---|
| Usuario pseudónimo (código, no nombre+apellido) | ✅ | — |
| Temporal + cambio obligatorio + reset por admin | ✅ | — |
| Hash (Supabase), rate limit, bloqueos, sesiones seguras | ✅ | ajuste fino |
| **MFA admin** | ✅ | MFA profe ampliado |
| RLS + validación servidor + cabeceras (CSP/HSTS/…) | ✅ | pentest formal |
| Validación de archivos subidos (staff) | ✅ básica | escaneo AV si se abre |
| Consentimientos granulares + minimización | ✅ | — |
| Export / rectificación / supresión | ✅ | automatizar |
| Analítica sin cookies · región UE · DPAs | ✅ (DPAs = tarea legal) | — |
| Datos de voz | — | Fase 3 (con consentimiento) |
| Plan de incidentes + documentación RGPD | ✅ (borrador) | validado por jurista |

---

## 5. Qué necesita REVISIÓN JURÍDICA PROFESIONAL antes de lanzar **[JUR]**
No lanzar con menores reales sin que un profesional de privacidad revise y firme:
1. **Mecanismo y prueba del consentimiento parental** (cómo se verifica que consiente el tutor) y textos.
2. **Política de privacidad, aviso legal y (si aplica) banner de cookies.**
3. **Registro de actividades de tratamiento** y **base legal** de cada finalidad.
4. **Necesidad de EIPD/DPIA** (probable, por tratarse de menores a escala).
5. **DPA/contratos de encargo** con Supabase, Netlify, Resend, Sentry y analítica; y sus **transferencias**.
6. **Plazos de retención** y su purga (incluidos backups).
7. **Procedimiento de brechas** (72 h AEPD) y designación de responsable / si procede **DPO**.
8. Cualquier tratamiento futuro de **voz** (Fase 3) → consentimiento y evaluación específicos.

---

### Próximo paso
Estas medidas se aplican **al construir**: el **usuario pseudónimo** y las cabeceras/RLS entran ya en los
Bloques 2–3–6; los `consents`, export/borrado y MFA admin acompañan al Bloque 6; y el track **[JUR]** corre en
paralelo (Bloque 7) antes del piloto. Falta tu visto bueno, en especial a la **decisión de usuario pseudónimo**
(`blue-fox-317`) en lugar de nombre+apellido.
