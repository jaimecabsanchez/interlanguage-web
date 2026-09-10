# Plan de implementación · Onboarding y colocación adaptativa

**Fecha:** 2026-09-09  
**Spec:** `docs/superpowers/specs/2026-09-09-onboarding-placement-adaptativo-design.md`

## Reglas de ejecución

- Trabajar solo en `plataforma/`, `supabase/` y esta documentación.
- No introducir build, framework ni dependencias.
- Mantener edad y CEFR como dimensiones independientes.
- Usar solo tokens `--il-*`, iconos de `layout.js` y visuales funcionales de `il-visual.js`.
- Elevar `?v=` de cada JS/CSS modificado en todos sus consumidores.
- Conservar la experiencia de misión, racha, mastery y rewards: placement no las modifica.
- Ejecutar pruebas específicas tras cada entrega y la suite completa al terminar.
- Crear un commit pequeño por entrega y no hacer push con el árbol roto.

## Entrega 1 · Banco y motor adaptativo puro

### Archivos

- Crear `plataforma/placement-content.js`.
- Crear `plataforma/placement-engine.js`.
- Crear `plataforma/placement-content.test.js`.
- Crear `plataforma/placement-engine.test.js`.

### Trabajo

1. Definir el contrato normalizado de ítems: ID, versión, CEFR sonda, skill, interacción existente, bandas, contexto, consigna, opciones, respuesta y explicación final.
2. Crear cobertura inicial Pre-A1/A1/A2/B1 para cada banda sin usar contextos infantiles en ESO.
3. Implementar validación editorial que rechace IDs duplicados, bandas desconocidas, respuesta inválida, opciones insuficientes, recurso obligatorio ausente y combinaciones banda × CEFR sin cobertura declarada.
4. Implementar un motor UMD puro que:
   - normalice la semilla administrativa o use A1;
   - seleccione por banda y nivel candidato;
   - evite repetir skill/modalidad ante opciones equivalentes;
   - aplique exploración por pares y desempate;
   - respete mínimos/máximos por banda;
   - excluya fallos técnicos del presupuesto;
   - produzca nivel, confianza, `coverage_limited` y razón de parada.
5. Hacer determinista la selección mediante IDs/orden estable para que pueda probarse sin azar.

### Pruebas

- p12 no recibe más de tres opciones ni interacciones incompatibles.
- ESO Pre-A1 utiliza contenido adolescente.
- Una banda desconocida solo usa neutral.
- Dos respuestas favorables suben como máximo un nivel.
- Dos desfavorables bajan como máximo un nivel.
- Una respuesta dividida genera desempate.
- Un fallo técnico no cambia la estimación ni cuenta como actividad evaluable.
- No se termina antes del mínimo salvo cobertura agotada.
- La necesidad de nivel prevalece sobre variedad.

### Commit

`feat: add adaptive placement model`

## Entrega 2 · Sesión reanudable y persistencia

### Archivos

- Crear `plataforma/placement-session.js`.
- Crear `plataforma/placement-session.test.js`.
- Modificar `plataforma/auth.js` solo si el contrato actual no conserva todos los metadatos requeridos.
- Modificar `plataforma/phase0-persistence.test.js` cuando cambie el contrato verificable.
- Añadir una migración Supabase únicamente si faltan campos imprescindibles y de forma aditiva.

### Trabajo

1. Implementar borrador namespaced por usuario con instrumento, versión, banda, semilla, preguntas servidas, respuestas codificadas y estado del motor.
2. Reanudar únicamente si usuario, banda y versión coinciden.
3. Invalidar con registro observable cualquier borrador incompatible.
4. Guardar después de cada respuesta; limpiar solo tras obtener un resultado local válido.
5. Persistir mediante `ILAuth.savePlacement`; mantener caché/outbox cuando no haya red.
6. Conservar `source`, `synced`, `queued`, confianza y limitación de cobertura.
7. Garantizar que ninguna operación toca `ILMission`, racha, mastery, achievements o progreso de lecciones.

### Pruebas

- Mismo usuario/banda/versión reanuda exactamente.
- Usuario, banda o versión diferente no reutilizan el borrador.
- Resultado offline queda utilizable y pendiente de sincronización.
- Reintento remoto es idempotente.
- Placement completo evita repetir; borrador incompleto no se confunde con resultado.
- No existen escrituras en claves/funciones de misión y rewards.

### Commit

`feat: persist resumable placement sessions`

## Entrega 3 · Experiencia de calibración por edad

### Archivos

- Crear `plataforma/test-nivel.js`.
- Crear `plataforma/test-nivel.css`.
- Simplificar `plataforma/test-nivel.html` para que sea estructura accesible y carga de módulos.
- Ampliar `plataforma/copy-registry.js` y `plataforma/copy-registry.test.js`.
- Crear `plataforma/placement-ui-contract.test.js`.

### Trabajo

