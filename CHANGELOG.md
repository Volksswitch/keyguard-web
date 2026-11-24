# Changelog — Keyguard Designer (web)

Clinician-facing notes of what changed in each release. Internal test,
build, and quality-tooling changes are intentionally left out — this list
covers only what you can see or do differently in the app.

The release number shown here matches the one on **Settings → About**.

**Numbering starts at 101.** Releases 3–21 belong to this app's previous address
(`volksswitch.github.io/keyguard-designer-web`), which is frozen and keeps its own
changelog. Release 100 was the first at `keyguard.volksswitch.org` and carried no
notes, because nothing at this address could have been missed yet.

## Unreleased (next release)

## Release 129

- **The keyguard shown inside its keyguard frame is now a deeper pink.** With a screenshot behind the frame, the lighter pink was hard to make out. Pink highlights on the frame's own openings take the same deeper pink while the keyguard is shown, and highlights on a keyguard by itself are unchanged.

## Release 128

- **Open Project… no longer does nothing when the browser stops answering about your folder.** Release 127 made the app say so when the browser couldn't open the folder it remembered for you. But the browser can also go quiet without saying anything, and then clicking **Open Project…** or your folder in **Recent projects** still did nothing at all. Now the app shows “Opening” and your folder's name as soon as you click. If the browser hasn't answered within a few seconds, the app tells you it couldn't open the folder and offers **Pick a different folder…** so you can choose it again. And if, after several seconds, the browser still hasn't let the app use your folder, a message says what to do if the browser isn't asking you anything, with a **Pick a different folder…** link of its own. Your designs are safe in the folder the whole time.

## Release 127

- **If the app can't open the folder it remembered for you, it now says so and helps you pick it again.** The browser keeps its own memory of your project folder, and once in a while that memory goes bad, most often after a browser update. Until now, clicking **Open Project…** or your folder in **Recent projects** then did nothing at all, and the only cure was to clear the site's data in the browser's settings. Now a message tells you the folder couldn't be opened, the app forgets it, and the message's **Pick a different folder…** button opens the folder picker so you can choose the same folder again. Your designs are safe the whole time: they live in the folder, not in the browser.
- **Recent projects now ends with Pick a different folder….** With no project open, the **Recent projects** list under **Open Project…** has the same **Pick a different folder…** choice that **Change Project…** has. It always goes straight to the folder picker, skipping the folder the app remembers.
- **Snap's dashed lines now say what they are.** On the “by eye” tab of Custom Openings, each dashed line that appears as a shape lines up carries a label, such as “middle of the screen”, “middle of the grid”, “edge of an opening” or “middle of a support”, so you know exactly what your shape has lined up with. Where two lines fall in the same place, both are named: “middle of the screen and the grid”. The label stays in view however you turn or zoom the keyguard, and moves along its line rather than hide behind the Custom Openings window.
- **Snap now lines shapes up with the edges of the screen and the grid.** As you move or size a shape on the “by eye” tab, its left, right, top or bottom edge lines up with the matching edge of the screen or of the grid, and a ridge or support lines up by its ends, so you can, for example, stop a support exactly at the top of the grid. The label names the edge: “top edge of the grid”, or “left edge of the screen and the grid” where they fall together. Lining up with the grid's edges needs version 100 or later of the keyguard designer file; with an older one, shapes line up with the screen's edges and the grid's middle.
- **A shape you line up with the screen or the grid now stays lined up.** On the “by eye” tab, when **Snap** lines a shape up with the middle or an edge of the screen or of the grid, the app remembers the line, not just the number. If you later change the tablet, the padding or the bars, the shape moves with its line instead of staying a fixed distance from the screen's corner. A support drawn from the grid's left edge to its right edge stays exactly as long as the grid is wide. On the “pixels or millimeters” tab, a number that is lined up says so underneath, for example “= middle of grid” or “starts on left edge of grid”. Dragging the shape off its line, nudging it with the arrow keys or typing a number in its place lets go of the line. Lining up with the middle or edges of something else, such as another opening, still saves a plain number. This needs version 100 or later of the keyguard designer file for the grid; with an older one, only the screen's lines are remembered.
- **Snap no longer lines shapes up with the middle of the keyguard.** Everything on the “by eye” tab is measured from the screen, so a shape lined up with the middle of the keyguard was really placed at a distance from the screen's corner, and changing the case opening could leave it off center. When the sides of your case opening are unequal, the two middles are close enough to mistake for each other. Line shapes up with the middle of the screen or the grid instead.
- **A ridge or support you draw now snaps where it starts.** With **Snap** ticked, the spot where you press to draw a ridge or support lines up with a nearby middle or edge, across and up and down, so a support drawn up from the middle of the screen really sits on that middle. Until now only its length lined up as you drew it, and the bar itself stayed wherever you pressed.

