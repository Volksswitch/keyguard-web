#!/usr/bin/env node
// apply-release-notes.mjs — regenerate the bundled RELEASE_NOTES block in
// app.html from CHANGELOG.md. Trigger phrase: "apply release notes".
//
// CHANGELOG.md is the single source of truth for clinician-facing notes. The app
// shows a "What's new" notice after it silently auto-updates, and those notes are
// BUNDLED in app.html (not fetched) so the notice works on locked-down networks.
// This script parses CHANGELOG.md and injects a `const RELEASE_NOTES = {…}` object
// (keyed by release number) between the @@RELEASE_NOTES_START@@ / _END@@ markers.
//
// Mapping:
//   "## Release N"                → key N        (a shipped release)
//   "## Unreleased (next release)" → key APP_RELEASE  (so a dev build can preview
//                                                      the pending notes)
// Bullets are every "- …" line under a heading (### subheads are flattened);
// markdown emphasis (**bold**, `code`) is stripped to plain text since the modal
// renders with textContent. Italic-only placeholders (_Nothing yet._) are skipped.

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));   // web-app repo root
const appPath = join(root, 'app.html');
const changelogPath = join(root, 'CHANGELOG.md');

const app = readFileSync(appPath, 'utf8');
const appReleaseMatch = app.match(/const\s+APP_RELEASE\s*=\s*(\d+)/);
if (!appReleaseMatch) {
  console.error('ERROR: APP_RELEASE not found in app.html');
  process.exit(1);
}
const APP_RELEASE = parseInt(appReleaseMatch[1], 10);

const START = '// @@RELEASE_NOTES_START@@';
const END = '// @@RELEASE_NOTES_END@@';
if (!app.includes(START) || !app.includes(END)) {
  console.error(`ERROR: RELEASE_NOTES markers not found in app.html (${START} / ${END})`);
  process.exit(1);
}

// ---- parse CHANGELOG.md -------------------------------------------------------
// Strip markdown emphasis to plain text (the modal renders with textContent).
// Protect backslash-escaped punctuation (e.g. "STL\*") so it survives as a literal.
// Underscores are left alone — they appear literally in filenames like
// openings_and_additions.txt, and the only _italic_ use is the placeholder lines,
// which are filtered out separately.
const clean = (s) => s
  .replace(/\\\*/g, '').replace(/\\`/g, '')   // shield escaped * and `
  .replace(/\*\*(.*?)\*\*/g, '$1')                        // **bold**
  .replace(/\*(.*?)\*/g, '$1')                            // *italic*
  .replace(/`/g, '')                                      // `code`
  .replace(//g, '*').replace(//g, '`')        // restore literals
  .trim();

const notes = {};                 // { releaseNumber: [bullet, …] }
let key = null;                   // current release number, or null to ignore
let lastArr = null;               // array we're appending bullets to (for wrapping)
const released = new Set();       // keys from "## Release N" headings (shipped, or shipping now)

for (const raw of readFileSync(changelogPath, 'utf8').split('\n')) {
  const line = raw.replace(/\s+$/, '');
  let m;
  if ((m = line.match(/^##\s+Release\s+(\d+)/i))) {
    key = parseInt(m[1], 10); released.add(key); notes[key] = notes[key] || []; lastArr = notes[key]; continue;
  }
  if (/^##\s+Unreleased\b/i.test(line)) {
    key = APP_RELEASE; notes[key] = notes[key] || []; lastArr = notes[key]; continue;
  }
  if (/^##\s+/.test(line)) { key = null; lastArr = null; continue; }   // some other H2 → ignore
  if (/^###\s+/.test(line)) continue;                                  // subheader → keep current key
  if (key == null) continue;

  const bullet = line.match(/^\s*-\s+(.*)$/);
  if (bullet) {
    const text = clean(bullet[1]);
    if (text && !/^_.*_$/.test(text)) lastArr.push(text);   // skip _Nothing yet._ / _In development._
    else lastArr.__skip = true;                              // remember placeholder so wraps don't attach
  } else if (line.trim() && lastArr && lastArr.length && !lastArr.__skip) {
    lastArr[lastArr.length - 1] += ' ' + clean(line);        // wrapped continuation of previous bullet
  }
}

// Drop empty release keys (heading with only a placeholder).
for (const k of Object.keys(notes)) {
  delete notes[k].__skip;
  if (!notes[k].length) delete notes[k];
}

// ---- release dates ------------------------------------------------------------
// Settings → About lists the last three months of changes, so each release needs
// the day it went out. That is the day of its "Release N" commit. A release being
// made right now (step 4 of the ritual runs before its commit) has none yet and is
// dated today; the dev build's Unreleased notes get no date at all.
const dates = {};
try {
  const log = execSync('git log --reverse --date=short --format=%ad%x09%s', { cwd: root, encoding: 'utf8' });
  for (const line of log.split('\n')) {
    // "Release 120", "Release 101 — …", and for 102-106 "Release Keyguard Designer web app 104".
    const m = line.match(/^(\d{4}-\d{2}-\d{2})\tRelease (?:Keyguard Designer web app )?(\d+)(?:$| — )/);
    if (m && !dates[m[2]]) dates[m[2]] = m[1];
  }
} catch (e) {
  console.error(`ERROR: could not read release dates from git: ${e.message}`);
  process.exit(1);
}
const today = new Date().toLocaleDateString('en-CA');            // YYYY-MM-DD, local
const releaseDates = {};
for (const k of Object.keys(notes)) {
  if (dates[k]) releaseDates[k] = dates[k];
  else if (released.has(Number(k))) releaseDates[k] = today;
}

// ---- the keyguard file's recent changes -----------------------------------------
// Settings → About lists these too. Bundled here, from the `history` in the version
// list beside app.html (written by publish-designer-file.mjs), so the box needs no
// network request of its own; each project open tops it up with anything newer
// from the same list, which the update check fetches anyway.
let designerNotes = [];
try {
  const h = JSON.parse(readFileSync(join(root, 'latest_scad_version.json'), 'utf8')).history;
  if (Array.isArray(h)) designerNotes = h;
} catch (e) {
  console.error(`ERROR: could not read latest_scad_version.json: ${e.message}`);
  process.exit(1);
}
if (!designerNotes.length) {
  console.error('ERROR: latest_scad_version.json has no history. Run "publish the designer file" first.');
  process.exit(1);
}

// ---- inject -------------------------------------------------------------------
const body = `const RELEASE_NOTES = ${JSON.stringify(notes, null, 2)};\n`
  + `const RELEASE_DATES = ${JSON.stringify(releaseDates, null, 2)};\n`
  + `const DESIGNER_NOTES = ${JSON.stringify(designerNotes, null, 2)};`;
const block = `${START}\n${body}\n${END}`;
const re = new RegExp(`${START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
writeFileSync(appPath, app.replace(re, block));

const keys = Object.keys(notes).map(Number).sort((a, b) => b - a);
console.log(`Wrote RELEASE_NOTES to app.html — ${keys.length} release(s): ${keys.join(', ')}`);
console.log(`(APP_RELEASE=${APP_RELEASE}; "## Unreleased" mapped to ${APP_RELEASE} if it had bullets.)`);
