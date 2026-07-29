# Plataforma de práctica de inglés · Interlanguage Studies
### Documento de diseño (spec) — v1

**Fecha:** 2026-07-29
**Estado:** aprobado el enfoque general; pendiente de revisión del documento.

---

## Decisiones ya tomadas (base de este diseño)

| Decisión | Elección |
|---|---|
| Plazo de la primera versión | En unos meses (no semanas, no años) |
| Quién crea el contenido | **IA genera borradores + un profe de Interlanguage revisa y aprueba** |
| Público del MVP | **Primaria completa (6–11 años)** |
| Perfiles del MVP | **Alumno + Admin (Interlanguage) + Vista de familias.** Profesores → Fase 2 |
| Enfoque técnico | Ligero: web + Supabase + Netlify (no framework "de gran empresa") |

---

## 1. Resumen ejecutivo

Interlanguage quiere una plataforma propia para que sus alumnos de extraescolares practiquen inglés en casa casi a diario, incluida en un plan Premium. El alumno entra con usuario y contraseña (temporal el primer día), hace una **sesión corta diaria** adaptada a su nivel, y su familia ve un **resumen de progreso** que justifica el pago.

El proyecto es, en su versión completa, un producto grande (un "Duolingo" propio). La estrategia acordada es **no construirlo entero de golpe**: se lanza un **MVP centrado en Primaria** con lo esencial, y se amplía por fases. El mayor reto no es el código, sino **crear contenido de calidad de forma sostenida** y **cumplir privacidad de menores (RGPD)**.

Ya existe una base funcional (demo de acceso + progreso en modo prueba, desplegada en Netlify) que sirve de punto de partida.

## 2. Propuesta de valor

- **Para el alumno:** sabe cada día qué hacer, en pocos minutos, con feedback claro y sensación de avance, sin agobio ni comparación con otros.
- **Para la familia:** ve un progreso tangible y comprensible → percibe que el Premium vale la pena.
- **Para Interlanguage:** producto propio y diferenciador, gestión sencilla de alumnos/accesos, contenido reutilizable y escalable, y una palanca de venta para el plan superior. Foso competitivo: la **sinergia con la clase presencial** (contenido alineado con lo que dan en clase), algo que ninguna app genérica ofrece.

## 3. Problemas que resuelve

- La práctica de inglés se limita a 1–2 horas semanales de clase; entre semana se olvida.
- Las familias no ven el avance real de su hijo.
- Interlanguage no tiene forma propia y controlada de dar práctica diaria ni de diferenciar su plan Premium.

## 4. Público objetivo (MVP) y necesidades

- **Alumnos de Primaria (6–11).** Sub-matiz importante: los de 6–7 años **aún no leen con soltura** → la interfaz debe apoyarse en **audio e imágenes**, con muy poco texto y botones grandes.
- **Familias** compradoras: quieren ver constancia y aprendizaje concreto, sin métricas que generen ansiedad.
- **Interlanguage (admin):** gestión de alumnos, accesos y contenido sin tocar código.

## 5. Alcance del MVP (qué SÍ y qué NO)

### Incluye (v1)
1. **Acceso seguro** del alumno (ver §7).
2. **App del alumno** responsive (móvil/tablet/ordenador, sin instalar): pantalla "¿qué hago hoy?", **sesión diaria de 8–12 min**, con mucho apoyo de audio.
3. **Motor de ejercicios** con un conjunto inicial de tipos reutilizables (ver §10).
4. **Progreso personal** + **racha flexible** + motivación **sin competición** (ver §12).
5. **Panel de admin**: alta de alumnos, activar/desactivar acceso, restablecer contraseñas, y **mini-CMS** para crear/editar/publicar ejercicios (ver §9).
6. **Vista de familias**: resumen sencillo de progreso (ver §14).
7. **Banco de contenido inicial** suficiente para las primeras semanas (ver §9).
8. **Seguridad y privacidad de menores** integradas desde el diseño (ver §17, §18).

### NO incluye todavía (fases posteriores)
- Panel de profesores (Fase 2).
- Speaking con micrófono / evaluación de pronunciación por IA (Fase 3).
- Repaso adaptativo avanzado (repetición espaciada fina) — en el MVP, versión simple.
- PWA instalable y notificaciones (Fase 2).
- Pagos automáticos / Stripe (al principio, alta/baja manual desde admin).
- ESO, Bachillerato, preparación de certificaciones (fases posteriores).

## 6. Perfiles y permisos

