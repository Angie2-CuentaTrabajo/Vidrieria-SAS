self.addEventListener('install', (event) => {
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('vidrieria-shell-v1').then(async (cache) => {
      await cache.addAll(['/']);
      await self.skipWaiting();
    }),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('/');
      }

      return new Response('', { status: 504, statusText: 'Offline' });
    }),
  );
});
