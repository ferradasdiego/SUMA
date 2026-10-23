import { formatAmount, parseAmount } from '@/domain/money/money';

const es = { currency: 'EUR', locale: 'es-ES' };
const en = { currency: 'EUR', locale: 'en-US' };

describe('parseAmount', () => {
  it('acepta el separador decimal español', () => {
    expect(parseAmount('2,50', es)).toEqual({ ok: true, value: 250 });
    expect(parseAmount('0,01', es)).toEqual({ ok: true, value: 1 });
  });

  it('acepta el separador decimal inglés', () => {
    expect(parseAmount('2.50', en)).toEqual({ ok: true, value: 250 });
  });

  it('tolera el punto como decimal en español cuando no puede ser de miles', () => {
    expect(parseAmount('2.5', es)).toEqual({ ok: true, value: 250 });
  });

  it('interpreta separadores de miles', () => {
    expect(parseAmount('1.234,56', es)).toEqual({ ok: true, value: 123456 });
    expect(parseAmount('1,234.56', en)).toEqual({ ok: true, value: 123456 });
    expect(parseAmount('1.234', es)).toEqual({ ok: true, value: 123400 });
    expect(parseAmount('1,234', en)).toEqual({ ok: true, value: 123400 });
  });

  it('rechaza importes vacíos o no numéricos', () => {
    for (const value of ['', '   ', 'abc', '2,5x', '+2,50']) {
      const result = parseAmount(value, es);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.code).toBe('VALIDATION');
    }
  });

  it('rechaza cero y negativos', () => {
    expect(parseAmount('0', es).ok).toBe(false);
    expect(parseAmount('0,00', es).ok).toBe(false);
    expect(parseAmount('-2,50', es).ok).toBe(false);
  });

  it('rechaza más decimales de los permitidos sin redondear', () => {
    const result = parseAmount('2,505', es);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toMatch(/decimales/);
  });

  it('rechaza fracciones incompletas', () => {
    expect(parseAmount('2,', es).ok).toBe(false);
    expect(parseAmount(',50', es).ok).toBe(false);
  });

  it('aplica el límite máximo', () => {
    expect(parseAmount('1000000,00', es)).toEqual({ ok: true, value: 100_000_000 });
    expect(parseAmount('1000000,01', es).ok).toBe(false);
    expect(parseAmount('99999999', es).ok).toBe(false);
  });

  it('respeta monedas sin decimales', () => {
    const jpy = { currency: 'JPY', locale: 'ja-JP' };
    expect(parseAmount('100', jpy)).toEqual({ ok: true, value: 100 });
    expect(parseAmount('100,5', jpy).ok).toBe(false);
  });
});

describe('formatAmount', () => {
  it('formatea con dos decimales y símbolo de moneda', () => {
    expect(formatAmount(250, es)).toMatch(/2,50/);
    expect(formatAmount(250, es)).toMatch(/€/);
    expect(formatAmount(250, en)).toMatch(/2\.50/);
  });

  it('no inventa decimales en monedas sin ellos', () => {
    const formatted = formatAmount(100, { currency: 'JPY', locale: 'ja-JP' });
    expect(formatted).toMatch(/100/);
    expect(formatted).not.toMatch(/[.,]00/);
  });
});
