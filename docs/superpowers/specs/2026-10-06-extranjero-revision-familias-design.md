# Revisión de estudiar en el extranjero

Encargo: mejorar comprensión, comparación y solicitud de orientación para familias; implementar una primera fase revisable sin publicar.

Se conserva la dirección de escenas del proyecto, crema/marino/burdeos, Fraunces y fotografía existente. Se valoraron mantener escenas al inicio (experiencia antes de datos), concentrar todo en acordeones (breve pero difícil de comparar) y separar reconocimiento/comparación/condiciones/vida cotidiana. Se aplica esta última organización dentro de los componentes existentes, manteniendo las tres escenas y las rutas.

## Recorrido

Cabecera y respaldo de enseñanza de inglés en España → índice → tarjetas breves → comparación UK/Irlanda → acordeón de condiciones → escenas → orientación → presupuesto → FAQ → formulario existente colocado en la vista.

Tarjeta para reconocer, tabla para comparar, detalle para condiciones, escenas para imaginar la convivencia, pasos para explicar orientación disponible. Estados Unidos permanece como consulta sin inventar programa. Presupuesto sin precios ni plazo de entrega prometido. No construir experiencias o equipo sin materiales confirmados.

## Datos e interacciones

Guías de septiembre y decisiones humanas registradas. UK internado desde 7 en preparatorio hasta 13, otros desde Year 5/7 y hasta 18 según centro. Irlanda 10–18 con curso pendiente por centro. Edades del colegio no equivalen a admisión al internado. Selector/ayudas cambian por destino, con «Otra edad» para consultas. Duraciones numéricas solo UK: 1 trimestre, 2 trimestres y curso completo, sujetos a centro/plazas. Curso actual opcional en resumen y `serviceExtra` del payload existente.

Tarjetas llaman a `openExtDetail`; CTA conservan país/duración en `ilLead`; vuelta e historial restauran origen. Cambio de destino descarta duraciones no documentadas para ese destino. Se conservan errores y datos tras fallo de entrega.

## Alcance y validación

HTML/CSS/JS sin bundler o instalación, ES/EN equivalentes. Accesos en home limitados a extranjero, buscador y bloque internacional. CSS v71/JS v25. Revisar 320, 768, 1024 y 1440 px, desbordamiento, imágenes, consola, teclado, acordeón, rutas directas y pasos del formulario. Correr los cinco tests de AGENTS y sintaxis/diff. No enviar datos a producción ni afirmar recepción real mientras falte backend.

Dudas y límites: `docs/extranjero-pendientes.md`. El encargo autoriza implementar la revisión; no se introduce aprobación previa adicional. Entrega local en rama, sin push o despliegue.

## Verificación realizada

Los cinco tests exigidos por AGENTS pasan (100 comprobaciones). Sintaxis JS y `git diff --check` correctos. Auditoría HTML con biblioteca estándar: IDs únicos, recursos de imagen existentes, anclas, tres tarjetas y tres escenas en ES/EN, sin frases internas prohibidas. Navegador: 320/768/1024/1440 px sin desbordamiento horizontal; acción principal visible a 320×740; consola sin errores. Comprobados por teclado el detalle, consulta de dos trimestres UK, resumen con edad 7 y curso, vuelta con foco al CTA, cambio a Irlanda/Estados Unidos y retirada de duraciones no documentadas. Acceso directo a Irlanda en EN y restauración del selector 3–18 para extraescolar. No se ha enviado el formulario: el endpoint real devuelve 404.

> Actualización 07-10-2026: las tarjetas ya no llaman a `openExtDetail` ni existe la sección «Las condiciones de cada destino». Las tarjetas abren el formulario con el destino y las direcciones por destino bajan a su tarjeta. Estado vigente en `docs/extranjero-pendientes.md` y `web-publica/AGENTS.md`.
