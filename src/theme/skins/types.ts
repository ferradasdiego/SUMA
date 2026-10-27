import type { TextStyle, ViewStyle } from 'react-native';

import type { SkinId } from '@/domain/preferences/skin';
import type { TranslationKey } from '@/i18n';

export type TypographyVariant = 'display' | 'title' | 'section' | 'body' | 'label' | 'caption';

export type CategoryColorToken =
  | 'amber'
  | 'green'
  | 'rose'
  | 'blue'
  | 'violet'
  | 'slate'
  | 'stone';

/** Tonos pastel reutilizables para tarjetas. En la skin clásica todos son iguales. */
export type CardTone = 'plain' | 'mint' | 'blue' | 'pink' | 'butter' | 'lilac';

export interface SkinColors {
  readonly background: string;
  readonly surface: string;
  readonly surfaceMuted: string;
  readonly primary: string;
  /** Variante oscura de primary para bordes de botones y pestañas. */
  readonly primaryStrong: string;
  readonly primarySoft: string;
  readonly onPrimary: string;
  readonly text: string;
  readonly textMuted: string;
  readonly border: string;
  /** Bordes de controles (inputs, chips): deben superar 3:1. */
  readonly borderStrong: string;
  readonly danger: string;
  readonly dangerStrong: string;
  readonly dangerSoft: string;
  readonly warning: string;
  readonly warningSoft: string;
  readonly disabled: string;
  readonly overlay: string;
  readonly positive: string;
  readonly negative: string;
  readonly tabBar: string;
  readonly tabBarBorder: string;
  readonly inputBackground: string;
  readonly stickerShadow: string;
  readonly doodle: string;
  /** Fondo de barras de progreso y de categorías; debe verse sobre cualquier tarjeta. */
  readonly track: string;
  readonly surfaces: Readonly<Record<CardTone, string>>;
}

export interface SkinIllustration {
  readonly sparkle: string;
  readonly heart: string;
}

export interface SkinComponents {
  readonly card: ViewStyle;
  readonly cardShadowWrap?: ViewStyle;
  readonly cardShadow?: ViewStyle;
  readonly buttonPrimary: ViewStyle;
  readonly buttonSecondary: ViewStyle;
  readonly input: ViewStyle;
  readonly chip: ViewStyle;
  readonly chipSelected: ViewStyle;
  readonly dialog: ViewStyle;
  readonly tabBar: ViewStyle;
  readonly divider: ViewStyle;
}

export interface SkinRadii {
  readonly sm: number;
  readonly md: number;
  readonly lg: number;
  readonly pill: number;
}

export interface SkinPreview {
  readonly background: string;
  readonly surface: string;
  readonly accent: string;
  readonly ink: string;
  readonly swatches: readonly string[];
}

export interface Skin {
  readonly id: SkinId;
  readonly nameKey: TranslationKey;
  readonly descriptionKey: TranslationKey;
  readonly isDefault: boolean;
  /** 'paper' activa el fondo de papel y los doodles decorativos. */
  readonly decoration: 'plain' | 'paper';
  readonly colors: SkinColors;
  readonly categoryColors: Readonly<Record<CategoryColorToken, string>>;
  readonly categoryTones: Readonly<Record<CategoryColorToken, CardTone>>;
  readonly typography: Readonly<Record<TypographyVariant, TextStyle>>;
  readonly radii: SkinRadii;
  readonly components: SkinComponents;
  readonly illustration: SkinIllustration | null;
  readonly preview: SkinPreview;
}
