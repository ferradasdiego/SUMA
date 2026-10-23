import type { SqlValue } from '@/data/local/driver';
import { rowToEntry, type EntryRow } from '@/data/repositories/mappers';
import type { EntryQuery, EntryRepository, RepositoryContext } from '@/data/repositories/types';
import type { Entry, EntryPatch, NewEntry } from '@/domain/entities/types';
import {
  conflictError,
  err,
  notFoundError,
  ok,
  storageError,
  validationError,
  type AppError,
  type Result,
} from '@/domain/errors/result';
import { isLocalDate } from '@/domain/time/calendar';
import { firstIssueField, firstIssueMessage, newEntrySchema } from '@/domain/validation/schemas';

const COLUMNS =
  'id, amount_minor, currency, category_id, note, occurred_at_utc, occurred_local_date, occurred_tz, created_at, updated_at';

function storeError(error: unknown): AppError {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('FOREIGN KEY')) {
    return validationError('La categoría seleccionada no existe', 'categoryId');
  }
  if (message.includes('UNIQUE')) {
    return conflictError('El registro ya existe');
  }
  return storageError('No se pudo acceder a los registros', error);
}

function buildWhere(query: EntryQuery = {}): Result<{ clause: string; params: SqlValue[] }> {
  const clauses: string[] = [];
  const params: SqlValue[] = [];

  if (query.fromLocalDate !== undefined) {
    if (!isLocalDate(query.fromLocalDate)) {
      return err(validationError('Fecha inicial inválida', 'fromLocalDate'));
    }
    clauses.push('occurred_local_date >= ?');
    params.push(query.fromLocalDate);
  }

  if (query.toLocalDate !== undefined) {
    if (!isLocalDate(query.toLocalDate)) {
      return err(validationError('Fecha final inválida', 'toLocalDate'));
    }
    clauses.push('occurred_local_date <= ?');
    params.push(query.toLocalDate);
  }

  if (query.categoryIds && query.categoryIds.length > 0) {
    clauses.push('category_id IN (' + query.categoryIds.map(() => '?').join(', ') + ')');
    params.push(...query.categoryIds);
  }

  if (query.currency !== undefined) {
    clauses.push('currency = ?');
    params.push(query.currency);
  }

  return ok({
    clause: clauses.length > 0 ? ' WHERE ' + clauses.join(' AND ') : '',
    params,
  });
}