1. Extraer reglas y estilos inline del HTML.
2. Renderizar loading, introducción, pregunta, confirmación neutral, resultado y estados recuperables.
3. Añadir «No lo sé todavía» como acción secundaria.
4. Implementar feedback «Respuesta guardada» sin revelar corrección.
5. Reemplazar ítems con fallo técnico sin consumir presupuesto ni convertir listening en reading.
6. Mostrar progreso por pasos, nunca nota ni porcentaje infantil.
7. Adaptar jerarquía:
   - p12: imagen/audio dominante, tres opciones, 56 px;
   - p34: lectura breve, 52 px;
   - p56: chrome español e inglés contextual, 48 px;
   - ESO: compacto, maduro, 44 px;
   - neutral: conservador y observable.
8. Resultado: CEFR aproximado, descripción del comienzo, hasta dos elementos realmente vistos y estado de sincronización.
9. Usar DOM seguro (`textContent`/constructores) para datos variables y HTML editorial solo desde banco validado.
10. Gestionar foco, `aria-live`, teclado y reduced motion.

### Pruebas

- Copy y política lingüística de cinco modos.
- Una única acción principal visible por estado.
- p12 nunca muestra “error”, “nota”, “porcentaje” ni nombres académicos innecesarios.
- Resultado usa «Hoy has visto», no «Ya has aprendido».
- Sin estilos hex ni emojis de chrome.
- Scripts y CSS incluyen versiones de caché nuevas.

### Verificación visual intermedia

- 390 × 844 para p12 y p34.
- 820 × 1180 para p56.
- 1440 × 900 para ESO.
- Pregunta de audio, texto, «No lo sé», fallo técnico, reanudación y resultado.

### Commit

`feat: redesign adaptive placement experience`

## Entrega 4 · Onboarding y continuidad de primera misión

### Archivos

- Crear `plataforma/onboarding.js` y `plataforma/onboarding.css` o extraer a ellos la implementación inline existente.
- Simplificar `plataforma/onboarding.html`.
- Reutilizar/ampliar `plataforma/copy-registry.js`.
- Modificar `plataforma/index.html` o `plataforma/cambiar-clave.html` solo si la redirección actual no conserva el flujo.
- Crear `plataforma/onboarding-placement-flow.test.js`.

### Trabajo

1. Mantener tres pasos: identidad, misión breve y crecimiento académico.
2. Priorizar el avatar real del alumno; Nemo aparece como máximo una vez en Primaria y no en ESO.
3. Sustituir promesas genéricas por copy que explique el propósito de la calibración.
4. Mantener el CTA final directo al test y evitar saltar la calibración.
5. Asegurar continuidad desde cambio de contraseña y bloqueo de roles admin.
6. Verificar que Inicio consume inmediatamente el placement local/remoto mediante el contrato existente.
7. Mantener el primer mundo sin crecimiento artificial: el test no desbloquea elementos.
8. Dejar metadatos trazables para que `familias.html` consuma posteriormente nivel inicial, fecha, instrumento y confianza.

### Pruebas

- Alumno nuevo: login → contraseña → onboarding → test → resultado → Inicio.
- Alumno con placement completo: no repite test.
- Alumno con borrador: reanuda.
- Admin nunca entra en el flujo de alumno.
- El test no concede misión, racha, mastery, logro ni objeto del mundo.
- La primera misión filtra por banda y CEFR resultante.

### Commit

`feat: connect onboarding to adaptive placement`

## Entrega 5 · Hardening y verificación final

### Archivos

- Ajustar únicamente los archivos anteriores y tests de contrato afectados.
- Documentar cualquier legacy que no pueda retirarse todavía.

### Trabajo

1. Ejecutar `git diff --check` y buscar colores crudos/emojis/URLs de caché obsoletas.
2. Ejecutar todos los tests de `plataforma/**/*.test.js`.
3. Probar navegador con `?demo=1&ageMode=p12|p34|p56|eso` y neutral.
4. Verificar 320, 390, 768, 1024 y 1440 px, zoom 200 % y reduced motion.
5. Comprobar ausencia de scroll horizontal, CTA tapados, foco perdido y errores inesperados de consola.
6. Probar recarga a mitad de test, audio fallido, offline/sincronización pendiente, cobertura limitada y regreso a Inicio.
7. Revisar que los títulos de nivel y misión no se mezclen y que ESO no reciba copy infantil.
8. Confirmar árbol limpio y redactar informe final.

### Pruebas mínimas de regresión

```bash
node plataforma/smoke.test.js
node plataforma/auth-utils.test.js
node plataforma/motor/pedagogia.test.js
node plataforma/motor/motivacion.test.js
node plataforma/motor/matriz.test.js
```

Además, ejecutar todos los `*.test.js` de `plataforma/`, `plataforma/content/` y `plataforma/motor/`.

### Commit

`test: verify adaptive placement flow`

## Resultado esperado

Un alumno nuevo entiende el producto, completa una calibración breve adecuada a su edad, obtiene un punto de partida prudente y comienza una misión lingüísticamente compatible. La plataforma conserva evidencia suficiente para explicar el resultado a la familia, no premia el test como aprendizaje y puede recuperarse de cierre, red o audio sin penalizar al alumno.
