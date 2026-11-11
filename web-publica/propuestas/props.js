/* Interacciones de la maqueta: nada se envía. Al elegir programa, el formulario cambia de camino:
   campamento de Madrid o extraescolar → reservar plaza; programa en el extranjero → orientación y llamada. */
(function(){
  document.addEventListener('click',function(e){var a=e.target.closest('a[href="#"]'); if(a) e.preventDefault(); var b=e.target.closest('button[type="button"]'); if(b) e.preventDefault();});
  var root=document.querySelector('[data-form]');
  if(root){
    var sum=document.querySelector('[data-sum="programa"]');
    root.addEventListener('change',function(e){
      var t=e.target; if(t.name!=='svc') return;
      root.dataset.path=t.dataset.path;
      if(sum){ sum.textContent=t.dataset.name; sum.classList.remove('empty'); }
      var kind=document.querySelector('[data-sum="camino"]'); if(kind){ kind.textContent=t.dataset.path==='reserve'?'Reserva de plaza':'Orientación y llamada'; kind.classList.remove('empty'); }
    });
    [].forEach.call(root.querySelectorAll('.chips'),function(g){ g.addEventListener('click',function(e){ var c=e.target.closest('.chip'); if(!c) return; [].forEach.call(g.children,function(x){x.classList.remove('on');}); c.classList.add('on'); }); });
  }
})();
