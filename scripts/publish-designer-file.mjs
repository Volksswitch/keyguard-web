#!/usr/bin/env node
// Publish the current PUBLIC keyguard designer file alongside the web app.
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
// The cost is that the two release streams are welded together — a new designer
// version reaches clinicians only when the web app is next released. Ken's call
// (1 Sep 2026): the designer moves far slower than the app, so this is cheap.
//
// WHAT IT WRITES (both beside app.html, both deliberately OUT of sw.js's SHELL
// precache list — a precached designer file could never be replaced):
//   keyguard_v<N>.scad        byte-identical to the published file
//   latest_scad_version.json  the version list the app reads, with a RELATIVE
//                             scad_url so each address serves its own copy
//
// The bytes come from GitHub rather than from the .scad project's working copy
// on purpose: the working copy is pre-bumped one version ahead (the same
// convention as APP_RELEASE here), so it is NOT what clinicians should be
// handed. The published manifest in the .scad project says which version is
// public; this script fetches exactly that and refuses anything else.
//
// Run from the keyguard-web project root (trigger phrase: "publish the
// designer file"). Publishing it to clinicians still needs an app release.

import { readFile, writeFile, readdir, unlink } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Sibling of the web-app root, so it resolves on either machine without a
// hardcoded user path. Override with KEYGUARD_DESIGNER_ROOT.
const SCAD_ROOT = process.env.KEYGUARD_DESIGNER_ROOT
  || resolve(WEB_ROOT, '..', 'My SCAD files', 'keyguard designer');

const PUBLISHED_SCAD_URL =
  'https://raw.githubusercontent.com/Volksswitch/keyguard/main/keyguard.scad';

function die(msg) {
  console.error(`publish-designer-file: ${msg}`);
  process.exit(1);
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

const stale = (await readdir(WEB_ROOT))
  .filter(f => /^keyguard_v\d+\.scad$/i.test(f) && f !== scadFilename);
for (const f of stale) await unlink(join(WEB_ROOT, f));

// 4. The version list the app reads. scad_url is RELATIVE so the app downloads
//    from whichever address is serving it — no third-party hostname involved.
const outManifest = {
  version,
  scad_filename: scadFilename,
  scad_url: `./${scadFilename}`,
  notes,
};
await writeFile(
  join(WEB_ROOT, 'latest_scad_version.json'),
  JSON.stringify(outManifest, null, 2) + '\n',
  'utf8',
);

const kb = Math.round(scadText.length / 1024);
console.log(`Wrote ${scadFilename} (${kb} KB) and latest_scad_version.json for v${version}.`);
if (stale.length) console.log(`Removed superseded: ${stale.join(', ')}`);
console.log(`Clinicians see v${version} only after the next web app release.`);
