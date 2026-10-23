import { Modal, Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { colors, radii, spacing } from '@/theme';

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
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel} accessibilityLabel="Cerrar diálogo">
        <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
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

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: spacing.xl,
  },
  card: {
    width: '100%' as const,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.xl,
  },
  message: { marginTop: spacing.sm },
  actions: {
    flexDirection: 'row' as const,
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  action: { flex: 1 },
};
