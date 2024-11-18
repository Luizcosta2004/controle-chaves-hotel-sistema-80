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

// Mapeamento simplificado de tipos MIME
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

// Função auxiliar para determinar o tipo de conteúdo
const getContentType = (url) => {
  const ext = url.substring(url.lastIndexOf('.'));
  return mimeTypes[ext] || 'text/html';
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        return fetch(event.request).then(response => {
          if (!response || response.status !== 200) {
            return response;
          }

          const contentType = getContentType(event.request.url);
          const responseToCache = response.clone();

          // Criar nova resposta com tipo MIME correto
          const newResponse = new Response(responseToCache.body, {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: new Headers({
              'Content-Type': contentType,
              ...Object.fromEntries(responseToCache.headers.entries())
            })
          });

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, newResponse);
            });

          return response;
        });
      })
  );
});