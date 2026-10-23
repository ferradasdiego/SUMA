import type { AppError } from '@/domain/errors/result';

import { ca } from './locales/ca';
import { en } from './locales/en';
import { es, type TranslationKey } from './locales/es';
import { gl } from './locales/gl';
import { pt } from './locales/pt';
import { LANGUAGES, languageFromLocale, localeForLanguage, type LanguageCode } from './languages';

export type { TranslationKey, LanguageCode };
export { LANGUAGES, languageFromLocale, localeForLanguage };

const dictionaries: Record<LanguageCode, Record<TranslationKey, string>> = {
  es,
  en,
  gl,
  ca,
  pt,
};

let activeLanguage: LanguageCode = 'es';

export function setActiveLocale(locale: string): void {
  activeLanguage = languageFromLocale(locale);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
  }
}

export function getActiveLanguage(): LanguageCode {
  return activeLanguage;
}

export function t(key: TranslationKey, params?: Readonly<Record<string, string | number>>): string {
  const template = dictionaries[activeLanguage][key] ?? es[key] ?? key;
  if (!params) return template;

  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : String(value);
  });
}

export function categoryLabel(nameKey: string): string {
  if (Object.prototype.hasOwnProperty.call(es, nameKey)) {
    return t(nameKey as TranslationKey);
  }
  return nameKey;
}

const ERROR_KEYS: Readonly<Record<string, TranslationKey>> = {
  'Introduce un importe': 'error.amountRequired',
  'El importe no es válido': 'error.amountInvalid',
  'El importe debe ser mayor que cero': 'error.amountZero',
  'El importe tiene demasiados decimales': 'error.amountDecimals',
  'Esta moneda no admite decimales': 'error.amountNoDecimals',
  'El importe es demasiado grande': 'error.amountTooLarge',
  'El importe supera el máximo permitido': 'error.amountTooLarge',
  'Moneda no soportada': 'error.currencyUnsupported',
  'Elige una categoría': 'error.categoryMissing',
  'La categoría seleccionada no existe': 'error.categoryUnknown',
  'La fecha no es válida': 'error.dateInvalid',
  'La fecha no puede ser futura': 'error.dateFuture',
  'La nota no puede superar 280 caracteres': 'error.noteTooLong',
  'El nombre es obligatorio': 'error.goalTitle',
  'El nombre es demasiado largo': 'error.goalTitleLong',
  'La fecha objetivo no es válida': 'error.goalDateInvalid',
  'La fecha objetivo debe ser posterior al inicio': 'error.goalDateBeforeStart',
  'No puedes cambiar de moneda mientras existan registros u objetivos. Exporta y restablece los datos.':
    'error.currencyLocked',
  'El registro ya existe': 'error.recordExists',
  'El registro no existe': 'error.recordNotFound',
  'El objetivo no existe': 'error.goalNotFound',
  'Ya existe un objetivo activo': 'error.activeGoalExists',
  'El perfil local no existe': 'error.profileMissing',
  'Añade al menos un importe rápido': 'error.quickAmountsMin',
  'Demasiados importes rápidos': 'error.quickAmountsMax',
  'El archivo es demasiado grande': 'error.importTooLarge',
  'El archivo no es un JSON válido': 'error.importJson',
  'Hay categorías duplicadas en el archivo': 'error.importDuplicate',
  'Hay registros duplicados en el archivo': 'error.importDuplicate',
  'Hay objetivos duplicados en el archivo': 'error.importDuplicate',
  'El archivo referencia una categoría desconocida': 'error.importCategory',
  'El archivo mezcla monedas distintas': 'error.importMixedCurrencies',
  'El archivo contiene más de un objetivo activo': 'error.importMultipleGoals',
  'La copia usa otra moneda. Usa Reemplazar para cambiar de moneda.':
    'error.importCurrencyMismatch',
  'No se pudieron importar los datos': 'error.importFailed',
  'No se pudo leer el archivo': 'error.importRead',
  'No se pudo generar el archivo de exportación': 'error.exportFailed',
  'No se pudo descargar la exportación': 'error.exportFailed',
  'Compartir no está disponible en este dispositivo': 'error.shareUnavailable',
  'La aplicación todavía no está lista': 'app.notReady',
  'No se pudo preparar la base de datos': 'error.migration',
};

/**
 * Traduce los errores de dominio. Los mensajes técnicos desconocidos caen a un
 * texto genérico del idioma activo para no mezclar idiomas en la interfaz.
 */
export function translateError(error: AppError): string {
  const direct = ERROR_KEYS[error.message];
  if (direct) return t(direct);

  if (error.message.startsWith('El archivo de importación no es válido')) {
    return t('error.importInvalid');
  }

  if (
    error.message.startsWith('Fecha inicial inválida') ||
    error.message.startsWith('Fecha final inválida')
  ) {
    return t('error.dateInvalid');
  }

  switch (error.code) {
    case 'STORAGE':
      return t('error.storage');
    case 'MIGRATION':
      return t('error.migration');
    case 'VALIDATION':
      return error.message && Object.prototype.hasOwnProperty.call(es, error.message)
        ? t(error.message as TranslationKey)
        : t('error.generic');
    default:
      return t('error.generic');
  }
}
