/* Service worker aplikacji „Czas pracy" — działanie offline.
   Strategia: odpowiedź z pamięci podręcznej od razu, a w tle pobranie świeżej wersji
   (stale-while-revalidate). Po wdrożeniu nowej wersji zmiany widać przy drugim otwarciu.
   Obsługiwane są wyłącznie żądania GET do własnego hostingu. */
const CACHE = 'czas-pracy-v2';
const PLIKI = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(PLIKI)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    const net = fetch(req)
      .then(res => { if (res.ok) cache.put(req, res.clone()); return res; })
      .catch(() => null);
    if (hit) { event.waitUntil(net); return hit; }
    const res = await net;
    if (res) return res;
    // Offline i brak pliku w pamięci: dla nawigacji zwracamy aplikację.
    if (req.mode === 'navigate') return (await cache.match('index.html')) || Response.error();
    return Response.error();
  })());
});
