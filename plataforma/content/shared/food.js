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
      "titulo": "La comida",
      "nivel": "Pre-A1",
      "etapa": "Primaria",
      "descripcion": "Vocabulario básico de alimentos y gustos.",
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
    }
  ]
});
