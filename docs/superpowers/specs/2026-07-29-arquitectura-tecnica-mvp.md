# Arquitectura técnica recomendada para el MVP

**Fecha:** 2026-07-29 · **Estado:** aprobado (visto bueno). Stack elegido: **Stack A** (web ligera + Supabase + Netlify).
Base: MVP aprobado (Primaria 3.º–4.º · contenido como datos · perfiles alumno/admin/familia · motor P1–P7).

## Resumen para no-técnicos
Recomiendo un stack **ligero y barato**: web estática + **Supabase** (base de datos + login + archivos, todo
en uno) + **Netlify** (hosting). Es lo que **ya tienes empezado**, cuesta **~0 €/mes al principio**, es seguro
para menores (RGPD, servidores en la UE), y **Claude Code lo maneja de sobra**. La alternativa (Next.js en
Vercel) es más potente pero más cara y compleja de lo que el MVP necesita **hoy**. Abajo el detalle y el porqué.

---

## 1. Criterios de decisión (lo que pediste analizar)

| Criterio | Qué importa para este proyecto |
|---|---|
| **Facilidad de desarrollo** | Poder avanzar rápido con Claude Code; poco "fontanería", mucho producto |
| **Seguridad** | Datos de **menores**: cifrado, control de acceso por fila, RGPD, UE |
| **Rendimiento** | Sesiones cortas, mucho audio/imagen → servir rápido desde CDN |
| **Escalabilidad** | De 3 familias piloto a cientos sin reescribir |
| **Coste mensual** | Empezar en ~0 €; que el coste suba **despacio** y **con** los ingresos |
| **Mantenimiento** | Que lo mantenga **1 persona/servicio**; menos piezas = menos que romper |
| **Compatibilidad con Claude Code** | Stack estándar, muy documentado, que la IA construya y depure bien |
| **Encontrar desarrolladores** | Tecnologías comunes (JS/SQL) → fácil relevo si hace falta |
| **Evitar lock-in** | Que los datos sean **exportables** (Postgres estándar), no una jaula |
| **Panel de administración** | Necesario (alta de alumnos + CMS de contenidos) |
| **Audio/imágenes/contenido** | Almacenamiento de archivos + CDN + contenido como datos |
| **PWA futura** | Poder "instalar" la web en el móvil y usar sin depender de tienda de apps |

---

## 2. Comparativa de stacks

### Stack A — Web ligera + Supabase + Netlify **(recomendado)**

| Pieza | Elección |
|---|---|
| **Frontend** | HTML/CSS/JS (progresivo; se puede añadir un framework ligero como **Astro** o **Vite** si crece). Mobile-first, listo para PWA |
| **Backend** | **Supabase**: Postgres + reglas de acceso (RLS) + **Edge Functions** (Deno) para lo que necesite servidor (alta de alumnos, envío de informes) |
| **Base de datos** | **PostgreSQL** (gestionado por Supabase; estándar, exportable) |
| **Autenticación** | Supabase Auth (usuario→email interno + contraseña; cambio en primer acceso; contraseñas cifradas) |
| **Almacenamiento de archivos** | Supabase Storage (audios, imágenes) con control de acceso |
| **CDN** | CDN de Netlify (web y assets) + CDN de Supabase Storage (media) |
| **Hosting** | **Netlify** (deploy desde Git, HTTPS, `_headers`, previews) |
| **Correos** | **Resend** (o Postmark) para informes a familias / reset de acceso; dominio propio verificado |
| **Monitorización** | **Sentry** (errores) + estados de Netlify/Supabase + logs de Edge Functions |
| **Analítica** | **Plausible** o **Umami** (sin cookies, respetuosa con RGPD; nada de Google Analytics para menores) |

- **Ventajas:** una sola plataforma para BD+login+archivos (menos piezas), **gratis** para empezar, muy seguro
  por defecto (RLS), **región UE** disponible, **Claude Code** lo domina, **ya está empezado** (no tiramos trabajo).
  Postgres estándar → datos **exportables**.
