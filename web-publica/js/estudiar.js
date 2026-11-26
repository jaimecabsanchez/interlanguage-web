/* Páginas «Estudiar en el extranjero» (propuesta v2, 26-11-2026). Se carga después de main.js y extranjero.js.
   En la página de un país (<body data-destino="uk|ie|ca|us">), ese destino queda preseleccionado en el cuestionario,
   solo si la familia aún no ha contestado la pregunta de destinos (window.ilExtQuiz.preset no pisa respuestas). */
(function(){
  'use strict';
  var k = document.body.getAttribute('data-destino');
  if (k && window.ilExtQuiz && window.ilExtQuiz.preset) window.ilExtQuiz.preset([k]);
})();
