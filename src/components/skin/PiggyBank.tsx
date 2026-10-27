import { Image, type ImageStyle, type StyleProp } from 'react-native';

// Ilustración del producto convertida a PNG con fondo transparente (ver docs/SKINS.md).
const piggyBankSource = require('../../../assets/skin/piggy-bank.png');

const ASPECT_RATIO = 490 / 480;

export interface PiggyBankProps {
  readonly width?: number;
  readonly style?: StyleProp<ImageStyle>;
}

/** Mascota decorativa de la skin kawaii. No se anuncia a lectores de pantalla. */
export function PiggyBank({ width = 120, style }: PiggyBankProps) {
  return (
    <Image
      source={piggyBankSource}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      resizeMode="contain"
      style={[{ width, height: width * ASPECT_RATIO }, style]}
    />
  );
}
