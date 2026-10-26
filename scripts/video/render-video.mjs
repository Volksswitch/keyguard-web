// Turns a how-to video script into a finished video. Modeled on Conversant AAC's
// scripts/video/render-video.mjs, with the same narrator voice.
//
//   node scripts/video/render-video.mjs scripts/video/scripts/1.1-what-for.mjs
//
// Output, in Videos/: <id>.mp4; <id>.srt (captions a player can show on request; nothing
// is drawn over the picture); <id>.pdf, the one-page guide made from the same pictures
// (companion.mjs); and <id>.json, whose signature, with the small pictures kept in
// Videos/.frames/<id>, is what "sync videos" compares to tell whether a video changed.
//
// A video is never edited by hand. It is re-made from its script, so when the app
// changes, "sync videos" (sync-videos.mjs) re-makes every video and says which changed.
//
// How it works: this folder is served on its own port, and the app is opened in a fresh,
// headless Microsoft Edge with the sample project (scripts/lib/sample-project.mjs). Only
// the page is captured, never the screen or any other window. For each step the renderer
// puts the app into that step's state, draws a ring on what the narration names, takes a
// picture, and speaks the line. Each picture is held for exactly as long as its line takes.
//
// Narration never says where something is ("top right"). It names the thing and the ring
// points to it, so a layout change can't make the words wrong.
//
// A step whose ring matches nothing on screen stops the render. That is the check that
// keeps a video from quietly showing a button that has moved or been renamed.
//
// Speech comes from Azure, using Conversant's key (its .azure-key) and voice code. Spoken
// lines are cached by voice and wording in Videos/.cache, so re-rendering after a screen
// change costs no speech.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { spawn, spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { PROJECT, launch, openSampleProject, settled, sleep } from '../lib/sample-project.mjs';
import { makeCompanion, placeInCourse, MAX_PAGE_STEPS } from './companion.mjs';

const CONVERSANT = path.join(process.env.OneDrive, '4 T-Z', 'Volksswitch', 'AI-driven AAC');
const { readAzureKey, synthesize, pace } = await import(
  pathToFileURL(path.join(CONVERSANT, 'scripts', 'video', 'azure.mjs')).href);

const PORT = 8124;                 // its own port, so it never meets a preview or serve.bat
const BASE = `http://localhost:${PORT}`;
const VIEW = { width: 1280, height: 720 };
const SCALE = 1.5;                 // 1920 x 1080 video
const LEAD_S = 0.35;               // quiet before each line
const TAIL_S = 0.65;               // quiet after each line
const VIDEOS = path.join(PROJECT, 'Videos');

function findTool(name) {
  const onPath = spawnSync('where', [name], { encoding: 'utf8' });
  if (onPath.status === 0) return onPath.stdout.split(/\r?\n/)[0].trim();
  const base = path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages');
  const stack = fs.existsSync(base) ? [base] : [];
  while (stack.length) {
    const dir = stack.pop();
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.name.toLowerCase() === `${name}.exe`) return p;
    }
  }
  throw new Error(`${name} is not installed. Install it with: winget install Gyan.FFmpeg`);
}
const FFMPEG = findTool('ffmpeg');
const FFPROBE = findTool('ffprobe');

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`${path.basename(cmd)} failed:\n${r.stderr.slice(-2000)}`);
  return r.stdout;
}
const durationOf = (f) => Number(run(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]));

const voices = JSON.parse(fs.readFileSync(path.join(PROJECT, 'scripts', 'video', 'voices.json'), 'utf8'));
const cacheDir = path.join(VIDEOS, '.cache');
fs.mkdirSync(cacheDir, { recursive: true });
let creds = null;
let lastCall = 0;

async function speech(speaker, text) {
  const voice = voices[speaker]?.azure;
  if (!voice) throw new Error(`No voice for speaker "${speaker}" in voices.json`);
  const hash = crypto.createHash('sha1').update(`${voice}\n${text}`).digest('hex').slice(0, 16);
  const file = path.join(cacheDir, `${hash}.mp3`);
  if (!fs.existsSync(file)) {
    creds ??= readAzureKey();
    const wait = 4000 - (Date.now() - lastCall); // the free tier allows 20 a minute
    if (wait > 0) await pace(wait);
    fs.writeFileSync(file, await synthesize(creds, voice, text));
    lastCall = Date.now();
  }
  return file;
}