## Release 126

- **You can now add a support by eye.** A support is a flat bar that stiffens the keyguard across an opening without standing above it. The “by eye” tab of Custom Openings has a new **+ Support** button. Press it, then click on the keyguard for a 10 mm support starting where you clicked, or press and drag to draw one across an opening, either across or up and down. A support starts 2 mm wide. Where it meets the keyguard it gets fillets that round off the corners it makes, and they start with the corner radius of the opening you drew it across: a cell's corner radius, or the corner radius of the custom opening it lies in. On the “pixels or millimeters” tab you can change a support's width (under **height / width**), its length and its fillet radius (under **corner radius**), and turn it between 0° and 90°. Supports need version 99 or later of the keyguard designer file; until you have it, the **+ Support** button is greyed out.
- **Shapes can now snap into line on the “by eye” tab.** Tick the new **Snap** box and, as you move or size an opening, ridge or support, its middle lines up with the middle of the keyguard, the middle of the screen, the middle of the grid or the middle of another opening, across and up and down, once it comes close; a dashed line shows what it lined up with. Other openings means your other custom openings, ridges and supports, and every opening the keyguard already has: its cells, its bars and the openings in your openings-and-additions file. A support laid across a cell lines up with the middle of that cell, even though it divides it in two. The middle of the keyguard is the middle of the keyguard itself, so if your case opening's sides are unequal it is not the same line as the middle of the screen. Edges line up too: the left, right, top or bottom edge of the shape you are moving lines up with an edge of another opening, and when you size a shape by a handle, the edge you are dragging does. Whichever line is nearest wins, middle or edge. A ridge or support lines up by its ends as well as its middle, so you can stop a support exactly at the wall of the opening it crosses. Hold **Alt** while you drag to place a shape freely. Nudging with the arrow keys never snaps, and the box stays as you left it. Lining up with the grid needs version 99 or later of the keyguard designer file; with an older one, shapes snap to the keyguard and the screen.

## Release 125

- **Changing the starting corner no longer moves your custom openings.** Switching **starting corner for screen measurements** between upper-left and lower-left used to leave the numbers as they were and measure them from the other corner, so every opening you placed with Custom Openings jumped to the opposite end of the keyguard, top to bottom. Now each opening is re-measured from the new corner, so it stays exactly where it was, just as it does when you change the unit of measure. One Undo takes back the corner and the conversion together. Screen openings typed into your openings-and-additions file are still yours to change.

## Release 124

- **When a file isn't saved, the app no longer says you canceled.** If the Save As window closes without saving an STL, SVG, picture, console or problem report, the console says the file wasn't saved. It explains that Chrome may have refused the folder you chose. Chrome reports this the same way as choosing Cancel, so before this release the app said "export canceled" even when you had clicked Save. Try another folder, such as Downloads. If Chrome refuses every folder, your organization may block saving files from websites, and your IT department can tell you.

## Release 123

- **A project or presets file with saved designs now opens on a saved design.** It shows the first design in the preset list, in your chosen sort order, so a file someone sends you opens on their design instead of the design default values. **design default values** is still first in the list whenever you want it, and it's what you see when nothing has been saved yet. Before you change settings and click **+** to make a new design, check that the preset box shows the design you want to begin from.
- **Importing designs no longer moves you off the design you're working on.** The imported designs are added to the preset list, a message tells you they're there, and your design stays on screen with any unsaved changes intact.

## Release 122

- The **Recent changes** box in Settings → About now shows the keyguard designer file's changes even when you're offline. It no longer has to reach the internet when you open the About tab.

## Release 121

- **You can look back at what's new whenever you like.** Settings → About now has a **Recent changes** box listing every change to the app and to the keyguard designer file over the last three months, newest first, each with its release or version number and the day it came out. It scrolls, and its **Copy** button copies the whole list so you can paste it into a document or an email and print it. The app's own changes are there even offline; the keyguard designer file's need a connection.

## Release 120

- The **?** Help menu has two new links: **How-to videos**, which opens the list of how-to videos on volksswitch.org, and **Documents**, which opens the User Manual, the Quick Reference Card, the Keyguard Data Form and the other documents. "Keyguard how-to pages" is now called **How-to pages**, and **Custom Openings moves** has moved to the bottom of the menu's first section.

## Release 119

