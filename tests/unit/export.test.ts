import {
  EXPORT_FORMAT_VERSION,
  buildExportPayload,
  serializeExport,
} from '@/data/export/exportData';
import { categoriesFixture, makeEntry } from '../fixtures/entries';
import type { Goal, UserProfile } from '@/domain/entities/types';

const profile: UserProfile = {
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

const goal: Goal = {
  id: 'goal-1',
  title: 'Viaje',
  targetAmountMinor: 50000,
  currency: 'EUR',
  startDate: '2026-10-01',
  targetDate: null,
  isActive: true,
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-01T10:00:00.000Z',
};

describe('exportación', () => {
  it('incluye perfil, categorías, registros y objetivos', () => {
    const payload = buildExportPayload({
      profile,
      categories: categoriesFixture,
      entries: [makeEntry({ note: 'Nota personal' })],
      goals: [goal],
      exportedAt: new Date('2026-10-23T12:00:00.000Z'),
    });

    expect(payload.formatVersion).toBe(EXPORT_FORMAT_VERSION);
    expect(payload.exportedAt).toBe('2026-10-23T12:00:00.000Z');
    expect(payload.profile.preferredCurrency).toBe('EUR');
    expect(payload.profile.quickAmountsMinor).toEqual([150, 250, 500, 1000]);
    expect(payload.categories).toHaveLength(7);
    expect(payload.entries).toHaveLength(1);
    expect(payload.entries[0]!.note).toBe('Nota personal');
    expect(payload.goals).toHaveLength(1);
  });

  it('no incluye datos internos del dispositivo ni secretos', () => {
    const payload = buildExportPayload({
      profile,
      categories: categoriesFixture,
      entries: [makeEntry()],
      goals: [],
      exportedAt: new Date('2026-10-23T12:00:00.000Z'),
    });

    const json = JSON.stringify(payload);
    expect(json).not.toMatch(/access_token|refresh_token|password|secret/i);
    expect(json).not.toMatch(/user_id/i);
  });

  it('serializa a JSON válido', () => {
    const payload = buildExportPayload({
      profile,
      categories: categoriesFixture,
      entries: [makeEntry()],
      goals: [],
      exportedAt: new Date('2026-10-23T12:00:00.000Z'),
    });

    const parsed = JSON.parse(serializeExport(payload));
    expect(parsed.formatVersion).toBe(1);
    expect(parsed.entries).toHaveLength(1);
  });
});
