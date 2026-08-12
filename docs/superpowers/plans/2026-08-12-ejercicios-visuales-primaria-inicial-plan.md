# Plan de implementación · ejercicios visuales de Primaria inicial

## 1. Lenguaje visual compartido

- Extraer las ilustraciones semánticas del motor a `exercise-visuals.js`.
- Mantener SVG ligeros, tokens de marca y fallback textual.
- Añadir escenas coherentes para saludos y los conceptos demo actuales.

## 2. Estructura del ejercicio

- Añadir metadatos semánticos de skill, tipo y presencia de audio.
- Reorganizar la jerarquía visual de `p12` sin cambiar `IL_ENGINE.render`.
- Mantener `p34` como transición visual y preservar `p56`/`eso`.

## 3. Interacción y estados

- Diferenciar selección de corrección mediante indicador neutral.
- Reforzar audio protagonista, reproducción, repetición y errores.
- Mantener feedback, segundo intento, CTA sticky y navegación por teclado.

## 4. Cabecera y progreso

- Crear cabecera inmersiva para `p12` con misión, contador y ruta segmentada.
- Mantener el avión de papel y reducir protagonismo de la racha.
- Adaptar la densidad a móvil, tablet y escritorio.

## 5. Responsive y accesibilidad

- Ajustar rejillas por legibilidad y longitud del contenido.
- Verificar targets táctiles, foco, ARIA y movimiento reducido.
- Evitar scroll horizontal y solapamiento del CTA.

## 6. Validación

- Ejecutar pruebas existentes y nuevas del recurso visual.
- Probar selección, acierto, error, reintento, audio, salida y finalización.
- Revisar `p12`, `p34`, `p56` y `eso` en navegador y corregir consola.
