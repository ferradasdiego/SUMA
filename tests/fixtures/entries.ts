import type { Category, Entry } from '@/domain/entities/types';

export const categoriesFixture: readonly Category[] = [
  {
    id: 'cat_coffee',
    nameKey: 'category.coffee',
    icon: 'cafe-outline',
    colorToken: 'amber',
    isDefault: true,
    isActive: true,
    sortOrder: 10,
  },
  {
    id: 'cat_food',
    nameKey: 'category.food',
    icon: 'restaurant-outline',
    colorToken: 'green',
    isDefault: true,
    isActive: true,
    sortOrder: 20,
  },
  {
    id: 'cat_shopping',
    nameKey: 'category.shopping',
    icon: 'bag-handle-outline',
    colorToken: 'rose',
    isDefault: true,
    isActive: true,
    sortOrder: 30,
  },
  {
    id: 'cat_transport',
    nameKey: 'category.transport',
    icon: 'bus-outline',
    colorToken: 'blue',
    isDefault: true,
    isActive: true,
    sortOrder: 40,
  },
  {
    id: 'cat_leisure',
    nameKey: 'category.leisure',
    icon: 'ticket-outline',
    colorToken: 'violet',
    isDefault: true,
    isActive: true,
    sortOrder: 50,
  },
  {
    id: 'cat_subscriptions',
    nameKey: 'category.subscriptions',
    icon: 'repeat-outline',
    colorToken: 'slate',
    isDefault: true,
    isActive: true,
    sortOrder: 60,
  },
  {
    id: 'cat_other',
    nameKey: 'category.other',
    icon: 'ellipsis-horizontal-circle-outline',
    colorToken: 'stone',
    isDefault: true,
    isActive: true,
    sortOrder: 70,
  },
];

export function makeEntry(overrides: Partial<Entry> = {}): Entry {
  const localDate = overrides.occurredLocalDate ?? '2026-10-23';
  return {
    id: 'entry-1',
    amountMinor: 250,
    currency: 'EUR',
    categoryId: 'cat_coffee',
    note: null,
    occurredAtUtc: localDate + 'T10:00:00.000Z',
    occurredLocalDate: localDate,
    occurredTz: 'Europe/Madrid',
    createdAt: '2026-10-23T10:00:00.000Z',
    updatedAt: '2026-10-23T10:00:00.000Z',
    ...overrides,
  };
}
