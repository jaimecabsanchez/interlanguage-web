const assert=require('node:assert/strict'),{chromium}=require('playwright');
const base=process.env.IL_QA_URL||'http://localhost:8764';
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  try{
    const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/plataforma/index.html?demo=1');await page.evaluate(()=>{ILAuth.signIn=async()=>{throw Error('simulated_network_failure');};});
    await page.locator('#username').fill('qa');await page.locator('#password').fill('not-a-real-password');await page.locator('#submitBtn').click();
    await page.waitForFunction(()=>!document.getElementById('submitBtn').disabled);assert.match(await page.locator('#msg').textContent(),/conexión/);assert.deepEqual(errors,[]);
    await page.route('**/npm/@supabase/**',r=>r.abort());await page.goto(base+'/plataforma/index.html?demo=0');await page.waitForFunction(()=>document.getElementById('msg').classList.contains('show'));
    assert.deepEqual(errors,[],'missing authentication SDK has a usable error state');await context.close();
    for(const band of ['p12','p34','p56','eso']){
      const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});await c.addInitScript(band=>{localStorage.setItem('il_demo_session_v2','lucia');sessionStorage.setItem('il_demo_age_mode_v1',band);},band);
      const p=await c.newPage(),issues=[];p.on('pageerror',e=>issues.push(e.message));
      await p.goto(base+'/plataforma/onboarding.html?onboardingDemo=1');await p.waitForSelector('.welcome-title');const title=await p.locator('.welcome-title').textContent();await p.locator('#next').click();await p.locator('#back').click();assert.equal(await p.locator('.welcome-title').textContent(),title);
      await p.goto(base+'/plataforma/ajustes.html');await p.waitForSelector('#app:not(.hidden)');await p.locator('label').filter({has:p.locator('#settingSound')}).click();const sound=await p.locator('#settingSound').isChecked();await p.reload();await p.waitForSelector('#app:not(.hidden)');assert.equal(await p.locator('#settingSound').isChecked(),sound);assert.equal(await p.locator('#settingAutoplay').isDisabled(),!sound);
      await p.goto(base+'/plataforma/familias.html?familyState=new');await p.waitForSelector('#dashboard:not([hidden])');assert(await p.locator('#lowData').isVisible());
      await p.route('**/content/shared/*.js',r=>r.abort());await p.route('**/content/p12/*.js',r=>r.abort());await p.route('**/content/eso/*.js',r=>r.abort());
      await p.goto(base+'/plataforma/practicar.html');await p.waitForTimeout(700);assert(!(await p.locator('#loading:visible').count()),'failed content must not leave endless loading');
      assert.deepEqual(issues,[],band+' failures do not cause uncaught exceptions');await c.close();console.log('PASS',band,'onboarding back, audio settings persistence, sparse family and unavailable content');
    }
    console.log('PASS login network/SDK recovery and four age failure journeys');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
