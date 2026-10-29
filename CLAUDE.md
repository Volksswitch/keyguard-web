# Keyguard Designer (keyguard.volksswitch.org) — Claude Code Context

## ⚠ FIRST: this is the live app. There is a decoy next door.

Two project folders exist and they look nearly identical:

| Folder | Repo | What it is |
|---|---|---|
| **`keyguard-web`** (this one) | `Volksswitch/keyguard-web` | **THE LIVE APP.** Serves `keyguard.volksswitch.org`. Release 118 public, 119 local. |
| `keyguard-designer-web` (sibling) | `Volksswitch/keyguard-designer-web` | **RETIRED.** The old address `volksswitch.github.io/keyguard-designer-web/`, frozen at release 21. Gets no app updates and no keyguard updates, ever. |

**Release numbers tell them apart instantly: ≥100 is here, ≤21 is the old one.**

Editing the old folder feels completely normal and changes nothing any clinician
runs. This has already happened once (1 Sep 2026 — a session opened in the old
folder, and its dev-server launch config started the *old* app on port 8123 while
appearing to serve this one). **Check `APP_RELEASE` in `app.html` before believing
you are in the right place.**

Things that still live ONLY in the old folder, and are still authoritative there:
`RELEASING.md`, the Playwright test harness under `tests/`, and
`KEYGUARD-MIGRATION-PLAN.docx`. Read them there; do not copy them here without
deciding they should move. (`SECURITY.md` moved HERE on 1 Sep 2026 — it describes
this app, and the frozen folder is the wrong home for a document that must change
in lockstep with `app.html`.)

---

## What this project is

A browser-based clinician tool that wraps `keyguard.scad` so AAC clinicians on
locked-down workstations (no OpenSCAD install allowed) can design keyguards. Runs
entirely in Chrome or Edge via openscad-wasm + Three.js — no install, no command
line. Public domain (CC0), by Volksswitch.

**Companion .scad project:** `../My SCAD files/keyguard designer/` — a peer, not a
dependency. It owns `keyguard.scad`; this app consumes it. Derive the path from
`$env:OneDrive`, or override with `KEYGUARD_DESIGNER_ROOT`.

The app is **one file** — `app.html`, with an inline ES module. No build step, no
bundler. Do not add dependencies that need one; the app must stay servable by a
plain `python -m http.server`.

---

## How the app works (clinician's view)

1. Opens `keyguard.volksswitch.org` (or serves it locally) in Chrome or Edge.
2. Clicks **Open Project…**, picks a folder holding a `keyguard*.scad` (plus
   optionally a `.json` preset file, `openings_and_additions.txt`, `default.svg`).
3. A Customizer pane generates from the `.scad`'s declarations; presets come from
   the `.json`. Changes auto-render (~0.5 s via Manifold).
4. **Export** writes STL, SVG, or PNG to Downloads.

The app does not bundle a project folder — clinicians assemble their own.

---

## ⚠ The two update paths, and the rule that binds them

Both updates are automatic *for the clinician*. Neither reaches her without a push.

**1. The app updates itself.** `latest_app_version.json`, served from this app's own
address, names the latest DEPLOYED release. A stale app force-refreshes through the
service worker at app load and project load — no Ctrl-Shift-R.

**2. The keyguard file updates itself.** `latest_scad_version.json` and the designer
file itself (`keyguard_v<N>.scad`) also sit here, beside `app.html`, and are fetched
by RELATIVE address. On project open the app compares the clinician's file against
that list and offers the update; on acceptance it downloads from this same address.

**Why it works this way (do not "simplify" it back):** until release 102 the
designer check asked `raw.githubusercontent.com`. School networks block that
hostname by name. A clinician could open the app — the entire point of moving to
this domain — and never once be offered a newer keyguard file, silently, because the
check no-ops on failure by design. Measured in the field 1 Sep 2026: an SLP inside a
school network, holding v73, offered nothing while v87 was current, which also
locked her out of placing openings by eye in pixels (that needs a recent .scad).
Serving from this address means the file arrives by the route the network already
allowed for the app itself. The app now contacts **exactly one address**.

