#!/usr/bin/env python3
"""Servidor local SOLO para App Preview (no se publica ni se sube a git).

Sirve una carpeta estática con soporte de Range (necesario para <video> en WebKit),
sin caché (para ver cada cambio al recargar) y solo en 127.0.0.1.
Uso: python3 .claude/preview-server.py [puerto] [carpeta]
"""
import os, re, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8420
ROOT = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(__file__), '..', 'web-publica'))


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    # Solo para REVISAR animaciones: con PREVIEW_MOTION=1 el servidor sirve el CSS como si el sistema no tuviera «Reducir movimiento»
    # (el Mac de Jaime lo tiene activado y no vería nada). El código de la web no cambia: la web real sí respeta el ajuste.
    def do_GET(self):
        if os.environ.get('PREVIEW_MOTION') == '1' and self.path.split('?')[0].endswith('.css'):
            path = self.translate_path(self.path)
            if os.path.isfile(path):
                css = open(path, encoding='utf-8').read()
                css = re.sub(r'\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)', 'not all', css)
                css = re.sub(r'\(\s*prefers-reduced-motion\s*:\s*no-preference\s*\)', 'all', css)
                data = css.encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'text/css; charset=utf-8')
                self.send_header('Content-Length', str(len(data)))
                self.end_headers()
                self.wfile.write(data)
                return
        return super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def send_head(self):
        rng = self.headers.get('Range')
        path = self.translate_path(self.path)
        if not rng or not os.path.isfile(path):
            return super().send_head()
        m = re.match(r'bytes=(\d*)-(\d*)$', rng.strip())
        if not m:
            return super().send_head()
        size = os.path.getsize(path)
        a, b = m.groups()
        start = int(a) if a else max(0, size - int(b or 0))
        end = int(b) if (a and b) else size - 1
        if start >= size:
            self.send_error(416, 'Requested Range Not Satisfiable')
            return None
        end = min(end, size - 1)
        f = open(path, 'rb')
        f.seek(start)
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length', str(end - start + 1))
        self.end_headers()
        self._left = end - start + 1
        return f

    def copyfile(self, source, outputfile):
        left = getattr(self, '_left', None)
        if left is None:
            return super().copyfile(source, outputfile)
        try:
            while left > 0:
                chunk = source.read(min(65536, left))
                if not chunk:
                    break
                outputfile.write(chunk)
                left -= len(chunk)
        except (BrokenPipeError, ConnectionResetError):
            pass
        finally:
            self._left = None

    def log_message(self, fmt, *args):
        pass


if __name__ == '__main__':
    print(f'App Preview sirviendo {ROOT} en http://127.0.0.1:{PORT}', flush=True)
    ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
