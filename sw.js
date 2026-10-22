const CACHE_NAME = 'nightshelf-shell-v3';
const APP_FILES = ['./', './index.html', './manifest.webmanifest', './icon.svg', './apple-touch-icon.png'];
const JSZIP_URL = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_FILES);
    try {
      const response = await fetch(new Request(JSZIP_URL, { mode: 'no-cors' }));
      await cache.put(new Request(JSZIP_URL, { mode: 'no-cors' }), response);
    } catch (error) { console.warn('Could not cache JSZip during install.', error); }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('nightshelf-shell-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin === self.location.origin) {
    const isHtml = event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      if (!isHtml) {
        const cached = await cache.match(event.request);
        if (cached) return cached;
      }
      try {
        const response = await fetch(event.request);
        if (response.ok) cache.put(event.request, response.clone()).catch(() => {});
        return response;
      } catch (error) {
        return (await cache.match(event.request)) || (await cache.match('./index.html')) || Response.error();
      }
    })());
  } else if (event.request.url === JSZIP_URL) {
    event.respondWith((async () => {
      const cached = await caches.match(new Request(JSZIP_URL, { mode: 'no-cors' }));
      if (cached) return cached;
      return fetch(event.request);
    })());
  }
});
