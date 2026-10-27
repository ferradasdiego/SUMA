import type { SkinId } from '@/domain/preferences/skin';

export type IsoDateTime = string;
export type LocalDate = string;
export type CurrencyCode = string;
export type WeekStartsOn = 0 | 1;

export interface Entry {
  readonly id: string;
  readonly amountMinor: number;
  readonly currency: CurrencyCode;
  readonly categoryId: string;
  readonly note: string | null;
  readonly occurredAtUtc: IsoDateTime;
  readonly occurredLocalDate: LocalDate;
  readonly occurredTz: string;
  readonly createdAt: IsoDateTime;
  readonly updatedAt: IsoDateTime;
}

export type NewEntry = Pick<
  Entry,
  | 'amountMinor'
  | 'currency'
  | 'categoryId'
  | 'note'
  | 'occurredAtUtc'
  | 'occurredLocalDate'
  | 'occurredTz'
>;

export type EntryPatch = Partial<NewEntry>;

export interface Category {
  readonly id: string;
  readonly nameKey: string;
  readonly icon: string;
  readonly colorToken: string;
  readonly isDefault: boolean;
  readonly isActive: boolean;
  readonly sortOrder: number;
}

export interface Goal {
  readonly id: string;
  readonly title: string;
  readonly targetAmountMinor: number;
  readonly currency: CurrencyCode;
  readonly startDate: LocalDate;
  readonly targetDate: LocalDate | null;
  readonly isActive: boolean;
  readonly createdAt: IsoDateTime;
  readonly updatedAt: IsoDateTime;
}

export type NewGoal = Pick<
  Goal,
  'title' | 'targetAmountMinor' | 'currency' | 'startDate' | 'targetDate'
> & {
  readonly isActive?: boolean;
};

export type GoalPatch = Partial<
  Pick<Goal, 'title' | 'targetAmountMinor' | 'targetDate' | 'isActive'>
>;

export interface UserProfile {
  readonly id: string;
  readonly displayName: string | null;
  readonly preferredCurrency: CurrencyCode;
  readonly locale: string;
  readonly weekStartsOn: WeekStartsOn;
  readonly onboardingCompleted: boolean;
  readonly skin: SkinId;
  readonly quickAmountsMinor: readonly number[];
  readonly createdAt: IsoDateTime;
  readonly updatedAt: IsoDateTime;
}

export type ProfilePatch = Partial<
  Pick<
    UserProfile,
    | 'displayName'
    | 'preferredCurrency'
    | 'locale'
    | 'weekStartsOn'
    | 'onboardingCompleted'
    | 'skin'
    | 'quickAmountsMinor'
  >
>;
