"""Recalcula la política de contenido (CSP) de todas las páginas.

Uso (desde la carpeta del sitio):  python tools/update_csp.py

Cada página lleva una etiqueta <meta http-equiv="Content-Security-Policy"> que solo permite:
  - scripts propios y los scripts en línea que existan, identificados por su hash;
  - estilos, imágenes y fuentes propios (sin estilos en línea);
  - ninguna conexión de red desde JavaScript, ningún iframe y ningún objeto;
  - fuerza HTTPS en todo recurso.
La web no carga nada de terceros. Si añades una página o un <script> en línea, vuelve a ejecutarlo.
"""
import base64
import glob
import hashlib
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
META_RE = re.compile(r'[ \t]*<meta http-equiv="Content-Security-Policy"[^>]*>\r?\n')
PAGES = ['*.html', 'servicios/*.html', 'en/*.html', 'en/services/*.html']


def inline_hashes(html):
    out = []
    for m in re.finditer(r'<script(?P<attrs>[^>]*)>(?P<body>.*?)</script>', html, re.S):
        attrs, body = m.group('attrs'), m.group('body')
        if 'src=' in attrs or 'application/ld+json' in attrs or not body.strip():
            continue
        text = body.replace('\r\n', '\n')
        digest = base64.b64encode(hashlib.sha256(text.encode('utf-8')).digest()).decode()
        out.append("'sha256-%s'" % digest)
    return out


def policy(hashes):
    return "; ".join([
        "default-src 'self'",
        "script-src 'self'" + ((" " + " ".join(hashes)) if hashes else ""),
        "style-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'none'",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
    ])


files = []
for pattern in PAGES:
    files += glob.glob(os.path.join(ROOT, *pattern.split('/')))
for path in sorted(files):
    with open(path, encoding='utf-8', newline='') as f:
        html = f.read()
    nl = '\r\n' if '\r\n' in html else '\n'
    html = META_RE.sub('', html)
    meta = '  <meta http-equiv="Content-Security-Policy" content="%s">%s' % (policy(inline_hashes(html)), nl)
    m = re.search(r'<meta name="viewport"[^>]*>\r?\n', html)
    if not m:  # páginas con <head> en una sola línea
        m = re.search(r'<meta name="viewport"[^>]*>', html)
        assert m, path
        html = html[:m.end()] + nl + meta.rstrip('\r\n') + html[m.end():]
    else:
        html = html[:m.end()] + meta + html[m.end():]
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(html)
    print(os.path.relpath(path, ROOT), len(inline_hashes(html)), 'script(s) en linea')
