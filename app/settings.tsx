import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { AppText } from '@/components/ui/AppText';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Divider } from '@/components/ui/Divider';
import { Screen } from '@/components/ui/Screen';
import { useApp } from '@/features/app/AppProvider';
import { collectExportData, shareExport } from '@/features/settings/exportService';
import type { WeekStartsOn } from '@/domain/entities/types';
import { t } from '@/i18n';
import { colors, spacing } from '@/theme';

export default function SettingsScreen() {
  const { profile, repositories, updateProfile, invalidate, dataVersion } = useApp();
  const [entryCount, setEntryCount] = useState<number | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!repositories) return;
      const count = await repositories.entries.count();
      if (active && count.ok) setEntryCount(count.value);
    }
    void load();
    return () => {
      active = false;
    };
  }, [repositories, dataVersion]);

  if (!profile) return null;

  async function changeWeekStart(next: WeekStartsOn) {
    const result = await updateProfile({ weekStartsOn: next });
    setMessage(result.ok ? null : result.error.message);
  }

  async function exportData() {
    if (!repositories || !profile) return;
    setExporting(true);
    setMessage(null);

    const collected = await collectExportData(repositories, profile);
    if (!collected.ok) {
      setMessage(collected.error.message);
      setExporting(false);
      return;
    }

    const shared = await shareExport(collected.value);
    setExporting(false);
    setMessage(shared.ok ? 'Exportación preparada' : shared.error.message);
  }

  async function resetData() {
    if (!repositories) return;
    setSaving(true);
    const result = await repositories.profile.resetLocalData();
    setSaving(false);
    setConfirmVisible(false);
    if (!result.ok) {
      setMessage(result.error.message);
      return;
    }
    invalidate();
    setMessage('Datos restablecidos');
  }

  const version = Constants.expoConfig?.version ?? '0.1.0';

  return (
    <Screen scroll>
      <BackButton />
      <AppText variant="title" style={styles.title}>
        {t('settings.title')}
      </AppText>

      <Card>
        <AppText variant="label">{t('settings.currency')}</AppText>
        {entryCount === 0 ? (
          <View style={styles.chips}>
            {['EUR', 'USD', 'GBP'].map((code) => (
              <Chip
                key={code}
                label={code}
                selected={profile.preferredCurrency === code}
                onPress={() => {
                  void updateProfile({ preferredCurrency: code }).then((result) => {
                    setMessage(result.ok ? null : result.error.message);
                  });
                }}
              />
            ))}
          </View>
        ) : (
          <>
            <AppText variant="body" color={colors.textMuted} style={styles.value}>
              {profile.preferredCurrency}
            </AppText>
            <AppText variant="caption" color={colors.textMuted} style={styles.hint}>
              No se puede cambiar de moneda mientras existan registros u objetivos. Exporta y
              restablece los datos si necesitas empezar de nuevo.
            </AppText>
          </>
        )}
      </Card>

      <Card style={styles.languageCard}>
        <AppText variant="label">Idioma</AppText>
        <AppText variant="body" color={colors.textMuted} style={styles.value}>
          Español
        </AppText>
        <AppText variant="caption" color={colors.textMuted} style={styles.hint}>
          El inglés llegará en una versión posterior.
        </AppText>
      </Card>

      <Divider />

      <AppText variant="label">{t('settings.weekStart')}</AppText>
      <View style={styles.chips}>
        <Chip
          label={t('settings.monday')}
          selected={profile.weekStartsOn === 1}
          onPress={() => {
            void changeWeekStart(1);
          }}
        />
        <Chip
          label={t('settings.sunday')}
          selected={profile.weekStartsOn === 0}
          onPress={() => {
            void changeWeekStart(0);
          }}
        />
      </View>

      {message ? (
        <AppText
          variant="caption"
          color={colors.primary}
          accessibilityLiveRegion="polite"
          style={styles.message}
        >
          {message}
        </AppText>
      ) : null}

      <Divider />

      <AppText variant="label">{t('settings.data')}</AppText>
      <Button
        label={exporting ? 'Exportando…' : 'Exportar datos (JSON)'}
        onPress={() => {
          void exportData();
        }}
        variant="secondary"
        loading={exporting}
        disabled={exporting}
        style={styles.exportButton}
      />
      <AppText variant="caption" color={colors.textMuted} style={styles.hint}>
        El archivo incluye tus registros y notas personales. Compártelo solo con quien tú decidas.
      </AppText>
      <AppText
        variant="body"
        color={colors.danger}
        accessibilityRole="button"
        onPress={() => setConfirmVisible(true)}
        style={styles.destructive}
      >
        {t('settings.reset')}
      </AppText>

      <Divider />

      <AppText variant="label">Legal</AppText>
      <AppText variant="caption" color={colors.textMuted} style={styles.hint}>
        La política de privacidad y las condiciones de uso se publicarán antes del lanzamiento y
        requieren revisión legal.
      </AppText>

      <Divider />

      <AppText variant="label">Acerca de SUMA</AppText>
      <AppText variant="caption" color={colors.textMuted} style={styles.hint}>
        Versión {version}
      </AppText>
      <AppText variant="caption" color={colors.textMuted} style={styles.hint}>
        El importe registrado es una estimación de lo que has decidido no gastar. No implica que el
        dinero esté apartado ni que tu patrimonio haya aumentado.
      </AppText>

      <ConfirmDialog
        visible={confirmVisible}
        title={t('settings.resetTitle')}
        message={t('settings.resetMessage')}
        confirmLabel={saving ? 'Restableciendo…' : t('common.delete')}
        destructive
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          void resetData();
        }}
      />
    </Screen>
  );
}

const styles = {
  title: { marginBottom: spacing.lg },
  value: { marginTop: spacing.xs },
  hint: { marginTop: spacing.xs },
  chips: { flexDirection: 'row' as const, gap: spacing.sm, marginTop: spacing.sm },
  languageCard: { marginTop: spacing.md },
  message: { marginTop: spacing.sm },
  exportButton: { marginTop: spacing.sm },
  destructive: { marginTop: spacing.sm },
};
