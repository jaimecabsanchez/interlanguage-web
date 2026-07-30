# Motor de actividades (Bloque 7)

Motor reutilizable que **lee un ejercicio del banco de contenido y lo pinta, valida y da feedback**.
No hay "una pantalla por actividad": hay **plantillas base** (P1–P7) + datos.

Diseño completo: `docs/superpowers/specs/2026-07-29-catalogo-actividades-motor.md`.

## Estructura prevista
```
motor/
├─ engine.js          # carga ejercicio → elige plantilla → pinta → Comprobar → feedback → evento de intento
├─ sesion.js          # (B9) compone la sesión diaria: repaso + errores + 1 concepto nuevo
└─ plantillas/        # una por plantilla base (se cargan bajo demanda · code-splitting)
   ├─ p1-seleccion.js     # elegir 1 (texto/imagen/audio)
   ├─ p3-emparejar.js     # unir parejas / memory
   ├─ p5-ordenar.js       # ordenar fichas (letras/palabras/frases)
   ├─ p6-huecos.js        # rellenar huecos (validación tolerante)
   └─ p7-comprension.js   # estímulo + subpreguntas
```

## Reglas fijas
- La **respuesta correcta se valida en el servidor** (`answer_keys`), nunca viaja al navegador del alumno.
- Cada intento emite un **evento** que alimenta el progreso/dominio (Bloques 10–11).
- Accesible (teclado, foco, no solo color) y móvil desde el principio; cada plantilla carga bajo demanda.
