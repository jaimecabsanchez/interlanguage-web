"""Genera web-publica/index-en.html a partir de index.html: misma estructura, textos en inglés (19-11-2026).
Uso (desde la raíz del repo):  python3 scripts/traduccion-en/build_en.py
- Traducciones: tm_clean.json (las de la versión inglesa anterior), pending.json + tr_pending.json (nuevas, en el mismo orden)
  y fixes.json (correcciones y textos añadidos después; mandan sobre las demás).
- Si al cambiar index.html aparece un texto nuevo, el script lo lista como «sin traducción»: añadidlo a fixes.json
  ({"texto en español": "English text"}) y volved a ejecutarlo. Los textos del cuestionario y del comparador
  están en js/extranjero.js (IL_TR), no aquí.
- El selector de idioma se copia de la index-en.html actual."""
import re, json, html
import os
D = os.path.dirname(os.path.abspath(__file__)) + '/'
ES = open('web-publica/index.html', encoding='utf-8').read()
OLD_EN = open('web-publica/index-en.html', encoding='utf-8').read()

tm = json.load(open(D + 'tm_clean.json', encoding='utf-8'))
pend = json.load(open(D + 'pending.json', encoding='utf-8'))
trp = json.load(open(D + 'tr_pending.json', encoding='utf-8'))
fix = json.load(open(D + 'fixes.json', encoding='utf-8')) if os.path.exists(D + 'fixes.json') else {}
TEXT, ATTRV = {}, {}
for k, v in tm.items():
    kind, es = k.split('\t', 1)
    (ATTRV if kind == 'attr' else TEXT)[es] = v
for o, en in zip(pend, trp):
    (ATTRV if o['kind'].startswith('attr') else TEXT)[o['s']] = en.strip()
for k, v in fix.items():          # correcciones finales: valen para texto y atributos
    TEXT[k] = v; ATTRV[k] = v

TR_ATTRS = ('alt', 'aria-label', 'title', 'placeholder', 'data-title', 'data-label-back', 'data-label-backto', 'data-label-extra',
            'data-label-send', 'data-label-call', 'data-err-req', 'data-err-fmt', 'aria-roledescription', 'data-advise-note')
META = ('description', 'og:title', 'og:description', 'og:image:alt', 'twitter:title', 'twitter:description')
TOK = re.compile(r'<!--.*?-->|<script\b.*?</script>|<style\b.*?</style>|<svg\b.*?</svg>|<[^>]+>|[^<]+', re.S)
ATTR = re.compile(r'(\s)([a-zA-Z:-]+)="([^"]*)"')
LETTER = re.compile(r'[A-Za-zÁÉÍÓÚáéíóúÑñüÜ¿¡]')
missing = []

def tr_text(t):
    s = html.unescape(t).strip()
    if not s or not LETTER.search(s): return t
    en = TEXT.get(s, ATTRV.get(s))
    if en is None: missing.append(s); return t
    lead = t[:len(t) - len(t.lstrip())]; trail = t[len(t.rstrip()):]
    return lead + html.escape(en, quote=False) + trail

def tr_tag(t):
    tag = re.match(r'<([a-zA-Z0-9-]+)', t)
    tag = tag.group(1).lower() if tag else ''
    is_meta = tag == 'meta' and re.search(r'(name|property)="(%s)"' % '|'.join(re.escape(m) for m in META), t)
    def sub(m):
        sp, name, val = m.groups()
        if name in TR_ATTRS or (name == 'content' and is_meta):
            v = html.unescape(val).strip()
            if v and LETTER.search(v):
                en = ATTRV.get(v, TEXT.get(v))
                if en is None: missing.append('@' + name + ': ' + v); return m.group(0)
                return '%s%s="%s"' % (sp, name, html.escape(en, quote=True))
        return m.group(0)
    return ATTR.sub(sub, t)

out = []
for t in TOK.findall(ES):
    if t.startswith('<!--') or t.startswith('<script') or t.startswith('<style') or t.startswith('<svg'):
        out.append(t)
    elif t.startswith('<'):
        out.append(tr_tag(t) if not t.startswith('</') else t)
    else:
        out.append(tr_text(t))
en = ''.join(out)

def rep(a, b, count=1):
    global en
    n = en.count(a)
    assert n >= 1, 'no encontrado: ' + a[:90]
    en = en.replace(a, b) if count == 0 else en.replace(a, b, count)

# cabecera
rep('<html lang="es">', '<html lang="en">')
rep('<link rel="canonical" href="https://interlanguage.es/">', '<link rel="canonical" href="https://interlanguage.es/index-en.html">')
rep('<meta property="og:url" content="https://interlanguage.es/">', '<meta property="og:url" content="https://interlanguage.es/index-en.html">')
rep('<meta property="og:locale" content="es_ES">', '<meta property="og:locale" content="en_GB">')
rep('"description": "Campamentos de verano, extraescolares, estudios en el extranjero y especialidades en inglés. 30 años de experiencia educativa en España."',
    '"description": "Summer camps, after-school English, study abroad and English specialities. 30 years of educational experience in Spain."')
rep('"inLanguage": "es-ES"', '"inLanguage": "en"')
# selector de idioma: las dos líneas de la versión inglesa
for cls in ('<div class="nav-lang"', '<div class="lang-switch"'):
    a = re.search(re.escape(cls) + r'.*?</div>', en).group(0)
    b = re.search(re.escape(cls) + r'.*?</div>', OLD_EN).group(0)
    rep(a, b)
# edades: «3–6 años» -> «Ages 3–6»
en, n = re.subn(r'(\d+–\d+) <small>years</small>', r'<small>Ages</small> \1', en)
assert n >= 3, n
# asuntos de los correos
rep('?subject=Ingl%C3%A9s%20extraescolar', '?subject=After-school%20English', 0)
rep('?subject=Estudiar%20en%20el%20extranjero', '?subject=Study%20abroad', 0)

open('web-publica/index-en.html', 'w', encoding='utf-8').write(en)
seen = []
for m in missing:
    if m not in seen: seen.append(m)
print('sin traducción:', len(seen))
for m in seen[:60]: print('  ', m[:140])
