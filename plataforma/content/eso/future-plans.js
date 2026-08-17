/* Pack editorial generado desde contenido.js; editar el dato, no el motor. */
ILContent.registerPack({
  "id": "eso-future-plans",
  "version": 1,
  "stages": [
    "eso"
  ],
  "topic": "future-plans",
  "units": [
    {
      "id": "future-plans",
      "titulo": "Plans for the weekend",
      "nivel": "A2",
      "etapa": "ESO",
      "descripcion": "Practicarás cómo proponer planes, responder y organizar una salida con amigos.",
      "tema": {
        "icono": "calendar",
        "color": "#163A5F"
      },
      "stage": [
        "eso"
      ],
      "topic": "future-plans",
      "objective_ids": [
        "plans-suggestions",
        "plans-arrangements",
        "plans-comprehension"
      ]
    }
  ],
  "objectives": [
    {
      "id": "plans-suggestions",
      "skill": "speaking",
      "literacy_load": "medium",
      "description": "Proponer, aceptar y negociar planes.",
      "unit_id": "future-plans",
      "stage": [
        "eso"
      ],
      "cefr": "A2",
      "difficulty": 2,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "future-plans"
      ]
    },
    {
      "id": "plans-arrangements",
      "skill": "grammar",
      "literacy_load": "high",
      "description": "Expresar y escribir planes acordados.",
      "unit_id": "future-plans",
      "stage": [
        "eso"
      ],
      "cefr": "A2",
      "difficulty": 2,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "future-plans"
      ]
    },
    {
      "id": "plans-comprehension",
      "skill": "reading",
      "literacy_load": "high",
      "description": "Comprender detalles de una conversación sobre planes.",
      "unit_id": "future-plans",
      "stage": [
        "eso"
      ],
      "cefr": "A2",
      "difficulty": 2,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "future-plans"
      ]
    }
  ],
  "exercises": [
    {
      "id": "fp-1",
      "tipo": "elegir_texto",
      "habilidad": "listening",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Listening",
      "instruccion": "Listen. What are they planning to do?",
      "audio": "Why don't we go to the concert on Saturday?",
      "opciones": [
        {
          "texto": "Go to a concert",
          "correcta": true
        },
        {
          "texto": "Study for an exam"
        },
        {
          "texto": "Play an online game"
        },
        {
          "texto": "Visit a museum"
        }
      ],
      "feedback": {
        "correct": "They are planning to go to a concert.",
        "incorrect": "Focus on the activity mentioned after “go to”.",
        "context": "Why don't we go to the concert on Saturday?",
        "learnedExpressions": [
          "Why don’t we…?"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-suggestions",
      "stage": [
        "eso"
      ],
      "difficulty": 2,
      "variant_group": "plans-suggestions",
      "tags": [
        "future-plans"
      ]
    },
    {
      "id": "fp-2",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Social English",
      "instruccion": "Which response accepts the invitation?",
      "opciones": [
        {
          "texto": "Sounds good to me.",
          "correcta": true
        },
        {
          "texto": "I haven't decided yet."
        },
        {
          "texto": "What happened yesterday?"
        },
        {
          "texto": "I don't know where it is."
        }
      ],
      "feedback": {
        "correct": "“Sounds good to me” shows that you like the plan.",
        "incorrect": "Choose the reply that clearly agrees with the suggestion.",
        "context": "Saturday afternoon? Sounds good to me.",
        "learnedExpressions": [
          "Sounds good to me"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-suggestions",
      "stage": [
        "eso"
      ],
      "difficulty": 2,
      "variant_group": "plans-suggestions",
      "tags": [
        "future-plans"
      ]
    },
    {
      "id": "fp-3",
      "tipo": "completar",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Grammar",
      "instruccion": "Complete the future arrangement: “We ___ meeting at six.”",
      "opciones": [
        {
          "texto": "are",
          "correcta": true
        },
        {
          "texto": "is"
        },
        {
          "texto": "do"
        },
        {
          "texto": "will be to"
        }
      ],
      "feedback": {
        "correct": "Use the present continuous for a fixed arrangement.",
        "incorrect": "The subject is “we”, so the auxiliary is “are”.",
        "context": "We are meeting at six.",
        "learnedExpressions": [
          "We are meeting at…"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-arrangements",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "plans-arrangements",
      "tags": [
        "future-plans"
      ]
    },
    {
      "id": "fp-4",
      "tipo": "ordenar",
      "habilidad": "writing",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Writing",
      "instruccion": "Put the message in the correct order.",
      "palabras": [
        "free",
        "you",
        "Are",
        "Saturday",
        "on"
      ],
      "respuesta": [
        "Are",
        "you",
        "free",
        "on",
        "Saturday"
      ],
      "unit_id": "future-plans",
      "objective_id": "plans-arrangements",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "plans-arrangements",
      "tags": [
        "future-plans"
      ]
    },
    {
      "id": "fp-5",
      "tipo": "comprension",
      "habilidad": "reading",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Reading",
      "instruccion": "Read the chat and answer.",
      "estimulo": {
        "texto": "Maya: I'm free after basketball practice. Leo: Great. Let's meet outside the cinema at 7:15. Maya: Perfect — I'll take the bus."
      },
      "preguntas": [
        {
          "pregunta": "Where are they meeting?",
          "opciones": [
            {
              "texto": "Outside the cinema",
              "correcta": true
            },
            {
              "texto": "At basketball practice"
            },
            {
              "texto": "At the bus stop"
            }
          ]
        },
        {
          "pregunta": "How will Maya get there?",
          "opciones": [
            {
              "texto": "By bus",
              "correcta": true
            },
            {
              "texto": "On foot"
            },
            {
              "texto": "By bike"
            }
          ]
        }
      ],
      "unit_id": "future-plans",
      "objective_id": "plans-comprehension",
      "stage": [
        "eso"
      ],
      "difficulty": 4,
      "variant_group": "plans-comprehension",
      "tags": [
        "future-plans"
      ]
    },
    {
      "id": "fp-6",
      "tipo": "elegir_texto",
      "habilidad": "speaking",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Conversation",
      "instruccion": "Your friend can't meet at six. What is the most natural reply?",
      "opciones": [
        {
          "texto": "No problem. How about seven?",
          "correcta": true
        },
        {
          "texto": "I met you yesterday."
        },
        {
          "texto": "Seven is a number."
        },
        {
          "texto": "You must be free."
        }
      ],
      "feedback": {
        "correct": "This keeps the conversation open and suggests an alternative.",
        "incorrect": "Choose the friendly reply that offers another time.",
        "context": "No problem. How about seven?",
        "learnedExpressions": [
          "How about…?"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-suggestions",
      "stage": [
        "eso"
      ],
      "difficulty": 2,
      "variant_group": "plans-suggestions",
      "tags": [
        "future-plans"
      ]
    },
    {
      "id": "fp-7",
      "tipo": "completar",
      "habilidad": "writing",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Message",
      "instruccion": "Complete the message: “Text me when you ___ there.”",
      "opciones": [
        {
          "texto": "get",
          "correcta": true
        },
        {
          "texto": "will get"
        },
        {
          "texto": "getting"
        },
        {
          "texto": "gets"
        }
      ],
      "feedback": {
        "correct": "After “when”, use the present simple to refer to the future.",
        "incorrect": "Time clauses with “when” use the present simple.",
        "context": "Text me when you get there.",
        "learnedExpressions": [
          "Text me when you get there"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-arrangements",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "plans-arrangements",
      "tags": [
        "future-plans"
      ]
    }
  ]
});
