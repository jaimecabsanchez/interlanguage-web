# Acceso familiar real y panel de progreso fiable

**Fecha:** 2026-09-10  
**Estado:** diseño aprobado; pendiente de revisión final antes de implementar

## 1. Objetivo

Convertir `plataforma/familias.html` en el área privada y canónica para madres, padres y tutores vinculados a un alumno. El acceso será independiente de la cuenta infantil, solo de lectura y mediante enlace mágico enviado al correo previamente registrado por Interlanguage.

El panel debe explicar el aprendizaje con datos reales y lenguaje claro, sin inventar conclusiones cuando aún no exista evidencia suficiente. Debe admitir varios hijos por familiar y mantener temporalmente `informe.html` para los enlaces compartidos existentes.

## 2. Alcance

Incluido:

- alta, reutilización e invitación de cuentas con rol `family`;
- acceso por enlace mágico y recuperación de enlaces caducados;
- separación estricta entre sesiones de alumno, personal y familiar;
- selección entre alumnos vinculados;
- carga de progreso real para un `student_id` autorizado;
- estados de carga, sin datos suficientes, error, sesión caducada y desconexión;
- modo de demostración familiar;
- convivencia controlada con el informe compartido heredado;
- pruebas de dominio, autenticación, permisos, integración y navegador.

No incluido:

- mensajería entre familia y profesorado;
- edición de datos académicos desde el panel familiar;
- recompensas, monedas, cofres o rankings;
- calificaciones escolares o comparaciones con otros alumnos;
- eliminación inmediata de `informe.html` o de `share-report`;
- rediseño profundo de las pantallas del alumno.

## 3. Principios de experiencia

1. **Acceso sencillo y seguro.** El familiar escribe su correo y recibe un enlace. No se exige recordar otra contraseña.
2. **Privacidad por defecto.** La respuesta del formulario es siempre genérica y no confirma si el correo está registrado.
3. **Lectura, no suplantación.** Una sesión familiar nunca puede completar actividades, modificar aprendizaje ni navegar como el alumno.
4. **Evidencia antes que decoración.** Una cifra solo se presenta cuando se conocen su fuente, periodo, muestra y suficiencia.
5. **Explicación antes que analítica.** El orden principal es: qué ha cambiado, qué está aprendiendo, qué necesita reforzar y cómo acompañarlo.
6. **Progreso sin presión.** No se usan rankings, castigos, comparaciones, etiquetas negativas ni mensajes de culpa.
7. **Una familia, varios hijos.** El selector de alumno aparece únicamente cuando existen dos o más vínculos.

## 4. Flujo de acceso

### 4.1 Alta e invitación

1. Personal autorizado crea o actualiza un alumno e introduce el correo familiar.
2. La Edge Function normaliza el correo (`trim` y minúsculas).
3. Si ya existe una identidad familiar para ese correo, se reutiliza y solo se crea el vínculo que falte.
4. Si no existe, se crea o invita una cuenta Auth con metadatos familiares y se asigna el rol `family`.
5. Se vincula la identidad Auth con `families.user_id` y el alumno mediante `student_guardians`.
6. El correo de invitación dirige a `plataforma/familias.html`.

La operación debe ser idempotente: repetirla no crea otra familia, otro rol ni otro vínculo. Los registros heredados duplicados por correo se podrán asociar a la misma identidad sin borrar datos automáticamente.

### 4.2 Inicio de sesión posterior

1. `familias-acceso.html` solicita únicamente el correo.
2. El cliente llama a `signInWithOtp` con `shouldCreateUser: false`.
3. La interfaz muestra siempre: “Si el correo está vinculado, recibirás un enlace para entrar”.
4. Supabase devuelve al panel mediante el enlace mágico.
5. `familias.html` valida sesión y rol antes de cargar cualquier alumno.

Un enlace caducado conduce de nuevo al acceso con una explicación breve y la opción de solicitar otro. El cierre de sesión vuelve al acceso familiar, no al login del alumno.

