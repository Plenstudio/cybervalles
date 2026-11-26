"""Recalcula la política de contenido (CSP) de todas las páginas.

Uso (desde la carpeta del sitio):  python tools/update_csp.py

Cada página lleva una etiqueta <meta http-equiv="Content-Security-Policy"> que solo permite:
  - scripts propios y los scripts en línea que existan, identificados por su hash;
  - estilos propios y en línea; imágenes propias; sin fuentes ni librerías externas;
  - conexiones solo a este sitio y a api.web3forms.com (formulario);
  - solo en las páginas con formulario (clase h-captcha): scripts, iframe, estilos y
    conexiones de hcaptcha.com.
Si añades o cambias un <script> en línea, o añades una página, vuelve a ejecutar este script.
"""
import base64
import glob
import hashlib
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
META_RE = re.compile(r'[ \t]*<meta http-equiv="Content-Security-Policy"[^>]*>\r?\n')
HC = "https://hcaptcha.com https://*.hcaptcha.com"


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


def policy(hashes, captcha=False):
    hc = (" " + HC) if captcha else ""
    parts = [
        "default-src 'self'",
        "script-src 'self' " + " ".join(hashes) + hc if hashes else "script-src 'self'" + hc,
        "style-src 'self' 'unsafe-inline'" + hc,
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self' https://api.web3forms.com" + hc,
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
    ]
    if captcha:
        parts.insert(5, "frame-src " + HC)  # hCaptcha se muestra en un iframe
    return "; ".join(parts)


for path in sorted(glob.glob(os.path.join(ROOT, '*.html'))):
    with open(path, encoding='utf-8', newline='') as f:
        html = f.read()
    nl = '\r\n' if '\r\n' in html else '\n'
    html = META_RE.sub('', html)
    meta = '  <meta http-equiv="Content-Security-Policy" content="%s">%s' % (
        policy(inline_hashes(html), 'class="h-captcha"' in html), nl)
    m = re.search(r'<meta name="viewport"[^>]*>\r?\n', html)
    if not m:  # páginas con <head> en una sola línea
        m = re.search(r'<meta name="viewport"[^>]*>', html)
        assert m, path
        html = html[:m.end()] + nl + meta.rstrip('\r\n') + html[m.end():]
    else:
        html = html[:m.end()] + meta + html[m.end():]
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(html)
    print(os.path.basename(path), len(inline_hashes(html)), 'script(s) en linea')
