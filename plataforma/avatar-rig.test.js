const assert = require("assert");
const Rig = require("./avatar-rig.js");

const defaults = {
  avatarBase:"feminine",
  avatarSkin:"tone-2",
  avatarHairColor:"brown",
  avatarEyeColor:"brown",
  avatarOutfitColor:"green"
};

const female = Rig.render(defaults, {});
assert.ok(female.includes("assets/avatar/look-05.webp"), "mantiene siempre la lámina femenina aprobada y optimizada");
assert.ok(female.includes("il-avatar-delta"), "usa el compositor local no destructivo");
assert.ok(!female.includes("avatar-delta__layer"), "el estado original no superpone ninguna modificación");

const administrativelyReset = Rig.render(Object.assign({}, defaults, { avatarCustomised:false, avatarHairColor:"gold" }), {});
assert.ok(!administrativelyReset.includes("avatar-delta__layer"), "un cambio administrativo de base restaura el máster aunque existan colores antiguos");

const hair = Rig.render(Object.assign({}, defaults, {
  avatarHairColor:"gold",
  avatarFaceWidth:4,
  avatarHair:"curls",
  avatarTop:"hoodie",
  avatarAccessory:"glasses"
}), {});
assert.ok(hair.includes("assets/avatar/look-05.webp"), "un cambio conserva la lámina completa");
assert.ok(hair.includes("deltas/feminine/hair.webp"), "el color del pelo añade solo su máscara optimizada");
assert.ok(!hair.includes("deltas/feminine/iris.webp"), "el pelo no modifica los ojos");
assert.ok(!hair.includes("hair-curly"), "ignora peinados incompatibles con la lámina");
assert.ok(!hair.includes("hoodie"), "ignora prendas incompatibles con la lámina");
assert.ok(!hair.includes("glasses"), "ignora accesorios incompatibles con la lámina");

const eyes = Rig.render(Object.assign({}, defaults, { avatarEyeColor:"blue" }), {});
assert.ok(eyes.includes("deltas/feminine/iris.webp"), "el color de ojos añade solo la máscara del iris");
assert.ok(!eyes.includes("deltas/feminine/hair.webp"), "los ojos no modifican el pelo");

const combined = Rig.render(Object.assign({}, defaults, {
  avatarSkin:"tone-7",
  avatarHairColor:"red",
  avatarEyeColor:"green",
  avatarOutfitColor:"navy"
}), { portrait:true });
["skin", "hair", "iris", "outfit"].forEach(region =>
  assert.ok(combined.includes("deltas/feminine/" + region + ".webp"), "combina la máscara local de " + region));
assert.ok(combined.includes("is-portrait"), "conserva el modo retrato");

const male = Rig.render(Object.assign({}, defaults, { avatarBase:"masculine", avatarHairColor:"dark" }), {});
assert.ok(male.includes("assets/avatar/look-01.webp"), "mantiene siempre la lámina masculina aprobada y optimizada");
assert.ok(male.includes("deltas/masculine/hair.webp"), "usa máscaras alineadas con la base masculina");
assert.ok(!male.includes("look-05.webp"), "no mezcla las dos bases");

assert.equal(Rig.normal({ avatarFaceWidth:99 }, "avatarFaceWidth"), 1, "limita el máximo legado");
assert.equal(Rig.normal({ avatarFaceWidth:-4 }, "avatarFaceWidth"), -1, "limita el mínimo legado");
assert.deepEqual(Rig.sanitizePatch({ avatarFaceWidth:99, avatarEyeSize:-2, avatarBase:"feminine" }), { avatarFaceWidth:4, avatarEyeSize:0 }, "sanea parámetros heredados sin renderizarlos");

console.log("avatar-rig: máster inmutable y deltas locales comprobados");