**THE BINDING RULE: a keyguard version that is only on GitHub has reached nobody.**
Clinicians fetch the designer file from THIS address, so it is the push of this
repository — not the `.scad` one — that puts a new keyguard in their hands. (v90 went
out half-done on 24 Sep 2026 for exactly this reason: pushed to GitHub, never published
here, and Ken was still offered v89.)

**A keyguard delivery is NOT an app release (Ken, 24 Sep 2026).** `keyguard_v<N>.scad`
and `latest_scad_version.json` sit outside `sw.js`'s `SHELL` precache, so a running app
fetches them from the network on every check and offers the new version on its own.
`APP_RELEASE`, `CACHE_NAME`, this changelog and `latest_app_version.json` are untouched
by a keyguard publish. (Until that date both were done as one act, on the belief that an
app refresh was required to deliver the file. It is not.)

**There are exactly two release commands, and they must not be blurred together
(Ken, 1 Sep 2026; separated 24 Sep 2026):**

- **"bump keyguard designer"** — publishes the dev `keyguard.scad` and delivers it here.
  One command, two pushes, **no app release.** Use this whenever the keyguard changes.
- **"bump keyguard web app"** — a considered release of the app's own work. Use this
  when the APP changed.

`release-designer.mjs` enforces the separation, because pushing this repo deploys
whatever is committed on its `main`: it **refuses to run** when the app has unreleased
clinician-facing work, or unpushed commits touching anything but notes and tools
(`CLAUDE.md`, `TODO.md`, `scripts/`) and the `APP_RELEASE` pre-bump, and names what it
found. That work deserves its own release, not a free ride on a keyguard delivery.
Release it first, then publish the keyguard. **Notes-and-tools commits are held back
like the pre-bump (Ken, 27 Oct 2026):** the push carries the designer files alone and
they stay on this computer, so day-to-day notes never block an urgent keyguard fix.

**⚠ `keyguard_v<N>.scad` and `latest_scad_version.json` must stay OUT of `sw.js`'s
`SHELL` precache list.** A precached designer file could never be replaced — the one
failure that would be worse than what this replaced.

**File names: plain in her folder, versioned on the server (release 116, Ken, 26 Oct
2026).** A clinician's folder always holds `keyguard.scad` and `keyguard.json`. The app
renames older `keyguard_v<N>.*` files the first time it opens a folder (and leaves a
folder with two presets files alone), and an update writes the new version over
`keyguard.scad` in place. **The copy served beside `app.html` keeps its version in its
name ON PURPOSE — do not "tidy" it to match.** GitHub Pages lets every file be reused for
10 minutes and ignores `?t=` cache-busters (measured 26 Oct 2026), so only a new address
is sure to be fresh right after a release; a fixed name would make updates fail (safely,
but visibly) for the first minutes after every keyguard release. The version list's
`scad_filename` is now read only by releases before 116. The retired app reads the
keyguard repo's own list and is unaffected; it accepts any keyguard file name.

---

## Release model — single `main`, PC = dev, GitHub = release

One branch: `main`. **The PC is development** — day-to-day work is committed to
local `main` but **NOT pushed** (local commits back up across machines via
OneDrive). **GitHub is release** — Pages serves `main`, so **pushing `main` =
releasing to clinicians.** Between releases nothing is pushed, not even docs.

Releasing is a deliberate, infrequent act, never an automatic consequence of a
push. The full ritual is `RELEASING.md` **in the sibling `keyguard-designer-web`
folder** — follow it exactly.

**Version numbering — the dev copy leads public by one.**
- `APP_RELEASE` (in `app.html`) is pre-incremented at the END of each release, so a
  dev build always reads one ahead of what is deployed. Currently **119** local,
  **118** public.
- `CACHE_NAME` (in `sw.js`) is NOT pre-bumped. It moves only during the release
  ritual, to match. Currently `keyguard-v118`.
- `latest_app_version.json` is NOT pre-bumped either — RELEASE-TIME ONLY, same
  reason. Currently 118.

**Numbering starts at 100 here.** Releases 3–21 belong to the old address.

