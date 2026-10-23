import type { SqlDriver } from '@/data/local/driver';
import { err, migrationError, ok, type Result } from '@/domain/errors/result';

import { migration001 } from './001_initial';
import type { Migration } from './types';

export const MIGRATIONS: readonly Migration[] = [migration001];

export async function migrate(driver: SqlDriver): Promise<Result<void>> {
  try {
    await driver.exec('PRAGMA foreign_keys = ON;');
    await driver.exec(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version    INTEGER PRIMARY KEY,
        name       TEXT NOT NULL,
        applied_at TEXT NOT NULL
      );
    `);

    const applied = await driver.all<{ version: number }>('SELECT version FROM schema_migrations');
    const appliedVersions = new Set(applied.map((row) => Number(row.version)));

    for (const migration of MIGRATIONS) {
      if (appliedVersions.has(migration.version)) continue;

      await driver.transaction(async (tx) => {
        await migration.up(tx);
        await tx.run('INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)', [
          migration.version,
          migration.name,
          new Date().toISOString(),
        ]);
      });
    }

    return ok(undefined);
  } catch (error) {
    return err(migrationError('No se pudo preparar la base de datos', error));
  }
}
