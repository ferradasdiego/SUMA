import { router } from 'expo-router';
import { View } from 'react-native';

import { EmptyState } from '@/components/feedback/EmptyState';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing } from '@/theme';

export default function HomeScreen() {
  return (
    <Screen>
      <AppText variant="title">SUMA</AppText>
      <View style={{ marginTop: spacing.xs, marginBottom: spacing.xxl }}>
        <AppText variant="body" color={colors.textMuted}>
          Tu dinero no gastado
        </AppText>
      </View>
      <EmptyState
        icon="sparkles-outline"
        title="Todavía no hay registros"
        description="Cuando registres tu primera decisión, verás aquí tu progreso."
        actionLabel="Registrar una decisión"
        onAction={() => router.push('/add')}
      />
    </Screen>
  );
}
