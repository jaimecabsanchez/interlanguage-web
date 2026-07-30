# Experiencia de los ejercicios (MVP) · diseño detallado

**Fecha:** 2026-07-31 · **Estado:** aprobado.
Base: `2026-07-29-catalogo-actividades-motor.md` (plantillas P1–P9), `2026-07-31-ux-vision-visual-design.md`
(4 bandas + puerta de la matriz), `2026-07-29-arquitectura-pedagogica.md` (dominio, espaciado).
Alcance: estructura base + flujo de una actividad + adaptación por los 10 tipos. No incluye código.

## A. Estructura base de una actividad (anatomía común)
1. Etiqueta de habilidad · 2. Instrucción + botón de audio (auto en 1.º–4.º) · 3. Estímulo opcional
(imagen/audio/texto breve) · 4. Zona de respuesta (según tipo) · 5. Comprobar (sticky, activo solo si hay
respuesta) · 6. Zona de feedback (icono + texto, no solo color).
Metadatos invisibles que la gobiernan: `plantilla · cefr · edad[min,max] · dificultad · objetivo ·
prerequisites` → la **puerta de la matriz** decide si es apta para el alumno.

## B. Flujo de una actividad (10 elementos)
1. **Progreso en la sesión:** barra + "X de N"; avanza al Continuar.
2. **Instrucciones:** una consigna corta; audio automático en 1.º–4.º; icono siempre con texto.
3. **Respuesta:** una interacción por tipo; una respuesta activa a la vez.
4. **Ayudas:** pistas progresivas (suave→clara), banco de palabras (pequeños), repetir audio, descartar 1
   opción. Usar ayuda no penaliza pero **se registra**.
5. **Comprobación:** validación EN SERVIDOR contra answer_keys (la solución nunca llega al cliente);
   tolerante en texto (tildes/mayúsculas/sinónimos).
6. **Feedback:** acierto = jade + check + micro-celebración + XP (breve); error = marca suave (no rojo agresivo).
7. **Segundo intento:** reintento por defecto (hasta N); se guarda en qué intento acertó y si usó pista.
8. **Explicación:** al fallar (opcional al acertar) explica el porqué; tras N intentos, muestra la solución.
9. **Envío a repaso:** cada fallo entra en la cola de errores → reaparece pronto hasta acertarlo; si el
   objetivo estaba "dominado", baja a "necesita repaso".
10. **Progreso/dominio:** cada intento emite evento → modelo de dominio (producir > reconocer; acierto
    espaciado 1·3·7·16 lleva a "Dominado").

## C. Los 10 tipos (cursos · nivel · máx texto · nº opciones · duración · ayuda · feedback · móvil · accesibilidad · anti fácil/difícil)

**1. Imagen y palabra (P1/P3)** — 1.º–6.º (estrella 1.º–4.º) · Pre-A1–A2 · 1–3 palabras/opción · 3 (1.º–2.º)→4 ·
15–30 s · audio de palabra, descartar 1 · la correcta se ilumina (jade)+palabra · rejilla 2×2 grande ·
alt en imágenes, teclado, no solo color · distractores de la misma categoría, una sola correcta.

**2. Respuesta múltiple (P2)** — 4.º–ESO · A1–B1 · frases cortas · 4–5 con 2–3 correctas · 30–45 s ·
"hay N correctas" · correcto solo si todas las correctas y ninguna incorrecta · checkboxes grandes ·
rol checkbox, teclado · uso ligero (confunde a pequeños); distractores no triviales.

**3. Listening (P1+audio)** — 1.º–ESO · Pre-A1–B1 · mínimo · 3–4 · 20–40 s (clip ≤6 s re-escuchable) ·
repetir ilimitado, versión lenta · como P1 · botón audio grande + opciones con imagen · transcripción,
control de audio visible · audio claro y corto; subir dificultad con distractores fonéticos cercanos.

**4. Drag and drop (P3/P4/P5)** — 2.º–ESO · Pre-A1–B1 · fichas 1–3 palabras · 3–6 elementos · 30–60 s ·
resaltar destino válido · encaje correcto se fija, mal vuelve · **alternativa: tocar-elemento-luego-destino**
(no depender de arrastrar) · alternativa por toque/teclado, foco visible · nº elementos por la matriz.

**5. Ordenar frases (P5)** — 3.º–ESO · A1–B1 · 3–7 fichas · ≤5 (5.º–6.º)/≤7 (ESO) · 30–60 s · primera ficha
dada, audio · valida orden, acepta órdenes válidos alternativos · tocar para colocar/quitar · teclado, foco ·
longitud por banda, frases con sentido, evitar ambigüedad.

**6. Completar (P6)** — 3.º–ESO · A1–B1 · 1 frase con 1 hueco → cloze varios huecos (ESO) · banco de palabras
en Primaria / texto libre en ESO · 30–60 s · banco, primera letra, audio · validación tolerante · banco
tocable, input que no tape · label del campo · un hueco para pequeños, cloze para mayores; sin ambigüedad.

**7. Reading (P7)** — 4.º–ESO · A1–B1 · 2–4 frases → párrafo corto (ESO) · 2–4 subpreguntas · 60–120 s ·
releer, palabra clave · % de subpreguntas correctas · estímulo scrollable + preguntas · `lang="en"`,
contraste, tipografía legible · preguntas no deducibles sin leer; nada de muros de texto en 3.º–4.º.

**8. Writing (P8 · Fase 2)** — 5.º–ESO · A1–B1 · 1 frase → 2–4 frases (ESO) · n/a · 2–4 min · modelo de
referencia, palabras sugeridas · **no automático con nota** (autoevaluación guiada o revisión de profe; nunca
IA corrige a un menor sin supervisión) · textarea grande, guardar borrador · label, sin tiempo agresivo ·
consigna acotada + rúbrica sencilla; Fase 2.

**9. Pronunciation (P9 interino)** — 2.º–ESO · Pre-A1–B1 · 1 frase corta · n/a · 20–40 s · escuchar el modelo ·
**motivador, sin evaluar** en el MVP ("escucha y repite", auto-marca hecho, sin grabar) · botón escuchar +
"hecho" · no depende del micro, transcripción · frases cortas y útiles, sin juicio.

**10. Speaking (P9 · Fase 3)** — 4.º–ESO · A1–B1 · consigna breve · n/a · 30–60 s · modelo de audio, frase
guía · grabación/evaluación **con consentimiento específico**, audio temporal, no se almacena por defecto ·
botón de micro grande, permiso explícito · **alternativa sin micro** (marcar practicado), privacidad de voz
de menores · Fase 3; solo con consentimiento; nunca expone al niño.

## D. Alcance MVP
Tipos 1–7 en el MVP (Reading y Múltiple más ligeros en Primaria). 8 Writing → Fase 2. 9 Pronunciation →
interino en MVP. 10 Speaking → Fase 3 (voz de menores). Todos comparten la estructura base y el flujo de 10 pasos.
