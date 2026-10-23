import { z } from 'zod';

import { MAX_ENTRY_MINOR, MAX_GOAL_MINOR, isSupportedCurrency } from '@/domain/money/currency';
import { MAX_QUICK_AMOUNTS, MIN_QUICK_AMOUNTS } from '@/domain/preferences/quickAmounts';
import { isLocalDate } from '@/domain/time/calendar';

export const currencySchema = z
  .string()
  .regex(/^[A-Z]{3}$/, 'Código de moneda inválido')
  .refine(isSupportedCurrency, 'Moneda no soportada');

export const localDateSchema = z.string().refine(isLocalDate, 'Fecha local inválida');

export const isoDateTimeSchema = z.iso.datetime();

export const entrySchema = z.object({
  id: z.string().min(1),
  amountMinor: z.number().int().positive().max(MAX_ENTRY_MINOR),
  currency: currencySchema,
  categoryId: z.string().min(1),
  note: z.string().max(280).nullable(),
  occurredAtUtc: isoDateTimeSchema,
  occurredLocalDate: localDateSchema,
  occurredTz: z.string().min(1).max(64),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const newEntrySchema = entrySchema.omit({ id: true, createdAt: true, updatedAt: true });

export const entryPatchSchema = newEntrySchema.partial();

export const categorySchema = z.object({
  id: z.string().min(1),
  nameKey: z.string().min(1),
  icon: z.string().min(1),
  colorToken: z.string().min(1),
  isDefault: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

export const goalSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().trim().min(1, 'El nombre es obligatorio').max(80),
    targetAmountMinor: z.number().int().positive().max(MAX_GOAL_MINOR),
    currency: currencySchema,
    startDate: localDateSchema,
    targetDate: localDateSchema.nullable(),
    isActive: z.boolean(),
    createdAt: isoDateTimeSchema,
    updatedAt: isoDateTimeSchema,
  })
  .superRefine((goal, context) => {
    if (goal.targetDate !== null && goal.targetDate < goal.startDate) {
      context.addIssue({
        code: 'custom',
        message: 'La fecha objetivo debe ser posterior al inicio',
        path: ['targetDate'],
      });
    }
  });

export const newGoalSchema = z.object({
  title: z.string().trim().min(1, 'El nombre es obligatorio').max(80),
  targetAmountMinor: z.number().int().positive().max(MAX_GOAL_MINOR),
  currency: currencySchema,
  startDate: localDateSchema,
  targetDate: localDateSchema.nullable(),
  isActive: z.boolean().optional(),
});

export const goalPatchSchema = z.object({
  title: z.string().trim().min(1, 'El nombre es obligatorio').max(80).optional(),
  targetAmountMinor: z.number().int().positive().max(MAX_GOAL_MINOR).optional(),
  targetDate: localDateSchema.nullable().optional(),
  isActive: z.boolean().optional(),
});

export const quickAmountsSchema = z
  .array(z.number().int().positive().max(MAX_ENTRY_MINOR))
  .min(MIN_QUICK_AMOUNTS, 'Añade al menos un importe rápido')
  .max(MAX_QUICK_AMOUNTS, 'Demasiados importes rápidos');

export const profileSchema = z.object({
  id: z.string().min(1),
  displayName: z.string().max(80).nullable(),
  preferredCurrency: currencySchema,
  locale: z.string().min(2).max(35),
  weekStartsOn: z.union([z.literal(0), z.literal(1)]),
  onboardingCompleted: z.boolean(),
  quickAmountsMinor: quickAmountsSchema,
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const profilePatchSchema = z.object({
  displayName: z.string().max(80).nullable().optional(),
  preferredCurrency: currencySchema.optional(),
  locale: z.string().min(2).max(35).optional(),
  weekStartsOn: z.union([z.literal(0), z.literal(1)]).optional(),
  onboardingCompleted: z.boolean().optional(),
  quickAmountsMinor: quickAmountsSchema.optional(),
});

export function firstIssueMessage(error: z.ZodError, fallback = 'Datos inválidos'): string {
  return error.issues[0]?.message ?? fallback;
}

export function firstIssueField(error: z.ZodError): string | undefined {
  const path = error.issues[0]?.path;
  return path && path.length > 0 ? path.map(String).join('.') : undefined;
}
