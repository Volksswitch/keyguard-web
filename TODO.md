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
