const CACHE_NAME = 'nightshelf-shell-v1';
const APP_FILES = ['./', './index.html', './manifest.webmanifest', './icon.svg', './apple-touch-icon.png'];
const EPUBJS_URL = 'https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_FILES);
    // Best-effort cache of the rendering library for repeat/offline visits.
    try {
      const request = new Request(EPUBJS_URL, { mode: 'no-cors' });
      const response = await fetch(request);
      await cache.put(request, response);
    } catch (error) {
      console.warn('Could not cache EPUB rendering library during install.', error);
    }
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
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request);
      if (cached) return cached;
      try {
        const response = await fetch(event.request);
        if (response.ok) cache.put(event.request, response.clone()).catch(() => {});
        return response;
      } catch (error) {
        return (await cache.match('./index.html')) || Response.error();
      }
    })());
  } else if (event.request.url === EPUBJS_URL) {
    event.respondWith((async () => {
      const cached = await caches.match(new Request(EPUBJS_URL, { mode: 'no-cors' }));
      if (cached) return cached;
      return fetch(event.request);
    })());
  }
});
