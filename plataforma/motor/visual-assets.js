/* ============================================================
   Interlanguage · banco visual de actividades
   ------------------------------------------------------------
   Única fuente de ilustraciones pedagógicas. Los iconos de
   interfaz siguen perteneciendo a layout.js / il-visual.js.
   ============================================================ */
(function (root) {
  "use strict";

  const BASE = "assets/ejercicios/";
  const VISUALS = Object.freeze({
    "book": { src: BASE + "book.webp", label: "book" },
    "pencil": { src: BASE + "pencil.webp", label: "pencil" },
    "school-bag": { src: BASE + "school-bag.webp", label: "school bag" },
    "chair": { src: BASE + "chair.webp", label: "chair" },
    "have-breakfast": { src: BASE + "have-breakfast.webp", label: "have breakfast" },
    "take-a-shower": { src: BASE + "take-a-shower.webp", label: "take a shower" },
    "go-to-bed": { src: BASE + "go-to-bed.webp", label: "go to bed" },
    "go-to-school": { src: BASE + "go-to-school.webp", label: "go to school" },
    "apple": { src: BASE + "apple.webp", label: "apple" },
    "banana": { src: BASE + "banana.webp", label: "banana" },
    "milk": { src: BASE + "milk.webp", label: "milk" },
    "bread": { src: BASE + "bread.webp", label: "bread" },
    "cheese": { src: BASE + "cheese.webp", label: "cheese" },
    "egg": { src: BASE + "egg.webp", label: "egg" },
    "good-morning": { src: BASE + "good-morning.webp", label: "good morning" },
    "good-night": { src: BASE + "good-night.webp", label: "good night" },
    "goodbye": { src: BASE + "goodbye.webp", label: "goodbye" }
  });

  const ALIASES = Object.freeze({
    "schoolbag": "school-bag", "backpack": "school-bag", "school bag": "school-bag",
    "breakfast": "have-breakfast", "have breakfast": "have-breakfast",
    "shower": "take-a-shower", "take a shower": "take-a-shower",
    "bed": "go-to-bed", "go to bed": "go-to-bed",
    "go to school": "go-to-school",
    "buenos dias": "good-morning", "good morning": "good-morning",
    "buenas noches": "good-night", "good night": "good-night",
    "hasta luego": "goodbye", "see you": "goodbye", "goodbye": "goodbye"
  });

  const LEGACY_EMOJI = Object.freeze({
    "📘": "book", "✏️": "pencil", "🎒": "school-bag", "🪑": "chair",
    "🥣": "have-breakfast", "🚿": "take-a-shower", "🛏️": "go-to-bed",
    "🍎": "apple", "🍌": "banana", "🥛": "milk", "🍞": "bread",
    "🧀": "cheese", "🥚": "egg"
  });

  function normalise(value) {
    return String(value == null ? "" : value).toLowerCase().trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,!?¡¿;:]/g, "").replace(/[_\s]+/g, " ");
  }

  function resolveValue(value) {
    if (!value) return "";
    if (LEGACY_EMOJI[value]) return LEGACY_EMOJI[value];
    const clean = normalise(value);
    const hyphenated = clean.replace(/\s+/g, "-");
    if (VISUALS[hyphenated]) return hyphenated;
    return ALIASES[clean] || "";
  }

  function keyFor(input) {
    if (typeof input === "string") return resolveValue(input);
    input = input || {};
    return resolveValue(input.visual) || resolveValue(input.visualKey) ||
      resolveValue(input.emoji) || resolveValue(input.texto) || resolveValue(input.label);
  }

  function get(input) {
    const key = keyFor(input);
    return key && VISUALS[key] ? { key: key, src: VISUALS[key].src, label: VISUALS[key].label } : null;
  }

  function imageHTML(input, loading) {
    const asset = get(input);
    if (!asset) return "";
    return '<img src="' + asset.src + '" alt="" loading="' + (loading || "lazy") + '" decoding="async">';
  }

  function validateExercise(exercise) {
    exercise = exercise || {};
    const missing = [];
    if (exercise.tipo === "elegir_imagen") {
      (exercise.opciones || []).forEach((option, index) => {
        if (!get(option)) missing.push({ field: "opciones", index: index, value: option.visual || option.texto || option.emoji || "" });
      });
    }
    if (exercise.tipo === "emparejar" && exercise.presentacion === "visual") {
      (exercise.pares || []).forEach((pair, index) => {
        if (!get(pair.b)) missing.push({ field: "pares", index: index, value: pair.b || "" });
      });
    }
    return { valid: missing.length === 0, missing: missing };
  }

  const api = { all: VISUALS, aliases: ALIASES, legacyEmoji: LEGACY_EMOJI, normalise, keyFor, get, imageHTML, validateExercise };
  root.ILExerciseVisuals = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
