/* Run with the available Playwright runtime. Server: python3 -m http.server 8764 */
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.IL_QA_URL||'http://localhost:8764';
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.IL_CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  try{
    const page=await browser.newPage({viewport:{width:1024,height:768}});page.setDefaultTimeout(7000);
    await page.addInitScript(()=>{localStorage.setItem('il_demo_session_v2','lucia');sessionStorage.setItem('il_demo_age_mode_v1','p34');});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/plataforma/leccion.html?demo=1');await page.waitForFunction(()=>window.IL_CONTENIDO?.ejercicios?.length===209);
    await page.evaluate(()=>{ILProfileSettings.getActive=()=>({sound:true,autoplayAudio:false,audioSpeed:1});speechSynthesis.speak=u=>{u.onstart?.();setTimeout(()=>u.onend?.(),0);};});
    const samples=await page.evaluate(()=>Object.keys(ILMechanics.CATALOG).map(id=>IL_CONTENIDO.ejercicios.find(e=>e.mechanic===id&&(id!=='gap_fill'||e.tipo==='completar'&&!e.opciones?.length))));
    for(const ex of samples){
      assert(ex,'all mechanics need an example');const band=ex.stage[0];
      await page.evaluate(({ex,band})=>{document.body.dataset.stage=band;document.body.dataset.ageMode=band==='eso'?'secondary':band==='p56'?'primary-upper':'primary-young';window.qaAttempts=[];window.qaController=IL_ENGINE.render(document.querySelector('#stage'),ex,{stage:band,experience:{touchSize:band==='p12'?56:band==='p34'?52:band==='p56'?48:44},onAttempt:e=>qaAttempts.push(e)});qaController.focus();},{ex,band});
      if(['listen_image','listen_text','image_word','word_image'].includes(ex.mechanic)){
        const answer=ex.opciones.find(o=>o.correcta).texto;await page.locator('.eng-opt').filter({hasText:answer}).first().click();
      }else if(['sentence_order','word_order'].includes(ex.mechanic)){
        for(const word of ex.respuesta)await page.locator('.eng-word-bank').getByRole('button',{name:word,exact:true}).first().click();
      }else if(ex.mechanic==='matching'){
        for(const pair of ex.pares){await page.locator('.eng-match-row').filter({hasText:pair.a}).first().click();const name=await page.evaluate(v=>ILExerciseVisuals.get(v)?.label||v,pair.b);await page.locator('.eng-word-bank').getByRole('button',{name,exact:true}).click();}
      }else if(ex.mechanic==='classification'){
        for(const item of ex.items)await page.getByRole('combobox',{name:(band==='eso'?'Group for ':'Grupo para ')+item.text,exact:true}).selectOption(item.category);
      }else if(ex.mechanic==='reading'){
        for(const q of ex.preguntas)await page.getByRole('group',{name:q.pregunta}).getByRole('button',{name:q.opciones.find(o=>o.correcta).texto,exact:true}).click();
      }else if(ex.mechanic==='speaking'){
        await page.getByRole('button',{name:band==='eso'?'Listen to model':'Escuchar modelo',exact:true}).click();await page.getByRole('checkbox').check();
      }else{
        await page.locator('.eng-input').fill(ex.respuesta);
        if(ex.mechanic==='guided_writing')for(const checkbox of await page.getByRole('checkbox').all())await checkbox.check();
      }
      await page.locator('.eng-footer .btn').click();assert.equal(await page.locator('.eng-card').getAttribute('data-state'),'correct',ex.id);
      const attempt=await page.evaluate(()=>qaAttempts[0]);assert(attempt,ex.id+' records an attempt');
      if(ex.assessment==='self_report'){assert.equal(attempt.correct,null);assert.equal(attempt.assessment,'self_report');}
      console.log('PASS interaction',ex.mechanic,ex.id);
      await page.evaluate(()=>qaController.destroy());
    }
    const viewports=[[1440,900],[1280,800],[1024,768],[820,1180],[768,1024],[390,844],[320,740]];
    for(const [width,height] of viewports){
      await page.setViewportSize({width,height});
      for(const band of ['p12','p34','p56','eso'])for(const mechanic of ['classification','word_order','spelling','dialogue','guided_writing']){
        const rendered=await page.evaluate(({band,mechanic})=>{
          const e=IL_CONTENIDO.ejercicios.find(e=>e.mechanic===mechanic&&ILMechanics.compatible(e,band));if(!e)return false;
          document.body.dataset.stage=band;document.body.dataset.ageMode=band==='eso'?'secondary':band==='p56'?'primary-upper':'primary-young';
          IL_ENGINE.render(document.querySelector('#stage'),e,{stage:band,experience:{touchSize:band==='p12'?56:band==='p34'?52:band==='p56'?48:44}});return true;
        },{band,mechanic});
        if(rendered){assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)),`${width} ${band} ${mechanic} overflow`);}
      }
    }
    assert.deepEqual(errors,[]);console.log('PASS responsive: seven viewports × four bands; no page errors');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
