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
  27 after release 116, none failed. **Manual: done 2026-10-27** — "update the manual's
  pictures" re-took all eight figures and put the five that changed into the .docx in
  place, keeping Ken's filled-in table of contents. What's left is the website and decks.
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

### Help menu: the Custom Openings moves card is missing releases 118 and 119
- **Raised:** 2026-10-30, found during "sync docs", which brought the User Manual and the
  Quick Reference Card up to date on the same moves.
- **What's wanted:** the **?** → Custom Openings moves card (built into the app, so it works
  offline) to say what the manual now says: Shift on a corner handle keeps a rectangle's
  proportions, Ctrl grows or shrinks it around its center (and on a ridge's end moves both
  ends), a circle's side handle stretches it into a hot dog, and Ctrl+Y (or Ctrl+Shift+Z)
  and the Redo button put back what Undo took back, on either tab. A What's new note with it.
- **Why not now:** Ken, 2026-10-30: "Not now". It is an app change, so it goes out with the
  next app release rather than on its own.

### Help menu: the manual and videos still show the old menu
- **Raised:** 2026-10-30. The app's ? menu now reads Web app guide, How-to pages, How-to
  videos, Documents, Known issues, Custom Openings moves (Ken, 2026-10-30; in the app,
  unreleased, for release 120). Done with it: changelog, CLAUDE.md, `SECURITY.md` (rebuilt
  `SECURITY.docx` for Ken to convert and upload).
- **What's left:** the User Manual's Help menu section and its Figure 7, then "sync docs";
  any video that shows the menu, then "sync videos". Both only after release 120 is out,
  since they picture the live app.

