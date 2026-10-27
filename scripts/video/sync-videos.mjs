// "sync videos": re-make every how-to video from its script, and say which ones actually
// changed since they were last published. Modeled on Conversant AAC's sync-videos.mjs.
//
//   node scripts/video/sync-videos.mjs              re-make everything and report
//   node scripts/video/sync-videos.mjs --no-render  compare what is already made, without re-making
//   node scripts/video/sync-videos.mjs --only 1.1   only videos whose id starts with this
//   node scripts/video/sync-videos.mjs --publish    ...then publish what changed: what "sync videos" runs
//   node scripts/video/sync-videos.mjs --published 1.1-what-for
//        record a video as published by hand (the publisher does this itself)
//
// Re-making costs no speech unless a line's wording changed: spoken lines are cached.
//
// A VIDEO WHOSE SCRIPT POINTS AT A CONTROL THAT NO LONGER EXISTS STOPS, and is listed at
// the end with the control it was looking for. The others still render. That is how an
// app change that moves or renames a button is caught before a video shows the old one.
//
// WHAT COUNTS AS CHANGED. A video changed if any word said or printed changed, or the
// voice changed (the signature the renderer writes), or if any picture differs CLEARLY
// from the published one. The browser draws the same screen with faintly different edges
// from run to run, so a pixel counts only if it moved by more than a fifth of full
// brightness, and a picture counts as changed only past 200 such pixels. A changed word
// on a button moves hundreds.
//
// --publish (Ken, October 27 2026: "sync videos" also publishes) hands exactly the videos
// judged changed here to scripts/wordpress/publish-videos.py - by this judgement, not the
// publisher's own, which sees only words and voice and would miss a moved button. With
// nothing changed it still lets the publisher refresh the pages, in case a title or a
// "what you will learn" line changed in course.json. Then every link on the website is
// checked, and any video the User Manual doesn't link yet is named for "sync docs". A
// video that couldn't be made is not published: its last published copy stays up.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { PROJECT, launch } from '../lib/sample-project.mjs';
import { readCourse, fullTitle, makeCourseMap } from './companion.mjs';

const args = process.argv.slice(2);
const RENDER = !args.includes('--no-render');
const ONLY = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const MARK = args.includes('--published') ? args[args.indexOf('--published') + 1] : null;
const PUBLISH = args.includes('--publish');

const VIDEOS = path.join(PROJECT, 'Videos');
const PIXEL_STEP = 51;      // a fifth of full brightness, out of 255
const PICTURE_LIMIT = 200;  // pixels past that step before a picture counts as changed

// What was last published: each video's signature, kept in the repository so both
// machines agree. The pictures it was published with are in Videos/.published.
const PUBLISHED_LIST = path.join(PROJECT, 'scripts', 'video', 'published.json');
const published = fs.existsSync(PUBLISHED_LIST)
  ? JSON.parse(fs.readFileSync(PUBLISHED_LIST, 'utf8')) : { videos: {} };

if (MARK) {
  const made = path.join(VIDEOS, `${MARK}.json`);
  if (!fs.existsSync(made)) throw new Error(`${MARK} hasn't been made, so it can't be recorded as published.`);
  const now = JSON.parse(fs.readFileSync(made, 'utf8'));
  published.videos[MARK] = { signature: now.signature, published: new Date().toISOString().slice(0, 10) };
  fs.writeFileSync(PUBLISHED_LIST, JSON.stringify(published, null, 2) + '\n');
  const to = path.join(VIDEOS, '.published', MARK);
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(path.join(VIDEOS, '.frames', MARK), to, { recursive: true });
  console.log(`Recorded ${MARK} as published.`);
  process.exit(0);
}