- **Changing the screen's unit of measure no longer moves your custom openings.** Openings you placed with Custom Openings were converted to the new unit only if the Custom Openings panel happened to be open. With it closed, a 253-pixel opening became 253 mm and vanished off the screen. Now they are converted whenever you change between pixels and millimeters, so they stay exactly where they were, and one Undo takes back the unit and the conversion together. Screen openings typed into your openings-and-additions file are still yours to change.
- **Undo and Redo in Custom Openings.** The Undo button has moved to the bottom of the Custom Openings panel, and a Redo button now sits beside it. Both work on either tab and remember your changes when you switch between tabs. On the “pixels or millimeters” tab, every change can now be undone: a number you change, a shape or angle you pick, a highlight, and an opening you add or delete. You can also press Ctrl+Z to undo, and Ctrl+Y or Ctrl+Shift+Z to redo.

## Release 118

- On the “by eye” tab of Custom Openings, the Shift and Ctrl keys now work on a shape's handles the way they do in PowerPoint. Hold Shift while dragging a corner handle to keep a rectangle's proportions; hold Ctrl while dragging any handle to grow or shrink the shape around its center instead of from the opposite side; hold both to do both at once. Ctrl on either end of a ridge stretches both ends together, keeping its middle still. You can press or let go of a key in the middle of a drag and the shape changes straight away. The yellow dot that rounds the corners ignores both keys, as in PowerPoint.
- There is a new opening shape: the hot dog, a long opening with fully rounded ends. On the “by eye” tab, drag one of a circle's side handles to stretch it into a hot dog; drag the sides back to equal and it becomes a circle again. A circle's corner handles still keep it a circle. A hot dog has no yellow dot, because its ends are always fully rounded. On the “pixels or millimeters” tab, hot dog is in the shape list and takes only a height and a width. Your openings-and-additions file stores a hot dog as a rectangle with fully rounded corners, so it cuts the same with any keyguard.scad.

## Release 117

- "Include screenshot" no longer tells you to set it to "no" before rendering your design. That advice is for the desktop OpenSCAD program; the app shows your screenshot over the keyguard and always leaves it out of the files you export, so you can leave it on.

## Release 116

- **Your keyguard files no longer have a version number in their names.** The keyguard designer file is now always called `keyguard.scad`, and your saved designs `keyguard.json`, instead of names like `keyguard_v92.scad` and `keyguard_v92.json`. The files in each project folder are renamed the first time you open it with this release. Nothing inside the files changes, and your designs are all still there. The version you have is shown beside the file name at the top of the Customizer, and in Settings → About. Updating the keyguard designer file now simply replaces it, so your saved designs keep the same file for good.
- **Saved designs are no longer missed when their file's name doesn't match the keyguard designer file.** A folder holding, for example, `keyguard_v92.scad` beside `keyguard.json` used to open with only the design default values, as though you had no saved designs, and saving a design then started a second file holding just that one. The app now finds your saved designs whatever their file is called, and gives it the standard name.
- Changing the skill level no longer makes the red * appear beside the preset name. A skill level only changes which settings you can see, so switching it on a design you haven't changed no longer looks like an unsaved change, and closing the tab no longer asks “Leave site?” because of it.

- Settings and Custom Openings now spell color, center, behavior, millimeters and canceled the American way.

## Release 115

- There is a new **?** button beside the Settings button. It opens a short Help menu: a card listing every Custom Openings move, links to the web app guide, the keyguard how-to pages and the known issues on volksswitch.org, Check my setup, Report a problem, and an email to Volksswitch. The menu and the moves card are built into the app, so they work offline and on networks that block volksswitch.org.

- Settings has a new Troubleshooting tab. **Check my setup** looks at your browser, your project folder, whether the app can reach its own address, whether your keyguard file is the newest, and whether the 3D drawing works. It says what to do about anything that's wrong, including when it's one for your IT department.

- **Report a problem**, on the same tab, writes a report you can read in full before it goes anywhere: your note, the app's release, your keyguard file's version, your browser and your design's settings. It leaves out folder, file and design names, and any text engraved on the keyguard is replaced with X's. The app sends nothing itself: you copy the report, open it in an email, or save it as a file.

- The Troubleshooting tab also lists the errors since the app was opened, without the Console's routine messages, and explains the common ones. The Reload the app button is there too, as well as on the About tab.

## Release 114

- If you have unsaved changes — the red * is showing next to the preset name, or Custom Openings is open with changes you haven't saved — and you close the tab or the browser, refresh the page, or go to another address, your browser now asks “Leave site?” first. Choose Cancel to stay and keep your changes.

