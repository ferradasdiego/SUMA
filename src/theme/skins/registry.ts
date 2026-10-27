import { classicSkin } from './classic';
import { kawaiiSkin } from './kawaii';
import type { Skin } from './types';

export const SKINS: Readonly<Record<Skin['id'], Skin>> = {
  classic: classicSkin,
  kawaii: kawaiiSkin,
};

/** Orden de presentación en Ajustes. */
export const SKIN_LIST: readonly Skin[] = [classicSkin, kawaiiSkin];

export function getSkin(id: Skin['id'] | null | undefined): Skin {
  return (id && SKINS[id]) || classicSkin;
}
