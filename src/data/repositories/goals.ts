import { rowToGoal, type GoalRow } from '@/data/repositories/mappers';
import type { GoalRepository, RepositoryContext } from '@/data/repositories/types';
import type { Goal, GoalPatch, NewGoal } from '@/domain/entities/types';
import {
  err,
  notFoundError,
  ok,
  storageError,
  validationError,
  type AppError,
  type Result,
} from '@/domain/errors/result';
import {
  firstIssueField,
  firstIssueMessage,
  goalPatchSchema,
  goalSchema,
  newGoalSchema,
} from '@/domain/validation/schemas';

const COLUMNS =
  'id, title, target_amount_minor, currency, start_date, target_date, is_active, created_at, updated_at';

function storeError(error: unknown): AppError {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('UNIQUE')) {
    return storageError('Ya existe un objetivo activo', error);
  }
  return storageError('No se pudo acceder a los objetivos', error);
}

export function createGoalRepository(ctx: RepositoryContext): GoalRepository {
  const getById = async (id: string): Promise<Result<Goal | null>> => {
    try {
      const rows = await ctx.driver.all<GoalRow>('SELECT ' + COLUMNS + ' FROM goals WHERE id = ?', [
        id,
      ]);
      if (rows.length === 0) return ok(null);
      return rowToGoal(rows[0]!);
    } catch (error) {
      return err(storageError('No se pudo leer el objetivo', error));
    }
  };

  const getActive = async (): Promise<Result<Goal | null>> => {
    try {
      const rows = await ctx.driver.all<GoalRow>(
        'SELECT ' + COLUMNS + ' FROM goals WHERE is_active = 1 LIMIT 1',
      );
      if (rows.length === 0) return ok(null);
      return rowToGoal(rows[0]!);
    } catch (error) {
      return err(storageError('No se pudo leer el objetivo activo', error));
    }
  };

  const list = async (): Promise<Result<readonly Goal[]>> => {
    try {
      const rows = await ctx.driver.all<GoalRow>(
        'SELECT ' + COLUMNS + ' FROM goals ORDER BY is_active DESC, created_at DESC',
      );
      const goals: Goal[] = [];
      for (const row of rows) {
        const mapped = rowToGoal(row);
        if (!mapped.ok) return err(mapped.error);
        goals.push(mapped.value);
      }
      return ok(goals);
    } catch (error) {
      return err(storageError('No se pudieron leer los objetivos', error));
    }
  };

  const create = async (input: NewGoal): Promise<Result<Goal>> => {
    const parsed = newGoalSchema.safeParse(input);
    if (!parsed.success) {
      return err(validationError(firstIssueMessage(parsed.error), firstIssueField(parsed.error)));
    }

    const timestamp = ctx.now().toISOString();
    const goal: Goal = {
      id: ctx.newId(),
      title: parsed.data.title,
      targetAmountMinor: parsed.data.targetAmountMinor,
      currency: parsed.data.currency,
      startDate: parsed.data.startDate,
      targetDate: parsed.data.targetDate,
      isActive: parsed.data.isActive ?? true,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const validated = goalSchema.safeParse(goal);
    if (!validated.success) {
      return err(
        validationError(firstIssueMessage(validated.error), firstIssueField(validated.error)),
      );
    }

    try {
      const params = [
        goal.id,
        goal.title,
        goal.targetAmountMinor,
        goal.currency,
        goal.startDate,
        goal.targetDate,
        goal.isActive ? 1 : 0,
        goal.createdAt,
        goal.updatedAt,
      ];

      if (goal.isActive) {
        await ctx.driver.transaction(async (tx) => {
          await tx.run('UPDATE goals SET is_active = 0, updated_at = ? WHERE is_active = 1', [
            timestamp,
          ]);
          await tx.run(
            'INSERT INTO goals (id, user_id, title, target_amount_minor, currency, start_date, target_date, is_active, created_at, updated_at) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)',
            params,
          );
        });
      } else {
        await ctx.driver.run(
          'INSERT INTO goals (id, user_id, title, target_amount_minor, currency, start_date, target_date, is_active, created_at, updated_at) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)',
          params,
        );
      }
    } catch (error) {
      return err(storeError(error));
    }

    return ok(goal);
  };

  const update = async (id: string, patch: GoalPatch): Promise<Result<Goal>> => {
    const parsedPatch = goalPatchSchema.safeParse(patch);
    if (!parsedPatch.success) {
      return err(
        validationError(firstIssueMessage(parsedPatch.error), firstIssueField(parsedPatch.error)),
      );
    }

    const existing = await getById(id);
    if (!existing.ok) return err(existing.error);
    if (!existing.value) return err(notFoundError('El objetivo no existe'));

    const current = existing.value;
    const timestamp = ctx.now().toISOString();
    const candidate: Goal = {
      ...current,
      title: parsedPatch.data.title ?? current.title,
      targetAmountMinor: parsedPatch.data.targetAmountMinor ?? current.targetAmountMinor,
      targetDate:
        parsedPatch.data.targetDate === undefined
          ? current.targetDate
          : parsedPatch.data.targetDate,
      isActive: parsedPatch.data.isActive ?? current.isActive,
      updatedAt: timestamp,
    };

    const validated = goalSchema.safeParse(candidate);
    if (!validated.success) {
      return err(
        validationError(firstIssueMessage(validated.error), firstIssueField(validated.error)),
      );
    }

    const params = [
      candidate.title,
      candidate.targetAmountMinor,
      candidate.targetDate,
      candidate.isActive ? 1 : 0,
      timestamp,
      id,
    ];

    try {
      if (candidate.isActive) {
        await ctx.driver.transaction(async (tx) => {
          await tx.run(
            'UPDATE goals SET is_active = 0, updated_at = ? WHERE is_active = 1 AND id != ?',
            [timestamp, id],
          );
          await tx.run(
            'UPDATE goals SET title = ?, target_amount_minor = ?, target_date = ?, is_active = ?, updated_at = ? WHERE id = ?',
            params,
          );
        });
      } else {
        await ctx.driver.run(
          'UPDATE goals SET title = ?, target_amount_minor = ?, target_date = ?, is_active = ?, updated_at = ? WHERE id = ?',
          params,
        );
      }
    } catch (error) {
      return err(storeError(error));
    }

    return ok(candidate);
  };

  const remove = async (id: string): Promise<Result<void>> => {
    try {
      const result = await ctx.driver.run('DELETE FROM goals WHERE id = ?', [id]);
      if (result.changes === 0) return err(notFoundError('El objetivo no existe'));
      return ok(undefined);
    } catch (error) {
      return err(storageError('No se pudo eliminar el objetivo', error));
    }
  };

  const setActive = async (id: string): Promise<Result<void>> => {
    const existing = await getById(id);
    if (!existing.ok) return err(existing.error);
    if (!existing.value) return err(notFoundError('El objetivo no existe'));

    const timestamp = ctx.now().toISOString();
    try {
      await ctx.driver.transaction(async (tx) => {
        await tx.run('UPDATE goals SET is_active = 0, updated_at = ? WHERE is_active = 1', [
          timestamp,
        ]);
        await tx.run('UPDATE goals SET is_active = 1, updated_at = ? WHERE id = ?', [
          timestamp,
          id,
        ]);
      });
      return ok(undefined);
    } catch (error) {
      return err(storeError(error));
    }
  };

  return { getActive, list, create, update, remove, setActive };
}
