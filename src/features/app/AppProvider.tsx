import { randomUUID } from 'expo-crypto';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { initializeDatabase } from '@/data/database';
import { openExpoDatabase } from '@/data/local/expoDriver';
import type { SqlDriver } from '@/data/local/driver';
import type { Repositories } from '@/data/repositories/types';
import type { Category, ProfilePatch, UserProfile, WeekStartsOn } from '@/domain/entities/types';
import { err, ok, unknownError, type AppError, type Result } from '@/domain/errors/result';

export type AppStatus = 'booting' | 'ready' | 'failed';

export interface OnboardingInput {
  readonly preferredCurrency: string;
  readonly weekStartsOn: WeekStartsOn;
}

export interface AppContextValue {
  readonly status: AppStatus;
  readonly profile: UserProfile | null;
  readonly categories: readonly Category[];
  readonly repositories: Repositories | null;
  readonly dataVersion: number;
  readonly error: AppError | null;
  updateProfile(patch: ProfilePatch): Promise<Result<void>>;
  completeOnboarding(input: OnboardingInput): Promise<Result<void>>;
  invalidate(): void;
  retry(): void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AppStatus>('booting');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [categories, setCategories] = useState<readonly Category[]>([]);
  const [repositories, setRepositories] = useState<Repositories | null>(null);
  const [dataVersion, setDataVersion] = useState(0);
  const [error, setError] = useState<AppError | null>(null);

  const booting = useRef(false);
  const driverRef = useRef<SqlDriver | null>(null);

  const bootstrap = useCallback(async () => {
    if (booting.current) return;
    booting.current = true;
    setStatus('booting');
    setError(null);

    try {
      if (driverRef.current) {
        await driverRef.current.close().catch(() => undefined);
        driverRef.current = null;
      }

      const driver = await openExpoDatabase();
      driverRef.current = driver;

      const initialized = await initializeDatabase({
        driver,
        newId: randomUUID,
        now: () => new Date(),
      });

      if (!initialized.ok) {
        setError(initialized.error);
        setStatus('failed');
        return;
      }

      const [categoriesResult, profileResult] = await Promise.all([
        initialized.value.repositories.categories.list(),
        initialized.value.repositories.profile.get(),
      ]);

      if (!categoriesResult.ok) {
        setError(categoriesResult.error);
        setStatus('failed');
        return;
      }
      if (!profileResult.ok) {
        setError(profileResult.error);
        setStatus('failed');
        return;
      }

      setRepositories(initialized.value.repositories);
      setCategories(categoriesResult.value);
      setProfile(profileResult.value);
      setStatus('ready');
    } catch (cause) {
      setError(unknownError('No se pudo iniciar SUMA', cause));
      setStatus('failed');
    } finally {
      booting.current = false;
    }
  }, []);

  useEffect(() => {
    // Arranque controlado: abre la base, migra y publica el estado inicial.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void bootstrap();
  }, [bootstrap]);

  const invalidate = useCallback(() => {
    setDataVersion((version) => version + 1);
  }, []);

  const updateProfile = useCallback(
    async (patch: ProfilePatch): Promise<Result<void>> => {
      if (!repositories) {
        return err({ code: 'STORAGE', message: 'La base de datos todavía no está lista' });
      }

      const updated = await repositories.profile.update(patch);
      if (!updated.ok) return err(updated.error);

      setProfile(updated.value);
      setDataVersion((version) => version + 1);
      return ok(undefined);
    },
    [repositories],
  );

  const completeOnboarding = useCallback(
    async (input: OnboardingInput): Promise<Result<void>> =>
      updateProfile({
        preferredCurrency: input.preferredCurrency,
        weekStartsOn: input.weekStartsOn,
        onboardingCompleted: true,
      }),
    [updateProfile],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      status,
      profile,
      categories,
      repositories,
      dataVersion,
      error,
      updateProfile,
      completeOnboarding,
      invalidate,
      retry: () => {
        void bootstrap();
      },
    }),
    [
      status,
      profile,
      categories,
      repositories,
      dataVersion,
      error,
      updateProfile,
      completeOnboarding,
      invalidate,
      bootstrap,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
}
