import { EmptyState } from '@/components/feedback/EmptyState';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';

export default function GoalsScreen() {
  return (
    <Screen>
      <AppText variant="title" style={{ marginBottom: 16 }}>
        Objetivo
      </AppText>
      <EmptyState
        icon="flag-outline"
        title="Define tu primer objetivo"
        description="Un objetivo te ayuda a poner nombre a lo que quieres conseguir."
      />
    </Screen>
  );
}
