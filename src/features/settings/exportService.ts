/* eslint-disable @typescript-eslint/no-require-imports -- los módulos nativos se cargan solo cuando Platform.OS no es web. */
import { Platform } from 'react-native';

import { serializeExport, type ExportPayload } from '@/data/export/exportData';
import { buildExportPayload } from '@/data/export/exportData';
import type { Repositories } from '@/data/repositories/types';
import type { UserProfile } from '@/domain/entities/types';
import { err, ioError, ok, type Result } from '@/domain/errors/result';
import { t } from '@/i18n';

export async function collectExportData(
  repositories: Repositories,
  profile: UserProfile,
): Promise<Result<ExportPayload>> {
  const [entries, categories, goals] = await Promise.all([
    repositories.entries.list(),
    repositories.categories.list(true),
    repositories.goals.list(),
  ]);

  if (!entries.ok) return err(entries.error);
  if (!categories.ok) return err(categories.error);
  if (!goals.ok) return err(goals.error);

  return ok(
    buildExportPayload({
      profile,
      categories: categories.value,
      entries: entries.value,
      goals: goals.value,
      exportedAt: new Date(),
    }),
  );
}

function shareExportOnWeb(payload: ExportPayload): Result<void> {
  try {
    const blob = new Blob([serializeExport(payload)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'suma-export-' + payload.exportedAt.slice(0, 10) + '.json';
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return ok(undefined);
  } catch (error) {
    return err(ioError('No se pudo descargar la exportación', error));
  }
}

async function shareExportOnNative(payload: ExportPayload): Promise<Result<void>> {
  try {
    const { File, Paths } = require('expo-file-system') as typeof import('expo-file-system');
    const Sharing = require('expo-sharing') as typeof import('expo-sharing');

    const file = new File(Paths.cache, 'suma-export-' + payload.exportedAt.slice(0, 10) + '.json');
    file.create({ overwrite: true });
    await file.write(serializeExport(payload));

    if (!(await Sharing.isAvailableAsync())) {
      return err(ioError('Compartir no está disponible en este dispositivo'));
    }

    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: t('settings.export'),
    });

    return ok(undefined);
  } catch (error) {
    return err(ioError('No se pudo generar el archivo de exportación', error));
  }
}

/** En web descarga un JSON; en iOS/Android abre la hoja de compartir. */
export async function shareExport(payload: ExportPayload): Promise<Result<void>> {
  if (Platform.OS === 'web') return shareExportOnWeb(payload);
  return shareExportOnNative(payload);
}
