import { EmptyState } from '@/components/feedback/EmptyState';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';

export default function HistoryScreen() {
  return (
    <Screen>
      <AppText variant="title" style={{ marginBottom: 16 }}>
        Historial
      </AppText>
      <EmptyState
        icon="time-outline"
        title="Sin movimientos"
        description="Tus decisiones aparecerán aquí en orden cronológico."
      />
    </Screen>
  );
}
