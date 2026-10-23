export const es = {
  'category.coffee': 'Café',
  'category.food': 'Comida',
  'category.shopping': 'Compras',
  'category.transport': 'Transporte',
  'category.leisure': 'Ocio',
  'category.subscriptions': 'Suscripciones',
  'category.other': 'Otros',
  'home.title': 'SUMA',
  'home.subtitle': 'Tu dinero no gastado',
  'home.today': 'Hoy',
  'home.week': 'Esta semana',
  'home.total': 'Total acumulado',
  'home.recent': 'Últimos movimientos',
  'home.goal': 'Objetivo',
  'home.cta': 'Registrar una decisión',
  'add.title': 'Añadir',
  'add.amount': 'Importe',
  'add.quickAmounts': 'Importes rápidos',
  'add.category': 'Categoría',
  'add.date': 'Fecha',
  'add.note': 'Nota (opcional)',
  'add.today': 'Hoy',
  'add.yesterday': 'Ayer',
  'add.save': 'Guardar',
  'add.saving': 'Guardando…',
  'add.success': 'Decisión registrada',
  'add.another': 'Registrar otra',
  'add.goHome': 'Ir a inicio',
  'history.title': 'Historial',
  'statistics.title': 'Estadísticas',
  'goals.title': 'Objetivo',
  'settings.title': 'Ajustes',
  'settings.currency': 'Moneda',
  'settings.weekStart': 'Primer día de la semana',
  'settings.monday': 'Lunes',
  'settings.sunday': 'Domingo',
  'settings.data': 'Datos',
  'settings.reset': 'Restablecer datos locales',
  'settings.resetTitle': '¿Restablecer los datos?',
  'settings.resetMessage':
    'Se eliminarán todos los registros y objetivos de este dispositivo. Esta acción no se puede deshacer.',
  'common.cancel': 'Cancelar',
  'common.confirm': 'Confirmar',
  'common.delete': 'Eliminar',
  'common.retry': 'Reintentar',
  'common.loading': 'Cargando…',
} as const;

export type TranslationKey = keyof typeof es;

export function t(key: TranslationKey): string {
  return es[key];
}

export function categoryLabel(nameKey: string): string {
  return (es as Record<string, string>)[nameKey] ?? nameKey;
}