---

## Changelog-as-you-go (mandatory)

`CHANGELOG.md` is kept **in lockstep with `app.html`**. The moment you change the
app in a way a clinician can see or do differently, add or edit the matching
plain-English entry under `## Unreleased (next release)` **in the same edit**, before
that change is done. Write it as a clinician reads it — what she can now see or do —
matching the voice of the existing `## Release N` bullets.

This cuts both ways: **if a change is backed out of `app.html`, delete its entry in
the same edit.** The Unreleased section mirrors exactly what is in the code, no more
and no less. **Exclude** internal-only changes (tests, tooling, refactors, perf work
with no visible effect). When in doubt, ask Ken.

**Ken's own edits to `CHANGELOG.md` are authoritative.** He may reword, reorder, or
rewrite whenever he likes; his phrasing is final. Only ever make **surgical** edits —
a targeted `Edit`, NEVER a whole-file rewrite or regenerate. Never reword or reorder
his entries; if one looks inaccurate, ask rather than change it.

**Committing is Claude's job, never Ken's.** Ken does not run git. Commit the code
and changelog change together on local `main`, unpushed, as part of finishing.

**After any `CHANGELOG.md` edit, run "apply release notes"** in the same change, so
the app's bundled "What's new" notice never drifts from the changelog.

At release the ritual merely renames `## Unreleased (next release)` to
`## Release <APP_RELEASE>` and opens a fresh empty section — it authors nothing.

---

## Working by trigger phrase (no manual shell commands)

Ken does not run PowerShell/Bash/Python by hand. For ANY repeatable operation:
create or reuse a script under `scripts/`, give it a trigger phrase, and document it
HERE in the same change. When Ken says the phrase, Claude runs it — in the
background if long-running — and reports the result. Never hand Ken raw commands to
type.

Scripts must run unchanged on **either of two machines** sharing one OneDrive copy:
derive paths from `$env:OneDrive`, never hardcode `C:\Users\<name>`.

