const CACHE_NAME = 'hotel-keys-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/screenshot1.png',
  '/screenshot2.png'
];

// Content type mapping
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

// Helper to determine content type
const getContentType = (url) => {
  const ext = url.substring(url.lastIndexOf('.'));
  return mimeTypes[ext] || 'text/html';
};

// Install SW
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('Cache opened successfully');
          return cache.addAll(urlsToCache);
        }),
      self.skipWaiting()
    ])
  );
});

// Activate SW
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch resources
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            if (!response || response.status !== 200) {
              return response;
            }

            const responseToCache = response.clone();
            const contentType = getContentType(event.request.url);

            // Create a new response with proper content type
            const newResponse = new Response(responseToCache.body, {
              status: responseToCache.status,
              statusText: responseToCache.statusText,
              headers: new Headers({
                'Content-Type': contentType,
                ...Object.fromEntries(responseToCache.headers.entries())
              })
            });

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, newResponse);
              });

            return response;
          });
      })
  );
});

// Log any errors
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});