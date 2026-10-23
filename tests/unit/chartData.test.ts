import { buildPeriodPoints } from '@/features/statistics/buildChartData';
import { makeEntry } from '../fixtures/entries';

const entries = [
  makeEntry({ id: 'a', amountMinor: 250, occurredLocalDate: '2026-10-19' }),
  makeEntry({ id: 'b', amountMinor: 500, occurredLocalDate: '2026-10-23' }),
  makeEntry({ id: 'c', amountMinor: 300, occurredLocalDate: '2026-01-15' }),
  makeEntry({ id: 'd', amountMinor: 700, occurredLocalDate: '2026-03-01' }),
];

describe('buildPeriodPoints', () => {
  it('genera siete puntos para una semana', () => {
    const points = buildPeriodPoints(
      entries,
      { kind: 'week', from: '2026-10-19', to: '2026-10-25' },
      'es-ES',
    );

    expect(points).toHaveLength(7);
    expect(points[0]!.value).toBe(250);
    expect(points[4]!.value).toBe(500);
    expect(points[1]!.value).toBe(0);
  });

  it('genera un punto por día del mes', () => {
    const points = buildPeriodPoints(
      entries,
      { kind: 'month', from: '2026-10-01', to: '2026-10-31' },
      'es-ES',
    );

    expect(points).toHaveLength(31);
    expect(points[18]!.value).toBe(250);
    expect(points[22]!.value).toBe(500);
  });

  it('agrupa por mes en el año', () => {
    const points = buildPeriodPoints(
      entries,
      { kind: 'year', from: '2026-01-01', to: '2026-12-31' },
      'es-ES',
    );

    expect(points).toHaveLength(12);
    expect(points[0]!.value).toBe(300);
    expect(points[2]!.value).toBe(700);
    expect(points[9]!.value).toBe(750);
  });

  it('devuelve un punto para el día', () => {
    const points = buildPeriodPoints(
      entries,
      { kind: 'day', from: '2026-10-23', to: '2026-10-23' },
      'es-ES',
    );

    expect(points).toEqual([{ label: '23', value: 500 }]);
  });
});
