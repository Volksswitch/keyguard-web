# Deferred work — the list

The Keyguard Designer's one list of work that has been identified, is not being done now,
and would otherwise live only in a sentence somebody has to remember. Same rule as
Conversant's `TODO.md` (Ken, September 8 2026): **a deferral is not recorded until it is
written here**, and it is not reported as recorded until it is.

- **Never say "recorded", "on the list", "tracked", "noted" or "deferred" without naming
  where.** If it is not in a file, it has not been recorded.
- **Write the entry BEFORE reporting it.**
- **Deleting an entry is a decision**, so say which one and why: done, dropped, or
  superseded.

Things that already have a home stay there: a settled decision or a known limitation in
`CLAUDE.md`, a released change in `CHANGELOG.md`.

Each entry carries the date it was raised, where it came from, what is wanted, and **why
it is not being done now** — an item with no stated reason for waiting is the one that
quietly waits forever.

---

## Open

### After release 116: pictures that still show versioned file names
- **Raised:** 2026-10-26 - the plain file names change (`keyguard.scad`, `keyguard.json`),
  unreleased at the time of writing.
- **What's wanted:** every how-to video, and the User Manual's figures, show the project
  line at the top of the Customizer, which read `keyguard_v92.scad` and now reads
  `keyguard.scad (version 92)`. **Videos: done 2026-10-26** — "sync videos" re-made all
  27 after release 116, none failed. For the manual, re-run `capture-manual-figures.mjs` and `label-manual-figures.py` and put the new
  figures into `Documents/Keyguard Designer User Manual.docx` (`um-presets.png` certainly;
  check the rest). The manual's text is already corrected, edited directly in the .docx,
  because Ken's copy has a filled-in table of contents a regenerate would drop.
- **Website pages and images that show the old names** (searched 2026-10-26: all 227
  published pages' text, and every image on the 88 keyguard pages; Ken edits these
  himself). Web app pages, which describe the new behaviour wrongly:
  1. **Keyguard Designer Web App** (page 22444): the sentence saying the file name helps
     tell designer versions apart; the "Update now" sentence saying the presets file is
     renamed to match; screenshots `web-app-r11.png` (project line and Console read
     `keyguard_v79`) and `keyguard-designer-update-available.png` (the old update dialog
     wording). Its Settings → About description mentions only the app's release number.
  2. **Using Presets** (page 1736): "same name (including version number)" and "will
     automatically update the name of the JSON file"; images `json-and-scad-files.png`
     (`keyguard_v38` files) and `preset-management-buttons.png` (`keyguard_v82.scad`).
  3. **Tweaking the Ready-to-Print Keyguard Designs** (page 8594): the "-vXX will be
     added" and "number after the _v" sentences; image `latest-files-added.png`
     (`keyguard_v92` files).
  4. **Managing Multiple Keyguard Designs** (page 1716): image `keyguard-design-folder.png`
     (`keyguard_v62` files). Its text is still true.
  Older pages about desktop OpenSCAD, MakerWorld or Thingiverse, which show versioned
  names as history, Ken's call whether to touch: Upgrading from Version 67 to Version 68
  (18593, text and two images), Strange Slicer Artifacts (2308, two images of exported
  STLs), Designing on Maker World (20382), Using the Thingiverse Customizer (492), and
  MAKING Assistive Technology (15884, a deliberate before-and-after). Not checked: 45
  embedded videos on 19 keyguard pages, and anything visible only when logged in.
- **Also:** any workshop decks that show the old names.
- **Why not now:** the pictures should show what clinicians are given, so they are made
  from the released app, after Ken releases 116.

### Folders with two files of saved designs
- **Raised:** 2026-10-26 - the plain file names change. Before it, a folder holding
  `keyguard_v92.scad` beside a presets file with another name (say `keyguard.json`) opened
  with no designs, and saving one then started `keyguard_v92.json` with just that design.
  Such a folder now holds two files of designs.
- **What happens now:** the app leaves that folder's names alone, keeps using the file
  named after the keyguard file, as before, and says so in the Console on every open.
  Nothing is lost, but the other file's designs stay out of sight.
- **What could be done:** offer to bring the other file's designs in (Import already
  exists), or merge the two with a question when names clash.
- **Why not now:** which designs she wants is her call, and how often this happened in the
  field is unknown. Claude flagged it to Ken on 2026-10-26 as a bigger question than the
  rename; he has not decided it.

### Welcome screen and sample keyguard
- **Raised:** 2026-10-26 - Phase 2 of the support assets proposal
  (`Documents/Keyguard Designer Support Assets Proposal.docx`). Ken: "Put the welcome
  screen on the to do list for future consideration and continue with the rest of
  phase 2."
- **What it is:** the viewing area that today says only "Click Open Project… to begin"
  offers three ways in. **Try a sample keyguard** opens a finished design from the app's
  own address with no folder; a strip says changes aren't kept, **Keep it…** copies the
  sample into a folder the clinician picks (nothing already there is replaced, as in
  release 109), **Close sample** goes back. **Start a new keyguard** is the release 109
  empty-folder setup. **Read the getting-started guide** opens the User Manual, and
  becomes **Watch the introduction** once the Phase 3 videos exist (the proposal listed
  the video in Phase 2, but the videos come a phase later). A returning clinician whose
  last folder is remembered sees **Reopen <folder>** as the main choice, with the rest as
  a line of links. The sketch was shown in the session of 2026-10-26.
