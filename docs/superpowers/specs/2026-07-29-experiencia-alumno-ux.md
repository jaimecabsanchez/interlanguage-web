# Experiencia completa del alumno · Plataforma Interlanguage (MVP)

**Fecha:** 2026-07-29 · **Estado:** borrador para aprobación.
Base: `2026-07-29-plataforma-practica-ingles-design.md` y `2026-07-29-roles-permisos-rbac.md`.
Foco MVP: **Primaria (6–11)**. Se anota lo que cambiaría en ESO (fase posterior).

## Principios de la experiencia
1. **Una pantalla = una decisión.** El alumno nunca duda de qué hacer.
2. La pantalla de inicio responde a **"¿qué tengo que hacer hoy?"** en 1 segundo.
3. **Nunca un examen.** Todo se siente como jugar/practicar.
4. **Anti-frustración:** el error explica y deja reintentar; nada penaliza en exceso.
5. **Audio primero** para 6–8 años (aún no leen bien): instrucciones y palabras con voz.
6. **Objetivo semanal**, no obligación diaria: perder un día no rompe nada.

---

## A. Propuesta de navegación (no acepto la de 5 sin más)

**Propuesta del usuario:** Inicio · Practicar · Mi progreso · Mi colección · Perfil (5 pestañas).

**Crítica:** 5 pestañas son muchas para Primaria, y **"Mi progreso" y "Mi colección" se solapan**
(ambas son "mira lo que has logrado"). Más pestañas = más ruido y más dudas para un niño.

**Recomendación: 4 pestañas**, fusionando colección dentro de progreso:

| Pestaña | Para qué |
|---|---|
| 🏠 **Inicio** | "¿Qué hago hoy?" — la misión del día. Es la estrella. |
| 🎯 **Practicar** | Práctica libre / por unidad y **repaso** de lo que falla. |
| 📈 **Progreso** | Racha, avance, habilidades y **medallas/colección** (aquí dentro). |
| 👤 **Perfil** | Avatar/personalización, ajustes básicos y cerrar sesión. |

**Adaptación por edad (misma app, distinto peso):**
- **Primaria inicial (6–8):** el **Inicio manda** (un botón enorme "¡Empezar!"). Las otras pestañas
  existen pero son secundarias, con iconos grandes. "Practicar" se presenta como "más juegos".
- **Primaria superior (9–11):** las 4 pestañas con normalidad; algo más de autonomía.
- **ESO (fase posterior):** mismas 4, estética más sobria, "Progreso" gana peso (metas, nivel).

---

## B. Recorrido completo (de las credenciales a varias semanas)

### 1. Primer inicio de sesión
Recibe (kit/mensaje) su **código de alumno** (ej. `luciag-4K7`) y una **contraseña temporal**.
Abre el enlace → pantalla de login (usuario + contraseña, con "ojo" para mostrar). Los más
pequeños entran acompañados de un adulto la primera vez.

### 2. Cambio obligatorio de contraseña
Tras el primer login, **obligatorio** crear su propia contraseña. Medidor simple de fuerza,
mínimo razonable, y no se puede continuar sin cambiarla. Para 6–8 años, con ayuda del adulto.

### 3. Onboarding (< 1 minuto)
- Bienvenida breve de la **mascota/personaje** (cuando exista; hoy, la mascota actual).
- **Elegir avatar/color** (personalización no sensible).
- 2–3 pantallas ilustradas: "cada día tienes una **misión corta**; si fallas, no pasa nada".
- Termina lanzando la **primera actividad muy fácil** (éxito garantizado).

### 4. Diagnóstico inicial — ¿necesario? (recomendación: NO formal en el MVP)
Un test de nivel al empezar es **intimidante y poco útil** para Primaria. Recomendación:
- Punto de partida = **curso/edad + nivel asignado por el profe**.
- La plataforma **calibra en silencio** con las primeras sesiones (si va sobrado o le cuesta,
  ajusta la dificultad).
- Opcional para 9+: un **mini-reto de bienvenida** de 3–4 ítems, presentado como "vamos a
  conocernos" (se siente como la primera actividad, **no como examen**). Para 6–8, se omite.

### 5. Pantalla de inicio ("¿qué hago hoy?")
Saludo + **misión del día** (grande, un botón) + racha + progreso de la semana + acceso a
**repaso** o **"continuar"** si procede. Nada más. Cero biblioteca.

