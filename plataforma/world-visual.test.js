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
assert.ok(V.avatar(Object.assign({}, base, { avatarLook:"look-01" }), {}).includes("il-student-avatar"), "migra las láminas antiguas al editor modular");

const layered = V.avatar(Object.assign({}, base, { avatarCustomised:true, avatarEyeSize:4, avatarHairColor:"gold" }), {});
assert.ok(layered.includes("il-avatar-stack"), "activa el compositor después de editar");
assert.ok(layered.includes("layers/masculine/base.png"), "compone la base ilustrada");
assert.ok(layered.includes("brows-default.png"), "separa las cejas de la lámina facial");
assert.ok(layered.includes("eyes-default.png"), "separa los ojos de la lámina facial");
assert.ok(layered.includes("mouth-default.png"), "separa la boca de la lámina facial");
assert.ok(layered.includes("--avatar-eye-size:1.2"), "convierte el control gradual en geometría de capa");

const varied = V.avatar(Object.assign({}, base, { avatarCustomised:true, avatarSkin:"tone-8", avatarHair:"braids", avatarHairColor:"red", avatarEyeColor:"green", avatarFaceShape:"angular", avatarNoseShape:"defined", avatarMouthShape:"wide" }), {});
assert.ok(varied.includes("brightness(.52)"), "admite ocho tonos de piel");
assert.ok(varied.includes("hue-rotate(325deg)"), "admite la paleta ampliada de pelo");
assert.ok(varied.includes("hue-rotate(72deg)"), "admite colores de ojos");

const portrait = V.avatar(Object.assign({}, base, { avatarCustomised:true }), {}, { portrait:true });
assert.ok(portrait.includes("is-portrait"), "genera previsualización de rostro");
assert.ok(V.scene(base, {}, "p12", { level:1 }).includes("Tu mundo de aprendizaje"), "mantiene el jardín infantil");
assert.ok(V.scene(base, {}, "eso", { level:1 }).includes("Your personal space"), "mantiene el espacio de ESO");

console.log("world-visual: 21 comprobaciones correctas");
