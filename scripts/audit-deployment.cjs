/* Public HTTP and anonymous database checks only. Never prints data rows or keys. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const project=path.resolve(__dirname,'..'),out='/tmp/il-production-audit';fs.mkdirSync(out,{recursive:true});
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
(async()=>{
  const config={window:{}};vm.runInNewContext(fs.readFileSync(path.join(project,'plataforma/supabase-config.js'),'utf8'),config);
  const cfg=config.window.IL_SUPABASE,report={checkedAt:new Date().toISOString(),site:[],anonymous:[]};
  for(const file of ['index.html','inicio.html','practicar.html','leccion.html','auth.js','learning-data.js','session-ending.js','motor/rewards.js','assets/avatar/look-05.webp']){
    const r=await fetch('https://interlanguage-home.netlify.app/'+file,{signal:AbortSignal.timeout(15000)}),bytes=Buffer.from(await r.arrayBuffer());
    const item={file,status:r.status,type:r.headers.get('content-type'),bytes:bytes.length,cache:r.headers.get('cache-control'),csp:r.headers.get('content-security-policy'),frame:r.headers.get('x-frame-options'),nosniff:r.headers.get('x-content-type-options'),sameAsLocal:hash(bytes)===hash(fs.readFileSync(path.join(project,'plataforma',file)))};
    report.site.push(item);console.log(JSON.stringify(item));
  }
  for(const table of ['users','students','attempts','answer_keys','mastery','user_roles','consents','student_placements','exercise_mastery','practice_sessions']){
    try {
    const r=await fetch(cfg.url+'/rest/v1/'+table+'?select=*&limit=1',{headers:{apikey:cfg.publishableKey||cfg.anonKey},signal:AbortSignal.timeout(15000)});
    const body=await r.json();const item={table,status:r.status,rows:Array.isArray(body)?body.length:null,errorCode:Array.isArray(body)?null:body.code||null};
    report.anonymous.push(item);console.log(JSON.stringify(item));
    } catch(error) {const item={table,error:error.cause?.code||error.message};report.anonymous.push(item);console.log(JSON.stringify(item));}
  }
  fs.writeFileSync(path.join(out,'network.json'),JSON.stringify(report,null,2));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
