"""Builds Documents/Keyguard Designer Quick Reference Card.docx.

One sheet, printed on both sides, to keep beside the computer: the path from measuring
to printing, the presets, the Custom Openings moves, the exports and where to get help.
Each fact repeats the User Manual, which says more; the two are checked against the same
release of the app (115).

⚠ A generator rewrites the whole document. Once Ken has edited the .docx by hand, the
.docx is the newer copy.

    python scripts/doc-generators/generate-quick-reference.py [output.docx]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kg_docstyle import DOCUMENTS, KgDoc, NAVY, GREY  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
    DOCUMENTS, 'Keyguard Designer Quick Reference Card.docx')
UPDATED = 'October 30, 2026'
W = [1.6, 5.7]          # two-column tables across the 7.3-inch measure

d = KgDoc(footer='Keyguard Designer Quick Reference', body_pt=10, margin=0.6)
d.centered('Keyguard Designer Quick Reference', 20, NAVY, bold=True, after=2)
d.centered(f'keyguard.volksswitch.org  |  Chrome or Edge on Windows, Chromebook and Mac  |  '
           f'Last updated {UPDATED}', 9, GREY, after=6)

# ============================== side 1 ==============================
d.h1('From measuring to printing')
d.n("**Measure.** Note the tablet model and the case opening's height, width and corner radius "
    "in millimeters. Take a screenshot of the AAC app on the tablet and save it as PNG or JPEG.")
d.n("**Open a project folder.** Click **Open Project…**, choose a folder and allow access. An "
    "empty folder is set up for you when you click **Set it up**. Copy the screenshot into it.")
d.n("**Set up the design.** Set **Skill level** to Intermediate. Then work down the sections: "
    "Tablet, Tablet Case, App Layout (the bar heights), Bar Info and Grid Info (rows and "
    "columns).")
d.n("**Check it.** In Special Actions and Settings, set **include screenshot** to *yes*, then "
    "click the **Top** view button. Each opening should sit over its button.")
d.n("**Save it.** Click **+** beside the preset box, type a name and press Enter. After that, "
    "**Save preset** keeps your changes. A red * means changes aren't saved yet.")
d.n("**Export and print.** Click **STL**, open the file in your slicer and print it. Try it on "
    "the tablet, adjust and export again.")

d.h1('Presets')
d.table(['Control', 'What it does'], [
    ['Preset box', 'Shows the current design. ▾ opens the list; Up and Down step through it. '
     'Edit the name and press Enter to rename it.'],
    ['+  and  −', 'Save the current settings as a new preset; delete the current preset.'],
    ['Save preset, Reset', 'Save your changes; throw them away and go back to the saved preset.'],
    ['📂  📂+  📥', 'Open a different preset file; add the presets from another file; save this '
     'preset as a file of its own, to share or back up.'],
], W, size=9)

d.h1('Looking at the keyguard')
d.table(['Do this', 'To'], [
    ['Drag, scroll, right-drag', 'Turn the keyguard, zoom, slide it across the view.'],
    ['View All, cube buttons', 'Fit it in the view; look from the top, bottom, front, back, left '
     'or right.'],
    ['Show Axes, Show grid', "Show the x, y and z directions; show your printer's build plate "
     '(set its size in Settings, Grid).'],
    ['Undo, Redo', 'Take back or redo a change to the settings.'],
], W, size=9)

d.h1('Skill levels')
d.table(['Level', 'Shows'], [
    ['Beginner', 'The settings for a basic grid keyguard.'],
    ['Intermediate', 'Adds the screenshot, pixel measurements, more grid settings, mounting and '
     'split keyguards.'],
    ['Advanced', 'Every setting, including frames, cell inserts and engraved text.'],
], W, size=9)

d.h1('Help')
d.p("The **?** button has the Custom Openings moves, the how-to pages, known issues, Check my "
    "setup and Report a problem. The User Manual covers each step in full. Questions go to "
    "ken@volksswitch.org.")

# ============================== side 2 ==============================
d.h1('Custom Openings, by eye').paragraph_format.page_break_before = True
d.p("Click **Custom Openings** in the toolbar. On the **by eye** tab you work on the keyguard "
    "itself. On a Mac, use Command where this card says Ctrl.")
d.table(['Move', 'What it does'], [
    ['+ Rectangle, + Circle', 'An opening 10 mm across appears in the middle of the screen.'],
    ['+ Ridge', 'Then click the keyguard for a 10 mm ridge, or drag to draw one, in steps of 45°.'],
    ['+ Rounded corner', 'Square corners are ringed. Click one to round it by 2 mm, or drag from '
     'it along an edge.'],
    ['Click, Shift-click', 'Select one; add another to the selection.'],
    ['Drag', 'Move what you drag. Dragging anywhere else turns the keyguard.'],
    ['Shift + drag', 'Keep to a straight line.'],
    ['Ctrl + drag', 'Leave a copy behind and drag the copy.'],
    ['Arrow keys', 'Nudge 1 mm. Hold Shift for 10 mm.'],
    ['Handles, yellow dot', "Resize (Shift keeps the shape, Ctrl the center; a circle's side "
     'handle makes a hot dog); round corners.'],
    ['Delete, Ctrl+Z', 'Remove the selection; take back the last change; Ctrl+Y puts it back.'],
    ['Esc', 'Let go of the selection, or close Custom Openings.'],
    ['Save, then Save preset', 'Save puts the openings in the design. Save preset keeps the '
     'design.'],
], W, size=9)
d.p("The **pixels or millimeters** tab lists the same openings as numbers, plus case openings, "
    "which are measured in millimeters from the lower-left corner of the case opening.")

d.h1('Exports')
d.table(['Button', 'Gives you'], [
    ['STL', 'A 3D file for your slicer, made in seconds.'],
    ['STL*', 'The same file made the slower, more precise way. Use it if your slicer reports '
     'problems.'],
    ['SVG', 'A flat drawing for a laser cutter. Set the type of keyguard to Laser-Cut first.'],
    ['PNG', 'A picture of the 3D view.'],
], W, size=9)

d.h1('When something goes wrong')
d.table(['If', 'Then'], [
    ['The keyguard stops updating', 'Settings, Troubleshooting, **Reload the app**, then open '
     'the project again. Your design is safe.'],
    ['It looks wrong', 'Read the Console below the 3D view. It usually names the setting.'],
    ["The openings don't line up", 'Check the bar heights, that only one App Layout section is '
     'filled in, and the case opening.'],
    ['Something is blocked', 'Click **?**, then **Check my setup**. It says what to ask IT for.'],
    ["It isn't a known issue", 'Click **?**, then **Report a problem**. You read the report '
     'before you send it.'],
], W, size=9)

d.save(OUT)
print('saved', OUT)
