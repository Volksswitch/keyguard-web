"""Builds Documents/Keyguard Designer User Manual.docx.

One manual for Chrome and Edge on Windows, Chromebook and Mac. It follows a clinician's
path from opening the app to a printed keyguard, then covers each part of the app.
Every control it names was read from app.html (release 115) and the running app; the
figures are screenshots of the real app, captured by capture-manual-figures.mjs and
labeled by label-manual-figures.py.

⚠ A generator rewrites the whole document. Once Ken has edited the .docx by hand, the
.docx is the newer copy: edit it directly, or fold his changes back in here first.

    python scripts/doc-generators/generate-user-manual.py [output.docx]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kg_docstyle import DOCUMENTS, HERE, KgDoc, GREY  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
    DOCUMENTS, 'Keyguard Designer User Manual.docx')
FIG = os.path.join(HERE, 'figures')
UPDATED = 'October 30, 2026'


def fig(name, caption, width=6.0):
    path = os.path.join(FIG, name)
    if os.path.exists(path):
        d.figure(path, caption, width)
    else:                                   # a figure not captured yet still shows where it goes
        d.callout(f'Figure to come: {caption}', label='Figure')


d = KgDoc(footer='Keyguard Designer User Manual')
d.title_block('Keyguard Designer', 'User Manual',
              f'For Chrome and Edge on Windows, Chromebook and Mac  |  Volksswitch.org  |  '
              f'Last updated {UPDATED}')
d.contents('1-2')

# =====================================================================
d.h1('1.  Introduction').paragraph_format.page_break_before = True
d.p("The Keyguard Designer is a free web app for designing keyguards: plastic plates that sit "
    "over a tablet's screen, with an opening over each button of an AAC app. You design the "
    "keyguard in Chrome or Edge, then print it on a 3D printer or cut it on a laser cutter.")
d.p("This manual takes you from opening the app to a printed keyguard. Section 4 walks through "
    "a first keyguard from start to finish. The sections after it cover each part of the app, "
    "and you can read them as you need them.")
d.p("Measuring the tablet, printing and mounting are covered in more depth on the Keyguard "
    "Designer pages at volksswitch.org. This manual points to them where they help.")

# =====================================================================
d.h1('2.  What You Need')
d.h2('2.1  A computer and a browser')
d.p("You need a Windows PC, a Chromebook or a Mac with **Google Chrome** or **Microsoft Edge**.")
d.p("The app doesn't work in Safari or Firefox, or on an iPad or Android tablet. It reads and "
    "saves your files in a folder you choose, and only Chrome and Edge let a web page do that. "
    "On a Mac, Safari is the browser that opens links by default, so open Chrome or Edge "
    "yourself and type the address there.")
d.h2('2.2  A way to make the keyguard')
d.p("The app designs the keyguard. To make it you need one of these:")
d.b("**A 3D printer** and its slicing program, such as PrusaSlicer, Bambu Studio, Orca Slicer "
    "or Cura.")
d.b("**A laser cutter**, for a keyguard cut from a flat sheet of acrylic.")
d.b("**Someone who has one.** A colleague, a school's STEM program or a library makerspace can "
    "print from the file you export.")
d.h2("2.3  The tablet's details")
d.p("Every keyguard starts from four things. The keyguard data form on volksswitch.org helps "
    "you collect them.")
d.b("**The tablet's model,** such as iPad 9th generation.")
d.b("**The case, if there is one,** and the height, width and corner radius of its opening, "
    "in millimeters.")
d.b("**A screenshot of the AAC app,** taken on the tablet itself with the app showing the page "
    "the keyguard is for. Save it as a PNG or JPEG file.")
d.b("**How the keyguard will attach:** inside the case opening, with Velcro, with suction cups, "
    "and so on.")
d.h2('2.4  On a school or hospital computer')
d.p("You don't need administrator rights, because nothing is installed. If your network blocks "
    "the app, your IT department needs to allow one address: keyguard.volksswitch.org.")
d.p("Volksswitch provides a one-page letter you can forward to IT, and a security overview for "
    "IT reviewers. If the app opens but something doesn't work, **Check my setup** (Section 13.2) "
    "says what's blocked and what to ask IT for.")

# =====================================================================
d.h1('3.  Getting Started')
d.h2('3.1  Opening the app')
d.p("Go to **keyguard.volksswitch.org** in Chrome or Edge. There's no account to create and "
    "nothing to sign in to. The first time, the app takes a few seconds to load.")
d.h2('3.2  Installing it as an app')
d.p("You can keep using the app in a browser tab, but it's easier to install it. It then opens in "
    "its own window, without tabs or an address bar, and has its own icon in the Start menu, "
    "the Dock or the shelf.")
d.p("To install it, look for the install icon at the right end of the address bar. If it isn't "
    "there, open the browser's menu and look for **Install**. Installing doesn't need "
    "administrator rights, and the installed app is the same app with the same address.")
d.h2('3.3  Starting a project')
d.p("A **project folder** is a folder on your computer that holds your keyguard work: the "
    "keyguard designer file, your saved designs, the openings-and-additions file and your "
    "screenshots. One project folder can hold the designs for all of your students, so you "
    "don't need a new folder for each keyguard.")
d.n("**Make a new, empty folder** somewhere you'll find it again, such as Documents. Call it "
    "something like *keyguard design*.")
d.n("In the app, click **Open Project…** at the top right of the Customizer. Your browser's "
    "folder picker opens.")
d.n("Choose the new folder and click **Select Folder**. The label varies a little between "
    "browsers.")
d.n("The browser asks whether the site may view and edit files in the folder. Allow it. The "
    "wording varies: **Edit files**, **Allow** or **Allow on every visit**. Choose **Allow on "
    "every visit** when it's offered, and the browser stops asking.")
d.n("The app says **This folder has no keyguard designer file** and offers to set it up. Click "
    "**Set it up**. The app puts the current keyguard designer file and a starter "
    "openings-and-additions file into the folder, and opens the project.")
d.n("Copy your screenshot into the folder. The app notices it within a few seconds.")
d.p("The app only adds files; it never replaces one that's already in the folder. The folder "
    "name appears in the question, so you can catch a folder chosen by mistake and click "
    "**Cancel**.")
d.callout("Keep a copy of your project folder somewhere safe, such as a cloud drive or a USB "
          "stick. Your designs live only in that folder.")
d.h2('3.4  Opening a project you already have')
d.p("The app remembers the last folder you opened. When you come back, the Customizer says "
    "*last folder: keyguard design*. Click **Open Project…**, allow access if the browser asks, "
    "and the project opens without the folder picker.")
d.p("The app remembers your last eight project folders. With no project open, the box below "
    "**Open Project…** lists them; click one to open it. With a project open, the button reads "
    "**Change Project…** and lists your other folders, plus an option to pick a different one.")
d.p("A folder you made for OpenSCAD works too. The app reads and writes the same files, so your "
    "saved designs appear in the preset list.")
d.h2('3.5  The screen')
d.p("The app's window has four parts.")
fig('um-screen-labeled.png', 'Figure 1. The app with a project open. 1 the 3D view, 2 the toolbar, '
    '3 the Customizer, 4 the Console.', 6.5)
d.n("**The 3D view** shows the keyguard. Drag to turn it, scroll to zoom and right-drag to slide "
    "it. It redraws about half a second after you change a setting.")
d.n("**The toolbar** runs along the bottom of the 3D view. Section 9.2 lists its buttons.")
d.n("**The Customizer** on the right lists the settings that make up the design, with the "
    "project and preset controls above them.")
d.n("**The Console** below the 3D view keeps a running record of what the app is doing. You don't "
    "need to watch it, but it explains what went wrong when something does.")

# =====================================================================
d.h1('4.  Your First Keyguard')
d.p("This section builds a keyguard for a grid app from start to finish. It uses an iPad in a "
    "case, with a 6-row, 7-column page of an AAC app. Your numbers will differ; the steps are "
    "the same.")
d.h2('4.1  Start from the design default values')
d.p("When a project opens, the preset box at the top of the Customizer shows **design default "
    "values**: a 3 by 4 grid keyguard for an iPad 9th generation. Every setting starts here.")
d.p("Set the **Skill level** below the preset box to **Intermediate**. Beginner shows fewer "
    "settings, but it hides the screenshot and the pixel measurements, which this walkthrough uses.")
d.h2('4.2  Choose the tablet and the case')
d.p("Click a section's name to open it. In **Tablet**, choose the tablet model and the "
    "orientation the student uses, portrait or landscape.")
d.p("In **Tablet Case**, enter the height and width of the case opening and the radius of its "
    "corners, in millimeters. If the tablet has no case, set **have a case** to *no*.")
d.h2("4.3  Describe the app's layout")
d.p("An AAC app usually has bars across the top of the screen: a status bar, a message bar that "
    "shows what has been said, and a command bar of controls. The keyguard needs to know how "
    "tall each one is, so the grid starts below them.")
d.n("In **App Layout in px** or **App Layout in mm**, enter the height of each bar. Fill in one "
    "and leave the other at 0: if any number in App Layout in px is above 0, the millimeter "
    "numbers are ignored.")
d.n("In **Bar Info**, choose which bars get an opening. A message bar usually does, so the "
    "student can tap it to speak the message.")
d.n("In **Grid Info**, enter the number of rows and columns. If you give the openings' size in "
    "pixels, set their size in millimeters to 0, or the millimeter size is used instead.")
d.p("The 3D view redraws after each change.")
d.p("None of this depends on the unit of measure for the screen. That setting is only for "
    "openings placed by number (Section 7.2).")
d.h2('4.4  Check it against the screenshot')
d.p("In Special Actions and Settings, set **include screenshot** to *yes*. The screenshot "
    "appears beneath the keyguard, so you "
    "can see whether each opening sits over its button. Click the **Top** view button in the "
    "toolbar to look straight down at it.")
fig('um-underlay.png', 'Figure 2. The keyguard over the screenshot, seen from the top.', 5.5)
d.p("If the openings drift away from the buttons across the screen, check the bar heights, and "
    "that only one of App Layout in px and App Layout in mm is filled in. If the whole grid is shifted, check the case opening. If you have "
    "more than one screenshot in the folder, a picker in the 3D view lets you choose.")
d.h2('4.5  Save the design')
d.p("A red asterisk beside the preset box means you have changes that aren't saved. To keep the "
    "design under its own name:")
d.n("Click **+** beside the preset box.")
d.n("Type a name, such as the app and page the keyguard is for, and press Enter.")
d.p("The new preset holds every setting you've made. Section 6 covers presets in full.")
d.h2('4.6  Export and print')
d.n("Click **STL** in the toolbar. A Save As box opens in the project folder, with the preset's "
    "name filled in. Click **Save**.")
d.n("Open the STL file in your slicer and print it. A keyguard usually prints with its back on "
    "the build plate. One with a sloped edge prints better face down, with far less support "
    "material; the page Printing Your Keyguard on Its Face, on volksswitch.org, says when.")
d.n("Try the keyguard on the tablet. Note what to change, change those settings, save the "
    "preset and export again. Most keyguards take a couple of tries.")

# =====================================================================
d.h1('5.  The Customizer')
d.h2('5.1  Sections and settings')
d.p("The Customizer groups the settings into sections. Click a section's name to open or close "
    "it. Each setting has a name, a box, list or slider, and sometimes a short gray note.")
d.p("The keyguard designer file defines the settings, so a newer keyguard designer file can "
    "add settings. At the Advanced skill level the Customizer shows these sections:")
d.table(['Section', 'What it covers'], [
    ['Keyguard Basics', '3D-printed or laser-cut, thickness, and what to make: the keyguard, '
     'half of a split keyguard, or a clip'],
    ['Tablet', 'The tablet model, its orientation, and openings for the home button and camera'],
    ['Tablet Case', 'Whether there is a case, and the size and corners of its opening'],
    ['App Layout in px, App Layout in mm', "The heights of the app's bars, in pixels or millimeters"],
    ['Keyguard Inset Info', 'For an app shrunk to leave a border around it on the screen'],
    ['Bar Info', 'Which bars get an opening, and the slope and corners of those openings'],
    ['Grid Info', 'Rows and columns, cell size and shape, covered and merged cells, ridges and '
     'slopes'],
    ['Grid Special Settings', 'Padding around the grid, and other adjustments to it'],
    ['Mounting Method', 'How the keyguard attaches, with a section of details for each method'],
    ['Keyguard Frame Info', 'A frame that stays on the case while keyguards snap in and out'],
    ['Split Keyguard Info', 'Splitting a keyguard that is too big for the printer'],
    ['Sloped Keyguard Edge Info', 'A sloped outer edge'],
    ['Engraved/Embossed Text', 'Text and braille on the keyguard'],
    ['Cell Inserts', 'Inserts that fit into cell openings'],
    ['Free-form and Hybrid Keyguard Openings', 'The unit of measure and starting corner for '
     'openings placed by number'],
    ['Special Actions and Settings', 'The screenshot, edge chamfers, sizes for tablets not on '
     'the list, test prints of the first two layers, and the Custom Openings'],
], [2.2, 4.3], size=10)
d.h2('5.2  Skill levels')
d.p("The skill level decides how many settings the Customizer shows. Change it with the "
    "**Skill level** list below the preset box, or in Settings, General.")
d.b("**Beginner:** the settings for a basic grid keyguard.")
d.b("**Intermediate:** adds pixel measurements, more grid settings, mounting and split "
    "keyguards.")
d.b("**Advanced:** every setting, including frames, cell inserts and engraved text.")
d.p("A lower level hides settings without changing them, so a design made at Advanced keeps all "
    "its values when you switch to Beginner. At Beginner the screenshot and "
    "the pixel measurements are hidden, which is why Section 4 uses Intermediate.")
d.h2('5.3  Undo and redo')
d.p("The curved arrows near the right end of the toolbar undo and redo changes to the settings. "
    "They work until you choose another preset or close the app.")

# =====================================================================
d.h1('6.  Saving Designs as Presets')
d.p("A **preset** is a design saved by name, with all its settings. The presets live in one file "
    "in the project folder, named keyguard.json. "
    "OpenSCAD reads the same file.")
fig('um-presets.png', 'Figure 3. The top of the Customizer: the project, the preset box and its '
    'buttons, and the skill level.', 4.5)
d.table(['Control', 'What it does'], [
    ['Preset box and ▾', 'Shows the current preset. Click ▾ for the list, or use the Up and Down '
     'arrow keys to step through it. The first entry, design default values, is the keyguard '
     "designer's own starting point."],
    ['Renaming', 'Edit the name in the box and press Enter.'],
    ['+', 'Saves the current settings as a new preset. Type its name and press Enter.'],
    ['−', 'Deletes the current preset.'],
    ['Save preset', 'Saves your changes into the current preset.'],
    ['Reset', 'Throws away unsaved changes and goes back to the preset as it was last saved.'],
    ['📂', 'Opens a different preset file, such as one a colleague sent. Saving then updates that '
     'file.'],
    ['📂+', 'Adds the presets from another file to this project\'s preset file.'],
    ['📥', 'Saves the current preset as a file of its own, to share or keep as a backup.'],
], [1.6, 4.9], size=10)
d.p("A red asterisk beside the preset box means the settings differ from the saved preset. If "
    "you close the tab, refresh the page or leave while it shows, the browser asks **Leave "
    "site?** first. Choose **Cancel** to stay and save.")
d.p("You can list the presets alphabetically or in the order you made them, in Settings, "
    "General.")
d.callout("The preset file holds every design in the project. Copy it somewhere safe from time "
          "to time, along with the rest of the folder.")

# =====================================================================
d.h1('7.  Custom Openings')
d.p("Custom Openings is for openings a grid can't make: a button outside the grid, a free-form "
    "app's scene, a ridge to find by touch, a rounded corner. Click the **Custom Openings** "
    "button in the toolbar to open it. It has two tabs that show the same openings, so a change "
    "on one appears on the other.")
d.h2('7.1  The by eye tab')
d.p("On the **by eye** tab you work on the keyguard itself. Your screen openings appear as "
    "see-through pink shapes, the 3D view turns to look straight down, and the panel shrinks to "
    "a row of buttons.")
fig('um-byeye.png', 'Figure 4. Custom Openings, by eye tab, with a rectangle selected. Drag the '
    'white handles to resize it and the yellow dot to round its corners.', 6.0)
d.h3('Adding')
d.b("**+ Rectangle** and **+ Circle** put an opening 10 mm across in the middle of the screen.")
d.b("**+ Ridge**, then click the keyguard for a 10 mm ridge starting there, or press and drag "
    "to draw one, in steps of 45°. Ridges are 2 mm thick and 2 mm tall.")
d.b("**+ Rounded corner** rings every square corner that points outward. Click one to round it "
    "by 2 mm, or drag from it along an edge to choose how much.")
d.h3('Selecting, moving and shaping')
d.table(['Move', 'What it does'], [
    ['Click', 'Selects an opening, ridge or rounded corner.'],
    ['Shift-click', 'Adds another to the selection, so they move together.'],
    ['Esc', 'Lets go of the selection. With nothing selected, it closes Custom Openings.'],
    ['Drag', 'Moves what you drag. Dragging anywhere else turns the keyguard.'],
    ['Shift + drag', 'Keeps to a straight line.'],
    ['Ctrl + drag', 'Leaves a copy behind and drags the copy.'],
    ['Arrow keys', 'Nudge the selection 1 mm. Hold Shift for 10 mm.'],
    ['Handles', "Drag one to resize an opening, or drag a ridge's end to lengthen, shorten or "
     "swing it. Hold Shift on a corner handle to keep a rectangle's proportions, and Ctrl to "
     "grow or shrink it around its center; Ctrl on a ridge's end moves both ends. Drag a "
     "circle's side handle to stretch it into a hot dog, a long opening with fully rounded "
     'ends.'],
    ['Yellow dot', "Drag it to round a rectangle's corners, or to change a rounded corner."],
    ['Delete', 'Removes the selection.'],
    ['Ctrl+Z or Undo', 'Takes back the last change: a whole drag, or a whole run of arrow-key '
     'nudges.'],
    ['Ctrl+Y or Redo', 'Puts back a change you took back. Undo and Redo are at the bottom of the '
     'panel, and work on both tabs.'],
], [1.6, 4.9], size=10)
d.p("On a Mac, use the Command key where this manual says Ctrl. To look at the keyguard square "
    "on again after turning it, click the **Top** view button in the toolbar.")
d.p("An opening can be dragged past the edge of the screen, which is how you reach the area "
    "around it. Working by eye in pixels needs a recent keyguard designer file; if yours is "
    "older, the tab says so, and millimeters work with any version.")
d.h2('7.2  The pixels or millimeters tab')
d.p("This tab lists the same openings as numbers. Use it to type an exact position, or to check "
    "one you placed by eye.")
fig('um-table.png', 'Figure 5. Custom Openings, pixels or millimeters tab.', 6.0)
d.b("**Screen openings** are measured in the unit of measure for the screen, pixels or "
    "millimeters, from its starting corner. Both are set in Free-form and Hybrid Keyguard "
    "Openings, and the heading says which. Set them before you type: changing the unit later "
    "converts these openings so they stay put, but not the ones in the openings and additions "
    "file.")
d.b("**Case openings** are measured in millimeters from the lower-left corner of the case "
    "opening. They're for openings outside the screen, and they live only on this tab.")
d.b("Each opening is positioned by its center. For a circle, the height is the diameter. A hot "
    "dog takes only a height and a width. Every change on this tab can be undone.")
d.b("A tinted box holds a number you've changed but not applied. Press Enter, or click another "
    "box, to update the keyguard.")
d.b("**+ Add opening** adds a row. Ridges are listed here too, with their angle; a ridge's x and "
    "y are its left end, or its bottom end if it stands upright.")
d.h2('7.3  Saving your openings')
d.p("**Save** puts your openings into the design, and **Cancel** or **✕** closes without them. If "
    "you've changed anything, the app asks before throwing it away.")
d.p("Saving in Custom Openings changes the design but doesn't save the preset. The red asterisk "
    "appears beside the preset box: click **Save preset** to keep the openings.")
d.callout("The **?** button's Help menu has a card of every Custom Openings move, so you can "
          "check one without leaving the app.")

# =====================================================================
d.h1('8.  The Openings-and-Additions File')
d.p("The file openings_and_additions.txt in the project folder is another place to describe "
    "openings and additions, written as lines of text. It can do things Custom Openings "
    "doesn't, such as adding shapes to the case area or engraving text in one spot.")
d.p("Open it in any text editor, such as Notepad, TextEdit or Notepad++. While a project is "
    "open, the app checks the file about every second and a half, and redraws the keyguard when "
    "you save a change. The line under the project name says *watching project folder*.")
d.p("The file explains its own columns at the bottom. The page Putting Instructions in the O&A "
    "File, on volksswitch.org, covers it in full.")
d.p("The app watches the screenshot the same way, so a new screenshot saved over the old one "
    "shows up on its own. It doesn't watch the keyguard designer file; open the project again "
    "after replacing that.")

# =====================================================================
d.h1('9.  Looking at the Keyguard')
d.h2('9.1  Turning, zooming and sliding')
d.b("**Drag** to turn the keyguard.")
d.b("**Scroll** to zoom in and out.")
d.b("**Right-drag** to slide it across the view.")
d.p("Settings, Viewport sets how dragging turns it. **Free tumble** rolls it in any direction "
    "and is the default. **Guided tumble** adds a ring guide, and double-clicking a point centers "
    "the view on it. **Turntable** spins it around an upright line. The same tab sets how fast it "
    "turns and zooms.")
d.h2('9.2  The toolbar')
fig('um-toolbar-compact.png', 'Figure 6. The toolbar. The empty middle of the strip is left out.', 6.5)
d.table(['Button', 'What it does'], [
    ['Render (circular arrow)', 'Redraws the keyguard now. The app redraws on its own after each '
     'change, so you rarely need it.'],
    ['View All (four corners)', 'Fits the whole keyguard in the view.'],
    ['Six cube buttons', 'Look from the top, bottom, front, back, left or right.'],
    ['Show Axes', 'Shows a small marker of the x, y and z directions in the lower-left corner.'],
    ['Show grid', "Shows a grid the size of your printer's build plate beneath the keyguard. Set "
     'its size in Settings, Grid.'],
    ['Custom Openings', 'Opens Custom Openings (Section 7).'],
    ['STL, STL*, SVG, PNG', 'Export the design (Section 10).'],
    ['Undo, Redo', 'Undo and redo changes to the settings.'],
    ['?', 'Opens the Help menu (Section 13.1).'],
    ['Settings (gear)', 'Opens Settings (Section 12).'],
], [2.0, 4.5], size=10)

# =====================================================================
d.h1('10.  Exporting')
d.p("Each export button opens a Save As box. The first time, it opens in the project folder, "
    "with the preset's name filled in; after that, it opens wherever you last saved.")
d.table(['Button', 'What you get', 'Use it for'], [
    ['STL', 'A 3D file, made in seconds', 'Printing. Open it in your slicer.'],
    ['STL*', 'The same 3D file, made the slower, more precise way OpenSCAD makes it',
     'A design your slicer reports problems with. It can take minutes.'],
    ['SVG', 'A flat drawing of the keyguard', 'Laser cutting. Set the type of keyguard to '
     'Laser-Cut first.'],
    ['PNG', 'A picture of the 3D view as it looks now', 'Showing a design to a colleague or a '
     'family.'],
], [0.9, 2.7, 2.9], size=10)
d.p("A frame and a keyguard that snaps into a frame can't be laser-cut. For a split keyguard, "
    "export each half: set **generate** in Keyguard Basics to the first half, export, then to "
    "the second half and export again.")

# =====================================================================
d.h1('11.  Sharing a Design')
d.p("To send a design to a colleague or a maker:")
d.n("Choose the design in the preset box and click **📥** to save it as a file of its own.")
d.n("Send that file with the screenshot, and with the openings-and-additions file if the design "
    "uses it.")
d.p("They put the files in a project folder of their own, open it in the app, and click **📂+** "
    "to add your design to their presets. If they only need to print, send the STL file "
    "instead.")
d.p("Many clinicians name designs after students. Check the names before you share a file "
    "outside your team.")

# =====================================================================
d.h1('12.  Settings')
d.p("Click the gear at the right end of the toolbar. Settings apply to the app on this "
    "computer, not to a design.")
d.table(['Tab', "What's on it"], [
    ['General', 'Skill level, the order of the preset list, and how far the Customizer scrolls '
     'each step.'],
    ['Viewport', 'How dragging turns the keyguard, how fast it turns and zooms, and the lighting.'],
    ['Grid', "The size of the reference grid. Set it to your printer's build plate to see "
     'whether a design fits.'],
    ['Text', "Text size and style in the Customizer, for reading at a distance or on a "
     'high-resolution screen.'],
    ['Colors', 'Light or dark panels, the keyguard\'s color, and the 3D view\'s background.'],
    ['Troubleshooting', 'Check my setup, Report a problem, recent problems and Reload the app '
     '(Section 13).'],
    ['About', "The app's release number, your keyguard designer file's version, the license and "
     'Reload the app.'],
], [1.6, 4.9], size=10)

# =====================================================================
d.h1('13.  Getting Help')
d.h2('13.1  The Help menu')
d.p("The **?** button beside the gear opens the Help menu.")
fig('um-help.png', 'Figure 7. The Help menu.', 3.0)
d.b("**Custom Openings moves:** a card of every move, built into the app.")
d.b("**Web app guide**, **Keyguard how-to pages** and **Known issues** open pages on "
    "volksswitch.org in a new tab.")
d.b("**Check my setup** opens Settings, Troubleshooting and runs the check. **Report a "
    "problem** opens the same tab at the report.")
d.b("**Contact Volksswitch** starts an email to Volksswitch.")
d.p("The menu and the moves card are part of the app, so they work on a network that blocks "
    "volksswitch.org.")
d.h2('13.2  Check my setup')
d.p("In Settings, Troubleshooting, **Check my setup** checks what the app needs from this "
    "computer, browser and network. It looks at the browser and the project folder, whether the "
    "app can reach its own address, whether your keyguard designer file is the newest, and "
    "whether the 3D view works. "
    "Each result says what to do about anything that's wrong, including when it's one for your "
    "IT department.")
fig('um-check.png', 'Figure 8. The Troubleshooting tab after Check my setup.', 5.5)
d.h2('13.3  Report a problem')
d.p("Write a line about what happened. The app adds what Volksswitch needs to see the problem: "
    "the app's release, your keyguard designer file's version, your browser and your design's "
    "settings. The whole report is shown, so you can read it before it goes anywhere.")
d.p("The report leaves out folder, file and design names, and any text engraved on the keyguard "
    "becomes X's. The app sends nothing itself:")
d.b("**Copy report** puts it on the clipboard.")
d.b("**Email report…** copies it and opens a new message in your own email, addressed to "
    "Volksswitch.")
d.b("**Save report…** saves it as a text file.")
d.h2('13.4  Recent problems and reloading')
d.p("**Recent problems** lists the errors since the app was opened, without the Console's routine "
    "messages, and explains the common ones.")
d.p("**Reload the app** starts the app fresh and picks up its newest version. Use it any time the "
    "app looks wrong or seems stuck; you'll need to open your project again. It's on the About "
    "tab too.")

# =====================================================================
d.h1('14.  Keeping Up to Date')
d.h2('14.1  The app')
d.p("The app updates itself. When a new release is out, the app loads it the next time you open "
    "it or open a project, and a **What's new** notice lists the changes. The release number is "
    "on Settings, About.")
d.h2('14.2  The keyguard designer file')
d.p("When a newer keyguard designer file is published, the app offers it as you open a project. "
    "The **Keyguard update available** box shows your version, the new one and what changed.")
d.b("**Update now** downloads the new file, puts it in place of the old one in your folder and "
    "opens the project again.")
d.b("**Remind me in a week** keeps your current file and asks again in a week.")
d.b("**Skip** keeps your current file for now.")
d.p("Your designs come through an update unchanged. Some features need a recent keyguard designer "
    "file, such as placing openings by eye in pixels.")

# =====================================================================
d.h1('15.  Troubleshooting')
d.table(['What you see', 'What to do'], [
    ['The Open Project button does nothing, or the app asks you to use Chrome or Edge',
     'Use Chrome or Edge. Safari and Firefox can\'t open a project folder.'],
    ['The browser asks again for access to the folder', 'Choose Allow, or Allow on every visit '
     'to stop the question.'],
    ['The keyguard stops updating, and the Console says memory access out of bounds',
     'A large design used up the 3D engine\'s working memory. Click Reload the app on the '
     'Troubleshooting or About tab, then open the project again. Your design is safe.'],
    ['The keyguard looks wrong', 'Read the Console. It usually names a setting that is out of '
     'range, or a line in the openings-and-additions file the designer couldn\'t read.'],
    ['The openings don\'t line up with the screenshot', 'Check the bar heights, that only one of '
     'App Layout in px and App Layout in mm is filled in, and the case opening. A screenshot from '
     'a different tablet or orientation won\'t line up.'],
    ['An opening\'s size in pixels makes no difference', 'Set its size in millimeters, in Grid '
     'Info, to 0. The millimeter size is used whenever it isn\'t 0.'],
    ['The by eye tab won\'t place openings in pixels', 'Accept the keyguard designer update when '
     'it\'s offered, or switch the unit of measure to mm.'],
    ['Your slicer reports problems with the STL', 'Export with STL* instead.'],
    ['Your presets are missing, or the app says the preset file is damaged', 'The file was '
     'probably edited in a text editor. The app won\'t write to a damaged file, so your designs '
     'aren\'t lost; restore the file from your backup copy.'],
    ['The app never offers updates', 'Run Check my setup. Your network may be blocking the app\'s '
     'address.'],
], [2.6, 3.9], size=10)
d.p("The Known Issues page on volksswitch.org lists the problems already known. If yours isn't "
    "there, use **Report a problem**.")

# =====================================================================
d.h1('16.  Designing for Conversant AAC')
d.p("Conversant AAC, also from Volksswitch, can write out where each of its buttons sits on the "
    "screen. The keyguard designer reads that list directly, so you don't measure the buttons.")
d.n("In Conversant, open Settings, **Keyguard Design**. Enter the title bar height and click "
    "**Generate Screen Openings**. Conversant saves a file named Screen Openings.txt in its data "
    "folder, and says what size of screenshot it expects.")
d.n("Take a screenshot of Conversant at that size and copy it into your keyguard project folder.")
d.n("In the Keyguard Designer, set **unit of measure for screen** to *px* and **starting corner "
    "for screen measurements** to *upper-left*.")
d.n("Open openings_and_additions.txt in a text editor. Paste the lines from Screen Openings.txt "
    "between the line screen_openings=[ and the line ]; and save the file.")
d.n("Set **include screenshot** to *yes* and check that each opening sits over its button.")
d.p("Conversant's Keyguard Design tab also sets the spacing between its controls. A change there "
    "moves the buttons, so it needs a new Screen Openings file and a new keyguard.")

# =====================================================================
d.h1('17.  Glossary')
for term, text in (
    ('AAC', 'Augmentative and alternative communication: ways to communicate other than speech, '
            'such as an app that speaks the button a person presses.'),
    ('Bar', "A strip across the top or bottom of an AAC app: the status bar, a message bar that "
            "shows what has been said, or a command bar of controls."),
    ('Case opening', 'The window in a tablet case that the screen shows through.'),
    ('Cell', 'One opening in a keyguard, over one button of the app.'),
    ('Console', 'The record of what the app is doing, below the 3D view.'),
    ('Custom Openings', "Openings a grid can't make, placed by eye or by typing their positions."),
    ('Customizer', 'The list of settings on the right of the app.'),
    ('Free-form app', 'An AAC app whose buttons can sit anywhere, such as a scene.'),
    ('Hybrid app', 'An AAC app with a grid and buttons outside it.'),
    ('Keyguard designer file', 'keyguard.scad: the program that turns the settings '
                               'into a keyguard. The app runs it; OpenSCAD can run it too.'),
    ('OpenSCAD', 'A free design program you install on a computer. It runs the same keyguard '
                 'designer file and reads the same presets.'),
    ('Openings-and-additions file', 'openings_and_additions.txt, a text file in the project '
                                    'folder that describes extra openings and additions.'),
    ('Preset', 'A design saved by name, with all its settings.'),
    ('Project folder', 'The folder on your computer where the app reads and saves your work.'),
    ('Skill level', 'Beginner, Intermediate or Advanced: how many settings the Customizer shows.'),
    ('Slicer', 'The program that prepares a 3D file for a 3D printer.'),
    ('STL', 'The 3D file a slicer reads.'),
    ('SVG', 'The flat drawing a laser cutter reads.'),
):
    d.p(f'**{term}.** {text}')

# =====================================================================
d.h1('18.  More Information')
d.b('**The app:** keyguard.volksswitch.org')
d.b('**Keyguard Designer pages,** on measuring, printing, mounting and the openings-and-additions '
    'file: volksswitch.org, under Volks-Devices')
d.b('**Known issues:** volksswitch.org/index.php/keyguard-designer-known-issues/')
d.b('**Questions:** ken@volksswitch.org')

d.save(OUT)
print('saved', OUT)
