import { useCallback, useEffect, useState } from 'react';

import { goalProgress, type GoalProgress } from '@/domain/calculations/goals';
import type { Goal, LocalDate } from '@/domain/entities/types';
import type { AppError } from '@/domain/errors/result';
import { todayLocalDate } from '@/domain/time/calendar';
import { useApp } from '@/features/app/AppProvider';
import { deviceTimeZone } from '@/utils/device';

export type ActiveGoalState =
  | { readonly status: 'loading' }
  | {
      readonly status: 'ready';
      readonly goal: Goal | null;
      readonly progress: GoalProgress | null;
      readonly today: LocalDate;
    }
  | { readonly status: 'error'; readonly error: AppError };

export function useActiveGoal(): { state: ActiveGoalState; refresh: () => void } {
  const { repositories, profile, dataVersion } = useApp();
  const [state, setState] = useState<ActiveGoalState>({ status: 'loading' });
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!repositories || !profile) return;

      setState({ status: 'loading' });
      const today = todayLocalDate(new Date(), deviceTimeZone());
      const goal = await repositories.goals.getActive();

      if (!active) return;
      if (!goal.ok) {
        setState({ status: 'error', error: goal.error });
        return;
      }
      if (!goal.value) {
        setState({ status: 'ready', goal: null, progress: null, today });
        return;
      }

      const entries = await repositories.entries.list({
        currency: goal.value.currency,
        fromLocalDate: goal.value.startDate,
        toLocalDate: today,
      });

      if (!active) return;
      if (!entries.ok) {
        setState({ status: 'error', error: entries.error });
        return;
      }

      setState({
        status: 'ready',
        goal: goal.value,
        progress: goalProgress(goal.value, entries.value, today),
        today,
      });
    }

    void load();

    return () => {
      active = false;
    };
  }, [repositories, profile, dataVersion, reloadToken]);

  return { state, refresh };
}
