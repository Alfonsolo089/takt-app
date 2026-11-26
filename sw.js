// Service Worker: haelt die App fuer den Start ohne Internet bereit.
// Die Seite kommt immer zuerst aus dem Netz (neue Versionen sofort), nur ohne Netz
// oder bei sehr langsamer Verbindung aus dem Zwischenspeicher. Anfragen an Supabase
// (andere Adresse) laufen unberuehrt durch; Daten liegen ohnehin im Browser.
const CACHE = 'takt-shell-v2';
const FILES = ['./', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];
const WAIT_MS = 4000;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

// cache: 'no-cache' umgeht den HTTP-Cache des Browsers (GitHub Pages: 10 Minuten),
// sonst kaeme eine neue Version erst verspaetet an.
function fromNetwork(request, cacheKey) {
  return fetch(request.url, { cache: 'no-cache', credentials: 'same-origin' }).then(response => {
    if (!response.ok) return { response, saved: Promise.resolve() };
    const copy = response.clone();
    return { response, saved: caches.open(CACHE).then(cache => cache.put(cacheKey, copy)) };
  });
}
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== location.origin) return;
  // Alle Aufrufe der Seite (auch mit ?code=... oder ?view=...) teilen einen Eintrag.
  const isPage = request.mode === 'navigate';
  const cacheKey = isPage ? './' : request;
  const result = fromNetwork(request, cacheKey);
  const network = result.then(item => item.response);
  // Auch wenn der Zwischenspeicher schneller antwortet: Speichern der neuen Version abwarten.
  event.waitUntil(result.then(item => item.saved).catch(() => {}));
  event.respondWith(caches.open(CACHE).then(cache => cache.match(cacheKey)).then(cached => {
    if (!cached) return network;
    const slow = new Promise(resolve => setTimeout(() => resolve(cached), WAIT_MS));
    return Promise.race([network.catch(() => cached), slow]);
  }));
});
