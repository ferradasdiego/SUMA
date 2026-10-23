import type { ReactNode } from 'react';
import { Pressable } from 'react-native';

import { AppText } from './AppText';
import { colors, radii, spacing } from '@/theme';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
  testID?: string;
}

export function Chip({ label, selected = false, onPress, icon, testID }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.unselected,
        pressed && styles.pressed,
      ]}
    >
      {icon}
      <AppText variant="label" color={selected ? colors.primary : colors.textMuted}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = {
  base: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  selected: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  unselected: { backgroundColor: colors.background, borderColor: colors.border },
  pressed: { opacity: 0.8 },
};
