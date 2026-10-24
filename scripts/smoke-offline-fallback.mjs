// Requiere la PWA servida en http://127.0.0.1:8085 (pnpm web:serve).
// Comprueba que una navegación offline sin index cacheado muestra offline.html
// en lugar de dejar que iOS descargue un archivo vacío.
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
  await page.waitForTimeout(1500);

  const cached = await page.evaluate(async () => !!(await caches.match('/offline.html')));
  assert.equal(cached, true, 'offline.html debe estar precacheado');

  // Simula una caché sin el shell principal, como tras una instalación incompleta.
  await page.evaluate(async () => {
    for (const key of await caches.keys()) {
      const cache = await caches.open(key);
      await cache.delete('/index.html');
      await cache.delete('/');
    }
  });

  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});

  await page.getByText('No se pudo cargar la app.').waitFor({ timeout: 10000 });
  console.log('OK: fallback offline servido sin archivo vacío.');
} catch (error) {
  await page.screenshot({ path: 'artifacts/offline-fallback-error.png' });
  console.error('FAILED', error);
  process.exitCode = 1;
} finally {
  await browser.close();
}
