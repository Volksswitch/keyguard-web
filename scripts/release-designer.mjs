#!/usr/bin/env node
// release-designer.mjs — ONE command that makes the dev keyguard.scad public and
// gets it into clinicians' hands. Trigger phrase: "bump keyguard designer".
//
// WHY THIS IS ONE COMMAND
// -----------------------
// Publishing a keyguard version used to be three separate acts across two
// repositories, and the middle one could be forgotten silently. Since release 102
// the web app serves the designer file from its own address (so school networks
// that block GitHub can still receive it), which means a keyguard release reaches
// nobody until the WEB APP is also released. Ken, 1 Sep 2026: one command should
// take the latest dev .scad, make it public, and trigger the trivial web app
// update that delivers it.
//
// WHAT IT DOES, in order:
//   .scad repo   finalize CHANGELOG -> "## Version N", regenerate the manifest,
//                commit, PUSH, then pre-bump to N+1 locally (unpushed)
//   web app      publish keyguard_vN.scad + version list beside app.html, add the
//                clinician bullet, then run the full release ritual: CACHE_NAME,
//                changelog, notes, app manifest, commit, PUSH, pre-bump
//
// Both rituals are transcribed from their own RELEASING.md files. Read those
// before changing anything here; this script must not invent process.
//
// ⚠ TWO PUSHES. Each is a release to real clinicians. The trigger phrase is the
// single authorization, exactly as both RELEASING.md files specify for their own
// phrase — Ken issues it only after verifying the changelogs.
//
// ⚠ THIS COMMAND IS FOR A TRIVIAL WEB APP UPDATE ONLY. It refuses to run when the
// web app has unreleased clinician-facing work of its own, because that work
// deserves its own considered release: "bump keyguard web app". That separation is
// the whole point of having two commands (Ken, 1 Sep 2026).
//
//   node scripts/release-designer.mjs            -> the real thing, two pushes
//   node scripts/release-designer.mjs --dry-run  -> prints the plan, changes nothing

