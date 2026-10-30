"""Makes a form's PDF fillable: typing boxes where the answers go, clickable checkboxes on
its printed boxes. For the Keyguard Data Form (Ken, 30 Oct 2026: "Fillable PDF and Word"),
and the same day the IT request letter, so either can be filled in on the computer in
Acrobat Reader, Chrome, Edge, a Mac or an iPad, with nothing to install, and still prints.

    python scripts/doc-generators/fillable_form.py <form.pdf> [out.pdf]

"sync docs" (publish-documents.py) runs it on the PDF Word makes, for a document listed
with "fillable": true. Word's own checkboxes and table cells don't survive into a PDF as
anything a reader can type in, so they are found again in the PDF's layout:

  - each two-column table row (question, answer) below a table's heading row;
  - an answer cell with nothing printed in it becomes one typing box filling it, several
    lines where it's tall enough;
  - each printed box (U+2610) becomes a checkbox, named after the words that follow it;
  - each blank line (______) becomes a typing box over it, named after the words before it;
  - a label ending in a colon with nothing after it on its line ("make and model:") gets a
    typing box from there to the cell's edge;
  - outside the tables, a blank line in the text ("To: ______") gets a typing box over it,
    and a bordered box with only a label at its top ("Results.") one filling the rest of it.

A row spanning both columns is a note, and gets nothing. Every box carries its question as
its name, which is also what a screen reader says for it.
"""
import os
import re
import sys

import fitz

BOX = '☐'
FONT_SIZE = 10
MULTILINE_PT = 30          # a box this tall or taller takes several lines
PAD = 2.5


def _inside(rect, x, y):
    return rect.x0 <= x <= rect.x1 and rect.y0 <= y <= rect.y1


def _lines(items):
    """Items (kind, rect, text) grouped into lines, top to bottom, each left to right. A
    printed box sits a little higher or lower than the words beside it (it comes from
    another font), so a line is whatever overlaps the first item's middle."""
    out = []
    for it in sorted(items, key=lambda it: (it[1].y0 + it[1].y1) / 2):
        mid = (it[1].y0 + it[1].y1) / 2
        if out and abs(mid - out[-1][0]) <= 4:
            out[-1][1].append(it)
        else:
            out.append([mid, [it]])
    return [sorted(line, key=lambda it: it[1].x0) for _mid, line in out]


def _question(page, rect):
    """The question in a cell: its words in the body size, without the setting's name
    printed small under it."""
    words = []
    for b in page.get_text('dict', clip=rect)['blocks']:
        for ln in b.get('lines', []):
            for sp in ln['spans']:
                if sp['size'] >= 9.5:
                    words.append(sp['text'])
    return _clean(' '.join(words))


def _boxes(page):
    """The printed boxes on a page, as rects."""
    out = []
    for b in page.get_text('rawdict')['blocks']:
        for ln in b.get('lines', []):
            for sp in ln['spans']:
                for ch in sp['chars']:
                    if ch['c'] == BOX:
                        out.append(fitz.Rect(ch['bbox']))
    return out


def _clean(text):
    return re.sub(r'\s+', ' ', text.replace('.', '')).strip(' :')


def _name(question, label):
    """A box's name: its question, shortened at a word if long, so the choice it ends with
    ("Attached") is never the part cut off."""
    if len(question) > 70:
        question = question[:70].rsplit(' ', 1)[0] + '...'
    return f'{question}: {label}' if label else question


