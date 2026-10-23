import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';

import { AppText } from '@/components/ui/AppText';
import type { ChartPoint } from '@/components/charts/BarChart';
import { colors, spacing } from '@/theme';

export interface LineChartProps {
  data: readonly ChartPoint[];
  accessibilityLabel: string;
  height?: number;
}

export function LineChart({ data, accessibilityLabel, height = 160 }: LineChartProps) {
  const [width, setWidth] = useState(0);
  const max = Math.max(1, ...data.map((point) => point.value));
  const baseline = height - 8;
  const step = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data
    .map((point, index) => {
      const x = data.length === 1 ? width / 2 : index * step;
      const y = baseline - (point.value / max) * (height - 24);
      return x + ',' + y;
    })
    .join(' ');

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
        {width > 0 && data.length > 0 ? (
          <>
            <Polyline points={points} fill="none" stroke={colors.primary} strokeWidth={2.5} />
            {data.map((point, index) => (
              <Circle
                key={point.label + index}
                cx={data.length === 1 ? width / 2 : index * step}
                cy={baseline - (point.value / max) * (height - 24)}
                r={3}
                fill={colors.primary}
              />
            ))}
          </>
        ) : null}
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
