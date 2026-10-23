import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import type { Entry } from '@/domain/entities/types';
import { useApp } from '@/features/app/AppProvider';
import { EntryForm } from '@/features/entries/EntryForm';
import { colors, spacing } from '@/theme';

export default function EditEntryScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { repositories } = useApp();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [missing, setMissing] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!repositories || !rawId) {
        setMissing(true);
        return;
      }
      const result = await repositories.entries.getById(rawId);
      if (!active) return;
      if (!result.ok) {
        setFailed(true);
        return;
      }
      if (!result.value) {
        setMissing(true);
        return;
      }
      setEntry(result.value);
    }
    void load();
    return () => {
      active = false;
    };
  }, [repositories, rawId]);

  if (failed) {
    return (
      <Screen>
        <ErrorState
          title="No se pudo cargar el registro"
          onRetry={() => {
            setFailed(false);
            router.replace('/(tabs)/history');
          }}
        />
      </Screen>
    );
  }

  if (missing) {
    return (
      <Screen>
        <AppText variant="title">Registro no encontrado</AppText>
        <AppText variant="body" color={colors.textMuted} style={{ marginTop: spacing.sm }}>
          Puede que ya se haya eliminado.
        </AppText>
      </Screen>
    );
  }

  if (!entry) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <AppText variant="title" style={{ marginBottom: spacing.lg }}>
        Editar registro
      </AppText>
      <EntryForm entry={entry} onSaved={() => router.back()} />
    </Screen>
  );
}
