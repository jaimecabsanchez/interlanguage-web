/* Pack editorial generado desde contenido.js; editar el dato, no el motor. */
ILContent.registerPack({
  "id": "primary-food",
  "version": 1,
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
        "p12",
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
      }
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
        "p12",
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
      }
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
        "p12",
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
      }
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
        "p12",
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
      }
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
      ]
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
      }
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
        "p12",
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
      }
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
      ]
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
      ]
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
      ]
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
      ]
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
        "p12",
        "p34",
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "food-words",
      "tags": [
        "food"
      ]
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
      ]
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
      ]
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
      }
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
      ]
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
        "p12",
        "p34",
        "p56"
      ],
      "difficulty": 1,
      "variant_group": "food-words",
      "tags": [
        "food"
      ]
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
        "p12",
        "p34",
        "p56"
      ],
      "difficulty": 1,
      "variant_group": "food-words",
      "tags": [
        "food"
      ]
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
      ]
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
      ]
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
        "p12",
        "p34",
        "p56"
      ],
      "difficulty": 1,
      "variant_group": "food-words",
      "tags": [
        "food"
      ]
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
        "p12",
        "p34",
        "p56"
      ],
      "difficulty": 1,
      "variant_group": "food-words",
      "tags": [
        "food"
      ]
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
      ]
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
      }
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
      ]
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
        "p12",
        "p34",
        "p56"
      ],
      "difficulty": 1,
      "variant_group": "food-words",
      "tags": [
        "food"
      ]
    }
  ]
});
