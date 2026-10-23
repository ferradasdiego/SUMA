import { goalProgress } from '@/domain/calculations/goals';
import type { Goal } from '@/domain/entities/types';
import { makeEntry } from '../fixtures/entries';

const goal: Goal = {
  id: 'goal-1',
  title: 'Viaje de verano',
  targetAmountMinor: 5000,
  currency: 'EUR',
  startDate: '2026-10-01',
  targetDate: null,
  isActive: true,
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-01T10:00:00.000Z',
};

const entries = [
  makeEntry({ id: 'a', amountMinor: 250, occurredLocalDate: '2026-10-01' }),
  makeEntry({ id: 'b', amountMinor: 300, occurredLocalDate: '2026-10-23' }),
  makeEntry({ id: 'c', amountMinor: 100, occurredLocalDate: '2026-09-30' }),
  makeEntry({ id: 'd', amountMinor: 200, occurredLocalDate: '2026-10-24' }),
  makeEntry({ id: 'e', amountMinor: 900, occurredLocalDate: '2026-10-10', currency: 'USD' }),
];

describe('goalProgress', () => {
  it('suma los registros desde el inicio hasta hoy', () => {
    const progress = goalProgress(goal, entries, '2026-10-23');
    expect(progress.totalMinor).toBe(550);
    expect(progress.entryCount).toBe(2);
    expect(progress.remainingMinor).toBe(4450);
    expect(progress.ratio).toBeCloseTo(0.11, 5);
    expect(progress.isReached).toBe(false);
  });

  it('se detiene en la fecha objetivo si ya pasó', () => {
    const progress = goalProgress({ ...goal, targetDate: '2026-10-10' }, entries, '2026-10-23');
    expect(progress.range.to).toBe('2026-10-10');
    expect(progress.totalMinor).toBe(250);
  });

  it('no cuenta registros de otra moneda', () => {
    const progress = goalProgress(goal, entries, '2026-10-23');
    expect(progress.totalMinor).not.toBe(1450);
  });

  it('devuelve cero si el objetivo empieza en el futuro', () => {
    const progress = goalProgress({ ...goal, startDate: '2026-12-01' }, entries, '2026-10-23');
    expect(progress.totalMinor).toBe(0);
    expect(progress.entryCount).toBe(0);
  });

  it('marca el objetivo como alcanzado', () => {
    const progress = goalProgress({ ...goal, targetAmountMinor: 500 }, entries, '2026-10-23');
    expect(progress.isReached).toBe(true);
    expect(progress.remainingMinor).toBe(0);
    expect(progress.ratio).toBeCloseTo(1.1, 5);
  });
});
