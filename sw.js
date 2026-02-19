const CACHE_NAME = 'siapi-platinum-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://www.gstatic.com',
  'https://www.gstatic.com',
  'https://www.gstatic.com'
];

// 1. Installation : Mise en cache des fichiers de base (Shell App)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SIAPI: Cache de base activé');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activation : Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('SIAPI: Nettoyage ancien cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Stratégie Fetch : Réseau en priorité pour les gains et les pubs
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // NE PAS mettre en cache les appels critiques (Firebase, Pubs, API)
  if (url.includes('firebaseio.com') || 
      url.includes('googleapis.com') || 
      url.includes('alwingulla.com') || 
      url.includes('googlesyndication.com')) {
    return; // On laisse passer directement au réseau
  }

  // Stratégie "Network First, falling back to cache" pour le reste
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
