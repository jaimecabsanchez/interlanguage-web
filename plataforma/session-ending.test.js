const assert=require('node:assert/strict'),E=require('./session-ending.js'),fs=require('node:fs'),path=require('node:path');
const input={mode:'daily',itemIds:['a','b'],events:[{exercise_id:'a',skill:'vocabulary',response_time_ms:30000},{exercise_id:'a',skill:'vocabulary',response_time_ms:10000},{exercise_id:'b',skill:'listening',response_time_ms:20000}],learned:['apple','apple','banana']};
for(const [band,steps] of [['p12',3],['p34',2],['p56',1],['eso',1],['neutral',1]]){const m=E.model({...input,band});assert.equal(m.steps,steps);assert.equal(m.done,2);assert.equal(m.seconds,60);assert.deepEqual(m.learned,['apple','banana']);assert.equal(m.coins,0);}
assert.equal(E.model({...input,mode:'extra',band:'eso'}).title,'Practice complete');
assert.equal(E.model({...input,band:'p12',reward:{session:{awards:[{coins:10}]}}}).coins,10);
const source=fs.readFileSync(path.join(__dirname,'session-ending.js'),'utf8');assert.doesNotMatch(source,/ILMission\.(complete|advance)|ILMastery\.record|completeLesson/,'presentation cannot alter education');
console.log('session-ending: age sequences, truthful evidence, time and learning isolation passed');
