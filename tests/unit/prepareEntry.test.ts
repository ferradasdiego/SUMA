import { prepareEntry } from '@/features/entries/prepareEntry';

const options = {
  currency: 'EUR',
  locale: 'es-ES',
  timeZone: 'Europe/Madrid',
  today: '2026-10-23',
  now: new Date('2026-10-23T10:15:00.000Z'),
  categoryIds: ['cat_coffee', 'cat_food'],
};

const values = {
  amount: '2,50',
  categoryId: 'cat_coffee',
  note: '  Café en casa  ',
  date: '2026-10-23',
};

describe('prepareEntry', () => {
  it('construye un registro válido con la fecha de hoy', () => {
    const result = prepareEntry(values, options);
    expect(result).toEqual({
      ok: true,
      value: {
        amountMinor: 250,
        currency: 'EUR',
        categoryId: 'cat_coffee',
        note: 'Café en casa',
        occurredAtUtc: '2026-10-23T10:15:00.000Z',
        occurredLocalDate: '2026-10-23',
        occurredTz: 'Europe/Madrid',
      },
    });
  });

  it('usa el mediodía UTC para una fecha pasada', () => {
    const result = prepareEntry({ ...values, date: '2026-10-01' }, options);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.occurredAtUtc).toBe('2026-10-01T12:00:00.000Z');
  });

  it('convierte una nota vacía en null', () => {
    const result = prepareEntry({ ...values, note: '   ' }, options);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.note).toBeNull();
  });

  it('rechaza fechas futuras', () => {
    const result = prepareEntry({ ...values, date: '2026-10-24' }, options);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.field).toBe('date');
  });

  it('rechaza fechas con formato inválido', () => {
    const result = prepareEntry({ ...values, date: '23/10/2026' }, options);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.field).toBe('date');
  });

  it('rechaza importes inválidos y conserva el campo', () => {
    const result = prepareEntry({ ...values, amount: '0' }, options);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('VALIDATION');
      expect(result.error.field).toBe('amount');
    }
  });

  it('rechaza categorías que no existen', () => {
    const result = prepareEntry({ ...values, categoryId: 'cat_unknown' }, options);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.field).toBe('categoryId');
  });

  it('rechaza notas demasiado largas', () => {
    const result = prepareEntry({ ...values, note: 'x'.repeat(281) }, options);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.field).toBe('note');
  });
});
