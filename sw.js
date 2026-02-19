const CACHE_NAME = 'siapi-platinum-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'confidentialite.html'
];

// Installation du Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      return cache.addAll(ASSETS);
    })
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Stratégie : Réseau d'abord, sinon Cache (pour que le VPN et le Solde soient à jour)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
