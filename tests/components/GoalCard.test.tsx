import { render, screen } from '@testing-library/react-native';

import { GoalCard } from '@/components/goals/GoalCard';
import type { GoalProgress } from '@/domain/calculations/goals';
import type { Goal } from '@/domain/entities/types';

const goal: Goal = {
  id: 'goal-1',
  title: 'Viaje de verano',
  targetAmountMinor: 50000,
  currency: 'EUR',
  startDate: '2026-10-01',
  targetDate: null,
  isActive: true,
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-01T10:00:00.000Z',
};

const progress: GoalProgress = {
  goalId: 'goal-1',
  totalMinor: 18000,
  targetMinor: 50000,
  ratio: 0.36,
  remainingMinor: 32000,
  isReached: false,
  entryCount: 2,
  range: { kind: 'custom', from: '2026-10-01', to: '2026-10-23' },
};

describe('GoalCard', () => {
  it('muestra el progreso y la explicación', async () => {
    await render(<GoalCard goal={goal} progress={progress} locale="es-ES" />);

    expect(screen.getByText('Viaje de verano')).toBeVisible();
    expect(screen.getByText('36 %')).toBeVisible();
    expect(screen.getByText(/No implica que el dinero esté apartado/)).toBeVisible();
    expect(screen.getByRole('progressbar')).toBeVisible();
  });

  it('indica cuando el objetivo se ha alcanzado', async () => {
    await render(
      <GoalCard
        goal={goal}
        progress={{ ...progress, totalMinor: 50000, ratio: 1, isReached: true, remainingMinor: 0 }}
        locale="es-ES"
      />,
    );

    expect(screen.getByText('Conseguido')).toBeVisible();
  });
});
