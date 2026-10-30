"""Keep the how-to video links in the User Manual in step with the course.

    python scripts/video/add-manual-links.py           (shows what it would change)
    python scripts/video/add-manual-links.py --apply   (backs the manual up, then changes it)

The manual carries a "Video:" line at the end of every section a video covers, and a
"Videos:" line in the Introduction linking the whole list (Ken, October 27 2026, the same
layout as Conversant's manuals). MAP below says which section gets which video. Run this
after a video is added (put it in MAP first) or renamed: it adds any link that is missing
and puts the current title on every link it finds, so a renamed video does not keep its
old name in the manual. Never edit those links by hand.

Each link opens the video's watch page, a child of the videos page, whose address comes
from the video's number (course.json: a published number never changes). ⚠ THE VIDEOS
PAGE DOESN'T EXIST YET (October 27 2026), so these are the addresses the pages WILL have,
and every link shows "not found" until the videos are published there. The manual must
not go out before the videos do; this script lists the videos not yet recorded as
published (scripts/video/published.json) every time it runs.

A link already in the manual is never added twice. A manual with tracked changes or
comments is left alone, because it is still under review. The edit goes through
Conversant's docx_safe, whose save refuses to write a file Word would reject.
"""
import datetime
import json
import os
import shutil
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
CONVERSANT = os.path.join(os.environ['OneDrive'], '4 T-Z', 'Volksswitch', 'AI-driven AAC')
sys.path.insert(0, os.path.join(CONVERSANT, 'scripts', 'doc-generators'))
import docx_safe as D                                     # noqa: E402
from docx.oxml.ns import qn                               # noqa: E402
from docx.text.paragraph import Paragraph                 # noqa: E402

MANUAL = os.path.join(ROOT, 'Documents', 'Keyguard Designer User Manual.docx')
BACKUPS = os.path.join(ROOT, 'Documents', 'Doc Backups')
ALL_URL = 'https://volksswitch.org/index.php/keyguard-designer-videos/'

course = json.load(open(os.path.join(ROOT, 'scripts', 'video', 'course.json'), encoding='utf-8'))
ITEM = {i['id']: i for g in course['groups'] for i in g['items'] if i.get('id')}
PUBLISHED_LIST = os.path.join(ROOT, 'scripts', 'video', 'published.json')
published = (json.load(open(PUBLISHED_LIST, encoding='utf-8'))['videos']
             if os.path.exists(PUBLISHED_LIST) else {})

# Section heading (as it starts) -> videos, in the order they are listed. 'ALL' is the
# link to the whole list.
MAP = [
    ('1.  Introduction', ['1.1-what-for', 'ALL']),
    ('2.3  ', ['2.1-tablet-and-case', '2.4-data-form']),
    ('2.4  On a school or hospital computer', ['6.3-it-on-board']),
    ('3.3  Starting a project', ['1.2-open-and-start']),
    ('3.5  The screen', ['1.3-screen-tour']),
    ('4.  Your First Keyguard', ['1.4-first-grid']),
    ('4.3  ', ['2.2-layout-from-screenshot', '2.3-millimeters', '2.5-pixels-or-millimeters']),
    ('4.4  Check it against the screenshot', ['1.5-check-screenshot']),
    ('4.6  Export and print', ['5.1-printing', '5.2-testing-fit']),
    ('5.1  Sections and settings', ['3.1-cover-merge', '3.5-slopes-bars', '3.7-splitting',
                                    '3.8-text-braille']),
    ('5.2  Skill levels', ['4.4-skill-levels']),
    ('6.  Saving Designs as Presets', ['4.1-presets']),
    ('7.  Custom Openings', ['3.6-free-form']),
    ('7.1  The by eye tab', ['3.2-by-eye', '3.4-ridges-corners']),
    ('7.2  The pixels or millimeters tab', ['3.3-typing-openings']),
    ('10.  Exporting', ['1.6-exporting']),
    ('11.  Sharing a Design', ['4.2-sharing']),
    ('13.3  Report a problem', ['6.2-report-problem']),
    ('13.4  Recent problems and reloading', ['6.1-looks-wrong']),
    ('14.2  The keyguard designer file', ['4.3-update-offered']),
]


def watch_page(vid):
    return '%svideo-%s/' % (ALL_URL, ITEM[vid]['num'].replace('.', '-'))


def is_heading(el):
    if el.tag != qn('w:p'):
        return False
    ppr = el.find(qn('w:pPr'))
    st = ppr.find(qn('w:pStyle')) if ppr is not None else None
    return st is not None and st.get(qn('w:val'), '').lower().startswith('heading')


def text_of(el, doc):
    return Paragraph(el, doc).text if el.tag == qn('w:p') else ''