- **Alumno:** login, cambio de contraseña, sesión del día, práctica libre por unidad, su progreso, sus logros/racha. Solo ve contenido de su nivel.
- **Familia (MVP, vista de solo lectura):** resumen de progreso del hijo, días de práctica, "lo que ya sabe decir", vigencia del acceso, y solicitar restablecimiento de contraseña. Sin notas sobre 10, sin métricas ansiógenas.
- **Admin (Interlanguage):** gestión de alumnos y accesos, restablecer contraseñas, asignar nivel, gestionar contenido (crear/editar/publicar/archivar ejercicios), consultar progreso agregado, ver registro básico de auditoría.
- **Profesor (Fase 2):** ver sus grupos, progreso, alumnos con poca práctica, errores frecuentes, asignar unidades.

Control de acceso real basado en **roles**, comprobado **siempre en el servidor** (no ocultando enlaces).

## 7. Acceso y autenticación

**Crítica a "usuario = nombre + apellido":** desaconsejado. Problemas: duplicados (dos "María García"), apellidos compuestos, tildes/espacios, y —lo más importante— **expone el nombre completo de un menor** y es **fácil de adivinar** por terceros.

**Propuesta recomendada:** usuario = **código de alumno corto y no adivinable**, del estilo `luciag-4K7` (nombre corto + sufijo aleatorio) o un código tipo `IL-4K7P`. Fácil de leer, único, y no revela datos del menor. Se entrega junto a la contraseña temporal en el kit/mensaje de bienvenida. La familia podría, opcionalmente, personalizar un alias en el futuro.

**Requisitos de seguridad del acceso (todos en servidor):**
- Contraseña temporal segura + **cambio obligatorio en el primer acceso**.
- Contraseñas **hasheadas con Argon2id o bcrypt** (nunca en texto plano). *Nota: si se usa Supabase Auth, el hashing seguro lo gestiona el propio servicio.*
- Recuperación de contraseña **vía familia o admin** (los menores no usan email personal).
- **Rate limiting** y bloqueo temporal tras varios intentos fallidos.
- Sesiones seguras; cookies/tokens con flags seguros; cierre y revocación de sesión.
- **No revelar** si un usuario existe durante la recuperación.
- Autenticación reforzada para cuentas de **admin**.
- Registro de accesos sospechosos (auditoría básica).

## 8. Experiencia del alumno

**Onboarding (primer acceso):** bienvenida breve → cambio de contraseña → elegir un par de elementos de personalización no sensibles (p. ej. color/avatar) → mini-explicación de cómo funciona → **primera actividad muy fácil** (éxito garantizado). Un **diagnóstico corto** (5–8 ítems, jugado, no examen) ajusta el nivel de partida, combinado con el nivel que ya indique el profe.

**Pantalla de inicio ("¿qué hago hoy?"):** saludo, **sesión recomendada del día**, progreso de la semana, actividad pendiente/repaso si lo hay, y acceso a práctica libre. Nada de biblioteca enorme.

**Sesión diaria (8–12 min, se acorta para los más pequeños):** calentamiento/repaso corto → 1 concepto o bloque nuevo → práctica variada → mini-reto → cierre con recompensa discreta.

**Navegación corta:** Inicio · Practicar · Mi progreso · Mi perfil (colección/recompensas dentro de perfil).

## 9. Sistema de contenidos (el punto crítico)

**Nada de ejercicios "programados a mano" en el código.** Todo el contenido vive en **base de datos** y se gestiona desde un **mini-CMS** en el panel de admin.

- **Plantillas de actividad**: cada tipo de ejercicio (§10) es una plantilla; crear un ejercicio nuevo = rellenar campos, no programar.
- **Estados**: borrador → en revisión → publicado → archivado. **Ningún contenido para menores se publica sin aprobación humana.**
- **Metadatos por actividad**: objetivo, nivel (Pre-A1/A1/A2…), edad recomendada, habilidad, instrucción, respuesta correcta, explicación, pistas, intentos, audio/imagen, criterio de finalización, etiquetas.
- **Estrategia de creación (IA + revisión):** yo genero **borradores** con IA a partir de plantillas y del temario; un profe **revisa, corrige y aprueba**. Se prioriza el contenido de más uso.
- **Cantidad mínima para el MVP (orientativa):** ~150–250 ejercicios repartidos en unas **6–8 unidades temáticas** de Primaria (vocabulario cotidiano, rutinas, familia, colores/números, comida, etc.), suficientes para varias semanas sin repetir. Ampliar ~1–2 unidades/mes.
- **Evitar repetición:** variar plantillas, banco amplio por unidad, y selección que no repita lo recién visto.

## 10. Catálogo de actividades del MVP (Primaria)

