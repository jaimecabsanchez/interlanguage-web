# Plan de implementación · Fase 2 Practicar adaptativo

**Especificación:** `docs/superpowers/specs/2026-08-24-fase-2-practicar-adaptativo-design.md`

## Entrega 1 · Modelo, copy y reglas

1. Crear `practice-options.js` como módulo puro UMD.
2. Modelar prioridad de misión diaria, repaso vencido, refuerzo y extra.
3. Aplicar variedad mediante eventos recientes como desempate.
4. Limitar conceptos iniciales de `p12` a Escuchar, Palabras y Hablar.
5. Añadir copy de Practicar al registro canónico.
6. Crear tests unitarios de prioridad, disponibilidad, variedad, copy y neutral.
7. Ejecutar tests afectados y commitear.

## Entrega 2 · Centro Practicar

1. Crear `practicar.html`, `practicar.css` y `practicar.js`.
2. Cargar perfil, banda, placement, contenido, misión, mastery y eventos recientes.
3. Renderizar recomendación prioritaria, repaso honesto y selector de habilidades.
4. Implementar loading, error y ausencia total de contenido.
5. Cambiar la navegación compartida de `layout.js`.
6. Actualizar cache-busting y añadir tests de contrato/accesibilidad.
7. Verificar cuatro bandas y commitear.

## Entrega 3 · Sesión por habilidad

1. Reconocer y validar `mode=skill&skill=<id>` en `leccion.html`.
2. Filtrar unidades asignadas → matriz de edad → habilidad → proximidad CEFR.
3. Construir sesión extra con rotación y límite por banda.
4. Mantener fuera de `begin/pause/complete` de misión diaria.
5. Registrar eventos y mastery con modo `extra`.
6. Volver a `practicar.html` en resumen o indisponibilidad; Inicio solo sin práctica global.
7. Añadir test de aislamiento de estado y commitear.

## Entrega 4 · Calidad final

1. Revisar teclado, foco, ARIA, texto grande y reduced motion.
2. Verificar 390×844, 768×1024, 1024×768 y 1440 px.
3. Verificar `p12`, `p34`, `p56`, `eso` y neutral.
4. Confirmar ausencia de overflow y errores de consola.
5. Ejecutar los 32 tests existentes más los nuevos.
6. Corregir regresiones, mantener `?v=` y commitear.
7. Detenerse y entregar el resultado para revisión del usuario.
