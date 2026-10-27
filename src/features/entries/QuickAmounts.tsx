import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Modal, Pressable, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { formatAmountInput, parseAmount } from '@/domain/money/money';
import { resolveQuickAmounts } from '@/domain/preferences/quickAmounts';
import { useApp } from '@/features/app/AppProvider';
import { t, translateError } from '@/i18n';
import { spacing, useTheme, type Theme } from '@/theme';

export interface QuickAmountsProps {
  readonly currency: string;
  readonly locale: string;
  readonly selectedAmount: number | null;
  onPick(minor: number): void;
}

/**
 * Importes rápidos configurables. El lápiz activa el modo edición;
 * en ese modo, tocar un importe abre el diálogo para cambiarlo.
 */
export function QuickAmounts({ currency, locale, selectedAmount, onPick }: QuickAmountsProps) {
  const theme = useTheme();
  const { colors, components } = theme;
  const styles = createStyles(theme);
  const isPaper = theme.skin.decoration === 'paper';
  const { profile, updateProfile } = useApp();
  const [editing, setEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const values = resolveQuickAmounts(profile?.quickAmountsMinor);

  function openEditor(index: number) {
    const value = values[index];
    if (value === undefined) return;
    setEditingIndex(index);
    setDraft(formatAmountInput(value, { currency, locale }));
    setError(null);
  }

  function closeEditor() {
    if (saving) return;
    setEditingIndex(null);
    setError(null);
  }

  async function save() {
    if (editingIndex === null) return;

    const parsed = parseAmount(draft, { currency, locale });
    if (!parsed.ok) {
      setError(translateError(parsed.error));
      return;
    }

    const next = values.map((value, index) => (index === editingIndex ? parsed.value : value));

    setSaving(true);
    const result = await updateProfile({ quickAmountsMinor: next });
    setSaving(false);

    if (!result.ok) {
      setError(translateError(result.error));
      return;
    }

    setEditingIndex(null);
    setError(null);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={editing ? t('add.quickDone') : t('add.quickEdit')}
          accessibilityState={{ selected: editing }}
          onPress={() => setEditing((current) => !current)}
          hitSlop={10}
          style={[styles.pencil, editing && styles.pencilActive]}
        >
          <Ionicons
            name={editing ? 'pencil' : 'pencil-outline'}
            size={16}
            color={editing ? colors.onPrimary : colors.primary}
          />
        </Pressable>
        <AppText variant="label">{t('add.quickAmounts')}</AppText>
      </View>

      {editing ? (
        <AppText variant="caption" color={colors.textMuted} style={styles.hint}>
          {t('add.quickHint')}
        </AppText>
      ) : null}

      <View style={styles.chips}>
        {values.map((value, index) => (
          <Chip
            key={index}
            label={formatAmountInput(value, { currency, locale })}
            selected={selectedAmount === value}
            onPress={() => {
              if (editing) openEditor(index);
              else onPick(value);
            }}
            icon={
              editing ? <Ionicons name="pencil" size={12} color={colors.textMuted} /> : undefined
            }
          />
        ))}
      </View>

      <Modal
        visible={editingIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={closeEditor}
      >
        <Pressable
          style={styles.overlay}
          onPress={closeEditor}
          accessibilityLabel={t('common.close')}
        >
          <Pressable
            style={[components.dialog, isPaper && styles.sticker, styles.card]}
            onPress={(event) => event.stopPropagation()}
          >
            <AppText variant="section">{t('add.quickDialogTitle')}</AppText>
            <AppText variant="caption" color={colors.textMuted} style={styles.dialogHint}>
              {t('add.quickDialogHint')}
            </AppText>

            <AppText variant="label" style={styles.dialogLabel}>
              {t('add.amount')}
            </AppText>
            <TextInput
              value={draft}
              onChangeText={(text) => {
                setDraft(text);
                setError(null);
              }}
              keyboardType="decimal-pad"
              placeholder={t('add.amountPlaceholder')}
              placeholderTextColor={colors.textMuted}
              style={[styles.input, error ? styles.inputError : undefined]}
              accessibilityLabel={t('add.quickInputA11y')}
              autoFocus
              maxLength={12}
            />
            {error ? (
              <AppText variant="caption" color={colors.danger} accessibilityLiveRegion="polite">
                {error}
              </AppText>
            ) : null}

            <View style={styles.actions}>
              <Button
                label={t('common.cancel')}
                onPress={closeEditor}
                variant="secondary"
                disabled={saving}
                style={styles.action}
              />
              <Button
                label={t('add.quickSave')}
                accessibilityLabel={t('add.quickSaveA11y')}
                onPress={() => {
                  void save();
                }}
                loading={saving}
                disabled={saving}
                style={styles.action}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function createStyles(theme: Theme) {
  const { colors, components, radii, typography } = theme;
  const boldFamily = typography.section.fontFamily;

  return {
    container: { gap: spacing.sm },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    pencil: {
      ...components.chip,
      width: 32,
      height: 32,
      borderRadius: radii.sm,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    pencilActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    hint: { marginBottom: spacing.xs },
    chips: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: spacing.sm },
    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      padding: spacing.xl,
    },
    card: {
      width: '100%' as const,
      gap: spacing.xs,
    },
    sticker: {
      shadowColor: colors.stickerShadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 6,
    },
    dialogHint: { marginTop: spacing.xs },
    dialogLabel: { marginTop: spacing.lg, marginBottom: spacing.xs },
    input: {
      ...components.input,
      minHeight: 56,
      paddingHorizontal: spacing.lg,
      fontSize: 24,
      color: colors.text,
      ...(boldFamily ? { fontFamily: boldFamily } : { fontWeight: '700' as const }),
    },
    inputError: { borderColor: colors.danger },
    actions: {
      flexDirection: 'row' as const,
      gap: spacing.md,
      marginTop: spacing.xl,
    },
    action: { flex: 1 },
  };
}