- **Inconvenientes:** dependes bastante de Supabase; Edge Functions en Deno son menos comunes que Node; si un día
  necesitas lógica de servidor muy compleja, se queda algo corto.
- **Riesgo de dependencia:** **medio-bajo.** Mitigación real: Postgres es estándar y **Supabase es open-source y
  auto-alojable** → si hiciera falta, se puede migrar el mismo esquema a otro Postgres o a un servidor propio.

### Stack B — Next.js (React) + Vercel + Postgres gestionado

| Pieza | Elección |
|---|---|
| **Frontend** | **Next.js/React** (+ Tailwind) |
| **Backend** | Rutas/API de Next.js (Node) en **Vercel** |
| **Base de datos** | **Postgres gestionado** (Neon / Supabase / Vercel Postgres) |
| **Autenticación** | **Auth.js** (self-host, sin lock-in) o **Clerk** (más fácil, de pago, más lock-in) |
| **Almacenamiento** | **Cloudflare R2** o **AWS S3** |
| **CDN** | CDN de Vercel + Cloudflare |
| **Hosting** | **Vercel** |
| **Correos** | Resend / Postmark |
| **Monitorización** | Sentry + Vercel Analytics/Logs |
| **Analítica** | Plausible / Umami |

- **Ventajas:** máxima potencia y flexibilidad, ecosistema React enorme, **muchísimos** desarrolladores, escala a
  aplicaciones muy grandes; piezas intercambiables (menos lock-in si eliges Auth.js + R2).
- **Inconvenientes:** **más complejo y más caro** de lo que el MVP necesita hoy; más piezas que integrar y mantener
  (auth, storage, BD y hosting por separado); curva mayor; costes de Vercel suben rápido con el tráfico.
- **Riesgo de dependencia:** bajo-medio si eliges piezas abiertas (Auth.js, R2, Postgres); Vercel puede encarecer.

### (Mención) Stack C — Todo auto-alojado (VPS + Supabase self-host / Postgres propio)
Máxima independencia y coste fijo bajo, pero **tú** asumes seguridad, backups, parches y uptime. **No** para el MVP
(demasiado mantenimiento para una persona). Es la **vía de escape** si algún día quieres soberanía total: como el
Stack A usa Postgres estándar y Supabase es open-source, migrar aquí es viable sin reescribir el modelo.

### Costes aproximados por etapas

| Etapa | Stack A (recomendado) | Stack B |
|---|---|---|
| **Piloto (2–3 familias)** | **~0 €/mes** (planes gratis de Supabase + Netlify; correo y analítica en free tier) | ~0–20 €/mes |
| **Lanzamiento (decenas de alumnos)** | **~25–50 €/mes** (Supabase Pro ~25 $ + correo + Sentry) | ~40–90 €/mes |
| **Crecimiento (cientos)** | **~60–150 €/mes** (según almacenamiento de audio y tráfico) | ~120–300 €/mes |

> Cifras orientativas (planes de 2026 varían). La partida que más crece en ambos es **el audio/imágenes**
> (almacenamiento + CDN): conviene comprimir audio y reutilizar media (lo prevé la estrategia de contenido).

---

## 3. Recomendación y por qué

**Recomiendo el Stack A (web ligera + Supabase + Netlify).** Razones, en orden de peso:

1. **Es lo que el MVP necesita, ni más ni menos.** Menos piezas = menos que romper y menos que mantener por una
   persona. Next.js es potencia que hoy **no** vas a usar.
2. **Coste:** arranca en **~0 €** y sube despacio, con los ingresos.
3. **Seguridad para menores:** RLS (cada alumno solo ve lo suyo) + Auth cifrado + **región UE** + analítica sin
   cookies → RGPD desde el diseño.
