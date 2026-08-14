/* ============================================================
   Interlanguage HOME · interpretación educativa para familias
   Módulo puro: transforma el snapshot compartido sin inventar datos.
   ============================================================ */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ILFamilyData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createFamilyData() {
  "use strict";

  const MIN_LESSONS = 5;
  const MIN_TREND_POINTS = 3;

  function number(value) { return value === null || value === undefined || value === "" ? null : (Number.isFinite(Number(value)) ? Number(value) : null); }
  function firstName(profile) {
    return String((profile && (profile.first_name || profile.full_name)) || "Alumno").trim().split(/\s+/)[0] || "Alumno";
  }
  function metric(id, label, value, suffix, icon) {
    return { id, label, value: number(value), suffix: suffix || "", icon };
  }
  function measuredSkills(skills) {
    return (skills || []).filter(skill => number(skill.percent) != null).map(skill => Object.assign({}, skill, { percent: number(skill.percent) }));
  }
  function monotonic(values) {
    if (values.length < MIN_TREND_POINTS) return false;
    return values.slice(1).every((value, index) => value >= values[index]);
  }
  function trendMessage(name, history) {
    const sessions = history.map(item => number(item.sessions)).filter(value => value != null);
    if (monotonic(sessions.slice(-3))) return name + " ha practicado con mayor constancia durante las últimas tres semanas.";
    return "La práctica de " + name + " mantiene un ritmo estable. Lo importante es sostener sesiones breves y regulares.";
  }
  function evolutionMessage(name, history) {
    const accuracy = history.map(item => number(item.accuracy)).filter(value => value != null);
    if (accuracy.length < MIN_TREND_POINTS) return null;
    const change = accuracy[accuracy.length - 1] - accuracy[0];
    if (change >= 5) return "La precisión ha mejorado de forma gradual mientras aumenta el tiempo de práctica.";
    if (change >= 0) return "La precisión se mantiene estable a medida que " + name + " incorpora contenido nuevo.";
    return "La precisión ha variado esta semana; conviene observar algunas sesiones más antes de sacar conclusiones.";
  }

  function sparseModel(snapshot, name, forcedNewState) {
    const week = snapshot.week || {};
    const phrases = forcedNewState ? [] : (snapshot.phrases || []).slice();
    return {
      name,
      title: "Progreso de " + name,
      sufficientEvidence: false,
      lowDataMessage: name + " acaba de empezar. Necesitamos algunas sesiones más para mostrar una evolución fiable.",
      phrases,
      expressionsTotal: forcedNewState ? null : number(snapshot.expressionsMastered),
      metrics: [
        metric("days", "días de práctica", forcedNewState ? 0 : week.count, "", "calendar"),
        metric("exercises", "ejercicios", null, "", "target"),
        metric("expressions", "expresiones nuevas", forcedNewState ? null : (snapshot.expressionsMastered || null), "", "chat"),
        metric("accuracy", "de precisión", forcedNewState ? null : snapshot.accuracy, "%", "trend"),
        metric("minutes", "minutos", forcedNewState ? null : snapshot.minutesWeek, "", "clock")
      ],
      consistency: { history: [], message: null },
      contents: [], strengths: [], reinforce: null, evolution: { history: [], message: null }, recommendation: null, classConnection: null
    };
  }

  function build(snapshot, options) {
    snapshot = snapshot || {};
    options = options || {};
    const name = firstName(snapshot.profile);
    const evidence = snapshot.familyEvidence;
    const enough = !options.forceSparse && number(snapshot.lessons) >= MIN_LESSONS && evidence && Array.isArray(evidence.weeklyHistory) && evidence.weeklyHistory.length >= MIN_TREND_POINTS;
    if (!enough) return sparseModel(snapshot, name, !!options.forceSparse);

    const history = evidence.weeklyHistory.map((item, index, list) => Object.assign({}, item, {
      sessions: index === list.length - 1 ? number(snapshot.week && snapshot.week.count) : number(item.sessions),
      minutes: number(item.minutes), accuracy: number(item.accuracy)
    }));
    const skills = measuredSkills(snapshot.skills).sort((a, b) => b.percent - a.percent);
    const strengths = skills.slice(0, 2);
    const reinforceSkill = skills.length > 1 ? skills[skills.length - 1] : null;
    const reinforce = reinforceSkill ? {
      skill: reinforceSkill.label,
      percent: reinforceSkill.percent,
      description: snapshot.reinforce && snapshot.reinforce.skill === reinforceSkill.label
        ? snapshot.reinforce.description
        : reinforceSkill.label + " es el área donde más conviene seguir practicando por ahora.",
      href: (snapshot.reinforce && snapshot.reinforce.href) || "leccion.html"
    } : null;

    return {
      name,
      title: "Progreso de " + name,
      sufficientEvidence: true,
      lowDataMessage: "",
      phrases: (snapshot.phrases || []).slice(),
      expressionsTotal: number(snapshot.expressionsMastered),
      metrics: [
        metric("days", "días de práctica", snapshot.week && snapshot.week.count, "", "calendar"),
        metric("exercises", "ejercicios", evidence.exercisesWeek, "", "target"),
        metric("expressions", "expresiones nuevas", evidence.newExpressionsWeek, "", "chat"),
        metric("accuracy", "de precisión", snapshot.accuracy, "%", "trend"),
        metric("minutes", "minutos", snapshot.minutesWeek, "", "clock")
      ],
      headline: trendMessage(name, history),
      consistency: { history, message: trendMessage(name, history) },
      contents: evidence.contents.slice(),
      strengths,
      strengthMessage: strengths.length ? strengths[0].label + " es la habilidad en la que " + name + " muestra mayor seguridad actualmente." : null,
      reinforce,
      evolution: { history, message: evolutionMessage(name, history) },
      recommendation: evidence.recommendation,
      classConnection: evidence.classConnection
    };
  }

  return { MIN_LESSONS, MIN_TREND_POINTS, build, measuredSkills, monotonic };
});
