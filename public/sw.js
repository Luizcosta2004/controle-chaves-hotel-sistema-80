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

// Mapeamento de tipos MIME
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf'
};

// Função para determinar o tipo de conteúdo
const getContentType = (url) => {
  const ext = url.substring(url.lastIndexOf('.'));
  return mimeTypes[ext] || 'text/html';
};

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetching', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Service Worker: Found in cache', event.request.url);
          return response;
        }

        return fetch(event.request).then(response => {
          if (!response || response.status !== 200) {
            console.log('Service Worker: Fetch failed', event.request.url);
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
              console.log('Service Worker: Caching new resource', event.request.url);
              cache.put(event.request, newResponse);
            });

          return response;
        }).catch(error => {
          console.log('Service Worker: Fetch failed', error);
          // Retorna uma resposta offline personalizada se necessário
          return new Response('Offline Mode');
        });
      })
  );
});

// Sincronização em segundo plano
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background Sync', event.tag);
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Implementar lógica de sincronização
      console.log('Service Worker: Syncing data')
    );
  }
});