# Encargo de arte · Avatar ilustrado (estilo referencia)

Fecha: 2026-08-10
Estado: propuesta (pendiente de decidir fuente del arte)

## Objetivo

Sustituir el avatar dibujado por código (SVG por piezas, aspecto plano) por un
avatar **ilustrado** que se parezca a la referencia aprobada: niño de estilo
cartoon moderno, con sombreado suave (cel-shading), pelo con mechones, cara
amable y proporciones cuidadas, de pie en el jardín.

**Importante:** este estilo requiere **arte producido** (ilustrador o imágenes
generadas). El código no puede "pintarlo". Este documento es el encargo para
producirlo y la especificación técnica para integrarlo.

## Estilo (guía para quien dibuje/genere)

- Cartoon vectorial-ilustrado, sombreado suave, bordes limpios (no realista, no
  3D, no anime, no pixel).
- Paleta de marca: navy `#16294a`, coral `#f26b4a`, verde `#168467`, crema
  `#f7f6f1`; piel y pelo naturales.
- Personaje **neutro e inclusivo**, sin marcar género; cara amable, ojos grandes.
- Pose única: de pie, de frente, brazos relajados, cuerpo entero centrado.
- Fondo **transparente** (el jardín lo pone la app).
- Iluminación consistente (luz suave arriba-izquierda) en TODAS las piezas para
  que encajen al superponerse.

## Enfoque técnico recomendado: capas apiladas

El avatar se compone apilando PNG transparentes por z-index. El editor cambia la
lámina de cada capa. Todas las piezas comparten **el mismo lienzo y el mismo
punto de anclaje** para que encajen sin recolocar.

- Lienzo: **512 × 768 px** (proporción 2:3), @2x incluido (1024×1536) para retina.
- Formato: **PNG-24 con transparencia** (o WebP). Nada de fondo.
- Anclaje: la cabeza siempre centrada en X y con la coronilla a la misma altura
  en todas las láminas de cabeza; cuerpo con la cadera a la misma Y.
- Nomenclatura: `avatar/<capa>/<id>.png` (p. ej. `avatar/hair/curly-brown.png`).

### Capas (de atrás hacia delante)

1. `hair-back` — pelo trasero (para melenas/rizos que asoman).
2. `body` — cuerpo+cabeza con la piel (incluye cuello, brazos, manos, piernas).
3. `face` — ojos, cejas, nariz, boca (expresión base amable).
4. `hair-front` — flequillo/mechones delanteros.
5. `outfit` — camiseta/sudadera/etc. (encima del cuerpo).
6. `shoes` — calzado.
7. `accessory` — gafas, gorro, auriculares… (opcional, encima).

## Trade-off honesto sobre "editar cada rasgo"

La edición fina cara-por-cara (forma de nariz, tipo de ceja, forma de ojo) que
insinúa el panel es **muy cara de ilustrar** con arte pintado, porque cada
combinación tiene que encajar. Recomiendo una de estas dos vías:

- **Vía A (recomendada, realista):** editar **capas de alto impacto** —peinado,
  color de pelo, ropa, calzado, accesorios y **2–3 caras/tonos base**— y retirar
  los sliders finos de nariz/cejas. Se ve genial y es asumible de producir.
- **Vía B (máxima edición):** ilustrar cada rasgo como pieza independiente que
  componga. Es un matriz de arte enorme y difícil de cuadrar; solo si hay un
  ilustrador dedicado.

## Manifiesto de assets (Vía A · mínimo para empezar)

| Capa        | Cantidad | Ejemplos                                              |
|-------------|----------|-------------------------------------------------------|
| body (piel) | 3–4      | claro, medio, oliva, oscuro                            |
| face        | 3        | sonrisa, tranquila, contenta                          |
| hair-front + hair-back | 6 juegos | corto, ondas, rizos, tupido, con flequillo, recogido |
| color pelo  | 5        | (recolor por CSS/tinte o láminas por color)           |
| outfit      | 6        | camiseta, camiseta a rayas, sudadera, polo, deportiva, chaqueta |
| shoes       | 3        | zapatillas, deportivas, botas                         |
| accessory   | 5        | gafas, gorro, auriculares, bufanda, mochila           |

Total aproximado para arrancar con buen aspecto: **~30–35 láminas**.

## Prompts de generación (si se usa IA de imágenes)

Base común para todos: *"flat modern children's book illustration, soft
cel-shading, clean vector-like edges, friendly neutral kid character, big
friendly eyes, front view, full body, standing, arms relaxed, transparent
background, soft top-left lighting, brand palette navy #16294a coral #f26b4a
green #168467"*. Añadir por pieza, por ejemplo:

- body/medio: *"…just the character body and head, plain skin, no hair, no
  clothes beyond underwear-neutral, medium skin tone, transparent background"*.
- hair/curly-brown: *"…only the hairstyle, short curly brown hair, isolated on
  transparent background, positioned as if on the same head"*.
- outfit/green-stripe: *"…only a green t-shirt with two light horizontal
  stripes, isolated, transparent background"*.

(La consistencia entre piezas es el mayor reto con IA: conviene fijar semilla y
revisar el encaje. Un ilustrador da resultados más fiables.)

## Integración en la app (lo que hago yo)

- `world-visual.js`: nueva función que compone el avatar apilando `<image>` con
  las láminas según los ajustes, en lugar de dibujar paths. Se mantiene el
  fallback al avatar vectorial actual si faltan assets.
- `profile-settings.js`: mapear cada ajuste (`avatarHair`, `avatarTop`,
  `avatarSkin`, `avatarAccessory`…) al `id` de la lámina correspondiente.
- Editor (`tienda.html` / `world-page.js`): los selectores muestran miniaturas
  de las láminas reales; al elegir, se cambia la capa al instante (ya existe el
  guardado automático).
- Rendimiento: precargar las láminas de la capa activa; `srcset` @1x/@2x.

## Lo que necesito de ti para arrancar

1. **Fuente del arte**: ¿ilustrador, generación por IA (lo hago yo con prompts
   pero necesito que apruebes/generes las imágenes), o una librería existente?
2. **Vía A o B** (recomiendo A).
3. Con eso: genero/recibo el set mínimo (~30 láminas), monto el compositor y lo
   dejo funcionando; mientras tanto puedo montar el motor con **placeholders**
   para que el sistema esté listo y solo haya que soltar el arte.
