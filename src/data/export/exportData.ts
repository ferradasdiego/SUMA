import type { Category, Entry, Goal, UserProfile } from '@/domain/entities/types';

export const EXPORT_FORMAT_VERSION = 1 as const;

export interface ExportPayload {
  readonly formatVersion: typeof EXPORT_FORMAT_VERSION;
  readonly exportedAt: string;
  readonly profile: {
    readonly id: string;
    readonly displayName: string | null;
    readonly preferredCurrency: string;
    readonly locale: string;
    readonly weekStartsOn: 0 | 1;
    readonly onboardingCompleted: boolean;
    readonly quickAmountsMinor: readonly number[];
  };
  readonly categories: readonly Category[];
  readonly entries: readonly Entry[];
  readonly goals: readonly Goal[];
}

export interface BuildExportInput {
  readonly profile: UserProfile;
  readonly categories: readonly Category[];
  readonly entries: readonly Entry[];
  readonly goals: readonly Goal[];
  readonly exportedAt: Date;
}

export function buildExportPayload(input: BuildExportInput): ExportPayload {
  return {
    formatVersion: EXPORT_FORMAT_VERSION,
    exportedAt: input.exportedAt.toISOString(),
    profile: {
      id: input.profile.id,
      displayName: input.profile.displayName,
      preferredCurrency: input.profile.preferredCurrency,
      locale: input.profile.locale,
      weekStartsOn: input.profile.weekStartsOn,
      onboardingCompleted: input.profile.onboardingCompleted,
      quickAmountsMinor: [...input.profile.quickAmountsMinor],
    },
    categories: input.categories.map((category) => ({ ...category })),
    entries: input.entries.map((entry) => ({ ...entry })),
    goals: input.goals.map((goal) => ({ ...goal })),
  };
}

export function serializeExport(payload: ExportPayload): string {
  return JSON.stringify(payload, null, 2);
}
