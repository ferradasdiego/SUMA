// Requiere la PWA servida en http://127.0.0.1:8085 (pnpm web:serve).
// Verifica onboarding multiidioma, cambio de idioma, exportación, fusión y reemplazo.
import { chromium } from 'playwright';

const errors = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const width = Number(process.env.SUMA_WIDTH ?? 390);
const height = Number(process.env.SUMA_HEIGHT ?? 844);
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 2,
  locale: 'es-ES',
  acceptDownloads: true,
});
const page = await context.newPage();
const baseUrl = process.env.SUMA_URL ?? 'http://127.0.0.1:8085/';
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});
page.on('pageerror', (error) => errors.push(String(error)));

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Cada decisión cuenta').waitFor({ timeout: 15000 });
  await page.screenshot({ path: 'artifacts/i18n-onboarding-es.png' });

  await page.getByRole('button', { name: 'English' }).click();
  await page.getByText('Every decision counts').waitFor();
  await page.screenshot({ path: 'artifacts/i18n-onboarding-en.png' });

  await page.getByRole('button', { name: 'Get started' }).click();
  await page.getByText('Total not spent').waitFor({ timeout: 15000 });

  await page.getByText('Add', { exact: true }).click();
  await page.getByLabel('Amount', { exact: true }).fill('5.00');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByText('Decision recorded').waitFor();
  await page.getByRole('button', { name: 'Go home' }).click();
  await page.getByText('€5.00').first().waitFor();

  await page.getByRole('button', { name: 'Open settings' }).click();
  await page.getByText('Settings', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Català' }).click();
  await page.getByText('Configuració').waitFor();
  await page.screenshot({ path: 'artifacts/i18n-settings-ca.png' });

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exporta dades (JSON)' }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  console.log('Copia exportada:', downloadPath);

  const chooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Importa dades (JSON)' }).click();
  const chooser = await chooserPromise;
  await chooser.setFiles(downloadPath);
  await page.getByText(/Còpia del/).waitFor({ timeout: 15000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'artifacts/import-dialog-ca.png' });

  await page.getByRole('button', { name: 'Fusiona les dades' }).click();
  await page.getByText(/Importació completada/).waitFor({ timeout: 15000 });
  console.log('MERGE', await page.getByText(/Importació completada/).innerText());

  await page.getByRole('button', { name: 'Torna' }).click();
  await page.getByText('Total acumulat').waitFor();
  await page.getByText('5,00 €').first().waitFor();
  await page.getByText('Historial', { exact: true }).click();
  await page.getByText('1 registre').waitFor();
  await page.getByText('Inici', { exact: true }).click();
  await page.getByRole('button', { name: 'Obre la configuració' }).click();
  await page.getByText('Configuració', { exact: true }).waitFor();

  await page.getByText('Restableix les dades locals').click();
  await page.getByRole('button', { name: 'Elimina' }).click();
  await page.getByText('Dades restablertes').waitFor({ timeout: 15000 });

  const chooserPromise2 = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Importa dades (JSON)' }).click();
  const chooser2 = await chooserPromise2;
  await chooser2.setFiles(downloadPath);
  await page.getByRole('button', { name: 'Reemplaça-ho tot' }).click();
  await page.getByRole('button', { name: 'Reemplaça definitivament' }).click();
  await page.getByText(/Dades reemplaçades/).waitFor({ timeout: 15000 });
  console.log('REPLACE', await page.getByText(/Dades reemplaçades/).innerText());

  await page.getByRole('button', { name: 'Torna' }).click();
  await page.getByText('5,00 €').first().waitFor({ timeout: 15000 });
  await page.screenshot({ path: 'artifacts/i18n-home-ca-after-import.png' });

  if (errors.length > 0) {
    throw new Error('Errores de consola: ' + JSON.stringify(errors));
  }
  console.log('OK: idioma, exportación, fusión y reemplazo verificados.');
} catch (error) {
  await page.screenshot({ path: 'artifacts/import-error.png' });
  console.error('FAILED', error);
  console.error('BODY', (await page.locator('body').innerText()).slice(0, 3000));
  console.error('CONSOLE_ERRORS', JSON.stringify(errors));
  process.exitCode = 1;
} finally {
  await browser.close();
}
