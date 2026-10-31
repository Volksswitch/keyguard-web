# Keeping the Keyguard Designer alive — a handbook for whoever comes next

Written by Ken at Volksswitch, October 2026, for the person who carries this
work on if he no longer can. It assumes you are technically capable but have never seen
the project before. It says what exists, what keeps it running, what costs money, and
what was learned the hard way so you do not have to learn it again.

**Everything here is public.** Passwords, keys and account numbers are deliberately NOT
in this file. They are in a private list Ken keeps outside GitHub; see
[Accounts and access](#accounts-and-access) for how to reach it.

---

## What the project is

AAC (augmentative and alternative communication) users often operate a speech app on a
tablet. A **keyguard** is a plastic grid that sits over the screen so a user with limited
motor control hits the button they mean. Each one must match a specific tablet, case and
app layout, so they are custom-made — usually 3D-printed.

The Keyguard Designer lets a clinician (typically a speech-language pathologist) design
one without installing anything, inside Chrome or Edge, including on locked-down school
and hospital computers. Everything is public domain (CC0).

It has four parts:

| Part | Where | What it is |
|---|---|---|
| **The keyguard designer** | GitHub `Volksswitch/keyguard` | `keyguard.scad`, an OpenSCAD program that turns hundreds of settings into a printable 3D model. This is the engineering heart. |
| **The web app** | GitHub `Volksswitch/keyguard-web`, served at **keyguard.volksswitch.org** | One file (`app.html`) that runs the designer inside the browser (OpenSCAD compiled to WebAssembly) and shows the result in 3D. No server, no build step. |
| **The retired app** | GitHub `Volksswitch/keyguard-designer-web`, at `volksswitch.github.io/keyguard-designer-web/` | The app's old address, frozen at release 21. See [Scheduled housekeeping](#scheduled-housekeeping). |
| **The website** | **volksswitch.org** (WordPress) | The user manual, quick reference card, IT request letter, data form, security overview, how-to videos, Known Issues page and contact details. The app links to it from its Help menu. |

**Release numbers tell the two app addresses apart:** 100 and up is the live app; 21 and
below is the retired one.

---

## If you do nothing at all

The app keeps working for everyone who already uses it, and for new users, **as long as
the domain and GitHub stay alive.** There is no server to fail and no database. It runs
entirely in each clinician's browser and keeps working offline once loaded.

What erodes without someone tending it:

- **The domain lapses** → keyguard.volksswitch.org stops answering. Installed copies keep
  working from their offline cache, but no one new can reach it and no updates arrive.
  This is the single most important thing to keep paid. See [What must be paid for](#what-must-be-paid-for).
- **The website lapses** → the Help menu's links, the manual and the videos go dark. The
  app itself is unaffected.
- **Browsers change** → eventually something in Chrome or Edge will break the app. It
  depends on the File System Access API (choosing a project folder), service workers
  (offline use and self-updating) and WebAssembly.
- **New tablets appear** → clinicians need new tablet and case dimensions added to the
  designer. This is the most common reason the designer changes.

---

## How updates reach clinicians

There are two kinds of update, and both arrive **automatically for the clinician** —
neither reaches anyone until you push to GitHub.

1. **The app updates itself.** When a clinician opens the app or a project, it compares
   its own release number with `latest_app_version.json` on the live site and refreshes
   itself if it is behind.
2. **The keyguard designer file updates itself.** When a clinician opens a project
   folder, the app compares her `keyguard.scad` with `latest_scad_version.json` on the
   live site and offers the newer one. Accepting downloads it from the same address.

**Everything is fetched from the app's own address and nowhere else.** That is deliberate:
school networks block `raw.githubusercontent.com` (and often all of `github.io`) by name,
so for two years a clinician inside a school could open the app and silently never be
offered a newer designer file. The app now contacts exactly one address, which is also
what the security overview promises IT departments. Do not add a second.

**The binding rule: a designer version that is only in the `keyguard` repository has
reached nobody.** Clinicians fetch the file from the web app's address, so publishing the
web app's copy is what delivers it.

---

## How releases are done

The PC is development; GitHub is release. Day-to-day work is committed locally but not
pushed. **Pushing `main` of `keyguard-web` IS releasing to every clinician**, because
GitHub Pages serves `main` directly.

There are two release commands, kept strictly apart. Ken works through Claude Code and
says a phrase; Claude runs the matching script. You can do the same, or run the script
yourself.

- **"bump keyguard designer"** → `node scripts/release-designer.mjs` (run from
  `keyguard-web`). Finalizes the designer's changelog, pushes the `keyguard` repository,
  waits for GitHub to serve it, copies `keyguard_v<N>.scad` beside the app, pushes that
  alone, and confirms the live site reports the new version. It refuses to run if
  anything would ship by accident, and checks the retired app can still use the new
  designer file. `--dry-run` shows the plan and changes nothing.
- **"bump keyguard web app"** → the ritual in [`RELEASING.md`](RELEASING.md). For changes to the app
  itself: moves `CACHE_NAME` in `sw.js`, renames the changelog's Unreleased section,
  regenerates the in-app "What's new" notes, writes `latest_app_version.json`, commits,
  pushes, then advances `APP_RELEASE` by one for the next cycle.

The full list of commands, with what each refuses to do, is the table in
[`CLAUDE.md`](CLAUDE.md). That file is written for Claude Code but reads fine for a human,
and it is the most complete description of how this repository works.

### What you need on your computer

- **Git**, and push access to the three repositories.
- **Node.js** (release scripts, video making) and **Python 3** with `python-docx` (the
  documents).
- The three repositories cloned side by side. The scripts look for them under
  `%OneDrive%\4 T-Z\Volksswitch\Keyguard\` because Ken's copies sync through OneDrive;
  set `KEYGUARD_DESIGNER_ROOT` to the `keyguard` repository if yours live elsewhere.
- To run the app: double-click `serve.bat` (port 8000). It must be served over
  `http://localhost` or HTTPS; opened as a plain file, the folder picker does not work.
- To publish documents or videos: a WordPress application password and an Azure Speech
  key. Both are read from files in Ken's Conversant AAC project folder
  (`AI-driven AAC\.wordpress-credentials` and `.azure-key`); a successor will create
  their own and point `scripts/wordpress/wp.py` and `scripts/video/render-video.mjs` at
  them.

---

## The documents and videos

- **Five published documents** — User Manual, Quick Reference Card, IT Request Letter,
  Keyguard Data Form, Security Overview. Ken edits the Word files directly; each has a
  generator in `scripts/doc-generators/` that is kept in step with every edit (checked
  October 2026: identical, apart from the table of contents and video links, which are
  filled in later by design). **If the Word files are lost, regenerate them from these.**
  `SECURITY.md` is the source of the Security Overview.
- **"sync docs"** brings the documents in line with the app and publishes what changed to
  volksswitch.org; the procedure is `.claude/skills/sync-docs/SKILL.md`.
- **How-to videos are made, never edited.** Each is a script in `scripts/video/scripts/`
  that drives the real app, rings what the narration names, and speaks through Azure's
  "Andrew" voice (`en-US-Andrew:DragonHDLatestNeural`, recorded in
  `scripts/video/voices.json`). "sync videos" re-makes them all and publishes what
  changed. Rules: `scripts/video/CLAUDE.md`.
- **The sample projects** the videos and the manual's pictures are made from are in
  `Documents/manual-sample/`, `Documents/video-samples/` and `Documents/video-pictures/`.
  The Word and PDF files beside them are deliberately not in the repository.
- **The security overview must always tell the truth.** Whenever the app changes what it
  does on the network, in browser storage, or with the clinician's files, update
  `SECURITY.md` in the same change and republish it **in place** in WordPress (a
  re-upload gets a new file address and breaks the links to it).

---

## Lessons learned the hard way

Each of these cost hours or days. The longer records are in Ken's folders
(`PLAYBOOK-github-pages-custom-domain.md`, `ORIGIN-MIGRATION-STATE.md`,
`TEST-APP-REHEARSAL-LEARNINGS.md`); this is what you need from them.

### Web addresses

- **An app's web address is permanent in practice.** Browsers keep each site's saved data
  (settings, remembered folder, offline copy) under its exact address. Moving to a new
  address gives every user an empty app; nothing carries over unless the old address
  hands it across before it closes. Moving from `volksswitch.github.io/...` to
  `keyguard.volksswitch.org` took months of work for exactly this reason. **Do not move
  the app again unless you must.**
- **Never publish anything at a `volksswitch.github.io/<repo>` path again.** Every app
  ever published there shares one pot of browser storage, and old apps' data is still in
  it. A new app there can read all of it.
- **Setting up a `*.volksswitch.org` address on GitHub Pages:** ask the host for a real
  CNAME record (`<name>` → `volksswitch.github.io`; not a "URL redirect" or "forwarding"
  option), wait until public resolvers (8.8.8.8, 1.1.1.1) answer for it, attach the
  domain in GitHub, and then **open `github.com/<owner>/<repo>/settings/pages` in a
  browser.** GitHub's DNS check does not finish on its own; loading that page finishes it,
  within seconds, and the certificate follows in a couple of minutes. Two projects waited
  13 and 18 hours before this was understood. **Never detach and re-attach the domain to
  "retry"** — that restarts the check. Turn on "Enforce HTTPS" only after the certificate
  exists.
- **A site served over plain `http://` looks normal and is broken.** Browsers withhold
  offline support, folder access and other features from it. There is a short http-only
  window after attaching a domain; never call the site usable until the padlock is there.
- **`volksswitch.org` is verified as belonging to the Volksswitch GitHub account**
  (a TXT record named `_github-pages-challenge-Volksswitch` at the DNS host). That stops
  strangers claiming `*.volksswitch.org` addresses on GitHub. **Leave that record in
  place forever.** If the repositories ever move to another GitHub account, that account
  must verify the domain again. When retiring a subdomain, delete its DNS record *before*
  its repository.
- **Checking DNS:** use public resolvers, not your own (your router remembers "does not
  exist" from before a record was added). Look up the domain's current nameservers before
  testing them — they change. A single failed lookup against `hgns1`/`hgns2` is not proof
  of absence; they are spread across many locations and one may lag.

### Caching and updates

- **GitHub Pages lets browsers reuse every file for 10 minutes**, and ignores `?t=`
  cache-busting. That is why the designer file served beside the app has its version in
  its name (`keyguard_v97.scad`): only a new address is guaranteed fresh right after a
  release. Do not "tidy" it to a fixed name.
- **The designer file and its version list must stay out of the service worker's
  precache list** (`SHELL` in `sw.js`). A precached file could never be replaced.
- **The service worker must fetch with `cache: 'reload'` when it installs**, or a new
  release can be filled with the previous release's files from the browser's cache.

### Design

- **Never fail silently.** The old update check said nothing when it could not reach
  GitHub, out of care for the user — and that made "you are up to date" and "we could not
  ask" look identical, so the failure went unnoticed for months. Degrade the behavior,
  never the explanation.
- **Moving to a reachable address does not move what the app depends on.** For every
  address the app contacts, ask: if a school blocks this, what does the clinician see?
- **The 3D view is the exact print.** What the app shows is what `keyguard.scad`
  produces, so a shape problem there is visible before anyone prints.

---

## Accounts and access

Everything below needs a login. **The logins themselves are in Ken's private list**,
"Keyguard Designer - Private Accounts List", kept outside GitHub. Ken's family or
executor will know where it is.

| Account | What it controls | If it is lost |
|---|---|---|
| **GitHub — `Volksswitch`** (a personal account) | All three repositories, GitHub Pages, the domain verification | No one can release. GitHub lets the account owner name an **account successor** (Settings → Account → Successor settings), who can request the repositories from GitHub support on presenting a death certificate. |
| **Domain registrar for volksswitch.org** | The name itself | Everything at every volksswitch.org address stops when it expires. |
| **HostGator** (web hosting and DNS) | The WordPress site, the DNS records (including `keyguard` → GitHub, and the domain-verification TXT record), and possibly email | Website down; changing DNS impossible. |
| **WordPress admin at volksswitch.org** | The manual, documents, videos page, Known Issues page | Documents cannot be updated. |
| **Jetpack** (backs up WordPress daily) | Restoring or downloading the website | From the Jetpack dashboard (cloud.jetpack.com) or WordPress admin → Jetpack → Backup, choose a day and download or restore it. |
| **SiteLock** (website security scanning) | Malware scanning of the website | Not needed to keep anything running. |
| **Microsoft Azure** (Speech service) | The narrator's voice in the how-to videos | Videos cannot be re-made; existing ones are unaffected. A successor can create their own Speech resource and use the same voice name. |
| **The support email `ken@volksswitch.org`** | Where problem reports and "Contact" go | See below. |

### Changing the support email address

The address appears in the app (Help menu → Report a problem and Contact, from
`SUPPORT_EMAIL` in `app.html`), in the User Manual, Quick Reference Card, IT Request
Letter and Product Overview, and in the narration of the "Report a problem" video. To change it: change `SUPPORT_EMAIL` and release the app, update the generators
and Word files and run "sync docs", then run "sync videos". Until all three are done,
some reports still go to the old address — so if possible keep the old mailbox
forwarding to the new one.

The app's Help menu also links to six volksswitch.org pages (Known Issues, the web app
guide, the keyguard hub, Custom Openings, the videos page and the documents page).
Moving or deleting any of them breaks a link inside the app until the next release.

---

## What must be paid for

The app itself costs nothing to run: GitHub hosts it free. These keep everything around
it alive. Costs and renewal dates are in Ken's private list.

| Item | Needed for | If it lapses |
|---|---|---|
| **volksswitch.org domain registration** | The app's address and the website | **Everything breaks.** Highest priority. |
| **HostGator hosting** | Website, DNS, possibly email | Website and DNS go; the app's address goes with the DNS. |
| **Jetpack** | Daily website backups | No backups; the site keeps running. |
| **SiteLock** | Website malware scanning | Nothing visible. |
| **Azure Speech** | Re-making videos | Only re-making videos; pay-as-you-go and small. |
| GitHub | The app and code | Free; nothing to pay. |

---

## Scheduled housekeeping

- **The retired address** (`volksswitch.github.io/keyguard-designer-web/`) still serves
  release 21 so stragglers can move to the new address. From **1 August 2027** it may be
  replaced by a static "We've moved" page, and later deleted. Clinicians who never moved
  will need to reinstall from keyguard.volksswitch.org and set up their settings again;
  that is accepted. Until it is retired, every new designer file is checked against what
  release 21 needs (`old-app-contract.json`), so the old app is never broken by a
  designer release.
- **Tablets and cases.** New tablet models are the steady stream of work; their
  dimensions go into `keyguard.scad`.

---

## Where to start

1. Read this file, then [`CLAUDE.md`](CLAUDE.md) and [`CHANGELOG.md`](CHANGELOG.md).
2. Clone the three repositories, double-click `serve.bat`, open the sample project, and
   make a keyguard.
3. Make sure the domain and hosting are paid and in your name.
4. Read [`TODO.md`](TODO.md) — the one list of known, unfinished work — and the Known
   Issues page on volksswitch.org.
5. Before your first release, run `node scripts/release-designer.mjs --dry-run` and read
   what it says it would do.
