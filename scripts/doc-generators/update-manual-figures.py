"""Put the current screenshots into the Word User Manual, in place.

    python scripts/doc-generators/update-manual-figures.py           (shows what would change)
    python scripts/doc-generators/update-manual-figures.py --apply   (backs the manual up, then changes it)

Run after capture-manual-figures.mjs and label-manual-figures.py. Ken's copy of the
manual has a table of contents Word has filled in, which regenerating the manual with
generate-user-manual.py would drop (October 26 2026), so new pictures go into the
existing file instead: each picture is found by the "Figure N." caption beneath it, and
generate-user-manual.py's fig() lines say which file each figure is. Only the picture
changes - its width on the page stays, and its height follows the new picture's shape.

The edit goes through Conversant's docx_safe, whose save refuses to write a file Word
would reject.
"""
import datetime
import io
import os
import re
import shutil
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
CONVERSANT = os.path.join(os.environ['OneDrive'], '4 T-Z', 'Volksswitch', 'AI-driven AAC')
sys.path.insert(0, os.path.join(CONVERSANT, 'scripts', 'doc-generators'))
import docx_safe as D                                     # noqa: E402
from docx.oxml.ns import qn                               # noqa: E402
from docx.text.paragraph import Paragraph                 # noqa: E402

MANUAL = os.path.join(ROOT, 'Documents', 'Keyguard Designer User Manual.docx')
BACKUPS = os.path.join(ROOT, 'Documents', 'Doc Backups')
FIG = os.path.join(HERE, 'figures')
WP = '{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}'
A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'

# "Figure 3." -> um-presets.png, read from the generator so the two can't disagree.
source = open(os.path.join(HERE, 'generate-user-manual.py'), encoding='utf-8').read()
FILE_FOR = {m.group(2): m.group(1)
            for m in re.finditer(r"fig\('([^']+)',\s*'(Figure \d+\.)", source)}


def main(apply):
    doc = D.open_doc(MANUAL)
    body = list(doc.element.body.iterchildren())
    changed, same = [], []
    for i, el in enumerate(body):
        drawing = el.find('.//' + qn('w:drawing')) if el.tag == qn('w:p') else None
        if drawing is None:
            continue
        caption = Paragraph(body[i + 1], doc).text if i + 1 < len(body) else ''
        m = re.match(r'Figure \d+\.', caption)
        if not m or m.group(0) not in FILE_FOR:
            raise LookupError('a picture with no caption the generator knows: %r' % caption[:60])
        name = FILE_FOR[m.group(0)]
        new = open(os.path.join(FIG, name), 'rb').read()
        part = doc.part.related_parts[next(drawing.iter(qn('a:blip'))).get(qn('r:embed'))]
        if part.blob == new:
            same.append(name)
            continue
        w, h = Image.open(io.BytesIO(new)).size
        extent = drawing.find('.//' + WP + 'extent')
        cy = str(round(int(extent.get('cx')) * h / w))
        extent.set('cy', cy)
        for ext in drawing.iter(A + 'ext'):
            if ext.get('cx') is not None:
                ext.set('cy', cy)
        part._blob = new
        changed.append('%s  (%s)' % (name, m.group(0)))
    print('User Manual figures: %d changed, %d already current' % (len(changed), len(same)))
    for c in changed:
        print('    new picture: ' + c)
    if not apply:
        print('Nothing changed. Run with --apply to make these changes.')
        return
    if not changed:
        return
    os.makedirs(BACKUPS, exist_ok=True)
    stamp = datetime.datetime.now().strftime('%Y-%m-%d_%H%M%S')
    shutil.copy2(MANUAL, os.path.join(BACKUPS, 'Keyguard Designer User Manual %s.docx' % stamp))
    D.save(doc, MANUAL)
    print('    saved (backup taken first)')


if __name__ == '__main__':
    main('--apply' in sys.argv)
