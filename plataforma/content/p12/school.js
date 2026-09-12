/* Banco editorial: metadatos explícitos y mecánicas reutilizables. */
ILContent.registerPack({
  "id": "p12-school-core",
  "version": 2,
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
      "id": "school-language",
      "skill": "grammar",
      "literacy_load": "medium",
      "description": "Frases muy sencillas: I have…, This is…",
      "unit_id": "primer-vuelo",
      "stage": [
        "p34"
      ],
      "cefr": "A1",
      "difficulty": 3,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "school"
      ]
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
      ],
      "mechanic": "listen_image",
      "estimated_seconds": 35,
      "hint": "Escucha otra vez y busca el libro.",
      "explanation": "“Book” significa “libro”."
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
      ],
      "mechanic": "listen_image",
      "estimated_seconds": 35,
      "hint": "Busca el objeto que usamos para escribir.",
      "explanation": "“Pencil” significa “lápiz”."
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
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "school-greetings",
      "tags": [
        "school"
      ],
      "mechanic": "listen_text",
      "estimated_seconds": 40,
      "hint": "Es el saludo que usamos por la mañana.",
      "explanation": "“Good morning” significa “Buenos días”."
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
      ],
      "feedback": {
        "correct": "¡Bien hecho!",
        "incorrect": "Míralo con calma y prueba otra vez.",
        "context": "",
        "learnedExpressions": []
      },
      "mechanic": "matching",
      "estimated_seconds": 65,
      "hint": "Míralo con calma y prueba otra vez.",
      "explanation": "¡Bien hecho!"
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
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "school-greetings",
      "tags": [
        "school"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Elige el saludo que usarías con tu teacher.",
      "explanation": "¡Muy bien! Es un saludo sencillo para empezar la clase."
    },
    {
      "id": "pv-6",
      "tipo": "elegir_imagen",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Palabras",
      "instruccion": "¿Cómo se dice “mochila” en inglés?",
      "audio": "School bag",
      "opciones": [
        {
          "visual": "school-bag",
          "texto": "school bag",
          "correcta": true
        },
        {
          "visual": "chair",
          "texto": "chair"
        },
        {
          "visual": "book",
          "texto": "book"
        }
      ],
      "feedback": {
        "correct": "“School bag” significa “mochila”.",
        "incorrect": "Es donde guardas tus libros para el cole.",
        "context": "This is my school bag.",
        "learnedExpressions": [
          "School bag"
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
      ],
      "mechanic": "listen_image",
      "estimated_seconds": 35,
      "hint": "Es donde guardas tus libros para el cole.",
      "explanation": "“School bag” significa “mochila”."
    },
    {
      "id": "pv-7",
      "tipo": "elegir_imagen",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Palabras",
      "instruccion": "¿Cómo se dice “silla” en inglés?",
      "audio": "Chair",
      "opciones": [
        {
          "visual": "chair",
          "texto": "chair",
          "correcta": true
        },
        {
          "visual": "school-bag",
          "texto": "school bag"
        },
        {
          "visual": "pencil",
          "texto": "pencil"
        }
      ],
      "feedback": {
        "correct": "“Chair” significa “silla”.",
        "incorrect": "Es donde nos sentamos en clase.",
        "context": "Sit on the chair, please.",
        "learnedExpressions": [
          "A chair"
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
      ],
      "mechanic": "listen_image",
      "estimated_seconds": 35,
      "hint": "Es donde nos sentamos en clase.",
      "explanation": "“Chair” significa “silla”."
    },
    {
      "id": "pv-8",
      "tipo": "elegir_imagen",
      "habilidad": "listening",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Escucha",
      "instruccion": "Escucha y elige.",
      "audio": "Good night",
      "opciones": [
        {
          "visual": "good-night",
          "texto": "good night",
          "correcta": true
        },
        {
          "visual": "good-morning",
          "texto": "good morning"
        },
        {
          "visual": "goodbye",
          "texto": "goodbye"
        }
      ],
      "feedback": {
        "correct": "“Good night” significa “Buenas noches”.",
        "incorrect": "Es lo que decimos antes de dormir.",
        "context": "Good night! See you tomorrow.",
        "learnedExpressions": [
          "Good night"
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
      ],
      "mechanic": "listen_image",
      "estimated_seconds": 35,
      "hint": "Es lo que decimos antes de dormir.",
      "explanation": "“Good night” significa “Buenas noches”."
    },
    {
      "id": "pv-9",
      "tipo": "elegir_imagen",
      "habilidad": "listening",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Escucha",
      "instruccion": "Escucha y elige.",
      "audio": "Good morning",
      "opciones": [
        {
          "visual": "good-morning",
          "texto": "good morning",
          "correcta": true
        },
        {
          "visual": "good-night",
          "texto": "good night"
        },
        {
          "visual": "goodbye",
          "texto": "goodbye"
        }
      ],
      "feedback": {
        "correct": "“Good morning” significa “Buenos días”.",
        "incorrect": "Es el saludo de la mañana.",
        "context": "Good morning, everyone!",
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
      ],
      "mechanic": "listen_image",
      "estimated_seconds": 35,
      "hint": "Es el saludo de la mañana.",
      "explanation": "“Good morning” significa “Buenos días”."
    },
    {
      "id": "pv-10",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Palabras",
      "instruccion": "¿Cuál es la palabra correcta para “silla”?",
      "opciones": [
        {
          "texto": "chair",
          "correcta": true
        },
        {
          "texto": "book"
        },
        {
          "texto": "pencil"
        }
      ],
      "feedback": {
        "correct": "“Chair” es “silla”.",
        "incorrect": "Piensa en dónde te sientas.",
        "context": "This is a chair.",
        "learnedExpressions": [
          "Chair"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-objects",
      "stage": [
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "school-objects",
      "tags": [
        "school"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Piensa en dónde te sientas.",
      "explanation": "“Chair” es “silla”."
    },
    {
      "id": "pv-11",
      "tipo": "elegir_texto",
      "habilidad": "listening",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Escucha",
      "instruccion": "Escucha y elige la respuesta.",
      "audio": "Goodbye",
      "opciones": [
        {
          "texto": "Hasta luego",
          "correcta": true
        },
        {
          "texto": "Buenos días"
        },
        {
          "texto": "Buenas noches"
        }
      ],
      "feedback": {
        "correct": "“Goodbye” significa “Hasta luego / Adiós”.",
        "incorrect": "Es lo que decimos al despedirnos.",
        "context": "Goodbye! See you soon.",
        "learnedExpressions": [
          "Goodbye"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-greetings",
      "stage": [
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "school-greetings",
      "tags": [
        "school"
      ],
      "mechanic": "listen_text",
      "estimated_seconds": 40,
      "hint": "Es lo que decimos al despedirnos.",
      "explanation": "“Goodbye” significa “Hasta luego / Adiós”."
    },
    {
      "id": "pv-12",
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
          "a": "chair",
          "b": "chair"
        },
        {
          "a": "book",
          "b": "book"
        },
        {
          "a": "pencil",
          "b": "pencil"
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
      ],
      "feedback": {
        "correct": "¡Bien hecho!",
        "incorrect": "Míralo con calma y prueba otra vez.",
        "context": "",
        "learnedExpressions": []
      },
      "mechanic": "matching",
      "estimated_seconds": 65,
      "hint": "Míralo con calma y prueba otra vez.",
      "explanation": "¡Bien hecho!"
    },
    {
      "id": "pv-13",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Números",
      "instruccion": "¿Cómo se dice “tres” en inglés?",
      "opciones": [
        {
          "texto": "three",
          "correcta": true
        },
        {
          "texto": "two"
        },
        {
          "texto": "one"
        }
      ],
      "feedback": {
        "correct": "“Three” es “tres”.",
        "incorrect": "Cuenta: one, two, three…",
        "context": "I have three pencils.",
        "learnedExpressions": [
          "Three"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-classroom",
      "stage": [
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "school-classroom",
      "tags": [
        "school"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Cuenta: one, two, three…",
      "explanation": "“Three” es “tres”."
    },
    {
      "id": "pv-14",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Números",
      "instruccion": "¿Cómo se dice “uno” en inglés?",
      "opciones": [
        {
          "texto": "one",
          "correcta": true
        },
        {
          "texto": "three"
        },
        {
          "texto": "two"
        }
      ],
      "feedback": {
        "correct": "“One” es “uno”.",
        "incorrect": "Es el primer número: one.",
        "context": "I have one book.",
        "learnedExpressions": [
          "One"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-classroom",
      "stage": [
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "school-classroom",
      "tags": [
        "school"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Es el primer número: one.",
      "explanation": "“One” es “uno”."
    },
    {
      "id": "pv-15",
      "tipo": "elegir_imagen",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Palabras",
      "instruccion": "¿Cuál es “goodbye”?",
      "audio": "Goodbye",
      "opciones": [
        {
          "visual": "goodbye",
          "texto": "goodbye",
          "correcta": true
        },
        {
          "visual": "good-morning",
          "texto": "good morning"
        },
        {
          "visual": "good-night",
          "texto": "good night"
        }
      ],
      "feedback": {
        "correct": "“Goodbye” es el saludo de despedida.",
        "incorrect": "Es lo que decimos al marcharnos.",
        "context": "Goodbye, teacher!",
        "learnedExpressions": [
          "Goodbye"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-greetings",
      "stage": [
        "p12",
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "school-greetings",
      "tags": [
        "school"
      ],
      "mechanic": "listen_image",
      "estimated_seconds": 35,
      "hint": "Es lo que decimos al marcharnos.",
      "explanation": "“Goodbye” es el saludo de despedida."
    },
    {
      "id": "pv-16",
      "tipo": "ordenar",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        8,
        9
      ],
      "etiqueta": "Ordena la frase",
      "instruccion": "\"Tengo un libro\"",
      "palabras": [
        "a",
        "I",
        "book",
        "have"
      ],
      "respuesta": [
        "I",
        "have",
        "a",
        "book"
      ],
      "unit_id": "primer-vuelo",
      "objective_id": "school-language",
      "stage": [
        "p34"
      ],
      "difficulty": 3,
      "variant_group": "school-language",
      "tags": [
        "school"
      ],
      "feedback": {
        "correct": "Orden correcto: «I have a book.». En inglés va primero el sujeto y luego el verbo.",
        "incorrect": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
        "context": "I have a book.",
        "learnedExpressions": []
      },
      "mechanic": "sentence_order",
      "estimated_seconds": 60,
      "hint": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
      "explanation": "Orden correcto: «I have a book.». En inglés va primero el sujeto y luego el verbo."
    },
    {
      "id": "pv-17",
      "tipo": "ordenar",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        8,
        9
      ],
      "etiqueta": "Ordena la frase",
      "instruccion": "\"Este es mi lápiz\"",
      "palabras": [
        "is",
        "This",
        "pencil",
        "my"
      ],
      "respuesta": [
        "This",
        "is",
        "my",
        "pencil"
      ],
      "unit_id": "primer-vuelo",
      "objective_id": "school-language",
      "stage": [
        "p34"
      ],
      "difficulty": 3,
      "variant_group": "school-language",
      "tags": [
        "school"
      ],
      "feedback": {
        "correct": "Orden correcto: «This is my pencil.». En inglés va primero el sujeto y luego el verbo.",
        "incorrect": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
        "context": "This is my pencil.",
        "learnedExpressions": []
      },
      "mechanic": "sentence_order",
      "estimated_seconds": 60,
      "hint": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
      "explanation": "Orden correcto: «This is my pencil.». En inglés va primero el sujeto y luego el verbo."
    },
    {
      "id": "pv-18",
      "tipo": "hablar",
      "habilidad": "speaking",
      "nivel": "A1",
      "edad": [
        8,
        9
      ],
      "etiqueta": "A hablar",
      "instruccion": "Di en voz alta:",
      "frase": "How are you?",
      "unit_id": "primer-vuelo",
      "objective_id": "school-greetings",
      "stage": [
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "school-greetings",
      "tags": [
        "school"
      ],
      "mechanic": "speaking",
      "estimated_seconds": 60,
      "assessment": "self_report",
      "hint": "Escucha la frase en partes y repítela.",
      "explanation": "Has practicado cómo decir: How are you?",
      "feedback": {
        "incorrect": "Escucha la frase en partes y repítela.",
        "correct": "Has practicado cómo decir: How are you?"
      }
    },
    {
      "id": "pv-19",
      "tipo": "elegir_texto",
      "habilidad": "reading",
      "nivel": "A1",
      "edad": [
        8,
        9
      ],
      "etiqueta": "Comprensión",
      "instruccion": "¿Qué significa “Sit down, please”?",
      "opciones": [
        {
          "texto": "Siéntate, por favor",
          "correcta": true
        },
        {
          "texto": "Ponte de pie"
        },
        {
          "texto": "Abre el libro"
        },
        {
          "texto": "Silencio, por favor"
        }
      ],
      "feedback": {
        "correct": "“Sit down, please” = “Siéntate, por favor”.",
        "incorrect": "“Sit down” significa sentarse.",
        "context": "Sit down, please.",
        "learnedExpressions": [
          "Sit down, please"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-classroom",
      "stage": [
        "p34"
      ],
      "difficulty": 3,
      "variant_group": "school-classroom",
      "tags": [
        "school"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "“Sit down” significa sentarse.",
      "explanation": "“Sit down, please” = “Siéntate, por favor”."
    },
    {
      "id": "pv-20",
      "tipo": "elegir_texto",
      "habilidad": "listening",
      "nivel": "A1",
      "edad": [
        8,
        9
      ],
      "etiqueta": "Listening",
      "instruccion": "Listen and choose the meaning.",
      "audio": "Open your book.",
      "opciones": [
        {
          "texto": "Abre el libro",
          "correcta": true
        },
        {
          "texto": "Cierra el libro"
        },
        {
          "texto": "Coge el lápiz"
        },
        {
          "texto": "Siéntate"
        }
      ],
      "feedback": {
        "correct": "“Open your book” = “Abre el libro”.",
        "incorrect": "“Open” significa abrir.",
        "context": "Open your book on page five.",
        "learnedExpressions": [
          "Open your book"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-classroom",
      "stage": [
        "p34"
      ],
      "difficulty": 3,
      "variant_group": "school-classroom",
      "tags": [
        "school"
      ],
      "mechanic": "listen_text",
      "estimated_seconds": 40,
      "hint": "“Open” significa abrir.",
      "explanation": "“Open your book” = “Abre el libro”."
    },
    {
      "id": "pv-21",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “mochila” en inglés?",
      "audio": "backpack",
      "opciones": [
        {
          "texto": "backpack",
          "correcta": true
        },
        {
          "texto": "pencil"
        },
        {
          "texto": "book"
        },
        {
          "texto": "chair"
        }
      ],
      "feedback": {
        "correct": "“Backpack” es mochila.",
        "incorrect": "Mochila se dice “backpack”.",
        "context": "My backpack is blue.",
        "learnedExpressions": [
          "backpack"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-objects",
      "stage": [
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "school-objects",
      "tags": [
        "school"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Mochila se dice “backpack”.",
      "explanation": "“Backpack” es mochila."
    },
    {
      "id": "pv-22",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “lápiz” en inglés?",
      "audio": "pencil",
      "opciones": [
        {
          "texto": "pencil",
          "correcta": true
        },
        {
          "texto": "ruler"
        },
        {
          "texto": "bag"
        },
        {
          "texto": "desk"
        }
      ],
      "feedback": {
        "correct": "“Pencil” es lápiz.",
        "incorrect": "Lápiz se dice “pencil”.",
        "context": "A pencil and a rubber.",
        "learnedExpressions": [
          "pencil"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-objects",
      "stage": [
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "school-objects",
      "tags": [
        "school"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Lápiz se dice “pencil”.",
      "explanation": "“Pencil” es lápiz."
    },
    {
      "id": "pv-23",
      "tipo": "elegir_texto",
      "habilidad": "speaking",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Saludos",
      "instruccion": "Tu profe dice “Good morning!”. ¿Qué respondes?",
      "audio": "Good morning!",
      "opciones": [
        {
          "texto": "Good morning!",
          "correcta": true
        },
        {
          "texto": "Goodbye!"
        },
        {
          "texto": "Thank you!"
        },
        {
          "texto": "Sorry!"
        }
      ],
      "feedback": {
        "correct": "Respondemos “Good morning!”.",
        "incorrect": "A “Good morning!” respondemos igual.",
        "context": "Good morning, teacher!",
        "learnedExpressions": [
          "Good morning!"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-greetings",
      "stage": [
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "school-greetings",
      "tags": [
        "school"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "A “Good morning!” respondemos igual.",
      "explanation": "Respondemos “Good morning!”."
    },
    {
      "id": "pv-24",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        7,
        10
      ],
      "etiqueta": "En clase",
      "instruccion": "Completa: “Can I ___ to the toilet, please?”",
      "opciones": [
        {
          "texto": "go",
          "correcta": true
        },
        {
          "texto": "going"
        },
        {
          "texto": "goes"
        },
        {
          "texto": "went"
        }
      ],
      "feedback": {
        "correct": "Tras “Can I” usamos el infinitivo: “Can I go…?”.",
        "incorrect": "Tras “Can I” va el verbo en infinitivo: go.",
        "context": "Can I go to the toilet, please?",
        "learnedExpressions": [
          "Can I go…?"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-language",
      "stage": [
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "school-language",
      "tags": [
        "school"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Tras “Can I” va el verbo en infinitivo: go.",
      "explanation": "Tras “Can I” usamos el infinitivo: “Can I go…?”."
    },
    {
      "id": "pv-25",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “libro” en inglés?",
      "audio": "book",
      "opciones": [
        {
          "texto": "book",
          "correcta": true
        },
        {
          "texto": "pencil"
        },
        {
          "texto": "bag"
        }
      ],
      "feedback": {
        "correct": "“Book” es libro.",
        "incorrect": "Libro se dice “book”.",
        "context": "Open your book.",
        "learnedExpressions": [
          "book"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-objects",
      "stage": [
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "school-objects",
      "tags": [
        "school"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Libro se dice “book”.",
      "explanation": "“Book” es libro."
    },
    {
      "id": "pv-26",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “silla” en inglés?",
      "audio": "chair",
      "opciones": [
        {
          "texto": "chair",
          "correcta": true
        },
        {
          "texto": "table"
        },
        {
          "texto": "door"
        }
      ],
      "feedback": {
        "correct": "“Chair” es silla.",
        "incorrect": "Silla se dice “chair”.",
        "context": "Sit on the chair.",
        "learnedExpressions": [
          "chair"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-objects",
      "stage": [
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "school-objects",
      "tags": [
        "school"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Silla se dice “chair”.",
      "explanation": "“Chair” es silla."
    },
    {
      "id": "pv-27",
      "tipo": "elegir_texto",
      "habilidad": "speaking",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Saludos",
      "instruccion": "Alguien dice “Thank you!”. ¿Qué respondes?",
      "audio": "Thank you!",
      "opciones": [
        {
          "texto": "You're welcome!",
          "correcta": true
        },
        {
          "texto": "Good night!"
        },
        {
          "texto": "Sorry!"
        },
        {
          "texto": "Hello!"
        }
      ],
      "feedback": {
        "correct": "A “Thank you!” respondemos “You're welcome!”.",
        "incorrect": "A “Thank you!” → “You're welcome!”.",
        "context": "— Thank you! — You're welcome!",
        "learnedExpressions": [
          "You're welcome!"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-greetings",
      "stage": [
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "school-greetings",
      "tags": [
        "school"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "A “Thank you!” → “You're welcome!”.",
      "explanation": "A “Thank you!” respondemos “You're welcome!”."
    },
    {
      "id": "pv-28",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "En clase",
      "instruccion": "¿Qué significa “Sit down”?",
      "audio": "Sit down.",
      "opciones": [
        {
          "texto": "Siéntate",
          "correcta": true
        },
        {
          "texto": "Levántate"
        },
        {
          "texto": "Abre el libro"
        },
        {
          "texto": "Escucha"
        }
      ],
      "feedback": {
        "correct": "“Sit down” = siéntate.",
        "incorrect": "“Sit down” significa siéntate.",
        "context": "Sit down, please.",
        "learnedExpressions": [
          "Sit down"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-classroom",
      "stage": [
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "school-classroom",
      "tags": [
        "school"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "“Sit down” significa siéntate.",
      "explanation": "“Sit down” = siéntate."
    },
    {
      "id": "pv-29",
      "tipo": "ordenar",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        7,
        10
      ],
      "etiqueta": "Ordena la frase",
      "instruccion": "“Tengo un lápiz”",
      "palabras": [
        "a",
        "have",
        "I",
        "pencil"
      ],
      "respuesta": [
        "I",
        "have",
        "a",
        "pencil"
      ],
      "unit_id": "primer-vuelo",
      "objective_id": "school-language",
      "stage": [
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "school-language",
      "tags": [
        "school"
      ],
      "feedback": {
        "correct": "Orden correcto: «I have a pencil.». En inglés va primero el sujeto y luego el verbo.",
        "incorrect": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
        "context": "I have a pencil.",
        "learnedExpressions": []
      },
      "mechanic": "sentence_order",
      "estimated_seconds": 60,
      "hint": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
      "explanation": "Orden correcto: «I have a pencil.». En inglés va primero el sujeto y luego el verbo."
    },
    {
      "id": "pv-30",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        7,
        10
      ],
      "etiqueta": "En clase",
      "instruccion": "Completa: “This ___ my book.”",
      "opciones": [
        {
          "texto": "is",
          "correcta": true
        },
        {
          "texto": "are"
        },
        {
          "texto": "am"
        },
        {
          "texto": "be"
        }
      ],
      "feedback": {
        "correct": "Con “this” (singular) usamos “is”: This is my book.",
        "incorrect": "“This is…” en singular.",
        "context": "This is my book.",
        "learnedExpressions": [
          "This is…"
        ]
      },
      "unit_id": "primer-vuelo",
      "objective_id": "school-language",
      "stage": [
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "school-language",
      "tags": [
        "school"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "“This is…” en singular.",
      "explanation": "Con “this” (singular) usamos “is”: This is my book."
    },
    {
      "id": "school-name-chair",
      "unit_id": "primer-vuelo",
      "objective_id": "school-objects",
      "tipo": "imagen_palabra",
      "mechanic": "image_word",
      "stage": [
        "p12",
        "p34"
      ],
      "edad": [
        5,
        9
      ],
      "nivel": "Pre-A1",
      "habilidad": "vocabulary",
      "difficulty": 2,
      "estimated_seconds": 40,
      "instruccion": "Mira y elige la palabra.",
      "instructions": {
        "p12": "Mira y elige la palabra.",
        "p34": "Mira y elige la palabra."
      },
      "hint": "Mira el objeto donde te sientas.",
      "explanation": "Chair es silla.",
      "feedback": {
        "incorrect": "Mira el objeto donde te sientas.",
        "correct": "Chair es silla.",
        "correctAnswer": "Chair es silla."
      },
      "variant_group": "school-objects-school-name-chair",
      "stimulus_visual": "chair",
      "opciones": [
        {
          "texto": "chair",
          "correcta": true
        },
        {
          "texto": "book",
          "correcta": false
        },
        {
          "texto": "pencil",
          "correcta": false
        }
      ]
    },
    {
      "id": "school-find-bag",
      "unit_id": "primer-vuelo",
      "objective_id": "school-objects",
      "tipo": "palabra_imagen",
      "mechanic": "word_image",
      "stage": [
        "p12",
        "p34"
      ],
      "edad": [
        5,
        9
      ],
      "nivel": "Pre-A1",
      "habilidad": "vocabulary",
      "difficulty": 2,
      "estimated_seconds": 35,
      "instruccion": "Busca la imagen.",
      "instructions": {
        "p12": "Busca la imagen.",
        "p34": "Busca la imagen."
      },
      "hint": "La llevas a la espalda.",
      "explanation": "School bag es la mochila del cole.",
      "feedback": {
        "incorrect": "La llevas a la espalda.",
        "correct": "School bag es la mochila del cole.",
        "correctAnswer": "School bag es la mochila del cole."
      },
      "variant_group": "school-objects-school-find-bag",
      "prompt": "school bag",
      "opciones": [
        {
          "texto": "school bag",
          "correcta": true,
          "visual": "school bag"
        },
        {
          "texto": "chair",
          "correcta": false,
          "visual": "chair"
        },
        {
          "texto": "book",
          "correcta": false,
          "visual": "book"
        }
      ]
    },
    {
      "id": "school-build-greeting",
      "unit_id": "primer-vuelo",
      "objective_id": "school-language",
      "tipo": "ordenar",
      "mechanic": "sentence_order",
      "stage": [
        "p12",
        "p34"
      ],
      "edad": [
        5,
        9
      ],
      "nivel": "Pre-A1",
      "habilidad": "speaking",
      "difficulty": 2,
      "estimated_seconds": 60,
      "instruccion": "Forma la frase.",
      "instructions": {
        "p12": "Forma la frase.",
        "p34": "Forma la frase."
      },
      "hint": "Empieza con I.",
      "explanation": "I am Sam significa Me llamo Sam.",
      "feedback": {
        "incorrect": "Empieza con I.",
        "correct": "I am Sam significa Me llamo Sam.",
        "correctAnswer": "I am Sam significa Me llamo Sam."
      },
      "variant_group": "school-language-school-build-greeting",
      "palabras": [
        "I",
        "am",
        "Sam."
      ],
      "respuesta": [
        "I",
        "am",
        "Sam."
      ],
      "audio": "I am Sam."
    },
    {
      "id": "school-spell-book",
      "unit_id": "primer-vuelo",
      "objective_id": "school-objects",
      "tipo": "deletrear",
      "mechanic": "spelling",
      "stage": [
        "p34"
      ],
      "edad": [
        8,
        9
      ],
      "nivel": "Pre-A1",
      "habilidad": "writing",
      "difficulty": 2,
      "estimated_seconds": 55,
      "instruccion": "Completa las letras.",
      "instructions": {
        "p34": "Completa las letras."
      },
      "hint": "En el centro hay dos letras iguales.",
      "explanation": "Book se escribe con dos oes: b-o-o-k.",
      "feedback": {
        "incorrect": "En el centro hay dos letras iguales.",
        "correct": "Book se escribe con dos oes: b-o-o-k.",
        "correctAnswer": "Book se escribe con dos oes: b-o-o-k."
      },
      "variant_group": "school-objects-school-spell-book",
      "stimulus_visual": "book",
      "mask": "b__k",
      "respuesta": "book"
    },
    {
      "id": "school-order-pencil",
      "unit_id": "primer-vuelo",
      "objective_id": "school-objects",
      "tipo": "ordenar_palabra",
      "mechanic": "word_order",
      "stage": [
        "p34"
      ],
      "edad": [
        8,
        9
      ],
      "nivel": "A1",
      "habilidad": "writing",
      "difficulty": 2,
      "estimated_seconds": 50,
      "instruccion": "Ordena las letras.",
      "instructions": {
        "p34": "Ordena las letras."
      },
      "hint": "Empieza por pen-.",
      "explanation": "Pencil significa lápiz; termina en -cil.",
      "feedback": {
        "incorrect": "Empieza por pen-.",
        "correct": "Pencil significa lápiz; termina en -cil.",
        "correctAnswer": "Pencil significa lápiz; termina en -cil."
      },
      "variant_group": "school-objects-school-order-pencil",
      "prompt": "Forma la palabra inglesa para lápiz.",
      "palabras": [
        "p",
        "e",
        "n",
        "c",
        "i",
        "l"
      ],
      "respuesta": [
        "p",
        "e",
        "n",
        "c",
        "i",
        "l"
      ]
    },
    {
      "id": "school-sort-objects",
      "unit_id": "primer-vuelo",
      "objective_id": "school-classroom",
      "tipo": "clasificar",
      "mechanic": "classification",
      "stage": [
        "p12",
        "p34"
      ],
      "edad": [
        5,
        9
      ],
      "nivel": "Pre-A1",
      "habilidad": "vocabulary",
      "difficulty": 2,
      "estimated_seconds": 75,
      "instruccion": "Agrupa los elementos.",
      "instructions": {
        "p12": "Agrupa los elementos.",
        "p34": "Agrupa los elementos."
      },
      "hint": "Piensa en lo que haces con cada objeto.",
      "explanation": "Leemos un book y nos sentamos en una chair.",
      "feedback": {
        "incorrect": "Piensa en lo que haces con cada objeto.",
        "correct": "Leemos un book y nos sentamos en una chair.",
        "correctAnswer": "Leemos un book y nos sentamos en una chair."
      },
      "variant_group": "school-classroom-school-sort-objects",
      "categories": [
        "Para leer",
        "Para sentarse"
      ],
      "items": [
        {
          "text": "book",
          "visual": "book",
          "category": "Para leer"
        },
        {
          "text": "chair",
          "visual": "chair",
          "category": "Para sentarse"
        }
      ]
    },
    {
      "id": "school-repeat-help",
      "unit_id": "primer-vuelo",
      "objective_id": "school-greetings",
      "tipo": "hablar",
      "mechanic": "speaking",
      "stage": [
        "p12",
        "p34"
      ],
      "edad": [
        5,
        9
      ],
      "nivel": "Pre-A1",
      "habilidad": "speaking",
      "difficulty": 2,
      "estimated_seconds": 60,
      "instruccion": "Escucha y repite.",
      "instructions": {
        "p12": "Escucha y repite.",
        "p34": "Escucha y repite."
      },
      "hint": "Escucha la frase en partes.",
      "explanation": "Has practicado cómo pedir ayuda con please.",
      "feedback": {
        "incorrect": "Escucha la frase en partes.",
        "correct": "Has practicado cómo pedir ayuda con please.",
        "correctAnswer": "Has practicado cómo pedir ayuda con please."
      },
      "variant_group": "school-greetings-school-repeat-help",
      "frase": "Help me, please.",
      "assessment": "self_report"
    },
    {
      "id": "school-read-desk",
      "unit_id": "primer-vuelo",
      "objective_id": "school-classroom",
      "tipo": "comprension",
      "mechanic": "reading",
      "stage": [
        "p34"
      ],
      "edad": [
        8,
        9
      ],
      "nivel": "A1",
      "habilidad": "reading",
      "difficulty": 2,
      "estimated_seconds": 100,
      "instruccion": "Lee y responde.",
      "instructions": {
        "p34": "Lee y responde."
      },
      "hint": "Busca bag y lee las palabras que vienen después.",
      "explanation": "Under the chair significa debajo de la silla.",
      "feedback": {
        "incorrect": "Busca bag y lee las palabras que vienen después.",
        "correct": "Under the chair significa debajo de la silla.",
        "correctAnswer": "Under the chair significa debajo de la silla."
      },
      "variant_group": "school-classroom-school-read-desk",
      "estimulo": {
        "texto": "My name is Tom. My book is on the desk. My bag is under the chair."
      },
      "preguntas": [
        {
          "pregunta": "Where is the bag?",
          "opciones": [
            {
              "texto": "Under the chair.",
              "correcta": true
            },
            {
              "texto": "On the desk.",
              "correcta": false
            },
            {
              "texto": "In the book.",
              "correcta": false
            }
          ]
        }
      ]
    },
    {
      "id": "school-dialogue-name",
      "unit_id": "primer-vuelo",
      "objective_id": "school-greetings",
      "tipo": "dialogo",
      "mechanic": "dialogue",
      "stage": [
        "p34"
      ],
      "edad": [
        8,
        9
      ],
      "nivel": "A1",
      "habilidad": "speaking",
      "difficulty": 2,
      "estimated_seconds": 80,
      "instruccion": "Completa el diálogo.",
      "instructions": {
        "p34": "Completa el diálogo."
      },
      "hint": "La pregunta pide tu nombre.",
      "explanation": "My name is… sirve para decir cómo te llamas.",
      "feedback": {
        "incorrect": "La pregunta pide tu nombre.",
        "correct": "My name is… sirve para decir cómo te llamas.",
        "correctAnswer": "My name is… sirve para decir cómo te llamas."
      },
      "variant_group": "school-greetings-school-dialogue-name",
      "dialogue": [
        "Alex: What is your name?",
        "Sam: My ___ is Sam."
      ],
      "respuesta": "name"
    }
  ]
});
