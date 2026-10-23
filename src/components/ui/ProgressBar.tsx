import { View, type DimensionValue } from 'react-native';

import { colors, radii } from '@/theme';

export interface ProgressBarProps {
  ratio: number;
  accessibilityLabel: string;
}

export function ProgressBar({ ratio, accessibilityLabel }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, ratio));
  const percent = Math.round(clamped * 100);
  const width = (clamped * 100 + '%') as DimensionValue;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      style={styles.track}
    >
      <View style={[styles.fill, { width }]} />
    </View>
  );
}

const styles = {
  track: {
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    overflow: 'hidden' as const,
  },
  fill: {
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
};
