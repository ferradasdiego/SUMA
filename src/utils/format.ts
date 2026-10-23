import type { LocalDate } from '@/domain/entities/types';
import { parseLocalDate } from '@/domain/time/calendar';

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
