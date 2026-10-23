import { router } from 'expo-router';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { colors, spacing } from '@/theme';

export default function OnboardingScreen() {
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <AppText variant="display">SUMA</AppText>
        <AppText variant="title" style={{ marginTop: spacing.sm }}>
          Cada decisión cuenta
        </AppText>
        <AppText variant="body" color={colors.textMuted} style={{ marginTop: spacing.md }}>
          Registra el dinero que decides no gastar y mira cómo crece tu progreso. No es una cuenta
          bancaria: es tu hábito, en cifras.
        </AppText>
      </View>
      <Button label="Empezar" onPress={() => router.replace('/(tabs)')} />
    </Screen>
  );
}