### 6. Sesión recomendada del día
Estructura: **calentamiento/repaso corto → 1 concepto nuevo → práctica variada → mini-reto →
cierre con recompensa discreta.** Duraciones por edad:
- Primaria inicial (6–8): **5–10 min** (~3–5 microactividades).
- Primaria superior (9–11): **8–12 min** (~4–6 actividades).
- ESO (12–16): **10–15 min** (~5–7; más lectura/gramática).

### 7. Ejecución de actividades
**Una actividad a la vez**, barra de progreso arriba, instrucciones con **audio**, objetivos de
interacción sencillos (tocar, arrastrar, elegir). Botón "Comprobar" claro.

### 8. Corrección y explicación de errores
- **Acierto:** feedback positivo breve (color, sonido opcional, +XP).
- **Error:** se marca en suave (no en rojo agresivo), **explica el porqué** y **deja reintentar**.
  No hay castigo ni "suspenso". El fallo se guarda para el repaso.

### 9. Repaso
Lo **fallado** y lo **no visto hace días** reaparece de forma natural (repaso simple en el MVP;
avanzado en Fase 2). Acceso directo a "Repasar" desde Inicio cuando hay pendientes.

### 10. Progreso
Pantalla Progreso: **racha**, días de práctica, **habilidades** trabajadas, **"lo que ya sé
decir"** y **medallas/colección**. Enfocado a "mira cuánto has avanzado", sin notas ni
comparaciones con otros.

### 11. Objetivo semanal
Meta **flexible** ("practica 4 días esta semana") con barra que se llena. Mejor que exigir cada
día. Al cumplirla, celebración discreta.

### 12. Vuelta tras varios días sin entrar
Mensaje **positivo y sin culpa** ("¡Qué bien que has vuelto! 👋"). **Racha con día comodín /
recuperación** para no frustrar. Se retoma con algo fácil que devuelva la confianza.

### 13. Recuperación de contraseña
El alumno **no usa email personal**. Si la olvida: "pídesela a tu profe / en Interlanguage".
El **admin la restablece** (o la familia la solicita). Nunca auto-reset por email del menor.

### 14. Cierre de sesión
Botón claro en **Perfil**. Importante en dispositivos compartidos (tablet familiar). Sesión
segura; al cerrar, vuelve al login.

---

## C. Especificación por pantalla

*(Campos: Objetivo · Contenido · Jerarquía · CTA principal · Estado vacío · Estado de carga ·
Error · Móvil · Primaria vs ESO.)*

### Login
- **Objetivo:** entrar rápido y sin dudas.
- **Contenido:** logo/mascota, campo usuario, campo contraseña (con "ojo"), botón Entrar, ayuda
  "¿olvidaste la contraseña? pídesela a tu profe".
- **Jerarquía:** mascota → título → campos → botón.
- **CTA:** **Entrar**.
- **Vacío:** botón deshabilitado hasta rellenar.
- **Carga:** botón "Entrando…" con spinner.
- **Error:** "Usuario o contraseña incorrectos" (sin decir cuál falla). Tras varios intentos,
  bloqueo temporal.
- **Móvil:** pantalla completa, campos grandes, sin teclado que tape el botón.
- **Primaria vs ESO:** Primaria más ilustrado y cálido; ESO más sobrio.

### Cambio obligatorio de contraseña
- **Objetivo:** que el alumno tenga una contraseña suya.
- **Contenido:** nueva contraseña + repetir, medidor de fuerza, consejos simples.
- **Jerarquía:** título "Crea tu contraseña" → campos → guardar.
- **CTA:** **Guardar contraseña**.
- **Vacío/Carga/Error:** botón inactivo hasta válida; "Guardando…"; "Las contraseñas no coinciden"
  / "Debe tener al menos N caracteres".
- **Móvil:** igual que login. **En primer acceso no se puede saltar.**
- **Primaria vs ESO:** en 6–8, textos con audio y ayuda del adulto.

### Onboarding
- **Objetivo:** dar la bienvenida y explicar el juego en < 1 min.
- **Contenido:** saludo mascota, elegir avatar/color, 2–3 tarjetas de "cómo funciona".
- **Jerarquía:** una idea por pantalla, botón "Siguiente".
- **CTA:** **Siguiente** → termina en **"¡Empezar!"**.
- **Vacío:** n/a (guiado). **Carga:** transición suave. **Error:** si falla, se puede saltar a Inicio.
- **Móvil:** a pantalla completa, deslizable.
- **Primaria vs ESO:** ESO más breve y menos "personaje".