## Release 113

- You can now round off a 90-degree corner of the keyguard by eye. The “by eye” tab of Custom Openings has a new + Rounded corner button. Press it and every square corner that points outward is ringed — on the keyguard's outside edge, or where openings meet inside it. Move the pointer near one and it lights up; click it to round that corner by 2 mm, or press and drag from it along an edge to choose how much.

- To change a rounded corner afterwards, click it and drag its yellow dot outward to round it more, or inward to round it less. Delete, Ctrl+Z and the arrow keys work as they do for openings. Rounded corners are also listed on the “pixels or millimeters” tab, where their size is in the corner radius column.

- On the “pixels or millimeters” tab, the shape list now offers only rectangle and circle. An opening can no longer be turned into a ridge there, or a ridge into an opening — draw ridges with + Ridge on the “by eye” tab.

- If you have changed anything in Custom Openings — added, moved, resized or deleted an opening, ridge or rounded corner — and then press Cancel (or the ✕, or Escape) without saving, the app now asks before throwing your changes away. Choose Keep editing to go back to them.

## Release 112

- You can now add ridges to the keyguard by eye. The “by eye” tab of Custom Openings has a new + Ridge button. Press it, then click on the keyguard for a 10 mm horizontal ridge starting where you clicked, or press and drag to draw one from that point in the direction you drag, in steps of 45°. Every ridge is 2 mm thick and 2 mm tall, and is built the same way as a ridge instruction written in your openings-and-additions file.

- Working with a ridge works the way it does for rectangular and circular openings. Click a ridge to select it — you don't have to hit it exactly — and a handle appears at each end. Drag a handle to lengthen, shorten or swing that end, again in steps of 45°, or drag the middle to move it. Copying with Ctrl, deleting, Shift-click, the arrow keys and Ctrl+Z all work as they do for rectangular and circular openings. To make several ridges alike, copy one. Press the Shift key while you drag the copy to keep them aligned.

- Ridges are on the “pixels or millimeters” tab too. They are listed with your screen openings, with a new angle column. A ridge's x and y are its left end, or its bottom end if it stands upright — the same rule the openings-and-additions file uses.

## Release 111

- **Saved designs are no longer lost when you set up a folder that has a presets file but no keyguard designer file.** If that file was named anything other than the app's own pattern — for example `keyguard.json` — setting up the folder left it with its old name, and the project then opened with only the design default values, as though you had no saved designs at all. The app now renames whatever presets file it finds to go with the new keyguard designer file, so your designs are there when the project opens. In the rare case of a folder holding more than one, the first one found is used.

## Release 110

- **A project folder without an openings-and-additions file is now given one.** Opening a folder that holds a keyguard designer file but no `openings_and_additions.txt` used to leave the folder as it was and carry on as though the file were there but empty — so there was nothing on disk to edit, and nothing to read about how to write an opening by hand. The app now puts a blank one into the folder as it opens the project. It is an empty starter file: it cuts nothing and changes no keyguard, and it carries the notes explaining what each column means. A file you have already written is never touched, and if the app cannot fetch or write the file it says so in the Console and opens the project exactly as before.

## Release 109

- **You can now start a project with nothing but an empty folder.** Until now you had to go and find the keyguard designer file, and usually an openings-and-additions file, and put them somewhere before the app was any use. Make a new empty folder, point the app at it with **Open Project…**, and the app tells you the folder has no keyguard designer file and offers to set it up with the current one. Accept, and it puts that file — and an openings-and-additions file to start from, if there isn't one already — straight into your folder and opens the project.

- Nothing already in the folder is ever replaced, so an openings-and-additions file you have already written is left exactly as it is. If the folder happens to hold saved designs from an earlier keyguard version, they are renamed to go with the new file, the same way they are when you accept a keyguard update. And because the app names the folder in the question, a folder chosen by mistake can be caught before anything is written to it.

## Release 108

- **Openings placed by eye now show their real shape.** The pink marker on each of your Custom Openings used to be a flat patch lying on the keyguard's face, which told you where the opening was but nothing about how it was formed. It is now the opening's actual shape, so chamfers, slopes and rounded corners are all visible as you work. While you are dragging an opening it goes back to a flat patch — that is what lets it keep up with your hand — and it settles into the real shape the moment you let go.

- **You can now see the screenshot through a highlighted opening.** Highlighting an opening on the openings-and-additions list marked it with a solid pink shape, which hid the very part of the screenshot you were trying to check it against. The pink is now see-through, matching the shapes shown when you place openings by eye, so you can tell at a glance whether an opening sits where it should.

