import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { EntryRow } from '@/components/entries/EntryRow';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import type { Entry } from '@/domain/entities/types';
import { formatAmount } from '@/domain/money/money';
import { useApp } from '@/features/app/AppProvider';
import {
  useHistory,
  type HistoryFilters,
  type HistoryOrder,
  type HistoryRange,
} from '@/features/history/useHistory';
import { categoryLabel, t } from '@/i18n';
import { colors, spacing } from '@/theme';

const RANGES: { value: HistoryRange; label: string }[] = [
  { value: 'all', label: 'Todo' },
  { value: '30d', label: '30 días' },
  { value: 'month', label: 'Este mes' },
  { value: 'year', label: 'Este año' },
];

export default function HistoryScreen() {
  const { profile, categories, repositories, invalidate } = useApp();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [range, setRange] = useState<HistoryRange>('all');
  const [order, setOrder] = useState<HistoryOrder>('desc');
  const [pendingDelete, setPendingDelete] = useState<Entry | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const filters = useMemo<HistoryFilters>(
    () => ({ categoryId, range, order }),
    [categoryId, range, order],
  );

  const history = useHistory(filters);

  if (!profile) return null;

  async function confirmDelete() {
    if (!pendingDelete || !repositories) return;
    const result = await repositories.entries.remove(pendingDelete.id);
    if (!result.ok) {
      setDeleteError(result.error.message);
      return;
    }
    setPendingDelete(null);
    setDeleteError(null);
    invalidate();
    history.reload();
  }

  return (
    <Screen scroll>
      <AppText variant="title" style={styles.title}>
        {t('history.title')}
      </AppText>

      <View style={styles.filters}>
        <Chip label="Todas" selected={categoryId === null} onPress={() => setCategoryId(null)} />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={categoryLabel(category.nameKey)}
            selected={categoryId === category.id}
            onPress={() => setCategoryId(category.id)}
          />
        ))}
      </View>

      <View style={styles.filters}>
        {RANGES.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={range === option.value}
            onPress={() => setRange(option.value)}
          />
        ))}
      </View>

      <View style={styles.orderRow}>
        <AppText variant="caption" color={colors.textMuted}>
          {history.items.length} registro{history.items.length === 1 ? '' : 's'}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            order === 'desc'
              ? 'Ordenar de más antiguo a más reciente'
              : 'Ordenar de más reciente a más antiguo'
          }
          onPress={() => setOrder(order === 'desc' ? 'asc' : 'desc')}
          hitSlop={8}
          style={styles.orderButton}
        >
          <Ionicons name="swap-vertical" size={16} color={colors.primary} />
          <AppText variant="label" color={colors.primary}>
            {order === 'desc' ? 'Recientes' : 'Antiguos'}
          </AppText>
        </Pressable>
      </View>

      {deleteError ? (
        <AppText variant="caption" color={colors.danger} accessibilityLiveRegion="polite">
          {deleteError}
        </AppText>
      ) : null}

      {history.status === 'loading' && history.items.length === 0 ? <LoadingState /> : null}

      {history.status === 'error' ? (
        <ErrorState onRetry={history.reload} description={history.error?.message} />
      ) : null}

      {history.status === 'ready' && history.items.length === 0 ? (
        <EmptyState
          icon="time-outline"
          title="Sin movimientos"
          description="No hay registros con estos filtros."
          actionLabel={t('home.cta')}
          onAction={() => router.push('/add')}
        />
      ) : null}

      {history.items.map((entry) => (
        <View key={entry.id} style={styles.row}>
          <Pressable
            style={styles.rowMain}
            accessibilityRole="button"
            accessibilityLabel={
              'Editar registro de ' +
              formatAmount(entry.amountMinor, { currency: entry.currency, locale: profile.locale })
            }
            onPress={() => router.push('/entry/' + entry.id)}
          >
            <EntryRow
              entry={entry}
              category={categories.find((category) => category.id === entry.categoryId)}
              locale={profile.locale}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Eliminar registro"
            onPress={() => {
              setDeleteError(null);
              setPendingDelete(entry);
            }}
            hitSlop={8}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </Pressable>
        </View>
      ))}

      {history.hasMore ? (
        <Button
          label={history.isFetching ? 'Cargando…' : 'Cargar más'}
          onPress={history.loadMore}
          variant="secondary"
          loading={history.isFetching}
          disabled={history.isFetching}
          style={styles.loadMore}
        />
      ) : null}

      <ConfirmDialog
        visible={pendingDelete !== null}
        title="¿Eliminar este registro?"
        message="El importe dejará de contar en tus totales. Esta acción no se puede deshacer."
        confirmLabel={t('common.delete')}
        destructive
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          void confirmDelete();
        }}
      />
    </Screen>
  );
}

const styles = {
  title: { marginBottom: spacing.lg },
  filters: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  orderRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  orderButton: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: spacing.xs },
  row: { flexDirection: 'row' as const, alignItems: 'center' as const },
  rowMain: { flex: 1 },
  deleteButton: { padding: spacing.sm },
  loadMore: { marginTop: spacing.lg },
};