### 4.3 Varios alumnos

El panel obtiene exclusivamente los alumnos vinculados al usuario autenticado. Si hay uno, lo selecciona directamente. Si hay varios, recuerda localmente la última selección, pero vuelve a comprobar el vínculo en servidor en cada carga.

## 5. Autorización y modelo de datos

Se mantiene el modelo existente `families` + `student_guardians` y la función `can_view_student`. La nueva migración debe:

- confirmar o añadir lectura para tutores en todas las tablas necesarias de aprendizaje;
- impedir escrituras familiares en intentos, sesiones, dominio, estado, rachas, colocación y recompensas;
- proporcionar una consulta segura de alumnos vinculados si el `select` relacional actual no resulta suficientemente explícito;
- añadir índices o restricciones idempotentes necesarias para evitar nuevos duplicados, sin eliminar registros históricos de forma destructiva;
- mantener el rol `family` como identidad separada de `student`, `teacher` y `admin`.

`ILAuth.getProfile()` reconocerá `is_family`. Una cuenta familiar sin rol de alumno nunca caerá en el fallback actual que intenta cargar una ficha de `students`. El perfil familiar no tendrá `student_id` implícito.

Toda lectura académica recibirá un `student_id` explícito ya verificado. No se reutilizarán métodos que asumen que el usuario autenticado es el propio alumno.

## 6. Contrato de datos familiares

Se creará un adaptador específico que componga el panel a partir de fuentes reales autorizadas:

- perfil, edad y nivel actual;
- colocación inicial más reciente;
- sesiones e intentos del periodo;
- contenidos y habilidades efectivamente trabajados;
- dominio disponible por habilidad;
- expresiones o evidencias verificables cuando existan;
- evolución temporal únicamente con suficientes puntos comparables.

Cada métrica incluirá, como mínimo:

```js
{
  value,
  source,
  period,
  sample,
  sufficient
}
```

Reglas de suficiencia:

- no se muestra una tendencia con menos de tres periodos comparables;
- no se interpreta precisión o dominio con muestras pequeñas;
- un valor ausente se muestra como estado explicativo, nunca como cero;
- demo y datos reales quedan marcados internamente y no se mezclan;
- las recomendaciones se derivan de evidencia disponible y nunca cambian el estado del alumno.

Los umbrales concretos vivirán en el módulo de dominio y tendrán pruebas unitarias, no en el DOM.

## 7. Arquitectura de interfaz

### Acceso familiar

- marca “Interlanguage Familias”;
- título directo: “Consulta su aprendizaje”;
- correo, acción “Enviarme un enlace” y mensaje de privacidad;
- confirmación genérica, reenvío con espera visible y ayuda de contacto;
- foco, teclado, mensajes de error y lectores de pantalla correctamente resueltos.

### Panel canónico

- cabecera adulta con identidad del alumno, selector cuando proceda, periodo y cierre de sesión;
- resumen narrativo “Qué ha cambiado”;
- actividad y constancia con periodos claramente etiquetados;
- contenidos trabajados y ejemplos reales;
- fortalezas y aspecto a reforzar solo con evidencia suficiente;
- recomendación familiar concreta, breve y no evaluativa;
- colocación o nivel descrito como referencia aproximada, no como nota definitiva.

La interfaz será sobria, premium y responsiva. Usará exclusivamente tokens `--il-*`, respetará `prefers-reduced-motion`, contraste AA, objetivos táctiles y navegación por teclado. No utilizará la navegación lúdica del alumno ni añadirá personajes omnipresentes.

## 8. Navegación y límites de sesión

- Las rutas familiares tendrán guard propio.
- Una familia que intente abrir Inicio, Practicar, Progreso o Perfil del alumno será devuelta al panel familiar.
- Un alumno que abra el panel real verá una explicación y no datos familiares; el acceso demo se resolverá mediante una identidad familiar simulada, no fingiendo que el alumno es su tutor.
- Las recomendaciones del panel no enlazarán a una lección ejecutable bajo sesión familiar.
- Administradores conservarán sus herramientas, pero no se considerarán automáticamente familiares.

