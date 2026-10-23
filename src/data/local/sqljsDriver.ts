import path from 'node:path';

import initSqlJs from 'sql.js';

import type { SqlDriver, SqlValue } from './driver';

type SqlJsStatic = Awaited<ReturnType<typeof initSqlJs>>;
type SqlJsDatabase = InstanceType<SqlJsStatic['Database']>;

export interface SqlJsDriver extends SqlDriver {
  exportBytes(): Uint8Array;
}

/**
 * Driver SQLite en memoria para pruebas. Exporta los bytes para simular
 * el cierre y la reapertura de la base de datos en el dispositivo.
 */
export async function openSqlJsDatabase(initialBytes?: Uint8Array): Promise<SqlJsDriver> {
  const wasmPath = path.join(path.dirname(require.resolve('sql.js')), 'sql-wasm.wasm');
  const SQL = await initSqlJs({ locateFile: () => wasmPath });
  const db: SqlJsDatabase = initialBytes ? new SQL.Database(initialBytes) : new SQL.Database();

  const driver: SqlJsDriver = {
    async exec(sql: string): Promise<void> {
      db.run(sql);
    },

    async run(sql: string, params: readonly SqlValue[] = []): Promise<{ changes: number }> {
      db.run(sql, params as SqlValue[]);
      return { changes: db.getRowsModified() };
    },

    async all<T>(sql: string, params: readonly SqlValue[] = []): Promise<readonly T[]> {
      const statement = db.prepare(sql);
      try {
        statement.bind(params as SqlValue[]);
        const rows: T[] = [];
        while (statement.step()) {
          rows.push(statement.getAsObject() as T);
        }
        return rows;
      } finally {
        statement.free();
      }
    },

    async transaction<T>(fn: (tx: SqlDriver) => Promise<T>): Promise<T> {
      db.run('BEGIN');
      try {
        const result = await fn(driver);
        db.run('COMMIT');
        return result;
      } catch (error) {
        db.run('ROLLBACK');
        throw error;
      }
    },

    async close(): Promise<void> {
      db.close();
    },

    exportBytes(): Uint8Array {
      return db.export();
    },
  };

  return driver;
}
