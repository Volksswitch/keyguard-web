// Screenshots of the real app for the User Manual, captured at twice screen resolution.
//
// ⚠ THESE ARE PHOTOGRAPHS OF THE RUNNING APP, NOT DRAWINGS (the rule Conversant's manual
// figures follow). The app is loaded, driven into each state the manual describes, and
// captured, so a figure can't show a layout the app no longer has.
//
// The sample project is Documents/manual-sample/ (the TouchChat WordPower 42 exercise from
// the Basic workshop). The browser can't be handed a real folder without the folder picker,
// so the script copies the sample into the browser's own private storage and leaves that
// folder where the app looks for the last project it opened. The app then opens it exactly
// as it opens a clinician's folder.
//
// It writes figures/*.png and figures/regions.json (each labeled element's box, in image
// pixels); label-manual-figures.py draws the numbered labels from that.
//
// Run it against this folder's server (the "keyguard-web" preview on port 8077, or
// serve.bat) for the figures that should show unreleased work, and against the live
// address for Check my setup, whose results name the address and the release:
//
//   node scripts/doc-generators/capture-manual-figures.mjs http://localhost:8077
//   node scripts/doc-generators/capture-manual-figures.mjs https://keyguard.volksswitch.org --only um-check.png
//
// It drives the installed Microsoft Edge, so the browser check reads as a clinician's
// would. Playwright comes from the retired sibling's test harness, the one install here.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SIBLING = path.join(process.env.OneDrive, '4 T-Z', 'Volksswitch', 'Keyguard', 'keyguard-designer-web');
const require = createRequire(path.join(SIBLING, 'package.json'));
const { chromium } = require('playwright');

const BASE = process.argv[2] || 'http://localhost:8077';
const ONLY = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
const want = name => !ONLY || ONLY === name;
const SAMPLE_DIR = path.join(HERE, '..', '..', 'Documents', 'manual-sample');
const OUT = path.join(HERE, 'figures');
const SCALE = 2;
const SAMPLE = ['keyguard_v92.scad', 'keyguard_v92.json', 'openings_and_additions.txt', 'WordPower 42 screenshot.png'];
fs.mkdirSync(OUT, { recursive: true });

const regions = {};
const sleep = ms => new Promise(r => setTimeout(r, ms));

const browser = await chromium.launch({ channel: 'msedge', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: SCALE, colorScheme: 'light' });
page.on('pageerror', e => console.log('page error:', e.message));

// Wait until the app has finished drawing: the status line clears and the Console is quiet.
async function settled(ms = 1500) {
  await page.waitForFunction(() => {
    const s = document.getElementById('viewport-status');
    return !s || !/render|loading|updating/i.test(s.textContent || '') || s.offsetParent === null;
  }, null, { timeout: 120000 });
  await sleep(ms);
}
async function box(sel) {
  return page.locator(sel).first().evaluate(e => {
    const r = e.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
}
async function shot(name, clip) {
  if (!want(name)) return;
  // Software 3D drawing is slow with the full-size screenshot under the keyguard, so a
  // frame can take many seconds to arrive.
  await page.screenshot({ path: path.join(OUT, name), timeout: 180000,
    clip: clip ? { x: clip.x, y: clip.y, width: clip.w, height: clip.h } : undefined });
  console.log('captured', name);
}
const pad = (b, p) => ({ x: Math.max(0, b.x - p), y: Math.max(0, b.y - p), w: b.w + 2 * p, h: b.h + 2 * p });

// ---- put the sample project where the app will reopen it ----
// The files go in from here rather than being fetched, so this works against any address.
const files = SAMPLE.map(n => [n, fs.readFileSync(path.join(SAMPLE_DIR, n)).toString('base64')]);
await page.goto(`${BASE}/app.html`);
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
  // Pin the appearance to the defaults whatever this browser profile last used.
  localStorage.removeItem('keyguard:settings');
}, files);
await page.reload();
await sleep(1500);
await page.click('#open-project-btn');
await page.waitForFunction(() => /keyguard design/.test(document.getElementById('project-folder-label')?.textContent || ''), null, { timeout: 60000 });
await settled(2500);

// Choose the sample design, then Intermediate, which shows the screenshot setting the
// manual's walkthrough uses.
await page.click('#preset-dropdown-btn');
await page.locator('#preset-list li', { hasText: 'WordPower 42' }).first().click();
await settled(3000);
await page.selectOption('#skill-select', 'intermediate');
await settled(1000);
console.log('unsaved-changes marker showing:', await page.evaluate(() => {
  const m = document.getElementById('dirty-marker');
  return !!m && getComputedStyle(m).display !== 'none' && getComputedStyle(m).visibility !== 'hidden' && (m.textContent || '').trim() !== '';
}));

// ---- Figure 1: the whole window ----
await page.click('#view-fit');
await settled(800);
await shot('um-screen.png');
// The third item says where the badge sits: a corner, or a fraction of the way across a
// thin strip, chosen so it covers nothing a reader needs (the toolbar's gap after PNG).
regions['um-screen.png'] = [
  ['1', await box('#viewport'), 'tl'],
  ['2', await box('#viewport-toolbar'), 'at:0.72'],
  ['3', await box('#right'), 'bl'],
  ['4', await box('#console-wrap'), 'br'],
];

// ---- Figure 3: the top of the Customizer ----
await shot('um-presets.png', pad(await box('#cust-header'), 4));

// ---- Figure 6: the toolbar ----
// The strip is too long and thin to read at page width, so the label script joins its two
// ends and leaves out the empty middle. Record where the ends are.
await shot('um-toolbar.png', await box('#viewport-toolbar'));
const tb = await box('#viewport-toolbar'), png = await box('#export-png'), undo = await box('#undo-btn');
regions.toolbarCut = { leftEnd: png.x + png.w + 10 - tb.x, rightStart: undo.x - 10 - tb.x };

// ---- Figure 2: the keyguard over the screenshot, from the top ----
await page.click('#view-top');
await settled(1200);
await shot('um-underlay.png', await box('#viewport'));

// ---- Figures 4 and 5: Custom Openings ----
await page.click('#openings-btn');
await sleep(1500);
await page.click('#oge-add-rect');
await settled(1500);
await shot('um-byeye.png', await box('#viewport'));
await page.click('#openings-tabs [data-tab="table"]');
await sleep(800);
await shot('um-table.png', pad(await box('#openings-panel'), 2));
await page.click('#openings-tabs [data-tab="eye"]');
await sleep(500);
await page.click('#openings-cancel');
await sleep(500);
const discard = page.locator('button', { hasText: 'Discard' });
if (await discard.count()) await discard.first().click();
await settled(1500);

// ---- Figure 7: the Help menu ----
await page.click('#help-btn');
await sleep(400);
await shot('um-help.png', pad(await box('#help-menu'), 6));
await page.keyboard.press('Escape');
await sleep(300);

// ---- Figure 8: Troubleshooting after Check my setup ----
await page.click('#settings-btn');
await sleep(400);
await page.click('.cat[data-cat="trouble"]');
await sleep(400);
await page.locator('button', { hasText: 'Check my setup' }).first().click();
await sleep(9000);
await shot('um-check.png', pad(await box('#settings-modal'), 2));

if (!ONLY) fs.writeFileSync(path.join(OUT, 'regions.json'), JSON.stringify({ scale: SCALE, regions }, null, 1));
await browser.close();
console.log('done:', OUT);
