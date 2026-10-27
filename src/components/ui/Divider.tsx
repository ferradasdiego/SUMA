import { View } from 'react-native';

import { useTheme } from '@/theme';
import { spacing } from '@/theme/tokens';

export function Divider() {
  const { components } = useTheme();

  return <View style={[components.divider, { marginVertical: spacing.lg }]} />;
}
