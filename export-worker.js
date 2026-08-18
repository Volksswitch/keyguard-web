// export-worker.mjs — runs an OpenSCAD export render off the main thread.
//
// The interactive viewport renders (fast Manifold, ~0.5 s) stay on the main
// thread, but the Export path — especially "Export STL (precision)" on the
// CGAL backend, which can take several minutes — must not block the UI. A
// blocked main thread is exactly what triggers Chrome's "Page unresponsive"
// dialog, and it also makes a Cancel button impossible. Running the render in
// this worker keeps the page responsive and lets the main thread cancel a
// run instantly via worker.terminate().
//
// Contract:
//   postMessage({ scadName, scadText, oaText, jsonName, jsonText, files,
//                 args, outPath })
//     files: { [name]: Uint8Array } of extra project files (svg, etc.)
//     args:  the full OpenSCAD CLI argv (built on the main thread so the
//            export-argument logic stays in one place).
//   → postMessage({ type: 'log',  line })          // streamed console output
//   → postMessage({ type: 'done', ok: true,  bytes, elapsed }, [bytes.buffer])
//   → postMessage({ type: 'done', ok: false, error })
//
// The wasm binary is embedded in openscad.js (no separate .wasm fetch), so
// importing it from the worker needs no locateFile/path plumbing.

// Load the OpenSCAD wasm glue via dynamic import so a load/eval failure is a
// catchable rejection we can report back, instead of an opaque worker
// onerror with no message.
let createOpenSCAD, addFonts;
async function ensureLoaded() {
  if (createOpenSCAD) return;
  ({ createOpenSCAD } = await import('./openscad-wasm/openscad.js'));
  ({ addFonts } = await import('./openscad-wasm/openscad.fonts.js'));
}

self.onmessage = async (e) => {
  const job = e.data || {};
  try {
    await ensureLoaded();
    const oscad = await createOpenSCAD({
      print:    t => self.postMessage({ type: 'log', line: t }),
      printErr: t => self.postMessage({ type: 'log', line: t }),
    });
    const inst = oscad.getInstance();
    addFonts(inst);
    const fs = inst.FS;

    fs.writeFile('/' + job.scadName, job.scadText);
    fs.writeFile('/openings_and_additions.txt', job.oaText);
    if (job.jsonText) fs.writeFile('/' + job.jsonName, job.jsonText);
    for (const [name, bytes] of Object.entries(job.files || {})) {
      if (name === job.scadName) continue;
      if (name === job.jsonName) continue;
      if (name === 'openings_and_additions.txt') continue;
      fs.writeFile('/' + name, bytes);
    }

    const t0 = performance.now();
    const rc = inst.callMain(job.args);
    const elapsed = (performance.now() - t0) / 1000;
    if (rc !== 0) {
      self.postMessage({ type: 'done', ok: false, error: `OpenSCAD exited with code ${rc}` });
      return;
    }
    const bytes = fs.readFile(job.outPath);   // Uint8Array
    // Transfer the underlying buffer so the (potentially large) STL isn't copied.
    self.postMessage({ type: 'done', ok: true, bytes, elapsed }, [bytes.buffer]);
  } catch (err) {
    self.postMessage({ type: 'done', ok: false, error: (err && err.message) || String(err) });
  }
};