## Release 107

- **A damaged file of saved designs is now named as damaged, instead of quietly appearing empty.** If the file holding your saved designs has been broken — most often by opening it in a text editor and leaving a stray line behind — the app used to open the project as normal with none of your designs listed, giving no hint that anything was wrong. It now tells you the file is damaged and what is wrong with it, and you can carry on designing from the standard settings in the meantime.

- **And in that state the app will not write to that file, so your designs cannot be lost.** Saving, renaming, deleting or importing a design rewrites the whole file, so saving into a file the app had failed to read would have replaced every design in it with the one design you had open. Those actions are now refused with an explanation, and the file is left exactly as it is until you repair or replace it.

## Release 106

- **The Keyguard update window no longer runs off the screen.** When a new version had a lot to say, the window grew so long and thin that its top was cut off and the **Update now**, **Remind me in a week** and **Skip** buttons were pushed out of reach, so it could not be answered at all. It is now wider, never taller than your screen, and when the notes are long they scroll inside it — the buttons always stay in view. The **What’s new** notice you see after the app updates works the same way.

- Words meant to stand out in the update notes now show in **bold**, in both the Keyguard update window and the What’s new notice. They used to appear with asterisks around them.

- The Keyguard update window no longer says the new file comes from GitHub. It has come from the app’s own address since release 102, which is what lets it work on school networks that block GitHub.

## Release 105

## Release 104

- **The app now understands keyguard inset mode.** If your design uses the new **keyguard inset mode** in the keyguard designer — where the app on the tablet has been shrunk to leave a white border around it — the **by eye** tab now places openings against the app rather than against the whole screen whenever your screen measurements are in millimeters, so an opening you place by eye lands in exactly the same spot as the same opening typed on the **pixels or millimeters** tab. Measurements in pixels still start at the corner of your screenshot, because that is where a graphics program measures from, and switching between the two units now carries your openings across correctly instead of leaving them out by the width of the border. The heading above the list of screen openings says which corner you are measuring from.

## Release 103

## Release 102

- **Keyguard file updates now work on school networks.** The offer to update your keyguard.scad used to come from GitHub, an address many school and hospital networks block by name. On those networks the app opened perfectly but never once offered you a newer keyguard file — and said nothing about it, so there was no way to tell. The keyguard file now comes from the same address as the app itself, which your network has already allowed if the app loaded at all. This matters most if you want to place openings **by eye** in pixels, which needs a recent keyguard file.

- **The Console now says what the update check found.** It reports “either your keyguard file is up to date”, or that a newer one is available, or that it could not check — instead of staying silent in every case. Silence used to look identical whether you were current or simply could not reach the check.

## Release 101

- **Place screen openings by eye, on the keyguard itself.** The Custom Openings panel now has two tabs and opens on the new **by eye** tab; the panel you already know is on **pixels or millimeters** beside it, unchanged. On the by eye tab your screen openings appear as translucent pink shapes lying on the keyguard in the viewport, and that is where you work on them. The panel shrinks to a small row of buttons so it keeps out of the way. Both tabs show the same openings, so anything you do on one appears on the other, and Save and Cancel work exactly as before.

- **Adding and shaping an opening.** Choose **+ Rectangle** or **+ Circle** and one arrives in the middle of the screen, 10 mm across with a 2 mm corner. Drag it to move it, drag its handles to resize it, and drag the yellow dot to round a rectangle’s corners — the way you would in PowerPoint. The shape follows your mouse as you drag, and the hole itself is re-cut the moment you let go.

- **Working on several openings at once.** Shift-click adds an opening to the selection so they move together. Hold Ctrl while dragging to leave a copy behind, and Shift while dragging to keep to a straight line. Ctrl+Z takes back a whole drag.

- **Nudging with the arrow keys.** The arrow keys move whatever is selected a millimetre at a time, or ten millimetres with Shift held. Hold an arrow down and the openings slide along; Ctrl+Z afterwards puts them back where they started, rather than undoing one tap at a time.

- **Turning the keyguard while you work.** Dragging anywhere other than an opening still turns the keyguard as it always did, and **Face on** squares the view up again when you want it. An opening can be dragged clear of the screen, which is how you reach the area around it.

- **What stays on the other tab.** Case openings are measured from the case rather than the screen, so there is nothing for the keyguard to show them against — they stay on the pixels-or-millimeters tab. Working by eye in **pixels** also needs an up-to-date keyguard.scad; in millimetres it works with any.
