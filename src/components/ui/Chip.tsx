import type { ReactNode } from 'react';
import { Pressable } from 'react-native';

import { useTheme } from '@/theme';
import { spacing } from '@/theme/tokens';

import { AppText } from './AppText';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
  testID?: string;
}

export function Chip({ label, selected = false, onPress, icon, testID }: ChipProps) {
  const { colors, components, skin } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        components.chip,
        selected && components.chipSelected,
        pressed && (skin.decoration === 'paper' ? styles.pressedPaper : styles.pressed),
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
    borderRadius: 999,
  },
  pressed: { opacity: 0.8 },
  pressedPaper: { opacity: 0.85, transform: [{ translateY: 1 }] },
};
