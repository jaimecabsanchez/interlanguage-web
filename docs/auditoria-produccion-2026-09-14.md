# Auditoría de producción · Interlanguage HOME

## Veredicto

No lista todavía para entregar a familias reales. La web responde y las pruebas locales pasan, pero la persistencia real y el aislamiento entre cuentas siguen sin validarse. Supabase se ha reactivado; la pausa ya no es el bloqueo. Las correcciones de esta auditoría están en el repositorio local, pendientes de publicación.

## Evidencia y alcance

- 50 archivos `*.test.js`: pasan. Sintaxis de todos los JS/CJS de plataforma y scripts: pasa.
- Recorrido final local: 12 rutas × p12/p34/p56/eso = 48 combinaciones, a 1440×900, 1024×768, 768×1024 y 390×844 (192 vistas). Login, onboarding, placement, inicio, practicar, lección, progreso, perfil, mundo, avatar, ajustes y familias.
- En esos estados: cero excepciones de página, errores HTTP, desbordamientos horizontales, controles sin nombre, cargas persistentes o infracciones detectadas por axe (WCAG A/AA 2.0/2.1, ejecutado en móvil). No equivale a certificación de accesibilidad ni a probar todas las interacciones con lector de pantalla.
- Recorrido publicado previo: mismas 48 combinaciones en contextos demo aislados. No se utilizaron cuentas de alumnos reales.
- `qa-production-failures.cjs`: pasa. Fallo de red en login, SDK ausente, recuperación del botón, onboarding adelante/atrás, persistencia de ajustes de audio, familias sin datos y contenido no disponible, en las cuatro edades.
- `qa-mechanics.cjs` y `qa-rewards.cjs`: pasaron en esta auditoría antes de los últimos cambios exclusivamente de contraste/semántica. Cubren 16 mecánicas, cierre por edad, recompensas, repetición de cierre, práctica por habilidad sin alterar misión y cosméticos. Sus comprobaciones responsive incluyen siete tamaños. No sustituyen una sesión con micrófono en un iPad real.
- `permisos-auth.sh`: OMITIDO (salida 77), faltan credenciales de una cuenta de pruebas autorizada. No se presenta como aprobado.
- Netlify devuelve 200. Supabase devuelve 200 y cero filas en consultas anónimas de ocho tablas. Esto solo acredita ausencia de exposición en esas consultas; no demuestra por sí mismo que RLS esté bien configurado.
- `student_placements` y `exercise_mastery`: 404/PGRST205. Ambas están referenciadas por el cliente y definidas en `supabase/migrations/0007_learning_truth_phase0.sql`. No son tablas obsoletas. Hay que comprobar el esquema y aplicar la migración pendiente con acceso administrativo.

## Correcciones realizadas

- Los fallos al leer/guardar perfil, estado o racha ya no se ignoran como si fueran datos vacíos o guardados correctos.
- Login recupera el botón y comunica errores de red/SDK; una configuración ausente en producción no activa silenciosamente datos demo.
- Mi semana contabiliza sesiones diarias completadas; una práctica extra no completa la misión.
- Métricas excluyen fallos técnicos y resultados no evaluables de la precisión. El tiempo semanal usa duración activa de intentos de la semana, no la duración de una pestaña abierta durante dos semanas.
- La cola de sincronización conserva nuevos eventos añadidos mientras se envían los anteriores y no descarta silenciosamente eventos pendientes al alcanzar 500.
- Reintento del cierre local pendiente y protección contra una misión del mismo día ya persistida. No resuelve las escrituras concurrentes o parcialmente confirmadas en el servidor.
- Contrastes en placement, inicio, progreso y familias; semántica de días de actividad; colección de logros accesible por teclado; tamaños táctiles en mundo/familias.
- Cabeceras básicas de seguridad en configuración Netlify de plataforma; todavía no desplegadas. No es una CSP completa de scripts.
- Eliminadas credenciales predeterminadas del script de permisos. Las pruebas que escriben requieren activación explícita.
- Versiones de recursos actualizadas en las páginas afectadas.

## Pendientes P0/P1/P2

### P0 · Bloquean entrega real

