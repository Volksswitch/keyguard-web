// The app, opened in a browser with the sample project, for the tools that photograph it:
// the User Manual's figures (scripts/doc-generators/capture-manual-figures.mjs) and the
// how-to videos (scripts/video/render-video.mjs).
//
// The sample project is Documents/manual-sample/: the TouchChat WordPower 42 exercise from
// the Basic workshop. A browser can't be handed a real folder without the folder picker, so
// the files are copied into the browser's own private storage, and that folder is left where
// the app looks for the last project it opened. Clicking Open Project then opens it exactly
// as it opens a clinician's folder.
//
// Playwright comes from the retired sibling's test harness, the one install on this machine.
// The installed Microsoft Edge is driven, so anything the app says about the browser reads
// as it would for a clinician.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT = path.resolve(HERE, '..', '..');
const SIBLING = path.join(process.env.OneDrive, '4 T-Z', 'Volksswitch', 'Keyguard', 'keyguard-designer-web');
const require = createRequire(path.join(SIBLING, 'package.json'));
export const { chromium } = require('playwright');

export const SAMPLE_DIR = path.join(PROJECT, 'Documents', 'manual-sample');
export const SAMPLE = ['keyguard.scad', 'keyguard.json', 'openings_and_additions.txt',
  'WordPower 42 screenshot.png'];
export const sleep = ms => new Promise(r => setTimeout(r, ms));

export function launch() {
  // Software drawing: a headless browser has no graphics card to draw the 3D view with.
  return chromium.launch({ channel: 'msedge', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
}

// Wait until the app has finished drawing: the status line clears and things go quiet.
// It must stay quiet for half a second, not pass one check, because a change can start a
// second drawing just after the first ends. While the app waits on a question of its own
// (Set it up, an update offer) its status can read "loading" indefinitely, so after
// `timeout` it carries on rather than stopping the run.
export async function settled(page, ms = 1500, { timeout = 120000 } = {}) {
  const busy = () => page.evaluate(() => {
    const s = document.getElementById('viewport-status');
    return !!s && s.offsetParent !== null && /render|loading|updating/i.test(s.textContent || '');
  });
  const end = Date.now() + timeout;
  let quietSince = null;
  while (Date.now() < end) {
    if (await busy()) quietSince = null;
    else if (quietSince === null) quietSince = Date.now();
    else if (Date.now() - quietSince >= 500) break;
    await sleep(100);
  }
  await sleep(ms);
}

// The files of a sample folder, read here so they can be handed to the page: the sample
// project, another folder (`dir`, every file in it), or none (`empty`).
function sampleFiles({ dir = null, empty = false } = {}) {
  const from = dir ? path.resolve(PROJECT, dir) : SAMPLE_DIR;
  const names = empty ? [] : dir ? fs.readdirSync(from).filter(n => fs.statSync(path.join(from, n)).isFile()) : SAMPLE;
  return names.map(n => [n, fs.readFileSync(path.join(from, n)).toString('base64')]);
}

// The app as a first-time visitor sees it: no folder remembered, settings at the defaults.
export async function freshApp(page, base) {
  await page.goto(`${base}/app.html`);
  await page.evaluate(async () => {
    const root = await navigator.storage.getDirectory();
    try { await root.removeEntry('keyguard design', { recursive: true }); } catch {}
    await new Promise((res) => { const q = indexedDB.deleteDatabase('keyguard-db'); q.onsuccess = q.onerror = q.onblocked = res; });
    localStorage.removeItem('keyguard:settings');
  });
  await page.reload();
  await sleep(1500);
}

// Puts a project folder named "keyguard design" in the browser's private storage and leaves
// it where the app looks for the last folder it opened. The app reads that when Open
// Project is clicked, so it opens this folder instead of showing the folder picker.
export async function rememberFolder(page, opts = {}) {
  await page.evaluate(async (files) => {
    const root = await navigator.storage.getDirectory();
    try { await root.removeEntry('keyguard design', { recursive: true }); } catch {}
    const dir = await root.getDirectoryHandle('keyguard design', { create: true });
    for (const [n, b64] of files) {
      const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
      const w = await (await dir.getFileHandle(n, { create: true })).createWritable();
      await w.write(bytes);
      await w.close();
    }
    const db = await new Promise((res, rej) => {
      const q = indexedDB.open('keyguard-db', 1);
      q.onupgradeneeded = () => q.result.createObjectStore('handles');
      q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error);
    });
    await new Promise((res, rej) => {
      const tx = db.transaction('handles', 'readwrite');
      tx.objectStore('handles').put(dir, 'lastProject');
      tx.objectStore('handles').put([dir], 'recentProjects');
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
  }, sampleFiles(opts));
}

// The sample folders keep the keyguard file they were made with, so once a newer one is
// published the app offers it as the folder opens, and its question sits over every
// control until it is answered (29 Oct 2026: the sample's v92 met v97 and every click
// timed out). It is turned down with Skip, which keeps the file, so the pictures stay
// those of the sample. Video 4.3, which is about this very question, opens its folder
// itself and never comes through here.
//
// On a busy computer the question can come later than 5 seconds (30 Oct 2026, while "sync
// videos" was rendering: the figures stopped at the first click). So the wait is longer,
// and the question is looked for again just before the first click, in case it came later
// still.
async function skipUpdateOffer(page, ms = 12000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (await page.locator('#update-overlay.open').count()) {
      await page.click('#update-skip');
      await settled(page, 1000);
      return true;
    }
    await sleep(250);
  }
  return false;
}

// Waits for a project to finish opening, then picks the design and skill level.
export async function projectReady(page, { preset = 'WordPower 42', skill = 'intermediate' } = {}) {
  const opened = () => /keyguard design/.test(document.getElementById('project-folder-label')?.textContent || '');
  await page.waitForFunction(() =>
    /keyguard design/.test(document.getElementById('project-folder-label')?.textContent || '') ||
    !!document.getElementById('update-overlay')?.classList.contains('open'), null, { timeout: 60000 });
  await skipUpdateOffer(page);
  await page.waitForFunction(opened, null, { timeout: 60000 });
  await settled(page, 2500);
  await skipUpdateOffer(page, 1000);
  if (preset) {
    await page.click('#preset-dropdown-btn');
    await page.locator('#preset-list li', { hasText: preset }).first().click();
    await settled(page, 3000);
  }
  if (skill) {
    await page.selectOption('#skill-select', skill);
    await settled(page, 1000);
  }
}

// Opens the app at base (e.g. http://localhost:8077) with the sample project, on the
// sample design, at the given skill level. Settings start from the app's defaults.
//   dir      another sample folder to use instead (every file in it is copied)
//   none     no project: the app as a first-time visitor sees it
//   open     false leaves the folder remembered but not opened, for a video that shows
//            what happens when Open Project is clicked
export async function openSampleProject(page, base, opts = {}) {
  await freshApp(page, base);
  if (opts.none) return;
  await rememberFolder(page, opts);
  await page.reload();
  await sleep(1500);
  if (opts.open === false) return;
  await page.click('#open-project-btn');
  await projectReady(page, opts);
}
