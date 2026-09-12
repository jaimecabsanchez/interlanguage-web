/* Extensiones del motor: controles nativos, sin drag obligatorio ni corrección ficticia. */
(function(root){
  'use strict';
  root.ILMechanicTemplates={install(T,h){
    const {el,baseResult,shuffle,illustrationFor,disableAll,norm,playAudio,audioSettings}=h;
    const sec=()=>document.body.dataset.stage==='eso';
    const label=(es,en)=>sec()?en:es;
    function text(host,value,cls='eng-stimulus'){if(!value)return;const p=el('p',cls,value);p.lang='en';host.append(p);}
    function visual(host,key){const art=el('div','eng-prompt-image');art.innerHTML=illustrationFor({visual:key});art.setAttribute('role','img');art.setAttribute('aria-label',label('Imagen del objeto que debes nombrar','Object to name'));host.append(art);}
    function inputController(host,e,onChange,{guided=false,writing=false}={}){
      if(e.stimulus_visual)visual(host,e.stimulus_visual);
      if(e.prompt)text(host,e.prompt);
      if(e.dialogue){const box=el('div','eng-dialogue');e.dialogue.forEach(turn=>text(box,turn,'eng-dialogue-turn'));host.append(box);}
      if(guided)text(host,e.mask.split('').join(' '),'eng-spelling-guide');
      const field=el('label','eng-response-label',label(writing?'Tu texto':guided?'Escribe la palabra entera':'Tu respuesta',writing?'Your writing':guided?'Type the whole word':'Your answer'));
      const input=el(writing?'textarea':'input','eng-input');if(!writing)input.type='text';else input.rows=4;
      input.autocomplete='off';input.spellcheck=false;input.autocapitalize='none';input.maxLength=writing?600:200;
      field.append(input);host.append(field);
      if(guided)input.setAttribute('aria-description',label('Completa las letras que faltan. Escribe la palabra entera.','Fill the missing letters. Type the whole word.'));
      let reviewed=false;
      const rubric=el('fieldset','eng-rubric');const checks=[];
      if(writing){
        const count=el('p','eng-speaking-note');host.append(count);const update=()=>{const n=input.value.trim()?input.value.trim().split(/\s+/).length:0;count.textContent=label('Palabras: ','Words: ')+n+label(' · mínimo ',' · minimum ')+(e.min_words||5);};update();input.addEventListener('input',update);
        const sample=el('details','eng-writing-model');sample.append(el('summary','',label('Ver un ejemplo','See an example')));text(sample,e.respuesta);host.append(sample);
        rubric.append(el('legend','',label('Antes de terminar, revisa tu texto','Before finishing, check your writing')));
        (e.rubric||[]).forEach(item=>{const l=el('label','eng-rubric-item');const c=el('input');c.type='checkbox';l.append(c,el('span','',item));rubric.append(l);checks.push(c);c.addEventListener('change',()=>{reviewed=checks.every(c=>c.checked);onChange();});});host.append(rubric);
        text(host,label('Práctica con autoevaluación. La app guarda tu texto; no certifica su corrección.','Self-reviewed practice. Your text is saved; it is not automatically graded.'),'eng-speaking-note');
      }
      input.addEventListener('input',()=>{input.classList.remove('is-correct','is-incorrect');onChange();});
      const accepted=[e.respuesta,...(e.accepted_answers||[]),...(e.respuestas_alternativas||[])].filter(x=>typeof x==='string');
      return {isAnswered:()=>!!input.value.trim()&&(!writing||reviewed&&input.value.trim().split(/\s+/).length>=(e.min_words||5)),getAnswer:()=>writing?{text:input.value,reviewed}:input.value,
        evaluate:()=>baseResult(e,{correct:writing?true:accepted.some(a=>norm(a)===norm(input.value)),selectedLabel:input.value,correctLabel:e.respuesta,assessment:writing?'self_report':'objective'}),
        reveal:r=>{if(!writing){input.classList.remove('is-correct','is-incorrect');input.classList.add(r.correct?'is-correct':'is-incorrect');}},
        setDisabled:v=>disableAll(host,v),focus:()=>input.focus(),destroy:()=>{}};
    }
    T.recordar=(host,e,c)=>inputController(host,e,c);
    T.dictado=(host,e,c)=>inputController(host,e,c);
    T.deletrear=(host,e,c)=>inputController(host,e,c,{guided:true});
    T.dialogo=(host,e,c)=>inputController(host,e,c);
    T.escritura_guiada=(host,e,c)=>inputController(host,e,c,{writing:true});
    const legacyGap=T.completar;
    T.completar=(host,e,c)=>{if(e.opciones?.length){text(host,e.prompt||e.instruccion);return legacyGap(host,e,c);}return inputController(host,e,c);};
    T.imagen_palabra=(host,e,c)=>{visual(host,e.stimulus_visual);return T.elegir_texto(host,Object.assign({},e,{disable_auto_visuals:true}),c);};
    T.palabra_imagen=(host,e,c)=>{text(host,e.prompt);return T.elegir_imagen(host,Object.assign({},e,{hide_option_text:true}),c);};
    const order=T.ordenar;
    T.ordenar_palabra=(host,e,c)=>{
      if(e.prompt)text(host,e.prompt);if(e.stimulus_visual)visual(host,e.stimulus_visual);
      const ctrl=order(host,e,c), evaluate=ctrl.evaluate;
      ctrl.evaluate=()=>{const r=evaluate();r.correctLabel=(e.respuesta||[]).join('');return r;};return ctrl;
    };
    T.clasificar=(host,e,c)=>{
      const items=shuffle(e.items||[]),values={};
      items.forEach((item,i)=>{const row=el('div','eng-classify-row');
        if(item.visual)visual(row,item.visual);else text(row,item.text,'eng-classify-word');
        const field=el('label','eng-response-label',label('Grupo','Group'));const select=el('select','eng-input');select.setAttribute('aria-label',label('Grupo para ','Group for ')+item.text);
        const empty=el('option','',label('Elige un grupo','Choose a group'));empty.value='';select.append(empty);
        e.categories.forEach(category=>{const option=el('option','',category);option.value=category;select.append(option);});
        select.addEventListener('change',()=>{values[i]=select.value;c();});field.append(select);row.append(field);host.append(row);
      });
      return {isAnswered:()=>items.every((_,i)=>!!values[i]),getAnswer:()=>items.map((item,i)=>({text:item.text,category:values[i]})),
        evaluate:()=>baseResult(e,{correct:items.every((item,i)=>values[i]===item.category),correctLabel:items.map(item=>item.text+' → '+item.category).join('; ')}),
        reveal:r=>{if(r.correct||r.final)text(host,items.map(item=>item.text+' → '+item.category).join(' · '),'eng-solution');},
        setDisabled:v=>disableAll(host,v),focus:()=>host.querySelector('select')?.focus(),destroy:()=>{}};
    };
    T.hablar=(host,e,c,runtime)=>{
      text(host,e.frase,'eng-speaking-phrase');let heard=false,repeated=false;
      const listen=el('button','eng-audio',label('Escuchar modelo','Listen to model'));listen.type='button';listen.dataset.audioState='ready';
      const field=el('label','eng-rubric-item');const check=el('input');check.type='checkbox';check.disabled=true;field.append(check,el('span','',label('He repetido la frase en voz alta','I repeated the phrase aloud')));
      host.append(listen,field);text(host,label('Práctica oral: no se evalúa tu pronunciación automáticamente.','Speaking practice: pronunciation is not automatically assessed.'),'eng-speaking-note');
      listen.onclick=()=>{listen.dataset.audioState='loading';playAudio(e.audio_src||'',e.frase,{
        onStart:()=>{listen.dataset.audioState='playing';listen.textContent=label('Escuchando…','Playing…');},
        onEnd:()=>{heard=true;check.disabled=false;listen.dataset.audioState='ready';listen.textContent=label('Repetir audio','Replay');c();},
        onError:()=>{listen.dataset.audioState='error';runtime.technicalFailure('audio_unavailable');},
        onDisabled:()=>runtime.technicalFailure('audio_disabled')});};
      check.onchange=()=>{repeated=check.checked;c();};
      if(!audioSettings().sound)setTimeout(()=>runtime.technicalFailure('audio_disabled'),0);
      return {isAnswered:()=>heard&&repeated,getAnswer:()=>({heard,repeated}),evaluate:()=>baseResult(e,{correct:true,correctLabel:e.frase,assessment:'self_report'}),reveal:()=>{},setDisabled:v=>disableAll(host,v),focus:()=>listen.focus(),destroy:()=>window.speechSynthesis?.cancel()};
    };
  }};
})(typeof globalThis!=='undefined'?globalThis:this);
