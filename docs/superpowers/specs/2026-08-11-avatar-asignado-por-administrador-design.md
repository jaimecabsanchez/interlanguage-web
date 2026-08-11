# Avatar asignado por el administrador y corrección visual

## Objetivo

Eliminar la elección `Masculino` / `Femenino` del editor del alumno. El sexo
se registrará en la ficha administrativa y determinará automáticamente qué
avatar ilustrado recibe el alumno. La interfaz debe dejar de renderizar las
capas aproximadas que deforman el personaje.

Esta especificación sustituye las decisiones sobre selección manual de base
de `2026-08-11-avatar-base-editor-gradual-design.md`.

## Decisiones de producto

- El administrador elige el sexo al crear o editar al alumno.
- Los valores admitidos son `male` y `female`; no se aceptan textos libres.
- La asignación visual es `male` → `look-01.png` y `female` → `look-05.png`.
- El alumno no verá la categoría `Base`, las tarjetas de sexo ni otro control
  para modificar este dato.
- `Sorpréndeme` y `Restablecer` no cambiarán el sexo ni la base asignada.
- La anatomía del avatar no se inferirá a partir del nombre, la edad o el
  peinado.

## Modelo de datos

Una migración añadirá `sex text` a `public.students`, con una restricción que
solo permita `male`, `female` o `null`. Será obligatorio en el formulario
administrativo para las nuevas altas y editable por el administrador.

Los alumnos existentes conservarán temporalmente `null`. Mientras el
administrador completa su ficha, la plataforma usará el `avatarBase` local ya
guardado, sin mostrar el selector al alumno. Si tampoco existe una preferencia
local válida, se mantiene el valor de compatibilidad actual (`masculine`) y el
panel administrativo mostrará que la ficha está pendiente. No se inventará un
sexo a partir de otros datos.

En modo demo, Lucía tendrá `female` para que la cuenta de muestra pruebe el
flujo completo de forma coherente.

## Flujo de datos

1. El administrador crea o edita al alumno y selecciona su sexo.
2. La capa administrativa guarda el valor en `students.sex`.
3. `ILAuth.profile()` incluye `sex` en el perfil activo.
4. La página de mundo deriva una base de solo lectura:
   `female` → `feminine`; cualquier perfil confirmado como `male` →
   `masculine`.
5. El render recibe esa base y muestra el máster ilustrado correspondiente.

`profile-settings.js` puede conservar `avatarBase` por compatibilidad, pero la
pantalla del alumno no será su fuente de verdad cuando `profile.sex` exista.

## Corrección visual inmediata

El compositor de capas generado se retirará del render activo porque no
reproduce las proporciones del máster y deforma ojos, rostro y pelo. Tanto en
estado inicial como después de recargar se mostrará el PNG aprobado completo:

- `assets/avatar/look-01.png` para masculino.
- `assets/avatar/look-05.png` para femenino.

Las preferencias graduales ya almacenadas no se borrarán, pero no volverán a
activar las capas incompatibles. Los controles de rasgos que no puedan ofrecer
un cambio visual fiable se ocultarán hasta disponer de arte por capas creado
desde una fuente compatible. La pestaña `Mundo` seguirá funcionando.

La personalización gradual se retomará únicamente con un juego de capas que,
al combinarse con sus valores predeterminados, reproduzca el máster sin cambio
perceptible de silueta, posición o expresión.

## Interfaz administrativa

El formulario `Nuevo alumno` incorporará un `select` obligatorio con las
opciones visibles `Masculino` y `Femenino`. La lista de alumnos mostrará el
valor asignado o `Pendiente` para registros antiguos. La acción de edición
permitirá corregirlo sin cambiar el acceso, progreso o matrícula.

Las operaciones reales pasarán por la función administrativa existente y las
operaciones demo actualizarán la base local de muestra. No se expondrá una
actualización directa de este campo a una sesión de alumno.

## Responsabilidades por archivo

- `supabase/migrations/`: añadir y restringir `students.sex`.
- `supabase/functions/admin-create-student/`: aceptar y validar el sexo en
  altas y actualizaciones administrativas.
- `plataforma/admin.html`: capturar, mostrar y editar el campo.
- `plataforma/auth.js`: transportar `sex` en perfiles reales y demo.
- `plataforma/world-page.js`: retirar `Base` y derivar la asignación desde el
  perfil autenticado.
- `plataforma/world-visual.js`: renderizar exclusivamente el máster asignado
  mientras las capas no superen la prueba de equivalencia visual.
- `plataforma/world.css`: retirar estilos y espacio reservados a la selección
  manual de base.
- Pruebas afectadas: cubrir validación, compatibilidad y ausencia del selector.

## Accesibilidad y privacidad

- El `select` administrativo tendrá etiqueta visible y mensaje de validación.
- El sexo no se mostrará como control editable en la cuenta del alumno.
- No se inferirá ni se enviará a servicios externos.
- La asignación del avatar no afectará a contenido pedagógico, nivel, acceso o
  recompensas.

## Verificación

- Un alta administrativa exige un sexo válido.
- Un administrador puede corregirlo posteriormente.
- Lucía recibe automáticamente el avatar femenino en demo.
- Un alumno masculino recibe automáticamente `look-01.png`.
- Un alumno femenino recibe automáticamente `look-05.png`.
- No aparecen `Base`, `Masculino` ni `Femenino` en el editor del alumno.
- Ningún ajuste ni recarga activa `il-avatar-stack` o las capas deformadas.
- `Sorpréndeme` y `Restablecer` conservan la asignación administrativa.
- Perfil, mundo, escritorio y móvil muestran el mismo avatar.
- Se ejecutan todos los tests Node del repositorio y una comprobación visual
  sin errores de consola.

## Fuera de alcance

- Inferir el sexo automáticamente.
- Permitir que el alumno cambie el campo administrativo.
- Crear en esta corrección un nuevo juego de ilustraciones por capas.
- Borrar las preferencias de avatar existentes.
- Modificar paisaje, progreso, recompensas o navegación global.
