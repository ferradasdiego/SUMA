import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';

import { DEFAULT_SKIN, type SkinId } from '@/domain/preferences/skin';

import { getSkin } from './skins/registry';
import { classicSkin } from './skins/classic';
import type { Skin, SkinColors, SkinComponents, SkinIllustration, SkinRadii } from './skins/types';

export interface Theme {
  readonly skin: Skin;
  readonly colors: SkinColors;
  readonly categoryColors: Skin['categoryColors'];
  readonly categoryTones: Skin['categoryTones'];
  readonly typography: Skin['typography'];
  readonly radii: SkinRadii;
  readonly components: SkinComponents;
  readonly illustration: SkinIllustration | null;
}

function buildTheme(skin: Skin): Theme {
  return {
    skin,
    colors: skin.colors,
    categoryColors: skin.categoryColors,
    categoryTones: skin.categoryTones,
    typography: skin.typography,
    radii: skin.radii,
    components: skin.components,
    illustration: skin.illustration,
  };
}

const fallbackTheme = buildTheme(classicSkin);

const ThemeContext = createContext<Theme>(fallbackTheme);

export interface ThemeProviderProps {
  readonly skinId?: SkinId | null;
  readonly children: ReactNode;
}

export function ThemeProvider({ skinId, children }: ThemeProviderProps) {
  const theme = useMemo(() => buildTheme(getSkin(skinId ?? DEFAULT_SKIN)), [skinId]);

  // En web, sincroniza el fondo del documento y la barra de estado de la PWA
  // con la skin activa (evita el flash blanco en la skin kawaii).
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const background = theme.colors.background;
    document.documentElement.style.setProperty('--suma-bg', background);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', background);
  }, [theme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

/**
 * Tokens de la skin activa. Fuera del proveedor devuelve la skin clásica,
 * lo que mantiene los tests de componentes aislados y los estados de arranque.
 */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}
