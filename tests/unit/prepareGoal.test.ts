import { prepareGoal } from '@/features/goals/prepareGoal';

const options = { currency: 'EUR', locale: 'es-ES', startDate: '2026-10-23' };

describe('prepareGoal', () => {
  it('prepara un objetivo válido', () => {
    const result = prepareGoal(
      { title: '  Viaje  ', amount: '500,00', targetDate: '2027-07-01' },
      options,
    );

    expect(result).toEqual({
      ok: true,
      value: { title: 'Viaje', targetAmountMinor: 50000, targetDate: '2027-07-01' },
    });
  });

  it('acepta una fecha objetivo vacía', () => {
    const result = prepareGoal({ title: 'Viaje', amount: '500', targetDate: '  ' }, options);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.targetDate).toBeNull();
  });

  it('rechaza un título vacío', () => {
    const result = prepareGoal({ title: '   ', amount: '500', targetDate: '' }, options);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.field).toBe('title');
  });

  it('rechaza una fecha anterior al inicio', () => {
    const result = prepareGoal(
      { title: 'Viaje', amount: '500', targetDate: '2026-10-01' },
      options,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.field).toBe('targetDate');
  });

  it('rechaza una fecha con formato inválido', () => {
    const result = prepareGoal(
      { title: 'Viaje', amount: '500', targetDate: '01/07/2027' },
      options,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.field).toBe('targetDate');
  });

  it('aplica el límite de objetivo, superior al de una decisión', () => {
    const accepted = prepareGoal({ title: 'Casa', amount: '10000000,00', targetDate: '' }, options);
    expect(accepted.ok).toBe(true);
    if (accepted.ok) expect(accepted.value.targetAmountMinor).toBe(1_000_000_000);

    const rejected = prepareGoal({ title: 'Casa', amount: '10000000,01', targetDate: '' }, options);
    expect(rejected.ok).toBe(false);
  });

  it('rechaza importes inválidos', () => {
    const result = prepareGoal({ title: 'Viaje', amount: 'abc', targetDate: '' }, options);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.field).toBe('amount');
  });
});
