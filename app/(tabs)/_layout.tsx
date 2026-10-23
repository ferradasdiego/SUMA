import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, typography } from '@/theme';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          ...(isWeb
            ? { height: 70 + insets.bottom, paddingTop: 8, paddingBottom: 10 + insets.bottom }
            : {}),
        },
        tabBarLabelStyle: {
          fontSize: isWeb ? 11 : typography.caption.fontSize,
          fontWeight: '600',
          ...(isWeb
            ? { marginBottom: 2, height: 16, lineHeight: 16, flexShrink: 0, letterSpacing: -0.2 }
            : {}),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={focused ? colors.primary : colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Añadir',
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={size}
              color={focused ? colors.primary : colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historial',
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={focused ? 'time' : 'time-outline'}
              size={size}
              color={focused ? colors.primary : colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={focused ? 'stats-chart' : 'stats-chart-outline'}
              size={size}
              color={focused ? colors.primary : colors.textMuted}
            />
          ),
        }}
      />
    </Tabs>
  );
}
