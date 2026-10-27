import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/features/app/AppProvider';
import { t } from '@/i18n';
import { useTheme } from '@/theme';

export default function TabsLayout() {
  // Suscribe la barra de pestañas al cambio de idioma y de skin del perfil.
  useApp();
  const { colors, components, skin, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const isPaper = skin.decoration === 'paper';

  function icon(
    focusedName: keyof typeof Ionicons.glyphMap,
    outlineName: keyof typeof Ionicons.glyphMap,
    focused: boolean,
  ) {
    return (
      <Ionicons
        name={focused ? focusedName : outlineName}
        size={isPaper ? 22 : 24}
        color={focused ? colors.primary : colors.textMuted}
      />
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          ...components.tabBar,
          ...(isWeb
            ? { height: 70 + insets.bottom, paddingTop: 8, paddingBottom: 10 + insets.bottom }
            : {}),
        },
        tabBarLabelStyle: {
          ...(isPaper
            ? { fontFamily: typography.caption.fontFamily, fontSize: 12, lineHeight: 16 }
            : { fontSize: isWeb ? 11 : typography.caption.fontSize, fontWeight: '600' }),
          ...(isWeb
            ? { marginBottom: 2, height: 16, lineHeight: 16, flexShrink: 0, letterSpacing: -0.2 }
            : {}),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ focused }) => icon('home', 'home-outline', focused),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: t('nav.add'),
          tabBarIcon: ({ focused }) =>
            isPaper ? (
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: -8,
                  borderWidth: 2,
                  borderColor: colors.primaryStrong,
                }}
              >
                <Ionicons name="add" size={26} color={colors.onPrimary} />
              </View>
            ) : (
              icon('add-circle', 'add-circle-outline', focused)
            ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('nav.history'),
          tabBarIcon: ({ focused }) => icon('time', 'time-outline', focused),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: t('nav.statistics'),
          tabBarIcon: ({ focused }) => icon('stats-chart', 'stats-chart-outline', focused),
        }}
      />
    </Tabs>
  );
}
