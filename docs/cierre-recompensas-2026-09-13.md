# Cierre de sesión y recompensas · implementación

## Experiencia

Una superficie, no un mosaico de tarjetas. 5–7: celebración → evidencia concreta → recompensa. 8–9: celebración/evidencia → recompensa. 10–11, ESO y edad desconocida: resumen único; ESO utiliza inglés y presentación más compacta. El vocabulario mostrado procede de los resultados reales, no de ejemplos inventados. Las cifras de habilidad significan ejercicios practicados, no incrementos ficticios de mastery. El tiempo procede de los intentos, excluye fallos técnicos y limita cada intento a cinco minutos para no contar una pestaña olvidada.

El final permite terminar o visitar el mundo. No fuerza otra sesión. Los extras explican que no completan la misión diaria. No se muestran aciertos evaluados para actividades de autoevaluación oral/escrita. Un error al cargar el siguiente ejercicio ya no puede cerrar y recompensar una misión incompleta.

## Economía inicial

| Acción | Recompensa |
|---|---|
| Misión diaria con evidencia suficiente | 10 Alas, una vez por fecha |
| Primera práctica extra útil del día | 3 Alas |
| Segunda práctica extra útil | 1 Ala |
| Siguientes extras o repetir objetivos fáciles | Sin Alas; el aprendizaje se sigue registrando |
| Misiones válidas 3, 6 y 9 | Cofre cosmético de contenido visible |
| Cinco misiones en una semana natural (lunes–domingo) | Cofre semanal, mientras queden objetos de la colección inicial |
| Logro con objeto asociado | Objeto compatible con la edad |
| 10 objetivos distintos reconocidos en listening | Objeto del mundo vinculado al hito |
| 5 objetivos vencidos recuperados | Objeto del mundo por repasar |
| 3 objetivos con mastery real y acierto registrado | Desbloqueo de crecimiento del mundo |

Máximo 14 Alas por día: los extras nunca consumen las 10 reservadas a la misión. No hace falta una sesión perfecta. No hay premios al azar, cofres de pago, raridades probabilísticas, compra de respuestas, mastery, progreso o rachas. No se pierde lo conseguido al descansar.

Catálogo de canje inicial: Atardecer 20, Noche 60, Estanque 50, Bicicleta 70, Mural de viajes 30 y Escritorio tecnológico 70. Solo aparecen los compatibles con la edad. Esta primera tienda ofrece fondos y objetos, usando los recursos existentes; no altera el avatar maestro. La arquitectura admite otros cosméticos del catálogo. No se han creado prendas o accesorios visuales nuevos.

Los cofres conceden automáticamente su contenido conocido al alcanzar el hito; no hay una tirada ni un segundo sorteo al abrirlos. Si un objeto ya pertenece a la colección económica, el siguiente contenido se elige de forma determinista entre los restantes y la previsualización se actualiza. El catálogo es finito: no se prometen cofres vacíos cuando se agota. Los desbloqueos educativos anteriores se conservan, sin volver a cobrarlos. Por compatibilidad, un objeto ya abierto por las reglas antiguas puede añadirse también como recuerdo de un cofre, sin cobrar ni añadir una segunda copia al mundo.

## Fuente de verdad y persistencia

1. El motor emite intentos educativos inmutables y actualiza mastery.
2. Se cierra la sesión educativa. La misión se completa únicamente en la rama diaria.
3. Se guarda un recibo educativo local con los IDs previstos, eventos, modo, fecha, vencimientos al empezar y mastery al cerrar.
4. `motor/rewards.js` reconstruye premios e inventario. Las compras se intercalan cronológicamente; el saldo deriva de premios menos compras válidas.

Los recibos no contienen un saldo editable utilizado para aprender. La proyección no modifica eventos, mastery ni misión. El recibo conserva evidencia aunque la caché general de intentos alcance su límite. La clave de sesión y los IDs de intentos evitan duplicar recompensas al recargar; las fechas impiden dos premios diarios. Bonus, examen y las dos formas de repaso tienen claves diferenciadas. La práctica por skill mantiene su contrato de URL.