| Ken says | Claude runs | What it does |
|---|---|---|
| **"bump keyguard designer"** | `node scripts/release-designer.mjs` | **RELEASES THE KEYGUARD DESIGNER TO CLINICIANS, end to end, with TWO pushes — and NO app release.** Phase 1 (.scad repo): finalize its changelog to `## Version N`, regenerate its manifest, commit, push, pre-bump to N+1. Phase 2 (here): wait for GitHub to serve vN, publish the file beside `app.html`, commit just `keyguard_v*.scad` + `latest_scad_version.json`, push THAT COMMIT ALONE (rebuilt on top of what is live, so the app's unreleased `APP_RELEASE` pre-bump stays local — until 3 Oct 2026 it rode out with every keyguard version and made the live app claim the next release), then confirm the live address really reports vN. `APP_RELEASE`, `CACHE_NAME`, this changelog and `latest_app_version.json` are NOT touched. Refuses if the app has unreleased work of its own or unpushed commits beyond its pre-bump and notes and tools (`CLAUDE.md`, `TODO.md`, `scripts/`, which it holds back), if vN has no clinician notes, if either repo is off `main`, if release files are uncommitted, or if the keyguard would break the RETIRED app (see below) — all checked BEFORE the first push. `--dry-run` prints the plan and changes nothing. |
| **(preflight, runs itself)** | `node scripts/check-old-app-compat.mjs` | Verifies a keyguard file still satisfies `old-app-contract.json` — what release 21 of the retired app reaches for by name: nine `-D` parameters, the `__KG_DIMS__` echo and its nine fields, and the option values it hardcodes. Stragglers on the old address are still offered every keyguard version and that address is never released again, so a version they cannot drive is a fault with no route to a fix. Release 21 is frozen, so the contract is fixed and never needs regenerating. Runs standalone against any file: pass a path. |
| **"finish the keyguard delivery"** | `node scripts/release-designer.mjs --deliver` | **Phase 2 of "bump keyguard designer" on its own, for a version Phase 1 already pushed** — publish the file beside `app.html`, commit it, push THAT COMMIT ALONE (the same held-back safeguards), confirm the live address. Takes the version from the .scad repo's manifest. Use when a release stopped between the two pushes. ⚠ **Never finish one with a plain push of this repo** — it would carry the held-back pre-bump out. (Added 29 Oct 2026, when GitHub's five-minute cache stopped v97 halfway; the wait is now seven minutes.) |
| **"publish the designer file"** | `node scripts/publish-designer-file.mjs` | The Phase 2 half on its own — fetches the PUBLISHED `keyguard.scad`, verifies the version, writes `keyguard_v<N>.scad` + `latest_scad_version.json`, removes the superseded copy. Writes no app file and does not commit or push. Idempotent. To finish a half-finished release use "finish the keyguard delivery", which also commits and pushes safely; the normal path is "bump keyguard designer". |
| **"build the security document"** | `python scripts/build-security-docx.py` | Renders `SECURITY.md` to `SECURITY.docx`. **Ken converts the .docx to PDF himself and uploads it** — the script deliberately stops at the .docx so he keeps editorial control. The .docx is an OUTPUT and is **gitignored** — a .docx is a zip, so no two builds are byte-identical and tracking it churned the repo on every build; it lives on disk and syncs via OneDrive. Never hand-edit it. Requires python-docx. Takes an optional input path, so it renders any of this project's markdown as Word. |
| **"bump keyguard web app"** | the ritual in `RELEASING.md` (sibling folder) | **RELEASES THIS APP TO CLINICIANS, through the push, with no second confirmation.** For the app's OWN work. Bumps `CACHE_NAME`, finalizes the changelog, regenerates notes, writes `latest_app_version.json`, commits, pushes, then pre-bumps `APP_RELEASE`. Ken issues it only after reading `CHANGELOG.md`. The retiring sibling has its own deliberately different phrase, "patch the retiring keyguard address" — confirm which folder you are in first. |
| **"apply release notes"** | `node scripts/apply-release-notes.mjs` | Regenerates the bundled `RELEASE_NOTES` block in `app.html` from `CHANGELOG.md`. Run after EVERY changelog edit. <1 s. |
| **"apply skill config"** | `node scripts/apply-skill-config.mjs` | Regenerates the `SKILL_LEVEL_DESCS` and `SKILL_CONFIG` blocks in `app.html` from `skill-config.txt`, which decides which Customizer settings each skill level sees. Edit the .txt, never the generated blocks. Moved here from the sibling 17 Sep 2026 (it had stayed behind and could only write the RETIRED app). <1 s. |
| **"make video &lt;number&gt;"** | `node scripts/video/render-video.mjs scripts/video/scripts/<id>.mjs` | Makes one how-to video from its script: the real app with the sample project open, a ring on what the narration names, the narrator's voice from Azure (Conversant's Andrew, using Conversant's `.azure-key`), and a one-page guide from the same pictures. Writes `Videos/<id>.mp4`, `.srt`, `.pdf` and `.json`. **Stops if a ring points at nothing on screen**, so a moved or renamed button can't slip into a video. Takes a few minutes; run in the background. |
| **"sync videos"** | `node scripts/video/sync-videos.mjs --publish` | **RE-MAKES EVERY VIDEO AND PUBLISHES WHAT CHANGED, in one phrase (Ken, 27 Oct 2026: "keep things simple").** Re-makes each video from its script and reports which changed since it was published (words, voice, or a clearly changed picture) and which couldn't be made, with the control each was looking for; speech is cached, so only changed wording costs anything. Then uploads exactly those changed or new videos and their guides to volksswitch.org (`scripts/wordpress/publish-videos.py`), gives a new video its watch page and its row on the videos page, updates the Next button on the video before it, and records each as published. A video that couldn't be made keeps its published copy. Then checks every link on the pages and in the published PDFs as a visitor (`check-links.py`), and names any video the User Manual doesn't link yet, for "sync docs". Takes a while: run it in the background and report all of it. **Run it after any app release that changes what the videos show.** Old copies of replaced files are listed for Ken, never deleted. `--only 1.` limits it to a group; without `--publish` it only re-makes and reports. |
| **"sync docs"** | the seven steps in this row, in order | **BRINGS THE DOCUMENTS IN LINE WITH THE APP AND PUBLISHES WHAT CHANGED (Ken, 27 Oct 2026).** The documents are the four in `scripts/wordpress/documents.json`: Product Overview, User Manual, Quick Reference Card, IT Request Letter. ⚠ **Never regenerate a document from `scripts/doc-generators/`:** Ken edits the Word files, and the manual's contents are filled in by Word. Every change is a surgical edit to the .docx (Conversant's `docx_safe`), mirrored in its generator so the two don't drift. **1. Text:** read `CHANGELOG.md` since each document's "Last updated" date and correct what the app now does differently. **2. The manual's pictures:** `node scripts/doc-generators/capture-manual-figures.mjs http://localhost:8077`, the same with `https://keyguard.volksswitch.org --only um-check.png`, `python scripts/doc-generators/label-manual-figures.py`, `python scripts/doc-generators/update-manual-figures.py --apply` (each picture found by its caption). **3. Video links:** `python scripts/video/add-manual-links.py --apply` (a new video needs its section in that script's list first). **4.** Put today's date in the "Last updated" line of each document that changed, then `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/doc-generators/update-toc.ps1 <each changed .docx>`. **5.** `python scripts/wordpress/publish-documents.py --apply` (PDFs through Word, only documents whose date changed; `--force` for a second change the same day). **6.** `python scripts/wordpress/check-links.py`. **7.** If `SECURITY.docx` is newer than the security overview on the site, tell Ken: that PDF is his to replace in place, and nothing here uploads it. Every step backs a document up to `Documents/Doc Backups/` before changing it. |
| **"publish app version"** | `node scripts/publish-app-version.mjs` | Rewrites `latest_app_version.json` from `APP_RELEASE`. **RELEASE-TIME ONLY** — part of the release merge, never day-to-day. |

