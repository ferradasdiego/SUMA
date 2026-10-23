import { useCallback, useEffect, useState } from 'react';

import { useApp } from '@/features/app/AppProvider';
import { goalProgress, type GoalProgress } from '@/domain/calculations/goals';
import type { Entry, Goal, LocalDate } from '@/domain/entities/types';
import type { AppError } from '@/domain/errors/result';
import { startOfWeek, todayLocalDate } from '@/domain/time/calendar';
import { deviceTimeZone } from '@/utils/device';

export interface HomeData {
  readonly totalMinor: number;
  readonly todayMinor: number;
  readonly weekMinor: number;
  readonly recent: readonly Entry[];
  readonly goal: Goal | null;
  readonly goalProgress: GoalProgress | null;
  readonly today: LocalDate;
}

export type HomeState =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly data: HomeData }
  | { readonly status: 'error'; readonly error: AppError };

export function useHomeData(): { state: HomeState; refresh: () => void } {
  const { repositories, profile, dataVersion } = useApp();
  const [state, setState] = useState<HomeState>({ status: 'loading' });
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!repositories || !profile) return;

      setState({ status: 'loading' });
      const timeZone = deviceTimeZone();
      const today = todayLocalDate(new Date(), timeZone);
      const currency = profile.preferredCurrency;

      const [total, todayTotal, weekTotal, recent, activeGoal] = await Promise.all([
        repositories.entries.sum({ currency }),
        repositories.entries.sum({ currency, fromLocalDate: today, toLocalDate: today }),
        repositories.entries.sum({
          currency,
          fromLocalDate: startOfWeek(today, profile.weekStartsOn),
          toLocalDate: today,
        }),
        repositories.entries.list({ currency, limit: 3 }),
        repositories.goals.getActive(),
      ]);

      const failure = [total, todayTotal, weekTotal, recent, activeGoal].find(
        (result) => !result.ok,
      );
      if (failure && !failure.ok) {
        if (active) setState({ status: 'error', error: failure.error });
        return;
      }

      let goal: Goal | null = null;
      let progress: GoalProgress | null = null;

      if (activeGoal.ok && activeGoal.value) {
        goal = activeGoal.value;
        const goalEntries = await repositories.entries.list({
          currency: goal.currency,
          fromLocalDate: goal.startDate,
          toLocalDate: today,
        });
        if (!goalEntries.ok) {
          if (active) setState({ status: 'error', error: goalEntries.error });
          return;
        }
        progress = goalProgress(goal, goalEntries.value, today);
      }

      if (!active) return;

      setState({
        status: 'ready',
        data: {
          totalMinor: total.ok ? total.value : 0,
          todayMinor: todayTotal.ok ? todayTotal.value : 0,
          weekMinor: weekTotal.ok ? weekTotal.value : 0,
          recent: recent.ok ? recent.value : [],
          goal,
          goalProgress: progress,
          today,
        },
      });
    }

    void load();

    return () => {
      active = false;
    };
  }, [repositories, profile, dataVersion, reloadToken]);

  return { state, refresh };
}
