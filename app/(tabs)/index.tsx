import { router } from 'expo-router';
import { View } from 'react-native';

import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { EntryRow } from '@/components/entries/EntryRow';
import { GoalCard } from '@/components/goals/GoalCard';
import { AmountText } from '@/components/ui/AmountText';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useApp } from '@/features/app/AppProvider';
import { useHomeData } from '@/features/home/useHomeData';
import { t } from '@/i18n';
import { colors, spacing } from '@/theme';

export default function HomeScreen() {
  const { state, refresh } = useHomeData();
  const { profile, categories } = useApp();

  if (state.status === 'loading') {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (state.status === 'error') {
    return (
      <Screen>
        <ErrorState onRetry={refresh} />
      </Screen>
    );
  }

  if (!profile) return null;

  const { data } = state;
  const locale = profile.locale;

  return (
    <Screen scroll>
      <AppText variant="title">{t('home.title')}</AppText>
      <AppText variant="body" color={colors.textMuted}>
        {t('home.subtitle')}
      </AppText>

      <View style={styles.total}>
        <AppText variant="caption" color={colors.textMuted}>
          {t('home.total')}
        </AppText>
        <AmountText
          minor={data.totalMinor}
          currency={profile.preferredCurrency}
          locale={locale}
          variant="display"
        />
      </View>

      <View style={styles.summaryRow}>
        <Card style={styles.summaryCard}>
          <AppText variant="caption" color={colors.textMuted}>
            {t('home.today')}
          </AppText>
          <AmountText
            minor={data.todayMinor}
            currency={profile.preferredCurrency}
            locale={locale}
            variant="section"
            style={styles.summaryAmount}
          />
        </Card>
        <Card style={styles.summaryCard}>
          <AppText variant="caption" color={colors.textMuted}>
            {t('home.week')}
          </AppText>
          <AmountText
            minor={data.weekMinor}
            currency={profile.preferredCurrency}
            locale={locale}
            variant="section"
            style={styles.summaryAmount}
          />
        </Card>
      </View>

      <Button label={t('home.cta')} onPress={() => router.push('/add')} style={styles.cta} />

      <View style={styles.section}>
        <SectionHeader title={t('home.recent')} />
        {data.recent.length === 0 ? (
          <AppText variant="body" color={colors.textMuted}>
            Aún no has registrado ninguna decisión.
          </AppText>
        ) : (
          data.recent.map((entry) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              category={categories.find((category) => category.id === entry.categoryId)}
              locale={locale}
            />
          ))
        )}
      </View>

      {data.goal && data.goalProgress ? (
        <View style={styles.section}>
          <GoalCard goal={data.goal} progress={data.goalProgress} locale={locale} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = {
  total: { marginTop: spacing.lg, gap: spacing.xs },
  summaryRow: {
    flexDirection: 'row' as const,
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  summaryCard: { flex: 1 },
  summaryAmount: { marginTop: spacing.xs },
  cta: { marginTop: spacing.xl },
  section: { marginTop: spacing.xxl },
};
