import { View } from 'react-native';

import type { GoalProgress } from '@/domain/calculations/goals';
import type { Goal } from '@/domain/entities/types';
import { AmountText } from '@/components/ui/AmountText';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { t } from '@/i18n';
import { percentLabel } from '@/utils/format';
import { colors, spacing } from '@/theme';

export interface GoalCardProps {
  goal: Goal;
  progress: GoalProgress;
  locale: string;
}

export function GoalCard({ goal, progress, locale }: GoalCardProps) {
  return (
    <Card>
      <AppText variant="caption" color={colors.textMuted}>
        {t('goals.title')}
      </AppText>
      <View style={styles.header}>
        <AppText variant="section">{goal.title}</AppText>
        <AppText variant="label" color={progress.isReached ? colors.primary : colors.textMuted}>
          {progress.isReached ? t('goals.reached') : percentLabel(progress.ratio)}
        </AppText>
      </View>
      <ProgressBar
        ratio={progress.ratio}
        accessibilityLabel={t('goals.progressA11y', {
          title: goal.title,
          percent: Math.round(progress.ratio * 100),
        })}
      />
      <View style={styles.amounts}>
        <AmountText
          minor={progress.totalMinor}
          currency={goal.currency}
          locale={locale}
          variant="body"
          color={colors.text}
        />
        <AppText variant="caption" color={colors.textMuted}>
          {t('goals.of')}{' '}
          <AmountText
            minor={goal.targetAmountMinor}
            currency={goal.currency}
            locale={locale}
            variant="caption"
            color={colors.textMuted}
          />
        </AppText>
      </View>
      <AppText variant="caption" color={colors.textMuted} style={styles.note}>
        {t('goals.cardNote')}
      </AppText>
    </Card>
  );
}

const styles = {
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  amounts: {
    flexDirection: 'row' as const,
    alignItems: 'baseline' as const,
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  note: { marginTop: spacing.md },
};
