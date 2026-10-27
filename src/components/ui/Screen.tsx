import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import type { ReactNode } from 'react';

import { useTheme } from '@/theme';
import { spacing } from '@/theme/tokens';

import { PaperBackdrop } from '../skin/PaperBackdrop';

export interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: readonly Edge[];
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Screen({
  children,
  scroll = false,
  padded = true,
  edges = ['top', 'left', 'right'],
  style,
  testID,
}: ScreenProps) {
  const { colors, skin } = useTheme();
  const contentStyle = [scroll ? styles.scrollInner : styles.inner, padded && styles.padded, style];

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.safe, { backgroundColor: colors.background }]}
      testID={testID}
    >
      {skin.decoration === 'paper' ? <PaperBackdrop /> : null}
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <View style={contentStyle}>{children}</View>
        </ScrollView>
      ) : (
        <View style={contentStyle}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = {
  safe: { flex: 1 },
  inner: { flex: 1 },
  scrollInner: { flexGrow: 1 },
  scrollContent: { flexGrow: 1 },
  padded: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
};
