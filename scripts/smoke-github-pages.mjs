// Simula GitHub Pages: sirve dist en /SUMA/ SIN cabeceras COOP/COEP.
// Requiere: pnpm web:build:gh
import { createReadStream, existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = resolve('dist');
const base = '/SUMA/';
const port = Number(process.env.SUMA_GH_PORT ?? '8090');

const sw = await readFile(join(root, 'sw.js'), 'utf8').catch(() => '');
const html = await readFile(join(root, 'index.html'), 'utf8').catch(() => '');
if (!sw.includes('"/SUMA/') || !html.includes('/SUMA/')) {
  console.error('Ejecuta primero: pnpm web:build:gh');
  process.exit(1);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.svg': 'image/svg+xml',
};

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  if (!pathname.startsWith(base)) {
    response.writeHead(404);
    response.end('No encontrado');
    return;
  }

  let relative = pathname.slice(base.length);
  if (relative === '' || relative.endsWith('/')) relative += 'index.html';
  const file = join(root, relative);
  if (!file.startsWith(root + sep) || !existsSync(file)) {
    response.writeHead(404);
    response.end('No encontrado');
    return;
  }

  // Sin COOP/COEP a propósito: los añade el service worker, como en Pages.
  response.writeHead(200, {
    'Content-Type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  createReadStream(file).pipe(response);
});

await new Promise((resolveListen, rejectListen) => {
  server.once('error', rejectListen);
  server.listen(port, '127.0.0.1', resolveListen);
});

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
const errors = [];
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});
page.on('pageerror', (error) => errors.push(String(error)));

try {
  await page.goto('http://127.0.0.1:' + port + base, { waitUntil: 'networkidle' });

  // La primera visita se recarga sola para que el SW inyecte COOP/COEP.
  await page.waitForFunction(() => crossOriginIsolated === true, null, { timeout: 30000 });
  await page.getByText('Cada decisión cuenta').waitFor({ timeout: 15000 });

  const info = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    const paths = [];
    for (const key of await caches.keys()) {
      const cache = await caches.open(key);
      paths.push(...(await cache.keys()).map((request) => new URL(request.url).pathname));
    }
    return {
      isolated: crossOriginIsolated,
      sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
      controller: navigator.serviceWorker.controller?.scriptURL,
      scope: registration.scope,
      manifest: document.querySelector('link[rel="manifest"]')?.getAttribute('href'),
      cached: paths.length,
      js: paths.some((path) => path.endsWith('.js')),
      wasm: paths.some((path) => path.endsWith('.wasm')),
    };
  });

  if (!info.isolated || !info.sharedArrayBuffer) throw new Error('Sin aislamiento COOP/COEP');
  if (!info.controller?.endsWith('/SUMA/sw.js')) throw new Error('Service worker fuera de /SUMA/');
  if (!info.manifest?.endsWith('/SUMA/manifest.webmanifest')) throw new Error('Manifest sin base');
  if (!info.js || !info.wasm) throw new Error('Precache incompleto');

  await page.screenshot({ path: 'artifacts/gh-pages-online.png' });

  // Comprueba que el router y las rutas internas usan la subruta /SUMA/.
  await page.getByRole('button', { name: 'Empezar' }).click();
  await page.getByText('Total acumulado').waitFor({ timeout: 15000 });
  await page.getByText('Añadir', { exact: true }).click();
  await page.getByText('Importes rápidos').waitFor({ timeout: 15000 });
  if (!page.url().includes('/SUMA/add')) {
    throw new Error('Ruta interna sin base /SUMA/: ' + page.url());
  }

  // Recarga profunda sin red: GitHub Pages devolvería 404 y el SW sirve el shell.
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByText('Importes rápidos').waitFor({ timeout: 15000 });
  const offline = await page.evaluate(() => ({
    isolated: crossOriginIsolated,
    sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
  }));
  if (!offline.isolated || !offline.sharedArrayBuffer) {
    throw new Error('Sin aislamiento tras recarga offline: ' + JSON.stringify(offline));
  }

  if (errors.length > 0) throw new Error('Errores de consola: ' + JSON.stringify(errors.slice(0, 5)));
  console.log('OK GitHub Pages simulado:', JSON.stringify(info));
} catch (error) {
  await page.screenshot({ path: 'artifacts/gh-pages-error.png' });
  console.error('FAILED', error);
  console.error('BODY', (await page.locator('body').innerText().catch(() => '')).slice(0, 1000));
  console.error('CONSOLE_ERRORS', JSON.stringify(errors.slice(0, 10)));
  process.exitCode = 1;
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}
