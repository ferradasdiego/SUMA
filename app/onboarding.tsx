import { useState } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { LanguagePicker } from '@/components/ui/LanguagePicker';
import { Screen } from '@/components/ui/Screen';
import { useApp } from '@/features/app/AppProvider';
import type { WeekStartsOn } from '@/domain/entities/types';
import { t, translateError } from '@/i18n';
import { colors, spacing } from '@/theme';

const CURRENCIES = ['EUR', 'USD', 'GBP'] as const;

export default function OnboardingScreen() {
  const { profile, completeOnboarding, updateProfile } = useApp();
  const [currency, setCurrency] = useState<string>(profile?.preferredCurrency ?? 'EUR');
  const [weekStartsOn, setWeekStartsOn] = useState<WeekStartsOn>(profile?.weekStartsOn ?? 1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setSaving(true);
    setError(null);
    const result = await completeOnboarding({ preferredCurrency: currency, weekStartsOn });
    if (!result.ok) setError(translateError(result.error));
    setSaving(false);
  }

  return (
    <Screen scroll>
      <View style={styles.hero}>
        <AppText variant="display">SUMA</AppText>
      </View>

      <AppText variant="label" style={styles.label}>
        {t('onboarding.language')}
      </AppText>
      <LanguagePicker
        locale={profile?.locale ?? 'es-ES'}
        onSelect={(locale) => {
          void updateProfile({ locale }).then((result) => {
            setError(result.ok ? null : translateError(result.error));
          });
        }}
      />

      <View style={styles.claimBlock}>
        <AppText variant="title">{t('onboarding.claim')}</AppText>
        <AppText variant="body" color={colors.textMuted} style={styles.description}>
          {t('onboarding.description')}
        </AppText>
      </View>

      <AppText variant="label" style={styles.label}>
        {t('onboarding.currency')}
      </AppText>
      <View style={styles.chips}>
        {CURRENCIES.map((code) => (
          <Chip
            key={code}
            label={code}
            selected={currency === code}
            onPress={() => setCurrency(code)}
          />
        ))}
      </View>

      <AppText variant="label" style={styles.label}>
        {t('onboarding.weekStart')}
      </AppText>
      <View style={styles.chips}>
        <Chip
          label={t('settings.monday')}
          selected={weekStartsOn === 1}
          onPress={() => setWeekStartsOn(1)}
        />
        <Chip
          label={t('settings.sunday')}
          selected={weekStartsOn === 0}
          onPress={() => setWeekStartsOn(0)}
        />
      </View>

      {error ? (
        <AppText variant="caption" color={colors.danger} accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}

      <Button
        label={t('onboarding.start')}
        onPress={() => {
          void start();
        }}
        loading={saving}
        disabled={saving}
        style={styles.button}
      />

      <AppText variant="caption" color={colors.textMuted} style={styles.note}>
        {t('onboarding.note')}
      </AppText>
    </Screen>
  );
}

const styles = {
  hero: { marginTop: spacing.xxxl, marginBottom: spacing.lg },
  claimBlock: { marginTop: spacing.lg },
  description: { marginTop: spacing.md },
  label: { marginTop: spacing.lg, marginBottom: spacing.sm },
  chips: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: spacing.sm },
  button: { marginTop: spacing.xxl },
  note: { marginTop: spacing.md },
};
