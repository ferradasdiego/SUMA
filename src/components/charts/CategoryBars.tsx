import { View, type DimensionValue } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { AmountText } from '@/components/ui/AmountText';
import { formatAmount } from '@/domain/money/money';
import { spacing, useTheme } from '@/theme';

export interface CategoryBarItem {
  readonly categoryId: string;
  readonly label: string;
  readonly totalMinor: number;
  readonly share: number;
  readonly color: string;
}

export interface CategoryBarsProps {
  data: readonly CategoryBarItem[];
  currency: string;
  locale: string;
}

export function CategoryBars({ data, currency, locale }: CategoryBarsProps) {
  const { colors, radii, skin } = useTheme();
  const max = Math.max(1, ...data.map((item) => item.totalMinor));
  const trackColor = skin.decoration === 'paper' ? colors.track : colors.surface;

  return (
    <View style={{ gap: spacing.md }}>
      {data.map((item) => (
        <View key={item.categoryId} style={{ gap: spacing.xs }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: spacing.sm,
            }}
          >
            <AppText variant="label" numberOfLines={1} style={{ flex: 1 }}>
              {item.label}
            </AppText>
            <AmountText
              minor={item.totalMinor}
              currency={currency}
              locale={locale}
              variant="label"
            />
            <AppText
              variant="caption"
              color={colors.textMuted}
              style={{ minWidth: 44, textAlign: 'right' }}
            >
              {Math.round(item.share * 100)} %
            </AppText>
          </View>
          <View
            style={{
              height: 8,
              backgroundColor: trackColor,
              borderRadius: radii.pill,
              overflow: 'hidden',
            }}
            accessible
            accessibilityLabel={
              item.label + ': ' + formatAmount(item.totalMinor, { currency, locale })
            }
          >
            <View
              style={{
                height: 8,
                width: (Math.max(4, (item.totalMinor / max) * 100) + '%') as DimensionValue,
                backgroundColor: item.color,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
