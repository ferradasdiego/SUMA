import { Text, type TextProps } from 'react-native';

import { formatAmount } from '@/domain/money/money';
import { useTheme } from '@/theme';
import type { TypographyVariant } from '@/theme/skins/types';

export interface AmountTextProps extends TextProps {
  minor: number;
  currency: string;
  locale: string;
  variant?: TypographyVariant;
  color?: string;
}

export function AmountText({
  minor,
  currency,
  locale,
  variant = 'body',
  color,
  style,
  ...rest
}: AmountTextProps) {
  const { colors, typography } = useTheme();

  return (
    <Text
      {...rest}
      style={[
        typography[variant],
        { color: color ?? colors.text, fontVariant: ['tabular-nums'] },
        style,
      ]}
    >
      {formatAmount(minor, { currency, locale })}
    </Text>
  );
}
