import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppText } from '@/components/ui/AppText';
import { BackButton } from '@/components/ui/BackButton';
import { Screen } from '@/components/ui/Screen';
import type { Entry } from '@/domain/entities/types';
import { useApp } from '@/features/app/AppProvider';
import { EntryForm } from '@/features/entries/EntryForm';
import { t } from '@/i18n';
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
          title={t('add.loadErrorTitle')}
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
        <AppText variant="title">{t('add.notFoundTitle')}</AppText>
        <AppText variant="body" color={colors.textMuted} style={{ marginTop: spacing.sm }}>
          {t('add.notFoundDescription')}
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
      <BackButton />
      <AppText variant="title" style={{ marginBottom: spacing.lg }}>
        {t('add.editTitle')}
      </AppText>
      <EntryForm entry={entry} onSaved={() => router.back()} />
    </Screen>
  );
}
