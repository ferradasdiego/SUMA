import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';

import { AppText } from '@/components/ui/AppText';
import { colors, spacing } from '@/theme';

export interface ChartPoint {
  readonly label: string;
  readonly value: number;
}

export interface BarChartProps {
  data: readonly ChartPoint[];
  accessibilityLabel: string;
  height?: number;
}

export function BarChart({ data, accessibilityLabel, height = 160 }: BarChartProps) {
  const [width, setWidth] = useState(0);
  const max = Math.max(1, ...data.map((point) => point.value));
  const baseline = height - 8;
  const slot = data.length > 0 ? width / data.length : 0;
  const barWidth = Math.max(2, slot * 0.6);

  function onLayout(event: LayoutChangeEvent) {
    setWidth(event.nativeEvent.layout.width);
  }

  return (
    <View
      onLayout={onLayout}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <Svg width="100%" height={height}>
        <Line
          x1={0}
          y1={baseline}
          x2={width}
          y2={baseline}
          stroke={colors.border}
          strokeWidth={1}
        />
        {width > 0
          ? data.map((point, index) => {
              const barHeight = (point.value / max) * (height - 24);
              return (
                <Rect
                  key={point.label + index}
                  x={index * slot + (slot - barWidth) / 2}
                  y={baseline - barHeight}
                  width={barWidth}
                  height={Math.max(0, barHeight)}
                  rx={3}
                  fill={colors.primary}
                  opacity={point.value === 0 ? 0.15 : 1}
                />
              );
            })
          : null}
      </Svg>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: spacing.xs,
        }}
      >
        {data.length <= 12 ? (
          data.map((point, index) => (
            <AppText key={point.label + index} variant="caption" color={colors.textMuted}>
              {point.label}
            </AppText>
          ))
        ) : (
          <>
            <AppText variant="caption" color={colors.textMuted}>
              {data[0]?.label}
            </AppText>
            <AppText variant="caption" color={colors.textMuted}>
              {data[data.length - 1]?.label}
            </AppText>
          </>
        )}
      </View>
    </View>
  );
}
