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
     • "elegir_imagen"   → pregunta + opciones con ilustración, una correcta
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
      id: "primer-vuelo",
      titulo: "My first school day",
      nivel: "Pre-A1",
      etapa: "Primaria inicial",
      descripcion: "Aprenderás palabras sencillas para hablar de tu día en el cole.",
      tema: { icono: "plane", color: "#1C9A82" },
      ejercicios: [
        {
          id: "pv-1", tipo: "elegir_imagen", habilidad: "listening", nivel: "Pre-A1", edad: [6,9],
          etiqueta: "Escucha", instruccion: "Escucha y elige el libro.", audio: "Book",
          opciones: [
            { visual: "book", texto: "book", correcta: true },
            { visual: "pencil", texto: "pencil" },
            { visual: "school-bag", texto: "school bag" }
          ],
          feedback: { correct: '“Book” significa “libro”.', incorrect: "Escucha otra vez y busca el libro.", context: "This is my book.", learnedExpressions: ["My book"] }
        },
        {
          id: "pv-2", tipo: "elegir_imagen", habilidad: "vocabulary", nivel: "Pre-A1", edad: [6,9],
          etiqueta: "Palabras", instruccion: "¿Cómo se dice “lápiz” en inglés?", audio: "Pencil",
          opciones: [
            { visual: "pencil", texto: "pencil", correcta: true },
            { visual: "book", texto: "book" },
            { visual: "chair", texto: "chair" }
          ],
          feedback: { correct: '“Pencil” significa “lápiz”.', incorrect: "Busca el objeto que usamos para escribir.", context: "I have a pencil.", learnedExpressions: ["A pencil"] }
        },
        {
          id: "pv-3", tipo: "elegir_texto", habilidad: "listening", nivel: "Pre-A1", edad: [6,9],
          etiqueta: "Escucha", instruccion: "Escucha y elige la respuesta.", audio: "Good morning",
          opciones: [
            { texto: "Buenos días", correcta: true },
            { texto: "Buenas noches" },
            { texto: "Hasta luego" }
          ],
          feedback: { correct: '“Good morning” significa “Buenos días”.', incorrect: "Es el saludo que usamos por la mañana.", context: "Good morning, teacher!", learnedExpressions: ["Good morning"] }
        },
        {
          id: "pv-4", tipo: "emparejar", presentacion: "visual", habilidad: "vocabulary", nivel: "Pre-A1", edad: [6,9],
          etiqueta: "Relaciona", instruccion: "Une cada palabra con su dibujo.",
          pares: [
            { a: "book", b: "book" },
            { a: "pencil", b: "pencil" },
            { a: "school bag", b: "school-bag" }
          ]
        },
        {
          id: "pv-5", tipo: "elegir_texto", habilidad: "speaking", nivel: "Pre-A1", edad: [6,9],
          etiqueta: "Tu turno", instruccion: "¿Qué puedes decir al llegar a clase?", audio: "Hello, teacher!",
          opciones: [
            { texto: "Hello, teacher!", correcta: true },
            { texto: "Good night!" },
            { texto: "I am a pencil." }
          ],
          feedback: { correct: "¡Muy bien! Es un saludo sencillo para empezar la clase.", incorrect: "Elige el saludo que usarías con tu teacher.", context: "Hello, teacher!", learnedExpressions: ["Hello, teacher!"] }
        }
      ]
    },
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
          etiqueta: "Vocabulario", instruccion: '¿Cómo se dice “desayunar” en inglés?',
          instructions: {
            p12: '¿Cómo se dice “desayunar” en inglés?',
            p34: '¿Cómo se dice “desayunar” en inglés?',
            p56: 'Which expression means “desayunar”?',
            eso: 'Which expression means “to have breakfast”?'
          },
          audio: "Have breakfast",
          opciones: [
            { visual: "have-breakfast", texto: "have breakfast", correcta: true },
            { visual: "take-a-shower", texto: "take a shower" },
            { visual: "go-to-bed", texto: "go to bed" },
            { visual: "go-to-school", texto: "go to school" }
          ],
          explicacion: "Usamos have breakfast para hablar de desayunar.",
          feedback: {
            correct: '“Have breakfast” significa “desayunar”.',
            incorrect: "Piensa en la comida que hacemos al empezar el día.",
            context: "I have breakfast at seven o’clock.",
            learnedExpressions: ["Have breakfast"]
          }
        },
        {
          id: "rd-2", tipo: "elegir_texto", habilidad: "reading", nivel: "A1", edad: [8,11],
          etiqueta: "Comprensión", instruccion: '¿Qué significa “I wake up at seven”?',
          feedback: {
            correct: '“I wake up at seven” significa “Me levanto a las siete”.',
            incorrect: "Busca la opción que habla del momento de despertarse.",
            context: "I wake up at seven every weekday.",
            learnedExpressions: ["Wake up"]
          },
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
          explicacion: 'Con “I” usamos “have”: I have breakfast.',
          feedback: {
            correct: 'Con “I” usamos “have”.',
            incorrect: "Fíjate en el sujeto: con I no añadimos -s.",
            context: "I have breakfast every day.",
            learnedExpressions: ["Have breakfast"]
          }
        },
        {
          id: "rd-5", tipo: "hablar", habilidad: "speaking", nivel: "A1", edad: [7,11],
          etiqueta: "A hablar", instruccion: "Di en voz alta:",
          frase: "What time do you wake up?"
        },
        {
          id: "rd-6", tipo: "elegir_texto", habilidad: "listening", nivel: "A1", edad: [9,11],
          etiqueta: "Listening", instruccion: "Listen and choose the correct time.", audio: "I go to school at half past eight.",
          opciones: [
            { texto: "8:30", correcta: true },
            { texto: "7:30" },
            { texto: "8:15" },
            { texto: "9:00" }
          ],
          feedback: { correct: '“Half past eight” means 8:30.', incorrect: '“Half past” means thirty minutes after the hour.', context: "I go to school at half past eight.", learnedExpressions: ["Half past eight"] }
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
          etiqueta: "Vocabulario", instruccion: '¿Cómo se dice “manzana” en inglés?',
          audio: "Which one is an apple?",
          opciones: [
            { visual: "apple", texto: "apple", correcta: true },
            { visual: "banana", texto: "banana" },
            { visual: "milk", texto: "milk" },
            { visual: "bread", texto: "bread" }
          ]
        },
        {
          id: "lc-2", tipo: "elegir_imagen", habilidad: "listening", nivel: "Pre-A1", edad: [6,9],
          etiqueta: "Escucha y elige", instruccion: "Escucha y elige: banana",
          audio: "Banana",
          opciones: [
            { visual: "banana", texto: "banana", correcta: true },
            { visual: "apple", texto: "apple" },
            { visual: "cheese", texto: "cheese" },
            { visual: "egg", texto: "egg" }
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
          id: "lc-6", tipo: "emparejar", presentacion: "visual", habilidad: "vocabulary", nivel: "Pre-A1", edad: [6,10],
          etiqueta: "Relaciona", instruccion: "Une cada palabra con su dibujo",
          pares: [
            { a: "apple", b: "apple" },
            { a: "banana", b: "banana" },
            { a: "milk", b: "milk" },
            { a: "bread", b: "bread" }
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
    },
    {
      id: "future-plans",
      titulo: "Plans for the weekend",
      nivel: "A2",
      etapa: "ESO",
      descripcion: "Practicarás cómo proponer planes, responder y organizar una salida con amigos.",
      tema: { icono: "calendar", color: "#163A5F" },
      ejercicios: [
        {
          id: "fp-1", tipo: "elegir_texto", habilidad: "listening", nivel: "A2", edad: [12,16],
          etiqueta: "Listening", instruccion: "Listen. What are they planning to do?", audio: "Why don't we go to the concert on Saturday?",
          opciones: [
            { texto: "Go to a concert", correcta: true },
            { texto: "Study for an exam" },
            { texto: "Play an online game" },
            { texto: "Visit a museum" }
          ],
          feedback: { correct: "They are planning to go to a concert.", incorrect: "Focus on the activity mentioned after “go to”.", context: "Why don't we go to the concert on Saturday?", learnedExpressions: ["Why don’t we…?"] }
        },
        {
          id: "fp-2", tipo: "elegir_texto", habilidad: "vocabulary", nivel: "A2", edad: [12,16],
          etiqueta: "Social English", instruccion: "Which response accepts the invitation?",
          opciones: [
            { texto: "Sounds good to me.", correcta: true },
            { texto: "I haven't decided yet." },
            { texto: "What happened yesterday?" },
            { texto: "I don't know where it is." }
          ],
          feedback: { correct: '“Sounds good to me” shows that you like the plan.', incorrect: "Choose the reply that clearly agrees with the suggestion.", context: "Saturday afternoon? Sounds good to me.", learnedExpressions: ["Sounds good to me"] }
        },
        {
          id: "fp-3", tipo: "completar", habilidad: "grammar", nivel: "A2", edad: [12,16],
          etiqueta: "Grammar", instruccion: "Complete the future arrangement: “We ___ meeting at six.”",
          opciones: [
            { texto: "are", correcta: true },
            { texto: "is" },
            { texto: "do" },
            { texto: "will be to" }
          ],
          feedback: { correct: "Use the present continuous for a fixed arrangement.", incorrect: "The subject is “we”, so the auxiliary is “are”.", context: "We are meeting at six.", learnedExpressions: ["We are meeting at…"] }
        },
        {
          id: "fp-4", tipo: "ordenar", habilidad: "writing", nivel: "A2", edad: [12,16],
          etiqueta: "Writing", instruccion: "Put the message in the correct order.",
          palabras: ["free", "you", "Are", "Saturday", "on"],
          respuesta: ["Are", "you", "free", "on", "Saturday"]
        },
        {
          id: "fp-5", tipo: "comprension", habilidad: "reading", nivel: "A2", edad: [12,16],
          etiqueta: "Reading", instruccion: "Read the chat and answer.",
          estimulo: { texto: "Maya: I'm free after basketball practice. Leo: Great. Let's meet outside the cinema at 7:15. Maya: Perfect — I'll take the bus." },
          preguntas: [
            { pregunta: "Where are they meeting?", opciones: [{ texto: "Outside the cinema", correcta: true }, { texto: "At basketball practice" }, { texto: "At the bus stop" }] },
            { pregunta: "How will Maya get there?", opciones: [{ texto: "By bus", correcta: true }, { texto: "On foot" }, { texto: "By bike" }] }
          ]
        },
        {
          id: "fp-6", tipo: "elegir_texto", habilidad: "speaking", nivel: "A2", edad: [12,16],
          etiqueta: "Conversation", instruccion: "Your friend can't meet at six. What is the most natural reply?",
          opciones: [
            { texto: "No problem. How about seven?", correcta: true },
            { texto: "I met you yesterday." },
            { texto: "Seven is a number." },
            { texto: "You must be free." }
          ],
          feedback: { correct: "This keeps the conversation open and suggests an alternative.", incorrect: "Choose the friendly reply that offers another time.", context: "No problem. How about seven?", learnedExpressions: ["How about…?"] }
        },
        {
          id: "fp-7", tipo: "completar", habilidad: "writing", nivel: "A2", edad: [12,16],
          etiqueta: "Message", instruccion: "Complete the message: “Text me when you ___ there.”",
          opciones: [
            { texto: "get", correcta: true },
            { texto: "will get" },
            { texto: "getting" },
            { texto: "gets" }
          ],
          feedback: { correct: "After “when”, use the present simple to refer to the future.", incorrect: "Time clauses with “when” use the present simple.", context: "Text me when you get there.", learnedExpressions: ["Text me when you get there"] }
        }
      ]
    }
  ]
};

/* ============================================================
   CONTENIDO CREADO CON EL MINI-CMS (panel de administración)
   ------------------------------------------------------------
   Las unidades creadas en admin-contenido.html se guardan en
   localStorage ("il_cms_content") y aquí se fusionan con el banco,
   para que aparezcan en las misiones sin tocar código.
   (Persistencia local por ahora; en producción vivirá en Supabase.)
   ============================================================ */
(function () {
  try {
    var extra = JSON.parse(localStorage.getItem("il_cms_content") || "[]");
    if (Array.isArray(extra) && extra.length) {
      extra.forEach(function (u) { if (u && Array.isArray(u.ejercicios)) window.IL_CONTENIDO.unidades.push(u); });
    }
  } catch (e) { /* si falla, seguimos con el banco base */ }
})();
