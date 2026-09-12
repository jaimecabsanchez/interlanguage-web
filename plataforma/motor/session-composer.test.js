const assert=require('node:assert/strict');const C=require('./session-composer'),M=require('../content/mechanics'),L=require('../content/loader');
const manifest=require('../content/manifest');L.reset();global.ILContent=L;manifest.forEach(f=>require('../'+f.split('?')[0]));delete global.ILContent;
const bank=L.assemble();
for(const unit of bank.units)for(const band of unit.stage){
  const exercises=bank.exercises.filter(e=>e.unit_id===unit.id);
  for(let day=0;day<20;day++){
    const args={exercises,band,cefr:band==='p12'?'Pre-A1':band==='eso'?'B1':'A1',seed:'student|'+day};const s=C.compose(args);
    assert(s.items.length>0,unit.id+band);assert.equal(new Set(s.items.map(e=>e.id)).size,s.items.length);
    assert(s.items.every(e=>M.compatible(e,band)));assert(s.estimatedSeconds<=M.TARGETS[band][1]);
    assert(s.estimatedSeconds>=M.TARGETS[band][0],unit.id+band+' time target');
    assert(s.steps.filter(p=>p.mode==='recognition').length<=3);
    assert(new Set(s.steps.map(e=>e.mechanic)).size>=3,unit.id+band);
    assert(s.steps.some(e=>e.mode==='production'),unit.id+band+' production');
    assert(s.steps.some(e=>e.mode==='retrieval'),unit.id+band+' retrieval');
    assert.deepEqual(C.compose(args),s,'deterministic');
    for(let i=2;i<s.steps.length;i++)assert(!(s.steps[i].mechanic===s.steps[i-1].mechanic&&s.steps[i].mechanic===s.steps[i-2].mechanic));
  }
}
const school=bank.exercises.filter(e=>e.unit_id==='primer-vuelo');
const due='school-spell-book';const reviewed=C.compose({exercises:school,band:'p34',cefr:'A1',dueIds:[due],seed:'review'});
assert(reviewed.steps.some(s=>s.exercise.id===due&&s.role==='review'));
const empty=C.compose({exercises:[],band:'p12'});assert(empty.underTarget);assert.equal(empty.items.length,0);
const one=C.compose({exercises:school.slice(0,1),band:'p12'});assert(one.underTarget);assert.equal(one.items.length,1);
const choiceOnly=C.compose({exercises:school.filter(e=>e.tipo==='elegir_imagen'),band:'p12'});assert(choiceOnly.items.length<=3);assert(choiceOnly.underTarget);
const neutral=C.compose({exercises:school,band:'neutral',cefr:'A1'});assert(neutral.items.every(e=>M.compatible(e,'neutral')));
assert(!M.compatible(bank.exercises.find(e=>e.tipo==='dictado'),'p12'));
console.log('composer: 20 seeds per unit × band, budgets, variety, review, determinism, scarcity and neutral');
