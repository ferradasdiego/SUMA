import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const url = process.argv[2] ?? 'http://127.0.0.1:8085';
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: url.startsWith('https:') ? ['--ignore-certificate-errors'] : [],
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: 'es-ES',
  timezoneId: 'Europe/Madrid',
  ignoreHTTPSErrors: true,
});
const page = await context.newPage();

const errors = [];
page.on('console', (message) => {
  if (message.type() === 'error') {
    errors.push(message.text());
    console.log('[console.error]', message.text());
  }
});
page.on('pageerror', (error) => {
  errors.push(error.message);
  console.log('[pageerror]', error.message);
});

function check(name, condition, detail = '') {
  console.log((condition ? 'OK  ' : 'FAIL') + ' ' + name + (detail ? ' — ' + detail : ''));
  if (!condition) process.exitCode = 1;
}

await mkdir('artifacts', { recursive: true });
await page.goto(url, { waitUntil: 'domcontentloaded' });

check('origen aislado (COOP/COEP)', await page.evaluate(() => crossOriginIsolated));
check('SharedArrayBuffer disponible', await page.evaluate(() => typeof SharedArrayBuffer !== 'undefined'));

await page.getByText('Empezar').waitFor({ timeout: 30000 });
console.log('Onboarding visible');
await page.screenshot({ path: 'artifacts/web-01-onboarding.png', fullPage: true });

await page.getByText('Empezar').click();
await page.getByText('Tu dinero no gastado').waitFor({ timeout: 20000 });
check('onboarding completado', true);

await page.getByRole('button', { name: 'Registrar una decisión' }).click();
await page.getByLabel('Importe', { exact: true }).waitFor({ timeout: 10000 });

// Importes rápidos editables: cambiar 1,50 por 4,20
await page.getByRole('button', { name: 'Editar importes rápidos' }).click();
await page.getByRole('button', { name: '1,50' }).click();
await page.getByLabel('Nuevo importe rápido', { exact: true }).fill('4,20');
await page.getByRole('button', { name: 'Guardar importe', exact: true }).click();
await page.getByRole('button', { name: '4,20' }).waitFor({ timeout: 10000 });
check('importe rápido editado', true);
await page.getByRole('button', { name: 'Terminar de editar importes rápidos' }).click();

await page.getByLabel('Importe', { exact: true }).fill('2,50');
await page.getByRole('button', { name: 'Guardar', exact: true }).click();
await page.getByText('Decisión registrada').waitFor({ timeout: 10000 });
check('registro guardado', true);

await page.getByRole('button', { name: 'Ir a inicio' }).click();
await page.getByText('Tu dinero no gastado').waitFor({ timeout: 10000 });
await page.getByText(/2,50/).first().waitFor({ timeout: 10000 });
check('inicio muestra el importe', true);

const totalBeforeReload = await page.locator('body').innerText();
await page.screenshot({ path: 'artifacts/web-02-inicio.png', fullPage: true });

await page.reload({ waitUntil: 'domcontentloaded' });
await page.getByText('Tu dinero no gastado').waitFor({ timeout: 30000 });
await page.getByText(/2,50/).first().waitFor({ timeout: 15000 });
check('los datos sobreviven al recargar', true);

// El importe rápido editado sigue ahí
await page.getByRole('tab', { name: /Añadir/ }).click().catch(async () => {
  await page.getByText('Añadir', { exact: true }).last().click();
});
await page.getByLabel('Importe', { exact: true }).waitFor({ timeout: 10000 });
await page.getByRole('button', { name: '4,20' }).waitFor({ timeout: 10000 });
check('importe rápido persiste al recargar', true);
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.getByText('Tu dinero no gastado').waitFor({ timeout: 20000 });

const sw = await page.evaluate(async () => {
  if (!('serviceWorker' in navigator)) return null;
  const registration = await navigator.serviceWorker.getRegistration();
  return registration ? { scope: registration.scope, active: Boolean(registration.active) } : null;
});
check('service worker registrado', Boolean(sw?.active), JSON.stringify(sw));

