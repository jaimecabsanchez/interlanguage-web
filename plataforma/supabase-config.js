/* ============================================================
   CONFIGURACIÓN DE SUPABASE  ·  Interlanguage HOME
   ------------------------------------------------------------
   Mientras estos valores sean los de ejemplo ("TU-PROYECTO"...),
   la plataforma funciona en MODO DEMO (cuentas de prueba, sin
   guardar nada de verdad).

   Para activarlo de verdad, pega aquí los datos de tu proyecto
   Supabase (los encuentras en:  Project Settings → API):
     • url     = "Project URL"
     • anonKey = "anon public" key   (es pública, no pasa nada
                  porque esté aquí; NO pongas nunca la service_role)
   Consulta plataforma/SETUP.md para el paso a paso.
   ============================================================ */
window.IL_SUPABASE = {
  url:     "https://TU-PROYECTO.supabase.co",
  anonKey: "TU-ANON-KEY-PUBLICA",

  // Dominio técnico interno para el login por usuario.
  // Los alumnos NUNCA lo ven; solo escriben su nombre de usuario.
  // Puedes dejarlo tal cual.
  emailDomain: "alumnos.interlanguage-home.es"
};
