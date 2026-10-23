import { View } from 'react-native';

import { AppText } from './AppText';
import { colors, spacing } from '@/theme';

export interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <AppText variant="section">{title}</AppText>
      {action && onAction ? (
        <AppText
          variant="label"
          color={colors.primary}
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={action}
        >
          {action}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = {
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: spacing.md,
  },
};
