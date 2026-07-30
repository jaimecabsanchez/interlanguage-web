/* ============================================================
   Interlanguage · Utilidades PURAS de autenticación
   Lógica sin red ni DOM -> fácil de testear (navegador + Node).
   La usa auth.js (con fallback), y su lógica se replica en la
   Edge Function (Deno). Ver tests: plataforma/auth-utils.test.js
   ============================================================ */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.IL_AUTH_UTILS = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const DEFAULT_DOMAIN = "alumnos.interlanguage-home.es";

  // ¿El identificador parece un email de adulto/admin?
  const looksLikeEmail = (s) => String(s == null ? "" : s).indexOf("@") !== -1;

  // Código de alumno -> email técnico interno (el alumno nunca lo ve)
  const usernameToEmail = (u, domain) =>
    String(u == null ? "" : u).trim().toLowerCase() + "@" + (domain || DEFAULT_DOMAIN);

  // Identificador de login -> email real (email directo, o código mapeado)
  const toLoginEmail = (id, domain) =>
    looksLikeEmail(id) ? String(id).trim().toLowerCase() : usernameToEmail(id, domain);

  // Contraseña temporal: 5 letras (sin l/o) + 3 dígitos (sin 0/1)
  const PW_LETTERS = "abcdefghijkmnpqrstuvwxyz";
  const PW_DIGITS = "23456789";
  function generatePassword() {
    const p = (set, n) => Array.from({ length: n }, () => set[Math.floor(Math.random() * set.length)]).join("");
    return p(PW_LETTERS, 5) + p(PW_DIGITS, 3);
  }

  // Código pseudónimo de alumno: adjetivo-animal-###  (p. ej. blue-fox-317)
  const ADJ = ["blue", "red", "green", "happy", "brave", "sunny", "tiny", "cool", "fast", "kind"];
  const NOUN = ["fox", "owl", "bear", "lion", "frog", "panda", "tiger", "koala", "otter", "robin"];
  function generateUsername() {
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    return pick(ADJ) + "-" + pick(NOUN) + "-" + Math.floor(100 + Math.random() * 900);
  }

  // Validación de contraseña nueva (mínimo del MVP: >= 8 caracteres)
  function validatePassword(p) {
    if (!p || String(p).length < 8) return { ok: false, error: "La contraseña debe tener al menos 8 caracteres." };
    return { ok: true };
  }

  return { DEFAULT_DOMAIN, looksLikeEmail, usernameToEmail, toLoginEmail, generatePassword, generateUsername, validatePassword };
});
