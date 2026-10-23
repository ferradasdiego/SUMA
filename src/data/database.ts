import { migrate } from '@/data/migrations';
import { createCategoryRepository } from '@/data/repositories/categories';
import { createEntryRepository } from '@/data/repositories/entries';
import { createGoalRepository } from '@/data/repositories/goals';
import { createProfileRepository } from '@/data/repositories/profile';
import type { DatabaseContext, Repositories, RepositoryContext } from '@/data/repositories/types';
import { err, ok, type Result } from '@/domain/errors/result';

export function createRepositories(ctx: RepositoryContext): Repositories {
  return {
    entries: createEntryRepository(ctx),
    categories: createCategoryRepository(ctx),
    goals: createGoalRepository(ctx),
    profile: createProfileRepository(ctx),
  };
}

/**
 * Aplica migraciones, crea los repositorios y garantiza el perfil local.
 * Se llama una vez al arrancar; cualquier fallo deja la app en estado controlado.
 */
export async function initializeDatabase(ctx: RepositoryContext): Promise<Result<DatabaseContext>> {
  const migrated = await migrate(ctx.driver);
  if (!migrated.ok) return err(migrated.error);

  const repositories = createRepositories(ctx);
  const profile = await repositories.profile.ensureExists();
  if (!profile.ok) return err(profile.error);

  return ok({ ...ctx, repositories });
}
