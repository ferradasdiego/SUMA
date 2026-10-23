import { clampToToday, equivalentPrevious, periodFor, shiftPeriod } from '@/domain/time/periods';

describe('periodos', () => {
  it('construye día, semana, mes y año', () => {
    expect(periodFor('day', '2026-10-23', 1)).toEqual({
      kind: 'day',
      from: '2026-10-23',
      to: '2026-10-23',
    });
    expect(periodFor('week', '2026-10-23', 1)).toEqual({
      kind: 'week',
      from: '2026-10-19',
      to: '2026-10-25',
    });
    expect(periodFor('month', '2026-10-23', 1)).toEqual({
      kind: 'month',
      from: '2026-10-01',
      to: '2026-10-31',
    });
    expect(periodFor('year', '2026-10-23', 1)).toEqual({
      kind: 'year',
      from: '2026-01-01',
      to: '2026-12-31',
    });
  });

  it('recorta el periodo en curso a hoy', () => {
    expect(clampToToday(periodFor('month', '2026-10-23', 1), '2026-10-23')).toEqual({
      kind: 'month',
      from: '2026-10-01',
      to: '2026-10-23',
    });
    expect(clampToToday(periodFor('month', '2026-10-23', 1), '2026-11-05')).toEqual({
      kind: 'month',
      from: '2026-10-01',
      to: '2026-10-31',
    });
  });

  it('devuelve un rango vacío para periodos futuros', () => {
    const range = clampToToday(periodFor('day', '2026-12-01', 1), '2026-10-23');
    expect(range.from).toBe('2026-12-01');
    expect(range.to < range.from).toBe(true);
  });

  it('calcula el periodo anterior equivalente', () => {
    expect(equivalentPrevious({ kind: 'month', from: '2026-10-01', to: '2026-10-23' }, 1)).toEqual({
      kind: 'month',
      from: '2026-09-01',
      to: '2026-09-23',
    });
    expect(equivalentPrevious({ kind: 'week', from: '2026-10-19', to: '2026-10-25' }, 1)).toEqual({
      kind: 'week',
      from: '2026-10-12',
      to: '2026-10-18',
    });
    expect(equivalentPrevious({ kind: 'day', from: '2026-10-23', to: '2026-10-23' }, 1)).toEqual({
      kind: 'day',
      from: '2026-10-22',
      to: '2026-10-22',
    });
  });

  it('no invade el mes siguiente al comparar un mes completo', () => {
    expect(equivalentPrevious({ kind: 'month', from: '2026-10-01', to: '2026-10-31' }, 1)).toEqual({
      kind: 'month',
      from: '2026-09-01',
      to: '2026-09-30',
    });
  });

  it('calcula el tramo anterior de un rango personalizado', () => {
    expect(equivalentPrevious({ kind: 'custom', from: '2026-10-10', to: '2026-10-20' }, 1)).toEqual(
      {
        kind: 'custom',
        from: '2026-09-29',
        to: '2026-10-09',
      },
    );
  });
});

describe('shiftPeriod', () => {
  it('desplaza día y semana', () => {
    expect(shiftPeriod('2026-10-23', 'day', 1)).toBe('2026-10-24');
    expect(shiftPeriod('2026-10-23', 'week', -1)).toBe('2026-10-16');
  });

  it('desplaza meses al primer día', () => {
    expect(shiftPeriod('2026-01-31', 'month', 1)).toBe('2026-02-01');
    expect(shiftPeriod('2026-01-31', 'month', -1)).toBe('2025-12-01');
  });

  it('desplaza años', () => {
    expect(shiftPeriod('2026-10-23', 'year', 1)).toBe('2027-01-01');
    expect(shiftPeriod('2026-10-23', 'year', -1)).toBe('2025-01-01');
  });
});
