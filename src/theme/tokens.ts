export const colors = {
  background: '#FFFFFF',
  surface: '#F6F8F6',
  primary: '#2D7A4B',
  primarySoft: '#E8F5EB',
  onPrimary: '#FFFFFF',
  text: '#1B2A20',
  textMuted: '#68756C',
  border: '#E5EAE6',
  danger: '#B42318',
  dangerSoft: '#FDECEA',
  warning: '#946200',
  warningSoft: '#FFF6E5',
  disabled: '#A9B3AC',
  overlay: 'rgba(27, 42, 32, 0.45)',
} as const;

export const categoryColors = {
  amber: '#946200',
  green: '#2D7A4B',
  rose: '#9F1239',
  blue: '#1D4ED8',
  violet: '#6D28D9',
  slate: '#475569',
  stone: '#57534E',
} as const;

export type CategoryColorToken = keyof typeof categoryColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radii = {
  sm: 12,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 40, lineHeight: 44, fontWeight: '700', letterSpacing: -0.5 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  section: { fontSize: 20, lineHeight: 26, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
} as const;

export type TypographyVariant = keyof typeof typography;

export const touchTarget = 44;
export const minButtonHeight = 52;