Because `CLAUDE.md` is auto-loaded per project, a new phrase only works after
OneDrive syncs this file AND the other machine's session is restarted.

`publish-scad-version.mjs` now lives here too (copied from the sibling 1 Sep 2026), so
"bump keyguard designer" runs entirely from this folder. The sibling still has its own
copy; that one serves the retired app and is not used by this project.

**Trigger phrases that still live in the sibling folder** (run them there):
"update visual references", "compare visual references", and the RTP
chunk/merge/membrane phrases.

---

## Running it locally

Ken double-clicks **`serve.bat`**, which runs `scripts/serve.py` on port 8000 and
opens `http://localhost:8000/app.html` itself once it is serving. Use that, not a
bare `python -m http.server`: serve.py tells the browser never to keep a copy (so
every load is the `app.html` on disk now — plain http.server let a fresh tab reuse
an earlier copy), and it **refuses to start if another server already holds the
port**, where plain http.server on Windows silently shares it and the browser may
reach an old window, even one serving the retired sibling folder (16 Oct 2026).
The preview server in `.claude/launch.json` uses the same script.

⚠ **Two machines, one OneDrive.** An edit made on one machine reaches the other
only once OneDrive has synced `app.html`. Serving on the other machine before
that serves the old app, however fresh the server is. The File System Access API needs a
secure origin — `localhost` or HTTPS. A `file://` URL kills the folder picker,
the O&A auto-watch, saving presets in place, and IndexedDB persistence.

`.claude/launch.json` defines a **`keyguard-web`** preview server on port 8077.
**Each port is a separate browser origin**, so a non-default port has no remembered
folder and no settings — expect to open the project again.

---

## The two files here that are not the app

- `CNAME` — claims `keyguard.volksswitch.org`. Committed so a deploy cannot silently
  drop the custom domain.
- `move-probe.json` — arms the migration from the old address. `"ready": true` starts
  clinicians crossing on their next visit; `false` stops it. Read on every visit, so
  arming and disarming need **no release**.

---

## Implementation notes

