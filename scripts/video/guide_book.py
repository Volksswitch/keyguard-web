"""The guide book: every how-to video's one-page guide in one PDF, in viewing order, after a
contents page, with every page numbered (Ken, 30 Oct 2026: "Users can keep a printout of
that file by their computer where they do keyguard design").

    python scripts/video/guide_book.py        writes Videos/Keyguard Designer How-To Guides.pdf
                                              from every video made so far

"sync videos" makes it after the videos, and publish-videos.py makes it again from the
videos actually published, uploads it, and links it on the videos page.

The guides are the very PDFs each video's render makes (companion.mjs), placed page for
page, not drawn again, so the book can't disagree with them. Each one's own footer says
"Page 1 of 1"; that is taken off and the book's page number put in its place. The
contents entries are links to their pages, and the PDF's bookmarks list the same.
"""
import datetime
import json
import os
import sys

import fitz

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
VIDEOS = os.path.join(ROOT, 'Videos')
COURSE = os.path.join(ROOT, 'scripts', 'video', 'course.json')
BOOK = 'Keyguard Designer How-To Guides.pdf'
LIST_URL = 'volksswitch.org/index.php/keyguard-designer-videos/'
GREY = (0x52 / 255, 0x60 / 255, 0x6d / 255)
NAVY = (0x1F / 255, 0x38 / 255, 0x64 / 255)

CSS = """
* { font-family: sans-serif; }
body { color: #1f2933; }
.kicker { font-size: 9pt; color: #52606d; }
h1 { font-size: 20pt; color: #1F3864; margin: 2pt 0 4pt 0; }
p { font-size: 10.5pt; margin: 0 0 4pt 0; }
.meta { font-size: 9pt; color: #52606d; margin-bottom: 8pt; }
h2 { font-size: 11.5pt; color: #2E74B5; margin: 9pt 0 3pt 0; font-weight: normal; }
table { width: 100%; border-collapse: collapse; }
td { font-size: 10pt; padding: 2pt 0; border-bottom: 0.5pt solid #d9e2ec; }
td.n { width: 30pt; font-weight: bold; color: #1F3864; }
td.p { width: 40pt; text-align: right; }
"""


def esc(s):
    return str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def footer(page, number, total):
    """The book's footer, where each guide's own was: the same line, ends and size (measured
    on a guide: 8 pt, baseline 775.5, from 43.2 to 568.8)."""
    page.insert_text((43.2, 775.5), 'Volksswitch.org | Keyguard Designer how-to guides',
                     fontsize=8, fontname='helv', color=GREY)
    label = f'Page {number} of {total}'
    w = fitz.get_text_length(label, fontname='helv', fontsize=8)
    page.insert_text((568.8 - w, 775.5), label, fontsize=8, fontname='helv', color=GREY)


def make_book(ids=None, out=None):
    """Builds the book from the guides of `ids` (every made video when None), in the
    course's order. Returns the path written."""
    course = json.load(open(COURSE, encoding='utf-8'))
    groups = []
    for g in course['groups']:
        items = [i for i in g['items'] if i.get('id') and os.path.exists(os.path.join(VIDEOS, i['id'] + '.pdf'))
                 and (ids is None or i['id'] in ids)]
        if items:
            groups.append((g, items))
    guides = [i for _g, items in groups for i in items]
    if not guides:
        raise SystemExit('No guides have been made yet; run "sync videos".')

    book = fitz.open()
    contents = book.new_page(width=612, height=792)          # US Letter, like the guides
    first = 2                                                # the page the first guide is on
    numbers = {i['id']: first + n for n, i in enumerate(guides)}
    total = 1 + len(guides)

    rows = ''
    for g, items in groups:
        rows += f'<h2>{esc(g["name"])}{" (watch these in order)" if g.get("path") else ""}</h2><table>'
        rows += ''.join(f'<tr><td class="n">{esc(i["num"])}</td><td>{esc(i["title"])}</td>'
                        f'<td class="p">{numbers[i["id"]]}</td></tr>' for i in items)
        rows += '</table>'
    today = datetime.date.today()
    html = (f'<div class="kicker">Keyguard Designer how-to videos</div><h1>How-To Guides</h1>'
            '<p>One page for each how-to video, in the order to watch them, with the same steps as the '
            'video. Keep a printed copy by the computer you design keyguards on.</p>'
            f'<div class="meta">The videos are at {LIST_URL}  |  Updated {today:%B} {today.day}, {today.year}'
            f'</div>{rows}')
    area = fitz.Rect(0.6 * 72, 0.55 * 72, 612 - 0.6 * 72, 792 - 0.75 * 72)
    spare, scale = contents.insert_htmlbox(area, html, css=CSS, scale_low=0.7)
    if spare < 0:
        raise SystemExit('STOPPING - the contents no longer fit on one page, even made smaller.')
    footer(contents, 1, total)

    toc = [[1, 'Contents', 1]]
    for g, items in groups:
        toc.append([1, g['name'], numbers[items[0]['id']]])
        for i in items:
            src = fitz.open(os.path.join(VIDEOS, i['id'] + '.pdf'))
            if len(src) != 1:
                raise SystemExit(f'STOPPING - the guide for {i["num"]} is {len(src)} pages; each must be one.')
            book.insert_pdf(src)
            page = book[-1]
            # Its own footer off (the words only; the pictures and lines stay), the book's on.
            for text in ('Page 1 of 1', 'Volksswitch.org | Keyguard Designer how-to videos'):
                for r in page.search_for(text):
                    page.add_redact_annot(r + (-1, -1, 1, 1), fill=(1, 1, 1))
            page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE, graphics=fitz.PDF_REDACT_LINE_ART_NONE)
            footer(page, numbers[i['id']], total)
            toc.append([2, f'{i["num"]}  {i["title"]}', numbers[i['id']]])
    # Each contents entry opens its page. (Adding pages lets go of the page objects made
    # before, so the contents page is fetched again.)
    # The search reads ligatures as their letters: "Offered" is printed with an ff glyph.
    contents = book[0]
    for i in guides:
        for r in contents.search_for(i['title'], flags=fitz.TEXT_DEHYPHENATE)[:1]:
            hit = fitz.Rect(area.x0, r.y0 - 1, area.x1, r.y1 + 1)
            contents.insert_link({'kind': fitz.LINK_GOTO, 'from': hit, 'page': numbers[i['id']] - 1})
    book.set_toc(toc)
    book.set_metadata({'title': 'Keyguard Designer How-To Guides', 'author': 'Volksswitch',
                       'subject': 'One page for each Keyguard Designer how-to video'})
    out = out or os.path.join(VIDEOS, BOOK)
    book.save(out, garbage=3, deflate=True)
    return out


if __name__ == '__main__':
    path = make_book()
    print(os.path.relpath(path, ROOT), f'({len(fitz.open(path))} pages)')
