import * as SQLite from 'expo-sqlite';

import type { SqlDriver, SqlValue } from './driver';

/**
 * Conexión SQLite real del dispositivo. Se abre una sola vez al arrancar.
 */
export async function openExpoDatabase(name = 'suma.db'): Promise<SqlDriver> {
  const db = await SQLite.openDatabaseAsync(name);
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  const driver: SqlDriver = {
    exec: (sql: string) => db.execAsync(sql),

    run: async (sql: string, params: readonly SqlValue[] = []) => {
      const result = await db.runAsync(sql, params as SQLite.SQLiteBindValue[]);
      return { changes: result.changes };
    },

    all: async <T>(sql: string, params: readonly SqlValue[] = []) =>
      (await db.getAllAsync<T>(sql, params as SQLite.SQLiteBindValue[])) as readonly T[],

    transaction: async <T>(fn: (tx: SqlDriver) => Promise<T>) => {
      let result!: T;
      await db.withTransactionAsync(async () => {
        result = await fn(driver);
      });
      return result;
    },

    close: () => db.closeAsync(),
  };

  return driver;
}