### Customizer setting descriptions, shown when pointing at a setting
- **Raised:** 2026-10-26, Phase 4 of the support assets proposal ("What's this? and the
  setting descriptions"); Ken asked when on 2026-10-27.
- **What it is:** a description for every Customizer setting, appearing when the clinician
  points at its name, with a More link to that setting's entry in the Design Settings
  Reference (also Phase 4). Today 41 of the 188 settings have a short gray note under the
  name, most of them warnings, and they stay; nothing appears on pointing. Each description
  is written once, in the keyguard designer file beside its setting, so OpenSCAD users get
  it too and the reference is built from the same words. The proposal pairs it with
  **What's this?**: choose it, click any button or setting, and see what it does with a
  link to the manual section and video.
- **Decided 2026-10-27 (Ken): all at once**, together with the Design Settings Reference,
  rather than Beginner settings first. Nothing reaches clinicians until all of it is ready:
  a keyguard designer version carrying every description, an app release that shows them,
  and the reference published, on the same day.
- **Drafted 2026-10-27:** all 188 descriptions, from the designer's code and the how-to
  pages, in `scripts/doc-generators/setting-descriptions.json`, and laid out for Ken in
  `Documents/Keyguard Designer Setting Descriptions - Draft for Review.docx` (built by
  `generate-setting-descriptions-review.py`), with 13 questions for him.
- **The plan once Ken has reviewed it:** read his edits back from the .docx (it is then
  the newer copy); write each description into `keyguard.scad` as the one comment line
  directly above its setting (all OpenSCAD's Customizer shows), with any warning after
  "Note:" on the same line, which the app shows as the gray note; the app shows the rest
  when pointing at the setting's name, with a More link to its reference entry; build the
  reference from the same words, with a picture per setting drawn by the app (the
  drafts suggest the two values for each).
- **Decisions waiting on Ken** (in the review document): where More opens (Claude leans
  toward a page on volksswitch.org, plus a PDF for printing); whether What's this? joins
  it; accepting that the retired address shows the descriptions as gray text.
- **What it touches:** the keyguard designer file, released by "bump keyguard designer";
  the app, in an app release (changelog, What's new, `SECURITY.md` if More opens a new
  page); the documents page and "sync docs" for the reference.
- **Why not now:** waiting on Ken's review of the draft.

### Faults found in the keyguard designer file (2026-10-27)
- **Raised:** 2026-10-27, while drafting the setting descriptions. 13 faults, each
  confirmed by drawing keyguards with OpenSCAD, not only by reading the code. Listed with
  what a clinician sees in the review document's "Found along the way" (and in
  `setting-descriptions.json`, `faults`).
- **The serious one: light-sensor openings in the wrong place** for the iPad Pro 13-inch
  (M4, M5), iPad Air 11-inch (M2 to M4) and iPad Air 13-inch (M2 to M4), since version 78
  (April 28 2026): a mistyped comment in the light-sensor table hides one entry. Also no
  sensor openings for the Tobii-Dynavox I-16 (its name is spelled differently in the
  lookup). Light-sensor openings are on by default, so every keyguard for those tablets
  since April is affected. **Fixed and released 2026-10-27 as keyguard designer
  version 93**, on its own at Ken's request; its notes tell clinicians to export those
  keyguards again.
- **The other twelve** (mounting holes missing in portrait, an empty laser-cutting file
  with Velcro or Suction Cups, no slide-in tabs with a frame, a portrait frame split on
  the wrong side, sloped edge with a frame or without a case, raised text in the tablet
  region, an upside-down vertical mini clip, loose Braille dots on a recessed insert, add
  symmetric openings without a case, trim to rectangle at 0,0, App Layout in px with the
  lower command bar at 0, and the Console's move-screenshot advice): Ken's call whether
  they go into the same keyguard designer version as the descriptions.
- **Also found:** 11 how-to pages on volksswitch.org that describe a setting differently
  from the designer (Ken edits pages himself), and a correction to the User Manual's
  section 4.3 (step 1 says unit of measure for screen sets the unit for the bar heights;
  it doesn't), for "sync docs" once Ken agrees. Both lists are in the review document.
- **Where the fixes happen:** the keyguard designer folder (`../My SCAD files/keyguard
  designer/`), under its own rules, released by "bump keyguard designer".
- **Why not now:** each fix changes what clinicians print; Ken decides which and when.

### The security overview on the website predates release 116
- **Raised:** 2026-10-27 - found while checking the new documents page, which links it.
- **What's wanted:** the PDF at `wp-content/uploads/2026/08/SECURITY.pdf` was uploaded
  2026-10-26 at 15:46 and lacks that evening's `SECURITY.md` changes for release 116 (the
  folder permission is now read and write; the standard file names). `SECURITY.docx` was
  rebuilt with them. Ken converts it to PDF and replaces the file in place in WordPress,
  so the address the app, the IT letter and the documents page use keeps working.
- **Why not now:** it's Ken's step by his rule (CLAUDE.md); Claude doesn't upload it.

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
- **Publishing: done 2026-10-27.** All 27 are on volksswitch.org with their guides, at the
  addresses the User Manual links. From now on "sync videos" publishes whatever changed and
  checks every link. **Ken is reviewing the set (and the documents) before he next says
  "sync videos" or "sync docs"** (2026-10-27).
- **More videos to come (Ken, 2026-10-27):** which ones is his call. CLAUDE.md, "How-to
  videos", says how a new one joins the set without moving any published number.
- **Why not now:** the pictures and recordings are Ken's.

### Phase 2 documents, pages and demos that wait on Ken
- **Raised:** 2026-10-26 - Phase 2 of the support assets proposal, drafted the same day.
- **Published 2026-10-27 at Ken's request** ("publish documents"), on the documents page
  `volksswitch.org/index.php/keyguard-designer-documents/`: Product Overview, User Manual,
  Quick Reference Card and the IT Request Letter, as PDFs Claude exported through Word.
  The page also lists the security overview, which stays Ken's to upload.
- **Linking the new pages from the website: Ken's call.** When they were made, nothing on
  the site linked the videos page or the documents page. Candidates: the keyguard hub page,
  the Keyguard Designer Web App page, the site menu and the home page below. The app's Help
  menu is decided: its own entry below.
- From now on **"sync docs"** keeps the documents and their page current (Ken, 2026-10-27).
- **Waiting on Ken's answer**, all set out in `Documents/Keyguard Designer Website and Demo
  Drafts - Phase 2.docx`:
  1. **The home page** (`/index.php/keyguard-designer/` proposed): its wording and address.
     The documents page is done.
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
