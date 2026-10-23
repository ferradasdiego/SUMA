import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { AmountText } from '@/components/ui/AmountText';
import { AppText } from '@/components/ui/AppText';
import { categoryLabel } from '@/i18n';
import type { Category, Entry } from '@/domain/entities/types';
import { formatDateLabel } from '@/utils/format';
import { categoryColors, colors, radii, spacing } from '@/theme';

export interface EntryRowProps {
  entry: Entry;
  category: Category | undefined;
  locale: string;
}

export function EntryRow({ entry, category, locale }: EntryRowProps) {
  const token = (category?.colorToken ?? 'stone') as keyof typeof categoryColors;
  const accent = categoryColors[token] ?? colors.textMuted;
  const label = entry.note?.trim()
    ? entry.note.trim()
    : categoryLabel(category?.nameKey ?? 'category.other');

  return (
    <View style={styles.row}>
      <View
        style={[styles.icon, { backgroundColor: colors.surface, borderColor: accent }]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Ionicons
          name={(category?.icon ?? 'pricetag-outline') as keyof typeof Ionicons.glyphMap}
          size={18}
          color={accent}
        />
      </View>
      <View style={styles.content}>
        <AppText variant="body" numberOfLines={1}>
          {label}
        </AppText>
        <AppText variant="caption" color={colors.textMuted}>
          {categoryLabel(category?.nameKey ?? 'category.other')} ·{' '}
          {formatDateLabel(entry.occurredLocalDate, locale)}
        </AppText>
      </View>
      <AmountText
        minor={entry.amountMinor}
        currency={entry.currency}
        locale={locale}
        variant="body"
        color={colors.primary}
        style={styles.amount}
      />
    </View>
  );
}

const styles = {
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    borderWidth: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  content: { flex: 1, gap: 2 },
  amount: { textAlign: 'right' as const },
};
