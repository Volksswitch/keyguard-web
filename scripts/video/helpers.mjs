// Small actions the video scripts share. Each returns a function of the page, ready to
// use as a step's `before`. They act the way a person would - clicking, typing, choosing
// from a list - so a video shows the app doing its own work.
import { settled, sleep, rememberFolder, projectReady } from '../lib/sample-project.mjs';

export { sleep };

// A project folder left where Open Project will find it (see sample-project.mjs).
export const folder = (opts = {}) => (page) => rememberFolder(page, opts);
export const ready = (opts = {}) => (page) => projectReady(page, opts);

// For a ring: one box around several controls (a row of toolbar buttons).
export const around = (...sels) => async (page) => {
  const boxes = [];
  for (const s of sels) {
    const b = await page.locator(s).first().boundingBox();
    if (!b) throw new Error(`STOPPING - nothing on screen matches ${s}`);
    boxes.push(b);
  }
  const x = Math.min(...boxes.map((b) => b.x)), y = Math.min(...boxes.map((b) => b.y));
  const r = Math.max(...boxes.map((b) => b.x + b.width)), btm = Math.max(...boxes.map((b) => b.y + b.height));
  return { x, y, w: r - x, h: btm - y };
};

// For a ring: the keyguard itself, found in the 3D view's own pixels, where it differs from
// the background. `part` takes a fraction of that box ([x, y, w, h], each 0 to 1), to point
// at one region of the keyguard.
export const onKeyguard = (part = [0, 0, 1, 1]) => async (page) => {
  const b = await page.evaluate(() => {
    const c = document.getElementById('three-canvas');
    const r = c.getBoundingClientRect();
    const t = document.createElement('canvas'); t.width = c.width; t.height = c.height;
    const g = t.getContext('2d'); g.drawImage(c, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    const bg = [d[0], d[1], d[2]];
    let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    for (let y = 0; y < c.height; y += 2) for (let x = 0; x < c.width; x += 2) {
      const i = (y * c.width + x) * 4;
      if (Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) > 40) {
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
    if (x1 < 0) return null;
    const sx = r.width / c.width, sy = r.height / c.height;
    return { x: r.x + x0 * sx, y: r.y + y0 * sy, w: (x1 - x0) * sx, h: (y1 - y0) * sy };
  });
  if (!b) throw new Error('STOPPING - no keyguard drawn in the 3D view');
  return { x: b.x + b.w * part[0], y: b.y + b.h * part[1], w: b.w * part[2], h: b.h * part[3] };
};
// A box of the given size (in page pixels) centered on a fraction of the 3D view.
export const atView = (fx, fy, w = 60, h = 60) => async (page) => {
  const p = await viewPoint(page, fx, fy);
  return { x: p.x - w / 2, y: p.y - h / 2, w, h };
};
export const wait = (ms) => () => sleep(ms);

// Several actions, one after another.
export const all = (...fns) => async (page) => { for (const f of fns) await f(page); };

export const click = (sel) => async (page) => { await page.click(sel); await sleep(300); };

// The Console emptied, when what a render wrote there isn't what the video is about.
export const clearConsole = () => (page) => page.locator('#clear-btn').evaluate((el) => el.click());

export const view = (name) => click(`#view-${name}`);      // top, bottom, front, back, left, right, fit

// A Customizer section, opened (and every other one closed, so the screen shows just it).
// The headers are clicked through the page itself: the Customizer scrolls under its own
// header, and a header half hidden there can't take an ordinary click.
// The others are closed in one pass in the page, from a fixed list: closing them one by one
// through a list counted by position skipped every second one.
const closeOthers = (page, keep) => page.evaluate((keep) => {
  for (const s of [...document.querySelectorAll('.section.open')]) {
    if (s.dataset.section !== keep) s.querySelector('.section-header').click();
  }
}, keep);
export const openSection = (name, { only = true } = {}) => async (page) => {
  if (only) await closeOthers(page, name);
  const sec = page.locator(`.section[data-section="${name}"]`);
  if (!(await sec.count())) throw new Error(`STOPPING - no section named ${name} at this skill level`);
  if (!(await sec.evaluate((el) => el.classList.contains('open')))) {
    await sec.locator('.section-header').evaluate((el) => el.click());
  }
  await sec.evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await sleep(300);
};
export const closeSections = () => (page) => closeOthers(page, null);

// The control for a setting, by its name in the keyguard designer file.
export const param = (name) => `[data-param-name="${name}"] input:not([type=range]), [data-param-name="${name}"] select`;
// The whole row of a setting: its name, its box and its note.
export const row = (name) => `.param[data-param-name="${name}"], [data-param-name="${name}"]:not(input):not(select)`;

// Changes a setting as a person would, then waits for the keyguard to redraw.
export const setParam = (name, value) => async (page) => {
  const el = page.locator(param(name)).first();
  if (!(await el.count())) throw new Error(`STOPPING - no setting named ${name} on screen`);
  await el.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  if (await el.evaluate((e) => e.tagName === 'SELECT')) await el.selectOption(String(value));
  else { await el.fill(String(value)); await el.press('Enter'); await el.dispatchEvent('change'); }
  await settled(page, 1200);
};

export const skill = (level) => async (page) => { await page.selectOption('#skill-select', level); await settled(page, 800); };

export const preset = (name) => async (page) => {
  await page.click('#preset-dropdown-btn');
  await page.locator('#preset-list li', { hasText: name }).first().click();
  await settled(page, 2500);
};

// Zooms the 3D view in (clicks > 0) or out, with the mouse wheel over it.
export const zoom = (clicks) => async (page) => {
  const p = await viewPoint(page, 0.5, 0.5);
  await page.mouse.move(p.x, p.y);
  for (let i = 0; i < Math.abs(clicks); i++) { await page.mouse.wheel(0, clicks > 0 ? -120 : 120); await sleep(80); }
  await page.mouse.move(1, 1);
  await settled(page, 800);
};

// A point in the 3D view, as fractions of its width and height.
export async function viewPoint(page, fx, fy) {
  const r = await page.locator('#viewport').evaluate((e) => {
    const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height };
  });
  return { x: r.x + r.w * fx, y: r.y + r.h * fy };
}

// A press-and-drag in the 3D view, from and to fractions of it, with keys held if asked.
export const drag = (from, to, { keys = [], steps = 12 } = {}) => async (page) => {
  const a = await viewPoint(page, ...from), b = await viewPoint(page, ...to);
  for (const k of keys) await page.keyboard.down(k);
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  await page.mouse.move(b.x, b.y, { steps });
  await page.mouse.up();
  for (const k of keys.reverse()) await page.keyboard.up(k);
  await settled(page, 1500);
};
export const clickAt = (at, { keys = [] } = {}) => async (page) => {
  const p = await viewPoint(page, ...at);
  for (const k of keys) await page.keyboard.down(k);
  await page.mouse.click(p.x, p.y);
  for (const k of keys.reverse()) await page.keyboard.up(k);
  await settled(page, 1200);
};
export const key = (k, times = 1) => async (page) => {
  for (let i = 0; i < times; i++) { await page.keyboard.press(k); await sleep(120); }
  await settled(page, 1200);
};

// Custom Openings.
export const openOpenings = (tab = 'eye') => async (page) => {
  if (!(await page.locator('#openings-panel.open').count())) await page.click('#openings-btn');
  await sleep(800);
  await page.click(`#openings-tabs [data-tab="${tab}"]`);
  await settled(page, 1000);
};
export const closeOpenings = ({ save = false } = {}) => async (page) => {
  await page.click(save ? '#openings-save' : '#openings-cancel');
  await sleep(500);
  // Only a question that is showing: the app keeps its confirm box in the page, hidden.
  const discard = page.locator('button:visible', { hasText: 'Discard' });
  if (await discard.count()) await discard.first().click();
  await settled(page, 1500);
};

// Settings, on one tab.
export const openSettings = (tab) => async (page) => {
  if (!(await page.locator('#settings-overlay.open, #settings-modal:visible').count())) await page.click('#settings-btn');
  await sleep(400);
  await page.click(`.cat[data-cat="${tab}"]`);
  await sleep(400);
};
export const closeSettings = () => async (page) => {
  await page.keyboard.press('Escape');
  await sleep(300);
};
