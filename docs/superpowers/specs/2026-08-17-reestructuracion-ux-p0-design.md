# Interlanguage HOME — reestructuración UX/UI P0

- **Fecha:** 2026-08-17
- **Estado:** diseño aprobado; pendiente de revisión del documento por el owner
- **Ámbito:** arquitectura de experiencia por edades, Home y test de nivel
- **Estrategia:** refactor incremental sobre HTML, CSS y JavaScript existentes

## 1. Objetivo y límites

P0 establece una arquitectura compartida que produzca cuatro experiencias realmente
diferenciadas (`p12`, `p34`, `p56`, `eso`) sin crear cuatro aplicaciones ni modificar los
contratos funcionales. La interfaz debe concentrar la atención, reducir ruido visual y
adaptar densidad, lenguaje, interacción y ayuda a la edad.

P0 no modifica autenticación, almacenamiento, contratos de Supabase, estado de misión,
mastery, recompensas ni contenido pedagógico salvo la selección estrictamente necesaria
para el test de nivel. Tampoco añade frameworks, dependencias ni proceso de build.

Los cambios locales existentes en el árbol se consideran trabajo válido y deberán
integrarse, no sustituirse. `README-REVIEW.md`, solicitado como referencia, no existe en el
repositorio al redactar esta especificación.

## 2. Decisión arquitectónica

Se adopta un refactor incremental por capas:

1. `design-system.css` continúa como fuente canónica de tokens globales y de experiencia.
2. `etapa.js` continúa resolviendo la banda y expone configuración conductual compartida.
3. `data-stage` es el selector público para las cuatro experiencias; `data-age-mode` puede
   mantenerse temporalmente como compatibilidad, pero no decide diferencias entre p12 y
   p34.
4. `layout.js` y `shell.css` siguen siendo la única fuente del rail y la navegación móvil.
5. Home y test reciben hojas de estilo propias para reducir CSS inline sin una migración
   masiva.
6. Los datos y componentes se comparten; la jerarquía y el contenido visible pueden variar
   por banda cuando ocultar una composición única resulte más complejo.

Esta especificación prevalece, para este trabajo, sobre la decisión anterior de conservar
solo tres pieles visuales: p12 y p34 comparten infraestructura, pero deben producir dos
experiencias visuales y conductuales distinguibles.

## 3. Tokens de experiencia

Cada banda define al menos:

- `--stage-touch`
- `--stage-radius`
- `--stage-font-scale`
- `--stage-card-padding`
- `--stage-option-count`
- `--stage-decoration-level`
- `--stage-illustration-size`
- `--stage-celebration-level`

Los valores iniciales responden a estos contratos:

| Banda | Táctil mín. | Opciones máx. | Densidad | Ilustración | Celebración |
|---|---:|---:|---|---|---|
| p12 | 56 px | 3 | muy baja | grande y pedagógica | frecuente y breve |
| p34 | 52 px | 4 | baja | media | visible y moderada |
| p56 | 48 px | 4 | media | puntual | contenida |
| eso | 44 px | según actividad | alta | solo funcional | sobria |

Los tokens de etapa derivan de tokens `--il-*`; no se introducen colores hexadecimales en
componentes si ya existe un token semántico. Las reglas específicas consumen variables en
vez de repetir medidas. Los breakpoints permanecen centralmente documentados aunque CSS
requiera valores literales en `@media`.

## 4. Configuración conductual

`etapa.js` ofrece una configuración por banda consumible por las pantallas, con:

- tamaño táctil y número máximo de opciones;
- idioma principal de interfaz;
- intensidad de guía, audio, decoración y celebración;
- densidad de Home;
- configuración del test: banco, longitud mínima/máxima y adaptación.

La configuración será declarativa. Las pantallas no volverán a inferir la edad ni copiarán
tablas de reglas. La API existente de `IL_ETAPA` se mantiene compatible.

## 5. Home

### Jerarquía compartida

La misión diaria ocupa aproximadamente el 70 % de la atención inicial y contiene una sola
acción primaria. La estructura común es:

1. saludo breve;
2. misión diaria;
3. ruta de la misión;
4. CTA único;
5. información secundaria limitada por banda.

El avión de papel representa avance en la ruta. Nemo solo aparece de forma contextual y no
compite con ilustración, confeti u otros personajes. Cada icono debe comunicar una función.
Coral se reserva principalmente para el CTA; tarjetas secundarias reducen sombras,
gradientes y pills.

### Composición por banda

- **p12:** saludo, misión, cuatro pasos, CTA, `Mi semana` y `Próximo premio`. Texto mínimo,
  una decisión, hasta una ilustración pedagógica protagonista. CTA `¡Empezar!` o
  `Seguir · 2/4`.
- **p34:** misión visual con mayor autonomía, semana y próximo premio; como máximo una
  recomendación pequeña. CTA `Empezar misión` o `Continuar · 3/5`.
- **p56:** composición más compacta y madura; semana, próximo logro y una recomendación
  personalizada. CTA `Continuar misión`.
- **eso:** superficie tecnológica sobria, menos color simultáneo y menos redondeado;
  `weekly goal`, `next achievement` y como máximo un `personalised review`. CTA
  `Start session`.

Los bloques secundarios se renderizan o componen según banda; no se conserva un DOM enorme
para ocultar la mayoría con CSS. Los datos siguen procediendo de las APIs actuales.

### Estados

