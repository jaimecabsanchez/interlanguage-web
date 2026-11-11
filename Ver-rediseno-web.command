#!/bin/bash
# Doble clic para ver la web con los cambios del rediseño en este Mac (copia aislada: no toca tu proyecto principal ni publica nada).
cd "$(dirname "$0")"
PORT=8420
URL="http://127.0.0.1:$PORT/index.html"
if curl -s -o /dev/null "http://127.0.0.1:$PORT/index.html"; then
  echo "Interlanguage · el servidor ya estaba en marcha."
  [ -z "$NO_OPEN" ] && open "$URL?t=$(date +%s)"
  exit 0
fi
( sleep 1 && [ -z "$NO_OPEN" ] && open "$URL?t=$(date +%s)" ) &
echo "Interlanguage · rediseño de la web en marcha en $URL"
echo "  Maqueta de la dirección artística: http://127.0.0.1:$PORT/propuestas/index.html"
echo "  Programas y formulario (3 propuestas de cada): http://127.0.0.1:$PORT/propuestas/secciones.html"
echo "Deja esta ventana abierta mientras lo miras. Para cerrar: cierra esta ventana."
PREVIEW_MOTION=1 python3 .claude/preview-server.py $PORT
