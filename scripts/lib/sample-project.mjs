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
export const SAMPLE = ['keyguard_v92.scad', 'keyguard_v92.json', 'openings_and_additions.txt',
  'WordPower 42 screenshot.png'];
export const sleep = ms => new Promise(r => setTimeout(r, ms));

export function launch() {
  // Software drawing: a headless browser has no graphics card to draw the 3D view with.
  return chromium.launch({ channel: 'msedge', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
}

// Wait until the app has finished drawing: the status line clears and things go quiet.
export async function settled(page, ms = 1500) {
  await page.waitForFunction(() => {
    const s = document.getElementById('viewport-status');
    return !s || !/render|loading|updating/i.test(s.textContent || '') || s.offsetParent === null;
  }, null, { timeout: 120000 });
  await sleep(ms);
}

// Opens the app at base (e.g. http://localhost:8077) with the sample project, on the
// sample design, at the given skill level. Settings start from the app's defaults.
export async function openSampleProject(page, base, { preset = 'WordPower 42', skill = 'intermediate' } = {}) {
  const files = SAMPLE.map(n => [n, fs.readFileSync(path.join(SAMPLE_DIR, n)).toString('base64')]);
  await page.goto(`${base}/app.html`);
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
    localStorage.removeItem('keyguard:settings');
  }, files);
  await page.reload();
  await sleep(1500);
  await page.click('#open-project-btn');
  await page.waitForFunction(() => /keyguard design/.test(document.getElementById('project-folder-label')?.textContent || ''),
    null, { timeout: 60000 });
  await settled(page, 2500);
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
