const assert = require("assert");
const crypto = require("crypto");
const loader = require("./content/loader.js");
const manifest = require("./content/manifest.js");

const EXPECTED = {
  "pv-1":"50aaaf1c142ab24d2e7a0c6ac951aa93803a35e0abd2a5b71fddb8340f4589a9","pv-2":"f47f607fd2eba38582e06113aae1bc54020f372e772eae7a22b1136b38ed9442","pv-3":"e4310be6669eeb75a09447288174278060f3c24e9448c28fbac948bcb26dee9c","pv-4":"15bbfa7d6100387d47c97441ec566077e29bed258c615c352bbfc50aae00a024","pv-5":"3c0f5fd92243edcec3e53228a57a0e3cd0bbe314ae32bb397f3960313f0a14c9",
  "rd-1":"7d57db88eeea9e04fb7de5b227f8e8cdfbb2235238b2d80bb972bf6d183225d2","rd-2":"3144bdd051df125cdadfd8b9ac3123229448a92af79f9ed016e2edcd71873e3c","rd-3":"efa2bddc8033737a5cc240fac9757a7793872eaf83ae610d682a6f44db423a89","rd-4":"b7c012e7898077c6db59b929c71c0c6ecf25a4379281c891a698860221ffc0e9","rd-5":"4842f36c784e07de5f518663a84107e6f51b2643fbe10f73517edd5822c0fb8b","rd-6":"dce50d3246b2623ca77af77e63de9386cbcc176f92301386ea7ab14d639433d1",
  "lc-1":"e184c25525719eda9660f9ba9cf887199778b19796fd83104df5fe59a3ea9179","lc-2":"b22d44d9fdcae136a0d23380c56f10c06b9128020db2da849b401629e2845a85","lc-3":"2b78733ab69f0de2515b556337953bef9cc85420040df059fe3b86164ec70333","lc-4":"515a01a8be8bb942f84011220fac3f0a0db2d270fba2b59fef9feb028dee38ab","lc-5":"866a956749f09e1902a770099aed78080d3ba70e01f58862b16e06a55bdd9525","lc-6":"29b253e94db48b0695c1afb5cc043918d27489ab33291802a581bd09a839847c","lc-7":"22b7e9dfac24785a8ea00f7029d72b6358f2b0fda6e3b3c1ff2cae00a09dd6d2",
  "fp-1":"60ca272d44767dc10787b53c912dd8b9017cce6bb24802f488164bf9c8d0a4fb","fp-2":"fa7e4fe9d10bc7a82f8a706fe7f4e181a08fbf914fa5eff721d4a0710669647f","fp-3":"2bd5872f76d59a83b2b1db44a30c92dd404c0ea4512cedc03dd9ffe9a2508327","fp-4":"60aa6f2cf396af044d93a7cbfbf8bbf4cdfddbb2369fa0e437388e6dbab48ad1","fp-5":"45b32977189c040d30aaa0a6f7df946c6783bb62deee46bd8c40f38293156b05","fp-6":"c2ead70dce101d75f864773b20fde328426d82e9c762c63f6517d29e9f7ee7b8","fp-7":"332d01234fd4f9a3dc5f4f0ce8332604415504a85a7be7f00f8fe5e6f2a93ccf"
};

loader.reset();
global.ILContent = loader;
manifest.forEach(entry => {
  const file = "./" + entry.split("?")[0];
  delete require.cache[require.resolve(file)]; require(file);
});
delete global.ILContent;

const result = loader.assemble();
assert.equal(result.diagnostics.errors.length, 0, JSON.stringify(result.diagnostics.errors));
assert.deepEqual(result.packs, ["p12-school-core", "primary-daily-routine", "primary-food", "grammar-core", "eso-future-plans"]);
assert.equal(result.unidades.length, 7);
assert.equal(result.objectives.length, 25);
assert.equal(result.exercises.length, 209);

function fingerprint(exercise) {
  const editorial = { id:exercise.id,tipo:exercise.tipo,instruccion:exercise.instruccion,opciones:exercise.opciones||null,respuesta:exercise.respuesta||null,pares:exercise.pares||null,preguntas:exercise.preguntas||null };
  return crypto.createHash("sha256").update(JSON.stringify(editorial)).digest("hex");
}

Object.keys(EXPECTED).forEach(id => {
  const exercise = result.exercises.find(item => item.id === id);
  assert(exercise, "Falta el ejercicio histórico " + id);
  assert.equal(fingerprint(exercise), EXPECTED[id], "Cambió el contenido editorial de " + id);
});
assert.deepEqual(result.unidades.map(unit => unit.id), ["primer-vuelo", "rutina-diaria", "la-comida", "gramatica-inicial", "gramatica-media", "gramatica-eso", "future-plans"]);
assert(result.exercises.every(exercise => exercise.objective_id));
assert.equal(new Set(result.exercises.map(exercise => exercise.id)).size, 209);
console.log("content migration: 7 unidades, 209 ejercicios y 25 fingerprints históricos conservados");
