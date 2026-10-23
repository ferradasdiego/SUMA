import { EmptyState } from '@/components/feedback/EmptyState';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';

export default function AddScreen() {
  return (
    <Screen>
      <AppText variant="title" style={{ marginBottom: 16 }}>
        Añadir
      </AppText>
      <EmptyState
        icon="add-circle-outline"
        title="Registro de decisiones"
        description="Aquí podrás anotar el importe que has decidido no gastar."
      />
    </Screen>
  );
}
