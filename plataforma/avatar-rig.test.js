const assert = require("assert");
const Rig = require("./avatar-rig.js");

const defaults = { avatarBase:"feminine", avatarHair:"original", avatarTop:"tee", avatarAccessory:"none" };
const female = Rig.render(defaults, {});
assert.ok(female.includes('viewBox="0 0 1000 1000"'), "usa el lienzo femenino proporcionado");
assert.ok(female.includes("feminine/head-base.png"), "carga la cabeza femenina");
assert.ok(female.includes("feminine/body-base.png"), "carga el cuerpo femenino");
assert.ok(!female.includes("glasses.png"), "no añade accesorios por defecto");

const customised = Rig.render(Object.assign({}, defaults, {
  avatarFaceWidth:99,
  avatarEyeSpacing:-20,
  avatarHair:"curls",
  avatarTop:"hoodie",
  avatarAccessory:"glasses"
}), { portrait:true });
assert.ok(customised.includes("hair-curly.png"), "selecciona pelo rizado");
assert.ok(customised.includes("outfit-hoodie.png"), "selecciona sudadera");
assert.ok(customised.includes("glasses.png"), "añade gafas");
assert.ok(customised.includes('viewBox="300 0 400 390"'), "recorta el rostro para las opciones");
assert.equal(Rig.normal({ avatarFaceWidth:99 }, "avatarFaceWidth"), 1, "limita el máximo gradual");
assert.equal(Rig.normal({ avatarFaceWidth:-4 }, "avatarFaceWidth"), -1, "limita el mínimo gradual");
assert.deepEqual(Rig.sanitizePatch({ avatarFaceWidth:99, avatarEyeSize:-2, avatarBase:"feminine" }), { avatarFaceWidth:4, avatarEyeSize:0 }, "solo admite parámetros seguros del rig");

console.log("avatar-rig: capas y límites comprobados");
