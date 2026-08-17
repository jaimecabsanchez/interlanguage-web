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
        "school-greetings"
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
    }
  ]
});
