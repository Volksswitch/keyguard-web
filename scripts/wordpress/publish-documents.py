"""Publish the Keyguard Designer's documents to volksswitch.org.

    python scripts/wordpress/publish-documents.py            # show what would change
    python scripts/wordpress/publish-documents.py --apply    # do it
    python scripts/wordpress/publish-documents.py --apply --force   # ignore the dates
    python scripts/wordpress/publish-documents.py --apply --force --only "User Manual"
                                    # only documents whose file name contains the text

Adapted from Conversant AAC's publish-documents.py (Ken, October 27 2026). For every
document in documents.json whose "Last updated" date differs from the one already
published (or that has never been published): export a fresh PDF through Word, upload it
into the media folder "Customizable, 3D Printable Keyguard > Web App > Documents", and
point the page at it. Then rebuild the page's two-column table (name linked to its PDF,
date as it appears in the document's byline) and save the page if it changed. The page
is made, public, the first time.

WHY CHANGE-DETECTION IS BY THE BYLINE DATE. An unchanged date means an unchanged
document, so re-uploading everything each time would only leave a new copy of every PDF
in the media library and change every link. ⚠ The date cannot see a second change on
the same day: use --force for that.

THE SECURITY OVERVIEW IS KEN'S. He converts SECURITY.docx to PDF and replaces the file in
WordPress in place, because a new upload would get a new address and break the links to
it (CLAUDE.md). It is listed with 'external': its date is read from the live PDF, and
nothing here uploads it.

A FORM IS FILLED IN ON THE COMPUTER (Ken, 30 Oct 2026: "Fillable PDF and Word"). A
document listed with "fillable": true has typing boxes and checkboxes added to its PDF
(doc-generators/fillable_form.py) before it is uploaded, and one with "word": true has its
.docx uploaded too, linked as "Word" beside the PDF; its address is kept as wordMediaId and
wordUrl. The Keyguard Data Form is both.

WHY OLD PDFS ARE NOT DELETED. Deleting media is permanent. Replaced files are listed at
the end so Ken can delete them in WordPress.

ORDER: every upload first, the page once at the end, the local list after each upload.
"""
import datetime, html, io, json, os, re, subprocess, sys, time, urllib.request

import docx
import fitz

from wp import ROOT, UA, call, media_folder, upload

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'doc-generators'))
from fillable_form import make_fillable  # noqa: E402

DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

LIST = os.path.join(os.path.dirname(__file__), 'documents.json')
DOCS = os.path.join(ROOT, 'Documents')
WEB_APP_FOLDER = 100            # "Customizable, 3D Printable Keyguard > Web App"
PAGE_URL = 'https://volksswitch.org/index.php/keyguard-designer-documents/'
MONTHS = {m: n for n, m in enumerate(('January February March April May June July August September '
                                      'October November December').split(), 1)}
BYLINE = re.compile(r'Last updated:?\s+(?:([A-Z][a-z]+) (\d{1,2}), (\d{4})|(\d{4})-(\d{2})-(\d{2}))')


def date_in(text):
    m = BYLINE.search(text)
    if not m:
        return None
    if m.group(1):
        return datetime.date(int(m.group(3)), MONTHS[m.group(1)], int(m.group(2)))
    return datetime.date(int(m.group(4)), int(m.group(5)), int(m.group(6)))


def byline_date(path):
    return date_in('\n'.join(p.text for p in docx.Document(path).paragraphs[:12]))


