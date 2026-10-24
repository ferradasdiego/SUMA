/* Service worker de SUMA: app shell + cache en tiempo de ejecución. */
// Sube esta versión al publicar cambios para invalidar la caché anterior.
const VERSION = 'suma-v6';
const SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/offline.html',
];

// build-sw.mjs sustituye este array por todos los recursos del build.
// Así una sola apertura online deja la app completa disponible sin conexión.
const PRECACHE = [];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll([...new Set([...SHELL, ...PRECACHE])]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

async function offlineShell() {
  return (
    (await caches.match('/index.html')) ||
    (await caches.match('/')) ||
    (await caches.match('/offline.html'))
  );
}

function isCacheable(url) {
  return (
    url.pathname.startsWith('/_expo/') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/icons/') ||
    /\.(js|css|wasm|ttf|otf|woff2?|png|jpg|jpeg|svg|json|webmanifest)$/.test(url.pathname)
  );
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/sw.js') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          const type = response.headers.get('content-type') ?? '';

          // Un túnel caído puede devolver un archivo vacío en lugar de HTML.
          // En ese caso se sirve la copia cacheada, nunca el archivo.
          if (!response.ok || !type.includes('text/html')) {
            return (await offlineShell()) ?? response;
          }

          const copy = response.clone();
          const cache = await caches.open(VERSION);
          await cache.put('/index.html', copy);
          return response;
        } catch {
          const cached = await offlineShell();
          if (cached) return cached;

          return new Response(
            '<!doctype html><meta charset="utf-8"><title>SUMA</title><p>No se pudo cargar SUMA. Abre la app con conexión una vez.</p>',
            { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
          );
        }
      })(),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (response.ok && isCacheable(url)) {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
