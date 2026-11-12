/* Guía de destinos: HTML completo como base; pestañas accesibles como mejora progresiva. */
(function(){
  'use strict';
  const guide = document.querySelector('.country-guide');
  if (!guide) return;
  const list = guide.querySelector('[data-country-tabs]');
  const tabs = Array.from(list.querySelectorAll('[data-country]'));
  const panels = Array.from(guide.querySelectorAll('.country-panel'));
  if (!tabs.length || tabs.length !== panels.length) return;

  function select(slug, options){
    const target = tabs.find(function(tab){ return tab.dataset.country === slug; });
    if (!target) return false;
    const focusWasInside = panels.some(function(panel){ return panel.contains(document.activeElement); });
    tabs.forEach(function(tab){
      const chosen = tab === target;
      tab.setAttribute('aria-selected', chosen ? 'true' : 'false');
      tab.tabIndex = chosen ? 0 : -1;
    });
    panels.forEach(function(panel){ panel.hidden = panel.dataset.destino !== slug; });
    if ((options && options.focus) || focusWasInside) target.focus({ preventScroll: true });
    return true;
  }

  panels.forEach(function(panel){
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', 'country-tab-' + panel.dataset.destino);
    panel.tabIndex = 0;
  });
  tabs.forEach(function(tab, index){
    tab.addEventListener('click', function(){ select(tab.dataset.country); });
    tab.addEventListener('keydown', function(event){
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(tabs[next].dataset.country, { focus: true });
    });
  });
  list.hidden = false;
  guide.classList.add('is-ready');
  const match = /^#servicio-extranjero-(.+)$/.exec(location.hash);
  if (!match || !select(match[1])) select(tabs[0].dataset.country);
  window.ilDestinations = { select: select };
  window.addEventListener('hashchange', function(){
    const route = /^#servicio-extranjero-(.+)$/.exec(location.hash);
    if (route) select(route[1]);
  });

  // La tabla queda a un toque en móvil. No se vuelve a plegar cuando la familia la abre.
  const comparison = document.querySelector('.country-compare-details');
  if (comparison && window.matchMedia('(max-width: 760px)').matches) comparison.open = false;
})();