- carga: esqueleto o estado de preparación sin salto de layout;
- vacío real: mensaje honesto, nunca datos inventados fuera de demo;
- misión nueva, en curso y completada: misma tarjeta, copy y CTA adaptados;
- error: estado recuperable con reintento y navegación intacta.

## 6. Test de nivel

El test se presenta como una secuencia de actividades, no como examen. Comparte un shell de
pregunta, progreso, opciones, avance y resultado, pero usa bancos por banda.

| Banda | Longitud | Cobertura | Forma principal |
|---|---:|---|---|
| p12 | 4–6 | Pre-A1 | audio + imagen, máximo 3 opciones |
| p34 | 6–8 | Pre-A1/A1 | visual + lectura sencilla |
| p56 | 8–10 | A1/A2 | vocabulario, listening, grammar y reading |
| eso | adaptativa | A1–B1 | mezcla madura con parada por evidencia |

Cada pregunta declara banda, nivel, habilidad, modalidad, opciones y respuesta. Los bancos
pueden residir inicialmente junto a la lógica del test si son pequeños, pero separados de
la función de renderizado y puntuación para que puedan extraerse posteriormente sin cambiar
la UI.

Para ESO, la parada anticipada solo ocurre cuando las respuestas acumuladas hacen que el
resultado no pueda variar de forma material con preguntas adicionales, respetando un
mínimo de evidencia. Para las demás bandas se usa longitud fija dentro del rango indicado.
La puntuación produce el mismo CEFR que espera `ILAuth.savePlacement`.

El resultado de p12 y p34 usa lenguaje de punto de partida y no muestra siglas CEFR. p56
puede mostrar una etiqueta comprensible junto al nivel. ESO puede mostrar CEFR y próximos
objetivos. No hay feedback de acierto durante la evaluación.

El audio prioritario de p12 usa las capacidades actuales del navegador o activos existentes
y siempre conserva una alternativa visual/textual accesible; un fallo de audio no bloquea
la respuesta.

## 7. CSS y archivos

P0 prevé:

- ampliar `design-system.css` con tokens de experiencia;
- ajustar `etapa.js` sin romper su API;
- crear `home.css` y `placement.css`;
- reducir progresivamente los bloques `<style>` de `inicio.html` y `test-nivel.html`;
- modificar esos HTML solo en la medida necesaria para composiciones limpias;
- tocar `layout.js` o `shell.css` únicamente para coherencia del shell compartido.

No se mezclan en P0 la limpieza de onboarding, Progreso o Perfil. Cada CSS o JS modificado
debe actualizar su `?v=` en todas las páginas consumidoras.

## 8. Accesibilidad, responsive y rendimiento

- objetivos táctiles según `--stage-touch`;
- foco visible, orden de tabulación y semántica de botones intactos;
- progreso con nombre accesible y valores correctos;
- contenido dinámico anunciado sin repetir toda la pantalla;
- imagen y audio con alternativa; nunca depender solo del color;
- `prefers-reduced-motion` y preferencia interna respetados;
- una actividad debe evitar scroll innecesario, pero nunca recortar contenido;
- sin imágenes decorativas pesadas ni nuevas dependencias.

La comprobación visual cubre 390×844, 768×1024, 820×1180 y 1440×900. En tablet se valida
especialmente que CTA, opciones y progreso permanezcan visibles y cómodos en táctil.

## 9. Pruebas y criterios de aceptación

Después de cada bloque ejecutable se corren todos los tests:

```bash
node plataforma/*.test.js
node plataforma/motor/*.test.js
```

Se añadirán tests para cualquier lógica nueva de selección de banco, límites de opciones,
puntuación o parada adaptativa. La verificación manual en modo demo debe cubrir las cuatro
bandas y los cuatro viewports objetivo.

P0 se acepta cuando:

1. `data-stage` genera cuatro experiencias distinguibles con una arquitectura compartida;
2. Home tiene un CTA dominante y solo la información secundaria permitida por banda;
3. el test usa bancos y longitudes diferenciados, y ESO puede detenerse con evidencia;
4. p12/p34 no exponen CEFR complejo;
5. no cambian contratos funcionales ni se pierden estados existentes;
6. no aparecen colores hex nuevos en componentes ni navegación duplicada;
7. pasan todos los tests y no hay defectos críticos en los viewports objetivo.

## 10. Riesgos y mitigaciones

- **Cambios locales solapados:** revisar el diff antes de cada edición y hacer cambios
  pequeños; nunca restaurar archivos completos desde `HEAD`.
- **Deriva entre p12 y p34:** probar ambas bandas explícitamente y basar diferencias en
  `data-stage`, no solo en `primary-young`.
- **Overrides CSS contradictorios:** mover únicamente estilos de las pantallas P0 y dejar
  reglas de compatibilidad acotadas y documentadas.
- **Test adaptativo inestable:** separar selección y puntuación en funciones puras cubiertas
  por tests.
- **Dependencia de audio:** degradación funcional a representación visual/textual.
- **Caché del navegador:** actualizar versiones y verificar con recarga fuerte o query única.

## 11. Secuencia posterior

Tras completar y validar P0:

- **P1:** composiciones por banda de Progreso y Perfil, onboarding de máximo tres pasos.
- **P2:** auditoría transversal responsive, accesibilidad, movimiento y consolidación CSS.

Cada fase tendrá su propio plan de implementación y sus propias validaciones, pero consumirá
los contratos de experiencia definidos en P0.
