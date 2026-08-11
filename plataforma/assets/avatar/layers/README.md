# Capas del avatar ilustrado

Todas las capas usan un lienzo de 1024 × 1536 y comparten el mismo anclaje.
`look-01.png` y `look-05.png` siguen siendo los másteres predeterminados. El
compositor utiliza estas capas únicamente después de la primera modificación.

Orden de composición:

1. `base.png`: cuerpo, piel y ropa base neutra.
2. `outfit-green.png`: conjunto verde y azul predeterminado.
3. `hair-*.png`: peinado ilustrado.
4. `brows-default.png`, `eyes-default.png`, `nose-default.png` y
   `mouth-default.png`: rasgos separados que comparten una única transformación
   facial. No se escalan de forma independiente porque eso rompe las
   proporciones del personaje. `face-default.png` se conserva como fuente.

Las variantes futuras deben mantener el mismo lienzo y posición. No se debe
reescalar una capa individual al exportarla.
