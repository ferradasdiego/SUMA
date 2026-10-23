import { Link } from 'expo-router';

import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing } from '@/theme';

export default function NotFoundScreen() {
  return (
    <Screen>
      <AppText variant="title">Pantalla no encontrada</AppText>
      <AppText variant="body" color={colors.textMuted} style={{ marginTop: spacing.sm }}>
        Esta ruta no existe.
      </AppText>
      <Link href="/" style={{ marginTop: spacing.xl, color: colors.primary }}>
        Volver al inicio
      </Link>
    </Screen>
  );
}
