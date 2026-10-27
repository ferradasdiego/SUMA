import { View, type DimensionValue } from 'react-native';

import { useTheme } from '@/theme';

export interface ProgressBarProps {
  ratio: number;
  accessibilityLabel: string;
}

export function ProgressBar({ ratio, accessibilityLabel }: ProgressBarProps) {
  const { colors, skin, radii } = useTheme();
  const clamped = Math.max(0, Math.min(1, ratio));
  const percent = Math.round(clamped * 100);
  const width = (clamped * 100 + '%') as DimensionValue;
  const height = skin.decoration === 'paper' ? 14 : 10;
  const trackColor = skin.decoration === 'paper' ? colors.track : colors.primarySoft;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      style={{
        height,
        borderRadius: radii.pill,
        backgroundColor: trackColor,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          height,
          width,
          borderRadius: radii.pill,
          backgroundColor: colors.primary,
        }}
      />
    </View>
  );
}
