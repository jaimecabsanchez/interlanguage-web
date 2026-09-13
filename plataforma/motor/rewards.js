/* Pure, rebuildable cosmetic projection. Educational receipts are the source;
   balances and inventory are outputs, never inputs to learning. No randomness. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.ILRewards=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const POLICY=Object.freeze({version:1,currency:'Alas',daily:10,extra:[3,1],dailyCap:14,weeklyGoal:5});
  const SHOP=Object.freeze([
    {id:'bg-sunset',price:20}, {id:'bg-night',price:60},
    {id:'world-pond',price:50}, {id:'world-bicycle',price:70},
    {id:'world-travel-board',price:30}, {id:'world-tech-desk',price:70}
  ]);
  const TRACKS={
    p12:{small:['world-toy-plane','bg-sunset','pet-nube'],weekly:['world-lanterns','world-bench','pet-brisa'],growth:'world-greenhouse',listening:'world-ball',review:'world-flowers'},
    p34:{small:['world-ball','bg-sunset','pet-nube'],weekly:['world-lanterns','world-bench','pet-brisa'],growth:'world-greenhouse',listening:'world-bicycle',review:'world-flowers'},
    p56:{small:['world-plant','bg-sunset','world-travel-board'],weekly:['world-lanterns','bg-night','world-tech-desk'],growth:'world-tech-desk',listening:'world-music-poster',review:'world-bench'},
    eso:{small:['world-plant','bg-sunset','world-travel-board'],weekly:['bg-night','world-tech-desk'],growth:'world-tech-desk',listening:'world-music-poster',review:'world-plant'}
  };
  function weekKey(day){const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));return d.toISOString().slice(0,10);}
  const objective=e=>e.objective_id||e.exercise_id;
  const smallItem=(track,index,owned)=>[track.small[index]].concat(track.small,track.weekly).find(id=>id&&!owned.has(id));
  const valid=e=>e&&e.attempt_id&&e.exercise_id&&!e.technical_failure&&e.assessment!=='self_report'&&typeof e.correct==='boolean';
  function evidence(receipt){
    const ids=new Set(receipt.itemIds||[]),seen=new Set();
    return (receipt.events||[]).filter(e=>{
      if(!valid(e)||!ids.has(e.exercise_id)||e.client_session_key!==receipt.sessionKey||seen.has(e.attempt_id))return false;
      seen.add(e.attempt_id);return true;
    });
  }
  function qualifies(r,events){
    const ids=new Set(r.itemIds||[]);
    const attempted=new Set((r.events||[]).filter(e=>e.attempt_id&&e.client_session_key===r.sessionKey).map(e=>e.exercise_id));
    return r.completed===true&&/^\d{4}-\d{2}-\d{2}$/.test(r.date)&&Number.isFinite(Date.parse(r.date))&&ids.size>0&&
      Array.from(ids).every(id=>attempted.has(id))&&
      new Set(events.map(e=>e.exercise_id)).size>=Math.min(ids.size,Math.max(2,Math.ceil(ids.size*.6)));
  }
  function project(receipts,purchases){
    const awards=[],owned=new Set(),seenAttempts=new Set(),seenObjectives=new Set(),seenReceipts=new Set();
    const days=new Set(),weeks={},extraCounts={},credited={},listening=new Set(),reviewed=new Set(),mastered=new Set();
    let spent=0;const accepted=[],purchaseIds=new Set();
    const resultBySession={};let missionCount=0;
    const grant=(r,id,kind,coins,item,reason)=>{
      if(awards.some(a=>a.id===id))return;
      if(item&&owned.has(item))return;
      const a={id,sessionKey:r.sessionKey,date:r.date,kind,coins:coins||0,item:item||null,reason};
      awards.push(a);if(item)owned.add(item);
    };
    const sorted=(receipts||[]).concat((purchases||[]).map(p=>({purchase:p,completedAt:p.purchasedAt||p.date+'T23:59:59Z'}))).sort((a,b)=>String(a.completedAt).localeCompare(String(b.completedAt))||String(a.sessionKey).localeCompare(String(b.sessionKey)));
    sorted.forEach(r=>{
      if(r.purchase){
        const p=r.purchase,item=SHOP.find(i=>i.id===p.itemId),available=awards.reduce((sum,a)=>sum+a.coins,0)-spent;
        if(!p.id||purchaseIds.has(p.id)||!item||owned.has(item.id)||available<item.price)return;
        purchaseIds.add(p.id);owned.add(item.id);spent+=item.price;accepted.push({id:p.id,itemId:item.id,price:item.price});return;
      }
      if(!r.sessionKey||seenReceipts.has(r.sessionKey))return;
      seenReceipts.add(r.sessionKey);
      const events=evidence(r).filter(e=>!seenAttempts.has(e.attempt_id));
      const eligible=qualifies(r,events),track=TRACKS[r.band];
      const credit=credited[r.date]||(credited[r.date]=new Set());
      const fresh=new Set(events.filter(e=>!credit.has(objective(e))&&(!seenObjectives.has(objective(e))||(r.dueIds||[]).includes(e.exercise_id))).map(objective));
      const before=awards.length;
      if(eligible&&r.mode==='daily'&&!days.has(r.date)){
        days.add(r.date);missionCount++;
        grant(r,'daily:'+r.date,'mission',POLICY.daily,null,'daily');
        if(track&&missionCount%3===0&&missionCount<=9){const item=smallItem(track,missionCount/3-1,owned);if(item)grant(r,'small:'+missionCount,'small-chest',0,item,'three-missions');}
        const wk=weekKey(r.date);weeks[wk]=(weeks[wk]||0)+1;
        if(track&&weeks[wk]===POLICY.weeklyGoal){const item=track.weekly.find(id=>!owned.has(id));if(item)grant(r,'week:'+wk,'weekly-chest',0,item,'weekly-goal');}
      }else if(eligible&&(r.mode==='extra'||r.mode==='review')&&fresh.size>=2){
        const n=extraCounts[r.date]||0;
        if(n<POLICY.extra.length){grant(r,'extra:'+r.date+':'+n,'practice',POLICY.extra[n],null,'new-or-due');extraCounts[r.date]=n+1;}
      }
      if(eligible){
        events.forEach(e=>{
          if(e.correct&&!e.hint_used&&e.skill==='listening')listening.add(objective(e));
          if(e.correct&&(r.dueIds||[]).includes(e.exercise_id))reviewed.add(objective(e));
          if(e.correct&&(r.masteredIds||[]).includes(e.exercise_id))mastered.add(objective(e));
        });
        if(track){
          if(listening.size>=10)grant(r,'growth:listening','world-growth',0,track.listening,'listening-10');
          if(reviewed.size>=5)grant(r,'growth:review','world-growth',0,track.review,'review-5');
          if(mastered.size>=3)grant(r,'growth:mastery','world-growth',0,track.growth,'mastery-3');
          (r.achievementItems||[]).filter(id=>typeof id==='string').forEach(id=>grant(r,'achievement:'+id,'achievement',0,id,'achievement'));
        }
      }
      events.forEach(e=>{seenAttempts.add(e.attempt_id);seenObjectives.add(objective(e));credit.add(objective(e));});
      resultBySession[r.sessionKey]={eligible,awards:awards.slice(before),reason:eligible?'limit-or-already-practised':'insufficient-evidence'};
    });
    const earned=awards.reduce((sum,a)=>sum+a.coins,0);
    return {version:POLICY.version,earned,spent,balance:earned-spent,owned:Array.from(owned),awards,accepted,resultBySession,
      missionCount,weeklyCounts:weeks,growth:{listening:listening.size,review:reviewed.size,mastery:mastered.size}};
  }
  function next(receipts,purchases,band,date){
    const p=project(receipts,purchases),track=TRACKS[band];
    if(!track)return null;
    const milestone=[3,6,9].find(n=>n>p.missionCount);
    if(milestone){const item=smallItem(track,milestone/3-1,new Set(p.owned));if(item)return {kind:'small-chest',current:p.missionCount,target:milestone,item};}
    const item=track.weekly.find(id=>!p.owned.includes(id));
    return item?{kind:'weekly-chest',current:p.weeklyCounts[weekKey(date)]||0,target:POLICY.weeklyGoal,item}:null;
  }
  return {POLICY,SHOP,TRACKS,project,next,evidence,qualifies,weekKey};
});
