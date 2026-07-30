# Plataforma de práctica de inglés · Bloques del MVP (pendientes)

> Hoja de ruta para construir el MVP, por orden. Se retoma aquí cada vez.
> Diseño completo en: `docs/superpowers/specs/2026-07-29-plataforma-practica-ingles-design.md`

**Contexto del MVP:** Primaria (6–11) · contenido con IA + revisión de profe ·
perfiles alumno + admin + vista de familias · stack ligero (web + Supabase + Netlify).

---

## Bloques (en orden)

- [x] **Bloque 1 — Sacar el contenido del código.**
      Banco de ejercicios editable. → HECHO: `plataforma/contenido.js` (2 unidades de
      ejemplo: "Mi rutina diaria" y "La comida"). Es el formato que usarán el CMS y Supabase.

- [ ] **Bloque 2 — Motor de ejercicios que lee del banco.**
      Que la lección cargue los ejercicios desde `contenido.js` (no fijos), con soporte de
      **audio** para los que aún no leen. Reutiliza `plataforma/leccion.html`.

- [ ] **Bloque 3 — Panel de admin + mini-CMS.**
      Alta de alumnos (código de alumno + contraseña temporal) y herramienta sencilla para
      crear/editar/publicar ejercicios con un formulario (estados: borrador → revisión → publicado).
      Sigue la estrategia de contenido: `docs/superpowers/specs/2026-07-29-estrategia-contenido-editorial.md`
      (plantillas P1–P7, duplicar, etiquetas, búsqueda, versionado mínimo, alertas de calidad, IA solo borradores).

- [ ] **Bloque 4 — Sesión diaria + progreso real + racha.**
      Lógica "¿qué hago hoy?", estados de dominio (nuevo/practicando/dominado/necesita repaso),
      racha flexible, progreso guardado. Repaso simple (avanzado queda para Fase 2).
      Sigue la arquitectura pedagógica: `docs/superpowers/specs/2026-07-29-arquitectura-pedagogica.md`
      (umbral Dominado ≥3 aciertos en ≥2 días; repaso 1·3·7·16 días; recomendación por reglas).

- [ ] **Bloque 5 — Vista de familias.**
      Resumen de solo lectura: días de práctica, "lo que ya sabe decir", racha, vigencia del
      acceso, solicitar restablecer contraseña. Sin notas ni comparaciones.
      DECISIÓN (2026-07-29): **informe semanal + resumen web por enlace seguro y caducable**;
      SIN cuenta familiar con login en el MVP (cuenta completa → Fase 2). Reset lo hace el admin.
      Roles y RBAC definidos en `docs/superpowers/specs/2026-07-29-roles-permisos-rbac.md`.

- [ ] **Bloque 6 — Conectar Supabase (real).**
      Cuentas y datos reales (contraseñas cifradas, progreso guardado, contenido en base de datos).
      ⚠️ Necesita que el usuario cree su proyecto Supabase — hay que guiarle.
      Stack aprobado (2026-07-29): **Stack A** — web ligera + Supabase (Postgres+RLS+Auth+Storage, región UE) +
      Netlify; correos Resend; analítica sin cookies (Plausible/Umami); Sentry. Entornos, secretos, backups,
      migraciones y CI/CD en `docs/superpowers/specs/2026-07-29-arquitectura-tecnica-mvp.md`.

- [ ] **Bloque 7 — Contenido inicial + piloto + legal.**
      6–8 unidades reales (IA genera borradores, un profe revisa/aprueba), prueba con 2–3
      familias piloto, y **revisión legal (RGPD/menores)** antes de lanzar.
      DECISIÓN (2026-07-29): nivel de lanzamiento **3.º–4.º Primaria (A1)**; ~100–130 ejercicios
      (6–8 unidades × ~4 objetivos × ~4 ejercicios) para cubrir **6–8 semanas**; ampliar 1–2 unidades/mes.
      Estructura de las 8 unidades y flujo editorial en la estrategia de contenido (mismo doc del Bloque 3).

---

## Tracks "humanos" en paralelo (no son código)
- **Supabase:** el usuario crea el proyecto (guiado). Necesario para el Bloque 6.
- **Contenido:** un profe de Interlanguage revisa y aprueba los ejercicios.
- **Legal:** un asesor revisa consentimientos/privacidad/cookies antes de lanzar.

---

## Estado actual
- ✅ Diseño aprobado (luz verde).
- ✅ Bloque 1 hecho.
- ⏭️ **Siguiente cuando retomemos: Bloque 2.**
- El usuario irá enviando otras tareas entremedias; al terminarlas, se vuelve a esta lista.
