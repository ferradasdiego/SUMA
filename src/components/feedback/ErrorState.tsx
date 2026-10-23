import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { t } from '@/i18n';
import { colors, spacing } from '@/theme';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = t('feedback.errorTitle'),
  description = t('feedback.errorDescription'),
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container} accessibilityRole="alert" accessibilityLiveRegion="assertive">
      <Ionicons name="alert-circle-outline" size={32} color={colors.danger} />
      <AppText variant="section" align="center" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="body" color={colors.textMuted} align="center">
        {description}
      </AppText>
      {onRetry ? (
        <Button
          label={t('feedback.retry')}
          onPress={onRetry}
          variant="secondary"
          style={styles.action}
        />
      ) : null}
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
  title: { marginTop: spacing.md, marginBottom: spacing.xs },
  action: { marginTop: spacing.xl, alignSelf: 'center' as const, paddingHorizontal: spacing.xxl },
};
