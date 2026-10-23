import { formatAmountInput } from '@/domain/money/money';
import { formatDateLabel, formatRangeLabel, percentLabel } from '@/utils/format';

describe('formatAmountInput', () => {
  it('formatea sin símbolo de moneda', () => {
    expect(formatAmountInput(250, { currency: 'EUR', locale: 'es-ES' })).toBe('2,50');
    expect(formatAmountInput(150, { currency: 'EUR', locale: 'en-US' })).toBe('1.50');
  });
});

describe('formatDateLabel', () => {
  it('no desplaza la fecha por zona horaria', () => {
    expect(formatDateLabel('2026-10-23', 'es-ES')).toMatch(/23/);
    expect(formatDateLabel('2026-10-23', 'es-ES')).toMatch(/oct/i);
  });
});

describe('percentLabel', () => {
  it('redondea el porcentaje', () => {
    expect(percentLabel(0.364)).toBe('36 %');
    expect(percentLabel(1)).toBe('100 %');
  });
});

describe('formatRangeLabel', () => {
  it('etiqueta meses y años', () => {
    expect(
      formatRangeLabel({ kind: 'month', from: '2026-10-01', to: '2026-10-31' }, 'es-ES'),
    ).toMatch(/octubre/i);
    expect(formatRangeLabel({ kind: 'year', from: '2026-01-01', to: '2026-12-31' }, 'es-ES')).toBe(
      '2026',
    );
  });

  it('etiqueta semanas y rangos personalizados', () => {
    const week = formatRangeLabel({ kind: 'week', from: '2026-10-19', to: '2026-10-25' }, 'es-ES');
    expect(week).toMatch(/19/);
    expect(week).toMatch(/25/);
  });
});
