import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { BarChart } from '@/components/charts/BarChart';
import { CategoryBars, type CategoryBarItem } from '@/components/charts/CategoryBars';
import { LineChart } from '@/components/charts/LineChart';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AmountText } from '@/components/ui/AmountText';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { formatAmount } from '@/domain/money/money';
import { todayLocalDate } from '@/domain/time/calendar';
import { shiftPeriod } from '@/domain/time/periods';
import { useApp } from '@/features/app/AppProvider';
import { buildPeriodPoints } from '@/features/statistics/buildChartData';
import { useStatistics, type StatisticsKind } from '@/features/statistics/useStatistics';
import { categoryLabel, t, translateError, type TranslationKey } from '@/i18n';
import { deviceTimeZone } from '@/utils/device';
import { formatDateLabel, formatRangeLabel } from '@/utils/format';
import { categoryColors, colors, spacing } from '@/theme';

const KINDS: { value: StatisticsKind; labelKey: TranslationKey }[] = [
  { value: 'day', labelKey: 'stats.day' },
  { value: 'week', labelKey: 'stats.week' },
  { value: 'month', labelKey: 'stats.month' },
  { value: 'year', labelKey: 'stats.year' },
];

export default function StatisticsScreen() {
  const { profile, categories } = useApp();
  const [kind, setKind] = useState<StatisticsKind>('month');
  const [anchor, setAnchor] = useState<string>(() => todayLocalDate(new Date(), deviceTimeZone()));
  const { state, refresh } = useStatistics(anchor, kind);

  if (!profile) return null;

  const locale = profile.locale;
  const canGoForward = state.status === 'ready' && shiftPeriod(anchor, kind, 1) <= state.data.today;

  return (
    <Screen scroll>
      <AppText variant="title" style={{ marginBottom: spacing.lg }}>
        {t('stats.title')}
      </AppText>

      <View style={styles.chips}>
        {KINDS.map((option) => (
          <Chip
            key={option.value}
            label={t(option.labelKey)}
            selected={kind === option.value}
            onPress={() => {
              setKind(option.value);
              setAnchor(todayLocalDate(new Date(), deviceTimeZone()));
            }}
          />
        ))}
      </View>

      <View style={styles.navigation}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('stats.previousA11y')}
          onPress={() => setAnchor(shiftPeriod(anchor, kind, -1))}
          hitSlop={8}
          style={styles.arrow}
        >
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </Pressable>

        <AppText variant="label" style={styles.rangeLabel}>
          {state.status === 'ready' ? formatRangeLabel(state.data.summary.range, locale) : ' '}
        </AppText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('stats.nextA11y')}
          accessibilityState={{ disabled: !canGoForward }}
          disabled={!canGoForward}
          onPress={() => setAnchor(shiftPeriod(anchor, kind, 1))}
          hitSlop={8}
          style={[styles.arrow, !canGoForward && styles.arrowDisabled]}
        >
          <Ionicons name="chevron-forward" size={22} color={colors.primary} />
        </Pressable>
      </View>

      {state.status === 'loading' ? <LoadingState /> : null}

      {state.status === 'error' ? (
        <ErrorState onRetry={refresh} description={translateError(state.error)} />
      ) : null}

      {state.status === 'ready' ? (
        <>
          <View style={styles.grid}>
            <Card style={styles.card}>
              <AppText variant="caption" color={colors.textMuted}>
                {t('stats.total')}
              </AppText>
              <AmountText
                minor={state.data.summary.totalMinor}
                currency={profile.preferredCurrency}
                locale={locale}
                variant="section"
                style={styles.cardAmount}
              />
            </Card>
            <Card style={styles.card}>
              <AppText variant="caption" color={colors.textMuted}>
                {t('stats.decisions')}
              </AppText>
              <AppText variant="section" style={styles.cardAmount}>
                {state.data.summary.entryCount}
              </AppText>
            </Card>
            <Card style={styles.card}>
              <AppText variant="caption" color={colors.textMuted}>
                {t('stats.average')}
              </AppText>
              <AmountText
                minor={state.data.summary.averagePerCalendarDayMinor}
                currency={profile.preferredCurrency}
                locale={locale}
                variant="section"
                style={styles.cardAmount}
              />
            </Card>
            <Card style={styles.card}>
              <AppText variant="caption" color={colors.textMuted}>
                {t('stats.bestDay')}
              </AppText>
              {state.data.summary.bestDay ? (
                <>
                  <AppText variant="label" style={styles.cardAmount}>
                    {formatDateLabel(state.data.summary.bestDay.date, locale)}
                  </AppText>
                  <AmountText
                    minor={state.data.summary.bestDay.totalMinor}
                    currency={profile.preferredCurrency}
                    locale={locale}
                    variant="caption"
                    color={colors.textMuted}
                  />
                </>
              ) : (
                <AppText variant="section" color={colors.textMuted} style={styles.cardAmount}>
                  —
                </AppText>
              )}
            </Card>
          </View>

          <Card style={styles.comparison}>
            {state.data.summary.comparison ? (
              <>
                <AppText variant="caption" color={colors.textMuted}>
                  {t('stats.vs', {
                    range: formatRangeLabel(state.data.summary.comparison.range, locale),
                  })}
                </AppText>
                <View style={styles.comparisonRow}>
                  <AmountText
                    minor={Math.abs(state.data.summary.comparison.deltaMinor)}
                    currency={profile.preferredCurrency}
                    locale={locale}
                    variant="section"
                    color={
                      state.data.summary.comparison.deltaMinor >= 0 ? colors.primary : colors.danger
                    }
                  />
                  {state.data.summary.comparison.ratio !== null ? (
                    <AppText
                      variant="label"
                      color={
                        state.data.summary.comparison.deltaMinor >= 0
                          ? colors.primary
                          : colors.danger
                      }
                    >
                      {state.data.summary.comparison.deltaMinor >= 0 ? '+' : '−'}
                      {Math.abs(Math.round(state.data.summary.comparison.ratio * 100))} %
                    </AppText>
                  ) : null}
                </View>
                <AppText variant="caption" color={colors.textMuted}>
                  {state.data.summary.comparison.deltaMinor >= 0
                    ? t('stats.more')
                    : t('stats.less')}
                </AppText>
              </>
            ) : (
              <AppText variant="caption" color={colors.textMuted}>
                {t('stats.noComparison')}
              </AppText>
            )}
          </Card>

          {state.data.summary.entryCount === 0 ? (
            <EmptyState
              icon="stats-chart-outline"
              title={t('stats.emptyTitle')}
              description={t('stats.emptyDescription')}
            />
          ) : (
            <>
              {kind !== 'day' ? (
                <View style={styles.section}>
                  <AppText variant="section">{t('stats.evolution')}</AppText>
                  {kind === 'year' ? (
                    <LineChart
                      data={buildPeriodPoints(state.data.entries, state.data.range, locale)}
                      accessibilityLabel={t('stats.yearChartA11y', {
                        total: formatAmount(state.data.summary.totalMinor, {
                          currency: profile.preferredCurrency,
                          locale,
                        }),
                      })}
                    />
                  ) : (
                    <BarChart
                      data={buildPeriodPoints(state.data.entries, state.data.range, locale)}
                      accessibilityLabel={t('stats.chartA11y', {
                        total: formatAmount(state.data.summary.totalMinor, {
                          currency: profile.preferredCurrency,
                          locale,
                        }),
                      })}
                    />
                  )}
                </View>
              ) : null}

              <View style={styles.section}>
                <AppText variant="section">{t('stats.byCategory')}</AppText>
                <CategoryBars
                  data={state.data.summary.byCategory.map<CategoryBarItem>((item) => {
                    const category = categories.find(
                      (candidate) => candidate.id === item.categoryId,
                    );
                    const token = (category?.colorToken ?? 'stone') as keyof typeof categoryColors;
                    return {
                      categoryId: item.categoryId,
                      label: categoryLabel(category?.nameKey ?? 'category.other'),
                      totalMinor: item.totalMinor,
                      share: item.share,
                      color: categoryColors[token] ?? colors.textMuted,
                    };
                  })}
                  currency={profile.preferredCurrency}
                  locale={locale}
                />
              </View>
            </>
          )}
        </>
      ) : null}
    </Screen>
  );
}

const styles = {
  chips: { flexDirection: 'row' as const, gap: spacing.sm, flexWrap: 'wrap' as const },
  navigation: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginVertical: spacing.lg,
  },
  arrow: { padding: spacing.xs },
  arrowDisabled: { opacity: 0.3 },
  rangeLabel: { flex: 1, textAlign: 'center' as const },
  grid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.md,
  },
  card: { width: '47%' as const, flexGrow: 1 },
  cardAmount: { marginTop: spacing.xs },
  comparison: { marginTop: spacing.md },
  comparisonRow: {
    flexDirection: 'row' as const,
    alignItems: 'baseline' as const,
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  section: { marginTop: spacing.xxl, gap: spacing.md },
};
