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

settings = S.save("lucia", { sound: false, audioSpeed: 1, dailyGoal: 15, textSize: "large", avatarTheme: "coral", featuredStamp: "weekly-explorer" });
assert.equal(settings.sound, false);
assert.equal(settings.audioSpeed, 1);
assert.equal(settings.dailyGoal, 15);
assert.equal(settings.textSize, "large");
assert.equal(settings.avatarTheme, "coral");
assert.equal(settings.featuredStamp, "weekly-explorer");
assert.deepEqual(S.load("lucia"), settings, "persiste por alumno");
assert.equal(S.load("ana").sound, true, "otro alumno conserva defaults");
assert.equal(S.getActive().dailyGoal, 15, "mantiene preferencias activas para el motor");

const clean = S.sanitize({ audioSpeed: 4, dailyGoal: 99, textSize: "huge", avatarTheme: "fox", featuredStamp: 20 });
assert.equal(clean.audioSpeed, 0.9);
assert.equal(clean.dailyGoal, 8);
assert.equal(clean.textSize, "normal");
assert.equal(clean.avatarTheme, "navy");
assert.equal(clean.featuredStamp, "");

const fakeDoc = { documentElement: { dataset: {} } };
S.apply(settings, fakeDoc);
assert.equal(fakeDoc.documentElement.dataset.ilTextSize, "large");
assert.equal(fakeDoc.documentElement.dataset.ilReduceMotion, "false");
S.clearActive();
assert.equal(S.getActive().dailyGoal, 8);

console.log("profile-settings: 23 comprobaciones correctas");
