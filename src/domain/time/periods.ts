import type { LocalDate, WeekStartsOn } from '@/domain/entities/types';
import {
  addDays,
  dayCountInclusive,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from '@/domain/time/calendar';

export type PeriodKind = 'day' | 'week' | 'month' | 'year' | 'custom';

export interface PeriodRange {
  readonly kind: PeriodKind;
  readonly from: LocalDate;
  readonly to: LocalDate;
}

export type StandardPeriodKind = Exclude<PeriodKind, 'custom'>;

export function periodFor(
  kind: StandardPeriodKind,
  anchor: LocalDate,
  weekStartsOn: WeekStartsOn,
): PeriodRange {
  switch (kind) {
    case 'day':
      return { kind, from: anchor, to: anchor };
    case 'week':
      return { kind, from: startOfWeek(anchor, weekStartsOn), to: endOfWeek(anchor, weekStartsOn) };
    case 'month':
      return { kind, from: startOfMonth(anchor), to: endOfMonth(anchor) };
    case 'year':
      return { kind, from: startOfYear(anchor), to: endOfYear(anchor) };
  }
}

/** Recorta un periodo en curso hasta hoy. Si empieza en el futuro, devuelve un rango vacío. */
export function clampToToday(range: PeriodRange, today: LocalDate): PeriodRange {
  if (today < range.from) {
    return { ...range, to: addDays(range.from, -1) };
  }
  return range.to > today ? { ...range, to: today } : range;
}

/**
 * Periodo anterior equivalente en longitud.
 * En meses y años se limita al último día del periodo anterior para no invadir
 * el siguiente; la UI lo etiqueta como "mismo tramo".
 */
export function equivalentPrevious(
  range: PeriodRange,
  _weekStartsOn: WeekStartsOn,
): PeriodRange | null {
  const span = dayCountInclusive(range.from, range.to);
  if (span <= 0) return null;

  switch (range.kind) {
    case 'day':
      return { kind: 'day', from: addDays(range.from, -1), to: addDays(range.from, -1) };
    case 'week': {
      const from = addDays(range.from, -7);
      return { kind: 'week', from, to: addDays(from, span - 1) };
    }
    case 'month': {
      const from = startOfMonth(addDays(range.from, -1));
      const limit = endOfMonth(from);
      const candidate = addDays(from, span - 1);
      return { kind: 'month', from, to: candidate < limit ? candidate : limit };
    }
    case 'year': {
      const from = startOfYear(addDays(range.from, -1));
      const limit = endOfYear(from);
      const candidate = addDays(from, span - 1);
      return { kind: 'year', from, to: candidate < limit ? candidate : limit };
    }
    case 'custom': {
      const to = addDays(range.from, -1);
      return { kind: 'custom', from: addDays(to, -(span - 1)), to };
    }
  }
}

export function isEmptyRange(range: PeriodRange): boolean {
  return range.to < range.from;
}
