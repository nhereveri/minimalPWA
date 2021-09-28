let CACHE_NAME = 'minimalPWA_cache';

/* Cualquier archivo que consideres estático (CSS, imágenes, fuentes, JS, plantillas, etc) */
let STATIC_FILES = [
  'index.html',
  'manifest.json',
  'critical.css',
  'non-critical.css',
  'gauge@128.png',
  'gauge@192.png',
  'gauge@256.png',
  'gauge@512.png',
  'gauge@maskable.png'
];

/* Igual que el anterior, pero no demora la instalación */
let BIG_STATIC_FILES = [];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll(BIG_STATIC_FILES);
      return cache.addAll(STATIC_FILES)
        .then(() => self.skipWaiting());
    })
  )
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(e.request).then(response => {
        let fetchPromise = fetch(e.request).then(networkResponse => {
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        })
        return response || fetchPromise;
      });
    })
  );
});