async function startServer() {
  const proc = spawn('python', [path.join(PROJECT, 'scripts', 'serve.py'), String(PORT)],
    { cwd: PROJECT, stdio: 'ignore' });
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(`${BASE}/app.html`)).ok) return proc; } catch {}
    await pace(200);
  }
  proc.kill();
  throw new Error(`The local server did not start on port ${PORT}.`);
}

// The ring is drawn by the video, not the app: an overlay above everything, positioned on
// the named control's own box. The same look as Conversant's videos.
async function mark(page, selector) {
  await page.evaluate(() => document.getElementById('vid-mark')?.remove());
  if (!selector) return null;
  const target = page.locator(selector).first();
  if (!(await target.count())) throw new Error(`STOPPING - nothing on screen matches ${selector}`);
  const box = await target.evaluate((el) => {
    el.scrollIntoView({ block: 'nearest' });
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return null;
    const pad = 4, W = innerWidth, H = innerHeight;
    const L = Math.max(0, r.left - pad), T = Math.max(0, r.top - pad);
    const R = Math.min(W, r.right + pad), B = Math.min(H, r.bottom + pad);
    const m = document.createElement('div');
    m.id = 'vid-mark';
    Object.assign(m.style, {
      position: 'fixed', left: `${L}px`, top: `${T}px`, width: `${R - L}px`, height: `${B - T}px`,
      border: '5px solid #FF6D00', borderRadius: '10px', boxSizing: 'border-box',
      boxShadow: '0 0 0 3px rgba(255,255,255,0.9), 0 0 18px rgba(255,109,0,0.6)',
      pointerEvents: 'none', zIndex: 2147483647,
    });
    document.body.appendChild(m);
    return { left: L, top: T, right: R, bottom: B };
  });
  if (!box) throw new Error(`STOPPING - ${selector} is on the page but not visible`);
  return box;
}

async function settle(page) {
  await settled(page, 600);
  // Animations that never end are switched off for the picture, so it shows plain colors.
  await page.evaluate(() => {
    for (const a of document.getAnimations()) {
      if (a.effect?.getComputedTiming?.().iterations === Infinity) a.cancel();
    }
  });
  // Park the pointer off every control, so nothing shows its hover look.
  await page.mouse.move(1, 1);
  await sleep(300);
}

function srtTime(s) {
  const ms = Math.round(s * 1000);
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
}

