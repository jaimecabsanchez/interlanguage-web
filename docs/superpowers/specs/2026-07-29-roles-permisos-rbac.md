# Roles, permisos y RBAC · Plataforma Interlanguage (MVP)

**Fecha:** 2026-07-29 · **Estado:** aprobado (incl. decisión §5).
Complementa: `2026-07-29-plataforma-practica-ingles-design.md`.

Principio rector: **mínimo privilegio** + **verificación siempre en el servidor**.
Cada perfil accede solo a lo estrictamente necesario, y los permisos se comprueban en
el backend (Supabase RLS / funciones), nunca solo ocultando botones en la pantalla.

Alcance MVP: **Alumno**, **Familia** (vista ligera) y **Admin** activos.
**Profesor** se define aquí pero se activa en **Fase 2**.

---

## 1. ALUMNO

- **Qué puede ver:** su sesión del día ("¿qué hago hoy?"), los ejercicios de su nivel,
  su progreso/racha/logros, sus errores para repasar, y su perfil (avatar/personalización).
- **Qué puede hacer:** iniciar sesión, cambiar su contraseña, completar ejercicios,
  repasar errores, personalizar su avatar y elegir su meta semanal.
- **Qué NO puede hacer:** ver datos de otros alumnos; ver rankings (no existen); acceder a
  paneles de admin/profe/familia; cambiar su propio nivel; ver contenido fuera de su nivel/edad
  (salvo lo asignado); borrar su cuenta; ver correos o datos de su familia.
- **Qué información necesita:** qué practicar hoy, feedback claro al fallar, y su avance.
- **Qué pantallas usa:** login · cambio de contraseña · inicio ("hoy") · lección/ejercicios ·
  mi progreso · mi perfil.
- **Acciones que requieren autorización:** ninguna especial más allá de tener sesión válida
  como ese alumno. El cambio de contraseña exige sesión activa.
- **Datos personales que puede consultar:** solo los suyos (su nombre/alias y su progreso).
- **Relación con otros perfiles:** el **admin** crea su cuenta y asigna su nivel; el **profe**
  (Fase 2) le asigna unidades; la **familia** ve su progreso (pero no interactúa con él en la app).

## 2. FAMILIA (padre / madre / tutor)

- **Qué puede ver:** un **resumen sencillo** del progreso de su(s) hijo(s): constancia
  (días de práctica), habilidades trabajadas, "lo que ya sabe decir", racha, y vigencia del
  acceso. Recomendaciones fáciles ("pregúntale en casa…").
- **Qué puede hacer:** consultar ese resumen; solicitar el **restablecimiento de la contraseña**
  del alumno; gestionar sus **consentimientos y datos** (derechos RGPD); ver/actualizar su email
  de contacto.
- **Qué NO puede hacer:** ver los ejercicios concretos ni "notas sobre 10"; ver datos de otros
  alumnos o familias; comparar a su hijo con otros; modificar contenido; crear cuentas; cambiar
  el nivel del alumno; acceder al panel de admin/profe.
- **Qué información necesita:** ¿mi hijo practica?, ¿avanza?, ¿qué está aprendiendo?,
  ¿hasta cuándo tiene acceso?
- **Qué pantallas usa:** el **resumen familiar** (solo lectura) + los **informes** que recibe
  (email/WhatsApp). *(Forma exacta según la decisión del apartado 5.)*
- **Acciones que requieren autorización:** restablecer contraseña del alumno (la ejecuta admin
  o un flujo controlado y verificado); ejercer derechos RGPD (con verificación de identidad).
- **Datos personales que puede consultar:** los de su **propio** hijo (nombre/alias y progreso
  agregado) y su propio email. Nada de otros alumnos ni familias.
- **Relación con otros perfiles:** vinculada a su(s) alumno(s); recibe informes del sistema/admin;
  no interactúa con el profe dentro de la app en el MVP.

## 3. PROFESOR *(se define ahora; se activa en Fase 2)*

- **Qué puede ver:** sus **grupos y alumnos asignados**, su evolución y constancia, los errores
  frecuentes del grupo, y qué alumnos practican poco.
- **Qué puede hacer:** consultar el progreso de sus alumnos; **asignar unidades/ejercicios** a su
  grupo; recomendar actividades; (opcional) añadir comentarios privados.
- **Qué NO puede hacer:** ver alumnos de grupos que no tiene asignados; gestionar cuentas, accesos
  o planes; editar el contenido maestro (solo **asignar** lo ya publicado); ver datos de familias
  más allá de lo imprescindible; exportar datos masivos.
- **Qué información necesita:** quién practica poco, qué le cuesta al grupo, qué conviene asignar.
- **Qué pantallas usa:** panel del profe (lista de grupos · ficha de alumno · asignaciones).
- **Acciones que requieren autorización:** asignaciones dentro de **su** grupo; nada fuera de su
  ámbito.
- **Datos personales que puede consultar:** los de **sus alumnos asignados** (nombre/alias y
  progreso). No los de otros grupos ni las credenciales.
- **Relación con otros perfiles:** el **admin** le asigna grupos; **asigna** contenido que crean
  admin/creadores; su trabajo lo ven alumnos (como tareas) y, indirectamente, las familias.

## 4. ADMINISTRADOR DE INTERLANGUAGE

- **Qué puede ver:** todo lo operativo — alumnos, grupos, colegios, profesores, accesos/planes,
  progreso agregado, contenido, auditoría, incidencias y consentimientos.
- **Qué puede hacer:** crear / importar (CSV) / editar / **desactivar** usuarios (alumnos y profes);
  gestionar colegios, grupos, planes y accesos; **restablecer contraseñas**; asignar niveles;
  gestionar contenido (crear/editar/**publicar**/archivar/duplicar); consultar auditoría; y
  gestionar consentimientos y solicitudes de privacidad.
