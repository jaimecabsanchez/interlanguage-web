# Interlanguage HOME · Roadmap completo hacia "app profesional"
Fecha: 2026-08-08. Objetivo: acabado tipo app store (detalles cuidados, estilos
modernos, **dashboards de progreso lo más completos posible**), sin perder la
identidad propia ni la calidad educativa.

**Leyenda:** ✅ hecho · ⏳ en curso · ⬜ pendiente · 🛠️ lo hago yo · 🔑 necesita tu acción · 🎨 decisión de diseño/producto tuya.

---

## A · Base técnica (rediseño por fases)
- ✅ **F0** Tokens de color únicos (`--il-*`).
- ✅ **F1** Navegación como componente único (`layout.js`).
- ✅ **F2** Iconografía propia (SVG). Retirados los emojis de chrome: racha/gemas, comodín, candados, títulos, categorías de tienda, personalizar, estado de error. (Se dejan como contenido: el zorro Nemo, los cosméticos de la tienda y los iconos de medalla). 🛠️
- ⏳ **F3** Identidad "recorrido de aprendizaje". Hecho: **mapa de recorrido** en Progreso (ruta de destinos con inicio/meta e iconos de tema). ⬜ Falta: llevar la metáfora de viaje al resto (sellos/pasaporte al completar, avión en inicio, transiciones). 🛠️🎨
- ⬜ **F4** Aplicar el sistema a todas las pantallas + normalizar breakpoints (un único juego responsive). 🛠️
- ⬜ **F5** Auditoría de accesibilidad AA + rendimiento. 🛠️

## B · "Look & feel" de app profesional (detalles cuidados) 🛠️
- ⬜ **Sistema de elevación/sombras** por niveles (tarjeta, flotante, modal) coherente.
- ⬜ **Escala tipográfica** pulida + **números tabulares** para datos (que no "bailen").
- ⬜ **Skeletons de carga** consistentes en TODAS las pantallas (no solo inicio).
- ⬜ **Estados vacíos** con ilustración propia + acción (no solo texto).
- ⬜ **Transiciones entre pantallas** y entradas escalonadas coherentes (ya iniciado).
- ⬜ **Feedback táctil** unificado en botones (pulsación, hover, focus) — mismo lenguaje.
- ⬜ **Toasts/notificaciones** con estilo propio (éxito/error/info).
- ⬜ **Microcelebraciones** pulidas al terminar (confeti sobrio, opción de sonido, badge animado).
- ⬜ **Ilustraciones propias** (SVG) para recompensas y estados — sustituir emojis grandes (🦊 reward, etc.).
- ⬜ **Modo oscuro** (muy "de app"; opcional pero suma mucho). 🎨
- ⬜ **Gestos móviles** (deslizar, pull-to-refresh) donde aporte.
- ⬜ **Splash / carga inicial** con marca.
- ⬜ **Favicon / icono de app** propio (hoy usa un PNG genérico) + "Añadir a pantalla de inicio" (PWA).

## C · Dashboards de progreso completos 🛠️ (tu prioridad)
Rediseñar **Progreso** como un panel rico y motivador (sin rankings ni comparaciones con otros):
- ✅ **Racha con calendario**: "heatmap" de actividad de las últimas 16 semanas (estilo GitHub) + días activos totales.
- ✅ **Progreso por habilidad** (Vocabulario · Gramática · Listening · Reading) con barras y % de dominio.
- ✅ **Nivel CEFR** con escalera de avance (Principiante → A1 → A2 → B1) y posición actual marcada.
- ✅ **Objetivo semanal** (7 días) + **cifras totales** (misiones, días activos, XP, gemas).
- ✅ **"Lo que ya sé decir"** (can-do) con estado vacío honesto.
- ✅ **Medallas/logros** (ganadas vs. bloqueadas, con candado propio) + **detalle al tocar**: cómo se consigue y cuánto falta (barra de progreso).
- ✅ **Evolución en el tiempo**: gráfica de constancia (días activos por semana, últimas 8 semanas).
- ✅ **Comparación solo con uno mismo** (esta semana vs. la anterior, en positivo, sin culpa).
- ⬜ **Precisión y ritmo**: % de aciertos, minutos por sesión (requiere registrar la sesión).
- ✅ **Mapa de aprendizaje** ("Tu recorrido"): unidades como destinos en una ruta, disponibles/próximos según tu nivel. Crece solo al añadir unidades en el CMS.
- ⬜ **Objetivo mensual** con progreso visual.
- ⬜ **Informe para la familia** (versión pro, clara y compartible por enlace).
- ⬜ **Panel del profesor**: dashboard por alumno y por grupo (quién practica, quién se atasca). 🔑(necesita cuentas de profe)

