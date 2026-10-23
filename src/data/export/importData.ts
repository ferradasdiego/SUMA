import { z } from 'zod';

import type { ExportPayload } from '@/data/export/exportData';
import { err, ok, validationError, type Result } from '@/domain/errors/result';
import {
  categorySchema,
  currencySchema,
  entrySchema,
  firstIssueMessage,
  goalSchema,
  isoDateTimeSchema,
  quickAmountsSchema,
} from '@/domain/validation/schemas';

const MAX_IMPORT_BYTES = 10_000_000;

const importProfileSchema = z.object({
  id: z.string().min(1),
  displayName: z.string().max(80).nullable(),
  preferredCurrency: currencySchema,
  locale: z.string().min(2).max(35),
  weekStartsOn: z.union([z.literal(0), z.literal(1)]),
  onboardingCompleted: z.boolean(),
  quickAmountsMinor: quickAmountsSchema,
});

export const importPayloadSchema = z.object({
  formatVersion: z.literal(1),
  exportedAt: isoDateTimeSchema,
  profile: importProfileSchema,
  categories: z.array(categorySchema).min(1).max(200),
  entries: z.array(entrySchema).max(50_000),
  goals: z.array(goalSchema).max(100),
});

function duplicateId(values: readonly { id: string }[]): string | null {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value.id)) return value.id;
    seen.add(value.id);
  }
  return null;
}

/**
 * Valida un archivo de importación completo antes de tocar la base de datos.
 * Además del esquema, comprueba invariantes que el JSON por sí solo no garantiza.
 */
export function parseImportPayload(text: string): Result<ExportPayload> {
  if (text.length > MAX_IMPORT_BYTES) {
    return err(validationError('El archivo es demasiado grande', 'file'));
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return err(validationError('El archivo no es un JSON válido', 'file'));
  }

  const parsed = importPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return err(
      validationError(
        'El archivo de importación no es válido: ' + firstIssueMessage(parsed.error),
        'file',
      ),
    );
  }

  const payload = parsed.data;

  const duplicateCategories = duplicateId(payload.categories);
  if (duplicateCategories) {
    return err(validationError('Hay categorías duplicadas en el archivo', 'file'));
  }

  const duplicateEntries = duplicateId(payload.entries);
  if (duplicateEntries) {
    return err(validationError('Hay registros duplicados en el archivo', 'file'));
  }

  const duplicateGoals = duplicateId(payload.goals);
  if (duplicateGoals) {
    return err(validationError('Hay objetivos duplicados en el archivo', 'file'));
  }

  const categoryIds = new Set(payload.categories.map((category) => category.id));
  for (const entry of payload.entries) {
    if (!categoryIds.has(entry.categoryId)) {
      return err(validationError('El archivo referencia una categoría desconocida', 'file'));
    }
    if (entry.currency !== payload.profile.preferredCurrency) {
      return err(validationError('El archivo mezcla monedas distintas', 'file'));
    }
  }

  for (const goal of payload.goals) {
    if (goal.currency !== payload.profile.preferredCurrency) {
      return err(validationError('El archivo mezcla monedas distintas', 'file'));
    }
  }

  if (payload.goals.filter((goal) => goal.isActive).length > 1) {
    return err(validationError('El archivo contiene más de un objetivo activo', 'file'));
  }

  return ok(payload);
}
