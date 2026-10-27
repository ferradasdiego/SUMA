import { Text, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/theme';
import type { TypographyVariant } from '@/theme/skins/types';

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: TextStyle['textAlign'];
}

export function AppText({ variant = 'body', color, align, style, ...rest }: AppTextProps) {
  const { colors, typography } = useTheme();

  return (
    <Text
      {...rest}
      style={[typography[variant], { color: color ?? colors.text, textAlign: align }, style]}
    />
  );
}
