(function(root){
  'use strict';
  function mount(host,options){
    const {username,band}=options,sec=band==='eso',t=(es,en)=>sec?en:es;
    const el=(tag,cls,copy)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(copy!=null)n.textContent=copy;return n;};
    const name=item=>ILWorldData.displayName(item,band);
    const date=()=>root.ILMission.today();
    function draw(){
      host.replaceChildren();host.className='reward-collection';
      let p;try{p=ILRewardStore.get(username);}catch(e){host.textContent=t('No podemos leer tu colección. Tus datos no se han sustituido.','We cannot read your collection. Your data has not been overwritten.');return;}
      const heading=el('header','collection-header');heading.append(el('h2','',p.balance+' Alas'),el('p','',t('Tu esfuerzo, a tu estilo. Solo cosméticos.','Your effort, your style. Cosmetics only.')));host.append(heading);
      const detail=el('details');detail.open=options.open===true;const summary=el('summary','',t('Mi colección y recompensas','My collection and rewards'));detail.append(summary);
      const next=ILRewardStore.next(username,band,date());
      if(next){const item=ILWorldData.CATALOG.find(i=>i.id===next.item);detail.append(el('p','collection-next',t('Próximo cofre: ','Next collection box: ')+name(item)+' · '+next.current+'/'+next.target+' '+t('misiones','missions')));}
      const earned=el('div','collection-earned');
      const owned=p.owned.map(id=>ILWorldData.catalogFor(band).find(i=>i.id===id)).filter(Boolean);
      if(owned.length){earned.append(el('h3','',t('Ya son tuyos','Yours to use')));owned.forEach(item=>{
        const b=el('button','btn btn-ghost',name(item)+' · '+t('Usar','Use'));b.type='button';b.onclick=()=>options.apply(item);earned.append(b);
      });}else earned.append(el('p','',t('Completa tu misión para ganar tus primeras Alas.','Complete your mission to earn your first Alas.')));
      detail.append(earned,el('h3','',t('Elige con tus Alas','Choose with your Alas')));
      const list=el('ul','collection-shop');
      ILRewards.SHOP.forEach(offer=>{
        const item=ILWorldData.catalogFor(band).find(i=>i.id===offer.id);if(!item)return;
        const status=ILWorldData.unlockStatus(item,ILWorldData.context(options.progress,options.stamps,band,p.owned));
        const li=el('li');const visual=el('span','collection-item');visual.setAttribute('aria-hidden','true');visual.innerHTML=ILWorldVisual.item(item,options.settings,options.progress);
        const words=el('span');words.append(el('b','',name(item)),el('small','',status.unlocked?t('Ya disponible','Already available'):offer.price+' Alas'));
        const b=el('button','btn btn-ghost',status.unlocked?t('Usar','Use'):t('Elegir','Choose'));b.type='button';b.disabled=!status.unlocked&&p.balance<offer.price;
        b.setAttribute('aria-label',(status.unlocked?t('Usar ','Use '):t('Conseguir ','Get '))+name(item)+(status.unlocked?'':' · '+offer.price+' Alas'));
        b.onclick=()=>status.unlocked?options.apply(item):confirmPurchase(item,offer,b);li.append(visual,words,b);list.append(li);
      });
      detail.append(list);
      const rules=el('p','collection-rules',t('Misión: 10 Alas. Práctica extra útil: 3 + 1 como máximo al día. No hay compras con dinero ni premios al azar. Los objetos conseguidos no se pierden por descansar.','Mission: 10 Alas. Useful extra practice: up to 3 + 1 per day. No real-money purchases or random prizes. Taking a break never removes earned items.'));
      detail.append(rules,el('p','collection-local',t('Esta colección se guarda en este navegador; todavía no se sincroniza entre dispositivos.','This collection is saved in this browser; cross-device sync is not yet available.')));
      host.append(detail);
      const status=el('p','collection-status');status.id='collectionStatus';status.setAttribute('role','status');host.append(status);
    }
    function confirmPurchase(item,offer,opener){
      const dialog=el('dialog','collection-dialog');const title=el('h2','',name(item));title.id='purchaseTitle';dialog.setAttribute('aria-labelledby',title.id);
      dialog.append(title,el('p','',t('Vas a usar ','You will use ')+offer.price+' Alas. '+t('Solo cambia el aspecto de tu mundo.','Only the appearance of your space changes.')));
      const yes=el('button','btn btn-primary',t('Confirmar · ','Confirm · ')+offer.price+' Alas'),no=el('button','btn btn-ghost',t('Volver','Back'));yes.type=no.type='button';
      no.onclick=()=>dialog.close();yes.onclick=()=>{
        yes.disabled=true;
        try{
          const result=ILRewardStore.purchase(username,item.id,date());
          if(!result.ok)throw new Error(result.reason);
          dialog.close();draw();options.changed();
          host.querySelector('#collectionStatus').textContent=t('Ya tienes ','You now own ')+name(item)+'.';host.querySelector('summary').focus();
        }catch(e){yes.disabled=false;const p=el('p','',t('No se ha realizado la compra. Revisa el saldo o vuelve a intentarlo.','Purchase not completed. Check your balance or try again.'));p.setAttribute('role','alert');dialog.append(p);}
      };
      dialog.append(yes,no);document.body.append(dialog);dialog.addEventListener('close',()=>{dialog.remove();if(opener.isConnected)opener.focus();},{once:true});dialog.showModal();no.focus();
    }
    draw();return {refresh:draw};
  }
  root.ILRewardCollection={mount};
})(window);