Para recompensar se exige sesión terminada, intentos de todos los ejercicios previstos y evidencia objetiva no técnica en al menos el 60 % (mínimo dos, salvo sesión de un ejercicio). Una sesión exclusivamente autoevaluada no concede moneda: no se inventa evaluación de voz o escritura. Los extras requieren dos objetivos nuevos en el historial de recibos o realmente vencidos al empezar; ningún objetivo se remunera dos veces el mismo día. No hay moneda retroactiva por simplemente abrir una misión antigua.

**Límite explícito:** la economía base es local por alumno y navegador (`il_rewards_v1_<usuario>`). No hay todavía sincronización de recibos/compras entre dispositivos ni validación antifraude en servidor. Borrar los datos del navegador pierde esta colección; modificar manualmente el almacenamiento puede alterarla. El anti-grind cubre el uso normal, no clientes manipulados. La interfaz declara el guardado local. Los campos legacy `gems` del backend no se convierten ni se usan en esta economía.

Una escritura fallida no se anuncia como premio guardado; el cierre ofrece reintentar sin volver a completar la misión. Los datos corruptos no se sustituyen silenciosamente por cero. Los canjes requieren confirmación, saldo y un ID cosmético permitido. Cancelar no carga nada. La moneda nunca modifica resultados educativos.

## Mundo

`world-data.context` acepta propiedad cosmética como entrada adicional y conserva los desbloqueos antiguos. Tienda y Perfil reconocen los objetos ganados/comprados. El alumno puede aplicarlos desde la colección. No se añaden indiscriminadamente objetos a la configuración: se mantiene la selección del mundo y su límite de ocho; los elementos que ya estaban seleccionados se hacen visibles cuando se desbloquean.

## Verificación

- Suite completa: 49 archivos `.test.js`, todos pasan.
- Nuevas pruebas: proyección pura, persistencia por alumno y modelo de cierre por edad.
- Casos: diario único, recarga, duplicados de intento/sesión, sesión incompleta, eventos ajenos, fallos técnicos, autoevaluación, errores válidos, topes, rendimientos decrecientes, repetición fácil, repaso vencido, cuatro edades, fallback neutro, cofres, hitos, canje inválido, saldo insuficiente, compras cronológicas, fallo/corrupción de almacenamiento y no mutación educativa.
- `scripts/qa-rewards.cjs`: cuatro recorridos de edad con callbacks educativos controlados; interfaz real de cierre y colección; teclado; mínimos táctiles; misión diaria intacta tras skill; recarga; cancelación y confirmación de compra; aplicación y persistencia del fondo.
- Cierre comprobado en 1440×900, 1280×800, 1024×768, 820×1180, 768×1024, 390×844 y 320×740. Colección en escritorio, tableta y móvil. Se espera a que el navegador aplique la media query tras cada cambio de viewport para no confundir un frame transitorio con overflow persistente.
- `scripts/qa-mechanics.cjs`: interacción real con las 16 mecánicas, cuatro edades y siete viewports; sin errores de página.
- Foco dirigido al título de cada momento, botones nativos, fondo inerte, diálogo de compra nativo, foco restaurado al cancelar y movimiento reducido respetado.

No se ha hecho despliegue ni cambios en `web-publica/`.

## Archivos

- Economía: `plataforma/motor/rewards.js`, `plataforma/reward-store.js` y sus dos tests.
- Cierre: `plataforma/session-ending.js`, `.css`, `.test.js`, `plataforma/leccion.html` y `skill-practice-contract.test.js`.
- Colección: `plataforma/reward-collection.js`, `.css`, `world-data.js`, `world-data.test.js`, `world-page.js`, `tienda.html`.
- Perfil: `plataforma/perfil.js`, `perfil.html`.
- QA: `scripts/qa-rewards.cjs`.
- Este documento. Referencias de caché actualizadas en las páginas afectadas.
