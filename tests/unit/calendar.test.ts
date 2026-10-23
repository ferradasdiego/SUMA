import {
  addDays,
  dayCountInclusive,
  endOfMonth,
  endOfWeek,
  isLocalDate,
  startOfMonth,
  startOfWeek,
  toLocalDate,
} from '@/domain/time/calendar';

describe('fechas locales', () => {
  it('valida fechas reales', () => {
    expect(isLocalDate('2026-10-23')).toBe(true);
    expect(isLocalDate('2026-02-29')).toBe(false);
    expect(isLocalDate('2028-02-29')).toBe(true);
    expect(isLocalDate('2026-13-01')).toBe(false);
    expect(isLocalDate('2026-04-31')).toBe(false);
    expect(isLocalDate('23/10/2026')).toBe(false);
  });

  it('suma días entre meses y años', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('calcula inicio de semana con lunes y domingo', () => {
    expect(startOfWeek('2026-10-23', 1)).toBe('2026-10-19');
    expect(endOfWeek('2026-10-23', 1)).toBe('2026-10-25');
    expect(startOfWeek('2026-10-23', 0)).toBe('2026-10-18');
  });

  it('calcula límites de mes', () => {
    expect(startOfMonth('2026-10-23')).toBe('2026-10-01');
    expect(endOfMonth('2026-02-10')).toBe('2026-02-28');
    expect(endOfMonth('2028-02-10')).toBe('2028-02-29');
    expect(endOfMonth('2026-12-01')).toBe('2026-12-31');
  });

  it('cuenta días inclusivos', () => {
    expect(dayCountInclusive('2026-10-01', '2026-10-23')).toBe(23);
    expect(dayCountInclusive('2026-10-23', '2026-10-01')).toBe(0);
    expect(dayCountInclusive('2026-10-23', '2026-10-23')).toBe(1);
  });

  it('resuelve la fecha local respetando la zona horaria', () => {
    const instant = new Date('2026-10-23T20:00:00.000Z');
    expect(toLocalDate(instant, 'Europe/Madrid')).toBe('2026-10-23');
    expect(toLocalDate(instant, 'Pacific/Kiritimati')).toBe('2026-10-24');
    expect(toLocalDate(instant, 'Pacific/Honolulu')).toBe('2026-10-23');
  });

  it('no desplaza el día en los cambios de horario de verano', () => {
    expect(toLocalDate(new Date('2026-03-29T00:30:00.000Z'), 'Europe/Madrid')).toBe('2026-03-29');
    expect(toLocalDate(new Date('2026-03-29T01:30:00.000Z'), 'Europe/Madrid')).toBe('2026-03-29');
    expect(toLocalDate(new Date('2026-10-25T01:30:00.000Z'), 'Europe/Madrid')).toBe('2026-10-25');
  });
});
