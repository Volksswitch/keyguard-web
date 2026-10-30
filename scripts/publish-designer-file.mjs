#!/usr/bin/env node
// Publish the current PUBLIC keyguard designer file alongside the web app. This
// is what actually puts a new keyguard version in front of clinicians.
//
// WHY THIS EXISTS
// ---------------
// The app used to ask raw.githubusercontent.com which designer version was
// current, and download it from there. School networks block that hostname by
// name — it is a well-known file-staging address — so the clinicians the move
// to keyguard.volksswitch.org was made for could open the app and still never
// be offered a designer update. The check fails silently by design, so they
// could not even tell it was happening (field report, 1 Sep 2026: an SLP inside
// a school network, holding v73, offered nothing while v87 was current).
//
// Serving the designer file from the app's own address fixes that: it arrives
// by the same route as the app itself, which that network has already allowed.
//
// WHAT IT WRITES (all beside app.html; the first two deliberately OUT of sw.js's
// SHELL precache list — a precached designer file could never be replaced):
//   keyguard_v<N>.scad          byte-identical to the published file
//   openings_and_additions.txt  the starter openings file, byte-identical to
//                               the published one — what the app puts into an
//                               empty folder for a clinician starting out
//   latest_scad_version.json    the version list the app reads, with RELATIVE
//                               urls so each address serves its own copies
//
// The openings file is published by this same act ON PURPOSE: its columns and
// shapes are defined by the keyguard file, so the two must never be able to
// disagree about which version a clinician was handed.
//
// Nothing else. Because both files sit OUTSIDE the precache, a running app
// fetches them from the network and offers the new version without an app
// release — so this touches no app file (Ken, 24 Sep 2026).
//
// The bytes come from GitHub rather than from the .scad project's working copy
// on purpose: the working copy is pre-bumped one version ahead (the same
// convention as APP_RELEASE here), so it is NOT what clinicians should be
// handed. The published manifest in the .scad project says which version is
// public; this script fetches exactly that and refuses anything else.
//
// Run from the keyguard-web project root. Trigger phrase: "publish the designer
// file". It stops short of committing or pushing — see step 5. The normal path
// is "bump keyguard designer", which runs this and then pushes.

import { readFile, writeFile, readdir, unlink } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Sibling of the web-app root, so it resolves on either machine without a
// hardcoded user path. Override with KEYGUARD_DESIGNER_ROOT.
const SCAD_ROOT = process.env.KEYGUARD_DESIGNER_ROOT
  || resolve(WEB_ROOT, '..', 'My SCAD files', 'keyguard designer');

const PUBLISHED_SCAD_URL =
  'https://raw.githubusercontent.com/Volksswitch/keyguard/main/keyguard.scad';
const PUBLISHED_OA_URL =
  'https://raw.githubusercontent.com/Volksswitch/keyguard/main/openings_and_additions.txt';
const OA_FILENAME = 'openings_and_additions.txt';

function die(msg) {
  console.error(`publish-designer-file: ${msg}`);
  process.exit(1);
}