- **Two STL renders per viewport refresh:** one for the keyguard
  (`show_oa_highlights="no"`), one for highlight overlays
  (`only_oa_highlights="yes"`). 3MF with `color()` would allow one, but no
  off-the-shelf openscad-wasm build has lib3mf compiled in.
- **Fresh WASM instance per render:** `createOpenSCAD`'s `callMain` triggers
  `exitJS()`, tearing down the runtime. Each render must create a new instance.
- **Cell-floor workaround:** `doRender()` injects `-D fudge=0.05 -D ff=0.05` *after*
  the `-p/-P` preset switch. Order matters — a preset pinning `fudge=0.01` would
  clobber an earlier `-D`.
- **Single-threaded WASM:** the openscad-wasm build has no `SharedArrayBuffer` and
  no pthreads, so COOP/COEP response headers are **not required**. This is why plain
  GitHub Pages is a viable host.
- **Storage keys** are `keyguard:settings` and `keyguard-db`. Older `keyguard-spike:*`
  names are read once as a fallback and migrated forward.
- **`__KG_DIMS__`** echo magic string in `keyguard.scad` ↔ parsed by `app.html` —
  a working contract; keep the two sides in lockstep.
- **Changing origin empties localStorage, IndexedDB and OPFS for every user**, and
  `FileSystemDirectoryHandle` cannot cross origins at all. This is what the whole
  migration hand-off exists to work around — never treat an origin change as routine.
- **The Help menu (release 115) links to four volksswitch.org pages:** the Known Issues
  page (`/index.php/keyguard-designer-known-issues/`, WordPress page 24563, published
  26 Oct 2026, the Conversant layout), the web app guide, the keyguard hub and the Custom
  Openings page. Renaming, moving or deleting one breaks a link inside the app, which only
  a release can fix. Problem reports and Contact go to `ken@volksswitch.org`
  (`SUPPORT_EMAIL` in `app.html`).

---

## Progress logging (mandatory)

For ANY multi-step or long-running task, continuously append to a single
human-readable `progress.log` at this project root (derive the path from
`$env:OneDrive`). **Every record MUST begin with a wall-clock timestamp** in
`[YYYY-MM-DD HH:MM:SS]` local time — no exceptions. Append as steps start and
finish (what, status, key result — PASS/FAIL counts, commit SHA); never overwrite.
`progress.log` is gitignored: git is the code history, this is the work history.
Per-job logs may coexist, but their progress must flow into `progress.log` LIVE.

---

## Machine-name suffixed files are ALWAYS suspect

Work happens on two machines sharing one OneDrive copy, and OneDrive resolves an
edit collision by keeping both versions and renaming one after the losing machine —
`app-Helix2.html`, `CLAUDE-Helix2.md`, `sw-Helix2.js`. **Any `-<MachineName>` suffix
is sync-conflict debris, never authoritative.**

**The test is whether the same name WITHOUT the suffix exists.** If it does, the
suffixed file is a stale duplicate: **never read it as instructions or as the
current state of the code** (a stale `CLAUDE-<machine>.md` will confidently state
retired conventions), and **never edit it** — editing it looks like it worked and
changes nothing Ken runs. If no unsuffixed twin exists, it may be the only copy of
something: do not rename, adopt, or delete it on a guess — tell Ken.

Before deleting, verify nothing lives only there — they are untracked, so git cannot
restore them. A code file is safe when `git hash-object <copy>` matches a historical
blob for the canonical path; logs and generated artifacts are disposable by policy.
Report what you verified.

---

## How-to videos are made, never edited (Ken, 26 Oct 2026)

Ken: *"the videos should be generated so they can be modified automatically just like the
Conversant videos."* Every video is a script in `scripts/video/scripts/`, rendered by
`render-video.mjs` from the running app, and kept current by **"sync videos"**. Never fix a
video by editing its file: change the script (or the app) and re-make it. The course order
and titles live in `scripts/video/course.json`; a video's number never changes once it's
published. Outputs go in `Videos/`, which is git-ignored. The figures and the videos open
the app the same way, through `scripts/lib/sample-project.mjs`.

