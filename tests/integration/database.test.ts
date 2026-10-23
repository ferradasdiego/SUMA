import { initializeDatabase } from '@/data/database';
import { openSqlJsDatabase, type SqlJsDriver } from '@/data/local/sqljsDriver';
import type { DatabaseContext } from '@/data/repositories/types';

const ENTRY = {
  amountMinor: 250,
  currency: 'EUR',
  categoryId: 'cat_coffee',
  note: null,
  occurredAtUtc: '2026-10-23T10:00:00.000Z',
  occurredLocalDate: '2026-10-23',
  occurredTz: 'Europe/Madrid',
};

async function setup(): Promise<{ driver: SqlJsDriver; db: DatabaseContext }> {
  const driver = await openSqlJsDatabase();
  let sequence = 0;
  const result = await initializeDatabase({
    driver,
    newId: () => 'id-' + ++sequence,
    now: () => new Date('2026-10-23T10:00:00.000Z'),
  });

  if (!result.ok) throw new Error(result.error.message);
  return { driver, db: result.value };
}

describe('migraciones y semilla', () => {
  it('crea el esquema, el perfil y las siete categorías', async () => {
    const { driver, db } = await setup();

    const categories = await db.repositories.categories.list();
    expect(categories.ok).toBe(true);
    if (categories.ok) {
      expect(categories.value).toHaveLength(7);
      expect(categories.value[0]!.id).toBe('cat_coffee');
      expect(categories.value[0]!.nameKey).toBe('category.coffee');
    }

    const profile = await db.repositories.profile.get();
    expect(profile.ok).toBe(true);
    if (profile.ok) {
      expect(profile.value.id).toBe('local');
      expect(profile.value.preferredCurrency).toBe('EUR');
      expect(profile.value.weekStartsOn).toBe(1);
      expect(profile.value.onboardingCompleted).toBe(false);
    }

    const migrations = await driver.all<{ version: number }>(
      'SELECT version FROM schema_migrations',
    );
    expect(migrations).toHaveLength(1);

    await driver.close();
  });

  it('es idempotente al aplicar migraciones de nuevo', async () => {
    const { driver } = await setup();
    const again = await initializeDatabase({
      driver,
      newId: () => 'x',
      now: () => new Date('2026-10-23T10:00:00.000Z'),
    });
    expect(again.ok).toBe(true);

    const migrations = await driver.all<{ version: number }>(
      'SELECT version FROM schema_migrations',
    );
    expect(migrations).toHaveLength(1);
    await driver.close();
  });
});

describe('repositorio de registros', () => {
  it('crea, lee, lista y suma', async () => {
    const { driver, db } = await setup();
    const { entries } = db.repositories;

    const created = await entries.create(ENTRY);
    expect(created.ok).toBe(true);

    if (!created.ok) throw new Error('no creado');
    expect(created.value.id).toBe('id-1');
    expect(created.value.amountMinor).toBe(250);

    const read = await entries.getById(created.value.id);
    expect(read.ok && read.value?.id).toBe(created.value.id);

    const total = await entries.sum();
    expect(total).toEqual({ ok: true, value: 250 });

    const count = await entries.count();
    expect(count).toEqual({ ok: true, value: 1 });

    await entries.create({ ...ENTRY, amountMinor: 800, categoryId: 'cat_food' });
    const all = await entries.list();
    expect(all.ok).toBe(true);
    if (all.ok) expect(all.value).toHaveLength(2);

    await driver.close();
  });

  it('filtra por fecha, categoría y orden', async () => {
    const { driver, db } = await setup();
    const { entries } = db.repositories;

    await entries.create({ ...ENTRY, occurredLocalDate: '2026-10-01', amountMinor: 100 });
    await entries.create({ ...ENTRY, occurredLocalDate: '2026-10-23', amountMinor: 200 });
    await entries.create({
      ...ENTRY,
      occurredLocalDate: '2026-09-15',
      amountMinor: 300,
      categoryId: 'cat_food',
    });

    const byDate = await entries.list({
      fromLocalDate: '2026-10-01',
      toLocalDate: '2026-10-23',
      currency: 'EUR',
    });
    expect(byDate.ok && byDate.value).toHaveLength(2);

    const byCategory = await entries.list({ categoryIds: ['cat_food'] });
    expect(byCategory.ok && byCategory.value).toHaveLength(1);

    const ascending = await entries.list({ order: 'occurred_asc' });
    expect(ascending.ok && ascending.value[0]!.occurredLocalDate).toBe('2026-09-15');

    const descending = await entries.list();
    expect(descending.ok && descending.value[0]!.occurredLocalDate).toBe('2026-10-23');

    const paged = await entries.list({ limit: 1, offset: 1, order: 'occurred_asc' });
    expect(paged.ok && paged.value).toHaveLength(1);
    expect(paged.ok && paged.value[0]!.occurredLocalDate).toBe('2026-10-01');

    const sumRange = await entries.sum({
      fromLocalDate: '2026-10-01',
      toLocalDate: '2026-10-31',
    });
    expect(sumRange).toEqual({ ok: true, value: 300 });

    await driver.close();
  });

  it('actualiza y elimina', async () => {
    const { driver, db } = await setup();
    const { entries } = db.repositories;

    const created = await entries.create(ENTRY);
    if (!created.ok) throw new Error('no creado');

    const updated = await entries.update(created.value.id, {
      amountMinor: 300,
      note: 'Café en casa',
    });
    expect(updated.ok).toBe(true);
    if (updated.ok) {
      expect(updated.value.amountMinor).toBe(300);
      expect(updated.value.note).toBe('Café en casa');
    }

    const removed = await entries.remove(created.value.id);
    expect(removed.ok).toBe(true);
    expect(await entries.getById(created.value.id)).toEqual({ ok: true, value: null });
    expect((await entries.remove(created.value.id)).ok).toBe(false);

    await driver.close();
  });

  it('rechaza importes inválidos y categorías inexistentes', async () => {
    const { driver, db } = await setup();
    const { entries } = db.repositories;

    const zero = await entries.create({ ...ENTRY, amountMinor: 0 });
    expect(zero.ok).toBe(false);
    if (!zero.ok) expect(zero.error.code).toBe('VALIDATION');

    const missingCategory = await entries.create({ ...ENTRY, categoryId: 'cat_unknown' });
    expect(missingCategory.ok).toBe(false);
    if (!missingCategory.ok) expect(missingCategory.error.code).toBe('VALIDATION');

    expect(await entries.count()).toEqual({ ok: true, value: 0 });
    await driver.close();
  });
});

