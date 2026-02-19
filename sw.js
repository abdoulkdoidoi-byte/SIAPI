const CACHE_NAME = 'siapi-v3';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(['./', './index.html', './script.js', './manifest.json'])));
});
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
