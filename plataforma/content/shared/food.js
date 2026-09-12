/* Banco editorial: metadatos explícitos y mecánicas reutilizables. */
ILContent.registerPack({
  "id": "primary-food",
  "version": 2,
  "stages": [
    "p12",
    "p34",
    "p56"
  ],
  "topic": "food",
  "units": [
    {
      "id": "la-comida",
      "titulo": "Food I like",
      "visual": "food",
      "nivel": "Pre-A1",
      "etapa": "Primaria",
      "descripcion": "Aprende alimentos y a decir lo que te gusta.",
      "tema": {
        "icono": "🍎",
        "color": "#1E9C74"
      },
      "stage": [
        "p12",
        "p34",
        "p56"
      ],
      "topic": "food",
      "objective_ids": [
        "food-words",
        "food-likes",
        "food-reading"
      ]
    }
  ],
  "objectives": [
    {
      "id": "food-words",
      "skill": "vocabulary",
      "literacy_load": "low",
      "description": "Reconocer alimentos frecuentes.",
      "unit_id": "la-comida",
      "stage": [
        "p12",
        "p34",
        "p56"
      ],
      "cefr": "Pre-A1",
      "difficulty": 2,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "food"
      ]
    },
    {
      "id": "food-likes",
      "skill": "grammar",
      "literacy_load": "medium",
      "description": "Expresar gustos sencillos sobre comida.",
      "unit_id": "la-comida",
      "stage": [
        "p12",
        "p34",
        "p56"
      ],
      "cefr": "Pre-A1",
      "difficulty": 2,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "food"
      ]
    },
    {
      "id": "food-reading",
      "skill": "reading",
      "literacy_load": "medium",
      "description": "Comprender gustos en un texto breve.",
      "unit_id": "la-comida",
      "stage": [
        "p12",
        "p34",
        "p56"
      ],
      "cefr": "Pre-A1",
      "difficulty": 2,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "food"
      ]
    }
  ],
  "exercises": [
    {
      "id": "lc-1",
      "tipo": "elegir_imagen",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “manzana” en inglés?",
      "audio": "Which one is an apple?",
      "opciones": [
        {
          "visual": "apple",
          "texto": "apple",
          "correcta": true
        },
        {
          "visual": "banana",
          "texto": "banana"
        },
        {
          "visual": "milk",
          "texto": "milk"
        },
        {
          "visual": "bread",
          "texto": "bread"
        }
      ],
      "unit_id": "la-comida",
      "objective_id": "food-words",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 1,
      "variant_group": "food-words",
      "tags": [
        "food"
      ],
      "feedback": {
        "correct": "¡Correcto! La respuesta es «apple».",
        "incorrect": "Míralo con calma y prueba otra vez.",
        "context": "apple",
        "learnedExpressions": []
      },
      "mechanic": "listen_image",
      "estimated_seconds": 35,
      "hint": "Míralo con calma y prueba otra vez.",
      "explanation": "¡Correcto! La respuesta es «apple»."
    },
    {
      "id": "lc-2",
      "tipo": "elegir_imagen",
      "habilidad": "listening",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Escucha y elige",
      "instruccion": "Escucha y elige: banana",
      "audio": "Banana",
      "opciones": [
        {
          "visual": "banana",
          "texto": "banana",
          "correcta": true
        },
        {
          "visual": "apple",
          "texto": "apple"
        },
        {
          "visual": "cheese",
          "texto": "cheese"
        },
        {
          "visual": "egg",
          "texto": "egg"
        }
      ],
      "unit_id": "la-comida",
      "objective_id": "food-words",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 1,
      "variant_group": "food-words",
      "tags": [
        "food"
      ],
      "feedback": {
        "correct": "¡Correcto! La respuesta es «banana».",
        "incorrect": "Míralo con calma y prueba otra vez.",
        "context": "banana",
        "learnedExpressions": []
      },
      "mechanic": "listen_image",
      "estimated_seconds": 35,
      "hint": "Míralo con calma y prueba otra vez.",
      "explanation": "¡Correcto! La respuesta es «banana»."
    },
    {
      "id": "lc-3",
      "tipo": "completar",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        8,
        11
      ],
      "etiqueta": "Gramática",
      "instruccion": "Completa: \"I ___ pizza.\" (me gusta)",
      "opciones": [
        {
          "texto": "like",
          "correcta": true
        },
        {
          "texto": "likes"
        },
        {
          "texto": "liking"
        }
      ],
      "explicacion": "Con \"I\" usamos \"like\": I like pizza.",
      "unit_id": "la-comida",
      "objective_id": "food-likes",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "food-likes",
      "tags": [
        "food"
      ],
      "feedback": {
        "correct": "¡Correcto! La respuesta es «like».",
        "incorrect": "Míralo con calma y prueba otra vez.",
        "context": "like",
        "learnedExpressions": []
      },
      "mechanic": "gap_fill",
      "estimated_seconds": 55,
      "hint": "Míralo con calma y prueba otra vez.",
      "explanation": "Con \"I\" usamos \"like\": I like pizza."
    },
    {
      "id": "lc-4",
      "tipo": "ordenar",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        8,
        11
      ],
      "etiqueta": "Ordena la frase",
      "instruccion": "\"Me gustan las manzanas\"",
      "palabras": [
        "apples",
        "I",
        "like"
      ],
      "respuesta": [
        "I",
        "like",
        "apples"
      ],
      "unit_id": "la-comida",
      "objective_id": "food-likes",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "food-likes",
      "tags": [
        "food"
      ],
      "feedback": {
        "correct": "Orden correcto: «I like apples.». En inglés va primero el sujeto y luego el verbo.",
        "incorrect": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
        "context": "I like apples.",
        "learnedExpressions": []
      },
      "mechanic": "sentence_order",
      "estimated_seconds": 60,
      "hint": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
      "explanation": "Orden correcto: «I like apples.». En inglés va primero el sujeto y luego el verbo."
    },
    {
      "id": "lc-5",
      "tipo": "hablar",
      "habilidad": "speaking",
      "nivel": "A1",
      "edad": [
        7,
        11
      ],
      "etiqueta": "A hablar",
      "instruccion": "Di en voz alta:",
      "frase": "I like apples and bananas.",
      "unit_id": "la-comida",
      "objective_id": "food-likes",
      "stage": [
        "p12",
        "p34",
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "food-likes",
      "tags": [
        "food"
      ],
      "mechanic": "speaking",
      "estimated_seconds": 60,
      "assessment": "self_report",
      "hint": "Escucha la frase en partes y repítela.",
      "explanation": "Has practicado cómo decir: I like apples and bananas.",
      "feedback": {
        "incorrect": "Escucha la frase en partes y repítela.",
        "correct": "Has practicado cómo decir: I like apples and bananas."
      }
    },
    {
      "id": "lc-6",
      "tipo": "emparejar",
      "presentacion": "visual",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        10
      ],
      "etiqueta": "Relaciona",
      "instruccion": "Une cada palabra con su dibujo",
      "pares": [
        {
          "a": "apple",
          "b": "apple"
        },
        {
          "a": "banana",
          "b": "banana"
        },
        {
          "a": "milk",
          "b": "milk"
        },
        {
          "a": "bread",
          "b": "bread"
        }
      ],
      "unit_id": "la-comida",
      "objective_id": "food-words",
      "stage": [
        "p12",
        "p34",
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "food-words",
      "tags": [
        "food"
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
      "id": "lc-7",
      "tipo": "comprension",
      "habilidad": "reading",
      "nivel": "A1",
      "edad": [
        8,
        11
      ],
      "etiqueta": "Lee y responde",
      "instruccion": "Lee y responde:",
      "estimulo": {
        "texto": "Tom likes apples and milk. He doesn't like bread."
      },
      "preguntas": [
        {
          "pregunta": "Does Tom like apples?",
          "opciones": [
            {
              "texto": "Yes",
              "correcta": true
            },
            {
              "texto": "No"
            }
          ]
        },
        {
          "pregunta": "Does Tom like bread?",
          "opciones": [
            {
              "texto": "Yes"
            },
            {
              "texto": "No",
              "correcta": true
            }
          ]
        }
      ],
      "unit_id": "la-comida",
      "objective_id": "food-reading",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 4,
      "variant_group": "food-reading",
      "tags": [
        "food"
      ],
      "feedback": {
        "correct": "¡Bien hecho!",
        "incorrect": "Míralo con calma y prueba otra vez.",
        "context": "",
        "learnedExpressions": []
      },
      "mechanic": "reading",
      "estimated_seconds": 100,
      "hint": "Míralo con calma y prueba otra vez.",
      "explanation": "¡Bien hecho!"
    },
    {
      "id": "lc-8",
      "tipo": "elegir_imagen",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “queso” en inglés?",
      "audio": "Cheese",
      "opciones": [
        {
          "visual": "cheese",
          "texto": "cheese",
          "correcta": true
        },
        {
          "visual": "milk",
          "texto": "milk"
        },
        {
          "visual": "egg",
          "texto": "egg"
        }
      ],
      "feedback": {
        "correct": "“Cheese” significa “queso”.",
        "incorrect": "Es amarillo y se hace con leche.",
        "context": "I like cheese.",
        "learnedExpressions": [
          "Cheese"
        ]
      },
      "unit_id": "la-comida",
      "objective_id": "food-words",
      "stage": [
        "p12",
        "p34",
        "p56"
      ],
      "difficulty": 1,
      "variant_group": "food-words",
      "tags": [
        "food"
      ],
      "mechanic": "listen_image",
      "estimated_seconds": 35,
      "hint": "Es amarillo y se hace con leche.",
      "explanation": "“Cheese” significa “queso”."
    },
    {
      "id": "lc-9",
      "tipo": "elegir_imagen",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “pan” en inglés?",
      "audio": "Bread",
      "opciones": [
        {
          "visual": "bread",
          "texto": "bread",
          "correcta": true
        },
        {
          "visual": "apple",
          "texto": "apple"
        },
        {
          "visual": "banana",
          "texto": "banana"
        }
      ],
      "feedback": {
        "correct": "“Bread” significa “pan”.",
        "incorrect": "Es lo que usamos para hacer un sándwich.",
        "context": "I eat bread for breakfast.",
        "learnedExpressions": [
          "Bread"
        ]
      },
      "unit_id": "la-comida",
      "objective_id": "food-words",
      "stage": [
        "p12",
        "p34",
        "p56"
      ],
      "difficulty": 1,
      "variant_group": "food-words",
      "tags": [
        "food"
      ],
      "mechanic": "listen_image",
      "estimated_seconds": 35,
      "hint": "Es lo que usamos para hacer un sándwich.",
      "explanation": "“Bread” significa “pan”."
    },
    {
      "id": "lc-10",
      "tipo": "elegir_imagen",
      "habilidad": "listening",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Escucha y elige",
      "instruccion": "Escucha y elige.",
      "audio": "Egg",
      "opciones": [
        {
          "visual": "egg",
          "texto": "egg",
          "correcta": true
        },
        {
          "visual": "cheese",
          "texto": "cheese"
        },
        {
          "visual": "milk",
          "texto": "milk"
        }
      ],
      "feedback": {
        "correct": "“Egg” significa “huevo”.",
        "incorrect": "Escucha otra vez: es lo que ponen las gallinas.",
        "context": "I have an egg for breakfast.",
        "learnedExpressions": [
          "Egg"
        ]
      },
      "unit_id": "la-comida",
      "objective_id": "food-words",
      "stage": [
        "p12",
        "p34",
        "p56"
      ],
      "difficulty": 1,
      "variant_group": "food-words",
      "tags": [
        "food"
      ],
      "mechanic": "listen_image",
      "estimated_seconds": 35,
      "hint": "Escucha otra vez: es lo que ponen las gallinas.",
      "explanation": "“Egg” significa “huevo”."
    },
    {
      "id": "lc-11",
      "tipo": "elegir_imagen",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “leche” en inglés?",
      "audio": "Milk",
      "opciones": [
        {
          "visual": "milk",
          "texto": "milk",
          "correcta": true
        },
        {
          "visual": "bread",
          "texto": "bread"
        },
        {
          "visual": "apple",
          "texto": "apple"
        }
      ],
      "feedback": {
        "correct": "“Milk” significa “leche”.",
        "incorrect": "Es lo blanco que bebemos en el desayuno.",
        "context": "I drink milk every morning.",
        "learnedExpressions": [
          "Milk"
        ]
      },
      "unit_id": "la-comida",
      "objective_id": "food-words",
      "stage": [
        "p12",
        "p34",
        "p56"
      ],
      "difficulty": 1,
      "variant_group": "food-words",
      "tags": [
        "food"
      ],
      "mechanic": "listen_image",
      "estimated_seconds": 35,
      "hint": "Es lo blanco que bebemos en el desayuno.",
      "explanation": "“Milk” significa “leche”."
    },
    {
      "id": "lc-12",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Palabras",
      "instruccion": "¿Cuál es la palabra correcta para “manzana”?",
      "opciones": [
        {
          "texto": "apple",
          "correcta": true
        },
        {
          "texto": "bread"
        },
        {
          "texto": "milk"
        }
      ],
      "feedback": {
        "correct": "“Apple” es “manzana”.",
        "incorrect": "Es una fruta roja o verde.",
        "context": "An apple a day.",
        "learnedExpressions": [
          "Apple"
        ]
      },
      "unit_id": "la-comida",
      "objective_id": "food-words",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "food-words",
      "tags": [
        "food"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Es una fruta roja o verde.",
      "explanation": "“Apple” es “manzana”."
    },
    {
      "id": "lc-13",
      "tipo": "elegir_texto",
      "habilidad": "reading",
      "nivel": "A1",
      "edad": [
        8,
        11
      ],
      "etiqueta": "Comprensión",
      "instruccion": "¿Qué significa “I don't like eggs”?",
      "instructions": {
        "p56": "What does “I don't like eggs” mean?"
      },
      "opciones": [
        {
          "texto": "No me gustan los huevos",
          "correcta": true
        },
        {
          "texto": "Me gustan los huevos"
        },
        {
          "texto": "Quiero un huevo"
        },
        {
          "texto": "No hay huevos"
        }
      ],
      "feedback": {
        "correct": "“I don't like…” = “No me gusta(n)…”.",
        "incorrect": "“Don't like” es lo contrario de “like”.",
        "context": "I don't like eggs, but I like cheese.",
        "learnedExpressions": [
          "I don't like…"
        ]
      },
      "unit_id": "la-comida",
      "objective_id": "food-reading",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "food-reading",
      "tags": [
        "food"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "“Don't like” es lo contrario de “like”.",
      "explanation": "“I don't like…” = “No me gusta(n)…”."
    },
    {
      "id": "lc-14",
      "tipo": "completar",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        8,
        11
      ],
      "etiqueta": "Gramática",
      "instruccion": "Completa: “I ___ like fish.” (no me gusta)",
      "opciones": [
        {
          "texto": "don't",
          "correcta": true
        },
        {
          "texto": "doesn't"
        },
        {
          "texto": "not"
        }
      ],
      "explicacion": "Con “I” la forma negativa es “don't”: I don't like fish.",
      "feedback": {
        "correct": "“I don't like fish.” Con I usamos don't.",
        "incorrect": "Con I/you/we usamos “don't”, no “doesn't”.",
        "context": "I don't like fish.",
        "learnedExpressions": [
          "I don't like…"
        ]
      },
      "unit_id": "la-comida",
      "objective_id": "food-likes",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "food-likes",
      "tags": [
        "food"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 55,
      "hint": "Con I/you/we usamos “don't”, no “doesn't”.",
      "explanation": "Con “I” la forma negativa es “don't”: I don't like fish."
    },
    {
      "id": "lc-15",
      "tipo": "ordenar",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        8,
        11
      ],
      "etiqueta": "Ordena la frase",
      "instruccion": "\"No me gusta el queso\"",
      "palabras": [
        "like",
        "I",
        "cheese",
        "don't"
      ],
      "respuesta": [
        "I",
        "don't",
        "like",
        "cheese"
      ],
      "unit_id": "la-comida",
      "objective_id": "food-likes",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "food-likes",
      "tags": [
        "food"
      ],
      "feedback": {
        "correct": "Orden correcto: «I don't like cheese.». En inglés va primero el sujeto y luego el verbo.",
        "incorrect": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
        "context": "I don't like cheese.",
        "learnedExpressions": []
      },
      "mechanic": "sentence_order",
      "estimated_seconds": 60,
      "hint": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
      "explanation": "Orden correcto: «I don't like cheese.». En inglés va primero el sujeto y luego el verbo."
    },
    {
      "id": "lc-16",
      "tipo": "hablar",
      "habilidad": "speaking",
      "nivel": "A1",
      "edad": [
        7,
        11
      ],
      "etiqueta": "A hablar",
      "instruccion": "Di en voz alta:",
      "frase": "Do you like bananas?",
      "unit_id": "la-comida",
      "objective_id": "food-likes",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "food-likes",
      "tags": [
        "food"
      ],
      "mechanic": "speaking",
      "estimated_seconds": 60,
      "assessment": "self_report",
      "hint": "Escucha la frase en partes y repítela.",
      "explanation": "Has practicado cómo decir: Do you like bananas?",
      "feedback": {
        "incorrect": "Escucha la frase en partes y repítela.",
        "correct": "Has practicado cómo decir: Do you like bananas?"
      }
    },
    {
      "id": "lc-17",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “agua” en inglés?",
      "audio": "water",
      "opciones": [
        {
          "texto": "water",
          "correcta": true
        },
        {
          "texto": "juice"
        },
        {
          "texto": "bread"
        },
        {
          "texto": "cheese"
        }
      ],
      "feedback": {
        "correct": "“Water” es agua.",
        "incorrect": "Agua se dice “water”.",
        "context": "I drink water.",
        "learnedExpressions": [
          "water"
        ]
      },
      "unit_id": "la-comida",
      "objective_id": "food-words",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 1,
      "variant_group": "food-words",
      "tags": [
        "food"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Agua se dice “water”.",
      "explanation": "“Water” es agua."
    },
    {
      "id": "lc-18",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “huevo” en inglés?",
      "audio": "egg",
      "opciones": [
        {
          "texto": "egg",
          "correcta": true
        },
        {
          "texto": "apple"
        },
        {
          "texto": "fish"
        },
        {
          "texto": "rice"
        }
      ],
      "feedback": {
        "correct": "“Egg” es huevo.",
        "incorrect": "Huevo se dice “egg”.",
        "context": "An egg for breakfast.",
        "learnedExpressions": [
          "egg"
        ]
      },
      "unit_id": "la-comida",
      "objective_id": "food-words",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 1,
      "variant_group": "food-words",
      "tags": [
        "food"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Huevo se dice “egg”.",
      "explanation": "“Egg” es huevo."
    },
    {
      "id": "lc-19",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        7,
        10
      ],
      "etiqueta": "Gramática",
      "instruccion": "Completa: “I ___ apples.”",
      "opciones": [
        {
          "texto": "like",
          "correcta": true
        },
        {
          "texto": "likes"
        },
        {
          "texto": "liking"
        },
        {
          "texto": "to like"
        }
      ],
      "feedback": {
        "correct": "Con “I” usamos “like”: I like apples.",
        "incorrect": "Con I/you/we usamos “like”, sin -s.",
        "context": "I like apples.",
        "learnedExpressions": [
          "I like…"
        ]
      },
      "unit_id": "la-comida",
      "objective_id": "food-likes",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "food-likes",
      "tags": [
        "food"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Con I/you/we usamos “like”, sin -s.",
      "explanation": "Con “I” usamos “like”: I like apples."
    },
    {
      "id": "lc-20",
      "tipo": "elegir_texto",
      "habilidad": "reading",
      "nivel": "A1",
      "edad": [
        8,
        11
      ],
      "etiqueta": "Lectura",
      "instruccion": "Lee: “I like fish but I don't like eggs.” ¿Qué NO le gusta?",
      "opciones": [
        {
          "texto": "eggs",
          "correcta": true
        },
        {
          "texto": "fish"
        },
        {
          "texto": "milk"
        },
        {
          "texto": "bread"
        }
      ],
      "feedback": {
        "correct": "“I don't like eggs” → no le gustan los huevos.",
        "incorrect": "Fíjate en “I don't like eggs”.",
        "context": "I like fish but I don't like eggs.",
        "learnedExpressions": [
          "I don't like…"
        ]
      },
      "unit_id": "la-comida",
      "objective_id": "food-reading",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "food-reading",
      "tags": [
        "food"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Fíjate en “I don't like eggs”.",
      "explanation": "“I don't like eggs” → no le gustan los huevos."
    },
    {
      "id": "lc-21",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “leche” en inglés?",
      "audio": "milk",
      "opciones": [
        {
          "texto": "milk",
          "correcta": true
        },
        {
          "texto": "bread"
        },
        {
          "texto": "apple"
        }
      ],
      "feedback": {
        "correct": "“Milk” es leche.",
        "incorrect": "Leche se dice “milk”.",
        "context": "I drink milk.",
        "learnedExpressions": [
          "milk"
        ]
      },
      "unit_id": "la-comida",
      "objective_id": "food-words",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 1,
      "variant_group": "food-words",
      "tags": [
        "food"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Leche se dice “milk”.",
      "explanation": "“Milk” es leche."
    },
    {
      "id": "lc-22",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “pan” en inglés?",
      "audio": "bread",
      "opciones": [
        {
          "texto": "bread",
          "correcta": true
        },
        {
          "texto": "cheese"
        },
        {
          "texto": "water"
        }
      ],
      "feedback": {
        "correct": "“Bread” es pan.",
        "incorrect": "Pan se dice “bread”.",
        "context": "Bread and butter.",
        "learnedExpressions": [
          "bread"
        ]
      },
      "unit_id": "la-comida",
      "objective_id": "food-words",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 1,
      "variant_group": "food-words",
      "tags": [
        "food"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Pan se dice “bread”.",
      "explanation": "“Bread” es pan."
    },
    {
      "id": "lc-23",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        7,
        10
      ],
      "etiqueta": "Gramática",
      "instruccion": "Completa: “Do you ___ pizza?”",
      "opciones": [
        {
          "texto": "like",
          "correcta": true
        },
        {
          "texto": "likes"
        },
        {
          "texto": "liking"
        },
        {
          "texto": "to like"
        }
      ],
      "feedback": {
        "correct": "En preguntas con “do” usamos el verbo base: Do you like…?",
        "incorrect": "Tras “Do you” va el verbo sin -s: like.",
        "context": "Do you like pizza?",
        "learnedExpressions": [
          "Do you like…?"
        ]
      },
      "unit_id": "la-comida",
      "objective_id": "food-likes",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "food-likes",
      "tags": [
        "food"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Tras “Do you” va el verbo sin -s: like.",
      "explanation": "En preguntas con “do” usamos el verbo base: Do you like…?"
    },
    {
      "id": "lc-24",
      "tipo": "ordenar",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        7,
        10
      ],
      "etiqueta": "Ordena la frase",
      "instruccion": "“Me gusta la leche”",
      "palabras": [
        "like",
        "I",
        "milk"
      ],
      "respuesta": [
        "I",
        "like",
        "milk"
      ],
      "unit_id": "la-comida",
      "objective_id": "food-likes",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "food-likes",
      "tags": [
        "food"
      ],
      "feedback": {
        "correct": "Orden correcto: «I like milk.». En inglés va primero el sujeto y luego el verbo.",
        "incorrect": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
        "context": "I like milk.",
        "learnedExpressions": []
      },
      "mechanic": "sentence_order",
      "estimated_seconds": 60,
      "hint": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
      "explanation": "Orden correcto: «I like milk.». En inglés va primero el sujeto y luego el verbo."
    },
    {
      "id": "lc-25",
      "tipo": "elegir_texto",
      "habilidad": "reading",
      "nivel": "A1",
      "edad": [
        8,
        11
      ],
      "etiqueta": "Lectura",
      "instruccion": "Lee: “Ann likes apples and milk.” ¿Qué le gusta a Ann?",
      "opciones": [
        {
          "texto": "Apples and milk",
          "correcta": true
        },
        {
          "texto": "Fish and rice"
        },
        {
          "texto": "Bread and eggs"
        },
        {
          "texto": "Meat and water"
        }
      ],
      "feedback": {
        "correct": "El texto dice “apples and milk”.",
        "incorrect": "Fíjate: “Ann likes apples and milk”.",
        "context": "Ann likes apples and milk.",
        "learnedExpressions": [
          "likes"
        ]
      },
      "unit_id": "la-comida",
      "objective_id": "food-reading",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "food-reading",
      "tags": [
        "food"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Fíjate: “Ann likes apples and milk”.",
      "explanation": "El texto dice “apples and milk”."
    },
    {
      "id": "lc-26",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “queso” en inglés?",
      "audio": "cheese",
      "opciones": [
        {
          "texto": "cheese",
          "correcta": true
        },
        {
          "texto": "egg"
        },
        {
          "texto": "apple"
        }
      ],
      "feedback": {
        "correct": "“Cheese” es queso.",
        "incorrect": "Queso se dice “cheese”.",
        "context": "Bread and cheese.",
        "learnedExpressions": [
          "cheese"
        ]
      },
      "unit_id": "la-comida",
      "objective_id": "food-words",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 1,
      "variant_group": "food-words",
      "tags": [
        "food"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Queso se dice “cheese”.",
      "explanation": "“Cheese” es queso."
    },
    {
      "id": "food-name-egg",
      "unit_id": "la-comida",
      "objective_id": "food-words",
      "tipo": "imagen_palabra",
      "mechanic": "image_word",
      "stage": [
        "p12",
        "p34",
        "p56"
      ],
      "edad": [
        5,
        11
      ],
      "nivel": "Pre-A1",
      "habilidad": "vocabulary",
      "difficulty": 2,
      "estimated_seconds": 40,
      "instruccion": "Mira y elige la palabra.",
      "instructions": {
        "p12": "Mira y elige la palabra.",
        "p34": "Mira y elige la palabra.",
        "p56": "Mira y elige la palabra."
      },
      "hint": "Mira su forma y la yema.",
      "explanation": "Egg significa huevo.",
      "feedback": {
        "incorrect": "Mira su forma y la yema.",
        "correct": "Egg significa huevo.",
        "correctAnswer": "Egg significa huevo."
      },
      "variant_group": "food-words-food-name-egg",
      "stimulus_visual": "egg",
      "opciones": [
        {
          "texto": "egg",
          "correcta": true
        },
        {
          "texto": "bread",
          "correcta": false
        },
        {
          "texto": "cheese",
          "correcta": false
        }
      ]
    },
    {
      "id": "food-find-bread",
      "unit_id": "la-comida",
      "objective_id": "food-words",
      "tipo": "palabra_imagen",
      "mechanic": "word_image",
      "stage": [
        "p12",
        "p34",
        "p56"
      ],
      "edad": [
        5,
        11
      ],
      "nivel": "Pre-A1",
      "habilidad": "vocabulary",
      "difficulty": 2,
      "estimated_seconds": 35,
      "instruccion": "Busca la imagen.",
      "instructions": {
        "p12": "Busca la imagen.",
        "p34": "Busca la imagen.",
        "p56": "Busca la imagen."
      },
      "hint": "Lo puedes usar para hacer una tostada.",
      "explanation": "Bread significa pan.",
      "feedback": {
        "incorrect": "Lo puedes usar para hacer una tostada.",
        "correct": "Bread significa pan.",
        "correctAnswer": "Bread significa pan."
      },
      "variant_group": "food-words-food-find-bread",
      "prompt": "bread",
      "opciones": [
        {
          "texto": "bread",
          "correcta": true,
          "visual": "bread"
        },
        {
          "texto": "apple",
          "correcta": false,
          "visual": "apple"
        },
        {
          "texto": "milk",
          "correcta": false,
          "visual": "milk"
        }
      ]
    },
    {
      "id": "food-build-like",
      "unit_id": "la-comida",
      "objective_id": "food-likes",
      "tipo": "ordenar",
      "mechanic": "sentence_order",
      "stage": [
        "p12",
        "p34",
        "p56"
      ],
      "edad": [
        5,
        11
      ],
      "nivel": "Pre-A1",
      "habilidad": "grammar",
      "difficulty": 2,
      "estimated_seconds": 60,
      "instruccion": "Forma la frase.",
      "instructions": {
        "p12": "Forma la frase.",
        "p34": "Forma la frase.",
        "p56": "Forma la frase."
      },
      "hint": "Primero quién: I.",
      "explanation": "I like apples significa Me gustan las manzanas.",
      "feedback": {
        "incorrect": "Primero quién: I.",
        "correct": "I like apples significa Me gustan las manzanas.",
        "correctAnswer": "I like apples significa Me gustan las manzanas."
      },
      "variant_group": "food-likes-food-build-like",
      "palabras": [
        "I",
        "like",
        "apples."
      ],
      "respuesta": [
        "I",
        "like",
        "apples."
      ],
      "audio": "I like apples."
    },
    {
      "id": "food-sort-fruit",
      "unit_id": "la-comida",
      "objective_id": "food-words",
      "tipo": "clasificar",
      "mechanic": "classification",
      "stage": [
        "p12",
        "p34",
        "p56"
      ],
      "edad": [
        5,
        11
      ],
      "nivel": "Pre-A1",
      "habilidad": "vocabulary",
      "difficulty": 2,
      "estimated_seconds": 75,
      "instruccion": "Agrupa los elementos.",
      "instructions": {
        "p12": "Agrupa los elementos.",
        "p34": "Agrupa los elementos.",
        "p56": "Agrupa los elementos."
      },
      "hint": "Busca primero las dos frutas.",
      "explanation": "Apple y banana son frutas. Milk es una bebida.",
      "feedback": {
        "incorrect": "Busca primero las dos frutas.",
        "correct": "Apple y banana son frutas. Milk es una bebida.",
        "correctAnswer": "Apple y banana son frutas. Milk es una bebida."
      },
      "variant_group": "food-words-food-sort-fruit",
      "categories": [
        "Fruta",
        "Bebida"
      ],
      "items": [
        {
          "text": "apple",
          "visual": "apple",
          "category": "Fruta"
        },
        {
          "text": "banana",
          "visual": "banana",
          "category": "Fruta"
        },
        {
          "text": "milk",
          "visual": "milk",
          "category": "Bebida"
        }
      ]
    },
    {
      "id": "food-repeat-please",
      "unit_id": "la-comida",
      "objective_id": "food-likes",
      "tipo": "hablar",
      "mechanic": "speaking",
      "stage": [
        "p12",
        "p34",
        "p56"
      ],
      "edad": [
        5,
        11
      ],
      "nivel": "Pre-A1",
      "habilidad": "speaking",
      "difficulty": 2,
      "estimated_seconds": 60,
      "instruccion": "Escucha y repite.",
      "instructions": {
        "p12": "Escucha y repite.",
        "p34": "Escucha y repite.",
        "p56": "Escucha y repite."
      },
      "hint": "Di milk y después please.",
      "explanation": "Has practicado cómo pedir leche con educación.",
      "feedback": {
        "incorrect": "Di milk y después please.",
        "correct": "Has practicado cómo pedir leche con educación.",
        "correctAnswer": "Has practicado cómo pedir leche con educación."
      },
      "variant_group": "food-likes-food-repeat-please",
      "frase": "Milk, please.",
      "assessment": "self_report"
    },
    {
      "id": "food-spell-cheese",
      "unit_id": "la-comida",
      "objective_id": "food-words",
      "tipo": "deletrear",
      "mechanic": "spelling",
      "stage": [
        "p34",
        "p56"
      ],
      "edad": [
        8,
        11
      ],
      "nivel": "A1",
      "habilidad": "writing",
      "difficulty": 2,
      "estimated_seconds": 55,
      "instruccion": "Completa las letras.",
      "instructions": {
        "p34": "Completa las letras.",
        "p56": "Completa las letras."
      },
      "hint": "Las dos letras que faltan son iguales.",
      "explanation": "Cheese tiene dos ees seguidas.",
      "feedback": {
        "incorrect": "Las dos letras que faltan son iguales.",
        "correct": "Cheese tiene dos ees seguidas.",
        "correctAnswer": "Cheese tiene dos ees seguidas."
      },
      "variant_group": "food-words-food-spell-cheese",
      "stimulus_visual": "cheese",
      "mask": "ch__se",
      "respuesta": "cheese"
    },
    {
      "id": "food-dialogue-water",
      "unit_id": "la-comida",
      "objective_id": "food-likes",
      "tipo": "dialogo",
      "mechanic": "dialogue",
      "stage": [
        "p34",
        "p56"
      ],
      "edad": [
        8,
        11
      ],
      "nivel": "A1",
      "habilidad": "speaking",
      "difficulty": 2,
      "estimated_seconds": 80,
      "instruccion": "Completa el diálogo.",
      "instructions": {
        "p34": "Completa el diálogo.",
        "p56": "Completa el diálogo."
      },
      "hint": "Añade la palabra para pedir algo con educación.",
      "explanation": "Please hace que la petición sea educada.",
      "feedback": {
        "incorrect": "Añade la palabra para pedir algo con educación.",
        "correct": "Please hace que la petición sea educada.",
        "correctAnswer": "Please hace que la petición sea educada."
      },
      "variant_group": "food-likes-food-dialogue-water",
      "dialogue": [
        "Waiter: What would you like to drink?",
        "You: Water, ___."
      ],
      "respuesta": "please"
    },
    {
      "id": "food-dictate-lunch",
      "unit_id": "la-comida",
      "objective_id": "food-reading",
      "tipo": "dictado",
      "mechanic": "dictation",
      "stage": [
        "p56"
      ],
      "edad": [
        10,
        11
      ],
      "nivel": "A1",
      "habilidad": "listening",
      "difficulty": 3,
      "estimated_seconds": 70,
      "instruccion": "Escucha y escribe.",
      "instructions": {
        "p56": "Escucha y escribe."
      },
      "hint": "Bread no se cuenta aquí: escucha some.",
      "explanation": "Usamos some con una cantidad no especificada de pan.",
      "feedback": {
        "incorrect": "Bread no se cuenta aquí: escucha some.",
        "correct": "Usamos some con una cantidad no especificada de pan.",
        "correctAnswer": "Usamos some con una cantidad no especificada de pan."
      },
      "variant_group": "food-reading-food-dictate-lunch",
      "audio": "There is some bread on the table.",
      "respuesta": "There is some bread on the table."
    },
    {
      "id": "food-write-lunch",
      "unit_id": "la-comida",
      "objective_id": "food-reading",
      "tipo": "escritura_guiada",
      "mechanic": "guided_writing",
      "stage": [
        "p56"
      ],
      "edad": [
        10,
        11
      ],
      "nivel": "A1",
      "habilidad": "writing",
      "difficulty": 3,
      "estimated_seconds": 140,
      "instruccion": "Escribe y revisa tu texto.",
      "instructions": {
        "p56": "Escribe y revisa tu texto."
      },
      "hint": "Empieza con I eat… y después I drink…",
      "explanation": "El modelo distingue eat (comer) y drink (beber).",
      "feedback": {
        "incorrect": "Empieza con I eat… y después I drink…",
        "correct": "El modelo distingue eat (comer) y drink (beber).",
        "correctAnswer": "El modelo distingue eat (comer) y drink (beber)."
      },
      "variant_group": "food-reading-food-write-lunch",
      "prompt": "Write two sentences about your lunch. Say what you eat and drink.",
      "respuesta": "I eat a cheese sandwich. I drink water.",
      "assessment": "self_report",
      "min_words": 8,
      "rubric": [
        "I named a food.",
        "I named a drink.",
        "I checked eat and drink."
      ]
    }
  ]
});
