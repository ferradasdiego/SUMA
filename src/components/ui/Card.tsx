import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';
import type { CardTone } from '@/theme/skins/types';

export interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: CardTone;
  testID?: string;
}

/** Tarjeta temática. `tone` solo tiene efecto en skins con superficies pastel. */
export function Card({ children, style, tone = 'plain', testID }: CardProps) {
  const { colors, components } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        components.card,
        components.cardShadow,
        { backgroundColor: colors.surfaces[tone] },
        style,
      ]}
    >
      {children}
    </View>
  );
}
