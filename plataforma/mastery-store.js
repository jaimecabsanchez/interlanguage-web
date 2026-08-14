/* ============================================================
   Interlanguage HOME · Almacén de DOMINIO (repaso espaciado)
   ------------------------------------------------------------
   Conecta el motor pedagógico PURO (IL_PEDAGOGIA) con datos
   REALES del alumno: guarda una ficha de dominio por ejercicio
   y calcula qué "vence" hoy (toca repasar) con el ritmo 1·3·7·16.

   - Clave de dominio = id del ejercicio (pv-1, rd-3…). Estable.
   - production = el ejercicio hace PRODUCIR (ordenar/completar/
     hablar) en vez de solo reconocer → pesa más como evidencia.
   - Persistencia local por usuario (demo y caché de cliente).
     La escritura en Supabase (tabla mastery) necesita el mapa de
     objetivos y queda fuera de este módulo.

   Navegador: window.ILMastery · Node: module.exports
   ============================================================ */
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory;
  else root.ILMastery = factory(root.IL_PEDAGOGIA, root.localStorage);
})(typeof globalThis !== "undefined" ? globalThis : this, function (PED, storage) {
  "use strict";

  const PREFIX = "il_mastery_v1_";
  const PRODUCTION = { ordenar: 1, completar: 1, hablar: 1 }; // el resto es reconocimiento

  function today() { return PED ? PED.ymd(new Date()) : new Date().toISOString().slice(0, 10); }
  function key(username) { return PREFIX + encodeURIComponent(String(username || "guest").trim().toLowerCase()); }
  function read(username) {
    try { const v = JSON.parse(storage.getItem(key(username))); return v && typeof v === "object" ? v : {}; }
    catch (e) { return {}; }
  }
  function write(username, map) {
    try { storage.setItem(key(username), JSON.stringify(map)); return true; }
    catch (e) { return false; }
  }

  /* Registra UN intento de un ejercicio y devuelve la ficha actualizada. */
  function record(username, exerciseId, ev, day) {
    if (!PED || !username || !exerciseId) return null;
    const map = read(username);
    const prev = map[exerciseId] || PED.blank(exerciseId);
    const card = PED.applyAttempt(prev, { correct: !!(ev && ev.correct), production: !!(ev && ev.production) }, day || today());
    map[exerciseId] = card;
    write(username, map);
    return card;
  }

  /* Igual, deduciendo "production" a partir del tipo de ejercicio. */
  function recordByType(username, exerciseId, tipo, correct, day) {
    return record(username, exerciseId, { correct: !!correct, production: !!PRODUCTION[tipo] }, day);
  }

  function all(username) { return read(username); }

  /* ids de ejercicios cuyo repaso VENCE hoy (o antes). */
  function due(username, day) {
    if (!PED) return [];
    const map = read(username); const d = day || today();
    return Object.keys(map).filter(id => PED.isDue(map[id], d));
  }
  function dueCount(username, day) { return due(username, day).length; }

  function clear(username) { try { storage.removeItem(key(username)); return true; } catch (e) { return false; } }

  return { record, recordByType, all, due, dueCount, clear, _key: key };
});
