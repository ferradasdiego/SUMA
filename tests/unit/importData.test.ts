import { buildExportPayload, serializeExport } from '@/data/export/exportData';
import { parseImportPayload } from '@/data/export/importData';
import { makeExportPayload, importProfile } from '../fixtures/importPayload';
import { categoriesFixture, makeEntry } from '../fixtures/entries';

const toText = (payload = makeExportPayload()) => serializeExport(payload);

describe('parseImportPayload', () => {
  it('acepta una copia válida', () => {
    const result = parseImportPayload(toText());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.entries).toHaveLength(1);
      expect(result.value.profile.skin).toBe('kawaii');
      expect(result.value.profile.quickAmountsMinor).toEqual([150, 250, 500, 1000]);
    }
  });

  it('acepta una copia antigua sin skin y la normaliza a classic', () => {
    const raw = JSON.parse(toText()) as Record<string, unknown>;
    const oldProfile = raw.profile as Record<string, unknown>;
    delete oldProfile.skin;

    const result = parseImportPayload(JSON.stringify(raw));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.profile.skin).toBe('classic');
  });

  it('rechaza una skin desconocida', () => {
    const raw = JSON.parse(toText()) as Record<string, unknown>;
    const profile = raw.profile as Record<string, unknown>;
    profile.skin = 'neon';
    expect(parseImportPayload(JSON.stringify(raw)).ok).toBe(false);
  });

  it('rechaza un JSON inválido', () => {
    const result = parseImportPayload('{no es json');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.field).toBe('file');
  });

  it('rechaza versiones distintas', () => {
    const payload = { ...makeExportPayload(), formatVersion: 2 };
    expect(parseImportPayload(JSON.stringify(payload)).ok).toBe(false);
  });

  it('rechaza identificadores duplicados', () => {
    const payload = makeExportPayload({
      entries: [makeEntry({ id: 'duplicado' }), makeEntry({ id: 'duplicado', amountMinor: 500 })],
    });
    expect(parseImportPayload(toText(payload)).ok).toBe(false);
  });

  it('rechaza categorías desconocidas', () => {
    const payload = makeExportPayload({
      entries: [makeEntry({ id: 'e', categoryId: 'cat_unknown' })],
    });
    expect(parseImportPayload(toText(payload)).ok).toBe(false);
  });

  it('rechaza más de un objetivo activo', () => {
    const goal = {
      id: 'g1',
      title: 'Uno',
      targetAmountMinor: 1000,
      currency: 'EUR',
      startDate: '2026-10-01',
      targetDate: null,
      isActive: true,
      createdAt: '2026-10-01T10:00:00.000Z',
      updatedAt: '2026-10-01T10:00:00.000Z',
    };
    const payload = makeExportPayload({ goals: [goal, { ...goal, id: 'g2', title: 'Dos' }] });
    expect(parseImportPayload(toText(payload)).ok).toBe(false);
  });

  it('rechaza monedas mezcladas', () => {
    const payload = makeExportPayload({
      entries: [makeEntry({ id: 'usd', currency: 'USD' })],
    });
    expect(parseImportPayload(toText(payload)).ok).toBe(false);
  });

  it('rechaza importes rápidos inválidos del perfil', () => {
    const payload = buildExportPayload({
      profile: { ...importProfile, quickAmountsMinor: [] },
      categories: categoriesFixture,
      entries: [],
      goals: [],
      exportedAt: new Date('2026-10-23T12:00:00.000Z'),
    });
    expect(parseImportPayload(serializeExport(payload)).ok).toBe(false);
  });
});
