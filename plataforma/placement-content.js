/* Interlanguage HOME · banco versionado para la calibración inicial.
   Contenido separado de la misión diaria; navegador y Node. */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ILPlacementContent = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const INSTRUMENT_ID = "adaptive-starting-point";
  const VERSION = "2";
  const BANDS = Object.freeze(["p12", "p34", "p56", "eso", "neutral"]);
  const CEFR = Object.freeze(["Pre-A1", "A1", "A2", "B1"]);
  const SKILLS = Object.freeze(["listening", "vocabulary", "grammar", "reading"]);
  const TYPES = Object.freeze(["elegir_texto", "elegir_imagen", "ordenar"]);
  const ASSET = "assets/ejercicios/";

  function option(text, visual) { return Object.freeze({ text, visual:visual ? ASSET + visual : "" }); }
  function item(band, level, number, row) {
    return Object.freeze({
      id:["place", band, level.toLowerCase().replace(/[^a-z0-9]+/g, ""), number].join("-"),
      instrument_id:INSTRUMENT_ID, instrument_version:VERSION, cefr_probe:level,
      skill:row.skill, interaction_type:row.type, bands:Object.freeze(band === "p56" ? ["p56", "neutral"] : [band]),
      context:row.context || (band === "eso" ? "teen" : (band === "p56" ? "upper_primary" : "child")),
      instruction:Object.freeze(row.instruction), prompt:row.prompt,
      options:Object.freeze(row.options.map(value => typeof value === "string" ? option(value) : option(value[0], value[1]))),
      correct_index:row.answer, explanation:Object.freeze(row.explanation), audio_text:row.audio || ""
    });
  }

  const DATA = {
    p12:{
      "Pre-A1":[
        {type:"elegir_imagen",skill:"vocabulary",instruction:{es:"Mira y elige.",en:"Look and choose."},prompt:"Where is the apple?",options:[["apple","apple.webp"],["banana","banana.webp"],["book","book.webp"]],answer:0,explanation:{es:"Apple significa manzana.",en:"Apple means manzana."}},
        {type:"elegir_texto",skill:"vocabulary",instruction:{es:"Elige la palabra.",en:"Choose the word."},prompt:"Which word means «libro»?",options:["book","chair","milk"],answer:0,explanation:{es:"Book significa libro.",en:"Book means libro."}},
        {type:"elegir_texto",skill:"reading",instruction:{es:"Mira la palabra y elige.",en:"Look and choose."},prompt:"Choose the colour red.",options:["blue","red","green"],answer:1,explanation:{es:"Red significa rojo.",en:"Red means rojo."}}
      ],
      A1:[
        {type:"elegir_imagen",skill:"vocabulary",instruction:{es:"Mira y elige.",en:"Look and choose."},prompt:"I go to school.",options:[["go to school","go-to-school.webp"],["have breakfast","have-breakfast.webp"],["go to bed","go-to-bed.webp"]],answer:0,explanation:{es:"Go to school significa ir al colegio.",en:"Go to school means ir al colegio."}},
        {type:"elegir_texto",skill:"grammar",instruction:{es:"Completa la frase.",en:"Complete the sentence."},prompt:"She ___ my friend.",options:["is","are","am"],answer:0,explanation:{es:"Con she usamos is.",en:"We use is with she."}},
        {type:"ordenar",skill:"reading",instruction:{es:"Elige la frase bien ordenada.",en:"Choose the sentence in the right order."},prompt:"¿Cuál está bien?",options:["I like apples.","Like I apples.","Apples I like."],answer:0,explanation:{es:"En inglés solemos empezar por I: I like apples.",en:"The sentence starts with I: I like apples."}}
      ],
      A2:[
        {type:"elegir_texto",skill:"grammar",instruction:{es:"Completa la frase.",en:"Complete the sentence."},prompt:"Yesterday I ___ football.",options:["play","played","playing"],answer:1,explanation:{es:"Yesterday nos lleva al pasado: played.",en:"Yesterday points to the past: played."}},
        {type:"ordenar",skill:"reading",instruction:{es:"Elige la frase bien ordenada.",en:"Choose the sentence in the right order."},prompt:"¿Cuál está bien?",options:["My sister is taller than me.","My sister taller is than me.","Is taller my sister than me."],answer:0,explanation:{es:"Taller than sirve para comparar.",en:"Taller than is used to compare."}},
        {type:"elegir_texto",skill:"reading",instruction:{es:"Lee y elige.",en:"Read and choose."},prompt:"Tom is wearing a coat because it is cold. Why is he wearing a coat?",options:["Because it is cold.","Because it is sunny.","Because he is swimming."],answer:0,explanation:{es:"Because introduce el motivo.",en:"Because introduces the reason."}}
      ],
      B1:[
        {type:"elegir_texto",skill:"grammar",instruction:{es:"Completa la frase.",en:"Complete the sentence."},prompt:"If it rains, we ___ inside.",options:["will play","played","are playing yesterday"],answer:0,explanation:{es:"If + presente puede combinarse con will.",en:"If + present can combine with will."}},
        {type:"ordenar",skill:"reading",instruction:{es:"Elige la frase bien ordenada.",en:"Choose the sentence in the right order."},prompt:"¿Cuál está bien?",options:["I have never visited London.","I never have London visited.","Never I visited have London."],answer:0,explanation:{es:"Have never visited habla de experiencias.",en:"Have never visited talks about experiences."}},
        {type:"elegir_texto",skill:"reading",instruction:{es:"Lee y elige la idea principal.",en:"Read and choose the main idea."},prompt:"Mia practises every week because she wants to speak to new friends at camp.",options:["Mia has a reason to practise.","Mia dislikes her friends.","Mia never goes to camp."],answer:0,explanation:{es:"Because explica por qué practica Mia.",en:"Because explains why Mia practises."}}
      ]
    },
    p34:{
      "Pre-A1":[
        {type:"elegir_texto",skill:"vocabulary",instruction:{es:"Elige la palabra.",en:"Choose the word."},prompt:"Which word means «mesa»?",options:["table","window","pencil"],answer:0,explanation:{es:"Table significa mesa.",en:"Table means mesa."}},
        {type:"elegir_imagen",skill:"vocabulary",instruction:{es:"Mira y elige.",en:"Look and choose."},prompt:"Choose the school bag.",options:[["school bag","school-bag.webp"],["chair","chair.webp"],["milk","milk.webp"]],answer:0,explanation:{es:"School bag significa mochila.",en:"School bag means mochila."}},
        {type:"elegir_texto",skill:"reading",instruction:{es:"Lee y elige.",en:"Read and choose."},prompt:"Hello!",options:["¡Hola!","¡Adiós!","Buenas noches"],answer:0,explanation:{es:"Hello se usa para saludar.",en:"Hello is a greeting."}}
      ],
      A1:[
        {type:"elegir_texto",skill:"grammar",instruction:{es:"Completa la frase.",en:"Complete the sentence."},prompt:"They ___ at school.",options:["are","is","am"],answer:0,explanation:{es:"Con they usamos are.",en:"We use are with they."}},
        {type:"ordenar",skill:"reading",instruction:{es:"Elige la frase bien ordenada.",en:"Choose the sentence in the right order."},prompt:"¿Cuál está bien?",options:["We play after school.","Play we after school.","After school we play do."],answer:0,explanation:{es:"We play after school sigue el orden habitual.",en:"We play after school follows the usual order."}},
        {type:"elegir_texto",skill:"reading",instruction:{es:"Lee y elige.",en:"Read and choose."},prompt:"Sam has breakfast at eight. When does Sam have breakfast?",options:["At eight.","At school.","On Friday."],answer:0,explanation:{es:"At eight indica la hora.",en:"At eight gives the time."}}
      ],
      A2:[
        {type:"elegir_texto",skill:"grammar",instruction:{es:"Completa la frase.",en:"Complete the sentence."},prompt:"There ___ some milk in the fridge.",options:["is","are","were"],answer:0,explanation:{es:"Milk es incontable y usa is.",en:"Milk is uncountable and takes is."}},
        {type:"ordenar",skill:"reading",instruction:{es:"Elige la frase bien ordenada.",en:"Choose the sentence in the right order."},prompt:"¿Cuál está bien?",options:["I went to the cinema yesterday.","I to the cinema went yesterday.","Yesterday cinema I the went."],answer:0,explanation:{es:"Went es el pasado de go.",en:"Went is the past of go."}},
        {type:"elegir_texto",skill:"reading",instruction:{es:"Lee y elige.",en:"Read and choose."},prompt:"Eva missed the bus, so she walked to school.",options:["Eva walked because she missed the bus.","Eva travelled by bus.","Eva stayed at home."],answer:0,explanation:{es:"So presenta la consecuencia.",en:"So introduces the result."}}
      ],
      B1:[
        {type:"elegir_texto",skill:"grammar",instruction:{es:"Completa la frase.",en:"Complete the sentence."},prompt:"If I finish early, I ___ you.",options:["will call","called yesterday","am call"],answer:0,explanation:{es:"Will call expresa el resultado futuro.",en:"Will call expresses the future result."}},
        {type:"ordenar",skill:"reading",instruction:{es:"Elige la frase bien ordenada.",en:"Choose the sentence in the right order."},prompt:"¿Cuál está bien?",options:["She has already finished her project.","She already her project has finished.","Has she finished already project her."],answer:0,explanation:{es:"Already suele ir entre has y el participio.",en:"Already often goes between has and the participle."}},
        {type:"elegir_texto",skill:"reading",instruction:{es:"Lee y elige la mejor conclusión.",en:"Read and choose the best conclusion."},prompt:"Leo studied the map before the trip, so he knew which path to take.",options:["Preparing helped Leo.","Leo lost the map.","The trip was cancelled."],answer:0,explanation:{es:"Prepararse ayudó a Leo a elegir el camino.",en:"Preparing helped Leo choose the path."}}
      ]
    },
    p56:{
      "Pre-A1":[
        {type:"elegir_texto",skill:"vocabulary",instruction:{es:"Elige la opción correcta.",en:"Choose the correct option."},prompt:"Which word means «ordenador»?",options:["computer","notebook","window"],answer:0,explanation:{es:"Computer significa ordenador.",en:"Computer means ordenador."}},
        {type:"ordenar",skill:"reading",instruction:{es:"Elige la frase correcta.",en:"Choose the correct sentence."},prompt:"Choose the greeting.",options:["Good morning!","Morning good!","Goodbye morning!"],answer:0,explanation:{es:"Good morning es un saludo.",en:"Good morning is a greeting."}},
        {type:"elegir_texto",skill:"reading",instruction:{es:"Lee y elige.",en:"Read and choose."},prompt:"I am eleven.",options:["Tengo once años.","Son las once.","Tengo un hermano."],answer:0,explanation:{es:"I am eleven expresa la edad.",en:"I am eleven gives your age."}}
      ],
      A1:[
        {type:"elegir_texto",skill:"grammar",instruction:{es:"Complete the sentence.",en:"Complete the sentence."},prompt:"My friends ___ football on Fridays.",options:["play","plays","playing"],answer:0,explanation:{es:"Con my friends usamos play.",en:"We use play with my friends."}},
        {type:"ordenar",skill:"reading",instruction:{es:"Choose the correct sentence.",en:"Choose the correct sentence."},prompt:"Which sentence is correct?",options:["I usually do my homework after dinner.","Usually I my homework do after dinner.","I do usually after dinner homework my."],answer:0,explanation:{es:"Usually suele ir antes del verbo principal.",en:"Usually often goes before the main verb."}},
        {type:"elegir_texto",skill:"reading",instruction:{es:"Read and choose.",en:"Read and choose."},prompt:"Nora takes the train to school. How does she travel?",options:["By train.","At eight.","With homework."],answer:0,explanation:{es:"By train indica el medio de transporte.",en:"By train gives the means of transport."}}
      ],
      A2:[
        {type:"elegir_texto",skill:"grammar",instruction:{es:"Complete the sentence.",en:"Complete the sentence."},prompt:"We ___ this film last weekend.",options:["watched","watch","have watch"],answer:0,explanation:{es:"Last weekend requiere pasado: watched.",en:"Last weekend calls for the past: watched."}},
        {type:"ordenar",skill:"reading",instruction:{es:"Choose the correct sentence.",en:"Choose the correct sentence."},prompt:"Which sentence is correct?",options:["This game is more interesting than that one.","This game more interesting is that one than.","More this game than interesting that one is."],answer:0,explanation:{es:"More interesting than forma una comparación.",en:"More interesting than forms a comparison."}},
        {type:"elegir_texto",skill:"reading",instruction:{es:"Read and choose.",en:"Read and choose."},prompt:"Jay saved his work before the battery ran out.",options:["He did not lose his work.","He bought a new computer.","He forgot to save."],answer:0,explanation:{es:"Guardar antes evitó perder el trabajo.",en:"Saving first prevented him from losing his work."}}
      ],
      B1:[
        {type:"elegir_texto",skill:"grammar",instruction:{es:"Complete the sentence.",en:"Complete the sentence."},prompt:"If I had more time, I ___ another language.",options:["would learn","will learned","learn yesterday"],answer:0,explanation:{es:"Would learn expresa una situación hipotética.",en:"Would learn expresses a hypothetical situation."}},
        {type:"ordenar",skill:"reading",instruction:{es:"Choose the correct sentence.",en:"Choose the correct sentence."},prompt:"Which sentence is correct?",options:["I have been using this app since January.","I since January this app have using been.","Since I have this app January using."],answer:0,explanation:{es:"Since marca el inicio de una acción que continúa.",en:"Since marks when an ongoing action started."}},
        {type:"elegir_texto",skill:"reading",instruction:{es:"Read and choose the main idea.",en:"Read and choose the main idea."},prompt:"Online study is flexible, although learners still need a regular routine.",options:["Flexibility still needs organisation.","Online study needs no routine.","Learners should stop studying online."],answer:0,explanation:{es:"Although contrapone flexibilidad y necesidad de rutina.",en:"Although contrasts flexibility with the need for routine."}}
      ]
    },
    eso:{
      "Pre-A1":[
        {type:"elegir_texto",skill:"vocabulary",instruction:{es:"Elige la opción correcta.",en:"Choose the correct option."},prompt:"Which word means «móvil»?",options:["phone","chair","milk"],answer:0,explanation:{es:"Phone significa móvil o teléfono.",en:"Phone means móvil or teléfono."}},
        {type:"ordenar",skill:"reading",instruction:{es:"Elige la frase correcta.",en:"Choose the correct sentence."},prompt:"Choose the correct introduction.",options:["Hi, I’m Alex.","Alex I hi am.","Am hi Alex I."],answer:0,explanation:{es:"Hi, I’m Alex es una presentación natural.",en:"Hi, I’m Alex is a natural introduction."}},
        {type:"elegir_texto",skill:"reading",instruction:{es:"Lee y elige.",en:"Read and choose."},prompt:"The class starts at nine.",options:["La clase empieza a las nueve.","La clase termina a las nueve.","Hay nueve clases."],answer:0,explanation:{es:"Starts significa empieza.",en:"Starts means empieza."}}
      ],
      A1:[
        {type:"elegir_texto",skill:"grammar",instruction:{es:"Completa la frase.",en:"Complete the sentence."},prompt:"I ___ music every day.",options:["listen to","listens to","am listen"],answer:0,explanation:{es:"Con I usamos listen to.",en:"We use listen to with I."}},
        {type:"ordenar",skill:"reading",instruction:{es:"Elige la frase correcta.",en:"Choose the correct sentence."},prompt:"Which sentence is correct?",options:["We meet after class on Tuesdays.","We on Tuesdays after class meet.","Meet we Tuesdays on class after."],answer:0,explanation:{es:"La frase sigue sujeto, verbo y complementos.",en:"The sentence follows subject, verb and complements."}},
        {type:"elegir_texto",skill:"reading",instruction:{es:"Lee y elige.",en:"Read and choose."},prompt:"Kai is messaging a friend about tonight’s concert.",options:["Kai is talking about a plan.","Kai is doing a maths exam.","Kai is cooking breakfast."],answer:0,explanation:{es:"Tonight’s concert es un plan para esta noche.",en:"Tonight’s concert is a plan for this evening."}}
      ],
      A2:[
        {type:"elegir_texto",skill:"grammar",instruction:{es:"Completa la frase.",en:"Complete the sentence."},prompt:"I ___ my assignment yet.",options:["haven’t finished","didn’t finished","not finish"],answer:0,explanation:{es:"Yet puede combinarse con present perfect.",en:"Yet can combine with the present perfect."}},
        {type:"ordenar",skill:"reading",instruction:{es:"Elige la frase correcta.",en:"Choose the correct sentence."},prompt:"Which sentence is correct?",options:["The series was better than I expected.","The series better was I than expected.","Better the series expected than I was."],answer:0,explanation:{es:"Better than introduce la comparación.",en:"Better than introduces the comparison."}},
        {type:"elegir_texto",skill:"reading",instruction:{es:"Lee y elige.",en:"Read and choose."},prompt:"The bus was delayed, so we arrived after the film had started.",options:["They missed the beginning.","The film started late.","They travelled by train."],answer:0,explanation:{es:"Llegaron después de que empezara la película.",en:"They arrived after the film had started."}}
      ],
      B1:[
        {type:"elegir_texto",skill:"grammar",instruction:{es:"Completa la frase.",en:"Complete the sentence."},prompt:"If the tickets hadn’t sold out, we ___ to the festival.",options:["would have gone","will go yesterday","had went"],answer:0,explanation:{es:"Would have gone expresa un resultado pasado hipotético.",en:"Would have gone expresses a hypothetical past result."}},
        {type:"ordenar",skill:"reading",instruction:{es:"Elige la frase correcta.",en:"Choose the correct sentence."},prompt:"Which sentence is correct?",options:["I’ve been thinking about changing my study routine.","I changing have been my routine thinking about study.","Thinking I my study routine have changing been."],answer:0,explanation:{es:"Have been thinking describe una reflexión continuada.",en:"Have been thinking describes an ongoing thought process."}},
        {type:"elegir_texto",skill:"reading",instruction:{es:"Lee y elige la idea principal.",en:"Read and choose the main idea."},prompt:"Although social media helps people stay connected, constant notifications can make it harder to focus.",options:["Connection can come with distraction.","Notifications always improve focus.","Social media prevents communication."],answer:0,explanation:{es:"El texto contrasta conexión y distracción.",en:"The text contrasts connection with distraction."}}
      ]
    }
  };

  const ITEMS = Object.freeze(Object.keys(DATA).flatMap(band => CEFR.flatMap(level => DATA[band][level].map((row, index) => item(band, level, index + 1, row)))));

  function validate(items) {
    const errors = [], ids = new Set(); const list = items || ITEMS;
    list.forEach((entry, index) => {
      const at = "items[" + index + "]";
      if (!entry.id || ids.has(entry.id)) errors.push({ code:"invalid_or_duplicate_id", path:at + ".id" }); else ids.add(entry.id);
      if (entry.instrument_version !== VERSION) errors.push({ code:"invalid_version", path:at + ".instrument_version" });
      if (CEFR.indexOf(entry.cefr_probe) < 0) errors.push({ code:"invalid_cefr", path:at + ".cefr_probe" });
      if (SKILLS.indexOf(entry.skill) < 0) errors.push({ code:"invalid_skill", path:at + ".skill" });
      if (TYPES.indexOf(entry.interaction_type) < 0) errors.push({ code:"invalid_type", path:at + ".interaction_type" });
      if (!entry.bands.length || entry.bands.some(band => BANDS.indexOf(band) < 0)) errors.push({ code:"invalid_band", path:at + ".bands" });
      if (!entry.prompt || !entry.instruction.es || !entry.options || entry.options.length < 2) errors.push({ code:"missing_content", path:at });
      if (!Number.isInteger(entry.correct_index) || entry.correct_index < 0 || entry.correct_index >= entry.options.length) errors.push({ code:"invalid_answer", path:at + ".correct_index" });
      if (entry.interaction_type === "elegir_imagen" && entry.options.some(value => !value.visual)) errors.push({ code:"missing_visual", path:at + ".options" });
      if (!entry.explanation.es || !entry.explanation.en) errors.push({ code:"missing_explanation", path:at + ".explanation" });
      if (entry.bands.indexOf("eso") >= 0 && entry.context !== "teen") errors.push({ code:"invalid_teen_context", path:at + ".context" });
    });
    BANDS.forEach(band => CEFR.forEach(level => {
      const group = list.filter(entry => entry.bands.indexOf(band) >= 0 && entry.cefr_probe === level);
      if (group.length < 2 || new Set(group.map(entry => entry.interaction_type)).size < 2) errors.push({ code:"coverage_gap", path:band + "." + level });
    }));
    return Object.freeze({ valid:errors.length === 0, errors:Object.freeze(errors), items:list });
  }

  function forBand(band) { const safe = BANDS.indexOf(band) >= 0 ? band : "neutral"; return ITEMS.filter(entry => entry.bands.indexOf(safe) >= 0); }

  return Object.freeze({ INSTRUMENT_ID, VERSION, BANDS, CEFR, SKILLS, TYPES, ITEMS, validate, forBand });
});