def under_review(doc):
    body = doc.element.body
    for tag in ('w:ins', 'w:del', 'w:commentRangeStart', 'w:commentReference'):
        if next(body.iter(qn(tag)), None) is not None:
            return True
    return False


def wanted():
    """(heading, url, lead, words) for every link the manual should carry."""
    out = []
    for heading, vids in MAP:
        for v in vids:
            if v == 'ALL':
                out.append((heading, ALL_URL, 'Videos:  ', 'Every how-to video, in order'))
                continue
            if v not in ITEM:
                raise LookupError('%s is in MAP but not in course.json' % v)
            out.append((heading, watch_page(v), 'Video:  ', ITEM[v]['title']))
    return out


def fix_words(doc, words_for):
    """Put the current title on every link to a watch page. Returns how many changed."""
    changed = 0
    rels = doc.part.rels
    for link in doc.element.body.iter(qn('w:hyperlink')):
        rid = link.get(qn('r:id'))
        if rid not in rels or not rels[rid].is_external:
            continue
        words = words_for.get(rels[rid].target_ref)
        if words is None:
            continue
        runs = link.findall(qn('w:r'))
        if not runs or ''.join(t.text or '' for t in link.iter(qn('w:t'))) == words:
            continue
        D._set_run_text(runs[0], words)
        for extra in runs[1:]:
            link.remove(extra)
        changed += 1
    return changed


def template_para(doc):
    """A body paragraph to copy the look from: an existing "Video:" line, or else the first
    plain paragraph that opens with a bold word and goes on in plain text."""
    best = None
    for el in doc.element.body.iterchildren(qn('w:p')):
        runs = Paragraph(el, doc).runs
        if is_heading(el) or len(runs) < 2 or not runs[0].bold or runs[1].bold:
            continue
        if Paragraph(el, doc).text.startswith('Video:'):
            return el
        if best is None and el.find(qn('w:pPr')) is None:
            best = el
    if best is None:
        raise LookupError('no paragraph opening with a bold word to copy the look from')
    return best


def main(apply):
    doc = D.open_doc(MANUAL)
    if under_review(doc):
        print('SKIPPED: the manual has tracked changes or comments')
        return
    links = wanted()
    mapped = {v for _h, vids in MAP for v in vids}
    for vid in ITEM:
        if vid not in mapped:
            print('NOT IN THE MANUAL: %s %s - give it a section in MAP' % (ITEM[vid]['num'], ITEM[vid]['title']))
    renamed = fix_words(doc, {url: words for _h, url, _l, words in links})
    have = {r.target_ref for r in doc.part.rels.values() if r.is_external}
    template = template_para(doc)
    added = []
    for heading, url, lead, words in links:
        if url in have:
            continue
        body = list(doc.element.body.iterchildren())
        starts = [i for i, el in enumerate(body) if is_heading(el) and text_of(el, doc).startswith(heading)]
        if len(starts) != 1:
            raise LookupError('%d headings start with %r' % (len(starts), heading))
        nxt = next((i for i in range(starts[0] + 1, len(body)) if is_heading(body[i])), None)
        if nxt is None:
            raise LookupError('%r is the last section; nothing marks its end' % heading)
        before = body[nxt]
        prev = body[nxt - 1]
        if (prev.tag == qn('w:p') and not text_of(prev, doc).strip()
                and prev.find('.//' + qn('w:drawing')) is None
                and body[nxt - 2].tag != qn('w:tbl')):
            before = prev                         # keep the blank line above the next heading,
                                                  # but not the one that spaces a table off
        D.insert_link_para_before(doc, before, template, lead, words, url)
        have.add(url)
        added.append('%s  (%s)' % (words, heading.strip()))
    print('User Manual: %d to add, %d to rename' % (len(added), renamed))
    for w in added:
        print('    add: ' + w)
    waiting = [ITEM[v]['num'] for _h, vids in MAP for v in vids if v != 'ALL' and v not in published]
    if waiting:
        print('NOT PUBLISHED YET, so these links show "not found" until they are: %d of %d videos'
              % (len(waiting), len(waiting) + sum(1 for _h, vids in MAP for v in vids
                                                  if v != 'ALL' and v in published)))
    if not apply:
        print('Nothing changed. Run with --apply to make these changes.')
        return
    if not (added or renamed):
        return
    os.makedirs(BACKUPS, exist_ok=True)
    stamp = datetime.datetime.now().strftime('%Y-%m-%d_%H%M%S')
    shutil.copy2(MANUAL, os.path.join(BACKUPS, 'Keyguard Designer User Manual %s.docx' % stamp))
    D.save(doc, MANUAL)
    print('    saved (backup taken first)')


if __name__ == '__main__':
    main('--apply' in sys.argv)
