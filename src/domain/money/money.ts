import type { CurrencyCode } from '@/domain/entities/types';
import { err, ok, validationError, type Result } from '@/domain/errors/result';
import { MAX_ENTRY_MINOR, isSupportedCurrency, minorDigits } from '@/domain/money/currency';

export interface MoneyOptions {
  readonly currency: CurrencyCode;
  readonly locale: string;
}

export interface ParseAmountOptions extends MoneyOptions {
  /** Límite en unidades menores; por defecto, el de una decisión. */
  readonly maxMinor?: number;
}

const INVISIBLE_SPACES = /[\u00A0\u202F]/g;

function separatorsFor(locale: string): { decimal: string; group: string } {
  try {
    const parts = new Intl.NumberFormat(locale, { useGrouping: true }).formatToParts(12345.6);
    return {
      decimal: parts.find((part) => part.type === 'decimal')?.value ?? '.',
      group: parts.find((part) => part.type === 'group')?.value ?? ',',
    };
  } catch {
    return { decimal: ',', group: '.' };
  }
}

function isValidGrouping(value: string, separator: string): boolean {
  const groups = value.split(separator);
  if (groups.length < 2) return false;
  const [first, ...rest] = groups;
  if (!first || !/^\d{1,3}$/.test(first)) return false;
  return rest.every((group) => /^\d{3}$/.test(group));
}

function invalidAmount(): Result<number> {
  return err(validationError('El importe no es válido', 'amount'));
}

/**
 * Convierte texto del usuario a unidades menores.
 * Acepta el separador decimal del idioma y tolera el separador alternativo
 * cuando no puede ser de miles (por ejemplo "2.5" en es-ES).
 */
export function parseAmount(raw: string, options: ParseAmountOptions): Result<number> {
  if (!isSupportedCurrency(options.currency)) {
    return err(validationError('Moneda no soportada', 'amount'));
  }

  const digits = minorDigits(options.currency);
  const normalized = raw.replace(INVISIBLE_SPACES, '').trim();

  if (normalized === '') {
    return err(validationError('Introduce un importe', 'amount'));
  }
  if (!/^[0-9.,]+$/.test(normalized)) {
    return invalidAmount();
  }

  const { decimal, group } = separatorsFor(options.locale);
  const lastDot = normalized.lastIndexOf('.');
  const lastComma = normalized.lastIndexOf(',');
  const hasDot = lastDot >= 0;
  const hasComma = lastComma >= 0;

  let decimalIndex = -1;

  if (hasDot && hasComma) {
    const decimalSeparator = lastDot > lastComma ? '.' : ',';
    decimalIndex = Math.max(lastDot, lastComma);
    const groupingSeparator = decimalSeparator === '.' ? ',' : '.';
    if (!isValidGrouping(normalized.slice(0, decimalIndex), groupingSeparator)) {
      return invalidAmount();
    }
    if (normalized.slice(decimalIndex + 1).includes(groupingSeparator)) {
      return invalidAmount();
    }
  } else if (hasDot || hasComma) {
    const separator = hasDot ? '.' : ',';
    const occurrences = normalized.split(separator).length - 1;

    if (occurrences > 1) {
      if (!isValidGrouping(normalized, separator)) return invalidAmount();
      decimalIndex = -1;
    } else {
      const [integerPart = '', fractionPart = ''] = normalized.split(separator);
      const grouping = isValidGrouping(normalized, separator);

      if (separator === decimal) {
        decimalIndex = integerPart.length;
        if (fractionPart === '') return invalidAmount();
      } else if (separator === group) {
        if (grouping && fractionPart.length === 3) {
          decimalIndex = -1;
        } else if (fractionPart.length > 0 && fractionPart.length <= digits) {
          decimalIndex = integerPart.length;
        } else if (grouping) {
          decimalIndex = -1;
        } else {
          return invalidAmount();
        }
      } else if (fractionPart.length > 0 && fractionPart.length <= digits) {
        decimalIndex = integerPart.length;
      } else {
        return invalidAmount();
      }
    }
  }

  const rawInteger = decimalIndex >= 0 ? normalized.slice(0, decimalIndex) : normalized;
  const rawFraction = decimalIndex >= 0 ? normalized.slice(decimalIndex + 1) : '';
  const integerPart = rawInteger.split(group).join('').split(decimal).join('');

  if (!/^\d+$/.test(integerPart)) return invalidAmount();
  if (rawFraction !== '' && !/^\d+$/.test(rawFraction)) return invalidAmount();
  if (rawFraction.length > digits) {
    return err(validationError('El importe tiene demasiados decimales', 'amount'));
  }
  if (digits === 0 && rawFraction !== '') {
    return err(validationError('Esta moneda no admite decimales', 'amount'));
  }

  const integerValue = Number(integerPart);
  if (!Number.isSafeInteger(integerValue)) {
    return err(validationError('El importe es demasiado grande', 'amount'));
  }

  const factor = 10 ** digits;
  const fractionValue = digits === 0 ? 0 : Number(rawFraction.padEnd(digits, '0') || '0');
  const minor = integerValue * factor + fractionValue;

  if (!Number.isSafeInteger(minor)) {
    return err(validationError('El importe es demasiado grande', 'amount'));
  }
  if (minor <= 0) {
    return err(validationError('El importe debe ser mayor que cero', 'amount'));
  }
  const maxMinor = options.maxMinor ?? MAX_ENTRY_MINOR;
  if (minor > maxMinor) {
    return err(validationError('El importe supera el máximo permitido', 'amount'));
  }

  return ok(minor);
}

/** Formato para el campo de entrada: sin símbolo de moneda. */
export function formatAmountInput(minor: number, options: MoneyOptions): string {
  const digits = minorDigits(options.currency);
  return new Intl.NumberFormat(options.locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(minor / 10 ** digits);
}

export function formatAmount(minor: number, options: MoneyOptions): string {
  const digits = minorDigits(options.currency);
  const value = minor / 10 ** digits;

  try {
    return new Intl.NumberFormat(options.locale, {
      style: 'currency',
      currency: options.currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  } catch {
    return value.toFixed(digits) + ' ' + options.currency;
  }
}
