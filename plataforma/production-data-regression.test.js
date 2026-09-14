const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/auth.js','utf8');
function api(fixtures={}){
  const storage=new Map();
  const client={auth:{getUser:async()=>({data:{user:null},error:null})},from(table){
    const result=fixtures[table]||{data:null,error:null};
    return {select(){return this;},eq(){return this;},single(){return Promise.resolve(result);},maybeSingle(){return Promise.resolve(result);},upsert(){return Promise.resolve(typeof result==='function'?result(storage):result);}};
  }};
  const window={IL_SUPABASE:{url:'https://test.invalid',publishableKey:'public'},supabase:{createClient:()=>client}};
  const sandbox={window,location:{hostname:'test.invalid',search:''},URLSearchParams,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},addEventListener(){},console,Date};
  vm.runInNewContext(source,sandbox);window.ILAuth.testStorage=storage;return window.ILAuth;
}
(async()=>{
  const failed=api({student_state:{data:null,error:new Error('unavailable')}});failed.getProfile=async()=>({student_id:'s',username:'test'});
  await assert.rejects(()=>failed.getProgress(),/unavailable/,'network errors must never look like zero progress');
  await assert.rejects(()=>failed._save({student_id:'s'}),/unavailable/,'failed writes cannot report success');
  const a=api();const now=new Date();const today=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
  const queued={kind:'attempt',payload:{id:'old'},queued_at:'first'},fresh={kind:'attempt',payload:{id:'new'},queued_at:'second'};
  const flushing=api({attempts:storage=>{storage.set('il_learning_outbox_v1',JSON.stringify([queued,fresh]));return {error:null};}});
  flushing.testStorage.set('il_learning_outbox_v1',JSON.stringify([queued]));await flushing.flushLearningOutbox();
  assert.deepEqual(JSON.parse(flushing.testStorage.get('il_learning_outbox_v1')),[fresh],'flush preserves concurrent new events');
  assert.doesNotMatch(source,/appendBounded\(OUTBOX_KEY/,'unsent educational events must not be silently truncated');
  a.getProgress=async()=>({last:today,lessons:4});let writes=0;a._save=async()=>writes++;
  assert.equal((await a.completeLesson()).lessons,4);assert.equal(writes,0,'repeat completion does not add daily progress');
  const lesson=fs.readFileSync(__dirname+'/leccion.html','utf8');assert.match(lesson,/!state\.completionRecorded[\s\S]*await finishMission/,'locally completed unsynced sessions can retry on reload');
  const login=fs.readFileSync(__dirname+'/index.html','utf8');assert.match(login,/catch \(error\)[\s\S]*btn\.disabled = false/,'login failure restores control');assert.match(login,/id="msg" role="alert"/);
  assert.match(source,/const DEMO = forceDemo \|\| \(noKeys && localHost\)/,'missing production configuration cannot silently activate demo');
  const css=fs.readFileSync(__dirname+'/world.css','utf8');assert.match(css,/--world-touch:56px/);assert.match(css,/trait-range input\{height:var\(--world-touch\)/,'avatar controls meet the age target');
  const headers=fs.readFileSync(__dirname+'/netlify.toml','utf8');assert.match(headers,/X-Frame-Options = "DENY"/);assert.match(headers,/X-Content-Type-Options = "nosniff"/);
  console.log('production regressions: failed reads/writes, daily idempotency, completion retry and login recovery passed');
})().catch(e=>{console.error(e);process.exitCode=1;});
