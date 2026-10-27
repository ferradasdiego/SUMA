import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import type { SkinId } from '@/domain/preferences/skin';
import { t } from '@/i18n';
import { SKIN_LIST, spacing, useTheme } from '@/theme';

export interface SkinPickerProps {
  readonly value: SkinId;
  onChange(skin: SkinId): void;
  readonly disabled?: boolean;
}

/**
 * Selector de skin con vista previa real de cada paleta. La miniatura usa los
 * tokens de la skin previsualizada, no los de la skin activa.
 */
export function SkinPicker({ value, onChange, disabled = false }: SkinPickerProps) {
  const { colors, components } = useTheme();

  return (
    <View style={styles.list}>
      {SKIN_LIST.map((option) => {
        const selected = option.id === value;
        const selectedLabel = selected ? ` — ${t('settings.skinActive')}` : '';
        return (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            accessibilityLabel={t(option.nameKey) + selectedLabel}
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => onChange(option.id)}
            style={({ pressed }) => [
              styles.option,
              components.card,
              components.cardShadow,
              { backgroundColor: colors.surface },
              selected && { borderColor: colors.primary },
              pressed && styles.pressed,
            ]}
          >
            <View
              style={[
                styles.preview,
                {
                  backgroundColor: option.preview.background,
                  borderColor: option.preview.ink,
                },
              ]}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <View
                style={[
                  styles.previewCard,
                  {
                    backgroundColor: option.preview.surface,
                    borderColor: option.preview.ink,
                  },
                ]}
              >
                <View
                  style={[
                    styles.previewLine,
                    { backgroundColor: option.preview.ink, opacity: 0.55 },
                  ]}
                />
                <View
                  style={[styles.previewLineShort, { backgroundColor: option.preview.accent }]}
                />
              </View>
              <View style={styles.previewSwatches}>
                {option.preview.swatches.map((swatch) => (
                  <View
                    key={swatch}
                    style={[
                      styles.swatch,
                      { backgroundColor: swatch, borderColor: option.preview.ink },
                    ]}
                  />
                ))}
              </View>
              <AppText
                style={[
                  styles.previewAa,
                  {
                    color: option.preview.ink,
                    fontFamily: option.typography.display.fontFamily,
                  },
                ]}
              >
                Aa 123
              </AppText>
            </View>

            <View style={styles.copy}>
              <AppText variant="label">{t(option.nameKey)}</AppText>
              <AppText variant="caption" color={colors.textMuted} style={styles.description}>
                {t(option.descriptionKey)}
              </AppText>
            </View>

            <View
              style={[
                styles.check,
                {
                  borderColor: selected ? colors.primary : colors.borderStrong,
                  backgroundColor: selected ? colors.primary : 'transparent',
                },
              ]}
            >
              {selected ? (
                <Ionicons name="checkmark" size={16} color={colors.onPrimary} />
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = {
  list: { gap: spacing.md },
  option: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.md,
    padding: spacing.md,
  },
  pressed: { opacity: 0.9 },
  preview: {
    width: 76,
    height: 86,
    borderRadius: 14,
    borderWidth: 1,
    padding: 7,
    justifyContent: 'space-between' as const,
  },
  previewCard: {
    borderRadius: 7,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 5,
    gap: 4,
  },
  previewLine: { height: 3, borderRadius: 2, width: '75%' },
  previewLineShort: { height: 5, borderRadius: 3, width: '45%' },
  previewSwatches: { flexDirection: 'row' as const, gap: 3 },
  swatch: { width: 9, height: 9, borderRadius: 5, borderWidth: 1 },
  previewAa: { fontSize: 15, lineHeight: 17 },
  copy: { flex: 1, gap: 2 },
  description: { marginTop: 2 },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
};
