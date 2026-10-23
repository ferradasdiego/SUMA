import { useState } from 'react';
import { View } from 'react-native';

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { GoalCard } from '@/components/goals/GoalCard';
import { AppText } from '@/components/ui/AppText';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { useApp } from '@/features/app/AppProvider';
import { GoalForm } from '@/features/goals/GoalForm';
import { useActiveGoal } from '@/features/goals/useActiveGoal';
import { t, translateError } from '@/i18n';
import { colors, spacing } from '@/theme';

export default function GoalsScreen() {
  const { state, refresh } = useActiveGoal();
  const { repositories, invalidate, profile } = useApp();
  const [editing, setEditing] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (state.status === 'loading') {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (state.status === 'error') {
    return (
      <Screen>
        <ErrorState onRetry={refresh} description={translateError(state.error)} />
      </Screen>
    );
  }

  if (!profile) return null;

  const goal = state.goal;
  const showForm = editing || goal === null;

  async function removeGoal() {
    if (!goal || !repositories) return;
    const result = await repositories.goals.remove(goal.id);
    setConfirmVisible(false);
    if (!result.ok) {
      setMessage(translateError(result.error));
      return;
    }
    invalidate();
    setEditing(false);
    setMessage(null);
  }

  return (
    <Screen scroll>
      <BackButton />
      <AppText variant="title" style={{ marginBottom: spacing.lg }}>
        {editing ? t('goals.edit') : goal ? t('goals.title') : t('goals.new')}
      </AppText>

      {showForm ? (
        <GoalForm
          goal={editing && goal ? goal : undefined}
          onSaved={() => setEditing(false)}
          onCancel={goal ? () => setEditing(false) : undefined}
        />
      ) : (
        <View style={{ gap: spacing.lg }}>
          {goal && state.progress ? (
            <GoalCard goal={goal} progress={state.progress} locale={profile.locale} />
          ) : null}

          <Button label={t('goals.edit')} onPress={() => setEditing(true)} variant="secondary" />

          <AppText
            variant="label"
            color={colors.danger}
            accessibilityRole="button"
            onPress={() => setConfirmVisible(true)}
            style={{ textAlign: 'center' }}
          >
            {t('goals.delete')}
          </AppText>

          <AppText variant="caption" color={colors.textMuted}>
            {t('goals.explanation')}
          </AppText>
        </View>
      )}

      {message ? (
        <AppText variant="caption" color={colors.danger} accessibilityLiveRegion="polite">
          {message}
        </AppText>
      ) : null}

      <ConfirmDialog
        visible={confirmVisible}
        title={t('goals.deleteTitle')}
        message={t('goals.deleteMessage')}
        confirmLabel={t('common.delete')}
        destructive
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          void removeGoal();
        }}
      />
    </Screen>
  );
}
