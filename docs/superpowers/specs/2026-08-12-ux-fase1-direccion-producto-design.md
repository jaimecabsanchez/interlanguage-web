# Fase 1 — Dirección de producto UX/visual (decisiones aprobadas)

- **Fecha:** 2026-08-12
- **Fuente/visión:** `docs/UX_VISUAL_PLATFORM_BRIEF.md`
- **Estado:** decisiones de dirección aprobadas por el owner. No incluye diseño de
  pantallas ni implementación (eso va en el plan posterior).
- **Base de código de referencia:** `plataforma/etapa.js` (etapas), `plataforma/motor/matriz.js`
  (puerta de aptitud), `plataforma/layout.js` (navegación e iconos), `plataforma/il-visual.js`
  (lenguaje visual), `design-system.css` (tokens `--il-*`).

## Punto de partida

~70% de la arquitectura de esta visión ya existe y es correcta. Esta fase **consolida** y
afila los límites entre etapas; **no** reinventa. El trabajo real está en cerrar 4 huecos
(ver §Huecos) y en respetar como contrato lo que ya vive en el código.

---

## Decisión 1 — Identidad: metáfora única "Pasaporte del explorador" ✅

Una sola metáfora de producto, ya emergente en el código. Todo lo que no encaje en
*viaje / exploración / pasaporte* se poda. No se introduce un segundo lenguaje visual
(gemas, corazones, ligas).

| Pieza existente | Función en la metáfora |
|---|---|
| Avión de papel (`il-visual.js` `plane`) | Hilo del progreso: avanzar, despegar, llegar |
| Sellos (`stamp`) | Logros = sellos de pasaporte, identidad propia por `id` |
| Nemo (zorro viajero) | Guía de viaje, aparece por momentos (no fijo) |
| Avatar ilustrado ("Elige tu explorador") | El viajero es el alumno |
| "Mi mundo" (`tienda.html`) | Destino que crece |
| Login `blue-fox-317` | Nombre de explorador, no de colegio |

Esta es la identidad propia frente a Duolingo (que es "camino de niveles genérico").

## Decisión 2 — Etapas: 3 pieles visuales, banda como driver real ✅

`etapa.js` ya tiene dos capas y son la arquitectura correcta:
- **Banda pedagógica** (`p12/p34/p56/eso`) → contenido, CEFR, dificultad, nº de opciones.
- **Perfil de experiencia** (`primary-young / primary-upper / secondary`) → piel visual y
  motivacional.

El brief pide 4 experiencias pero hay 3 pieles (`p12` y `p34` comparten `primary-young`).
**No se crea una 4.ª piel.** La diferenciación de 3.º-4.º ya vive en `BAND_EXPERIENCE`
(p34 es `bilingual`, `guideIntensity: medium`, no `spanish`/`high`). Se **formaliza la banda
como driver real de experiencia**; el modo es solo el esqueleto visual grueso. Así 3.º-4.º
= "young con el volumen bajado" (evita la estética guardería que rechaza el brief).

| | 1.º-2.º (p12) | 3.º-4.º (p34) | 5.º-6.º (p56) | ESO (eso) |
|---|---|---|---|---|
| Piel visual | young (máx. color) | young atenuado | upper | secondary |
| Instrucción | español + audio | bilingüe | mixto | inglés |
| Apoyo visual | obligatorio | preferente | opcional | solo contenido |
| Guía (Nemo) | alta | media | baja | nula |
| Celebración | frecuente | media | equilibrada | mínima |
| Sesión | 4 ej. / 5-7 min | 5 / 7 min | 6 / 7-10 min | 7 / 8-12 min |
| Táctil (px) | 56 | 52 | 48 | 44 |
| Máx. opciones | 3 | 4 | 4 | 5 |

Valores ya presentes en `etapa.js` (`BAND_EXPERIENCE`). Contrato: respetarlos, no
inventarlos por pantalla.

## Decisión 3 — Matriz edad·curso·nivel·ejercicio (fuente: `motor/matriz.js`)

La puerta `esApta(ej, banda)` ya filtra por plantilla + CEFR + nº de opciones. Matriz
consolidada que gobierna qué ejercicio ve cada alumno:

| Banda | Curso | CEFR | Plantillas aptas | Skill prioridad | Máx opc. | Autonomía digital | Carga cognitiva |
|---|---|---|---|---|---|---|---|
| p12 | 1.º-2.º | Pre-A1 | P1, P3 | listening, vocab | 3 | Muy baja: tocar/unir, audio, sin teclado | Mínima: 1 concepto, imagen siempre |
| p34 | 3.º-4.º | Pre-A1, A1 | P1, P3, P5, P9 | vocab, listening | 4 | Baja: + ordenar, speaking guiado | Baja: 1-2 pasos |
| p56 | 5.º-6.º | Pre-A1→A2 | P1,P3,P4,P5,P6,P9 | vocab, listening, grammar | 4 | Media: + clasificar, completar | Media: instrucción textual admitida |
| eso | ESO | A1→B1 | P1–P7, P9 | listening, reading, grammar | 5 | Alta: comprensión lectora, gaps | Alta: multi-paso, sin muletas visuales |

