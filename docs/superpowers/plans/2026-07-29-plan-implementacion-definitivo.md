# Plan de implementación definitivo · Plataforma Interlanguage

**Fecha:** 2026-07-29 · **Estado:** borrador para aprobación (antes de programar).
Reúne todas las decisiones aprobadas. Sustituye como hoja de ruta operativa al plan de 7 bloques anterior
(`2026-07-29-mvp-bloques-pendientes.md`), que queda como resumen de alto nivel.

## Cómo leer este plan
- El trabajo se parte en **bloques pequeños y controlables** (B0–B20). Cada uno se puede construir y revisar solo.
- **Dificultad:** 🟢 baja · 🟡 media · 🔴 alta. **Estimación** relativa (no compromete fechas).
- Regla de oro: **cada bloque termina con algo verificable** (criterios de aceptación) y no rompe lo anterior.
- Estado inicial real: existe una **demo** (localStorage) y esqueletos de UI; el modelo/seguridad reales son nuevos.
- Marca **[JUR]** = tarea legal en paralelo (no la hace Claude). Marca **[TÚ]** = requiere acción del usuario.

Referencias de diseño (todas aprobadas): MVP, RBAC, UX alumno, pedagogía, catálogo/motor, contenido,
motivación/Nemo, arquitectura técnica (Stack A), modelo de datos/API, seguridad/privacidad, rendimiento/a11y.

---

## B0 · Preparación del proyecto  🟢  ✅ HECHO (2026-07-30)
> **= tarea "base técnica del proyecto"** (no repetir). Cubre: estructura, entorno de ejemplo, conexión a
> BD, migraciones, carpetas, entorno local, docs. Deltas añadidos 2026-07-30: `.editorconfig`, `.nvmrc`,
> `.env.staging.example` (config staging; **falta crear el proyecto staging = usuario**), y
> `plataforma/smoke.test.js` (prueba de arranque, en CI). TypeScript N/A en frontend (JS plano por diseño;
> Edge Functions ya son TS de Deno). Lint = `node --check` en CI + `.editorconfig` (sin npm por diseño).
- **Objetivo:** dejar el repo listo para construir con orden (estructura, entornos, calidad, CI mínimo).
- **Archivos/módulos:** estructura de carpetas (`plataforma/motor/`, `supabase/migrations/`, `supabase/functions/`),
  `.env.example`, `.gitignore`, `_headers`, `.github/workflows/ci.yml` (lint/format), `README`/`SETUP` actualizados.
- **Dependencias:** ninguna.
- **Criterios de aceptación:** repo con estructura acordada; lint/format pasan en CI; `.env` fuera de git;
  documentado dónde va cada secreto.
- **Pruebas:** CI verde en un PR de prueba; checklist de estructura.
- **Riesgos:** sobre-ingeniería temprana → mantenerlo mínimo.
- **Orden:** 1.º.

## B1 · Base de datos (esquema + RLS + migraciones)  🔴  ✅ HECHO (2026-07-30)
> Migración `0001_init.sql` aplicada con éxito en el proyecto Supabase de desarrollo.
- **Objetivo:** crear el modelo de datos aprobado con seguridad por fila, versionado.
- **Archivos/módulos:** `supabase/schema.sql`, `supabase/migrations/0001_*`, `supabase/seed.sql`
  (roles, skills, levels, plan, unidad de ejemplo), políticas RLS por tabla.
- **Dependencias:** B0; **[TÚ]** proyecto Supabase de **desarrollo** creado (te guío).
- **Criterios de aceptación:** todas las tablas del modelo creadas; **RLS activa y probada** (alumno solo ve lo
  suyo, profe su grupo, admin todo); `answer_keys` **no** legible por rol student; migraciones aplican en limpio.
- **Pruebas:** scripts que intentan accesos indebidos y **deben fallar**; aplicar migraciones en BD vacía; seed OK.
- **Riesgos:** RLS mal puesta = fuga de datos de menores (crítico) → revisar tabla por tabla.
- **Orden:** 2.º.

