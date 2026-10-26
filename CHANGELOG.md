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
