"""Check every link on the Keyguard Designer's videos and documents pages, and in the
documents themselves, as a visitor would meet them.

    python scripts/wordpress/check-links.py

Written October 27 2026, when those pages were first made. What it opens, without
signing in, so a page only Ken can see counts as broken:
  - the videos page, every watch page it links, and every video, guide and PDF they
    link;
  - the documents page and every PDF it links;
  - inside every published PDF (the copies on the site, not the ones on this computer):
    every link, and every web address written as plain text, such as
    keyguard.volksswitch.org in the IT letter;
  - every "Video:" link in the Word User Manual: its words must be that video's title in
    course.json, so a renamed video can't keep its old name in the manual.

A link passes when it answers 200 at the address it names. One that redirects is
reported, because a redirect today is a "not found" the day the old address is retired.
mailto: links are listed, not opened. Exit code 1 if anything failed.
"""
import html.parser, io, json, os, re, sys, urllib.error, urllib.parse, urllib.request

import docx
import fitz
from docx.oxml.ns import qn

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
HERE = os.path.dirname(os.path.abspath(__file__))
PAGES = ['https://volksswitch.org/index.php/keyguard-designer-videos/',
         'https://volksswitch.org/index.php/keyguard-designer-documents/']
MANUAL = os.path.join(ROOT, 'Documents', 'Keyguard Designer User Manual.docx')
# A browser's identity: the host's firewall refuses Python's own (see wp.py).
BROWSER = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
TEXT_ADDRESS = re.compile(r'(?:https?://)?(?:[a-z0-9-]+\.)*volksswitch\.org(?:/[^\s)"”,;<>]*)?'
                          r'|https?://[^\s)"”,;<>]+', re.I)

results = {}          # url -> (ok, note)
where = {}            # url -> set of places it was found


def fetch(url, want_body):
    req = urllib.request.Request(url, headers={'User-Agent': BROWSER},
                                 method='GET' if want_body else 'HEAD')
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.status, r.geturl(), (r.read() if want_body else None), r.headers.get('Content-Type', '')


def same_address(a, b):
    """Equal apart from the case of the host name, a query, and a final slash."""
    a, b = urllib.parse.urlsplit(a), urllib.parse.urlsplit(b)
    return (a.scheme, a.netloc.lower(), a.path.rstrip('/')) == (b.scheme, b.netloc.lower(), b.path.rstrip('/'))


def check(url, found_in, want_body=False, as_text=False):
    where.setdefault(url, set()).add(found_in)
    if url in results and not want_body:
        return None
    if url.startswith('mailto:'):
        results[url] = (True, 'email address (not opened)')
        return None
    try:
        status, final, body, ctype = fetch(url, want_body)
    except urllib.error.HTTPError as e:
        if e.code == 405 and not want_body:           # some hosts refuse HEAD
            return check(url, found_in, True, as_text)
        results[url] = (False, f'{e.code} {e.reason}')
        return None
    except Exception as e:                            # noqa: BLE001
        results[url] = (False, f'could not open: {e}')
        return None
    # A redirect fails a link, but not an address merely written in a document, such as a
    # site name in a byline ("www.volksswitch.org" opens the same site at its own address).
    if not same_address(final, url) and not as_text:
        results[url] = (False, f'redirects to {final}')
    else:
        results[url] = (True, f'{status} {ctype.split(";")[0]}')
    return body


class Links(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.found = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'a' and a.get('href'):
            self.found.append(a['href'])
        if tag in ('video', 'source', 'img') and a.get('src'):
            self.found.append(a['src'])


def page_content(html_text):
    """The page's own content, without the theme's menus and footer."""
    m = re.search(r'<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>(.*?)<footer', html_text, re.S)
    return m.group(1) if m else html_text


def crawl_page(url, label):
    body = check(url, label, want_body=True)
    if body is None:
        return
    p = Links()
    p.feed(page_content(body.decode('utf-8', 'replace')))
    for link in p.found:
        link = urllib.parse.urljoin(url, link)
        if '/index.php/keyguard-designer-videos/video-' in link and urllib.parse.urlsplit(link).path not in crawled:
            crawled.add(urllib.parse.urlsplit(link).path)
            crawl_page(link.split('?')[0], 'watch page ' + link.split('/')[-2])
            check(link, label)
        elif link.lower().endswith('.pdf'):
            pdfs.setdefault(link, label)
            check(link, label)
        else:
            check(link, label)


def check_pdf(url, label):
    body = check(url, label, want_body=True)
    if body is None:
        return
    pdf = fitz.open(stream=io.BytesIO(body), filetype='pdf')
    name = url.rsplit('/', 1)[-1]
    for page in pdf:
        for link in page.get_links():
            if link.get('uri'):
                check(link['uri'], f'{name}, page {page.number + 1}')
        for addr in TEXT_ADDRESS.findall(page.get_text()):
            addr = addr.rstrip('.')
            if not addr.lower().startswith('http'):
                addr = 'https://' + addr
            check(addr, f'{name}, page {page.number + 1} (written as text)', as_text=True)


def check_manual_words():
    course = json.load(open(os.path.join(ROOT, 'scripts', 'video', 'course.json'), encoding='utf-8'))
    title = {i['num'].replace('.', '-'): i['title'] for g in course['groups'] for i in g['items']}
    doc = docx.Document(MANUAL)
    rels = doc.part.rels
    wrong = []
    for link in doc.element.body.iter(qn('w:hyperlink')):
        rid = link.get(qn('r:id'))
        if rid not in rels or not rels[rid].is_external:
            continue
        m = re.search(r'/video-(\d+-\d+)/', rels[rid].target_ref)
        if not m:
            continue
        words = ''.join(t.text or '' for t in link.iter(qn('w:t')))
        if title.get(m.group(1)) != words:
            wrong.append(f'"{words}" links video {m.group(1).replace("-", ".")}, '
                         f'whose title is "{title.get(m.group(1))}"')
    return wrong


crawled, pdfs = set(), {}
for url in PAGES:
    crawl_page(url, url.split('/')[-2] + ' page')
for url, label in list(pdfs.items()):
    check_pdf(url, label)
wrong_words = check_manual_words()

bad = {u: r for u, r in results.items() if not r[0]}
print(f'{len(results)} addresses checked: {len(results) - len(bad)} open, {len(bad)} failed.')
for u, (ok, note) in sorted(bad.items()):
    print(f'  FAILED  {u}  ({note})')
    for w in sorted(where[u]):
        print(f'          found in {w}')
for w in wrong_words:
    print('  WRONG TITLE  ' + w)
if not bad and not wrong_words:
    print('Every link opens, and every video link in the manual carries its video\'s title.')
sys.exit(1 if bad or wrong_words else 0)
