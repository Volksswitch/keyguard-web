"""Draw numbered labels onto the User Manual's screenshots, from the boxes
capture-manual-figures.mjs recorded in figures/regions.json.

No coordinate is typed here: every box comes from the running app, so a label follows
its region when the layout changes. Numbered badges rather than arrows, because the
regions tile the window and arrows would cross them; the figure's caption names each
number. Black and white, so a label can't be mistaken for part of the app.

    python scripts/doc-generators/label-manual-figures.py
"""
import json
import os

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FIG = os.path.join(HERE, 'figures')
INK, PAPER = (17, 17, 17), (255, 255, 255)


def font(size):
    for d in (r'C:\Windows\Fonts', '/Library/Fonts'):
        p = os.path.join(d, 'arialbd.ttf')
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def badge(draw, x, y, text, r=34):
    draw.ellipse([x - r - 4, y - r - 4, x + r + 4, y + r + 4], fill=PAPER)
    draw.ellipse([x - r, y - r, x + r, y + r], fill=INK)
    f = font(int(r * 1.25))
    w = draw.textlength(text, font=f)
    draw.text((x - w / 2, y - r * 0.72), text, font=f, fill=PAPER)


def compact_toolbar(scale, cut):
    """Join the toolbar's left end (through PNG) to its right end (from Undo), with a
    small break mark between, so the buttons read at page width."""
    img = Image.open(os.path.join(FIG, 'um-toolbar.png')).convert('RGB')
    w, h = img.size
    left = img.crop((0, 0, int(cut['leftEnd'] * scale), h))
    right = img.crop((int(cut['rightStart'] * scale), 0, w, h))
    gap = 40
    out = Image.new('RGB', (left.width + gap + right.width, h), PAPER)
    out.paste(left, (0, 0))
    out.paste(right, (left.width + gap, 0))
    d = ImageDraw.Draw(out)
    for dx in (12, 24):                                   # a break mark: two short slashes
        x = left.width + dx
        d.line([(x - 4, h * 0.75), (x + 4, h * 0.25)], fill=(150, 150, 150), width=3)
    out.save(os.path.join(FIG, 'um-toolbar-compact.png'))
    print('joined', 'um-toolbar-compact.png')


def main():
    data = json.load(open(os.path.join(FIG, 'regions.json'), encoding='utf-8'))
    scale = data['scale']
    cut = data['regions'].pop('toolbarCut', None)
    if cut:
        compact_toolbar(scale, cut)
    for name, regions in data['regions'].items():
        src = os.path.join(FIG, name)
        img = Image.open(src).convert('RGB')
        draw = ImageDraw.Draw(img)
        for label, b, *hint in regions:
            where = hint[0] if hint else 'tl'
            x, y, w, h = (v * scale for v in (b['x'], b['y'], b['w'], b['h']))
            draw.rectangle([x + 3, y + 3, x + w - 3, y + h - 3], outline=INK, width=6)
            r = 34 if h > 120 else max(18, int(h / 2) - 6)     # smaller in a thin strip
            m = r + 22
            if where.startswith('at:'):
                cx, cy = x + w * float(where[3:]), y + h / 2
            else:
                cx = x + m if where[1] == 'l' else x + w - m
                cy = y + m if where[0] == 't' else y + h - m
            badge(draw, cx, cy, label, r)
        out = os.path.join(FIG, name.replace('.png', '-labeled.png'))
        img.save(out)
        print('labeled', out)


if __name__ == '__main__':
    main()
