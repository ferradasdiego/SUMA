import { useState } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { useApp } from '@/features/app/AppProvider';
import type { WeekStartsOn } from '@/domain/entities/types';
import { t } from '@/i18n';
import { colors, spacing } from '@/theme';

const CURRENCIES = ['EUR', 'USD', 'GBP'] as const;

export default function OnboardingScreen() {
  const { profile, completeOnboarding } = useApp();
  const [currency, setCurrency] = useState<string>(profile?.preferredCurrency ?? 'EUR');
  const [weekStartsOn, setWeekStartsOn] = useState<WeekStartsOn>(profile?.weekStartsOn ?? 1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setSaving(true);
    setError(null);
    const result = await completeOnboarding({ preferredCurrency: currency, weekStartsOn });
    if (!result.ok) setError(result.error.message);
    setSaving(false);
  }

  return (
    <Screen scroll>
      <View style={styles.hero}>
        <AppText variant="display">SUMA</AppText>
        <AppText variant="title" style={styles.claim}>
          Cada decisión cuenta
        </AppText>
        <AppText variant="body" color={colors.textMuted} style={styles.description}>
          Registra el dinero que decides no gastar y mira cómo crece tu progreso. No es una cuenta
          bancaria: es tu hábito, en cifras.
        </AppText>
      </View>

      <AppText variant="label" style={styles.label}>
        Moneda
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
        {t('settings.weekStart')}
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
        label="Empezar"
        onPress={() => {
          void start();
        }}
        loading={saving}
        disabled={saving}
        style={styles.button}
      />

      <AppText variant="caption" color={colors.textMuted} style={styles.note}>
        Podrás cambiar estas preferencias más adelante. La moneda no se puede cambiar mientras
        existan registros.
      </AppText>
    </Screen>
  );
}

const styles = {
  hero: { marginTop: spacing.xxxl, marginBottom: spacing.xxl },
  claim: { marginTop: spacing.sm },
  description: { marginTop: spacing.md },
  label: { marginTop: spacing.lg, marginBottom: spacing.sm },
  chips: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: spacing.sm },
  button: { marginTop: spacing.xxl },
  note: { marginTop: spacing.md },
};
