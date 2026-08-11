const assert = require("assert");
const V = require("./world-visual.js");

const base = { avatarBase:"masculine", avatarSkin:"tone-2", avatarHair:"short", avatarHairColor:"brown", avatarFaceShape:"oval", avatarFaceWidth:2, avatarEyeShape:"almond", avatarEyeColor:"brown", avatarEyeSize:2, avatarBrowShape:"soft", avatarNoseShape:"soft", avatarNoseLength:2, avatarMouthShape:"smile", avatarTheme:"navy", avatarTop:"tee", avatarAccessory:"none", worldBackground:"day", activeWorldItems:[] };
const avatar = V.avatar(base, {});
assert.ok(avatar.includes("il-student-avatar"), "genera el avatar humano");
assert.ok(avatar.includes("il-avatar-master"), "conserva la lámina original por defecto");
assert.ok(avatar.includes("look-01.png"), "usa el avatar masculino aprobado");
assert.ok(avatar.includes("avatar-base--masculine"), "renderiza la base masculina");

const feminine = V.avatar(Object.assign({}, base, { avatarBase:"feminine" }), {});
assert.ok(feminine.includes("avatar-base--feminine"), "renderiza la base femenina");
assert.ok(feminine.includes("look-05.png"), "usa el avatar femenino aprobado");
assert.notEqual(feminine, avatar, "las bases producen geometrías distintas");
assert.ok(V.avatar(Object.assign({}, base, { avatarLook:"look-01" }), {}).includes("il-student-avatar"), "mantiene compatibilidad con las preferencias antiguas");

const layered = V.avatar(Object.assign({}, base, { avatarCustomised:true, avatarEyeSize:4, avatarHairColor:"gold" }), {});
assert.ok(layered.includes("il-avatar-rig"), "activa el rig gradual al modificar un rasgo");
assert.ok(!layered.includes("il-avatar-stack"), "no vuelve a usar el compositor que deformaba el avatar");
assert.ok(layered.includes("assets/avatar/rig/masculine/head-base.png"), "usa las capas compatibles con la lámina masculina");
assert.ok(layered.includes("scale(1.16 1.16)"), "aplica el tamaño de ojos dentro de un rango seguro");

const varied = V.avatar(Object.assign({}, base, { avatarCustomised:true, avatarSkin:"tone-8", avatarHair:"curls", avatarHairColor:"red", avatarEyeColor:"green", avatarFaceWidth:4, avatarNoseWidth:4, avatarMouthWidth:4 }), {});
assert.ok(varied.includes("hair-curly.png"), "permite cambiar el peinado sin cambiar el lenguaje visual");
assert.ok(varied.includes("hair-original.png") === false, "muestra una sola variante de pelo");
assert.ok(varied.includes("filter:"), "aplica color solo a las capas correspondientes");

const feminineRig = V.avatar(Object.assign({}, base, { avatarBase:"feminine", avatarCustomised:true }), {});
assert.ok(feminineRig.includes("assets/avatar/rig/feminine/head-base.png"), "el rig femenino usa su propia geometría compatible");
assert.ok(!feminineRig.includes("look-01.png"), "no mezcla las bases masculina y femenina");

const portrait = V.avatar(Object.assign({}, base, { avatarCustomised:true }), {}, { portrait:true });
assert.ok(portrait.includes("is-portrait"), "genera previsualización de rostro");
assert.ok(V.scene(base, {}, "p12", { level:1 }).includes("Tu mundo de aprendizaje"), "mantiene el jardín infantil");
assert.ok(V.scene(base, {}, "eso", { level:1 }).includes("Your personal space"), "mantiene el espacio de ESO");

console.log("world-visual: avatar maestro comprobado");
