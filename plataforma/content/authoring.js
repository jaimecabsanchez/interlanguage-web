/* Rechaza metadatos ausentes ANTES de normalizar: un valor por defecto no es edición. */
(function(root,factory){
  const m=root.ILMechanics||(typeof require==='function'?require('./mechanics.js'):null);
  const api=factory(m);if(typeof module==='object'&&module.exports)module.exports=api;else root.ILAuthoring=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(M){
  'use strict';
  const text=v=>typeof v==='string'&&v.trim().length>0;
  const choices=xs=>Array.isArray(xs)&&xs.length>=2&&xs.filter(x=>x.correcta===true).length===1&&xs.every(x=>text(x.texto));
  function validate(e){
    const errors=[];const fail=(field,message)=>errors.push({code:'authoring_'+field,path:field,message});
    const id=M.identify(e), type=e.tipo, m=M.CATALOG[id];
    if(!m)fail('mechanic','Mecánica desconocida.');
    else if(type!==m.type && !(id==='gap_fill'&&type==='elegir_texto') && !(id==='word_image'&&type==='elegir_imagen'))fail('mechanic','El tipo y la mecánica no corresponden.');
    if(!text(e.instruction||e.instruccion))fail('instruction','Falta una instrucción.');
    if(!['listening','vocabulary','grammar','reading','writing','speaking'].includes(e.skill||e.habilidad))fail('skill','Falta una habilidad válida.');
    if(!['Pre-A1','A1','A2','B1'].includes(e.cefr||e.nivel))fail('cefr','Falta CEFR válido.');
    if(!Array.isArray(e.stage)||!e.stage.length||e.stage.some(b=>!['p12','p34','p56','eso'].includes(b)))fail('stage','Falta compatibilidad por edad.');
    else if(e.stage.some(b=>!M.compatible(e,b)))fail('stage','La interacción no es compatible con una de las edades declaradas.');
    if(!Number.isInteger(e.difficulty)||e.difficulty<1||e.difficulty>5)fail('difficulty','Dificultad entre 1 y 5 obligatoria.');
    if(!Number.isFinite(e.estimated_seconds)||e.estimated_seconds<10||e.estimated_seconds>600)fail('time','Tiempo estimado entre 10 y 600 segundos obligatorio.');
    if(!text(e.explanation||e.explicacion||e.feedback?.correctAnswer||e.feedback?.correct))fail('explanation','Falta explicación o feedback editorial.');
    if(!text(e.hint||e.feedback?.incorrect))fail('hint','Falta una pista útil para el reintento.');
    const answer=e.answer??e.respuesta;
    if(['elegir_imagen','elegir_texto','imagen_palabra','palabra_imagen'].includes(type)||(type==='completar'&&e.opciones?.length)) {
      if(!choices(e.options||e.opciones))fail('answer','Debe haber exactamente una opción correcta y distractores legibles.');
    } else if(['ordenar','ordenar_palabra'].includes(type)) {
      if(!Array.isArray(answer)||!answer.length||JSON.stringify([...answer].sort())!==JSON.stringify([...(e.palabras||[])].sort()))fail('answer','El orden correcto debe contener todas las fichas.');
    } else if(type==='emparejar') {
      if(!e.pares?.length||e.pares.some(p=>!text(p.a)||!text(p.b))||new Set(e.pares.map(p=>p.b)).size!==e.pares.length)fail('answer','Parejas completas y sin destinos ambiguos obligatorias.');
    } else if(type==='comprension') {
      if(!text(e.estimulo?.texto)||!e.preguntas?.length||e.preguntas.some(q=>!text(q.pregunta)||!choices(q.opciones)))fail('answer','Lectura y preguntas con una respuesta correcta obligatorias.');
    } else if(type==='clasificar') {
      if(!e.categories?.length||!e.items?.length||e.items.some(i=>!text(i.text)||!e.categories.includes(i.category)))fail('answer','Cada elemento debe tener una categoría válida.');
    } else if(type==='hablar') {
      if(!text(e.frase)||e.assessment!=='self_report')fail('answer','Frase y evaluación declarada como práctica oral obligatorias.');
    } else if(type==='escritura_guiada') {
      if(!text(answer)||!e.rubric?.length||e.rubric.some(r=>!text(r))||e.assessment!=='self_report')fail('answer','Modelo, rúbrica y autoevaluación obligatorios.');
    } else if(!text(answer))fail('answer','Falta respuesta evaluable.');
    if(['listen_image','listen_text','dictation','speaking'].includes(id)&&!text(e.audio||e.instruction_audio||e.frase)&&!text(e.audio_src))fail('audio','Esta mecánica necesita audio.');
    if(['image_word','word_image'].includes(id)&&!(e.stimulus_visual||e.opciones?.every(o=>o.visual||o.emoji)))fail('visual','Falta el estímulo visual.');
    if(type==='dialogo'&&!e.dialogue?.length)fail('dialogue','Faltan los turnos del diálogo.');
    if(type==='deletrear'&&(!text(e.mask)||e.mask.length!==String(answer||'').length||![...e.mask].some(c=>c==='_')))fail('mask','Falta una pauta de letras compatible con la respuesta.');
    return {valid:!errors.length,errors};
  }
  return {validate};
});
