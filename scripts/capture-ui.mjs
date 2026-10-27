#!/usr/bin/env node
/**
 * Captura pantallas de SUMA para revisión visual de skins.
 * Uso: node scripts/capture-ui.mjs [url] [outDir] [skin]
 * Requiere el build servido con COOP/COEP (pnpm web:build && pnpm web:serve).
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const url = process.argv[2] ?? 'http://127.0.0.1:8085';
const outDir = process.argv[3] ?? '.artifacts/ui';
const skin = process.argv[4] ?? null;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: 'es-ES',
  timezoneId: 'Europe/Madrid',
});
const page = await context.newPage();
const errors = [];
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});
page.on('pageerror', (error) => errors.push(error.message));

await mkdir(outDir, { recursive: true });
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.getByText('Empezar').waitFor({ timeout: 60000 });
await page.screenshot({ path: `${outDir}/01-onboarding.png`, fullPage: true });
await page.getByText('Empezar').click();
await page.getByText('Tu dinero no gastado').waitFor({ timeout: 30000 });

// Añade varios registros para poblar la interfaz.
const samples = [
  { amount: '4,20', category: 'Café', note: 'Café preparado en casa' },
  { amount: '12,50', category: 'Comida', note: 'Comida en el trabajo' },
  { amount: '2,80', category: 'Transporte', note: 'Paseo en vez de bus' },
  { amount: '18,00', category: 'Ocio', note: 'Cine en casa' },
  { amount: '35,00', category: 'Compras', note: 'Compra que no necesitaba' },
];
for (const sample of samples) {
  await page.getByText('Registrar una decisión').click();
  await page.getByLabel('Importe', { exact: true }).fill(sample.amount);
  await page.getByText(sample.category, { exact: true }).click();
  await page.getByLabel('Nota (opcional)').fill(sample.note);
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  await page.getByText('Decisión registrada').waitFor({ timeout: 15000 });
  await page.getByRole('button', { name: 'Ir a inicio' }).click();
  await page.getByText('Tu dinero no gastado').waitFor({ timeout: 15000 });
}

// Captura de inicio.
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/02-inicio.png`, fullPage: true });

// Objetivo.
await page.getByText('Crear objetivo').click();
await page.getByLabel('Nombre del objetivo').fill('Viaje a la playa');
await page.getByLabel('Cantidad objetivo').fill('500');
await page.getByRole('button', { name: 'Crear objetivo' }).click();
await page.getByRole('button', { name: 'Editar objetivo' }).waitFor({ timeout: 15000 });
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/03-inicio-objetivo.png`, fullPage: true });
await page.getByRole('button', { name: 'Volver' }).click();
await page.getByText('Tu dinero no gastado').waitFor({ timeout: 20000 });

// Añadir.
await page.getByText('Registrar una decisión').click();
await page.getByLabel('Importe', { exact: true }).waitFor();
await page.screenshot({ path: `${outDir}/04-anadir.png`, fullPage: true });

// Historial.
await page.getByText('Historial', { exact: true }).last().click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${outDir}/05-historial.png`, fullPage: true });

// Estadísticas.
await page.getByText('Estadísticas', { exact: true }).last().click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${outDir}/06-estadisticas.png`, fullPage: true });

// Ajustes y selección de skin.
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.getByText('Tu dinero no gastado').waitFor({ timeout: 20000 });
await page.getByLabel('Abrir ajustes').click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${outDir}/07-ajustes.png`, fullPage: true });

if (skin) {
  const option = page.getByRole('button', { name: new RegExp(skin, 'i') }).first();
  await option.scrollIntoViewIfNeeded();
  await option.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outDir}/08-ajustes-skin.png`, fullPage: true });

  // Ajustes desde arriba con la nueva skin ya aplicada.
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.getByText('Tu dinero no gastado').waitFor({ timeout: 20000 });
  await page.getByLabel('Abrir ajustes').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${outDir}/08b-ajustes-skin-top.png`, fullPage: true });
}

// Inicio y pestañas con la skin aplicada.
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.getByText('Tu dinero no gastado').waitFor({ timeout: 20000 });
await page.waitForTimeout(600);
await page.screenshot({ path: `${outDir}/09-inicio-skin.png`, fullPage: true });

if (skin) {
  await page.getByText('Viaje a la playa').last().scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outDir}/09b-inicio-objetivo-skin.png`, fullPage: true });

  await page.getByText('Historial', { exact: true }).last().click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${outDir}/10-historial-skin.png`, fullPage: true });

  await page.getByLabel('Eliminar registro').first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${outDir}/10b-dialogo-skin.png`, fullPage: true });
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await page.waitForTimeout(300);

  await page.getByText('Estadísticas', { exact: true }).last().click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${outDir}/11-estadisticas-skin.png`, fullPage: true });

  await page.getByText('Añadir', { exact: true }).last().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${outDir}/12-anadir-skin.png`, fullPage: true });
}

console.log('Capturas en ' + outDir);
if (errors.length) {
  console.error('Errores de consola:\n' + errors.join('\n'));
  process.exitCode = 1;
}
await browser.close();