**The User Manual links the videos section by section (Ken, 27 Oct 2026),** the same layout
as Conversant's manuals: a "Video:" line at the end of each section a video covers, and the
whole list in the Introduction. `scripts/video/add-manual-links.py` holds which section gets
which video ("sync docs" runs it); never edit those links by hand. Each links its video's
watch page at `volksswitch.org/index.php/keyguard-designer-videos/video-<n>-<n>/`, which
`publish-videos.py` makes at exactly that address and refuses to make anywhere else.

**On volksswitch.org (27 Oct 2026, Ken: "follow the template of the AI-driven AAC
project")** the videos page `/index.php/keyguard-designer-videos/` (27 watch pages
beneath it) and the documents page `/index.php/keyguard-designer-documents/` are public.
**Ken's two phrases keep them current, and there are no others (27 Oct 2026: "I'd like to
keep things simple"):** "sync videos" re-makes and publishes the videos, "sync docs"
updates and publishes the documents, and each ends by checking every link. The scripts
those phrases run (`scripts/wordpress/`, `add-manual-links.py`, `update-manual-figures.py`,
`update-toc.ps1`) can be run alone only to repair a half-finished sync. Their media is in
Customizable, 3D Printable Keyguard > Web App > Videos and Documents. **Nothing on the
site linked to either page when they were made** — the site's menus don't add new pages
by themselves; Ken links them where he wants them (the app's Help menu is in TODO.md).
The scripts use Conversant's WordPress credentials file, not a copy.

**More videos will be added (Ken, 27 Oct 2026).** To add one: write its script in
`scripts/video/scripts/`; add it to `course.json` at the END of its group, with the next
number in that group (a published number never changes, because the manual and any email
link its address); give it a section in `add-manual-links.py`'s list. Then "sync videos"
makes and publishes it — its watch page, its row on the videos page, and the Next button
on the video before it — and "sync docs" puts its link in the manual. A new group goes
after the existing ones.

---

## Deferred work lives in TODO.md

**[TODO.md](TODO.md) is the one list** of work identified but not being done now (created
26 Oct 2026, same rule as Conversant's). Never say something is "on the list",
"recorded" or "deferred" unless it is written there first.

---

## Known gaps (recorded, not scheduled)

- **No test harness here.** The Playwright layers (lint / smoke / visual) live in the
  sibling folder and exercise *that* copy of `app.html` — i.e. the retired app. A
  change made here is currently covered only by a manual syntax check of the inline
  module. Moving or re-pointing the harness is unresolved.
- **The security document is settled (1 Sep 2026)** and now lives here. `SECURITY.md`
  is the source; "build the security document" renders `SECURITY.docx`; **Ken does the
  .docx → PDF conversion and the upload himself.** The old PDF generator is gone.
  ⚠ **Whenever `app.html` changes what the app does on the network, in browser
  storage, or with the clinician's files, update `SECURITY.md` and rebuild in the same
  change** — the same lockstep rule as changelog-as-you-go, and for the same reason.
  Between May and August 2026 the published copy fell three months behind the app,
  still promising IT teams the app contacted no third party after the designer update
  check had shipped. A security document that fails the test it invites the reader to
  run costs more trust than having none. **It is only correct once Ken has uploaded
  it** — and he replaces the file in place in WordPress, because a re-upload would be
  renamed and break the FAQ link.
- **WASM OOM on heavy / no-recess designs** — intermittent `memory access out of
  bounds` from wasm32 address-space fragmentation. Workaround for clinicians:
  `Ctrl-Shift-R`. Real fix needs an openscad-wasm rebuild with `-sIMPORTED_MEMORY`
  so instances can be reused. Deferred pending that release.
- **HEIC screenshots — considered and declined (16 Oct 2026).** HEIC is the iPhone/iPad
  *camera's* photo format; device screenshots (button-press) are always saved as PNG,
  which the app already reads. A HEIC file would only be a photo of a screen — angled,
  glare, not to scale — so it is not a valid screenshot source. Not worth the ~1.5 MB
  vendored libheif decoder Chrome/Edge would need. Do not re-open unless clinicians
  are genuinely arriving with HEIC screenshots.
