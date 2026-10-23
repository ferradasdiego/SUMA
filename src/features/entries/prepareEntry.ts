import type { LocalDate, NewEntry } from '@/domain/entities/types';
import { err, ok, validationError, type Result } from '@/domain/errors/result';
import { parseAmount } from '@/domain/money/money';
import { isLocalDate } from '@/domain/time/calendar';

export interface EntryFormValues {
  readonly amount: string;
  readonly categoryId: string;
  readonly note: string;
  readonly date: LocalDate;
}

export interface PrepareEntryOptions {
  readonly currency: string;
  readonly locale: string;
  readonly timeZone: string;
  readonly today: LocalDate;
  readonly now: Date;
  readonly categoryIds: readonly string[];
}

export function prepareEntry(
  values: EntryFormValues,
  options: PrepareEntryOptions,
): Result<NewEntry> {
  const amount = parseAmount(values.amount, {
    currency: options.currency,
    locale: options.locale,
  });
  if (!amount.ok) return err(amount.error);

  if (!options.categoryIds.includes(values.categoryId)) {
    return err(validationError('Elige una categoría', 'categoryId'));
  }

  if (!isLocalDate(values.date)) {
    return err(validationError('La fecha no es válida', 'date'));
  }

  if (values.date > options.today) {
    return err(validationError('La fecha no puede ser futura', 'date'));
  }

  const note = values.note.trim();
  if (note.length > 280) {
    return err(validationError('La nota no puede superar 280 caracteres', 'note'));
  }

  return ok({
    amountMinor: amount.value,
    currency: options.currency,
    categoryId: values.categoryId,
    note: note.length > 0 ? note : null,
    occurredAtUtc:
      values.date === options.today ? options.now.toISOString() : values.date + 'T12:00:00.000Z',
    occurredLocalDate: values.date,
    occurredTz: options.timeZone,
  });
}
