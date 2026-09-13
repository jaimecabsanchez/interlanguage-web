/* Presentation uses recorded evidence only. Currency cannot update mission/mastery. */
(function(root,factory){
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.ILSessionEnding=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
  'use strict';
  const REASONS={
    'three-missions':['Cofre de tres misiones','Three-mission collection box'],
    'weekly-goal':['Cofre semanal: cinco misiones','Weekly box: five missions'],
    'listening-10':['Has reconocido 10 objetivos al escuchar','10 listening objectives recognised'],
    'review-5':['Has recuperado 5 objetivos al repasar','5 review objectives recovered'],
    'mastery-3':['Dominas 3 objetivos: tu mundo crece','3 mastered objectives: your space grows'],
    achievement:['Conseguido con un logro','Earned with an achievement']
  };
  function model(input){
    const events=(input.events||[]).filter(e=>!e.technical_failure),ids=new Set(input.itemIds||[]);
    const done=new Set(events.filter(e=>ids.has(e.exercise_id)).map(e=>e.exercise_id));
    const skills={};events.forEach(e=>{if(ids.has(e.exercise_id)){if(!skills[e.skill])skills[e.skill]=new Set();skills[e.skill].add(e.exercise_id);}});
    const sec=input.band==='eso',daily=input.mode==='daily',young=input.band==='p12',middle=input.band==='p34';
    const seconds=Math.max(0,Math.round(events.reduce((n,e)=>n+Math.max(0,Math.min(300000,Number(e.response_time_ms)||0)),0)/1000));
    const awards=input.reward?.session?.awards||[];
    return {...input,sec,daily,steps:young?3:middle?2:1,done:done.size,seconds,
      title:sec?(daily?'Session complete':'Practice complete'):(daily?'¡Misión completada!':'¡Práctica completada!'),
      skills:Object.entries(skills).filter(([skill])=>skill).map(([skill,set])=>({skill,count:set.size})),
      learned:Array.from(new Set((input.learned||[]).filter(Boolean))).slice(0,3),
      coins:awards.reduce((n,a)=>n+a.coins,0),awards,unlocks:awards.filter(a=>a.item)};
  }
  function render(host,input){
    const m=model(input),t=(es,en)=>m.sec?en:es;let step=0;
    const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;};
    const link=(label,url,primary)=>{const a=el('a',primary?'btn btn-primary':'btn btn-ghost',label);a.href=url;return a;};
    const name=id=>{const item=root.ILWorldData?.CATALOG.find(i=>i.id===id);return item?root.ILWorldData.displayName(item,input.band):id;};
    const skillLabel=id=>root.ILCopy?.practiceSkill(id,m.band)||id;
    const duration=m.seconds<60?m.seconds+' s':Math.floor(m.seconds/60)+' min'+(m.seconds%60?' '+m.seconds%60+' s':'');
    host.classList.remove('hidden');host.classList.add('session-ending');host.dataset.band=m.band;
    host.setAttribute('role','region');host.setAttribute('aria-labelledby','endingTitle');
    document.querySelector('.mission-shell')?.setAttribute('inert','');
    const stage=document.getElementById('stage');if(stage)stage.closest('main')?.setAttribute('inert','');
    function evidence(panel){
      const section=el('section','ending-evidence');section.append(el('h2','',t('Hoy has practicado','Today’s practice')));
      if(m.learned.length){const list=el('ul','ending-phrases');m.learned.forEach(word=>{const li=el('li','',word);li.lang='en';list.append(li);});section.append(list);}
      else {const p=el('p','',m.skills.slice(0,3).map(s=>skillLabel(s.skill)).join(' · ')||t('Tu sesión de inglés','Your English session'));section.append(p);}
      if(m.band!=='p12'){
        section.append(el('p','ending-detail',m.done+' '+t('ejercicios practicados','exercises practised')+(m.seconds?' · '+duration:'')));
        if(m.skills.length&&m.learned.length)section.append(el('p','ending-detail',m.skills.slice(0,3).map(s=>skillLabel(s.skill)+' · '+s.count).join(' / ')));
      }
      const errors=Number(m.errors)||0;
      if(errors)section.append(el('p','ending-detail',t(errors+' para seguir repasando, a tu ritmo.',errors+' to review at your own pace.')));
      panel.append(section);
    }
    function reward(panel){
      const section=el('section','ending-reward');
      section.append(el('h2','',m.coins?'+'+m.coins+' Alas':t('Tu avance cuenta','Your practice counts')));
      section.append(el('p','',m.coins?(m.band==='p12'?'Para decorar tu mundo.':t('Para personalizar tu mundo. Solo cosméticos.','For personalising your space. Cosmetics only.')):
        m.rewardError?t('No se ha podido guardar la recompensa. Puedes reintentarlo.','The reward could not be saved. You can retry.'):
        t('La práctica está registrada. Esta sesión no añade Alas.','Practice recorded. This session adds no Alas.')));
      if(m.rewardError&&input.retry){const b=el('button','btn btn-ghost',t('Reintentar guardado','Retry saving'));b.type='button';b.onclick=input.retry;section.append(b);}
      if(m.unlocks.length){
        const list=el('ul','ending-unlocks');m.unlocks.forEach(a=>{
          const li=el('li');const item=root.ILWorldData?.CATALOG.find(i=>i.id===a.item);
          if(item&&root.ILWorldVisual){const visual=el('span','ending-item');visual.setAttribute('aria-hidden','true');visual.innerHTML=root.ILWorldVisual.item(item,input.settings||{},input.progress||{});li.append(visual);}
          const words=el('span');words.append(el('b','',name(a.item)),el('small','',(REASONS[a.reason]||REASONS.achievement)[m.sec?1:0]));li.append(words);list.append(li);
        });section.append(list);
      }
      if(input.next){const next=input.next;section.append(el('p','ending-next',m.band==='p12'?'En '+(next.target-next.current)+' misiones: '+name(next.item):t('Próximo cofre: ','Next collection box: ')+name(next.item)+' · '+next.current+'/'+next.target+' '+t('misiones','missions')));}
      if(!m.rewardError)section.append(el('small','ending-local',m.band==='p12'?'Alas guardadas en este navegador.':t('Alas y colección guardadas en este navegador.','Alas and collection saved in this browser.')));
      panel.append(section);
    }
    function draw(){
      host.replaceChildren();const panel=el('div','ending-panel');
      const progress=el('p','ending-eyebrow',m.steps>1?t('TU MISIÓN','YOUR SESSION')+' · '+(step+1)+' / '+m.steps:t('TU PROGRESO','YOUR PROGRESS'));panel.append(progress);
      const title=el('h1','',step===0?m.title:step===1&&m.steps===3?'Mira lo que has practicado':'¡Tu recompensa!');title.id='endingTitle';title.tabIndex=-1;panel.append(title);
      if(step===0){
        const icon=el('div','ending-mark');icon.setAttribute('aria-hidden','true');icon.innerHTML=root.ILIcon?root.ILIcon('check'):'';panel.prepend(icon);
        panel.append(el('p','ending-lead',m.daily?t('Hoy has dedicado un rato a tu inglés. ¡Buen trabajo!','You made time for your English today.'):
          t('Esta práctica suma aprendizaje. Tu misión diaria no cambia.','This practice builds learning. Your daily mission is unchanged.')));
      }
      if(m.steps===1||(m.steps===2&&step===0)||(m.steps===3&&step===1))evidence(panel);
      if(m.steps===1||step===m.steps-1)reward(panel);
      const actions=el('div','ending-actions');
      if(step<m.steps-1){const b=el('button','btn btn-primary',step===0&&m.steps===3?'Ver lo que he practicado':'Ver mi recompensa');b.type='button';b.onclick=()=>{step++;draw();};actions.append(b);}
      else{
        actions.append(link(t('Ver mi mundo','View my space'),'tienda.html?tab=world',true),link(t('Terminar','Done'),m.daily?'inicio.html':'practicar.html'));
        panel.append(el('p','ending-return',m.daily?t('Mañana te espera otra misión.','A new mission awaits tomorrow.'):t('Puedes continuar con tu misión desde Inicio.','You can continue your daily mission from Home.')));
      }
      if(step>0){const b=el('button','btn btn-ghost','Atrás');b.type='button';b.onclick=()=>{step--;draw();};actions.append(b);}
      panel.append(actions);host.append(panel);title.focus();
    }
    draw();return m;
  }
  return {model,render};
});
