"""Builds Documents/Keyguard Designer Setting Descriptions - Draft for Review.docx.

Every Customizer setting's drafted description, for Ken to read and correct before any of it
goes into the keyguard designer file (Ken, October 27 2026: all 188 at once, together with
the Design Settings Reference). The words come from setting-descriptions.json beside this
script, which was drafted from keyguard.scad's own code and the volksswitch.org how-to pages.

⚠ ONCE KEN HAS EDITED THE .DOCX, IT IS THE NEWER COPY. Read his changes back into
setting-descriptions.json before regenerating, or they are lost. Each setting is a Heading 3
(its name as the app shows it) followed by paragraphs that open with a bold label; the labels
are what a read-back finds, so the review instructions ask Ken to leave them.

    python scripts/doc-generators/generate-setting-descriptions-review.py [output.docx]
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kg_docstyle import DOCUMENTS, HERE, KgDoc, GREY  # noqa: E402

SOURCE = os.path.join(HERE, 'setting-descriptions.json')
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
    DOCUMENTS, 'Keyguard Designer Setting Descriptions - Draft for Review.docx')
UPDATED = 'October 27, 2026'
LEVEL = {'beginner': 'Beginner', 'intermediate': 'Intermediate', 'advanced': 'Advanced'}

data = json.load(open(SOURCE, encoding='utf-8'))
settings = [s for sec in data['sections'] for s in sec['settings']]
questions = [s for s in settings if s.get('question')]

d = KgDoc(footer='Keyguard Designer Setting Descriptions - Draft for Review')
d.title_block('Keyguard Designer', 'Setting Descriptions: Draft for Review',
              f'Prepared for Kenneth R. Hackbarth  |  Volksswitch.org  |  Last updated {UPDATED}')
d.contents('1-2')

d.h1('About this draft').paragraph_format.page_break_before = True
d.p(f"Every one of the {len(settings)} Customizer settings has a drafted description here. Each was "
    "written from what the keyguard designer file actually does with the setting, and from the "
    "how-to pages on volksswitch.org. Nothing in the app or the keyguard designer file has "
    "changed yet: these words go in only once you've approved them.")
d.h2('How to review')
d.b("**Change any words right here.** Type over them, delete them, or add a Word comment. Your "
    "wording is final.")
d.b("**Leave the setting names and the bold labels as they are** (\"When you point at it:\" and "
    "the rest). That's how Claude finds your changes and reads them back.")
d.b(f"**Questions for you** are collected in the next section ({len(questions)} of them) and "
    "repeated under each setting. Answer them under the setting, in your own words.")
d.b("When you're done, tell Claude the setting descriptions are reviewed.")

d.h2('What each setting shows')
d.b("**When you point at it:** the description that appears when the mouse points at the "
    "setting's name. At most 200 characters, so it reads at a glance.")
d.b("**When you'd change it** and **What the values do:** for the Design Settings Reference, "
    "where each setting gets a full entry.")
d.b("**Gray note under the name:** the short note some settings already show. A warning or an "
    "example stays where it is. A note that only described the setting goes, because the "
    "description now says it.")
d.b("**Picture for the reference:** the two values the reference would draw side by side. It's "
    "there so you can say if a different pair would show the effect better.")

d.h2('How it will work')
d.p("Pointing at a setting's name shows its description, with a **More** link to that setting's "
    "entry in the Design Settings Reference. The reference has an entry for every setting: these "
    "words, the skill level that shows it, and a picture of the keyguard at two values side by "
    "side, made by the app.")
d.p("The descriptions are written into the keyguard designer file, one line above each setting, "
    "so OpenSCAD shows the same words in its own Customizer. A warning goes on the same line "
    "after \"Note:\", and the app shows that part as the gray note.")
d.p("Everything reaches clinicians together, as you chose: a keyguard designer update carrying "
    "the descriptions, an app release that shows them, and the reference published on the "
    "documents page, on the same day.")

d.h2('Decisions for you')
d.n("**Where More opens.** Claude leans toward a page on volksswitch.org with an entry per "
    "setting: More opens it right at that entry, in any browser. The same words would also make "
    "a PDF for the documents page, for printing. A PDF alone prints well, but whether it opens "
    "at the right entry depends on the browser.")
d.n("**What's this?** The plan paired the descriptions with a What's this? mode (choose it, then "
    "click any button to see what it does). It isn't part of this unless you want it.")
d.n("**The retired address.** Clinicians still on the old address get every keyguard designer "
    "update, and their app shows a setting's description as gray text under its name. The words "
    "help them too, but their Customizer gets longer. Claude leans toward accepting that, since "
    "that address closes in August 2027.")

d.h1('Questions for you')
d.p("Things only you can say: what a setting is for, or which of two behaviors is intended. "
    "Each is repeated under its setting, where you can answer it.")
for s in questions:
    d.b(f"**{s['shown_as']}** ({s['section']}): {s['question']}")

d.h1('Found along the way')
d.p("Reading the keyguard designer file closely, setting by setting, turned up these. None of "
    "them has been changed.")
d.h2('Faults in the keyguard designer file')
if data['faults']:
    d.p("Each was confirmed by drawing a keyguard with the settings named, not only by reading "
        "the code. Whether to fix them in the same keyguard designer version as the descriptions "
        "is your call.")
    for f in data['faults']:
        d.b(f"**{f['title']}** {f['what']}")
else:
    d.p("*Being checked.*")
d.h2('How-to pages that disagree with the designer')
d.p("Pages on volksswitch.org that describe a setting differently from what the designer now "
    "does. The descriptions follow the designer.")
for pg in data['pages']:
    d.b(f"**{pg['page']}** (page {pg['id']}): {pg['issue']}")
d.h2('A correction for the User Manual')
for m in data['manual']:
    d.b(f"**{m['where']}:** {m['issue']}")
d.p("It's a change to the manual's wording, made in your Word file by \"sync docs\" once you "
    "agree.")

for sec in data['sections']:
    d.h1(sec['section']).paragraph_format.page_break_before = True
    d.p(f"*Shown from the {LEVEL[sec['level']]} skill level. {len(sec['settings'])} "
        f"setting{'s' if len(sec['settings']) != 1 else ''}.*")
    for s in sec['settings']:
        d.h3(s['shown_as'])
        lead = d.p(f"{LEVEL[s['level']]}")
        lead.paragraph_format.keep_with_next = True      # never a name stranded at a page's foot
        for r in lead.runs:
            r.italic, r.font.color.rgb = True, GREY
        d.p(f"**When you point at it:** {s['tip']}")
        d.p(f"**When you'd change it:** {s['when']}")
        if s.get('values'):
            d.p(f"**What the values do:** {s['values']}")
        if s.get('note'):
            fate = {'keep': 'stays', 'fold': 'goes; the description now says it'}[s['note_decision']]
            d.p(f"**Gray note under the name:** “{s['note']}” ({fate})")
        pic = d.p(f"**Picture for the reference:** {s['picture']}")
        for r in pic.runs:
            r.font.color.rgb = GREY
        if s.get('question'):
            d.callout(s['question'], label='Question for you', fill='FFF4E5', border='F0B66B')

d.save(OUT)
print(OUT)