Arrancar con un subconjunto sólido y reutilizable:
- Relacionar imagen ↔ palabra.
- Escuchar y elegir (audio → opción correcta).
- Ordenar letras / completar palabra.
- Seleccionar respuesta (opción múltiple con imagen).
- Arrastrar y clasificar vocabulario.
- Formar/ordenar una frase corta.
- Completar una mini-conversación.
- (Para 9–11) lectura breve + preguntas sencillas.

Se amplía el catálogo en fases (cloze, transformaciones, etc. para mayores).

## 11. Progresión y repaso

**Estado de dominio por contenido** (no una nota): `Nuevo · Practicando · Casi dominado · Dominado · Necesita repaso`. Se calcula por aciertos recientes, número de intentos y tiempo desde la última práctica.

- **MVP:** repaso **simple** — reintroduce lo fallado y lo no visto hace días; dificultad progresiva básica.
- **Fase 2:** repaso **adaptativo** avanzado (repetición espaciada fina, intercalado de habilidades, recomendaciones personalizadas).
- **Anti-frustración:** los errores **explican y dejan reintentar**; no se penaliza en exceso.

## 12. Motivación sin competición

Centrada en el progreso personal, **sin rankings ni comparación entre alumnos**:
- **Racha flexible** con día comodín / recuperación (una racha perdida no debe frustrar).
- **Objetivo semanal** (mejor que obligación diaria) y metas elegibles por el alumno.
- Barra de progreso, insignias por constancia/mejora/esfuerzo, colección/accesorios del personaje.
- Celebraciones discretas; mensajes positivos al volver tras varios días.
- **Sin** mecánicas manipulativas ni castigos emocionales.

## 13. Personaje de Interlanguage (para fase posterior — solo rutas)

Aún no se diseña; se apuntan rutas creativas originales (no copiar a Duolingo):
- **Explorador/a lingüístico** (viajero que descubre idiomas y culturas) — encaja con "estudiar en el extranjero"; riesgo infantil: bajo; funciona bien de 6 a 16.
- **Compañero animal original** (no un búho): p. ej. un zorro/lince viajero — cálido, reconocible; riesgo infantil: medio.
- **Figura abstracta de comunicación** (una "chispa"/burbuja de diálogo con personalidad) — muy escalable a marca; riesgo infantil: bajo; menos "mascota".

Se elegirá y diseñará en Fase 2, con varias propuestas visuales.

## 14. Vista de familias (MVP)

Resumen de solo lectura, claro y sin ansiedad:
- Días de práctica (constancia) y tiempo aproximado.
- "Lo que ya sabe decir" (frases/estructuras concretas) — la métrica más valiosa.
- Racha y evolución sencilla.
- Vigencia del acceso.
- Botón para solicitar restablecer contraseña.
Sin notas sobre 10, sin comparativas con otros.

## 15. Arquitectura técnica (comparación y recomendación)

**Opción A — Ligera (RECOMENDADA):**
Web responsive/PWA-ready + **Supabase** (base de datos PostgreSQL + autenticación + almacenamiento de audios/imágenes + reglas de seguridad por fila) + **Netlify** (alojamiento y CDN).
- *Pros:* barata, rápida, segura para este tamaño, poco mantenimiento, sin servidor que administrar, encaja con Claude Code, y **ya está iniciada**. La lógica sensible (crear cuentas, publicar contenido) se hace en funciones de servidor seguras.
- *Contras:* dependencia de Supabase/Netlify (mitigable: son estándar y exportables; los datos son PostgreSQL portable).

**Opción B — Framework completo (Next.js + Postgres gestionado + auth propia + almacenamiento + CDN + colas):**
- *Pros:* máximo control y escalado a millones.
- *Contras:* **mucho más caro de construir y mantener**; sobredimensionado para cientos de alumnos. Más superficie de fallos y de seguridad.

**Recomendación:** **Opción A.** Cumple rendimiento, seguridad y privacidad al tamaño real de Interlanguage, y reaprovecha lo ya construido. Migrar a B solo tendría sentido con escala muy grande, y sería evolutivo.

## 16. Modelo de datos inicial (tablas clave)

- `profiles` (id, rol, nombre, nivel, etapa, estado_acceso, must_change_password, created_at)
- `families` y `family_students` (relación familia ↔ alumno/s)
- `access` / `plan_status` (sin_acceso · prueba · activo · suspendido · caducado · especial)
- `groups`, `schools`, `teachers` (base ligera; uso pleno en Fase 2)
- **Contenido:** `units`, `skills`, `activities` (plantilla + metadatos + estado), `activity_assets` (audio/imagen)
- **Aprendizaje:** `attempts` (intento por actividad), `mastery` (estado de dominio por alumno×contenido), `progress`/`streaks` (racha, gemas, XP), `goals`, `rewards`
- **Cumplimiento:** `consents` (consentimientos), `audit_log` (accesos/acciones sensibles)