export function createEntryRepository(ctx: RepositoryContext): EntryRepository {
  const getById = async (id: string): Promise<Result<Entry | null>> => {
    try {
      const rows = await ctx.driver.all<EntryRow>(
        'SELECT ' + COLUMNS + ' FROM entries WHERE id = ?',
        [id],
      );
      if (rows.length === 0) return ok(null);
      return rowToEntry(rows[0]!);
    } catch (error) {
      return err(storageError('No se pudo leer el registro', error));
    }
  };

  const create = async (input: NewEntry): Promise<Result<Entry>> => {
    const parsed = newEntrySchema.safeParse(input);
    if (!parsed.success) {
      return err(
        validationError(firstIssueMessage(parsed.error), firstIssueField(parsed.error), {
          issues: parsed.error.issues,
        }),
      );
    }

    const timestamp = ctx.now().toISOString();
    const entry: Entry = {
      ...parsed.data,
      id: ctx.newId(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    try {
      await ctx.driver.run(
        'INSERT INTO entries (id, user_id, amount_minor, currency, category_id, note, occurred_at_utc, occurred_local_date, occurred_tz, created_at, updated_at) ' +
          'VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
    } catch (error) {
      return err(storeError(error));
    }

    return ok(entry);
  };

  const update = async (id: string, patch: EntryPatch): Promise<Result<Entry>> => {
    const existing = await getById(id);
    if (!existing.ok) return existing;
    const current = existing.value;
    if (!current) return err(notFoundError('El registro no existe'));

    const candidate = {
      amountMinor: patch.amountMinor ?? current.amountMinor,
      currency: patch.currency ?? current.currency,
      categoryId: patch.categoryId ?? current.categoryId,
      note: patch.note === undefined ? current.note : patch.note,
      occurredAtUtc: patch.occurredAtUtc ?? current.occurredAtUtc,
      occurredLocalDate: patch.occurredLocalDate ?? current.occurredLocalDate,
      occurredTz: patch.occurredTz ?? current.occurredTz,
    };

    if (candidate.currency !== current.currency) {
      return err(validationError('La moneda de un registro no se puede cambiar', 'currency'));
    }

    const parsed = newEntrySchema.safeParse(candidate);
    if (!parsed.success) {
      return err(
        validationError(firstIssueMessage(parsed.error), firstIssueField(parsed.error), {
          issues: parsed.error.issues,
        }),
      );
    }

    const updatedAt = ctx.now().toISOString();
    try {
      await ctx.driver.run(
        'UPDATE entries SET amount_minor = ?, currency = ?, category_id = ?, note = ?, occurred_at_utc = ?, occurred_local_date = ?, occurred_tz = ?, updated_at = ? WHERE id = ?',
        [
          parsed.data.amountMinor,
          parsed.data.currency,
          parsed.data.categoryId,
          parsed.data.note,
          parsed.data.occurredAtUtc,
          parsed.data.occurredLocalDate,
          parsed.data.occurredTz,
          updatedAt,
          id,
        ],
      );
    } catch (error) {
      return err(storeError(error));
    }

    return ok({ ...current, ...parsed.data, updatedAt });
  };

  const remove = async (id: string): Promise<Result<void>> => {
    try {
      const result = await ctx.driver.run('DELETE FROM entries WHERE id = ?', [id]);
      if (result.changes === 0) return err(notFoundError('El registro no existe'));
      return ok(undefined);
    } catch (error) {
      return err(storageError('No se pudo eliminar el registro', error));
    }
  };

  const list = async (query: EntryQuery = {}): Promise<Result<readonly Entry[]>> => {
    if (query.limit !== undefined && (!Number.isInteger(query.limit) || query.limit < 0)) {
      return err(validationError('Límite inválido', 'limit'));
    }
    if (query.offset !== undefined && (!Number.isInteger(query.offset) || query.offset < 0)) {
      return err(validationError('Desplazamiento inválido', 'offset'));
    }

    const where = buildWhere(query);
    if (!where.ok) return err(where.error);

    const direction = query.order === 'occurred_asc' ? 'ASC' : 'DESC';
    let sql =
      'SELECT ' +
      COLUMNS +
      ' FROM entries' +
      where.value.clause +
      ' ORDER BY occurred_local_date ' +
      direction +
      ', occurred_at_utc ' +
      direction +
      ', created_at ' +
      direction;
    const params: SqlValue[] = [...where.value.params];

    if (query.limit !== undefined) {
      sql += ' LIMIT ?';
      params.push(query.limit);
    }
    if (query.offset !== undefined) {
      if (query.limit === undefined) sql += ' LIMIT -1';
      sql += ' OFFSET ?';
      params.push(query.offset);
    }

    try {
      const rows = await ctx.driver.all<EntryRow>(sql, params);
      const entries: Entry[] = [];
      for (const row of rows) {
        const mapped = rowToEntry(row);
        if (!mapped.ok) return err(mapped.error);
        entries.push(mapped.value);
      }
      return ok(entries);
    } catch (error) {
      return err(storageError('No se pudieron leer los registros', error));
    }
  };

  const count = async (query: EntryQuery = {}): Promise<Result<number>> => {
    const where = buildWhere(query);
    if (!where.ok) return err(where.error);

    try {
      const rows = await ctx.driver.all<{ total: number }>(
        'SELECT COUNT(*) AS total FROM entries' + where.value.clause,
        where.value.params,
      );
      return ok(Number(rows[0]?.total ?? 0));
    } catch (error) {
      return err(storageError('No se pudieron contar los registros', error));
    }
  };

  const sum = async (query: EntryQuery = {}): Promise<Result<number>> => {
    const where = buildWhere(query);
    if (!where.ok) return err(where.error);

    try {
      const rows = await ctx.driver.all<{ total: number | null }>(
        'SELECT COALESCE(SUM(amount_minor), 0) AS total FROM entries' + where.value.clause,
        where.value.params,
      );
      return ok(Number(rows[0]?.total ?? 0));
    } catch (error) {
      return err(storageError('No se pudieron sumar los registros', error));
    }
  };

  return { create, update, remove, getById, list, count, sum };
}
