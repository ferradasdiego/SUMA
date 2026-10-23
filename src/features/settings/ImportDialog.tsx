import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import type { ExportPayload } from '@/data/export/exportData';
import type { ImportMode } from '@/data/import/importService';
import { t } from '@/i18n';
import { formatDateLabel } from '@/utils/format';
import { colors, radii, spacing } from '@/theme';

export interface ImportDialogProps {
  readonly payload: ExportPayload | null;
  readonly locale: string;
  readonly busy: boolean;
  onCancel(): void;
  onImport(mode: ImportMode): void;
}

export function ImportDialog({ payload, locale, busy, onCancel, onImport }: ImportDialogProps) {
  const [confirmingReplace, setConfirmingReplace] = useState(false);

  if (!payload) return null;

  function cancel() {
    setConfirmingReplace(false);
    onCancel();
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={cancel}>
      <Pressable style={styles.overlay} onPress={cancel} accessibilityLabel={t('common.close')}>
        <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cardContent}
            keyboardShouldPersistTaps="handled"
          >
            {confirmingReplace ? (
              <>
                <AppText variant="section">{t('import.replaceConfirmTitle')}</AppText>
                <AppText variant="body" color={colors.textMuted} style={styles.message}>
                  {t('import.replaceConfirmMessage')}
                </AppText>
                <Divider />
                <View style={styles.actions}>
                  <Button
                    label={t('common.back')}
                    onPress={() => setConfirmingReplace(false)}
                    variant="secondary"
                    disabled={busy}
                    style={styles.action}
                  />
                  <Button
                    label={busy ? t('import.replacing') : t('import.replaceConfirm')}
                    onPress={() => onImport('replace')}
                    variant="danger"
                    loading={busy}
                    disabled={busy}
                    style={styles.action}
                  />
                </View>
              </>
            ) : (
              <>
                <AppText variant="section">{t('import.title')}</AppText>
                <AppText variant="body" color={colors.textMuted} style={styles.message}>
                  {t('import.summary', {
                    date: formatDateLabel(payload.exportedAt.slice(0, 10), locale),
                    entries: payload.entries.length,
                    goals: payload.goals.length,
                    categories: payload.categories.length,
                  })}
                </AppText>

                <View style={styles.option}>
                  <AppText variant="label">{t('import.mergeTitle')}</AppText>
                  <AppText variant="caption" color={colors.textMuted}>
                    {t('import.mergeDescription')}
                  </AppText>
                </View>

                <View style={styles.option}>
                  <AppText variant="label">{t('import.replaceTitle')}</AppText>
                  <AppText variant="caption" color={colors.textMuted}>
                    {t('import.replaceDescription')}
                  </AppText>
                </View>

                <Divider />

                <View style={styles.actions}>
                  <Button
                    label={t('common.cancel')}
                    onPress={cancel}
                    variant="secondary"
                    disabled={busy}
                    style={styles.action}
                  />
                  <Button
                    label={busy ? t('import.importing') : t('import.merge')}
                    onPress={() => onImport('merge')}
                    loading={busy}
                    disabled={busy}
                    style={styles.action}
                  />
                </View>

                <Button
                  label={t('import.replace')}
                  onPress={() => setConfirmingReplace(true)}
                  variant="danger"
                  disabled={busy}
                  style={styles.replaceButton}
                />
              </>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: spacing.xl,
    maxHeight: '90%' as const,
  },
  cardContent: { flexGrow: 0 },
  scroll: { flexShrink: 1 },
  card: {
    width: '100%' as const,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.xl,
  },
  message: { marginTop: spacing.sm },
  option: { marginTop: spacing.lg, gap: spacing.xs },
  actions: {
    flexDirection: 'row' as const,
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  action: { flex: 1 },
  replaceButton: { marginTop: spacing.md },
};
