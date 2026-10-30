// A stand-in for the computer's own file boxes, drawn over the app for a video picture.
//
// The real ones (choosing a folder, Save As, Open, and the browser's question about
// editing files) belong to the computer and the browser, not the page, so they can't be
// photographed (Ken, 30 Oct 2026: "Mock-up a generic file open/save dialog and use that
// when describing the actions"). This one is deliberately generic: no system's look, so a
// clinician on Windows, a Mac or a Chromebook can each read it as her own. The narration
// says so the first time a video shows it.
//
// A step gives `dialog: { kind, ... }`; the renderer draws it after the step's `before`,
// and takes it away after the picture. Its parts carry data-part names, so a step's
// `highlight` can ring one: inDialog('ok') in helpers.mjs.
//
//   kind      'save', 'open', 'folder', or 'permission' (the browser's question)
//   title     the title bar; each kind has its own
//   path      the folders above the one shown, ending with it
//   items     [name, type] for each row; folders have type 'folder'
//   selected  the name of the row shown chosen
//   name      the file name box (save) or folder box (folder); defaults to `selected`
//   type      the file type box (save and open)
//   faded     true dims every row that isn't a folder, as a Save box does
//   site      the address the browser names (permission)
//   folder    the folder the browser names (permission)

export const SAMPLE_FILES = [
  ['keyguard.json', 'JSON file'],
  ['keyguard.scad', 'SCAD file'],
  ['openings_and_additions.txt', 'Text file'],
  ['WordPower 42 screenshot.png', 'PNG image'],
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const CSS = `
  #vid-dialog { position: fixed; inset: 0; z-index: 2147483600; font: 14px Arial, Helvetica, sans-serif; color: #1f2933; }
  #vid-dialog .dim { position: absolute; inset: 0; background: rgba(15, 23, 32, 0.38); }
  #vid-dialog .win { position: absolute; left: 50%; top: 50%; width: 780px; height: 486px; transform: translate(-50%, -50%);
    background: #fff; border-radius: 10px; box-shadow: 0 18px 50px rgba(0,0,0,0.45); display: flex; flex-direction: column; overflow: hidden; }
  #vid-dialog .bar { height: 40px; background: #eef1f4; border-bottom: 1px solid #d5dbe1; display: flex; align-items: center;
    padding: 0 14px; font-weight: bold; font-size: 15px; }
  #vid-dialog .bar .x { margin-left: auto; font-weight: normal; font-size: 20px; color: #6b7785; }
  #vid-dialog .tools { display: flex; align-items: center; gap: 10px; padding: 9px 14px; border-bottom: 1px solid #e3e7eb; }
  #vid-dialog .arrows { color: #8a96a3; font-size: 17px; letter-spacing: 8px; }
  #vid-dialog .path { flex: 1; border: 1px solid #c9d1d9; border-radius: 5px; padding: 6px 10px; color: #3e4c59; }
  #vid-dialog .path b { color: #1f2933; }
  #vid-dialog .btn { border: 1px solid #b8c2cc; border-radius: 5px; padding: 6px 14px; background: #f7f9fa; white-space: nowrap; }
  #vid-dialog .btn.go { background: #2563eb; border-color: #1d4ed8; color: #fff; font-weight: bold; }
  #vid-dialog .main { flex: 1; display: flex; min-height: 0; }
  #vid-dialog .side { width: 150px; border-right: 1px solid #e3e7eb; padding: 10px 0; background: #fafbfc; }
  #vid-dialog .side div { padding: 7px 16px; color: #3e4c59; display: flex; align-items: center; gap: 9px; }
  #vid-dialog .list { flex: 1; overflow: hidden; }
  #vid-dialog .head, #vid-dialog .row { display: flex; padding: 7px 14px; align-items: center; }
  #vid-dialog .head { color: #6b7785; font-size: 12.5px; border-bottom: 1px solid #e3e7eb; }
  #vid-dialog .head span:first-child, #vid-dialog .row span.n { flex: 1; display: flex; align-items: center; gap: 10px; }
  #vid-dialog .head span:last-child, #vid-dialog .row span.t { width: 130px; color: #6b7785; }
  #vid-dialog .row.sel { background: #dbe8ff; }
  #vid-dialog .row.faded { opacity: 0.45; }
  #vid-dialog .ico { width: 18px; height: 14px; flex: none; border-radius: 2px; }
  #vid-dialog .ico.folder { background: #e8b547; border-top: 3px solid #d39b26; }
  #vid-dialog .ico.file { width: 13px; height: 17px; background: #fff; border: 1.5px solid #8a96a3; border-radius: 1px 5px 1px 1px; }
  #vid-dialog .foot { border-top: 1px solid #e3e7eb; padding: 12px 14px; display: grid; grid-template-columns: 96px 1fr auto; gap: 9px 10px; align-items: center; }
  #vid-dialog .foot .lab { color: #3e4c59; text-align: right; }
  #vid-dialog .field { border: 1px solid #9aa5b1; border-radius: 5px; padding: 6px 10px; background: #fff; }
  #vid-dialog .field.pick { display: flex; } #vid-dialog .field.pick::after { content: '\\25BE'; margin-left: auto; color: #6b7785; }
  #vid-dialog .buttons { display: flex; gap: 8px; justify-content: flex-end; }
  #vid-dialog .ask { position: absolute; left: 50%; top: 18px; width: 470px; transform: translateX(-50%); background: #fff;
    border-radius: 10px; box-shadow: 0 10px 34px rgba(0,0,0,0.4); padding: 18px 20px; border: 1px solid #d5dbe1; }
  #vid-dialog .ask .q { font-size: 17px; font-weight: bold; margin-bottom: 8px; }
  #vid-dialog .ask .d { color: #3e4c59; margin-bottom: 16px; line-height: 1.4; }
  #vid-dialog .ask .buttons { flex-direction: column; align-items: stretch; gap: 8px; }
  #vid-dialog .ask .btn { text-align: center; padding: 8px 14px; }
`;

const TITLES = { save: 'Save As', open: 'Open', folder: 'Choose a folder' };
const PLACES = ['Desktop', 'Documents', 'Downloads', 'Pictures'];

function boxHtml(d) {
  const kind = d.kind;
  const path = d.path || ['Documents', 'keyguard design'];
  const items = d.items || SAMPLE_FILES;
  const here = path[path.length - 1];
  const rows = items.map(([n, t]) => {
    const folder = t === 'folder';
    const cls = ['row', n === d.selected ? 'sel' : '', d.faded && !folder ? 'faded' : ''].join(' ');
    return `<div class="${cls}" data-part="${n === d.selected ? 'selected' : 'row'}"><span class="n">
      <span class="ico ${folder ? 'folder' : 'file'}"></span>${esc(n)}</span><span class="t">${folder ? 'File folder' : esc(t)}</span></div>`;
  }).join('') || '<div class="row faded"><span class="n">This folder is empty.</span></div>';
  const name = d.name ?? d.selected ?? '';
  const foot = kind === 'folder'
    ? `<span class="lab">Folder:</span><span class="field" data-part="name">${esc(name || here)}</span>
       <span class="buttons"><span class="btn go" data-part="ok">Select Folder</span><span class="btn" data-part="cancel">Cancel</span></span>`
    : `<span class="lab">File name:</span><span class="field" data-part="name">${esc(name)}</span>
       <span class="buttons"><span class="btn go" data-part="ok">${kind === 'save' ? 'Save' : 'Open'}</span><span class="btn" data-part="cancel">Cancel</span></span>
       <span class="lab">${kind === 'save' ? 'Save as type:' : 'Show:'}</span><span class="field pick" data-part="type">${esc(d.type || 'All files')}</span><span></span>`;
  return `<div class="dim"></div><div class="win" data-part="box">
    <div class="bar">${esc(d.title || TITLES[kind])}<span class="x">&times;</span></div>
    <div class="tools"><span class="arrows">&larr;&rarr;&uarr;</span>
      <span class="path" data-part="path">${path.slice(0, -1).map((p) => `${esc(p)} &rsaquo; `).join('')}<b>${esc(here)}</b></span>
      ${kind === 'save' || kind === 'folder' ? '<span class="btn" data-part="newfolder">New folder</span>' : ''}</div>
    <div class="main"><div class="side">${PLACES.map((p) => `<div><span class="ico folder"></span>${p}</div>`).join('')}</div>
      <div class="list" data-part="list"><div class="head"><span>Name</span><span>Type</span></div>${rows}</div></div>
    <div class="foot">${foot}</div></div>`;
}

function askHtml(d) {
  const site = d.site || 'keyguard.volksswitch.org';
  return `<div class="ask" data-part="box">
    <div class="q" data-part="question">Let ${esc(site)} edit files?</div>
    <div class="d">${esc(site)} will be able to see and change the files in <b>${esc(d.folder || 'keyguard design')}</b>.</div>
    <div class="buttons"><span class="btn go" data-part="always">Allow on every visit</span>
      <span class="btn" data-part="once">Allow this time</span><span class="btn" data-part="deny">Don't allow</span></div></div>`;
}

export async function showDialog(page, d) {
  if (!['save', 'open', 'folder', 'permission'].includes(d.kind)) throw new Error(`STOPPING - unknown dialog kind ${d.kind}`);
  const html = `<style>${CSS}</style>${d.kind === 'permission' ? askHtml(d) : boxHtml(d)}`;
  await page.evaluate((html) => {
    document.getElementById('vid-dialog')?.remove();
    const el = document.createElement('div');
    el.id = 'vid-dialog';
    el.innerHTML = html;
    document.body.appendChild(el);
  }, html);
}

export const hideDialog = (page) => page.evaluate(() => document.getElementById('vid-dialog')?.remove());
