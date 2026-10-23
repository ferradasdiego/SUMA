import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { AddEntryForm } from '@/features/entries/AddEntryForm';
import { t } from '@/i18n';
import { spacing } from '@/theme';

export default function AddScreen() {
  return (
    <Screen scroll>
      <AppText variant="title" style={{ marginBottom: spacing.lg }}>
        {t('add.title')}
      </AppText>
      <AddEntryForm />
    </Screen>
  );
}