def make_fillable(src, dst=None):
    """Adds the boxes to the PDF at `src`, writing it to `dst` (in place by default).
    Returns (typing boxes, checkboxes)."""
    doc = fitz.open(src)
    names, n_text, n_check = set(), 0, 0

    def unique(name):
        base, i = name[:120] or 'answer', 2
        name = base
        while name in names:
            name, i = f'{base} {i}', i + 1
        names.add(name)
        return name

    def text_box(page, rect, name, size=FONT_SIZE):
        nonlocal n_text
        w = fitz.Widget()
        w.field_type = fitz.PDF_WIDGET_TYPE_TEXT
        w.field_name = w.field_label = unique(name)
        w.rect = rect
        w.text_font, w.text_fontsize = 'Helv', size
        w.border_width, w.border_color, w.fill_color = 0, None, None
        if rect.height >= MULTILINE_PT:
            w.field_flags = fitz.PDF_TX_FIELD_IS_MULTILINE
        page.add_widget(w)
        n_text += 1

    def check_box(page, rect, name):
        nonlocal n_check
        w = fitz.Widget()
        w.field_type = fitz.PDF_WIDGET_TYPE_CHECKBOX
        w.field_name = w.field_label = unique(name)
        w.rect = rect
        w.border_width, w.border_color, w.fill_color = 0, None, None
        w.field_value = False
        page.add_widget(w)
        n_check += 1

    for page in doc:
        words = page.get_text('words')
        boxes = _boxes(page)
        tables = page.find_tables(strategy='lines_strict').tables
        taken = [fitz.Rect(t.bbox) for t in tables]
        outside = lambda r: not any(t.intersects(r) for t in taken)

        # Blank lines in the running text, outside the tables: "To: ______".
        loose = [('word', fitz.Rect(w[:4]), w[4]) for w in words if outside(fitz.Rect(w[:4]))]
        for line in _lines(loose):
            for i, (_kind, r, text) in enumerate(line):
                if re.fullmatch(r'_{3,}', text):
                    label = [t2 for _k, _r, t2 in line[:i] if not re.fullmatch(r'_{3,}', t2)]
                    text_box(page, fitz.Rect(r.x0, r.y1 - FONT_SIZE - 3, r.x1, r.y1 + 1),
                             _name(_clean(' '.join(label)), ''))

        # A bordered box holding only a label at its top ("Results."), for something pasted
        # in. Its text shrinks to fit, since what is pasted can run long.
        for dr in page.get_drawings():
            area = dr['rect']
            if (dr.get('fill') != (1.0, 1.0, 1.0) or area.width < 200 or area.height < 40
                    or not outside(area)):
                continue
            inside = [w for w in words if area.contains(fitz.Rect(w[:4]))]
            if not inside or max(w[3] for w in inside) - area.y0 > 24:
                continue                         # empty, or more than a label
            top = max(w[3] for w in inside) + 2
            text_box(page, fitz.Rect(area.x0 + PAD, top, area.x1 - PAD, area.y1 - PAD),
                     _name(_clean(' '.join(w[4] for w in inside)), ''), size=0)

        for t in tables:
            for row in t.rows[1:]:
                cells = row.cells
                if len(cells) < 2 or cells[0] is None or cells[1] is None:
                    continue                     # a note across the row
                q, a = fitz.Rect(cells[0]), fitz.Rect(cells[1])
                question = _question(page, q)
                # The answer cell's words and boxes, line by line, left to right.
                items = [('word', fitz.Rect(w[:4]), w[4]) for w in words
                         if _inside(a, (w[0] + w[2]) / 2, (w[1] + w[3]) / 2) and w[4] != BOX]
                items += [('box', r, BOX) for r in boxes if _inside(a, (r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2)]
                if not items:
                    text_box(page, fitz.Rect(a.x0 + PAD, a.y0 + PAD, a.x1 - PAD, a.y1 - PAD), _name(question, ''))
                    continue
                for line in _lines(items):
                    for i, (kind, r, text) in enumerate(line):
                        if kind == 'box':
                            label = []
                            for k2, _r2, t2 in line[i + 1:]:
                                if k2 == 'box' or re.fullmatch(r'_{3,}', t2):
                                    break
                                label.append(t2)
                            side = min(r.width, r.height)
                            cx, cy = (r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2
                            check_box(page, fitz.Rect(cx - side / 2, cy - side / 2, cx + side / 2, cy + side / 2),
                                      _name(question, _clean(' '.join(label))))
                        elif re.fullmatch(r'_{3,}', text):
                            label, after_box = [], False
                            for k2, _r2, t2 in reversed(line[:i]):
                                if k2 == 'box' or re.fullmatch(r'_{3,}', t2):
                                    after_box = k2 == 'box'
                                    break
                                label.insert(0, t2)
                            # A blank after a box ("Other: ____") is that choice's details,
                            # and needs a name apart from the box's own.
                            name = _clean(' '.join(label)) + (', details' if after_box else '')
                            text_box(page, fitz.Rect(r.x0, r.y1 - FONT_SIZE - 3, r.x1, r.y1 + 1),
                                     _name(question, name))
                        elif text.endswith(':') and i == len(line) - 1 and a.x1 - r.x1 > 40:
                            label = [t2 for k2, _r2, t2 in line[:i + 1] if k2 == 'word']
                            text_box(page, fitz.Rect(r.x1 + 3, r.y0 - 1, a.x1 - PAD, r.y1 + 1),
                                     _name(question, _clean(' '.join(label))))
    dst = dst or src
    tmp = dst + '.tmp'
    doc.save(tmp, garbage=3, deflate=True)
    doc.close()
    os.replace(tmp, dst)
    return n_text, n_check


if __name__ == '__main__':
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    t, c = make_fillable(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
    print(f'{t} typing boxes, {c} checkboxes')
