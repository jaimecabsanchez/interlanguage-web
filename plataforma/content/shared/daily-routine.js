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
      "visual": "routine",
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
        "routine-actions",
        "routine-times",
        "routine-grammar",
        "routine-speaking"
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
    },
    {
      "id": "routine-times",
      "skill": "listening",
      "literacy_load": "low",
      "description": "Decir y entender las horas de la rutina diaria.",
      "unit_id": "rutina-diaria",
      "stage": [
        "p34",
        "p56"
      ],
      "cefr": "A1",
      "difficulty": 2,
      "requires_audio": true,
      "requires_visual": false,
      "requires_writing": false,
      "prerequisites": [],
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "routine-grammar",
      "skill": "grammar",
      "literacy_load": "medium",
      "description": "Presente simple y adverbios de frecuencia en la rutina.",
      "unit_id": "rutina-diaria",
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
        "daily-routine"
      ]
    },
    {
      "id": "routine-speaking",
      "skill": "speaking",
      "literacy_load": "none",
      "description": "Preguntar y responder sobre la rutina diaria.",
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
      ],
      "feedback": {
        "correct": "Orden correcto: «I wake up at eight.». En inglés va primero el sujeto y luego el verbo.",
        "incorrect": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
        "context": "I wake up at eight.",
        "learnedExpressions": []
      }
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
    },
    {
      "id": "rd-7",
      "tipo": "elegir_imagen",
      "habilidad": "vocabulary",
      "nivel": "A1",
      "edad": [
        8,
        11
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “ducharse” en inglés?",
      "instructions": {
        "p34": "¿Cómo se dice “ducharse” en inglés?",
        "p56": "Which one means “take a shower”?"
      },
      "audio": "Take a shower",
      "opciones": [
        {
          "visual": "take-a-shower",
          "texto": "take a shower",
          "correcta": true
        },
        {
          "visual": "have-breakfast",
          "texto": "have breakfast"
        },
        {
          "visual": "go-to-bed",
          "texto": "go to bed"
        }
      ],
      "feedback": {
        "correct": "“Take a shower” significa “ducharse”.",
        "incorrect": "Es lo que hacemos con agua para lavarnos.",
        "context": "I take a shower before school.",
        "learnedExpressions": [
          "Take a shower"
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
      "id": "rd-8",
      "tipo": "elegir_imagen",
      "habilidad": "vocabulary",
      "nivel": "A1",
      "edad": [
        8,
        11
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cuál significa “ir al cole”?",
      "instructions": {
        "p34": "¿Cuál significa “ir al cole”?",
        "p56": "Which one means “go to school”?"
      },
      "audio": "Go to school",
      "opciones": [
        {
          "visual": "go-to-school",
          "texto": "go to school",
          "correcta": true
        },
        {
          "visual": "have-breakfast",
          "texto": "have breakfast"
        },
        {
          "visual": "go-to-bed",
          "texto": "go to bed"
        }
      ],
      "feedback": {
        "correct": "“Go to school” significa “ir al colegio”.",
        "incorrect": "Piensa en salir de casa hacia el colegio.",
        "context": "I go to school at half past eight.",
        "learnedExpressions": [
          "Go to school"
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
      "id": "rd-9",
      "tipo": "elegir_imagen",
      "habilidad": "listening",
      "nivel": "A1",
      "edad": [
        8,
        11
      ],
      "etiqueta": "Listening",
      "instruccion": "Listen and choose.",
      "audio": "Go to bed",
      "opciones": [
        {
          "visual": "go-to-bed",
          "texto": "go to bed",
          "correcta": true
        },
        {
          "visual": "take-a-shower",
          "texto": "take a shower"
        },
        {
          "visual": "go-to-school",
          "texto": "go to school"
        }
      ],
      "feedback": {
        "correct": "“Go to bed” significa “irse a la cama”.",
        "incorrect": "Escucha otra vez: es lo que hacemos por la noche.",
        "context": "I go to bed at nine o’clock.",
        "learnedExpressions": [
          "Go to bed"
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
    },
    {
      "id": "rd-10",
      "tipo": "elegir_texto",
      "habilidad": "reading",
      "nivel": "A1",
      "edad": [
        9,
        11
      ],
      "etiqueta": "Comprensión",
      "instruccion": "¿Qué significa “I brush my teeth”?",
      "instructions": {
        "p56": "What does “I brush my teeth” mean?"
      },
      "opciones": [
        {
          "texto": "Me lavo los dientes",
          "correcta": true
        },
        {
          "texto": "Me lavo las manos"
        },
        {
          "texto": "Me peino"
        },
        {
          "texto": "Me ducho"
        }
      ],
      "feedback": {
        "correct": "“Brush my teeth” es “lavarse los dientes”.",
        "incorrect": "“Teeth” son los dientes.",
        "context": "I brush my teeth after breakfast.",
        "learnedExpressions": [
          "Brush my teeth"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-actions",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "routine-actions",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-11",
      "tipo": "completar",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        9,
        11
      ],
      "etiqueta": "Gramática",
      "instruccion": "Completa: “She ___ up at seven.”",
      "opciones": [
        {
          "texto": "wakes",
          "correcta": true
        },
        {
          "texto": "wake"
        },
        {
          "texto": "waking"
        }
      ],
      "explicacion": "Con he/she/it añadimos -s: she wakes up.",
      "feedback": {
        "correct": "Con “she” añadimos -s: she wakes up.",
        "incorrect": "Fíjate en el sujeto: he/she/it lleva -s.",
        "context": "She wakes up at seven.",
        "learnedExpressions": [
          "She wakes up"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-grammar",
      "stage": [
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "routine-grammar",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-12",
      "tipo": "completar",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        9,
        11
      ],
      "etiqueta": "Gramática",
      "instruccion": "Completa: “He ___ to school by bus.”",
      "opciones": [
        {
          "texto": "goes",
          "correcta": true
        },
        {
          "texto": "go"
        },
        {
          "texto": "going"
        }
      ],
      "explicacion": "He/she/it: go → goes.",
      "feedback": {
        "correct": "“He goes to school.” Con he usamos goes.",
        "incorrect": "Con he/she/it, go se convierte en goes.",
        "context": "He goes to school by bus.",
        "learnedExpressions": [
          "He goes to school"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-grammar",
      "stage": [
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "routine-grammar",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-13",
      "tipo": "ordenar",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        9,
        11
      ],
      "etiqueta": "Ordena la frase",
      "instruccion": "\"Voy al cole a las ocho\"",
      "palabras": [
        "to",
        "I",
        "school",
        "go",
        "eight",
        "at"
      ],
      "respuesta": [
        "I",
        "go",
        "to",
        "school",
        "at",
        "eight"
      ],
      "unit_id": "rutina-diaria",
      "objective_id": "routine-grammar",
      "stage": [
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "routine-grammar",
      "tags": [
        "daily-routine"
      ],
      "feedback": {
        "correct": "Orden correcto: «I go to school at eight.». En inglés va primero el sujeto y luego el verbo.",
        "incorrect": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
        "context": "I go to school at eight.",
        "learnedExpressions": []
      }
    },
    {
      "id": "rd-14",
      "tipo": "elegir_texto",
      "habilidad": "listening",
      "nivel": "A1",
      "edad": [
        9,
        11
      ],
      "etiqueta": "Listening",
      "instruccion": "Listen and choose the correct time.",
      "audio": "I get up at quarter past seven.",
      "opciones": [
        {
          "texto": "7:15",
          "correcta": true
        },
        {
          "texto": "7:45"
        },
        {
          "texto": "6:15"
        },
        {
          "texto": "7:30"
        }
      ],
      "feedback": {
        "correct": "“Quarter past seven” means 7:15.",
        "incorrect": "“Quarter past” means fifteen minutes after the hour.",
        "context": "I get up at quarter past seven.",
        "learnedExpressions": [
          "Quarter past seven"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-times",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "routine-times",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-15",
      "tipo": "elegir_texto",
      "habilidad": "listening",
      "nivel": "A2",
      "edad": [
        10,
        11
      ],
      "etiqueta": "Listening",
      "instruccion": "Listen and choose the correct time.",
      "audio": "School starts at quarter to nine.",
      "opciones": [
        {
          "texto": "8:45",
          "correcta": true
        },
        {
          "texto": "9:15"
        },
        {
          "texto": "8:15"
        },
        {
          "texto": "9:45"
        }
      ],
      "feedback": {
        "correct": "“Quarter to nine” means 8:45.",
        "incorrect": "“Quarter to” means fifteen minutes before the hour.",
        "context": "School starts at quarter to nine.",
        "learnedExpressions": [
          "Quarter to nine"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-times",
      "stage": [
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "routine-times",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-16",
      "tipo": "completar",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        10,
        11
      ],
      "etiqueta": "Frecuencia",
      "instruccion": "Completa: “I ___ get up early on Sundays.”",
      "opciones": [
        {
          "texto": "never",
          "correcta": true
        },
        {
          "texto": "am"
        },
        {
          "texto": "very"
        },
        {
          "texto": "to"
        }
      ],
      "explicacion": "“Never” (nunca) va antes del verbo: I never get up early.",
      "feedback": {
        "correct": "“I never get up early on Sundays.” El adverbio va antes del verbo.",
        "incorrect": "Busca el adverbio de frecuencia (nunca) que va antes del verbo.",
        "context": "I never get up early on Sundays.",
        "learnedExpressions": [
          "I never…"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-grammar",
      "stage": [
        "p56"
      ],
      "difficulty": 4,
      "variant_group": "routine-grammar",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-17",
      "tipo": "hablar",
      "habilidad": "speaking",
      "nivel": "A1",
      "edad": [
        9,
        11
      ],
      "etiqueta": "A hablar",
      "instruccion": "Di en voz alta:",
      "frase": "What time do you go to bed?",
      "unit_id": "rutina-diaria",
      "objective_id": "routine-speaking",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "routine-speaking",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-18",
      "tipo": "emparejar",
      "habilidad": "vocabulary",
      "nivel": "A1",
      "edad": [
        9,
        11
      ],
      "etiqueta": "Relaciona",
      "instruccion": "Une cada acción con su significado.",
      "pares": [
        {
          "a": "have breakfast",
          "b": "desayunar"
        },
        {
          "a": "go to school",
          "b": "ir al cole"
        },
        {
          "a": "go to bed",
          "b": "acostarse"
        }
      ],
      "unit_id": "rutina-diaria",
      "objective_id": "routine-actions",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "routine-actions",
      "tags": [
        "daily-routine"
      ],
      "feedback": {
        "correct": "¡Bien hecho!",
        "incorrect": "Míralo con calma y prueba otra vez.",
        "context": "",
        "learnedExpressions": []
      }
    },
    {
      "id": "rd-19",
      "tipo": "completar",
      "habilidad": "vocabulary",
      "nivel": "A1",
      "edad": [
        9,
        11
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "Completa: “I have breakfast in the ___.”",
      "opciones": [
        {
          "texto": "morning",
          "correcta": true
        },
        {
          "texto": "night"
        },
        {
          "texto": "o'clock"
        }
      ],
      "explicacion": "Desayunamos por la mañana: in the morning.",
      "feedback": {
        "correct": "“In the morning” = por la mañana.",
        "incorrect": "¿En qué parte del día desayunamos?",
        "context": "I have breakfast in the morning.",
        "learnedExpressions": [
          "In the morning"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-times",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "routine-times",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-20",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A2",
      "edad": [
        10,
        11
      ],
      "etiqueta": "Gramática",
      "instruccion": "Choose the correct sentence.",
      "opciones": [
        {
          "texto": "I usually wake up at seven.",
          "correcta": true
        },
        {
          "texto": "I wake usually up at seven."
        },
        {
          "texto": "I am wake up at seven."
        },
        {
          "texto": "I wakes up at seven."
        }
      ],
      "feedback": {
        "correct": "The frequency adverb goes before the verb: I usually wake up.",
        "incorrect": "“Usually” goes before the main verb, and “I” doesn’t take -s.",
        "context": "I usually wake up at seven.",
        "learnedExpressions": [
          "I usually wake up"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-grammar",
      "stage": [
        "p56"
      ],
      "difficulty": 4,
      "variant_group": "routine-grammar",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-21",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "A1",
      "edad": [
        8,
        11
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “desayunar” en inglés?",
      "audio": "have breakfast",
      "opciones": [
        {
          "texto": "have breakfast",
          "correcta": true
        },
        {
          "texto": "go to bed"
        },
        {
          "texto": "wake up"
        },
        {
          "texto": "brush my teeth"
        }
      ],
      "feedback": {
        "correct": "“Have breakfast” es desayunar.",
        "incorrect": "Desayunar es “have breakfast”.",
        "context": "I have breakfast at eight.",
        "learnedExpressions": [
          "have breakfast"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-actions",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "routine-actions",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-22",
      "tipo": "elegir_texto",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        9,
        12
      ],
      "etiqueta": "Gramática",
      "instruccion": "Completa: “She ___ up at seven.”",
      "opciones": [
        {
          "texto": "gets",
          "correcta": true
        },
        {
          "texto": "get"
        },
        {
          "texto": "getting"
        },
        {
          "texto": "got"
        }
      ],
      "feedback": {
        "correct": "Con “she” añadimos -s: she gets up.",
        "incorrect": "Con he/she/it el verbo lleva -s: gets.",
        "context": "She gets up at seven.",
        "learnedExpressions": [
          "gets up"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-grammar",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "routine-grammar",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-23",
      "tipo": "elegir_texto",
      "habilidad": "listening",
      "nivel": "A1",
      "edad": [
        9,
        12
      ],
      "etiqueta": "Listening",
      "instruccion": "Escucha y elige la hora.",
      "audio": "It's half past eight.",
      "opciones": [
        {
          "texto": "8:30",
          "correcta": true
        },
        {
          "texto": "8:15"
        },
        {
          "texto": "7:30"
        },
        {
          "texto": "9:00"
        }
      ],
      "feedback": {
        "correct": "“Half past eight” son las 8:30.",
        "incorrect": "“Half past” = y media; half past eight = 8:30.",
        "context": "It's half past eight.",
        "learnedExpressions": [
          "half past…"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-times",
      "stage": [
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "routine-times",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-24",
      "tipo": "elegir_texto",
      "habilidad": "speaking",
      "nivel": "A1",
      "edad": [
        9,
        12
      ],
      "etiqueta": "A hablar",
      "instruccion": "¿Cómo preguntas la hora en inglés?",
      "audio": "What time is it?",
      "opciones": [
        {
          "texto": "What time is it?",
          "correcta": true
        },
        {
          "texto": "How are you?"
        },
        {
          "texto": "Where is it?"
        },
        {
          "texto": "Who is it?"
        }
      ],
      "feedback": {
        "correct": "“What time is it?” = ¿Qué hora es?",
        "incorrect": "Para la hora: “What time is it?”.",
        "context": "What time is it?",
        "learnedExpressions": [
          "What time is it?"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-speaking",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "routine-speaking",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-25",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "A1",
      "edad": [
        8,
        11
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “irse a la cama” en inglés?",
      "audio": "go to bed",
      "opciones": [
        {
          "texto": "go to bed",
          "correcta": true
        },
        {
          "texto": "wake up"
        },
        {
          "texto": "have lunch"
        },
        {
          "texto": "get dressed"
        }
      ],
      "feedback": {
        "correct": "“Go to bed” es irse a la cama.",
        "incorrect": "Irse a la cama es “go to bed”.",
        "context": "I go to bed at ten.",
        "learnedExpressions": [
          "go to bed"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-actions",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "routine-actions",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-26",
      "tipo": "elegir_texto",
      "habilidad": "vocabulary",
      "nivel": "A1",
      "edad": [
        8,
        11
      ],
      "etiqueta": "Vocabulario",
      "instruccion": "¿Cómo se dice “ducharse” en inglés?",
      "audio": "have a shower",
      "opciones": [
        {
          "texto": "have a shower",
          "correcta": true
        },
        {
          "texto": "brush my hair"
        },
        {
          "texto": "go to school"
        },
        {
          "texto": "do homework"
        }
      ],
      "feedback": {
        "correct": "“Have a shower” es ducharse.",
        "incorrect": "Ducharse es “have a shower”.",
        "context": "I have a shower in the morning.",
        "learnedExpressions": [
          "have a shower"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-actions",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "routine-actions",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-27",
      "tipo": "elegir_texto",
      "habilidad": "listening",
      "nivel": "A1",
      "edad": [
        9,
        12
      ],
      "etiqueta": "Listening",
      "instruccion": "Escucha y elige la hora.",
      "audio": "It's a quarter past nine.",
      "opciones": [
        {
          "texto": "9:15",
          "correcta": true
        },
        {
          "texto": "9:45"
        },
        {
          "texto": "8:15"
        },
        {
          "texto": "9:30"
        }
      ],
      "feedback": {
        "correct": "“A quarter past nine” son las 9:15.",
        "incorrect": "“Quarter past” = y cuarto. Quarter past nine = 9:15.",
        "context": "It's a quarter past nine.",
        "learnedExpressions": [
          "a quarter past…"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-times",
      "stage": [
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "routine-times",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-28",
      "tipo": "completar",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        9,
        12
      ],
      "etiqueta": "Completa",
      "instruccion": "Completa: “He ___ to school by bus.”",
      "opciones": [
        {
          "texto": "goes",
          "correcta": true
        },
        {
          "texto": "go"
        },
        {
          "texto": "going"
        },
        {
          "texto": "went"
        }
      ],
      "feedback": {
        "correct": "Con “he” el verbo lleva -s: he goes.",
        "incorrect": "Con he/she/it: go → goes.",
        "context": "He goes to school by bus.",
        "learnedExpressions": [
          "goes"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-grammar",
      "stage": [
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "routine-grammar",
      "tags": [
        "daily-routine"
      ]
    },
    {
      "id": "rd-29",
      "tipo": "ordenar",
      "habilidad": "grammar",
      "nivel": "A1",
      "edad": [
        9,
        12
      ],
      "etiqueta": "Ordena la frase",
      "instruccion": "“Me levanto a las siete”",
      "palabras": [
        "up",
        "I",
        "seven",
        "get",
        "at"
      ],
      "respuesta": [
        "I",
        "get",
        "up",
        "at",
        "seven"
      ],
      "unit_id": "rutina-diaria",
      "objective_id": "routine-grammar",
      "stage": [
        "p56"
      ],
      "difficulty": 3,
      "variant_group": "routine-grammar",
      "tags": [
        "daily-routine"
      ],
      "feedback": {
        "correct": "Orden correcto: «I get up at seven.». En inglés va primero el sujeto y luego el verbo.",
        "incorrect": "Fíjate en el orden: sujeto + verbo + resto, y prueba otra vez.",
        "context": "I get up at seven.",
        "learnedExpressions": []
      }
    },
    {
      "id": "rd-30",
      "tipo": "elegir_texto",
      "habilidad": "speaking",
      "nivel": "A1",
      "edad": [
        9,
        12
      ],
      "etiqueta": "A hablar",
      "instruccion": "Para contar tu rutina de la mañana, ¿cómo empiezas?",
      "audio": "In the morning, I get up at seven.",
      "opciones": [
        {
          "texto": "In the morning, I…",
          "correcta": true
        },
        {
          "texto": "Yesterday I…"
        },
        {
          "texto": "Tomorrow I…"
        },
        {
          "texto": "Last night I…"
        }
      ],
      "feedback": {
        "correct": "Para la rutina (presente) usamos “In the morning, I…”.",
        "incorrect": "La rutina va en presente: “In the morning, I…”.",
        "context": "In the morning, I get up at seven.",
        "learnedExpressions": [
          "In the morning, I…"
        ]
      },
      "unit_id": "rutina-diaria",
      "objective_id": "routine-speaking",
      "stage": [
        "p56"
      ],
      "difficulty": 2,
      "variant_group": "routine-speaking",
      "tags": [
        "daily-routine"
      ]
    }
  ]
});
