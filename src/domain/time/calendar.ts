import type { LocalDate, WeekStartsOn } from '@/domain/entities/types';

const LOCAL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}

export function isLocalDate(value: string): boolean {
  const match = LOCAL_DATE_PATTERN.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

export function formatLocalDate(year: number, month: number, day: number): LocalDate {
  return pad(year, 4) + '-' + pad(month) + '-' + pad(day);
}

export function parseLocalDate(
  date: LocalDate,
): { year: number; month: number; day: number } | null {
  if (!isLocalDate(date)) return null;
  const match = LOCAL_DATE_PATTERN.exec(date)!;
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

function utcMs(date: LocalDate): number {
  const parts = parseLocalDate(date);
  if (!parts) throw new RangeError('Fecha local inválida: ' + date);
  return Date.UTC(parts.year, parts.month - 1, parts.day);
}

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  const existing = formatterCache.get(timeZone);
  if (existing) return existing;

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  formatterCache.set(timeZone, formatter);
  return formatter;
}

/** Fecha local (YYYY-MM-DD) del instante dado en la zona indicada. */
export function toLocalDate(instant: Date, timeZone: string): LocalDate {
  const parts = formatterFor(timeZone).formatToParts(instant);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    throw new Error('No se pudo resolver la fecha local para la zona ' + timeZone);
  }

  return pad(Number(year), 4) + '-' + pad(Number(month)) + '-' + pad(Number(day));
}

export function todayLocalDate(now: Date, timeZone: string): LocalDate {
  return toLocalDate(now, timeZone);
}

export function addDays(date: LocalDate, days: number): LocalDate {
  const shifted = new Date(utcMs(date) + days * DAY_MS);
  return formatLocalDate(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, shifted.getUTCDate());
}

export function diffDays(from: LocalDate, to: LocalDate): number {
  return Math.round((utcMs(to) - utcMs(from)) / DAY_MS);
}

/** Días incluidos entre dos fechas; 0 si el rango está invertido. */
export function dayCountInclusive(from: LocalDate, to: LocalDate): number {
  return to < from ? 0 : diffDays(from, to) + 1;
}

export function dayOfWeek(date: LocalDate): number {
  return new Date(utcMs(date)).getUTCDay();
}

export function startOfWeek(date: LocalDate, weekStartsOn: WeekStartsOn): LocalDate {
  const offset = (dayOfWeek(date) - weekStartsOn + 7) % 7;
  return addDays(date, -offset);
}

export function endOfWeek(date: LocalDate, weekStartsOn: WeekStartsOn): LocalDate {
  return addDays(startOfWeek(date, weekStartsOn), 6);
}

export function startOfMonth(date: LocalDate): LocalDate {
  const parts = parseLocalDate(date);
  if (!parts) throw new RangeError('Fecha local inválida: ' + date);
  return formatLocalDate(parts.year, parts.month, 1);
}

export function endOfMonth(date: LocalDate): LocalDate {
  const parts = parseLocalDate(date);
  if (!parts) throw new RangeError('Fecha local inválida: ' + date);
  const lastDay = new Date(Date.UTC(parts.year, parts.month, 0)).getUTCDate();
  return formatLocalDate(parts.year, parts.month, lastDay);
}

export function startOfYear(date: LocalDate): LocalDate {
  const parts = parseLocalDate(date);
  if (!parts) throw new RangeError('Fecha local inválida: ' + date);
  return formatLocalDate(parts.year, 1, 1);
}

export function endOfYear(date: LocalDate): LocalDate {
  const parts = parseLocalDate(date);
  if (!parts) throw new RangeError('Fecha local inválida: ' + date);
  return formatLocalDate(parts.year, 12, 31);
}

export function isWithin(date: LocalDate, from: LocalDate, to: LocalDate): boolean {
  return date >= from && date <= to;
}
