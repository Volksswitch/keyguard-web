# How-to videos: the rules for working here

Moved out of the project's root CLAUDE.md on 30 Oct 2026 (Ken's /doctor cleanup), so it
loads only when working on the videos. The root file keeps the one-line rule: videos are
made from scripts, never edited by hand.

## Made, never edited (Ken, 26 Oct 2026)

Ken: *"the videos should be generated so they can be modified automatically just like the
Conversant videos."* Every video is a script in `scripts/video/scripts/`, rendered by
`render-video.mjs` from the running app, and kept current by **"sync videos"**. Never fix a
video by editing its file: change the script (or the app) and re-make it. The course order
and titles live in `scripts/video/course.json`; a video's number doesn't change once it's
published unless Ken decides otherwise, because its watch page's address comes from it (see
"Renumbering" below). Outputs go in `Videos/`, which is git-ignored. The figures and the videos open
the app the same way, through `scripts/lib/sample-project.mjs`.

**File boxes are drawn, not described (Ken, 30 Oct 2026):** the computer's folder, Save As
and Open boxes, and the browser's "edit files?" question, can't be captured, so a step shows
a generic stand-in with `dialog:` (`scripts/video/file-dialog.mjs`) and rings its buttons.
**The unit of measure for the screen is not a normal step:** it matters only for openings
typed as numbers (Custom Openings, the openings and additions file), so videos mention it
only there; video 2.5 explains which numbers count when pixels and millimeters are both filled in.

## What "sync videos" does

`node scripts/video/sync-videos.mjs --publish` (Ken, 27 Oct 2026: "keep things simple").
Re-makes each video from its script and reports which changed since it was published (words,
voice, or a clearly changed picture) and which couldn't be made, with the control each was
looking for; speech is cached, so only changed wording costs anything. Then uploads exactly
those changed or new videos and their guides to volksswitch.org
(`scripts/wordpress/publish-videos.py`), gives a new video its watch page and its row on the
videos page, updates the Next button on the video before it, and records each as published.
It also re-makes the guide book (`scripts/video/guide_book.py`, Ken 30 Oct 2026): every guide
in one PDF in viewing order, after a contents page, every page numbered, for a printout by
the computer; linked on the videos page and uploaded again whenever a video or the list
changes. A video that couldn't be made keeps its published copy. Then checks every link on
the pages and in the published PDFs as a visitor (`check-links.py`), and names any video the
User Manual doesn't link yet, for "sync docs". Old copies of replaced files are listed for
Ken, never deleted. `--only 1.` limits it to a group; without `--publish` it only re-makes
and reports.

## The User Manual's video links (Ken, 27 Oct 2026)

The same layout as Conversant's manuals: a "Video:" line at the end of each section a video
covers, and the whole list in the Introduction. `scripts/video/add-manual-links.py` holds
which section gets which video ("sync docs" runs it); never edit those links by hand. Each
links its video's watch page at `volksswitch.org/index.php/keyguard-designer-videos/video-<n>-<n>/`,
which `publish-videos.py` makes at exactly that address and refuses to make anywhere else.

## On volksswitch.org (27 Oct 2026, Ken: "follow the template of the AI-driven AAC project")

The videos page `/index.php/keyguard-designer-videos/` (a watch page for each video beneath
it) and the documents page `/index.php/keyguard-designer-documents/` are public. "sync
videos" re-makes and publishes the videos, "sync docs" updates and publishes the documents,
and each ends by checking every link. The scripts those phrases run (`scripts/wordpress/`,
`add-manual-links.py`, `update-manual-figures.py`, `update-toc.ps1`) can be run alone only to
repair a half-finished sync. Their media is in Customizable, 3D Printable Keyguard > Web App >
Videos and Documents. **Nothing on the site linked to either page when they were made** — the
site's menus don't add new pages by themselves; Ken links them where he wants them (the app's
Help menu is in TODO.md). The scripts use Conversant's WordPress credentials file, not a copy.

## Adding a video (Ken, 27 Oct 2026: more will be added)

Write its script in `scripts/video/scripts/`; add it to `course.json` at the END of its
group, with the next number in that group (published numbers stay put, because the manual
and any email link their addresses); give it a section in `add-manual-links.py`'s list. Then
"sync videos" makes and publishes it — its watch page, its row on the videos page, and the
Next button on the video before it — and "sync docs" puts its link in the manual. A new
group goes after the existing ones.

## Renumbering is Ken's call, and has been done once

30 Oct 2026, Ken: "Renumber as 1.5". Saving Designs as Presets moved from 4.1 to 1.5, right
after Your First Grid Keyguard, and five others moved with it (1.5→1.6, 1.6→1.7, 4.2→4.1,
4.3→4.2, 4.4→4.3). The reason it isn't routine: a link anyone saved to an old number then
opens a different video. To do it: change the numbers in `course.json`, rename each script
and its `id` to match (and its keys in `published.json` and `wordpress/videos.json`), point
the manual's existing video links at the new addresses, then "sync videos":
`publish-videos.py` moves each renumbered video's watch page to its new address before
updating it.