## 9. Convivencia con el informe compartido

`familias.html` pasa a ser el producto familiar principal. `informe.html` y `share-report` se conservan durante esta fase para no romper enlaces temporales existentes.

Se reducirá la duplicación mediante un modelo/presentación compartidos cuando sea seguro. El informe por token seguirá siendo una instantánea limitada y sin sesión familiar. Su retirada queda como deuda explícita para una migración posterior con telemetría de uso y caducidad de enlaces.

## 10. Manejo de errores y privacidad

- formulario resistente a enumeración de cuentas;
- no crear usuarios desde el acceso público;
- no incluir datos del menor en mensajes de error o URLs;
- sesión caducada y enlace inválido con recuperación clara;
- fallo parcial de una fuente produce un panel degradado, no datos inventados;
- desconexión distingue datos anteriores de datos actualizados;
- invitación/reenvío con límite de frecuencia y auditoría en servidor;
- el correo familiar no implica consentimiento comercial;
- no se exponen apellidos, credenciales ni información de otros alumnos.

## 11. Entregas incrementales

### Entrega 1 — Identidad y permisos

Migración, rol familiar, resolución de perfil, políticas de lectura y pruebas de aislamiento.

### Entrega 2 — Invitación y acceso

Provisionamiento idempotente desde administración, enlace mágico, estados de acceso, cierre de sesión y demo familiar.

### Entrega 3 — Datos reales y evidencia

Selector de alumnos vinculados, adaptador de progreso, reglas de suficiencia, degradación honesta y recomendaciones no mutantes.

### Entrega 4 — Panel y compatibilidad

Interfaz canónica responsive, puente con el informe heredado, accesibilidad, pruebas completas y verificación visual.

Cada entrega será un commit pequeño y dejará el árbol funcional.

## 12. Verificación

Además de toda la suite existente:

- pruebas puras de normalización, idempotencia, selección y suficiencia;
- prueba de que un rol `family` no se interpreta como alumno;
- prueba de que una familia A no puede leer al alumno de la familia B;
- prueba de que ninguna operación familiar escribe progreso;
- acceso conocido, desconocido, enlace válido, caducado y reenvío;
- uno y varios alumnos vinculados;
- alumno nuevo, evidencia escasa, evidencia suficiente y fallo parcial;
- informe heredado por token;
- navegador en móvil, tableta y escritorio;
- teclado, foco, lectores de pantalla, contraste y movimiento reducido;
- revisión sin errores de consola y subida de `?v=` en todo JS/CSS modificado.

## 13. Riesgos y mitigaciones

- **Registros familiares duplicados:** reutilización por correo normalizado y migración conservadora, sin borrado automático.
- **Plantilla de correo o redirect mal configurado en Supabase:** documentar URLs permitidas y validar entorno local/producción.
- **Datos históricos insuficientes:** estados de baja evidencia y métricas ocultas hasta superar umbrales.
- **Duplicación entre panel e informe:** compartir dominio ahora y retirar el heredado solo en una fase posterior.
- **Escalada accidental de permisos:** pruebas negativas de RLS y ausencia total de métodos de escritura en el adaptador familiar.
- **Configuración remota no reproducible solo con git:** documentar cada ajuste requerido de Supabase y mantener una comprobación observable en la aplicación.

## 14. Criterios de aceptación

La fase se considera terminada cuando un familiar pre-vinculado puede recibir un enlace, entrar de forma independiente, cambiar entre sus hijos y comprender su evolución con datos reales o estados honestos; no puede ver alumnos ajenos ni alterar aprendizaje; los accesos antiguos siguen funcionando; la suite completa pasa y las vistas definidas quedan verificadas visualmente.
