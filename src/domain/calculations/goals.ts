import type { Entry, Goal, LocalDate } from '@/domain/entities/types';
import type { PeriodRange } from '@/domain/time/periods';

export interface GoalProgress {
  readonly goalId: string;
  readonly totalMinor: number;
  readonly targetMinor: number;
  readonly ratio: number;
  readonly remainingMinor: number;
  readonly isReached: boolean;
  readonly entryCount: number;
  readonly range: PeriodRange;
}

/**
 * Progreso del objetivo: suma de registros de su moneda entre la fecha de inicio
 * y hoy (o la fecha objetivo si ya pasó). No implica que el dinero esté apartado.
 */
export function goalProgress(
  goal: Goal,
  entries: readonly Entry[],
  today: LocalDate,
): GoalProgress {
  const to = goal.targetDate !== null && goal.targetDate < today ? goal.targetDate : today;
  const range: PeriodRange = { kind: 'custom', from: goal.startDate, to };

  const relevant =
    range.from <= range.to
      ? entries.filter(
          (entry) =>
            entry.currency === goal.currency &&
            entry.occurredLocalDate >= range.from &&
            entry.occurredLocalDate <= range.to,
        )
      : [];

  const totalMinor = relevant.reduce((total, entry) => total + entry.amountMinor, 0);
  const targetMinor = goal.targetAmountMinor;

  return {
    goalId: goal.id,
    totalMinor,
    targetMinor,
    ratio: targetMinor > 0 ? totalMinor / targetMinor : 0,
    remainingMinor: Math.max(0, targetMinor - totalMinor),
    isReached: totalMinor >= targetMinor,
    entryCount: relevant.length,
    range,
  };
}