Al **cancelar una cuenta**: eliminar/anonimizar datos personales del alumno (nombre, alias, credenciales, intentos identificables); conservar solo datos agregados y anónimos si se necesitan estadísticas.

## 17. Seguridad (resumen)

Defensa en profundidad y OWASP: validación y sanitización **en servidor**, ORM/consultas parametrizadas, protección XSS/CSRF/clickjacking, cabeceras de seguridad (CSP, HSTS, etc.), rate limiting, gestión segura de secretos (variables de entorno), separación de entornos, logs sin datos sensibles, auditoría, copias de seguridad **cifradas y probadas**, dependencias actualizadas, **RBAC** y mínimo privilegio, y **comprobación de permisos siempre en servidor**. La clave pública (anon) puede ir en el navegador; la clave con permisos totales **solo** en el servidor.

## 18. Privacidad, menores y RGPD

Privacidad desde el diseño y **minimización de datos** (recoger solo lo imprescindible; **sin** ubicación, perfil público, voz por defecto, ni datos innecesarios). Consentimiento de padres/tutores, información clara, registro de consentimientos, derechos (acceso, rectificación, exportación, supresión), plazos de conservación, gestión de bajas, y **analítica respetuosa** (sin grabaciones de sesión de menores).

Si en Fase 3 se añade **speaking**: procesar el audio de forma **temporal**, **no almacenar** grabaciones por defecto, consentimiento específico y opción de borrado.

> **Requiere revisión de un profesional legal antes de lanzar:** textos de consentimiento y privacidad, acuerdos de tratamiento con proveedores (Supabase/Netlify), y política de cookies. La plataforma se deja preparada técnicamente; el visto bueno legal es humano.

## 19. Rendimiento (realista, no sobre-ingeniería)

Objetivos orientativos (p75): LCP < 2,5 s · INP < 200 ms · CLS < 0,1. Medios: web ligera, imágenes AVIF/WebP con tamaños responsive, audio con carga diferida, poco JavaScript inicial, fuentes optimizadas, y reservar dimensiones para evitar saltos de layout. CDN de Netlify para estáticos; el HTML revalida y los datos personales nunca se cachean en público.

## 20. Accesibilidad (base WCAG)

Navegación por teclado y foco visible, contraste suficiente, textos alternativos, subtítulos/transcripción en audios, no depender solo del color, botones grandes, tipografía legible, opción de **reducir movimiento**, y tiempos de respuesta holgados. Consideración especial: dislexia (tipografía/espaciado), TDAH (interfaz sin ruido), y apoyos de audio para pre-lectores.

## 21. Analítica y observabilidad (sin vigilancia invasiva)

Métricas de producto (alumnos activos, sesiones completadas, frecuencia semanal, abandono de actividades, errores frecuentes, unidades difíciles) y técnicas (errores front/back, fallos de login, uptime, Core Web Vitals reales). **Nada** de grabación de sesión de menores.

## 22. Testing y calidad

Tests de **permisos y seguridad** (un alumno no accede a lo de otro), unitarios de la lógica de progreso/dominio, integración del flujo de sesión, end-to-end del recorrido del alumno, accesibilidad, responsive y conexiones lentas, y pruebas reales con **alumnos y familias**. Una pantalla no está "hecha" solo porque se ve bien.

## 23. Plan por fases

- **Fase 0 — Descubrimiento (corta):** cerrar este diseño, preparar 6–8 unidades de contenido inicial, y validar el flujo con 2–3 familias piloto.
- **Fase 1 — MVP:** acceso seguro + app del alumno + sesión diaria + motor de ejercicios + progreso + racha + panel admin/CMS + vista de familias + contenido inicial + seguridad/privacidad. **← primer objetivo.**
- **Fase 2:** panel de profesores, repaso adaptativo, más tipos de actividad, personaje y recompensas, PWA/notificaciones, mejor analítica.
- **Fase 3:** speaking, recomendaciones avanzadas, contenido de "estudiar fuera", informes/certificados, pagos automáticos (Stripe), ESO y niveles avanzados.

## 24. Costes recurrentes a prever (orientativo)