> **Nota de datos:** el panel se alimenta de datos reales; donde aún no hay (habilidades por objetivo,
> minutos, aciertos), en producción sale del alumno y en la cuenta de demostración (lucia) se muestran
> **datos de muestra coherentes** con su racha y misiones, para poder enseñarlo.

## D · Contenido y pedagogía (el "relleno" real) 🛠️ + 🎨
- ⬜ **Crear mucho más contenido** y de más nivel (A2/B1) con el mini-CMS.
- ⬜ **Ampliar el CMS**: tipos ordenar, emparejar, comprensión, listening, writing, speaking.
- ⬜ **Escalera de niveles / desbloqueo de unidades** (ruta con progresión).
- ⬜ **Repaso espaciado real** cableado (`pedagogia.js` ↔ intentos/dominio 1·3·7·16).
- ⬜ **Listening con audio real** (hoy es voz sintética del navegador).
- ⬜ **Writing** (evaluación) y **Speaking** (grabación) — funciones más avanzadas.
- ✅ Variedad diaria (mejora al crecer el contenido).

## E · Producción / infraestructura 🔑 (dependen de ti / tu Supabase)
- ⬜ **Persistir en Supabase** (hoy en el navegador): nivel colocado, días de práctica, contenido del CMS.
- ⬜ **Publicar en Netlify** → URL pública, verlo desde el móvil y enseñarlo.
- ⬜ **Desplegar Edge Functions** (crear alumno, informe familia) + secretos.
- ⬜ **Proyecto Supabase de producción** (separado del de desarrollo).
- ⬜ **Seguridad**: CSP y cabeceras en Netlify; revisar RLS con datos reales.
- ⬜ **Copias de seguridad** del contenido y datos.

## F · Producto / negocio 🎨 + 🔑
- ⬜ **Onboarding de la familia** y **pago** del add-on (+10 €/mes): alta, suscripción, gestión.
- ⬜ **Roles**: profesor (gestiona alumnos/grupos), familia (ve el progreso del hijo).
- ⬜ **Recordatorios**: notificación/email diario de "tu misión de hoy".
- ⬜ **Informe automático** a las familias (resumen semanal).
- ⬜ **Textos legales / RGPD** (menores, consentimientos). 🔑(abogado)

---

## Orden recomendado (para que se note pronto y bien)
1. **Terminar F2 + F4** (iconos y coherencia total en todas las pantallas). — se ve enseguida.
2. **F3 identidad "recorrido"** + ilustraciones propias. — el mayor salto de "marca profesional".
3. **Dashboard de progreso completo (C)**. — tu prioridad; muy visible y motivador.
4. **B (detalles de app: sombras, skeletons, dark mode, celebraciones)**. — pulido fino.
5. **Contenido (D)** con el CMS. — lo que "llena" la app.
6. **Producción (E)** cuando quieras verlo en internet/móvil y con alumnos reales.

> Nota honesta: A, B, C y F2/F3/F4 los construyo yo y se ven en local. D (contenido) es
> trabajo conjunto. E (producción) depende de tu Supabase/Netlify. Un dashboard de
> progreso "completo de verdad" luce al 100% cuando hay **datos reales** (E) y
> **contenido** (D); mientras, se ve con datos de ejemplo.
