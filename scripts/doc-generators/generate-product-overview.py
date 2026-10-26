"""Builds Documents/Keyguard Designer Product Overview.docx.

The plain-language overview a clinician hands to a colleague or an administrator: what
the Keyguard Designer is for, how it works and what it takes to start. Its figures come
from the interview study (2 P-R/Presentations/Holy Grail/.../3D-Printed Keyguards -
Interview Analysis Report.docx, March 2026). Every statement about the app was checked
against app.html and keyguard.scad when it was written.

⚠ A generator rewrites the whole document. Once Ken has edited the .docx by hand, the
.docx is the newer copy: edit it directly, or fold his changes back into this script
before running it again (the same warning as Conversant's doc-generators/README.md).

    python scripts/doc-generators/generate-product-overview.py [output.docx]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kg_docstyle import DOCUMENTS, KgDoc  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
    DOCUMENTS, 'Keyguard Designer Product Overview.docx')
UPDATED = 'October 26, 2026'

d = KgDoc(footer='Keyguard Designer Product Overview')
d.title_block('Keyguard Designer', 'Custom Keyguards, Designed in Your Browser',
              f'Kenneth R. Hackbarth  |  Volksswitch.org  |  Last updated {UPDATED}')

d.p("A keyguard is a plastic plate that sits over a tablet's screen. Its openings line up with "
    "the buttons of an AAC app, so a person with limited hand control can rest a hand on the "
    "screen and still press one button at a time.")
d.p("The Keyguard Designer is a free tool for designing keyguards that you print on a 3D "
    "printer or cut on a laser cutter. It runs in Chrome or Edge on Windows, Chromebook and "
    "Mac. You don't install anything, and your designs stay in a folder on your own computer.")
d.p("This overview covers what the designer is for, how it works and what you need to start. "
    "Its figures come from 20 interviews with speech-language pathologists, occupational "
    "therapists and assistive technology specialists, held between November 2025 and January "
    "2026.")

# ---------------------------------------------------------------------
d.h1('Who keyguards help')
d.p('The clinicians interviewed named these groups most often:')
for t in ('Children with autism', 'Students with cerebral palsy and other neuromotor conditions',
          'People with fine motor difficulties or poor hand-eye coordination',
          'Children with low vision or cortical visual impairment',
          'Young children who are new to AAC',
          'Students with low muscle tone who need to rest a hand',
          'People with tremors'):
    d.b(t)
d.p("A keyguard lets the hand rest on the screen without pressing anything. It guides the "
    "finger into the right button and cuts down on near misses, and users say they're faster "
    "with one. For some students it's a stepping stone: they use it while their motor skills "
    "develop, then work without it.")
d.quote("It allows them to focus better. It allows them to access better... the keyguard allows "
        "her to keep her hand there, but still press on the actual icon of what she wants to say.",
        'Occupational therapist and assistive technology professional')

# ---------------------------------------------------------------------
d.h1('What it costs to buy one')
d.p("Most clinicians buy keyguards from a specialist company. The clinicians interviewed paid "
    "$60 to $150 each, and a typical tablet keyguard costs about $100 once shipping is added. "
    "Through a school's purchasing process, one takes 6 to 12 weeks to arrive.")
d.p("Ordering is easy to get wrong. The order form asks for the tablet model and generation, "
    "the case brand and model, the AAC app and the grid layout. One clinician received a "
    "keyguard that wasn't the one ordered about 30% of the time.")
d.p("Cost and delay also stop teams from trying more than one design. A student's first "
    "keyguard is rarely the best fit, but few teams can order a second and a third to compare.")
d.quote("By the time we get one in, the kid doesn't need it anymore. Their skills have increased "
        "so much.", 'Speech-language pathologist')

# ---------------------------------------------------------------------
d.h1('What it costs to print one')
d.p("A printed keyguard uses about $1.50 of plastic and is ready the same day or the next. The "
    "20 clinicians interviewed had printed more than 700 keyguards between them, and estimated "
    "their savings at more than $68,950.")
d.b("**A printer costs about as much as a few bought keyguards.** At about $100 per keyguard, "
    "a $300 printer costs the same as three and a $1,200 printer the same as twelve. Most "
    "organizations print that many within one to three months.")
d.b("**Trying another version costs another $1.50.** Teams went through five or six versions "
    "for some students to find the best fit.")
d.b("**Printing makes keyguards nobody sells.** A keyguard can be any color: one student "
    "ignored his device until his keyguard was red. It can carry raised ridges to find by "
    "touch, openings with sloped sides that guide the finger, and covered cells that open one "
    "at a time as a student learns more words, while the layout stays the same.")
d.b("**The printer goes on to make more.** Three in four of the clinicians interviewed went on "
    "to print other assistive technology, such as switch plates, grips and device holders.")
d.p("In school districts a printer usually can't be bought with funds set aside for one "
    "student, so it comes from a STEM or general budget instead.")

# ---------------------------------------------------------------------
d.h1('Where clinicians get stuck')
d.p("Designing is the hard step. Measuring the tablet, the case and the app takes care, and "
    "most clinicians print a keyguard, try it and adjust the numbers at least once. Only 5 to "
    "10% of the clinicians interviewed had any keyguard training in graduate school; most "
    "learned at conferences and from colleagues.")
d.p("The design program itself has been a barrier too. The keyguard designer was written for "
    "OpenSCAD, a free program you install on your computer. OpenSCAD isn't intuitive for people "
    "who aren't engineers, and many school and hospital computers don't let staff install "
    "programs.")
d.quote("Our IT department was very non-supportive. They felt like we needed a diploma to print "
        "a keyguard.", 'Speech-language pathologist')
d.p("The Keyguard Designer web app removes the installation, and keeps the design program "
    "clinicians already use.")

# ---------------------------------------------------------------------
d.h1('What the Keyguard Designer is')
d.b("**A web page that works like a program.** Open keyguard.volksswitch.org in Chrome or Edge. "
    "There's no account and no installation, so you don't need administrator rights. You can "
    "also add it from the browser so it opens in its own window, like any other program.")
d.b("**A folder on your computer holds your work.** You choose a folder, called a project "
    "folder, and the app reads and saves files only there. Nothing is uploaded anywhere.")
d.b("**A keyguard you can see as you design it.** A 3D view shows the keyguard and redraws it "
    "about half a second after you change a setting. You can turn it to look at any side.")
d.b("**The same designer OpenSCAD runs.** The app runs keyguard.scad, the keyguard designer "
    "file that OpenSCAD runs. Both use the same files, so you can move between them.")

# ---------------------------------------------------------------------
d.h1('How it works')
d.n("**Measure.** Find the tablet model and the case, and measure the case opening. Take a "
    "screenshot of the AAC app on the tablet and read the positions of its buttons from it in "
    "pixels, or measure them on the screen in millimeters.")
d.n("**Open a project folder.** Make an empty folder and point the app at it. The app puts the "
    "keyguard designer file in it, and you add the screenshot.")
d.n("**Choose the settings.** The Customizer lists the settings: the tablet, the case, the "
    "number of rows and columns, and how the keyguard attaches. A skill level keeps the list "
    "short while you learn.")
d.n("**Check it against the screenshot.** The screenshot can show beneath the keyguard, so you "
    "can see whether each opening sits over its button.")
d.n("**Add the openings a grid can't make.** Custom Openings lets you draw rectangles, circles, "
    "ridges and rounded corners straight onto the keyguard, or type their positions.")
d.n("**Save the design.** Each design is saved by name in the project folder, so one folder "
    "holds the designs for many students.")
d.n("**Make it.** Export a file for a 3D printer's slicing program, or for a laser cutter.")
d.n("**Try it on the tablet and adjust.** Change a setting, export again and print again.")

# ---------------------------------------------------------------------
d.h1('What you can design')
d.b("**Any kind of AAC app.** Grid apps, free-form apps whose buttons can sit anywhere, and "
    "hybrid apps that mix the two.")
d.b("**For more than 110 tablets and AAC devices,** including iPads, Samsung Galaxy and Amazon Fire "
    "tablets, Microsoft Surface, and dedicated devices from Tobii Dynavox, PRC-Saltillo and "
    "others. Any other tablet works once you enter its size.")
d.b("**Openings of many kinds.** Rectangular or circular cells, covered cells, merged cells, "
    "ridges around chosen cells, sloped sides, and openings for the app's message and command "
    "bars.")
d.b("**Ways to attach it.** To fit inside a case or on a bare tablet, held by suction cups, "
    "Velcro, straps, posts, a shelf, tabs or magnets. A frame can stay on the case while "
    "keyguards snap in and out of it.")
d.b("**Keyguards too big for the printer,** split into two halves that join with dovetails.")
d.b("**Text and braille,** engraved into or raised from the surface.")
d.b("**3D-printed or laser-cut.** The same design exports for either.")

# ---------------------------------------------------------------------
d.h1('What makes it different')
d.h2('Nothing to install')
d.p("The app runs in Chrome or Edge, which most managed computers already have. Your IT "
    "department allows one web address and the app runs; nobody installs a program.")
d.h2('Your files stay on your computer')
d.p("The app works only in the folder you choose. It has no accounts, analytics or advertising, "
    "and it contacts only its own address: to load itself and to check for updates. Those "
    "checks carry nothing about you or the people you serve.")
d.h2('It works on school networks')
d.p("Many school and hospital networks block sites they don't recognize. Because everything "
    "comes from the app's own address, a network that lets the app open also lets its updates "
    "through.")
d.h2('It keeps itself up to date')
d.p("A newer release of the app arrives the next time you open it, and tells you what's new. "
    "When a newer keyguard designer file is published, the app offers it the next time you open "
    "a project, with notes on what changed. You can update then, be reminded in a week, or "
    "skip it.")
d.h2('It works with OpenSCAD')
d.p("The app and OpenSCAD read and write the same files. Designs saved in one open in the other, "
    "so clinicians who already use OpenSCAD keep their work.")
d.h2('Help is built in')
d.p("A **?** button opens a Help menu with a card of the Custom Openings moves, links to the "
    "how-to pages and known issues, and two tools. **Check my setup** tests the browser, the "
    "project folder and the network, and says what to ask IT for if something is blocked. "
    "**Report a problem** writes a report you read first and send from your own email; it "
    "leaves out folder, file and design names.")
d.h2('Free and in the public domain')
d.p("The Keyguard Designer costs nothing and has no subscription. It's released into the public "
    "domain (CC0), and its source code is on GitHub.")

# ---------------------------------------------------------------------
d.h1('What you need')
d.b("**A computer with Chrome or Edge:** a Windows PC, a Chromebook or a Mac. The app doesn't "
    "work in Safari or Firefox, or on an iPad or Android tablet, because those browsers can't "
    "open a folder on your computer.")
d.b("**A 3D printer or a laser cutter, or someone with one.** The app designs the keyguard and "
    "doesn't print it. A colleague, a school's STEM program or a library makerspace can print "
    "from the file you export.")
d.b("**The tablet's details.** Its model, its case, and a screenshot of the AAC app.")
d.b("**On a managed computer, one web address allowed.** Volksswitch provides a one-page "
    "letter to forward to IT, and a security overview for IT reviewers.")

# ---------------------------------------------------------------------
d.h1("Who it's for")
d.b("**Clinicians who support AAC users:** speech-language pathologists, occupational "
    "therapists, assistive technology specialists, teachers of students with visual "
    "impairments, and teachers.")
d.b("**Makers and STEM students** who print keyguards for them.")
d.b("**Administrators** deciding whether a printer is worth buying.")

# ---------------------------------------------------------------------
d.h1('Try it')
d.p("Open **keyguard.volksswitch.org** in Chrome or Edge. The User Manual walks through a first "
    "keyguard step by step, and the Keyguard Designer pages on volksswitch.org cover measuring, "
    "printing and mounting. Questions go to Volksswitch at ken@volksswitch.org.")

# ---------------------------------------------------------------------
d.h1('Glossary')
for term, text in (
    ('AAC', "Augmentative and alternative communication: ways to communicate other than "
            "speech, such as an app that speaks the button a person presses."),
    ('App layout', "Where the AAC app's buttons and bars sit on the screen."),
    ('Bar', "A strip across the top or bottom of the AAC app, such as a message bar that shows "
            "what has been said, or a command bar of controls."),
    ('Case opening', "The window in a tablet case that the screen shows through. A keyguard "
                     "for a tablet in a case fits inside it."),
    ('Cell', "One opening in a keyguard, over one button of the app."),
    ('Custom Openings', "The part of the app for openings a grid can't make, placed by eye on "
                        "the keyguard or by typing their positions."),
    ('Customizer', "The list of settings on the right of the app."),
    ('Free-form app', "An AAC app whose buttons can sit anywhere, such as a scene with things "
                      "to touch."),
    ('Grid app', "An AAC app whose buttons sit in rows and columns."),
    ('Hybrid app', "An AAC app with a grid and buttons outside it."),
    ('Keyguard designer file', "keyguard.scad, the program that turns your settings into a "
                               "keyguard. The app runs it; OpenSCAD can run it too."),
    ('OpenSCAD', "A free design program you install on a computer. It also runs the keyguard "
                 "designer file."),
    ('Openings-and-additions file', "openings_and_additions.txt, a text file in the project "
                                    "folder that lists extra openings and additions."),
    ('Preset', "A design saved by name, with all its settings. A project folder can hold many."),
    ('Project folder', "The folder on your computer where the app reads and saves your work."),
    ('Skill level', "Beginner, Intermediate or Advanced. It decides how many settings the "
                    "Customizer shows."),
    ('Slicer', "The program that turns a 3D file into instructions for a 3D printer, such as "
               "PrusaSlicer, Bambu Studio or Cura."),
    ('STL', "The 3D file a slicer reads."),
    ('SVG', "The flat drawing a laser cutter reads."),
):
    d.p(f'**{term}.** {text}')

d.save(OUT)
print('saved', OUT)