4. **Claude Code lo construye bien:** stack estándar (SQL + JS) muy documentado.
5. **No tira trabajo:** el esquema, la auth y la Edge Function de alta de alumnos **ya están empezados**.
6. **Lock-in controlado:** Postgres estándar + Supabase open-source → salida real si hiciera falta (Stack C).

**Cuándo reconsiderar y pasar a B:** si el producto crece mucho y necesitas SEO avanzado, render de servidor
complejo, o un equipo grande de React. Migrar A→B **reutiliza** la misma base de datos Postgres (no se reescribe
el modelo), así que empezar por A **no** te encierra.

---

## 4. Arquitectura de carpetas (propuesta)

```
interlanguage-web/
├─ web/                     # sitio público actual (marketing) — ya existe
├─ plataforma/             # la app del alumno (login, inicio, lección, perfil…) — ya existe
│  ├─ index.html            # login
│  ├─ inicio.html · leccion.html · perfil.html · liga.html · tienda.html
│  ├─ admin.html            # panel de administración (alta alumnos + CMS)
│  ├─ app.css
│  ├─ auth.js               # login + sesión
│  ├─ motor/                # (Bloque 2) motor de ejercicios (plantillas P1–P7)
│  │  ├─ engine.js          # carga ejercicio → pinta → valida → feedback → evento progreso
│  │  └─ plantillas/        # p1-seleccion.js, p3-emparejar.js, p5-ordenar.js, p6-huecos.js, p7-comprension.js
│  ├─ progreso.js           # racha, dominio, recomendación (arquitectura pedagógica)
│  ├─ contenido.js          # banco semilla (demo) — en real, viene de Supabase
│  └─ supabase-config.js    # claves públicas (anon) — NO secretas
├─ supabase/
│  ├─ schema.sql            # tablas + RLS + triggers (fuente de verdad del modelo)
│  ├─ migrations/           # cambios de BD versionados y ordenados
│  ├─ seed.sql              # datos iniciales (unidades/objetivos de ejemplo)
│  └─ functions/            # Edge Functions (Deno): admin-create-student, enviar-informe…
├─ docs/superpowers/        # specs y planes (diseño) — ya existe
├─ _headers · _redirects    # config de Netlify (cache, rutas)
└─ .github/workflows/       # CI/CD (lint, checks, deploy)
```

## 5. Separación de responsabilidades
- **Contenido (datos)** ↔ **Motor (código):** el contenido vive en la BD/CMS; el motor es fijo y pequeño.
  Añadir ejercicios **no** toca código.
- **Presentación** (HTML/CSS: cómo se ve) ↔ **Lógica de app** (motor, progreso: cómo funciona) ↔ **Datos/acceso**
  (Supabase: qué se guarda y quién lo ve). Cada capa se entiende y se prueba por separado.
- **Reglas de negocio sensibles en el servidor:** crear alumnos, resetear contraseñas y enviar informes van en
  **Edge Functions** con `service_role` (nunca desde el navegador). El navegador solo usa la clave **anon** + RLS.
- **Pedagogía aislada:** el modelo de dominio/recomendación (`progreso.js`) es un módulo propio, testeable sin UI.

## 6. Entornos: local, staging y producción

| Entorno | Para qué | Cómo |
|---|---|---|
| **Local** | Desarrollar y probar sin tocar datos reales | Servidor estático local + **proyecto Supabase de desarrollo** (o Supabase CLI local) |
| **Staging** | Ensayar como en real antes de publicar | **Deploy Preview de Netlify** (cada rama) + **proyecto Supabase de staging** con datos de prueba |
| **Producción** | Lo que usan las familias | Netlify (rama `main`) + **proyecto Supabase de producción** (datos reales, backups activos) |

Regla dura: **datos de prueba y datos reales SIEMPRE separados** (proyectos Supabase distintos). Nunca probar
sobre datos de menores reales.

