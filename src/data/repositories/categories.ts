import { rowToCategory, type CategoryRow } from '@/data/repositories/mappers';
import type { CategoryRepository, RepositoryContext } from '@/data/repositories/types';
import type { Category } from '@/domain/entities/types';
import { err, ok, storageError, type Result } from '@/domain/errors/result';

const COLUMNS = 'id, name_key, icon, color_token, is_default, is_active, sort_order';

export function createCategoryRepository(ctx: RepositoryContext): CategoryRepository {
  const list = async (includeInactive = false): Promise<Result<readonly Category[]>> => {
    try {
      const rows = await ctx.driver.all<CategoryRow>(
        'SELECT ' +
          COLUMNS +
          ' FROM categories' +
          (includeInactive ? '' : ' WHERE is_active = 1') +
          ' ORDER BY sort_order ASC, id ASC',
      );

      const categories: Category[] = [];
      for (const row of rows) {
        const mapped = rowToCategory(row);
        if (!mapped.ok) return err(mapped.error);
        categories.push(mapped.value);
      }
      return ok(categories);
    } catch (error) {
      return err(storageError('No se pudieron leer las categorías', error));
    }
  };

  const getById = async (id: string): Promise<Result<Category | null>> => {
    try {
      const rows = await ctx.driver.all<CategoryRow>(
        'SELECT ' + COLUMNS + ' FROM categories WHERE id = ?',
        [id],
      );
      if (rows.length === 0) return ok(null);
      return rowToCategory(rows[0]!);
    } catch (error) {
      return err(storageError('No se pudo leer la categoría', error));
    }
  };

  return { list, getById };
}
