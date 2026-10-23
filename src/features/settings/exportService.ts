import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import type { Repositories } from '@/data/repositories/types';
import { buildExportPayload, serializeExport, type ExportPayload } from '@/data/export/exportData';
import type { UserProfile } from '@/domain/entities/types';
import { err, ioError, ok, type Result } from '@/domain/errors/result';

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

/** Escribe el JSON en la caché y abre la hoja de compartir del sistema. */
export async function shareExport(payload: ExportPayload): Promise<Result<void>> {
  try {
    const file = new File(Paths.cache, 'suma-export-' + payload.exportedAt.slice(0, 10) + '.json');
    file.create({ overwrite: true });
    await file.write(serializeExport(payload));

    if (!(await Sharing.isAvailableAsync())) {
      return err(ioError('Compartir no está disponible en este dispositivo'));
    }

    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: 'Exportar datos de SUMA',
    });

    return ok(undefined);
  } catch (error) {
    return err(ioError('No se pudo generar el archivo de exportación', error));
  }
}
