/* Motor común de las propuestas de formulario (maqueta: no se envía nada).
   Tres contextos: «general» (portada), «estudiar» (Estudiar en el extranjero) y «campamento» (Campamentos de verano en el extranjero).
   Solo se piden datos útiles para asesorar; lo de Madrid y extraescolares va directo a su inscripción. Todos los datos de programas son los publicados en la web. */
window.FM = (function(){
  'use strict';
  var IC = {
    globe:'<circle cx="12" cy="12" r="8.8"/><path d="M3.4 12h17.2"/><path d="M12 3.2c2.5 2.4 3.7 5.4 3.7 8.8s-1.2 6.4-3.7 8.8c-2.5-2.4-3.7-5.4-3.7-8.8S9.5 5.6 12 3.2z"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>',
    tent:'<path d="M3 20h18L12 4z"/><path d="M12 20v-6l-3 6M12 14l3 6"/>',
    book:'<path d="M12 6.6C10.4 5.1 8 4.6 4.4 4.6v13c3.6 0 6 .5 7.6 2 1.6-1.5 4-2 7.6-2v-13c-3.6 0-6 .5-7.6 2z"/><path d="M12 6.6v13"/>',
    arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>', back:'<path d="M19 12H5M11 6l-6 6 6 6"/>', check:'<path d="M5 12.5l4.2 4.2L19 7"/>',
    phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    mail:'<rect x="3.4" y="5.6" width="17.2" height="12.8" rx="2"/><path d="M4 7l8 6 8-6"/>', edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>', lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
    clock:'<circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3.2 2"/>'
  };
  function ic(n,cls){ return '<svg class="fm-ic '+(cls||'')+'" viewBox="0 0 24 24" aria-hidden="true">'+IC[n]+'</svg>'; }

  var CAMPS = {
    dollar:{t:'Dollar Academy',d:'Escocia · 27 jun.–25 jul. 2027 · 10–17 años',min:10},
    strathallan:{t:'Strathallan School',d:'Escocia · 4 jul.–1 ago. 2027 · 8–17 años',min:8},
    loretto:{t:'Loretto School',d:'Escocia · 4 jul.–15 ago. 2027 · 10–17 años',min:10},
    priors:{t:'Prior’s Field',d:'Inglaterra · 7 jul.–4 ago. 2027 · 10–17 años',min:10},
    ayuda:{t:'Os ayudamos a elegir',d:'Según su edad y lo que le gusta',min:8}
  };
  var F = {
    programa:{type:'choice', q:'¿Qué os interesa?', h:'Elegid una opción para empezar.', req:true, opts:[
      ['estudiar','Estudiar en el extranjero','Año o trimestre escolar · 9 a 18 años','globe'],
      ['campamento','Campamento de verano en el extranjero','Escocia e Inglaterra · 1 a 4 semanas · 8 a 17 años','sun'],
      ['madrid','Campamento de verano en Madrid','Inscripción directa, sin asesoramiento','tent'],
      ['extra','Inglés extraescolar en el colegio','Inscripción directa, sin asesoramiento','book']]},
    destino:{type:'choice', q:'¿Qué destino os interesa?', h:'Si no lo tenéis claro, os ayudamos a decidir.', opts:[['uk','Reino Unido','Inglaterra y Escocia'],['ie','Irlanda','Dublín y varios condados'],['us','Estados Unidos','Bajo consulta'],['ca','Canadá','Bajo consulta'],['no','Aún no lo sabemos','Os orientamos']]},
    duracion:{type:'choice', q:'¿Cuánto tiempo?', opts:[['full','Curso completo'],['term','Uno o dos trimestres'],['no','Aún no lo sabemos']]},
    inicio:{type:'choice', q:'¿Cuándo os gustaría empezar?', opts:[['2627','Durante el curso 2026–2027'],['2728','Curso 2027–2028'],['2829','Curso 2028–2029 o más adelante'],['no','Aún no lo sabemos']]},
    colegio:{type:'choice', q:'¿Qué campamento os interesa?', h:'Fechas de 2027. Podéis cambiarlo después.', opts:Object.keys(CAMPS).map(function(k){return [k,CAMPS[k].t,CAMPS[k].d];})},
    semanas:{type:'choice', q:'¿Cuántas semanas?', opts:[['1','1 semana'],['2','2 semanas'],['3','3 semanas'],['4','4 semanas'],['no','Aún no lo sabemos']]},
    ingles:{type:'choice', q:'¿Qué programa de inglés?', h:'Todos tienen 15 horas de inglés a la semana.', opts:[['general','Inglés general','Para todos los alumnos'],['lider','Inglés y liderazgo','14 a 17 años · nivel B1 o superior'],['no','No lo sabemos','Os lo explicamos']]},
    edad:{type:'select', q:'Edad del alumno/a', req:true},
    curso:{type:'select', q:'Curso actual', opt:true, opts:['4.º de Primaria','5.º de Primaria','6.º de Primaria','1.º de ESO','2.º de ESO','3.º de ESO','4.º de ESO','1.º de Bachillerato','2.º de Bachillerato']},
    nivel:{type:'choice', q:'Nivel de inglés', opt:true, opts:[['basico','Básico'],['inter','Intermedio'],['avanz','Avanzado'],['no','No lo sabemos']]},
    intereses:{type:'multi', q:'¿Qué le gusta?', opt:true, h:'Nos ayuda a proponer el colegio adecuado.', opts:[['deporte','Deporte'],['musica','Música'],['arte','Arte'],['teatro','Teatro'],['ciencias','Ciencias'],['aventura','Aventura al aire libre']]},
    nombre:{type:'text', q:'Nombre del padre, madre o tutor', req:true, ac:'name'},
    email:{type:'email', q:'Correo electrónico', req:true, ac:'email', ph:'nombre@correo.com'},
    tel:{type:'tel', q:'Teléfono', opt:true, ac:'tel', ph:'600 000 000'},
    pref:{type:'choice', q:'¿Cómo preferís que os contactemos?', opts:[['tel','Por teléfono'],['mail','Por correo']]},
    franja:{type:'choice', q:'¿Cuándo os viene mejor?', opt:true, opts:[['man','Mañanas'],['tar','Tardes'],['igual','Me da igual']]},
    mensaje:{type:'area', q:'¿Algo que debamos saber?', opt:true, ph:'Lo que más os importa, dudas, fechas…'},
    rgpd:{type:'check', q:'He leído la <a href="#">política de privacidad</a> y acepto que uséis mis datos para responder a esta consulta.', req:true},
    news:{type:'check', q:'Quiero recibir información sobre programas y novedades de Interlanguage (opcional).'}
  };
  var CTX = {
    general:{eyebrow:'Orientación', h:'¿Hablamos? <em>Cuéntanos qué buscas</em>', lead:'Para estudiar o pasar un verano en el extranjero, os asesoramos sin compromiso.'},
    estudiar:{eyebrow:'Estudiar en el extranjero', h:'¿Hablamos de <em>vuestro caso?</em>', lead:'Contadnos un poco y os orientamos sobre destino, colegio y duración.'},
    campamento:{eyebrow:'Campamentos de verano en el extranjero', h:'Os ayudamos a <em>elegir campamento</em>', lead:'Edad, fechas y lo que le gusta: con eso os orientamos sobre el colegio que mejor encaja.'}
  };
  var NEXT = [['Estudiamos vuestro caso','Una persona del equipo, en Madrid, analiza lo que nos contáis.'],['Os contactamos como prefiráis','Por teléfono o por correo, para resolver vuestras dudas.'],['Os orientamos, sin compromiso','Os explicamos qué opciones encajan y por qué. La decisión es vuestra.']];

  /* ── estado, borrador guardado en este navegador y lectura de la URL ── */
  function create(version){
    var qs=new URLSearchParams(location.search), ctx=qs.get('ctx')||'general'; if(!CTX[ctx]) ctx='general';
    var key='fm-borrador-'+version+'-'+ctx, S={ctx:ctx, v:{pref:'tel'}, restored:false, key:key};
    if(ctx!=='general') S.v.programa=ctx;
    try{ var d=JSON.parse(localStorage.getItem(key)||'null'); if(d&&d.v&&Object.keys(d.v).length>2){ S.v=Object.assign(S.v,d.v); S.restored=true; } }catch(e){}
    ['destino','colegio','duracion','semanas'].forEach(function(k){ if(qs.get(k)) S.v[k]=qs.get(k); });
    return S;
  }
  function save(S){ try{ localStorage.setItem(S.key, JSON.stringify({v:S.v})); }catch(e){} }
  function clear(S){ try{ localStorage.removeItem(S.key); }catch(e){} }
  function prog(S){ return S.ctx==='general' ? S.v.programa : S.ctx; }

  /* qué se pregunta según el programa (Madrid y extraescolares: inscripción directa) */
  function groups(S){
    var p=prog(S), g=[];
    if(S.ctx==='general') g.push({id:'que',t:'Qué buscáis',f:['programa']});
    if(p==='madrid'||p==='extra'){ g.push({id:'direct',t:'Inscripción',f:[]}); return g; }
    var pf = p==='campamento'?['colegio','semanas','ingles']:['destino','duracion','inicio'];
    if(S.ctx==='general'&&g[0]) g[0].f=g[0].f.concat(p?pf:[]); else g.push({id:'que',t:p==='campamento'?'El campamento':'El programa',f:pf});
    g.push({id:'alumno',t:'El alumno',f:['edad','curso','nivel','intereses']});
    g.push({id:'contacto',t:'Contacto',f:['nombre','email','tel','pref','franja','mensaje','rgpd','news']});
    return g;
  }
  function ages(S){ var p=prog(S), a=[]; for(var i=(p==='campamento'?8:9); i<=(p==='campamento'?17:18); i++) a.push(String(i)); return a; }

  /* avisos con datos reales de los programas */
  function hints(S){
    var v=S.v, out={}, age=+v.edad||0;
    if(prog(S)==='campamento'){
      if(age&&age<10&&v.colegio&&v.colegio!=='strathallan'&&v.colegio!=='ayuda') out.colegio='Con '+age+' años, el único que admite es Strathallan School (desde los 8).';
      if(v.ingles==='lider'){ if(age&&age<14) out.ingles='El programa de liderazgo es de 14 a 17 años. Con '+age+' años le corresponde Inglés general.';
        else if(v.colegio&&v.colegio!=='dollar'&&v.colegio!=='ayuda') out.ingles='El programa de liderazgo se imparte en Dollar Academy; en otros colegios, consultadlo.';
        else out.ingles='Se imparte en Dollar Academy y pide nivel B1 o superior.'; }
    } else if(prog(S)==='estudiar'){
      if(v.destino==='uk'&&v.duracion==='term') out.duracion='En el Reino Unido, uno o dos trimestres solo en algunos colegios, con plazas limitadas.';
      if(v.destino==='us'||v.destino==='ca') out.destino='Opciones bajo consulta: estudiamos cada caso según la edad, el curso y las fechas.';
      if(v.inicio==='2627') out.inicio='Recomendamos un curso de antelación: revisaremos las plazas que quedan.';
    }
    return out;
  }

  /* validación */
  var DOM=['gmail.com','hotmail.com','hotmail.es','outlook.com','outlook.es','yahoo.es','yahoo.com','icloud.com','live.com','telefonica.net'];
  function lev(a,b){ var m=[],i,j; for(i=0;i<=b.length;i++) m[i]=[i]; for(j=0;j<=a.length;j++) m[0][j]=j; for(i=1;i<=b.length;i++) for(j=1;j<=a.length;j++) m[i][j]=Math.min(m[i-1][j-1]+(b[i-1]===a[j-1]?0:1),m[i][j-1]+1,m[i-1][j]+1); return m[b.length][a.length]; }
  function emailTip(e){ var p=(e||'').trim().toLowerCase().split('@'); if(p.length!==2||!p[1]) return null; if(DOM.indexOf(p[1])>=0) return null; var best=null,bd=3; DOM.forEach(function(d){ var x=lev(p[1],d); if(x<bd){bd=x;best=d;} }); return best&&bd<=2? p[0]+'@'+best : null; }
  function errorOf(S,id){
    var f=F[id], v=S.v[id];
    if(id==='programa'&&S.ctx!=='general') return null;
    if(id==='email'){ if(!v) return 'Necesitamos un correo para responderos.'; if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Revisad el correo: por ejemplo, nombre@correo.com.'; return null; }
    if(id==='tel'&&v){ var d=v.replace(/\D/g,''); if(d.length<9) return 'Revisad el teléfono: necesitamos al menos 9 cifras.'; return null; }
    if(f.req&&(!v||v===false)) return id==='rgpd'?'Marcad esta casilla para que podamos responder.':id==='edad'?'Indicad la edad para orientaros.':id==='nombre'?'Indicad vuestro nombre.':'Elegid una opción para continuar.';
    return null;
  }
  function groupErrors(S,g){ var e={}; g.f.forEach(function(id){ var x=errorOf(S,id); if(x) e[id]=x; }); return e; }

  /* resumen legible */
  function label(id,val){ var f=F[id]; if(!f||val==null||val==='') return ''; if(f.type==='multi') return (val||[]).map(function(x){return (f.opts.filter(function(o){return o[0]===x;})[0]||[,x])[1];}).join(', '); if(f.type==='choice'){ var o=f.opts.filter(function(o){return o[0]===val;})[0]; return o?o[1]:val; } if(id==='edad') return val+' años'; if(f.type==='check') return val?'Sí':''; return val; }
  function summary(S){ var r=[], v=S.v;
    var p=prog(S); if(p) r.push(['Programa',label('programa',p)]);
    ['destino','duracion','inicio','colegio','semanas','ingles','edad','curso','nivel','intereses'].forEach(function(k){ var l=label(k,v[k]); if(l&&!(k==='programa')) r.push([({destino:'Destino',duracion:'Duración',inicio:'Inicio',colegio:'Campamento',semanas:'Semanas',ingles:'Programa de inglés',edad:'Edad',curso:'Curso',nivel:'Inglés',intereses:'Le gusta'})[k],l]); });
    return r; }

  /* ── HTML de cada campo (cada versión decide cómo colocarlos) ── */
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function field(S,id,opts){
    opts=opts||{}; var f=F[id], v=S.v[id], tag=f.opt?' <i class="fm-optional">opcional</i>':'', big=opts.big, h='';
    var head=opts.noq?'':'<p class="fm-q">'+f.q+tag+'</p>'+(f.h&&!opts.noh?'<p class="fm-h">'+f.h+'</p>':'');
    if(f.type==='choice'||f.type==='multi'){
      var multi=f.type==='multi', o=f.opts;
      h='<div class="fm-field" data-f="'+id+'">'+head+'<div class="fm-opts'+(big?' fm-opts--big':'')+(o.length>3&&!big?' fm-opts--wrap':'')+'" role="'+(multi?'group':'radiogroup')+'">'+
        o.map(function(x){ var on=multi?(v||[]).indexOf(x[0])>=0:v===x[0];
          return '<label class="fm-opt'+(x[2]?' fm-opt--d':'')+'"><input type="'+(multi?'checkbox':'radio')+'" name="'+id+'" value="'+x[0]+'"'+(on?' checked':'')+'><span class="fm-opt-b">'+(x[3]&&big?ic(x[3],'fm-opt-ic'):'')+'<span><b>'+x[1]+'</b>'+(x[2]?'<small>'+x[2]+'</small>':'')+'</span>'+(multi?'<i class="fm-tick">'+ic('check')+'</i>':'<i class="fm-dot"></i>')+'</span></label>'; }).join('')+'</div>';
    } else if(f.type==='select'){
      var list=id==='edad'?ages(S).map(function(a){return [a,a+' años'];}):f.opts.map(function(a){return [a,a];});
      h='<div class="fm-field" data-f="'+id+'"><label class="fm-lab"><span class="fm-q">'+f.q+tag+'</span><select name="'+id+'"><option value="">'+(id==='edad'?'Elegid la edad':'Elegid el curso')+'</option>'+list.map(function(a){return '<option value="'+a[0]+'"'+(v===a[0]?' selected':'')+'>'+a[1]+'</option>';}).join('')+'</select></label>';
    } else if(f.type==='check'){
      h='<div class="fm-field" data-f="'+id+'"><label class="fm-check"><input type="checkbox" name="'+id+'"'+(v?' checked':'')+'><i class="fm-box">'+ic('check')+'</i><span>'+f.q+'</span></label>';
    } else if(f.type==='area'){
      h='<div class="fm-field" data-f="'+id+'"><label class="fm-lab"><span class="fm-q">'+f.q+tag+'</span><textarea name="'+id+'" rows="3" placeholder="'+(f.ph||'')+'">'+esc(v||'')+'</textarea></label>';
    } else {
      var pre=id==='tel'?'<span class="fm-pre">+34</span>':'';
      h='<div class="fm-field" data-f="'+id+'"><label class="fm-lab"><span class="fm-q">'+f.q+tag+'</span><span class="fm-inp'+(pre?' fm-inp--pre':'')+'">'+pre+'<input name="'+id+'" type="'+(f.type==='text'?'text':f.type)+'" autocomplete="'+(f.ac||'off')+'"'+(f.type==='tel'?' inputmode="tel"':'')+(f.type==='email'?' inputmode="email" spellcheck="false"':'')+' placeholder="'+(f.ph||'')+'" value="'+esc(v||'')+'"></span></label>';
    }
    if(f.type!=='choice'&&f.type!=='multi'){} else {}
    h+='<p class="fm-tip" data-tip="'+id+'" hidden></p><p class="fm-err" data-err="'+id+'" role="alert" hidden></p></div>';
    return h;
  }
  function direct(S){
    var p=prog(S), m=p==='madrid';
    return '<div class="fm-direct"><span class="fm-direct-ic">'+ic(m?'tent':'book')+'</span><div><p class="fm-q">'+(m?'Campamento de verano en Madrid':'Inglés extraescolar en el colegio')+'</p><p>No hace falta asesoramiento: la inscripción es directa y rápida, desde la página del programa.</p>'+
      '<div class="fm-row-act"><a class="fm-btn fm-btn--p" href="#">Ir a la inscripción '+ic('arrow')+'</a><a class="fm-link" href="#">¿Una duda rápida? Escribidnos</a></div></div></div>';
  }

  /* ── conexión de eventos: actualiza el estado, guarda, muestra avisos y errores ── */
  function bind(S, root, onChange){
    function read(t){ var n=t.name; if(!n||!F[n]) return;
      var f=F[n]; if(f.type==='multi') S.v[n]=[].map.call(root.querySelectorAll('input[name="'+n+'"]:checked'),function(i){return i.value;});
      else if(f.type==='check') S.v[n]=t.checked; else S.v[n]=t.value;
      save(S); return n; }
    root.addEventListener('input',function(e){ if(e.target.type==='radio'||e.target.type==='checkbox') return;   /* las opciones se tratan solo en «change» (si no, la pantalla se redibuja antes de tiempo) */
      var n=read(e.target); if(n) { live(n); onChange&&onChange(n,'input'); } });
    root.addEventListener('change',function(e){ var n=read(e.target); if(n){ live(n); onChange&&onChange(n,'change',e.target); } });
    root.addEventListener('focusout',function(e){ var n=e.target.name; if(n&&(n==='email'||n==='tel')&&S.v[n]) show(root,n,errorOf(S,n)); });
    root.addEventListener('mousedown',function(e){ if(e.target.closest('[data-fix]')) e.preventDefault(); });   /* pulsar la sugerencia no quita el foco del campo */
    root.addEventListener('click',function(e){ var a=e.target.closest('[data-fix]'); if(a){ e.preventDefault(); S.v.email=a.dataset.fix; var i=root.querySelector('input[name=email]'); if(i) i.value=a.dataset.fix; save(S); live('email'); } });
    function live(n){
      var hs=hints(S); [].forEach.call(root.querySelectorAll('[data-tip]'),function(p){ var k=p.dataset.tip, t=hs[k]; if(k==='email'){ var s=emailTip(S.v.email); t=s?'¿Quizá <a href="#" data-fix="'+s+'">'+s+'</a>?':''; } t=t||''; if(p.dataset.last!==t){ p.dataset.last=t; p.innerHTML=t; } p.hidden=!t; });   /* solo se redibuja si cambia: si no, un clic en el aviso se pierde */
      var err=root.querySelector('[data-err="'+n+'"]'); if(err&&!err.hidden){ show(root,n,errorOf(S,n)); }
    }
    live('init');
    return live;
  }
  function show(root,id,msg){ var p=root.querySelector('[data-err="'+id+'"]'), w=root.querySelector('[data-f="'+id+'"]'); if(!p) return; p.textContent=msg||''; p.hidden=!msg; if(w) w.classList.toggle('is-bad',!!msg); }
  function showAll(root,errs,ids){ var first=null; ids.forEach(function(id){ show(root,id,errs[id]); if(errs[id]&&!first) first=id; }); if(first){ var el=root.querySelector('[data-f="'+first+'"] input, [data-f="'+first+'"] select, [data-f="'+first+'"] textarea'); if(el) el.focus({preventScroll:false}); } return !first; }
  function thanks(S){
    var v=S.v, by=v.pref==='mail'?'por correo':'por teléfono';
    return '<div class="fm-done" tabindex="-1"><span class="fm-done-ic">'+ic('check')+'</span><p class="fm-q">Gracias'+(v.nombre?', '+esc(v.nombre.split(' ')[0]):'')+'. Hemos recibido vuestra consulta.</p>'+
      '<p>Una persona del equipo, en Madrid, estudiará vuestro caso y os contactará '+by+'.</p><ul class="fm-recap">'+summary(S).map(function(r){return '<li><span>'+r[0]+'</span><b>'+esc(r[1])+'</b></li>';}).join('')+'</ul><p class="fm-note">Maqueta: no se ha enviado nada.</p></div>';
  }
  return {F:F,CTX:CTX,CAMPS:CAMPS,NEXT:NEXT,ic:ic,create:create,save:save,clear:clear,prog:prog,groups:groups,field:field,direct:direct,bind:bind,errorOf:errorOf,groupErrors:groupErrors,show:show,showAll:showAll,summary:summary,label:label,thanks:thanks,hints:hints};
})();
