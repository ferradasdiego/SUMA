import type { Migration } from './types';

export const migration003: Migration = {
  version: 3,
  name: 'skin',
  async up(db) {
    await db.exec("ALTER TABLE user_profile ADD COLUMN skin TEXT NOT NULL DEFAULT 'classic';");
  },
};
