/* Catálogo compartido: interacción, carga cognitiva y tiempo editorial (segundos). */
(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ILMechanics = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  const rows = [
    ['listen_image','elegir_imagen','recognition',35,['p12','p34','p56','eso']],
    ['listen_text','elegir_texto','recognition',40,['p34','p56','eso']],
    ['image_word','imagen_palabra','retrieval',40,['p12','p34','p56','eso']],
    ['word_image','palabra_imagen','recognition',35,['p12','p34','p56','eso']],
    ['matching','emparejar','retrieval',65,['p12','p34','p56','eso']],
    ['sentence_order','ordenar','production',60,['p12','p34','p56','eso']],
    ['word_order','ordenar_palabra','retrieval',50,['p34','p56','eso']],
    ['gap_fill','completar','retrieval',55,['p34','p56','eso']],
    ['spelling','deletrear','production',55,['p34','p56','eso']],
    ['recall','recordar','retrieval',50,['p34','p56','eso']],
    ['classification','clasificar','retrieval',75,['p12','p34','p56','eso']],
    ['reading','comprension','retrieval',100,['p34','p56','eso']],
    ['dialogue','dialogo','production',80,['p34','p56','eso']],
    ['speaking','hablar','production',60,['p12','p34','p56','eso']],
    ['dictation','dictado','production',70,['p56','eso']],
    ['guided_writing','escritura_guiada','production',140,['p56','eso']]
  ];
  const CATALOG = Object.freeze(Object.fromEntries(rows.map(([id,type,mode,seconds,bands]) => [id,Object.freeze({id,type,mode,seconds,bands:Object.freeze(bands)})])));
  const TARGETS = Object.freeze({p12:[360,480],p34:[480,600],p56:[600,720],eso:[600,900],neutral:[360,480]});
  function identify(e) {
    if (e.mechanic) return e.mechanic;
    if (e.tipo === 'elegir_imagen') return e.audio || e.instruction_audio ? 'listen_image' : 'word_image';
    if (e.tipo === 'elegir_texto') return e.habilidad === 'listening' || e.skill === 'listening' ? 'listen_text' : 'gap_fill';
    return rows.find(row => row[1] === e.tipo)?.[0] || '';
  }
  function get(e) { return CATALOG[typeof e === 'string' ? e : identify(e)]; }
  function mode(e) { return (e.opciones||e.options||[]).length ? 'recognition' : get(e)?.mode || 'retrieval'; }
  function estimate(e,band) {
    const seconds = Number(e.estimated_seconds) || get(e)?.seconds || 60;
    return Math.round(seconds * (band === 'p12' ? 1.25 : band === 'p34' ? 1.1 : 1));
  }
  function compatible(e,band) {
    const m=get(e); if (!m) return false;
    if (Array.isArray(e.stage) && band !== 'neutral' && !e.stage.includes(band)) return false;
    const max=band==='p12'?3:band==='eso'?5:4;
    if ((e.opciones||e.options||[]).length>max || (e.preguntas||[]).some(q=>(q.opciones||[]).length>max)) return false;
    if (band === 'neutral') return ['word_image','image_word','matching','sentence_order'].includes(m.id);
    if (!m.bands.includes(band)) return false;
    if (band === 'p12') {
      if (m.id === 'sentence_order' && ((e.palabras||[]).length > 3 || !e.audio)) return false;
      if (m.id === 'classification' && (!e.items?.every(i=>i.visual) || (e.categories||[]).length>2)) return false;
    }
    if (band === 'p34' && m.id === 'reading' && String(e.estimulo?.texto||'').split(/\s+/).length>60) return false;
    return true;
  }
  return Object.freeze({CATALOG,TARGETS,identify,get,mode,estimate,compatible});
});