## B2 · Autenticación  🟡  ✅ HECHO (2026-07-30)
> Login real verificado (conexión end-to-end OK). Usuario admin creado y con rol `admin`.
> **= tarea "sistema de autenticación y autorización"** (no repetir): login, temporal, cambio obligatorio,
> hash (Supabase), reset por admin, cierre de sesión, roles, permisos en servidor (B3), MFA admin (B4).
> **Tests añadidos 2026-07-30:** `auth-utils.js` + `auth-utils.test.js` (unitarios, en CI) y
> `supabase/tests/permisos-auth.sh` (integración/permisos/enumeración en vivo, 11/11 OK).
> **Se apoya en Supabase Auth:** rate limiting y bloqueo por intentos (límites por endpoint/IP).
> **Diferido (no MVP crítico):** revocación de sesiones por admin desde UI + poblar tabla `sessions`.
- **Objetivo:** login real con usuario **pseudónimo** (`blue-fox-317`), temporal + cambio obligatorio.
- **Archivos/módulos:** `plataforma/auth.js` (real vs demo), `plataforma/index.html`, `cambiar-clave.html`,
  `supabase/functions/generar-usuario` (código único), config de sesión/cookies seguras.
- **Dependencias:** B1.
- **Criterios de aceptación:** alta genera código pseudónimo **único** + temporal; primer login **obliga** a
  cambiar clave; temporal caduca; sesión segura; logout revoca; rate limit y bloqueo por intentos.
- **Pruebas:** login correcto/incorrecto; fuerza bruta bloqueada; unicidad de código ante colisión; caducidad.
- **Riesgos:** enumeración de usuarios / fuerza bruta → límites y mensajes neutros.
- **Orden:** 3.º.

## B3 · Roles y permisos (RBAC + RLS aplicada)  🟡  ✅ HECHO (2026-07-30)
> Anónimo denegado + revisión estática + candado `0002` aplicado. **Cerrado con alumno real**
> (blue-fox-317): ve solo su ficha, NO ve answer_keys, ve su rol/estado. Verificación end-to-end OK.
> Ver `docs/superpowers/specs/2026-07-30-b3-verificacion-permisos.md`.
- **Objetivo:** que cada rol vea y haga **solo lo suyo** en toda la app.
- **Archivos/módulos:** `roles`/`user_roles`, helpers `is_admin()`/`is_teacher_of()`, políticas RLS afinadas,
  guardas en Edge Functions.