def live_pdf_date(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        pdf = fitz.open(stream=io.BytesIO(r.read()), filetype='pdf')
    return date_in(pdf[0].get_text())


def long_date(d):
    return f'{d:%B} {d.day}, {d.year}'


def pdf_name(docx_name):
    stem = os.path.splitext(docx_name)[0]
    return re.sub(r'-+', '-', re.sub(r'[^A-Za-z0-9]+', '-', stem)).strip('-') + '.pdf'


# ⚠ A FRESH WORD PER DOCUMENT, opened read-only (Conversant's export-pdf.ps1, which
# found that a shared instance disconnects part way through a batch). And a time limit:
# on October 27 2026 a Word export here never returned, so a stalled export is stopped -
# only the Word this started, never one Ken has open - and reported as a failure.
EXPORT = r'''
$w = New-Object -ComObject Word.Application
$w.Visible = $false; $w.DisplayAlerts = 0
try {
  $d = $w.Documents.Open($env:KG_DOC, [ref]$false, [ref]$true)
  $d.ExportAsFixedFormat($env:KG_PDF, 17)
  $d.Close([ref]$false)
} finally { $w.Quit() }
'''


def export_pdf(path):
    pdf = os.path.splitext(path)[0] + '.pdf'
    started = time.time()
    env = dict(os.environ, KG_DOC=path, KG_PDF=pdf)
    try:
        subprocess.run(['powershell', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', EXPORT],
                       env=env, timeout=240, check=True, capture_output=True)
    except (subprocess.TimeoutExpired, subprocess.CalledProcessError) as exc:
        subprocess.run(['powershell', '-NoProfile', '-Command',
                        "Get-CimInstance Win32_Process -Filter \"Name='WINWORD.EXE'\" | "
                        "Where-Object { $_.CommandLine -like '*/Automation*' -and "
                        f"$_.CreationDate -gt (Get-Date).AddSeconds(-{int(time.time() - started) + 5}) }} | "
                        "ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"], capture_output=True)
        raise SystemExit(f'PDF export failed for {os.path.basename(path)} ({type(exc).__name__}); '
                         'nothing more has been published.')
    if not os.path.exists(pdf) or os.path.getmtime(pdf) < started:
        raise SystemExit(f'Word made no new PDF for {os.path.basename(path)}; nothing more has been published.')
    return pdf


def build_table(docs):
    word = lambda d: (f' &nbsp;(<a href="{html.escape(d["wordUrl"])}">Word</a>)' if d.get('wordUrl') else '')
    rows = ''.join(
        f'<tr><td><a href="{html.escape(d["url"])}">{html.escape(d["title"])}</a>{word(d)}</td>'
        f'<td>{long_date(datetime.date.fromisoformat(d["date"]))}</td></tr>'
        for d in docs if d.get('url'))
    # Said only once a form is published, so the page reads as it did until then.
    forms = [d['title'] for d in docs if d.get('url') and d.get('wordUrl')]
    intro = 'These Keyguard Designer documents are available as downloadable PDF files'
    intro += (f'. The {" and the ".join(forms)} can be typed into on the computer, in the PDF or in '
              f'Word, or printed:' if forms else ':')
    return (f'<!-- wp:paragraph -->\n<p>{intro}</p>\n<!-- /wp:paragraph -->\n\n'
            '<!-- wp:table -->\n<figure class="wp-block-table"><table><thead><tr><th>Document</th><th>Last updated</th></tr></thead>'
            f'<tbody>{rows}</tbody></table></figure>\n<!-- /wp:table -->')


def save(cfg):
    with open(LIST, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(cfg, f, indent=2, ensure_ascii=False)
        f.write('\n')


def main():
    apply = '--apply' in sys.argv
    force = '--force' in sys.argv
    only = sys.argv[sys.argv.index('--only') + 1] if '--only' in sys.argv else None
    cfg = json.load(open(LIST, encoding='utf-8'))
    docs = cfg['documents']
    replaced, plan = [], []

    for d in docs:
        if d.get('external'):
            said = live_pdf_date(d['url'])
            if said is None:
                raise SystemExit(f'No "Last updated" date found in {d["url"]}.')
            if d.get('date') != said.isoformat():
                print(f'  LISTED  {d["title"]}: {said} (Ken uploads this one himself)')
                d['date'] = said.isoformat()
            continue
        if only and only.lower() not in d['file'].lower():
            continue
        path = os.path.join(DOCS, d['file'])
        said = byline_date(path)
        if said is None:
            raise SystemExit(f'No "Last updated" date found in {d["file"]} - fix the byline first.')
        if not force and d.get('mediaId') and d.get('date') == said.isoformat():
            continue
        plan.append((d, said, path))

    for d, said, _ in plan:
        extra = ', '.join(w for w, on in (('fillable PDF', d.get('fillable')), ('and Word', d.get('word'))) if on)
        print(f'  {"NEW" if not d.get("mediaId") else "UPDATE"}  {d["title"]}: {d.get("date")} -> {said}'
              + (f'  ({extra})' if extra else ''))

    if apply:
        if plan and not cfg.get('mediaFolder'):
            cfg['mediaFolder'] = media_folder('Documents', WEB_APP_FOLDER)
            print(f'  MEDIA FOLDER Customizable, 3D Printable Keyguard > Web App > Documents (id {cfg["mediaFolder"]})')
        for d, said, path in plan:
            pdf = export_pdf(path)
            print(f'  EXPORTED {os.path.basename(pdf)}')
            if d.get('fillable'):
                boxes, checks = make_fillable(pdf)
                print(f'  FILLABLE {boxes} typing boxes, {checks} checkboxes')
            if d.get('word'):
                # The Word copy first: the date that marks the document done is written
                # with the PDF below, so if that fails both are tried again next time, and
                # this copy, already recorded, is listed then as one to delete.
                wmedia = upload(path, pdf_name(d['file'])[:-4] + '.docx', DOCX_MIME,
                                'Keyguard Designer ' + d['title'] + ' (Word)', cfg['mediaFolder'])
                if d.get('wordMediaId'):
                    replaced.append((d['title'] + ' (Word)', d['wordMediaId'], d['wordUrl']))
                d.update(wordMediaId=wmedia['id'], wordUrl=wmedia['url'])
                save(cfg)
                print(f'  UPLOADED {wmedia["url"]}')
            media = upload(pdf, pdf_name(d['file']), 'application/pdf',
                           'Keyguard Designer ' + d['title'], cfg['mediaFolder'])
            if d.get('mediaId'):
                replaced.append((d['title'], d['mediaId'], d['url']))
            d.update(date=said.isoformat(), mediaId=media['id'], url=media['url'])
            save(cfg)
            print(f'  UPLOADED {media["url"]}')

    pages = call('GET', f'/wp/v2/pages?slug={cfg["page"]}&status=publish,draft,private&context=edit')
    if plan and not apply:
        print('Page not rebuilt in a dry run while documents are waiting to upload.')
    else:
        content = build_table(docs)
        if not pages:
            if apply:
                page = call('POST', '/wp/v2/pages', {'title': cfg['pageTitle'], 'slug': cfg['page'],
                                                     'status': 'publish', 'content': content})
                if page['link'] != PAGE_URL:
                    print(f'  ⚠ The page landed at {page["link"]}, not {PAGE_URL}.')
                print(f'  PAGE MADE: {page["link"]}')
            else:
                print(f'  The page "{cfg["pageTitle"]}" does not exist yet; it will be made, public.')
        elif pages[0]['content']['raw'].strip() == content.strip():
            print('Page already up to date.')
        elif apply:
            call('POST', f'/wp/v2/pages/{pages[0]["id"]}', {'content': content})
            print(f'  PAGE UPDATED {pages[0]["link"]}')
        else:
            print('Page table would be rewritten. Run with --apply.')

    if apply:
        save(cfg)
    for title, mid, url in replaced:
        print(f'  OLD COPY LEFT IN MEDIA LIBRARY: {title} (id {mid}) {url}')
    if not plan:
        print('No documents changed.')


main()
