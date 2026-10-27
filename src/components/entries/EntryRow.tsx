import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { AmountText } from '@/components/ui/AmountText';
import { AppText } from '@/components/ui/AppText';
import { categoryLabel } from '@/i18n';
import type { Category, Entry } from '@/domain/entities/types';
import { formatDateLabel } from '@/utils/format';
import { spacing, useTheme } from '@/theme';
import type { CategoryColorToken } from '@/theme/skins/types';

export interface EntryRowProps {
  entry: Entry;
  category: Category | undefined;
  locale: string;
}

export function EntryRow({ entry, category, locale }: EntryRowProps) {
  const { colors, categoryColors, categoryTones, skin } = useTheme();
  const token = (category?.colorToken ?? 'stone') as CategoryColorToken;
  const accent = categoryColors[token] ?? colors.textMuted;
  const label = entry.note?.trim()
    ? entry.note.trim()
    : categoryLabel(category?.nameKey ?? 'category.other');
  const isPaper = skin.decoration === 'paper';

  return (
    <View style={[styles.row, isPaper && styles.rowPaper]}>
      <View
        style={[
          styles.icon,
          isPaper && styles.iconPaper,
          {
            backgroundColor: isPaper ? colors.surfaces[categoryTones[token]] : colors.surface,
            borderColor: accent,
            borderRadius: isPaper ? 21 : 12,
          },
        ]}
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
        <AppText variant="body" numberOfLines={isPaper ? 2 : 1}>
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
        color={isPaper ? colors.positive : colors.primary}
        style={[styles.amount, isPaper && styles.amountPaper]}
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
  rowPaper: {
    alignItems: 'flex-start' as const,
  },
  icon: {
    width: 40,
    height: 40,
    borderWidth: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  iconPaper: { marginTop: 2 },
  content: { flex: 1, gap: 2 },
  amount: { textAlign: 'right' as const },
  amountPaper: { marginTop: 3 },
};