- **Open decisions for Ken:** which design is the sample (the grid app, iPad and case
  clinicians ask about most), and whether returning clinicians see the welcome screen at
  all (Claude leans yes, with Reopen first).
- **What it touches when it is built:**
  - `SECURITY.md` must change in the same release: a new download from the app's own
    address, and the app writing files the clinician didn't make. Ken re-uploads the PDF.
  - The Intro and Hands-on instruction-session demos were to switch to the web app
    "once the sample keyguard exists"; without it they use a prepared project folder.
  - The User Manual's "Starting a project" chapter gains a section on the sample.
- **Why not now:** Ken deferred it for future consideration on 2026-10-26.

### How-to videos: what's left after the first full set
- **Raised:** 2026-10-26 - Phase 3. Ken: "Go ahead and develop the remaining videos." All 27
  in `scripts/video/course.json` have scripts and are made by "sync videos".
- **Pictures only Ken can take**, to replace narration over app screens with the real thing.
  Each video works without them; a picture goes in `Documents/video-pictures/` and the
  script gets an `image:` step:
  1. 2.1 - the back of an iPad with its model number, and the Easy Measurement Tool spanning a
     case opening.
  2. 2.3 - a ruler on the tablet's screen, measuring a bar.
  3. 5.1 - a keyguard in a slicer, back down and face down.
  4. 5.2 - a two-layer test mask in the case, over the app.
- **Mounting videos** (the proposal's "one per mounting method") are Ken's existing
  recordings. They aren't in the course list yet: which ones, and where they live, is his call.
- **Publishing** isn't set up: no videos page on volksswitch.org yet (Phase 3's "Videos
  page"). Until it is, `sync-videos.mjs --published <id>` records a video Ken has put up by
  hand, so the next sync compares against it.
- **Why not now:** the pictures and recordings are Ken's; publishing waits on his review of
  the set.

### Phase 2 documents, pages and demos that wait on Ken
- **Raised:** 2026-10-26 - Phase 2 of the support assets proposal, drafted the same day.
- **Drafted, for Ken's review** (all in `Documents/`, built by `scripts/doc-generators/`):
  Product Overview, User Manual (screenshots from `capture-manual-figures.mjs`), Quick
  Reference Card, and the IT Request Letter rebuilt in the same style.
- **Waiting on Ken's answer**, all set out in `Documents/Keyguard Designer Website and Demo
  Drafts - Phase 2.docx`:
  1. **The home page and documents page:** their wording and addresses, and who turns the
     documents into PDFs and puts the pages up.
  2. **The Keyguard Designer Web App page** overlaps the manual and is out of date in places
     (six Settings tabs where there are seven; says an update restarts the app; no Help
     menu; names Opera, which the app doesn't claim). Claude suggests trimming it to point
     at the manual.
  3. **Whether the app's "Web app guide" link should open the new home page** - an app
     change for the next release.
  4. **The Intro and Hands-on deck changes,** slide by slide. The decks are Ken's and were
     not edited; `Documents/manual-sample/` is a ready demo project folder.
  5. **Check one assumption in the manual's Conversant section:** that the lines in
     Conversant's Screen Openings.txt are pasted into the screen_openings list of
     openings_and_additions.txt. Read from Conversant's code, not tried end to end.
- **Why not now:** each needs Ken's review or decision; publishing needs his OK per page.

### Website changes from Phase 1 that wait on Ken
- **Raised:** 2026-10-26 - Phase 1 of the support assets proposal. The words for all of
  these are in `Documents/Keyguard Designer Website Drafts - Phase 1.docx`.
- **Done:** the Known Issues page is published (WordPress page 24563); "Comparing an
  Image of Your Keyguard to a Screenshot of the AAC App" (page 775) is in the WordPress
  trash at Ken's request.
- **Waiting on Ken's answer:**
  1. **Delete "Using the Thingiverse Customizer" (page 492) and "Designing on Maker
     World" (page 20382)?** Asked 2026-10-26 and not yet answered; the conversation moved
     to page 775 instead. Moving them to the trash is reversible for 30 days.
  2. **The Custom Openings page additions** (drafted) and **the notice for older pages**
     (drafted, four pages) — Ken reviews, then either pastes them or has Claude publish
     each with his OK.
- **Ken is doing himself:**
  3. **The three links to "Converting Graphic Images to SVG files"** on Putting
     Instructions in the O&A File, Older Version O&A File Instructions, and Project Core
     3D-Symbols "Remix". Broken since page 775 was trashed (its child page's address
     changed and WordPress does not forward it). Ken said 2026-10-26 he'd fix them.
  4. **The nine links to the deleted page 775**, on eight pages, listed in the drafts.
  5. **The link on Customizable Universal Cuff Capacitive Stylus** to the Thingiverse
     Customizer page, once that page is deleted.
  6. **A new home for the two finished keyboard keyguards** that "Keyguards for iPad
     Keyboards" downloads from Thingiverse, before those links go.
- **Why not now:** each is Ken's decision or Ken's own edit.
