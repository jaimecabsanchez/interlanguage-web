/* Banco editorial: metadatos explícitos y mecánicas reutilizables. */
ILContent.registerPack({
  "id": "eso-future-plans",
  "version": 2,
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
        "plans-comprehension",
        "plans-future-forms",
        "plans-vocabulary"
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
    },
    {
      "id": "plans-future-forms",
      "skill": "grammar",
      "literacy_load": "high",
      "description": "Formas de futuro: going to, will y present continuous.",
      "unit_id": "future-plans",
      "stage": [
        "eso"
      ],
      "cefr": "A2",
      "difficulty": 3,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "future-plans"
      ]
    },
    {
      "id": "plans-vocabulary",
      "skill": "vocabulary",
      "literacy_load": "medium",
      "description": "Actividades de ocio y expresiones sociales para quedar.",
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
      ],
      "mechanic": "listen_text",
      "estimated_seconds": 40,
      "hint": "Focus on the activity mentioned after “go to”.",
      "explanation": "They are planning to go to a concert."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Choose the reply that clearly agrees with the suggestion.",
      "explanation": "“Sounds good to me” shows that you like the plan."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 55,
      "hint": "The subject is “we”, so the auxiliary is “are”.",
      "explanation": "Use the present continuous for a fixed arrangement."
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
      ],
      "feedback": {
        "correct": "Correct order: “Are you free on Saturday.”. In English the subject comes first, then the verb.",
        "incorrect": "Look at the word order (subject + verb + …) and try again.",
        "context": "Are you free on Saturday.",
        "learnedExpressions": []
      },
      "mechanic": "sentence_order",
      "estimated_seconds": 60,
      "hint": "Look at the word order (subject + verb + …) and try again.",
      "explanation": "Correct order: “Are you free on Saturday.”. In English the subject comes first, then the verb."
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
      ],
      "feedback": {
        "correct": "Well done!",
        "incorrect": "Look again carefully and try once more.",
        "context": "",
        "learnedExpressions": []
      },
      "mechanic": "reading",
      "estimated_seconds": 100,
      "hint": "Look again carefully and try once more.",
      "explanation": "Well done!"
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Choose the friendly reply that offers another time.",
      "explanation": "This keeps the conversation open and suggests an alternative."
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 55,
      "hint": "Time clauses with “when” use the present simple.",
      "explanation": "After “when”, use the present simple to refer to the future."
    },
    {
      "id": "fp-8",
      "tipo": "completar",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Grammar",
      "instruccion": "Complete: “We ___ going to watch a film tonight.”",
      "opciones": [
        {
          "texto": "are",
          "correcta": true
        },
        {
          "texto": "is"
        },
        {
          "texto": "will"
        },
        {
          "texto": "were"
        }
      ],
      "feedback": {
        "correct": "“Be going to” for plans: we are going to watch.",
        "incorrect": "The subject is “we”, so use “are going to”.",
        "context": "We are going to watch a film tonight.",
        "learnedExpressions": [
          "be going to"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-future-forms",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "plans-future-forms",
      "tags": [
        "future-plans"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 55,
      "hint": "The subject is “we”, so use “are going to”.",
      "explanation": "“Be going to” for plans: we are going to watch."
    },
    {
      "id": "fp-9",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Grammar",
      "instruccion": "Look at the dark clouds. Choose the best sentence.",
      "opciones": [
        {
          "texto": "It's going to rain.",
          "correcta": true
        },
        {
          "texto": "It rains now."
        },
        {
          "texto": "It will rains."
        },
        {
          "texto": "It is rain."
        }
      ],
      "feedback": {
        "correct": "Use “going to” for predictions based on evidence.",
        "incorrect": "There is evidence (the clouds), so use “going to”.",
        "context": "It's going to rain, take an umbrella.",
        "learnedExpressions": [
          "It's going to rain"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-future-forms",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "plans-future-forms",
      "tags": [
        "future-plans"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "There is evidence (the clouds), so use “going to”.",
      "explanation": "Use “going to” for predictions based on evidence."
    },
    {
      "id": "fp-10",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Vocabulary",
      "instruccion": "Which phrase means “quedar con amigos”?",
      "opciones": [
        {
          "texto": "hang out with friends",
          "correcta": true
        },
        {
          "texto": "tidy my room"
        },
        {
          "texto": "do the washing-up"
        },
        {
          "texto": "go to bed early"
        }
      ],
      "feedback": {
        "correct": "“Hang out with friends” = quedar/pasar el rato con amigos.",
        "incorrect": "Look for a free-time activity with friends.",
        "context": "On Saturdays I hang out with friends.",
        "learnedExpressions": [
          "hang out with friends"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-vocabulary",
      "stage": [
        "eso"
      ],
      "difficulty": 2,
      "variant_group": "plans-vocabulary",
      "tags": [
        "future-plans"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Look for a free-time activity with friends.",
      "explanation": "“Hang out with friends” = quedar/pasar el rato con amigos."
    },
    {
      "id": "fp-11",
      "tipo": "ordenar",
      "habilidad": "writing",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Writing",
      "instruccion": "Put the question in order.",
      "palabras": [
        "doing",
        "are",
        "you",
        "What",
        "weekend",
        "this"
      ],
      "respuesta": [
        "What",
        "are",
        "you",
        "doing",
        "this",
        "weekend"
      ],
      "unit_id": "future-plans",
      "objective_id": "plans-future-forms",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "plans-future-forms",
      "tags": [
        "future-plans"
      ],
      "feedback": {
        "correct": "Correct order: “What are you doing this weekend.”. In English the subject comes first, then the verb.",
        "incorrect": "Look at the word order (subject + verb + …) and try again.",
        "context": "What are you doing this weekend.",
        "learnedExpressions": []
      },
      "mechanic": "sentence_order",
      "estimated_seconds": 60,
      "hint": "Look at the word order (subject + verb + …) and try again.",
      "explanation": "Correct order: “What are you doing this weekend.”. In English the subject comes first, then the verb."
    },
    {
      "id": "fp-12",
      "tipo": "ordenar",
      "habilidad": "writing",
      "nivel": "B1",
      "edad": [
        13,
        16
      ],
      "etiqueta": "Writing",
      "instruccion": "Put the sentence in order.",
      "palabras": [
        "going",
        "I'm",
        "visit",
        "to",
        "cousins",
        "my"
      ],
      "respuesta": [
        "I'm",
        "going",
        "to",
        "visit",
        "my",
        "cousins"
      ],
      "unit_id": "future-plans",
      "objective_id": "plans-future-forms",
      "stage": [
        "eso"
      ],
      "difficulty": 4,
      "variant_group": "plans-future-forms",
      "tags": [
        "future-plans"
      ],
      "feedback": {
        "correct": "Correct order: “I'm going to visit my cousins.”. In English the subject comes first, then the verb.",
        "incorrect": "Look at the word order (subject + verb + …) and try again.",
        "context": "I'm going to visit my cousins.",
        "learnedExpressions": []
      },
      "mechanic": "sentence_order",
      "estimated_seconds": 60,
      "hint": "Look at the word order (subject + verb + …) and try again.",
      "explanation": "Correct order: “I'm going to visit my cousins.”. In English the subject comes first, then the verb."
    },
    {
      "id": "fp-13",
      "tipo": "comprension",
      "habilidad": "reading",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Reading",
      "instruccion": "Read the invitation and answer.",
      "estimulo": {
        "texto": "Sam: Do you want to come to my house on Saturday? We can watch films and order pizza. Come at about 5 pm!"
      },
      "preguntas": [
        {
          "pregunta": "What does Sam suggest doing?",
          "opciones": [
            {
              "texto": "Watch films and eat pizza",
              "correcta": true
            },
            {
              "texto": "Play football in the park"
            },
            {
              "texto": "Study for an exam"
            }
          ]
        },
        {
          "pregunta": "What time should Leo arrive?",
          "opciones": [
            {
              "texto": "Around 5 pm",
              "correcta": true
            },
            {
              "texto": "At noon"
            },
            {
              "texto": "Early in the morning"
            }
          ]
        }
      ],
      "unit_id": "future-plans",
      "objective_id": "plans-comprehension",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "plans-comprehension",
      "tags": [
        "future-plans"
      ],
      "feedback": {
        "correct": "Well done!",
        "incorrect": "Look again carefully and try once more.",
        "context": "",
        "learnedExpressions": []
      },
      "mechanic": "reading",
      "estimated_seconds": 100,
      "hint": "Look again carefully and try once more.",
      "explanation": "Well done!"
    },
    {
      "id": "fp-14",
      "tipo": "comprension",
      "habilidad": "reading",
      "nivel": "B1",
      "edad": [
        13,
        16
      ],
      "etiqueta": "Reading",
      "instruccion": "Read the message and answer.",
      "estimulo": {
        "texto": "Hi! Our plan for Sunday has changed. The museum is closed, so we're going to the science park instead. We'll meet at the bus stop at 10, and bring a raincoat because it might rain later."
      },
      "preguntas": [
        {
          "pregunta": "Why did the plan change?",
          "opciones": [
            {
              "texto": "The museum is closed",
              "correcta": true
            },
            {
              "texto": "It is too expensive"
            },
            {
              "texto": "Nobody wants to go"
            }
          ]
        },
        {
          "pregunta": "What should they bring?",
          "opciones": [
            {
              "texto": "A raincoat",
              "correcta": true
            },
            {
              "texto": "A packed lunch"
            },
            {
              "texto": "Their tickets"
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
      ],
      "feedback": {
        "correct": "Well done!",
        "incorrect": "Look again carefully and try once more.",
        "context": "",
        "learnedExpressions": []
      },
      "mechanic": "reading",
      "estimated_seconds": 100,
      "hint": "Look again carefully and try once more.",
      "explanation": "Well done!"
    },
    {
      "id": "fp-15",
      "tipo": "elegir_texto",
      "habilidad": "listening",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Listening",
      "instruccion": "Listen. What time does the film start?",
      "audio": "The film starts at a quarter past eight.",
      "opciones": [
        {
          "texto": "8:15",
          "correcta": true
        },
        {
          "texto": "8:45"
        },
        {
          "texto": "7:15"
        },
        {
          "texto": "8:30"
        }
      ],
      "feedback": {
        "correct": "“A quarter past eight” is 8:15.",
        "incorrect": "“Quarter past” means fifteen minutes after the hour.",
        "context": "The film starts at a quarter past eight.",
        "learnedExpressions": [
          "a quarter past eight"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-comprehension",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "plans-comprehension",
      "tags": [
        "future-plans"
      ],
      "mechanic": "listen_text",
      "estimated_seconds": 40,
      "hint": "“Quarter past” means fifteen minutes after the hour.",
      "explanation": "“A quarter past eight” is 8:15."
    },
    {
      "id": "fp-16",
      "tipo": "elegir_texto",
      "habilidad": "speaking",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Conversation",
      "instruccion": "You can't go on Friday. Which reply is the most polite?",
      "opciones": [
        {
          "texto": "Sorry, I can't make it this time.",
          "correcta": true
        },
        {
          "texto": "No."
        },
        {
          "texto": "I don't want to."
        },
        {
          "texto": "That's your problem."
        }
      ],
      "feedback": {
        "correct": "This declines politely and keeps the friendship.",
        "incorrect": "Choose the reply that says no in a friendly, polite way.",
        "context": "Sorry, I can't make it this time. Maybe next week?",
        "learnedExpressions": [
          "I can't make it"
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Choose the reply that says no in a friendly, polite way.",
      "explanation": "This declines politely and keeps the friendship."
    },
    {
      "id": "fp-17",
      "tipo": "completar",
      "habilidad": "grammar",
      "nivel": "B1",
      "edad": [
        13,
        16
      ],
      "etiqueta": "Grammar",
      "instruccion": "First conditional: “If it rains, we ___ stay in.”",
      "opciones": [
        {
          "texto": "will",
          "correcta": true
        },
        {
          "texto": "are"
        },
        {
          "texto": "going to"
        },
        {
          "texto": "would"
        }
      ],
      "feedback": {
        "correct": "First conditional: if + present, … will + verb.",
        "incorrect": "After a present-tense “if” clause, use “will”.",
        "context": "If it rains, we will stay in.",
        "learnedExpressions": [
          "If it rains, we will…"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-future-forms",
      "stage": [
        "eso"
      ],
      "difficulty": 4,
      "variant_group": "plans-future-forms",
      "tags": [
        "future-plans"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 55,
      "hint": "After a present-tense “if” clause, use “will”.",
      "explanation": "First conditional: if + present, … will + verb."
    },
    {
      "id": "fp-18",
      "tipo": "emparejar",
      "habilidad": "vocabulary",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Social English",
      "instruccion": "Match each suggestion with a natural reply.",
      "pares": [
        {
          "a": "Why don't we go out?",
          "b": "Good idea!"
        },
        {
          "a": "Are you free on Friday?",
          "b": "Sorry, I'm busy."
        },
        {
          "a": "How about pizza?",
          "b": "Sounds great."
        }
      ],
      "unit_id": "future-plans",
      "objective_id": "plans-vocabulary",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "plans-vocabulary",
      "tags": [
        "future-plans"
      ],
      "feedback": {
        "correct": "Well done!",
        "incorrect": "Look again carefully and try once more.",
        "context": "",
        "learnedExpressions": []
      },
      "mechanic": "matching",
      "estimated_seconds": 65,
      "hint": "Look again carefully and try once more.",
      "explanation": "Well done!"
    },
    {
      "id": "fp-19",
      "tipo": "hablar",
      "habilidad": "speaking",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Speaking",
      "instruccion": "Say it out loud:",
      "frase": "Would you like to come to the cinema?",
      "unit_id": "future-plans",
      "objective_id": "plans-suggestions",
      "stage": [
        "eso"
      ],
      "difficulty": 2,
      "variant_group": "plans-suggestions",
      "tags": [
        "future-plans"
      ],
      "mechanic": "speaking",
      "estimated_seconds": 60,
      "assessment": "self_report",
      "hint": "Listen to the model in short chunks.",
      "explanation": "You practised saying: Would you like to come to the cinema?",
      "feedback": {
        "incorrect": "Listen to the model in short chunks.",
        "correct": "You practised saying: Would you like to come to the cinema?"
      }
    },
    {
      "id": "fp-20",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Grammar",
      "instruccion": "Complete: “What ___ you doing tonight?”",
      "opciones": [
        {
          "texto": "are",
          "correcta": true
        },
        {
          "texto": "do"
        },
        {
          "texto": "will"
        },
        {
          "texto": "is"
        }
      ],
      "feedback": {
        "correct": "Present continuous for arrangements: What are you doing?",
        "incorrect": "Use “are” + -ing for a fixed plan tonight.",
        "context": "What are you doing tonight?",
        "learnedExpressions": [
          "What are you doing tonight?"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-future-forms",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "plans-future-forms",
      "tags": [
        "future-plans"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Use “are” + -ing for a fixed plan tonight.",
      "explanation": "Present continuous for arrangements: What are you doing?"
    },
    {
      "id": "fp-21",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "B1",
      "edad": [
        13,
        16
      ],
      "etiqueta": "Social English",
      "instruccion": "A friend says “Do you fancy a coffee?”. What does it mean?",
      "opciones": [
        {
          "texto": "Would you like a coffee?",
          "correcta": true
        },
        {
          "texto": "Do you have a coffee?"
        },
        {
          "texto": "Is the coffee good?"
        },
        {
          "texto": "Where is the coffee?"
        }
      ],
      "feedback": {
        "correct": "“Do you fancy…?” is an informal way to say “Would you like…?”.",
        "incorrect": "“Fancy” here means “would like”.",
        "context": "Do you fancy a coffee after class?",
        "learnedExpressions": [
          "Do you fancy…?"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-vocabulary",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "plans-vocabulary",
      "tags": [
        "future-plans"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "“Fancy” here means “would like”.",
      "explanation": "“Do you fancy…?” is an informal way to say “Would you like…?”."
    },
    {
      "id": "fp-22",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Vocabulary",
      "instruccion": "Which word means the same as “to arrange”?",
      "opciones": [
        {
          "texto": "to organise",
          "correcta": true
        },
        {
          "texto": "to forget"
        },
        {
          "texto": "to cancel"
        },
        {
          "texto": "to lose"
        }
      ],
      "feedback": {
        "correct": "“Arrange” ≈ “organise”.",
        "incorrect": "“Arrange” means to organise or plan something.",
        "context": "Let's arrange a meeting.",
        "learnedExpressions": [
          "to arrange"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-vocabulary",
      "stage": [
        "eso"
      ],
      "difficulty": 2,
      "variant_group": "plans-vocabulary",
      "tags": [
        "future-plans"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "“Arrange” means to organise or plan something.",
      "explanation": "“Arrange” ≈ “organise”."
    },
    {
      "id": "fp-23",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Grammar",
      "instruccion": "Complete: “I ___ meet my friends tomorrow.” (a plan you decided before)",
      "opciones": [
        {
          "texto": "'m going to",
          "correcta": true
        },
        {
          "texto": "go"
        },
        {
          "texto": "went"
        },
        {
          "texto": "was"
        }
      ],
      "feedback": {
        "correct": "Plans decided before speaking → “be going to”.",
        "incorrect": "For plans we use “be going to”.",
        "context": "I'm going to meet my friends tomorrow.",
        "learnedExpressions": [
          "be going to"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-future-forms",
      "stage": [
        "eso"
      ],
      "difficulty": 2,
      "variant_group": "plans-future-forms",
      "tags": [
        "future-plans"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "For plans we use “be going to”.",
      "explanation": "Plans decided before speaking → “be going to”."
    },
    {
      "id": "fp-24",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Grammar",
      "instruccion": "Complete: “We ___ having dinner at 8 tonight.” (a fixed arrangement)",
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
        },
        {
          "texto": "be"
        }
      ],
      "feedback": {
        "correct": "Present continuous for arrangements: “We are having…”.",
        "incorrect": "With “we” use “are”.",
        "context": "We are having dinner at 8 tonight.",
        "learnedExpressions": [
          "present continuous for arrangements"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-arrangements",
      "stage": [
        "eso"
      ],
      "difficulty": 2,
      "variant_group": "plans-arrangements",
      "tags": [
        "future-plans"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "With “we” use “are”.",
      "explanation": "Present continuous for arrangements: “We are having…”."
    },
    {
      "id": "fp-25",
      "tipo": "elegir_texto",
      "habilidad": "reading",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Reading",
      "instruccion": "Read: “Sara is going to visit her grandma on Sunday.” When is the visit?",
      "opciones": [
        {
          "texto": "On Sunday",
          "correcta": true
        },
        {
          "texto": "On Monday"
        },
        {
          "texto": "Today"
        },
        {
          "texto": "Tomorrow"
        }
      ],
      "feedback": {
        "correct": "The text says “on Sunday”.",
        "incorrect": "Look for the day: “on Sunday”.",
        "context": "Sara is going to visit her grandma on Sunday.",
        "learnedExpressions": [
          "be going to"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-comprehension",
      "stage": [
        "eso"
      ],
      "difficulty": 2,
      "variant_group": "plans-comprehension",
      "tags": [
        "future-plans"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Look for the day: “on Sunday”.",
      "explanation": "The text says “on Sunday”."
    },
    {
      "id": "fp-26",
      "tipo": "elegir_texto",
      "habilidad": "speaking",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Speaking",
      "instruccion": "Which sentence is a suggestion?",
      "opciones": [
        {
          "texto": "Why don't we go to the cinema?",
          "correcta": true
        },
        {
          "texto": "I went to the cinema."
        },
        {
          "texto": "Do you have a cinema?"
        },
        {
          "texto": "The cinema is big."
        }
      ],
      "feedback": {
        "correct": "“Why don't we…?” makes a suggestion.",
        "incorrect": "A suggestion invites someone to do something: “Why don't we…?”.",
        "context": "Why don't we go to the cinema tonight?",
        "learnedExpressions": [
          "Why don't we…?"
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "A suggestion invites someone to do something: “Why don't we…?”.",
      "explanation": "“Why don't we…?” makes a suggestion."
    },
    {
      "id": "fp-27",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Grammar",
      "instruccion": "Complete: “Look at those clouds! It ___ rain.”",
      "opciones": [
        {
          "texto": "is going to",
          "correcta": true
        },
        {
          "texto": "will be"
        },
        {
          "texto": "goes to"
        },
        {
          "texto": "rains"
        }
      ],
      "feedback": {
        "correct": "Prediction with evidence → “be going to”: it is going to rain.",
        "incorrect": "There is evidence (the clouds), so use “be going to”.",
        "context": "Look at those clouds! It is going to rain.",
        "learnedExpressions": [
          "be going to (prediction)"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-future-forms",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "plans-future-forms",
      "tags": [
        "future-plans"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "There is evidence (the clouds), so use “be going to”.",
      "explanation": "Prediction with evidence → “be going to”: it is going to rain."
    },
    {
      "id": "fp-28",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Grammar",
      "instruccion": "Complete: “What time ___ you meeting Sam tomorrow?”",
      "opciones": [
        {
          "texto": "are",
          "correcta": true
        },
        {
          "texto": "do"
        },
        {
          "texto": "is"
        },
        {
          "texto": "will"
        }
      ],
      "feedback": {
        "correct": "Present continuous for arrangements: “are you meeting”.",
        "incorrect": "Arrangement → present continuous: “are you meeting…?”.",
        "context": "What time are you meeting Sam tomorrow?",
        "learnedExpressions": [
          "present continuous for arrangements"
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
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "Arrangement → present continuous: “are you meeting…?”.",
      "explanation": "Present continuous for arrangements: “are you meeting”."
    },
    {
      "id": "fp-29",
      "tipo": "elegir_texto",
      "habilidad": "reading",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Reading",
      "instruccion": "Read: “We're meeting at the station at 6, then taking the 6:15 train.” Which train are they taking?",
      "opciones": [
        {
          "texto": "The 6:15 train",
          "correcta": true
        },
        {
          "texto": "The 6:00 train"
        },
        {
          "texto": "A bus"
        },
        {
          "texto": "A taxi"
        }
      ],
      "feedback": {
        "correct": "They take “the 6:15 train”.",
        "incorrect": "They meet at 6 but take the 6:15 train.",
        "context": "…then taking the 6:15 train.",
        "learnedExpressions": [
          "present continuous for arrangements"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-comprehension",
      "stage": [
        "eso"
      ],
      "difficulty": 3,
      "variant_group": "plans-comprehension",
      "tags": [
        "future-plans"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "They meet at 6 but take the 6:15 train.",
      "explanation": "They take “the 6:15 train”."
    },
    {
      "id": "fp-30",
      "tipo": "ordenar",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Order the sentence",
      "instruccion": "“I am going to study tonight”",
      "palabras": [
        "going",
        "I",
        "study",
        "am",
        "to",
        "tonight"
      ],
      "respuesta": [
        "I",
        "am",
        "going",
        "to",
        "study",
        "tonight"
      ],
      "unit_id": "future-plans",
      "objective_id": "plans-future-forms",
      "stage": [
        "eso"
      ],
      "difficulty": 2,
      "variant_group": "plans-future-forms",
      "tags": [
        "future-plans"
      ],
      "feedback": {
        "correct": "Correct order: “I am going to study tonight.”. In English the subject comes first, then the verb.",
        "incorrect": "Look at the word order (subject + verb + …) and try again.",
        "context": "I am going to study tonight.",
        "learnedExpressions": []
      },
      "mechanic": "sentence_order",
      "estimated_seconds": 60,
      "hint": "Look at the word order (subject + verb + …) and try again.",
      "explanation": "Correct order: “I am going to study tonight.”. In English the subject comes first, then the verb."
    },
    {
      "id": "fp-31",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "A2",
      "edad": [
        12,
        16
      ],
      "etiqueta": "Vocabulary",
      "instruccion": "Which word is about the future?",
      "opciones": [
        {
          "texto": "an arrangement",
          "correcta": true
        },
        {
          "texto": "a memory"
        },
        {
          "texto": "the past"
        },
        {
          "texto": "childhood"
        }
      ],
      "feedback": {
        "correct": "An “arrangement” is a plan for the future.",
        "incorrect": "An arrangement is a future plan; the others look back.",
        "context": "We have an arrangement for Friday.",
        "learnedExpressions": [
          "an arrangement"
        ]
      },
      "unit_id": "future-plans",
      "objective_id": "plans-vocabulary",
      "stage": [
        "eso"
      ],
      "difficulty": 2,
      "variant_group": "plans-vocabulary",
      "tags": [
        "future-plans"
      ],
      "mechanic": "gap_fill",
      "estimated_seconds": 40,
      "hint": "An arrangement is a future plan; the others look back.",
      "explanation": "An “arrangement” is a plan for the future."
    },
    {
      "id": "plans-recall-ticket",
      "unit_id": "future-plans",
      "objective_id": "plans-vocabulary",
      "tipo": "recordar",
      "mechanic": "recall",
      "stage": [
        "eso"
      ],
      "edad": [
        12,
        18
      ],
      "nivel": "A2",
      "habilidad": "vocabulary",
      "difficulty": 2,
      "estimated_seconds": 50,
      "instruccion": "Write the word from memory.",
      "instructions": {
        "eso": "Write the word from memory."
      },
      "hint": "It starts with t and ends with t.",
      "explanation": "A ticket gives you the right to travel on a service.",
      "feedback": {
        "incorrect": "It starts with t and ends with t.",
        "correct": "A ticket gives you the right to travel on a service.",
        "correctAnswer": "A ticket gives you the right to travel on a service."
      },
      "variant_group": "plans-vocabulary-plans-recall-ticket",
      "prompt": "One word: the document you buy to travel on a train.",
      "respuesta": "ticket"
    },
    {
      "id": "plans-gap-meeting",
      "unit_id": "future-plans",
      "objective_id": "plans-arrangements",
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
      "hint": "Use the present continuous for an arrangement.",
      "explanation": "We are meeting describes an agreed future arrangement.",
      "feedback": {
        "incorrect": "Use the present continuous for an arrangement.",
        "correct": "We are meeting describes an agreed future arrangement.",
        "correctAnswer": "We are meeting describes an agreed future arrangement."
      },
      "variant_group": "plans-arrangements-plans-gap-meeting",
      "prompt": "We ___ meeting outside the cinema at six.",
      "respuesta": "are"
    },
    {
      "id": "plans-dialogue-invite",
      "unit_id": "future-plans",
      "objective_id": "plans-suggestions",
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
      "hint": "Complete the polite expression I would… to.",
      "explanation": "I would love to is a polite way to respond to an invitation.",
      "feedback": {
        "incorrect": "Complete the polite expression I would… to.",
        "correct": "I would love to is a polite way to respond to an invitation.",
        "correctAnswer": "I would love to is a polite way to respond to an invitation."
      },
      "variant_group": "plans-suggestions-plans-dialogue-invite",
      "dialogue": [
        "A: Would you like to come to the concert?",
        "B: I would ___ to, but I am busy."
      ],
      "respuesta": "love"
    },
    {
      "id": "plans-order-weekend",
      "unit_id": "future-plans",
      "objective_id": "plans-vocabulary",
      "tipo": "ordenar_palabra",
      "mechanic": "word_order",
      "stage": [
        "eso"
      ],
      "edad": [
        12,
        18
      ],
      "nivel": "A1",
      "habilidad": "writing",
      "difficulty": 2,
      "estimated_seconds": 50,
      "instruccion": "Put the letters in order.",
      "instructions": {
        "eso": "Put the letters in order."
      },
      "hint": "The word combines week and end.",
      "explanation": "Weekend combines week + end.",
      "feedback": {
        "incorrect": "The word combines week and end.",
        "correct": "Weekend combines week + end.",
        "correctAnswer": "Weekend combines week + end."
      },
      "variant_group": "plans-vocabulary-plans-order-weekend",
      "prompt": "Spell the word for Saturday and Sunday together.",
      "palabras": [
        "w",
        "e",
        "e",
        "k",
        "e",
        "n",
        "d"
      ],
      "respuesta": [
        "w",
        "e",
        "e",
        "k",
        "e",
        "n",
        "d"
      ]
    },
    {
      "id": "plans-sort-functions",
      "unit_id": "future-plans",
      "objective_id": "plans-future-forms",
      "tipo": "clasificar",
      "mechanic": "classification",
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
      "estimated_seconds": 75,
      "instruccion": "Sort the items.",
      "instructions": {
        "eso": "Sort the items."
      },
      "hint": "An arrangement was agreed before speaking.",
      "explanation": "Present continuous often describes arrangements; will can express a decision made now.",
      "feedback": {
        "incorrect": "An arrangement was agreed before speaking.",
        "correct": "Present continuous often describes arrangements; will can express a decision made now.",
        "correctAnswer": "Present continuous often describes arrangements; will can express a decision made now."
      },
      "variant_group": "plans-future-forms-plans-sort-functions",
      "categories": [
        "Arrangement",
        "Spontaneous decision"
      ],
      "items": [
        {
          "text": "We are meeting Jo at six.",
          "category": "Arrangement"
        },
        {
          "text": "The phone is ringing. I will answer it.",
          "category": "Spontaneous decision"
        },
        {
          "text": "I am flying to Rome on Friday.",
          "category": "Arrangement"
        }
      ]
    },
    {
      "id": "plans-dictate-platform",
      "unit_id": "future-plans",
      "objective_id": "plans-comprehension",
      "tipo": "dictado",
      "mechanic": "dictation",
      "stage": [
        "eso"
      ],
      "edad": [
        12,
        18
      ],
      "nivel": "A2",
      "habilidad": "listening",
      "difficulty": 3,
      "estimated_seconds": 70,
      "instruccion": "Listen and write.",
      "instructions": {
        "eso": "Listen and write."
      },
      "hint": "Listen separately for the platform and departure time.",
      "explanation": "The announcement gives platform three and a departure time of 9:30.",
      "feedback": {
        "incorrect": "Listen separately for the platform and departure time.",
        "correct": "The announcement gives platform three and a departure time of 9:30.",
        "correctAnswer": "The announcement gives platform three and a departure time of 9:30."
      },
      "variant_group": "plans-comprehension-plans-dictate-platform",
      "audio": "The train leaves from platform three at half past nine.",
      "respuesta": "The train leaves from platform three at half past nine."
    },
    {
      "id": "plans-write-message",
      "unit_id": "future-plans",
      "objective_id": "plans-suggestions",
      "tipo": "escritura_guiada",
      "mechanic": "guided_writing",
      "stage": [
        "eso"
      ],
      "edad": [
        12,
        18
      ],
      "nivel": "A2",
      "habilidad": "writing",
      "difficulty": 3,
      "estimated_seconds": 140,
      "instruccion": "Write and review your text.",
      "instructions": {
        "eso": "Write and review your text."
      },
      "hint": "You can open with Would you like to…?",
      "explanation": "Compare your invitation, place and time with the model.",
      "feedback": {
        "incorrect": "You can open with Would you like to…?",
        "correct": "Compare your invitation, place and time with the model.",
        "correctAnswer": "Compare your invitation, place and time with the model."
      },
      "variant_group": "plans-suggestions-plans-write-message",
      "prompt": "Write a short message inviting a friend to meet this weekend. Suggest a place and a time.",
      "respuesta": "Hi Jo! Would you like to meet at the park on Saturday at three? Let me know!",
      "assessment": "self_report",
      "min_words": 12,
      "rubric": [
        "I included an invitation.",
        "I suggested a place and a time.",
        "My friend can understand how to reply."
      ]
    },
    {
      "id": "plans-repeat-check",
      "unit_id": "future-plans",
      "objective_id": "plans-arrangements",
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
      "hint": "Stress station and ten to make the arrangement clear.",
      "explanation": "You practised confirming a meeting place and time.",
      "feedback": {
        "incorrect": "Stress station and ten to make the arrangement clear.",
        "correct": "You practised confirming a meeting place and time.",
        "correctAnswer": "You practised confirming a meeting place and time."
      },
      "variant_group": "plans-arrangements-plans-repeat-check",
      "frase": "Shall we meet outside the station at ten?",
      "assessment": "self_report"
    }
  ]
});
