import type { CurrencyCode } from '@/domain/entities/types';

/**
 * Decimales por moneda según ISO 4217 (subconjunto mantenido a mano).
 * El MVP solo permite EUR, pero la tabla deja preparada la ampliación.
 */
export const CURRENCY_MINOR_DIGITS: Readonly<Record<string, number>> = {
  EUR: 2,
  USD: 2,
  GBP: 2,
  CHF: 2,
  MXN: 2,
  ARS: 2,
  COP: 2,
  PEN: 2,
  JPY: 0,
  CLP: 0,
};

export const DEFAULT_CURRENCY: CurrencyCode = 'EUR';
export const DEFAULT_LOCALE = 'es-ES';
export const DEFAULT_WEEK_STARTS_ON = 1 as const;

/** Límite de una decisión: 1.000.000,00 en una moneda de dos decimales. */
export const MAX_ENTRY_MINOR = 100_000_000;
/** Límite de un objetivo: 10.000.000,00 en una moneda de dos decimales. */
export const MAX_GOAL_MINOR = 1_000_000_000;

export function isSupportedCurrency(currency: string): boolean {
  return Object.prototype.hasOwnProperty.call(CURRENCY_MINOR_DIGITS, currency);
}

export function minorDigits(currency: CurrencyCode): number {
  return CURRENCY_MINOR_DIGITS[currency] ?? 2;
}
