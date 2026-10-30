"""Makes the pictures of the Keyguard Data Form that video 2.4 is made from.

    python scripts/doc-generators/data-form-pictures.py

Exports Documents/Keyguard Data Form.docx to PDF through Word (the same way
publish-documents.py does, so the pictures are the PDF clinicians download), then writes
each page as Documents/video-pictures/data-form-<n>.png at 200 dpi, and
data-form-boxes.json: where each part of the form is in those pictures, in their pixels.
The video's rings are read from that file, so a change to the form moves them with it.
Run it after generate-data-form.py, then re-make video 2.4.
"""
import json
import os
import subprocess
import sys
import time

import fitz

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kg_docstyle import DOCUMENTS  # noqa: E402

FORM = os.path.join(DOCUMENTS, 'Keyguard Data Form.docx')
PDF = os.path.splitext(FORM)[0] + '.pdf'
OUT = os.path.join(DOCUMENTS, 'video-pictures')
DPI = 200
# The form's parts, as generate-data-form.py names them.
SECTIONS = ['About this keyguard', 'The tablet', 'The case', 'The AAC app', 'How the student uses it',
            'Making and attaching it', 'Words and braille', 'Anything else']

# A fresh Word, opened read-only, as in publish-documents.py.
EXPORT = r'''
$w = New-Object -ComObject Word.Application
$w.Visible = $false; $w.DisplayAlerts = 0
try {
  $d = $w.Documents.Open($env:KG_DOC, [ref]$false, [ref]$true)
  $d.ExportAsFixedFormat($env:KG_PDF, 17)
  $d.Close([ref]$false)
} finally { $w.Quit() }
'''


def export():
    started = time.time()
    subprocess.run(['powershell', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', EXPORT],
                   env=dict(os.environ, KG_DOC=FORM, KG_PDF=PDF), timeout=240, check=True, capture_output=True)
    if not os.path.exists(PDF) or os.path.getmtime(PDF) < started:
        raise SystemExit('Word made no new PDF of the data form.')


def box(rect, pad=6):
    k = DPI / 72
    return [round(rect.x0 * k) - pad, round(rect.y0 * k) - pad,
            round(rect.width * k) + 2 * pad, round(rect.height * k) + 2 * pad]


def main():
    export()
    doc = fitz.open(PDF)
    pictures, parts = [], {}
    for i, page in enumerate(doc, 1):
        name = f'data-form-{i}.png'
        page.get_pixmap(dpi=DPI).save(os.path.join(OUT, name))
        pictures.append(f'Documents/video-pictures/{name}')
        # Each part of the form is a table headed by its name; its rows are named by their
        # questions' first words.
        heads = [(s, r) for s in SECTIONS for r in page.search_for(s)]
        # 'lines_strict': the shaded rows' fills otherwise read as rows of their own.
        for t in page.find_tables(strategy='lines_strict').tables:
            tb = fitz.Rect(t.bbox)
            title = next((s for s, r in heads if tb.contains(r) and r.y0 < t.rows[0].bbox[3]), None)
            if not title:
                continue
            parts[title] = {'page': i, 'box': box(tb)}
            for r, cells in zip(t.rows[1:], t.extract()[1:]):
                q = (cells[0] or '').replace('\n', ' ').strip()
                parts[q[:40]] = {'page': i, 'box': box(fitz.Rect(r.bbox), 2)}
        if i == 1:
            # The title is the topmost "Keyguard Data Form" (the footer says it too), and the
            # opening paragraph runs from its first words to its last.
            title = min(page.search_for('Keyguard Data Form'), key=lambda r: r.y0)
            parts['title'] = {'page': i, 'box': box(title)}
            a, b = page.search_for('Fill in what you know')[0], page.search_for('can be skipped.')[0]
            parts['intro'] = {'page': i, 'box': box(fitz.Rect(a.x0, a.y0, page.rect.width - a.x0, b.y1))}
    with open(os.path.join(OUT, 'data-form-boxes.json'), 'w', encoding='utf-8') as f:
        size = [round(doc[0].rect.width * DPI / 72), round(doc[0].rect.height * DPI / 72)]
        json.dump({'_about': 'Made by scripts/doc-generators/data-form-pictures.py; do not edit by hand.',
                   'dpi': DPI, 'size': size, 'pictures': pictures, 'parts': parts}, f, indent=1)
    for k, v in parts.items():
        print(v['page'], v['box'], k)


main()
