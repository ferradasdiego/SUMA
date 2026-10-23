import { useCallback, useEffect, useState } from 'react';

import { summarize, type PeriodSummary } from '@/domain/calculations/summarize';
import type { Entry, LocalDate } from '@/domain/entities/types';
import type { AppError } from '@/domain/errors/result';
import { todayLocalDate } from '@/domain/time/calendar';
import {
  clampToToday,
  equivalentPrevious,
  periodFor,
  type PeriodRange,
} from '@/domain/time/periods';
import { useApp } from '@/features/app/AppProvider';
import { deviceTimeZone } from '@/utils/device';

export type StatisticsKind = 'day' | 'week' | 'month' | 'year';

export interface StatisticsData {
  readonly summary: PeriodSummary;
  readonly range: PeriodRange;
  readonly entries: readonly Entry[];
  readonly today: LocalDate;
}

export type StatisticsState =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly data: StatisticsData }
  | { readonly status: 'error'; readonly error: AppError };

export function useStatistics(anchor: LocalDate, kind: StatisticsKind) {
  const { repositories, profile, dataVersion } = useApp();
  const [state, setState] = useState<StatisticsState>({ status: 'loading' });
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!repositories || !profile) return;

      setState({ status: 'loading' });
      const today = todayLocalDate(new Date(), deviceTimeZone());
      const range = clampToToday(periodFor(kind, anchor, profile.weekStartsOn), today);
      const currency = profile.preferredCurrency;

      const entries = await repositories.entries.list({
        currency,
        fromLocalDate: range.from,
        toLocalDate: range.to,
      });

      if (!active) return;
      if (!entries.ok) {
        setState({ status: 'error', error: entries.error });
        return;
      }

      const previousRange = equivalentPrevious(range, profile.weekStartsOn);
      let previousEntries: readonly Entry[] = [];

      if (previousRange && previousRange.from <= previousRange.to) {
        const previous = await repositories.entries.list({
          currency,
          fromLocalDate: previousRange.from,
          toLocalDate: previousRange.to,
        });
        if (!active) return;
        if (!previous.ok) {
          setState({ status: 'error', error: previous.error });
          return;
        }
        previousEntries = previous.value;
      }

      const summary = summarize(entries.value, range, {
        currency,
        weekStartsOn: profile.weekStartsOn,
        previousEntries,
      });

      setState({ status: 'ready', data: { summary, range, entries: entries.value, today } });
    }

    void load();

    return () => {
      active = false;
    };
  }, [repositories, profile, dataVersion, anchor, kind, reloadToken]);

  return { state, refresh };
}
