import type { Migration } from './types';

const SEED_DATE = '2026-10-23T00:00:00.000Z';

export const migration001: Migration = {
  version: 1,
  name: 'initial_schema',
  async up(db) {
    await db.exec(`
      CREATE TABLE user_profile (
        id                   TEXT PRIMARY KEY,
        display_name         TEXT,
        preferred_currency   TEXT NOT NULL DEFAULT 'EUR' CHECK (length(preferred_currency) = 3),
        locale               TEXT NOT NULL DEFAULT 'es-ES',
        week_starts_on       INTEGER NOT NULL DEFAULT 1 CHECK (week_starts_on IN (0, 1)),
        onboarding_completed INTEGER NOT NULL DEFAULT 0 CHECK (onboarding_completed IN (0, 1)),
        created_at           TEXT NOT NULL,
        updated_at           TEXT NOT NULL
      );

      CREATE TABLE categories (
        id          TEXT PRIMARY KEY,
        user_id     TEXT,
        name_key    TEXT NOT NULL,
        icon        TEXT NOT NULL,
        color_token TEXT NOT NULL,
        is_default  INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1)),
        is_active   INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
        sort_order  INTEGER NOT NULL DEFAULT 0,
        created_at  TEXT NOT NULL
      );

      CREATE TABLE entries (
        id                   TEXT PRIMARY KEY,
        user_id              TEXT,
        amount_minor         INTEGER NOT NULL CHECK (amount_minor > 0 AND amount_minor <= 100000000),
        currency             TEXT NOT NULL CHECK (length(currency) = 3),
        category_id          TEXT NOT NULL REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
        note                 TEXT CHECK (note IS NULL OR length(note) <= 280),
        occurred_at_utc      TEXT NOT NULL,
        occurred_local_date  TEXT NOT NULL CHECK (occurred_local_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
        occurred_tz          TEXT NOT NULL,
        created_at           TEXT NOT NULL,
        updated_at           TEXT NOT NULL
      );

      CREATE INDEX idx_entries_local_date ON entries (occurred_local_date DESC);
      CREATE INDEX idx_entries_category_local_date ON entries (category_id, occurred_local_date DESC);

      CREATE TABLE goals (
        id                  TEXT PRIMARY KEY,
        user_id             TEXT,
        title               TEXT NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 80),
        target_amount_minor INTEGER NOT NULL CHECK (target_amount_minor > 0 AND target_amount_minor <= 1000000000),
        currency            TEXT NOT NULL CHECK (length(currency) = 3),
        start_date          TEXT NOT NULL,
        target_date         TEXT,
        is_active           INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
        created_at          TEXT NOT NULL,
        updated_at          TEXT NOT NULL,
        CHECK (target_date IS NULL OR target_date >= start_date)
      );

      CREATE UNIQUE INDEX idx_goals_single_active ON goals (is_active) WHERE is_active = 1;

      INSERT INTO categories (id, user_id, name_key, icon, color_token, is_default, is_active, sort_order, created_at) VALUES
        ('cat_coffee', NULL, 'category.coffee', 'cafe-outline', 'amber', 1, 1, 10, '${SEED_DATE}'),
        ('cat_food', NULL, 'category.food', 'restaurant-outline', 'green', 1, 1, 20, '${SEED_DATE}'),
        ('cat_shopping', NULL, 'category.shopping', 'bag-handle-outline', 'rose', 1, 1, 30, '${SEED_DATE}'),
        ('cat_transport', NULL, 'category.transport', 'bus-outline', 'blue', 1, 1, 40, '${SEED_DATE}'),
        ('cat_leisure', NULL, 'category.leisure', 'ticket-outline', 'violet', 1, 1, 50, '${SEED_DATE}'),
        ('cat_subscriptions', NULL, 'category.subscriptions', 'repeat-outline', 'slate', 1, 1, 60, '${SEED_DATE}'),
        ('cat_other', NULL, 'category.other', 'ellipsis-horizontal-circle-outline', 'stone', 1, 1, 70, '${SEED_DATE}');
    `);
  },
};
