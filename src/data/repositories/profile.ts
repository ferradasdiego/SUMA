import { rowToProfile, type ProfileRow } from '@/data/repositories/mappers';
import type { ProfileRepository, RepositoryContext } from '@/data/repositories/types';
import type { ProfilePatch, UserProfile } from '@/domain/entities/types';
import {
  err,
  notFoundError,
  ok,
  storageError,
  validationError,
  type Result,
} from '@/domain/errors/result';
import { DEFAULT_CURRENCY, DEFAULT_LOCALE, DEFAULT_WEEK_STARTS_ON } from '@/domain/money/currency';
import { DEFAULT_QUICK_AMOUNTS_MINOR } from '@/domain/preferences/quickAmounts';
import { DEFAULT_SKIN } from '@/domain/preferences/skin';
import {
  firstIssueField,
  firstIssueMessage,
  profilePatchSchema,
  profileSchema,
} from '@/domain/validation/schemas';

export const LOCAL_PROFILE_ID = 'local';

const COLUMNS =
  'id, display_name, preferred_currency, locale, week_starts_on, onboarding_completed, skin, quick_amounts_minor, created_at, updated_at';

export function createProfileRepository(ctx: RepositoryContext): ProfileRepository {
  const get = async (): Promise<Result<UserProfile>> => {
    try {
      const rows = await ctx.driver.all<ProfileRow>(
        'SELECT ' + COLUMNS + ' FROM user_profile WHERE id = ?',
        [LOCAL_PROFILE_ID],
      );
      if (rows.length === 0) {
        return err(notFoundError('El perfil local no existe'));
      }
      const mapped = rowToProfile(rows[0]!);
      return mapped;
    } catch (error) {
      return err(storageError('No se pudo leer el perfil', error));
    }
  };

  const ensureExists = async (): Promise<Result<UserProfile>> => {
    const timestamp = ctx.now().toISOString();
    try {
      await ctx.driver.run(
        'INSERT OR IGNORE INTO user_profile (id, display_name, preferred_currency, locale, week_starts_on, onboarding_completed, skin, quick_amounts_minor, created_at, updated_at) ' +
          'VALUES (?, NULL, ?, ?, ?, 0, ?, ?, ?, ?)',
        [
          LOCAL_PROFILE_ID,
          DEFAULT_CURRENCY,
          DEFAULT_LOCALE,
          DEFAULT_WEEK_STARTS_ON,
          DEFAULT_SKIN,
          JSON.stringify(DEFAULT_QUICK_AMOUNTS_MINOR),
          timestamp,
          timestamp,
        ],
      );
    } catch (error) {
      return err(storageError('No se pudo preparar el perfil', error));
    }
    return get();
  };

  const update = async (patch: ProfilePatch): Promise<Result<UserProfile>> => {
    const parsedPatch = profilePatchSchema.safeParse(patch);
    if (!parsedPatch.success) {
      return err(
        validationError(firstIssueMessage(parsedPatch.error), firstIssueField(parsedPatch.error)),
      );
    }

    const existing = await get();
    if (!existing.ok) return err(existing.error);
    const current = existing.value;

    if (
      parsedPatch.data.preferredCurrency !== undefined &&
      parsedPatch.data.preferredCurrency !== current.preferredCurrency
    ) {
      try {
        const rows = await ctx.driver.all<{ entries: number; goals: number }>(
          'SELECT (SELECT COUNT(*) FROM entries) AS entries, (SELECT COUNT(*) FROM goals) AS goals',
        );
        const entries = Number(rows[0]?.entries ?? 0);
        const goals = Number(rows[0]?.goals ?? 0);
        if (entries > 0 || goals > 0) {
          return err(
            validationError(
              'No puedes cambiar de moneda mientras existan registros u objetivos. Exporta y restablece los datos.',
              'preferredCurrency',
            ),
          );
        }
      } catch (error) {
        return err(storageError('No se pudo comprobar la moneda', error));
      }
    }

    const timestamp = ctx.now().toISOString();
    const candidate: UserProfile = {
      ...current,
      displayName:
        parsedPatch.data.displayName === undefined
          ? current.displayName
          : parsedPatch.data.displayName,
      preferredCurrency: parsedPatch.data.preferredCurrency ?? current.preferredCurrency,
      locale: parsedPatch.data.locale ?? current.locale,
      weekStartsOn: parsedPatch.data.weekStartsOn ?? current.weekStartsOn,
      onboardingCompleted: parsedPatch.data.onboardingCompleted ?? current.onboardingCompleted,
      skin: parsedPatch.data.skin ?? current.skin,
      quickAmountsMinor: parsedPatch.data.quickAmountsMinor ?? current.quickAmountsMinor,
      updatedAt: timestamp,
    };

    const validated = profileSchema.safeParse(candidate);
    if (!validated.success) {
      return err(
        validationError(firstIssueMessage(validated.error), firstIssueField(validated.error)),
      );
    }

    try {
      await ctx.driver.run(
        'UPDATE user_profile SET display_name = ?, preferred_currency = ?, locale = ?, week_starts_on = ?, onboarding_completed = ?, skin = ?, quick_amounts_minor = ?, updated_at = ? WHERE id = ?',
        [
          candidate.displayName,
          candidate.preferredCurrency,
          candidate.locale,
          candidate.weekStartsOn,
          candidate.onboardingCompleted ? 1 : 0,
          candidate.skin,
          JSON.stringify(candidate.quickAmountsMinor),
          timestamp,
          LOCAL_PROFILE_ID,
        ],
      );
    } catch (error) {
      return err(storageError('No se pudo actualizar el perfil', error));
    }

    return ok(candidate);
  };

  const resetLocalData = async (): Promise<Result<void>> => {
    try {
      await ctx.driver.transaction(async (tx) => {
        await tx.run('DELETE FROM entries');
        await tx.run('DELETE FROM goals');
      });
      return ok(undefined);
    } catch (error) {
      return err(storageError('No se pudieron restablecer los datos', error));
    }
  };

  return { get, update, ensureExists, resetLocalData };
}
