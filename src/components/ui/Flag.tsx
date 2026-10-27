import { View } from 'react-native';
import Svg, { Circle, Line, Polygon, Rect } from 'react-native-svg';

import type { LanguageCode } from '@/i18n';
import { useTheme } from '@/theme';

export interface FlagProps {
  readonly code: LanguageCode;
  readonly width?: number;
  readonly height?: number;
}

/** Banderas vectoriales sencillas: no dependen de emojis ni de red. */
export function Flag({ code, width = 22, height = 16 }: FlagProps) {
  const { colors } = useTheme();

  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      style={{
        width,
        height,
        borderRadius: 2,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Svg width={width} height={height} viewBox="0 0 22 16">
        {code === 'es' ? (
          <>
            <Rect width={22} height={16} fill="#AA151B" />
            <Rect y={4} width={22} height={8} fill="#F1BF00" />
          </>
        ) : null}

        {code === 'en' ? (
          <>
            <Rect width={22} height={16} fill="#012169" />
            <Line x1={0} y1={0} x2={22} y2={16} stroke="#FFFFFF" strokeWidth={3.4} />
            <Line x1={22} y1={0} x2={0} y2={16} stroke="#FFFFFF" strokeWidth={3.4} />
            <Line x1={0} y1={0} x2={22} y2={16} stroke="#C8102E" strokeWidth={1.2} />
            <Line x1={22} y1={0} x2={0} y2={16} stroke="#C8102E" strokeWidth={1.2} />
            <Rect x={8.6} width={4.8} height={16} fill="#FFFFFF" />
            <Rect y={5.6} width={22} height={4.8} fill="#FFFFFF" />
            <Rect x={10} width={2} height={16} fill="#C8102E" />
            <Rect y={7} width={22} height={2} fill="#C8102E" />
          </>
        ) : null}

        {code === 'gl' ? (
          <>
            <Rect width={22} height={16} fill="#FFFFFF" />
            <Polygon points="0,0 5,0 22,16 17,16" fill="#2A5CAA" />
          </>
        ) : null}

        {code === 'ca' ? (
          <>
            <Rect width={22} height={16} fill="#FCDD09" />
            <Rect y={1.7} width={22} height={1.8} fill="#DA121A" />
            <Rect y={5.3} width={22} height={1.8} fill="#DA121A" />
            <Rect y={8.9} width={22} height={1.8} fill="#DA121A" />
            <Rect y={12.5} width={22} height={1.8} fill="#DA121A" />
          </>
        ) : null}

        {code === 'pt' ? (
          <>
            <Rect width={9} height={16} fill="#046A38" />
            <Rect x={9} width={13} height={16} fill="#DA291C" />
            <Circle cx={9} cy={8} r={3.2} fill="#FFE900" />
            <Circle cx={9} cy={8} r={1.5} fill="#DA291C" />
          </>
        ) : null}
      </Svg>
    </View>
  );
}
