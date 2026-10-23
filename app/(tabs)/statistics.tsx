import { EmptyState } from '@/components/feedback/EmptyState';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';

export default function StatisticsScreen() {
  return (
    <Screen>
      <AppText variant="title" style={{ marginBottom: 16 }}>
        Estadísticas
      </AppText>
      <EmptyState
        icon="stats-chart-outline"
        title="Aún no hay datos"
        description="Cuando registres decisiones, podrás ver tu evolución por día, semana, mes y año."
      />
    </Screen>
  );
}
