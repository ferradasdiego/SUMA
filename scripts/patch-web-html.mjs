#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const file = resolve(process.argv[2] ?? 'dist/index.html');
let html = await readFile(file, 'utf8');

html = html.replace('<html lang="en">', '<html lang="es">');
html = html.replace(
  /<meta name="viewport"[^>]*>/,
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />',
);

const block = `<!-- SUMA PWA -->
    <meta name="description" content="Registra el dinero que decides no gastar y mira tu progreso. La app no mueve dinero ni es una cuenta bancaria." />
    <meta name="theme-color" content="#2D7A4B" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="SUMA" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="48x48" href="/icons/favicon-48.png" />
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js').catch(function () {});
        });
      }
    </script>
    <!-- /SUMA PWA -->`;

html = html.replace(/<!-- SUMA PWA -->[\s\S]*?<!-- \/SUMA PWA -->\n?/, '');
html = html.replace('</head>', block + '\n  </head>');

await writeFile(file, html, 'utf8');
console.log('HTML de la PWA actualizado: ' + file);
