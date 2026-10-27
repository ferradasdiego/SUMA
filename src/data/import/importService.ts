import { err, ok, storageError, validationError, type Result } from '@/domain/errors/result';
import type { ExportPayload } from '@/data/export/exportData';
import type { SqlDriver } from '@/data/local/driver';

export type ImportMode = 'merge' | 'replace';

export interface ImportSummary {
  readonly mode: ImportMode;
  readonly importedEntries: number;
  readonly skippedEntries: number;
  readonly importedGoals: number;
  readonly skippedGoals: number;
  readonly importedCategories: number;
}

export interface ImportContext {
  readonly driver: SqlDriver;
  readonly now: () => Date;
}

interface ProfileRow {
  readonly preferred_currency: string;
}

async function merge(ctx: ImportContext, payload: ExportPayload): Promise<Result<ImportSummary>> {
  // La fusión nunca modifica el perfil local: conserva su skin y preferencias.
  const profiles = await ctx.driver.all<ProfileRow>(
    'SELECT preferred_currency FROM user_profile WHERE id = ?',
    ['local'],
  );
  if (profiles.length === 0) {
    return err(validationError('No existe un perfil local para fusionar', 'file'));
  }
  if (profiles[0]!.preferred_currency !== payload.profile.preferredCurrency) {
    return err(
      validationError('La copia usa otra moneda. Usa Reemplazar para cambiar de moneda.', 'file'),
    );
  }

  let importedCategories = 0;
  let importedEntries = 0;
  let skippedEntries = 0;
  let importedGoals = 0;
  let skippedGoals = 0;

  await ctx.driver.transaction(async (tx) => {
    for (const category of payload.categories) {
      const result = await tx.run(
        'INSERT OR IGNORE INTO categories (id, user_id, name_key, icon, color_token, is_default, is_active, sort_order, created_at) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?)',
        [
          category.id,
          category.nameKey,
          category.icon,
          category.colorToken,
          category.isDefault ? 1 : 0,
          category.isActive ? 1 : 0,
          category.sortOrder,
          ctx.now().toISOString(),
        ],
      );
      importedCategories += result.changes;
    }

    for (const entry of payload.entries) {
      const result = await tx.run(
        'INSERT OR IGNORE INTO entries (id, user_id, amount_minor, currency, category_id, note, occurred_at_utc, occurred_local_date, occurred_tz, created_at, updated_at) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          entry.id,
          entry.amountMinor,
          entry.currency,
          entry.categoryId,
          entry.note,
          entry.occurredAtUtc,
          entry.occurredLocalDate,
          entry.occurredTz,
          entry.createdAt,
          entry.updatedAt,
        ],
      );
      if (result.changes > 0) importedEntries += 1;
      else skippedEntries += 1;
    }

    const active = await tx.all<{ total: number }>(
      'SELECT COUNT(*) AS total FROM goals WHERE is_active = 1',
    );
    let hasActiveGoal = Number(active[0]?.total ?? 0) > 0;

    for (const goal of payload.goals) {
      const existing = await tx.all<{ id: string }>('SELECT id FROM goals WHERE id = ?', [goal.id]);
      if (existing.length > 0) {
        skippedGoals += 1;
        continue;
      }

      const activeForImport = goal.isActive && !hasActiveGoal;
      await tx.run(
        'INSERT INTO goals (id, user_id, title, target_amount_minor, currency, start_date, target_date, is_active, created_at, updated_at) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          goal.id,
          goal.title,
          goal.targetAmountMinor,
          goal.currency,
          goal.startDate,
          goal.targetDate,
          activeForImport ? 1 : 0,
          goal.createdAt,
          goal.updatedAt,
        ],
      );
      importedGoals += 1;
      if (activeForImport) hasActiveGoal = true;
    }
  });

  return ok({
    mode: 'merge',
    importedEntries,
    skippedEntries,
    importedGoals,
    skippedGoals,
    importedCategories,
  });
}

async function replace(ctx: ImportContext, payload: ExportPayload): Promise<Result<ImportSummary>> {
  const timestamp = ctx.now().toISOString();

  await ctx.driver.transaction(async (tx) => {
    await tx.run('DELETE FROM entries');
    await tx.run('DELETE FROM goals');
    await tx.run('DELETE FROM categories');
    await tx.run('DELETE FROM user_profile');

    await tx.run(
      'INSERT INTO user_profile (id, display_name, preferred_currency, locale, week_starts_on, onboarding_completed, skin, quick_amounts_minor, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'local',
        payload.profile.displayName,
        payload.profile.preferredCurrency,
        payload.profile.locale,
        payload.profile.weekStartsOn,
        payload.profile.onboardingCompleted ? 1 : 0,
        payload.profile.skin,
        JSON.stringify(payload.profile.quickAmountsMinor),
        timestamp,
        timestamp,
      ],
    );

    for (const category of payload.categories) {
      await tx.run(
        'INSERT INTO categories (id, user_id, name_key, icon, color_token, is_default, is_active, sort_order, created_at) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?)',
        [
          category.id,
          category.nameKey,
          category.icon,
          category.colorToken,
          category.isDefault ? 1 : 0,
          category.isActive ? 1 : 0,
          category.sortOrder,
          timestamp,
        ],
      );
    }

    for (const entry of payload.entries) {
      await tx.run(
        'INSERT INTO entries (id, user_id, amount_minor, currency, category_id, note, occurred_at_utc, occurred_local_date, occurred_tz, created_at, updated_at) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          entry.id,
          entry.amountMinor,
          entry.currency,
          entry.categoryId,
          entry.note,
          entry.occurredAtUtc,
          entry.occurredLocalDate,
          entry.occurredTz,
          entry.createdAt,
          entry.updatedAt,
        ],
      );
    }

    for (const goal of payload.goals) {
      await tx.run(
        'INSERT INTO goals (id, user_id, title, target_amount_minor, currency, start_date, target_date, is_active, created_at, updated_at) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          goal.id,
          goal.title,
          goal.targetAmountMinor,
          goal.currency,
          goal.startDate,
          goal.targetDate,
          goal.isActive ? 1 : 0,
          goal.createdAt,
          goal.updatedAt,
        ],
      );
    }
  });

  return ok({
    mode: 'replace',
    importedEntries: payload.entries.length,
    skippedEntries: 0,
    importedGoals: payload.goals.length,
    skippedGoals: 0,
    importedCategories: payload.categories.length,
  });
}

/** Importa una copia validada. Cualquier fallo revierte la transacción completa. */
export async function importData(
  ctx: ImportContext,
  payload: ExportPayload,
  mode: ImportMode,
): Promise<Result<ImportSummary>> {
  try {
    return mode === 'merge' ? await merge(ctx, payload) : await replace(ctx, payload);
  } catch (error) {
    return err(storageError('No se pudieron importar los datos', error));
  }
}
