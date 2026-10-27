import { View } from 'react-native';

import { Sparkle } from '@/components/skin/Doodle';
import { useTheme } from '@/theme';
import { spacing } from '@/theme/tokens';

import { AppText } from './AppText';

export interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  const { colors, illustration, skin } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.titleRow}>
        <AppText variant="section">{title}</AppText>
        {skin.decoration === 'paper' ? (
          <Sparkle size={14} color={illustration?.sparkle ?? colors.doodle} />
        ) : null}
      </View>
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
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
    flexShrink: 1,
  },
};
