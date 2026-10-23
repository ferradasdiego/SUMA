import type { ExportPayload } from '@/data/export/exportData';
import type { Goal, UserProfile } from '@/domain/entities/types';

import { categoriesFixture, makeEntry } from './entries';

export const importProfile: UserProfile = {
  id: 'local',
  displayName: null,
  preferredCurrency: 'EUR',
  locale: 'es-ES',
  weekStartsOn: 1,
  onboardingCompleted: true,
  quickAmountsMinor: [150, 250, 500, 1000],
  createdAt: '2026-10-23T10:00:00.000Z',
  updatedAt: '2026-10-23T10:00:00.000Z',
};

export const importGoal: Goal = {
  id: 'goal-imported',
  title: 'Viaje',
  targetAmountMinor: 50000,
  currency: 'EUR',
  startDate: '2026-10-01',
  targetDate: null,
  isActive: true,
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-01T10:00:00.000Z',
};

export function makeExportPayload(overrides: Partial<ExportPayload> = {}): ExportPayload {
  const profile = importProfile;

  return {
    formatVersion: 1,
    exportedAt: '2026-10-23T12:00:00.000Z',
    profile: {
      id: profile.id,
      displayName: profile.displayName,
      preferredCurrency: profile.preferredCurrency,
      locale: profile.locale,
      weekStartsOn: profile.weekStartsOn,
      onboardingCompleted: profile.onboardingCompleted,
      quickAmountsMinor: profile.quickAmountsMinor,
    },
    categories: [...categoriesFixture],
    entries: [makeEntry({ id: 'entry-imported', note: 'Importado' })],
    goals: [],
    ...overrides,
  };
}
