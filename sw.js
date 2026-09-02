// Service worker for Keyguard Designer PWA.
// Bump CACHE_NAME when deploying changes to any file in SHELL — the activate
// handler purges old caches so clients get the new version on next load.
const CACHE_NAME = 'keyguard-v102';

const SHELL = [
  './',                    // the bare address: a bookmark to the folder rather than
                           // to app.html. Without this it goes to the network every
                           // time, so it has no offline copy and, once the app moves,
                           // nothing of the user's comes with it.
  './app.html',
  './manifest.json',
  './icons/keyguard.svg',
  './export-worker.js',
  './openscad-wasm/openscad.js',
  './openscad-wasm/openscad.fonts.js',
  './vendor/three/build/three.module.min.js',
  './vendor/three/examples/jsm/libs/fflate.module.js',
  './vendor/three/examples/jsm/loaders/3MFLoader.js',
  './vendor/three/examples/jsm/controls/OrbitControls.js',
  './vendor/three/examples/jsm/controls/TrackballControls.js',
  './vendor/three/examples/jsm/controls/ArcballControls.js',
  './vendor/three/examples/jsm/loaders/STLLoader.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      // `cache: 'reload'` bypasses the browser's HTTP cache on the way out and
      // refreshes it on the way back. Without it a NEW cache can be filled with
      // the OLD app: GitHub Pages serves everything with a 10-minute freshness
      // window, so a client that loaded recently gets its own stale copy handed
      // back. Measured directly in the 2025 rehearsal - a cache named v2
      // containing v1's bytes, and an update that "succeeded" and changed nothing.
      .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Cache-first for all GET requests that match our shell; fall back to network.
// User project files come from the File System Access API (local disk) and
// never touch the network, so the service worker never intercepts them.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached ?? fetch(e.request))
  );
});
