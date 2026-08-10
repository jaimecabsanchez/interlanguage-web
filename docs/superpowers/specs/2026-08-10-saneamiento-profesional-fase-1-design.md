# Saneamiento profesional de la plataforma · Fase 1

## Contexto

La auditoría completa del 10 de agosto de 2026 confirmó que Interlanguage HOME ya tiene una base visual sólida, pero mantiene incoherencias heredadas que reducen la confianza en el producto: recompensas sin utilidad visible, datos demo imposibles, adaptación incompleta para ESO, una composición rota en Perfil y pruebas dependientes de la fecha de ejecución.

Esta fase corrige esos problemas antes de conectar el motor de dominio y repaso espaciado. No cambia el framework, no añade dependencias y no reescribe las pantallas.

## Objetivo

Dejar la experiencia actual coherente, profesional y estable en Primaria inicial, Primaria superior y ESO, preservando la lógica de misiones y progreso.

## Alcance

### 1. Perfil de ESO

- Corregir la cuadrícula de elementos desbloqueables para que ninguna etiqueta se parta verticalmente.
- Mantener dos columnas principales en escritorio cuando haya espacio suficiente.
- Convertir la biblioteca de personalización en una lista legible dentro de la columna disponible.
- Mantener el apilado móvil y los targets táctiles existentes.

### 2. Coherencia temporal de la semana demo

- Generar los días practicados sin marcar días posteriores al día actual.
- Mantener el ejemplo de cuatro sesiones cuando el calendario lo permita.
- En los primeros días de la semana, trasladar sesiones adicionales a la semana anterior en lugar de inventar actividad futura.
- La cifra actual de la semana y los puntos del calendario deben proceder de la misma estructura.

### 3. Microcopy y adaptación por etapa

- Corregir signos y textos incompletos.
- Evitar que ESO muestre recompensas específicas de rutinas cuando la sesión activa trata otro tema.
- Mantener español de apoyo en Primaria y una interfaz principalmente inglesa durante la misión de ESO.
- No alterar el contenido pedagógico de las preguntas en esta fase.

### 4. Recompensa inmediata

- Retirar `+10 puntos` del feedback visible: no existe un destino comprensible para esos puntos.
- Conservar internamente el dato legado durante esta fase para no romper persistencia ni migraciones.
- La finalización debe reconocer el aprendizaje y el progreso; no debe simular que siempre se ha desbloqueado `First Flight`.
- Mostrar una estampación solo cuando represente un sello pertinente; en caso contrario utilizar el avión como cierre de avance.

### 5. Persistencia y cambio de día

- Hacer que las operaciones de una misión acepten o conserven explícitamente la fecha de su estado.
- Evitar que una misión iniciada antes de medianoche produzca un estado nulo al registrar el siguiente intento.
- Convertir la prueba de misión en determinista, sin depender del día real en que se ejecuta.

### 6. Seguridad de entrega

- Añadir las tres cabeceras exigidas por la batería de smoke tests: HSTS, `X-Content-Type-Options` y `X-Frame-Options`.
- No modificar autenticación, RLS ni credenciales.

### 7. Sistemas heredados

- No enlazar ni promocionar la tienda de gemas.
- Documentar tienda, XP, gemas y medallas antiguas como legado pendiente de retirada.
- No eliminar campos de base de datos ni datos persistidos en esta fase.

## Fuera de alcance

- Integración completa de `mastery`.
- Nuevo compositor de sesiones adaptativas.
- Producción masiva de contenido.
- Autenticación familiar independiente.
- Rediseño del test de nivel y onboarding.
- Eliminación física de columnas de XP o gemas.

## Accesibilidad y responsive

- Verificar 360, 390, 768, 1024 y 1366 px.
- Mantener navegación por teclado, `focus-visible` y targets de 44 px.
- No introducir animaciones que ignoren `prefers-reduced-motion`.
- No depender del color para comunicar estados.

## Verificación

- Ejecutar todos los `*.test.js` de `plataforma/` y `plataforma/motor/`.
- Confirmar que `smoke.test.js` queda completamente verde.
- Probar Inicio, Lección, Progreso y Perfil en los tres modos.
- Probar feedback correcto e incorrecto.
- Confirmar ausencia de desbordamiento horizontal.
- Medir que las etiquetas de personalización de ESO conservan un ancho legible.

## Criterio de terminado

La fase está terminada cuando las incoherencias descritas han desaparecido, las pruebas pasan y la interfaz se mantiene reconociblemente Interlanguage sin cambios estructurales innecesarios.
