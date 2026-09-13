/* Local isolated demo: educational callbacks, actual ending/collection controls.
   Mechanic interaction itself is covered by qa-mechanics.cjs. */
const assert=require('node:assert/strict'),{chromium}=require('playwright');
const base=process.env.IL_QA_URL||'http://localhost:8764';
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.IL_CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  try{
    for(const band of ['p12','p34','p56','eso']){
      const context=await browser.newContext({viewport:{width:1280,height:800},reducedMotion:'reduce'});
      await context.addInitScript(band=>{
        localStorage.setItem('il_demo_session_v2','lucia');sessionStorage.setItem('il_demo_age_mode_v1',band);
        Object.defineProperty(window,'IL_ENGINE',{configurable:true,set(engine){const render=engine.render;engine.render=function(host,ex,opts){window.qaExercise=ex;window.qaOptions=opts;return render(host,ex,opts);};Object.defineProperty(window,'IL_ENGINE',{value:engine,configurable:true});}});
      },band);
      const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto(base+'/plataforma/leccion.html?demo=1');await page.waitForFunction(()=>window.qaOptions);
      let count=0;
      while(await page.locator('#missionSummary.hidden').count()){
        assert(count++<40,'session must terminate');
        await page.evaluate(()=>{
          const ex=qaExercise,opts=qaOptions;
          opts.onAttempt({correct:true,assessment:'objective',attempt_number:1,response_time_ms:35000,answer:'QA response'});
          const result={correct:true,first_try_correct:true,eventual_success:true,assessment:'objective',learnedExpressions:[ex.respuesta&&typeof ex.respuesta==='string'?ex.respuesta:'English practice']};
          opts.onResult(result);opts.onNext(result);
        });
        await page.waitForTimeout(80);
      }
      await page.waitForSelector('.ending-panel');
      const earned=await page.evaluate(()=>ILRewardStore.get('lucia').balance);assert.equal(earned,10,band+' daily reward');
      assert.equal(await page.locator('.ending-panel h1').textContent(),band==='eso'?'Session complete':'¡Misión completada!');
      if(band==='p12'){
        await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Ver lo que he practicado');await page.keyboard.press('Enter');
        assert.equal(await page.locator('.ending-panel h1').textContent(),'Mira lo que has practicado');
        await page.getByRole('button',{name:'Ver mi recompensa',exact:true}).click();
      }else if(band==='p34')await page.getByRole('button',{name:'Ver mi recompensa',exact:true}).click();
      assert(await page.getByRole('heading',{name:'+10 Alas'}).count());
      for(const [width,height] of [[1440,900],[1280,800],[1024,768],[820,1180],[768,1024],[390,844],[320,740]]){
        await page.setViewportSize({width,height});assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)),band+' ending overflow '+width);
        const boxes=await page.locator('.ending-actions .btn').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().height));
        assert(boxes.every(h=>h>=(band==='p12'?56:band==='p34'?52:band==='p56'?48:44)),'age touch sizes');
      }
      if(band==='p12'||band==='eso')await page.screenshot({path:'/tmp/il-ending-'+band+'.png',fullPage:true});
      await page.reload();await page.waitForSelector('.ending-panel');assert.equal(await page.evaluate(()=>ILRewardStore.get('lucia').balance),10,'reload no duplicate');
      const dailyBefore=await page.evaluate(()=>JSON.stringify(ILMission.get('lucia',ILMission.today())));
      await page.goto(base+'/plataforma/leccion.html?mode=skill&skill=vocabulary&demo=1');await page.waitForFunction(()=>window.qaOptions);
      count=0;
      while(await page.locator('#missionSummary.hidden').count()){
        assert(count++<40);
        await page.evaluate(()=>{const opts=qaOptions;opts.onAttempt({correct:true,assessment:'objective',attempt_number:1,response_time_ms:30000});const r={correct:true,first_try_correct:true,eventual_success:true};opts.onResult(r);opts.onNext(r);});await page.waitForTimeout(80);
      }
      await page.waitForSelector('.ending-panel');
      assert.equal(await page.evaluate(()=>JSON.stringify(ILMission.get('lucia',ILMission.today()))),dailyBefore,'skill does not alter daily mission');
      await page.goto(base+'/plataforma/tienda.html?tab=world&demo=1');await page.waitForSelector('#app:not(.hidden)');
      assert(await page.locator('.collection-header h2').textContent());
      for(const [width,height] of [[1440,900],[1024,768],[768,1024],[390,844],[320,740]]){
        await page.setViewportSize({width,height});
        await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
        const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
        if(overflow){console.log(await page.evaluate(()=>Array.from(document.querySelectorAll('body *')).filter(e=>e.getBoundingClientRect().right>innerWidth+1).slice(0,15).map(e=>({tag:e.tagName,cls:String(e.className),id:e.id,width:e.getBoundingClientRect().width}))));await page.screenshot({path:'/tmp/il-collection-overflow.png',fullPage:true});}
        assert(!overflow,band+' collection overflow '+width);
      }
      assert.deepEqual(errors,[],band+' browser errors');console.log('PASS',band,'daily, reload, extra isolation, keyboard, responsive, collection');
      await context.close();
    }
    const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
    await context.addInitScript(()=>{localStorage.setItem('il_demo_session_v2','lucia');sessionStorage.setItem('il_demo_age_mode_v1','eso');});
    const page=await context.newPage();await page.goto(base+'/plataforma/tienda.html?tab=world');await page.waitForSelector('#app:not(.hidden)');
    await page.evaluate(()=>{
      localStorage.setItem('il_progress_lucia',JSON.stringify({gems:0,streak:0,best:0,xp:0,lessons:0,last:'',owned:[]}));
      for(let i=1;i<=3;i++){
        const key='purchase-fixture-'+i,date='2026-09-0'+i;
        ILRewardStore.record('lucia',{sessionKey:key,date,completedAt:date+'T12:00:00.000Z',completed:true,mode:'daily',band:'eso',itemIds:['a','b'],events:['a','b'].map(id=>({attempt_id:key+id,client_session_key:key,exercise_id:id,correct:true}))});
      }
    });
    await page.reload();await page.waitForSelector('#app:not(.hidden)');
    const choose=page.getByRole('button',{name:'Get Sunset · 20 Alas',exact:true});await choose.click();
    await page.getByRole('button',{name:'Back',exact:true}).click();assert.equal(await page.evaluate(()=>ILRewardStore.get('lucia').balance),30,'cancel never charges');
    await choose.click();await page.getByRole('button',{name:'Confirm · 20 Alas',exact:true}).click();
    assert.equal(await page.evaluate(()=>ILRewardStore.get('lucia').balance),10);
    await page.getByRole('button',{name:'Use Sunset',exact:true}).click();
    assert.equal(await page.evaluate(()=>ILProfileSettings.getActive().worldBackground),'sunset');
    await page.reload();await page.waitForSelector('#app:not(.hidden)');assert.equal(await page.evaluate(()=>ILRewardStore.get('lucia').balance),10);
    await context.close();
    console.log('PASS four age journeys, seven ending viewports, purchase confirmation/cancel, equip and reload');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
