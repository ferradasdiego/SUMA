import { setActiveLocale, t, translateError } from '@/i18n';
import { ca } from '@/i18n/locales/ca';
import { en } from '@/i18n/locales/en';
import { es } from '@/i18n/locales/es';
import { gl } from '@/i18n/locales/gl';
import { pt } from '@/i18n/locales/pt';
import { languageFromLocale, localeForLanguage } from '@/i18n/languages';

const dictionaries = { es, en, gl, ca, pt };

afterEach(() => {
  setActiveLocale('es-ES');
});

describe('diccionarios', () => {
  it('todos tienen exactamente las mismas claves', () => {
    const base = Object.keys(es).sort();
    for (const dictionary of Object.values(dictionaries)) {
      expect(Object.keys(dictionary).sort()).toEqual(base);
    }
  });

  it('no hay traducciones vacías ni marcadores distintos', () => {
    const placeholders = (value: string) =>
      Array.from(value.matchAll(/\{(\w+)\}/g), (match) => match[1]).sort();

    for (const [language, dictionary] of Object.entries(dictionaries)) {
      for (const key of Object.keys(es) as (keyof typeof es)[]) {
        expect(dictionary[key].trim().length).toBeGreaterThan(0);
        expect({ language, key, params: placeholders(dictionary[key]) }).toEqual({
          language,
          key,
          params: placeholders(es[key]),
        });
      }
    }
  });
});

describe('t', () => {
  it('interpola parámetros y cambia de idioma', () => {
    expect(t('history.countOther', { count: 3 })).toBe('3 registros');

    setActiveLocale('en-GB');
    expect(t('nav.home')).toBe('Home');
    expect(t('history.countOne', { count: 1 })).toBe('1 entry');

    setActiveLocale('gl-ES');
    expect(t('nav.add')).toBe('Engadir');

    setActiveLocale('ca-ES');
    expect(t('nav.statistics')).toBe('Estadístiques');

    setActiveLocale('pt-PT');
    expect(t('nav.home')).toBe('Início');
  });

  it('resuelve el idioma desde el locale', () => {
    expect(languageFromLocale('es-ES')).toBe('es');
    expect(languageFromLocale('en-US')).toBe('en');
    expect(languageFromLocale('gl')).toBe('gl');
    expect(languageFromLocale('fr-FR')).toBe('es');
    expect(localeForLanguage('ca')).toBe('ca-ES');
  });
});

describe('translateError', () => {
  it('traduce errores conocidos y genéricos', () => {
    setActiveLocale('en-GB');
    expect(translateError({ code: 'VALIDATION', message: 'Introduce un importe' })).toBe(
      'Enter an amount.',
    );
    expect(translateError({ code: 'STORAGE', message: 'algo técnico' })).toBe(
      'The data could not be saved or read.',
    );
    expect(translateError({ code: 'VALIDATION', message: 'mensaje desconocido' })).toBe(
      'Something unexpected happened.',
    );
  });
});
