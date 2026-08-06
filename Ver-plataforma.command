#!/bin/bash
# Doble clic para ver la plataforma Interlanguage en este Mac.
cd "$(dirname "$0")"
# Abre el navegador en el login (modo demo con datos de ejemplo)
( sleep 1 && open "http://localhost:8752/plataforma/index.html?demo=1" ) &
echo "Interlanguage · servidor en marcha."
echo "Deja esta ventana abierta mientras lo miras."
echo "Para cerrar: cierra esta ventana."
python3 -m http.server 8752
