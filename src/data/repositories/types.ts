import type { SqlDriver } from '@/data/local/driver';
import type {
  Category,
  CurrencyCode,
  Entry,
  EntryPatch,
  Goal,
  GoalPatch,
  LocalDate,
  NewEntry,
  NewGoal,
  ProfilePatch,
  UserProfile,
} from '@/domain/entities/types';
import type { Result } from '@/domain/errors/result';

export interface RepositoryContext {
  readonly driver: SqlDriver;
  readonly newId: () => string;
  readonly now: () => Date;
}

export interface EntryQuery {
  readonly fromLocalDate?: LocalDate;
  readonly toLocalDate?: LocalDate;
  readonly categoryIds?: readonly string[];
  readonly currency?: CurrencyCode;
  readonly limit?: number;
  readonly offset?: number;
  readonly order?: 'occurred_desc' | 'occurred_asc';
}

export interface EntryRepository {
  create(input: NewEntry): Promise<Result<Entry>>;
  update(id: string, patch: EntryPatch): Promise<Result<Entry>>;
  remove(id: string): Promise<Result<void>>;
  getById(id: string): Promise<Result<Entry | null>>;
  list(query?: EntryQuery): Promise<Result<readonly Entry[]>>;
  count(query?: EntryQuery): Promise<Result<number>>;
  sum(query?: EntryQuery): Promise<Result<number>>;
}

export interface CategoryRepository {
  list(includeInactive?: boolean): Promise<Result<readonly Category[]>>;
  getById(id: string): Promise<Result<Category | null>>;
}

export interface GoalRepository {
  getActive(): Promise<Result<Goal | null>>;
  list(): Promise<Result<readonly Goal[]>>;
  create(input: NewGoal): Promise<Result<Goal>>;
  update(id: string, patch: GoalPatch): Promise<Result<Goal>>;
  remove(id: string): Promise<Result<void>>;
  setActive(id: string): Promise<Result<void>>;
}

export interface ProfileRepository {
  get(): Promise<Result<UserProfile>>;
  update(patch: ProfilePatch): Promise<Result<UserProfile>>;
  ensureExists(): Promise<Result<UserProfile>>;
  resetLocalData(): Promise<Result<void>>;
}

export interface Repositories {
  readonly entries: EntryRepository;
  readonly categories: CategoryRepository;
  readonly goals: GoalRepository;
  readonly profile: ProfileRepository;
}

export interface DatabaseContext extends RepositoryContext {
  readonly repositories: Repositories;
}