- **Alojamiento (Netlify):** gratis al inicio; plan de pago (~orden de 20 $/mes) si crece el tráfico.
- **Supabase:** gratis para empezar; plan Pro (~orden de 25 $/mes) al crecer datos/usuarios.
- **Dominio:** el que ya tenéis.
- **Creación de audios/voces** (TTS de calidad) e imágenes: coste variable según volumen.
- **Tiempo de profe** para revisar contenido: el "coste" más real y continuo.
- **Asesoría legal** (una vez, antes de lanzar; revisiones puntuales después).
- *Cifras orientativas; se confirman al dimensionar.*

## 25. Dependencias y servicios externos

Supabase (datos/auth/almacenamiento), Netlify (hosting/CDN), un servicio de **email** (avisos a familias / recuperación), TTS para audios, y —futuro— Stripe (pagos) y un servicio de voz para speaking.

## 26. Criterios de éxito del MVP (qué demostraría que funciona)

- **Técnico:** un alumno real entra, hace su sesión diaria, su progreso se guarda y su familia lo ve — de forma segura y sin fricción, en móvil y ordenador.
- **De producto (piloto):** de un grupo piloto, **≥60%** practica **≥3 días/semana** durante 3–4 semanas; las familias entienden y valoran el resumen; el contenido inicial aguanta sin repetir.
- **Operativo:** Interlanguage puede **crear un ejercicio nuevo y darlo de alta a un alumno sin ayuda técnica**.

## 27. Riesgos principales y mitigación

| Riesgo | Mitigación |
|---|---|
| **Contenido** insuficiente o repetitivo (el mayor) | IA + revisión de profe; banco inicial suficiente; ampliación mensual planificada |
| **Privacidad de menores / RGPD** | Privacidad desde el diseño + **revisión legal** antes de lanzar |
| Los más pequeños (6–7) no leen | Diseño con audio e imágenes, poco texto, botones grandes |
| Abandono tras la novedad | Racha flexible, objetivos semanales, contenido que evoluciona |
| Sobre-ingeniería técnica | Enfoque ligero (Opción A), sin piezas innecesarias |
| Coste oculto de mantenimiento | Stack gestionado (Supabase/Netlify), poco servidor propio |
| Dependencia de proveedor | Datos en PostgreSQL portable; servicios estándar |

## 28. Tabla priorizada de funcionalidades

| Funcionalidad | Valor (alumno) | Valor (Interlanguage) | Dificultad | Prioridad | Fase | Riesgos |
|---|---|---|---|---|---|---|
| Acceso seguro (código alumno + clave temporal) | Alto | Alto | Media | Imprescindible | 1 | Seguridad menores |
| App del alumno + sesión diaria | Alto | Alto | Media | Imprescindible | 1 | Diseño pre-lectores |
| Motor de ejercicios (tipos iniciales) | Alto | Alto | Media | Imprescindible | 1 | — |
| Progreso + racha flexible (sin competición) | Alto | Medio | Baja-Media | Imprescindible | 1 | Frustración por racha |
| Panel admin + mini-CMS | Medio | Alto | Media-Alta | Imprescindible | 1 | Curva de uso |
| Vista de familias (resumen) | Medio | Alto (venta) | Baja-Media | Alta | 1 | — |
| Banco de contenido inicial (6–8 unidades) | Alto | Alto | Alta (esfuerzo) | Imprescindible | 1 | Calidad/tiempo profe |
| Seguridad + privacidad/RGPD | — | Alto (obligatorio) | Media | Imprescindible | 1 | Legal |
| Panel de profesores | Medio | Alto | Media | Media | 2 | — |
| Repaso adaptativo avanzado | Alto | Medio | Alta | Media | 2 | Complejidad |
| Personaje + recompensas ampliadas | Medio | Medio (marca) | Media | Media | 2 | Diseño |
| PWA instalable + notificaciones | Medio | Medio | Media | Media | 2 | Consentimiento |
| Speaking + pronunciación IA | Alto | Alto | Alta | Baja | 3 | Voz de menores |
| Pagos automáticos (Stripe) | — | Medio | Media | Baja | 3 | — |
| ESO / niveles avanzados | Alto | Alto | Alta (contenido) | Baja | 3 | Contenido |

## 29. Qué necesita especialistas externos

- **Legal (RGPD/menores):** consentimientos, privacidad, cookies, acuerdos con proveedores. **Antes de lanzar.**
- **Pedagógico:** un profe de Interlanguage que revise/apruebe todo el contenido y valide la progresión.
- (Opcional) diseño de marca para el personaje en Fase 2.

---

### Próximo paso
Si apruebas este documento, el siguiente paso es escribir el **plan de implementación** (paso a paso, empezando por el MVP), sin escribir código todavía hasta que también lo revises.
