/* Service worker de SUMA: precache completo, offline y COOP/COEP en Pages. */
// Sube esta versión al publicar cambios para invalidar la caché anterior.
const VERSION = 'suma-v7';

// Sirve tanto en la raíz como en una subruta tipo /SUMA/ (GitHub Pages).
const BASE = new URL('./', self.location).pathname.replace(/\/$/, '');
const INDEX = BASE + '/index.html';
const SHELL = [
  BASE + '/',
  INDEX,
  BASE + '/manifest.webmanifest',
  BASE + '/icons/icon-192.png',
  BASE + '/icons/icon-512.png',
  BASE + '/icons/apple-touch-icon.png',
  BASE + '/offline.html',
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

function withIsolationHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  // Safari no admite COEP: credentialless; require-corp funciona en Chrome y Safari.
  headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function offlineShell() {
  const cached =
    (await caches.match(INDEX)) ||
    (await caches.match(BASE + '/')) ||
    (await caches.match(BASE + '/offline.html'));

  return cached ? withIsolationHeaders(cached) : undefined;
}

function isCacheable(url) {
  return (
    url.pathname.startsWith(BASE + '/_expo/') ||
    url.pathname.startsWith(BASE + '/assets/') ||
    url.pathname.startsWith(BASE + '/icons/') ||
    /\.(js|css|wasm|ttf|otf|woff2?|png|jpg|jpeg|svg|json|webmanifest)$/.test(url.pathname)
  );
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === BASE + '/sw.js') return;

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

          const isolated = withIsolationHeaders(response);
          const cache = await caches.open(VERSION);
          await cache.put(INDEX, isolated.clone());
          return isolated;
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