const manifestHref = await page.evaluate(() =>
  document.querySelector('link[rel="manifest"]')?.getAttribute('href') ?? null,
);
check('manifest enlazado', manifestHref === '/manifest.webmanifest', String(manifestHref));

const manifest = await page.evaluate(async () => {
  const response = await fetch('/manifest.webmanifest');
  return response.ok ? response.json() : null;
});
check('manifest válido', Boolean(manifest?.name && manifest?.icons?.length >= 3));

try {
  const cdp = await context.newCDPSession(page);
  const appManifest = await cdp.send('Page.getAppManifest');
  const installability = await cdp.send('Page.getInstallabilityErrors');
  const manifestErrors = (appManifest.errors ?? []).map((item) => item.message);
  const installErrors = (installability.installabilityErrors ?? []).map(
    (item) => item.errorId + (item.errorArguments ? ': ' + item.errorArguments.join(', ') : ''),
  );
  // Chrome headless usa un contexto de incógnito: impide el prompt, no es un defecto del manifest.
  const relevantErrors = installErrors.filter((error) => !error.startsWith('in-incognito'));
  check(
    'PWA instalable (sin incógnito)',
    manifestErrors.length === 0 && relevantErrors.length === 0,
    JSON.stringify({ manifestErrors, installErrors }),
  );
} catch (error) {
  console.log('No se pudo consultar la instalabilidad:', error.message);
}

// Navegación por las pestañas
await page.getByRole('tab', { name: /Historial/ }).click().catch(async () => {
  await page.getByText('Historial', { exact: true }).last().click();
});
await page.waitForTimeout(800);
check('historial accesible', (await page.locator('body').innerText()).includes('Historial'));

await page.getByText('Estadísticas', { exact: true }).last().click();
await page.waitForTimeout(800);
check('estadísticas accesibles', (await page.locator('body').innerText()).includes('Evolución'));

await page.screenshot({ path: 'artifacts/web-03-estadisticas.png', fullPage: true });

check('sin errores de consola en línea', errors.length === 0, errors.slice(0, 3).join(' | '));

// Volver a Inicio (recarga en línea) antes de probar sin conexión
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.getByText('Tu dinero no gastado').waitFor({ timeout: 15000 });
check('vuelta a Inicio', true);

// Sin conexión: el service worker debe servir el shell y los datos deben seguir ahí
await context.setOffline(true);
try {
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 });
} catch (error) {
  console.log('offline reload error:', error.message);
}
await page.waitForTimeout(4000);
const offlineText = await page.locator('body').innerText();
console.log('OFFLINE URL:', page.url());
console.log('OFFLINE BODY:', offlineText.replace(/\n/g, ' | ').slice(0, 400));
const cachedPaths = await page.evaluate(async () => {
  if (!('caches' in globalThis)) return [];
  const keys = await caches.keys();
  if (keys.length === 0) return [];
  const cache = await caches.open(keys[0]);
  return (await cache.keys()).map((request) => new URL(request.url).pathname);
});
console.log('CACHE:', cachedPaths.join(' '));
check('funciona sin conexión tras la primera visita', offlineText.includes('Tu dinero no gastado'));

// Editar un registro sin conexión (la ruta nunca se abrió antes)
await page.getByRole('tab', { name: /Historial/ }).click().catch(async () => {
  await page.getByText('Historial', { exact: true }).last().click();
});
await page.getByText('Historial').first().waitFor({ timeout: 10000 });
await page.waitForTimeout(600);
await page.getByRole('button', { name: /Editar registro/ }).first().click();
await page.getByText('Editar registro').waitFor({ timeout: 10000 });
check('edición sin conexión', true);
await page.getByText('Volver').click();
await page.getByText('Historial').first().waitFor({ timeout: 10000 });

await page.screenshot({ path: 'artifacts/web-04-offline.png', fullPage: true });
await context.setOffline(false);

console.log('Total antes de recargar:', totalBeforeReload.replace(/\n/g, ' | ').slice(0, 200));

await browser.close();
