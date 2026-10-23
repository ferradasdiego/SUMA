import { useCallback, useEffect, useState } from 'react';

import type { EntryQuery } from '@/data/repositories/types';
import type { Entry } from '@/domain/entities/types';
import type { AppError } from '@/domain/errors/result';
import { addDays, startOfMonth, startOfYear, todayLocalDate } from '@/domain/time/calendar';
import { useApp } from '@/features/app/AppProvider';
import { deviceTimeZone } from '@/utils/device';

export type HistoryRange = 'all' | '30d' | 'month' | 'year';
export type HistoryOrder = 'desc' | 'asc';

export interface HistoryFilters {
  readonly categoryId: string | null;
  readonly range: HistoryRange;
  readonly order: HistoryOrder;
}

const PAGE_SIZE = 50;

export interface HistoryResult {
  readonly items: readonly Entry[];
  readonly status: 'loading' | 'ready' | 'error';
  readonly error: AppError | null;
  readonly hasMore: boolean;
  readonly isFetching: boolean;
  loadMore(): void;
  reload(): void;
}

export function useHistory(filters: HistoryFilters): HistoryResult {
  const { repositories, profile, dataVersion } = useApp();
  const [items, setItems] = useState<readonly Entry[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<AppError | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [reloadToken, setReloadToken] = useState(0);

  const signature = filters.categoryId + '|' + filters.range + '|' + filters.order;

  useEffect(() => {
    // Al cambiar los filtros se reinicia la lista y la paginación.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems([]);
    setStatus('loading');
    setLimit(PAGE_SIZE);
  }, [signature]);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!repositories || !profile) return;

      setIsFetching(true);
      const today = todayLocalDate(new Date(), deviceTimeZone());
      const query: EntryQuery = {
        limit,
        order: filters.order === 'asc' ? 'occurred_asc' : 'occurred_desc',
      };

      if (filters.categoryId) {
        (query as { categoryIds?: readonly string[] }).categoryIds = [filters.categoryId];
      }

      if (filters.range === '30d') {
        (query as { fromLocalDate?: string }).fromLocalDate = addDays(today, -29);
        (query as { toLocalDate?: string }).toLocalDate = today;
      } else if (filters.range === 'month') {
        (query as { fromLocalDate?: string }).fromLocalDate = startOfMonth(today);
        (query as { toLocalDate?: string }).toLocalDate = today;
      } else if (filters.range === 'year') {
        (query as { fromLocalDate?: string }).fromLocalDate = startOfYear(today);
        (query as { toLocalDate?: string }).toLocalDate = today;
      }

      const result = await repositories.entries.list(query);
      if (!active) return;

      setIsFetching(false);

      if (!result.ok) {
        setError(result.error);
        setStatus('error');
        return;
      }

      setError(null);
      setItems(result.value);
      setStatus('ready');
      setHasMore(result.value.length === limit);
    }

    void load();

    return () => {
      active = false;
    };
  }, [repositories, profile, dataVersion, signature, limit, reloadToken, filters]);

  const loadMore = useCallback(() => {
    setLimit((current) => current + PAGE_SIZE);
  }, []);

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  return { items, status, error, hasMore, isFetching, loadMore, reload };
}
