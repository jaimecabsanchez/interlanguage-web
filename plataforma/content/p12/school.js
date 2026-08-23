/* Pack editorial generado desde contenido.js; editar el dato, no el motor. */
ILContent.registerPack({
  "id": "p12-school-core",
  "version": 1,
  "stages": [
    "p12",
    "p34"
  ],
  "topic": "school",
  "units": [
    {
      "id": "primer-vuelo",
      "titulo": "My first school day",
      "visual": "school",
      "nivel": "Pre-A1",
      "etapa": "Primaria inicial",
      "descripcion": "Aprenderás palabras sencillas para hablar de tu día en el cole.",
      "tema": {
        "icono": "plane",
        "color": "#1C9A82"
      },
      "stage": [
        "p12",
        "p34"
      ],
      "topic": "school",
      "objective_ids": [
        "school-objects",
        "school-greetings",
        "school-classroom",
        "school-language"
      ]
    }
  ],
  "objectives": [
    {
      "id": "school-objects",
      "skill": "vocabulary",
      "literacy_load": "low",
      "description": "Reconocer objetos básicos del aula.",
      "unit_id": "primer-vuelo",
      "stage": [
        "p12",
        "p34"
      ],
      "cefr": "Pre-A1",
      "difficulty": 2,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "school"
      ]
    },
    {
      "id": "school-greetings",
      "skill": "speaking",
      "literacy_load": "low",
      "description": "Comprender y usar saludos básicos en clase.",
      "unit_id": "primer-vuelo",
      "stage": [
        "p12",
        "p34"
      ],
      "cefr": "Pre-A1",
      "difficulty": 2,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "school"
      ]
    },
    {
      "id": "school-classroom",
      "skill": "vocabulary",
      "literacy_load": "low",
      "description": "Palabras y órdenes sencillas del aula (números, instrucciones).",
      "unit_id": "primer-vuelo",
      "stage": ["p12", "p34"],
      "cefr": "Pre-A1",
      "difficulty": 2,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": ["school"]
    },
    {
      "id": "school-language",
      "skill": "grammar",
      "literacy_load": "medium",
      "description": "Frases muy sencillas: I have…, This is…",
      "unit_id": "primer-vuelo",
      "stage": ["p34"],
      "cefr": "A1",
      "difficulty": 3,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": ["school"]
    }
  ],
  "exercises": [
    {
      "id": "pv-1",
      "tipo": "elegir_imagen",
      "habilidad": "listening",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Escucha",
      "instruccion": "Escucha y elige el libro.",
      "audio": "Book",
      "opciones": [
        {
          "visual": "book",
          "texto": "book",
          "correcta": true
        },
        {
          "visual": "pencil",
          "texto": "pencil"
        },
        {
          "visual": "school-bag",
          "texto": "school bag"
        }
      ],
      "feedback": {
        "correct": "“Book” significa “libro”.",
        "incorrect": "Escucha otra vez y busca el libro.",
        "context": "This is my book.",
        "learnedExpressions": [
          "My book"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-objects",
      "stage": [
        "p12",
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "school-objects",
      "tags": [
        "school"
      ]
    },
    {
      "id": "pv-2",
      "tipo": "elegir_imagen",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Palabras",
      "instruccion": "¿Cómo se dice “lápiz” en inglés?",
      "audio": "Pencil",
      "opciones": [
        {
          "visual": "pencil",
          "texto": "pencil",
          "correcta": true
        },
        {
          "visual": "book",
          "texto": "book"
        },
        {
          "visual": "chair",
          "texto": "chair"
        }
      ],
      "feedback": {
        "correct": "“Pencil” significa “lápiz”.",
        "incorrect": "Busca el objeto que usamos para escribir.",
        "context": "I have a pencil.",
        "learnedExpressions": [
          "A pencil"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-objects",
      "stage": [
        "p12",
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "school-objects",
      "tags": [
        "school"
      ]
    },
    {
      "id": "pv-3",
      "tipo": "elegir_texto",
      "habilidad": "listening",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Escucha",
      "instruccion": "Escucha y elige la respuesta.",
      "audio": "Good morning",
      "opciones": [
        {
          "texto": "Buenos días",
          "correcta": true
        },
        {
          "texto": "Buenas noches"
        },
        {
          "texto": "Hasta luego"
        }
      ],
      "feedback": {
        "correct": "“Good morning” significa “Buenos días”.",
        "incorrect": "Es el saludo que usamos por la mañana.",
        "context": "Good morning, teacher!",
        "learnedExpressions": [
          "Good morning"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-greetings",
      "stage": [
        "p12",
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "school-greetings",
      "tags": [
        "school"
      ]
    },
    {
      "id": "pv-4",
      "tipo": "emparejar",
      "presentacion": "visual",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Relaciona",
      "instruccion": "Une cada palabra con su dibujo.",
      "pares": [
        {
          "a": "book",
          "b": "book"
        },
        {
          "a": "pencil",
          "b": "pencil"
        },
        {
          "a": "school bag",
          "b": "school-bag"
        }
      ],
      "unit_id": "primer-vuelo",
      "objective_id": "school-objects",
      "stage": [
        "p12",
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "school-objects",
      "tags": [
        "school"
      ]
    },
    {
      "id": "pv-5",
      "tipo": "elegir_texto",
      "habilidad": "speaking",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Tu turno",
      "instruccion": "¿Qué puedes decir al llegar a clase?",
      "audio": "Hello, teacher!",
      "opciones": [
        {
          "texto": "Hello, teacher!",
          "correcta": true
        },
        {
          "texto": "Good night!"
        },
        {
          "texto": "I am a pencil."
        }
      ],
      "feedback": {
        "correct": "¡Muy bien! Es un saludo sencillo para empezar la clase.",
        "incorrect": "Elige el saludo que usarías con tu teacher.",
        "context": "Hello, teacher!",
        "learnedExpressions": [
          "Hello, teacher!"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-greetings",
      "stage": [
        "p12",
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "school-greetings",
      "tags": [
        "school"
      ]
    },
    {
      "id": "pv-6", "tipo": "elegir_imagen", "habilidad": "vocabulary", "nivel": "Pre-A1", "edad": [6, 9],
      "etiqueta": "Palabras", "instruccion": "¿Cómo se dice “mochila” en inglés?", "audio": "School bag",
      "opciones": [
        { "visual": "school-bag", "texto": "school bag", "correcta": true },
        { "visual": "chair", "texto": "chair" },
        { "visual": "book", "texto": "book" }
      ],
      "feedback": { "correct": "“School bag” significa “mochila”.", "incorrect": "Es donde guardas tus libros para el cole.", "context": "This is my school bag.", "learnedExpressions": ["School bag"] },
      "unit_id": "primer-vuelo", "objective_id": "school-objects", "stage": ["p12", "p34"], "difficulty": 1, "variant_group": "school-objects", "tags": ["school"]
    },
    {
      "id": "pv-7", "tipo": "elegir_imagen", "habilidad": "vocabulary", "nivel": "Pre-A1", "edad": [6, 9],
      "etiqueta": "Palabras", "instruccion": "¿Cómo se dice “silla” en inglés?", "audio": "Chair",
      "opciones": [
        { "visual": "chair", "texto": "chair", "correcta": true },
        { "visual": "school-bag", "texto": "school bag" },
        { "visual": "pencil", "texto": "pencil" }
      ],
      "feedback": { "correct": "“Chair” significa “silla”.", "incorrect": "Es donde nos sentamos en clase.", "context": "Sit on the chair, please.", "learnedExpressions": ["A chair"] },
      "unit_id": "primer-vuelo", "objective_id": "school-objects", "stage": ["p12", "p34"], "difficulty": 1, "variant_group": "school-objects", "tags": ["school"]
    },
    {
      "id": "pv-8", "tipo": "elegir_imagen", "habilidad": "listening", "nivel": "Pre-A1", "edad": [6, 9],
      "etiqueta": "Escucha", "instruccion": "Escucha y elige.", "audio": "Good night",
      "opciones": [
        { "visual": "good-night", "texto": "good night", "correcta": true },
        { "visual": "good-morning", "texto": "good morning" },
        { "visual": "goodbye", "texto": "goodbye" }
      ],
      "feedback": { "correct": "“Good night” significa “Buenas noches”.", "incorrect": "Es lo que decimos antes de dormir.", "context": "Good night! See you tomorrow.", "learnedExpressions": ["Good night"] },
      "unit_id": "primer-vuelo", "objective_id": "school-greetings", "stage": ["p12", "p34"], "difficulty": 2, "variant_group": "school-greetings", "tags": ["school"]
    },
    {
      "id": "pv-9", "tipo": "elegir_imagen", "habilidad": "listening", "nivel": "Pre-A1", "edad": [6, 9],
      "etiqueta": "Escucha", "instruccion": "Escucha y elige.", "audio": "Good morning",
      "opciones": [
        { "visual": "good-morning", "texto": "good morning", "correcta": true },
        { "visual": "good-night", "texto": "good night" },
        { "visual": "goodbye", "texto": "goodbye" }
      ],
      "feedback": { "correct": "“Good morning” significa “Buenos días”.", "incorrect": "Es el saludo de la mañana.", "context": "Good morning, everyone!", "learnedExpressions": ["Good morning"] },
      "unit_id": "primer-vuelo", "objective_id": "school-greetings", "stage": ["p12", "p34"], "difficulty": 2, "variant_group": "school-greetings", "tags": ["school"]
    },
    {
      "id": "pv-10", "tipo": "elegir_texto", "habilidad": "vocabulary", "nivel": "Pre-A1", "edad": [6, 9],
      "etiqueta": "Palabras", "instruccion": "¿Cuál es la palabra correcta para “silla”?",
      "opciones": [
        { "texto": "chair", "correcta": true },
        { "texto": "book" },
        { "texto": "pencil" }
      ],
      "feedback": { "correct": "“Chair” es “silla”.", "incorrect": "Piensa en dónde te sientas.", "context": "This is a chair.", "learnedExpressions": ["Chair"] },
      "unit_id": "primer-vuelo", "objective_id": "school-objects", "stage": ["p12", "p34"], "difficulty": 2, "variant_group": "school-objects", "tags": ["school"]
    },
    {
      "id": "pv-11", "tipo": "elegir_texto", "habilidad": "listening", "nivel": "Pre-A1", "edad": [6, 9],
      "etiqueta": "Escucha", "instruccion": "Escucha y elige la respuesta.", "audio": "Goodbye",
      "opciones": [
        { "texto": "Hasta luego", "correcta": true },
        { "texto": "Buenos días" },
        { "texto": "Buenas noches" }
      ],
      "feedback": { "correct": "“Goodbye” significa “Hasta luego / Adiós”.", "incorrect": "Es lo que decimos al despedirnos.", "context": "Goodbye! See you soon.", "learnedExpressions": ["Goodbye"] },
      "unit_id": "primer-vuelo", "objective_id": "school-greetings", "stage": ["p12", "p34"], "difficulty": 2, "variant_group": "school-greetings", "tags": ["school"]
    },
    {
      "id": "pv-12", "tipo": "emparejar", "presentacion": "visual", "habilidad": "vocabulary", "nivel": "Pre-A1", "edad": [6, 9],
      "etiqueta": "Relaciona", "instruccion": "Une cada palabra con su dibujo.",
      "pares": [
        { "a": "chair", "b": "chair" },
        { "a": "book", "b": "book" },
        { "a": "pencil", "b": "pencil" }
      ],
      "unit_id": "primer-vuelo", "objective_id": "school-objects", "stage": ["p12", "p34"], "difficulty": 2, "variant_group": "school-objects", "tags": ["school"]
    },
    {
      "id": "pv-13", "tipo": "elegir_texto", "habilidad": "vocabulary", "nivel": "Pre-A1", "edad": [6, 9],
      "etiqueta": "Números", "instruccion": "¿Cómo se dice “tres” en inglés?",
      "opciones": [
        { "texto": "three", "correcta": true },
        { "texto": "two" },
        { "texto": "one" }
      ],
      "feedback": { "correct": "“Three” es “tres”.", "incorrect": "Cuenta: one, two, three…", "context": "I have three pencils.", "learnedExpressions": ["Three"] },
      "unit_id": "primer-vuelo", "objective_id": "school-classroom", "stage": ["p12", "p34"], "difficulty": 1, "variant_group": "school-classroom", "tags": ["school"]
    },
    {
      "id": "pv-14", "tipo": "elegir_texto", "habilidad": "vocabulary", "nivel": "Pre-A1", "edad": [6, 9],
      "etiqueta": "Números", "instruccion": "¿Cómo se dice “uno” en inglés?",
      "opciones": [
        { "texto": "one", "correcta": true },
        { "texto": "three" },
        { "texto": "two" }
      ],
      "feedback": { "correct": "“One” es “uno”.", "incorrect": "Es el primer número: one.", "context": "I have one book.", "learnedExpressions": ["One"] },
      "unit_id": "primer-vuelo", "objective_id": "school-classroom", "stage": ["p12", "p34"], "difficulty": 1, "variant_group": "school-classroom", "tags": ["school"]
    },
    {
      "id": "pv-15", "tipo": "elegir_imagen", "habilidad": "vocabulary", "nivel": "Pre-A1", "edad": [6, 9],
      "etiqueta": "Palabras", "instruccion": "¿Cuál es “goodbye”?", "audio": "Goodbye",
      "opciones": [
        { "visual": "goodbye", "texto": "goodbye", "correcta": true },
        { "visual": "good-morning", "texto": "good morning" },
        { "visual": "good-night", "texto": "good night" }
      ],
      "feedback": { "correct": "“Goodbye” es el saludo de despedida.", "incorrect": "Es lo que decimos al marcharnos.", "context": "Goodbye, teacher!", "learnedExpressions": ["Goodbye"] },
      "unit_id": "primer-vuelo", "objective_id": "school-greetings", "stage": ["p12", "p34"], "difficulty": 1, "variant_group": "school-greetings", "tags": ["school"]
    },
    {
      "id": "pv-16", "tipo": "ordenar", "habilidad": "grammar", "nivel": "A1", "edad": [8, 9],
      "etiqueta": "Ordena la frase", "instruccion": "\"Tengo un libro\"",
      "palabras": ["a", "I", "book", "have"],
      "respuesta": ["I", "have", "a", "book"],
      "unit_id": "primer-vuelo", "objective_id": "school-language", "stage": ["p34"], "difficulty": 3, "variant_group": "school-language", "tags": ["school"]
    },
    {
      "id": "pv-17", "tipo": "ordenar", "habilidad": "grammar", "nivel": "A1", "edad": [8, 9],
      "etiqueta": "Ordena la frase", "instruccion": "\"Este es mi lápiz\"",
      "palabras": ["is", "This", "pencil", "my"],
      "respuesta": ["This", "is", "my", "pencil"],
      "unit_id": "primer-vuelo", "objective_id": "school-language", "stage": ["p34"], "difficulty": 3, "variant_group": "school-language", "tags": ["school"]
    },
    {
      "id": "pv-18", "tipo": "hablar", "habilidad": "speaking", "nivel": "A1", "edad": [8, 9],
      "etiqueta": "A hablar", "instruccion": "Di en voz alta:", "frase": "How are you?",
      "unit_id": "primer-vuelo", "objective_id": "school-greetings", "stage": ["p34"], "difficulty": 2, "variant_group": "school-greetings", "tags": ["school"]
    },
    {
      "id": "pv-19", "tipo": "elegir_texto", "habilidad": "reading", "nivel": "A1", "edad": [8, 9],
      "etiqueta": "Comprensión", "instruccion": "¿Qué significa “Sit down, please”?",
      "opciones": [
        { "texto": "Siéntate, por favor", "correcta": true },
        { "texto": "Ponte de pie" },
        { "texto": "Abre el libro" },
        { "texto": "Silencio, por favor" }
      ],
      "feedback": { "correct": "“Sit down, please” = “Siéntate, por favor”.", "incorrect": "“Sit down” significa sentarse.", "context": "Sit down, please.", "learnedExpressions": ["Sit down, please"] },
      "unit_id": "primer-vuelo", "objective_id": "school-classroom", "stage": ["p34"], "difficulty": 3, "variant_group": "school-classroom", "tags": ["school"]
    },
    {
      "id": "pv-20", "tipo": "elegir_texto", "habilidad": "listening", "nivel": "A1", "edad": [8, 9],
      "etiqueta": "Listening", "instruccion": "Listen and choose the meaning.", "audio": "Open your book.",
      "opciones": [
        { "texto": "Abre el libro", "correcta": true },
        { "texto": "Cierra el libro" },
        { "texto": "Coge el lápiz" },
        { "texto": "Siéntate" }
      ],
      "feedback": { "correct": "“Open your book” = “Abre el libro”.", "incorrect": "“Open” significa abrir.", "context": "Open your book on page five.", "learnedExpressions": ["Open your book"] },
      "unit_id": "primer-vuelo", "objective_id": "school-classroom", "stage": ["p34"], "difficulty": 3, "variant_group": "school-classroom", "tags": ["school"]
    },
    {
      "id": "pv-21", "tipo": "elegir_texto", "habilidad": "vocabulary", "nivel": "Pre-A1", "edad": [6, 9],
      "etiqueta": "Vocabulario", "instruccion": "¿Cómo se dice “mochila” en inglés?", "audio": "backpack",
      "opciones": [ { "texto": "backpack", "correcta": true }, { "texto": "pencil" }, { "texto": "book" }, { "texto": "chair" } ],
      "feedback": { "correct": "“Backpack” es mochila.", "incorrect": "Mochila se dice “backpack”.", "context": "My backpack is blue.", "learnedExpressions": ["backpack"] },
      "unit_id": "primer-vuelo", "objective_id": "school-objects", "stage": ["p12", "p34"], "difficulty": 1, "variant_group": "school-objects", "tags": ["school"]
    },
    {
      "id": "pv-22", "tipo": "elegir_texto", "habilidad": "vocabulary", "nivel": "Pre-A1", "edad": [6, 9],
      "etiqueta": "Vocabulario", "instruccion": "¿Cómo se dice “lápiz” en inglés?", "audio": "pencil",
      "opciones": [ { "texto": "pencil", "correcta": true }, { "texto": "ruler" }, { "texto": "bag" }, { "texto": "desk" } ],
      "feedback": { "correct": "“Pencil” es lápiz.", "incorrect": "Lápiz se dice “pencil”.", "context": "A pencil and a rubber.", "learnedExpressions": ["pencil"] },
      "unit_id": "primer-vuelo", "objective_id": "school-objects", "stage": ["p12", "p34"], "difficulty": 1, "variant_group": "school-objects", "tags": ["school"]
    },
    {
      "id": "pv-23", "tipo": "elegir_texto", "habilidad": "speaking", "nivel": "Pre-A1", "edad": [6, 9],
      "etiqueta": "Saludos", "instruccion": "Tu profe dice “Good morning!”. ¿Qué respondes?", "audio": "Good morning!",
      "opciones": [ { "texto": "Good morning!", "correcta": true }, { "texto": "Goodbye!" }, { "texto": "Thank you!" }, { "texto": "Sorry!" } ],
      "feedback": { "correct": "Respondemos “Good morning!”.", "incorrect": "A “Good morning!” respondemos igual.", "context": "Good morning, teacher!", "learnedExpressions": ["Good morning!"] },
      "unit_id": "primer-vuelo", "objective_id": "school-greetings", "stage": ["p12", "p34"], "difficulty": 1, "variant_group": "school-greetings", "tags": ["school"]
    },
    {
      "id": "pv-24", "tipo": "elegir_texto", "habilidad": "grammar", "nivel": "A1", "edad": [7, 10],
      "etiqueta": "En clase", "instruccion": "Completa: “Can I ___ to the toilet, please?”",
      "opciones": [ { "texto": "go", "correcta": true }, { "texto": "going" }, { "texto": "goes" }, { "texto": "went" } ],
      "feedback": { "correct": "Tras “Can I” usamos el infinitivo: “Can I go…?”.", "incorrect": "Tras “Can I” va el verbo en infinitivo: go.", "context": "Can I go to the toilet, please?", "learnedExpressions": ["Can I go…?"] },
      "unit_id": "primer-vuelo", "objective_id": "school-language", "stage": ["p34"], "difficulty": 2, "variant_group": "school-language", "tags": ["school"]
    },
    {
      "id": "pv-25", "tipo": "elegir_texto", "habilidad": "vocabulary", "nivel": "Pre-A1", "edad": [6, 9],
      "etiqueta": "Vocabulario", "instruccion": "¿Cómo se dice “libro” en inglés?", "audio": "book",
      "opciones": [ { "texto": "book", "correcta": true }, { "texto": "pencil" }, { "texto": "bag" } ],
      "feedback": { "correct": "“Book” es libro.", "incorrect": "Libro se dice “book”.", "context": "Open your book.", "learnedExpressions": ["book"] },
      "unit_id": "primer-vuelo", "objective_id": "school-objects", "stage": ["p12", "p34"], "difficulty": 1, "variant_group": "school-objects", "tags": ["school"]
    },
    {
      "id": "pv-26", "tipo": "elegir_texto", "habilidad": "vocabulary", "nivel": "Pre-A1", "edad": [6, 9],
      "etiqueta": "Vocabulario", "instruccion": "¿Cómo se dice “silla” en inglés?", "audio": "chair",
      "opciones": [ { "texto": "chair", "correcta": true }, { "texto": "table" }, { "texto": "door" } ],
      "feedback": { "correct": "“Chair” es silla.", "incorrect": "Silla se dice “chair”.", "context": "Sit on the chair.", "learnedExpressions": ["chair"] },
      "unit_id": "primer-vuelo", "objective_id": "school-objects", "stage": ["p12", "p34"], "difficulty": 1, "variant_group": "school-objects", "tags": ["school"]
    },
    {
      "id": "pv-27", "tipo": "elegir_texto", "habilidad": "speaking", "nivel": "Pre-A1", "edad": [6, 9],
      "etiqueta": "Saludos", "instruccion": "Alguien dice “Thank you!”. ¿Qué respondes?", "audio": "Thank you!",
      "opciones": [ { "texto": "You're welcome!", "correcta": true }, { "texto": "Good night!" }, { "texto": "Sorry!" }, { "texto": "Hello!" } ],
      "feedback": { "correct": "A “Thank you!” respondemos “You're welcome!”.", "incorrect": "A “Thank you!” → “You're welcome!”.", "context": "— Thank you! — You're welcome!", "learnedExpressions": ["You're welcome!"] },
      "unit_id": "primer-vuelo", "objective_id": "school-greetings", "stage": ["p12", "p34"], "difficulty": 1, "variant_group": "school-greetings", "tags": ["school"]
    },
    {
      "id": "pv-28", "tipo": "elegir_texto", "habilidad": "vocabulary", "nivel": "Pre-A1", "edad": [6, 9],
      "etiqueta": "En clase", "instruccion": "¿Qué significa “Sit down”?", "audio": "Sit down.",
      "opciones": [ { "texto": "Siéntate", "correcta": true }, { "texto": "Levántate" }, { "texto": "Abre el libro" }, { "texto": "Escucha" } ],
      "feedback": { "correct": "“Sit down” = siéntate.", "incorrect": "“Sit down” significa siéntate.", "context": "Sit down, please.", "learnedExpressions": ["Sit down"] },
      "unit_id": "primer-vuelo", "objective_id": "school-classroom", "stage": ["p12", "p34"], "difficulty": 2, "variant_group": "school-classroom", "tags": ["school"]
    },
    {
      "id": "pv-29", "tipo": "ordenar", "habilidad": "grammar", "nivel": "A1", "edad": [7, 10],
      "etiqueta": "Ordena la frase", "instruccion": "“Tengo un lápiz”",
      "palabras": ["a", "have", "I", "pencil"], "respuesta": ["I", "have", "a", "pencil"],
      "unit_id": "primer-vuelo", "objective_id": "school-language", "stage": ["p34"], "difficulty": 2, "variant_group": "school-language", "tags": ["school"]
    },
    {
      "id": "pv-30", "tipo": "elegir_texto", "habilidad": "grammar", "nivel": "A1", "edad": [7, 10],
      "etiqueta": "En clase", "instruccion": "Completa: “This ___ my book.”",
      "opciones": [ { "texto": "is", "correcta": true }, { "texto": "are" }, { "texto": "am" }, { "texto": "be" } ],
      "feedback": { "correct": "Con “this” (singular) usamos “is”: This is my book.", "incorrect": "“This is…” en singular.", "context": "This is my book.", "learnedExpressions": ["This is…"] },
      "unit_id": "primer-vuelo", "objective_id": "school-language", "stage": ["p34"], "difficulty": 2, "variant_group": "school-language", "tags": ["school"]
    }
  ]
});
