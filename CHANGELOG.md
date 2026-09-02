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

## Release 102

- **Updated keyguard designer file (v87).** This update to the web app is necessary to support an upgrade to the keyguard designer. Open your project and the app will offer you the new keyguard file.

- **Keyguard file updates now work on school networks.** The offer to update your keyguard.scad used to come from GitHub, an address many school and hospital networks block by name. On those networks the app opened perfectly but never once offered you a newer keyguard file — and said nothing about it, so there was no way to tell. The keyguard file now comes from the same address as the app itself, which your network has already allowed if the app loaded at all. This matters most if you want to place openings **by eye** in pixels, which needs a recent keyguard file.

- **The Console now says what the update check found.** It reports “either your keyguard file is up to date”, or that a newer one is available, or that it could not check — instead of staying silent in every case. Silence used to look identical whether you were current or simply could not reach the check.

## Release 101

- **Place screen openings by eye, on the keyguard itself.** The Custom Openings panel now has two tabs and opens on the new **by eye** tab; the panel you already know is on **pixels or millimeters** beside it, unchanged. On the by eye tab your screen openings appear as translucent pink shapes lying on the keyguard in the viewport, and that is where you work on them. The panel shrinks to a small row of buttons so it keeps out of the way. Both tabs show the same openings, so anything you do on one appears on the other, and Save and Cancel work exactly as before.

- **Adding and shaping an opening.** Choose **+ Rectangle** or **+ Circle** and one arrives in the middle of the screen, 10 mm across with a 2 mm corner. Drag it to move it, drag its handles to resize it, and drag the yellow dot to round a rectangle’s corners — the way you would in PowerPoint. The shape follows your mouse as you drag, and the hole itself is re-cut the moment you let go.

- **Working on several openings at once.** Shift-click adds an opening to the selection so they move together. Hold Ctrl while dragging to leave a copy behind, and Shift while dragging to keep to a straight line. Ctrl+Z takes back a whole drag.

- **Nudging with the arrow keys.** The arrow keys move whatever is selected a millimetre at a time, or ten millimetres with Shift held. Hold an arrow down and the openings slide along; Ctrl+Z afterwards puts them back where they started, rather than undoing one tap at a time.

- **Turning the keyguard while you work.** Dragging anywhere other than an opening still turns the keyguard as it always did, and **Face on** squares the view up again when you want it. An opening can be dragged clear of the screen, which is how you reach the area around it.

- **What stays on the other tab.** Case openings are measured from the case rather than the screen, so there is nothing for the keyguard to show them against — they stay on the pixels-or-millimeters tab. Working by eye in **pixels** also needs an up-to-date keyguard.scad; in millimetres it works with any.
