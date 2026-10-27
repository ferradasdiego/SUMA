import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  accessibilityLabel,
  testID,
  style,
}: ButtonProps) {
  const { colors, components, skin, typography } = useTheme();
  const isDisabled = disabled || loading;
  const isPaper = skin.decoration === 'paper';

  const backgrounds: Record<ButtonVariant, ViewStyle> = {
    primary: components.buttonPrimary,
    secondary: components.buttonSecondary,
    ghost: { backgroundColor: 'transparent' },
    danger: {
      ...components.buttonPrimary,
      backgroundColor: colors.danger,
      ...(isPaper ? { borderColor: colors.dangerStrong } : {}),
    },
  };

  const labelColors: Record<ButtonVariant, string> = {
    primary: colors.onPrimary,
    secondary: colors.primary,
    ghost: colors.primary,
    danger: colors.onPrimary,
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        backgrounds[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && (isPaper ? styles.pressedPaper : styles.pressed),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={labelColors[variant]} />
      ) : (
        <AppText
          variant="label"
          style={[styles.label, typography.label]}
          color={labelColors[variant]}
        >
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = {
  base: {
    minHeight: 52,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 20,
  },
  fullWidth: { alignSelf: 'stretch' as const },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.85 },
  pressedPaper: { opacity: 0.92, transform: [{ translateY: 1 }] },
  label: { fontSize: 16 },
};