- **Dependencias:** B1, B2.
- **Criterios de aceptación:** matriz RBAC del doc respetada; acciones sensibles exigen rol; denegar por defecto.
- **Pruebas:** por cada endpoint, probar con cada rol (permitido/denegado); tests de pertenencia.
- **Riesgos:** control de acceso roto (OWASP #1) → suite de pruebas de autorización obligatoria.
- **Orden:** 4.º.

## B4 · Administración básica  🟡  ✅ HECHO (2026-07-30)
> Panel solo-admin (guard verificado), 2FA (TOTP) con QR, visor de auditoría. 2FA muy
> recomendado ahora; obligatoriedad estricta se activa antes del piloto. Falta que el usuario
> pruebe el login al panel y (opcional) active su 2FA.
- **Objetivo:** panel admin mínimo con **MFA** para gestionar la plataforma.
- **Archivos/módulos:** `plataforma/admin.html`, vistas admin, **MFA (TOTP)** admin, lectura de `audit_log`.
- **Dependencias:** B2, B3.
- **Criterios de aceptación:** admin entra con **2.º factor**; ve panel; acciones quedan en auditoría; no accesible sin rol.
- **Pruebas:** acceso sin MFA denegado; registro en `audit_log`; no-admin no entra.
- **Riesgos:** panel = mayor superficie de ataque → MFA e idle-timeout.
- **Orden:** 5.º.

## B5 · Gestión de alumnos y grupos  🟡  ◻️ AVANZADO (2026-07-30)
> Alta de alumnos: código listo (Edge Function), **pendiente de desplegar** + secreto `IL_SERVICE_KEY`
> (`DEPLOY.md`). Gestión añadida en el panel: **buscar, editar nombre, activar/desactivar acceso** (con
> confirmación + auditoría vía migración `0003`), y **Grupos** (crear + asignar). Verificado: panel carga
> sin errores + tests de permisos 13/13 (no-admin denegado). **Pendiente de probar por el usuario**
> (login admin) el CRUD end-to-end; **aplicar migración 0003** para que se auditen esas acciones.
> **Fuera de alcance MVP:** colegios/cursos/planes CRUD (una academia = config), importación CSV (no
> aprobada), alta de profesores (código en la Edge Function, requiere despliegue).
- **Objetivo:** dar de alta alumnos (código+temporal), crear grupos, matrícula/acceso vigente.
- **Archivos/módulos:** `supabase/functions/admin-create-student` (service_role), vistas de alumnos/grupos,
  `students`/`groups`/`group_members`/`enrollments`, reset de clave.
- **Dependencias:** B4.
- **Criterios de aceptación:** crear alumno con datos **mínimos**; asignar a grupo; fijar vigencia; **reset** por
  admin/profe; todo auditado; el alumno solo entra si su acceso está **vigente**.
- **Pruebas:** alta→login del nuevo alumno; acceso caducado bloqueado; reset funciona; auditoría.
- **Riesgos:** manejo de datos de menores → minimización y validación servidor.
- **Orden:** 6.º.

> **B6 (Conectar Supabase)** — ◻️ DEV CONECTADO (2026-07-30): esquema aplicado, app conectada al proyecto
> de desarrollo, login/panel reales funcionando. Falta: staging/producción separados, backups y CI de
> migraciones (ops, antes del piloto). *(Numeración: en el plan B6 aparece más abajo como "CMS"; el
> "Conectar Supabase" es el Bloque 6 de la hoja de ruta corta. Ambos avanzan.)*

## B6 · Gestión de contenidos (CMS + biblioteca multimedia)  🔴
- **Objetivo:** crear/editar/publicar ejercicios y subir media sin tocar código (estados y versiones).
- **Archivos/módulos:** CMS en `admin.html`, formularios por plantilla (P1,P3,P5,P6,P7), subida a Storage con
  `alt_text`/transcripción, **duplicar**, etiquetas, búsqueda, `activities`/`questions`/`options`/`answer_keys`/`media`.
- **Dependencias:** B1, B4.
- **Criterios de aceptación:** un profe crea un ejercicio de cada plantilla, sube audio/imagen y lo **publica**
  (draft→revisión→publicado); duplicar funciona; búsqueda por etiqueta; `answer_keys` guardada aparte.
- **Pruebas:** crear/publicar cada plantilla; validación de archivos (tipo/tamaño); estados; IA solo crea borrador.
- **Riesgos:** complejidad del CMS → empezar por lo mínimo por plantilla; media pesada → validar/optimizar.
- **Orden:** 7.º.

## B7 · Motor de actividades  🔴  ✅ HECHO (2026-07-30)  *(primer trozo "jugable")*
> Motor P1/P5/P6/P9 verificado en navegador (`plataforma/motor/demo-motor.html`). Falta
> validación de acierto en servidor contra answer_keys (llega con B10) y code-splitting (B17).
- **Objetivo:** motor que lee un ejercicio del banco y lo **pinta, valida y da feedback** (P1,P3,P5,P6,P7).
- **Archivos/módulos:** `plataforma/motor/engine.js`, `plataforma/motor/plantillas/p1..p7.js`, `leccion.html`,
  validación **en servidor** contra `answer_keys` (Edge Function o RPC), emisión de evento de intento.
- **Dependencias:** B1, B6 (o datos semilla de `contenido.js` para empezar).
- **Criterios de aceptación:** cada plantilla se juega en móvil, con audio/imagen, pistas, reintento; el acierto
  se valida en servidor; accesible por teclado; **code-split** por plantilla.
- **Pruebas:** unitarias de validación por plantilla (tolerancia may/tildes, alternativas); a11y (teclado/lector);
  no se puede "ver la solución" desde el cliente.
- **Riesgos:** que la solución viaje al cliente (trampa) → validación servidor; INP en drag → optimizar.
- **Orden:** 8.º.

## B8 · Inicio del alumno  🟢  ✅ HECHO (2026-07-30)
> Inicio + lección conectados al motor real y a datos reales. Verificado end-to-end con alumno
> blue-fox-317 (login→cambio clave→inicio→lección 5/5→recompensa→progreso guardado en Supabase).
> Falta: sesión compuesta por el modelo pedagógico (hoy usa la 1ª unidad del banco) y persistir
> attempts/mastery (B9/B10/B11 a la UI).
- **Objetivo:** pantalla de inicio (4 pestañas: Inicio/Practicar/Progreso/Perfil) con Nemo, clara y ligera.
- **Archivos/módulos:** `inicio.html`, navegación, `perfil.html`, estilos `app.css`, assets de Nemo (sencillos).
- **Dependencias:** B2, B7.
- **Criterios de aceptación:** el alumno entra y ve su inicio, accede a practicar; responsive; cumple presupuesto de peso.
- **Pruebas:** navegación por teclado; CLS/LCP en móvil simulado; lectura con narrador.
- **Riesgos:** peso de imágenes/animación → presupuesto.
- **Orden:** 9.º.

## B9 · Sesión diaria  🔴  ◻️ LÓGICA HECHA (2026-07-30)
> `pedagogia.js` compone la sesión por reglas (verificado con tests). Falta conectarla a datos reales
> del alumno y a la UI (necesita alumno de B5).
- **Objetivo:** "¿qué hago hoy?" — el motor **compone** la sesión (repaso+errores+nuevo) por reglas.
- **Archivos/módulos:** `plataforma/motor/sesion.js`, `progreso.js` (recomendación por reglas), `practice_sessions`.
- **Dependencias:** B7, B10 (progreso), pedagogía.
- **Criterios de aceptación:** genera una sesión coherente (calentamiento→nuevo→práctica→cierre) según el estado
  del alumno; prioriza lo que "vence" y los errores; 1 concepto nuevo si hay prerrequisitos.
- **Pruebas:** casos de alumno (nuevo, con errores, con repasos que vencen) → sesión esperada; longitud correcta.
- **Riesgos:** lógica pedagógica compleja → empezar simple (MVP) y cubrir con tests.
- **Orden:** 10.º.

## B10 · Registro de intentos  🟡
- **Objetivo:** cada respuesta emite un **evento** que se guarda (base del progreso).
- **Archivos/módulos:** endpoint `POST /attempts` (Edge Function/RPC), `attempts`, enganche desde el motor.
- **Dependencias:** B7, B1.
- **Criterios de aceptación:** cada intento guarda resultado, intento nº, pista, tipo (reconocer/producir), tiempo;
  solo el alumno escribe los suyos; validación en servidor.
- **Pruebas:** un intento genera un registro correcto; RLS impide escribir intentos de otro; volumen básico.
- **Riesgos:** volumen alto → índices; luego particionar (Fase 2).
- **Orden:** 11.º (va muy pegado a B7/B9).

## B11 · Progreso y dominio  🔴  ◻️ LÓGICA HECHA (2026-07-30)
> Modelo de dominio (5 estados, evidencia, espaciado 1·3·7·16) en `pedagogia.js`, 17 tests en verde.
> Falta persistir a `mastery`/`attempts` en Supabase y mostrarlo en la UI (necesita alumno de B5).
- **Objetivo:** convertir intentos en **estados de dominio** (5 estados) y repaso espaciado.
- **Archivos/módulos:** `progreso.js` (modelo de evidencia), `progress`/`mastery`, cálculo de `next_review_at`
  (1·3·7·16), vista "Progreso" del alumno.
- **Dependencias:** B10.
- **Criterios de aceptación:** con evidencia espaciada se llega a **Dominado** (≥3 aciertos en ≥2 días); fallar baja
  a Practicando; se fija próxima fecha de repaso; el alumno ve "lo que ya sabe decir".
- **Pruebas:** unitarias del modelo (transiciones, espaciado, producción pesa más); casos límite.
- **Riesgos:** que el modelo "regale" o "castigue" dominio → calibrar con tests; es **lógica pura, muy testeable**.
- **Orden:** 12.º.

## B12 · Motivación  🟡  ◻️ HECHO (lógica+UI) (2026-07-30)
> `motivacion.js` (10 medallas: constancia/aciertos/mejora/dominio) + racha FLEXIBLE con comodín;
> 16 tests en CI. Otorgadas al completar lección y mostradas en la recompensa; colección en el perfil.
> Verificado: 8/8 lógica + E2E (lección perfecta → aciertos_5/pleno/primera). **Pendiente del usuario:**
> aplicar migración `0004` (sembrar catálogo rewards) para que las medallas se PERSISTAN entre sesiones.
> Objetivos semanales/misiones ricas → mejora futura.
- **Objetivo:** racha flexible, objetivos semanales, medallas, celebraciones discretas (sin competición).
- **Archivos/módulos:** `motivacion.js`, `streaks`/`rewards`/`student_rewards`, UI de medallas/mapa, celebraciones.
- **Dependencias:** B11.
- **Criterios de aceptación:** racha con comodín/congelar; medallas ("5 días", "5 aciertos seguidos"…) se otorgan
  una vez; objetivo semanal ajustable; celebración discreta y silenciable; **nada** de rankings.
- **Pruebas:** otorgado de medallas por umbral; comodín no rompe racha; reduced-motion respetado.
- **Riesgos:** caer en mecánicas de presión → seguir la línea roja del doc.
- **Orden:** 13.º.

## B13 · Panel del profesor  🟡
- **Objetivo:** que el profe vea su grupo, asigne y consulte progreso (sin notas ni rankings).
- **Archivos/módulos:** vistas de profesor, `assignments`, informes de grupo (solo lectura), reutiliza progreso.
- **Dependencias:** B5, B11.
- **Criterios de aceptación:** profe ve **solo su grupo**; asigna unidad/objetivo; ve constancia/mejora/dominio;
  no ve datos de otros grupos.
- **Pruebas:** aislamiento por grupo (RLS); asignación llega al alumno; sin comparaciones.
- **Riesgos:** fuga entre grupos → pruebas de pertenencia.
- **Orden:** 14.º.

## B14 · Panel familiar (informe + enlace seguro)  🟡
- **Objetivo:** que la familia vea un resumen **solo lectura** por **enlace seguro caducable** (sin cuenta en MVP).
- **Archivos/módulos:** `supabase/functions/share-report` (token firmado caducable), vista pública de informe,
  envío por email (Resend), `consents.comms`.
- **Dependencias:** B11, correos configurados **[TÚ/JUR]**.
- **Criterios de aceptación:** enlace muestra días de práctica, "lo que ya sabe decir", racha, **vigencia**;
  caduca; sin datos sensibles de más; solicitar reset se canaliza al admin.
- **Pruebas:** token válido/caducado; el enlace no filtra otros alumnos; email solo con consentimiento.
- **Riesgos:** enlace filtrable → token robusto, caducidad corta, `noindex`.
- **Orden:** 15.º.

## B15 · Seguridad (endurecimiento)  🔴  *(transversal, se cierra aquí)*
- **Objetivo:** aplicar y **verificar** las medidas del doc de seguridad de punta a punta.
- **Archivos/módulos:** `_headers` (CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options),
  revisión RLS, validación servidor, gestión de secretos, sanitizado XSS, validación de subidas, `audit_log`.
- **Dependencias:** todo lo anterior.
- **Criterios de aceptación:** cabeceras presentes y correctas; sin `unsafe-inline` en scripts; RLS revisada;
  secretos fuera del cliente; XSS/inyección probados; auditoría cubre acciones sensibles.
- **Pruebas:** escáner de cabeceras; pruebas de autorización; intento de XSS/carga maliciosa **fallan**; revisión de deps.
- **Riesgos:** un hueco = datos de menores → checklist de seguridad como **gate de lanzamiento**.
- **Orden:** 16.º (verificación final antes de piloto).

## B16 · Accesibilidad (verificación AA)  🟡  *(transversal)*
- **Objetivo:** garantizar AA base en toda la app (no solo en el motor).
- **Archivos/módulos:** revisión de todas las vistas (foco, contraste, ARIA, teclado, `lang`), transcripciones.
- **Dependencias:** vistas construidas.
- **Criterios de aceptación:** navegable a teclado; foco visible; contraste AA; no-solo-color; zoom 200%;
  reduced-motion; errores claros; audio con transcripción.
- **Pruebas:** axe (automático) **+ manual** (teclado y lector de pantalla real).
- **Riesgos:** lo automático no lo pilla todo → prueba manual obligatoria.
- **Orden:** 17.º.

## B17 · Rendimiento (verificación CWV)  🟡  *(transversal)*
- **Objetivo:** cumplir LCP<2,5s / INP<200ms / CLS<0,1 y presupuestos de peso.
- **Archivos/módulos:** caché en `_headers` (hash immutable / no-store), imágenes WebP+responsive, audio comprimido,
  fuentes optimizadas, code-splitting, Lighthouse CI.
- **Dependencias:** vistas y motor.
- **Criterios de aceptación:** Lighthouse móvil en objetivo; primera carga <~400 KB; sin CLS notable; datos privados `no-store`.
- **Pruebas:** Lighthouse CI con presupuestos; medición en móvil de gama media.
- **Riesgos:** audio/imagen pesan → optimizar en el pipeline de contenido.
- **Orden:** 18.º.

## B18 · Testing (suite y CI)  🟡  ◻️ INICIADO (2026-07-30)  *(se va construyendo desde B1; se consolida aquí)*
> Tests del modelo pedagógico en CI (Node) + comprobación de sintaxis + escáner de secretos. Faltan
> tests de autorización (con alumnos de B5) y E2E del recorrido del alumno.
- **Objetivo:** red de seguridad automatizada para no romper lo que funciona.
- **Archivos/módulos:** tests unitarios (validación del motor, modelo de dominio, recomendación), tests de
  autorización (RLS/roles), smoke E2E del recorrido del alumno, CI que los ejecuta.
- **Dependencias:** transversal.
- **Criterios de aceptación:** la **lógica pura** (motor, dominio) con buena cobertura; pruebas de autorización por
  endpoint; E2E del flujo login→sesión→intento→progreso; CI bloquea merges que fallan.
- **Pruebas:** que la propia suite corra en CI y falle cuando debe.
- **Riesgos:** intentar 100% de cobertura de UI → priorizar lógica y seguridad.
- **Orden:** 19.º (continuo).

## B19 · Despliegue (staging → producción)  🟡
- **Objetivo:** publicar de forma segura y reversible, con entornos separados.
- **Archivos/módulos:** Netlify (main=prod, previews), proyectos Supabase **staging** y **producción** **[TÚ]**,
  despliegue de Edge Functions y migraciones desde CI, backups activados, secretos por entorno.
- **Dependencias:** B0–B18; **[TÚ]** cuentas/proyectos.
- **Criterios de aceptación:** cambio pasa por preview→staging→producción; rollback en 1 clic; **backups probados**;
  datos de prueba y reales **separados**; monitorización (Sentry) activa.
- **Pruebas:** un rollback real; una restauración de backup; alerta de error llega a Sentry.
- **Riesgos:** tocar producción a mano → todo por pipeline/migraciones.
- **Orden:** 20.º.

## B20 · Contenido inicial + track legal  🔴  *(en paralelo, imprescindible para piloto)*
- **Objetivo:** tener **contenido real revisado** y la **base legal** lista antes de meter familias.
- **Archivos/módulos:** contenido en el CMS (unidades reales), **[JUR]** política de privacidad, consentimientos,
  DPAs, DPIA si aplica, plan de brechas.
- **Dependencias:** B6 (CMS), y trabajo humano (profe + jurista).
- **Criterios de aceptación:** ≥ **2–3 unidades reales publicadas** (suficiente para el piloto) revisadas por profe;
  documentación legal **[JUR]** aprobada; consentimientos operativos.
- **Pruebas:** revisión pedagógica; simulacro de consentimiento; checklist legal.
- **Riesgos:** lanzar sin base legal con menores → **bloqueante**; contenido flojo → revisión de profe.
- **Orden:** en paralelo desde B6; **cierre obligatorio antes del piloto**.

---

## Qué debe existir para el PILOTO (grupo pequeño)
**Mínimo imprescindible** (un grupo real practicando sin riesgo):
- B0 preparación · B1 base de datos + RLS · B2 login pseudónimo · B3 roles ·
  B4 admin con MFA · B5 alta de alumnos/grupos · B6 CMS (al menos crear/publicar P1,P3,P5,P6,P7) ·
  B7 motor · B8 inicio · B9 sesión diaria · B10 intentos · B11 progreso · B12 motivación (racha+medallas básicas) ·
  B14 panel familiar (enlace seguro) · B15 seguridad verificada · B16 a11y AA · B17 CWV · B19 despliegue ·
  **B20 (2–3 unidades reales + base legal [JUR])**.
- **Puede faltar en el piloto y añadirse después:** B13 panel del profesor completo (basta lo mínimo si el profe
  es también admin), PWA, offline, notificaciones, dificultad adaptativa avanzada, writing/speaking, importación masiva.

> Definición de "el piloto funciona": 2–3 familias entran con su código, practican **varios días**, la racha y el
> progreso se guardan y se ven, la familia recibe su informe por enlace, **sin incidentes de seguridad/privacidad**,
> y el profe puede crear/ajustar contenido. Métrica clave: **¿vuelven al día siguiente?** (hábito).

---

## Backlog priorizado (resumen ejecutable)

| Prioridad | Bloques | Por qué |
|---|---|---|
| **P0 · Cimientos** | B0, B1, B2, B3 | Sin datos+seguridad+login no hay nada |
| **P0 · Gestión** | B4, B5, B6 | Crear alumnos y contenido (sin esto no hay qué practicar) |
| **P0 · Núcleo alumno** | B7, B8, B9, B10, B11 | El corazón: jugar, sesión diaria, intentos, progreso |
| **P1 · Enganche y familia** | B12, B14 | Motivación sana + valor para la familia (justifica el precio) |
| **P1 · Calidad no negociable** | B15, B16, B17, B20 | Seguridad, accesibilidad, rendimiento y contenido/legal para menores |
| **P1 · Operación** | B18, B19 | Tests y despliegue seguro/reversible |
| **P2 · Tras el piloto** | B13 completo, PWA, offline, notificaciones, adaptativo avanzado, writing/speaking, import masiva | Mejora, no bloquea el piloto |

---

## Checklist de lanzamiento (antes de abrir a familias reales)
**Producto**
- [ ] Recorrido completo login→sesión→intento→progreso→informe probado en móvil real.
- [ ] 2–3 unidades reales publicadas y revisadas por un profe.
- [ ] Racha, medallas y "lo que ya sabe decir" funcionando y guardándose.

**Seguridad/Privacidad**
- [ ] RLS revisada tabla por tabla; pruebas de autorización en verde.
- [ ] Cabeceras (CSP/HSTS/nosniff/Referrer/Permissions/X-Frame) correctas.
- [ ] MFA admin activo; rate limit/bloqueos probados; secretos fuera del cliente.
- [ ] `answer_keys` nunca llega al cliente; validación en servidor.
- [ ] **[JUR]** Consentimiento parental, política de privacidad, DPAs, (DPIA si aplica), plan de brechas.
- [ ] Analítica sin cookies; región UE; retención definida.

**Fiabilidad**
- [ ] Backups activos y **restauración probada** una vez.
- [ ] Entornos staging/producción separados; rollback probado.
- [ ] Sentry recibiendo errores; alertas mínimas.

**Rendimiento/Accesibilidad**
- [ ] Lighthouse móvil en objetivo (LCP/INP/CLS) y peso <~400 KB.
- [ ] Prueba con teclado y lector de pantalla superada.

**Operación del piloto**
- [ ] Familias seleccionadas e informadas; canal de soporte definido.
- [ ] Guion de "cómo empezar" para la familia (entregar código/temporal de forma segura).
- [ ] Plan de recogida de feedback (¿vuelven?, ¿qué falla?, ¿qué gusta?).

---

### Próximo paso
Si apruebas este plan, empezamos a **construir por orden**, bloque a bloque, empezando por **B0 (preparación)**
y **B1 (base de datos)** — que además necesita que **[TÚ]** crees el proyecto Supabase de desarrollo (te guío paso
a paso). Cada bloque se entrega verificado antes de pasar al siguiente. **No** se programa nada hasta tu visto bueno.
