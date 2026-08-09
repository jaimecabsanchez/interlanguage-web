/* ============================================================
   Interlanguage HOME · snapshot compartido de progreso
   Los datos demo educativos viven únicamente en este archivo.
   Un null significa "sin evidencia suficiente", nunca cero.
   ============================================================ */
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory;
  else root.ILProgressData = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function createProgressData() {
  "use strict";

  const SKILLS = [
    { id: "vocabulary", label: "Vocabulary", icon: "books" },
    { id: "listening", label: "Listening", icon: "ear" },
    { id: "grammar", label: "Grammar", icon: "pencil" },
    { id: "reading", label: "Reading", icon: "book" },
    { id: "writing", label: "Writing", icon: "pencil" },
    { id: "speaking", label: "Speaking", icon: "chat" }
  ];

  const DEMO_LEARNING = Object.freeze({
    lucia: Object.freeze({
      minutesTotal: 186,
      minutesWeek: 24,
      wordsLearned: 43,
      accuracy: 80,
      topicsCompleted: 4,
      listeningCorrect: 14,
      phrases: Object.freeze([
        "I get up at seven.",
        "I have breakfast before school.",
        "I go to school by bus."
      ]),
      skills: Object.freeze({ vocabulary: 75, listening: 50, grammar: 65, reading: 70, writing: null, speaking: null }),
      reinforce: Object.freeze({
        skill: "Listening",
        description: "Te cuesta un poco más reconocer algunas expresiones de rutinas.",
        href: "leccion.html"
      }),
      comeback: true,
      profile: Object.freeze({
        levelName: "Explorer 2",
        nextLevel: "Explorer 3",
        levelProgress: 65,
        approximateLevel: "A1",
        description: "Estás aprendiendo a hablar sobre rutinas y actividades cotidianas."
      })
    })
  });

  function clamp(value, min, max) { return Math.max(min, Math.min(max, Number(value) || 0)); }
  function iso(date) { return date.toISOString().slice(0, 10); }
  function monday(offset, now) {
    const d = new Date(now || Date.now()); d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + (offset || 0) * 7);
    return d;
  }
  function countWeek(days, offset, now) {
    const set = new Set(days || []); const start = monday(offset, now); let count = 0;
    for (let i = 0; i < 7; i++) { const d = new Date(start); d.setDate(start.getDate() + i); if (set.has(iso(d))) count++; }
    return count;
  }
  function detectComeback(days) {
    const sorted = Array.from(new Set(days || [])).sort();
    for (let i = 1; i < sorted.length; i++) {
      const gap = Math.round((Date.parse(sorted[i]) - Date.parse(sorted[i - 1])) / 86400000);
      if (gap >= 4) return true;
    }
    return false;
  }
  function metric(current, target) {
    if (current == null) return { current: null, target: target, percent: null, unlocked: false };
    const safe = Math.max(0, Number(current) || 0);
    return { current: safe, target: target, percent: clamp(Math.round(safe / target * 100), 0, 100), unlocked: safe >= target };
  }
  function stamp(id, name, description, requirement, value, icon) {
    return Object.assign({ id, name, description, requirement, icon: icon || "stamp" }, value);
  }
  function buildStamps(data) {
    const stamps = [
      stamp("first-flight", "First Flight", "Tu primer paso en la ruta de aprendizaje.", "Completa tu primera misión.", metric(data.lessons, 1), "plane"),
      stamp("weekly-explorer", "Weekly Explorer", "Has mantenido un ritmo constante esta semana.", "Completa 5 sesiones en una semana.", metric(data.weekCount, 5), "calendar"),
      stamp("morning-explorer", "Morning Explorer", "Dominas cada vez más expresiones de tu rutina.", "Completa 5 misiones sobre rutinas.", metric(data.routineMissions, 5), "route"),
      stamp("word-collector", "Word Collector", "Tu vocabulario sigue creciendo.", "Aprende 50 palabras.", metric(data.wordsLearned, 50), "books"),
      stamp("listening-star", "Listening Star", "Reconoces el inglés con más seguridad.", "Completa correctamente 20 ejercicios de listening.", metric(data.listeningCorrect, 20), "ear"),
      stamp("comeback", "Comeback", "Volviste a practicar después de una pausa.", "Retoma tu práctica tras varios días.", data.comeback == null ? metric(null, 1) : metric(data.comeback ? 1 : 0, 1), "refresh")
    ];
    const next = stamps.filter(item => !item.unlocked && item.current != null).sort((a, b) => (b.percent || 0) - (a.percent || 0))[0] || null;
    return { items: stamps, next: next, unlocked: stamps.filter(item => item.unlocked).length };
  }
  function normalizeSkills(authSkills, demo) {
    const provided = {};
    if (authSkills && authSkills.hasData) (authSkills.skills || []).forEach(item => { provided[item.key || item.id || String(item.label || "").toLowerCase()] = item.pct; });
    return SKILLS.map(skill => {
      const value = demo ? demo.skills[skill.id] : (Object.prototype.hasOwnProperty.call(provided, skill.id) ? provided[skill.id] : null);
      return Object.assign({}, skill, { percent: value == null ? null : clamp(Math.round(value / 5) * 5, 0, 100) });
    });
  }
  function comparison(current, previous, hasPreviousData) {
    if (!hasPreviousData) return { tone: "neutral", text: "Cuando completes otra semana, podrás comparar tu ritmo." };
    if (current > previous) return { tone: "positive", text: "Llevas " + (current - previous) + " " + (current - previous === 1 ? "sesión" : "sesiones") + " más que la semana pasada." };
    if (current === previous) return { tone: "neutral", text: "Mantienes el mismo ritmo que la semana pasada." };
    return { tone: "neutral", text: "Aún puedes sumar sesiones esta semana, a tu ritmo." };
  }
  function buildSnapshot(input) {
    input = input || {};
    const profile = input.profile || {}; const progress = input.progress || {}; const week = input.week || { goal: 5, count: 0, practiced: [] };
    const key = String(profile.username || "").toLowerCase();
    const demo = input.isDemo ? (DEMO_LEARNING[key] || null) : null;
    const days = input.activityDays || [];
    const previousWeek = countWeek(days, -1, input.now);
    const hasPreviousData = previousWeek > 0;
    const phrases = (input.masteredPhrases && input.masteredPhrases.length) ? input.masteredPhrases : (demo ? demo.phrases.slice() : []);
    const data = {
      isDemo: !!input.isDemo,
      profile: profile,
      placement: input.placement || null,
      lessons: Number(progress.lessons) || 0,
      streak: Number(progress.streak) || 0,
      bestStreak: Number(progress.best) || 0,
      activeDays: days.length,
      week: { goal: Number(week.goal) || 5, count: Number(week.count) || 0, practiced: (week.practiced || []).slice() },
      previousWeek: previousWeek,
      weekComparison: comparison(Number(week.count) || 0, previousWeek, hasPreviousData),
      minutesTotal: demo ? demo.minutesTotal : null,
      minutesWeek: demo ? demo.minutesWeek : null,
      wordsLearned: demo ? demo.wordsLearned : null,
      accuracy: demo ? demo.accuracy : null,
      topicsCompleted: demo ? demo.topicsCompleted : null,
      phrases: phrases,
      expressionsMastered: phrases.length || (demo ? demo.phrases.length : 0),
      skills: normalizeSkills(input.authSkills, demo),
      reinforce: demo ? demo.reinforce : { skill: "Listening", description: "Practica un poco más para descubrir qué habilidad conviene reforzar.", href: "leccion.html" },
      routineMissions: input.routineMissions == null ? 0 : input.routineMissions,
      listeningCorrect: demo ? demo.listeningCorrect : null,
      comeback: demo ? demo.comeback : detectComeback(days)
    };
    data.profileSummary = demo ? demo.profile : {
      levelName: (profile.level || (input.placement && input.placement.label) || "Nivel por descubrir").replace(" · ", " "),
      nextLevel: "Siguiente nivel",
      levelProgress: null,
      approximateLevel: input.placement && input.placement.cefr ? input.placement.cefr : null,
      description: phrases.length ? "Estás convirtiendo lo que practicas en inglés que ya puedes utilizar." : "Tu recorrido de aprendizaje empieza con cada misión que completas."
    };
    data.weekCount = data.week.count;
    data.stamps = buildStamps(data);
    return data;
  }

  async function load(auth, mission) {
    const profile = await auth.getProfile();
    if (!profile) return null;
    const results = await Promise.all([
      auth.getProgress(), auth.getWeekActivity(), auth.getActivityDays(3650), auth.getSkillBreakdown(), auth.getMasteredPhrases(), auth.getPlacement()
    ]);
    let routineMissions = 0;
    if (mission && typeof mission.unitCompletionCount === "function") routineMissions = mission.unitCompletionCount(profile.username || "", "rutina-diaria");
    return buildSnapshot({
      profile: profile, progress: results[0], week: results[1], activityDays: results[2], authSkills: results[3],
      masteredPhrases: results[4], placement: results[5], isDemo: auth.isDemo(), routineMissions: routineMissions
    });
  }

  return { SKILLS, DEMO_LEARNING, countWeek, detectComeback, buildStamps, buildSnapshot, load };
});