function ffmpegPath() {
  const r = spawnSync('where', ['ffmpeg'], { encoding: 'utf8' });
  if (r.status === 0) return r.stdout.split(/\r?\n/)[0].trim();
  const stack = [path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages')];
  while (stack.length) {
    const d = stack.pop();
    if (!fs.existsSync(d)) continue;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) stack.push(p); else if (e.name === 'ffmpeg.exe') return p;
    }
  }
  throw new Error('ffmpeg is not installed');
}
const FFMPEG = ffmpegPath();
const pixels = (file) => spawnSync(FFMPEG, ['-v', 'error', '-i', file, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
  { maxBuffer: 64 * 1024 * 1024 }).stdout;

function picturesDiffer(a, b) {
  const pa = pixels(a), pb = pixels(b);
  if (pa.length !== pb.length) return true;
  let count = 0;
  for (let i = 0; i < pa.length; i += 3) {
    if (Math.abs(pa[i] - pb[i]) > PIXEL_STEP || Math.abs(pa[i + 1] - pb[i + 1]) > PIXEL_STEP
        || Math.abs(pa[i + 2] - pb[i + 2]) > PIXEL_STEP) {
      if (++count > PICTURE_LIMIT) return true;
    }
  }
  return false;
}

// Why a video needs publishing again, or null if it doesn't.
function whatChanged(id) {
  const made = path.join(VIDEOS, `${id}.json`);
  if (!fs.existsSync(made)) return 'not made';
  const now = JSON.parse(fs.readFileSync(made, 'utf8'));
  const was = published.videos[id];
  if (!was) return 'never published';
  if (was.signature !== now.signature) return 'words or voice changed';
  const newDir = path.join(VIDEOS, '.frames', id);
  const oldDir = path.join(VIDEOS, '.published', id);
  if (!fs.existsSync(oldDir)) return 'no published pictures to compare with';
  const newFiles = fs.readdirSync(newDir).sort();
  const oldFiles = fs.readdirSync(oldDir).sort();
  if (newFiles.join() !== oldFiles.join()) return 'number of pictures changed';
  for (const f of newFiles) {
    if (picturesDiffer(path.join(newDir, f), path.join(oldDir, f))) return `picture ${Number(f.slice(0, 2)) + 1} changed`;
  }
  return null;
}

const items = readCourse().groups.flatMap((g) => g.items)
  .filter((x) => x.id && fs.existsSync(path.join(PROJECT, 'scripts', 'video', 'scripts', `${x.id}.mjs`)))
  .filter((x) => !ONLY || x.id.startsWith(ONLY));

const failed = [];
if (RENDER) {
  for (const x of items) {
    process.stdout.write(`Making ${x.num} ${fullTitle(x)} ... `);
    const r = spawnSync(process.execPath, [path.join(PROJECT, 'scripts', 'video', 'render-video.mjs'),
      path.join(PROJECT, 'scripts', 'video', 'scripts', `${x.id}.mjs`)], { encoding: 'utf8', cwd: PROJECT });
    if (r.status === 0) console.log('done');
    else {
      const why = (r.stderr + r.stdout).split(/\r?\n/).find((l) => l.startsWith('STOPPING')) || r.stderr.trim().split(/\r?\n/).pop();
      console.log('FAILED');
      failed.push({ x, why });
    }
  }
  const browser = await launch();
  try { console.log(path.relative(PROJECT, await makeCourseMap(browser))); } finally { await browser.close(); }
}

console.log('\nCompared with what was last published:');
const changed = [];
for (const x of items) {
  if (failed.find((f) => f.x === x)) { console.log(`  ${x.num.padEnd(5)} NOT MADE  ${fullTitle(x)}`); continue; }
  const why = whatChanged(x.id);
  if (why && why !== 'not made') changed.push(x.id);
  console.log(`  ${x.num.padEnd(5)} ${why ? 'CHANGED  ' : 'same     '} ${fullTitle(x)}${why ? `  (${why})` : ''}`);
}
if (failed.length) {
  console.log('\nThese could not be made:');
  for (const { x, why } of failed) console.log(`  ${x.num} ${fullTitle(x)}: ${why}`);
}
console.log(changed.length ? `\n${changed.length} to publish.` : '\nNothing to publish.');

let publishFailed = false;
if (PUBLISH) {
  const py = (script, extra) => {
    console.log(`\n${script} ${extra.join(' ')}`);
    return spawnSync('python', [path.join(PROJECT, script), ...extra],
      { stdio: 'inherit', cwd: PROJECT, env: { ...process.env, PYTHONIOENCODING: 'utf-8' } }).status;
  };
  if (py('scripts/wordpress/publish-videos.py', changed.length ? ['--apply', ...changed] : ['--apply', '--pages-only']) !== 0) {
    publishFailed = true;
    console.log('PUBLISHING FAILED: see above. The link check was not run.');
  } else {
    publishFailed = py('scripts/wordpress/check-links.py', []) !== 0;
    py('scripts/video/add-manual-links.py', []);
  }
}
process.exit(failed.length || publishFailed ? 1 : 0);
