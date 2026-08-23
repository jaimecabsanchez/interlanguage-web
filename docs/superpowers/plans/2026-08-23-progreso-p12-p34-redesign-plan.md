# Plan de implementación: Progreso p12/p34

Especificación: `docs/superpowers/specs/2026-08-23-progreso-p12-p34-redesign.md`

## 1. Lógica de presentación comprobable

- Añadir helpers puros a `progress-data.js` para estado semanal, CTA contextual y habilidades visibles.
- Cubrir objetivo pendiente/completado, copy por banda, CTA y ausencia de datos con tests.

## 2. Estructura de la pantalla

- Añadir al HTML los huecos semánticos para métricas semanales compactas, estado del próximo sello, CTA contextual y progreso de nivel de la sidebar.
- Mantener tabs, navegación, diálogos y fuentes de datos existentes.
- Cargar `progreso.css` después de `age-mode.css` para que los ajustes de esta pantalla puedan diferenciar `p12` y `p34` sin alterar otros módulos.

## 3. Renderizado por banda

- Diferenciar cabecera, tabs, semana, aprendizaje y racha por `IL_ETAPA.current().band`.
- Mantener `primary-young` como modo compartido y evitar duplicar la página.
- Ocultar cualquier dato no disponible en cuentas reales.

## 4. Composición y responsive

- Implementar el recorrido vertical aprobado.
- Convertir el próximo sello en tarjeta horizontal proporcionada.
- Compactar racha y sidebar.
- Añadir reglas específicas de `p12` y `p34`, preservando el aspecto actual de `p56` y ESO.

## 5. Verificación

- Ejecutar tests de lógica nuevos y la suite completa.
- Servir la raíz en el puerto 8752.
- Revisar `p12`, `p34`, `p56` y ESO en escritorio, tablet y móvil.
- Corregir desbordamientos, espacios muertos, foco, consola y regresiones.
- Actualizar `?v=` de todos los CSS/JS modificados.

## 6. Entrega

- Crear commits pequeños por intención.
- Informar archivos, cambios UX, diferencias por edad, datos reutilizados y resultados de pruebas.
