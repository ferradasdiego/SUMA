import type { LocalDate } from '@/domain/entities/types';
import { err, ok, validationError, type Result } from '@/domain/errors/result';
import { MAX_GOAL_MINOR } from '@/domain/money/currency';
import { parseAmount } from '@/domain/money/money';
import { isLocalDate } from '@/domain/time/calendar';

export interface GoalFormValues {
  readonly title: string;
  readonly amount: string;
  readonly targetDate: string;
}

export interface PrepareGoalOptions {
  readonly currency: string;
  readonly locale: string;
  readonly startDate: LocalDate;
}

export interface PreparedGoal {
  readonly title: string;
  readonly targetAmountMinor: number;
  readonly targetDate: LocalDate | null;
}

export function prepareGoal(
  values: GoalFormValues,
  options: PrepareGoalOptions,
): Result<PreparedGoal> {
  const title = values.title.trim();
  if (title.length === 0) return err(validationError('El nombre es obligatorio', 'title'));
  if (title.length > 80) return err(validationError('El nombre es demasiado largo', 'title'));

  const amount = parseAmount(values.amount, {
    currency: options.currency,
    locale: options.locale,
    maxMinor: MAX_GOAL_MINOR,
  });
  if (!amount.ok) return err(amount.error);

  const rawDate = values.targetDate.trim();
  if (rawDate !== '' && !isLocalDate(rawDate)) {
    return err(validationError('La fecha objetivo no es válida', 'targetDate'));
  }
  if (rawDate !== '' && rawDate < options.startDate) {
    return err(validationError('La fecha objetivo debe ser posterior al inicio', 'targetDate'));
  }

  return ok({
    title,
    targetAmountMinor: amount.value,
    targetDate: rawDate === '' ? null : rawDate,
  });
}
