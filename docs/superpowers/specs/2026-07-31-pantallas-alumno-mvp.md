# Pantallas del alumno (MVP) · diseño detallado

**Fecha:** 2026-07-31 · **Estado:** aprobado.
Base: `2026-07-31-ux-vision-visual-design.md`, `2026-07-29-experiencia-alumno-ux.md` y lo construido.
Alcance: **7 pantallas del alumno**. NO incluye familia/profesor/admin.
Marca de estado: `[✅ construido]` / `[⬜ por construir]` / `[⚠️ a corregir]`.

Dimensiones por pantalla: Objetivo · Jerarquía · Contenido · CTA · Estados · Edades (4 bandas
p12/p34/p56/eso) · Móvil · Nemo · Microinteracciones.

---

## 1. Login `[✅ construido · pulir por banda]`
- **Objetivo:** entrar rápido y sin dudas.
- **Jerarquía:** Nemo+marca → "¡Hola de nuevo!" → usuario → contraseña (ojo) → Entrar → ayuda.
- **Contenido:** código de alumno (blue-fox-317), contraseña con toggle, "¿olvidaste? pídesela a tu profe";
  paso 2FA solo si la cuenta lo tiene (admin).
- **CTA:** Entrar.
- **Estados:** vacío (botón inactivo) · cargando ("Entrando…") · error genérico ("Usuario o contraseña
  incorrectos", no dice cuál; bloqueo temporal tras varios) · 2FA (campo de código).
- **Edades:** 1.º–4.º Nemo grande/cálido, campos enormes, entra con adulto, ayuda con audio · 5.º–6.º normal ·
  ESO sobrio, casi sin Nemo.
- **Móvil:** pantalla completa, campos grandes, teclado no tapa el botón, autocompletar.
- **Nemo:** pose saludo; en ESO solo logo.
- **Microinteracciones:** ojo mostrar/ocultar · botón→spinner · shake suave en error (off si reduced-motion).

## 2. Primer acceso — cambio obligatorio de contraseña `[✅ construido]`
- **Objetivo:** que el alumno tenga su contraseña; no se puede saltar.
- **Jerarquía:** Nemo "¡Bienvenido!" → "Crea tu contraseña" → nueva + repetir → medidor → Guardar.
- **Contenido:** consejo simple ("algo que recuerdes, mín. 8"), medidor de fuerza en barras.
- **CTA:** Guardar contraseña.
- **Estados:** vacío (inactivo) · error ("no coinciden" / "mín. 8") · cargando ("Guardando…") · éxito.
- **Edades:** 1.º–4.º con ayuda del adulto + audio, medidor por color · 5.º–ESO autónomo.
- **Móvil:** igual que login; en primer acceso no hay salir.
- **Nemo:** animando; discreto en ESO.
- **Microinteracciones:** medidor en tiempo real · check verde al coincidir · transición a onboarding.

## 3. Onboarding (<1 min) `[⬜ por construir]`
- **Objetivo:** bienvenida + explicar el juego en <1 min; terminar lanzando una actividad muy fácil (éxito garantizado).
- **Jerarquía:** una idea por pantalla, Nemo protagonista, Siguiente → "¡Empezar!".
- **Contenido:** 3 tarjetas — (1) Nemo se presenta + elegir avatar/color; (2) "cada día, una misión corta";
  (3) "si fallas, no pasa nada, se repite". Cierra con una microactividad P1 fácil.
- **CTA:** Siguiente → ¡Empezar!.
- **Estados:** guiado (sin vacío) · carga suave · si falla, saltar a Inicio.
- **Edades:** 1.º–4.º todo con audio, avatar protagonista · 5.º–6.º más rápido · ESO 1 pantalla breve + "saltar".
- **Móvil:** pantalla completa deslizable, puntos de progreso.
- **Nemo:** guía todo (saludo, señalar, celebrar).
- **Microinteracciones:** swipe entre tarjetas · previsualización del avatar al elegir color · confeti breve al "¡Empezar!".

## 4. Inicio — "¿Qué hago hoy?" ⭐ `[✅ construido · pulir 4 bandas]`
- **Objetivo:** responder en 1 segundo qué hacer hoy.
- **Jerarquía:** saludo (Nemo) → la tarjeta "misión del día" DOMINA (botón "Empezar misión") → racha + meta
  semanal (secundario) → "Repasar/Continuar" si procede.
- **Contenido:** "¡Hola, [nombre]!", misión del día, chips 🔥/💎, barra de meta semanal, nav abajo.
- **CTA:** Empezar misión.
- **Estados:** normal · ya completada hoy ("¡Misión de hoy hecha! 🎉 ¿extra?") · cargando (skeleton sin saltos) ·
  error ("no hemos podido cargar tu misión, reintentar") · sin conexión (banner).
- **Edades:** 1.º–2.º botón gigante, casi solo la misión, Nemo grande · 3.º–4.º misión destacada · 5.º–6.º
  misión + progreso semanal · ESO añade progreso hacia nivel/metas, sobrio.
- **Móvil:** es LA pantalla; todo al pulgar; misión centrada.
- **Nemo:** saluda y presenta la misión; casi ausente en ESO.
- **Microinteracciones:** chip de racha "late" al entrar · barra semanal se anima · leve pulso del botón (off si reduced-motion).

## 5. Navegación (barra de 4 pestañas) `[⚠️ a corregir]`
- **Objetivo:** moverse entre 4 zonas sin dudar.
- **Jerarquía:** barra inferior fija; 4 icono+etiqueta; activo en coral.
- **Contenido:** 🏠 Inicio · 🎯 Practicar · 📈 Progreso · 👤 Perfil. → CORREGIR: quitar "Liga" (ranking prohibido),
  meter "Tienda" dentro de Perfil.
- **CTA:** n/a.
- **Estados:** pestaña activa (aria-current) · badge discreto en Practicar si hay repaso pendiente.
- **Edades:** 1.º–2.º iconos enormes e Inicio domina · 3.º–4.º Inicio destacado · 5.º–6.º 4 normales · ESO sobrio, Progreso pesa.
- **Móvil:** barra inferior (pulgar); desktop igual.
- **Nemo:** n/a.
- **Microinteracciones:** transición suave · micro-rebote del icono activo (off si reduced-motion) · badge de repaso discreto.

## 6. Sesión recomendada del día `[✅ construido · falta composición por reglas + puerta de la matriz]`
- **Objetivo:** practicar con foco, una actividad a la vez; estructura calentamiento → concepto nuevo → práctica → mini-reto → cierre.
- **Jerarquía:** barra de progreso + X (arriba) → la actividad al centro → Comprobar/Continuar (abajo, sticky).
- **Contenido:** tarjeta-ejercicio (P1–P7 según banda/matriz), botón de audio, banner de feedback.
- **CTA:** Comprobar → Continuar.
- **Estados:** cargando (precarga audio/imagen) · acierto (jade breve + XP) · error (marca suave + explica +
  reintentar) · técnico (saltar actividad sin romper sesión) · sin conexión (banner) · contenido no disponible.
- **Edades (puerta de la matriz):** 1.º–2.º 3–5 microactividades, audio auto, ≤3 opciones, tocar · 3.º–4.º ≤4,
  tocar-ordenar · 5.º–6.º huecos con banco · ESO cloze/comprensión, escribir libre.
- **Móvil:** una actividad a pantalla; táctiles grandes; teclado no tapa "Comprobar".
- **Nemo:** en transiciones/mini-reto y anima tras el acierto; ausente durante la resolución; mínimo en ESO.
- **Microinteracciones:** opción resaltada · "Comprobar" valida en servidor · acierto = check verde +
  micro-celebración · error = explicación que se desliza · barra avanza.

## 7. Fin de sesión `[✅ construido · pulir por banda]`
- **Objetivo:** cerrar con recompensa discreta y sensación de logro; invitar a volver mañana.
- **Jerarquía:** Nemo celebrando → "¡Misión completada!" → resumen (aciertos, racha, gemas) → medallas nuevas → Volver al mapa.
- **Contenido:** aciertos X/Y, 🔥 racha, +gemas, medallas nuevas (chips); (Fase 2: barra de meta semanal que sube).
- **CTA:** Volver al mapa (Inicio).
- **Estados:** normal · sin medallas nuevas (solo stats) · racha subió (mensaje) · última del día ("vuelve mañana").
- **Edades:** 1.º–4.º celebración visible y simple, Nemo grande festejando · 5.º–6.º racha+medallas · ESO sobrio, foco en progreso/nivel.
- **Móvil:** pantalla completa centrada, botón grande.
- **Nemo:** protagonista celebrando (pose "¡lo lograste!"); breve y silenciable; mínimo en ESO.
- **Microinteracciones:** trofeo "pop" (off si reduced-motion) · medallas entran una a una · sonido opcional · botón vuelve a Inicio.

---

## Acciones que salen de este diseño (para el plan)
- ⬜ Construir **Onboarding** (nuevo).
- ⚠️ **Corregir la navegación** (quitar Liga, Tienda dentro de Perfil).
- 🔧 **Pulir 4 bandas** en login/inicio/sesión/fin (tokens de `data-stage`).
- 🔧 Sesión **compuesta por reglas** + **puerta de la matriz** (B9/B6).
No incluye familia/profesor/admin (fuera de alcance).
