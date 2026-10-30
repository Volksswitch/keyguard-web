"""Builds Documents/Keyguard Designer IT Request Letter.docx: the one-page letter a
clinician forwards to IT, asking them to allow the Keyguard Designer. It must stay on
one page; the margins and type are set for that.

⚠ A generator rewrites the whole document. Once Ken has edited the .docx by hand, the
.docx is the newer copy.

    python scripts/doc-generators/generate-it-letter.py [output.docx]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kg_docstyle import DOCUMENTS, KgDoc, NAVY, GREY  # noqa: E402
from docx.shared import Inches, Pt  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
    DOCUMENTS, 'Keyguard Designer IT Request Letter.docx')
UPDATED = 'October 30, 2026'

d = KgDoc(footer='Volksswitch.org  |  Keyguard Designer  |  Request for IT', body_pt=11,
          margin=0.75)
# The .docx itself is downloaded, so it carries its own name rather than the library's.
props = d.doc.core_properties
props.title, props.author, props.last_modified_by = 'Request to Allow the Keyguard Designer', 'Volksswitch', 'Volksswitch'
props.comments = ''
d.centered('Request to Allow the Keyguard Designer', 18, NAVY, bold=True, after=2)
d.centered(f'Volksswitch.org  |  Last updated {UPDATED}', 9, GREY, after=8)

for label in ('To:', 'From:', 'Date:'):
    d.p(f'**{label}**  ' + '_' * 52)

d.p("I'd like to use the Keyguard Designer, a free tool from Volksswitch, to design 3D-printed "
    "keyguards for people who use AAC on a tablet. A keyguard is a plastic plate over the screen "
    "that helps someone with limited hand control touch one button at a time.")

d.h2("What I'm asking for")
d.b("**Allow one web address:** https://keyguard.volksswitch.org. Nothing else is needed.")
d.b("**No installation.** It runs in Chrome or Edge as a web page, with no administrator rights.")
d.b("**Browser features it uses.** WebAssembly and graphics acceleration (WebGL) draw the "
    "keyguard, and the File System Access API reads and saves files in one folder I choose. If "
    "policy turns any of these off, please allow them for this address.")

d.h2('What it does with information')
d.b("**Everything stays on this computer.** Designs are saved only in the folder I choose. "
    "There are no uploads, accounts, analytics or advertising.")
d.b("**It contacts only its own address,** to load itself and to check for updates. Those "
    "requests carry no information about me, the people I serve or my work.")
d.b("**Problem reports are mine to send.** I read a report first and send it from my own email. "
    "It leaves out names.")

d.h2('More detail for your review')
d.b("**Security Overview for IT:** https://volksswitch.org/wp-content/uploads/2026/08/SECURITY.pdf "
    "covers network use, storage and permissions in full.")
d.b("**Source code:** https://github.com/Volksswitch/keyguard-web. It's open source and in the "
    "public domain.")

d.h2('Results from Check my setup')
d.p("If the app opens, its own check lists what's missing: Settings, then Troubleshooting, then "
    "Check my setup. Paste the results here.")
box = d.callout(' ', label='Results', fill='FFFFFF', border='808080')
# Room for the dozen or so lines Check my setup gives. "sync docs" publishes this letter as a
# PDF that can be typed into (the To, From and Date lines, and this box) and as a Word file
# (Ken, 30 Oct 2026), so the box is sized for pasting into, not only for a printout.
box.rows[0].height = Inches(1.5)

d.p("Thank you. Questions about the app itself can go to Volksswitch at ken@volksswitch.org.")

d.save(OUT)
print('saved', OUT)
