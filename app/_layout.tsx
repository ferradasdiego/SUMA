import { Redirect, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { AppProvider, useApp } from '@/features/app/AppProvider';
import { colors } from '@/theme';

function AppStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
      <Stack.Screen name="goals" options={{ presentation: 'modal' }} />
      <Stack.Screen name="settings" />
      <Stack.Screen name="entry/[id]" />
    </Stack>
  );
}

function RootNavigator() {
  const { status, profile, error, retry } = useApp();
  const pathname = usePathname();

  if (status === 'booting') {
    return (
      <Screen>
        <LoadingState label="Preparando SUMA…" />
      </Screen>
    );
  }

  if (status === 'failed' || !profile) {
    return (
      <Screen>
        <ErrorState
          title="No se pudo iniciar SUMA"
          description={
            error?.message ?? 'Revisa el almacenamiento del dispositivo e inténtalo de nuevo.'
          }
          onRetry={retry}
        />
      </Screen>
    );
  }

  if (!profile.onboardingCompleted) {
    return pathname === '/onboarding' ? <AppStack /> : <Redirect href="/onboarding" />;
  }

  if (pathname === '/onboarding') {
    return <Redirect href="/(tabs)" />;
  }

  return <AppStack />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