Plantillas: P1 elegir imagen/texto · P3 emparejar · P4 clasificar · P5 ordenar · P6 completar
· P7 comprensión · P9 hablar/pronunciación.

## Decisión 4 — Navegación: 4 tabs, Rewards embebido ✅

Se mantiene `Inicio · Practicar · Progreso · Perfil` (`layout.js`). **No** se añade "Rewards"
como 5.ª pestaña (el brief avisa de no hacer protagonista de la navegación las recompensas).
Rewards viven donde ya están: **sellos** dentro de Progreso; **avatar / Mi mundo** dentro de
Perfil. Etiquetas en español en las 4 etapas (legibilidad para padres); la inmersión en
inglés ocurre dentro de la sesión. ESO usa el mismo menú con piel `secondary`.

## Decisión 5 — Componentes visuales comunes (fuente única)

- **Tokens:** `design-system.css` (`--il-*`). Sin hex a mano.
- **Iconos:** `layout.js` (`ILIcon`). Sin emojis de interfaz.
- **Personaje / sellos / avión / reveal:** `il-visual.js`.
- **Botones:** CTA primario (coral físico) · secundario · terciario discreto. Nunca 3 iguales.
- **Progreso:** avión-hilo (fuera de sesión) · barra escalonada `3/7` (dentro) · barras de
  skill (aprendizaje).
- **Feedback:** correcto (micro) · "casi + pista" · "ver explicación". Texto reducido en p12.
- **Celebración escalonada:** micro · milestone · achievement · major. Respeta
  `prefers-reduced-motion` (`ILVisual.reduceMotion()`).
- **Avatar:** ilustrado por preset, asignado por sexo, personalizable.

## Huecos a cerrar (lo que realmente falta)

1. **Secuenciación por dificultad.** `matriz.js` decide aptitud pero **no ordena** la sesión.
   Falta la capa: victoria temprana (P1 fácil) → núcleo → challenge → repaso.
2. **Adaptación ligera** (brief §14): simplificar tras fallos, subir tras dominio.
3. **Repaso espaciado aflorado** (`pedagogia.js`) como 1 recomendación en Home.
4. **Rampa de resultado + "uno más"** consistente al final de sesión.

## Elementos a evitar (poda)

Estética guardería en 3.º+ · emojis como iconografía · Nemo fijo en pantalla · confeti tras
cada respuesta · más opciones que `maxOpciones` · copy corporativo/escolar · racha
culpabilizadora · 5 botones iguales · fondos animados pesados · 5.ª pestaña de Rewards ·
instrucción solo-inglés en young · muñeco infantil obligatorio en ESO · segundo lenguaje
visual paralelo al pasaporte.

## Riesgos

- **Visual:** avatares ilustrados pesan ~1.4 MB/PNG → riesgo de rendimiento en móvil
  (optimizar a WebP/comprimir + lazy load); deriva de estilo entre assets DALL·E.
- **Pedagógico:** sin rampa de dificultad ni adaptación → frustración/aburrimiento;
  repaso espaciado aún no aflora en Home.
- **UX:** 3 pieles vs 4 etapas si no se respeta `BAND_EXPERIENCE`; menú compartido debe
  verificarse en ESO; fuente de verdad del nivel (edad automática vs. asignado por admin).

## Prioridades MVP

**P0 — producto, no cosmética**
1. Home con jerarquía estricta (misión dominante, resto demotado).
2. Flujo de sesión con victoria temprana + pantalla de resultado + "¿una más?".
3. Shell único de ejercicio + estados de feedback ("casi", pista, explicación).
4. Respetar `BAND_EXPERIENCE` como contrato en las 4 bandas.
5. Optimizar peso de avatares (perf).

**P1 — engagement**
6. Secuenciación por dificultad + adaptación ligera.
7. Aflorar repaso espaciado como 1 recomendación personalizada.
8. Objetivo semanal + streak-save sin ansiedad.
9. Capa visual "Duolingo-premium" de ejercicios young (PNG de `assets/ejercicios/`).
10. Panel de familias (`informe.html`).

**P2 — pulido**
11. Rewards hub · challenges (uno destacado) · sistema de sonido · desbloqueo de ítems de
    avatar · mapa de learning-path.

## Fuera de alcance de esta fase

Diseño de pantallas concretas, código y modificación de archivos de la app. El siguiente
paso es un plan de implementación por prioridades empezando por P0.