async function main() {
  const scriptPath = process.argv[2];
  if (!scriptPath) throw new Error('Usage: node scripts/video/render-video.mjs <script.mjs>');
  const script = (await import(pathToFileURL(path.resolve(scriptPath)).href)).default;
  const { entry: me, next } = placeInCourse(script.id);
  // The page's step limit is checked now, not after a two-minute render.
  const pageSteps = script.steps.filter((s) => s.page).length;
  if (pageSteps > MAX_PAGE_STEPS) throw new Error(`STOPPING - ${script.id} marks ${pageSteps} steps for its page; ${MAX_PAGE_STEPS} fit on one page`);
  // Working pictures go in the system's temporary folder, not OneDrive, which would
  // otherwise upload every intermediate frame.
  const work = path.join(os.tmpdir(), 'keyguard-video', script.id);
  fs.rmSync(work, { recursive: true, force: true });
  fs.mkdirSync(work, { recursive: true });

  // "{next}" in a line names the next video in the course, so a closing line stays right
  // when a video is added.
  const nextLine = next ? `Next: ${next.title}${/[.?!]$/.test(next.title) ? '' : '.'}` : 'More videos are on the way.';
  for (const step of script.steps) step.say = step.say.replace('{next}', nextLine);
  // Every line is spoken first, so a missing key fails before the browser opens.
  for (const step of script.steps) await speech(step.speaker || 'narrator', step.say);

  const server = await startServer();
  const browser = await launch();
  const segments = [];
  const frames = [];
  const srt = [];
  // What "sync videos" uses to tell whether a video changed: every word said or printed
  // and the voice that said it (the signature), plus a small copy of each picture in
  // Videos/.frames, compared with tolerance (the browser draws the same screen with
  // faintly different edges from run to run, so an exact fingerprint can't work).
  const signature = crypto.createHash('sha256');
  signature.update(JSON.stringify({ trouble: script.trouble || [], entry: me, next: next?.title || null, voices }));
  const frameDir = path.join(VIDEOS, '.frames', script.id);
  fs.rmSync(frameDir, { recursive: true, force: true });
  fs.mkdirSync(frameDir, { recursive: true });
  let t = 0;
  try {
    const page = await browser.newPage({ viewport: VIEW, deviceScaleFactor: SCALE, colorScheme: 'light' });
    page.on('pageerror', (e) => console.log(`  [page] ${e.message}`));
    // The blinking text cursor is hidden: whether a picture catches it is chance.
    await page.addInitScript(() => document.addEventListener('DOMContentLoaded', () => {
      const st = document.createElement('style');
      st.textContent = '* { caret-color: transparent !important; }';
      document.head.appendChild(st);
    }));
    await openSampleProject(page, BASE, script.project || {});
    // The Console starts empty, so it shows only what the video does.
    await page.click('#clear-btn');
    for (const [i, step] of script.steps.entries()) {
      if (step.before) await step.before(page);
      await settle(page);
      const box = await mark(page, step.highlight);
      const shot = path.join(work, `${String(i).padStart(2, '0')}.png`);
      // Software 3D drawing is slow with the screenshot under the keyguard.
      await page.screenshot({ path: shot, timeout: 180000 });
      frames.push({ file: shot, box, view: { ...VIEW, deviceScaleFactor: SCALE } });
      await page.evaluate(() => document.getElementById('vid-mark')?.remove());

      const clip = await speech(step.speaker || 'narrator', step.say);
      const speak = durationOf(clip);
      const dur = LEAD_S + speak + TAIL_S;
      const seg = path.join(work, `${String(i).padStart(2, '0')}.mp4`);
      run(FFMPEG, ['-y', '-loop', '1', '-framerate', '30', '-i', shot, '-i', clip,
        '-filter_complex', `[1:a]adelay=${Math.round(LEAD_S * 1000)}:all=1,apad[a]`,
        '-map', '0:v', '-map', '[a]', '-t', dur.toFixed(3),
        '-vf', 'scale=1920:1080',
        '-c:v', 'libx264', '-tune', 'stillimage', '-pix_fmt', 'yuv420p', '-r', '30',
        '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2', seg]);
      segments.push(seg);
      signature.update(JSON.stringify({ speaker: step.speaker || 'narrator', said: step.say, page: step.page || null }));
      run(FFMPEG, ['-y', '-v', 'error', '-i', shot, '-vf', 'scale=960:540', path.join(frameDir, `${String(i).padStart(2, '0')}.png`)]);
      srt.push(`${i + 1}\n${srtTime(t + LEAD_S)} --> ${srtTime(t + LEAD_S + speak)}\n${step.say}\n`);
      t += dur;
      console.log(`step ${i + 1}/${script.steps.length}  ${dur.toFixed(1)}s`);
    }
    // The companion page, from the same pictures, while the browser is still open.
    const pdf = await makeCompanion({ browser, script, frames, seconds: t, ffmpeg: FFMPEG });
    console.log(path.relative(PROJECT, pdf));
  } finally {
    await browser.close();
    server.kill();
  }

  fs.mkdirSync(VIDEOS, { recursive: true });
  const list = path.join(work, 'list.txt');
  fs.writeFileSync(list, segments.map((s) => `file '${s.replace(/\\/g, '/')}'`).join('\n'));
  const out = path.join(VIDEOS, `${script.id}.mp4`);
  run(FFMPEG, ['-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', out]);
  fs.writeFileSync(path.join(VIDEOS, `${script.id}.srt`), srt.join('\n'));
  fs.writeFileSync(path.join(VIDEOS, `${script.id}.json`), JSON.stringify({
    id: script.id, title: me.title, signature: signature.digest('hex'), pictures: segments.length, seconds: Math.round(t),
    rendered: new Date().toISOString(),
  }, null, 2));
  console.log(`\n${path.relative(PROJECT, out)}  ${durationOf(out).toFixed(1)}s  (pictures in ${work})`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
