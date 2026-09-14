const assert = require("node:assert/strict");
const Data = require("./learning-data.js");

function client(fixtures) {
  return { from(table) {
    const calls = []; const query = { select(v){calls.push(["select",v]);return query;},eq(k,v){calls.push(["eq",k,v]);return query;},gte(k,v){calls.push(["gte",k,v]);return query;},order(k,v){calls.push(["order",k,v]);return query;},then(resolve){const item=fixtures[table]||{data:[],error:null};item.calls=calls;return Promise.resolve(item).then(resolve);} }; return query;
  }};
}

(async () => {
  const attempts=Array.from({length:5},(_,i)=>({exercise_key:'e'+i,client_session_key:'s',attempt_no:1,result:'correct',duration_ms:60000,submitted_at:'2026-09-14T12:00:00Z'}));
  attempts.push({exercise_key:'oral',client_session_key:'s',attempt_no:1,result:'skipped',duration_ms:60000,submitted_at:'2026-09-14T12:00:00Z'});
  attempts.push({exercise_key:'old',client_session_key:'s',attempt_no:1,result:'skipped',duration_ms:600000,submitted_at:'2026-09-10T12:00:00Z'});
  const metrics=Data.projectMetrics(attempts,[{started_at:'2026-09-14T00:00:00Z',finished_at:'2026-09-14T18:00:00Z'}],{from:'2026-09-01',weekFrom:'2026-09-14',to:'2026-09-14'});
  assert.equal(metrics.accuracy,100,'self-reported speaking is not an incorrect answer');
  assert.equal(metrics.sample,5);
  assert.equal(metrics.minutesWeek,6,'week minutes use active attempts, not two-week elapsed wall time');
  const fixtures = { practice_sessions:{ data:[{date:"2026-08-20"},{date:"2026-08-20"},{date:"2026-08-21"}], error:null } };
  const activity = await Data.activityDays(client(fixtures), "student-1", "2026-08-18");
  assert.deepEqual(activity.days, ["2026-08-20", "2026-08-21"]);
  assert(fixtures.practice_sessions.calls.some(call => call[0] === "eq" && call[1] === "completed" && call[2] === true));
  assert(fixtures.practice_sessions.calls.some(call => call[0] === "eq" && call[1] === "mode" && call[2] === "daily"),"extra practice must not complete the daily week");
  assert(fixtures.practice_sessions.calls.some(call => call[0] === "gte" && call[1] === "date"));

  const current = await Data.skillBreakdown(client({ exercise_mastery:{data:[{skill:"listening",mastery_state:"mastered",attempt_count:6}],error:null} }), "student-1");
  assert.equal(current.skills[0].pct, 100);
  assert.equal(current.skills[0].sufficient, true);

  const sparse = Data.projectSkills([{skill:"grammar",mastery_state:"mastered",attempt_count:2}], "exercise_mastery");
  assert.equal(sparse.skills[0].pct, null, "sin muestra suficiente no muestra porcentaje");

  const fallback = await Data.skillBreakdown(client({ exercise_mastery:{data:null,error:{message:"missing"}}, mastery:{data:[{mastery_state:"mastered",objectives:{skill_id:"reading"}}],error:null} }), "student-1");
  assert.equal(fallback.source, "mastery");
  console.log("learning-data: actividad semanal y habilidades canónicas correctas");
})().catch(error => { console.error(error); process.exitCode = 1; });
