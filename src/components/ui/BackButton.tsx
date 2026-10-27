import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

import { t } from '@/i18n';
import { useTheme } from '@/theme';
import { spacing } from '@/theme/tokens';

import { AppText } from './AppText';

export interface BackButtonProps {
  label?: string;
}

export function BackButton({ label = t('common.back') }: BackButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => router.back()}
      hitSlop={8}
      style={styles.row}
    >
      <Ionicons name="chevron-back" size={20} color={colors.primary} />
      <AppText variant="label" color={colors.primary}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = {
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    alignSelf: 'flex-start' as const,
    gap: 2,
    marginBottom: spacing.sm,
  },
};