- **Qué NO puede hacer:** ver contraseñas en claro (nunca se almacenan así); usar datos de menores
  con fines comerciales/publicidad. Las **acciones destructivas** (borrado masivo, exportaciones)
  deben quedar **registradas en auditoría** y, recomendable, con doble confirmación.
- **Qué información necesita:** estado de accesos, uso de la plataforma, incidencias y salud del
  contenido.
- **Qué pantallas usa:** panel de admin (alumnos · grupos/colegios · profesores · contenido/CMS ·
  accesos/planes · auditoría).
- **Acciones que requieren autorización:** acceso **reforzado** (2FA recomendado para admin); toda
  acción sensible se registra en la auditoría.
- **Datos personales que puede consultar:** los necesarios para la gestión (nombres/alias de
  alumnos, emails de familias, consentimientos), **con registro de auditoría**.
- **Relación con otros perfiles:** es el eje — crea alumnos y profes, asigna grupos, gestiona
  contenido, activa/desactiva accesos y atiende a las familias.

---

## 5. ¿Cuenta familiar independiente o informes desde administración? (análisis)

**Pregunta:** ¿la familia necesita su propia cuenta con login en el MVP, o basta con informes
enviados desde administración?

> ✅ **DECISIÓN APROBADA (2026-07-29):** opción recomendada — informe + resumen por enlace.
> Sin cuenta familiar con login en el MVP. Cuenta familiar completa → Fase 2.

**Recomendación para el MVP: NO crear una cuenta familiar completa todavía.** En su lugar:

1. **Informe periódico** (semanal) enviado a la familia (email o WhatsApp) desde el sistema/admin,
   con el resumen de progreso.
2. **Resumen web de solo lectura** accesible mediante un **enlace privado y seguro por alumno**
   (no adivinable, revocable y con caducidad), para consultar cuando quieran.
3. **Restablecimiento de contraseña** del alumno gestionado por **admin** (los menores no usan
   email personal).

**Por qué (crítico y realista):**
- **Menos datos personales** que proteger → menor superficie RGPD (no gestionamos credenciales de
  padres ni un sistema de cuentas familiares).
- **Mucho menos trabajo** de construir y mantener para el MVP.
- **Entrega igualmente el valor** clave (la familia ve el avance → justifica el Premium).
- Evita pedir a padres poco técnicos que gestionen otra contraseña más.

**Contrapartida a cuidar:** el enlace de solo lectura maneja datos de un menor, así que debe ser
**largo/no adivinable, caducar y poder revocarse** desde admin. Si esto se considera insuficiente,
la alternativa es un login familiar mínimo (email + contraseña) — más seguro pero más trabajo.

**Fase 2 — cuenta familiar completa:** login propio, gestión de varios hijos, ajustes de
notificaciones y ejercicio autoservicio de derechos RGPD.

---

## 6. Matriz RBAC (recurso × rol)

Notación: **✓** permitido · **P** solo lo propio/su ámbito · **R** solo lectura ·
**RP** lectura solo de lo propio/su ámbito · **—** no permitido · *(F2)* llega en Fase 2.

| Recurso / acción | Alumno | Familia | Profesor *(F2)* | Admin |
|---|---|---|---|---|
| Iniciar sesión | ✓ | ✓ (ver nota §5) | ✓ | ✓ (reforzado) |
| Cambiar su propia contraseña | ✓ | ✓ | ✓ | ✓ |
| Ver su sesión del día / ejercicios | P | — | — | R |
| Completar ejercicios / repasar errores | P | — | — | — |
| Ver su propio progreso | P | — | — | R |
| Ver progreso de un alumno | — | RP (su hijo) | RP (su grupo) | R (todos) |
| Personalizar su avatar / meta | P | — | — | — |
| Ver contenido/ejercicios publicados | RP (su nivel) | — | R | ✓ |
| Crear/editar/publicar contenido | — | — | — | ✓ |
| Asignar unidades a un grupo | — | — | P (su grupo) | ✓ |
| Crear / importar alumnos | — | — | — | ✓ |
| Editar / desactivar usuarios | — | — | — | ✓ |
| Restablecer contraseña de alumno | — | Solicitar | — | ✓ |
| Asignar nivel a un alumno | — | — | — | ✓ |
| Gestionar grupos / colegios | — | — | — | ✓ |
| Gestionar profesores | — | — | — | ✓ |
| Gestionar planes / accesos | — | — | — | ✓ |
| Ver resumen de progreso (familia) | — | RP (su hijo) | — | R |
| Gestionar consentimientos / RGPD | — | P (los suyos) | — | ✓ |
| Ver auditoría / incidencias | — | — | — | ✓ |
| Exportar datos | — | P (los de su hijo, RGPD) | — | ✓ (auditado) |

---

## 7. Notas de seguridad y privacidad de los permisos

- **RLS (Row Level Security)** en Supabase: cada consulta a datos personales filtra por el usuario
  y su ámbito; un alumno nunca puede leer filas de otro, ni un profe fuera de su grupo.
- **Comprobación en servidor siempre.** El frontend oculta lo que no toca, pero el permiso real lo
  decide el backend.
- **Admin con 2FA** y **auditoría** de acciones sensibles.
- **Minimización:** cada rol ve el mínimo de datos personales necesario.
- **Enlaces de familia** (si se adopta §5): tokens largos, caducables y revocables.

---

### Próximo paso
Definición de roles **aprobada** (incl. §5: familias con informe + enlace, sin cuenta en MVP).
Guía la construcción de los Bloques 3, 4 y 5.
