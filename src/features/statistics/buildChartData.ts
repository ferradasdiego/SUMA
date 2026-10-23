import type { ChartPoint } from '@/components/charts/BarChart';
import type { Entry, LocalDate } from '@/domain/entities/types';
import { addDays, dayCountInclusive, parseLocalDate } from '@/domain/time/calendar';
import type { PeriodRange } from '@/domain/time/periods';

function monthLabel(locale: string, year: number, monthIndex: number): string {
  try {
    return new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' }).format(
      new Date(Date.UTC(year, monthIndex, 1)),
    );
  } catch {
    return String(monthIndex + 1);
  }
}

function weekdayLabel(locale: string, date: LocalDate): string {
  const parts = parseLocalDate(date);
  if (!parts) return date;
  try {
    return new Intl.DateTimeFormat(locale, { weekday: 'narrow', timeZone: 'UTC' }).format(
      new Date(Date.UTC(parts.year, parts.month - 1, parts.day)),
    );
  } catch {
    return date;
  }
}

export function buildPeriodPoints(
  entries: readonly Entry[],
  range: PeriodRange,
  locale: string,
): ChartPoint[] {
  const totals = new Map<LocalDate, number>();
  for (const entry of entries) {
    totals.set(
      entry.occurredLocalDate,
      (totals.get(entry.occurredLocalDate) ?? 0) + entry.amountMinor,
    );
  }

  if (range.kind === 'year') {
    const year = parseLocalDate(range.from)?.year ?? 0;
    return Array.from({ length: 12 }, (_, index) => {
      const prefix = year + '-' + String(index + 1).padStart(2, '0');
      let total = 0;
      for (const [date, value] of totals) {
        if (date.startsWith(prefix)) total += value;
      }
      return { label: monthLabel(locale, year, index), value: total };
    });
  }

  if (range.kind === 'day') {
    return [
      { label: String(parseLocalDate(range.from)?.day ?? 1), value: totals.get(range.from) ?? 0 },
    ];
  }

  const points: ChartPoint[] = [];
  let cursor = range.from;
  const days = Math.min(dayCountInclusive(range.from, range.to), 370);

  for (let index = 0; index < days; index += 1) {
    const parts = parseLocalDate(cursor);
    points.push({
      label: range.kind === 'week' ? weekdayLabel(locale, cursor) : String(parts?.day ?? index + 1),
      value: totals.get(cursor) ?? 0,
    });
    cursor = addDays(cursor, 1);
  }

  return points;
}
