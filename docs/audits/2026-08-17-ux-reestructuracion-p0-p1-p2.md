# Auditoría UX/UI — Interlanguage HOME

Fecha: 2026-08-17. Línea base: todos los tests existentes pasan (14 archivos; 88 checks
visuales del motor). `README-REVIEW.md` no existe en el repositorio.

## P0 — bloquea la experiencia solicitada

- `etapa.js` define cuatro `BAND_EXPERIENCE`, pero `PROFILES` solo contiene tres modos.
  Home decide copy, ilustración, recomendación y nivel mediante `experience.id`, por lo que
  p12 y p34 continúan compartiendo comportamiento visible.
- `design-system.css` solo cambia `--il-scale` y `--il-radius` por banda. No existe el
  contrato `--stage-*`; tamaños y densidad se repiten en pantallas y hojas posteriores.
- `inicio.html` contiene un bloque CSS extenso y recibe más overrides desde `age-mode.css`.
  Hay reglas que deben ganar explícitamente a otras reglas (`route-node`), señal directa de
  fuentes de estilo contradictorias.
- Home conserva una misión sólida, pero la información secundaria y el copy se seleccionan
  por tres modos; no garantiza el inventario exacto requerido para cada banda.
- `test-nivel.html` usa ocho preguntas idénticas para todas las edades. Solo cambia tamaño
  visual. No hay bancos por etapa, audio/imagen para p12 ni parada adaptativa para ESO.
- La lógica y el CSS del test están embebidos en el HTML, lo que dificulta probar selección,
  puntuación y adaptación de forma aislada.

## P1 — jerarquía y composición por edad

- `progreso.js` bifurca por `primary-young`/`secondary`; p12 y p34 reciben prácticamente la
  misma jerarquía y se oculta gran parte del DOM mediante `age-mode.css`.
- Perfil aplica el mismo patrón de tres modos. Falta separar claramente nivel visible,
  CEFR interno y progreso del mundo.
- Onboarding ya es breve, pero comparte estructura y necesita copy/énfasis específico por
  banda, además de extraer su CSS inline.
- Ajustes está correctamente subordinado a Perfil y no requiere cambios funcionales P0.

## P2 — pulido transversal

- `inicio.html`, `leccion.html`, `onboarding.html` y `test-nivel.html` mantienen bloques
  `<style>`; Inicio y test son las extracciones prioritarias.
- Persisten gradientes, sombras y pills con demasiada frecuencia en Home, especialmente
  para ESO.
- Deben verificarse foco, anuncios dinámicos, movimiento reducido y scroll de actividad en
  390×844, 768×1024, 820×1180 y 1440×900.
- Los targets táctiles ya aparecen parcialmente codificados, pero no derivan de una única
  variable de etapa.

## Riesgo de integración

El árbol contiene cambios locales previos en archivos P0 (`design-system.css`,
`inicio.html`, `layout.js`, `shell.css`, `test-nivel.html` y consumidores). Se preservarán
mediante parches pequeños; ningún archivo se restaurará desde `HEAD`. La sincronización con
`git pull --rebase` no es segura mientras el árbol siga sucio.

## Orden de corrección

1. contrato `--stage-*` y configuración declarativa de banda;
2. extracción y composición de Home por banda;
3. motor probado y presentación del placement por banda;
4. verificación funcional, visual y de accesibilidad;
5. P1 y P2 solo después de cerrar P0.