// Settings → About lists the last three months of changes to the app and to the
// keyguard file. The app's own are bundled in it; the keyguard file's change
// without an app release, so they travel here, in the version list, as
// [{ version, date, notes }] newest first. Notes come from the .scad project's
// CHANGELOG.md ("## Version N" bullets, markdown kept: the app renders ** and `),
// dates from its "Release Keyguard Designer version N" commits. Four months are
// kept so the app's three-month window is always full; it does the cutting.
function designerHistory() {
  const dates = {};
  const log = execSync('git log --reverse --date=short --format=%ad%x09%s', { cwd: SCAD_ROOT, encoding: 'utf8' });
  for (const line of log.split('\n')) {
    // "Release Keyguard Designer version 97"; before September 2026, "Release v85 — …".
    const m = line.match(/^(\d{4}-\d{2}-\d{2})\tRelease (?:Keyguard Designer version |v)(\d+)(?:$|[ :])/);
    if (m && !dates[m[2]]) dates[m[2]] = m[1];
  }
  const out = [];
  let cur = null;
  for (const raw of readFileSync(join(SCAD_ROOT, 'CHANGELOG.md'), 'utf8').split('\n')) {
    const line = raw.replace(/\s+$/, '');
    const h = line.match(/^##\s+(.*)$/);
    if (h) {
      const v = h[1].match(/^Version\s+(\d+)$/);
      cur = v && Number(v[1]) <= version ? { version: Number(v[1]), date: dates[v[1]] || null, notes: [] } : null;
      if (cur) out.push(cur);
      continue;
    }
    if (!cur) continue;
    const b = line.match(/^\s*-\s+(.*)$/);
    if (b) cur.notes.push(b[1]);
    else if (line.trim() && cur.notes.length && !/^#/.test(line)) cur.notes[cur.notes.length - 1] += ' ' + line.trim();
  }
  // A version with no release commit is old history, except the one being
  // published, whose commit is dated today.
  const today = new Date().toLocaleDateString('en-CA');
  for (const e of out) if (!e.date && e.version === version) e.date = today;
  const cutoff = new Date(); cutoff.setMonth(cutoff.getMonth() - 4);
  const since = cutoff.toLocaleDateString('en-CA');
  return out.filter(e => e.notes.length && e.date && e.date >= since)
            .sort((a, b) => b.version - a.version);
}

function parseDesignerVersion(text) {
  const m = (text || '').match(/keyguard_designer_version\s*=\s*(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

// 1. What version is PUBLIC? The .scad project's own published manifest is the
//    authority — not its working copy, which leads by one.
const srcManifestPath = join(SCAD_ROOT, 'latest_scad_version.json');
let srcManifest;
try {
  srcManifest = JSON.parse(await readFile(srcManifestPath, 'utf8'));
} catch (e) {
  die(`cannot read the .scad project's published manifest at\n  ${srcManifestPath}\n  ${e.message}\n`
    + `  Set KEYGUARD_DESIGNER_ROOT if the .scad project lives elsewhere.`);
}

const version = Number(srcManifest.version);
if (!Number.isFinite(version)) die(`the .scad manifest has no usable "version": ${srcManifest.version}`);

const notes = Array.isArray(srcManifest.notes) ? srcManifest.notes
  : srcManifest.notes ? [String(srcManifest.notes)] : [];
if (!notes.length) {
  die(`the .scad manifest for v${version} carries no clinician notes.\n`
    + `  Run "publish scad version" in the .scad project first — a version must never be\n`
    + `  advertised without the "What's new" list the update dialog shows.`);
}

// 2. Fetch the published bytes and prove they are the version just claimed.
//    A mismatch means the manifest was pushed without the file (or vice versa);
//    shipping either half alone would hand clinicians the wrong designer.
console.log(`Fetching published keyguard.scad (expecting v${version})…`);
let scadText;
try {
  const resp = await fetch(PUBLISHED_SCAD_URL, { cache: 'no-store' });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  scadText = await resp.text();
} catch (e) {
  die(`could not download the published designer file: ${e.message}\n`
    + `  (This script needs GitHub reachable — run it from a normal network.)`);
}

const got = parseDesignerVersion(scadText);
if (got !== version) {
  die(`the published file declares v${got}, but the .scad manifest promises v${version}.\n`
    + `  Nothing written. Push the matching keyguard.scad and manifest, then retry.`);
}

// 3. Write the new file, then clear out superseded ones. Write-before-delete,
//    the same ordering the app itself uses when swapping a clinician's folder.
const scadFilename = srcManifest.scad_filename || `keyguard_v${version}.scad`;
await writeFile(join(WEB_ROOT, scadFilename), scadText, 'utf8');

// The starter openings file rides along with the keyguard file it belongs to.
// Unversioned by nature, so there is no version to prove — but it must not be
// published empty or half-written, which would leave a beginner with a file
// that cannot be parsed.
console.log('Fetching published openings_and_additions.txt…');
let oaText;
try {
  const resp = await fetch(PUBLISHED_OA_URL, { cache: 'no-store' });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  oaText = await resp.text();
} catch (e) {
  die(`could not download the published openings file: ${e.message}`);
}
if (!/screen_openings\s*=/.test(oaText)) {
  die(`the published openings file does not look like one (no screen_openings). Nothing written.`);
}
await writeFile(join(WEB_ROOT, OA_FILENAME), oaText, 'utf8');

const stale = (await readdir(WEB_ROOT))
  .filter(f => /^keyguard_v\d+\.scad$/i.test(f) && f !== scadFilename);
for (const f of stale) await unlink(join(WEB_ROOT, f));

// 4. The version list the app reads. scad_url is RELATIVE so the app downloads
//    from whichever address is serving it — no third-party hostname involved.
const outManifest = {
  version,
  scad_filename: scadFilename,
  scad_url: `./${scadFilename}`,
  oa_filename: OA_FILENAME,
  oa_url: `./${OA_FILENAME}`,
  notes,
  history: designerHistory(),
};
await writeFile(
  join(WEB_ROOT, 'latest_scad_version.json'),
  JSON.stringify(outManifest, null, 2) + '\n',
  'utf8',
);

const NL = '\n';
const kb = Math.round(scadText.length / 1024);
console.log(`Wrote ${scadFilename} (${kb} KB), ${OA_FILENAME} and latest_scad_version.json for v${version}.`);
if (stale.length) console.log(`Removed superseded: ${stale.join(', ')}`);

// 5. That is the whole job.
//
// These files and latest_scad_version.json are ALL deliberately absent from
// sw.js's SHELL precache, so a running app fetches them from the network every
// time it checks a project. It therefore picks up a new designer version on its
// own, with no app refresh and no app release. Publishing the keyguard and
// releasing the app are separate acts (Ken, 24 Sep 2026): this writes nothing to
// app.html, sw.js, CHANGELOG.md or latest_app_version.json.
//
// Until that date this script also added a clinician bullet to the app's
// changelog and regenerated the bundled notes, because a token app release was
// believed necessary to deliver the file. It is not.
//
// It deliberately stops short of committing or pushing. release-designer.mjs
// does that as the second half of "bump keyguard designer"; run standalone, this
// is a repair tool and leaves the result for you to inspect first.
console.log(`${NL}Not committed or pushed. These two files are what clinicians fetch, so`);
console.log(`v${version} reaches them only once this repo's main is pushed.`);
