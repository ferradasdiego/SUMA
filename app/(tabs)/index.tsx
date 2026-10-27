import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { EntryRow } from '@/components/entries/EntryRow';
import { GoalCard } from '@/components/goals/GoalCard';
import { Heart, Sparkle } from '@/components/skin/Doodle';
import { PiggyBank } from '@/components/skin/PiggyBank';
import { AmountText } from '@/components/ui/AmountText';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useApp } from '@/features/app/AppProvider';
import { useHomeData } from '@/features/home/useHomeData';
import { t } from '@/i18n';
import { spacing, useTheme } from '@/theme';

export default function HomeScreen() {
  const { state, refresh } = useHomeData();
  const { profile, categories } = useApp();
  const { colors, illustration, skin } = useTheme();

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
  const isPaper = skin.decoration === 'paper';

  const recent =
    data.recent.length === 0 ? (
      <AppText variant="body" color={colors.textMuted}>
        {t('home.noEntries')}
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
    );

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <AppText variant="title">SUMA</AppText>
          <AppText variant="body" color={colors.textMuted}>
            {t('home.subtitle')}
          </AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.openSettings')}
          onPress={() => router.push('/settings')}
          hitSlop={8}
          style={
            isPaper
              ? [
                  styles.settingsButtonPaper,
                  { backgroundColor: colors.surfaces.lilac, borderColor: colors.border },
                ]
              : styles.settingsButton
          }
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color={isPaper ? colors.primary : colors.textMuted}
          />
        </Pressable>
      </View>

      {isPaper ? (
        <>
          <Card tone="mint" style={styles.hero}>
            <View style={styles.heroCopy}>
              <AppText variant="caption" color={colors.textMuted}>
                {t('home.total')}
              </AppText>
              <AmountText
                minor={data.totalMinor}
                currency={profile.preferredCurrency}
                locale={locale}
                variant="display"
              />
              <View style={styles.encouragement}>
                <Heart size={13} color={illustration?.heart ?? colors.doodle} />
                <AppText variant="caption" color={colors.positive}>
                  {t('home.encouragement')}
                </AppText>
                <Sparkle size={13} color={illustration?.sparkle ?? colors.doodle} />
              </View>
            </View>
            <View
              style={styles.piggy}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <PiggyBank width={118} />
            </View>
          </Card>

          <View style={styles.summaryRow}>
            <Card tone="blue" style={styles.summaryCard}>
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
            <Card tone="butter" style={styles.summaryCard}>
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
        </>
      ) : (
        <>
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
        </>
      )}

      <Button label={t('home.cta')} onPress={() => router.push('/add')} style={styles.cta} />

      <View style={styles.section}>
        <SectionHeader title={t('home.recent')} />
        {isPaper ? (
          <Card tone="blue" style={styles.recentCard}>
            {recent}
          </Card>
        ) : (
          recent
        )}
      </View>

      {data.goal && data.goalProgress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.openGoal')}
          onPress={() => router.push('/goals')}
          style={styles.section}
        >
          <GoalCard goal={data.goal} progress={data.goalProgress} locale={locale} />
        </Pressable>
      ) : (
        <Card tone={isPaper ? 'lilac' : 'plain'} style={styles.section}>
          <AppText variant="label">{t('home.noGoalTitle')}</AppText>
          <AppText variant="caption" color={colors.textMuted} style={styles.hint}>
            {t('home.noGoalDescription')}
          </AppText>
          <Button
            label={t('home.createGoal')}
            onPress={() => router.push('/goals')}
            variant="secondary"
            style={styles.goalCta}
          />
        </Card>
      )}
    </Screen>
  );
}

const styles = {
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
  },
  headerText: { flex: 1, paddingRight: spacing.md },
  settingsButton: { padding: spacing.xs },
  settingsButtonPaper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 1.5,
  },
  hero: {
    marginTop: spacing.lg,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
  },
  heroCopy: { flex: 1, gap: 2 },
  encouragement: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  piggy: { marginBottom: -6 },
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
  recentCard: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  hint: { marginTop: spacing.xs },
  goalCta: { marginTop: spacing.md },
};
