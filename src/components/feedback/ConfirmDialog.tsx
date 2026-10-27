import { Modal, Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { t } from '@/i18n';
import { spacing, useTheme, type Theme } from '@/theme';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = t('common.confirm'),
  cancelLabel = t('common.cancel'),
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { colors, components, skin } = useTheme();
  const styles = createStyles(colors);
  const isPaper = skin.decoration === 'paper';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        style={styles.overlay}
        onPress={onCancel}
        accessibilityLabel={t('feedback.closeDialog')}
      >
        <Pressable
          style={[components.dialog, isPaper && styles.sticker, styles.card]}
          onPress={(event) => event.stopPropagation()}
        >
          <AppText variant="section">{title}</AppText>
          <AppText variant="body" color={colors.textMuted} style={styles.message}>
            {message}
          </AppText>
          <View style={styles.actions}>
            <Button
              label={cancelLabel}
              onPress={onCancel}
              variant="secondary"
              style={styles.action}
            />
            <Button
              label={confirmLabel}
              onPress={onConfirm}
              variant={destructive ? 'danger' : 'primary'}
              style={styles.action}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function createStyles(colors: Theme['colors']) {
  return {
    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      padding: spacing.xl,
    },
    card: { width: '100%' as const },
    sticker: {
      shadowColor: colors.stickerShadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 6,
    },
    message: { marginTop: spacing.sm },
    actions: {
      flexDirection: 'row' as const,
      gap: spacing.md,
      marginTop: spacing.xl,
    },
    action: { flex: 1 },
  };
}