## 7. Estrategia de despliegue
- **Git como fuente de verdad.** `main` = producción; ramas de trabajo → **Deploy Preview** automático para revisar.
- **Netlify** despliega solo al hacer push (front estático; sin build pesado en el MVP).
- **Supabase:** los cambios de BD se aplican con **migraciones versionadas** (§tabla abajo), no a mano en el panel.
- **Edge Functions:** se despliegan con la Supabase CLI (idealmente desde CI).
- **Rollback:** Netlify permite volver a un deploy anterior con un clic; la BD se revierte con una migración inversa
  o restaurando backup.

## 8. Gestión de secretos
- **Nunca** en el repositorio ni en el navegador. La clave **anon** de Supabase es pública por diseño (protegida por
  RLS); la **service_role**, claves de correo (Resend) y tokens **son secretos**.
- Se guardan en **variables de entorno**: en **Netlify** (build/functions), en **Supabase** (secrets de Edge
  Functions) y en **GitHub Actions** (para CI/CD). En local, un `.env` **ignorado por git** (`.gitignore`).
- Rotación posible si se filtran; documentar qué clave vive dónde en `supabase/SETUP.md`.

## 9. Copias de seguridad
- **BD:** backups automáticos de Supabase (diarios en plan Pro; retención según plan). Además, **export lógico**
  periódico (`pg_dump`) guardado aparte → independencia del proveedor.
- **Archivos (Storage):** copia periódica del bucket de media.
- **Contenido educativo:** al vivir como datos + el `seed.sql`/export, se puede reconstruir.
- **Probar la restauración** al menos una vez (un backup sin probar no es un backup).

## 10. Migraciones de base de datos
- Todo cambio de esquema = un archivo en `supabase/migrations/` con fecha/orden, **revisado en Git**.
- Se aplican en orden: **local → staging → producción** (nunca editar la BD de producción a mano).
- Cada migración debe ser **reversible** (o tener plan de reversión).
- `schema.sql` refleja el estado actual; las migraciones son el historial de cómo se llegó.

## 11. CI/CD
- **MVP (mínimo viable):** GitHub → push → **Netlify** despliega el front; **preview** por rama. Suficiente para empezar.
- **Añadir pronto (GitHub Actions):**
  - **Checks en cada PR:** lint/format, validación básica del esquema y de los datos de contenido, y (cuando existan)
    tests del **motor** y del **modelo de dominio** (lógica pura, fácil de testear sin UI).
  - **Deploy de Edge Functions y migraciones** desde CI hacia staging, y a producción tras aprobación.
- **Regla:** a `main` solo llega lo que pasa los checks; producción se toca vía pipeline, no a mano.

---

## 12. Qué entra en el MVP y qué se pospone

| Elemento | MVP | Fase posterior |
|---|---|---|
| Stack A (Supabase + Netlify) | ✅ | — |
| RLS + Auth + Storage + región UE | ✅ | auditoría de seguridad formal |
| Panel admin + CMS sencillo | ✅ | CMS avanzado |
| Migraciones versionadas + backups | ✅ | restauración automatizada y probada periódicamente |
| CI básico (deploy + preview) | ✅ | CI completo (tests, deploy de functions/migraciones) |
| Monitorización (Sentry) + analítica sin cookies | ✅ básica | dashboards, alertas |
| Correos (informes/reset) | ✅ | plantillas ricas |
| **PWA** (instalable + repaso offline básico) | ⏳ pronto tras el MVP | offline completo, notificaciones |
| Migrar a Stack B o self-host | — | solo si el crecimiento lo pide (reutiliza Postgres) |

---

### Próximo paso
Recomendado el **Stack A** y definidos carpetas, entornos, despliegue, secretos, backups, migraciones y CI/CD.
Esto sostiene todos los bloques del MVP (en especial el **Bloque 6 — conectar Supabase**). Falta tu visto bueno
para fijar el stack.
