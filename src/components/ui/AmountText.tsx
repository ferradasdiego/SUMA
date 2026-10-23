import { Text, type TextProps } from 'react-native';

import { formatAmount } from '@/domain/money/money';
import { colors, typography, type TypographyVariant } from '@/theme';

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
  color = colors.text,
  style,
  ...rest
}: AmountTextProps) {
  return (
    <Text {...rest} style={[typography[variant], { color, fontVariant: ['tabular-nums'] }, style]}>
      {formatAmount(minor, { currency, locale })}
    </Text>
  );
}
