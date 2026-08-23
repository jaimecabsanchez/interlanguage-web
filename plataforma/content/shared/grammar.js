/* Pack editorial de GRAMÁTICA graduada por edad (verbos, tiempos verbales,
   preposiciones y estructuras esenciales). Editar el dato, no el motor.
   Unidades: gramatica-inicial (p12+p34) · gramatica-media (p56) · gramatica-eso (eso). */
ILContent.registerPack({
  "id": "grammar-core",
  "version": 1,
  "stages": [
    "p12",
    "p34",
    "p56",
    "eso"
  ],
  "topic": "grammar",
  "units": [
    {
      "id": "gramatica-inicial",
      "titulo": "Words & sentences",
      "visual": "grammar",
      "nivel": "Pre-A1",
      "etapa": "Primaria",
      "descripcion": "Verbos básicos, this/that y preposiciones de lugar.",
      "tema": {
        "icono": "🧩",
        "color": "#2f6fed"
      },
      "stage": [
        "p12",
        "p34"
      ],
      "topic": "grammar",
      "objective_ids": [
        "gi-verbs",
        "gi-prepositions",
        "gi-basics"
      ]
    },
    {
      "id": "gramatica-media",
      "titulo": "Grammar lab",
      "visual": "grammar",
      "nivel": "A1",
      "etapa": "Primaria",
      "descripcion": "Presente simple y continuo, pasado y preposiciones.",
      "tema": {
        "icono": "🧩",
        "color": "#2f6fed"
      },
      "stage": [
        "p56"
      ],
      "topic": "grammar",
      "objective_ids": [
        "gm-present",
        "gm-past",
        "gm-prepositions"
      ]
    },
    {
      "id": "gramatica-eso",
      "titulo": "Grammar in use",
      "visual": "grammar",
      "nivel": "A2",
      "etapa": "ESO",
      "descripcion": "Tenses, prepositions, modals and phrasal verbs.",
      "tema": {
        "icono": "🧩",
        "color": "#2f6fed"
      },
      "stage": [
        "eso"
      ],
      "topic": "grammar",
      "objective_ids": [
        "ge-tenses",
        "ge-prepositions",
        "ge-modals"
      ]
    }
  ],
  "objectives": [
    {
      "id": "gi-verbs",
      "skill": "grammar",
      "literacy_load": "low",
      "description": "Verbos básicos y el verbo to be.",
      "unit_id": "gramatica-inicial",
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
        "grammar"
      ]
    },
    {
      "id": "gi-prepositions",
      "skill": "grammar",
      "literacy_load": "low",
      "description": "Preposiciones de lugar: in/on/under/next to.",
      "unit_id": "gramatica-inicial",
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
        "grammar"
      ]
    },
    {
      "id": "gi-basics",
      "skill": "grammar",
      "literacy_load": "low",
      "description": "this/that, a/an y plurales sencillos.",
      "unit_id": "gramatica-inicial",
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
        "grammar"
      ]
    },
    {
      "id": "gm-present",
      "skill": "grammar",
      "literacy_load": "medium",
      "description": "Presente simple vs presente continuo.",
      "unit_id": "gramatica-media",
      "stage": [
        "p56"
      ],
      "cefr": "A1",
      "difficulty": 3,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gm-past",
      "skill": "grammar",
      "literacy_load": "medium",
      "description": "Pasado simple (regular e irregular).",
      "unit_id": "gramatica-media",
      "stage": [
        "p56"
      ],
      "cefr": "A1",
      "difficulty": 3,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gm-prepositions",
      "skill": "grammar",
      "literacy_load": "medium",
      "description": "Preposiciones de tiempo: in/on/at.",
      "unit_id": "gramatica-media",
      "stage": [
        "p56"
      ],
      "cefr": "A1",
      "difficulty": 3,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "ge-tenses",
      "skill": "grammar",
      "literacy_load": "high",
      "description": "Present perfect, past continuous and future forms.",
      "unit_id": "gramatica-eso",
      "stage": [
        "eso"
      ],
      "cefr": "A2",
      "difficulty": 4,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "ge-prepositions",
      "skill": "grammar",
      "literacy_load": "high",
      "description": "Dependent prepositions (good at, depend on…).",
      "unit_id": "gramatica-eso",
      "stage": [
        "eso"
      ],
      "cefr": "A2",
      "difficulty": 4,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "ge-modals",
      "skill": "grammar",
      "literacy_load": "high",
      "description": "Modal verbs and common phrasal verbs.",
      "unit_id": "gramatica-eso",
      "stage": [
        "eso"
      ],
      "cefr": "A2",
      "difficulty": 4,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "grammar"
      ]
    }
  ],
  "exercises": [
    {
      "id": "gi-1",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "El verbo to be",
      "instruccion": "Completa: “I ___ happy.”",
      "opciones": [
        {
          "texto": "am",
          "correcta": true
        },
        {
          "texto": "is"
        },
        {
          "texto": "are"
        }
      ],
      "feedback": {
        "correct": "Con “I” usamos “am”: I am happy.",
        "incorrect": "I → am; you/we/they → are; he/she/it → is.",
        "context": "I am happy.",
        "learnedExpressions": [
          "I am…"
        ]
      },
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-verbs",
      "stage": [
        "p12",
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "gi-verbs",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gi-2",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "El verbo to be",
      "instruccion": "Completa: “They ___ my friends.”",
      "opciones": [
        {
          "texto": "are",
          "correcta": true
        },
        {
          "texto": "is"
        },
        {
          "texto": "am"
        }
      ],
      "feedback": {
        "correct": "Con “they” usamos “are”.",
        "incorrect": "they/we/you → are.",
        "context": "They are my friends.",
        "learnedExpressions": [
          "They are…"
        ]
      },
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-verbs",
      "stage": [
        "p12",
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "gi-verbs",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gi-3",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "have got",
      "instruccion": "Completa: “She ___ a cat.”",
      "opciones": [
        {
          "texto": "has",
          "correcta": true
        },
        {
          "texto": "have"
        },
        {
          "texto": "haves"
        }
      ],
      "feedback": {
        "correct": "he/she/it → has.",
        "incorrect": "Con she usamos “has”.",
        "context": "She has a cat.",
        "learnedExpressions": [
          "She has…"
        ]
      },
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-verbs",
      "stage": [
        "p12",
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "gi-verbs",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gi-4",
      "tipo": "ordenar",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        7,
        10
      ],
      "etiqueta": "Ordena la frase",
      "instruccion": "“Yo soy un niño”",
      "palabras": [
        "a",
        "I",
        "am",
        "boy"
      ],
      "respuesta": [
        "I",
        "am",
        "a",
        "boy"
      ],
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-verbs",
      "stage": [
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "gi-verbs",
      "tags": [
        "grammar"
      ],
      "feedback": {
        "correct": "Orden correcto: «I am a boy.». En inglés va primero el sujeto y luego el verbo.",
        "incorrect": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
        "context": "I am a boy.",
        "learnedExpressions": []
      }
    },
    {
      "id": "gi-5",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Preposiciones",
      "instruccion": "The cat is ___ the box (dentro).",
      "opciones": [
        {
          "texto": "in",
          "correcta": true
        },
        {
          "texto": "on"
        },
        {
          "texto": "under"
        }
      ],
      "feedback": {
        "correct": "“in” = dentro.",
        "incorrect": "Dentro = “in”.",
        "context": "The cat is in the box.",
        "learnedExpressions": [
          "in"
        ]
      },
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-prepositions",
      "stage": [
        "p12",
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "gi-prepositions",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gi-6",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Preposiciones",
      "instruccion": "The book is ___ the table (encima).",
      "opciones": [
        {
          "texto": "on",
          "correcta": true
        },
        {
          "texto": "in"
        },
        {
          "texto": "under"
        }
      ],
      "feedback": {
        "correct": "“on” = encima.",
        "incorrect": "Encima = “on”.",
        "context": "The book is on the table.",
        "learnedExpressions": [
          "on"
        ]
      },
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-prepositions",
      "stage": [
        "p12",
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "gi-prepositions",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gi-7",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Preposiciones",
      "instruccion": "The ball is ___ the chair (debajo).",
      "opciones": [
        {
          "texto": "under",
          "correcta": true
        },
        {
          "texto": "on"
        },
        {
          "texto": "in"
        }
      ],
      "feedback": {
        "correct": "“under” = debajo.",
        "incorrect": "Debajo = “under”.",
        "context": "The ball is under the chair.",
        "learnedExpressions": [
          "under"
        ]
      },
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-prepositions",
      "stage": [
        "p12",
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "gi-prepositions",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gi-8",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        7,
        10
      ],
      "etiqueta": "Preposiciones",
      "instruccion": "Completa: “The dog is ___ the car.” (al lado)",
      "opciones": [
        {
          "texto": "next to",
          "correcta": true
        },
        {
          "texto": "in"
        },
        {
          "texto": "on"
        },
        {
          "texto": "under"
        }
      ],
      "feedback": {
        "correct": "“next to” = al lado de.",
        "incorrect": "Al lado = “next to”.",
        "context": "The dog is next to the car.",
        "learnedExpressions": [
          "next to"
        ]
      },
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-prepositions",
      "stage": [
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "gi-prepositions",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gi-9",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "this / that",
      "instruccion": "___ is my pencil (esto, aquí).",
      "opciones": [
        {
          "texto": "This",
          "correcta": true
        },
        {
          "texto": "That"
        },
        {
          "texto": "These"
        }
      ],
      "feedback": {
        "correct": "“This” para algo cerca.",
        "incorrect": "Cerca → this; lejos → that.",
        "context": "This is my pencil.",
        "learnedExpressions": [
          "This is…"
        ]
      },
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-basics",
      "stage": [
        "p12",
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "gi-basics",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gi-10",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "a / an",
      "instruccion": "Completa: “I have ___ apple.”",
      "opciones": [
        {
          "texto": "an",
          "correcta": true
        },
        {
          "texto": "a"
        },
        {
          "texto": "the"
        }
      ],
      "feedback": {
        "correct": "Antes de vocal (a-e-i-o-u) usamos “an”.",
        "incorrect": "apple empieza por vocal → an apple.",
        "context": "I have an apple.",
        "learnedExpressions": [
          "an + vocal"
        ]
      },
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-basics",
      "stage": [
        "p12",
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "gi-basics",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gi-11",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "Pre-A1",
      "edad": [
        6,
        9
      ],
      "etiqueta": "Plurales",
      "instruccion": "Plural de “cat”.",
      "opciones": [
        {
          "texto": "cats",
          "correcta": true
        },
        {
          "texto": "cat"
        },
        {
          "texto": "cates"
        }
      ],
      "feedback": {
        "correct": "Añadimos -s: cats.",
        "incorrect": "El plural normal añade -s: cats.",
        "context": "Two cats.",
        "learnedExpressions": [
          "plural -s"
        ]
      },
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-basics",
      "stage": [
        "p12",
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "gi-basics",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gi-12",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        7,
        10
      ],
      "etiqueta": "Plurales",
      "instruccion": "Completa: “Two ___ , please.” (libro)",
      "opciones": [
        {
          "texto": "books",
          "correcta": true
        },
        {
          "texto": "book"
        },
        {
          "texto": "bookes"
        }
      ],
      "feedback": {
        "correct": "Plural de book = books.",
        "incorrect": "Añade -s: books.",
        "context": "Two books, please.",
        "learnedExpressions": [
          "books"
        ]
      },
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-basics",
      "stage": [
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "gi-basics",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gm-1",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        9,
        12
      ],
      "etiqueta": "Presente simple",
      "instruccion": "Completa: “He ___ football every day.”",
      "opciones": [
        {
          "texto": "plays",
          "correcta": true
        },
        {
          "texto": "play"
        },
        {
          "texto": "is playing"
        },
        {
          "texto": "playing"
        }
      ],
      "feedback": {
        "correct": "Rutina + he → present simple con -s: plays.",
        "incorrect": "“every day” pide presente simple: he plays.",
        "context": "He plays football every day.",
        "learnedExpressions": [
          "present simple"
        ]
      },
      "unit_id": "gramatica-media",
      "objective_id": "gm-present",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "gm-present",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gm-2",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        9,
        12
      ],
      "etiqueta": "Presente continuo",
      "instruccion": "Completa: “Look! She ___ now.”",
      "opciones": [
        {
          "texto": "is running",
          "correcta": true
        },
        {
          "texto": "runs"
        },
        {
          "texto": "run"
        },
        {
          "texto": "ran"
        }
      ],
      "feedback": {
        "correct": "“now/Look!” pide present continuous: is running.",
        "incorrect": "Acción ahora mismo → be + -ing.",
        "context": "Look! She is running now.",
        "learnedExpressions": [
          "present continuous"
        ]
      },
      "unit_id": "gramatica-media",
      "objective_id": "gm-present",
      "stage": [
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "gm-present",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gm-3",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        9,
        12
      ],
      "etiqueta": "Presente simple",
      "instruccion": "Completa: “We ___ TV every evening.”",
      "opciones": [
        {
          "texto": "watch",
          "correcta": true
        },
        {
          "texto": "watches"
        },
        {
          "texto": "are watch"
        },
        {
          "texto": "watching"
        }
      ],
      "feedback": {
        "correct": "we/you/they → sin -s: watch.",
        "incorrect": "Con we usamos “watch”.",
        "context": "We watch TV every evening.",
        "learnedExpressions": [
          "present simple"
        ]
      },
      "unit_id": "gramatica-media",
      "objective_id": "gm-present",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "gm-present",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gm-4",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        10,
        12
      ],
      "etiqueta": "Simple vs continuo",
      "instruccion": "Which one is present continuous?",
      "opciones": [
        {
          "texto": "I'm eating.",
          "correcta": true
        },
        {
          "texto": "I eat."
        },
        {
          "texto": "I ate."
        },
        {
          "texto": "I eats."
        }
      ],
      "feedback": {
        "correct": "be + -ing = present continuous: I'm eating.",
        "incorrect": "Continuous = am/is/are + verbo-ing.",
        "context": "I'm eating lunch.",
        "learnedExpressions": [
          "be + -ing"
        ]
      },
      "unit_id": "gramatica-media",
      "objective_id": "gm-present",
      "stage": [
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "gm-present",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gm-5",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        9,
        12
      ],
      "etiqueta": "Pasado simple",
      "instruccion": "Past simple of “play”.",
      "opciones": [
        {
          "texto": "played",
          "correcta": true
        },
        {
          "texto": "plaid"
        },
        {
          "texto": "playd"
        },
        {
          "texto": "plays"
        }
      ],
      "feedback": {
        "correct": "Regular: play → played.",
        "incorrect": "Verbos regulares añaden -ed: played.",
        "context": "I played tennis.",
        "learnedExpressions": [
          "-ed"
        ]
      },
      "unit_id": "gramatica-media",
      "objective_id": "gm-past",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "gm-past",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gm-6",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        9,
        12
      ],
      "etiqueta": "Pasado simple",
      "instruccion": "Past simple of “go”.",
      "opciones": [
        {
          "texto": "went",
          "correcta": true
        },
        {
          "texto": "goed"
        },
        {
          "texto": "gone"
        },
        {
          "texto": "going"
        }
      ],
      "feedback": {
        "correct": "Irregular: go → went.",
        "incorrect": "go es irregular: went.",
        "context": "I went home.",
        "learnedExpressions": [
          "went"
        ]
      },
      "unit_id": "gramatica-media",
      "objective_id": "gm-past",
      "stage": [
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "gm-past",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gm-7",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        9,
        12
      ],
      "etiqueta": "Pasado simple",
      "instruccion": "Completa: “Yesterday I ___ to the park.”",
      "opciones": [
        {
          "texto": "went",
          "correcta": true
        },
        {
          "texto": "go"
        },
        {
          "texto": "gone"
        },
        {
          "texto": "going"
        }
      ],
      "feedback": {
        "correct": "“Yesterday” → past simple: went.",
        "incorrect": "Pasado de go = went.",
        "context": "Yesterday I went to the park.",
        "learnedExpressions": [
          "went"
        ]
      },
      "unit_id": "gramatica-media",
      "objective_id": "gm-past",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "gm-past",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gm-8",
      "tipo": "ordenar",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        10,
        12
      ],
      "etiqueta": "Ordena la frase",
      "instruccion": "“Ella vio la tele ayer”",
      "palabras": [
        "TV",
        "watched",
        "She",
        "yesterday"
      ],
      "respuesta": [
        "She",
        "watched",
        "TV",
        "yesterday"
      ],
      "unit_id": "gramatica-media",
      "objective_id": "gm-past",
      "stage": [
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "gm-past",
      "tags": [
        "grammar"
      ],
      "feedback": {
        "correct": "Orden correcto: «She watched TV yesterday.». En inglés va primero el sujeto y luego el verbo.",
        "incorrect": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
        "context": "She watched TV yesterday.",
        "learnedExpressions": []
      }
    },
    {
      "id": "gm-9",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        9,
        12
      ],
      "etiqueta": "Preposiciones de tiempo",
      "instruccion": "Completa: “___ Monday”.",
      "opciones": [
        {
          "texto": "On",
          "correcta": true
        },
        {
          "texto": "In"
        },
        {
          "texto": "At"
        }
      ],
      "feedback": {
        "correct": "Días → on: on Monday.",
        "incorrect": "Con días usamos “on”.",
        "context": "On Monday.",
        "learnedExpressions": [
          "on + día"
        ]
      },
      "unit_id": "gramatica-media",
      "objective_id": "gm-prepositions",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "gm-prepositions",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gm-10",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        9,
        12
      ],
      "etiqueta": "Preposiciones de tiempo",
      "instruccion": "Completa: “___ the morning”.",
      "opciones": [
        {
          "texto": "In",
          "correcta": true
        },
        {
          "texto": "On"
        },
        {
          "texto": "At"
        }
      ],
      "feedback": {
        "correct": "Partes del día → in: in the morning.",
        "incorrect": "in the morning/afternoon/evening.",
        "context": "In the morning.",
        "learnedExpressions": [
          "in the morning"
        ]
      },
      "unit_id": "gramatica-media",
      "objective_id": "gm-prepositions",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "gm-prepositions",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gm-11",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        9,
        12
      ],
      "etiqueta": "Preposiciones de tiempo",
      "instruccion": "Completa: “___ 7 o'clock”.",
      "opciones": [
        {
          "texto": "At",
          "correcta": true
        },
        {
          "texto": "In"
        },
        {
          "texto": "On"
        }
      ],
      "feedback": {
        "correct": "Horas → at: at 7 o'clock.",
        "incorrect": "Con horas usamos “at”.",
        "context": "At 7 o'clock.",
        "learnedExpressions": [
          "at + hora"
        ]
      },
      "unit_id": "gramatica-media",
      "objective_id": "gm-prepositions",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "gm-prepositions",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "gm-12",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        10,
        12
      ],
      "etiqueta": "Preposiciones de tiempo",
      "instruccion": "Completa: “My birthday is ___ July.”",
      "opciones": [
        {
          "texto": "in",
          "correcta": true
        },
        {
          "texto": "on"
        },
        {
          "texto": "at"
        }
      ],
      "feedback": {
        "correct": "Meses → in: in July.",
        "incorrect": "Con meses usamos “in”.",
        "context": "My birthday is in July.",
        "learnedExpressions": [
          "in + mes"
        ]
      },
      "unit_id": "gramatica-media",
      "objective_id": "gm-prepositions",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "gm-prepositions",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "ge-1",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Present perfect",
      "instruccion": "Complete: “I ___ sushi before.”",
      "opciones": [
        {
          "texto": "have never eaten",
          "correcta": true
        },
        {
          "texto": "has never eaten"
        },
        {
          "texto": "never ate"
        },
        {
          "texto": "am never eating"
        }
      ],
      "feedback": {
        "correct": "Experience → present perfect: have + past participle.",
        "incorrect": "Life experience uses present perfect (have eaten).",
        "context": "I have never eaten sushi before.",
        "learnedExpressions": [
          "present perfect"
        ]
      },
      "unit_id": "gramatica-eso",
      "objective_id": "ge-tenses",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "ge-tenses",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "ge-2",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Past continuous",
      "instruccion": "Complete: “While I ___ , the phone rang.”",
      "opciones": [
        {
          "texto": "was cooking",
          "correcta": true
        },
        {
          "texto": "cooked"
        },
        {
          "texto": "cook"
        },
        {
          "texto": "have cooked"
        }
      ],
      "feedback": {
        "correct": "Background action → past continuous: was cooking.",
        "incorrect": "“While…” + longer action → past continuous.",
        "context": "While I was cooking, the phone rang.",
        "learnedExpressions": [
          "past continuous"
        ]
      },
      "unit_id": "gramatica-eso",
      "objective_id": "ge-tenses",
      "stage": [
        "eso"
      ],
      "difficulty": 4,
      "variant_group": "ge-tenses",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "ge-3",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Present perfect",
      "instruccion": "Complete: “She ___ here since 2020.”",
      "opciones": [
        {
          "texto": "has lived",
          "correcta": true
        },
        {
          "texto": "lived"
        },
        {
          "texto": "lives"
        },
        {
          "texto": "is living"
        }
      ],
      "feedback": {
        "correct": "“since” → present perfect: has lived.",
        "incorrect": "since/for + unfinished time → present perfect.",
        "context": "She has lived here since 2020.",
        "learnedExpressions": [
          "since / for"
        ]
      },
      "unit_id": "gramatica-eso",
      "objective_id": "ge-tenses",
      "stage": [
        "eso"
      ],
      "difficulty": 4,
      "variant_group": "ge-tenses",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "ge-4",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Future",
      "instruccion": "Complete: “This time tomorrow I ___ on a plane.”",
      "opciones": [
        {
          "texto": "will be",
          "correcta": true
        },
        {
          "texto": "am"
        },
        {
          "texto": "was"
        },
        {
          "texto": "be"
        }
      ],
      "feedback": {
        "correct": "Prediction/future state → “will be”.",
        "incorrect": "Future point in time → will be.",
        "context": "This time tomorrow I will be on a plane.",
        "learnedExpressions": [
          "will be"
        ]
      },
      "unit_id": "gramatica-eso",
      "objective_id": "ge-tenses",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "ge-tenses",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "ge-5",
      "tipo": "ordenar",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Order the sentence",
      "instruccion": "“I have already finished my homework”",
      "palabras": [
        "already",
        "have",
        "I",
        "finished",
        "my",
        "homework"
      ],
      "respuesta": [
        "I",
        "have",
        "already",
        "finished",
        "my",
        "homework"
      ],
      "unit_id": "gramatica-eso",
      "objective_id": "ge-tenses",
      "stage": [
        "eso"
      ],
      "difficulty": 4,
      "variant_group": "ge-tenses",
      "tags": [
        "grammar"
      ],
      "feedback": {
        "correct": "Correct order: “I have already finished my homework.”. In English the subject comes first, then the verb.",
        "incorrect": "Look at the word order (subject + verb + …) and try again.",
        "context": "I have already finished my homework.",
        "learnedExpressions": []
      }
    },
    {
      "id": "ge-6",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Prepositions",
      "instruccion": "Complete: “I'm good ___ maths.”",
      "opciones": [
        {
          "texto": "at",
          "correcta": true
        },
        {
          "texto": "in"
        },
        {
          "texto": "on"
        },
        {
          "texto": "of"
        }
      ],
      "feedback": {
        "correct": "good at + skill.",
        "incorrect": "The phrase is “good at”.",
        "context": "I'm good at maths.",
        "learnedExpressions": [
          "good at"
        ]
      },
      "unit_id": "gramatica-eso",
      "objective_id": "ge-prepositions",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "ge-prepositions",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "ge-7",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Prepositions",
      "instruccion": "Complete: “It depends ___ the weather.”",
      "opciones": [
        {
          "texto": "on",
          "correcta": true
        },
        {
          "texto": "of"
        },
        {
          "texto": "in"
        },
        {
          "texto": "at"
        }
      ],
      "feedback": {
        "correct": "depend on.",
        "incorrect": "The phrase is “depend on”.",
        "context": "It depends on the weather.",
        "learnedExpressions": [
          "depend on"
        ]
      },
      "unit_id": "gramatica-eso",
      "objective_id": "ge-prepositions",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "ge-prepositions",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "ge-8",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Prepositions",
      "instruccion": "Complete: “She's interested ___ music.”",
      "opciones": [
        {
          "texto": "in",
          "correcta": true
        },
        {
          "texto": "on"
        },
        {
          "texto": "at"
        },
        {
          "texto": "of"
        }
      ],
      "feedback": {
        "correct": "interested in.",
        "incorrect": "The phrase is “interested in”.",
        "context": "She's interested in music.",
        "learnedExpressions": [
          "interested in"
        ]
      },
      "unit_id": "gramatica-eso",
      "objective_id": "ge-prepositions",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "ge-prepositions",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "ge-9",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Prepositions",
      "instruccion": "Complete: “We arrived ___ the airport.”",
      "opciones": [
        {
          "texto": "at",
          "correcta": true
        },
        {
          "texto": "to"
        },
        {
          "texto": "in"
        },
        {
          "texto": "on"
        }
      ],
      "feedback": {
        "correct": "arrive at + place.",
        "incorrect": "We say “arrive at” (a place), not “arrive to”.",
        "context": "We arrived at the airport.",
        "learnedExpressions": [
          "arrive at"
        ]
      },
      "unit_id": "gramatica-eso",
      "objective_id": "ge-prepositions",
      "stage": [
        "eso"
      ],
      "difficulty": 4,
      "variant_group": "ge-prepositions",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "ge-10",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Modals",
      "instruccion": "Complete: “You ___ smoke here.” (prohibition)",
      "opciones": [
        {
          "texto": "mustn't",
          "correcta": true
        },
        {
          "texto": "don't have to"
        },
        {
          "texto": "should"
        },
        {
          "texto": "can"
        }
      ],
      "feedback": {
        "correct": "Prohibition → mustn't.",
        "incorrect": "“mustn't” = it's prohibited; “don't have to” = not necessary.",
        "context": "You mustn't smoke here.",
        "learnedExpressions": [
          "mustn't"
        ]
      },
      "unit_id": "gramatica-eso",
      "objective_id": "ge-modals",
      "stage": [
        "eso"
      ],
      "difficulty": 4,
      "variant_group": "ge-modals",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "ge-11",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Modals",
      "instruccion": "Complete: “You ___ wear a uniform.” (obligation)",
      "opciones": [
        {
          "texto": "have to",
          "correcta": true
        },
        {
          "texto": "mustn't"
        },
        {
          "texto": "could"
        },
        {
          "texto": "might"
        }
      ],
      "feedback": {
        "correct": "Obligation → have to.",
        "incorrect": "Obligation uses “have to / must”.",
        "context": "You have to wear a uniform.",
        "learnedExpressions": [
          "have to"
        ]
      },
      "unit_id": "gramatica-eso",
      "objective_id": "ge-modals",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "ge-modals",
      "tags": [
        "grammar"
      ]
    },
    {
      "id": "ge-12",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Phrasal verbs",
      "instruccion": "Complete: “Please ___ your phone.” (apagar)",
      "opciones": [
        {
          "texto": "turn off",
          "correcta": true
        },
        {
          "texto": "turn on"
        },
        {
          "texto": "look for"
        },
        {
          "texto": "give up"
        }
      ],
      "feedback": {
        "correct": "turn off = apagar.",
        "incorrect": "Apagar = turn off; encender = turn on.",
        "context": "Please turn off your phone.",
        "learnedExpressions": [
          "turn off"
        ]
      },
      "unit_id": "gramatica-eso",
      "objective_id": "ge-modals",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "ge-modals",
      "tags": [
        "grammar"
      ]
    }
  ]
});
