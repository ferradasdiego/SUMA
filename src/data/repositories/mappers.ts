import type { Category, Entry, Goal, UserProfile } from '@/domain/entities/types';
import { DEFAULT_QUICK_AMOUNTS_MINOR } from '@/domain/preferences/quickAmounts';
import { DEFAULT_SKIN, isSkinId } from '@/domain/preferences/skin';
import { err, ok, storageError, type Result } from '@/domain/errors/result';
import {
  categorySchema,
  entrySchema,
  firstIssueMessage,
  goalSchema,
  profileSchema,
  quickAmountsSchema,
} from '@/domain/validation/schemas';

export interface EntryRow {
  readonly id: string;
  readonly amount_minor: number;
  readonly currency: string;
  readonly category_id: string;
  readonly note: string | null;
  readonly occurred_at_utc: string;
  readonly occurred_local_date: string;
  readonly occurred_tz: string;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface CategoryRow {
  readonly id: string;
  readonly name_key: string;
  readonly icon: string;
  readonly color_token: string;
  readonly is_default: number;
  readonly is_active: number;
  readonly sort_order: number;
}

export interface GoalRow {
  readonly id: string;
  readonly title: string;
  readonly target_amount_minor: number;
  readonly currency: string;
  readonly start_date: string;
  readonly target_date: string | null;
  readonly is_active: number;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface ProfileRow {
  readonly id: string;
  readonly display_name: string | null;
  readonly preferred_currency: string;
  readonly locale: string;
  readonly week_starts_on: number;
  readonly onboarding_completed: number;
  readonly skin: string | null;
  readonly quick_amounts_minor: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export function rowToEntry(row: EntryRow): Result<Entry> {
  const parsed = entrySchema.safeParse({
    id: row.id,
    amountMinor: Number(row.amount_minor),
    currency: row.currency,
    categoryId: row.category_id,
    note: row.note,
    occurredAtUtc: row.occurred_at_utc,
    occurredLocalDate: row.occurred_local_date,
    occurredTz: row.occurred_tz,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });

  if (!parsed.success) {
    return err(
      storageError('Registro inválido en la base de datos: ' + firstIssueMessage(parsed.error)),
    );
  }
  return ok(parsed.data);
}

export function rowToCategory(row: CategoryRow): Result<Category> {
  const parsed = categorySchema.safeParse({
    id: row.id,
    nameKey: row.name_key,
    icon: row.icon,
    colorToken: row.color_token,
    isDefault: row.is_default === 1,
    isActive: row.is_active === 1,
    sortOrder: Number(row.sort_order),
  });

  if (!parsed.success) {
    return err(
      storageError('Categoría inválida en la base de datos: ' + firstIssueMessage(parsed.error)),
    );
  }
  return ok(parsed.data);
}

export function rowToGoal(row: GoalRow): Result<Goal> {
  const parsed = goalSchema.safeParse({
    id: row.id,
    title: row.title,
    targetAmountMinor: Number(row.target_amount_minor),
    currency: row.currency,
    startDate: row.start_date,
    targetDate: row.target_date,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });

  if (!parsed.success) {
    return err(
      storageError('Objetivo inválido en la base de datos: ' + firstIssueMessage(parsed.error)),
    );
  }
  return ok(parsed.data);
}

function parseQuickAmounts(raw: string | null): readonly number[] {
  if (!raw) return DEFAULT_QUICK_AMOUNTS_MINOR;

  try {
    const parsed = quickAmountsSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : DEFAULT_QUICK_AMOUNTS_MINOR;
  } catch {
    return DEFAULT_QUICK_AMOUNTS_MINOR;
  }
}

export function rowToProfile(row: ProfileRow): Result<UserProfile> {
  const parsed = profileSchema.safeParse({
    id: row.id,
    displayName: row.display_name,
    preferredCurrency: row.preferred_currency,
    locale: row.locale,
    weekStartsOn: row.week_starts_on === 0 ? 0 : 1,
    onboardingCompleted: row.onboarding_completed === 1,
    skin: isSkinId(row.skin) ? row.skin : DEFAULT_SKIN,
    quickAmountsMinor: parseQuickAmounts(row.quick_amounts_minor),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });

  if (!parsed.success) {
    return err(
      storageError('Perfil inválido en la base de datos: ' + firstIssueMessage(parsed.error)),
    );
  }
  return ok(parsed.data);
}
