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
import { LanguagePicker } from '@/components/ui/LanguagePicker';
import { Screen } from '@/components/ui/Screen';
import { useApp } from '@/features/app/AppProvider';
import { ImportDialog } from '@/features/settings/ImportDialog';
import { collectExportData, shareExport } from '@/features/settings/exportService';
import { pickImportFile } from '@/features/settings/importFile';
import type { ExportPayload } from '@/data/export/exportData';
import type { ImportMode } from '@/data/import/importService';
import type { WeekStartsOn } from '@/domain/entities/types';
import { t, translateError } from '@/i18n';
import { colors, spacing } from '@/theme';

export default function SettingsScreen() {
  const { profile, repositories, updateProfile, importData, invalidate, dataVersion } = useApp();
  const [entryCount, setEntryCount] = useState<number | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importCandidate, setImportCandidate] = useState<ExportPayload | null>(null);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [importError, setImportError] = useState(false);

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
    setMessage(result.ok ? null : translateError(result.error));
  }

  async function exportData() {
    if (!repositories || !profile) return;
    setExporting(true);
    setMessage(null);

    const collected = await collectExportData(repositories, profile);
    if (!collected.ok) {
      setMessage(translateError(collected.error));
      setExporting(false);
      return;
    }

    const shared = await shareExport(collected.value);
    setExporting(false);
    setMessage(shared.ok ? t('settings.exportReady') : translateError(shared.error));
  }

  async function chooseImportFile() {
    setImporting(true);
    setImportError(false);
    setImportMessage(null);

    const picked = await pickImportFile();
    setImporting(false);

    if (!picked.ok) {
      setImportError(true);
      setImportMessage(translateError(picked.error));
      return;
    }
    if (picked.value) setImportCandidate(picked.value);
  }

  async function runImport(mode: ImportMode) {
    if (!importCandidate) return;

    setImporting(true);
    const result = await importData(importCandidate, mode);
    setImporting(false);

    if (!result.ok) {
      setImportCandidate(null);
      setImportError(true);
      setImportMessage(translateError(result.error));
      return;
    }

    setImportCandidate(null);
    setImportError(false);
    setImportMessage(
      mode === 'merge'
        ? t('import.successMerge', {
            entries: result.value.importedEntries,
            skipped: result.value.skippedEntries,
          })
        : t('import.successReplace', {
            entries: result.value.importedEntries,
            goals: result.value.importedGoals,
          }),
    );
  }

  async function resetData() {
    if (!repositories) return;
    setSaving(true);
    const result = await repositories.profile.resetLocalData();
    setSaving(false);
    setConfirmVisible(false);
    if (!result.ok) {
      setMessage(translateError(result.error));
      return;
    }
    invalidate();
    setMessage(t('settings.resetDone'));
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
                    setMessage(result.ok ? null : translateError(result.error));
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
              {t('settings.currencyLocked')}
            </AppText>
          </>
        )}
      </Card>

      <Card style={styles.languageCard}>
        <AppText variant="label">{t('settings.language')}</AppText>
        <AppText variant="caption" color={colors.textMuted} style={styles.hint}>
          {t('settings.languageHelp')}
        </AppText>
        <View style={styles.languagePicker}>
          <LanguagePicker
            locale={profile.locale}
            onSelect={(locale) => {
              setMessage(null);
              setImportMessage(null);
              void updateProfile({ locale }).then((result) => {
                setMessage(result.ok ? null : translateError(result.error));
              });
            }}
          />
        </View>
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
        label={exporting ? t('settings.exporting') : t('settings.export')}
        onPress={() => {
          void exportData();
        }}
        variant="secondary"
        loading={exporting}
        disabled={exporting}
        style={styles.exportButton}
      />
      <AppText variant="caption" color={colors.textMuted} style={styles.hint}>
        {t('settings.exportHint')}
      </AppText>

      <Button
        label={importing ? t('settings.importingFile') : t('settings.import')}
        onPress={() => {
          void chooseImportFile();
        }}
        variant="secondary"
        loading={importing}
        disabled={importing}
        style={styles.importButton}
      />
      <AppText variant="caption" color={colors.textMuted} style={styles.hint}>
        {t('settings.importHint')}
      </AppText>

      {importMessage ? (
        <AppText
          variant="caption"
          color={importError ? colors.danger : colors.primary}
          accessibilityLiveRegion="polite"
          style={styles.hint}
        >
          {importMessage}
        </AppText>
      ) : null}
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

      <AppText variant="label">{t('settings.legal')}</AppText>
      <AppText variant="caption" color={colors.textMuted} style={styles.hint}>
        {t('settings.legalPending')}
      </AppText>

      <Divider />

      <AppText variant="label">{t('settings.about')}</AppText>
      <AppText variant="caption" color={colors.textMuted} style={styles.hint}>
        {t('common.version', { version })}
      </AppText>
      <AppText variant="caption" color={colors.textMuted} style={styles.hint}>
        {t('settings.disclaimer')}
      </AppText>

      <ImportDialog
        key={importCandidate?.exportedAt ?? 'closed'}
        payload={importCandidate}
        locale={profile.locale}
        busy={importing}
        onCancel={() => setImportCandidate(null)}
        onImport={(mode) => {
          void runImport(mode);
        }}
      />

      <ConfirmDialog
        visible={confirmVisible}
        title={t('settings.resetTitle')}
        message={t('settings.resetMessage')}
        confirmLabel={saving ? t('common.loading') : t('common.delete')}
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
  languagePicker: { marginTop: spacing.md },
  message: { marginTop: spacing.sm },
  exportButton: { marginTop: spacing.sm },
  importButton: { marginTop: spacing.sm },
  destructive: { marginTop: spacing.sm },
};
