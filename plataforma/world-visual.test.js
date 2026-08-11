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
assert.ok(layered.includes("look-01.png"), "una preferencia antigua sigue mostrando la lámina masculina exacta");
assert.ok(!layered.includes("il-avatar-stack"), "no vuelve a usar el compositor que deformaba el avatar");
assert.ok(!layered.includes("layers/"), "no carga capas reconstruidas");

const varied = V.avatar(Object.assign({}, base, { avatarCustomised:true, avatarSkin:"tone-8", avatarHair:"braids", avatarHairColor:"red", avatarEyeColor:"green", avatarFaceShape:"angular", avatarNoseShape:"defined", avatarMouthShape:"wide" }), {});
assert.ok(varied.includes("look-01.png"), "ignora rasgos incompatibles y conserva la ilustración aprobada");
assert.ok(!varied.includes("filter:"), "no altera visualmente la lámina maestra");

const portrait = V.avatar(Object.assign({}, base, { avatarCustomised:true }), {}, { portrait:true });
assert.ok(portrait.includes("is-portrait"), "genera previsualización de rostro");
assert.ok(V.scene(base, {}, "p12", { level:1 }).includes("Tu mundo de aprendizaje"), "mantiene el jardín infantil");
assert.ok(V.scene(base, {}, "eso", { level:1 }).includes("Your personal space"), "mantiene el espacio de ESO");

console.log("world-visual: avatar maestro comprobado");
