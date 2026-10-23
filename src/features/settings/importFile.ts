/* eslint-disable @typescript-eslint/no-require-imports -- File nativo se carga solo fuera de web. */
import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';

import type { ExportPayload } from '@/data/export/exportData';
import { parseImportPayload } from '@/data/export/importData';
import { err, ioError, ok, type Result } from '@/domain/errors/result';

const MAX_FILE_BYTES = 10_000_000;

export async function pickImportFile(): Promise<Result<ExportPayload | null>> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/json', 'text/json', 'text/plain'],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) return ok(null);

    const asset = result.assets[0];
    if (!asset) return ok(null);

    if (asset.size !== undefined && asset.size > MAX_FILE_BYTES) {
      return err(ioError('El archivo es demasiado grande'));
    }

    let text: string;
    if (Platform.OS === 'web') {
      text = asset.file ? await asset.file.text() : await (await fetch(asset.uri)).text();
    } else {
      const { File } = require('expo-file-system') as typeof import('expo-file-system');
      text = await new File(asset.uri).text();
    }

    return parseImportPayload(text);
  } catch (error) {
    return err(ioError('No se pudo leer el archivo', error));
  }
}
