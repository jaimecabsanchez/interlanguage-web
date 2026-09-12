(function(root,factory){
  const api=factory(root.ILMechanics||(typeof require==='function'?require('../content/mechanics.js'):null));
  if(typeof module==='object'&&module.exports)module.exports=api;else root.ILSessionComposer=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(M){
  'use strict';
  const LEVEL={'Pre-A1':0,A1:1,A2:2,B1:3};
  const hash=s=>[...String(s)].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,0);
  function compose(input){
    const band=input.band||'neutral',range=M.TARGETS[band]||M.TARGETS.neutral;
    const target=LEVEL[input.cefr]??1, seed=input.seed||'', due=new Set(input.dueIds||[]),recent=input.recentIds||[];
    let remaining=(input.exercises||[]).filter(e=>M.compatible(e,band)&&(LEVEL[e.cefr||e.nivel]??1)<=target+1);
    const used=new Set(),counts={},picked=[];let seconds=0;
    function take(role){
      const last=picked[picked.length-1];
      const recognitionCount=picked.filter(p=>p.mode==='recognition').length;
      const candidates=remaining.filter(e=>!used.has(e.id)&&seconds+M.estimate(e,band)<=range[1]&&(counts[M.identify(e)]||0)<2&&(M.mode(e)!=='recognition'||recognitionCount<3));
      if(!candidates.length)return false;
      function score(e){
        const m=M.get(e),level=LEVEL[e.cefr||e.nivel]??1;
        let n=(counts[m.id]||0)*50+(last?.mechanic===m.id?60:0)+(level>target?50:Math.abs(level-target)*5);
        const recentIndex=recent.indexOf(e.id);if(recentIndex>=0)n+=15+recentIndex/Math.max(1,recent.length)*15;
        if(picked.some(p=>p.exercise.variant_group===e.variant_group&&e.variant_group))n+=20;
        if(last?.mode==='recognition'&&M.mode(e)==='recognition')n+=100;
        if(role==='quick_win')n+=(M.mode(e)==='recognition'?0:180)+(e.difficulty||1)*10;
        if(role==='retrieval')n+=M.mode(e)==='retrieval'?0:180;
        if(role==='production')n+=M.mode(e)==='production'?0:180;
        if(role==='review')n+=due.has(e.id)?-180:100;
        if(role==='stretch')n+=level===target&&(e.difficulty||1)>=3?-60:0;
        if(role==='finish')n+=(e.difficulty||1)*10;
        return n+(hash(seed+'|'+e.id)%997)/997;
      }
      candidates.sort((a,b)=>score(a)-score(b));const e=candidates[0],mechanic=M.identify(e);
      used.add(e.id);counts[mechanic]=(counts[mechanic]||0)+1;const time=M.estimate(e,band);seconds+=time;
      picked.push({exercise:e,mechanic,mode:M.mode(e),role:due.has(e.id)?'review':role,seconds:time});return true;
    }
    // Los roles son prioridades, no siete huecos fijos. Nunca duplicamos ítems para rellenar tiempo.
    const sequence=['quick_win',due.size?'review':'core','core','retrieval','production','stretch'];
    for(const role of sequence){if(seconds>=range[0])break;if(!take(role))break;}
    let step=0;
    while(seconds<range[0]&&picked.length<18){
      const role=seconds>=range[0]-70?'finish':['retrieval','production','core'][step++%3];if(!take(role))break;
    }
    const modes=new Set(picked.map(p=>p.mode));
    return {items:picked.map(p=>p.exercise),steps:picked,estimatedSeconds:seconds,targetSeconds:range,underTarget:seconds<range[0],missingModes:['recognition','retrieval','production'].filter(m=>!modes.has(m))};
  }
  return {compose};
});
