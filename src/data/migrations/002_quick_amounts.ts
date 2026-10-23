import type { Migration } from './types';

export const migration002: Migration = {
  version: 2,
  name: 'quick_amounts',
  async up(db) {
    await db.exec(
      "ALTER TABLE user_profile ADD COLUMN quick_amounts_minor TEXT NOT NULL DEFAULT '[150,250,500,1000]';",
    );
  },
};
