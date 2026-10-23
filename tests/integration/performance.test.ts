import { initializeDatabase } from '@/data/database';
import { openSqlJsDatabase } from '@/data/local/sqljsDriver';

jest.setTimeout(30000);

describe('rendimiento y errores de almacenamiento', () => {
  it('responde con 10.000 registros dentro de un presupuesto razonable', async () => {
    const driver = await openSqlJsDatabase();
    const initialized = await initializeDatabase({
      driver,
      newId: () => 'seed',
      now: () => new Date('2026-10-23T10:00:00.000Z'),
    });
    if (!initialized.ok) throw new Error(initialized.error.message);

    const startSeed = Date.now();
    await driver.transaction(async (tx) => {
      for (let index = 0; index < 10_000; index += 1) {
        const day = String((index % 28) + 1).padStart(2, '0');
        await tx.run(
          'INSERT INTO entries (id, user_id, amount_minor, currency, category_id, note, occurred_at_utc, occurred_local_date, occurred_tz, created_at, updated_at) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            'perf-' + index,
            100 + (index % 900),
            'EUR',
            'cat_coffee',
            null,
            '2026-10-' + day + 'T10:00:00.000Z',
            '2026-10-' + day,
            'Europe/Madrid',
            '2026-10-23T10:00:00.000Z',
            '2026-10-23T10:00:00.000Z',
          ],
        );
      }
    });
    const seedMs = Date.now() - startSeed;

    const repositories = initialized.value.repositories;

    const startSum = Date.now();
    const total = await repositories.entries.sum({ currency: 'EUR' });
    const sumMs = Date.now() - startSum;

    const startList = Date.now();
    const page = await repositories.entries.list({
      currency: 'EUR',
      fromLocalDate: '2026-10-01',
      toLocalDate: '2026-10-23',
      limit: 50,
    });
    const listMs = Date.now() - startList;

    expect(total.ok).toBe(true);
    expect(page.ok && page.value).toHaveLength(50);
    expect(seedMs).toBeLessThan(20_000);
    expect(sumMs).toBeLessThan(1_000);
    expect(listMs).toBeLessThan(1_000);

    console.info(
      'Rendimiento 10k: seed=' + seedMs + 'ms, sum=' + sumMs + 'ms, list=' + listMs + 'ms',
    );
    await driver.close();
  });

  it('devuelve error de almacenamiento si la base está cerrada', async () => {
    const driver = await openSqlJsDatabase();
    const initialized = await initializeDatabase({
      driver,
      newId: () => 'id',
      now: () => new Date('2026-10-23T10:00:00.000Z'),
    });
    if (!initialized.ok) throw new Error(initialized.error.message);

    await driver.close();

    const result = await initialized.value.repositories.entries.list();
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('STORAGE');
  });
});
