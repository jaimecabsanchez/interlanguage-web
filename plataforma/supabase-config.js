/* ============================================================
   CONFIGURACIÓN DE SUPABASE  ·  Interlanguage
   ------------------------------------------------------------
   Estos valores son PÚBLICOS (van en el navegador, protegidos por
   las reglas de seguridad por fila / RLS). NO pongas aquí NUNCA la
   clave secreta (sb_secret_…): esa vive solo en el servidor.

   Proyecto de DESARROLLO. Staging y producción usarán sus propios
   valores. Paso a paso en plataforma/SETUP.md
   ============================================================ */
window.IL_SUPABASE = {
  url:            "https://nawfcxhswlxlciulfidd.supabase.co",
  publishableKey: "sb_publishable_E593ZNBA8aSzo3j7s9zEQA_cYXLZXRj",

  // Dominio técnico interno para el login por código de alumno.
  // Los alumnos NUNCA lo ven; solo escriben su usuario (p. ej. blue-fox-317).
  emailDomain: "alumnos.interlanguage-home.es"
};