describe('repositorio de objetivos', () => {
  const goal = {
    title: 'Viaje',
    targetAmountMinor: 50000,
    currency: 'EUR',
    startDate: '2026-10-01',
    targetDate: null,
  };

  it('mantiene un único objetivo activo', async () => {
    const { driver, db } = await setup();
    const { goals } = db.repositories;

    const first = await goals.create(goal);
    const second = await goals.create({ ...goal, title: 'Bicicleta' });
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);

    const active = await goals.getActive();
    expect(active.ok && active.value?.title).toBe('Bicicleta');

    const all = await goals.list();
    expect(all.ok && all.value.filter((g) => g.isActive)).toHaveLength(1);

    await driver.close();
  });

  it('valida la fecha objetivo y permite activar otro objetivo', async () => {
    const { driver, db } = await setup();
    const { goals } = db.repositories;

    const created = await goals.create(goal);
    if (!created.ok) throw new Error('no creado');

    const invalidDate = await goals.update(created.value.id, { targetDate: '2026-09-01' });
    expect(invalidDate.ok).toBe(false);

    const second = await goals.create({ ...goal, title: 'Segundo', isActive: false });
    if (!second.ok) throw new Error('no creado');

    const activated = await goals.setActive(second.value.id);
    expect(activated.ok).toBe(true);

    const active = await goals.getActive();
    expect(active.ok && active.value?.id).toBe(second.value.id);

    await driver.close();
  });
});

describe('perfil y restablecimiento', () => {
  it('bloquea el cambio de moneda si hay registros', async () => {
    const { driver, db } = await setup();
    await db.repositories.entries.create(ENTRY);

    const blocked = await db.repositories.profile.update({ preferredCurrency: 'USD' });
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.error.field).toBe('preferredCurrency');

    await driver.close();
  });

  it('permite cambiar de moneda sin registros', async () => {
    const { driver, db } = await setup();
    const updated = await db.repositories.profile.update({
      preferredCurrency: 'USD',
      onboardingCompleted: true,
      weekStartsOn: 0,
    });
    expect(updated.ok).toBe(true);
    if (updated.ok) {
      expect(updated.value.preferredCurrency).toBe('USD');
      expect(updated.value.onboardingCompleted).toBe(true);
      expect(updated.value.weekStartsOn).toBe(0);
    }
    await driver.close();
  });

  it('restablece registros y objetivos conservando el perfil', async () => {
    const { driver, db } = await setup();
    await db.repositories.entries.create(ENTRY);
    await db.repositories.goals.create({
      title: 'Objetivo',
      targetAmountMinor: 1000,
      currency: 'EUR',
      startDate: '2026-10-01',
      targetDate: null,
    });

    const reset = await db.repositories.profile.resetLocalData();
    expect(reset.ok).toBe(true);

    expect(await db.repositories.entries.count()).toEqual({ ok: true, value: 0 });
    const goals = await db.repositories.goals.list();
    expect(goals.ok && goals.value).toHaveLength(0);
    expect((await db.repositories.profile.get()).ok).toBe(true);

    await driver.close();
  });
});

describe('persistencia', () => {
  it('conserva los datos al cerrar y reabrir la base', async () => {
    const { driver, db } = await setup();
    const created = await db.repositories.entries.create({
      ...ENTRY,
      note: 'Nota persistente',
    });
    expect(created.ok).toBe(true);

    const bytes = driver.exportBytes();
    await driver.close();

    const reopened = await openSqlJsDatabase(bytes);
    const result = await initializeDatabase({
      driver: reopened,
      newId: () => 'reopen-id',
      now: () => new Date('2026-10-24T10:00:00.000Z'),
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error.message);

    const entries = await result.value.repositories.entries.list();
    expect(entries.ok).toBe(true);
    if (entries.ok) {
      expect(entries.value).toHaveLength(1);
      expect(entries.value[0]!.note).toBe('Nota persistente');
    }

    const migrations = await reopened.all('SELECT version FROM schema_migrations');
    expect(migrations).toHaveLength(1);

    await reopened.close();
  });

  it('revierte una transacción fallida', async () => {
    const driver = await openSqlJsDatabase();
    await driver.exec('CREATE TABLE prueba (id INTEGER PRIMARY KEY)');

    await expect(
      driver.transaction(async (tx) => {
        await tx.run('INSERT INTO prueba (id) VALUES (1)');
        throw new Error('fallo simulado');
      }),
    ).rejects.toThrow('fallo simulado');

    const rows = await driver.all('SELECT id FROM prueba');
    expect(rows).toHaveLength(0);
    await driver.close();
  });
});
