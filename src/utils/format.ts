import type { LocalDate } from '@/domain/entities/types';
import { parseLocalDate } from '@/domain/time/calendar';
import type { PeriodRange } from '@/domain/time/periods';

/** Fecha corta legible, sin desplazamientos por zona horaria. */
export function formatDateLabel(date: LocalDate, locale: string): string {
  const parts = parseLocalDate(date);
  if (!parts) return date;

  try {
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'short',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(parts.year, parts.month - 1, parts.day)));
  } catch {
    return date;
  }
}

export function percentLabel(ratio: number): string {
  return Math.round(ratio * 100) + ' %';
}

function formatUtc(date: LocalDate, locale: string, options: Intl.DateTimeFormatOptions): string {
  const parts = parseLocalDate(date);
  if (!parts) return date;
  try {
    return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(
      new Date(Date.UTC(parts.year, parts.month - 1, parts.day)),
    );
  } catch {
    return date;
  }
}

export function formatRangeLabel(range: PeriodRange, locale: string): string {
  switch (range.kind) {
    case 'year':
      return String(parseLocalDate(range.from)?.year ?? range.from);
    case 'month':
      return formatUtc(range.from, locale, { month: 'long', year: 'numeric' });
    case 'day':
      return formatUtc(range.from, locale, { day: 'numeric', month: 'long', year: 'numeric' });
    case 'week':
      return (
        formatUtc(range.from, locale, { day: 'numeric', month: 'short' }) +
        ' – ' +
        formatUtc(range.to, locale, { day: 'numeric', month: 'short' })
      );
    default:
      return (
        formatUtc(range.from, locale, { day: 'numeric', month: 'short' }) +
        ' – ' +
        formatUtc(range.to, locale, { day: 'numeric', month: 'short' })
      );
  }
}
