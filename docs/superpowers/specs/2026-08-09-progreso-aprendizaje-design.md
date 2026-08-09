# Progreso centrado en aprendizaje

Estado: aprobado por el usuario e implementado en la misma iteración. El usuario pidió ejecución directa sin nuevas preguntas.

## Objetivo

Transformar Progreso de un inventario de gamificación a una lectura rápida y honesta de práctica, aprendizaje, refuerzo y logros próximos. Mantener el shell, la navegación, `ILAuth` y el sistema visual global.

## Arquitectura elegida

- Tres tabs reales: **Esta semana**, **Mi aprendizaje** y **Logros**. En móvil ocupan tres columnas sin scroll horizontal.
- `progress-data.js` compone un snapshot a partir de las APIs existentes. Las métricas no disponibles permanecen en `null` y la interfaz lo explica; no se convierten en ceros.
- Los datos educativos de Lucía que solo existen para la demostración se concentran en `DEMO_LEARNING` y la interfaz muestra “Datos de ejemplo”.
- El sistema de sellos es independiente del catálogo histórico de medallas para no romper recompensas ya guardadas.

## Jerarquía

### Esta semana

Objetivo y días L–D son el foco. Minutos, comparación, racha y Día flexible son secundarios. El siguiente sello conecta práctica y recompensa sin monedas.

### Mi aprendizaje

Primero aparecen métricas educativas, después seis habilidades y finalmente evidencia concreta (“Ya sé decir”) y una recomendación amable (“Para reforzar”). Las métricas sin evidencia se presentan como pendientes de datos.

### Logros

Sellos con un visual único basado en pasaporte/avión, requisito, progreso y estado textual. Cada sello abre un diálogo accesible.

## Interacción y accesibilidad

- Tabs con roles ARIA, flechas izquierda/derecha, Home/End y persistencia en el hash.
- Sellos como botones, diálogo con cierre, Escape y foco visible.
- Progreso no depende solo del color: icono y texto acompañan cada estado.
- Targets mínimos de 44 px y animaciones desactivadas con `prefers-reduced-motion`.

## Responsive

- 360–767: una columna, tabs compactas, métricas 2 × 3, CTA de refuerzo a ancho completo.
- 768–1023: composiciones de dos columnas cuando aportan jerarquía.
- 1024+: ancho útil hasta el máximo del shell, paneles editoriales de 12 columnas y sin áreas vacías grandes.

## Riesgos controlados

- La base real no registra todavía minutos, palabras, precisión ni resultados de listening agregados. No se inventan: se muestran solo en demo y como no disponibles en cuentas reales.
- Las medallas históricas siguen existiendo en el motor; Progreso ya no las usa visualmente.
- `Morning Explorer` depende del historial local de misiones; los otros sellos usan progreso de cuenta, semana o datos educativos disponibles.

## Autorrevisión

- Se elimina el protagonismo de XP, gemas, racha y heatmap.
- Las tres preguntas clave —cuánto practico, qué aprendo, qué refuerzo— tienen respuesta directa.
- No se añaden dependencias ni se cambia de framework.
- Inicio, Progreso y Perfil siguen leyendo nombre, nivel, sesiones y racha desde las mismas fuentes autoritativas.
