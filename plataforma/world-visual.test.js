const assert = require("assert");
const V = require("./world-visual.js");

const base = { avatarBase:"masculine", avatarSkin:"tone-2", avatarHair:"original", avatarHairColor:"brown", avatarEyeColor:"brown", avatarOutfitColor:"green", avatarTheme:"navy", avatarTop:"tee", avatarAccessory:"none", worldBackground:"day", activeWorldItems:[] };
const avatar = V.avatar(base, {});
assert.ok(avatar.includes("il-student-avatar"), "genera el avatar humano");
assert.ok(avatar.includes("il-avatar-delta"), "usa el compositor local también en el estado original");
assert.ok(avatar.includes("look-01.png"), "usa el avatar masculino aprobado");
assert.ok(avatar.includes("avatar-base--masculine"), "renderiza la base masculina");

const feminine = V.avatar(Object.assign({}, base, { avatarBase:"feminine" }), {});
assert.ok(feminine.includes("avatar-base--feminine"), "renderiza la base femenina");
assert.ok(feminine.includes("look-05.png"), "usa el avatar femenino aprobado");
assert.notEqual(feminine, avatar, "las bases asignadas son distintas");

const hairOnly = V.avatar(Object.assign({}, base, { avatarCustomised:true, avatarHairColor:"gold", avatarEyeSize:4, avatarHair:"curls" }), {});
assert.ok(hairOnly.includes("assets/avatar/look-01.png"), "conserva el máster tras personalizar");
assert.ok(hairOnly.includes("assets/avatar/deltas/masculine/hair.png"), "aplica solo la región solicitada");
assert.ok(!hairOnly.includes("assets/avatar/deltas/masculine/iris.png"), "no cambia regiones ajenas");
assert.ok(!hairOnly.includes("assets/avatar/rig/"), "no carga el antiguo avatar reconstruido");

const varied = V.avatar(Object.assign({}, base, { avatarSkin:"tone-8", avatarHairColor:"red", avatarEyeColor:"green", avatarOutfitColor:"coral", avatarFaceWidth:4 }), {});
["skin", "hair", "iris", "outfit"].forEach(region =>
  assert.ok(varied.includes("assets/avatar/deltas/masculine/" + region + ".png"), "renderiza delta de " + region));
assert.ok(varied.includes("filter:"), "recolorea únicamente las máscaras correspondientes");

const portrait = V.avatar(base, {}, { portrait:true });
assert.ok(portrait.includes("is-portrait"), "genera previsualización de rostro");
assert.ok(V.scene(base, {}, "p12", { level:1 }).includes("Tu mundo de aprendizaje"), "mantiene el jardín infantil");
assert.ok(V.scene(base, {}, "eso", { level:1 }).includes("Your personal space"), "mantiene el espacio de ESO");

console.log("world-visual: avatar maestro inmutable comprobado");
