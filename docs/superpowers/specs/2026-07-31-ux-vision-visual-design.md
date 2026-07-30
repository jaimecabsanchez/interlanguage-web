# Visión de UX y dirección visual · Plataforma Interlanguage

**Fecha:** 2026-07-31 · **Estado:** aprobado.
Base (documentos maestros equivalentes, aprobados): `2026-07-29-experiencia-alumno-ux.md`,
`2026-07-29-arquitectura-pedagogica.md`, `2026-07-29-sistema-motivacion-personaje.md`,
`2026-07-29-catalogo-actividades-motor.md`, `2026-07-29-rendimiento-accesibilidad-movil.md`, y
lo ya construido (`plataforma/etapa.js`, motor, marca, personaje Nemo).
Alcance de este doc: **decisiones concretas** de UX/visual, adaptación por etapa (4 bandas), matriz de
adecuación y navegación. No diseña todas las pantallas.

> ⚠️ Coherencia: la navegación construida hoy (Camino · **Liga** · **Tienda** · Perfil) **contradice** lo
> aprobado. "Liga" = ranking (viola "sin competición"); "Tienda" no debe ser pestaña principal. Se corrige aquí.

## 1. Dirección visual
Sistema único "cálido-geométrico", no infantiloide, que escala hasta ESO.
- **Color:** navy `#16294A` (texto/estructura) · **acción única = coral `#FF6B4A`** · acierto jade `#1E9C74` ·
  error = marca suave (nunca rojo agresivo) · fondo crema `#FBF8F1`. Sin degradados chillones.
- **Tipografía:** Plus Jakarta Sans (titulares) + Inter (texto); tamaños escalan por etapa.
- **Forma:** radios 22px (Primaria baja) → 14px (ESO); sombras suaves.
- **Personaje:** Nemo (zorro geométrico), no peluche; muy presente en 1.º–2.º, casi decorativo en ESO.
- **Contenido visual:** emoji/ilustración plana en el MVP; ilustración propia de Nemo por hitos. Icono **siempre con texto**.
- **Movimiento:** micro-animaciones discretas; respeta `prefers-reduced-motion`.

## 2. Principios UX
1. Una pantalla = una decisión; el Inicio responde "¿qué hago hoy?" en 1 s.
2. Nunca un examen; sin nota sobre 10.
3. Anti-frustración: el error explica y deja reintentar; marca suave, nunca "suspenso".
4. Audio primero en 1.º–4.º (consigna y palabras con voz, botón visible).
5. Meta semanal, no obligación diaria; racha flexible con comodín.
6. Motivación contra uno mismo; cero rankings ni comparación entre alumnos.
7. Móvil primero; objetivos táctiles grandes.

## 3. Adaptación por etapa (4 bandas)
Decisión: ampliar `data-stage` de 3 a **4 bandas** (`p12 · p34 · p56 · eso`); mismo sistema, tokens por banda.

| | 1.º–2.º (6–7) | 3.º–4.º (8–9) | 5.º–6.º (10–11) | ESO (12–16) |
|---|---|---|---|---|
| CEFR | Pre-A1 | A1 | A1–A2 | A2–B1 |
| Lectura | Casi nula | Emergente | Fluida | Normal |
| Audio | Protagonista (auto) | Apoyo fuerte | Opcional | Bajo demanda |
| Sesión | 5–8 min | 8–10 min | 10–12 min | 12–15 min |
| Botones/tipografía | Enormes | Grandes | Normales | Sobrios |
| Texto en pantalla | Mínimo | Sencillo | Normal | Denso permitido |
| Navegación | Inicio manda | 4 pestañas, Inicio destacado | 4 pestañas | 4 pestañas sobrias, Progreso pesa |
| Nemo | Muy presente | Presente | Discreto | Casi icono |
| Motivación | Recompensa simple | Racha + medallas | Racha + metas + medallas | Nivel + metas de examen |

## 4. Matriz de adecuación edad–curso–nivel–ejercicio (la "puerta")
Cada ejercicio lleva metadatos (modelo de datos: `cefr`, `edad[min,max]`, `habilidad`, `dificultad 1–5`,
`objetivo`, `prerequisites`, `plantilla`). Un ejercicio **solo se sirve** si pasa TODAS las puertas:

| Banda | CEFR | Plantillas permitidas | Máx. opciones | Entrada (autonomía) | Audio | Lectura | Carga cognitiva máx. |
|---|---|---|---|---|---|---|---|
| 1.º–2.º | Pre-A1 | P1, P3 | 3 | Tocar | Obligatorio | No | 1 concepto, ≤3 elementos |
| 3.º–4.º | Pre-A1–A1 | P1, P3, P5 | 4 | Tocar / tocar-ordenar | Fuerte | Palabra/frase corta | 1 concepto, ≤4 |
| 5.º–6.º | A1–A2 | P1–P6 (huecos con banco) | 4 | Tocar / escribir con ayuda | Opcional | Frase | 1–2 conceptos, ≤5 |
| ESO | A2–B1 | P1–P7 | 5 | Escribir libre / ordenar | Bajo demanda | Texto | 2 conceptos, ≤7 |

**Reglas (todas):** `plantilla ∈ permitidas(banda)` · `cefr ∈ rango(banda)` · `edad ∈ [min,max]` ·
`prerequisites` ≥ practicando · `dificultad` dentro del nivel real · nº elementos ≤ carga máx.
La usan el **CMS** (validar al publicar) y el **motor de recomendación** (al servir). Ata edad, curso,
nivel real, habilidad, dificultad, conocimientos previos, autonomía digital y carga cognitiva en un filtro.

## 5. Navegación principal (4 pestañas aprobadas + corrección)
| Pestaña | Contiene |
|---|---|
| 🏠 Inicio | "¿Qué hago hoy?" — misión del día + racha + repaso/continuar |
| 🎯 Practicar | Práctica por unidad + repaso de lo que falla (libre = secundaria) |
| 📈 Progreso | Racha, "lo que ya sé decir", habilidades y medallas/colección |
| 👤 Perfil | Avatar/personalización, **cosméticos (ex-Tienda)**, ajustes, cerrar sesión |

Acciones: **eliminar "Liga"** (ranking, prohibido) · **mover "Tienda" dentro de Perfil** · en 1.º–2.º las
pestañas 2–4 quedan secundarias (Inicio domina).

## 6. Componentes visuales comunes (design system)
Biblioteca compartida, variada por token de banda: Tarjeta-misión · Tarjeta-ejercicio (plantillas P1–P7) ·
Barra de progreso · Chips de estado (🔥/💎) · Medalla (chip) · Banner de feedback (icono+texto, no solo color) ·
Botón primario (coral)/fantasma · Skeleton · Banner sin conexión · Tarjetas de estado (vacío/error/hecho) ·
Barra de navegación · Poses de Nemo. Consolida lo que ya existe en `motor.css`, `etapa.css`, `app.css`.

## 7. Elementos que evitar
Rankings/clasificaciones · comparación entre alumnos · rojo agresivo/"suspenso" · temporizadores con presión ·
biblioteca infinita/scroll sin fin · cofres/azar · compras con dinero real · autoplay de audio sin control ·
objetivos táctiles pequeños · muros de texto en 1.º–4.º · más opciones de las que marca la matriz ·
icono sin etiqueta · notificaciones culpabilizadoras.

## 8. Prioridades para el MVP
1. Corregir la navegación a las 4 pestañas (quitar Liga, Tienda dentro de Perfil). *(Alto impacto, bajo esfuerzo.)*
2. Ampliar `data-stage` a 4 bandas y aplicar tokens (§3).
3. Puerta de la matriz (§4) en el motor de recomendación + validación del CMS.
4. Pestañas Progreso y Practicar reales.
5. Consolidar el design system (§6).
- Diferir: práctica libre avanzada, ESO completo, ilustración propia de Nemo por hito, diagnóstico jugado (opcional 9+).

---

### Próximo paso
Alimenta la implementación de la experiencia del alumno (B8) y del CMS/recomendación (B6/B9). Las prioridades
§8 se anotan en el plan de bloques.
