// Requiere la PWA servida en http://127.0.0.1:8085 (pnpm web:serve).
// Simula el caso real: una sola apertura online, servidor caído, abrir de nuevo.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();

try {
  await page.goto(process.env.SUMA_URL ?? 'http://127.0.0.1:8085/', {
    waitUntil: 'networkidle',
  });

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise((resolve) => {
        navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true });
      });
    }
  });

  // Espera a que el install haya precargado bundle y WASM.
  await page.waitForFunction(
    async () => {
      for (const key of await caches.keys()) {
        const cache = await caches.open(key);
        const paths = (await cache.keys()).map((request) => new URL(request.url).pathname);
        if (paths.some((path) => path.endsWith('.js')) && paths.some((path) => path.endsWith('.wasm'))) {
          return true;
        }
      }
      return false;
    },
    null,
    { timeout: 30000 },
  );

  const cached = await page.evaluate(async () => {
    const paths = [];
    for (const key of await caches.keys()) {
      const cache = await caches.open(key);
      paths.push(...(await cache.keys()).map((request) => new URL(request.url).pathname));
    }
    return paths;
  });
  assert.ok(cached.some((path) => path.endsWith('.js')), 'falta el bundle JS precargado');
  assert.ok(cached.some((path) => path.endsWith('.wasm')), 'falta SQLite WASM precargado');

  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByText('Cada decisión cuenta').waitFor({ timeout: 15000 });

  console.log('OK: primera carga online y servidor caído; la app sigue funcionando.');
} catch (error) {
  await page.screenshot({ path: 'artifacts/offline-first-load-error.png' });
  console.error('FAILED', error);
  console.error('BODY', (await page.locator('body').innerText().catch(() => '')).slice(0, 1000));
  process.exitCode = 1;
} finally {
  await browser.close();
}