import { readFileSync, writeFileSync, copyFileSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB_ROOT  = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SCAD_ROOT = process.env.KEYGUARD_DESIGNER_ROOT
  || resolve(WEB_ROOT, '..', 'My SCAD files', 'keyguard designer');

const DRY = process.argv.includes('--dry-run');
const NL = '\n';
const UNRELEASED = '## Unreleased (next release)' + NL;
const PUBLISHED_SCAD_URL =
  'https://raw.githubusercontent.com/Volksswitch/keyguard/main/keyguard.scad';

const steps = [];
function say(msg)  { console.log(msg); }
function plan(msg) { steps.push(msg); console.log((DRY ? '  [would] ' : '  ') + msg); }
function die(msg)  { console.error(`${NL}release-designer: ${msg}`); process.exit(1); }

function git(cwd, ...args) {
  if (DRY && (args[0] === 'commit' || args[0] === 'push' || args[0] === 'add')) return '';
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}
function node(cwd, script, ...args) {
  if (DRY) return '';
  return execFileSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' });
}
const read  = p => readFileSync(p, 'utf8');
const write = (p, s) => { if (!DRY) writeFileSync(p, s, 'utf8'); };

function versionOf(scadText) {
  const m = scadText.match(/keyguard_designer_version\s*=\s*(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}
// Bullets directly under the topmost "## Unreleased" heading, up to the next "## ".
function unreleasedBullets(changelog) {
  const after = changelog.split(UNRELEASED)[1];
  if (after === undefined) return null;
  return after.split(/^## /m)[0].split(NL).filter(l => l.startsWith('- '));
}
// The bullet publish-designer-file.mjs writes; it does not count as app work.
const DESIGNER_BULLET = /^- \*\*Updated keyguard designer file \(v\d+\)\.\*\*/;

// ─── Preflight ─────────────────────────────────────────────────────────────
// Everything that could abort mid-flight is checked BEFORE the first push, so a
// failure never leaves one repository released and the other not.

say(DRY ? 'DRY RUN — nothing will be written or pushed.' + NL : '');

for (const [name, root] of [['.scad', SCAD_ROOT], ['web app', WEB_ROOT]]) {
  let branch;
  try { branch = git(root, 'rev-parse', '--abbrev-ref', 'HEAD'); }
  catch (e) { die(`${name} repo at ${root} is not a git checkout (${e.message}).`); }
  if (branch !== 'main') die(`${name} repo is on branch "${branch}", not main. Refusing.`);
}

const scadPath      = join(SCAD_ROOT, 'keyguard.scad');
const scadChangelog = join(SCAD_ROOT, 'CHANGELOG.md');
const scadManifest  = join(SCAD_ROOT, 'latest_scad_version.json');
const appPath       = join(WEB_ROOT, 'app.html');
const swPath        = join(WEB_ROOT, 'sw.js');
const webChangelog  = join(WEB_ROOT, 'CHANGELOG.md');

// Uncommitted edits to the files a release rewrites would be silently swept into
// the release commit. Untracked clutter elsewhere (logs, scratch files) is fine.
const dirty = (root, ...files) =>
  git(root, 'status', '--porcelain', '--', ...files).split(NL).filter(Boolean);
const scadDirty = dirty(SCAD_ROOT, 'keyguard.scad', 'CHANGELOG.md', 'latest_scad_version.json');
// keyguard_v*.scad too: the release stages that whole pattern (see the commit
// below), so a leftover change to one of them would ride along unannounced.
const webDirty  = dirty(WEB_ROOT, 'app.html', 'sw.js', 'CHANGELOG.md', 'latest_app_version.json',
                        'keyguard_v*.scad');
if (scadDirty.length) die(`.scad repo has uncommitted changes to release files:${NL}  ${scadDirty.join(NL + '  ')}`);
if (webDirty.length)  die(`web app repo has uncommitted changes to release files:${NL}  ${webDirty.join(NL + '  ')}`);

// The .scad side: is there anything to release at all?
const scadText = read(scadPath);
const N = versionOf(scadText);
if (N == null) die(`no keyguard_designer_version found in ${scadPath}`);

const publishedNow = JSON.parse(read(scadManifest)).version;
if (N <= publishedNow) {
  die(`keyguard.scad is at v${N} and v${publishedNow} is already published — nothing to release.${NL}`
    + `  The dev copy should lead the published one by one. If you meant to release app\n`
    + `  changes only, say "bump keyguard web app" instead.`);
}

const scadBullets = unreleasedBullets(read(scadChangelog));
if (scadBullets === null) die(`.scad CHANGELOG.md has no "${UNRELEASED.trim()}" heading.`);
if (!scadBullets.length) {
  die(`.scad CHANGELOG.md has nothing under "${UNRELEASED.trim()}", so v${N} has no clinician`
    + ` notes.${NL}  Those bullets ARE the "What's new" list in the update dialog — a version`
    + ` must never be${NL}  advertised without them. Write them, then run this again.`);
}

// The web app side: this command may only carry a trivial release.
const webBullets = unreleasedBullets(read(webChangelog));
if (webBullets === null) die(`web app CHANGELOG.md has no "${UNRELEASED.trim()}" heading.`);
const appWork = webBullets.filter(b => !DESIGNER_BULLET.test(b));
if (appWork.length) {
  die(`the web app has ${appWork.length} unreleased change(s) of its own:${NL}`
    + appWork.map(b => '    - ' + (b.match(/^- \*\*(.+?)\*\*/)?.[1] ?? b.slice(2, 70))).join(NL)
    + `${NL}${NL}  This command only carries a trivial "here is a new keyguard file" release.`
    + `${NL}  Release that work first with "bump keyguard web app", then run this.`);
}

// Will the RETIRED app still cope with this keyguard? Stragglers on the old
// address are still offered every new keyguard version (Ken chose to leave that
// alone, 1 Sep 2026), and that address is never released again — so a version they
// cannot drive is a fault we could never send them a fix for. Checked here, before
// the first push, while it is still cheap.
say(`${NL}Checking compatibility with the retired app (release 21):`);
try {
  execFileSync(process.execPath, [join(WEB_ROOT, 'scripts', 'check-old-app-compat.mjs')],
    { cwd: WEB_ROOT, stdio: 'inherit' });
} catch {
  die(`this keyguard version would break the retired app — nothing has been pushed.${NL}`
    + `  See the explanation above. Fix the .scad, or take the deliberate decision to`
    + `${NL}  break release 21 (which means stopping it offering keyguard updates first).`);
}

const APP_RELEASE = parseInt(read(appPath).match(/const APP_RELEASE = (\d+)/)?.[1], 10);
const cacheNow = parseInt(read(swPath).match(/const CACHE_NAME = 'keyguard-v(\d+)'/)?.[1], 10);
if (!Number.isFinite(APP_RELEASE) || !Number.isFinite(cacheNow)) die('cannot read APP_RELEASE or CACHE_NAME.');
if (APP_RELEASE <= cacheNow) {
  die(`APP_RELEASE is ${APP_RELEASE} but CACHE_NAME is already keyguard-v${cacheNow}.`
    + `${NL}  The dev copy must lead the last release by one; refusing to reuse a cache number.`);
}

say(`Keyguard designer v${publishedNow} -> v${N}   (${scadBullets.length} clinician note(s))`);
say(`Web app release ${APP_RELEASE}, cache keyguard-v${cacheNow} -> keyguard-v${APP_RELEASE}`);
say(`${NL}Phase 1 — publish the keyguard designer:`);

// ─── Phase 1: release the .scad ────────────────────────────────────────────

let cl = read(scadChangelog);
plan(`CHANGELOG: "Unreleased" -> "## Version ${N}", open a fresh Unreleased`);
write(scadChangelog, cl.replace(UNRELEASED, UNRELEASED + NL + `## Version ${N}` + NL, 1));

plan('regenerate latest_scad_version.json from keyguard.scad + CHANGELOG');
node(WEB_ROOT, join(WEB_ROOT, 'scripts', 'publish-scad-version.mjs'));
if (!DRY) {
  const got = JSON.parse(read(scadManifest)).version;
  if (got !== N) die(`manifest says v${got} but keyguard.scad says v${N} — aborting before the push.`);
}

plan(`commit the v${N} release in the .scad repo`);
git(SCAD_ROOT, 'add', 'keyguard.scad', 'CHANGELOG.md', 'latest_scad_version.json');
git(SCAD_ROOT, 'commit', '-m', `Release Keyguard Designer version ${N}`);

plan('PUSH the .scad repo — keyguard.scad on main is what clinicians download');
git(SCAD_ROOT, 'push', 'origin', 'main');

plan(`pre-bump keyguard_designer_version ${N} -> ${N + 1} (local only)`);
write(scadPath, read(scadPath).replace(
  `keyguard_designer_version = ${N};`, `keyguard_designer_version = ${N + 1};`));
git(SCAD_ROOT, 'add', 'keyguard.scad');
git(SCAD_ROOT, 'commit', '-m', `Local version ${N + 1} pre-bump (dev leads public by one)`);

// ─── Phase 2: deliver it through the web app ───────────────────────────────

say(`${NL}Phase 2 — deliver it through the web app:`);

// GitHub serves the new bytes a moment after the push; publish-designer-file
// verifies what it fetched, so a stale read would abort it rather than ship the
// wrong file. Wait for the version we just pushed.
plan(`wait for GitHub to serve keyguard.scad v${N}`);
if (!DRY) {
  let seen = null;
  for (let i = 0; i < 30; i++) {
    try {
      const resp = await fetch(PUBLISHED_SCAD_URL + '?t=' + Date.now(), { cache: 'no-store' });
      if (resp.ok) { seen = versionOf(await resp.text()); if (seen === N) break; }
    } catch { /* transient — keep waiting */ }
    await new Promise(r => setTimeout(r, 4000));
  }
  if (seen !== N) {
    die(`GitHub is still serving v${seen} two minutes after the push.${NL}`
      + `  The .scad release IS out; only the web-app half is unfinished. Re-run\n`
      + `  "publish the designer file" and then "bump keyguard web app" once it appears.`);
  }
}

plan('publish the designer file beside app.html + add the clinician bullet');
node(WEB_ROOT, join(WEB_ROOT, 'scripts', 'publish-designer-file.mjs'));

plan(`CACHE_NAME keyguard-v${cacheNow} -> keyguard-v${APP_RELEASE}`);
write(swPath, read(swPath).replace(
  `const CACHE_NAME = 'keyguard-v${cacheNow}';`,
  `const CACHE_NAME = 'keyguard-v${APP_RELEASE}';`));

plan(`CHANGELOG: "Unreleased" -> "## Release ${APP_RELEASE}", open a fresh Unreleased`);
write(webChangelog, read(webChangelog).replace(
  UNRELEASED, UNRELEASED + NL + `## Release ${APP_RELEASE}` + NL, 1));

plan('regenerate the bundled "What\'s new" notes');
node(WEB_ROOT, join(WEB_ROOT, 'scripts', 'apply-release-notes.mjs'));

plan(`write latest_app_version.json = ${APP_RELEASE}`);
node(WEB_ROOT, join(WEB_ROOT, 'scripts', 'publish-app-version.mjs'));

plan(`commit web app release ${APP_RELEASE}`);
git(WEB_ROOT, 'add', 'app.html', 'sw.js', 'CHANGELOG.md', 'latest_app_version.json',
    'latest_scad_version.json');
// The new keyguard file AND the removal of the one it supersedes, as a
// pattern. publish-designer-file.mjs deletes superseded copies from disk;
// staging only the new file by name left each deletion uncommitted, so every
// old copy stayed on the live site (v87 and v88 were found that way,
// 18 Sep 2026). -A on the pattern stages additions and removals, nothing else.
git(WEB_ROOT, 'add', '-A', '--', 'keyguard_v*.scad');
git(WEB_ROOT, 'commit', '-m',
  `Release Keyguard Designer web app ${APP_RELEASE}`
  + `${NL}${NL}Delivers keyguard designer v${N}, published moments earlier. This release`
  + `${NL}exists to carry that file: clinicians fetch it from this app's own address,`
  + `${NL}so it reaches them only when the app itself is released.`);

plan('PUSH the web app — this is the release clinicians receive');
git(WEB_ROOT, 'push', 'origin', 'main');

plan(`pre-bump APP_RELEASE ${APP_RELEASE} -> ${APP_RELEASE + 1} (local only)`);
write(appPath, read(appPath).replace(
  `const APP_RELEASE = ${APP_RELEASE};`, `const APP_RELEASE = ${APP_RELEASE + 1};`));
git(WEB_ROOT, 'add', 'app.html');
git(WEB_ROOT, 'commit', '-m', `Local release ${APP_RELEASE + 1} pre-bump (dev leads public by one)`);

say(`${NL}${DRY ? `Plan only — ${steps.length} steps, nothing changed.`
  : `Done. Keyguard designer v${N} and web app release ${APP_RELEASE} are both public.`}`);
if (!DRY) {
  say(`Clinicians refresh to app ${APP_RELEASE} on their next visit, then get offered keyguard v${N}.`);
}
