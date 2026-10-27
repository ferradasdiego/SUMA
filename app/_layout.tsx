import { useFonts } from 'expo-font';
import { Redirect, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { AppProvider, useApp } from '@/features/app/AppProvider';
import { t } from '@/i18n';
import { skinFonts, useTheme } from '@/theme';

function AppStack() {
  const { colors } = useTheme();

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
  const { status, profile, retry } = useApp();
  const pathname = usePathname();

  if (status === 'booting') {
    return (
      <Screen>
        <LoadingState label={t('app.preparing')} />
      </Screen>
    );
  }

  if (status === 'failed' || !profile) {
    return (
      <Screen>
        <ErrorState
          title={t('app.startErrorTitle')}
          description={t('app.startErrorDescription')}
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
  // Las fuentes de la skin kawaii se cargan siempre para poder previsualizarlas
  // en Ajustes incluso con la skin clásica activa.
  const [fontsLoaded, fontError] = useFonts(skinFonts);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="dark" />
          {fontsLoaded || fontError ? (
            <RootNavigator />
          ) : (
            <Screen>
              <LoadingState label={t('app.preparing')} />
            </Screen>
          )}
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