1. **Esquema de aprendizaje no disponible.** Restaurar/exponer correctamente las tablas y columnas de la migración 0007, tras verificar prerrequisitos y copia de seguridad. Responsable: administrador de Supabase. Criterio: guardar y recuperar placement, intentos, sesiones y mastery desde una cuenta de prueba; recargar y comprobar desde otro dispositivo.
2. **Acceso y permisos reales sin verificar.** Preparar cuentas de prueba de alumno y personal, validar acceso, cierre de sesión, aislamiento entre alumnos y prohibición de consultar soluciones/elevar permisos. No usar alumnos reales para ensayos destructivos. Responsable: administrador + QA.

### P1 · Antes de abrir a familias

1. **Cierre no atómico.** Estado y racha se escriben por separado. Un fallo parcial o dos pestañas concurrentes pueden producir inconsistencias. Hace falta operación transaccional e idempotente en servidor y regresión de concurrencia.
2. **Confianza de datos del profesor.** El cliente envía resultados y proyecciones de mastery; revisar la validación del servidor y las políticas efectivas con roles reales antes de considerar esos datos resistentes a manipulación.
3. **Persistencia entre dispositivos.** Recompensas, personalización y estados locales requieren comprobación explícita de recuperación/sincronización. Las pruebas demo no certifican este comportamiento.
4. **Publicación pendiente.** Desplegar los cambios revisados y repetir el recorrido crítico sobre Netlify con configuración real; las pruebas locales no certifican la versión publicada.
5. **Credencial histórica de pruebas.** Revocar o rotar la credencial que figuraba en versiones previas del script de permisos. Ya no está incorporada en la versión local; permanece potencialmente en el historial.
6. **Inicio p12 aún conserva elementos rechazados.** La captura final muestra avatar en saludo y sello «Explorador matinal» con contador sin explicación. Es una discrepancia con los requisitos anteriores del usuario; requiere corrección del contenido visible antes de afirmar que el diseño aprobado está entregado.
7. **Audio y uso real.** Verificar reproducción, permisos de micrófono y recuperación en Safari/iPad; realizar una sesión piloto con niño y familia para comprobar comprensión, autonomía y motivación.

### P2 · Calidad y optimización

1. Progreso ESO mezcla encabezados ingleses con explicación española y presenta una alta densidad de estadísticas; revisar coherencia del copy y jerarquía. Algunas estimaciones de tiempo de Practicar no coinciden con los objetivos por edad.
2. Todas las páginas de contenido cargan los cinco packs; aproximadamente 264 KB conjuntos. Optimizar carga por necesidad cuando se mida su impacto real.
3. Inventario: 73 PNG (~20 MB) y 27 WebP (~1 MB). Los PNG grandes son mayoritariamente originales, no solicitudes observadas de las rutas habituales. No atribuir todo ese peso a cada visita. El avatar activo analizado usa WebP (~107 KB).
4. Muestra local de recursos por ruta p12: login ~201 KiB; onboarding ~459; placement ~379; inicio ~800; practicar ~604; lección ~872; progreso ~591; perfil ~571; mundo/avatar ~540; ajustes ~283; familias ~249. Son cuerpos de recursos observados, no una medición de descarga móvil fría completa.
5. CLS local de lección observado alrededor de 0,11. Medir carga fría con red móvil, reserva de espacio, fuentes y audio antes de declarar rendimiento óptimo. LCP local no equivale a datos de usuarios reales.
6. Completar revisión manual de foco, zoom y lector de pantalla. La comprobación de Tab inicial y axe no garantiza accesibilidad de cada estado dinámico.

## Reproducción

Servir la raíz con `python3 -m http.server 8765`. Usar Node y Playwright ya disponibles en el entorno, sin instalar dependencias nuevas.

```sh
IL_QA_URL=http://localhost:8765 IL_AUDIT_AXE=1 IL_AUDIT_DIR=/tmp/il-audit-verified node scripts/audit-production.cjs
IL_QA_URL=http://localhost:8765 node scripts/qa-production-failures.cjs
node scripts/audit-deployment.cjs
bash supabase/tests/permisos-auth.sh
```

Los informes de ejecución quedan en `/tmp/il-audit-verified/routes.json` y `/tmp/il-production-audit/network.json`. El último comando necesita `IL_STU_EMAIL` y `IL_STU_PASS` configurados localmente, sin compartir secretos en el chat. No se han aplicado migraciones, modificado cuentas reales ni desplegado cambios durante esta auditoría.
