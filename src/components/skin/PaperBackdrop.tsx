import { StyleSheet, View } from 'react-native';
import { Svg, Circle, Defs, Pattern, Rect } from 'react-native-svg';

import { useTheme } from '@/theme';

/**
 * Fondo de papel de la skin kawaii: grano de puntos muy sutil. Los doodles
 * viven dentro de las tarjetas y secciones, no fijos tras el contenido, para
 * que nunca choquen con textos ni controles al hacer scroll.
 */
export function PaperBackdrop() {
  const { colors } = useTheme();

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="suma-paper-dots" width={22} height={22} patternUnits="userSpaceOnUse">
            <Circle cx={2} cy={2} r={0.9} fill={colors.border} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#suma-paper-dots)" opacity={0.55} />
      </Svg>
    </View>
  );
}
