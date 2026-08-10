# Plan de implementación · editor de avatar y mundo v3

## 1. Persistencia y tokens

- Ampliar `profile-settings.js` con rasgos faciales, ocho tonos de piel, seis colores de pelo, cinco colores de ojos y ocho peinados.
- Mantener las claves de almacenamiento existentes para migrar configuraciones sin pérdida.
- Añadir tokens de avatar a `design-system.css`.
- Extender las pruebas de saneamiento y persistencia.

## 2. Renderizador humano

- Separar rostro, ojos, cejas, nariz, boca y pelo en `world-visual.js`.
- Incorporar variaciones de forma y proporción dentro de límites visualmente seguros.
- Mantener ropa, accesorios y escenas existentes.
- Crear previsualizaciones compactas para los selectores de rasgos.

## 3. Editor progresivo

- Reorganizar `tienda.html` como banco de trabajo con vista previa persistente y panel de edición.
- Sustituir el catálogo de tarjetas por navegación de rasgos, controles graduales y opciones compactas.
- Implementar guardado automático, estado anunciado y acción `Sorpréndeme`.
- Mantener bloqueos y requisitos educativos para ropa, accesorios y mundo.

## 4. Paisaje en tiempo real

- Mantener el escenario visible mientras se editan objetos y fondos.
- Aplicar añadir, quitar y cambiar ambiente inmediatamente.
- Conservar la posición del alumno y el foco tras cada acción.
- Adaptar el encuadre entre edición del avatar y edición del mundo.

## 5. Responsive y edad

- Ajustar densidad, tamaños, copia e interacción para `p12`, `p34`, `p56` y `eso`.
- Verificar 360, 390, 768, 1024 y 1366 px.
- Respetar reducción de movimiento y navegación por teclado.

## 6. Validación

- Ejecutar pruebas unitarias existentes y nuevas.
- Probar todos los rasgos y recarga de persistencia.
- Probar añadir/quitar objetos con vista previa visible.
- Revisar Perfil después de personalizar.
- Comprobar consola y ausencia de scroll horizontal.
