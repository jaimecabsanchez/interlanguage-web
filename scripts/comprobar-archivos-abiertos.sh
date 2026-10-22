#!/bin/bash
# Comprueba qué archivos «internos» o típicos se pueden abrir desde internet en una web.
# Uso:  bash scripts/comprobar-archivos-abiertos.sh https://interlanguage.es
# Resultado: «abierto» (200) = se puede leer; «cerrado» (404/403) = no. Solo hace peticiones normales de lectura.
BASE="${1:-https://interlanguage.es}"
PATHS=(/AGENTS.md /agents.md /CLAUDE.md /README.md /.env /.env.local /.git/config /.git/HEAD /.DS_Store /netlify.toml /package.json /_headers /form-handler.php /images/nuevas/LEEME.txt /images/nuevas/extraescolares.png /js/reserva-llamada-demo.js /robots.txt /sitemap.xml)
printf "%-38s %-8s %s\n" "RUTA" "CÓDIGO" "ESTADO"
for p in "${PATHS[@]}"; do
  code=$(curl -s -o /tmp/chk.body -w "%{http_code}" -m 20 "$BASE$p")
  # Netlify devuelve la página 404 con código 404; si devolviera la portada con 200 («soft 404»), lo marcamos
  if [ "$code" = "200" ] && grep -qi "<title>Interlanguage Studies ·" /tmp/chk.body && [[ "$p" != "/robots.txt" && "$p" != "/sitemap.xml" ]]; then st="abierto? (devuelve la portada, revisar)"; 
  elif [ "$code" = "200" ]; then st="ABIERTO"; else st="cerrado"; fi
  printf "%-38s %-8s %s\n" "$p" "$code" "$st"
done
