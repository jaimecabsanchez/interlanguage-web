# Plan de implementación · sistema de ejercicios adaptativo por edad

## 1. Shell común del motor

- Consolidar metadatos semánticos y clases de tipo, skill, audio y soporte visual.
- Mantener `IL_ENGINE.render` y los controladores actuales.
- Garantizar fallbacks textuales para ejercicios sin ilustración.

## 2. Pieles por edad

- Terminar la experiencia inmersiva de `p12` y la transición `p34`.
- Crear una capa moderna y más compacta para `p56`.
- Crear una piel sobria, tecnológica y claramente adolescente para ESO.

## 3. Todas las plantillas

- Unificar selección, emparejar, ordenar, completar, clasificar, comprensión y speaking.
- Alinear selección, correcto, error, pista, reintento y CTA.
- Hacer que las plantillas futuras hereden el shell por defecto.

## 4. Responsive y accesibilidad

- Adaptar rejillas, lectura, targets táctiles, CTA y teclado.
- Verificar foco, ARIA, audio, progreso y movimiento reducido.
- Evitar desbordamientos entre 320 y 1440 px.

## 5. Verificación

- Probar las cuatro bandas y las plantillas disponibles en demo.
- Ejecutar los tests del motor, matriz, pedagogía, motivación y smoke tests.
- Revisar consola, rutas, caché y diferencias locales.
