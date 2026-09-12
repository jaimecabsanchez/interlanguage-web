const assert=require('node:assert/strict');
const A=require('./authoring'),L=require('./loader'),M=require('./mechanics');
const manifest=require('./manifest');L.reset();global.ILContent=L;
manifest.forEach(f=>{const p='./'+f.replace('content/','').split('?')[0];delete require.cache[require.resolve(p)];require(p);});delete global.ILContent;
const bank=L.assemble();assert.equal(bank.diagnostics.errors.length,0,JSON.stringify(bank.diagnostics.errors));
assert.equal(bank.exercises.length,209);
assert.equal(new Set(bank.exercises.map(M.identify)).size,16);
for(const e of bank.exercises)assert(A.validate(e).valid,e.id);
const sample=bank.exercises.find(e=>e.id==='routine-recall-breakfast');
for(const field of ['instruccion','respuesta','habilidad','nivel','stage','difficulty','estimated_seconds']){
  const copy=JSON.parse(JSON.stringify(sample));
  // Test the raw editorial source, not aliases supplied by normalisation.
  const aliases={instruccion:'instruction',respuesta:'answer',habilidad:'skill',nivel:'cefr'};
  delete copy[field];delete copy[aliases[field]];
  assert(!A.validate(copy).valid,'reject missing '+field);
}
const badChoice={...bank.exercises.find(e=>e.id==='pv-1'),opciones:[{texto:'book',correcta:true},{texto:'pen',correcta:true}]};
delete badChoice.options;assert(!A.validate(badChoice).valid);
const invalidType={...sample,mechanic:'magic'};assert(!A.validate(invalidType).valid);
const wrongOrder={...bank.exercises.find(e=>e.id==='school-order-pencil'),respuesta:['p'],answer:['p']};assert(!A.validate(wrongOrder).valid);
for(const unit of bank.units){const es=bank.exercises.filter(e=>e.unit_id===unit.id);assert(new Set(es.map(M.identify)).size>=6,unit.id+' needs variety');}
console.log('authoring: 209 exercises, 16 mechanics, required fields, invalid answers and unit variety');
