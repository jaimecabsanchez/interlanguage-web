/* Banco editorial: metadatos explícitos y mecánicas reutilizables. */
ILContent.registerPack({
  "id": "grammar-core",
  "version": 2,
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
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "gi-verbs",
      "tags": [
        "grammar"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "I → am; you/we/they → are; he/she/it → is.",
      "explanation": "Con “I” usamos “am”: I am happy."
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
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "gi-verbs",
      "tags": [
        "grammar"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "they/we/you → are.",
      "explanation": "Con “they” usamos “are”."
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
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "gi-verbs",
      "tags": [
        "grammar"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Con she usamos “has”.",
      "explanation": "he/she/it → has."
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
      },
      "mechanic": "sentence_order",
      "estimated_seconds": 60,
      "hint": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
      "explanation": "Orden correcto: «I am a boy.». En inglés va primero el sujeto y luego el verbo."
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
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "gi-prepositions",
      "tags": [
        "grammar"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Dentro = “in”.",
      "explanation": "“in” = dentro."
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
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "gi-prepositions",
      "tags": [
        "grammar"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Encima = “on”.",
      "explanation": "“on” = encima."
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
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "gi-prepositions",
      "tags": [
        "grammar"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Debajo = “under”.",
      "explanation": "“under” = debajo."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Al lado = “next to”.",
      "explanation": "“next to” = al lado de."
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
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "gi-basics",
      "tags": [
        "grammar"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Cerca → this; lejos → that.",
      "explanation": "“This” para algo cerca."
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
        "p34"
      ],
      "difficulty": 2,
      "variant_group": "gi-basics",
      "tags": [
        "grammar"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "apple empieza por vocal → an apple.",
      "explanation": "Antes de vocal (a-e-i-o-u) usamos “an”."
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
        "p34"
      ],
      "difficulty": 1,
      "variant_group": "gi-basics",
      "tags": [
        "grammar"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "El plural normal añade -s: cats.",
      "explanation": "Añadimos -s: cats."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Añade -s: books.",
      "explanation": "Plural de book = books."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "“every day” pide presente simple: he plays.",
      "explanation": "Rutina + he → present simple con -s: plays."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Acción ahora mismo → be + -ing.",
      "explanation": "“now/Look!” pide present continuous: is running."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Con we usamos “watch”.",
      "explanation": "we/you/they → sin -s: watch."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Continuous = am/is/are + verbo-ing.",
      "explanation": "be + -ing = present continuous: I'm eating."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Verbos regulares añaden -ed: played.",
      "explanation": "Regular: play → played."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "go es irregular: went.",
      "explanation": "Irregular: go → went."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Pasado de go = went.",
      "explanation": "“Yesterday” → past simple: went."
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
      },
      "mechanic": "sentence_order",
      "estimated_seconds": 60,
      "hint": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
      "explanation": "Orden correcto: «She watched TV yesterday.». En inglés va primero el sujeto y luego el verbo."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Con días usamos “on”.",
      "explanation": "Días → on: on Monday."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "in the morning/afternoon/evening.",
      "explanation": "Partes del día → in: in the morning."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Con horas usamos “at”.",
      "explanation": "Horas → at: at 7 o'clock."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Con meses usamos “in”.",
      "explanation": "Meses → in: in July."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Life experience uses present perfect (have eaten).",
      "explanation": "Experience → present perfect: have + past participle."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "“While…” + longer action → past continuous.",
      "explanation": "Background action → past continuous: was cooking."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "since/for + unfinished time → present perfect.",
      "explanation": "“since” → present perfect: has lived."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Future point in time → will be.",
      "explanation": "Prediction/future state → “will be”."
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
      },
      "mechanic": "sentence_order",
      "estimated_seconds": 60,
      "hint": "Look at the word order (subject + verb + …) and try again.",
      "explanation": "Correct order: “I have already finished my homework.”. In English the subject comes first, then the verb."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "The phrase is “good at”.",
      "explanation": "good at + skill."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "The phrase is “depend on”.",
      "explanation": "depend on."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "The phrase is “interested in”.",
      "explanation": "interested in."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "We say “arrive at” (a place), not “arrive to”.",
      "explanation": "arrive at + place."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "“mustn't” = it's prohibited; “don't have to” = not necessary.",
      "explanation": "Prohibition → mustn't."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Obligation uses “have to / must”.",
      "explanation": "Obligation → have to."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Apagar = turn off; encender = turn on.",
      "explanation": "turn off = apagar."
    },
    {
      "id": "gi-match-pronouns",
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-basics",
      "tipo": "emparejar",
      "mechanic": "matching",
      "stage": [
        "p12",
        "p34"
      ],
      "edad": [
        5,
        9
      ],
      "nivel": "Pre-A1",
      "habilidad": "grammar",
      "difficulty": 2,
      "estimated_seconds": 65,
      "instruccion": "Une las parejas.",
      "instructions": {
        "p12": "Une las parejas.",
        "p34": "Une las parejas."
      },
      "hint": "We habla de un grupo que te incluye.",
      "explanation": "I: yo; you: tú; we: nosotros.",
      "feedback": {
        "incorrect": "We habla de un grupo que te incluye.",
        "correct": "I: yo; you: tú; we: nosotros.",
        "correctAnswer": "I: yo; you: tú; we: nosotros."
      },
      "variant_group": "gi-basics-gi-match-pronouns",
      "pares": [
        {
          "a": "I",
          "b": "yo"
        },
        {
          "a": "you",
          "b": "tú"
        },
        {
          "a": "we",
          "b": "nosotros"
        }
      ]
    },
    {
      "id": "gi-build-am",
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-verbs",
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
      "habilidad": "grammar",
      "difficulty": 2,
      "estimated_seconds": 60,
      "instruccion": "Forma la frase.",
      "instructions": {
        "p12": "Forma la frase.",
        "p34": "Forma la frase."
      },
      "hint": "Empieza por I.",
      "explanation": "Con I usamos am.",
      "feedback": {
        "incorrect": "Empieza por I.",
        "correct": "Con I usamos am.",
        "correctAnswer": "Con I usamos am."
      },
      "variant_group": "gi-verbs-gi-build-am",
      "palabras": [
        "I",
        "am",
        "happy."
      ],
      "respuesta": [
        "I",
        "am",
        "happy."
      ],
      "audio": "I am happy."
    },
    {
      "id": "gi-repeat-ready",
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-basics",
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
      "hint": "Escucha we are antes de ready.",
      "explanation": "We are ready significa Estamos listos.",
      "feedback": {
        "incorrect": "Escucha we are antes de ready.",
        "correct": "We are ready significa Estamos listos.",
        "correctAnswer": "We are ready significa Estamos listos."
      },
      "variant_group": "gi-basics-gi-repeat-ready",
      "frase": "We are ready.",
      "assessment": "self_report"
    },
    {
      "id": "gi-gap-is",
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-verbs",
      "tipo": "completar",
      "mechanic": "gap_fill",
      "stage": [
        "p34"
      ],
      "edad": [
        8,
        9
      ],
      "nivel": "A1",
      "habilidad": "grammar",
      "difficulty": 2,
      "estimated_seconds": 55,
      "instruccion": "Completa la frase.",
      "instructions": {
        "p34": "Completa la frase."
      },
      "hint": "Con she usamos is, no am.",
      "explanation": "She is my friend: ella es mi amiga.",
      "feedback": {
        "incorrect": "Con she usamos is, no am.",
        "correct": "She is my friend: ella es mi amiga.",
        "correctAnswer": "She is my friend: ella es mi amiga."
      },
      "variant_group": "gi-verbs-gi-gap-is",
      "prompt": "She ___ my friend. (be)",
      "respuesta": "is"
    },
    {
      "id": "gi-recall-under",
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-prepositions",
      "tipo": "recordar",
      "mechanic": "recall",
      "stage": [
        "p34"
      ],
      "edad": [
        8,
        9
      ],
      "nivel": "A1",
      "habilidad": "grammar",
      "difficulty": 2,
      "estimated_seconds": 50,
      "instruccion": "Escribe lo que recuerdas.",
      "instructions": {
        "p34": "Escribe lo que recuerdas."
      },
      "hint": "Empieza por un-.",
      "explanation": "Under indica que algo está debajo.",
      "feedback": {
        "incorrect": "Empieza por un-.",
        "correct": "Under indica que algo está debajo.",
        "correctAnswer": "Under indica que algo está debajo."
      },
      "variant_group": "gi-prepositions-gi-recall-under",
      "prompt": "Escribe en inglés: debajo de.",
      "respuesta": "under"
    },
    {
      "id": "gi-spell-they",
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-basics",
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
      "hint": "Empieza por th-.",
      "explanation": "They significa ellos o ellas.",
      "feedback": {
        "incorrect": "Empieza por th-.",
        "correct": "They significa ellos o ellas.",
        "correctAnswer": "They significa ellos o ellas."
      },
      "variant_group": "gi-basics-gi-spell-they",
      "prompt": "Forma la palabra para ellos/ellas.",
      "palabras": [
        "t",
        "h",
        "e",
        "y"
      ],
      "respuesta": [
        "t",
        "h",
        "e",
        "y"
      ]
    },
    {
      "id": "gi-sort-things",
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-basics",
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
      "hint": "Piensa en para qué sirve cada objeto.",
      "explanation": "We write with a pencil. We read a book.",
      "feedback": {
        "incorrect": "Piensa en para qué sirve cada objeto.",
        "correct": "We write with a pencil. We read a book.",
        "correctAnswer": "We write with a pencil. We read a book."
      },
      "variant_group": "gi-basics-gi-sort-things",
      "categories": [
        "Para escribir",
        "Para leer"
      ],
      "items": [
        {
          "text": "pencil",
          "visual": "pencil",
          "category": "Para escribir"
        },
        {
          "text": "book",
          "visual": "book",
          "category": "Para leer"
        }
      ]
    },
    {
      "id": "gm-gap-does",
      "unit_id": "gramatica-media",
      "objective_id": "gm-present",
      "tipo": "completar",
      "mechanic": "gap_fill",
      "stage": [
        "p56"
      ],
      "edad": [
        10,
        11
      ],
      "nivel": "A1",
      "habilidad": "grammar",
      "difficulty": 2,
      "estimated_seconds": 55,
      "instruccion": "Completa la frase.",
      "instructions": {
        "p56": "Completa la frase."
      },
      "hint": "La pregunta es sobre he.",
      "explanation": "Does introduce preguntas con he, she o it.",
      "feedback": {
        "incorrect": "La pregunta es sobre he.",
        "correct": "Does introduce preguntas con he, she o it.",
        "correctAnswer": "Does introduce preguntas con he, she o it."
      },
      "variant_group": "gm-present-gm-gap-does",
      "prompt": "___ your brother play tennis?",
      "respuesta": "Does"
    },
    {
      "id": "gm-recall-went",
      "unit_id": "gramatica-media",
      "objective_id": "gm-past",
      "tipo": "recordar",
      "mechanic": "recall",
      "stage": [
        "p56"
      ],
      "edad": [
        10,
        11
      ],
      "nivel": "A1",
      "habilidad": "grammar",
      "difficulty": 2,
      "estimated_seconds": 50,
      "instruccion": "Escribe lo que recuerdas.",
      "instructions": {
        "p56": "Escribe lo que recuerdas."
      },
      "hint": "Go es irregular en pasado.",
      "explanation": "El pasado de go es went.",
      "feedback": {
        "incorrect": "Go es irregular en pasado.",
        "correct": "El pasado de go es went.",
        "correctAnswer": "El pasado de go es went."
      },
      "variant_group": "gm-past-gm-recall-went",
      "prompt": "Yesterday I ___ to the park. (go)",
      "respuesta": "went"
    },
    {
      "id": "gm-sort-time",
      "unit_id": "gramatica-media",
      "objective_id": "gm-prepositions",
      "tipo": "clasificar",
      "mechanic": "classification",
      "stage": [
        "p56"
      ],
      "edad": [
        10,
        11
      ],
      "nivel": "A1",
      "habilidad": "grammar",
      "difficulty": 2,
      "estimated_seconds": 75,
      "instruccion": "Agrupa los elementos.",
      "instructions": {
        "p56": "Agrupa los elementos."
      },
      "hint": "Día, mes y hora llevan preposiciones diferentes.",
      "explanation": "On Monday, in July, at six.",
      "feedback": {
        "incorrect": "Día, mes y hora llevan preposiciones diferentes.",
        "correct": "On Monday, in July, at six.",
        "correctAnswer": "On Monday, in July, at six."
      },
      "variant_group": "gm-prepositions-gm-sort-time",
      "categories": [
        "in",
        "on",
        "at"
      ],
      "items": [
        {
          "text": "Monday",
          "category": "on"
        },
        {
          "text": "July",
          "category": "in"
        },
        {
          "text": "six o’clock",
          "category": "at"
        }
      ]
    },
    {
      "id": "gm-dialogue-do",
      "unit_id": "gramatica-media",
      "objective_id": "gm-present",
      "tipo": "dialogo",
      "mechanic": "dialogue",
      "stage": [
        "p56"
      ],
      "edad": [
        10,
        11
      ],
      "nivel": "A1",
      "habilidad": "speaking",
      "difficulty": 2,
      "estimated_seconds": 80,
      "instruccion": "Completa el diálogo.",
      "instructions": {
        "p56": "Completa el diálogo."
      },
      "hint": "Reutiliza el auxiliar de la pregunta.",
      "explanation": "Do you…? se responde con Yes, I do.",
      "feedback": {
        "incorrect": "Reutiliza el auxiliar de la pregunta.",
        "correct": "Do you…? se responde con Yes, I do.",
        "correctAnswer": "Do you…? se responde con Yes, I do."
      },
      "variant_group": "gm-present-gm-dialogue-do",
      "dialogue": [
        "A: Do you like music?",
        "B: Yes, I ___."
      ],
      "respuesta": "do"
    },
    {
      "id": "gm-dictate-didnt",
      "unit_id": "gramatica-media",
      "objective_id": "gm-past",
      "tipo": "dictado",
      "mechanic": "dictation",
      "stage": [
        "p56"
      ],
      "edad": [
        10,
        11
      ],
      "nivel": "A2",
      "habilidad": "listening",
      "difficulty": 3,
      "estimated_seconds": 70,
      "instruccion": "Escucha y escribe.",
      "instructions": {
        "p56": "Escucha y escribe."
      },
      "hint": "Escucha la negación antes de play.",
      "explanation": "Después de did not usamos play, no played.",
      "feedback": {
        "incorrect": "Escucha la negación antes de play.",
        "correct": "Después de did not usamos play, no played.",
        "correctAnswer": "Después de did not usamos play, no played."
      },
      "variant_group": "gm-past-gm-dictate-didnt",
      "audio": "She did not play football yesterday.",
      "respuesta": "She did not play football yesterday.",
      "accepted_answers": [
        "She didn't play football yesterday."
      ]
    },
    {
      "id": "gm-read-yesterday",
      "unit_id": "gramatica-media",
      "objective_id": "gm-past",
      "tipo": "comprension",
      "mechanic": "reading",
      "stage": [
        "p56"
      ],
      "edad": [
        10,
        11
      ],
      "nivel": "A1",
      "habilidad": "reading",
      "difficulty": 2,
      "estimated_seconds": 100,
      "instruccion": "Lee y responde.",
      "instructions": {
        "p56": "Lee y responde."
      },
      "hint": "Busca el verbo played.",
      "explanation": "Played chess expresa la actividad que sí hicieron.",
      "feedback": {
        "incorrect": "Busca el verbo played.",
        "correct": "Played chess expresa la actividad que sí hicieron.",
        "correctAnswer": "Played chess expresa la actividad que sí hicieron."
      },
      "variant_group": "gm-past-gm-read-yesterday",
      "estimulo": {
        "texto": "Yesterday Sam visited his cousin. They played chess indoors because it was cold. They did not go to the park."
      },
      "preguntas": [
        {
          "pregunta": "What did they do?",
          "opciones": [
            {
              "texto": "They played chess.",
              "correcta": true
            },
            {
              "texto": "They went to the park.",
              "correcta": false
            },
            {
              "texto": "They played football.",
              "correcta": false
            }
          ]
        }
      ]
    },
    {
      "id": "gm-write-yesterday",
      "unit_id": "gramatica-media",
      "objective_id": "gm-past",
      "tipo": "escritura_guiada",
      "mechanic": "guided_writing",
      "stage": [
        "p56"
      ],
      "edad": [
        10,
        11
      ],
      "nivel": "A2",
      "habilidad": "writing",
      "difficulty": 3,
      "estimated_seconds": 140,
      "instruccion": "Escribe y revisa tu texto.",
      "instructions": {
        "p56": "Escribe y revisa tu texto."
      },
      "hint": "Puedes usar visited y did not watch.",
      "explanation": "En negativa, el pasado lo expresa did y el verbo queda en forma base.",
      "feedback": {
        "incorrect": "Puedes usar visited y did not watch.",
        "correct": "En negativa, el pasado lo expresa did y el verbo queda en forma base.",
        "correctAnswer": "En negativa, el pasado lo expresa did y el verbo queda en forma base."
      },
      "variant_group": "gm-past-gm-write-yesterday",
      "prompt": "Write two sentences about yesterday. Use one positive and one negative sentence.",
      "respuesta": "I visited my cousin. I did not watch TV.",
      "assessment": "self_report",
      "min_words": 8,
      "rubric": [
        "I wrote about yesterday.",
        "I used one past verb.",
        "After did not, I used the base verb."
      ]
    },
    {
      "id": "ge-transform-present-perfect",
      "unit_id": "gramatica-eso",
      "objective_id": "ge-tenses",
      "tipo": "recordar",
      "mechanic": "recall",
      "stage": [
        "eso"
      ],
      "edad": [
        12,
        18
      ],
      "nivel": "B1",
      "habilidad": "grammar",
      "difficulty": 2,
      "estimated_seconds": 50,
      "instruccion": "Write the word from memory.",
      "instructions": {
        "eso": "Write the word from memory."
      },
      "hint": "The situation started in the past and continues now.",
      "explanation": "Use present perfect with since for a situation continuing now.",
      "feedback": {
        "incorrect": "The situation started in the past and continues now.",
        "correct": "Use present perfect with since for a situation continuing now.",
        "correctAnswer": "Use present perfect with since for a situation continuing now."
      },
      "variant_group": "ge-tenses-ge-transform-present-perfect",
      "prompt": "Rewrite with since: I started living here in 2020. → I ___ here since 2020.",
      "respuesta": "have lived",
      "accepted_answers": [
        "'ve lived"
      ]
    },
    {
      "id": "ge-gap-should",
      "unit_id": "gramatica-eso",
      "objective_id": "ge-modals",
      "tipo": "completar",
      "mechanic": "gap_fill",
      "stage": [
        "eso"
      ],
      "edad": [
        12,
        18
      ],
      "nivel": "A2",
      "habilidad": "grammar",
      "difficulty": 2,
      "estimated_seconds": 55,
      "instruccion": "Complete the sentence.",
      "instructions": {
        "eso": "Complete the sentence."
      },
      "hint": "This is advice, not an obligation.",
      "explanation": "Should expresses advice; must expresses a stronger obligation.",
      "feedback": {
        "incorrect": "This is advice, not an obligation.",
        "correct": "Should expresses advice; must expresses a stronger obligation.",
        "correctAnswer": "Should expresses advice; must expresses a stronger obligation."
      },
      "variant_group": "ge-modals-ge-gap-should",
      "prompt": "Use should or must: For gentle advice, say: You ___ take a break.",
      "respuesta": "should"
    },
    {
      "id": "ge-sort-since-for",
      "unit_id": "gramatica-eso",
      "objective_id": "ge-prepositions",
      "tipo": "clasificar",
      "mechanic": "classification",
      "stage": [
        "eso"
      ],
      "edad": [
        12,
        18
      ],
      "nivel": "B1",
      "habilidad": "grammar",
      "difficulty": 2,
      "estimated_seconds": 75,
      "instruccion": "Sort the items.",
      "instructions": {
        "eso": "Sort the items."
      },
      "hint": "Separate starting points from lengths of time.",
      "explanation": "Since marks a starting point; for marks a duration.",
      "feedback": {
        "incorrect": "Separate starting points from lengths of time.",
        "correct": "Since marks a starting point; for marks a duration.",
        "correctAnswer": "Since marks a starting point; for marks a duration."
      },
      "variant_group": "ge-prepositions-ge-sort-since-for",
      "categories": [
        "since",
        "for"
      ],
      "items": [
        {
          "text": "2020",
          "category": "since"
        },
        {
          "text": "three years",
          "category": "for"
        },
        {
          "text": "Monday",
          "category": "since"
        },
        {
          "text": "two hours",
          "category": "for"
        }
      ]
    },
    {
      "id": "ge-dialogue-advice",
      "unit_id": "gramatica-eso",
      "objective_id": "ge-modals",
      "tipo": "dialogo",
      "mechanic": "dialogue",
      "stage": [
        "eso"
      ],
      "edad": [
        12,
        18
      ],
      "nivel": "A2",
      "habilidad": "speaking",
      "difficulty": 2,
      "estimated_seconds": 80,
      "instruccion": "Complete the dialogue.",
      "instructions": {
        "eso": "Complete the dialogue."
      },
      "hint": "Use the modal for advice.",
      "explanation": "Should is followed by the base form: should go.",
      "feedback": {
        "incorrect": "Use the modal for advice.",
        "correct": "Should is followed by the base form: should go.",
        "correctAnswer": "Should is followed by the base form: should go."
      },
      "variant_group": "ge-modals-ge-dialogue-advice",
      "dialogue": [
        "A: I have an exam tomorrow and I feel tired.",
        "B: You ___ go to bed early. Use should."
      ],
      "respuesta": "should"
    },
    {
      "id": "ge-dictate-if",
      "unit_id": "gramatica-eso",
      "objective_id": "ge-tenses",
      "tipo": "dictado",
      "mechanic": "dictation",
      "stage": [
        "eso"
      ],
      "edad": [
        12,
        18
      ],
      "nivel": "B1",
      "habilidad": "listening",
      "difficulty": 3,
      "estimated_seconds": 70,
      "instruccion": "Listen and write.",
      "instructions": {
        "eso": "Listen and write."
      },
      "hint": "Listen for present tense after if.",
      "explanation": "In the first conditional, use present after if and will in the result.",
      "feedback": {
        "incorrect": "Listen for present tense after if.",
        "correct": "In the first conditional, use present after if and will in the result.",
        "correctAnswer": "In the first conditional, use present after if and will in the result."
      },
      "variant_group": "ge-tenses-ge-dictate-if",
      "audio": "If it rains, we will stay at home.",
      "respuesta": "If it rains, we will stay at home.",
      "accepted_answers": [
        "If it rains, we'll stay at home."
      ]
    },
    {
      "id": "ge-write-condition",
      "unit_id": "gramatica-eso",
      "objective_id": "ge-tenses",
      "tipo": "escritura_guiada",
      "mechanic": "guided_writing",
      "stage": [
        "eso"
      ],
      "edad": [
        12,
        18
      ],
      "nivel": "B1",
      "habilidad": "writing",
      "difficulty": 3,
      "estimated_seconds": 140,
      "instruccion": "Write and review your text.",
      "instructions": {
        "eso": "Write and review your text."
      },
      "hint": "Start with If it is… or If I have…",
      "explanation": "Compare the tense in each clause with the model.",
      "feedback": {
        "incorrect": "Start with If it is… or If I have…",
        "correct": "Compare the tense in each clause with the model.",
        "correctAnswer": "Compare the tense in each clause with the model."
      },
      "variant_group": "ge-tenses-ge-write-condition",
      "prompt": "Write two plans using if. Include a realistic condition and its result.",
      "respuesta": "If it is sunny, I will walk to school. If it rains, I will take the bus.",
      "assessment": "self_report",
      "min_words": 12,
      "rubric": [
        "Each sentence has a condition and a result.",
        "I used present tense after if.",
        "I used will or a valid modal in the result."
      ]
    },
    {
      "id": "ge-repeat-request",
      "unit_id": "gramatica-eso",
      "objective_id": "ge-modals",
      "tipo": "hablar",
      "mechanic": "speaking",
      "stage": [
        "eso"
      ],
      "edad": [
        12,
        18
      ],
      "nivel": "A2",
      "habilidad": "speaking",
      "difficulty": 2,
      "estimated_seconds": 60,
      "instruccion": "Listen and repeat.",
      "instructions": {
        "eso": "Listen and repeat."
      },
      "hint": "Listen for the polite opening Could you.",
      "explanation": "You practised a polite request for clarification.",
      "feedback": {
        "incorrect": "Listen for the polite opening Could you.",
        "correct": "You practised a polite request for clarification.",
        "correctAnswer": "You practised a polite request for clarification."
      },
      "variant_group": "ge-modals-ge-repeat-request",
      "frase": "Could you explain that again, please?",
      "assessment": "self_report"
    },
    {
      "id": "gi-find-a-book",
      "unit_id": "gramatica-inicial",
      "objective_id": "gi-basics",
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
      "habilidad": "grammar",
      "difficulty": 2,
      "estimated_seconds": 35,
      "instruccion": "Busca la imagen.",
      "instructions": {
        "p12": "Busca la imagen.",
        "p34": "Busca la imagen."
      },
      "hint": "A book es un libro.",
      "explanation": "A acompaña aquí a un objeto: a book.",
      "feedback": {
        "incorrect": "A book es un libro.",
        "correct": "A acompaña aquí a un objeto: a book.",
        "correctAnswer": "A acompaña aquí a un objeto: a book."
      },
      "variant_group": "gi-basics-gi-find-a-book",
      "prompt": "a book",
      "opciones": [
        {
          "texto": "book",
          "correcta": true,
          "visual": "book"
        },
        {
          "texto": "pencil",
          "correcta": false,
          "visual": "pencil"
        },
        {
          "texto": "chair",
          "correcta": false,
          "visual": "chair"
        }
      ]
    }
  ]
});
