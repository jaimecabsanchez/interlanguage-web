/* Pack editorial generado desde contenido.js; editar el dato, no el motor. */
ILContent.registerPack({
  "id": "primary-daily-routine",
  "version": 1,
  "stages": [
    "p34",
    "p56"
  ],
  "topic": "daily-routine",
  "units": [
    {
      "id": "rutina-diaria",
      "titulo": "Mi rutina diaria",
      "nivel": "A1",
      "etapa": "Primaria",
      "descripcion": "Las acciones del día: levantarse, desayunar, ir al cole…",
      "tema": {
        "icono": "☀️",
        "color": "#F4A73B"
      },
      "stage": [
        "p34",
        "p56"
      ],
      "topic": "daily-routine",
      "objective_ids": [
        "routine-actions"
      ]
    }
  ],
  "objectives": [
    {
      "id": "routine-actions",
      "skill": "vocabulary",
      "literacy_load": "medium",
      "description": "Comprender y producir acciones y horarios de la rutina diaria.",
      "unit_id": "rutina-diaria",
      "stage": [
        "p34",
        "p56"
      ],
      "cefr": "A1",
      "difficulty": 2,
      "requires_audio": false,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "daily-routine"
      ]
    }
  ],
  "exercises": [
    {
      "id": "rd-1",
      "tipo": "elegir_imagen",
      "habilidad": "vocabulary",
      "nivel": "A1",
      "edad": [
        6,
        11
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “desayunar” en inglés?",
      "instructions": {
        "p12": "¿Cómo se dice “desayunar” en inglés?",
        "p34": "¿Cómo se dice “desayunar” en inglés?",
        "p56": "Which expression means “desayunar”?",
        "eso": "Which expression means “to have breakfast”?"
      },
      "audio": "Have breakfast",
      "opciones": [
        {
          "visual": "have-breakfast",
          "texto": "have breakfast",
          "correcta": true
        },
        {
          "visual": "take-a-shower",
          "texto": "take a shower"
        },
        {
          "visual": "go-to-bed",
          "texto": "go to bed"
        },
        {
          "visual": "go-to-school",
          "texto": "go to school"
        }
      ],
      "explicacion": "Usamos have breakfast para hablar de desayunar.",
      "feedback": {
        "correct": "“Have breakfast” significa “desayunar”.",
        "incorrect": "Piensa en la comida que hacemos al empezar el día.",
        "context": "I have breakfast at seven o’clock.",
        "learnedExpressions": [
          "Have breakfast"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-actions",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 1,
      "variant_group": "routine-actions",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-2",
      "tipo": "elegir_texto",
      "habilidad": "reading",
      "nivel": "A1",
      "edad": [
        8,
        11
      ],
      "etiqueta": "Comprensión",
      "instruccion": "¿Qué significa “I wake up at seven”?",
      "feedback": {
        "correct": "“I wake up at seven” significa “Me levanto a las siete”.",
        "incorrect": "Busca la opción que habla del momento de despertarse.",
        "context": "I wake up at seven every weekday.",
        "learnedExpressions": [
          "Wake up"
        ]
      },
      "opciones": [
        {
          "texto": "Me levanto a las 7",
          "correcta": true
        },
        {
          "texto": "Ceno a las 7"
        },
        {
          "texto": "Me ducho a las 7"
        },
        {
          "texto": "Voy al cole a las 7"
        }
      ],
      "unit_id": "rutina-diaria",
      "objective_id": "routine-actions",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "routine-actions",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-3",
      "tipo": "ordenar",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        8,
        11
      ],
      "etiqueta": "Ordena la frase",
      "instruccion": "\"Me levanto a las ocho\"",
      "palabras": [
        "up",
        "I",
        "eight",
        "wake",
        "at"
      ],
      "respuesta": [
        "I",
        "wake",
        "up",
        "at",
        "eight"
      ],
      "unit_id": "rutina-diaria",
      "objective_id": "routine-actions",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "routine-actions",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-4",
      "tipo": "completar",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        8,
        11
      ],
      "etiqueta": "Gramática",
      "instruccion": "Completa: \"I ___ breakfast every day.\"",
      "opciones": [
        {
          "texto": "have",
          "correcta": true
        },
        {
          "texto": "has"
        },
        {
          "texto": "having"
        }
      ],
      "explicacion": "Con “I” usamos “have”: I have breakfast.",
      "feedback": {
        "correct": "Con “I” usamos “have”.",
        "incorrect": "Fíjate en el sujeto: con I no añadimos -s.",
        "context": "I have breakfast every day.",
        "learnedExpressions": [
          "Have breakfast"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-actions",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "routine-actions",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-5",
      "tipo": "hablar",
      "habilidad": "speaking",
      "nivel": "A1",
      "edad": [
        7,
        11
      ],
      "etiqueta": "A hablar",
      "instruccion": "Di en voz alta:",
      "frase": "What time do you wake up?",
      "unit_id": "rutina-diaria",
      "objective_id": "routine-actions",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "routine-actions",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-6",
      "tipo": "elegir_texto",
      "habilidad": "listening",
      "nivel": "A1",
      "edad": [
        9,
        11
      ],
      "etiqueta": "Listening",
      "instruccion": "Listen and choose the correct time.",
      "audio": "I go to school at half past eight.",
      "opciones": [
        {
          "texto": "8:30",
          "correcta": true
        },
        {
          "texto": "7:30"
        },
        {
          "texto": "8:15"
        },
        {
          "texto": "9:00"
        }
      ],
      "feedback": {
        "correct": "“Half past eight” means 8:30.",
        "incorrect": "“Half past” means thirty minutes after the hour.",
        "context": "I go to school at half past eight.",
        "learnedExpressions": [
          "Half past eight"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-actions",
      "stage": [
        "p34",
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "routine-actions",
      "tags": [
        "daily-routine"
      ]
    }
  ]
});
