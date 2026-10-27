import { initializeDatabase } from '@/data/database';
import { serializeExport } from '@/data/export/exportData';
import { parseImportPayload } from '@/data/export/importData';
import { importData } from '@/data/import/importService';
import { openSqlJsDatabase, type SqlJsDriver } from '@/data/local/sqljsDriver';
import type { DatabaseContext } from '@/data/repositories/types';
import { makeExportPayload, importGoal } from '../fixtures/importPayload';
import { makeEntry } from '../fixtures/entries';

async function setup(): Promise<{ driver: SqlJsDriver; db: DatabaseContext }> {
  const driver = await openSqlJsDatabase();
  let sequence = 0;
  const result = await initializeDatabase({
    driver,
    newId: () => 'local-' + ++sequence,
    now: () => new Date('2026-10-23T10:00:00.000Z'),
  });
  if (!result.ok) throw new Error(result.error.message);
  return { driver, db: result.value };
}

const now = () => new Date('2026-10-23T12:00:00.000Z');

describe('importData', () => {
  it('fusiona sin duplicar registros ni pisar el objetivo activo local', async () => {
    const { driver, db } = await setup();

    const localEntry = await db.repositories.entries.create({
      amountMinor: 250,
      currency: 'EUR',
      categoryId: 'cat_coffee',
      note: 'Local',
      occurredAtUtc: '2026-10-23T10:00:00.000Z',
      occurredLocalDate: '2026-10-23',
      occurredTz: 'Europe/Madrid',
    });
    if (!localEntry.ok) throw new Error('no creado');
    const localGoal = await db.repositories.goals.create({
      title: 'Local',
      targetAmountMinor: 1000,
      currency: 'EUR',
      startDate: '2026-10-01',
      targetDate: null,
    });
    if (!localGoal.ok) throw new Error('no creado');

    const payload = makeExportPayload({
      entries: [
        { ...makeEntry({ id: localEntry.value.id }), note: 'No debe pisar' },
        makeEntry({ id: 'entry-imported', note: 'Importado' }),
      ],
      goals: [importGoal],
    });

    const result = await importData({ driver, now }, payload, 'merge');
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.importedEntries).toBe(1);
    expect(result.value.skippedEntries).toBe(1);
    expect(result.value.importedGoals).toBe(1);

    const entries = await db.repositories.entries.list();
    expect(entries.ok && entries.value).toHaveLength(2);
    if (entries.ok) {
      expect(entries.value.find((entry) => entry.id === localEntry.value.id)?.note).toBe('Local');
    }

    const goals = await db.repositories.goals.list();
    expect(goals.ok && goals.value.filter((goal) => goal.isActive)).toHaveLength(1);
    if (goals.ok) {
      const imported = goals.value.find((goal) => goal.id === importGoal.id);
      expect(imported?.isActive).toBe(false);
    }

    const localProfile = await db.repositories.profile.get();
    expect(localProfile.ok && localProfile.value.skin).toBe('classic');

    await driver.close();
  });

  it('reemplaza todos los datos y restaura el perfil', async () => {
    const { driver, db } = await setup();
    await db.repositories.entries.create({
      amountMinor: 250,
      currency: 'EUR',
      categoryId: 'cat_coffee',
      note: 'Local',
      occurredAtUtc: '2026-10-23T10:00:00.000Z',
      occurredLocalDate: '2026-10-23',
      occurredTz: 'Europe/Madrid',
    });

    const payload = makeExportPayload({
      profile: {
        ...makeExportPayload().profile,
        weekStartsOn: 0,
        onboardingCompleted: true,
        skin: 'kawaii',
        quickAmountsMinor: [200, 300, 400, 500],
      },
      entries: [makeEntry({ id: 'entry-replace', note: 'De la copia' })],
      goals: [importGoal],
    });

    const result = await importData({ driver, now }, payload, 'replace');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.importedEntries).toBe(1);

    const entries = await db.repositories.entries.list();
    expect(entries.ok && entries.value).toHaveLength(1);
    if (entries.ok) expect(entries.value[0]!.id).toBe('entry-replace');

    const goals = await db.repositories.goals.list();
    expect(goals.ok && goals.value).toHaveLength(1);

    const profile = await db.repositories.profile.get();
    expect(profile.ok).toBe(true);
    if (profile.ok) {
      expect(profile.value.weekStartsOn).toBe(0);
      expect(profile.value.skin).toBe('kawaii');
      expect(profile.value.quickAmountsMinor).toEqual([200, 300, 400, 500]);
    }

    await driver.close();
  });

  it('importa una copia antigua sin skin y aplica la clásica', async () => {
    const { driver, db } = await setup();
    await db.repositories.profile.update({ skin: 'kawaii' });

    const raw = JSON.parse(serializeExport(makeExportPayload())) as Record<string, unknown>;
    const oldProfile = raw.profile as Record<string, unknown>;
    delete oldProfile.skin;

    const parsed = parseImportPayload(JSON.stringify(raw));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    const result = await importData({ driver, now }, parsed.value, 'replace');
    expect(result.ok).toBe(true);

    const profile = await db.repositories.profile.get();
    expect(profile.ok && profile.value.skin).toBe('classic');

    await driver.close();
  });

  it('rechaza fusionar una copia con otra moneda', async () => {
    const { driver } = await setup();
    const payload = makeExportPayload({
      profile: { ...makeExportPayload().profile, preferredCurrency: 'USD' },
      entries: [makeEntry({ id: 'usd-entry', currency: 'USD' })],
    });

    const result = await importData({ driver, now }, payload, 'merge');
    expect(result.ok).toBe(false);
    await driver.close();
  });

  it('revierte la importación si falla a mitad', async () => {
    const { driver, db } = await setup();
    await db.repositories.entries.create({
      amountMinor: 250,
      currency: 'EUR',
      categoryId: 'cat_coffee',
      note: 'Local',
      occurredAtUtc: '2026-10-23T10:00:00.000Z',
      occurredLocalDate: '2026-10-23',
      occurredTz: 'Europe/Madrid',
    });

    // Categoría inexistente a nivel SQL (la validación previa lo impediría, así
    // que se fuerza el fallo de integridad con un payload manipulado).
    const payload = makeExportPayload({
      entries: [makeEntry({ id: 'bad', categoryId: 'cat_que_no_existe' })],
    });

    const result = await importData({ driver, now }, payload, 'merge');
    expect(result.ok).toBe(false);

    const entries = await db.repositories.entries.list();
    expect(entries.ok && entries.value).toHaveLength(1);

    await driver.close();
  });
});
