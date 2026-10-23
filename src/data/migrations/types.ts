import type { SqlDriver } from '@/data/local/driver';

export interface Migration {
  readonly version: number;
  readonly name: string;
  readonly up: (db: SqlDriver) => Promise<void>;
}
