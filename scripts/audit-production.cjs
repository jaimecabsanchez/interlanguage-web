/* Read-only UI audit against isolated local demo contexts. No student-server writes. */
const fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const base=process.env.IL_QA_URL||'http://localhost:8764';
const appRoot=process.env.IL_AUDIT_PATH||'/plataforma/';
const output=process.env.IL_AUDIT_DIR||'/tmp/il-production-audit';fs.mkdirSync(output,{recursive:true});
const routes=[['login','index.html'],['onboarding','onboarding.html?onboardingDemo=1'],['placement','test-nivel.html'],['inicio','inicio.html'],['practicar','practicar.html'],['leccion','leccion.html'],['progreso','progreso.html'],['perfil','perfil.html'],['mundo','tienda.html?tab=world'],['avatar','tienda.html'],['ajustes','ajustes.html'],['familias','familias.html']];
async function inspect(page){return page.evaluate(()=>{
  const visible=e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('[hidden],.hidden,[inert]');
  const name=e=>e.getAttribute('aria-label')||(e.getAttribute('aria-labelledby')||'').split(' ').map(id=>document.getElementById(id)?.textContent||'').join(' ').trim()||e.labels?.[0]?.textContent||e.textContent?.trim()||e.getAttribute('alt')||'';
  const controls=[...document.querySelectorAll('button,a[href],input,select,textarea,[role=button]')].filter(visible).filter(e=>!e.closest('.age-mode-switcher'));
  const pending=[...document.querySelectorAll('[aria-busy=true],.il-state--loading')].filter(visible).map(e=>e.id||e.className);
  return {title:document.title,lang:document.documentElement.lang,url:location.pathname,stage:document.body.dataset.stage,
    headings:[...document.querySelectorAll('h1,h2')].filter(visible).map(e=>e.textContent.trim()),text:document.body.innerText.slice(0,12000),
    overflow:document.documentElement.scrollWidth>innerWidth+1,pending,
    missingNames:controls.filter(e=>!name(e)&&e.type!=='hidden').map(e=>({tag:e.tagName,id:e.id,type:e.type})),
    missingAlt:[...document.images].filter(e=>visible(e)&&!e.hasAttribute('alt')).map(e=>e.getAttribute('src')),
    smallTargets:controls.filter(e=>{const r=e.getBoundingClientRect();return r.height<43||r.width<43;}).map(e=>({tag:e.tagName,id:e.id,name:name(e).slice(0,60),height:Math.round(e.getBoundingClientRect().height),width:Math.round(e.getBoundingClientRect().width)})),
    buttons:controls.filter(e=>e.matches('.btn,button')).slice(0,25).map(e=>({label:name(e).slice(0,60),height:Math.round(e.getBoundingClientRect().height),radius:getComputedStyle(e).borderRadius,bg:getComputedStyle(e).backgroundColor})),
    images:[...document.images].map(e=>({src:e.getAttribute('src'),loading:e.loading,width:e.width,height:e.height,naturalWidth:e.naturalWidth})),
    resources:performance.getEntriesByType('resource').map(e=>({url:e.name,bytes:e.encodedBodySize,duration:Math.round(e.duration),type:e.initiatorType})),
    performance:{lcp:window.qaLCP||null,cls:window.qaCLS||0,dom:Math.round(performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd||0)}};
});}
(async()=>{
  const axeSource=process.env.IL_AUDIT_AXE==='1'?await (await fetch('https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js')).text():null;
  const browser=await chromium.launch({headless:true,executablePath:process.env.IL_CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),results=[];
  try{
    const jobs=['p12','p34','p56','eso'].flatMap(band=>routes.map(([route,url])=>({band,route,url})));
    async function worker(){while(jobs.length){const {band,route,url}=jobs.shift();const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});const page=await context.newPage();page.setDefaultTimeout(7000);
      const result={band,route,errors:[],failed:[],httpErrors:[],views:[]};
      page.on('pageerror',e=>result.errors.push(e.message));page.on('requestfailed',r=>result.failed.push({url:r.url(),error:r.failure()?.errorText}));page.on('response',r=>{if(r.status()>=400)result.httpErrors.push({url:r.url(),status:r.status()});});
      await context.addInitScript(({band,route})=>{
        localStorage.setItem('il_force_demo','1'); // Isolated demo only, even on the deployed site.
        if(route!=='login')localStorage.setItem('il_demo_session_v2','lucia');sessionStorage.setItem('il_demo_age_mode_v1',band);
        window.qaCLS=0;try{new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.qaCLS+=e.value;}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())window.qaLCP=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});}catch(e){}
      },{band,route});
      try{
        await page.goto(base+appRoot+url,{waitUntil:'networkidle',timeout:20000});
        for(const [width,height] of [[1440,900],[1024,768],[768,1024],[390,844]]){
          await page.setViewportSize({width,height});await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
          const data=await inspect(page);result.views.push({width,height,...data});
          if(width===1440||width===390)await page.screenshot({path:path.join(output,band+'-'+route+'-'+width+'.png')});
        }
        if(axeSource){await page.addScriptTag({content:axeSource});result.accessibility=await page.evaluate(async()=>{const a=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});return a.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});}
        result.keyboard=[];for(let i=0;i<6;i++){await page.keyboard.press('Tab');result.keyboard.push(await page.evaluate(()=>({tag:document.activeElement.tagName,id:document.activeElement.id,text:(document.activeElement.textContent||'').trim().slice(0,50)})));}
      }catch(e){result.errors.push(e.message);}
      results.push(result);fs.writeFileSync(path.join(output,'routes.json'),JSON.stringify(results,null,2));
      console.log(JSON.stringify({band,route,errors:result.errors,http:result.httpErrors,overflow:result.views.filter(v=>v.overflow).map(v=>v.width),missing:result.views[0]?.missingNames,pending:result.views[0]?.pending,axe:result.accessibility?.map(v=>({id:v.id,n:v.nodes.length}))}));
      await context.close();
    }}
    await Promise.all([worker(),worker()]);
    console.log('AUDIT COMPLETE',results.length,'route/age combinations',output);
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
