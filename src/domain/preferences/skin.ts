/**
 * Skins visuales seleccionables. El identificador se persiste en el perfil,
 * por lo que debe ser estable y validarse al leer y al importar datos.
 */
export const SKIN_IDS = ['classic', 'kawaii'] as const;

export type SkinId = (typeof SKIN_IDS)[number];

export const DEFAULT_SKIN: SkinId = 'classic';

export function isSkinId(value: unknown): value is SkinId {
  return typeof value === 'string' && (SKIN_IDS as readonly string[]).includes(value);
}
