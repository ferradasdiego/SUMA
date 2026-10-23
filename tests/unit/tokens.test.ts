import { categoryColors, colors } from '@/theme';

function luminance(hex: string): number {
  const channels = hex
    .replace('#', '')
    .match(/../g)!
    .map((pair) => parseInt(pair, 16) / 255)
    .map((value) => (value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)));

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  const [high, low] = a > b ? [a, b] : [b, a];
  return (high + 0.05) / (low + 0.05);
}

describe('tokens de color', () => {
  it('mantiene contraste AA para texto principal y secundario', () => {
    expect(contrast(colors.text, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.text, colors.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.textMuted, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.textMuted, colors.surface)).toBeGreaterThanOrEqual(4.5);
  });

  it('mantiene contraste AA para acciones y errores', () => {
    expect(contrast(colors.primary, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.onPrimary, colors.primary)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.danger, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.warning, colors.background)).toBeGreaterThanOrEqual(4.5);
  });

  it('mantiene contraste AA para los colores de categoría', () => {
    for (const color of Object.values(categoryColors)) {
      expect(contrast(color, colors.background)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
