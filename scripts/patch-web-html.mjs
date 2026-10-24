#!/usr/bin/env node
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const file = resolve(process.argv[2] ?? 'dist/index.html');
const base = (process.env.SUMA_BASE_PATH ?? '').replace(/\/+$/, '');
const url = (path) => base + path;
const scope = (base || '') + '/';
let html = await readFile(file, 'utf8');

html = html.replace('<html lang="en">', '<html lang="es">');
html = html.replace(
  /<meta name="viewport"[^>]*>/,
  '<meta name="viewport" content="width=device-width, initial-scale=1" />',
);

const block = `<!-- SUMA PWA -->
    <meta name="description" content="Registra el dinero que decides no gastar y mira tu progreso. La app no mueve dinero ni es una cuenta bancaria." />
    <meta name="theme-color" content="#FFFFFF" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="SUMA" />
    <link rel="manifest" href="${url('/manifest.webmanifest')}" />
    <link rel="apple-touch-icon" href="${url('/icons/apple-touch-icon.png')}" />
    <link rel="icon" type="image/png" sizes="48x48" href="${url('/icons/favicon-48.png')}" />
    <style id="suma-shell">
      html, body, #root {
        height: 100%;
        margin: 0;
        background-color: #FFFFFF;
      }
      html { color-scheme: light; }
      body {
        overscroll-behavior-y: none;
        -webkit-tap-highlight-color: transparent;
      }
      /* Evita que el contenido asome bajo la barra de estado translúcida de iOS. */
      body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: env(safe-area-inset-top, 0px);
        background: #FFFFFF;
        z-index: 2147483647;
        pointer-events: none;
      }
    </style>
    <script>
      (function () {
        if (!('serviceWorker' in navigator)) return;

        var reloadKey = 'suma-coi-reload';
        function reloadOnce() {
          try {
            if (sessionStorage.getItem(reloadKey)) return;
            sessionStorage.setItem(reloadKey, '1');
          } catch (error) {}
          window.location.reload();
        }

        // En GitHub Pages no se pueden enviar COOP/COEP desde el servidor.
        // El service worker los añade; la primera visita se recarga una vez.
        navigator.serviceWorker
          .register(${JSON.stringify(url('/sw.js'))}, { scope: ${JSON.stringify(scope)} })
          .then(function () {
            return navigator.serviceWorker.ready;
          })
          .then(function () {
            if (crossOriginIsolated) {
              try { sessionStorage.removeItem(reloadKey); } catch (error) {}
              return;
            }
            if (navigator.serviceWorker.controller) {
              reloadOnce();
              return;
            }
            navigator.serviceWorker.addEventListener(
              'controllerchange',
              function () {
                if (!crossOriginIsolated) reloadOnce();
              },
              { once: true },
            );
          })
          .catch(function () {});
      })();
    </script>
    <!-- /SUMA PWA -->`;

html = html.replace(/<!-- SUMA PWA -->[\s\S]*?<!-- \/SUMA PWA -->\n?/, '');
html = html.replace('</head>', block + '\n  </head>');
await writeFile(file, html, 'utf8');

// Manifest: el mismo build puede servirse en /SUMA/ o en la raíz.
const manifestPath = join(dirname(file), 'manifest.webmanifest');
try {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  manifest.id = (base || '') + '/';
  manifest.start_url = (base || '') + '/';
  manifest.scope = (base || '') + '/';
  manifest.icons = (manifest.icons ?? []).map((icon) => ({
    ...icon,
    src: icon.src.startsWith(base + '/') ? icon.src : base + icon.src,
  }));
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
} catch (error) {
  console.warn('No se pudo parchear manifest.webmanifest:', error.message);
}

if (process.env.SUMA_PAGES === '1') {
  await copyFile(file, join(dirname(file), '404.html'));
  await writeFile(join(dirname(file), '.nojekyll'), '');
}

console.log('HTML de la PWA actualizado: ' + file + (base ? ' (base ' + base + ')' : ''));
