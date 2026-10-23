import { ActivityIndicator, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { t } from '@/i18n';
import { colors, spacing } from '@/theme';

export interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = t('feedback.loading') }: LoadingStateProps) {
  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator color={colors.primary} />
      <AppText variant="caption" color={colors.textMuted} style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: spacing.xxl,
  },
  label: { marginTop: spacing.md },
};
