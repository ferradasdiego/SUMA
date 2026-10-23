import { Link } from 'expo-router';

import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { t } from '@/i18n';
import { colors, spacing } from '@/theme';

export default function NotFoundScreen() {
  return (
    <Screen>
      <AppText variant="title">{t('notFound.title')}</AppText>
      <AppText variant="body" color={colors.textMuted} style={{ marginTop: spacing.sm }}>
        {t('notFound.description')}
      </AppText>
      <Link href="/" style={{ marginTop: spacing.xl, color: colors.primary }}>
        {t('notFound.home')}
      </Link>
    </Screen>
  );
}
