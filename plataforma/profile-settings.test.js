const assert = require("assert");
const createProfileSettings = require("./profile-settings.js");

function memoryStorage() {
  const data = new Map();
  return {
    getItem: key => data.has(key) ? data.get(key) : null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: key => data.delete(key)
  };
}

const storage = memoryStorage();
const S = createProfileSettings(storage);
let settings = S.load("lucia");
assert.equal(settings.sound, true);
assert.equal(settings.autoplayAudio, true);
assert.equal(settings.audioSpeed, 0.9);
assert.equal(settings.dailyGoal, 8);
assert.equal(settings.reduceMotion, false);
assert.equal(settings.textSize, "normal");
assert.equal(settings.avatarSkin, "tone-2");
assert.equal(settings.avatarHair, "short");
assert.equal(settings.avatarHairColor, "dark");
assert.equal(settings.avatarExpression, "smile");
assert.equal(settings.avatarTop, "tee");
assert.equal(settings.avatarAccessory, "none");
assert.equal(settings.worldBackground, "day");
assert.deepEqual(settings.activeWorldItems, ["world-flowers", "world-bench", "world-plant", "world-travel-board"]);

settings = S.save("lucia", { sound: false, audioSpeed: 1, dailyGoal: 15, textSize: "large", avatarTheme: "coral", avatarSkin:"tone-4", avatarHair:"curls", avatarHairColor:"copper", avatarExpression:"bright", avatarTop:"hoodie", avatarAccessory:"headphones", worldBackground:"sunset", worldCompanion:"pet-nube", activeWorldItems:["world-flowers","world-pond"], seenUnlocks:["top-hoodie"], accessory:"backpack", background:"city", featuredStamp: "weekly-explorer" });
assert.equal(settings.sound, false);
assert.equal(settings.audioSpeed, 1);
assert.equal(settings.dailyGoal, 15);
assert.equal(settings.textSize, "large");
assert.equal(settings.avatarTheme, "coral");
assert.equal(settings.avatarSkin, "tone-4");
assert.equal(settings.avatarHair, "curls");
assert.equal(settings.avatarHairColor, "copper");
assert.equal(settings.avatarExpression, "bright");
assert.equal(settings.avatarTop, "hoodie");
assert.equal(settings.avatarAccessory, "headphones");
assert.equal(settings.worldBackground, "sunset");
assert.equal(settings.worldCompanion, "pet-nube");
assert.deepEqual(settings.activeWorldItems, ["world-flowers", "world-pond"]);
assert.deepEqual(settings.seenUnlocks, ["top-hoodie"]);
assert.equal(settings.accessory, "backpack");
assert.equal(settings.background, "city");
assert.equal(settings.featuredStamp, "weekly-explorer");
assert.deepEqual(S.load("lucia"), settings, "persiste por alumno");
assert.equal(S.load("ana").sound, true, "otro alumno conserva defaults");
assert.equal(S.getActive().dailyGoal, 15, "mantiene preferencias activas para el motor");

const clean = S.sanitize({ audioSpeed: 4, dailyGoal: 99, textSize: "huge", avatarTheme: "fox", avatarSkin:"blue", avatarHair:"none", avatarHairColor:"pink", avatarExpression:"angry", avatarTop:"cape", avatarAccessory:"crown", worldBackground:"moon", worldCompanion:"dragon", activeWorldItems:["world-pond","bad"], seenUnlocks:["good-id","<bad>"], accessory:"crown", background:"moon", featuredStamp: 20 });
assert.equal(clean.audioSpeed, 0.9);
assert.equal(clean.dailyGoal, 8);
assert.equal(clean.textSize, "normal");
assert.equal(clean.avatarTheme, "navy");
assert.equal(clean.avatarSkin, "tone-2");
assert.equal(clean.avatarHair, "short");
assert.equal(clean.avatarHairColor, "dark");
assert.equal(clean.avatarExpression, "smile");
assert.equal(clean.avatarTop, "tee");
assert.equal(clean.avatarAccessory, "none");
assert.equal(clean.worldBackground, "day");
assert.equal(clean.worldCompanion, "none");
assert.deepEqual(clean.activeWorldItems, ["world-pond"]);
assert.deepEqual(clean.seenUnlocks, ["good-id"]);
assert.equal(clean.accessory, "hat");
assert.equal(clean.background, "school");
assert.equal(clean.featuredStamp, "");

const fakeDoc = { documentElement: { dataset: {} } };
S.apply(settings, fakeDoc);
assert.equal(fakeDoc.documentElement.dataset.ilTextSize, "large");
assert.equal(fakeDoc.documentElement.dataset.ilReduceMotion, "false");
S.clearActive();
assert.equal(S.getActive().dailyGoal, 8);

console.log("profile-settings: 55 comprobaciones correctas");
