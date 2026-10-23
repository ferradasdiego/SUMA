import type { CurrencyCode, Entry, LocalDate, WeekStartsOn } from '@/domain/entities/types';
import { dayCountInclusive } from '@/domain/time/calendar';
import { equivalentPrevious, type PeriodRange } from '@/domain/time/periods';

export interface CategoryTotal {
  readonly categoryId: string;
  readonly totalMinor: number;
  readonly entryCount: number;
  readonly share: number;
}

export interface PeriodComparison {
  readonly range: PeriodRange;
  readonly totalMinor: number;
  readonly deltaMinor: number;
  readonly ratio: number | null;
}

export interface PeriodSummary {
  readonly range: PeriodRange;
  readonly totalMinor: number;
  readonly entryCount: number;
  readonly activeDays: number;
  readonly averagePerCalendarDayMinor: number;
  readonly averagePerActiveDayMinor: number;
  readonly bestDay: { readonly date: LocalDate; readonly totalMinor: number } | null;
  readonly byCategory: readonly CategoryTotal[];
  readonly comparison: PeriodComparison | null;
}

export interface SummarizeOptions {
  readonly currency: CurrencyCode;
  readonly weekStartsOn: WeekStartsOn;
  readonly previousEntries?: readonly Entry[];
}

function sum(entries: readonly Entry[]): number {
  return entries.reduce((total, entry) => total + entry.amountMinor, 0);
}

export function summarize(
  entries: readonly Entry[],
  range: PeriodRange,
  options: SummarizeOptions,
): PeriodSummary {
  const relevant = entries.filter(
    (entry) =>
      entry.currency === options.currency &&
      entry.occurredLocalDate >= range.from &&
      entry.occurredLocalDate <= range.to,
  );

  const totalMinor = sum(relevant);
  const dayCount = dayCountInclusive(range.from, range.to);

  const byDay = new Map<LocalDate, number>();
  const byCategory = new Map<string, { totalMinor: number; entryCount: number }>();

  for (const entry of relevant) {
    byDay.set(
      entry.occurredLocalDate,
      (byDay.get(entry.occurredLocalDate) ?? 0) + entry.amountMinor,
    );
    const current = byCategory.get(entry.categoryId) ?? { totalMinor: 0, entryCount: 0 };
    byCategory.set(entry.categoryId, {
      totalMinor: current.totalMinor + entry.amountMinor,
      entryCount: current.entryCount + 1,
    });
  }

  let bestDay: PeriodSummary['bestDay'] = null;
  for (const [date, dayTotal] of Array.from(byDay.entries()).sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0,
  )) {
    if (!bestDay || dayTotal > bestDay.totalMinor) {
      bestDay = { date, totalMinor: dayTotal };
    }
  }

  const categoryTotals: CategoryTotal[] = Array.from(byCategory.entries())
    .map(([categoryId, value]) => ({
      categoryId,
      totalMinor: value.totalMinor,
      entryCount: value.entryCount,
      share: totalMinor > 0 ? value.totalMinor / totalMinor : 0,
    }))
    .sort((a, b) => b.totalMinor - a.totalMinor);

  let comparison: PeriodComparison | null = null;
  if (options.previousEntries && totalMinor > 0) {
    const previousRange = equivalentPrevious(range, options.weekStartsOn);
    if (previousRange) {
      const previousTotal = sum(
        options.previousEntries.filter(
          (entry) =>
            entry.currency === options.currency &&
            entry.occurredLocalDate >= previousRange.from &&
            entry.occurredLocalDate <= previousRange.to,
        ),
      );

      if (previousTotal > 0) {
        comparison = {
          range: previousRange,
          totalMinor: previousTotal,
          deltaMinor: totalMinor - previousTotal,
          ratio: (totalMinor - previousTotal) / previousTotal,
        };
      }
    }
  }

  return {
    range,
    totalMinor,
    entryCount: relevant.length,
    activeDays: byDay.size,
    averagePerCalendarDayMinor: dayCount > 0 ? Math.round(totalMinor / dayCount) : 0,
    averagePerActiveDayMinor: byDay.size > 0 ? Math.round(totalMinor / byDay.size) : 0,
    bestDay,
    byCategory: categoryTotals,
    comparison,
  };
}