### Inicio ("¿qué hago hoy?")
- **Objetivo:** responder al instante qué hacer hoy.
- **Contenido:** saludo + **misión del día** (tarjeta grande) + racha + progreso semanal +
  (si hay) "Repasar" / "Continuar".
- **Jerarquía:** misión del día **domina**; el resto, secundario.
- **CTA:** **Empezar misión**.
- **Vacío:** si ya practicó hoy → "¡Misión de hoy hecha! 🎉 ¿Práctica extra?" (opcional, sin presión).
- **Carga:** esqueleto de la tarjeta (sin saltos de layout).
- **Error:** si no carga, "No hemos podido cargar tu misión. Reintentar."
- **Móvil:** es la pantalla principal; todo alcanzable con el pulgar.
- **Primaria vs ESO:** 6–8 → botón gigante y poco texto; ESO → añade progreso hacia metas/nivel.

### Sesión / Actividad
- **Objetivo:** practicar con foco, una cosa a la vez.
- **Contenido:** barra de progreso, la actividad, botón Comprobar/Continuar, salir (X).
- **Jerarquía:** la actividad ocupa el centro; controles arriba/abajo.
- **CTA:** **Comprobar** → **Continuar**.
- **Vacío:** n/a. **Carga:** precarga de audio/imagen antes de mostrar.
- **Error (técnico):** si falla una actividad, saltarla sin romper la sesión.
- **Móvil:** objetivos táctiles grandes; audio con botón visible.
- **Primaria vs ESO:** Primaria más imagen/audio; ESO más texto (lectura, cloze, gramática).

### Corrección (dentro de la actividad)
- **Objetivo:** aprender del error sin frustrarse.
- **Contenido:** marca acierto/error, **explicación breve**, opción de reintentar.
- **CTA:** **Continuar** (o **Reintentar**).
- **Móvil:** el mensaje no tapa la actividad; se lee de un vistazo.

### Progreso
- **Objetivo:** que el alumno vea y sienta su avance.
- **Contenido:** racha, días de práctica, habilidades, "lo que ya sé decir", medallas/colección.
- **Jerarquía:** lo emocional primero (racha, medallas), luego el detalle.
- **CTA:** volver a practicar.
- **Vacío:** recién empezado → "Aún no hay mucho que ver… ¡haz tu primera misión!" con botón.
- **Carga:** esqueletos de tarjetas.
- **Error:** "No hemos podido cargar tu progreso. Reintentar."
- **Móvil:** tarjetas apiladas, scroll cómodo.
- **Primaria vs ESO:** ESO añade progreso hacia nivel (A1→A2) y metas.

### Perfil
- **Objetivo:** personalizar y gestionar lo básico.
- **Contenido:** avatar, nombre/alias, cambiar contraseña, **cerrar sesión**.
- **CTA:** editar avatar.
- **Vacío/Carga/Error:** mínimos.
- **Móvil:** lista simple.
- **Primaria vs ESO:** ESO más sobrio; Primaria con avatar protagonista.

### Recuperación de contraseña
- **Objetivo:** recuperar acceso sin email del menor.
- **Contenido:** mensaje claro "pide ayuda a tu profe / en Interlanguage". (El reset lo hace admin.)
- **CTA:** volver al login.
- **Móvil/Errores:** sencillo; no revela si el usuario existe.

---

## D. Diferencias por etapa (resumen)

| | Primaria inicial (6–8) | Primaria superior (9–11) | ESO (12–16) *(fase posterior)* |
|---|---|---|---|
| Sesión | 5–10 min | 8–12 min | 10–15 min |
| Texto | Mínimo; **audio** protagonista | Texto sencillo | Texto normal |
| Botones | Enormes | Grandes | Normales |
| Navegación | Inicio manda; resto secundario | 4 pestañas normales | 4 pestañas, sobrias |
| Estética | Muy cálida/lúdica | Cálida | Madura, sin infantilismos |
| Motivación | Recompensas visibles y simples | Racha, medallas, metas | Progreso/nivel, metas de examen |
| Diagnóstico | Ninguno | Opcional mini-reto (3–4 ítems) | Mini-reto algo mayor |

---

## Decisiones pendientes de tu aprobación
1. **Navegación:** ¿4 pestañas (Inicio · Practicar · Progreso · Perfil) en vez de 5? *(recomendado)*
2. **Diagnóstico:** ¿sin test formal en el MVP (calibración silenciosa + mini-reto opcional para 9+)? *(recomendado)*
