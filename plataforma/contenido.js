/* ============================================================
   BANCO DE CONTENIDO · Interlanguage HOME
   ------------------------------------------------------------
   Aquí viven las UNIDADES y sus EJERCICIOS, fuera del código.
   Este es el mismo formato que luego gestionará el mini-CMS del
   panel de admin y que se guardará en Supabase.

   Cómo se lee:
   - Una UNIDAD agrupa ejercicios de un tema (ej. "Mi rutina").
   - Cada EJERCICIO tiene un "tipo" que decide cómo se muestra.

   TIPOS DE EJERCICIO disponibles en el MVP:
     • "elegir_imagen"   → pregunta + opciones con dibujo (emoji), una correcta
     • "elegir_texto"    → pregunta + opciones de texto, una correcta
     • "ordenar"         → ordenar palabras para formar una frase
     • "completar"       → completar el hueco eligiendo la palabra correcta
     • "hablar"          → repetir una frase en voz alta (sin evaluar, motivador)

   Campos comunes de un ejercicio:
     id          identificador único
     tipo        uno de los de arriba
     habilidad   "vocabulary" | "listening" | "grammar" | "reading" | "speaking"
     nivel       "Pre-A1" | "A1" | "A2"
     edad        [min, max]  (ej. [6,11])
     etiqueta    texto corto que se muestra arriba (ej. "Vocabulario")
     instruccion la pregunta / consigna
     explicacion (opcional) se muestra si falla
     audio       (opcional) texto que se leerá en voz alta (para los peques)
   ============================================================ */

window.IL_CONTENIDO = {
  unidades: [
    {
      id: "rutina-diaria",
      titulo: "Mi rutina diaria",
      nivel: "A1",
      etapa: "Primaria",
      descripcion: "Las acciones del día: levantarse, desayunar, ir al cole…",
      tema: { icono: "☀️", color: "#F4A73B" },
      ejercicios: [
        {
          id: "rd-1", tipo: "elegir_imagen", habilidad: "vocabulary", nivel: "A1", edad: [6,11],
          etiqueta: "Vocabulario", instruccion: '¿Cuál es "desayunar"?',
          audio: "Which one is have breakfast?",
          opciones: [
            { emoji: "🥣", texto: "have breakfast", correcta: true },
            { emoji: "🚿", texto: "take a shower" },
            { emoji: "🛏️", texto: "go to bed" },
            { emoji: "🎒", texto: "go to school" }
          ],
          explicacion: "have breakfast = desayunar."
        },
        {
          id: "rd-2", tipo: "elegir_texto", habilidad: "reading", nivel: "A1", edad: [8,11],
          etiqueta: "Comprensión", instruccion: '¿Qué significa "I wake up at 7"?',
          opciones: [
            { texto: "Me levanto a las 7", correcta: true },
            { texto: "Ceno a las 7" },
            { texto: "Me ducho a las 7" },
            { texto: "Voy al cole a las 7" }
          ]
        },
        {
          id: "rd-3", tipo: "ordenar", habilidad: "grammar", nivel: "A1", edad: [8,11],
          etiqueta: "Ordena la frase", instruccion: '"Me levanto a las ocho"',
          palabras: ["up", "I", "eight", "wake", "at"],
          respuesta: ["I", "wake", "up", "at", "eight"]
        },
        {
          id: "rd-4", tipo: "completar", habilidad: "grammar", nivel: "A1", edad: [8,11],
          etiqueta: "Gramática", instruccion: 'Completa: "I ___ breakfast every day."',
          opciones: [
            { texto: "have", correcta: true },
            { texto: "has" },
            { texto: "having" }
          ],
          explicacion: 'Con "I" usamos "have": I have breakfast.'
        },
        {
          id: "rd-5", tipo: "hablar", habilidad: "speaking", nivel: "A1", edad: [7,11],
          etiqueta: "A hablar", instruccion: "Di en voz alta:",
          frase: "What time do you wake up?"
        }
      ]
    },
    {
      id: "la-comida",
      titulo: "La comida",
      nivel: "Pre-A1",
      etapa: "Primaria",
      descripcion: "Vocabulario básico de alimentos y gustos.",
      tema: { icono: "🍎", color: "#1E9C74" },
      ejercicios: [
        {
          id: "lc-1", tipo: "elegir_imagen", habilidad: "vocabulary", nivel: "Pre-A1", edad: [6,9],
          etiqueta: "Vocabulario", instruccion: '¿Cuál es "manzana"?',
          audio: "Which one is an apple?",
          opciones: [
            { emoji: "🍎", texto: "apple", correcta: true },
            { emoji: "🍌", texto: "banana" },
            { emoji: "🥛", texto: "milk" },
            { emoji: "🍞", texto: "bread" }
          ]
        },
        {
          id: "lc-2", tipo: "elegir_imagen", habilidad: "listening", nivel: "Pre-A1", edad: [6,9],
          etiqueta: "Escucha y elige", instruccion: "Escucha y elige: banana",
          audio: "Banana",
          opciones: [
            { emoji: "🍌", texto: "banana", correcta: true },
            { emoji: "🍎", texto: "apple" },
            { emoji: "🧀", texto: "cheese" },
            { emoji: "🥚", texto: "egg" }
          ]
        },
        {
          id: "lc-3", tipo: "completar", habilidad: "grammar", nivel: "A1", edad: [8,11],
          etiqueta: "Gramática", instruccion: 'Completa: "I ___ pizza." (me gusta)',
          opciones: [
            { texto: "like", correcta: true },
            { texto: "likes" },
            { texto: "liking" }
          ],
          explicacion: 'Con "I" usamos "like": I like pizza.'
        },
        {
          id: "lc-4", tipo: "ordenar", habilidad: "grammar", nivel: "A1", edad: [8,11],
          etiqueta: "Ordena la frase", instruccion: '"Me gustan las manzanas"',
          palabras: ["apples", "I", "like"],
          respuesta: ["I", "like", "apples"]
        },
        {
          id: "lc-5", tipo: "hablar", habilidad: "speaking", nivel: "A1", edad: [7,11],
          etiqueta: "A hablar", instruccion: "Di en voz alta:",
          frase: "I like apples and bananas."
        },
        {
          id: "lc-6", tipo: "emparejar", habilidad: "vocabulary", nivel: "Pre-A1", edad: [6,10],
          etiqueta: "Relaciona", instruccion: "Une cada palabra con su dibujo",
          pares: [
            { a: "apple", b: "🍎" },
            { a: "banana", b: "🍌" },
            { a: "milk", b: "🥛" },
            { a: "bread", b: "🍞" }
          ]
        },
        {
          id: "lc-7", tipo: "comprension", habilidad: "reading", nivel: "A1", edad: [8,11],
          etiqueta: "Lee y responde", instruccion: "Lee y responde:",
          estimulo: { texto: "Tom likes apples and milk. He doesn't like bread." },
          preguntas: [
            { pregunta: "Does Tom like apples?", opciones: [{ texto: "Yes", correcta: true }, { texto: "No" }] },
            { pregunta: "Does Tom like bread?", opciones: [{ texto: "Yes" }, { texto: "No", correcta: true }] }
          ]
        }
      ]
    }
  ]
};
