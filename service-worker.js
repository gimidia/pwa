const CACHE_NAME = 'pwa-camera-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  //'/style.css',
  //'/script.js',
  'https://cdn.jsdelivr.net/npm/dexie@3.0.3/dist/dexie.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache', error);
      })
  );
});

self.addEventListener('fetch', event => {
  // Verificar se a requisição é do tipo GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});
