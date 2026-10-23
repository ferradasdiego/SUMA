import Constants from 'expo-constants';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing } from '@/theme';

export default function SettingsScreen() {
  const version = Constants.expoConfig?.version ?? '0.1.0';

  return (
    <Screen scroll>
      <AppText variant="title" style={{ marginBottom: spacing.lg }}>
        Ajustes
      </AppText>
      <Card>
        <AppText variant="label">Acerca de SUMA</AppText>
        <AppText variant="body" color={colors.textMuted} style={{ marginTop: spacing.xs }}>
          Versión {version}
        </AppText>
      </Card>
      <View style={{ marginTop: spacing.xxl }}>
        <AppText variant="caption" color={colors.textMuted} align="center">
          El importe registrado es una estimación de lo que has decidido no gastar. No implica que
          el dinero esté apartado.
        </AppText>
      </View>
    </Screen>
  );
}
