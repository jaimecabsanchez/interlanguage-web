const assert = require("assert");
const V = require("./world-visual.js");

const base = { avatarSkin:"tone-2", avatarHair:"short", avatarHairColor:"dark", avatarFaceShape:"oval", avatarFaceWidth:2, avatarEyeShape:"almond", avatarEyeColor:"brown", avatarEyeSize:2, avatarBrowShape:"soft", avatarNoseShape:"soft", avatarNoseLength:2, avatarMouthShape:"smile", avatarTheme:"navy", avatarTop:"tee", avatarAccessory:"none", worldBackground:"day", activeWorldItems:[] };
const avatar = V.avatar(base, {});
assert.ok(avatar.includes("il-student-avatar"), "genera el avatar humano");
assert.ok(avatar.includes("avatar-eye"), "renderiza ojos independientes");
assert.ok(avatar.includes("il-avatar-eye-brown"), "aplica el color de ojos");

const varied = V.avatar(Object.assign({}, base, { avatarSkin:"tone-8", avatarHair:"braids", avatarHairColor:"red", avatarEyeColor:"green", avatarFaceShape:"angular", avatarNoseShape:"defined", avatarMouthShape:"wide" }), {});
assert.ok(varied.includes("il-avatar-skin-8"), "admite ocho tonos de piel");
assert.ok(varied.includes("il-avatar-hair-red"), "admite la paleta ampliada de pelo");
assert.ok(varied.includes("il-avatar-eye-green"), "admite colores de ojos");
assert.ok(varied.includes("viewBox=\"0 0 180 260\""), "mantiene el encuadre de cuerpo completo");

const portrait = V.avatar(base, {}, { portrait:true });
assert.ok(portrait.includes("is-portrait"), "genera previsualización de rostro");
assert.ok(portrait.includes("viewBox=\"34 0 114 118\""), "recorta el retrato sin duplicar el avatar");
assert.ok(V.scene(base, {}, "p12", { level:1 }).includes("Tu mundo de aprendizaje"), "mantiene el jardín infantil");
assert.ok(V.scene(base, {}, "eso", { level:1 }).includes("Your personal space"), "mantiene el espacio de ESO");

console.log("world-visual: 11 comprobaciones correctas");
