export const LANGUAGES = [
  { code: 'es', locale: 'es-ES', label: 'Español' },
  { code: 'en', locale: 'en-GB', label: 'English' },
  { code: 'gl', locale: 'gl-ES', label: 'Galego' },
  { code: 'ca', locale: 'ca-ES', label: 'Català' },
  { code: 'pt', locale: 'pt-PT', label: 'Português' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

export function languageFromLocale(locale: string): LanguageCode {
  const code = locale.split('-')[0]?.toLowerCase();
  const match = LANGUAGES.find((language) => language.code === code);
  return match ? match.code : 'es';
}

export function localeForLanguage(code: LanguageCode): string {
  return LANGUAGES.find((language) => language.code === code)?.locale ?? 'es-ES';
}
