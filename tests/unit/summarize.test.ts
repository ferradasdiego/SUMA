import { summarize } from '@/domain/calculations/summarize';
import { makeEntry } from '../fixtures/entries';

const range = { kind: 'month', from: '2026-10-01', to: '2026-10-23' } as const;

const entries = [
  makeEntry({
    id: 'a',
    amountMinor: 250,
    occurredLocalDate: '2026-10-01',
    categoryId: 'cat_coffee',
  }),
  makeEntry({ id: 'b', amountMinor: 800, occurredLocalDate: '2026-10-01', categoryId: 'cat_food' }),
  makeEntry({
    id: 'c',
    amountMinor: 500,
    occurredLocalDate: '2026-10-05',
    categoryId: 'cat_transport',
  }),
  makeEntry({
    id: 'd',
    amountMinor: 300,
    occurredLocalDate: '2026-10-23',
    categoryId: 'cat_leisure',
  }),
  makeEntry({ id: 'e', amountMinor: 1000, occurredLocalDate: '2026-09-20' }),
  makeEntry({ id: 'f', amountMinor: 900, occurredLocalDate: '2026-10-10', currency: 'USD' }),
];

describe('summarize', () => {
  it('suma solo los registros del periodo y la moneda', () => {
    const summary = summarize(entries, range, {
      currency: 'EUR',
      weekStartsOn: 1,
      previousEntries: entries,
    });

    expect(summary.totalMinor).toBe(1850);
    expect(summary.entryCount).toBe(4);
    expect(summary.activeDays).toBe(3);
    expect(summary.averagePerCalendarDayMinor).toBe(80);
    expect(summary.averagePerActiveDayMinor).toBe(617);
    expect(summary.bestDay).toEqual({ date: '2026-10-01', totalMinor: 1050 });
  });

  it('agrega por categoría con porcentajes', () => {
    const summary = summarize(entries, range, { currency: 'EUR', weekStartsOn: 1 });
    expect(summary.byCategory.map((c) => c.categoryId)).toEqual([
      'cat_food',
      'cat_transport',
      'cat_leisure',
      'cat_coffee',
    ]);
    expect(summary.byCategory[0]).toMatchObject({ totalMinor: 800, entryCount: 1 });
    expect(summary.byCategory[0]!.share).toBeCloseTo(800 / 1850, 5);
  });

  it('compara con el tramo anterior cuando hay datos', () => {
    const summary = summarize(entries, range, {
      currency: 'EUR',
      weekStartsOn: 1,
      previousEntries: entries,
    });

    expect(summary.comparison).not.toBeNull();
    expect(summary.comparison).toMatchObject({
      totalMinor: 1000,
      deltaMinor: 850,
    });
    expect(summary.comparison!.range).toEqual({
      kind: 'month',
      from: '2026-09-01',
      to: '2026-09-23',
    });
    expect(summary.comparison!.ratio).toBeCloseTo(0.85, 5);
  });

  it('no compara sin datos previos', () => {
    const summary = summarize(entries, range, {
      currency: 'EUR',
      weekStartsOn: 1,
      previousEntries: [],
    });
    expect(summary.comparison).toBeNull();
  });

  it('devuelve ceros y listas vacías en un periodo sin registros', () => {
    const summary = summarize([], range, { currency: 'EUR', weekStartsOn: 1 });
    expect(summary.totalMinor).toBe(0);
    expect(summary.entryCount).toBe(0);
    expect(summary.byCategory).toEqual([]);
    expect(summary.bestDay).toBeNull();
    expect(summary.averagePerCalendarDayMinor).toBe(0);
  });

  it('ignora registros de otra moneda aunque compartan fecha', () => {
    const summary = summarize(entries, range, { currency: 'USD', weekStartsOn: 1 });
    expect(summary.totalMinor).toBe(900);
    expect(summary.entryCount).toBe(1);
  });
});
