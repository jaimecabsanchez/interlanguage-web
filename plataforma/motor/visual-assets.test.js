const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const PLATFORM = path.resolve(__dirname, "..");
const visuals = require("./visual-assets.js");
const source = fs.readFileSync(path.join(PLATFORM, "contenido.js"), "utf8");
const sandbox = {
  window: {},
  localStorage: { getItem: () => null },
  console
};
vm.runInNewContext(source, sandbox, { filename: "contenido.js" });

const units = sandbox.window.IL_CONTENIDO.unidades;
let assertions = 0;
function ok(value, message) { assert.ok(value, message); assertions += 1; }

Object.entries(visuals.all).forEach(([key, asset]) => {
  ok(fs.existsSync(path.join(PLATFORM, asset.src)), `Existe el recurso visual ${key}: ${asset.src}`);
});

units.forEach(unit => (unit.ejercicios || []).forEach(exercise => {
  if (exercise.tipo === "elegir_imagen") {
    (exercise.opciones || []).forEach((option, index) => {
      ok(!option.emoji, `${exercise.id} opción ${index + 1} no usa emoji editorial`);
      ok(!!option.visual, `${exercise.id} opción ${index + 1} declara visual`);
      ok(!!visuals.get(option), `${exercise.id} opción ${index + 1} tiene ilustración registrada`);
    });
  }
  if (exercise.tipo === "emparejar" && exercise.presentacion === "visual") {
    (exercise.pares || []).forEach((pair, index) => {
      ok(!!visuals.get(pair.b), `${exercise.id} pareja ${index + 1} tiene ilustración registrada`);
    });
  }
  if ((exercise.edad || [])[0] >= 12) {
    const automaticVisuals = (exercise.opciones || []).filter(option => visuals.get(option));
    ok(automaticVisuals.length === 0, `${exercise.id} de ESO no recibe ilustración infantil automática`);
  }
}));

ok(!/emoji\s*:/.test(source), "El banco base no declara emojis como imágenes de respuesta");
ok(visuals.validateExercise({ tipo:"elegir_imagen", opciones:[{ visual:"book" }] }).valid,
  "La validación acepta una actividad visual cubierta");
ok(!visuals.validateExercise({ tipo:"elegir_imagen", opciones:[{ visual:"concepto-nuevo" }] }).valid,
  "La validación bloquea una actividad sin ilustración homologada");
console.log(`\n${assertions} OK · cobertura visual completa`);
