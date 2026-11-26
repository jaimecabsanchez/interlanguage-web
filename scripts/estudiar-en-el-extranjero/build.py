#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera las páginas estáticas de «Estudiar en el extranjero» (propuesta v2, 26-11-2026).

    python3 scripts/estudiar-en-el-extranjero/build.py              # vista previa (por defecto): noindex + formularios simulados
    python3 scripts/estudiar-en-el-extranjero/build.py --publicar   # versión para producción: sin noindex ni modo vista previa

Ejecútalo desde la raíz del repo, DESPUÉS de scripts/traduccion-en/build_en.py (lee index.html e index-en.html).

Rutas reales (carpetas con index.html, que Netlify sirve tal cual en /ruta/):
    web-publica/estudiar-en-el-extranjero/{,reino-unido/,irlanda/,canada/,estados-unidos/}index.html
    web-publica/en/study-abroad/{,united-kingdom/,ireland/,canada/,united-states/}index.html

Reutiliza de index.html / index-en.html la cabecera, el pie, los iconos, las tarjetas de destino, el comparador, el cuestionario
y el cierre (así no se duplican: si cambian allí, se regeneran aquí). El contenido nuevo está en contenido.py.
También retoca index.html e index-en.html: enlaces del menú, del pie y de la portada a las rutas nuevas y el script de rutas.
"""
import html
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from contenido import RUTAS, ORDEN, SITE, C, GENERAL as G, PAISES as P, PAIS_COMUN as PC  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
WP = os.path.join(ROOT, 'web-publica')
PREVIEW = '--publicar' not in sys.argv
CSS_V, JS_V = '1', '1'
SLUGS_ES = {'uk': 'reino-unido', 'ie': 'irlanda', 'ca': 'canada', 'us': 'estados-unidos'}


def tr(pair, L):
    return pair[0] if L == 'es' else pair[1]


def e(s):
    return html.escape(s, quote=True)


def read(p):
    return open(os.path.join(WP, p), encoding='utf-8').read()


def write(p, s):
    full = os.path.join(WP, p)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, 'w', encoding='utf-8').write(s)


def url(L, k=None):
    r = RUTAS[L]
    return r['base'] + (r[k] if k else '')


def balanced(src, start_pat):
    """Devuelve el elemento <div …> que empieza en start_pat, con sus div anidados."""
    i = src.index(start_pat)
    depth = 0
    for m in re.finditer(r'<div\b|</div>', src[i:]):
        depth += 1 if m.group() == '<div' else -1
        if depth == 0:
            return src[i:i + m.end()]
    raise ValueError(start_pat)


def ver(src, name):
    m = re.search(re.escape(name) + r'\?v=(\d+)', src)
    return m.group(1) if m else '1'


# ---------------------------------------------------------------- piezas de index.html / index-en.html
class Piezas:
    def __init__(self, L):
        self.L = L
        src = read('index.html' if L == 'es' else 'index-en.html')
        self.src = src
        self.v = {n: ver(src, n) for n in ['css/styles.css', 'css/motion.css', 'css/extranjero.css', 'css/recorridos.css', 'js/main.js', 'js/extranjero.js']}
        self.header = re.search(r'<header class="site">.*?</header>', src, re.S).group(0)
        self.footer = re.search(r'<footer>.*?</footer>', src, re.S).group(0)
        self.sprite = re.search(r'<svg class="x2-sprite".*?</svg>', src, re.S).group(0)
        self.dgrid = re.search(r'<div class="dgrid">.*?</div>', src, re.S).group(0)
        cmp = balanced(src, '<div class="cmp" id="ext-cmp">')
        cmp = re.sub(r'\s*<div class="cmp-faq">.*?</div>', '', cmp, flags=re.S)        # sus dudas pasan a las preguntas frecuentes
        cmp = re.sub(r'\s*<!-- COMPARADOR.*?-->', '', cmp, flags=re.S)
        self.cmp = cmp
        self.quiz = re.search(r'<section class="sec qz-sec rx-sec" id="ext-encaje".*?</section>', src, re.S).group(0)
        self.xcta = re.search(r'<section class="xcta".*?</section>', src, re.S).group(0)


def fix_links(s, L, local_ids, lang_href):
    """Enlaces de la cabecera, el pie y las piezas reutilizadas, para una página que no es la portada."""
    home = RUTAS[L]['home']
    slug_from_es = {v: k for k, v in SLUGS_ES.items()}

    def href(m):
        h = m.group(1)
        mm = re.match(r'#servicio-extranjero(?:-([a-z-]+))?$', h)
        if mm:
            k = slug_from_es.get(mm.group(1)) if mm.group(1) else None
            return 'href="%s"' % url(L, k)
        if h in ('#inicio', '#'):
            return 'href="%s"' % home
        if h == '#contacto':
            return 'href="#ext-encaje"'
        if h.startswith('#'):
            return 'href="%s"' % (h if h[1:] in local_ids else home + h)
        return m.group(0)
    s = re.sub(r'href="(#[^"]*)"', href, s)
    s = re.sub(r'\s(?:data-jump-service|data-jump-to|data-back|data-advise|data-destino|data-advise-note)(?:="[^"]*")?', '', s)
    s = re.sub(r'(?<![/\w.-])(images|css|js|fonts)/', r'/\1/', s)               # rutas relativas → absolutas (las páginas viven en carpetas)
    s = re.sub(r'href="(legal\.html|llamada\.html|index-en\.html|index\.html)', r'href="/\1', s)
    other = 'en' if L == 'es' else 'es'
    s = re.sub(r'href="[^"]*" hreflang="%s"' % other, 'href="%s" hreflang="%s"' % (lang_href, other), s)
    return s


# ---------------------------------------------------------------- plantilla común
def head(L, pz, title, desc, canon_es, canon_en):
    canon = canon_es if L == 'es' else canon_en
    robots = '<meta name="robots" content="noindex, nofollow">\n<meta name="il-preview" content="1">\n' if PREVIEW else ''
    v = pz.v
    return f'''<!DOCTYPE html>
<html lang="{L}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
{robots}<meta name="il-llamadas-endpoint" content="">
<meta name="il-llamadas-enlace" content="">
<link rel="canonical" href="{SITE}{canon}">
<link rel="alternate" hreflang="es" href="{SITE}{canon_es}">
<link rel="alternate" hreflang="en" href="{SITE}{canon_en}">
<link rel="alternate" hreflang="x-default" href="{SITE}{canon_es}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Interlanguage Studies">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{SITE}{canon}">
<meta property="og:image" content="{SITE}/images/og-image.jpg">
<meta property="og:locale" content="{'es_ES' if L == 'es' else 'en_GB'}">
<link rel="icon" type="image/png" sizes="32x32" href="/images/icons/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/images/icons/favicon-180.png">
<meta name="theme-color" content="#FFFFFF">
<script src="/js/rutas.js?v={JS_V}"></script>
<link rel="preload" href="/fonts/newsreader-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/plus-jakarta-sans-wght-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/styles.css?v={v['css/styles.css']}">
<link rel="stylesheet" href="/css/motion.css?v={v['css/motion.css']}">
<link rel="stylesheet" href="/css/extranjero.css?v={v['css/extranjero.css']}">
<link rel="stylesheet" href="/css/recorridos.css?v={v['css/recorridos.css']}">
<link rel="stylesheet" href="/css/estudiar.css?v={CSS_V}">
'''


def breadcrumb_ld(items):
    li = ',\n'.join('    {"@type": "ListItem", "position": %d, "name": "%s", "item": "%s%s"}' % (i + 1, n, SITE, u) for i, (n, u) in enumerate(items))
    return '<script type="application/ld+json">\n{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [\n' + li + '\n]}\n</script>\n'


def crumbs(L, items):
    out = []
    for i, (n, u) in enumerate(items):
        out.append('<li><a href="%s">%s</a></li>' % (u, e(n)) if i < len(items) - 1 else '<li aria-current="page">%s</li>' % e(n))
    return '<nav class="pg-crumbs" aria-label="%s"><ol>%s</ol></nav>' % ('Ruta' if L == 'es' else 'Breadcrumb', ''.join(out))


def picture(name, widths, alt, sizes, cls='', eager=False, pos=''):
    widths = [w for w in widths if os.path.exists(os.path.join(WP, 'images/internacional/%s-%d.webp' % (name, w)))] or widths   # solo los tamaños que existen
    ss = lambda ext: ', '.join('/images/internacional/%s-%d.%s %dw' % (name, w, ext, w) for w in widths)
    avif = all(os.path.exists(os.path.join(WP, 'images/internacional/%s-%d.avif' % (name, w))) for w in widths)
    mid = widths[min(1, len(widths) - 1)]
    st = ' style="object-position:%s"' % pos if pos else ''
    return ('<picture%s>' % (' class="%s"' % cls if cls else '') +
            ('<source type="image/avif" srcset="%s" sizes="%s">' % (ss('avif'), sizes) if avif else '') +
            '<source type="image/webp" srcset="%s" sizes="%s">' % (ss('webp'), sizes) +
            '<img src="/images/internacional/%s-%d.webp" alt="%s" loading="%s" decoding="async"%s></picture>' % (name, mid, e(alt), 'eager' if eager else 'lazy', st))


def page(L, pz, body, title, desc, canon_es, canon_en, ld, destino=''):
    lang_href = canon_en if L == 'es' else canon_es
    local = set(re.findall(r'id="([^"]+)"', body))
    hdr = fix_links(pz.header, L, local, lang_href)
    hdr = re.sub(r'(<a href="%s")' % re.escape(url(L)), r'\1 aria-current="page"', hdr, count=1)
    ftr = fix_links(pz.footer, L, local, lang_href)
    v = pz.v
    skip = 'Saltar al contenido' if L == 'es' else 'Skip to content'
    return (head(L, pz, title, desc, canon_es, canon_en) + ld + '</head>\n' +
            '<body class="pg-ext"%s>\n<a class="skip-link" href="#main">%s</a>\n' % (' data-destino="%s"' % destino if destino else '', skip) +
            hdr + '\n<main id="main" tabindex="-1">\n<div id="view-service-extranjero" class="pg">\n' + pz.sprite + '\n' + body +
            '\n</div>\n</main>\n' + ftr + '\n' +
            '<script src="/js/main.js?v=%s" defer></script>\n<script src="/js/extranjero.js?v=%s" defer></script>\n<script src="/js/estudiar.js?v=%s" defer></script>\n</body>\n</html>\n'
            % (v['js/main.js'], v['js/extranjero.js'], JS_V))


ARROW = '<svg class="ic" aria-hidden="true"><use href="#x2-i-arrow"/></svg>'


def quiz_block(L, pz, extra_note=True):
    q = fix_links(pz.quiz, L, {'ext-encaje', 'ext-dudas'}, '')
    if extra_note:
        q = q.replace('<p class="qz-mail">', '<p class="qz-human qz-first">%s</p>\n    <p class="qz-mail">' % e(tr(G['qz_after'], L)), 1)
    return q


def faq_list(items, L):
    out = []
    for it in items:
        q, a = it[0], it[1]
        extra = ''
        if len(it) > 2:
            extra = ' <a class="txt-link" href="%s" target="_blank" rel="noopener">%s</a>' % (it[2], 'Información oficial del Ministerio' if L == 'es' else 'Official information (Spanish Ministry of Education)')
        out.append('<details class="camp-faq-item"><summary>%s</summary><p>%s%s</p></details>' % (e(tr(q, L)), e(tr(a, L)), extra))
    return '\n      '.join(out)


# ---------------------------------------------------------------- página general
def general(L, pz):
    T = lambda k: tr(G[k], L)
    cr = [(tr(C['inicio'], L), RUTAS[L]['home']), (tr(C['seccion'], L), url(L))]
    # destinos: «Ver destino» → «Descubrir Reino Unido», enlazando a la página del país
    dg = fix_links(pz.dgrid, L, set(), '')
    names = {k: tr(P[k]['n'], L) for k in P}
    for k in ORDEN:
        pat = re.compile(r'(<a class="dcard" href="%s"[^>]*>.*?<span class="dcard-go">)[^<]*' % re.escape(url(L, k)), re.S)
        dg = pat.sub(lambda m: m.group(1) + '%s %s ' % (tr(C['descubrir'], L), names[k]), dg, count=1)
    dg = re.sub(r' data-video="[^"]*"', lambda m: m.group(0).replace('data-video="', 'data-video="/') if '/images' not in m.group(0) else m.group(0), dg)
    cmp = fix_links(pz.cmp, L, {'ext-encaje'}, '')
    creds_ic = ['x2-i-cap', 'x2-i-globe', 'x2-i-compass', 'x2-i-check']
    creds = ''.join('<li><svg class="ic" aria-hidden="true"><use href="#%s"/></svg><div><b>%s</b></div></li>' % (creds_ic[i], e(tr(c, L))) for i, c in enumerate(G['creds']))
    toc = ''.join('<li><a href="#%s">%s</a></li>' % (i, e(tr(n, L))) for i, n in G['toc'])
    benef = ''.join('<li><b>%s</b><span>%s</span></li>' % (e(tr(a, L)), e(tr(b, L))) for a, b in G['beneficios'])
    gal = ''
    for i, (img, ws, alt, lab) in enumerate(G['galeria']):
        gal += '<figure class="mz-it mz-%d">%s<figcaption>%s</figcaption></figure>' % (i + 1, picture(img, ws, tr(alt, L), '(min-width:1000px) 40vw, 50vw'), e(tr(lab, L)))
    mods = ''.join('<div class="md-col"><h3>%s</h3><ul>%s</ul></div>' % (e(tr(t, L)), ''.join('<li>%s</li>' % e(tr(x, L)) for x in li)) for t, li in G['modalidades'])
    fases = ''.join('<li><b>%s</b><span>%s</span></li>' % (e(tr(a, L)), e(tr(b, L))) for a, b in G['fases'])
    etapas = ''.join('<div class="ac-col"><h4>%s</h4><ul>%s</ul></div>' % (e(tr(t, L)), ''.join('<li>%s</li>' % e(tr(x, L)) for x in li)) for t, li in G['etapas'])
    caras = ''.join('<figure><img src="/images/equipo/%s-320.webp" srcset="/images/equipo/%s-160.webp 160w, /images/equipo/%s-320.webp 320w" sizes="112px" width="112" height="112" alt="%s" loading="lazy" decoding="async"><figcaption>%s</figcaption></figure>' % (f, f, f, n, n) for f, n in G['equipo'])
    body = f'''
<div class="x2">
<section class="hx pg-hx" aria-labelledby="ext-h1">
  <div class="hx-in">
    <div class="hx-copy">
      {crumbs(L, cr)}
      <span class="eyebrow">{e(T('eyebrow'))}</span>
      <h1 id="ext-h1" tabindex="-1">{e(T('h1'))}</h1>
      <p class="hx-lead">{e(T('lead'))}</p>
      <div class="hx-acts pg-acts">
        <a class="btn-primary hx-cta" href="#ext-encaje" data-cta="ext-hero">{e(tr(C['hablemos'], L))} {ARROW}</a>
        <a class="btn-outline pg-btn2" href="#ext-destinos">{e(tr(C['explorar'], L))}</a>
      </div>
      <p class="pg-facts">{e(T('facts'))}</p>
    </div>
    <div class="hx-photo">{picture('ext-hero-colegio-luz', [960, 1280, 1672], tr(('Fachada de un colegio británico a la luz de la tarde', 'A British school building in the afternoon light'), L), '(min-width:1000px) 55vw, 100vw', eager=True)}</div>
  </div>
  <div class="hx-facts pg-creds"><div class="wrap"><ul>{creds}</ul><p class="pg-creds-note">{e(T('creds_note'))}</p></div></div>
</section>
</div>

<nav class="ext-toc" aria-label="{'En esta página' if L == 'es' else 'On this page'}">
  <div class="container ext-toc-in">
    <span class="ext-toc-t" aria-hidden="true">{'En esta página' if L == 'es' else 'On this page'}</span>
    <ul class="ext-toc-list">{toc}</ul>
  </div>
</nav>

<div class="x2">
<section class="sec" id="ext-destinos" aria-labelledby="ext-destinos-t">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">{'Destinos' if L == 'es' else 'Destinations'}</span><h2 id="ext-destinos-t">{'¿Dónde podría estudiar?' if L == 'es' else 'Where could they study?'}</h2><p>{'Cuatro destinos con colegios muy distintos. Descubrid cada uno o comparad dos de ellos.' if L == 'es' else 'Four destinations with very different schools. Discover each one or compare two of them.'}</p></div>
    {dg}
    {cmp}
  </div>
</section>

<section class="sec sec--ivory" id="ext-vida" aria-labelledby="ext-vida-t">
  <div class="wrap">
    <div class="pg-split">
      <div class="sec-head"><span class="eyebrow">{e(T('vida_eb'))}</span><h2 id="ext-vida-t">{e(T('vida_h2'))}</h2><p>{e(T('vida_p'))}</p></div>
      <ul class="pg-benef">{benef}</ul>
    </div>
    <div class="mz">{gal}</div>
    <p class="note pg-note">{e(tr(C['fotos_nota'], L))}</p>
  </div>
</section>

<section class="sec" id="ext-modalidad" aria-labelledby="ext-modalidad-t">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">{e(T('mod_eb'))}</span><h2 id="ext-modalidad-t">{e(T('mod_h2'))}</h2></div>
    <div class="md">{mods}</div>
    <p class="pg-note2">{e(T('mod_note'))}</p>
  </div>
</section>

<section class="sec sec--ivory" id="ext-metodo" aria-labelledby="ext-metodo-t">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">{e(T('met_eb'))}</span><h2 id="ext-metodo-t">{e(T('met_h2'))}</h2></div>
    <ol class="mt">{fases}</ol>
    <div class="ac" aria-labelledby="ext-acomp-t">
      <h3 id="ext-acomp-t">{e(T('acomp_h3'))}</h3>
      <div class="ac-cols">{etapas}</div>
      <p class="ac-note">{e(T('acomp_note'))}</p>
    </div>
  </div>
</section>

{quiz_block(L, pz)}

<section class="sec" id="ext-equipo" aria-labelledby="ext-equipo-t">
  <div class="wrap eq">
    <div class="eq-faces">{caras}</div>
    <div class="eq-copy">
      <span class="eyebrow">{e(T('eq_eb'))}</span>
      <h2 id="ext-equipo-t">{e(T('eq_h2'))}</h2>
      <p>{e(T('eq_p'))}</p>
      <a class="link" href="{RUTAS[L]['home']}#servicio-metodologia">{e(T('eq_link'))}</a>
    </div>
  </div>
</section>

<section class="sec sec--ivory" id="ext-dudas" aria-labelledby="ext-faq-t">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">{e(T('faq_eb'))}</span><h2 id="ext-faq-t">{e(T('faq_h2'))}</h2></div>
    <div class="camp-faq ext-faq ext-faq--2">
      {faq_list(G['faq'], L)}
    </div>
  </div>
</section>

{fix_links(pz.xcta, L, {'ext-encaje'}, '')}
</div>
'''
    ld = breadcrumb_ld(cr)
    return page(L, pz, body, T('title'), T('desc'), url('es'), url('en'), ld)


# ---------------------------------------------------------------- páginas de país
def pais(L, pz, k):
    d = P[k]
    T = lambda key: tr(d[key], L)
    U = lambda key: tr(PC[key], L)
    n = T('n')
    cr = [(tr(C['inicio'], L), RUTAS[L]['home']), (tr(C['seccion'], L), url(L)), (n, url(L, k))]
    hechos = ''.join('<div><dt>%s</dt><dd>%s</dd></div>' % (e(tr(a, L)), e(tr(b, L))) for a, b in d['hechos'])
    porque = ''.join('<li>%s</li>' % e(tr(x, L)) for x in d['porque'])
    fotos = ''.join('<figure>%s</figure>' % picture(img, ws, tr(alt, L), '(min-width:1000px) 26vw, 50vw') for img, ws, alt in d['fotos'])
    sistema = ''.join('<div><dt>%s</dt><dd>%s</dd></div>' % (e(tr(a, L)), e(tr(b, L))) for a, b in d['sistema'])
    zonas = ''.join('<li><b>%s</b><span>%s</span></li>' % (e(tr(a, L)), e(tr(b, L))) for a, b in d['zonas'])
    considera = ''.join('<div><dt>%s</dt><dd>%s</dd></div>' % (e(tr(a, L)), e(tr(b, L))) for a, b in d['considera'])
    fuentes = ' · '.join('<a href="%s" target="_blank" rel="noopener">%s</a>' % (u, e(t)) for t, u in d['fuentes'])
    tz = '<p class="note">%s</p>' % e(U('tz_nota')) if k in ('ca', 'us') else ''
    otros = ''.join('<a class="po-card" href="%s" style="--pc:var(--cx-%s)">%s<span><b>%s</b><small>%s</small><em>%s %s %s</em></span></a>' % (
        url(L, o), o, picture(P[o]['hero'], [480, 720], tr(P[o]['hero_alt'], L), '(min-width:900px) 30vw, 100vw'), e(tr(P[o]['n'], L)), e(tr(P[o]['tag'], L)), e(tr(C['descubrir'], L)), e(tr(P[o]['n'], L)), ARROW)
        for o in ORDEN if o != k)
    body = f'''
<div class="x2 pc pc--{k}" style="--pc:var(--cx-{k}); --pc-bg:var(--cx-{k}-bg)">
<section class="pc-hero" aria-labelledby="ext-h1">
  <div class="wrap pc-hero-in">
    <div class="pc-hero-copy">
      {crumbs(L, cr)}
      <span class="eyebrow">{e(tr(C['seccion'], L))}</span>
      <h1 id="ext-h1" tabindex="-1">{e(T('h1'))}</h1>
      <p class="pc-tag">{e(T('tag'))}</p>
      <p class="pc-lead">{e(T('lead'))}</p>
      <div class="pg-acts">
        <a class="btn-primary hx-cta" href="#ext-encaje" data-cta="pais-{SLUGS_ES[k]}-hero">{e(tr(C['hablemos'], L))} {ARROW}</a>
        <a class="btn-outline pg-btn2" href="{url(L)}#ext-cmp">{e(tr(C['comparar'], L))}</a>
      </div>
    </div>
    <div class="pc-hero-photo">{picture(d['hero'], [720, 960, 1122], T('hero_alt'), '(min-width:1000px) 50vw, 100vw', eager=True)}</div>
  </div>
  <div class="wrap"><dl class="pc-facts">{hechos}</dl>{tz}</div>
</section>

<section class="sec" id="pc-porque" aria-labelledby="pc-porque-t">
  <div class="wrap pc-two">
    <div>
      <h2 id="pc-porque-t">{e(T('porque_h2'))}</h2>
      <ul class="pc-list">{porque}</ul>
      <h3>{e(U('talentos_h3'))}</h3>
      <p>{e(T('talentos'))}</p>
    </div>
    <div class="pc-fotos">{fotos}<p class="note">{e(tr(C['fotos_nota'], L))}</p></div>
  </div>
</section>

<section class="sec sec--ivory" id="pc-sistema" aria-labelledby="pc-sistema-t">
  <div class="wrap">
    <div class="sec-head"><h2 id="pc-sistema-t">{e(T('sistema_h2'))}</h2></div>
    <dl class="pc-dl">{sistema}</dl>
    <div class="pc-dur"><h3>{e(U('duracion_h3'))}</h3><p>{e(T('duracion'))} <a class="txt-link" href="{url(L)}#ext-modalidad">{'Comparar trimestre y curso' if L == 'es' else 'Compare a term and a full year'}</a></p></div>
  </div>
</section>

<section class="sec" id="pc-vida" aria-labelledby="pc-vida-t">
  <div class="wrap pc-two">
    <div>
      <h2 id="pc-vida-t">{e(T('vida_h2'))}</h2>
      <p>{e(T('vida'))}</p>
      <div class="pc-fit"><h3>{e(U('encaja_h2'))}</h3><p>{e(T('encaja'))}</p></div>
    </div>
    <div>
      <h3>{e(U('zonas_h3'))}</h3>
      <ul class="pc-zonas">{zonas}</ul>
      <p class="note">{e(U('zonas_nota'))}</p>
    </div>
  </div>
</section>

<section class="sec sec--ivory" id="pc-considera" aria-labelledby="pc-considera-t">
  <div class="wrap pc-two">
    <div>
      <h2 id="pc-considera-t">{e(U('considera_h2'))}</h2>
      <dl class="pc-dl pc-dl--sm">{considera}<div><dt>{'Convalidación' if L == 'es' else 'Recognition in Spain'}</dt><dd>{e(U('regreso'))}</dd></div></dl>
      <p class="note pc-src">{e(U('fuentes_h'))}: {fuentes}</p>
    </div>
    <div class="pc-acomp">
      <h2>{e(U('acomp_h2'))}</h2>
      <p>{e(U('acomp_p'))}</p>
      <a class="link" href="{url(L)}#ext-metodo">{e(U('acomp_link'))}</a>
    </div>
  </div>
</section>

<section class="sec" id="ext-dudas" aria-labelledby="pc-faq-t">
  <div class="wrap">
    <div class="sec-head"><h2 id="pc-faq-t">{e(U('faq_h2'))} {e(n)}</h2></div>
    <div class="camp-faq ext-faq">
      {faq_list(d['faq'], L)}
    </div>
    <p class="pc-more"><a class="link" href="{url(L)}#ext-dudas">{e(U('faq_link'))}</a></p>
  </div>
</section>

{quiz_block(L, pz)}

<section class="sec sec--ivory" id="pc-otros" aria-labelledby="pc-otros-t">
  <div class="wrap">
    <div class="pc-otros-head"><h2 id="pc-otros-t">{e(U('otros_h2'))}</h2><a class="link" href="{url(L)}#ext-cmp">{e(U('otros_cmp'))}</a></div>
    <div class="po">{otros}</div>
  </div>
</section>
</div>
'''
    ld = breadcrumb_ld(cr)
    return page(L, pz, body, T('title'), T('desc'), url('es', k), url('en', k), ld, destino=k)


# ---------------------------------------------------------------- retoques de index.html / index-en.html
def patch_index(fname, L):
    s = read(fname)
    slug_from_es = {v: kk for kk, v in SLUGS_ES.items()}

    def rep(m):
        k = slug_from_es.get(m.group(1)) if m.group(1) else None
        to = m.group(2)
        return 'href="%s%s"' % (url(L, k), ('#' + to) if to else '')
    # enlaces con data-jump-service a «Estudiar en el extranjero» (menú, pie, destinos y tarjetas de la portada) → rutas reales
    s = re.sub(r'href="#servicio-extranjero(?:-([a-z-]+))?" data-jump-service="extranjero(?:-[a-z-]+)?"(?: data-jump-to="([^"]*)")?', rep, s)
    if L == 'en':   # build_en.py copia las rutas en español: se pasan a las inglesas
        for kk in ['uk', 'ie', 'ca', 'us']:
            s = s.replace('href="%s' % url('es', kk), 'href="%s' % url('en', kk))
        s = s.replace('href="%s' % url('es'), 'href="%s' % url('en'))
    rutas = '<meta name="il-rutas" content="1">\n<script src="js/rutas.js?v=%s"></script>\n' % JS_V
    prev = '<meta name="robots" content="noindex, nofollow">\n<meta name="il-preview" content="1">\n'
    s = re.sub(r'<meta name="robots" content="noindex, nofollow">\n<meta name="il-preview" content="1">\n', '', s)
    if 'name="il-rutas"' not in s:
        s = s.replace('<link rel="preload" href="fonts/', rutas + '<link rel="preload" href="fonts/', 1)
    if PREVIEW:
        s = s.replace('<meta name="il-rutas" content="1">\n', prev + '<meta name="il-rutas" content="1">\n', 1)
    write(fname, s)


def main():
    patch_index('index.html', 'es')
    patch_index('index-en.html', 'en')
    for L in ('es', 'en'):
        pz = Piezas(L)
        r = RUTAS[L]['base'].strip('/')
        write(r + '/index.html', general(L, pz))
        for k in ORDEN:
            write(r + '/' + RUTAS[L][k] + 'index.html', pais(L, pz, k))
    print('Hecho:', 'VISTA PREVIA (noindex, formularios simulados)' if PREVIEW else 'PUBLICACIÓN')


if __name__ == '__main__':
    main()
