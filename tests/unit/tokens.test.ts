import { SKIN_LIST, SKINS } from '@/theme';

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

describe('tokens de las skins', () => {
  it('registra skins únicas con una clásica por defecto', () => {
    const ids = SKIN_LIST.map((skin) => skin.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(SKIN_LIST.filter((skin) => skin.isDefault)).toHaveLength(1);
    expect(SKINS.classic.isDefault).toBe(true);
    expect(SKINS.kawaii.isDefault).toBe(false);
  });

  it.each(SKIN_LIST)('mantiene contraste AA para texto en $id', (skin) => {
    const { colors } = skin;
    expect(contrast(colors.text, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.text, colors.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.textMuted, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.textMuted, colors.surface)).toBeGreaterThanOrEqual(4.5);
    for (const surface of Object.values(colors.surfaces)) {
      expect(contrast(colors.text, surface)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(colors.textMuted, surface)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it.each(SKIN_LIST)('mantiene contraste AA en acciones y estados en $id', (skin) => {
    const { colors } = skin;
    expect(contrast(colors.primary, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.primary, colors.primarySoft)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.onPrimary, colors.primary)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.danger, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.warning, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.positive, colors.background)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(SKIN_LIST)('mantiene contraste AA en categorías y bordes en $id', (skin) => {
    const { colors, categoryColors } = skin;
    for (const color of Object.values(categoryColors)) {
      expect(contrast(color, colors.background)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(color, colors.surface)).toBeGreaterThanOrEqual(4.5);
    }
    // Los bordes de controles deben distinguirse del fondo (WCAG 1.4.11).
    expect(contrast(colors.borderStrong, colors.background)).toBeGreaterThanOrEqual(3);
  });
});
